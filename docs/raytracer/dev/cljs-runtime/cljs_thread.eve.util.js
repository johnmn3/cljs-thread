goog.provide('cljs_thread.eve.util');
cljs_thread.eve.util.wt_module = (((((typeof process !== 'undefined')) && ((typeof require !== 'undefined'))))?(function (){try{return require("worker_threads");
}catch (e21824){var _ = e21824;
return null;
}})():null);
cljs_thread.eve.util.raw_worker_data = (cljs.core.truth_(cljs_thread.eve.util.wt_module)?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.eve.util.wt_module.workerData,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):null);
cljs_thread.eve.util.raw_parent_port = (cljs.core.truth_(cljs_thread.eve.util.wt_module)?cljs_thread.eve.util.wt_module.parentPort:null);
cljs_thread.eve.util.is_main_thread_QMARK_ = (cljs.core.truth_(cljs_thread.eve.util.wt_module)?cljs_thread.eve.util.wt_module.isMainThread:(((((typeof Window !== 'undefined')) && ((self instanceof Window))))?true:false
));
/**
 * CPU-friendly yield/sleep.  On workers, uses Atomics.wait on a throwaway
 * SharedArrayBuffer.  On the browser main thread Atomics.wait is forbidden
 * by the spec, so this is a no-op (the waits are sub-ms yields anyway).
 */
cljs_thread.eve.util.yield_cpu = (function cljs_thread$eve$util$yield_cpu(var_args){
var G__21832 = arguments.length;
switch (G__21832) {
case 0:
return cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1((0));
}));

(cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1 = (function (ms){
if(cljs.core.truth_(cljs_thread.eve.util.is_main_thread_QMARK_)){
return null;
} else {
var s = (new SharedArrayBuffer((4)));
var v = (new Int32Array(s));
Atomics.store(v,(0),(0));

return Atomics.wait(v,(0),(0),ms);
}
}));

(cljs_thread.eve.util.yield_cpu.cljs$lang$maxFixedArity = 1);

cljs_thread.eve.util.log_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
cljs_thread.eve.util.log = (function cljs_thread$eve$util$log(var_args){
var G__21848 = arguments.length;
switch (G__21848) {
case 1:
return cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
var args_arr__5794__auto__ = [];
var len__5769__auto___22098 = arguments.length;
var i__5770__auto___22099 = (0);
while(true){
if((i__5770__auto___22099 < len__5769__auto___22098)){
args_arr__5794__auto__.push((arguments[i__5770__auto___22099]));

var G__22103 = (i__5770__auto___22099 + (1));
i__5770__auto___22099 = G__22103;
continue;
} else {
}
break;
}

var argseq__5795__auto__ = (new cljs.core.IndexedSeq(args_arr__5794__auto__.slice((1)),(0),null));
return cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5795__auto__);

}
});

(cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1 = (function (args){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.eve.util.log_QMARK_))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"log","log",-1595516004),args], 0));
} else {
}

return args;
}));

(cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic = (function (msg,args){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.eve.util.log_QMARK_))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"log","log",-1595516004),msg,cljs.core.vec(args)], 0));
} else {
}

return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [msg], null),args);
}));

/** @this {Function} */
(cljs_thread.eve.util.log.cljs$lang$applyTo = (function (seq21846){
var G__21847 = cljs.core.first(seq21846);
var seq21846__$1 = cljs.core.next(seq21846);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21847,seq21846__$1);
}));

(cljs_thread.eve.util.log.cljs$lang$maxFixedArity = (1));

