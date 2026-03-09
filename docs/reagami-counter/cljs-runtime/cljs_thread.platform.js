goog.provide('cljs_thread.platform');
/**
 * True when running in Node.js (main thread or worker_thread).
 */
cljs_thread.platform.node_QMARK_ = (((typeof process !== 'undefined')) && ((((typeof process !== 'undefined') && (typeof process.versions !== 'undefined')) && ((!((process.versions.node == null)))))));
/**
 * The Node.js worker_threads module, or nil in browser.
 */
cljs_thread.platform.wt = ((cljs_thread.platform.node_QMARK_)?(function (){try{return require('worker_threads');
}catch (e19994){var _ = e19994;
return null;
}})():null);
/**
 * Cached at module load time to be immune to dom-proxy interference.
 * True on Node main thread, false on worker_threads.
 */
cljs_thread.platform.node_is_main_thread_cached_QMARK_ = (cljs.core.truth_(cljs_thread.platform.wt)?cljs_thread.platform.wt.isMainThread:false);
/**
 * True when SAB-based sync is available in the browser.
 * Requires cross-origin isolation (COOP/COEP headers).
 * When true, browser workers block via Atomics.wait instead of XHR+SW.
 * Can be overridden to false via `force-sw-sync!` before `init!`.
 */
cljs_thread.platform.sab_sync_QMARK_ = (((!(cljs_thread.platform.node_QMARK_))) && ((((typeof SharedArrayBuffer !== 'undefined')) && ((typeof Atomics !== 'undefined')))));
/**
 * Set to true by force-sw-sync! so that spawned workers can inherit the override.
 */
cljs_thread.platform.force_sw_sync_flag = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
/**
 * Returns true if force-sw-sync! was called (or should be inherited).
 */
cljs_thread.platform.force_sw_sync_requested_QMARK_ = (function cljs_thread$platform$force_sw_sync_requested_QMARK_(){
return cljs.core.deref(cljs_thread.platform.force_sw_sync_flag);
});
/**
 * Force the Service Worker sync path even when SharedArrayBuffer is available.
 * Call BEFORE init!. Useful for testing the SW fallback with full SAB data
 * structures still backed by SharedArrayBuffer.
 * Propagates to spawned workers via s/conf :force-sw-sync.
 */
cljs_thread.platform.force_sw_sync_BANG_ = (function cljs_thread$platform$force_sw_sync_BANG_(){
(cljs_thread.platform.sab_sync_QMARK_ = false);

return cljs.core.reset_BANG_(cljs_thread.platform.force_sw_sync_flag,true);
});
goog.exportSymbol('cljs_thread.platform.force_sw_sync_BANG_', cljs_thread.platform.force_sw_sync_BANG_);

/**
 * @interface
 */
cljs_thread.platform.IEnv = function(){};

var cljs_thread$platform$IEnv$_init_data$dyn_20312 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._init_data[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._init_data["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IEnv.-init-data",this$);
}
}
});
cljs_thread.platform._init_data = (function cljs_thread$platform$_init_data(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IEnv$_init_data$arity$1 == null)))))){
return this$.cljs_thread$platform$IEnv$_init_data$arity$1(this$);
} else {
return cljs_thread$platform$IEnv$_init_data$dyn_20312(this$);
}
});

var cljs_thread$platform$IEnv$_in_screen_QMARK_$dyn_20313 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._in_screen_QMARK_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._in_screen_QMARK_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IEnv.-in-screen?",this$);
}
}
});
cljs_thread.platform._in_screen_QMARK_ = (function cljs_thread$platform$_in_screen_QMARK_(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IEnv$_in_screen_QMARK_$arity$1 == null)))))){
return this$.cljs_thread$platform$IEnv$_in_screen_QMARK_$arity$1(this$);
} else {
return cljs_thread$platform$IEnv$_in_screen_QMARK_$dyn_20313(this$);
}
});

var cljs_thread$platform$IEnv$_close_self_BANG_$dyn_20314 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._close_self_BANG_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._close_self_BANG_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IEnv.-close-self!",this$);
}
}
});
cljs_thread.platform._close_self_BANG_ = (function cljs_thread$platform$_close_self_BANG_(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IEnv$_close_self_BANG_$arity$1 == null)))))){
return this$.cljs_thread$platform$IEnv$_close_self_BANG_$arity$1(this$);
} else {
return cljs_thread$platform$IEnv$_close_self_BANG_$dyn_20314(this$);
}
});


/**
 * @interface
 */
cljs_thread.platform.IWorker = function(){};

var cljs_thread$platform$IWorker$_create_worker$dyn_20315 = (function (this$,url_or_path,data,on_message){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._create_worker[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$4(this$,url_or_path,data,on_message) : m__5394__auto__.call(null, this$,url_or_path,data,on_message));
} else {
var m__5392__auto__ = (cljs_thread.platform._create_worker["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$4(this$,url_or_path,data,on_message) : m__5392__auto__.call(null, this$,url_or_path,data,on_message));
} else {
throw cljs.core.missing_protocol("IWorker.-create-worker",this$);
}
}
});
cljs_thread.platform._create_worker = (function cljs_thread$platform$_create_worker(this$,url_or_path,data,on_message){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IWorker$_create_worker$arity$4 == null)))))){
return this$.cljs_thread$platform$IWorker$_create_worker$arity$4(this$,url_or_path,data,on_message);
} else {
return cljs_thread$platform$IWorker$_create_worker$dyn_20315(this$,url_or_path,data,on_message);
}
});

