goog.provide('cljs_thread.msg');
cljs_thread.msg.event_message = "message";
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.msg !== 'undefined') && (typeof cljs_thread.msg.dispatch !== 'undefined')){
} else {
cljs_thread.msg.dispatch = (function (){var method_table__5642__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__5643__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var method_cache__5644__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__5645__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__5646__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),(function (){var fexpr__20214 = cljs.core.get_global_hierarchy;
return (fexpr__20214.cljs$core$IFn$_invoke$arity$0 ? fexpr__20214.cljs$core$IFn$_invoke$arity$0() : fexpr__20214.call(null, ));
})());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("cljs-thread.msg","dispatch"),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__5646__auto__,method_table__5642__auto__,prefer_table__5643__auto__,method_cache__5644__auto__,cached_hierarchy__5645__auto__));
})();
}
cljs_thread.msg.read_id = (function cljs_thread$msg$read_id(id){
if(cljs.core.truth_(id.startsWith(":"))){
return clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(id);
} else {
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(id);
}
});
cljs_thread.msg.message_handler = (function cljs_thread$msg$message_handler(e){
var raw = ((cljs_thread.platform.node_QMARK_)?e:e.data);
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"core","core",-86019209),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))))){
console.error("CERR msg-handler env=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0)),"has-msg?=",cljs.core.boolean$(raw.msg),"has-data?=",cljs.core.boolean$(raw));
} else {
}

var temp__5823__auto__ = raw.msg;
if(cljs.core.truth_(temp__5823__auto__)){
var data = temp__5823__auto__;
var receive_port_QMARK_ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(data.dispatch,"receive-port");
var raw_sargs = (raw["sargs"]);
var raw_transfers = (raw["transfers"]);
var sync_signal_sab = (raw["syncSignalSab"]);
var data__$1 = ((receive_port_QMARK_)?cljs.core.update_in.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(data,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),cljs.core.keyword),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"id","id",-1388402092)], null),cljs_thread.msg.read_id):clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(data));
var data__$2 = (function (){var G__20317 = data__$1;
var G__20317__$1 = (cljs.core.truth_(raw_sargs)?cljs.core.assoc_in(G__20317,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sargs","sargs",1421118304)], null),raw_sargs):G__20317);
var G__20317__$2 = (cljs.core.truth_(raw_transfers)?cljs.core.assoc_in(G__20317__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"transfers","transfers",2123810614)], null),raw_transfers):G__20317__$1);
if(cljs.core.truth_(sync_signal_sab)){
return cljs.core.assoc_in(G__20317__$2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null),sync_signal_sab);
} else {
return G__20317__$2;
}
})();
return cljs_thread.msg.dispatch.cljs$core$IFn$_invoke$arity$1(data__$2);
} else {
return null;
}
});
var target_20488 = (cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())?((cljs_thread.platform.node_QMARK_)?null:cljs_thread.platform.self_ref()):cljs_thread.platform.self_ref());
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG msg.cljs init env=",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),"target=",cljs.core.type(target_20488)], 0));

if(cljs.core.truth_(target_20488)){
cljs_thread.platform.listen(target_20488,cljs_thread.msg.message_handler);
} else {
}
cljs_thread.msg.do_pprint = (function cljs_thread$msg$do_pprint(s){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([s], 0))], 0));
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"pprint","pprint",1220198395),(function (p__20360){
var map__20361 = p__20360;
var map__20361__$1 = cljs.core.__destructure_map(map__20361);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20361__$1,new cljs.core.Keyword(null,"data","data",-232669377));
return cljs_thread.msg.do_pprint(data);
}));
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"receive-port","receive-port",777599529),(function (p__20373){
var map__20374 = p__20373;
var map__20374__$1 = cljs.core.__destructure_map(map__20374);
var map__20375 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20374__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__20375__$1 = cljs.core.__destructure_map(map__20375);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20375__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var port = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20375__$1,new cljs.core.Keyword(null,"port","port",1534937262));
var sync_channel_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20375__$1,new cljs.core.Keyword(null,"sync-channel-sab","sync-channel-sab",732032425));
var sync_channel_atom_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20375__$1,new cljs.core.Keyword(null,"sync-channel-atom-id","sync-channel-atom-id",-128110154));
var sync_channel_atom_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20375__$1,new cljs.core.Keyword(null,"sync-channel-atom-idx","sync-channel-atom-idx",-1198513701));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG :receive-port on",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),"id=",id,"port=",cljs.core.type(port)], 0));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null),port);

