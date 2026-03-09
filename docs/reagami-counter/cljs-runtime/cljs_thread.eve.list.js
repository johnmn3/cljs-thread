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
var seq__24010_25156 = cljs.core.seq(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.eve.list.pool_32,cljs_thread.eve.list.pool_64,cljs_thread.eve.list.pool_128,cljs_thread.eve.list.pool_256,cljs_thread.eve.list.pool_512], null));
var chunk__24011_25157 = null;
var count__24012_25158 = (0);
var i__24013_25159 = (0);
while(true){
if((i__24013_25159 < count__24012_25158)){
var pool_25160 = chunk__24011_25157.cljs$core$IIndexed$_nth$arity$2(null, i__24013_25159);
var n__5636__auto___25161 = pool_25160.length;
var i_25162 = (0);
while(true){
if((i_25162 < n__5636__auto___25161)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25160[i_25162]));

var G__25163 = (i_25162 + (1));
i_25162 = G__25163;
continue;
} else {
}
break;
}


var G__25164 = seq__24010_25156;
var G__25165 = chunk__24011_25157;
var G__25166 = count__24012_25158;
var G__25167 = (i__24013_25159 + (1));
seq__24010_25156 = G__25164;
chunk__24011_25157 = G__25165;
count__24012_25158 = G__25166;
i__24013_25159 = G__25167;
continue;
} else {
var temp__5823__auto___25168 = cljs.core.seq(seq__24010_25156);
if(temp__5823__auto___25168){
var seq__24010_25169__$1 = temp__5823__auto___25168;
if(cljs.core.chunked_seq_QMARK_(seq__24010_25169__$1)){
var c__5568__auto___25170 = cljs.core.chunk_first(seq__24010_25169__$1);
var G__25171 = cljs.core.chunk_rest(seq__24010_25169__$1);
var G__25172 = c__5568__auto___25170;
var G__25173 = cljs.core.count(c__5568__auto___25170);
var G__25174 = (0);
seq__24010_25156 = G__25171;
chunk__24011_25157 = G__25172;
count__24012_25158 = G__25173;
i__24013_25159 = G__25174;
continue;
} else {
var pool_25175 = cljs.core.first(seq__24010_25169__$1);
var n__5636__auto___25176 = pool_25175.length;
var i_25177 = (0);
while(true){
if((i_25177 < n__5636__auto___25176)){
cljs_thread.eve.deftype_proto.alloc.free_BANG_((pool_25175[i_25177]));

var G__25178 = (i_25177 + (1));
i_25177 = G__25178;
continue;
} else {
}
break;
}


var G__25179 = cljs.core.next(seq__24010_25169__$1);
var G__25180 = null;
var G__25181 = (0);
var G__25182 = (0);
seq__24010_25156 = G__25179;
chunk__24011_25157 = G__25180;
count__24012_25158 = G__25181;
i__24013_25159 = G__25182;
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
var stack = (function (){var G__24082 = size_class;
switch (G__24082) {
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
var stack = (function (){var G__24090 = size_class;
switch (G__24090) {
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

var i_25206 = (1);
while(true){
if((i_25206 < len)){
cljs_thread.eve.list.pool_put_BANG_(size_class,(results__$1[i_25206]));

var G__25207 = (i_25206 + (1));
i_25206 = G__25207;
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
var vec__24213 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24213,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24213,(1),null);
return val;
} else {
var G__25222 = cljs_thread.eve.list.read_node_next(node_off);
var G__25223 = (i + (1));
node_off = G__25222;
i = G__25223;
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

var node_off_25224 = self__.head_off;
var i_25225 = (0);
while(true){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(node_off_25224,(-1))) && ((i_25225 < (10))))){
if((i_25225 > (0))){
cljs.core._write(writer," ");
} else {
}

var vec__24224_25226 = cljs_thread.eve.list.read_node_value(node_off_25224);
var val_25227 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24224_25226,(0),null);
var __25228__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24224_25226,(1),null);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25227], 0)));

var G__25229 = cljs_thread.eve.list.read_node_next(node_off_25224);
var G__25230 = (i_25225 + (1));
node_off_25224 = G__25229;
i_25225 = G__25230;
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
var G__24232 = (self__.cnt - (1));
var G__24233 = new_head;
var G__24234 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24232,G__24233,G__24234) : cljs_thread.eve.list.__GT_SabList.call(null, G__24232,G__24233,G__24234));
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
var vec__24235 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24235,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24235,(1),null);
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
var G__24243 = (self__.cnt - (1));
var G__24244 = new_head;
var G__24245 = cljs_thread.eve.list.make_sab_list_header_BANG_((self__.cnt - (1)),new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24243,G__24244,G__24245) : cljs_thread.eve.list.__GT_SabList.call(null, G__24243,G__24244,G__24245));

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
var vec__24262 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24262,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24262,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(val,cljs.core.first(other_seq))){
var G__25243 = cljs_thread.eve.list.read_node_next(node_off);
var G__25244 = cljs.core.next(other_seq);
node_off = G__25243;
other_seq = G__25244;
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
var vec__24297 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24297,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24297,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
if(first_QMARK_){
var G__25260 = next_off;
var G__25261 = val;
var G__25262 = false;
node_off = G__25260;
acc = G__25261;
first_QMARK_ = G__25262;
continue;
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
var G__25272 = next_off;
var G__25273 = acc_SINGLEQUOTE_;
var G__25274 = false;
node_off = G__25272;
acc = G__25273;
first_QMARK_ = G__25274;
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
var vec__24303 = cljs_thread.eve.list.read_node_value(node_off);
var val = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24303,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24303,(1),null);
var next_off = cljs_thread.eve.list.read_node_next(node_off);
var G__25285 = next_off;
var G__25286 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
node_off = G__25285;
acc = G__25286;
continue;
}
break;
}
}));

