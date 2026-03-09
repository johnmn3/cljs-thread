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
var G__21815 = arguments.length;
switch (G__21815) {
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
var G__21823 = arguments.length;
switch (G__21823) {
case 1:
return cljs_thread.eve.util.log.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
var args_arr__5794__auto__ = [];
var len__5769__auto___22082 = arguments.length;
var i__5770__auto___22083 = (0);
while(true){
if((i__5770__auto___22083 < len__5769__auto___22082)){
args_arr__5794__auto__.push((arguments[i__5770__auto___22083]));

var G__22084 = (i__5770__auto___22083 + (1));
i__5770__auto___22083 = G__22084;
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
(cljs_thread.eve.util.log.cljs$lang$applyTo = (function (seq21821){
var G__21822 = cljs.core.first(seq21821);
var seq21821__$1 = cljs.core.next(seq21821);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21822,seq21821__$1);
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
}catch (e21851){if((e21851 instanceof Error)){
var e = e21851;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[DEBUG] atomic-load-int ERROR:",e.message,"idx:",idx,"array-length:",ta_view.length], 0));

throw e;
} else {
throw e21851;

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

var G__22103 = (n - (1));
n = G__22103;
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
var len__5769__auto___22113 = arguments.length;
var i__5770__auto___22114 = (0);
while(true){
if((i__5770__auto___22114 < len__5769__auto___22113)){
args__5775__auto__.push((arguments[i__5770__auto___22114]));

var G__22115 = (i__5770__auto___22114 + (1));
i__5770__auto___22114 = G__22115;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic = (function (buffer_or_view,p__21872){
var map__21873 = p__21872;
var map__21873__$1 = cljs.core.__destructure_map(map__21873);
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21873__$1,new cljs.core.Keyword(null,"offset","offset",296498311),(0));
var length = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21873__$1,new cljs.core.Keyword(null,"length","length",588987862));
var bytes_per_row = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__21873__$1,new cljs.core.Keyword(null,"bytes-per-row","bytes-per-row",-145207552),(16));
var title = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21873__$1,new cljs.core.Keyword(null,"title","title",636505583));
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
var row_start_abs_offset_22126 = (view_byte_offset + current_idx_in_u8_view);
var bytes_on_this_line_22127 = (function (){var x__5133__auto__ = bytes_per_row;
var y__5134__auto__ = (effective_display_length__$1 - current_idx_in_u8_view);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var hex_addr_raw_22128 = row_start_abs_offset_22126.toString((16));
var addr_padding_needed_22129 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = (target_addr_hex_len - cljs.core.count(hex_addr_raw_22128));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var address_str_22130 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(addr_padding_needed_22129,"0"))),cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_addr_raw_22128),": "].join('');
var hex_parts_22131 = [];
var n__5636__auto___22132 = bytes_per_row;
var i_22133 = (0);
while(true){
if((i_22133 < n__5636__auto___22132)){
if((i_22133 < bytes_on_this_line_22127)){
hex_parts_22131.push(cljs_thread.eve.util.byte__GT_hex((u8_data_view[(current_idx_in_u8_view + i_22133)])));
} else {
hex_parts_22131.push("  ");
}

var G__22134 = (i_22133 + (1));
i_22133 = G__22134;
continue;
} else {
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([[address_str_22130,cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_parts_22131.join(" "))].join('')], 0));

var G__22135 = (current_idx_in_u8_view + bytes_per_row);
current_idx_in_u8_view = G__22135;
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
(cljs_thread.eve.util.hex_window.cljs$lang$applyTo = (function (seq21869){
var G__21870 = cljs.core.first(seq21869);
var seq21869__$1 = cljs.core.next(seq21869);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21870,seq21869__$1);
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
var G__22150 = (check_idx + (1));
check_idx = G__22150;
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
var n__5636__auto___22153 = display_len;
var i_22154 = (0);
while(true){
if((i_22154 < n__5636__auto___22153)){
var byte_val_22156 = byte_array_view.at(i_22154);
var hex_22157 = byte_val_22156.toString((16));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(hex_22157.length,(1))){
str_parts.push("0");
} else {
}

str_parts.push(hex_22157);

str_parts.push(" ");

var G__22158 = (i_22154 + (1));
i_22154 = G__22158;
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
var map__21943 = config;
var map__21943__$1 = cljs.core.__destructure_map(map__21943);
var max_block_descriptors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21943__$1,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111));
var data_region_start_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21943__$1,new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696));
var sab_total_size_bytes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21943__$1,new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283));
var data_region_size = (sab_total_size_bytes - data_region_start_offset);
var effective_render_size = (function (){var x__5133__auto__ = max_chars_to_render;
var y__5134__auto__ = data_region_size;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_js_array = (new Array(effective_render_size));
var n__5636__auto___22163 = effective_render_size;
var k_22164 = (0);
while(true){
if((k_22164 < n__5636__auto___22163)){
(char_js_array[k_22164] = ".");

var G__22166 = (k_22164 + (1));
k_22164 = G__22166;
continue;
} else {
}
break;
}

var seq__21944_22167 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$1(max_block_descriptors));
var chunk__21945_22168 = null;
var count__21946_22169 = (0);
var i__21947_22170 = (0);
while(true){
if((i__21947_22170 < count__21946_22169)){
var descriptor_idx_22171 = chunk__21945_22168.cljs$core$IIndexed$_nth$arity$2(null, i__21947_22170);
var desc_22172 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22171);
var status_22173 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22172);
var block_data_offset_22174 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22172);
var block_len_22175 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22173,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22172):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22172));
var char_to_use_22176 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22173,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22173,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22176;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22174 >= data_region_start_offset)) && ((block_data_offset_22174 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22183 = (block_data_offset_22174 - data_region_start_offset);
var end_in_char_map_22184 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22183 + block_len_22175);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22185 = start_in_char_map_22183;
while(true){
if((((char_idx_22185 >= (0))) && ((((char_idx_22185 < end_in_char_map_22184)) && ((char_idx_22185 < effective_render_size)))))){
(char_js_array[char_idx_22185] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22173,(1))) && ((char_idx_22185 > start_in_char_map_22183))))?"+":char_to_use_22176));

