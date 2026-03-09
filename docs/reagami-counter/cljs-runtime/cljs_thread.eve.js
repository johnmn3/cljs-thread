goog.provide('cljs_thread.eve');
/**
 * Initialize the EVE allocator. Returns a Promise.
 * Must be called before creating atoms that use EVE data structures.
 */
cljs_thread.eve.init_BANG_ = cljs_thread.eve.deftype_proto.alloc.init_BANG_;
/**
 * Create a SharedAtom within the global AtomDomain's SharedArrayBuffer.
 * Usage: (eve/atom {:key "value"})
 * The returned atom supports @, swap!, reset!, add-watch, remove-watch.
 */
cljs_thread.eve.atom = cljs_thread.eve.shared_atom.atom;
/**
 * Create a standalone AtomDomain with its own SharedArrayBuffer.
 * Usage: (eve/atom-domain {} :sab-size (* 4 1024 1024) :max-blocks 8192)
 * Useful for testing or isolated atoms that don't share memory.
 */
cljs_thread.eve.atom_domain = cljs_thread.eve.shared_atom.atom_domain;
/**
 * Returns true if x is an eve AtomDomain.
 */
cljs_thread.eve.atom_domain_QMARK_ = (function cljs_thread$eve$atom_domain_QMARK_(x){
return (x instanceof cljs_thread.eve.shared_atom.AtomDomain);
});
/**
 * Returns true if x is an eve SharedAtom.
 */
cljs_thread.eve.shared_atom_QMARK_ = (function cljs_thread$eve$shared_atom_QMARK_(x){
return (x instanceof cljs_thread.eve.shared_atom.SharedAtom);
});
/**
 * Extract SAB references from an AtomDomain for zero-copy cross-worker transfer.
 * Returns {:sab <SharedArrayBuffer> :reader-map-sab <SharedArrayBuffer>}.
 */
cljs_thread.eve.sab_transfer_data = cljs_thread.eve.shared_atom.sab_transfer_data;
goog.exportSymbol('cljs_thread.eve.sab_transfer_data', cljs_thread.eve.sab_transfer_data);
/**
 * Check all watched atoms on this thread for changes and fire local watches.
 * Called by the message-based fallback when a remote worker signals a change.
 */
cljs_thread.eve.check_remote_watches_BANG_ = cljs_thread.eve.shared_atom.check_remote_watches_BANG_;
goog.exportSymbol('cljs_thread.eve.check_remote_watches_BANG_', cljs_thread.eve.check_remote_watches_BANG_);
/**
 * Register a function to broadcast watch notifications to remote workers.
 * Called with (f header-descriptor-idx) after a successful swap!.
 * Used as fallback when Atomics.waitAsync is unavailable.
 */
cljs_thread.eve.set_broadcast_swap_fn_BANG_ = cljs_thread.eve.shared_atom.set_broadcast_swap_fn_BANG_;
/**
 * Create a new EVE hash-map from key-value pairs.
 * Usage: (eve/hash-map :a 1 :b 2) or (eve/hash-map) for empty.
 */
cljs_thread.eve.hash_map = cljs_thread.eve.map.hash_map;
/**
 * Return an empty EVE hash-map.
 */
cljs_thread.eve.empty_hash_map = cljs_thread.eve.map.empty_hash_map;
/**
 * Create a new EVE hash-set from values.
 * Usage: (eve/hash-set :a :b :c) or (eve/hash-set) for empty.
 */
cljs_thread.eve.hash_set = cljs_thread.eve.set.hash_set;
/**
 * Return an empty EVE hash-set.
 */
cljs_thread.eve.empty_hash_set = cljs_thread.eve.set.empty_hash_set;
/**
 * Access an element of an EveArray by index. Reads atomically from the SAB.
 */
cljs_thread.eve.aget = cljs_thread.eve.array.aget;
/**
 * Set an element of an EveArray by index. Writes atomically to the SAB.
 */
cljs_thread.eve.aset_BANG_ = cljs_thread.eve.array.aset_BANG_;
/**
 * Get a typed array view of array data stored in an atom.
 * Usage: (eve/get-typed-view @my-atom :my-array-key :uint8)
 */
