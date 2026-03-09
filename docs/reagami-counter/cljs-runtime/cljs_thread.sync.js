goog.provide('cljs_thread.sync');
cljs_thread.sync.no_blocking_QMARK_ = (function cljs_thread$sync$no_blocking_QMARK_(){
if(cljs_thread.platform.node_QMARK_){
return false;
} else {
if(cljs.core.truth_(cljs_thread.platform.sab_sync_QMARK_)){
return false;
} else {
return (!(cljs.core.contains_QMARK_(cljs.core.deref(cljs_thread.state.conf),new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247))));

}
}
});
cljs_thread.sync.throw_if_non_blocking = (function cljs_thread$sync$throw_if_non_blocking(){
if(cljs_thread.sync.no_blocking_QMARK_()){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(["Can't deref without a sync mechanism.\n","Either:\n","  1. Set COOP/COEP headers for SharedArrayBuffer support, or\n","  2. Add `:sw-connect-string \"sw.js\"` to your init! config\n","Something like:\n"," `(cljs-thread.core/init! {:sw-connect-string \"sw.js\"\n","                      :connect-string \"/core.js\"})"].join(''),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"conf","conf",-983921284),cljs.core.deref(cljs_thread.state.conf),new cljs.core.Keyword(null,"env","env",-1815813235),cljs_thread.env.data], null));
} else {
return null;
}
});
/**
 * Create a sync channel for direct SAB sync.
 * Returns {:signal-sab <8-byte SAB> :response-atom <eve atom>}.
 * The signal-sab is used for Atomics.wait/notify coordination.
 * The response-atom holds the response data as a map {in-id -> result}.
 */
cljs_thread.sync.make_sync_channel = (function cljs_thread$sync$make_sync_channel(var_args){
var G__20447 = arguments.length;
switch (G__20447) {
case 0:
return cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0 = (function (){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271),(new SharedArrayBuffer((8))),new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196),(function (){var G__20448 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$1(G__20448) : cljs_thread.eve.atom.call(null, G__20448));
})()], null);
}));

(cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$1 = (function (response_atom){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271),(new SharedArrayBuffer((8))),new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196),response_atom], null);
}));

(cljs_thread.sync.make_sync_channel.cljs$lang$maxFixedArity = 1);

/**
 * Write response to the sync channel's eve atom and signal the waiter.
 * Called by the worker that computed the result.
 * Uses in-id as key in the response-atom map to support concurrent requests.
 */
cljs_thread.sync.deliver_response = (function cljs_thread$sync$deliver_response(p__20449,in_id,result){
var map__20450 = p__20449;
var map__20450__$1 = cljs.core.__destructure_map(map__20450);
var signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20450__$1,new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271));
var response_atom = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20450__$1,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196));
if((((signal_sab instanceof SharedArrayBuffer)) && ((signal_sab.byteLength > (0))))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(response_atom,cljs.core.assoc,in_id,result);

var signal_i32 = (new Int32Array(signal_sab));
Atomics.store(signal_i32,(0),(1));

return Atomics.notify(signal_i32,(0),(1));
} else {
return null;
}
});
/**
 * Block until response arrives via sync channel, then return it.
 * Removes the response from the atom map after reading.
 * Called by the worker that is waiting for a result.
 */
cljs_thread.sync.await_response = (function cljs_thread$sync$await_response(sync_channel,in_id){
var map__20453 = sync_channel;
var map__20453__$1 = cljs.core.__destructure_map(map__20453);
var signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20453__$1,new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271));
var response_atom = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20453__$1,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196));
var signal_i32 = (new Int32Array(signal_sab));
var current_val = Atomics.load(signal_i32,(0));
if((current_val > (0))){
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(response_atom),in_id);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(response_atom,cljs.core.dissoc,in_id);

return result;
} else {
Atomics.wait(signal_i32,(0),(0));

var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(response_atom),in_id);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(response_atom,cljs.core.dissoc,in_id);

return result;
}
});
/**
 * Reset a sync channel's signal for reuse.
 * Only resets the signal SAB - response atom uses KV and cleans up per-request.
 */
cljs_thread.sync.reset_sync_channel_BANG_ = (function cljs_thread$sync$reset_sync_channel_BANG_(p__20458){
var map__20459 = p__20458;
var map__20459__$1 = cljs.core.__destructure_map(map__20459);
var signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20459__$1,new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271));
var signal_i32 = (new Int32Array(signal_sab));
return Atomics.store(signal_i32,(0),(0));
});
/**
 * Request a response via the Service Worker fallback path.
 * For direct SAB sync (Node or browser with SAB), use wrap-derefable-direct instead.
 */
