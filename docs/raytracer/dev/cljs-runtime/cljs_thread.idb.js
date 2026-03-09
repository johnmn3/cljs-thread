goog.provide('cljs_thread.idb');
cljs_thread.idb.idb_key = "cljs-thread.db";
cljs_thread.idb.open_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
cljs_thread.idb.idb_set_BANG_ = (function cljs_thread$idb$idb_set_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20277 = arguments.length;
var i__5770__auto___20278 = (0);
while(true){
if((i__5770__auto___20278 < len__5769__auto___20277)){
args__5775__auto__.push((arguments[i__5770__auto___20278]));

var G__20279 = (i__5770__auto___20278 + (1));
i__5770__auto___20278 = G__20279;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((2) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((2)),(0),null)):null);
return cljs_thread.idb.idb_set_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.idb.idb_set_BANG_', cljs_thread.idb.idb_set_BANG_);

(cljs_thread.idb.idb_set_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (k,data,p__20266){
var vec__20267 = p__20266;
var yield$ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20267,(0),null);
return cljs_thread.on_when.do_on_watch(cljs_thread.idb.open_QMARK_,cljs.core.true_QMARK_,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"wkey","wkey",647381818),["open?-true?","-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.gensym.cljs$core$IFn$_invoke$arity$0())].join(''),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.idb",new cljs.core.Keyword(null,"line","line",212345235),13], null)], 0)),(function (){
var adb = cljs.core.deref(cljs_thread.state.idb);
var transaction = adb.transaction([cljs_thread.idb.idb_key],"readwrite");
var os = transaction.objectStore(cljs_thread.idb.idb_key);
var req = os.put(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data], 0)),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k], 0)));
(req.onerror = (function (){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"idb-set!","idb-set!",872311162),new cljs.core.Keyword(null,"error","error",-978969032)], 0));
}));

(req.onsuccess = (function (p1__20262_SHARP_){
var res = (function (){var G__20270 = p1__20262_SHARP_;
var G__20270__$1 = (((G__20270 == null))?null:G__20270.target);
if((G__20270__$1 == null)){
return null;
} else {
return G__20270__$1.result;
}
})();
return (yield$.cljs$core$IFn$_invoke$arity$1 ? yield$.cljs$core$IFn$_invoke$arity$1(res) : yield$.call(null, res));
}));

return (req.oncomplete = (function (){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"set","set",304602554),new cljs.core.Keyword(null,"complete!","complete!",-2091803113)], 0));
}));
}));
}));

(cljs_thread.idb.idb_set_BANG_.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(cljs_thread.idb.idb_set_BANG_.cljs$lang$applyTo = (function (seq20263){
var G__20264 = cljs.core.first(seq20263);
var seq20263__$1 = cljs.core.next(seq20263);
var G__20265 = cljs.core.first(seq20263__$1);
var seq20263__$2 = cljs.core.next(seq20263__$1);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20264,G__20265,seq20263__$2);
}));

cljs_thread.idb.idb_get = (function cljs_thread$idb$idb_get(k,yield$){
return cljs_thread.on_when.do_on_watch(cljs_thread.idb.open_QMARK_,cljs.core.true_QMARK_,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"wkey","wkey",647381818),["open?-true?","-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.gensym.cljs$core$IFn$_invoke$arity$0())].join(''),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.idb",new cljs.core.Keyword(null,"line","line",212345235),24], null)], 0)),(function (){
var adb = cljs.core.deref(cljs_thread.state.idb);
var req = adb.transaction([cljs_thread.idb.idb_key]).objectStore(cljs_thread.idb.idb_key).get(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k], 0)));
if(cljs.core.truth_(req)){
(req.onerror = (function (p1__20271_SHARP_){
(yield$.cljs$core$IFn$_invoke$arity$1 ? yield$.cljs$core$IFn$_invoke$arity$1(null) : yield$.call(null, null));

throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(["idb-get failed getting ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(k)].join(''),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"k","k",-2146297393),k,new cljs.core.Keyword(null,"error","error",-978969032),p1__20271_SHARP_], null));
}));

return (req.onsuccess = (function (p1__20272_SHARP_){
var res = clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(p1__20272_SHARP_.target.result);
var G__20273 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"res","res",-1395007879),res], null);
return (yield$.cljs$core$IFn$_invoke$arity$1 ? yield$.cljs$core$IFn$_invoke$arity$1(G__20273) : yield$.call(null, G__20273));
}));
} else {
return null;
}
}));
});
goog.exportSymbol('cljs_thread.idb.idb_get', cljs_thread.idb.idb_get);
cljs_thread.idb.startup = (function cljs_thread$idb$startup(){
if((!((typeof indexedDB !== 'undefined')))){
return cljs.core.reset_BANG_(cljs_thread.idb.open_QMARK_,true);
} else {
var request = indexedDB.open(cljs_thread.idb.idb_key,(1));
(request.onerror = (function (p1__20274_SHARP_){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"idb-open-error","idb-open-error",576682558),p1__20274_SHARP_], 0));
}));

(request.onsuccess = (function (p1__20275_SHARP_){
cljs.core.reset_BANG_(cljs_thread.state.idb,p1__20275_SHARP_.target.result);

return cljs.core.reset_BANG_(cljs_thread.idb.open_QMARK_,true);
}));

return (request.onupgradeneeded = (function (p1__20276_SHARP_){
var db = p1__20276_SHARP_.target.result;
var os = db.createObjectStore(cljs_thread.idb.idb_key);
cljs.core.reset_BANG_(cljs_thread.state.idb,db);

return (os.transaction.oncomplete = (function (e){
var init_os = db.transaction(cljs_thread.idb.idb_key,"readwrite").objectStore(cljs_thread.idb.idb_key);
return cljs.core.reset_BANG_(cljs_thread.idb.open_QMARK_,true);
}));
}));
}
});
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"db","db",993250759),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.idb.open_QMARK_,cljs.core.constantly(false));

cljs_thread.on_when.do_on_watch(cljs_thread.idb.open_QMARK_,cljs.core.false_QMARK_,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"wkey","wkey",647381818),["open?-false?","-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.gensym.cljs$core$IFn$_invoke$arity$0())].join(''),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.idb",new cljs.core.Keyword(null,"line","line",212345235),61], null)], 0)),(function (){
return cljs_thread.idb.startup();
}));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.idb.open_QMARK_,cljs.core.identity);
} else {
}

//# sourceMappingURL=cljs_thread.idb.js.map
