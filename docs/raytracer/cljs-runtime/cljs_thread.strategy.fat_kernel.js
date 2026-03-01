goog.provide('cljs_thread.strategy.fat_kernel');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.kernel_source !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.kernel_source = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Remove #!/... shebang line from source. Node :node-script builds
 * prepend a shebang which is invalid JS in an eval context.
 */
cljs_thread.strategy.fat_kernel.strip_shebang = (function cljs_thread$strategy$fat_kernel$strip_shebang(source){
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof source === 'string';
if(and__5043__auto__){
return source.startsWith("#!");
} else {
return and__5043__auto__;
}
})())){
var nl_idx = source.indexOf("\n");
if((nl_idx >= (0))){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2(source,(nl_idx + (1)));
} else {
return source;
}
} else {
return source;
}
});
/**
 * Remove importScripts(...) calls from source. When we inline all
 * dependency modules into the blob, the importScripts calls at the
 * top of child modules (e.g. importScripts('shared.js') in core.js)
 * are no longer needed — the code is already present.
 */
cljs_thread.strategy.fat_kernel.strip_import_scripts = (function cljs_thread$strategy$fat_kernel$strip_import_scripts(source){
if(typeof source === 'string'){
return source.replace((new RegExp("^\\s*importScripts\\([^)]*\\);?\\s*\\n?","gm")),"");
} else {
return source;
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.kernel_origin !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.kernel_origin = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.loadable_modules_config !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.loadable_modules_config = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.propagate_source_QMARK_ !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.propagate_source_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true);
}
/**
 * Fetch a URL as text synchronously. Uses sync XHR on the main thread.
 * Relies on browser HTTP cache for speed (the scripts were already loaded
 * as <script> tags). Returns nil on failure.
 */
cljs_thread.strategy.fat_kernel.fetch_text_sync = (function cljs_thread$strategy$fat_kernel$fetch_text_sync(url){
try{var xhr = (new XMLHttpRequest());
xhr.open("GET",url,false);

xhr.send();

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((200),xhr.status)){
return xhr.responseText;
} else {
return null;
}
}catch (e27448){var _ = e27448;
return null;
}});
/**
 * Detect the base URL by examining <script> tags on the page.
 * Returns the directory URL of the first script.
 */
cljs_thread.strategy.fat_kernel.detect_base_url_from_scripts = (function cljs_thread$strategy$fat_kernel$detect_base_url_from_scripts(){
if((((typeof document !== 'undefined')) && ((typeof document !== 'undefined') && (typeof document.querySelectorAll !== 'undefined')))){
var scripts = cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("script[src]"));
var srcs = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27449_SHARP_){
return p1__27449_SHARP_.src;
}),scripts);
var temp__5823__auto__ = cljs.core.first(srcs);
if(cljs.core.truth_(temp__5823__auto__)){
var src = temp__5823__auto__;
return cljs_thread.strategy.common.detect_base_url(src);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Given a module and the by-id map, return module output names in
 * dependency order (deps first, then the module itself). Excludes
 * :screen (page-only module).
 */
cljs_thread.strategy.fat_kernel.resolve_dependency_chain = (function cljs_thread$strategy$fat_kernel$resolve_dependency_chain(mod,by_id){
var deps = new cljs.core.Keyword(null,"depends-on","depends-on",-1448442022).cljs$core$IFn$_invoke$arity$1(mod);
if(cljs.core.seq(deps)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__27450_SHARP_){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(by_id,p1__27450_SHARP_);
if(cljs.core.truth_(temp__5823__auto__)){
var dep_mod = temp__5823__auto__;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__27450_SHARP_,new cljs.core.Keyword(null,"screen","screen",1990059748))){
return (cljs_thread.strategy.fat_kernel.resolve_dependency_chain.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.strategy.fat_kernel.resolve_dependency_chain.cljs$core$IFn$_invoke$arity$2(dep_mod,by_id) : cljs_thread.strategy.fat_kernel.resolve_dependency_chain.call(null, dep_mod,by_id));
} else {
return null;
}
} else {
return null;
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([deps], 0)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(mod)], null)));
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(mod)], null);
}
});
/**
 * Try to fetch and parse manifest.edn from the build output directory.
 * Returns a map {:kernel-urls [...] :screen-name "..."} or nil.
 * 
 * shadow-cljs writes manifest.edn to :output-dir with entries like:
 *   [{:module-id :cljs-thread :output-name "cljs-thread.js" ...}
 *    {:module-id :shared      :output-name "shared.js" ...}
 *    {:module-id :screen      :output-name "screen.js" ...}
 *    {:module-id :core        :output-name "core.js" ...}]
 * 
 * Detection priority:
 * 1. :cljs-thread with entries — dedicated kernel module (user-provided)
 * 2. :core + deps — worker-safe bootstrap + full dependency chain
 * 3. :shared — contains full runtime (fat-kernel builds)
 * 4. Single module — the only module IS the runtime
 * 
 * For code-split builds with :core, the full dependency chain is
 * returned (e.g. [shared.js, core.js]) so that :advanced builds work
 * in blob workers without importScripts.
 * 
 * Note: :cljs-thread modules with no entries (just :web-worker true flag)
 * are skipped — they're placeholders for importScripts workers, not
 * fat-kernel blob workers. Fat-kernel uses :shared directly.
 */
