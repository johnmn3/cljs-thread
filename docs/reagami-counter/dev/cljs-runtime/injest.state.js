goog.provide('injest.state');
injest.state.transducables = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
injest.state.par_transducables = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
injest.state.regxf_BANG_ = (function injest$state$regxf_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28504 = arguments.length;
var i__5770__auto___28505 = (0);
while(true){
if((i__5770__auto___28505 < len__5769__auto___28504)){
args__5775__auto__.push((arguments[i__5770__auto___28505]));

var G__28506 = (i__5770__auto___28505 + (1));
i__5770__auto___28505 = G__28506;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return injest.state.regxf_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(injest.state.regxf_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (xfs){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(injest.state.transducables,cljs.core.into,xfs);
}));

(injest.state.regxf_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(injest.state.regxf_BANG_.cljs$lang$applyTo = (function (seq28497){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28497));
}));

injest.state.regpxf_BANG_ = (function injest$state$regpxf_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28507 = arguments.length;
var i__5770__auto___28508 = (0);
while(true){
if((i__5770__auto___28508 < len__5769__auto___28507)){
args__5775__auto__.push((arguments[i__5770__auto___28508]));

var G__28509 = (i__5770__auto___28508 + (1));
i__5770__auto___28508 = G__28509;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return injest.state.regpxf_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(injest.state.regpxf_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (xfs){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(injest.state.par_transducables,cljs.core.into,xfs);
}));

(injest.state.regpxf_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(injest.state.regpxf_BANG_.cljs$lang$applyTo = (function (seq28502){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28502));
}));

cljs.core.apply.cljs$core$IFn$_invoke$arity$2(injest.state.regxf_BANG_,injest.data.def_regs);
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(injest.state.regpxf_BANG_,injest.data.par_regs);

//# sourceMappingURL=injest.state.js.map
