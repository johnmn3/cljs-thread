goog.provide('cljs_thread.eve.shared_atom');








cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ = null;
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.cached_max_descriptors !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.cached_max_descriptors = cljs.core.volatile_BANG_(null);
}
/**
 * Return max-descriptors from cache, config, or SAB header (last resort).
 * Prefers cached value to avoid reading from potentially-corrupted SAB header.
 */
cljs_thread.eve.shared_atom.safe_max_descriptors = (function cljs_thread$eve$shared_atom$safe_max_descriptors(s_atom_env){
var or__5045__auto__ = cljs.core.deref(cljs_thread.eve.shared_atom.cached_max_descriptors);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = (function (){var cfg = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(s_atom_env,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111)], null));
if(cljs.core.truth_(cfg)){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.cached_max_descriptors,cfg);

return cfg;
} else {
return null;
}
})();
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
var or__5045__auto____$2 = (function (){var raw = cljs_thread.eve.util.get_max_block_descriptors(new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env));
if((((raw > (0))) && ((raw < (10000000))))){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.cached_max_descriptors,raw);

return raw;
} else {
return null;
}
})();
if(cljs.core.truth_(or__5045__auto____$2)){
return or__5045__auto____$2;
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[BUG] safe-max-descriptors: no valid source!"], 0));

return (256);
}
}
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.alloc_cursor !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.alloc_cursor = cljs.core.volatile_BANG_((0));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.worker_slot_map !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.worker_slot_map = (new Map());
}
/**
 * Reset the allocation cursor to 0. Call when creating a new SAB environment.
 */
cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_ = (function cljs_thread$eve$shared_atom$reset_alloc_cursor_BANG_(var_args){
var G__22741 = arguments.length;
switch (G__22741) {
case 0:
return cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,(0));

cljs_thread.eve.shared_atom.worker_slot_map.clear();

return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.cached_max_descriptors,null);
}));

(cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (position){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,position);

cljs_thread.eve.shared_atom.worker_slot_map.clear();

return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.cached_max_descriptors,null);
}));

(cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$lang$maxFixedArity = 1);

cljs_thread.eve.shared_atom.get_env = (function cljs_thread$eve$shared_atom$get_env(obj){
var temp__5821__auto__ = obj.parent_atom_domain;
if(cljs.core.truth_(temp__5821__auto__)){
var parent = temp__5821__auto__;
return parent.s_atom_env;
} else {
var temp__5821__auto____$1 = obj.s_atom_env;
if(cljs.core.truth_(temp__5821__auto____$1)){
var sab = temp__5821__auto____$1;
return sab;
} else {
throw (new Error("Error: get-env requires a shared atom or shared private atom."));
}
}
});
/**
 * Compute status/capacity mirror byte offsets from index-view header.
 * Returns [status-mirror-byte-offset capacity-mirror-byte-offset].
 */
cljs_thread.eve.shared_atom.mirror_offsets = (function cljs_thread$eve$shared_atom$mirror_offsets(index_view){
var max_blocks = (index_view[((12) / (4))]);
var desc_end = (cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START + (max_blocks * cljs_thread.eve.data.SIZE_OF_BLOCK_DESCRIPTOR));
var cap_start = (desc_end + (max_blocks * (4)));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [desc_end,cap_start], null);
});
/**
 * Update the status mirror for a descriptor. status-mirror-start is byte offset.
 */
cljs_thread.eve.shared_atom.update_status_mirror_BANG_ = (function cljs_thread$eve$shared_atom$update_status_mirror_BANG_(index_view,status_mirror_start,desc_idx,status){
return (index_view[((status_mirror_start / (4)) + desc_idx)] = status);
});
/**
 * Update the capacity mirror for a descriptor. capacity-mirror-start is byte offset.
 */
cljs_thread.eve.shared_atom.update_capacity_mirror_BANG_ = (function cljs_thread$eve$shared_atom$update_capacity_mirror_BANG_(index_view,capacity_mirror_start,desc_idx,capacity){
return (index_view[((capacity_mirror_start / (4)) + desc_idx)] = capacity);
});
/**
 * Update both status and capacity mirrors for a descriptor.
 * Pass nil for capacity to skip capacity update.
 */
cljs_thread.eve.shared_atom.update_mirrors_BANG_ = (function cljs_thread$eve$shared_atom$update_mirrors_BANG_(index_view,desc_idx,status,capacity){
var vec__22751 = cljs_thread.eve.shared_atom.mirror_offsets(index_view);
var sm = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22751,(0),null);
var cm = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22751,(1),null);
cljs_thread.eve.shared_atom.update_status_mirror_BANG_(index_view,sm,desc_idx,status);

if((!((capacity == null)))){
return cljs_thread.eve.shared_atom.update_capacity_mirror_BANG_(index_view,cm,desc_idx,capacity);
} else {
return null;
}
});
/**
 * Zero out descriptor fields. Does NOT release the lock - caller must do that
 * after all writes are complete to prevent a race where another worker steals
 * the descriptor while we're still writing to it.
 */
cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_ = (function cljs_thread$eve$shared_atom$clear_descriptor_fields_BANG_(index_view,descriptor_idx){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(0),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(4),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(12),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(24),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,descriptor_idx,(-1),(0));

return null;
});
/**
 * Try to CAS-lock a candidate descriptor and allocate it.
 * Returns {:offset :descriptor-idx} on success, nil on failure.
 */
cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_ = (function cljs_thread$eve$shared_atom$try_claim_descriptor_BANG_(index_view,max_descriptors,candidate,requested_size_bytes){
var desc_base = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(candidate);
var lock_field = (desc_base + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,lock_field,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,candidate,(0));
var capacity = cljs_thread.eve.util.read_block_descriptor_field(index_view,candidate,(12));
if((((((status === (0))) || ((status === (-1))))) && ((capacity >= requested_size_bytes)))){
var data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,candidate,(4));
var data_region_start = Atomics.load(index_view,((8) / (4)));
var remainder_size = (capacity - requested_size_bytes);
if((data_offset < data_region_start)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[BUG] alloc: data-offset",data_offset,"< data-region-start",data_region_start,"for desc",candidate,"status",status,"cap",capacity,". Skipping."], 0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(0),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(4),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(12),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,candidate,(-1),(0));

cljs_thread.eve.util.atomic_store_int(index_view,lock_field,(0));

return null;
} else {
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(12),requested_size_bytes);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(0),(1));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,candidate,(1),requested_size_bytes);

if((((status === (0))) && ((remainder_size >= (1))))){
var cursor_start_23755 = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var split_ok_23756 = (function (){var rem_scan = cursor_start_23755;
var wrapped_QMARK_ = false;
while(true){
var rem_scan__$1 = (((rem_scan >= max_descriptors))?(0):rem_scan);
if(((wrapped_QMARK_) && ((rem_scan__$1 >= cursor_start_23755)))){
return false;
} else {
var next_wrapped_QMARK_ = ((wrapped_QMARK_) || (((rem_scan__$1 + (1)) >= max_descriptors)));
if((rem_scan__$1 === candidate)){
var G__23759 = (rem_scan__$1 + (1));
var G__23760 = next_wrapped_QMARK_;
rem_scan = G__23759;
wrapped_QMARK_ = G__23760;
continue;
} else {
var rem_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,rem_scan__$1,(0));
if((rem_status === (-1))){
var rem_desc_base = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(rem_scan__$1);
var rem_lock_field = (rem_desc_base + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,rem_lock_field,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_(index_view,rem_scan__$1);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,rem_scan__$1,(4),(data_offset + requested_size_bytes));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,rem_scan__$1,(12),remainder_size);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,rem_scan__$1,(0),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,rem_scan__$1,(0),remainder_size);

cljs_thread.eve.util.atomic_store_int(index_view,rem_lock_field,(0));

cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,(rem_scan__$1 + (1)));

return true;
} else {
var G__23763 = (rem_scan__$1 + (1));
var G__23764 = next_wrapped_QMARK_;
rem_scan = G__23763;
wrapped_QMARK_ = G__23764;
continue;
}
} else {
var G__23765 = (rem_scan__$1 + (1));
var G__23766 = next_wrapped_QMARK_;
rem_scan = G__23765;
wrapped_QMARK_ = G__23766;
continue;
}
}
}
break;
}
})();
if(split_ok_23756){
} else {
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,candidate,(12),capacity);

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,candidate,(1),capacity);
}
} else {
}

cljs_thread.eve.util.atomic_store_int(index_view,lock_field,(0));

return [data_offset,candidate];
}
} else {
cljs_thread.eve.util.atomic_store_int(index_view,lock_field,(0));

return null;
}
} else {
return null;
}
});
/**
 * JS fallback for batch-alloc when WASM isn't ready.
 * Uses alloc-cursor to avoid rescanning from 0.
 */
cljs_thread.eve.shared_atom.batch_alloc_js = (function cljs_thread$eve$shared_atom$batch_alloc_js(index_view,max_descriptors,requested_size_bytes,max_count){
var results = [];
var cursor_start = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var scan_idx = cursor_start;
var wrapped_QMARK_ = false;
while(true){
var scan_idx__$1 = (((scan_idx >= max_descriptors))?(0):scan_idx);
if((((results.length >= max_count)) || (((wrapped_QMARK_) && ((scan_idx__$1 >= cursor_start)))))){
if((results.length > (0))){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,scan_idx__$1);
} else {
}

return results;
} else {
var next_wrapped_QMARK_ = ((wrapped_QMARK_) || (((scan_idx__$1 + (1)) >= max_descriptors)));
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,scan_idx__$1,(0));
if((((((status === (0))) || ((status === (-1))))) && ((cljs_thread.eve.util.read_block_descriptor_field(index_view,scan_idx__$1,(12)) >= requested_size_bytes)))){
var temp__5821__auto__ = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,scan_idx__$1,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto__)){
var result = temp__5821__auto__;
results.push(result);

var G__23772 = (scan_idx__$1 + (1));
var G__23773 = next_wrapped_QMARK_;
scan_idx = G__23772;
wrapped_QMARK_ = G__23773;
continue;
} else {
var G__23774 = (scan_idx__$1 + (1));
var G__23775 = next_wrapped_QMARK_;
scan_idx = G__23774;
wrapped_QMARK_ = G__23775;
continue;
}
} else {
var G__23780 = (scan_idx__$1 + (1));
var G__23781 = next_wrapped_QMARK_;
scan_idx = G__23780;
wrapped_QMARK_ = G__23781;
continue;
}
}
break;
}
});
/**
 * WASM-accelerated batch-alloc using find_free_descriptor (scalar AoS scan).
 * Uses alloc-cursor to avoid rescanning from 0.
 */
cljs_thread.eve.shared_atom.batch_alloc_wasm = (function cljs_thread$eve$shared_atom$batch_alloc_wasm(index_view,max_descriptors,requested_size_bytes,max_count){
var results = [];
var cursor_start = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var start_idx_23786 = cursor_start;
while(true){
if((((start_idx_23786 < max_descriptors)) && ((results.length < max_count)))){
var candidate_23787 = cljs_thread.eve.wasm_mem.find_free_descriptor(cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START,max_descriptors,requested_size_bytes,start_idx_23786);
if((candidate_23787 === (-1))){
} else {
var temp__5821__auto___23788 = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,candidate_23787,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto___23788)){
var result_23789 = temp__5821__auto___23788;
results.push(result_23789);

var G__23790 = (candidate_23787 + (1));
start_idx_23786 = G__23790;
continue;
} else {
var G__23791 = (candidate_23787 + (1));
start_idx_23786 = G__23791;
continue;
}
}
} else {
}
break;
}

if((((results.length < max_count)) && ((cursor_start > (0))))){
var start_idx_23792 = (0);
while(true){
if((((start_idx_23792 < cursor_start)) && ((results.length < max_count)))){
var candidate_23794 = cljs_thread.eve.wasm_mem.find_free_descriptor(cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START,cursor_start,requested_size_bytes,start_idx_23792);
if((candidate_23794 === (-1))){
} else {
var temp__5821__auto___23795 = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,candidate_23794,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto___23795)){
var result_23796 = temp__5821__auto___23795;
results.push(result_23796);

var G__23797 = (candidate_23794 + (1));
start_idx_23792 = G__23797;
continue;
} else {
var G__23799 = (candidate_23794 + (1));
start_idx_23792 = G__23799;
continue;
}
}
} else {
}
break;
}
} else {
}

if((results.length > (0))){
var last_result_23800 = (results[(results.length - (1))]);
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,((last_result_23800[(1)]) + (1)));
} else {
}

return results;
});
/**
 * SIMD-accelerated batch-alloc using v128 scan over SoA mirror arrays.
 * 4 descriptors per SIMD iteration vs 1 per scalar.
 * Uses alloc-cursor to avoid rescanning from 0.
 */
cljs_thread.eve.shared_atom.batch_alloc_simd = (function cljs_thread$eve$shared_atom$batch_alloc_simd(index_view,max_descriptors,requested_size_bytes,max_count,status_mirror_start,capacity_mirror_start){
var results = [];
var cursor_start = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var start_idx_23801 = cursor_start;
while(true){
if((((start_idx_23801 < max_descriptors)) && ((results.length < max_count)))){
var candidate_23803 = cljs_thread.eve.wasm_mem.find_free_descriptor_simd(status_mirror_start,capacity_mirror_start,max_descriptors,requested_size_bytes,start_idx_23801);
if((candidate_23803 === (-1))){
} else {
var temp__5821__auto___23805 = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,candidate_23803,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto___23805)){
var result_23807 = temp__5821__auto___23805;
results.push(result_23807);

var G__23809 = (candidate_23803 + (1));
start_idx_23801 = G__23809;
continue;
} else {
var G__23810 = (candidate_23803 + (1));
start_idx_23801 = G__23810;
continue;
}
}
} else {
}
break;
}

if((((results.length < max_count)) && ((cursor_start > (0))))){
var start_idx_23812 = (0);
while(true){
if((((start_idx_23812 < cursor_start)) && ((results.length < max_count)))){
var candidate_23813 = cljs_thread.eve.wasm_mem.find_free_descriptor_simd(status_mirror_start,capacity_mirror_start,cursor_start,requested_size_bytes,start_idx_23812);
if((candidate_23813 === (-1))){
} else {
var temp__5821__auto___23814 = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,candidate_23813,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto___23814)){
var result_23820 = temp__5821__auto___23814;
results.push(result_23820);

var G__23822 = (candidate_23813 + (1));
start_idx_23812 = G__23822;
continue;
} else {
var G__23823 = (candidate_23813 + (1));
start_idx_23812 = G__23823;
continue;
}
}
} else {
}
break;
}
} else {
}

if((results.length > (0))){
var last_result_23825 = (results[(results.length - (1))]);
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,((last_result_23825[(1)]) + (1)));
} else {
}

return results;
});
/**
 * Allocate up to `max-count` blocks of `requested-size-bytes` each.
 * Uses SIMD scan over SoA mirrors when available, falls back to scalar WASM,
 * then JS scan.
 * Returns a JS array of #js [offset descriptor-idx] pairs.
 */
cljs_thread.eve.shared_atom.batch_alloc = (function cljs_thread$eve$shared_atom$batch_alloc(s_atom_env,requested_size_bytes,max_count){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
if(cljs.core.truth_(cljs.core.deref(cljs_thread.eve.wasm_mem.wasm_ready))){
var temp__5821__auto__ = new cljs.core.Keyword(null,"status-mirror-start","status-mirror-start",-1959204348).cljs$core$IFn$_invoke$arity$1(s_atom_env);
if(cljs.core.truth_(temp__5821__auto__)){
var sm = temp__5821__auto__;
return cljs_thread.eve.shared_atom.batch_alloc_simd(index_view,max_descriptors,requested_size_bytes,max_count,sm,new cljs.core.Keyword(null,"capacity-mirror-start","capacity-mirror-start",-859463642).cljs$core$IFn$_invoke$arity$1(s_atom_env));
} else {
return cljs_thread.eve.shared_atom.batch_alloc_wasm(index_view,max_descriptors,requested_size_bytes,max_count);
}
} else {
return cljs_thread.eve.shared_atom.batch_alloc_js(index_view,max_descriptors,requested_size_bytes,max_count);
}
});
/**
 * WASM-accelerated single allocation. Uses find_free_descriptor for fast scan.
 * Returns #js [offset descriptor-idx] on success, nil on failure.
 */
cljs_thread.eve.shared_atom.alloc_wasm = (function cljs_thread$eve$shared_atom$alloc_wasm(index_view,max_descriptors,requested_size_bytes,s_atom_env){
var cursor_start = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var start_idx = cursor_start;
var phase = new cljs.core.Keyword(null,"forward","forward",-557345303);
var sweep_polls = (0);
while(true){
var limit = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(phase,new cljs.core.Keyword(null,"forward","forward",-557345303)))?max_descriptors:cursor_start);
var candidate = cljs_thread.eve.wasm_mem.find_free_descriptor(cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START,limit,requested_size_bytes,start_idx);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(candidate,(-1))){
var temp__5821__auto__ = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,candidate,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto__)){
var result = temp__5821__auto__;
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,(candidate + (1)));

return result;
} else {
var G__23829 = (candidate + (1));
var G__23830 = phase;
var G__23831 = sweep_polls;
start_idx = G__23829;
phase = G__23830;
sweep_polls = G__23831;
continue;
}
} else {
var G__22811 = phase;
var G__22811__$1 = (((G__22811 instanceof cljs.core.Keyword))?G__22811.fqn:null);
switch (G__22811__$1) {
case "forward":
if((cursor_start > (0))){
var G__23835 = (0);
var G__23836 = new cljs.core.Keyword(null,"backward","backward",554036364);
var G__23837 = sweep_polls;
start_idx = G__23835;
phase = G__23836;
sweep_polls = G__23837;
continue;
} else {
if((sweep_polls < (4))){
var freed = (cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.call(null, s_atom_env));
if((freed > (0))){
var G__23840 = (0);
var G__23841 = new cljs.core.Keyword(null,"forward","forward",-557345303);
var G__23842 = (sweep_polls + (1));
start_idx = G__23840;
phase = G__23841;
sweep_polls = G__23842;
continue;
} else {
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(((2) * (sweep_polls + (1))));

var G__23844 = (0);
var G__23845 = new cljs.core.Keyword(null,"forward","forward",-557345303);
var G__23846 = (sweep_polls + (1));
start_idx = G__23844;
phase = G__23845;
sweep_polls = G__23846;
continue;
}
} else {
return null;
}
}

break;
case "backward":
if((sweep_polls < (4))){
var freed = (cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.call(null, s_atom_env));
if((freed > (0))){
var G__23847 = (0);
var G__23848 = new cljs.core.Keyword(null,"forward","forward",-557345303);
var G__23849 = (sweep_polls + (1));
start_idx = G__23847;
phase = G__23848;
sweep_polls = G__23849;
continue;
} else {
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(((2) * (sweep_polls + (1))));

var G__23852 = (0);
var G__23853 = new cljs.core.Keyword(null,"forward","forward",-557345303);
var G__23854 = (sweep_polls + (1));
start_idx = G__23852;
phase = G__23853;
sweep_polls = G__23854;
continue;
}
} else {
return null;
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22811__$1)].join('')));

}
}
break;
}
});
/**
 * JS fallback allocation using linear descriptor scan.
 * Returns #js [offset descriptor-idx] on success, nil on failure.
 */
cljs_thread.eve.shared_atom.alloc_js = (function cljs_thread$eve$shared_atom$alloc_js(index_view,max_descriptors,requested_size_bytes,s_atom_env){
var cursor_start = cljs.core.mod(cljs.core.deref(cljs_thread.eve.shared_atom.alloc_cursor),max_descriptors);
var scan_idx = cursor_start;
var wrapped_QMARK_ = false;
var sweep_polls = (0);
while(true){
var scan_idx__$1 = (((scan_idx >= max_descriptors))?(0):scan_idx);
if(((wrapped_QMARK_) && ((scan_idx__$1 >= cursor_start)))){
if((sweep_polls < (4))){
var freed = (cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.call(null, s_atom_env));
if((freed > (0))){
var G__23859 = (0);
var G__23860 = false;
var G__23861 = (sweep_polls + (1));
scan_idx = G__23859;
wrapped_QMARK_ = G__23860;
sweep_polls = G__23861;
continue;
} else {
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(((2) * (sweep_polls + (1))));

var G__23862 = (0);
var G__23863 = false;
var G__23864 = (sweep_polls + (1));
scan_idx = G__23862;
wrapped_QMARK_ = G__23863;
sweep_polls = G__23864;
continue;
}
} else {
return null;
}
} else {
var next_wrapped_QMARK_ = ((wrapped_QMARK_) || (((scan_idx__$1 + (1)) >= max_descriptors)));
var current_status_nolock = cljs_thread.eve.util.read_block_descriptor_field(index_view,scan_idx__$1,(0));
if((((((current_status_nolock === (0))) || ((current_status_nolock === (-1))))) && ((cljs_thread.eve.util.read_block_descriptor_field(index_view,scan_idx__$1,(12)) >= requested_size_bytes)))){
var temp__5821__auto__ = cljs_thread.eve.shared_atom.try_claim_descriptor_BANG_(index_view,max_descriptors,scan_idx__$1,requested_size_bytes);
if(cljs.core.truth_(temp__5821__auto__)){
var result = temp__5821__auto__;
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,(scan_idx__$1 + (1)));

return result;
} else {
var G__23867 = (scan_idx__$1 + (1));
var G__23868 = next_wrapped_QMARK_;
var G__23869 = sweep_polls;
scan_idx = G__23867;
wrapped_QMARK_ = G__23868;
sweep_polls = G__23869;
continue;
}
} else {
var G__23871 = (scan_idx__$1 + (1));
var G__23872 = next_wrapped_QMARK_;
var G__23873 = sweep_polls;
scan_idx = G__23871;
wrapped_QMARK_ = G__23872;
sweep_polls = G__23873;
continue;
}
}
break;
}
});
cljs_thread.eve.shared_atom.status_name = (function cljs_thread$eve$shared_atom$status_name(s){
var pred__22852 = cljs.core._EQ__EQ_;
var expr__22853 = s;
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((0),expr__22853) : pred__22852.call(null, (0),expr__22853)))){
return "FREE";
} else {
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((1),expr__22853) : pred__22852.call(null, (1),expr__22853)))){
return "ALLOC";
} else {
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((3),expr__22853) : pred__22852.call(null, (3),expr__22853)))){
return "EMBED";
} else {
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((4),expr__22853) : pred__22852.call(null, (4),expr__22853)))){
return "ORPHAN";
} else {
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((5),expr__22853) : pred__22852.call(null, (5),expr__22853)))){
return "RETIRE";
} else {
if(cljs.core.truth_((pred__22852.cljs$core$IFn$_invoke$arity$2 ? pred__22852.cljs$core$IFn$_invoke$arity$2((-1),expr__22853) : pred__22852.call(null, (-1),expr__22853)))){
return "ZEROED";
} else {
return ["?",cljs.core.str.cljs$core$IFn$_invoke$arity$1(s)].join('');
}
}
}
}
}
}
});
/**
 * TELESCOPE: High-level SAB memory overview.
 * Shows status distribution, capacity per status, fragmentation index,
 * free block size histogram, and utilization.
 */
cljs_thread.eve.shared_atom.dump_block_stats_BANG_ = (function cljs_thread$eve$shared_atom$dump_block_stats_BANG_(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var counts = [(0),(0),(0),(0),(0),(0),(0),(0)];
var cap_by_status = [(0),(0),(0),(0),(0),(0),(0),(0)];
var free_sizes = [];
var retired_sizes = [];
var alloc_sizes = [];
var free_blocks_sorted = [];
var total_data_region = cljs.core.volatile_BANG_((0));
var n__5636__auto___23874 = max_descriptors;
var i_23875 = (0);
while(true){
if((i_23875 < n__5636__auto___23874)){
var status_23876 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23875,(0));
var cap_23877 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23875,(12));
var off_23878 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23875,(4));
var sidx_23879 = (((status_23876 === (-1)))?(7):(((((status_23876 >= (0))) && ((status_23876 < (7)))))?status_23876:(6)
));
(counts[sidx_23879] = ((counts[sidx_23879]) + (1)));

(cap_by_status[sidx_23879] = ((cap_by_status[sidx_23879]) + cap_23877));

if((cap_23877 > (0))){
total_data_region.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (total_data_region.cljs$core$IDeref$_deref$arity$1(null, ) + cap_23877));
} else {
}

if((status_23876 === (0))){
free_sizes.push(cap_23877);

free_blocks_sorted.push([off_23878,cap_23877,i_23875]);
} else {
}

if((status_23876 === (5))){
retired_sizes.push(cap_23877);
} else {
}

if((status_23876 === (1))){
alloc_sizes.push(cap_23877);
} else {
}

var G__23883 = (i_23875 + (1));
i_23875 = G__23883;
continue;
} else {
}
break;
}

free_blocks_sorted.sort((function (a,b){
return ((a[(0)]) - (b[(0)]));
}));

free_sizes.sort((function (a,b){
return (b - a);
}));

retired_sizes.sort((function (a,b){
return (b - a);
}));

alloc_sizes.sort((function (a,b){
return (b - a);
}));

var flen = free_blocks_sorted.length;
var adj_pairs = (function (){var i = (0);
var pairs = (0);
while(true){
if(((i + (1)) >= flen)){
return pairs;
} else {
var a = (free_blocks_sorted[i]);
var b = (free_blocks_sorted[(i + (1))]);
var G__23890 = (i + (1));
var G__23891 = (((((a[(0)]) + (a[(1)])) === (b[(0)])))?(pairs + (1)):pairs);
i = G__23890;
pairs = G__23891;
continue;
}
break;
}
})();
var free_count = (counts[(0)]);
var alloc_count = (counts[(1)]);
var retired_count = (counts[(5)]);
var orphan_count = (counts[(4)]);
var zeroed_count = (counts[(7)]);
var embed_count = (counts[(3)]);
var total_free_cap = (cap_by_status[(0)]);
var total_alloc_cap = (cap_by_status[(1)]);
var total_retired_cap = (cap_by_status[(5)]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["\n=== [TELESCOPE] SAB Memory Overview ==="], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  Descriptors: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_descriptors)," total"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  | FREE=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(free_count)," ALLOC=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alloc_count)," RETIRED=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(retired_count)," ORPHAN=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(orphan_count)," EMBED=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(embed_count)," ZEROED=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(zeroed_count)].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  Capacity (bytes):"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  | free=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_free_cap)," alloc=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_alloc_cap)," retired=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_retired_cap)].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  Utilization: ",(((cljs.core.deref(total_data_region) > (0)))?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(Math.round(((100) * (total_alloc_cap / cljs.core.deref(total_data_region))))),"%"].join(''):"N/A")," (alloc / total tracked)"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  Fragmentation: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(free_count)," free regions",(((adj_pairs > (0)))?[", ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(adj_pairs)," ADJACENT UNCOALESCED PAIRS!"].join(''):null),(((free_count > (0)))?[", avg=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(Math.round((total_free_cap / free_count))),"B"].join(''):null)].join('')], 0));

if((free_sizes.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  Free blocks (top 5 largest):"], 0));

var n__5636__auto___23894 = (function (){var x__5133__auto__ = (5);
var y__5134__auto__ = free_sizes.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i_23895 = (0);
while(true){
if((i_23895 < n__5636__auto___23894)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    #",cljs.core.str.cljs$core$IFn$_invoke$arity$1((i_23895 + (1))),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((free_sizes[i_23895]))," bytes"].join('')], 0));

var G__23896 = (i_23895 + (1));
i_23895 = G__23896;
continue;
} else {
}
break;
}

if((free_sizes.length > (5))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  Free blocks (5 smallest):"], 0));

var n__5636__auto___23897 = (function (){var x__5133__auto__ = (5);
var y__5134__auto__ = free_sizes.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i_23900 = (0);
while(true){
if((i_23900 < n__5636__auto___23897)){
var j_23901 = ((free_sizes.length - (1)) - i_23900);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    #",cljs.core.str.cljs$core$IFn$_invoke$arity$1((free_sizes.length - i_23900)),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((free_sizes[j_23901]))," bytes"].join('')], 0));

var G__23902 = (i_23900 + (1));
i_23900 = G__23902;
continue;
} else {
}
break;
}
} else {
}
} else {
}

if((retired_sizes.length > (0))){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  Retired blocks (top 3): ",clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__22864_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__22864_SHARP_),"B"].join('');
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2((3),retired_sizes)))].join('')], 0));
} else {
return null;
}
});
/**
 * MICROSCOPE: Low-level physical memory layout.
 * Shows the data region sorted by physical offset with status of each block,
 * contiguous runs, gaps, and per-block detail.
 */
cljs_thread.eve.shared_atom.dump_block_detail_BANG_ = (function cljs_thread$eve$shared_atom$dump_block_detail_BANG_(var_args){
var G__22909 = arguments.length;
switch (G__22909) {
case 1:
return cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (s_atom_env){
return cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$2(s_atom_env,null);
}));

(cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (s_atom_env,p__22914){
var map__22915 = p__22914;
var map__22915__$1 = cljs.core.__destructure_map(map__22915);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22915__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var offset_range = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22915__$1,new cljs.core.Keyword(null,"offset-range","offset-range",-2067790683));
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var blocks = [];
var n__5636__auto___23904 = max_descriptors;
var i_23905 = (0);
while(true){
if((i_23905 < n__5636__auto___23904)){
var status_23906 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23905,(0));
if((status_23906 === (-1))){
} else {
var off_23907 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23905,(4));
var cap_23908 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23905,(12));
var len_23909 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23905,(8));
var epoch_23910 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23905,(24));
if((((cap_23908 > (0))) && ((((offset_range == null)) || ((((off_23907 >= cljs.core.first(offset_range))) && ((off_23907 < cljs.core.second(offset_range))))))))){
blocks.push([off_23907,cap_23908,status_23906,i_23905,len_23909,epoch_23910]);
} else {
}
}

var G__23912 = (i_23905 + (1));
i_23905 = G__23912;
continue;
} else {
}
break;
}

blocks.sort((function (a,b){
return ((a[(0)]) - (b[(0)]));
}));

var blen = blocks.length;
var show_count = (cljs.core.truth_(limit)?(function (){var x__5133__auto__ = limit;
var y__5134__auto__ = blen;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})():blen);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n=== [MICROSCOPE] Physical Memory Layout (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(blen)," blocks) ==="].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  offset      | capacity  | status  | desc-idx | data-len | epoch | notes"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ------------|-----------|---------|----------|----------|-------|------"], 0));

var i_23913 = (0);
var prev_end_23914 = (-1);
var run_status_23915 = (-99);
var run_start_23916 = (0);
var run_count_23917 = (0);
while(true){
if((i_23913 >= show_count)){
if((run_count_23917 > (1))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    ^ run of ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_count_23917)," ",cljs_thread.eve.shared_atom.status_name(run_status_23915)," blocks"].join('')], 0));
} else {
}
} else {
var b_23918 = (blocks[i_23913]);
var off_23919 = (b_23918[(0)]);
var cap_23920 = (b_23918[(1)]);
var status_23921 = (b_23918[(2)]);
var desc_idx_23922 = (b_23918[(3)]);
var data_len_23923 = (b_23918[(4)]);
var epoch_23924 = (b_23918[(5)]);
var gap_23925 = (((prev_end_23914 > (0)))?(off_23919 - prev_end_23914):null);
var adjacent_QMARK__23926 = (function (){var and__5043__auto__ = gap_23925;
if(cljs.core.truth_(and__5043__auto__)){
return (gap_23925 === (0));
} else {
return and__5043__auto__;
}
})();
var has_gap_QMARK__23927 = (function (){var and__5043__auto__ = gap_23925;
if(cljs.core.truth_(and__5043__auto__)){
return (gap_23925 > (0));
} else {
return and__5043__auto__;
}
})();
var overlap_QMARK__23928 = (function (){var and__5043__auto__ = gap_23925;
if(cljs.core.truth_(and__5043__auto__)){
return (gap_23925 < (0));
} else {
return and__5043__auto__;
}
})();
var same_run_QMARK__23929 = (status_23921 === run_status_23915);
if((((!(same_run_QMARK__23929))) && ((run_count_23917 > (1))))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    ^ run of ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_count_23917)," ",cljs_thread.eve.shared_atom.status_name(run_status_23915)," blocks"].join('')], 0));
} else {
}

if(cljs.core.truth_(has_gap_QMARK__23927)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  *** GAP: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(gap_23925)," bytes untracked ***"].join('')], 0));
} else {
}

if(cljs.core.truth_(overlap_QMARK__23928)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  *** OVERLAP: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((- gap_23925))," bytes ***"].join('')], 0));
} else {
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(off_23919);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((12) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(cap_23920);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((9) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs_thread.eve.shared_atom.status_name(status_23921);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((7) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(desc_idx_23922);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((8) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_len_23923);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((8) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_23924);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((5) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(cljs.core.truth_(adjacent_QMARK__23926)?((same_run_QMARK__23929)?"adj":"adj-DIFF!"):null)].join('')], 0));

var G__23930 = (i_23913 + (1));
var G__23931 = (off_23919 + cap_23920);
var G__23932 = ((same_run_QMARK__23929)?run_status_23915:status_23921);
var G__23933 = ((same_run_QMARK__23929)?run_start_23916:i_23913);
var G__23934 = ((same_run_QMARK__23929)?(run_count_23917 + (1)):(1));
i_23913 = G__23930;
prev_end_23914 = G__23931;
run_status_23915 = G__23932;
run_start_23916 = G__23933;
run_count_23917 = G__23934;
continue;
}
break;
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["=== [/MICROSCOPE] ===\n"], 0));
}));

(cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$lang$maxFixedArity = 2);

