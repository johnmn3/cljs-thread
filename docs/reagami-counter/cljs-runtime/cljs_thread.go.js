goog.provide('cljs_thread.go');
/**
 * Poll a direct SAB sync channel until signaled, then resolve with the result.
 * Uses setTimeout polling to avoid blocking the event loop.
 * in-id is the request identifier used to look up the result in the response-atom map.
 */
cljs_thread.go.poll_sync_channel = (function cljs_thread$go$poll_sync_channel(sync_channel,in_id,resolve,reject){
var map__20574 = sync_channel;
var map__20574__$1 = cljs.core.__destructure_map(map__20574);
var signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20574__$1,new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271));
var response_atom = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20574__$1,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196));
var signal_i32 = (new Int32Array(signal_sab));
var poll = (function cljs_thread$go$poll_sync_channel_$_poll(){
if((Atomics.load(signal_i32,(0)) > (0))){
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(response_atom),in_id);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(response_atom,cljs.core.dissoc,in_id);

if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(result);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result);
} else {
return and__5043__auto__;
}
})())){
var G__20587 = cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Error in remote call",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"result","result",1415092211),result], null));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__20587) : reject.call(null, G__20587));
} else {
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(result) : resolve.call(null, result));
}
} else {
return setTimeout(cljs_thread$go$poll_sync_channel_$_poll,(0));
}
});
return poll();
});
/**
 * If x carries the __cljs_thread_parkable__ tag (set by wrap-derefable),
 * resolve it asynchronously by calling request with {:resolve callback}.
 * Otherwise, deref x synchronously.
 * Calls continuation with the resolved value. Returns a Promise.
 * The explicit tag prevents any non-cljs-thread derefable from being
 * mistakenly routed through the async parking path.
 */
cljs_thread.go.park_deref = (function cljs_thread$go$park_deref(x,continuation){
if(x.__cljs_thread_parkable__ === true){
if((function (){var and__5043__auto__ = (((!((x == null))))?(((((x.cljs$lang$protocol_mask$partition1$ & (1))) || ((cljs.core.PROTOCOL_SENTINEL === x.cljs$core$IPending$))))?true:(((!x.cljs$lang$protocol_mask$partition1$))?cljs.core.native_satisfies_QMARK_(cljs.core.IPending,x):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IPending,x));
if(and__5043__auto__){
return cljs.core._realized_QMARK_(x);
} else {
return and__5043__auto__;
}
})()){
var val = cljs.core.deref(x);
return Promise.resolve((continuation.cljs$core$IFn$_invoke$arity$1 ? continuation.cljs$core$IFn$_invoke$arity$1(val) : continuation.call(null, val)));
} else {
var temp__5821__auto__ = x.__cljs_thread_sync_channel__;
if(cljs.core.truth_(temp__5821__auto__)){
var sync_ch = temp__5821__auto__;
var in_id = cljs_thread.id.get_id(x);
return (new Promise((function (resolve,reject){
return cljs_thread.go.poll_sync_channel(sync_ch,in_id,resolve,reject);
}))).then(continuation);
} else {
var id = cljs_thread.id.get_id(x);
return (new Promise((function (resolve,reject){
return cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic(id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"resolve","resolve",-1584445482),resolve,new cljs.core.Keyword(null,"reject","reject",1415953113),reject], null)], 0));
}))).then((function (result){
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(result);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result);
} else {
return and__5043__auto__;
}
})())){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Error in remote call",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"result","result",1415092211),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result], 0))], null));
} else {
return (continuation.cljs$core$IFn$_invoke$arity$1 ? continuation.cljs$core$IFn$_invoke$arity$1(result) : continuation.call(null, result));
}
}));
}
}
} else {
return Promise.resolve((function (){var G__20603 = cljs.core.deref(x);
return (continuation.cljs$core$IFn$_invoke$arity$1 ? continuation.cljs$core$IFn$_invoke$arity$1(G__20603) : continuation.call(null, G__20603));
})());
}
});
/**
 * Chain a continuation onto a value that may be a Promise.
 * If v is a Promise, uses .then. Otherwise wraps in Promise.resolve.
 */
