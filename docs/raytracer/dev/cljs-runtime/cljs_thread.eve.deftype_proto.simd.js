goog.provide('cljs_thread.eve.deftype_proto.simd');
cljs_thread.eve.deftype_proto.simd.wasm_bytes = (new Uint8Array([(0),(97),(115),(109),(1),(0),(0),(0),(1),(15),(3),(96),(1),(127),(1),(127),(96),(3),(127),(127),(127),(1),(127),(96),(3),(127),(127),(127),(0),(3),(4),(3),(0),(1),(2),(5),(3),(1),(0),(1),(7),(29),(4),(3),(109),(101),(109),(2),(0),(7),(112),(111),(112),(99),(110),(116),(51),(50),(0),(0),(6),(109),(101),(109),(99),(109),(112),(0),(1),(6),(109),(101),(109),(99),(112),(121),(0),(2),(10),(59),(3),(4),(0),(32),(0),(105),(11),(28),(1),(1),(127),(65),(0),(33),(3),(2),(64),(3),(64),(32),(3),(32),(2),(77),(13),(1),(32),(0),(32),(3),(106),(45),(0),(0),(32),(1),(32),(3),(106),(45),(0),(0),(71),(4),(64),(65),(1),(15),(11),(32),(3),(65),(1),(106),(33),(3),(12),(0),(11),(11),(65),(0),(11),(22),(1),(1),(127),(65),(0),(33),(3),(2),(64),(3),(64),(32),(3),(32),(2),(77),(13),(1),(32),(0),(32),(3),(106),(32),(1),(32),(3),(106),(45),(0),(0),(58),(0),(0),(32),(3),(65),(1),(106),(33),(3),(12),(0),(11),(11),(11)]));
cljs_thread.eve.deftype_proto.simd.wasm_instance = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs_thread.eve.deftype_proto.simd.wasm_memory = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs_thread.eve.deftype_proto.simd.init_wasm_BANG_ = (function cljs_thread$eve$deftype_proto$simd$init_wasm_BANG_(){
if((cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_instance) == null)){
try{var module__$1 = (new WebAssembly.Module(cljs_thread.eve.deftype_proto.simd.wasm_bytes));
var instance = (new WebAssembly.Instance(module__$1));
cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.simd.wasm_instance,instance);

cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.simd.wasm_memory,instance.exports.mem);

return true;
}catch (e23028){var _ = e23028;
return false;
}} else {
return null;
}
});
cljs_thread.eve.deftype_proto.simd.init_wasm_BANG_();
cljs_thread.eve.deftype_proto.simd.js_popcount32 = (function cljs_thread$eve$deftype_proto$simd$js_popcount32(n){
var n__$1 = (n - ((n >>> (1)) & (1431655765)));
var n__$2 = ((n__$1 & (858993459)) + ((n__$1 >>> (2)) & (858993459)));
var n__$3 = ((n__$2 + (n__$2 >>> (4))) & (252645135));
var n__$4 = (n__$3 + (n__$3 >>> (8)));
var n__$5 = (n__$4 + (n__$4 >>> (16)));
return (n__$5 & (63));
});
/**
 * Compare two Uint8Arrays. Returns 0 if equal, non-zero otherwise.
 */
cljs_thread.eve.deftype_proto.simd.js_memcmp = (function cljs_thread$eve$deftype_proto$simd$js_memcmp(a,b){
var len_a = a.length;
var len_b = b.length;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len_a,len_b)){
return (1);
} else {
var i = (0);
while(true){
if((i >= len_a)){
return (0);
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((a[i]),(b[i]))){
return (1);
} else {
var G__23073 = (i + (1));
i = G__23073;
continue;
}
}
break;
}
}
});
/**
 * Check if two byte arrays are equal.
 * Benchmark-optimized: simple loop for <128 bytes, 32-bit for larger.
 * DataView creation overhead makes 32-bit slower for small arrays.
 */