cljs_thread.eve.util.typed_array_QMARK_ = (function cljs_thread$eve$util$typed_array_QMARK_(x){
var and__5043__auto__ = (!((x == null)));
if(and__5043__auto__){
var and__5043__auto____$1 = ArrayBuffer.isView(x);
if(cljs.core.truth_(and__5043__auto____$1)){
return (!((x instanceof DataView)));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
});
cljs_thread.eve.util.atomic_load_int = (function cljs_thread$eve$util$atomic_load_int(ta_view,idx){
if(cljs.core.truth_((function (){var or__5045__auto__ = (idx < (0));
if(or__5045__auto__){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = (idx >= ta_view.length);
if(or__5045__auto____$1){
return or__5045__auto____$1;
} else {
return isNaN(idx);
}
}
})())){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[DEBUG] atomic-load-int: INVALID INDEX!","idx:",idx,"array-length:",ta_view.length,"isNaN:",isNaN(idx)], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[DEBUG] Stack trace:",(new Error("Stack trace")).stack], 0));
} else {
}

try{return Atomics.load(ta_view,idx);
}catch (e21867){if((e21867 instanceof Error)){
var e = e21867;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[DEBUG] atomic-load-int ERROR:",e.message,"idx:",idx,"array-length:",ta_view.length], 0));

throw e;
} else {
throw e21867;

}
}});
cljs_thread.eve.util.atomic_store_int = (function cljs_thread$eve$util$atomic_store_int(ta_view,idx,val){
return Atomics.store(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_add_int = (function cljs_thread$eve$util$atomic_add_int(ta_view,idx,val){
return Atomics.add(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_sub_int = (function cljs_thread$eve$util$atomic_sub_int(ta_view,idx,val){
return Atomics.sub(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_compare_exchange_int = (function cljs_thread$eve$util$atomic_compare_exchange_int(ta_view,idx,expected,replacement){
return Atomics.compareExchange(ta_view,idx,expected,replacement);
});
cljs_thread.eve.util.atomic_compare_and_swap = (function cljs_thread$eve$util$atomic_compare_and_swap(ta_view,idx,expected,replacement){
var n = (1000);
while(true){
var current_value = Atomics.compareExchange(ta_view,idx,expected,replacement);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_value,expected)){
return true;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_value,replacement)){
return false;
} else {
if((n === (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["CAS failed after 1000 attempts. Exiting."], 0));

return false;
} else {
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$0();

var G__22121 = (n - (1));
n = G__22121;
continue;
}
}
}
break;
}
});
cljs_thread.eve.util.cas = (function cljs_thread$eve$util$cas(ta_view,idx,afn){
var expected = Atomics.load(ta_view,idx);
var replacement = (afn.cljs$core$IFn$_invoke$arity$1 ? afn.cljs$core$IFn$_invoke$arity$1(expected) : afn.call(null, expected));
var success = cljs_thread.eve.util.atomic_compare_and_swap(ta_view,idx,expected,replacement);
if(success){
return replacement;
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["CAS failed. looping."], 0));

cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$0();

return (cljs_thread.eve.util.cas.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.util.cas.cljs$core$IFn$_invoke$arity$3(ta_view,idx,afn) : cljs_thread.eve.util.cas.call(null, ta_view,idx,afn));
}
});
cljs_thread.eve.util.atomic_load_bigint = (function cljs_thread$eve$util$atomic_load_bigint(ta_view,idx){
return Atomics.load(ta_view,idx);
});
cljs_thread.eve.util.atomic_store_bigint = (function cljs_thread$eve$util$atomic_store_bigint(ta_view,idx,val){
return Atomics.store(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_add_bigint = (function cljs_thread$eve$util$atomic_add_bigint(ta_view,idx,val){
return Atomics.add(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_sub_bigint = (function cljs_thread$eve$util$atomic_sub_bigint(ta_view,idx,val){
return Atomics.sub(ta_view,idx,val);
});
cljs_thread.eve.util.atomic_compare_exchange_bigint = (function cljs_thread$eve$util$atomic_compare_exchange_bigint(ta_view,idx,expected,replacement){
return Atomics.compareExchange(ta_view,idx,expected,replacement);
});
cljs_thread.eve.util.byte__GT_hex = (function cljs_thread$eve$util$byte__GT_hex(byte_val){
var hex = byte_val.toString((16));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(hex),(1))){
return ["0",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex)].join('');
} else {
return hex;
}
});
/**
 * Display a hex dump of a buffer or typed array view.
 */
cljs_thread.eve.util.hex_window = (function cljs_thread$eve$util$hex_window(var_args){
var args__5775__auto__ = [];
var len__5769__auto___22129 = arguments.length;
var i__5770__auto___22130 = (0);
while(true){
if((i__5770__auto___22130 < len__5769__auto___22129)){
args__5775__auto__.push((arguments[i__5770__auto___22130]));

var G__22134 = (i__5770__auto___22130 + (1));
i__5770__auto___22130 = G__22134;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic = (function (buffer_or_view,p__21902){
var map__21903 = p__21902;
var map__21903__$1 = cljs.core.__destructure_map(map__21903);
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21903__$1,new cljs.core.Keyword(null,"offset","offset",296498311),(0));
var length = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21903__$1,new cljs.core.Keyword(null,"length","length",588987862));
var bytes_per_row = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21903__$1,new cljs.core.Keyword(null,"bytes-per-row","bytes-per-row",-145207552),(16));
var title = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21903__$1,new cljs.core.Keyword(null,"title","title",636505583));
if((((buffer_or_view instanceof ArrayBuffer)) || ((((buffer_or_view instanceof SharedArrayBuffer)) || ((((!((buffer_or_view == null)))) && ((!((buffer_or_view.buffer == null)))))))))){
} else {
throw (new Error(["hex-window: First argument must be an ArrayBuffer or a TypedArray view. Got: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type(buffer_or_view))].join('')));
}

var source_buffer = (((((buffer_or_view instanceof SharedArrayBuffer)) || ((buffer_or_view instanceof ArrayBuffer))))?buffer_or_view:buffer_or_view.buffer);
var view_byte_offset = (((((buffer_or_view instanceof SharedArrayBuffer)) || ((buffer_or_view instanceof ArrayBuffer))))?offset:((function (){var or__5045__auto__ = buffer_or_view.byteOffset;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})() + offset));
var buffer_total_length = source_buffer.byteLength;
var max_possible_length_from_offset = (buffer_total_length - view_byte_offset);
var requested_display_length = (cljs.core.truth_(length)?(length | (0)):max_possible_length_from_offset);
var view_intrinsic_length = (((((buffer_or_view instanceof SharedArrayBuffer)) || ((buffer_or_view instanceof ArrayBuffer))))?requested_display_length:buffer_or_view.byteLength);
var effective_display_length = (function (){var x__5133__auto__ = (function (){var x__5133__auto__ = requested_display_length;
var y__5134__auto__ = max_possible_length_from_offset;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var y__5134__auto__ = view_intrinsic_length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var effective_display_length__$1 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = effective_display_length;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var max_addr_to_display = ((view_byte_offset + effective_display_length__$1) + (-1));
if((!((title == null)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n--- Hex Window: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(title)," ---"].join('')], 0));
} else {
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["Buffer: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(buffer_total_length)," bytes, offset: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(view_byte_offset),", display: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(effective_display_length__$1)," bytes."].join('')], 0));

if((((view_byte_offset < (0))) || ((((view_byte_offset >= buffer_total_length)) || (((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(buffer_total_length,(0))) && ((view_byte_offset > (0))))) || ((effective_display_length__$1 <= (0))))))))){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Invalid offset or length for buffer."], 0));
} else {
var u8_data_view = (new Uint8Array(source_buffer,view_byte_offset,effective_display_length__$1));
var target_addr_hex_len = (function (){var x__5130__auto__ = (4);
var y__5131__auto__ = cljs.core.count(max_addr_to_display.toString((16)));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var current_idx_in_u8_view = (0);
while(true){
if((current_idx_in_u8_view < effective_display_length__$1)){
var row_start_abs_offset_22155 = (view_byte_offset + current_idx_in_u8_view);
var bytes_on_this_line_22156 = (function (){var x__5133__auto__ = bytes_per_row;
var y__5134__auto__ = (effective_display_length__$1 - current_idx_in_u8_view);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var hex_addr_raw_22157 = row_start_abs_offset_22155.toString((16));
var addr_padding_needed_22158 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = (target_addr_hex_len - cljs.core.count(hex_addr_raw_22157));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var address_str_22159 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(addr_padding_needed_22158,"0"))),cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_addr_raw_22157),": "].join('');
var hex_parts_22160 = [];
var n__5636__auto___22161 = bytes_per_row;
var i_22162 = (0);
while(true){
if((i_22162 < n__5636__auto___22161)){
if((i_22162 < bytes_on_this_line_22156)){
hex_parts_22160.push(cljs_thread.eve.util.byte__GT_hex((u8_data_view[(current_idx_in_u8_view + i_22162)])));
} else {
hex_parts_22160.push("  ");
}

var G__22165 = (i_22162 + (1));
i_22162 = G__22165;
continue;
} else {
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([[address_str_22159,cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_parts_22160.join(" "))].join('')], 0));

var G__22167 = (current_idx_in_u8_view + bytes_per_row);
current_idx_in_u8_view = G__22167;
continue;
} else {
return null;
}
break;
}
}
}));

(cljs_thread.eve.util.hex_window.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.eve.util.hex_window.cljs$lang$applyTo = (function (seq21900){
var G__21901 = cljs.core.first(seq21900);
var seq21900__$1 = cljs.core.next(seq21900);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21901,seq21900__$1);
}));

cljs_thread.eve.util.get_sab_total_size = (function cljs_thread$eve$util$get_sab_total_size(index_view){
return Atomics.load(index_view,((0) / (4)));
});
cljs_thread.eve.util.get_index_region_size = (function cljs_thread$eve$util$get_index_region_size(index_view){
return Atomics.load(index_view,((4) / (4)));
});
cljs_thread.eve.util.get_data_region_start_offset = (function cljs_thread$eve$util$get_data_region_start_offset(index_view){
return Atomics.load(index_view,((8) / (4)));
});
cljs_thread.eve.util.get_max_block_descriptors = (function cljs_thread$eve$util$get_max_block_descriptors(index_view){
return Atomics.load(index_view,((12) / (4)));
});
cljs_thread.eve.util.get_block_descriptor_base_int32_offset = (function cljs_thread$eve$util$get_block_descriptor_base_int32_offset(descriptor_idx){
var descriptors_array_start_int32_offset = (cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START / (4));
return (descriptors_array_start_int32_offset + (descriptor_idx * (cljs_thread.eve.data.SIZE_OF_BLOCK_DESCRIPTOR / (4))));
});
cljs_thread.eve.util.read_block_descriptor_field = (function cljs_thread$eve$util$read_block_descriptor_field(sab_int32_view,descriptor_idx,field_byte_offset_in_desc){
var base_int32_offset = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(descriptor_idx);
var field_int32_offset = (field_byte_offset_in_desc / (4));
var idx = (base_int32_offset + field_int32_offset);
if(cljs.core.truth_((function (){var or__5045__auto__ = (idx < (0));
if(or__5045__auto__){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = (idx >= sab_int32_view.length);
if(or__5045__auto____$1){
return or__5045__auto____$1;
} else {
return isNaN(idx);
}
}
})())){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[BUG] read-block-descriptor-field: INVALID idx=",idx,"desc-idx=",descriptor_idx,"field-off=",field_byte_offset_in_desc,"view-len=",sab_int32_view.length], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[BUG] Stack:",(new Error("")).stack], 0));
} else {
}

return Atomics.load(sab_int32_view,idx);
});
cljs_thread.eve.util.write_block_descriptor_field_BANG_ = (function cljs_thread$eve$util$write_block_descriptor_field_BANG_(sab_int32_view,descriptor_idx,field_byte_offset_in_desc,value){
var base_int32_offset = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(descriptor_idx);
var field_int32_offset = (field_byte_offset_in_desc / (4));
return Atomics.store(sab_int32_view,(base_int32_offset + field_int32_offset),value);
});
cljs_thread.eve.util.cas_block_descriptor_field_BANG_ = (function cljs_thread$eve$util$cas_block_descriptor_field_BANG_(sab_int32_view,descriptor_idx,field_byte_offset_in_desc,expected_old_value,new_value){
var base_int32_offset = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(descriptor_idx);
var field_int32_offset = (field_byte_offset_in_desc / (4));
return Atomics.compareExchange(sab_int32_view,(base_int32_offset + field_int32_offset),expected_old_value,new_value);
});
cljs_thread.eve.util.read_full_block_descriptor = (function cljs_thread$eve$util$read_full_block_descriptor(sab_int32_view,descriptor_idx){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"idx","idx",1053688473),descriptor_idx,new cljs.core.Keyword(null,"status","status",-1997798413),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(0)),new cljs.core.Keyword(null,"data-offset","data-offset",-712338495),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(4)),new cljs.core.Keyword(null,"data-length","data-length",-7158004),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(8)),new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(12)),new cljs.core.Keyword(null,"value_data_desc_idx","value_data_desc_idx",-1375791919),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(16)),new cljs.core.Keyword(null,"lock-owner","lock-owner",-1367291798),cljs_thread.eve.util.read_block_descriptor_field(sab_int32_view,descriptor_idx,(20))], null);
});
cljs_thread.eve.util.find_descriptor_for_data_offset = (function cljs_thread$eve$util$find_descriptor_for_data_offset(s_atom_env,target_data_offset){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var raw_max = cljs_thread.eve.util.get_max_block_descriptors(index_view);
var max_descriptors = (function (){var cfg_max = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(s_atom_env,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111)], null));
if(((typeof raw_max === 'number') && ((((raw_max > (0))) && ((raw_max <= (function (){var or__5045__auto__ = cfg_max;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (262144);
}
})())))))){
return raw_max;
} else {
var or__5045__auto__ = cfg_max;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (262144);
}
}
})();
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> find-descriptor: ENTER. target-offset:",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([target_data_offset,"Max Descriptors:",max_descriptors], 0));

