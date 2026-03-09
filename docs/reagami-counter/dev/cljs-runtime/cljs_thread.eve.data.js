goog.provide('cljs_thread.eve.data');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_FREE !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_FREE = (0);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_ALLOCATED !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_ALLOCATED = (1);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_LOCKED_FOR_UPDATE !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_LOCKED_FOR_UPDATE = (2);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_EMBEDDED_ATOM_HEADER !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_EMBEDDED_ATOM_HEADER = (3);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_ORPHANED !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_ORPHANED = (4);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_RETIRED !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_RETIRED = (5);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.STATUS_ZEROED_UNUSED !== 'undefined')){
} else {
cljs_thread.eve.data.STATUS_ZEROED_UNUSED = (-1);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.ROOT_POINTER_NIL_SENTINEL !== 'undefined')){
} else {
cljs_thread.eve.data.ROOT_POINTER_NIL_SENTINEL = (-1);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_SAB_TOTAL_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_SAB_TOTAL_SIZE = (0);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_INDEX_REGION_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_INDEX_REGION_SIZE = (4);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_DATA_REGION_START !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_DATA_REGION_START = (8);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_MAX_BLOCK_DESCRIPTORS !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_MAX_BLOCK_DESCRIPTORS = (12);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_ATOM_ROOT_DATA_DESC_IDX !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_ATOM_ROOT_DATA_DESC_IDX = (16);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_GLOBAL_EPOCH !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_GLOBAL_EPOCH = (20);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WORKER_REGISTRY_START !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WORKER_REGISTRY_START = (24);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.MAX_WORKERS !== 'undefined')){
} else {
cljs_thread.eve.data.MAX_WORKERS = (256);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WORKER_SLOT_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.WORKER_SLOT_SIZE = (24);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WORKER_REGISTRY_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.WORKER_REGISTRY_SIZE = ((256) * (24));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_STATUS !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_STATUS = (0);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_CURRENT_EPOCH !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_CURRENT_EPOCH = (4);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_HEARTBEAT_LO !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_HEARTBEAT_LO = (8);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_HEARTBEAT_HI !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_HEARTBEAT_HI = (12);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_WORKER_ID !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_WORKER_ID = (16);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_WS_RESERVED !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_WS_RESERVED = (20);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WORKER_STATUS_INACTIVE !== 'undefined')){
} else {
cljs_thread.eve.data.WORKER_STATUS_INACTIVE = (0);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WORKER_STATUS_ACTIVE !== 'undefined')){
} else {
cljs_thread.eve.data.WORKER_STATUS_ACTIVE = (1);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WORKER_STATUS_STALE !== 'undefined')){
} else {
cljs_thread.eve.data.WORKER_STATUS_STALE = (2);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.HEARTBEAT_TIMEOUT_MS !== 'undefined')){
} else {
cljs_thread.eve.data.HEARTBEAT_TIMEOUT_MS = (30000);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START = ((24) + cljs_thread.eve.data.WORKER_REGISTRY_SIZE);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_STATUS !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_STATUS = (0);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_DATA_OFFSET !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_DATA_OFFSET = (4);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_DATA_LENGTH !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_DATA_LENGTH = (8);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_BLOCK_CAPACITY !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_BLOCK_CAPACITY = (12);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_VALUE_DATA_DESC_IDX !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_VALUE_DATA_DESC_IDX = (16);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_LOCK_OWNER !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_LOCK_OWNER = (20);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_BD_RETIRED_EPOCH !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_BD_RETIRED_EPOCH = (24);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.SIZE_OF_INT32 !== 'undefined')){
} else {
cljs_thread.eve.data.SIZE_OF_INT32 = (4);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.SIZE_OF_BLOCK_DESCRIPTOR !== 'undefined')){
} else {
cljs_thread.eve.data.SIZE_OF_BLOCK_DESCRIPTOR = ((7) * (4));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.MINIMUM_USABLE_BLOCK_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.MINIMUM_USABLE_BLOCK_SIZE = (1);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.MAX_SWAP_RETRIES !== 'undefined')){
} else {
cljs_thread.eve.data.MAX_SWAP_RETRIES = (1000);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.WASM_SCRATCH_SIZE !== 'undefined')){
} else {
cljs_thread.eve.data.WASM_SCRATCH_SIZE = (4096);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_ATOM_ROOT_POINTER !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_ATOM_ROOT_POINTER = (16);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_ALLOCATOR_GLOBAL_LOCK !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_ALLOCATOR_GLOBAL_LOCK = (24);
}
cljs_thread.eve.data.TAG_JS_ARRAY = "js/Array";
cljs_thread.eve.data.TAG_UINT8_ARRAY = "js/Uint8Array";
cljs_thread.eve.data.TAG_INT8_ARRAY = "js/Int8Array";
cljs_thread.eve.data.TAG_UINT8_CLAMPED_ARRAY = "js/Uint8ClampedArray";
cljs_thread.eve.data.TAG_INT16_ARRAY = "js/Int16Array";
cljs_thread.eve.data.TAG_UINT16_ARRAY = "js/Uint16Array";
cljs_thread.eve.data.TAG_INT32_ARRAY = "js/Int32Array";
cljs_thread.eve.data.TAG_UINT32_ARRAY = "js/Uint32Array";
cljs_thread.eve.data.TAG_FLOAT32_ARRAY = "js/Float32Array";
cljs_thread.eve.data.TAG_FLOAT64_ARRAY = "js/Float64Array";
cljs_thread.eve.data.TAG_BIGINT64_ARRAY = "js/BigInt64Array";
cljs_thread.eve.data.TAG_BIGUINT64_ARRAY = "js/BigUint64Array";
cljs_thread.eve.data.TAG_REGEX = "regex";
cljs_thread.eve.data.TAG_URI = "uri";
cljs_thread.eve.data.TAG_CHAR = "char";
cljs_thread.eve.data.TAG_BIGINT = "bigint";
cljs_thread.eve.data.TAG_RECORD = "record";
cljs_thread.eve.data.TAG_SABP_LINKED_LIST_STATE = "eve/SabpListStateV1";
cljs_thread.eve.data.TAG_SABP_CHUNKED_LIST_STATE = "eve/SabpChunkedListV1";
cljs_thread.eve.data.TAG_SABP_CHUNKED_VEC_STATE = "eve/SabpChunkedVecV1";
cljs_thread.eve.data.TAG_SABP_MAP_STATE = "eve/SabpMapStateV1";
cljs_thread.eve.data.TAG_SABP_SET_STATE = "eve/SabpSetStateV1";
cljs_thread.eve.data.CHUNKED_LIST_CHUNK_SIZE = (32);
cljs_thread.eve.data.HAMT_BITMAP_NODE_TYPE = (3);
cljs_thread.eve.data.HAMT_COLLISION_NODE_TYPE = (4);
cljs_thread.eve.data.HAMT_BITMAP_NODE_COLUMNAR_TYPE = (6);
cljs_thread.eve.data.HAMT_BITMAP_NODE_HEADER_SIZE = (10);
cljs_thread.eve.data.HAMT_COLLISION_NODE_HEADER_SIZE = (8);
cljs_thread.eve.data.DIRECT_MAGIC_0 = (238);
cljs_thread.eve.data.DIRECT_MAGIC_1 = (219);
cljs_thread.eve.data.DIRECT_MARKER_MAP = (237);
cljs_thread.eve.data.DIRECT_MARKER_SET = (236);