if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.xray_frames !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.xray_frames = [];
}
cljs_thread.eve.shared_atom.XRAY_MAX_FRAMES = (20);
cljs_thread.eve.shared_atom.xray_status_char = (function cljs_thread$eve$shared_atom$xray_status_char(s){
var pred__22971 = cljs.core._EQ__EQ_;
var expr__22972 = s;
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((0),expr__22972) : pred__22971.call(null, (0),expr__22972)))){
return ".";
} else {
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((1),expr__22972) : pred__22971.call(null, (1),expr__22972)))){
return "#";
} else {
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((5),expr__22972) : pred__22971.call(null, (5),expr__22972)))){
return "R";
} else {
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((3),expr__22972) : pred__22971.call(null, (3),expr__22972)))){
return "E";
} else {
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((4),expr__22972) : pred__22971.call(null, (4),expr__22972)))){
return "O";
} else {
if(cljs.core.truth_((pred__22971.cljs$core$IFn$_invoke$arity$2 ? pred__22971.cljs$core$IFn$_invoke$arity$2((2),expr__22972) : pred__22971.call(null, (2),expr__22972)))){
return "L";
} else {
return "?";
}
}
}
}
}
}
});
/**
 * Render a row of ASCII art for a byte range [region-start, region-start+region-size).
 * blocks is sorted JS array of #js [off cap status desc-idx].
 * Returns a string of `width` chars.
 */
cljs_thread.eve.shared_atom.xray_render_row = (function cljs_thread$eve$shared_atom$xray_render_row(blocks,region_start,region_size,width,char_fn){
var bytes_per_col = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = Math.ceil((region_size / width));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var row = (new Array(width));
var n__5636__auto___23935 = width;
var c_23936 = (0);
while(true){
if((c_23936 < n__5636__auto___23935)){
(row[c_23936] = " ");

var G__23937 = (c_23936 + (1));
c_23936 = G__23937;
continue;
} else {
}
break;
}

var n__5636__auto___23938 = blocks.length;
var bi_23939 = (0);
while(true){
if((bi_23939 < n__5636__auto___23938)){
var b_23940 = (blocks[bi_23939]);
var off_23941 = (b_23940[(0)]);
var cap_23942 = (b_23940[(1)]);
var status_23943 = (b_23940[(2)]);
var end_23944 = (off_23941 + cap_23942);
var vis_start_23945 = (function (){var x__5130__auto__ = off_23941;
var y__5131__auto__ = region_start;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var vis_end_23946 = (function (){var x__5133__auto__ = end_23944;
var y__5134__auto__ = (region_start + region_size);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
if((vis_start_23945 < vis_end_23946)){
var col_start_23947 = Math.floor(((vis_start_23945 - region_start) / bytes_per_col));
var col_end_23948 = Math.ceil(((vis_end_23946 - region_start) / bytes_per_col));
var ch_23949 = (char_fn.cljs$core$IFn$_invoke$arity$1 ? char_fn.cljs$core$IFn$_invoke$arity$1(status_23943) : char_fn.call(null, status_23943));
var c_23950 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = col_start_23947;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
while(true){
if((c_23950 < (function (){var x__5133__auto__ = width;
var y__5134__auto__ = col_end_23948;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())){
(row[c_23950] = ch_23949);

var G__23951 = (c_23950 + (1));
c_23950 = G__23951;
continue;
} else {
}
break;
}
} else {
}

var G__23952 = (bi_23939 + (1));
bi_23939 = G__23952;
continue;
} else {
}
break;
}

return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.seq(row));
});
/**
 * Scan all descriptors. Checks 12 categories of invariants:
 * 1. Tiling completeness (sum capacities == data region size)
 * 2. No gaps (no unaccounted byte ranges)
 * 3. No overlaps (no two descriptors claim same bytes)
 * 4. Mirror consistency (AoS descriptor table == SoA mirror arrays)
 * 5. Content-capacity bound (data_length <= block_capacity for all descriptors)
 * 6. Block region bounds (offset + capacity within data region)
 * 7. Free coalescence (no two adjacent FREE blocks — should have been merged)
 * 8. ZEROED means empty (ZEROED descriptors have cap=0 and off=0)
 * 9. Lock hygiene (FREE blocks have lock_owner=0)
 *   10. Epoch validity (RETIRED blocks have 0 < retired_epoch <= global_epoch)
 *   11. Global epoch >= all worker epochs
 *   12. Worker slot hygiene (no stale workers holding epoch protection)
 * 
 * Returns {:blocks sorted-js-arr :mirror-blocks sorted-js-arr
 *          :gaps js-arr :overlaps js-arr
 *          :mirror-mismatches js-arr :descriptor-errors js-arr
 *          :total-tracked int :data-start int :data-size int
 *          :desc-table js-arr-of-detail-maps}.
 * 
 * blocks = descriptor table view (SAB truth)
 * mirror-blocks = mirror array view (redundant copy, should match)
 */
cljs_thread.eve.shared_atom.xray_scan = (function cljs_thread$eve$shared_atom$xray_scan(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var sab_total = cljs_thread.eve.util.get_sab_total_size(index_view);
var data_start = cljs_thread.eve.util.get_data_region_start_offset(index_view);
var data_size = (sab_total - data_start);
var data_end = (data_start + data_size);
var global_epoch = Atomics.load(index_view,((20) / (4)));
var vec__22988 = cljs_thread.eve.shared_atom.mirror_offsets(index_view);
var sm_start = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22988,(0),null);
var cm_start = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22988,(1),null);
var blocks = [];
var mirror_blocks = [];
var desc_table = [];
var mirror_mismatches = [];
var descriptor_errors = [];
var total_tracked = cljs.core.volatile_BANG_((0));
var n__5636__auto___23953 = max_descriptors;
var i_23954 = (0);
while(true){
if((i_23954 < n__5636__auto___23953)){
var status_23955 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(0));
var off_23956 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(4));
var cap_23957 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(12));
var data_len_23958 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(8));
var val_desc_23959 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(16));
var lock_23960 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(20));
var epoch_23961 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_23954,(24));
var mirror_status_23962 = (index_view[((sm_start / (4)) + i_23954)]);
var mirror_cap_23963 = (index_view[((cm_start / (4)) + i_23954)]);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23955,mirror_status_23962)){
mirror_mismatches.push([i_23954,"status",status_23955,mirror_status_23962]);
} else {
}

if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23955,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(cap_23957,mirror_cap_23963)))){
mirror_mismatches.push([i_23954,"capacity",cap_23957,mirror_cap_23963]);
} else {
}

if((status_23955 === (-1))){
if((((!((cap_23957 === (0))))) || ((((!((off_23956 === (0))))) || ((!((data_len_23958 === (0))))))))){
descriptor_errors.push([i_23954,"ZEROED_NOT_EMPTY",["cap=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cap_23957)," off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(off_23956)," len=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_len_23958)].join('')]);
} else {
}
} else {
}

if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23955,(-1))){
desc_table.push([i_23954,status_23955,off_23956,cap_23957,data_len_23958,val_desc_23959,lock_23960,epoch_23961,mirror_status_23962,mirror_cap_23963]);

if((((status_23955 === (1))) && ((data_len_23958 > cap_23957)))){
descriptor_errors.push([i_23954,"DATA_EXCEEDS_CAP",["data_len=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_len_23958)," > cap=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cap_23957)].join('')]);
} else {
}

if((((cap_23957 > (0))) && ((((off_23956 < data_start)) || (((off_23956 + cap_23957) > data_end)))))){
descriptor_errors.push([i_23954,"OUT_OF_BOUNDS",["off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(off_23956)," cap=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cap_23957)," range=[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(off_23956),",",cljs.core.str.cljs$core$IFn$_invoke$arity$1((off_23956 + cap_23957)),") data=[",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_start),",",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_end),")"].join('')]);
} else {
}

if((((status_23955 === (0))) && ((!((lock_23960 === (0))))))){
descriptor_errors.push([i_23954,"FREE_WITH_LOCK",["lock_owner=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(lock_23960)," on FREE block"].join('')]);
} else {
}

if((status_23955 === (5))){
if((((epoch_23961 <= (0))) || ((epoch_23961 > global_epoch)))){
descriptor_errors.push([i_23954,"BAD_RETIRED_EPOCH",["retired_epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_23961)," global_epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(global_epoch)].join('')]);
} else {
}
} else {
}

if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23955,(5))) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23955,(3))) && ((!((epoch_23961 === (0))))))))){
descriptor_errors.push([i_23954,"STALE_EPOCH",["status=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(status_23955)," but retired_epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(epoch_23961)].join('')]);
} else {
}

if((cap_23957 > (0))){
total_tracked.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (total_tracked.cljs$core$IDeref$_deref$arity$1(null, ) + cap_23957));

blocks.push([off_23956,cap_23957,status_23955,i_23954]);
} else {
}

if((mirror_cap_23963 > (0))){
mirror_blocks.push([off_23956,mirror_cap_23963,mirror_status_23962,i_23954]);
} else {
}
} else {
}

var G__23965 = (i_23954 + (1));
i_23954 = G__23965;
continue;
} else {
}
break;
}

blocks.sort((function (a,b){
return ((a[(0)]) - (b[(0)]));
}));

mirror_blocks.sort((function (a,b){
return ((a[(0)]) - (b[(0)]));
}));

var interior_gaps = [];
var overlaps = [];
var adjacent_free = [];
var blen = blocks.length;
var prev_end = cljs.core.volatile_BANG_(data_start);
var prev_status = cljs.core.volatile_BANG_((-99));
var prev_idx = cljs.core.volatile_BANG_((-1));
var trailing_unallocated = cljs.core.volatile_BANG_(null);
if((((blen > (0))) && ((((blocks[(0)])[(0)]) > data_start)))){
interior_gaps.push([data_start,(((blocks[(0)])[(0)]) - data_start)]);
} else {
}

var n__5636__auto___23966 = blen;
var bi_23967 = (0);
while(true){
if((bi_23967 < n__5636__auto___23966)){
var b_23968 = (blocks[bi_23967]);
var off_23969 = (b_23968[(0)]);
var cap_23970 = (b_23968[(1)]);
var status_23971 = (b_23968[(2)]);
var idx_23972 = (b_23968[(3)]);
var end_23973 = (off_23969 + cap_23970);
if((off_23969 > cljs.core.deref(prev_end))){
interior_gaps.push([cljs.core.deref(prev_end),(off_23969 - cljs.core.deref(prev_end))]);
} else {
}

if((off_23969 < cljs.core.deref(prev_end))){
overlaps.push([off_23969,(cljs.core.deref(prev_end) - off_23969)]);
} else {
}

if((((status_23971 === (0))) && ((((cljs.core.deref(prev_status) === (0))) && ((off_23969 === cljs.core.deref(prev_end))))))){
adjacent_free.push([cljs.core.deref(prev_idx),idx_23972,off_23969]);
} else {
}

cljs.core.vreset_BANG_(prev_end,(function (){var x__5130__auto__ = cljs.core.deref(prev_end);
var y__5131__auto__ = end_23973;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})());

cljs.core.vreset_BANG_(prev_status,status_23971);

cljs.core.vreset_BANG_(prev_idx,idx_23972);

var G__23975 = (bi_23967 + (1));
bi_23967 = G__23975;
continue;
} else {
}
break;
}

if((cljs.core.deref(prev_end) < data_end)){
cljs.core.vreset_BANG_(trailing_unallocated,[cljs.core.deref(prev_end),(data_end - cljs.core.deref(prev_end))]);
} else {
}

var worker_epoch_errors = [];
var n__5636__auto___23976 = (256);
var slot_idx_23977 = (0);
while(true){
if((slot_idx_23977 < n__5636__auto___23976)){
var slot_byte_offset_23978 = ((24) + (slot_idx_23977 * (24)));
var slot_i32_23979 = (slot_byte_offset_23978 / (4));
var w_status_23980 = (index_view[slot_i32_23979]);
var w_epoch_23981 = (index_view[(slot_i32_23979 + (1))]);
if((((w_status_23980 === (1))) && ((((w_epoch_23981 > (0))) && ((w_epoch_23981 > global_epoch)))))){
worker_epoch_errors.push([slot_idx_23977,w_epoch_23981,global_epoch]);
} else {
}

var G__23982 = (slot_idx_23977 + (1));
slot_idx_23977 = G__23982;
continue;
} else {
}
break;
}

return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"data-size","data-size",-1468859869),new cljs.core.Keyword(null,"data-start","data-start",39401796),new cljs.core.Keyword(null,"descriptor-errors","descriptor-errors",-828905020),new cljs.core.Keyword(null,"mirror-mismatches","mirror-mismatches",-107539188),new cljs.core.Keyword(null,"mirror-blocks","mirror-blocks",697947982),new cljs.core.Keyword(null,"gaps","gaps",511246449),new cljs.core.Keyword(null,"overlaps","overlaps",1398230580),new cljs.core.Keyword(null,"blocks","blocks",-610462153),new cljs.core.Keyword(null,"adjacent-free","adjacent-free",729367511),new cljs.core.Keyword(null,"worker-epoch-errors","worker-epoch-errors",-943920389),new cljs.core.Keyword(null,"total-tracked","total-tracked",554857020),new cljs.core.Keyword(null,"trailing-unallocated","trailing-unallocated",-177402148),new cljs.core.Keyword(null,"desc-table","desc-table",-534113284)],[data_size,data_start,descriptor_errors,mirror_mismatches,mirror_blocks,interior_gaps,overlaps,blocks,adjacent_free,worker_epoch_errors,cljs.core.deref(total_tracked),cljs.core.deref(trailing_unallocated),desc_table]);
});
/**
 * Find the byte range where most of the action is (non-FREE blocks).
 * Returns [zoom-start zoom-size] covering allocations with some padding.
 * NOTE: Kept for debugging/visualization - prefix indicates intentional non-use.
 */
cljs_thread.eve.shared_atom._xray_find_active_region = (function cljs_thread$eve$shared_atom$_xray_find_active_region(blocks,data_start,data_size){
var blen = blocks.length;
if((blen === (0))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [data_start,data_size], null);
} else {
var min_off = cljs.core.volatile_BANG_((data_start + data_size));
var max_end = cljs.core.volatile_BANG_(data_start);
var n__5636__auto___23983 = blen;
var bi_23984 = (0);
while(true){
if((bi_23984 < n__5636__auto___23983)){
var b_23985 = (blocks[bi_23984]);
var off_23986 = (b_23985[(0)]);
var cap_23987 = (b_23985[(1)]);
var status_23988 = (b_23985[(2)]);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_23988,(0))){
min_off.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (function (){var x__5133__auto__ = min_off.cljs$core$IDeref$_deref$arity$1(null, );
var y__5134__auto__ = off_23986;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})());

max_end.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (function (){var x__5130__auto__ = max_end.cljs$core$IDeref$_deref$arity$1(null, );
var y__5131__auto__ = (off_23986 + cap_23987);
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})());
} else {
}

var G__23993 = (bi_23984 + (1));
bi_23984 = G__23993;
continue;
} else {
}
break;
}

if((cljs.core.deref(min_off) >= cljs.core.deref(max_end))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [data_start,(function (){var x__5133__auto__ = data_size;
var y__5134__auto__ = (4096);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})()], null);
} else {
var range_size = (cljs.core.deref(max_end) - cljs.core.deref(min_off));
var pad = (function (){var x__5130__auto__ = (64);
var y__5131__auto__ = Math.ceil((range_size * 0.1));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var zoom_start = (function (){var x__5130__auto__ = data_start;
var y__5131__auto__ = (cljs.core.deref(min_off) - pad);
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var zoom_end = (function (){var x__5133__auto__ = (data_start + data_size);
var y__5134__auto__ = (cljs.core.deref(max_end) + pad);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [zoom_start,(zoom_end - zoom_start)], null);
}
}
});
/**
 * X-RAY: ASCII art invariant checker with SAB vs MIRROR views side-by-side.
 * 
 * TELESCOPE (SAB): Descriptor table view - the allocator's truth
 * MICROSCOPE (MIRROR): Mirror array view - redundant copy for fast scan
 * If these differ, memory is corrupted. Rendered side-by-side for comparison.
 * 
 * Captures each frame in a rolling buffer. On failure, replays the last
 * N frames so you can see the transitions that led to the break.
 * 
 * Returns {:valid? bool :gaps [...] :overlaps [...] :mirror-mismatches [...]
 *          :frame-history [...]}.
 */
cljs_thread.eve.shared_atom.validate_storage_model_BANG_ = (function cljs_thread$eve$shared_atom$validate_storage_model_BANG_(var_args){
var G__23040 = arguments.length;
switch (G__23040) {
case 1:
return cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (s_atom_env){
return cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2(s_atom_env,null);
}));

(cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (s_atom_env,p__23043){
var map__23044 = p__23043;
var map__23044__$1 = cljs.core.__destructure_map(map__23044);
var width = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23044__$1,new cljs.core.Keyword(null,"width","width",-384071477),(80));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23044__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var map__23047 = cljs_thread.eve.shared_atom.xray_scan(s_atom_env);
var map__23047__$1 = cljs.core.__destructure_map(map__23047);
var worker_epoch_errors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"worker-epoch-errors","worker-epoch-errors",-943920389));
var total_tracked = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"total-tracked","total-tracked",554857020));
var trailing_unallocated = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"trailing-unallocated","trailing-unallocated",-177402148));
var desc_table = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"desc-table","desc-table",-534113284));
var data_size = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"data-size","data-size",-1468859869));
var descriptor_errors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"descriptor-errors","descriptor-errors",-828905020));
var data_start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"data-start","data-start",39401796));
var mirror_mismatches = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"mirror-mismatches","mirror-mismatches",-107539188));
var mirror_blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"mirror-blocks","mirror-blocks",697947982));
var gaps = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"gaps","gaps",511246449));
var overlaps = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"overlaps","overlaps",1398230580));
var blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"blocks","blocks",-610462153));
var adjacent_free = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23047__$1,new cljs.core.Keyword(null,"adjacent-free","adjacent-free",729367511));
var blen = blocks.length;
var bar_w = (function (){var x__5130__auto__ = (16);
var y__5131__auto__ = cljs.core.quot((width - (8)),(2));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var pad_str = (function (s,n){
var len = cljs.core.count(s);
if((len >= n)){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(s,(0),n);
} else {
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(s),cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((n - len)," ")))].join('');
}
});
var col_w = (bar_w + (2));
var telescope_model = cljs_thread.eve.shared_atom.xray_render_row(blocks,data_start,data_size,bar_w,cljs_thread.eve.shared_atom.xray_status_char);
var micro_model = cljs_thread.eve.shared_atom.xray_render_row(mirror_blocks,data_start,data_size,bar_w,cljs_thread.eve.shared_atom.xray_status_char);
var diff_row = (function (){var t_arr = cljs.core.to_array(telescope_model);
var m_arr = cljs.core.to_array(micro_model);
var d_arr = (new Array(bar_w));
var n__5636__auto___23999 = bar_w;
var i_24000 = (0);
while(true){
if((i_24000 < n__5636__auto___23999)){
(d_arr[i_24000] = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((t_arr[i_24000]),(m_arr[i_24000])))?"-":"X"));

var G__24001 = (i_24000 + (1));
i_24000 = G__24001;
continue;
} else {
}
break;
}

return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.seq(d_arr));
})();
var has_view_diff = (diff_row.indexOf("X") >= (0));
var interior_gap_bytes = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23028_SHARP_){
return (p1__23028_SHARP_[(1)]);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(gaps)));
var trailing_bytes = (cljs.core.truth_(trailing_unallocated)?(trailing_unallocated[(1)]):(0));
var valid_QMARK_ = (((gaps.length === (0))) && ((((overlaps.length === (0))) && ((((mirror_mismatches.length === (0))) && ((((descriptor_errors.length === (0))) && ((((adjacent_free.length === (0))) && ((((worker_epoch_errors.length === (0))) && ((!(has_view_diff))))))))))))));
var telescope_tiling = cljs_thread.eve.shared_atom.xray_render_row(blocks,data_start,data_size,bar_w,(function (_){
return "-";
}));
var tiling_arr = cljs.core.to_array(telescope_tiling);
var _ = (function (){var n__5636__auto__ = gaps.length;
var gi = (0);
while(true){
if((gi < n__5636__auto__)){
var g_24002 = (gaps[gi]);
var g_off_24003 = (g_24002[(0)]);
var g_size_24004 = (g_24002[(1)]);
var bpc_24005 = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = Math.ceil((data_size / bar_w));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var c0_24006 = Math.floor(((g_off_24003 - data_start) / bpc_24005));
var c1_24007 = Math.ceil((((g_off_24003 + g_size_24004) - data_start) / bpc_24005));
var c_24009 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = c0_24006;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
while(true){
if((c_24009 < (function (){var x__5133__auto__ = bar_w;
var y__5134__auto__ = c1_24007;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())){
(tiling_arr[c_24009] = "?");

var G__24011 = (c_24009 + (1));
c_24009 = G__24011;
continue;
} else {
}
break;
}

var G__24012 = (gi + (1));
gi = G__24012;
continue;
} else {
return null;
}
break;
}
})();
var ___$1 = (function (){var n__5636__auto__ = overlaps.length;
var oi = (0);
while(true){
if((oi < n__5636__auto__)){
var o_24013 = (overlaps[oi]);
var o_off_24014 = (o_24013[(0)]);
var o_size_24015 = (o_24013[(1)]);
var bpc_24016 = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = Math.ceil((data_size / bar_w));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var c0_24017 = Math.floor(((o_off_24014 - data_start) / bpc_24016));
var c1_24018 = Math.ceil((((o_off_24014 + o_size_24015) - data_start) / bpc_24016));
var c_24020 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = c0_24017;
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
while(true){
if((c_24020 < (function (){var x__5133__auto__ = bar_w;
var y__5134__auto__ = c1_24018;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())){
(tiling_arr[c_24020] = "X");

var G__24021 = (c_24020 + (1));
c_24020 = G__24021;
continue;
} else {
}
break;
}

var G__24022 = (oi + (1));
oi = G__24022;
continue;
} else {
return null;
}
break;
}
})();
var telescope_tiling_final = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.seq(tiling_arr));
var desc_counts = (function (){var c = ({"free": (0), "alloc": (0), "retired": (0), "embed": (0), "orphan": (0)});
var n__5636__auto___24023 = blen;
var bi_24024 = (0);
while(true){
if((bi_24024 < n__5636__auto___24023)){
var b_24025 = (blocks[bi_24024]);
var status_24026 = (b_24025[(2)]);
var pred__23075_24027 = cljs.core._EQ__EQ_;
var expr__23076_24028 = status_24026;
if(cljs.core.truth_((pred__23075_24027.cljs$core$IFn$_invoke$arity$2 ? pred__23075_24027.cljs$core$IFn$_invoke$arity$2((0),expr__23076_24028) : pred__23075_24027.call(null, (0),expr__23076_24028)))){
(c.free = (c.free + (1)));
} else {
if(cljs.core.truth_((pred__23075_24027.cljs$core$IFn$_invoke$arity$2 ? pred__23075_24027.cljs$core$IFn$_invoke$arity$2((1),expr__23076_24028) : pred__23075_24027.call(null, (1),expr__23076_24028)))){
(c.alloc = (c.alloc + (1)));
} else {
if(cljs.core.truth_((pred__23075_24027.cljs$core$IFn$_invoke$arity$2 ? pred__23075_24027.cljs$core$IFn$_invoke$arity$2((5),expr__23076_24028) : pred__23075_24027.call(null, (5),expr__23076_24028)))){
(c.retired = (c.retired + (1)));
} else {
if(cljs.core.truth_((pred__23075_24027.cljs$core$IFn$_invoke$arity$2 ? pred__23075_24027.cljs$core$IFn$_invoke$arity$2((3),expr__23076_24028) : pred__23075_24027.call(null, (3),expr__23076_24028)))){
(c.embed = (c.embed + (1)));
} else {
if(cljs.core.truth_((pred__23075_24027.cljs$core$IFn$_invoke$arity$2 ? pred__23075_24027.cljs$core$IFn$_invoke$arity$2((4),expr__23076_24028) : pred__23075_24027.call(null, (4),expr__23076_24028)))){
(c.orphan = (c.orphan + (1)));
} else {
}
}
}
}
}

var G__24031 = (bi_24024 + (1));
bi_24024 = G__24031;
continue;
} else {
}
break;
}

return c;
})();
var mirror_len = mirror_blocks.length;
var mirror_counts = (function (){var c = ({"free": (0), "alloc": (0), "retired": (0), "embed": (0), "orphan": (0)});
var n__5636__auto___24032 = mirror_len;
var bi_24033 = (0);
while(true){
if((bi_24033 < n__5636__auto___24032)){
var b_24034 = (mirror_blocks[bi_24033]);
var status_24035 = (b_24034[(2)]);
var pred__23081_24036 = cljs.core._EQ__EQ_;
var expr__23082_24037 = status_24035;
if(cljs.core.truth_((pred__23081_24036.cljs$core$IFn$_invoke$arity$2 ? pred__23081_24036.cljs$core$IFn$_invoke$arity$2((0),expr__23082_24037) : pred__23081_24036.call(null, (0),expr__23082_24037)))){
(c.free = (c.free + (1)));
} else {
if(cljs.core.truth_((pred__23081_24036.cljs$core$IFn$_invoke$arity$2 ? pred__23081_24036.cljs$core$IFn$_invoke$arity$2((1),expr__23082_24037) : pred__23081_24036.call(null, (1),expr__23082_24037)))){
(c.alloc = (c.alloc + (1)));
} else {
if(cljs.core.truth_((pred__23081_24036.cljs$core$IFn$_invoke$arity$2 ? pred__23081_24036.cljs$core$IFn$_invoke$arity$2((5),expr__23082_24037) : pred__23081_24036.call(null, (5),expr__23082_24037)))){
(c.retired = (c.retired + (1)));
} else {
if(cljs.core.truth_((pred__23081_24036.cljs$core$IFn$_invoke$arity$2 ? pred__23081_24036.cljs$core$IFn$_invoke$arity$2((3),expr__23082_24037) : pred__23081_24036.call(null, (3),expr__23082_24037)))){
(c.embed = (c.embed + (1)));
} else {
if(cljs.core.truth_((pred__23081_24036.cljs$core$IFn$_invoke$arity$2 ? pred__23081_24036.cljs$core$IFn$_invoke$arity$2((4),expr__23082_24037) : pred__23081_24036.call(null, (4),expr__23082_24037)))){
(c.orphan = (c.orphan + (1)));
} else {
}
}
}
}
}

var G__24039 = (bi_24033 + (1));
bi_24033 = G__24039;
continue;
} else {
}
break;
}

return c;
})();
var frame_lines = [];
var pr_BANG_ = (function (s){
return frame_lines.push(s);
});
var scale = (function (){var x__5130__auto__ = (1);
var y__5131__auto__ = Math.ceil((data_size / bar_w));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var count_str = (function (c){
return ["F=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(c.free)," A=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(c.alloc)," R=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(c.retired)," E=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(c.embed)," O=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(c.orphan)].join('');
});
pr_BANG_(["  ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = label;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})())," | desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(blen)," mirror:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(mirror_len)," blk | ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_tracked),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_size)," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(Math.round(((100) * (total_tracked / data_size)))),"%)"].join(''));

pr_BANG_(["  ",pad_str(["SAB/DESC (1col=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(scale),"B)"].join(''),col_w),"  ",["MIRROR (1col=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(scale),"B)"].join('')].join(''));

pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(telescope_model),"|  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(micro_model),"|"].join(''));

pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(diff_row),"|  ",((has_view_diff)?"!! SAB\u2260MIRROR !!":"SAB=MIRROR OK")].join(''));

pr_BANG_(["  |",cljs.core.str.cljs$core$IFn$_invoke$arity$1(telescope_tiling_final),"| gaps/overlaps  (?=gap X=overlap)"].join(''));

pr_BANG_(["  ",pad_str(count_str(desc_counts),col_w),"  ",count_str(mirror_counts)].join(''));

if(valid_QMARK_){
} else {
pr_BANG_(["  !! FAIL: interior-gaps=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(gaps.length)," (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(interior_gap_bytes),"B)"," overlaps=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(overlaps.length)," mirror-mismatch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(mirror_mismatches.length)," desc-err=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_errors.length)," adj-free=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(adjacent_free.length)," worker-epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(worker_epoch_errors.length),((has_view_diff)?" VIEW-DIFF=YES":null)].join(''));
}

if(cljs.core.truth_((function (){var and__5043__auto__ = trailing_unallocated;
if(cljs.core.truth_(and__5043__auto__)){
return (trailing_bytes > (0));
} else {
return and__5043__auto__;
}
})())){
pr_BANG_(["  (trailing-unallocated=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(trailing_bytes),"B - not an error, just unused SAB)"].join(''));
} else {
}

var desc_lines_24042 = [];
desc_lines_24042.push("  DESCRIPTORS (non-ZEROED):");

desc_lines_24042.push("    idx  | status | offset     | capacity  | data_len  | val_desc | lock | epoch");

desc_lines_24042.push("    -----|--------|------------|-----------|-----------|----------|------|------");

var n__5636__auto___24043 = desc_table.length;
var di_24044 = (0);
while(true){
if((di_24044 < n__5636__auto___24043)){
var d_24045 = (desc_table[di_24044]);
var idx_24046 = (d_24045[(0)]);
var st_24047 = (d_24045[(1)]);
var off_24048 = (d_24045[(2)]);
var cap_24049 = (d_24045[(3)]);
var dlen_24050 = (d_24045[(4)]);
var vd_24051 = (d_24045[(5)]);
var lk_24052 = (d_24045[(6)]);
var ep_24053 = (d_24045[(7)]);
var sn_24054 = cljs_thread.eve.shared_atom.status_name(st_24047);
var show_QMARK__24055 = (((di_24044 < (30))) || ((di_24044 >= (desc_table.length - (5)))));
if(show_QMARK__24055){
desc_lines_24042.push(["    ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx_24046);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((5) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = sn_24054;
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((7) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(off_24048);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((11) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(cap_24049);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((10) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(dlen_24050);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((10) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(vd_24051);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((9) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",(function (){var s = cljs.core.str.cljs$core$IFn$_invoke$arity$1(lk_24052);
return [s,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((function (){var x__5130__auto__ = (0);
var y__5131__auto__ = ((5) - ((s).length));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})()," ")))].join('');
})(),"| ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ep_24053)].join(''));
} else {
}

if((((di_24044 === (30))) && ((desc_table.length > (35))))){
desc_lines_24042.push(["    ... (",cljs.core.str.cljs$core$IFn$_invoke$arity$1((desc_table.length - (35)))," more) ..."].join(''));
} else {
}

var G__24059 = (di_24044 + (1));
di_24044 = G__24059;
continue;
} else {
}
break;
}

var frame_24060 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"valid?","valid?",-212412379),valid_QMARK_,new cljs.core.Keyword(null,"lines","lines",-700165781),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines)),new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(desc_lines_24042))], null);
cljs_thread.eve.shared_atom.xray_frames.push(frame_24060);

if((cljs_thread.eve.shared_atom.xray_frames.length > (20))){
cljs_thread.eve.shared_atom.xray_frames.shift();
} else {
}

cljs.core.println();

var seq__23117_24066 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(frame_lines));
var chunk__23118_24067 = null;
var count__23119_24068 = (0);
var i__23120_24069 = (0);
while(true){
if((i__23120_24069 < count__23119_24068)){
var line_24070 = chunk__23118_24067.cljs$core$IIndexed$_nth$arity$2(null, i__23120_24069);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24070], 0));


var G__24072 = seq__23117_24066;
var G__24073 = chunk__23118_24067;
var G__24074 = count__23119_24068;
var G__24075 = (i__23120_24069 + (1));
seq__23117_24066 = G__24072;
chunk__23118_24067 = G__24073;
count__23119_24068 = G__24074;
i__23120_24069 = G__24075;
continue;
} else {
var temp__5823__auto___24076 = cljs.core.seq(seq__23117_24066);
if(temp__5823__auto___24076){
var seq__23117_24077__$1 = temp__5823__auto___24076;
if(cljs.core.chunked_seq_QMARK_(seq__23117_24077__$1)){
var c__5568__auto___24078 = cljs.core.chunk_first(seq__23117_24077__$1);
var G__24079 = cljs.core.chunk_rest(seq__23117_24077__$1);
var G__24080 = c__5568__auto___24078;
var G__24081 = cljs.core.count(c__5568__auto___24078);
var G__24082 = (0);
seq__23117_24066 = G__24079;
chunk__23118_24067 = G__24080;
count__23119_24068 = G__24081;
i__23120_24069 = G__24082;
continue;
} else {
var line_24083 = cljs.core.first(seq__23117_24077__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24083], 0));


var G__24084 = cljs.core.next(seq__23117_24077__$1);
var G__24085 = null;
var G__24086 = (0);
var G__24087 = (0);
seq__23117_24066 = G__24084;
chunk__23118_24067 = G__24085;
count__23119_24068 = G__24086;
i__23120_24069 = G__24087;
continue;
}
} else {
}
}
break;
}

if(valid_QMARK_){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  PASS"], 0));
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  !! INVARIANT VIOLATION !!"], 0));
}

if(valid_QMARK_){
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["\n=== [X-RAY VIDEO] Last frames before failure ==="], 0));

var n__5636__auto___24089 = cljs_thread.eve.shared_atom.xray_frames.length;
var fi_24090 = (0);
while(true){
if((fi_24090 < n__5636__auto___24089)){
var f_24091 = (cljs_thread.eve.shared_atom.xray_frames[fi_24090]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n--- Frame ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((fi_24090 + (1))),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.shared_atom.xray_frames.length),(cljs.core.truth_(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_24091))?[" [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_24091)),"]"].join(''):null),(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f_24091))?" PASS":" FAIL")," ---"].join('')], 0));

var seq__23129_24092 = cljs.core.seq(new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f_24091));
var chunk__23130_24093 = null;
var count__23131_24094 = (0);
var i__23132_24095 = (0);
while(true){
if((i__23132_24095 < count__23131_24094)){
var line_24096 = chunk__23130_24093.cljs$core$IIndexed$_nth$arity$2(null, i__23132_24095);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24096], 0));