var check_idx = (0);
while(true){
if((check_idx >= max_descriptors)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> find-descriptor: NOT FOUND for target-offset:",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([target_data_offset], 0));

return null;
} else {
var current_data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,check_idx,(4));
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,check_idx,(0));
if((current_data_offset === target_data_offset)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> find-descriptor: Found matching offset",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([target_data_offset,"at desc_idx",check_idx,"WITH STATUS",status], 0));
} else {
}

if((((current_data_offset === target_data_offset)) && ((status === (1))))){
var found_desc = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs_thread.eve.util.read_full_block_descriptor(index_view,check_idx),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825),check_idx);
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> find-descriptor: Found AND ALLOCATED for target",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([target_data_offset,"desc:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([found_desc], 0))], 0));

return found_desc;
} else {
var G__22181 = (check_idx + (1));
check_idx = G__22181;
continue;
}
}
break;
}
});
cljs_thread.eve.util.format_bytes_as_hex = (function cljs_thread$eve$util$format_bytes_as_hex(byte_array_view,max_bytes_to_show){
var str_parts = [];
var len = (cljs.core.truth_(byte_array_view)?byte_array_view.length:(0));
var display_len = (function (){var x__5133__auto__ = len;
var y__5134__auto__ = max_bytes_to_show;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var n__5636__auto___22182 = display_len;
var i_22184 = (0);
while(true){
if((i_22184 < n__5636__auto___22182)){
var byte_val_22185 = byte_array_view.at(i_22184);
var hex_22186 = byte_val_22185.toString((16));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(hex_22186.length,(1))){
str_parts.push("0");
} else {
}

str_parts.push(hex_22186);

str_parts.push(" ");

var G__22189 = (i_22184 + (1));
i_22184 = G__22189;
continue;
} else {
}
break;
}

if((len > max_bytes_to_show)){
str_parts.push("...");
} else {
}

return str_parts.join("");
});
cljs_thread.eve.util.generate_model_char_map_str = (function cljs_thread$eve$util$generate_model_char_map_str(index_view,config,max_chars_to_render){
var map__21954 = config;
var map__21954__$1 = cljs.core.__destructure_map(map__21954);
var max_block_descriptors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21954__$1,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111));
var data_region_start_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21954__$1,new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696));
var sab_total_size_bytes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21954__$1,new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283));
var data_region_size = (sab_total_size_bytes - data_region_start_offset);
var effective_render_size = (function (){var x__5133__auto__ = max_chars_to_render;
var y__5134__auto__ = data_region_size;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_js_array = (new Array(effective_render_size));
var n__5636__auto___22191 = effective_render_size;
var k_22192 = (0);
while(true){
if((k_22192 < n__5636__auto___22191)){
(char_js_array[k_22192] = ".");

var G__22193 = (k_22192 + (1));
k_22192 = G__22193;
continue;
} else {
}
break;
}

var seq__21957_22194 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$1(max_block_descriptors));
var chunk__21958_22195 = null;
var count__21959_22196 = (0);
var i__21960_22197 = (0);
while(true){
if((i__21960_22197 < count__21959_22196)){
var descriptor_idx_22198 = chunk__21958_22195.cljs$core$IIndexed$_nth$arity$2(null, i__21960_22197);
var desc_22200 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22198);
var status_22201 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22200);
var block_data_offset_22202 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22200);
var block_len_22203 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22201,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22200):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22200));
var char_to_use_22204 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22201,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22201,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22204;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22202 >= data_region_start_offset)) && ((block_data_offset_22202 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22211 = (block_data_offset_22202 - data_region_start_offset);
var end_in_char_map_22212 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22211 + block_len_22203);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22213 = start_in_char_map_22211;
while(true){
if((((char_idx_22213 >= (0))) && ((((char_idx_22213 < end_in_char_map_22212)) && ((char_idx_22213 < effective_render_size)))))){
(char_js_array[char_idx_22213] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22201,(1))) && ((char_idx_22213 > start_in_char_map_22211))))?"+":char_to_use_22204));

