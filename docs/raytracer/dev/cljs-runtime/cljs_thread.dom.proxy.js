goog.provide('cljs_thread.dom.proxy');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.proxy !== 'undefined') && (typeof cljs_thread.dom.proxy.proxy_cache !== 'undefined')){
} else {
cljs_thread.dom.proxy.proxy_cache = (new Map());
}
/**
 * Block for the result of an `in` call.
 * `in` returns a derefable; dereffing it blocks via Atomics.wait
 * when SAB sync is available, or falls back to SW sync otherwise.
 */
cljs_thread.dom.proxy.in_sync = (function cljs_thread$dom$proxy$in_sync(derefable){
return cljs.core.deref(derefable);
});
/**
 * Convert a wire-format result back into a Proxy or primitive.
 * Handle maps {:handle N, :type T} become Proxy objects.
 * Vectors of handle maps become JS arrays of Proxies.
 * Primitives pass through.
 */
cljs_thread.dom.proxy.unwrap_result = (function cljs_thread$dom$proxy$unwrap_result(result){
if((result == null)){
return null;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(result);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(result);
} else {
return and__5043__auto__;
}
})())){
var G__21174 = new cljs.core.Keyword(null,"handle","handle",1538948854).cljs$core$IFn$_invoke$arity$1(result);
var G__21175 = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(result);
return (cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2(G__21174,G__21175) : cljs_thread.dom.proxy.wrap_proxy.call(null, G__21174,G__21175));
} else {
if(cljs.core.vector_QMARK_(result)){
var arr = [];
var seq__21176_21490 = cljs.core.seq(result);
var chunk__21177_21491 = null;
var count__21178_21492 = (0);
var i__21179_21493 = (0);
while(true){
if((i__21179_21493 < count__21178_21492)){
var item_21494 = chunk__21177_21491.cljs$core$IIndexed$_nth$arity$2(null, i__21179_21493);
arr.push((cljs_thread.dom.proxy.unwrap_result.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.dom.proxy.unwrap_result.cljs$core$IFn$_invoke$arity$1(item_21494) : cljs_thread.dom.proxy.unwrap_result.call(null, item_21494)));


var G__21495 = seq__21176_21490;
var G__21496 = chunk__21177_21491;
var G__21497 = count__21178_21492;
var G__21498 = (i__21179_21493 + (1));
seq__21176_21490 = G__21495;
chunk__21177_21491 = G__21496;
count__21178_21492 = G__21497;
i__21179_21493 = G__21498;
continue;
} else {
var temp__5823__auto___21499 = cljs.core.seq(seq__21176_21490);
if(temp__5823__auto___21499){
var seq__21176_21500__$1 = temp__5823__auto___21499;
if(cljs.core.chunked_seq_QMARK_(seq__21176_21500__$1)){
var c__5568__auto___21502 = cljs.core.chunk_first(seq__21176_21500__$1);
var G__21503 = cljs.core.chunk_rest(seq__21176_21500__$1);
var G__21504 = c__5568__auto___21502;
var G__21505 = cljs.core.count(c__5568__auto___21502);
var G__21506 = (0);
seq__21176_21490 = G__21503;
chunk__21177_21491 = G__21504;
count__21178_21492 = G__21505;
i__21179_21493 = G__21506;
continue;
} else {
var item_21507 = cljs.core.first(seq__21176_21500__$1);
arr.push((cljs_thread.dom.proxy.unwrap_result.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.dom.proxy.unwrap_result.cljs$core$IFn$_invoke$arity$1(item_21507) : cljs_thread.dom.proxy.unwrap_result.call(null, item_21507)));


var G__21510 = cljs.core.next(seq__21176_21500__$1);
var G__21511 = null;
var G__21512 = (0);
var G__21513 = (0);
seq__21176_21490 = G__21510;
chunk__21177_21491 = G__21511;
count__21178_21492 = G__21512;
i__21179_21493 = G__21513;
continue;
}
} else {
}
}
break;
}

return arr;
} else {
return result;

}
}
}
});
/**
 * Convert a single argument to wire format for transmission to screen.
 * Proxy objects become {:handle N}. Everything else passes through
 * (including functions, which `in`'s instr-body will serialize).
 */
