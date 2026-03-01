goog.provide('shadow.remote.runtime.shared');
shadow.remote.runtime.shared.init_state = (function shadow$remote$runtime$shared$init_state(client_info){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"extensions","extensions",-1103629196),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info,new cljs.core.Keyword(null,"call-id-seq","call-id-seq",-1679248218),(0),new cljs.core.Keyword(null,"call-handlers","call-handlers",386605551),cljs.core.PersistentArrayMap.EMPTY], null);
});
shadow.remote.runtime.shared.now = (function shadow$remote$runtime$shared$now(){
return Date.now();
});
shadow.remote.runtime.shared.get_client_id = (function shadow$remote$runtime$shared$get_client_id(p__28462){
var map__28463 = p__28462;
var map__28463__$1 = cljs.core.__destructure_map(map__28463);
var runtime = map__28463__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28463__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var or__5045__auto__ = new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("runtime has no assigned runtime-id",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null));
}
});
shadow.remote.runtime.shared.relay_msg = (function shadow$remote$runtime$shared$relay_msg(runtime,msg){
var self_id_28764 = shadow.remote.runtime.shared.get_client_id(runtime);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(msg),self_id_28764)){
shadow.remote.runtime.api.relay_msg(runtime,msg);
} else {
Promise.resolve((1)).then((function (){
var G__28472 = runtime;
var G__28473 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"from","from",1815293044),self_id_28764);
return (shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2 ? shadow.remote.runtime.shared.process.cljs$core$IFn$_invoke$arity$2(G__28472,G__28473) : shadow.remote.runtime.shared.process.call(null, G__28472,G__28473));
}));
}

return msg;
});
shadow.remote.runtime.shared.reply = (function shadow$remote$runtime$shared$reply(runtime,p__28476,res){
var map__28477 = p__28476;
var map__28477__$1 = cljs.core.__destructure_map(map__28477);
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28477__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28477__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var res__$1 = (function (){var G__28478 = res;
var G__28478__$1 = (cljs.core.truth_(call_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28478,new cljs.core.Keyword(null,"call-id","call-id",1043012968),call_id):G__28478);
if(cljs.core.truth_(from)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__28478__$1,new cljs.core.Keyword(null,"to","to",192099007),from);
} else {
return G__28478__$1;
}
})();
return shadow.remote.runtime.api.relay_msg(runtime,res__$1);
});
shadow.remote.runtime.shared.call = (function shadow$remote$runtime$shared$call(var_args){
var G__28485 = arguments.length;
switch (G__28485) {
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
var len__5769__auto___28789 = arguments.length;
var i__5770__auto___28790 = (0);
while(true){
if((i__5770__auto___28790 < len__5769__auto___28789)){
args__5775__auto__.push((arguments[i__5770__auto___28790]));

var G__28791 = (i__5770__auto___28790 + (1));
i__5770__auto___28790 = G__28791;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});

(shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__28501,ev,args){
var map__28502 = p__28501;
var map__28502__$1 = cljs.core.__destructure_map(map__28502);
var runtime = map__28502__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28502__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var seq__28503 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28506 = null;
var count__28507 = (0);
var i__28508 = (0);
while(true){
if((i__28508 < count__28507)){
var ext = chunk__28506.cljs$core$IIndexed$_nth$arity$2(null, i__28508);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28819 = seq__28503;
var G__28820 = chunk__28506;
var G__28821 = count__28507;
var G__28826 = (i__28508 + (1));
seq__28503 = G__28819;
chunk__28506 = G__28820;
count__28507 = G__28821;
i__28508 = G__28826;
continue;
} else {
var G__28829 = seq__28503;
var G__28830 = chunk__28506;
var G__28831 = count__28507;
var G__28832 = (i__28508 + (1));
seq__28503 = G__28829;
chunk__28506 = G__28830;
count__28507 = G__28831;
i__28508 = G__28832;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28503);
if(temp__5823__auto__){
var seq__28503__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28503__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28503__$1);
var G__28847 = cljs.core.chunk_rest(seq__28503__$1);
var G__28848 = c__5568__auto__;
var G__28849 = cljs.core.count(c__5568__auto__);
var G__28850 = (0);
seq__28503 = G__28847;
chunk__28506 = G__28848;
count__28507 = G__28849;
i__28508 = G__28850;
continue;
} else {
var ext = cljs.core.first(seq__28503__$1);
var ev_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ext,ev);
if(cljs.core.truth_(ev_fn)){
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(ev_fn,args);


var G__28867 = cljs.core.next(seq__28503__$1);
var G__28868 = null;
var G__28869 = (0);
var G__28870 = (0);
seq__28503 = G__28867;
chunk__28506 = G__28868;
count__28507 = G__28869;
i__28508 = G__28870;
continue;
} else {
var G__28874 = cljs.core.next(seq__28503__$1);
var G__28875 = null;
var G__28876 = (0);
var G__28877 = (0);
seq__28503 = G__28874;
chunk__28506 = G__28875;
count__28507 = G__28876;
i__28508 = G__28877;
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
(shadow.remote.runtime.shared.trigger_BANG_.cljs$lang$applyTo = (function (seq28495){
var G__28496 = cljs.core.first(seq28495);
var seq28495__$1 = cljs.core.next(seq28495);
var G__28497 = cljs.core.first(seq28495__$1);
var seq28495__$2 = cljs.core.next(seq28495__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28496,G__28497,seq28495__$2);
}));

shadow.remote.runtime.shared.welcome = (function shadow$remote$runtime$shared$welcome(p__28523,p__28524){
var map__28525 = p__28523;
var map__28525__$1 = cljs.core.__destructure_map(map__28525);
var runtime = map__28525__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28525__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28526 = p__28524;
var map__28526__$1 = cljs.core.__destructure_map(map__28526);
var msg = map__28526__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28526__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(state_ref,cljs.core.assoc,new cljs.core.Keyword(null,"client-id","client-id",-464622140),client_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"welcome","welcome",-578152123),true], 0));

var map__28530 = cljs.core.deref(state_ref);
var map__28530__$1 = cljs.core.__destructure_map(map__28530);
var client_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28530__$1,new cljs.core.Keyword(null,"client-info","client-info",1958982504));
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28530__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
shadow.remote.runtime.shared.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"hello","hello",-245025397),new cljs.core.Keyword(null,"client-info","client-info",1958982504),client_info], null));

