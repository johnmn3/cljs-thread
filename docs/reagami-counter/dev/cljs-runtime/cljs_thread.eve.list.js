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
var seq__24505_25274 = cljs.core.seq(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.list.pool_32,cljs_thread.eve.list.pool_64,cljs_thread.eve.list.pool_128,cljs_thread.eve.list.pool_256,cljs_thread.eve.list.pool_512], null));
var chunk__24508_25275 = null;
var count__24510_25276 = (0);
var i__24512_25277 = (0);
while(true){
if((i__24512_25277 < count__24510_25276)){
var pool_25278 = chunk__24508_25275.cljs$core$IIndexed$_nth$arity$2(null, i__24512_25277);
var n__5636__auto___25281 = pool_25278.length;
var i_25282 = (0);
while(true){
if((i_25282 < n__5636__auto___25281)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25278[i_25282]));

var G__25284 = (i_25282 + (1));
i_25282 = G__25284;
continue;
} else {
}
break;
}


var G__25285 = seq__24505_25274;
var G__25286 = chunk__24508_25275;
var G__25287 = count__24510_25276;
var G__25288 = (i__24512_25277 + (1));
seq__24505_25274 = G__25285;
chunk__24508_25275 = G__25286;
count__24510_25276 = G__25287;
i__24512_25277 = G__25288;
continue;
} else {
var temp__5823__auto___25289 = cljs.core.seq(seq__24505_25274);
if(temp__5823__auto___25289){
var seq__24505_25290__$1 = temp__5823__auto___25289;
if(cljs.core.chunked_seq_QMARK_(seq__24505_25290__$1)){
var c__5568__auto___25295 = cljs.core.chunk_first(seq__24505_25290__$1);
var G__25296 = cljs.core.chunk_rest(seq__24505_25290__$1);
var G__25297 = c__5568__auto___25295;
var G__25298 = cljs.core.count(c__5568__auto___25295);
var G__25299 = (0);
seq__24505_25274 = G__25296;
chunk__24508_25275 = G__25297;
count__24510_25276 = G__25298;
i__24512_25277 = G__25299;
continue;
} else {
var pool_25300 = cljs.core.first(seq__24505_25290__$1);
var n__5636__auto___25304 = pool_25300.length;
var i_25305 = (0);
while(true){
if((i_25305 < n__5636__auto___25304)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25300[i_25305]));

var G__25311 = (i_25305 + (1));
i_25305 = G__25311;
continue;
} else {
}
break;
}


var G__25312 = cljs.core.next(seq__24505_25290__$1);
var G__25313 = null;
var G__25314 = (0);
var G__25315 = (0);
seq__24505_25274 = G__25312;
chunk__24508_25275 = G__25313;
count__24510_25276 = G__25314;
i__24512_25277 = G__25315;
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
var stack = (function (){var G__24529 = size_class;
switch (G__24529) {
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
var stack = (function (){var G__24535 = size_class;
switch (G__24535) {
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
var vec__24607 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24607,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24607,(1),null);
return val;
} else {
var G__25332 = cljs_thread.eve.list.read_node_next(node_off);
var G__25333 = (i + (1));
node_off = G__25332;
i = G__25333;
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

var node_off_25334 = self__.head_off;
var i_25335 = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off_25334,(-1))) && ((i_25335 < (10))))){
if((i_25335 > (0))){
cljs.core._write(writer," ");
} else {
}

var vec__24622_25336 = cljs_thread.eve.list.read_node_value(node_off_25334);
var val_25337 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24622_25336,(0),null);
var __25338__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24622_25336,(1),null);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25337], 0)));

