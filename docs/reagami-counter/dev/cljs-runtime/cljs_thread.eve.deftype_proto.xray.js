goog.provide('cljs_thread.eve.deftype_proto.xray');
/**
 * @define {boolean}
 */
cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS = goog.define("cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS",false);
cljs_thread.eve.deftype_proto.xray.MAX_TRACE_FRAMES = (50);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.trace_frames !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.trace_frames = [];
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.trace_enabled !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.trace_enabled = cljs.core.volatile_BANG_(false);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.trace_count !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.trace_count = cljs.core.volatile_BANG_((0));
}
/**
 * Enable slab xray memory trace. Clears previous frames.
 * No-op when DIAGNOSTICS is false.
 */
cljs_thread.eve.deftype_proto.xray.enable_trace_BANG_ = (function cljs_thread$eve$deftype_proto$xray$enable_trace_BANG_(){
if(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS){
cljs.core.vreset_BANG_(cljs_thread.eve.deftype_proto.xray.trace_enabled,true);

cljs.core.vreset_BANG_(cljs_thread.eve.deftype_proto.xray.trace_count,(0));

(cljs_thread.eve.deftype_proto.xray.trace_frames.length = (0));

return console.log("[SLAB X-RAY] Memory trace ENABLED");
} else {
return null;
}
});
/**
 * Disable slab xray memory trace.
 */
cljs_thread.eve.deftype_proto.xray.disable_trace_BANG_ = (function cljs_thread$eve$deftype_proto$xray$disable_trace_BANG_(){
cljs.core.vreset_BANG_(cljs_thread.eve.deftype_proto.xray.trace_enabled,false);

return console.log("[SLAB X-RAY] Memory trace DISABLED");
});
/**
 * Returns true if slab xray tracing is active.
 */
cljs_thread.eve.deftype_proto.xray.trace_enabled_QMARK_ = (function cljs_thread$eve$deftype_proto$xray$trace_enabled_QMARK_(){
return cljs.core.deref(cljs_thread.eve.deftype_proto.xray.trace_enabled);
});
/**
 * Count set bits in a 32-bit integer (Kernighan's trick).
 */
cljs_thread.eve.deftype_proto.xray.popcount_word = (function cljs_thread$eve$deftype_proto$xray$popcount_word(w){
var v = w;
var c = (0);
while(true){
if((v === (0))){
return c;
} else {
var G__20198 = (v & (v - (1)));
var G__20199 = (c + (1));
v = G__20198;
c = G__20199;
continue;
}
break;
}
});
/**
 * Count allocated blocks by counting set bits in the bitmap.
 * Returns [allocated free] pair.
 */
cljs_thread.eve.deftype_proto.xray.bitmap_count_allocated = (function cljs_thread$eve$deftype_proto$xray$bitmap_count_allocated(i32_view,bm_int32_offset,total_blocks){
var word_count = ((total_blocks + (31)) >>> (5));
var last_word_bits = (function (){var r = (total_blocks & (31));
if((r === (0))){
return (32);
} else {
return r;
}
})();
var i = (0);
var allocated = (0);
while(true){
if((i >= word_count)){
return [allocated,(total_blocks - allocated)];
} else {
var word = Atomics.load(i32_view,(bm_int32_offset + i));
var pc = cljs_thread.eve.deftype_proto.xray.popcount_word(word);
var G__20200 = (i + (1));
var G__20201 = (allocated + pc);
i = G__20200;
allocated = G__20201;
continue;
}
break;
}
});
/**
 * Check if any bitmap bits are set beyond total_blocks (should all be 0).
 * Returns count of invalid set bits.
 */
cljs_thread.eve.deftype_proto.xray.bitmap_bits_beyond_total = (function cljs_thread$eve$deftype_proto$xray$bitmap_bits_beyond_total(i32_view,bm_int32_offset,total_blocks){
var last_word_idx = (total_blocks >>> (5));
var remainder = (total_blocks & (31));
var word_count = ((total_blocks + (31)) >>> (5));
if((remainder === (0))){
return (0);
} else {
var word = Atomics.load(i32_view,(bm_int32_offset + last_word_idx));
var overflow_mask = ((-1) << remainder);
var overflow_bits = (word & overflow_mask);
return cljs_thread.eve.deftype_proto.xray.popcount_word(overflow_bits);
}
});
/**
 * Render a slab bitmap as an ASCII bar of `width` chars.
 * A=allocated F=free .=partially mixed
 */
