goog.provide('cljs_thread.pmap');
cljs_thread.pmap.zipall = (function cljs_thread$pmap$zipall(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20864 = arguments.length;
var i__5770__auto___20865 = (0);
while(true){
if((i__5770__auto___20865 < len__5769__auto___20864)){
args__5775__auto__.push((arguments[i__5770__auto___20865]));

var G__20866 = (i__5770__auto___20865 + (1));
i__5770__auto___20865 = G__20866;
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
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__20742_SHARP_){
return (p1__20742_SHARP_.cljs$core$IFn$_invoke$arity$1 ? p1__20742_SHARP_.cljs$core$IFn$_invoke$arity$1(i) : p1__20742_SHARP_.call(null, i));
}),v);
}),(function (vs){
var vc = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.count,vs);
var c = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.min,vc);
return cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(c,vs);
})(colls));
}));

(cljs_thread.pmap.zipall.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.pmap.zipall.cljs$lang$applyTo = (function (seq20746){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq20746));
}));

cljs_thread.pmap.do_pmap = (function cljs_thread$pmap$do_pmap(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20867 = arguments.length;
var i__5770__auto___20868 = (0);
while(true){
if((i__5770__auto___20868 < len__5769__auto___20867)){
args__5775__auto__.push((arguments[i__5770__auto___20868]));

var G__20869 = (i__5770__auto___20868 + (1));
i__5770__auto___20868 = G__20869;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return cljs_thread.pmap.do_pmap.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.pmap.do_pmap', cljs_thread.pmap.do_pmap);

(cljs_thread.pmap.do_pmap.cljs$core$IFn$_invoke$arity$variadic = (function (conveyer,afn,args){
var pws = cljs.core.cycle(cljs_thread.injest.mk_injest_ids());
var zipargs = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(args)))?cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__20792_SHARP_){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__20792_SHARP_], null);
}),cljs.core.first(args)):cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs_thread.pmap.zipall,args));
var pa = cljs.core.map.cljs$core$IFn$_invoke$arity$3((function (p,a){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p,a], null);
}),pws,zipargs);
var pas = cljs.core.partition_all.cljs$core$IFn$_invoke$arity$2((cljs_thread.util.num_cores() + (1)),pa);
if(cljs.core.truth_((function (){var or__5045__auto__ = cljs_thread.env.in_screen_QMARK_();
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.env.in_root_QMARK_();
}
})())){
var temp__5821__auto__ = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5821__auto__)){
var w__20548__auto__ = temp__5821__auto__;
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20548__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [pas,pa,pa,afn,conveyer,w__20548__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (pas__$1,pa__$1,pa__$2,afn__$1,conveyer__$1,w__20548__auto____$1){
try{return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__20797_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,p1__20797_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (pa__$3){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__20821){
var vec__20822 = p__20821;
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20822,(0),null);
var a = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20822,(1),null);
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(p,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [afn__$1,conveyer__$1,a], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (afn__$2,conveyer__$2,a__$1){
var f = eval(["(function(){return(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn__$2),");})();"].join(''));
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,conveyer__$2),a__$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),pa__$3);
}),pas__$1)], 0));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20548__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
} else {
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"future","future",1877842724),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [pas,pa,pa,afn,conveyer,pas,pa,pa,afn,conveyer], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (in_id__20396__auto__,direct_sync_QMARK___20397__auto__,sync_signal_sab__20398__auto__,sync_atom_id__20399__auto__,sync_atom_idx__20400__auto__){
return (function (pas__$1,pa__$1,pa__$2,afn__$1,conveyer__$1,pas__$2,pa__$3,pa__$4,afn__$2,conveyer__$2){
var yield$ = (function (res__20401__auto__){
return cljs_thread.in$.yield_result_BANG_(in_id__20396__auto__,direct_sync_QMARK___20397__auto__,sync_signal_sab__20398__auto__,sync_atom_id__20399__auto__,sync_atom_idx__20400__auto__,res__20401__auto__);
});
var k__20549__auto__ = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.util.gen_id());
return cljs.core.add_watch(cljs_thread.future.pool,k__20549__auto__,(function (___20550__auto__,___20550__auto____$1,___20550__auto____$2,___20550__auto____$3){
var temp__5823__auto__ = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5823__auto__)){
var w__20548__auto__ = temp__5823__auto__;
cljs.core.remove_watch(cljs_thread.future.pool,k__20549__auto__);

return yield$(cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20548__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [pas__$2,pa__$4,pa__$4,afn__$2,conveyer__$2,w__20548__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (pas__$3,pa__$5,pa__$6,afn__$3,conveyer__$3,w__20548__auto____$1){
try{return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__20797_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,p1__20797_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (pa__$7){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__20837){
var vec__20838 = p__20837;
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20838,(0),null);
var a = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20838,(1),null);
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(p,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [afn__$3,conveyer__$3,a], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (afn__$4,conveyer__$4,a__$1){
var f = eval(["(function(){return(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn__$4),");})();"].join(''));
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,conveyer__$4),a__$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),pa__$7);
}),pas__$3)], 0));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20548__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0))));
} else {
return null;
}
}));
});
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),(function (){var fexpr__20850 = (function (){var G__20851 = cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.pmap.w__20548__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [pas,pa,pa,afn,conveyer,cljs_thread.pmap.w__20548__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (pas__$1,pa__$1,pa__$2,afn__$1,conveyer__$1,w__20548__auto__){
try{return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__20797_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,p1__20797_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (pa__$3){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__20856){
var vec__20857 = p__20856;
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20857,(0),null);
var a = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20857,(1),null);
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(p,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [afn__$1,conveyer__$1,a], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (afn__$2,conveyer__$2,a__$1){
var f = eval(["(function(){return(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn__$2),");})();"].join(''));
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,conveyer__$2),a__$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),pa__$3);
}),pas__$1)], 0));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20548__auto__);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return (cljs_thread.pmap.yield$.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.pmap.yield$.cljs$core$IFn$_invoke$arity$1(G__20851) : cljs_thread.pmap.yield$.call(null, G__20851));
})();
return (fexpr__20850.cljs$core$IFn$_invoke$arity$0 ? fexpr__20850.cljs$core$IFn$_invoke$arity$0() : fexpr__20850.call(null, ));
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}
} else {
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__20799_SHARP_){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.deref,p1__20799_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (pa__$1){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__20860){
var vec__20861 = p__20860;
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20861,(0),null);
var a = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20861,(1),null);
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(p,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [afn,conveyer,a], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (afn__$1,conveyer__$1,a__$1){
var f = eval(["(function(){return(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn__$1),");})();"].join(''));
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,conveyer__$1),a__$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),pa__$1);
}),pas)], 0));
}
}));

(cljs_thread.pmap.do_pmap.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(cljs_thread.pmap.do_pmap.cljs$lang$applyTo = (function (seq20801){
var G__20803 = cljs.core.first(seq20801);
var seq20801__$1 = cljs.core.next(seq20801);
var G__20804 = cljs.core.first(seq20801__$1);
var seq20801__$2 = cljs.core.next(seq20801__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20803,G__20804,seq20801__$2);
}));


//# sourceMappingURL=cljs_thread.pmap.js.map