cljs_thread.dom.proxy.to_wire = (function cljs_thread$dom$proxy$to_wire(a){
if(cljs.core.truth_((function (){var and__5043__auto__ = a;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = (function (){var t = typeof a;
return (((t === "object")) || ((t === "function")));
})();
if(and__5043__auto____$1){
return (function (){try{return (a["__is_dom_proxy"]);
}catch (e21184){var _ = e21184;
return false;
}})() === true;
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"handle","handle",1538948854),(a["__dom_handle"])], null);
} else {
return a;
}
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.proxy !== 'undefined') && (typeof cljs_thread.dom.proxy.batch_queue !== 'undefined')){
} else {
cljs_thread.dom.proxy.batch_queue = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Execute f with write batching enabled. All proxy set operations
 * within f are queued and executed in a single `in :screen` call.
 * Reads during the batch still go through as normal sync calls.
 */
cljs_thread.dom.proxy.with_batch = (function cljs_thread$dom$proxy$with_batch(f){
cljs.core.reset_BANG_(cljs_thread.dom.proxy.batch_queue,cljs.core.PersistentVector.EMPTY);

try{(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));

var ops = cljs.core.deref(cljs_thread.dom.proxy.batch_queue);
cljs.core.reset_BANG_(cljs_thread.dom.proxy.batch_queue,null);

if(cljs.core.seq(ops)){
return cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [ops], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (ops__$1){
var seq__21198 = cljs.core.seq(ops__$1);
var chunk__21199 = null;
var count__21200 = (0);
var i__21201 = (0);
while(true){
if((i__21201 < count__21200)){
var op = chunk__21199.cljs$core$IIndexed$_nth$arity$2(null, i__21201);
var handle_21524 = (op[(0)]);
var prop_21525 = (op[(1)]);
var value_21526 = (op[(2)]);
var obj_21527 = cljs_thread.dom.registry.lookup(handle_21524);
var resolved_21528 = cljs_thread.dom.registry.from_wire(value_21526);
if(cljs.core.truth_(obj_21527)){
(obj_21527[prop_21525] = resolved_21528);
} else {
}


var G__21531 = seq__21198;
var G__21532 = chunk__21199;
var G__21533 = count__21200;
var G__21534 = (i__21201 + (1));
seq__21198 = G__21531;
chunk__21199 = G__21532;
count__21200 = G__21533;
i__21201 = G__21534;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__21198);
if(temp__5823__auto__){
var seq__21198__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__21198__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__21198__$1);
var G__21538 = cljs.core.chunk_rest(seq__21198__$1);
var G__21539 = c__5568__auto__;
var G__21541 = cljs.core.count(c__5568__auto__);
var G__21542 = (0);
seq__21198 = G__21538;
chunk__21199 = G__21539;
count__21200 = G__21541;
i__21201 = G__21542;
continue;
} else {
var op = cljs.core.first(seq__21198__$1);
var handle_21547 = (op[(0)]);
var prop_21548 = (op[(1)]);
var value_21549 = (op[(2)]);
var obj_21550 = cljs_thread.dom.registry.lookup(handle_21547);
var resolved_21551 = cljs_thread.dom.registry.from_wire(value_21549);
if(cljs.core.truth_(obj_21550)){
(obj_21550[prop_21548] = resolved_21551);
} else {
}


var G__21552 = cljs.core.next(seq__21198__$1);
var G__21553 = null;
var G__21554 = (0);
var G__21555 = (0);
seq__21198 = G__21552;
chunk__21199 = G__21553;
count__21200 = G__21554;
i__21201 = G__21555;
continue;
}
} else {
return null;
}
}
break;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
} else {
return null;
}
}catch (e21185){var e = e21185;
cljs.core.reset_BANG_(cljs_thread.dom.proxy.batch_queue,null);

throw e;
}});
/**
 * Create a callable+constructible proxy for a method on the screen thread.
 * Regular calls use .apply (method invocation).
 * `new` calls use Reflect.construct (constructor invocation).
 * Function arguments (RAF callbacks, etc.) are serialized by `in`.
 */
