goog.provide('shadow.remote.runtime.shared');
shadow.remote.runtime.shared.init_state = (function shadow$remote$runtime$shared$init_state(client_info){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),(0),new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.PersistentArrayMap.EMPTY], null);
});
shadow.remote.runtime.shared.now = (function shadow$remote$runtime$shared$now(){
return Date.now();
});
shadow.remote.runtime.shared.get_client_id = (function shadow$remote$runtime$shared$get_client_id(p__28476){
var map__28477 = p__28476;
var map__28477__$1 = cljs.core.__destructure_map(map__28477);
var runtime = map__28477__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28477__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var or__5045__auto__ = new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("runtime has no assigned runtime-id",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null));
}
});
shadow.remote.runtime.shared.relay_msg = (function shadow$remote$runtime$shared$relay_msg(runtime,msg){
var self_id_28755 = shadow.remote.runtime.shared.get_client_id(runtime);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(msg),self_id_28755)){
shadow.remote.runtime.api.relay_msg(runtime,msg);
} else {
Promise.resolve((1)).then((function (){
var G__28482 = runtime;
var G__28483 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"from","from",1815293044),self_id_28755);
return (shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2 ? shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2(G__28482,G__28483) : shadow.remote.runtime.shared.process.call(null, G__28482,G__28483));
}));
}

return msg;
});
shadow.remote.runtime.shared.reply = (function shadow$remote$runtime$shared$reply(runtime,p__28486,res){
var map__28487 = p__28486;
var map__28487__$1 = cljs.core.__destructure_map(map__28487);
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28487__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28487__$1,new cljs.core.Keyword(null,"from","from",1815293044));
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
var G__28493 = arguments.length;
switch (G__28493) {
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

(shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$4 = (function (p__28495,msg,handlers,timeout_after_ms){
var map__28496 = p__28495;
var map__28496__$1 = cljs.core.__destructure_map(map__28496);
var runtime = map__28496__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28496__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
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
var len__5769__auto___28850 = arguments.length;
var i__5770__auto___28852 = (0);
while(true){
if((i__5770__auto___28852 < len__5769__auto___28850)){
args__5775__auto__.push((arguments[i__5770__auto___28852]));

var G__28861 = (i__5770__auto___28852 + (1));
i__5770__auto___28852 = G__28861;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});

(shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__28515,ev,args){
var map__28516 = p__28515;
var map__28516__$1 = cljs.core.__destructure_map(map__28516);
var runtime = map__28516__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28516__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var seq__28518 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28521 = null;
var count__28522 = (0);
var i__28523 = (0);
while(true){
if((i__28523 < count__28522)){
var ext = chunk__28521.cljs$core$IIndexed$_nth$arity$2(null, i__28523);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28870 = seq__28518;
var G__28871 = chunk__28521;
var G__28872 = count__28522;
var G__28873 = (i__28523 + (1));
seq__28518 = G__28870;
chunk__28521 = G__28871;
count__28522 = G__28872;
i__28523 = G__28873;
continue;
} else {
var G__28875 = seq__28518;
var G__28876 = chunk__28521;
var G__28877 = count__28522;
var G__28878 = (i__28523 + (1));
seq__28518 = G__28875;
chunk__28521 = G__28876;
count__28522 = G__28877;
i__28523 = G__28878;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28518);
if(temp__5823__auto__){
var seq__28518__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28518__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28518__$1);
var G__28879 = cljs.core.chunk_rest(seq__28518__$1);
var G__28880 = c__5568__auto__;
var G__28881 = cljs.core.count(c__5568__auto__);
var G__28882 = (0);
seq__28518 = G__28879;
chunk__28521 = G__28880;
count__28522 = G__28881;
i__28523 = G__28882;
continue;
} else {
var ext = cljs.core.first(seq__28518__$1);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28886 = cljs.core.next(seq__28518__$1);
var G__28887 = null;
var G__28888 = (0);
var G__28889 = (0);
seq__28518 = G__28886;
chunk__28521 = G__28887;
count__28522 = G__28888;
i__28523 = G__28889;
continue;
} else {
var G__28891 = cljs.core.next(seq__28518__$1);
var G__28892 = null;
var G__28893 = (0);
var G__28894 = (0);
seq__28518 = G__28891;
chunk__28521 = G__28892;
count__28522 = G__28893;
i__28523 = G__28894;
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
(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$applyTo = (function (seq28503){
var G__28504 = cljs.core.first(seq28503);
var seq28503__$1 = cljs.core.next(seq28503);
var G__28505 = cljs.core.first(seq28503__$1);
var seq28503__$2 = cljs.core.next(seq28503__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28504,G__28505,seq28503__$2);
}));

shadow.remote.runtime.shared.welcome = (function shadow$remote$runtime$shared$welcome(p__28546,p__28547){
var map__28548 = p__28546;
var map__28548__$1 = cljs.core.__destructure_map(map__28548);
var runtime = map__28548__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28548__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28549 = p__28547;
var map__28549__$1 = cljs.core.__destructure_map(map__28549);
var msg = map__28549__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28549__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.assoc,new cljs.core.Keyword(null,"client-id","client-id",-464622140),client_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"welcome","welcome",-578152123),true], 0));

var map__28554 = cljs.core.deref(state_ref);
var map__28554__$1 = cljs.core.__destructure_map(map__28554);
var client_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28554__$1,new cljs.core.Keyword(null,"client-info","client-info",1958982504));
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28554__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
shadow.remote.runtime.shared.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"hello","hello",-245025397),new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info], null));

