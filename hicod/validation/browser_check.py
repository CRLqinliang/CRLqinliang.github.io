"""Real Chromium acceptance checks against a locally served checkout, not production Pages."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

base=os.environ.get("HICOD_BASE_URL","http://127.0.0.1:8765/hicod/")
out=Path(os.environ.get("HICOD_VALIDATION_OUT","/tmp/hicod-validation"))
out.mkdir(parents=True,exist_ok=True)
pages=["index.html","graph.html","physical.html","multimodal.html","agent.html","benchmark.html","validation.html","atlas.html"]
rows=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for name in pages:
        for lang in ("en","zh"):
            for device,viewport in (("desktop",{"width":1440,"height":950}),("mobile",{"width":390,"height":844})):
                ctx=browser.new_context(viewport=viewport,locale="zh-CN" if lang=="zh" else "en-US")
                page=ctx.new_page();errors=[];failed=[]
                page.on("pageerror",lambda e: errors.append(str(e)))
                page.on("requestfailed",lambda r: failed.append({"url":r.url,"reason":r.failure}))
                checks={};detail=None
                try:
                    response=page.goto(base+name+"?lang="+lang,wait_until="domcontentloaded",timeout=30000)
                    checks["http_ok"]=bool(response and response.ok)
                    page.locator(".lang-switch").wait_for(timeout=10000)
                    checks["language"]=page.locator("html").get_attribute("lang")==("zh-CN" if lang=="zh" else "en")
                    checks["theme"]=page.locator("link[href='theme.css']").count()==1
                    checks["navigation"]=page.locator("header nav a[href*='benchmark.html']").count()>0
                    if name=="index.html":
                        page.locator("#witness-player [data-status]").wait_for()
                        page.wait_for_function("document.querySelector('#witness-player [data-status]').textContent.length > 0")
                        v=page.locator(".primary-video video")
                        checks["video_visible"]=v.is_visible()
                        page.wait_for_function("document.querySelector('.primary-video video').readyState >= 1",timeout=15000)
                        checks["video_metadata"]=v.evaluate("(v)=> Number.isFinite(v.duration)&&v.duration>0")
                        checks["video_duration_s"]=v.evaluate("(v)=>v.duration")
                    elif name=="graph.html":
                        page.wait_for_function("document.querySelector('#detail h2')?.textContent.length > 0")
                        checks["graph_populated"]=page.locator("#nodes button").count()>=60
                        page.locator("#search").fill("C02")
                        page.locator("#nodes button").filter(has_text="C02 ·").first.click()
                        checks["concept_selection"]="C02" in page.locator("#detail").inner_text()
                        if lang=="zh":checks["translated_definition"]="中间位姿" in page.locator("#detail").inner_text()
                    elif name=="physical.html":
                        page.wait_for_function("document.querySelectorAll('#matrix button').length > 0")
                        checks["matrix"]=page.locator("#matrix button").count()==272
                        page.locator("#matrix button").first.click()
                        checks["probe_selected"]=bool(page.locator("#probe-label").inner_text())
                    elif name=="multimodal.html":
                        page.wait_for_function("document.querySelectorAll('#bridge-grid button').length > 0")
                        checks["bridge_grid"]=page.locator("#bridge-grid button").count()==17
                        page.locator("#support").select_option("none")
                        page.wait_for_function("document.querySelector('#claim').textContent.length > 0")
                        checks["support_change"]=page.locator("#metrics article").count()==4
                    elif name=="agent.html":
                        page.wait_for_function("document.querySelectorAll('#agent-history details').length > 0")
                        page.locator("#concept").select_option("C05")
                        page.locator("#query").click()
                        checks["agent_query"]=page.locator("#agent-history details").count()>=2 and "minimum_graph_cost" in page.locator("#agent-history details").first.inner_text()
                    elif name=="benchmark.html":
                        page.wait_for_function("document.querySelectorAll('#history details').length > 0")
                        checks["benchmark_ready"]=page.locator("#profile option").count()==6 and page.locator("#task option").count()==32
                        page.locator("#abstain").click()
                        checks["scored_episode"]=page.locator("#score").is_visible()
                    elif name=="atlas.html":
                        page.wait_for_function("document.querySelectorAll('#atlas-gallery .atlas-card').length === 60")
                        checks["all_nodes"]=page.locator("#global-network .global-node").count()==75
                        checks["all_edges"]=page.locator("#global-network .global-edge").count()==304
                        page.locator("#global-search").fill("B05")
                        page.locator("#global-find").click()
                        checks["selection"]="B05" in page.locator("#global-detail").inner_text()
                        if lang=="zh":checks["translated"]="抓取" in page.locator("#global-detail").inner_text()
                    elif name=="validation.html":
                        page.wait_for_function("document.querySelectorAll('.validation-status article').length >= 3")
                        checks["status_dashboard"]=True
                    page.screenshot(path=str(out/(name.replace(".html","")+"-"+lang+"-"+device+".png")),full_page=False,timeout=15000)
                    checks["no_horizontal_overflow"]=page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2")
                except Exception as e:
                    detail=str(e)[:500]
                boolean_checks=[v for v in checks.values() if isinstance(v,bool)]
                rows.append({"page":name,"lang":lang,"device":device,"passed":detail is None and all(boolean_checks) and not errors,"checks":checks,"page_errors":errors,"failed_requests":failed[:10],"error":detail})
                ctx.close()
    browser.close()
result={"status":"passed" if all(r["passed"] for r in rows) else "completed_with_failures","source_commit":os.getenv("GITHUB_SHA","local"),"scope":"Real headless Chromium on locally served repository files. Desktop/mobile CN/EN, dynamic interactions, native MP4 metadata, viewport overflow. Production Pages deployment is not certified.","cases":len(rows),"passed":sum(r["passed"] for r in rows),"rows":rows}
(out/"browser.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps({k:v for k,v in result.items() if k!="rows"},indent=2))
if result["status"]!="passed":sys_exit=1;raise SystemExit(sys_exit)