var G__24098 = seq__23129_24092;
var G__24099 = chunk__23130_24093;
var G__24100 = count__23131_24094;
var G__24101 = (i__23132_24095 + (1));
seq__23129_24092 = G__24098;
chunk__23130_24093 = G__24099;
count__23131_24094 = G__24100;
i__23132_24095 = G__24101;
continue;
} else {
var temp__5823__auto___24102 = cljs.core.seq(seq__23129_24092);
if(temp__5823__auto___24102){
var seq__23129_24103__$1 = temp__5823__auto___24102;
if(cljs.core.chunked_seq_QMARK_(seq__23129_24103__$1)){
var c__5568__auto___24104 = cljs.core.chunk_first(seq__23129_24103__$1);
var G__24105 = cljs.core.chunk_rest(seq__23129_24103__$1);
var G__24106 = c__5568__auto___24104;
var G__24107 = cljs.core.count(c__5568__auto___24104);
var G__24108 = (0);
seq__23129_24092 = G__24105;
chunk__23130_24093 = G__24106;
count__23131_24094 = G__24107;
i__23132_24095 = G__24108;
continue;
} else {
var line_24109 = cljs.core.first(seq__23129_24103__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24109], 0));


var G__24110 = cljs.core.next(seq__23129_24103__$1);
var G__24111 = null;
var G__24112 = (0);
var G__24113 = (0);
seq__23129_24092 = G__24110;
chunk__23130_24093 = G__24111;
count__23131_24094 = G__24112;
i__23132_24095 = G__24113;
continue;
}
} else {
}
}
break;
}

var seq__23137_24114 = cljs.core.seq(new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964).cljs$core$IFn$_invoke$arity$1(f_24091));
var chunk__23138_24115 = null;
var count__23139_24116 = (0);
var i__23140_24117 = (0);
while(true){
if((i__23140_24117 < count__23139_24116)){
var line_24118 = chunk__23138_24115.cljs$core$IIndexed$_nth$arity$2(null, i__23140_24117);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24118], 0));


var G__24119 = seq__23137_24114;
var G__24120 = chunk__23138_24115;
var G__24121 = count__23139_24116;
var G__24122 = (i__23140_24117 + (1));
seq__23137_24114 = G__24119;
chunk__23138_24115 = G__24120;
count__23139_24116 = G__24121;
i__23140_24117 = G__24122;
continue;
} else {
var temp__5823__auto___24123 = cljs.core.seq(seq__23137_24114);
if(temp__5823__auto___24123){
var seq__23137_24124__$1 = temp__5823__auto___24123;
if(cljs.core.chunked_seq_QMARK_(seq__23137_24124__$1)){
var c__5568__auto___24126 = cljs.core.chunk_first(seq__23137_24124__$1);
var G__24129 = cljs.core.chunk_rest(seq__23137_24124__$1);
var G__24130 = c__5568__auto___24126;
var G__24131 = cljs.core.count(c__5568__auto___24126);
var G__24132 = (0);
seq__23137_24114 = G__24129;
chunk__23138_24115 = G__24130;
count__23139_24116 = G__24131;
i__23140_24117 = G__24132;
continue;
} else {
var line_24133 = cljs.core.first(seq__23137_24124__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24133], 0));


var G__24135 = cljs.core.next(seq__23137_24124__$1);
var G__24136 = null;
var G__24137 = (0);
var G__24138 = (0);
seq__23137_24114 = G__24135;
chunk__23138_24115 = G__24136;
count__23139_24116 = G__24137;
i__23140_24117 = G__24138;
continue;
}
} else {
}
}
break;
}

var G__24140 = (fi_24090 + (1));
fi_24090 = G__24140;
continue;
} else {
}
break;
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["\n=== [/X-RAY VIDEO] ==="], 0));

if((gaps.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  INTERIOR GAPS (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(gaps.length),") - memory between allocations not tracked:"].join('')], 0));

var n__5636__auto___24141 = (function (){var x__5133__auto__ = (10);
var y__5134__auto__ = gaps.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var gi_24142 = (0);
while(true){
if((gi_24142 < n__5636__auto___24141)){
var g_24143 = (gaps[gi_24142]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((g_24143[(0)]))," size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((g_24143[(1)])),"B"].join('')], 0));

var G__24144 = (gi_24142 + (1));
gi_24142 = G__24144;
continue;
} else {
}
break;
}
} else {
}

if(cljs.core.truth_(trailing_unallocated)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["\n  TRAILING UNALLOCATED (not an error - just unused SAB space):"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((trailing_unallocated[(0)]))," size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((trailing_unallocated[(1)])),"B"].join('')], 0));
} else {
}

if((overlaps.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  OVERLAPS (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(overlaps.length),"):"].join('')], 0));

var n__5636__auto___24145 = (function (){var x__5133__auto__ = (10);
var y__5134__auto__ = overlaps.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var oi_24146 = (0);
while(true){
if((oi_24146 < n__5636__auto___24145)){
var o_24147 = (overlaps[oi_24146]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    offset=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((o_24147[(0)]))," size=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((o_24147[(1)])),"B"].join('')], 0));

var G__24148 = (oi_24146 + (1));
oi_24146 = G__24148;
continue;
} else {
}
break;
}
} else {
}

if((mirror_mismatches.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  MIRROR MISMATCHES (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(mirror_mismatches.length),"):"].join('')], 0));

var n__5636__auto___24149 = (function (){var x__5133__auto__ = (10);
var y__5134__auto__ = mirror_mismatches.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var mi_24150 = (0);
while(true){
if((mi_24150 < n__5636__auto___24149)){
var m_24155 = (mirror_mismatches[mi_24150]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    desc[",cljs.core.str.cljs$core$IFn$_invoke$arity$1((m_24155[(0)])),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((m_24155[(1)])),": descriptor=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((m_24155[(2)]))," mirror=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((m_24155[(3)]))].join('')], 0));

var G__24159 = (mi_24150 + (1));
mi_24150 = G__24159;
continue;
} else {
}
break;
}
} else {
}

if((descriptor_errors.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  DESCRIPTOR ERRORS (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_errors.length),"):"].join('')], 0));

var n__5636__auto___24164 = (function (){var x__5133__auto__ = (20);
var y__5134__auto__ = descriptor_errors.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var di_24167 = (0);
while(true){
if((di_24167 < n__5636__auto___24164)){
var e_24169 = (descriptor_errors[di_24167]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    desc[",cljs.core.str.cljs$core$IFn$_invoke$arity$1((e_24169[(0)])),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((e_24169[(1)])),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((e_24169[(2)]))].join('')], 0));

var G__24175 = (di_24167 + (1));
di_24167 = G__24175;
continue;
} else {
}
break;
}
} else {
}

if((adjacent_free.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  UNCOALESCED ADJACENT FREE BLOCKS (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(adjacent_free.length),"):"].join('')], 0));

var n__5636__auto___24179 = (function (){var x__5133__auto__ = (10);
var y__5134__auto__ = adjacent_free.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var ai_24184 = (0);
while(true){
if((ai_24184 < n__5636__auto___24179)){
var a_24189 = (adjacent_free[ai_24184]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    desc[",cljs.core.str.cljs$core$IFn$_invoke$arity$1((a_24189[(0)])),"] + desc[",cljs.core.str.cljs$core$IFn$_invoke$arity$1((a_24189[(1)])),"] meet at offset ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((a_24189[(2)]))].join('')], 0));

var G__24194 = (ai_24184 + (1));
ai_24184 = G__24194;
continue;
} else {
}
break;
}
} else {
}

if((worker_epoch_errors.length > (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  WORKER EPOCH VIOLATIONS (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(worker_epoch_errors.length),"):"].join('')], 0));

var n__5636__auto___24197 = (function (){var x__5133__auto__ = (10);
var y__5134__auto__ = worker_epoch_errors.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var wi_24203 = (0);
while(true){
if((wi_24203 < n__5636__auto___24197)){
var w_24205 = (worker_epoch_errors[wi_24203]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["    worker slot ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((w_24205[(0)]))," epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((w_24205[(1)]))," > global_epoch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((w_24205[(2)]))].join('')], 0));

var G__24212 = (wi_24203 + (1));
wi_24203 = G__24212;
continue;
} else {
}
break;
}
} else {
}
}

return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"tracked","tracked",548365604),new cljs.core.Keyword(null,"descriptor-errors","descriptor-errors",-828905020),new cljs.core.Keyword(null,"valid?","valid?",-212412379),new cljs.core.Keyword(null,"view-diff","view-diff",1695274507),new cljs.core.Keyword(null,"mirror-mismatches","mirror-mismatches",-107539188),new cljs.core.Keyword(null,"gaps","gaps",511246449),new cljs.core.Keyword(null,"overlaps","overlaps",1398230580),new cljs.core.Keyword(null,"expected","expected",1583670997),new cljs.core.Keyword(null,"adjacent-free","adjacent-free",729367511),new cljs.core.Keyword(null,"worker-epoch-errors","worker-epoch-errors",-943920389),new cljs.core.Keyword(null,"frame-history","frame-history",-373675649)],[total_tracked,cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (e){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"desc-idx","desc-idx",786957620),(e[(0)]),new cljs.core.Keyword(null,"kind","kind",-717265803),(e[(1)]),new cljs.core.Keyword(null,"detail","detail",-1545345025),(e[(2)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(descriptor_errors))),valid_QMARK_,has_view_diff,cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (m){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"desc-idx","desc-idx",786957620),(m[(0)]),new cljs.core.Keyword(null,"field","field",-1302436500),(m[(1)]),new cljs.core.Keyword(null,"descriptor-val","descriptor-val",-30687362),(m[(2)]),new cljs.core.Keyword(null,"mirror-val","mirror-val",1312223963),(m[(3)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(mirror_mismatches))),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (g){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"offset","offset",296498311),(g[(0)]),new cljs.core.Keyword(null,"size","size",1098693007),(g[(1)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(gaps))),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (o){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"offset","offset",296498311),(o[(0)]),new cljs.core.Keyword(null,"size","size",1098693007),(o[(1)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(overlaps))),data_size,cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (a){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"desc-a","desc-a",-1424236445),(a[(0)]),new cljs.core.Keyword(null,"desc-b","desc-b",181623270),(a[(1)]),new cljs.core.Keyword(null,"boundary","boundary",-2000996754),(a[(2)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(adjacent_free))),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (w){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"slot","slot",240229571),(w[(0)]),new cljs.core.Keyword(null,"epoch","epoch",1435633666),(w[(1)]),new cljs.core.Keyword(null,"global","global",93595047),(w[(2)])], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(worker_epoch_errors))),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (f){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f),new cljs.core.Keyword(null,"valid?","valid?",-212412379),new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f),new cljs.core.Keyword(null,"lines","lines",-700165781),new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f),new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964),new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964).cljs$core$IFn$_invoke$arity$1(f)], null);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.shared_atom.xray_frames)))]);
}));

(cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Replay the X-RAY video buffer — print all captured frames with descriptor tables.
 */
cljs_thread.eve.shared_atom.xray_replay_BANG_ = (function cljs_thread$eve$shared_atom$xray_replay_BANG_(){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["\n=== [X-RAY VIDEO REPLAY] ==="], 0));

var n__5636__auto___24224 = cljs_thread.eve.shared_atom.xray_frames.length;
var fi_24225 = (0);
while(true){
if((fi_24225 < n__5636__auto___24224)){
var f_24227 = (cljs_thread.eve.shared_atom.xray_frames[fi_24225]);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n--- Frame ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((fi_24225 + (1))),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.shared_atom.xray_frames.length),(cljs.core.truth_(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_24227))?[" [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(f_24227)),"]"].join(''):null),(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(f_24227))?" PASS":" FAIL")," ---"].join('')], 0));

var seq__23159_24228 = cljs.core.seq(new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(f_24227));
var chunk__23160_24229 = null;
var count__23161_24230 = (0);
var i__23162_24231 = (0);
while(true){
if((i__23162_24231 < count__23161_24230)){
var line_24233 = chunk__23160_24229.cljs$core$IIndexed$_nth$arity$2(null, i__23162_24231);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24233], 0));


var G__24235 = seq__23159_24228;
var G__24236 = chunk__23160_24229;
var G__24237 = count__23161_24230;
var G__24238 = (i__23162_24231 + (1));
seq__23159_24228 = G__24235;
chunk__23160_24229 = G__24236;
count__23161_24230 = G__24237;
i__23162_24231 = G__24238;
continue;
} else {
var temp__5823__auto___24240 = cljs.core.seq(seq__23159_24228);
if(temp__5823__auto___24240){
var seq__23159_24241__$1 = temp__5823__auto___24240;
if(cljs.core.chunked_seq_QMARK_(seq__23159_24241__$1)){
var c__5568__auto___24242 = cljs.core.chunk_first(seq__23159_24241__$1);
var G__24243 = cljs.core.chunk_rest(seq__23159_24241__$1);
var G__24244 = c__5568__auto___24242;
var G__24245 = cljs.core.count(c__5568__auto___24242);
var G__24246 = (0);
seq__23159_24228 = G__24243;
chunk__23160_24229 = G__24244;
count__23161_24230 = G__24245;
i__23162_24231 = G__24246;
continue;
} else {
var line_24247 = cljs.core.first(seq__23159_24241__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24247], 0));


var G__24248 = cljs.core.next(seq__23159_24241__$1);
var G__24249 = null;
var G__24250 = (0);
var G__24251 = (0);
seq__23159_24228 = G__24248;
chunk__23160_24229 = G__24249;
count__23161_24230 = G__24250;
i__23162_24231 = G__24251;
continue;
}
} else {
}
}
break;
}

var seq__23167_24254 = cljs.core.seq(new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964).cljs$core$IFn$_invoke$arity$1(f_24227));
var chunk__23168_24255 = null;
var count__23169_24256 = (0);
var i__23170_24257 = (0);
while(true){
if((i__23170_24257 < count__23169_24256)){
var line_24263 = chunk__23168_24255.cljs$core$IIndexed$_nth$arity$2(null, i__23170_24257);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24263], 0));


var G__24265 = seq__23167_24254;
var G__24266 = chunk__23168_24255;
var G__24267 = count__23169_24256;
var G__24268 = (i__23170_24257 + (1));
seq__23167_24254 = G__24265;
chunk__23168_24255 = G__24266;
count__23169_24256 = G__24267;
i__23170_24257 = G__24268;
continue;
} else {
var temp__5823__auto___24270 = cljs.core.seq(seq__23167_24254);
if(temp__5823__auto___24270){
var seq__23167_24272__$1 = temp__5823__auto___24270;
if(cljs.core.chunked_seq_QMARK_(seq__23167_24272__$1)){
var c__5568__auto___24274 = cljs.core.chunk_first(seq__23167_24272__$1);
var G__24275 = cljs.core.chunk_rest(seq__23167_24272__$1);
var G__24276 = c__5568__auto___24274;
var G__24277 = cljs.core.count(c__5568__auto___24274);
var G__24278 = (0);
seq__23167_24254 = G__24275;
chunk__23168_24255 = G__24276;
count__23169_24256 = G__24277;
i__23170_24257 = G__24278;
continue;
} else {
var line_24280 = cljs.core.first(seq__23167_24272__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([line_24280], 0));


var G__24281 = cljs.core.next(seq__23167_24272__$1);
var G__24282 = null;
var G__24283 = (0);
var G__24284 = (0);
seq__23167_24254 = G__24281;
chunk__23168_24255 = G__24282;
count__23169_24256 = G__24283;
i__23170_24257 = G__24284;
continue;
}
} else {
}
}
break;
}

var G__24285 = (fi_24225 + (1));
fi_24225 = G__24285;
continue;
} else {
}
break;
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["=== [/X-RAY VIDEO REPLAY] ==="], 0));
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.xray_guard_enabled !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.xray_guard_enabled = cljs.core.volatile_BANG_(false);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.xray_guard_count !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.xray_guard_count = cljs.core.volatile_BANG_((0));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.xray_hamt_validator_fn !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.xray_hamt_validator_fn = cljs.core.volatile_BANG_(null);
}
/**
 * Enable or disable X-RAY transaction guard. When enabled, every swap!/reset!
 * runs invariant checks before and after the transaction. Throws on violation.
 * Use for debugging intermittent corruption. Disable for production.
 */
cljs_thread.eve.shared_atom.set_xray_guard_BANG_ = (function cljs_thread$eve$shared_atom$set_xray_guard_BANG_(enabled_QMARK_){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.xray_guard_enabled,enabled_QMARK_);

if(cljs.core.truth_(enabled_QMARK_)){
cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.xray_guard_count,(0));

(cljs_thread.eve.shared_atom.xray_frames.length = (0));
} else {
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[X-RAY GUARD] ",(cljs.core.truth_(enabled_QMARK_)?"ENABLED":"DISABLED")].join('')], 0));
});
/**
 * Returns true if the X-RAY transaction guard is currently enabled.
 */
cljs_thread.eve.shared_atom.xray_guard_enabled_QMARK_ = (function cljs_thread$eve$shared_atom$xray_guard_enabled_QMARK_(){
return cljs.core.deref(cljs_thread.eve.shared_atom.xray_guard_enabled);
});
/**
 * Register a HAMT tree validator function.
 * Called with (validator-fn root-offset) where root-offset is the slab-qualified
 * HAMT root offset. Should return {:valid? bool :errors [...]} map.
 * Set by map.cljs at load time.
 */
cljs_thread.eve.shared_atom.register_xray_hamt_validator_BANG_ = (function cljs_thread$eve$shared_atom$register_xray_hamt_validator_BANG_(f){
return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.xray_hamt_validator_fn,f);
});
/**
 * Build detailed error message with frame history.
 */
cljs_thread.eve.shared_atom.build_xray_error_msg = (function cljs_thread$eve$shared_atom$build_xray_error_msg(tag,result){
var sb = (new Array());
var push_BANG_ = (function (s){
return sb.push(s);
});
push_BANG_(["[X-RAY GUARD] Storage model invariant violated at ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(tag)].join(''));

push_BANG_(["  gaps=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"gaps","gaps",511246449).cljs$core$IFn$_invoke$arity$1(result)))," overlaps=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"overlaps","overlaps",1398230580).cljs$core$IFn$_invoke$arity$1(result)))," mirror-mismatch=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"mirror-mismatches","mirror-mismatches",-107539188).cljs$core$IFn$_invoke$arity$1(result)))," view-diff=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"view-diff","view-diff",1695274507).cljs$core$IFn$_invoke$arity$1(result))," lost=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null,"expected","expected",1583670997).cljs$core$IFn$_invoke$arity$1(result) - new cljs.core.Keyword(null,"tracked","tracked",548365604).cljs$core$IFn$_invoke$arity$1(result))),"B"].join(''));

push_BANG_("\n=== FRAME HISTORY (last frames before failure) ===");

var seq__23175_24290 = cljs.core.seq(new cljs.core.Keyword(null,"frame-history","frame-history",-373675649).cljs$core$IFn$_invoke$arity$1(result));
var chunk__23176_24291 = null;
var count__23177_24292 = (0);
var i__23178_24293 = (0);
while(true){
if((i__23178_24293 < count__23177_24292)){
var map__23209_24297 = chunk__23176_24291.cljs$core$IIndexed$_nth$arity$2(null, i__23178_24293);
var map__23209_24298__$1 = cljs.core.__destructure_map(map__23209_24297);
var label_24299 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23209_24298__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var valid_QMARK__24300 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23209_24298__$1,new cljs.core.Keyword(null,"valid?","valid?",-212412379));
var lines_24301 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23209_24298__$1,new cljs.core.Keyword(null,"lines","lines",-700165781));
var desc_lines_24302 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23209_24298__$1,new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964));
push_BANG_(["\n--- ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = label_24299;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "Frame";
}
})()),(cljs.core.truth_(valid_QMARK__24300)?" PASS":" FAIL")," ---"].join(''));

var seq__23214_24304 = cljs.core.seq(lines_24301);
var chunk__23215_24305 = null;
var count__23216_24306 = (0);
var i__23217_24307 = (0);
while(true){
if((i__23217_24307 < count__23216_24306)){
var line_24310 = chunk__23215_24305.cljs$core$IIndexed$_nth$arity$2(null, i__23217_24307);
push_BANG_(line_24310);


var G__24312 = seq__23214_24304;
var G__24313 = chunk__23215_24305;
var G__24314 = count__23216_24306;
var G__24315 = (i__23217_24307 + (1));
seq__23214_24304 = G__24312;
chunk__23215_24305 = G__24313;
count__23216_24306 = G__24314;
i__23217_24307 = G__24315;
continue;
} else {
var temp__5823__auto___24316 = cljs.core.seq(seq__23214_24304);
if(temp__5823__auto___24316){
var seq__23214_24317__$1 = temp__5823__auto___24316;
if(cljs.core.chunked_seq_QMARK_(seq__23214_24317__$1)){
var c__5568__auto___24318 = cljs.core.chunk_first(seq__23214_24317__$1);
var G__24319 = cljs.core.chunk_rest(seq__23214_24317__$1);
var G__24320 = c__5568__auto___24318;
var G__24321 = cljs.core.count(c__5568__auto___24318);
var G__24322 = (0);
seq__23214_24304 = G__24319;
chunk__23215_24305 = G__24320;
count__23216_24306 = G__24321;
i__23217_24307 = G__24322;
continue;
} else {
var line_24323 = cljs.core.first(seq__23214_24317__$1);
push_BANG_(line_24323);


var G__24324 = cljs.core.next(seq__23214_24317__$1);
var G__24325 = null;
var G__24326 = (0);
var G__24327 = (0);
seq__23214_24304 = G__24324;
chunk__23215_24305 = G__24325;
count__23216_24306 = G__24326;
i__23217_24307 = G__24327;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(desc_lines_24302)){
var seq__23218_24328 = cljs.core.seq(cljs.core.take.cljs$core$IFn$_invoke$arity$2((10),desc_lines_24302));
var chunk__23219_24329 = null;
var count__23220_24330 = (0);
var i__23221_24331 = (0);
while(true){
if((i__23221_24331 < count__23220_24330)){
var line_24332 = chunk__23219_24329.cljs$core$IIndexed$_nth$arity$2(null, i__23221_24331);
push_BANG_(line_24332);


var G__24333 = seq__23218_24328;
var G__24334 = chunk__23219_24329;
var G__24335 = count__23220_24330;
var G__24336 = (i__23221_24331 + (1));
seq__23218_24328 = G__24333;
chunk__23219_24329 = G__24334;
count__23220_24330 = G__24335;
i__23221_24331 = G__24336;
continue;
} else {
var temp__5823__auto___24339 = cljs.core.seq(seq__23218_24328);
if(temp__5823__auto___24339){
var seq__23218_24340__$1 = temp__5823__auto___24339;
if(cljs.core.chunked_seq_QMARK_(seq__23218_24340__$1)){
var c__5568__auto___24341 = cljs.core.chunk_first(seq__23218_24340__$1);
var G__24342 = cljs.core.chunk_rest(seq__23218_24340__$1);
var G__24343 = c__5568__auto___24341;
var G__24344 = cljs.core.count(c__5568__auto___24341);
var G__24345 = (0);
seq__23218_24328 = G__24342;
chunk__23219_24329 = G__24343;
count__23220_24330 = G__24344;
i__23221_24331 = G__24345;
continue;
} else {
var line_24348 = cljs.core.first(seq__23218_24340__$1);
push_BANG_(line_24348);


var G__24350 = cljs.core.next(seq__23218_24340__$1);
var G__24351 = null;
var G__24352 = (0);
var G__24354 = (0);
seq__23218_24328 = G__24350;
chunk__23219_24329 = G__24351;
count__23220_24330 = G__24352;
i__23221_24331 = G__24354;
continue;
}
} else {
}
}
break;
}

if((cljs.core.count(desc_lines_24302) > (10))){
push_BANG_(["  ... (",cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.count(desc_lines_24302) - (10)))," more lines) ..."].join(''));
} else {
}
} else {
}


var G__24357 = seq__23175_24290;
var G__24358 = chunk__23176_24291;
var G__24359 = count__23177_24292;
var G__24360 = (i__23178_24293 + (1));
seq__23175_24290 = G__24357;
chunk__23176_24291 = G__24358;
count__23177_24292 = G__24359;
i__23178_24293 = G__24360;
continue;
} else {
var temp__5823__auto___24361 = cljs.core.seq(seq__23175_24290);
if(temp__5823__auto___24361){
var seq__23175_24362__$1 = temp__5823__auto___24361;
if(cljs.core.chunked_seq_QMARK_(seq__23175_24362__$1)){
var c__5568__auto___24363 = cljs.core.chunk_first(seq__23175_24362__$1);
var G__24364 = cljs.core.chunk_rest(seq__23175_24362__$1);
var G__24365 = c__5568__auto___24363;
var G__24366 = cljs.core.count(c__5568__auto___24363);
var G__24367 = (0);
seq__23175_24290 = G__24364;
chunk__23176_24291 = G__24365;
count__23177_24292 = G__24366;
i__23178_24293 = G__24367;
continue;
} else {
var map__23222_24368 = cljs.core.first(seq__23175_24362__$1);
var map__23222_24369__$1 = cljs.core.__destructure_map(map__23222_24368);
var label_24370 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23222_24369__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var valid_QMARK__24371 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23222_24369__$1,new cljs.core.Keyword(null,"valid?","valid?",-212412379));
var lines_24372 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23222_24369__$1,new cljs.core.Keyword(null,"lines","lines",-700165781));
var desc_lines_24373 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23222_24369__$1,new cljs.core.Keyword(null,"desc-lines","desc-lines",1141371964));
push_BANG_(["\n--- ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = label_24370;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "Frame";
}
})()),(cljs.core.truth_(valid_QMARK__24371)?" PASS":" FAIL")," ---"].join(''));

var seq__23227_24374 = cljs.core.seq(lines_24372);
var chunk__23228_24375 = null;
var count__23229_24376 = (0);
var i__23230_24377 = (0);
while(true){
if((i__23230_24377 < count__23229_24376)){
var line_24378 = chunk__23228_24375.cljs$core$IIndexed$_nth$arity$2(null, i__23230_24377);
push_BANG_(line_24378);


var G__24381 = seq__23227_24374;
var G__24382 = chunk__23228_24375;
var G__24383 = count__23229_24376;
var G__24384 = (i__23230_24377 + (1));
seq__23227_24374 = G__24381;
chunk__23228_24375 = G__24382;
count__23229_24376 = G__24383;
i__23230_24377 = G__24384;
continue;
} else {
var temp__5823__auto___24386__$1 = cljs.core.seq(seq__23227_24374);
if(temp__5823__auto___24386__$1){
var seq__23227_24388__$1 = temp__5823__auto___24386__$1;
if(cljs.core.chunked_seq_QMARK_(seq__23227_24388__$1)){
var c__5568__auto___24390 = cljs.core.chunk_first(seq__23227_24388__$1);
var G__24391 = cljs.core.chunk_rest(seq__23227_24388__$1);
var G__24392 = c__5568__auto___24390;
var G__24393 = cljs.core.count(c__5568__auto___24390);
var G__24394 = (0);
seq__23227_24374 = G__24391;
chunk__23228_24375 = G__24392;
count__23229_24376 = G__24393;
i__23230_24377 = G__24394;
continue;
} else {
var line_24395 = cljs.core.first(seq__23227_24388__$1);
push_BANG_(line_24395);


var G__24398 = cljs.core.next(seq__23227_24388__$1);
var G__24399 = null;
var G__24400 = (0);
var G__24401 = (0);
seq__23227_24374 = G__24398;
chunk__23228_24375 = G__24399;
count__23229_24376 = G__24400;
i__23230_24377 = G__24401;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(desc_lines_24373)){
var seq__23234_24402 = cljs.core.seq(cljs.core.take.cljs$core$IFn$_invoke$arity$2((10),desc_lines_24373));
var chunk__23235_24403 = null;
var count__23236_24404 = (0);
var i__23237_24405 = (0);
while(true){
if((i__23237_24405 < count__23236_24404)){
var line_24406 = chunk__23235_24403.cljs$core$IIndexed$_nth$arity$2(null, i__23237_24405);
push_BANG_(line_24406);


var G__24407 = seq__23234_24402;
var G__24408 = chunk__23235_24403;
var G__24409 = count__23236_24404;
var G__24410 = (i__23237_24405 + (1));
seq__23234_24402 = G__24407;
chunk__23235_24403 = G__24408;
count__23236_24404 = G__24409;
i__23237_24405 = G__24410;
continue;
} else {
var temp__5823__auto___24411__$1 = cljs.core.seq(seq__23234_24402);
if(temp__5823__auto___24411__$1){
var seq__23234_24412__$1 = temp__5823__auto___24411__$1;
if(cljs.core.chunked_seq_QMARK_(seq__23234_24412__$1)){
var c__5568__auto___24413 = cljs.core.chunk_first(seq__23234_24412__$1);
var G__24414 = cljs.core.chunk_rest(seq__23234_24412__$1);
var G__24415 = c__5568__auto___24413;
var G__24416 = cljs.core.count(c__5568__auto___24413);
var G__24417 = (0);
seq__23234_24402 = G__24414;
chunk__23235_24403 = G__24415;
count__23236_24404 = G__24416;
i__23237_24405 = G__24417;
continue;
} else {
var line_24420 = cljs.core.first(seq__23234_24412__$1);
push_BANG_(line_24420);


var G__24422 = cljs.core.next(seq__23234_24412__$1);
var G__24423 = null;
var G__24424 = (0);
var G__24425 = (0);
seq__23234_24402 = G__24422;
chunk__23235_24403 = G__24423;
count__23236_24404 = G__24424;
i__23237_24405 = G__24425;
continue;
}
} else {
}
}
break;
}

if((cljs.core.count(desc_lines_24373) > (10))){
push_BANG_(["  ... (",cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.count(desc_lines_24373) - (10)))," more lines) ..."].join(''));
} else {
}
} else {
}


var G__24428 = cljs.core.next(seq__23175_24362__$1);
var G__24429 = null;
var G__24430 = (0);
var G__24431 = (0);
seq__23175_24290 = G__24428;
chunk__23176_24291 = G__24429;
count__23177_24292 = G__24430;
i__23178_24293 = G__24431;
continue;
}
} else {
}
}
break;
}

push_BANG_("\n=== /FRAME HISTORY ===");

return sb.join("\n");
});
/**
 * Run X-RAY storage model check. Returns true if valid, throws on violation
 * with full frame history included in the error message.
 */
cljs_thread.eve.shared_atom.xray_guard_check_BANG_ = (function cljs_thread$eve$shared_atom$xray_guard_check_BANG_(s_atom_env,phase,label){
var n = cljs_thread.eve.shared_atom.xray_guard_count.cljs$core$IVolatile$_vreset_BANG_$arity$2(null, (cljs_thread.eve.shared_atom.xray_guard_count.cljs$core$IDeref$_deref$arity$1(null, ) + (1)));
var tag = ["TX",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)," ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase),(cljs.core.truth_(label)?[" ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)].join(''):null)].join('');
var result = cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2(s_atom_env,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"width","width",-384071477),(80),new cljs.core.Keyword(null,"label","label",1718410804),tag], null));
if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))){
} else {
throw (new Error(cljs_thread.eve.shared_atom.build_xray_error_msg(tag,result)));
}

return true;
});
cljs_thread.eve.shared_atom.HAMT_NIL_OFFSET = (-1);
/**
 * Extract the EveHashMap header slab-qualified offset from s-atom-env.
 * Returns the header offset, or -1 if empty/invalid.
 * The HAMT validator in map.cljs can then resolve this and read the root-off.
 */
cljs_thread.eve.shared_atom.get_eve_map_header_offset = (function cljs_thread$eve$shared_atom$get_eve_map_header_offset(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var dv = cljs_thread.eve.wasm_mem.data_view();
var u8 = cljs_thread.eve.wasm_mem.u8_view();
var root_desc_idx = Atomics.load(index_view,((16) / (4)));
if((root_desc_idx === (-1))){
return (-1);
} else {
var root_data_off = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_desc_idx,(4));
var root_data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_desc_idx,(8));
if((((root_data_len < (7))) || (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((u8[root_data_off]),(238))) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((u8[(root_data_off + (1))]),(219))))))){
return (-1);
} else {
return dv.getInt32((root_data_off + (3)),true);
}
}
});
/**
 * Run registered HAMT validator if available.
 * Extracts the EveHashMap header offset from s-atom-env and passes it to the validator.
 * The validator (in map.cljs) resolves the header and reads the HAMT root-off.
 */
cljs_thread.eve.shared_atom.xray_guard_hamt_check_BANG_ = (function cljs_thread$eve$shared_atom$xray_guard_hamt_check_BANG_(s_atom_env,phase){
var temp__5821__auto__ = cljs.core.deref(cljs_thread.eve.shared_atom.xray_hamt_validator_fn);
if(cljs.core.truth_(temp__5821__auto__)){
var hamt_fn = temp__5821__auto__;
var header_off = cljs_thread.eve.shared_atom.get_eve_map_header_offset(s_atom_env);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[HAMT-CHECK] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase)," header-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_off)].join('')], 0));

if((header_off > (0))){
var result = (hamt_fn.cljs$core$IFn$_invoke$arity$1 ? hamt_fn.cljs$core$IFn$_invoke$arity$1(header_off) : hamt_fn.call(null, header_off));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[HAMT-CHECK] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase)," root-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"root-off","root-off",165337709).cljs$core$IFn$_invoke$arity$1(result))," nodes=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"node-count","node-count",383091297).cljs$core$IFn$_invoke$arity$1(result))," valid?=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))].join('')], 0));

if(cljs.core.truth_(new cljs.core.Keyword(null,"valid?","valid?",-212412379).cljs$core$IFn$_invoke$arity$1(result))){
return null;
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[X-RAY GUARD] HAMT tree invalid at ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase),":"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  header-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_off)," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_off.toString((16))),")"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  root-off=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"root-off","root-off",165337709).cljs$core$IFn$_invoke$arity$1(result))," (0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"root-off","root-off",165337709).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})().toString((16))),")"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  nodes=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"node-count","node-count",383091297).cljs$core$IFn$_invoke$arity$1(result))," max-depth=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"max-depth","max-depth",127060793).cljs$core$IFn$_invoke$arity$1(result))].join('')], 0));