if(cljs.core.truth_(sync_channel_sab)){
var response_atom_20489 = cljs_thread.eve.reconstruct_shared_atom(sync_channel_atom_id,sync_channel_atom_idx);
var sync_channel_20490 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271),sync_channel_sab,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196),response_atom_20489], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328)], null),sync_channel_20490);
} else {
}

if(cljs_thread.platform.node_QMARK_){
return cljs_thread.platform.listen(port,cljs_thread.msg.message_handler);
} else {
return (port.onmessage = cljs_thread.msg.message_handler);
}
}));
cljs_thread.msg.when_peer_ready = (function cljs_thread$msg$when_peer_ready(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20491 = arguments.length;
var i__5770__auto___20492 = (0);
while(true){
if((i__5770__auto___20492 < len__5769__auto___20491)){
args__5775__auto__.push((arguments[i__5770__auto___20492]));

var G__20493 = (i__5770__auto___20492 + (1));
i__5770__auto___20492 = G__20493;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return cljs_thread.msg.when_peer_ready.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});

(cljs_thread.msg.when_peer_ready.cljs$core$IFn$_invoke$arity$variadic = (function (id,afn,p__20452){
var vec__20453 = p__20452;
var watch_key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20453,(0),null);
var watch_key__$1 = (function (){var or__5045__auto__ = watch_key;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(id),"-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.hash(afn)),"-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.gensym.cljs$core$IFn$_invoke$arity$0())].join('');
}
})();
var G__20456_20494 = ["[when-peer-ready] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))," present:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.boolean$(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),id)))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20456_20494) : cljs_thread.msg.debug_log_BANG_.call(null, G__20456_20494));

if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),id))){
var G__20457_20495 = ["[when-peer-ready] executing for ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20457_20495) : cljs_thread.msg.debug_log_BANG_.call(null, G__20457_20495));

return (afn.cljs$core$IFn$_invoke$arity$0 ? afn.cljs$core$IFn$_invoke$arity$0() : afn.call(null, ));
} else {
return cljs.core.add_watch(cljs_thread.state.peers,watch_key__$1,(function (){
cljs.core.remove_watch(cljs_thread.state.peers,watch_key__$1);

return cljs_thread.msg.when_peer_ready.cljs$core$IFn$_invoke$arity$variadic(id,afn,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([watch_key__$1], 0));
}));
}
}));

