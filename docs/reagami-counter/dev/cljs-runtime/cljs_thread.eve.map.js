goog.provide('cljs_thread.eve.map');




cljs_thread.eve.map.SHIFT_STEP = (5);
cljs_thread.eve.map.MASK = (31);
cljs_thread.eve.map.NODE_TYPE_BITMAP = (1);
cljs_thread.eve.map.NODE_TYPE_COLLISION = (3);
cljs_thread.eve.map.NODE_HEADER_SIZE = (12);
cljs_thread.eve.map.COLLISION_HEADER_SIZE = (8);
cljs_thread.eve.map.EveHashMap_type_id = (237);
cljs_thread.eve.map.SABMAPROOT_CNT_OFFSET = (4);
cljs_thread.eve.map.SABMAPROOT_ROOT_OFF_OFFSET = (8);
cljs_thread.eve.map.MAX_POOL_SIZE = (512);
cljs_thread.eve.map.BATCH_ALLOC_SIZE = (64);
cljs_thread.eve.map.size_class_for = (function cljs_thread$eve$map$size_class_for(n){
if((n <= (64))){
return (64);
} else {
if((n <= (128))){
return (128);
} else {
if((n <= (256))){
return (256);
} else {
if((n <= (512))){
return (512);
} else {
return null;

}
}
}
}
});
cljs_thread.eve.map.pool_64 = [];
cljs_thread.eve.map.pool_128 = [];
cljs_thread.eve.map.pool_256 = [];
cljs_thread.eve.map.pool_512 = [];
cljs_thread.eve.map.reset_pools_BANG_ = (function cljs_thread$eve$map$reset_pools_BANG_(){
(cljs_thread.eve.map.pool_64 = []);

(cljs_thread.eve.map.pool_128 = []);

(cljs_thread.eve.map.pool_256 = []);

return (cljs_thread.eve.map.pool_512 = []);
});
cljs_thread.eve.map.drain_pools_BANG_ = (function cljs_thread$eve$map$drain_pools_BANG_(){
var seq__24930_26035 = cljs.core.seq(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.map.pool_64,cljs_thread.eve.map.pool_128,cljs_thread.eve.map.pool_256,cljs_thread.eve.map.pool_512], null));
var chunk__24931_26036 = null;
var count__24932_26037 = (0);
var i__24933_26038 = (0);
while(true){
if((i__24933_26038 < count__24932_26037)){
var pool_26039 = chunk__24931_26036.cljs$core$IIndexed$_nth$arity$2(null, i__24933_26038);
var n__5636__auto___26040 = pool_26039.length;
var i_26041 = (0);
while(true){
if((i_26041 < n__5636__auto___26040)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_26039[i_26041]));

var G__26042 = (i_26041 + (1));
i_26041 = G__26042;
continue;
} else {
}
break;
}


var G__26043 = seq__24930_26035;
var G__26044 = chunk__24931_26036;
var G__26045 = count__24932_26037;
var G__26046 = (i__24933_26038 + (1));
seq__24930_26035 = G__26043;
chunk__24931_26036 = G__26044;
count__24932_26037 = G__26045;
i__24933_26038 = G__26046;
continue;
} else {
var temp__5823__auto___26047 = cljs.core.seq(seq__24930_26035);
if(temp__5823__auto___26047){
var seq__24930_26048__$1 = temp__5823__auto___26047;
if(cljs.core.chunked_seq_QMARK_(seq__24930_26048__$1)){
var c__5568__auto___26051 = cljs.core.chunk_first(seq__24930_26048__$1);
var G__26052 = cljs.core.chunk_rest(seq__24930_26048__$1);
var G__26053 = c__5568__auto___26051;
var G__26054 = cljs.core.count(c__5568__auto___26051);
var G__26055 = (0);
seq__24930_26035 = G__26052;
chunk__24931_26036 = G__26053;
count__24932_26037 = G__26054;
i__24933_26038 = G__26055;
continue;
} else {
var pool_26056 = cljs.core.first(seq__24930_26048__$1);
var n__5636__auto___26057 = pool_26056.length;
var i_26058 = (0);
while(true){
if((i_26058 < n__5636__auto___26057)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_26056[i_26058]));

var G__26060 = (i_26058 + (1));
i_26058 = G__26060;
continue;
} else {
}
break;
}


var G__26061 = cljs.core.next(seq__24930_26048__$1);
var G__26062 = null;
var G__26063 = (0);
var G__26064 = (0);
seq__24930_26035 = G__26061;
chunk__24931_26036 = G__26062;
count__24932_26037 = G__26063;
i__24933_26038 = G__26064;
continue;
}
} else {
}
}
break;
}

(cljs_thread.eve.map.pool_64 = []);

(cljs_thread.eve.map.pool_128 = []);

(cljs_thread.eve.map.pool_256 = []);

return (cljs_thread.eve.map.pool_512 = []);
});
cljs_thread.eve.map.pool_debug_QMARK_ = false;
cljs_thread.eve.map.pool_disabled_QMARK_ = false;
cljs_thread.eve.map.pool_get_BANG_ = (function cljs_thread$eve$map$pool_get_BANG_(size_class){
if(cljs_thread.eve.map.pool_disabled_QMARK_){
return null;
} else {
var stack = (function (){var G__24964 = size_class;
switch (G__24964) {
case (64):
return cljs_thread.eve.map.pool_64;

break;
case (128):
return cljs_thread.eve.map.pool_128;

break;
case (256):
return cljs_thread.eve.map.pool_256;

break;
case (512):
return cljs_thread.eve.map.pool_512;

break;
default:
return null;

}
})();
if(cljs.core.truth_((function (){var and__5043__auto__ = stack;
if(cljs.core.truth_(and__5043__auto__)){
return (stack.length > (0));
} else {
return and__5043__auto__;
}
})())){
var offset = stack.pop();
if(cljs_thread.eve.map.pool_debug_QMARK_){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["POOL-GET:",size_class,"\u2192",offset], 0));
} else {
}

cljs_thread.eve.deftype_proto.xray.track_check_pool_get_BANG_(offset);

return offset;
} else {
return null;
}
}
});
cljs_thread.eve.map.enable_pool_debug_BANG_ = (function cljs_thread$eve$map$enable_pool_debug_BANG_(){
return (cljs_thread.eve.map.pool_debug_QMARK_ = true);
});
cljs_thread.eve.map.disable_pool_debug_BANG_ = (function cljs_thread$eve$map$disable_pool_debug_BANG_(){
return (cljs_thread.eve.map.pool_debug_QMARK_ = false);
});
cljs_thread.eve.map.enable_pool_BANG_ = (function cljs_thread$eve$map$enable_pool_BANG_(){
return (cljs_thread.eve.map.pool_disabled_QMARK_ = false);
});
cljs_thread.eve.map.disable_pool_BANG_ = (function cljs_thread$eve$map$disable_pool_BANG_(){
return (cljs_thread.eve.map.pool_disabled_QMARK_ = true);
});
cljs_thread.eve.map.enable_pool_track_BANG_ = (function cljs_thread$eve$map$enable_pool_track_BANG_(){
return cljs_thread.eve.deftype_proto.xray.enable_pool_tracking_BANG_();
});
cljs_thread.eve.map.disable_pool_track_BANG_ = (function cljs_thread$eve$map$disable_pool_track_BANG_(){
return cljs_thread.eve.deftype_proto.xray.disable_pool_tracking_BANG_();
});
cljs_thread.eve.map.pool_put_BANG_ = (function cljs_thread$eve$map$pool_put_BANG_(size_class,slab_offset){
var stack = (function (){var G__25042 = size_class;
switch (G__25042) {
case (64):
return cljs_thread.eve.map.pool_64;

break;
case (128):
return cljs_thread.eve.map.pool_128;

break;
case (256):
return cljs_thread.eve.map.pool_256;

break;
case (512):
return cljs_thread.eve.map.pool_512;

break;
default:
return null;

}
})();
if(cljs.core.truth_((function (){var and__5043__auto__ = stack;
if(cljs.core.truth_(and__5043__auto__)){
return (stack.length < (512));
} else {
return and__5043__auto__;
}
})())){
if(cljs_thread.eve.map.pool_debug_QMARK_){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["POOL-PUT:",size_class,"\u2190",slab_offset], 0));
} else {
}

stack.push(slab_offset);

return true;
} else {
return null;
}
});
cljs_thread.eve.map.alloc_debug_set = null;
/**
 * Allocate n bytes, rounded up to nearest size class.
 * Returns a slab-qualified offset.
 */
