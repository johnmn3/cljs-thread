goog.provide('cljs_thread.eve.util');
cljs_thread.eve.util.wt_module = (((((typeof process !== 'undefined')) && ((typeof require !== 'undefined'))))?(function (){try{return require("worker_threads");
}catch (e21811){var _ = e21811;
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
var G__21816 = arguments.length;
switch (G__21816) {
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
var G__21821 = arguments.length;
switch (G__21821) {
case 1:
return cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
var args_arr__5794__auto__ = [];
var len__5769__auto___22042 = arguments.length;
var i__5770__auto___22044 = (0);
while(true){
if((i__5770__auto___22044 < len__5769__auto___22042)){
args_arr__5794__auto__.push((arguments[i__5770__auto___22044]));

var G__22045 = (i__5770__auto___22044 + (1));
i__5770__auto___22044 = G__22045;
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
(cljs_thread.eve.util.log.cljs$lang$applyTo = (function (seq21818){
var G__21819 = cljs.core.first(seq21818);
var seq21818__$1 = cljs.core.next(seq21818);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21819,seq21818__$1);
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
}catch (e21842){if((e21842 instanceof Error)){
var e = e21842;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[DEBUG] atomic-load-int ERROR:",e.message,"idx:",idx,"array-length:",ta_view.length], 0));

throw e;
} else {
throw e21842;

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

var G__22057 = (n - (1));
n = G__22057;
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
var len__5769__auto___22062 = arguments.length;
var i__5770__auto___22063 = (0);
while(true){
if((i__5770__auto___22063 < len__5769__auto___22062)){
args__5775__auto__.push((arguments[i__5770__auto___22063]));

var G__22064 = (i__5770__auto___22063 + (1));
i__5770__auto___22063 = G__22064;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic = (function (buffer_or_view,p__21867){
var map__21868 = p__21867;
var map__21868__$1 = cljs.core.__destructure_map(map__21868);
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21868__$1,new cljs.core.Keyword(null,"offset","offset",296498311),(0));
var length = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21868__$1,new cljs.core.Keyword(null,"length","length",588987862));
var bytes_per_row = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21868__$1,new cljs.core.Keyword(null,"bytes-per-row","bytes-per-row",-145207552),(16));
var title = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21868__$1,new cljs.core.Keyword(null,"title","title",636505583));
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
var row_start_abs_offset_22071 = (view_byte_offset + current_idx_in_u8_view);
var bytes_on_this_line_22072 = (function (){var x__5133__auto__ = bytes_per_row;
var y__5134__auto__ = (effective_display_length__$1 - current_idx_in_u8_view);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var hex_addr_raw_22073 = row_start_abs_offset_22071.toString((16));
var addr_padding_needed_22074 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = (target_addr_hex_len - cljs.core.count(hex_addr_raw_22073));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var address_str_22075 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(addr_padding_needed_22074,"0"))),cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_addr_raw_22073),": "].join('');
var hex_parts_22076 = [];
var n__5636__auto___22078 = bytes_per_row;
var i_22079 = (0);
while(true){
if((i_22079 < n__5636__auto___22078)){
if((i_22079 < bytes_on_this_line_22072)){
hex_parts_22076.push(cljs_thread.eve.util.byte__GT_hex((u8_data_view[(current_idx_in_u8_view + i_22079)])));
} else {
hex_parts_22076.push("  ");
}

var G__22080 = (i_22079 + (1));
i_22079 = G__22080;
continue;
} else {
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([[address_str_22075,cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_parts_22076.join(" "))].join('')], 0));

var G__22082 = (current_idx_in_u8_view + bytes_per_row);
current_idx_in_u8_view = G__22082;
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
(cljs_thread.eve.util.hex_window.cljs$lang$applyTo = (function (seq21861){
var G__21862 = cljs.core.first(seq21861);
var seq21861__$1 = cljs.core.next(seq21861);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21862,seq21861__$1);
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
var G__22101 = (check_idx + (1));
check_idx = G__22101;
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
var n__5636__auto___22103 = display_len;
var i_22104 = (0);
while(true){
if((i_22104 < n__5636__auto___22103)){
var byte_val_22107 = byte_array_view.at(i_22104);
var hex_22108 = byte_val_22107.toString((16));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(hex_22108.length,(1))){
str_parts.push("0");
} else {
}

str_parts.push(hex_22108);

str_parts.push(" ");

var G__22110 = (i_22104 + (1));
i_22104 = G__22110;
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
var map__21926 = config;
var map__21926__$1 = cljs.core.__destructure_map(map__21926);
var max_block_descriptors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21926__$1,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111));
var data_region_start_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21926__$1,new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696));
var sab_total_size_bytes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21926__$1,new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283));
var data_region_size = (sab_total_size_bytes - data_region_start_offset);
var effective_render_size = (function (){var x__5133__auto__ = max_chars_to_render;
var y__5134__auto__ = data_region_size;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_js_array = (new Array(effective_render_size));
var n__5636__auto___22111 = effective_render_size;
var k_22112 = (0);
while(true){
if((k_22112 < n__5636__auto___22111)){
(char_js_array[k_22112] = ".");

var G__22113 = (k_22112 + (1));
k_22112 = G__22113;
continue;
} else {
}
break;
}

var seq__21927_22115 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$1(max_block_descriptors));
var chunk__21928_22116 = null;
var count__21929_22117 = (0);
var i__21930_22118 = (0);
while(true){
if((i__21930_22118 < count__21929_22117)){
var descriptor_idx_22119 = chunk__21928_22116.cljs$core$IIndexed$_nth$arity$2(null, i__21930_22118);
var desc_22121 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22119);
var status_22122 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22121);
var block_data_offset_22123 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22121);
var block_len_22124 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22122,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22121):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22121));
var char_to_use_22125 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22122,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22122,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22125;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22123 >= data_region_start_offset)) && ((block_data_offset_22123 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22132 = (block_data_offset_22123 - data_region_start_offset);
var end_in_char_map_22133 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22132 + block_len_22124);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22134 = start_in_char_map_22132;
while(true){
if((((char_idx_22134 >= (0))) && ((((char_idx_22134 < end_in_char_map_22133)) && ((char_idx_22134 < effective_render_size)))))){
(char_js_array[char_idx_22134] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22122,(1))) && ((char_idx_22134 > start_in_char_map_22132))))?"+":char_to_use_22125));

