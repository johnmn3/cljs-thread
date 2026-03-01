goog.provide('cljs_thread.eve.deftype_proto.serialize');
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_FALSE = (1);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_TRUE = (2);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_INT32 = (3);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_FLOAT64 = (4);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_STRING_SHORT = (5);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_STRING_LONG = (6);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_KEYWORD_SHORT = (7);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_KEYWORD_LONG = (8);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_KEYWORD_NS_SHORT = (9);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_KEYWORD_NS_LONG = (10);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_UUID = (11);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SYMBOL_SHORT = (12);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SYMBOL_NS_SHORT = (13);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_DATE = (14);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_INT64 = (15);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SAB_MAP = (16);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SAB_SET = (17);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SAB_VEC = (18);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_SAB_LIST = (19);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_RECORD = (26);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_TYPED_ARRAY = (27);
cljs_thread.eve.deftype_proto.serialize.FAST_TAG_EVE_ARRAY = (28);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_UINT8 = (1);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_INT8 = (2);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_UINT8_CLAMPED = (3);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_INT16 = (4);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_UINT16 = (5);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_INT32 = (6);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_UINT32 = (7);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_FLOAT32 = (8);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_FLOAT64 = (9);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_BIGINT64 = (10);
cljs_thread.eve.deftype_proto.serialize.TYPED_ARRAY_BIGUINT64 = (11);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize.sab_type_constructors !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.serialize.sab_type_constructors = (new Map());
}
/**
 * Register a constructor for deserializing SAB pointer tags.
 * tag: u8 tag byte (e.g., 0x10 for SabMap)
 * ctor-fn: (fn [sab offset] -> instance) — wraps existing SAB memory
 */
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$register_sab_type_constructor_BANG_(tag,ctor_fn){
return cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.set(tag,ctor_fn);
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize.cljs_to_sab_builders !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.serialize.cljs_to_sab_builders = [];
}
/**
 * Register a builder for auto-converting CLJS collections to SAB types.
 * pred: (fn [elem] -> boolean) — type check predicate
 * builder: (fn [elem] -> sab-instance) — builds SAB type from CLJS collection
 */
cljs_thread.eve.deftype_proto.serialize.register_cljs_to_sab_builder_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$register_cljs_to_sab_builder_BANG_(pred,builder){
return cljs_thread.eve.deftype_proto.serialize.cljs_to_sab_builders.push([pred,builder]);
});
cljs_thread.eve.deftype_proto.serialize.direct_map_encoder = null;
/**
 * Set the direct map encoder function. Called by sab_map.cljs at load.
 * encoder: (fn [cljs-map] -> Uint8Array) — builds SAB map and returns pointer bytes
 */
cljs_thread.eve.deftype_proto.serialize.set_direct_map_encoder_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$set_direct_map_encoder_BANG_(encoder){
return (cljs_thread.eve.deftype_proto.serialize.direct_map_encoder = encoder);
});
cljs_thread.eve.deftype_proto.serialize.typed_array_encoder = null;
/**
 * Set the typed array encoder function. Called by sab_map.cljs at load.
 * encoder: (fn [typed-array] -> Uint8Array) — allocates SAB and returns pointer bytes
 */
cljs_thread.eve.deftype_proto.serialize.set_typed_array_encoder_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$set_typed_array_encoder_BANG_(encoder){
return (cljs_thread.eve.deftype_proto.serialize.typed_array_encoder = encoder);
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize.record_tag_by_ctor !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.serialize.record_tag_by_ctor = (new Map());
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.serialize.record_ctor_by_tag !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.serialize.record_ctor_by_tag = (new Map());
}
/**
 * Register a record type for SAB serialization roundtrip.
 * record-ctor: the record constructor (e.g., MyRecord)
 * tag-str: unique string tag (e.g., "my.ns/MyRecord")
 * map-fn: (fn [field-map] -> record) — typically map->MyRecord
 */
cljs_thread.eve.deftype_proto.serialize.register_record_type_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$register_record_type_BANG_(record_ctor,tag_str,map_fn){
cljs_thread.eve.deftype_proto.serialize.record_tag_by_ctor.set(record_ctor,tag_str);

return cljs_thread.eve.deftype_proto.serialize.record_ctor_by_tag.set(tag_str,map_fn);
});
/**
 * Try to convert a CLJS collection to a SAB type using registered builders.
 * Returns the SAB instance or nil if no builder matches.
 */
cljs_thread.eve.deftype_proto.serialize.try_build_sab = (function cljs_thread$eve$deftype_proto$serialize$try_build_sab(elem){
var len = cljs_thread.eve.deftype_proto.serialize.cljs_to_sab_builders.length;
var i = (0);
while(true){
if((i < len)){
var entry = (cljs_thread.eve.deftype_proto.serialize.cljs_to_sab_builders[i]);
var pred = (entry[(0)]);
if(cljs.core.truth_((pred.cljs$core$IFn$_invoke$arity$1 ? pred.cljs$core$IFn$_invoke$arity$1(elem) : pred.call(null, elem)))){
var fexpr__19983 = (entry[(1)]);
return (fexpr__19983.cljs$core$IFn$_invoke$arity$1 ? fexpr__19983.cljs$core$IFn$_invoke$arity$1(elem) : fexpr__19983.call(null, elem));
} else {
var G__20011 = (i + (1));
i = G__20011;
continue;
}
} else {
return null;
}
break;
}
});
/**
 * Encode a CLJS record as a FAST_TAG_RECORD pointer.
 * Stores the record's fields + :eve/record-tag in a SabMap.
 * Returns nil if the record type is not registered.
 */
