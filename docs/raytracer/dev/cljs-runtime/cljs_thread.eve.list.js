goog.provide('cljs_thread.eve.list');







cljs_thread.eve.list.MAX_POOL_SIZE = (256);
cljs_thread.eve.list.BATCH_ALLOC_SIZE = (32);
cljs_thread.eve.list.size_class_for = (function cljs_thread$eve$list$size_class_for(n){
if((n <= (32))){
return (32);
} else {
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
}
});
cljs_thread.eve.list.pool_32 = [];
cljs_thread.eve.list.pool_64 = [];
cljs_thread.eve.list.pool_128 = [];
cljs_thread.eve.list.pool_256 = [];
cljs_thread.eve.list.pool_512 = [];
cljs_thread.eve.list.reset_pools_BANG_ = (function cljs_thread$eve$list$reset_pools_BANG_(){
(cljs_thread.eve.list.pool_32 = []);

(cljs_thread.eve.list.pool_64 = []);

(cljs_thread.eve.list.pool_128 = []);

(cljs_thread.eve.list.pool_256 = []);

return (cljs_thread.eve.list.pool_512 = []);
});
cljs_thread.eve.list.drain_pools_BANG_ = (function cljs_thread$eve$list$drain_pools_BANG_(){
var seq__20546_21499 = cljs.core.seq(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.list.pool_32,cljs_thread.eve.list.pool_64,cljs_thread.eve.list.pool_128,cljs_thread.eve.list.pool_256,cljs_thread.eve.list.pool_512], null));
var chunk__20548_21500 = null;
var count__20551_21501 = (0);
var i__20552_21502 = (0);
while(true){
if((i__20552_21502 < count__20551_21501)){
var pool_21503 = chunk__20548_21500.cljs$core$IIndexed$_nth$arity$2(null, i__20552_21502);
var n__5636__auto___21507 = pool_21503.length;
var i_21508 = (0);
while(true){
if((i_21508 < n__5636__auto___21507)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_21503[i_21508]));

var G__21509 = (i_21508 + (1));
i_21508 = G__21509;
continue;
} else {
}
break;
}


var G__21510 = seq__20546_21499;
var G__21511 = chunk__20548_21500;
var G__21512 = count__20551_21501;
var G__21513 = (i__20552_21502 + (1));
seq__20546_21499 = G__21510;
chunk__20548_21500 = G__21511;
count__20551_21501 = G__21512;
i__20552_21502 = G__21513;
continue;
} else {
var temp__5823__auto___21514 = cljs.core.seq(seq__20546_21499);
if(temp__5823__auto___21514){
var seq__20546_21515__$1 = temp__5823__auto___21514;
if(cljs.core.chunked_seq_QMARK_(seq__20546_21515__$1)){
var c__5568__auto___21516 = cljs.core.chunk_first(seq__20546_21515__$1);
var G__21517 = cljs.core.chunk_rest(seq__20546_21515__$1);
var G__21518 = c__5568__auto___21516;
var G__21519 = cljs.core.count(c__5568__auto___21516);
var G__21520 = (0);
seq__20546_21499 = G__21517;
chunk__20548_21500 = G__21518;
count__20551_21501 = G__21519;
i__20552_21502 = G__21520;
continue;
} else {
var pool_21521 = cljs.core.first(seq__20546_21515__$1);
var n__5636__auto___21522 = pool_21521.length;
var i_21523 = (0);
while(true){
if((i_21523 < n__5636__auto___21522)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_21521[i_21523]));

var G__21524 = (i_21523 + (1));
i_21523 = G__21524;
continue;
} else {
}
break;
}


var G__21528 = cljs.core.next(seq__20546_21515__$1);
var G__21529 = null;
var G__21530 = (0);
var G__21531 = (0);
seq__20546_21499 = G__21528;
chunk__20548_21500 = G__21529;
count__20551_21501 = G__21530;
i__20552_21502 = G__21531;
continue;
}
} else {
}
}
break;
}

(cljs_thread.eve.list.pool_32 = []);

(cljs_thread.eve.list.pool_64 = []);

(cljs_thread.eve.list.pool_128 = []);

(cljs_thread.eve.list.pool_256 = []);

