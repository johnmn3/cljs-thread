goog.provide('cljs_thread.eve.deftype_proto.data');
cljs_thread.eve.deftype_proto.data.NUM_SLAB_CLASSES = (6);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_0 = (32);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_1 = (64);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_2 = (128);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_3 = (256);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_4 = (512);
cljs_thread.eve.deftype_proto.data.SLAB_SIZE_5 = (1024);
cljs_thread.eve.deftype_proto.data.SLAB_SIZES = [(32),(64),(128),(256),(512),(1024),(1)];
cljs_thread.eve.deftype_proto.data.SLAB_MAX_BLOCK_SIZE = (1024);
cljs_thread.eve.deftype_proto.data.DEFAULT_SLAB_CAPACITY = (((1) * (1024)) * (1024));
cljs_thread.eve.deftype_proto.data.SLAB_CLASS_CAPACITIES = [(((1) * (1024)) * (1024)),(((1) * (1024)) * (1024)),(((2) * (1024)) * (1024)),(((2) * (1024)) * (1024)),(((4) * (1024)) * (1024)),(((4) * (1024)) * (1024))];
/**
 * Get the default capacity for a slab class index.
 */
cljs_thread.eve.deftype_proto.data.default_capacity_for_class = (function cljs_thread$eve$deftype_proto$data$default_capacity_for_class(class_idx){
if((((class_idx >= (0))) && ((class_idx < cljs_thread.eve.deftype_proto.data.SLAB_CLASS_CAPACITIES.length)))){
return (cljs_thread.eve.deftype_proto.data.SLAB_CLASS_CAPACITIES[class_idx]);
} else {
return cljs_thread.eve.deftype_proto.data.DEFAULT_SLAB_CAPACITY;
}
});
cljs_thread.eve.deftype_proto.data.SLAB_HEADER_SIZE = (64);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_MAGIC = (0);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_BLOCK_SIZE = (4);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_TOTAL_BLOCKS = (8);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_FREE_COUNT = (12);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_ALLOC_CURSOR = (16);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_CLASS_IDX = (20);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_BITMAP_OFFSET = (24);
cljs_thread.eve.deftype_proto.data.SLAB_HDR_DATA_OFFSET = (28);
cljs_thread.eve.deftype_proto.data.SLAB_MAGIC = (1397506370);
cljs_thread.eve.deftype_proto.data.BITMAP_ALIGNMENT = (16);
/**
 * Calculate bitmap size in bytes for n blocks, padded to 16-byte alignment.
 */
cljs_thread.eve.deftype_proto.data.bitmap_byte_size = (function cljs_thread$eve$deftype_proto$data$bitmap_byte_size(total_blocks){
var raw_bytes = Math.ceil((total_blocks / (8)));
var padded = (Math.ceil((raw_bytes / (16))) * (16));
return padded;
});
/**
 * Calculate layout for a slab with given block-size and capacity.
 * Returns {:total-bytes :bitmap-offset :bitmap-size :data-offset :total-blocks}.
 */
cljs_thread.eve.deftype_proto.data.slab_layout = (function cljs_thread$eve$deftype_proto$data$slab_layout(block_size,capacity_bytes){
var total_blocks = Math.floor((capacity_bytes / block_size));
var bitmap_offset = (64);
var bm_size = cljs_thread.eve.deftype_proto.data.bitmap_byte_size(total_blocks);
var data_offset = (bitmap_offset + bm_size);
var total_bytes = (data_offset + (total_blocks * block_size));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"total-bytes","total-bytes",1693967112),total_bytes,new cljs.core.Keyword(null,"bitmap-offset","bitmap-offset",-54089933),bitmap_offset,new cljs.core.Keyword(null,"bitmap-size","bitmap-size",-730951825),bm_size,new cljs.core.Keyword(null,"data-offset","data-offset",-712338495),data_offset,new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763),total_blocks], null);
});
/**
 * Given a requested byte size, return the slab class index (0-5).
 * Returns -1 if the size exceeds SLAB_MAX_BLOCK_SIZE (use overflow allocator).
 */
