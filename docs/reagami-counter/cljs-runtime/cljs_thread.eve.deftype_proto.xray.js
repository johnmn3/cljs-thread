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
var G__20188 = (v & (v - (1)));
var G__20189 = (c + (1));
v = G__20188;
c = G__20189;
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
var G__20195 = (i + (1));
var G__20196 = (allocated + pc);
i = G__20195;
allocated = G__20196;
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
var n__5636__auto___20215 = (256);
var slot_idx_20216 = (0);
while(true){
if((slot_idx_20216 < n__5636__auto___20215)){
var slot_byte_offset_20217 = (cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx_20216 * (24)));
var w_status_20218 = Atomics.load(i32,(slot_byte_offset_20217 / (4)));
var w_epoch_20219 = Atomics.load(i32,((slot_byte_offset_20217 + (4)) / (4)));
var w_id_20220 = Atomics.load(i32,((slot_byte_offset_20217 + (16)) / (4)));
if((w_status_20218 === (1))){
worker_info.push([slot_idx_20216,w_id_20220,w_epoch_20219]);

if((((w_epoch_20219 > (0))) && ((w_epoch_20219 > epoch)))){
errors.push([(13),["Worker slot ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slot_idx_20216)," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(w_epoch_20219)," > global=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch)].join('')]);
} else {
}
} else {
}

var G__20221 = (slot_idx_20216 + (1));
slot_idx_20216 = G__20221;
continue;
} else {
}
break;
}

if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))))){
var class_idx_20222 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr);
var block_idx_20223 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr);
if((class_idx_20222 < (6))){
var inst_20224 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx_20222);
if(cljs.core.truth_(inst_20224)){
var bm_offset_20225 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20224),((24) / (4)));
var bm_int32_offset_20226 = (bm_offset_20225 >>> (2));
var word_idx_20227 = (block_idx_20223 >>> (5));
var bit_pos_20228 = (block_idx_20223 & (31));
var word_20229 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20224),(bm_int32_offset_20226 + word_idx_20227));
var allocated_QMARK__20230 = (!(((word_20229 & ((1) << bit_pos_20228)) === (0))));
if(allocated_QMARK__20230){
} else {
errors.push([(14),["Root ptr class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20222)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20223)," NOT allocated in bitmap"].join('')]);
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

var n__5636__auto___20231 = (6);
var ci_20232 = (0);
while(true){
if((ci_20232 < n__5636__auto___20231)){
var result_20233 = cljs_thread.eve.deftype_proto.xray.scan_slab_class(ci_20232,bar_width);
slab_results.push(result_20233);

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_20233))){
} else {
var seq__20076_20234 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_20233));
var chunk__20077_20235 = null;
var count__20078_20236 = (0);
var i__20079_20237 = (0);
while(true){
if((i__20079_20237 < count__20078_20236)){
var e_20238 = chunk__20077_20235.cljs$core$IIndexed$_nth$arity$2(null, i__20079_20237);
all_errors.push(e_20238);


var G__20239 = seq__20076_20234;
var G__20240 = chunk__20077_20235;
var G__20241 = count__20078_20236;
var G__20242 = (i__20079_20237 + (1));
seq__20076_20234 = G__20239;
chunk__20077_20235 = G__20240;
count__20078_20236 = G__20241;
i__20079_20237 = G__20242;
continue;
} else {
var temp__5823__auto___20243 = cljs.core.seq(seq__20076_20234);
if(temp__5823__auto___20243){
var seq__20076_20244__$1 = temp__5823__auto___20243;
if(cljs.core.chunked_seq_QMARK_(seq__20076_20244__$1)){
var c__5568__auto___20245 = cljs.core.chunk_first(seq__20076_20244__$1);
var G__20246 = cljs.core.chunk_rest(seq__20076_20244__$1);
var G__20247 = c__5568__auto___20245;
var G__20248 = cljs.core.count(c__5568__auto___20245);
var G__20249 = (0);
seq__20076_20234 = G__20246;
chunk__20077_20235 = G__20247;
count__20078_20236 = G__20248;
i__20079_20237 = G__20249;
continue;
} else {
var e_20250 = cljs.core.first(seq__20076_20244__$1);
all_errors.push(e_20250);


var G__20251 = cljs.core.next(seq__20076_20244__$1);
var G__20252 = null;
var G__20253 = (0);
var G__20254 = (0);
seq__20076_20234 = G__20251;
chunk__20077_20235 = G__20252;
count__20078_20236 = G__20253;
i__20079_20237 = G__20254;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___20255 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(result_20233);
if(cljs.core.truth_(temp__5823__auto___20255)){
var stats_20256 = temp__5823__auto___20255;
var map__20086_20257 = stats_20256;
var map__20086_20258__$1 = cljs.core.__destructure_map(map__20086_20257);
var block_size_20259 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"block-size","block-size",-1062272384));
var total_blocks_20260 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763));
var bitmap_allocated_20261 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"bitmap-allocated","bitmap-allocated",1875511612));
var bitmap_free_20262 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"bitmap-free","bitmap-free",1369917211));
var header_free_count_20263 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"header-free-count","header-free-count",1771971162));
var alloc_cursor_20264 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20086_20258__$1,new cljs.core.Keyword(null,"alloc-cursor","alloc-cursor",387943531));
var pct_20265 = (((total_blocks_20260 > (0)))?Math.round(((100) * (bitmap_allocated_20261 / total_blocks_20260))):(0));
pr_BANG_(["  SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_20232)," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_size_20259),"B)"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_blocks_20260)," blk"," | alloc=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_allocated_20261)," free=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_free_20262)," (hdr=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_free_count_20263),")"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pct_20265),"% | cur=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alloc_cursor_20264)].join(''));