cljs_thread.eve.deftype_proto.xray.render_bitmap_bar = (function cljs_thread$eve$deftype_proto$xray$render_bitmap_bar(i32_view,bm_int32_offset,total_blocks,width){
var blocks_per_col = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = Math.ceil((total_blocks / width));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var bar = (new Array(width));
var n__5636__auto___20202 = width;
var c_20203 = (0);
while(true){
if((c_20203 < n__5636__auto___20202)){
var start_block_20204 = (c_20203 * blocks_per_col);
var end_block_20205 = (function (){var x__5133__auto__ = total_blocks;
var y__5134__auto__ = ((c_20203 + (1)) * blocks_per_col);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var span_20206 = (end_block_20205 - start_block_20204);
if((span_20206 === (0))){
(bar[c_20203] = " ");
} else {
var alloc_count_20207 = (function (){var b = start_block_20204;
var acc = (0);
while(true){
if((b >= end_block_20205)){
return acc;
} else {
var word_idx = (b >>> (5));
var bit_pos = (b & (31));
var word = Atomics.load(i32_view,(bm_int32_offset + word_idx));
var set_QMARK_ = (!(((word & ((1) << bit_pos)) === (0))));
var G__20209 = (b + (1));
var G__20210 = ((set_QMARK_)?(acc + (1)):acc);
b = G__20209;
acc = G__20210;
continue;
}
break;
}
})();
var ratio_20208 = (alloc_count_20207 / span_20206);
(bar[c_20203] = (((alloc_count_20207 === span_20206))?"A":(((alloc_count_20207 === (0)))?"F":(((ratio_20208 > 0.75))?"a":(((ratio_20208 < 0.25))?"f":"."
)))));
}

var G__20211 = (c_20203 + (1));
c_20203 = G__20211;
continue;
} else {
}
break;
}

return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.seq(bar));
});
/**
 * Scan a single slab class and check invariants 1-9.
 * Returns {:valid? bool :errors [...] :stats {...} :bitmap-bar str}.
 */
cljs_thread.eve.deftype_proto.xray.scan_slab_class = (function cljs_thread$eve$deftype_proto$xray$scan_slab_class(class_idx,bar_width){
var inst = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx);
var errors = [];
if(cljs.core.not(inst)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"class","class",-2030961996),class_idx,new cljs.core.Keyword(null,"invariant","invariant",-1658446508),(0),new cljs.core.Keyword(null,"msg","msg",-1386103444),"Slab instance not initialized"], null)], null),new cljs.core.Keyword(null,"stats","stats",-85643011),null,new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210),null], null);
} else {
var i32_view = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst);
var u8_view = new cljs.core.Keyword(null,"u8","u8",1415967369).cljs$core$IFn$_invoke$arity$1(inst);
var buf_size = i32_view.buffer.byteLength;
var magic = Atomics.load(i32_view,((0) / (4)));
var block_size = Atomics.load(i32_view,((4) / (4)));
var total_blocks = Atomics.load(i32_view,((8) / (4)));
var free_count = Atomics.load(i32_view,((12) / (4)));
var alloc_cursor = Atomics.load(i32_view,((16) / (4)));
var hdr_class_idx = Atomics.load(i32_view,((20) / (4)));
var bitmap_offset = Atomics.load(i32_view,((24) / (4)));
var data_offset = Atomics.load(i32_view,((28) / (4)));
var expected_block_size = (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
var expected_bitmap_size = cljs_thread.eve.deftype_proto.data.bitmap_byte_size(total_blocks);
var bm_int32_offset = (bitmap_offset >>> (2));
var counts = cljs_thread.eve.deftype_proto.xray.bitmap_count_allocated(i32_view,bm_int32_offset,total_blocks);
var actual_allocated = (counts[(0)]);
var actual_free = (counts[(1)]);
var overflow_bits = cljs_thread.eve.deftype_proto.xray.bitmap_bits_beyond_total(i32_view,bm_int32_offset,total_blocks);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(magic,(1397506370))){
errors.push([class_idx,(1),["Magic mismatch: got 0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(magic.toString((16)))," expected 0x534C4142"].join('')]);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(block_size,expected_block_size)){
errors.push([class_idx,(2),["Block size: header=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_size)," expected=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(expected_block_size)].join('')]);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(hdr_class_idx,class_idx)){
errors.push([class_idx,(3),["Class idx: header=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hdr_class_idx)," expected=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx)].join('')]);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(free_count,actual_free)){
errors.push([class_idx,(4),["Free count mismatch: header=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(free_count)," bitmap=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(actual_free)," (diff=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((free_count - actual_free)),")"].join('')]);
} else {
}

if((((alloc_cursor < (0))) || ((alloc_cursor > total_blocks)))){
errors.push([class_idx,(5),["Cursor out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alloc_cursor)," total_blocks=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_blocks)].join('')]);
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(bitmap_offset,(64))){
errors.push([class_idx,(6),["Bitmap offset: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_offset)," expected ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((64))].join('')]);
} else {
}

var expected_data_offset_20212 = (bitmap_offset + expected_bitmap_size);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(data_offset,expected_data_offset_20212)){
errors.push([class_idx,(7),["Data offset: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_offset)," expected ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(expected_data_offset_20212)].join('')]);
} else {
}

var min_size_20213 = (data_offset + (total_blocks * block_size));
if((buf_size < min_size_20213)){
errors.push([class_idx,(8),["SAB too small: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(buf_size)," need ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(min_size_20213)].join('')]);
} else {
}

if((overflow_bits > (0))){
errors.push([class_idx,(9),[cljs.core.str.cljs$core$IFn$_invoke$arity$1(overflow_bits)," bits set beyond total_blocks=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_blocks)].join('')]);
} else {
}

var bitmap_bar = cljs_thread.eve.deftype_proto.xray.render_bitmap_bar(i32_view,bm_int32_offset,total_blocks,bar_width);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),(errors.length === (0)),new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (e){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"class","class",-2030961996),(e[(0)]),new cljs.core.Keyword(null,"invariant","invariant",-1658446508),(e[(1)]),new cljs.core.Keyword(null,"msg","msg",-1386103444),(e[(2)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(errors))),new cljs.core.Keyword(null,"stats","stats",-85643011),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"block-size","block-size",-1062272384),new cljs.core.Keyword(null,"data-offset","data-offset",-712338495),new cljs.core.Keyword(null,"sab-size","sab-size",-1390153878),new cljs.core.Keyword(null,"alloc-cursor","alloc-cursor",387943531),new cljs.core.Keyword(null,"class-idx","class-idx",145738667),new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763),new cljs.core.Keyword(null,"header-free-count","header-free-count",1771971162),new cljs.core.Keyword(null,"bitmap-free","bitmap-free",1369917211),new cljs.core.Keyword(null,"bitmap-allocated","bitmap-allocated",1875511612)],[block_size,data_offset,buf_size,alloc_cursor,class_idx,total_blocks,free_count,actual_free,actual_allocated]),new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210),bitmap_bar], null);
}
});
/**
 * Scan the root SAB for invariants 10-14.
 * Returns {:valid? bool :errors [...] :stats {...}}.
 */