/**
 * @interface
 */
cljs_thread.eve.data.IDirectSerialize = function(){};

var cljs_thread$eve$data$IDirectSerialize$_direct_serialize$dyn_21839 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.data._direct_serialize[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._direct_serialize["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IDirectSerialize.-direct-serialize",this$);
}
}
});
cljs_thread.eve.data._direct_serialize = (function cljs_thread$eve$data$_direct_serialize(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$data$IDirectSerialize$_direct_serialize$arity$1 == null)))))){
return this$.cljs_thread$eve$data$IDirectSerialize$_direct_serialize$arity$1(this$);
} else {
return cljs_thread$eve$data$IDirectSerialize$_direct_serialize$dyn_21839(this$);
}
});


/**
 * Protocol for types that can be stored in SAB data structures.
 * Replaces Fressian handler registration (raw/reg!) with protocol dispatch.
 * @interface
 */
cljs_thread.eve.data.ISabStorable = function(){};

var cljs_thread$eve$data$ISabStorable$_sab_tag$dyn_21845 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.data._sab_tag[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._sab_tag["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-tag",this$);
}
}
});
/**
 * Return a keyword tag identifying this type for deserialization.
 */
cljs_thread.eve.data._sab_tag = (function cljs_thread$eve$data$_sab_tag(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$data$ISabStorable$_sab_tag$arity$1 == null)))))){
return this$.cljs_thread$eve$data$ISabStorable$_sab_tag$arity$1(this$);
} else {
return cljs_thread$eve$data$ISabStorable$_sab_tag$dyn_21845(this$);
}
});

