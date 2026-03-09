goog.provide('cljs_thread.eve.deftype_proto.alloc');
cljs_thread.eve.deftype_proto.alloc.CLASS_BITS = (3);
cljs_thread.eve.deftype_proto.alloc.BLOCK_IDX_BITS = (29);
cljs_thread.eve.deftype_proto.alloc.BLOCK_IDX_MASK = (((1) << (29)) - (1));
cljs_thread.eve.deftype_proto.alloc.OVERFLOW_CLASS_IDX = (6);
cljs_thread.eve.deftype_proto.alloc.SENTINEL_CLASS_IDX = (7);
cljs_thread.eve.deftype_proto.alloc.NIL_OFFSET = (-1);
/**
 * Encode a slab class index and block index into a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.encode_slab_offset = (function cljs_thread$eve$deftype_proto$alloc$encode_slab_offset(class_idx,block_idx){
return ((class_idx << (29)) | (block_idx & cljs_thread.eve.deftype_proto.alloc.BLOCK_IDX_MASK));
});
/**
 * Extract the slab class index from a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.decode_class_idx = (function cljs_thread$eve$deftype_proto$alloc$decode_class_idx(slab_offset){
return (slab_offset >>> (29));
});
/**
 * Extract the block index from a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.decode_block_idx = (function cljs_thread$eve$deftype_proto$alloc$decode_block_idx(slab_offset){
return (slab_offset & cljs_thread.eve.deftype_proto.alloc.BLOCK_IDX_MASK);
});
cljs_thread.eve.deftype_proto.alloc.slab_data_offsets = [(0),(0),(0),(0),(0),(0),(0)];
cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets = [(0),(0),(0),(0),(0),(0),(0)];
cljs_thread.eve.deftype_proto.alloc.slab_total_blocks = [(0),(0),(0),(0),(0),(0),(0)];
/**
 * Convert a slab-qualified offset to the actual byte offset within the slab's SAB.
 * Returns the byte offset in the slab's data region.
 */
cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset = (function cljs_thread$eve$deftype_proto$alloc$slab_offset__GT_byte_offset(slab_offset){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_offset);
var block_size = (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
return ((cljs_thread.eve.deftype_proto.alloc.slab_data_offsets[class_idx]) + (block_idx * block_size));
});
cljs_thread.eve.deftype_proto.alloc.legacy_env = null;
cljs_thread.eve.deftype_proto.alloc.overflow_desc_map = (new Map());
/**
 * Store the legacy eve.atom s-atom-env for overflow allocation.
 * Call once after both slab system and legacy atom are initialized.
 */
cljs_thread.eve.deftype_proto.alloc.register_legacy_env_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$register_legacy_env_BANG_(s_atom_env){
(cljs_thread.eve.deftype_proto.alloc.legacy_env = s_atom_env);

var temp__5823__auto__ = (function (){var G__23745 = s_atom_env;
if((G__23745 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(G__23745);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var sab = temp__5823__auto__;
return cljs_thread.eve.deftype_proto.wasm.register_overflow_instance_BANG_(sab);
} else {
return null;
}
});
/**
 * Lazily acquire legacy env from *global-atom-instance* if not set.
 */
cljs_thread.eve.deftype_proto.alloc.ensure_legacy_env_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$ensure_legacy_env_BANG_(){
if(cljs.core.truth_(cljs_thread.eve.deftype_proto.alloc.legacy_env)){
} else {
var temp__5823__auto___24259 = cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
if(cljs.core.truth_(temp__5823__auto___24259)){
var inst_24261 = temp__5823__auto___24259;
cljs_thread.eve.deftype_proto.alloc.register_legacy_env_BANG_(cljs_thread.eve.shared_atom.get_env(inst_24261));
} else {
}
}

return cljs_thread.eve.deftype_proto.alloc.legacy_env;
});
/**
 * Initialize a single slab for a given class index.
 * Creates the WebAssembly.Memory, formats the bitmap, and registers with WASM.
 * Returns a Promise that resolves when the slab is ready.
 */
cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$init_slab_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___24269 = arguments.length;
var i__5770__auto___24271 = (0);
while(true){
if((i__5770__auto___24271 < len__5769__auto___24269)){
args__5775__auto__.push((arguments[i__5770__auto___24271]));

var G__24273 = (i__5770__auto___24271 + (1));
i__5770__auto___24271 = G__24273;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (class_idx,p__23754){
var map__23757 = p__23754;
var map__23757__$1 = cljs.core.__destructure_map(map__23757);
var capacity = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23757__$1,new cljs.core.Keyword(null,"capacity","capacity",72689734),cljs_thread.eve.deftype_proto.data.DEFAULT_SLAB_CAPACITY);
var block_size = (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
var layout = cljs_thread.eve.deftype_proto.data.slab_layout(block_size,capacity);
var map__23761 = layout;
var map__23761__$1 = cljs.core.__destructure_map(map__23761);
var total_bytes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23761__$1,new cljs.core.Keyword(null,"total-bytes","total-bytes",1693967112));
var bitmap_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23761__$1,new cljs.core.Keyword(null,"bitmap-offset","bitmap-offset",-54089933));
var bitmap_size = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23761__$1,new cljs.core.Keyword(null,"bitmap-size","bitmap-size",-730951825));
var data_offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23761__$1,new cljs.core.Keyword(null,"data-offset","data-offset",-712338495));
var total_blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23761__$1,new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763));
var wasm_memory = cljs_thread.eve.deftype_proto.wasm.create_slab_memory(total_bytes);
var sab = (((wasm_memory instanceof SharedArrayBuffer))?wasm_memory:wasm_memory.buffer);
var i32_view = (new Int32Array(sab));
var u8_view = (new Uint8Array(sab));
Atomics.store(i32_view,((0) / (4)),(1397506370));