cljs_thread.eve.map.alloc_bytes_BANG_ = (function cljs_thread$eve$map$alloc_bytes_BANG_(n){
if((cljs_thread.eve.map.alloc_debug_set == null)){
(cljs_thread.eve.map.alloc_debug_set = (new Set()));
} else {
}

var size_class = cljs_thread.eve.map.size_class_for(n);
if(cljs.core.truth_(size_class)){
var temp__5821__auto__ = cljs_thread.eve.map.pool_get_BANG_(size_class);
if(cljs.core.truth_(temp__5821__auto__)){
var pooled = temp__5821__auto__;
if(cljs.core.truth_(cljs_thread.eve.map.alloc_debug_set.has(pooled))){
throw (new Error(["[alloc-bytes! POOL] DOUBLE-ALLOC! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pooled)," size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
}

cljs_thread.eve.map.alloc_debug_set.add(pooled);

cljs_thread.eve.deftype_proto.xray.track_allocate_BANG_(pooled);

return pooled;
} else {
var results = cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(64));
var results__$1 = (cljs.core.truth_((function (){var and__5043__auto__ = results;
if(cljs.core.truth_(and__5043__auto__)){
return (results.length > (0));
} else {
return and__5043__auto__;
}
})())?results:(function (){
cljs_thread.eve.map.drain_pools_BANG_();

return cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(64));
})()
);
var len = (cljs.core.truth_(results__$1)?results__$1.length:(0));
if((len === (0))){
throw (new Error(["Slab map alloc failed: out of memory for ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_class)," bytes"].join('')));
} else {
}

var i_26067 = (1);
while(true){
if((i_26067 < len)){
cljs_thread.eve.map.pool_put_BANG_(size_class,(results__$1[i_26067]));

var G__26068 = (i_26067 + (1));
i_26067 = G__26068;
continue;
} else {
}
break;
}

var first_off = (results__$1[(0)]);
if(cljs.core.truth_(cljs_thread.eve.map.alloc_debug_set.has(first_off))){
throw (new Error(["[alloc-bytes! BATCH] DOUBLE-ALLOC! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(first_off)," size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
}

cljs_thread.eve.map.alloc_debug_set.add(first_off);

cljs_thread.eve.deftype_proto.xray.track_allocate_BANG_(first_off);

return first_off;
}
} else {
var off = cljs_thread.eve.deftype_proto.alloc.alloc_offset(n);
cljs_thread.eve.deftype_proto.xray.track_allocate_BANG_(off);

return off;
}
});
/**
 * Try to add a freed block to the pool. If pool is full, actually free it.
 */
cljs_thread.eve.map.maybe_pool_or_free_BANG_ = (function cljs_thread$eve$map$maybe_pool_or_free_BANG_(slab_offset,size){
cljs_thread.eve.deftype_proto.xray.track_recycle_BANG_(slab_offset);

if(cljs.core.truth_(cljs_thread.eve.map.alloc_debug_set)){
cljs_thread.eve.map.alloc_debug_set.delete(slab_offset);
} else {
}

var size_class = cljs_thread.eve.map.size_class_for(size);
if(cljs.core.truth_((function (){var and__5043__auto__ = size_class;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.eve.map.pool_put_BANG_(size_class,slab_offset);
} else {
return and__5043__auto__;
}
})())){
return true;
} else {
cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_offset);

return null;
}
});
cljs_thread.eve.map.popcount32 = (function cljs_thread$eve$map$popcount32(n){
var n__$1 = ((n & (4294967295)) - ((n >>> (1)) & (1431655765)));
var n__$2 = ((n__$1 & (858993459)) + ((n__$1 >>> (2)) & (858993459)));
var n__$3 = ((n__$2 + (n__$2 >>> (4))) & (252645135));
return ((n__$3 * 0x01010101) >>> (24));
});
cljs_thread.eve.map.mask_hash = (function cljs_thread$eve$map$mask_hash(kh,shift){
return ((kh >>> shift) & (31));
});
cljs_thread.eve.map.bitpos = (function cljs_thread$eve$map$bitpos(kh,shift){
return ((1) << cljs_thread.eve.map.mask_hash(kh,shift));
});
cljs_thread.eve.map.has_bit_QMARK_ = (function cljs_thread$eve$map$has_bit_QMARK_(bitmap,bit){
return (!(((bitmap & bit) === (0))));
});
cljs_thread.eve.map.get_index = (function cljs_thread$eve$map$get_index(bitmap,bit){
return cljs_thread.eve.map.popcount32((bitmap & (bit - (1))));
});
/**
 * Read node type byte from a slab-qualified offset.
 */
cljs_thread.eve.map.read_node_type = (function cljs_thread$eve$map$read_node_type(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8(base);
});
/**
 * Read data bitmap (u32 at offset+4).
 */
cljs_thread.eve.map.read_data_bitmap = (function cljs_thread$eve$map$read_data_bitmap(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
});
/**
 * Read node bitmap (u32 at offset+8).
 */
cljs_thread.eve.map.read_node_bitmap = (function cljs_thread$eve$map$read_node_bitmap(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
});
/**
 * Read child pointer (i32) at child-idx within a node.
 * The child pointer is itself a slab-qualified offset.
 */
cljs_thread.eve.map.read_child_offset = (function cljs_thread$eve$map$read_child_offset(slab_off,child_idx){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32(((base + (12)) + (child_idx * (4))),true);
});
/**
 * Read cached kv-total-size from header bytes 2-3.
 */
cljs_thread.eve.map.read_kv_total_size = (function cljs_thread$eve$map$read_kv_total_size(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint16((base + (2)),true);
});
/**
 * Byte offset within node where hash array starts (after children).
 */
cljs_thread.eve.map.hashes_start_off = (function cljs_thread$eve$map$hashes_start_off(node_bm){
return ((12) + ((4) * cljs_thread.eve.map.popcount32(node_bm)));
});
/**
 * Byte offset within node where KV data starts.
 */
cljs_thread.eve.map.kv_data_start_off = (function cljs_thread$eve$map$kv_data_start_off(data_bm,node_bm){
return (((12) + ((4) * cljs_thread.eve.map.popcount32(node_bm))) + ((4) * cljs_thread.eve.map.popcount32(data_bm)));
});
cljs_thread.eve.map.r_get_u8 = (function cljs_thread$eve$map$r_get_u8(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off));
});
cljs_thread.eve.map.r_get_u16 = (function cljs_thread$eve$map$r_get_u16(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint16((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.map.r_get_u32 = (function cljs_thread$eve$map$r_get_u32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.map.r_get_i32 = (function cljs_thread$eve$map$r_get_i32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.map.r_set_u8 = (function cljs_thread$eve$map$r_set_u8(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val);
});
cljs_thread.eve.map.r_set_u16 = (function cljs_thread$eve$map$r_set_u16(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint16((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.map.r_set_u32 = (function cljs_thread$eve$map$r_set_u32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.map.r_set_i32 = (function cljs_thread$eve$map$r_set_i32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
/**
 * Skip a KV pair at resolved position, returning offset-within-node after it.
 */
cljs_thread.eve.map.skip_kv_at = (function cljs_thread$eve$map$skip_kv_at(pos_in_node){
var key_len = cljs_thread.eve.map.r_get_u32(pos_in_node);
var val_off = ((pos_in_node + (4)) + key_len);
var val_len = cljs_thread.eve.map.r_get_u32(val_off);
return ((val_off + (4)) + val_len);
});
cljs_thread.eve.map.calc_kv_size = (function cljs_thread$eve$map$calc_kv_size(key_bytes,val_bytes){
return ((((4) + key_bytes.length) + (4)) + val_bytes.length);
});
/**
 * Compare serialized key bytes at a resolved position with kb.
 * Must call resolve-u8! for the target node before calling this.
 */
cljs_thread.eve.map.key_bytes_match_QMARK_ = (function cljs_thread$eve$map$key_bytes_match_QMARK_(pos_in_node,kb){
var stored_len = cljs_thread.eve.map.r_get_u32(pos_in_node);
if((stored_len === kb.length)){
var start = ((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos_in_node) + (4));
var u8 = cljs_thread.eve.deftype_proto.alloc.resolved_u8;
var i = (0);
while(true){
if((i >= stored_len)){
return true;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((u8[(start + i)]),(kb[i]))){
return false;
} else {
var G__26072 = (i + (1));
i = G__26072;
continue;
}
}
break;
}
} else {
return null;
}
});
/**
 * Write a KV pair at pos-in-node within a resolved node.
 * Returns offset-within-node after written data.
 */
cljs_thread.eve.map.write_kv_BANG_ = (function cljs_thread$eve$map$write_kv_BANG_(pos_in_node,key_bytes,val_bytes){
cljs_thread.eve.map.r_set_u32(pos_in_node,key_bytes.length);

if((key_bytes.length > (0))){
var dst_start_26073 = ((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos_in_node) + (4));
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(key_bytes,dst_start_26073);
} else {
}

var val_off = ((pos_in_node + (4)) + key_bytes.length);
cljs_thread.eve.map.r_set_u32(val_off,val_bytes.length);

if((val_bytes.length > (0))){
var dst_start_26074 = ((cljs_thread.eve.deftype_proto.alloc.resolved_base + val_off) + (4));
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(val_bytes,dst_start_26074);
} else {
}

return ((val_off + (4)) + val_bytes.length);
});
/**
 * Copy bytes from a slab-qualified offset + byte-within-block into a new Uint8Array.
 */
cljs_thread.eve.map.copy_from_sab = (function cljs_thread$eve$map$copy_from_sab(slab_off,byte_off,len){
var src = cljs_thread.eve.deftype_proto.alloc.read_bytes(slab_off,byte_off,len);
var dst = (new Uint8Array(len));
dst.set(src);

return dst;
});
/**
 * Create bitmap node with exactly 1 data entry and 0 children.
 */
cljs_thread.eve.map.make_single_entry_node_BANG_ = (function cljs_thread$eve$map$make_single_entry_node_BANG_(data_bm,kh,kb,vb){
var kv_size = cljs_thread.eve.map.calc_kv_size(kb,vb);
var node_size = (((12) + (4)) + kv_size);
var slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),kv_size);

cljs_thread.eve.map.r_set_u32((4),data_bm);

cljs_thread.eve.map.r_set_u32((8),(0));

cljs_thread.eve.map.r_set_i32((12),kh);

cljs_thread.eve.map.write_kv_BANG_(((12) + (4)),kb,vb);

return slab_off;
});
/**
 * Create bitmap node with exactly 2 data entries and 0 children.
 */
cljs_thread.eve.map.make_two_entry_node_BANG_ = (function cljs_thread$eve$map$make_two_entry_node_BANG_(data_bm,kh1,kb1,vb1,kh2,kb2,vb2){
var kv_size = (cljs_thread.eve.map.calc_kv_size(kb1,vb1) + cljs_thread.eve.map.calc_kv_size(kb2,vb2));
var node_size = (((12) + (8)) + kv_size);
var slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),kv_size);

cljs_thread.eve.map.r_set_u32((4),data_bm);

cljs_thread.eve.map.r_set_u32((8),(0));

cljs_thread.eve.map.r_set_i32((12),kh1);

cljs_thread.eve.map.r_set_i32(((12) + (4)),kh2);

var next_pos_26075 = cljs_thread.eve.map.write_kv_BANG_(((12) + (8)),kb1,vb1);
cljs_thread.eve.map.write_kv_BANG_(next_pos_26075,kb2,vb2);

return slab_off;
});
/**
 * Create bitmap node with 0 data entries and 1 child.
 */
cljs_thread.eve.map.make_single_child_node_BANG_ = (function cljs_thread$eve$map$make_single_child_node_BANG_(node_bm,child_off){
var node_size = ((12) + (4));
var slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
if((slab_off === child_off)){
throw (new Error(["[make-single-child-node!] SELF-REF! slab-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," child-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(child_off)].join('')));
} else {
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),(0));

cljs_thread.eve.map.r_set_u32((4),(0));

cljs_thread.eve.map.r_set_u32((8),node_bm);

cljs_thread.eve.map.r_set_i32((12),child_off);

return slab_off;
});
/**
 * Create bitmap node with 1 data entry and 1 child.
 */
cljs_thread.eve.map.make_child_and_entry_node_BANG_ = (function cljs_thread$eve$map$make_child_and_entry_node_BANG_(data_bm,node_bm,child_off,kh,kb,vb){
var kv_size = cljs_thread.eve.map.calc_kv_size(kb,vb);
var node_size = ((((12) + (4)) + (4)) + kv_size);
var slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
if((slab_off === child_off)){
throw (new Error(["[make-child-and-entry-node!] SELF-REF! slab-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," child-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(child_off)].join('')));
} else {
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),kv_size);

cljs_thread.eve.map.r_set_u32((4),data_bm);

cljs_thread.eve.map.r_set_u32((8),node_bm);

cljs_thread.eve.map.r_set_i32((12),child_off);

cljs_thread.eve.map.r_set_i32(((12) + (4)),kh);

cljs_thread.eve.map.write_kv_BANG_(((12) + (8)),kb,vb);

return slab_off;
});
/**
 * Create bitmap node, copying data from src node.
 * If update-child-idx >= 0, replaces that child with new-child-off.
 * src-slab-off and the new node may be in different slabs.
 */
cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_ = (function cljs_thread$eve$map$make_bitmap_node_with_raw_kv_BANG_(var_args){
var G__25374 = arguments.length;
switch (G__25374) {
case 5:
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 7:
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm){
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm,(-1),(-1));
}));

(cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7 = (function (data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm,update_child_idx,new_child_off){
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var existing_kv_size = (function (){var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint16((base + (2)),true);
})();
var existing_kv_size__$1 = (((existing_kv_size > (0)))?existing_kv_size:(function (){var base = cljs_thread.eve.deftype_proto.alloc.resolved_base;
var kv_start_off = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var dc = cljs_thread.eve.map.popcount32(src_data_bm);
var i = (0);
var pos = kv_start_off;
while(true){
if((i >= dc)){
return (pos - kv_start_off);
} else {
var G__26077 = (i + (1));
var G__26078 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26077;
pos = G__26078;
continue;
}
break;
}
})());
var node_size = ((((12) + ((4) * child_count)) + ((4) * data_count)) + existing_kv_size__$1);
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.copy_block_BANG_(dst_slab_off,src_slab_off,node_size);

if((update_child_idx >= (0))){
if((dst_slab_off === new_child_off)){
throw (new Error(["[make-bitmap-node-with-raw-kv!] SELF-REF! dst=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(dst_slab_off)," child=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_child_off)].join('')));
} else {
}

cljs_thread.eve.deftype_proto.alloc.write_i32_BANG_(dst_slab_off,((12) + (update_child_idx * (4))),new_child_off);
} else {
}

return dst_slab_off;
}));

(cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$lang$maxFixedArity = 7);

/**
 * Add a new KV entry to a bitmap node. Returns new slab-qualified offset.
 */
cljs_thread.eve.map.make_bitmap_node_with_added_kv_BANG_ = (function cljs_thread$eve$map$make_bitmap_node_with_added_kv_BANG_(new_data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm,data_idx,kh,kb,vb){
var kv_size = cljs_thread.eve.map.calc_kv_size(kb,vb);
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var new_data_count = cljs_thread.eve.map.popcount32(new_data_bm);
var src_base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);
var existing_kv_size = (function (){var cached = cljs_thread.eve.map.r_get_u16((2));
if((cached > (0))){
return cached;
} else {
var dc = cljs_thread.eve.map.popcount32(src_data_bm);
var kv_s = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var i = (0);
var pos = kv_s;
while(true){
if((i >= dc)){
return (pos - kv_s);
} else {
var G__26079 = (i + (1));
var G__26080 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26079;
pos = G__26080;
continue;
}
break;
}
}
})();
var total_kv_size = (existing_kv_size + kv_size);
var node_size = ((((12) + ((4) * child_count)) + ((4) * new_data_count)) + total_kv_size);
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),total_kv_size);

cljs_thread.eve.map.r_set_u32((4),new_data_bm);

cljs_thread.eve.map.r_set_u32((8),node_bm);

var n__5636__auto___26081 = child_count;
var i_26082 = (0);
while(true){
if((i_26082 < n__5636__auto___26081)){
var child_26083 = cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_26082 * (4))));
cljs_thread.eve.map.r_set_i32(((12) + (i_26082 * (4))),child_26083);

var G__26084 = (i_26082 + (1));
i_26082 = G__26084;
continue;
} else {
}
break;
}

var src_h_off_26085 = cljs_thread.eve.map.hashes_start_off(src_node_bm);
var dst_h_off_26086 = cljs_thread.eve.map.hashes_start_off(node_bm);
var old_data_count_26087 = cljs_thread.eve.map.popcount32(src_data_bm);
var src_i_26088 = (0);
var dst_i_26089 = (0);
while(true){
if((dst_i_26089 < new_data_count)){
if((dst_i_26089 === data_idx)){
cljs_thread.eve.map.r_set_i32((dst_h_off_26086 + (dst_i_26089 * (4))),kh);

var G__26092 = src_i_26088;
var G__26093 = (dst_i_26089 + (1));
src_i_26088 = G__26092;
dst_i_26089 = G__26093;
continue;
} else {
cljs_thread.eve.map.r_set_i32((dst_h_off_26086 + (dst_i_26089 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,(src_h_off_26085 + (src_i_26088 * (4)))));

var G__26094 = (src_i_26088 + (1));
var G__26095 = (dst_i_26089 + (1));
src_i_26088 = G__26094;
dst_i_26089 = G__26095;
continue;
}
} else {
}
break;
}

var src_kv_off_26096 = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var dst_kv_off_26097 = cljs_thread.eve.map.kv_data_start_off(new_data_bm,node_bm);
var old_data_count_26098 = cljs_thread.eve.map.popcount32(src_data_bm);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_positions_26099 = (function (){var i = (0);
var pos = src_kv_off_26096;
var acc = [];
while(true){
if((i >= old_data_count_26098)){
return acc;
} else {
var next = cljs_thread.eve.map.skip_kv_at(pos);
acc.push([pos,(next - pos)]);

var G__26100 = (i + (1));
var G__26101 = next;
var G__26102 = acc;
i = G__26100;
pos = G__26101;
acc = G__26102;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var src_i_26103 = (0);
var dst_i_26104 = (0);
var dst_pos_26105 = dst_kv_off_26097;
while(true){
if((dst_i_26104 < (old_data_count_26098 + (1)))){
if((dst_i_26104 === data_idx)){
var next_pos_26106 = cljs_thread.eve.map.write_kv_BANG_(dst_pos_26105,kb,vb);
var G__26107 = src_i_26103;
var G__26108 = (dst_i_26104 + (1));
var G__26109 = next_pos_26106;
src_i_26103 = G__26107;
dst_i_26104 = G__26108;
dst_pos_26105 = G__26109;
continue;
} else {
var entry_26110 = (src_positions_26099[src_i_26103]);
var src_pos_26111 = (entry_26110[(0)]);
var kv_len_26112 = (entry_26110[(1)]);
var src_bytes_26113 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_26111,kv_len_26112);
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_26113,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_26105));

var G__26114 = (src_i_26103 + (1));
var G__26115 = (dst_i_26104 + (1));
var G__26116 = (dst_pos_26105 + kv_len_26112);
src_i_26103 = G__26114;
dst_i_26104 = G__26115;
dst_pos_26105 = G__26116;
continue;
}
} else {
}
break;
}

return dst_slab_off;
});
/**
 * Replace a KV entry in a bitmap node. Returns new slab-qualified offset.
 */
cljs_thread.eve.map.make_bitmap_node_with_replaced_kv_BANG_ = (function cljs_thread$eve$map$make_bitmap_node_with_replaced_kv_BANG_(data_bm,node_bm,src_slab_off,src_node_bm,data_idx,kh,kb,vb,src_pos_in_node){
var new_kv_size = cljs_thread.eve.map.calc_kv_size(kb,vb);
var src_base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);
var old_key_len = cljs_thread.eve.map.r_get_u32(src_pos_in_node);
var old_val_off = ((src_pos_in_node + (4)) + old_key_len);
var old_val_len = cljs_thread.eve.map.r_get_u32(old_val_off);
var old_kv_size = ((((4) + old_key_len) + (4)) + old_val_len);
var size_diff = (new_kv_size - old_kv_size);
var existing_kv_size = (function (){var cached = cljs_thread.eve.map.r_get_u16((2));
if((cached > (0))){
return cached;
} else {
var dc = cljs_thread.eve.map.popcount32(data_bm);
var kv_s = cljs_thread.eve.map.kv_data_start_off(data_bm,src_node_bm);
var i = (0);
var pos = kv_s;
while(true){
if((i >= dc)){
return (pos - kv_s);
} else {
var G__26118 = (i + (1));
var G__26119 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26118;
pos = G__26119;
continue;
}
break;
}
}
})();
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var node_size = (((((12) + ((4) * child_count)) + ((4) * data_count)) + existing_kv_size) + size_diff);
if((size_diff === (0))){
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.copy_block_BANG_(dst_slab_off,src_slab_off,node_size);

var val_off_26120 = ((src_pos_in_node + (4)) + old_key_len);
cljs_thread.eve.deftype_proto.alloc.write_i32_BANG_(dst_slab_off,val_off_26120,vb.length);

cljs_thread.eve.deftype_proto.alloc.write_bytes_BANG_(dst_slab_off,(val_off_26120 + (4)),vb);

var h_off_26122 = (cljs_thread.eve.map.hashes_start_off(node_bm) + (data_idx * (4)));
cljs_thread.eve.deftype_proto.alloc.write_i32_BANG_(dst_slab_off,h_off_26122,kh);

return dst_slab_off;
} else {
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),(existing_kv_size + size_diff));

cljs_thread.eve.map.r_set_u32((4),data_bm);

cljs_thread.eve.map.r_set_u32((8),node_bm);

var n__5636__auto___26123 = child_count;
var i_26124 = (0);
while(true){
if((i_26124 < n__5636__auto___26123)){
cljs_thread.eve.map.r_set_i32(((12) + (i_26124 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_26124 * (4)))));

var G__26125 = (i_26124 + (1));
i_26124 = G__26125;
continue;
} else {
}
break;
}

var h_off_26126 = cljs_thread.eve.map.hashes_start_off(node_bm);
var n__5636__auto___26127 = data_count;
var i_26128 = (0);
while(true){
if((i_26128 < n__5636__auto___26127)){
cljs_thread.eve.map.r_set_i32((h_off_26126 + (i_26128 * (4))),(((i_26128 === data_idx))?kh:cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,(h_off_26126 + (i_26128 * (4))))));

var G__26129 = (i_26128 + (1));
i_26128 = G__26129;
continue;
} else {
}
break;
}

