goog.provide('cljs_thread.strategy.fat_kernel');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.kernel_url !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.kernel_url = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.kernel_source !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.kernel_source = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.kernel_origin !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.kernel_origin = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.strategy !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel !== 'undefined') && (typeof cljs_thread.strategy.fat_kernel.loadable_modules_config !== 'undefined')){
} else {
cljs_thread.strategy.fat_kernel.loadable_modules_config = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
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
 * Fetch URL as text via sync XHR. Used only for manifest.edn probing.
 * Returns nil on any failure (404, network error, etc.).
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
}catch (e21084){var _ = e21084;
return null;
}});
/**
 * Return module output names in dependency order (deps-first).
 * Excludes :screen (page-only module).
 */
cljs_thread.strategy.fat_kernel.resolve_dependency_chain = (function cljs_thread$strategy$fat_kernel$resolve_dependency_chain(mod,by_id){
var deps = new cljs.core.Keyword(null,"depends-on","depends-on",-1448442022).cljs$core$IFn$_invoke$arity$1(mod);
if(cljs.core.seq(deps)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__21085_SHARP_){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(by_id,p1__21085_SHARP_);
if(cljs.core.truth_(temp__5823__auto__)){
var dep_mod = temp__5823__auto__;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__21085_SHARP_,new cljs.core.Keyword(null,"screen","screen",1990059748))){
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
 * Try to fetch and parse manifest.edn from base-url.
 * Returns {:kernel-urls [abs-url ...] :screen-name "..."} or nil.
 * kernel-urls is the full dependency chain; last entry is the web-worker
 * entry point.
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
var urls = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21091_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__21091_SHARP_)].join('');
}),chain);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080),urls,new cljs.core.Keyword(null,"screen-name","screen-name",31129652),null], null);
} else {
if(cljs.core.truth_(core_mod)){
var chain = cljs_thread.strategy.fat_kernel.resolve_dependency_chain(core_mod,by_id);
var urls = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21092_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__21092_SHARP_)].join('');
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
}catch (e21094){var _ = e21094;
return null;
}} else {
return null;
}
});
/**
 * Fallback without manifest. Single-script builds: the one script is the
 * kernel. Multi-script builds: cannot pick safely — return nil.
 */
cljs_thread.strategy.fat_kernel.detect_kernel_from_script_tags = (function cljs_thread$strategy$fat_kernel$detect_kernel_from_script_tags(){
if((((typeof document !== 'undefined')) && ((typeof document !== 'undefined') && (typeof document.querySelectorAll !== 'undefined')))){
var scripts = cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("script[src]"));
var srcs = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__21097_SHARP_){
return p1__21097_SHARP_.src;
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
 * Probe each <script src> base URL for manifest.edn. Stops at first hit.
 * Order-independent: works regardless of which non-kernel scripts (e.g.
 * confetti, CDN libraries, analytics) appear before the kernel in the HTML.
 * 
 * On success populates @kernel-url, @kernel-origin, @loadable-modules-config,
 * and s/conf :loadable-modules.
 */
cljs_thread.strategy.fat_kernel.detect_kernel_url_browser_BANG_ = (function cljs_thread$strategy$fat_kernel$detect_kernel_url_browser_BANG_(){
if((((typeof document !== 'undefined')) && ((typeof document !== 'undefined') && (typeof document.querySelectorAll !== 'undefined')))){
var scripts = cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("script[src]"));
var srcs = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__21098_SHARP_){
return p1__21098_SHARP_.src;
}),scripts);
var or__5045__auto__ = cljs.core.some((function (src){
var temp__5823__auto__ = cljs_thread.strategy.common.detect_base_url(src);
if(cljs.core.truth_(temp__5823__auto__)){
var base = temp__5823__auto__;
var temp__5823__auto____$1 = cljs_thread.strategy.fat_kernel.detect_kernel_from_manifest(base);
if(cljs.core.truth_(temp__5823__auto____$1)){
var detected = temp__5823__auto____$1;
var map__21099 = detected;
var map__21099__$1 = cljs.core.__destructure_map(map__21099);
var kernel_urls = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21099__$1,new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080));
var screen_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21099__$1,new cljs.core.Keyword(null,"screen-name","screen-name",31129652));
var entry_url = cljs.core.last(kernel_urls);
var origin = (function (){var or__5045__auto__ = cljs_thread.strategy.common.detect_base_url(entry_url);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return base;
}
})();
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_url,entry_url);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,origin);