Atomics.store(i32_view,((4) / (4)),block_size);

Atomics.store(i32_view,((8) / (4)),total_blocks);

Atomics.store(i32_view,((12) / (4)),total_blocks);

Atomics.store(i32_view,((16) / (4)),(0));

Atomics.store(i32_view,((20) / (4)),class_idx);

Atomics.store(i32_view,((24) / (4)),bitmap_offset);

Atomics.store(i32_view,((28) / (4)),data_offset);

u8_view.fill((0),bitmap_offset,(bitmap_offset + bitmap_size));

(cljs_thread.eve.deftype_proto.alloc.slab_data_offsets[class_idx] = data_offset);

(cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets[class_idx] = bitmap_offset);

(cljs_thread.eve.deftype_proto.alloc.slab_total_blocks[class_idx] = total_blocks);

return cljs_thread.eve.deftype_proto.wasm.init_slab_instance_BANG_(class_idx,wasm_memory);
}));

(cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$lang$applyTo = (function (seq23751){
var G__23752 = cljs.core.first(seq23751);
var seq23751__$1 = cljs.core.next(seq23751);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__23752,seq23751__$1);
}));

/**
 * Initialize all 6 slab classes.  Slab memory + typed-array views are
 * created synchronously so the JS-fallback bitmap operations work
 * immediately.  WASM compilation/instantiation happens in the background;
 * a Promise is returned that resolves when all WASM upgrades are done
 * (callers are free to ignore it).
 * Options per class can be passed as a map: {0 {:capacity 2097152} ...}
 */
cljs_thread.eve.deftype_proto.alloc.init_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$init_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___24294 = arguments.length;
var i__5770__auto___24295 = (0);
while(true){
if((i__5770__auto___24295 < len__5769__auto___24294)){
args__5775__auto__.push((arguments[i__5770__auto___24295]));

var G__24296 = (i__5770__auto___24295 + (1));
i__5770__auto___24295 = G__24296;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.eve.deftype_proto.alloc.init_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.eve.deftype_proto.alloc.init_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__23808){
var map__23811 = p__23808;
var map__23811__$1 = cljs.core.__destructure_map(map__23811);
var capacities = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__23811__$1,new cljs.core.Keyword(null,"capacities","capacities",-1666536173),cljs.core.PersistentArrayMap.EMPTY);
var slab_promises = cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((function (){var iter__5523__auto__ = (function cljs_thread$eve$deftype_proto$alloc$iter__23815(s__23816){
return (new cljs.core.LazySeq(null,(function (){
var s__23816__$1 = s__23816;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__23816__$1);
if(temp__5823__auto__){
var s__23816__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__23816__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__23816__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__23818 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__23817 = (0);
while(true){
if((i__23817 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__23817);
cljs.core.chunk_append(b__23818,(function (){var cap = cljs.core.get.cljs$core$IFn$_invoke$arity$3(capacities,i,cljs_thread.eve.deftype_proto.data.DEFAULT_SLAB_CAPACITY);
return cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$core$IFn$_invoke$arity$variadic(i,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"capacity","capacity",72689734),cap], 0));
})());

var G__24309 = (i__23817 + (1));
i__23817 = G__24309;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__23818),cljs_thread$eve$deftype_proto$alloc$iter__23815(cljs.core.chunk_rest(s__23816__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__23818),null);
}
} else {
var i = cljs.core.first(s__23816__$2);
return cljs.core.cons((function (){var cap = cljs.core.get.cljs$core$IFn$_invoke$arity$3(capacities,i,cljs_thread.eve.deftype_proto.data.DEFAULT_SLAB_CAPACITY);
return cljs_thread.eve.deftype_proto.alloc.init_slab_BANG_.cljs$core$IFn$_invoke$arity$variadic(i,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"capacity","capacity",72689734),cap], 0));
})(),cljs_thread$eve$deftype_proto$alloc$iter__23815(cljs.core.rest(s__23816__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((6)));
})());
return Promise.all(slab_promises);
}));

