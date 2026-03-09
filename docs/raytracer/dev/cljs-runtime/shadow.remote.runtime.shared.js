goog.provide('shadow.remote.runtime.shared');
shadow.remote.runtime.shared.init_state = (function shadow$remote$runtime$shared$init_state(client_info){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),(0),new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.PersistentArrayMap.EMPTY], null);
});
shadow.remote.runtime.shared.now = (function shadow$remote$runtime$shared$now(){
return Date.now();
});
shadow.remote.runtime.shared.get_client_id = (function shadow$remote$runtime$shared$get_client_id(p__28468){
var map__28469 = p__28468;
var map__28469__$1 = cljs.core.__destructure_map(map__28469);
var runtime = map__28469__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28469__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var or__5045__auto__ = new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("runtime has no assigned runtime-id",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null));
}
});
shadow.remote.runtime.shared.relay_msg = (function shadow$remote$runtime$shared$relay_msg(runtime,msg){
var self_id_28783 = shadow.remote.runtime.shared.get_client_id(runtime);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(msg),self_id_28783)){
shadow.remote.runtime.api.relay_msg(runtime,msg);
} else {
Promise.resolve((1)).then((function (){
var G__28481 = runtime;
var G__28482 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"from","from",1815293044),self_id_28783);
return (shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2 ? shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2(G__28481,G__28482) : shadow.remote.runtime.shared.process.call(null, G__28481,G__28482));
}));
}

return msg;
});
shadow.remote.runtime.shared.reply = (function shadow$remote$runtime$shared$reply(runtime,p__28488,res){
var map__28489 = p__28488;
var map__28489__$1 = cljs.core.__destructure_map(map__28489);
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28489__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28489__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var res__$1 = (function (){var G__28490 = res;
var G__28490__$1 = (cljs.core.truth_(call_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28490,new cljs.core.Keyword(null,"call-id","call-id",1043012968),call_id):G__28490);
if(cljs.core.truth_(from)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28490__$1,new cljs.core.Keyword(null,"to","to",192099007),from);
} else {
return G__28490__$1;
}
})();
return shadow.remote.runtime.api.relay_msg(runtime,res__$1);
});
shadow.remote.runtime.shared.call = (function shadow$remote$runtime$shared$call(var_args){
var G__28492 = arguments.length;
switch (G__28492) {
case 3:
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3 = (function (runtime,msg,handlers){
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4(runtime,msg,handlers,(0));
}));

(shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4 = (function (p__28493,msg,handlers,timeout_after_ms){
var map__28494 = p__28493;
var map__28494__$1 = cljs.core.__destructure_map(map__28494);
var runtime = map__28494__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28494__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
if(cljs.core.map_QMARK_(msg)){
} else {
throw (new Error("Assert failed: (map? msg)"));
}

if(cljs.core.map_QMARK_(handlers)){
} else {
throw (new Error("Assert failed: (map? handlers)"));
}

if(cljs.core.nat_int_QMARK_(timeout_after_ms)){
} else {
throw (new Error("Assert failed: (nat-int? timeout-after-ms)"));
}

var call_id = new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,cljs.core.update,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),cljs.core.inc);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),call_id], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"handlers","handlers",79528781),handlers,new cljs.core.Keyword(null,"called-at","called-at",607081160),shadow.remote.runtime.shared.now(),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg,new cljs.core.Keyword(null,"timeout","timeout",-318625318),timeout_after_ms], null));

return shadow.remote.runtime.api.relay_msg(runtime,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"call-id","call-id",1043012968),call_id));
}));

(shadow.remote.runtime.shared.call.cljs$lang$maxFixedArity = 4);

