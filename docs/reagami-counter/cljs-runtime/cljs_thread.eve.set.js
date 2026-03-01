goog.provide('cljs_thread.eve.set');





cljs_thread.eve.set.SHIFT_STEP = (5);
cljs_thread.eve.set.MASK = (31);
cljs_thread.eve.set.NODE_TYPE_BITMAP = (1);
cljs_thread.eve.set.NODE_TYPE_COLLISION = (2);
cljs_thread.eve.set.NODE_HEADER_SIZE = (12);
cljs_thread.eve.set.MAX_POOL_SIZE = (512);
cljs_thread.eve.set.BATCH_ALLOC_SIZE = (64);
/**
 * Find the appropriate size class for a given allocation size.
 */
cljs_thread.eve.set.size_class_for = (function cljs_thread$eve$set$size_class_for(n){
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
cljs_thread.eve.set.pool_64 = [];
cljs_thread.eve.set.pool_128 = [];
cljs_thread.eve.set.pool_256 = [];
cljs_thread.eve.set.pool_512 = [];
/**
 * Reset global node pools.
 * Must be called when switching to a new slab environment.
 */
cljs_thread.eve.set.reset_pools_BANG_ = (function cljs_thread$eve$set$reset_pools_BANG_(){
(cljs_thread.eve.set.pool_64 = []);

(cljs_thread.eve.set.pool_128 = []);

(cljs_thread.eve.set.pool_256 = []);

return (cljs_thread.eve.set.pool_512 = []);
});
/**
 * Free all pooled blocks and reset pools.
 */
cljs_thread.eve.set.drain_pools_BANG_ = (function cljs_thread$eve$set$drain_pools_BANG_(){
var seq__24040_25489 = cljs.core.seq(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.set.pool_64,cljs_thread.eve.set.pool_128,cljs_thread.eve.set.pool_256,cljs_thread.eve.set.pool_512], null));
var chunk__24041_25490 = null;
var count__24042_25491 = (0);
var i__24043_25492 = (0);
while(true){
if((i__24043_25492 < count__24042_25491)){
var pool_25493 = chunk__24041_25490.cljs$core$IIndexed$_nth$arity$2(null, i__24043_25492);
var n__5636__auto___25494 = pool_25493.length;
var i_25497 = (0);
while(true){
if((i_25497 < n__5636__auto___25494)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25493[i_25497]));

var G__25498 = (i_25497 + (1));
i_25497 = G__25498;
continue;
} else {
}
break;
}


var G__25499 = seq__24040_25489;
var G__25500 = chunk__24041_25490;
var G__25501 = count__24042_25491;
var G__25502 = (i__24043_25492 + (1));
seq__24040_25489 = G__25499;
chunk__24041_25490 = G__25500;
count__24042_25491 = G__25501;
i__24043_25492 = G__25502;
continue;
} else {
var temp__5823__auto___25503 = cljs.core.seq(seq__24040_25489);
if(temp__5823__auto___25503){
var seq__24040_25504__$1 = temp__5823__auto___25503;
if(cljs.core.chunked_seq_QMARK_(seq__24040_25504__$1)){
var c__5568__auto___25506 = cljs.core.chunk_first(seq__24040_25504__$1);
var G__25507 = cljs.core.chunk_rest(seq__24040_25504__$1);
var G__25508 = c__5568__auto___25506;
var G__25509 = cljs.core.count(c__5568__auto___25506);
var G__25510 = (0);
seq__24040_25489 = G__25507;
chunk__24041_25490 = G__25508;
count__24042_25491 = G__25509;
i__24043_25492 = G__25510;
continue;
} else {
var pool_25511 = cljs.core.first(seq__24040_25504__$1);
var n__5636__auto___25513 = pool_25511.length;
var i_25514 = (0);
while(true){
if((i_25514 < n__5636__auto___25513)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25511[i_25514]));

var G__25515 = (i_25514 + (1));
i_25514 = G__25515;
continue;
} else {
}
break;
}


var G__25516 = cljs.core.next(seq__24040_25504__$1);
var G__25517 = null;
var G__25518 = (0);
var G__25519 = (0);
seq__24040_25489 = G__25516;
chunk__24041_25490 = G__25517;
count__24042_25491 = G__25518;
i__24043_25492 = G__25519;
continue;
}
} else {
}
}
break;
}

(cljs_thread.eve.set.pool_64 = []);

(cljs_thread.eve.set.pool_128 = []);

(cljs_thread.eve.set.pool_256 = []);

return (cljs_thread.eve.set.pool_512 = []);
});
/**
 * Try to get a slab-qualified offset from the pool. Returns offset or nil.
 */
cljs_thread.eve.set.pool_get_BANG_ = (function cljs_thread$eve$set$pool_get_BANG_(size_class){
var stack = (function (){var G__24091 = size_class;
switch (G__24091) {
case (64):
return cljs_thread.eve.set.pool_64;

break;
case (128):
return cljs_thread.eve.set.pool_128;

break;
case (256):
return cljs_thread.eve.set.pool_256;

break;
case (512):
return cljs_thread.eve.set.pool_512;

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
return stack.pop();
} else {
return null;
}
});
/**
 * Add a slab-qualified offset to the pool. Returns true if added, false if pool is full.
 */
cljs_thread.eve.set.pool_put_BANG_ = (function cljs_thread$eve$set$pool_put_BANG_(size_class,slab_offset){
var stack = (function (){var G__24099 = size_class;
switch (G__24099) {
case (64):
return cljs_thread.eve.set.pool_64;

break;
case (128):
return cljs_thread.eve.set.pool_128;

break;
case (256):
return cljs_thread.eve.set.pool_256;

break;
case (512):
return cljs_thread.eve.set.pool_512;

break;
default:
return null;

}
})();
if(cljs.core.truth_(stack)){
if((stack.length < (512))){
stack.push(slab_offset);

return true;
} else {
return false;
}
} else {
return null;
}
});
/**
 * Allocate n bytes, rounded up to nearest size class.
 * Returns a slab-qualified offset.
 */
cljs_thread.eve.set.alloc_bytes_BANG_ = (function cljs_thread$eve$set$alloc_bytes_BANG_(n){
var size_class = cljs_thread.eve.set.size_class_for(n);
if(cljs.core.truth_(size_class)){
var temp__5821__auto__ = cljs_thread.eve.set.pool_get_BANG_(size_class);
if(cljs.core.truth_(temp__5821__auto__)){
var pooled = temp__5821__auto__;
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
cljs_thread.eve.set.drain_pools_BANG_();

return cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(64));
})()
);
var len = (cljs.core.truth_(results__$1)?results__$1.length:(0));
if((len === (0))){
throw (new Error(["Set allocation failed: out of memory for ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_class)," bytes"].join('')));
} else {
}

var i_25522 = (1);
while(true){
if((i_25522 < len)){
cljs_thread.eve.set.pool_put_BANG_(size_class,(results__$1[i_25522]));

var G__25523 = (i_25522 + (1));
i_25522 = G__25523;
continue;
} else {
}
break;
}

return (results__$1[(0)]);
}
} else {
return cljs_thread.eve.deftype_proto.alloc.alloc_offset(n);
}
});
/**
 * Try to add a freed block to the pool. If pool is full, actually free it.
 */
cljs_thread.eve.set.maybe_pool_or_free_BANG_ = (function cljs_thread$eve$set$maybe_pool_or_free_BANG_(slab_offset,size){
var size_class = cljs_thread.eve.set.size_class_for(size);
if(cljs.core.truth_((function (){var and__5043__auto__ = size_class;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.eve.set.pool_put_BANG_(size_class,slab_offset);
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
/**
 * Get the block size for a slab-qualified offset, for pool/free routing.
 */
cljs_thread.eve.set.node_size_for_free = (function cljs_thread$eve$set$node_size_for_free(slab_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_off);
if((class_idx < (6))){
return (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
} else {
return (0);
}
});
/**
 * Recursively free a HAMT node and all its children.
 */
cljs_thread.eve.set.free_hamt_node_BANG_ = (function cljs_thread$eve$set$free_hamt_node_BANG_(slab_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_off,(-1))){
var node_type = (function (){var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8(base);
})();
var G__24137 = node_type;
switch (G__24137) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm));
var n__5636__auto___25528 = child_count;
var i_25529 = (0);
while(true){
if((i_25529 < n__5636__auto___25528)){
var child_off_25530 = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32(((base + (12)) + (i_25529 * (4))),true);
(cljs_thread.eve.set.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1(child_off_25530) : cljs_thread.eve.set.free_hamt_node_BANG_.call(null, child_off_25530));

var G__25531 = (i_25529 + (1));
i_25529 = G__25531;
continue;
} else {
}
break;
}

var size = cljs_thread.eve.set.node_size_for_free(slab_off);
if((size > (0))){
return cljs_thread.eve.set.maybe_pool_or_free_BANG_(slab_off,size);
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);
}

break;
case (2):
var size = cljs_thread.eve.set.node_size_for_free(slab_off);
if((size > (0))){
return cljs_thread.eve.set.maybe_pool_or_free_BANG_(slab_off,size);
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);
}

break;
default:
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);

}
} else {
return null;
}
});
/**
 * Copy bytes from a slab-qualified offset + byte-within-block into a new Uint8Array.
 */