if(cljs.core.truth_(screen_name)){
var abs_url_21169 = [origin,(cljs.core.truth_(origin.endsWith("/"))?null:"/"),cljs.core.str.cljs$core$IFn$_invoke$arity$1(screen_name)].join('');
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [abs_url_21169], null));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [abs_url_21169], null));
} else {
}

return detected;
} else {
return null;
}
} else {
return null;
}
}),srcs);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var temp__5823__auto__ = cljs_thread.strategy.fat_kernel.detect_kernel_from_script_tags();
if(cljs.core.truth_(temp__5823__auto__)){
var detected = temp__5823__auto__;
var entry_url = cljs.core.last(new cljs.core.Keyword(null,"kernel-urls","kernel-urls",162437080).cljs$core$IFn$_invoke$arity$1(detected));
var origin = cljs_thread.strategy.common.detect_base_url(entry_url);
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_url,entry_url);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,origin);

return detected;
} else {
return null;
}
}
} else {
return null;
}
});
/**
 * Detect and read the kernel source on Node.js.
 */
cljs_thread.strategy.fat_kernel.extract_kernel_source_node_BANG_ = (function cljs_thread$strategy$fat_kernel$extract_kernel_source_node_BANG_(){
var fs = require('fs');
var path = require('path');
var self_path = (function (){try{return __filename;
}catch (e21104){var _ = e21104;
return null;
}})();
if(cljs.core.truth_(self_path)){
var base_dir = path.dirname(self_path);
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,base_dir);

var manifest_path = path.resolve(base_dir,"manifest.edn");
var has_manifest = (function (){try{return fs.existsSync(manifest_path);
}catch (e21105){var _ = e21105;
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
}catch (e21107){var _ = e21107;
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
}catch (e21106){var _ = e21106;
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs.readFileSync(self_path,"utf8")));
}} else {
return cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs.readFileSync(self_path,"utf8")));
}
} else {
return null;
}
});
/**
 * On a Node.js worker, extract kernel source for creating child workers.
 * Tries __filename first, then workerData.__kernel_source as fallback.
 */
cljs_thread.strategy.fat_kernel.self_extract_source_node_BANG_ = (function cljs_thread$strategy$fat_kernel$self_extract_source_node_BANG_(){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
return null;
} else {
try{var fs_21171 = require('fs');
var self_path_21172 = (function (){try{return __filename;
}catch (e21111){var _ = e21111;
return null;
}})();
if(((typeof self_path_21172 === 'string') && (cljs.core.seq(self_path_21172)))){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(fs_21171.readFileSync(self_path_21172,"utf8")));
} else {
}
}catch (e21110){var __21173 = e21110;
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
}catch (e21112){var _ = e21112;
return null;
}}
}
});
/**
 * Create a worker with the cljs-thread runtime.
 * 
 * Browser (URL-forward): two-phase blob bootstrap.
 *   Bootstrap receives SABs, init data, and kernel entry URL via postMessage.
 *   Stashes SABs + init data on globalThis, installs importScripts origin shim,
 *   calls importScripts(kernelEntryUrl). Kernel loads from server (cache hit).
 *   No source fetching, no kernel Blob.
 * 
 * Node: eval worker with full runtime source inlined (unchanged).
 * 
 * data       - cljs-thread worker data map (:id, :conf, etc.)
 * on-message - message handler function
 */