var src_kv_off_26130 = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var dst_kv_off_26131 = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var positions_26132 = (function (){var i = (0);
var pos = src_kv_off_26130;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.map.skip_kv_at(pos);
acc.push([pos,(next - pos)]);

var G__26133 = (i + (1));
var G__26134 = next;
var G__26135 = acc;
i = G__26133;
pos = G__26134;
acc = G__26135;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var i_26136 = (0);
var dst_pos_26137 = dst_kv_off_26131;
while(true){
if((i_26136 < data_count)){
if((i_26136 === data_idx)){
var next_pos_26138 = cljs_thread.eve.map.write_kv_BANG_(dst_pos_26137,kb,vb);
var G__26139 = (i_26136 + (1));
var G__26140 = next_pos_26138;
i_26136 = G__26139;
dst_pos_26137 = G__26140;
continue;
} else {
var entry_26141 = (positions_26132[i_26136]);
var src_pos_26142 = (entry_26141[(0)]);
var kv_len_26143 = (entry_26141[(1)]);
var src_bytes_26144 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_26142,kv_len_26143);
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_26144,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_26137));

var G__26145 = (i_26136 + (1));
var G__26146 = (dst_pos_26137 + kv_len_26143);
i_26136 = G__26145;
dst_pos_26137 = G__26146;
continue;
}
} else {
}
break;
}

return dst_slab_off;
}
});
/**
 * Remove a KV entry from src, optionally add a child. Returns new slab-qualified offset.
 */
cljs_thread.eve.map.make_bitmap_node_removing_kv_BANG_ = (function cljs_thread$eve$map$make_bitmap_node_removing_kv_BANG_(new_data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_idx,new_child_idx,new_child_off){
var src_base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);
var existing_kv_size = (function (){var cached = cljs_thread.eve.map.r_get_u16((2));
if((cached > (0))){
return cached;
} else {
var dc = cljs_thread.eve.map.popcount32(src_data_bm);
var kv_s = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var i = (0);
var pos = kv_s;
while(true){
if((i >= dc)){
return (pos - kv_s);
} else {
var G__26147 = (i + (1));
var G__26148 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26147;
pos = G__26148;
continue;
}
break;
}
}
})();
var removed_kv_size = (function (){var kv_start = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var i = (0);
var pos = kv_start;
while(true){
if((i === remove_idx)){
return (cljs_thread.eve.map.skip_kv_at(pos) - pos);
} else {
var G__26149 = (i + (1));
var G__26150 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26149;
pos = G__26150;
continue;
}
break;
}
})();
var final_kv_size = (existing_kv_size - removed_kv_size);
var new_child_count = cljs_thread.eve.map.popcount32(new_node_bm);
var new_data_count = cljs_thread.eve.map.popcount32(new_data_bm);
var node_size = ((((12) + ((4) * new_child_count)) + ((4) * new_data_count)) + final_kv_size);
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),final_kv_size);

cljs_thread.eve.map.r_set_u32((4),new_data_bm);

cljs_thread.eve.map.r_set_u32((8),new_node_bm);

var src_child_count_26151 = cljs_thread.eve.map.popcount32(src_node_bm);
var src_i_26152 = (0);
var dst_i_26153 = (0);
while(true){
if((dst_i_26153 < new_child_count)){
if((dst_i_26153 === new_child_idx)){
cljs_thread.eve.map.r_set_i32(((12) + (dst_i_26153 * (4))),new_child_off);

var G__26154 = src_i_26152;
var G__26155 = (dst_i_26153 + (1));
src_i_26152 = G__26154;
dst_i_26153 = G__26155;
continue;
} else {
cljs_thread.eve.map.r_set_i32(((12) + (dst_i_26153 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_26152 * (4)))));

var G__26156 = (src_i_26152 + (1));
var G__26157 = (dst_i_26153 + (1));
src_i_26152 = G__26156;
dst_i_26153 = G__26157;
continue;
}
} else {
}
break;
}

var src_h_off_26158 = cljs_thread.eve.map.hashes_start_off(src_node_bm);
var dst_h_off_26159 = cljs_thread.eve.map.hashes_start_off(new_node_bm);
var src_i_26160 = (0);
var dst_i_26161 = (0);
while(true){
if((dst_i_26161 < new_data_count)){
if((src_i_26160 === remove_idx)){
var G__26162 = (src_i_26160 + (1));
var G__26163 = dst_i_26161;
src_i_26160 = G__26162;
dst_i_26161 = G__26163;
continue;
} else {
cljs_thread.eve.map.r_set_i32((dst_h_off_26159 + (dst_i_26161 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,(src_h_off_26158 + (src_i_26160 * (4)))));

var G__26164 = (src_i_26160 + (1));
var G__26165 = (dst_i_26161 + (1));
src_i_26160 = G__26164;
dst_i_26161 = G__26165;
continue;
}
} else {
}
break;
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_kv_off_26166 = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var old_dc_26167 = cljs_thread.eve.map.popcount32(src_data_bm);
var positions_26168 = (function (){var i = (0);
var pos = src_kv_off_26166;
var acc = [];
while(true){
if((i >= old_dc_26167)){
return acc;
} else {
var next = cljs_thread.eve.map.skip_kv_at(pos);
acc.push([pos,(next - pos)]);

var G__26170 = (i + (1));
var G__26171 = next;
var G__26172 = acc;
i = G__26170;
pos = G__26171;
acc = G__26172;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var dst_kv_off_26173 = cljs_thread.eve.map.kv_data_start_off(new_data_bm,new_node_bm);
var src_i_26174 = (0);
var dst_pos_26175 = dst_kv_off_26173;
while(true){
if((src_i_26174 < old_dc_26167)){
if((src_i_26174 === remove_idx)){
var G__26176 = (src_i_26174 + (1));
var G__26177 = dst_pos_26175;
src_i_26174 = G__26176;
dst_pos_26175 = G__26177;
continue;
} else {
var entry_26178 = (positions_26168[src_i_26174]);
var src_pos_26179 = (entry_26178[(0)]);
var kv_len_26180 = (entry_26178[(1)]);
var src_bytes_26181 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_26179,kv_len_26180);
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_26181,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_26175));

var G__26182 = (src_i_26174 + (1));
var G__26183 = (dst_pos_26175 + kv_len_26180);
src_i_26174 = G__26182;
dst_pos_26175 = G__26183;
continue;
}
} else {
}
break;
}

return dst_slab_off;
});
/**
 * Create a collision node. entries is seq of [kh kb vb] triples.
 */
cljs_thread.eve.map.make_collision_node_BANG_ = (function cljs_thread$eve$map$make_collision_node_BANG_(kh,entries){
var cnt = cljs.core.count(entries);
var kv_size = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__25542){
var vec__25543 = p__25542;
var _kh = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25543,(0),null);
var kb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25543,(1),null);
var vb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25543,(2),null);
return (acc + cljs_thread.eve.map.calc_kv_size(kb,vb));
}),(0),entries);
var node_size = ((8) + kv_size);
var slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.map.r_set_u8((0),(3));

cljs_thread.eve.map.r_set_u8((1),cnt);

cljs_thread.eve.map.r_set_u16((2),(0));

cljs_thread.eve.map.r_set_i32((4),kh);

var es_26185 = cljs.core.seq(entries);
var pos_26186 = (8);
while(true){
if(es_26185){
var vec__25547_26187 = cljs.core.first(es_26185);
var _kh_26188 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25547_26187,(0),null);
var kb_26189 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25547_26187,(1),null);
var vb_26190 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25547_26187,(2),null);
var next_pos_26191 = cljs_thread.eve.map.write_kv_BANG_(pos_26186,kb_26189,vb_26190);
var G__26192 = cljs.core.next(es_26185);
var G__26193 = next_pos_26191;
es_26185 = G__26192;
pos_26186 = G__26193;
continue;
} else {
}
break;
}

return slab_off;
});
/**
 * Recursively free a HAMT node and all its children.
 * NOTE: This does NOT use the pool because the retirement implementation
 * does not do proper tree-diffing. It frees the entire old tree, which may
 * include nodes shared with the new tree. Pooling such nodes would corrupt
 * the current tree when the pooled offsets are reused.
 */
cljs_thread.eve.map.free_hamt_node_BANG_ = (function cljs_thread$eve$map$free_hamt_node_BANG_(slab_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_off,(-1))){
var node_type = cljs_thread.eve.map.read_node_type(slab_off);
var G__25551 = node_type;
switch (G__25551) {
case (1):
var node_bm = cljs_thread.eve.map.read_node_bitmap(slab_off);
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var n__5636__auto___26195 = child_count;
var i_26196 = (0);
while(true){
if((i_26196 < n__5636__auto___26195)){
var child_off_26198 = cljs_thread.eve.map.read_child_offset(slab_off,i_26196);
(cljs_thread.eve.map.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.map.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1(child_off_26198) : cljs_thread.eve.map.free_hamt_node_BANG_.call(null, child_off_26198));

var G__26199 = (i_26196 + (1));
i_26196 = G__26199;
continue;
} else {
}
break;
}

return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);

break;
case (3):
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);

break;
default:
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);

}
} else {
return null;
}
});
/**
 * Get the block size for a slab-qualified offset, for pool/free routing.
 */
cljs_thread.eve.map.node_size_for_free = (function cljs_thread$eve$map$node_size_for_free(slab_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_off);
if((class_idx < (6))){
return (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
} else {
return (0);
}
});
/**
 * After an atom swap that replaced old-root with new-root, free the old
 * path nodes that are no longer referenced by the new tree.
 * 
 * Walks both trees following the hash bits for key kh. At each level where
 * old-node != new-node, the old node is freed or pooled.
 * 
 * Only retires individual path nodes — shared subtrees are untouched.
 * 
 * NOTE: Only use for SINGLE-key modifications. For multiple keys, use
 * retire-tree-diff! to avoid double-freeing shared path nodes.
 * 
 * kh: the hash of the key that was modified
 */
cljs_thread.eve.map.retire_replaced_path_BANG_ = (function cljs_thread$eve$map$retire_replaced_path_BANG_(old_root,new_root,kh){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,new_root)))){
var old_off = old_root;
var new_off = new_root;
var sh = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,new_off)))){
var size = cljs_thread.eve.map.node_size_for_free(old_off);
var old_type = cljs_thread.eve.map.read_node_type(old_off);
var vec__25598 = (((old_type === (1)))?(function (){var bit = cljs_thread.eve.map.bitpos(kh,sh);
var old_node_bm = cljs_thread.eve.map.read_node_bitmap(old_off);
var new_type = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_off,(-1)))?cljs_thread.eve.map.read_node_type(new_off):null);
var new_node_bm = (cljs.core.truth_((function (){var and__5043__auto__ = new_type;
if(cljs.core.truth_(and__5043__auto__)){
return (new_type === (1));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.map.read_node_bitmap(new_off):null);
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.eve.map.has_bit_QMARK_(old_node_bm,bit);
if(and__5043__auto__){
var and__5043__auto____$1 = new_node_bm;
if(cljs.core.truth_(and__5043__auto____$1)){
return cljs_thread.eve.map.has_bit_QMARK_(new_node_bm,bit);
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var old_child_idx = cljs_thread.eve.map.get_index(old_node_bm,bit);
var new_child_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.map.read_child_offset(old_off,old_child_idx),cljs_thread.eve.map.read_child_offset(new_off,new_child_idx),(sh + (5))], null);
} else {
return null;
}
})():null);
var old_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25598,(0),null);
var new_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25598,(1),null);
var next_sh = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25598,(2),null);
if((size > (0))){
cljs_thread.eve.map.maybe_pool_or_free_BANG_(old_off,size);
} else {
cljs_thread.eve.deftype_proto.alloc.free_BANG_(old_off);
}

if(cljs.core.truth_(old_child)){
var G__26201 = old_child;
var G__26202 = new_child;
var G__26203 = next_sh;
old_off = G__26201;
new_off = G__26202;
sh = G__26203;
continue;
} else {
return null;
}
} else {
return null;
}
break;
}
} else {
return null;
}
});
/**
 * Full tree diff: walk old and new HAMT trees in parallel, freeing all
 * old nodes that differ from the new tree.
 * 
 * At each node pair:
 * - If old-off == new-off → shared subtree, skip entirely
 * - If old-off != new-off → free old node, recurse into children
 * 
 * Cost: O(changed nodes). Shared subtrees are skipped via integer compare.
 */
cljs_thread.eve.map.retire_tree_diff_BANG_ = (function cljs_thread$eve$map$retire_tree_diff_BANG_(old_root,new_root){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,new_root)))){
var walk = (function cljs_thread$eve$map$retire_tree_diff_BANG__$_walk(old_off,new_off){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,new_off)))){
var size = cljs_thread.eve.map.node_size_for_free(old_off);
var old_type = cljs_thread.eve.map.read_node_type(old_off);
var children_to_walk = (((old_type === (1)))?(function (){var old_node_bm = cljs_thread.eve.map.read_node_bitmap(old_off);
var new_type = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_off,(-1)))?cljs_thread.eve.map.read_node_type(new_off):null);
var new_node_bm = (cljs.core.truth_((function (){var and__5043__auto__ = new_type;
if(cljs.core.truth_(and__5043__auto__)){
return (new_type === (1));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.map.read_node_bitmap(new_off):null);
var remaining = old_node_bm;
var old_idx = (0);
var result = cljs.core.transient$(cljs.core.PersistentVector.EMPTY);
while(true){
if((remaining === (0))){
return cljs.core.persistent_BANG_(result);
} else {
var bit = (remaining & (- remaining));
var old_child = cljs_thread.eve.map.read_child_offset(old_off,old_idx);
var new_child = (cljs.core.truth_((function (){var and__5043__auto__ = new_node_bm;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.eve.map.has_bit_QMARK_(new_node_bm,bit);
} else {
return and__5043__auto__;
}
})())?(function (){var new_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
return cljs_thread.eve.map.read_child_offset(new_off,new_idx);
})():(-1));
var G__26208 = (remaining & (remaining - (1)));
var G__26209 = (old_idx + (1));
var G__26210 = cljs.core.conj_BANG_.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [old_child,new_child], null));
remaining = G__26208;
old_idx = G__26209;
result = G__26210;
continue;
}
break;
}
})():null);
if((size > (0))){
cljs_thread.eve.map.maybe_pool_or_free_BANG_(old_off,size);
} else {
cljs_thread.eve.deftype_proto.alloc.free_BANG_(old_off);
}

var seq__25700 = cljs.core.seq(children_to_walk);
var chunk__25701 = null;
var count__25702 = (0);
var i__25703 = (0);
while(true){
if((i__25703 < count__25702)){
var vec__25719 = chunk__25701.cljs$core$IIndexed$_nth$arity$2(null, i__25703);
var old_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25719,(0),null);
var new_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25719,(1),null);
cljs_thread$eve$map$retire_tree_diff_BANG__$_walk(old_child,new_child);


var G__26212 = seq__25700;
var G__26213 = chunk__25701;
var G__26214 = count__25702;
var G__26215 = (i__25703 + (1));
seq__25700 = G__26212;
chunk__25701 = G__26213;
count__25702 = G__26214;
i__25703 = G__26215;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__25700);
if(temp__5823__auto__){
var seq__25700__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25700__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__25700__$1);
var G__26216 = cljs.core.chunk_rest(seq__25700__$1);
var G__26217 = c__5568__auto__;
var G__26218 = cljs.core.count(c__5568__auto__);
var G__26219 = (0);
seq__25700 = G__26216;
chunk__25701 = G__26217;
count__25702 = G__26218;
i__25703 = G__26219;
continue;
} else {
var vec__25728 = cljs.core.first(seq__25700__$1);
var old_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25728,(0),null);
var new_child = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25728,(1),null);
cljs_thread$eve$map$retire_tree_diff_BANG__$_walk(old_child,new_child);