shadow.remote.runtime.shared.trigger_BANG_ = (function shadow$remote$runtime$shared$trigger_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28821 = arguments.length;
var i__5770__auto___28822 = (0);
while(true){
if((i__5770__auto___28822 < len__5769__auto___28821)){
args__5775__auto__.push((arguments[i__5770__auto___28822]));

var G__28829 = (i__5770__auto___28822 + (1));
i__5770__auto___28822 = G__28829;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});

(shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__28507,ev,args){
var map__28508 = p__28507;
var map__28508__$1 = cljs.core.__destructure_map(map__28508);
var runtime = map__28508__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28508__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var seq__28509 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28512 = null;
var count__28513 = (0);
var i__28514 = (0);
while(true){
if((i__28514 < count__28513)){
var ext = chunk__28512.cljs$core$IIndexed$_nth$arity$2(null, i__28514);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28862 = seq__28509;
var G__28863 = chunk__28512;
var G__28864 = count__28513;
var G__28865 = (i__28514 + (1));
seq__28509 = G__28862;
chunk__28512 = G__28863;
count__28513 = G__28864;
i__28514 = G__28865;
continue;
} else {
var G__28870 = seq__28509;
var G__28871 = chunk__28512;
var G__28872 = count__28513;
var G__28873 = (i__28514 + (1));
seq__28509 = G__28870;
chunk__28512 = G__28871;
count__28513 = G__28872;
i__28514 = G__28873;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28509);
if(temp__5823__auto__){
var seq__28509__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28509__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28509__$1);
var G__28883 = cljs.core.chunk_rest(seq__28509__$1);
var G__28884 = c__5568__auto__;
var G__28885 = cljs.core.count(c__5568__auto__);
var G__28886 = (0);
seq__28509 = G__28883;
chunk__28512 = G__28884;
count__28513 = G__28885;
i__28514 = G__28886;
continue;
} else {
var ext = cljs.core.first(seq__28509__$1);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28893 = cljs.core.next(seq__28509__$1);
var G__28894 = null;
var G__28895 = (0);
var G__28896 = (0);
seq__28509 = G__28893;
chunk__28512 = G__28894;
count__28513 = G__28895;
i__28514 = G__28896;
continue;
} else {
var G__28901 = cljs.core.next(seq__28509__$1);
var G__28902 = null;
var G__28903 = (0);
var G__28904 = (0);
seq__28509 = G__28901;
chunk__28512 = G__28902;
count__28513 = G__28903;
i__28514 = G__28904;
continue;
}
}
} else {
return null;
}
}
break;
}
}));

(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$applyTo = (function (seq28500){
var G__28501 = cljs.core.first(seq28500);
var seq28500__$1 = cljs.core.next(seq28500);
var G__28502 = cljs.core.first(seq28500__$1);
var seq28500__$2 = cljs.core.next(seq28500__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28501,G__28502,seq28500__$2);
}));

shadow.remote.runtime.shared.welcome = (function shadow$remote$runtime$shared$welcome(p__28527,p__28528){
var map__28530 = p__28527;
var map__28530__$1 = cljs.core.__destructure_map(map__28530);
var runtime = map__28530__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28530__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28531 = p__28528;
var map__28531__$1 = cljs.core.__destructure_map(map__28531);
var msg = map__28531__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28531__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.assoc,new cljs.core.Keyword(null,"client-id","client-id",-464622140),client_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"welcome","welcome",-578152123),true], 0));

var map__28537 = cljs.core.deref(state_ref);
var map__28537__$1 = cljs.core.__destructure_map(map__28537);
var client_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28537__$1,new cljs.core.Keyword(null,"client-info","client-info",1958982504));
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28537__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
shadow.remote.runtime.shared.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"hello","hello",-245025397),new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info], null));

return shadow.remote.runtime.shared.trigger_BANG_(runtime,new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125));
});
shadow.remote.runtime.shared.ping = (function shadow$remote$runtime$shared$ping(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"pong","pong",-172484958)], null));
});
shadow.remote.runtime.shared.request_supported_ops = (function shadow$remote$runtime$shared$request_supported_ops(p__28544,msg){
var map__28546 = p__28544;
var map__28546__$1 = cljs.core.__destructure_map(map__28546);
var runtime = map__28546__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28546__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"supported-ops","supported-ops",337914702),new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.disj.cljs$core$IFn$_invoke$arity$variadic(cljs.core.set(cljs.core.keys(new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))),new cljs.core.Keyword(null,"welcome","welcome",-578152123),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),new cljs.core.Keyword(null,"tool-disconnect","tool-disconnect",189103996)], 0))], null));
});
shadow.remote.runtime.shared.unknown_relay_op = (function shadow$remote$runtime$shared$unknown_relay_op(msg){
return console.warn("unknown-relay-op",msg);
});
shadow.remote.runtime.shared.unknown_op = (function shadow$remote$runtime$shared$unknown_op(msg){
return console.warn("unknown-op",msg);
});
shadow.remote.runtime.shared.add_extension_STAR_ = (function shadow$remote$runtime$shared$add_extension_STAR_(p__28559,key,p__28560){
var map__28561 = p__28559;
var map__28561__$1 = cljs.core.__destructure_map(map__28561);
var state = map__28561__$1;
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28561__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
var map__28562 = p__28560;
var map__28562__$1 = cljs.core.__destructure_map(map__28562);
var spec = map__28562__$1;
var ops = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28562__$1,new cljs.core.Keyword(null,"ops","ops",1237330063));
var transit_write_handlers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28562__$1,new cljs.core.Keyword(null,"transit-write-handlers","transit-write-handlers",1886308716));
if(cljs.core.contains_QMARK_(extensions,key)){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("extension already registered",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"spec","spec",347520401),spec], null));
} else {
}