var seq__23246_24445 = cljs.core.seq(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result));
var chunk__23247_24446 = null;
var count__23248_24447 = (0);
var i__23249_24448 = (0);
while(true){
if((i__23249_24448 < count__23248_24447)){
var err_24451 = chunk__23247_24446.cljs$core$IIndexed$_nth$arity$2(null, i__23249_24448);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  ERROR: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(err_24451)].join('')], 0));


var G__24452 = seq__23246_24445;
var G__24453 = chunk__23247_24446;
var G__24454 = count__23248_24447;
var G__24455 = (i__23249_24448 + (1));
seq__23246_24445 = G__24452;
chunk__23247_24446 = G__24453;
count__23248_24447 = G__24454;
i__23249_24448 = G__24455;
continue;
} else {
var temp__5823__auto___24458 = cljs.core.seq(seq__23246_24445);
if(temp__5823__auto___24458){
var seq__23246_24459__$1 = temp__5823__auto___24458;
if(cljs.core.chunked_seq_QMARK_(seq__23246_24459__$1)){
var c__5568__auto___24460 = cljs.core.chunk_first(seq__23246_24459__$1);
var G__24461 = cljs.core.chunk_rest(seq__23246_24459__$1);
var G__24462 = c__5568__auto___24460;
var G__24463 = cljs.core.count(c__5568__auto___24460);
var G__24464 = (0);
seq__23246_24445 = G__24461;
chunk__23247_24446 = G__24462;
count__23248_24447 = G__24463;
i__23249_24448 = G__24464;
continue;
} else {
var err_24470 = cljs.core.first(seq__23246_24459__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  ERROR: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(err_24470)].join('')], 0));


var G__24471 = cljs.core.next(seq__23246_24459__$1);
var G__24472 = null;
var G__24473 = (0);
var G__24474 = (0);
seq__23246_24445 = G__24471;
chunk__23247_24446 = G__24472;
count__23248_24447 = G__24473;
i__23249_24448 = G__24474;
continue;
}
} else {
}
}
break;
}

throw (new Error(["[X-RAY GUARD] HAMT tree invalid at ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(result)))," errors"," (header-off=0x",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_off.toString((16))),")"].join('')));
}
} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[HAMT-CHECK] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase)," skipped (header-off <= 0)"].join('')], 0));
}
} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[HAMT-CHECK] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(phase)," skipped (no validator registered)"].join('')], 0));
}
});
/**
 * Allocate a block of requested-size-bytes.
 * Uses WASM-accelerated descriptor scan when available, JS fallback otherwise.
 * Uses alloc-cursor for O(1) amortized allocation.
 * On OOM, sweeps retired blocks and retries before failing.
 * Returns {:offset :descriptor-idx} on success, {:error ...} on failure.
 * NOTE: requested-size-bytes is rounded up to 4-byte alignment so that
 * block splits always produce 4-byte-aligned data offsets.  This is
 * required for correct Int32Array / Atomics access on the returned offset.
 */
cljs_thread.eve.shared_atom.alloc = (function cljs_thread$eve$shared_atom$alloc(s_atom_env,requested_size_bytes){
var requested_size_bytes__$1 = ((requested_size_bytes + (3)) & (~ (3)));
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var try_alloc = (function (){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.eve.wasm_mem.wasm_ready))){
return cljs_thread.eve.shared_atom.alloc_wasm(index_view,max_descriptors,requested_size_bytes__$1,s_atom_env);
} else {
return cljs_thread.eve.shared_atom.alloc_js(index_view,max_descriptors,requested_size_bytes__$1,s_atom_env);
}
});
var result = try_alloc();
if(cljs.core.truth_(result)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"offset","offset",296498311),(result[(0)]),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825),(result[(1)])], null);
} else {
var attempt = (0);
while(true){
if((attempt < (5))){
(cljs_thread.eve.shared_atom.increment_epoch_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.increment_epoch_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.increment_epoch_BANG_.call(null, s_atom_env));

var freed = (cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_.call(null, s_atom_env));
var temp__5821__auto__ = try_alloc();
if(cljs.core.truth_(temp__5821__auto__)){
var r = temp__5821__auto__;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"offset","offset",296498311),(r[(0)]),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825),(r[(1)])], null);
} else {
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1((function (){var x__5133__auto__ = ((attempt + (1)) * (2));
var y__5134__auto__ = (10);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})());

var G__24487 = (attempt + (1));
attempt = G__24487;
continue;
}
} else {
cljs_thread.eve.shared_atom.dump_block_stats_BANG_(s_atom_env);

cljs_thread.eve.shared_atom.dump_block_detail_BANG_.cljs$core$IFn$_invoke$arity$2(s_atom_env,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),(40)], null));

cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$1(s_atom_env);

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"out-of-memory","out-of-memory",-1849794692)], null);
}
break;
}
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.root_block_pool !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.root_block_pool = [];
}
cljs_thread.eve.shared_atom.ROOT_POOL_MAX = (16);
/**
 * Pool an old root pointer block for epoch-safe reuse.
 * Records the current epoch so take-safe-pool-root-block! can check safety.
 * Returns true if pooled, false if pool full.
 */
cljs_thread.eve.shared_atom.pool_root_block_BANG_ = (function cljs_thread$eve$shared_atom$pool_root_block_BANG_(s_atom_env,offset,desc_idx){
var epoch = (cljs_thread.eve.shared_atom.get_current_epoch.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.get_current_epoch.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.get_current_epoch.call(null, s_atom_env));
if((cljs_thread.eve.shared_atom.root_block_pool.length < (16))){
cljs_thread.eve.shared_atom.root_block_pool.push([offset,desc_idx,epoch]);

return true;
} else {
return false;
}
});
/**
 * Take the oldest pooled root block if epoch-safe (no concurrent readers).
 * Returns #js [offset desc-idx] on success, nil if pool empty or not yet safe.
 */
cljs_thread.eve.shared_atom.take_safe_pool_root_block_BANG_ = (function cljs_thread$eve$shared_atom$take_safe_pool_root_block_BANG_(s_atom_env){
if((cljs_thread.eve.shared_atom.root_block_pool.length > (0))){
var oldest = (cljs_thread.eve.shared_atom.root_block_pool[(0)]);
var pooled_epoch = (oldest[(2)]);
var min_active = (cljs_thread.eve.shared_atom.get_min_active_epoch.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.get_min_active_epoch.cljs$core$IFn$_invoke$arity$1(s_atom_env) : cljs_thread.eve.shared_atom.get_min_active_epoch.call(null, s_atom_env));
if((((min_active == null)) || ((min_active > pooled_epoch)))){
cljs_thread.eve.shared_atom.root_block_pool.shift();

return [(oldest[(0)]),(oldest[(1)])];
} else {
return null;
}
} else {
return null;
}
});
/**
 * Allocate a block for root pointer storage.
 * Returns #js [offset descriptor-idx] on success, nil on failure.
 * Uses JS array instead of CLJS map to avoid PersistentArrayMap allocation per swap.
 * Tries epoch-safe pool first (O(1)), falls back to full alloc (descriptor scan).
 */
cljs_thread.eve.shared_atom.alloc_root_block = (function cljs_thread$eve$shared_atom$alloc_root_block(s_atom_env,size){
var or__5045__auto__ = cljs_thread.eve.shared_atom.take_safe_pool_root_block_BANG_(s_atom_env);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var result = cljs_thread.eve.shared_atom.alloc(s_atom_env,size);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))){
return null;
} else {
return [new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(result)];
}
}
});
/**
 * Clear the root block pool. Called when SAB environment changes.
 */
cljs_thread.eve.shared_atom.reset_root_pool_BANG_ = (function cljs_thread$eve$shared_atom$reset_root_pool_BANG_(){
return (cljs_thread.eve.shared_atom.root_block_pool.length = (0));
});
cljs_thread.eve.shared_atom.start_read_BANG_ = (function cljs_thread$eve$shared_atom$start_read_BANG_(s_atom_env,descriptor_idx){
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," StartRead desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx),"] "].join('');
var rm_view = new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764).cljs$core$IFn$_invoke$arity$1(s_atom_env);
if(cljs.core.truth_((function (){var and__5043__auto__ = rm_view;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = rm_view.buffer;
if(cljs.core.truth_(and__5043__auto____$1)){
return (rm_view.length > (0));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var map_idx = cljs_thread.eve.util.get_reader_map_idx(descriptor_idx);
if((((map_idx < (0))) || ((map_idx >= rm_view.length)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_SR - Reader map IDX OUT OF BOUNDS:",map_idx], 0));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"sr-map-idx-bounds","sr-map-idx-bounds",-1275584780)], null);
} else {
var old_val_before_add = cljs_thread.eve.util.atomic_add_int(rm_view,map_idx,(1));
var new_val_after_add = (old_val_before_add + (1));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"map-idx","map-idx",2119117583),map_idx,new cljs.core.Keyword(null,"new-count","new-count",1805622120),new_val_after_add], null);
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_SR - Invalid reader-map-view:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([rm_view], 0))], 0));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"sr-invalid-rm-view","sr-invalid-rm-view",1680382536)], null);
}
});
cljs_thread.eve.shared_atom.check_readers = (function cljs_thread$eve$shared_atom$check_readers(s_atom_env,descriptor_idx){
var temp__5821__auto__ = new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764).cljs$core$IFn$_invoke$arity$1(s_atom_env);
if(cljs.core.truth_(temp__5821__auto__)){
var rm_view = temp__5821__auto__;
if(cljs.core.truth_((function (){var and__5043__auto__ = rm_view;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = rm_view.buffer;
if(cljs.core.truth_(and__5043__auto____$1)){
return (rm_view.length > (0));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var map_idx = cljs_thread.eve.util.get_reader_map_idx(descriptor_idx);
if((((map_idx < (0))) || ((map_idx >= rm_view.length)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] CRITICAL - IDX OUT OF BOUNDS:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(map_idx)," for desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx)].join('')], 0));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"cr-map-idx-bounds","cr-map-idx-bounds",-1088946758)], null);
} else {
var retries = (400);
while(true){
var current_readers = cljs_thread.eve.util.atomic_load_int(rm_view,map_idx);
if((current_readers === (0))){
return new cljs.core.Keyword(null,"ok","ok",967785236);
} else {
if((current_readers < (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] CRITICAL_ERROR - Negative reader count ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_readers)," for desc_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx)," (map_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(map_idx),")"].join('')], 0));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"cr-negative-count","cr-negative-count",1992859912),new cljs.core.Keyword(null,"count","count",2139924085),current_readers], null);
} else {
if((retries > (0))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((0),cljs.core.mod(retries,(100)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] Waiting on desc_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx),"(map_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(map_idx),"), count:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_readers),", retries left:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(retries)].join('')], 0));
} else {
}

cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(0.01);

var G__24503 = (retries - (1));
retries = G__24503;
continue;
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] Timeout waiting for readers on desc_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx),"(map_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(map_idx),"), count:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_readers)].join('')], 0));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"cr-timeout","cr-timeout",-1253836244),new cljs.core.Keyword(null,"count","count",2139924085),current_readers], null);

}
}
}
break;
}
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] Invalid rm-view for desc_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx)].join('')], 0));

return new cljs.core.Keyword(null,"ok","ok",967785236);
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," CheckReaders] :reader-map-view is nil for desc_idx:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(descriptor_idx)].join('')], 0));

return new cljs.core.Keyword(null,"ok","ok",967785236);
}
});
cljs_thread.eve.shared_atom.end_read_BANG_ = (function cljs_thread$eve$shared_atom$end_read_BANG_(s_atom_env,target_descriptor_idx,worker_id_for_log){
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(worker_id_for_log)," EndRead desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_descriptor_idx),"] "].join('');
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var rm_view = new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764).cljs$core$IFn$_invoke$arity$1(s_atom_env);
if(cljs.core.truth_((function (){var and__5043__auto__ = rm_view;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = rm_view.buffer;
if(cljs.core.truth_(and__5043__auto____$1)){
return (rm_view.length > (0));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var map_idx_24505 = cljs_thread.eve.util.get_reader_map_idx(target_descriptor_idx);
if((((map_idx_24505 < (0))) || ((map_idx_24505 >= rm_view.length)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_ER - Reader map IDX OUT OF BOUNDS:",map_idx_24505], 0));
} else {
var current_val_before_sub_24506 = cljs_thread.eve.util.atomic_load_int(rm_view,map_idx_24505);
if((current_val_before_sub_24506 <= (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_ER_PRE_SUB - Count for map_idx:",map_idx_24505," is ALREADY ",current_val_before_sub_24506,". NOT decrementing."], 0));
} else {
var old_val_returned_by_sub_24508 = cljs_thread.eve.util.atomic_sub_int(rm_view,map_idx_24505,(1));
var new_val_after_sub_24509 = (old_val_returned_by_sub_24508 - (1));
if((new_val_after_sub_24509 < (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_ER_POST_SUB - Reader count for map_idx:",map_idx_24505," WENT NEGATIVE:",new_val_after_sub_24509], 0));
} else {
}
}
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"CRITICAL_ER - Invalid reader-map-view:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([rm_view], 0))], 0));
}

if(cljs.core.truth_((function (){var and__5043__auto__ = index_view;
if(cljs.core.truth_(and__5043__auto__)){
return index_view.buffer;
} else {
return and__5043__auto__;
}
})())){
var current_block_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,target_descriptor_idx,(0));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_block_status,(4))){
var log_prefix_cleanup = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(worker_id_for_log)," EndReadCleanup desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(target_descriptor_idx),"] "].join('');
var lock_owner_field_idx = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(target_descriptor_idx) + ((20) / (4)));
var lock_cleanup_retries = (5);
while(true){
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,lock_owner_field_idx,(0),worker_id_for_log))){
try{var status_now = cljs_thread.eve.util.read_block_descriptor_field(index_view,target_descriptor_idx,(0));
var reader_check_result_final = cljs_thread.eve.shared_atom.check_readers(s_atom_env,target_descriptor_idx);
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status_now,(4))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"ok","ok",967785236),reader_check_result_final)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix_cleanup,"Confirmed ORPHANED and LAST READER. Performing final free."], 0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,target_descriptor_idx,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,target_descriptor_idx,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,target_descriptor_idx,(0),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,target_descriptor_idx,(0),null);

var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
return (cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_.cljs$core$IFn$_invoke$arity$3 ? cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_.cljs$core$IFn$_invoke$arity$3(index_view,max_descriptors,target_descriptor_idx) : cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_.call(null, index_view,max_descriptors,target_descriptor_idx));
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_now,(4))){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix_cleanup,"Status changed from ORPHANED to ",status_now," during cleanup."], 0));
} else {
return null;
}
}
}finally {cljs_thread.eve.util.atomic_store_int(index_view,lock_owner_field_idx,(0));
}} else {
if((lock_cleanup_retries > (0))){
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(0.01);

var G__24516 = (lock_cleanup_retries - (1));
lock_cleanup_retries = G__24516;
continue;
} else {
return null;
}
}
break;
}
} else {
return null;
}
} else {
return null;
}
});
/**
 * Find a FREE descriptor whose block ends exactly where `current-desc-idx`'s block starts.
 * i.e. neighbor.data_offset + neighbor.block_capacity == current.data_offset.
 * Returns the neighbor's desc-idx, or -1 if not found.
 * Caller must already hold the lock on current-desc-idx.
 */
cljs_thread.eve.shared_atom.find_physically_adjacent_left_free_neighbor = (function cljs_thread$eve$shared_atom$find_physically_adjacent_left_free_neighbor(index_view,max_descriptors,current_desc_idx,current_data_offset){
var i = (0);
while(true){
if((i >= max_descriptors)){
return (-1);
} else {
if((i === current_desc_idx)){
var G__24517 = (i + (1));
i = G__24517;
continue;
} else {
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(0));
if((status === (0))){
var n_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(4));
var n_capacity = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(12));
if(((n_offset + n_capacity) === current_data_offset)){
return i;
} else {
var G__24518 = (i + (1));
i = G__24518;
continue;
}
} else {
var G__24519 = (i + (1));
i = G__24519;
continue;
}
}
}
break;
}
});
/**
 * Find a FREE descriptor whose block starts exactly where `current-desc-idx`'s block ends.
 * i.e. neighbor.data_offset == current.data_offset + current.block_capacity.
 * Returns the neighbor's desc-idx, or -1 if not found.
 * Caller must already hold the lock on current-desc-idx.
 */
cljs_thread.eve.shared_atom.find_physically_adjacent_right_free_neighbor = (function cljs_thread$eve$shared_atom$find_physically_adjacent_right_free_neighbor(index_view,max_descriptors,current_desc_idx,current_block_end_offset){
var i = (0);
while(true){
if((i >= max_descriptors)){
return (-1);
} else {
if((i === current_desc_idx)){
var G__24521 = (i + (1));
i = G__24521;
continue;
} else {
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(0));
if((status === (0))){
var n_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(4));
if((n_offset === current_block_end_offset)){
return i;
} else {
var G__24522 = (i + (1));
i = G__24522;
continue;
}
} else {
var G__24523 = (i + (1));
i = G__24523;
continue;
}
}
}
break;
}
});
/**
 * After freeing a block, merge with physically adjacent free blocks.
 * Caller must already hold the lock on desc-idx. The current block must be STATUS_FREE.
 * 
 * Left coalesce:  expand left neighbor to include our block, then mark us as ZEROED_UNUSED.
 * Right coalesce: expand the survivor (us or the left absorber) to include right neighbor.
 * 
 * CRITICAL: The left neighbor's lock is held continuously through both left and right
 * merges to prevent TOCTOU races where another worker could allocate the survivor
 * between left-lock-release and right-merge.
 * 
 * Acquires locks on neighbor descriptors via CAS before modifying.
 * If a neighbor lock fails (contention), skip that side — partial coalescing is safe.
 */
cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_ = (function cljs_thread$eve$shared_atom$coalesce_adjacent_free_blocks_BANG_(index_view,max_descriptors,desc_idx){
var our_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,desc_idx,(4));
var our_capacity = cljs_thread.eve.util.read_block_descriptor_field(index_view,desc_idx,(12));
var left_lock_field_v = cljs.core.volatile_BANG_(null);
var left_idx = cljs_thread.eve.shared_atom.find_physically_adjacent_left_free_neighbor(index_view,max_descriptors,desc_idx,our_offset);
var survivor_idx = (((left_idx === (-1)))?desc_idx:(function (){var llf = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(left_idx) + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,llf,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var left_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,left_idx,(0));
if((left_status === (0))){
var left_capacity = cljs_thread.eve.util.read_block_descriptor_field(index_view,left_idx,(12));
var merged_capacity = (left_capacity + our_capacity);
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,left_idx,(12),merged_capacity);

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,left_idx,(0),merged_capacity);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx,(0),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx,(4),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx,(12),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,desc_idx,(-1),(0));

cljs.core.vreset_BANG_(left_lock_field_v,llf);

return left_idx;
} else {
cljs_thread.eve.util.atomic_store_int(index_view,llf,(0));

return desc_idx;
}
} else {
return desc_idx;
}
})());
var survivor_end_24529 = (cljs_thread.eve.util.read_block_descriptor_field(index_view,survivor_idx,(4)) + cljs_thread.eve.util.read_block_descriptor_field(index_view,survivor_idx,(12)));
var right_idx_24530 = cljs_thread.eve.shared_atom.find_physically_adjacent_right_free_neighbor(index_view,max_descriptors,survivor_idx,survivor_end_24529);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(right_idx_24530,(-1))){
var right_lock_field_24531 = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(right_idx_24530) + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,right_lock_field_24531,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var right_status_24532 = cljs_thread.eve.util.read_block_descriptor_field(index_view,right_idx_24530,(0));
if((right_status_24532 === (0))){
var surv_capacity_24533 = cljs_thread.eve.util.read_block_descriptor_field(index_view,survivor_idx,(12));
var right_capacity_24534 = cljs_thread.eve.util.read_block_descriptor_field(index_view,right_idx_24530,(12));
var merged_capacity_24535 = (surv_capacity_24533 + right_capacity_24534);
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,survivor_idx,(12),merged_capacity_24535);

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,survivor_idx,(0),merged_capacity_24535);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,right_idx_24530,(0),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,right_idx_24530,(4),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,right_idx_24530,(12),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,right_idx_24530,(-1),(0));
} else {
}

cljs_thread.eve.util.atomic_store_int(index_view,right_lock_field_24531,(0));
} else {
}
} else {
}

var temp__5823__auto__ = cljs.core.deref(left_lock_field_v);
if(cljs.core.truth_(temp__5823__auto__)){
var llf = temp__5823__auto__;
return cljs_thread.eve.util.atomic_store_int(index_view,llf,(0));
} else {
return null;
}
});
cljs_thread.eve.shared_atom.FREE_RETRY_BOUNCES = (8);
cljs_thread.eve.shared_atom.FREE_RETRY_BASE_DELAY_MS = (2);
/**
 * Single attempt to free a descriptor. Returns outcome map.
 * When readers are active, returns {:error :active-readers} WITHOUT marking ORPHANED
 * (the caller decides whether to retry or give up and mark ORPHANED).
 */
cljs_thread.eve.shared_atom.free_once = (function cljs_thread$eve$shared_atom$free_once(s_atom_env,desc_idx_to_free){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var lock_owner_field_idx = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(desc_idx_to_free) + ((20) / (4)));
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," Free desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(desc_idx_to_free),"] "].join('');
var lock_retries = (400);
while(true){
if((lock_retries === (0))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! FAILED to lock descriptor for freeing after retries."], 0));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"free-lock-timeout","free-lock-timeout",509526825)], null);
} else {
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,lock_owner_field_idx,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var status_initially = cljs_thread.eve.util.read_block_descriptor_field(index_view,desc_idx_to_free,(0));
var lock_cleared_by_clear_descriptor_QMARK_ = cljs.core.volatile_BANG_(false);
var processing_outcome = (function (){try{if((status_initially === (1))){
var reader_check_outcome = cljs_thread.eve.shared_atom.check_readers(s_atom_env,desc_idx_to_free);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"ok","ok",967785236),reader_check_outcome)){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(0),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,desc_idx_to_free,(0),null);

cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_(index_view,max_descriptors,desc_idx_to_free);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"success","success",1890645906),true,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"data-block-freed","data-block-freed",1083819186)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"active-readers","active-readers",2121472446),new cljs.core.Keyword(null,"details","details",1956795411),reader_check_outcome], null);
}
} else {
if((status_initially === (3))){
cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_(index_view,desc_idx_to_free);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(0),(-1));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"success","success",1890645906),true,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"atom-header-freed","atom-header-freed",-575811068)], null);
} else {
if((status_initially === (4))){
var reader_check_outcome = cljs_thread.eve.shared_atom.check_readers(s_atom_env,desc_idx_to_free);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"ok","ok",967785236),reader_check_outcome)){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(0),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,desc_idx_to_free,(0),null);

cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_(index_view,max_descriptors,desc_idx_to_free);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"success","success",1890645906),true,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"orphaned-block-cleaned-by-free","orphaned-block-cleaned-by-free",1713403998)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"active-readers","active-readers",2121472446),new cljs.core.Keyword(null,"details","details",1956795411),reader_check_outcome], null);
}
} else {
if((((status_initially === (0))) || ((status_initially === (-1))))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"success","success",1890645906),true,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"already-handled","already-handled",-834482874)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"unknown-state-during-free","unknown-state-during-free",-1914531344),new cljs.core.Keyword(null,"status","status",-1997798413),status_initially], null);

}
}
}
}
}finally {if(cljs.core.truth_(cljs.core.deref(lock_cleared_by_clear_descriptor_QMARK_))){
} else {
cljs_thread.eve.util.atomic_store_int(index_view,lock_owner_field_idx,(0));
}
}})();
return processing_outcome;
} else {
var G__24544 = (lock_retries - (1));
lock_retries = G__24544;
continue;
}
}
break;
}
});
/**
 * Free a descriptor with retry bounce on active readers.
 * Tries up to FREE_RETRY_BOUNCES times with exponential backoff (2ms, 4ms, 8ms, 16ms)
 * before giving up and marking as ORPHANED. Uses yield-cpu for CPU-friendly sleeping.
 */
cljs_thread.eve.shared_atom.free = (function cljs_thread$eve$shared_atom$free(s_atom_env,desc_idx_to_free){
var bounce = (0);
while(true){
var outcome = cljs_thread.eve.shared_atom.free_once(s_atom_env,desc_idx_to_free);
if(cljs.core.truth_((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"success","success",1890645906).cljs$core$IFn$_invoke$arity$1(outcome);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var and__5043__auto__ = new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(outcome);
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"active-readers","active-readers",2121472446),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(outcome));
} else {
return and__5043__auto__;
}
}
})())){
return outcome;
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"active-readers","active-readers",2121472446),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(outcome))) && ((bounce < (8))))){
var delay_ms_24547 = ((2) * ((1) << bounce));
cljs_thread.eve.util.yield_cpu.cljs$core$IFn$_invoke$arity$1(delay_ms_24547);

var G__24548 = (bounce + (1));
bounce = G__24548;
continue;
} else {
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var lock_owner_field_idx = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(desc_idx_to_free) + ((20) / (4)));
var retries_24549 = (50);
while(true){
if((retries_24549 > (0))){
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,lock_owner_field_idx,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var status_24550 = cljs_thread.eve.util.read_block_descriptor_field(index_view,desc_idx_to_free,(0));
if((status_24550 === (1))){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,desc_idx_to_free,(0),(4));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,desc_idx_to_free,(4),null);
} else {
}

cljs_thread.eve.util.atomic_store_int(index_view,lock_owner_field_idx,(0));
} else {
var G__24551 = (retries_24549 - (1));
retries_24549 = G__24551;
continue;
}
} else {
}
break;
}

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"active-readers-became-orphaned","active-readers-became-orphaned",-130122131),new cljs.core.Keyword(null,"details","details",1956795411),new cljs.core.Keyword(null,"details","details",1956795411).cljs$core$IFn$_invoke$arity$1(outcome)], null);

}
}
break;
}
});
/**
 * Calculate byte offset for a worker slot in the registry.
 */
cljs_thread.eve.shared_atom.get_worker_slot_byte_offset = (function cljs_thread$eve$shared_atom$get_worker_slot_byte_offset(slot_idx){
return ((24) + (slot_idx * (24)));
});
/**
 * Calculate Int32Array index for start of a worker slot.
 */
cljs_thread.eve.shared_atom.get_worker_slot_int32_offset = (function cljs_thread$eve$shared_atom$get_worker_slot_int32_offset(slot_idx){
return (cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx) / (4));
});
/**
 * Claim a slot in the worker registry. Returns slot index or nil if registry full.
 * Should be called once per worker at startup.
 */
cljs_thread.eve.shared_atom.register_worker_BANG_ = (function cljs_thread$eve$shared_atom$register_worker_BANG_(s_atom_env,worker_id){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_idx = (0);
while(true){
if((slot_idx < (256))){
var slot_int32_offset = cljs_thread.eve.shared_atom.get_worker_slot_int32_offset(slot_idx);
var status_idx = slot_int32_offset;
if(((0) === Atomics.compareExchange(index_view,status_idx,(0),(1)))){
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
Atomics.store(index_view,((slot_byte_offset + (16)) / (4)),worker_id);

Atomics.store(index_view,((slot_byte_offset + (4)) / (4)),(0));

(cljs_thread.eve.shared_atom.update_heartbeat_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.shared_atom.update_heartbeat_BANG_.cljs$core$IFn$_invoke$arity$2(s_atom_env,slot_idx) : cljs_thread.eve.shared_atom.update_heartbeat_BANG_.call(null, s_atom_env,slot_idx));

return slot_idx;
} else {
var G__24552 = (slot_idx + (1));
slot_idx = G__24552;
continue;
}
} else {
return null;
}
break;
}
});
/**
 * Release a worker slot. Should be called when worker shuts down.
 */
cljs_thread.eve.shared_atom.unregister_worker_BANG_ = (function cljs_thread$eve$shared_atom$unregister_worker_BANG_(s_atom_env,slot_idx){
if((((slot_idx >= (0))) && ((slot_idx < (256))))){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_int32_offset = cljs_thread.eve.shared_atom.get_worker_slot_int32_offset(slot_idx);
Atomics.store(index_view,(slot_int32_offset + ((4) / (4))),(0));

return Atomics.store(index_view,slot_int32_offset,(0));
} else {
return null;
}
});
/**
 * Lazily register this worker in the SAB worker registry for epoch-based GC.
 * Returns the slot index. Idempotent per SAB — each SAB gets its own slot.
 * Uses index-view as the cache key since each SAB has a unique Int32Array.
 */
cljs_thread.eve.shared_atom.ensure_worker_registered_BANG_ = (function cljs_thread$eve$shared_atom$ensure_worker_registered_BANG_(s_atom_env){
var iv = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var or__5045__auto__ = cljs_thread.eve.shared_atom.worker_slot_map.get(iv);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var wid = (function (){var or__5045__auto____$1 = cljs_thread.eve.data._STAR_worker_id_STAR_;
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
var id = (Math.floor((Math.random() * (2147483646))) + (1));
(cljs_thread.eve.data._STAR_worker_id_STAR_ = id);

return id;
}
})();
var slot = cljs_thread.eve.shared_atom.register_worker_BANG_(s_atom_env,wid);
if(cljs.core.truth_(slot)){
cljs_thread.eve.shared_atom.worker_slot_map.set(iv,slot);
} else {
}

return slot;
}
});
/**
 * Update worker's heartbeat timestamp. Should be called periodically.
 */
cljs_thread.eve.shared_atom.update_heartbeat_BANG_ = (function cljs_thread$eve$shared_atom$update_heartbeat_BANG_(s_atom_env,slot_idx){
if((((slot_idx >= (0))) && ((slot_idx < (256))))){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
var now = Date.now();
var lo = (now & (4294967295));
var hi = (now >>> (32));
Atomics.store(index_view,((slot_byte_offset + (8)) / (4)),lo);

return Atomics.store(index_view,((slot_byte_offset + (12)) / (4)),hi);
} else {
return null;
}
});
/**
 * Read a worker's heartbeat timestamp.
 */
cljs_thread.eve.shared_atom.read_heartbeat = (function cljs_thread$eve$shared_atom$read_heartbeat(index_view,slot_idx){
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
var lo = Atomics.load(index_view,((slot_byte_offset + (8)) / (4)));
var hi = Atomics.load(index_view,((slot_byte_offset + (12)) / (4)));
return ((lo >>> (0)) + ((hi >>> (0)) * (4294967296)));
});
/**
 * Check if a worker is still alive based on heartbeat. Returns true if alive.
 */
cljs_thread.eve.shared_atom.check_worker_liveness = (function cljs_thread$eve$shared_atom$check_worker_liveness(s_atom_env,slot_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var heartbeat = cljs_thread.eve.shared_atom.read_heartbeat(index_view,slot_idx);
var now = Date.now();
return ((now - heartbeat) < (30000));
});
/**
 * Scan registry and mark workers with stale heartbeats.
 * Returns count of workers marked stale.
 */
cljs_thread.eve.shared_atom.mark_stale_workers_BANG_ = (function cljs_thread$eve$shared_atom$mark_stale_workers_BANG_(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_idx = (0);
var stale_count = (0);
while(true){
if((slot_idx < (256))){
var slot_int32_offset = cljs_thread.eve.shared_atom.get_worker_slot_int32_offset(slot_idx);
var status = Atomics.load(index_view,slot_int32_offset);
if((status === (1))){
if(cljs_thread.eve.shared_atom.check_worker_liveness(s_atom_env,slot_idx)){
var G__24558 = (slot_idx + (1));
var G__24559 = stale_count;
slot_idx = G__24558;
stale_count = G__24559;
continue;
} else {
Atomics.compareExchange(index_view,slot_int32_offset,(1),(2));

var G__24560 = (slot_idx + (1));
var G__24561 = (stale_count + (1));
slot_idx = G__24560;
stale_count = G__24561;
continue;
}
} else {
var G__24562 = (slot_idx + (1));
var G__24563 = stale_count;
slot_idx = G__24562;
stale_count = G__24563;
continue;
}
} else {
return stale_count;
}
break;
}
});
/**
 * Read the current global epoch.
 */
cljs_thread.eve.shared_atom.get_current_epoch = (function cljs_thread$eve$shared_atom$get_current_epoch(s_atom_env){
return Atomics.load(new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env),((20) / (4)));
});
/**
 * Atomically increment global epoch. Returns the NEW epoch value.
 */
cljs_thread.eve.shared_atom.increment_epoch_BANG_ = (function cljs_thread$eve$shared_atom$increment_epoch_BANG_(s_atom_env){
return (Atomics.add(new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env),((20) / (4)),(1)) + (1));
});
/**
 * Begin a read operation - record current epoch in worker slot.
 * Returns the epoch being read. Must be paired with end-read-epoch!.
 */
cljs_thread.eve.shared_atom.begin_read_BANG_ = (function cljs_thread$eve$shared_atom$begin_read_BANG_(s_atom_env,slot_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var epoch = cljs_thread.eve.shared_atom.get_current_epoch(s_atom_env);
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
Atomics.store(index_view,((slot_byte_offset + (4)) / (4)),epoch);

return epoch;
});
/**
 * End a read operation - clear epoch from worker slot.
 */
cljs_thread.eve.shared_atom.end_read_epoch_BANG_ = (function cljs_thread$eve$shared_atom$end_read_epoch_BANG_(s_atom_env,slot_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
return Atomics.store(index_view,((slot_byte_offset + (4)) / (4)),(0));
});
/**
 * Find the minimum epoch still being read by any active (non-stale) worker.
 * When no worker is actively reading (all epochs=0), returns the current global
 * epoch as a safe fallback. This prevents try-free-retired! from freeing ALL
 * retired blocks when workers are between operations — a worker could start
 * reading the next microsecond and walk into a freed node. By returning the
 * current epoch, only blocks retired at earlier epochs are freed.
 */
