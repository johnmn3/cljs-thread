goog.provide('cljs_thread.root');
cljs_thread.root.init_root_BANG_ = (function cljs_thread$root$init_root_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28923 = arguments.length;
var i__5770__auto___28924 = (0);
while(true){
if((i__5770__auto___28924 < len__5769__auto___28923)){
args__5775__auto__.push((arguments[i__5770__auto___28924]));

var G__28925 = (i__5770__auto___28924 + (1));
i__5770__auto___28924 = G__28925;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.root.init_root_BANG_', cljs_thread.root.init_root_BANG_);

(cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__28919){
var vec__28920 = p__28919;
var config_map = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28920,(0),null);
cljs_thread.util.boot_log("root","init-root! ENTER");

if(cljs_thread.env.in_root_QMARK_()){
} else {
throw (new Error("Assert failed: (e/in-root?)"));
}

if(cljs.core.truth_(config_map)){
var config_map_28926__$1 = ((cljs.core.object_QMARK_(config_map))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(config_map,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):config_map);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.conf,cljs.core.merge,config_map_28926__$1);
} else {
}

var config = cljs.core.deref(cljs_thread.state.conf);
var future_ids = new cljs.core.Keyword(null,"future-ids","future-ids",464771618).cljs$core$IFn$_invoke$arity$1(config);
var injest_ids = new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181).cljs$core$IFn$_invoke$arity$1(config);
var all_pool_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.set(future_ids),injest_ids);
var all_pool_ids__$1 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(all_pool_ids,new cljs.core.Keyword(null,"future","future",1877842724));
cljs_thread.util.boot_log("root",["waiting for pool workers: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(all_pool_ids__$1))].join(''));

return cljs_thread.on_when.do_on_when((function (){
return (function (){
var peer_ids = cljs.core.set(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)));
return cljs.core.every_QMARK_(peer_ids,all_pool_ids__$1);
});
}),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"max-time","max-time",857408479),(30000)], null),new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.root",new cljs.core.Keyword(null,"line","line",212345235),32], null)),(function (){
cljs_thread.util.boot_log("root","all pool workers in peers");

return cljs_thread.eve.eve_ready().then((function (_){
cljs_thread.util.boot_log("root","eve-ready resolved");

cljs_thread.util.boot_log("root","calling start-futures");

cljs_thread.future.start_futures(config);

cljs_thread.util.boot_log("root","calling start-injests");

cljs_thread.injest.start_injests(config);

cljs_thread.util.boot_log("root","spawning :core");

cljs_thread.spawn.do_spawn(cljs.core.PersistentVector.EMPTY,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"core","core",-86019209),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),null);

cljs_thread.util.boot_log("root","spawning :db");

cljs_thread.spawn.do_spawn(cljs.core.PersistentVector.EMPTY,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"db","db",993250759),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),null);

return cljs_thread.on_when.do_on_when((function (){
return (function (){
var and__5043__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"core","core",-86019209));
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"db","db",993250759));
} else {
return and__5043__auto__;
}
});
}),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"max-time","max-time",857408479),(10000)], null),new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.root",new cljs.core.Keyword(null,"line","line",212345235),55], null)),(function (){
cljs_thread.util.boot_log("root","pairing :core <-> :db");

cljs_thread.msg.pair_ids(new cljs.core.Keyword(null,"core","core",-86019209),new cljs.core.Keyword(null,"db","db",993250759));

if(cljs.core.truth_(new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439).cljs$core$IFn$_invoke$arity$1(config))){
cljs_thread.util.boot_log("root","signaling :core-ready to screen");

cljs_thread.msg.post(new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"core-ready","core-ready",-312673817)], null));
} else {
}

return cljs_thread.util.boot_log("root","init-root! complete");
}));
}));
}));
}));

(cljs_thread.root.init_root_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.root.init_root_BANG_.cljs$lang$applyTo = (function (seq28918){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28918));
}));


//# sourceMappingURL=cljs_thread.root.js.map