cljs_thread.sync.request = (function cljs_thread$sync$request(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20486 = arguments.length;
var i__5770__auto___20487 = (0);
while(true){
if((i__5770__auto___20487 < len__5769__auto___20486)){
args__5775__auto__.push((arguments[i__5770__auto___20487]));

var G__20488 = (i__5770__auto___20487 + (1));
i__5770__auto___20487 = G__20488;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic = (function (getter,p__20462){
var map__20465 = p__20462;
var map__20465__$1 = cljs.core.__destructure_map(map__20465);
var opts = map__20465__$1;
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
var reject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"reject","reject",1415953113));
var no_park = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"no-park","no-park",-2136886220));
var max_time = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"max-time","max-time",857408479));
var duration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20465__$1,new cljs.core.Keyword(null,"duration","duration",1444101068));
cljs_thread.sync.throw_if_non_blocking();

if(cljs.core.truth_((function (){var or__5045__auto__ = cljs_thread.platform.node_QMARK_;
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.platform.sab_sync_QMARK_;
}
})())){
return null;
} else {
if(cljs.core.truth_((function (){var or__5045__auto__ = (!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(getter,new cljs.core.Keyword(null,"sw","sw",833113913))));
if(or__5045__auto__){
return or__5045__auto__;
} else {
var or__5045__auto____$1 = cljs.core.not(cljs_thread.env.in_screen_QMARK_());
if(or__5045__auto____$1){
return or__5045__auto____$1;
} else {
return cljs_thread.platform.coordinator_ready_QMARK_();
}
}
})())){
return cljs_thread.platform.request(getter,opts);
} else {
return null;
}
}
}));

(cljs_thread.sync.request.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.sync.request.cljs$lang$applyTo = (function (seq20460){
var G__20461 = cljs.core.first(seq20460);
var seq20460__$1 = cljs.core.next(seq20460);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20461,seq20460__$1);
}));

/**
 * Send a response via the Service Worker fallback path.
 * For direct SAB sync (Node or browser with SAB), use deliver-response instead.
 */
cljs_thread.sync.send_response = (function cljs_thread$sync$send_response(var_args){
var args__5775__auto__ = [];
var len__5769__auto___20489 = arguments.length;
var i__5770__auto___20490 = (0);
while(true){
if((i__5770__auto___20490 < len__5769__auto___20489)){
args__5775__auto__.push((arguments[i__5770__auto___20490]));

var G__20491 = (i__5770__auto___20490 + (1));
i__5770__auto___20490 = G__20491;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.sync.send_response.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs_thread.sync.send_response.cljs$core$IFn$_invoke$arity$variadic = (function (payload,p__20472){
var vec__20473 = p__20472;
var _db_QMARK_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20473,(0),null);
cljs_thread.sync.throw_if_non_blocking();

if(cljs.core.truth_((function (){var or__5045__auto__ = cljs_thread.platform.node_QMARK_;
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.platform.sab_sync_QMARK_;
}
})())){
return null;
} else {
return cljs_thread.platform.send_response(payload);
}
}));

(cljs_thread.sync.send_response.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.sync.send_response.cljs$lang$applyTo = (function (seq20470){
var G__20471 = cljs.core.first(seq20470);
var seq20470__$1 = cljs.core.next(seq20470);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__20471,seq20470__$1);
}));

(Promise.prototype.cljs$core$ICloneable$ = cljs.core.PROTOCOL_SENTINEL);

(Promise.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (p){
var p__$1 = this;
return p__$1.then();
}));
(cljs.core.ICloneable["string"] = true);