var cljs_thread$platform$IWorker$_register_coordinator$dyn_20316 = (function (this$,config,callback){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._register_coordinator[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$3(this$,config,callback) : m__5394__auto__.call(null, this$,config,callback));
} else {
var m__5392__auto__ = (cljs_thread.platform._register_coordinator["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$3(this$,config,callback) : m__5392__auto__.call(null, this$,config,callback));
} else {
throw cljs.core.missing_protocol("IWorker.-register-coordinator",this$);
}
}
});
cljs_thread.platform._register_coordinator = (function cljs_thread$platform$_register_coordinator(this$,config,callback){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IWorker$_register_coordinator$arity$3 == null)))))){
return this$.cljs_thread$platform$IWorker$_register_coordinator$arity$3(this$,config,callback);
} else {
return cljs_thread$platform$IWorker$_register_coordinator$dyn_20316(this$,config,callback);
}
});

var cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$dyn_20317 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._coordinator_ready_QMARK_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._coordinator_ready_QMARK_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IWorker.-coordinator-ready?",this$);
}
}
});
cljs_thread.platform._coordinator_ready_QMARK_ = (function cljs_thread$platform$_coordinator_ready_QMARK_(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$arity$1 == null)))))){
return this$.cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$arity$1(this$);
} else {
return cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$dyn_20317(this$);
}
});


/**
 * Sync primitives for Service Worker fallback path.
 * Direct SAB sync (the primary path) doesn't use this protocol -
 * it uses sync channels passed directly in messages.
 * @interface
 */
cljs_thread.platform.ISync = function(){};

var cljs_thread$platform$ISync$_request$dyn_20318 = (function (this$,getter,opts){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._request[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$3(this$,getter,opts) : m__5394__auto__.call(null, this$,getter,opts));
} else {
var m__5392__auto__ = (cljs_thread.platform._request["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$3(this$,getter,opts) : m__5392__auto__.call(null, this$,getter,opts));
} else {
throw cljs.core.missing_protocol("ISync.-request",this$);
}
}
});
cljs_thread.platform._request = (function cljs_thread$platform$_request(this$,getter,opts){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$ISync$_request$arity$3 == null)))))){
return this$.cljs_thread$platform$ISync$_request$arity$3(this$,getter,opts);
} else {
return cljs_thread$platform$ISync$_request$dyn_20318(this$,getter,opts);
}
});

var cljs_thread$platform$ISync$_send_response$dyn_20319 = (function (this$,payload){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._send_response[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,payload) : m__5394__auto__.call(null, this$,payload));
} else {
var m__5392__auto__ = (cljs_thread.platform._send_response["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,payload) : m__5392__auto__.call(null, this$,payload));
} else {
throw cljs.core.missing_protocol("ISync.-send-response",this$);
}
}
});
cljs_thread.platform._send_response = (function cljs_thread$platform$_send_response(this$,payload){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$ISync$_send_response$arity$2 == null)))))){
return this$.cljs_thread$platform$ISync$_send_response$arity$2(this$,payload);
} else {
return cljs_thread$platform$ISync$_send_response$dyn_20319(this$,payload);
}
});

var cljs_thread$platform$ISync$_sleep$dyn_20320 = (function (this$,ms){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._sleep[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(this$,ms) : m__5394__auto__.call(null, this$,ms));
} else {
var m__5392__auto__ = (cljs_thread.platform._sleep["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(this$,ms) : m__5392__auto__.call(null, this$,ms));
} else {
throw cljs.core.missing_protocol("ISync.-sleep",this$);
}
}
});
cljs_thread.platform._sleep = (function cljs_thread$platform$_sleep(this$,ms){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$ISync$_sleep$arity$2 == null)))))){
return this$.cljs_thread$platform$ISync$_sleep$arity$2(this$,ms);
} else {
return cljs_thread$platform$ISync$_sleep$dyn_20320(this$,ms);
}
});


/**
 * @interface
 */
cljs_thread.platform.IMsg = function(){};

var cljs_thread$platform$IMsg$_listen$dyn_20321 = (function (this$,target,handler){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._listen[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$3(this$,target,handler) : m__5394__auto__.call(null, this$,target,handler));
} else {
var m__5392__auto__ = (cljs_thread.platform._listen["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$3(this$,target,handler) : m__5392__auto__.call(null, this$,target,handler));
} else {
throw cljs.core.missing_protocol("IMsg.-listen",this$);
}
}
});
cljs_thread.platform._listen = (function cljs_thread$platform$_listen(this$,target,handler){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IMsg$_listen$arity$3 == null)))))){
return this$.cljs_thread$platform$IMsg$_listen$arity$3(this$,target,handler);
} else {
return cljs_thread$platform$IMsg$_listen$dyn_20321(this$,target,handler);
}
});

var cljs_thread$platform$IMsg$_post_message$dyn_20322 = (function (this$,target,msg,transferables){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._post_message[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$4(this$,target,msg,transferables) : m__5394__auto__.call(null, this$,target,msg,transferables));
} else {
var m__5392__auto__ = (cljs_thread.platform._post_message["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$4(this$,target,msg,transferables) : m__5392__auto__.call(null, this$,target,msg,transferables));
} else {
throw cljs.core.missing_protocol("IMsg.-post-message",this$);
}
}
});
cljs_thread.platform._post_message = (function cljs_thread$platform$_post_message(this$,target,msg,transferables){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IMsg$_post_message$arity$4 == null)))))){
return this$.cljs_thread$platform$IMsg$_post_message$arity$4(this$,target,msg,transferables);
} else {
return cljs_thread$platform$IMsg$_post_message$dyn_20322(this$,target,msg,transferables);
}
});

var cljs_thread$platform$IMsg$_mk_channel$dyn_20323 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._mk_channel[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._mk_channel["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IMsg.-mk-channel",this$);
}
}
});
cljs_thread.platform._mk_channel = (function cljs_thread$platform$_mk_channel(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IMsg$_mk_channel$arity$1 == null)))))){
return this$.cljs_thread$platform$IMsg$_mk_channel$arity$1(this$);
} else {
return cljs_thread$platform$IMsg$_mk_channel$dyn_20323(this$);
}
});