cljs_thread.eve.set.copy_from_sab = (function cljs_thread$eve$set$copy_from_sab(slab_off,byte_off,len){
var src = cljs_thread.eve.deftype_proto.alloc.read_bytes(slab_off,byte_off,len);
var dst = (new Uint8Array(len));
dst.set(src);

return dst;
});
cljs_thread.eve.set.r_get_u8 = (function cljs_thread$eve$set$r_get_u8(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off));
});
cljs_thread.eve.set.r_get_u32 = (function cljs_thread$eve$set$r_get_u32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.set.r_get_i32 = (function cljs_thread$eve$set$r_get_i32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.set.r_set_u8 = (function cljs_thread$eve$set$r_set_u8(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val);
});
cljs_thread.eve.set.r_set_u16 = (function cljs_thread$eve$set$r_set_u16(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint16((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.set.r_set_u32 = (function cljs_thread$eve$set$r_set_u32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.set.r_set_i32 = (function cljs_thread$eve$set$r_set_i32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.set.popcount32 = cljs_thread.eve.deftype_proto.simd.popcount32;
/**
 * Read node type byte from a slab-qualified offset.
 */
cljs_thread.eve.set.read_node_type = (function cljs_thread$eve$set$read_node_type(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8(base);
});
/**
 * Read node bitmap (u32 at offset+8).
 */
cljs_thread.eve.set.read_node_bitmap = (function cljs_thread$eve$set$read_node_bitmap(slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
});
/**
 * Read child pointer (i32) at child-idx within a node.
 * The child pointer is itself a slab-qualified offset.
 */
cljs_thread.eve.set.read_child_offset = (function cljs_thread$eve$set$read_child_offset(slab_off,child_idx){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32(((base + (12)) + (child_idx * (4))),true);
});
/**
 * Calculate offset-within-node where value data starts for given node_bitmap.
 */
cljs_thread.eve.set.val_data_start = (function cljs_thread$eve$set$val_data_start(node_bm){
return ((12) + ((4) * (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm))));
});
cljs_thread.eve.set.has_data_QMARK_ = (function cljs_thread$eve$set$has_data_QMARK_(data_bm,bit_pos){
return (!(((data_bm & ((1) << bit_pos)) === (0))));
});
cljs_thread.eve.set.has_node_QMARK_ = (function cljs_thread$eve$set$has_node_QMARK_(node_bm,bit_pos){
return (!(((node_bm & ((1) << bit_pos)) === (0))));
});
cljs_thread.eve.set.get_data_idx = (function cljs_thread$eve$set$get_data_idx(data_bm,bit_pos){
var G__24216 = (data_bm & (((1) << bit_pos) - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__24216) : cljs_thread.eve.set.popcount32.call(null, G__24216));
});
cljs_thread.eve.set.get_child_idx = (function cljs_thread$eve$set$get_child_idx(node_bm,bit_pos){
var G__24221 = (node_bm & (((1) << bit_pos) - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__24221) : cljs_thread.eve.set.popcount32.call(null, G__24221));
});
/**
 * Skip over a value entry at pos-in-node. Returns next pos-in-node.
 */
cljs_thread.eve.set.skip_val_at = (function cljs_thread$eve$set$skip_val_at(pos){
var len = cljs_thread.eve.set.r_get_u32(pos);
return ((pos + (4)) + len);
});
/**
 * Read a value from the given offset within a resolved node. Returns [value next-offset-in-node].
 * Uses zero-copy deserialization — reads directly from the resolved DataView.
 */
cljs_thread.eve.set.read_val_at = (function cljs_thread$eve$set$read_val_at(slab_off,val_off_in_node){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

var val_len = cljs_thread.eve.set.r_get_u32(val_off_in_node);
var val_start = (val_off_in_node + (4));
var val_bytes = cljs_thread.eve.set.copy_from_sab(slab_off,val_start,val_len);
var val_val = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
var next_off = (val_start + val_len);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [val_val,next_off], null);
});
/**
 * Write a value at pos-in-node within a resolved node. Returns next pos-in-node after written data.
 */
cljs_thread.eve.set.write_val_BANG_ = (function cljs_thread$eve$set$write_val_BANG_(pos,val_bytes){
var val_len = val_bytes.length;
cljs_thread.eve.set.r_set_u32(pos,val_len);

if((val_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(val_bytes,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos) + (4)));
} else {
}

return ((pos + (4)) + val_len);
});
/**
 * Read value at data index within a bitmap node.
 */
cljs_thread.eve.set.get_val_at_idx = (function cljs_thread$eve$set$get_val_at_idx(slab_off,data_bm,node_bm,idx){
var vs = cljs_thread.eve.set.val_data_start(node_bm);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

var i = (0);
var pos = vs;
while(true){
if((i === idx)){
var vec__24252 = cljs_thread.eve.set.read_val_at(slab_off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24252,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24252,(1),null);
return v;
} else {
var G__25535 = (i + (1));
var G__25536 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25535;
pos = G__25536;
continue;
}
break;
}
});
/**
 * Calculate total bytes used by all values in a bitmap node.
 */
cljs_thread.eve.set.calc_node_val_total_size = (function cljs_thread$eve$set$calc_node_val_total_size(slab_off,data_bm,node_bm){
var vs = cljs_thread.eve.set.val_data_start(node_bm);
var val_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(data_bm) : cljs_thread.eve.set.popcount32.call(null, data_bm));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

var i = (0);
var pos = vs;
while(true){
if((i >= val_count)){
return (pos - vs);
} else {
var G__25538 = (i + (1));
var G__25539 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25538;
pos = G__25539;
continue;
}
break;
}
});
/**
 * Create bitmap node, copying value data directly from source node.
 * If update-child-idx >= 0, replaces that child with new-child-off.
 * Source and destination may be in different slabs.
 */
cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_ = (function cljs_thread$eve$set$make_bitmap_node_with_raw_val_BANG_(var_args){
var G__24276 = arguments.length;
switch (G__24276) {
case 5:
return cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 7:
return cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm){
return cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm,(-1),(-1));
}));

(cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$7 = (function (data_bm,node_bm,src_slab_off,src_data_bm,src_node_bm,update_child_idx,new_child_off){
var child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm));
var existing_val_size = cljs_thread.eve.set.calc_node_val_total_size(src_slab_off,src_data_bm,src_node_bm);
var node_size = (((12) + ((4) * child_count)) + existing_val_size);
var dst_slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),data_bm);

cljs_thread.eve.set.r_set_u32((8),node_bm);

var n__5636__auto___25551 = child_count;
var i_25552 = (0);
while(true){
if((i_25552 < n__5636__auto___25551)){
var child_off_25553 = (((i_25552 === update_child_idx))?new_child_off:cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25552 * (4)))));
cljs_thread.eve.set.r_set_i32(((12) + (i_25552 * (4))),child_off_25553);

var G__25554 = (i_25552 + (1));
i_25552 = G__25554;
continue;
} else {
}
break;
}

var src_vs_25555 = cljs_thread.eve.set.val_data_start(src_node_bm);
var dst_vs_25556 = cljs_thread.eve.set.val_data_start(node_bm);
if((existing_val_size > (0))){
var src_bytes_25557 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_vs_25555,existing_val_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25557,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_vs_25556));
} else {
}

return dst_slab_off;
}));

(cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$lang$maxFixedArity = 7);

/**
 * Create bitmap node adding a new inline value at insert-idx.
 * Copies existing values from source and inserts new value.
 */
cljs_thread.eve.set.make_bitmap_node_with_added_val_BANG_ = (function cljs_thread$eve$set$make_bitmap_node_with_added_val_BANG_(new_data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,insert_idx,vb){
var src_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(src_node_bm) : cljs_thread.eve.set.popcount32.call(null, src_node_bm));
var dst_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(new_node_bm) : cljs_thread.eve.set.popcount32.call(null, new_node_bm));
var data_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(src_data_bm) : cljs_thread.eve.set.popcount32.call(null, src_data_bm));
var src_val_size = cljs_thread.eve.set.calc_node_val_total_size(src_slab_off,src_data_bm,src_node_bm);
var new_val_size = ((4) + vb.length);
var node_size = ((((12) + ((4) * dst_child_count)) + src_val_size) + new_val_size);
var dst_slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),new_data_bm);