return shadow.remote.runtime.shared.trigger_BANG_(runtime,new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125));
});
shadow.remote.runtime.shared.ping = (function shadow$remote$runtime$shared$ping(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"pong","pong",-172484958)], null));
});
shadow.remote.runtime.shared.request_supported_ops = (function shadow$remote$runtime$shared$request_supported_ops(p__28540,msg){
var map__28541 = p__28540;
var map__28541__$1 = cljs.core.__destructure_map(map__28541);
var runtime = map__28541__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28541__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"supported-ops","supported-ops",337914702),new cljs.core.Keyword(null,"ops","ops",1237330063),cljs.core.disj.cljs$core$IFn$_invoke$arity$variadic(cljs.core.set(cljs.core.keys(new cljs.core.Keyword(null,"ops","ops",1237330063).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))),new cljs.core.Keyword(null,"welcome","welcome",-578152123),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),new cljs.core.Keyword(null,"tool-disconnect","tool-disconnect",189103996)], 0))], null));
});
shadow.remote.runtime.shared.unknown_relay_op = (function shadow$remote$runtime$shared$unknown_relay_op(msg){
return console.warn("unknown-relay-op",msg);
});
shadow.remote.runtime.shared.unknown_op = (function shadow$remote$runtime$shared$unknown_op(msg){
return console.warn("unknown-op",msg);
});
shadow.remote.runtime.shared.add_extension_STAR_ = (function shadow$remote$runtime$shared$add_extension_STAR_(p__28555,key,p__28556){
var map__28557 = p__28555;
var map__28557__$1 = cljs.core.__destructure_map(map__28557);
var state = map__28557__$1;
var extensions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28557__$1,new cljs.core.Keyword(null,"extensions","extensions",-1103629196));
var map__28558 = p__28556;
var map__28558__$1 = cljs.core.__destructure_map(map__28558);
var spec = map__28558__$1;
var ops = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28558__$1,new cljs.core.Keyword(null,"ops","ops",1237330063));
var transit_write_handlers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28558__$1,new cljs.core.Keyword(null,"transit-write-handlers","transit-write-handlers",1886308716));
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
shadow.remote.runtime.shared.add_extension = (function shadow$remote$runtime$shared$add_extension(p__28574,key,spec){
var map__28575 = p__28574;
var map__28575__$1 = cljs.core.__destructure_map(map__28575);
var runtime = map__28575__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28575__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(state_ref,shadow.remote.runtime.shared.add_extension_STAR_,key,spec);

var temp__5827__auto___28943 = new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125).cljs$core$IFn$_invoke$arity$1(spec);
if((temp__5827__auto___28943 == null)){
} else {
var on_welcome_28944 = temp__5827__auto___28943;
if(cljs.core.truth_(new cljs.core.Keyword(null,"welcome","welcome",-578152123).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref)))){
(on_welcome_28944.cljs$core$IFn$_invoke$arity$0 ? on_welcome_28944.cljs$core$IFn$_invoke$arity$0() : on_welcome_28944.call(null, ));
} else {
}
}

