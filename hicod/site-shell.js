/* Shared project navigation, no external assets. */
document.addEventListener("DOMContentLoaded",()=>{
 const current=location.pathname.replace(/\/index\.html$/,"/"),nav=document.querySelector("header.top nav");
 if(nav)for(const a of nav.querySelectorAll("a[href]")){const u=new URL(a.href,location.href);if(u.origin===location.origin&&!u.hash&&u.pathname.replace(/\/index\.html$/,"/")===current)a.setAttribute("aria-current","page");}
 const main=document.querySelector("main");if(main&&!main.id)main.id="main-content";
 const link=document.createElement("a");link.className="skip-link";link.href="#"+(main?.id||"top");link.textContent=window.HiCoD?.lang==="zh"?"跳转至主要内容":"Skip to content";document.body.prepend(link);
});