cljs_thread.eve.set.r_set_u32((8),new_node_bm);

var n__5636__auto___25561 = src_child_count;
var i_25562 = (0);
while(true){
if((i_25562 < n__5636__auto___25561)){
cljs_thread.eve.set.r_set_i32(((12) + (i_25562 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25562 * (4)))));

var G__25563 = (i_25562 + (1));
i_25562 = G__25563;
continue;
} else {
}
break;
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_vs_25564 = cljs_thread.eve.set.val_data_start(src_node_bm);
var positions_25565 = (function (){var i = (0);
var pos = src_vs_25564;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.set.skip_val_at(pos);
acc.push([pos,(next - pos)]);

var G__25566 = (i + (1));
var G__25567 = next;
var G__25568 = acc;
i = G__25566;
pos = G__25567;
acc = G__25568;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var dst_vs_25569 = cljs_thread.eve.set.val_data_start(new_node_bm);
var src_i_25570 = (0);
var dst_pos_25571 = dst_vs_25569;
var inserted_QMARK__25572 = false;
while(true){
var dst_i_25573 = (src_i_25570 + (cljs.core.truth_(inserted_QMARK__25572)?(1):(0)));
if((((src_i_25570 === insert_idx)) && (cljs.core.not(inserted_QMARK__25572)))){
var next_dst_25575 = cljs_thread.eve.set.write_val_BANG_(dst_pos_25571,vb);
var G__25576 = src_i_25570;
var G__25577 = next_dst_25575;
var G__25578 = true;
src_i_25570 = G__25576;
dst_pos_25571 = G__25577;
inserted_QMARK__25572 = G__25578;
continue;
} else {
if((src_i_25570 >= data_count)){
if(cljs.core.truth_(inserted_QMARK__25572)){
} else {
cljs_thread.eve.set.write_val_BANG_(dst_pos_25571,vb);
}
} else {
var entry_25580 = (positions_25565[src_i_25570]);
var src_pos_25581 = (entry_25580[(0)]);
var val_len_25582 = (entry_25580[(1)]);
var src_bytes_25583 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_25581,val_len_25582);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25583,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_25571));

var G__25586 = (src_i_25570 + (1));
var G__25587 = (dst_pos_25571 + val_len_25582);
var G__25588 = inserted_QMARK__25572;
src_i_25570 = G__25586;
dst_pos_25571 = G__25587;
inserted_QMARK__25572 = G__25588;
continue;

}
}
break;
}

return dst_slab_off;
});
/**
 * Create bitmap node with value at remove-idx removed, optionally inserting a new child.
 */
cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_ = (function cljs_thread$eve$set$make_bitmap_node_removing_val_BANG_(var_args){
var G__24390 = arguments.length;
switch (G__24390) {
case 6:
return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
case 8:
return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$8((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),(arguments[(7)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$6 = (function (new_data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_idx){
return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$8(new_data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_idx,(-1),(-1));
}));

(cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$8 = (function (new_data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_idx,insert_child_idx,new_child_off){
var src_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(src_node_bm) : cljs_thread.eve.set.popcount32.call(null, src_node_bm));
var dst_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(new_node_bm) : cljs_thread.eve.set.popcount32.call(null, new_node_bm));
var data_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(src_data_bm) : cljs_thread.eve.set.popcount32.call(null, src_data_bm));
var src_val_size = cljs_thread.eve.set.calc_node_val_total_size(src_slab_off,src_data_bm,src_node_bm);
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);
var removed_val_size = (function (){var vs = cljs_thread.eve.set.val_data_start(src_node_bm);
var i = (0);
var pos = vs;
while(true){
if((i === remove_idx)){
return (cljs_thread.eve.set.skip_val_at(pos) - pos);
} else {
var G__25593 = (i + (1));
var G__25594 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25593;
pos = G__25594;
continue;
}
break;
}
})();
var new_val_size = (src_val_size - removed_val_size);
var node_size = (((12) + ((4) * dst_child_count)) + new_val_size);
var dst_slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),new_data_bm);

cljs_thread.eve.set.r_set_u32((8),new_node_bm);

if((insert_child_idx >= (0))){
var src_i_25596 = (0);
var dst_i_25597 = (0);
while(true){
if((dst_i_25597 >= dst_child_count)){
} else {
if((dst_i_25597 === insert_child_idx)){
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25597 * (4))),new_child_off);

var G__25600 = src_i_25596;
var G__25601 = (dst_i_25597 + (1));
src_i_25596 = G__25600;
dst_i_25597 = G__25601;
continue;
} else {
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25597 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_25596 * (4)))));

var G__25604 = (src_i_25596 + (1));
var G__25605 = (dst_i_25597 + (1));
src_i_25596 = G__25604;
dst_i_25597 = G__25605;
continue;

}
}
break;
}
} else {
var n__5636__auto___25606 = src_child_count;
var i_25607 = (0);
while(true){
if((i_25607 < n__5636__auto___25606)){
cljs_thread.eve.set.r_set_i32(((12) + (i_25607 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25607 * (4)))));

var G__25609 = (i_25607 + (1));
i_25607 = G__25609;
continue;
} else {
}
break;
}
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_vs_25611 = cljs_thread.eve.set.val_data_start(src_node_bm);
var positions_25612 = (function (){var i = (0);
var pos = src_vs_25611;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.set.skip_val_at(pos);
acc.push([pos,(next - pos)]);

var G__25615 = (i + (1));
var G__25616 = next;
var G__25617 = acc;
i = G__25615;
pos = G__25616;
acc = G__25617;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var dst_vs_25621 = cljs_thread.eve.set.val_data_start(new_node_bm);
var i_25623 = (0);
var dst_pos_25624 = dst_vs_25621;
while(true){
if((i_25623 < data_count)){
var entry_25625 = (positions_25612[i_25623]);
var src_pos_25626 = (entry_25625[(0)]);
var val_len_25627 = (entry_25625[(1)]);
if((i_25623 === remove_idx)){
var G__25628 = (i_25623 + (1));
var G__25629 = dst_pos_25624;
i_25623 = G__25628;
dst_pos_25624 = G__25629;
continue;
} else {
var src_bytes_25630 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_25626,val_len_25627);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25630,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_25624));

var G__25631 = (i_25623 + (1));
var G__25632 = (dst_pos_25624 + val_len_25627);
i_25623 = G__25631;
dst_pos_25624 = G__25632;
continue;
}
} else {
}
break;
}

return dst_slab_off;
}));

(cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$lang$maxFixedArity = 8);

/**
 * Create bitmap node with a child removed (for disj).
 */
cljs_thread.eve.set.make_bitmap_node_removing_child_BANG_ = (function cljs_thread$eve$set$make_bitmap_node_removing_child_BANG_(data_bm,new_node_bm,src_slab_off,src_data_bm,src_node_bm,remove_child_idx){
var src_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(src_node_bm) : cljs_thread.eve.set.popcount32.call(null, src_node_bm));
var dst_child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(new_node_bm) : cljs_thread.eve.set.popcount32.call(null, new_node_bm));
var val_size = cljs_thread.eve.set.calc_node_val_total_size(src_slab_off,src_data_bm,src_node_bm);
var node_size = (((12) + ((4) * dst_child_count)) + val_size);
var dst_slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),data_bm);

cljs_thread.eve.set.r_set_u32((8),new_node_bm);

var src_i_25633 = (0);
var dst_i_25634 = (0);
while(true){
if((src_i_25633 < src_child_count)){
if((src_i_25633 === remove_child_idx)){
var G__25636 = (src_i_25633 + (1));
var G__25637 = dst_i_25634;
src_i_25633 = G__25636;
dst_i_25634 = G__25637;
continue;
} else {
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25634 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_25633 * (4)))));

var G__25638 = (src_i_25633 + (1));
var G__25639 = (dst_i_25634 + (1));
src_i_25633 = G__25638;
dst_i_25634 = G__25639;
continue;
}
} else {
}
break;
}

var src_vs_25640 = cljs_thread.eve.set.val_data_start(src_node_bm);
var dst_vs_25641 = cljs_thread.eve.set.val_data_start(new_node_bm);
if((val_size > (0))){
var src_bytes_25642 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_vs_25640,val_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25642,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_vs_25641));
} else {
}

return dst_slab_off;
});
/**
 * Create a bitmap node with single inline value.
 */
cljs_thread.eve.set.make_single_val_bitmap_node_BANG_ = (function cljs_thread$eve$set$make_single_val_bitmap_node_BANG_(bit_pos,vb){
var data_bm = ((1) << bit_pos);
var val_len = vb.length;
var node_size = (((12) + (4)) + val_len);
var slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),data_bm);

cljs_thread.eve.set.r_set_u32((8),(0));

cljs_thread.eve.set.r_set_u32((12),val_len);

