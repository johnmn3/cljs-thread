goog.provide('cljs_thread.dom.registry');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.registry !== 'undefined') && (typeof cljs_thread.dom.registry.next_handle !== 'undefined')){
} else {
cljs_thread.dom.registry.next_handle = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((10));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.registry !== 'undefined') && (typeof cljs_thread.dom.registry.handle__GT_obj !== 'undefined')){
} else {
cljs_thread.dom.registry.handle__GT_obj = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.registry !== 'undefined') && (typeof cljs_thread.dom.registry.obj__GT_handle !== 'undefined')){
} else {
cljs_thread.dom.registry.obj__GT_handle = (cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())?(new WeakMap()):null);
}
cljs_thread.dom.registry.WINDOW_HANDLE = (0);
cljs_thread.dom.registry.DOCUMENT_HANDLE = (1);
cljs_thread.dom.registry.BODY_HANDLE = (2);
cljs_thread.dom.registry.HEAD_HANDLE = (3);
cljs_thread.dom.registry.DOC_ELEMENT_HANDLE = (4);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.registry !== 'undefined') && (typeof cljs_thread.dom.registry.initialized_QMARK_ !== 'undefined')){
} else {
cljs_thread.dom.registry.initialized_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
/**
 * Pre-seed well-known DOM objects into the registry.
 * Idempotent — safe to call multiple times.
 * No-op on worker threads.
 */
cljs_thread.dom.registry.init_BANG_ = (function cljs_thread$dom$registry$init_BANG_(){
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.env.in_screen_QMARK_();
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs.core.deref(cljs_thread.dom.registry.initialized_QMARK_));
} else {
return and__5043__auto__;
}
})())){
cljs.core.reset_BANG_(cljs_thread.dom.registry.initialized_QMARK_,true);

var doc = document;
var win = window;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.dom.registry.handle__GT_obj,cljs.core.assoc,cljs_thread.dom.registry.WINDOW_HANDLE,win,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs_thread.dom.registry.DOCUMENT_HANDLE,doc], 0));

cljs_thread.dom.registry.obj__GT_handle.set(win,cljs_thread.dom.registry.WINDOW_HANDLE);

cljs_thread.dom.registry.obj__GT_handle.set(doc,cljs_thread.dom.registry.DOCUMENT_HANDLE);

if(cljs.core.truth_(doc.body)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.registry.handle__GT_obj,cljs.core.assoc,cljs_thread.dom.registry.BODY_HANDLE,doc.body);

cljs_thread.dom.registry.obj__GT_handle.set(doc.body,cljs_thread.dom.registry.BODY_HANDLE);
} else {
}

if(cljs.core.truth_(doc.head)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.registry.handle__GT_obj,cljs.core.assoc,cljs_thread.dom.registry.HEAD_HANDLE,doc.head);

cljs_thread.dom.registry.obj__GT_handle.set(doc.head,cljs_thread.dom.registry.HEAD_HANDLE);
} else {
}

if(cljs.core.truth_(doc.documentElement)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.registry.handle__GT_obj,cljs.core.assoc,cljs_thread.dom.registry.DOC_ELEMENT_HANDLE,doc.documentElement);

return cljs_thread.dom.registry.obj__GT_handle.set(doc.documentElement,cljs_thread.dom.registry.DOC_ELEMENT_HANDLE);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Register a DOM object, returning its integer handle.
 * If the object is already registered, returns the existing handle.
 */
cljs_thread.dom.registry.register_BANG_ = (function cljs_thread$dom$registry$register_BANG_(obj){
var temp__5821__auto__ = cljs_thread.dom.registry.obj__GT_handle.get(obj);
if(cljs.core.truth_(temp__5821__auto__)){
var existing = temp__5821__auto__;
return existing;
} else {
var h = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.registry.next_handle,cljs.core.inc);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.registry.handle__GT_obj,cljs.core.assoc,h,obj);

cljs_thread.dom.registry.obj__GT_handle.set(obj,h);

return h;
}
});
/**
 * Look up a DOM object by its integer handle. Returns nil if not found.
 */