cljs_thread.eve.deftype_proto.data.size__GT_class_idx = (function cljs_thread$eve$deftype_proto$data$size__GT_class_idx(size_bytes){
if((size_bytes <= (32))){
return (0);
} else {
if((size_bytes <= (64))){
return (1);
} else {
if((size_bytes <= (128))){
return (2);
} else {
if((size_bytes <= (256))){
return (3);
} else {
if((size_bytes <= (512))){
return (4);
} else {
if((size_bytes <= (1024))){
return (5);
} else {
return (-1);

}
}
}
}
}
}
});
cljs_thread.eve.deftype_proto.data.SLAB_PTR_NIL = (-1);
/**
 * Pack a slab class index and block index into a single i32.
 */
cljs_thread.eve.deftype_proto.data.pack_slab_ptr = (function cljs_thread$eve$deftype_proto$data$pack_slab_ptr(class_idx,block_idx){
return (((class_idx & (255)) << (24)) | (block_idx & (16777215)));
});
/**
 * Extract the slab class index (0-5) from a packed slab pointer.
 */
cljs_thread.eve.deftype_proto.data.unpack_slab_class = (function cljs_thread$eve$deftype_proto$data$unpack_slab_class(slab_ptr){
return ((slab_ptr >>> (24)) & (255));
});
/**
 * Extract the block index from a packed slab pointer.
 */
cljs_thread.eve.deftype_proto.data.unpack_slab_block_idx = (function cljs_thread$eve$deftype_proto$data$unpack_slab_block_idx(slab_ptr){
return (slab_ptr & (16777215));
});
cljs_thread.eve.deftype_proto.data.SIZE_OF_INT32 = (4);
cljs_thread.eve.deftype_proto.data.ROOT_SAB_HEADER_SIZE = (64);
cljs_thread.eve.deftype_proto.data.ROOT_MAGIC_OFFSET = (0);
cljs_thread.eve.deftype_proto.data.ROOT_ATOM_PTR_OFFSET = (4);
cljs_thread.eve.deftype_proto.data.ROOT_EPOCH_OFFSET = (8);
cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REG_OFFSET = (12);
cljs_thread.eve.deftype_proto.data.ROOT_MAGIC = (1380929364);
cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START = (64);
cljs_thread.eve.deftype_proto.data.MAX_WORKERS = (256);
cljs_thread.eve.deftype_proto.data.WORKER_SLOT_SIZE = (24);
cljs_thread.eve.deftype_proto.data.WORKER_REGISTRY_SIZE = ((256) * (24));
cljs_thread.eve.deftype_proto.data.ROOT_SAB_SIZE = ((64) + cljs_thread.eve.deftype_proto.data.WORKER_REGISTRY_SIZE);
cljs_thread.eve.deftype_proto.data.WORKER_STATUS_INACTIVE = (0);
cljs_thread.eve.deftype_proto.data.WORKER_STATUS_ACTIVE = (1);
cljs_thread.eve.deftype_proto.data.WORKER_STATUS_STALE = (2);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_STATUS = (0);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_CURRENT_EPOCH = (4);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_HEARTBEAT_LO = (8);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_HEARTBEAT_HI = (12);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_WORKER_ID = (16);
cljs_thread.eve.deftype_proto.data.OFFSET_WS_RESERVED = (20);
cljs_thread.eve.deftype_proto.data.HEARTBEAT_TIMEOUT_MS = (30000);
cljs_thread.eve.deftype_proto.data.STATUS_FREE = (0);
cljs_thread.eve.deftype_proto.data.STATUS_ALLOCATED = (1);
cljs_thread.eve.deftype_proto.data.STATUS_RETIRED = (2);

/**
 * @interface
 */
cljs_thread.eve.deftype_proto.data.IDirectSerialize = function(){};

var cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$dyn_22058 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._direct_serialize[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._direct_serialize["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IDirectSerialize.-direct-serialize",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._direct_serialize = (function cljs_thread$eve$deftype_proto$data$_direct_serialize(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1(this$);
} else {
return cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$dyn_22058(this$);
}
});


/**
 * @interface
 */
cljs_thread.eve.deftype_proto.data.ISabStorable = function(){};

var cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$dyn_22061 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._sab_tag[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._sab_tag["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-tag",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._sab_tag = (function cljs_thread$eve$deftype_proto$data$_sab_tag(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1(this$);
} else {
return cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$dyn_22061(this$);
}
});

var cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$dyn_22063 = (function (this$,slab_env){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._sab_encode[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,slab_env) : m__5394__auto__.call(null, this$,slab_env));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._sab_encode["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,slab_env) : m__5392__auto__.call(null, this$,slab_env));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-encode",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._sab_encode = (function cljs_thread$eve$deftype_proto$data$_sab_encode(this$,slab_env){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2(this$,slab_env);
} else {
return cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$dyn_22063(this$,slab_env);
}
});

var cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$dyn_22073 = (function (this$,slab_env){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._sab_dispose[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,slab_env) : m__5394__auto__.call(null, this$,slab_env));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._sab_dispose["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,slab_env) : m__5392__auto__.call(null, this$,slab_env));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-dispose",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._sab_dispose = (function cljs_thread$eve$deftype_proto$data$_sab_dispose(this$,slab_env){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2(this$,slab_env);
} else {
return cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$dyn_22073(this$,slab_env);
}
});


/**
 * @interface
 */
cljs_thread.eve.deftype_proto.data.ISabRetirable = function(){};

var cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$dyn_22080 = (function (old_value,new_value,slab_env,mode){
var x__5393__auto__ = (((old_value == null))?null:old_value);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$4(old_value,new_value,slab_env,mode) : m__5394__auto__.call(null, old_value,new_value,slab_env,mode));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$4(old_value,new_value,slab_env,mode) : m__5392__auto__.call(null, old_value,new_value,slab_env,mode));
} else {
throw cljs.core.missing_protocol("ISabRetirable.-sab-retire-diff!",old_value);
}
}
});
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_ = (function cljs_thread$eve$deftype_proto$data$_sab_retire_diff_BANG_(old_value,new_value,slab_env,mode){
if((((!((old_value == null)))) && ((!((old_value.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 == null)))))){
return old_value.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4(old_value,new_value,slab_env,mode);
} else {
return cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$dyn_22080(old_value,new_value,slab_env,mode);
}
});


/**
 * @interface
 */
cljs_thread.eve.deftype_proto.data.ISabpType = function(){};

var cljs_thread$eve$deftype_proto$data$ISabpType$_sabp_type_key$dyn_22086 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._sabp_type_key[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._sabp_type_key["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("ISabpType.-sabp-type-key",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._sabp_type_key = (function cljs_thread$eve$deftype_proto$data$_sabp_type_key(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$ISabpType$_sabp_type_key$arity$1 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$ISabpType$_sabp_type_key$arity$1(this$);
} else {
return cljs_thread$eve$deftype_proto$data$ISabpType$_sabp_type_key$dyn_22086(this$);
}
});


/**
 * Marker protocol for EVE types. Used by serialization to detect
 * EVE objects without walking into their internals.
 * @interface
 */
cljs_thread.eve.deftype_proto.data.IsEve = function(){};

var cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$dyn_22091 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.deftype_proto.data._eve_QMARK_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.deftype_proto.data._eve_QMARK_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IsEve.-eve?",this$);
}
}
});
cljs_thread.eve.deftype_proto.data._eve_QMARK_ = (function cljs_thread$eve$deftype_proto$data$_eve_QMARK_(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 == null)))))){
return this$.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1(this$);
} else {
return cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$dyn_22091(this$);
}
});