var G__22214 = (char_idx_22213 + (1));
char_idx_22213 = G__22214;
continue;
} else {
}
break;
}
} else {
}


var G__22215 = seq__21957_22194;
var G__22216 = chunk__21958_22195;
var G__22217 = count__21959_22196;
var G__22218 = (i__21960_22197 + (1));
seq__21957_22194 = G__22215;
chunk__21958_22195 = G__22216;
count__21959_22196 = G__22217;
i__21960_22197 = G__22218;
continue;
} else {
var temp__5823__auto___22219 = cljs.core.seq(seq__21957_22194);
if(temp__5823__auto___22219){
var seq__21957_22220__$1 = temp__5823__auto___22219;
if(cljs.core.chunked_seq_QMARK_(seq__21957_22220__$1)){
var c__5568__auto___22221 = cljs.core.chunk_first(seq__21957_22220__$1);
var G__22226 = cljs.core.chunk_rest(seq__21957_22220__$1);
var G__22227 = c__5568__auto___22221;
var G__22228 = cljs.core.count(c__5568__auto___22221);
var G__22229 = (0);
seq__21957_22194 = G__22226;
chunk__21958_22195 = G__22227;
count__21959_22196 = G__22228;
i__21960_22197 = G__22229;
continue;
} else {
var descriptor_idx_22231 = cljs.core.first(seq__21957_22220__$1);
var desc_22232 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22231);
var status_22233 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22232);
var block_data_offset_22234 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22232);
var block_len_22235 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22233,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22232):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22232));
var char_to_use_22236 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22233,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22233,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22236;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22234 >= data_region_start_offset)) && ((block_data_offset_22234 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22240 = (block_data_offset_22234 - data_region_start_offset);
var end_in_char_map_22241 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22240 + block_len_22235);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22243 = start_in_char_map_22240;
while(true){
if((((char_idx_22243 >= (0))) && ((((char_idx_22243 < end_in_char_map_22241)) && ((char_idx_22243 < effective_render_size)))))){
(char_js_array[char_idx_22243] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22233,(1))) && ((char_idx_22243 > start_in_char_map_22240))))?"+":char_to_use_22236));