cljs_thread.eve.deftype_proto.simd.js_bytes_equal_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$js_bytes_equal_QMARK_(a,b){
var len_a = a.length;
var len_b = b.length;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len_a,len_b)){
return false;
} else {
if((len_a < (128))){
var i = (0);
while(true){
if((i >= len_a)){
return true;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((a[i]),(b[i]))){
return false;
} else {
var G__23074 = (i + (1));
i = G__23074;
continue;
}
}
break;
}
} else {
var dv_a = (new DataView(a.buffer,a.byteOffset,len_a));
var dv_b = (new DataView(b.buffer,b.byteOffset,len_b));
var full_words = (len_a >>> (2));
var i = (0);
while(true){
if((i >= full_words)){
var j = (full_words * (4));
while(true){
if((j >= len_a)){
return true;
} else {
if(((a[j]) === (b[j]))){
var G__23075 = (j + (1));
j = G__23075;
continue;
} else {
return false;
}
}
break;
}
} else {
var off = (i * (4));
if((dv_a.getUint32(off,true) === dv_b.getUint32(off,true))){
var G__23076 = (i + (1));
i = G__23076;
continue;
} else {
return false;
}
}
break;
}
}
}
});
cljs_thread.eve.deftype_proto.simd._wasm_popcount32 = (function cljs_thread$eve$deftype_proto$simd$_wasm_popcount32(n){
var temp__5821__auto__ = cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_instance);
if(cljs.core.truth_(temp__5821__auto__)){
var inst = temp__5821__auto__;
return inst.exports.popcnt32(n);
} else {
return cljs_thread.eve.deftype_proto.simd.js_popcount32(n);
}
});
/**
 * Compare two Uint8Arrays using WASM memory.
 */
cljs_thread.eve.deftype_proto.simd.wasm_memcmp = (function cljs_thread$eve$deftype_proto$simd$wasm_memcmp(a,b){
var temp__5821__auto__ = cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_instance);
if(cljs.core.truth_(temp__5821__auto__)){
var inst = temp__5821__auto__;
var len_a = a.length;
var len_b = b.length;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len_a,len_b)){
return (1);
} else {
if((len_a === (0))){
return (0);
} else {
var mem = cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_memory);
var mem_buffer = mem.buffer;
var u8 = (new Uint8Array(mem_buffer));
u8.set(a,(0));

u8.set(b,len_a);

return inst.exports.memcmp((0),len_a,len_a);
}
}
} else {
return cljs_thread.eve.deftype_proto.simd.js_memcmp(a,b);
}
});
/**
 * Check if two byte arrays are equal using WASM.
 */
cljs_thread.eve.deftype_proto.simd._wasm_bytes_equal_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$_wasm_bytes_equal_QMARK_(a,b){
return (cljs_thread.eve.deftype_proto.simd.wasm_memcmp(a,b) === (0));
});
/**
 * True if WASM acceleration is available.
 */
cljs_thread.eve.deftype_proto.simd.wasm_available_QMARK_ = (!((cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_instance) == null)));
/**
 * Count set bits in a 32-bit integer.
 * Uses optimized pure JS implementation (WASM overhead not worth it for single i32).
 */
cljs_thread.eve.deftype_proto.simd.popcount32 = (function cljs_thread$eve$deftype_proto$simd$popcount32(n){
return cljs_thread.eve.deftype_proto.simd.js_popcount32(n);
});
/**
 * Compare two Uint8Arrays. Returns 0 if equal, non-zero otherwise.
 * Uses WASM memory operations when available.
 */
cljs_thread.eve.deftype_proto.simd.memcmp = (function cljs_thread$eve$deftype_proto$simd$memcmp(a,b){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.eve.deftype_proto.simd.wasm_instance))){
return cljs_thread.eve.deftype_proto.simd.wasm_memcmp(a,b);
} else {
return cljs_thread.eve.deftype_proto.simd.js_memcmp(a,b);
}
});
/**
 * Fast binary comparison of two byte arrays.
 * Uses optimized pure JS (WASM copy overhead negates benefits).
 */
cljs_thread.eve.deftype_proto.simd.bytes_equal_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$bytes_equal_QMARK_(a,b){
return cljs_thread.eve.deftype_proto.simd.js_bytes_equal_QMARK_(a,b);
});
/**
 * Compare bytes directly from SharedArrayBuffer.
 * Benchmark: faster for <64 bytes (avoids Uint8Array allocation),
 * but for larger sizes, extract+compare is faster.
 */