cljs_thread.go.chain = (function cljs_thread$go$chain(v,continuation){
if((v instanceof Promise)){
return v.then(continuation);
} else {
return Promise.resolve((continuation.cljs$core$IFn$_invoke$arity$1 ? continuation.cljs$core$IFn$_invoke$arity$1(v) : continuation.call(null, v)));
}
});
/**
 * Continuation combinator: (applier f a b) returns (fn [val] (f val a b)).
 * Used by the CPS transform when the deref result appears as the first
 * argument to a function call, avoiding an inline fn definition that would
 * trigger the CLJS compiler's loop-capture IIFE wrapping.
 */
cljs_thread.go.applier = (function cljs_thread$go$applier(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20643 = arguments.length;
var i__5770__auto___20644 = (0);
while(true){
if((i__5770__auto___20644 < len__5769__auto___20643)){
args__5775__auto__.push((arguments[i__5770__auto___20644]));

var G__20645 = (i__5770__auto___20644 + (1));
i__5770__auto___20644 = G__20645;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.go.applier.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.go.applier.cljs$core$IFn$_invoke$arity$variadic = (function (f,trailing_args){
return (function (val){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(f,val,trailing_args);
});
}));

(cljs_thread.go.applier.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.go.applier.cljs$lang$applyTo = (function (seq20609){
var G__20610 = cljs.core.first(seq20609);
var seq20609__$1 = cljs.core.next(seq20609);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20610,seq20609__$1);
}));

/**
 * Wraps a CPS-transformed body function. Calls body-fn which returns
 * either a plain value or a Promise. Ensures the result is always a
 * Promise so callers (do-call, do-future) can detect async go results.
 */
cljs_thread.go.go_body = (function cljs_thread$go$go_body(body_fn){
try{var result = (body_fn.cljs$core$IFn$_invoke$arity$0 ? body_fn.cljs$core$IFn$_invoke$arity$0() : body_fn.call(null, ));
if((result instanceof Promise)){
return result;
} else {
return Promise.resolve(result);
}
}catch (e20612){var e = e20612;
return Promise.reject(e);
}});
/**
 * Attach a catch handler to a go-body result (which is always a Promise).
 * Used by the CPS transform for try/catch forms.
 */
cljs_thread.go.promise_catch = (function cljs_thread$go$promise_catch(promise_val,catch_fn){
var p = (((promise_val instanceof Promise))?promise_val:Promise.resolve(promise_val));
return p.catch((function (err){
var result = (catch_fn.cljs$core$IFn$_invoke$arity$1 ? catch_fn.cljs$core$IFn$_invoke$arity$1(err) : catch_fn.call(null, err));
if((result instanceof Promise)){
return result;
} else {
return Promise.resolve(result);
}
}));
});
/**
 * Attach a finally handler to a go-body result.
 * Used by the CPS transform for try/finally forms.
 */
cljs_thread.go.promise_finally = (function cljs_thread$go$promise_finally(promise_val,finally_fn){
var p = (((promise_val instanceof Promise))?promise_val:Promise.resolve(promise_val));
return p.finally(finally_fn);
});
/**
 * If v is a Promise, return it. Otherwise wrap in Promise.resolve.
 */
cljs_thread.go.ensure_promise = (function cljs_thread$go$ensure_promise(v){
if((v instanceof Promise)){
return v;
} else {
return Promise.resolve(v);
}
});
/**
 * Parking variant of map/mapv. Applies f to each element of coll.
 * f may return a Promise (from CPS-transformed body with park-deref).
 * All applications run concurrently via Promise.all. Returns a Promise<vector>.
 */
cljs_thread.go.park_map = (function cljs_thread$go$park_map(f,coll){
var promises = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs_thread.go.ensure_promise((f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(item) : f.call(null, item)));
}),coll);
return Promise.all(cljs.core.clj__GT_js(promises)).then((function (arr){
return cljs.core.vec(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(arr));
}));
});
/**
 * Parking variant of filter/filterv. Applies pred to each element of coll.
 * pred may return a Promise<bool>. Runs concurrently. Returns Promise<vector>.
 */
