goog.provide('cljs_thread.debug');
/**
 * @define {boolean}
 */
cljs_thread.debug.DEBUG = goog.define("cljs_thread.debug.DEBUG",false);
/**
 * Log debug message. No-op when DEBUG is false (DCE'd in :advanced).
 */
cljs_thread.debug.log = (function cljs_thread$debug$log(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21446 = arguments.length;
var i__5770__auto___21447 = (0);
while(true){
if((i__5770__auto___21447 < len__5769__auto___21446)){
args__5775__auto__.push((arguments[i__5770__auto___21447]));

var G__21448 = (i__5770__auto___21447 + (1));
i__5770__auto___21447 = G__21448;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.debug.log.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.debug.log.cljs$core$IFn$_invoke$arity$variadic = (function (args){
if(cljs_thread.debug.DEBUG){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.println,args);
} else {
return null;
}
}));

(cljs_thread.debug.log.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.debug.log.cljs$lang$applyTo = (function (seq21416){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21416));
}));

/**
 * Log error with context. No-op when DEBUG is false (DCE'd in :advanced).
 */
cljs_thread.debug.log_error = (function cljs_thread$debug$log_error(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21452 = arguments.length;
var i__5770__auto___21453 = (0);
while(true){
if((i__5770__auto___21453 < len__5769__auto___21452)){
args__5775__auto__.push((arguments[i__5770__auto___21453]));

var G__21454 = (i__5770__auto___21453 + (1));
i__5770__auto___21453 = G__21454;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return cljs_thread.debug.log_error.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});

(cljs_thread.debug.log_error.cljs$core$IFn$_invoke$arity$variadic = (function (label,error,p__21421){
var map__21422 = p__21421;
var map__21422__$1 = cljs.core.__destructure_map(map__21422);
var context = map__21422__$1;
if(cljs_thread.debug.DEBUG){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([label,error], 0));

var seq__21424 = cljs.core.seq(context);
var chunk__21425 = null;
var count__21426 = (0);
var i__21427 = (0);
while(true){
if((i__21427 < count__21426)){
var vec__21436 = chunk__21425.cljs$core$IIndexed$_nth$arity$2(null, i__21427);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21436,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21436,(1),null);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k,v], 0));


var G__21457 = seq__21424;
var G__21458 = chunk__21425;
var G__21459 = count__21426;
var G__21460 = (i__21427 + (1));
seq__21424 = G__21457;
chunk__21425 = G__21458;
count__21426 = G__21459;
i__21427 = G__21460;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__21424);
if(temp__5823__auto__){
var seq__21424__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__21424__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__21424__$1);
var G__21461 = cljs.core.chunk_rest(seq__21424__$1);
var G__21462 = c__5568__auto__;
var G__21463 = cljs.core.count(c__5568__auto__);
var G__21464 = (0);
seq__21424 = G__21461;
chunk__21425 = G__21462;
count__21426 = G__21463;
i__21427 = G__21464;
continue;
} else {
var vec__21440 = cljs.core.first(seq__21424__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21440,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21440,(1),null);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k,v], 0));


var G__21465 = cljs.core.next(seq__21424__$1);
var G__21466 = null;
var G__21467 = (0);
var G__21468 = (0);
seq__21424 = G__21465;
chunk__21425 = G__21466;
count__21426 = G__21467;
i__21427 = G__21468;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
}));

(cljs_thread.debug.log_error.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(cljs_thread.debug.log_error.cljs$lang$applyTo = (function (seq21418){
var G__21419 = cljs.core.first(seq21418);
var seq21418__$1 = cljs.core.next(seq21418);
var G__21420 = cljs.core.first(seq21418__$1);
var seq21418__$2 = cljs.core.next(seq21418__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21419,G__21420,seq21418__$2);
}));

/**
 * Log exception with stack trace. Always logs to console.error.
 */
cljs_thread.debug.log_exception = (function cljs_thread$debug$log_exception(label,e){
console.error(label,e);

if(cljs.core.truth_(e.stack)){
return console.error(e.stack);
} else {
return null;
}
});

//# sourceMappingURL=cljs_thread.debug.js.map
