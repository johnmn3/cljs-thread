goog.provide('cljs_thread.state');
cljs_thread.state.shake = (function cljs_thread$state$shake(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20236 = arguments.length;
var i__5770__auto___20238 = (0);
while(true){
if((i__5770__auto___20238 < len__5769__auto___20236)){
args__5775__auto__.push((arguments[i__5770__auto___20238]));

var G__20239 = (i__5770__auto___20238 + (1));
i__5770__auto___20238 = G__20239;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.state.shake.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.state.shake.cljs$core$IFn$_invoke$arity$variadic = (function (atm,p__20215){
var map__20216 = p__20215;
var map__20216__$1 = cljs.core.__destructure_map(map__20216);
var seconds = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__20216__$1,new cljs.core.Keyword(null,"seconds","seconds",-445266194),(30));
var msg = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20216__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20216__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var effect = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20216__$1,new cljs.core.Keyword(null,"effect","effect",347343289));
var time_ms = (seconds * (1000));
var limit_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(limit);
var inter_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var action = (function (){
if(cljs.core.truth_(msg)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((cljs.core.fn_QMARK_(msg))?(msg.cljs$core$IFn$_invoke$arity$0 ? msg.cljs$core$IFn$_invoke$arity$0() : msg.call(null, )):msg)], 0));
} else {
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(atm,cljs.core.identity);

if(cljs.core.truth_(limit)){
if(((1) < cljs.core.deref(limit_atom))){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(limit_atom,cljs.core.dec);
} else {
return clearInterval(cljs.core.deref(inter_atom));
}
} else {
return null;
}
});
var inter_id = setInterval(action,time_ms);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(inter_atom,cljs.core.constantly(inter_id));
}));

(cljs_thread.state.shake.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.state.shake.cljs$lang$applyTo = (function (seq20206){
var G__20207 = cljs.core.first(seq20206);
var seq20206__$1 = cljs.core.next(seq20206);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20207,seq20206__$1);
}));

cljs_thread.state.initial_conf = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"conf","conf",-983921284).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0));
if(cljs.core.truth_(new cljs.core.Keyword(null,"force-sw-sync","force-sw-sync",790093192).cljs$core$IFn$_invoke$arity$1(cljs_thread.state.initial_conf))){
(cljs_thread.platform.sab_sync_QMARK_ = false);
} else {
}
cljs_thread.state.conf = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs_thread.state.initial_conf);
cljs_thread.state.update_conf_BANG_ = (function cljs_thread$state$update_conf_BANG_(conf_map){
var conf_map__$1 = ((cljs.core.object_QMARK_(conf_map))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(conf_map,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):conf_map);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.conf,cljs.core.merge,conf_map__$1);
});
goog.exportSymbol('cljs_thread.state.update_conf_BANG_', cljs_thread.state.update_conf_BANG_);
cljs_thread.state.peers = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
cljs_thread.state.shake.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.state.peers,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"seconds","seconds",-445266194),(1),new cljs.core.Keyword(null,"limit","limit",-1355822363),(30)], 0));
cljs_thread.state.shake.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.state.peers,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"seconds","seconds",-445266194),(30)], 0));
cljs_thread.state.local_val = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
} else {
var self_20246 = cljs_thread.platform.self_ref();
var caller_20247 = new cljs.core.Keyword(null,"caller","caller",-1275362879).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc,new cljs.core.Keyword(null,"parent","parent",-878878779),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"parent","parent",-878878779),new cljs.core.Keyword(null,"w","w",354169001),self_20246,new cljs.core.Keyword(null,"port","port",1534937262),self_20246], null));

if(cljs_thread.env.in_root_QMARK_()){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc,new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.Keyword(null,"w","w",354169001),self_20246,new cljs.core.Keyword(null,"port","port",1534937262),self_20246], null));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(caller_20247,new cljs.core.Keyword(null,"screen","screen",1990059748))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc,new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.Keyword(null,"w","w",354169001),self_20246,new cljs.core.Keyword(null,"port","port",1534937262),self_20246], null));
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc,new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"w","w",354169001),self_20246,new cljs.core.Keyword(null,"port","port",1534937262),self_20246], null));

}
}
}
cljs_thread.state.responses = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
cljs_thread.state.requests = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
cljs_thread.state.future_pool = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"available","available",-1470697127),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"in-use","in-use",-1234217652),cljs.core.PersistentHashSet.EMPTY], null));
cljs_thread.state.idb = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.state !== 'undefined') && (typeof cljs_thread.state.eve_sab_config !== 'undefined')){
} else {
cljs_thread.state.eve_sab_config = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}

//# sourceMappingURL=cljs_thread.state.js.map