cljs_thread.eve.deftype_proto.serialize.encode_record = (function cljs_thread$eve$deftype_proto$serialize$encode_record(elem){
var tag_str = cljs_thread.eve.deftype_proto.serialize.record_tag_by_ctor.get(cljs.core.type(elem));
if(cljs.core.truth_(tag_str)){
var tagged_map = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.reduce_kv(cljs.core.assoc,cljs.core.PersistentArrayMap.EMPTY,elem),new cljs.core.Keyword("eve","record-tag","eve/record-tag",1970904930),tag_str);
var sab_m = cljs_thread.eve.deftype_proto.serialize.try_build_sab(tagged_map);
if(cljs.core.truth_(sab_m)){
var bytes = (((((!((sab_m == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === sab_m.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!sab_m.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_m):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_m)))?cljs_thread.eve.deftype_proto.data._sab_encode(sab_m,null):cljs_thread.eve.deftype_proto.data._direct_serialize(sab_m));
(bytes[(2)] = (26));

return bytes;
} else {
return null;
}
} else {
return null;
}
});
cljs_thread.eve.deftype_proto.serialize.fast_encoder = (new TextEncoder());
cljs_thread.eve.deftype_proto.serialize.fast_decoder = (new TextDecoder());
/**
 * Decode UTF-8 bytes to string. Copies SAB-backed views first since
 * TextDecoder.decode rejects SharedArrayBuffer views.
 */
cljs_thread.eve.deftype_proto.serialize.decode_text = (function cljs_thread$eve$deftype_proto$serialize$decode_text(u8_view){
return cljs_thread.eve.deftype_proto.serialize.fast_decoder.decode((((u8_view.buffer instanceof SharedArrayBuffer))?(new Uint8Array(u8_view)):u8_view));
});
cljs_thread.eve.deftype_proto.serialize.keyword_cache = (new Map());
cljs_thread.eve.deftype_proto.serialize.KEYWORD_CACHE_MAX = (2048);
cljs_thread.eve.deftype_proto.serialize.kw_deser_cache = (new Map());
cljs_thread.eve.deftype_proto.serialize.KW_DESER_CACHE_MAX = (16384);
/**
 * Clear deserialization caches. Call when SAB environment is replaced.
 */
cljs_thread.eve.deftype_proto.serialize.clear_deser_caches_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$clear_deser_caches_BANG_(){
return cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.clear();
});
cljs_thread.eve.deftype_proto.serialize.scratch_a_buf = (new ArrayBuffer((32)));
cljs_thread.eve.deftype_proto.serialize.scratch_a_dv = (new DataView(cljs_thread.eve.deftype_proto.serialize.scratch_a_buf));
cljs_thread.eve.deftype_proto.serialize.scratch_a_u8 = (new Uint8Array(cljs_thread.eve.deftype_proto.serialize.scratch_a_buf));
cljs_thread.eve.deftype_proto.serialize.scratch_a_3 = cljs_thread.eve.deftype_proto.serialize.scratch_a_u8.subarray((0),(3));
cljs_thread.eve.deftype_proto.serialize.scratch_a_7 = cljs_thread.eve.deftype_proto.serialize.scratch_a_u8.subarray((0),(7));
cljs_thread.eve.deftype_proto.serialize.scratch_a_11 = cljs_thread.eve.deftype_proto.serialize.scratch_a_u8.subarray((0),(11));
cljs_thread.eve.deftype_proto.serialize.scratch_b_buf = (new ArrayBuffer((32)));
cljs_thread.eve.deftype_proto.serialize.scratch_b_dv = (new DataView(cljs_thread.eve.deftype_proto.serialize.scratch_b_buf));
cljs_thread.eve.deftype_proto.serialize.scratch_b_u8 = (new Uint8Array(cljs_thread.eve.deftype_proto.serialize.scratch_b_buf));
cljs_thread.eve.deftype_proto.serialize.scratch_b_3 = cljs_thread.eve.deftype_proto.serialize.scratch_b_u8.subarray((0),(3));
cljs_thread.eve.deftype_proto.serialize.scratch_b_7 = cljs_thread.eve.deftype_proto.serialize.scratch_b_u8.subarray((0),(7));
cljs_thread.eve.deftype_proto.serialize.scratch_b_11 = cljs_thread.eve.deftype_proto.serialize.scratch_b_u8.subarray((0),(11));
cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf = (new Uint8Array((7)));
cljs_thread.eve.deftype_proto.serialize.sab_ptr_dv = (new DataView(cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf.buffer));
/**
 * Encode a SAB type pointer to a reusable 7-byte buffer.
 * Valid until the next encode-sab-pointer call.
 */
cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer = (function cljs_thread$eve$deftype_proto$serialize$encode_sab_pointer(tag,offset){
(cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf[(2)] = tag);

cljs_thread.eve.deftype_proto.serialize.sab_ptr_dv.setInt32((3),offset,true);

return cljs_thread.eve.deftype_proto.serialize.sab_ptr_buf;
});
/**
 * Return the subtype code for a JS typed array, or nil if not a typed array.
 */