return cljs.core.reduce_kv((function (state__$1,op_kw,op_handler){
if(cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op_kw], null)))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("op already registered",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"op","op",-1882987955),op_kw], null));
} else {
}

return cljs.core.assoc_in(state__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op_kw], null),op_handler);
}),cljs.core.assoc_in(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),key], null),spec),ops);
});
shadow.remote.runtime.shared.add_extension = (function shadow$remote$runtime$shared$add_extension(p__28577,key,spec){
var map__28580 = p__28577;
var map__28580__$1 = cljs.core.__destructure_map(map__28580);
var runtime = map__28580__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28580__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,shadow.remote.runtime.shared.add_extension_STAR_,key,spec);

var temp__5827__auto___28951 = new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125).cljs$core$IFn$_invoke$arity$1(spec);
if((temp__5827__auto___28951 == null)){
} else {
var on_welcome_28954 = temp__5827__auto___28951;
if(cljs.core.truth_(new cljs.core.Keyword(null,"welcome","welcome",-578152123).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))){
(on_welcome_28954.cljs$core$IFn$_invoke$arity$0 ? on_welcome_28954.cljs$core$IFn$_invoke$arity$0() : on_welcome_28954.call(null, ));
} else {
}
}

return runtime;
});
shadow.remote.runtime.shared.add_defaults = (function shadow$remote$runtime$shared$add_defaults(runtime){
return shadow.remote.runtime.shared.add_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.shared","defaults","shadow.remote.runtime.shared/defaults",-1821257543),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"welcome","welcome",-578152123),(function (p1__28587_SHARP_){
return shadow.remote.runtime.shared.welcome(runtime,p1__28587_SHARP_);
}),new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),(function (p1__28588_SHARP_){
return shadow.remote.runtime.shared.unknown_relay_op(p1__28588_SHARP_);
}),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),(function (p1__28589_SHARP_){
return shadow.remote.runtime.shared.unknown_op(p1__28589_SHARP_);
}),new cljs.core.Keyword(null,"ping","ping",-1670114784),(function (p1__28590_SHARP_){
return shadow.remote.runtime.shared.ping(runtime,p1__28590_SHARP_);
}),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),(function (p1__28591_SHARP_){
return shadow.remote.runtime.shared.request_supported_ops(runtime,p1__28591_SHARP_);
})], null)], null));
});
shadow.remote.runtime.shared.del_extension_STAR_ = (function shadow$remote$runtime$shared$del_extension_STAR_(state,key){
var ext = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),key], null));
if(cljs.core.not(ext)){
return state;
} else {
return cljs.core.reduce_kv((function (state__$1,op_kw,op_handler){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(state__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063)], null),cljs.core.dissoc,op_kw);
}),cljs.core.update.cljs$core$IFn$_invoke$arity$4(state,new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.dissoc,key),new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(ext));
}
});
shadow.remote.runtime.shared.del_extension = (function shadow$remote$runtime$shared$del_extension(p__28621,key){
var map__28622 = p__28621;
var map__28622__$1 = cljs.core.__destructure_map(map__28622);
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28622__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(state_ref,shadow.remote.runtime.shared.del_extension_STAR_,key);
});
shadow.remote.runtime.shared.unhandled_call_result = (function shadow$remote$runtime$shared$unhandled_call_result(call_config,msg){
return console.warn("unhandled call result",msg,call_config);
});
shadow.remote.runtime.shared.unhandled_client_not_found = (function shadow$remote$runtime$shared$unhandled_client_not_found(p__28630,msg){
var map__28631 = p__28630;
var map__28631__$1 = cljs.core.__destructure_map(map__28631);
var runtime = map__28631__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28631__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic(runtime,new cljs.core.Keyword(null,"on-client-not-found","on-client-not-found",-642452849),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([msg], 0));
});
shadow.remote.runtime.shared.reply_unknown_op = (function shadow$remote$runtime$shared$reply_unknown_op(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg], null));
});
shadow.remote.runtime.shared.process = (function shadow$remote$runtime$shared$process(p__28666,p__28667){
var map__28668 = p__28666;
var map__28668__$1 = cljs.core.__destructure_map(map__28668);
var runtime = map__28668__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28668__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28669 = p__28667;
var map__28669__$1 = cljs.core.__destructure_map(map__28669);
var msg = map__28669__$1;
var op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28669__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28669__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var state = cljs.core.deref(state_ref);
var op_handler = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ops","ops",1237330063),op], null));
if(cljs.core.truth_(call_id)){
var cfg = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),call_id], null));
var call_handler = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cfg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"handlers","handlers",79528781),op], null));
if(cljs.core.truth_(call_handler)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.update,new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.dissoc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([call_id], 0));

