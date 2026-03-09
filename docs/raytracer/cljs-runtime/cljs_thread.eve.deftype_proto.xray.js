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
var G__24895 = (v & (v - (1)));
var G__24896 = (c + (1));
v = G__24895;
c = G__24896;
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
var G__24897 = (i + (1));
var G__24898 = (allocated + pc);
i = G__24897;
allocated = G__24898;
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
var n__5636__auto___24899 = width;
var c_24901 = (0);
while(true){
if((c_24901 < n__5636__auto___24899)){
var start_block_24902 = (c_24901 * blocks_per_col);
var end_block_24903 = (function (){var x__5133__auto__ = total_blocks;
var y__5134__auto__ = ((c_24901 + (1)) * blocks_per_col);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var span_24904 = (end_block_24903 - start_block_24902);
if((span_24904 === (0))){
(bar[c_24901] = " ");
} else {
var alloc_count_24906 = (function (){var b = start_block_24902;
var acc = (0);
while(true){
if((b >= end_block_24903)){
return acc;
} else {
var word_idx = (b >>> (5));
var bit_pos = (b & (31));
var word = Atomics.load(i32_view,(bm_int32_offset + word_idx));
var set_QMARK_ = (!(((word & ((1) << bit_pos)) === (0))));
var G__24911 = (b + (1));
var G__24912 = ((set_QMARK_)?(acc + (1)):acc);
b = G__24911;
acc = G__24912;
continue;
}
break;
}
})();
var ratio_24907 = (alloc_count_24906 / span_24904);
(bar[c_24901] = (((alloc_count_24906 === span_24904))?"A":(((alloc_count_24906 === (0)))?"F":(((ratio_24907 > 0.75))?"a":(((ratio_24907 < 0.25))?"f":"."
)))));
}

var G__24914 = (c_24901 + (1));
c_24901 = G__24914;
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

var expected_data_offset_24926 = (bitmap_offset + expected_bitmap_size);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(data_offset,expected_data_offset_24926)){
errors.push([class_idx,(7),["Data offset: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_offset)," expected ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(expected_data_offset_24926)].join('')]);
} else {
}

var min_size_24929 = (data_offset + (total_blocks * block_size));
if((buf_size < min_size_24929)){
errors.push([class_idx,(8),["SAB too small: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(buf_size)," need ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(min_size_24929)].join('')]);
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
var n__5636__auto___24935 = (256);
var slot_idx_24937 = (0);
while(true){
if((slot_idx_24937 < n__5636__auto___24935)){
var slot_byte_offset_24938 = (cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx_24937 * (24)));
var w_status_24939 = Atomics.load(i32,(slot_byte_offset_24938 / (4)));
var w_epoch_24940 = Atomics.load(i32,((slot_byte_offset_24938 + (4)) / (4)));
var w_id_24941 = Atomics.load(i32,((slot_byte_offset_24938 + (16)) / (4)));
if((w_status_24939 === (1))){
worker_info.push([slot_idx_24937,w_id_24941,w_epoch_24940]);

if((((w_epoch_24940 > (0))) && ((w_epoch_24940 > epoch)))){
errors.push([(13),["Worker slot ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(slot_idx_24937)," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(w_epoch_24940)," > global=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch)].join('')]);
} else {
}
} else {
}

var G__24942 = (slot_idx_24937 + (1));
slot_idx_24937 = G__24942;
continue;
} else {
}
break;
}

if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_ptr,(-1))))){
var class_idx_24943 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr);
var block_idx_24944 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr);
if((class_idx_24943 < (6))){
var inst_24945 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx_24943);
if(cljs.core.truth_(inst_24945)){
var bm_offset_24946 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_24945),((24) / (4)));
var bm_int32_offset_24947 = (bm_offset_24946 >>> (2));
var word_idx_24948 = (block_idx_24944 >>> (5));
var bit_pos_24949 = (block_idx_24944 & (31));
var word_24950 = Atomics.load(new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_24945),(bm_int32_offset_24947 + word_idx_24948));
var allocated_QMARK__24951 = (!(((word_24950 & ((1) << bit_pos_24949)) === (0))));
if(allocated_QMARK__24951){
} else {
errors.push([(14),["Root ptr class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_24943)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_24944)," NOT allocated in bitmap"].join('')]);
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

var n__5636__auto___24966 = (6);
var ci_24967 = (0);
while(true){
if((ci_24967 < n__5636__auto___24966)){
var result_24968 = cljs_thread.eve.deftype_proto.xray.scan_slab_class(ci_24967,bar_width);
slab_results.push(result_24968);

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_24968))){
} else {
var seq__24574_24972 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_24968));
var chunk__24575_24973 = null;
var count__24576_24974 = (0);
var i__24577_24975 = (0);
while(true){
if((i__24577_24975 < count__24576_24974)){
var e_24976 = chunk__24575_24973.cljs$core$IIndexed$_nth$arity$2(null, i__24577_24975);
all_errors.push(e_24976);


var G__24977 = seq__24574_24972;
var G__24978 = chunk__24575_24973;
var G__24979 = count__24576_24974;
var G__24980 = (i__24577_24975 + (1));
seq__24574_24972 = G__24977;
chunk__24575_24973 = G__24978;
count__24576_24974 = G__24979;
i__24577_24975 = G__24980;
continue;
} else {
var temp__5823__auto___24986 = cljs.core.seq(seq__24574_24972);
if(temp__5823__auto___24986){
var seq__24574_24987__$1 = temp__5823__auto___24986;
if(cljs.core.chunked_seq_QMARK_(seq__24574_24987__$1)){
var c__5568__auto___24988 = cljs.core.chunk_first(seq__24574_24987__$1);
var G__24992 = cljs.core.chunk_rest(seq__24574_24987__$1);
var G__24993 = c__5568__auto___24988;
var G__24994 = cljs.core.count(c__5568__auto___24988);
var G__24995 = (0);
seq__24574_24972 = G__24992;
chunk__24575_24973 = G__24993;
count__24576_24974 = G__24994;
i__24577_24975 = G__24995;
continue;
} else {
var e_24996 = cljs.core.first(seq__24574_24987__$1);
all_errors.push(e_24996);


var G__25002 = cljs.core.next(seq__24574_24987__$1);
var G__25003 = null;
var G__25004 = (0);
var G__25005 = (0);
seq__24574_24972 = G__25002;
chunk__24575_24973 = G__25003;
count__24576_24974 = G__25004;
i__24577_24975 = G__25005;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___25006 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(result_24968);
if(cljs.core.truth_(temp__5823__auto___25006)){
var stats_25007 = temp__5823__auto___25006;
var map__24588_25008 = stats_25007;
var map__24588_25009__$1 = cljs.core.__destructure_map(map__24588_25008);
var block_size_25010 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"block-size","block-size",-1062272384));
var total_blocks_25011 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763));
var bitmap_allocated_25012 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"bitmap-allocated","bitmap-allocated",1875511612));
var bitmap_free_25013 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"bitmap-free","bitmap-free",1369917211));
var header_free_count_25014 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"header-free-count","header-free-count",1771971162));
var alloc_cursor_25015 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24588_25009__$1,new cljs.core.Keyword(null,"alloc-cursor","alloc-cursor",387943531));
var pct_25016 = (((total_blocks_25011 > (0)))?Math.round(((100) * (bitmap_allocated_25012 / total_blocks_25011))):(0));
pr_BANG_(["  SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_24967)," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_size_25010),"B)"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_blocks_25011)," blk"," | alloc=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_allocated_25012)," free=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(bitmap_free_25013)," (hdr=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_free_count_25014),")"," | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(pct_25016),"% | cur=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alloc_cursor_25015)].join(''));

