import{a as G}from"./chunk-2E747FT2.js";import{a as h}from"./chunk-JOAAZ5FA.js";import{a as B,c as U}from"./chunk-3RMD5I77.js";import"./chunk-WCY7IYX7.js";import{a as O,c as P}from"./chunk-SST5BRB6.js";import{Ba as R,D as l,E as p,Ha as f,Ja as C,Na as L,O as c,Oa as F,P as d,S as k,Sb as T,Ua as z,V as D,Vb as V,X as S,Z as m,_ as u,bb as E,ca as b,fc as j,ga as M,gc as _,ha as v,j as y,ka as A,oa as n,pa as o,qa as a,ta as I,za as s}from"./chunk-AQTOR5VK.js";var x=class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=p({type:t,selectors:[["paimon-releases"]],standalone:!0,features:[f],decls:6,vars:0,consts:[["header",""],[1,"mt-16","text-6xl","font-normal","text-paimon-gray-3"],["content",""]],template:function(e,r){e&1&&(n(0,"paimon-page-container")(1,"div",0)(2,"div",1),s(3,"Releases"),o()(),n(4,"div",2),a(5,"router-outlet"),o()())},dependencies:[V,U],encapsulation:2,changeDetection:0})}};var H=(t,i)=>{let e=l(j),r=l(h),N=e.parseUrl(i.url);return r.listRelease().pipe(y(()=>{let w=N.root.children.primary.segments;return w.length===2&&r.releases.has(w[1].path)?!0:e.createUrlTree(["/releases",r.latestVersion])}))};var J=t=>["/","releases",t],K=t=>["docs","releases",t];function Q(t,i){if(t&1&&(n(0,"paimon-markdown-render",0)(1,"div",1)(2,"ol",2)(3,"li",3),c(),n(4,"svg",4),a(5,"path",5),o(),d(),n(6,"a",6),s(7," Releases "),o(),c(),n(8,"svg",7),a(9,"path",8),o()(),d(),n(10,"li")(11,"paimon-dropdown-links",9)(12,"a",10),s(13),c(),n(14,"svg",11),a(15,"path",12),o()()()()(),d(),n(16,"h1",13),s(17),o()(),n(18,"div",14)(19,"a",15),L(20,"githubUrl"),c(),n(21,"svg",16),a(22,"path",17)(23,"path",18)(24,"path",19),o(),s(25," Edit this page "),o()()()),t&2){let e=I();v("html",e.release.content)("toc",e.release.toc),m(6),v("routerLink",C(9,J,e.latestVersion)),m(5),v("options",e.links),m(2),R(" ",e.release.version," "),m(4),R(" Apache Paimon ",e.release.version," Available "),m(2),M("href",F(20,7,C(11,K,e.release.alias+".md")),S)}}var g=class t{constructor(i,e,r){this.documentService=i;this.activatedRoute=e;this.cdr=r;this.links=[];this.destroyRef=l(k);this.platformId=l(D)}get latestVersion(){return this.documentService.latestVersion}ngOnInit(){this.documentService.listRelease().subscribe(i=>{this.links=i.map(e=>({label:e.version,value:["/","releases",e.version]})),this.cdr.markForCheck()}),this.activatedRoute.params.pipe(O(this.destroyRef)).subscribe(({version:i})=>{E(this.platformId)&&window.scrollTo({top:0,left:0,behavior:"auto"}),this.documentService.getRelease(i).subscribe(e=>{this.release=e,this.cdr.markForCheck()}),this.documentService.activeVersion$.next(i)})}static{this.\u0275fac=function(e){return new(e||t)(u(h),u(T),u(z))}}static{this.\u0275cmp=p({type:t,selectors:[["paimon-release-detail"]],standalone:!0,features:[f],decls:1,vars:1,consts:[[3,"html","toc"],["header",""],[1,"flex","items-center","whitespace-nowrap"],[1,"inline-flex","items-center","text-paimon-gray-12","hover:text-paimon-blue-primary"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke-width","1.5","stroke","currentColor",1,"mx-2","size-4","shrink-0"],["stroke-linecap","round","stroke-linejoin","round","d","M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"],[1,"flex","items-center","text-sm","focus:outline-none",3,"routerLink"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"mx-2","size-4","shrink-0","text-paimon-gray-10"],["d","m9 18 6-6-6-6"],[1,"text-sm","text-paimon-gray-14",3,"options"],["aria-expanded","true","aria-haspopup","true",1,"group/link","inline-flex","w-full","justify-center","px-3","py-2","text-sm","font-semibold"],["viewBox","0 0 20 20","fill","currentColor","aria-hidden","true",1,"h-5","w-5","text-paimon-gray-10","transition","delay-150","ease-in-out","group-hover/link:rotate-180"],["fill-rule","evenodd","d","M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z","clip-rule","evenodd"],[1,"mt-8","text-2xl","font-bold","text-paimon-gray-14"],["footer","",1,"my-8"],["target","_blank",1,"group/link","flex","text-paimon-gray-14","hover:text-paimon-blue-primary"],["viewBox","0 0 1024 1024",1,"mr-2","w-5","group-hover/link:fill-paimon-blue-primary"],["d","M918.125 878h-0.875a0.125 0.125 0 0 0-0.125 0.125v5h-10.25v-10.25h5a0.125 0.125 0 0 0 0.125-0.125v-0.875a0.125 0.125 0 0 0-0.125-0.125h-5.625a0.5 0.5 0 0 0-0.5 0.5v11.5a0.5 0.5 0 0 0 0.5 0.5h11.5a0.5 0.5 0 0 0 0.5-0.5v-5.625a0.125 0.125 0 0 0-0.125-0.125z"],["d","M909.56 878.358l-0.029 1.858a0.25 0.25 0 0 0 0.25 0.253h0.007l1.843-0.046a0.13 0.13 0 0 0 0.085-0.036l6.498-6.484a0.125 0.125 0 0 0 0-0.176l-1.942-1.941a0.13 0.13 0 0 0-0.178 0l-6.497 6.484a0.13 0.13 0 0 0-0.036 0.088z m0.993 0.369l5.63-5.618 0.706 0.705-5.633 5.62-0.714 0.018 0.011-0.725z"],["d","M257.7 752c2 0 4-0.2 6-0.5L431.9 722c2-0.4 3.9-1.3 5.3-2.8l423.9-423.9c3.9-3.9 3.9-10.2 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9-2.7 0-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2c-1.9 11.1 1.5 21.9 9.4 29.8 6.6 6.4 14.9 9.9 23.8 9.9z m67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"]],template:function(e,r){e&1&&b(0,Q,26,13,"paimon-markdown-render",0),e&2&&A(r.release?0:-1)},dependencies:[_,P,B,G],encapsulation:2,changeDetection:0})}};var De=[{path:"",component:x,canActivate:[H],children:[{path:":version",component:g}]}];export{De as releasesRoutes};