cljs_thread.dom.proxy.make_method_fn = (function cljs_thread$dom$proxy$make_method_fn(handle,method_name){
return (new Proxy((new Function()),({"apply": (function (_target,_this_arg,args){
var wire_args = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.proxy.to_wire,Array.from(args));
var result = cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,wire_args,method_name], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,wire_args__$1,method_name__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
var resolved = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.registry.from_wire,wire_args__$1);
var method_fn = (obj[method_name__$1]);
return cljs_thread.dom.registry.result__GT_wire(method_fn.apply(obj,cljs.core.to_array(resolved)));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return cljs_thread.dom.proxy.unwrap_result(result);
}), "construct": (function (_target,args,_new_target){
var wire_args = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.proxy.to_wire,Array.from(args));
var result = cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,wire_args,method_name], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,wire_args__$1,method_name__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
var resolved = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.registry.from_wire,wire_args__$1);
var ctor = (obj[method_name__$1]);
return cljs_thread.dom.registry.result__GT_wire(Reflect.construct(ctor,cljs.core.to_array(resolved)));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return cljs_thread.dom.proxy.unwrap_result(result);
})})));
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.proxy !== 'undefined') && (typeof cljs_thread.dom.proxy.listener_callbacks !== 'undefined')){
} else {
cljs_thread.dom.proxy.listener_callbacks = (new Map());
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.proxy !== 'undefined') && (typeof cljs_thread.dom.proxy.next_listener_id !== 'undefined')){
} else {
cljs_thread.dom.proxy.next_listener_id = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
}
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.proxy !== 'undefined') && (typeof cljs_thread.dom.proxy.listener_index !== 'undefined')){
} else {
cljs_thread.dom.proxy.listener_index = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Store a callback locally and return a unique listener-id.
 */
cljs_thread.dom.proxy.register_listener_BANG_ = (function cljs_thread$dom$proxy$register_listener_BANG_(handle,event_type,callback){
var lid = ["l",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.proxy.next_listener_id,cljs.core.inc))].join('');
cljs_thread.dom.proxy.listener_callbacks.set(lid,callback);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.dom.proxy.listener_index,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,event_type], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [lid,callback], null)], 0));

return lid;
});
/**
 * Remove a callback by identity and return its listener-id, or nil.
 */
cljs_thread.dom.proxy.unregister_listener_BANG_ = (function cljs_thread$dom$proxy$unregister_listener_BANG_(handle,event_type,callback){
var entries = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.dom.proxy.listener_index),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,event_type], null));
var match = cljs.core.some((function (p__21242){
var vec__21243 = p__21242;
var lid = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21243,(0),null);
var cb = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21243,(1),null);
if((cb === callback)){
return lid;
} else {
return null;
}
}),entries);
if(cljs.core.truth_(match)){
cljs_thread.dom.proxy.listener_callbacks.delete(match);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.dom.proxy.listener_index,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,event_type], null),(function (v){
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__21246){
var vec__21247 = p__21246;
var lid = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21247,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21247,(1),null);
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(lid,match);
}),v));
}));

return match;
} else {
return null;
}
});
/**
 * Create the addEventListener handler for a given handle.
 * Stores callback on worker, registers a forwarding stub on screen via `in`.
 */