var G__26221 = cljs.core.next(seq__25700__$1);
var G__26222 = null;
var G__26223 = (0);
var G__26224 = (0);
seq__25700 = G__26221;
chunk__25701 = G__26222;
count__25702 = G__26223;
i__25703 = G__26224;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
});
return walk(old_root,new_root);
} else {
return null;
}
});
/**
 * Dispose a EveHashMap, freeing its entire HAMT tree and header block.
 */
cljs_thread.eve.map.dispose_BANG_ = (function cljs_thread$eve$map$dispose_BANG_(sab_map){
var root_off = sab_map.root_off;
var header_off = sab_map.header_off;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_off,(-1))){
cljs_thread.eve.map.free_hamt_node_BANG_(root_off);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(header_off,(-1))){
var size = cljs_thread.eve.map.node_size_for_free(header_off);
if((size > (0))){
return cljs_thread.eve.map.maybe_pool_or_free_BANG_(header_off,size);
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(header_off);
}
} else {
return null;
}
});
/**
 * Free a CAS-failed map's new nodes without touching shared subtrees.
 * Call when a CAS attempt fails and the newly-created map is abandoned.
 * Swaps old/new args to retire-replaced-path! so it frees the NEW path
 * nodes (the ones that differ from the original tree), then frees the header.
 */
cljs_thread.eve.map.free_cas_abandoned_BANG_ = (function cljs_thread$eve$map$free_cas_abandoned_BANG_(new_map,old_root_off,kh){
var new_root_off = new_map.root_off;
var header_off = new_map.header_off;
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_root_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_root_off,old_root_off)))){
cljs_thread.eve.map.retire_replaced_path_BANG_(new_root_off,old_root_off,kh);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(header_off,(-1))){
var size = cljs_thread.eve.map.node_size_for_free(header_off);
if((size > (0))){
return cljs_thread.eve.map.maybe_pool_or_free_BANG_(header_off,size);
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(header_off);
}
} else {
return null;
}
});
cljs_thread.eve.map.hamt_result_added_QMARK_ = false;
cljs_thread.eve.map.hamt_result_removed_QMARK_ = false;
cljs_thread.eve.map.find_result_found_QMARK_ = false;
cljs_thread.eve.map.find_result_val = null;
cljs_thread.eve.map.recycle_replaced_nodes_QMARK_ = false;
/**
 * Pool a replaced node for reuse. Only called when recycle-replaced-nodes? is true.
 */
cljs_thread.eve.map.recycle_node_BANG_ = (function cljs_thread$eve$map$recycle_node_BANG_(slab_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_off);
if((class_idx < (6))){
return cljs_thread.eve.map.maybe_pool_or_free_BANG_(slab_off,(cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]));
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);
}
});
/**
 * Look up key in HAMT. Sets find-result-found? and find-result-val.
 */
cljs_thread.eve.map.hamt_find_fast = (function cljs_thread$eve$map$hamt_find_fast(root_off,kb,kh,shift){
while(true){
if((root_off === (-1))){
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;
} else {
var node_type = cljs_thread.eve.map.read_node_type(root_off);
var G__25736 = node_type;
switch (G__25736) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var data_bm = cljs_thread.eve.map.r_get_u32((4));
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var bit = cljs_thread.eve.map.bitpos(kh,shift);
if(cljs_thread.eve.map.has_bit_QMARK_(node_bm,bit)){
var idx = cljs_thread.eve.map.get_index(node_bm,bit);
var child_off = cljs_thread.eve.map.r_get_i32(((12) + (idx * (4))));
var G__26228 = child_off;
var G__26229 = kb;
var G__26230 = kh;
var G__26231 = (shift + (5));
root_off = G__26228;
kb = G__26229;
kh = G__26230;
shift = G__26231;
continue;
} else {
if(cljs_thread.eve.map.has_bit_QMARK_(data_bm,bit)){
var data_idx = cljs_thread.eve.map.get_index(data_bm,bit);
var stored_hash = cljs_thread.eve.map.r_get_i32((cljs_thread.eve.map.hashes_start_off(node_bm) + (data_idx * (4))));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(stored_hash,kh)){
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;
} else {
var kv_s = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var pos = (function (){var i = (0);
var p = kv_s;
while(true){
if((i === data_idx)){
return p;
} else {
var kl = cljs_thread.eve.map.r_get_u32(p);
var vo = ((p + (4)) + kl);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var G__26235 = (i + (1));
var G__26236 = ((vo + (4)) + vl);
i = G__26235;
p = G__26236;
continue;
}
break;
}
})();
var key_len = cljs_thread.eve.map.r_get_u32(pos);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
var val_off = ((pos + (4)) + key_len);
var val_len = cljs_thread.eve.map.r_get_u32(val_off);
var val_bytes = cljs_thread.eve.deftype_proto.alloc.read_bytes(root_off,(val_off + (4)),val_len);
var entry_v = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
(cljs_thread.eve.map.find_result_found_QMARK_ = true);

(cljs_thread.eve.map.find_result_val = entry_v);

return null;
} else {
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;
}
}
} else {
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;

}
}

break;
case (3):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var coll_hash = cljs_thread.eve.map.r_get_i32((4));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(coll_hash,kh)){
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;
} else {
var cnt = cljs_thread.eve.map.r_get_u8((1));
var i = (0);
var pos = (8);
while(true){
if((i >= cnt)){
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;
} else {
var key_len = cljs_thread.eve.map.r_get_u32(pos);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
var val_off = ((pos + (4)) + key_len);
var val_len = cljs_thread.eve.map.r_get_u32(val_off);
var val_bytes = cljs_thread.eve.deftype_proto.alloc.read_bytes(root_off,(val_off + (4)),val_len);
var entry_v = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
(cljs_thread.eve.map.find_result_found_QMARK_ = true);

(cljs_thread.eve.map.find_result_val = entry_v);

return null;
} else {
var val_off = ((pos + (4)) + key_len);
var val_len = cljs_thread.eve.map.r_get_u32(val_off);
var G__26243 = (i + (1));
var G__26244 = ((val_off + (4)) + val_len);
i = G__26243;
pos = G__26244;
continue;
}
}
break;
}
}

break;
default:
(cljs_thread.eve.map.find_result_found_QMARK_ = false);

(cljs_thread.eve.map.find_result_val = null);

return null;

}
}
break;
}
});
/**
 * Look up key in HAMT. Sets find-result-found? and find-result-val.
 */
cljs_thread.eve.map.hamt_find = (function cljs_thread$eve$map$hamt_find(root_off,k,kh,shift){
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
cljs_thread.eve.map.hamt_find_fast(root_off,kb,kh,shift);

return null;
});
/**
 * Assoc key/value into HAMT. Returns new root slab-qualified offset.
 */
cljs_thread.eve.map.hamt_assoc = (function cljs_thread$eve$map$hamt_assoc(root_off,kh,kb,vb,shift){
if((shift > (50))){
throw (new Error(["hamt-assoc: shift overflow! shift=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(shift)].join('')));
} else {
}

if((root_off === (-1))){
var bit = cljs_thread.eve.map.bitpos(kh,shift);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_single_entry_node_BANG_(bit,kh,kb,vb);
} else {
var node_type = cljs_thread.eve.map.read_node_type(root_off);
var result = (function (){var G__25753 = node_type;
switch (G__25753) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var data_bm = cljs_thread.eve.map.r_get_u32((4));
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var bit = cljs_thread.eve.map.bitpos(kh,shift);
if(cljs_thread.eve.map.has_bit_QMARK_(node_bm,bit)){
var child_idx = cljs_thread.eve.map.get_index(node_bm,bit);
var child_off = cljs_thread.eve.map.r_get_i32(((12) + (child_idx * (4))));
var new_child = (function (){var G__25757 = child_off;
var G__25758 = kh;
var G__25759 = kb;
var G__25760 = vb;
var G__25761 = (shift + (5));
return (cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5(G__25757,G__25758,G__25759,G__25760,G__25761) : cljs_thread.eve.map.hamt_assoc.call(null, G__25757,G__25758,G__25759,G__25760,G__25761));
})();
if((new_child === child_off)){
return root_off;
} else {
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,root_off,data_bm,node_bm,child_idx,new_child);
}
} else {
if(cljs_thread.eve.map.has_bit_QMARK_(data_bm,bit)){
var data_idx = cljs_thread.eve.map.get_index(data_bm,bit);
var kv_s = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var pos = (function (){var i = (0);
var p = kv_s;
while(true){
if((i === data_idx)){
return p;
} else {
var kl = cljs_thread.eve.map.r_get_u32(p);
var vo = ((p + (4)) + kl);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var G__26248 = (i + (1));
var G__26249 = ((vo + (4)) + vl);
i = G__26248;
p = G__26249;
continue;
}
break;
}
})();
var existing_kh = cljs_thread.eve.map.r_get_i32((cljs_thread.eve.map.hashes_start_off(node_bm) + (data_idx * (4))));
var existing_kb_len = cljs_thread.eve.map.r_get_u32(pos);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
var val_off = ((pos + (4)) + existing_kb_len);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(val_off,vb))){
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return root_off;
} else {
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return cljs_thread.eve.map.make_bitmap_node_with_replaced_kv_BANG_(data_bm,node_bm,root_off,node_bm,data_idx,kh,kb,vb,pos);
}
} else {
var existing_kb = cljs_thread.eve.map.copy_from_sab(root_off,(pos + (4)),existing_kb_len);
var existing_vb_off = ((pos + (4)) + existing_kb_len);
var ___$1 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var existing_vb_len = cljs_thread.eve.map.r_get_u32(existing_vb_off);
var existing_vb = cljs_thread.eve.map.copy_from_sab(root_off,(existing_vb_off + (4)),existing_vb_len);
if((((existing_kh === kh)) || ((shift >= (30))))){
var coll = cljs_thread.eve.map.make_collision_node_BANG_(kh,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [existing_kh,existing_kb,existing_vb], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [kh,kb,vb], null)], null));
var new_data_bm = (data_bm ^ bit);
var new_node_bm = (node_bm | bit);
var new_child_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_bitmap_node_removing_kv_BANG_(new_data_bm,new_node_bm,root_off,data_bm,node_bm,data_idx,new_child_idx,coll);
} else {
var sub_shift = (shift + (5));
var existing_bit = cljs_thread.eve.map.bitpos(existing_kh,sub_shift);
var new_bit = cljs_thread.eve.map.bitpos(kh,sub_shift);
if((existing_bit === new_bit)){
var sub = (cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5((-1),existing_kh,existing_kb,existing_vb,sub_shift) : cljs_thread.eve.map.hamt_assoc.call(null, (-1),existing_kh,existing_kb,existing_vb,sub_shift));
var final_sub = (cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5(sub,kh,kb,vb,sub_shift) : cljs_thread.eve.map.hamt_assoc.call(null, sub,kh,kb,vb,sub_shift));
var new_data_bm = (data_bm ^ bit);
var new_node_bm = (node_bm | bit);
var new_child_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_bitmap_node_removing_kv_BANG_(new_data_bm,new_node_bm,root_off,data_bm,node_bm,data_idx,new_child_idx,final_sub);
} else {
var sub_data_bm = (existing_bit | new_bit);
var sub = (((existing_bit < new_bit))?cljs_thread.eve.map.make_two_entry_node_BANG_(sub_data_bm,existing_kh,existing_kb,existing_vb,kh,kb,vb):cljs_thread.eve.map.make_two_entry_node_BANG_(sub_data_bm,kh,kb,vb,existing_kh,existing_kb,existing_vb));
var new_data_bm = (data_bm ^ bit);
var new_node_bm = (node_bm | bit);
var new_child_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_bitmap_node_removing_kv_BANG_(new_data_bm,new_node_bm,root_off,data_bm,node_bm,data_idx,new_child_idx,sub);
}
}
}
} else {
var data_idx = cljs_thread.eve.map.get_index(data_bm,bit);
var new_data_bm = (data_bm | bit);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_bitmap_node_with_added_kv_BANG_(new_data_bm,node_bm,root_off,data_bm,node_bm,data_idx,kh,kb,vb);

}
}

break;
case (3):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var node_hash = cljs_thread.eve.map.r_get_i32((4));
var cnt = cljs_thread.eve.map.r_get_u8((1));
if((kh === node_hash)){
var i = (0);
var pos = (8);
var entries = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_collision_node_BANG_(kh,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(entries,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [kh,kb,vb], null)));
} else {
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var klen = cljs_thread.eve.map.r_get_u32(pos);
var entry_kb = cljs_thread.eve.map.copy_from_sab(root_off,(pos + (4)),klen);
var val_off = ((pos + (4)) + klen);
var ___$1 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vlen = cljs_thread.eve.map.r_get_u32(val_off);
var entry_vb = cljs_thread.eve.map.copy_from_sab(root_off,(val_off + (4)),vlen);
var next_pos = ((val_off + (4)) + vlen);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
if((function (){var a = entry_vb;
var b = vb;
var and__5043__auto__ = (a.length === b.length);
if(and__5043__auto__){
var j = (0);
while(true){
if((j >= a.length)){
return true;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((a[j]),(b[j]))){
return false;
} else {
var G__26259 = (j + (1));
j = G__26259;
continue;
}
}
break;
}
} else {
return and__5043__auto__;
}
})()){
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return root_off;
} else {
var remaining = (function (){var j = (i + (1));
var p = next_pos;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((j >= cnt)){
return acc;
} else {
var ___$2 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var kl = cljs_thread.eve.map.r_get_u32(p);
var kb2 = cljs_thread.eve.map.copy_from_sab(root_off,(p + (4)),kl);
var vo = ((p + (4)) + kl);
var ___$3 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var vb2 = cljs_thread.eve.map.copy_from_sab(root_off,(vo + (4)),vl);
var G__26262 = (j + (1));
var G__26263 = ((vo + (4)) + vl);
var G__26264 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_hash,kb2,vb2], null));
j = G__26262;
p = G__26263;
acc = G__26264;
continue;
}
break;
}
})();
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return cljs_thread.eve.map.make_collision_node_BANG_(kh,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(entries,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [kh,kb,vb], null)),remaining));
}
} else {
var G__26265 = (i + (1));
var G__26266 = next_pos;
var G__26267 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(entries,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_hash,entry_kb,entry_vb], null));
i = G__26265;
pos = G__26266;
entries = G__26267;
continue;
}
}
break;
}
} else {
if((shift >= (30))){
var entries = (function (){var i = (0);
var pos = (8);
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
return acc;
} else {
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var kl = cljs_thread.eve.map.r_get_u32(pos);
var ek = cljs_thread.eve.map.copy_from_sab(root_off,(pos + (4)),kl);
var vo = ((pos + (4)) + kl);
var ___$1 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var ev = cljs_thread.eve.map.copy_from_sab(root_off,(vo + (4)),vl);
var G__26268 = (i + (1));
var G__26269 = ((vo + (4)) + vl);
var G__26270 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_hash,ek,ev], null));
i = G__26268;
pos = G__26269;
acc = G__26270;
continue;
}
break;
}
})();
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_collision_node_BANG_(node_hash,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(entries,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [kh,kb,vb], null)));
} else {
var bit1 = cljs_thread.eve.map.bitpos(node_hash,shift);
var bit2 = cljs_thread.eve.map.bitpos(kh,shift);
if((bit1 === bit2)){
var new_child = (function (){var G__25805 = root_off;
var G__25806 = kh;
var G__25807 = kb;
var G__25808 = vb;
var G__25809 = (shift + (5));
return (cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.map.hamt_assoc.cljs$core$IFn$_invoke$arity$5(G__25805,G__25806,G__25807,G__25808,G__25809) : cljs_thread.eve.map.hamt_assoc.call(null, G__25805,G__25806,G__25807,G__25808,G__25809));
})();
return cljs_thread.eve.map.make_single_child_node_BANG_(bit1,new_child);
} else {
(cljs_thread.eve.map.hamt_result_added_QMARK_ = true);

return cljs_thread.eve.map.make_child_and_entry_node_BANG_(bit2,bit1,root_off,kh,kb,vb);
}
}
}

