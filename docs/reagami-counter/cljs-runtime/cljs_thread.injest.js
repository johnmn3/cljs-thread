goog.provide('cljs_thread.injest');
cljs_thread.injest.mk_injest_ids = (function cljs_thread$injest$mk_injest_ids(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21278 = arguments.length;
var i__5770__auto___21279 = (0);
while(true){
if((i__5770__auto___21279 < len__5769__auto___21278)){
args__5775__auto__.push((arguments[i__5770__auto___21279]));

var G__21280 = (i__5770__auto___21279 + (1));
i__5770__auto___21279 = G__21280;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic = (function (p__21265){
var vec__21266 = p__21265;
var n = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21266,(0),null);
var ws = (function (){var or__5045__auto__ = n;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (cljs_thread.util.num_cores() + (1));
}
})();
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21245_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(["injest-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__21245_SHARP_)].join(''));
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(ws));
}));

(cljs_thread.injest.mk_injest_ids.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.injest.mk_injest_ids.cljs$lang$applyTo = (function (seq21246){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21246));
}));

/**
 * Spawn all injest-* workers. Called from screen.
 */
cljs_thread.injest.spawn_injest_workers = (function cljs_thread$injest$spawn_injest_workers(injest_ids,config){
cljs_thread.util.boot_log("screen","spawn-injest-workers ENTER");

var seq__21273_21281 = cljs.core.seq(injest_ids);
var chunk__21274_21282 = null;
var count__21275_21283 = (0);
var i__21276_21284 = (0);
while(true){
if((i__21276_21284 < count__21275_21283)){
var wid_21285 = chunk__21274_21282.cljs$core$IIndexed$_nth$arity$2(null, i__21276_21284);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_21285)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_21285], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21273_21281,chunk__21274_21282,count__21275_21283,i__21276_21284,wid_21285){
return (function (config__$1){
return cljs_thread.state.update_conf_BANG_(config__$1);
});})(seq__21273_21281,chunk__21274_21282,count__21275_21283,i__21276_21284,wid_21285))
));


var G__21286 = seq__21273_21281;
var G__21287 = chunk__21274_21282;
var G__21288 = count__21275_21283;
var G__21289 = (i__21276_21284 + (1));
seq__21273_21281 = G__21286;
chunk__21274_21282 = G__21287;
count__21275_21283 = G__21288;
i__21276_21284 = G__21289;
continue;
} else {
var temp__5823__auto___21290 = cljs.core.seq(seq__21273_21281);
if(temp__5823__auto___21290){
var seq__21273_21291__$1 = temp__5823__auto___21290;
if(cljs.core.chunked_seq_QMARK_(seq__21273_21291__$1)){
var c__5568__auto___21292 = cljs.core.chunk_first(seq__21273_21291__$1);
var G__21293 = cljs.core.chunk_rest(seq__21273_21291__$1);
var G__21294 = c__5568__auto___21292;
var G__21295 = cljs.core.count(c__5568__auto___21292);
var G__21296 = (0);
seq__21273_21281 = G__21293;
chunk__21274_21282 = G__21294;
count__21275_21283 = G__21295;
i__21276_21284 = G__21296;
continue;
} else {
var wid_21297 = cljs.core.first(seq__21273_21291__$1);
cljs_thread.util.boot_log("screen",["spawning ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(wid_21297)].join(''));

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),wid_21297], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21273_21281,chunk__21274_21282,count__21275_21283,i__21276_21284,wid_21297,seq__21273_21291__$1,temp__5823__auto___21290){
return (function (config__$1){
return cljs_thread.state.update_conf_BANG_(config__$1);
});})(seq__21273_21281,chunk__21274_21282,count__21275_21283,i__21276_21284,wid_21297,seq__21273_21291__$1,temp__5823__auto___21290))
));


var G__21298 = cljs.core.next(seq__21273_21291__$1);
var G__21299 = null;
var G__21300 = (0);
var G__21301 = (0);
seq__21273_21281 = G__21298;
chunk__21274_21282 = G__21299;
count__21275_21283 = G__21300;
i__21276_21284 = G__21301;
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
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.comp,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21277_SHARP_){
if((!(cljs.core.coll_QMARK_(p1__21277_SHARP_)))){
return p1__21277_SHARP_;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(p1__21277_SHARP_))){
return cljs.core.first(p1__21277_SHARP_);
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.first(p1__21277_SHARP_),cljs.core.rest(p1__21277_SHARP_));
}
}
}),xfs));
});
goog.exportSymbol('cljs_thread.injest.compose_xf', cljs_thread.injest.compose_xf);

//# sourceMappingURL=cljs_thread.injest.js.map
