goog.provide('cljs_thread.root');
cljs_thread.root.init_root_BANG_ = (function cljs_thread$root$init_root_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21461 = arguments.length;
var i__5770__auto___21462 = (0);
while(true){
if((i__5770__auto___21462 < len__5769__auto___21461)){
args__5775__auto__.push((arguments[i__5770__auto___21462]));

var G__21463 = (i__5770__auto___21462 + (1));
i__5770__auto___21462 = G__21463;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.root.init_root_BANG_', cljs_thread.root.init_root_BANG_);

(cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__21456){
var vec__21457 = p__21456;
var config_map = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21457,(0),null);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: init-root! ENTER"], 0));

if(cljs_thread.env.in_root_QMARK_()){
} else {
throw (new Error("Assert failed: (e/in-root?)"));
}

if(cljs.core.truth_(config_map)){
var config_map_21464__$1 = ((cljs.core.object_QMARK_(config_map))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(config_map,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):config_map);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.conf,cljs.core.merge,config_map_21464__$1);
} else {
}

var config = cljs.core.deref(cljs_thread.state.conf);
var future_ids = new cljs.core.Keyword(null,"future-ids","future-ids",464771618).cljs$core$IFn$_invoke$arity$1(config);
var injest_ids = new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181).cljs$core$IFn$_invoke$arity$1(config);
var all_pool_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.set(future_ids),injest_ids);
var all_pool_ids__$1 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(all_pool_ids,new cljs.core.Keyword(null,"future","future",1877842724));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: waiting for pool workers:",cljs.core.vec(all_pool_ids__$1)], 0));

return cljs_thread.on_when.do_on_when((function (){
return (function (){
var peer_ids = cljs.core.set(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)));
return cljs.core.every_QMARK_(peer_ids,all_pool_ids__$1);
});
}),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"max-time","max-time",857408479),(30000)], null),new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.root",new cljs.core.Keyword(null,"line","line",212345235),29], null)),(function (){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: pool workers ready, peers:",cljs.core.vec(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)))], 0));

return cljs_thread.eve.eve_ready().then((function (_){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: eve-ready, spawning :core :db"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: calling start-futures"], 0));

cljs_thread.future.start_futures(config);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: calling start-injests"], 0));

cljs_thread.injest.start_injests(config);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: before spawn :core"], 0));

console.error("CERR root: CALLING do_spawn for :core, do_spawn=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.spawn.do_spawn));

try{cljs_thread.spawn.do_spawn(cljs.core.PersistentVector.EMPTY,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"core","core",-86019209),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),null);
}catch (e21460){var ex_21465 = e21460;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: EXCEPTION in spawn :core:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ex_21465),ex_21465.stack], 0));
}
console.error("CERR root: AFTER spawn :core call");

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: after spawn :core, peers:",cljs.core.vec(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)))], 0));

cljs_thread.spawn.do_spawn(cljs.core.PersistentVector.EMPTY,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"db","db",993250759),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),null);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: after spawn :db, peers:",cljs.core.vec(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)))], 0));

return cljs_thread.on_when.do_on_when((function (){
return (function (){
var and__5043__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"core","core",-86019209));
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"db","db",993250759));
} else {
return and__5043__auto__;
}
});
}),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"max-time","max-time",857408479),(10000)], null),new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.root",new cljs.core.Keyword(null,"line","line",212345235),52], null)),(function (){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: :core+:db ready, has-main-fn?:",new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439).cljs$core$IFn$_invoke$arity$1(config)], 0));

cljs_thread.msg.pair_ids(new cljs.core.Keyword(null,"core","core",-86019209),new cljs.core.Keyword(null,"db","db",993250759));

if(cljs.core.truth_(new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439).cljs$core$IFn$_invoke$arity$1(config))){
cljs_thread.msg.post(new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"core-ready","core-ready",-312673817)], null));
} else {
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: done"], 0));
}));
})).catch((function (e){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG root: EXCEPTION in eve-ready chain:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e)], 0));
}));
}));
}));

(cljs_thread.root.init_root_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.root.init_root_BANG_.cljs$lang$applyTo = (function (seq21455){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21455));
}));


//# sourceMappingURL=cljs_thread.root.js.map