break;
default:
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return root_off;

}
})();
if(((cljs_thread.eve.map.recycle_replaced_nodes_QMARK_) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(result,root_off)))){
cljs_thread.eve.map.recycle_node_BANG_(root_off);
} else {
}

return result;
}
});
/**
 * Graft a worker's speculative HAMT change onto a different root.
 * All offsets are slab-qualified — transparently routes to correct slabs.
 */
cljs_thread.eve.map.hamt_graft = (function cljs_thread$eve$map$hamt_graft(current_root,base_root,new_root,kh,kb,vb,worker_added,shift){
if((current_root === base_root)){
(cljs_thread.eve.map.hamt_result_added_QMARK_ = worker_added);

return new_root;
} else {
if((base_root === new_root)){
(cljs_thread.eve.map.hamt_result_added_QMARK_ = false);

return current_root;
} else {
var cur_type = cljs_thread.eve.map.read_node_type(current_root);
var base_type = cljs_thread.eve.map.read_node_type(base_root);
var new_type = cljs_thread.eve.map.read_node_type(new_root);
if((((cur_type === (1))) && ((((base_type === (1))) && ((new_type === (1))))))){
var bit = cljs_thread.eve.map.bitpos(kh,shift);
var cur_node_bm = cljs_thread.eve.map.read_node_bitmap(current_root);
var base_node_bm = cljs_thread.eve.map.read_node_bitmap(base_root);
var new_node_bm = cljs_thread.eve.map.read_node_bitmap(new_root);
if(((cljs_thread.eve.map.has_bit_QMARK_(cur_node_bm,bit)) && (((cljs_thread.eve.map.has_bit_QMARK_(base_node_bm,bit)) && (((cljs_thread.eve.map.has_bit_QMARK_(new_node_bm,bit)) && ((base_node_bm === new_node_bm)))))))){
var cur_child_idx = cljs_thread.eve.map.get_index(cur_node_bm,bit);
var base_child_idx = cljs_thread.eve.map.get_index(base_node_bm,bit);
var new_child_idx = cljs_thread.eve.map.get_index(new_node_bm,bit);
var cur_child = cljs_thread.eve.map.read_child_offset(current_root,cur_child_idx);
var base_child = cljs_thread.eve.map.read_child_offset(base_root,base_child_idx);
var new_child = cljs_thread.eve.map.read_child_offset(new_root,new_child_idx);
if((base_child === new_child)){
return cljs_thread.eve.map.hamt_assoc(current_root,kh,kb,vb,shift);
} else {
if((cur_child === base_child)){
var cur_data_bm = cljs_thread.eve.map.read_data_bitmap(current_root);
(cljs_thread.eve.map.hamt_result_added_QMARK_ = worker_added);

return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7(cur_data_bm,cur_node_bm,current_root,cur_data_bm,cur_node_bm,cur_child_idx,new_child);
} else {
var grafted = (function (){var G__25816 = cur_child;
var G__25817 = base_child;
var G__25818 = new_child;
var G__25819 = kh;
var G__25820 = kb;
var G__25821 = vb;
var G__25822 = worker_added;
var G__25823 = (shift + (5));
return (cljs_thread.eve.map.hamt_graft.cljs$core$IFn$_invoke$arity$8 ? cljs_thread.eve.map.hamt_graft.cljs$core$IFn$_invoke$arity$8(G__25816,G__25817,G__25818,G__25819,G__25820,G__25821,G__25822,G__25823) : cljs_thread.eve.map.hamt_graft.call(null, G__25816,G__25817,G__25818,G__25819,G__25820,G__25821,G__25822,G__25823));
})();
if((grafted === cur_child)){
return current_root;
} else {
var cur_data_bm = cljs_thread.eve.map.read_data_bitmap(current_root);
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7(cur_data_bm,cur_node_bm,current_root,cur_data_bm,cur_node_bm,cur_child_idx,grafted);
}

}
}
} else {
return cljs_thread.eve.map.hamt_assoc(current_root,kh,kb,vb,shift);
}
} else {
return cljs_thread.eve.map.hamt_assoc(current_root,kh,kb,vb,shift);
}

}
}
});
cljs_thread.eve.map.hamt_graft_added_QMARK_ = (function cljs_thread$eve$map$hamt_graft_added_QMARK_(){
return cljs_thread.eve.map.hamt_result_added_QMARK_;
});
/**
 * Public wrapper for hamt-assoc.
 */
cljs_thread.eve.map.hamt_assoc_pub = (function cljs_thread$eve$map$hamt_assoc_pub(root_off,kh,kb,vb,shift){
return cljs_thread.eve.map.hamt_assoc(root_off,kh,kb,vb,shift);
});
/**
 * Public wrapper for alloc-bytes!.
 */
cljs_thread.eve.map.alloc_bytes_pub = (function cljs_thread$eve$map$alloc_bytes_pub(n){
return cljs_thread.eve.map.alloc_bytes_BANG_(n);
});
/**
 * Public wrapper for hamt-dissoc.
 */
cljs_thread.eve.map.hamt_dissoc_pub = (function cljs_thread$eve$map$hamt_dissoc_pub(root_off,kh,kb,shift){
return (cljs_thread.eve.map.hamt_dissoc.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.map.hamt_dissoc.cljs$core$IFn$_invoke$arity$4(root_off,kh,kb,shift) : cljs_thread.eve.map.hamt_dissoc.call(null, root_off,kh,kb,shift));
});
/**
 * Bypass protocol dispatch — calls the internal assoc path directly.
 * Returns #js [new-header-off new-cnt].
 */
cljs_thread.eve.map.direct_assoc_pub = (function cljs_thread$eve$map$direct_assoc_pub(root_off,cnt,k,v){
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(v);
var kh = cljs.core.hash(k);
var new_root = cljs_thread.eve.map.hamt_assoc(root_off,kh,kb,vb,(0));
if((new_root === root_off)){
return [root_off,cnt];
} else {
var new_cnt = ((cljs_thread.eve.map.hamt_result_added_QMARK_)?(cnt + (1)):cnt);
var new_map = (cljs_thread.eve.map.make_eve_hash_map.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.map.make_eve_hash_map.cljs$core$IFn$_invoke$arity$2(new_cnt,new_root) : cljs_thread.eve.map.make_eve_hash_map.call(null, new_cnt,new_root));
return [new_map.header_off,new_cnt];
}
});
/**
 * Like direct-assoc-pub but returns a EveHashMap with _modified_khs tracking.
 */
cljs_thread.eve.map.direct_assoc_with_khs_pub = (function cljs_thread$eve$map$direct_assoc_with_khs_pub(root_off,cnt,k,v,parent_map){
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(v);
var kh = cljs.core.hash(k);
var new_root = cljs_thread.eve.map.hamt_assoc(root_off,kh,kb,vb,(0));
if((new_root === root_off)){
return parent_map;
} else {
var new_cnt = ((cljs_thread.eve.map.hamt_result_added_QMARK_)?(cnt + (1)):cnt);
var new_map = (cljs_thread.eve.map.make_eve_hash_map.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.map.make_eve_hash_map.cljs$core$IFn$_invoke$arity$2(new_cnt,new_root) : cljs_thread.eve.map.make_eve_hash_map.call(null, new_cnt,new_root));
var parent_khs = parent_map._modified_khs;
var parent_len = (cljs.core.truth_(parent_khs)?parent_khs.length:(0));
if((parent_len <= (8))){
(new_map._modified_khs = (((((parent_khs == null)) || ((parent_len === (0)))))?[kh]:(function (){var khs = parent_khs.slice((0));
khs.push(kh);

return khs;
})()));
} else {
}

return new_map;
}
});
/**
 * Create bitmap node with a child removed. Raw byte copy for data entries.
 */
cljs_thread.eve.map.make_bitmap_node_removing_child_BANG_ = (function cljs_thread$eve$map$make_bitmap_node_removing_child_BANG_(data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_child_idx){
var new_child_count = cljs_thread.eve.map.popcount32(new_node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var existing_kv_size = cljs_thread.eve.map.read_kv_total_size(src_slab_off);
var existing_kv_size__$1 = (((existing_kv_size > (0)))?existing_kv_size:(function (){var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);
var kv_s = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var dc = cljs_thread.eve.map.popcount32(src_data_bm);
var i = (0);
var pos = kv_s;
while(true){
if((i >= dc)){
return (pos - kv_s);
} else {
var G__26286 = (i + (1));
var G__26287 = cljs_thread.eve.map.skip_kv_at(pos);
i = G__26286;
pos = G__26287;
continue;
}
break;
}
})());
var node_size = ((((12) + ((4) * new_child_count)) + ((4) * data_count)) + existing_kv_size__$1);
var dst_slab_off = cljs_thread.eve.map.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.map.r_set_u8((0),(1));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u16((2),existing_kv_size__$1);

cljs_thread.eve.map.r_set_u32((4),data_bm);

cljs_thread.eve.map.r_set_u32((8),new_node_bm);

var old_child_count_26290 = cljs_thread.eve.map.popcount32(src_node_bm);
var src_i_26291 = (0);
var dst_i_26292 = (0);
while(true){
if((dst_i_26292 < new_child_count)){
if((src_i_26291 === remove_child_idx)){
var G__26293 = (src_i_26291 + (1));
var G__26294 = dst_i_26292;
src_i_26291 = G__26293;
dst_i_26292 = G__26294;
continue;
} else {
cljs_thread.eve.map.r_set_i32(((12) + (dst_i_26292 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_26291 * (4)))));

var G__26297 = (src_i_26291 + (1));
var G__26298 = (dst_i_26292 + (1));
src_i_26291 = G__26297;
dst_i_26292 = G__26298;
continue;
}
} else {
}
break;
}

var src_h_off_26299 = cljs_thread.eve.map.hashes_start_off(src_node_bm);
var dst_h_off_26300 = cljs_thread.eve.map.hashes_start_off(new_node_bm);
var n__5636__auto___26301 = data_count;
var i_26302 = (0);
while(true){
if((i_26302 < n__5636__auto___26301)){
cljs_thread.eve.map.r_set_i32((dst_h_off_26300 + (i_26302 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,(src_h_off_26299 + (i_26302 * (4)))));

var G__26304 = (i_26302 + (1));
i_26302 = G__26304;
continue;
} else {
}
break;
}

var src_kv_off_26306 = cljs_thread.eve.map.kv_data_start_off(src_data_bm,src_node_bm);
var dst_kv_off_26307 = cljs_thread.eve.map.kv_data_start_off(data_bm,new_node_bm);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var positions_26308 = (function (){var i = (0);
var pos = src_kv_off_26306;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.map.skip_kv_at(pos);
acc.push([pos,(next - pos)]);

var G__26310 = (i + (1));
var G__26311 = next;
var G__26312 = acc;
i = G__26310;
pos = G__26311;
acc = G__26312;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var i_26313 = (0);
var dst_pos_26314 = dst_kv_off_26307;
while(true){
if((i_26313 < data_count)){
var entry_26315 = (positions_26308[i_26313]);
var src_pos_26316 = (entry_26315[(0)]);
var kv_len_26317 = (entry_26315[(1)]);
var src_bytes_26318 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_26316,kv_len_26317);
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_26318,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_26314));

var G__26319 = (i_26313 + (1));
var G__26320 = (dst_pos_26314 + kv_len_26317);
i_26313 = G__26319;
dst_pos_26314 = G__26320;
continue;
} else {
}
break;
}

return dst_slab_off;
});
/**
 * Dissoc key from HAMT. Returns new-root-off.
 * Sets hamt-result-removed? to true if key was removed.
 */
cljs_thread.eve.map.hamt_dissoc = (function cljs_thread$eve$map$hamt_dissoc(root_off,kh,kb,shift){
if((root_off === (-1))){
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = false);

return (-1);
} else {
var node_type = cljs_thread.eve.map.read_node_type(root_off);
var G__25824 = node_type;
switch (G__25824) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var data_bm = cljs_thread.eve.map.r_get_u32((4));
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var bit = cljs_thread.eve.map.bitpos(kh,shift);
if(cljs_thread.eve.map.has_bit_QMARK_(node_bm,bit)){
var child_idx = cljs_thread.eve.map.get_index(node_bm,bit);
var child_off = cljs_thread.eve.map.r_get_i32(((12) + (child_idx * (4))));
var new_child = (function (){var G__25825 = child_off;
var G__25826 = kh;
var G__25827 = kb;
var G__25828 = (shift + (5));
return (cljs_thread.eve.map.hamt_dissoc.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.map.hamt_dissoc.cljs$core$IFn$_invoke$arity$4(G__25825,G__25826,G__25827,G__25828) : cljs_thread.eve.map.hamt_dissoc.call(null, G__25825,G__25826,G__25827,G__25828));
})();
if((!(cljs_thread.eve.map.hamt_result_removed_QMARK_))){
return root_off;
} else {
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
if((new_child === (-1))){
if((((child_count === (1))) && ((data_count === (0))))){
return (-1);
} else {
var new_node_bm = (node_bm ^ bit);
return cljs_thread.eve.map.make_bitmap_node_removing_child_BANG_(data_bm,new_node_bm,root_off,data_bm,node_bm,child_idx);
}
} else {
return cljs_thread.eve.map.make_bitmap_node_with_raw_kv_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,root_off,data_bm,node_bm,child_idx,new_child);
}
}
} else {
if(cljs_thread.eve.map.has_bit_QMARK_(data_bm,bit)){
var data_idx = cljs_thread.eve.map.get_index(data_bm,bit);
var kv_s = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var pos = (function (){var i = (0);
var p = kv_s;
while(true){
if((i === data_idx)){
return p;
} else {
var kl = cljs_thread.eve.map.r_get_u32(p);
var vo = ((p + (4)) + kl);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var G__26326 = (i + (1));
var G__26327 = ((vo + (4)) + vl);
i = G__26326;
p = G__26327;
continue;
}
break;
}
})();
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = true);

if((((data_count === (1))) && ((child_count === (0))))){
return (-1);
} else {
var new_data_bm = (data_bm ^ bit);
return cljs_thread.eve.map.make_bitmap_node_removing_kv_BANG_(new_data_bm,node_bm,root_off,data_bm,node_bm,data_idx,(-1),(-1));
}
} else {
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = false);

return root_off;
}
} else {
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = false);

return root_off;

}
}

break;
case (3):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var cnt = cljs_thread.eve.map.r_get_u8((1));
var node_hash = cljs_thread.eve.map.r_get_i32((4));
var i = (0);
var pos = (8);
var entries = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = false);