var G__22244 = (char_idx_22243 + (1));
char_idx_22243 = G__22244;
continue;
} else {
}
break;
}
} else {
}


var G__22245 = cljs.core.next(seq__21957_22220__$1);
var G__22246 = null;
var G__22247 = (0);
var G__22248 = (0);
seq__21957_22194 = G__22245;
chunk__21958_22195 = G__22246;
count__21959_22196 = G__22247;
i__21960_22197 = G__22248;
continue;
}
} else {
}
}
break;
}

return char_js_array.join("");
});
cljs_thread.eve.util.format_char_data_line = (function cljs_thread$eve$util$format_char_data_line(address_str,char_map_str,offset_in_char_map,chars_on_this_line,chars_per_row){
var str_parts = [];
str_parts.push(address_str);

var n__5636__auto___22249 = chars_per_row;
var k_22250 = (0);
while(true){
if((k_22250 < n__5636__auto___22249)){
if((k_22250 < chars_on_this_line)){
var char_idx_22252 = (offset_in_char_map + k_22250);
if((char_idx_22252 < cljs.core.count(char_map_str))){
str_parts.push(char_map_str.charAt(char_idx_22252));

str_parts.push("  ");
} else {
str_parts.push("   ");
}
} else {
str_parts.push("   ");
}

var G__22256 = (k_22250 + (1));
k_22250 = G__22256;
continue;
} else {
}
break;
}

return str_parts.join("");
});
cljs_thread.eve.util.format_descriptor_value = (function cljs_thread$eve$util$format_descriptor_value(value,col_width){
var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(value);
if((((s).length) > col_width)){
return s.substring((0),col_width);
} else {
return s.padStart(col_width," ");
}
});
cljs_thread.eve.util.print_descriptor_table = (function cljs_thread$eve$util$print_descriptor_table(index_view,start_idx,num_descriptors_in_table,max_total_descriptors){
var fields = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"Status",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"status","status",-1997798413)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"Data Offset",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"data-offset","data-offset",-712338495)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"Data Length",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"data-length","data-length",-7158004)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"Block Cap",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"ValueDescIdx",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"value_data_desc_idx","value_data_desc_idx",-1375791919)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),"Lock Owner",new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword(null,"lock-owner","lock-owner",-1367291798)], null)], null);
var val_print_width = (10);
var col_spacing = "  ";
var max_label_width = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21979_SHARP_){
return cljs.core.count(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(p1__21979_SHARP_));
}),fields));
var end_idx = (function (){var x__5133__auto__ = (start_idx + num_descriptors_in_table);
var y__5134__auto__ = max_total_descriptors;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var current_descriptors = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21980_SHARP_){
return cljs_thread.eve.util.read_full_block_descriptor(index_view,p1__21980_SHARP_);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$2(start_idx,end_idx));
var header_parts_22260 = ["Desc Idx:".padEnd((max_label_width + (2))," ")];
var seq__21982_22261 = cljs.core.seq(current_descriptors);
var chunk__21983_22262 = null;
var count__21984_22263 = (0);
var i__21985_22264 = (0);
while(true){
if((i__21985_22264 < count__21984_22263)){
var desc_22265 = chunk__21983_22262.cljs$core$IIndexed$_nth$arity$2(null, i__21985_22264);
header_parts_22260.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22265),val_print_width));