var cljs_thread$platform$IMsg$_self_ref$dyn_20324 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (cljs_thread.platform._self_ref[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (cljs_thread.platform._self_ref["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IMsg.-self-ref",this$);
}
}
});
cljs_thread.platform._self_ref = (function cljs_thread$platform$_self_ref(this$){
if((((!((this$ == null)))) && ((!((this$.cljs_thread$platform$IMsg$_self_ref$arity$1 == null)))))){
return this$.cljs_thread$platform$IMsg$_self_ref$arity$1(this$);
} else {
return cljs_thread$platform$IMsg$_self_ref$dyn_20324(this$);
}
});

/**
 * True on the browser main thread (window context), false in Web Workers.
 * Uses `(instance? js/Window js/self)` which is immune to dom-proxy —
 * dom-proxy defines `window` and `document` properties on worker globalThis
 * but cannot fake the prototype chain of `self`.
 */
cljs_thread.platform.browser_in_screen_QMARK_ = (function cljs_thread$platform$browser_in_screen_QMARK_(){
return (((typeof self !== 'undefined')) && ((((typeof Window !== 'undefined')) && ((self instanceof Window)))));
});
/**
 * Resolve a relative URL path to absolute.
 * In blob workers, js/location.origin is 'null', so we use the
 * __cljs_thread_origin global set by spawn strategies.
 * Already-absolute URLs (http/https/blob) are returned as-is.
 */
cljs_thread.platform.resolve_url = (function cljs_thread$platform$resolve_url(path){
if((((typeof globalThis !== 'undefined') && (typeof globalThis.__cljs_thread_origin !== 'undefined')) && ((((!((globalThis.__cljs_thread_origin == null)))) && (cljs.core.not((function (){var or__5045__auto__ = path.startsWith("http://");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = path.startsWith("https://");
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return path.startsWith("blob:");
}
}
})())))))){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(globalThis.__cljs_thread_origin),cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)].join('');
} else {
return path;
}
});
cljs_thread.platform.browser_init_data = (function cljs_thread$platform$browser_init_data(){
if((((typeof globalThis !== 'undefined')) && ((((typeof globalThis !== 'undefined') && (typeof globalThis.__cljs_thread_init_data !== 'undefined')) && ((!((globalThis.__cljs_thread_init_data == null)))))))){
return clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(globalThis.__cljs_thread_init_data);
} else {
if(cljs_thread.platform.browser_in_screen_QMARK_()){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"screen","screen",1990059748)], null);
} else {
if(cljs.core.seq(location.search)){
return cljs_thread.util.decode_qp(location.search);
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453)], null);

}
}
}
});
/**
 * SW-based sync request. Uses sync XHR to /intercept/request/key.js.
 * The SW holds the request open until a matching response arrives.
 */
cljs_thread.platform.browser_sw_request = (function cljs_thread$platform$browser_sw_request(getter,opts,env_data){
var map__20031 = opts;
var map__20031__$1 = cljs.core.__destructure_map(map__20031);
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20031__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
var reject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20031__$1,new cljs.core.Keyword(null,"reject","reject",1415953113));
var no_park = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20031__$1,new cljs.core.Keyword(null,"no-park","no-park",-2136886220));
var max_time = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20031__$1,new cljs.core.Keyword(null,"max-time","max-time",857408479));
var duration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20031__$1,new cljs.core.Keyword(null,"duration","duration",1444101068));
var req = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),getter,new cljs.core.Keyword(null,"requester","requester",2032946161),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(env_data),new cljs.core.Keyword(null,"no-park","no-park",-2136886220),no_park,new cljs.core.Keyword(null,"max-time","max-time",857408479),max_time,new cljs.core.Keyword(null,"duration","duration",1444101068),duration], null);
try{var xhr = (new XMLHttpRequest());
xhr.open("GET",cljs_thread.platform.resolve_url(["/intercept/request/key.js",cljs_thread.util.encode_qp(req)].join('')),(cljs.core.truth_((function (){var or__5045__auto__ = cljs_thread.platform.browser_in_screen_QMARK_();
if(or__5045__auto__){
return or__5045__auto__;
} else {
return resolve;
}
})())?true:false));

xhr.setRequestHeader("cache-control","no-cache, no-store, max-age=0");

if(cljs.core.truth_(resolve)){
(xhr.onload = (function (){
var G__20033 = clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(xhr.response);
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(G__20033) : resolve.call(null, G__20033));
}));
} else {
}

if(cljs.core.truth_(reject)){
(xhr.onerror = (function (){
var G__20034 = xhr.status;
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__20034) : reject.call(null, G__20034));
}));
} else {
}

xhr.send();

if(cljs.core.truth_(resolve)){
return xhr;
} else {
return clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(xhr.responseText);
}
}catch (e20032){var e = e20032;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"repl-sync","repl-sync",-497551094),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(env_data))){
return null;
} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"requesting-response","requesting-response",1491592878),new cljs.core.Keyword(null,"e","e",1381269198),e], 0));
}
}});
/**
 * SW-based send-response. POSTs to /intercept/response/key.js.
 */
cljs_thread.platform.browser_sw_send_response = (function cljs_thread$platform$browser_sw_send_response(payload,env_data){
try{var req = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"responder","responder",599017945),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(env_data)], null);
var xhr = (new XMLHttpRequest());
xhr.open("POST",cljs_thread.platform.resolve_url(["/intercept/response/key.js",cljs_thread.util.encode_qp(req)].join('')));

xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");

xhr.setRequestHeader("cache-control","no-cache, no-store, max-age=0");

xhr.send(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([payload], 0)));

return null;
}catch (e20035){var e = e20035;
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"sending-response","sending-response",-726471553),new cljs.core.Keyword(null,"e","e",1381269198),e], 0));
}});
/**
 * SW-based sleep. Uses sync XHR to /intercept/sleep/t.js.
 */