(cljs_thread.eve.deftype_proto.alloc.init_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.eve.deftype_proto.alloc.init_BANG_.cljs$lang$applyTo = (function (seq23793){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq23793));
}));

if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.alloc !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.alloc.root_sab !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.alloc.root_sab = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.deftype_proto !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.alloc !== 'undefined') && (typeof cljs_thread.eve.deftype_proto.alloc.root_i32 !== 'undefined')){
} else {
cljs_thread.eve.deftype_proto.alloc.root_i32 = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Create the root/control SharedArrayBuffer.
 * Stores atom root pointer, epoch, worker registry.
 */
cljs_thread.eve.deftype_proto.alloc.init_root_sab_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$init_root_sab_BANG_(){
var sab = (new SharedArrayBuffer(cljs_thread.eve.deftype_proto.data.ROOT_SAB_SIZE));
var i32 = (new Int32Array(sab));
Atomics.store(i32,((0) / (4)),(1380929364));

Atomics.store(i32,((4) / (4)),(-1));

Atomics.store(i32,((8) / (4)),(1));

Atomics.store(i32,((12) / (4)),cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START);

var n__5636__auto___24347 = (256);
var slot_idx_24349 = (0);
while(true){
if((slot_idx_24349 < n__5636__auto___24347)){
var slot_byte_offset_24353 = (cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx_24349 * (24)));
Atomics.store(i32,(slot_byte_offset_24353 / (4)),(0));

var G__24356 = (slot_idx_24349 + (1));
slot_idx_24349 = G__24356;
continue;
} else {
}
break;
}

cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.alloc.root_sab,sab);

cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.alloc.root_i32,i32);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"root-sab","root-sab",-932837436),sab,new cljs.core.Keyword(null,"root-i32","root-i32",-1308322928),i32], null);
});
/**
 * Register an existing root SAB (created by main thread) on a worker.
 * Reads the already-initialized control plane.
 */
cljs_thread.eve.deftype_proto.alloc.init_root_sab_from_existing_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$init_root_sab_from_existing_BANG_(sab){
var i32 = (new Int32Array(sab));
cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.alloc.root_sab,sab);

cljs.core.reset_BANG_(cljs_thread.eve.deftype_proto.alloc.root_i32,i32);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"root-sab","root-sab",-932837436),sab,new cljs.core.Keyword(null,"root-i32","root-i32",-1308322928),i32], null);
});
/**
 * Get the root SAB for sharing with workers.
 */
cljs_thread.eve.deftype_proto.alloc.get_root_sab = (function cljs_thread$eve$deftype_proto$alloc$get_root_sab(){
return cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_sab);
});
/**
 * Extract all 6 slab SharedArrayBuffers for passing to workers.
 * Returns a JS array [sab0 sab1 sab2 sab3 sab4 sab5].
 */
cljs_thread.eve.deftype_proto.alloc.get_all_slab_sabs = (function cljs_thread$eve$deftype_proto$alloc$get_all_slab_sabs(){
var sabs = [];
var n__5636__auto___24385 = (6);
var i_24387 = (0);
while(true){
if((i_24387 < n__5636__auto___24385)){
sabs.push(cljs_thread.eve.deftype_proto.wasm.slab_buffer(i_24387));

var G__24389 = (i_24387 + (1));
i_24387 = G__24389;
continue;
} else {
}
break;
}

return sabs;
});
/**
 * Read a slab's header and populate the module-level caches.
 * Used by workers to restore slab layout info from an existing SAB.
 */
