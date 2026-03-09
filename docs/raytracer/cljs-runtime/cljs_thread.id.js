goog.provide('cljs_thread.id');

/**
 * Protocol for types which have an ID
 * @interface
 */
cljs_thread.id.IDable = function(){};

var cljs_thread$id$IDable$get_id$dyn_21723 = (function (x){
var x__5393__auto__ = (((x == null))?null:x);
var m__5394__auto__ = (cljs_thread.id.get_id[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(x) : m__5394__auto__.call(null, x));
} else {
var m__5392__auto__ = (cljs_thread.id.get_id["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(x) : m__5392__auto__.call(null, x));
} else {
throw cljs.core.missing_protocol("IDable.get-id",x);
}
}
});
/**
 * Returns id if a value has an ID.
 */
cljs_thread.id.get_id = (function cljs_thread$id$get_id(x){
if((((!((x == null)))) && ((!((x.cljs_thread$id$IDable$get_id$arity$1 == null)))))){
return x.cljs_thread$id$IDable$get_id$arity$1(x);
} else {
return cljs_thread$id$IDable$get_id$dyn_21723(x);
}
});


//# sourceMappingURL=cljs_thread.id.js.map