cljs_thread.platform.browser_sw_sleep = (function cljs_thread$platform$browser_sw_sleep(ms){
var xhr = (new XMLHttpRequest());
xhr.open("GET",cljs_thread.platform.resolve_url(["/intercept/sleep/t.js?",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ms)].join('')),false);

xhr.setRequestHeader("cache-control","no-cache, no-store, max-age=0");

xhr.send("request");

return null;
});
cljs_thread.platform.after_sw_registration = (function cljs_thread$platform$after_sw_registration(p,afn){
return p.then((function (p1__20036_SHARP_){
if(cljs.core.truth_((function (){var or__5045__auto__ = p1__20036_SHARP_.active;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return p1__20036_SHARP_.installing;
}
})())){
return (afn.cljs$core$IFn$_invoke$arity$1 ? afn.cljs$core$IFn$_invoke$arity$1(p1__20036_SHARP_) : afn.call(null, p1__20036_SHARP_));
} else {
if(cljs.core.truth_(p1__20036_SHARP_.installing)){
return p1__20036_SHARP_.installing.addEventListener("onstatechange",cljs.core.partial.cljs$core$IFn$_invoke$arity$2(afn,p1__20036_SHARP_));
} else {
return null;
}
}
}));
});
cljs_thread.platform.on_sw_registration = (function cljs_thread$platform$on_sw_registration(cb,else_cb){
return navigator.serviceWorker.getRegistration().then((function (){
if(cljs.core.truth_(navigator.serviceWorker.controller)){
return (cb.cljs$core$IFn$_invoke$arity$0 ? cb.cljs$core$IFn$_invoke$arity$0() : cb.call(null, ));
} else {
return (else_cb.cljs$core$IFn$_invoke$arity$0 ? else_cb.cljs$core$IFn$_invoke$arity$0() : else_cb.call(null, ));
}
}));
});
/**
 * Thread sleep using Atomics.wait with timeout.
 * Works in both browser workers and Node worker_threads.
 */
cljs_thread.platform.atomics_sleep = (function cljs_thread$platform$atomics_sleep(ms){
var sab = (new SharedArrayBuffer((4)));
var i32 = (new Int32Array(sab));
Atomics.wait(i32,(0),(0),ms);

return null;
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs_thread.platform.IEnv}
 * @implements {cljs_thread.platform.IWorker}
 * @implements {cljs_thread.platform.IMsg}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.platform.ISync}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