cljs_thread.eve.deftype_proto.xray.scan_root_sab = (function cljs_thread$eve$deftype_proto$xray$scan_root_sab(){
var i32 = cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32);
var errors = [];
if(cljs.core.not(i32)){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),false,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"invariant","invariant",-1658446508),(10),new cljs.core.Keyword(null,"msg","msg",-1386103444),"Root SAB not initialized"], null)], null),new cljs.core.Keyword(null,"stats","stats",-85643011),null], null);
} else {
var magic = Atomics.load(i32,((0) / (4)));
var root_ptr = Atomics.load(i32,((4) / (4)));
var epoch = Atomics.load(i32,((8) / (4)));
var _ = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(magic,(1380929364)))?errors.push([(10),["Root magic: 0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(magic.toString((16)))," expected 0x524F4F54"].join('')]):null);
var ___$1 = ((((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1)))))?(function (){var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr);
if((((class_idx > (6))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(class_idx,(7))))){
return errors.push([(11),["Root ptr class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx)," invalid class"].join('')]);
} else {
return null;
}
})():null);
var ___$2 = (((epoch < (1)))?errors.push([(12),["Epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch)," (should be >= 1)"].join('')]):null);
var worker_info = [];
var n__5636__auto___20214 = (256);
var slot_idx_20215 = (0);
while(true){
if((slot_idx_20215 < n__5636__auto___20214)){
var slot_byte_offset_20216 = (cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx_20215 * (24)));
var w_status_20217 = Atomics.load(i32,(slot_byte_offset_20216 / (4)));
var w_epoch_20218 = Atomics.load(i32,((slot_byte_offset_20216 + (4)) / (4)));
var w_id_20219 = Atomics.load(i32,((slot_byte_offset_20216 + (16)) / (4)));
if((w_status_20217 === (1))){
worker_info.push([slot_idx_20215,w_id_20219,w_epoch_20218]);

if((((w_epoch_20218 > (0))) && ((w_epoch_20218 > epoch)))){
errors.push([(13),["Worker slot ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slot_idx_20215)," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(w_epoch_20218)," > global=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch)].join('')]);
} else {
}
} else {
}

var G__20220 = (slot_idx_20215 + (1));
slot_idx_20215 = G__20220;
continue;
} else {
}
break;
}

if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))))){
var class_idx_20221 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr);
var block_idx_20222 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr);
if((class_idx_20221 < (6))){
var inst_20223 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx_20221);
if(cljs.core.truth_(inst_20223)){
var bm_offset_20224 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20223),((24) / (4)));
var bm_int32_offset_20225 = (bm_offset_20224 >>> (2));
var word_idx_20226 = (block_idx_20222 >>> (5));
var bit_pos_20227 = (block_idx_20222 & (31));
var word_20228 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20223),(bm_int32_offset_20225 + word_idx_20226));
var allocated_QMARK__20229 = (!(((word_20228 & ((1) << bit_pos_20227)) === (0))));
if(allocated_QMARK__20229){
} else {
errors.push([(14),["Root ptr class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20221)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20222)," NOT allocated in bitmap"].join('')]);
}
} else {
}
} else {
}
} else {
}

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),(errors.length === (0)),new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (e){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"invariant","invariant",-1658446508),(e[(0)]),new cljs.core.Keyword(null,"msg","msg",-1386103444),(e[(1)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(errors))),new cljs.core.Keyword(null,"stats","stats",-85643011),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"root-ptr","root-ptr",1411033947),root_ptr,new cljs.core.Keyword(null,"epoch","epoch",1435633666),epoch,new cljs.core.Keyword(null,"active-workers","active-workers",1822846782),worker_info.length,new cljs.core.Keyword(null,"workers","workers",-2054878819),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (w){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"slot","slot",240229571),(w[(0)]),new cljs.core.Keyword(null,"id","id",-1388402092),(w[(1)]),new cljs.core.Keyword(null,"epoch","epoch",1435633666),(w[(2)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(worker_info)))], null)], null);
}
});
/**
 * Full scan of all slab classes + root SAB.
 * Returns {:valid? bool :slab-results [...] :root-result {...}
 *          :frame-lines [...] :all-errors [...]}.
 * Returns {:valid? true} immediately when DIAGNOSTICS is false.
 */
cljs_thread.eve.deftype_proto.xray.slab_xray_scan = (function cljs_thread$eve$deftype_proto$xray$slab_xray_scan(label){
if((!(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),true,new cljs.core.Keyword(null,"slab-results","slab-results",1320835640),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"root-result","root-result",1506648562),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),true], null),new cljs.core.Keyword(null,"all-errors","all-errors",973705773),cljs.core.PersistentVector.EMPTY], null);
} else {
var bar_width = (40);
var slab_results = [];
var all_errors = [];
var frame_lines = [];
var pr_BANG_ = (function (s){
return frame_lines.push(s);
});
var n = cljs_thread.eve.deftype_proto.xray.trace_count.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (cljs_thread.eve.deftype_proto.xray.trace_count.cljs$core$IDeref$_deref$arity$1(null, ) + (1)));
pr_BANG_(["\n[SLAB X-RAY #",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = label;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "?";
}
})())].join(''));

pr_BANG_("  \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");

