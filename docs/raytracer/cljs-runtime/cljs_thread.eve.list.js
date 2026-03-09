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
var seq__24439_25289 = cljs.core.seq(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.list.pool_32,cljs_thread.eve.list.pool_64,cljs_thread.eve.list.pool_128,cljs_thread.eve.list.pool_256,cljs_thread.eve.list.pool_512], null));
var chunk__24440_25290 = null;
var count__24441_25291 = (0);
var i__24442_25292 = (0);
while(true){
if((i__24442_25292 < count__24441_25291)){
var pool_25294 = chunk__24440_25290.cljs$core$IIndexed$_nth$arity$2(null, i__24442_25292);
var n__5636__auto___25295 = pool_25294.length;
var i_25296 = (0);
while(true){
if((i_25296 < n__5636__auto___25295)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25294[i_25296]));

var G__25297 = (i_25296 + (1));
i_25296 = G__25297;
continue;
} else {
}
break;
}


var G__25298 = seq__24439_25289;
var G__25299 = chunk__24440_25290;
var G__25300 = count__24441_25291;
var G__25301 = (i__24442_25292 + (1));
seq__24439_25289 = G__25298;
chunk__24440_25290 = G__25299;
count__24441_25291 = G__25300;
i__24442_25292 = G__25301;
continue;
} else {
var temp__5823__auto___25302 = cljs.core.seq(seq__24439_25289);
if(temp__5823__auto___25302){
var seq__24439_25306__$1 = temp__5823__auto___25302;
if(cljs.core.chunked_seq_QMARK_(seq__24439_25306__$1)){
var c__5568__auto___25307 = cljs.core.chunk_first(seq__24439_25306__$1);
var G__25308 = cljs.core.chunk_rest(seq__24439_25306__$1);
var G__25309 = c__5568__auto___25307;
var G__25310 = cljs.core.count(c__5568__auto___25307);
var G__25311 = (0);
seq__24439_25289 = G__25308;
chunk__24440_25290 = G__25309;
count__24441_25291 = G__25310;
i__24442_25292 = G__25311;
continue;
} else {
var pool_25312 = cljs.core.first(seq__24439_25306__$1);
var n__5636__auto___25313 = pool_25312.length;
var i_25314 = (0);
while(true){
if((i_25314 < n__5636__auto___25313)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25312[i_25314]));

var G__25316 = (i_25314 + (1));
i_25314 = G__25316;
continue;
} else {
}
break;
}


var G__25317 = cljs.core.next(seq__24439_25306__$1);
var G__25318 = null;
var G__25319 = (0);
var G__25320 = (0);
seq__24439_25289 = G__25317;
chunk__24440_25290 = G__25318;
count__24441_25291 = G__25319;
i__24442_25292 = G__25320;
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
var stack = (function (){var G__24497 = size_class;
switch (G__24497) {
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
var stack = (function (){var G__24500 = size_class;
switch (G__24500) {
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

var i_25324 = (1);
while(true){
if((i_25324 < len)){
cljs_thread.eve.list.pool_put_BANG_(size_class,(results__$1[i_25324]));

var G__25325 = (i_25324 + (1));
i_25324 = G__25325;
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
var vec__24564 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24564,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24564,(1),null);
return val;
} else {
var G__25331 = cljs_thread.eve.list.read_node_next(node_off);
var G__25332 = (i + (1));
node_off = G__25331;
i = G__25332;
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

var node_off_25335 = self__.head_off;
var i_25336 = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off_25335,(-1))) && ((i_25336 < (10))))){
if((i_25336 > (0))){
cljs.core._write(writer," ");
} else {
}

var vec__24580_25337 = cljs_thread.eve.list.read_node_value(node_off_25335);
var val_25338 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24580_25337,(0),null);
var __25339__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24580_25337,(1),null);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25338], 0)));

