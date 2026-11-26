const cn=window.HiCoD?.lang==="zh",t=(en,zh)=>cn?zh:en;
const root=document.getElementById("witness-player");
if(root){
const canvas=root.querySelector("canvas"),ctx=canvas.getContext("2d"),seek=root.querySelector("input[type=range]"),play=root.querySelector("[data-play]"),status=root.querySelector("[data-status]"),video=root.querySelector("video"),videoStatus=root.querySelector("[data-video-status]");
const response=await fetch(new URL("./regrasp_witness.json",import.meta.url));if(!response.ok)throw Error("Witness unavailable");const data=await response.json(),frames=data.frames,s=data.scene;
let i=0,running=false,last=0,raf=0;seek.max=frames.length-1;
const phase={transfer:t("Attached transfer","持物搬运"),retreat:t("Release / retreat","释放／退离"),transit:t("Empty-arm transit","空手运动"),approach:t("Approach / reacquisition","接近／重新连接")};
function draw(){const f=frames[i],w=canvas.width,h=canvas.height,scale=365,X=x=>125+x*scale,Y=y=>h*.54-y*scale;ctx.fillStyle="#f5f8fa";ctx.fillRect(0,0,w,h);ctx.strokeStyle="#e0e7ec";ctx.lineWidth=1;for(let x=-.3;x<=1;x+=.1){ctx.beginPath();ctx.moveTo(X(x),0);ctx.lineTo(X(x),h);ctx.stroke();}for(let y=-.6;y<=.6;y+=.1){ctx.beginPath();ctx.moveTo(0,Y(y));ctx.lineTo(w,Y(y));ctx.stroke();}
function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(X(x),Y(y),r*scale,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
ctx.strokeStyle="#467caa";ctx.setLineDash([7,5]);ctx.lineWidth=2;ctx.beginPath();s.path.forEach((p,j)=>j?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));ctx.stroke();ctx.setLineDash([]);
for(const o of s.obstacles)circle(...o.center,o.radius,"#a9b8c4","#62778a");circle(f.pose[0],f.pose[1],s.model.object_radius,"#dfb071","#96662e");
if(f.phase!=="transfer"){ctx.strokeStyle="#16806e";ctx.lineWidth=2;ctx.strokeRect(X(f.pose[0])-.06*scale,Y(f.pose[1])-.06*scale,.12*scale,.12*scale);}
ctx.lineCap="round";for(let j=0;j<3;j++){const a=f.points[j],b=f.points[j+1];ctx.strokeStyle=f.phase==="transfer"?"#356e9b":"#16806e";ctx.lineWidth=2*s.model.link_radius*scale;ctx.beginPath();ctx.moveTo(X(a[0]),Y(a[1]));ctx.lineTo(X(b[0]),Y(b[1]));ctx.stroke();}for(const p of f.points)circle(...p,.012,"#e8f1f7","#356e9b");
ctx.fillStyle="#183346";ctx.font="600 17px system-ui";ctx.fillText(phase[f.phase],15,25);ctx.font="12px system-ui";ctx.fillText(t("Analytic sampled witness — not MuJoCo","解析采样路径见证（非 MuJoCo）"),15,h-16);
seek.value=i;status.textContent=(i+1)+"/"+frames.length+" · "+phase[f.phase]+" · "+f.evidence_id;}
function tick(now){if(!running)return;if(now-last>=80){i=(i+1)%frames.length;last=now;draw();}raf=requestAnimationFrame(tick);}
function pause(){running=false;cancelAnimationFrame(raf);play.textContent=t("Play","播放");}
play.addEventListener("click",()=>{if(running)pause();else{running=true;play.textContent=t("Pause","暂停");last=performance.now();raf=requestAnimationFrame(tick);}});seek.addEventListener("input",()=>{pause();i=Number(seek.value);draw();});draw();
// A separate MuJoCo-generated MP4 is shown only when a real media file is playable.
video.addEventListener("loadeddata",()=>{video.hidden=false;videoStatus.textContent=t("MuJoCo kinematic replay (not dynamics validation).","MuJoCo 运动学回放（并非动力学验证）。");});
video.addEventListener("error",()=>{video.hidden=true;videoStatus.textContent=t("MuJoCo MP4 is not published yet. Use the analytic player above.","MuJoCo MP4 尚未发布。请使用上方解析演示。");});
video.src="https://raw.githubusercontent.com/CRLqinliang/CRLqinliang.github.io/master/hicod/media/mujoco_regrasp.mp4";
}