cljs_thread.eve.deftype_proto.simd.sab_bytes_equal_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$sab_bytes_equal_QMARK_(sab,offset1,len1,offset2,len2){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len1,len2)){
return false;
} else {
if((len1 === (0))){
return true;
} else {
if((len1 < (64))){
var u8 = (new Uint8Array(sab));
var i = (0);
while(true){
if((i >= len1)){
return true;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((u8[(offset1 + i)]),(u8[(offset2 + i)]))){
return false;
} else {
var G__23081 = (i + (1));
i = G__23081;
continue;
}
}
break;
}
} else {
var a = (new Uint8Array(sab,offset1,len1));
var b = (new Uint8Array(sab,offset2,len2));
return cljs_thread.eve.deftype_proto.simd.js_bytes_equal_QMARK_(a,b);
}
}
}
});
/**
 * Compare bytes from two SAB regions.
 * Returns 0 if equal, non-zero otherwise.
 */
cljs_thread.eve.deftype_proto.simd.sab_memcmp = (function cljs_thread$eve$deftype_proto$simd$sab_memcmp(sab,offset1,len1,offset2,len2){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len1,len2)){
return (1);
} else {
if((len1 === (0))){
return (0);
} else {
var u8 = (new Uint8Array(sab));
var i = (0);
while(true){
if((i >= len1)){
return (0);
} else {
var b1 = (u8[(offset1 + i)]);
var b2 = (u8[(offset2 + i)]);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(b1,b2)){
if((b1 < b2)){
return (-1);
} else {
return (1);
}
} else {
var G__23085 = (i + (1));
i = G__23085;
continue;
}
}
break;
}
}
}
});
/**
 * Count set bits in multiple 32-bit integers.
 * Returns array of counts. More efficient than individual calls for n >= 8.
 */
cljs_thread.eve.deftype_proto.simd.batch_popcount32 = (function cljs_thread$eve$deftype_proto$simd$batch_popcount32(int32_array){
var n = int32_array.length;
var result = (new Uint8Array(n));
var n__5636__auto___23087 = n;
var i_23088 = (0);
while(true){
if((i_23088 < n__5636__auto___23087)){
(result[i_23088] = cljs_thread.eve.deftype_proto.simd.js_popcount32((int32_array[i_23088])));

var G__23089 = (i_23088 + (1));
i_23088 = G__23089;
continue;
} else {
}
break;
}

return result;
});
/**
 * Compare target against multiple candidates.
 * Returns index of first match, or -1 if none.
 * 
 * candidates: array of Uint8Arrays to compare against target
 * 
 * This batched approach enables future SIMD optimization:
 * - Load 16 bytes of target once
 * - Compare against 16 bytes of each candidate in parallel
 * - Use SIMD mask to find matches
 */
cljs_thread.eve.deftype_proto.simd.batch_bytes_equal_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$batch_bytes_equal_QMARK_(target,candidates){
var target_len = target.length;
var n = candidates.length;
var i = (0);
while(true){
if((i >= n)){
return (-1);
} else {
var candidate = (candidates[i]);
if((((candidate.length === target_len)) && (cljs_thread.eve.deftype_proto.simd.js_bytes_equal_QMARK_(target,candidate)))){
return i;
} else {
var G__23090 = (i + (1));
i = G__23090;
continue;
}
}
break;
}
});
/**
 * Find which hash matches target in a batch.
 * Returns index of match or -1.
 * 
 * Optimized for collision node search where we have
 * multiple entries with the same prefix hash.
 */
cljs_thread.eve.deftype_proto.simd.batch_hash_lookup = (function cljs_thread$eve$deftype_proto$simd$batch_hash_lookup(target_hash,hash_array){
var n = hash_array.length;
var i = (0);
while(true){
if((i >= n)){
return (-1);
} else {
if((target_hash === (hash_array[i]))){
return i;
} else {
var G__23091 = (i + (1));
i = G__23091;
continue;
}
}
break;
}
});
cljs_thread.eve.deftype_proto.simd.SIMD_ALIGN = (16);
/**
 * Round up to next SIMD-friendly alignment boundary.
 */
cljs_thread.eve.deftype_proto.simd.align_up = (function cljs_thread$eve$deftype_proto$simd$align_up(n){
return ((n + ((16) - (1))) & (~ ((16) - (1))));
});
/**
 * Check if offset is SIMD-aligned.
 */
cljs_thread.eve.deftype_proto.simd.is_aligned_QMARK_ = (function cljs_thread$eve$deftype_proto$simd$is_aligned_QMARK_(offset){
return ((offset & ((16) - (1))) === (0));
});

//# sourceMappingURL=cljs_thread.eve.deftype_proto.simd.js.map
