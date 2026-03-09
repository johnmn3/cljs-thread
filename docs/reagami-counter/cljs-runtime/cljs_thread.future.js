goog.provide('cljs_thread.future');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.future !== 'undefined') && (typeof cljs_thread.future.pool !== 'undefined')){
} else {
cljs_thread.future.pool = (function (){var G__21193 = new cljs.core.Keyword("cljs-thread.future","future-pool","cljs-thread.future/future-pool",-1721238180);
var G__21194 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"busy","busy",-328286801),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),cljs.core.PersistentVector.EMPTY], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__21193,G__21194) : cljs_thread.eve.atom.call(null, G__21193,G__21194));
})();
}
cljs_thread.future.take_worker_BANG_ = (function cljs_thread$future$take_worker_BANG_(){
var claimed = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__21200){
var map__21201 = p__21200;
var map__21201__$1 = cljs.core.__destructure_map(map__21201);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21201__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21201__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21201__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
var temp__5821__auto__ = cljs.core.first(waiting);
if(cljs.core.truth_(temp__5821__auto__)){
var w = temp__5821__auto__;
cljs.core.reset_BANG_(claimed,w);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.disj.cljs$core$IFn$_invoke$arity$2(waiting,w),new cljs.core.Keyword(null,"busy","busy",-328286801),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(busy,w),new cljs.core.Keyword(null,"tasks","tasks",-1754368880),tasks], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),waiting,new cljs.core.Keyword(null,"busy","busy",-328286801),busy,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),tasks], null);
}
}));

return cljs.core.deref(claimed);
});
goog.exportSymbol('cljs_thread.future.take_worker_BANG_', cljs_thread.future.take_worker_BANG_);
cljs_thread.future.put_back_worker_BANG_ = (function cljs_thread$future$put_back_worker_BANG_(worker){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__21203){
var map__21204 = p__21203;
var map__21204__$1 = cljs.core.__destructure_map(map__21204);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21204__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21204__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21204__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(waiting,worker),new cljs.core.Keyword(null,"busy","busy",-328286801),cljs.core.disj.cljs$core$IFn$_invoke$arity$2(busy,worker),new cljs.core.Keyword(null,"tasks","tasks",-1754368880),tasks], null);
}));

return null;
});
goog.exportSymbol('cljs_thread.future.put_back_worker_BANG_', cljs_thread.future.put_back_worker_BANG_);
cljs_thread.future.queue_task_BANG_ = (function cljs_thread$future$queue_task_BANG_(task_fn){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.future.pool,cljs.core.update,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([task_fn], 0));
});
goog.exportSymbol('cljs_thread.future.queue_task_BANG_', cljs_thread.future.queue_task_BANG_);
/**
 * Worker claims a task by removing it from queue. Returns task-fn or nil.
 */
cljs_thread.future.take_task_BANG_ = (function cljs_thread$future$take_task_BANG_(worker_id){
var claimed = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__21217){
var map__21218 = p__21217;
var map__21218__$1 = cljs.core.__destructure_map(map__21218);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21218__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21218__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21218__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
var temp__5821__auto__ = cljs.core.first(tasks);
if(cljs.core.truth_(temp__5821__auto__)){
var task = temp__5821__auto__;
cljs.core.reset_BANG_(claimed,task);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),waiting,new cljs.core.Keyword(null,"busy","busy",-328286801),busy,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),cljs.core.vec(cljs.core.rest(tasks))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),waiting,new cljs.core.Keyword(null,"busy","busy",-328286801),busy,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),tasks], null);
}
}));