var n__5636__auto___20230 = (6);
var ci_20231 = (0);
while(true){
if((ci_20231 < n__5636__auto___20230)){
var result_20232 = cljs_thread.eve.deftype_proto.xray.scan_slab_class(ci_20231,bar_width);
slab_results.push(result_20232);

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_20232))){
} else {
var seq__20009_20233 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_20232));
var chunk__20010_20234 = null;
var count__20011_20235 = (0);
var i__20012_20236 = (0);
while(true){
if((i__20012_20236 < count__20011_20235)){
var e_20237 = chunk__20010_20234.cljs$core$IIndexed$_nth$arity$2(null, i__20012_20236);
all_errors.push(e_20237);


var G__20238 = seq__20009_20233;
var G__20239 = chunk__20010_20234;
var G__20240 = count__20011_20235;
var G__20241 = (i__20012_20236 + (1));
seq__20009_20233 = G__20238;
chunk__20010_20234 = G__20239;
count__20011_20235 = G__20240;
i__20012_20236 = G__20241;
continue;
} else {
var temp__5823__auto___20242 = cljs.core.seq(seq__20009_20233);
if(temp__5823__auto___20242){
var seq__20009_20243__$1 = temp__5823__auto___20242;
if(cljs.core.chunked_seq_QMARK_(seq__20009_20243__$1)){
var c__5568__auto___20244 = cljs.core.chunk_first(seq__20009_20243__$1);
var G__20245 = cljs.core.chunk_rest(seq__20009_20243__$1);
var G__20246 = c__5568__auto___20244;
var G__20247 = cljs.core.count(c__5568__auto___20244);
var G__20248 = (0);
seq__20009_20233 = G__20245;
chunk__20010_20234 = G__20246;
count__20011_20235 = G__20247;
i__20012_20236 = G__20248;
continue;
} else {
var e_20249 = cljs.core.first(seq__20009_20243__$1);
all_errors.push(e_20249);


var G__20250 = cljs.core.next(seq__20009_20243__$1);
var G__20251 = null;
var G__20252 = (0);
var G__20253 = (0);
seq__20009_20233 = G__20250;
chunk__20010_20234 = G__20251;
count__20011_20235 = G__20252;
i__20012_20236 = G__20253;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___20254 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(result_20232);
if(cljs.core.truth_(temp__5823__auto___20254)){
var stats_20255 = temp__5823__auto___20254;
var map__20013_20256 = stats_20255;
var map__20013_20257__$1 = cljs.core.__destructure_map(map__20013_20256);
var block_size_20258 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"block-size","block-size",-1062272384));
var total_blocks_20259 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763));
var bitmap_allocated_20260 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"bitmap-allocated","bitmap-allocated",1875511612));
var bitmap_free_20261 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"bitmap-free","bitmap-free",1369917211));
var header_free_count_20262 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"header-free-count","header-free-count",1771971162));
var alloc_cursor_20263 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20013_20257__$1,new cljs.core.Keyword(null,"alloc-cursor","alloc-cursor",387943531));
var pct_20264 = (((total_blocks_20259 > (0)))?Math.round(((100) * (bitmap_allocated_20260 / total_blocks_20259))):(0));
pr_BANG_(["  SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_20231)," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_size_20258),"B)"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_blocks_20259)," blk"," | alloc=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_allocated_20260)," free=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_free_20261)," (hdr=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_free_count_20262),")"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pct_20264),"% | cur=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alloc_cursor_20263)].join(''));

if(cljs.core.truth_(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_20232))){
pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_20232)),"|"].join(''));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_20232))){
} else {
pr_BANG_(["  !! SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_20231)," ERRORS:"].join(''));
}

var seq__20014_20265 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_20232));
var chunk__20015_20266 = null;
var count__20016_20267 = (0);
var i__20017_20268 = (0);
while(true){
if((i__20017_20268 < count__20016_20267)){
var e_20271 = chunk__20015_20266.cljs$core$IIndexed$_nth$arity$2(null, i__20017_20268);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20271)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20271))].join(''));


var G__20274 = seq__20014_20265;
var G__20275 = chunk__20015_20266;
var G__20276 = count__20016_20267;
var G__20277 = (i__20017_20268 + (1));
seq__20014_20265 = G__20274;
chunk__20015_20266 = G__20275;
count__20016_20267 = G__20276;
i__20017_20268 = G__20277;
continue;
} else {
var temp__5823__auto___20279__$1 = cljs.core.seq(seq__20014_20265);
if(temp__5823__auto___20279__$1){
var seq__20014_20280__$1 = temp__5823__auto___20279__$1;
if(cljs.core.chunked_seq_QMARK_(seq__20014_20280__$1)){
var c__5568__auto___20282 = cljs.core.chunk_first(seq__20014_20280__$1);
var G__20283 = cljs.core.chunk_rest(seq__20014_20280__$1);
var G__20284 = c__5568__auto___20282;
var G__20285 = cljs.core.count(c__5568__auto___20282);
var G__20286 = (0);
seq__20014_20265 = G__20283;
chunk__20015_20266 = G__20284;
count__20016_20267 = G__20285;
i__20017_20268 = G__20286;
continue;
} else {
var e_20287 = cljs.core.first(seq__20014_20280__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20287)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20287))].join(''));


var G__20288 = cljs.core.next(seq__20014_20280__$1);
var G__20289 = null;
var G__20290 = (0);
var G__20291 = (0);
seq__20014_20265 = G__20288;
chunk__20015_20266 = G__20289;
count__20016_20267 = G__20290;
i__20017_20268 = G__20291;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__20292 = (ci_20231 + (1));
ci_20231 = G__20292;
continue;
} else {
}
break;
}

var root_result = cljs_thread.eve.deftype_proto.xray.scan_root_sab();
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(root_result))){
} else {
var seq__20024_20293 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__20025_20294 = null;
var count__20026_20295 = (0);
var i__20027_20296 = (0);
while(true){
if((i__20027_20296 < count__20026_20295)){
var e_20297 = chunk__20025_20294.cljs$core$IIndexed$_nth$arity$2(null, i__20027_20296);
all_errors.push(e_20297);


var G__20298 = seq__20024_20293;
var G__20299 = chunk__20025_20294;
var G__20300 = count__20026_20295;
var G__20301 = (i__20027_20296 + (1));
seq__20024_20293 = G__20298;
chunk__20025_20294 = G__20299;
count__20026_20295 = G__20300;
i__20027_20296 = G__20301;
continue;
} else {
var temp__5823__auto___20302 = cljs.core.seq(seq__20024_20293);
if(temp__5823__auto___20302){
var seq__20024_20303__$1 = temp__5823__auto___20302;
if(cljs.core.chunked_seq_QMARK_(seq__20024_20303__$1)){
var c__5568__auto___20304 = cljs.core.chunk_first(seq__20024_20303__$1);
var G__20305 = cljs.core.chunk_rest(seq__20024_20303__$1);
var G__20306 = c__5568__auto___20304;
var G__20307 = cljs.core.count(c__5568__auto___20304);
var G__20308 = (0);
seq__20024_20293 = G__20305;
chunk__20025_20294 = G__20306;
count__20026_20295 = G__20307;
i__20027_20296 = G__20308;
continue;
} else {
var e_20309 = cljs.core.first(seq__20024_20303__$1);
all_errors.push(e_20309);


var G__20312 = cljs.core.next(seq__20024_20303__$1);
var G__20313 = null;
var G__20314 = (0);
var G__20315 = (0);
seq__20024_20293 = G__20312;
chunk__20025_20294 = G__20313;
count__20026_20295 = G__20314;
i__20027_20296 = G__20315;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___20316 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(root_result);
if(cljs.core.truth_(temp__5823__auto___20316)){
var stats_20318 = temp__5823__auto___20316;
var map__20040_20319 = stats_20318;
var map__20040_20320__$1 = cljs.core.__destructure_map(map__20040_20319);
var root_ptr_20321 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20040_20320__$1,new cljs.core.Keyword(null,"root-ptr","root-ptr",1411033947));
var epoch_20322 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20040_20320__$1,new cljs.core.Keyword(null,"epoch","epoch",1435633666));
var active_workers_20323 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20040_20320__$1,new cljs.core.Keyword(null,"active-workers","active-workers",1822846782));
var workers_20324 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20040_20320__$1,new cljs.core.Keyword(null,"workers","workers",-2054878819));
pr_BANG_(["  ROOT: ptr=",(((((root_ptr_20321 === (-1))) || ((root_ptr_20321 === (-1)))))?"NIL":["class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr_20321))," blk=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr_20321))].join(''))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_20322)," workers=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(active_workers_20323)].join(''));

var seq__20047_20328 = cljs.core.seq(workers_20324);
var chunk__20048_20329 = null;
var count__20049_20330 = (0);
var i__20050_20331 = (0);
while(true){
if((i__20050_20331 < count__20049_20330)){
var w_20332 = chunk__20048_20329.cljs$core$IIndexed$_nth$arity$2(null, i__20050_20331);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_20332)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_20332))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_20332))].join(''));