if((val_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(vb,((cljs_thread.eve.deftype_proto.alloc.resolved_base + (12)) + (4)));
} else {
}

return slab_off;
});
/**
 * Create a bitmap node with two inline values at different bit positions.
 */
cljs_thread.eve.set.make_two_val_bitmap_node_BANG_ = (function cljs_thread$eve$set$make_two_val_bitmap_node_BANG_(bit_pos1,vb1,bit_pos2,vb2){
var vec__24533 = (((bit_pos1 < bit_pos2))?new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [bit_pos1,vb1,bit_pos2,vb2], null):new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [bit_pos2,vb2,bit_pos1,vb1], null));
var first_bpos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24533,(0),null);
var first_vb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24533,(1),null);
var second_bpos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24533,(2),null);
var second_vb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24533,(3),null);
var data_bm = (((1) << first_bpos) | ((1) << second_bpos));
var val1_len = first_vb.length;
var val2_len = second_vb.length;
var node_size = (((((12) + (4)) + val1_len) + (4)) + val2_len);
var slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),data_bm);

cljs_thread.eve.set.r_set_u32((8),(0));

var pos1_25646 = (12);
cljs_thread.eve.set.r_set_u32(pos1_25646,val1_len);

if((val1_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(first_vb,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos1_25646) + (4)));
} else {
}

var pos2_25647 = ((pos1_25646 + (4)) + val1_len);
cljs_thread.eve.set.r_set_u32(pos2_25647,val2_len);

if((val2_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(second_vb,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos2_25647) + (4)));
} else {
}

return slab_off;
});
/**
 * Create a collision node for values with same hash.
 */
cljs_thread.eve.set.make_collision_node_BANG_ = (function cljs_thread$eve$set$make_collision_node_BANG_(hash_val,val_bytes_seq){
var cnt = cljs.core.count(val_bytes_seq);
var entries_size = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,vb){
return ((acc + (4)) + vb.length);
}),(0),val_bytes_seq);
var node_size = ((12) + entries_size);
var slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.set.r_set_u8((0),(2));

cljs_thread.eve.set.r_set_u8((1),cnt);

cljs_thread.eve.set.r_set_u32((2),hash_val);

cljs_thread.eve.set.r_set_u32((8),(0));

var vs_25650 = cljs.core.seq(val_bytes_seq);
var pos_25651 = (12);
while(true){
if(vs_25650){
var vb_25652 = cljs.core.first(vs_25650);
var vlen_25653 = vb_25652.length;
cljs_thread.eve.set.r_set_u32(pos_25651,vlen_25653);

if((vlen_25653 > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(vb_25652,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos_25651) + (4)));
} else {
}

var G__25654 = cljs.core.next(vs_25650);
var G__25655 = ((pos_25651 + (4)) + vlen_25653);
vs_25650 = G__25654;
pos_25651 = G__25655;
continue;
} else {
}
break;
}

return slab_off;
});
/**
 * Look up value in HAMT. Returns found?.
 */
cljs_thread.eve.set.hamt_find = (function cljs_thread$eve$set$hamt_find(root_off,v,vh,shift){
while(true){
if((root_off === (-1))){
return false;
} else {
var node_type = cljs_thread.eve.set.read_node_type(root_off);
var G__24565 = node_type;
switch (G__24565) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(root_off);
var data_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var bit_pos = ((vh >>> shift) & (31));
if(cljs_thread.eve.set.has_data_QMARK_(data_bm,bit_pos)){
var idx = cljs_thread.eve.set.get_data_idx(data_bm,bit_pos);
var found_v = cljs_thread.eve.set.get_val_at_idx(root_off,data_bm,node_bm,idx);
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,found_v);
} else {
if(cljs_thread.eve.set.has_node_QMARK_(node_bm,bit_pos)){
var idx = cljs_thread.eve.set.get_child_idx(node_bm,bit_pos);
var child_off = cljs_thread.eve.set.read_child_offset(root_off,idx);
var G__25657 = child_off;
var G__25658 = v;
var G__25659 = vh;
var G__25660 = (shift + (5));
root_off = G__25657;
v = G__25658;
vh = G__25659;
shift = G__25660;
continue;
} else {
return false;

}
}

break;
case (2):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var cnt = cljs_thread.eve.set.r_get_u8((1));
var i = (0);
var pos = (12);
while(true){
if((i >= cnt)){
return false;
} else {
var vec__24593 = cljs_thread.eve.set.read_val_at(root_off,pos);
var entry_v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24593,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24593,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,entry_v)){
return true;
} else {
var G__25661 = (i + (1));
var G__25662 = next_pos;
i = G__25661;
pos = G__25662;
continue;
}
}
break;
}

break;
default:
return false;

}
}
break;
}
});
cljs_thread.eve.set.hamt_conj_added_QMARK_ = false;
cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false;
/**
 * Add value to HAMT. Returns new-root-off (slab-qualified offset).
 * Sets hamt-conj-added? to true if new value, false otherwise.
 */
cljs_thread.eve.set.hamt_conj = (function cljs_thread$eve$set$hamt_conj(root_off,v,vh,vb,shift){
if((root_off === (-1))){
var bit_pos = ((vh >>> shift) & (31));
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return cljs_thread.eve.set.make_single_val_bitmap_node_BANG_(bit_pos,vb);
} else {
var node_type = cljs_thread.eve.set.read_node_type(root_off);
var G__24637 = node_type;
switch (G__24637) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(root_off);
var data_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var bit_pos = ((vh >>> shift) & (31));
if(cljs_thread.eve.set.has_data_QMARK_(data_bm,bit_pos)){
var idx = cljs_thread.eve.set.get_data_idx(data_bm,bit_pos);
var existing_v = cljs_thread.eve.set.get_val_at_idx(root_off,data_bm,node_bm,idx);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,existing_v)){
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = false);

return root_off;
} else {
var existing_vb = cljs_thread.eve.deftype_proto.serialize.serialize_val(existing_v);
var existing_vh = cljs.core.hash(existing_v);
if((existing_vh === vh)){
var collision_off = cljs_thread.eve.set.make_collision_node_BANG_(vh,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [existing_vb,vb], null));
var new_data_bm = (data_bm ^ ((1) << bit_pos));
var new_node_bm = (node_bm | ((1) << bit_pos));
var child_idx = cljs_thread.eve.set.get_child_idx(new_node_bm,bit_pos);
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$8(new_data_bm,new_node_bm,root_off,data_bm,node_bm,idx,child_idx,collision_off);
} else {
var new_child_off = (function (){var bp1 = ((existing_vh >>> (shift + (5))) & (31));
var bp2 = ((vh >>> (shift + (5))) & (31));
if((bp1 === bp2)){
var sub = (function (){var G__24669 = cljs_thread.eve.set.make_single_val_bitmap_node_BANG_(bp1,existing_vb);
var G__24670 = v;
var G__24671 = vh;
var G__24672 = vb;
var G__24673 = ((shift + (5)) + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24669,G__24670,G__24671,G__24672,G__24673) : cljs_thread.eve.set.hamt_conj.call(null, G__24669,G__24670,G__24671,G__24672,G__24673));
})();
return sub;
} else {
return cljs_thread.eve.set.make_two_val_bitmap_node_BANG_(bp1,existing_vb,bp2,vb);
}
})();
var new_data_bm = (data_bm ^ ((1) << bit_pos));
var new_node_bm = (node_bm | ((1) << bit_pos));
var child_idx = cljs_thread.eve.set.get_child_idx(new_node_bm,bit_pos);
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$8(new_data_bm,new_node_bm,root_off,data_bm,node_bm,idx,child_idx,new_child_off);
}
}
} else {
if(cljs_thread.eve.set.has_node_QMARK_(node_bm,bit_pos)){
var child_idx = cljs_thread.eve.set.get_child_idx(node_bm,bit_pos);
var child_off = cljs_thread.eve.set.read_child_offset(root_off,child_idx);
var new_child_off = (function (){var G__24694 = child_off;
var G__24695 = v;
var G__24696 = vh;
var G__24697 = vb;
var G__24698 = (shift + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24694,G__24695,G__24696,G__24697,G__24698) : cljs_thread.eve.set.hamt_conj.call(null, G__24694,G__24695,G__24696,G__24697,G__24698));
})();
if((!(cljs_thread.eve.set.hamt_conj_added_QMARK_))){
return root_off;
} else {
return cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,root_off,data_bm,node_bm,child_idx,new_child_off);
}
} else {
var new_data_bm = (data_bm | ((1) << bit_pos));
var insert_idx = cljs_thread.eve.set.get_data_idx(new_data_bm,bit_pos);
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return cljs_thread.eve.set.make_bitmap_node_with_added_val_BANG_(new_data_bm,node_bm,root_off,data_bm,node_bm,insert_idx,vb);

}
}

