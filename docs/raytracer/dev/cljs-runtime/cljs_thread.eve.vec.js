goog.provide('cljs_thread.eve.vec');






cljs_thread.eve.vec._STAR_chunk_size_STAR_ = (32);
/**
 * Convert node size to shift step (log2).
 */
cljs_thread.eve.vec.size__GT_shift = (function cljs_thread$eve$vec$size__GT_shift(size){
var G__20499 = size;
switch (G__20499) {
case (32):
return (5);

break;
case (64):
return (6);

break;
case (128):
return (7);

break;
case (256):
return (8);

break;
case (512):
return (9);

break;
case (1024):
return (10);

break;
default:
var s = size;
var shift = (0);
while(true){
if((s <= (1))){
return shift;
} else {
var G__21570 = (s >>> (1));
var G__21571 = (shift + (1));
s = G__21570;
shift = G__21571;
continue;
}
break;
}

}
});
/**
 * Convert node size to bit mask (size - 1).
 */
cljs_thread.eve.vec.size__GT_mask = (function cljs_thread$eve$vec$size__GT_mask(size){
return (size - (1));
});
cljs_thread.eve.vec.NODE_SIZE = (32);
cljs_thread.eve.vec.SHIFT_STEP = (5);
cljs_thread.eve.vec.MASK = (31);
cljs_thread.eve.vec.SABVECROOT_CNT_OFFSET = (0);
cljs_thread.eve.vec.SABVECROOT_SHIFT_OFFSET = (4);
cljs_thread.eve.vec.SABVECROOT_ROOT_OFFSET = (8);
cljs_thread.eve.vec.SABVECROOT_TAIL_OFFSET = (12);
cljs_thread.eve.vec.SABVECROOT_TAIL_LEN_OFFSET = (16);
cljs_thread.eve.vec.SABVECROOT_HEADER_SIZE = (20);
cljs_thread.eve.vec.SABVECN_NODE_SIZE_OFFSET = (20);
cljs_thread.eve.vec.SABVECN_HEADER_SIZE = (24);
cljs_thread.eve.vec.MAX_POOL_SIZE = (256);
cljs_thread.eve.vec.BATCH_ALLOC_SIZE = (32);
cljs_thread.eve.vec.size_class_for = (function cljs_thread$eve$vec$size_class_for(n){
if((n <= (128))){
return (128);
} else {
if((n <= (256))){
return (256);
} else {
if((n <= (512))){
return (512);
} else {
if((n <= (1024))){
return (1024);
} else {
return null;

}
}
}
}
});
cljs_thread.eve.vec.pool_128 = [];
cljs_thread.eve.vec.pool_256 = [];
cljs_thread.eve.vec.pool_512 = [];
cljs_thread.eve.vec.pool_1024 = [];
cljs_thread.eve.vec.reset_pools_BANG_ = (function cljs_thread$eve$vec$reset_pools_BANG_(){
(cljs_thread.eve.vec.pool_128 = []);

(cljs_thread.eve.vec.pool_256 = []);

(cljs_thread.eve.vec.pool_512 = []);

return (cljs_thread.eve.vec.pool_1024 = []);
});
cljs_thread.eve.vec.drain_pools_BANG_ = (function cljs_thread$eve$vec$drain_pools_BANG_(){
var seq__20583_21580 = cljs.core.seq(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.vec.pool_128,cljs_thread.eve.vec.pool_256,cljs_thread.eve.vec.pool_512,cljs_thread.eve.vec.pool_1024], null));
var chunk__20584_21581 = null;
var count__20585_21582 = (0);
var i__20586_21583 = (0);
while(true){
if((i__20586_21583 < count__20585_21582)){
var pool_21584 = chunk__20584_21581.cljs$core$IIndexed$_nth$arity$2(null, i__20586_21583);
var n__5636__auto___21585 = pool_21584.length;
var i_21586 = (0);
while(true){
if((i_21586 < n__5636__auto___21585)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_21584[i_21586]));

var G__21587 = (i_21586 + (1));
i_21586 = G__21587;
continue;
} else {
}
break;
}


var G__21590 = seq__20583_21580;
var G__21591 = chunk__20584_21581;
var G__21592 = count__20585_21582;
var G__21593 = (i__20586_21583 + (1));
seq__20583_21580 = G__21590;
chunk__20584_21581 = G__21591;
count__20585_21582 = G__21592;
i__20586_21583 = G__21593;
continue;
} else {
var temp__5823__auto___21594 = cljs.core.seq(seq__20583_21580);
if(temp__5823__auto___21594){
var seq__20583_21595__$1 = temp__5823__auto___21594;
if(cljs.core.chunked_seq_QMARK_(seq__20583_21595__$1)){
var c__5568__auto___21596 = cljs.core.chunk_first(seq__20583_21595__$1);
var G__21597 = cljs.core.chunk_rest(seq__20583_21595__$1);
var G__21598 = c__5568__auto___21596;
var G__21599 = cljs.core.count(c__5568__auto___21596);
var G__21600 = (0);
seq__20583_21580 = G__21597;
chunk__20584_21581 = G__21598;
count__20585_21582 = G__21599;
i__20586_21583 = G__21600;
continue;
} else {
var pool_21603 = cljs.core.first(seq__20583_21595__$1);
var n__5636__auto___21604 = pool_21603.length;
var i_21605 = (0);
while(true){
if((i_21605 < n__5636__auto___21604)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_21603[i_21605]));

var G__21606 = (i_21605 + (1));
i_21605 = G__21606;
continue;
} else {
}
break;
}


var G__21607 = cljs.core.next(seq__20583_21595__$1);
var G__21608 = null;
var G__21609 = (0);
var G__21610 = (0);
seq__20583_21580 = G__21607;
chunk__20584_21581 = G__21608;
count__20585_21582 = G__21609;
i__20586_21583 = G__21610;
continue;
}
} else {
}
}
break;
}

(cljs_thread.eve.vec.pool_128 = []);

(cljs_thread.eve.vec.pool_256 = []);

(cljs_thread.eve.vec.pool_512 = []);