header_parts_22260.push(col_spacing);


var G__22270 = seq__21982_22261;
var G__22271 = chunk__21983_22262;
var G__22272 = count__21984_22263;
var G__22273 = (i__21985_22264 + (1));
seq__21982_22261 = G__22270;
chunk__21983_22262 = G__22271;
count__21984_22263 = G__22272;
i__21985_22264 = G__22273;
continue;
} else {
var temp__5823__auto___22274 = cljs.core.seq(seq__21982_22261);
if(temp__5823__auto___22274){
var seq__21982_22275__$1 = temp__5823__auto___22274;
if(cljs.core.chunked_seq_QMARK_(seq__21982_22275__$1)){
var c__5568__auto___22276 = cljs.core.chunk_first(seq__21982_22275__$1);
var G__22277 = cljs.core.chunk_rest(seq__21982_22275__$1);
var G__22278 = c__5568__auto___22276;
var G__22279 = cljs.core.count(c__5568__auto___22276);
var G__22280 = (0);
seq__21982_22261 = G__22277;
chunk__21983_22262 = G__22278;
count__21984_22263 = G__22279;
i__21985_22264 = G__22280;
continue;
} else {
var desc_22281 = cljs.core.first(seq__21982_22275__$1);
header_parts_22260.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22281),val_print_width));

header_parts_22260.push(col_spacing);


var G__22283 = cljs.core.next(seq__21982_22275__$1);
var G__22284 = null;
var G__22285 = (0);
var G__22286 = (0);
seq__21982_22261 = G__22283;
chunk__21983_22262 = G__22284;
count__21984_22263 = G__22285;
i__21985_22264 = G__22286;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([header_parts_22260.join("").trim()], 0));