if(cljs.core.truth_(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_24968))){
pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"bitmap-bar","bitmap-bar",-1397315210).cljs$core$IFn$_invoke$arity$1(result_24968)),"|"].join(''));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result_24968))){
} else {
pr_BANG_(["  !! SLAB ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ci_24967)," ERRORS:"].join(''));
}

var seq__24596_25017 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result_24968));
var chunk__24597_25018 = null;
var count__24598_25019 = (0);
var i__24599_25020 = (0);
while(true){
if((i__24599_25020 < count__24598_25019)){
var e_25021 = chunk__24597_25018.cljs$core$IIndexed$_nth$arity$2(null, i__24599_25020);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_25021)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_25021))].join(''));


var G__25025 = seq__24596_25017;
var G__25026 = chunk__24597_25018;
var G__25027 = count__24598_25019;
var G__25028 = (i__24599_25020 + (1));
seq__24596_25017 = G__25025;
chunk__24597_25018 = G__25026;
count__24598_25019 = G__25027;
i__24599_25020 = G__25028;
continue;
} else {
var temp__5823__auto___25029__$1 = cljs.core.seq(seq__24596_25017);
if(temp__5823__auto___25029__$1){
var seq__24596_25030__$1 = temp__5823__auto___25029__$1;
if(cljs.core.chunked_seq_QMARK_(seq__24596_25030__$1)){
var c__5568__auto___25031 = cljs.core.chunk_first(seq__24596_25030__$1);
var G__25032 = cljs.core.chunk_rest(seq__24596_25030__$1);
var G__25033 = c__5568__auto___25031;
var G__25034 = cljs.core.count(c__5568__auto___25031);
var G__25035 = (0);
seq__24596_25017 = G__25032;
chunk__24597_25018 = G__25033;
count__24598_25019 = G__25034;
i__24599_25020 = G__25035;
continue;
} else {
var e_25036 = cljs.core.first(seq__24596_25030__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_25036)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_25036))].join(''));