cljs_thread.strategy.fat_kernel.create_worker = (function cljs_thread$strategy$fat_kernel$create_worker(data,on_message){
if(cljs_thread.platform.node_QMARK_){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
} else {
cljs_thread.strategy.fat_kernel.extract_kernel_source_node_BANG_();
}

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(["fat-kernel: Could not read kernel source on Node.\n","Provide :kernel-source-str or ensure __filename is set."].join(''),cljs.core.PersistentArrayMap.EMPTY);
}

var data__$1 = (function (){var temp__5821__auto__ = new cljs.core.Keyword(null,"eargs","eargs",1843998501).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(temp__5821__auto__)){
var eargs = temp__5821__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,new cljs.core.Keyword(null,"eargs","eargs",1843998501),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (arg){
return clojure.walk.postwalk((function (p1__21113_SHARP_){
if((((!((p1__21113_SHARP_ == null)))) && ((((!(typeof p1__21113_SHARP_ === 'string'))) && ((((!(typeof p1__21113_SHARP_ === 'number'))) && ((((!((p1__21113_SHARP_ instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(p1__21113_SHARP_)))) && ((((!(((p1__21113_SHARP_["shared-atom-id"]) == null)))) && ((!(((p1__21113_SHARP_["header-descriptor-idx"]) == null)))))))))))))))){
return ["#cljs-thread/eve-shared-atom {:id ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((p1__21113_SHARP_["shared-atom-id"]))," :idx ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((p1__21113_SHARP_["header-descriptor-idx"])),"}"].join('');
} else {
if((((!((p1__21113_SHARP_ == null)))) && ((((!(typeof p1__21113_SHARP_ === 'string'))) && ((((!(typeof p1__21113_SHARP_ === 'number'))) && ((((!((p1__21113_SHARP_ instanceof cljs.core.Keyword)))) && ((((!(cljs.core.boolean_QMARK_(p1__21113_SHARP_)))) && ((!(((p1__21113_SHARP_["s-atom-env"]) == null)))))))))))))){
return "#cljs-thread/eve-atom {}";
} else {
return p1__21113_SHARP_;

}
}
}),arg);
}),eargs));
} else {
return data;
}
})();
var init_data_js = cljs_thread.strategy.common.embed_init_data_js(data__$1);
var full_source = [init_data_js,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))].join('');
var wt = require('worker_threads');
var WorkerCls = wt.Worker;
var worker_data = (function (){var G__21119 = data__$1;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(data__$1))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21119,new cljs.core.Keyword(null,"__kernel_source","__kernel_source",1368218006),cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source));
} else {
return G__21119;
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
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url))){
} else {
cljs_thread.strategy.fat_kernel.detect_kernel_url_browser_BANG_();
}

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url))){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(["fat-kernel: Could not detect kernel URL.\n","Provide :kernel-url in strategy config or ensure\n","manifest.edn is reachable from <script> tags."].join(''),cljs.core.PersistentArrayMap.EMPTY);
}

var origin = (function (){var or__5045__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_origin);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})();
var entry_url = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url);
var init_data_str = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data], 0));
var bootstrap_js = ["self.addEventListener('message',function __bh(e){","var d=e.data;","console.log('DBG bootstrap msg boot='+!!(d&&d.__cljs_thread_boot)+' url='+(d&&d.__kernel_url));","if(d&&d.__cljs_thread_boot){","self.removeEventListener('message',__bh);","if(d.__eve_sab_config){","self.__eve_sab_config_sync=d.__eve_sab_config;}","if(d.__init_data){","globalThis.__cljs_thread_init_data=d.__init_data;}","var origin=d.__origin||'';","self.__cljs_thread_origin=origin;","var _orig=self.importScripts;","self.importScripts=function(){","var args=Array.from(arguments).map(function(u){","if(!origin||/^(https?:|blob:)/.test(u))return u;","return u.charAt(0)==='/'?origin+u:origin+u;","});","return _orig.apply(self,args);","};","if(typeof document==='undefined'){","self.document={readyState:'complete',","querySelector:function(){return null;},","querySelectorAll:function(){return[];},","createElement:function(){return{};},","head:{appendChild:function(){}},","body:{appendChild:function(){}}};","self.window=self;}","importScripts(d.__kernel_url);","}});"].join('');
var bootstrap_url = cljs_thread.strategy.common.make_blob_url(bootstrap_js);
var w = (new Worker(bootstrap_url));
(w.onmessage = on_message);