return shadow.remote.runtime.shared.trigger_BANG_(runtime,new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125));
});
shadow.remote.runtime.shared.ping = (function shadow$remote$runtime$shared$ping(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"pong","pong",-172484958)], null));
});
shadow.remote.runtime.shared.request_supported_ops = (function shadow$remote$runtime$shared$request_supported_ops(p__28572,msg){
var map__28573 = p__28572;
var map__28573__$1 = cljs.core.__destructure_map(map__28573);
var runtime = map__28573__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28573__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"supported-ops","supported-ops",337914702),new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.disj.cljs$core$IFn$_invoke$arity$variadic(cljs.core.set(cljs.core.keys(new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))),new cljs.core.Keyword(null,"welcome","welcome",-578152123),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),new cljs.core.Keyword(null,"tool-disconnect","tool-disconnect",189103996)], 0))], null));
});
shadow.remote.runtime.shared.unknown_relay_op = (function shadow$remote$runtime$shared$unknown_relay_op(msg){
return console.warn("unknown-relay-op",msg);
});
shadow.remote.runtime.shared.unknown_op = (function shadow$remote$runtime$shared$unknown_op(msg){
return console.warn("unknown-op",msg);
});
shadow.remote.runtime.shared.add_extension_STAR_ = (function shadow$remote$runtime$shared$add_extension_STAR_(p__28579,key,p__28580){
var map__28581 = p__28579;
var map__28581__$1 = cljs.core.__destructure_map(map__28581);
var state = map__28581__$1;
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28581__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
var map__28582 = p__28580;
var map__28582__$1 = cljs.core.__destructure_map(map__28582);
var spec = map__28582__$1;
var ops = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28582__$1,new cljs.core.Keyword(null,"ops","ops",1237330063));
var transit_write_handlers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28582__$1,new cljs.core.Keyword(null,"transit-write-handlers","transit-write-handlers",1886308716));
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
shadow.remote.runtime.shared.add_extension = (function shadow$remote$runtime$shared$add_extension(p__28583,key,spec){
var map__28584 = p__28583;
var map__28584__$1 = cljs.core.__destructure_map(map__28584);
var runtime = map__28584__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28584__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,shadow.remote.runtime.shared.add_extension_STAR_,key,spec);

var temp__5827__auto___28945 = new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125).cljs$core$IFn$_invoke$arity$1(spec);
if((temp__5827__auto___28945 == null)){
} else {
var on_welcome_28948 = temp__5827__auto___28945;
if(cljs.core.truth_(new cljs.core.Keyword(null,"welcome","welcome",-578152123).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))){
(on_welcome_28948.cljs$core$IFn$_invoke$arity$0 ? on_welcome_28948.cljs$core$IFn$_invoke$arity$0() : on_welcome_28948.call(null, ));
} else {
}
}