var G__25340 = cljs_thread.eve.list.read_node_next(node_off_25335);
var G__25341 = (i_25336 + (1));
node_off_25335 = G__25340;
i_25336 = G__25341;
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
var G__24585 = (self__.cnt - (1));
var G__24586 = new_head;
var G__24587 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24585,G__24586,G__24587) : cljs_thread.eve.list.__GT_SabList.call(null, G__24585,G__24586,G__24587));
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
var vec__24593 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24593,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24593,(1),null);
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
var G__24604 = (self__.cnt - (1));
var G__24605 = new_head;
var G__24606 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24604,G__24605,G__24606) : cljs_thread.eve.list.__GT_SabList.call(null, G__24604,G__24605,G__24606));

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
var vec__24641 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24641,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24641,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(val,cljs.core.first(other_seq))){
var G__25375 = cljs_thread.eve.list.read_node_next(node_off);
var G__25376 = cljs.core.next(other_seq);
node_off = G__25375;
other_seq = G__25376;
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
var vec__24660 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24660,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24660,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
if(first_QMARK_){
var G__25379 = next_off;
var G__25380 = val;
var G__25381 = false;
node_off = G__25379;
acc = G__25380;
first_QMARK_ = G__25381;
continue;
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__25382 = next_off;
var G__25383 = acc_SINGLEQUOTE_;
var G__25384 = false;
node_off = G__25382;
acc = G__25383;
first_QMARK_ = G__25384;
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
var vec__24665 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24665,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24665,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
var G__25388 = next_off;
var G__25389 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
node_off = G__25388;
acc = G__25389;
continue;
}
break;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var vec__24677 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24677,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24677,(1),null);
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
var G__24689 = new_cnt;
var G__24690 = new_head;
var G__24691 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24689,G__24690,G__24691) : cljs_thread.eve.list.__GT_SabList.call(null, G__24689,G__24690,G__24691));
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
var G__24706 = new_cnt;
var G__24707 = new_off;
var G__24708 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_off);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24706,G__24707,G__24708) : cljs_thread.eve.list.__GT_SabList.call(null, G__24706,G__24707,G__24708));
}));

(cljs_thread.eve.list.SabList.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__24710 = (arguments.length - (1));
switch (G__24710) {
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

(cljs_thread.eve.list.SabList.prototype.apply = (function (self__,args24557){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args24557)));
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

var G__25397 = next_off;
node_off = G__25397;
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
var i_25398 = idx;
while(true){
if((i_25398 < chunk_size)){
var val_off_25399 = (cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3(chunk_off,chunk_size,i_25398) : cljs_thread.eve.list.chunk_get_offset.call(null, chunk_off,chunk_size,i_25398));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(val_off_25399,(-1))){
cljs_thread.eve.list.free_block_BANG_(val_off_25399);
} else {
}

var G__25400 = (i_25398 + (1));
i_25398 = G__25400;
continue;
} else {
}
break;
}

cljs_thread.eve.list.free_block_BANG_(chunk_off);

var G__25401 = next_chunk;
var G__25402 = (0);
chunk_off = G__25401;
idx = G__25402;
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
var G__24764 = arguments.length;
switch (G__24764) {
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

var G__25408 = next_off;
node_off = G__25408;
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

var types_off_25425 = (16);
var lengths_off_25426 = cljs_thread.eve.list.lengths_array_rel_offset(capacity);
var offsets_off_25427 = cljs_thread.eve.list.offsets_array_rel_offset(capacity);
var n__5636__auto___25428 = cljs_thread.eve.list.types_array_size(capacity);
var i_25429 = (0);
while(true){
if((i_25429 < n__5636__auto___25428)){
cljs_thread.eve.list.r_set_u8((types_off_25425 + i_25429),(0));

var G__25431 = (i_25429 + (1));
i_25429 = G__25431;
continue;
} else {
}
break;
}

var n__5636__auto___25432 = capacity;
var i_25433 = (0);
while(true){
if((i_25433 < n__5636__auto___25432)){
cljs_thread.eve.list.r_set_u32((lengths_off_25426 + (i_25433 * (4))),(0));

var G__25434 = (i_25433 + (1));
i_25433 = G__25434;
continue;
} else {
}
break;
}

var n__5636__auto___25435 = capacity;
var i_25436 = (0);
while(true){
if((i_25436 < n__5636__auto___25435)){
cljs_thread.eve.list.r_set_i32((offsets_off_25427 + (i_25436 * (4))),(-1));

var G__25437 = (i_25436 + (1));
i_25436 = G__25437;
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
var G__24868 = tag;
switch (G__24868) {
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

var src_next_25442 = cljs_thread.eve.list.r_get_i32((0));
var src_cnt_25443 = cljs_thread.eve.list.r_get_u16((4));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_i32((0),src_next_25442);

cljs_thread.eve.list.r_set_u16((4),src_cnt_25443);

var n__5636__auto___25444 = capacity;
var i_25445 = (0);
while(true){
if((i_25445 < n__5636__auto___25444)){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_off);

var type_val_25446 = cljs_thread.eve.list.r_get_u8(((16) + i_25445));
var len_val_25447 = cljs_thread.eve.list.r_get_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25445 * (4))));
var off_val_25448 = cljs_thread.eve.list.r_get_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25445 * (4))));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_u8(((16) + i_25445),type_val_25446);