return root_off;
} else {
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var klen = cljs_thread.eve.map.r_get_u32(pos);
var entry_kb = cljs_thread.eve.map.copy_from_sab(root_off,(pos + (4)),klen);
var val_off = ((pos + (4)) + klen);
var ___$1 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vlen = cljs_thread.eve.map.r_get_u32(val_off);
var entry_vb = cljs_thread.eve.map.copy_from_sab(root_off,(val_off + (4)),vlen);
var next_pos = ((val_off + (4)) + vlen);
var ___$2 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
if(cljs.core.truth_(cljs_thread.eve.map.key_bytes_match_QMARK_(pos,kb))){
var remaining = (function (){var j = (i + (1));
var p = next_pos;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((j >= cnt)){
return acc;
} else {
var ___$3 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var kl = cljs_thread.eve.map.r_get_u32(p);
var ekb = cljs_thread.eve.map.copy_from_sab(root_off,(p + (4)),kl);
var vo = ((p + (4)) + kl);
var ___$4 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vl = cljs_thread.eve.map.r_get_u32(vo);
var evb = cljs_thread.eve.map.copy_from_sab(root_off,(vo + (4)),vl);
var G__26332 = (j + (1));
var G__26333 = ((vo + (4)) + vl);
var G__26334 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_hash,ekb,evb], null));
j = G__26332;
p = G__26333;
acc = G__26334;
continue;
}
break;
}
})();
var all_remaining = cljs.core.into.cljs$core$IFn$_invoke$arity$2(entries,remaining);
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = true);

if(cljs.core.empty_QMARK_(all_remaining)){
return (-1);
} else {
if(((1) === cljs.core.count(all_remaining))){
var vec__25846 = cljs.core.first(all_remaining);
var ekh = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25846,(0),null);
var ekb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25846,(1),null);
var evb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25846,(2),null);
var bit = cljs_thread.eve.map.bitpos(node_hash,shift);
return cljs_thread.eve.map.make_single_entry_node_BANG_(bit,ekh,ekb,evb);
} else {
return cljs_thread.eve.map.make_collision_node_BANG_(node_hash,all_remaining);

}
}
} else {
var G__26337 = (i + (1));
var G__26338 = next_pos;
var G__26339 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(entries,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_hash,entry_kb,entry_vb], null));
i = G__26337;
pos = G__26338;
entries = G__26339;
continue;
}
}
break;
}

break;
default:
(cljs_thread.eve.map.hamt_result_removed_QMARK_ = false);

return root_off;

}
}
});
/**
 * Read and deserialize a KV pair at a resolved position.
 * Returns [key value next-pos-in-node].
 */
cljs_thread.eve.map.read_kv_at = (function cljs_thread$eve$map$read_kv_at(slab_off,pos_in_node){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

var key_len = cljs_thread.eve.map.r_get_u32(pos_in_node);
var key_bytes = cljs_thread.eve.map.copy_from_sab(slab_off,(pos_in_node + (4)),key_len);
var val_off = ((pos_in_node + (4)) + key_len);
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);
var val_len = cljs_thread.eve.map.r_get_u32(val_off);
var val_bytes = cljs_thread.eve.map.copy_from_sab(slab_off,(val_off + (4)),val_len);
var next_pos = ((val_off + (4)) + val_len);
var k = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,key_bytes);
var v = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v,next_pos], null);
});
/**
 * Return lazy seq of MapEntry pairs from HAMT.
 */
cljs_thread.eve.map.hamt_seq = (function cljs_thread$eve$map$hamt_seq(root_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_off,(-1))){
return (function cljs_thread$eve$map$hamt_seq_$_walk(off){
return (new cljs.core.LazySeq(null,(function (){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(off,(-1))){
var node_type = cljs_thread.eve.map.read_node_type(off);
var G__25861 = node_type;
switch (G__25861) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(off);
var data_bm = cljs_thread.eve.map.r_get_u32((4));
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var kv_start = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var inline_entries = (function (){var i = (0);
var pos = kv_start;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= data_count)){
return acc;
} else {
var vec__25867 = cljs_thread.eve.map.read_kv_at(off,pos);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25867,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25867,(1),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25867,(2),null);
var G__26344 = (i + (1));
var G__26345 = next_pos;
var G__26346 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,(new cljs.core.MapEntry(k,v,null)));
i = G__26344;
pos = G__26345;
acc = G__26346;
continue;
}
break;
}
})();
var child_seqs = (function cljs_thread$eve$map$hamt_seq_$_walk_$_step(ci){
return (new cljs.core.LazySeq(null,(function (){
if((ci < child_count)){
var child_off = cljs_thread.eve.map.read_child_offset(off,ci);
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs_thread$eve$map$hamt_seq_$_walk(child_off),cljs_thread$eve$map$hamt_seq_$_walk_$_step((ci + (1))));
} else {
return null;
}
}),null,null));
});
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(inline_entries,child_seqs((0)));

break;
case (3):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(off);
var cnt = cljs_thread.eve.map.r_get_u8((1));
var i = (0);
var pos = (8);
var result = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
return result;
} else {
var vec__25876 = cljs_thread.eve.map.read_kv_at(off,pos);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25876,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25876,(1),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25876,(2),null);
var G__26347 = (i + (1));
var G__26348 = next_pos;
var G__26349 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,(new cljs.core.MapEntry(k,v,null)));
i = G__26347;
pos = G__26348;
result = G__26349;
continue;
}
break;
}

break;
default:
return null;

}
} else {
return null;
}
}),null,null));
})(root_off);
} else {
return null;
}
});
cljs_thread.eve.map.hamt_reduce_depth = (0);
cljs_thread.eve.map.hamt_reduce_visited = null;
cljs_thread.eve.map.hamt_reduce_path = null;
/**
 * Walk HAMT tree calling (f acc k v) at each entry.
 * Supports reduced? for early termination.
 */
