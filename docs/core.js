importScripts("shared.js");
'use strict';function y2(){if("undefined"!==typeof performance&&null!=performance.now)return performance.now();if("undefined"!==typeof process&&null!=process.hrtime){var a=process.hrtime();return(1E9*a[0]+a[1])/1E6}return(new Date).getTime()}function z2(a){return a-1}function A2(a){this.ca=a;this.I=0}A2.prototype.la=function(){return this.I<this.ca.length};A2.prototype.next=function(){var a=this.ca.charAt(this.I);this.I+=1;return a};A2.prototype.remove=function(){return Error("Unsupported operation")};
function B2(a){this.s=a;this.I=0}B2.prototype.la=function(){return this.I<this.s.length};B2.prototype.next=function(){var a=this.s[this.I];this.I+=1;return a};B2.prototype.remove=function(){return Error("Unsupported operation")};
function C2(a){if(pd(a))return Yc(a);if(null==a)return Pf();if("string"===typeof a)return new A2(a);if(ib(a))return new B2(a);var b=null==a;b||(b=(b=null!=a?a.v&8388608||m===a.Xe?!0:a.v?!1:lb(tc,a):lb(tc,a))?b:ib(a)||"string"===typeof a);if(b)return new Sf(a);throw Error(["Cannot create iterator from ",t.g(a)].join(""));}function D2(){return Qi(0,Number.MAX_VALUE)}function E2(a,b,c,d,e){this.meta=a;this.all=b;this.prev=c;this.current=d;this.Sa=e;this.v=26083532;this.J=1}l=E2.prototype;
l.toString=function(){return $c(this)};function F2(a){if(!a.current){var b=H(a.prev);a.current=b?b:a.all}return a.current}l.K=function(){return this.meta};l.ra=function(){return this.xa(null)};l.qa=function(){return sd};l.Qc=function(){return null!=this.current};l.Da=function(a,b){for(var c=this,d=F2(this),e=G(d);;){var f=function(){var g=H(d);return g?g:c.all}();a=function(){var g=e,h=G(f);return b.h?b.h(g,h):b.call(null,g,h)}();if(Cd(a))return u(a);d=f;e=a}};
l.Ea=function(a,b,c){for(var d=this,e=F2(this),f=c;;){c=function(){var g=f,h=G(e);return b.h?b.h(g,h):b.call(null,g,h)}();if(Cd(c))return u(c);e=a=function(){var g=H(e);return g?g:d.all}();f=c}};l.wa=function(){return G(F2(this))};l.xa=function(){null==this.Sa&&(this.Sa=new E2(null,this.all,F2(this),null,null));return this.Sa};l.$=function(){return this};l.M=function(a,b){return b===this.meta?this:new E2(b,this.all,this.prev,this.current,this.Sa)};l.da=function(a,b){return Sd(b,this)};l.ka=m;
l.V=function(a,b,c){return Zi(b,gj,"("," ",")",c,this)};function G2(a){return(a=D(a))?new E2(null,a,null,a,null):sd}
function H2(a,b){var c=new Yf(b);c.bc=function(){var d=function(){function e(g,h){c.buffer=c.buffer.add(h);return g}var f=null;f=function(g,h){switch(arguments.length){case 0:return null;case 1:return g;case 2:return e.call(this,g,h)}throw Error("Invalid arity: "+arguments.length);};f.u=function(){return null};f.g=function(g){return g};f.h=e;return f}();return a.g?a.g(d):a.call(null,d)}();return c}
var I2=function I2(a){return new hf(null,function(){if(a.la())for(var c=[],d=0;;){var e=a.la();if(r(r(e)?32>d:e))c[d]=a.next(),d+=1;else return of(new lf(c,0,d),I2.g?I2.g(a):I2.call(null,a))}else return null},null,null)};function J2(a,b){b=C2(b);a=H2(a,b);a=I2(a);return r(a)?a:sd}function K2(a,b,c){return new hf(null,function(){var d=D(c);return d?Sd(pg.h(a,d),K2(a,b,qg(b,d))):null},null,null)}function L2(a,b){return K2(a,a,b)}function M2(a){bj(kj(a,Za()));r(Ua)&&lj()}
function N2(){var a=function(){var b=u(LH);b=null==b?null:Yq.g(b);return null==b?null:G(b)}();return r(a)?(lg.h(LH,function(b){var c=U(b);b=A.h(c,Yq);c=A.h(c,mm);return new p(null,2,[Yq,je.h(b,a),mm,Yd.h(c,a)],null)}),a):null}function O2(a){lg.h(LH,function(b){var c=U(b);b=A.h(c,Yq);c=A.h(c,mm);return new p(null,2,[Yq,Yd.h(b,a),mm,je.h(c,a)],null)});return null}
function P2(a){var b=Zd,c=V,d=tH();tI(js,M([new X(null,7,5,Y,[b,a,b,d,a,d,d],null),t.g(function(e,f,g,h,k,n,q){return rI(function(){return D(Yq.g(u(LH)))},new p(null,1,[ln,5],null),function(){var v=N2();return tI(v,M([new X(null,8,5,Y,[g,k,g,q,k,q,q,v],null),t.g(function(w,z,E,I,K,P,S,Q){try{if(D(E)){var T=function(Ia){return gI(new p(null,2,[Fy,S,Wv,Ia],null))},xa=Ff(K,E);xa.g?xa.g(T):xa.call(null,T)}else E=function(Ia){return gI(new p(null,2,[Fy,S,Wv,Ia],null))},T=K.u?K.u():K.call(null),T.g?T.g(E):
T.call(null,E)}catch(Ia){gI(new p(null,2,[Fy,S,Wv,new p(null,1,[iu,mj.j(M([Ia]))],null)],null))}return tI(js,M([new X(null,1,5,Y,[Q],null),t.g(function(Ia){return O2(Ia)}),new p(null,1,[rq,!0],null)]))}),new p(null,1,[rq,!0],null)]))})}),new p(null,1,[rq,!0],null)]));hI(xi.j(M([c,new p(null,1,[kA,d],null)])))}
function Q2(a){var b=new X(null,1,5,Y,["local-store"],null),c=tH();tI(Rz,M([new X(null,6,5,Y,[b,a,b,c,a,c],null),t.g(function(d,e,f,g,h,k){function n(q){return gI(new p(null,2,[Fy,k,Wv,q],null))}if(D(f))return d=function(q){return gI(new p(null,2,[Fy,k,Wv,q],null))},f=Ff(h,f),f.g?f.g(d):f.call(null,d);f=h.u?h.u():h.call(null);return f.g?f.g(n):f.call(null,n)}),new p(null,1,[rq,!0],null)]));return eI(c)}
function R2(a){return Ff(dg,W.h(function(b){return le(b)?C.h(1,J(b))?G(b):Ff(G(b),rd(b)):b},a))}function S2(a){var b=R2(a);return function(c){return J2(b,c)}}
function T2(a,b,c){var d=U(c);c=A.h(d,oy);d=A.h(d,ou);var e=Py.h(u(HH),4);c=r(null)?null:r(c)?c:8*e;var f=pg.h(c,G2(TL(Py.h(u(HH),8))));return Ff(tf,zg(function(g){return W.h(Dd,g)},M([W.h(function(g){return Hg(function(h,k){return tI(h,M([new X(null,2,5,Y,[a,k],null),t.g(function(n,q){return J2(n.u?n.u():n.call(null),q)}),V]))},f,g)},L2(c,L2(r(null)?null:r(d)?d:2048,b)))])))}
function U2(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;b=2<b.length?new F(b.slice(2),0,null):null;return T2(arguments[0],arguments[1],b)}function V2(a){return tI(Rz,M([new X(null,2,5,Y,["local-store",a],null),t.g(function(b,c){return bI.j(b,c,M([Ke]))}),new p(null,1,[rq,!0],null)]))}function W2(){return Q2(function(a){return function(b){return cI(a,b)}})}
var X2=new B(null,"initialize-db","initialize-db",230998432),Y2=new y(null,"map","map",-1282745308,null),Z2=new B(null,"description","description",-1428560544),$2=new y(null,"flip","flip",-620564467,null),a3=new B("pricing","footers","pricing/footers",-1207489408),b3=new y(null,"\x3d\x3e\x3e","\x3d\x3e\x3e",-1017293136,null),c3=new B(null,"auth","auth",1389754926),d3=new y(null,"range","range",-1014743483,null),e3=new B(null,"subheader","subheader",-1028810273),f3=new B("account-menu","open","account-menu/open",
-653810079),g3=new y(null,"take","take",871646627,null),h3=new B(null,"price","price",22129180),i3=new B(null,"rollcall","rollcall",-3630169),j3=new B("account-menu","close","account-menu/close",735320589),k3=new B("album","cards","album/cards",344121253),l3=new B(null,"errors","errors",-908790718),m3=new B(null,"button-text","button-text",-1800441720),n3=new B(null,"user-id","user-id",-206822291),o3=new y(null,"large-computation","large-computation",-106973916,null),p3=new B(null,"app-state","app-state",
-1509963278),q3=new B("home-panel","randomize-chart","home-panel/randomize-chart",-1785812427),r3=new B(null,"button-variant","button-variant",-939473245),s3=new B(null,"local-store","local-store",1708979092),t3=new B(null,"time","time",1385887882),u3=new B("pricing","tiers","pricing/tiers",186057845);var v3=function(a){return SM.j(M([kA,Lx,Lx,function(b){var c=ye(Ul.g(b),Rz)?Jg(b,new X(null,2,5,Y,[Ul,Rz],null)):TM(b,Rz),d=TM(b,lu);a.h?a.h(c,d):a.call(null,c,d);return b}]))}(function(a){return V2(a)}),w3=new X(null,2,5,Y,[v3,BN],null);FH()&&QM(nn,s3,function(a){var b=W2();return O.i(a,p3,r(b)?b:V)});
var x3=new p(null,7,[ir,!1,fo,!0,rs,new X(null,5,5,Y,[new p(null,6,[kA,0,Wk,"16 July, 2022",dr,"Restarted",Kz,"Acme Global",Mk,"5bc114e6-15cf-4e99-8251-6c2e0c543337",lm,"e59b5976-256a-4ecc-aeea-a926461c71cd"],null),new p(null,6,[kA,1,Wk,"16 July, 2022",dr,"Heartbeat failed",Kz,"Energy Enterprise",Mk,"b73ff5ab-9fe3-4395-8564-c01f77cb5dac",lm,"d460d8df-132d-4712-a780-641114d9dcf5"],null),new p(null,6,[kA,2,Wk,"16 July, 2022",dr,"Authentication failed",Kz,"General Statistics",Mk,"f4a15ae0-59a5-478a-9958-1ff6a617c363",
lm,"d460d8df-132d-4712-a780-641114d9dcf5"],null),new p(null,6,[kA,3,Wk,"16 July, 2022",dr,"Reconnecting to DB",Kz,"Fusion Star Inc",Mk,"34c50198-c808-4841-b2e1-434be4f09534",lm,"2425173b-4659-49f6-a4ce-8448dcae4475"],null),new p(null,6,[kA,4,Wk,"15 July, 2022",dr,"Purging logs",Kz,"Big Agri Corp",Mk,"a769f187-ee18-46f4-8d65-a2141b4634e2",lm,"2425173b-4659-49f6-a4ce-8448dcae4475"],null)],null),fr,new X(null,9,5,Y,[new p(null,2,[t3,"00:00",lm,0],null),new p(null,2,[t3,"03:00",lm,300],null),new p(null,
2,[t3,"06:00",lm,600],null),new p(null,2,[t3,"09:00",lm,800],null),new p(null,2,[t3,"12:00",lm,1500],null),new p(null,2,[t3,"15:00",lm,2E3],null),new p(null,2,[t3,"18:00",lm,2400],null),new p(null,2,[t3,"21:00",lm,2400],null),new p(null,2,[t3,"24:00",lm,null],null)],null),k3,Qi(1,10),u3,new X(null,3,5,Y,[new p(null,5,[dv,"Free",h3,"0",Z2,new X(null,4,5,Y,["10 users included","2 GB of storage","Help center access","Email support"],null),m3,"Sign up for free",r3,"outlined"],null),new p(null,6,[dv,"Pro",
e3,"Most popular",h3,"15",Z2,new X(null,4,5,Y,["20 users included","10 GB of storage","Help center access","Priority email support"],null),m3,"Get started",r3,"contained"],null),new p(null,5,[dv,"Enterprise",h3,"30",Z2,new X(null,4,5,Y,["50 users included","30 GB of storage","Help center access","Phone \x26 email support"],null),m3,"Contact us",r3,"outlined"],null)],null),a3,new X(null,4,5,Y,[new p(null,2,[dv,"Company",Z2,new X(null,4,5,Y,["Team","History","Contact us","Locations"],null)],null),new p(null,
2,[dv,"Features",Z2,new X(null,5,5,Y,["Cool stuff","Random feature","Team feature","Developer stuff","Another one"],null)],null),new p(null,2,[dv,"Resources",Z2,new X(null,4,5,Y,["Resource","Resource name","Another resource","Final resource"],null)],null),new p(null,2,[dv,"Legal",Z2,new X(null,2,5,Y,["Privacy policy","Terms of use"],null)],null)],null)],null);HN.j(Rz,M([function(a){return a}]));HN.j(ir,M([function(a){return ir.g(a)}]));HN.j(l3,M([function(a){return l3.g(a)}]));
GN(X2,new X(null,1,5,Y,[qN(s3)],null),function(a){a=U(a);A.h(a,Rz);a=A.h(a,p3);return new p(null,1,[Rz,xi.j(M([x3,a]))],null)});FN.i(Ts,w3,function(a,b){N(b,0,null);N(b,1,null);return Mg.i(a,ir,kb)});HN.j(rs,M([function(a){return rs.g(a)}]));HN.j(fr,M([function(a){return fr.g(a)}]));FN.h(q3,function(a){return Mg.i(a,fr,function(b){return function e(d){return new hf(null,function(){for(;;){var f=D(d);if(f){if(re(f)){var g=Qc(f),h=J(g),k=mf(h);a:for(var n=0;;)if(n<h){var q=Jb(g,n);q=t3.g(q);k.add(new p(null,2,[t3,q,lm,Nj(3E3)],null));n+=1}else{g=!0;break a}return g?of(qf(k),e(Rc(f))):of(qf(k),null)}k=G(f);k=t3.g(k);return Sd(new p(null,2,[t3,k,lm,Nj(3E3)],null),e(rd(f)))}return null}},null,null)}(b)})});function y3(a){return fo.g(a)}IN.h?IN.h(fo,y3):IN.call(null,fo,y3);function z3(a){return ip.h(a,!1)}IN.h?IN.h(ip,z3):IN.call(null,ip,z3);FN.i(Gz,w3,function(a){return O.i(a,fo,!0)});FN.i(jx,w3,function(a){return O.i(a,fo,!1)});FN.h(f3,function(a){return O.i(a,ip,!0)});FN.h(j3,function(a){return O.i(a,ip,!1)});FN.h(Tw,function(a){return Mg.i(a,ip,kb)});HN.j(oA,M([ex,new X(null,1,5,Y,[l3],null),function(a){return Zk.g(a)}]));GN(Zk,null,function(a,b){a=U(a);a=A.h(a,Rz);N(b,0,null);b=N(b,1,null);var c=U(b);b=A.h(c,Yl);var d=A.h(c,Bk);c=A.h(c,co);return C.h(d,"top-secret")?new p(null,2,[Rz,Kg(Kg(a,new X(null,2,5,Y,[c3,n3],null),b),new X(null,2,5,Y,[c3,co],null),c),An,new X(null,1,5,Y,[Dm],null)],null):new p(null,1,[Rz,Kg(a,new X(null,2,5,Y,[l3,Zk],null),new p(null,1,[Bk,'Wrong Password! (should be "top-secret")'],null))],null)});
FN.h(Vs,function(a,b){N(b,0,null);b=N(b,1,null);return Lg.C(a,new X(null,2,5,Y,[l3,Zk],null),de,b)});gb();function A3(a){return Ff(dg,pg.h(a,G2(new X(null,2,5,Y,[Ad,z2],null))))}
FH()&&P2(function(){return function(a){var b=function(){Gg(function(c){return tI(c,M([Zd,t.g(function(){return pj.j(M([XL,Dk]))}),V]))},Bg(cg(new Ci(null,new p(null,1,[eu,null],null),null)),Hh(u(JH))));pj.j(M([i3,W.h(Dd,Gg(function(c){return tI(c,M([Zd,t.g(function(){return[t.g(XL),t.g(Dk)].join("")}),V]))},Bg(cg(new Ci(null,new p(null,1,[eu,null],null),null)),Hh(u(JH)))))]));nj.j(M([$e(b3,$e(d3),$e(Y2,$e($2,10)),$e(Y2,$e($2,10)),$e(Y2,$e($2,10)),$e(g3,10)),"\n",vH()?tI(Rk,M([Zd,t.g(function(){return S2(new X(null,
1,5,Y,[new X(null,2,5,Y,[pg,10],null)],null))(function(c){return U2(function(){return R2(new X(null,3,5,Y,[new X(null,2,5,Y,[W,A3(10)],null),new X(null,2,5,Y,[W,A3(10)],null),new X(null,2,5,Y,[W,A3(10)],null)],null))},c)}(D2()))}),V])):S2(new X(null,1,5,Y,[new X(null,2,5,Y,[pg,10],null)],null))(function(c){return U2(function(){return R2(new X(null,3,5,Y,[new X(null,2,5,Y,[W,A3(10)],null),new X(null,2,5,Y,[W,A3(10)],null),new X(null,2,5,Y,[W,A3(10)],null)],null))},c)}(D2()))]));nj.j(M([Bw,o3,"\n",
function(){var c=y2(),d=Ff(Me,pg.h(1E6,W.h(A3(100),W.h(A3(100),W.h(A3(100),D2())))));M2(M([["Elapsed time: ",t.g((y2()-c).toFixed(6))," msecs"].join("")]));return d}()]));return nj.j(M([b3,o3,"\n",vH()?tI(Rk,M([Zd,t.g(function(){var c=y2(),d=Ff(Me,S2(new X(null,1,5,Y,[new X(null,2,5,Y,[pg,1E6],null)],null))(function(e){return U2(function(){return R2(new X(null,3,5,Y,[new X(null,2,5,Y,[W,A3(100)],null),new X(null,2,5,Y,[W,A3(100)],null),new X(null,2,5,Y,[W,A3(100)],null)],null))},e)}(D2())));M2(M([["Elapsed time: ",
t.g((y2()-c).toFixed(6))," msecs"].join("")]));return d}),V])):function(){var c=y2(),d=Ff(Me,S2(new X(null,1,5,Y,[new X(null,2,5,Y,[pg,1E6],null)],null))(function(e){return U2(function(){return R2(new X(null,3,5,Y,[new X(null,2,5,Y,[W,A3(100)],null),new X(null,2,5,Y,[W,A3(100)],null),new X(null,2,5,Y,[W,A3(100)],null)],null))},e)}(D2())));M2(M([["Elapsed time: ",t.g((y2()-c).toFixed(6))," msecs"].join("")]));return d}()]))}();return a.g?a.g(b):a.call(null,b)}});try{if(FH()){var B3=new X(null,1,5,Y,[X2],null);YM(B3);lN(mN,B3)}for(var C3=D(u(ZM)),D3=null,E3=0,F3=0;;)if(F3<E3){var G3=D3.ba(null,F3);N(G3,0,null);var H3=N(G3,1,null);AB(H3);F3+=1}else{var I3=D(C3);if(I3){var J3=I3;if(re(J3)){var K3=Qc(J3),L3=Rc(J3),M3=K3,N3=J(K3);C3=L3;D3=M3;E3=N3}else{var O3=G(J3);N(O3,0,null);var P3=N(O3,1,null);AB(P3);C3=H(J3);D3=null;E3=0}F3=0}else break}r(Of(u(ZM)))&&KM.j(iz,M(["re-frame: The subscription cache isn't empty after being cleared"]))}catch(a){throw console.error("An error occurred when calling (dashboard.core/init!)"),
a;};