cljs_thread.eve.deftype_proto.alloc.populate_slab_caches_from_header_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$populate_slab_caches_from_header_BANG_(class_idx,sab){
var i32 = (new Int32Array(sab));
var data_offset = Atomics.load(i32,((28) / (4)));
var bitmap_offset = Atomics.load(i32,((24) / (4)));
var total_blocks = Atomics.load(i32,((8) / (4)));
(cljs_thread.eve.deftype_proto.alloc.slab_data_offsets[class_idx] = data_offset);

(cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets[class_idx] = bitmap_offset);

return (cljs_thread.eve.deftype_proto.alloc.slab_total_blocks[class_idx] = total_blocks);
});
/**
 * Initialize the slab system on a worker from existing SABs.
 * Registers each slab instance (with JS fallback bitmap ops),
 * populates layout caches from headers, and registers the root SAB.
 * slab-sabs can be a JS array or Clojure vector of SharedArrayBuffers.
 * Call this from worker initialization when slab SABs are available.
 */
cljs_thread.eve.deftype_proto.alloc.init_worker_slabs_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$init_worker_slabs_BANG_(slab_sabs,root_sab_arg,legacy_sab){
var n__5636__auto___24419 = (6);
var i_24421 = (0);
while(true){
if((i_24421 < n__5636__auto___24419)){
var sab_24426 = ((cljs.core.array_QMARK_(slab_sabs))?(slab_sabs[i_24421]):cljs.core.nth.cljs$core$IFn$_invoke$arity$2(slab_sabs,i_24421));
cljs_thread.eve.deftype_proto.wasm.register_slab_instance_from_sab_BANG_(i_24421,sab_24426);

cljs_thread.eve.deftype_proto.alloc.populate_slab_caches_from_header_BANG_(i_24421,sab_24426);

var G__24432 = (i_24421 + (1));
i_24421 = G__24432;
continue;
} else {
}
break;
}

if(cljs.core.truth_(legacy_sab)){
cljs_thread.eve.deftype_proto.wasm.register_overflow_instance_BANG_(legacy_sab);
} else {
}

return cljs_thread.eve.deftype_proto.alloc.init_root_sab_from_existing_BANG_(root_sab_arg);
});
/**
 * Allocate a block of at least `size-bytes`.
 * Routes to the appropriate slab class, scans bitmap for a free block,
 * CAS-claims it, and returns a slab-qualified offset.
 * Returns {:offset <slab-offset> :class-idx <n> :block-idx <n>} or {:error ...}.
 */
