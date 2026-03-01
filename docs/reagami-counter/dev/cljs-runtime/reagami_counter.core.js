goog.provide('reagami_counter.core');
var module$node_modules$d3$src$index=shadow.js.require("module$node_modules$d3$src$index", {});
var module$node_modules$canvas_confetti$src$confetti=shadow.js.require("module$node_modules$canvas_confetti$src$confetti", {});
if((typeof reagami_counter !== 'undefined') && (typeof reagami_counter.core !== 'undefined') && (typeof reagami_counter.core.state !== 'undefined')){
} else {
reagami_counter.core.state = (function (){var G__21113 = new cljs.core.Keyword("reagami-counter.core","state","reagami-counter.core/state",-1830013273);
var G__21114 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"counter","counter",804008177),(0)], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__21113,G__21114) : cljs_thread.eve.atom.call(null, G__21113,G__21114));
})();
}
reagami_counter.core.update_bar_BANG_ = (function reagami_counter$core$update_bar_BANG_(n){
return module$node_modules$d3$src$index.select("#bar").transition().duration((300)).attr("width",[cljs.core.str.cljs$core$IFn$_invoke$arity$1((n * (10))),"%"].join(''));
});
reagami_counter.core.my_component = (function reagami_counter$core$my_component(){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"svg","svg",856789142),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"width","width",-384071477),"100%",new cljs.core.Keyword(null,"height","height",1025178622),(40)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"rect#bar","rect#bar",1691633835),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"x","x",2099068185),(0),new cljs.core.Keyword(null,"y","y",-1757859776),(5),new cljs.core.Keyword(null,"height","height",1025178622),(30),new cljs.core.Keyword(null,"fill","fill",883462889),"#4CAF50",new cljs.core.Keyword(null,"rx","rx",1627208482),(4),new cljs.core.Keyword(null,"width","width",-384071477),(0)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),"Counted: ",cljs.core.deref((function (){var temp__5821__auto__ = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5821__auto__)){
var w__20890__auto__ = temp__5821__auto__;
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20890__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.state,w__20890__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (state,w__20890__auto____$1){
try{return ((100) * new cljs.core.Keyword(null,"counter","counter",804008177).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
} else {
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"future","future",1877842724),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.state,reagami_counter.core.state], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__){
return (function (state,state__$1){
var yield$ = (function (res__20834__auto__){
return cljs_thread.in$.yield_result_BANG_(in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__,res__20834__auto__);
});
var k__20891__auto__ = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.util.gen_id());
return cljs.core.add_watch(cljs_thread.future.pool,k__20891__auto__,(function (___20892__auto__,___20892__auto____$1,___20892__auto____$2,___20892__auto____$3){
var temp__5823__auto__ = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5823__auto__)){
var w__20890__auto__ = temp__5823__auto__;
cljs.core.remove_watch(cljs_thread.future.pool,k__20891__auto__);

return yield$(cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20890__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [state__$1,w__20890__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (state__$2,w__20890__auto____$1){
try{return ((100) * new cljs.core.Keyword(null,"counter","counter",804008177).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state__$2)));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0))));
} else {
return null;
}
}));
});
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),(function (){var fexpr__21116 = (function (){var G__21117 = cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(reagami_counter.core.w__20890__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.state,reagami_counter.core.w__20890__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (state,w__20890__auto__){
try{return ((100) * new cljs.core.Keyword(null,"counter","counter",804008177).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)));
}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto__);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return (reagami_counter.core.yield$.cljs$core$IFn$_invoke$arity$1 ? reagami_counter.core.yield$.cljs$core$IFn$_invoke$arity$1(G__21117) : reagami_counter.core.yield$.call(null, G__21117));
})();
return (fexpr__21116.cljs$core$IFn$_invoke$arity$0 ? fexpr__21116.cljs$core$IFn$_invoke$arity$0() : fexpr__21116.call(null, ));
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}
})())], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"button","button",1456579943),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"on-click","on-click",1632826543),(function (){
var n = new cljs.core.Keyword(null,"counter","counter",804008177).cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(reagami_counter.core.state,cljs.core.update,new cljs.core.Keyword(null,"counter","counter",804008177),cljs.core.inc));
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.update_bar_BANG_,n,n], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (update_bar_BANG_,n__$1,n__$2){
(update_bar_BANG_.cljs$core$IFn$_invoke$arity$1 ? update_bar_BANG_.cljs$core$IFn$_invoke$arity$1(n__$2) : update_bar_BANG_.call(null, n__$2));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n__$2,(10))){
return module$node_modules$canvas_confetti$src$confetti(({"particleCount": (200), "spread": (70)}));
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
})], null),"Click me!"], null)], null);
});
reagami_counter.core.render = (function reagami_counter$core$render(){
return reagami.core.render(document.querySelector("#app"),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.my_component], null));
});
reagami_counter.core.main = (function reagami_counter$core$main(){
return cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [reagami_counter.core.state,reagami_counter.core.render,reagami_counter.core.render], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword("reagami-counter.core","renderer","reagami-counter.core/renderer",863495941)], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (state,render,render__$1){
cljs.core.add_watch(state,new cljs.core.Keyword("reagami-counter.core","render","reagami-counter.core/render",-1954088128),(function (_,___$1,___$2,___$3){
return (render__$1.cljs$core$IFn$_invoke$arity$0 ? render__$1.cljs$core$IFn$_invoke$arity$0() : render__$1.call(null, ));
}));

return (render__$1.cljs$core$IFn$_invoke$arity$0 ? render__$1.cljs$core$IFn$_invoke$arity$0() : render__$1.call(null, ));
})));
});
goog.exportSymbol('reagami_counter.core.main', reagami_counter.core.main);

//# sourceMappingURL=reagami_counter.core.js.map