var G__25037 = cljs.core.next(seq__24596_25030__$1);
var G__25038 = null;
var G__25039 = (0);
var G__25040 = (0);
seq__24596_25017 = G__25037;
chunk__24597_25018 = G__25038;
count__24598_25019 = G__25039;
i__24599_25020 = G__25040;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__25044 = (ci_24967 + (1));
ci_24967 = G__25044;
continue;
} else {
}
break;
}

var root_result = cljs_thread.eve.deftype_proto.xray.scan_root_sab();
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(root_result))){
} else {
var seq__24636_25045 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__24637_25046 = null;
var count__24638_25047 = (0);
var i__24639_25048 = (0);
while(true){
if((i__24639_25048 < count__24638_25047)){
var e_25049 = chunk__24637_25046.cljs$core$IIndexed$_nth$arity$2(null, i__24639_25048);
all_errors.push(e_25049);


var G__25050 = seq__24636_25045;
var G__25051 = chunk__24637_25046;
var G__25052 = count__24638_25047;
var G__25053 = (i__24639_25048 + (1));
seq__24636_25045 = G__25050;
chunk__24637_25046 = G__25051;
count__24638_25047 = G__25052;
i__24639_25048 = G__25053;
continue;
} else {
var temp__5823__auto___25054 = cljs.core.seq(seq__24636_25045);
if(temp__5823__auto___25054){
var seq__24636_25055__$1 = temp__5823__auto___25054;
if(cljs.core.chunked_seq_QMARK_(seq__24636_25055__$1)){
var c__5568__auto___25056 = cljs.core.chunk_first(seq__24636_25055__$1);
var G__25057 = cljs.core.chunk_rest(seq__24636_25055__$1);
var G__25058 = c__5568__auto___25056;
var G__25059 = cljs.core.count(c__5568__auto___25056);
var G__25060 = (0);
seq__24636_25045 = G__25057;
chunk__24637_25046 = G__25058;
count__24638_25047 = G__25059;
i__24639_25048 = G__25060;
continue;
} else {
var e_25061 = cljs.core.first(seq__24636_25055__$1);
all_errors.push(e_25061);


var G__25062 = cljs.core.next(seq__24636_25055__$1);
var G__25063 = null;
var G__25064 = (0);
var G__25065 = (0);
seq__24636_25045 = G__25062;
chunk__24637_25046 = G__25063;
count__24638_25047 = G__25064;
i__24639_25048 = G__25065;
continue;
}
} else {
}
}
break;
}
}