var G__25339 = cljs_thread.eve.list.read_node_next(node_off_25334);
var G__25340 = (i_25335 + (1));
node_off_25334 = G__25339;
i_25335 = G__25340;
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
var G__24625 = (self__.cnt - (1));
var G__24626 = new_head;
var G__24627 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24625,G__24626,G__24627) : cljs_thread.eve.list.__GT_SabList.call(null, G__24625,G__24626,G__24627));
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
var vec__24651 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24651,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24651,(1),null);
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
var G__24665 = (self__.cnt - (1));
var G__24666 = new_head;
var G__24667 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24665,G__24666,G__24667) : cljs_thread.eve.list.__GT_SabList.call(null, G__24665,G__24666,G__24667));

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
var vec__24687 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24687,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24687,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(val,cljs.core.first(other_seq))){
var G__25342 = cljs_thread.eve.list.read_node_next(node_off);
var G__25343 = cljs.core.next(other_seq);
node_off = G__25342;
other_seq = G__25343;
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
var vec__24699 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24699,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24699,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
if(first_QMARK_){
var G__25349 = next_off;
var G__25350 = val;
var G__25351 = false;
node_off = G__25349;
acc = G__25350;
first_QMARK_ = G__25351;
continue;
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__25352 = next_off;
var G__25353 = acc_SINGLEQUOTE_;
var G__25354 = false;
node_off = G__25352;
acc = G__25353;
first_QMARK_ = G__25354;
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
var vec__24712 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24712,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24712,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
var G__25355 = next_off;
var G__25356 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
node_off = G__25355;
acc = G__25356;
continue;
}
break;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var vec__24727 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24727,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24727,(1),null);
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
var G__24735 = new_cnt;
var G__24736 = new_head;
var G__24737 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24735,G__24736,G__24737) : cljs_thread.eve.list.__GT_SabList.call(null, G__24735,G__24736,G__24737));
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
var G__24744 = new_cnt;
var G__24745 = new_off;
var G__24746 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_off);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24744,G__24745,G__24746) : cljs_thread.eve.list.__GT_SabList.call(null, G__24744,G__24745,G__24746));
}));

(cljs_thread.eve.list.SabList.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__24749 = (arguments.length - (1));
switch (G__24749) {
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

(cljs_thread.eve.list.SabList.prototype.apply = (function (self__,args24599){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args24599)));
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

var G__25359 = next_off;
node_off = G__25359;
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
var i_25361 = idx;
while(true){
if((i_25361 < chunk_size)){
var val_off_25363 = (cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3(chunk_off,chunk_size,i_25361) : cljs_thread.eve.list.chunk_get_offset.call(null, chunk_off,chunk_size,i_25361));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(val_off_25363,(-1))){
cljs_thread.eve.list.free_block_BANG_(val_off_25363);
} else {
}

var G__25364 = (i_25361 + (1));
i_25361 = G__25364;
continue;
} else {
}
break;
}

cljs_thread.eve.list.free_block_BANG_(chunk_off);

var G__25365 = next_chunk;
var G__25366 = (0);
chunk_off = G__25365;
idx = G__25366;
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
var G__24818 = arguments.length;
switch (G__24818) {
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

var G__25377 = next_off;
node_off = G__25377;
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

var types_off_25381 = (16);
var lengths_off_25382 = cljs_thread.eve.list.lengths_array_rel_offset(capacity);
var offsets_off_25383 = cljs_thread.eve.list.offsets_array_rel_offset(capacity);
var n__5636__auto___25384 = cljs_thread.eve.list.types_array_size(capacity);
var i_25385 = (0);
while(true){
if((i_25385 < n__5636__auto___25384)){
cljs_thread.eve.list.r_set_u8((types_off_25381 + i_25385),(0));

var G__25386 = (i_25385 + (1));
i_25385 = G__25386;
continue;
} else {
}
break;
}

var n__5636__auto___25387 = capacity;
var i_25388 = (0);
while(true){
if((i_25388 < n__5636__auto___25387)){
cljs_thread.eve.list.r_set_u32((lengths_off_25382 + (i_25388 * (4))),(0));

var G__25389 = (i_25388 + (1));
i_25388 = G__25389;
continue;
} else {
}
break;
}

var n__5636__auto___25390 = capacity;
var i_25391 = (0);
while(true){
if((i_25391 < n__5636__auto___25390)){
cljs_thread.eve.list.r_set_i32((offsets_off_25383 + (i_25391 * (4))),(-1));

var G__25392 = (i_25391 + (1));
i_25391 = G__25392;
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
var G__24874 = tag;
switch (G__24874) {
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

var src_next_25429 = cljs_thread.eve.list.r_get_i32((0));
var src_cnt_25430 = cljs_thread.eve.list.r_get_u16((4));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_i32((0),src_next_25429);

cljs_thread.eve.list.r_set_u16((4),src_cnt_25430);

var n__5636__auto___25434 = capacity;
var i_25435 = (0);
while(true){
if((i_25435 < n__5636__auto___25434)){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_off);

var type_val_25436 = cljs_thread.eve.list.r_get_u8(((16) + i_25435));
var len_val_25437 = cljs_thread.eve.list.r_get_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25435 * (4))));
var off_val_25438 = cljs_thread.eve.list.r_get_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25435 * (4))));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_u8(((16) + i_25435),type_val_25436);