cljs_thread.dom.proxy.make_add_listener = (function cljs_thread$dom$proxy$make_add_listener(handle){
return (function() { 
var G__21582__delegate = function (event_type,callback,_){
var lid_21585 = cljs_thread.dom.proxy.register_listener_BANG_(handle,event_type,callback);
var from_21586 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,from_21586,lid_21585,handle,event_type,lid_21585,event_type], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,from__$1,lid__$1,handle__$2,event_type__$1,lid__$2,event_type__$2){
var obj = cljs_thread.dom.registry.lookup(handle__$2);
var real_fn = (function (event){
return cljs_thread.dom.registry.post_dom_event(from__$1,lid__$2,cljs_thread.dom.registry.extract_event(event));
});
cljs_thread.dom.registry.store_listener_BANG_(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle__$2,event_type__$2,lid__$2], null),real_fn);

return obj.addEventListener(event_type__$2,real_fn);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));

return undefined;
};
var G__21582 = function (event_type,callback,var_args){
var _ = null;
if (arguments.length > 2) {
var G__21592__i = 0, G__21592__a = new Array(arguments.length -  2);
while (G__21592__i < G__21592__a.length) {G__21592__a[G__21592__i] = arguments[G__21592__i + 2]; ++G__21592__i;}
  _ = new cljs.core.IndexedSeq(G__21592__a,0,null);
} 
return G__21582__delegate.call(this,event_type,callback,_);};
G__21582.cljs$lang$maxFixedArity = 2;
G__21582.cljs$lang$applyTo = (function (arglist__21593){
var event_type = cljs.core.first(arglist__21593);
arglist__21593 = cljs.core.next(arglist__21593);
var callback = cljs.core.first(arglist__21593);
var _ = cljs.core.rest(arglist__21593);
return G__21582__delegate(event_type,callback,_);
});
G__21582.cljs$core$IFn$_invoke$arity$variadic = G__21582__delegate;
return G__21582;
})()
;
});
/**
 * Create the removeEventListener handler for a given handle.
 */
cljs_thread.dom.proxy.make_remove_listener = (function cljs_thread$dom$proxy$make_remove_listener(handle){
return (function() { 
var G__21594__delegate = function (event_type,callback,_){
var temp__5823__auto___21595 = cljs_thread.dom.proxy.unregister_listener_BANG_(handle,event_type,callback);
if(cljs.core.truth_(temp__5823__auto___21595)){
var lid_21596 = temp__5823__auto___21595;
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,handle,event_type,lid_21596,event_type], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,handle__$2,event_type__$1,lid__$1,event_type__$2){
var obj = cljs_thread.dom.registry.lookup(handle__$2);
var real_fn = cljs_thread.dom.registry.remove_listener_BANG_(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle__$2,event_type__$2,lid__$1], null));
if(cljs.core.truth_(real_fn)){
return obj.removeEventListener(event_type__$2,real_fn);
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
} else {
}

return undefined;
};
var G__21594 = function (event_type,callback,var_args){
var _ = null;
if (arguments.length > 2) {
var G__21597__i = 0, G__21597__a = new Array(arguments.length -  2);
while (G__21597__i < G__21597__a.length) {G__21597__a[G__21597__i] = arguments[G__21597__i + 2]; ++G__21597__i;}
  _ = new cljs.core.IndexedSeq(G__21597__a,0,null);
} 
return G__21594__delegate.call(this,event_type,callback,_);};
G__21594.cljs$lang$maxFixedArity = 2;
G__21594.cljs$lang$applyTo = (function (arglist__21598){
var event_type = cljs.core.first(arglist__21598);
arglist__21598 = cljs.core.next(arglist__21598);
var callback = cljs.core.first(arglist__21598);
var _ = cljs.core.rest(arglist__21598);
return G__21594__delegate(event_type,callback,_);
});
G__21594.cljs$core$IFn$_invoke$arity$variadic = G__21594__delegate;
return G__21594;
})()
;
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"dom-event","dom-event",-1993582006),(function (p__21291){
var map__21292 = p__21291;
var map__21292__$1 = cljs.core.__destructure_map(map__21292);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21292__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__21293 = data;
var map__21293__$1 = cljs.core.__destructure_map(map__21293);
var listener_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21293__$1,new cljs.core.Keyword(null,"listener-id","listener-id",-895218711));
var event_data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21293__$1,new cljs.core.Keyword(null,"event-data","event-data",-1726012139));
var temp__5823__auto__ = cljs_thread.dom.proxy.listener_callbacks.get(listener_id);
if(cljs.core.truth_(temp__5823__auto__)){
var cb = temp__5823__auto__;
var evt = ({});
(evt["type"] = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(event_data));

var temp__5823__auto___21600__$1 = new cljs.core.Keyword(null,"target","target",253001721).cljs$core$IFn$_invoke$arity$1(event_data);
if(cljs.core.truth_(temp__5823__auto___21600__$1)){
var map__21294_21601 = temp__5823__auto___21600__$1;
var map__21294_21602__$1 = cljs.core.__destructure_map(map__21294_21601);
var handle_21603 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294_21602__$1,new cljs.core.Keyword(null,"handle","handle",1538948854));
var type_21604 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294_21602__$1,new cljs.core.Keyword(null,"type","type",1174270348));
(evt["target"] = (cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2(handle_21603,type_21604) : cljs_thread.dom.proxy.wrap_proxy.call(null, handle_21603,type_21604)));
} else {
}