var boot_msg_21174 = ({"__cljs_thread_boot": true, "__kernel_url": entry_url, "__origin": origin, "__init_data": init_data_str});
var temp__5823__auto___21175 = cljs.core.deref(cljs_thread.state.eve_sab_config);
if(cljs.core.truth_(temp__5823__auto___21175)){
var eve_config_21176 = temp__5823__auto___21175;
(boot_msg_21174["__eve_sab_config"] = ({"sab": new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_config_21176), "reader-map-sab": new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(eve_config_21176), "slab-sabs": new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008).cljs$core$IFn$_invoke$arity$1(eve_config_21176), "root-sab": new cljs.core.Keyword(null,"root-sab","root-sab",-932837436).cljs$core$IFn$_invoke$arity$1(eve_config_21176)}));
} else {
}

w.postMessage(boot_msg_21174);

setTimeout((function (){
return cljs_thread.strategy.common.revoke_blob_url(bootstrap_url);
}),(10000));

return w;
}
});
/**
 * Set the create-worker-override so all spawns use fat-kernel.
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
 *   :kernel-url        - Explicit kernel entry URL (browser). Skips detection.
 *   :kernel-source-str - Pre-loaded kernel source string (Node.js). Skips detection.
 *   :base-url          - Base URL/dir (currently unused; reserved for future use).
 *   :loadable-modules  - Module URLs for catch-and-load.
 *   :propagate         - Ignored; URLs propagate via s/conf automatically.
 */
cljs_thread.strategy.fat_kernel.install_BANG_ = (function cljs_thread$strategy$fat_kernel$install_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21177 = arguments.length;
var i__5770__auto___21178 = (0);
while(true){
if((i__5770__auto___21178 < len__5769__auto___21177)){
args__5775__auto__.push((arguments[i__5770__auto___21178]));

var G__21179 = (i__5770__auto___21178 + (1));
i__5770__auto___21178 = G__21179;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.strategy.fat_kernel.install_BANG_.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (p__21123){
var vec__21124 = p__21123;
var opts = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21124,(0),null);
var kurl_21182 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.Keyword(null,"kernel-url","kernel-url",-826761845));
var kernel_source_str_21183 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.Keyword(null,"kernel-source-str","kernel-source-str",-747619305));
var loadable_mods_21184 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975));
if(cljs.core.truth_(kurl_21182)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_url,kurl_21182);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,cljs_thread.strategy.common.detect_base_url(kurl_21182));
} else {
}

if(cljs.core.truth_(kernel_source_str_21183)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,cljs_thread.strategy.fat_kernel.strip_shebang(kernel_source_str_21183));
} else {
}

if(((cljs.core.not(kurl_21182)) && (cljs.core.not(kernel_source_str_21183)))){
if(cljs_thread.platform.node_QMARK_){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source))){
} else {
cljs_thread.strategy.fat_kernel.extract_kernel_source_node_BANG_();
}
} else {
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url))){
} else {
cljs_thread.strategy.fat_kernel.detect_kernel_url_browser_BANG_();
}
}
} else {
}

if(cljs.core.truth_(loadable_mods_21184)){
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,loadable_mods_21184);
} else {
}

cljs_thread.strategy.fat_kernel.install_override_BANG_();