return cljs.core.deref(claimed);
});
goog.exportSymbol('cljs_thread.future.take_task_BANG_', cljs_thread.future.take_task_BANG_);
cljs_thread.future.mk_worker_ids = (function cljs_thread$future$mk_worker_ids(n){
var ws = (function (){var or__5045__auto__ = n;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (cljs_thread.util.num_cores() + (1));
}
})();
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21220_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(["fp-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__21220_SHARP_)].join(''));
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(ws));
});
cljs_thread.future.init_pool_BANG_ = (function cljs_thread$future$init_pool_BANG_(worker_ids){
cljs_thread.util.boot_log("pool",["init-pool! ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(worker_ids))].join(''));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.future.pool,cljs.core.assoc,new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.set(worker_ids));
});
goog.exportSymbol('cljs_thread.future.init_pool_BANG_', cljs_thread.future.init_pool_BANG_);
/**
 * Spawn :future coordinator and all fp-* workers. Called from screen.
 * Pool should already be initialized via init-pool! before calling this.
 */
cljs_thread.future.spawn_future_workers = (function cljs_thread$future$spawn_future_workers(worker_ids,config){
cljs_thread.util.boot_log("screen","spawn-future-workers ENTER");

var future_conf_21247 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword(null,"future-ids","future-ids",464771618),worker_ids);
cljs_thread.util.boot_log("screen","spawning :future coordinator");

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_21247], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"future","future",1877842724),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
})));

var seq__21232_21248 = cljs.core.seq(worker_ids);
var chunk__21233_21249 = null;
var count__21234_21250 = (0);
var i__21235_21251 = (0);
while(true){
if((i__21235_21251 < count__21234_21250)){
var wid_21252 = chunk__21233_21249.cljs$core$IIndexed$_nth$arity$2(null, i__21235_21251);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_21252)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_21247], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_21252,new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21232_21248,chunk__21233_21249,count__21234_21250,i__21235_21251,wid_21252,future_conf_21247){
return (function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
});})(seq__21232_21248,chunk__21233_21249,count__21234_21250,i__21235_21251,wid_21252,future_conf_21247))
));


var G__21253 = seq__21232_21248;
var G__21254 = chunk__21233_21249;
var G__21255 = count__21234_21250;
var G__21256 = (i__21235_21251 + (1));
seq__21232_21248 = G__21253;
chunk__21233_21249 = G__21254;
count__21234_21250 = G__21255;
i__21235_21251 = G__21256;
continue;
} else {
var temp__5823__auto___21257 = cljs.core.seq(seq__21232_21248);
if(temp__5823__auto___21257){
var seq__21232_21258__$1 = temp__5823__auto___21257;
if(cljs.core.chunked_seq_QMARK_(seq__21232_21258__$1)){
var c__5568__auto___21259 = cljs.core.chunk_first(seq__21232_21258__$1);
var G__21260 = cljs.core.chunk_rest(seq__21232_21258__$1);
var G__21261 = c__5568__auto___21259;
var G__21262 = cljs.core.count(c__5568__auto___21259);
var G__21263 = (0);
seq__21232_21248 = G__21260;
chunk__21233_21249 = G__21261;
count__21234_21250 = G__21262;
i__21235_21251 = G__21263;
continue;
} else {
var wid_21264 = cljs.core.first(seq__21232_21258__$1);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_21264)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_21247], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_21264,new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21232_21248,chunk__21233_21249,count__21234_21250,i__21235_21251,wid_21264,seq__21232_21258__$1,temp__5823__auto___21257,future_conf_21247){
return (function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
});})(seq__21232_21248,chunk__21233_21249,count__21234_21250,i__21235_21251,wid_21264,seq__21232_21258__$1,temp__5823__auto___21257,future_conf_21247))
));


var G__21269 = cljs.core.next(seq__21232_21258__$1);
var G__21270 = null;
var G__21271 = (0);
var G__21272 = (0);
seq__21232_21248 = G__21269;
chunk__21233_21249 = G__21270;
count__21234_21250 = G__21271;
i__21235_21251 = G__21272;
continue;
}
} else {
}
}
break;
}

return cljs_thread.util.boot_log("screen","spawn-future-workers EXIT");
});
/**
 * No-op - pool and workers now initialized from screen thread.
 * Kept for backwards compatibility.
 */
cljs_thread.future.start_futures = (function cljs_thread$future$start_futures(configs){
cljs_thread.util.boot_log("root","start-futures (no-op, pool initialized from screen)");

return new cljs.core.Keyword(null,"future-ids","future-ids",464771618).cljs$core$IFn$_invoke$arity$1(configs);
});

//# sourceMappingURL=cljs_thread.future.js.map