cljs_thread.platform.BrowserPlatform = (function (env_data_cache,__meta,__extmap,__hash){
this.env_data_cache = env_data_cache;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5343__auto__,k__5344__auto__){
var self__ = this;
var this__5343__auto____$1 = this;
return this__5343__auto____$1.cljs$core$ILookup$_lookup$arity$3(null, k__5344__auto__,null);
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k20038,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__20056 = k20038;
var G__20056__$1 = (((G__20056 instanceof cljs.core.Keyword))?G__20056.fqn:null);
switch (G__20056__$1) {
case "env-data-cache":
return self__.env_data_cache;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k20038,else__5346__auto__);

}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__20059){
var vec__20060 = p__20059;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20060,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20060,(1),null);
return (f__5364__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5364__auto__.cljs$core$IFn$_invoke$arity$3(ret__5366__auto__,k__5367__auto__,v__5368__auto__) : f__5364__auto__.call(null, ret__5366__auto__,k__5367__auto__,v__5368__auto__));
}),init__5365__auto__,this__5363__auto____$1);
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5358__auto__,writer__5359__auto__,opts__5360__auto__){
var self__ = this;
var this__5358__auto____$1 = this;
var pr_pair__5361__auto__ = (function (keyval__5362__auto__){
return cljs.core.pr_sequential_writer(writer__5359__auto__,cljs.core.pr_writer,""," ","",opts__5360__auto__,keyval__5362__auto__);
});
return cljs.core.pr_sequential_writer(writer__5359__auto__,pr_pair__5361__auto__,"#cljs-thread.platform.BrowserPlatform{",", ","}",opts__5360__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),self__.env_data_cache],null))], null),self__.__extmap));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__20037){
var self__ = this;
var G__20037__$1 = this;
return (new cljs.core.RecordIter((0),G__20037__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5341__auto__){
var self__ = this;
var this__5341__auto____$1 = this;
return self__.__meta;
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5338__auto__){
var self__ = this;
var this__5338__auto____$1 = this;
return (new cljs_thread.platform.BrowserPlatform(self__.env_data_cache,self__.__meta,self__.__extmap,self__.__hash));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5347__auto__){
var self__ = this;
var this__5347__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IMsg$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IMsg$_listen$arity$3 = (function (_,target,handler){
var self__ = this;
var ___$1 = this;
return target.addEventListener("message",handler);
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IMsg$_post_message$arity$4 = (function (_,target,msg,transferables){
var self__ = this;
var ___$1 = this;
return target.postMessage(msg,(cljs.core.truth_(transferables)?cljs.core.clj__GT_js(transferables):[]));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IMsg$_mk_channel$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var c = (new MessageChannel());
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c.port1,c.port2], null);
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IMsg$_self_ref$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self;
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5339__auto__){
var self__ = this;
var this__5339__auto____$1 = this;
var h__5154__auto__ = self__.__hash;
if((!((h__5154__auto__ == null)))){
return h__5154__auto__;
} else {
var h__5154__auto____$1 = (function (coll__5340__auto__){
return (-1031408138 ^ cljs.core.hash_unordered_coll(coll__5340__auto__));
})(this__5339__auto____$1);
(self__.__hash = h__5154__auto____$1);

return h__5154__auto____$1;
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this20039,other20040){
var self__ = this;
var this20039__$1 = this;
return (((!((other20040 == null)))) && ((((this20039__$1.constructor === other20040.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this20039__$1.env_data_cache,other20040.env_data_cache)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this20039__$1.__extmap,other20040.__extmap)))))));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IWorker$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IWorker$_create_worker$arity$4 = (function (_,url,data,on_message){
var self__ = this;
var ___$1 = this;
var full_url = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.platform.resolve_url(url)),cljs_thread.util.encode_qp(data)].join('');
var w = (new Worker(full_url));
(w.onmessage = on_message);

return w;
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IWorker$_register_coordinator$arity$3 = (function (_,config,callback){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
return (callback.cljs$core$IFn$_invoke$arity$0 ? callback.cljs$core$IFn$_invoke$arity$0() : callback.call(null, ));
} else {
var sw_url = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247).cljs$core$IFn$_invoke$arity$2(config,"/sw.js")),cljs_thread.util.encode_qp(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"sw","sw",833113913)], null))].join('');
return cljs_thread.platform.on_sw_registration(callback,(function (){
return cljs_thread.platform.after_sw_registration(navigator.serviceWorker.register(sw_url),(function (___$2){
return (callback.cljs$core$IFn$_invoke$arity$0 ? callback.cljs$core$IFn$_invoke$arity$0() : callback.call(null, ));
}));
}));
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
return true;
} else {
return cljs.core.boolean$(navigator.serviceWorker.controller);
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$ISync$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$ISync$_request$arity$3 = (function (this$,getter,opts){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Direct SAB sync should use sync channels, not platform request",cljs.core.PersistentArrayMap.EMPTY);
} else {
return cljs_thread.platform.browser_sw_request(getter,opts,this$__$1.cljs_thread$platform$IEnv$_init_data$arity$1(null, ));
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$ISync$_send_response$arity$2 = (function (this$,payload){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Direct SAB sync should use sync channels, not platform send-response",cljs.core.PersistentArrayMap.EMPTY);
} else {
return cljs_thread.platform.browser_sw_send_response(payload,this$__$1.cljs_thread$platform$IEnv$_init_data$arity$1(null, ));
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$ISync$_sleep$arity$2 = (function (_,ms){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
return cljs_thread.platform.atomics_sleep(ms);
} else {
return cljs_thread.platform.browser_sw_sleep(ms);
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5353__auto__,k__5354__auto__){
var self__ = this;
var this__5353__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),null], null), null),k__5354__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5353__auto____$1),self__.__meta),k__5354__auto__);
} else {
return (new cljs_thread.platform.BrowserPlatform(self__.env_data_cache,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5354__auto__)),null));
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IEnv$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IEnv$_init_data$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var temp__5821__auto__ = cljs.core.deref(self__.env_data_cache);
if(cljs.core.truth_(temp__5821__auto__)){
var cached = temp__5821__auto__;
return cached;
} else {
var d = cljs_thread.platform.browser_init_data();
cljs.core.reset_BANG_(self__.env_data_cache,d);

return d;
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IEnv$_in_screen_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs_thread.platform.browser_in_screen_QMARK_();
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs_thread$platform$IEnv$_close_self_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self.close();
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k20038){
var self__ = this;
var this__5350__auto____$1 = this;
var G__20182 = k20038;
var G__20182__$1 = (((G__20182 instanceof cljs.core.Keyword))?G__20182.fqn:null);
switch (G__20182__$1) {
case "env-data-cache":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k20038);

}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__20037){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__20208 = cljs.core.keyword_identical_QMARK_;
var expr__20209 = k__5352__auto__;
if(cljs.core.truth_((pred__20208.cljs$core$IFn$_invoke$arity$2 ? pred__20208.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),expr__20209) : pred__20208.call(null, new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),expr__20209)))){
return (new cljs_thread.platform.BrowserPlatform(G__20037,self__.__meta,self__.__extmap,null));
} else {
return (new cljs_thread.platform.BrowserPlatform(self__.env_data_cache,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__20037),null));
}
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),self__.env_data_cache,null))], null),self__.__extmap));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__20037){
var self__ = this;
var this__5342__auto____$1 = this;
return (new cljs_thread.platform.BrowserPlatform(self__.env_data_cache,G__20037,self__.__extmap,self__.__hash));
}));

(cljs_thread.platform.BrowserPlatform.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5348__auto__,entry__5349__auto__){
var self__ = this;
var this__5348__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5349__auto__)){
return this__5348__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core._nth(entry__5349__auto__,(0)),cljs.core._nth(entry__5349__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5348__auto____$1,entry__5349__auto__);
}
}));

(cljs_thread.platform.BrowserPlatform.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"env-data-cache","env-data-cache",153305108,null)], null);
}));

(cljs_thread.platform.BrowserPlatform.cljs$lang$type = true);

(cljs_thread.platform.BrowserPlatform.cljs$lang$ctorPrSeq = (function (this__5389__auto__){
return (new cljs.core.List(null,"cljs-thread.platform/BrowserPlatform",null,(1),null));
}));

(cljs_thread.platform.BrowserPlatform.cljs$lang$ctorPrWriter = (function (this__5389__auto__,writer__5390__auto__){
return cljs.core._write(writer__5390__auto__,"cljs-thread.platform/BrowserPlatform");
}));

/**
 * Positional factory function for cljs-thread.platform/BrowserPlatform.
 */
cljs_thread.platform.__GT_BrowserPlatform = (function cljs_thread$platform$__GT_BrowserPlatform(env_data_cache){
return (new cljs_thread.platform.BrowserPlatform(env_data_cache,null,null,null));
});

/**
 * Factory function for cljs-thread.platform/BrowserPlatform, taking a map of keywords to field values.
 */
cljs_thread.platform.map__GT_BrowserPlatform = (function cljs_thread$platform$map__GT_BrowserPlatform(G__20041){
var extmap__5385__auto__ = (function (){var G__20261 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__20041,new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419));
if(cljs.core.record_QMARK_(G__20041)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__20261);
} else {
return G__20261;
}
})();
return (new cljs_thread.platform.BrowserPlatform(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419).cljs$core$IFn$_invoke$arity$1(G__20041),null,cljs.core.not_empty(extmap__5385__auto__),null));
});