var temp__5823__auto___21605__$1 = new cljs.core.Keyword(null,"current-target","current-target",34322910).cljs$core$IFn$_invoke$arity$1(event_data);
if(cljs.core.truth_(temp__5823__auto___21605__$1)){
var map__21297_21606 = temp__5823__auto___21605__$1;
var map__21297_21607__$1 = cljs.core.__destructure_map(map__21297_21606);
var handle_21608 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21297_21607__$1,new cljs.core.Keyword(null,"handle","handle",1538948854));
var type_21609 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21297_21607__$1,new cljs.core.Keyword(null,"type","type",1174270348));
(evt["currentTarget"] = (cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.dom.proxy.wrap_proxy.cljs$core$IFn$_invoke$arity$2(handle_21608,type_21609) : cljs_thread.dom.proxy.wrap_proxy.call(null, handle_21608,type_21609)));
} else {
}

(evt["preventDefault"] = (function (){
return null;
}));

(evt["stopPropagation"] = (function (){
return null;
}));

return (cb.cljs$core$IFn$_invoke$arity$1 ? cb.cljs$core$IFn$_invoke$arity$1(evt) : cb.call(null, evt));
} else {
return null;
}
}));
/**
 * Create the requestAnimationFrame handler for a given handle (window).
 * Stores callback on worker, registers forwarding rAF on screen.
 */
cljs_thread.dom.proxy.make_raf_fn = (function cljs_thread$dom$proxy$make_raf_fn(handle){
return (function (callback){
var cb_id = ["raf",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs_thread.dom.proxy.next_listener_id,cljs.core.inc))].join('');
var from = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
cljs_thread.dom.proxy.listener_callbacks.set(cb_id,callback);

return cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,from,cb_id], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,from__$1,cb_id__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
return obj.requestAnimationFrame((function (timestamp){
return cljs_thread.dom.registry.post_dom_raf(from__$1,cb_id__$1,timestamp);
}));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
});
});
/**
 * Create the cancelAnimationFrame handler for a given handle (window).
 */