var sep_parts_22289 = ["".padEnd((max_label_width + (2)),"-")];
var seq__21994_22291 = cljs.core.seq(current_descriptors);
var chunk__21995_22292 = null;
var count__21996_22293 = (0);
var i__21997_22294 = (0);
while(true){
if((i__21997_22294 < count__21996_22293)){
var __22295 = chunk__21995_22292.cljs$core$IIndexed$_nth$arity$2(null, i__21997_22294);
sep_parts_22289.push("".padEnd(val_print_width,"-"));

sep_parts_22289.push("".padEnd(((col_spacing).length),"-"));


var G__22296 = seq__21994_22291;
var G__22297 = chunk__21995_22292;
var G__22298 = count__21996_22293;
var G__22299 = (i__21997_22294 + (1));
seq__21994_22291 = G__22296;
chunk__21995_22292 = G__22297;
count__21996_22293 = G__22298;
i__21997_22294 = G__22299;
continue;
} else {
var temp__5823__auto___22300 = cljs.core.seq(seq__21994_22291);
if(temp__5823__auto___22300){
var seq__21994_22301__$1 = temp__5823__auto___22300;
if(cljs.core.chunked_seq_QMARK_(seq__21994_22301__$1)){
var c__5568__auto___22303 = cljs.core.chunk_first(seq__21994_22301__$1);
var G__22304 = cljs.core.chunk_rest(seq__21994_22301__$1);
var G__22305 = c__5568__auto___22303;
var G__22306 = cljs.core.count(c__5568__auto___22303);
var G__22307 = (0);
seq__21994_22291 = G__22304;
chunk__21995_22292 = G__22305;
count__21996_22293 = G__22306;
i__21997_22294 = G__22307;
continue;
} else {
var __22309 = cljs.core.first(seq__21994_22301__$1);
sep_parts_22289.push("".padEnd(val_print_width,"-"));

sep_parts_22289.push("".padEnd(((col_spacing).length),"-"));


var G__22312 = cljs.core.next(seq__21994_22301__$1);
var G__22313 = null;
var G__22314 = (0);
var G__22315 = (0);
seq__21994_22291 = G__22312;
chunk__21995_22292 = G__22313;
count__21996_22293 = G__22314;
i__21997_22294 = G__22315;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([sep_parts_22289.join("").trim()], 0));

var seq__22004_22317 = cljs.core.seq(fields);
var chunk__22005_22318 = null;
var count__22006_22319 = (0);
var i__22007_22320 = (0);
while(true){
if((i__22007_22320 < count__22006_22319)){
var field_info_22321 = chunk__22005_22318.cljs$core$IIndexed$_nth$arity$2(null, i__22007_22320);
var row_parts_22322 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22321)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__22031_22323 = cljs.core.seq(current_descriptors);
var chunk__22032_22324 = null;
var count__22033_22325 = (0);
var i__22034_22326 = (0);
while(true){
if((i__22034_22326 < count__22033_22325)){
var desc_22328 = chunk__22032_22324.cljs$core$IIndexed$_nth$arity$2(null, i__22034_22326);
row_parts_22322.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22328,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22321),""),val_print_width));

row_parts_22322.push(col_spacing);


var G__22330 = seq__22031_22323;
var G__22331 = chunk__22032_22324;
var G__22332 = count__22033_22325;
var G__22333 = (i__22034_22326 + (1));
seq__22031_22323 = G__22330;
chunk__22032_22324 = G__22331;
count__22033_22325 = G__22332;
i__22034_22326 = G__22333;
continue;
} else {
var temp__5823__auto___22335 = cljs.core.seq(seq__22031_22323);
if(temp__5823__auto___22335){
var seq__22031_22337__$1 = temp__5823__auto___22335;
if(cljs.core.chunked_seq_QMARK_(seq__22031_22337__$1)){
var c__5568__auto___22339 = cljs.core.chunk_first(seq__22031_22337__$1);
var G__22340 = cljs.core.chunk_rest(seq__22031_22337__$1);
var G__22341 = c__5568__auto___22339;
var G__22342 = cljs.core.count(c__5568__auto___22339);
var G__22343 = (0);
seq__22031_22323 = G__22340;
chunk__22032_22324 = G__22341;
count__22033_22325 = G__22342;
i__22034_22326 = G__22343;
continue;
} else {
var desc_22344 = cljs.core.first(seq__22031_22337__$1);
row_parts_22322.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22344,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22321),""),val_print_width));

row_parts_22322.push(col_spacing);


var G__22345 = cljs.core.next(seq__22031_22337__$1);
var G__22346 = null;
var G__22347 = (0);
var G__22348 = (0);
seq__22031_22323 = G__22345;
chunk__22032_22324 = G__22346;
count__22033_22325 = G__22347;
i__22034_22326 = G__22348;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22322.join("").trim()], 0));


var G__22349 = seq__22004_22317;
var G__22350 = chunk__22005_22318;
var G__22351 = count__22006_22319;
var G__22352 = (i__22007_22320 + (1));
seq__22004_22317 = G__22349;
chunk__22005_22318 = G__22350;
count__22006_22319 = G__22351;
i__22007_22320 = G__22352;
continue;
} else {
var temp__5823__auto___22355 = cljs.core.seq(seq__22004_22317);
if(temp__5823__auto___22355){
var seq__22004_22356__$1 = temp__5823__auto___22355;
if(cljs.core.chunked_seq_QMARK_(seq__22004_22356__$1)){
var c__5568__auto___22357 = cljs.core.chunk_first(seq__22004_22356__$1);
var G__22358 = cljs.core.chunk_rest(seq__22004_22356__$1);
var G__22359 = c__5568__auto___22357;
var G__22360 = cljs.core.count(c__5568__auto___22357);
var G__22361 = (0);
seq__22004_22317 = G__22358;
chunk__22005_22318 = G__22359;
count__22006_22319 = G__22360;
i__22007_22320 = G__22361;
continue;
} else {
var field_info_22364 = cljs.core.first(seq__22004_22356__$1);
var row_parts_22365 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22364)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__22046_22368 = cljs.core.seq(current_descriptors);
var chunk__22047_22369 = null;
var count__22048_22370 = (0);
var i__22049_22371 = (0);
while(true){
if((i__22049_22371 < count__22048_22370)){
var desc_22373 = chunk__22047_22369.cljs$core$IIndexed$_nth$arity$2(null, i__22049_22371);
row_parts_22365.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22373,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22364),""),val_print_width));

row_parts_22365.push(col_spacing);