var G__22187 = (char_idx_22185 + (1));
char_idx_22185 = G__22187;
continue;
} else {
}
break;
}
} else {
}


var G__22188 = seq__21944_22167;
var G__22189 = chunk__21945_22168;
var G__22190 = count__21946_22169;
var G__22191 = (i__21947_22170 + (1));
seq__21944_22167 = G__22188;
chunk__21945_22168 = G__22189;
count__21946_22169 = G__22190;
i__21947_22170 = G__22191;
continue;
} else {
var temp__5823__auto___22193 = cljs.core.seq(seq__21944_22167);
if(temp__5823__auto___22193){
var seq__21944_22194__$1 = temp__5823__auto___22193;
if(cljs.core.chunked_seq_QMARK_(seq__21944_22194__$1)){
var c__5568__auto___22196 = cljs.core.chunk_first(seq__21944_22194__$1);
var G__22197 = cljs.core.chunk_rest(seq__21944_22194__$1);
var G__22198 = c__5568__auto___22196;
var G__22199 = cljs.core.count(c__5568__auto___22196);
var G__22200 = (0);
seq__21944_22167 = G__22197;
chunk__21945_22168 = G__22198;
count__21946_22169 = G__22199;
i__21947_22170 = G__22200;
continue;
} else {
var descriptor_idx_22201 = cljs.core.first(seq__21944_22194__$1);
var desc_22202 = cljs_thread.eve.util.read_full_block_descriptor(index_view,descriptor_idx_22201);
var status_22203 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(desc_22202);
var block_data_offset_22204 = new cljs.core.Keyword(null,"data-offset","data-offset",-712338495).cljs$core$IFn$_invoke$arity$1(desc_22202);
var block_len_22205 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22203,(1)))?new cljs.core.Keyword(null,"data-length","data-length",-7158004).cljs$core$IFn$_invoke$arity$1(desc_22202):new cljs.core.Keyword(null,"block-capacity","block-capacity",914682884).cljs$core$IFn$_invoke$arity$1(desc_22202));
var char_to_use_22206 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22203,(1)))?"#":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22203,(0)))?"_":null
));
if(cljs.core.truth_((function (){var and__5043__auto__ = char_to_use_22206;
if(cljs.core.truth_(and__5043__auto__)){
return (((block_data_offset_22204 >= data_region_start_offset)) && ((block_data_offset_22204 < (data_region_start_offset + data_region_size))));
} else {
return and__5043__auto__;
}
})())){
var start_in_char_map_22212 = (block_data_offset_22204 - data_region_start_offset);
var end_in_char_map_22213 = (function (){var x__5133__auto__ = effective_render_size;
var y__5134__auto__ = (start_in_char_map_22212 + block_len_22205);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var char_idx_22214 = start_in_char_map_22212;
while(true){
if((((char_idx_22214 >= (0))) && ((((char_idx_22214 < end_in_char_map_22213)) && ((char_idx_22214 < effective_render_size)))))){
(char_js_array[char_idx_22214] = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_22203,(1))) && ((char_idx_22214 > start_in_char_map_22212))))?"+":char_to_use_22206));