break;
case (2):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var node_hash = cljs_thread.eve.set.r_get_u32((2));
var cnt = cljs_thread.eve.set.r_get_u8((1));
if((vh === node_hash)){
var i = (0);
var pos = (12);
var val_bytes_list = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
var all_vals = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(val_bytes_list,vb);
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return cljs_thread.eve.set.make_collision_node_BANG_(vh,all_vals);
} else {
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var val_len = cljs_thread.eve.set.r_get_u32(pos);
var val_bytes = cljs_thread.eve.set.copy_from_sab(root_off,(pos + (4)),val_len);
var entry_v = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
var next_pos = ((pos + (4)) + val_len);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,entry_v)){
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = false);

return root_off;
} else {
var G__25676 = (i + (1));
var G__25677 = next_pos;
var G__25678 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(val_bytes_list,val_bytes);
i = G__25676;
pos = G__25677;
val_bytes_list = G__25678;
continue;
}
}
break;
}
} else {
var bit_pos1 = ((node_hash >>> shift) & (31));
var bit_pos2 = ((vh >>> shift) & (31));
if((bit_pos1 === bit_pos2)){
var sub_node = (function (){var G__24728 = root_off;
var G__24729 = v;
var G__24730 = vh;
var G__24731 = vb;
var G__24732 = (shift + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24728,G__24729,G__24730,G__24731,G__24732) : cljs_thread.eve.set.hamt_conj.call(null, G__24728,G__24729,G__24730,G__24731,G__24732));
})();
var node_bm = ((1) << bit_pos1);
var slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(((12) + (4)));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),(0));

cljs_thread.eve.set.r_set_u32((8),node_bm);

cljs_thread.eve.set.r_set_i32((12),sub_node);

return slab_off;
} else {
var new_val_off = cljs_thread.eve.set.make_single_val_bitmap_node_BANG_(bit_pos2,vb);
var node_bm = (((1) << bit_pos1) | ((1) << bit_pos2));
var slab_off = cljs_thread.eve.set.alloc_bytes_BANG_(((12) + (8)));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.set.r_set_u8((0),(1));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u16((2),(0));

cljs_thread.eve.set.r_set_u32((4),(0));

cljs_thread.eve.set.r_set_u32((8),node_bm);

if((bit_pos1 < bit_pos2)){
cljs_thread.eve.set.r_set_i32((12),root_off);

cljs_thread.eve.set.r_set_i32(((12) + (4)),new_val_off);
} else {
cljs_thread.eve.set.r_set_i32((12),new_val_off);

cljs_thread.eve.set.r_set_i32(((12) + (4)),root_off);
}

(cljs_thread.eve.set.hamt_conj_added_QMARK_ = true);

return slab_off;
}
}

break;
default:
(cljs_thread.eve.set.hamt_conj_added_QMARK_ = false);

return root_off;

}
}
});
/**
 * Remove value from HAMT. Returns new-root-off (slab-qualified offset).
 * Sets hamt-disj-removed? to true if value was removed, false otherwise.
 */
cljs_thread.eve.set.hamt_disj = (function cljs_thread$eve$set$hamt_disj(root_off,v,vh,shift){
if((root_off === (-1))){
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false);

return (-1);
} else {
var node_type = cljs_thread.eve.set.read_node_type(root_off);
var G__24755 = node_type;
switch (G__24755) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(root_off);
var data_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var bit_pos = ((vh >>> shift) & (31));
if(cljs_thread.eve.set.has_data_QMARK_(data_bm,bit_pos)){
var idx = cljs_thread.eve.set.get_data_idx(data_bm,bit_pos);
var found_v = cljs_thread.eve.set.get_val_at_idx(root_off,data_bm,node_bm,idx);
if((!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,found_v)))){
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false);

return root_off;
} else {
var new_data_bm = (data_bm ^ ((1) << bit_pos));
var total_entries = ((cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(new_data_bm) : cljs_thread.eve.set.popcount32.call(null, new_data_bm)) + (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm)));
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = true);

if((total_entries === (0))){
return (-1);
} else {
return cljs_thread.eve.set.make_bitmap_node_removing_val_BANG_.cljs$core$IFn$_invoke$arity$6(new_data_bm,node_bm,root_off,data_bm,node_bm,idx);
}
}
} else {
if(cljs_thread.eve.set.has_node_QMARK_(node_bm,bit_pos)){
var child_idx = cljs_thread.eve.set.get_child_idx(node_bm,bit_pos);
var child_off = cljs_thread.eve.set.read_child_offset(root_off,child_idx);
var new_child = (function (){var G__24757 = child_off;
var G__24758 = v;
var G__24759 = vh;
var G__24760 = (shift + (5));
return (cljs_thread.eve.set.hamt_disj.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.set.hamt_disj.cljs$core$IFn$_invoke$arity$4(G__24757,G__24758,G__24759,G__24760) : cljs_thread.eve.set.hamt_disj.call(null, G__24757,G__24758,G__24759,G__24760));
})();
if((!(cljs_thread.eve.set.hamt_disj_removed_QMARK_))){
return root_off;
} else {
if((new_child === (-1))){
var new_node_bm = (node_bm ^ ((1) << bit_pos));
var total_entries = ((cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(data_bm) : cljs_thread.eve.set.popcount32.call(null, data_bm)) + (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(new_node_bm) : cljs_thread.eve.set.popcount32.call(null, new_node_bm)));
if((total_entries === (0))){
return (-1);
} else {
return cljs_thread.eve.set.make_bitmap_node_removing_child_BANG_(data_bm,new_node_bm,root_off,data_bm,node_bm,child_idx);
}
} else {
return cljs_thread.eve.set.make_bitmap_node_with_raw_val_BANG_.cljs$core$IFn$_invoke$arity$7(data_bm,node_bm,root_off,data_bm,node_bm,child_idx,new_child);
}
}
} else {
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false);

return root_off;

}
}

break;
case (2):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var cnt = cljs_thread.eve.set.r_get_u8((1));
var node_hash = cljs_thread.eve.set.r_get_u32((2));
var i = (0);
var pos = (12);
var val_bytes_list = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false);

return root_off;
} else {
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var val_len = cljs_thread.eve.set.r_get_u32(pos);
var val_bytes = cljs_thread.eve.set.copy_from_sab(root_off,(pos + (4)),val_len);
var entry_v = cljs_thread.eve.deftype_proto.serialize.deserialize_element(cljs.core.PersistentArrayMap.EMPTY,val_bytes);
var next_pos = ((pos + (4)) + val_len);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,entry_v)){
var rest_vals = (function (){var j = (i + (1));
var p = next_pos;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((j >= cnt)){
return acc;
} else {
var ___$1 = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(root_off);
var vl = cljs_thread.eve.set.r_get_u32(p);
var vbytes = cljs_thread.eve.set.copy_from_sab(root_off,(p + (4)),vl);
var G__25694 = (j + (1));
var G__25695 = ((p + (4)) + vl);
var G__25696 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,vbytes);
j = G__25694;
p = G__25695;
acc = G__25696;
continue;
}
break;
}
})();
var all_remaining = cljs.core.into.cljs$core$IFn$_invoke$arity$2(val_bytes_list,rest_vals);
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = true);

if(cljs.core.empty_QMARK_(all_remaining)){
return (-1);
} else {
if(((1) === cljs.core.count(all_remaining))){
var vb = cljs.core.first(all_remaining);
var bp = ((node_hash >>> shift) & (31));
return cljs_thread.eve.set.make_single_val_bitmap_node_BANG_(bp,vb);
} else {
return cljs_thread.eve.set.make_collision_node_BANG_(node_hash,all_remaining);

}
}
} else {
var G__25697 = (i + (1));
var G__25698 = next_pos;
var G__25699 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(val_bytes_list,val_bytes);
i = G__25697;
pos = G__25698;
val_bytes_list = G__25699;
continue;
}
}
break;
}

break;
default:
(cljs_thread.eve.set.hamt_disj_removed_QMARK_ = false);

return root_off;

}
}
});
/**
 * Walk HAMT tree directly, calling (f acc v) at each value.
 * Supports reduced? for early termination.
 */