cljs_thread.eve.shared_atom.get_min_active_epoch = (function cljs_thread$eve$shared_atom$get_min_active_epoch(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var slot_idx = (0);
var min_epoch = null;
while(true){
if((slot_idx < (256))){
var slot_int32_offset = cljs_thread.eve.shared_atom.get_worker_slot_int32_offset(slot_idx);
var status = Atomics.load(index_view,slot_int32_offset);
if((status === (1))){
var slot_byte_offset = cljs_thread.eve.shared_atom.get_worker_slot_byte_offset(slot_idx);
var epoch = Atomics.load(index_view,((slot_byte_offset + (4)) / (4)));
if((((epoch > (0))) && ((((min_epoch == null)) || ((epoch < min_epoch)))))){
var G__24568 = (slot_idx + (1));
var G__24569 = epoch;
slot_idx = G__24568;
min_epoch = G__24569;
continue;
} else {
var G__24570 = (slot_idx + (1));
var G__24571 = min_epoch;
slot_idx = G__24570;
min_epoch = G__24571;
continue;
}
} else {
var G__24572 = (slot_idx + (1));
var G__24573 = min_epoch;
slot_idx = G__24572;
min_epoch = G__24573;
continue;
}
} else {
var or__5045__auto__ = min_epoch;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.eve.shared_atom.get_current_epoch(s_atom_env);
}
}
break;
}
});
/**
 * Mark a block as retired at the current epoch.
 * Called by writer after successful update to mark old blocks for cleanup.
 * Returns true if successfully retired, false if already being processed.
 */
cljs_thread.eve.shared_atom.retire_block_BANG_ = (function cljs_thread$eve$shared_atom$retire_block_BANG_(s_atom_env,descriptor_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var current_epoch = cljs_thread.eve.shared_atom.get_current_epoch(s_atom_env);
var desc_base = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(descriptor_idx);
var status_idx = (desc_base + ((0) / (4)));
if(((1) === Atomics.compareExchange(index_view,status_idx,(1),(5)))){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(24),current_epoch);

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,descriptor_idx,(5),null);

return true;
} else {
return null;
}
});
/**
 * Try to free a retired block if safe (no readers in its epoch or earlier,
 * AND no active start-read! reader count).
 * Returns :freed, :has-readers, or :not-retired.
 * This is the cooperative cleanup - call opportunistically.
 */
cljs_thread.eve.shared_atom.try_free_retired_BANG_ = (function cljs_thread$eve$shared_atom$try_free_retired_BANG_(s_atom_env,descriptor_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,descriptor_idx,(0));
if((status === (5))){
var retired_epoch = cljs_thread.eve.util.read_block_descriptor_field(index_view,descriptor_idx,(24));
var min_active = cljs_thread.eve.shared_atom.get_min_active_epoch(s_atom_env);
if((((min_active == null)) || ((min_active > retired_epoch)))){
var rm_view = new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var readers_ok_QMARK_ = (cljs.core.truth_(rm_view)?(function (){var map_idx = cljs_thread.eve.util.get_reader_map_idx(descriptor_idx);
return (((map_idx < (0))) || ((((map_idx >= rm_view.length)) || ((cljs_thread.eve.util.atomic_load_int(rm_view,map_idx) === (0))))));
})():true);
if((!(readers_ok_QMARK_))){
return new cljs.core.Keyword(null,"has-readers","has-readers",-1410134809);
} else {
var lock_owner_idx = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(descriptor_idx) + ((20) / (4)));
if(((0) === Atomics.compareExchange(index_view,lock_owner_idx,(0),(function (){var or__5045__auto__ = cljs_thread.eve.data._STAR_worker_id_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (-1);
}
})()))){
try{var status_now = cljs_thread.eve.util.read_block_descriptor_field(index_view,descriptor_idx,(0));
if((status_now === (5))){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(16),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(24),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,descriptor_idx,(0),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,descriptor_idx,(0),null);

cljs_thread.eve.shared_atom.coalesce_adjacent_free_blocks_BANG_(index_view,cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env),descriptor_idx);

return new cljs.core.Keyword(null,"freed","freed",-530926477);
} else {
return new cljs.core.Keyword(null,"not-retired","not-retired",-1388246626);
}
}finally {Atomics.store(index_view,lock_owner_idx,(0));
}} else {
return new cljs.core.Keyword(null,"has-readers","has-readers",-1410134809);
}
}
} else {
return new cljs.core.Keyword(null,"has-readers","has-readers",-1410134809);
}
} else {
return new cljs.core.Keyword(null,"not-retired","not-retired",-1388246626);
}
});
/**
 * SIMD-accelerated sweep: use v128 scan over status mirror to find retired
 * descriptors, then only try-free-retired! on those. O(N/4) scan + O(R) frees.
 */
cljs_thread.eve.shared_atom.sweep_retired_blocks_simd_BANG_ = (function cljs_thread$eve$shared_atom$sweep_retired_blocks_simd_BANG_(s_atom_env,index_view,max_descriptors){
var sm = new cljs.core.Keyword(null,"status-mirror-start","status-mirror-start",-1959204348).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var scratch = new cljs.core.Keyword(null,"scratch-region-start","scratch-region-start",-1184934695).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var count_found = cljs_thread.eve.wasm_mem.find_retired_descriptors_simd(sm,max_descriptors,scratch,max_descriptors);
if((count_found === (0))){
return (0);
} else {
var i = (0);
var freed_count = (0);
while(true){
if((i < count_found)){
var desc_idx = (index_view[((scratch / (4)) + i)]);
var result = cljs_thread.eve.shared_atom.try_free_retired_BANG_(s_atom_env,desc_idx);
var G__24583 = (i + (1));
var G__24584 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.Keyword(null,"freed","freed",-530926477)))?(freed_count + (1)):freed_count);
i = G__24583;
freed_count = G__24584;
continue;
} else {
return freed_count;
}
break;
}
}
});
/**
 * Try to free an orphaned block via free-once (which includes coalescing).
 * Returns :freed if successfully freed, :has-readers if still referenced.
 */
cljs_thread.eve.shared_atom.try_free_orphaned_BANG_ = (function cljs_thread$eve$shared_atom$try_free_orphaned_BANG_(s_atom_env,descriptor_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,descriptor_idx,(0));
if((status === (4))){
var result = cljs_thread.eve.shared_atom.free_once(s_atom_env,descriptor_idx);
if(cljs.core.truth_(new cljs.core.Keyword(null,"success","success",1890645906).cljs$core$IFn$_invoke$arity$1(result))){
return new cljs.core.Keyword(null,"freed","freed",-530926477);
} else {
return new cljs.core.Keyword(null,"has-readers","has-readers",-1410134809);
}
} else {
return new cljs.core.Keyword(null,"not-orphaned","not-orphaned",165413377);
}
});
/**
 * Single-pass coalesce: collect all FREE blocks, sort by physical offset,
 * merge adjacent pairs. O(N + F*log(F)) where F = free blocks.
 * Runs AFTER sweep so no per-block O(N) neighbor scans during freeing.
 * Uses ordered lock acquisition (lower desc-idx first) to prevent deadlock.
 */
cljs_thread.eve.shared_atom.batch_coalesce_free_blocks_BANG_ = (function cljs_thread$eve$shared_atom$batch_coalesce_free_blocks_BANG_(index_view,max_descriptors){
var free_blocks = [];
var n__5636__auto___24589 = max_descriptors;
var i_24590 = (0);
while(true){
if((i_24590 < n__5636__auto___24589)){
var status_24591 = cljs_thread.eve.util.read_block_descriptor_field(index_view,i_24590,(0));
if((status_24591 === (0))){
free_blocks.push([cljs_thread.eve.util.read_block_descriptor_field(index_view,i_24590,(4)),cljs_thread.eve.util.read_block_descriptor_field(index_view,i_24590,(12)),i_24590]);
} else {
}

var G__24592 = (i_24590 + (1));
i_24590 = G__24592;
continue;
} else {
}
break;
}

free_blocks.sort((function (a,b){
return ((a[(0)]) - (b[(0)]));
}));

var len = free_blocks.length;
if((len > (1))){
var i = (1);
var merged = (0);
var surv_i = (0);
while(true){
if((i >= len)){
return merged;
} else {
var s = (free_blocks[surv_i]);
var c = (free_blocks[i]);
var s_end = ((s[(0)]) + (s[(1)]));
if((s_end === (c[(0)]))){
var c_idx = (c[(2)]);
var s_idx = (s[(2)]);
var wid = (function (){var or__5045__auto__ = cljs_thread.eve.data._STAR_worker_id_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (-1);
}
})();
var s_lock = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(s_idx) + ((20) / (4)));
var c_lock = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(c_idx) + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,s_lock,(0),wid))){
var s_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,s_idx,(0));
if((s_status === (0))){
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,c_lock,(0),wid))){
var c_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,c_idx,(0));
if((c_status === (0))){
var new_cap = ((s[(1)]) + (c[(1)]));
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,s_idx,(12),new_cap);

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,s_idx,(0),new_cap);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,c_idx,(0),(-1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,c_idx,(4),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,c_idx,(12),(0));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,c_idx,(-1),(0));

cljs_thread.eve.util.atomic_store_int(index_view,c_lock,(0));

cljs_thread.eve.util.atomic_store_int(index_view,s_lock,(0));

(s[(1)] = new_cap);

var G__24607 = (i + (1));
var G__24608 = (merged + (1));
var G__24609 = surv_i;
i = G__24607;
merged = G__24608;
surv_i = G__24609;
continue;
} else {
cljs_thread.eve.util.atomic_store_int(index_view,c_lock,(0));

cljs_thread.eve.util.atomic_store_int(index_view,s_lock,(0));

var G__24611 = (i + (1));
var G__24612 = merged;
var G__24613 = i;
i = G__24611;
merged = G__24612;
surv_i = G__24613;
continue;
}
} else {
cljs_thread.eve.util.atomic_store_int(index_view,s_lock,(0));

var G__24614 = (i + (1));
var G__24615 = merged;
var G__24616 = i;
i = G__24614;
merged = G__24615;
surv_i = G__24616;
continue;
}
} else {
cljs_thread.eve.util.atomic_store_int(index_view,s_lock,(0));

var G__24618 = (i + (1));
var G__24619 = merged;
var G__24620 = i;
i = G__24618;
merged = G__24619;
surv_i = G__24620;
continue;
}
} else {
var G__24621 = (i + (1));
var G__24622 = merged;
var G__24623 = i;
i = G__24621;
merged = G__24622;
surv_i = G__24623;
continue;
}
} else {
var G__24627 = (i + (1));
var G__24628 = merged;
var G__24629 = i;
i = G__24627;
merged = G__24628;
surv_i = G__24629;
continue;
}
}
break;
}
} else {
return null;
}
});
/**
 * GC sweep: scan for retired and orphaned blocks, free those safe to free,
 * then batch-coalesce all free blocks to prevent fragmentation.
 * Returns count of blocks freed. Call this periodically or opportunistically.
 * Uses SIMD-accelerated status mirror scan when available for retired blocks,
 * then does a scalar pass for orphaned blocks.
 */
cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_ = (function cljs_thread$eve$shared_atom$sweep_retired_blocks_BANG_(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
cljs_thread.eve.shared_atom.mark_stale_workers_BANG_(s_atom_env);

var retired_freed = (cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.deref(cljs_thread.eve.wasm_mem.wasm_ready);
if(cljs.core.truth_(and__5043__auto__)){
return new cljs.core.Keyword(null,"status-mirror-start","status-mirror-start",-1959204348).cljs$core$IFn$_invoke$arity$1(s_atom_env);
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.shared_atom.sweep_retired_blocks_simd_BANG_(s_atom_env,index_view,max_descriptors):(function (){var desc_idx = (0);
var freed_count = (0);
while(true){
if((desc_idx < max_descriptors)){
var result = cljs_thread.eve.shared_atom.try_free_retired_BANG_(s_atom_env,desc_idx);
var G__24630 = (desc_idx + (1));
var G__24631 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.Keyword(null,"freed","freed",-530926477)))?(freed_count + (1)):freed_count);
desc_idx = G__24630;
freed_count = G__24631;
continue;
} else {
return freed_count;
}
break;
}
})());
var orphaned_freed = (function (){var desc_idx = (0);
var freed_count = (0);
while(true){
if((desc_idx < max_descriptors)){
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,desc_idx,(0));
if((status === (4))){
var result = cljs_thread.eve.shared_atom.try_free_orphaned_BANG_(s_atom_env,desc_idx);
var G__24632 = (desc_idx + (1));
var G__24633 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.Keyword(null,"freed","freed",-530926477)))?(freed_count + (1)):freed_count);
desc_idx = G__24632;
freed_count = G__24633;
continue;
} else {
var G__24634 = (desc_idx + (1));
var G__24635 = freed_count;
desc_idx = G__24634;
freed_count = G__24635;
continue;
}
} else {
return freed_count;
}
break;
}
})();
var total_freed = (retired_freed + orphaned_freed);
if((total_freed > (0))){
cljs_thread.eve.shared_atom.batch_coalesce_free_blocks_BANG_(index_view,max_descriptors);
} else {
}

return total_freed;
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.compaction_temperature !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.compaction_temperature = cljs.core.volatile_BANG_(1.0);
}
/**
 * Set compaction probability (0.0 = never, 1.0 = always).
 */
cljs_thread.eve.shared_atom.set_compaction_temperature_BANG_ = (function cljs_thread$eve$shared_atom$set_compaction_temperature_BANG_(t){
return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.compaction_temperature,(function (){var x__5130__auto__ = 0.0;
var y__5131__auto__ = (function (){var x__5133__auto__ = 1.0;
var y__5134__auto__ = t;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})());
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.on_block_moved_fn !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.on_block_moved_fn = cljs.core.volatile_BANG_(null);
}
/**
 * Register callback for block move events. fn [old-off new-off old-desc-idx new-desc-idx].
 */
cljs_thread.eve.shared_atom.set_on_block_moved_fn_BANG_ = (function cljs_thread$eve$shared_atom$set_on_block_moved_fn_BANG_(f){
return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.on_block_moved_fn,f);
});
cljs_thread.eve.shared_atom.COMPACT_BITMAP_TYPE = (1);
cljs_thread.eve.shared_atom.COMPACT_HEADER_SIZE = (12);
/**
 * Popcount for a 32-bit integer (inline, no dependency on sab_map).
 */
cljs_thread.eve.shared_atom.compact_popcount32 = (function cljs_thread$eve$shared_atom$compact_popcount32(n){
var n__$1 = (n - ((n >>> (1)) & (1431655765)));
var n__$2 = ((n__$1 & (858993459)) + ((n__$1 >>> (2)) & (858993459)));
var n__$3 = ((n__$2 + (n__$2 >>> (4))) & (252645135));
var n__$4 = (n__$3 + (n__$3 >>> (8)));
var n__$5 = (n__$4 + (n__$4 >>> (16)));
return (n__$5 & (63));
});
/**
 * After moving a block from old-offset to new-offset, scan all ALLOC blocks
 * to find the HAMT parent whose child pointer matches old-offset and update it.
 * Also checks the atom root chain for the root HAMT node case.
 * Returns true if a parent was found and updated, false otherwise.
 */
cljs_thread.eve.shared_atom.find_and_update_hamt_parent_BANG_ = (function cljs_thread$eve$shared_atom$find_and_update_hamt_parent_BANG_(s_atom_env,index_view,max_descriptors,old_offset,new_offset){
var dv = cljs_thread.eve.wasm_mem.data_view();
var or__5045__auto__ = (function (){var i = (0);
while(true){
if((i < max_descriptors)){
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(0));
if((status === (1))){
var data_off = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(4));
var data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(8));
if((((data_len >= (16))) && ((dv.getUint8(data_off) === (1))))){
var node_bm = dv.getUint32((data_off + (8)),true);
var child_count = cljs_thread.eve.shared_atom.compact_popcount32(node_bm);
if((((child_count > (0))) && ((((child_count <= (32))) && ((data_len >= ((12) + ((4) * child_count)))))))){
var found_idx = (function (){var c = (0);
while(true){
if((c < child_count)){
var ptr_off = ((data_off + (12)) + (c * (4)));
var child_off = dv.getInt32(ptr_off,true);
if((child_off === old_offset)){
return c;
} else {
var G__24654 = (c + (1));
c = G__24654;
continue;
}
} else {
return null;
}
break;
}
})();
if(cljs.core.truth_(found_idx)){
var ptr_byte_off = ((data_off + (12)) + (found_idx * (4)));
var ptr_i32_idx = (ptr_byte_off >>> (2));
Atomics.store(index_view,ptr_i32_idx,new_offset);

return true;
} else {
var G__24655 = (i + (1));
i = G__24655;
continue;
}
} else {
var G__24656 = (i + (1));
i = G__24656;
continue;
}
} else {
var G__24657 = (i + (1));
i = G__24657;
continue;
}
} else {
var G__24658 = (i + (1));
i = G__24658;
continue;
}
} else {
return null;
}
break;
}
})();
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = (function (){var root_desc_idx = Atomics.load(index_view,((16) / (4)));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(root_desc_idx,(-1))){
var root_data_off = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_desc_idx,(4));
var root_data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_desc_idx,(8));
var u8 = cljs_thread.eve.wasm_mem.u8_view();
if((((root_data_len >= (7))) && (((((u8[root_data_off]) === (238))) && (((u8[(root_data_off + (1))]) === (219))))))){
var sab_header_off = dv.getInt32((root_data_off + (3)),true);
if((sab_header_off > (-1))){
var hamt_root_off = dv.getInt32((sab_header_off + (8)),true);
if((hamt_root_off === old_offset)){
var ptr_i32_idx = ((sab_header_off + (8)) >>> (2));
Atomics.store(index_view,ptr_i32_idx,new_offset);

return true;
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
})();
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return false;
}
}
});
/**
 * Find a ZEROED_UNUSED descriptor and set it up as a FREE block for the
 * remainder space after a compaction split. Returns true if successful.
 */
cljs_thread.eve.shared_atom.find_zeroed_descriptor_for_remainder_BANG_ = (function cljs_thread$eve$shared_atom$find_zeroed_descriptor_for_remainder_BANG_(index_view,max_descriptors,rem_off,rem_cap,exclude_a,exclude_b){
var ri = (0);
while(true){
if((ri < max_descriptors)){
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(ri,exclude_a)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(ri,exclude_b)) && ((cljs_thread.eve.util.read_block_descriptor_field(index_view,ri,(0)) === (-1))))))){
var r_lk = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(ri) + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,r_lk,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,ri,(4),rem_off);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,ri,(12),rem_cap);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,ri,(8),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,ri,(0),(0));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,ri,(16),(-1));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,ri,(0),rem_cap);

cljs_thread.eve.util.atomic_store_int(index_view,r_lk,(0));

return true;
} else {
var G__24674 = (ri + (1));
ri = G__24674;
continue;
}
} else {
var G__24675 = (ri + (1));
ri = G__24675;
continue;
}
} else {
return null;
}
break;
}
});
/**
 * Proactive left-compaction: scan descriptors left-to-right. Accumulate free blocks.
 * When an ALLOC block is found that fits in a previously-seen free block (to its left),
 * move the data leftward, retire the old location. One compaction per call.
 * 
 * The key invariant: by always moving filled blocks LEFT into earlier free space,
 * we naturally consolidate free space rightward, and new allocs (which scan from
 * alloc-cursor=0) fill the dense left side first.
 * 
 * Returns true if a block was compacted, false otherwise.
 */
cljs_thread.eve.shared_atom.compact_one_block_BANG_ = (function cljs_thread$eve$shared_atom$compact_one_block_BANG_(s_atom_env){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var max_descriptors = cljs_thread.eve.shared_atom.safe_max_descriptors(s_atom_env);
var free_blocks = [];
var i = (0);
while(true){
if((i >= max_descriptors)){
return false;
} else {
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(0));
var off = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(4));
var cap = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(12));
if((((status === (0))) && ((cap > (0))))){
free_blocks.push([off,cap,i]);

var G__24682 = (i + (1));
i = G__24682;
continue;
} else {
if((function (){var and__5043__auto__ = (status === (1));
if(and__5043__auto__){
var and__5043__auto____$1 = (cap > (0));
if(and__5043__auto____$1){
var data_len_c = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(8));
return (((data_len_c >= (16))) && ((cljs_thread.eve.shared_atom.dv.getUint8(off) === (1))));
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})()){
var a_off = off;
var a_cap = cap;
var a_idx = i;
var a_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,i,(8));
var fb = (function (){var fi = (0);
while(true){
if((fi < free_blocks.length)){
var f = (free_blocks[fi]);
if(((((f[(0)]) < a_off)) && (((f[(1)]) >= a_cap)))){
return f;
} else {
var G__24687 = (fi + (1));
fi = G__24687;
continue;
}
} else {
return null;
}
break;
}
})();
if(cljs.core.not(fb)){
var G__24688 = (i + (1));
i = G__24688;
continue;
} else {
var f_off = (fb[(0)]);
var f_cap = (fb[(1)]);
var f_idx = (fb[(2)]);
var vec__23352 = (((f_idx < a_idx))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f_idx,a_idx], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a_idx,f_idx], null));
var lo = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23352,(0),null);
var hi = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23352,(1),null);
var lo_lk = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(lo) + ((20) / (4)));
var hi_lk = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(hi) + ((20) / (4)));
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,lo_lk,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
if(((0) === cljs_thread.eve.util.atomic_compare_exchange_int(index_view,hi_lk,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))){
var f_st = cljs_thread.eve.util.read_block_descriptor_field(index_view,f_idx,(0));
var a_st = cljs_thread.eve.util.read_block_descriptor_field(index_view,a_idx,(0));
if((((f_st === (0))) && ((a_st === (1))))){
if((a_len > (0))){
cljs_thread.eve.wasm_mem.memcpy_BANG_(f_off,a_off,a_len);
} else {
}

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,f_idx,(0),(1));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,f_idx,(12),a_cap);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,f_idx,(8),a_len);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,f_idx,(16),(-1));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,f_idx,(1),a_cap);

var rem_24693 = (f_cap - a_cap);
if((rem_24693 >= (1))){
cljs_thread.eve.shared_atom.find_zeroed_descriptor_for_remainder_BANG_(index_view,max_descriptors,(f_off + a_cap),rem_24693,f_idx,a_idx);
} else {
}

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,a_idx,(0),(5));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,a_idx,(24),cljs_thread.eve.shared_atom.get_current_epoch(s_atom_env));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(index_view,a_idx,(5),a_cap);

cljs_thread.eve.shared_atom.find_and_update_hamt_parent_BANG_(s_atom_env,index_view,max_descriptors,a_off,f_off);

var temp__5823__auto___24694 = cljs.core.deref(cljs_thread.eve.shared_atom.on_block_moved_fn);
if(cljs.core.truth_(temp__5823__auto___24694)){
var cb_24699 = temp__5823__auto___24694;
(cb_24699.cljs$core$IFn$_invoke$arity$4 ? cb_24699.cljs$core$IFn$_invoke$arity$4(a_off,f_off,a_idx,f_idx) : cb_24699.call(null, a_off,f_off,a_idx,f_idx));
} else {
}

cljs_thread.eve.util.atomic_store_int(index_view,hi_lk,(0));

cljs_thread.eve.util.atomic_store_int(index_view,lo_lk,(0));

cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.alloc_cursor,(0));

return true;
} else {
cljs_thread.eve.util.atomic_store_int(index_view,hi_lk,(0));

cljs_thread.eve.util.atomic_store_int(index_view,lo_lk,(0));

var G__24700 = (i + (1));
i = G__24700;
continue;
}
} else {
cljs_thread.eve.util.atomic_store_int(index_view,lo_lk,(0));

var G__24701 = (i + (1));
i = G__24701;
continue;
}
} else {
var G__24702 = (i + (1));
i = G__24702;
continue;
}
}
} else {
var G__24703 = (i + (1));
i = G__24703;
continue;

}
}
}
break;
}
});
/**
 * Probabilistic post-transaction sweep + compaction.
 * Rolls dice against compaction-temperature. If selected, sweeps retired blocks
 * and attempts one left-compaction. Call after each successful CAS.
 */
cljs_thread.eve.shared_atom.maybe_compact_BANG_ = (function cljs_thread$eve$shared_atom$maybe_compact_BANG_(s_atom_env){
if((Math.random() < cljs.core.deref(cljs_thread.eve.shared_atom.compaction_temperature))){
return cljs_thread.eve.shared_atom.sweep_retired_blocks_BANG_(s_atom_env);
} else {
return null;
}
});
/**
 * Execute f within a read epoch context. Ensures proper begin/end-read-epoch! calls.
 * Returns the result of f.
 */
cljs_thread.eve.shared_atom.with_read_epoch = (function cljs_thread$eve$shared_atom$with_read_epoch(s_atom_env,slot_idx,f){
var epoch = cljs_thread.eve.shared_atom.begin_read_BANG_(s_atom_env,slot_idx);
try{return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(epoch) : f.call(null, epoch));
}finally {cljs_thread.eve.shared_atom.end_read_epoch_BANG_(s_atom_env,slot_idx);
}});
/**
 * Serialize a value for storage in SAB.
 * Uses fast-path encoding for primitives and SAB pointer encoding for collections.
 */
cljs_thread.eve.shared_atom.atom_serialize = (function cljs_thread$eve$shared_atom$atom_serialize(value){
return cljs_thread.eve.deftype_proto.serialize.serialize_element(value);
});
/**
 * Deserialize bytes from SAB back to a CLJS/SAB value.
 * Returns SAB-backed types directly (zero-copy for collections).
 */
cljs_thread.eve.shared_atom.atom_deserialize = (function cljs_thread$eve$shared_atom$atom_deserialize(var_args){
var G__23362 = arguments.length;
switch (G__23362) {
case 1:
return cljs_thread.eve.shared_atom.atom_deserialize.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.shared_atom.atom_deserialize.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.shared_atom.atom_deserialize.cljs$core$IFn$_invoke$arity$1 = (function (byte_array_view){
return cljs_thread.eve.shared_atom.atom_deserialize.cljs$core$IFn$_invoke$arity$2(byte_array_view,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs_thread.eve.shared_atom.atom_deserialize.cljs$core$IFn$_invoke$arity$2 = (function (byte_array_view,read_handler_context){
if(cljs.core.truth_(byte_array_view)){
try{var s_atom_env = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"s-atom-env","s-atom-env",856967368).cljs$core$IFn$_invoke$arity$1(read_handler_context);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var bytes = (((((!((byte_array_view == null)))) && ((((byte_array_view instanceof Uint8Array)) && ((((!((byte_array_view.byteOffset === (0))))) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(byte_array_view.byteLength,byte_array_view.buffer.byteLength))))))))?(new Uint8Array(byte_array_view)):byte_array_view);
return cljs_thread.eve.deftype_proto.serialize.deserialize_element(s_atom_env,bytes);
}catch (e23367){var e = e23367;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["!!! ERROR during atom/atom-deserialize:",e,e.stack], 0));

if(cljs.core.truth_(byte_array_view)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["    Input bytes (hex, first 64):",cljs_thread.eve.util.format_bytes_as_hex(byte_array_view,(64))], 0));
} else {
}

return null;
}} else {
return null;
}
}));

(cljs_thread.eve.shared_atom.atom_deserialize.cljs$lang$maxFixedArity = 2);

cljs_thread.eve.shared_atom.default_serializer = cljs_thread.eve.shared_atom.atom_serialize;
cljs_thread.eve.shared_atom.default_deserializer = cljs_thread.eve.shared_atom.atom_deserialize;
/**
 * Recursively materialize SAB-backed types into plain CLJS types.
 * EveHashMap → PersistentHashMap, SabVecRoot → PersistentVector,
 * EveHashSet → PersistentHashSet, SabListRoot → PersistentVector.
 * Primitives and already-CLJS values pass through unchanged.
 */
cljs_thread.eve.shared_atom.eve__GT_cljs = (function cljs_thread$eve$shared_atom$eve__GT_cljs(v){
if((((!((v == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === v.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!v.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,v):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,v))){
var G__23371 = cljs_thread.eve.deftype_proto.data._sab_tag(v);
var G__23371__$1 = (((G__23371 instanceof cljs.core.Keyword))?G__23371.fqn:null);
switch (G__23371__$1) {
case "eve-hash-map":
return cljs.core.persistent_BANG_(cljs.core.reduce_kv((function (m,k,val){
return cljs.core.assoc_BANG_.cljs$core$IFn$_invoke$arity$3(m,k,(cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1(val) : cljs_thread.eve.shared_atom.eve__GT_cljs.call(null, val)));
}),cljs.core.transient$(cljs.core.PersistentArrayMap.EMPTY),v));

break;
case "eve-vec":
var n = cljs.core.count(v);
var i = (0);
var out = cljs.core.transient$(cljs.core.PersistentVector.EMPTY);
while(true){
if((i < n)){
var G__24712 = (i + (1));
var G__24713 = cljs.core.conj_BANG_.cljs$core$IFn$_invoke$arity$2(out,(function (){var G__23378 = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(v,i);
return (cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1(G__23378) : cljs_thread.eve.shared_atom.eve__GT_cljs.call(null, G__23378));
})());
i = G__24712;
out = G__24713;
continue;
} else {
return cljs.core.persistent_BANG_(out);
}
break;
}

break;
case "hash-set":
return cljs.core.persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (s,elem){
return cljs.core.conj_BANG_.cljs$core$IFn$_invoke$arity$2(s,(cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.eve__GT_cljs.cljs$core$IFn$_invoke$arity$1(elem) : cljs_thread.eve.shared_atom.eve__GT_cljs.call(null, elem)));
}),cljs.core.transient$(cljs.core.PersistentHashSet.EMPTY),v));

break;
case "eve-list":
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs_thread.eve.shared_atom.eve__GT_cljs,v);

break;
case "eve/array":
return v;

break;
default:
return v;

}
} else {
return v;
}
});
cljs_thread.eve.shared_atom.notify_watches = (function cljs_thread$eve$shared_atom$notify_watches(watchers_atom_ref,old_val,new_val){
var seq__23379 = cljs.core.seq(cljs.core.deref(watchers_atom_ref));
var chunk__23380 = null;
var count__23381 = (0);
var i__23382 = (0);
while(true){
if((i__23382 < count__23381)){
var vec__23395 = chunk__23380.cljs$core$IIndexed$_nth$arity$2(null, i__23382);
var key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23395,(0),null);
var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23395,(1),null);
try{(f.cljs$core$IFn$_invoke$arity$4 ? f.cljs$core$IFn$_invoke$arity$4(key,watchers_atom_ref,old_val,new_val) : f.call(null, key,watchers_atom_ref,old_val,new_val));
}catch (e23398){var e_24721 = e23398;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Error in watcher",key,":",e_24721], 0));
}

var G__24722 = seq__23379;
var G__24723 = chunk__23380;
var G__24724 = count__23381;
var G__24725 = (i__23382 + (1));
seq__23379 = G__24722;
chunk__23380 = G__24723;
count__23381 = G__24724;
i__23382 = G__24725;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__23379);
if(temp__5823__auto__){
var seq__23379__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__23379__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__23379__$1);
var G__24731 = cljs.core.chunk_rest(seq__23379__$1);
var G__24732 = c__5568__auto__;
var G__24733 = cljs.core.count(c__5568__auto__);
var G__24734 = (0);
seq__23379 = G__24731;
chunk__23380 = G__24732;
count__23381 = G__24733;
i__23382 = G__24734;
continue;
} else {
var vec__23399 = cljs.core.first(seq__23379__$1);
var key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23399,(0),null);
var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23399,(1),null);
try{(f.cljs$core$IFn$_invoke$arity$4 ? f.cljs$core$IFn$_invoke$arity$4(key,watchers_atom_ref,old_val,new_val) : f.call(null, key,watchers_atom_ref,old_val,new_val));
}catch (e23402){var e_24741 = e23402;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Error in watcher",key,":",e_24741], 0));
}

var G__24743 = cljs.core.next(seq__23379__$1);
var G__24744 = null;
var G__24745 = (0);
var G__24746 = (0);
seq__23379 = G__24743;
chunk__23380 = G__24744;
count__23381 = G__24745;
i__23382 = G__24746;
continue;
}
} else {
return null;
}
}
break;
}
});
/**
 * Compute the Int32Array index for the watch notification slot
 * (RETIRED_EPOCH field) of a SharedAtom's header descriptor.
 */
cljs_thread.eve.shared_atom.watch_notify_int32_idx = (function cljs_thread$eve$shared_atom$watch_notify_int32_idx(s_atom_env,header_descriptor_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
return (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(header_descriptor_idx) + ((24) / (4)));
});
/**
 * Atomically bump the watch version counter and notify waiting workers.
 */
cljs_thread.eve.shared_atom.signal_remote_watches_BANG_ = (function cljs_thread$eve$shared_atom$signal_remote_watches_BANG_(s_atom_env,header_descriptor_idx){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var idx = cljs_thread.eve.shared_atom.watch_notify_int32_idx(s_atom_env,header_descriptor_idx);
Atomics.add(index_view,idx,(1));

return Atomics.notify(index_view,idx);
});
/**
 * Check a watched atom's value vs cached, fire watches if different.
 */