(cljs_thread.eve.list.SabList.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if((self__.cnt > (0))){
var vec__24312 = cljs_thread.eve.list.read_node_value(self__.head_off);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24312,(0),null);
var ___$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__24312,(1),null);
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
var G__24317 = new_cnt;
var G__24318 = new_head;
var G__24319 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_head);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24317,G__24318,G__24319) : cljs_thread.eve.list.__GT_SabList.call(null, G__24317,G__24318,G__24319));
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
var G__24340 = new_cnt;
var G__24341 = new_off;
var G__24342 = cljs_thread.eve.list.make_sab_list_header_BANG_(new_cnt,new_off);
return (cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.__GT_SabList.cljs$core$IFn$_invoke$arity$3(G__24340,G__24341,G__24342) : cljs_thread.eve.list.__GT_SabList.call(null, G__24340,G__24341,G__24342));
}));

(cljs_thread.eve.list.SabList.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__24348 = (arguments.length - (1));
switch (G__24348) {
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

(cljs_thread.eve.list.SabList.prototype.apply = (function (self__,args24201){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args24201)));
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

var G__25333 = next_off;
node_off = G__25333;
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
var i_25336 = idx;
while(true){
if((i_25336 < chunk_size)){
var val_off_25337 = (cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.list.chunk_get_offset.cljs$core$IFn$_invoke$arity$3(chunk_off,chunk_size,i_25336) : cljs_thread.eve.list.chunk_get_offset.call(null, chunk_off,chunk_size,i_25336));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(val_off_25337,(-1))){
cljs_thread.eve.list.free_block_BANG_(val_off_25337);
} else {
}

var G__25338 = (i_25336 + (1));
i_25336 = G__25338;
continue;
} else {
}
break;
}

cljs_thread.eve.list.free_block_BANG_(chunk_off);

var G__25339 = next_chunk;
var G__25340 = (0);
chunk_off = G__25339;
idx = G__25340;
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
var G__24417 = arguments.length;
switch (G__24417) {
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

var G__25346 = next_off;
node_off = G__25346;
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

var types_off_25351 = (16);
var lengths_off_25352 = cljs_thread.eve.list.lengths_array_rel_offset(capacity);
var offsets_off_25353 = cljs_thread.eve.list.offsets_array_rel_offset(capacity);
var n__5636__auto___25355 = cljs_thread.eve.list.types_array_size(capacity);
var i_25356 = (0);
while(true){
if((i_25356 < n__5636__auto___25355)){
cljs_thread.eve.list.r_set_u8((types_off_25351 + i_25356),(0));

var G__25357 = (i_25356 + (1));
i_25356 = G__25357;
continue;
} else {
}
break;
}

var n__5636__auto___25358 = capacity;
var i_25359 = (0);
while(true){
if((i_25359 < n__5636__auto___25358)){
cljs_thread.eve.list.r_set_u32((lengths_off_25352 + (i_25359 * (4))),(0));

var G__25360 = (i_25359 + (1));
i_25359 = G__25360;
continue;
} else {
}
break;
}

var n__5636__auto___25361 = capacity;
var i_25362 = (0);
while(true){
if((i_25362 < n__5636__auto___25361)){
cljs_thread.eve.list.r_set_i32((offsets_off_25353 + (i_25362 * (4))),(-1));

var G__25363 = (i_25362 + (1));
i_25362 = G__25363;
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
var G__24679 = tag;
switch (G__24679) {
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

var src_next_25383 = cljs_thread.eve.list.r_get_i32((0));
var src_cnt_25384 = cljs_thread.eve.list.r_get_u16((4));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_i32((0),src_next_25383);

cljs_thread.eve.list.r_set_u16((4),src_cnt_25384);

var n__5636__auto___25386 = capacity;
var i_25387 = (0);
while(true){
if((i_25387 < n__5636__auto___25386)){
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(src_off);

var type_val_25389 = cljs_thread.eve.list.r_get_u8(((16) + i_25387));
var len_val_25390 = cljs_thread.eve.list.r_get_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25387 * (4))));
var off_val_25391 = cljs_thread.eve.list.r_get_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25387 * (4))));
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_(new_off);

cljs_thread.eve.list.r_set_u8(((16) + i_25387),type_val_25389);

cljs_thread.eve.list.r_set_u32((cljs_thread.eve.list.lengths_array_rel_offset(capacity) + (i_25387 * (4))),len_val_25390);

cljs_thread.eve.list.r_set_i32((cljs_thread.eve.list.offsets_array_rel_offset(capacity) + (i_25387 * (4))),off_val_25391);

var G__25394 = (i_25387 + (1));
i_25387 = G__25394;
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
var G__25399 = next_chunk;
var G__25400 = (0);
var G__25401 = cljs_thread.eve.list.chunk_get_count(next_chunk);
var G__25402 = (target - remaining_in_chunk);
chunk_off = G__25399;
chunk_idx = G__25400;
remaining_in_chunk = G__25401;
target = G__25402;
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

var chunk_off_25405 = self__.head_off;
var idx_25406 = self__.head_idx;
var i_25407 = (0);
var remaining_25408 = self__.cnt;
while(true){
if((((remaining_25408 > (0))) && ((i_25407 < (10))))){
if((i_25407 > (0))){
cljs.core._write(writer," ");
} else {
}

var val_off_25409 = cljs_thread.eve.list.chunk_get_offset(chunk_off_25405,self__.chunk_size,idx_25406);
var val_25410 = cljs_thread.eve.list.read_value_block(val_off_25409);
var elems_left_25411 = (self__.chunk_size - idx_25406);
cljs.core._write(writer,cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([val_25410], 0)));

if((elems_left_25411 > (1))){
var G__25413 = chunk_off_25405;
var G__25414 = (idx_25406 + (1));
var G__25415 = (i_25407 + (1));
var G__25416 = (remaining_25408 - (1));
chunk_off_25405 = G__25413;
idx_25406 = G__25414;
i_25407 = G__25415;
remaining_25408 = G__25416;
continue;
} else {
var G__25417 = cljs_thread.eve.list.chunk_get_next(chunk_off_25405);
var G__25418 = (0);
var G__25419 = (i_25407 + (1));
var G__25420 = (remaining_25408 - (1));
chunk_off_25405 = G__25417;
idx_25406 = G__25418;
i_25407 = G__25419;
remaining_25408 = G__25420;
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
var G__24790 = new_cnt;
var G__24791 = self__.head_off;
var G__24792 = new_idx;
var G__24793 = self__.chunk_size;
var G__24794 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24790,G__24791,G__24792,G__24793,G__24794) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24790,G__24791,G__24792,G__24793,G__24794));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(next_chunk,(-1))){
var new_cnt = (self__.cnt - (1));
var G__24796 = new_cnt;
var G__24797 = next_chunk;
var G__24798 = (0);
var G__24799 = self__.chunk_size;
var G__24800 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24796,G__24797,G__24798,G__24799,G__24800) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24796,G__24797,G__24798,G__24799,G__24800));
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
var G__24808 = new_cnt;
var G__24812 = self__.head_off;
var G__24813 = new_idx;
var G__24814 = self__.chunk_size;
var G__24815 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24808,G__24812,G__24813,G__24814,G__24815) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24808,G__24812,G__24813,G__24814,G__24815));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
var new_cnt = (self__.cnt - (1));
var G__24820 = new_cnt;
var G__24821 = next_chunk;
var G__24822 = (0);
var G__24823 = self__.chunk_size;
var G__24824 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24820,G__24821,G__24822,G__24823,G__24824) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24820,G__24821,G__24822,G__24823,G__24824));
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
var G__25435 = chunk_off;
var G__25436 = (idx + (1));
var G__25437 = cljs.core.next(other_seq);
var G__25438 = (remaining - (1));
chunk_off = G__25435;
idx = G__25436;
other_seq = G__25437;
remaining = G__25438;
continue;
} else {
var G__25441 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25442 = (0);
var G__25443 = cljs.core.next(other_seq);
var G__25444 = (remaining - (1));
chunk_off = G__25441;
idx = G__25442;
other_seq = G__25443;
remaining = G__25444;
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
var G__25448 = chunk_off;
var G__25449 = (idx + (1));
var G__25450 = val;
var G__25451 = false;
var G__25452 = (remaining - (1));
chunk_off = G__25448;
idx = G__25449;
acc = G__25450;
first_QMARK_ = G__25451;
remaining = G__25452;
continue;
} else {
var G__25453 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25454 = (0);
var G__25455 = val;
var G__25456 = false;
var G__25457 = (remaining - (1));
chunk_off = G__25453;
idx = G__25454;
acc = G__25455;
first_QMARK_ = G__25456;
remaining = G__25457;
continue;
}
} else {
var acc_SINGLEQUOTE_ = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(acc,val) : f.call(null, acc,val));
if(cljs.core.reduced_QMARK_(acc_SINGLEQUOTE_)){
return cljs.core.deref(acc_SINGLEQUOTE_);
} else {
if((elems_left > (1))){
var G__25458 = chunk_off;
var G__25459 = (idx + (1));
var G__25460 = acc_SINGLEQUOTE_;
var G__25461 = false;
var G__25462 = (remaining - (1));
chunk_off = G__25458;
idx = G__25459;
acc = G__25460;
first_QMARK_ = G__25461;
remaining = G__25462;
continue;
} else {
var G__25463 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25464 = (0);
var G__25465 = acc_SINGLEQUOTE_;
var G__25466 = false;
var G__25467 = (remaining - (1));
chunk_off = G__25463;
idx = G__25464;
acc = G__25465;
first_QMARK_ = G__25466;
remaining = G__25467;
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
var G__25468 = chunk_off;
var G__25469 = (idx + (1));
var G__25470 = acc_SINGLEQUOTE_;
var G__25471 = (remaining - (1));
chunk_off = G__25468;
idx = G__25469;
acc = G__25470;
remaining = G__25471;
continue;
} else {
var G__25472 = cljs_thread.eve.list.chunk_get_next(chunk_off);
var G__25473 = (0);
var G__25474 = acc_SINGLEQUOTE_;
var G__25475 = (remaining - (1));
chunk_off = G__25472;
idx = G__25473;
acc = G__25474;
remaining = G__25475;
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
var G__24970 = new_cnt;
var G__24971 = self__.head_off;
var G__24972 = new_idx;
var G__24973 = self__.chunk_size;
var G__24974 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,self__.head_off,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24970,G__24971,G__24972,G__24973,G__24974) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24970,G__24971,G__24972,G__24973,G__24974));
} else {
var next_chunk = cljs_thread.eve.list.chunk_get_next(self__.head_off);
if((next_chunk === (-1))){
return (cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.list.empty_sab_list_n.cljs$core$IFn$_invoke$arity$1(self__.chunk_size) : cljs_thread.eve.list.empty_sab_list_n.call(null, self__.chunk_size));
} else {
var new_cnt = (self__.cnt - (1));
var G__24986 = new_cnt;
var G__24987 = next_chunk;
var G__24988 = (0);
var G__24989 = self__.chunk_size;
var G__24990 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,next_chunk,(0),self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__24986,G__24987,G__24988,G__24989,G__24990) : cljs_thread.eve.list.__GT_SabListN.call(null, G__24986,G__24987,G__24988,G__24989,G__24990));
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
var G__25017 = new_cnt;
var G__25018 = new_chunk;
var G__25019 = new_idx;
var G__25020 = self__.chunk_size;
var G__25021 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25017,G__25018,G__25019,G__25020,G__25021) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25017,G__25018,G__25019,G__25020,G__25021));
} else {
var new_chunk = cljs_thread.eve.list.clone_columnar_chunk_BANG_(self__.head_off,self__.chunk_size);
var new_idx = (self__.head_idx - (1));
cljs_thread.eve.list.chunk_set_type_BANG_(new_chunk,self__.chunk_size,new_idx,type_tag);

cljs_thread.eve.list.chunk_set_length_BANG_(new_chunk,self__.chunk_size,new_idx,val_bytes.length);

cljs_thread.eve.list.chunk_set_offset_BANG_(new_chunk,self__.chunk_size,new_idx,val_off);

cljs_thread.eve.list.chunk_set_count_BANG_(new_chunk,(cljs_thread.eve.list.chunk_get_count(self__.head_off) + (1)));

var new_cnt = (self__.cnt + (1));
var G__25024 = new_cnt;
var G__25025 = new_chunk;
var G__25026 = new_idx;
var G__25027 = self__.chunk_size;
var G__25028 = cljs_thread.eve.list.make_sab_list_n_header_BANG_(new_cnt,new_chunk,new_idx,self__.chunk_size);
return (cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.list.__GT_SabListN.cljs$core$IFn$_invoke$arity$5(G__25024,G__25025,G__25026,G__25027,G__25028) : cljs_thread.eve.list.__GT_SabListN.call(null, G__25024,G__25025,G__25026,G__25027,G__25028));
}
}));

(cljs_thread.eve.list.SabListN.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__25034 = (arguments.length - (1));
switch (G__25034) {
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

(cljs_thread.eve.list.SabListN.prototype.apply = (function (self__,args24783){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args24783)));
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