cljs_thread.eve.map.hamt_kv_reduce = (function cljs_thread$eve$map$hamt_kv_reduce(root_off,f,init){
if((cljs_thread.eve.map.hamt_reduce_depth === (0))){
(cljs_thread.eve.map.hamt_reduce_visited = (new Set()));

(cljs_thread.eve.map.hamt_reduce_path = []);
} else {
}

(cljs_thread.eve.map.hamt_reduce_depth = (cljs_thread.eve.map.hamt_reduce_depth + (1)));

cljs_thread.eve.map.hamt_reduce_path.push(root_off);

try{if((cljs_thread.eve.map.hamt_reduce_depth > (8))){
throw (new Error(["[hamt-kv-reduce] DEPTH ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.map.hamt_reduce_depth)," (max 7) root-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(root_off)," path=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.map.hamt_reduce_path.join("->"))].join('')));
} else {
}

if(cljs.core.truth_(cljs_thread.eve.map.hamt_reduce_visited.has(root_off))){
throw (new Error(["[hamt-kv-reduce] CYCLE detected! root-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(root_off)," path=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.map.hamt_reduce_path.join("->"))].join('')));
} else {
}

cljs_thread.eve.map.hamt_reduce_visited.add(root_off);

if((root_off === (-1))){
return init;
} else {
var node_type = cljs_thread.eve.map.read_node_type(root_off);
var G__25886 = node_type;
switch (G__25886) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var data_bm = cljs_thread.eve.map.r_get_u32((4));
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var kv_start = cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm);
var acc_after_data = (function (){var i = (0);
var pos = kv_start;
var acc = init;
while(true){
if((((i >= data_count)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var vec__25892 = cljs_thread.eve.map.read_kv_at(root_off,pos);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25892,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25892,(1),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25892,(2),null);
var G__26355 = (i + (1));
var G__26356 = next_pos;
var G__26357 = (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(acc,k,v) : f.call(null, acc,k,v));
i = G__26355;
pos = G__26356;
acc = G__26357;
continue;
}
break;
}
})();
var child_count = cljs_thread.eve.map.popcount32(node_bm);
if(cljs.core.reduced_QMARK_(acc_after_data)){
return acc_after_data;
} else {
var i = (0);
var acc = acc_after_data;
while(true){
if((((i >= child_count)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var child_off = cljs_thread.eve.map.read_child_offset(root_off,i);
var G__26359 = (i + (1));
var G__26360 = (cljs_thread.eve.map.hamt_kv_reduce.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.map.hamt_kv_reduce.cljs$core$IFn$_invoke$arity$3(child_off,f,acc) : cljs_thread.eve.map.hamt_kv_reduce.call(null, child_off,f,acc));
i = G__26359;
acc = G__26360;
continue;
}
break;
}
}

break;
case (3):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var cnt = cljs_thread.eve.map.r_get_u8((1));
var i = (0);
var pos = (8);
var acc = init;
while(true){
if((((i >= cnt)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var vec__25898 = cljs_thread.eve.map.read_kv_at(root_off,pos);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25898,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25898,(1),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25898,(2),null);
var G__26365 = (i + (1));
var G__26367 = next_pos;
var G__26368 = (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(acc,k,v) : f.call(null, acc,k,v));
i = G__26365;
pos = G__26367;
acc = G__26368;
continue;
}
break;
}

break;
default:
return init;

}
}
}finally {cljs_thread.eve.map.hamt_reduce_path.pop();

(cljs_thread.eve.map.hamt_reduce_depth = (cljs_thread.eve.map.hamt_reduce_depth - (1)));

if((cljs_thread.eve.map.hamt_reduce_depth === (0))){
(cljs_thread.eve.map.hamt_reduce_visited = null);

(cljs_thread.eve.map.hamt_reduce_path = null);
} else {
}
}});
cljs_thread.eve.map.CACHE_MAX_SIZE = (128);
/**
 * Lazily initialize cache on a EveHashMap instance. Returns the cache (js/Map).
 */
cljs_thread.eve.map.ensure_cache_BANG_ = (function cljs_thread$eve$map$ensure_cache_BANG_(sab_map){
var or__5045__auto__ = sab_map._cache;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var c = (new Map());
(sab_map._cache = c);

return c;
}
});
/**
 * Get value from cache. Returns [found? value] or nil.
 */
cljs_thread.eve.map.cache_get = (function cljs_thread$eve$map$cache_get(sab_map,k){
var temp__5823__auto__ = sab_map._cache;
if(cljs.core.truth_(temp__5823__auto__)){
var cache = temp__5823__auto__;
if(cljs.core.truth_(cache.has(k))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [true,cache.get(k)], null);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Store value in cache with LRU eviction.
 */
cljs_thread.eve.map.cache_put_BANG_ = (function cljs_thread$eve$map$cache_put_BANG_(sab_map,k,v){
var cache = cljs_thread.eve.map.ensure_cache_BANG_(sab_map);
if((cache.size >= (128))){
var keys_iter_26370 = cache.keys();
var to_delete_26371 = ((128) >>> (2));
var n__5636__auto___26373 = to_delete_26371;
var __26374 = (0);
while(true){
if((__26374 < n__5636__auto___26373)){
var oldest_26375 = keys_iter_26370.next();
if(cljs.core.truth_(oldest_26375.done)){
} else {
cache.delete(oldest_26375.value);
}

var G__26376 = (__26374 + (1));
__26374 = G__26376;
continue;
} else {
}
break;
}
} else {
}

return cache.set(k,v);
});
/**
 * Create a EveHashMap, allocating a 12-byte header block in the slab.
 * The header stores: [type-id:u8 | pad:3 | cnt:i32 | root-off:i32].
 */
cljs_thread.eve.map.make_eve_hash_map = (function cljs_thread$eve$map$make_eve_hash_map(cnt,root_off){
var header_off = cljs_thread.eve.map.alloc_bytes_BANG_((12));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

cljs_thread.eve.map.r_set_u8((0),(237));

cljs_thread.eve.map.r_set_u8((1),(0));

cljs_thread.eve.map.r_set_u8((2),(0));

cljs_thread.eve.map.r_set_u8((3),(0));

cljs_thread.eve.map.r_set_i32((4),cnt);

cljs_thread.eve.map.r_set_i32((8),root_off);

return (new cljs_thread.eve.map.EveHashMap(cnt,root_off,header_off,null,null,null));
});
/**
 * Reconstruct a EveHashMap from an existing header slab-qualified offset.
 * Reads cnt and root-off from the header block.
 */
cljs_thread.eve.map.make_eve_hash_map_from_header = (function cljs_thread$eve$map$make_eve_hash_map_from_header(header_off){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

var cnt = cljs_thread.eve.map.r_get_i32((4));
var root_off = cljs_thread.eve.map.r_get_i32((8));
return (new cljs_thread.eve.map.EveHashMap(cnt,root_off,header_off,null,null,null));
});

/**
* @constructor
 * @implements {cljs_thread.eve.deftype_proto.data.IsEve}
 * @implements {cljs_thread.eve.deftype_proto.data.IDirectSerialize}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEditableCollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabStorable}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabRetirable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.map.EveHashMap = (function (cnt,root_off,header_off,_modified_khs,__hash,_cache){
this.cnt = cnt;
this.root_off = root_off;
this.header_off = header_off;
this._modified_khs = _modified_khs;
this.__hash = __hash;
this._cache = _cache;
this.cljs$lang$protocol_mask$partition0$ = 2164131599;
this.cljs$lang$protocol_mask$partition1$ = 4;
});
(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$IsEve$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((16),self__.header_off);
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$ILookup$_lookup$arity$3(null, k,null);
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this$,k,not_found){
var self__ = this;
var this$__$1 = this;
var temp__5821__auto__ = cljs_thread.eve.map.cache_get(this$__$1,k);
if(cljs.core.truth_(temp__5821__auto__)){
var cached = temp__5821__auto__;
return cljs.core.second(cached);
} else {
var kh = cljs.core.hash(k);
cljs_thread.eve.map.hamt_find(self__.root_off,k,kh,(0));

if(cljs_thread.eve.map.find_result_found_QMARK_){
var v = cljs_thread.eve.map.find_result_val;
(cljs_thread.eve.map.find_result_val = null);

cljs_thread.eve.map.cache_put_BANG_(this$__$1,k,v);

return v;
} else {
return not_found;
}
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var result = cljs_thread.eve.map.hamt_kv_reduce(self__.root_off,f,init);
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this$,writer,opts){
var self__ = this;
var this$__$1 = this;
cljs.core._write(writer,"{");

var s_26383 = cljs.core.seq(this$__$1);
if(s_26383){
var G__25908_26384 = s_26383;
var vec__25909_26385 = G__25908_26384;
var seq__25910_26386 = cljs.core.seq(vec__25909_26385);
var first__25911_26387 = cljs.core.first(seq__25910_26386);
var seq__25910_26388__$1 = cljs.core.next(seq__25910_26386);
var vec__25912_26389 = first__25911_26387;
var k_26390 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25912_26389,(0),null);
var v_26391 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25912_26389,(1),null);
var more_26392 = seq__25910_26388__$1;
var first_QMARK__26393 = true;
var G__25908_26396__$1 = G__25908_26384;
var first_QMARK__26397__$1 = first_QMARK__26393;
while(true){
var vec__25915_26398 = G__25908_26396__$1;
var seq__25916_26399 = cljs.core.seq(vec__25915_26398);
var first__25917_26400 = cljs.core.first(seq__25916_26399);
var seq__25916_26401__$1 = cljs.core.next(seq__25916_26399);
var vec__25918_26402 = first__25917_26400;
var k_26403__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25918_26402,(0),null);
var v_26404__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25918_26402,(1),null);
var more_26405__$1 = seq__25916_26401__$1;
var first_QMARK__26406__$2 = first_QMARK__26397__$1;
if(first_QMARK__26406__$2){
} else {
cljs.core._write(writer,", ");
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([k_26403__$1], 0)));

cljs.core._write(writer," ");

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([v_26404__$1], 0)));

if(more_26405__$1){
var G__26407 = more_26405__$1;
var G__26408 = false;
G__25908_26396__$1 = G__26407;
first_QMARK__26397__$1 = G__26408;
continue;
} else {
}
break;
}
} else {
}

return cljs.core._write(writer,"}");
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return null;
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return new cljs.core.Keyword(null,"eve-hash-map","eve-hash-map",952188876);
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1(null, );
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.root_off,(-1))){
cljs_thread.eve.map.free_hamt_node_BANG_(self__.root_off);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.header_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(self__.header_off);
} else {
return null;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.__hash)){
return self__.__hash;
} else {
var h = cljs.core.hash_unordered_coll(this$__$1);
(self__.__hash = h);

return h;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this$,other){
var self__ = this;
var this$__$1 = this;
return ((cljs.core.map_QMARK_(other)) && ((((self__.cnt === cljs.core.count(other))) && (cljs.core.every_QMARK_((function (p__25921){
var vec__25922 = p__25921;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25922,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25922,(1),null);
cljs_thread.eve.map.hamt_find(self__.root_off,k,cljs.core.hash(k),(0));

return ((cljs_thread.eve.map.find_result_found_QMARK_) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,cljs_thread.eve.map.find_result_val)));
}),other)))));
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
var G__25925 = self__.root_off;
var G__25926 = this$__$1;
var G__25927 = self__.root_off;
var G__25928 = self__.cnt;
var G__25929 = (new Object());
var G__25930 = false;
return (cljs_thread.eve.map.__GT_TransientEveHashMap.cljs$core$IFn$_invoke$arity$6 ? cljs_thread.eve.map.__GT_TransientEveHashMap.cljs$core$IFn$_invoke$arity$6(G__25925,G__25926,G__25927,G__25928,G__25929,G__25930) : cljs_thread.eve.map.__GT_TransientEveHashMap.call(null, G__25925,G__25926,G__25927,G__25928,G__25929,G__25930));
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs_thread.eve.map.make_eve_hash_map((0),(-1));
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
if((self__.cnt === (0))){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));
} else {
var result = cljs_thread.eve.map.hamt_kv_reduce(self__.root_off,(function (acc,k,v){
if((acc == null)){
return (new cljs.core.MapEntry(k,v,null));
} else {
var G__25931 = acc;
var G__25932 = (new cljs.core.MapEntry(k,v,null));
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__25931,G__25932) : f.call(null, G__25931,G__25932));
}
}),null);
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var result = cljs_thread.eve.map.hamt_kv_reduce(self__.root_off,(function (acc,k,v){
var G__25933 = acc;
var G__25934 = (new cljs.core.MapEntry(k,v,null));
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__25933,G__25934) : f.call(null, G__25933,G__25934));
}),init);
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
var kh = cljs.core.hash(k);
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var new_root = cljs_thread.eve.map.hamt_dissoc(self__.root_off,kh,kb,(0));
if((!(cljs_thread.eve.map.hamt_result_removed_QMARK_))){
return this$__$1;
} else {
if((new_root === (-1))){
return cljs_thread.eve.map.make_eve_hash_map((0),(-1));
} else {
var new_map = cljs_thread.eve.map.make_eve_hash_map((self__.cnt - (1)),new_root);
var parent_khs = self__._modified_khs;
var parent_len = (cljs.core.truth_(parent_khs)?parent_khs.length:(0));
if((parent_len <= (8))){
(new_map._modified_khs = (((((parent_khs == null)) || ((parent_len === (0)))))?[kh]:(function (){var khs = parent_khs.slice((0));
khs.push(kh);

return khs;
})()));
} else {
}

return new_map;
}
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.map.EveHashMap.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 = (function (this$,new_value,_slab_env,mode){
var self__ = this;
var this$__$1 = this;
if((new_value instanceof cljs_thread.eve.map.EveHashMap)){
var this_root_26416 = self__.root_off;
var other_root_26417 = new_value.root_off;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(this_root_26416,other_root_26417)){
var G__25935_26418 = mode;
var G__25935_26419__$1 = (((G__25935_26418 instanceof cljs.core.Keyword))?G__25935_26418.fqn:null);
switch (G__25935_26419__$1) {
case "retire":
var modified_khs_26421 = new_value._modified_khs;
if(cljs.core.truth_((function (){var and__5043__auto__ = modified_khs_26421;
if(cljs.core.truth_(and__5043__auto__)){
return (modified_khs_26421.length === (1));
} else {
return and__5043__auto__;
}
})())){
cljs_thread.eve.map.retire_replaced_path_BANG_(this_root_26416,other_root_26417,(modified_khs_26421[(0)]));
} else {
cljs_thread.eve.map.retire_tree_diff_BANG_(this_root_26416,other_root_26417);
}

break;
case "free":
var modified_khs_26423 = self__._modified_khs;
if(cljs.core.truth_((function (){var and__5043__auto__ = modified_khs_26423;
if(cljs.core.truth_(and__5043__auto__)){
return (modified_khs_26423.length === (1));
} else {
return and__5043__auto__;
}
})())){
cljs_thread.eve.map.retire_replaced_path_BANG_(this_root_26416,other_root_26417,(modified_khs_26423[(0)]));
} else {
cljs_thread.eve.map.retire_tree_diff_BANG_(this_root_26416,other_root_26417);
}

break;
default:
cljs_thread.eve.map.retire_tree_diff_BANG_(this_root_26416,other_root_26417);

}
} else {
}
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.root_off,(-1))){
cljs_thread.eve.map.free_hamt_node_BANG_(self__.root_off);
} else {
}
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.header_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(self__.header_off);
} else {
return null;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
var kh = cljs.core.hash(k);
cljs_thread.eve.map.hamt_find(self__.root_off,k,kh,(0));

var found_QMARK_ = cljs_thread.eve.map.find_result_found_QMARK_;
(cljs_thread.eve.map.find_result_val = null);

return found_QMARK_;
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this$,k,v){
var self__ = this;
var this$__$1 = this;
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(v);
var kh = cljs.core.hash(k);
var new_root = cljs_thread.eve.map.hamt_assoc(self__.root_off,kh,kb,vb,(0));
if((new_root === self__.root_off)){
return this$__$1;
} else {
var new_cnt = ((cljs_thread.eve.map.hamt_result_added_QMARK_)?(self__.cnt + (1)):self__.cnt);
var new_map = cljs_thread.eve.map.make_eve_hash_map(new_cnt,new_root);
var parent_khs = self__._modified_khs;
var parent_len = (cljs.core.truth_(parent_khs)?parent_khs.length:(0));
if((parent_len <= (8))){
(new_map._modified_khs = (((((parent_khs == null)) || ((parent_len === (0)))))?[kh]:(function (){var khs = parent_khs.slice((0));
khs.push(kh);

return khs;
})()));
} else {
}

return new_map;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
return cljs_thread.eve.map.hamt_seq(self__.root_off);
} else {
return null;
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this$,_new_meta){
var self__ = this;
var this$__$1 = this;
return this$__$1;
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this$,entry){
var self__ = this;
var this$__$1 = this;
if(cljs.core.vector_QMARK_(entry)){
return this$__$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core.nth.cljs$core$IFn$_invoke$arity$2(entry,(0)),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(entry,(1)));
} else {
if((((!((entry == null))))?(((((entry.cljs$lang$protocol_mask$partition0$ & (2048))) || ((cljs.core.PROTOCOL_SENTINEL === entry.cljs$core$IMapEntry$))))?true:(((!entry.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_(cljs.core.IMapEntry,entry):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IMapEntry,entry))){
return this$__$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core.key(entry),cljs.core.val(entry));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this$__$1,entry);
}
}
}));

(cljs_thread.eve.map.EveHashMap.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__25937 = (arguments.length - (1));
switch (G__25937) {
case (1):
return self__.cljs$core$IFn$_invoke$arity$1((arguments[(1)]));

break;
case (2):
return self__.cljs$core$IFn$_invoke$arity$2((arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((arguments.length - (1)))].join('')));

}
}));

(cljs_thread.eve.map.EveHashMap.prototype.apply = (function (self__,args25901){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args25901)));
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IFn$_invoke$arity$1 = (function (k){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,null);
}));

(cljs_thread.eve.map.EveHashMap.prototype.cljs$core$IFn$_invoke$arity$2 = (function (k,not_found){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,not_found);
}));

(cljs_thread.eve.map.EveHashMap.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"root-off","root-off",1805869236,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_modified_khs","_modified_khs",1904547561,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"__hash","__hash",-1328796629,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"_cache","_cache",2082913559,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null))], null);
}));

(cljs_thread.eve.map.EveHashMap.cljs$lang$type = true);

(cljs_thread.eve.map.EveHashMap.cljs$lang$ctorStr = "cljs-thread.eve.map/EveHashMap");

(cljs_thread.eve.map.EveHashMap.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.map/EveHashMap");
}));

/**
 * Positional factory function for cljs-thread.eve.map/EveHashMap.
 */
cljs_thread.eve.map.__GT_EveHashMap = (function cljs_thread$eve$map$__GT_EveHashMap(cnt,root_off,header_off,_modified_khs,__hash,_cache){
return (new cljs_thread.eve.map.EveHashMap(cnt,root_off,header_off,_modified_khs,__hash,_cache));
});


/**
* @constructor
 * @implements {cljs.core.ITransientMap}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ITransientCollection}
 * @implements {cljs.core.ITransientAssociative}
 * @implements {cljs.core.ILookup}
*/
cljs_thread.eve.map.TransientEveHashMap = (function (initial_root_off,original_persistent,root_offset,cnt,edit,use_ht_QMARK_){
this.initial_root_off = initial_root_off;
this.original_persistent = original_persistent;
this.root_offset = root_offset;
this.cnt = cnt;
this.edit = edit;
this.use_ht_QMARK_ = use_ht_QMARK_;
this.cljs$lang$protocol_mask$partition0$ = 258;
this.cljs$lang$protocol_mask$partition1$ = 56;
});
(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$ILookup$_lookup$arity$3(null, k,null);
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,k,not_found){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var kh = cljs.core.hash(k);
cljs_thread.eve.map.hamt_find(self__.root_offset,k,kh,(0));

if(cljs_thread.eve.map.find_result_found_QMARK_){
var v = cljs_thread.eve.map.find_result_val;
(cljs_thread.eve.map.find_result_val = null);

return v;
} else {
return not_found;
}
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (this$,entry){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

if(cljs.core.vector_QMARK_(entry)){
return this$__$1.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(null, cljs.core.nth.cljs$core$IFn$_invoke$arity$2(entry,(0)),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(entry,(1)));
} else {
if((((!((entry == null))))?(((((entry.cljs$lang$protocol_mask$partition0$ & (2048))) || ((cljs.core.PROTOCOL_SENTINEL === entry.cljs$core$IMapEntry$))))?true:(((!entry.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_(cljs.core.IMapEntry,entry):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IMapEntry,entry))){
return this$__$1.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(null, cljs.core.key(entry),cljs.core.val(entry));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj_BANG_,this$__$1,entry);
}
}
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

(self__.edit = null);

if((self__.root_offset === self__.initial_root_off)){
return self__.original_persistent;
} else {
return cljs_thread.eve.map.make_eve_hash_map(self__.cnt,self__.root_offset);
}
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = (function (this$,k,v){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(v);
var kh = cljs.core.hash(k);
var new_root = cljs_thread.eve.map.hamt_assoc(self__.root_offset,kh,kb,vb,(0));
(self__.root_offset = new_root);

if(cljs_thread.eve.map.hamt_result_added_QMARK_){
(self__.cnt = (self__.cnt + (1)));
} else {
}

return this$__$1;
}));

(cljs_thread.eve.map.TransientEveHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var kh = cljs.core.hash(k);
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var new_root = cljs_thread.eve.map.hamt_dissoc(self__.root_offset,kh,kb,(0));
(self__.root_offset = new_root);

if(cljs_thread.eve.map.hamt_result_removed_QMARK_){
(self__.cnt = (self__.cnt - (1)));
} else {
}

return this$__$1;
}));

(cljs_thread.eve.map.TransientEveHashMap.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"initial-root-off","initial-root-off",1442781022,null),new cljs.core.Symbol(null,"original-persistent","original-persistent",1461994931,null),cljs.core.with_meta(new cljs.core.Symbol(null,"root-offset","root-offset",-669160944,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"edit","edit",-1302639,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"use-ht?","use-ht?",-1306904581,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null))], null);
}));

(cljs_thread.eve.map.TransientEveHashMap.cljs$lang$type = true);

(cljs_thread.eve.map.TransientEveHashMap.cljs$lang$ctorStr = "cljs-thread.eve.map/TransientEveHashMap");

(cljs_thread.eve.map.TransientEveHashMap.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.map/TransientEveHashMap");
}));

/**
 * Positional factory function for cljs-thread.eve.map/TransientEveHashMap.
 */
cljs_thread.eve.map.__GT_TransientEveHashMap = (function cljs_thread$eve$map$__GT_TransientEveHashMap(initial_root_off,original_persistent,root_offset,cnt,edit,use_ht_QMARK_){
return (new cljs_thread.eve.map.TransientEveHashMap(initial_root_off,original_persistent,root_offset,cnt,edit,use_ht_QMARK_));
});

/**
 * Return an empty EVE map.
 */
cljs_thread.eve.map.empty_hash_map = (function cljs_thread$eve$map$empty_hash_map(){
return cljs_thread.eve.map.make_eve_hash_map((0),(-1));
});
/**
 * Build HAMT from CLJS map entries. Returns EveHashMap.
 */
cljs_thread.eve.map.build_hamt_from_cljs = (function cljs_thread$eve$map$build_hamt_from_cljs(m){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.xray.trace_enabled_QMARK_())){
cljs_thread.eve.deftype_proto.xray.slab_xray_validate_BANG_(["PRE build-hamt (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(m))," entries)"].join(''));
} else {
}

if(cljs_thread.eve.deftype_proto.xray.pool_tracking_enabled_QMARK_()){
cljs_thread.eve.deftype_proto.xray.clear_pool_tracking_BANG_();
} else {
}

var state = [(-1),(0)];
(cljs_thread.eve.map.recycle_replaced_nodes_QMARK_ = true);

cljs.core.reduce_kv((function (_,k,v){
var kb = cljs_thread.eve.deftype_proto.serialize.serialize_key(k);
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(v);
var kh = cljs.core.hash(k);
var new_root = cljs_thread.eve.map.hamt_assoc((state[(0)]),kh,kb,vb,(0));
(state[(0)] = new_root);

if(cljs_thread.eve.map.hamt_result_added_QMARK_){
(state[(1)] = ((state[(1)]) + (1)));
} else {
}

return null;
}),null,m);

(cljs_thread.eve.map.recycle_replaced_nodes_QMARK_ = false);

var result = cljs_thread.eve.map.make_eve_hash_map((state[(1)]),(state[(0)]));
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.xray.trace_enabled_QMARK_())){
cljs_thread.eve.deftype_proto.xray.slab_xray_validate_with_pools_BANG_(["POST build-hamt (",cljs.core.str.cljs$core$IFn$_invoke$arity$1((state[(1)]))," entries)"].join(''));
} else {
}

return result;
});
/**
 * Create a new EVE hash-map from key-value pairs.
 */
cljs_thread.eve.map.hash_map = (function cljs_thread$eve$map$hash_map(var_args){
var args__5775__auto__ = [];
var len__5769__auto___26443 = arguments.length;
var i__5770__auto___26444 = (0);
while(true){
if((i__5770__auto___26444 < len__5769__auto___26443)){
args__5775__auto__.push((arguments[i__5770__auto___26444]));

var G__26445 = (i__5770__auto___26444 + (1));
i__5770__auto___26444 = G__26445;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.eve.map.hash_map.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.eve.map.hash_map.cljs$core$IFn$_invoke$arity$variadic = (function (kvs){
if(cljs.core.empty_QMARK_(kvs)){
return cljs_thread.eve.map.empty_hash_map();
} else {
return cljs_thread.eve.map.build_hamt_from_cljs(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,kvs));
}
}));

(cljs_thread.eve.map.hash_map.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.eve.map.hash_map.cljs$lang$applyTo = (function (seq25943){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq25943));
}));