cljs_thread.strategy.fat_kernel.detect_kernel_from_manifest = (function cljs_thread$strategy$fat_kernel$detect_kernel_from_manifest(base_url){
var temp__5823__auto__ = cljs_thread.strategy.fat_kernel.fetch_text_sync([cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),"manifest.edn"].join(''));
if(cljs.core.truth_(temp__5823__auto__)){
var manifest_text = temp__5823__auto__;
try{var modules = clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(manifest_text);
var by_id = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"module-id","module-id",376972113),cljs.core.identity)),modules);
var ct_mod = new cljs.core.Keyword(null,"cljs-thread","cljs-thread",-95988952).cljs$core$IFn$_invoke$arity$1(by_id);
var shared_mod = new cljs.core.Keyword(null,"shared","shared",-384145993).cljs$core$IFn$_invoke$arity$1(by_id);
var screen_mod = new cljs.core.Keyword(null,"screen","screen",1990059748).cljs$core$IFn$_invoke$arity$1(by_id);
var core_mod = new cljs.core.Keyword(null,"core","core",-86019209).cljs$core$IFn$_invoke$arity$1(by_id);
var ct_has_entries_QMARK_ = cljs.core.seq(new cljs.core.Keyword(null,"entries","entries",-86943161).cljs$core$IFn$_invoke$arity$1(ct_mod));
if(cljs.core.truth_((function (){var and__5043__auto__ = ct_mod;
if(cljs.core.truth_(and__5043__auto__)){
return ct_has_entries_QMARK_;
} else {
return and__5043__auto__;
}
})())){
var chain = cljs_thread.strategy.fat_kernel.resolve_dependency_chain(ct_mod,by_id);
var urls = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27462_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__27462_SHARP_)].join('');
}),chain);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),urls,new cljs.core.Keyword(null,"screen-name","screen-name",31129652),(cljs.core.truth_(screen_mod)?new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(screen_mod):null)], null);
} else {
if(cljs.core.truth_(core_mod)){
var chain = cljs_thread.strategy.fat_kernel.resolve_dependency_chain(core_mod,by_id);
var urls = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27467_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__27467_SHARP_)].join('');
}),chain);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),urls,new cljs.core.Keyword(null,"screen-name","screen-name",31129652),(cljs.core.truth_(screen_mod)?new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(screen_mod):null)], null);
} else {
if(cljs.core.truth_(shared_mod)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(shared_mod))].join('')], null),new cljs.core.Keyword(null,"screen-name","screen-name",31129652),(cljs.core.truth_(screen_mod)?new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(screen_mod):null)], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(modules))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [[cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(cljs.core.first(modules)))].join('')], null),new cljs.core.Keyword(null,"screen-name","screen-name",31129652),null], null);
} else {
return null;

}
}
}
}
}catch (e27472){var _ = e27472;
return null;
}} else {
return null;
}
});
/**
 * Fallback: detect kernel scripts from <script> tags on the page.
 * Without a manifest, we don't know which script has the worker-safe
 * bootstrap. In a single-module build, the only script is the kernel.
 * In a code-split build, we can't safely pick — return nil so the
 * caller falls back to other detection methods or error.
 */