cljs_thread.eve.deftype_proto.alloc.alloc = (function cljs_thread$eve$deftype_proto$alloc$alloc(size_bytes){
var class_idx = cljs_thread.eve.deftype_proto.data.size__GT_class_idx(size_bytes);
if((class_idx === (-1))){
var temp__5821__auto__ = cljs_thread.eve.deftype_proto.alloc.ensure_legacy_env_BANG_();
if(cljs.core.truth_(temp__5821__auto__)){
var env = temp__5821__auto__;
var result = cljs_thread.eve.shared_atom.alloc(env,size_bytes);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"overflow-oom","overflow-oom",829416319),new cljs.core.Keyword(null,"size","size",1098693007),size_bytes], null);
} else {
var byte_off = new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(result);
var desc_idx = new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(result);
var slab_offset = cljs_thread.eve.deftype_proto.alloc.encode_slab_offset((6),byte_off);
cljs_thread.eve.deftype_proto.alloc.overflow_desc_map.set(byte_off,desc_idx);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"offset","offset",296498311),slab_offset,new cljs.core.Keyword(null,"class-idx","class-idx",145738667),(6),new cljs.core.Keyword(null,"block-idx","block-idx",1149295564),byte_off], null);
}
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"overflow-no-legacy-env","overflow-no-legacy-env",-143357979),new cljs.core.Keyword(null,"size","size",1098693007),size_bytes], null);
}
} else {
var bm_offset = (cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets[class_idx]);
var total_bits = (cljs_thread.eve.deftype_proto.alloc.slab_total_blocks[class_idx]);
var inst = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx);
var i32_view = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst);
var cursor = Atomics.load(i32_view,((16) / (4)));
var start_bit = cursor;
var wrapped_QMARK_ = false;
while(true){
var candidate = cljs_thread.eve.deftype_proto.wasm.bitmap_find_free(class_idx,bm_offset,total_bits,start_bit);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(candidate,(-1))){
if(cljs_thread.eve.deftype_proto.wasm.bitmap_alloc_cas_BANG_(class_idx,bm_offset,candidate)){
var slab_offset = cljs_thread.eve.deftype_proto.alloc.encode_slab_offset(class_idx,candidate);
Atomics.store(i32_view,((16) / (4)),cljs.core.mod((candidate + (1)),total_bits));

Atomics.sub(i32_view,((12) / (4)),(1));

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"offset","offset",296498311),slab_offset,new cljs.core.Keyword(null,"class-idx","class-idx",145738667),class_idx,new cljs.core.Keyword(null,"block-idx","block-idx",1149295564),candidate], null);
} else {
var G__24449 = (candidate + (1));
var G__24450 = wrapped_QMARK_;
start_bit = G__24449;
wrapped_QMARK_ = G__24450;
continue;
}
} else {
if(((cljs.core.not(wrapped_QMARK_)) && ((cursor > (0))))){
var G__24456 = (0);
var G__24457 = true;
start_bit = G__24456;
wrapped_QMARK_ = G__24457;
continue;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"out-of-memory","out-of-memory",-1849794692),new cljs.core.Keyword(null,"class-idx","class-idx",145738667),class_idx], null);

}
}
break;
}
}
});
/**
 * Like alloc but returns just the slab-qualified offset, or throws on error.
 */
cljs_thread.eve.deftype_proto.alloc.alloc_offset = (function cljs_thread$eve$deftype_proto$alloc$alloc_offset(size_bytes){
var result = cljs_thread.eve.deftype_proto.alloc.alloc(size_bytes);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))){
throw (new Error(["Slab alloc failed: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))," for ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_bytes)," bytes"].join('')));
} else {
return new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(result);
}
});
/**
 * Free a block identified by its slab-qualified offset.
 * For slab classes 0-5: clears the bitmap bit, increments free count.
 * For class 6 (overflow): routes to legacy eve.atom/free.
 */
cljs_thread.eve.deftype_proto.alloc.free_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$free_BANG_(slab_offset){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(slab_offset,(-1))){
var class_idx_24476 = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
if((class_idx_24476 === (6))){
var byte_off_24477 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_offset);
var desc_idx_24478 = cljs_thread.eve.deftype_proto.alloc.overflow_desc_map.get(byte_off_24477);
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.eve.deftype_proto.alloc.legacy_env;
if(cljs.core.truth_(and__5043__auto__)){
return (!((desc_idx_24478 == null)));
} else {
return and__5043__auto__;
}
})())){
cljs_thread.eve.shared_atom.free(cljs_thread.eve.deftype_proto.alloc.legacy_env,desc_idx_24478);

cljs_thread.eve.deftype_proto.alloc.overflow_desc_map.delete(byte_off_24477);
} else {
}
} else {
var block_idx_24479 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_offset);
var bm_offset_24480 = (cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets[class_idx_24476]);
var inst_24481 = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx_24476);
var i32_view_24482 = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst_24481);
cljs_thread.eve.deftype_proto.wasm.bitmap_free_BANG_(class_idx_24476,bm_offset_24480,block_idx_24479);

Atomics.add(i32_view_24482,((12) / (4)),(1));
}

return null;
} else {
return null;
}
});
/**
 * Allocate up to `max-count` blocks of `size-bytes` each.
 * Returns a JS array of slab-qualified offsets.
 */