cljs_thread.eve.shared_atom.check_and_fire_watches_BANG_ = (function cljs_thread$eve$shared_atom$check_and_fire_watches_BANG_(atom_ref,watchers_atom_ref,cached_val_atom){
if(cljs.core.seq(cljs.core.deref(watchers_atom_ref))){
try{var old_cached = cljs.core.deref(cached_val_atom);
var new_val = cljs.core.deref(atom_ref);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_cached,new_val)){
cljs.core.reset_BANG_(cached_val_atom,new_val);

return cljs_thread.eve.shared_atom.notify_watches(watchers_atom_ref,old_cached,new_val);
} else {
return null;
}
}catch (e23404){var e = e23404;
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Error in cross-thread watch check:",e], 0));
}} else {
return null;
}
});
/**
 * Install an Atomics.waitAsync loop on this SharedAtom's watch slot.
 * When a remote worker bumps the version counter, deref the atom,
 * compare with cached value, and fire local watches if changed.
 */
cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_ = (function cljs_thread$eve$shared_atom$start_watch_async_loop_BANG_(atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val_atom){
if((typeof Atomics !== 'undefined') && (typeof Atomics.waitAsync !== 'undefined')){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env);
var idx = cljs_thread.eve.shared_atom.watch_notify_int32_idx(s_atom_env,header_descriptor_idx);
var current_version = Atomics.load(index_view,idx);
var result = Atomics.waitAsync(index_view,idx,current_version);
if(cljs.core.truth_(result.async)){
return result.value.then((function (status){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(status,"ok")) && (cljs.core.seq(cljs.core.deref(watchers_atom_ref))))){
cljs_thread.eve.shared_atom.check_and_fire_watches_BANG_(atom_ref,watchers_atom_ref,cached_val_atom);

return (cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.cljs$core$IFn$_invoke$arity$5(atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val_atom) : cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.call(null, atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val_atom));
} else {
return null;
}
}));
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(result.value,"not-equal")) && (cljs.core.seq(cljs.core.deref(watchers_atom_ref))))){
return queueMicrotask((function (){
cljs_thread.eve.shared_atom.check_and_fire_watches_BANG_(atom_ref,watchers_atom_ref,cached_val_atom);

if(cljs.core.seq(cljs.core.deref(watchers_atom_ref))){
return (cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.cljs$core$IFn$_invoke$arity$5 ? cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.cljs$core$IFn$_invoke$arity$5(atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val_atom) : cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_.call(null, atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val_atom));
} else {
return null;
}
}));
} else {
return null;
}
}
} else {
return null;
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.watched_atoms !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.watched_atoms = (new Map());
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.shared_atom !== 'undefined') && (typeof cljs_thread.eve.shared_atom.broadcast_swap_fn !== 'undefined')){
} else {
cljs_thread.eve.shared_atom.broadcast_swap_fn = cljs.core.volatile_BANG_(null);
}
/**
 * Register a function to broadcast watch notifications to remote workers.
 * Called with (f header-descriptor-idx) after a successful swap!.
 * Used as fallback when Atomics.waitAsync is unavailable.
 */
cljs_thread.eve.shared_atom.set_broadcast_swap_fn_BANG_ = (function cljs_thread$eve$shared_atom$set_broadcast_swap_fn_BANG_(f){
return cljs.core.vreset_BANG_(cljs_thread.eve.shared_atom.broadcast_swap_fn,f);
});
/**
 * Signal remote workers that this atom changed.
 * Primary: Atomics.notify wakes workers with waitAsync loops.
 * Fallback: message broadcast for browsers without Atomics.waitAsync.
 */
cljs_thread.eve.shared_atom.notify_remote_watches_BANG_ = (function cljs_thread$eve$shared_atom$notify_remote_watches_BANG_(s_atom_env,header_descriptor_idx){
cljs_thread.eve.shared_atom.signal_remote_watches_BANG_(s_atom_env,header_descriptor_idx);

if(cljs.core.truth_((function (){var and__5043__auto__ = (!((typeof Atomics !== 'undefined') && (typeof Atomics.waitAsync !== 'undefined')));
if(and__5043__auto__){
return cljs.core.deref(cljs_thread.eve.shared_atom.broadcast_swap_fn);
} else {
return and__5043__auto__;
}
})())){
var fexpr__23408 = cljs.core.deref(cljs_thread.eve.shared_atom.broadcast_swap_fn);
return (fexpr__23408.cljs$core$IFn$_invoke$arity$1 ? fexpr__23408.cljs$core$IFn$_invoke$arity$1(header_descriptor_idx) : fexpr__23408.call(null, header_descriptor_idx));
} else {
return null;
}
});
/**
 * Start the cross-thread watch notification loop for this atom if not already running.
 */
cljs_thread.eve.shared_atom.ensure_watch_loop_BANG_ = (function cljs_thread$eve$shared_atom$ensure_watch_loop_BANG_(atom_ref,header_descriptor_idx,watchers_atom_ref){
if(cljs.core.truth_(cljs_thread.eve.shared_atom.watched_atoms.has(header_descriptor_idx))){
return null;
} else {
var s_atom_env = cljs_thread.eve.shared_atom.get_env(atom_ref);
var cached_val = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(atom_ref));
cljs_thread.eve.shared_atom.watched_atoms.set(header_descriptor_idx,({"atom-ref": atom_ref, "watchers-atom": watchers_atom_ref, "cached": cached_val}));

return cljs_thread.eve.shared_atom.start_watch_async_loop_BANG_(atom_ref,s_atom_env,header_descriptor_idx,watchers_atom_ref,cached_val);
}
});
/**
 * Unregister a watched atom when all watches are removed.
 */
cljs_thread.eve.shared_atom.stop_watch_loop_BANG_ = (function cljs_thread$eve$shared_atom$stop_watch_loop_BANG_(header_descriptor_idx){
return cljs_thread.eve.shared_atom.watched_atoms.delete(header_descriptor_idx);
});
/**
 * Check all watched atoms for changes and fire local watches.
 * Called by the message-based fallback when a remote worker signals a change.
 */
cljs_thread.eve.shared_atom.check_remote_watches_BANG_ = (function cljs_thread$eve$shared_atom$check_remote_watches_BANG_(){
return cljs_thread.eve.shared_atom.watched_atoms.forEach((function (entry,_hdr_idx){
var atom_ref = entry.atom_ref;
var watchers_atom_ref = entry.watchers_atom;
var cached = entry.cached;
return cljs_thread.eve.shared_atom.check_and_fire_watches_BANG_(atom_ref,watchers_atom_ref,cached);
}));
});

/**
 * Create a private atom backed by WebAssembly.Memory.
 * 
 * All EVE atoms use WASM memory for storage, enabling SIMD-accelerated
 * operations on data structures.
 * 
 * Options:
 * - :sab-size - Total memory size in bytes (default 100MB, rounded to 64KB page)
 * - :max-blocks - Maximum block descriptors (default 65536)
 * - :metamap - Metadata map
 * - :validator - Validator function
 */
cljs_thread.eve.shared_atom.atom_domain = (function cljs_thread$eve$shared_atom$atom_domain(var_args){
var args__5775__auto__ = [];
var len__5769__auto___24759 = arguments.length;
var i__5770__auto___24760 = (0);
while(true){
if((i__5770__auto___24760 < len__5769__auto___24759)){
args__5775__auto__.push((arguments[i__5770__auto___24760]));

var G__24761 = (i__5770__auto___24760 + (1));
i__5770__auto___24760 = G__24761;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.eve.shared_atom.atom_domain.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.eve.shared_atom.atom_domain.cljs$core$IFn$_invoke$arity$variadic = (function (initial_cljs_map_value,p__23416){
var map__23417 = p__23416;
var map__23417__$1 = cljs.core.__destructure_map(map__23417);
var _opts = map__23417__$1;
var metamap = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23417__$1,new cljs.core.Keyword(null,"metamap","metamap",1599603228));
var validator = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23417__$1,new cljs.core.Keyword(null,"validator","validator",-1966190681));
var sab_size = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23417__$1,new cljs.core.Keyword(null,"sab-size","sab-size",-1390153878),(((100) * (1024)) * (1024)));
var max_blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23417__$1,new cljs.core.Keyword(null,"max-blocks","max-blocks",566853452),(65536));
var block_descriptors_array_total_size = (max_blocks * cljs_thread.eve.data.SIZE_OF_BLOCK_DESCRIPTOR);
var index_region_fixed_metadata_size = cljs_thread.eve.data.OFFSET_BLOCK_DESCRIPTORS_ARRAY_START;
var mirror_arrays_size = ((max_blocks * (2)) * (4));
var status_mirror_start = (index_region_fixed_metadata_size + block_descriptors_array_total_size);
var capacity_mirror_start = (status_mirror_start + (max_blocks * (4)));
var index_region_size = ((index_region_fixed_metadata_size + block_descriptors_array_total_size) + mirror_arrays_size);
var scratch_region_size = ((256) * (4096));
var data_region_start_offset = (index_region_size + scratch_region_size);
var data_region_size = (sab_size - data_region_start_offset);
if((data_region_size < (1))){
throw (new Error(["SAB total size ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sab_size)," is too small. Index:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(index_region_size)," Scratch:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(scratch_region_size)," Data:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_region_size)].join('')));
} else {
}

var wasm_pages = Math.ceil((sab_size / (65536)));
var actual_sab_size = (wasm_pages * (65536));
var wasm_memory = (function (){try{return (new WebAssembly.Memory(({"initial": wasm_pages, "maximum": (function (){var x__5133__auto__ = (16384);
var y__5134__auto__ = (wasm_pages * (4));
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})(), "shared": true})));
}catch (e23419){var _ = e23419;
return (new SharedArrayBuffer(actual_sab_size));
}})();
var sab = (((wasm_memory instanceof SharedArrayBuffer))?wasm_memory:wasm_memory.buffer);
var index_view = (new Int32Array(sab));
var data_view = (new Uint8Array(sab));
var reader_map_sab = (new SharedArrayBuffer(cljs_thread.eve.data.READER_MAP_SAB_SIZE_BYTES));
var reader_map_view = (new Int32Array(reader_map_sab));
var _ = reader_map_view.fill((0));
var actual_data_region_size = (actual_sab_size - data_region_start_offset);
var scratch_region_start = index_region_size;
var ___$1 = Atomics.store(index_view,((0) / (4)),actual_sab_size);
var ___$2 = Atomics.store(index_view,((4) / (4)),index_region_size);
var ___$3 = Atomics.store(index_view,((8) / (4)),data_region_start_offset);
var ___$4 = Atomics.store(index_view,((12) / (4)),max_blocks);
var ___$5 = Atomics.store(index_view,((16) / (4)),(-1));
var ___$6 = Atomics.store(index_view,((20) / (4)),(1));
var ___$7 = (function (){var n__5636__auto__ = (256);
var slot_idx = (0);
while(true){
if((slot_idx < n__5636__auto__)){
var slot_byte_offset_24771 = ((24) + (slot_idx * (24)));
Atomics.store(index_view,(slot_byte_offset_24771 / (4)),(0));

var G__24773 = (slot_idx + (1));
slot_idx = G__24773;
continue;
} else {
return null;
}
break;
}
})();
var ___$8 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(0),(0));
var ___$9 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(4),data_region_start_offset);
var ___$10 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(8),(0));
var ___$11 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(12),actual_data_region_size);
var ___$12 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(16),(-1));
var ___$13 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(20),(0));
var ___$14 = cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,(0),(24),(0));
var ___$15 = (function (){var seq__23422 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((1),max_blocks));
var chunk__23423 = null;
var count__23424 = (0);
var i__23425 = (0);
while(true){
if((i__23425 < count__23424)){
var i = chunk__23423.cljs$core$IIndexed$_nth$arity$2(null, i__23425);
cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_(index_view,i);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,i,(20),(0));


var G__24777 = seq__23422;
var G__24778 = chunk__23423;
var G__24779 = count__23424;
var G__24780 = (i__23425 + (1));
seq__23422 = G__24777;
chunk__23423 = G__24778;
count__23424 = G__24779;
i__23425 = G__24780;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__23422);
if(temp__5823__auto__){
var seq__23422__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__23422__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__23422__$1);
var G__24785 = cljs.core.chunk_rest(seq__23422__$1);
var G__24786 = c__5568__auto__;
var G__24787 = cljs.core.count(c__5568__auto__);
var G__24788 = (0);
seq__23422 = G__24785;
chunk__23423 = G__24786;
count__23424 = G__24787;
i__23425 = G__24788;
continue;
} else {
var i = cljs.core.first(seq__23422__$1);
cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_(index_view,i);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,i,(20),(0));


var G__24791 = cljs.core.next(seq__23422__$1);
var G__24792 = null;
var G__24793 = (0);
var G__24794 = (0);
seq__23422 = G__24791;
chunk__23423 = G__24792;
count__23424 = G__24793;
i__23425 = G__24794;
continue;
}
} else {
return null;
}
}
break;
}
})();
var ___$16 = (index_view[(status_mirror_start / (4))] = (0));
var ___$17 = (index_view[(capacity_mirror_start / (4))] = actual_data_region_size);
var ___$18 = (function (){var n__5636__auto__ = (max_blocks - (1));
var i = (0);
while(true){
if((i < n__5636__auto__)){
var idx_24795 = (i + (1));
(index_view[((status_mirror_start / (4)) + idx_24795)] = (-1));

(index_view[((capacity_mirror_start / (4)) + idx_24795)] = (0));

var G__24796 = (i + (1));
i = G__24796;
continue;
} else {
return null;
}
break;
}
})();
var ___$19 = cljs_thread.eve.shared_atom.reset_alloc_cursor_BANG_.cljs$core$IFn$_invoke$arity$0();
var s_atom_env = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"data-view","data-view",2142900612),new cljs.core.Keyword(null,"status-mirror-start","status-mirror-start",-1959204348),new cljs.core.Keyword(null,"capacity-mirror-start","capacity-mirror-start",-859463642),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"index-view","index-view",978697547),new cljs.core.Keyword(null,"sab","sab",422570093),new cljs.core.Keyword(null,"wasm-memory","wasm-memory",-854888656),new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178),new cljs.core.Keyword(null,"scratch-region-start","scratch-region-start",-1184934695),new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764)],[data_view,status_mirror_start,capacity_mirror_start,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283),actual_sab_size,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111),max_blocks,new cljs.core.Keyword(null,"index-region-size","index-region-size",854075727),index_region_size,new cljs.core.Keyword(null,"scratch-region-start","scratch-region-start",-1184934695),scratch_region_start,new cljs.core.Keyword(null,"status-mirror-start","status-mirror-start",-1959204348),status_mirror_start,new cljs.core.Keyword(null,"capacity-mirror-start","capacity-mirror-start",-859463642),capacity_mirror_start,new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696),data_region_start_offset], null),index_view,sab,wasm_memory,reader_map_sab,scratch_region_start,reader_map_view]);
var the_atom_domain_instance = (function (){var G__23438 = s_atom_env;
var G__23439 = validator;
var G__23440 = (function (){var or__5045__auto__ = metamap;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var G__23441 = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
return (cljs_thread.eve.shared_atom.__GT_AtomDomain.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.shared_atom.__GT_AtomDomain.cljs$core$IFn$_invoke$arity$4(G__23438,G__23439,G__23440,G__23441) : cljs_thread.eve.shared_atom.__GT_AtomDomain.call(null, G__23438,G__23439,G__23440,G__23441));
})();
var ___$20 = (cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ = the_atom_domain_instance);
var ___$21 = (cljs_thread.eve.shared_atom.cached_atom_iv = index_view);
var ___$22 = (cljs_thread.eve.shared_atom.cached_atom_uv = data_view);
var ___$23 = cljs_thread.eve.wasm_mem.update_views_BANG_(wasm_memory);
var initial_map = ((cljs.core.map_QMARK_(initial_cljs_map_value))?initial_cljs_map_value:cljs.core.PersistentArrayMap.EMPTY);
var initial_root_data_block_desc_idx = ((cljs.core.empty_QMARK_(initial_map))?(-1):(function (){var serialized_initial_map = (function (){var _STAR_parent_atom_STAR__orig_val__23442 = cljs_thread.eve.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__orig_val__23443 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23444 = the_atom_domain_instance;
var _STAR_parent_atom_STAR__temp_val__23445 = the_atom_domain_instance;
(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23444);

(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23445);

try{return (cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1(initial_map) : cljs_thread.eve.shared_atom.default_serializer.call(null, initial_map));
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23443);

(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23442);
}})();
if((((serialized_initial_map == null)) || ((serialized_initial_map.length === (0))))){
return (-1);
} else {
var alloc_info = cljs_thread.eve.shared_atom.alloc(s_atom_env,serialized_initial_map.length);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))){
throw (new Error(["atom-domain init alloc for map: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))].join('')));
} else {
new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env).set(serialized_initial_map,new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_info));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_info),(8),serialized_initial_map.length);

return new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_info);
}
}
})());
Atomics.store(index_view,((16) / (4)),initial_root_data_block_desc_idx);

return the_atom_domain_instance;
}));

(cljs_thread.eve.shared_atom.atom_domain.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.eve.shared_atom.atom_domain.cljs$lang$applyTo = (function (seq23413){
var G__23414 = cljs.core.first(seq23413);
var seq23413__$1 = cljs.core.next(seq23413);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__23414,seq23413__$1);
}));

cljs_thread.eve.shared_atom.read_atom_domain_root_data_block_desc_idx = (function cljs_thread$eve$shared_atom$read_atom_domain_root_data_block_desc_idx(_s_atom_env_map){
return Atomics.load(cljs_thread.eve.shared_atom.cached_atom_iv,((16) / (4)));
});
cljs_thread.eve.shared_atom.cas_atom_domain_root_data_block_desc_idx_BANG_ = (function cljs_thread$eve$shared_atom$cas_atom_domain_root_data_block_desc_idx_BANG_(_s_atom_env_map,expected_old_desc_idx,new_desc_idx){
return Atomics.compareExchange(cljs_thread.eve.shared_atom.cached_atom_iv,((16) / (4)),expected_old_desc_idx,new_desc_idx);
});
cljs_thread.eve.shared_atom.cached_atom_iv = null;
cljs_thread.eve.shared_atom.cached_atom_uv = null;
/**
 * Initialize module-level cached views for worker threads.
 * Must be called after reconstructing s-atom-env on worker side
 * so that swap!, deref, and CAS use the correct SAB views.
 */
cljs_thread.eve.shared_atom.init_worker_cache_BANG_ = (function cljs_thread$eve$shared_atom$init_worker_cache_BANG_(s_atom_env){
(cljs_thread.eve.shared_atom.cached_atom_iv = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env));

return (cljs_thread.eve.shared_atom.cached_atom_uv = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(s_atom_env));
});
/**
 * Returns the SAB references needed to reconstruct this atom on another thread.
 * The SABs are SharedArrayBuffer instances — they transfer zero-copy.
 */
cljs_thread.eve.shared_atom.sab_transfer_data = (function cljs_thread$eve$shared_atom$sab_transfer_data(atom_domain){
var env = atom_domain.s_atom_env;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sab","sab",422570093),new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(env),new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178),new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(env)], null);
});
cljs_thread.eve.shared_atom.cached_deref_env = null;
cljs_thread.eve.shared_atom.cached_deref_desc_idx = (-1);
cljs_thread.eve.shared_atom.cached_deref_val = null;
cljs_thread.eve.shared_atom._update_fn_for_atom_domain_swap_BANG_ = (function cljs_thread$eve$shared_atom$_update_fn_for_atom_domain_swap_BANG_(s_env,current_root_data_block_desc_idx,validator_fn,user_f,user_args_arr){
var index_view = cljs_thread.eve.shared_atom.cached_atom_iv;
var data_view = cljs_thread.eve.shared_atom.cached_atom_uv;
var old_map_cljs_value = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_root_data_block_desc_idx,(-1)))?cljs.core.PersistentArrayMap.EMPTY:(function (){var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(0));
var data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(4));
var data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(8));
if((((status === (1))) && ((data_len >= (0))))){
return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(s_env,cljs_thread.eve.wasm_mem.data_view(),data_offset,data_len);
} else {
throw (new Error(["StaleReadOrInvalidStateUpdateFn AtomDomainRoot: desc_idx ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_root_data_block_desc_idx)].join('')));
}
})());
if(cljs.core.map_QMARK_(old_map_cljs_value)){
} else {
throw (new Error(["AtomDomain integrity error: expected map, got ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type(old_map_cljs_value))].join('')));
}

var new_map_cljs_value = (cljs.core.truth_(user_args_arr)?(function (){var G__23458 = user_args_arr.length;
switch (G__23458) {
case (1):
var G__23459 = old_map_cljs_value;
var G__23460 = (user_args_arr[(0)]);
return (user_f.cljs$core$IFn$_invoke$arity$2 ? user_f.cljs$core$IFn$_invoke$arity$2(G__23459,G__23460) : user_f.call(null, G__23459,G__23460));

break;
case (2):
var G__23461 = old_map_cljs_value;
var G__23462 = (user_args_arr[(0)]);
var G__23463 = (user_args_arr[(1)]);
return (user_f.cljs$core$IFn$_invoke$arity$3 ? user_f.cljs$core$IFn$_invoke$arity$3(G__23461,G__23462,G__23463) : user_f.call(null, G__23461,G__23462,G__23463));

break;
default:
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(user_f,old_map_cljs_value,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(user_args_arr));

}
})():(user_f.cljs$core$IFn$_invoke$arity$1 ? user_f.cljs$core$IFn$_invoke$arity$1(old_map_cljs_value) : user_f.call(null, old_map_cljs_value)));
if(cljs.core.map_QMARK_(new_map_cljs_value)){
} else {
throw (new Error(["AtomDomain swap fn must return map. Got: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type(new_map_cljs_value))].join('')));
}

if(cljs.core.truth_((function (){var and__5043__auto__ = validator_fn;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((validator_fn.cljs$core$IFn$_invoke$arity$1 ? validator_fn.cljs$core$IFn$_invoke$arity$1(new_map_cljs_value) : validator_fn.call(null, new_map_cljs_value)));
} else {
return and__5043__auto__;
}
})())){
throw (new Error("Swap (AtomDomain) validator failed."));
} else {
}

if((new_map_cljs_value === old_map_cljs_value)){
return ({"cas_idx": current_root_data_block_desc_idx, "free_idx": null, "alloc_idx": null, "final_val": old_map_cljs_value, "old_val": old_map_cljs_value, "changed": false});
} else {
var new_map_bytes = (((((!((new_map_cljs_value == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_map_cljs_value.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!new_map_cljs_value.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,new_map_cljs_value):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,new_map_cljs_value)))?cljs_thread.eve.deftype_proto.data._sab_encode(new_map_cljs_value,null):(cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1(new_map_cljs_value) : cljs_thread.eve.shared_atom.default_serializer.call(null, new_map_cljs_value)));
if((((new_map_bytes == null)) || ((new_map_bytes.length === (0))))){
return ({"cas_idx": (-1), "free_idx": current_root_data_block_desc_idx, "alloc_idx": null, "final_val": new_map_cljs_value, "old_val": old_map_cljs_value, "changed": true});
} else {
var alloc_info = cljs_thread.eve.shared_atom.alloc_root_block(s_env,new_map_bytes.length);
if(cljs.core.not(alloc_info)){
if((((!((new_map_cljs_value == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_map_cljs_value.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_map_cljs_value.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_map_cljs_value):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_map_cljs_value))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_map_cljs_value,old_map_cljs_value,s_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

throw (new Error("AllocFailedInUpdate AtomDomainRoot: out-of-memory"));
} else {
var new_data_offset = (alloc_info[(0)]);
var new_data_desc_idx = (alloc_info[(1)]);
data_view.set(new_map_bytes,new_data_offset);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(8),new_map_bytes.length);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(4),new_data_offset);

return ({"cas_idx": new_data_desc_idx, "free_idx": current_root_data_block_desc_idx, "alloc_idx": new_data_desc_idx, "final_val": new_map_cljs_value, "old_val": old_map_cljs_value, "changed": true});
}
}
}
});
cljs_thread.eve.shared_atom._update_fn_for_atom_domain_reset_BANG_ = (function cljs_thread$eve$shared_atom$_update_fn_for_atom_domain_reset_BANG_(s_env,current_root_data_block_desc_idx,validator_fn,new_map_cljs_value,_user_args_arr){
if(cljs.core.map_QMARK_(new_map_cljs_value)){
} else {
throw (new Error(["Assert failed: ","AtomDomain -reset! new value must be a map.","\n","(map? new-map-cljs-value)"].join('')));
}

if(cljs.core.truth_((function (){var and__5043__auto__ = validator_fn;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((validator_fn.cljs$core$IFn$_invoke$arity$1 ? validator_fn.cljs$core$IFn$_invoke$arity$1(new_map_cljs_value) : validator_fn.call(null, new_map_cljs_value)));
} else {
return and__5043__auto__;
}
})())){
throw (new Error("Reset (AtomDomain) validator failed."));
} else {
}

var new_map_bytes = (((((!((new_map_cljs_value == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_map_cljs_value.cljs_thread$eve$deftype_proto$data$ISabStorable$))))?true:(((!new_map_cljs_value.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,new_map_cljs_value):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabStorable,new_map_cljs_value)))?cljs_thread.eve.deftype_proto.data._sab_encode(new_map_cljs_value,null):(cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1(new_map_cljs_value) : cljs_thread.eve.shared_atom.default_serializer.call(null, new_map_cljs_value)));
var index_view = cljs_thread.eve.shared_atom.cached_atom_iv;
var data_view = cljs_thread.eve.shared_atom.cached_atom_uv;
if((((new_map_bytes == null)) || ((new_map_bytes.length === (0))))){
var old_map_cljs_value = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_root_data_block_desc_idx,(-1)))?cljs.core.PersistentArrayMap.EMPTY:(function (){var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(0));
var data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(4));
var data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(8));
if((((status === (1))) && ((data_len >= (0))))){
return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(s_env,cljs_thread.eve.wasm_mem.data_view(),data_offset,data_len);
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
return ({"cas_idx": (-1), "free_idx": current_root_data_block_desc_idx, "alloc_idx": null, "final_val": new_map_cljs_value, "old_val": old_map_cljs_value, "changed": true});
} else {
if((function (){var and__5043__auto__ = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(current_root_data_block_desc_idx,(-1));
if(and__5043__auto__){
var old_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(8));
var and__5043__auto____$1 = (old_len === new_map_bytes.length);
if(and__5043__auto____$1){
var old_off = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(4));
var new_len = new_map_bytes.length;
var i = (0);
while(true){
if((i >= new_len)){
return true;
} else {
if(((data_view[(old_off + i)]) === (new_map_bytes[i]))){
var G__24847 = (i + (1));
i = G__24847;
continue;
} else {
return false;
}
}
break;
}
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})()){
return ({"cas_idx": current_root_data_block_desc_idx, "free_idx": null, "alloc_idx": null, "final_val": new_map_cljs_value, "old_val": new_map_cljs_value, "changed": false});
} else {
var old_map_cljs_value = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_root_data_block_desc_idx,(-1)))?cljs.core.PersistentArrayMap.EMPTY:(function (){var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(0));
var data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(4));
var data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_root_data_block_desc_idx,(8));
if((((status === (1))) && ((data_len >= (0))))){
return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(s_env,cljs_thread.eve.wasm_mem.data_view(),data_offset,data_len);
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var alloc_info = cljs_thread.eve.shared_atom.alloc_root_block(s_env,new_map_bytes.length);
if(cljs.core.not(alloc_info)){
if((((!((new_map_cljs_value == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_map_cljs_value.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_map_cljs_value.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_map_cljs_value):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_map_cljs_value))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_map_cljs_value,old_map_cljs_value,s_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

throw (new Error("AllocFailedInUpdate AtomDomainRoot (reset): out-of-memory"));
} else {
var new_data_offset = (alloc_info[(0)]);
var new_data_desc_idx = (alloc_info[(1)]);
data_view.set(new_map_bytes,new_data_offset);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(8),new_map_bytes.length);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(4),new_data_offset);

return ({"cas_idx": new_data_desc_idx, "free_idx": current_root_data_block_desc_idx, "alloc_idx": new_data_desc_idx, "final_val": new_map_cljs_value, "old_val": old_map_cljs_value, "changed": true});
}
}
}
});
/**
 * Core swap! implementation. user-args-arr is nil or a JS array of extra args
 * (avoids CLJS seq creation from variadic & rest args on every swap! call).
 */
cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_ = (function cljs_thread$eve$shared_atom$do_atom_domain_swap_BANG_(atom_domain_instance,update_logic_fn,user_fn_or_new_value,user_args_arr){
var _STAR_parent_atom_STAR__orig_val__23475 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23476 = atom_domain_instance;
(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23476);

try{var s_atom_env = atom_domain_instance.s_atom_env;
var validator_fn = atom_domain_instance.validator_fn;
var guard_QMARK_ = cljs.core.deref(cljs_thread.eve.shared_atom.xray_guard_enabled);
var slot_idx = cljs_thread.eve.shared_atom.ensure_worker_registered_BANG_(s_atom_env);
if(cljs.core.truth_(guard_QMARK_)){
cljs_thread.eve.shared_atom.xray_guard_check_BANG_(s_atom_env,"PRE",null);

cljs_thread.eve.shared_atom.xray_guard_hamt_check_BANG_(s_atom_env,"PRE");
} else {
}

var retries = (1000);
while(true){
if((retries === (0))){
throw (new Error("do-atom-domain-swap! failed after max retries."));
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.begin_read_BANG_(s_atom_env,slot_idx);
} else {
}

var current_root_desc_idx = cljs_thread.eve.shared_atom.read_atom_domain_root_data_block_desc_idx(s_atom_env);
var _ = (cljs.core.truth_((function (){var or__5045__auto__ = isNaN(current_root_desc_idx);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(current_root_desc_idx,(-1))) && ((((current_root_desc_idx < (0))) || ((current_root_desc_idx > (262144))))));
}
})())?cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[BUG] do-atom-domain-swap!: root-desc-idx out of range:",current_root_desc_idx,"retries-left:",retries,"worker:",cljs_thread.eve.data._STAR_worker_id_STAR_], 0)):null);
var update_outcome = (function (){try{return (update_logic_fn.cljs$core$IFn$_invoke$arity$5 ? update_logic_fn.cljs$core$IFn$_invoke$arity$5(s_atom_env,current_root_desc_idx,validator_fn,user_fn_or_new_value,user_args_arr) : update_logic_fn.call(null, s_atom_env,current_root_desc_idx,validator_fn,user_fn_or_new_value,user_args_arr));
}catch (e23478){if((e23478 instanceof Error)){
var e = e23478;
var error_msg = e.message;
if(((clojure.string.includes_QMARK_(error_msg,"StaleReadOrInvalidState")) || (clojure.string.includes_QMARK_(error_msg,"AllocFailedInUpdate")))){
return new cljs.core.Keyword("cljs-thread.eve.shared-atom","retry-needed-for-cas-loop","cljs-thread.eve.shared-atom/retry-needed-for-cas-loop",-1466091908);
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["!!! Unrecoverable error in update-logic-fn of do-atom-domain-swap!:",e,e.stack], 0));

throw e;
}
} else {
throw e23478;

}
}})();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("cljs-thread.eve.shared-atom","retry-needed-for-cas-loop","cljs-thread.eve.shared-atom/retry-needed-for-cas-loop",-1466091908),update_outcome)){
if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(s_atom_env,slot_idx);
} else {
}

var G__24856 = (retries - (1));
retries = G__24856;
continue;
} else {
if(cljs.core.not(update_outcome.changed)){
if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(s_atom_env,slot_idx);
} else {
}

var fv_24857 = update_outcome.final_val;
if((((!((fv_24857 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === fv_24857.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!fv_24857.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,fv_24857):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,fv_24857))){
(cljs_thread.eve.shared_atom.cached_deref_env = s_atom_env);

(cljs_thread.eve.shared_atom.cached_deref_desc_idx = current_root_desc_idx);

(cljs_thread.eve.shared_atom.cached_deref_val = cljs_thread.eve.shared_atom.eve__GT_cljs(fv_24857));
} else {
}

return update_outcome;
} else {
var new_desc_idx_for_cas = (function (){var v = update_outcome.cas_idx;
if((v == null)){
return (-1);
} else {
return v;
}
})();
var actual_old_root_desc_idx = cljs_thread.eve.shared_atom.cas_atom_domain_root_data_block_desc_idx_BANG_(s_atom_env,current_root_desc_idx,new_desc_idx_for_cas);
if((actual_old_root_desc_idx === current_root_desc_idx)){
var old_desc_to_free_24858 = update_outcome.free_idx;
if(cljs.core.truth_((function (){var and__5043__auto__ = old_desc_to_free_24858;
if(cljs.core.truth_(and__5043__auto__)){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_desc_to_free_24858,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_desc_to_free_24858,new_desc_idx_for_cas)));
} else {
return and__5043__auto__;
}
})())){
var old_offset_24859 = cljs_thread.eve.util.read_block_descriptor_field(new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(s_atom_env),old_desc_to_free_24858,(4));
if(cljs_thread.eve.shared_atom.pool_root_block_BANG_(s_atom_env,old_offset_24859,old_desc_to_free_24858)){
} else {
cljs_thread.eve.shared_atom.retire_block_BANG_(s_atom_env,old_desc_to_free_24858);
}
} else {
}

var old_val_24860 = update_outcome.old_val;
var new_val_24861 = update_outcome.final_val;
if((((!((old_val_24860 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === old_val_24860.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!old_val_24860.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,old_val_24860):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,old_val_24860))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(old_val_24860,new_val_24861,s_atom_env,new cljs.core.Keyword(null,"retire","retire",-2029688445));

cljs_thread.eve.shared_atom.increment_epoch_BANG_(s_atom_env);
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(s_atom_env,slot_idx);
} else {
}

cljs_thread.eve.shared_atom.maybe_compact_BANG_(s_atom_env);

if(cljs.core.truth_(guard_QMARK_)){
cljs_thread.eve.shared_atom.xray_guard_check_BANG_(s_atom_env,"POST",null);

cljs_thread.eve.shared_atom.xray_guard_hamt_check_BANG_(s_atom_env,"POST");
} else {
}

var fv_24862 = update_outcome.final_val;
if((((!((fv_24862 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === fv_24862.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!fv_24862.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,fv_24862):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,fv_24862))){
(cljs_thread.eve.shared_atom.cached_deref_env = s_atom_env);

(cljs_thread.eve.shared_atom.cached_deref_desc_idx = new_desc_idx_for_cas);

(cljs_thread.eve.shared_atom.cached_deref_val = cljs_thread.eve.shared_atom.eve__GT_cljs(fv_24862));
} else {
(cljs_thread.eve.shared_atom.cached_deref_desc_idx = (-1));
}

return update_outcome;
} else {
var new_val_24863 = update_outcome.final_val;
var old_val_24864 = update_outcome.old_val;
if((((!((new_val_24863 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_val_24863.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_val_24863.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_val_24863):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_val_24863))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_val_24863,old_val_24864,s_atom_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(s_atom_env,slot_idx);
} else {
}

var newly_alloc_desc_idx_24865 = update_outcome.alloc_idx;
if(cljs.core.truth_((function (){var and__5043__auto__ = newly_alloc_desc_idx_24865;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(newly_alloc_desc_idx_24865,(-1));
} else {
return and__5043__auto__;
}
})())){
cljs_thread.eve.shared_atom.free(s_atom_env,newly_alloc_desc_idx_24865);
} else {
}

var G__24866 = (retries - (1));
retries = G__24866;
continue;
}
}
}
break;
}
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23475);
}});

