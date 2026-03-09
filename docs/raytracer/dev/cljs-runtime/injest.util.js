goog.provide('injest.util');
injest.util.safe_resolve = cljs.core.identity;
injest.util.qualify_sym = (function injest$util$qualify_sym(x,env){
if(cljs.core.not(env)){
return cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((new cljs.core.List(null,new cljs.core.Symbol(null,"quote","quote",1377916282,null),null,(1),null)),(new cljs.core.List(null,cljs.core.symbol.cljs$core$IFn$_invoke$arity$1((injest.util.safe_resolve.cljs$core$IFn$_invoke$arity$1 ? injest.util.safe_resolve.cljs$core$IFn$_invoke$arity$1(x) : injest.util.safe_resolve.call(null, x))),null,(1),null)))));
} else {
return cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((new cljs.core.List(null,new cljs.core.Symbol("cljs.core","symbol","cljs.core/symbol",195265748,null),null,(1),null)),(new cljs.core.List(null,cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((new cljs.core.List(null,new cljs.core.Symbol(null,"quote","quote",1377916282,null),null,(1),null)),(new cljs.core.List(null,(function (){var G__28214 = x;
var G__28214__$1 = (((G__28214 == null))?null:cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.analyzer.api.resolve,env)(G__28214));
var G__28214__$2 = (((G__28214__$1 == null))?null:new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(G__28214__$1));
if((G__28214__$2 == null)){
return null;
} else {
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(G__28214__$2);
}
})(),null,(1),null))))),null,(1),null)))));
}
});
injest.util.qualify_form = (function injest$util$qualify_form(x,env){
if(cljs.core.not(new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(env))){
return (new cljs.core.List(null,cljs.core.symbol.cljs$core$IFn$_invoke$arity$1((injest.util.safe_resolve.cljs$core$IFn$_invoke$arity$1 ? injest.util.safe_resolve.cljs$core$IFn$_invoke$arity$1(x) : injest.util.safe_resolve.call(null, x))),null,(1),null));
} else {
return (new cljs.core.List(null,(function (){var G__28228 = x;
var G__28228__$1 = (((G__28228 == null))?null:cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.analyzer.api.resolve,env)(G__28228));
var G__28228__$2 = (((G__28228__$1 == null))?null:new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(G__28228__$1));
var G__28228__$3 = (((G__28228__$2 == null))?null:cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28228__$2));
if((G__28228__$3 == null)){
return null;
} else {
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(G__28228__$3);
}
})(),null,(1),null));
}
});
injest.util.qualify_thread = (function injest$util$qualify_thread(env,thread){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function injest$util$qualify_thread_$_w(x){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(x,new cljs.core.Symbol(null,"cat","cat",182721320,null))){
return injest.util.qualify_form(x,env);
} else {
if(((cljs.core.list_QMARK_(x)) && ((((cljs.core.first(x) instanceof cljs.core.Symbol)) && (cljs.core.not((function (){var G__28232 = cljs.core.first(x);
var fexpr__28231 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Symbol(null,"fn*","fn*",-752876845,null),null,new cljs.core.Symbol(null,"fn","fn",465265323,null),null], null), null);
return (fexpr__28231.cljs$core$IFn$_invoke$arity$1 ? fexpr__28231.cljs$core$IFn$_invoke$arity$1(G__28232) : fexpr__28231.call(null, G__28232));
})())))))){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(injest.util.qualify_form(cljs.core.first(x),env),cljs.core.rest(x));
} else {
return x;
}
}
}),thread);
});

//# sourceMappingURL=injest.util.js.map
