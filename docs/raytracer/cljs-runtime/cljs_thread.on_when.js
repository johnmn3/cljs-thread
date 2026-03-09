goog.provide('cljs_thread.on_when');
cljs_thread.on_when.wait_until = (function cljs_thread$on_when$wait_until(condition,p__25829){
var map__25830 = p__25829;
var map__25830__$1 = cljs.core.__destructure_map(map__25830);
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25830__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
var duration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25830__$1,new cljs.core.Keyword(null,"duration","duration",1444101068));
var max_time = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25830__$1,new cljs.core.Keyword(null,"max-time","max-time",857408479));
var timeout_resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25830__$1,new cljs.core.Keyword(null,"timeout-resolve","timeout-resolve",1276697216));
var timeout_data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25830__$1,new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365));
var duration__$1 = (function (){var or__5045__auto__ = duration;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (2);
}
})();
var max_time__$1 = (function (){var or__5045__auto__ = max_time;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (10000);
}
})();
var start_time = (new Date()).getTime();
var temp__5821__auto__ = (condition.cljs$core$IFn$_invoke$arity$0 ? condition.cljs$core$IFn$_invoke$arity$0() : condition.call(null, ));
if(cljs.core.truth_(temp__5821__auto__)){
var result = temp__5821__auto__;
if(cljs.core.truth_(resolve)){
return Promise.resolve((resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(result) : resolve.call(null, result)));
} else {
return Promise.resolve(result);
}
} else {
return (new Promise((function (resolve_STAR_,reject){
var timer_id = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var interval_fn = (function (){
var time_passed = ((new Date()).getTime() - start_time);
var temp__5821__auto____$1 = (condition.cljs$core$IFn$_invoke$arity$0 ? condition.cljs$core$IFn$_invoke$arity$0() : condition.call(null, ));
if(cljs.core.truth_(temp__5821__auto____$1)){
var result = temp__5821__auto____$1;
clearInterval(cljs.core.deref(timer_id));

if(cljs.core.truth_(resolve)){
var G__25835 = (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(result) : resolve.call(null, result));
return (resolve_STAR_.cljs$core$IFn$_invoke$arity$1 ? resolve_STAR_.cljs$core$IFn$_invoke$arity$1(G__25835) : resolve_STAR_.call(null, G__25835));
} else {
return (resolve_STAR_.cljs$core$IFn$_invoke$arity$1 ? resolve_STAR_.cljs$core$IFn$_invoke$arity$1(result) : resolve_STAR_.call(null, result));
}
} else {
if((time_passed > max_time__$1)){
clearInterval(cljs.core.deref(timer_id));

if(cljs.core.truth_(timeout_resolve)){
var G__25839 = (timeout_resolve.cljs$core$IFn$_invoke$arity$0 ? timeout_resolve.cljs$core$IFn$_invoke$arity$0() : timeout_resolve.call(null, ));
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(G__25839) : resolve.call(null, G__25839));
} else {
var G__25840 = (new Error(["Timed out: \n","in: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)),"\n","Condition:\n",cljs.core.str.cljs$core$IFn$_invoke$arity$1(condition),"\nTimeout-data:\n",cljs.core.str.cljs$core$IFn$_invoke$arity$1(timeout_data)].join('')));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__25840) : reject.call(null, G__25840));
}
} else {
return null;
}
}
});
return cljs.core.reset_BANG_(timer_id,setInterval(interval_fn,duration__$1));
})));
}
});
cljs_thread.on_when.do_on_when = (function cljs_thread$on_when$do_on_when(pred,opts,afn){
return cljs_thread.on_when.wait_until(pred,opts).then(afn);
});
goog.exportSymbol('cljs_thread.on_when.do_on_when', cljs_thread.on_when.do_on_when);
cljs_thread.on_when.watch_until = (function cljs_thread$on_when$watch_until(atm,pred,p__25851){
var map__25852 = p__25851;
var map__25852__$1 = cljs.core.__destructure_map(map__25852);
var props = map__25852__$1;
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25852__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
var wkey = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25852__$1,new cljs.core.Keyword(null,"wkey","wkey",647381818));
var timeout_data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25852__$1,new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365));
var max_time = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25852__$1,new cljs.core.Keyword(null,"max-time","max-time",857408479));
var max_time__$1 = (function (){var or__5045__auto__ = max_time;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (30000);
}
})();
var start_time = (new Date()).getTime();
var watch_key = (function (){var or__5045__auto__ = wkey;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return ["wkey-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.hash(pred)),"-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.gensym.cljs$core$IFn$_invoke$arity$0())].join('');
}
})();
if(cljs.core.truth_((function (){var G__25853 = cljs.core.deref(atm);
return (pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(G__25853) : pred.call(null, G__25853));
})())){
if(cljs.core.truth_(resolve)){
return Promise.resolve((resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(true) : resolve.call(null, true)));
} else {
return Promise.resolve(true);
}
} else {
return (new Promise((function (resolve_STAR_,reject){
return cljs.core.add_watch(atm,watch_key,(function (p1__25845_SHARP_,p2__25846_SHARP_,p3__25847_SHARP_,p4__25844_SHARP_){
var time_passed = ((new Date()).getTime() - start_time);
if((!((time_passed < max_time__$1)))){
var error_msg = ["Watch check timed out: \n","in: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)),"\nCondition:\n",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pred),"\nTimeout-data:\n",cljs.core.str.cljs$core$IFn$_invoke$arity$1(timeout_data)].join('');
cljs.core.remove_watch(atm,watch_key);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([error_msg], 0));

var G__25854 = (new Error(error_msg));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__25854) : reject.call(null, G__25854));
} else {
if(cljs.core.truth_((pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(p4__25844_SHARP_) : pred.call(null, p4__25844_SHARP_)))){
cljs.core.remove_watch(atm,watch_key);

if(cljs.core.truth_(resolve)){
var G__25855 = (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(true) : resolve.call(null, true));
return (resolve_STAR_.cljs$core$IFn$_invoke$arity$1 ? resolve_STAR_.cljs$core$IFn$_invoke$arity$1(G__25855) : resolve_STAR_.call(null, G__25855));
} else {
return (resolve_STAR_.cljs$core$IFn$_invoke$arity$1 ? resolve_STAR_.cljs$core$IFn$_invoke$arity$1(true) : resolve_STAR_.call(null, true));
}
} else {
return null;
}
}
}));
})));
}
});
cljs_thread.on_when.do_on_watch = (function cljs_thread$on_when$do_on_watch(atm,pred,opts,afn){
return cljs_thread.on_when.watch_until(atm,pred,opts).then(afn);
});
goog.exportSymbol('cljs_thread.on_when.do_on_watch', cljs_thread.on_when.do_on_watch);

//# sourceMappingURL=cljs_thread.on_when.js.map