cljs_thread.dom.registry.lookup = (function cljs_thread$dom$registry$lookup(handle){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.dom.registry.handle__GT_obj),handle);
});
goog.exportSymbol('cljs_thread.dom.registry.lookup', cljs_thread.dom.registry.lookup);
/**
 * Look up the handle for a DOM object. Returns nil if not registered.
 */
cljs_thread.dom.registry.handle_for = (function cljs_thread$dom$registry$handle_for(obj){
if(cljs.core.truth_(obj)){
return cljs_thread.dom.registry.obj__GT_handle.get(obj);
} else {
return null;
}
});
/**
 * Remove a handle from the registry (for GC). Returns nil.
 */
cljs_thread.dom.registry.release_BANG_ = (function cljs_thread$dom$registry$release_BANG_(handle){
var temp__5823__auto___20533 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.dom.registry.handle__GT_obj),handle);
if(cljs.core.truth_(temp__5823__auto___20533)){
var obj_20534 = temp__5823__auto___20533;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.dom.registry.handle__GT_obj,cljs.core.dissoc,handle);

cljs_thread.dom.registry.obj__GT_handle.delete(obj_20534);
} else {
}

return null;
});
/**
 * Return the number of handles currently registered. For testing.
 */
cljs_thread.dom.registry.registered_count = (function cljs_thread$dom$registry$registered_count(){
return cljs.core.count(cljs.core.deref(cljs_thread.dom.registry.handle__GT_obj));
});
/**
 * Check if x is a JavaScript object (typeof === 'object' and not nil).
 */
cljs_thread.dom.registry.js_object_QMARK_ = (function cljs_thread$dom$registry$js_object_QMARK_(x){
return (((!((x == null)))) && ((typeof x === "object")));
});
/**
 * Convert a DOM operation result into a wire-safe value.
 * - nil/undefined -> nil
 * - Primitives (string, number, boolean) -> returned as-is
 * - Functions -> {:fn? true}
 * - DOM objects -> registered as {:handle N, :type T}
 * - Arrays/NodeLists -> vectors of wire results
 */
cljs_thread.dom.registry.result__GT_wire = (function cljs_thread$dom$registry$result__GT_wire(result){
if((result == null)){
return null;
} else {
if((void 0 === result)){
return null;
} else {
if(cljs.core.fn_QMARK_(result)){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"fn?","fn?",180459291),true], null);
} else {
if(((typeof result === 'string') || (((typeof result === 'number') || (cljs.core.boolean_QMARK_(result)))))){
return result;
} else {
if((((result instanceof NodeList)) || ((result instanceof HTMLCollection)))){
var arr = [];
var n__5636__auto___20539 = result.length;
var i_20540 = (0);
while(true){
if((i_20540 < n__5636__auto___20539)){
arr.push((function (){var G__20510 = result.item(i_20540);
return (cljs_thread.dom.registry.result__GT_wire.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.dom.registry.result__GT_wire.cljs$core$IFn$_invoke$arity$1(G__20510) : cljs_thread.dom.registry.result__GT_wire.call(null, G__20510));
})());

var G__20541 = (i_20540 + (1));
i_20540 = G__20541;
continue;
} else {
}
break;
}

return cljs.core.vec(arr);
} else {
if((((result instanceof Node)) || ((((result instanceof Window)) || (((cljs_thread.dom.registry.js_object_QMARK_(result)) && ((!((result.nodeType == null)))))))))){
var h = cljs_thread.dom.registry.register_BANG_(result);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"handle","handle",1538948854),h,new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__5045__auto__ = result.constructor.name;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = (((result instanceof Window))?"Window":null);
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return "Object";
}
}
})()], null);
} else {
if(cljs_thread.dom.registry.js_object_QMARK_(result)){
var h = cljs_thread.dom.registry.register_BANG_(result);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"handle","handle",1538948854),h,new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__5045__auto__ = result.constructor.name;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "Object";
}
})()], null);
} else {
return result;

}
}
}
}
}
}
}
});
goog.exportSymbol('cljs_thread.dom.registry.result__GT_wire', cljs_thread.dom.registry.result__GT_wire);
/**
 * Resolve a single argument from wire format.
 * Handle references {:handle N} become real DOM objects.
 * Handles both CLJS maps and JS objects (sargs go through clj->js in msg.cljs).
 */