cljs_thread.eve.deftype_proto.data._STAR_persistent_QMARK__STAR_ = true;
cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = null;
cljs_thread.eve.deftype_proto.data._STAR_worker_id_STAR_ = null;
cljs_thread.eve.deftype_proto.data._STAR_worker_slot_idx_STAR_ = null;
cljs_thread.eve.deftype_proto.data._STAR_read_epoch_STAR_ = null;
cljs_thread.eve.deftype_proto.data.HAMT_BITMAP_NODE_TYPE = (3);
cljs_thread.eve.deftype_proto.data.HAMT_COLLISION_NODE_TYPE = (4);
cljs_thread.eve.deftype_proto.data.HAMT_BITMAP_NODE_COLUMNAR_TYPE = (6);
cljs_thread.eve.deftype_proto.data.HAMT_BITMAP_NODE_HEADER_SIZE = (10);
cljs_thread.eve.deftype_proto.data.HAMT_COLLISION_NODE_HEADER_SIZE = (8);
cljs_thread.eve.deftype_proto.data.TAG_JS_ARRAY = "js/Array";
cljs_thread.eve.deftype_proto.data.TAG_UINT8_ARRAY = "js/Uint8Array";
cljs_thread.eve.deftype_proto.data.TAG_INT8_ARRAY = "js/Int8Array";
cljs_thread.eve.deftype_proto.data.TAG_UINT8_CLAMPED_ARRAY = "js/Uint8ClampedArray";
cljs_thread.eve.deftype_proto.data.TAG_INT16_ARRAY = "js/Int16Array";
cljs_thread.eve.deftype_proto.data.TAG_UINT16_ARRAY = "js/Uint16Array";
cljs_thread.eve.deftype_proto.data.TAG_INT32_ARRAY = "js/Int32Array";
cljs_thread.eve.deftype_proto.data.TAG_UINT32_ARRAY = "js/Uint32Array";
cljs_thread.eve.deftype_proto.data.TAG_FLOAT32_ARRAY = "js/Float32Array";
cljs_thread.eve.deftype_proto.data.TAG_FLOAT64_ARRAY = "js/Float64Array";
cljs_thread.eve.deftype_proto.data.TAG_BIGINT64_ARRAY = "js/BigInt64Array";
cljs_thread.eve.deftype_proto.data.TAG_BIGUINT64_ARRAY = "js/BigUint64Array";
cljs_thread.eve.deftype_proto.data.TAG_REGEX = "regex";
cljs_thread.eve.deftype_proto.data.TAG_URI = "uri";
cljs_thread.eve.deftype_proto.data.TAG_CHAR = "char";
cljs_thread.eve.deftype_proto.data.TAG_BIGINT = "bigint";
cljs_thread.eve.deftype_proto.data.TAG_RECORD = "record";
cljs_thread.eve.deftype_proto.data.TAG_SABP_LINKED_LIST_STATE = "eve/SabpListStateV1";
cljs_thread.eve.deftype_proto.data.TAG_SABP_CHUNKED_LIST_STATE = "eve/SabpChunkedListV1";
cljs_thread.eve.deftype_proto.data.TAG_SABP_CHUNKED_VEC_STATE = "eve/SabpChunkedVecV1";
cljs_thread.eve.deftype_proto.data.TAG_SABP_MAP_STATE = "eve/SabpMapStateV1";
cljs_thread.eve.deftype_proto.data.TAG_SABP_SET_STATE = "eve/SabpSetStateV1";
cljs_thread.eve.deftype_proto.data.DIRECT_MAGIC_0 = (238);
cljs_thread.eve.deftype_proto.data.DIRECT_MAGIC_1 = (219);
cljs_thread.eve.deftype_proto.data.DIRECT_MARKER_MAP = (237);
cljs_thread.eve.deftype_proto.data.DIRECT_MARKER_SET = (236);
cljs_thread.eve.deftype_proto.data.OFFSET_LL_NODE_VALUE = (0);
cljs_thread.eve.deftype_proto.data.LL_NODE_NEXT_OFFSET_SIZE_BYTES = (4);
cljs_thread.eve.deftype_proto.data.CHUNKED_LIST_CHUNK_SIZE = (32);
cljs_thread.eve.deftype_proto.data.MAX_SWAP_RETRIES = (1000);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.data !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.data.sabp_cleanup_fns !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.data.sabp_cleanup_fns = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
cljs_thread.eve.deftype_proto.data.register_sabp_cleanup_BANG_ = (function cljs_thread$eve$deftype_proto$data$register_sabp_cleanup_BANG_(type_key_str,cleanup_fn){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.eve.deftype_proto.data.sabp_cleanup_fns,cljs.core.assoc,type_key_str,cleanup_fn);
});
cljs_thread.eve.deftype_proto.data.get_sabp_cleanup_fn = (function cljs_thread$eve$deftype_proto$data$get_sabp_cleanup_fn(type_key_str){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.eve.deftype_proto.data.sabp_cleanup_fns),type_key_str);
});

//# sourceMappingURL=cljs_thread.eve.deftype_proto.data.js.map