cljs_thread.strategy.fat_kernel.detect_kernel_from_script_tags = (function cljs_thread$strategy$fat_kernel$detect_kernel_from_script_tags(){
if((((typeof document !== 'undefined')) && ((typeof document !== 'undefined') && (typeof document.querySelectorAll !== 'undefined')))){
var scripts = cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("script[src]"));
var srcs = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27482_SHARP_){
return p1__27482_SHARP_.src;
}),scripts));
if(cljs.core.empty_QMARK_(srcs)){
return null;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(srcs))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),srcs,new cljs.core.Keyword(null,"screen-name","screen-name",31129652),null], null);
} else {
return null;

}
}
} else {
return null;
}
});
/**
 * Check if a module source is from dev/none mode (has SHADOW_ENV bootstrap).
 * Dev mode modules are self-contained; advanced mode modules need deps inlined.
 * We look for the actual SHADOW_ENV variable declaration, not just any occurrence
 * of the string (which could be in compiled regex patterns).
 */
cljs_thread.strategy.fat_kernel.is_dev_mode_QMARK_ = (function cljs_thread$strategy$fat_kernel$is_dev_mode_QMARK_(source){
return ((typeof source === 'string') && (cljs.core.boolean$(cljs.core.re_find(/^[^{]*SHADOW_ENV\s*=/,source))));
});
/**
 * Check if a module source needs its dependencies inlined (advanced mode).
 * In :advanced mode, module JS starts with importScripts('dep.js') when
 * :web-worker is true. Without :web-worker, it still needs deps inlined
 * but won't have importScripts. We detect advanced mode by absence of
 * SHADOW_ENV (which is present in dev mode).
 */
cljs_thread.strategy.fat_kernel.needs_deps_inlined_QMARK_ = (function cljs_thread$strategy$fat_kernel$needs_deps_inlined_QMARK_(source){
return ((typeof source === 'string') && ((!(cljs_thread.strategy.fat_kernel.is_dev_mode_QMARK_(source)))));
});
/**
 * Detect and fetch the kernel source in a browser environment.
 * Tries manifest.edn first, falls back to script tag detection.
 * 
 * In :none mode: uses only the primary module (web-worker bootstrap).
 * In :advanced mode: inlines the full dependency chain (shared.js +
 * core.js) to avoid importScripts from blob workers.
 */
cljs_thread.strategy.fat_kernel.extract_kernel_source_browser_BANG_ = (function cljs_thread$strategy$fat_kernel$extract_kernel_source_browser_BANG_(){
var base_url = cljs_thread.strategy.fat_kernel.detect_base_url_from_scripts();
var detected = (function (){var or__5045__auto__ = (cljs.core.truth_(base_url)?cljs_thread.strategy.fat_kernel.detect_kernel_from_manifest(base_url):null);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.strategy.fat_kernel.detect_kernel_from_script_tags();
}
})();
if(cljs.core.truth_(detected)){
var map__27498 = detected;
var map__27498__$1 = cljs.core.__destructure_map(map__27498);
var kernel_urls = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27498__$1,new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080));
var screen_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27498__$1,new cljs.core.Keyword(null,"screen-name","screen-name",31129652));
var primary_source = cljs_thread.strategy.fat_kernel.fetch_text_sync(cljs.core.last(kernel_urls));
var sources = (((((cljs.core.count(kernel_urls) > (1))) && (cljs_thread.strategy.fat_kernel.needs_deps_inlined_QMARK_(primary_source))))?(function (){var dep_sources = cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs_thread.strategy.fat_kernel.fetch_text_sync,cljs.core.butlast(kernel_urls));
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(dep_sources,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs_thread.strategy.fat_kernel.strip_import_scripts(primary_source)], null));
})():(cljs.core.truth_(primary_source)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [primary_source], null):cljs.core.PersistentVector.EMPTY));
var combined = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,sources);
if(cljs.core.seq(combined)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,combined);