var G__22136 = (char_idx_22134 + (1));
char_idx_22134 = G__22136;
continue;
} else {
}
break;
}
} else {
}


var G__22137 = seq__21927_22115;
var G__22138 = chunk__21928_22116;
var G__22139 = count__21929_22117;
var G__22140 = (i__21930_22118 + (1));
seq__21927_22115 = G__22137;
chunk__21928_22116 = G__22138;
count__21929_22117 = G__22139;
i__21930_22118 = G__22140;
continue;
} else {
var temp__5823__auto___22141 = cljs.core.seq(seq__21927_22115);
if(temp__5823__auto___22141){
var seq__21927_22142__$1 = temp__5823__auto___22141;
if(cljs.core.chunked_seq_QMARK_(seq__21927_22142__$1)){
var c__5568__auto___22143 = cljs.core.chunk_first(seq__21927_22142__$1);
var G__22144 = cljs.core.chunk_rest(seq__21927_22142__$1);
var G__22145 = c__5568__auto___22143;
var G__22146 = cljs.core.count(c__5568__auto___22143);
var G__22147 = (0);
seq__21927_22115 = G__22144;
chunk__21928_22116 = G__22145;
count__21929_22117 = G__22146;
i__21930_22118 = G__22147;
continue;
} else {
var descriptor_idx_22149 = cljs.core.first(seq__21927_22142__$1);
var desc_22150 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22149);
var status_22151 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22150);
var block_data_offset_22152 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22150);
var block_len_22153 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22151,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22150):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22150));
var char_to_use_22154 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22151,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22151,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22154;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22152 >= data_region_start_offset)) && ((block_data_offset_22152 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22158 = (block_data_offset_22152 - data_region_start_offset);
var end_in_char_map_22159 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22158 + block_len_22153);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22160 = start_in_char_map_22158;
while(true){
if((((char_idx_22160 >= (0))) && ((((char_idx_22160 < end_in_char_map_22159)) && ((char_idx_22160 < effective_render_size)))))){
(char_js_array[char_idx_22160] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22151,(1))) && ((char_idx_22160 > start_in_char_map_22158))))?"+":char_to_use_22154));