var G__22215 = (char_idx_22214 + (1));
char_idx_22214 = G__22215;
continue;
} else {
}
break;
}
} else {
}


var G__22216 = cljs.core.next(seq__21944_22194__$1);
var G__22217 = null;
var G__22218 = (0);
var G__22219 = (0);
seq__21944_22167 = G__22216;
chunk__21945_22168 = G__22217;
count__21946_22169 = G__22218;
i__21947_22170 = G__22219;
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

var n__5636__auto___22220 = chars_per_row;
var k_22221 = (0);
while(true){
if((k_22221 < n__5636__auto___22220)){
if((k_22221 < chars_on_this_line)){
var char_idx_22222 = (offset_in_char_map + k_22221);
if((char_idx_22222 < cljs.core.count(char_map_str))){
str_parts.push(char_map_str.charAt(char_idx_22222));

str_parts.push("  ");
} else {
str_parts.push("   ");
}
} else {
str_parts.push("   ");
}

var G__22225 = (k_22221 + (1));
k_22221 = G__22225;
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
var max_label_width = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__21963_SHARP_){
return cljs.core.count(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(p1__21963_SHARP_));
}),fields));
var end_idx = (function (){var x__5133__auto__ = (start_idx + num_descriptors_in_table);
var y__5134__auto__ = max_total_descriptors;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var current_descriptors = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21964_SHARP_){
return cljs_thread.eve.util.read_full_block_descriptor(index_view,p1__21964_SHARP_);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$2(start_idx,end_idx));
var header_parts_22236 = ["Desc Idx:".padEnd((max_label_width + (2))," ")];
var seq__21968_22237 = cljs.core.seq(current_descriptors);
var chunk__21969_22238 = null;
var count__21970_22239 = (0);
var i__21971_22240 = (0);
while(true){
if((i__21971_22240 < count__21970_22239)){
var desc_22242 = chunk__21969_22238.cljs$core$IIndexed$_nth$arity$2(null, i__21971_22240);
header_parts_22236.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22242),val_print_width));

header_parts_22236.push(col_spacing);


