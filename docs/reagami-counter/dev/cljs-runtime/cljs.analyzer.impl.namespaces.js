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
var vec__25944 = libspec;
var seq__25945 = cljs.core.seq(vec__25944);
var first__25946 = cljs.core.first(seq__25945);
var seq__25945__$1 = cljs.core.next(seq__25945);
var lib = first__25946;
var spec = seq__25945__$1;
var libspec__$1 = vec__25944;
var vec__25947 = cljs.core.split_with(cljs.core.complement(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),null], null), null)),spec);
var pre_spec = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25947,(0),null);
var vec__25950 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25947,(1),null);
var seq__25951 = cljs.core.seq(vec__25950);
var first__25952 = cljs.core.first(seq__25951);
var seq__25951__$1 = cljs.core.next(seq__25951);
var _ = first__25952;
var first__25952__$1 = cljs.core.first(seq__25951__$1);
var seq__25951__$2 = cljs.core.next(seq__25951__$1);
var alias = first__25952__$1;
var post_spec = seq__25951__$2;
var post = vec__25950;
if(cljs.core.seq(post)){
var libspec_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [lib], null),cljs.core.concat.cljs$core$IFn$_invoke$arity$2(pre_spec,post_spec));
if((alias instanceof cljs.core.Symbol)){
} else {
throw (new Error(["Assert failed: ",[":as-alias must be followed by a symbol, got: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias)].join(''),"\n","(symbol? alias)"].join('')));
}

var G__25953 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),cljs.core.PersistentArrayMap.createAsIfByAssoc([alias,lib])], null);
if((cljs.core.count(libspec_SINGLEQUOTE_) > (1))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25953,new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec_SINGLEQUOTE_);
} else {
return G__25953;
}
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec__$1], null);
}
}
});
cljs.analyzer.impl.namespaces.check_as_alias_duplicates = (function cljs$analyzer$impl$namespaces$check_as_alias_duplicates(as_aliases,new_as_aliases){
var seq__25955 = cljs.core.seq(new_as_aliases);
var chunk__25956 = null;
var count__25957 = (0);
var i__25958 = (0);
while(true){
if((i__25958 < count__25957)){
var vec__25972 = chunk__25956.cljs$core$IIndexed$_nth$arity$2(null, i__25958);
var alias = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25972,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25972,(1),null);
if((!(cljs.core.contains_QMARK_(as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__26000 = seq__25955;
var G__26001 = chunk__25956;
var G__26002 = count__25957;
var G__26003 = (i__25958 + (1));
seq__25955 = G__26000;
chunk__25956 = G__26001;
count__25957 = G__26002;
i__25958 = G__26003;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__25955);
if(temp__5823__auto__){
var seq__25955__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25955__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__25955__$1);
var G__26004 = cljs.core.chunk_rest(seq__25955__$1);
var G__26005 = c__5568__auto__;
var G__26006 = cljs.core.count(c__5568__auto__);
var G__26007 = (0);
seq__25955 = G__26004;
chunk__25956 = G__26005;
count__25957 = G__26006;
i__25958 = G__26007;
continue;
} else {
var vec__25976 = cljs.core.first(seq__25955__$1);
var alias = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25976,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25976,(1),null);
if((!(cljs.core.contains_QMARK_(as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__26008 = cljs.core.next(seq__25955__$1);
var G__26009 = null;
var G__26010 = (0);
var G__26011 = (0);
seq__25955 = G__26008;
chunk__25956 = G__26009;
count__25957 = G__26010;
i__25958 = G__26011;
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
var G__25987 = arguments.length;
switch (G__25987) {
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
var map__25988 = cljs.analyzer.impl.namespaces.check_and_remove_as_alias(libspec);
var map__25988__$1 = cljs.core.__destructure_map(map__25988);
var as_alias = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25988__$1,new cljs.core.Keyword(null,"as-alias","as-alias",82482467));
var libspec__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25988__$1,new cljs.core.Keyword(null,"libspec","libspec",1228503756));
cljs.analyzer.impl.namespaces.check_as_alias_duplicates(new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798).cljs$core$IFn$_invoke$arity$1(ret__$1),as_alias);

var G__25989 = ret__$1;
var G__25989__$1 = (cljs.core.truth_(libspec__$1)?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25989,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,libspec__$1):G__25989);
if(cljs.core.truth_(as_alias)){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25989__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_alias);
} else {
return G__25989__$1;
}
}),ret,libspecs);
}));

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$lang$maxFixedArity = 2);

cljs.analyzer.impl.namespaces.elide_aliases_from_ns_specs = (function cljs$analyzer$impl$namespaces$elide_aliases_from_ns_specs(ns_specs){

var ret = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.PersistentVector.EMPTY], null);
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p__25990,p__25991){
var map__25992 = p__25990;
var map__25992__$1 = cljs.core.__destructure_map(map__25992);
var ret__$1 = map__25992__$1;
var as_aliases = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25992__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var vec__25993 = p__25991;
var seq__25994 = cljs.core.seq(vec__25993);
var first__25995 = cljs.core.first(seq__25994);
var seq__25994__$1 = cljs.core.next(seq__25994);
var spec_key = first__25995;
var libspecs = seq__25994__$1;
if((!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"refer-clojure","refer-clojure",813784440),spec_key)))){
var map__25996 = cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2(libspecs,as_aliases);
var map__25996__$1 = cljs.core.__destructure_map(map__25996);
var as_aliases__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25996__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var libspecs__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25996__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195));
var G__25997 = ret__$1;
var G__25997__$1 = (((!(cljs.core.empty_QMARK_(as_aliases__$1))))?cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25997,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_aliases__$1):G__25997);
if((!(cljs.core.empty_QMARK_(libspecs__$1)))){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(G__25997__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$2(spec_key,libspecs__$1));
} else {
return G__25997__$1;
}
} else {
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(ret__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$2(spec_key,libspecs));
}
}),ret,ns_specs);
});

//# sourceMappingURL=cljs.analyzer.impl.namespaces.js.map