cljs_thread.eve.list.r_set_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25445 * (4))),len_val_25447);

cljs_thread.eve.list.r_set_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25445 * (4))),off_val_25448);

var G__25449 = (i_25445 + (1));
i_25445 = G__25449;
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
var G__25450 = next_chunk;
var G__25451 = (0);
var G__25452 = cljs_thread.eve.list.chunk_get_count(next_chunk);
var G__25453 = (target - remaining_in_chunk);
chunk_off = G__25450;
chunk_idx = G__25451;
remaining_in_chunk = G__25452;
target = G__25453;
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

var chunk_off_25454 = self__.head_off;
var idx_25455 = self__.head_idx;
var i_25456 = (0);
var remaining_25457 = self__.cnt;
while(true){
if((((remaining_25457 > (0))) && ((i_25456 < (10))))){
if((i_25456 > (0))){
cljs.core._write(writer," ");
} else {
}

var val_off_25459 = cljs_thread.eve.list.chunk_get_offset(chunk_off_25454,self__.chunk_size,idx_25455);
var val_25460 = cljs_thread.eve.list.read_value_block(val_off_25459);
var elems_left_25461 = (self__.chunk_size - idx_25455);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25460], 0)));

if((elems_left_25461 > (1))){
var G__25464 = chunk_off_25454;
var G__25465 = (idx_25455 + (1));
var G__25466 = (i_25456 + (1));
var G__25467 = (remaining_25457 - (1));
chunk_off_25454 = G__25464;
idx_25455 = G__25465;
i_25456 = G__25466;
remaining_25457 = G__25467;
continue;
} else {
var G__25468 = cljs_thread.eve.list.chunk_get_next(chunk_off_25454);
var G__25469 = (0);
var G__25470 = (i_25456 + (1));
var G__25471 = (remaining_25457 - (1));
chunk_off_25454 = G__25468;
idx_25455 = G__25469;
i_25456 = G__25470;
remaining_25457 = G__25471;
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
var G__24952 = new_cnt;
var G__24953 = self__.head_off;
var G__24954 = new_idx;
var G__24955 = self__.chunk_size;
var G__24956 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24952,G__24953,G__24954,G__24955,G__24956) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24952,G__24953,G__24954,G__24955,G__24956));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(next_chunk,(-1))){
var new_cnt = (self__.cnt - (1));
var G__24960 = new_cnt;
var G__24961 = next_chunk;
var G__24962 = (0);
var G__24963 = self__.chunk_size;
var G__24964 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24960,G__24961,G__24962,G__24963,G__24964) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24960,G__24961,G__24962,G__24963,G__24964));
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
var G__24981 = new_cnt;
var G__24982 = self__.head_off;
var G__24983 = new_idx;
var G__24984 = self__.chunk_size;
var G__24985 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24981,G__24982,G__24983,G__24984,G__24985) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24981,G__24982,G__24983,G__24984,G__24985));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
var new_cnt = (self__.cnt - (1));
var G__24997 = new_cnt;
var G__24998 = next_chunk;
var G__24999 = (0);
var G__25000 = self__.chunk_size;
var G__25001 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24997,G__24998,G__24999,G__25000,G__25001) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24997,G__24998,G__24999,G__25000,G__25001));
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
var G__25476 = chunk_off;
var G__25477 = (idx + (1));
var G__25478 = cljs.core.next(other_seq);
var G__25479 = (remaining - (1));
chunk_off = G__25476;
idx = G__25477;
other_seq = G__25478;
remaining = G__25479;
continue;
} else {
var G__25481 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25482 = (0);
var G__25483 = cljs.core.next(other_seq);
var G__25484 = (remaining - (1));
chunk_off = G__25481;
idx = G__25482;
other_seq = G__25483;
remaining = G__25484;
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
var G__25489 = chunk_off;
var G__25490 = (idx + (1));
var G__25491 = val;
var G__25492 = false;
var G__25493 = (remaining - (1));
chunk_off = G__25489;
idx = G__25490;
acc = G__25491;
first_QMARK_ = G__25492;
remaining = G__25493;
continue;
} else {
var G__25494 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25495 = (0);
var G__25496 = val;
var G__25497 = false;
var G__25498 = (remaining - (1));
chunk_off = G__25494;
idx = G__25495;
acc = G__25496;
first_QMARK_ = G__25497;
remaining = G__25498;
continue;
}
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
if((elems_left > (1))){
var G__25499 = chunk_off;
var G__25500 = (idx + (1));
var G__25501 = acc_SINGLEQUOTE_;
var G__25502 = false;
var G__25503 = (remaining - (1));
chunk_off = G__25499;
idx = G__25500;
acc = G__25501;
first_QMARK_ = G__25502;
remaining = G__25503;
continue;
} else {
var G__25505 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25506 = (0);
var G__25507 = acc_SINGLEQUOTE_;
var G__25508 = false;
var G__25509 = (remaining - (1));
chunk_off = G__25505;
idx = G__25506;
acc = G__25507;
first_QMARK_ = G__25508;
remaining = G__25509;
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
var G__25510 = chunk_off;
var G__25511 = (idx + (1));
var G__25512 = acc_SINGLEQUOTE_;
var G__25513 = (remaining - (1));
chunk_off = G__25510;
idx = G__25511;
acc = G__25512;
remaining = G__25513;
continue;
} else {
var G__25514 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25515 = (0);
var G__25516 = acc_SINGLEQUOTE_;
var G__25517 = (remaining - (1));
chunk_off = G__25514;
idx = G__25515;
acc = G__25516;
remaining = G__25517;
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
var G__25153 = new_cnt;
var G__25154 = self__.head_off;
var G__25155 = new_idx;
var G__25156 = self__.chunk_size;
var G__25157 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25153,G__25154,G__25155,G__25156,G__25157) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25153,G__25154,G__25155,G__25156,G__25157));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if((next_chunk === (-1))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var new_cnt = (self__.cnt - (1));
var G__25204 = new_cnt;
var G__25205 = next_chunk;
var G__25206 = (0);
var G__25207 = self__.chunk_size;
var G__25208 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25204,G__25205,G__25206,G__25207,G__25208) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25204,G__25205,G__25206,G__25207,G__25208));
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
var G__25215 = new_cnt;
var G__25216 = new_chunk;
var G__25217 = new_idx;
var G__25218 = self__.chunk_size;
var G__25219 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25215,G__25216,G__25217,G__25218,G__25219) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25215,G__25216,G__25217,G__25218,G__25219));
} else {
var new_chunk = cljs_thread.eve.list.clone_columnar_chunk_BANG_(self__.head_off,self__.chunk_size);
var new_idx = (self__.head_idx - (1));
cljs_thread.eve.list.chunk_set_type_BANG_(new_chunk,self__.chunk_size,new_idx,type_tag);

cljs_thread.eve.list.chunk_set_length_BANG_(new_chunk,self__.chunk_size,new_idx,val_bytes.length);

cljs_thread.eve.list.chunk_set_offset_BANG_(new_chunk,self__.chunk_size,new_idx,val_off);

cljs_thread.eve.list.chunk_set_count_BANG_(new_chunk,(cljs_thread.eve.list.chunk_get_count(self__.head_off) + (1)));

var new_cnt = (self__.cnt + (1));
var G__25228 = new_cnt;
var G__25229 = new_chunk;
var G__25230 = new_idx;
var G__25231 = self__.chunk_size;
var G__25232 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25228,G__25229,G__25230,G__25231,G__25232) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25228,G__25229,G__25230,G__25231,G__25232));
}
}));

(cljs_thread.eve.list.SabListN.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__25235 = (arguments.length - (1));
switch (G__25235) {
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

(cljs_thread.eve.list.SabListN.prototype.apply = (function (self__,args24925){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args24925)));
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