var G__22243 = seq__21968_22237;
var G__22244 = chunk__21969_22238;
var G__22245 = count__21970_22239;
var G__22246 = (i__21971_22240 + (1));
seq__21968_22237 = G__22243;
chunk__21969_22238 = G__22244;
count__21970_22239 = G__22245;
i__21971_22240 = G__22246;
continue;
} else {
var temp__5823__auto___22247 = cljs.core.seq(seq__21968_22237);
if(temp__5823__auto___22247){
var seq__21968_22248__$1 = temp__5823__auto___22247;
if(cljs.core.chunked_seq_QMARK_(seq__21968_22248__$1)){
var c__5568__auto___22249 = cljs.core.chunk_first(seq__21968_22248__$1);
var G__22250 = cljs.core.chunk_rest(seq__21968_22248__$1);
var G__22251 = c__5568__auto___22249;
var G__22252 = cljs.core.count(c__5568__auto___22249);
var G__22253 = (0);
seq__21968_22237 = G__22250;
chunk__21969_22238 = G__22251;
count__21970_22239 = G__22252;
i__21971_22240 = G__22253;
continue;
} else {
var desc_22254 = cljs.core.first(seq__21968_22248__$1);
header_parts_22236.push(cljs_thread.eve.util.format_descriptor_value(new cljs.core.Keyword(null,"idx","idx",1053688473).cljs$core$IFn$_invoke$arity$1(desc_22254),val_print_width));

header_parts_22236.push(col_spacing);


var G__22255 = cljs.core.next(seq__21968_22248__$1);
var G__22256 = null;
var G__22257 = (0);
var G__22258 = (0);
seq__21968_22237 = G__22255;
chunk__21969_22238 = G__22256;
count__21970_22239 = G__22257;
i__21971_22240 = G__22258;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([header_parts_22236.join("").trim()], 0));

var sep_parts_22259 = ["".padEnd((max_label_width + (2)),"-")];
var seq__21973_22260 = cljs.core.seq(current_descriptors);
var chunk__21974_22261 = null;
var count__21975_22262 = (0);
var i__21976_22263 = (0);
while(true){
if((i__21976_22263 < count__21975_22262)){
var __22265 = chunk__21974_22261.cljs$core$IIndexed$_nth$arity$2(null, i__21976_22263);
sep_parts_22259.push("".padEnd(val_print_width,"-"));

sep_parts_22259.push("".padEnd(((col_spacing).length),"-"));


var G__22266 = seq__21973_22260;
var G__22267 = chunk__21974_22261;
var G__22268 = count__21975_22262;
var G__22269 = (i__21976_22263 + (1));
seq__21973_22260 = G__22266;
chunk__21974_22261 = G__22267;
count__21975_22262 = G__22268;
i__21976_22263 = G__22269;
continue;
} else {
var temp__5823__auto___22270 = cljs.core.seq(seq__21973_22260);
if(temp__5823__auto___22270){
var seq__21973_22271__$1 = temp__5823__auto___22270;
if(cljs.core.chunked_seq_QMARK_(seq__21973_22271__$1)){
var c__5568__auto___22272 = cljs.core.chunk_first(seq__21973_22271__$1);
var G__22273 = cljs.core.chunk_rest(seq__21973_22271__$1);
var G__22274 = c__5568__auto___22272;
var G__22275 = cljs.core.count(c__5568__auto___22272);
var G__22276 = (0);
seq__21973_22260 = G__22273;
chunk__21974_22261 = G__22274;
count__21975_22262 = G__22275;
i__21976_22263 = G__22276;
continue;
} else {
var __22277 = cljs.core.first(seq__21973_22271__$1);
sep_parts_22259.push("".padEnd(val_print_width,"-"));

sep_parts_22259.push("".padEnd(((col_spacing).length),"-"));


var G__22279 = cljs.core.next(seq__21973_22271__$1);
var G__22280 = null;
var G__22281 = (0);
var G__22282 = (0);
seq__21973_22260 = G__22279;
chunk__21974_22261 = G__22280;
count__21975_22262 = G__22281;
i__21976_22263 = G__22282;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([sep_parts_22259.join("").trim()], 0));

var seq__21988_22284 = cljs.core.seq(fields);
var chunk__21989_22285 = null;
var count__21990_22286 = (0);
var i__21991_22287 = (0);
while(true){
if((i__21991_22287 < count__21990_22286)){
var field_info_22288 = chunk__21989_22285.cljs$core$IIndexed$_nth$arity$2(null, i__21991_22287);
var row_parts_22289 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22288)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__22010_22290 = cljs.core.seq(current_descriptors);
var chunk__22011_22291 = null;
var count__22012_22292 = (0);
var i__22013_22293 = (0);
while(true){
if((i__22013_22293 < count__22012_22292)){
var desc_22295 = chunk__22011_22291.cljs$core$IIndexed$_nth$arity$2(null, i__22013_22293);
row_parts_22289.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22295,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22288),""),val_print_width));

row_parts_22289.push(col_spacing);


var G__22298 = seq__22010_22290;
var G__22299 = chunk__22011_22291;
var G__22300 = count__22012_22292;
var G__22301 = (i__22013_22293 + (1));
seq__22010_22290 = G__22298;
chunk__22011_22291 = G__22299;
count__22012_22292 = G__22300;
i__22013_22293 = G__22301;
continue;
} else {
var temp__5823__auto___22303 = cljs.core.seq(seq__22010_22290);
if(temp__5823__auto___22303){
var seq__22010_22304__$1 = temp__5823__auto___22303;
if(cljs.core.chunked_seq_QMARK_(seq__22010_22304__$1)){
var c__5568__auto___22305 = cljs.core.chunk_first(seq__22010_22304__$1);
var G__22306 = cljs.core.chunk_rest(seq__22010_22304__$1);
var G__22307 = c__5568__auto___22305;
var G__22308 = cljs.core.count(c__5568__auto___22305);
var G__22309 = (0);
seq__22010_22290 = G__22306;
chunk__22011_22291 = G__22307;
count__22012_22292 = G__22308;
i__22013_22293 = G__22309;
continue;
} else {
var desc_22310 = cljs.core.first(seq__22010_22304__$1);
row_parts_22289.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22310,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22288),""),val_print_width));

row_parts_22289.push(col_spacing);


var G__22311 = cljs.core.next(seq__22010_22304__$1);
var G__22312 = null;
var G__22313 = (0);
var G__22314 = (0);
seq__22010_22290 = G__22311;
chunk__22011_22291 = G__22312;
count__22012_22292 = G__22313;
i__22013_22293 = G__22314;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22289.join("").trim()], 0));


