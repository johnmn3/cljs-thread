goog.provide('cljs_thread.serial');
/**
 * Check if x is an ImageBitmap (transferable canvas image).
 */
cljs_thread.serial.image_bitmap_QMARK_ = (function cljs_thread$serial$image_bitmap_QMARK_(x){
return (((typeof ImageBitmap !== 'undefined')) && ((x instanceof ImageBitmap)));
});
/**
 * Check if x is a transferable object (typed array or ImageBitmap).
 */
cljs_thread.serial.transferable_QMARK_ = (function cljs_thread$serial$transferable_QMARK_(x){
return ((cljs_thread.util.typed_array_QMARK_(x)) || (cljs_thread.serial.image_bitmap_QMARK_(x)));
});
/**
 * Duck-type check for eve SharedAtom by field presence.
 */
cljs_thread.serial.eve_shared_atom_QMARK_ = (function cljs_thread$serial$eve_shared_atom_QMARK_(x){
return (((!((x == null)))) && ((((!(typeof x === 'string'))) && ((((!(typeof x === 'number'))) && ((((!((x instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(x)))) && ((((typeof SharedArrayBuffer !== 'undefined')) && ((((!(((x["shared-atom-id"]) == null)))) && ((!(((x["header-descriptor-idx"]) == null)))))))))))))))));
});
/**
 * Duck-type check for eve AtomDomain by field presence.
 */
cljs_thread.serial.eve_atom_domain_QMARK_ = (function cljs_thread$serial$eve_atom_domain_QMARK_(x){
return (((!((x == null)))) && ((((!(typeof x === 'string'))) && ((((!(typeof x === 'number'))) && ((((!((x instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(x)))) && ((((typeof SharedArrayBuffer !== 'undefined')) && ((!(((x["s-atom-env"]) == null)))))))))))))));
});
/**
 * Get existing c-tag for an object, or assign a new one.
 * Deduplicates transferables by identity.
 */
cljs_thread.serial.get_or_assign_ctag_BANG_ = (function cljs_thread$serial$get_or_assign_ctag_BANG_(transfer_atom,obj){
var temp__5821__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(transfer_atom),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"seen","seen",-518999789),obj], null));
if(cljs.core.truth_(temp__5821__auto__)){
var existing = temp__5821__auto__;
return existing;
} else {
var c_tag = new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(transfer_atom,cljs.core.update,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.inc));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(transfer_atom,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"seen","seen",-518999789),obj], null),c_tag);

return c_tag;
}
});
/**
 * Custom walk that checks for special types BEFORE recursing.
 * This prevents postwalk from calling (empty coll) on EVE types.
 */