cljs_thread.eve.set.hamt_val_reduce = (function cljs_thread$eve$set$hamt_val_reduce(offset,f,init){
if((offset === (-1))){
return init;
} else {
var node_type = cljs_thread.eve.set.read_node_type(offset);
var G__24805 = node_type;
switch (G__24805) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(offset);
var data_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var data_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(data_bm) : cljs_thread.eve.set.popcount32.call(null, data_bm));
var vs = cljs_thread.eve.set.val_data_start(node_bm);
var acc_after_data = (function (){var i = (0);
var pos = vs;
var acc = init;
while(true){
if((((i >= data_count)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var vec__24836 = cljs_thread.eve.set.read_val_at(offset,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24836,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24836,(1),null);
var G__25701 = (i + (1));
var G__25702 = next_pos;
var G__25703 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,v) : f.call(null, acc,v));
i = G__25701;
pos = G__25702;
acc = G__25703;
continue;
}
break;
}
})();
var child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm));
if(cljs.core.reduced_QMARK_(acc_after_data)){
return acc_after_data;
} else {
var i = (0);
var acc = acc_after_data;
while(true){
if((((i >= child_count)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var child_off = cljs_thread.eve.set.read_child_offset(offset,i);
var G__25707 = (i + (1));
var G__25708 = (cljs_thread.eve.set.hamt_val_reduce.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.set.hamt_val_reduce.cljs$core$IFn$_invoke$arity$3(child_off,f,acc) : cljs_thread.eve.set.hamt_val_reduce.call(null, child_off,f,acc));
i = G__25707;
acc = G__25708;
continue;
}
break;
}
}

break;
case (2):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(offset);
var cnt = cljs_thread.eve.set.r_get_u8((1));
var i = (0);
var pos = (12);
var acc = init;
while(true){
if((((i >= cnt)) || (cljs.core.reduced_QMARK_(acc)))){
return acc;
} else {
var vec__24850 = cljs_thread.eve.set.read_val_at(offset,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24850,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24850,(1),null);
var G__25712 = (i + (1));
var G__25713 = next_pos;
var G__25714 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,v) : f.call(null, acc,v));
i = G__25712;
pos = G__25713;
acc = G__25714;
continue;
}
break;
}

break;
default:
return init;

}
}
});
/**
 * Return lazy seq of values from HAMT.
 */
cljs_thread.eve.set.hamt_seq = (function cljs_thread$eve$set$hamt_seq(root_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_off,(-1))){
return (function cljs_thread$eve$set$hamt_seq_$_walk(off){
return (new cljs.core.LazySeq(null,(function (){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(off,(-1))){
var node_type = cljs_thread.eve.set.read_node_type(off);
var G__24899 = node_type;
switch (G__24899) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(off);
var data_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (4)),true);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var data_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(data_bm) : cljs_thread.eve.set.popcount32.call(null, data_bm));
var child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm));
var inline_vals = (((data_count > (0)))?(function (){var i = (0);
var pos = cljs_thread.eve.set.val_data_start(node_bm);
var result = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= data_count)){
return result;
} else {
var vec__24921 = cljs_thread.eve.set.read_val_at(off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24921,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24921,(1),null);
var G__25719 = (i + (1));
var G__25720 = next_pos;
var G__25721 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,v);
i = G__25719;
pos = G__25720;
result = G__25721;
continue;
}
break;
}
})():null);
var child_vals = (((child_count > (0)))?cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (i){
return cljs_thread$eve$set$hamt_seq_$_walk(cljs_thread.eve.set.read_child_offset(off,i));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.range.cljs$core$IFn$_invoke$arity$1(child_count)], 0)):null);
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(inline_vals,child_vals);

break;
case (2):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(off);
var cnt = cljs_thread.eve.set.r_get_u8((1));
var i = (0);
var pos = (12);
var result = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= cnt)){
return result;
} else {
var vec__24939 = cljs_thread.eve.set.read_val_at(off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24939,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24939,(1),null);
var G__25722 = (i + (1));
var G__25723 = next_pos;
var G__25724 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,v);
i = G__25722;
pos = G__25723;
result = G__25724;
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
cljs_thread.eve.set.SABSETROOT_CNT_OFFSET = (4);
cljs_thread.eve.set.SABSETROOT_ROOT_OFF_OFFSET = (8);
cljs_thread.eve.set.EveHashSet_type_id = (238);
/**
 * Create a EveHashSet, allocating a 12-byte header block in the slab.
 * The header stores: [type-id:u8 | pad:3 | cnt:i32 | root-off:i32].
 */
cljs_thread.eve.set.make_eve_hash_set = (function cljs_thread$eve$set$make_eve_hash_set(cnt,root_off){
var header_off = cljs_thread.eve.set.alloc_bytes_BANG_((12));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

cljs_thread.eve.set.r_set_u8((0),(238));

cljs_thread.eve.set.r_set_u8((1),(0));

cljs_thread.eve.set.r_set_u8((2),(0));

cljs_thread.eve.set.r_set_u8((3),(0));

cljs_thread.eve.set.r_set_i32((4),cnt);

cljs_thread.eve.set.r_set_i32((8),root_off);

return (new cljs_thread.eve.set.EveHashSet(cnt,root_off,header_off,null,null));
});
/**
 * Reconstruct a EveHashSet from an existing header slab-qualified offset.
 * Reads cnt and root-off from the header block.
 */
cljs_thread.eve.set.make_eve_hash_set_from_header = (function cljs_thread$eve$set$make_eve_hash_set_from_header(header_off){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

var cnt = cljs_thread.eve.set.r_get_i32((4));
var root_off = cljs_thread.eve.set.r_get_i32((8));
return (new cljs_thread.eve.set.EveHashSet(cnt,root_off,header_off,null,null));
});