if(cljs.core.truth_(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_20233))){
pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_20233)),"|"].join(''));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_20233))){
} else {
pr_BANG_(["  !! SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_20232)," ERRORS:"].join(''));
}

var seq__20087_20266 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_20233));
var chunk__20088_20267 = null;
var count__20089_20268 = (0);
var i__20090_20269 = (0);
while(true){
if((i__20090_20269 < count__20089_20268)){
var e_20270 = chunk__20088_20267.cljs$core$IIndexed$_nth$arity$2(null, i__20090_20269);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20270)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20270))].join(''));


var G__20271 = seq__20087_20266;
var G__20272 = chunk__20088_20267;
var G__20273 = count__20089_20268;
var G__20274 = (i__20090_20269 + (1));
seq__20087_20266 = G__20271;
chunk__20088_20267 = G__20272;
count__20089_20268 = G__20273;
i__20090_20269 = G__20274;
continue;
} else {
var temp__5823__auto___20275__$1 = cljs.core.seq(seq__20087_20266);
if(temp__5823__auto___20275__$1){
var seq__20087_20276__$1 = temp__5823__auto___20275__$1;
if(cljs.core.chunked_seq_QMARK_(seq__20087_20276__$1)){
var c__5568__auto___20277 = cljs.core.chunk_first(seq__20087_20276__$1);
var G__20278 = cljs.core.chunk_rest(seq__20087_20276__$1);
var G__20279 = c__5568__auto___20277;
var G__20280 = cljs.core.count(c__5568__auto___20277);
var G__20281 = (0);
seq__20087_20266 = G__20278;
chunk__20088_20267 = G__20279;
count__20089_20268 = G__20280;
i__20090_20269 = G__20281;
continue;
} else {
var e_20282 = cljs.core.first(seq__20087_20276__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20282)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20282))].join(''));


var G__20283 = cljs.core.next(seq__20087_20276__$1);
var G__20284 = null;
var G__20285 = (0);
var G__20286 = (0);
seq__20087_20266 = G__20283;
chunk__20088_20267 = G__20284;
count__20089_20268 = G__20285;
i__20090_20269 = G__20286;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__20287 = (ci_20232 + (1));
ci_20232 = G__20287;
continue;
} else {
}
break;
}