cljs_thread.eve.get_typed_view = cljs_thread.eve.array.get_typed_view;
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.atom_registry !== 'undefined')){
} else {
cljs_thread.eve.atom_registry = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Reconstruct s-atom-env from raw SABs. Returns the env map.
 */
cljs_thread.eve.reconstruct_s_atom_env = (function cljs_thread$eve$reconstruct_s_atom_env(sab,reader_map_sab){
var index_view = (new Int32Array(sab));
var data_view = (new Uint8Array(sab));
var reader_map_view = (cljs.core.truth_(reader_map_sab)?(new Int32Array(reader_map_sab)):null);
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"sab","sab",422570093),sab,new cljs.core.Keyword(null,"index-view","index-view",978697547),index_view,new cljs.core.Keyword(null,"data-view","data-view",2142900612),data_view,new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178),reader_map_sab,new cljs.core.Keyword(null,"reader-map-view","reader-map-view",1059300764),reader_map_view,new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sab-total-size-bytes","sab-total-size-bytes",2105988283),sab.byteLength,new cljs.core.Keyword(null,"max-block-descriptors","max-block-descriptors",116282111),cljs_thread.eve.util.atomic_load_int(index_view,((12) / (4))),new cljs.core.Keyword(null,"index-region-size","index-region-size",854075727),cljs_thread.eve.util.atomic_load_int(index_view,((4) / (4))),new cljs.core.Keyword(null,"data-region-start-offset","data-region-start-offset",845368696),cljs_thread.eve.util.atomic_load_int(index_view,((8) / (4)))], null)], null);
});
goog.exportSymbol('cljs_thread.eve.reconstruct_s_atom_env', cljs_thread.eve.reconstruct_s_atom_env);
/**
 * Initialize eve's AtomDomain on a worker thread from SAB config.
 * sab-config is a JS object with .sab and .reader_map_sab properties,
 * or a CLJS map with :sab and :reader-map-sab keys.
 * Also initializes the slab allocator if slab SABs are present.
 */
cljs_thread.eve.init_eve_on_worker_BANG_ = (function cljs_thread$eve$init_eve_on_worker_BANG_(sab_config){
var sab = (function (){var or__5045__auto__ = (sab_config["sab"]);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(sab_config);
}
})();
var reader_map_sab = (function (){var or__5045__auto__ = (sab_config["reader-map-sab"]);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(sab_config);
}
})();
var slab_sabs = (function (){var or__5045__auto__ = (sab_config["slab-sabs"]);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008).cljs$core$IFn$_invoke$arity$1(sab_config);
}
})();
var root_sab_val = (function (){var or__5045__auto__ = (sab_config["root-sab"]);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"root-sab","root-sab",-932837436).cljs$core$IFn$_invoke$arity$1(sab_config);
}
})();
if(cljs.core.truth_(sab)){
var s_atom_env = cljs_thread.eve.reconstruct_s_atom_env(sab,reader_map_sab);
var atom_instance = cljs_thread.eve.shared_atom.__GT_AtomDomain(s_atom_env,null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY));
if(cljs.core.truth_(cljs_thread.eve.data._STAR_worker_id_STAR_)){
} else {
(cljs_thread.eve.data._STAR_worker_id_STAR_ = (Math.floor((Math.random() * (2147483646))) + (1)));
}

(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ = atom_instance);

cljs_thread.eve.shared_atom.init_worker_cache_BANG_(s_atom_env);

cljs_thread.eve.wasm_mem.init_views_from_sab_BANG_(sab);

if(cljs.core.truth_(slab_sabs)){
cljs_thread.eve.deftype_proto.alloc.init_worker_slabs_BANG_(slab_sabs,root_sab_val,sab);

if(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS){
cljs_thread.eve.deftype_proto.xray.enable_trace_BANG_();

cljs_thread.eve.deftype_proto.xray.enable_pool_tracking_BANG_();

cljs_thread.eve.deftype_proto.xray.slab_xray_validate_BANG_(["WORKER-INIT id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.data._STAR_worker_id_STAR_)].join(''));
} else {
}
} else {
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.eve.atom_registry,cljs.core.assoc,sab,atom_instance);

cljs.core.reset_BANG_(cljs_thread.state.eve_sab_config,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sab","sab",422570093),sab,new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178),reader_map_sab,new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008),slab_sabs,new cljs.core.Keyword(null,"root-sab","root-sab",-932837436),root_sab_val], null));

return atom_instance;
} else {
return null;
}
});
goog.exportSymbol('cljs_thread.eve.init_eve_on_worker_BANG_', cljs_thread.eve.init_eve_on_worker_BANG_);
/**
 * Get existing atom for this SAB, or reconstruct one.
 * Uses SAB identity check to avoid redundant reconstruction.
 */
