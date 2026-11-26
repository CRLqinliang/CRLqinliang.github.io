"""Read-only HiCoD knowledge graph; no physical probes are executed."""
import argparse
import json
from pathlib import Path

DEFAULT = Path(__file__).with_name("concept_graph.json")

class ConceptGraph:
    def __init__(self, path=DEFAULT):
        self.data = json.loads(Path(path).read_text(encoding="utf-8"))
        nodes = self.data["concepts"] + self.data["primitives"]
        self.nodes = {n["id"]: n for n in nodes}
        if len(self.nodes) != len(nodes):
            raise ValueError("Duplicate concept IDs")

    def validate(self):
        if len(self.data["concepts"]) != 60:
            raise ValueError("Expected 60 L4 entries")
        refs = self.data["references"]
        expected = set()
        for key, n in self.nodes.items():
            for kind in ("requires", "specializes", "diagnostic_related"):
                for dep in n[kind]:
                    if dep not in self.nodes or dep == key:
                        raise ValueError(f"Invalid edge {key} {kind} {dep}")
                    expected.add((key, dep, kind))
            for ref in n["references"]:
                if ref not in refs:
                    raise ValueError(f"Unknown reference {ref}")
            if n["level"] == 4:
                for field in ("definition", "formalization", "evaluator", "required_inputs", "limitations", "references"):
                    if not n.get(field):
                        raise ValueError(f"Missing {key}.{field}")
        actual = {(e["source"], e["target"], e["type"]) for e in self.data["edges"]}
        if expected != actual or len(actual) != len(self.data["edges"]):
            raise ValueError("Edge index mismatch")
        seen, active = set(), set()
        def visit(key):
            if key in active:
                raise ValueError(f"Dependency cycle: {key}")
            if key in seen:
                return
            active.add(key)
            for dep in self.nodes[key]["requires"]:
                visit(dep)
            active.remove(key)
            seen.add(key)
        for key in self.nodes:
            visit(key)
        return {"L4": len(self.data["concepts"]), "evidence_interfaces": len(self.data["primitives"]), "edges": len(actual), "sources": len(refs), "dependency_DAG": True}

    def show(self, key):
        n = self.nodes[key]
        return {**n, "sources": {r: self.data["references"][r] for r in n["references"]},
                "used_by": [k for k, item in self.nodes.items() if key in item["requires"]]}

    def trace(self, key):
        seen = set()
        def walk(k):
            if k in seen:
                return
            seen.add(k)
            for dep in self.nodes[k]["requires"]:
                walk(dep)
        walk(key)
        return {"root": key, "nodes": [self.show(k) for k in sorted(seen)],
                "edges": [e for e in self.data["edges"] if e["type"] == "requires" and e["source"] in seen],
                "status": "definition_only", "note": "Evidence requirements only. No physical evaluation performed."}

if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("action", choices=["validate", "show", "trace"])
    p.add_argument("id", nargs="?")
    a = p.parse_args()
    g = ConceptGraph()
    if a.action != "validate" and a.id not in g.nodes:
        p.error("show/trace require a valid concept ID")
    print(json.dumps(g.validate() if a.action == "validate" else getattr(g, a.action)(a.id), ensure_ascii=False, indent=2))