/**
 * Returns cached isMainThread value. Cached at load time to be
 * immune to dom-proxy interference.
 */
cljs_thread.platform.node_in_screen_QMARK_ = (function cljs_thread$platform$node_in_screen_QMARK_(){
return cljs_thread.platform.node_is_main_thread_cached_QMARK_;
});
cljs_thread.platform.node_init_data = (function cljs_thread$platform$node_init_data(){
if(cljs.core.truth_(cljs_thread.platform.node_in_screen_QMARK_())){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"screen","screen",1990059748)], null);
} else {
var temp__5821__auto__ = (function (){var and__5043__auto__ = cljs_thread.platform.wt;
if(cljs.core.truth_(and__5043__auto__)){
return cljs_thread.platform.wt.workerData;
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(temp__5821__auto__)){
var wd = temp__5821__auto__;
var _ = (function (){var temp__5823__auto__ = (wd["__eve_sab_config"]);
if(cljs.core.truth_(temp__5823__auto__)){
var eve_cfg = temp__5823__auto__;
return (globalThis.__eve_sab_config = eve_cfg);
} else {
return null;
}
})();
var ___$1 = delete wd["__eve_sab_config"];
var d = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(wd,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var G__20290 = cljs.core.update.cljs$core$IFn$_invoke$arity$3(d,new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.keyword);
if(cljs.core.truth_(new cljs.core.Keyword(null,"caller","caller",-1275362879).cljs$core$IFn$_invoke$arity$1(d))){
return cljs.core.update.cljs$core$IFn$_invoke$arity$3(G__20290,new cljs.core.Keyword(null,"caller","caller",-1275362879),cljs.core.keyword);
} else {
return G__20290;
}
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453)], null);
}
}
});
/**
 * Thread sleep using Atomics.wait with timeout.
 */
cljs_thread.platform.node_sleep = (function cljs_thread$platform$node_sleep(ms){
var sab = (new SharedArrayBuffer((4)));
var i32 = (new Int32Array(sab));
Atomics.wait(i32,(0),(0),ms);

return null;
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs_thread.platform.IEnv}
 * @implements {cljs_thread.platform.IWorker}
 * @implements {cljs_thread.platform.IMsg}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.platform.ISync}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