return (cljs_thread.eve.list.pool_512 = []);
});
cljs_thread.eve.list.pool_get_BANG_ = (function cljs_thread$eve$list$pool_get_BANG_(size_class){
var stack = (function (){var G__20605 = size_class;
switch (G__20605) {
case (32):
return cljs_thread.eve.list.pool_32;

break;
case (64):
return cljs_thread.eve.list.pool_64;

break;
case (128):
return cljs_thread.eve.list.pool_128;

break;
case (256):
return cljs_thread.eve.list.pool_256;

break;
case (512):
return cljs_thread.eve.list.pool_512;

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
cljs_thread.eve.list.pool_put_BANG_ = (function cljs_thread$eve$list$pool_put_BANG_(size_class,slab_offset){
var stack = (function (){var G__20608 = size_class;
switch (G__20608) {
case (32):
return cljs_thread.eve.list.pool_32;

break;
case (64):
return cljs_thread.eve.list.pool_64;

break;
case (128):
return cljs_thread.eve.list.pool_128;

break;
case (256):
return cljs_thread.eve.list.pool_256;

break;
case (512):
return cljs_thread.eve.list.pool_512;

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
cljs_thread.eve.list.alloc_bytes_BANG_ = (function cljs_thread$eve$list$alloc_bytes_BANG_(n){
var size_class = cljs_thread.eve.list.size_class_for(n);
if(cljs.core.truth_(size_class)){
var temp__5821__auto__ = cljs_thread.eve.list.pool_get_BANG_(size_class);
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
cljs_thread.eve.list.drain_pools_BANG_();

return cljs_thread.eve.deftype_proto.alloc.batch_alloc(size_class,(32));
})()
);
var len = (cljs.core.truth_(results__$1)?results__$1.length:(0));
if((len === (0))){
throw (new Error(["List allocation failed: out of memory for ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_class)," bytes"].join('')));
} else {
}

var i_21539 = (1);
while(true){
if((i_21539 < len)){
cljs_thread.eve.list.pool_put_BANG_(size_class,(results__$1[i_21539]));

var G__21540 = (i_21539 + (1));
i_21539 = G__21540;
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
 * Copy bytes from a slab-qualified offset + byte-within-block into a new Uint8Array.
 */
cljs_thread.eve.list.copy_from_sab = (function cljs_thread$eve$list$copy_from_sab(slab_off,byte_off,len){
var src = cljs_thread.eve.deftype_proto.alloc.read_bytes(slab_off,byte_off,len);
var dst = (new Uint8Array(len));
dst.set(src);

return dst;
});
cljs_thread.eve.list.r_get_i32 = (function cljs_thread$eve$list$r_get_i32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.list.r_get_u32 = (function cljs_thread$eve$list$r_get_u32(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.list.r_set_i32 = (function cljs_thread$eve$list$r_set_i32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.list.r_set_u32 = (function cljs_thread$eve$list$r_set_u32(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint32((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.list.r_get_u16 = (function cljs_thread$eve$list$r_get_u16(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint16((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),true);
});
cljs_thread.eve.list.r_set_u16 = (function cljs_thread$eve$list$r_set_u16(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint16((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val,true);
});
cljs_thread.eve.list.r_get_u8 = (function cljs_thread$eve$list$r_get_u8(off){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off));
});
cljs_thread.eve.list.r_set_u8 = (function cljs_thread$eve$list$r_set_u8(off,val){
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.setUint8((cljs_thread.eve.deftype_proto.alloc.resolved_base + off),val);
});
/**
 * Create a list node with serialized value and next pointer.
 * Returns a slab-qualified offset.
 */
cljs_thread.eve.list.make_list_node_BANG_ = (function cljs_thread$eve$list$make_list_node_BANG_(val_bytes,next_off){
var val_len = val_bytes.length;
var node_size = (((4) + (4)) + val_len);
var slab_off = cljs_thread.eve.list.alloc_bytes_BANG_(node_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.list.r_set_i32((0),next_off);

cljs_thread.eve.list.r_set_u32((4),val_len);

if((val_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(val_bytes,(cljs_thread.eve.deftype_proto.alloc.resolved_base + (8)));
} else {
}

return slab_off;
});
/**
 * Read the next pointer from a list node (slab-qualified offset).
 */
cljs_thread.eve.list.read_node_next = (function cljs_thread$eve$list$read_node_next(node_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(node_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32(base,true);
});
/**
 * Read the value from a node. Returns [value val-len].
 */
cljs_thread.eve.list.read_node_value = (function cljs_thread$eve$list$read_node_value(node_off){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(node_off);

var val_len = cljs_thread.eve.list.r_get_u32((4));
var val_bytes = cljs_thread.eve.list.copy_from_sab(node_off,(8),val_len);
var value = cljs_thread.eve.deftype_proto.serialize.deserialize_element(null,val_bytes);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [value,val_len], null);
});
cljs_thread.eve.list.SABLIST_HEADER_SIZE = (12);
/**
 * Allocate a 12-byte header block for SabList serialization.
 * Stores: [type-id:u8 | pad:3 | cnt:i32 | head-off:i32].
 */
cljs_thread.eve.list.make_sab_list_header_BANG_ = (function cljs_thread$eve$list$make_sab_list_header_BANG_(cnt,head_off){
var header_off = cljs_thread.eve.list.alloc_bytes_BANG_((12));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

cljs_thread.eve.list.r_set_u8((0),(19));

cljs_thread.eve.list.r_set_u8((1),(0));

cljs_thread.eve.list.r_set_u8((2),(0));

cljs_thread.eve.list.r_set_u8((3),(0));

cljs_thread.eve.list.r_set_i32((4),cnt);

cljs_thread.eve.list.r_set_i32((8),head_off);

return header_off;
});

/**
* @constructor
 * @implements {cljs_thread.eve.deftype_proto.data.IsEve}
 * @implements {cljs.core.IIndexed}
 * @implements {cljs_thread.eve.deftype_proto.data.IDirectSerialize}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabStorable}
 * @implements {cljs.core.ISeq}
 * @implements {cljs.core.INext}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IStack}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabRetirable}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.list.SabList = (function (cnt,head_off,header_off){
this.cnt = cnt;
this.head_off = head_off;
this.header_off = header_off;
this.cljs$lang$protocol_mask$partition0$ = 2179473631;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$IsEve$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((19),self__.header_off);
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (_,n){
var self__ = this;
var ___$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
var node_off = self__.head_off;
var i = (0);
while(true){
if((i === n)){
var vec__20838 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20838,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20838,(1),null);
return val;
} else {
var G__21550 = cljs_thread.eve.list.read_node_next(node_off);
var G__21551 = (i + (1));
node_off = G__21550;
i = G__21551;
continue;
}
break;
}
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
return not_found;
} else {
return this$__$1.cljs$core$IIndexed$_nth$arity$2(null, n);
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,opts){
var self__ = this;
var ___$1 = this;
cljs.core._write(writer,"(");

var node_off_21556 = self__.head_off;
var i_21557 = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off_21556,(-1))) && ((i_21557 < (10))))){
if((i_21557 > (0))){
cljs.core._write(writer," ");
} else {
}

var vec__20847_21559 = cljs_thread.eve.list.read_node_value(node_off_21556);
var val_21560 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20847_21559,(0),null);
var __21561__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20847_21559,(1),null);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_21560], 0)));

var G__21562 = cljs_thread.eve.list.read_node_next(node_off_21556);
var G__21563 = (i_21557 + (1));
node_off_21556 = G__21562;
i_21557 = G__21563;
continue;
} else {
}
break;
}

if((self__.cnt > (10))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,")");
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$INext$_next$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (1))){
var new_head = cljs_thread.eve.list.read_node_next(self__.head_off);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new_head,(-1))){
var G__20856 = (self__.cnt - (1));
var G__20857 = new_head;
var G__20858 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__20856,G__20857,G__20858) : cljs_thread.eve.list.__GT_SabList.call(null, G__20856,G__20857,G__20858));
} else {
return null;
}
} else {
return null;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IStack$_peek$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var vec__20863 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20863,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20863,(1),null);
return value;
} else {
return null;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IStack$_pop$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
throw (new Error("Can't pop empty list"));
} else {
if((self__.cnt === (1))){
return (cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.list.empty_sab_list.call(null, ));
} else {
var new_head = cljs_thread.eve.list.read_node_next(self__.head_off);
var G__20866 = (self__.cnt - (1));
var G__20867 = new_head;
var G__20868 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__20866,G__20867,G__20868) : cljs_thread.eve.list.__GT_SabList.call(null, G__20866,G__20867,G__20868));

}
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return new cljs.core.Keyword(null,"eve-list","eve-list",134391247);
}));

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs_thread$eve$deftype_proto$data$IDirectSerialize$_direct_serialize$arity$1(null, );
}));

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 = (function (this$,_slab_env){
var self__ = this;
var this$__$1 = this;
return (cljs_thread.eve.list.dispose_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.dispose_BANG_.cljs$core$IFn$_invoke$arity$1(this$__$1) : cljs_thread.eve.list.dispose_BANG_.call(null, this$__$1));
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.hash_ordered_coll(this$__$1);
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this$,other){
var self__ = this;
var this$__$1 = this;
if((this$__$1 === other)){
return true;
} else {
if((!(cljs.core.sequential_QMARK_(other)))){
return false;
} else {
var node_off = self__.head_off;
var other_seq = cljs.core.seq(other);
while(true){
if((((node_off === (-1))) && ((other_seq == null)))){
return true;
} else {
if((((node_off === (-1))) || ((other_seq == null)))){
return false;
} else {
var vec__20887 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20887,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20887,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(val,cljs.core.first(other_seq))){
var G__21572 = cljs_thread.eve.list.read_node_next(node_off);
var G__21573 = cljs.core.next(other_seq);
node_off = G__21572;
other_seq = G__21573;
continue;
} else {
return false;
}

}
}
break;
}

}
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.list.empty_sab_list.call(null, ));
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (_,f){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));
} else {
var node_off = self__.head_off;
var acc = null;
var first_QMARK_ = true;
while(true){
if((node_off === (-1))){
return acc;
} else {
var vec__20908 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20908,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20908,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
if(first_QMARK_){
var G__21574 = next_off;
var G__21575 = val;
var G__21576 = false;
node_off = G__21574;
acc = G__21575;
first_QMARK_ = G__21576;
continue;
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__21577 = next_off;
var G__21578 = acc_SINGLEQUOTE_;
var G__21579 = false;
node_off = G__21577;
acc = G__21578;
first_QMARK_ = G__21579;
continue;
}
}
}
break;
}
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var node_off = self__.head_off;
var acc = init;
while(true){
if((((node_off === (-1))) || (cljs.core.reduced_QMARK_(acc)))){
if(cljs.core.reduced_QMARK_(acc)){
return cljs.core.deref(acc);
} else {
return acc;
}
} else {
var vec__20922 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20922,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20922,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
var G__21588 = next_off;
var G__21589 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
node_off = G__21588;
acc = G__21589;
continue;
}
break;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var vec__20925 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20925,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20925,(1),null);
return value;
} else {
return null;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeq$_rest$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
return (cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.list.empty_sab_list.call(null, ));
} else {
var new_head = cljs_thread.eve.list.read_node_next(self__.head_off);
var new_cnt = (self__.cnt - (1));
if((new_head === (-1))){
return (cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.list.empty_sab_list.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.list.empty_sab_list.call(null, ));
} else {
var G__20934 = new_cnt;
var G__20935 = new_head;
var G__20936 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__20934,G__20935,G__20936) : cljs_thread.eve.list.__GT_SabList.call(null, G__20934,G__20935,G__20936));
}
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.list.SabList.prototype.cljs_thread$eve$deftype_proto$data$ISabRetirable$_sab_retire_diff_BANG_$arity$4 = (function (this$,new_value,_slab_env,mode){
var self__ = this;
var this$__$1 = this;
var old_head = self__.head_off;
var new_head = (((new_value instanceof cljs_thread.eve.list.SabList))?new_value.head_off:null);
if(cljs.core.truth_(new_head)){
return (cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$3(old_head,new_head,mode) : cljs_thread.eve.list.retire_replaced_chain_BANG_.call(null, old_head,new_head,mode));
} else {
return (cljs_thread.eve.list.dispose_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.dispose_BANG_.cljs$core$IFn$_invoke$arity$1(this$__$1) : cljs_thread.eve.list.dispose_BANG_.call(null, this$__$1));
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if((self__.cnt > (0))){
return this$__$1;
} else {
return null;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ICollection$_conj$arity$2 = (function (_,val){
var self__ = this;
var ___$1 = this;
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var new_off = cljs_thread.eve.list.make_list_node_BANG_(val_bytes,self__.head_off);
var new_cnt = (self__.cnt + (1));
var G__20940 = new_cnt;
var G__20941 = new_off;
var G__20942 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_off);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__20940,G__20941,G__20942) : cljs_thread.eve.list.__GT_SabList.call(null, G__20940,G__20941,G__20942));
}));

(cljs_thread.eve.list.SabList.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__20949 = (arguments.length - (1));
switch (G__20949) {
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

(cljs_thread.eve.list.SabList.prototype.apply = (function (self__,args20825){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args20825)));
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IFn$_invoke$arity$1 = (function (n){
var self__ = this;
var this$ = this;
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(this$,n);
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$IFn$_invoke$arity$2 = (function (n,not_found){
var self__ = this;
var this$ = this;
return cljs.core.nth.cljs$core$IFn$_invoke$arity$3(this$,n,not_found);
}));

(cljs_thread.eve.list.SabList.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"head-off","head-off",-1145359440,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null)], null);
}));

(cljs_thread.eve.list.SabList.cljs$lang$type = true);

(cljs_thread.eve.list.SabList.cljs$lang$ctorStr = "cljs-thread.eve.list/SabList");

(cljs_thread.eve.list.SabList.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.list/SabList");
}));

/**
 * Positional factory function for cljs-thread.eve.list/SabList.
 */
cljs_thread.eve.list.__GT_SabList = (function cljs_thread$eve$list$__GT_SabList(cnt,head_off,header_off){
return (new cljs_thread.eve.list.SabList(cnt,head_off,header_off));
});

/**
 * Free a single slab-qualified offset.
 */
cljs_thread.eve.list.free_block_BANG_ = (function cljs_thread$eve$list$free_block_BANG_(slab_offset){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_offset,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(slab_offset);
} else {
return null;
}
});
/**
 * Free all nodes in a SabList linked list chain.
 */
cljs_thread.eve.list.free_list_chain_BANG_ = (function cljs_thread$eve$list$free_list_chain_BANG_(head_off){
var node_off = head_off;
while(true){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off,(-1))){
var next_off = cljs_thread.eve.list.read_node_next(node_off);
cljs_thread.eve.list.free_block_BANG_(node_off);

var G__21625 = next_off;
node_off = G__21625;
continue;
} else {
return null;
}
break;
}
});
/**
 * Free all chunks and their value blocks in a SabListN chain.
 */
cljs_thread.eve.list.free_chunk_chain_BANG_ = (function cljs_thread$eve$list$free_chunk_chain_BANG_(head_off,head_idx,chunk_size){
var chunk_off = head_off;
var idx = head_idx;
while(true){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(chunk_off,(-1))){
var _ = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);
var chunk_cnt = cljs_thread.eve.list.r_get_u16(cljs_thread.eve.list.CHUNK_COUNT_OFFSET);
var next_chunk = cljs_thread.eve.list.r_get_i32(cljs_thread.eve.list.CHUNK_NEXT_OFFSET);
var i_21628 = idx;
while(true){
if((i_21628 < chunk_size)){
var val_off_21629 = (cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3(chunk_off,chunk_size,i_21628) : cljs_thread.eve.list.chunk_get_offset.call(null, chunk_off,chunk_size,i_21628));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(val_off_21629,(-1))){
cljs_thread.eve.list.free_block_BANG_(val_off_21629);
} else {
}

var G__21631 = (i_21628 + (1));
i_21628 = G__21631;
continue;
} else {
}
break;
}

cljs_thread.eve.list.free_block_BANG_(chunk_off);

var G__21632 = next_chunk;
var G__21633 = (0);
chunk_off = G__21632;
idx = G__21633;
continue;
} else {
return null;
}
break;
}
});
/**
 * Dispose a SabList or SabListN, freeing all nodes/chunks and header.
 * Call this when the list is no longer needed to reclaim slab memory.
 * 
 * WARNING: After disposal, the list must not be used. Any access will
 * result in undefined behavior or errors.
 */
cljs_thread.eve.list.dispose_BANG_ = (function cljs_thread$eve$list$dispose_BANG_(sab_list){
if((sab_list instanceof cljs_thread.eve.list.SabList)){
var head_off = sab_list.head_off;
var hdr_off = sab_list.header_off;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(head_off,(-1))){
cljs_thread.eve.list.free_list_chain_BANG_(head_off);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(hdr_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(hdr_off);
} else {
return null;
}
} else {
if((sab_list instanceof cljs_thread.eve.list.SabListN)){
var head_off = sab_list.head_off;
var head_idx = sab_list.head_idx;
var cs = sab_list.chunk_size;
var hdr_off = sab_list.header_off;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(head_off,(-1))){
cljs_thread.eve.list.free_chunk_chain_BANG_(head_off,head_idx,cs);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(hdr_off,(-1))){
return cljs_thread.eve.deftype_proto.alloc.free_BANG_(hdr_off);
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * After an atom swap that replaced a list, retire old nodes not shared
 * by the new list.
 * 
 * For cons: old-head == new-head.next, so nothing to retire.
 * For pop/rest: new-head == old-head.next, so retire old-head only.
 * For general changes: walk old chain, retire nodes not in new chain.
 * 
 * mode: :retire (epoch-based, for multi-worker) or :free (immediate)
 */
cljs_thread.eve.list.retire_replaced_chain_BANG_ = (function cljs_thread$eve$list$retire_replaced_chain_BANG_(var_args){
var G__20999 = arguments.length;
switch (G__20999) {
case 2:
return cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (old_head,new_head){
return cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$3(old_head,new_head,new cljs.core.Keyword(null,"free","free",801364328));
}));

(cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (old_head,new_head,mode){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_head,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_head,new_head)))){
var node_off = old_head;
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off,new_head)))){
var next_off = cljs_thread.eve.list.read_node_next(node_off);
cljs_thread.eve.deftype_proto.alloc.free_BANG_(node_off);

var G__21639 = next_off;
node_off = G__21639;
continue;
} else {
return null;
}
break;
}
} else {
return null;
}
}));

(cljs_thread.eve.list.retire_replaced_chain_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Create an empty SabList.
 */
cljs_thread.eve.list.empty_sab_list = (function cljs_thread$eve$list$empty_sab_list(){
return cljs_thread.eve.list.__GT_SabList((0),(-1),cljs_thread.eve.list.make_sab_list_header_BANG_((0),(-1)));
});
/**
 * Create a SabList from a sequence of values.
 * Note: Elements are added in reverse order (like Clojure's list).
 */
cljs_thread.eve.list.sab_list = (function cljs_thread$eve$list$sab_list(coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.list.empty_sab_list(),cljs.core.reverse(cljs.core.vec(coll)));
});
/**
 * Conj all elements onto a list (faster, but reverses order).
 */
cljs_thread.eve.list.into_eve_list = (function cljs_thread$eve$list$into_eve_list(coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.list.empty_sab_list(),coll);
});
cljs_thread.eve.list.CHUNK_HEADER_SIZE = (16);
cljs_thread.eve.list.CHUNK_NEXT_OFFSET = (0);
cljs_thread.eve.list.CHUNK_COUNT_OFFSET = (4);
cljs_thread.eve.list.CHUNK_FLAGS_OFFSET = (8);
cljs_thread.eve.list.CHUNK_DATA_REGION_OFFSET = (12);
/**
 * Size of types array (padded to 4-byte alignment).
 */
cljs_thread.eve.list.types_array_size = (function cljs_thread$eve$list$types_array_size(capacity){
var raw_size = capacity;
var remainder = cljs.core.mod(raw_size,(4));
if((remainder === (0))){
return raw_size;
} else {
return (raw_size + ((4) - remainder));
}
});
/**
 * Relative offset to lengths array within chunk.
 */
cljs_thread.eve.list.lengths_array_rel_offset = (function cljs_thread$eve$list$lengths_array_rel_offset(capacity){
return ((16) + cljs_thread.eve.list.types_array_size(capacity));
});
/**
 * Relative offset to offsets array within chunk.
 */
cljs_thread.eve.list.offsets_array_rel_offset = (function cljs_thread$eve$list$offsets_array_rel_offset(capacity){
return (cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (capacity * (4)));
});
/**
 * Allocate a columnar chunk with capacity.
 * Layout: header | types[capacity] | pad | lengths[capacity] | offsets[capacity]
 * Returns a slab-qualified offset.
 */
cljs_thread.eve.list.alloc_columnar_chunk_BANG_ = (function cljs_thread$eve$list$alloc_columnar_chunk_BANG_(capacity){
var types_size = cljs_thread.eve.list.types_array_size(capacity);
var lengths_size = (capacity * (4));
var offsets_size = (capacity * (4));
var total_size = ((((16) + types_size) + lengths_size) + offsets_size);
var slab_off = cljs_thread.eve.list.alloc_bytes_BANG_(total_size);
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.list.r_set_i32((0),(-1));

cljs_thread.eve.list.r_set_u16((4),(0));

cljs_thread.eve.list.r_set_u16(((4) + (2)),(0));

cljs_thread.eve.list.r_set_u32((8),(0));

cljs_thread.eve.list.r_set_i32((12),(-1));

var types_off_21653 = (16);
var lengths_off_21654 = cljs_thread.eve.list.lengths_array_rel_offset(capacity);
var offsets_off_21655 = cljs_thread.eve.list.offsets_array_rel_offset(capacity);
var n__5636__auto___21656 = cljs_thread.eve.list.types_array_size(capacity);
var i_21657 = (0);
while(true){
if((i_21657 < n__5636__auto___21656)){
cljs_thread.eve.list.r_set_u8((types_off_21653 + i_21657),(0));

var G__21658 = (i_21657 + (1));
i_21657 = G__21658;
continue;
} else {
}
break;
}

var n__5636__auto___21660 = capacity;
var i_21661 = (0);
while(true){
if((i_21661 < n__5636__auto___21660)){
cljs_thread.eve.list.r_set_u32((lengths_off_21654 + (i_21661 * (4))),(0));

var G__21663 = (i_21661 + (1));
i_21661 = G__21663;
continue;
} else {
}
break;
}

var n__5636__auto___21664 = capacity;
var i_21665 = (0);
while(true){
if((i_21665 < n__5636__auto___21664)){
cljs_thread.eve.list.r_set_i32((offsets_off_21655 + (i_21665 * (4))),(-1));

var G__21667 = (i_21665 + (1));
i_21665 = G__21667;
continue;
} else {
}
break;
}

return slab_off;
});
/**
 * Read next-chunk pointer from a chunk.
 */
cljs_thread.eve.list.chunk_get_next = (function cljs_thread$eve$list$chunk_get_next(chunk_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((base + (0)),true);
});
/**
 * Read element count from a chunk.
 */
cljs_thread.eve.list.chunk_get_count = (function cljs_thread$eve$list$chunk_get_count(chunk_off){
var base = cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);
return cljs_thread.eve.deftype_proto.alloc.resolved_dv.getUint16((base + (4)),true);
});
/**
 * Write next-chunk pointer to a chunk.
 */
cljs_thread.eve.list.chunk_set_next_BANG_ = (function cljs_thread$eve$list$chunk_set_next_BANG_(chunk_off,next_off){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_set_i32((0),next_off);
});
/**
 * Write element count to a chunk.
 */
cljs_thread.eve.list.chunk_set_count_BANG_ = (function cljs_thread$eve$list$chunk_set_count_BANG_(chunk_off,cnt){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_set_u16((4),cnt);
});
/**
 * Write type tag for element at idx.
 */
cljs_thread.eve.list.chunk_set_type_BANG_ = (function cljs_thread$eve$list$chunk_set_type_BANG_(chunk_off,capacity,idx,type_tag){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_set_u8(((16) + idx),type_tag);
});
/**
 * Write serialized length for element at idx.
 */
cljs_thread.eve.list.chunk_set_length_BANG_ = (function cljs_thread$eve$list$chunk_set_length_BANG_(chunk_off,capacity,idx,len){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_set_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (idx * (4))),len);
});
/**
 * Read data offset for element at idx.
 */
cljs_thread.eve.list.chunk_get_offset = (function cljs_thread$eve$list$chunk_get_offset(chunk_off,capacity,idx){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_get_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (idx * (4))));
});
/**
 * Write data offset for element at idx.
 */
cljs_thread.eve.list.chunk_set_offset_BANG_ = (function cljs_thread$eve$list$chunk_set_offset_BANG_(chunk_off,capacity,idx,data_off){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(chunk_off);

return cljs_thread.eve.list.r_set_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (idx * (4))),data_off);
});
cljs_thread.eve.list.TYPE_NIL = (0);
cljs_thread.eve.list.TYPE_BOOL = (1);
cljs_thread.eve.list.TYPE_INT32 = (2);
cljs_thread.eve.list.TYPE_FLOAT64 = (3);
cljs_thread.eve.list.TYPE_STRING = (4);
cljs_thread.eve.list.TYPE_KEYWORD = (5);
cljs_thread.eve.list.TYPE_OTHER = (255);
/**
 * Get type tag for a serialized value.
 */
cljs_thread.eve.list.get_type_tag = (function cljs_thread$eve$list$get_type_tag(val_bytes){
if((((val_bytes == null)) || ((val_bytes.length === (0))))){
return (0);
} else {
if((((val_bytes.length >= (3))) && (((((val_bytes[(0)]) === (238))) && (((val_bytes[(1)]) === (219))))))){
var tag = (val_bytes[(2)]);
var G__21087 = tag;
switch (G__21087) {
case (1):
case (2):
return (1);

break;
case (3):
return (2);

break;
case (4):
return (3);

break;
case (5):
case (6):
return (4);

break;
case (7):
case (8):
return (5);

break;
default:
return (255);

}
} else {
return (255);

}
}
});
/**
 * Allocate and write a serialized value. Returns slab-qualified offset.
 */
cljs_thread.eve.list.make_value_block_BANG_ = (function cljs_thread$eve$list$make_value_block_BANG_(val_bytes){
var val_len = val_bytes.length;
var slab_off = cljs_thread.eve.list.alloc_bytes_BANG_(((4) + val_len));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(slab_off);

cljs_thread.eve.list.r_set_u32((0),val_len);

if((val_len > (0))){
cljs_thread.eve.deftype_proto.alloc.resolved_u8.set(val_bytes,(cljs_thread.eve.deftype_proto.alloc.resolved_base + (4)));
} else {
}

return slab_off;
});
/**
 * Read value from a value block slab-qualified offset.
 */
cljs_thread.eve.list.read_value_block = (function cljs_thread$eve$list$read_value_block(val_off){
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(val_off);

var val_len = cljs_thread.eve.list.r_get_u32((0));
var val_bytes = cljs_thread.eve.list.copy_from_sab(val_off,(4),val_len);
return cljs_thread.eve.deftype_proto.serialize.deserialize_element(null,val_bytes);
});
/**
 * Clone a columnar chunk, copying all arrays.
 * Returns slab-qualified offset of the new chunk.
 */
cljs_thread.eve.list.clone_columnar_chunk_BANG_ = (function cljs_thread$eve$list$clone_columnar_chunk_BANG_(src_off,capacity){
var new_off = cljs_thread.eve.list.alloc_columnar_chunk_BANG_(capacity);
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_off);

var src_next_21678 = cljs_thread.eve.list.r_get_i32((0));
var src_cnt_21679 = cljs_thread.eve.list.r_get_u16((4));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_i32((0),src_next_21678);

cljs_thread.eve.list.r_set_u16((4),src_cnt_21679);

var n__5636__auto___21680 = capacity;
var i_21681 = (0);
while(true){
if((i_21681 < n__5636__auto___21680)){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_off);

var type_val_21684 = cljs_thread.eve.list.r_get_u8(((16) + i_21681));
var len_val_21685 = cljs_thread.eve.list.r_get_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_21681 * (4))));
var off_val_21686 = cljs_thread.eve.list.r_get_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_21681 * (4))));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_u8(((16) + i_21681),type_val_21684);

cljs_thread.eve.list.r_set_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_21681 * (4))),len_val_21685);