var cljs_thread$eve$data$ISabStorable$_sab_encode$dyn_21848 = (function (this$,s_atom_env){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.data._sab_encode[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,s_atom_env) : m__5394__auto__.call(null, this$,s_atom_env));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._sab_encode["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,s_atom_env) : m__5392__auto__.call(null, this$,s_atom_env));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-encode",this$);
}
}
});
/**
 * Encode this value into a Uint8Array for storage in SAB.
 *   May allocate SAB blocks for nested structures.
 *   Returns bytes using the fast-path format.
 */
cljs_thread.eve.data._sab_encode = (function cljs_thread$eve$data$_sab_encode(this$,s_atom_env){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$data$ISabStorable$_sab_encode$arity$2 == null)))))){
return this$.cljs_thread$eve$data$ISabStorable$_sab_encode$arity$2(this$,s_atom_env);
} else {
return cljs_thread$eve$data$ISabStorable$_sab_encode$dyn_21848(this$,s_atom_env);
}
});

var cljs_thread$eve$data$ISabStorable$_sab_dispose$dyn_21851 = (function (this$,s_atom_env){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.data._sab_dispose[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,s_atom_env) : m__5394__auto__.call(null, this$,s_atom_env));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._sab_dispose["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,s_atom_env) : m__5392__auto__.call(null, this$,s_atom_env));
} else {
throw cljs.core.missing_protocol("ISabStorable.-sab-dispose",this$);
}
}
});
/**
 * Free any SAB resources owned by this value.
 *   Called during tree-walk freeing. No-op for types without SAB allocations.
 */
cljs_thread.eve.data._sab_dispose = (function cljs_thread$eve$data$_sab_dispose(this$,s_atom_env){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$data$ISabStorable$_sab_dispose$arity$2 == null)))))){
return this$.cljs_thread$eve$data$ISabStorable$_sab_dispose$arity$2(this$,s_atom_env);
} else {
return cljs_thread$eve$data$ISabStorable$_sab_dispose$dyn_21851(this$,s_atom_env);
}
});


/**
 * Protocol for SAB-backed types that support tree-diff retirement.
 * Used by atom swap to retire replaced nodes after a successful CAS.
 * @interface
 */
cljs_thread.eve.data.ISabRetirable = function(){};

var cljs_thread$eve$data$ISabRetirable$_sab_retire_diff_BANG_$dyn_21853 = (function (old_value,new_value,s_atom_env,mode){
var x__5393__auto__ = (((old_value == null))?null:old_value);
var m__5394__auto__ = (cljs_thread.eve.data._sab_retire_diff_BANG_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$4(old_value,new_value,s_atom_env,mode) : m__5394__auto__.call(null, old_value,new_value,s_atom_env,mode));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._sab_retire_diff_BANG_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$4(old_value,new_value,s_atom_env,mode) : m__5392__auto__.call(null, old_value,new_value,s_atom_env,mode));
} else {
throw cljs.core.missing_protocol("ISabRetirable.-sab-retire-diff!",old_value);
}
}
});
/**
 * Retire nodes in old-value's tree that are not shared with new-value's tree.
 *   mode: :retire (epoch-based, multi-worker) or :free (immediate).
 *   new-value may be nil or a different type, in which case dispose the entire old tree.
 */