var G__22164 = (char_idx_22160 + (1));
char_idx_22160 = G__22164;
continue;
} else {
}
break;
}
} else {
}


var G__22165 = cljs.core.next(seq__21927_22142__$1);
var G__22166 = null;
var G__22167 = (0);
var G__22168 = (0);
seq__21927_22115 = G__22165;
chunk__21928_22116 = G__22166;
count__21929_22117 = G__22167;
i__21930_22118 = G__22168;
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

var n__5636__auto___22171 = chars_per_row;
var k_22172 = (0);
while(true){
if((k_22172 < n__5636__auto___22171)){
if((k_22172 < chars_on_this_line)){
var char_idx_22174 = (offset_in_char_map + k_22172);
if((char_idx_22174 < cljs.core.count(char_map_str))){
str_parts.push(char_map_str.charAt(char_idx_22174));

str_parts.push("  ");
} else {
str_parts.push("   ");
}
} else {
str_parts.push("   ");
}

var G__22177 = (k_22172 + (1));
k_22172 = G__22177;
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
var max_label_width = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21959_SHARP_){
return cljs.core.count(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(p1__21959_SHARP_));
}),fields));
var end_idx = (function (){var x__5133__auto__ = (start_idx + num_descriptors_in_table);
var y__5134__auto__ = max_total_descriptors;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var current_descriptors = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21960_SHARP_){
return cljs_thread.eve.util.read_full_block_descriptor(index_view,p1__21960_SHARP_);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$2(start_idx,end_idx));
var header_parts_22193 = ["Desc Idx:".padEnd((max_label_width + (2))," ")];
var seq__21962_22195 = cljs.core.seq(current_descriptors);
var chunk__21963_22196 = null;
var count__21964_22197 = (0);
var i__21965_22198 = (0);
while(true){
if((i__21965_22198 < count__21964_22197)){
var desc_22200 = chunk__21963_22196.cljs$core$IIndexed$_nth$arity$2(null, i__21965_22198);
header_parts_22193.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22200),val_print_width));

header_parts_22193.push(col_spacing);


var G__22201 = seq__21962_22195;
var G__22202 = chunk__21963_22196;
var G__22203 = count__21964_22197;
var G__22204 = (i__21965_22198 + (1));
seq__21962_22195 = G__22201;
chunk__21963_22196 = G__22202;
count__21964_22197 = G__22203;
i__21965_22198 = G__22204;
continue;
} else {
var temp__5823__auto___22205 = cljs.core.seq(seq__21962_22195);
if(temp__5823__auto___22205){
var seq__21962_22206__$1 = temp__5823__auto___22205;
if(cljs.core.chunked_seq_QMARK_(seq__21962_22206__$1)){
var c__5568__auto___22207 = cljs.core.chunk_first(seq__21962_22206__$1);
var G__22208 = cljs.core.chunk_rest(seq__21962_22206__$1);
var G__22209 = c__5568__auto___22207;
var G__22210 = cljs.core.count(c__5568__auto___22207);
var G__22211 = (0);
seq__21962_22195 = G__22208;
chunk__21963_22196 = G__22209;
count__21964_22197 = G__22210;
i__21965_22198 = G__22211;
continue;
} else {
var desc_22215 = cljs.core.first(seq__21962_22206__$1);
header_parts_22193.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22215),val_print_width));

header_parts_22193.push(col_spacing);


var G__22219 = cljs.core.next(seq__21962_22206__$1);
var G__22220 = null;
var G__22221 = (0);
var G__22222 = (0);
seq__21962_22195 = G__22219;
chunk__21963_22196 = G__22220;
count__21964_22197 = G__22221;
i__21965_22198 = G__22222;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([header_parts_22193.join("").trim()], 0));