cljs_thread.eve.get_or_reconstruct_atom = (function cljs_thread$eve$get_or_reconstruct_atom(sab,reader_map_sab){
var temp__5821__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.eve.atom_registry),sab);
if(cljs.core.truth_(temp__5821__auto__)){
var existing = temp__5821__auto__;
return existing;
} else {
return cljs_thread.eve.init_eve_on_worker_BANG_(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sab","sab",422570093),sab,new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178),reader_map_sab], null));
}
});
goog.exportSymbol('cljs_thread.eve.get_or_reconstruct_atom', cljs_thread.eve.get_or_reconstruct_atom);
/**
 * Return the global AtomDomain instance on this thread.
 * Used by conveyance (unstr-body) — workers already have the atom
 * initialized via auto-init! at namespace load time.
 */
cljs_thread.eve.get_global_atom = (function cljs_thread$eve$get_global_atom(){
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
});
goog.exportSymbol('cljs_thread.eve.get_global_atom', cljs_thread.eve.get_global_atom);
/**
 * Reconstruct a SharedAtom on this thread from its identity fields.
 * Used by tag reader when a shared atom is parsed from EDN.
 */
cljs_thread.eve.reconstruct_shared_atom = (function cljs_thread$eve$reconstruct_shared_atom(shared_atom_id,header_descriptor_idx){
var temp__5823__auto__ = cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
if(cljs.core.truth_(temp__5823__auto__)){
var parent = temp__5823__auto__;
return cljs_thread.eve.shared_atom.__GT_SharedAtom(parent,shared_atom_id,header_descriptor_idx,null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY));
} else {
return null;
}
});
goog.exportSymbol('cljs_thread.eve.reconstruct_shared_atom', cljs_thread.eve.reconstruct_shared_atom);
cljs.reader.register_tag_parser_BANG_(new cljs.core.Symbol("cljs-thread","shared-atom","cljs-thread/shared-atom",-1999134782,null),(function (p__20381){
var map__20382 = p__20381;
var map__20382__$1 = cljs.core.__destructure_map(map__20382);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20382__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20382__$1,new cljs.core.Keyword(null,"idx","idx",1053688473));
return cljs_thread.eve.reconstruct_shared_atom(id,idx);
}));
/**
 * Read __eve_sab_config from globalThis where platform.cljs saved it.
 * platform/node-init-data extracts __eve_sab_config from workerData and
 * saves it to globalThis BEFORE calling js->clj (which would mangle SABs).
 */
cljs_thread.eve.read_eve_config_from_worker_data = (function cljs_thread$eve$read_eve_config_from_worker_data(){
if(cljs_thread.platform.node_QMARK_){
try{if((((typeof globalThis !== 'undefined') && (typeof globalThis.__eve_sab_config !== 'undefined')) && ((!((globalThis.__eve_sab_config == null)))))){
return globalThis.__eve_sab_config;
} else {
return null;
}
}catch (e20383){var _ = e20383;
return null;
}} else {
return null;
}
});
/**
 * Read __eve_sab_config_sync from self where the bootstrap blob stored it.
 * Browser two-phase boot: bootstrap blob receives SABs via postMessage,
 * stores on self.__eve_sab_config_sync, then importScripts the kernel.
 * By the time auto-init! runs, the SABs are already available.
 */
cljs_thread.eve.read_eve_config_from_bootstrap = (function cljs_thread$eve$read_eve_config_from_bootstrap(){
if((!(cljs_thread.platform.node_QMARK_))){
try{if((((typeof self !== 'undefined') && (typeof self.__eve_sab_config_sync !== 'undefined')) && ((!((self.__eve_sab_config_sync == null)))))){
var config = self.__eve_sab_config_sync;
delete self["__eve_sab_config_sync"];

return config;
} else {
return null;
}
}catch (e20384){var _ = e20384;
return null;
}} else {
return null;
}
});
/**
 * Auto-detect and initialize eve on this thread.
 * Checks workerData (Node.js) or bootstrap sync config (browser) for SABs.
 * Called at namespace load time on worker threads.
 */