/**
* @constructor
 * @implements {cljs.core.IWatchable}
 * @implements {cljs.core.IReset}
 * @implements {cljs.core.ISwap}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IWithMeta}
*/
cljs_thread.eve.shared_atom.AtomDomain = (function (s_atom_env,validator_fn,meta_map,watchers_atom){
this.s_atom_env = s_atom_env;
this.validator_fn = validator_fn;
this.meta_map = meta_map;
this.watchers_atom = watchers_atom;
this.cljs$lang$protocol_mask$partition0$ = 425984;
this.cljs$lang$protocol_mask$partition1$ = 98306;
});
(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_this){
var self__ = this;
var _this__$1 = this;
return self__.meta_map;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_,new_meta){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.shared_atom.__GT_AtomDomain.cljs$core$IFn$_invoke$arity$4 ? cljs_thread.eve.shared_atom.__GT_AtomDomain.cljs$core$IFn$_invoke$arity$4(self__.s_atom_env,self__.validator_fn,new_meta,self__.watchers_atom) : cljs_thread.eve.shared_atom.__GT_AtomDomain.call(null, self__.s_atom_env,self__.validator_fn,new_meta,self__.watchers_atom));
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IDeref$_deref$arity$1 = (function (_this){
var self__ = this;
var _this__$1 = this;
var _STAR_parent_atom_STAR__orig_val__23487 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23488 = _this__$1;
(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23488);

try{var slot_idx = cljs_thread.eve.shared_atom.ensure_worker_registered_BANG_(self__.s_atom_env);
cljs_thread.eve.shared_atom.begin_read_BANG_(self__.s_atom_env,slot_idx);

try{var index_view = cljs_thread.eve.shared_atom.cached_atom_iv;
var root_data_block_desc_idx = cljs_thread.eve.shared_atom.read_atom_domain_root_data_block_desc_idx(self__.s_atom_env);
if((((self__.s_atom_env === cljs_thread.eve.shared_atom.cached_deref_env)) && ((root_data_block_desc_idx === cljs_thread.eve.shared_atom.cached_deref_desc_idx)))){
return cljs_thread.eve.shared_atom.cached_deref_val;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(root_data_block_desc_idx,(-1))){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
var status = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_data_block_desc_idx,(0));
var data_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_data_block_desc_idx,(4));
var data_len = cljs_thread.eve.util.read_block_descriptor_field(index_view,root_data_block_desc_idx,(8));
if((((status === (1))) && ((data_len >= (0))))){
var sab_val = cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(self__.s_atom_env,cljs_thread.eve.wasm_mem.data_view(),data_offset,data_len);
var val = cljs_thread.eve.shared_atom.eve__GT_cljs(sab_val);
(cljs_thread.eve.shared_atom.cached_deref_env = self__.s_atom_env);

(cljs_thread.eve.shared_atom.cached_deref_desc_idx = root_data_block_desc_idx);

(cljs_thread.eve.shared_atom.cached_deref_val = val);

return val;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
}
}finally {if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(self__.s_atom_env,slot_idx);
} else {
}
}}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23487);
}}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IReset$_reset_BANG_$arity$2 = (function (this$,new_map_cljs_value){
var self__ = this;
var this$__$1 = this;
if(cljs.core.map_QMARK_(new_map_cljs_value)){
} else {
throw (new Error("AtomDomain can only be reset to a map."));
}

var outcome = cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_(this$__$1,cljs_thread.eve.shared_atom._update_fn_for_atom_domain_reset_BANG_,new_map_cljs_value,null);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.final_val);
if(cljs.core.truth_(outcome.changed)){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.old_val),final_cljs);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$ISwap$_swap_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
var outcome = cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_(this$__$1,cljs_thread.eve.shared_atom._update_fn_for_atom_domain_swap_BANG_,f,null);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.final_val);
if(cljs.core.truth_(outcome.changed)){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.old_val),final_cljs);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$ISwap$_swap_BANG_$arity$3 = (function (this$,f,x){
var self__ = this;
var this$__$1 = this;
var outcome = cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_(this$__$1,cljs_thread.eve.shared_atom._update_fn_for_atom_domain_swap_BANG_,f,[x]);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.final_val);
if(cljs.core.truth_(outcome.changed)){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.old_val),final_cljs);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$ISwap$_swap_BANG_$arity$4 = (function (this$,f,x,y){
var self__ = this;
var this$__$1 = this;
var outcome = cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_(this$__$1,cljs_thread.eve.shared_atom._update_fn_for_atom_domain_swap_BANG_,f,[x,y]);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.final_val);
if(cljs.core.truth_(outcome.changed)){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.old_val),final_cljs);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$ISwap$_swap_BANG_$arity$5 = (function (this$,f,x,y,r){
var self__ = this;
var this$__$1 = this;
var outcome = cljs_thread.eve.shared_atom.do_atom_domain_swap_BANG_(this$__$1,cljs_thread.eve.shared_atom._update_fn_for_atom_domain_swap_BANG_,f,cljs.core.to_array(cljs.core.cons(x,cljs.core.cons(y,r))));
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.final_val);
if(cljs.core.truth_(outcome.changed)){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,cljs_thread.eve.shared_atom.eve__GT_cljs(outcome.old_val),final_cljs);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = (function (_this,oldval,newval){
var self__ = this;
var _this__$1 = this;
return cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,oldval,newval);
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IWatchable$_add_watch$arity$3 = (function (this$,k,cb_fn){
var self__ = this;
var this$__$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.watchers_atom,cljs.core.assoc,k,cb_fn);

return this$__$1;
}));

(cljs_thread.eve.shared_atom.AtomDomain.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.watchers_atom,cljs.core.dissoc,k);

return this$__$1;
}));

(cljs_thread.eve.shared_atom.AtomDomain.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"s-atom-env","s-atom-env",-1797468401,null),new cljs.core.Symbol(null,"validator-fn","validator-fn",541840457,null),new cljs.core.Symbol(null,"meta-map","meta-map",434124124,null),new cljs.core.Symbol(null,"watchers-atom","watchers-atom",-752681348,null)], null);
}));

(cljs_thread.eve.shared_atom.AtomDomain.cljs$lang$type = true);

(cljs_thread.eve.shared_atom.AtomDomain.cljs$lang$ctorStr = "cljs-thread.eve.shared-atom/AtomDomain");

(cljs_thread.eve.shared_atom.AtomDomain.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.shared-atom/AtomDomain");
}));

/**
 * Positional factory function for cljs-thread.eve.shared-atom/AtomDomain.
 */
cljs_thread.eve.shared_atom.__GT_AtomDomain = (function cljs_thread$eve$shared_atom$__GT_AtomDomain(s_atom_env,validator_fn,meta_map,watchers_atom){
return (new cljs_thread.eve.shared_atom.AtomDomain(s_atom_env,validator_fn,meta_map,watchers_atom));
});

cljs_thread.eve.shared_atom._update_fn_for_shared_atom_reset_BANG_ = (function cljs_thread$eve$shared_atom$_update_fn_for_shared_atom_reset_BANG_(shared_atom_instance,parent_s_env,current_value_data_block_desc_idx,validator_fn,new_user_value,_ignored_user_args_seq){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var data_view = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var atom_id = shared_atom_instance.shared_atom_id;
var hdr_idx = shared_atom_instance.header_descriptor_idx;
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," A:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)," H:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hdr_idx)," UpdateFnReset InPtr:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_value_data_block_desc_idx),"] "].join('');
if(cljs.core.truth_((function (){var and__5043__auto__ = validator_fn;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((validator_fn.cljs$core$IFn$_invoke$arity$1 ? validator_fn.cljs$core$IFn$_invoke$arity$1(new_user_value) : validator_fn.call(null, new_user_value)));
} else {
return and__5043__auto__;
}
})())){
var err_msg_24884 = ["ValidatorFailed on Reset: AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING ",err_msg_24884], 0));

throw (new Error(err_msg_24884));
} else {
}

var old_sabp_representative_value = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_value_data_block_desc_idx,(-1)))?null:(function (){var start_read_outcome = cljs_thread.eve.shared_atom.start_read_BANG_(parent_s_env,current_value_data_block_desc_idx);
if((!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(start_read_outcome),new cljs.core.Keyword(null,"ok","ok",967785236))))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"ReadingOldForReset: Failed start-read!: ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([start_read_outcome], 0)),". THROWING StaleRead."], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn (Reset) FailedStartReadDetails: ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([start_read_outcome], 0))].join('')));
} else {
try{var initial_data_block_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(0));
var initial_data_block_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(4));
var initial_data_block_length = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(8));
if((((initial_data_block_status === (1))) && ((initial_data_block_length >= (0))))){
var status_after_read = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(0));
var length_after_read = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(8));
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_after_read,(1))) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(length_after_read,initial_data_block_length)))){
var err_msg_detail = ["DataStateChangedDuringRead (Reset): AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),", desc_idx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_value_data_block_desc_idx)].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING StaleReadOrInvalidStateUpdateFn - ",err_msg_detail], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn ",err_msg_detail].join('')));
} else {
return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(parent_s_env,cljs_thread.eve.wasm_mem.data_view(),initial_data_block_offset,initial_data_block_length);
}
} else {
var err_msg_detail = ["InitialDescriptorCheckFailed_AfterStartRead (Reset): AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),", desc_idx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_value_data_block_desc_idx)," StatusWas_",cljs.core.str.cljs$core$IFn$_invoke$arity$1(initial_data_block_status)].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING StaleReadOrInvalidStateUpdateFn - ",err_msg_detail], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn ",err_msg_detail].join('')));
}
}finally {cljs_thread.eve.shared_atom.end_read_BANG_(parent_s_env,current_value_data_block_desc_idx,cljs_thread.eve.data._STAR_worker_id_STAR_);
}}
})());
var old_value_for_user_fn = old_sabp_representative_value;
var new_serialized_sab_state_bytes = (function (){var _STAR_parent_atom_STAR__orig_val__23522 = cljs_thread.eve.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__orig_val__23523 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23524 = shared_atom_instance;
var _STAR_parent_atom_STAR__temp_val__23525 = shared_atom_instance;
(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23524);

(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23525);

try{return cljs_thread.eve.shared_atom.atom_serialize(new_user_value);
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23523);

(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23522);
}})();
var alloc_info = (cljs.core.truth_((function (){var and__5043__auto__ = new_serialized_sab_state_bytes;
if(cljs.core.truth_(and__5043__auto__)){
return (new_serialized_sab_state_bytes.length > (0));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.shared_atom.alloc(parent_s_env,new_serialized_sab_state_bytes.length):null);
if((alloc_info == null)){
if(cljs.core.truth_((function (){var and__5043__auto__ = new_serialized_sab_state_bytes;
if(cljs.core.truth_(and__5043__auto__)){
return (new_serialized_sab_state_bytes.length > (0));
} else {
return and__5043__auto__;
}
})())){
var err_msg_24890 = ["AllocFailedInUpdate (Reset): AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),". Allocation returned nil for non-empty bytes."].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING ",err_msg_24890], 0));

throw (new Error(err_msg_24890));
} else {
}

return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),(-1),new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973),current_value_data_block_desc_idx,new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123),old_sabp_representative_value,new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138),null,new cljs.core.Keyword(null,"newly-serialized-sab-state-bytes","newly-serialized-sab-state-bytes",-609159720),new_serialized_sab_state_bytes,new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012),new_user_value,new cljs.core.Keyword(null,"value-read-for-this-attempt","value-read-for-this-attempt",-1200624989),old_value_for_user_fn,new cljs.core.Keyword(null,"changed?","changed?",-437828330),true], null);
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))){
var err_msg = ["AllocFailedInUpdate (Reset): AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),". Alloc failed: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING ",err_msg], 0));

throw (new Error(err_msg));
} else {
var new_data_offset = new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_info);
var new_data_desc_idx = new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_info);
data_view.set(new_serialized_sab_state_bytes,new_data_offset);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(8),new_serialized_sab_state_bytes.length);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(4),new_data_offset);

return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),new_data_desc_idx,new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973),current_value_data_block_desc_idx,new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123),old_sabp_representative_value,new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138),new_data_desc_idx,new cljs.core.Keyword(null,"newly-serialized-sab-state-bytes","newly-serialized-sab-state-bytes",-609159720),new_serialized_sab_state_bytes,new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012),new_user_value,new cljs.core.Keyword(null,"value-read-for-this-attempt","value-read-for-this-attempt",-1200624989),old_value_for_user_fn,new cljs.core.Keyword(null,"changed?","changed?",-437828330),true], null);

}
}
});
cljs_thread.eve.shared_atom._try_cas_header_field_BANG_ = (function cljs_thread$eve$shared_atom$_try_cas_header_field_BANG_(index_view,field_idx,expected_ptr,new_ptr,num_inner_retries,atom_id){
var n = num_inner_retries;
while(true){
var actual_old_ptr_from_cas = Atomics.compareExchange(index_view,field_idx,expected_ptr,new_ptr);
if((actual_old_ptr_from_cas === expected_ptr)){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"success","success",1890645906),true], null);
} else {
if((n === (0))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"success","success",1890645906),false,new cljs.core.Keyword(null,"actual-ptr-at-failure","actual-ptr-at-failure",-1620577910),actual_old_ptr_from_cas], null);
} else {
var G__24908 = (n - (1));
n = G__24908;
continue;
}
}
break;
}
});
cljs_thread.eve.shared_atom.do_embedded_swap_BANG_ = (function cljs_thread$eve$shared_atom$do_embedded_swap_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___24909 = arguments.length;
var i__5770__auto___24910 = (0);
while(true){
if((i__5770__auto___24910 < len__5769__auto___24909)){
args__5775__auto__.push((arguments[i__5770__auto___24910]));

var G__24913 = (i__5770__auto___24910 + (1));
i__5770__auto___24910 = G__24913;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((3) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((3)),(0),null)):null);
return cljs_thread.eve.shared_atom.do_embedded_swap_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__5776__auto__);
});

(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (atom_instance,update_logic_fn,user_fn_or_new_value,user_args_seq){
var _STAR_parent_atom_STAR__orig_val__23546 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23547 = atom_instance;
(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23547);

try{var parent_s_atom_env = cljs_thread.eve.shared_atom.get_env(atom_instance);
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_atom_env);
var header_desc_idx = atom_instance.header_descriptor_idx;
var atom_id = atom_instance.shared_atom_id;
var target_value_desc_idx_in_header_field = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(header_desc_idx) + ((16) / (4)));
var INNER_CAS_RETRIES = (10);
var slot_idx = cljs_thread.eve.shared_atom.ensure_worker_registered_BANG_(parent_s_atom_env);
var outer_retries = (1000);
while(true){
if((outer_retries === (0))){
var err_msg_24915 = ["do-embedded-swap! [AtomID: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),", HdrIdx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(header_desc_idx),"] failed OUTER_LOOP after ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((1000))," retries."].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([err_msg_24915], 0));

throw (new Error(err_msg_24915));
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.begin_read_BANG_(parent_s_atom_env,slot_idx);
} else {
}

var current_data_block_desc_idx = Atomics.load(index_view,target_value_desc_idx_in_header_field);
var update_outcome = (function (){try{var G__23551 = atom_instance;
var G__23552 = parent_s_atom_env;
var G__23553 = current_data_block_desc_idx;
var G__23554 = atom_instance.validator_fn;
var G__23555 = user_fn_or_new_value;
var G__23556 = user_args_seq;
return (update_logic_fn.cljs$core$IFn$_invoke$arity$6 ? update_logic_fn.cljs$core$IFn$_invoke$arity$6(G__23551,G__23552,G__23553,G__23554,G__23555,G__23556) : update_logic_fn.call(null, G__23551,G__23552,G__23553,G__23554,G__23555,G__23556));
}catch (e23549){if((e23549 instanceof Error)){
var e = e23549;
var error_msg = e.message;
if(((clojure.string.includes_QMARK_(error_msg,"StaleReadOrInvalidState")) || (clojure.string.includes_QMARK_(error_msg,"AllocFailedInUpdate")))){
return new cljs.core.Keyword("cljs-thread.eve.shared-atom","retry-outer-swap-loop","cljs-thread.eve.shared-atom/retry-outer-swap-loop",-360054556);
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["!!! Unrecoverable error in update-logic-fn for AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)," Error: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(error_msg)].join(''),e], 0));

throw e;
}
} else {
throw e23549;

}
}})();
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(update_outcome,new cljs.core.Keyword("cljs-thread.eve.shared-atom","retry-outer-swap-loop","cljs-thread.eve.shared-atom/retry-outer-swap-loop",-360054556))){
if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(parent_s_atom_env,slot_idx);
} else {
}

var G__24920 = (outer_retries - (1));
outer_retries = G__24920;
continue;
} else {
var new_ptr_for_cas = cljs.core.get.cljs$core$IFn$_invoke$arity$3(update_outcome,new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),(-1));
var cas_attempt_result = cljs_thread.eve.shared_atom._try_cas_header_field_BANG_(index_view,target_value_desc_idx_in_header_field,current_data_block_desc_idx,new_ptr_for_cas,INNER_CAS_RETRIES,atom_id);
if(cljs.core.truth_(new cljs.core.Keyword(null,"success","success",1890645906).cljs$core$IFn$_invoke$arity$1(cas_attempt_result))){
var temp__5823__auto___24921 = new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973).cljs$core$IFn$_invoke$arity$1(update_outcome);
if(cljs.core.truth_(temp__5823__auto___24921)){
var old_desc_to_free_24922 = temp__5823__auto___24921;
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_desc_to_free_24922,(-1))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(old_desc_to_free_24922,new_ptr_for_cas)))){
cljs_thread.eve.shared_atom.retire_block_BANG_(parent_s_atom_env,old_desc_to_free_24922);
} else {
}
} else {
}

var old_sabp_val_24923 = new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123).cljs$core$IFn$_invoke$arity$1(update_outcome);
var new_sabp_val_24924 = new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(update_outcome);
if((((!((old_sabp_val_24923 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === old_sabp_val_24923.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!old_sabp_val_24923.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,old_sabp_val_24923):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,old_sabp_val_24923))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(old_sabp_val_24923,new_sabp_val_24924,parent_s_atom_env,new cljs.core.Keyword(null,"retire","retire",-2029688445));

cljs_thread.eve.shared_atom.increment_epoch_BANG_(parent_s_atom_env);
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(parent_s_atom_env,slot_idx);
} else {
}

cljs_thread.eve.shared_atom.maybe_compact_BANG_(parent_s_atom_env);

return update_outcome;
} else {
var temp__5823__auto___24928 = new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138).cljs$core$IFn$_invoke$arity$1(update_outcome);
if(cljs.core.truth_(temp__5823__auto___24928)){
var newly_alloc_desc_idx_24930 = temp__5823__auto___24928;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(newly_alloc_desc_idx_24930,(-1))){
cljs_thread.eve.shared_atom.free(parent_s_atom_env,newly_alloc_desc_idx_24930);
} else {
}
} else {
}

var new_sabp_val_24931 = new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(update_outcome);
var old_sabp_val_24932 = new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123).cljs$core$IFn$_invoke$arity$1(update_outcome);
if((((!((new_sabp_val_24931 == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_sabp_val_24931.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_sabp_val_24931.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_sabp_val_24931):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_sabp_val_24931))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_sabp_val_24931,old_sabp_val_24932,parent_s_atom_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(parent_s_atom_env,slot_idx);
} else {
}

var G__24933 = (outer_retries - (1));
outer_retries = G__24933;
continue;
}
}
break;
}
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23546);
}}));

(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_.cljs$lang$maxFixedArity = (3));

/** @this {Function} */
(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_.cljs$lang$applyTo = (function (seq23542){
var G__23543 = cljs.core.first(seq23542);
var seq23542__$1 = cljs.core.next(seq23542);
var G__23544 = cljs.core.first(seq23542__$1);
var seq23542__$2 = cljs.core.next(seq23542__$1);
var G__23545 = cljs.core.first(seq23542__$2);
var seq23542__$3 = cljs.core.next(seq23542__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__23543,G__23544,G__23545,seq23542__$3);
}));

cljs_thread.eve.shared_atom._try_read_shared_atom_value = (function cljs_thread$eve$shared_atom$_try_read_shared_atom_value(_this,value_data_block_idx,parent_s_env,log_prefix_outer,_read_context){
var parent_idx_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var log_prefix = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(log_prefix_outer)," TryRead desc:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_data_block_idx),"] "].join('');
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_data_block_idx,(-1))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"value","value",305978217),null], null);
} else {
var start_read_status = cljs_thread.eve.shared_atom.start_read_BANG_(parent_s_env,value_data_block_idx);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(start_read_status))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"Failed start-read!: ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([start_read_status], 0)),". Signaling retry."], 0));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"retry","retry",-614012896),true], null);
} else {
try{var data_block_status = cljs_thread.eve.util.read_block_descriptor_field(parent_idx_view,value_data_block_idx,(0));
var data_block_offset = cljs_thread.eve.util.read_block_descriptor_field(parent_idx_view,value_data_block_idx,(4));
var data_block_length = cljs_thread.eve.util.read_block_descriptor_field(parent_idx_view,value_data_block_idx,(8));
if((((data_block_status === (1))) && ((data_block_length >= (0))))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"value","value",305978217),cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(parent_s_env,cljs_thread.eve.wasm_mem.data_view(),data_block_offset,data_block_length)], null);
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"Path: STALE_BLOCK_DESC (Status was ",data_block_status,") after start-read. Signaling retry."], 0));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"retry","retry",-614012896),true], null);
}
}finally {cljs_thread.eve.shared_atom.end_read_BANG_(parent_s_env,value_data_block_idx,cljs_thread.eve.data._STAR_worker_id_STAR_);
}}
}
});
cljs_thread.eve.shared_atom._update_fn_for_shared_atom_swap_BANG_ = (function cljs_thread$eve$shared_atom$_update_fn_for_shared_atom_swap_BANG_(shared_atom_instance,parent_s_env,current_value_data_block_desc_idx,validator_fn,user_f,user_args_seq){
var index_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var data_view = new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var atom_id = shared_atom_instance.shared_atom_id;
var hdr_idx = shared_atom_instance.header_descriptor_idx;
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," A:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)," H:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hdr_idx)," UpdateFn InPtr:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(current_value_data_block_desc_idx),"] "].join('');
var old_sabp_representative_value = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current_value_data_block_desc_idx,(-1)))?null:(function (){var start_read_status = cljs_thread.eve.shared_atom.start_read_BANG_(parent_s_env,current_value_data_block_desc_idx);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(start_read_status))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"ReadingOld: Failed start-read!: ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([start_read_status], 0)),". THROWING StaleRead."], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn FailedStartRead: ",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([start_read_status], 0))].join('')));
} else {
try{var initial_data_block_status = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(0));
var initial_data_block_offset = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(4));
var initial_data_block_length = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(8));
if((((initial_data_block_status === (1))) && ((initial_data_block_length >= (0))))){
var status_after_read = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(0));
var length_after_read = cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(8));
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(status_after_read,(1))) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(length_after_read,initial_data_block_length)))){
var err_msg_detail = ["DataStateChangedDuringRead: AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING StaleReadOrInvalidStateUpdateFn - ",err_msg_detail], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn ",err_msg_detail].join('')));
} else {
try{return cljs_thread.eve.deftype_proto.serialize.deserialize_from_dv(parent_s_env,cljs_thread.eve.wasm_mem.data_view(),initial_data_block_offset,initial_data_block_length);
}catch (e23580){if((e23580 instanceof RangeError)){
var e = e23580;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! DESERIALIZE CRASH at desc:",current_value_data_block_desc_idx,"offset:",initial_data_block_offset,"len:",initial_data_block_length,"sab-size:",index_view.buffer.byteLength], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"  desc-status:",cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(0)),"desc-cap:",cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(12)),"desc-epoch:",cljs_thread.eve.util.read_block_descriptor_field(index_view,current_value_data_block_desc_idx,(24))], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"  first-32-bytes:",(function (){var dv = cljs_thread.eve.wasm_mem.data_view();
var end = (function (){var x__5133__auto__ = (initial_data_block_offset + (32));
var y__5134__auto__ = dv.buffer.byteLength;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i = initial_data_block_offset;
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if((i >= end)){
return acc;
} else {
var G__24958 = (i + (1));
var G__24959 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,dv.getUint8(i));
i = G__24958;
acc = G__24959;
continue;
}
break;
}
})()], 0));

throw e;
} else {
throw e23580;

}
}}
} else {
var err_msg_detail = ["InitialDescriptorCheckFailed_AfterStartRead: AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)," StatusWas_",cljs.core.str.cljs$core$IFn$_invoke$arity$1(initial_data_block_status)].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"THROWING StaleReadOrInvalidStateUpdateFn - ",err_msg_detail], 0));

throw (new Error(["StaleReadOrInvalidStateUpdateFn ",err_msg_detail].join('')));
}
}finally {cljs_thread.eve.shared_atom.end_read_BANG_(parent_s_env,current_value_data_block_desc_idx,cljs_thread.eve.data._STAR_worker_id_STAR_);
}}
})());
var old_value_for_user_fn = old_sabp_representative_value;
var new_ab_native_value_from_user_fn = (function (){try{return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(user_f,old_value_for_user_fn,user_args_seq);
}catch (e23591){if((e23591 instanceof RangeError)){
var e = e23591;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! USER-FN CRASH (HAMT walk/assoc):",e.message], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"  old-value type:",cljs.core.type(old_value_for_user_fn),"data-desc:",current_value_data_block_desc_idx], 0));

cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2(parent_s_env,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"label","label",1718410804),"USER-FN-CRASH"], null));

throw e;
} else {
throw e23591;

}
}})();
if(cljs.core.truth_((function (){var and__5043__auto__ = validator_fn;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((validator_fn.cljs$core$IFn$_invoke$arity$1 ? validator_fn.cljs$core$IFn$_invoke$arity$1(new_ab_native_value_from_user_fn) : validator_fn.call(null, new_ab_native_value_from_user_fn)));
} else {
return and__5043__auto__;
}
})())){
throw (new Error(["ValidatorFailed: AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)].join('')));
} else {
}

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new_ab_native_value_from_user_fn,old_value_for_user_fn)){
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),current_value_data_block_desc_idx,new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973),null,new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123),old_sabp_representative_value,new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138),null,new cljs.core.Keyword(null,"newly-serialized-sab-state-bytes","newly-serialized-sab-state-bytes",-609159720),null,new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012),old_value_for_user_fn,new cljs.core.Keyword(null,"value-read-for-this-attempt","value-read-for-this-attempt",-1200624989),old_value_for_user_fn,new cljs.core.Keyword(null,"changed?","changed?",-437828330),false], null);
} else {
var new_serialized_sab_state_bytes = (function (){try{var _STAR_parent_atom_STAR__orig_val__23594 = cljs_thread.eve.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__orig_val__23595 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23596 = shared_atom_instance;
var _STAR_parent_atom_STAR__temp_val__23597 = shared_atom_instance;
(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23596);

(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23597);

try{return (cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1(new_ab_native_value_from_user_fn) : cljs_thread.eve.shared_atom.default_serializer.call(null, new_ab_native_value_from_user_fn));
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23595);

(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23594);
}}catch (e23593){if((e23593 instanceof RangeError)){
var e = e23593;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! SERIALIZE CRASH:",e.message], 0));

cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2(parent_s_env,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"label","label",1718410804),"SERIALIZE-CRASH"], null));

throw e;
} else {
throw e23593;

}
}})();
var alloc_info = (cljs.core.truth_((function (){var and__5043__auto__ = new_serialized_sab_state_bytes;
if(cljs.core.truth_(and__5043__auto__)){
return (new_serialized_sab_state_bytes.length > (0));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.shared_atom.alloc(parent_s_env,new_serialized_sab_state_bytes.length):null);
if((alloc_info == null)){
if(cljs.core.truth_((function (){var and__5043__auto__ = new_serialized_sab_state_bytes;
if(cljs.core.truth_(and__5043__auto__)){
return (new_serialized_sab_state_bytes.length > (0));
} else {
return and__5043__auto__;
}
})())){
if((((!((new_ab_native_value_from_user_fn == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_ab_native_value_from_user_fn.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_ab_native_value_from_user_fn.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_ab_native_value_from_user_fn):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_ab_native_value_from_user_fn))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_ab_native_value_from_user_fn,old_sabp_representative_value,parent_s_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

throw (new Error(["AllocFailedInUpdate AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),": Alloc returned nil for non-empty bytes."].join('')));
} else {
}

return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),(-1),new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973),current_value_data_block_desc_idx,new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123),old_sabp_representative_value,new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138),null,new cljs.core.Keyword(null,"newly-serialized-sab-state-bytes","newly-serialized-sab-state-bytes",-609159720),new_serialized_sab_state_bytes,new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012),new_ab_native_value_from_user_fn,new cljs.core.Keyword(null,"value-read-for-this-attempt","value-read-for-this-attempt",-1200624989),old_value_for_user_fn,new cljs.core.Keyword(null,"changed?","changed?",-437828330),true], null);
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))){
if((((!((new_ab_native_value_from_user_fn == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === new_ab_native_value_from_user_fn.cljs_thread$eve$deftype_proto$data$ISabRetirable$))))?true:(((!new_ab_native_value_from_user_fn.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_ab_native_value_from_user_fn):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.eve.deftype_proto.data.ISabRetirable,new_ab_native_value_from_user_fn))){
cljs_thread.eve.deftype_proto.data._sab_retire_diff_BANG_(new_ab_native_value_from_user_fn,old_sabp_representative_value,parent_s_env,new cljs.core.Keyword(null,"free","free",801364328));
} else {
}

throw (new Error(["AllocFailedInUpdate AtomID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_info))].join('')));
} else {
var new_data_offset = new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_info);
var new_data_desc_idx = new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_info);
if((((new_data_offset < (0))) || (((new_data_offset + new_serialized_sab_state_bytes.length) >= data_view.buffer.byteLength)))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! WRITE BOUNDS ERROR: offset=",new_data_offset,"len=",new_serialized_sab_state_bytes.length,"sab-size=",data_view.buffer.byteLength,"desc-idx=",new_data_desc_idx], 0));

cljs_thread.eve.shared_atom.validate_storage_model_BANG_.cljs$core$IFn$_invoke$arity$2(parent_s_env,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"label","label",1718410804),"WRITE-BOUNDS"], null));

throw (new RangeError("Prevented OOB write to SAB"));
} else {
}

data_view.set(new_serialized_sab_state_bytes,new_data_offset);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(8),new_serialized_sab_state_bytes.length);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(index_view,new_data_desc_idx,(4),new_data_offset);

return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"new-value-data-block-desc-idx-for-header","new-value-data-block-desc-idx-for-header",-1588464115),new_data_desc_idx,new cljs.core.Keyword(null,"old-data-desc-idx-to-free-on-success","old-data-desc-idx-to-free-on-success",-2051355973),current_value_data_block_desc_idx,new cljs.core.Keyword(null,"old-sabp-representative-value","old-sabp-representative-value",852648123),old_sabp_representative_value,new cljs.core.Keyword(null,"newly-allocated-data-desc-idx-to-free-on-cas-fail","newly-allocated-data-desc-idx-to-free-on-cas-fail",-1461934138),new_data_desc_idx,new cljs.core.Keyword(null,"newly-serialized-sab-state-bytes","newly-serialized-sab-state-bytes",-609159720),new_serialized_sab_state_bytes,new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012),new_ab_native_value_from_user_fn,new cljs.core.Keyword(null,"value-read-for-this-attempt","value-read-for-this-attempt",-1200624989),old_value_for_user_fn,new cljs.core.Keyword(null,"changed?","changed?",-437828330),true], null);

}
}
}
});

/**
 * @interface
 */
cljs_thread.eve.shared_atom.ISharedAtom = function(){};