var sep_parts_22223 = ["".padEnd((max_label_width + (2)),"-")];
var seq__21967_22226 = cljs.core.seq(current_descriptors);
var chunk__21968_22227 = null;
var count__21969_22228 = (0);
var i__21970_22229 = (0);
while(true){
if((i__21970_22229 < count__21969_22228)){
var __22230 = chunk__21968_22227.cljs$core$IIndexed$_nth$arity$2(null, i__21970_22229);
sep_parts_22223.push("".padEnd(val_print_width,"-"));

sep_parts_22223.push("".padEnd(((col_spacing).length),"-"));


var G__22233 = seq__21967_22226;
var G__22234 = chunk__21968_22227;
var G__22235 = count__21969_22228;
var G__22236 = (i__21970_22229 + (1));
seq__21967_22226 = G__22233;
chunk__21968_22227 = G__22234;
count__21969_22228 = G__22235;
i__21970_22229 = G__22236;
continue;
} else {
var temp__5823__auto___22238 = cljs.core.seq(seq__21967_22226);
if(temp__5823__auto___22238){
var seq__21967_22240__$1 = temp__5823__auto___22238;
if(cljs.core.chunked_seq_QMARK_(seq__21967_22240__$1)){
var c__5568__auto___22242 = cljs.core.chunk_first(seq__21967_22240__$1);
var G__22244 = cljs.core.chunk_rest(seq__21967_22240__$1);
var G__22245 = c__5568__auto___22242;
var G__22246 = cljs.core.count(c__5568__auto___22242);
var G__22247 = (0);
seq__21967_22226 = G__22244;
chunk__21968_22227 = G__22245;
count__21969_22228 = G__22246;
i__21970_22229 = G__22247;
continue;
} else {
var __22248 = cljs.core.first(seq__21967_22240__$1);
sep_parts_22223.push("".padEnd(val_print_width,"-"));

sep_parts_22223.push("".padEnd(((col_spacing).length),"-"));


var G__22249 = cljs.core.next(seq__21967_22240__$1);
var G__22250 = null;
var G__22251 = (0);
var G__22252 = (0);
seq__21967_22226 = G__22249;
chunk__21968_22227 = G__22250;
count__21969_22228 = G__22251;
i__21970_22229 = G__22252;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([sep_parts_22223.join("").trim()], 0));

var seq__21971_22253 = cljs.core.seq(fields);
var chunk__21972_22254 = null;
var count__21973_22255 = (0);
var i__21974_22256 = (0);
while(true){
if((i__21974_22256 < count__21973_22255)){
var field_info_22257 = chunk__21972_22254.cljs$core$IIndexed$_nth$arity$2(null, i__21974_22256);
var row_parts_22258 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22257)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__21994_22262 = cljs.core.seq(current_descriptors);
var chunk__21995_22263 = null;
var count__21996_22264 = (0);
var i__21997_22265 = (0);
while(true){
if((i__21997_22265 < count__21996_22264)){
var desc_22267 = chunk__21995_22263.cljs$core$IIndexed$_nth$arity$2(null, i__21997_22265);
row_parts_22258.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22267,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22257),""),val_print_width));

row_parts_22258.push(col_spacing);


var G__22268 = seq__21994_22262;
var G__22269 = chunk__21995_22263;
var G__22270 = count__21996_22264;
var G__22271 = (i__21997_22265 + (1));
seq__21994_22262 = G__22268;
chunk__21995_22263 = G__22269;
count__21996_22264 = G__22270;
i__21997_22265 = G__22271;
continue;
} else {
var temp__5823__auto___22272 = cljs.core.seq(seq__21994_22262);
if(temp__5823__auto___22272){
var seq__21994_22273__$1 = temp__5823__auto___22272;
if(cljs.core.chunked_seq_QMARK_(seq__21994_22273__$1)){
var c__5568__auto___22274 = cljs.core.chunk_first(seq__21994_22273__$1);
var G__22276 = cljs.core.chunk_rest(seq__21994_22273__$1);
var G__22277 = c__5568__auto___22274;
var G__22278 = cljs.core.count(c__5568__auto___22274);
var G__22279 = (0);
seq__21994_22262 = G__22276;
chunk__21995_22263 = G__22277;
count__21996_22264 = G__22278;
i__21997_22265 = G__22279;
continue;
} else {
var desc_22280 = cljs.core.first(seq__21994_22273__$1);
row_parts_22258.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22280,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22257),""),val_print_width));

row_parts_22258.push(col_spacing);


