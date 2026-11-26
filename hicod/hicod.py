"""Small solver-independent sampled-graph concept engine (MIT)."""
from collections import deque
from dataclasses import dataclass, asdict
from typing import Callable
import numpy as np

Point = tuple[int, int]

@dataclass
class Report:
    concept: str
    claim: str
    status: str
    scope: dict
    evidence: dict
    children: list

    def to_dict(self):
        return asdict(self)

def analyze_grid(xs, ys, feasible: Callable[[float, float], bool], start: Point, goal: Point):
    """Evaluate a finite graph. Edges checked at 1/4, 1/2, 3/4 only."""
    nx, ny = len(xs), len(ys)
    free = {(i,j): bool(feasible(float(x),float(y))) for i,x in enumerate(xs) for j,y in enumerate(ys)}
    adj = {p: [] for p,ok in free.items() if ok}
    for i,j in adj:
        for a,b in ((i+1,j),(i,j+1)):
            if (a,b) not in adj:
                continue
            if all(feasible(float((1-t)*xs[i]+t*xs[a]),float((1-t)*ys[j]+t*ys[b])) for t in (.25,.5,.75)):
                adj[i,j].append((a,b))
                adj[a,b].append((i,j))
    seen=set()
    parent={}
    def visit(root, record=False):
        queue=deque([root])
        seen.add(root)
        if record:
            parent[root]=None
        while queue:
            p=queue.popleft()
            for v in adj[p]:
                if v not in seen:
                    seen.add(v)
                    queue.append(v)
                    if record:
                        parent[v]=p
    components=0
    if start in adj:
        visit(start, True)
        components+=1
    path=[]
    if goal in parent:
        p=goal
        while p is not None:
            path.append(p)
            p=parent[p]
        path.reverse()
    for p in adj:
        if p not in seen:
            visit(p)
            components+=1
    n=len(free)
    return {"total_samples":n,"feasible_samples":len(adj),"feasible_ratio":len(adj)/n,
            "components":components,"endpoint_compatible":start in adj and goal in adj,
            "graph_connected":bool(path),"path_xy":[[float(xs[i]),float(ys[j])] for i,j in path],
            "edge_count":sum(map(len,adj.values()))//2}

def report_modes(results, scope):
    connected=[name for name,r in results.items() if r["graph_connected"]]
    compatible=[name for name,r in results.items() if r["endpoint_compatible"]]
    children=[Report("endpoint_compatibility","Modes admissible at both endpoints in the sampled model.",
                     "SAMPLED_FACT",scope,{"modes":compatible},[]).to_dict()]
    for name,r in results.items():
        children.append(Report("mode_connectivity",
            "Sampled path found." if r["graph_connected"] else "No path found in sampled graph; continuous feasibility unknown.",
            "GRAPH_WITNESS" if r["graph_connected"] else "UNKNOWN_CONTINUOUS",
            dict(scope,mode=name),r,
            [Report("sample_feasibility","Feasible count and ratio under the specified grid.",
                "SAMPLED_FACT",scope,{k:r[k] for k in ("total_samples","feasible_samples","feasible_ratio")},[]).to_dict(),
             Report("connected_components","Component count of sampled graph.","SAMPLED_FACT",scope,
                    {"components":r["components"],"edge_count":r["edge_count"]},[]).to_dict()]).to_dict())
    return Report("transport_structure",
        ("Sampled connected modes: "+", ".join(connected)) if connected else
        "No sampled fixed mode connects endpoints; consider additional probes or permitted mode changes.",
        "GRAPH_WITNESS" if connected else "UNKNOWN_CONTINUOUS",
        scope,{"connected_modes":connected,"compatible_modes":compatible},children)