var root_result = cljs_thread.eve.deftype_proto.xray.scan_root_sab();
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(root_result))){
} else {
var seq__20091_20288 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__20092_20289 = null;
var count__20093_20290 = (0);
var i__20094_20291 = (0);
while(true){
if((i__20094_20291 < count__20093_20290)){
var e_20292 = chunk__20092_20289.cljs$core$IIndexed$_nth$arity$2(null, i__20094_20291);
all_errors.push(e_20292);


var G__20293 = seq__20091_20288;
var G__20294 = chunk__20092_20289;
var G__20295 = count__20093_20290;
var G__20296 = (i__20094_20291 + (1));
seq__20091_20288 = G__20293;
chunk__20092_20289 = G__20294;
count__20093_20290 = G__20295;
i__20094_20291 = G__20296;
continue;
} else {
var temp__5823__auto___20297 = cljs.core.seq(seq__20091_20288);
if(temp__5823__auto___20297){
var seq__20091_20298__$1 = temp__5823__auto___20297;
if(cljs.core.chunked_seq_QMARK_(seq__20091_20298__$1)){
var c__5568__auto___20299 = cljs.core.chunk_first(seq__20091_20298__$1);
var G__20300 = cljs.core.chunk_rest(seq__20091_20298__$1);
var G__20301 = c__5568__auto___20299;
var G__20302 = cljs.core.count(c__5568__auto___20299);
var G__20303 = (0);
seq__20091_20288 = G__20300;
chunk__20092_20289 = G__20301;
count__20093_20290 = G__20302;
i__20094_20291 = G__20303;
continue;
} else {
var e_20304 = cljs.core.first(seq__20091_20298__$1);
all_errors.push(e_20304);


var G__20305 = cljs.core.next(seq__20091_20298__$1);
var G__20306 = null;
var G__20307 = (0);
var G__20308 = (0);
seq__20091_20288 = G__20305;
chunk__20092_20289 = G__20306;
count__20093_20290 = G__20307;
i__20094_20291 = G__20308;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___20309 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(root_result);
if(cljs.core.truth_(temp__5823__auto___20309)){
var stats_20310 = temp__5823__auto___20309;
var map__20095_20311 = stats_20310;
var map__20095_20312__$1 = cljs.core.__destructure_map(map__20095_20311);
var root_ptr_20313 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20095_20312__$1,new cljs.core.Keyword(null,"root-ptr","root-ptr",1411033947));
var epoch_20314 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20095_20312__$1,new cljs.core.Keyword(null,"epoch","epoch",1435633666));
var active_workers_20315 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20095_20312__$1,new cljs.core.Keyword(null,"active-workers","active-workers",1822846782));
var workers_20316 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20095_20312__$1,new cljs.core.Keyword(null,"workers","workers",-2054878819));
pr_BANG_(["  ROOT: ptr=",(((((root_ptr_20313 === (-1))) || ((root_ptr_20313 === (-1)))))?"NIL":["class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr_20313))," blk=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr_20313))].join(''))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_20314)," workers=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(active_workers_20315)].join(''));

var seq__20096_20318 = cljs.core.seq(workers_20316);
var chunk__20097_20319 = null;
var count__20098_20320 = (0);
var i__20099_20321 = (0);
while(true){
if((i__20099_20321 < count__20098_20320)){
var w_20322 = chunk__20097_20319.cljs$core$IIndexed$_nth$arity$2(null, i__20099_20321);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_20322)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_20322))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_20322))].join(''));


var G__20323 = seq__20096_20318;
var G__20324 = chunk__20097_20319;
var G__20325 = count__20098_20320;
var G__20326 = (i__20099_20321 + (1));
seq__20096_20318 = G__20323;
chunk__20097_20319 = G__20324;
count__20098_20320 = G__20325;
i__20099_20321 = G__20326;
continue;
} else {
var temp__5823__auto___20327__$1 = cljs.core.seq(seq__20096_20318);
if(temp__5823__auto___20327__$1){
var seq__20096_20328__$1 = temp__5823__auto___20327__$1;
if(cljs.core.chunked_seq_QMARK_(seq__20096_20328__$1)){
var c__5568__auto___20329 = cljs.core.chunk_first(seq__20096_20328__$1);
var G__20330 = cljs.core.chunk_rest(seq__20096_20328__$1);
var G__20331 = c__5568__auto___20329;
var G__20332 = cljs.core.count(c__5568__auto___20329);
var G__20333 = (0);
seq__20096_20318 = G__20330;
chunk__20097_20319 = G__20331;
count__20098_20320 = G__20332;
i__20099_20321 = G__20333;
continue;
} else {
var w_20334 = cljs.core.first(seq__20096_20328__$1);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_20334)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_20334))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_20334))].join(''));


var G__20335 = cljs.core.next(seq__20096_20328__$1);
var G__20336 = null;
var G__20337 = (0);
var G__20338 = (0);
seq__20096_20318 = G__20335;
chunk__20097_20319 = G__20336;
count__20098_20320 = G__20337;
i__20099_20321 = G__20338;
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

var seq__20100_20339 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__20101_20340 = null;
var count__20102_20341 = (0);
var i__20103_20342 = (0);
while(true){
if((i__20103_20342 < count__20102_20341)){
var e_20343 = chunk__20101_20340.cljs$core$IIndexed$_nth$arity$2(null, i__20103_20342);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20343)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20343))].join(''));