cljs_thread.go.park_filter = (function cljs_thread$go$park_filter(pred,coll){
var promises = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs_thread.go.ensure_promise((pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(item) : pred.call(null, item))).then((function (keep_QMARK_){
return [item,keep_QMARK_];
}));
}),coll);
return Promise.all(cljs.core.clj__GT_js(promises)).then((function (pairs){
var pairs__$1 = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(pairs);
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (pair){
var item = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(pair,(0));
var keep_QMARK_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(pair,(1));
if(cljs.core.truth_(keep_QMARK_)){
return item;
} else {
return null;
}
}),pairs__$1));
}));
});
/**
 * Parking variant of remove. Inverse of park-filter.
 */
cljs_thread.go.park_remove = (function cljs_thread$go$park_remove(pred,coll){
return cljs_thread.go.park_filter((function (item){
return cljs_thread.go.ensure_promise((pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(item) : pred.call(null, item))).then(cljs.core.not);
}),coll);
});
/**
 * Parking variant of keep. Like park-map but drops nil results.
 */
cljs_thread.go.park_keep = (function cljs_thread$go$park_keep(f,coll){
var promises = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs_thread.go.ensure_promise((f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(item) : f.call(null, item)));
}),coll);
return Promise.all(cljs.core.clj__GT_js(promises)).then((function (arr){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(arr)));
}));
});
/**
 * Parking variant of run!. Applies f to each element for side effects.
 * Runs concurrently. Returns Promise<nil>.
 */
cljs_thread.go.park_run_BANG_ = (function cljs_thread$go$park_run_BANG_(f,coll){
var promises = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs_thread.go.ensure_promise((f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(item) : f.call(null, item)));
}),coll);
return Promise.all(cljs.core.clj__GT_js(promises)).then((function (_){
return null;
}));
});
/**
 * Parking variant of reduce. Applies f sequentially (not parallel)
 * because each step depends on the accumulator from the prior step.
 * f may return a Promise. Returns Promise<accumulated-value>.
 */
cljs_thread.go.park_reduce = (function cljs_thread$go$park_reduce(var_args){
var G__20637 = arguments.length;
switch (G__20637) {
case 2:
return cljs_thread.go.park_reduce.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs_thread.go.park_reduce.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.go.park_reduce.cljs$core$IFn$_invoke$arity$2 = (function (f,coll){
if(cljs.core.empty_QMARK_(coll)){
return Promise.resolve((f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, )));
} else {
return cljs_thread.go.park_reduce.cljs$core$IFn$_invoke$arity$3(f,cljs.core.first(coll),cljs.core.rest(coll));
}
}));

(cljs_thread.go.park_reduce.cljs$core$IFn$_invoke$arity$3 = (function (f,init,coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (promise_acc,item){
return promise_acc.then((function (acc){
return cljs_thread.go.ensure_promise((f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,item) : f.call(null, acc,item)));
}));
}),Promise.resolve(init),coll);
}));

(cljs_thread.go.park_reduce.cljs$lang$maxFixedArity = 3);

/**
 * Parking variant of some. Applies pred sequentially, short-circuits
 * on first truthy result. Returns Promise<first-truthy-or-nil>.
 */
cljs_thread.go.park_some = (function cljs_thread$go$park_some(pred,coll){
if(cljs.core.empty_QMARK_(coll)){
return Promise.resolve(null);
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (promise_acc,item){
return promise_acc.then((function (found){
if(cljs.core.truth_(found)){
return found;
} else {
return cljs_thread.go.ensure_promise((pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(item) : pred.call(null, item)));
}
}));
}),Promise.resolve(null),coll);
}
});

//# sourceMappingURL=cljs_thread.go.js.map