var temp__5823__auto___25066 = new cljs.core.Keyword(null,"stats","stats",-85643011).cljs$core$IFn$_invoke$arity$1(root_result);
if(cljs.core.truth_(temp__5823__auto___25066)){
var stats_25067 = temp__5823__auto___25066;
var map__24659_25068 = stats_25067;
var map__24659_25069__$1 = cljs.core.__destructure_map(map__24659_25068);
var root_ptr_25070 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24659_25069__$1,new cljs.core.Keyword(null,"root-ptr","root-ptr",1411033947));
var epoch_25071 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24659_25069__$1,new cljs.core.Keyword(null,"epoch","epoch",1435633666));
var active_workers_25072 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24659_25069__$1,new cljs.core.Keyword(null,"active-workers","active-workers",1822846782));
var workers_25073 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24659_25069__$1,new cljs.core.Keyword(null,"workers","workers",-2054878819));
pr_BANG_(["  ROOT: ptr=",(((((root_ptr_25070 === (-1))) || ((root_ptr_25070 === (-1)))))?"NIL":["class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_class_idx(root_ptr_25070))," blk=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.alloc.decode_block_idx(root_ptr_25070))].join(''))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_25071)," workers=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(active_workers_25072)].join(''));

var seq__24668_25074 = cljs.core.seq(workers_25073);
var chunk__24669_25075 = null;
var count__24670_25076 = (0);
var i__24671_25077 = (0);
while(true){
if((i__24671_25077 < count__24670_25076)){
var w_25078 = chunk__24669_25075.cljs$core$IIndexed$_nth$arity$2(null, i__24671_25077);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_25078)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_25078))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_25078))].join(''));


var G__25079 = seq__24668_25074;
var G__25080 = chunk__24669_25075;
var G__25081 = count__24670_25076;
var G__25082 = (i__24671_25077 + (1));
seq__24668_25074 = G__25079;
chunk__24669_25075 = G__25080;
count__24670_25076 = G__25081;
i__24671_25077 = G__25082;
continue;
} else {
var temp__5823__auto___25084__$1 = cljs.core.seq(seq__24668_25074);
if(temp__5823__auto___25084__$1){
var seq__24668_25086__$1 = temp__5823__auto___25084__$1;
if(cljs.core.chunked_seq_QMARK_(seq__24668_25086__$1)){
var c__5568__auto___25087 = cljs.core.chunk_first(seq__24668_25086__$1);
var G__25088 = cljs.core.chunk_rest(seq__24668_25086__$1);
var G__25089 = c__5568__auto___25087;
var G__25090 = cljs.core.count(c__5568__auto___25087);
var G__25091 = (0);
seq__24668_25074 = G__25088;
chunk__24669_25075 = G__25089;
count__24670_25076 = G__25090;
i__24671_25077 = G__25091;
continue;
} else {
var w_25092 = cljs.core.first(seq__24668_25086__$1);
pr_BANG_(["    worker[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"slot","slot",240229571).cljs$core$IFn$_invoke$arity$1(w_25092)),"] id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(w_25092))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"epoch","epoch",1435633666).cljs$core$IFn$_invoke$arity$1(w_25092))].join(''));


var G__25093 = cljs.core.next(seq__24668_25086__$1);
var G__25094 = null;
var G__25095 = (0);
var G__25096 = (0);
seq__24668_25074 = G__25093;
chunk__24669_25075 = G__25094;
count__24670_25076 = G__25095;
i__24671_25077 = G__25096;
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