/**
* @constructor
 * @implements {cljs_thread.eve.deftype_proto.data.IsEve}
 * @implements {cljs_thread.eve.deftype_proto.data.IDirectSerialize}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEditableCollection}
 * @implements {cljs.core.ISet}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabStorable}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabRetirable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.ILookup}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.set.EveHashSet = (function (cnt,root_off,header_off,_modified_khs,__hash){
this.cnt = cnt;
this.root_off = root_off;
this.header_off = header_off;
this._modified_khs = _modified_khs;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2163085583;
this.cljs$lang$protocol_mask$partition1$ = 4;
});
(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$IsEve$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((17),self__.header_off);
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$ILookup$_lookup$arity$3(null, v,null);
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,v,not_found){
var self__ = this;
var ___$1 = this;
var vh = cljs.core.hash(v);
if(cljs.core.truth_(cljs_thread.eve.set.hamt_find(self__.root_off,v,vh,(0)))){
return v;
} else {
return not_found;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this$,writer,opts){
var self__ = this;
var this$__$1 = this;
var values = cljs.core.take.cljs$core$IFn$_invoke$arity$2((10),cljs.core.seq(this$__$1));
cljs.core._write(writer,"#{");

var seq__25077_25730 = cljs.core.seq(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,values));
var chunk__25078_25731 = null;
var count__25079_25732 = (0);
var i__25080_25733 = (0);
while(true){
if((i__25080_25733 < count__25079_25732)){
var vec__25135_25736 = chunk__25078_25731.cljs$core$IIndexed$_nth$arity$2(null, i__25080_25733);
var i_25737 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25135_25736,(0),null);
var v_25738 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25135_25736,(1),null);
if((i_25737 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([v_25738], 0)));


var G__25739 = seq__25077_25730;
var G__25740 = chunk__25078_25731;
var G__25741 = count__25079_25732;
var G__25742 = (i__25080_25733 + (1));
seq__25077_25730 = G__25739;
chunk__25078_25731 = G__25740;
count__25079_25732 = G__25741;
i__25080_25733 = G__25742;
continue;
} else {
var temp__5823__auto___25743 = cljs.core.seq(seq__25077_25730);
if(temp__5823__auto___25743){
var seq__25077_25744__$1 = temp__5823__auto___25743;
if(cljs.core.chunked_seq_QMARK_(seq__25077_25744__$1)){
var c__5568__auto___25745 = cljs.core.chunk_first(seq__25077_25744__$1);
var G__25746 = cljs.core.chunk_rest(seq__25077_25744__$1);
var G__25747 = c__5568__auto___25745;
var G__25748 = cljs.core.count(c__5568__auto___25745);
var G__25749 = (0);
seq__25077_25730 = G__25746;
chunk__25078_25731 = G__25747;
count__25079_25732 = G__25748;
i__25080_25733 = G__25749;
continue;
} else {
var vec__25141_25750 = cljs.core.first(seq__25077_25744__$1);
var i_25751 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25141_25750,(0),null);
var v_25752 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25141_25750,(1),null);
if((i_25751 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([v_25752], 0)));


var G__25753 = cljs.core.next(seq__25077_25744__$1);
var G__25754 = null;
var G__25755 = (0);
var G__25756 = (0);
seq__25077_25730 = G__25753;
chunk__25078_25731 = G__25754;
count__25079_25732 = G__25755;
i__25080_25733 = G__25756;
continue;
}
} else {
}
}
break;
}

if((self__.cnt > (10))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,"}");
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return null;
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return new cljs.core.Keyword(null,"hash-set","hash-set",1509267337);
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1(null, );
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.root_off,(-1))){
cljs_thread.eve.set.free_hamt_node_BANG_(self__.root_off);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.header_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(self__.header_off);
} else {
return null;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.__hash)){
return self__.__hash;
} else {
var h = cljs.core.hash_unordered_coll(cljs.core.seq(this$__$1));
(self__.__hash = h);

return h;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this$,other){
var self__ = this;
var this$__$1 = this;
return ((cljs.core.set_QMARK_(other)) && ((((self__.cnt === cljs.core.count(other))) && (cljs.core.every_QMARK_((function (v){
return cljs_thread.eve.set.hamt_find(self__.root_off,v,cljs.core.hash(v),(0));
}),other)))));
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
var G__25212 = self__.root_off;
var G__25213 = this$__$1;
var G__25214 = self__.root_off;
var G__25215 = self__.cnt;
var G__25216 = (new Object());
return (cljs_thread.eve.set.__GT_TransientEveHashSet.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.__GT_TransientEveHashSet.cljs$core$IFn$_invoke$arity$5(G__25212,G__25213,G__25214,G__25215,G__25216) : cljs_thread.eve.set.__GT_TransientEveHashSet.call(null, G__25212,G__25213,G__25214,G__25215,G__25216));
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.set.empty_hash_set.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.set.empty_hash_set.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.set.empty_hash_set.call(null, ));
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
var vh = cljs.core.hash(v);
var new_root = cljs_thread.eve.set.hamt_disj(self__.root_off,v,vh,(0));
if(cljs_thread.eve.set.hamt_disj_removed_QMARK_){
if((new_root === (-1))){
return (cljs_thread.eve.set.empty_hash_set.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.set.empty_hash_set.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.set.empty_hash_set.call(null, ));
} else {
var new_set = cljs_thread.eve.set.make_eve_hash_set((self__.cnt - (1)),new_root);
var parent_khs = this$__$1._modified_khs;
var parent_len = (cljs.core.truth_(parent_khs)?parent_khs.length:(0));
if((parent_len <= (8))){
var khs_25761 = (cljs.core.truth_((function (){var and__5043__auto__ = parent_khs;
if(cljs.core.truth_(and__5043__auto__)){
return (parent_len > (0));
} else {
return and__5043__auto__;
}
})())?parent_khs.slice((0)):[]);
khs_25761.push(vh);

(new_set._modified_khs = khs_25761);
} else {
}

return new_set;
}
} else {
return this$__$1;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
if((self__.cnt === (0))){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));
} else {
var first_val = cljs.core.first(cljs.core.seq(this$__$1));
var result = cljs_thread.eve.set.hamt_val_reduce(self__.root_off,(function (acc,v){
if((v === first_val)){
return acc;
} else {
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,v) : f.call(null, acc,v));
}
}),first_val);
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (this$,f,init){
var self__ = this;
var this$__$1 = this;
var result = cljs_thread.eve.set.hamt_val_reduce(self__.root_off,f,init);
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
return result;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.set.EveHashSet.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 = (function (this$,new_value,_slab_env,mode){
var self__ = this;
var this$__$1 = this;
var old_root = self__.root_off;
if((new_value instanceof cljs_thread.eve.set.EveHashSet)){
var new_root_off_25762 = new_value.root_off;
var modified_khs_25763 = new_value._modified_khs;
if(cljs.core.truth_((function (){var and__5043__auto__ = modified_khs_25763;
if(cljs.core.truth_(and__5043__auto__)){
return (((modified_khs_25763.length > (0))) && ((modified_khs_25763.length <= (8))));
} else {
return and__5043__auto__;
}
})())){
var n__5636__auto___25765 = modified_khs_25763.length;
var i_25766 = (0);
while(true){
if((i_25766 < n__5636__auto___25765)){
var G__25231_25767 = old_root;
var G__25232_25768 = new_root_off_25762;
var G__25233_25769 = (modified_khs_25763[i_25766]);
(cljs_thread.eve.set.retire_replaced_path_BANG_.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.set.retire_replaced_path_BANG_.cljs$core$IFn$_invoke$arity$3(G__25231_25767,G__25232_25768,G__25233_25769) : cljs_thread.eve.set.retire_replaced_path_BANG_.call(null, G__25231_25767,G__25232_25768,G__25233_25769));

var G__25770 = (i_25766 + (1));
i_25766 = G__25770;
continue;
} else {
}
break;
}
} else {
(cljs_thread.eve.set.retire_tree_diff_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.set.retire_tree_diff_BANG_.cljs$core$IFn$_invoke$arity$2(old_root,new_root_off_25762) : cljs_thread.eve.set.retire_tree_diff_BANG_.call(null, old_root,new_root_off_25762));
}
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))){
cljs_thread.eve.set.free_hamt_node_BANG_(old_root);
} else {
}
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.header_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(self__.header_off);
} else {
return null;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
return cljs_thread.eve.set.hamt_seq(self__.root_off);
} else {
return null;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this$,_new_meta){
var self__ = this;
var this$__$1 = this;
return this$__$1;
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
var vb = cljs_thread.eve.deftype_proto.serialize.serialize_key(v);
var vh = cljs.core.hash(v);
var new_root = cljs_thread.eve.set.hamt_conj(self__.root_off,v,vh,vb,(0));
if(cljs_thread.eve.set.hamt_conj_added_QMARK_){
var new_set = cljs_thread.eve.set.make_eve_hash_set((self__.cnt + (1)),new_root);
var parent_khs = this$__$1._modified_khs;
var parent_len = (cljs.core.truth_(parent_khs)?parent_khs.length:(0));
if((parent_len <= (8))){
var khs_25772 = (cljs.core.truth_((function (){var and__5043__auto__ = parent_khs;
if(cljs.core.truth_(and__5043__auto__)){
return (parent_len > (0));
} else {
return and__5043__auto__;
}
})())?parent_khs.slice((0)):[]);
khs_25772.push(vh);

(new_set._modified_khs = khs_25772);
} else {
}

return new_set;
} else {
return this$__$1;
}
}));

(cljs_thread.eve.set.EveHashSet.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__25242 = (arguments.length - (1));
switch (G__25242) {
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

(cljs_thread.eve.set.EveHashSet.prototype.apply = (function (self__,args25055){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args25055)));
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = (function (v){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, v,null);
}));

(cljs_thread.eve.set.EveHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = (function (v,not_found){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, v,not_found);
}));

(cljs_thread.eve.set.EveHashSet.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"root-off","root-off",1805869236,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_modified_khs","_modified_khs",1904547561,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"__hash","__hash",-1328796629,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null))], null);
}));

(cljs_thread.eve.set.EveHashSet.cljs$lang$type = true);

(cljs_thread.eve.set.EveHashSet.cljs$lang$ctorStr = "cljs-thread.eve.set/EveHashSet");

(cljs_thread.eve.set.EveHashSet.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.set/EveHashSet");
}));

/**
 * Positional factory function for cljs-thread.eve.set/EveHashSet.
 */
cljs_thread.eve.set.__GT_EveHashSet = (function cljs_thread$eve$set$__GT_EveHashSet(cnt,root_off,header_off,_modified_khs,__hash){
return (new cljs_thread.eve.set.EveHashSet(cnt,root_off,header_off,_modified_khs,__hash));
});


/**
* @constructor
 * @implements {cljs.core.ITransientSet}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ITransientCollection}
 * @implements {cljs.core.ILookup}
*/
cljs_thread.eve.set.TransientEveHashSet = (function (initial_root_off,original_persistent,root_offset,cnt,edit){
this.initial_root_off = initial_root_off;
this.original_persistent = original_persistent;
this.root_offset = root_offset;
this.cnt = cnt;
this.edit = edit;
this.cljs$lang$protocol_mask$partition0$ = 258;
this.cljs$lang$protocol_mask$partition1$ = 136;
});
(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$ILookup$_lookup$arity$3(null, v,null);
}));

(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,v,not_found){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var vh = cljs.core.hash(v);
if(cljs.core.truth_(cljs_thread.eve.set.hamt_find(self__.root_offset,v,vh,(0)))){
return v;
} else {
return not_found;
}
}));

(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var vb = cljs_thread.eve.deftype_proto.serialize.serialize_key(v);
var vh = cljs.core.hash(v);
var new_root = cljs_thread.eve.set.hamt_conj(self__.root_offset,v,vh,vb,(0));
(self__.root_offset = new_root);

if(cljs_thread.eve.set.hamt_conj_added_QMARK_){
(self__.cnt = (self__.cnt + (1)));
} else {
}

return this$__$1;
}));

(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

(self__.edit = null);

if((self__.root_offset === self__.initial_root_off)){
return self__.original_persistent;
} else {
return cljs_thread.eve.set.make_eve_hash_set(self__.cnt,self__.root_offset);
}
}));

