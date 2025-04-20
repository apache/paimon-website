import{a as U}from"./chunk-K47ICEZO.js";import{b as S,c as Ce,d as _,f as Se}from"./chunk-YWAVVVXA.js";import{a as Ee}from"./chunk-JOAAZ5FA.js";import{a as ye,b as z,c as W,d as G,e as _e,f as be}from"./chunk-WCY7IYX7.js";import{a as we,c as ke}from"./chunk-SST5BRB6.js";import{$a as xe,Ba as H,D as V,Da as N,E as v,Ea as Q,Fa as A,G as ie,Ha as w,Ia as m,Ja as M,Ka as de,La as ue,M as h,N as f,Na as he,O as x,Oa as fe,P as k,S as ne,T as re,U as I,Ua as L,V as oe,Y as ae,Z as l,Za as ge,_ as g,bb as ve,ca as y,db as P,gc as C,ha as p,j as $,ka as b,la as B,ma as j,na as R,o as ee,oa as e,pa as t,qa as c,ra as T,sa as u,ta as E,u as te,ua as le,va as se,wa as pe,xa as ce,ya as me,za as n}from"./chunk-AQTOR5VK.js";var D=class r{constructor(o){this._elementRef=o;this.skipSelectors=[];this.clickOutsideChange=new re}onClick(o,i){let a=this._elementRef.nativeElement.contains(i),s=this.skipSelectors.some(d=>i.classList.contains(d)||i.id===d);!a&&!s&&this.clickOutsideChange.emit()}static{this.\u0275fac=function(i){return new(i||r)(g(I))}}static{this.\u0275dir=ie({type:r,selectors:[["","paimonClickOutside",""]],hostBindings:function(i,a){i&1&&u("click",function(d){return a.onClick(d,d.target)},!1,ae)},inputs:{skipSelectors:"skipSelectors"},outputs:{clickOutsideChange:"clickOutsideChange"},standalone:!0})}};var Fe=r=>["/","blog",r],Y=class r{static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=v({type:r,selectors:[["paimon-blog-simple-card"]],inputs:{article:"article"},standalone:!0,features:[w],decls:6,vars:6,consts:[[1,"flex","h-[320px]","w-[270px]","flex-col","gap-3","rounded-2xl","bg-paimon-gray-13","p-2"],["width","254","height","185",1,"max-h-[185px]","rounded-2xl",3,"ngSrc","alt"],[1,"h-[95px]","flex-1","overflow-hidden","break-keep","text-lg"],["translate","",1,"flex","h-10","w-[135px]","items-center","justify-center","rounded-3xl","bg-paimon-gray-12","px-7","py-3","text-paimon-gray-1","hover:bg-paimon-gray-11",3,"routerLink"]],template:function(i,a){i&1&&(e(0,"div",0),c(1,"img",1),e(2,"div",2),n(3),t(),e(4,"a",3),n(5," Read More "),t()()),i&2&&(l(),p("ngSrc",a.article.thumbnail||"assets/images/blog-bg.png")("alt",a.article.name),l(2),H(" ",a.article.name," "),l(),p("routerLink",M(4,Fe,a.article.id)))},dependencies:[P,_,S,C],encapsulation:2,changeDetection:0})}};var Ie=()=>["/","team"],Be=()=>["/","blog"],je=()=>["/","security"];function Re(r,o){if(r&1&&c(0,"paimon-blog-simple-card",24),r&2){let i=o.$implicit;p("article",i)}}var q=class r{constructor(o,i){this.articleService=o;this.cdr=i;this.listOfArticle=[]}ngOnInit(){this.articleService.list().subscribe(o=>{this.listOfArticle=(o||[]).slice(0,2),this.cdr.markForCheck()})}static{this.\u0275fac=function(i){return new(i||r)(g(U),g(L))}}static{this.\u0275cmp=v({type:r,selectors:[["paimon-community-dropdown"]],standalone:!0,features:[w],decls:46,vars:6,consts:[[1,"group","block","text-left"],["aria-expanded","true","aria-haspopup","true",1,"group/link","inline-flex","w-full","justify-center","px-3","py-2","text-sm","font-semibold","text-gray-300","shadow-sm","hover:text-white"],["translate",""],["viewBox","0 0 20 20","fill","currentColor","aria-hidden","true",1,"h-5","w-5","text-gray-300","transition","delay-150","ease-in-out","group-hover/link:rotate-180","group-hover/link:text-white"],["fill-rule","evenodd","d","M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z","clip-rule","evenodd"],["role","menu","aria-orientation","vertical","tabindex","-1",1,"invisible","absolute","left-0","z-20","h-auto","w-screen","overflow-auto","rounded-md","bg-paimon-gray-14","py-10","shadow-sm","shadow-paimon-gray-13","ring-1","ring-black","ring-opacity-5","hover:visible","focus:outline-none","group-hover:visible"],[1,"flex","flex-col","gap-12","pl-52"],[1,"flex","gap-10"],[1,"flex","flex-col","gap-9","border-l","border-solid","border-paimon-gray-12","pl-10"],[1,"flex","flex-col"],["translate","",1,"mb-2","text-xs","font-normal","text-paimon-gray-11"],["href","https://paimon.apache.org/docs/master/project/contributing/","target","_self","translate","",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["target","_self","translate","",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline",3,"routerLink"],[1,"mb-2","text-xs","font-normal","text-paimon-gray-11"],["target","_self",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline",3,"routerLink"],[1,"flex","flex-1","flex-col","gap-9","border-l","border-solid","border-paimon-gray-12","pl-10"],["href","https://www.apache.org/",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://www.apache.org/licenses/",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://www.apache.org/events/current-event",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://www.apache.org/security/",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://www.apache.org/foundation/sponsorship.html",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://www.apache.org/foundation/thanks.html",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],["href","https://privacy.apache.org/policies/privacy-policy-public.html",1,"text-2xl","leading-10","text-paimon-gray-2","hover:underline"],[1,"flex","flex-1","gap-6","px-8"],[3,"article"]],template:function(i,a){i&1&&(e(0,"div",0)(1,"div")(2,"a",1)(3,"span",2),n(4,"COMMUNITY"),t(),x(),e(5,"svg",3),c(6,"path",4),t()(),k(),e(7,"div",5)(8,"div",6)(9,"div",7)(10,"div",8)(11,"div",9)(12,"span",10),n(13,"COMMUNITY"),t(),e(14,"a",11),n(15," How to Contribute "),t(),e(16,"a",12),n(17," Our Team "),t(),e(18,"a",12),n(19," Blog "),t()(),e(20,"div",9)(21,"span",13),n(22,"SECURITY"),t(),e(23,"a",14),n(24," Security "),t()()(),e(25,"div",15)(26,"div",9)(27,"span",13),n(28,"ASF"),t(),e(29,"a",16),n(30," Foundation "),t(),e(31,"a",17),n(32," License "),t(),e(33,"a",18),n(34," Events "),t(),e(35,"a",19),n(36," Security "),t(),e(37,"a",20),n(38," Sponsorship "),t(),e(39,"a",21),n(40," Thanks "),t(),e(41,"a",22),n(42," Privacy "),t()()(),e(43,"div",23),j(44,Re,1,1,"paimon-blog-simple-card",24,B),t()()()()()()),i&2&&(l(16),p("routerLink",m(3,Ie)),l(2),p("routerLink",m(4,Be)),l(5),p("routerLink",m(5,je)),l(21),R(a.listOfArticle))},dependencies:[_,S,C,Y],encapsulation:2,changeDetection:0})}};var Ne=r=>["/","blog",r];function Qe(r,o){if(r&1){let i=T();e(0,"li",15)(1,"a",17),u("click",function(s){return h(i),E(3).toggleSearchInput(!1),f(s.stopPropagation())}),n(2),t()()}if(r&2){let i=o.$implicit;l(),p("routerLink",M(2,Ne,i.id)),l(),H(" ",i.name," ")}}function Ae(r,o){r&1&&(e(0,"li",16),n(1,"No Post found"),t())}function Pe(r,o){if(r&1&&(e(0,"div",13)(1,"ul",14),j(2,Qe,3,4,"li",15,B),y(4,Ae,2,0,"li",16),t()()),r&2){let i=E(2);l(2),R(i.listOfResult),l(2),b(i.searchValue&&i.listOfResult.length===0?4:-1)}}function ze(r,o){if(r&1){let i=T();e(0,"div",5),u("clickOutsideChange",function(){h(i);let s=E();return f(s.toggleSearchInput(!1))}),e(1,"div")(2,"div",6)(3,"input",7),he(4,"translate"),A("ngModelChange",function(s){h(i);let d=E();return Q(d.searchValue,s)||(d.searchValue=s),f(s)}),u("ngModelChange",function(){h(i);let s=E();return f(s.search())}),t(),e(5,"div",8),x(),e(6,"svg",9),c(7,"circle",10)(8,"path",11),t()()()(),y(9,Pe,5,1,"div",12),t()}if(r&2){let i=E();l(3),N("ngModel",i.searchValue),p("placeholder",fe(4,3,"Search within blog posts by title or author...")),l(6),p("ngIf",!!i.searchValue)}}var J=class r{constructor(o,i){this.cdr=o;this.articleService=i;this.searchValue="";this.showSearchInput=!1;this.listOfResult=[]}toggleSearchInput(o){this.showSearchInput=o,this.cdr.markForCheck()}search(){this.articleService.list().pipe($(o=>o.filter(i=>i.name.toLowerCase().includes((this.searchValue||"").toLowerCase())||i.authors.find(a=>a.name?.toLowerCase()?.includes((this.searchValue||"").toLowerCase()))))).subscribe(o=>{this.listOfResult=o||[],this.cdr.markForCheck()})}static{this.\u0275fac=function(i){return new(i||r)(g(L),g(U))}}static{this.\u0275cmp=v({type:r,selectors:[["paimon-search-bar"]],standalone:!0,features:[w],decls:7,vars:1,consts:[[1,"block","text-left"],[1,"flex","h-8","w-8","cursor-pointer","items-center","justify-center","rounded-full","bg-paimon-gray-13","text-center","text-xs","text-paimon-text-base","hover:bg-paimon-gray-12","hover:text-white",3,"click"],["xmlns","http://www.w3.org/2000/svg",0,"xmlns","xlink","http://www.w3.org/1999/xlink","fill","currentColor","version","1.1","width","12","height","12","viewBox","0 0 12 12"],["d","M4.43812,8.87625Q2.57752,8.87625,1.2891,7.58714Q0.000682739,6.29804,0,4.43812Q0,2.57753,1.2891,1.2891Q2.57821,0.000682739,4.43812,0Q6.29872,0,7.58782,1.2891Q8.87693,2.57821,8.87624,4.43812Q8.87624,5.18919,8.63727,5.85491Q8.39829,6.52063,7.98862,7.03272L11.8122,10.8563Q12,11.0441,12,11.3343Q12,11.6245,11.8122,11.8122Q11.6245,12,11.3343,12Q11.0441,12,10.8563,11.8122L7.03272,7.98862Q6.52063,8.39829,5.85491,8.63727Q5.18919,8.87624,4.43812,8.87625ZM4.43812,7.51067Q5.71835,7.51067,6.61485,6.61485Q7.51135,5.71903,7.51067,4.43812Q7.51067,3.15789,6.61485,2.26208Q5.71903,1.36626,4.43812,1.36558Q3.15789,1.36558,2.26208,2.26208Q1.36626,3.15858,1.36558,4.43812Q1.36558,5.71835,2.26208,6.61485Q3.15858,7.51135,4.43812,7.51067Z","fill","currentColor","fill-opacity","1"],["role","menu","aria-orientation","vertical","tabindex","-1","paimonClickOutside","",1,"absolute","right-2","top-14","z-20","h-auto","w-[480px]","overflow-auto","rounded-md","bg-paimon-gray-12"],["role","menu","aria-orientation","vertical","tabindex","-1","paimonClickOutside","",1,"absolute","right-2","top-14","z-20","h-auto","w-[480px]","overflow-auto","rounded-md","bg-paimon-gray-12",3,"clickOutsideChange"],[1,"group","relative","flex","rounded-lg"],["type","text",1,"block","w-full","bg-transparent","px-4","py-3","pe-11","text-xs","text-paimon-text-base","placeholder:text-paimon-gray-4","focus:border-b-paimon-gray-8","focus:outline-none","focus-visible:outline-none",3,"ngModelChange","ngModel","placeholder"],[1,"pointer-events-none","absolute","inset-y-0","end-0","z-20","flex","items-center","pe-4","text-paimon-text-base"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"size-4"],["cx","11","cy","11","r","8"],["d","m21 21-4.3-4.3"],["class","flex flex-col",4,"ngIf"],[1,"flex","flex-col"],[1,"list-none","border-t","border-solid","border-paimon-gray-10","p-4","text-left","text-sm","hover:bg-paimon-gray-13"],[1,"hover:underline"],["translate",""],[1,"flex","w-full",3,"click","routerLink"]],template:function(i,a){i&1&&(e(0,"div",0)(1,"div")(2,"a",1),u("click",function(){return a.toggleSearchInput(!0)}),x(),e(3,"svg",2)(4,"g"),c(5,"path",3),t()(),y(6,ze,10,5,"div",4),t()()()),i&2&&(l(6),b(a.showSearchInput?6:-1))},dependencies:[D,G,ye,z,W,xe,C,_,Ce,S],encapsulation:2,changeDetection:0})}};var We=["header"],Ge=()=>["/"],Ue=()=>({label:"master",value:"https://paimon.apache.org/docs/master"}),Ye=()=>({label:"1.1",value:"https://paimon.apache.org/docs/1.1"}),Ze=()=>({label:"1.0",value:"https://paimon.apache.org/docs/1.0"}),qe=()=>({label:"0.9",value:"https://paimon.apache.org/docs/0.9"}),Je=(r,o,i,a)=>[r,o,i,a],Me=()=>["/","downloads"],Le=r=>["/","releases",r],De=()=>["/","releases"],Oe=()=>["/","blog"],Ke=()=>({label:"EN",value:"en"}),Xe=()=>({label:"\u4E2D\u6587",value:"zh"}),$e=(r,o)=>[r,o],et=()=>["ignored"],tt=()=>["/","security"],it=()=>["/","team"];function nt(r,o){r&1&&(e(0,"ul",27)(1,"li")(2,"a",33),n(3," master "),t()(),e(4,"li")(5,"a",34),n(6," 1.0 "),t()(),e(7,"li")(8,"a",35),n(9," 0.9 "),t()(),e(10,"li")(11,"a",36),n(12," 0.8 "),t()()())}function rt(r,o){r&1&&(e(0,"ul",27)(1,"li")(2,"a",37),n(3," How to Contribute "),t()(),e(4,"li")(5,"a",38),n(6," TEAM "),t()()()),r&2&&(l(5),p("routerLink",m(1,it)))}function ot(r,o){r&1&&(e(0,"ul",27)(1,"li")(2,"a",39),n(3," Foundation "),t()(),e(4,"li")(5,"a",40),n(6," License "),t()(),e(7,"li")(8,"a",41),n(9," Events "),t()(),e(10,"li")(11,"a",42),n(12," Security "),t()(),e(13,"li")(14,"a",43),n(15," Sponsorship "),t()(),e(16,"li")(17,"a",44),n(18," Thanks "),t()(),e(19,"li")(20,"a",45),n(21," Privacy "),t()()())}var K=class r{constructor(o,i,a,s){this.el=o;this.cdr=i;this.languageService=a;this.documentService=s;this.isMenuOpen=!1;this.destroyRef=V(ne);this.platformId=V(oe);this._doc=V(ge)}get latestReleaseVersion(){return this.documentService.latestVersion}getWindow(){return this._doc.defaultView}ngOnInit(){ve(this.platformId)&&(ee(this.getWindow(),"scroll").pipe(te(!0),we(this.destroyRef)).subscribe(()=>{(this.getWindow()?.scrollY||this._doc.documentElement.scrollTop)>0?(this.headerElement.nativeElement.classList.remove("bg-transparent"),this.headerElement.nativeElement.classList.add("bg-paimon-gray-14")):(this.headerElement.nativeElement.classList.remove("bg-paimon-gray-14"),this.headerElement.nativeElement.classList.add("bg-transparent"))}),this.language=this.languageService.language,this.cdr.markForCheck())}toggleMenu(){this.isMenuOpen=!this.isMenuOpen,this.el.nativeElement.classList.toggle("menu-open"),this.cdr.markForCheck()}hideMenu(){this.isMenuOpen=!1,this.el.nativeElement.classList.remove("menu-open"),this.cdr.markForCheck()}languageChange(o){this.languageService.setLanguage(o)}toggleMobileMenus(o){this.expandedMenu===o?this.expandedMenu="":this.expandedMenu=o,this.cdr.markForCheck()}static{this.\u0275fac=function(i){return new(i||r)(g(I),g(L),g(Se),g(Ee))}}static{this.\u0275cmp=v({type:r,selectors:[["paimon-header"]],viewQuery:function(i,a){if(i&1&&pe(We,7),i&2){let s;ce(s=me())&&(a.headerElement=s.first)}},standalone:!0,features:[w],decls:73,vars:42,consts:[["header",""],[1,"fixed","z-50","h-auto","w-full","bg-paimon-gray-14"],[1,"flex","h-16","w-full","items-center","justify-between","pl-4","pr-2","lg:pl-8","lg:pr-8"],[1,"z-50","flex-shrink-0"],[1,"relative","flex","h-full","items-center","leading-none","text-paimon-text-base",3,"routerLink"],["priority","true","ngSrc","assets/icons/logo.svg","alt","Apache Paimon","width","186","height","39"],[1,"hidden","h-16","flex-grow","items-center","justify-center","lg:flex"],[1,"flex","h-full","items-center","space-x-2.5"],[3,"options"],["aria-expanded","true","aria-haspopup","true",1,"group/link","inline-flex","w-full","justify-center","px-3","py-2","text-sm","font-semibold","text-gray-300","shadow-sm","hover:text-white"],["translate",""],["viewBox","0 0 20 20","fill","currentColor","aria-hidden","true",1,"h-5","w-5","text-gray-300","transition","delay-150","ease-in-out","group-hover/link:rotate-180","group-hover/link:text-white"],["fill-rule","evenodd","d","M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z","clip-rule","evenodd"],["translate","",1,"px-3","py-2","text-sm","font-medium","text-gray-300","hover:text-white",3,"routerLink"],[1,"flex","items-center","gap-2","lg:gap-4"],[3,"ngModelChange","options","ngModel"],[1,"hidden","lg:block"],["href","https://github.com/apache/paimon/","target","_blank",1,"hidden","w-[120px]","rounded-[32px]","bg-paimon-gray-13","px-4","py-2","text-center","text-xs","text-paimon-text-base","hover:bg-paimon-gray-12","hover:text-white","lg:block"],[1,"lg:hidden"],["type","button","aria-controls","mobile-menu","aria-expanded","false",1,"ignored","inline-flex","items-center","justify-center","rounded-md","p-2","text-paimon-text-base","hover:text-paimon-text-hover","focus:text-paimon-text-hover","focus:outline-none",3,"click"],["translate","",1,"sr-only","pointer-events-none"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke-width","1.5","stroke","currentColor",1,"pointer-events-none","size-6"],["stroke-linecap","round","stroke-linejoin","round","d","M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"],["id","dropdown-menu","paimonClickOutside","",1,"dropdown-menu","fixed","inset-x-0","top-16","hidden","overflow-y-auto","overflow-x-hidden","bg-paimon-gray-13","py-1","shadow-sm","shadow-paimon-gray-13","backdrop-blur-md",3,"clickOutsideChange","skipSelectors"],[1,"grid","grid-cols-1","items-center","gap-3"],[1,"flex","justify-between"],[1,"flex","flex-1","flex-col","gap-4"],[1,"list-none","items-center","gap-3","text-sm","font-semibold"],[1,"hover:bg-paimon-gray-12"],[1,"flex","h-10","w-full","items-center","justify-start","px-8","no-underline","hover:text-paimon-text-hover",3,"click"],["viewBox","0 0 20 20","fill","currentColor","aria-hidden","true",1,"h-5","w-5","text-gray-300","group-hover/link:text-white"],["translate","",1,"flex","h-10","w-full","items-center","justify-start","px-8","no-underline","hover:text-paimon-text-hover",3,"routerLink"],[1,"flex","h-10","w-full","items-center","justify-start","px-8","no-underline","hover:text-paimon-text-hover",3,"routerLink"],["href","https://paimon.apache.org/docs/master",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://paimon.apache.org/docs/1.0",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://paimon.apache.org/docs/0.9",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://paimon.apache.org/docs/0.8",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://paimon.apache.org/docs/master/project/contributing/","translate","",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["translate","",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover",3,"routerLink"],["href","https://www.apache.org/",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://www.apache.org/licenses/",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://www.apache.org/events/current-event",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://www.apache.org/security/",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://www.apache.org/foundation/sponsorship.html",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://www.apache.org/foundation/thanks.html",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"],["href","https://privacy.apache.org/policies/privacy-policy-public.html",1,"flex","h-10","w-full","items-center","justify-start","px-8","pl-12","no-underline","hover:text-paimon-text-hover"]],template:function(i,a){if(i&1){let s=T();e(0,"header",1,0)(2,"div",2)(3,"div",3)(4,"a",4),c(5,"img",5),t()(),e(6,"div",6)(7,"div",7)(8,"paimon-dropdown-links",8)(9,"a",9)(10,"span",10),n(11,"DOCUMENT"),t(),x(),e(12,"svg",11),c(13,"path",12),t()()(),k(),c(14,"paimon-divider"),e(15,"a",13),n(16," DOWNLOADS "),t(),c(17,"paimon-divider"),e(18,"a",13),n(19," RELEASES "),t(),c(20,"paimon-divider"),e(21,"a",13),n(22," BLOG "),t(),c(23,"paimon-divider")(24,"paimon-community-dropdown"),t()(),e(25,"div",14)(26,"paimon-switcher",15),A("ngModelChange",function(O){return h(s),Q(a.language,O)||(a.language=O),f(O)}),u("ngModelChange",function(O){return h(s),f(a.languageChange(O))}),t(),c(27,"paimon-search-bar",16),e(28,"a",17),n(29," GITHUB "),t(),e(30,"div",18)(31,"button",19),u("click",function(){return h(s),f(a.toggleMenu())}),e(32,"span",20),n(33,"Open Menu"),t(),x(),e(34,"svg",21),c(35,"path",22),t()()()(),k(),e(36,"div",23),u("clickOutsideChange",function(){return h(s),f(a.hideMenu())}),e(37,"nav",24)(38,"div",25)(39,"div",26)(40,"ul",27)(41,"li",28)(42,"a",29),u("click",function(){return h(s),f(a.toggleMobileMenus("document"))}),e(43,"span",10),n(44,"DOCUMENT"),t(),x(),e(45,"svg",30),c(46,"path",12),t()(),y(47,nt,13,0,"ul",27),t(),k(),e(48,"li",28)(49,"a",31),n(50," DOWNLOADS "),t()(),e(51,"li",28)(52,"a",31),n(53," RELEASES "),t()(),e(54,"li",28)(55,"a",31),n(56," BLOG "),t()(),e(57,"li",28)(58,"a",29),u("click",function(){return h(s),f(a.toggleMobileMenus("community"))}),e(59,"span",10),n(60,"COMMUNITY"),t(),x(),e(61,"svg",30),c(62,"path",12),t()(),y(63,rt,7,2,"ul",27),t(),k(),e(64,"li",28)(65,"a",32),n(66," Security "),t()(),e(67,"li",28)(68,"a",29),u("click",function(){return h(s),f(a.toggleMobileMenus("asf"))}),n(69," ASF "),x(),e(70,"svg",30),c(71,"path",12),t()(),y(72,ot,22,0,"ul",27),t()()()()()()()()}i&2&&(l(4),p("routerLink",m(15,Ge)),l(4),p("options",ue(20,Je,m(16,Ue),m(17,Ye),m(18,Ze),m(19,qe))),l(7),p("routerLink",m(25,Me)),l(3),p("routerLink",a.latestReleaseVersion?M(26,Le,a.latestReleaseVersion):m(28,De)),l(3),p("routerLink",m(29,Oe)),l(5),p("options",de(32,$e,m(30,Ke),m(31,Xe))),N("ngModel",a.language),l(10),p("skipSelectors",m(35,et)),l(11),b(a.expandedMenu==="document"?47:-1),l(2),p("routerLink",m(36,Me)),l(3),p("routerLink",a.latestReleaseVersion?M(37,Le,a.latestReleaseVersion):m(39,De)),l(3),p("routerLink",m(40,Oe)),l(8),b(a.expandedMenu==="community"?63:-1),l(2),p("routerLink",m(41,tt)),l(7),b(a.expandedMenu==="asf"?72:-1))},dependencies:[P,D,_e,be,G,z,W,_,S,ke,C,q,J],styles:[".menu-open[_nghost-%COMP%]   .dropdown-menu[_ngcontent-%COMP%]{display:block}[_nghost-%COMP%]   header[_ngcontent-%COMP%]{transition:background-color .3s ease}"],changeDetection:0})}};var at=["*"],Te=class r{static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=v({type:r,selectors:[["paimon-layout"]],standalone:!0,features:[w],ngContentSelectors:at,decls:5,vars:0,consts:[[1,"flex","h-screen","flex-col","bg-paimon-gray-14","text-paimon-text-base"],[1,"m-0"],[1,"w-full"]],template:function(i,a){i&1&&(le(),e(0,"div",0),c(1,"paimon-header"),e(2,"main",1)(3,"div",2),se(4),t()()())},dependencies:[K],encapsulation:2,changeDetection:0})}};export{Te as LayoutComponent};