var seq__24695_25097 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(root_result));
var chunk__24696_25098 = null;
var count__24697_25099 = (0);
var i__24698_25100 = (0);
while(true){
if((i__24698_25100 < count__24697_25099)){
var e_25101 = chunk__24696_25098.cljs$core$IIndexed$_nth$arity$2(null, i__24698_25100);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_25101)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_25101))].join(''));


var G__25106 = seq__24695_25097;
var G__25107 = chunk__24696_25098;
var G__25108 = count__24697_25099;
var G__25109 = (i__24698_25100 + (1));
seq__24695_25097 = G__25106;
chunk__24696_25098 = G__25107;
count__24697_25099 = G__25108;
i__24698_25100 = G__25109;
continue;
} else {
var temp__5823__auto___25110 = cljs.core.seq(seq__24695_25097);
if(temp__5823__auto___25110){
var seq__24695_25111__$1 = temp__5823__auto___25110;
if(cljs.core.chunked_seq_QMARK_(seq__24695_25111__$1)){
var c__5568__auto___25112 = cljs.core.chunk_first(seq__24695_25111__$1);
var G__25113 = cljs.core.chunk_rest(seq__24695_25111__$1);
var G__25114 = c__5568__auto___25112;
var G__25115 = cljs.core.count(c__5568__auto___25112);
var G__25116 = (0);
seq__24695_25097 = G__25113;
chunk__24696_25098 = G__25114;
count__24697_25099 = G__25115;
i__24698_25100 = G__25116;
continue;
} else {
var e_25117 = cljs.core.first(seq__24695_25111__$1);
pr_BANG_(["    [INV",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"invariant","invariant",-1658446508).cljs$core$IFn$_invoke$arity$1(e_25117)),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"msg","msg",-1386103444).cljs$core$IFn$_invoke$arity$1(e_25117))].join(''));


var G__25118 = cljs.core.next(seq__24695_25111__$1);
var G__25119 = null;
var G__25120 = (0);
var G__25121 = (0);
seq__24695_25097 = G__25118;
chunk__24696_25098 = G__25119;
count__24697_25099 = G__25120;
i__24698_25100 = G__25121;
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