cljs_thread.serial.instr_walk = (function cljs_thread$serial$instr_walk(transfer_atom,form){
if(cljs.core.fn_QMARK_(form)){
return ["#cljs-thread/arg-fn ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(form)].join('');
} else {
if(cljs_thread.serial.eve_shared_atom_QMARK_(form)){
return form;
} else {
if(cljs_thread.serial.eve_atom_domain_QMARK_(form)){
return form;
} else {
if((((!((form == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === form.cljs_thread$eve$deftype_proto$data$IsEve$))))?true:(((!form.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IsEve,form):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IsEve,form))){
return form;
} else {
if(cljs_thread.serial.transferable_QMARK_(form)){
var c_tag = cljs_thread.serial.get_or_assign_ctag_BANG_(transfer_atom,form);
var t = cljs.core.type(form);
var is_sab_QMARK_ = (((typeof SharedArrayBuffer !== 'undefined')) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(t,SharedArrayBuffer)));
var buffer = ((cljs_thread.util.typed_array_QMARK_(form))?form.buffer:null);
var buffer_is_sab_QMARK_ = (function (){var and__5043__auto__ = buffer;
if(cljs.core.truth_(and__5043__auto__)){
return (((typeof SharedArrayBuffer !== 'undefined')) && ((buffer instanceof SharedArrayBuffer)));
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(transfer_atom),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"transfers","transfers",2123810614),c_tag], null)))){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(transfer_atom,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"transfers","transfers",2123810614),c_tag], null),(cljs.core.truth_((function (){var or__5045__auto__ = is_sab_QMARK_;
if(or__5045__auto__){
return or__5045__auto__;
} else {
return buffer_is_sab_QMARK_;
}
})())?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"obj","obj",981763962),form], null):new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"obj","obj",981763962),form,new cljs.core.Keyword(null,"transfer","transfer",327423400),((cljs_thread.serial.image_bitmap_QMARK_(form))?form:buffer
)], null)));
}

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"__ct-marker","__ct-marker",14964765),"transferable",new cljs.core.Keyword(null,"ctag","ctag",304756589),c_tag], null);
} else {
if((function (){var and__5043__auto__ = (!((form == null)));
if(and__5043__auto__){
var and__5043__auto____$1 = (typeof form === "object");
if(and__5043__auto____$1){
var and__5043__auto____$2 = (!(cljs_thread.util.typed_array_QMARK_(form)));
if(and__5043__auto____$2){
var and__5043__auto____$3 = (!(cljs.core.map_QMARK_(form)));
if(and__5043__auto____$3){
var and__5043__auto____$4 = (!(cljs.core.vector_QMARK_(form)));
if(and__5043__auto____$4){
var and__5043__auto____$5 = (!(cljs.core.set_QMARK_(form)));
if(and__5043__auto____$5){
var and__5043__auto____$6 = (!(cljs.core.list_QMARK_(form)));
if(and__5043__auto____$6){
var and__5043__auto____$7 = (!(cljs.core.seq_QMARK_(form)));
if(and__5043__auto____$7){
var ctor = form.constructor;
return (((ctor == null)) || (((ctor["cljs$lang$type"]) == null)));
} else {
return and__5043__auto____$7;
}
} else {
return and__5043__auto____$6;
}
} else {
return and__5043__auto____$5;
}
} else {
return and__5043__auto____$4;
}
} else {
return and__5043__auto____$3;
}
} else {
return and__5043__auto____$2;
}
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})()){
var c_tag = cljs_thread.serial.get_or_assign_ctag_BANG_(transfer_atom,form);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(transfer_atom,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"transfers","transfers",2123810614),c_tag], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"obj","obj",981763962),form], null));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"__ct-marker","__ct-marker",14964765),"js-object",new cljs.core.Keyword(null,"ctag","ctag",304756589),c_tag], null);
} else {
if(cljs.core.map_QMARK_(form)){
return cljs.core.persistent_BANG_(cljs.core.reduce_kv((function (m,k,v){
return cljs.core.assoc_BANG_.cljs$core$IFn$_invoke$arity$3(m,(cljs_thread.serial.instr_walk.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.serial.instr_walk.cljs$core$IFn$_invoke$arity$2(transfer_atom,k) : cljs_thread.serial.instr_walk.call(null, transfer_atom,k)),(cljs_thread.serial.instr_walk.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.serial.instr_walk.cljs$core$IFn$_invoke$arity$2(transfer_atom,v) : cljs_thread.serial.instr_walk.call(null, transfer_atom,v)));
}),cljs.core.transient$(cljs.core.PersistentArrayMap.EMPTY),form));
} else {
if(cljs.core.vector_QMARK_(form)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.serial.instr_walk,transfer_atom),form);
} else {
if(cljs.core.set_QMARK_(form)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.serial.instr_walk,transfer_atom)),form);
} else {
if(cljs.core.seq_QMARK_(form)){
return cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.serial.instr_walk,transfer_atom),form));
} else {
if(cljs.core.list_QMARK_(form)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.list,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.serial.instr_walk,transfer_atom),form));
} else {
return form;

}
}
}
}
}
}
}
}
}
}
}
});
/**
 * Serialize a payload for wire transfer.
 * Transferables → CLJS map markers (actual objects stored in transfer-atom)
 * Functions → #cljs-thread/arg-fn tags
 * EVE types → CLJS map markers (prevents postwalk from walking into them)
 * JS objects → CLJS map markers (actual objects stored in transfer-atom)
 * 
 * After this pass, the result should be pr-str'd to preserve CLJS types.
 * Markers use CLJS maps {:__ct-marker type :ctag N} so they survive EDN.
 */
cljs_thread.serial.instr_body = (function cljs_thread$serial$instr_body(transfer_atom,pl){
return cljs_thread.serial.instr_walk(transfer_atom,pl);
});
/**
 * Check if x is a cljs-thread marker map (transferable or js-object).
 */
cljs_thread.serial.ct_marker_QMARK_ = (function cljs_thread$serial$ct_marker_QMARK_(x){
var and__5043__auto__ = cljs.core.map_QMARK_(x);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"__ct-marker","__ct-marker",14964765).cljs$core$IFn$_invoke$arity$1(x);
} else {
return and__5043__auto__;
}
});
/**
 * Deserialize a payload from wire transfer.
 * Reconstructs transferables, JS objects, and functions from their tags.
 * SharedAtom is handled by EDN tag reader automatically.
 * 
 * Input should already have been edn/read-string'd to restore CLJS types.
 */
cljs_thread.serial.unstr_body = (function cljs_thread$serial$unstr_body(transfers,pl){
var get_transfer = (function (c_tag){
var entry = (transfers[cljs.core.str.cljs$core$IFn$_invoke$arity$1(c_tag)]);
var obj = (cljs.core.truth_(entry)?(entry["obj"]):null);
return obj;
});
return clojure.walk.postwalk((function (p1__20009_SHARP_){
if(cljs.core.truth_(cljs_thread.serial.ct_marker_QMARK_(p1__20009_SHARP_))){
return get_transfer(new cljs.core.Keyword(null,"ctag","ctag",304756589).cljs$core$IFn$_invoke$arity$1(p1__20009_SHARP_));
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof p1__20009_SHARP_ === 'string';
if(and__5043__auto__){
return p1__20009_SHARP_.startsWith("#cljs-thread/arg-fn");
} else {
return and__5043__auto__;
}
})())){
return eval(["(function () {return (",cljs.core.subs.cljs$core$IFn$_invoke$arity$2(p1__20009_SHARP_,(20)),");})();"].join(''));
} else {
return p1__20009_SHARP_;

}
}
}),pl);
});

//# sourceMappingURL=cljs_thread.serial.js.map
