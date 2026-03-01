goog.provide('cljs.analyzer.impl.namespaces');
/**
 * Given a libspec return a map of :as-alias alias, if was present. Return the
 * libspec with :as-alias elided. If the libspec was *only* :as-alias do not
 * return it.
 */
cljs.analyzer.impl.namespaces.check_and_remove_as_alias = (function cljs$analyzer$impl$namespaces$check_and_remove_as_alias(libspec){
if((((libspec instanceof cljs.core.Symbol)) || ((libspec instanceof cljs.core.Keyword)))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec], null);
} else {
var vec__25898 = libspec;
var seq__25899 = cljs.core.seq(vec__25898);
var first__25900 = cljs.core.first(seq__25899);
var seq__25899__$1 = cljs.core.next(seq__25899);
var lib = first__25900;
var spec = seq__25899__$1;
var libspec__$1 = vec__25898;
var vec__25901 = cljs.core.split_with(cljs.core.complement(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),null], null), null)),spec);
var pre_spec = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25901,(0),null);
var vec__25904 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25901,(1),null);
var seq__25905 = cljs.core.seq(vec__25904);
var first__25906 = cljs.core.first(seq__25905);
var seq__25905__$1 = cljs.core.next(seq__25905);
var _ = first__25906;
var first__25906__$1 = cljs.core.first(seq__25905__$1);
var seq__25905__$2 = cljs.core.next(seq__25905__$1);
var alias = first__25906__$1;
var post_spec = seq__25905__$2;
var post = vec__25904;
if(cljs.core.seq(post)){
var libspec_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [lib], null),cljs.core.concat.cljs$core$IFn$_invoke$arity$2(pre_spec,post_spec));
if((alias instanceof cljs.core.Symbol)){
} else {
throw (new Error(["Assert failed: ",[":as-alias must be followed by a symbol, got: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias)].join(''),"\n","(symbol? alias)"].join('')));
}

var G__25907 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),cljs.core.PersistentArrayMap.createAsIfByAssoc([alias,lib])], null);
if((cljs.core.count(libspec_SINGLEQUOTE_) > (1))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25907,new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec_SINGLEQUOTE_);
} else {
return G__25907;
}
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec__$1], null);
}
}
});
cljs.analyzer.impl.namespaces.check_as_alias_duplicates = (function cljs$analyzer$impl$namespaces$check_as_alias_duplicates(as_aliases,new_as_aliases){
var seq__25908 = cljs.core.seq(new_as_aliases);
var chunk__25909 = null;
var count__25910 = (0);
var i__25911 = (0);
while(true){
if((i__25911 < count__25910)){
var vec__25920 = chunk__25909.cljs$core$IIndexed$_nth$arity$2(null, i__25911);
var alias = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25920,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25920,(1),null);
if((!(cljs.core.contains_QMARK_(as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__25952 = seq__25908;
var G__25953 = chunk__25909;
var G__25954 = count__25910;
var G__25955 = (i__25911 + (1));
seq__25908 = G__25952;
chunk__25909 = G__25953;
count__25910 = G__25954;
i__25911 = G__25955;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__25908);
if(temp__5823__auto__){
var seq__25908__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25908__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__25908__$1);
var G__25956 = cljs.core.chunk_rest(seq__25908__$1);
var G__25957 = c__5568__auto__;
var G__25958 = cljs.core.count(c__5568__auto__);
var G__25959 = (0);
seq__25908 = G__25956;
chunk__25909 = G__25957;
count__25910 = G__25958;
i__25911 = G__25959;
continue;
} else {
var vec__25926 = cljs.core.first(seq__25908__$1);
var alias = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25926,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25926,(1),null);
if((!(cljs.core.contains_QMARK_(as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__25961 = cljs.core.next(seq__25908__$1);
var G__25962 = null;
var G__25963 = (0);
var G__25964 = (0);
seq__25908 = G__25961;
chunk__25909 = G__25962;
count__25910 = G__25963;
i__25911 = G__25964;
continue;
}
} else {
return null;
}
}
break;
}
});
/**
 * Given libspecs, elide all :as-alias. Return a map of :libspecs (filtered)
 * and :as-aliases.
 */
cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs = (function cljs$analyzer$impl$namespaces$elide_aliases_from_libspecs(var_args){
var G__25934 = arguments.length;
switch (G__25934) {
case 1:
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$1 = (function (libspecs){
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2(libspecs,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2 = (function (libspecs,as_aliases){
var ret = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),as_aliases,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.PersistentVector.EMPTY], null);
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__$1,libspec){
var map__25939 = cljs.analyzer.impl.namespaces.check_and_remove_as_alias(libspec);
var map__25939__$1 = cljs.core.__destructure_map(map__25939);
var as_alias = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25939__$1,new cljs.core.Keyword(null,"as-alias","as-alias",82482467));
var libspec__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25939__$1,new cljs.core.Keyword(null,"libspec","libspec",1228503756));
cljs.analyzer.impl.namespaces.check_as_alias_duplicates(new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798).cljs$core$IFn$_invoke$arity$1(ret__$1),as_alias);

var G__25940 = ret__$1;
var G__25940__$1 = (cljs.core.truth_(libspec__$1)?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25940,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,libspec__$1):G__25940);
if(cljs.core.truth_(as_alias)){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25940__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_alias);
} else {
return G__25940__$1;
}
}),ret,libspecs);
}));

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$lang$maxFixedArity = 2);

cljs.analyzer.impl.namespaces.elide_aliases_from_ns_specs = (function cljs$analyzer$impl$namespaces$elide_aliases_from_ns_specs(ns_specs){

var ret = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.PersistentVector.EMPTY], null);
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p__25943,p__25944){
var map__25945 = p__25943;
var map__25945__$1 = cljs.core.__destructure_map(map__25945);
var ret__$1 = map__25945__$1;
var as_aliases = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25945__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var vec__25946 = p__25944;
var seq__25947 = cljs.core.seq(vec__25946);
var first__25948 = cljs.core.first(seq__25947);
var seq__25947__$1 = cljs.core.next(seq__25947);
var spec_key = first__25948;
var libspecs = seq__25947__$1;
if((!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"refer-clojure","refer-clojure",813784440),spec_key)))){
var map__25950 = cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2(libspecs,as_aliases);
var map__25950__$1 = cljs.core.__destructure_map(map__25950);
var as_aliases__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25950__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var libspecs__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25950__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195));
var G__25951 = ret__$1;
var G__25951__$1 = (((!(cljs.core.empty_QMARK_(as_aliases__$1))))?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25951,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_aliases__$1):G__25951);
if((!(cljs.core.empty_QMARK_(libspecs__$1)))){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25951__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$2(spec_key,libspecs__$1));
} else {
return G__25951__$1;
}
} else {
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(ret__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$2(spec_key,libspecs));
}
}),ret,ns_specs);
});

//# sourceMappingURL=cljs.analyzer.impl.namespaces.js.map