var base = (function (){var or__5045__auto__ = cljs_thread.strategy.common.detect_base_url(cljs.core.first(kernel_urls));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return base_url;
}
})();
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,base);

if(cljs.core.truth_(screen_name)){
var abs_url = [base,(cljs.core.truth_(base.endsWith("/"))?null:"/"),cljs.core.str.cljs$core$IFn$_invoke$arity$1(screen_name)].join('');
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [abs_url], null));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [abs_url], null));
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
});
/**
 * Detect and read the kernel source in a Node.js environment.
 * Reads __filename for the current script's source.
 * Checks for manifest.edn to find a dedicated kernel module.
 */
cljs_thread.strategy.fat_kernel.extract_kernel_source_node_BANG_ = (function cljs_thread$strategy$fat_kernel$extract_kernel_source_node_BANG_(){
var fs = require('fs');
var path = require('path');
var self_path = (function (){try{return __filename;
}catch (e27502){var _ = e27502;
return null;
}})();
if(cljs.core.truth_(self_path)){
var base_dir = path.dirname(self_path);
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,base_dir);

var manifest_path = path.resolve(base_dir,"manifest.edn");
var has_manifest = (function (){try{return fs.existsSync(manifest_path);
}catch (e27503){var _ = e27503;
return false;
}})();
if(cljs.core.truth_(has_manifest)){
try{var manifest_text = fs.readFileSync(manifest_path,"utf8");
var modules = clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(manifest_text);
var by_id = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"module-id","module-id",376972113),cljs.core.identity)),modules);
var ct_mod = new cljs.core.Keyword(null,"cljs-thread","cljs-thread",-95988952).cljs$core$IFn$_invoke$arity$1(by_id);
var shared_mod = new cljs.core.Keyword(null,"shared","shared",-384145993).cljs$core$IFn$_invoke$arity$1(by_id);
if(cljs.core.truth_(ct_mod)){
var kernel_path = path.resolve(base_dir,new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(ct_mod));
var shared_path = (cljs.core.truth_(shared_mod)?path.resolve(base_dir,new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(shared_mod)):null);
var ksource = fs.readFileSync(kernel_path,"utf8");
var ssource = (cljs.core.truth_(shared_path)?(function (){try{return fs.readFileSync(shared_path,"utf8");
}catch (e27508){var _ = e27508;
return null;
}})():null);
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang([cljs.core.str.cljs$core$IFn$_invoke$arity$1(ksource),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = ssource;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})())].join('')));
} else {
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs.readFileSync(self_path,"utf8")));
}
}catch (e27504){var _ = e27504;
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs.readFileSync(self_path,"utf8")));
}} else {
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs.readFileSync(self_path,"utf8")));
}
} else {
return null;
}
});
/**
 * Detect and cache the kernel source. Called once at first spawn.
 * Browser: fetches from script tags (cache hit). Node: reads file.
 */
cljs_thread.strategy.fat_kernel.extract_kernel_source_BANG_ = (function cljs_thread$strategy$fat_kernel$extract_kernel_source_BANG_(){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
return null;
} else {
if(cljs_thread.platform.node_QMARK_){
return cljs_thread.strategy.fat_kernel.extract_kernel_source_node_BANG_();
} else {
return cljs_thread.strategy.fat_kernel.extract_kernel_source_browser_BANG_();
}
}
});
/**
 * On a worker, extract kernel source for creating child workers.
 * Browser: read from globalThis.__cljs_thread_kernel_source
 * Node: read __filename or workerData.__kernel_source.
 * 
 * Note: eval workers (fat-kernel Node workers) have __filename undefined,
 * so the fs.readFileSync path is skipped without throwing. We MUST always
 * fall through to the workerData check when kernel-source is still nil.
 */
