/* Original HiCoD teaching schematics, not reproduced experimental data. */
(function(){
const ns="http://www.w3.org/2000/svg",zh=()=>window.HiCoD?.lang==="zh",t=(a,b)=>zh()?b:a;
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function svg(tag,attrs={}){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}
const colors={blue:"#397ab4",green:"#148271",amber:"#bd8035",gray:"#aebcc7",ink:"#233c54",red:"#bb6456"};
function draw(spec,id){
 const s=svg("svg",{viewBox:"0 0 400 178",role:"img","aria-label":spec.explanation[zh()?"zh":"en"],class:"concept-schematic"}),l=spec.labels[zh()?"zh":"en"],c=colors;
 function add(tag,a){const e=svg(tag,a);s.append(e);return e;}
 function text(x,y,str,size=11,color=c.ink,anchor="middle"){const e=add("text",{x,y,"font-size":size,fill:color,"text-anchor":anchor,"font-family":"system-ui,sans-serif","font-weight":500});e.textContent=str;}
 function box(x,y,w,h,fill,stroke=c.gray,rx=6){add("rect",{x,y,width:w,height:h,rx,fill,stroke,"stroke-width":1.2});}
 function circle(x,y,r,fill,stroke=fill){add("circle",{cx:x,cy:y,r,fill,stroke,"stroke-width":1.4});}
 function line(x1,y1,x2,y2,col=c.gray,dash="",width=2){add("line",{x1,y1,x2,y2,stroke:col,"stroke-width":width,"stroke-dasharray":dash,"stroke-linecap":"round"});}
 function path(d,col=c.blue,dash="",w=2.8){add("path",{d,stroke:col,fill:"none","stroke-width":w,"stroke-dasharray":dash,"stroke-linecap":"round","stroke-linejoin":"round"});}
 function arrow(x1,y1,x2,y2,col=c.blue){line(x1,y1,x2,y2,col);const a=Math.atan2(y2-y1,x2-x1);path("M"+(x2-7*Math.cos(a-.5))+" "+(y2-7*Math.sin(a-.5))+" L"+x2+" "+y2+" L"+(x2-7*Math.cos(a+.5))+" "+(y2-7*Math.sin(a+.5)),col,"",1.8);}
 box(1,1,398,176,"#f5f8fb","#e1e8ef",9);
 const type=spec.type;
 if(type==="sets"||type==="disjoint"){
  if(id==="J01"){add("ellipse",{cx:200,cy:74,rx:106,ry:55,fill:"#dcebf6",stroke:c.blue});add("ellipse",{cx:200,cy:74,rx:51,ry:26,fill:"#bce6d9",stroke:c.green});text(200,33,l[0]);text(200,78,l[1]);}
  else{const d=type==="disjoint"?91:50;add("ellipse",{cx:200-d,cy:74,rx:74,ry:48,fill:"#397ab42a",stroke:c.blue});add("ellipse",{cx:200+d,cy:74,rx:74,ry:48,fill:"#1482712a",stroke:c.green});text(200-d,22,l[0]);text(200+d,22,l[1]);if(type!=="disjoint")circle(200,74,6,c.green);else text(200,80,"∅",23,c.red);}
  text(200,151,l[2],12,c.green);
 }else if(type==="matrix"||type==="product"){
  const k=Number(id.slice(1))||1;for(let i=0;i<5;i++)for(let j=0;j<8;j++){const yes=type==="product"?(i<4&&j>1&&j<7):((i*7+j*3+k)%11<5||i===j%5);box(88+j*27,32+i*20,23,16,yes?"#bce3d7":"#e1e8ed",yes?"#4b9d8e":"#d1dbe3",2);}
  text(200,19,l[1]);text(17,84,l[0],10,c.ink,"start");text(200,155,l[2],12,c.green);
 }else if(type==="layers"||type==="switch"){
  const sw=type==="switch";for(let i=0;i<6;i++){const x=57+i*57;for(let j=0;j<2;j++)circle(x,47+j*58,5,j?c.green:c.blue);}
  for(let i=0;i<5;i++){const x=57+i*57;line(x+5,47,x+52,47,i===2?c.red:c.blue,i===2?"5 5":"");line(x+5,105,x+52,105,sw&&i===1?c.red:c.green,sw&&i===1?"5 5":"");}
  if(sw)arrow(171,55,171,97,c.amber);else line(171,40,171,112,c.gray,"3 4",1);
  text(57,22,l[0],10,c.blue);text(342,127,l[1],10,c.green);text(200,155,l[2],12,sw?c.amber:c.green);
 }else if(type==="paths"||type==="paths2"||type==="narrow"){
  circle(35,79,6,c.blue);circle(365,79,6,c.green);
  if(type==="narrow"){box(145,17,110,44,"#aebcc7","#8d9eaa",3);box(145,99,110,44,"#aebcc7","#8d9eaa",3);path("M35 79 C110 79 150 80 200 80 S300 79 365 79",c.green);line(200,61,200,99,c.amber,"4 3");}
  else{circle(200,79,39,"#bfcbd5","#8d9eaa");path("M35 79 Q100 13 200 22 T365 79",c.green);if(type==="paths2")path("M35 79 Q100 145 200 136 T365 79",c.blue,"5 3");else path("M35 79 L365 79",c.red,"5 5",1.5);}
  text(35,104,l[0],10);text(365,104,l[2],10);text(200,161,l[1],12,c.amber);
 }else if(type==="network"||type==="cycle"){
  if(type==="cycle"){circle(105,76,23,"#dcebf6",c.blue);circle(295,76,23,"#cce9e1",c.green);path("M128 63 Q200 5 272 63",c.blue);path("M272 89 Q200 148 128 89",c.red);arrow(255,49,272,63,c.blue);arrow(145,103,128,89,c.red);text(105,80,"A",14);text(295,80,"B",14);}
  else{for(const y of [46,109]){line(48,78,150,y,c.blue);line(150,y,250,y,c.blue);line(250,y,352,78,c.green);circle(150,y,9,"#dcebf6",c.blue);circle(250,y,9,"#cce9e1",c.green);}circle(48,78,10,c.blue);circle(352,78,10,c.green);if(id==="D03"||id==="H06")line(200,20,200,136,c.red,"4 4",2);}
  text(48,20,l[0],10);text(352,20,l[2],10);text(200,158,l[1],12,c.amber);
 }else if(type==="curve"){
  line(42,134,370,134,c.gray);line(42,134,42,18,c.gray);path("M45 57 Q95 36 147 66 T228 101 T367 47",c.blue);line(220,20,220,134,c.gray,"4 4",1);circle(220,98,5,c.amber);text(48,16,l[1],10,c.ink,"start");text(200,154,l[0],11);text(300,116,l[2],11,c.amber);
 }else{
  box(38,55,324,43,"#e2e8ed","#c6d2dc",4);box(115,55,164,43,"#c3e7dc",c.green,4);
  for(let i=0;i<13;i++)circle(48+i*25,76,3.7,i>=3&&i<=9?c.green:c.gray);
  text(200,35,l[0]);text(197,119,l[1],11,c.green);text(200,154,l[2],12);
 }
 return s;
}
function render(container,id,atlas,registry,compact=false){
 container.replaceChildren();const spec=atlas?.nodes[id];if(!spec)return;
 const figure=el("figure",undefined,"original-illustration");figure.append(el("div",t("Original HiCoD schematic · illustrative, not measured","HiCoD 原创示意 · 非实验数据"),"visual-kicker"),draw(spec,id),el("figcaption",spec.explanation[zh()?"zh":"en"]));container.append(figure);
 const header=el("h4",t("Literature figure evidence","文献原图及出处"));container.append(header);
 if(!spec.figures.length){container.append(el("p",t("Exact figure still to be curated. The schematic above is not a paper crop.","尚待核查准确的论文图号；上方为原创示意，并非论文截图。"),"fine"));const refs=el("div",undefined,"figure-source-links");for(const key of spec.source_refs){const r=registry.references[key];if(!r)continue;const a=el("a",r.citation);a.href=r.url;a.target="_blank";a.rel="noopener";refs.append(a);}container.append(refs);return;}
 for(const key of spec.figures){const f=atlas.figures[key],r=registry.references[f.ref],block=el("figure",undefined,"paper-figure");block.append(el("div",f.number+" · "+r.citation,"visual-kicker"));
 if(f.image&&!compact){const a=el("a");a.href=f.page;a.target="_blank";a.rel="noopener";const img=el("img");img.loading="lazy";img.alt=f[zh()?"zh":"en"];img.src="literature/"+key+".gif";img.addEventListener("error",()=>{if(!img.dataset.remote){img.dataset.remote="1";img.src=f.image;}else{img.remove();a.textContent=t("Original image unavailable — open source figure ↗","原图暂无法加载——打开来源图 ↗");} });a.append(img);block.append(a);}
 block.append(el("figcaption",f[zh()?"zh":"en"]));
 const links=el("div",undefined,"figure-source-links"),a=el("a",t("View original figure ↗","查看论文原图 ↗"));a.href=f.page;a.target="_blank";a.rel="noopener";links.append(a);if(f.license_url){const licence=el("a",f.license);licence.href=f.license_url;licence.target="_blank";licence.rel="noopener";links.append(licence);}else links.append(el("span",f.license,"fine"));block.append(links);container.append(block);
 }
}
window.HiCoDVisuals={draw,render};
})();