cljs_thread.eve.auto_init_BANG_ = (function cljs_thread$eve$auto_init_BANG_(){
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
return null;
} else {
if(cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)){
return null;
} else {
var temp__5823__auto__ = (function (){var or__5045__auto__ = cljs_thread.eve.read_eve_config_from_worker_data();
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.eve.read_eve_config_from_bootstrap();
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var config = temp__5823__auto__;
return cljs_thread.eve.init_eve_on_worker_BANG_(config);
} else {
return null;
}
}
}
});
goog.exportSymbol('cljs_thread.eve.auto_init_BANG_', cljs_thread.eve.auto_init_BANG_);
cljs_thread.eve.auto_init_BANG_();
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
cljs_thread.eve.deftype_proto.alloc.init_BANG_();

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.eve_sab_config,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008),cljs_thread.eve.deftype_proto.alloc.get_all_slab_sabs(),new cljs.core.Keyword(null,"root-sab","root-sab",-932837436),cljs_thread.eve.deftype_proto.alloc.get_root_sab()], null));
} else {
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.eve !== 'undefined') && (typeof cljs_thread.eve.browser_eve_ready_promise !== 'undefined')){
} else {
cljs_thread.eve.browser_eve_ready_promise = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Set up the browser worker __eve_sab_config listener.
 * Called at module load time on browser worker threads.
 * state.cljs loads before eve.cljs, so p/sab-sync? already reflects
 * any force-sw-sync! propagation by this point.
 * If auto-init! already initialized EVE from bootstrap sync config,
 * resolves immediately.
 */
cljs_thread.eve.setup_eve_ready_promise_BANG_ = (function cljs_thread$eve$setup_eve_ready_promise_BANG_(){
var p = (cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)?Promise.resolve(true):(((((!((typeof SharedArrayBuffer !== 'undefined')))) || (cljs.core.not(cljs_thread.platform.sab_sync_QMARK_))))?Promise.resolve(null):(new Promise((function (resolve,_reject){
var handler = (function cljs_thread$eve$setup_eve_ready_promise_BANG__$_handler(event){
var data = event.data;
if((((!((data == null)))) && ((((!(typeof data === 'string'))) && ((!(((data["__eve_sab_config"]) == null)))))))){
self.removeEventListener("message",cljs_thread$eve$setup_eve_ready_promise_BANG__$_handler);

cljs_thread.eve.init_eve_on_worker_BANG_((data["__eve_sab_config"]));

return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(true) : resolve.call(null, true));
} else {
return null;
}
});
return self.addEventListener("message",handler);
})))
));
cljs.core.reset_BANG_(cljs_thread.eve.browser_eve_ready_promise,p);

return p;
});
if((((!(cljs_thread.platform.node_QMARK_))) && (cljs.core.not(cljs_thread.env.in_screen_QMARK_())))){
cljs_thread.eve.setup_eve_ready_promise_BANG_();
} else {
}
/**
 * Returns a Promise that resolves when EVE is initialized on this thread.
 * Main thread and Node.js workers: resolves immediately.
 * Browser blob workers: returns the promise set up at module load time.
 */
cljs_thread.eve.eve_ready = (function cljs_thread$eve$eve_ready(){
if(cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)){
return Promise.resolve(true);
} else {
var or__5045__auto__ = cljs.core.deref(cljs_thread.eve.browser_eve_ready_promise);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return Promise.resolve(null);
}
}
});
goog.exportSymbol('cljs_thread.eve.eve_ready', cljs_thread.eve.eve_ready);
if(cljs_thread.eve.deftype_proto.xray.DIAGNOSTICS){
cljs_thread.eve.shared_atom.register_slab_xray_validator_BANG_(cljs_thread.eve.deftype_proto.xray.slab_xray_validate_BANG_);
} else {
}

//# sourceMappingURL=cljs_thread.eve.js.map
