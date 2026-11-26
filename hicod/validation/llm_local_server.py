"""Local CPU-only real-model endpoint; no paid API or remote inference.
Loads public Qwen weights. No credentials, and no model calls outside this process.
"""
import argparse,json,os,time
from http.server import BaseHTTPRequestHandler,HTTPServer
from pathlib import Path
import torch
from transformers import AutoModelForCausalLM,AutoTokenizer

p=argparse.ArgumentParser();p.add_argument("--model",default="Qwen/Qwen2.5-0.5B-Instruct");p.add_argument("--port",type=int,default=8772);p.add_argument("--meta",type=Path,required=True);a=p.parse_args()
torch.set_num_threads(min(4,os.cpu_count() or 2));torch.manual_seed(0)
tok=AutoTokenizer.from_pretrained(a.model)
model=AutoModelForCausalLM.from_pretrained(a.model,torch_dtype=torch.float32).eval()
revision=getattr(model.config,"_commit_hash",None)
meta={"model":a.model,"model_revision":revision,"torch":torch.__version__,"backend":"transformers CPU float32","source":"public pretrained weights, no remote inference"}
a.meta.write_text(json.dumps(meta,indent=2))
class Handler(BaseHTTPRequestHandler):
    def respond(self,status,obj):
        data=json.dumps(obj).encode();self.send_response(status);self.send_header("Content-Type","application/json");self.send_header("Content-Length",str(len(data)));self.end_headers();self.wfile.write(data)
    def do_GET(self):
        self.respond(200,meta) if self.path=="/health" else self.respond(404,{"error":"not found"})
    def do_POST(self):
        try:
            if self.path!="/v1/chat/completions":self.respond(404,{"error":"not found"});return
            length=int(self.headers.get("Content-Length","0"))
            if length<1 or length>4_000_000:raise ValueError("invalid request length")
            req=json.loads(self.rfile.read(length))
            ids=tok.apply_chat_template(req["messages"],tokenize=True,add_generation_prompt=True,return_tensors="pt")
            if ids.shape[1]>30000:raise ValueError("context too long")
            limit=min(128,int(req.get("max_tokens",req.get("max_completion_tokens",96))))
            with torch.inference_mode():
                output=model.generate(input_ids=ids,attention_mask=torch.ones_like(ids),max_new_tokens=limit,do_sample=False,pad_token_id=tok.eos_token_id)
            new=output[0,ids.shape[1]:];content=tok.decode(new,skip_special_tokens=True)
            usage={"prompt_tokens":int(ids.shape[1]),"completion_tokens":int(new.shape[0]),"total_tokens":int(output.shape[1])}
            self.respond(200,{"choices":[{"message":{"content":content}}],"usage":usage})
        except Exception as e:self.respond(500,{"error":str(e)[:200]})
    def log_message(self,*args):pass
HTTPServer(("127.0.0.1",a.port),Handler).serve_forever()
