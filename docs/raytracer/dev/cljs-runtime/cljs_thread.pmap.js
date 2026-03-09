goog.provide('cljs_thread.pmap');
/**
 * Dynamic var to control parallelism level for pmap.
 * When bound to a number, pmap will use that many workers.
 * When nil (default), uses all available injest workers.
 */
cljs_thread.pmap._STAR_par_STAR_ = null;
cljs_thread.pmap.zipall = (function cljs_thread$pmap$zipall(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21187 = arguments.length;
var i__5770__auto___21188 = (0);
while(true){
if((i__5770__auto___21188 < len__5769__auto___21187)){
args__5775__auto__.push((arguments[i__5770__auto___21188]));

var G__21190 = (i__5770__auto___21188 + (1));
i__5770__auto___21188 = G__21190;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.pmap.zipall.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.pmap.zipall.cljs$core$IFn$_invoke$arity$variadic = (function (colls){
return cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,v){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21113_SHARP_){
return (p1__21113_SHARP_.cljs$core$IFn$_invoke$arity$1 ? p1__21113_SHARP_.cljs$core$IFn$_invoke$arity$1(i) : p1__21113_SHARP_.call(null, i));
}),v);
}),(function (vs){
var vc = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.count,vs);
var c = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.min,vc);
return cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(c,vs);
})(colls));
}));

(cljs_thread.pmap.zipall.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.pmap.zipall.cljs$lang$applyTo = (function (seq21114){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21114));
}));

/**
 * Runtime implementation for pmap. Receives a dispatch function that
 * already has the mapping function and `in` call embedded.
 * 
 * dispatch-fn: (fn [worker-id elem] ...) - dispatches elem to worker-id
 * args: collection(s) to map over
 */
cljs_thread.pmap.do_pmap_inline = (function cljs_thread$pmap$do_pmap_inline(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21195 = arguments.length;
var i__5770__auto___21196 = (0);
while(true){
if((i__5770__auto___21196 < len__5769__auto___21195)){
args__5775__auto__.push((arguments[i__5770__auto___21196]));

var G__21197 = (i__5770__auto___21196 + (1));
i__5770__auto___21196 = G__21197;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.pmap.do_pmap_inline.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.pmap.do_pmap_inline', cljs_thread.pmap.do_pmap_inline);

(cljs_thread.pmap.do_pmap_inline.cljs$core$IFn$_invoke$arity$variadic = (function (dispatch_fn,args){
var injest_ids = (function (){var or__5045__auto__ = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.keyword,new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf))));
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"injest-count","injest-count",-1344910572).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf))], 0));
}
})();
var injest_ids__$1 = cljs.core.vec(injest_ids);
var par_val = (function (){var or__5045__auto__ = cljs_thread.pmap._STAR_par_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.count(injest_ids__$1);
}
})();
var active_workers = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(par_val,injest_ids__$1));
var _ = console.log("[pmap] par-val=",par_val,"active-workers=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([active_workers], 0)));
var zipargs = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(args)))?cljs.core.vec(cljs.core.first(args)):cljs.core.vec(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs_thread.pmap.zipall,args)));
var worker_cycle = cljs.core.cycle(active_workers);
var work_items = cljs.core.map.cljs$core$IFn$_invoke$arity$3(cljs.core.vector,worker_cycle,zipargs);
var batches = cljs.core.partition_all.cljs$core$IFn$_invoke$arity$2(par_val,work_items);
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__21131_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,p1__21131_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (batch){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__21159){
var vec__21162 = p__21159;
var worker_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21162,(0),null);
var elem = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21162,(1),null);
console.log("[pmap] dispatching to",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([worker_id], 0)));

return (dispatch_fn.cljs$core$IFn$_invoke$arity$2 ? dispatch_fn.cljs$core$IFn$_invoke$arity$2(worker_id,elem) : dispatch_fn.call(null, worker_id,elem));
}),batch);
}),batches)], 0)));
}));

(cljs_thread.pmap.do_pmap_inline.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.pmap.do_pmap_inline.cljs$lang$applyTo = (function (seq21132){
var G__21134 = cljs.core.first(seq21132);
var seq21132__$1 = cljs.core.next(seq21132);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21134,seq21132__$1);
}));

/**
 * Runtime implementation for pcalls/pvalues.
 * Receives a vector of dispatch functions, each taking a worker-id
 * and returning a derefable result.
 * 
 * dispatch-fns: [(fn [worker-id] (in worker-id expr)) ...]
 */
cljs_thread.pmap.do_pcalls = (function cljs_thread$pmap$do_pcalls(dispatch_fns){
var injest_ids = (function (){var or__5045__auto__ = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.keyword,new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf))));
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"injest-count","injest-count",-1344910572).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf))], 0));
}
})();
var injest_ids__$1 = cljs.core.vec(injest_ids);
var par_val = (function (){var or__5045__auto__ = cljs_thread.pmap._STAR_par_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.count(injest_ids__$1);
}
})();
var active_workers = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(par_val,injest_ids__$1));
var n = cljs.core.count(dispatch_fns);
var worker_cycle = cljs.core.cycle(active_workers);
console.log("[pcalls] par-val=",par_val,"n=",n);

var results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$3((function (dispatch_fn,worker_id){
console.log("[pcalls] dispatching to",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([worker_id], 0)));

return (dispatch_fn.cljs$core$IFn$_invoke$arity$1 ? dispatch_fn.cljs$core$IFn$_invoke$arity$1(worker_id) : dispatch_fn.call(null, worker_id));
}),dispatch_fns,worker_cycle);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,results);
});
goog.exportSymbol('cljs_thread.pmap.do_pcalls', cljs_thread.pmap.do_pcalls);

//# sourceMappingURL=cljs_thread.pmap.js.map