cljs_thread.strategy.fat_kernel.self_extract_source_BANG_ = (function cljs_thread$strategy$fat_kernel$self_extract_source_BANG_(){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
return null;
} else {
if(cljs_thread.platform.node_QMARK_){
try{var fs_27594 = require('fs');
var self_path_27595 = (function (){try{return __filename;
}catch (e27513){var _ = e27513;
return null;
}})();
if(((typeof self_path_27595 === 'string') && (cljs.core.seq(self_path_27595)))){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs_27594.readFileSync(self_path_27595,"utf8")));
} else {
}
}catch (e27512){var __27596 = e27512;
}
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
return null;
} else {
try{var wt = require('worker_threads');
var temp__5823__auto__ = wt.workerData;
if(cljs.core.truth_(temp__5823__auto__)){
var wd = temp__5823__auto__;
var temp__5823__auto____$1 = (wd["__kernel_source"]);
if(cljs.core.truth_(temp__5823__auto____$1)){
var ks = temp__5823__auto____$1;
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,ks);
} else {
return null;
}
} else {
return null;
}
}catch (e27514){var _ = e27514;
return null;
}}
} else {
if((((typeof globalThis !== 'undefined') && (typeof globalThis.__cljs_thread_kernel_source !== 'undefined')) && ((!((globalThis.__cljs_thread_kernel_source == null)))))){
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,globalThis.__cljs_thread_kernel_source);
} else {
return null;
}
}
}
});
/**
 * Create a worker with the full cljs-thread runtime inlined.
 * The worker wakes up immediately functional — no importScripts,
 * no two-phase boot, no message queueing.
 * 
 * data       - cljs-thread worker data map (:id, :conf, etc.)
 * on-message - message handler function
 */
cljs_thread.strategy.fat_kernel.create_worker = (function cljs_thread$strategy$fat_kernel$create_worker(data,on_message){
cljs_thread.strategy.fat_kernel.extract_kernel_source_BANG_();

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(["fat-kernel: Could not detect kernel source.\n","Provide :kernel-source in strategy config or ensure\n","the build output is detectable from <script> tags."].join(''),cljs.core.PersistentArrayMap.EMPTY);
}

if(cljs_thread.platform.node_QMARK_){
var data__$1 = (function (){var temp__5821__auto__ = new cljs.core.Keyword(null,"eargs","eargs",1843998501).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(temp__5821__auto__)){
var eargs = temp__5821__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,new cljs.core.Keyword(null,"eargs","eargs",1843998501),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (arg){
return clojure.walk.postwalk((function (p1__27517_SHARP_){
if((((!((p1__27517_SHARP_ == null)))) && ((((!(typeof p1__27517_SHARP_ === 'string'))) && ((((!(typeof p1__27517_SHARP_ === 'number'))) && ((((!((p1__27517_SHARP_ instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(p1__27517_SHARP_)))) && ((((!(((p1__27517_SHARP_["shared-atom-id"]) == null)))) && ((!(((p1__27517_SHARP_["header-descriptor-idx"]) == null)))))))))))))))){
return ["#cljs-thread/eve-shared-atom {:id ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((p1__27517_SHARP_["shared-atom-id"]))," :idx ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((p1__27517_SHARP_["header-descriptor-idx"])),"}"].join('');
} else {
if((((!((p1__27517_SHARP_ == null)))) && ((((!(typeof p1__27517_SHARP_ === 'string'))) && ((((!(typeof p1__27517_SHARP_ === 'number'))) && ((((!((p1__27517_SHARP_ instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(p1__27517_SHARP_)))) && ((!(((p1__27517_SHARP_["s-atom-env"]) == null)))))))))))))){
return "#cljs-thread/eve-atom {}";
} else {
return p1__27517_SHARP_;

}
}
}),arg);
}),eargs));
} else {
return data;
}
})();
var init_data_js = cljs_thread.strategy.common.embed_init_data_js(data__$1);
var source_export = (cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.propagate_source_QMARK_);
if(cljs.core.truth_(and__5043__auto__)){
var G__27537 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(data__$1);
var fexpr__27536 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"screen","screen",1990059748),null,new cljs.core.Keyword(null,"root","root",-448657453),null], null), null);
return (fexpr__27536.cljs$core$IFn$_invoke$arity$1 ? fexpr__27536.cljs$core$IFn$_invoke$arity$1(G__27537) : fexpr__27536.call(null, G__27537));
} else {
return and__5043__auto__;
}
})())?"":null);
var full_source = [init_data_js,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))].join('');
var wt = require('worker_threads');
var WorkerCls = wt.Worker;
var worker_data = (function (){var G__27540 = data__$1;
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.propagate_source_QMARK_);
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(data__$1));
} else {
return and__5043__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27540,new cljs.core.Keyword(null,"__kernel_source","__kernel_source",1368218006),cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source));
} else {
return G__27540;
}
})();
var wd_js = cljs.core.clj__GT_js(worker_data);
var _ = (function (){var temp__5823__auto__ = cljs.core.deref(cljs_thread.state.eve_sab_config);
if(cljs.core.truth_(temp__5823__auto__)){
var eve_config = temp__5823__auto__;
var sab_obj = ({"sab": new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_config), "reader-map-sab": new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(eve_config), "slab-sabs": new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008).cljs$core$IFn$_invoke$arity$1(eve_config), "root-sab": new cljs.core.Keyword(null,"root-sab","root-sab",-932837436).cljs$core$IFn$_invoke$arity$1(eve_config)});
return (wd_js["__eve_sab_config"] = sab_obj);
} else {
return null;
}
})();
var w = (new WorkerCls(full_source,({"eval": true, "workerData": wd_js})));
w.on("message",on_message);