cljs_thread.dom.proxy.make_caf_fn = (function cljs_thread$dom$proxy$make_caf_fn(handle){
return (function (raf_id){
return cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,raf_id], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,raf_id__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
return obj.cancelAnimationFrame(raf_id__$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
});
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"dom-raf","dom-raf",360919698),(function (p__21327){
var map__21328 = p__21327;
var map__21328__$1 = cljs.core.__destructure_map(map__21328);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21328__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__21331 = data;
var map__21331__$1 = cljs.core.__destructure_map(map__21331);
var callback_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21331__$1,new cljs.core.Keyword(null,"callback-id","callback-id",9449845));
var timestamp = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21331__$1,new cljs.core.Keyword(null,"timestamp","timestamp",579478971));
var temp__5823__auto__ = cljs_thread.dom.proxy.listener_callbacks.get(callback_id);
if(cljs.core.truth_(temp__5823__auto__)){
var cb = temp__5823__auto__;
cljs_thread.dom.proxy.listener_callbacks.delete(callback_id);

return (cb.cljs$core$IFn$_invoke$arity$1 ? cb.cljs$core$IFn$_invoke$arity$1(timestamp) : cb.call(null, timestamp));
} else {
return null;
}
}));
cljs_thread.dom.proxy.native_worker_globals = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 122, ["AbortController",null,"NaN",null,"URL",null,"Float64Array",null,"CacheStorage",null,"Symbol",null,"Proxy",null,"URLSearchParams",null,"IDBDatabase",null,"ArrayBuffer",null,"TypeError",null,"fetch",null,"btoa",null,"AsyncIterator",null,"IDBTransaction",null,"OffscreenCanvas",null,"IDBIndex",null,"Request",null,"XMLHttpRequest",null,"TransformStream",null,"TextDecoder",null,"WeakRef",null,"OffscreenCanvasRenderingContext2D",null,"TextDecoderStream",null,"IDBObjectStore",null,"structuredClone",null,"DecompressionStream",null,"BroadcastChannel",null,"URLPattern",null,"WebSocket",null,"decodeURI",null,"CryptoKey",null,"IndexedDB",null,"Object",null,"Number",null,"Map",null,"Atomics",null,"AggregateError",null,"Promise",null,"File",null,"Iterator",null,"WeakSet",null,"EvalError",null,"parseFloat",null,"DOMPoint",null,"Uint8Array",null,"Event",null,"FinalizationRegistry",null,"SubtleCrypto",null,"Date",null,"IDBKeyRange",null,"Response",null,"Intl",null,"console",null,"Infinity",null,"ReadableStream",null,"MessageChannel",null,"Int8Array",null,"RangeError",null,"ReferenceError",null,"BigInt",null,"clearTimeout",null,"Math",null,"SyntaxError",null,"AbortSignal",null,"SharedWorker",null,"CompressionStream",null,"ImageBitmap",null,"BigInt64Array",null,"Reflect",null,"MessagePort",null,"crypto",null,"JSON",null,"FileReader",null,"IDBCursor",null,"String",null,"URIError",null,"DOMRect",null,"IDBFactory",null,"encodeURIComponent",null,"Uint8ClampedArray",null,"isNaN",null,"clearInterval",null,"EventTarget",null,"RegExp",null,"undefined",null,"Worker",null,"Uint16Array",null,"DOMMatrix",null,"isFinite",null,"TextEncoder",null,"Crypto",null,"encodeURI",null,"DataView",null,"TextEncoderStream",null,"Int16Array",null,"WeakMap",null,"Error",null,"SharedArrayBuffer",null,"setTimeout",null,"Function",null,"Uint32Array",null,"Float32Array",null,"Headers",null,"Blob",null,"WritableStream",null,"CustomEvent",null,"Array",null,"performance",null,"Path2D",null,"ImageData",null,"Cache",null,"Int32Array",null,"setInterval",null,"atob",null,"FormData",null,"BigUint64Array",null,"Set",null,"queueMicrotask",null,"Boolean",null,"decodeURIComponent",null,"parseInt",null], null), null);
/**
 * Create or retrieve a Proxy for the given handle.
 * Uses a cache to ensure identity: same handle = same Proxy object.
 */