return runtime;
});
shadow.remote.runtime.shared.add_defaults = (function shadow$remote$runtime$shared$add_defaults(runtime){
return shadow.remote.runtime.shared.add_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.shared","defaults","shadow.remote.runtime.shared/defaults",-1821257543),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"welcome","welcome",-578152123),(function (p1__28579_SHARP_){
return shadow.remote.runtime.shared.welcome(runtime,p1__28579_SHARP_);
}),new cljs.core.Keyword(null,"unknown-relay-op","unknown-relay-op",170832753),(function (p1__28580_SHARP_){
return shadow.remote.runtime.shared.unknown_relay_op(p1__28580_SHARP_);
}),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),(function (p1__28581_SHARP_){
return shadow.remote.runtime.shared.unknown_op(p1__28581_SHARP_);
}),new cljs.core.Keyword(null,"ping","ping",-1670114784),(function (p1__28582_SHARP_){
return shadow.remote.runtime.shared.ping(runtime,p1__28582_SHARP_);
}),new cljs.core.Keyword(null,"request-supported-ops","request-supported-ops",-1034994502),(function (p1__28584_SHARP_){
return shadow.remote.runtime.shared.request_supported_ops(runtime,p1__28584_SHARP_);
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
shadow.remote.runtime.shared.del_extension = (function shadow$remote$runtime$shared$del_extension(p__28606,key){
var map__28607 = p__28606;
var map__28607__$1 = cljs.core.__destructure_map(map__28607);
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28607__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(state_ref,shadow.remote.runtime.shared.del_extension_STAR_,key);
});
shadow.remote.runtime.shared.unhandled_call_result = (function shadow$remote$runtime$shared$unhandled_call_result(call_config,msg){
return console.warn("unhandled call result",msg,call_config);
});
shadow.remote.runtime.shared.unhandled_client_not_found = (function shadow$remote$runtime$shared$unhandled_client_not_found(p__28624,msg){
var map__28629 = p__28624;
var map__28629__$1 = cljs.core.__destructure_map(map__28629);
var runtime = map__28629__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28629__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
return shadow.remote.runtime.shared.trigger_BANG_.cljs$core$IFn$_invoke$arity$variadic(runtime,new cljs.core.Keyword(null,"on-client-not-found","on-client-not-found",-642452849),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([msg], 0));
});
shadow.remote.runtime.shared.reply_unknown_op = (function shadow$remote$runtime$shared$reply_unknown_op(runtime,msg){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"unknown-op","unknown-op",1900385996),new cljs.core.Keyword(null,"msg","msg",-1386103444),msg], null));
});
shadow.remote.runtime.shared.process = (function shadow$remote$runtime$shared$process(p__28641,p__28642){
var map__28644 = p__28641;
var map__28644__$1 = cljs.core.__destructure_map(map__28644);
var runtime = map__28644__$1;
var state_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28644__$1,new cljs.core.Keyword(null,"state-ref","state-ref",2127874952));
var map__28645 = p__28642;
var map__28645__$1 = cljs.core.__destructure_map(map__28645);
var msg = map__28645__$1;
var op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28645__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28645__$1,new cljs.core.Keyword(null,"call-id","call-id",1043012968));
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
var seq__28687 = cljs.core.seq(cljs.core.vals(new cljs.core.Keyword(null,"extensions","extensions",-1103629196).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state_ref))));
var chunk__28689 = null;
var count__28690 = (0);
var i__28691 = (0);
while(true){
if((i__28691 < count__28690)){
var map__28731 = chunk__28689.cljs$core$IIndexed$_nth$arity$2(null, i__28691);
var map__28731__$1 = cljs.core.__destructure_map(map__28731);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28731__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__28965 = seq__28687;
var G__28966 = chunk__28689;
var G__28967 = count__28690;
var G__28968 = (i__28691 + (1));
seq__28687 = G__28965;
chunk__28689 = G__28966;
count__28690 = G__28967;
i__28691 = G__28968;
continue;
} else {
var G__28974 = seq__28687;
var G__28975 = chunk__28689;
var G__28976 = count__28690;
var G__28977 = (i__28691 + (1));
seq__28687 = G__28974;
chunk__28689 = G__28975;
count__28690 = G__28976;
i__28691 = G__28977;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__28687);
if(temp__5823__auto__){
var seq__28687__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28687__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__28687__$1);
var G__28983 = cljs.core.chunk_rest(seq__28687__$1);
var G__28984 = c__5568__auto__;
var G__28985 = cljs.core.count(c__5568__auto__);
var G__28986 = (0);
seq__28687 = G__28983;
chunk__28689 = G__28984;
count__28690 = G__28985;
i__28691 = G__28986;
continue;
} else {
var map__28737 = cljs.core.first(seq__28687__$1);
var map__28737__$1 = cljs.core.__destructure_map(map__28737);
var on_idle = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28737__$1,new cljs.core.Keyword(null,"on-idle","on-idle",2044706602));
if(cljs.core.truth_(on_idle)){
(on_idle.cljs$core$IFn$_invoke$arity$0 ? on_idle.cljs$core$IFn$_invoke$arity$0() : on_idle.call(null, ));


var G__28998 = cljs.core.next(seq__28687__$1);
var G__28999 = null;
var G__29000 = (0);
var G__29001 = (0);
seq__28687 = G__28998;
chunk__28689 = G__28999;
count__28690 = G__29000;
i__28691 = G__29001;
continue;
} else {
var G__29006 = cljs.core.next(seq__28687__$1);
var G__29007 = null;
var G__29008 = (0);
var G__29009 = (0);
seq__28687 = G__29006;
chunk__28689 = G__29007;
count__28690 = G__29008;
i__28691 = G__29009;
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