cljs_thread.eve.list.r_set_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_21681 * (4))),off_val_21686);

var G__21687 = (i_21681 + (1));
i_21681 = G__21687;
continue;
} else {
}
break;
}

return new_off;
});
cljs_thread.eve.list.SABLISTN_HEADER_SIZE = (20);
/**
 * Allocate a header block for SabListN serialization.
 */
cljs_thread.eve.list.make_sab_list_n_header_BANG_ = (function cljs_thread$eve$list$make_sab_list_n_header_BANG_(cnt,head_off,head_idx,chunk_size){
var header_off = cljs_thread.eve.list.alloc_bytes_BANG_((20));
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_(header_off);

cljs_thread.eve.list.r_set_u8((0),(20));

cljs_thread.eve.list.r_set_u8((1),(0));

cljs_thread.eve.list.r_set_u8((2),(0));

cljs_thread.eve.list.r_set_u8((3),(0));

cljs_thread.eve.list.r_set_i32((4),cnt);

cljs_thread.eve.list.r_set_i32((8),head_off);

cljs_thread.eve.list.r_set_i32((12),head_idx);

cljs_thread.eve.list.r_set_i32((16),chunk_size);

return header_off;
});

/**
* @constructor
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeq}
 * @implements {cljs.core.INext}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IStack}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.list.SabListN = (function (cnt,head_off,head_idx,chunk_size,header_off){
this.cnt = cnt;
this.head_off = head_off;
this.head_idx = head_idx;
this.chunk_size = chunk_size;
this.header_off = header_off;
this.cljs$lang$protocol_mask$partition0$ = 2179473631;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs_thread.eve.list.SabListN.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (_,n){
var self__ = this;
var ___$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)].join('')));
} else {
var chunk_off = self__.head_off;
var chunk_idx = self__.head_idx;
var remaining_in_chunk = (cljs_thread.eve.list.chunk_get_count(self__.head_off) - self__.head_idx);
var target = n;
while(true){
if((target < remaining_in_chunk)){
var val_off = cljs_thread.eve.list.chunk_get_offset(chunk_off,self__.chunk_size,(chunk_idx + target));
return cljs_thread.eve.list.read_value_block(val_off);
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__21693 = next_chunk;
var G__21694 = (0);
var G__21695 = cljs_thread.eve.list.chunk_get_count(next_chunk);
var G__21696 = (target - remaining_in_chunk);
chunk_off = G__21693;
chunk_idx = G__21694;
remaining_in_chunk = G__21695;
target = G__21696;
continue;
}
break;
}
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
if((((n < (0))) || ((n >= self__.cnt)))){
return not_found;
} else {
return this$__$1.cljs$core$IIndexed$_nth$arity$2(null, n);
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,opts){
var self__ = this;
var ___$1 = this;
cljs.core._write(writer,["(#sab/list-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.chunk_size)," "].join(''));

var chunk_off_21701 = self__.head_off;
var idx_21702 = self__.head_idx;
var i_21703 = (0);
var remaining_21704 = self__.cnt;
while(true){
if((((remaining_21704 > (0))) && ((i_21703 < (10))))){
if((i_21703 > (0))){
cljs.core._write(writer," ");
} else {
}

var val_off_21705 = cljs_thread.eve.list.chunk_get_offset(chunk_off_21701,self__.chunk_size,idx_21702);
var val_21706 = cljs_thread.eve.list.read_value_block(val_off_21705);
var elems_left_21707 = (self__.chunk_size - idx_21702);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_21706], 0)));

if((elems_left_21707 > (1))){
var G__21708 = chunk_off_21701;
var G__21709 = (idx_21702 + (1));
var G__21710 = (i_21703 + (1));
var G__21711 = (remaining_21704 - (1));
chunk_off_21701 = G__21708;
idx_21702 = G__21709;
i_21703 = G__21710;
remaining_21704 = G__21711;
continue;
} else {
var G__21712 = cljs_thread.eve.list.chunk_get_next(chunk_off_21701);
var G__21713 = (0);
var G__21714 = (i_21703 + (1));
var G__21715 = (remaining_21704 - (1));
chunk_off_21701 = G__21712;
idx_21702 = G__21713;
i_21703 = G__21714;
remaining_21704 = G__21715;
continue;
}
} else {
}
break;
}

if((self__.cnt > (10))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,")");
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$INext$_next$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (1))){
var chunk_cnt = cljs_thread.eve.list.chunk_get_count(self__.head_off);
var elems_in_chunk = (chunk_cnt - self__.head_idx);
if((elems_in_chunk > (1))){
var new_cnt = (self__.cnt - (1));
var new_idx = (self__.head_idx + (1));
var G__21227 = new_cnt;
var G__21228 = self__.head_off;
var G__21229 = new_idx;
var G__21230 = self__.chunk_size;
var G__21231 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21227,G__21228,G__21229,G__21230,G__21231) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21227,G__21228,G__21229,G__21230,G__21231));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(next_chunk,(-1))){
var new_cnt = (self__.cnt - (1));
var G__21239 = new_cnt;
var G__21240 = next_chunk;
var G__21241 = (0);
var G__21242 = self__.chunk_size;
var G__21243 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21239,G__21240,G__21241,G__21242,G__21243) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21239,G__21240,G__21241,G__21242,G__21243));
} else {
return null;
}
}
} else {
return null;
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.cnt;
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IStack$_peek$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var val_off = cljs_thread.eve.list.chunk_get_offset(self__.head_off,self__.chunk_size,self__.head_idx);
return cljs_thread.eve.list.read_value_block(val_off);
} else {
return null;
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IStack$_pop$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
throw (new Error("Can't pop empty list"));
} else {
if((self__.cnt === (1))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var chunk_cnt = cljs_thread.eve.list.chunk_get_count(self__.head_off);
var elems_in_chunk = (chunk_cnt - self__.head_idx);
if((elems_in_chunk > (1))){
var new_cnt = (self__.cnt - (1));
var new_idx = (self__.head_idx + (1));
var G__21284 = new_cnt;
var G__21285 = self__.head_off;
var G__21286 = new_idx;
var G__21287 = self__.chunk_size;
var G__21288 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21284,G__21285,G__21286,G__21287,G__21288) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21284,G__21285,G__21286,G__21287,G__21288));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
var new_cnt = (self__.cnt - (1));
var G__21289 = new_cnt;
var G__21290 = next_chunk;
var G__21291 = (0);
var G__21292 = self__.chunk_size;
var G__21293 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21289,G__21290,G__21291,G__21292,G__21293) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21289,G__21290,G__21291,G__21292,G__21293));
}

}
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return cljs.core.hash_ordered_coll(this$__$1);
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this$,other){
var self__ = this;
var this$__$1 = this;
if((this$__$1 === other)){
return true;
} else {
if((!(cljs.core.sequential_QMARK_(other)))){
return false;
} else {
var chunk_off = self__.head_off;
var idx = self__.head_idx;
var other_seq = cljs.core.seq(other);
var remaining = self__.cnt;
while(true){
if((((remaining === (0))) && ((other_seq == null)))){
return true;
} else {
if((((remaining === (0))) || ((other_seq == null)))){
return false;
} else {
var val_off = cljs_thread.eve.list.chunk_get_offset(chunk_off,self__.chunk_size,idx);
var val = cljs_thread.eve.list.read_value_block(val_off);
var elems_left = (self__.chunk_size - idx);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(val,cljs.core.first(other_seq))){
if((elems_left > (1))){
var G__21738 = chunk_off;
var G__21739 = (idx + (1));
var G__21740 = cljs.core.next(other_seq);
var G__21741 = (remaining - (1));
chunk_off = G__21738;
idx = G__21739;
other_seq = G__21740;
remaining = G__21741;
continue;
} else {
var G__21742 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__21743 = (0);
var G__21744 = cljs.core.next(other_seq);
var G__21745 = (remaining - (1));
chunk_off = G__21742;
idx = G__21743;
other_seq = G__21744;
remaining = G__21745;
continue;
}
} else {
return false;
}

}
}
break;
}

}
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (_,f){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));
} else {
var chunk_off = self__.head_off;
var idx = self__.head_idx;
var acc = null;
var first_QMARK_ = true;
var remaining = self__.cnt;
while(true){
if((remaining === (0))){
return acc;
} else {
var val_off = cljs_thread.eve.list.chunk_get_offset(chunk_off,self__.chunk_size,idx);
var val = cljs_thread.eve.list.read_value_block(val_off);
var elems_left = (self__.chunk_size - idx);
if(first_QMARK_){
if((elems_left > (1))){
var G__21746 = chunk_off;
var G__21747 = (idx + (1));
var G__21748 = val;
var G__21749 = false;
var G__21750 = (remaining - (1));
chunk_off = G__21746;
idx = G__21747;
acc = G__21748;
first_QMARK_ = G__21749;
remaining = G__21750;
continue;
} else {
var G__21751 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__21752 = (0);
var G__21753 = val;
var G__21754 = false;
var G__21755 = (remaining - (1));
chunk_off = G__21751;
idx = G__21752;
acc = G__21753;
first_QMARK_ = G__21754;
remaining = G__21755;
continue;
}
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
if((elems_left > (1))){
var G__21758 = chunk_off;
var G__21759 = (idx + (1));
var G__21760 = acc_SINGLEQUOTE_;
var G__21761 = false;
var G__21762 = (remaining - (1));
chunk_off = G__21758;
idx = G__21759;
acc = G__21760;
first_QMARK_ = G__21761;
remaining = G__21762;
continue;
} else {
var G__21763 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__21764 = (0);
var G__21765 = acc_SINGLEQUOTE_;
var G__21766 = false;
var G__21767 = (remaining - (1));
chunk_off = G__21763;
idx = G__21764;
acc = G__21765;
first_QMARK_ = G__21766;
remaining = G__21767;
continue;
}
}
}
}
break;
}
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (_,f,init){
var self__ = this;
var ___$1 = this;
var chunk_off = self__.head_off;
var idx = self__.head_idx;
var acc = init;
var remaining = self__.cnt;
while(true){
if((((remaining === (0))) || (cljs.core.reduced_QMARK_(acc)))){
if(cljs.core.reduced_QMARK_(acc)){
return cljs.core.deref(acc);
} else {
return acc;
}
} else {
var val_off = cljs_thread.eve.list.chunk_get_offset(chunk_off,self__.chunk_size,idx);
var val = cljs_thread.eve.list.read_value_block(val_off);
var elems_left = (self__.chunk_size - idx);
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if((elems_left > (1))){
var G__21771 = chunk_off;
var G__21772 = (idx + (1));
var G__21773 = acc_SINGLEQUOTE_;
var G__21774 = (remaining - (1));
chunk_off = G__21771;
idx = G__21772;
acc = G__21773;
remaining = G__21774;
continue;
} else {
var G__21775 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__21776 = (0);
var G__21777 = acc_SINGLEQUOTE_;
var G__21778 = (remaining - (1));
chunk_off = G__21775;
idx = G__21776;
acc = G__21777;
remaining = G__21778;
continue;
}
}
break;
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var val_off = cljs_thread.eve.list.chunk_get_offset(self__.head_off,self__.chunk_size,self__.head_idx);
return cljs_thread.eve.list.read_value_block(val_off);
} else {
return null;
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$ISeq$_rest$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt === (0))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var chunk_cnt = cljs_thread.eve.list.chunk_get_count(self__.head_off);
var elems_in_chunk = (chunk_cnt - self__.head_idx);
if((elems_in_chunk > (1))){
var new_cnt = (self__.cnt - (1));
var new_idx = (self__.head_idx + (1));
var G__21407 = new_cnt;
var G__21408 = self__.head_off;
var G__21409 = new_idx;
var G__21410 = self__.chunk_size;
var G__21411 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21407,G__21408,G__21409,G__21410,G__21411) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21407,G__21408,G__21409,G__21410,G__21411));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if((next_chunk === (-1))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var new_cnt = (self__.cnt - (1));
var G__21421 = new_cnt;
var G__21422 = next_chunk;
var G__21423 = (0);
var G__21424 = self__.chunk_size;
var G__21425 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21421,G__21422,G__21423,G__21424,G__21425) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21421,G__21422,G__21423,G__21424,G__21425));
}
}
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if((self__.cnt > (0))){
return this$__$1;
} else {
return null;
}
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$ICollection$_conj$arity$2 = (function (_,val){
var self__ = this;
var ___$1 = this;
var val_bytes = cljs_thread.eve.deftype_proto.serialize.serialize_element(val);
var type_tag = cljs_thread.eve.list.get_type_tag(val_bytes);
var val_off = cljs_thread.eve.list.make_value_block_BANG_(val_bytes);
if((((self__.head_off === (-1))) || ((self__.head_idx === (0))))){
var new_chunk = cljs_thread.eve.list.alloc_columnar_chunk_BANG_(self__.chunk_size);
var new_idx = (self__.chunk_size - (1));
cljs_thread.eve.list.chunk_set_type_BANG_(new_chunk,self__.chunk_size,new_idx,type_tag);

cljs_thread.eve.list.chunk_set_length_BANG_(new_chunk,self__.chunk_size,new_idx,val_bytes.length);

cljs_thread.eve.list.chunk_set_offset_BANG_(new_chunk,self__.chunk_size,new_idx,val_off);

cljs_thread.eve.list.chunk_set_count_BANG_(new_chunk,(1));

cljs_thread.eve.list.chunk_set_next_BANG_(new_chunk,self__.head_off);

var new_cnt = (self__.cnt + (1));
var G__21453 = new_cnt;
var G__21454 = new_chunk;
var G__21455 = new_idx;
var G__21456 = self__.chunk_size;
var G__21457 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21453,G__21454,G__21455,G__21456,G__21457) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21453,G__21454,G__21455,G__21456,G__21457));
} else {
var new_chunk = cljs_thread.eve.list.clone_columnar_chunk_BANG_(self__.head_off,self__.chunk_size);
var new_idx = (self__.head_idx - (1));
cljs_thread.eve.list.chunk_set_type_BANG_(new_chunk,self__.chunk_size,new_idx,type_tag);

cljs_thread.eve.list.chunk_set_length_BANG_(new_chunk,self__.chunk_size,new_idx,val_bytes.length);

cljs_thread.eve.list.chunk_set_offset_BANG_(new_chunk,self__.chunk_size,new_idx,val_off);

cljs_thread.eve.list.chunk_set_count_BANG_(new_chunk,(cljs_thread.eve.list.chunk_get_count(self__.head_off) + (1)));

var new_cnt = (self__.cnt + (1));
var G__21466 = new_cnt;
var G__21467 = new_chunk;
var G__21468 = new_idx;
var G__21469 = self__.chunk_size;
var G__21470 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__21466,G__21467,G__21468,G__21469,G__21470) : cljs_thread.eve.list.__GT_SabListN.call(null, G__21466,G__21467,G__21468,G__21469,G__21470));
}
}));

(cljs_thread.eve.list.SabListN.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__21473 = (arguments.length - (1));
switch (G__21473) {
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

(cljs_thread.eve.list.SabListN.prototype.apply = (function (self__,args21171){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args21171)));
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IFn$_invoke$arity$1 = (function (n){
var self__ = this;
var this$ = this;
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(this$,n);
}));

(cljs_thread.eve.list.SabListN.prototype.cljs$core$IFn$_invoke$arity$2 = (function (n,not_found){
var self__ = this;
var this$ = this;
return cljs.core.nth.cljs$core$IFn$_invoke$arity$3(this$,n,not_found);
}));

(cljs_thread.eve.list.SabListN.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.Symbol(null,"head-off","head-off",-1145359440,null),new cljs.core.Symbol(null,"head-idx","head-idx",515509493,null),new cljs.core.Symbol(null,"chunk-size","chunk-size",1434597153,null),new cljs.core.Symbol(null,"header-off","header-off",633232594,null)], null);
}));

(cljs_thread.eve.list.SabListN.cljs$lang$type = true);

(cljs_thread.eve.list.SabListN.cljs$lang$ctorStr = "cljs-thread.eve.list/SabListN");

(cljs_thread.eve.list.SabListN.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.list/SabListN");
}));

/**
 * Positional factory function for cljs-thread.eve.list/SabListN.
 */
