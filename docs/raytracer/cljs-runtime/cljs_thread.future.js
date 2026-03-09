goog.provide('cljs_thread.future');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.future !== 'undefined') && (typeof cljs_thread.future.pool !== 'undefined')){
} else {
cljs_thread.future.pool = (function (){var G__27205 = new cljs.core.Keyword("cljs-thread.future","future-pool","cljs-thread.future/future-pool",-1721238180);
var G__27206 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"waiting","waiting",895906735),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"busy","busy",-328286801),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"tasks","tasks",-1754368880),cljs.core.PersistentVector.EMPTY], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__27205,G__27206) : cljs_thread.eve.atom.call(null, G__27205,G__27206));
})();
}
cljs_thread.future.take_worker_BANG_ = (function cljs_thread$future$take_worker_BANG_(){
var claimed = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__27207){
var map__27208 = p__27207;
var map__27208__$1 = cljs.core.__destructure_map(map__27208);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27208__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27208__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27208__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
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
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__27209){
var map__27210 = p__27209;
var map__27210__$1 = cljs.core.__destructure_map(map__27210);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27210__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27210__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27210__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
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
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.future.pool,(function (p__27215){
var map__27216 = p__27215;
var map__27216__$1 = cljs.core.__destructure_map(map__27216);
var waiting = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27216__$1,new cljs.core.Keyword(null,"waiting","waiting",895906735));
var busy = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27216__$1,new cljs.core.Keyword(null,"busy","busy",-328286801));
var tasks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27216__$1,new cljs.core.Keyword(null,"tasks","tasks",-1754368880));
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
var x__5130__auto__ = (2);
var y__5131__auto__ = cljs.core.quot(cljs_thread.util.num_cores(),(4));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
}
})();
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__27218_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(["fp-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__27218_SHARP_)].join(''));
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

var future_conf_27271 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword(null,"future-ids","future-ids",464771618),worker_ids);
cljs_thread.util.boot_log("screen","spawning :future coordinator");

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_27271], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"future","future",1877842724),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
})));

var seq__27230_27274 = cljs.core.seq(worker_ids);
var chunk__27231_27275 = null;
var count__27232_27276 = (0);
var i__27233_27277 = (0);
while(true){
if((i__27233_27277 < count__27232_27276)){
var wid_27280 = chunk__27231_27275.cljs$core$IIndexed$_nth$arity$2(null, i__27233_27277);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_27280)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_27271], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_27280,new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__27230_27274,chunk__27231_27275,count__27232_27276,i__27233_27277,wid_27280,future_conf_27271){
return (function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
});})(seq__27230_27274,chunk__27231_27275,count__27232_27276,i__27233_27277,wid_27280,future_conf_27271))
));


var G__27285 = seq__27230_27274;
var G__27286 = chunk__27231_27275;
var G__27287 = count__27232_27276;
var G__27288 = (i__27233_27277 + (1));
seq__27230_27274 = G__27285;
chunk__27231_27275 = G__27286;
count__27232_27276 = G__27287;
i__27233_27277 = G__27288;
continue;
} else {
var temp__5823__auto___27289 = cljs.core.seq(seq__27230_27274);
if(temp__5823__auto___27289){
var seq__27230_27292__$1 = temp__5823__auto___27289;
if(cljs.core.chunked_seq_QMARK_(seq__27230_27292__$1)){
var c__5568__auto___27293 = cljs.core.chunk_first(seq__27230_27292__$1);
var G__27294 = cljs.core.chunk_rest(seq__27230_27292__$1);
var G__27295 = c__5568__auto___27293;
var G__27296 = cljs.core.count(c__5568__auto___27293);
var G__27297 = (0);
seq__27230_27274 = G__27294;
chunk__27231_27275 = G__27295;
count__27232_27276 = G__27296;
i__27233_27277 = G__27297;
continue;
} else {
var wid_27298 = cljs.core.first(seq__27230_27292__$1);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_27298)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [future_conf_27271], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_27298,new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__27230_27274,chunk__27231_27275,count__27232_27276,i__27233_27277,wid_27298,seq__27230_27292__$1,temp__5823__auto___27289,future_conf_27271){
return (function (future_conf__$1){
return cljs_thread.state.update_conf_BANG_(future_conf__$1);
});})(seq__27230_27274,chunk__27231_27275,count__27232_27276,i__27233_27277,wid_27298,seq__27230_27292__$1,temp__5823__auto___27289,future_conf_27271))
));


var G__27301 = cljs.core.next(seq__27230_27292__$1);
var G__27302 = null;
var G__27303 = (0);
var G__27304 = (0);
seq__27230_27274 = G__27301;
chunk__27231_27275 = G__27302;
count__27232_27276 = G__27303;
i__27233_27277 = G__27304;
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