cljs_thread.eve.deftype_proto.alloc.batch_alloc = (function cljs_thread$eve$deftype_proto$alloc$batch_alloc(size_bytes,max_count){
var class_idx = cljs_thread.eve.deftype_proto.data.size__GT_class_idx(size_bytes);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(class_idx,(-1))){
var bm_offset = (cljs_thread.eve.deftype_proto.alloc.slab_bitmap_offsets[class_idx]);
var total_bits = (cljs_thread.eve.deftype_proto.alloc.slab_total_blocks[class_idx]);
var inst = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx);
var i32_view = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst);
var cursor = Atomics.load(i32_view,((16) / (4)));
var results = [];
var start_bit_24483 = cursor;
var wrapped_QMARK__24484 = false;
while(true){
if((results.length < max_count)){
var candidate_24485 = cljs_thread.eve.deftype_proto.wasm.bitmap_find_free(class_idx,bm_offset,total_bits,start_bit_24483);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(candidate_24485,(-1))){
if(cljs_thread.eve.deftype_proto.wasm.bitmap_alloc_cas_BANG_(class_idx,bm_offset,candidate_24485)){
results.push(cljs_thread.eve.deftype_proto.alloc.encode_slab_offset(class_idx,candidate_24485));

var G__24488 = (candidate_24485 + (1));
var G__24489 = wrapped_QMARK__24484;
start_bit_24483 = G__24488;
wrapped_QMARK__24484 = G__24489;
continue;
} else {
var G__24490 = (candidate_24485 + (1));
var G__24491 = wrapped_QMARK__24484;
start_bit_24483 = G__24490;
wrapped_QMARK__24484 = G__24491;
continue;
}
} else {
if(((cljs.core.not(wrapped_QMARK__24484)) && ((cursor > (0))))){
var G__24492 = (0);
var G__24493 = true;
start_bit_24483 = G__24492;
wrapped_QMARK__24484 = G__24493;
continue;
} else {

}
}
} else {
}
break;
}

if((results.length > (0))){
var last_offset_24494 = (results[(results.length - (1))]);
var last_block_24495 = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(last_offset_24494);
Atomics.store(i32_view,((16) / (4)),cljs.core.mod((last_block_24495 + (1)),total_bits));

Atomics.sub(i32_view,((12) / (4)),results.length);
} else {
}

return results;
} else {
return null;
}
});
cljs_thread.eve.deftype_proto.alloc.resolved_dv = null;
cljs_thread.eve.deftype_proto.alloc.resolved_u8 = null;
cljs_thread.eve.deftype_proto.alloc.resolved_base = (0);
/**
 * Resolve a slab-qualified offset to a DataView and base byte offset.
 * Sets module-level resolved-dv and resolved-base for subsequent reads.
 * Returns the base byte offset. Use resolved-dv for the DataView.
 * This avoids allocation and is the hot-path accessor for multi-field reads.
 */
cljs_thread.eve.deftype_proto.alloc.resolve_dv_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$resolve_dv_BANG_(slab_offset){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_offset);
var block_size = (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
var base = ((cljs_thread.eve.deftype_proto.alloc.slab_data_offsets[class_idx]) + (block_idx * block_size));
(cljs_thread.eve.deftype_proto.alloc.resolved_dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx));

(cljs_thread.eve.deftype_proto.alloc.resolved_base = base);

return base;
});
/**
 * Like resolve-dv! but sets resolved-u8 (Uint8Array) for byte operations.
 * Returns the base byte offset.
 */
cljs_thread.eve.deftype_proto.alloc.resolve_u8_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$resolve_u8_BANG_(slab_offset){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var block_idx = cljs_thread.eve.deftype_proto.alloc.decode_block_idx(slab_offset);
var block_size = (cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]);
var base = ((cljs_thread.eve.deftype_proto.alloc.slab_data_offsets[class_idx]) + (block_idx * block_size));
(cljs_thread.eve.deftype_proto.alloc.resolved_u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx));

(cljs_thread.eve.deftype_proto.alloc.resolved_dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx));

(cljs_thread.eve.deftype_proto.alloc.resolved_base = base);

return base;
});
/**
 * Read a byte from a slab-qualified offset + byte offset within block.
 */
cljs_thread.eve.deftype_proto.alloc.read_u8 = (function cljs_thread$eve$deftype_proto$alloc$read_u8(slab_offset,byte_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return (u8[(base + byte_off)]);
});
/**
 * Write a byte to a slab-qualified offset + byte offset within block.
 */
cljs_thread.eve.deftype_proto.alloc.write_u8_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$write_u8_BANG_(slab_offset,byte_off,val){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return (u8[(base + byte_off)] = val);
});
/**
 * Read an i32 from a slab-qualified offset + byte offset within block.
 * byte-off must be 4-byte aligned.
 */