var G__20334 = seq__20047_20328;
var G__20335 = chunk__20048_20329;
var G__20336 = count__20049_20330;
var G__20337 = (i__20050_20331 + (1));
seq__20047_20328 = G__20334;
chunk__20048_20329 = G__20335;
count__20049_20330 = G__20336;
i__20050_20331 = G__20337;
continue;
} else {
var temp__5823__auto___20340__$1 = cljs.core.seq(seq__20047_20328);
if(temp__5823__auto___20340__$1){
var seq__20047_20342__$1 = temp__5823__auto___20340__$1;
if(cljs.core.chunked_seq_QMARK_(seq__20047_20342__$1)){
var c__5568__auto___20343 = cljs.core.chunk_first(seq__20047_20342__$1);
var G__20344 = cljs.core.chunk_rest(seq__20047_20342__$1);
var G__20345 = c__5568__auto___20343;
var G__20346 = cljs.core.count(c__5568__auto___20343);
var G__20347 = (0);
seq__20047_20328 = G__20344;
chunk__20048_20329 = G__20345;
count__20049_20330 = G__20346;
i__20050_20331 = G__20347;
continue;
} else {
var w_20348 = cljs.core.first(seq__20047_20342__$1);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_20348)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_20348))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_20348))].join(''));


var G__20349 = cljs.core.next(seq__20047_20342__$1);
var G__20350 = null;
var G__20351 = (0);
var G__20352 = (0);
seq__20047_20328 = G__20349;
chunk__20048_20329 = G__20350;
count__20049_20330 = G__20351;
i__20050_20331 = G__20352;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(root_result))){
} else {
pr_BANG_("  !! ROOT ERRORS:");

var seq__20070_20354 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__20071_20355 = null;
var count__20072_20356 = (0);
var i__20073_20357 = (0);
while(true){
if((i__20073_20357 < count__20072_20356)){
var e_20358 = chunk__20071_20355.cljs$core$IIndexed$_nth$arity$2(null, i__20073_20357);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20358)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20358))].join(''));


var G__20359 = seq__20070_20354;
var G__20360 = chunk__20071_20355;
var G__20361 = count__20072_20356;
var G__20362 = (i__20073_20357 + (1));
seq__20070_20354 = G__20359;
chunk__20071_20355 = G__20360;
count__20072_20356 = G__20361;
i__20073_20357 = G__20362;
continue;
} else {
var temp__5823__auto___20364 = cljs.core.seq(seq__20070_20354);
if(temp__5823__auto___20364){
var seq__20070_20365__$1 = temp__5823__auto___20364;
if(cljs.core.chunked_seq_QMARK_(seq__20070_20365__$1)){
var c__5568__auto___20366 = cljs.core.chunk_first(seq__20070_20365__$1);
var G__20367 = cljs.core.chunk_rest(seq__20070_20365__$1);
var G__20368 = c__5568__auto___20366;
var G__20369 = cljs.core.count(c__5568__auto___20366);
var G__20370 = (0);
seq__20070_20354 = G__20367;
chunk__20071_20355 = G__20368;
count__20072_20356 = G__20369;
i__20073_20357 = G__20370;
continue;
} else {
var e_20371 = cljs.core.first(seq__20070_20365__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20371)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20371))].join(''));


var G__20372 = cljs.core.next(seq__20070_20365__$1);
var G__20373 = null;
var G__20374 = (0);
var G__20375 = (0);
seq__20070_20354 = G__20372;
chunk__20071_20355 = G__20373;
count__20072_20356 = G__20374;
i__20073_20357 = G__20375;
continue;
}
} else {
}
}
break;
}
}

var valid_QMARK_ = (function (){var and__5043__auto__ = cljs.core.every_QMARK_(new cljs.core.Keyword(null,"valid?","valid?",-212412379),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(slab_results));
if(and__5043__auto__){
return new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(root_result);
} else {
return and__5043__auto__;
}
})();
pr_BANG_((cljs.core.truth_(valid_QMARK_)?"  PASS":["  !! INVARIANT VIOLATION !! (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(all_errors.length)," errors)"].join('')));

var frame = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"valid?","valid?",-212412379),valid_QMARK_,new cljs.core.Keyword(null,"lines","lines",-700165781),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines)),new cljs.core.Keyword(null,"slab-stats","slab-stats",-1262204591),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"stats","stats",-85643011),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(slab_results))),new cljs.core.Keyword(null,"root-stats","root-stats",1793092361),new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(root_result),new cljs.core.Keyword(null,"errors","errors",-908790718),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(all_errors)),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),Date.now()], null);
cljs_thread.eve.deftype_proto.xray.trace_frames.push(frame);

