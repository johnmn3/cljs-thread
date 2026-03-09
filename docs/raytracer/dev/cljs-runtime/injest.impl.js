goog.provide('injest.impl');
injest.impl.transducable_QMARK_ = (function injest$impl$transducable_QMARK_(form){
var or__5045__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(form,cljs.core.cat);
if(or__5045__auto__){
return or__5045__auto__;
} else {
if(cljs.core.sequential_QMARK_(form)){
return cljs.core.contains_QMARK_(cljs.core.deref(injest.state.transducables),cljs.core.first(form));
} else {
return null;
}
}
});
injest.impl.par_transducable_QMARK_ = (function injest$impl$par_transducable_QMARK_(form){
var or__5045__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(form,cljs.core.cat);
if(or__5045__auto__){
return or__5045__auto__;
} else {
if(cljs.core.sequential_QMARK_(form)){
return cljs.core.contains_QMARK_(cljs.core.deref(injest.state.par_transducables),cljs.core.first(form));
} else {
return null;
}
}
});
injest.impl.compose_transducer_group = (function injest$impl$compose_transducer_group(xfs){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.comp,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__28372_SHARP_){
if((!(cljs.core.coll_QMARK_(p1__28372_SHARP_)))){
return p1__28372_SHARP_;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(p1__28372_SHARP_))){
return cljs.core.first(p1__28372_SHARP_);
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.first(p1__28372_SHARP_),cljs.core.rest(p1__28372_SHARP_));
}
}
}),xfs));
});
injest.impl.xfn = (function injest$impl$xfn(xf_group){
var ts = injest.impl.compose_transducer_group(xf_group);
return (function (args){
return cljs.core.sequence.cljs$core$IFn$_invoke$arity$2(ts,args);
});
});
injest.impl.fold_xfn = injest.impl.xfn;
injest.impl.pipeline_xfn = injest.impl.xfn;
injest.impl.pre_transducify_thread = (function injest$impl$pre_transducify_thread(env,minimum_group_size,t_fn,t_pred,thread){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.concat,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__28374_SHARP_){
if(cljs.core.not((function (){var and__5043__auto__ = (function (){var G__28375 = cljs.core.first(p1__28374_SHARP_);
return (t_pred.cljs$core$IFn$_invoke$arity$1 ? t_pred.cljs$core$IFn$_invoke$arity$1(G__28375) : t_pred.call(null, G__28375));
})();
if(cljs.core.truth_(and__5043__auto__)){
return (!((cljs.core.count(p1__28374_SHARP_) < minimum_group_size)));
} else {
return and__5043__auto__;
}
})())){
return p1__28374_SHARP_;
} else {
return (new cljs.core.List(null,(new cljs.core.List(null,cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((new cljs.core.List(null,t_fn,null,(1),null)),(new cljs.core.List(null,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.vec,p1__28374_SHARP_),null,(1),null))))),null,(1),null)),null,(1),null));
}
}),cljs.core.partition_by.cljs$core$IFn$_invoke$arity$2((function (p1__28373_SHARP_){
return (t_pred.cljs$core$IFn$_invoke$arity$1 ? t_pred.cljs$core$IFn$_invoke$arity$1(p1__28373_SHARP_) : t_pred.call(null, p1__28373_SHARP_));
}),injest.util.qualify_thread(env,thread))));
});
injest.impl.get_or_nth = (function injest$impl$get_or_nth(m_or_v,aval){
if(cljs.core.associative_QMARK_(m_or_v)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m_or_v,aval);
} else {
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(m_or_v,aval);
}
});
injest.impl.protected_fns = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Symbol(null,"fn*","fn*",-752876845,null),null,new cljs.core.Symbol("cljs.core","fn","cljs.core/fn",-1065745098,null),null,new cljs.core.Symbol(null,"fn","fn",465265323,null),null,new cljs.core.Symbol(null,"partial","partial",1881673272,null),null], null), null);
injest.impl.path__GT_ = (function injest$impl$path__GT_(form,x){
if(((cljs.core.seq_QMARK_(form)) && (cljs.core.not((function (){var G__28376 = cljs.core.first(form);
return (injest.impl.protected_fns.cljs$core$IFn$_invoke$arity$1 ? injest.impl.protected_fns.cljs$core$IFn$_invoke$arity$1(G__28376) : injest.impl.protected_fns.call(null, G__28376));
})())))){
return cljs.core.with_meta(cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((new cljs.core.List(null,cljs.core.first(form),null,(1),null)),(new cljs.core.List(null,x,null,(1),null)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.next(form)], 0)))),cljs.core.meta(form));
} else {
if(((typeof form === 'string') || ((((form == null)) || (cljs.core.boolean_QMARK_(form)))))){
return (new cljs.core.List(null,x,(new cljs.core.List(null,form,null,(1),null)),(2),null));
} else {
if(cljs.core.int_QMARK_(form)){
return (new cljs.core.List(null,new cljs.core.Symbol("injest.impl","get-or-nth","injest.impl/get-or-nth",782382554,null),(new cljs.core.List(null,x,(new cljs.core.List(null,form,null,(1),null)),(2),null)),(3),null));
} else {
return (new cljs.core.List(null,form,(new cljs.core.List(null,x,null,(1),null)),(2),null));

}
}
}
});
injest.impl.path__GT__GT_ = (function injest$impl$path__GT__GT_(form,x){
if(((cljs.core.seq_QMARK_(form)) && (cljs.core.not((function (){var G__28377 = cljs.core.first(form);
return (injest.impl.protected_fns.cljs$core$IFn$_invoke$arity$1 ? injest.impl.protected_fns.cljs$core$IFn$_invoke$arity$1(G__28377) : injest.impl.protected_fns.call(null, G__28377));
})())))){
return cljs.core.with_meta(cljs.core.sequence.cljs$core$IFn$_invoke$arity$1(cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((new cljs.core.List(null,cljs.core.first(form),null,(1),null)),cljs.core.next(form),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(new cljs.core.List(null,x,null,(1),null))], 0)))),cljs.core.meta(form));
} else {
if(((typeof form === 'string') || ((((form == null)) || (cljs.core.boolean_QMARK_(form)))))){
return (new cljs.core.List(null,x,(new cljs.core.List(null,form,null,(1),null)),(2),null));
} else {
if(cljs.core.int_QMARK_(form)){
return (new cljs.core.List(null,new cljs.core.Symbol("injest.impl","get-or-nth","injest.impl/get-or-nth",782382554,null),(new cljs.core.List(null,x,(new cljs.core.List(null,form,null,(1),null)),(2),null)),(3),null));
} else {
return (new cljs.core.List(null,form,(new cljs.core.List(null,x,null,(1),null)),(2),null));

}
}
}
});

//# sourceMappingURL=injest.impl.js.map
