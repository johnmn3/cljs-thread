goog.provide('cljs_thread.injest');
cljs_thread.injest.mk_injest_ids = (function cljs_thread$injest$mk_injest_ids(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28686 = arguments.length;
var i__5770__auto___28687 = (0);
while(true){
if((i__5770__auto___28687 < len__5769__auto___28686)){
args__5775__auto__.push((arguments[i__5770__auto___28687]));

var G__28688 = (i__5770__auto___28687 + (1));
i__5770__auto___28687 = G__28688;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic = (function (p__28670){
var vec__28674 = p__28670;
var n = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28674,(0),null);
var cores = cljs_thread.util.num_cores();
var future_count = (function (){var x__5130__auto__ = (2);
var y__5131__auto__ = cljs.core.quot(cores,(4));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var ws = (function (){var or__5045__auto__ = n;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var x__5130__auto__ = (2);
var y__5131__auto__ = ((cores - (3)) - future_count);
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
}
})();
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28668_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(["injest-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__28668_SHARP_)].join(''));
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(ws));
}));

(cljs_thread.injest.mk_injest_ids.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.injest.mk_injest_ids.cljs$lang$applyTo = (function (seq28669){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28669));
}));

/**
 * Spawn all injest-* workers. Called from screen.
 */
cljs_thread.injest.spawn_injest_workers = (function cljs_thread$injest$spawn_injest_workers(injest_ids,config){
cljs_thread.util.boot_log("screen","spawn-injest-workers ENTER");

var seq__28677_28689 = cljs.core.seq(injest_ids);
var chunk__28678_28690 = null;
var count__28679_28691 = (0);
var i__28680_28692 = (0);
while(true){
if((i__28680_28692 < count__28679_28691)){
var wid_28693 = chunk__28678_28690.cljs$core$IIndexed$_nth$arity$2(null, i__28680_28692);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_28693)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_28693], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__28677_28689,chunk__28678_28690,count__28679_28691,i__28680_28692,wid_28693){
return (function (config__$1){
return cljs_thread.state.update_conf_BANG_(config__$1);
});})(seq__28677_28689,chunk__28678_28690,count__28679_28691,i__28680_28692,wid_28693))
));


var G__28694 = seq__28677_28689;
var G__28695 = chunk__28678_28690;
var G__28696 = count__28679_28691;
var G__28697 = (i__28680_28692 + (1));
seq__28677_28689 = G__28694;
chunk__28678_28690 = G__28695;
count__28679_28691 = G__28696;
i__28680_28692 = G__28697;
continue;
} else {
var temp__5823__auto___28698 = cljs.core.seq(seq__28677_28689);
if(temp__5823__auto___28698){
var seq__28677_28699__$1 = temp__5823__auto___28698;
if(cljs.core.chunked_seq_QMARK_(seq__28677_28699__$1)){
var c__5568__auto___28700 = cljs.core.chunk_first(seq__28677_28699__$1);
var G__28702 = cljs.core.chunk_rest(seq__28677_28699__$1);
var G__28703 = c__5568__auto___28700;
var G__28704 = cljs.core.count(c__5568__auto___28700);
var G__28705 = (0);
seq__28677_28689 = G__28702;
chunk__28678_28690 = G__28703;
count__28679_28691 = G__28704;
i__28680_28692 = G__28705;
continue;
} else {
var wid_28706 = cljs.core.first(seq__28677_28699__$1);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_28706)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_28706], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__28677_28689,chunk__28678_28690,count__28679_28691,i__28680_28692,wid_28706,seq__28677_28699__$1,temp__5823__auto___28698){
return (function (config__$1){
return cljs_thread.state.update_conf_BANG_(config__$1);
});})(seq__28677_28689,chunk__28678_28690,count__28679_28691,i__28680_28692,wid_28706,seq__28677_28699__$1,temp__5823__auto___28698))
));


var G__28709 = cljs.core.next(seq__28677_28699__$1);
var G__28711 = null;
var G__28712 = (0);
var G__28713 = (0);
seq__28677_28689 = G__28709;
chunk__28678_28690 = G__28711;
count__28679_28691 = G__28712;
i__28680_28692 = G__28713;
continue;
}
} else {
}
}
break;
}

return cljs_thread.util.boot_log("screen","spawn-injest-workers EXIT");
});
/**
 * Legacy entry point - now just logs deprecation. Injest workers spawned from screen.
 */