cljs_thread.eve.list.__GT_SabListN = (function cljs_thread$eve$list$__GT_SabListN(cnt,head_off,head_idx,chunk_size,header_off){
return (new cljs_thread.eve.list.SabListN(cnt,head_off,head_idx,chunk_size,header_off));
});

/**
 * Create an empty chunked SabListN with specified chunk size.
 * Valid sizes: 32, 64, 128, 256, 512, 1024
 */
cljs_thread.eve.list.empty_sab_list_n = (function cljs_thread$eve$list$empty_sab_list_n(chunk_size){
return cljs_thread.eve.list.__GT_SabListN((0),(-1),(0),chunk_size,cljs_thread.eve.list.make_sab_list_n_header_BANG_((0),(-1),(0),chunk_size));
});
/**
 * Create a SabListN from a sequence with specified chunk size.
 * Valid sizes: 32, 64, 128, 256, 512, 1024
 */
cljs_thread.eve.list.sab_list_n = (function cljs_thread$eve$list$sab_list_n(chunk_size,coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.list.empty_sab_list_n(chunk_size),cljs.core.reverse(coll));
});
/**
 * Conj all elements onto a chunked list (faster, but reverses order).
 */
cljs_thread.eve.list.into_eve_list_n = (function cljs_thread$eve$list$into_eve_list_n(chunk_size,coll){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj,cljs_thread.eve.list.empty_sab_list_n(chunk_size),coll);
});
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_((19),(function (_sab,slab_offset){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(slab_offset);

var cnt = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + (4)),true);
var head_off = cljs_thread.eve.deftype_proto.alloc.resolved_dv.getInt32((cljs_thread.eve.deftype_proto.alloc.resolved_base + (8)),true);
return (new cljs_thread.eve.list.SabList(cnt,head_off,slab_offset));
}));
cljs_thread.eve.deftype_proto.serialize.register_cljs_to_sab_builder_BANG_(cljs.core.list_QMARK_,(function (l){
return cljs_thread.eve.list.sab_list(l);
}));

//# sourceMappingURL=cljs_thread.eve.list.js.map