if((cljs_thread.eve.deftype_proto.xray.trace_frames.length > (50))){
cljs_thread.eve.deftype_proto.xray.trace_frames.shift();
} else {
}

var seq__20092_20380 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines));
var chunk__20093_20381 = null;
var count__20094_20382 = (0);
var i__20095_20383 = (0);
while(true){
if((i__20095_20383 < count__20094_20382)){
var line_20388 = chunk__20093_20381.cljs$core$IIndexed$_nth$arity$2(null, i__20095_20383);
console.log(line_20388);


var G__20389 = seq__20092_20380;
var G__20390 = chunk__20093_20381;
var G__20391 = count__20094_20382;
var G__20392 = (i__20095_20383 + (1));
seq__20092_20380 = G__20389;
chunk__20093_20381 = G__20390;
count__20094_20382 = G__20391;
i__20095_20383 = G__20392;
continue;
} else {
var temp__5823__auto___20393 = cljs.core.seq(seq__20092_20380);
if(temp__5823__auto___20393){
var seq__20092_20394__$1 = temp__5823__auto___20393;
if(cljs.core.chunked_seq_QMARK_(seq__20092_20394__$1)){
var c__5568__auto___20395 = cljs.core.chunk_first(seq__20092_20394__$1);
var G__20396 = cljs.core.chunk_rest(seq__20092_20394__$1);
var G__20397 = c__5568__auto___20395;
var G__20398 = cljs.core.count(c__5568__auto___20395);
var G__20399 = (0);
seq__20092_20380 = G__20396;
chunk__20093_20381 = G__20397;
count__20094_20382 = G__20398;
i__20095_20383 = G__20399;
continue;
} else {
var line_20400 = cljs.core.first(seq__20092_20394__$1);
console.log(line_20400);


var G__20401 = cljs.core.next(seq__20092_20394__$1);
var G__20402 = null;
var G__20403 = (0);
var G__20404 = (0);
seq__20092_20380 = G__20401;
chunk__20093_20381 = G__20402;
count__20094_20382 = G__20403;
i__20095_20383 = G__20404;
continue;
}
} else {
}
}
break;
}

return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"valid?","valid?",-212412379),valid_QMARK_,new cljs.core.Keyword(null,"slab-results","slab-results",1320835640),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(slab_results)),new cljs.core.Keyword(null,"root-result","root-result",1506648562),root_result,new cljs.core.Keyword(null,"all-errors","all-errors",973705773),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(all_errors)),new cljs.core.Keyword(null,"frame","frame",-1711082588),frame], null);
}
});
/**
 * Print the full memory trace — all captured frames.
 */
cljs_thread.eve.deftype_proto.xray.replay_trace_BANG_ = (function cljs_thread$eve$deftype_proto$xray$replay_trace_BANG_(){
console.log("\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");

console.log("\u2551            [SLAB X-RAY MEMORY TRACE REPLAY]             \u2551");

console.log("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D");

var n__5636__auto___20421 = cljs_thread.eve.deftype_proto.xray.trace_frames.length;
var fi_20426 = (0);
while(true){
if((fi_20426 < n__5636__auto___20421)){
var f_20427 = (cljs_thread.eve.deftype_proto.xray.trace_frames[fi_20426]);
console.log(["\n\u2501\u2501\u2501 Frame ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((fi_20426 + (1))),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.trace_frames.length)," [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_20427)),"]",(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f_20427))?" PASS":" !! FAIL !!")," \u2501\u2501\u2501"].join(''));

var seq__20096_20436 = cljs.core.seq(new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f_20427));
var chunk__20097_20437 = null;
var count__20098_20438 = (0);
var i__20099_20439 = (0);
while(true){
if((i__20099_20439 < count__20098_20438)){
var line_20440 = chunk__20097_20437.cljs$core$IIndexed$_nth$arity$2(null, i__20099_20439);
console.log(line_20440);


var G__20441 = seq__20096_20436;
var G__20442 = chunk__20097_20437;
var G__20443 = count__20098_20438;
var G__20444 = (i__20099_20439 + (1));
seq__20096_20436 = G__20441;
chunk__20097_20437 = G__20442;
count__20098_20438 = G__20443;
i__20099_20439 = G__20444;
continue;
} else {
var temp__5823__auto___20449 = cljs.core.seq(seq__20096_20436);
if(temp__5823__auto___20449){
var seq__20096_20450__$1 = temp__5823__auto___20449;
if(cljs.core.chunked_seq_QMARK_(seq__20096_20450__$1)){
var c__5568__auto___20451 = cljs.core.chunk_first(seq__20096_20450__$1);
var G__20452 = cljs.core.chunk_rest(seq__20096_20450__$1);
var G__20453 = c__5568__auto___20451;
var G__20454 = cljs.core.count(c__5568__auto___20451);
var G__20455 = (0);
seq__20096_20436 = G__20452;
chunk__20097_20437 = G__20453;
count__20098_20438 = G__20454;
i__20099_20439 = G__20455;
continue;
} else {
var line_20456 = cljs.core.first(seq__20096_20450__$1);
console.log(line_20456);


var G__20457 = cljs.core.next(seq__20096_20450__$1);
var G__20458 = null;
var G__20459 = (0);
var G__20460 = (0);
seq__20096_20436 = G__20457;
chunk__20097_20437 = G__20458;
count__20098_20438 = G__20459;
i__20099_20439 = G__20460;
continue;
}
} else {
}
}
break;
}

if(cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_20427))){
console.log("  ERRORS:");

var seq__20100_20461 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_20427));
var chunk__20101_20462 = null;
var count__20102_20463 = (0);
var i__20103_20464 = (0);
while(true){
if((i__20103_20464 < count__20102_20463)){
var e_20473 = chunk__20101_20462.cljs$core$IIndexed$_nth$arity$2(null, i__20103_20464);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_20473)].join(''));