(cljs_thread.msg.when_peer_ready.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(cljs_thread.msg.when_peer_ready.cljs$lang$applyTo = (function (seq20439){
var G__20446 = cljs.core.first(seq20439);
var seq20439__$1 = cljs.core.next(seq20439);
var G__20447 = cljs.core.first(seq20439__$1);
var seq20439__$2 = cljs.core.next(seq20439__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20446,G__20447,seq20439__$2);
}));

cljs_thread.msg.do_post_message = (function cljs_thread$msg$do_post_message(w,data,transfers,transferables){
var sargs = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sargs","sargs",1421118304)], null));
var sync_signal_sab = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526).cljs$core$IFn$_invoke$arity$1(data);
}
})();
var sync_channel = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328)], null));
var data_without_extras = (function (){var G__20458 = data;
var G__20458__$1 = (cljs.core.truth_(sargs)?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__20458,new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.dissoc,new cljs.core.Keyword(null,"sargs","sargs",1421118304)):G__20458);
var G__20458__$2 = (cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null)))?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__20458__$1,new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.dissoc,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)):G__20458__$1);
var G__20458__$3 = (cljs.core.truth_(new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526).cljs$core$IFn$_invoke$arity$1(data))?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__20458__$2,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)):G__20458__$2);
if(cljs.core.truth_(sync_channel)){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__20458__$3,new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.dissoc,new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328));
} else {
return G__20458__$3;
}
})();
var transfers_js = (cljs.core.truth_(transfers)?cljs.core.clj__GT_js(transfers):null);
var msg = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data),new cljs.core.Keyword(null,"receive-port","receive-port",777599529)))?({"transfers": transfers_js, "msg": cljs.core.clj__GT_js(data)}):({"transfers": transfers_js, "msg": cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_without_extras), "sargs": (cljs.core.truth_(sargs)?cljs.core.clj__GT_js(sargs):null), "syncSignalSab": sync_signal_sab}));
var xfers = (cljs.core.truth_(transferables)?cljs.core.clj__GT_js(transferables):[]);
return cljs_thread.platform.post_message(w,msg,xfers);
});
cljs_thread.msg.post = (function cljs_thread$msg$post(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20496 = arguments.length;
var i__5770__auto___20497 = (0);
while(true){
if((i__5770__auto___20497 < len__5769__auto___20496)){
args__5775__auto__.push((arguments[i__5770__auto___20497]));

var G__20498 = (i__5770__auto___20497 + (1));
i__5770__auto___20497 = G__20498;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return cljs_thread.msg.post.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.msg.post', cljs_thread.msg.post);

(cljs_thread.msg.post.cljs$core$IFn$_invoke$arity$variadic = (function (worker_id,p__20462,p__20463){
var map__20464 = p__20462;
var map__20464__$1 = cljs.core.__destructure_map(map__20464);
var data = map__20464__$1;
var map__20465 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20464__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__20465__$1 = cljs.core.__destructure_map(map__20465);
var transfers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"transfers","transfers",2123810614));
var vec__20466 = p__20463;
var transferables = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20466,(0),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"call","call",-519999866),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data))){
console.error("CERR post:call env=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0)),"to=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([worker_id], 0)),"sfn-len=",cljs.core.count(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sfn","sfn",-736336514)], null))),"sfn-head=",cljs.core.subs.cljs$core$IFn$_invoke$arity$3(cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sfn","sfn",-736336514)], null))),(0),(function (){var x__5133__auto__ = (60);
var y__5134__auto__ = ((cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sfn","sfn",-736336514)], null)))).length);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})()));
} else {
}

var G__20469_20499 = ["[post] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," worker-id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([worker_id], 0))," dispatch:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20469_20499) : cljs_thread.msg.debug_log_BANG_.call(null, G__20469_20499));

var transferables__$1 = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p__20470){
var vec__20471 = p__20470;
var _k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20471,(0),null);
var map__20474 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20471,(1),null);
var map__20474__$1 = cljs.core.__destructure_map(map__20474);
var transfer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20474__$1,new cljs.core.Keyword(null,"transfer","transfer",327423400));
return transfer;
}),transfers));
var id = (((function (){var and__5043__auto__ = (!((worker_id instanceof cljs.core.Keyword)));
if(and__5043__auto__){
if((!((worker_id == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === worker_id.cljs_thread$id$IDable$)))){
return true;
} else {
if((!worker_id.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,worker_id);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,worker_id);
}
} else {
return and__5043__auto__;
}
})())?cljs_thread.id.get_id(worker_id):worker_id);
var data__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data));
var G__20476_20500 = ["[post] id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))," peers:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.keys(cljs.core.deref(cljs_thread.state.peers))], 0))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20476_20500) : cljs_thread.msg.debug_log_BANG_.call(null, G__20476_20500));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"here","here",-1501585969),id)){
return cljs_thread.msg.dispatch.cljs$core$IFn$_invoke$arity$1(data__$1);
} else {
var w = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"w","w",354169001)], null));
}
})();
var G__20477_20502 = ["[post] w:",(cljs.core.truth_(w)?"found":"nil")," id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20477_20502) : cljs_thread.msg.debug_log_BANG_.call(null, G__20477_20502));

try{if(((cljs.core.not(cljs_thread.env.in_screen_QMARK_())) && (cljs.core.not(w)))){
return cljs_thread.msg.when_peer_ready(id,(function (){
var w__$1 = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"w","w",354169001)], null));
}
})();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"call","call",-519999866),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data__$1))){
console.error("CERR post:call path=no-w-not-screen env=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0)),"to=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0)),"w=",(cljs.core.truth_(w__$1)?"found":"NIL"));
} else {
}