cljs_thread.injest.start_injests = (function cljs_thread$injest$start_injests(configs){
cljs_thread.util.boot_log("root","start-injests called (no-op, workers spawned from screen)");

return new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181).cljs$core$IFn$_invoke$arity$1(configs);
});
cljs_thread.injest.core_preds = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"neg?","neg?",752260192),new cljs.core.Keyword(null,"string?","string?",1525260005),new cljs.core.Keyword(null,"keyword?","keyword?",277265542),new cljs.core.Keyword(null,"int?","int?",159198118),new cljs.core.Keyword(null,"even?","even?",826610375),new cljs.core.Keyword(null,"zero?","zero?",-1314772630),new cljs.core.Keyword(null,"nil?","nil?",-28492597),new cljs.core.Keyword(null,"odd?","odd?",1195847570),new cljs.core.Keyword(null,"number?","number?",907153559),new cljs.core.Keyword(null,"pos?","pos?",-1884909249)],[cljs.core.neg_QMARK_,cljs.core.string_QMARK_,cljs.core.keyword_QMARK_,cljs.core.int_QMARK_,cljs.core.even_QMARK_,cljs.core.zero_QMARK_,cljs.core.nil_QMARK_,cljs.core.odd_QMARK_,cljs.core.number_QMARK_,cljs.core.pos_QMARK_]);
goog.exportSymbol('cljs_thread.injest.core_preds', cljs_thread.injest.core_preds);
cljs_thread.injest.core_ops = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"min","min",444991522),new cljs.core.Keyword(null,"*","*",-1294732318),new cljs.core.Keyword(null,"identity","identity",1647396035),new cljs.core.Keyword(null,"vec","vec",-657847931),new cljs.core.Keyword(null,"second","second",-444702010),new cljs.core.Keyword(null,"pr-str","pr-str",587523624),new cljs.core.Keyword(null,"symbol","symbol",-1038572696),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"-","-",-2112348439),new cljs.core.Keyword(null,"not","not",-595976884),new cljs.core.Keyword(null,"vals","vals",768058733),new cljs.core.Keyword(null,"/","/",1282502798),new cljs.core.Keyword(null,"partial","partial",241141745),new cljs.core.Keyword(null,"inc","inc",-1316026094),new cljs.core.Keyword(null,"keys","keys",1068423698),new cljs.core.Keyword(null,"str","str",1089608819),new cljs.core.Keyword(null,"+","+",1913524883),new cljs.core.Keyword(null,"keyword","keyword",811389747),new cljs.core.Keyword(null,"max","max",61366548),new cljs.core.Keyword(null,"deref","deref",-145586795),new cljs.core.Keyword(null,"count","count",2139924085),new cljs.core.Keyword(null,"complement","complement",1740829718),new cljs.core.Keyword(null,"seq","seq",-1817803783),new cljs.core.Keyword(null,"first","first",-644103046),new cljs.core.Keyword(null,"set","set",304602554),new cljs.core.Keyword(null,"dec","dec",1888433436),new cljs.core.Keyword(null,"last","last",1105735132),new cljs.core.Keyword(null,"juxt","juxt",-969445923),new cljs.core.Keyword(null,"comp","comp",1191953630)],[cljs.core.min,cljs.core._STAR_,cljs.core.identity,cljs.core.vec,cljs.core.second,cljs.core.pr_str,cljs.core.symbol,cljs.core.name,cljs.core._,cljs.core.not,cljs.core.vals,cljs.core._SLASH_,cljs.core.partial,cljs.core.inc,cljs.core.keys,cljs.core.str,cljs.core._PLUS_,cljs.core.keyword,cljs.core.max,cljs.core.deref,cljs.core.count,cljs.core.complement,cljs.core.seq,cljs.core.first,cljs.core.set,cljs.core.dec,cljs.core.last,cljs.core.juxt,cljs.core.comp]);
goog.exportSymbol('cljs_thread.injest.core_ops', cljs_thread.injest.core_ops);
cljs_thread.injest.compose_xf = (function cljs_thread$injest$compose_xf(xfs){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.comp,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28685_SHARP_){
if((!(cljs.core.coll_QMARK_(p1__28685_SHARP_)))){
return p1__28685_SHARP_;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(p1__28685_SHARP_))){
return cljs.core.first(p1__28685_SHARP_);
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.first(p1__28685_SHARP_),cljs.core.rest(p1__28685_SHARP_));
}
}
}),xfs));
});
goog.exportSymbol('cljs_thread.injest.compose_xf', cljs_thread.injest.compose_xf);

//# sourceMappingURL=cljs_thread.injest.js.map