(cljs.core._clone["string"] = (function (s){
return (new String(s));
}));
(cljs.core.Keyword.prototype.cljs$core$ICloneable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.Keyword.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (k){
var k__$1 = this;
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k__$1);
}));
cljs_thread.sync.wrap_derefable = (function cljs_thread$sync$wrap_derefable(p__20478){
var map__20479 = p__20478;
var map__20479__$1 = cljs.core.__destructure_map(map__20479);
var data = map__20479__$1;
var promise_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20479__$1,new cljs.core.Keyword(null,"promise?","promise?",-1924347409));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20479__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var id__$1 = (((((!((id == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === id.cljs_thread$id$IDable$))))?true:(((!id.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,id):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,id)))?cljs_thread.id.get_id(id):id);
var resolved_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var resolved_value = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var promise_QMARK___$1 = (cljs.core.truth_((function (){var or__5045__auto__ = cljs_thread.env.in_root_QMARK_();
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.env.in_screen_QMARK_();
}
})())?true:promise_QMARK_);
var do_promise = (function (no_delay_QMARK_){
return (new Promise((cljs.core.truth_(no_delay_QMARK_)?(function (p1__20476_SHARP_,p2__20477_SHARP_){
return cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic(id__$1,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"resolve","resolve",-1584445482),p1__20476_SHARP_,new cljs.core.Keyword(null,"reject","reject",1415953113),p2__20477_SHARP_], null)], 0));
}):(function (){
return id__$1;
})))).then((function (result){
cljs.core.reset_BANG_(resolved_QMARK_,true);

cljs.core.reset_BANG_(resolved_value,result);

if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(result))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Error in remote call",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"result","result",1415092211),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([result], 0))], null));
} else {
return result;
}
}));
});
var p = ((cljs.core.not(promise_QMARK___$1))?id__$1:do_promise(false));
var obj = (function (){var x20481 = cljs.core.clone(p);
(x20481.cljs_thread$id$IDable$ = cljs.core.PROTOCOL_SENTINEL);

(x20481.cljs_thread$id$IDable$get_id$arity$1 = (function (_){
var ___$1 = this;
return id__$1;
}));

(x20481.cljs$core$IPending$ = cljs.core.PROTOCOL_SENTINEL);

(x20481.cljs$core$IPending$_realized_QMARK_$arity$1 = (function (_){
var ___$1 = this;
return cljs.core.deref(resolved_QMARK_);
}));

(x20481.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL);

(x20481.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (x,writer,opts){
var x__$1 = this;
return cljs.core._write(writer,["#cljs-thread {:id ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((((id__$1 instanceof cljs.core.Keyword))?id__$1:cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id__$1], 0)))),"}"].join(''));
}));

(x20481.cljs$core$IDeref$ = cljs.core.PROTOCOL_SENTINEL);

(x20481.cljs$core$IDeref$_deref$arity$1 = (function (_){
var ___$1 = this;
var temp__5821__auto__ = cljs.core.deref(resolved_value);
if(cljs.core.truth_(temp__5821__auto__)){
var res = temp__5821__auto__;
return res;
} else {
if(cljs.core.truth_(promise_QMARK___$1)){
return do_promise(true);
} else {
var ___$2 = cljs_thread.sync.throw_if_non_blocking();
var res = cljs_thread.sync.request(id__$1);
cljs.core.reset_BANG_(resolved_QMARK_,true);

cljs.core.reset_BANG_(resolved_value,res);

if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(res))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Error in remote call",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"results","results",-1134170113),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([res], 0))], null));
} else {
return res;
}
}
}
}));

return x20481;
})();
(obj.__cljs_thread_parkable__ = true);

return obj;
});
cljs.reader.register_tag_parser_BANG_(new cljs.core.Symbol(null,"cljs-thread","cljs-thread",1544542575,null),(function (x){
return cljs_thread.sync.wrap_derefable(x);
}));
/**
 * Create a derefable that blocks on a sync-channel (direct SAB sync).
 * Used for in/future calls when SAB sync is available.
 * Supports both blocking deref (@) and async resolution via .__park_resolve__.
 */
cljs_thread.sync.wrap_derefable_direct = (function cljs_thread$sync$wrap_derefable_direct(p__20482){
var map__20483 = p__20482;
var map__20483__$1 = cljs.core.__destructure_map(map__20483);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20483__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var sync_channel = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20483__$1,new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328));
var resolved_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var resolved_value = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var do_block = (function (){
var res = cljs_thread.sync.await_response(sync_channel,id);
cljs.core.reset_BANG_(resolved_QMARK_,true);

cljs.core.reset_BANG_(resolved_value,res);

if(cljs.core.truth_((function (){var and__5043__auto__ = cljs.core.map_QMARK_(res);
if(and__5043__auto__){
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(res);
} else {
return and__5043__auto__;
}
})())){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Error in remote call",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"result","result",1415092211),res], null));
} else {
return res;
}
});
var obj = (function (){var x20484 = cljs.core.clone(id);
(x20484.cljs_thread$id$IDable$ = cljs.core.PROTOCOL_SENTINEL);

(x20484.cljs_thread$id$IDable$get_id$arity$1 = (function (_){
var ___$1 = this;
return id;
}));

(x20484.cljs$core$IPending$ = cljs.core.PROTOCOL_SENTINEL);

(x20484.cljs$core$IPending$_realized_QMARK_$arity$1 = (function (_){
var ___$1 = this;
return cljs.core.deref(resolved_QMARK_);
}));

(x20484.cljs$core$IPrintWithWriter$ = cljs.core.PROTOCOL_SENTINEL);

(x20484.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (x,writer,opts){
var x__$1 = this;
return cljs.core._write(writer,["#cljs-thread {:id ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((((id instanceof cljs.core.Keyword))?id:cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0)))),"}"].join(''));
}));

(x20484.cljs$core$IDeref$ = cljs.core.PROTOCOL_SENTINEL);

(x20484.cljs$core$IDeref$_deref$arity$1 = (function (_){
var ___$1 = this;
if(cljs.core.truth_(cljs.core.deref(resolved_QMARK_))){
return cljs.core.deref(resolved_value);
} else {
return do_block();
}
}));

return x20484;
})();
(obj.__cljs_thread_parkable__ = true);

(obj.__cljs_thread_sync_channel__ = sync_channel);

return obj;
});
cljs_thread.sync.sleep = (function cljs_thread$sync$sleep(n){
cljs_thread.sync.throw_if_non_blocking();

return cljs_thread.platform.sleep(n);
});

//# sourceMappingURL=cljs_thread.sync.js.map