cljs_thread.eve.list.r_set_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25435 * (4))),len_val_25437);

cljs_thread.eve.list.r_set_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25435 * (4))),off_val_25438);

var G__25440 = (i_25435 + (1));
i_25435 = G__25440;
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
var G__25445 = next_chunk;
var G__25446 = (0);
var G__25447 = cljs_thread.eve.list.chunk_get_count(next_chunk);
var G__25448 = (target - remaining_in_chunk);
chunk_off = G__25445;
chunk_idx = G__25446;
remaining_in_chunk = G__25447;
target = G__25448;
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

var chunk_off_25450 = self__.head_off;
var idx_25451 = self__.head_idx;
var i_25452 = (0);
var remaining_25453 = self__.cnt;
while(true){
if((((remaining_25453 > (0))) && ((i_25452 < (10))))){
if((i_25452 > (0))){
cljs.core._write(writer," ");
} else {
}

var val_off_25454 = cljs_thread.eve.list.chunk_get_offset(chunk_off_25450,self__.chunk_size,idx_25451);
var val_25455 = cljs_thread.eve.list.read_value_block(val_off_25454);
var elems_left_25456 = (self__.chunk_size - idx_25451);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25455], 0)));

if((elems_left_25456 > (1))){
var G__25457 = chunk_off_25450;
var G__25458 = (idx_25451 + (1));
var G__25459 = (i_25452 + (1));
var G__25460 = (remaining_25453 - (1));
chunk_off_25450 = G__25457;
idx_25451 = G__25458;
i_25452 = G__25459;
remaining_25453 = G__25460;
continue;
} else {
var G__25461 = cljs_thread.eve.list.chunk_get_next(chunk_off_25450);
var G__25462 = (0);
var G__25463 = (i_25452 + (1));
var G__25464 = (remaining_25453 - (1));
chunk_off_25450 = G__25461;
idx_25451 = G__25462;
i_25452 = G__25463;
remaining_25453 = G__25464;
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
var G__24958 = new_cnt;
var G__24959 = self__.head_off;
var G__24960 = new_idx;
var G__24961 = self__.chunk_size;
var G__24962 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24958,G__24959,G__24960,G__24961,G__24962) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24958,G__24959,G__24960,G__24961,G__24962));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(next_chunk,(-1))){
var new_cnt = (self__.cnt - (1));
var G__24966 = new_cnt;
var G__24967 = next_chunk;
var G__24968 = (0);
var G__24969 = self__.chunk_size;
var G__24970 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24966,G__24967,G__24968,G__24969,G__24970) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24966,G__24967,G__24968,G__24969,G__24970));
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
var G__25006 = new_cnt;
var G__25007 = self__.head_off;
var G__25008 = new_idx;
var G__25009 = self__.chunk_size;
var G__25010 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25006,G__25007,G__25008,G__25009,G__25010) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25006,G__25007,G__25008,G__25009,G__25010));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
var new_cnt = (self__.cnt - (1));
var G__25022 = new_cnt;
var G__25023 = next_chunk;
var G__25024 = (0);
var G__25025 = self__.chunk_size;
var G__25026 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25022,G__25023,G__25024,G__25025,G__25026) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25022,G__25023,G__25024,G__25025,G__25026));
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
var G__25483 = chunk_off;
var G__25484 = (idx + (1));
var G__25485 = cljs.core.next(other_seq);
var G__25486 = (remaining - (1));
chunk_off = G__25483;
idx = G__25484;
other_seq = G__25485;
remaining = G__25486;
continue;
} else {
var G__25487 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25488 = (0);
var G__25489 = cljs.core.next(other_seq);
var G__25490 = (remaining - (1));
chunk_off = G__25487;
idx = G__25488;
other_seq = G__25489;
remaining = G__25490;
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
var G__25493 = chunk_off;
var G__25494 = (idx + (1));
var G__25495 = val;
var G__25496 = false;
var G__25497 = (remaining - (1));
chunk_off = G__25493;
idx = G__25494;
acc = G__25495;
first_QMARK_ = G__25496;
remaining = G__25497;
continue;
} else {
var G__25498 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25499 = (0);
var G__25500 = val;
var G__25501 = false;
var G__25502 = (remaining - (1));
chunk_off = G__25498;
idx = G__25499;
acc = G__25500;
first_QMARK_ = G__25501;
remaining = G__25502;
continue;
}
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
if((elems_left > (1))){
var G__25503 = chunk_off;
var G__25504 = (idx + (1));
var G__25505 = acc_SINGLEQUOTE_;
var G__25506 = false;
var G__25507 = (remaining - (1));
chunk_off = G__25503;
idx = G__25504;
acc = G__25505;
first_QMARK_ = G__25506;
remaining = G__25507;
continue;
} else {
var G__25508 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25509 = (0);
var G__25510 = acc_SINGLEQUOTE_;
var G__25511 = false;
var G__25512 = (remaining - (1));
chunk_off = G__25508;
idx = G__25509;
acc = G__25510;
first_QMARK_ = G__25511;
remaining = G__25512;
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
var G__25516 = chunk_off;
var G__25517 = (idx + (1));
var G__25518 = acc_SINGLEQUOTE_;
var G__25519 = (remaining - (1));
chunk_off = G__25516;
idx = G__25517;
acc = G__25518;
remaining = G__25519;
continue;
} else {
var G__25520 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25521 = (0);
var G__25522 = acc_SINGLEQUOTE_;
var G__25523 = (remaining - (1));
chunk_off = G__25520;
idx = G__25521;
acc = G__25522;
remaining = G__25523;
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
var G__25188 = new_cnt;
var G__25189 = self__.head_off;
var G__25190 = new_idx;
var G__25191 = self__.chunk_size;
var G__25192 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25188,G__25189,G__25190,G__25191,G__25192) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25188,G__25189,G__25190,G__25191,G__25192));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if((next_chunk === (-1))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var new_cnt = (self__.cnt - (1));
var G__25198 = new_cnt;
var G__25199 = next_chunk;
var G__25200 = (0);
var G__25201 = self__.chunk_size;
var G__25202 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25198,G__25199,G__25200,G__25201,G__25202) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25198,G__25199,G__25200,G__25201,G__25202));
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
var G__25220 = new_cnt;
var G__25221 = new_chunk;
var G__25222 = new_idx;
var G__25223 = self__.chunk_size;
var G__25224 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25220,G__25221,G__25222,G__25223,G__25224) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25220,G__25221,G__25222,G__25223,G__25224));
} else {
var new_chunk = cljs_thread.eve.list.clone_columnar_chunk_BANG_(self__.head_off,self__.chunk_size);
var new_idx = (self__.head_idx - (1));
cljs_thread.eve.list.chunk_set_type_BANG_(new_chunk,self__.chunk_size,new_idx,type_tag);

cljs_thread.eve.list.chunk_set_length_BANG_(new_chunk,self__.chunk_size,new_idx,val_bytes.length);

cljs_thread.eve.list.chunk_set_offset_BANG_(new_chunk,self__.chunk_size,new_idx,val_off);

cljs_thread.eve.list.chunk_set_count_BANG_(new_chunk,(cljs_thread.eve.list.chunk_get_count(self__.head_off) + (1)));

var new_cnt = (self__.cnt + (1));
var G__25229 = new_cnt;
var G__25231 = new_chunk;
var G__25232 = new_idx;
var G__25233 = self__.chunk_size;
var G__25234 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25229,G__25231,G__25232,G__25233,G__25234) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25229,G__25231,G__25232,G__25233,G__25234));
}
}));

(cljs_thread.eve.list.SabListN.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__25243 = (arguments.length - (1));
switch (G__25243) {
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