var strategy_conf = (function (){var G__21134 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"fat-kernel","fat-kernel",1614893615)], null);
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21134,new cljs.core.Keyword(null,"kernel-url","kernel-url",-826761845),cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url));
} else {
return G__21134;
}
})();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321),strategy_conf);

if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.loadable_modules_config))){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975),cljs.core.deref(cljs_thread.strategy.fat_kernel.loadable_modules_config));
} else {
return null;
}
}));

(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.strategy.fat_kernel.install_BANG_.cljs$lang$applyTo = (function (seq21120){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21120));
}));

/**
 * Remove the fat-kernel override, restoring default create-worker.
 */
cljs_thread.strategy.fat_kernel.uninstall_BANG_ = (function cljs_thread$strategy$fat_kernel$uninstall_BANG_(){
cljs.core.reset_BANG_(cljs_thread.platform.create_worker_override,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_url,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_source,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,null);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.loadable_modules_config,null);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.dissoc,new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321),new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975));
});
/**
 * Auto-detect the core-connect-string.
 * 
 * Browser: probes <script> tags for manifest.edn (via detect-kernel-url-browser!),
 *          returns the pathname of the detected kernel entry URL.
 * Node: returns __filename.
 */
cljs_thread.strategy.fat_kernel.detect_core_connect_string = (function cljs_thread$strategy$fat_kernel$detect_core_connect_string(){
if(cljs_thread.platform.node_QMARK_){
try{return __filename;
}catch (e21136){var _ = e21136;
return null;
}} else {
if(cljs.core.truth_(cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url))){
} else {
cljs_thread.strategy.fat_kernel.detect_kernel_url_browser_BANG_();
}

var temp__5823__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url);
if(cljs.core.truth_(temp__5823__auto__)){
var url = temp__5823__auto__;
try{return (new URL(url)).pathname;
}catch (e21137){var _ = e21137;
return url;
}} else {
return null;
}
}
});
/**
 * Return the detected kernel entry URL.
 * Browser: an http(s):// URL string.
 * Node: nil (Node uses source text, not URLs).
 * Returns nil if detection has not run or failed.
 */
cljs_thread.strategy.fat_kernel.get_kernel_url = (function cljs_thread$strategy$fat_kernel$get_kernel_url(){
return cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url);
});
/**
 * Check conf for fat-kernel strategy settings and re-install if found.
 * Called at namespace load time on workers.
 * 
 * Browser: reads :kernel-url from [:__spawn-strategy :kernel-url].
 * Node:    extracts source from own file / workerData.
 */
cljs_thread.strategy.fat_kernel.auto_install_from_conf_BANG_ = (function cljs_thread$strategy$fat_kernel$auto_install_from_conf_BANG_(conf){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG auto-install-from-conf! env=",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),"strategy=",new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321).cljs$core$IFn$_invoke$arity$1(conf)], 0));

var temp__5823__auto__ = new cljs.core.Keyword(null,"__spawn-strategy","__spawn-strategy",1077206321).cljs$core$IFn$_invoke$arity$1(conf);
if(cljs.core.truth_(temp__5823__auto__)){
var strategy = temp__5823__auto__;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.name(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(strategy)),"fat-kernel")){
if(cljs_thread.platform.node_QMARK_){
cljs_thread.strategy.fat_kernel.self_extract_source_node_BANG_();
} else {
var temp__5823__auto___21188__$1 = new cljs.core.Keyword(null,"kernel-url","kernel-url",-826761845).cljs$core$IFn$_invoke$arity$1(strategy);
if(cljs.core.truth_(temp__5823__auto___21188__$1)){
var url_21189 = temp__5823__auto___21188__$1;
cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_url,url_21189);

cljs.core.reset_BANG_(cljs_thread.strategy.fat_kernel.kernel_origin,cljs_thread.strategy.common.detect_base_url(url_21189));
} else {
}
}

if(cljs.core.truth_((function (){var or__5045__auto__ = cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_url);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.deref(cljs_thread.strategy.fat_kernel.kernel_source);
}
})())){
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
