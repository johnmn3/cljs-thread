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
var seq__24506_25555 = cljs.core.seq(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.set.pool_64,cljs_thread.eve.set.pool_128,cljs_thread.eve.set.pool_256,cljs_thread.eve.set.pool_512], null));
var chunk__24507_25556 = null;
var count__24509_25557 = (0);
var i__24511_25558 = (0);
while(true){
if((i__24511_25558 < count__24509_25557)){
var pool_25559 = chunk__24507_25556.cljs$core$IIndexed$_nth$arity$2(null, i__24511_25558);
var n__5636__auto___25560 = pool_25559.length;
var i_25561 = (0);
while(true){
if((i_25561 < n__5636__auto___25560)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25559[i_25561]));

var G__25562 = (i_25561 + (1));
i_25561 = G__25562;
continue;
} else {
}
break;
}


var G__25563 = seq__24506_25555;
var G__25564 = chunk__24507_25556;
var G__25565 = count__24509_25557;
var G__25566 = (i__24511_25558 + (1));
seq__24506_25555 = G__25563;
chunk__24507_25556 = G__25564;
count__24509_25557 = G__25565;
i__24511_25558 = G__25566;
continue;
} else {
var temp__5823__auto___25567 = cljs.core.seq(seq__24506_25555);
if(temp__5823__auto___25567){
var seq__24506_25568__$1 = temp__5823__auto___25567;
if(cljs.core.chunked_seq_QMARK_(seq__24506_25568__$1)){
var c__5568__auto___25569 = cljs.core.chunk_first(seq__24506_25568__$1);
var G__25570 = cljs.core.chunk_rest(seq__24506_25568__$1);
var G__25571 = c__5568__auto___25569;
var G__25572 = cljs.core.count(c__5568__auto___25569);
var G__25573 = (0);
seq__24506_25555 = G__25570;
chunk__24507_25556 = G__25571;
count__24509_25557 = G__25572;
i__24511_25558 = G__25573;
continue;
} else {
var pool_25574 = cljs.core.first(seq__24506_25568__$1);
var n__5636__auto___25575 = pool_25574.length;
var i_25576 = (0);
while(true){
if((i_25576 < n__5636__auto___25575)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25574[i_25576]));

var G__25577 = (i_25576 + (1));
i_25576 = G__25577;
continue;
} else {
}
break;
}


var G__25578 = cljs.core.next(seq__24506_25568__$1);
var G__25579 = null;
var G__25580 = (0);
var G__25581 = (0);
seq__24506_25555 = G__25578;
chunk__24507_25556 = G__25579;
count__24509_25557 = G__25580;
i__24511_25558 = G__25581;
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
var stack = (function (){var G__24534 = size_class;
switch (G__24534) {
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
var stack = (function (){var G__24537 = size_class;
switch (G__24537) {
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

var i_25588 = (1);
while(true){
if((i_25588 < len)){
cljs_thread.eve.set.pool_put_BANG_(size_class,(results__$1[i_25588]));

var G__25590 = (i_25588 + (1));
i_25588 = G__25590;
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
var G__24571 = node_type;
switch (G__24571) {
case (1):
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
var node_bm = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((base + (8)),true);
var child_count = (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(node_bm) : cljs_thread.eve.set.popcount32.call(null, node_bm));
var n__5636__auto___25594 = child_count;
var i_25595 = (0);
while(true){
if((i_25595 < n__5636__auto___25594)){
var child_off_25596 = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32(((base + (12)) + (i_25595 * (4))),true);
(cljs_thread.eve.set.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.free_hamt_node_BANG_.cljs$core$IFn$_invoke$arity$1(child_off_25596) : cljs_thread.eve.set.free_hamt_node_BANG_.call(null, child_off_25596));

var G__25597 = (i_25595 + (1));
i_25595 = G__25597;
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
var G__24610 = (data_bm & (((1) << bit_pos) - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__24610) : cljs_thread.eve.set.popcount32.call(null, G__24610));
});
cljs_thread.eve.set.get_child_idx = (function cljs_thread$eve$set$get_child_idx(node_bm,bit_pos){
var G__24619 = (node_bm & (((1) << bit_pos) - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__24619) : cljs_thread.eve.set.popcount32.call(null, G__24619));
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
var vec__24669 = cljs_thread.eve.set.read_val_at(slab_off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24669,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24669,(1),null);
return v;
} else {
var G__25609 = (i + (1));
var G__25610 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25609;
pos = G__25610;
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
var G__25612 = (i + (1));
var G__25613 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25612;
pos = G__25613;
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
var G__24691 = arguments.length;
switch (G__24691) {
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

var n__5636__auto___25615 = child_count;
var i_25616 = (0);
while(true){
if((i_25616 < n__5636__auto___25615)){
var child_off_25617 = (((i_25616 === update_child_idx))?new_child_off:cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25616 * (4)))));
cljs_thread.eve.set.r_set_i32(((12) + (i_25616 * (4))),child_off_25617);

var G__25618 = (i_25616 + (1));
i_25616 = G__25618;
continue;
} else {
}
break;
}

var src_vs_25619 = cljs_thread.eve.set.val_data_start(src_node_bm);
var dst_vs_25620 = cljs_thread.eve.set.val_data_start(node_bm);
if((existing_val_size > (0))){
var src_bytes_25621 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_vs_25619,existing_val_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25621,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_vs_25620));
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

var n__5636__auto___25630 = src_child_count;
var i_25631 = (0);
while(true){
if((i_25631 < n__5636__auto___25630)){
cljs_thread.eve.set.r_set_i32(((12) + (i_25631 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25631 * (4)))));

var G__25632 = (i_25631 + (1));
i_25631 = G__25632;
continue;
} else {
}
break;
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_vs_25633 = cljs_thread.eve.set.val_data_start(src_node_bm);
var positions_25634 = (function (){var i = (0);
var pos = src_vs_25633;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.set.skip_val_at(pos);
acc.push([pos,(next - pos)]);

var G__25635 = (i + (1));
var G__25636 = next;
var G__25637 = acc;
i = G__25635;
pos = G__25636;
acc = G__25637;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var dst_vs_25638 = cljs_thread.eve.set.val_data_start(new_node_bm);
var src_i_25639 = (0);
var dst_pos_25640 = dst_vs_25638;
var inserted_QMARK__25641 = false;
while(true){
var dst_i_25645 = (src_i_25639 + (cljs.core.truth_(inserted_QMARK__25641)?(1):(0)));
if((((src_i_25639 === insert_idx)) && (cljs.core.not(inserted_QMARK__25641)))){
var next_dst_25646 = cljs_thread.eve.set.write_val_BANG_(dst_pos_25640,vb);
var G__25647 = src_i_25639;
var G__25648 = next_dst_25646;
var G__25649 = true;
src_i_25639 = G__25647;
dst_pos_25640 = G__25648;
inserted_QMARK__25641 = G__25649;
continue;
} else {
if((src_i_25639 >= data_count)){
if(cljs.core.truth_(inserted_QMARK__25641)){
} else {
cljs_thread.eve.set.write_val_BANG_(dst_pos_25640,vb);
}
} else {
var entry_25650 = (positions_25634[src_i_25639]);
var src_pos_25651 = (entry_25650[(0)]);
var val_len_25652 = (entry_25650[(1)]);
var src_bytes_25653 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_25651,val_len_25652);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25653,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_25640));

var G__25654 = (src_i_25639 + (1));
var G__25655 = (dst_pos_25640 + val_len_25652);
var G__25656 = inserted_QMARK__25641;
src_i_25639 = G__25654;
dst_pos_25640 = G__25655;
inserted_QMARK__25641 = G__25656;
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
var G__24785 = arguments.length;
switch (G__24785) {
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
var G__25661 = (i + (1));
var G__25662 = cljs_thread.eve.set.skip_val_at(pos);
i = G__25661;
pos = G__25662;
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
var src_i_25666 = (0);
var dst_i_25667 = (0);
while(true){
if((dst_i_25667 >= dst_child_count)){
} else {
if((dst_i_25667 === insert_child_idx)){
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25667 * (4))),new_child_off);

var G__25668 = src_i_25666;
var G__25669 = (dst_i_25667 + (1));
src_i_25666 = G__25668;
dst_i_25667 = G__25669;
continue;
} else {
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25667 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_25666 * (4)))));

var G__25670 = (src_i_25666 + (1));
var G__25671 = (dst_i_25667 + (1));
src_i_25666 = G__25670;
dst_i_25667 = G__25671;
continue;

}
}
break;
}
} else {
var n__5636__auto___25672 = src_child_count;
var i_25673 = (0);
while(true){
if((i_25673 < n__5636__auto___25672)){
cljs_thread.eve.set.r_set_i32(((12) + (i_25673 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (i_25673 * (4)))));

var G__25674 = (i_25673 + (1));
i_25673 = G__25674;
continue;
} else {
}
break;
}
}

cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(src_slab_off);

var src_vs_25675 = cljs_thread.eve.set.val_data_start(src_node_bm);
var positions_25676 = (function (){var i = (0);
var pos = src_vs_25675;
var acc = [];
while(true){
if((i >= data_count)){
return acc;
} else {
var next = cljs_thread.eve.set.skip_val_at(pos);
acc.push([pos,(next - pos)]);

var G__25677 = (i + (1));
var G__25678 = next;
var G__25679 = acc;
i = G__25677;
pos = G__25678;
acc = G__25679;
continue;
}
break;
}
})();
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

var dst_vs_25680 = cljs_thread.eve.set.val_data_start(new_node_bm);
var i_25681 = (0);
var dst_pos_25682 = dst_vs_25680;
while(true){
if((i_25681 < data_count)){
var entry_25683 = (positions_25676[i_25681]);
var src_pos_25684 = (entry_25683[(0)]);
var val_len_25685 = (entry_25683[(1)]);
if((i_25681 === remove_idx)){
var G__25686 = (i_25681 + (1));
var G__25687 = dst_pos_25682;
i_25681 = G__25686;
dst_pos_25682 = G__25687;
continue;
} else {
var src_bytes_25688 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_pos_25684,val_len_25685);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25688,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_pos_25682));

var G__25689 = (i_25681 + (1));
var G__25690 = (dst_pos_25682 + val_len_25685);
i_25681 = G__25689;
dst_pos_25682 = G__25690;
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

var src_i_25691 = (0);
var dst_i_25692 = (0);
while(true){
if((src_i_25691 < src_child_count)){
if((src_i_25691 === remove_child_idx)){
var G__25693 = (src_i_25691 + (1));
var G__25694 = dst_i_25692;
src_i_25691 = G__25693;
dst_i_25692 = G__25694;
continue;
} else {
cljs_thread.eve.set.r_set_i32(((12) + (dst_i_25692 * (4))),cljs_thread.eve.deftype_proto.alloc.read_i32(src_slab_off,((12) + (src_i_25691 * (4)))));

var G__25695 = (src_i_25691 + (1));
var G__25696 = (dst_i_25692 + (1));
src_i_25691 = G__25695;
dst_i_25692 = G__25696;
continue;
}
} else {
}
break;
}

var src_vs_25697 = cljs_thread.eve.set.val_data_start(src_node_bm);
var dst_vs_25698 = cljs_thread.eve.set.val_data_start(new_node_bm);
if((val_size > (0))){
var src_bytes_25699 = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_off,src_vs_25697,val_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(dst_slab_off);

cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(src_bytes_25699,(cljs_thread.eve.deftype_proto.alloc.resolved_base + dst_vs_25698));
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
var vec__24851 = (((bit_pos1 < bit_pos2))?new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [bit_pos1,vb1,bit_pos2,vb2], null):new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [bit_pos2,vb2,bit_pos1,vb1], null));
var first_bpos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24851,(0),null);
var first_vb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24851,(1),null);
var second_bpos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24851,(2),null);
var second_vb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24851,(3),null);
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