/**
* @constructor
 * @implements {cljs.core.IWatchable}
 * @implements {cljs.core.IReset}
 * @implements {cljs.core.ISwap}
 * @implements {cljs.core.IMeta}
 * @implements {cljs_thread.eve.shared_atom.ISharedAtom}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IWithMeta}
*/
cljs_thread.eve.shared_atom.SharedAtom = (function (parent_atom_domain,shared_atom_id,header_descriptor_idx,validator_fn,meta_map,watchers_atom){
this.parent_atom_domain = parent_atom_domain;
this.shared_atom_id = shared_atom_id;
this.header_descriptor_idx = header_descriptor_idx;
this.validator_fn = validator_fn;
this.meta_map = meta_map;
this.watchers_atom = watchers_atom;
this.cljs$lang$protocol_mask$partition0$ = 2147909632;
this.cljs$lang$protocol_mask$partition1$ = 98306;
});
(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs_thread$eve$shared_atom$ISharedAtom$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_this){
var self__ = this;
var _this__$1 = this;
return self__.meta_map;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_,new_meta){
var self__ = this;
var ___$1 = this;
return (cljs_thread.eve.shared_atom.__GT_SharedAtom.cljs$core$IFn$_invoke$arity$6 ? cljs_thread.eve.shared_atom.__GT_SharedAtom.cljs$core$IFn$_invoke$arity$6(self__.parent_atom_domain,self__.shared_atom_id,self__.header_descriptor_idx,self__.validator_fn,new_meta,self__.watchers_atom) : cljs_thread.eve.shared_atom.__GT_SharedAtom.call(null, self__.parent_atom_domain,self__.shared_atom_id,self__.header_descriptor_idx,self__.validator_fn,new_meta,self__.watchers_atom));
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IDeref$_deref$arity$1 = (function (_this){
var self__ = this;
var _this__$1 = this;
var _STAR_parent_atom_STAR__orig_val__23615 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23616 = _this__$1;
(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23616);

try{var parent_s_env = self__.parent_atom_domain.s_atom_env;
var parent_idx_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var atom_id = _this__$1.shared_atom_id;
var hdr_idx = _this__$1.header_descriptor_idx;
var atom_header_base_int32 = cljs_thread.eve.util.get_block_descriptor_base_int32_offset(self__.header_descriptor_idx);
var value_data_desc_idx_field_in_header = (atom_header_base_int32 + ((16) / (4)));
var read_context = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"s-atom-env","s-atom-env",856967368),parent_s_env], null);
var log_prefix = ["[W:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)," A:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id)," H:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hdr_idx)," DerefLoop] "].join('');
var slot_idx = cljs_thread.eve.shared_atom.ensure_worker_registered_BANG_(parent_s_env);
cljs_thread.eve.shared_atom.begin_read_BANG_(parent_s_env,slot_idx);

try{var sab_val = (function (){var deref_retries = (10);
while(true){
if((deref_retries === (0))){
var err_msg_25085 = ["SharedAtom -deref ID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(atom_id),", HdrIdx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hdr_idx)," failed after ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((10))," retries."].join('');
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([log_prefix,"!!! MAX_DEREF_RETRIES ",err_msg_25085], 0));

throw (new Error(err_msg_25085));
} else {
}

var value_data_block_idx = Atomics.load(parent_idx_view,value_data_desc_idx_field_in_header);
var read_attempt_result = cljs_thread.eve.shared_atom._try_read_shared_atom_value(_this__$1,value_data_block_idx,parent_s_env,log_prefix,read_context);
if(cljs.core.truth_(new cljs.core.Keyword(null,"retry","retry",-614012896).cljs$core$IFn$_invoke$arity$1(read_attempt_result))){
var G__25102 = (deref_retries - (1));
deref_retries = G__25102;
continue;
} else {
return new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(read_attempt_result);
}
break;
}
})();
return cljs_thread.eve.shared_atom.eve__GT_cljs(sab_val);
}finally {if(cljs.core.truth_(slot_idx)){
cljs_thread.eve.shared_atom.end_read_epoch_BANG_(parent_s_env,slot_idx);
} else {
}
}}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23615);
}}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IReset$_reset_BANG_$arity$2 = (function (this$,new_user_value){
var self__ = this;
var this$__$1 = this;
var old_user_value_for_watchers = cljs.core.deref(this$__$1);
var _ = (cljs.core.truth_((function (){var and__5043__auto__ = self__.validator_fn;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((self__.validator_fn.cljs$core$IFn$_invoke$arity$1 ? self__.validator_fn.cljs$core$IFn$_invoke$arity$1(new_user_value) : self__.validator_fn.call(null, new_user_value)));
} else {
return and__5043__auto__;
}
})())?(function(){throw (new Error(["SharedAtom -reset! for ID ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(this$__$1.shared_atom_id),": Validator function returned false."].join('')))})():null);
var outcome = cljs.core.apply.cljs$core$IFn$_invoke$arity$5(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_,this$__$1,cljs_thread.eve.shared_atom._update_fn_for_shared_atom_reset_BANG_,new_user_value,cljs.core.PersistentVector.EMPTY);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(outcome));
if(cljs.core.truth_(new cljs.core.Keyword(null,"changed?","changed?",-437828330).cljs$core$IFn$_invoke$arity$1(outcome))){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,old_user_value_for_watchers,final_cljs);

cljs_thread.eve.shared_atom.notify_remote_watches_BANG_(self__.parent_atom_domain.s_atom_env,self__.header_descriptor_idx);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$ISwap$_swap_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
var old = cljs.core.deref(this$__$1);
var outcome = cljs.core.apply.cljs$core$IFn$_invoke$arity$5(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_,this$__$1,cljs_thread.eve.shared_atom._update_fn_for_shared_atom_swap_BANG_,f,cljs.core.PersistentVector.EMPTY);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(outcome));
if(cljs.core.truth_(new cljs.core.Keyword(null,"changed?","changed?",-437828330).cljs$core$IFn$_invoke$arity$1(outcome))){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,old,final_cljs);

cljs_thread.eve.shared_atom.notify_remote_watches_BANG_(self__.parent_atom_domain.s_atom_env,self__.header_descriptor_idx);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$ISwap$_swap_BANG_$arity$3 = (function (this$,f,x){
var self__ = this;
var this$__$1 = this;
var old = cljs.core.deref(this$__$1);
var outcome = cljs.core.apply.cljs$core$IFn$_invoke$arity$5(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_,this$__$1,cljs_thread.eve.shared_atom._update_fn_for_shared_atom_swap_BANG_,f,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [x], null));
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(outcome));
if(cljs.core.truth_(new cljs.core.Keyword(null,"changed?","changed?",-437828330).cljs$core$IFn$_invoke$arity$1(outcome))){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,old,final_cljs);

cljs_thread.eve.shared_atom.notify_remote_watches_BANG_(self__.parent_atom_domain.s_atom_env,self__.header_descriptor_idx);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$ISwap$_swap_BANG_$arity$4 = (function (this$,f,x,y){
var self__ = this;
var this$__$1 = this;
var old = cljs.core.deref(this$__$1);
var outcome = cljs.core.apply.cljs$core$IFn$_invoke$arity$5(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_,this$__$1,cljs_thread.eve.shared_atom._update_fn_for_shared_atom_swap_BANG_,f,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [x,y], null));
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(outcome));
if(cljs.core.truth_(new cljs.core.Keyword(null,"changed?","changed?",-437828330).cljs$core$IFn$_invoke$arity$1(outcome))){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,old,final_cljs);

cljs_thread.eve.shared_atom.notify_remote_watches_BANG_(self__.parent_atom_domain.s_atom_env,self__.header_descriptor_idx);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$ISwap$_swap_BANG_$arity$5 = (function (this$,f,x,y,r){
var self__ = this;
var this$__$1 = this;
var old = cljs.core.deref(this$__$1);
var user_args = cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [x,y], null),r);
var outcome = cljs.core.apply.cljs$core$IFn$_invoke$arity$5(cljs_thread.eve.shared_atom.do_embedded_swap_BANG_,this$__$1,cljs_thread.eve.shared_atom._update_fn_for_shared_atom_swap_BANG_,f,user_args);
var final_cljs = cljs_thread.eve.shared_atom.eve__GT_cljs(new cljs.core.Keyword(null,"final-cljs-value","final-cljs-value",-1533778012).cljs$core$IFn$_invoke$arity$1(outcome));
if(cljs.core.truth_(new cljs.core.Keyword(null,"changed?","changed?",-437828330).cljs$core$IFn$_invoke$arity$1(outcome))){
cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,old,final_cljs);

cljs_thread.eve.shared_atom.notify_remote_watches_BANG_(self__.parent_atom_domain.s_atom_env,self__.header_descriptor_idx);
} else {
}

return final_cljs;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = (function (_this,oldval,newval){
var self__ = this;
var _this__$1 = this;
return cljs_thread.eve.shared_atom.notify_watches(self__.watchers_atom,oldval,newval);
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = (function (this$,k,cb_fn){
var self__ = this;
var this$__$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.watchers_atom,cljs.core.assoc,k,cb_fn);

cljs_thread.eve.shared_atom.ensure_watch_loop_BANG_(this$__$1,self__.header_descriptor_idx,self__.watchers_atom);

return this$__$1;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.watchers_atom,cljs.core.dissoc,k);

if(cljs.core.empty_QMARK_(cljs.core.deref(self__.watchers_atom))){
cljs_thread.eve.shared_atom.stop_watch_loop_BANG_(self__.header_descriptor_idx);
} else {
}

return this$__$1;
}));

(cljs_thread.eve.shared_atom.SharedAtom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,_opts){
var self__ = this;
var ___$1 = this;
return cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(writer,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["#cljs-thread/shared-atom {:id ",self__.shared_atom_id," :idx ",self__.header_descriptor_idx,"}"], 0));
}));

(cljs_thread.eve.shared_atom.SharedAtom.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"parent-atom-domain","parent-atom-domain",-953515010,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"AtomDomain","AtomDomain",652460029,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"shared-atom-id","shared-atom-id",-185560562,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"header-descriptor-idx","header-descriptor-idx",1786316829,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),new cljs.core.Symbol(null,"validator-fn","validator-fn",541840457,null),new cljs.core.Symbol(null,"meta-map","meta-map",434124124,null),new cljs.core.Symbol(null,"watchers-atom","watchers-atom",-752681348,null)], null);
}));

(cljs_thread.eve.shared_atom.SharedAtom.cljs$lang$type = true);

(cljs_thread.eve.shared_atom.SharedAtom.cljs$lang$ctorStr = "cljs-thread.eve.shared-atom/SharedAtom");

(cljs_thread.eve.shared_atom.SharedAtom.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.shared-atom/SharedAtom");
}));

/**
 * Positional factory function for cljs-thread.eve.shared-atom/SharedAtom.
 */
cljs_thread.eve.shared_atom.__GT_SharedAtom = (function cljs_thread$eve$shared_atom$__GT_SharedAtom(parent_atom_domain,shared_atom_id,header_descriptor_idx,validator_fn,meta_map,watchers_atom){
return (new cljs_thread.eve.shared_atom.SharedAtom(parent_atom_domain,shared_atom_id,header_descriptor_idx,validator_fn,meta_map,watchers_atom));
});

cljs_thread.eve.shared_atom.atom_id_counter = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
cljs_thread.eve.shared_atom.next_atom_id = (function cljs_thread$eve$shared_atom$next_atom_id(){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.eve.shared_atom.atom_id_counter,cljs.core.inc);
});
/**
 * Parse atom arguments:
 * (atom value)                - 1 arg: anonymous atom
 * (atom ::id value)           - qualified kw: named atom (shorthand)
 * (atom {:id ::id} value)     - config map: named atom
 * (atom nil value)            - nil first: anonymous (escape hatch)
 */
cljs_thread.eve.shared_atom.parse_atom_args = (function cljs_thread$eve$shared_atom$parse_atom_args(args){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(args))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),cljs.core.first(args),new cljs.core.Keyword(null,"opts","opts",155075701),cljs.core.PersistentArrayMap.EMPTY], null);
} else {
var fst = cljs.core.first(args);
var snd = cljs.core.second(args);
if(cljs.core.truth_((function (){var and__5043__auto__ = (fst instanceof cljs.core.Keyword);
if(and__5043__auto__){
return cljs.core.namespace(fst);
} else {
return and__5043__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),snd,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),fst], null)], null);
} else {
if(cljs.core.map_QMARK_(fst)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),snd,new cljs.core.Keyword(null,"opts","opts",155075701),fst], null);
} else {
if((fst == null)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),snd,new cljs.core.Keyword(null,"opts","opts",155075701),cljs.core.PersistentArrayMap.EMPTY], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),fst,new cljs.core.Keyword(null,"opts","opts",155075701),cljs.core.PersistentArrayMap.EMPTY], null);

}
}
}
}
});
/**
 * Internal: allocate and register a new SharedAtom.
 */
cljs_thread.eve.shared_atom.create_atom_BANG_ = (function cljs_thread$eve$shared_atom$create_atom_BANG_(target_atom_domain,initial_value,atom_id,validator,metamap){
var parent_s_env = target_atom_domain.s_atom_env;
var parent_idx_view = new cljs.core.Keyword(null,"index-view","index-view",978697547).cljs$core$IFn$_invoke$arity$1(parent_s_env);
var serialized_initial_bytes = (function (){var _STAR_parent_atom_STAR__orig_val__23651 = cljs_thread.eve.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__orig_val__23652 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
var _STAR_parent_atom_STAR__temp_val__23653 = target_atom_domain;
var _STAR_parent_atom_STAR__temp_val__23654 = target_atom_domain;
(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23653);

(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__temp_val__23654);

try{return (cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.shared_atom.default_serializer.cljs$core$IFn$_invoke$arity$1(initial_value) : cljs_thread.eve.shared_atom.default_serializer.call(null, initial_value));
}finally {(cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23652);

(cljs_thread.eve.data._STAR_parent_atom_STAR_ = _STAR_parent_atom_STAR__orig_val__23651);
}})();
var alloc_result_value = (cljs.core.truth_((function (){var and__5043__auto__ = serialized_initial_bytes;
if(cljs.core.truth_(and__5043__auto__)){
return (serialized_initial_bytes.length > (0));
} else {
return and__5043__auto__;
}
})())?cljs_thread.eve.shared_atom.alloc(parent_s_env,serialized_initial_bytes.length):null);
var value_data_block_desc_idx = (cljs.core.truth_(alloc_result_value)?new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_result_value):(-1));
if(cljs.core.truth_((function (){var and__5043__auto__ = serialized_initial_bytes;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = alloc_result_value;
if(cljs.core.truth_(and__5043__auto____$1)){
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result_value);
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
throw (new Error(["atom constructor: Failed to alloc state block: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result_value))].join('')));
} else {
}

if(cljs.core.truth_((function (){var and__5043__auto__ = alloc_result_value;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = cljs.core.not(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result_value));
if(and__5043__auto____$1){
return serialized_initial_bytes;
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
new cljs.core.Keyword(null,"data-view","data-view",2142900612).cljs$core$IFn$_invoke$arity$1(parent_s_env).set(serialized_initial_bytes,new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_result_value));

cljs_thread.eve.util.write_block_descriptor_field_BANG_(parent_idx_view,value_data_block_desc_idx,(8),serialized_initial_bytes.length);
} else {
}

var candidate_header_idx = (0);
var scan_retries = (2);
while(true){
if((candidate_header_idx >= cljs_thread.eve.shared_atom.safe_max_descriptors(parent_s_env))){
if((scan_retries > (0))){
var G__25209 = (0);
var G__25210 = (scan_retries - (1));
candidate_header_idx = G__25209;
scan_retries = G__25210;
continue;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value_data_block_desc_idx,(-1))){
cljs_thread.eve.shared_atom.free(parent_s_env,value_data_block_desc_idx);
} else {
}

throw (new Error("atom constructor: No suitable ZEROED_UNUSED descriptor slot for embedded atom header."));
}
} else {
var header_status = cljs_thread.eve.util.read_block_descriptor_field(parent_idx_view,candidate_header_idx,(0));
var header_lock_field_idx = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(candidate_header_idx) + ((20) / (4)));
if((((header_status === (-1))) && (((0) === cljs_thread.eve.util.atomic_compare_exchange_int(parent_idx_view,header_lock_field_idx,(0),cljs_thread.eve.data._STAR_worker_id_STAR_))))){
var final_atom_instance = cljs_thread.eve.shared_atom.__GT_SharedAtom(target_atom_domain,atom_id,candidate_header_idx,validator,metamap,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY));
try{cljs_thread.eve.shared_atom.clear_descriptor_fields_BANG_(parent_idx_view,candidate_header_idx);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(parent_idx_view,candidate_header_idx,(16),value_data_block_desc_idx);

cljs_thread.eve.util.write_block_descriptor_field_BANG_(parent_idx_view,candidate_header_idx,(0),(3));

cljs_thread.eve.shared_atom.update_mirrors_BANG_(parent_idx_view,candidate_header_idx,(3),null);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(target_atom_domain,cljs.core.assoc,atom_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"header-descriptor-idx","header-descriptor-idx",145785302),candidate_header_idx], null));

return final_atom_instance;
}finally {cljs_thread.eve.util.atomic_store_int(parent_idx_view,header_lock_field_idx,(0));
}} else {
var G__25233 = (candidate_header_idx + (1));
var G__25234 = scan_retries;
candidate_header_idx = G__25233;
scan_retries = G__25234;
continue;
}
}
break;
}
});
/**
 * Create or retrieve a SharedAtom.
 * (atom {:counter 0})              - anonymous atom
 * (atom ::state {:counter 0})      - named atom (qualified kw shorthand)
 * (atom {:id ::state} {:counter 0}) - named atom (config map)
 * 
 * Named atoms are registered globally - if one with that :id exists,
 * returns the existing atom (enables cross-worker sharing via defonce).
 */
cljs_thread.eve.shared_atom.atom = (function cljs_thread$eve$shared_atom$atom(var_args){
var args__5775__auto__ = [];
var len__5769__auto___25236 = arguments.length;
var i__5770__auto___25237 = (0);
while(true){
if((i__5770__auto___25237 < len__5769__auto___25236)){
args__5775__auto__.push((arguments[i__5770__auto___25237]));

var G__25238 = (i__5770__auto___25237 + (1));
i__5770__auto___25237 = G__25238;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.eve.shared_atom.atom.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.eve.shared_atom.atom.cljs$core$IFn$_invoke$arity$variadic = (function (args){
var map__23660 = cljs_thread.eve.shared_atom.parse_atom_args(args);
var map__23660__$1 = cljs.core.__destructure_map(map__23660);
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23660__$1,new cljs.core.Keyword(null,"value","value",305978217));
var opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23660__$1,new cljs.core.Keyword(null,"opts","opts",155075701));
var map__23661 = opts;
var map__23661__$1 = cljs.core.__destructure_map(map__23661);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23661__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var metamap = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23661__$1,new cljs.core.Keyword(null,"metamap","metamap",1599603228),cljs.core.PersistentArrayMap.EMPTY);
var validator = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23661__$1,new cljs.core.Keyword(null,"validator","validator",-1966190681));
var target_atom_domain = (function (){var or__5045__auto__ = cljs_thread.eve.data._STAR_parent_atom_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
}
})();
if(cljs.core.truth_(target_atom_domain)){
} else {
throw (new Error("Target AtomDomain not bound for new atom."));
}

if(cljs.core.truth_(id)){
var temp__5821__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(target_atom_domain),id);
if(cljs.core.truth_(temp__5821__auto__)){
var existing = temp__5821__auto__;
return cljs_thread.eve.shared_atom.__GT_SharedAtom(target_atom_domain,id,new cljs.core.Keyword(null,"header-descriptor-idx","header-descriptor-idx",145785302).cljs$core$IFn$_invoke$arity$1(existing),validator,metamap,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY));
} else {
return cljs_thread.eve.shared_atom.create_atom_BANG_(target_atom_domain,value,id,validator,metamap);
}
} else {
return cljs_thread.eve.shared_atom.create_atom_BANG_(target_atom_domain,value,cljs_thread.eve.shared_atom.next_atom_id(),validator,metamap);
}
}));

(cljs_thread.eve.shared_atom.atom.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.eve.shared_atom.atom.cljs$lang$applyTo = (function (seq23657){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq23657));
}));

if(cljs.core.truth_(cljs_thread.eve.util.is_main_thread_QMARK_)){
if(cljs.core.truth_(cljs_thread.eve.data._STAR_worker_id_STAR_)){
} else {
(cljs_thread.eve.data._STAR_worker_id_STAR_ = (1));
}

(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ = cljs_thread.eve.shared_atom.atom_domain(cljs.core.PersistentArrayMap.EMPTY));

var gai_25244 = cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
var temp__5823__auto___25245 = new cljs.core.Keyword(null,"wasm-memory","wasm-memory",-854888656).cljs$core$IFn$_invoke$arity$1(gai_25244.s_atom_env);
if(cljs.core.truth_(temp__5823__auto___25245)){
var wasm_memory_25247 = temp__5823__auto___25245;
cljs_thread.eve.wasm_mem.init_BANG_(wasm_memory_25247).then((function (_){
return console.log("EVE WASM module initialized");
})).catch((function (err){
return console.warn("EVE WASM init failed (using JS fallback):",err);
}));
} else {
}
} else {
}
cljs_thread.eve.shared_atom.shared_atom_QMARK_ = (function cljs_thread$eve$shared_atom$shared_atom_QMARK_(obj){
return (obj instanceof cljs_thread.eve.shared_atom.SharedAtom);
});
cljs_thread.eve.shared_atom.conveyable__GT_ = (function cljs_thread$eve$shared_atom$conveyable__GT_(t){
if(cljs_thread.eve.shared_atom.shared_atom_QMARK_(t)){
return ({"type": "shared-atom", "parent-atom-domain-id": "global", "shared-atom-id": t.shared_atom_id, "header-descriptor-idx": t.header_descriptor_idx, "meta-map": cljs.core.clj__GT_js(t.meta_map)});
} else {
if((t instanceof cljs_thread.eve.shared_atom.AtomDomain)){
return ({"type": "atom-domain", "meta-map": cljs.core.clj__GT_js(t.meta_map), "validator-fn": null});
} else {
return t;

}
}
});
cljs_thread.eve.shared_atom._LT__conveyable = (function cljs_thread$eve$shared_atom$_LT__conveyable(m){
if(((cljs.core.map_QMARK_(m)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("shared-atom",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(m))))){
var parent_atom_domain_id = new cljs.core.Keyword(null,"parent-atom-domain-id","parent-atom-domain-id",428473538).cljs$core$IFn$_invoke$arity$1(m);
var parent_atom_domain = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(parent_atom_domain_id,"global"))?cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_:(function (){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["!!! <-conveyable: Unknown parent-atom-domain-id:",parent_atom_domain_id], 0));

return null;
})()

);
var received_id = new cljs.core.Keyword(null,"shared-atom-id","shared-atom-id",-1826092089).cljs$core$IFn$_invoke$arity$1(m);
var header_idx = new cljs.core.Keyword(null,"header-descriptor-idx","header-descriptor-idx",145785302).cljs$core$IFn$_invoke$arity$1(m);
var meta_from_conveyed = new cljs.core.Keyword(null,"meta-map","meta-map",-1206407403).cljs$core$IFn$_invoke$arity$2(m,cljs.core.PersistentArrayMap.EMPTY);
if((((parent_atom_domain == null)) || ((((received_id == null)) || ((header_idx == null)))))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["!!! atom/<-conveyable: CRITICAL - Cannot reconstruct SharedAtom.",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([m], 0))], 0));

return null;
} else {
return cljs_thread.eve.shared_atom.__GT_SharedAtom(parent_atom_domain,received_id,header_idx,null,meta_from_conveyed,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY));
}
} else {
if(((cljs.core.map_QMARK_(m)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("atom-domain",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(m))))){
if(cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)){
var meta_from_conveyed = new cljs.core.Keyword(null,"meta-map","meta-map",-1206407403).cljs$core$IFn$_invoke$arity$2(m,cljs.core.PersistentArrayMap.EMPTY);
if(cljs.core.empty_QMARK_(meta_from_conveyed)){
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
} else {
return cljs.core._with_meta(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_,meta_from_conveyed);
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["!!! atom/<-conveyable: CRITICAL - No global atom instance for AtomDomain reconstruction"], 0));

return null;
}
} else {
return m;

}
}
});
cljs_thread.eve.shared_atom.mem_window = (function cljs_thread$eve$shared_atom$mem_window(var_args){
var G__23671 = arguments.length;
switch (G__23671) {
case 1:
return cljs_thread.eve.shared_atom.mem_window.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.shared_atom.mem_window.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.shared_atom.mem_window.cljs$core$IFn$_invoke$arity$1 = (function (atom_domain_deftype_instance){
return cljs_thread.eve.shared_atom.mem_window.cljs$core$IFn$_invoke$arity$2(atom_domain_deftype_instance,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs_thread.eve.shared_atom.mem_window.cljs$core$IFn$_invoke$arity$2 = (function (atom_domain_deftype_instance,opts){
var s_atom_env_map = cljs_thread.eve.shared_atom.get_env(atom_domain_deftype_instance);
var map__23673 = s_atom_env_map;
var map__23673__$1 = cljs.core.__destructure_map(map__23673);
var sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23673__$1,new cljs.core.Keyword(null,"sab","sab",422570093));
var index_view = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23673__$1,new cljs.core.Keyword(null,"index-view","index-view",978697547));
var data_view = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23673__$1,new cljs.core.Keyword(null,"data-view","data-view",2142900612));
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23673__$1,new cljs.core.Keyword(null,"config","config",994861415));
if((((sab == null)) || ((((index_view == null)) || ((((data_view == null)) || ((config == null)))))))){
throw (new Error("mem-window: s-atom-env components are nil."));
} else {
}

var map__23675 = config;
var map__23675__$1 = cljs.core.__destructure_map(map__23675);
var sab_total_size_bytes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23675__$1,new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283));
var max_block_descriptors = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23675__$1,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111));
var index_region_size = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23675__$1,new cljs.core.Keyword(null,"index-region-size","index-region-size",854075727));
var data_region_start_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23675__$1,new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696));
var map__23676 = opts;
var map__23676__$1 = cljs.core.__destructure_map(map__23676);
var max_descriptors_to_show = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"max-descriptors-to-show","max-descriptors-to-show",-2011268916),(32));
var max_view_lines = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"max-view-lines","max-view-lines",-1883802703),(12));
var chars_per_line = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"chars-per-line","chars-per-line",1678793336),(32));
var show_legend_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"show-legend?","show-legend?",-1266051409),false);
var descriptors_per_table_row = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"descriptors-per-table-row","descriptors-per-table-row",-184200764),(16));
var focus_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23676__$1,new cljs.core.Keyword(null,"focus-offset","focus-offset",2058579811),null);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["--- Atom Memory Window (SAB Size: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sab_total_size_bytes),", MaxDesc: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_block_descriptors),") ---"].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["IndexRegionSz: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(index_region_size),", DataRegionStart: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_region_start_offset)].join('')], 0));

if((atom_domain_deftype_instance instanceof cljs_thread.eve.shared_atom.AtomDomain)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["AtomDomain Root Ptr (data block desc_idx): ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(Atomics.load(index_view,((16) / (4))))].join('')], 0));
} else {
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["--- Block Descriptors ---"], 0));

if((max_descriptors_to_show > (0))){
var current_idx_25266 = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"start-descriptor","start-descriptor",183859015).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})();
while(true){
if((current_idx_25266 < (function (){var x__5133__auto__ = ((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"start-descriptor","start-descriptor",183859015).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})() + max_descriptors_to_show);
var y__5134__auto__ = max_block_descriptors;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())){
cljs_thread.eve.util.print_descriptor_table(index_view,current_idx_25266,descriptors_per_table_row,(function (){var x__5133__auto__ = ((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"start-descriptor","start-descriptor",183859015).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})() + max_descriptors_to_show);
var y__5134__auto__ = max_block_descriptors;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})());

var G__25270 = (current_idx_25266 + descriptors_per_table_row);
current_idx_25266 = G__25270;
continue;
} else {
}
break;
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  (No descriptors requested to be shown)"], 0));
}

var data_region_actual_size_25271 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = (sab_total_size_bytes - data_region_start_offset);
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var max_display_bytes_25272 = (max_view_lines * chars_per_line);
var max_addr_to_display_25273 = ((data_region_start_offset + (function (){var x__5133__auto__ = data_region_actual_size_25271;
var y__5134__auto__ = max_display_bytes_25272;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})()) + (-1));
var target_addr_hex_len_25274 = (function (){var x__5130__auto__ = (6);
var y__5131__auto__ = cljs.core.count(max_addr_to_display_25273.toString((16)));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var model_char_map_full_str_25275 = cljs_thread.eve.util.generate_model_char_map_str(index_view,config,data_region_actual_size_25271);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["Model Char View (Data Region, ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(chars_per_line)," chars/line): #=alloc +=cont _=free .=unused/zeroed"].join('')], 0));

if((data_region_actual_size_25271 > (0))){
var line_idx_25276 = (0);
var current_char_map_offset_25277 = (0);
while(true){
if((((line_idx_25276 < max_view_lines)) && ((current_char_map_offset_25277 < cljs.core.count(model_char_map_full_str_25275))))){
var chars_on_this_line_25281 = (function (){var x__5133__auto__ = chars_per_line;
var y__5134__auto__ = (cljs.core.count(model_char_map_full_str_25275) - current_char_map_offset_25277);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var line_abs_sab_offset_25282 = (data_region_start_offset + current_char_map_offset_25277);
var hex_addr_raw_25283 = line_abs_sab_offset_25282.toString((16));
var addr_padding_needed_25284 = (function (){var x__5130__auto__ = (0);
var y__5131__auto__ = (target_addr_hex_len_25274 - cljs.core.count(hex_addr_raw_25283));
return ((x__5130__auto__ > y__5131__auto__) ? x__5130__auto__ : y__5131__auto__);
})();
var address_str_25285 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(addr_padding_needed_25284,"0"))),cljs.core.str.cljs$core$IFn$_invoke$arity$1(hex_addr_raw_25283),": "].join('');
var is_focused_line_QMARK__25286 = (function (){var and__5043__auto__ = focus_offset;
if(cljs.core.truth_(and__5043__auto__)){
return (((focus_offset >= line_abs_sab_offset_25282)) && ((focus_offset < (line_abs_sab_offset_25282 + chars_per_line))));
} else {
return and__5043__auto__;
}
})();
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([[(cljs.core.truth_(is_focused_line_QMARK__25286)?">> ":"   "),cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.util.format_char_data_line(address_str_25285,model_char_map_full_str_25275,current_char_map_offset_25277,chars_on_this_line_25281,chars_per_line))].join('')], 0));

var G__25287 = (line_idx_25276 + (1));
var G__25288 = (current_char_map_offset_25277 + chars_per_line);
line_idx_25276 = G__25287;
current_char_map_offset_25277 = G__25288;
continue;
} else {
}
break;
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Data Region is empty or invalid for Model Char View."], 0));
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["Raw Data (Enhanced Char View, ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(chars_per_line)," bytes/line):"].join('')], 0));

if((data_region_actual_size_25271 > (0))){
cljs_thread.eve.util.hex_window.cljs$core$IFn$_invoke$arity$variadic(sab,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"offset","offset",296498311),data_region_start_offset,new cljs.core.Keyword(null,"length","length",588987862),(function (){var x__5133__auto__ = data_region_actual_size_25271;
var y__5134__auto__ = (max_view_lines * chars_per_line);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})(),new cljs.core.Keyword(null,"bytes-per-row","bytes-per-row",-145207552),chars_per_line,new cljs.core.Keyword(null,"show-legend?","show-legend?",-1266051409),show_legend_QMARK_], null)], 0));
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Data Region is empty or invalid for Raw Data View."], 0));
}

var value_data_block_desc_idx_to_decode_25293 = (((atom_domain_deftype_instance instanceof cljs_thread.eve.shared_atom.AtomDomain))?Atomics.load(index_view,((16) / (4))):(((atom_domain_deftype_instance instanceof cljs_thread.eve.shared_atom.SharedAtom))?(function (){var hdr_desc_idx = atom_domain_deftype_instance.header_descriptor_idx;
var ptr_field_offset = (cljs_thread.eve.util.get_block_descriptor_base_int32_offset(hdr_desc_idx) + ((16) / (4)));
return Atomics.load(index_view,ptr_field_offset);
})():(-1)
));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value_data_block_desc_idx_to_decode_25293,(-1))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["Decode of Atom's Value (from data_block_desc_idx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_data_block_desc_idx_to_decode_25293),")"].join('')], 0));

var data_block_status_25303 = cljs_thread.eve.util.read_block_descriptor_field(index_view,value_data_block_desc_idx_to_decode_25293,(0));
var data_offset_25304 = cljs_thread.eve.util.read_block_descriptor_field(index_view,value_data_block_desc_idx_to_decode_25293,(4));
var data_length_25305 = cljs_thread.eve.util.read_block_descriptor_field(index_view,value_data_block_desc_idx_to_decode_25293,(8));
if((((((data_block_status_25303 === (1))) || ((data_block_status_25303 === (3))))) && ((((data_length_25305 >= (0))) && (((data_offset_25304 + data_length_25305) <= sab_total_size_bytes)))))){
var block_data_segment_25315 = (((data_length_25305 > (0)))?(new Uint8Array(sab,data_offset_25304,data_length_25305)):(new Uint8Array((0))));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["  Raw Hex (first 32 bytes): ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.util.format_bytes_as_hex(block_data_segment_25315,(32)))].join('')], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  Decoded:",(function (){try{return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var G__23699 = block_data_segment_25315;
var G__23700 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"s-atom-env","s-atom-env",856967368),s_atom_env_map], null);
return (cljs_thread.eve.shared_atom.default_deserializer.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.shared_atom.default_deserializer.cljs$core$IFn$_invoke$arity$2(G__23699,G__23700) : cljs_thread.eve.shared_atom.default_deserializer.call(null, G__23699,G__23700));
})()], 0));
}catch (e23698){var e = e23698;
return ["ERROR Deserializing: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e)].join('');
}})()], 0));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(data_block_status_25303,(3))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  (Note: Decoded an EMBEDDED_ATOM_HEADER's value pointer field)"], 0));
} else {
}
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["Atom's value data block (desc_idx: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_data_block_desc_idx_to_decode_25293),") invalid/empty. Status: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_block_status_25303),", Length: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(data_length_25305)].join('')], 0));
}
} else {
}

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_data_block_desc_idx_to_decode_25293,(-1))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Atom's value is nil (pointer is NIL_SENTINEL)."], 0));
} else {
}

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["--- End Atom Memory Window ---"], 0));
}));

(cljs_thread.eve.shared_atom.mem_window.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=cljs_thread.eve.shared_atom.js.map