var G__20474 = seq__20100_20461;
var G__20475 = chunk__20101_20462;
var G__20476 = count__20102_20463;
var G__20477 = (i__20103_20464 + (1));
seq__20100_20461 = G__20474;
chunk__20101_20462 = G__20475;
count__20102_20463 = G__20476;
i__20103_20464 = G__20477;
continue;
} else {
var temp__5823__auto___20478 = cljs.core.seq(seq__20100_20461);
if(temp__5823__auto___20478){
var seq__20100_20479__$1 = temp__5823__auto___20478;
if(cljs.core.chunked_seq_QMARK_(seq__20100_20479__$1)){
var c__5568__auto___20480 = cljs.core.chunk_first(seq__20100_20479__$1);
var G__20481 = cljs.core.chunk_rest(seq__20100_20479__$1);
var G__20482 = c__5568__auto___20480;
var G__20483 = cljs.core.count(c__5568__auto___20480);
var G__20484 = (0);
seq__20100_20461 = G__20481;
chunk__20101_20462 = G__20482;
count__20102_20463 = G__20483;
i__20103_20464 = G__20484;
continue;
} else {
var e_20485 = cljs.core.first(seq__20100_20479__$1);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_20485)].join(''));


var G__20490 = cljs.core.next(seq__20100_20479__$1);
var G__20491 = null;
var G__20492 = (0);
var G__20493 = (0);
seq__20100_20461 = G__20490;
chunk__20101_20462 = G__20491;
count__20102_20463 = G__20492;
i__20103_20464 = G__20493;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__20494 = (fi_20426 + (1));
fi_20426 = G__20494;
continue;
} else {
}
break;
}

return console.log("\n\u2550\u2550\u2550 [/SLAB X-RAY MEMORY TRACE REPLAY] \u2550\u2550\u2550");
});
/**
 * Run full slab xray scan. Throws on invariant violation.
 * On failure, replays the entire memory trace before throwing.
 * Call before/after transactions to build the diagnostic movie.
 * 
 * Usage:
 *   (slab-xray-validate! "PRE scene-build")
 *   (slab-xray-validate! "POST scene-build")
 */
cljs_thread.eve.deftype_proto.xray.slab_xray_validate_BANG_ = (function cljs_thread$eve$deftype_proto$xray$slab_xray_validate_BANG_(label){
var result = cljs_thread.eve.deftype_proto.xray.slab_xray_scan(label);
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))){
return null;
} else {
cljs_thread.eve.deftype_proto.xray.replay_trace_BANG_();

throw (new Error(["[SLAB X-RAY] Invariant violation at '",cljs.core.str.cljs$core$IFn$_invoke$arity$1(label),"': ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"all-errors","all-errors",973705773).cljs$core$IFn$_invoke$arity$1(result)))," errors. ","First: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first(new cljs.core.Keyword(null,"all-errors","all-errors",973705773).cljs$core$IFn$_invoke$arity$1(result)))].join('')));
}
});
/**
 * Fast snapshot of slab allocation state. No invariant checking.
 * Returns a JS object for minimal overhead.
 */
cljs_thread.eve.deftype_proto.xray.quick_stats = (function cljs_thread$eve$deftype_proto$xray$quick_stats(){
var stats = [];
var n__5636__auto___20503 = (6);
var ci_20504 = (0);
while(true){
if((ci_20504 < n__5636__auto___20503)){
var inst_20509 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(ci_20504);
if(cljs.core.truth_(inst_20509)){
var i32_20510 = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20509);
var total_20511 = Atomics.load(i32_20510,((8) / (4)));
var free_20512 = Atomics.load(i32_20510,((12) / (4)));
stats.push([ci_20504,(cljs_thread.eve.deftype_proto.data.SLAB_SIZES[ci_20504]),total_20511,(total_20511 - free_20512),free_20512]);
} else {
}

var G__20513 = (ci_20504 + (1));
ci_20504 = G__20513;
continue;
} else {
}
break;
}

return stats;
});
/**
 * Print one-line slab allocation summary.
 */
cljs_thread.eve.deftype_proto.xray.print_quick_stats = (function cljs_thread$eve$deftype_proto$xray$print_quick_stats(label){
var stats = cljs_thread.eve.deftype_proto.xray.quick_stats();
var parts = [];
var n__5636__auto___20518 = stats.length;
var i_20519 = (0);
while(true){
if((i_20519 < n__5636__auto___20518)){
var s_20524 = (stats[i_20519]);
parts.push(["S",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20524[(0)])),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20524[(3)])),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20524[(2)]))].join(''));

var G__20529 = (i_20519 + (1));
i_20519 = G__20529;
continue;
} else {
}
break;
}

return console.log(["[SLAB] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = label;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})())," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(parts.join(" | "))].join(''));
});
cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_ = false;
cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_ = false;
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.in_use_offsets !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.in_use_offsets = (new Set());
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.alloc_counts !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.alloc_counts = (new Int32Array((8)));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.xray.recycle_counts !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.xray.recycle_counts = (new Int32Array((8)));
}
/**
 * Enable pool offset tracking. Clears previous state.
 * Registers hooks with alloc module to catch double-free at allocation time.
 */
cljs_thread.eve.deftype_proto.xray.enable_pool_tracking_BANG_ = (function cljs_thread$eve$deftype_proto$xray$enable_pool_tracking_BANG_(){
if(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS){
cljs_thread.eve.deftype_proto.xray.in_use_offsets.clear();

cljs_thread.eve.deftype_proto.xray.alloc_counts.fill((0));

cljs_thread.eve.deftype_proto.xray.recycle_counts.fill((0));

(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_ = true);

cljs_thread.eve.deftype_proto.alloc.register_alloc_hook_BANG_(cljs_thread.eve.deftype_proto.xray.track_allocate_BANG_);

cljs_thread.eve.deftype_proto.alloc.register_recycle_hook_BANG_(cljs_thread.eve.deftype_proto.xray.track_recycle_BANG_);

return console.log("[X-RAY] Pool tracking ENABLED (hooks registered)");
} else {
return null;
}
});
/**
 * Disable pool offset tracking and clear alloc hooks.
 */
cljs_thread.eve.deftype_proto.xray.disable_pool_tracking_BANG_ = (function cljs_thread$eve$deftype_proto$xray$disable_pool_tracking_BANG_(){
(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_ = false);

cljs_thread.eve.deftype_proto.xray.in_use_offsets.clear();

cljs_thread.eve.deftype_proto.alloc.clear_diagnostic_hooks_BANG_();

return console.log("[X-RAY] Pool tracking DISABLED (hooks cleared)");
});
/**
 * Returns true if pool tracking is active.
 */