return cljs_thread.msg.do_post_message(w__$1,data__$1,transfers,transferables__$1);
}));
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.env.in_screen_QMARK_();
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(w);
} else {
return and__5043__auto__;
}
})())){
var G__20479_20504 = ["[post] proxying to root for id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20479_20504) : cljs_thread.msg.debug_log_BANG_.call(null, G__20479_20504));

var root_w = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"port","port",1534937262)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"w","w",354169001)], null));
}
})();
var inner_sab = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null));
var data_stripped = (cljs.core.truth_(inner_sab)?cljs.core.update.cljs$core$IFn$_invoke$arity$4(data__$1,new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.dissoc,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)):data__$1);
var data_with_to = cljs.core.assoc_in(data_stripped,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"to","to",192099007)], null),id);
var proxy_data = (function (){var G__20480 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"proxy","proxy",-117453614),new cljs.core.Keyword(null,"data","data",-232669377),data_with_to], null);
if(cljs.core.truth_(inner_sab)){
return cljs.core.assoc_in(G__20480,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null),inner_sab);
} else {
return G__20480;
}
})();
var G__20481_20506 = ["[post] root-w:",(cljs.core.truth_(root_w)?"found":"nil")].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20481_20506) : cljs_thread.msg.debug_log_BANG_.call(null, G__20481_20506));

if(cljs.core.truth_(root_w)){
return cljs_thread.msg.do_post_message(root_w,proxy_data,transfers,transferables__$1);
} else {
return cljs_thread.msg.when_peer_ready(new cljs.core.Keyword(null,"root","root",-448657453),(function (){
var root_w__$1 = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"port","port",1534937262)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"w","w",354169001)], null));
}
})();
var G__20482_20507 = ["[post] delayed proxy to root for id:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))].join('');
(cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.msg.debug_log_BANG_.cljs$core$IFn$_invoke$arity$1(G__20482_20507) : cljs_thread.msg.debug_log_BANG_.call(null, G__20482_20507));

return cljs_thread.msg.do_post_message(root_w__$1,proxy_data,transfers,transferables__$1);
}));
}
} else {
return cljs_thread.msg.when_peer_ready(id,(function (){
var w__$1 = (function (){var or__5045__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"w","w",354169001)], null));
}
})();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"call","call",-519999866),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data__$1))){
console.error("CERR post:call path=else env=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0)),"to=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0)),"w-type=",cljs.core.type(w__$1),"w=",(cljs.core.truth_(w__$1)?"found":"NIL"));
} else {
}

return cljs_thread.msg.do_post_message(w__$1,data__$1,transfers,transferables__$1);
}));

}
}
}catch (e20478){var e = e20478;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"e","e",1381269198),e], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"w","w",354169001),w], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"worker-id","worker-id",644510040),worker_id], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data-dispatch","data-dispatch",333016344),new cljs.core.Keyword(null,"dispatch","dispatch",1319337009).cljs$core$IFn$_invoke$arity$1(data__$1)], 0));

return cljs_thread.msg.when_peer_ready(id,(function (){
return cljs_thread.msg.post.cljs$core$IFn$_invoke$arity$variadic(worker_id,data__$1,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([transferables__$1], 0));
}));
}}
}));

