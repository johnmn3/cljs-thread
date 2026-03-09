goog.provide('cljs_thread.db');
cljs_thread.db.db_set_BANG_ = (function cljs_thread$db$db_set_BANG_(k,data){
cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"db","db",993250759),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,data], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (k__$1,data__$1){
return cljs_thread.idb.idb_set_BANG_.cljs$core$IFn$_invoke$arity$variadic(k__$1,data__$1,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.identity], 0));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));

return data;
});
cljs_thread.db.db_get = (function cljs_thread$db$db_get(k){
var res = cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"db","db",993250759),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__){
return (function (k__$1){
var yield$ = (function (res__20834__auto__){
return cljs_thread.in$.yield_result_BANG_(in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__,res__20834__auto__);
});
return cljs_thread.idb.idb_get(k__$1,yield$);
});
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),(function (){var fexpr__20850 = cljs_thread.idb.idb_get(k,cljs_thread.db.yield$);
return (fexpr__20850.cljs$core$IFn$_invoke$arity$0 ? fexpr__20850.cljs$core$IFn$_invoke$arity$0() : fexpr__20850.call(null, ));
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
if((!(cljs.core.contains_QMARK_(res,new cljs.core.Keyword(null,"res","res",-1395007879))))){
return null;
} else {
return new cljs.core.Keyword(null,"res","res",-1395007879).cljs$core$IFn$_invoke$arity$1(res);
}
});

//# sourceMappingURL=cljs_thread.db.js.map
