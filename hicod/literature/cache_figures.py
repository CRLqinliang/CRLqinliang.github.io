"""Fetch only the reviewed, explicitly licensed figure assets in concept_visuals.json.
No restricted sources, no synthetic substitution. Report actual asset retrieval.
"""
import json,io,time,hashlib
from pathlib import Path
import urllib.request
from PIL import Image
import fitz
root=Path(__file__).resolve().parent
data=json.loads((root.parent/"concept_visuals.json").read_text())
def fetch(url):
    request=urllib.request.Request(url,headers={"User-Agent":"HiCoD research figure cache/1.0 (public academic project)"})
    with urllib.request.urlopen(request,timeout=35) as r:
        content=r.read(35_000_001)
    if len(content)>35_000_000:raise ValueError("Asset too large")
    return content
results=[]
for key,f in data["figures"].items():
    if not f.get("local_file"):continue
    dest=root/f["local_file"]
    row={"id":key,"source":f["page"],"license":f["license"],"file":dest.name}
    try:
        if f.get("pdf_crop"):
            c=f["pdf_crop"];pdf=fetch(c["url"])
            with fitz.open(stream=pdf,filetype="pdf") as doc:
                page=doc[c["page_index"]]
                x0,y0,x1,y1=c["relative_rect"];w,h=page.rect.width,page.rect.height
                clip=fitz.Rect(x0*w,y0*h,x1*w,y1*h)
                image=page.get_pixmap(matrix=fitz.Matrix(2.5,2.5),clip=clip,alpha=False).tobytes("png")
            row["change"]="Figure crop from page 2, arXiv v5"
        else:
            image=fetch(f["image"])
            row["change"]="Unmodified publisher figure"
        with Image.open(io.BytesIO(image)) as im:
            im.verify()
        with Image.open(io.BytesIO(image)) as im:
            row["width"],row["height"]=im.size
            if row["width"]<120 or row["height"]<70:raise ValueError("Unexpected small asset")
        dest.write_bytes(image)
        row.update(status="cached",bytes=len(image),sha256=hashlib.sha256(image).hexdigest())
    except Exception as exc:
        row.update(status="unavailable",error=str(exc)[:250])
    results.append(row)
(root/"cache_status.json").write_text(json.dumps({"results":results,"scope":"Downloaded or cropped licensed source images; unavailable assets remain links."},indent=2)+"\n")
print(json.dumps(results,indent=2))
