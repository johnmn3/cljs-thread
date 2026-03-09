goog.provide('cljs_thread.strategy.common');
/**
 * Detect the URL or file path of the currently executing script.
 * Browser: document.currentScript.src or Error stack-trace parsing.
 * Node: __filename.
 */
cljs_thread.strategy.common.detect_self_url = (function cljs_thread$strategy$common$detect_self_url(){
if(cljs_thread.platform.node_QMARK_){
try{return __filename;
}catch (e27468){var _ = e27468;
return null;
}} else {
var or__5045__auto__ = (((((typeof document !== 'undefined')) && ((((typeof document !== 'undefined') && (typeof document.currentScript !== 'undefined')) && ((!((document.currentScript == null))))))))?document.currentScript.src:null);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
try{var stack = (new Error()).stack;
var match = cljs.core.re_find(/(https?:\/\/[^\s\)]+\.js)/,stack);
return cljs.core.second(match);
}catch (e27474){var _ = e27474;
return null;
}}
}
});
/**
 * Get the base URL (directory) from a full URL or path.
 * '/path/to/worker.js' -> '/path/to/'
 * 'http://example.com/js/app.js' -> 'http://example.com/js/'
 */
cljs_thread.strategy.common.detect_base_url = (function cljs_thread$strategy$common$detect_base_url(url){
if(cljs.core.truth_(url)){
var last_slash = url.lastIndexOf("/");
if((last_slash >= (0))){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$3(url,(0),(last_slash + (1)));
} else {
return null;
}
} else {
return null;
}
});
/**
 * Browser: create a Blob URL from a JavaScript code string.
 */
cljs_thread.strategy.common.make_blob_url = (function cljs_thread$strategy$common$make_blob_url(code_str){
var blob = (new Blob([code_str],({"type": "application/javascript"})));
return URL.createObjectURL(blob);
});
/**
 * Browser: revoke a previously created Blob URL.
 */
cljs_thread.strategy.common.revoke_blob_url = (function cljs_thread$strategy$common$revoke_blob_url(url){
return URL.revokeObjectURL(url);
});
/**
 * Browser: create a Worker from an inline JavaScript string via Blob URL.
 * Returns {:worker w :blob-url url} so caller can revoke the URL.
 */
cljs_thread.strategy.common.create_blob_worker = (function cljs_thread$strategy$common$create_blob_worker(code_str,on_message){
var url = cljs_thread.strategy.common.make_blob_url(code_str);
var w = (new Worker(url));
(w.onmessage = on_message);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"worker","worker",938239996),w,new cljs.core.Keyword(null,"blob-url","blob-url",507818262),url], null);
});
/**
 * Node: create a worker_thread from an inline JavaScript string.
 * Uses the {eval: true} option.
 */
cljs_thread.strategy.common.create_eval_worker = (function cljs_thread$strategy$common$create_eval_worker(code_str,worker_data,on_message){
var wt = require('worker_threads');
var WorkerCls = wt.Worker;
var w = (new WorkerCls(code_str,({"eval": true, "workerData": cljs.core.clj__GT_js(worker_data)})));
w.on("message",on_message);

return w;
});
/**
 * Generate a JS expression that sets globalThis.__cljs_thread_init_data
 * to the given ClojureScript data map (serialized as EDN string).
 * Uses JSON.stringify at generation time to safely escape the EDN for JS.
 */
cljs_thread.strategy.common.embed_init_data_js = (function cljs_thread$strategy$common$embed_init_data_js(data){
var edn_str = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data], 0));
var js_str = JSON.stringify(edn_str);
return ["globalThis.__cljs_thread_init_data = ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_str),";\n"].join('');
});
/**
 * Read init data from globalThis.__cljs_thread_init_data if present.
 * Returns nil if not set.
 */
cljs_thread.strategy.common.read_embedded_init_data = (function cljs_thread$strategy$common$read_embedded_init_data(){
if((typeof globalThis !== 'undefined') && (typeof globalThis.__cljs_thread_init_data !== 'undefined')){
try{return cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1(globalThis.__cljs_thread_init_data);
}catch (e27481){var _ = e27481;
return null;
}} else {
return null;
}
});
/**
 * Extract the origin (protocol + host + port) from a URL.
 * E.g. 'http://localhost:9092/shared.js' -> 'http://localhost:9092'
 */
cljs_thread.strategy.common.extract_origin = (function cljs_thread$strategy$common$extract_origin(url){
try{var u = (new URL(url));
return u.origin;
}catch (e27490){var _ = e27490;
return null;
}});
/**
 * JS snippet that wraps self.importScripts to resolve relative URLs
 * using globalThis.__cljs_thread_origin. Blob workers have null origin,
 * so relative importScripts calls fail without this.
 */
cljs_thread.strategy.common.import_scripts_resolver_js = "(function(){\n  var _orig = self.importScripts;\n  self.importScripts = function(){\n    var origin = self.__cljs_thread_origin || '';\n    var args = Array.from(arguments).map(function(url){\n      if (!origin || /^(https?:|blob:)/.test(url)) return url;\n      return url.charAt(0) === '/' ? origin + url : origin + '/' + url;\n    });\n    return _orig.apply(self, args);\n  };\n})();\n";
/**
 * Given a base URL and a seq of relative script paths, return absolute URLs.
 * E.g. (resolve-script-urls 'http://x.com/js/' ['shared.js' 'core.js'])
 *      => ['http://x.com/js/shared.js' 'http://x.com/js/core.js']
 */
cljs_thread.strategy.common.resolve_script_urls = (function cljs_thread$strategy$common$resolve_script_urls(base_url,scripts){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27491_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url),cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__27491_SHARP_)].join('');
}),scripts);
});
/**
 * Given a base directory and a seq of relative file paths, return absolute paths.
 * Uses Node's path.resolve.
 */
cljs_thread.strategy.common.resolve_node_paths = (function cljs_thread$strategy$common$resolve_node_paths(base_dir,scripts){
var path = require('path');
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27492_SHARP_){
return path.resolve(base_dir,p1__27492_SHARP_);
}),scripts);
});

//# sourceMappingURL=cljs_thread.strategy.common.js.map