/**
 * Create a EVE map from a collection of [key value] entries.
 */
cljs_thread.eve.map.into_hash_map = (function cljs_thread$eve$map$into_hash_map(entries){
var m = ((cljs.core.map_QMARK_(entries))?entries:cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,entries));
if(cljs.core.empty_QMARK_(m)){
return cljs_thread.eve.map.empty_hash_map();
} else {
return cljs_thread.eve.map.build_hamt_from_cljs(m);
}
});
cljs_thread.eve.map.MIN_PARALLEL_ENTRIES = (1000);
/**
 * Extract top-level child offsets and inline KVs from the root node.
 * Returns {:children [offsets...] :inline-kvs [[k v]...]}.
 */
cljs_thread.eve.map.get_top_level_subtrees = (function cljs_thread$eve$map$get_top_level_subtrees(root_off){
if((root_off === (-1))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"inline-kvs","inline-kvs",-1749447529),cljs.core.PersistentVector.EMPTY], null);
} else {
var node_type = cljs_thread.eve.map.read_node_type(root_off);
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var dv = cljs_thread.eve.deftype_proto.alloc.resolved_dv;
var u8 = cljs_thread.eve.deftype_proto.alloc.resolved_u8;
var base = cljs_thread.eve.deftype_proto.alloc.resolved_base;
if((node_type === (1))){
var data_bm = dv.getUint32((base + (4)),true);
var node_bm = dv.getUint32((base + (8)),true);
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var data_count = cljs_thread.eve.map.popcount32(data_bm);
var children = (function (){var i = (0);
var acc = [];
while(true){
if((i >= child_count)){
return acc;
} else {
var child_off = dv.getInt32(((base + (12)) + (i * (4))),true);
acc.push(child_off);

var G__26449 = (i + (1));
var G__26450 = acc;
i = G__26449;
acc = G__26450;
continue;
}
break;
}
})();
var kv_start = (base + cljs_thread.eve.map.kv_data_start_off(data_bm,node_bm));
var inline_kvs = (function (){var i = (0);
var pos = kv_start;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= data_count)){
return acc;
} else {
var key_len = dv.getUint32(pos,true);
var key_off = (pos + (4));
var val_off = (key_off + key_len);
var val_len = dv.getUint32(val_off,true);
var k = cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data-view","data-view",2142900612),u8], null),dv,key_off,key_len);
var v = cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data-view","data-view",2142900612),u8], null),dv,(val_off + (4)),val_len);
var G__26452 = (i + (1));
var G__26453 = ((val_off + (4)) + val_len);
var G__26454 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v], null));
i = G__26452;
pos = G__26453;
acc = G__26454;
continue;
}
break;
}
})();
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.vec(children),new cljs.core.Keyword(null,"inline-kvs","inline-kvs",-1749447529),inline_kvs], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"children","children",-940561982),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [root_off], null),new cljs.core.Keyword(null,"inline-kvs","inline-kvs",-1749447529),cljs.core.PersistentVector.EMPTY], null);
}
}
});
/**
 * Split offsets vector into n roughly-equal partitions.
 */
cljs_thread.eve.map.partition_offsets = (function cljs_thread$eve$map$partition_offsets(offsets,n){
var total = cljs.core.count(offsets);
var per_partition = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = cljs.core.quot(total,n);
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var remaining = offsets;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if(cljs.core.empty_QMARK_(remaining)){
return acc;
} else {
var chunk = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(per_partition,remaining));
var G__26456 = cljs.core.drop.cljs$core$IFn$_invoke$arity$2(per_partition,remaining);
var G__26457 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,chunk);
remaining = G__26456;
acc = G__26457;
continue;
}
break;
}
});
/**
 * Parallel reduce over a EveHashMap. Splits the HAMT tree at the top level
 * and reduces each subtree independently, then merges results.
 * 
 * Falls back to sequential reduce for small maps.
 * 
 * init-fn:  (fn [] init-val) - called per partition
 * rfn:      (fn [acc k v] acc') - per-entry reduction
 * merge-fn: (fn [acc1 acc2] merged) - combines partition results
 */
cljs_thread.eve.map.preduce = (function cljs_thread$eve$map$preduce(sab_map,init_fn,rfn,merge_fn){
var cnt = sab_map.cnt;
var root_off = sab_map.root_off;
if((cnt < (1000))){
var result = cljs_thread.eve.map.hamt_kv_reduce(root_off,rfn,(init_fn.cljs$core$IFn$_invoke$arity$0 ? init_fn.cljs$core$IFn$_invoke$arity$0() : init_fn.call(null, )));
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
} else {
var map__25979 = cljs_thread.eve.map.get_top_level_subtrees(root_off);
var map__25979__$1 = cljs.core.__destructure_map(map__25979);
var children = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25979__$1,new cljs.core.Keyword(null,"children","children",-940561982));
var inline_kvs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25979__$1,new cljs.core.Keyword(null,"inline-kvs","inline-kvs",-1749447529));
if((cljs.core.count(children) <= (1))){
var result = cljs_thread.eve.map.hamt_kv_reduce(root_off,rfn,(init_fn.cljs$core$IFn$_invoke$arity$0 ? init_fn.cljs$core$IFn$_invoke$arity$0() : init_fn.call(null, )));
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
} else {
var num_partitions = (function (){var x__5133__auto__ = cljs.core.count(children);
var y__5134__auto__ = (4);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var partitions = cljs_thread.eve.map.partition_offsets(children,num_partitions);
var inline_acc = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__25981){
var vec__25983 = p__25981;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25983,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25983,(1),null);
return (rfn.cljs$core$IFn$_invoke$arity$3 ? rfn.cljs$core$IFn$_invoke$arity$3(acc,k,v) : rfn.call(null, acc,k,v));
}),(init_fn.cljs$core$IFn$_invoke$arity$0 ? init_fn.cljs$core$IFn$_invoke$arity$0() : init_fn.call(null, )),inline_kvs);
var partition_results = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (offsets){
var init = (init_fn.cljs$core$IFn$_invoke$arity$0 ? init_fn.cljs$core$IFn$_invoke$arity$0() : init_fn.call(null, ));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,child_off){
var r = cljs_thread.eve.map.hamt_kv_reduce(child_off,rfn,acc);
if(cljs.core.reduced_QMARK_(r)){
return cljs.core.deref(r);
} else {
return r;
}
}),init,offsets);
}),partitions);
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(merge_fn,inline_acc,partition_results);
}
}
});
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_((16),(function (_sab,header_off){
return cljs_thread.eve.map.make_eve_hash_map_from_header(header_off);
}));
cljs_thread.eve.deftype_proto.serialize.register_cljs_to_sab_builder_BANG_(cljs.core.map_QMARK_,(function (m){
return cljs_thread.eve.map.build_hamt_from_cljs(m);
}));
cljs_thread.eve.deftype_proto.serialize.set_direct_map_encoder_BANG_((function (m){
var root = cljs_thread.eve.map.build_hamt_from_cljs(m);
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((16),root.header_off);
}));
cljs_thread.eve.map.HAMT_MAX_DEPTH = (32);
cljs_thread.eve.map.HAMT_MAX_NODES = (1000000);
/**
 * Check if a slab-qualified offset looks valid.
 * Returns nil if valid, error string if invalid.
 */
cljs_thread.eve.map.validate_slab_offset = (function cljs_thread$eve$map$validate_slab_offset(slab_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_off,(-1))){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_off);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_off);
if((((class_idx < (0))) || ((class_idx > (5))))){
return ["invalid class-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx)," (expected 0-5)"].join('');
} else {
if((block_idx < (0))){
return ["negative block-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx)].join('');
} else {
if((block_idx > (10000000))){
return ["suspiciously large block-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx)].join('');
} else {
return null;

}
}
}
} else {
return null;
}
});
/**
 * Validate a single HAMT node. Returns {:valid? bool :errors [...] :children [...]}.
 */
cljs_thread.eve.map.validate_hamt_node = (function cljs_thread$eve$map$validate_hamt_node(slab_off,depth,visited,errors_acc){
if((slab_off === (-1))){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),true,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited], null);
} else {
if((depth > (32))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(errors_acc,["depth ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(depth)," exceeds max ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((32))," at offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off.toString((16))),")"].join(''))], null);
} else {
if(cljs.core.truth_(visited.has(slab_off))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(errors_acc,["cycle detected: offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off.toString((16))),") already visited"].join(''))], null);
} else {
var offset_err = cljs_thread.eve.map.validate_slab_offset(slab_off);
if(cljs.core.truth_(offset_err)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(errors_acc,["invalid offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off.toString((16))),"): ",offset_err].join(''))], null);
} else {
try{var _ = visited.add(slab_off);
var node_type = cljs_thread.eve.map.read_node_type(slab_off);
var G__25999 = node_type;
switch (G__25999) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);
var node_bm = cljs_thread.eve.map.r_get_u32((8));
var child_count = cljs_thread.eve.map.popcount32(node_bm);
var children = (function (){var i = (0);
var acc = [];
while(true){
if((i >= child_count)){
return acc;
} else {
var child_off = cljs_thread.eve.map.read_child_offset(slab_off,i);
acc.push(child_off);

var G__26472 = (i + (1));
var G__26473 = acc;
i = G__26472;
acc = G__26473;
continue;
}
break;
}
})();
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),true,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.vec(children),new cljs.core.Keyword(null,"visited","visited",-1610853875),visited], null);

break;
case (3):
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),true,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited], null);

break;
default:
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(errors_acc,["invalid node type ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(node_type)," at offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off.toString((16))),")"," (expected 1 or 3)"].join(''))], null);

}
}catch (e25998){var e = e25998;
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"children","children",-940561982),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"visited","visited",-1610853875),visited,new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(errors_acc,["exception reading offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slab_off.toString((16))),"): ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e.message)].join(''))], null);
}}

}
}
}
});
/**
 * Walk the HAMT tree from root-off and validate all nodes.
 * Returns {:valid? bool :errors [...] :node-count int :max-depth int}.
 */
cljs_thread.eve.map.validate_hamt_tree = (function cljs_thread$eve$map$validate_hamt_tree(root_off){
var visited = (new Set());
var errors = [];
var node_count = cljs.core.volatile_BANG_((0));
var max_depth = cljs.core.volatile_BANG_((0));
var queue = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [root_off,(0)], null)], null);
while(true){
if(cljs.core.empty_QMARK_(queue)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),(errors.length === (0)),new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(errors)),new cljs.core.Keyword(null,"node-count","node-count",383091297),cljs.core.deref(node_count),new cljs.core.Keyword(null,"max-depth","max-depth",127060793),cljs.core.deref(max_depth)], null);
} else {
var vec__26025 = cljs.core.first(queue);
var off = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26025,(0),null);
var depth = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26025,(1),null);
var rest_queue = cljs.core.rest(queue);
max_depth.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (function (){var x__5130__auto__ = max_depth.cljs$core$IDeref$_deref$arity$1(null, );
var y__5131__auto__ = depth;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})());

if((cljs.core.deref(node_count) > (1000000))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [["exceeded max nodes ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((1000000))," - likely corruption"].join('')], null),new cljs.core.Keyword(null,"node-count","node-count",383091297),cljs.core.deref(node_count),new cljs.core.Keyword(null,"max-depth","max-depth",127060793),cljs.core.deref(max_depth)], null);
} else {
var result = cljs_thread.eve.map.validate_hamt_node(off,depth,visited,errors);
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))){
} else {
var seq__26028_26484 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result));
var chunk__26029_26485 = null;
var count__26030_26486 = (0);
var i__26031_26487 = (0);
while(true){
if((i__26031_26487 < count__26030_26486)){
var e_26488 = chunk__26029_26485.cljs$core$IIndexed$_nth$arity$2(null, i__26031_26487);
errors.push(e_26488);


var G__26490 = seq__26028_26484;
var G__26491 = chunk__26029_26485;
var G__26492 = count__26030_26486;
var G__26493 = (i__26031_26487 + (1));
seq__26028_26484 = G__26490;
chunk__26029_26485 = G__26491;
count__26030_26486 = G__26492;
i__26031_26487 = G__26493;
continue;
} else {
var temp__5823__auto___26495 = cljs.core.seq(seq__26028_26484);
if(temp__5823__auto___26495){
var seq__26028_26496__$1 = temp__5823__auto___26495;
if(cljs.core.chunked_seq_QMARK_(seq__26028_26496__$1)){
var c__5568__auto___26497 = cljs.core.chunk_first(seq__26028_26496__$1);
var G__26498 = cljs.core.chunk_rest(seq__26028_26496__$1);
var G__26499 = c__5568__auto___26497;
var G__26500 = cljs.core.count(c__5568__auto___26497);
var G__26501 = (0);
seq__26028_26484 = G__26498;
chunk__26029_26485 = G__26499;
count__26030_26486 = G__26500;
i__26031_26487 = G__26501;
continue;
} else {
var e_26503 = cljs.core.first(seq__26028_26496__$1);
errors.push(e_26503);


var G__26504 = cljs.core.next(seq__26028_26496__$1);
var G__26505 = null;
var G__26506 = (0);
var G__26507 = (0);
seq__26028_26484 = G__26504;
chunk__26029_26485 = G__26505;
count__26030_26486 = G__26506;
i__26031_26487 = G__26507;
continue;
}
} else {
}
}
break;
}
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(off,(-1))){
node_count.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (node_count.cljs$core$IDeref$_deref$arity$1(null, ) + (1)));
} else {
}

var children = new cljs.core.Keyword(null,"children","children",-940561982).cljs$core$IFn$_invoke$arity$1(result);
var new_queue = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (queue,children,result,vec__26025,off,depth,rest_queue,visited,errors,node_count,max_depth){
return (function (q,child_off){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(q,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [child_off,(depth + (1))], null));
});})(queue,children,result,vec__26025,off,depth,rest_queue,visited,errors,node_count,max_depth))
,cljs.core.vec(rest_queue),children);
var G__26508 = new_queue;
queue = G__26508;
continue;
}
}
break;
}
});
/**
 * Validate an EveHashMap's HAMT tree structure.
 * Returns {:valid? bool :errors [...] :node-count int :max-depth int}.
 */
cljs_thread.eve.map.validate_eve_hash_map = (function cljs_thread$eve$map$validate_eve_hash_map(eve_map){
var header_off = eve_map.header_off;
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(header_off);
var root_off = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((base + (8)),true);
return cljs_thread.eve.map.validate_hamt_tree(root_off);
});
/**
 * Validate HAMT tree given an EveHashMap header slab-qualified offset.
 * Resolves the header, reads root-off, and validates the tree.
 * Returns {:valid? bool :errors [...] :node-count int :max-depth int :root-off int}.
 */
cljs_thread.eve.map.validate_from_header_offset = (function cljs_thread$eve$map$validate_from_header_offset(header_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(header_off);
var root_off = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((base + (8)),true);
var result = cljs_thread.eve.map.validate_hamt_tree(root_off);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(result,new cljs.core.Keyword(null,"root-off","root-off",165337709),root_off);
});
cljs_thread.eve.shared_atom.register_xray_hamt_validator_BANG_(cljs_thread.eve.map.validate_from_header_offset);

//# sourceMappingURL=cljs_thread.eve.map.js.map