return (call_handler.cljs$core$IFn$_invoke$arity$1 ? call_handler.cljs$core$IFn$_invoke$arity$1(msg) : call_handler.call(null, msg));
} else {
if(cljs.core.truth_(op_handler)){
return (op_handler.cljs$core$IFn$_invoke$arity$1 ? op_handler.cljs$core$IFn$_invoke$arity$1(msg) : op_handler.call(null, msg));
} else {
return shadow.remote.runtime.shared.unhandled_call_result(cfg,msg);

}
}
} else {
if(cljs.core.truth_(op_handler)){
return (op_handler.cljs$core$IFn$_invoke$arity$1 ? op_handler.cljs$core$IFn$_invoke$arity$1(msg) : op_handler.call(null, msg));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-not-found","client-not-found",-1754042614),op)){
return shadow.remote.runtime.shared.unhandled_client_not_found(runtime,msg);
} else {
return shadow.remote.runtime.shared.reply_unknown_op(runtime,msg);

}
}
}
});
shadow.remote.runtime.shared.run_on_idle = (function shadow$remote$runtime$shared$run_on_idle(state_ref){
var seq__28718 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28720 = null;
var count__28721 = (0);
var i__28722 = (0);
while(true){
if((i__28722 < count__28721)){
var map__28743 = chunk__28720.cljs$core$IIndexed$_nth$arity$2(null, i__28722);
var map__28743__$1 = cljs.core.__destructure_map(map__28743);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28743__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__29001 = seq__28718;
var G__29002 = chunk__28720;
var G__29003 = count__28721;
var G__29004 = (i__28722 + (1));
seq__28718 = G__29001;
chunk__28720 = G__29002;
count__28721 = G__29003;
i__28722 = G__29004;
continue;
} else {
var G__29009 = seq__28718;
var G__29010 = chunk__28720;
var G__29011 = count__28721;
var G__29012 = (i__28722 + (1));
seq__28718 = G__29009;
chunk__28720 = G__29010;
count__28721 = G__29011;
i__28722 = G__29012;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28718);
if(temp__5823__auto__){
var seq__28718__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28718__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28718__$1);
var G__29023 = cljs.core.chunk_rest(seq__28718__$1);
var G__29024 = c__5568__auto__;
var G__29025 = cljs.core.count(c__5568__auto__);
var G__29026 = (0);
seq__28718 = G__29023;
chunk__28720 = G__29024;
count__28721 = G__29025;
i__28722 = G__29026;
continue;
} else {
var map__28751 = cljs.core.first(seq__28718__$1);
var map__28751__$1 = cljs.core.__destructure_map(map__28751);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28751__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__29034 = cljs.core.next(seq__28718__$1);
var G__29035 = null;
var G__29036 = (0);
var G__29037 = (0);
seq__28718 = G__29034;
chunk__28720 = G__29035;
count__28721 = G__29036;
i__28722 = G__29037;
continue;
} else {
var G__29038 = cljs.core.next(seq__28718__$1);
var G__29039 = null;
var G__29040 = (0);
var G__29041 = (0);
seq__28718 = G__29038;
chunk__28720 = G__29039;
count__28721 = G__29040;
i__28722 = G__29041;
continue;
}
}
} else {
return null;
}
}
break;
}
});

//# sourceMappingURL=shadow.remote.runtime.shared.js.map