return (cljs_thread.eve.vec.pool_1024 = []);
});
cljs_thread.eve.vec.pool_get_BANG_ = (function cljs_thread$eve$vec$pool_get_BANG_(size_class){
var stack = (function (){var G__20616 = size_class;
switch (G__20616) {
case (128):
return cljs_thread.eve.vec.pool_128;

break;
case (256):
return cljs_thread.eve.vec.pool_256;

break;
case (512):
return cljs_thread.eve.vec.pool_512;

break;
case (1024):
return cljs_thread.eve.vec.pool_1024;

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
cljs_thread.eve.vec.pool_put_BANG_ = (function cljs_thread$eve$vec$pool_put_BANG_(size_class,slab_offset){
var stack = (function (){var G__20630 = size_class;
switch (G__20630) {
case (128):
return cljs_thread.eve.vec.pool_128;

break;
case (256):
return cljs_thread.eve.vec.pool_256;

break;
case (512):
return cljs_thread.eve.vec.pool_512;

break;
case (1024):
return cljs_thread.eve.vec.pool_1024;

break;
default:
return null;

}
})();
if(cljs.core.truth_(stack)){
if((stack.length < (256))){
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
cljs_thread.eve.vec.alloc_bytes_BANG_ = (function cljs_thread$eve$vec$alloc_bytes_BANG_(n){
var size_class = cljs_thread.eve.vec.size_class_for(n);
if(cljs.core.truth_(size_class)){
var temp__5821__auto__ = cljs_thread.eve.vec.pool_get_BANG_(size_class);
if(cljs.core.truth_(temp__5821__auto__)){
var pooled = temp__5821__auto__;
return pooled;
} else {
var results = cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(32));
var results__$1 = (cljs.core.truth_((function (){var and__5043__auto__ = results;
if(cljs.core.truth_(and__5043__auto__)){
return (results.length > (0));
} else {
return and__5043__auto__;
}
})())?results:(function (){
cljs_thread.eve.vec.drain_pools_BANG_();

return cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(32));
})()
);
var len = (cljs.core.truth_(results__$1)?results__$1.length:(0));
if((len === (0))){
throw (new Error(["Vec allocation failed: out of memory for ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_class)," bytes"].join('')));
} else {
}

var i_21619 = (1);
while(true){
if((i_21619 < len)){
cljs_thread.eve.vec.pool_put_BANG_(size_class,(results__$1[i_21619]));

var G__21620 = (i_21619 + (1));
i_21619 = G__21620;
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
cljs_thread.eve.vec.r_get_i32 = (function cljs_thread$eve$vec$r_get_i32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.vec.r_set_i32 = (function cljs_thread$eve$vec$r_set_i32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
/**
 * Allocate a node-size element int32 array initialized to NIL_OFFSET (nil sentinel).
 * Returns the slab-qualified offset.
 */
cljs_thread.eve.vec.alloc_node_BANG_ = (function cljs_thread$eve$vec$alloc_node_BANG_(var_args){
var G__20678 = arguments.length;
switch (G__20678) {
case 0:
return cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1((32));
}));

(cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (node_size){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_)){
} else {
throw (new Error(["alloc-node! called outside atomic context \u2014 *parent-atom* not bound. ","Stack: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((new Error()).stack)].join('')));
}

var byte_size = (node_size * (4));
var slab_off = cljs_thread.eve.vec.alloc_bytes_BANG_(byte_size);
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
var dv = cljs_thread.eve.deftype_proto.alloc.resolved_dv;
var n__5636__auto___21622 = node_size;
var i_21623 = (0);
while(true){
if((i_21623 < n__5636__auto___21622)){
dv.setInt32((base + (i_21623 * (4))),(-1),true);

var G__21626 = (i_21623 + (1));
i_21623 = G__21626;
continue;
} else {
}
break;
}

return slab_off;
}));

(cljs_thread.eve.vec.alloc_node_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Get the i-th slot from a node at the given slab-qualified offset.
 */
cljs_thread.eve.vec.node_get = (function cljs_thread$eve$vec$node_get(slab_off,i){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((base + (i * (4))),true);
});
/**
 * Set the i-th slot in a node. Returns the slab-qualified offset.
 */
cljs_thread.eve.vec.node_set_BANG_ = (function cljs_thread$eve$vec$node_set_BANG_(slab_off,i,val){
var base_21627 = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_off);
cljs_thread.eve.deftype_proto.alloc.resolved_dv.setInt32((base_21627 + (i * (4))),val,true);

return slab_off;
});
/**
 * Allocate a new node and copy contents from source.
 */
cljs_thread.eve.vec.clone_node_BANG_ = (function cljs_thread$eve$vec$clone_node_BANG_(var_args){
var G__20797 = arguments.length;
switch (G__20797) {
case 1:
return cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (src_slab_off){
return cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(src_slab_off,(32));
}));

(cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (src_slab_off,node_size){
var byte_size = (node_size * (4));
var new_slab_off = cljs_thread.eve.vec.alloc_bytes_BANG_(byte_size);
var n__5636__auto___21634 = node_size;
var i_21635 = (0);
while(true){
if((i_21635 < n__5636__auto___21634)){
var v_21636 = cljs_thread.eve.vec.node_get(src_slab_off,i_21635);
cljs_thread.eve.vec.node_set_BANG_(new_slab_off,i_21635,v_21636);

var G__21637 = (i_21635 + (1));
i_21635 = G__21637;
continue;
} else {
}
break;
}

return new_slab_off;
}));

(cljs_thread.eve.vec.clone_node_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Allocate and write a serialized value. Returns slab-qualified offset.
 */
cljs_thread.eve.vec.make_value_block_BANG_ = (function cljs_thread$eve$vec$make_value_block_BANG_(val_bytes){
var val_len = val_bytes.length;
var total_size = ((4) + val_len);
var slab_off = cljs_thread.eve.vec.alloc_bytes_BANG_(total_size);
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);
cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint32((base + (0)),val_len,true);

if((val_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(val_bytes,(base + (4)));
} else {
}

return slab_off;
});
/**
 * Read value from a value block slab-qualified offset. Returns deserialized value.
 * Uses zero-copy deserialization — reads directly from DataView, no byte copies.
 */
cljs_thread.eve.vec.read_value_block = (function cljs_thread$eve$vec$read_value_block(val_slab_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(val_slab_off);
var dv = cljs_thread.eve.deftype_proto.alloc.resolved_dv;
var u8 = cljs_thread.eve.deftype_proto.alloc.resolved_u8;
var val_len = dv.getUint32(base,true);
return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data-view","data-view",2142900612),u8], null),dv,(base + (4)),val_len);
});
/**
 * Free a single allocation block by its slab-qualified offset.
 */
cljs_thread.eve.vec.free_block_BANG_ = (function cljs_thread$eve$vec$free_block_BANG_(slab_off){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_off);
} else {
return null;
}
});
/**
 * Free a leaf node and all its value blocks.
 */
cljs_thread.eve.vec.free_leaf_node_BANG_ = (function cljs_thread$eve$vec$free_leaf_node_BANG_(node_slab_off,node_size){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_slab_off,(-1))){
var n__5636__auto___21640 = node_size;
var i_21641 = (0);
while(true){
if((i_21641 < n__5636__auto___21640)){
var val_off_21642 = cljs_thread.eve.vec.node_get(node_slab_off,i_21641);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(val_off_21642,(-1))){
cljs_thread.eve.vec.free_block_BANG_(val_off_21642);
} else {
}

var G__21643 = (i_21641 + (1));
i_21641 = G__21643;
continue;
} else {
}
break;
}

return cljs_thread.eve.vec.free_block_BANG_(node_slab_off);
} else {
return null;
}
});
/**
 * Recursively free a trie node and all its descendants.
 */
cljs_thread.eve.vec.free_trie_node_BANG_ = (function cljs_thread$eve$vec$free_trie_node_BANG_(node_slab_off,shift,node_size,shift_step){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_slab_off,(-1))){
if((shift === (0))){
return cljs_thread.eve.vec.free_leaf_node_BANG_(node_slab_off,node_size);
} else {
var n__5636__auto___21644 = node_size;
var i_21645 = (0);
while(true){
if((i_21645 < n__5636__auto___21644)){
var child_off_21646 = cljs_thread.eve.vec.node_get(node_slab_off,i_21645);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(child_off_21646,(-1))){
var G__20834_21647 = child_off_21646;
var G__20835_21648 = (shift - shift_step);
var G__20836_21649 = node_size;
var G__20837_21650 = shift_step;
(cljs_thread.eve.vec.free_trie_node_BANG_.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.vec.free_trie_node_BANG_.cljs$core$IFn$_invoke$arity$4(G__20834_21647,G__20835_21648,G__20836_21649,G__20837_21650) : cljs_thread.eve.vec.free_trie_node_BANG_.call(null, G__20834_21647,G__20835_21648,G__20836_21649,G__20837_21650));
} else {
}

var G__21651 = (i_21645 + (1));
i_21645 = G__21651;
continue;
} else {
}
break;
}

return cljs_thread.eve.vec.free_block_BANG_(node_slab_off);
}
} else {
return null;
}
});
/**
 * Calculate the index where the tail starts.
 */
cljs_thread.eve.vec.tail_offset_calc = (function cljs_thread$eve$vec$tail_offset_calc(var_args){
var G__20842 = arguments.length;
switch (G__20842) {
case 1:
return cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$1 = (function (cnt){
return cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$3(cnt,(32),(5));
}));

(cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$3 = (function (cnt,node_size,shift_step){
if((cnt < node_size)){
return (0);
} else {
return (((cnt - (1)) >>> shift_step) << shift_step);
}
}));

(cljs_thread.eve.vec.tail_offset_calc.cljs$lang$maxFixedArity = 3);

/**
 * Get element at index. Takes field values.
 */
cljs_thread.eve.vec.nth_impl = (function cljs_thread$eve$vec$nth_impl(var_args){
var G__20859 = arguments.length;
switch (G__20859) {
case 5:
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 8:
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),(arguments[(7)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5 = (function (cnt,shift,root,tail,n){
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(cnt,shift,root,tail,n,(32),(5),(31));
}));

(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8 = (function (cnt,shift,root,tail,n,node_size,shift_step,mask){
var toff = cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$3(cnt,node_size,shift_step);
if((n >= toff)){
var val_off = cljs_thread.eve.vec.node_get(tail,(n - toff));
return cljs_thread.eve.vec.read_value_block(val_off);
} else {
var val_off = (function (){var node_off = root;
var sh = shift;
while(true){
var idx = ((n >>> sh) & mask);
if((sh === (0))){
return cljs_thread.eve.vec.node_get(node_off,idx);
} else {
var G__21670 = cljs_thread.eve.vec.node_get(node_off,idx);
var G__21671 = (sh - shift_step);
node_off = G__21670;
sh = G__21671;
continue;
}
break;
}
})();
return cljs_thread.eve.vec.read_value_block(val_off);
}
}));

(cljs_thread.eve.vec.nth_impl.cljs$lang$maxFixedArity = 8);

/**
 * Create a new path from root to leaf at given shift level.
 */
cljs_thread.eve.vec.new_path = (function cljs_thread$eve$vec$new_path(var_args){
var G__20883 = arguments.length;
switch (G__20883) {
case 2:
return cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$2 = (function (shift,leaf_offset){
return cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4(shift,leaf_offset,(32),(5));
}));

(cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4 = (function (shift,leaf_offset,node_size,shift_step){
if((shift === (0))){
return leaf_offset;
} else {
var node_off = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1(node_size);
cljs_thread.eve.vec.node_set_BANG_(node_off,(0),cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4((shift - shift_step),leaf_offset,node_size,shift_step));

return node_off;
}
}));

(cljs_thread.eve.vec.new_path.cljs$lang$maxFixedArity = 4);

/**
 * Push a full tail into the trie, returning new root offset.
 */
cljs_thread.eve.vec.push_tail = (function cljs_thread$eve$vec$push_tail(var_args){
var G__20903 = arguments.length;
switch (G__20903) {
case 4:
return cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 7:
return cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$4 = (function (shift,parent_off,tail_off,cnt){
return cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$7(shift,parent_off,tail_off,cnt,(32),(5),(31));
}));

(cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$7 = (function (shift,parent_off,tail_off,cnt,node_size,shift_step,mask){
var idx = (((cnt - (1)) >>> shift) & mask);
var new_parent_off = (((parent_off === (-1)))?cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1(node_size):cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(parent_off,node_size));
if((shift === shift_step)){
cljs_thread.eve.vec.node_set_BANG_(new_parent_off,idx,tail_off);

return new_parent_off;
} else {
var child_off = cljs_thread.eve.vec.node_get(new_parent_off,idx);
var new_child_off = (((child_off === (-1)))?cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4((shift - shift_step),tail_off,node_size,shift_step):cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$7((shift - shift_step),child_off,tail_off,cnt,node_size,shift_step,mask));
cljs_thread.eve.vec.node_set_BANG_(new_parent_off,idx,new_child_off);

return new_parent_off;
}
}));

(cljs_thread.eve.vec.push_tail.cljs$lang$maxFixedArity = 7);

/**
 * Recursively update trie at index n with value offset.
 */
cljs_thread.eve.vec.do_assoc = (function cljs_thread$eve$vec$do_assoc(var_args){
var G__20933 = arguments.length;
switch (G__20933) {
case 4:
return cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 7:
return cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$7((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$4 = (function (shift,node_off,n,val_off){
return cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$7(shift,node_off,n,val_off,(32),(5),(31));
}));

(cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$7 = (function (shift,node_off,n,val_off,node_size,shift_step,mask){
var new_node_off = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(node_off,node_size);
var idx = ((n >>> shift) & mask);
if((shift === (0))){
cljs_thread.eve.vec.node_set_BANG_(new_node_off,idx,val_off);

return new_node_off;
} else {
var child_off = cljs_thread.eve.vec.node_get(node_off,idx);
var new_child_off = cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$7((shift - shift_step),child_off,n,val_off,node_size,shift_step,mask);
cljs_thread.eve.vec.node_set_BANG_(new_node_off,idx,new_child_off);

return new_node_off;
}
}));

(cljs_thread.eve.vec.do_assoc.cljs$lang$maxFixedArity = 7);

/**
 * Remove the rightmost leaf from the trie.
 */
cljs_thread.eve.vec.pop_tail = (function cljs_thread$eve$vec$pop_tail(var_args){
var G__20959 = arguments.length;
switch (G__20959) {
case 3:
return cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 6:
return cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$3 = (function (shift,node_off,cnt){
return cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$6(shift,node_off,cnt,(32),(5),(31));
}));

(cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$6 = (function (shift,node_off,cnt,node_size,shift_step,mask){
var idx = (((cnt - (1)) >>> shift) & mask);
if((shift > shift_step)){
var child_off = cljs_thread.eve.vec.node_get(node_off,idx);
var new_child = cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$6((shift - shift_step),child_off,cnt,node_size,shift_step,mask);
if((((new_child === (-1))) && ((idx === (0))))){
return (-1);
} else {
var new_node_off = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(node_off,node_size);
cljs_thread.eve.vec.node_set_BANG_(new_node_off,idx,new_child);

return new_node_off;
}
} else {
if((idx === (0))){
return (-1);
} else {
var new_node_off = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(node_off,node_size);
cljs_thread.eve.vec.node_set_BANG_(new_node_off,idx,(-1));

return new_node_off;

}
}
}));

(cljs_thread.eve.vec.pop_tail.cljs$lang$maxFixedArity = 6);

/**
 * Write SabVecRoot fields to the header block.
 */
cljs_thread.eve.vec.write_vec_header_BANG_ = (function cljs_thread$eve$vec$write_vec_header_BANG_(header_off,cnt,shift,root,tail,tail_len){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(header_off);

cljs_thread.eve.vec.r_set_i32((0),cnt);

cljs_thread.eve.vec.r_set_i32((4),shift);

cljs_thread.eve.vec.r_set_i32((8),root);

cljs_thread.eve.vec.r_set_i32((12),tail);

return cljs_thread.eve.vec.r_set_i32((16),tail_len);
});
/**
 * Read SabVecRoot fields from a header block.
 * Returns [cnt shift root tail tail-len].
 */
cljs_thread.eve.vec.read_vec_header = (function cljs_thread$eve$vec$read_vec_header(header_off){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(header_off);

return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.vec.r_get_i32((0)),cljs_thread.eve.vec.r_get_i32((4)),cljs_thread.eve.vec.r_get_i32((8)),cljs_thread.eve.vec.r_get_i32((12)),cljs_thread.eve.vec.r_get_i32((16))], null);
});
/**
 * Create a SabVecRoot, allocating a header block in the slab.
 * The header stores: [cnt:i32 | shift:i32 | root:i32 | tail:i32 | tail-len:i32].
 */
cljs_thread.eve.vec.make_sab_vec_root = (function cljs_thread$eve$vec$make_sab_vec_root(cnt,shift,root,tail,tail_len){
var header_off = cljs_thread.eve.vec.alloc_bytes_BANG_((20));
cljs_thread.eve.vec.write_vec_header_BANG_(header_off,cnt,shift,root,tail,tail_len);

return (new cljs_thread.eve.vec.SabVecRoot(cnt,shift,root,tail,tail_len,header_off));
});
/**
 * Reconstruct a SabVecRoot from an existing header slab-qualified offset.
 * Reads all fields from the header block.
 */
cljs_thread.eve.vec.make_sab_vec_root_from_header = (function cljs_thread$eve$vec$make_sab_vec_root_from_header(header_off){
var vec__20991 = cljs_thread.eve.vec.read_vec_header(header_off);
var cnt = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20991,(0),null);
var shift = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20991,(1),null);
var root = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20991,(2),null);
var tail = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20991,(3),null);
var tail_len = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20991,(4),null);
return (new cljs_thread.eve.vec.SabVecRoot(cnt,shift,root,tail,tail_len,header_off));
});

/**
* @constructor
 * @implements {cljs_thread.eve.deftype_proto.data.IsEve}
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.IVector}
 * @implements {cljs_thread.eve.deftype_proto.data.IDirectSerialize}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabStorable}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IStack}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabRetirable}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.ILookup}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.vec.SabVecRoot = (function (cnt,shift,root,tail,tail_len,header_off){
this.cnt = cnt;
this.shift = shift;
this.root = root;
this.tail = tail;
this.tail_len = tail_len;
this.header_off = header_off;
this.cljs$lang$protocol_mask$partition0$ = 2179490591;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$IsEve$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((18),self__.header_off);
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
if(((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))))){
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,k);
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,k,not_found){
var self__ = this;
var ___$1 = this;
if(((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))))){
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,k);
} else {
return not_found;
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (_,n){
var self__ = this;
var ___$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,n);
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
return not_found;
} else {
return this$__$1.cljs$core$IIndexed$_nth$arity$2(null, n);
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,opts){
var self__ = this;
var ___$1 = this;
cljs.core._write(writer,"#sab/vec [");

var n__5636__auto___21726 = (function (){var x__5133__auto__ = self__.cnt;
var y__5134__auto__ = (10);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i_21728 = (0);
while(true){
if((i_21728 < n__5636__auto___21726)){
if((i_21728 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,i_21728)], 0)));

var G__21732 = (i_21728 + (1));
i_21728 = G__21732;
continue;
} else {
}
break;
}

if((self__.cnt > (10))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,"]");
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (this$,n,val){
var self__ = this;
var this$__$1 = this;
if((n === self__.cnt)){
return this$__$1.cljs$core$ICollection$_conj$arity$2(null, val);
} else {
if((((n < (0))) || ((n > self__.cnt)))){
throw (new Error(["Index ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)," out of bounds [0,",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.cnt),"]"].join('')));
} else {
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var val_off = cljs_thread.eve.vec.make_value_block_BANG_(val_bytes);
var toff = cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$1(self__.cnt);
if((n >= toff)){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$1(self__.tail);
cljs_thread.eve.vec.node_set_BANG_(new_tail,(n - toff),val_off);

return cljs_thread.eve.vec.make_sab_vec_root(self__.cnt,self__.shift,self__.root,new_tail,self__.tail_len);
} else {
var new_root = cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$4(self__.shift,self__.root,n,val_off);
return cljs_thread.eve.vec.make_sab_vec_root(self__.cnt,self__.shift,new_root,self__.tail,self__.tail_len);
}

}
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IStack$_peek$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,(self__.cnt - (1)));
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IStack$_pop$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
throw (new Error("Can't pop empty vector"));
} else {
if((self__.cnt === (1))){
return (cljs_thread.eve.vec.empty_sab_vec.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.vec.empty_sab_vec.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.vec.empty_sab_vec.call(null, ));
} else {
if((self__.tail_len > (1))){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$1(self__.tail);
cljs_thread.eve.vec.node_set_BANG_(new_tail,(self__.tail_len - (1)),(-1));

return cljs_thread.eve.vec.make_sab_vec_root((self__.cnt - (1)),self__.shift,self__.root,new_tail,(self__.tail_len - (1)));
} else {
var new_cnt = (self__.cnt - (1));
var new_tail_off = (function (){var node_off = self__.root;
var sh = self__.shift;
while(true){
var idx = (((new_cnt - (1)) >>> sh) & (31));
if((sh === (0))){
return node_off;
} else {
var G__21756 = cljs_thread.eve.vec.node_get(node_off,idx);
var G__21757 = (sh - (5));
node_off = G__21756;
sh = G__21757;
continue;
}
break;
}
})();
var new_root = cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$3(self__.shift,self__.root,self__.cnt);
if((new_root === (-1))){
return cljs_thread.eve.vec.make_sab_vec_root(new_cnt,(5),(-1),new_tail_off,(32));
} else {
if((((self__.shift > (5))) && ((cljs_thread.eve.vec.node_get(new_root,(1)) === (-1))))){
return cljs_thread.eve.vec.make_sab_vec_root(new_cnt,(self__.shift - (5)),cljs_thread.eve.vec.node_get(new_root,(0)),new_tail_off,(32));
} else {
return cljs_thread.eve.vec.make_sab_vec_root(new_cnt,self__.shift,new_root,new_tail_off,(32));

}
}
}

}
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return new cljs.core.Keyword(null,"eve-vec","eve-vec",-1217538365);
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1(null, );
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return (cljs_thread.eve.vec.dispose_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.vec.dispose_BANG_.cljs$core$IFn$_invoke$arity$1(this$__$1) : cljs_thread.eve.vec.dispose_BANG_.call(null, this$__$1));
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.hash_ordered_coll(this$__$1);
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (_,other){
var self__ = this;
var ___$1 = this;
if((!(cljs.core.sequential_QMARK_(other)))){
return false;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.cnt,cljs.core.count(other))){
return false;
} else {
var i = (0);
while(true){
if((i >= self__.cnt)){
return true;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,i),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(other,i))){
var G__21779 = (i + (1));
i = G__21779;
continue;
} else {
return false;
}
}
break;
}

}
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.vec.empty_sab_vec.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.vec.empty_sab_vec.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.vec.empty_sab_vec.call(null, ));
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (_,f){
var self__ = this;
var ___$1 = this;
var G__21084 = self__.cnt;
switch (G__21084) {
case (0):
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));

break;
case (1):
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,(0));

break;
default:
var i = (1);
var acc = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,(0));
while(true){
if((i >= self__.cnt)){
return acc;
} else {
var acc_SINGLEQUOTE_ = (function (){var G__21085 = acc;
var G__21086 = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,i);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__21085,G__21086) : f.call(null, G__21085,G__21086));
})();
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__21781 = (i + (1));
var G__21782 = acc_SINGLEQUOTE_;
i = G__21781;
acc = G__21782;
continue;
}
}
break;
}

}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var i = (0);
var acc = init;
while(true){
if((((i >= self__.cnt)) || (cljs.core.reduced_QMARK_(acc)))){
if(cljs.core.reduced_QMARK_(acc)){
return cljs.core.deref(acc);
} else {
return acc;
}
} else {
var G__21784 = (i + (1));
var G__21785 = (function (){var G__21088 = acc;
var G__21089 = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,i);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__21088,G__21089) : f.call(null, G__21088,G__21089));
})();
i = G__21784;
acc = G__21785;
continue;
}
break;
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 = (function (this$,new_value,_slab_env,mode){
var self__ = this;
var this$__$1 = this;
var old_root = self__.root;
var old_shift = self__.shift;
if((new_value instanceof cljs_thread.eve.vec.SabVecRoot)){
var new_root_off = new_value.root;
return (cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$5(old_root,new_root_off,old_shift,(-1),mode) : cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.call(null, old_root,new_root_off,old_shift,(-1),mode));
} else {
return (cljs_thread.eve.vec.dispose_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.vec.dispose_BANG_.cljs$core$IFn$_invoke$arity$1(this$__$1) : cljs_thread.eve.vec.dispose_BANG_.call(null, this$__$1));
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this$,k,v){
var self__ = this;
var this$__$1 = this;
if(cljs.core.integer_QMARK_(k)){
return this$__$1.cljs$core$IVector$_assoc_n$arity$3(null, k,v);
} else {
throw (new Error("Vector's key for assoc must be a number."));
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
return ((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))));
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
return (function cljs_thread$eve$vec$iter(i){
return (new cljs.core.LazySeq(null,(function (){
if((i < self__.cnt)){
return cljs.core.cons(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$5(self__.cnt,self__.shift,self__.root,self__.tail,i),cljs_thread$eve$vec$iter((i + (1))));
} else {
return null;
}
}),null,null));
})((0));
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$ICollection$_conj$arity$2 = (function (_,val){
var self__ = this;
var ___$1 = this;
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var val_off = cljs_thread.eve.vec.make_value_block_BANG_(val_bytes);
if((self__.tail_len < (32))){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$1(self__.tail);
cljs_thread.eve.vec.node_set_BANG_(new_tail,self__.tail_len,val_off);

return cljs_thread.eve.vec.make_sab_vec_root((self__.cnt + (1)),self__.shift,self__.root,new_tail,(self__.tail_len + (1)));
} else {
var old_tail = self__.tail;
var new_tail = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$0();
var ___$2 = cljs_thread.eve.vec.node_set_BANG_(new_tail,(0),val_off);
if((((1) << self__.shift) >= (self__.cnt >>> (5)))){
var new_root = cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$4(self__.shift,self__.root,old_tail,self__.cnt);
return cljs_thread.eve.vec.make_sab_vec_root((self__.cnt + (1)),self__.shift,new_root,new_tail,(1));
} else {
var new_root_off = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$0();
var ___$3 = cljs_thread.eve.vec.node_set_BANG_(new_root_off,(0),self__.root);
var new_shift = (self__.shift + (5));
var ___$4 = cljs_thread.eve.vec.node_set_BANG_(new_root_off,(1),cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$2(self__.shift,old_tail));
return cljs_thread.eve.vec.make_sab_vec_root((self__.cnt + (1)),new_shift,new_root_off,new_tail,(1));
}
}
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__21132 = (arguments.length - (1));
switch (G__21132) {
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

(cljs_thread.eve.vec.SabVecRoot.prototype.apply = (function (self__,args21018){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args21018)));
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IFn$_invoke$arity$1 = (function (k){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,null);
}));

(cljs_thread.eve.vec.SabVecRoot.prototype.cljs$core$IFn$_invoke$arity$2 = (function (k,not_found){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,not_found);
}));

(cljs_thread.eve.vec.SabVecRoot.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"shift","shift",-1657295705,null),new cljs.core.Symbol(null,"root","root",1191874074,null),new cljs.core.Symbol(null,"tail","tail",494507963,null),new cljs.core.Symbol(null,"tail-len","tail-len",-1955131247,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null)], null);
}));

(cljs_thread.eve.vec.SabVecRoot.cljs$lang$type = true);

(cljs_thread.eve.vec.SabVecRoot.cljs$lang$ctorStr = "cljs-thread.eve.vec/SabVecRoot");

(cljs_thread.eve.vec.SabVecRoot.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.vec/SabVecRoot");
}));

/**
 * Positional factory function for cljs-thread.eve.vec/SabVecRoot.
 */
cljs_thread.eve.vec.__GT_SabVecRoot = (function cljs_thread$eve$vec$__GT_SabVecRoot(cnt,shift,root,tail,tail_len,header_off){
return (new cljs_thread.eve.vec.SabVecRoot(cnt,shift,root,tail,tail_len,header_off));
});

/**
 * Dispose a SabVecRoot or SabVecN, freeing its entire trie tree and tail.
 * Call this when the vector is no longer needed to reclaim slab memory.
 * 
 * WARNING: After disposal, the vector must not be used. Any access will
 * result in undefined behavior or errors.
 */
cljs_thread.eve.vec.dispose_BANG_ = (function cljs_thread$eve$vec$dispose_BANG_(sab_vec){
var root_off = sab_vec.root;
var tail_off = sab_vec.tail;
var shift_val = sab_vec.shift;
var header_off = sab_vec.header_off;
var ns = (((sab_vec instanceof cljs_thread.eve.vec.SabVecN))?sab_vec.node_size:(32));
var ss = cljs_thread.eve.vec.size__GT_shift(ns);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_off,(-1))){
cljs_thread.eve.vec.free_trie_node_BANG_(root_off,shift_val,ns,ss);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(tail_off,(-1))){
cljs_thread.eve.vec.free_leaf_node_BANG_(tail_off,ns);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(header_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(header_off);
} else {
return null;
}
});
/**
 * After an atom swap that replaced old-root with new-root, retire the old
 * path nodes that are no longer referenced by the new trie.
 * 
 * Walks both tries following the index bits for the modified index. At each
 * level where old-node != new-node, the old node is freed.
 * 
 * Only retires trie internal/leaf nodes — shared subtrees and value blocks
 * are untouched.
 * 
 * mode: :retire (epoch-based, for multi-worker) or :free (immediate)
 * idx: the index that was modified (for assoc) or -1 for structural changes
 */
cljs_thread.eve.vec.retire_replaced_trie_path_BANG_ = (function cljs_thread$eve$vec$retire_replaced_trie_path_BANG_(var_args){
var G__21162 = arguments.length;
switch (G__21162) {
case 4:
return cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 8:
return cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$8((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),(arguments[(6)]),(arguments[(7)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (old_root,new_root,shift_val,idx){
return cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$5(old_root,new_root,shift_val,idx,new cljs.core.Keyword(null,"free","free",801364328));
}));

(cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (old_root,new_root,shift_val,idx,mode){
return cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$8(old_root,new_root,shift_val,idx,mode,(32),(5),(31));
}));

(cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$core$IFn$_invoke$arity$8 = (function (old_root,new_root,shift_val,idx,mode,node_size,shift_step,mask){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_root,new_root)))){
var old_off = old_root;
var new_off = new_root;
var sh = shift_val;
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_off,new_off)))){
cljs_thread.eve.deftype_proto.alloc.free_BANG_(old_off);

if((((sh > (0))) && ((idx >= (0))))){
var child_idx = ((idx >>> sh) & mask);
var old_child = cljs_thread.eve.vec.node_get(old_off,child_idx);
var new_child = cljs_thread.eve.vec.node_get(new_off,child_idx);
var G__21814 = old_child;
var G__21815 = new_child;
var G__21816 = (sh - shift_step);
old_off = G__21814;
new_off = G__21815;
sh = G__21816;
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
}));

(cljs_thread.eve.vec.retire_replaced_trie_path_BANG_.cljs$lang$maxFixedArity = 8);

/**
 * Create an empty SabVec.
 */
cljs_thread.eve.vec.empty_sab_vec = (function cljs_thread$eve$vec$empty_sab_vec(){
var tail_off = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$0();
return cljs_thread.eve.vec.make_sab_vec_root((0),(5),(-1),tail_off,(0));
});
/**
 * Create a SabVec from a sequence of values.
 */
cljs_thread.eve.vec.sab_vec = (function cljs_thread$eve$vec$sab_vec(coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.vec.empty_sab_vec(),coll);
});
/**
 * Write SabVecN fields to the header block.
 */
cljs_thread.eve.vec.write_vec_n_header_BANG_ = (function cljs_thread$eve$vec$write_vec_n_header_BANG_(header_off,cnt,shift,root,tail,tail_len,node_size){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(header_off);

cljs_thread.eve.vec.r_set_i32((0),cnt);

cljs_thread.eve.vec.r_set_i32((4),shift);

cljs_thread.eve.vec.r_set_i32((8),root);

cljs_thread.eve.vec.r_set_i32((12),tail);

cljs_thread.eve.vec.r_set_i32((16),tail_len);

return cljs_thread.eve.vec.r_set_i32((20),node_size);
});
/**
 * Create a SabVecN, allocating a header block in the slab.
 */
cljs_thread.eve.vec.make_sab_vec_n = (function cljs_thread$eve$vec$make_sab_vec_n(cnt,shift,root,tail,tail_len,node_size){
var header_off = cljs_thread.eve.vec.alloc_bytes_BANG_((24));
cljs_thread.eve.vec.write_vec_n_header_BANG_(header_off,cnt,shift,root,tail,tail_len,node_size);

return (new cljs_thread.eve.vec.SabVecN(cnt,shift,root,tail,tail_len,node_size,header_off));
});

/**
* @constructor
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.IVector}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IStack}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.ILookup}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.vec.SabVecN = (function (cnt,shift,root,tail,tail_len,node_size,header_off){
this.cnt = cnt;
this.shift = shift;
this.root = root;
this.tail = tail;
this.tail_len = tail_len;
this.node_size = node_size;
this.header_off = header_off;
this.cljs$lang$protocol_mask$partition0$ = 2179490591;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
if(((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))))){
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,k,self__.node_size,shift_step,mask);
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,k,not_found){
var self__ = this;
var ___$1 = this;
if(((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))))){
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,k,self__.node_size,shift_step,mask);
} else {
return not_found;
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (_,n){
var self__ = this;
var ___$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,n,self__.node_size,shift_step,mask);
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
return not_found;
} else {
return this$__$1.cljs$core$IIndexed$_nth$arity$2(null, n);
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,opts){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
cljs.core._write(writer,["#sab/vec-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.node_size)," ["].join(''));

var n__5636__auto___21821 = (function (){var x__5133__auto__ = self__.cnt;
var y__5134__auto__ = (10);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i_21822 = (0);
while(true){
if((i_21822 < n__5636__auto___21821)){
if((i_21822 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,i_21822,self__.node_size,shift_step,mask)], 0)));

var G__21826 = (i_21822 + (1));
i_21822 = G__21826;
continue;
} else {
}
break;
}

if((self__.cnt > (10))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,"]");
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (this$,n,val){
var self__ = this;
var this$__$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
if((n === self__.cnt)){
return this$__$1.cljs$core$ICollection$_conj$arity$2(null, val);
} else {
if((((n < (0))) || ((n > self__.cnt)))){
throw (new Error(["Index ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)," out of bounds [0,",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.cnt),"]"].join('')));
} else {
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var val_off = cljs_thread.eve.vec.make_value_block_BANG_(val_bytes);
var toff = cljs_thread.eve.vec.tail_offset_calc.cljs$core$IFn$_invoke$arity$3(self__.cnt,self__.node_size,shift_step);
if((n >= toff)){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(self__.tail,self__.node_size);
cljs_thread.eve.vec.node_set_BANG_(new_tail,(n - toff),val_off);

return cljs_thread.eve.vec.make_sab_vec_n(self__.cnt,self__.shift,self__.root,new_tail,self__.tail_len,self__.node_size);
} else {
var new_root = cljs_thread.eve.vec.do_assoc.cljs$core$IFn$_invoke$arity$7(self__.shift,self__.root,n,val_off,self__.node_size,shift_step,mask);
return cljs_thread.eve.vec.make_sab_vec_n(self__.cnt,self__.shift,new_root,self__.tail,self__.tail_len,self__.node_size);
}

}
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IStack$_peek$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,(self__.cnt - (1)),self__.node_size,shift_step,mask);
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IStack$_pop$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
if((self__.cnt === (0))){
throw (new Error("Can't pop empty vector"));
} else {
if((self__.cnt === (1))){
return (cljs_thread.eve.vec.empty_sab_vec_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.vec.empty_sab_vec_n.cljs$core$IFn$_invoke$arity$1(self__.node_size) : cljs_thread.eve.vec.empty_sab_vec_n.call(null, self__.node_size));
} else {
if((self__.tail_len > (1))){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(self__.tail,self__.node_size);
cljs_thread.eve.vec.node_set_BANG_(new_tail,(self__.tail_len - (1)),(-1));

return cljs_thread.eve.vec.make_sab_vec_n((self__.cnt - (1)),self__.shift,self__.root,new_tail,(self__.tail_len - (1)),self__.node_size);
} else {
var new_cnt = (self__.cnt - (1));
var new_tail_off = (function (){var node_off = self__.root;
var sh = self__.shift;
while(true){
var idx = (((new_cnt - (1)) >>> sh) & mask);
if((sh === (0))){
return node_off;
} else {
var G__21828 = cljs_thread.eve.vec.node_get(node_off,idx);
var G__21829 = (sh - shift_step);
node_off = G__21828;
sh = G__21829;
continue;
}
break;
}
})();
var new_root = cljs_thread.eve.vec.pop_tail.cljs$core$IFn$_invoke$arity$6(self__.shift,self__.root,self__.cnt,self__.node_size,shift_step,mask);
if((new_root === (-1))){
return cljs_thread.eve.vec.make_sab_vec_n(new_cnt,shift_step,(-1),new_tail_off,self__.node_size,self__.node_size);
} else {
if((((self__.shift > shift_step)) && ((cljs_thread.eve.vec.node_get(new_root,(1)) === (-1))))){
return cljs_thread.eve.vec.make_sab_vec_n(new_cnt,(self__.shift - shift_step),cljs_thread.eve.vec.node_get(new_root,(0)),new_tail_off,self__.node_size,self__.node_size);
} else {
return cljs_thread.eve.vec.make_sab_vec_n(new_cnt,self__.shift,new_root,new_tail_off,self__.node_size,self__.node_size);

}
}
}

}
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.hash_ordered_coll(this$__$1);
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (_,other){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
if((!(cljs.core.sequential_QMARK_(other)))){
return false;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.cnt,cljs.core.count(other))){
return false;
} else {
var i = (0);
while(true){
if((i >= self__.cnt)){
return true;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,i,self__.node_size,shift_step,mask),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(other,i))){
var G__21836 = (i + (1));
i = G__21836;
continue;
} else {
return false;
}
}
break;
}

}
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.vec.empty_sab_vec_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.vec.empty_sab_vec_n.cljs$core$IFn$_invoke$arity$1(self__.node_size) : cljs_thread.eve.vec.empty_sab_vec_n.call(null, self__.node_size));
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (_,f){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
var G__21482 = self__.cnt;
switch (G__21482) {
case (0):
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));

break;
case (1):
return cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,(0),self__.node_size,shift_step,mask);

break;
default:
var i = (1);
var acc = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,(0),self__.node_size,shift_step,mask);
while(true){
if((i >= self__.cnt)){
return acc;
} else {
var acc_SINGLEQUOTE_ = (function (){var G__21485 = acc;
var G__21486 = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,i,self__.node_size,shift_step,mask);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__21485,G__21486) : f.call(null, G__21485,G__21486));
})();
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__21854 = (i + (1));
var G__21855 = acc_SINGLEQUOTE_;
i = G__21854;
acc = G__21855;
continue;
}
}
break;
}

}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
var i = (0);
var acc = init;
while(true){
if((((i >= self__.cnt)) || (cljs.core.reduced_QMARK_(acc)))){
if(cljs.core.reduced_QMARK_(acc)){
return cljs.core.deref(acc);
} else {
return acc;
}
} else {
var G__21862 = (i + (1));
var G__21863 = (function (){var G__21489 = acc;
var G__21490 = cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,i,self__.node_size,shift_step,mask);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__21489,G__21490) : f.call(null, G__21489,G__21490));
})();
i = G__21862;
acc = G__21863;
continue;
}
break;
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this$,k,v){
var self__ = this;
var this$__$1 = this;
if(cljs.core.integer_QMARK_(k)){
return this$__$1.cljs$core$IVector$_assoc_n$arity$3(null, k,v);
} else {
throw (new Error("Vector's key for assoc must be a number."));
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
return ((cljs.core.integer_QMARK_(k)) && ((((k >= (0))) && ((k < self__.cnt)))));
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
return (function cljs_thread$eve$vec$iter(i){
return (new cljs.core.LazySeq(null,(function (){
if((i < self__.cnt)){
return cljs.core.cons(cljs_thread.eve.vec.nth_impl.cljs$core$IFn$_invoke$arity$8(self__.cnt,self__.shift,self__.root,self__.tail,i,self__.node_size,shift_step,mask),cljs_thread$eve$vec$iter((i + (1))));
} else {
return null;
}
}),null,null));
})((0));
} else {
return null;
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$ICollection$_conj$arity$2 = (function (_,val){
var self__ = this;
var ___$1 = this;
var shift_step = cljs_thread.eve.vec.size__GT_shift(self__.node_size);
var mask = cljs_thread.eve.vec.size__GT_mask(self__.node_size);
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var val_off = cljs_thread.eve.vec.make_value_block_BANG_(val_bytes);
if((self__.tail_len < self__.node_size)){
var new_tail = cljs_thread.eve.vec.clone_node_BANG_.cljs$core$IFn$_invoke$arity$2(self__.tail,self__.node_size);
cljs_thread.eve.vec.node_set_BANG_(new_tail,self__.tail_len,val_off);

return cljs_thread.eve.vec.make_sab_vec_n((self__.cnt + (1)),self__.shift,self__.root,new_tail,(self__.tail_len + (1)),self__.node_size);
} else {
var old_tail = self__.tail;
var new_tail = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1(self__.node_size);
var ___$2 = cljs_thread.eve.vec.node_set_BANG_(new_tail,(0),val_off);
if((((1) << self__.shift) >= (self__.cnt >>> shift_step))){
var new_root = cljs_thread.eve.vec.push_tail.cljs$core$IFn$_invoke$arity$7(self__.shift,self__.root,old_tail,self__.cnt,self__.node_size,shift_step,mask);
return cljs_thread.eve.vec.make_sab_vec_n((self__.cnt + (1)),self__.shift,new_root,new_tail,(1),self__.node_size);
} else {
var new_root_off = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1(self__.node_size);
var ___$3 = cljs_thread.eve.vec.node_set_BANG_(new_root_off,(0),self__.root);
var new_shift = (self__.shift + shift_step);
var ___$4 = cljs_thread.eve.vec.node_set_BANG_(new_root_off,(1),cljs_thread.eve.vec.new_path.cljs$core$IFn$_invoke$arity$4(self__.shift,old_tail,self__.node_size,shift_step));
return cljs_thread.eve.vec.make_sab_vec_n((self__.cnt + (1)),new_shift,new_root_off,new_tail,(1),self__.node_size);
}
}
}));

(cljs_thread.eve.vec.SabVecN.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__21537 = (arguments.length - (1));
switch (G__21537) {
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

(cljs_thread.eve.vec.SabVecN.prototype.apply = (function (self__,args21366){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args21366)));
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IFn$_invoke$arity$1 = (function (k){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,null);
}));

(cljs_thread.eve.vec.SabVecN.prototype.cljs$core$IFn$_invoke$arity$2 = (function (k,not_found){
var self__ = this;
var this$ = this;
return this$.cljs$core$ILookup$_lookup$arity$3(null, k,not_found);
}));

(cljs_thread.eve.vec.SabVecN.getBasis = (function (){
return new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"shift","shift",-1657295705,null),new cljs.core.Symbol(null,"root","root",1191874074,null),new cljs.core.Symbol(null,"tail","tail",494507963,null),new cljs.core.Symbol(null,"tail-len","tail-len",-1955131247,null),new cljs.core.Symbol(null,"node-size","node-size",-37070107,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null)], null);
}));

(cljs_thread.eve.vec.SabVecN.cljs$lang$type = true);

(cljs_thread.eve.vec.SabVecN.cljs$lang$ctorStr = "cljs-thread.eve.vec/SabVecN");

(cljs_thread.eve.vec.SabVecN.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.vec/SabVecN");
}));

/**
 * Positional factory function for cljs-thread.eve.vec/SabVecN.
 */
cljs_thread.eve.vec.__GT_SabVecN = (function cljs_thread$eve$vec$__GT_SabVecN(cnt,shift,root,tail,tail_len,node_size,header_off){
return (new cljs_thread.eve.vec.SabVecN(cnt,shift,root,tail,tail_len,node_size,header_off));
});

/**
 * Create an empty SabVecN with specified chunk size.
 * Valid sizes: 32, 64, 128, 256, 512, 1024
 */
cljs_thread.eve.vec.empty_sab_vec_n = (function cljs_thread$eve$vec$empty_sab_vec_n(node_size){
var shift_step = cljs_thread.eve.vec.size__GT_shift(node_size);
var tail_off = cljs_thread.eve.vec.alloc_node_BANG_.cljs$core$IFn$_invoke$arity$1(node_size);
return cljs_thread.eve.vec.make_sab_vec_n((0),shift_step,(-1),tail_off,(0),node_size);
});
/**
 * Create a SabVecN from a sequence of values with specified chunk size.
 * Valid sizes: 32, 64, 128, 256, 512, 1024
 */
cljs_thread.eve.vec.sab_vec_n = (function cljs_thread$eve$vec$sab_vec_n(node_size,coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.vec.empty_sab_vec_n(node_size),coll);
});
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_((18),(function (_sab,slab_offset){
return cljs_thread.eve.vec.make_sab_vec_root_from_header(slab_offset);
}));
cljs_thread.eve.deftype_proto.serialize.register_cljs_to_sab_builder_BANG_(cljs.core.vector_QMARK_,(function (v){
return cljs_thread.eve.vec.sab_vec(v);
}));

//# sourceMappingURL=cljs_thread.eve.vec.js.map