cljs_thread.platform.NodePlatform = (function (env_data_cache,__meta,__extmap,__hash){
this.env_data_cache = env_data_cache;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(cljs_thread.platform.NodePlatform.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5343__auto__,k__5344__auto__){
var self__ = this;
var this__5343__auto____$1 = this;
return this__5343__auto____$1.cljs$core$ILookup$_lookup$arity$3(null, k__5344__auto__,null);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k20295,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__20302 = k20295;
var G__20302__$1 = (((G__20302 instanceof cljs.core.Keyword))?G__20302.fqn:null);
switch (G__20302__$1) {
case "env-data-cache":
return self__.env_data_cache;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k20295,else__5346__auto__);

}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__20303){
var vec__20304 = p__20303;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20304,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20304,(1),null);
return (f__5364__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5364__auto__.cljs$core$IFn$_invoke$arity$3(ret__5366__auto__,k__5367__auto__,v__5368__auto__) : f__5364__auto__.call(null, ret__5366__auto__,k__5367__auto__,v__5368__auto__));
}),init__5365__auto__,this__5363__auto____$1);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5358__auto__,writer__5359__auto__,opts__5360__auto__){
var self__ = this;
var this__5358__auto____$1 = this;
var pr_pair__5361__auto__ = (function (keyval__5362__auto__){
return cljs.core.pr_sequential_writer(writer__5359__auto__,cljs.core.pr_writer,""," ","",opts__5360__auto__,keyval__5362__auto__);
});
return cljs.core.pr_sequential_writer(writer__5359__auto__,pr_pair__5361__auto__,"#cljs-thread.platform.NodePlatform{",", ","}",opts__5360__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),self__.env_data_cache],null))], null),self__.__extmap));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__20294){
var self__ = this;
var G__20294__$1 = this;
return (new cljs.core.RecordIter((0),G__20294__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5341__auto__){
var self__ = this;
var this__5341__auto____$1 = this;
return self__.__meta;
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5338__auto__){
var self__ = this;
var this__5338__auto____$1 = this;
return (new cljs_thread.platform.NodePlatform(self__.env_data_cache,self__.__meta,self__.__extmap,self__.__hash));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5347__auto__){
var self__ = this;
var this__5347__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IMsg$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IMsg$_listen$arity$3 = (function (_,target,handler){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((function (){var and__5043__auto__ = target;
if(cljs.core.truth_(and__5043__auto__)){
return target.on;
} else {
return and__5043__auto__;
}
})())){
return target.on("message",handler);
} else {
return null;
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IMsg$_post_message$arity$4 = (function (_,target,msg,transferables){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((function (){var and__5043__auto__ = target;
if(cljs.core.truth_(and__5043__auto__)){
return target.postMessage;
} else {
return and__5043__auto__;
}
})())){
return target.postMessage(msg,(cljs.core.truth_(transferables)?cljs.core.clj__GT_js(transferables):null));
} else {
return null;
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IMsg$_mk_channel$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var MC = cljs_thread.platform.wt.MessageChannel;
var c = (new MC());
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c.port1,c.port2], null);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IMsg$_self_ref$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(cljs_thread.platform.node_in_screen_QMARK_())){
return ({"postMessage": (function() { 
var G__20369__delegate = function (___$2){
return null;
};
var G__20369 = function (var_args){
var ___$2 = null;
if (arguments.length > 0) {
var G__20370__i = 0, G__20370__a = new Array(arguments.length -  0);
while (G__20370__i < G__20370__a.length) {G__20370__a[G__20370__i] = arguments[G__20370__i + 0]; ++G__20370__i;}
  ___$2 = new cljs.core.IndexedSeq(G__20370__a,0,null);
} 
return G__20369__delegate.call(this,___$2);};
G__20369.cljs$lang$maxFixedArity = 0;
G__20369.cljs$lang$applyTo = (function (arglist__20371){
var ___$2 = cljs.core.seq(arglist__20371);
return G__20369__delegate(___$2);
});
G__20369.cljs$core$IFn$_invoke$arity$variadic = G__20369__delegate;
return G__20369;
})()
});
} else {
return cljs_thread.platform.wt.parentPort;
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5339__auto__){
var self__ = this;
var this__5339__auto____$1 = this;
var h__5154__auto__ = self__.__hash;
if((!((h__5154__auto__ == null)))){
return h__5154__auto__;
} else {
var h__5154__auto____$1 = (function (coll__5340__auto__){
return (888844912 ^ cljs.core.hash_unordered_coll(coll__5340__auto__));
})(this__5339__auto____$1);
(self__.__hash = h__5154__auto____$1);

return h__5154__auto____$1;
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this20296,other20297){
var self__ = this;
var this20296__$1 = this;
return (((!((other20297 == null)))) && ((((this20296__$1.constructor === other20297.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this20296__$1.env_data_cache,other20297.env_data_cache)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this20296__$1.__extmap,other20297.__extmap)))))));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IWorker$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IWorker$_create_worker$arity$4 = (function (_,file_path,data,on_message){
var self__ = this;
var ___$1 = this;
var WorkerCls = cljs_thread.platform.wt.Worker;
var wd_js = cljs.core.clj__GT_js(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(data,new cljs.core.Keyword(null,"__eve_sab_config","__eve_sab_config",-303570789)));
var ___$2 = (function (){var temp__5823__auto__ = new cljs.core.Keyword(null,"__eve_sab_config","__eve_sab_config",-303570789).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(temp__5823__auto__)){
var eve_cfg = temp__5823__auto__;
return (wd_js["__eve_sab_config"] = ({"sab": new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_cfg), "reader-map-sab": new cljs.core.Keyword(null,"reader-map-sab","reader-map-sab",490876178).cljs$core$IFn$_invoke$arity$1(eve_cfg), "slab-sabs": new cljs.core.Keyword(null,"slab-sabs","slab-sabs",238684008).cljs$core$IFn$_invoke$arity$1(eve_cfg), "root-sab": new cljs.core.Keyword(null,"root-sab","root-sab",-932837436).cljs$core$IFn$_invoke$arity$1(eve_cfg)}));
} else {
return null;
}
})();
var w = (new WorkerCls(file_path,({"workerData": wd_js})));
w.on("message",on_message);

return w;
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IWorker$_register_coordinator$arity$3 = (function (_,_config,callback){
var self__ = this;
var ___$1 = this;
return (callback.cljs$core$IFn$_invoke$arity$0 ? callback.cljs$core$IFn$_invoke$arity$0() : callback.call(null, ));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IWorker$_coordinator_ready_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$ISync$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$ISync$_request$arity$3 = (function (_,_getter,_opts){
var self__ = this;
var ___$1 = this;
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Node uses direct SAB sync - platform request not supported",cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$ISync$_send_response$arity$2 = (function (_,_payload){
var self__ = this;
var ___$1 = this;
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Node uses direct SAB sync - platform send-response not supported",cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$ISync$_sleep$arity$2 = (function (_,ms){
var self__ = this;
var ___$1 = this;
return cljs_thread.platform.node_sleep(ms);
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5353__auto__,k__5354__auto__){
var self__ = this;
var this__5353__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),null], null), null),k__5354__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5353__auto____$1),self__.__meta),k__5354__auto__);
} else {
return (new cljs_thread.platform.NodePlatform(self__.env_data_cache,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5354__auto__)),null));
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IEnv$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IEnv$_init_data$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var temp__5821__auto__ = cljs.core.deref(self__.env_data_cache);
if(cljs.core.truth_(temp__5821__auto__)){
var cached = temp__5821__auto__;
return cached;
} else {
var d = cljs_thread.platform.node_init_data();
cljs.core.reset_BANG_(self__.env_data_cache,d);

return d;
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IEnv$_in_screen_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs_thread.platform.node_in_screen_QMARK_();
}));

(cljs_thread.platform.NodePlatform.prototype.cljs_thread$platform$IEnv$_close_self_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(cljs_thread.platform.node_in_screen_QMARK_())){
return null;
} else {
return process.exit((0));
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k20295){
var self__ = this;
var this__5350__auto____$1 = this;
var G__20307 = k20295;
var G__20307__$1 = (((G__20307 instanceof cljs.core.Keyword))?G__20307.fqn:null);
switch (G__20307__$1) {
case "env-data-cache":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k20295);

}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__20294){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__20308 = cljs.core.keyword_identical_QMARK_;
var expr__20309 = k__5352__auto__;
if(cljs.core.truth_((pred__20308.cljs$core$IFn$_invoke$arity$2 ? pred__20308.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),expr__20309) : pred__20308.call(null, new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),expr__20309)))){
return (new cljs_thread.platform.NodePlatform(G__20294,self__.__meta,self__.__extmap,null));
} else {
return (new cljs_thread.platform.NodePlatform(self__.env_data_cache,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__20294),null));
}
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419),self__.env_data_cache,null))], null),self__.__extmap));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__20294){
var self__ = this;
var this__5342__auto____$1 = this;
return (new cljs_thread.platform.NodePlatform(self__.env_data_cache,G__20294,self__.__extmap,self__.__hash));
}));