var seq__24727_25125 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines));
var chunk__24728_25126 = null;
var count__24729_25127 = (0);
var i__24730_25128 = (0);
while(true){
if((i__24730_25128 < count__24729_25127)){
var line_25130 = chunk__24728_25126.cljs$core$IIndexed$_nth$arity$2(null, i__24730_25128);
console.log(line_25130);


var G__25131 = seq__24727_25125;
var G__25132 = chunk__24728_25126;
var G__25133 = count__24729_25127;
var G__25134 = (i__24730_25128 + (1));
seq__24727_25125 = G__25131;
chunk__24728_25126 = G__25132;
count__24729_25127 = G__25133;
i__24730_25128 = G__25134;
continue;
} else {
var temp__5823__auto___25135 = cljs.core.seq(seq__24727_25125);
if(temp__5823__auto___25135){
var seq__24727_25136__$1 = temp__5823__auto___25135;
if(cljs.core.chunked_seq_QMARK_(seq__24727_25136__$1)){
var c__5568__auto___25137 = cljs.core.chunk_first(seq__24727_25136__$1);
var G__25141 = cljs.core.chunk_rest(seq__24727_25136__$1);
var G__25142 = c__5568__auto___25137;
var G__25143 = cljs.core.count(c__5568__auto___25137);
var G__25144 = (0);
seq__24727_25125 = G__25141;
chunk__24728_25126 = G__25142;
count__24729_25127 = G__25143;
i__24730_25128 = G__25144;
continue;
} else {
var line_25145 = cljs.core.first(seq__24727_25136__$1);
console.log(line_25145);


var G__25146 = cljs.core.next(seq__24727_25136__$1);
var G__25147 = null;
var G__25148 = (0);
var G__25149 = (0);
seq__24727_25125 = G__25146;
chunk__24728_25126 = G__25147;
count__24729_25127 = G__25148;
i__24730_25128 = G__25149;
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

var n__5636__auto___25158 = cljs_thread.eve.deftype_proto.xray.trace_frames.length;
var fi_25159 = (0);
while(true){
if((fi_25159 < n__5636__auto___25158)){
var f_25160 = (cljs_thread.eve.deftype_proto.xray.trace_frames[fi_25159]);
console.log(["\n\u2501\u2501\u2501 Frame ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((fi_25159 + (1))),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.deftype_proto.xray.trace_frames.length)," [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_25160)),"]",(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f_25160))?" PASS":" !! FAIL !!")," \u2501\u2501\u2501"].join(''));

var seq__24755_25161 = cljs.core.seq(new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f_25160));
var chunk__24756_25162 = null;
var count__24757_25163 = (0);
var i__24758_25164 = (0);
while(true){
if((i__24758_25164 < count__24757_25163)){
var line_25165 = chunk__24756_25162.cljs$core$IIndexed$_nth$arity$2(null, i__24758_25164);
console.log(line_25165);


var G__25166 = seq__24755_25161;
var G__25167 = chunk__24756_25162;
var G__25168 = count__24757_25163;
var G__25169 = (i__24758_25164 + (1));
seq__24755_25161 = G__25166;
chunk__24756_25162 = G__25167;
count__24757_25163 = G__25168;
i__24758_25164 = G__25169;
continue;
} else {
var temp__5823__auto___25170 = cljs.core.seq(seq__24755_25161);
if(temp__5823__auto___25170){
var seq__24755_25171__$1 = temp__5823__auto___25170;
if(cljs.core.chunked_seq_QMARK_(seq__24755_25171__$1)){
var c__5568__auto___25172 = cljs.core.chunk_first(seq__24755_25171__$1);
var G__25173 = cljs.core.chunk_rest(seq__24755_25171__$1);
var G__25174 = c__5568__auto___25172;
var G__25175 = cljs.core.count(c__5568__auto___25172);
var G__25176 = (0);
seq__24755_25161 = G__25173;
chunk__24756_25162 = G__25174;
count__24757_25163 = G__25175;
i__24758_25164 = G__25176;
continue;
} else {
var line_25177 = cljs.core.first(seq__24755_25171__$1);
console.log(line_25177);


var G__25178 = cljs.core.next(seq__24755_25171__$1);
var G__25179 = null;
var G__25180 = (0);
var G__25181 = (0);
seq__24755_25161 = G__25178;
chunk__24756_25162 = G__25179;
count__24757_25163 = G__25180;
i__24758_25164 = G__25181;
continue;
}
} else {
}
}
break;
}

if(cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_25160))){
console.log("  ERRORS:");

var seq__24766_25182 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(f_25160));
var chunk__24767_25183 = null;
var count__24768_25184 = (0);
var i__24769_25185 = (0);
while(true){
if((i__24769_25185 < count__24768_25184)){
var e_25186 = chunk__24767_25183.cljs$core$IIndexed$_nth$arity$2(null, i__24769_25185);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_25186)].join(''));