var G__22374 = seq__22046_22368;
var G__22375 = chunk__22047_22369;
var G__22376 = count__22048_22370;
var G__22377 = (i__22049_22371 + (1));
seq__22046_22368 = G__22374;
chunk__22047_22369 = G__22375;
count__22048_22370 = G__22376;
i__22049_22371 = G__22377;
continue;
} else {
var temp__5823__auto___22378__$1 = cljs.core.seq(seq__22046_22368);
if(temp__5823__auto___22378__$1){
var seq__22046_22379__$1 = temp__5823__auto___22378__$1;
if(cljs.core.chunked_seq_QMARK_(seq__22046_22379__$1)){
var c__5568__auto___22380 = cljs.core.chunk_first(seq__22046_22379__$1);
var G__22381 = cljs.core.chunk_rest(seq__22046_22379__$1);
var G__22382 = c__5568__auto___22380;
var G__22383 = cljs.core.count(c__5568__auto___22380);
var G__22384 = (0);
seq__22046_22368 = G__22381;
chunk__22047_22369 = G__22382;
count__22048_22370 = G__22383;
i__22049_22371 = G__22384;
continue;
} else {
var desc_22385 = cljs.core.first(seq__22046_22379__$1);
row_parts_22365.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22385,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22364),""),val_print_width));

row_parts_22365.push(col_spacing);


var G__22386 = cljs.core.next(seq__22046_22379__$1);
var G__22387 = null;
var G__22388 = (0);
var G__22389 = (0);
seq__22046_22368 = G__22386;
chunk__22047_22369 = G__22387;
count__22048_22370 = G__22388;
i__22049_22371 = G__22389;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22365.join("").trim()], 0));


var G__22390 = cljs.core.next(seq__22004_22356__$1);
var G__22391 = null;
var G__22392 = (0);
var G__22393 = (0);
seq__22004_22317 = G__22390;
chunk__22005_22318 = G__22391;
count__22006_22319 = G__22392;
i__22007_22320 = G__22393;
continue;
}
} else {
}
}
break;
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([""], 0));
});
cljs_thread.eve.util._equiv_sequential = (function cljs_thread$eve$util$_equiv_sequential(coll,other){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> -equiv-sequential CALLED for:",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([coll], 0)),"AND",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([other], 0))], 0));

if(cljs.core.sequential_QMARK_(other)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: other is sequential");

if(cljs.core.counted_QMARK_(other)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> -equiv-sequential: other is counted. coll count:",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.count(coll),"other count:",cljs.core.count(other)], 0));

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(coll),cljs.core.count(other))){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: COUNTS DIFFER, returning false");

return false;
} else {
var idx = (0);
var s1 = cljs.core.seq(coll);
var s2 = cljs.core.seq(other);
while(true){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> -equiv-sequential loop: idx",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([idx,"s1 nil?",(s1 == null),"s2 nil?",(s2 == null)], 0));

if((s1 == null)){
if((s2 == null)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: Both seqs nil, returning true");

return true;
} else {
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: s1 nil, s2 not. Returning false");

return false;
}
} else {
if((s2 == null)){
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: s2 nil, s1 not. Returning false");

return false;
} else {
var first1 = cljs.core.first(s1);
var first2 = cljs.core.first(s2);
var elements_equal_QMARK_ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(first1,first2);
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> -equiv-sequential loop: Comparing elements - first1:",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([first1], 0)),"(type:",cljs.core.type(first1),") vs first2:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([first2], 0)),"(type:",cljs.core.type(first2),") EQUAL?:",elements_equal_QMARK_], 0));

if(elements_equal_QMARK_){
var G__22401 = (idx + (1));
var G__22402 = cljs.core.next(s1);
var G__22403 = cljs.core.next(s2);
idx = G__22401;
s1 = G__22402;
s2 = G__22403;
continue;
} else {
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$variadic(">>> -equiv-sequential: ELEMENTS DIFFER at idx",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([idx,", returning false"], 0));

return false;
}

}
}
break;
}
}
} else {
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: other is not counted, returning false");

return false;
}
} else {
cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1(">>> -equiv-sequential: other is not sequential, returning false");

return false;
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.util !== 'undefined') && (typeof cljs_thread.eve.util.is_node_QMARK_ !== 'undefined')){
} else {
cljs_thread.eve.util.is_node_QMARK_ = (typeof process !== 'undefined');
}
cljs_thread.eve.util.get_reader_map_idx = (function cljs_thread$eve$util$get_reader_map_idx(descriptor_idx){
if(typeof descriptor_idx === 'number'){
} else {
throw (new Error(["Assert failed: ","get-reader-map-idx expects a numerical descriptor-idx","\n","(number? descriptor-idx)"].join('')));
}

if((descriptor_idx >= (0))){
} else {
throw (new Error(["Assert failed: ","descriptor-idx must be non-negative","\n","(>= descriptor-idx 0)"].join('')));
}

var num_counters = (65536);
var result = cljs.core.mod(descriptor_idx,num_counters);
if((result >= num_counters)){
console.error("!!! get-reader-map-idx: CRITICAL - result",result,"is >= num-counters",num_counters,"for descriptor-idx",descriptor_idx);
} else {
}

return result;
});
cljs_thread.eve.util.TE = (new TextEncoder());
cljs_thread.eve.util.TD = (new TextDecoder("utf-8"));
cljs_thread.eve.util.string__GT_uint8array = (function cljs_thread$eve$util$string__GT_uint8array(s){
return cljs_thread.eve.util.TE.encode(s);
});
cljs_thread.eve.util.uint8array__GT_string = (function cljs_thread$eve$util$uint8array__GT_string(arr){
return cljs_thread.eve.util.TD.decode(arr);
});

//# sourceMappingURL=cljs_thread.eve.util.js.map