(cljs_thread.platform.NodePlatform.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5348__auto__,entry__5349__auto__){
var self__ = this;
var this__5348__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5349__auto__)){
return this__5348__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core._nth(entry__5349__auto__,(0)),cljs.core._nth(entry__5349__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5348__auto____$1,entry__5349__auto__);
}
}));

(cljs_thread.platform.NodePlatform.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"env-data-cache","env-data-cache",153305108,null)], null);
}));

(cljs_thread.platform.NodePlatform.cljs$lang$type = true);

(cljs_thread.platform.NodePlatform.cljs$lang$ctorPrSeq = (function (this__5389__auto__){
return (new cljs.core.List(null,"cljs-thread.platform/NodePlatform",null,(1),null));
}));

(cljs_thread.platform.NodePlatform.cljs$lang$ctorPrWriter = (function (this__5389__auto__,writer__5390__auto__){
return cljs.core._write(writer__5390__auto__,"cljs-thread.platform/NodePlatform");
}));

/**
 * Positional factory function for cljs-thread.platform/NodePlatform.
 */
cljs_thread.platform.__GT_NodePlatform = (function cljs_thread$platform$__GT_NodePlatform(env_data_cache){
return (new cljs_thread.platform.NodePlatform(env_data_cache,null,null,null));
});

/**
 * Factory function for cljs-thread.platform/NodePlatform, taking a map of keywords to field values.
 */
cljs_thread.platform.map__GT_NodePlatform = (function cljs_thread$platform$map__GT_NodePlatform(G__20300){
var extmap__5385__auto__ = (function (){var G__20311 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__20300,new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419));
if(cljs.core.record_QMARK_(G__20300)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__20311);
} else {
return G__20311;
}
})();
return (new cljs_thread.platform.NodePlatform(new cljs.core.Keyword(null,"env-data-cache","env-data-cache",-1487226419).cljs$core$IFn$_invoke$arity$1(G__20300),null,cljs.core.not_empty(extmap__5385__auto__),null));
});

/**
 * Atom holding the current platform implementation.
 */
cljs_thread.platform.impl = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs_thread.platform.platform = (function cljs_thread$platform$platform(){
var or__5045__auto__ = cljs.core.deref(cljs_thread.platform.impl);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Platform not initialized",cljs.core.PersistentArrayMap.EMPTY);
}
});
cljs_thread.platform.init_data = (function cljs_thread$platform$init_data(){
return cljs_thread.platform._init_data(cljs_thread.platform.platform());
});
cljs_thread.platform.in_screen_QMARK_ = (function cljs_thread$platform$in_screen_QMARK_(){
return cljs_thread.platform._in_screen_QMARK_(cljs_thread.platform.platform());
});
cljs_thread.platform.close_self_BANG_ = (function cljs_thread$platform$close_self_BANG_(){
return cljs_thread.platform._close_self_BANG_(cljs_thread.platform.platform());
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.platform !== 'undefined') && (typeof cljs_thread.platform.create_worker_override !== 'undefined')){
} else {
cljs_thread.platform.create_worker_override = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
cljs_thread.platform.create_worker = (function cljs_thread$platform$create_worker(url,data,on_message){
var temp__5821__auto__ = cljs.core.deref(cljs_thread.platform.create_worker_override);
if(cljs.core.truth_(temp__5821__auto__)){
var f = temp__5821__auto__;
return (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(url,data,on_message) : f.call(null, url,data,on_message));
} else {
return cljs_thread.platform._create_worker(cljs_thread.platform.platform(),url,data,on_message);
}
});
cljs_thread.platform.register_coordinator = (function cljs_thread$platform$register_coordinator(config,cb){
return cljs_thread.platform._register_coordinator(cljs_thread.platform.platform(),config,cb);
});
cljs_thread.platform.coordinator_ready_QMARK_ = (function cljs_thread$platform$coordinator_ready_QMARK_(){
return cljs_thread.platform._coordinator_ready_QMARK_(cljs_thread.platform.platform());
});
cljs_thread.platform.request = (function cljs_thread$platform$request(getter,opts){
return cljs_thread.platform._request(cljs_thread.platform.platform(),getter,opts);
});
cljs_thread.platform.send_response = (function cljs_thread$platform$send_response(payload){
return cljs_thread.platform._send_response(cljs_thread.platform.platform(),payload);
});
cljs_thread.platform.sleep = (function cljs_thread$platform$sleep(ms){
return cljs_thread.platform._sleep(cljs_thread.platform.platform(),ms);
});
cljs_thread.platform.listen = (function cljs_thread$platform$listen(target,handler){
return cljs_thread.platform._listen(cljs_thread.platform.platform(),target,handler);
});
cljs_thread.platform.post_message = (function cljs_thread$platform$post_message(target,msg,transferables){
return cljs_thread.platform._post_message(cljs_thread.platform.platform(),target,msg,transferables);
});
cljs_thread.platform.mk_channel = (function cljs_thread$platform$mk_channel(){
return cljs_thread.platform._mk_channel(cljs_thread.platform.platform());
});
cljs_thread.platform.self_ref = (function cljs_thread$platform$self_ref(){
return cljs_thread.platform._self_ref(cljs_thread.platform.platform());
});
/**
 * Manually set the platform implementation.
 */
cljs_thread.platform.init_BANG_ = (function cljs_thread$platform$init_BANG_(platform_impl){
return cljs.core.reset_BANG_(cljs_thread.platform.impl,platform_impl);
});
if(cljs.core.truth_(cljs.core.deref(cljs_thread.platform.impl))){
} else {
if(cljs_thread.platform.node_QMARK_){
cljs_thread.platform.init_BANG_(cljs_thread.platform.__GT_NodePlatform(cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null)));
} else {
cljs_thread.platform.init_BANG_(cljs_thread.platform.__GT_BrowserPlatform(cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null)));
}
}

//# sourceMappingURL=cljs_thread.platform.js.map