return w;
} else {
var init_data_js = cljs_thread.strategy.common.embed_init_data_js(data);
var origin_js = (function (){var temp__5821__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_origin);
if(cljs.core.truth_(temp__5821__auto__)){
var origin = temp__5821__auto__;
return ["globalThis.__cljs_thread_origin = ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(JSON.stringify(origin)),";\n"].join('');
} else {
return "";
}
})();
var source_export = (cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.propagate_source_QMARK_);
if(cljs.core.truth_(and__5043__auto__)){
var G__27542 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(data);
var fexpr__27541 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"root","root",-448657453),null], null), null);
return (fexpr__27541.cljs$core$IFn$_invoke$arity$1 ? fexpr__27541.cljs$core$IFn$_invoke$arity$1(G__27542) : fexpr__27541.call(null, G__27542));
} else {
return and__5043__auto__;
}
})())?["globalThis.__cljs_thread_kernel_source = ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(JSON.stringify(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))),";\n"].join(''):"");
var resolver = cljs_thread.strategy.common.import_scripts_resolver_js;
var kernel_source = [init_data_js,origin_js,source_export,resolver,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))].join('');
var kernel_blob_url = cljs_thread.strategy.common.make_blob_url(kernel_source);
var bootstrap_js = ["self.addEventListener('message',function __bh(e){","var d=e.data;","if(d&&d.__cljs_thread_boot){","self.removeEventListener('message',__bh);","if(d.__eve_sab_config){","self.__eve_sab_config_sync=d.__eve_sab_config;}","var origin=d.__origin||'';","self.__cljs_thread_origin=origin;","var _orig=self.importScripts;","self.importScripts=function(){","var args=Array.from(arguments).map(function(u){","if(!origin||/^(https?:|blob:)/.test(u))return u;","return u.charAt(0)==='/'?origin+u:origin+u;","});","return _orig.apply(self,args);","};","if(typeof document==='undefined'){","self.document={readyState:'complete',querySelector:function(){return null;},","querySelectorAll:function(){return[];},","createElement:function(){return{};},","head:{appendChild:function(){}},","body:{appendChild:function(){}}};","self.window=self;}","importScripts(d.__kernel_url);","}});"].join('');
var bootstrap_url = cljs_thread.strategy.common.make_blob_url(bootstrap_js);
var w = (new Worker(bootstrap_url));
(w.onmessage = on_message);

