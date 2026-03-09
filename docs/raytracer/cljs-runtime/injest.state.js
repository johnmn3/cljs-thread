goog.provide('injest.state');
injest.state.transducables = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
injest.state.par_transducables = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
injest.state.regxf_BANG_ = (function injest$state$regxf_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28471 = arguments.length;
var i__5770__auto___28472 = (0);
while(true){
if((i__5770__auto___28472 < len__5769__auto___28471)){
args__5775__auto__.push((arguments[i__5770__auto___28472]));

var G__28473 = (i__5770__auto___28472 + (1));
i__5770__auto___28472 = G__28473;
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
(injest.state.regxf_BANG_.cljs$lang$applyTo = (function (seq28467){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28467));
}));

injest.state.regpxf_BANG_ = (function injest$state$regpxf_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28474 = arguments.length;
var i__5770__auto___28475 = (0);
while(true){
if((i__5770__auto___28475 < len__5769__auto___28474)){
args__5775__auto__.push((arguments[i__5770__auto___28475]));

var G__28476 = (i__5770__auto___28475 + (1));
i__5770__auto___28475 = G__28476;
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
(injest.state.regpxf_BANG_.cljs$lang$applyTo = (function (seq28469){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28469));
}));

cljs.core.apply.cljs$core$IFn$_invoke$arity$2(injest.state.regxf_BANG_,injest.data.def_regs);
cljs.core.apply.cljs$core$IFn$_invoke$arity$2(injest.state.regpxf_BANG_,injest.data.par_regs);

//# sourceMappingURL=injest.state.js.map