var G__22315 = seq__21988_22284;
var G__22316 = chunk__21989_22285;
var G__22317 = count__21990_22286;
var G__22318 = (i__21991_22287 + (1));
seq__21988_22284 = G__22315;
chunk__21989_22285 = G__22316;
count__21990_22286 = G__22317;
i__21991_22287 = G__22318;
continue;
} else {
var temp__5823__auto___22320 = cljs.core.seq(seq__21988_22284);
if(temp__5823__auto___22320){
var seq__21988_22322__$1 = temp__5823__auto___22320;
if(cljs.core.chunked_seq_QMARK_(seq__21988_22322__$1)){
var c__5568__auto___22324 = cljs.core.chunk_first(seq__21988_22322__$1);
var G__22325 = cljs.core.chunk_rest(seq__21988_22322__$1);
var G__22326 = c__5568__auto___22324;
var G__22327 = cljs.core.count(c__5568__auto___22324);
var G__22328 = (0);
seq__21988_22284 = G__22325;
chunk__21989_22285 = G__22326;
count__21990_22286 = G__22327;
i__21991_22287 = G__22328;
continue;
} else {
var field_info_22330 = cljs.core.first(seq__21988_22322__$1);
var row_parts_22331 = [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(field_info_22330)),":"].join('').padEnd((max_label_width + (2))," ")];
var seq__22032_22332 = cljs.core.seq(current_descriptors);
var chunk__22033_22333 = null;
var count__22034_22334 = (0);
var i__22035_22335 = (0);
while(true){
if((i__22035_22335 < count__22034_22334)){
var desc_22336 = chunk__22033_22333.cljs$core$IIndexed$_nth$arity$2(null, i__22035_22335);
row_parts_22331.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22336,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22330),""),val_print_width));

row_parts_22331.push(col_spacing);


var G__22337 = seq__22032_22332;
var G__22338 = chunk__22033_22333;
var G__22339 = count__22034_22334;
var G__22340 = (i__22035_22335 + (1));
seq__22032_22332 = G__22337;
chunk__22033_22333 = G__22338;
count__22034_22334 = G__22339;
i__22035_22335 = G__22340;
continue;
} else {
var temp__5823__auto___22341__$1 = cljs.core.seq(seq__22032_22332);
if(temp__5823__auto___22341__$1){
var seq__22032_22342__$1 = temp__5823__auto___22341__$1;
if(cljs.core.chunked_seq_QMARK_(seq__22032_22342__$1)){
var c__5568__auto___22343 = cljs.core.chunk_first(seq__22032_22342__$1);
var G__22345 = cljs.core.chunk_rest(seq__22032_22342__$1);
var G__22346 = c__5568__auto___22343;
var G__22347 = cljs.core.count(c__5568__auto___22343);
var G__22348 = (0);
seq__22032_22332 = G__22345;
chunk__22033_22333 = G__22346;
count__22034_22334 = G__22347;
i__22035_22335 = G__22348;
continue;
} else {
var desc_22350 = cljs.core.first(seq__22032_22342__$1);
row_parts_22331.push(cljs_thread.eve.util.format_descriptor_value(cljs.core.get.cljs$core$IFn$_invoke$arity$3(desc_22350,new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(field_info_22330),""),val_print_width));

row_parts_22331.push(col_spacing);


var G__22355 = cljs.core.next(seq__22032_22342__$1);
var G__22356 = null;
var G__22357 = (0);
var G__22358 = (0);
seq__22032_22332 = G__22355;
chunk__22033_22333 = G__22356;
count__22034_22334 = G__22357;
i__22035_22335 = G__22358;
continue;
}
} else {
}
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row_parts_22331.join("").trim()], 0));


var G__22360 = cljs.core.next(seq__21988_22322__$1);
var G__22361 = null;
var G__22362 = (0);
var G__22363 = (0);
seq__21988_22284 = G__22360;
chunk__21989_22285 = G__22361;
count__21990_22286 = G__22362;
i__21991_22287 = G__22363;
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
var G__22373 = (idx + (1));
var G__22374 = cljs.core.next(s1);
var G__22375 = cljs.core.next(s2);
idx = G__22373;
s1 = G__22374;
s2 = G__22375;
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
