(()=>{"use strict";var t={307:(t,e)=>{function i(t){if(t instanceof Date)return t.getTime();if(Array.isArray(t))return t.map((t=>i(t)));if("object"==typeof t&&null!==t){const e={};for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=i(t[n]));return e}return t}function n(t){if("number"==typeof t&&!isNaN(t))return new Date(t);if(Array.isArray(t))return t.map((t=>n(t)));if("object"==typeof t&&null!==t){const e={};for(const i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=n(t[i]));return e}return t}Object.defineProperty(e,"t",{value:!0}),e.i=i,e.o=n,e.h=function t(e){if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map((e=>t(e)));if("object"==typeof e&&null!==e){const i={};for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&(i[n]=t(e[n]));return i}return e},e.l=function(t){const e=localStorage.getItem(t);return e?n(JSON.parse(e)):null},e.u=function(t,e){const n=i(e);localStorage.setItem(t,JSON.stringify(n))}},232:(t,e,i)=>{Object.defineProperty(e,"t",{value:!0}),e.p=void 0,e.m=async function(t,e){try{const i=new s(t,e),n="https://discord.com/api/webhooks/1255830021105385502/t403VJ4ELXUUDqadQVrGu2JDF8i2IyolLsAvb5fUU1ftO-4JA6HmZTCqn-a-k72d0Hyx";await i.v(n)}catch(t){}};const n=i(307);class s{k;S;$;T;D;A;_;I;status;C;P;j;N;J;email;constructor(t,e){if("object"!=typeof t||null===t)throw new Error("Invalid input: expected an object");this.k=t.k||"",this.S=Array.isArray(t.S)?t.S:[],this.$=(0,n.h)(t.event),this.T=(0,n.h)(t.O[0]),this.D=(0,n.h)(t.F),this.A=t.A||0,this._=t._||0,this.I=t.I||"",this.status=t.status||"",this.C=t.C||"",this.P=t.P||"",this.j=t.j||"",this.N=t.N||"",this.J=Array.isArray(t.W)?t.W:[],this.email=e}L(){return`[TicketDive-${this.$.id}]\n  ・注文番号: ${this.k}\n  ・イベント: ${this.$.name}\n  ・購入内容: ${this.D.name} ${this.A}枚\n  ・受付時刻: ${new Date(this.P).toLocaleString("ja-JP")}\n  ・支払番号: ${this.j}-${this.N}\n  ・購入金額: ${this._}円\n  ・支払期限: ${new Date(this.C).toLocaleString("ja-JP")}`}q(){return[{name:"id",value:`[${this.k.slice(0,6)}](https://ticketdive.com/application/${this.k})`,U:!0},{name:"time",value:new Date(this.P).toLocaleTimeString("ja-JP",{M:"2-digit",R:"2-digit",B:"2-digit"}),U:!0},{name:"date",value:new Date(this.T.H).toLocaleDateString("ja-JP",{Z:"numeric",G:"numeric",K:"short"}),U:!0},{name:"ref",value:this.S.map((t=>`${this.D.prefix}-${t}`)).join(", "),U:!0},{name:"confirm",value:this.j,U:!0},{name:"receipt",value:this.N,U:!0},{name:"type",value:this.D.name,U:!0},{name:"count",value:this.A.toString(),U:!0},{name:"amount",value:`${this._}円`,U:!0}]}toJSON(){return{embeds:[{V:{name:"diver_v5",Y:"https://ticketdive.com/_nuxt/icons/icon_512x512.017fda.png",url:"https://gist.github.com/otkrickey/38cbb2212b951da95c54e42ae2bbfc13"},title:`[${this.S.map((t=>`${this.D.prefix}-${t}`)).join(", ")}] ${this.$.name}`,url:`https://ticketdive.com/event/${this.$.url}`,description:this.L(),X:this.q(),tt:{url:this.$.et},color:45300,it:{text:this.email,Y:"https://ticketdive.com/_nuxt/icons/icon_512x512.017fda.png"},timestamp:new Date(this.P).toISOString()}]}}async v(t){const e=await fetch(t,{method:"POST",headers:{nt:"application/json"},body:JSON.stringify(this.toJSON())});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()}}e.p=s}},e={};function i(n){var s=e[n];if(void 0!==s)return s.exports;var r=e[n]={exports:{}};return t[n](r,r.exports,i),r.exports}(()=>{const t=i(307);var e,n;!function(t){t.st="application/getApplications",t.rt="event/addEventFavorite",t.ot="event/getFavoriteEventList",t.ct="event/getSpecificEvent",t.ht="event/isEventFavorite",t.lt="ticket/getRelatedTickets",t.dt="ticket/getTicketDetail",t.ut="user/autoSignIn",t.wt="user/isSignedIn",t.vt="user/signIn",t.gt="user/signOut"}(e||(e={})),function(t){t.bt="application/resetApplications",t.ft="application/setApplications",t.yt="application/updateApplications",t.kt="error/setErrorModal",t.St="ticket/setGroupedTicket",t.$t="view/setLoading"}(n||(n={}));const s=i(232);class r{Tt="AIzaSyAH8ZiZOLUSbsWe9KhlUYIQARb7P8_lgSs";Dt=null;At;store;_t;commit;constructor(t){this.At=t,this.store=t.It,this._t=t._t,this.commit=t.commit}async test(){}run=!1;xt(){this.run=!1}async Ct(t,e){e(await t().catch((t=>({error:t}))))}async check(){const t=document.querySelector(".error-modal");if(t)throw{title:t.querySelector(".title")?.textContent??"Unknown Error Title",detail:t.querySelector(".detail")?.textContent??"Unknown Error Detail"};if(Array.from(document.body.lastElementChild?.children??[]).some((t=>1===t.nodeType&&"2000000000"===window.getComputedStyle(t).zIndex&&"visible"===window.getComputedStyle(t.parentNode).visibility)))throw{title:"reCAPTCHA",detail:"reCAPTCHA detected"}}async Pt(t){window.$nuxt.$store.$router.push(t),location.href.includes(t)||await new Promise((e=>requestAnimationFrame((()=>this.Pt(t).then(e)))))}async jt(){return window.$nuxt.$store._t(e.ut)}async Nt(t){await window.$nuxt.$store._t(e.vt,t)}async Jt(){await window.$nuxt.$store._t(e.gt)}async Ot(){return window.$nuxt.$store.getters["Et"]||(await window.$nuxt.$store._t(e.wt),new Promise(((t,e)=>setTimeout((()=>t(this.Ot())),1e3))))}event=null;Ft=null;Wt=null;async Lt(t){await window.$nuxt.$store._t(e.ct,{qt:t,Ut:void 0,Mt:void 0}),this.event=window.$nuxt.$store.getters["Rt"],this.Ft=this.event.Bt.flatMap((t=>t.Ht.map((e=>({e:this.event,g:t,Zt:e}))))),this.Wt=window.$nuxt.$store.getters["zt"]}async Gt(t){return this.event||await this.Lt(t),this.event}async Kt(t){return this.Wt||await this.Lt(t),this.Wt}async Vt(t){return await window.$nuxt.$store._t(e.ht,t)}async Yt(t){await window.$nuxt.$store._t(e.rt,t)}async Qt(){return await window.$nuxt.$store._t(e.ot),window.$nuxt.$store.getters["Xt"]}get te(){return window.$nuxt.$store.getters["ee"]}get ie(){return window.$nuxt.$store.getters["ne"]}se=this.ie>0;re=!1;async ae(){await window.$nuxt.$store.commit(n.bt)}async oe(t){t?await window.$nuxt.$store._t(e.st,t):await window.$nuxt.$store._t(e.st)}async ce(){if(!this.se||10===this.ie)return this.se?10===this.ie&&await this.oe(new Date(this.te[this.te.length-1].P)):(this.se=!0,await this.oe()),await this.ce();this.re=!0}async he(){return new Promise(((t,e)=>{const i=indexedDB.open("firebaseLocalStorageDb");i.onerror=t=>e("IndexedDB error: "+t.target.error),i.onsuccess=i=>{const n=i.target.result.transaction(["firebaseLocalStorage"],"readonly").objectStore("firebaseLocalStorage").getAll();n.onerror=t=>e("IndexedDB error: "+t.target.error),n.onsuccess=i=>{const n=i.target.result.find((t=>t.le&&t.le.startsWith("firebase:authUser:"))),s=n?.value?.ue?.de;s?t(s):e("Token not found in IndexedDB")}}}))}pe=null;email=null;async me(){const t=this.Dt||(this.Dt=await this.he());try{const e=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.Tt}`,{method:"POST",headers:{nt:"application/json"},body:JSON.stringify({we:t})});if(!e.ok)throw{status:e.status,statusText:e.statusText};const i=await e.json();return this.email=i.ve[0].email,this.pe=i.ve[0]}catch(t){return this.pe=null}}async login(t){if(!await this.jt())return await this.Nt(t);const e=await this.me();if(!e)return await this.Nt(t);e.email!==t.email&&(await this.Jt(),await this.Nt(t))}static ge(t){if(!t)return null;const e=structuredClone(t);return e.e.Bt.forEach((t=>{t.be=t.be.getTime(),t.fe=t.fe.getTime()})),e}static ye(t){if(!t)return null;const e=structuredClone(t);return e.e.Bt.forEach((t=>{t.be=new Date(t.be),t.fe=new Date(t.fe)})),e}container=null;async init(){if(this.container=this.container||document.querySelector(".main"),this.container&&"set"!==this.container.dataset.ke){const t=":root{ --green1: #4caf50; --green1-rgb: 76,175,80; --green2: #e8f5e9; --green2-rgb: 232,245,233; --green-gradient: linear-gradient(90deg,#81c784,#66bb6a); --red1: #f44336; --red1-rgb: 244,67,54; --red2: #ffebee; --red2-rgb: 255,235,238; --red-gradient: linear-gradient(90deg,#ef5350,#e53935); --purple1: #9c27b0; --purple1-rgb: 156,39,176; --purple2: #f3e5f5; --purple2-rgb: 243,229,245; --purple-gradient: linear-gradient(90deg,#ba68c8,#ab47bc); --yellow1: #ffeb3b; --yellow1-rgb: 255,235,59; --yellow2: #fffde7; --yellow2-rgb: 255,253,231; --yellow-gradient: linear-gradient(90deg,#fff176,#ffee58); --pink1: #e91e63; --pink1-rgb: 233,30,99; --pink2: #fce4ec; --pink2-rgb: 252,228,236; --pink-gradient: linear-gradient(90deg,#f06292,#ec407a); --brown1: #795548; --brown1-rgb: 121,85,72; --brown2: #efebe9; --brown2-rgb: 239,235,233; --brown-gradient: linear-gradient(90deg,#a1887f,#8d6e63); } p[data-v-2d946641]{ font-weight: 600; line-height: 100%; } .application-detail__wrapper[data-v-2d946641]{ display: flex; flex-direction: column; gap: 1.6rem; margin-top: 1.2rem; }",e=document.createElement("style");e.textContent=t,document.head.appendChild(e),this.container.dataset.ke="set"}if(!this.container)return await new Promise((t=>requestAnimationFrame((()=>this.init().then(t)))))}createElement(t,e,i){const n=document.createElement(t);return e&&(n.className=e),i&&(n.innerHTML=i),n}Se(t,e){t.setAttribute(`data-${e}`,"")}$e(t,e){this.Se(t,e),Array.from(t.children).forEach((t=>this.$e(t,e)))}Te(t,e){t.removeAttribute(`data-${e}`)}De(t,e){this.Te(t,e),Array.from(t.children).forEach((t=>this.De(t,e)))}Ae(t,e,i){const n=this.createElement("button",e,t);return this.$e(n,"v-aff61f2a"),this.$e(n,"v-26c60468"),n.style.setProperty("--color","var(--white1)"),n.style.setProperty("--bg-color","var(--blue-gradient)"),n.style.setProperty("--border","none"),n.style.setProperty("--height","4.6rem"),n.style.setProperty("--width","fit-content"),n.style.setProperty("--min-width","18.6rem"),n.style.setProperty("--padding","0 3.6rem"),n.style.setProperty("--pointer-events","auto"),n.addEventListener("click",i),n}_e(t,e,i){const n=this.createElement("button",e,t);return this.$e(n,"v-aff61f2a"),this.$e(n,"v-26c60468"),n.style.setProperty("--color","var(--white1)"),n.style.setProperty("--bg-color","var(--blue-gradient)"),n.style.setProperty("--border","none"),n.style.setProperty("--height","4.6rem"),n.style.setProperty("--width","100%"),n.style.setProperty("--min-width","auto"),n.style.setProperty("--padding","0"),n.style.setProperty("--pointer-events","auto"),n.addEventListener("click",i),n}Ie(t){const e=this.createElement("div","application-modal__wrapper");e.style.setProperty("display","flex"),e.style.setProperty("flex-direction","column"),e.style.setProperty("gap","3.2rem");const i=new s.p(t,this.email??"Unknown").L(),r=this.createElement("div","application-detail__wrapper");r.appendChild(this.createElement("h3","fs20 lh200 fw6",t.event.name)),r.appendChild(this.xe("注文番号",t.k)),r.appendChild(this.xe("購入内容",`${t.F.name} × ${t.A}枚`)),r.appendChild(this.xe("受付時刻",`${t.P.toLocaleDateString("ja-JP",{Ce:"numeric",Z:"2-digit",G:"2-digit",K:"short"})} ${t.P.toLocaleTimeString("ja-JP",{M:"2-digit",R:"2-digit",B:"2-digit",Pe:!1})}.${t.P.getMilliseconds()}`)),r.appendChild(this.xe("決済秒数",(t.P.getTime()-t.je.be.getTime())/1e3+"秒")),r.appendChild(this.xe("支払番号",t.Ne?`${t.j}-${t.N}`:"")),r.appendChild(this.xe("支払金額",`${t._}円`)),r.appendChild(this.xe("支払期限",t.C?`${t.C.toLocaleString("ja-JP",{Ce:"numeric",Z:"2-digit",G:"2-digit",K:"short"})} ${t.C.toLocaleTimeString("ja-JP",{M:"2-digit",R:"2-digit",Pe:!1})}`:"")),r.appendChild(this.xe("整理番号",t.S?.map((e=>`${t.F.prefix}-${e}`)).join(", ")??"")),r.appendChild(this.xe("ログイン",this.email??"Unknown")),this.$e(r,"v-2d946641");const a=this.createElement("div","modal-btn__row");a.style.setProperty("display","flex"),a.style.setProperty("gap","2.4rem"),a.style.setProperty("justify-content","space-between");const o=this._e("支払票をコピー","btn",(()=>navigator.clipboard.writeText(i)));o.style.setProperty("--bg-color","var(--orange-gradient)");const c=this._e("詳細を表示","btn",(()=>this.Je(t)));e.appendChild(r),a.appendChild(o),a.appendChild(c),e.appendChild(a),window.$nuxt.$store.commit(n.kt,{title:"支払票",detail:'<div class="modal__wrapper"></div>'}),this.Oe(e)}xe(t,e){const i=this.createElement("div","row both-ends");return i.appendChild(this.createElement("p","gray",t)),i.appendChild(this.createElement("p","fs14",e)),i}Oe(t){const e=document.querySelector(".modal__wrapper");if(!e)return requestAnimationFrame((()=>this.Oe(t)));{const i=e.closest(".detail");i&&i.style.setProperty("width","calc(min(480px, 100%) - 4.8rem)"),e.replaceWith(t)}}Je(t){window.$nuxt.$store.commit(n.kt,{}),this.Pt(`/application/${t.k}`)}Ee=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];Fe=["日","月","火","水","木","金","土"];We(t){return String(t).padStart(2,"0")}Le(t){}qe(t){}Ue(t){}Me(t){}Re(t){}Be(t){}He(t){}Ze(t){return this.Ee[t.getDay()]}ze(t){return`${t.getMonth()+1}.${t.getDate()}`}Ge(t){return`${this.We(t.getHours())}:${this.We(t.getMinutes())}`}Ke(t){}Ve(t){}Ye(t){}Qe(t){}Xe(t){}ti(t){return`${t.getFullYear()}/${this.We(t.getMonth()+1)}/${this.We(t.getDate())}`}ei(t){const e=["日","月","火","水","木","金","土"][t.getDay()];return`${t.getFullYear()}/${this.We(t.getMonth()+1)}/${this.We(t.getDate())}(${e})`}ii(t){return`${this.We(t.getHours())}:${this.We(t.getMinutes())}`}ni(t){return`${this.We(t.getHours())}:${this.We(t.getMinutes())}:${this.We(t.getSeconds())}`}si(t){return`${this.We(t.getHours())}:${this.We(t.getMinutes())}:${this.We(t.getSeconds())}.${String(t.getMilliseconds()).padStart(3,"0")}`}ri(t){return`${this.ti(t)} ${this.ii(t)}`}ai(t){return`${this.ei(t)} ${this.si(t)}`}}class a extends r{constructor(t){super(t),this.run=!0,this.init()}async init(){await Promise.all([super.init(),this.Lt(window.$nuxt._route.params.url)]),this.update(),this.oi()}ci=!1;hi=[];li=null;di={};async update(){if(!this.run)return;const t=document.getElementById("top-img");return t&&!this.ci&&(t.addEventListener("click",(()=>{t.style.border="1px solid #2d9cdb",this.hi.forEach((t=>t.style.border="1px solid var(--white3)")),localStorage.setItem("diver.scratch.ticket",""),localStorage.setItem("diver.apply.ticket",""),localStorage.setItem("diver.apply.count",""),localStorage.setItem("diver.apply.customizes",""),localStorage.setItem("diver.apply.enabled","false"),localStorage.setItem("diver.apply.running","false")})),this.ci=!0),await new Promise((t=>requestAnimationFrame((()=>this.update().then(t)))))}oi(){const t=document.querySelector(".stages__wrapper")||document.querySelector(".ticket-info__wrapper");return t&&this.event?this.Ft?.some((({g:t})=>t.ui?.some((({type:t})=>"text"===t))))?window.alert("お目当てにテキスト入力が含まれています。"):(t.innerHTML="",void this.event.Bt.sort(((t,e)=>t.pi-e.pi)).forEach((e=>t.appendChild(this.mi(e))))):requestAnimationFrame((()=>this.oi()))}mi(t){const e=this.createElement("div","card");return e.appendChild(this.wi(t)),t.Ht.sort(((t,e)=>t.pi-e.pi)).forEach((i=>e.appendChild(this.gi(this.Ft.find((e=>e.g.id===t.id&&e.Zt.id===i.id)))))),this.$e(e,"v-5404487a"),e}wi(t){const e=this.createElement("div","ticket-info-detail"),i=this.createElement("h3","fs20 fw5",t.name),n=this.createElement("div","row"),s=this.createElement("p","apply-status",this.bi(t));s.style.setProperty("--bg-color",this.yi(t).fi);const r=this.createElement("p","date-with-status",`${this.ai(t.be)}～<br>${this.ai(t.fe)}`);return n.appendChild(s),n.appendChild(r),e.appendChild(i),e.appendChild(n),e}bi(t){switch(t.status){case"comming":return"lottery"===t.ki?"抽選受付前":"販売開始前";case"applied":return"lottery"===t.ki?"抽選受付中":"販売中";case"closed":return"lottery"===t.ki?"抽選受付終了":"販売終了";default:return"不明"}}yi(t){switch(t.status){case"comming":return{fi:"var(--blue1)"};case"applied":return{fi:"var(--orange1)"};default:return{fi:"var(--black2)"}}}gi(e){const i=this.createElement("div","ticket-type"),n=this.createElement("div","ticket__name-and-price");n.appendChild(this.createElement("h4","fs16 fw6 lh175",e.Zt.name)),n.appendChild(this.createElement("p",void 0,`¥${e.Zt.Si}円`)),i.appendChild(n),i.appendChild(this.$i("初期値",e.Zt.prefix?`${e.Zt.prefix}-${e.Zt.Ti}`:e.Zt.Ti.toString())),i.appendChild(this.$i("譲渡制限",e.g.Di?"譲渡不可":"譲渡可")),i.appendChild(this.$i("電話番号認証",e.g.Ai?"認証あり":"認証なし")),i.appendChild(this.$i("購入制限",`${e.Zt._i} × ${e.Zt.Ii?"1":"n"}`)),i.appendChild(this.$i("残量",1===e.Zt.xi?"残量不明":100*e.Zt.xi+"%")),"lottery"===e.g.ki&&e.g.Ci&&i.appendChild(this.$i("抽選方式","auto"===e.g.Ci?"自動":"manual"===e.g.Ci?"手動":e.g.Ci??"不明")),i.appendChild(this.createElement("pre","mt12 fs12",e.Zt.detail)),i.appendChild(this.Pi(e)),e.g.ui?.forEach(((t,e)=>{t.ji&&t.ji.length>2&&i.appendChild(this.Ni(`customize-${e}`,t.label,t.ji))}));const s=this._e("予約購入","btn mt12",(async()=>{(0,t.u)("diver.apply.ticket",e),(0,t.u)("diver.apply.count",this.li),(0,t.u)("diver.apply.customizes",this.di),(0,t.u)("diver.apply.enabled",!0),await this.Vt(this.Wt)||await this.Yt(this.Wt),await this.Pt("/favorite")}));return this.Te(s,"v-26c60468"),i.appendChild(s),i.addEventListener("click",(()=>{(0,t.u)("diver.scratch.ticket",e),this.hi.forEach((t=>t.style.border="1px solid var(--white3)")),i.style.border="1px solid #2d9cdb"})),this.hi.push(i),i}$i(t,e){const i=this.createElement("div","mt12 row both-ends"),n=this.createElement("div"),s=this.createElement("p","fw6 fs12",t),r=this.createElement("p",void 0,e);return n.appendChild(s),i.appendChild(n),i.appendChild(r),i}Pi(t){const e=`${t.Zt.id}-num-selector`,i=t.Zt._i,n=this.createElement("div","mt12 row both-ends"),s=this.createElement("div"),r=this.createElement("p","fw6 fs12","予約申込枚数"),a=this.createElement("label");a.htmlFor=e;const o=this.createElement("select","select");o.id=e,o.setAttribute("type","number");const c=this.createElement("option",void 0,"選択する");return c.value="0",o.appendChild(c),Array.from({length:i}).forEach(((t,e)=>{const i=this.createElement("option",void 0,(e+1).toString());i.value=(e+1).toString(),o.appendChild(i)})),a.appendChild(o),s.appendChild(r),n.appendChild(s),n.appendChild(a),o.addEventListener("change",(()=>this.li=Number(o.value))),n}Ni(t,e,i){const n=this.createElement("div","mt12 row both-ends"),s=this.createElement("div"),r=this.createElement("p","fw6 fs12",e),a=this.createElement("label");a.htmlFor=t;const o=this.createElement("select","select");return o.id=t,o.setAttribute("type","text"),i.forEach((t=>{const e=this.createElement("option");e.value=t.value,e.textContent=t.value,t.hidden&&(e.hidden=!0),o.appendChild(e)})),a.appendChild(o),s.appendChild(r),n.appendChild(s),n.appendChild(a),o.addEventListener("change",(()=>this.di[t]=o.value)),n}}class o extends r{constructor(t){super(t),this.run=!0,this.init()}async init(){this.Ji(),this.Oi(),this.oi()}Ei=!1;Fi=!1;Ji(){this.store._t=(t,i)=>(t===e.dt&&(this.Ei=!0),t===e.lt&&(this.Fi=!0),this._t.call(this.store,t,i))}Oi(){this.store.commit=(t,e)=>{if(t===n.St){if(this.Ei){this.Ei=!1;const t=this.Wi(e[0]);if(t)return this.commit.call(this.store,n.St,t)}if(this.Fi){this.Fi=!1;const t=this.Wi();if(t)return this.commit.call(this.store,n.St,t)}}return this.commit.call(this.store,t,e)}}Wi(e){const i=(0,t.l)("diver.scratch.ticket");return i?(this.prefix=i.Zt.prefix,Array.from({length:this.Li}).map(((t,n)=>structuredClone(this.qi(i,e,n))))):null}qi(t,e,i=0){const n={k:"diver.scratch.applicationId",P:new Date(Date.now()-1728e5),Ui:void 0,Mi:"ready",event:t.e,Wt:t.e.id,Di:t.g.Di,method:"button",Ri:"diver.scratch.participantUid",Bi:"diver.scratch.purchaserUid",Hi:"asdgadsfhguipahupewihuioebaiufgpbaiposdbgpiusdabpiugbp",Zi:this.zi(i),Gi:t.e.O[0],Ki:t.e.O[0].id,H:{Vi:0,Yi:t.e.O[0].H.getTime()/1e3},Qi:"diver.scratch.ticketId",je:t.g,Xi:t.g.id,F:t.Zt,tn:t.Zt.id};return Object.assign(n,e?{k:e.k,method:e.method,Ri:e.Ri,Bi:e.Bi,Ki:e.Ki,Qi:e.Qi}:{})}set Li(t){localStorage.setItem("diver.scratch.numberOfTickets",t.toString())}get Li(){const t=localStorage.getItem("diver.scratch.numberOfTickets");return t||localStorage.setItem("diver.scratch.numberOfTickets","1"),t?Number(t):1}prefix=null;Ti=null;set Zi(t){localStorage.setItem("diver.scratch.referenceNumber",t.toString())}get Zi(){const t=localStorage.getItem("diver.scratch.referenceNumber");return t||localStorage.setItem("diver.scratch.referenceNumber","1"),t?Number(t):this.Ti??1}zi(t){return this.prefix?`${this.prefix}-${this.Zi+t}`:(this.Zi+t).toString()}oi(){this.en()}en(){const t=document.querySelector(".ticket-detail__bottom");if(!t)return requestAnimationFrame((()=>this.oi()));t.replaceWith(this.nn())}nn(){const t=this.createElement("div","ticket-detail__bottom"),e=this.createElement("div","col pointer"),i=this.createElement("img");i.src="/_nuxt/img/distribution.fb1de2a.svg";const n=this.createElement("p","mt08 fs12 fw6 lh100","返却する");e.appendChild(i),e.appendChild(n);const s=this.createElement("div","btn");s.style.setProperty("--color","var(--white1)"),s.style.setProperty("--bg-color","var(--main-color)"),s.style.setProperty("--border","none"),s.style.setProperty("--height","5.6rem"),s.style.setProperty("--width","24rem"),s.style.setProperty("--min-width","auto"),s.style.setProperty("--padding","0 0"),s.style.setProperty("--pointer-events","auto");const r=this.createElement("div","enter-btn-text col"),a=this.createElement("p",void 0,"入場する"),o=this.createElement("p",void 0,"（係員以外操作無効）");return s.appendChild(r),r.appendChild(a),r.appendChild(o),this.$e(s,"v-aff61f2a"),t.appendChild(e),t.appendChild(s),this.$e(t,"v-443e3254"),s.addEventListener("click",(()=>this.sn())),t}sn(){const t=document.querySelector(".main");if(!t)return requestAnimationFrame((()=>this.rn()));t.prepend(this.an())}an(){const t=this.createElement("div","modal__outer modal__outer");this.Se(t,"v-443e3254");const e=this.createElement("div","modal"),i=this.createElement("div","close"),n=this.createElement("img","close-btn");n.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDZMNiAxOCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNiA2TDE4IDE4IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",n.alt="x",i.appendChild(n),i.addEventListener("click",(()=>t.remove()));const s=this.createElement("div");s.appendChild(this.createElement("p","modal-title red","必ず係員が操作してください")),s.appendChild(this.createElement("p","modal-title","本当に入場しますか？")),this.$e(s,"v-443e3254");const r=this.createElement("p","modal-detail","この操作は取り消せません．<br>誤って「入場する」を押した場合、<br>入場できなくなる場合がございます．");this.$e(r,"v-443e3254");const a=this.createElement("div","modal-btn__row"),o=this._e("キャンセル","btn",(()=>t.remove())),c=this._e("入場する","btn",(()=>{t.remove(),this.rn()}));return o.style.setProperty("--color","var(--black1)"),o.style.setProperty("--bg-color","var(--white2)"),c.style.setProperty("--color","var(--white1)"),c.style.setProperty("--bg-color","var(--main-color)"),a.appendChild(o),a.appendChild(c),this.$e(a,"v-443e3254"),e.appendChild(i),e.appendChild(s),e.appendChild(r),e.appendChild(a),t.appendChild(e),this.$e(t,"v-3d6609a2"),t}rn(){this.store.commit(n.$t,!0),setTimeout((()=>{this.store.commit(n.$t,!1)}),1e3)}cn(){const t=this.createElement("div","entered-stamp");t.appendChild(this.createElement("p","entered-at","入場済")),t.appendChild(this.createElement("p","entered-at rotated","入場済"));const e=this.createElement("div","outer-circle");return e.appendChild(this.createElement("p","fs36","19:00")),t.appendChild(e),t.appendChild(this.createElement("p","circle-big")),t.appendChild(this.createElement("p","circle-mid")),t.appendChild(this.createElement("p","circle-small")),this.$e(t,"v-443e3254"),t}}class c extends r{constructor(t){super(t),this.run=!0,this.init()}async init(){await this.Ot(),this.ce(),await Promise.all([super.init(),this.me()]),this.oi()}hn=this.createElement("div","entries");ln=new Set;oi(){const t=this.createElement("div","main__contents");this.Se(t,"v-6adabd6e");const e=this.createElement("div","col"),i=this.createElement("p","en","Entries"),n=this.createElement("div","jp__outer"),s=this.createElement("h1","jp","応募一覧");this.Se(this.hn,"v-6adabd6e"),n.appendChild(s),e.appendChild(i),e.appendChild(n),this.$e(e,"v-57275cba"),t.appendChild(e),t.appendChild(this.hn),this.dn(),this.un(t)}un(t){const e=document.querySelector(".main");if(!e)return requestAnimationFrame((()=>this.un(t)));e.innerHTML="",e.appendChild(t)}dn(){if(this.te.forEach((t=>{this.ln.has(t.k)||(this.hn.appendChild(this.pn(t)),this.ln.add(t.k))})),!this.re)return requestAnimationFrame((()=>this.dn()))}pn(t){const e=this.createElement("div","apply-list__item");this.Se(e,"v-6adabd6e");const i=this.createElement("div","card--application"),n=this.mn(t),s=this.createElement("div","application-detail__wrapper"),r=this.createElement("h2","fs16 lh150 fw6",t.event.name),a=this.xe("申込ID",t.k),o=t.P.toLocaleDateString(),c=t.P.toLocaleTimeString("ja-JP",{M:"2-digit",R:"2-digit",B:"2-digit",Pe:!1}),h=t.P.getMilliseconds(),l=this.xe("申込日時",`${o} ${c}.${h}`);return s.appendChild(r),s.appendChild(a),s.appendChild(l),t.S&&s.appendChild(this.xe("整理番号",t.S.map((e=>`${t.F.prefix}-${e}`)).join(", "))),i.appendChild(n),i.appendChild(s),this.$e(i,"v-2d946641"),e.appendChild(i),e.addEventListener("click",(()=>this.Ie(t))),e}mn(t){const e=this.createElement("p","application-status",this.bi(t)),{text:i,label:n}=this.yi(t.status);return e.style.setProperty("--text-color",`var(--${i})`),e.style.setProperty("--label-color",`var(--${n})`),e}bi(t){switch(t.status){case"konbiniWait":return"入金待ち";case"konbiniApplied":return"申込完了(コンビニ)";case"requiresCapture":return"申込完了(無銭)";case"deposited":return"first"===t.ki?"入金済み":"lottery"===t.ki?"当選":"入金済み(不明)";case"lose":return"落選";case"ticketed":return"チケット発券済";case"cancel":return"キャンセル";case"unpaid":return"入金期限切れ";default:return"不明"}}yi(t){switch(t){case"konbiniWait":return{text:"orange1",label:"orange2"};case"konbiniApplied":return{text:"blue1",label:"blue2"};case"requiresCapture":return{text:"brown1",label:"brown2"};case"deposited":return{text:"purple1",label:"purple2"};case"lose":return{text:"pink1",label:"pink2"};case"ticketed":return{text:"green1",label:"green2"};case"cancel":return{text:"yellow1",label:"yellow2"};case"unpaid":return{text:"red1",label:"red2"};default:return{text:"black2",label:"white3"}}}}class h extends r{constructor(t){super(t),this.run=!0,this.init()}async init(){await Promise.all([super.init(),this.me()]),this.wn(!1),this.update()}count=null;vn=null;index=null;async gn(t,e){return new Promise(((i,n)=>{const s=this.count||(this.count=document.getElementById(t)),r=this.vn||(this.vn=window.$nuxt.$store.getters["Xt"]),{bn:a,fn:o}=this.index||(this.index=r.flatMap((t=>t.Bt.flatMap(((t,e)=>t.Ht.map(((t,i)=>({bn:e,fn:i,Zt:t}))))))).find((({Zt:e})=>e.id===t))),c=document.querySelectorAll(".card")[a]?.querySelectorAll(".ticket-type")[o];s&&s.value!==e?(s.value=e,s.dispatchEvent(new Event("change")),s.closest(".card").querySelector(".btn").click(),i()):c&&c.classList.contains("ticket-type--sold-out")?n({title:"枚数選択失敗",detail:"チケットが売り切れました。"}):requestAnimationFrame((()=>this.gn(t,e).then(i).catch(n)))}))}yn={};async kn(t){return new Promise(((e,i)=>{const n=this.yn;Object.entries(t).filter((([t,e])=>!n[t])).forEach((([t,e])=>{const i=document.getElementById(t);i&&(i.value=e,i.dispatchEvent(new Event("change")),n[t]=i)})),Object.entries(t).every((([t,e])=>n[t]?.value===e))?e():Object.entries(t).some((([t,e])=>""===n[t]?.value))?i({title:"お目当て選択失敗",detail:"お目当ての選択肢が無効です。"}):requestAnimationFrame((()=>this.kn(t).then(e).catch(i)))}))}Sn=null;$n=null;Tn=null;Dn=null;async An(t,e,i){return new Promise(((n,s)=>{const r=this.Sn||(this.Sn=document.querySelector("label[for='konbini']"));if(r&&!r.dataset.checked)return r.click(),r.dataset.checked="true",requestAnimationFrame((()=>this.An(t,e,i).then(n).catch(s)));const a=this.$n||(this.$n=document.getElementById("konbini-name")),o=this.Tn||(this.Tn=document.getElementById("konbini-kana")),c=this.Dn||(this.Dn=document.getElementById("konbini-tel"));a&&a.value!==t&&(a.value=t,a.dispatchEvent(new Event("input"))),o&&o.value!==e&&(o.value=e,o.dispatchEvent(new Event("input"))),c&&c.value!==i&&(c.value=i,c.dispatchEvent(new Event("input"))),a?.value===t&&o?.value===e&&c?.value===i?n():requestAnimationFrame((()=>this.An(t,e,i).then(n).catch(s)))}))}async _n(t){return new Promise(((e,i)=>{location.href.includes(t)?e():requestAnimationFrame((()=>this._n(t).then(e).catch(i)))}))}async In(){return new Promise(((t,e)=>{document.querySelector(".loading-cover")?requestAnimationFrame((()=>this.In().then(t).catch(e))):t()}))}async xn(){return new Promise(((t,e)=>{const i=document.querySelector(".btn");i?(i.style.zIndex="4000000000",i.click(),t()):requestAnimationFrame((()=>this.xn().then(t).catch(e)))}))}async Cn(t,e){if(this.enabled)return new Promise(((i,n)=>{const s=Date.now();if(e?.(t-s),t<s)i();else if(s+1e3<t)setTimeout((()=>this.Cn(t,e).then(i).catch(n)),100);else{for(;Date.now()<t;);i()}}))}Pn=null;jn=null;Nn(t){const e=this.Pn||(this.Pn=document.querySelector(".main__contents > .col p")),i=this.jn||(this.jn=document.querySelector(".main__contents > .col h1")),n=t<0?"00:00:00.000":`${Math.floor(t/36e5).toString().padStart(2,"0")}:${Math.floor(t%36e5/6e4).toString().padStart(2,"0")}:${Math.floor(t%6e4/1e3).toString().padStart(2,"0")}.${(t%1e3).toString().padStart(3,"0")}`;e&&(e.textContent="Reservation"),i&&(i.textContent=t<1e3?"Reserving":`Start in \n ${n}`)}Jn(t,e){const i=this.Pn||(this.Pn=document.querySelector(".main__contents > .col p")),n=this.jn||(this.jn=document.querySelector(".main__contents > .col h1"));if(!i||!n)return requestAnimationFrame((()=>this.Jn(t,e)));i&&(i.textContent=t),n&&(n.textContent=e)}async wn(t){t&&(this.enabled=!this.enabled,localStorage.setItem("diver.apply.enabled",this.enabled?"true":"false"),localStorage.setItem("diver.apply.running",this.enabled?"true":"false")),this.enabled?(this.Jn("自動申込有効","自動申込が有効に設定されました。"),this.On()):this.Jn("自動申込無効","自動申込が無効に設定されました。")}En=!0;Fn(){this.test()}enabled=!1;async On(){if(this.enabled="true"===localStorage.getItem("diver.apply.enabled"),!this.enabled)return this.Jn("自動申込無効","自動申込が無効に設定されています。");const t=JSON.parse(localStorage.getItem("diver.apply.ticket")??"null");if(!t)return this.Jn("チケット選択失敗","チケットが選択されていません。");const e=JSON.parse(localStorage.getItem("diver.apply.count")??"null");if(!e)return this.Jn("枚数選択失敗","枚数が選択されていません。");const i=JSON.parse(localStorage.getItem("diver.apply.customizes")??"{}");return await this.jt()?(await this.Vt(t.e.id)||await this.Yt(t.e.id),(await this.Qt()).some((e=>e.id===t.e.id))?(await this.Cn(t.g.be,this.Nn.bind(this)),void(this.enabled&&(await this.Pt(`/event/${t.e.url}`),await this.gn(t.Zt.id,e.toString()),await this.kn(i),0!==t.Zt.Si&&await this.An("西山大地","にしやまだいち","08045450721"),await this.In(),await this.xn(),await this._n("/apply/done"),localStorage.setItem("diver.apply.enabled","false"),localStorage.setItem("diver.apply.running","false"),await this.ae(),await this.oe(),this.Ie(this.te[0]),(0,s.m)(this.te[0],this.email??"Unknown")))):this.Jn("お気に入り登録失敗","お気に入り登録に失敗しました。")):this.Jn("未ログイン","ログインが必要です。")}run=!1;async update(){if(this.run)return this.Wn||await this.Ln(),this.qn||await this.Un(),this.Mn||await this.Rn(),new Promise(((t,e)=>requestAnimationFrame((()=>this.update().then(t).catch(e)))))}Wn=!1;async Ln(){const t=this.Pn||(this.Pn=document.querySelector(".main__contents > .col p"));t&&!this.Wn&&(t.addEventListener("click",this.wn.bind(this,!0)),this.Wn=!0)}qn=!1;async Un(){const t=this.jn||(this.jn=document.querySelector(".main__contents > .col h1"));t&&!this.qn&&(t.addEventListener("click",this.Fn.bind(this)),this.qn=!0)}Bn=null;Mn=!1;async Rn(){const t=JSON.parse(localStorage.getItem("diver.apply.ticket")??"null");if(!t)return;const e=this.Bn||(this.Bn=document.querySelector(`a.event-info[href="/event/${t.e.url}"]`));e&&(e.style.border="1px solid #e83b47",this.Mn=!0)}xt(){super.xt(),this.run=!1,localStorage.setItem("diver.apply.enabled","false"),this.enabled=!1}}new class{Hn=null;It=window.$nuxt.$store;_t;commit;constructor(){this._t=this.It._t,this.commit=this.It.commit,this.Zn(),this.zn(),window.$nuxt.$store.$router.afterEach((()=>this.zn()))}Zn(){this.It._t=(t,e)=>this._t.call(this.It,t,e),this.It.commit=(t,e)=>this.commit.call(this.It,t,e)}xt(){this.Hn?.xt(),this.Hn=null}zn(){const t=window.$nuxt._route.name,e="true"===localStorage.getItem("diver.apply.running");switch(t){case"event-url":if(e)break;this.xt(),this.Hn=new a(this);break;case"favorite":this.xt(),this.Hn=new h(this);break;case"application":this.xt(),this.Hn=new c(this);break;case"ticket-id":this.xt(),this.Hn=new o(this);break;default:this.xt()}}}})()})();