var G__20344 = seq__20100_20339;
var G__20345 = chunk__20101_20340;
var G__20346 = count__20102_20341;
var G__20347 = (i__20103_20342 + (1));
seq__20100_20339 = G__20344;
chunk__20101_20340 = G__20345;
count__20102_20341 = G__20346;
i__20103_20342 = G__20347;
continue;
} else {
var temp__5823__auto___20348 = cljs.core.seq(seq__20100_20339);
if(temp__5823__auto___20348){
var seq__20100_20349__$1 = temp__5823__auto___20348;
if(cljs.core.chunked_seq_QMARK_(seq__20100_20349__$1)){
var c__5568__auto___20350 = cljs.core.chunk_first(seq__20100_20349__$1);
var G__20351 = cljs.core.chunk_rest(seq__20100_20349__$1);
var G__20352 = c__5568__auto___20350;
var G__20353 = cljs.core.count(c__5568__auto___20350);
var G__20354 = (0);
seq__20100_20339 = G__20351;
chunk__20101_20340 = G__20352;
count__20102_20341 = G__20353;
i__20103_20342 = G__20354;
continue;
} else {
var e_20355 = cljs.core.first(seq__20100_20349__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_20355)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_20355))].join(''));


var G__20356 = cljs.core.next(seq__20100_20349__$1);
var G__20357 = null;
var G__20358 = (0);
var G__20359 = (0);
seq__20100_20339 = G__20356;
chunk__20101_20340 = G__20357;
count__20102_20341 = G__20358;
i__20103_20342 = G__20359;
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

var seq__20104_20362 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines));
var chunk__20105_20363 = null;
var count__20106_20364 = (0);
var i__20107_20365 = (0);
while(true){
if((i__20107_20365 < count__20106_20364)){
var line_20366 = chunk__20105_20363.cljs$core$IIndexed$_nth$arity$2(null, i__20107_20365);
console.log(line_20366);


var G__20367 = seq__20104_20362;
var G__20368 = chunk__20105_20363;
var G__20369 = count__20106_20364;
var G__20370 = (i__20107_20365 + (1));
seq__20104_20362 = G__20367;
chunk__20105_20363 = G__20368;
count__20106_20364 = G__20369;
i__20107_20365 = G__20370;
continue;
} else {
var temp__5823__auto___20371 = cljs.core.seq(seq__20104_20362);
if(temp__5823__auto___20371){
var seq__20104_20372__$1 = temp__5823__auto___20371;
if(cljs.core.chunked_seq_QMARK_(seq__20104_20372__$1)){
var c__5568__auto___20376 = cljs.core.chunk_first(seq__20104_20372__$1);
var G__20377 = cljs.core.chunk_rest(seq__20104_20372__$1);
var G__20378 = c__5568__auto___20376;
var G__20379 = cljs.core.count(c__5568__auto___20376);
var G__20380 = (0);
seq__20104_20362 = G__20377;
chunk__20105_20363 = G__20378;
count__20106_20364 = G__20379;
i__20107_20365 = G__20380;
continue;
} else {
var line_20381 = cljs.core.first(seq__20104_20372__$1);
console.log(line_20381);


var G__20382 = cljs.core.next(seq__20104_20372__$1);
var G__20383 = null;
var G__20384 = (0);
var G__20385 = (0);
seq__20104_20362 = G__20382;
chunk__20105_20363 = G__20383;
count__20106_20364 = G__20384;
i__20107_20365 = G__20385;
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

var n__5636__auto___20386 = cljs_thread.eve.deftype_proto.xray.trace_frames.length;
var fi_20387 = (0);
while(true){
if((fi_20387 < n__5636__auto___20386)){
var f_20388 = (cljs_thread.eve.deftype_proto.xray.trace_frames[fi_20387]);
console.log(["\n\u2501\u2501\u2501 Frame ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((fi_20387 + (1))),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.trace_frames.length)," [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_20388)),"]",(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f_20388))?" PASS":" !! FAIL !!")," \u2501\u2501\u2501"].join(''));

var seq__20108_20389 = cljs.core.seq(new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f_20388));
var chunk__20109_20390 = null;
var count__20110_20391 = (0);
var i__20111_20392 = (0);
while(true){
if((i__20111_20392 < count__20110_20391)){
var line_20393 = chunk__20109_20390.cljs$core$IIndexed$_nth$arity$2(null, i__20111_20392);
console.log(line_20393);


var G__20394 = seq__20108_20389;
var G__20395 = chunk__20109_20390;
var G__20396 = count__20110_20391;
var G__20397 = (i__20111_20392 + (1));
seq__20108_20389 = G__20394;
chunk__20109_20390 = G__20395;
count__20110_20391 = G__20396;
i__20111_20392 = G__20397;
continue;
} else {
var temp__5823__auto___20398 = cljs.core.seq(seq__20108_20389);
if(temp__5823__auto___20398){
var seq__20108_20399__$1 = temp__5823__auto___20398;
if(cljs.core.chunked_seq_QMARK_(seq__20108_20399__$1)){
var c__5568__auto___20400 = cljs.core.chunk_first(seq__20108_20399__$1);
var G__20401 = cljs.core.chunk_rest(seq__20108_20399__$1);
var G__20402 = c__5568__auto___20400;
var G__20403 = cljs.core.count(c__5568__auto___20400);
var G__20404 = (0);
seq__20108_20389 = G__20401;
chunk__20109_20390 = G__20402;
count__20110_20391 = G__20403;
i__20111_20392 = G__20404;
continue;
} else {
var line_20405 = cljs.core.first(seq__20108_20399__$1);
console.log(line_20405);


var G__20406 = cljs.core.next(seq__20108_20399__$1);
var G__20407 = null;
var G__20408 = (0);
var G__20409 = (0);
seq__20108_20389 = G__20406;
chunk__20109_20390 = G__20407;
count__20110_20391 = G__20408;
i__20111_20392 = G__20409;
continue;
}
} else {
}
}
break;
}

if(cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_20388))){
console.log("  ERRORS:");

var seq__20112_20410 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_20388));
var chunk__20113_20411 = null;
var count__20114_20412 = (0);
var i__20115_20413 = (0);
while(true){
if((i__20115_20413 < count__20114_20412)){
var e_20414 = chunk__20113_20411.cljs$core$IIndexed$_nth$arity$2(null, i__20115_20413);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_20414)].join(''));