(cljs_thread.msg.post.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(cljs_thread.msg.post.cljs$lang$applyTo = (function (seq20459){
var G__20460 = cljs.core.first(seq20459);
var seq20459__$1 = cljs.core.next(seq20459);
var G__20461 = cljs.core.first(seq20459__$1);
var seq20459__$2 = cljs.core.next(seq20459__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20460,G__20461,seq20459__$2);
}));

cljs_thread.msg.debug_log_BANG_ = (function cljs_thread$msg$debug_log_BANG_(_msg){
return null;
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"proxy","proxy",-117453614),(function (p__20483){
var map__20484 = p__20483;
var map__20484__$1 = cljs.core.__destructure_map(map__20484);
var outer = map__20484__$1;
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20484__$1,new cljs.core.Keyword(null,"data","data",-232669377));
cljs_thread.msg.debug_log_BANG_(["[proxy] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," to:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(data)))," has-sync-sab?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.boolean$(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526)], null))))].join(''));

var id = new cljs.core.Keyword(null,"to","to",192099007).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(data));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))){
return cljs_thread.msg.post(new cljs.core.Keyword(null,"here","here",-1501585969),data);
} else {
return cljs_thread.msg.post(id,data);
}
}));
cljs_thread.msg.mk_chan_pair = (function cljs_thread$msg$mk_chan_pair(){
return cljs_thread.platform.mk_channel();
});
cljs_thread.msg.send_port = (function cljs_thread$msg$send_port(id,c1){
var sync_ch = cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0();
var response_atom = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch);
return cljs_thread.msg.post(id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"receive-port","receive-port",777599529),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"port","port",1534937262),c1,new cljs.core.Keyword(null,"transfers","transfers",2123810614),new cljs.core.PersistentArrayMap(null, 1, [(1),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"transfer","transfer",327423400),c1], null)], null),new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)),new cljs.core.Keyword(null,"sync-channel-sab","sync-channel-sab",732032425),new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271).cljs$core$IFn$_invoke$arity$1(sync_ch),new cljs.core.Keyword(null,"sync-channel-atom-id","sync-channel-atom-id",-128110154),response_atom.shared_atom_id,new cljs.core.Keyword(null,"sync-channel-atom-idx","sync-channel-atom-idx",-1198513701),response_atom.header_descriptor_idx], null)], null));
});
cljs_thread.msg.dist_port = (function cljs_thread$msg$dist_port(id1,id2,c1,c2){
var sync_ch_1 = cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0();
var sync_ch_2 = cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0();
var atom_1 = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch_1);
var atom_2 = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch_2);
cljs_thread.msg.post(id1,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"receive-port","receive-port",777599529),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"port","port",1534937262),c1,new cljs.core.Keyword(null,"transfers","transfers",2123810614),new cljs.core.PersistentArrayMap(null, 1, [(1),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"transfer","transfer",327423400),c1], null)], null),new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.str.cljs$core$IFn$_invoke$arity$1(id2),new cljs.core.Keyword(null,"sync-channel-sab","sync-channel-sab",732032425),new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271).cljs$core$IFn$_invoke$arity$1(sync_ch_1),new cljs.core.Keyword(null,"sync-channel-atom-id","sync-channel-atom-id",-128110154),atom_1.shared_atom_id,new cljs.core.Keyword(null,"sync-channel-atom-idx","sync-channel-atom-idx",-1198513701),atom_1.header_descriptor_idx], null)], null));

return cljs_thread.msg.post(id2,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"receive-port","receive-port",777599529),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"port","port",1534937262),c2,new cljs.core.Keyword(null,"transfers","transfers",2123810614),new cljs.core.PersistentArrayMap(null, 1, [(1),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"transfer","transfer",327423400),c2], null)], null),new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.str.cljs$core$IFn$_invoke$arity$1(id1),new cljs.core.Keyword(null,"sync-channel-sab","sync-channel-sab",732032425),new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271).cljs$core$IFn$_invoke$arity$1(sync_ch_2),new cljs.core.Keyword(null,"sync-channel-atom-id","sync-channel-atom-id",-128110154),atom_2.shared_atom_id,new cljs.core.Keyword(null,"sync-channel-atom-idx","sync-channel-atom-idx",-1198513701),atom_2.header_descriptor_idx], null)], null));
});
cljs_thread.msg.pair_ids = (function cljs_thread$msg$pair_ids(id1,id2){
var vec__20485 = cljs_thread.msg.mk_chan_pair();
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20485,(0),null);
var c2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20485,(1),null);
return cljs_thread.msg.dist_port(id1,id2,c1,c2);
});
goog.exportSymbol('cljs_thread.msg.pair_ids', cljs_thread.msg.pair_ids);
cljs_thread.msg.add_port = (function cljs_thread$msg$add_port(id,p){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null),p);

if(cljs_thread.platform.node_QMARK_){
return cljs_thread.platform.listen(p,cljs_thread.msg.message_handler);
} else {
return (p.onmessage = cljs_thread.msg.message_handler);
}
});

//# sourceMappingURL=cljs_thread.msg.js.map