return runtime;
});
shadow.remote.runtime.shared.add_defaults = (function shadow$remote$runtime$shared$add_defaults(runtime){
return shadow.remote.runtime.shared.add_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.shared","defaults","shadow.remote.runtime.shared/defaults",-1821257543),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"welcome","welcome",-578152123),(function (p1__28586_SHARP_){
return shadow.remote.runtime.shared.welcome(runtime,p1__28586_SHARP_);
}),new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),(function (p1__28587_SHARP_){
return shadow.remote.runtime.shared.unknown_relay_op(p1__28587_SHARP_);
}),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),(function (p1__28588_SHARP_){
return shadow.remote.runtime.shared.unknown_op(p1__28588_SHARP_);
}),new cljs.core.Keyword(null,"ping","ping",-1670114784),(function (p1__28589_SHARP_){
return shadow.remote.runtime.shared.ping(runtime,p1__28589_SHARP_);
}),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),(function (p1__28590_SHARP_){
return shadow.remote.runtime.shared.request_supported_ops(runtime,p1__28590_SHARP_);
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
shadow.remote.runtime.shared.del_extension = (function shadow$remote$runtime$shared$del_extension(p__28591,key){
var map__28592 = p__28591;
var map__28592__$1 = cljs.core.__destructure_map(map__28592);
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28592__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(state_ref,shadow.remote.runtime.shared.del_extension_STAR_,key);
});
shadow.remote.runtime.shared.unhandled_call_result = (function shadow$remote$runtime$shared$unhandled_call_result(call_config,msg){
return console.warn("unhandled call result",msg,call_config);
});
shadow.remote.runtime.shared.unhandled_client_not_found = (function shadow$remote$runtime$shared$unhandled_client_not_found(p__28619,msg){
var map__28621 = p__28619;
var map__28621__$1 = cljs.core.__destructure_map(map__28621);
var runtime = map__28621__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28621__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic(runtime,new cljs.core.Keyword(null,"on-client-not-found","on-client-not-found",-642452849),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([msg], 0));
});
shadow.remote.runtime.shared.reply_unknown_op = (function shadow$remote$runtime$shared$reply_unknown_op(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg], null));
});
shadow.remote.runtime.shared.process = (function shadow$remote$runtime$shared$process(p__28675,p__28676){
var map__28677 = p__28675;
var map__28677__$1 = cljs.core.__destructure_map(map__28677);
var runtime = map__28677__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28677__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28678 = p__28676;
var map__28678__$1 = cljs.core.__destructure_map(map__28678);
var msg = map__28678__$1;
var op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28678__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28678__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
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
var seq__28695 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28697 = null;
var count__28698 = (0);
var i__28699 = (0);
while(true){
if((i__28699 < count__28698)){
var map__28729 = chunk__28697.cljs$core$IIndexed$_nth$arity$2(null, i__28699);
var map__28729__$1 = cljs.core.__destructure_map(map__28729);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28729__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__28981 = seq__28695;
var G__28982 = chunk__28697;
var G__28983 = count__28698;
var G__28984 = (i__28699 + (1));
seq__28695 = G__28981;
chunk__28697 = G__28982;
count__28698 = G__28983;
i__28699 = G__28984;
continue;
} else {
var G__28985 = seq__28695;
var G__28986 = chunk__28697;
var G__28987 = count__28698;
var G__28988 = (i__28699 + (1));
seq__28695 = G__28985;
chunk__28697 = G__28986;
count__28698 = G__28987;
i__28699 = G__28988;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28695);
if(temp__5823__auto__){
var seq__28695__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28695__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28695__$1);
var G__28990 = cljs.core.chunk_rest(seq__28695__$1);
var G__28991 = c__5568__auto__;
var G__28992 = cljs.core.count(c__5568__auto__);
var G__28993 = (0);
seq__28695 = G__28990;
chunk__28697 = G__28991;
count__28698 = G__28992;
i__28699 = G__28993;
continue;
} else {
var map__28735 = cljs.core.first(seq__28695__$1);
var map__28735__$1 = cljs.core.__destructure_map(map__28735);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28735__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__28994 = cljs.core.next(seq__28695__$1);
var G__28995 = null;
var G__28996 = (0);
var G__28997 = (0);
seq__28695 = G__28994;
chunk__28697 = G__28995;
count__28698 = G__28996;
i__28699 = G__28997;
continue;
} else {
var G__28998 = cljs.core.next(seq__28695__$1);
var G__28999 = null;
var G__29000 = (0);
var G__29001 = (0);
seq__28695 = G__28998;
chunk__28697 = G__28999;
count__28698 = G__29000;
i__28699 = G__29001;
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