cljs_thread.dom.registry.from_wire = (function cljs_thread$dom$registry$from_wire(arg){
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(arg);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(arg);
} else {
return and__5043__auto__;
}
})())){
return cljs_thread.dom.registry.lookup(new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(arg));
} else {
if(((cljs.core.object_QMARK_(arg)) && ((!(((arg["handle"]) == null)))))){
return cljs_thread.dom.registry.lookup((arg["handle"]));
} else {
return arg;

}
}
});
goog.exportSymbol('cljs_thread.dom.registry.from_wire', cljs_thread.dom.registry.from_wire);
/**
 * Extract wire-safe event properties from a browser Event.
 * Target and currentTarget are registered as handles.
 */
cljs_thread.dom.registry.extract_event = (function cljs_thread$dom$registry$extract_event(event){
var target = event.target;
var current_target = event.currentTarget;
var G__20518 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),event.type], null);
var G__20518__$1 = (cljs.core.truth_(target)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__20518,new cljs.core.Keyword(null,"target","target",253001721),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"handle","handle",1538948854),cljs_thread.dom.registry.register_BANG_(target),new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__5045__auto__ = target.nodeName;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "EventTarget";
}
})()], null)):G__20518);
if(cljs.core.truth_(current_target)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__20518__$1,new cljs.core.Keyword(null,"current-target","current-target",34322910),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"handle","handle",1538948854),cljs_thread.dom.registry.register_BANG_(current_target),new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__5045__auto__ = current_target.nodeName;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "EventTarget";
}
})()], null));
} else {
return G__20518__$1;
}
});
goog.exportSymbol('cljs_thread.dom.registry.extract_event', cljs_thread.dom.registry.extract_event);
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.registry !== 'undefined') && (typeof cljs_thread.dom.registry.screen_listeners !== 'undefined')){
} else {
cljs_thread.dom.registry.screen_listeners = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Store a screen-side real listener function. Key is [handle event-type lid].
 */
cljs_thread.dom.registry.store_listener_BANG_ = (function cljs_thread$dom$registry$store_listener_BANG_(key,real_fn){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.registry.screen_listeners,cljs.core.assoc,key,real_fn);
});
goog.exportSymbol('cljs_thread.dom.registry.store_listener_BANG_', cljs_thread.dom.registry.store_listener_BANG_);
/**
 * Remove and return a screen-side listener. Returns the real-fn or nil.
 */
cljs_thread.dom.registry.remove_listener_BANG_ = (function cljs_thread$dom$registry$remove_listener_BANG_(key){
var real_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.dom.registry.screen_listeners),key);
if(cljs.core.truth_(real_fn)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.dom.registry.screen_listeners,cljs.core.dissoc,key);
} else {
}

return real_fn;
});
goog.exportSymbol('cljs_thread.dom.registry.remove_listener_BANG_', cljs_thread.dom.registry.remove_listener_BANG_);
/**
 * Post a :dom-event message from screen to a worker.
 * Used inside `in :screen` bodies for event listener forwarding.
 */
cljs_thread.dom.registry.post_dom_event = (function cljs_thread$dom$registry$post_dom_event(to,listener_id,event_data){
return cljs_thread.msg.post(to,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"dom-event","dom-event",-1993582006),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"listener-id","listener-id",-895218711),listener_id,new cljs.core.Keyword(null,"event-data","event-data",-1726012139),event_data], null)], null));
});
goog.exportSymbol('cljs_thread.dom.registry.post_dom_event', cljs_thread.dom.registry.post_dom_event);
/**
 * Post a :dom-raf message from screen to a worker.
 * Used inside `in :screen` bodies for rAF callback forwarding.
 */
cljs_thread.dom.registry.post_dom_raf = (function cljs_thread$dom$registry$post_dom_raf(to,callback_id,timestamp){
return cljs_thread.msg.post(to,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"dom-raf","dom-raf",360919698),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"callback-id","callback-id",9449845),callback_id,new cljs.core.Keyword(null,"timestamp","timestamp",579478971),timestamp], null)], null));
});
goog.exportSymbol('cljs_thread.dom.registry.post_dom_raf', cljs_thread.dom.registry.post_dom_raf);
cljs_thread.dom.registry.init_BANG_();

//# sourceMappingURL=cljs_thread.dom.registry.js.map