var boot_msg_27606 = ({"__cljs_thread_boot": true, "__kernel_url": kernel_blob_url, "__origin": (function (){var or__5045__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_origin);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})()});
var temp__5823__auto___27607 = cljs.core.deref(cljs_thread.state.eve_sab_config);
if(cljs.core.truth_(temp__5823__auto___27607)){
var eve_config_27608 = temp__5823__auto___27607;
(boot_msg_27606["__eve_sab_config"] = ({"sab": new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_config_27608), "reader-map-sab": new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(eve_config_27608), "slab-sabs": new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008).cljs$core$IFn$_invoke$arity$1(eve_config_27608), "root-sab": new cljs.core.Keyword(null,"root-sab","root-sab",-932837436).cljs$core$IFn$_invoke$arity$1(eve_config_27608)}));
} else {
}

w.postMessage(boot_msg_27606);

setTimeout((function (){
cljs_thread.strategy.common.revoke_blob_url(bootstrap_url);

return cljs_thread.strategy.common.revoke_blob_url(kernel_blob_url);
}),(10000));

return w;
}
});
/**
 * Set the create-worker-override atom so all spawns use fat-kernel.
 */
cljs_thread.strategy.fat_kernel.install_override_BANG_ = (function cljs_thread$strategy$fat_kernel$install_override_BANG_(){
return cljs.core.reset_BANG_(cljs_thread.platform.create_worker_override,(function (_url,data,on_message){
return cljs_thread.strategy.fat_kernel.create_worker(data,on_message);
}));
});
/**
 * Install the fat-kernel strategy as the default worker creation method.
 * 
 * Options (all optional — zero-config is the goal):
 *   :kernel-source    - Pre-loaded kernel source string. Skips detection.
 *   :scripts          - Vector of script URLs/paths to fetch as kernel.
 *   :base-url         - Base URL for resolving relative script paths.
 *   :loadable-modules - Module URLs for catch-and-load.
 *   :propagate-source - Include kernel source in root workers for
 *                        child-spawning (default true).
 */
cljs_thread.strategy.fat_kernel.install_BANG_ = (function cljs_thread$strategy$fat_kernel$install_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___27609 = arguments.length;
var i__5770__auto___27610 = (0);
while(true){
if((i__5770__auto___27610 < len__5769__auto___27609)){
args__5775__auto__.push((arguments[i__5770__auto___27610]));

var G__27611 = (i__5770__auto___27610 + (1));
i__5770__auto___27610 = G__27611;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.strategy.fat_kernel.install_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__27555){
var vec__27556 = p__27555;
var opts = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27556,(0),null);
var map__27562_27612 = opts;
var map__27562_27613__$1 = cljs.core.__destructure_map(map__27562_27612);
var kernel_source_str_27614 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27562_27613__$1,new cljs.core.Keyword(null,"kernel-source-str","kernel-source-str",-747619305));
var scripts_27615 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27562_27613__$1,new cljs.core.Keyword(null,"scripts","scripts",626373193));
var base_url_27616 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27562_27613__$1,new cljs.core.Keyword(null,"base-url","base-url",9540398));
var loadable_modules_27617 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27562_27613__$1,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975));
var propagate_27618 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27562_27613__$1,new cljs.core.Keyword(null,"propagate","propagate",274376905));
if(cljs.core.truth_(kernel_source_str_27614)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(kernel_source_str_27614));
} else {
}