cljs_thread.eve.deftype_proto.xray.pool_tracking_enabled_QMARK_ = (function cljs_thread$eve$deftype_proto$xray$pool_tracking_enabled_QMARK_(){
return cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_;
});
/**
 * Enable verbose logging for pool operations.
 */
cljs_thread.eve.deftype_proto.xray.enable_pool_track_debug_BANG_ = (function cljs_thread$eve$deftype_proto$xray$enable_pool_track_debug_BANG_(){
return (cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_ = true);
});
/**
 * Disable verbose logging for pool operations.
 */
cljs_thread.eve.deftype_proto.xray.disable_pool_track_debug_BANG_ = (function cljs_thread$eve$deftype_proto$xray$disable_pool_track_debug_BANG_(){
return (cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_ = false);
});
/**
 * Clear pool tracking state without disabling.
 */
cljs_thread.eve.deftype_proto.xray.clear_pool_tracking_BANG_ = (function cljs_thread$eve$deftype_proto$xray$clear_pool_tracking_BANG_(){
cljs_thread.eve.deftype_proto.xray.in_use_offsets.clear();

cljs_thread.eve.deftype_proto.xray.alloc_counts.fill((0));

return cljs_thread.eve.deftype_proto.xray.recycle_counts.fill((0));
});
/**
 * Mark offset as in-use. Throws if already in use (double-alloc).
 * Call this after every successful allocation.
 */
cljs_thread.eve.deftype_proto.xray.track_allocate_BANG_ = (function cljs_thread$eve$deftype_proto$xray$track_allocate_BANG_(offset){
if(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.xray.in_use_offsets.has(offset))){
var class_idx_20546 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_20547 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double allocation! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20546)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20547),")"," is already in-use!"].join('')));
} else {
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.add(offset);

var class_idx_20548 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_20548 < (8))){
(cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_20548] = ((cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_20548]) + (1)));
} else {
}

if(cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_){
return console.log("[X-RAY POOL] ALLOC:",offset,"in-use-count=",cljs_thread.eve.deftype_proto.xray.in_use_offsets.size);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Mark offset as recycled. Throws if not in use (double-free).
 * Call this before freeing or returning to pool.
 */
cljs_thread.eve.deftype_proto.xray.track_recycle_BANG_ = (function cljs_thread$eve$deftype_proto$xray$track_recycle_BANG_(offset){
if(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.xray.in_use_offsets.has(offset))){
} else {
var class_idx_20557 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_20558 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double recycle! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20557)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20558),")"," was NOT in-use!"].join('')));
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.delete(offset);

var class_idx_20563 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_20563 < (8))){
(cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_20563] = ((cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_20563]) + (1)));
} else {
}

if(cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_){
return console.log("[X-RAY POOL] RECYCLE:",offset,"in-use-count=",cljs_thread.eve.deftype_proto.xray.in_use_offsets.size);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Verify an offset about to be returned from pool is not in-use.
 * Call this before returning a pooled offset.
 */
cljs_thread.eve.deftype_proto.xray.track_check_pool_get_BANG_ = (function cljs_thread$eve$deftype_proto$xray$track_check_pool_get_BANG_(offset){
if(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.xray.in_use_offsets.has(offset))){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Pool corruption! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx),")"," is still IN-USE but being returned from pool!"].join('')));
} else {
return null;
}
} else {
return null;
}
});
/**
 * Returns current pool tracking statistics.
 */
cljs_thread.eve.deftype_proto.xray.pool_tracking_stats = (function cljs_thread$eve$deftype_proto$xray$pool_tracking_stats(){
if(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"enabled?","enabled?",-1376075057),true,new cljs.core.Keyword(null,"in-use-count","in-use-count",-60143493),cljs_thread.eve.deftype_proto.xray.in_use_offsets.size,new cljs.core.Keyword(null,"alloc-counts","alloc-counts",1230793287),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.alloc_counts)),new cljs.core.Keyword(null,"recycle-counts","recycle-counts",-89322940),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.recycle_counts))], null);
} else {
return null;
}
});
/**
 * Validate pool tracking invariants. Returns nil if valid, throws on violation.
 * Invariant 15: No offsets in pool tracking that shouldn't be there.
 */
cljs_thread.eve.deftype_proto.xray.pool_tracking_validate_BANG_ = (function cljs_thread$eve$deftype_proto$xray$pool_tracking_validate_BANG_(label){
if(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_){
var in_use_count = cljs_thread.eve.deftype_proto.xray.in_use_offsets.size;
var total_allocs = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.alloc_counts));
var total_recycles = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.recycle_counts));
var expected_in_use = (total_allocs - total_recycles);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(in_use_count,expected_in_use)){
throw (new Error(["[X-RAY POOL INV15] In-use count mismatch at '",cljs.core.str.cljs$core$IFn$_invoke$arity$1(label),"': ","set-size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_use_count)," expected=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(expected_in_use)," (allocs=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_allocs)," recycles=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_recycles),")"].join('')));
} else {
}

if(cljs_thread.eve.deftype_proto.xray.pool_track_debug_QMARK_){
return console.log(["[X-RAY POOL] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(label),": in-use=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_use_count)," allocs=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_allocs)," recycles=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_recycles)].join(''));
} else {
return null;
}
} else {
return null;
}
});
/**
 * Full slab validation PLUS pool tracking invariants.
 * Call before/after transactions for complete diagnostics.
 */
cljs_thread.eve.deftype_proto.xray.slab_xray_validate_with_pools_BANG_ = (function cljs_thread$eve$deftype_proto$xray$slab_xray_validate_with_pools_BANG_(label){
cljs_thread.eve.deftype_proto.xray.slab_xray_validate_BANG_(label);

return cljs_thread.eve.deftype_proto.xray.pool_tracking_validate_BANG_(label);
});

//# sourceMappingURL=cljs_thread.eve.deftype_proto.xray.js.map