cljs_thread.dom.proxy.wrap_proxy = (function cljs_thread$dom$proxy$wrap_proxy(handle,node_type){
var temp__5821__auto__ = cljs_thread.dom.proxy.proxy_cache.get(handle);
if(cljs.core.truth_(temp__5821__auto__)){
var cached = temp__5821__auto__;
return cached;
} else {
var target = ({});
var _ = (target["__dom_handle"] = handle);
var ___$1 = (target["__dom_type"] = (function (){var or__5045__auto__ = node_type;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "Node";
}
})());
var handler = ({"get": (function (_target,prop,_receiver){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"__dom_handle")){
return handle;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"__dom_type")){
return (target["__dom_type"]);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"__is_dom_proxy")){
return true;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"then")){
return undefined;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"addEventListener")){
return cljs_thread.dom.proxy.make_add_listener(handle);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"removeEventListener")){
return cljs_thread.dom.proxy.make_remove_listener(handle);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"requestAnimationFrame")){
return cljs_thread.dom.proxy.make_raf_fn(handle);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(prop,"cancelAnimationFrame")){
return cljs_thread.dom.proxy.make_caf_fn(handle);
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(handle,cljs_thread.dom.registry.WINDOW_HANDLE)) && (((cljs.core.contains_QMARK_(cljs_thread.dom.proxy.native_worker_globals,prop)) && ((!(((self[prop]) == null)))))))){
return (self[prop]);
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = typeof prop === 'string';
if(and__5043__auto__){
return prop.startsWith(":");
} else {
return and__5043__auto__;
}
})())){
return (target[prop]);
} else {
if(typeof prop === 'string'){
var result = cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,prop], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,prop__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
var raw = (cljs.core.truth_(obj)?(obj[prop__$1]):null);
return cljs_thread.dom.registry.result__GT_wire(raw);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(result);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"fn?","fn?",180459291).cljs$core$IFn$_invoke$arity$1(result);
} else {
return and__5043__auto__;
}
})())){
return cljs_thread.dom.proxy.make_method_fn(handle,prop);
} else {
return cljs_thread.dom.proxy.unwrap_result(result);

}
} else {
return undefined;

}
}
}
}
}
}
}
}
}
}
}
}), "set": (function (_target,prop,value,_receiver){
if(typeof prop === 'string'){
if(cljs.core.truth_(prop.startsWith(":"))){
(target[prop] = value);
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = prop.startsWith("on");
if(cljs.core.truth_(and__5043__auto__)){
return ((cljs.core.fn_QMARK_(value)) || ((value == null)));
} else {
return and__5043__auto__;
}
})())){
var event_type_21614 = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(prop,(2));
var old_fn_21615 = (target[prop]);
if(cljs.core.truth_(old_fn_21615)){
var temp__5823__auto___21616 = cljs_thread.dom.proxy.unregister_listener_BANG_(handle,event_type_21614,old_fn_21615);
if(cljs.core.truth_(temp__5823__auto___21616)){
var lid_21617 = temp__5823__auto___21616;
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,handle,event_type_21614,lid_21617,event_type_21614], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,handle__$2,event_type__$1,lid__$1,event_type__$2){
var obj = cljs_thread.dom.registry.lookup(handle__$2);
var real_fn = cljs_thread.dom.registry.remove_listener_BANG_(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle__$2,event_type__$2,lid__$1], null));
if(cljs.core.truth_(real_fn)){
return obj.removeEventListener(event_type__$2,real_fn);
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
} else {
}
} else {
}

(target[prop] = value);

if(cljs.core.truth_(value)){
var lid_21618 = cljs_thread.dom.proxy.register_listener_BANG_(handle,event_type_21614,value);
var from_21619 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,from_21619,lid_21618,handle,event_type_21614,lid_21618,event_type_21614], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,from__$1,lid__$1,handle__$2,event_type__$1,lid__$2,event_type__$2){
var obj = cljs_thread.dom.registry.lookup(handle__$2);
var real_fn = (function (event){
return cljs_thread.dom.registry.post_dom_event(from__$1,lid__$2,cljs_thread.dom.registry.extract_event(event));
});
cljs_thread.dom.registry.store_listener_BANG_(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle__$2,event_type__$2,lid__$2], null),real_fn);