var G__22283 = cljs.core.next(seq__21994_22273__$1);
var G__22284 = null;
var G__22285 = (0);
var G__22286 = (0);
seq__21994_22262 = G__22283;
chunk__21995_22263 = G__22284;
count__21996_22264 = G__22285;
i__21997_22265 = G__22286;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22258.join("").trim()], 0));


var G__22288 = seq__21971_22253;
var G__22289 = chunk__21972_22254;
var G__22290 = count__21973_22255;
var G__22291 = (i__21974_22256 + (1));
seq__21971_22253 = G__22288;
chunk__21972_22254 = G__22289;
count__21973_22255 = G__22290;
i__21974_22256 = G__22291;
continue;
} else {
var temp__5823__auto___22292 = cljs.core.seq(seq__21971_22253);
if(temp__5823__auto___22292){
var seq__21971_22293__$1 = temp__5823__auto___22292;
if(cljs.core.chunked_seq_QMARK_(seq__21971_22293__$1)){
var c__5568__auto___22294 = cljs.core.chunk_first(seq__21971_22293__$1);
var G__22295 = cljs.core.chunk_rest(seq__21971_22293__$1);
var G__22296 = c__5568__auto___22294;
var G__22297 = cljs.core.count(c__5568__auto___22294);
var G__22298 = (0);
seq__21971_22253 = G__22295;
chunk__21972_22254 = G__22296;
count__21973_22255 = G__22297;
i__21974_22256 = G__22298;
continue;
} else {
var field_info_22299 = cljs.core.first(seq__21971_22293__$1);
var row_parts_22300 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22299)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__22007_22301 = cljs.core.seq(current_descriptors);
var chunk__22008_22302 = null;
var count__22009_22303 = (0);
var i__22010_22304 = (0);
while(true){
if((i__22010_22304 < count__22009_22303)){
var desc_22305 = chunk__22008_22302.cljs$core$IIndexed$_nth$arity$2(null, i__22010_22304);
row_parts_22300.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22305,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22299),""),val_print_width));

row_parts_22300.push(col_spacing);


var G__22306 = seq__22007_22301;
var G__22307 = chunk__22008_22302;
var G__22308 = count__22009_22303;
var G__22309 = (i__22010_22304 + (1));
seq__22007_22301 = G__22306;
chunk__22008_22302 = G__22307;
count__22009_22303 = G__22308;
i__22010_22304 = G__22309;
continue;
} else {
var temp__5823__auto___22310__$1 = cljs.core.seq(seq__22007_22301);
if(temp__5823__auto___22310__$1){
var seq__22007_22311__$1 = temp__5823__auto___22310__$1;
if(cljs.core.chunked_seq_QMARK_(seq__22007_22311__$1)){
var c__5568__auto___22312 = cljs.core.chunk_first(seq__22007_22311__$1);
var G__22313 = cljs.core.chunk_rest(seq__22007_22311__$1);
var G__22314 = c__5568__auto___22312;
var G__22315 = cljs.core.count(c__5568__auto___22312);
var G__22316 = (0);
seq__22007_22301 = G__22313;
chunk__22008_22302 = G__22314;
count__22009_22303 = G__22315;
i__22010_22304 = G__22316;
continue;
} else {
var desc_22318 = cljs.core.first(seq__22007_22311__$1);
row_parts_22300.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22318,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22299),""),val_print_width));

row_parts_22300.push(col_spacing);


var G__22321 = cljs.core.next(seq__22007_22311__$1);
var G__22322 = null;
var G__22323 = (0);
var G__22324 = (0);
seq__22007_22301 = G__22321;
chunk__22008_22302 = G__22322;
count__22009_22303 = G__22323;
i__22010_22304 = G__22324;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22300.join("").trim()], 0));


var G__22326 = cljs.core.next(seq__21971_22293__$1);
var G__22327 = null;
var G__22328 = (0);
var G__22329 = (0);
seq__21971_22253 = G__22326;
chunk__21972_22254 = G__22327;
count__21973_22255 = G__22328;
i__21974_22256 = G__22329;
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
var G__22330 = (idx + (1));
var G__22331 = cljs.core.next(s1);
var G__22332 = cljs.core.next(s2);
idx = G__22330;
s1 = G__22331;
s2 = G__22332;
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