if(((cljs.core.not(kernel_source_str_27614)) && (cljs.core.seq(scripts_27615)))){
var urls_27623 = (cljs.core.truth_(base_url_27616)?((cljs_thread.platform.node_QMARK_)?cljs_thread.strategy.common.resolve_node_paths(base_url_27616,scripts_27615):cljs_thread.strategy.common.resolve_script_urls(base_url_27616,scripts_27615)):scripts_27615);
var sources_27624 = ((cljs_thread.platform.node_QMARK_)?(function (){var fs = require('fs');
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27553_SHARP_){
return fs.readFileSync(p1__27553_SHARP_,"utf8");
}),urls_27623);
})():cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs_thread.strategy.fat_kernel.fetch_text_sync,urls_27623));
var combined_27625 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,sources_27624);
if(cljs.core.seq(combined_27625)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,combined_27625);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,(function (){var or__5045__auto__ = ((cljs.core.seq(urls_27623))?cljs_thread.strategy.common.detect_base_url(cljs.core.first(urls_27623)):null);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return base_url_27616;
}
})());
} else {
}
} else {
}

if(((cljs.core.not(kernel_source_str_27614)) && (cljs.core.not(cljs.core.seq(scripts_27615))))){
cljs_thread.strategy.fat_kernel.extract_kernel_source_BANG_();
} else {
}

if(cljs.core.truth_(loadable_modules_27617)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,loadable_modules_27617);
} else {
}

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.propagate_source_QMARK_,(((!((propagate_27618 == null))))?propagate_27618:true));

cljs_thread.strategy.fat_kernel.install_override_BANG_();

var strategy_conf = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"fat-kernel","fat-kernel",1614893615)], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321),strategy_conf);

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.loadable_modules_config))){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975),cljs.core.deref(cljs_thread.strategy.fat_kernel.loadable_modules_config));
} else {
return null;
}
}));

(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$lang$applyTo = (function (seq27554){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq27554));
}));

/**
 * Remove the fat-kernel override, restoring default create-worker.
 */
cljs_thread.strategy.fat_kernel.uninstall_BANG_ = (function cljs_thread$strategy$fat_kernel$uninstall_BANG_(){
cljs.core.reset_BANG_(cljs_thread.platform.create_worker_override,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.propagate_source_QMARK_,true);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.dissoc,new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321),new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975));
});
/**
 * Auto-detect the core-connect-string by examining the build manifest
 * or <script> tags. Returns a URL string like '/core.js' or '/app.js',
 * or nil if detection fails.
 * 
 * Browser: checks manifest.edn for :core/:kernel/:app module, falls
 * back to single-script detection.
 * Node: returns __filename.
 */
cljs_thread.strategy.fat_kernel.detect_core_connect_string = (function cljs_thread$strategy$fat_kernel$detect_core_connect_string(){
if(cljs_thread.platform.node_QMARK_){
try{return __filename;
}catch (e27576){var _ = e27576;
return null;
}} else {
var base_url = cljs_thread.strategy.fat_kernel.detect_base_url_from_scripts();
var detected = (function (){var or__5045__auto__ = (cljs.core.truth_(base_url)?cljs_thread.strategy.fat_kernel.detect_kernel_from_manifest(base_url):null);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.strategy.fat_kernel.detect_kernel_from_script_tags();
}
})();
if(cljs.core.truth_(detected)){
var url = cljs.core.first(new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080).cljs$core$IFn$_invoke$arity$1(detected));
if(cljs.core.truth_(url)){
try{return (new URL(url)).pathname;
}catch (e27577){var _ = e27577;
return url;
}} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Check conf for fat-kernel strategy settings and re-install if found.
 * Called at namespace load time on workers.
 */
cljs_thread.strategy.fat_kernel.auto_install_from_conf_BANG_ = (function cljs_thread$strategy$fat_kernel$auto_install_from_conf_BANG_(conf){
var temp__5823__auto__ = new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321).cljs$core$IFn$_invoke$arity$1(conf);
if(cljs.core.truth_(temp__5823__auto__)){
var strategy = temp__5823__auto__;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.name(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(strategy)),"fat-kernel")){
cljs_thread.strategy.fat_kernel.self_extract_source_BANG_();

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
return cljs_thread.strategy.fat_kernel.install_override_BANG_();
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
});
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
} else {
cljs_thread.strategy.fat_kernel.auto_install_from_conf_BANG_(cljs.core.deref(cljs_thread.state.conf));
}

//# sourceMappingURL=cljs_thread.strategy.fat_kernel.js.map