var G__25187 = seq__24766_25182;
var G__25188 = chunk__24767_25183;
var G__25189 = count__24768_25184;
var G__25190 = (i__24769_25185 + (1));
seq__24766_25182 = G__25187;
chunk__24767_25183 = G__25188;
count__24768_25184 = G__25189;
i__24769_25185 = G__25190;
continue;
} else {
var temp__5823__auto___25191 = cljs.core.seq(seq__24766_25182);
if(temp__5823__auto___25191){
var seq__24766_25192__$1 = temp__5823__auto___25191;
if(cljs.core.chunked_seq_QMARK_(seq__24766_25192__$1)){
var c__5568__auto___25193 = cljs.core.chunk_first(seq__24766_25192__$1);
var G__25194 = cljs.core.chunk_rest(seq__24766_25192__$1);
var G__25195 = c__5568__auto___25193;
var G__25196 = cljs.core.count(c__5568__auto___25193);
var G__25197 = (0);
seq__24766_25182 = G__25194;
chunk__24767_25183 = G__25195;
count__24768_25184 = G__25196;
i__24769_25185 = G__25197;
continue;
} else {
var e_25198 = cljs.core.first(seq__24766_25192__$1);
console.log(["    ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_25198)].join(''));


var G__25199 = cljs.core.next(seq__24766_25192__$1);
var G__25200 = null;
var G__25201 = (0);
var G__25202 = (0);
seq__24766_25182 = G__25199;
chunk__24767_25183 = G__25200;
count__24768_25184 = G__25201;
i__24769_25185 = G__25202;
continue;
}
} else {
}
}
break;
}
} else {
}

var G__25203 = (fi_25159 + (1));
fi_25159 = G__25203;
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
var n__5636__auto___25211 = (6);
var ci_25212 = (0);
while(true){
if((ci_25212 < n__5636__auto___25211)){
var inst_25214 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(ci_25212);
if(cljs.core.truth_(inst_25214)){
var i32_25220 = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_25214);
var total_25221 = Atomics.load(i32_25220,((8) / (4)));
var free_25222 = Atomics.load(i32_25220,((12) / (4)));
stats.push([ci_25212,(cljs_thread.eve.deftype_proto.data.SLAB_SIZES[ci_25212]),total_25221,(total_25221 - free_25222),free_25222]);
} else {
}

var G__25223 = (ci_25212 + (1));
ci_25212 = G__25223;
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
var n__5636__auto___25224 = stats.length;
var i_25225 = (0);
while(true){
if((i_25225 < n__5636__auto___25224)){
var s_25226 = (stats[i_25225]);
parts.push(["S",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_25226[(0)])),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_25226[(3)])),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1((s_25226[(2)]))].join(''));

var G__25227 = (i_25225 + (1));
i_25225 = G__25227;
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
 */
cljs_thread.eve.deftype_proto.xray.enable_pool_tracking_BANG_ = (function cljs_thread$eve$deftype_proto$xray$enable_pool_tracking_BANG_(){
if(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS){
cljs_thread.eve.deftype_proto.xray.in_use_offsets.clear();

cljs_thread.eve.deftype_proto.xray.alloc_counts.fill((0));

cljs_thread.eve.deftype_proto.xray.recycle_counts.fill((0));

(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_ = true);

return console.log("[X-RAY] Pool tracking ENABLED");
} else {
return null;
}
});
/**
 * Disable pool offset tracking.
 */
cljs_thread.eve.deftype_proto.xray.disable_pool_tracking_BANG_ = (function cljs_thread$eve$deftype_proto$xray$disable_pool_tracking_BANG_(){
(cljs_thread.eve.deftype_proto.xray.pool_track_enabled_QMARK_ = false);

cljs_thread.eve.deftype_proto.xray.in_use_offsets.clear();

return console.log("[X-RAY] Pool tracking DISABLED");
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
var class_idx_25239 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_25240 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double allocation! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_25239)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_25240),")"," is already in-use!"].join('')));
} else {
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.add(offset);

var class_idx_25241 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_25241 < (8))){
(cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_25241] = ((cljs_thread.eve.deftype_proto.xray.alloc_counts[class_idx_25241]) + (1)));
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
var class_idx_25242 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
var block_idx_25243 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(offset);
throw (new Error(["[X-RAY POOL] Double recycle! offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(offset)," (class=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_idx_25242)," block=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(block_idx_25243),")"," was NOT in-use!"].join('')));
}

cljs_thread.eve.deftype_proto.xray.in_use_offsets.delete(offset);

var class_idx_25246 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(offset);
if((class_idx_25246 < (8))){
(cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_25246] = ((cljs_thread.eve.deftype_proto.xray.recycle_counts[class_idx_25246]) + (1)));
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