(cljs_thread.eve.set.TransientEveHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = (function (this$,v){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.edit)){
} else {
throw (new Error("Transient used after persistent!"));
}

var vh = cljs.core.hash(v);
var new_root = cljs_thread.eve.set.hamt_disj(self__.root_offset,v,vh,(0));
(self__.root_offset = new_root);

if(cljs_thread.eve.set.hamt_disj_removed_QMARK_){
(self__.cnt = (self__.cnt - (1)));
} else {
}

return this$__$1;
}));

(cljs_thread.eve.set.TransientEveHashSet.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"initial-root-off","initial-root-off",1442781022,null),new cljs.core.Symbol(null,"original-persistent","original-persistent",1461994931,null),cljs.core.with_meta(new cljs.core.Symbol(null,"root-offset","root-offset",-669160944,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"edit","edit",-1302639,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null))], null);
}));

(cljs_thread.eve.set.TransientEveHashSet.cljs$lang$type = true);

(cljs_thread.eve.set.TransientEveHashSet.cljs$lang$ctorStr = "cljs-thread.eve.set/TransientEveHashSet");

(cljs_thread.eve.set.TransientEveHashSet.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.set/TransientEveHashSet");
}));

/**
 * Positional factory function for cljs-thread.eve.set/TransientEveHashSet.
 */
cljs_thread.eve.set.__GT_TransientEveHashSet = (function cljs_thread$eve$set$__GT_TransientEveHashSet(initial_root_off,original_persistent,root_offset,cnt,edit){
return (new cljs_thread.eve.set.TransientEveHashSet(initial_root_off,original_persistent,root_offset,cnt,edit));
});

/**
 * Dispose a EveHashSet, freeing its entire HAMT tree and header block.
 * Call this when the set is no longer needed to reclaim slab memory.
 * 
 * WARNING: After disposal, the set must not be used. Any access will
 * result in undefined behavior or errors.
 */
cljs_thread.eve.set.dispose_BANG_ = (function cljs_thread$eve$set$dispose_BANG_(hash_set){
var root_off = hash_set.root_off;
var header_off = hash_set.header_off;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_off,(-1))){
cljs_thread.eve.set.free_hamt_node_BANG_(root_off);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(header_off,(-1))){
var size = cljs_thread.eve.set.node_size_for_free(header_off);
if((size > (0))){
return cljs_thread.eve.set.maybe_pool_or_free_BANG_(header_off,size);
} else {
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(header_off);
}
} else {
return null;
}
});
/**
 * After an atom swap that replaced old-root with new-root, free the old
 * path nodes that are no longer referenced by the new tree.
 * 
 * Walks both trees following the hash bits for value hash vh. At each level
 * where old-node != new-node, the old node is freed or pooled.
 * 
 * Only retires individual path nodes -- shared subtrees are untouched.
 * 
 * vh: the hash of the value that was modified
 */
cljs_thread.eve.set.retire_replaced_path_BANG_ = (function cljs_thread$eve$set$retire_replaced_path_BANG_(old_root,new_root,vh){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,new_root)))){
var old_off = old_root;
var new_off = new_root;
var sh = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,new_off)))){
var size_25795 = cljs_thread.eve.set.node_size_for_free(old_off);
if((size_25795 > (0))){
cljs_thread.eve.set.maybe_pool_or_free_BANG_(old_off,size_25795);
} else {
cljs_thread.eve.deftype_proto.alloc.free_BANG_(old_off);
}

var old_type = cljs_thread.eve.set.read_node_type(old_off);
if((old_type === (1))){
var bit_pos = ((vh >>> sh) & (31));
var old_node_bm = cljs_thread.eve.set.read_node_bitmap(old_off);
var new_type = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_off,(-1)))?cljs_thread.eve.set.read_node_type(new_off):null);
var new_node_bm = (cljs.core.truth_((function (){var and__5043__auto__ = new_type;
if(cljs.core.truth_(and__5043__auto__)){
return (new_type === (1));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.set.read_node_bitmap(new_off):null);
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.eve.set.has_node_QMARK_(old_node_bm,bit_pos);
if(and__5043__auto__){
var and__5043__auto____$1 = new_node_bm;
if(cljs.core.truth_(and__5043__auto____$1)){
return cljs_thread.eve.set.has_node_QMARK_(new_node_bm,bit_pos);
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var old_child_idx = cljs_thread.eve.set.get_child_idx(old_node_bm,bit_pos);
var new_child_idx = cljs_thread.eve.set.get_child_idx(new_node_bm,bit_pos);
var old_child = cljs_thread.eve.set.read_child_offset(old_off,old_child_idx);
var new_child = cljs_thread.eve.set.read_child_offset(new_off,new_child_idx);
var G__25796 = old_child;
var G__25797 = new_child;
var G__25798 = (sh + (5));
old_off = G__25796;
new_off = G__25797;
sh = G__25798;
continue;
} else {
return null;
}
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
 * - If old-off == new-off -> shared subtree, skip entirely
 * - If old-off != new-off -> free old node, recurse into children
 * 
 * Cost: O(changed nodes). Shared subtrees are skipped via integer compare.
 */
cljs_thread.eve.set.retire_tree_diff_BANG_ = (function cljs_thread$eve$set$retire_tree_diff_BANG_(old_root,new_root){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,new_root)))){
var walk = (function cljs_thread$eve$set$retire_tree_diff_BANG__$_walk(old_off,new_off){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,new_off)))){
var size_25799 = cljs_thread.eve.set.node_size_for_free(old_off);
if((size_25799 > (0))){
cljs_thread.eve.set.maybe_pool_or_free_BANG_(old_off,size_25799);
} else {
cljs_thread.eve.deftype_proto.alloc.free_BANG_(old_off);
}

var old_type = cljs_thread.eve.set.read_node_type(old_off);
if((old_type === (1))){
var old_node_bm = cljs_thread.eve.set.read_node_bitmap(old_off);
var new_type = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_off,(-1)))?cljs_thread.eve.set.read_node_type(new_off):null);
var new_node_bm = (cljs.core.truth_((function (){var and__5043__auto__ = new_type;
if(cljs.core.truth_(and__5043__auto__)){
return (new_type === (1));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.set.read_node_bitmap(new_off):null);
var remaining = old_node_bm;
var old_idx = (0);
while(true){
if((!((remaining === (0))))){
var bit = (remaining & (- remaining));
var old_child = cljs_thread.eve.set.read_child_offset(old_off,old_idx);
var new_child = (cljs.core.truth_((function (){var and__5043__auto__ = new_node_bm;
if(cljs.core.truth_(and__5043__auto__)){
return (!(((new_node_bm & bit) === (0))));
} else {
return and__5043__auto__;
}
})())?(function (){var new_idx = (function (){var G__25412 = (new_node_bm & (bit - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__25412) : cljs_thread.eve.set.popcount32.call(null, G__25412));
})();
return cljs_thread.eve.set.read_child_offset(new_off,new_idx);
})():(-1));
cljs_thread$eve$set$retire_tree_diff_BANG__$_walk(old_child,new_child);

var G__25800 = (remaining & (remaining - (1)));
var G__25801 = (old_idx + (1));
remaining = G__25800;
old_idx = G__25801;
continue;
} else {
return null;
}
break;
}
} else {
return null;
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
 * Return an empty EVE set.
 */
cljs_thread.eve.set.empty_hash_set = (function cljs_thread$eve$set$empty_hash_set(){
return cljs_thread.eve.set.make_eve_hash_set((0),(-1));
});
/**
 * Create a EVE set from values.
 */
cljs_thread.eve.set.hash_set = (function cljs_thread$eve$set$hash_set(var_args){
var args__5775__auto__ = [];
var len__5769__auto___25802 = arguments.length;
var i__5770__auto___25803 = (0);
while(true){
if((i__5770__auto___25803 < len__5769__auto___25802)){
args__5775__auto__.push((arguments[i__5770__auto___25803]));

var G__25804 = (i__5770__auto___25803 + (1));
i__5770__auto___25803 = G__25804;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.eve.set.hash_set.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.eve.set.hash_set.cljs$core$IFn$_invoke$arity$variadic = (function (vs){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.set.empty_hash_set(),vs);
}));

(cljs_thread.eve.set.hash_set.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.eve.set.hash_set.cljs$lang$applyTo = (function (seq25423){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq25423));
}));

/**
 * Create a EVE set from a collection.
 */
cljs_thread.eve.set.into_hash_set = (function cljs_thread$eve$set$into_hash_set(coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.set.empty_hash_set(),coll);
});
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_((17),(function (_sab,header_off){
return cljs_thread.eve.set.make_eve_hash_set_from_header(header_off);
}));
cljs_thread.eve.deftype_proto.serialize.register_cljs_to_sab_builder_BANG_(cljs.core.set_QMARK_,(function (s){
return cljs_thread.eve.set.into_hash_set(s);
}));

//# sourceMappingURL=cljs_thread.eve.set.js.map
