// Randomized geometry distribution, no filtering by answer label.
function generateHoldout(base,settings,count,seed){
 if(!Number.isSafeInteger(count)||count<1||count>64||!Number.isSafeInteger(seed)||seed<0||seed>0xffffffff)throw Error("count 1–64 and uint32 seed required");
 let x=seed>>>0;const rng=()=>{x=(x+0x6D2B79F5)>>>0;let z=x;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return ((z^(z>>>14))>>>0)/4294967296;},uniform=(a,b)=>a+(b-a)*rng(),round=v=>Math.round(v*10000)/10000;
 return Array.from({length:count},(_,i)=>{const id="H"+String(i+1).padStart(3,"0"),model={...base.model,lengths:base.model.lengths.map(v=>round(v*uniform(.9,1.1))),object_radius:round(uniform(.035,.065))},path=[[round(uniform(.40,.51)),round(uniform(-.31,-.22)),0],[round(uniform(.42,.54)),round(uniform(.22,.34)),0]],obstacles=Array.from({length:2},()=>({center:[round(uniform(.12,.56)),round(uniform(-.22,.22))],radius:round(uniform(.035,.085))}));return {id,split:"private_holdout",scene:{...base,name:id,model,path,obstacles},allowed_support:[...settings.support_stages],actions:[{id:"reference",kind:"reference"},...settings.support_stages.map(stage=>({id:"r"+stage,kind:"regrasp",stage})),...settings.offsets.map((offset_m,j)=>({id:"d"+j,kind:"deform",offset_m:[...offset_m]}))]};});
}
export {generateHoldout};