cljs_thread.eve.deftype_proto.alloc.read_i32 = (function cljs_thread$eve$deftype_proto$alloc$read_i32(slab_offset,byte_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return dv.getInt32((base + byte_off),true);
});
/**
 * Write an i32 to a slab-qualified offset + byte offset within block.
 */
cljs_thread.eve.deftype_proto.alloc.write_i32_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$write_i32_BANG_(slab_offset,byte_off,val){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return dv.setInt32((base + byte_off),val,true);
});
/**
 * Read a u16 from a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.read_u16 = (function cljs_thread$eve$deftype_proto$alloc$read_u16(slab_offset,byte_off){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return dv.getUint16((base + byte_off),true);
});
/**
 * Write a u16 to a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.write_u16_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$write_u16_BANG_(slab_offset,byte_off,val){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var dv = cljs_thread.eve.deftype_proto.wasm.slab_data_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return dv.setUint16((base + byte_off),val,true);
});
/**
 * Read a Uint8Array slice from a slab-qualified offset.
 * Returns a view (not a copy) into the slab's SAB.
 */
cljs_thread.eve.deftype_proto.alloc.read_bytes = (function cljs_thread$eve$deftype_proto$alloc$read_bytes(slab_offset,byte_off,len){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return u8.subarray((base + byte_off),((base + byte_off) + len));
});
/**
 * Write a Uint8Array to a slab-qualified offset.
 */
cljs_thread.eve.deftype_proto.alloc.write_bytes_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$write_bytes_BANG_(slab_offset,byte_off,src_bytes){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(slab_offset);
var u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx);
var base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(slab_offset);
return u8.set(src_bytes,(base + byte_off));
});
/**
 * Copy bytes within the same slab. Both offsets must be slab-qualified
 * with the same class index.
 */
cljs_thread.eve.deftype_proto.alloc.copy_within_slab_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$copy_within_slab_BANG_(dst_slab_offset,dst_byte_off,src_slab_offset,src_byte_off,len){
var class_idx = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(dst_slab_offset);
var u8 = cljs_thread.eve.deftype_proto.wasm.slab_u8_view(class_idx);
var dst_base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(dst_slab_offset);
var src_base = cljs_thread.eve.deftype_proto.alloc.slab_offset__GT_byte_offset(src_slab_offset);
return u8.copyWithin((dst_base + dst_byte_off),(src_base + src_byte_off),((src_base + src_byte_off) + len));
});
/**
 * Copy an entire block from one slab-qualified offset to another.
 * Source and destination may be in different slabs.
 */
cljs_thread.eve.deftype_proto.alloc.copy_block_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$copy_block_BANG_(dst_slab_offset,src_slab_offset,len){
var src_class = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(src_slab_offset);
var dst_class = cljs_thread.eve.deftype_proto.alloc.decode_class_idx(dst_slab_offset);
if((src_class === dst_class)){
return cljs_thread.eve.deftype_proto.alloc.copy_within_slab_BANG_(dst_slab_offset,(0),src_slab_offset,(0),len);
} else {
var src_bytes = cljs_thread.eve.deftype_proto.alloc.read_bytes(src_slab_offset,(0),len);
return cljs_thread.eve.deftype_proto.alloc.write_bytes_BANG_(dst_slab_offset,(0),src_bytes);
}
});
/**
 * Read the atom root pointer (a slab-qualified offset).
 */
cljs_thread.eve.deftype_proto.alloc.read_root_ptr = (function cljs_thread$eve$deftype_proto$alloc$read_root_ptr(){
return Atomics.load(cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32),((4) / (4)));
});
/**
 * CAS the atom root pointer. Returns true on success.
 */
cljs_thread.eve.deftype_proto.alloc.cas_root_ptr_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$cas_root_ptr_BANG_(expected,new_val){
return (expected === Atomics.compareExchange(cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32),((4) / (4)),expected,new_val));
});
/**
 * Read the current global epoch.
 */
cljs_thread.eve.deftype_proto.alloc.get_current_epoch = (function cljs_thread$eve$deftype_proto$alloc$get_current_epoch(){
return Atomics.load(cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32),((8) / (4)));
});
/**
 * Atomically increment global epoch. Returns the new epoch.
 */
cljs_thread.eve.deftype_proto.alloc.increment_epoch_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$increment_epoch_BANG_(){
return (Atomics.add(cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32),((8) / (4)),(1)) + (1));
});
/**
 * Calculate Int32Array index for a worker slot.
 */