cljs_thread.eve.deftype_proto.serialize.typed_array_subtype = (function cljs_thread$eve$deftype_proto$serialize$typed_array_subtype(elem){
if((elem instanceof Uint8ClampedArray)){
return (3);
} else {
if((elem instanceof Uint8Array)){
return (1);
} else {
if((elem instanceof Int8Array)){
return (2);
} else {
if((elem instanceof Int16Array)){
return (4);
} else {
if((elem instanceof Uint16Array)){
return (5);
} else {
if((elem instanceof Int32Array)){
return (6);
} else {
if((elem instanceof Uint32Array)){
return (7);
} else {
if((elem instanceof Float32Array)){
return (8);
} else {
if((elem instanceof Float64Array)){
return (9);
} else {
if((((typeof BigInt64Array !== 'undefined')) && ((elem instanceof BigInt64Array)))){
return (10);
} else {
if((((typeof BigUint64Array !== 'undefined')) && ((elem instanceof BigUint64Array)))){
return (11);
} else {
return null;

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
 * Serialize a JS typed array. Uses the SAB-backed encoder (node-backed, 7-byte
 * pointer) when available, falling back to inline blob for small arrays.
 * Node-backed storage keeps HAMT nodes small — same pattern as maps/vecs/sets.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_typed_array = (function cljs_thread$eve$deftype_proto$serialize$serialize_typed_array(elem){
if((!((cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem) == null)))){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.serialize.typed_array_encoder)){
return (cljs_thread.eve.deftype_proto.serialize.typed_array_encoder.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.deftype_proto.serialize.typed_array_encoder.cljs$core$IFn$_invoke$arity$1(elem) : cljs_thread.eve.deftype_proto.serialize.typed_array_encoder.call(null, elem));
} else {
var subtype = cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem);
var byte_view = (new Uint8Array(elem.buffer,elem.byteOffset,elem.byteLength));
var byte_len = elem.byteLength;
var buf = (new Uint8Array(((8) + byte_len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (27));

(buf[(3)] = subtype);

dv.setUint32((4),byte_len,true);

buf.set(byte_view,(8));

return buf;
}
} else {
return null;
}
});
cljs_thread.eve.deftype_proto.serialize.serialize_keyword_impl = (function cljs_thread$eve$deftype_proto$serialize$serialize_keyword_impl(elem){
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.keyword_cache.get(elem);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var result = (cljs.core.truth_(cljs.core.namespace(elem))?(function (){var ns_str = cljs.core.namespace(elem);
var name_str = cljs.core.name(elem);
var ns_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(ns_str);
var name_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(name_str);
var ns_len = ns_enc.length;
var name_len = name_enc.length;
if((((ns_len <= (255))) && ((name_len <= (255))))){
var buf = (new Uint8Array((((5) + ns_len) + name_len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (9));

(buf[(3)] = ns_len);

buf.set(ns_enc,(4));

(buf[((4) + ns_len)] = name_len);

buf.set(name_enc,((5) + ns_len));

return buf;
} else {
var buf = (new Uint8Array((((11) + ns_len) + name_len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (10));

dv.setUint32((3),ns_len,true);

buf.set(ns_enc,(7));

dv.setUint32(((7) + ns_len),name_len,true);

buf.set(name_enc,((11) + ns_len));

return buf;
}
})():(function (){var s = cljs.core.name(elem);
var encoded = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(s);
var len = encoded.length;
if((len <= (255))){
var buf = (new Uint8Array(((4) + len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (7));

(buf[(3)] = len);

buf.set(encoded,(4));

return buf;
} else {
var buf = (new Uint8Array(((7) + len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (8));

dv.setUint32((3),len,true);

buf.set(encoded,(7));

return buf;
}
})());
if((cljs_thread.eve.deftype_proto.serialize.keyword_cache.size >= (2048))){
cljs_thread.eve.deftype_proto.serialize.keyword_cache.clear();
} else {
}

cljs_thread.eve.deftype_proto.serialize.keyword_cache.set(elem,result);

return result;
}
});
/**
 * Serialize fixed-size primitive to scratch buffer A using pre-allocated views.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_numeric_a = (function cljs_thread$eve$deftype_proto$serialize$serialize_numeric_a(elem){
if((elem == null)){
return (new Uint8Array((0)));
} else {
if(cljs.core.boolean_QMARK_(elem)){
(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(2)] = ((elem)?(2):(1)));

return cljs_thread.eve.deftype_proto.serialize.scratch_a_3;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof elem === 'number';
if(and__5043__auto__){
var and__5043__auto____$1 = Number.isInteger(elem);
if(cljs.core.truth_(and__5043__auto____$1)){
return (((elem >= (-2147483648))) && ((elem <= (2147483647))));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(2)] = (3));

cljs_thread.eve.deftype_proto.serialize.scratch_a_dv.setInt32((3),elem,true);

return cljs_thread.eve.deftype_proto.serialize.scratch_a_7;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof elem === 'number';
if(and__5043__auto__){
var and__5043__auto____$1 = Number.isInteger(elem);
if(cljs.core.truth_(and__5043__auto____$1)){
return Number.isSafeInteger(elem);
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(2)] = (15));

cljs_thread.eve.deftype_proto.serialize.scratch_a_dv.setBigInt64((3),BigInt(elem),true);

return cljs_thread.eve.deftype_proto.serialize.scratch_a_11;
} else {
if(typeof elem === 'number'){
(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(2)] = (4));

cljs_thread.eve.deftype_proto.serialize.scratch_a_dv.setFloat64((3),elem,true);

return cljs_thread.eve.deftype_proto.serialize.scratch_a_11;
} else {
if(cljs.core.inst_QMARK_(elem)){
(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_a_u8[(2)] = (14));

cljs_thread.eve.deftype_proto.serialize.scratch_a_dv.setFloat64((3),elem.getTime(),true);

return cljs_thread.eve.deftype_proto.serialize.scratch_a_11;
} else {
return null;

}
}
}
}
}
}
});
/**
 * Serialize fixed-size primitive to scratch buffer B using pre-allocated views.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_numeric_b = (function cljs_thread$eve$deftype_proto$serialize$serialize_numeric_b(elem){
if((elem == null)){
return (new Uint8Array((0)));
} else {
if(cljs.core.boolean_QMARK_(elem)){
(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(2)] = ((elem)?(2):(1)));

return cljs_thread.eve.deftype_proto.serialize.scratch_b_3;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof elem === 'number';
if(and__5043__auto__){
var and__5043__auto____$1 = Number.isInteger(elem);
if(cljs.core.truth_(and__5043__auto____$1)){
return (((elem >= (-2147483648))) && ((elem <= (2147483647))));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(2)] = (3));

cljs_thread.eve.deftype_proto.serialize.scratch_b_dv.setInt32((3),elem,true);

return cljs_thread.eve.deftype_proto.serialize.scratch_b_7;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof elem === 'number';
if(and__5043__auto__){
var and__5043__auto____$1 = Number.isInteger(elem);
if(cljs.core.truth_(and__5043__auto____$1)){
return Number.isSafeInteger(elem);
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(2)] = (15));

cljs_thread.eve.deftype_proto.serialize.scratch_b_dv.setBigInt64((3),BigInt(elem),true);

return cljs_thread.eve.deftype_proto.serialize.scratch_b_11;
} else {
if(typeof elem === 'number'){
(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(2)] = (4));

cljs_thread.eve.deftype_proto.serialize.scratch_b_dv.setFloat64((3),elem,true);

return cljs_thread.eve.deftype_proto.serialize.scratch_b_11;
} else {
if(cljs.core.inst_QMARK_(elem)){
(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(0)] = (238));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(1)] = (219));

(cljs_thread.eve.deftype_proto.serialize.scratch_b_u8[(2)] = (14));

cljs_thread.eve.deftype_proto.serialize.scratch_b_dv.setFloat64((3),elem.getTime(),true);

return cljs_thread.eve.deftype_proto.serialize.scratch_b_11;
} else {
return null;

}
}
}
}
}
}
});
/**
 * Serialize element using scratch buffer A.
 * Use for keys when serializing key+value pairs simultaneously.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_key = (function cljs_thread$eve$deftype_proto$serialize$serialize_key(elem){
if((elem instanceof cljs.core.Keyword)){
return cljs_thread.eve.deftype_proto.serialize.serialize_keyword_impl(elem);
} else {
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.serialize_numeric_a(elem);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
if((((!((elem == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!elem.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,elem):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,elem))){
return cljs_thread.eve.deftype_proto.data._sab_encode(elem,null);
} else {
if((((!((elem == null))))?(((((elem.cljs$lang$protocol_mask$partition0$ & (67108864))) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs$core$IRecord$))))?true:(((!elem.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_(cljs.core.IRecord,elem):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IRecord,elem))){
var or__5045__auto____$1 = cljs_thread.eve.deftype_proto.serialize.encode_record(elem);
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return (new Uint8Array((0)));
}
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.eve.deftype_proto.serialize.direct_map_encoder;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.map_QMARK_(elem);
} else {
return and__5043__auto__;
}
})())){
return (cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.cljs$core$IFn$_invoke$arity$1(elem) : cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.call(null, elem));
} else {
if(cljs.core.uuid_QMARK_(elem)){
var buf = (new Uint8Array((19)));
var uuid_str = cljs.core.str.cljs$core$IFn$_invoke$arity$1(elem).toLowerCase();
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (11));

var hex_positions_20017 = new cljs.core.PersistentVector(null, 16, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(2),(4),(6),(9),(11),(14),(16),(19),(21),(24),(26),(28),(30),(32),(34)], null);
var n__5636__auto___20018 = (16);
var i_20019 = (0);
while(true){
if((i_20019 < n__5636__auto___20018)){
var hex_idx_20020 = (cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(hex_positions_20017)[i_20019]);
var byte_val_20021 = parseInt(uuid_str.substring(hex_idx_20020,(hex_idx_20020 + (2))),(16));
(buf[((3) + i_20019)] = byte_val_20021);

var G__20022 = (i_20019 + (1));
i_20019 = G__20022;
continue;
} else {
}
break;
}

return buf;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = (elem instanceof cljs.core.Symbol);
if(and__5043__auto__){
return cljs.core.namespace(elem);
} else {
return and__5043__auto__;
}
})())){
var ns_str = cljs.core.namespace(elem);
var name_str = cljs.core.name(elem);
var ns_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(ns_str);
var name_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(name_str);
var ns_len = ns_enc.length;
var name_len = name_enc.length;
var buf = (new Uint8Array((((5) + ns_len) + name_len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (13));

(buf[(3)] = ns_len);

buf.set(ns_enc,(4));

(buf[((4) + ns_len)] = name_len);

buf.set(name_enc,((5) + ns_len));

return buf;
} else {
if((elem instanceof cljs.core.Symbol)){
var s = cljs.core.name(elem);
var encoded = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(s);
var len = encoded.length;
var buf = (new Uint8Array(((4) + len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (12));

(buf[(3)] = len);

buf.set(encoded,(4));

return buf;
} else {
if(typeof elem === 'string'){
var encoded = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(elem);
var len = encoded.length;
if((len <= (255))){
var buf = (new Uint8Array(((4) + len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (5));

(buf[(3)] = len);

buf.set(encoded,(4));

return buf;
} else {
var buf = (new Uint8Array(((7) + len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (6));

dv.setUint32((3),len,true);

buf.set(encoded,(7));

return buf;
}
} else {
if((!((cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem) == null)))){
return cljs_thread.eve.deftype_proto.serialize.serialize_typed_array(elem);
} else {
if((((!((elem == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs_thread$eve$deftype_proto$data$IDirectSerialize$))))?true:(((!elem.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IDirectSerialize,elem):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IDirectSerialize,elem))){
return cljs_thread.eve.deftype_proto.data._direct_serialize(elem);
} else {
var temp__5821__auto__ = cljs_thread.eve.deftype_proto.serialize.try_build_sab(elem);
if(cljs.core.truth_(temp__5821__auto__)){
var sab_inst = temp__5821__auto__;
if((((!((sab_inst == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === sab_inst.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!sab_inst.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_inst):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_inst))){
return cljs_thread.eve.deftype_proto.data._sab_encode(sab_inst,null);
} else {
return cljs_thread.eve.deftype_proto.data._direct_serialize(sab_inst);
}
} else {
return (new Uint8Array((0)));
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
}
});
/**
 * Serialize element using scratch buffer B.
 * Use for values when serializing key+value pairs simultaneously.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_val = (function cljs_thread$eve$deftype_proto$serialize$serialize_val(elem){
if((elem instanceof cljs.core.Keyword)){
return cljs_thread.eve.deftype_proto.serialize.serialize_keyword_impl(elem);
} else {
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.serialize_numeric_b(elem);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
if((((!((elem == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!elem.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,elem):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,elem))){
return cljs_thread.eve.deftype_proto.data._sab_encode(elem,null);
} else {
if((((!((elem == null))))?(((((elem.cljs$lang$protocol_mask$partition0$ & (67108864))) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs$core$IRecord$))))?true:(((!elem.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_(cljs.core.IRecord,elem):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IRecord,elem))){
var or__5045__auto____$1 = cljs_thread.eve.deftype_proto.serialize.encode_record(elem);
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return (new Uint8Array((0)));
}
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.eve.deftype_proto.serialize.direct_map_encoder;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.map_QMARK_(elem);
} else {
return and__5043__auto__;
}
})())){
return (cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.cljs$core$IFn$_invoke$arity$1(elem) : cljs_thread.eve.deftype_proto.serialize.direct_map_encoder.call(null, elem));
} else {
if(cljs.core.uuid_QMARK_(elem)){
var buf = (new Uint8Array((19)));
var uuid_str = cljs.core.str.cljs$core$IFn$_invoke$arity$1(elem).toLowerCase();
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (11));

var hex_positions_20023 = new cljs.core.PersistentVector(null, 16, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(2),(4),(6),(9),(11),(14),(16),(19),(21),(24),(26),(28),(30),(32),(34)], null);
var n__5636__auto___20024 = (16);
var i_20025 = (0);
while(true){
if((i_20025 < n__5636__auto___20024)){
var hex_idx_20026 = (cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(hex_positions_20023)[i_20025]);
var byte_val_20027 = parseInt(uuid_str.substring(hex_idx_20026,(hex_idx_20026 + (2))),(16));
(buf[((3) + i_20025)] = byte_val_20027);

var G__20028 = (i_20025 + (1));
i_20025 = G__20028;
continue;
} else {
}
break;
}

return buf;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = (elem instanceof cljs.core.Symbol);
if(and__5043__auto__){
return cljs.core.namespace(elem);
} else {
return and__5043__auto__;
}
})())){
var ns_str = cljs.core.namespace(elem);
var name_str = cljs.core.name(elem);
var ns_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(ns_str);
var name_enc = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(name_str);
var ns_len = ns_enc.length;
var name_len = name_enc.length;
var buf = (new Uint8Array((((5) + ns_len) + name_len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (13));

(buf[(3)] = ns_len);

buf.set(ns_enc,(4));

(buf[((4) + ns_len)] = name_len);

buf.set(name_enc,((5) + ns_len));

return buf;
} else {
if((elem instanceof cljs.core.Symbol)){
var s = cljs.core.name(elem);
var encoded = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(s);
var len = encoded.length;
var buf = (new Uint8Array(((4) + len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (12));

(buf[(3)] = len);

buf.set(encoded,(4));

return buf;
} else {
if(typeof elem === 'string'){
var encoded = cljs_thread.eve.deftype_proto.serialize.fast_encoder.encode(elem);
var len = encoded.length;
if((len <= (255))){
var buf = (new Uint8Array(((4) + len)));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (5));

(buf[(3)] = len);

buf.set(encoded,(4));

return buf;
} else {
var buf = (new Uint8Array(((7) + len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (6));

dv.setUint32((3),len,true);

buf.set(encoded,(7));

return buf;
}
} else {
if((!((cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem) == null)))){
return cljs_thread.eve.deftype_proto.serialize.serialize_typed_array(elem);
} else {
if((((!((elem == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === elem.cljs_thread$eve$deftype_proto$data$IDirectSerialize$))))?true:(((!elem.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IDirectSerialize,elem):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.IDirectSerialize,elem))){
return cljs_thread.eve.deftype_proto.data._direct_serialize(elem);
} else {
var temp__5821__auto__ = cljs_thread.eve.deftype_proto.serialize.try_build_sab(elem);
if(cljs.core.truth_(temp__5821__auto__)){
var sab_inst = temp__5821__auto__;
if((((!((sab_inst == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === sab_inst.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!sab_inst.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_inst):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,sab_inst))){
return cljs_thread.eve.deftype_proto.data._sab_encode(sab_inst,null);
} else {
return cljs_thread.eve.deftype_proto.data._direct_serialize(sab_inst);
}
} else {
return (new Uint8Array((0)));
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
}
});
/**
 * Serialize element (single-use, when only one serialize is alive at a time).
 * Uses scratch buffer A. For key+value pairs, use serialize-key/serialize-val.
 */
cljs_thread.eve.deftype_proto.serialize.serialize_element = (function cljs_thread$eve$deftype_proto$serialize$serialize_element(elem){
return cljs_thread.eve.deftype_proto.serialize.serialize_key(elem);
});
/**
 * Deserialize bytes back to a CLJS value.
 * Uses fast-path for primitive types, protocol dispatch for everything else.
 */
cljs_thread.eve.deftype_proto.serialize.deserialize_element = (function cljs_thread$eve$deftype_proto$serialize$deserialize_element(s_atom_env,bytes){
var len = bytes.length;
if((len === (0))){
return null;
} else {
if((((len >= (3))) && (((((bytes[(0)]) === (238))) && (((bytes[(1)]) === (219))))))){
var tag = (bytes[(2)]);
if((tag === (1))){
return false;
} else {
if((tag === (2))){
return true;
} else {
if((tag === (3))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
return dv.getInt32((3),true);
} else {
if((tag === (15))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
return Number(dv.getBigInt64((3),true));
} else {
if((tag === (4))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
return dv.getFloat64((3),true);
} else {
if((tag === (5))){
var str_len = (bytes[(3)]);
return cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((4),((4) + str_len)));
} else {
if((tag === (6))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var str_len = dv.getUint32((3),true);
return cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((7),((7) + str_len)));
} else {
if((tag === (7))){
var str_len = (bytes[(3)]);
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((4),((4) + str_len))));
} else {
if((tag === (8))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var str_len = dv.getUint32((3),true);
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((7),((7) + str_len))));
} else {
if((tag === (9))){
var ns_len = (bytes[(3)]);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((4),((4) + ns_len)));
var name_len = (bytes[((4) + ns_len)]);
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray(((5) + ns_len),(((5) + ns_len) + name_len)));
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
} else {
if((tag === (10))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var ns_len = dv.getUint32((3),true);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((7),((7) + ns_len)));
var name_len = dv.getUint32(((7) + ns_len),true);
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray(((11) + ns_len),(((11) + ns_len) + name_len)));
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
} else {
if((tag === (11))){
var hex_chars = [];
var n__5636__auto___20029 = (16);
var i_20030 = (0);
while(true){
if((i_20030 < n__5636__auto___20029)){
var b_20031 = (bytes[((3) + i_20030)]);
var hi_20032 = (b_20031 >>> (4));
var lo_20033 = (b_20031 & (15));
hex_chars.push(hi_20032.toString((16)));

hex_chars.push(lo_20033.toString((16)));

if((((i_20030 === (3))) || ((((i_20030 === (5))) || ((((i_20030 === (7))) || ((i_20030 === (9))))))))){
hex_chars.push("-");
} else {
}

var G__20034 = (i_20030 + (1));
i_20030 = G__20034;
continue;
} else {
}
break;
}

return cljs.core.uuid(hex_chars.join(""));
} else {
if((tag === (12))){
var str_len = (bytes[(3)]);
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((4),((4) + str_len))));
} else {
if((tag === (13))){
var ns_len = (bytes[(3)]);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray((4),((4) + ns_len)));
var name_len = (bytes[((4) + ns_len)]);
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(bytes.subarray(((5) + ns_len),(((5) + ns_len) + name_len)));
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
} else {
if((tag === (14))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
return (new Date(dv.getFloat64((3),true)));
} else {
if((((tag >= (16))) && ((tag <= (19))))){
var ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get(tag);
if(cljs.core.truth_(ctor)){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var offset = dv.getInt32((3),true);
var G__19993 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__19994 = offset;
return (ctor.cljs$core$IFn$_invoke$arity$2 ? ctor.cljs$core$IFn$_invoke$arity$2(G__19993,G__19994) : ctor.call(null, G__19993,G__19994));
} else {
return null;
}
} else {
if((tag === (26))){
var sab_map_ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get((16));
if(cljs.core.truth_(sab_map_ctor)){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var offset = dv.getInt32((3),true);
var sab_m = (function (){var G__19995 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__19996 = offset;
return (sab_map_ctor.cljs$core$IFn$_invoke$arity$2 ? sab_map_ctor.cljs$core$IFn$_invoke$arity$2(G__19995,G__19996) : sab_map_ctor.call(null, G__19995,G__19996));
})();
var tag_str = cljs.core.get.cljs$core$IFn$_invoke$arity$2(sab_m,new cljs.core.Keyword("eve","record-tag","eve/record-tag",1970904930));
var temp__5821__auto__ = (function (){var and__5043__auto__ = tag_str;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.eve.deftype_proto.serialize.record_ctor_by_tag.get(tag_str);
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(temp__5821__auto__)){
var map_fn = temp__5821__auto__;
var field_map = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.reduce_kv(cljs.core.assoc,cljs.core.PersistentArrayMap.EMPTY,sab_m),new cljs.core.Keyword("eve","record-tag","eve/record-tag",1970904930));
return (map_fn.cljs$core$IFn$_invoke$arity$1 ? map_fn.cljs$core$IFn$_invoke$arity$1(field_map) : map_fn.call(null, field_map));
} else {
return sab_m;
}
} else {
return null;
}
} else {
if((tag === (28))){
var ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get(tag);
if(cljs.core.truth_(ctor)){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var block_offset = dv.getInt32((3),true);
var G__19997 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__19998 = block_offset;
return (ctor.cljs$core$IFn$_invoke$arity$2 ? ctor.cljs$core$IFn$_invoke$arity$2(G__19997,G__19998) : ctor.call(null, G__19997,G__19998));
} else {
return null;
}
} else {
if((tag === (27))){
var data_len = bytes.byteLength;
if((data_len === (7))){
var dv = (new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength));
var sab_offset = dv.getInt32((3),true);
var sab_u8 = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var temp__5823__auto__ = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
if(cljs.core.truth_(temp__5823__auto__)){
var parent = temp__5823__auto__;
var env = (function (){var or__5045__auto____$1 = parent.parent_atom_domain;
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return parent;
}
})().s_atom_env;
return new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(env);
} else {
return null;
}
}
})();
if(cljs.core.truth_(sab_u8)){
var sab = sab_u8.buffer;
var sab_dv = (new DataView(sab));
var subtype = sab_dv.getUint8(sab_offset);
var byte_len = sab_dv.getUint32((sab_offset + (8)),true);
var data_start = (sab_offset + (16));
var in_transaction_QMARK_ = (!((cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ == null)));
if(in_transaction_QMARK_){
var G__19999 = subtype;
switch (G__19999) {
case (1):
return (new Uint8Array(sab,data_start,byte_len));

break;
case (2):
return (new Int8Array(sab,data_start,byte_len));

break;
case (3):
return (new Uint8ClampedArray(sab,data_start,byte_len));

break;
case (4):
return (new Int16Array(sab,data_start,(byte_len / (2))));

break;
case (5):
return (new Uint16Array(sab,data_start,(byte_len / (2))));

break;
case (6):
return (new Int32Array(sab,data_start,(byte_len / (4))));

break;
case (7):
return (new Uint32Array(sab,data_start,(byte_len / (4))));

break;
case (8):
return (new Float32Array(sab,data_start,(byte_len / (4))));

break;
case (9):
return (new Float64Array(sab,data_start,(byte_len / (8))));

break;
case (10):
if((typeof BigInt64Array !== 'undefined')){
return (new BigInt64Array(sab,data_start,(byte_len / (8))));
} else {
return null;
}

break;
case (11):
if((typeof BigUint64Array !== 'undefined')){
return (new BigUint64Array(sab,data_start,(byte_len / (8))));
} else {
return null;
}

break;
default:
return null;

}
} else {
var src = sab_u8.subarray(data_start,(data_start + byte_len));
var dst = (new Uint8Array(byte_len));
dst.set(src);

var ab = dst.buffer;
var G__20000 = subtype;
switch (G__20000) {
case (1):
return (new Uint8Array(ab));

break;
case (2):
return (new Int8Array(ab));

break;
case (3):
return (new Uint8ClampedArray(ab));

break;
case (4):
return (new Int16Array(ab));

break;
case (5):
return (new Uint16Array(ab));

break;
case (6):
return (new Int32Array(ab));

break;
case (7):
return (new Uint32Array(ab));

break;
case (8):
return (new Float32Array(ab));

break;
case (9):
return (new Float64Array(ab));

break;
case (10):
if((typeof BigInt64Array !== 'undefined')){
return (new BigInt64Array(ab));
} else {
return null;
}

break;
case (11):
if((typeof BigUint64Array !== 'undefined')){
return (new BigUint64Array(ab));
} else {
return null;
}

break;
default:
return null;

}
}
} else {
return null;
}
} else {
return null;
}
} else {
return null;

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
}
}
}
}
}
}
}
}
} else {
return null;
}
}
});
/**
 * Zero-copy deserialization: reads directly from a js/DataView at the given
 * offset+length without creating intermediate Uint8Array copies.
 * Handles all fast-path types inline — no allocation for numeric types,
 * subarray views (not copies) for string/keyword types.
 * For SAB pointer types (map/set/vec/list), constructs the wrapper directly
 * from the DataView bytes — true O(1) deref.
 */
cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv = (function cljs_thread$eve$deftype_proto$serialize$deserialize_from_dv(s_atom_env,dv,data_offset,data_len){
if((data_len === (0))){
return null;
} else {
if((((data_len >= (3))) && ((((dv.getUint8(data_offset) === (238))) && ((dv.getUint8((data_offset + (1))) === (219))))))){
var tag = dv.getUint8((data_offset + (2)));
var off = data_offset;
if((tag === (1))){
return false;
} else {
if((tag === (2))){
return true;
} else {
if((tag === (3))){
return dv.getInt32((off + (3)),true);
} else {
if((tag === (15))){
return Number(dv.getBigInt64((off + (3)),true));
} else {
if((tag === (4))){
return dv.getFloat64((off + (3)),true);
} else {
if((tag === (5))){
var str_len = dv.getUint8((off + (3)));
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
return cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (4)),((off + (4)) + str_len)));
} else {
if((tag === (6))){
var str_len = dv.getUint32((off + (3)),true);
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
return cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (7)),((off + (7)) + str_len)));
} else {
if((tag === (7))){
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.get(off);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var str_len = dv.getUint8((off + (3)));
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var kw = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (4)),((off + (4)) + str_len))));
if((cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.size >= (16384))){
cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.clear();
} else {
}

cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.set(off,kw);

return kw;
}
} else {
if((tag === (8))){
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.get(off);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var str_len = dv.getUint32((off + (3)),true);
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var kw = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (7)),((off + (7)) + str_len))));
if((cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.size >= (16384))){
cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.clear();
} else {
}

cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.set(off,kw);

return kw;
}
} else {
if((tag === (9))){
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.get(off);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var ns_len = dv.getUint8((off + (3)));
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (4)),((off + (4)) + ns_len)));
var name_len = dv.getUint8(((off + (4)) + ns_len));
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray(((off + (5)) + ns_len),(((off + (5)) + ns_len) + name_len)));
var kw = cljs.core.keyword.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
if((cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.size >= (16384))){
cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.clear();
} else {
}

cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.set(off,kw);

return kw;
}
} else {
if((tag === (10))){
var or__5045__auto__ = cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.get(off);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var ns_len = dv.getUint32((off + (3)),true);
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (7)),((off + (7)) + ns_len)));
var name_len = dv.getUint32(((off + (7)) + ns_len),true);
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray(((off + (11)) + ns_len),(((off + (11)) + ns_len) + name_len)));
var kw = cljs.core.keyword.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
if((cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.size >= (16384))){
cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.clear();
} else {
}

cljs_thread.eve.deftype_proto.serialize.kw_deser_cache.set(off,kw);

return kw;
}
} else {
if((tag === (12))){
var str_len = dv.getUint8((off + (3)));
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (4)),((off + (4)) + str_len))));
} else {
if((tag === (13))){
var ns_len = dv.getUint8((off + (3)));
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var ns_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray((off + (4)),((off + (4)) + ns_len)));
var name_len = dv.getUint8(((off + (4)) + ns_len));
var name_str = cljs_thread.eve.deftype_proto.serialize.decode_text(u8.subarray(((off + (5)) + ns_len),(((off + (5)) + ns_len) + name_len)));
return cljs.core.symbol.cljs$core$IFn$_invoke$arity$2(ns_str,name_str);
} else {
if((tag === (11))){
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var hex_chars = [];
var n__5636__auto___20038 = (16);
var i_20039 = (0);
while(true){
if((i_20039 < n__5636__auto___20038)){
var b_20040 = (u8[((off + (3)) + i_20039)]);
var hi_20041 = (b_20040 >>> (4));
var lo_20042 = (b_20040 & (15));
hex_chars.push(hi_20041.toString((16)));

hex_chars.push(lo_20042.toString((16)));

if((((i_20039 === (3))) || ((((i_20039 === (5))) || ((((i_20039 === (7))) || ((i_20039 === (9))))))))){
hex_chars.push("-");
} else {
}

var G__20044 = (i_20039 + (1));
i_20039 = G__20044;
continue;
} else {
}
break;
}

return cljs.core.uuid(hex_chars.join(""));
} else {
if((tag === (14))){
return (new Date(dv.getFloat64((off + (3)),true)));
} else {
if((((tag >= (16))) && ((tag <= (19))))){
var ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get(tag);
if(cljs.core.truth_(ctor)){
var instance_offset = dv.getInt32((off + (3)),true);
var G__20001 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__20002 = instance_offset;
return (ctor.cljs$core$IFn$_invoke$arity$2 ? ctor.cljs$core$IFn$_invoke$arity$2(G__20001,G__20002) : ctor.call(null, G__20001,G__20002));
} else {
return null;
}
} else {
if((tag === (26))){
var sab_map_ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get((16));
if(cljs.core.truth_(sab_map_ctor)){
var instance_offset = dv.getInt32((off + (3)),true);
var sab_m = (function (){var G__20003 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__20004 = instance_offset;
return (sab_map_ctor.cljs$core$IFn$_invoke$arity$2 ? sab_map_ctor.cljs$core$IFn$_invoke$arity$2(G__20003,G__20004) : sab_map_ctor.call(null, G__20003,G__20004));
})();
var tag_str = cljs.core.get.cljs$core$IFn$_invoke$arity$2(sab_m,new cljs.core.Keyword("eve","record-tag","eve/record-tag",1970904930));
var temp__5821__auto__ = (function (){var and__5043__auto__ = tag_str;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.eve.deftype_proto.serialize.record_ctor_by_tag.get(tag_str);
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(temp__5821__auto__)){
var map_fn = temp__5821__auto__;
var field_map = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.reduce_kv(cljs.core.assoc,cljs.core.PersistentArrayMap.EMPTY,sab_m),new cljs.core.Keyword("eve","record-tag","eve/record-tag",1970904930));
return (map_fn.cljs$core$IFn$_invoke$arity$1 ? map_fn.cljs$core$IFn$_invoke$arity$1(field_map) : map_fn.call(null, field_map));
} else {
return sab_m;
}
} else {
return null;
}
} else {
if((tag === (27))){
if((data_len === (7))){
var sab_offset = dv.getInt32((off + (3)),true);
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var sab = u8.buffer;
var subtype = dv.getUint8(sab_offset);
var byte_len = dv.getUint32((sab_offset + (8)),true);
var data_start = (sab_offset + (16));
var in_transaction_QMARK_ = (!((cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ == null)));
if(in_transaction_QMARK_){
var G__20005 = subtype;
switch (G__20005) {
case (1):
return (new Uint8Array(sab,data_start,byte_len));

break;
case (2):
return (new Int8Array(sab,data_start,byte_len));

break;
case (3):
return (new Uint8ClampedArray(sab,data_start,byte_len));

break;
case (4):
return (new Int16Array(sab,data_start,(byte_len / (2))));

break;
case (5):
return (new Uint16Array(sab,data_start,(byte_len / (2))));

break;
case (6):
return (new Int32Array(sab,data_start,(byte_len / (4))));

break;
case (7):
return (new Uint32Array(sab,data_start,(byte_len / (4))));

break;
case (8):
return (new Float32Array(sab,data_start,(byte_len / (4))));

break;
case (9):
return (new Float64Array(sab,data_start,(byte_len / (8))));

break;
case (10):
if((typeof BigInt64Array !== 'undefined')){
return (new BigInt64Array(sab,data_start,(byte_len / (8))));
} else {
return null;
}

break;
case (11):
if((typeof BigUint64Array !== 'undefined')){
return (new BigUint64Array(sab,data_start,(byte_len / (8))));
} else {
return null;
}

break;
default:
return null;

}
} else {
var src = u8.subarray(data_start,(data_start + byte_len));
var dst = (new Uint8Array(byte_len));
dst.set(src);

var ab = dst.buffer;
var G__20006 = subtype;
switch (G__20006) {
case (1):
return (new Uint8Array(ab));

break;
case (2):
return (new Int8Array(ab));

break;
case (3):
return (new Uint8ClampedArray(ab));

break;
case (4):
return (new Int16Array(ab));

break;
case (5):
return (new Uint16Array(ab));

break;
case (6):
return (new Int32Array(ab));

break;
case (7):
return (new Uint32Array(ab));

break;
case (8):
return (new Float32Array(ab));

break;
case (9):
return (new Float64Array(ab));

break;
case (10):
if((typeof BigInt64Array !== 'undefined')){
return (new BigInt64Array(ab));
} else {
return null;
}

break;
case (11):
if((typeof BigUint64Array !== 'undefined')){
return (new BigUint64Array(ab));
} else {
return null;
}

break;
default:
return dst;

}
}
} else {
var subtype = dv.getUint8((off + (3)));
var byte_len = dv.getUint32((off + (4)),true);
var u8 = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var src = u8.subarray((off + (8)),((off + (8)) + byte_len));
var dst = (new Uint8Array(byte_len));
dst.set(src);

var ab = dst.buffer;
var G__20007 = subtype;
switch (G__20007) {
case (1):
return (new Uint8Array(ab));

break;
case (2):
return (new Int8Array(ab));

break;
case (3):
return (new Uint8ClampedArray(ab));

break;
case (4):
return (new Int16Array(ab));

break;
case (5):
return (new Uint16Array(ab));

break;
case (6):
return (new Int32Array(ab));

break;
case (7):
return (new Uint32Array(ab));

break;
case (8):
return (new Float32Array(ab));

break;
case (9):
return (new Float64Array(ab));

break;
case (10):
if((typeof BigInt64Array !== 'undefined')){
return (new BigInt64Array(ab));
} else {
return null;
}

break;
case (11):
if((typeof BigUint64Array !== 'undefined')){
return (new BigUint64Array(ab));
} else {
return null;
}

break;
default:
return dst;

}
}
} else {
if((tag === (28))){
var ctor = cljs_thread.eve.deftype_proto.serialize.sab_type_constructors.get(tag);
if(cljs.core.truth_(ctor)){
var block_offset = dv.getInt32((off + (3)),true);
var G__20008 = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var G__20009 = block_offset;
return (ctor.cljs$core$IFn$_invoke$arity$2 ? ctor.cljs$core$IFn$_invoke$arity$2(G__20008,G__20009) : ctor.call(null, G__20008,G__20009));
} else {
return null;
}
} else {
return null;

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
}
}
}
}
}
}
}
}
} else {
return null;
}
}
});
/**
 * Dispose a deserialized SAB value, freeing its SAB memory.
 * No-op for primitives and non-SAB values.
 * Used by atom swap to clean up old state after CAS.
 */
cljs_thread.eve.deftype_proto.serialize.dispose_sab_value_BANG_ = (function cljs_thread$eve$deftype_proto$serialize$dispose_sab_value_BANG_(value,s_atom_env){
if((((!((value == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === value.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!value.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,value):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,value))){
return cljs_thread.eve.deftype_proto.data._sab_dispose(value,s_atom_env);
} else {
return null;
}
});

//# sourceMappingURL=cljs_thread.eve.deftype_proto.serialize.js.map