var G__20415 = seq__20112_20410;
var G__20416 = chunk__20113_20411;
var G__20417 = count__20114_20412;
var G__20418 = (i__20115_20413 + (1));
seq__20112_20410 = G__20415;
chunk__20113_20411 = G__20416;
count__20114_20412 = G__20417;
i__20115_20413 = G__20418;
continue;
} else {
var temp__5823__auto___20419 = cljs.core.seq(seq__20112_20410);
if(temp__5823__auto___20419){
var seq__20112_20420__$1 = temp__5823__auto___20419;
if(cljs.core.chunked_seq_QMARK_(seq__20112_20420__$1)){
var c__5568__auto___20421 = cljs.core.chunk_first(seq__20112_20420__$1);
var G__20422 = cljs.core.chunk_rest(seq__20112_20420__$1);
var G__20423 = c__5568__auto___20421;
var G__20424 = cljs.core.count(c__5568__auto___20421);
var G__20425 = (0);
seq__20112_20410 = G__20422;
chunk__20113_20411 = G__20423;
count__20114_20412 = G__20424;
i__20115_20413 = G__20425;
continue;
} else {
var e_20426 = cljs.core.first(seq__20112_20420__$1);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_20426)].join(''));


var G__20427 = cljs.core.next(seq__20112_20420__$1);
var G__20428 = null;
var G__20429 = (0);
var G__20430 = (0);
seq__20112_20410 = G__20427;
chunk__20113_20411 = G__20428;
count__20114_20412 = G__20429;
i__20115_20413 = G__20430;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__20431 = (fi_20387 + (1));
fi_20387 = G__20431;
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
var n__5636__auto___20432 = (6);
var ci_20433 = (0);
while(true){
if((ci_20433 < n__5636__auto___20432)){
var inst_20434 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(ci_20433);
if(cljs.core.truth_(inst_20434)){
var i32_20435 = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_20434);
var total_20436 = Atomics.load(i32_20435,((8) / (4)));
var free_20437 = Atomics.load(i32_20435,((12) / (4)));
stats.push([ci_20433,(cljs_thread.eve.deftype_proto.data.SLAB_SIZES[ci_20433]),total_20436,(total_20436 - free_20437),free_20437]);
} else {
}

var G__20438 = (ci_20433 + (1));
ci_20433 = G__20438;
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
var n__5636__auto___20440 = stats.length;
var i_20441 = (0);
while(true){
if((i_20441 < n__5636__auto___20440)){
var s_20442 = (stats[i_20441]);
parts.push(["S",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20442[(0)])),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20442[(3)])),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_20442[(2)]))].join(''));

var G__20443 = (i_20441 + (1));
i_20441 = G__20443;
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
var class_idx_20444 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_20445 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double allocation! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20444)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20445),")"," is already in-use!"].join('')));
} else {
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.add(offset);

var class_idx_20448 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_20448 < (8))){
(cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_20448] = ((cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_20448]) + (1)));
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
var class_idx_20449 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_20450 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double recycle! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_20449)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_20450),")"," was NOT in-use!"].join('')));
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.delete(offset);

var class_idx_20451 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_20451 < (8))){
(cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_20451] = ((cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_20451]) + (1)));
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