cljs_thread.eve.deftype_proto.alloc.worker_slot_int32_offset = (function cljs_thread$eve$deftype_proto$alloc$worker_slot_int32_offset(slot_idx){
return ((cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx * (24))) / (4));
});
/**
 * Claim a worker slot. Returns slot index or nil.
 */
cljs_thread.eve.deftype_proto.alloc.register_worker_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$register_worker_BANG_(worker_id){
var i32 = cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32);
var slot_idx = (0);
while(true){
if((slot_idx < (256))){
var status_idx = cljs_thread.eve.deftype_proto.alloc.worker_slot_int32_offset(slot_idx);
if(((0) === Atomics.compareExchange(i32,status_idx,(0),(1)))){
var slot_byte_offset = (cljs_thread.eve.deftype_proto.data.ROOT_WORKER_REGISTRY_START + (slot_idx * (24)));
Atomics.store(i32,((slot_byte_offset + (16)) / (4)),worker_id);

Atomics.store(i32,((slot_byte_offset + (4)) / (4)),(0));

return slot_idx;
} else {
var G__24514 = (slot_idx + (1));
slot_idx = G__24514;
continue;
}
} else {
return null;
}
break;
}
});
/**
 * Release a worker slot.
 */
cljs_thread.eve.deftype_proto.alloc.unregister_worker_BANG_ = (function cljs_thread$eve$deftype_proto$alloc$unregister_worker_BANG_(slot_idx){
if((((slot_idx >= (0))) && ((slot_idx < (256))))){
var i32 = cljs.core.deref(cljs_thread.eve.deftype_proto.alloc.root_i32);
var status_idx = cljs_thread.eve.deftype_proto.alloc.worker_slot_int32_offset(slot_idx);
Atomics.store(i32,(status_idx + ((4) / (4))),(0));

return Atomics.store(i32,status_idx,(0));
} else {
return null;
}
});
/**
 * Return stats for a slab class: {:block-size :total-blocks :free-count :used-count}.
 */
cljs_thread.eve.deftype_proto.alloc.slab_stats = (function cljs_thread$eve$deftype_proto$alloc$slab_stats(class_idx){
var inst = cljs_thread.eve.deftype_proto.wasm.get_slab_instance(class_idx);
var i32 = new cljs.core.Keyword(null,"i32","i32",-426137366).cljs$core$IFn$_invoke$arity$1(inst);
var total = (cljs_thread.eve.deftype_proto.alloc.slab_total_blocks[class_idx]);
var free = Atomics.load(i32,((12) / (4)));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"block-size","block-size",-1062272384),(cljs_thread.eve.deftype_proto.data.SLAB_SIZES[class_idx]),new cljs.core.Keyword(null,"total-blocks","total-blocks",-168639763),total,new cljs.core.Keyword(null,"free-count","free-count",1161309172),free,new cljs.core.Keyword(null,"used-count","used-count",1231778467),(total - free)], null);
});
/**
 * Return stats for all slab classes.
 */
cljs_thread.eve.deftype_proto.alloc.all_slab_stats = (function cljs_thread$eve$deftype_proto$alloc$all_slab_stats(){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__5523__auto__ = (function cljs_thread$eve$deftype_proto$alloc$all_slab_stats_$_iter__24185(s__24186){
return (new cljs.core.LazySeq(null,(function (){
var s__24186__$1 = s__24186;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__24186__$1);
if(temp__5823__auto__){
var s__24186__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__24186__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__24186__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__24188 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__24187 = (0);
while(true){
if((i__24187 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__24187);
cljs.core.chunk_append(b__24188,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,cljs_thread.eve.deftype_proto.alloc.slab_stats(i)], null));

var G__24525 = (i__24187 + (1));
i__24187 = G__24525;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__24188),cljs_thread$eve$deftype_proto$alloc$all_slab_stats_$_iter__24185(cljs.core.chunk_rest(s__24186__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__24188),null);
}
} else {
var i = cljs.core.first(s__24186__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,cljs_thread.eve.deftype_proto.alloc.slab_stats(i)], null),cljs_thread$eve$deftype_proto$alloc$all_slab_stats_$_iter__24185(cljs.core.rest(s__24186__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((6)));
})());
});

//# sourceMappingURL=cljs_thread.eve.deftype_proto.alloc.js.map