cljs_thread.eve.data._sab_retire_diff_BANG_ = (function cljs_thread$eve$data$_sab_retire_diff_BANG_(old_value,new_value,s_atom_env,mode){
if((((!((old_value == null)))) && ((!((old_value.cljs_thread$eve$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 == null)))))){
return old_value.cljs_thread$eve$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4(old_value,new_value,s_atom_env,mode);
} else {
return cljs_thread$eve$data$ISabRetirable$_sab_retire_diff_BANG_$dyn_21853(old_value,new_value,s_atom_env,mode);
}
});

cljs_thread.eve.data.OFFSET_LL_NODE_VALUE = (0);
cljs_thread.eve.data.LL_NODE_NEXT_OFFSET_SIZE_BYTES = (4);

/**
 * @interface
 */
cljs_thread.eve.data.ISabpType = function(){};

var cljs_thread$eve$data$ISabpType$_sabp_type_key$dyn_21855 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.eve.data._sabp_type_key[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.eve.data._sabp_type_key["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("ISabpType.-sabp-type-key",this$);
}
}
});
/**
 * Returns the string key used for registering this SAB-P type.
 */
cljs_thread.eve.data._sabp_type_key = (function cljs_thread$eve$data$_sabp_type_key(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$eve$data$ISabpType$_sabp_type_key$arity$1 == null)))))){
return this$.cljs_thread$eve$data$ISabpType$_sabp_type_key$arity$1(this$);
} else {
return cljs_thread$eve$data$ISabpType$_sabp_type_key$dyn_21855(this$);
}
});

if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.sabp_cleanup_fns !== 'undefined')){
} else {
cljs_thread.eve.data.sabp_cleanup_fns = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
cljs_thread.eve.data.register_sabp_cleanup_BANG_ = (function cljs_thread$eve$data$register_sabp_cleanup_BANG_(type_key_str,cleanup_fn){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.eve.data.sabp_cleanup_fns,cljs.core.assoc,type_key_str,cleanup_fn);
});
cljs_thread.eve.data.get_sabp_cleanup_fn = (function cljs_thread$eve$data$get_sabp_cleanup_fn(type_key_str){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.eve.data.sabp_cleanup_fns),type_key_str);
});
cljs_thread.eve.data._STAR_persistent_QMARK__STAR_ = true;
cljs_thread.eve.data._STAR_parent_atom_STAR_ = null;
cljs_thread.eve.data._STAR_worker_id_STAR_ = null;
cljs_thread.eve.data._STAR_worker_slot_idx_STAR_ = null;
cljs_thread.eve.data._STAR_read_epoch_STAR_ = null;
cljs_thread.eve.data._STAR_use_flat_hashtable_STAR_ = false;
cljs_thread.eve.data._STAR_parallel_reduce_STAR_ = false;
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.READER_MAP_NUM_COUNTERS !== 'undefined')){
} else {
cljs_thread.eve.data.READER_MAP_NUM_COUNTERS = (65536);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.READER_MAP_TOTAL_SIZE_BYTES !== 'undefined')){
} else {
cljs_thread.eve.data.READER_MAP_TOTAL_SIZE_BYTES = ((65536) * (4));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.OFFSET_READER_MAP_START !== 'undefined')){
} else {
cljs_thread.eve.data.OFFSET_READER_MAP_START = cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START;
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.data !== 'undefined') && (typeof cljs_thread.eve.data.READER_MAP_SAB_SIZE_BYTES !== 'undefined')){
} else {
cljs_thread.eve.data.READER_MAP_SAB_SIZE_BYTES = ((65536) * (4));
}

//# sourceMappingURL=cljs_thread.eve.data.js.map