var pos1_25704 = (12);
cljs_thread.eve.set.r_set_u32(pos1_25704,val1_len);

if((val1_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(first_vb,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos1_25704) + (4)));
} else {
}

var pos2_25708 = ((pos1_25704 + (4)) + val1_len);
cljs_thread.eve.set.r_set_u32(pos2_25708,val2_len);

if((val2_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(second_vb,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos2_25708) + (4)));
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

var vs_25709 = cljs.core.seq(val_bytes_seq);
var pos_25710 = (12);
while(true){
if(vs_25709){
var vb_25711 = cljs.core.first(vs_25709);
var vlen_25712 = vb_25711.length;
cljs_thread.eve.set.r_set_u32(pos_25710,vlen_25712);

if((vlen_25712 > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(vb_25711,((cljs_thread.eve.deftype_proto.alloc.resolved_base + pos_25710) + (4)));
} else {
}

var G__25716 = cljs.core.next(vs_25709);
var G__25717 = ((pos_25710 + (4)) + vlen_25712);
vs_25709 = G__25716;
pos_25710 = G__25717;
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
var G__24862 = node_type;
switch (G__24862) {
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
var G__25722 = child_off;
var G__25723 = v;
var G__25724 = vh;
var G__25725 = (shift + (5));
root_off = G__25722;
v = G__25723;
vh = G__25724;
shift = G__25725;
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
var vec__24871 = cljs_thread.eve.set.read_val_at(root_off,pos);
var entry_v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24871,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24871,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,entry_v)){
return true;
} else {
var G__25726 = (i + (1));
var G__25727 = next_pos;
i = G__25726;
pos = G__25727;
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
var G__24875 = node_type;
switch (G__24875) {
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
var sub = (function (){var G__24882 = cljs_thread.eve.set.make_single_val_bitmap_node_BANG_(bp1,existing_vb);
var G__24883 = v;
var G__24884 = vh;
var G__24885 = vb;
var G__24886 = ((shift + (5)) + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24882,G__24883,G__24884,G__24885,G__24886) : cljs_thread.eve.set.hamt_conj.call(null, G__24882,G__24883,G__24884,G__24885,G__24886));
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
var new_child_off = (function (){var G__24887 = child_off;
var G__24888 = v;
var G__24889 = vh;
var G__24890 = vb;
var G__24891 = (shift + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24887,G__24888,G__24889,G__24890,G__24891) : cljs_thread.eve.set.hamt_conj.call(null, G__24887,G__24888,G__24889,G__24890,G__24891));
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
var G__25732 = (i + (1));
var G__25733 = next_pos;
var G__25734 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(val_bytes_list,val_bytes);
i = G__25732;
pos = G__25733;
val_bytes_list = G__25734;
continue;
}
}
break;
}
} else {
var bit_pos1 = ((node_hash >>> shift) & (31));
var bit_pos2 = ((vh >>> shift) & (31));
if((bit_pos1 === bit_pos2)){
var sub_node = (function (){var G__24911 = root_off;
var G__24912 = v;
var G__24913 = vh;
var G__24914 = vb;
var G__24915 = (shift + (5));
return (cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.hamt_conj.cljs$core$IFn$_invoke$arity$5(G__24911,G__24912,G__24913,G__24914,G__24915) : cljs_thread.eve.set.hamt_conj.call(null, G__24911,G__24912,G__24913,G__24914,G__24915));
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
var G__24935 = node_type;
switch (G__24935) {
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
var new_child = (function (){var G__24951 = child_off;
var G__24953 = v;
var G__24954 = vh;
var G__24955 = (shift + (5));
return (cljs_thread.eve.set.hamt_disj.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.set.hamt_disj.cljs$core$IFn$_invoke$arity$4(G__24951,G__24953,G__24954,G__24955) : cljs_thread.eve.set.hamt_disj.call(null, G__24951,G__24953,G__24954,G__24955));
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
var G__25737 = (j + (1));
var G__25738 = ((p + (4)) + vl);
var G__25739 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,vbytes);
j = G__25737;
p = G__25738;
acc = G__25739;
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
var G__25740 = (i + (1));
var G__25741 = next_pos;
var G__25742 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(val_bytes_list,val_bytes);
i = G__25740;
pos = G__25741;
val_bytes_list = G__25742;
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
var G__25105 = node_type;
switch (G__25105) {
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
var vec__25137 = cljs_thread.eve.set.read_val_at(offset,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25137,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25137,(1),null);
var G__25744 = (i + (1));
var G__25745 = next_pos;
var G__25746 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,v) : f.call(null, acc,v));
i = G__25744;
pos = G__25745;
acc = G__25746;
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
var G__25747 = (i + (1));
var G__25748 = (cljs_thread.eve.set.hamt_val_reduce.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.set.hamt_val_reduce.cljs$core$IFn$_invoke$arity$3(child_off,f,acc) : cljs_thread.eve.set.hamt_val_reduce.call(null, child_off,f,acc));
i = G__25747;
acc = G__25748;
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
var vec__25164 = cljs_thread.eve.set.read_val_at(offset,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25164,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25164,(1),null);
var G__25749 = (i + (1));
var G__25750 = next_pos;
var G__25751 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,v) : f.call(null, acc,v));
i = G__25749;
pos = G__25750;
acc = G__25751;
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
var G__25210 = node_type;
switch (G__25210) {
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
var vec__25225 = cljs_thread.eve.set.read_val_at(off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25225,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25225,(1),null);
var G__25754 = (i + (1));
var G__25755 = next_pos;
var G__25756 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,v);
i = G__25754;
pos = G__25755;
result = G__25756;
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
var vec__25248 = cljs_thread.eve.set.read_val_at(off,pos);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25248,(0),null);
var next_pos = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25248,(1),null);
var G__25762 = (i + (1));
var G__25763 = next_pos;
var G__25764 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,v);
i = G__25762;
pos = G__25763;
result = G__25764;
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

var seq__25291_25765 = cljs.core.seq(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,values));
var chunk__25292_25766 = null;
var count__25293_25767 = (0);
var i__25294_25768 = (0);
while(true){
if((i__25294_25768 < count__25293_25767)){
var vec__25326_25769 = chunk__25292_25766.cljs$core$IIndexed$_nth$arity$2(null, i__25294_25768);
var i_25770 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25326_25769,(0),null);
var v_25771 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25326_25769,(1),null);
if((i_25770 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([v_25771], 0)));


var G__25772 = seq__25291_25765;
var G__25773 = chunk__25292_25766;
var G__25774 = count__25293_25767;
var G__25775 = (i__25294_25768 + (1));
seq__25291_25765 = G__25772;
chunk__25292_25766 = G__25773;
count__25293_25767 = G__25774;
i__25294_25768 = G__25775;
continue;
} else {
var temp__5823__auto___25776 = cljs.core.seq(seq__25291_25765);
if(temp__5823__auto___25776){
var seq__25291_25777__$1 = temp__5823__auto___25776;
if(cljs.core.chunked_seq_QMARK_(seq__25291_25777__$1)){
var c__5568__auto___25778 = cljs.core.chunk_first(seq__25291_25777__$1);
var G__25779 = cljs.core.chunk_rest(seq__25291_25777__$1);
var G__25780 = c__5568__auto___25778;
var G__25781 = cljs.core.count(c__5568__auto___25778);
var G__25782 = (0);
seq__25291_25765 = G__25779;
chunk__25292_25766 = G__25780;
count__25293_25767 = G__25781;
i__25294_25768 = G__25782;
continue;
} else {
var vec__25329_25783 = cljs.core.first(seq__25291_25777__$1);
var i_25784 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25329_25783,(0),null);
var v_25785 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25329_25783,(1),null);
if((i_25784 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([v_25785], 0)));


var G__25786 = cljs.core.next(seq__25291_25777__$1);
var G__25787 = null;
var G__25788 = (0);
var G__25789 = (0);
seq__25291_25765 = G__25786;
chunk__25292_25766 = G__25787;
count__25293_25767 = G__25788;
i__25294_25768 = G__25789;
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
var G__25344 = self__.root_off;
var G__25345 = this$__$1;
var G__25346 = self__.root_off;
var G__25347 = self__.cnt;
var G__25348 = (new Object());
return (cljs_thread.eve.set.__GT_TransientEveHashSet.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.set.__GT_TransientEveHashSet.cljs$core$IFn$_invoke$arity$5(G__25344,G__25345,G__25346,G__25347,G__25348) : cljs_thread.eve.set.__GT_TransientEveHashSet.call(null, G__25344,G__25345,G__25346,G__25347,G__25348));
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
var khs_25790 = (cljs.core.truth_((function (){var and__5043__auto__ = parent_khs;
if(cljs.core.truth_(and__5043__auto__)){
return (parent_len > (0));
} else {
return and__5043__auto__;
}
})())?parent_khs.slice((0)):[]);
khs_25790.push(vh);

(new_set._modified_khs = khs_25790);
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
var new_root_off_25791 = new_value.root_off;
var modified_khs_25792 = new_value._modified_khs;
if(cljs.core.truth_((function (){var and__5043__auto__ = modified_khs_25792;
if(cljs.core.truth_(and__5043__auto__)){
return (((modified_khs_25792.length > (0))) && ((modified_khs_25792.length <= (8))));
} else {
return and__5043__auto__;
}
})())){
var n__5636__auto___25793 = modified_khs_25792.length;
var i_25794 = (0);
while(true){
if((i_25794 < n__5636__auto___25793)){
var G__25371_25795 = old_root;
var G__25372_25796 = new_root_off_25791;
var G__25373_25797 = (modified_khs_25792[i_25794]);
(cljs_thread.eve.set.retire_replaced_path_BANG_.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.set.retire_replaced_path_BANG_.cljs$core$IFn$_invoke$arity$3(G__25371_25795,G__25372_25796,G__25373_25797) : cljs_thread.eve.set.retire_replaced_path_BANG_.call(null, G__25371_25795,G__25372_25796,G__25373_25797));

var G__25798 = (i_25794 + (1));
i_25794 = G__25798;
continue;
} else {
}
break;
}
} else {
(cljs_thread.eve.set.retire_tree_diff_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.set.retire_tree_diff_BANG_.cljs$core$IFn$_invoke$arity$2(old_root,new_root_off_25791) : cljs_thread.eve.set.retire_tree_diff_BANG_.call(null, old_root,new_root_off_25791));
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
var khs_25799 = (cljs.core.truth_((function (){var and__5043__auto__ = parent_khs;
if(cljs.core.truth_(and__5043__auto__)){
return (parent_len > (0));
} else {
return and__5043__auto__;
}
})())?parent_khs.slice((0)):[]);
khs_25799.push(vh);

(new_set._modified_khs = khs_25799);
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
var G__25401 = (arguments.length - (1));
switch (G__25401) {
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

(cljs_thread.eve.set.EveHashSet.prototype.apply = (function (self__,args25264){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args25264)));
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
var size_25801 = cljs_thread.eve.set.node_size_for_free(old_off);
if((size_25801 > (0))){
cljs_thread.eve.set.maybe_pool_or_free_BANG_(old_off,size_25801);
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
var G__25802 = old_child;
var G__25803 = new_child;
var G__25804 = (sh + (5));
old_off = G__25802;
new_off = G__25803;
sh = G__25804;
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
var size_25810 = cljs_thread.eve.set.node_size_for_free(old_off);
if((size_25810 > (0))){
cljs_thread.eve.set.maybe_pool_or_free_BANG_(old_off,size_25810);
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
})())?(function (){var new_idx = (function (){var G__25534 = (new_node_bm & (bit - (1)));
return (cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set.popcount32.cljs$core$IFn$_invoke$arity$1(G__25534) : cljs_thread.eve.set.popcount32.call(null, G__25534));
})();
return cljs_thread.eve.set.read_child_offset(new_off,new_idx);
})():(-1));
cljs_thread$eve$set$retire_tree_diff_BANG__$_walk(old_child,new_child);

var G__25811 = (remaining & (remaining - (1)));
var G__25812 = (old_idx + (1));
remaining = G__25811;
old_idx = G__25812;
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
var len__5769__auto___25813 = arguments.length;
var i__5770__auto___25814 = (0);
while(true){
if((i__5770__auto___25814 < len__5769__auto___25813)){
args__5775__auto__.push((arguments[i__5770__auto___25814]));

var G__25815 = (i__5770__auto___25814 + (1));
i__5770__auto___25814 = G__25815;
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
(cljs_thread.eve.set.hash_set.cljs$lang$applyTo = (function (seq25537){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq25537));
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