return obj.addEventListener(event_type__$2,real_fn);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
} else {
}
} else {
var wire_val_21620 = cljs_thread.dom.proxy.to_wire(value);
if(cljs.core.truth_(cljs.core.deref(cljs_thread.dom.proxy.batch_queue))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.dom.proxy.batch_queue,cljs.core.conj,[handle,prop,wire_val_21620]);
} else {
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,wire_val_21620,prop], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,wire_val__$1,prop__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
var resolved = cljs_thread.dom.registry.from_wire(wire_val__$1);
if(cljs.core.truth_(obj)){
return (obj[prop__$1] = resolved);
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
}

}
}
} else {
}

return true;
}), "has": (function (_target,prop){
if(typeof prop === 'string'){
var result = cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,prop], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,prop__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
if(cljs.core.truth_(obj)){
return (!(((obj[prop__$1]) == null)));
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return cljs.core.boolean$(result);
} else {
return false;
}
}), "deleteProperty": (function (_target,prop){
if(typeof prop === 'string'){
cljs_thread.dom.proxy.in_sync(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"screen","screen",1990059748),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [handle,prop], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (handle__$1,prop__$1){
var obj = cljs_thread.dom.registry.lookup(handle__$1);
if(cljs.core.truth_(obj)){
return delete obj[prop__$1];
} else {
return null;
}
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
} else {
}

return true;
}), "getPrototypeOf": (function (_target){
var type_hint = (target["__dom_type"]);
var ctor_name = (((type_hint == null))?null:((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type_hint,"Document")) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type_hint,"HTMLDocument"))))?"Document":((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type_hint,"Window"))?null:(cljs.core.truth_((function (){var and__5043__auto__ = typeof type_hint === 'string';
if(and__5043__auto__){
return type_hint.startsWith("HTML");
} else {
return and__5043__auto__;
}
})())?"HTMLElement":"Element"
))));
var temp__5823__auto__ = (function (){var and__5043__auto__ = ctor_name;
if(cljs.core.truth_(and__5043__auto__)){
return (globalThis[ctor_name]);
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var ctor = temp__5823__auto__;
return ctor.prototype;
} else {
return null;
}
})});
var proxy = (new Proxy(target,handler));
cljs_thread.dom.proxy.proxy_cache.set(handle,proxy);

return proxy;
}
});
/**
 * Create a Proxy for the document object (handle 1).
 */
cljs_thread.dom.proxy.document_proxy = (function cljs_thread$dom$proxy$document_proxy(){
return cljs_thread.dom.proxy.wrap_proxy(cljs_thread.dom.registry.DOCUMENT_HANDLE,"Document");
});
/**
 * Create a Proxy for the window object (handle 0).
 */
cljs_thread.dom.proxy.window_proxy = (function cljs_thread$dom$proxy$window_proxy(){
return cljs_thread.dom.proxy.wrap_proxy(cljs_thread.dom.registry.WINDOW_HANDLE,"Window");
});
/**
 * Check if an object is a DOM proxy.
 */
cljs_thread.dom.proxy.is_dom_proxy_QMARK_ = (function cljs_thread$dom$proxy$is_dom_proxy_QMARK_(obj){
return (((!((obj == null)))) && ((function (){try{return (obj["__is_dom_proxy"]);
}catch (e21474){var _ = e21474;
return false;
}})() === true));
});
/**
 * Get the handle of a DOM proxy, or nil if not a proxy.
 */
cljs_thread.dom.proxy.handle_of = (function cljs_thread$dom$proxy$handle_of(obj){
if(cljs_thread.dom.proxy.is_dom_proxy_QMARK_(obj)){
return (obj["__dom_handle"]);
} else {
return null;
}
});

//# sourceMappingURL=cljs_thread.dom.proxy.js.map
