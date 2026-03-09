goog.provide('cljs.core.async');
goog.scope(function(){
  cljs.core.async.goog$module$goog$array = goog.module.get('goog.array');
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async29434 = (function (f,blockable,meta29435){
this.f = f;
this.blockable = blockable;
this.meta29435 = meta29435;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29436,meta29435__$1){
var self__ = this;
var _29436__$1 = this;
return (new cljs.core.async.t_cljs$core$async29434(self__.f,self__.blockable,meta29435__$1));
}));

(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29436){
var self__ = this;
var _29436__$1 = this;
return self__.meta29435;
}));

(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
}));

(cljs.core.async.t_cljs$core$async29434.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
}));

(cljs.core.async.t_cljs$core$async29434.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"blockable","blockable",-28395259,null),new cljs.core.Symbol(null,"meta29435","meta29435",1651632017,null)], null);
}));

(cljs.core.async.t_cljs$core$async29434.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29434.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29434");

(cljs.core.async.t_cljs$core$async29434.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29434");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29434.
 */
cljs.core.async.__GT_t_cljs$core$async29434 = (function cljs$core$async$__GT_t_cljs$core$async29434(f,blockable,meta29435){
return (new cljs.core.async.t_cljs$core$async29434(f,blockable,meta29435));
});


cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var G__29432 = arguments.length;
switch (G__29432) {
case 1:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1 = (function (f){
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(f,true);
}));

(cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2 = (function (f,blockable){
return (new cljs.core.async.t_cljs$core$async29434(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
}));

(cljs.core.async.fn_handler.cljs$lang$maxFixedArity = 2);

/**
 * Returns a fixed buffer of size n. When full, puts will block/park.
 */
cljs.core.async.buffer = (function cljs$core$async$buffer(n){
return cljs.core.async.impl.buffers.fixed_buffer(n);
});
/**
 * Returns a buffer of size n. When full, puts will complete but
 *   val will be dropped (no transfer).
 */
cljs.core.async.dropping_buffer = (function cljs$core$async$dropping_buffer(n){
return cljs.core.async.impl.buffers.dropping_buffer(n);
});
/**
 * Returns a buffer of size n. When full, puts will complete, and be
 *   buffered, but oldest elements in buffer will be dropped (not
 *   transferred).
 */
cljs.core.async.sliding_buffer = (function cljs$core$async$sliding_buffer(n){
return cljs.core.async.impl.buffers.sliding_buffer(n);
});
/**
 * Returns true if a channel created with buff will never block. That is to say,
 * puts into this buffer will never cause the buffer to be full. 
 */
cljs.core.async.unblocking_buffer_QMARK_ = (function cljs$core$async$unblocking_buffer_QMARK_(buff){
if((!((buff == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === buff.cljs$core$async$impl$protocols$UnblockingBuffer$)))){
return true;
} else {
if((!buff.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(cljs.core.async.impl.protocols.UnblockingBuffer,buff);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(cljs.core.async.impl.protocols.UnblockingBuffer,buff);
}
});
/**
 * Creates a channel with an optional buffer, an optional transducer (like (map f),
 *   (filter p) etc or a composition thereof), and an optional exception handler.
 *   If buf-or-n is a number, will create and use a fixed buffer of that size. If a
 *   transducer is supplied a buffer must be specified. ex-handler must be a
 *   fn of one argument - if an exception occurs during transformation it will be called
 *   with the thrown value as an argument, and any non-nil return value will be placed
 *   in the channel.
 */
cljs.core.async.chan = (function cljs$core$async$chan(var_args){
var G__29464 = arguments.length;
switch (G__29464) {
case 0:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(null);
}));

(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1 = (function (buf_or_n){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(buf_or_n,null,null);
}));

(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2 = (function (buf_or_n,xform){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(buf_or_n,xform,null);
}));

(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3 = (function (buf_or_n,xform,ex_handler){
var buf_or_n__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(buf_or_n,(0)))?null:buf_or_n);
if(cljs.core.truth_(xform)){
if(cljs.core.truth_(buf_or_n__$1)){
} else {
throw (new Error(["Assert failed: ","buffer must be supplied when transducer is","\n","buf-or-n"].join('')));
}
} else {
}

return cljs.core.async.impl.channels.chan.cljs$core$IFn$_invoke$arity$3(((typeof buf_or_n__$1 === 'number')?cljs.core.async.buffer(buf_or_n__$1):buf_or_n__$1),xform,ex_handler);
}));

(cljs.core.async.chan.cljs$lang$maxFixedArity = 3);

/**
 * Creates a promise channel with an optional transducer, and an optional
 *   exception-handler. A promise channel can take exactly one value that consumers
 *   will receive. Once full, puts complete but val is dropped (no transfer).
 *   Consumers will block until either a value is placed in the channel or the
 *   channel is closed. See chan for the semantics of xform and ex-handler.
 */
cljs.core.async.promise_chan = (function cljs$core$async$promise_chan(var_args){
var G__29471 = arguments.length;
switch (G__29471) {
case 0:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1(null);
}));

(cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1 = (function (xform){
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2(xform,null);
}));

(cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2 = (function (xform,ex_handler){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(cljs.core.async.impl.buffers.promise_buffer(),xform,ex_handler);
}));

(cljs.core.async.promise_chan.cljs$lang$maxFixedArity = 2);

/**
 * Returns a channel that will close after msecs
 */
cljs.core.async.timeout = (function cljs$core$async$timeout(msecs){
return cljs.core.async.impl.timers.timeout(msecs);
});
/**
 * takes a val from port. Must be called inside a (go ...) block. Will
 *   return nil if closed. Will park if nothing is available.
 *   Returns true unless port is already closed
 */
cljs.core.async._LT__BANG_ = (function cljs$core$async$_LT__BANG_(port){
throw (new Error("<! used not in (go ...) block"));
});
/**
 * Asynchronously takes a val from port, passing to fn1. Will pass nil
 * if closed. If on-caller? (default true) is true, and value is
 * immediately available, will call fn1 on calling thread.
 * Returns nil.
 */
cljs.core.async.take_BANG_ = (function cljs$core$async$take_BANG_(var_args){
var G__29474 = arguments.length;
switch (G__29474) {
case 2:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,fn1){
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3(port,fn1,true);
}));

(cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,fn1,on_caller_QMARK_){
var ret = cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(fn1));
if(cljs.core.truth_(ret)){
var val_31969 = cljs.core.deref(ret);
if(cljs.core.truth_(on_caller_QMARK_)){
(fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_31969) : fn1.call(null, val_31969));
} else {
cljs.core.async.impl.dispatch.run((function (){
return (fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_31969) : fn1.call(null, val_31969));
}));
}
} else {
}

return null;
}));

(cljs.core.async.take_BANG_.cljs$lang$maxFixedArity = 3);

cljs.core.async.nop = (function cljs$core$async$nop(_){
return null;
});
cljs.core.async.fhnop = cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(cljs.core.async.nop);
/**
 * puts a val into port. nil values are not allowed. Must be called
 *   inside a (go ...) block. Will park if no buffer space is available.
 *   Returns true unless port is already closed.
 */
cljs.core.async._GT__BANG_ = (function cljs$core$async$_GT__BANG_(port,val){
throw (new Error(">! used not in (go ...) block"));
});
/**
 * Asynchronously puts a val into port, calling fn1 (if supplied) when
 * complete. nil values are not allowed. Will throw if closed. If
 * on-caller? (default true) is true, and the put is immediately
 * accepted, will call fn1 on calling thread.  Returns nil.
 */
cljs.core.async.put_BANG_ = (function cljs$core$async$put_BANG_(var_args){
var G__29478 = arguments.length;
switch (G__29478) {
case 2:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,val){
var temp__5821__auto__ = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fhnop);
if(cljs.core.truth_(temp__5821__auto__)){
var ret = temp__5821__auto__;
return cljs.core.deref(ret);
} else {
return true;
}
}));

(cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,val,fn1){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4(port,val,fn1,true);
}));

(cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (port,val,fn1,on_caller_QMARK_){
var temp__5821__auto__ = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(fn1));
if(cljs.core.truth_(temp__5821__auto__)){
var retb = temp__5821__auto__;
var ret = cljs.core.deref(retb);
if(cljs.core.truth_(on_caller_QMARK_)){
(fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(ret) : fn1.call(null, ret));
} else {
cljs.core.async.impl.dispatch.run((function (){
return (fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(ret) : fn1.call(null, ret));
}));
}

return ret;
} else {
return true;
}
}));

(cljs.core.async.put_BANG_.cljs$lang$maxFixedArity = 4);

cljs.core.async.close_BANG_ = (function cljs$core$async$close_BANG_(port){
return cljs.core.async.impl.protocols.close_BANG_(port);
});
cljs.core.async.random_array = (function cljs$core$async$random_array(n){
var a = (new Array(n));
var n__5636__auto___31971 = n;
var x_31972 = (0);
while(true){
if((x_31972 < n__5636__auto___31971)){
(a[x_31972] = x_31972);

var G__31973 = (x_31972 + (1));
x_31972 = G__31973;
continue;
} else {
}
break;
}

cljs.core.async.goog$module$goog$array.shuffle(a);

return a;
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async29485 = (function (flag,meta29486){
this.flag = flag;
this.meta29486 = meta29486;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29487,meta29486__$1){
var self__ = this;
var _29487__$1 = this;
return (new cljs.core.async.t_cljs$core$async29485(self__.flag,meta29486__$1));
}));

(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29487){
var self__ = this;
var _29487__$1 = this;
return self__.meta29486;
}));

(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29485.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.flag,null);

return true;
}));

(cljs.core.async.t_cljs$core$async29485.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"meta29486","meta29486",-135142307,null)], null);
}));

(cljs.core.async.t_cljs$core$async29485.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29485.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29485");

(cljs.core.async.t_cljs$core$async29485.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29485");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29485.
 */
cljs.core.async.__GT_t_cljs$core$async29485 = (function cljs$core$async$__GT_t_cljs$core$async29485(flag,meta29486){
return (new cljs.core.async.t_cljs$core$async29485(flag,meta29486));
});


cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true);
return (new cljs.core.async.t_cljs$core$async29485(flag,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async29490 = (function (flag,cb,meta29491){
this.flag = flag;
this.cb = cb;
this.meta29491 = meta29491;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29492,meta29491__$1){
var self__ = this;
var _29492__$1 = this;
return (new cljs.core.async.t_cljs$core$async29490(self__.flag,self__.cb,meta29491__$1));
}));

(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29492){
var self__ = this;
var _29492__$1 = this;
return self__.meta29491;
}));

(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29490.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit(self__.flag);

return self__.cb;
}));

(cljs.core.async.t_cljs$core$async29490.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null),new cljs.core.Symbol(null,"meta29491","meta29491",-1796655709,null)], null);
}));

(cljs.core.async.t_cljs$core$async29490.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29490.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29490");

(cljs.core.async.t_cljs$core$async29490.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29490");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29490.
 */
cljs.core.async.__GT_t_cljs$core$async29490 = (function cljs$core$async$__GT_t_cljs$core$async29490(flag,cb,meta29491){
return (new cljs.core.async.t_cljs$core$async29490(flag,cb,meta29491));
});


cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
return (new cljs.core.async.t_cljs$core$async29490(flag,cb,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * returns derefable [val port] if immediate, nil if enqueued
 */
cljs.core.async.do_alts = (function cljs$core$async$do_alts(fret,ports,opts){
if((cljs.core.count(ports) > (0))){
} else {
throw (new Error(["Assert failed: ","alts must have at least one channel operation","\n","(pos? (count ports))"].join('')));
}

var flag = cljs.core.async.alt_flag();
var n = cljs.core.count(ports);
var idxs = cljs.core.async.random_array(n);
var priority = new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(opts);
var ret = (function (){var i = (0);
while(true){
if((i < n)){
var idx = (cljs.core.truth_(priority)?i:(idxs[i]));
var port = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(ports,idx);
var wport = ((cljs.core.vector_QMARK_(port))?(port.cljs$core$IFn$_invoke$arity$1 ? port.cljs$core$IFn$_invoke$arity$1((0)) : port.call(null, (0))):null);
var vbox = (cljs.core.truth_(wport)?(function (){var val = (port.cljs$core$IFn$_invoke$arity$1 ? port.cljs$core$IFn$_invoke$arity$1((1)) : port.call(null, (1)));
return cljs.core.async.impl.protocols.put_BANG_(wport,val,cljs.core.async.alt_handler(flag,((function (i,val,idx,port,wport,flag,n,idxs,priority){
return (function (p1__29495_SHARP_){
var G__29503 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29495_SHARP_,wport], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29503) : fret.call(null, G__29503));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.alt_handler(flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__29496_SHARP_){
var G__29504 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29496_SHARP_,port], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29504) : fret.call(null, G__29504));
});})(i,idx,port,wport,flag,n,idxs,priority))
)));
if(cljs.core.truth_(vbox)){
return cljs.core.async.impl.channels.box(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.deref(vbox),(function (){var or__5045__auto__ = wport;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return port;
}
})()], null));
} else {
var G__31985 = (i + (1));
i = G__31985;
continue;
}
} else {
return null;
}
break;
}
})();
var or__5045__auto__ = ret;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
if(cljs.core.contains_QMARK_(opts,new cljs.core.Keyword(null,"default","default",-1987822328))){
var temp__5823__auto__ = (function (){var and__5043__auto__ = flag.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1(null, );
if(cljs.core.truth_(and__5043__auto__)){
return flag.cljs$core$async$impl$protocols$Handler$commit$arity$1(null, );
} else {
return and__5043__auto__;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var got = temp__5823__auto__;
return cljs.core.async.impl.channels.box(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"default","default",-1987822328).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"default","default",-1987822328)], null));
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Completes at most one of several channel operations. Must be called
 * inside a (go ...) block. ports is a vector of channel endpoints,
 * which can be either a channel to take from or a vector of
 *   [channel-to-put-to val-to-put], in any combination. Takes will be
 *   made as if by <!, and puts will be made as if by >!. Unless
 *   the :priority option is true, if more than one port operation is
 *   ready a non-deterministic choice will be made. If no operation is
 *   ready and a :default value is supplied, [default-val :default] will
 *   be returned, otherwise alts! will park until the first operation to
 *   become ready completes. Returns [val port] of the completed
 *   operation, where val is the value taken for takes, and a
 *   boolean (true unless already closed, as per put!) for puts.
 * 
 *   opts are passed as :key val ... Supported options:
 * 
 *   :default val - the value to use if none of the operations are immediately ready
 *   :priority true - (default nil) when true, the operations will be tried in order.
 * 
 *   Note: there is no guarantee that the port exps or val exprs will be
 *   used, nor in what order should they be, so they should not be
 *   depended upon for side effects.
 */
cljs.core.async.alts_BANG_ = (function cljs$core$async$alts_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___31989 = arguments.length;
var i__5770__auto___31991 = (0);
while(true){
if((i__5770__auto___31991 < len__5769__auto___31989)){
args__5775__auto__.push((arguments[i__5770__auto___31991]));

var G__31997 = (i__5770__auto___31991 + (1));
i__5770__auto___31991 = G__31997;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__29513){
var map__29514 = p__29513;
var map__29514__$1 = cljs.core.__destructure_map(map__29514);
var opts = map__29514__$1;
throw (new Error("alts! used not in (go ...) block"));
}));

(cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq29511){
var G__29512 = cljs.core.first(seq29511);
var seq29511__$1 = cljs.core.next(seq29511);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__29512,seq29511__$1);
}));

/**
 * Puts a val into port if it's possible to do so immediately.
 *   nil values are not allowed. Never blocks. Returns true if offer succeeds.
 */
cljs.core.async.offer_BANG_ = (function cljs$core$async$offer_BANG_(port,val){
var ret = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref(ret);
} else {
return null;
}
});
/**
 * Takes a val from port if it's possible to do so immediately.
 *   Never blocks. Returns value if successful, nil otherwise.
 */
cljs.core.async.poll_BANG_ = (function cljs$core$async$poll_BANG_(port){
var ret = cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref(ret);
} else {
return null;
}
});
/**
 * Takes elements from the from channel and supplies them to the to
 * channel. By default, the to channel will be closed when the from
 * channel closes, but can be determined by the close?  parameter. Will
 * stop consuming the from channel if the to channel closes
 */
cljs.core.async.pipe = (function cljs$core$async$pipe(var_args){
var G__29517 = arguments.length;
switch (G__29517) {
case 2:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2 = (function (from,to){
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3(from,to,true);
}));

(cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3 = (function (from,to,close_QMARK_){
var c__29282__auto___32024 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29548){
var state_val_29549 = (state_29548[(1)]);
if((state_val_29549 === (7))){
var inst_29543 = (state_29548[(2)]);
var state_29548__$1 = state_29548;
var statearr_29552_32031 = state_29548__$1;
(statearr_29552_32031[(2)] = inst_29543);

(statearr_29552_32031[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (1))){
var state_29548__$1 = state_29548;
var statearr_29553_32032 = state_29548__$1;
(statearr_29553_32032[(2)] = null);

(statearr_29553_32032[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (4))){
var inst_29526 = (state_29548[(7)]);
var inst_29526__$1 = (state_29548[(2)]);
var inst_29527 = (inst_29526__$1 == null);
var state_29548__$1 = (function (){var statearr_29559 = state_29548;
(statearr_29559[(7)] = inst_29526__$1);

return statearr_29559;
})();
if(cljs.core.truth_(inst_29527)){
var statearr_29560_32033 = state_29548__$1;
(statearr_29560_32033[(1)] = (5));

} else {
var statearr_29561_32036 = state_29548__$1;
(statearr_29561_32036[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (13))){
var state_29548__$1 = state_29548;
var statearr_29563_32038 = state_29548__$1;
(statearr_29563_32038[(2)] = null);

(statearr_29563_32038[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (6))){
var inst_29526 = (state_29548[(7)]);
var state_29548__$1 = state_29548;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29548__$1,(11),to,inst_29526);
} else {
if((state_val_29549 === (3))){
var inst_29545 = (state_29548[(2)]);
var state_29548__$1 = state_29548;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29548__$1,inst_29545);
} else {
if((state_val_29549 === (12))){
var state_29548__$1 = state_29548;
var statearr_29565_32040 = state_29548__$1;
(statearr_29565_32040[(2)] = null);

(statearr_29565_32040[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (2))){
var state_29548__$1 = state_29548;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29548__$1,(4),from);
} else {
if((state_val_29549 === (11))){
var inst_29536 = (state_29548[(2)]);
var state_29548__$1 = state_29548;
if(cljs.core.truth_(inst_29536)){
var statearr_29570_32041 = state_29548__$1;
(statearr_29570_32041[(1)] = (12));

} else {
var statearr_29571_32042 = state_29548__$1;
(statearr_29571_32042[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (9))){
var state_29548__$1 = state_29548;
var statearr_29572_32043 = state_29548__$1;
(statearr_29572_32043[(2)] = null);

(statearr_29572_32043[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (5))){
var state_29548__$1 = state_29548;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29574_32044 = state_29548__$1;
(statearr_29574_32044[(1)] = (8));

} else {
var statearr_29575_32045 = state_29548__$1;
(statearr_29575_32045[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (14))){
var inst_29541 = (state_29548[(2)]);
var state_29548__$1 = state_29548;
var statearr_29576_32047 = state_29548__$1;
(statearr_29576_32047[(2)] = inst_29541);

(statearr_29576_32047[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (10))){
var inst_29533 = (state_29548[(2)]);
var state_29548__$1 = state_29548;
var statearr_29577_32048 = state_29548__$1;
(statearr_29577_32048[(2)] = inst_29533);

(statearr_29577_32048[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29549 === (8))){
var inst_29530 = cljs.core.async.close_BANG_(to);
var state_29548__$1 = state_29548;
var statearr_29578_32049 = state_29548__$1;
(statearr_29578_32049[(2)] = inst_29530);

(statearr_29578_32049[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_29579 = [null,null,null,null,null,null,null,null];
(statearr_29579[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_29579[(1)] = (1));

return statearr_29579;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_29548){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29548);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29580){var ex__28416__auto__ = e29580;
var statearr_29581_32054 = state_29548;
(statearr_29581_32054[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29548[(4)]))){
var statearr_29582_32055 = state_29548;
(statearr_29582_32055[(1)] = cljs.core.first((state_29548[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32056 = state_29548;
state_29548 = G__32056;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_29548){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_29548);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_29584 = f__29283__auto__();
(statearr_29584[(6)] = c__29282__auto___32024);

return statearr_29584;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return to;
}));

(cljs.core.async.pipe.cljs$lang$maxFixedArity = 3);

cljs.core.async.pipeline_STAR_ = (function cljs$core$async$pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,type){
if((n > (0))){
} else {
throw (new Error("Assert failed: (pos? n)"));
}

var jobs = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(n);
var results = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(n);
var process__$1 = (function (p__29586){
var vec__29587 = p__29586;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29587,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29587,(1),null);
var job = vec__29587;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((1),xf,ex_handler);
var c__29282__auto___32061 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29594){
var state_val_29595 = (state_29594[(1)]);
if((state_val_29595 === (1))){
var state_29594__$1 = state_29594;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29594__$1,(2),res,v);
} else {
if((state_val_29595 === (2))){
var inst_29591 = (state_29594[(2)]);
var inst_29592 = cljs.core.async.close_BANG_(res);
var state_29594__$1 = (function (){var statearr_29597 = state_29594;
(statearr_29597[(7)] = inst_29591);

return statearr_29597;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_29594__$1,inst_29592);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_29598 = [null,null,null,null,null,null,null,null];
(statearr_29598[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__);

(statearr_29598[(1)] = (1));

return statearr_29598;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1 = (function (state_29594){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29594);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29600){var ex__28416__auto__ = e29600;
var statearr_29601_32064 = state_29594;
(statearr_29601_32064[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29594[(4)]))){
var statearr_29602_32065 = state_29594;
(statearr_29602_32065[(1)] = cljs.core.first((state_29594[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32066 = state_29594;
state_29594 = G__32066;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = function(state_29594){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1.call(this,state_29594);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_29606 = f__29283__auto__();
(statearr_29606[(6)] = c__29282__auto___32061);

return statearr_29606;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});
var async = (function (p__29608){
var vec__29609 = p__29608;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29609,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29609,(1),null);
var job = vec__29609;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
(xf.cljs$core$IFn$_invoke$arity$2 ? xf.cljs$core$IFn$_invoke$arity$2(v,res) : xf.call(null, v,res));

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});
var n__5636__auto___32068 = n;
var __32069 = (0);
while(true){
if((__32069 < n__5636__auto___32068)){
var G__29612_32070 = type;
var G__29612_32071__$1 = (((G__29612_32070 instanceof cljs.core.Keyword))?G__29612_32070.fqn:null);
switch (G__29612_32071__$1) {
case "compute":
var c__29282__auto___32073 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32069,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = ((function (__32069,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function (state_29625){
var state_val_29626 = (state_29625[(1)]);
if((state_val_29626 === (1))){
var state_29625__$1 = state_29625;
var statearr_29627_32075 = state_29625__$1;
(statearr_29627_32075[(2)] = null);

(statearr_29627_32075[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29626 === (2))){
var state_29625__$1 = state_29625;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29625__$1,(4),jobs);
} else {
if((state_val_29626 === (3))){
var inst_29623 = (state_29625[(2)]);
var state_29625__$1 = state_29625;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29625__$1,inst_29623);
} else {
if((state_val_29626 === (4))){
var inst_29615 = (state_29625[(2)]);
var inst_29616 = process__$1(inst_29615);
var state_29625__$1 = state_29625;
if(cljs.core.truth_(inst_29616)){
var statearr_29629_32079 = state_29625__$1;
(statearr_29629_32079[(1)] = (5));

} else {
var statearr_29630_32080 = state_29625__$1;
(statearr_29630_32080[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29626 === (5))){
var state_29625__$1 = state_29625;
var statearr_29632_32081 = state_29625__$1;
(statearr_29632_32081[(2)] = null);

(statearr_29632_32081[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29626 === (6))){
var state_29625__$1 = state_29625;
var statearr_29633_32083 = state_29625__$1;
(statearr_29633_32083[(2)] = null);

(statearr_29633_32083[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29626 === (7))){
var inst_29621 = (state_29625[(2)]);
var state_29625__$1 = state_29625;
var statearr_29634_32085 = state_29625__$1;
(statearr_29634_32085[(2)] = inst_29621);

(statearr_29634_32085[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
});})(__32069,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
;
return ((function (__32069,switch__28412__auto__,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_29635 = [null,null,null,null,null,null,null];
(statearr_29635[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__);

(statearr_29635[(1)] = (1));

return statearr_29635;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1 = (function (state_29625){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29625);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29636){var ex__28416__auto__ = e29636;
var statearr_29638_32086 = state_29625;
(statearr_29638_32086[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29625[(4)]))){
var statearr_29639_32088 = state_29625;
(statearr_29639_32088[(1)] = cljs.core.first((state_29625[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32090 = state_29625;
state_29625 = G__32090;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = function(state_29625){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1.call(this,state_29625);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__;
})()
;})(__32069,switch__28412__auto__,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
})();
var state__29284__auto__ = (function (){var statearr_29644 = f__29283__auto__();
(statearr_29644[(6)] = c__29282__auto___32073);

return statearr_29644;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
});})(__32069,c__29282__auto___32073,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
);


break;
case "async":
var c__29282__auto___32092 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32069,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = ((function (__32069,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function (state_29658){
var state_val_29659 = (state_29658[(1)]);
if((state_val_29659 === (1))){
var state_29658__$1 = state_29658;
var statearr_29661_32093 = state_29658__$1;
(statearr_29661_32093[(2)] = null);

(statearr_29661_32093[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29659 === (2))){
var state_29658__$1 = state_29658;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29658__$1,(4),jobs);
} else {
if((state_val_29659 === (3))){
var inst_29656 = (state_29658[(2)]);
var state_29658__$1 = state_29658;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29658__$1,inst_29656);
} else {
if((state_val_29659 === (4))){
var inst_29648 = (state_29658[(2)]);
var inst_29649 = async(inst_29648);
var state_29658__$1 = state_29658;
if(cljs.core.truth_(inst_29649)){
var statearr_29663_32094 = state_29658__$1;
(statearr_29663_32094[(1)] = (5));

} else {
var statearr_29664_32095 = state_29658__$1;
(statearr_29664_32095[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29659 === (5))){
var state_29658__$1 = state_29658;
var statearr_29665_32096 = state_29658__$1;
(statearr_29665_32096[(2)] = null);

(statearr_29665_32096[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29659 === (6))){
var state_29658__$1 = state_29658;
var statearr_29667_32100 = state_29658__$1;
(statearr_29667_32100[(2)] = null);

(statearr_29667_32100[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29659 === (7))){
var inst_29654 = (state_29658[(2)]);
var state_29658__$1 = state_29658;
var statearr_29671_32101 = state_29658__$1;
(statearr_29671_32101[(2)] = inst_29654);

(statearr_29671_32101[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
});})(__32069,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
;
return ((function (__32069,switch__28412__auto__,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_29672 = [null,null,null,null,null,null,null];
(statearr_29672[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__);

(statearr_29672[(1)] = (1));

return statearr_29672;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1 = (function (state_29658){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29658);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29674){var ex__28416__auto__ = e29674;
var statearr_29675_32102 = state_29658;
(statearr_29675_32102[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29658[(4)]))){
var statearr_29676_32103 = state_29658;
(statearr_29676_32103[(1)] = cljs.core.first((state_29658[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32104 = state_29658;
state_29658 = G__32104;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = function(state_29658){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1.call(this,state_29658);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__;
})()
;})(__32069,switch__28412__auto__,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
})();
var state__29284__auto__ = (function (){var statearr_29677 = f__29283__auto__();
(statearr_29677[(6)] = c__29282__auto___32092);

return statearr_29677;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
});})(__32069,c__29282__auto___32092,G__29612_32070,G__29612_32071__$1,n__5636__auto___32068,jobs,results,process__$1,async))
);


break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29612_32071__$1)].join('')));

}

var G__32105 = (__32069 + (1));
__32069 = G__32105;
continue;
} else {
}
break;
}

var c__29282__auto___32106 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29701){
var state_val_29702 = (state_29701[(1)]);
if((state_val_29702 === (7))){
var inst_29697 = (state_29701[(2)]);
var state_29701__$1 = state_29701;
var statearr_29703_32107 = state_29701__$1;
(statearr_29703_32107[(2)] = inst_29697);

(statearr_29703_32107[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29702 === (1))){
var state_29701__$1 = state_29701;
var statearr_29704_32110 = state_29701__$1;
(statearr_29704_32110[(2)] = null);

(statearr_29704_32110[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29702 === (4))){
var inst_29681 = (state_29701[(7)]);
var inst_29681__$1 = (state_29701[(2)]);
var inst_29682 = (inst_29681__$1 == null);
var state_29701__$1 = (function (){var statearr_29705 = state_29701;
(statearr_29705[(7)] = inst_29681__$1);

return statearr_29705;
})();
if(cljs.core.truth_(inst_29682)){
var statearr_29706_32112 = state_29701__$1;
(statearr_29706_32112[(1)] = (5));

} else {
var statearr_29707_32113 = state_29701__$1;
(statearr_29707_32113[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29702 === (6))){
var inst_29687 = (state_29701[(8)]);
var inst_29681 = (state_29701[(7)]);
var inst_29687__$1 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var inst_29688 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_29689 = [inst_29681,inst_29687__$1];
var inst_29690 = (new cljs.core.PersistentVector(null,2,(5),inst_29688,inst_29689,null));
var state_29701__$1 = (function (){var statearr_29710 = state_29701;
(statearr_29710[(8)] = inst_29687__$1);

return statearr_29710;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29701__$1,(8),jobs,inst_29690);
} else {
if((state_val_29702 === (3))){
var inst_29699 = (state_29701[(2)]);
var state_29701__$1 = state_29701;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29701__$1,inst_29699);
} else {
if((state_val_29702 === (2))){
var state_29701__$1 = state_29701;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29701__$1,(4),from);
} else {
if((state_val_29702 === (9))){
var inst_29694 = (state_29701[(2)]);
var state_29701__$1 = (function (){var statearr_29711 = state_29701;
(statearr_29711[(9)] = inst_29694);

return statearr_29711;
})();
var statearr_29712_32114 = state_29701__$1;
(statearr_29712_32114[(2)] = null);

(statearr_29712_32114[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29702 === (5))){
var inst_29684 = cljs.core.async.close_BANG_(jobs);
var state_29701__$1 = state_29701;
var statearr_29713_32119 = state_29701__$1;
(statearr_29713_32119[(2)] = inst_29684);

(statearr_29713_32119[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29702 === (8))){
var inst_29687 = (state_29701[(8)]);
var inst_29692 = (state_29701[(2)]);
var state_29701__$1 = (function (){var statearr_29714 = state_29701;
(statearr_29714[(10)] = inst_29692);

return statearr_29714;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29701__$1,(9),results,inst_29687);
} else {
return null;
}
}
}
}
}
}
}
}
}
});
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_29715 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_29715[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__);

(statearr_29715[(1)] = (1));

return statearr_29715;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1 = (function (state_29701){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29701);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29716){var ex__28416__auto__ = e29716;
var statearr_29717_32120 = state_29701;
(statearr_29717_32120[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29701[(4)]))){
var statearr_29718_32121 = state_29701;
(statearr_29718_32121[(1)] = cljs.core.first((state_29701[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32122 = state_29701;
state_29701 = G__32122;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = function(state_29701){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1.call(this,state_29701);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_29720 = f__29283__auto__();
(statearr_29720[(6)] = c__29282__auto___32106);

return statearr_29720;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


var c__29282__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29761){
var state_val_29762 = (state_29761[(1)]);
if((state_val_29762 === (7))){
var inst_29757 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
var statearr_29765_32123 = state_29761__$1;
(statearr_29765_32123[(2)] = inst_29757);

(statearr_29765_32123[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (20))){
var state_29761__$1 = state_29761;
var statearr_29766_32124 = state_29761__$1;
(statearr_29766_32124[(2)] = null);

(statearr_29766_32124[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (1))){
var state_29761__$1 = state_29761;
var statearr_29767_32125 = state_29761__$1;
(statearr_29767_32125[(2)] = null);

(statearr_29767_32125[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (4))){
var inst_29723 = (state_29761[(7)]);
var inst_29723__$1 = (state_29761[(2)]);
var inst_29727 = (inst_29723__$1 == null);
var state_29761__$1 = (function (){var statearr_29768 = state_29761;
(statearr_29768[(7)] = inst_29723__$1);

return statearr_29768;
})();
if(cljs.core.truth_(inst_29727)){
var statearr_29769_32126 = state_29761__$1;
(statearr_29769_32126[(1)] = (5));

} else {
var statearr_29770_32127 = state_29761__$1;
(statearr_29770_32127[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (15))){
var inst_29739 = (state_29761[(8)]);
var state_29761__$1 = state_29761;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29761__$1,(18),to,inst_29739);
} else {
if((state_val_29762 === (21))){
var inst_29752 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
var statearr_29772_32128 = state_29761__$1;
(statearr_29772_32128[(2)] = inst_29752);

(statearr_29772_32128[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (13))){
var inst_29754 = (state_29761[(2)]);
var state_29761__$1 = (function (){var statearr_29773 = state_29761;
(statearr_29773[(9)] = inst_29754);

return statearr_29773;
})();
var statearr_29774_32129 = state_29761__$1;
(statearr_29774_32129[(2)] = null);

(statearr_29774_32129[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (6))){
var inst_29723 = (state_29761[(7)]);
var state_29761__$1 = state_29761;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29761__$1,(11),inst_29723);
} else {
if((state_val_29762 === (17))){
var inst_29747 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
if(cljs.core.truth_(inst_29747)){
var statearr_29775_32134 = state_29761__$1;
(statearr_29775_32134[(1)] = (19));

} else {
var statearr_29776_32135 = state_29761__$1;
(statearr_29776_32135[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (3))){
var inst_29759 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29761__$1,inst_29759);
} else {
if((state_val_29762 === (12))){
var inst_29736 = (state_29761[(10)]);
var state_29761__$1 = state_29761;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29761__$1,(14),inst_29736);
} else {
if((state_val_29762 === (2))){
var state_29761__$1 = state_29761;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29761__$1,(4),results);
} else {
if((state_val_29762 === (19))){
var state_29761__$1 = state_29761;
var statearr_29782_32148 = state_29761__$1;
(statearr_29782_32148[(2)] = null);

(statearr_29782_32148[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (11))){
var inst_29736 = (state_29761[(2)]);
var state_29761__$1 = (function (){var statearr_29783 = state_29761;
(statearr_29783[(10)] = inst_29736);

return statearr_29783;
})();
var statearr_29784_32149 = state_29761__$1;
(statearr_29784_32149[(2)] = null);

(statearr_29784_32149[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (9))){
var state_29761__$1 = state_29761;
var statearr_29788_32150 = state_29761__$1;
(statearr_29788_32150[(2)] = null);

(statearr_29788_32150[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (5))){
var state_29761__$1 = state_29761;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29789_32151 = state_29761__$1;
(statearr_29789_32151[(1)] = (8));

} else {
var statearr_29791_32152 = state_29761__$1;
(statearr_29791_32152[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (14))){
var inst_29739 = (state_29761[(8)]);
var inst_29741 = (state_29761[(11)]);
var inst_29739__$1 = (state_29761[(2)]);
var inst_29740 = (inst_29739__$1 == null);
var inst_29741__$1 = cljs.core.not(inst_29740);
var state_29761__$1 = (function (){var statearr_29795 = state_29761;
(statearr_29795[(8)] = inst_29739__$1);

(statearr_29795[(11)] = inst_29741__$1);

return statearr_29795;
})();
if(inst_29741__$1){
var statearr_29796_32153 = state_29761__$1;
(statearr_29796_32153[(1)] = (15));

} else {
var statearr_29801_32154 = state_29761__$1;
(statearr_29801_32154[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (16))){
var inst_29741 = (state_29761[(11)]);
var state_29761__$1 = state_29761;
var statearr_29805_32155 = state_29761__$1;
(statearr_29805_32155[(2)] = inst_29741);

(statearr_29805_32155[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (10))){
var inst_29733 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
var statearr_29806_32156 = state_29761__$1;
(statearr_29806_32156[(2)] = inst_29733);

(statearr_29806_32156[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (18))){
var inst_29744 = (state_29761[(2)]);
var state_29761__$1 = state_29761;
var statearr_29807_32157 = state_29761__$1;
(statearr_29807_32157[(2)] = inst_29744);

(statearr_29807_32157[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29762 === (8))){
var inst_29730 = cljs.core.async.close_BANG_(to);
var state_29761__$1 = state_29761;
var statearr_29808_32158 = state_29761__$1;
(statearr_29808_32158[(2)] = inst_29730);

(statearr_29808_32158[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
});
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_29810 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_29810[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__);

(statearr_29810[(1)] = (1));

return statearr_29810;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1 = (function (state_29761){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29761);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29814){var ex__28416__auto__ = e29814;
var statearr_29815_32159 = state_29761;
(statearr_29815_32159[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29761[(4)]))){
var statearr_29817_32160 = state_29761;
(statearr_29817_32160[(1)] = cljs.core.first((state_29761[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32164 = state_29761;
state_29761 = G__32164;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__ = function(state_29761){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1.call(this,state_29761);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_29821 = f__29283__auto__();
(statearr_29821[(6)] = c__29282__auto__);

return statearr_29821;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

return c__29282__auto__;
});
/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the async function af, with parallelism n. af
 *   must be a function of two arguments, the first an input value and
 *   the second a channel on which to place the result(s). The
 *   presumption is that af will return immediately, having launched some
 *   asynchronous operation whose completion/callback will put results on
 *   the channel, then close! it. Outputs will be returned in order
 *   relative to the inputs. By default, the to channel will be closed
 *   when the from channel closes, but can be determined by the close?
 *   parameter. Will stop consuming the from channel if the to channel
 *   closes. See also pipeline, pipeline-blocking.
 */
cljs.core.async.pipeline_async = (function cljs$core$async$pipeline_async(var_args){
var G__29826 = arguments.length;
switch (G__29826) {
case 4:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4 = (function (n,to,af,from){
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5(n,to,af,from,true);
}));

(cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5 = (function (n,to,af,from,close_QMARK_){
return cljs.core.async.pipeline_STAR_(n,to,af,from,close_QMARK_,null,new cljs.core.Keyword(null,"async","async",1050769601));
}));

(cljs.core.async.pipeline_async.cljs$lang$maxFixedArity = 5);

/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the transducer xf, with parallelism n. Because
 *   it is parallel, the transducer will be applied independently to each
 *   element, not across elements, and may produce zero or more outputs
 *   per input.  Outputs will be returned in order relative to the
 *   inputs. By default, the to channel will be closed when the from
 *   channel closes, but can be determined by the close?  parameter. Will
 *   stop consuming the from channel if the to channel closes.
 * 
 *   Note this is supplied for API compatibility with the Clojure version.
 *   Values of N > 1 will not result in actual concurrency in a
 *   single-threaded runtime.
 */
cljs.core.async.pipeline = (function cljs$core$async$pipeline(var_args){
var G__29839 = arguments.length;
switch (G__29839) {
case 4:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4 = (function (n,to,xf,from){
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5(n,to,xf,from,true);
}));

(cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5 = (function (n,to,xf,from,close_QMARK_){
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6(n,to,xf,from,close_QMARK_,null);
}));

(cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6 = (function (n,to,xf,from,close_QMARK_,ex_handler){
return cljs.core.async.pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,new cljs.core.Keyword(null,"compute","compute",1555393130));
}));

(cljs.core.async.pipeline.cljs$lang$maxFixedArity = 6);

/**
 * Takes a predicate and a source channel and returns a vector of two
 *   channels, the first of which will contain the values for which the
 *   predicate returned true, the second those for which it returned
 *   false.
 * 
 *   The out channels will be unbuffered by default, or two buf-or-ns can
 *   be supplied. The channels will close after the source channel has
 *   closed.
 */
cljs.core.async.split = (function cljs$core$async$split(var_args){
var G__29850 = arguments.length;
switch (G__29850) {
case 2:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.split.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4(p,ch,null,null);
}));

(cljs.core.async.split.cljs$core$IFn$_invoke$arity$4 = (function (p,ch,t_buf_or_n,f_buf_or_n){
var tc = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(t_buf_or_n);
var fc = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(f_buf_or_n);
var c__29282__auto___32171 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29884){
var state_val_29885 = (state_29884[(1)]);
if((state_val_29885 === (7))){
var inst_29880 = (state_29884[(2)]);
var state_29884__$1 = state_29884;
var statearr_29893_32172 = state_29884__$1;
(statearr_29893_32172[(2)] = inst_29880);

(statearr_29893_32172[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (1))){
var state_29884__$1 = state_29884;
var statearr_29895_32176 = state_29884__$1;
(statearr_29895_32176[(2)] = null);

(statearr_29895_32176[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (4))){
var inst_29859 = (state_29884[(7)]);
var inst_29859__$1 = (state_29884[(2)]);
var inst_29861 = (inst_29859__$1 == null);
var state_29884__$1 = (function (){var statearr_29897 = state_29884;
(statearr_29897[(7)] = inst_29859__$1);

return statearr_29897;
})();
if(cljs.core.truth_(inst_29861)){
var statearr_29900_32177 = state_29884__$1;
(statearr_29900_32177[(1)] = (5));

} else {
var statearr_29902_32178 = state_29884__$1;
(statearr_29902_32178[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (13))){
var state_29884__$1 = state_29884;
var statearr_29904_32182 = state_29884__$1;
(statearr_29904_32182[(2)] = null);

(statearr_29904_32182[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (6))){
var inst_29859 = (state_29884[(7)]);
var inst_29867 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_29859) : p.call(null, inst_29859));
var state_29884__$1 = state_29884;
if(cljs.core.truth_(inst_29867)){
var statearr_29906_32190 = state_29884__$1;
(statearr_29906_32190[(1)] = (9));

} else {
var statearr_29907_32191 = state_29884__$1;
(statearr_29907_32191[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (3))){
var inst_29882 = (state_29884[(2)]);
var state_29884__$1 = state_29884;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29884__$1,inst_29882);
} else {
if((state_val_29885 === (12))){
var state_29884__$1 = state_29884;
var statearr_29913_32192 = state_29884__$1;
(statearr_29913_32192[(2)] = null);

(statearr_29913_32192[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (2))){
var state_29884__$1 = state_29884;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29884__$1,(4),ch);
} else {
if((state_val_29885 === (11))){
var inst_29859 = (state_29884[(7)]);
var inst_29871 = (state_29884[(2)]);
var state_29884__$1 = state_29884;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29884__$1,(8),inst_29871,inst_29859);
} else {
if((state_val_29885 === (9))){
var state_29884__$1 = state_29884;
var statearr_29918_32197 = state_29884__$1;
(statearr_29918_32197[(2)] = tc);

(statearr_29918_32197[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (5))){
var inst_29863 = cljs.core.async.close_BANG_(tc);
var inst_29865 = cljs.core.async.close_BANG_(fc);
var state_29884__$1 = (function (){var statearr_29920 = state_29884;
(statearr_29920[(8)] = inst_29863);

return statearr_29920;
})();
var statearr_29925_32198 = state_29884__$1;
(statearr_29925_32198[(2)] = inst_29865);

(statearr_29925_32198[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (14))){
var inst_29878 = (state_29884[(2)]);
var state_29884__$1 = state_29884;
var statearr_29926_32199 = state_29884__$1;
(statearr_29926_32199[(2)] = inst_29878);

(statearr_29926_32199[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (10))){
var state_29884__$1 = state_29884;
var statearr_29929_32200 = state_29884__$1;
(statearr_29929_32200[(2)] = fc);

(statearr_29929_32200[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29885 === (8))){
var inst_29873 = (state_29884[(2)]);
var state_29884__$1 = state_29884;
if(cljs.core.truth_(inst_29873)){
var statearr_29931_32201 = state_29884__$1;
(statearr_29931_32201[(1)] = (12));

} else {
var statearr_29932_32202 = state_29884__$1;
(statearr_29932_32202[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_29934 = [null,null,null,null,null,null,null,null,null];
(statearr_29934[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_29934[(1)] = (1));

return statearr_29934;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_29884){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29884);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e29938){var ex__28416__auto__ = e29938;
var statearr_29939_32203 = state_29884;
(statearr_29939_32203[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29884[(4)]))){
var statearr_29940_32204 = state_29884;
(statearr_29940_32204[(1)] = cljs.core.first((state_29884[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32206 = state_29884;
state_29884 = G__32206;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_29884){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_29884);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_29943 = f__29283__auto__();
(statearr_29943[(6)] = c__29282__auto___32171);

return statearr_29943;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [tc,fc], null);
}));

(cljs.core.async.split.cljs$lang$maxFixedArity = 4);

/**
 * f should be a function of 2 arguments. Returns a channel containing
 *   the single result of applying f to init and the first item from the
 *   channel, then applying f to that result and the 2nd item, etc. If
 *   the channel closes without yielding items, returns init and f is not
 *   called. ch must close before reduce produces a result.
 */
cljs.core.async.reduce = (function cljs$core$async$reduce(f,init,ch){
var c__29282__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_29974){
var state_val_29976 = (state_29974[(1)]);
if((state_val_29976 === (7))){
var inst_29969 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
var statearr_29978_32210 = state_29974__$1;
(statearr_29978_32210[(2)] = inst_29969);

(statearr_29978_32210[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (1))){
var inst_29951 = init;
var inst_29952 = inst_29951;
var state_29974__$1 = (function (){var statearr_29983 = state_29974;
(statearr_29983[(7)] = inst_29952);

return statearr_29983;
})();
var statearr_29984_32211 = state_29974__$1;
(statearr_29984_32211[(2)] = null);

(statearr_29984_32211[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (4))){
var inst_29955 = (state_29974[(8)]);
var inst_29955__$1 = (state_29974[(2)]);
var inst_29956 = (inst_29955__$1 == null);
var state_29974__$1 = (function (){var statearr_29990 = state_29974;
(statearr_29990[(8)] = inst_29955__$1);

return statearr_29990;
})();
if(cljs.core.truth_(inst_29956)){
var statearr_29994_32212 = state_29974__$1;
(statearr_29994_32212[(1)] = (5));

} else {
var statearr_29996_32213 = state_29974__$1;
(statearr_29996_32213[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (6))){
var inst_29955 = (state_29974[(8)]);
var inst_29959 = (state_29974[(9)]);
var inst_29952 = (state_29974[(7)]);
var inst_29959__$1 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(inst_29952,inst_29955) : f.call(null, inst_29952,inst_29955));
var inst_29960 = cljs.core.reduced_QMARK_(inst_29959__$1);
var state_29974__$1 = (function (){var statearr_29997 = state_29974;
(statearr_29997[(9)] = inst_29959__$1);

return statearr_29997;
})();
if(inst_29960){
var statearr_29999_32214 = state_29974__$1;
(statearr_29999_32214[(1)] = (8));

} else {
var statearr_30000_32215 = state_29974__$1;
(statearr_30000_32215[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (3))){
var inst_29971 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29974__$1,inst_29971);
} else {
if((state_val_29976 === (2))){
var state_29974__$1 = state_29974;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29974__$1,(4),ch);
} else {
if((state_val_29976 === (9))){
var inst_29959 = (state_29974[(9)]);
var inst_29952 = inst_29959;
var state_29974__$1 = (function (){var statearr_30004 = state_29974;
(statearr_30004[(7)] = inst_29952);

return statearr_30004;
})();
var statearr_30005_32223 = state_29974__$1;
(statearr_30005_32223[(2)] = null);

(statearr_30005_32223[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (5))){
var inst_29952 = (state_29974[(7)]);
var state_29974__$1 = state_29974;
var statearr_30007_32227 = state_29974__$1;
(statearr_30007_32227[(2)] = inst_29952);

(statearr_30007_32227[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (10))){
var inst_29966 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
var statearr_30010_32229 = state_29974__$1;
(statearr_30010_32229[(2)] = inst_29966);

(statearr_30010_32229[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (8))){
var inst_29959 = (state_29974[(9)]);
var inst_29962 = cljs.core.deref(inst_29959);
var state_29974__$1 = state_29974;
var statearr_30013_32232 = state_29974__$1;
(statearr_30013_32232[(2)] = inst_29962);

(statearr_30013_32232[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
});
return (function() {
var cljs$core$async$reduce_$_state_machine__28413__auto__ = null;
var cljs$core$async$reduce_$_state_machine__28413__auto____0 = (function (){
var statearr_30015 = [null,null,null,null,null,null,null,null,null,null];
(statearr_30015[(0)] = cljs$core$async$reduce_$_state_machine__28413__auto__);

(statearr_30015[(1)] = (1));

return statearr_30015;
});
var cljs$core$async$reduce_$_state_machine__28413__auto____1 = (function (state_29974){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_29974);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30017){var ex__28416__auto__ = e30017;
var statearr_30019_32233 = state_29974;
(statearr_30019_32233[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_29974[(4)]))){
var statearr_30021_32234 = state_29974;
(statearr_30021_32234[(1)] = cljs.core.first((state_29974[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32236 = state_29974;
state_29974 = G__32236;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__28413__auto__ = function(state_29974){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__28413__auto____1.call(this,state_29974);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__28413__auto____0;
cljs$core$async$reduce_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__28413__auto____1;
return cljs$core$async$reduce_$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30022 = f__29283__auto__();
(statearr_30022[(6)] = c__29282__auto__);

return statearr_30022;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

return c__29282__auto__;
});
/**
 * async/reduces a channel with a transformation (xform f).
 *   Returns a channel containing the result.  ch must close before
 *   transduce produces a result.
 */
cljs.core.async.transduce = (function cljs$core$async$transduce(xform,f,init,ch){
var f__$1 = (xform.cljs$core$IFn$_invoke$arity$1 ? xform.cljs$core$IFn$_invoke$arity$1(f) : xform.call(null, f));
var c__29282__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_30032){
var state_val_30033 = (state_30032[(1)]);
if((state_val_30033 === (1))){
var inst_30027 = cljs.core.async.reduce(f__$1,init,ch);
var state_30032__$1 = state_30032;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30032__$1,(2),inst_30027);
} else {
if((state_val_30033 === (2))){
var inst_30029 = (state_30032[(2)]);
var inst_30030 = (f__$1.cljs$core$IFn$_invoke$arity$1 ? f__$1.cljs$core$IFn$_invoke$arity$1(inst_30029) : f__$1.call(null, inst_30029));
var state_30032__$1 = state_30032;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30032__$1,inst_30030);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$transduce_$_state_machine__28413__auto__ = null;
var cljs$core$async$transduce_$_state_machine__28413__auto____0 = (function (){
var statearr_30042 = [null,null,null,null,null,null,null];
(statearr_30042[(0)] = cljs$core$async$transduce_$_state_machine__28413__auto__);

(statearr_30042[(1)] = (1));

return statearr_30042;
});
var cljs$core$async$transduce_$_state_machine__28413__auto____1 = (function (state_30032){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_30032);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30045){var ex__28416__auto__ = e30045;
var statearr_30046_32253 = state_30032;
(statearr_30046_32253[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_30032[(4)]))){
var statearr_30048_32254 = state_30032;
(statearr_30048_32254[(1)] = cljs.core.first((state_30032[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32256 = state_30032;
state_30032 = G__32256;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$transduce_$_state_machine__28413__auto__ = function(state_30032){
switch(arguments.length){
case 0:
return cljs$core$async$transduce_$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$transduce_$_state_machine__28413__auto____1.call(this,state_30032);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$transduce_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$transduce_$_state_machine__28413__auto____0;
cljs$core$async$transduce_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$transduce_$_state_machine__28413__auto____1;
return cljs$core$async$transduce_$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30050 = f__29283__auto__();
(statearr_30050[(6)] = c__29282__auto__);

return statearr_30050;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

return c__29282__auto__;
});
/**
 * Puts the contents of coll into the supplied channel.
 * 
 *   By default the channel will be closed after the items are copied,
 *   but can be determined by the close? parameter.
 * 
 *   Returns a channel which will close after the items are copied.
 */
cljs.core.async.onto_chan_BANG_ = (function cljs$core$async$onto_chan_BANG_(var_args){
var G__30056 = arguments.length;
switch (G__30056) {
case 2:
return cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (ch,coll){
return cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$3(ch,coll,true);
}));

(cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (ch,coll,close_QMARK_){
var c__29282__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_30086){
var state_val_30087 = (state_30086[(1)]);
if((state_val_30087 === (7))){
var inst_30067 = (state_30086[(2)]);
var state_30086__$1 = state_30086;
var statearr_30094_32262 = state_30086__$1;
(statearr_30094_32262[(2)] = inst_30067);

(statearr_30094_32262[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (1))){
var inst_30059 = cljs.core.seq(coll);
var inst_30060 = inst_30059;
var state_30086__$1 = (function (){var statearr_30096 = state_30086;
(statearr_30096[(7)] = inst_30060);

return statearr_30096;
})();
var statearr_30097_32263 = state_30086__$1;
(statearr_30097_32263[(2)] = null);

(statearr_30097_32263[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (4))){
var inst_30060 = (state_30086[(7)]);
var inst_30065 = cljs.core.first(inst_30060);
var state_30086__$1 = state_30086;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30086__$1,(7),ch,inst_30065);
} else {
if((state_val_30087 === (13))){
var inst_30080 = (state_30086[(2)]);
var state_30086__$1 = state_30086;
var statearr_30102_32264 = state_30086__$1;
(statearr_30102_32264[(2)] = inst_30080);

(statearr_30102_32264[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (6))){
var inst_30070 = (state_30086[(2)]);
var state_30086__$1 = state_30086;
if(cljs.core.truth_(inst_30070)){
var statearr_30103_32269 = state_30086__$1;
(statearr_30103_32269[(1)] = (8));

} else {
var statearr_30104_32270 = state_30086__$1;
(statearr_30104_32270[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (3))){
var inst_30084 = (state_30086[(2)]);
var state_30086__$1 = state_30086;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30086__$1,inst_30084);
} else {
if((state_val_30087 === (12))){
var state_30086__$1 = state_30086;
var statearr_30106_32279 = state_30086__$1;
(statearr_30106_32279[(2)] = null);

(statearr_30106_32279[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (2))){
var inst_30060 = (state_30086[(7)]);
var state_30086__$1 = state_30086;
if(cljs.core.truth_(inst_30060)){
var statearr_30107_32284 = state_30086__$1;
(statearr_30107_32284[(1)] = (4));

} else {
var statearr_30108_32285 = state_30086__$1;
(statearr_30108_32285[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (11))){
var inst_30077 = cljs.core.async.close_BANG_(ch);
var state_30086__$1 = state_30086;
var statearr_30112_32286 = state_30086__$1;
(statearr_30112_32286[(2)] = inst_30077);

(statearr_30112_32286[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (9))){
var state_30086__$1 = state_30086;
if(cljs.core.truth_(close_QMARK_)){
var statearr_30117_32287 = state_30086__$1;
(statearr_30117_32287[(1)] = (11));

} else {
var statearr_30118_32288 = state_30086__$1;
(statearr_30118_32288[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (5))){
var inst_30060 = (state_30086[(7)]);
var state_30086__$1 = state_30086;
var statearr_30120_32293 = state_30086__$1;
(statearr_30120_32293[(2)] = inst_30060);

(statearr_30120_32293[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (10))){
var inst_30082 = (state_30086[(2)]);
var state_30086__$1 = state_30086;
var statearr_30121_32294 = state_30086__$1;
(statearr_30121_32294[(2)] = inst_30082);

(statearr_30121_32294[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30087 === (8))){
var inst_30060 = (state_30086[(7)]);
var inst_30072 = cljs.core.next(inst_30060);
var inst_30060__$1 = inst_30072;
var state_30086__$1 = (function (){var statearr_30125 = state_30086;
(statearr_30125[(7)] = inst_30060__$1);

return statearr_30125;
})();
var statearr_30127_32297 = state_30086__$1;
(statearr_30127_32297[(2)] = null);

(statearr_30127_32297[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_30129 = [null,null,null,null,null,null,null,null];
(statearr_30129[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_30129[(1)] = (1));

return statearr_30129;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_30086){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_30086);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30131){var ex__28416__auto__ = e30131;
var statearr_30132_32305 = state_30086;
(statearr_30132_32305[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_30086[(4)]))){
var statearr_30133_32306 = state_30086;
(statearr_30133_32306[(1)] = cljs.core.first((state_30086[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32311 = state_30086;
state_30086 = G__32311;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_30086){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_30086);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30139 = f__29283__auto__();
(statearr_30139[(6)] = c__29282__auto__);

return statearr_30139;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

return c__29282__auto__;
}));

(cljs.core.async.onto_chan_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Creates and returns a channel which contains the contents of coll,
 *   closing when exhausted.
 */
cljs.core.async.to_chan_BANG_ = (function cljs$core$async$to_chan_BANG_(coll){
var ch = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(cljs.core.bounded_count((100),coll));
cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$2(ch,coll);

return ch;
});
/**
 * Deprecated - use onto-chan!
 */
cljs.core.async.onto_chan = (function cljs$core$async$onto_chan(var_args){
var G__30156 = arguments.length;
switch (G__30156) {
case 2:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2 = (function (ch,coll){
return cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$3(ch,coll,true);
}));

(cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3 = (function (ch,coll,close_QMARK_){
return cljs.core.async.onto_chan_BANG_.cljs$core$IFn$_invoke$arity$3(ch,coll,close_QMARK_);
}));

(cljs.core.async.onto_chan.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - use to-chan!
 */
cljs.core.async.to_chan = (function cljs$core$async$to_chan(coll){
return cljs.core.async.to_chan_BANG_(coll);
});

/**
 * @interface
 */
cljs.core.async.Mux = function(){};

var cljs$core$async$Mux$muxch_STAR_$dyn_32324 = (function (_){
var x__5393__auto__ = (((_ == null))?null:_);
var m__5394__auto__ = (cljs.core.async.muxch_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(_) : m__5394__auto__.call(null, _));
} else {
var m__5392__auto__ = (cljs.core.async.muxch_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(_) : m__5392__auto__.call(null, _));
} else {
throw cljs.core.missing_protocol("Mux.muxch*",_);
}
}
});
cljs.core.async.muxch_STAR_ = (function cljs$core$async$muxch_STAR_(_){
if((((!((_ == null)))) && ((!((_.cljs$core$async$Mux$muxch_STAR_$arity$1 == null)))))){
return _.cljs$core$async$Mux$muxch_STAR_$arity$1(_);
} else {
return cljs$core$async$Mux$muxch_STAR_$dyn_32324(_);
}
});


/**
 * @interface
 */
cljs.core.async.Mult = function(){};

var cljs$core$async$Mult$tap_STAR_$dyn_32339 = (function (m,ch,close_QMARK_){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.tap_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$3(m,ch,close_QMARK_) : m__5394__auto__.call(null, m,ch,close_QMARK_));
} else {
var m__5392__auto__ = (cljs.core.async.tap_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$3(m,ch,close_QMARK_) : m__5392__auto__.call(null, m,ch,close_QMARK_));
} else {
throw cljs.core.missing_protocol("Mult.tap*",m);
}
}
});
cljs.core.async.tap_STAR_ = (function cljs$core$async$tap_STAR_(m,ch,close_QMARK_){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mult$tap_STAR_$arity$3 == null)))))){
return m.cljs$core$async$Mult$tap_STAR_$arity$3(m,ch,close_QMARK_);
} else {
return cljs$core$async$Mult$tap_STAR_$dyn_32339(m,ch,close_QMARK_);
}
});

var cljs$core$async$Mult$untap_STAR_$dyn_32342 = (function (m,ch){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.untap_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5394__auto__.call(null, m,ch));
} else {
var m__5392__auto__ = (cljs.core.async.untap_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5392__auto__.call(null, m,ch));
} else {
throw cljs.core.missing_protocol("Mult.untap*",m);
}
}
});
cljs.core.async.untap_STAR_ = (function cljs$core$async$untap_STAR_(m,ch){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mult$untap_STAR_$arity$2 == null)))))){
return m.cljs$core$async$Mult$untap_STAR_$arity$2(m,ch);
} else {
return cljs$core$async$Mult$untap_STAR_$dyn_32342(m,ch);
}
});

var cljs$core$async$Mult$untap_all_STAR_$dyn_32355 = (function (m){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.untap_all_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__5394__auto__.call(null, m));
} else {
var m__5392__auto__ = (cljs.core.async.untap_all_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__5392__auto__.call(null, m));
} else {
throw cljs.core.missing_protocol("Mult.untap-all*",m);
}
}
});
cljs.core.async.untap_all_STAR_ = (function cljs$core$async$untap_all_STAR_(m){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mult$untap_all_STAR_$arity$1 == null)))))){
return m.cljs$core$async$Mult$untap_all_STAR_$arity$1(m);
} else {
return cljs$core$async$Mult$untap_all_STAR_$dyn_32355(m);
}
});


/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30232 = (function (ch,cs,meta30233){
this.ch = ch;
this.cs = cs;
this.meta30233 = meta30233;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30234,meta30233__$1){
var self__ = this;
var _30234__$1 = this;
return (new cljs.core.async.t_cljs$core$async30232(self__.ch,self__.cs,meta30233__$1));
}));

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30234){
var self__ = this;
var _30234__$1 = this;
return self__.meta30233;
}));

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mult$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
}));

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch__$1);

return null;
}));

(cljs.core.async.t_cljs$core$async30232.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return null;
}));

(cljs.core.async.t_cljs$core$async30232.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"meta30233","meta30233",1597246133,null)], null);
}));

(cljs.core.async.t_cljs$core$async30232.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30232.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30232");

(cljs.core.async.t_cljs$core$async30232.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30232");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30232.
 */
cljs.core.async.__GT_t_cljs$core$async30232 = (function cljs$core$async$__GT_t_cljs$core$async30232(ch,cs,meta30233){
return (new cljs.core.async.t_cljs$core$async30232(ch,cs,meta30233));
});


/**
 * Creates and returns a mult(iple) of the supplied channel. Channels
 *   containing copies of the channel can be created with 'tap', and
 *   detached with 'untap'.
 * 
 *   Each item is distributed to all taps in parallel and synchronously,
 *   i.e. each tap must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow taps from holding up the mult.
 * 
 *   Items received when there are no taps get dropped.
 * 
 *   If a tap puts to a closed channel, it will be removed from the mult.
 */
cljs.core.async.mult = (function cljs$core$async$mult(ch){
var cs = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var m = (new cljs.core.async.t_cljs$core$async30232(ch,cs,cljs.core.PersistentArrayMap.EMPTY));
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var done = (function (_){
if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,true);
} else {
return null;
}
});
var c__29282__auto___32359 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_30404){
var state_val_30408 = (state_30404[(1)]);
if((state_val_30408 === (7))){
var inst_30396 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30410_32360 = state_30404__$1;
(statearr_30410_32360[(2)] = inst_30396);

(statearr_30410_32360[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (20))){
var inst_30296 = (state_30404[(7)]);
var inst_30311 = cljs.core.first(inst_30296);
var inst_30312 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30311,(0),null);
var inst_30313 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30311,(1),null);
var state_30404__$1 = (function (){var statearr_30415 = state_30404;
(statearr_30415[(8)] = inst_30312);

return statearr_30415;
})();
if(cljs.core.truth_(inst_30313)){
var statearr_30416_32361 = state_30404__$1;
(statearr_30416_32361[(1)] = (22));

} else {
var statearr_30417_32362 = state_30404__$1;
(statearr_30417_32362[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (27))){
var inst_30344 = (state_30404[(9)]);
var inst_30342 = (state_30404[(10)]);
var inst_30254 = (state_30404[(11)]);
var inst_30349 = (state_30404[(12)]);
var inst_30349__$1 = cljs.core._nth(inst_30342,inst_30344);
var inst_30350 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30349__$1,inst_30254,done);
var state_30404__$1 = (function (){var statearr_30422 = state_30404;
(statearr_30422[(12)] = inst_30349__$1);

return statearr_30422;
})();
if(cljs.core.truth_(inst_30350)){
var statearr_30423_32367 = state_30404__$1;
(statearr_30423_32367[(1)] = (30));

} else {
var statearr_30424_32368 = state_30404__$1;
(statearr_30424_32368[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (1))){
var state_30404__$1 = state_30404;
var statearr_30425_32373 = state_30404__$1;
(statearr_30425_32373[(2)] = null);

(statearr_30425_32373[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (24))){
var inst_30296 = (state_30404[(7)]);
var inst_30319 = (state_30404[(2)]);
var inst_30320 = cljs.core.next(inst_30296);
var inst_30267 = inst_30320;
var inst_30268 = null;
var inst_30269 = (0);
var inst_30270 = (0);
var state_30404__$1 = (function (){var statearr_30429 = state_30404;
(statearr_30429[(13)] = inst_30269);

(statearr_30429[(14)] = inst_30270);

(statearr_30429[(15)] = inst_30268);

(statearr_30429[(16)] = inst_30267);

(statearr_30429[(17)] = inst_30319);

return statearr_30429;
})();
var statearr_30431_32384 = state_30404__$1;
(statearr_30431_32384[(2)] = null);

(statearr_30431_32384[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (39))){
var state_30404__$1 = state_30404;
var statearr_30435_32385 = state_30404__$1;
(statearr_30435_32385[(2)] = null);

(statearr_30435_32385[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (4))){
var inst_30254 = (state_30404[(11)]);
var inst_30254__$1 = (state_30404[(2)]);
var inst_30256 = (inst_30254__$1 == null);
var state_30404__$1 = (function (){var statearr_30440 = state_30404;
(statearr_30440[(11)] = inst_30254__$1);

return statearr_30440;
})();
if(cljs.core.truth_(inst_30256)){
var statearr_30441_32390 = state_30404__$1;
(statearr_30441_32390[(1)] = (5));

} else {
var statearr_30442_32394 = state_30404__$1;
(statearr_30442_32394[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (15))){
var inst_30269 = (state_30404[(13)]);
var inst_30270 = (state_30404[(14)]);
var inst_30268 = (state_30404[(15)]);
var inst_30267 = (state_30404[(16)]);
var inst_30291 = (state_30404[(2)]);
var inst_30293 = (inst_30270 + (1));
var tmp30432 = inst_30269;
var tmp30433 = inst_30268;
var tmp30434 = inst_30267;
var inst_30267__$1 = tmp30434;
var inst_30268__$1 = tmp30433;
var inst_30269__$1 = tmp30432;
var inst_30270__$1 = inst_30293;
var state_30404__$1 = (function (){var statearr_30443 = state_30404;
(statearr_30443[(13)] = inst_30269__$1);

(statearr_30443[(14)] = inst_30270__$1);

(statearr_30443[(15)] = inst_30268__$1);

(statearr_30443[(16)] = inst_30267__$1);

(statearr_30443[(18)] = inst_30291);

return statearr_30443;
})();
var statearr_30448_32402 = state_30404__$1;
(statearr_30448_32402[(2)] = null);

(statearr_30448_32402[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (21))){
var inst_30323 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30452_32408 = state_30404__$1;
(statearr_30452_32408[(2)] = inst_30323);

(statearr_30452_32408[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (31))){
var inst_30349 = (state_30404[(12)]);
var inst_30354 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30349);
var state_30404__$1 = state_30404;
var statearr_30453_32416 = state_30404__$1;
(statearr_30453_32416[(2)] = inst_30354);

(statearr_30453_32416[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (32))){
var inst_30344 = (state_30404[(9)]);
var inst_30343 = (state_30404[(19)]);
var inst_30342 = (state_30404[(10)]);
var inst_30341 = (state_30404[(20)]);
var inst_30356 = (state_30404[(2)]);
var inst_30357 = (inst_30344 + (1));
var tmp30449 = inst_30343;
var tmp30450 = inst_30342;
var tmp30451 = inst_30341;
var inst_30341__$1 = tmp30451;
var inst_30342__$1 = tmp30450;
var inst_30343__$1 = tmp30449;
var inst_30344__$1 = inst_30357;
var state_30404__$1 = (function (){var statearr_30455 = state_30404;
(statearr_30455[(9)] = inst_30344__$1);

(statearr_30455[(19)] = inst_30343__$1);

(statearr_30455[(21)] = inst_30356);

(statearr_30455[(10)] = inst_30342__$1);

(statearr_30455[(20)] = inst_30341__$1);

return statearr_30455;
})();
var statearr_30456_32434 = state_30404__$1;
(statearr_30456_32434[(2)] = null);

(statearr_30456_32434[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (40))){
var inst_30369 = (state_30404[(22)]);
var inst_30373 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30369);
var state_30404__$1 = state_30404;
var statearr_30457_32448 = state_30404__$1;
(statearr_30457_32448[(2)] = inst_30373);

(statearr_30457_32448[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (33))){
var inst_30360 = (state_30404[(23)]);
var inst_30362 = cljs.core.chunked_seq_QMARK_(inst_30360);
var state_30404__$1 = state_30404;
if(inst_30362){
var statearr_30458_32450 = state_30404__$1;
(statearr_30458_32450[(1)] = (36));

} else {
var statearr_30459_32452 = state_30404__$1;
(statearr_30459_32452[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (13))){
var inst_30282 = (state_30404[(24)]);
var inst_30288 = cljs.core.async.close_BANG_(inst_30282);
var state_30404__$1 = state_30404;
var statearr_30460_32453 = state_30404__$1;
(statearr_30460_32453[(2)] = inst_30288);

(statearr_30460_32453[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (22))){
var inst_30312 = (state_30404[(8)]);
var inst_30316 = cljs.core.async.close_BANG_(inst_30312);
var state_30404__$1 = state_30404;
var statearr_30461_32455 = state_30404__$1;
(statearr_30461_32455[(2)] = inst_30316);

(statearr_30461_32455[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (36))){
var inst_30360 = (state_30404[(23)]);
var inst_30364 = cljs.core.chunk_first(inst_30360);
var inst_30365 = cljs.core.chunk_rest(inst_30360);
var inst_30366 = cljs.core.count(inst_30364);
var inst_30341 = inst_30365;
var inst_30342 = inst_30364;
var inst_30343 = inst_30366;
var inst_30344 = (0);
var state_30404__$1 = (function (){var statearr_30464 = state_30404;
(statearr_30464[(9)] = inst_30344);

(statearr_30464[(19)] = inst_30343);

(statearr_30464[(10)] = inst_30342);

(statearr_30464[(20)] = inst_30341);

return statearr_30464;
})();
var statearr_30465_32466 = state_30404__$1;
(statearr_30465_32466[(2)] = null);

(statearr_30465_32466[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (41))){
var inst_30360 = (state_30404[(23)]);
var inst_30375 = (state_30404[(2)]);
var inst_30376 = cljs.core.next(inst_30360);
var inst_30341 = inst_30376;
var inst_30342 = null;
var inst_30343 = (0);
var inst_30344 = (0);
var state_30404__$1 = (function (){var statearr_30466 = state_30404;
(statearr_30466[(9)] = inst_30344);

(statearr_30466[(19)] = inst_30343);

(statearr_30466[(10)] = inst_30342);

(statearr_30466[(25)] = inst_30375);

(statearr_30466[(20)] = inst_30341);

return statearr_30466;
})();
var statearr_30467_32491 = state_30404__$1;
(statearr_30467_32491[(2)] = null);

(statearr_30467_32491[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (43))){
var state_30404__$1 = state_30404;
var statearr_30468_32495 = state_30404__$1;
(statearr_30468_32495[(2)] = null);

(statearr_30468_32495[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (29))){
var inst_30384 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30472_32503 = state_30404__$1;
(statearr_30472_32503[(2)] = inst_30384);

(statearr_30472_32503[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (44))){
var inst_30393 = (state_30404[(2)]);
var state_30404__$1 = (function (){var statearr_30473 = state_30404;
(statearr_30473[(26)] = inst_30393);

return statearr_30473;
})();
var statearr_30474_32512 = state_30404__$1;
(statearr_30474_32512[(2)] = null);

(statearr_30474_32512[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (6))){
var inst_30333 = (state_30404[(27)]);
var inst_30332 = cljs.core.deref(cs);
var inst_30333__$1 = cljs.core.keys(inst_30332);
var inst_30334 = cljs.core.count(inst_30333__$1);
var inst_30335 = cljs.core.reset_BANG_(dctr,inst_30334);
var inst_30340 = cljs.core.seq(inst_30333__$1);
var inst_30341 = inst_30340;
var inst_30342 = null;
var inst_30343 = (0);
var inst_30344 = (0);
var state_30404__$1 = (function (){var statearr_30475 = state_30404;
(statearr_30475[(28)] = inst_30335);

(statearr_30475[(9)] = inst_30344);

(statearr_30475[(19)] = inst_30343);

(statearr_30475[(10)] = inst_30342);

(statearr_30475[(27)] = inst_30333__$1);

(statearr_30475[(20)] = inst_30341);

return statearr_30475;
})();
var statearr_30479_32521 = state_30404__$1;
(statearr_30479_32521[(2)] = null);

(statearr_30479_32521[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (28))){
var inst_30341 = (state_30404[(20)]);
var inst_30360 = (state_30404[(23)]);
var inst_30360__$1 = cljs.core.seq(inst_30341);
var state_30404__$1 = (function (){var statearr_30480 = state_30404;
(statearr_30480[(23)] = inst_30360__$1);

return statearr_30480;
})();
if(inst_30360__$1){
var statearr_30481_32522 = state_30404__$1;
(statearr_30481_32522[(1)] = (33));

} else {
var statearr_30482_32524 = state_30404__$1;
(statearr_30482_32524[(1)] = (34));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (25))){
var inst_30344 = (state_30404[(9)]);
var inst_30343 = (state_30404[(19)]);
var inst_30346 = (inst_30344 < inst_30343);
var inst_30347 = inst_30346;
var state_30404__$1 = state_30404;
if(cljs.core.truth_(inst_30347)){
var statearr_30483_32530 = state_30404__$1;
(statearr_30483_32530[(1)] = (27));

} else {
var statearr_30484_32531 = state_30404__$1;
(statearr_30484_32531[(1)] = (28));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (34))){
var state_30404__$1 = state_30404;
var statearr_30485_32533 = state_30404__$1;
(statearr_30485_32533[(2)] = null);

(statearr_30485_32533[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (17))){
var state_30404__$1 = state_30404;
var statearr_30486_32534 = state_30404__$1;
(statearr_30486_32534[(2)] = null);

(statearr_30486_32534[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (3))){
var inst_30398 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30404__$1,inst_30398);
} else {
if((state_val_30408 === (12))){
var inst_30328 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30487_32535 = state_30404__$1;
(statearr_30487_32535[(2)] = inst_30328);

(statearr_30487_32535[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (2))){
var state_30404__$1 = state_30404;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30404__$1,(4),ch);
} else {
if((state_val_30408 === (23))){
var state_30404__$1 = state_30404;
var statearr_30488_32537 = state_30404__$1;
(statearr_30488_32537[(2)] = null);

(statearr_30488_32537[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (35))){
var inst_30382 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30489_32538 = state_30404__$1;
(statearr_30489_32538[(2)] = inst_30382);

(statearr_30489_32538[(1)] = (29));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (19))){
var inst_30296 = (state_30404[(7)]);
var inst_30300 = cljs.core.chunk_first(inst_30296);
var inst_30301 = cljs.core.chunk_rest(inst_30296);
var inst_30302 = cljs.core.count(inst_30300);
var inst_30267 = inst_30301;
var inst_30268 = inst_30300;
var inst_30269 = inst_30302;
var inst_30270 = (0);
var state_30404__$1 = (function (){var statearr_30490 = state_30404;
(statearr_30490[(13)] = inst_30269);

(statearr_30490[(14)] = inst_30270);

(statearr_30490[(15)] = inst_30268);

(statearr_30490[(16)] = inst_30267);

return statearr_30490;
})();
var statearr_30491_32544 = state_30404__$1;
(statearr_30491_32544[(2)] = null);

(statearr_30491_32544[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (11))){
var inst_30267 = (state_30404[(16)]);
var inst_30296 = (state_30404[(7)]);
var inst_30296__$1 = cljs.core.seq(inst_30267);
var state_30404__$1 = (function (){var statearr_30492 = state_30404;
(statearr_30492[(7)] = inst_30296__$1);

return statearr_30492;
})();
if(inst_30296__$1){
var statearr_30493_32549 = state_30404__$1;
(statearr_30493_32549[(1)] = (16));

} else {
var statearr_30494_32551 = state_30404__$1;
(statearr_30494_32551[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (9))){
var inst_30330 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30495_32552 = state_30404__$1;
(statearr_30495_32552[(2)] = inst_30330);

(statearr_30495_32552[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (5))){
var inst_30262 = cljs.core.deref(cs);
var inst_30263 = cljs.core.seq(inst_30262);
var inst_30267 = inst_30263;
var inst_30268 = null;
var inst_30269 = (0);
var inst_30270 = (0);
var state_30404__$1 = (function (){var statearr_30497 = state_30404;
(statearr_30497[(13)] = inst_30269);

(statearr_30497[(14)] = inst_30270);

(statearr_30497[(15)] = inst_30268);

(statearr_30497[(16)] = inst_30267);

return statearr_30497;
})();
var statearr_30499_32554 = state_30404__$1;
(statearr_30499_32554[(2)] = null);

(statearr_30499_32554[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (14))){
var state_30404__$1 = state_30404;
var statearr_30500_32555 = state_30404__$1;
(statearr_30500_32555[(2)] = null);

(statearr_30500_32555[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (45))){
var inst_30390 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30501_32556 = state_30404__$1;
(statearr_30501_32556[(2)] = inst_30390);

(statearr_30501_32556[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (26))){
var inst_30333 = (state_30404[(27)]);
var inst_30386 = (state_30404[(2)]);
var inst_30387 = cljs.core.seq(inst_30333);
var state_30404__$1 = (function (){var statearr_30502 = state_30404;
(statearr_30502[(29)] = inst_30386);

return statearr_30502;
})();
if(inst_30387){
var statearr_30503_32557 = state_30404__$1;
(statearr_30503_32557[(1)] = (42));

} else {
var statearr_30504_32559 = state_30404__$1;
(statearr_30504_32559[(1)] = (43));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (16))){
var inst_30296 = (state_30404[(7)]);
var inst_30298 = cljs.core.chunked_seq_QMARK_(inst_30296);
var state_30404__$1 = state_30404;
if(inst_30298){
var statearr_30505_32565 = state_30404__$1;
(statearr_30505_32565[(1)] = (19));

} else {
var statearr_30507_32566 = state_30404__$1;
(statearr_30507_32566[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (38))){
var inst_30379 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30509_32571 = state_30404__$1;
(statearr_30509_32571[(2)] = inst_30379);

(statearr_30509_32571[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (30))){
var state_30404__$1 = state_30404;
var statearr_30510_32572 = state_30404__$1;
(statearr_30510_32572[(2)] = null);

(statearr_30510_32572[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (10))){
var inst_30270 = (state_30404[(14)]);
var inst_30268 = (state_30404[(15)]);
var inst_30281 = cljs.core._nth(inst_30268,inst_30270);
var inst_30282 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30281,(0),null);
var inst_30284 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30281,(1),null);
var state_30404__$1 = (function (){var statearr_30511 = state_30404;
(statearr_30511[(24)] = inst_30282);

return statearr_30511;
})();
if(cljs.core.truth_(inst_30284)){
var statearr_30512_32575 = state_30404__$1;
(statearr_30512_32575[(1)] = (13));

} else {
var statearr_30513_32576 = state_30404__$1;
(statearr_30513_32576[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (18))){
var inst_30326 = (state_30404[(2)]);
var state_30404__$1 = state_30404;
var statearr_30514_32583 = state_30404__$1;
(statearr_30514_32583[(2)] = inst_30326);

(statearr_30514_32583[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (42))){
var state_30404__$1 = state_30404;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30404__$1,(45),dchan);
} else {
if((state_val_30408 === (37))){
var inst_30369 = (state_30404[(22)]);
var inst_30254 = (state_30404[(11)]);
var inst_30360 = (state_30404[(23)]);
var inst_30369__$1 = cljs.core.first(inst_30360);
var inst_30370 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30369__$1,inst_30254,done);
var state_30404__$1 = (function (){var statearr_30517 = state_30404;
(statearr_30517[(22)] = inst_30369__$1);

return statearr_30517;
})();
if(cljs.core.truth_(inst_30370)){
var statearr_30518_32595 = state_30404__$1;
(statearr_30518_32595[(1)] = (39));

} else {
var statearr_30519_32599 = state_30404__$1;
(statearr_30519_32599[(1)] = (40));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30408 === (8))){
var inst_30269 = (state_30404[(13)]);
var inst_30270 = (state_30404[(14)]);
var inst_30272 = (inst_30270 < inst_30269);
var inst_30273 = inst_30272;
var state_30404__$1 = state_30404;
if(cljs.core.truth_(inst_30273)){
var statearr_30520_32604 = state_30404__$1;
(statearr_30520_32604[(1)] = (10));

} else {
var statearr_30521_32605 = state_30404__$1;
(statearr_30521_32605[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
});
return (function() {
var cljs$core$async$mult_$_state_machine__28413__auto__ = null;
var cljs$core$async$mult_$_state_machine__28413__auto____0 = (function (){
var statearr_30525 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30525[(0)] = cljs$core$async$mult_$_state_machine__28413__auto__);

(statearr_30525[(1)] = (1));

return statearr_30525;
});
var cljs$core$async$mult_$_state_machine__28413__auto____1 = (function (state_30404){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_30404);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30526){var ex__28416__auto__ = e30526;
var statearr_30527_32613 = state_30404;
(statearr_30527_32613[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_30404[(4)]))){
var statearr_30528_32614 = state_30404;
(statearr_30528_32614[(1)] = cljs.core.first((state_30404[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32615 = state_30404;
state_30404 = G__32615;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__28413__auto__ = function(state_30404){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__28413__auto____1.call(this,state_30404);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__28413__auto____0;
cljs$core$async$mult_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__28413__auto____1;
return cljs$core$async$mult_$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30529 = f__29283__auto__();
(statearr_30529[(6)] = c__29282__auto___32359);

return statearr_30529;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return m;
});
/**
 * Copies the mult source onto the supplied channel.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.tap = (function cljs$core$async$tap(var_args){
var G__30531 = arguments.length;
switch (G__30531) {
case 2:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2 = (function (mult,ch){
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(mult,ch,true);
}));

(cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3 = (function (mult,ch,close_QMARK_){
cljs.core.async.tap_STAR_(mult,ch,close_QMARK_);

return ch;
}));

(cljs.core.async.tap.cljs$lang$maxFixedArity = 3);

/**
 * Disconnects a target channel from a mult
 */
cljs.core.async.untap = (function cljs$core$async$untap(mult,ch){
return cljs.core.async.untap_STAR_(mult,ch);
});
/**
 * Disconnects all target channels from a mult
 */
cljs.core.async.untap_all = (function cljs$core$async$untap_all(mult){
return cljs.core.async.untap_all_STAR_(mult);
});

/**
 * @interface
 */
cljs.core.async.Mix = function(){};

var cljs$core$async$Mix$admix_STAR_$dyn_32628 = (function (m,ch){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.admix_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5394__auto__.call(null, m,ch));
} else {
var m__5392__auto__ = (cljs.core.async.admix_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5392__auto__.call(null, m,ch));
} else {
throw cljs.core.missing_protocol("Mix.admix*",m);
}
}
});
cljs.core.async.admix_STAR_ = (function cljs$core$async$admix_STAR_(m,ch){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mix$admix_STAR_$arity$2 == null)))))){
return m.cljs$core$async$Mix$admix_STAR_$arity$2(m,ch);
} else {
return cljs$core$async$Mix$admix_STAR_$dyn_32628(m,ch);
}
});

var cljs$core$async$Mix$unmix_STAR_$dyn_32630 = (function (m,ch){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.unmix_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5394__auto__.call(null, m,ch));
} else {
var m__5392__auto__ = (cljs.core.async.unmix_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__5392__auto__.call(null, m,ch));
} else {
throw cljs.core.missing_protocol("Mix.unmix*",m);
}
}
});
cljs.core.async.unmix_STAR_ = (function cljs$core$async$unmix_STAR_(m,ch){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mix$unmix_STAR_$arity$2 == null)))))){
return m.cljs$core$async$Mix$unmix_STAR_$arity$2(m,ch);
} else {
return cljs$core$async$Mix$unmix_STAR_$dyn_32630(m,ch);
}
});

var cljs$core$async$Mix$unmix_all_STAR_$dyn_32646 = (function (m){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.unmix_all_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__5394__auto__.call(null, m));
} else {
var m__5392__auto__ = (cljs.core.async.unmix_all_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__5392__auto__.call(null, m));
} else {
throw cljs.core.missing_protocol("Mix.unmix-all*",m);
}
}
});
cljs.core.async.unmix_all_STAR_ = (function cljs$core$async$unmix_all_STAR_(m){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mix$unmix_all_STAR_$arity$1 == null)))))){
return m.cljs$core$async$Mix$unmix_all_STAR_$arity$1(m);
} else {
return cljs$core$async$Mix$unmix_all_STAR_$dyn_32646(m);
}
});

var cljs$core$async$Mix$toggle_STAR_$dyn_32660 = (function (m,state_map){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.toggle_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(m,state_map) : m__5394__auto__.call(null, m,state_map));
} else {
var m__5392__auto__ = (cljs.core.async.toggle_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(m,state_map) : m__5392__auto__.call(null, m,state_map));
} else {
throw cljs.core.missing_protocol("Mix.toggle*",m);
}
}
});
cljs.core.async.toggle_STAR_ = (function cljs$core$async$toggle_STAR_(m,state_map){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mix$toggle_STAR_$arity$2 == null)))))){
return m.cljs$core$async$Mix$toggle_STAR_$arity$2(m,state_map);
} else {
return cljs$core$async$Mix$toggle_STAR_$dyn_32660(m,state_map);
}
});

var cljs$core$async$Mix$solo_mode_STAR_$dyn_32669 = (function (m,mode){
var x__5393__auto__ = (((m == null))?null:m);
var m__5394__auto__ = (cljs.core.async.solo_mode_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(m,mode) : m__5394__auto__.call(null, m,mode));
} else {
var m__5392__auto__ = (cljs.core.async.solo_mode_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(m,mode) : m__5392__auto__.call(null, m,mode));
} else {
throw cljs.core.missing_protocol("Mix.solo-mode*",m);
}
}
});
cljs.core.async.solo_mode_STAR_ = (function cljs$core$async$solo_mode_STAR_(m,mode){
if((((!((m == null)))) && ((!((m.cljs$core$async$Mix$solo_mode_STAR_$arity$2 == null)))))){
return m.cljs$core$async$Mix$solo_mode_STAR_$arity$2(m,mode);
} else {
return cljs$core$async$Mix$solo_mode_STAR_$dyn_32669(m,mode);
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___32681 = arguments.length;
var i__5770__auto___32683 = (0);
while(true){
if((i__5770__auto___32683 < len__5769__auto___32681)){
args__5775__auto__.push((arguments[i__5770__auto___32683]));

var G__32688 = (i__5770__auto___32683 + (1));
i__5770__auto___32683 = G__32688;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((3) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((3)),(0),null)):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__5776__auto__);
});

(cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__30606){
var map__30610 = p__30606;
var map__30610__$1 = cljs.core.__destructure_map(map__30610);
var opts = map__30610__$1;
var statearr_30611_32701 = state;
(statearr_30611_32701[(1)] = cont_block);


var temp__5823__auto__ = cljs.core.async.do_alts((function (val){
var statearr_30617_32702 = state;
(statearr_30617_32702[(2)] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state);
}),ports,opts);
if(cljs.core.truth_(temp__5823__auto__)){
var cb = temp__5823__auto__;
var statearr_30618_32707 = state;
(statearr_30618_32707[(2)] = cljs.core.deref(cb));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}));

(cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3));

/** @this {Function} */
(cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq30593){
var G__30594 = cljs.core.first(seq30593);
var seq30593__$1 = cljs.core.next(seq30593);
var G__30595 = cljs.core.first(seq30593__$1);
var seq30593__$2 = cljs.core.next(seq30593__$1);
var G__30596 = cljs.core.first(seq30593__$2);
var seq30593__$3 = cljs.core.next(seq30593__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__30594,G__30595,G__30596,seq30593__$3);
}));


/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30635 = (function (change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30636){
this.change = change;
this.solo_mode = solo_mode;
this.pick = pick;
this.cs = cs;
this.calc_state = calc_state;
this.out = out;
this.changed = changed;
this.solo_modes = solo_modes;
this.attrs = attrs;
this.meta30636 = meta30636;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30637,meta30636__$1){
var self__ = this;
var _30637__$1 = this;
return (new cljs.core.async.t_cljs$core$async30635(self__.change,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta30636__$1));
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30637){
var self__ = this;
var _30637__$1 = this;
return self__.meta30636;
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.core.merge_with,cljs.core.merge),state_map);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30635.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.solo_modes.cljs$core$IFn$_invoke$arity$1 ? self__.solo_modes.cljs$core$IFn$_invoke$arity$1(mode) : self__.solo_modes.call(null, mode)))){
} else {
throw (new Error(["Assert failed: ",["mode must be one of: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.solo_modes)].join(''),"\n","(solo-modes mode)"].join('')));
}

cljs.core.reset_BANG_(self__.solo_mode,mode);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30635.getBasis = (function (){
return new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"change","change",477485025,null),new cljs.core.Symbol(null,"solo-mode","solo-mode",2031788074,null),new cljs.core.Symbol(null,"pick","pick",1300068175,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"calc-state","calc-state",-349968968,null),new cljs.core.Symbol(null,"out","out",729986010,null),new cljs.core.Symbol(null,"changed","changed",-2083710852,null),new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"attrs","attrs",-450137186,null),new cljs.core.Symbol(null,"meta30636","meta30636",-306322962,null)], null);
}));

(cljs.core.async.t_cljs$core$async30635.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30635.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30635");

(cljs.core.async.t_cljs$core$async30635.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30635");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30635.
 */
cljs.core.async.__GT_t_cljs$core$async30635 = (function cljs$core$async$__GT_t_cljs$core$async30635(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30636){
return (new cljs.core.async.t_cljs$core$async30635(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30636));
});


/**
 * Creates and returns a mix of one or more input channels which will
 *   be put on the supplied out channel. Input sources can be added to
 *   the mix with 'admix', and removed with 'unmix'. A mix supports
 *   soloing, muting and pausing multiple inputs atomically using
 *   'toggle', and can solo using either muting or pausing as determined
 *   by 'solo-mode'.
 * 
 *   Each channel can have zero or more boolean modes set via 'toggle':
 * 
 *   :solo - when true, only this (ond other soloed) channel(s) will appear
 *        in the mix output channel. :mute and :pause states of soloed
 *        channels are ignored. If solo-mode is :mute, non-soloed
 *        channels are muted, if :pause, non-soloed channels are
 *        paused.
 * 
 *   :mute - muted channels will have their contents consumed but not included in the mix
 *   :pause - paused channels will not have their contents consumed (and thus also not included in the mix)
 */
cljs.core.async.mix = (function cljs$core$async$mix(out){
var cs = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var solo_modes = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pause","pause",-2095325672),null,new cljs.core.Keyword(null,"mute","mute",1151223646),null], null), null);
var attrs = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(solo_modes,new cljs.core.Keyword(null,"solo","solo",-316350075));
var solo_mode = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"mute","mute",1151223646));
var change = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(cljs.core.async.sliding_buffer((1)));
var changed = (function (){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(change,true);
});
var pick = (function (attr,chs){
return cljs.core.reduce_kv((function (ret,c,v){
if(cljs.core.truth_((attr.cljs$core$IFn$_invoke$arity$1 ? attr.cljs$core$IFn$_invoke$arity$1(v) : attr.call(null, v)))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,c);
} else {
return ret;
}
}),cljs.core.PersistentHashSet.EMPTY,chs);
});
var calc_state = (function (){
var chs = cljs.core.deref(cs);
var mode = cljs.core.deref(solo_mode);
var solos = pick(new cljs.core.Keyword(null,"solo","solo",-316350075),chs);
var pauses = pick(new cljs.core.Keyword(null,"pause","pause",-2095325672),chs);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"solos","solos",1441458643),solos,new cljs.core.Keyword(null,"mutes","mutes",1068806309),pick(new cljs.core.Keyword(null,"mute","mute",1151223646),chs),new cljs.core.Keyword(null,"reads","reads",-1215067361),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mode,new cljs.core.Keyword(null,"pause","pause",-2095325672))) && ((!(cljs.core.empty_QMARK_(solos))))))?cljs.core.vec(solos):cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(pauses,cljs.core.keys(chs)))),change)], null);
});
var m = (new cljs.core.async.t_cljs$core$async30635(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
var c__29282__auto___32743 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_30719){
var state_val_30720 = (state_30719[(1)]);
if((state_val_30720 === (7))){
var inst_30672 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
if(cljs.core.truth_(inst_30672)){
var statearr_30721_32748 = state_30719__$1;
(statearr_30721_32748[(1)] = (8));

} else {
var statearr_30723_32749 = state_30719__$1;
(statearr_30723_32749[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (20))){
var inst_30665 = (state_30719[(7)]);
var state_30719__$1 = state_30719;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30719__$1,(23),out,inst_30665);
} else {
if((state_val_30720 === (1))){
var inst_30648 = calc_state();
var inst_30649 = cljs.core.__destructure_map(inst_30648);
var inst_30650 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30649,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30651 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30649,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30652 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30649,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var inst_30653 = inst_30648;
var state_30719__$1 = (function (){var statearr_30729 = state_30719;
(statearr_30729[(8)] = inst_30653);

(statearr_30729[(9)] = inst_30651);

(statearr_30729[(10)] = inst_30652);

(statearr_30729[(11)] = inst_30650);

return statearr_30729;
})();
var statearr_30730_32756 = state_30719__$1;
(statearr_30730_32756[(2)] = null);

(statearr_30730_32756[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (24))){
var inst_30656 = (state_30719[(12)]);
var inst_30653 = inst_30656;
var state_30719__$1 = (function (){var statearr_30732 = state_30719;
(statearr_30732[(8)] = inst_30653);

return statearr_30732;
})();
var statearr_30736_32757 = state_30719__$1;
(statearr_30736_32757[(2)] = null);

(statearr_30736_32757[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (4))){
var inst_30667 = (state_30719[(13)]);
var inst_30665 = (state_30719[(7)]);
var inst_30664 = (state_30719[(2)]);
var inst_30665__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30664,(0),null);
var inst_30666 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30664,(1),null);
var inst_30667__$1 = (inst_30665__$1 == null);
var state_30719__$1 = (function (){var statearr_30737 = state_30719;
(statearr_30737[(14)] = inst_30666);

(statearr_30737[(13)] = inst_30667__$1);

(statearr_30737[(7)] = inst_30665__$1);

return statearr_30737;
})();
if(cljs.core.truth_(inst_30667__$1)){
var statearr_30738_32763 = state_30719__$1;
(statearr_30738_32763[(1)] = (5));

} else {
var statearr_30739_32764 = state_30719__$1;
(statearr_30739_32764[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (15))){
var inst_30657 = (state_30719[(15)]);
var inst_30690 = (state_30719[(16)]);
var inst_30690__$1 = cljs.core.empty_QMARK_(inst_30657);
var state_30719__$1 = (function (){var statearr_30740 = state_30719;
(statearr_30740[(16)] = inst_30690__$1);

return statearr_30740;
})();
if(inst_30690__$1){
var statearr_30741_32765 = state_30719__$1;
(statearr_30741_32765[(1)] = (17));

} else {
var statearr_30742_32766 = state_30719__$1;
(statearr_30742_32766[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (21))){
var inst_30656 = (state_30719[(12)]);
var inst_30653 = inst_30656;
var state_30719__$1 = (function (){var statearr_30743 = state_30719;
(statearr_30743[(8)] = inst_30653);

return statearr_30743;
})();
var statearr_30744_32767 = state_30719__$1;
(statearr_30744_32767[(2)] = null);

(statearr_30744_32767[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (13))){
var inst_30683 = (state_30719[(2)]);
var inst_30684 = calc_state();
var inst_30653 = inst_30684;
var state_30719__$1 = (function (){var statearr_30745 = state_30719;
(statearr_30745[(8)] = inst_30653);

(statearr_30745[(17)] = inst_30683);

return statearr_30745;
})();
var statearr_30746_32768 = state_30719__$1;
(statearr_30746_32768[(2)] = null);

(statearr_30746_32768[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (22))){
var inst_30712 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
var statearr_30747_32769 = state_30719__$1;
(statearr_30747_32769[(2)] = inst_30712);

(statearr_30747_32769[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (6))){
var inst_30666 = (state_30719[(14)]);
var inst_30670 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_30666,change);
var state_30719__$1 = state_30719;
var statearr_30748_32770 = state_30719__$1;
(statearr_30748_32770[(2)] = inst_30670);

(statearr_30748_32770[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (25))){
var state_30719__$1 = state_30719;
var statearr_30749_32771 = state_30719__$1;
(statearr_30749_32771[(2)] = null);

(statearr_30749_32771[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (17))){
var inst_30666 = (state_30719[(14)]);
var inst_30658 = (state_30719[(18)]);
var inst_30692 = (inst_30658.cljs$core$IFn$_invoke$arity$1 ? inst_30658.cljs$core$IFn$_invoke$arity$1(inst_30666) : inst_30658.call(null, inst_30666));
var inst_30693 = cljs.core.not(inst_30692);
var state_30719__$1 = state_30719;
var statearr_30750_32772 = state_30719__$1;
(statearr_30750_32772[(2)] = inst_30693);

(statearr_30750_32772[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (3))){
var inst_30716 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30719__$1,inst_30716);
} else {
if((state_val_30720 === (12))){
var state_30719__$1 = state_30719;
var statearr_30753_32773 = state_30719__$1;
(statearr_30753_32773[(2)] = null);

(statearr_30753_32773[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (2))){
var inst_30653 = (state_30719[(8)]);
var inst_30656 = (state_30719[(12)]);
var inst_30656__$1 = cljs.core.__destructure_map(inst_30653);
var inst_30657 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30656__$1,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30658 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30656__$1,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30659 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30656__$1,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var state_30719__$1 = (function (){var statearr_30756 = state_30719;
(statearr_30756[(18)] = inst_30658);

(statearr_30756[(15)] = inst_30657);

(statearr_30756[(12)] = inst_30656__$1);

return statearr_30756;
})();
return cljs.core.async.ioc_alts_BANG_(state_30719__$1,(4),inst_30659);
} else {
if((state_val_30720 === (23))){
var inst_30702 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
if(cljs.core.truth_(inst_30702)){
var statearr_30758_32779 = state_30719__$1;
(statearr_30758_32779[(1)] = (24));

} else {
var statearr_30759_32780 = state_30719__$1;
(statearr_30759_32780[(1)] = (25));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (19))){
var inst_30696 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
var statearr_30760_32781 = state_30719__$1;
(statearr_30760_32781[(2)] = inst_30696);

(statearr_30760_32781[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (11))){
var inst_30666 = (state_30719[(14)]);
var inst_30680 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cs,cljs.core.dissoc,inst_30666);
var state_30719__$1 = state_30719;
var statearr_30763_32783 = state_30719__$1;
(statearr_30763_32783[(2)] = inst_30680);

(statearr_30763_32783[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (9))){
var inst_30687 = (state_30719[(19)]);
var inst_30666 = (state_30719[(14)]);
var inst_30657 = (state_30719[(15)]);
var inst_30687__$1 = (inst_30657.cljs$core$IFn$_invoke$arity$1 ? inst_30657.cljs$core$IFn$_invoke$arity$1(inst_30666) : inst_30657.call(null, inst_30666));
var state_30719__$1 = (function (){var statearr_30765 = state_30719;
(statearr_30765[(19)] = inst_30687__$1);

return statearr_30765;
})();
if(cljs.core.truth_(inst_30687__$1)){
var statearr_30766_32790 = state_30719__$1;
(statearr_30766_32790[(1)] = (14));

} else {
var statearr_30767_32791 = state_30719__$1;
(statearr_30767_32791[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (5))){
var inst_30667 = (state_30719[(13)]);
var state_30719__$1 = state_30719;
var statearr_30768_32793 = state_30719__$1;
(statearr_30768_32793[(2)] = inst_30667);

(statearr_30768_32793[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (14))){
var inst_30687 = (state_30719[(19)]);
var state_30719__$1 = state_30719;
var statearr_30770_32794 = state_30719__$1;
(statearr_30770_32794[(2)] = inst_30687);

(statearr_30770_32794[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (26))){
var inst_30708 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
var statearr_30774_32795 = state_30719__$1;
(statearr_30774_32795[(2)] = inst_30708);

(statearr_30774_32795[(1)] = (22));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (16))){
var inst_30699 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
if(cljs.core.truth_(inst_30699)){
var statearr_30776_32796 = state_30719__$1;
(statearr_30776_32796[(1)] = (20));

} else {
var statearr_30777_32797 = state_30719__$1;
(statearr_30777_32797[(1)] = (21));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (10))){
var inst_30714 = (state_30719[(2)]);
var state_30719__$1 = state_30719;
var statearr_30781_32799 = state_30719__$1;
(statearr_30781_32799[(2)] = inst_30714);

(statearr_30781_32799[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (18))){
var inst_30690 = (state_30719[(16)]);
var state_30719__$1 = state_30719;
var statearr_30782_32800 = state_30719__$1;
(statearr_30782_32800[(2)] = inst_30690);

(statearr_30782_32800[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30720 === (8))){
var inst_30665 = (state_30719[(7)]);
var inst_30674 = (inst_30665 == null);
var state_30719__$1 = state_30719;
if(cljs.core.truth_(inst_30674)){
var statearr_30783_32802 = state_30719__$1;
(statearr_30783_32802[(1)] = (11));

} else {
var statearr_30784_32803 = state_30719__$1;
(statearr_30784_32803[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
}
});
return (function() {
var cljs$core$async$mix_$_state_machine__28413__auto__ = null;
var cljs$core$async$mix_$_state_machine__28413__auto____0 = (function (){
var statearr_30785 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30785[(0)] = cljs$core$async$mix_$_state_machine__28413__auto__);

(statearr_30785[(1)] = (1));

return statearr_30785;
});
var cljs$core$async$mix_$_state_machine__28413__auto____1 = (function (state_30719){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_30719);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30786){var ex__28416__auto__ = e30786;
var statearr_30787_32809 = state_30719;
(statearr_30787_32809[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_30719[(4)]))){
var statearr_30788_32810 = state_30719;
(statearr_30788_32810[(1)] = cljs.core.first((state_30719[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32811 = state_30719;
state_30719 = G__32811;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__28413__auto__ = function(state_30719){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__28413__auto____1.call(this,state_30719);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__28413__auto____0;
cljs$core$async$mix_$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__28413__auto____1;
return cljs$core$async$mix_$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30789 = f__29283__auto__();
(statearr_30789[(6)] = c__29282__auto___32743);

return statearr_30789;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return m;
});
/**
 * Adds ch as an input to the mix
 */
cljs.core.async.admix = (function cljs$core$async$admix(mix,ch){
return cljs.core.async.admix_STAR_(mix,ch);
});
/**
 * Removes ch as an input to the mix
 */
cljs.core.async.unmix = (function cljs$core$async$unmix(mix,ch){
return cljs.core.async.unmix_STAR_(mix,ch);
});
/**
 * removes all inputs from the mix
 */
cljs.core.async.unmix_all = (function cljs$core$async$unmix_all(mix){
return cljs.core.async.unmix_all_STAR_(mix);
});
/**
 * Atomically sets the state(s) of one or more channels in a mix. The
 *   state map is a map of channels -> channel-state-map. A
 *   channel-state-map is a map of attrs -> boolean, where attr is one or
 *   more of :mute, :pause or :solo. Any states supplied are merged with
 *   the current state.
 * 
 *   Note that channels can be added to a mix via toggle, which can be
 *   used to add channels in a particular (e.g. paused) state.
 */
cljs.core.async.toggle = (function cljs$core$async$toggle(mix,state_map){
return cljs.core.async.toggle_STAR_(mix,state_map);
});
/**
 * Sets the solo mode of the mix. mode must be one of :mute or :pause
 */
cljs.core.async.solo_mode = (function cljs$core$async$solo_mode(mix,mode){
return cljs.core.async.solo_mode_STAR_(mix,mode);
});

/**
 * @interface
 */
cljs.core.async.Pub = function(){};

var cljs$core$async$Pub$sub_STAR_$dyn_32818 = (function (p,v,ch,close_QMARK_){
var x__5393__auto__ = (((p == null))?null:p);
var m__5394__auto__ = (cljs.core.async.sub_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$4(p,v,ch,close_QMARK_) : m__5394__auto__.call(null, p,v,ch,close_QMARK_));
} else {
var m__5392__auto__ = (cljs.core.async.sub_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$4(p,v,ch,close_QMARK_) : m__5392__auto__.call(null, p,v,ch,close_QMARK_));
} else {
throw cljs.core.missing_protocol("Pub.sub*",p);
}
}
});
cljs.core.async.sub_STAR_ = (function cljs$core$async$sub_STAR_(p,v,ch,close_QMARK_){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$sub_STAR_$arity$4 == null)))))){
return p.cljs$core$async$Pub$sub_STAR_$arity$4(p,v,ch,close_QMARK_);
} else {
return cljs$core$async$Pub$sub_STAR_$dyn_32818(p,v,ch,close_QMARK_);
}
});

var cljs$core$async$Pub$unsub_STAR_$dyn_32819 = (function (p,v,ch){
var x__5393__auto__ = (((p == null))?null:p);
var m__5394__auto__ = (cljs.core.async.unsub_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$3(p,v,ch) : m__5394__auto__.call(null, p,v,ch));
} else {
var m__5392__auto__ = (cljs.core.async.unsub_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$3(p,v,ch) : m__5392__auto__.call(null, p,v,ch));
} else {
throw cljs.core.missing_protocol("Pub.unsub*",p);
}
}
});
cljs.core.async.unsub_STAR_ = (function cljs$core$async$unsub_STAR_(p,v,ch){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$unsub_STAR_$arity$3 == null)))))){
return p.cljs$core$async$Pub$unsub_STAR_$arity$3(p,v,ch);
} else {
return cljs$core$async$Pub$unsub_STAR_$dyn_32819(p,v,ch);
}
});

var cljs$core$async$Pub$unsub_all_STAR_$dyn_32820 = (function() {
var G__32821 = null;
var G__32821__1 = (function (p){
var x__5393__auto__ = (((p == null))?null:p);
var m__5394__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(p) : m__5394__auto__.call(null, p));
} else {
var m__5392__auto__ = (cljs.core.async.unsub_all_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(p) : m__5392__auto__.call(null, p));
} else {
throw cljs.core.missing_protocol("Pub.unsub-all*",p);
}
}
});
var G__32821__2 = (function (p,v){
var x__5393__auto__ = (((p == null))?null:p);
var m__5394__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$2(p,v) : m__5394__auto__.call(null, p,v));
} else {
var m__5392__auto__ = (cljs.core.async.unsub_all_STAR_["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$2(p,v) : m__5392__auto__.call(null, p,v));
} else {
throw cljs.core.missing_protocol("Pub.unsub-all*",p);
}
}
});
G__32821 = function(p,v){
switch(arguments.length){
case 1:
return G__32821__1.call(this,p);
case 2:
return G__32821__2.call(this,p,v);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__32821.cljs$core$IFn$_invoke$arity$1 = G__32821__1;
G__32821.cljs$core$IFn$_invoke$arity$2 = G__32821__2;
return G__32821;
})()
;
cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var G__30812 = arguments.length;
switch (G__30812) {
case 1:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1 = (function (p){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$1 == null)))))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$1(p);
} else {
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32820(p);
}
}));

(cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (p,v){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$2 == null)))))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$2(p,v);
} else {
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32820(p,v);
}
}));

(cljs.core.async.unsub_all_STAR_.cljs$lang$maxFixedArity = 2);



/**
* @constructor
 * @implements {cljs.core.async.Pub}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30824 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta30825){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta30825 = meta30825;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30826,meta30825__$1){
var self__ = this;
var _30826__$1 = this;
return (new cljs.core.async.t_cljs$core$async30824(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta30825__$1));
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30826){
var self__ = this;
var _30826__$1 = this;
return self__.meta30825;
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Pub$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = (self__.ensure_mult.cljs$core$IFn$_invoke$arity$1 ? self__.ensure_mult.cljs$core$IFn$_invoke$arity$1(topic) : self__.ensure_mult.call(null, topic));
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(m,ch__$1,close_QMARK_);
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = (function (p,topic,ch__$1){
var self__ = this;
var p__$1 = this;
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(self__.mults),topic);
if(cljs.core.truth_(temp__5823__auto__)){
var m = temp__5823__auto__;
return cljs.core.async.untap(m,ch__$1);
} else {
return null;
}
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reset_BANG_(self__.mults,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs.core.async.t_cljs$core$async30824.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.mults,cljs.core.dissoc,topic);
}));

(cljs.core.async.t_cljs$core$async30824.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"topic-fn","topic-fn",-862449736,null),new cljs.core.Symbol(null,"buf-fn","buf-fn",-1200281591,null),new cljs.core.Symbol(null,"mults","mults",-461114485,null),new cljs.core.Symbol(null,"ensure-mult","ensure-mult",1796584816,null),new cljs.core.Symbol(null,"meta30825","meta30825",-434612067,null)], null);
}));

(cljs.core.async.t_cljs$core$async30824.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30824.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30824");

(cljs.core.async.t_cljs$core$async30824.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30824");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30824.
 */
cljs.core.async.__GT_t_cljs$core$async30824 = (function cljs$core$async$__GT_t_cljs$core$async30824(ch,topic_fn,buf_fn,mults,ensure_mult,meta30825){
return (new cljs.core.async.t_cljs$core$async30824(ch,topic_fn,buf_fn,mults,ensure_mult,meta30825));
});


/**
 * Creates and returns a pub(lication) of the supplied channel,
 *   partitioned into topics by the topic-fn. topic-fn will be applied to
 *   each value on the channel and the result will determine the 'topic'
 *   on which that value will be put. Channels can be subscribed to
 *   receive copies of topics using 'sub', and unsubscribed using
 *   'unsub'. Each topic will be handled by an internal mult on a
 *   dedicated channel. By default these internal channels are
 *   unbuffered, but a buf-fn can be supplied which, given a topic,
 *   creates a buffer with desired properties.
 * 
 *   Each item is distributed to all subs in parallel and synchronously,
 *   i.e. each sub must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow subs from holding up the pub.
 * 
 *   Items received when there are no matching subs get dropped.
 * 
 *   Note that if buf-fns are used then each topic is handled
 *   asynchronously, i.e. if a channel is subscribed to more than one
 *   topic it should not expect them to be interleaved identically with
 *   the source.
 */
cljs.core.async.pub = (function cljs$core$async$pub(var_args){
var G__30823 = arguments.length;
switch (G__30823) {
case 2:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2 = (function (ch,topic_fn){
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3(ch,topic_fn,cljs.core.constantly(null));
}));

(cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3 = (function (ch,topic_fn,buf_fn){
var mults = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var ensure_mult = (function (topic){
var or__5045__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(mults),topic);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(mults,(function (p1__30821_SHARP_){
if(cljs.core.truth_((p1__30821_SHARP_.cljs$core$IFn$_invoke$arity$1 ? p1__30821_SHARP_.cljs$core$IFn$_invoke$arity$1(topic) : p1__30821_SHARP_.call(null, topic)))){
return p1__30821_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__30821_SHARP_,topic,cljs.core.async.mult(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((buf_fn.cljs$core$IFn$_invoke$arity$1 ? buf_fn.cljs$core$IFn$_invoke$arity$1(topic) : buf_fn.call(null, topic)))));
}
})),topic);
}
});
var p = (new cljs.core.async.t_cljs$core$async30824(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
var c__29282__auto___32856 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_30902){
var state_val_30903 = (state_30902[(1)]);
if((state_val_30903 === (7))){
var inst_30898 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30905_32860 = state_30902__$1;
(statearr_30905_32860[(2)] = inst_30898);

(statearr_30905_32860[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (20))){
var state_30902__$1 = state_30902;
var statearr_30906_32861 = state_30902__$1;
(statearr_30906_32861[(2)] = null);

(statearr_30906_32861[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (1))){
var state_30902__$1 = state_30902;
var statearr_30907_32862 = state_30902__$1;
(statearr_30907_32862[(2)] = null);

(statearr_30907_32862[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (24))){
var inst_30881 = (state_30902[(7)]);
var inst_30890 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(mults,cljs.core.dissoc,inst_30881);
var state_30902__$1 = state_30902;
var statearr_30908_32864 = state_30902__$1;
(statearr_30908_32864[(2)] = inst_30890);

(statearr_30908_32864[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (4))){
var inst_30833 = (state_30902[(8)]);
var inst_30833__$1 = (state_30902[(2)]);
var inst_30834 = (inst_30833__$1 == null);
var state_30902__$1 = (function (){var statearr_30910 = state_30902;
(statearr_30910[(8)] = inst_30833__$1);

return statearr_30910;
})();
if(cljs.core.truth_(inst_30834)){
var statearr_30911_32868 = state_30902__$1;
(statearr_30911_32868[(1)] = (5));

} else {
var statearr_30918_32869 = state_30902__$1;
(statearr_30918_32869[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (15))){
var inst_30875 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30919_32870 = state_30902__$1;
(statearr_30919_32870[(2)] = inst_30875);

(statearr_30919_32870[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (21))){
var inst_30895 = (state_30902[(2)]);
var state_30902__$1 = (function (){var statearr_30924 = state_30902;
(statearr_30924[(9)] = inst_30895);

return statearr_30924;
})();
var statearr_30925_32871 = state_30902__$1;
(statearr_30925_32871[(2)] = null);

(statearr_30925_32871[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (13))){
var inst_30857 = (state_30902[(10)]);
var inst_30859 = cljs.core.chunked_seq_QMARK_(inst_30857);
var state_30902__$1 = state_30902;
if(inst_30859){
var statearr_30926_32872 = state_30902__$1;
(statearr_30926_32872[(1)] = (16));

} else {
var statearr_30927_32876 = state_30902__$1;
(statearr_30927_32876[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (22))){
var inst_30887 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
if(cljs.core.truth_(inst_30887)){
var statearr_30928_32877 = state_30902__$1;
(statearr_30928_32877[(1)] = (23));

} else {
var statearr_30932_32878 = state_30902__$1;
(statearr_30932_32878[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (6))){
var inst_30833 = (state_30902[(8)]);
var inst_30883 = (state_30902[(11)]);
var inst_30881 = (state_30902[(7)]);
var inst_30881__$1 = (topic_fn.cljs$core$IFn$_invoke$arity$1 ? topic_fn.cljs$core$IFn$_invoke$arity$1(inst_30833) : topic_fn.call(null, inst_30833));
var inst_30882 = cljs.core.deref(mults);
var inst_30883__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30882,inst_30881__$1);
var state_30902__$1 = (function (){var statearr_30933 = state_30902;
(statearr_30933[(11)] = inst_30883__$1);

(statearr_30933[(7)] = inst_30881__$1);

return statearr_30933;
})();
if(cljs.core.truth_(inst_30883__$1)){
var statearr_30934_32880 = state_30902__$1;
(statearr_30934_32880[(1)] = (19));

} else {
var statearr_30935_32881 = state_30902__$1;
(statearr_30935_32881[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (25))){
var inst_30892 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30939_32882 = state_30902__$1;
(statearr_30939_32882[(2)] = inst_30892);

(statearr_30939_32882[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (17))){
var inst_30857 = (state_30902[(10)]);
var inst_30866 = cljs.core.first(inst_30857);
var inst_30867 = cljs.core.async.muxch_STAR_(inst_30866);
var inst_30868 = cljs.core.async.close_BANG_(inst_30867);
var inst_30869 = cljs.core.next(inst_30857);
var inst_30843 = inst_30869;
var inst_30844 = null;
var inst_30845 = (0);
var inst_30846 = (0);
var state_30902__$1 = (function (){var statearr_30940 = state_30902;
(statearr_30940[(12)] = inst_30846);

(statearr_30940[(13)] = inst_30844);

(statearr_30940[(14)] = inst_30868);

(statearr_30940[(15)] = inst_30843);

(statearr_30940[(16)] = inst_30845);

return statearr_30940;
})();
var statearr_30941_32893 = state_30902__$1;
(statearr_30941_32893[(2)] = null);

(statearr_30941_32893[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (3))){
var inst_30900 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30902__$1,inst_30900);
} else {
if((state_val_30903 === (12))){
var inst_30877 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30942_32896 = state_30902__$1;
(statearr_30942_32896[(2)] = inst_30877);

(statearr_30942_32896[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (2))){
var state_30902__$1 = state_30902;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30902__$1,(4),ch);
} else {
if((state_val_30903 === (23))){
var state_30902__$1 = state_30902;
var statearr_30946_32897 = state_30902__$1;
(statearr_30946_32897[(2)] = null);

(statearr_30946_32897[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (19))){
var inst_30833 = (state_30902[(8)]);
var inst_30883 = (state_30902[(11)]);
var inst_30885 = cljs.core.async.muxch_STAR_(inst_30883);
var state_30902__$1 = state_30902;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30902__$1,(22),inst_30885,inst_30833);
} else {
if((state_val_30903 === (11))){
var inst_30857 = (state_30902[(10)]);
var inst_30843 = (state_30902[(15)]);
var inst_30857__$1 = cljs.core.seq(inst_30843);
var state_30902__$1 = (function (){var statearr_30951 = state_30902;
(statearr_30951[(10)] = inst_30857__$1);

return statearr_30951;
})();
if(inst_30857__$1){
var statearr_30952_32905 = state_30902__$1;
(statearr_30952_32905[(1)] = (13));

} else {
var statearr_30953_32907 = state_30902__$1;
(statearr_30953_32907[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (9))){
var inst_30879 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30954_32908 = state_30902__$1;
(statearr_30954_32908[(2)] = inst_30879);

(statearr_30954_32908[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (5))){
var inst_30840 = cljs.core.deref(mults);
var inst_30841 = cljs.core.vals(inst_30840);
var inst_30842 = cljs.core.seq(inst_30841);
var inst_30843 = inst_30842;
var inst_30844 = null;
var inst_30845 = (0);
var inst_30846 = (0);
var state_30902__$1 = (function (){var statearr_30955 = state_30902;
(statearr_30955[(12)] = inst_30846);

(statearr_30955[(13)] = inst_30844);

(statearr_30955[(15)] = inst_30843);

(statearr_30955[(16)] = inst_30845);

return statearr_30955;
})();
var statearr_30957_32912 = state_30902__$1;
(statearr_30957_32912[(2)] = null);

(statearr_30957_32912[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (14))){
var state_30902__$1 = state_30902;
var statearr_30961_32913 = state_30902__$1;
(statearr_30961_32913[(2)] = null);

(statearr_30961_32913[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (16))){
var inst_30857 = (state_30902[(10)]);
var inst_30861 = cljs.core.chunk_first(inst_30857);
var inst_30862 = cljs.core.chunk_rest(inst_30857);
var inst_30863 = cljs.core.count(inst_30861);
var inst_30843 = inst_30862;
var inst_30844 = inst_30861;
var inst_30845 = inst_30863;
var inst_30846 = (0);
var state_30902__$1 = (function (){var statearr_30962 = state_30902;
(statearr_30962[(12)] = inst_30846);

(statearr_30962[(13)] = inst_30844);

(statearr_30962[(15)] = inst_30843);

(statearr_30962[(16)] = inst_30845);

return statearr_30962;
})();
var statearr_30963_32914 = state_30902__$1;
(statearr_30963_32914[(2)] = null);

(statearr_30963_32914[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (10))){
var inst_30846 = (state_30902[(12)]);
var inst_30844 = (state_30902[(13)]);
var inst_30843 = (state_30902[(15)]);
var inst_30845 = (state_30902[(16)]);
var inst_30851 = cljs.core._nth(inst_30844,inst_30846);
var inst_30852 = cljs.core.async.muxch_STAR_(inst_30851);
var inst_30853 = cljs.core.async.close_BANG_(inst_30852);
var inst_30854 = (inst_30846 + (1));
var tmp30958 = inst_30844;
var tmp30959 = inst_30843;
var tmp30960 = inst_30845;
var inst_30843__$1 = tmp30959;
var inst_30844__$1 = tmp30958;
var inst_30845__$1 = tmp30960;
var inst_30846__$1 = inst_30854;
var state_30902__$1 = (function (){var statearr_30965 = state_30902;
(statearr_30965[(12)] = inst_30846__$1);

(statearr_30965[(13)] = inst_30844__$1);

(statearr_30965[(15)] = inst_30843__$1);

(statearr_30965[(16)] = inst_30845__$1);

(statearr_30965[(17)] = inst_30853);

return statearr_30965;
})();
var statearr_30966_32915 = state_30902__$1;
(statearr_30966_32915[(2)] = null);

(statearr_30966_32915[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (18))){
var inst_30872 = (state_30902[(2)]);
var state_30902__$1 = state_30902;
var statearr_30967_32916 = state_30902__$1;
(statearr_30967_32916[(2)] = inst_30872);

(statearr_30967_32916[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30903 === (8))){
var inst_30846 = (state_30902[(12)]);
var inst_30845 = (state_30902[(16)]);
var inst_30848 = (inst_30846 < inst_30845);
var inst_30849 = inst_30848;
var state_30902__$1 = state_30902;
if(cljs.core.truth_(inst_30849)){
var statearr_30968_32918 = state_30902__$1;
(statearr_30968_32918[(1)] = (10));

} else {
var statearr_30969_32919 = state_30902__$1;
(statearr_30969_32919[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_30970 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30970[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_30970[(1)] = (1));

return statearr_30970;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_30902){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_30902);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e30971){var ex__28416__auto__ = e30971;
var statearr_30972_32924 = state_30902;
(statearr_30972_32924[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_30902[(4)]))){
var statearr_30973_32925 = state_30902;
(statearr_30973_32925[(1)] = cljs.core.first((state_30902[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32928 = state_30902;
state_30902 = G__32928;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_30902){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_30902);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_30983 = f__29283__auto__();
(statearr_30983[(6)] = c__29282__auto___32856);

return statearr_30983;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return p;
}));

(cljs.core.async.pub.cljs$lang$maxFixedArity = 3);

/**
 * Subscribes a channel to a topic of a pub.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.sub = (function cljs$core$async$sub(var_args){
var G__31000 = arguments.length;
switch (G__31000) {
case 3:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3 = (function (p,topic,ch){
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4(p,topic,ch,true);
}));

(cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4 = (function (p,topic,ch,close_QMARK_){
return cljs.core.async.sub_STAR_(p,topic,ch,close_QMARK_);
}));

(cljs.core.async.sub.cljs$lang$maxFixedArity = 4);

/**
 * Unsubscribes a channel from a topic of a pub
 */
cljs.core.async.unsub = (function cljs$core$async$unsub(p,topic,ch){
return cljs.core.async.unsub_STAR_(p,topic,ch);
});
/**
 * Unsubscribes all channels from a pub, or a topic of a pub
 */
cljs.core.async.unsub_all = (function cljs$core$async$unsub_all(var_args){
var G__31022 = arguments.length;
switch (G__31022) {
case 1:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1 = (function (p){
return cljs.core.async.unsub_all_STAR_(p);
}));

(cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2 = (function (p,topic){
return cljs.core.async.unsub_all_STAR_(p,topic);
}));

(cljs.core.async.unsub_all.cljs$lang$maxFixedArity = 2);

/**
 * Takes a function and a collection of source channels, and returns a
 *   channel which contains the values produced by applying f to the set
 *   of first items taken from each source channel, followed by applying
 *   f to the set of second items from each channel, until any one of the
 *   channels is closed, at which point the output channel will be
 *   closed. The returned channel will be unbuffered by default, or a
 *   buf-or-n can be supplied
 */
cljs.core.async.map = (function cljs$core$async$map(var_args){
var G__31027 = arguments.length;
switch (G__31027) {
case 2:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.map.cljs$core$IFn$_invoke$arity$2 = (function (f,chs){
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3(f,chs,null);
}));

(cljs.core.async.map.cljs$core$IFn$_invoke$arity$3 = (function (f,chs,buf_or_n){
var chs__$1 = cljs.core.vec(chs);
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var cnt = cljs.core.count(chs__$1);
var rets = cljs.core.object_array.cljs$core$IFn$_invoke$arity$1(cnt);
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var done = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (i){
return (function (ret){
(rets[i] = ret);

if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,rets.slice((0)));
} else {
return null;
}
});
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(cnt));
if((cnt === (0))){
cljs.core.async.close_BANG_(out);
} else {
var c__29282__auto___32933 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31073){
var state_val_31074 = (state_31073[(1)]);
if((state_val_31074 === (7))){
var state_31073__$1 = state_31073;
var statearr_31075_32935 = state_31073__$1;
(statearr_31075_32935[(2)] = null);

(statearr_31075_32935[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (1))){
var state_31073__$1 = state_31073;
var statearr_31076_32946 = state_31073__$1;
(statearr_31076_32946[(2)] = null);

(statearr_31076_32946[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (4))){
var inst_31033 = (state_31073[(7)]);
var inst_31034 = (state_31073[(8)]);
var inst_31036 = (inst_31034 < inst_31033);
var state_31073__$1 = state_31073;
if(cljs.core.truth_(inst_31036)){
var statearr_31077_32947 = state_31073__$1;
(statearr_31077_32947[(1)] = (6));

} else {
var statearr_31078_32948 = state_31073__$1;
(statearr_31078_32948[(1)] = (7));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (15))){
var inst_31059 = (state_31073[(9)]);
var inst_31064 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,inst_31059);
var state_31073__$1 = state_31073;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31073__$1,(17),out,inst_31064);
} else {
if((state_val_31074 === (13))){
var inst_31059 = (state_31073[(9)]);
var inst_31059__$1 = (state_31073[(2)]);
var inst_31060 = cljs.core.some(cljs.core.nil_QMARK_,inst_31059__$1);
var state_31073__$1 = (function (){var statearr_31079 = state_31073;
(statearr_31079[(9)] = inst_31059__$1);

return statearr_31079;
})();
if(cljs.core.truth_(inst_31060)){
var statearr_31080_32953 = state_31073__$1;
(statearr_31080_32953[(1)] = (14));

} else {
var statearr_31081_32954 = state_31073__$1;
(statearr_31081_32954[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (6))){
var state_31073__$1 = state_31073;
var statearr_31082_32955 = state_31073__$1;
(statearr_31082_32955[(2)] = null);

(statearr_31082_32955[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (17))){
var inst_31066 = (state_31073[(2)]);
var state_31073__$1 = (function (){var statearr_31084 = state_31073;
(statearr_31084[(10)] = inst_31066);

return statearr_31084;
})();
var statearr_31085_32957 = state_31073__$1;
(statearr_31085_32957[(2)] = null);

(statearr_31085_32957[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (3))){
var inst_31071 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31073__$1,inst_31071);
} else {
if((state_val_31074 === (12))){
var _ = (function (){var statearr_31086 = state_31073;
(statearr_31086[(4)] = cljs.core.rest((state_31073[(4)])));

return statearr_31086;
})();
var state_31073__$1 = state_31073;
var ex31083 = (state_31073__$1[(2)]);
var statearr_31087_32961 = state_31073__$1;
(statearr_31087_32961[(5)] = ex31083);


if((ex31083 instanceof Object)){
var statearr_31088_32962 = state_31073__$1;
(statearr_31088_32962[(1)] = (11));

(statearr_31088_32962[(5)] = null);

} else {
throw ex31083;

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (2))){
var inst_31032 = cljs.core.reset_BANG_(dctr,cnt);
var inst_31033 = cnt;
var inst_31034 = (0);
var state_31073__$1 = (function (){var statearr_31092 = state_31073;
(statearr_31092[(7)] = inst_31033);

(statearr_31092[(8)] = inst_31034);

(statearr_31092[(11)] = inst_31032);

return statearr_31092;
})();
var statearr_31093_32968 = state_31073__$1;
(statearr_31093_32968[(2)] = null);

(statearr_31093_32968[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (11))){
var inst_31038 = (state_31073[(2)]);
var inst_31039 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec);
var state_31073__$1 = (function (){var statearr_31094 = state_31073;
(statearr_31094[(12)] = inst_31038);

return statearr_31094;
})();
var statearr_31095_32969 = state_31073__$1;
(statearr_31095_32969[(2)] = inst_31039);

(statearr_31095_32969[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (9))){
var inst_31034 = (state_31073[(8)]);
var _ = (function (){var statearr_31096 = state_31073;
(statearr_31096[(4)] = cljs.core.cons((12),(state_31073[(4)])));

return statearr_31096;
})();
var inst_31045 = (chs__$1.cljs$core$IFn$_invoke$arity$1 ? chs__$1.cljs$core$IFn$_invoke$arity$1(inst_31034) : chs__$1.call(null, inst_31034));
var inst_31046 = (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(inst_31034) : done.call(null, inst_31034));
var inst_31047 = cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2(inst_31045,inst_31046);
var ___$1 = (function (){var statearr_31097 = state_31073;
(statearr_31097[(4)] = cljs.core.rest((state_31073[(4)])));

return statearr_31097;
})();
var state_31073__$1 = state_31073;
var statearr_31098_32970 = state_31073__$1;
(statearr_31098_32970[(2)] = inst_31047);

(statearr_31098_32970[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (5))){
var inst_31057 = (state_31073[(2)]);
var state_31073__$1 = (function (){var statearr_31101 = state_31073;
(statearr_31101[(13)] = inst_31057);

return statearr_31101;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31073__$1,(13),dchan);
} else {
if((state_val_31074 === (14))){
var inst_31062 = cljs.core.async.close_BANG_(out);
var state_31073__$1 = state_31073;
var statearr_31108_32976 = state_31073__$1;
(statearr_31108_32976[(2)] = inst_31062);

(statearr_31108_32976[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (16))){
var inst_31069 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
var statearr_31109_32978 = state_31073__$1;
(statearr_31109_32978[(2)] = inst_31069);

(statearr_31109_32978[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (10))){
var inst_31034 = (state_31073[(8)]);
var inst_31050 = (state_31073[(2)]);
var inst_31051 = (inst_31034 + (1));
var inst_31034__$1 = inst_31051;
var state_31073__$1 = (function (){var statearr_31113 = state_31073;
(statearr_31113[(14)] = inst_31050);

(statearr_31113[(8)] = inst_31034__$1);

return statearr_31113;
})();
var statearr_31114_32986 = state_31073__$1;
(statearr_31114_32986[(2)] = null);

(statearr_31114_32986[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (8))){
var inst_31055 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
var statearr_31115_32987 = state_31073__$1;
(statearr_31115_32987[(2)] = inst_31055);

(statearr_31115_32987[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31116 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31116[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31116[(1)] = (1));

return statearr_31116;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31073){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31073);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31117){var ex__28416__auto__ = e31117;
var statearr_31118_32989 = state_31073;
(statearr_31118_32989[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31073[(4)]))){
var statearr_31119_32990 = state_31073;
(statearr_31119_32990[(1)] = cljs.core.first((state_31073[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32991 = state_31073;
state_31073 = G__32991;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31073){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31073);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31120 = f__29283__auto__();
(statearr_31120[(6)] = c__29282__auto___32933);

return statearr_31120;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

}

return out;
}));

(cljs.core.async.map.cljs$lang$maxFixedArity = 3);

/**
 * Takes a collection of source channels and returns a channel which
 *   contains all values taken from them. The returned channel will be
 *   unbuffered by default, or a buf-or-n can be supplied. The channel
 *   will close after all the source channels have closed.
 */
cljs.core.async.merge = (function cljs$core$async$merge(var_args){
var G__31123 = arguments.length;
switch (G__31123) {
case 1:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1 = (function (chs){
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2(chs,null);
}));

(cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2 = (function (chs,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___32995 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31158){
var state_val_31159 = (state_31158[(1)]);
if((state_val_31159 === (7))){
var inst_31137 = (state_31158[(7)]);
var inst_31138 = (state_31158[(8)]);
var inst_31137__$1 = (state_31158[(2)]);
var inst_31138__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31137__$1,(0),null);
var inst_31139 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31137__$1,(1),null);
var inst_31140 = (inst_31138__$1 == null);
var state_31158__$1 = (function (){var statearr_31160 = state_31158;
(statearr_31160[(9)] = inst_31139);

(statearr_31160[(7)] = inst_31137__$1);

(statearr_31160[(8)] = inst_31138__$1);

return statearr_31160;
})();
if(cljs.core.truth_(inst_31140)){
var statearr_31162_33003 = state_31158__$1;
(statearr_31162_33003[(1)] = (8));

} else {
var statearr_31163_33007 = state_31158__$1;
(statearr_31163_33007[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (1))){
var inst_31124 = cljs.core.vec(chs);
var inst_31125 = inst_31124;
var state_31158__$1 = (function (){var statearr_31165 = state_31158;
(statearr_31165[(10)] = inst_31125);

return statearr_31165;
})();
var statearr_31166_33008 = state_31158__$1;
(statearr_31166_33008[(2)] = null);

(statearr_31166_33008[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (4))){
var inst_31125 = (state_31158[(10)]);
var state_31158__$1 = state_31158;
return cljs.core.async.ioc_alts_BANG_(state_31158__$1,(7),inst_31125);
} else {
if((state_val_31159 === (6))){
var inst_31154 = (state_31158[(2)]);
var state_31158__$1 = state_31158;
var statearr_31167_33009 = state_31158__$1;
(statearr_31167_33009[(2)] = inst_31154);

(statearr_31167_33009[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (3))){
var inst_31156 = (state_31158[(2)]);
var state_31158__$1 = state_31158;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31158__$1,inst_31156);
} else {
if((state_val_31159 === (2))){
var inst_31125 = (state_31158[(10)]);
var inst_31130 = cljs.core.count(inst_31125);
var inst_31131 = (inst_31130 > (0));
var state_31158__$1 = state_31158;
if(cljs.core.truth_(inst_31131)){
var statearr_31171_33014 = state_31158__$1;
(statearr_31171_33014[(1)] = (4));

} else {
var statearr_31173_33015 = state_31158__$1;
(statearr_31173_33015[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (11))){
var inst_31125 = (state_31158[(10)]);
var inst_31147 = (state_31158[(2)]);
var tmp31169 = inst_31125;
var inst_31125__$1 = tmp31169;
var state_31158__$1 = (function (){var statearr_31178 = state_31158;
(statearr_31178[(11)] = inst_31147);

(statearr_31178[(10)] = inst_31125__$1);

return statearr_31178;
})();
var statearr_31179_33016 = state_31158__$1;
(statearr_31179_33016[(2)] = null);

(statearr_31179_33016[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (9))){
var inst_31138 = (state_31158[(8)]);
var state_31158__$1 = state_31158;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31158__$1,(11),out,inst_31138);
} else {
if((state_val_31159 === (5))){
var inst_31152 = cljs.core.async.close_BANG_(out);
var state_31158__$1 = state_31158;
var statearr_31182_33017 = state_31158__$1;
(statearr_31182_33017[(2)] = inst_31152);

(statearr_31182_33017[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (10))){
var inst_31150 = (state_31158[(2)]);
var state_31158__$1 = state_31158;
var statearr_31183_33018 = state_31158__$1;
(statearr_31183_33018[(2)] = inst_31150);

(statearr_31183_33018[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31159 === (8))){
var inst_31139 = (state_31158[(9)]);
var inst_31137 = (state_31158[(7)]);
var inst_31125 = (state_31158[(10)]);
var inst_31138 = (state_31158[(8)]);
var inst_31142 = (function (){var cs = inst_31125;
var vec__31133 = inst_31137;
var v = inst_31138;
var c = inst_31139;
return (function (p1__31121_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,p1__31121_SHARP_);
});
})();
var inst_31143 = cljs.core.filterv(inst_31142,inst_31125);
var inst_31125__$1 = inst_31143;
var state_31158__$1 = (function (){var statearr_31184 = state_31158;
(statearr_31184[(10)] = inst_31125__$1);

return statearr_31184;
})();
var statearr_31185_33023 = state_31158__$1;
(statearr_31185_33023[(2)] = null);

(statearr_31185_33023[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31186 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31186[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31186[(1)] = (1));

return statearr_31186;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31158){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31158);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31187){var ex__28416__auto__ = e31187;
var statearr_31188_33029 = state_31158;
(statearr_31188_33029[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31158[(4)]))){
var statearr_31189_33030 = state_31158;
(statearr_31189_33030[(1)] = cljs.core.first((state_31158[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33031 = state_31158;
state_31158 = G__33031;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31158){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31158);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31190 = f__29283__auto__();
(statearr_31190[(6)] = c__29282__auto___32995);

return statearr_31190;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.merge.cljs$lang$maxFixedArity = 2);

/**
 * Returns a channel containing the single (collection) result of the
 *   items taken from the channel conjoined to the supplied
 *   collection. ch must close before into produces a result.
 */
cljs.core.async.into = (function cljs$core$async$into(coll,ch){
return cljs.core.async.reduce(cljs.core.conj,coll,ch);
});
/**
 * Returns a channel that will return, at most, n items from ch. After n items
 * have been returned, or ch has been closed, the return chanel will close.
 * 
 *   The output channel is unbuffered by default, unless buf-or-n is given.
 */
cljs.core.async.take = (function cljs$core$async$take(var_args){
var G__31195 = arguments.length;
switch (G__31195) {
case 2:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.take.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3(n,ch,null);
}));

(cljs.core.async.take.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___33033 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31232){
var state_val_31233 = (state_31232[(1)]);
if((state_val_31233 === (7))){
var inst_31211 = (state_31232[(7)]);
var inst_31211__$1 = (state_31232[(2)]);
var inst_31213 = (inst_31211__$1 == null);
var inst_31214 = cljs.core.not(inst_31213);
var state_31232__$1 = (function (){var statearr_31234 = state_31232;
(statearr_31234[(7)] = inst_31211__$1);

return statearr_31234;
})();
if(inst_31214){
var statearr_31238_33038 = state_31232__$1;
(statearr_31238_33038[(1)] = (8));

} else {
var statearr_31239_33039 = state_31232__$1;
(statearr_31239_33039[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (1))){
var inst_31205 = (0);
var state_31232__$1 = (function (){var statearr_31240 = state_31232;
(statearr_31240[(8)] = inst_31205);

return statearr_31240;
})();
var statearr_31241_33041 = state_31232__$1;
(statearr_31241_33041[(2)] = null);

(statearr_31241_33041[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (4))){
var state_31232__$1 = state_31232;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31232__$1,(7),ch);
} else {
if((state_val_31233 === (6))){
var inst_31225 = (state_31232[(2)]);
var state_31232__$1 = state_31232;
var statearr_31252_33046 = state_31232__$1;
(statearr_31252_33046[(2)] = inst_31225);

(statearr_31252_33046[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (3))){
var inst_31229 = (state_31232[(2)]);
var inst_31230 = cljs.core.async.close_BANG_(out);
var state_31232__$1 = (function (){var statearr_31253 = state_31232;
(statearr_31253[(9)] = inst_31229);

return statearr_31253;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31232__$1,inst_31230);
} else {
if((state_val_31233 === (2))){
var inst_31205 = (state_31232[(8)]);
var inst_31207 = (inst_31205 < n);
var state_31232__$1 = state_31232;
if(cljs.core.truth_(inst_31207)){
var statearr_31257_33054 = state_31232__$1;
(statearr_31257_33054[(1)] = (4));

} else {
var statearr_31258_33055 = state_31232__$1;
(statearr_31258_33055[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (11))){
var inst_31205 = (state_31232[(8)]);
var inst_31217 = (state_31232[(2)]);
var inst_31218 = (inst_31205 + (1));
var inst_31205__$1 = inst_31218;
var state_31232__$1 = (function (){var statearr_31265 = state_31232;
(statearr_31265[(8)] = inst_31205__$1);

(statearr_31265[(10)] = inst_31217);

return statearr_31265;
})();
var statearr_31266_33060 = state_31232__$1;
(statearr_31266_33060[(2)] = null);

(statearr_31266_33060[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (9))){
var state_31232__$1 = state_31232;
var statearr_31267_33061 = state_31232__$1;
(statearr_31267_33061[(2)] = null);

(statearr_31267_33061[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (5))){
var state_31232__$1 = state_31232;
var statearr_31275_33065 = state_31232__$1;
(statearr_31275_33065[(2)] = null);

(statearr_31275_33065[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (10))){
var inst_31222 = (state_31232[(2)]);
var state_31232__$1 = state_31232;
var statearr_31276_33070 = state_31232__$1;
(statearr_31276_33070[(2)] = inst_31222);

(statearr_31276_33070[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31233 === (8))){
var inst_31211 = (state_31232[(7)]);
var state_31232__$1 = state_31232;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31232__$1,(11),out,inst_31211);
} else {
return null;
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
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31280 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31280[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31280[(1)] = (1));

return statearr_31280;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31232){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31232);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31281){var ex__28416__auto__ = e31281;
var statearr_31285_33079 = state_31232;
(statearr_31285_33079[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31232[(4)]))){
var statearr_31286_33084 = state_31232;
(statearr_31286_33084[(1)] = cljs.core.first((state_31232[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33085 = state_31232;
state_31232 = G__33085;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31232){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31232);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31294 = f__29283__auto__();
(statearr_31294[(6)] = c__29282__auto___33033);

return statearr_31294;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.take.cljs$lang$maxFixedArity = 3);


/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31311 = (function (f,ch,meta31307,_,fn1,meta31312){
this.f = f;
this.ch = ch;
this.meta31307 = meta31307;
this._ = _;
this.fn1 = fn1;
this.meta31312 = meta31312;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31313,meta31312__$1){
var self__ = this;
var _31313__$1 = this;
return (new cljs.core.async.t_cljs$core$async31311(self__.f,self__.ch,self__.meta31307,self__._,self__.fn1,meta31312__$1));
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31313){
var self__ = this;
var _31313__$1 = this;
return self__.meta31312;
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.fn1);
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit(self__.fn1);
return (function (p1__31302_SHARP_){
var G__31317 = (((p1__31302_SHARP_ == null))?null:(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(p1__31302_SHARP_) : self__.f.call(null, p1__31302_SHARP_)));
return (f1.cljs$core$IFn$_invoke$arity$1 ? f1.cljs$core$IFn$_invoke$arity$1(G__31317) : f1.call(null, G__31317));
});
}));

(cljs.core.async.t_cljs$core$async31311.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31307","meta31307",2092895045,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("cljs.core.async","t_cljs$core$async31306","cljs.core.async/t_cljs$core$async31306",-1768907263,null)], null)),new cljs.core.Symbol(null,"fn1","fn1",895834444,null),new cljs.core.Symbol(null,"meta31312","meta31312",-363794178,null)], null);
}));

(cljs.core.async.t_cljs$core$async31311.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31311.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31311");

(cljs.core.async.t_cljs$core$async31311.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31311");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31311.
 */
cljs.core.async.__GT_t_cljs$core$async31311 = (function cljs$core$async$__GT_t_cljs$core$async31311(f,ch,meta31307,_,fn1,meta31312){
return (new cljs.core.async.t_cljs$core$async31311(f,ch,meta31307,_,fn1,meta31312));
});



/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31306 = (function (f,ch,meta31307){
this.f = f;
this.ch = ch;
this.meta31307 = meta31307;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31308,meta31307__$1){
var self__ = this;
var _31308__$1 = this;
return (new cljs.core.async.t_cljs$core$async31306(self__.f,self__.ch,meta31307__$1));
}));

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31308){
var self__ = this;
var _31308__$1 = this;
return self__.meta31307;
}));

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_(self__.ch,(new cljs.core.async.t_cljs$core$async31311(self__.f,self__.ch,self__.meta31307,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY)));
if(cljs.core.truth_((function (){var and__5043__auto__ = ret;
if(cljs.core.truth_(and__5043__auto__)){
return (!((cljs.core.deref(ret) == null)));
} else {
return and__5043__auto__;
}
})())){
return cljs.core.async.impl.channels.box((function (){var G__31318 = cljs.core.deref(ret);
return (self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(G__31318) : self__.f.call(null, G__31318));
})());
} else {
return ret;
}
}));

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31306.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
}));

(cljs.core.async.t_cljs$core$async31306.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31307","meta31307",2092895045,null)], null);
}));

(cljs.core.async.t_cljs$core$async31306.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31306.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31306");

(cljs.core.async.t_cljs$core$async31306.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31306");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31306.
 */
cljs.core.async.__GT_t_cljs$core$async31306 = (function cljs$core$async$__GT_t_cljs$core$async31306(f,ch,meta31307){
return (new cljs.core.async.t_cljs$core$async31306(f,ch,meta31307));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31306(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31322 = (function (f,ch,meta31323){
this.f = f;
this.ch = ch;
this.meta31323 = meta31323;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31324,meta31323__$1){
var self__ = this;
var _31324__$1 = this;
return (new cljs.core.async.t_cljs$core$async31322(self__.f,self__.ch,meta31323__$1));
}));

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31324){
var self__ = this;
var _31324__$1 = this;
return self__.meta31323;
}));

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
}));

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(val) : self__.f.call(null, val)),fn1);
}));

(cljs.core.async.t_cljs$core$async31322.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31323","meta31323",1638799166,null)], null);
}));

(cljs.core.async.t_cljs$core$async31322.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31322.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31322");

(cljs.core.async.t_cljs$core$async31322.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31322");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31322.
 */
cljs.core.async.__GT_t_cljs$core$async31322 = (function cljs$core$async$__GT_t_cljs$core$async31322(f,ch,meta31323){
return (new cljs.core.async.t_cljs$core$async31322(f,ch,meta31323));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31322(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31340 = (function (p,ch,meta31341){
this.p = p;
this.ch = ch;
this.meta31341 = meta31341;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31342,meta31341__$1){
var self__ = this;
var _31342__$1 = this;
return (new cljs.core.async.t_cljs$core$async31340(self__.p,self__.ch,meta31341__$1));
}));

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31342){
var self__ = this;
var _31342__$1 = this;
return self__.meta31341;
}));

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
}));

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31340.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.p.cljs$core$IFn$_invoke$arity$1 ? self__.p.cljs$core$IFn$_invoke$arity$1(val) : self__.p.call(null, val)))){
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box(cljs.core.not(cljs.core.async.impl.protocols.closed_QMARK_(self__.ch)));
}
}));

(cljs.core.async.t_cljs$core$async31340.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31341","meta31341",1178319822,null)], null);
}));

(cljs.core.async.t_cljs$core$async31340.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31340.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31340");

(cljs.core.async.t_cljs$core$async31340.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31340");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31340.
 */
cljs.core.async.__GT_t_cljs$core$async31340 = (function cljs$core$async$__GT_t_cljs$core$async31340(p,ch,meta31341){
return (new cljs.core.async.t_cljs$core$async31340(p,ch,meta31341));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
return (new cljs.core.async.t_cljs$core$async31340(p,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_GT_ = (function cljs$core$async$remove_GT_(p,ch){
return cljs.core.async.filter_GT_(cljs.core.complement(p),ch);
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_LT_ = (function cljs$core$async$filter_LT_(var_args){
var G__31356 = arguments.length;
switch (G__31356) {
case 2:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3(p,ch,null);
}));

(cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___33119 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31379){
var state_val_31380 = (state_31379[(1)]);
if((state_val_31380 === (7))){
var inst_31375 = (state_31379[(2)]);
var state_31379__$1 = state_31379;
var statearr_31389_33121 = state_31379__$1;
(statearr_31389_33121[(2)] = inst_31375);

(statearr_31389_33121[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (1))){
var state_31379__$1 = state_31379;
var statearr_31393_33122 = state_31379__$1;
(statearr_31393_33122[(2)] = null);

(statearr_31393_33122[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (4))){
var inst_31360 = (state_31379[(7)]);
var inst_31360__$1 = (state_31379[(2)]);
var inst_31362 = (inst_31360__$1 == null);
var state_31379__$1 = (function (){var statearr_31397 = state_31379;
(statearr_31397[(7)] = inst_31360__$1);

return statearr_31397;
})();
if(cljs.core.truth_(inst_31362)){
var statearr_31398_33124 = state_31379__$1;
(statearr_31398_33124[(1)] = (5));

} else {
var statearr_31399_33125 = state_31379__$1;
(statearr_31399_33125[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (6))){
var inst_31360 = (state_31379[(7)]);
var inst_31366 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_31360) : p.call(null, inst_31360));
var state_31379__$1 = state_31379;
if(cljs.core.truth_(inst_31366)){
var statearr_31403_33128 = state_31379__$1;
(statearr_31403_33128[(1)] = (8));

} else {
var statearr_31404_33131 = state_31379__$1;
(statearr_31404_33131[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (3))){
var inst_31377 = (state_31379[(2)]);
var state_31379__$1 = state_31379;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31379__$1,inst_31377);
} else {
if((state_val_31380 === (2))){
var state_31379__$1 = state_31379;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31379__$1,(4),ch);
} else {
if((state_val_31380 === (11))){
var inst_31369 = (state_31379[(2)]);
var state_31379__$1 = state_31379;
var statearr_31405_33132 = state_31379__$1;
(statearr_31405_33132[(2)] = inst_31369);

(statearr_31405_33132[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (9))){
var state_31379__$1 = state_31379;
var statearr_31406_33133 = state_31379__$1;
(statearr_31406_33133[(2)] = null);

(statearr_31406_33133[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (5))){
var inst_31364 = cljs.core.async.close_BANG_(out);
var state_31379__$1 = state_31379;
var statearr_31416_33134 = state_31379__$1;
(statearr_31416_33134[(2)] = inst_31364);

(statearr_31416_33134[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (10))){
var inst_31372 = (state_31379[(2)]);
var state_31379__$1 = (function (){var statearr_31417 = state_31379;
(statearr_31417[(8)] = inst_31372);

return statearr_31417;
})();
var statearr_31418_33136 = state_31379__$1;
(statearr_31418_33136[(2)] = null);

(statearr_31418_33136[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31380 === (8))){
var inst_31360 = (state_31379[(7)]);
var state_31379__$1 = state_31379;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31379__$1,(11),out,inst_31360);
} else {
return null;
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
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31419 = [null,null,null,null,null,null,null,null,null];
(statearr_31419[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31419[(1)] = (1));

return statearr_31419;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31379){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31379);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31420){var ex__28416__auto__ = e31420;
var statearr_31422_33147 = state_31379;
(statearr_31422_33147[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31379[(4)]))){
var statearr_31423_33150 = state_31379;
(statearr_31423_33150[(1)] = cljs.core.first((state_31379[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33151 = state_31379;
state_31379 = G__33151;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31379){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31379);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31424 = f__29283__auto__();
(statearr_31424[(6)] = c__29282__auto___33119);

return statearr_31424;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.filter_LT_.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_LT_ = (function cljs$core$async$remove_LT_(var_args){
var G__31426 = arguments.length;
switch (G__31426) {
case 2:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3(p,ch,null);
}));

(cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3(cljs.core.complement(p),ch,buf_or_n);
}));

(cljs.core.async.remove_LT_.cljs$lang$maxFixedArity = 3);

cljs.core.async.mapcat_STAR_ = (function cljs$core$async$mapcat_STAR_(f,in$,out){
var c__29282__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31496){
var state_val_31497 = (state_31496[(1)]);
if((state_val_31497 === (7))){
var inst_31492 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
var statearr_31500_33157 = state_31496__$1;
(statearr_31500_33157[(2)] = inst_31492);

(statearr_31500_33157[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (20))){
var inst_31460 = (state_31496[(7)]);
var inst_31473 = (state_31496[(2)]);
var inst_31474 = cljs.core.next(inst_31460);
var inst_31446 = inst_31474;
var inst_31447 = null;
var inst_31448 = (0);
var inst_31449 = (0);
var state_31496__$1 = (function (){var statearr_31510 = state_31496;
(statearr_31510[(8)] = inst_31448);

(statearr_31510[(9)] = inst_31473);

(statearr_31510[(10)] = inst_31446);

(statearr_31510[(11)] = inst_31447);

(statearr_31510[(12)] = inst_31449);

return statearr_31510;
})();
var statearr_31511_33159 = state_31496__$1;
(statearr_31511_33159[(2)] = null);

(statearr_31511_33159[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (1))){
var state_31496__$1 = state_31496;
var statearr_31512_33160 = state_31496__$1;
(statearr_31512_33160[(2)] = null);

(statearr_31512_33160[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (4))){
var inst_31429 = (state_31496[(13)]);
var inst_31429__$1 = (state_31496[(2)]);
var inst_31436 = (inst_31429__$1 == null);
var state_31496__$1 = (function (){var statearr_31513 = state_31496;
(statearr_31513[(13)] = inst_31429__$1);

return statearr_31513;
})();
if(cljs.core.truth_(inst_31436)){
var statearr_31514_33162 = state_31496__$1;
(statearr_31514_33162[(1)] = (5));

} else {
var statearr_31515_33163 = state_31496__$1;
(statearr_31515_33163[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (15))){
var state_31496__$1 = state_31496;
var statearr_31519_33164 = state_31496__$1;
(statearr_31519_33164[(2)] = null);

(statearr_31519_33164[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (21))){
var state_31496__$1 = state_31496;
var statearr_31520_33165 = state_31496__$1;
(statearr_31520_33165[(2)] = null);

(statearr_31520_33165[(1)] = (23));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (13))){
var inst_31448 = (state_31496[(8)]);
var inst_31446 = (state_31496[(10)]);
var inst_31447 = (state_31496[(11)]);
var inst_31449 = (state_31496[(12)]);
var inst_31456 = (state_31496[(2)]);
var inst_31457 = (inst_31449 + (1));
var tmp31516 = inst_31448;
var tmp31517 = inst_31446;
var tmp31518 = inst_31447;
var inst_31446__$1 = tmp31517;
var inst_31447__$1 = tmp31518;
var inst_31448__$1 = tmp31516;
var inst_31449__$1 = inst_31457;
var state_31496__$1 = (function (){var statearr_31528 = state_31496;
(statearr_31528[(8)] = inst_31448__$1);

(statearr_31528[(14)] = inst_31456);

(statearr_31528[(10)] = inst_31446__$1);

(statearr_31528[(11)] = inst_31447__$1);

(statearr_31528[(12)] = inst_31449__$1);

return statearr_31528;
})();
var statearr_31529_33167 = state_31496__$1;
(statearr_31529_33167[(2)] = null);

(statearr_31529_33167[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (22))){
var state_31496__$1 = state_31496;
var statearr_31531_33169 = state_31496__$1;
(statearr_31531_33169[(2)] = null);

(statearr_31531_33169[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (6))){
var inst_31429 = (state_31496[(13)]);
var inst_31444 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31429) : f.call(null, inst_31429));
var inst_31445 = cljs.core.seq(inst_31444);
var inst_31446 = inst_31445;
var inst_31447 = null;
var inst_31448 = (0);
var inst_31449 = (0);
var state_31496__$1 = (function (){var statearr_31532 = state_31496;
(statearr_31532[(8)] = inst_31448);

(statearr_31532[(10)] = inst_31446);

(statearr_31532[(11)] = inst_31447);

(statearr_31532[(12)] = inst_31449);

return statearr_31532;
})();
var statearr_31533_33170 = state_31496__$1;
(statearr_31533_33170[(2)] = null);

(statearr_31533_33170[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (17))){
var inst_31460 = (state_31496[(7)]);
var inst_31466 = cljs.core.chunk_first(inst_31460);
var inst_31467 = cljs.core.chunk_rest(inst_31460);
var inst_31468 = cljs.core.count(inst_31466);
var inst_31446 = inst_31467;
var inst_31447 = inst_31466;
var inst_31448 = inst_31468;
var inst_31449 = (0);
var state_31496__$1 = (function (){var statearr_31543 = state_31496;
(statearr_31543[(8)] = inst_31448);

(statearr_31543[(10)] = inst_31446);

(statearr_31543[(11)] = inst_31447);

(statearr_31543[(12)] = inst_31449);

return statearr_31543;
})();
var statearr_31544_33175 = state_31496__$1;
(statearr_31544_33175[(2)] = null);

(statearr_31544_33175[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (3))){
var inst_31494 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31496__$1,inst_31494);
} else {
if((state_val_31497 === (12))){
var inst_31482 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
var statearr_31548_33176 = state_31496__$1;
(statearr_31548_33176[(2)] = inst_31482);

(statearr_31548_33176[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (2))){
var state_31496__$1 = state_31496;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31496__$1,(4),in$);
} else {
if((state_val_31497 === (23))){
var inst_31490 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
var statearr_31552_33181 = state_31496__$1;
(statearr_31552_33181[(2)] = inst_31490);

(statearr_31552_33181[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (19))){
var inst_31477 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
var statearr_31554_33182 = state_31496__$1;
(statearr_31554_33182[(2)] = inst_31477);

(statearr_31554_33182[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (11))){
var inst_31446 = (state_31496[(10)]);
var inst_31460 = (state_31496[(7)]);
var inst_31460__$1 = cljs.core.seq(inst_31446);
var state_31496__$1 = (function (){var statearr_31555 = state_31496;
(statearr_31555[(7)] = inst_31460__$1);

return statearr_31555;
})();
if(inst_31460__$1){
var statearr_31556_33187 = state_31496__$1;
(statearr_31556_33187[(1)] = (14));

} else {
var statearr_31558_33188 = state_31496__$1;
(statearr_31558_33188[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (9))){
var inst_31484 = (state_31496[(2)]);
var inst_31485 = cljs.core.async.impl.protocols.closed_QMARK_(out);
var state_31496__$1 = (function (){var statearr_31568 = state_31496;
(statearr_31568[(15)] = inst_31484);

return statearr_31568;
})();
if(cljs.core.truth_(inst_31485)){
var statearr_31569_33196 = state_31496__$1;
(statearr_31569_33196[(1)] = (21));

} else {
var statearr_31570_33197 = state_31496__$1;
(statearr_31570_33197[(1)] = (22));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (5))){
var inst_31438 = cljs.core.async.close_BANG_(out);
var state_31496__$1 = state_31496;
var statearr_31572_33198 = state_31496__$1;
(statearr_31572_33198[(2)] = inst_31438);

(statearr_31572_33198[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (14))){
var inst_31460 = (state_31496[(7)]);
var inst_31464 = cljs.core.chunked_seq_QMARK_(inst_31460);
var state_31496__$1 = state_31496;
if(inst_31464){
var statearr_31573_33199 = state_31496__$1;
(statearr_31573_33199[(1)] = (17));

} else {
var statearr_31574_33205 = state_31496__$1;
(statearr_31574_33205[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (16))){
var inst_31480 = (state_31496[(2)]);
var state_31496__$1 = state_31496;
var statearr_31578_33206 = state_31496__$1;
(statearr_31578_33206[(2)] = inst_31480);

(statearr_31578_33206[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31497 === (10))){
var inst_31447 = (state_31496[(11)]);
var inst_31449 = (state_31496[(12)]);
var inst_31454 = cljs.core._nth(inst_31447,inst_31449);
var state_31496__$1 = state_31496;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31496__$1,(13),out,inst_31454);
} else {
if((state_val_31497 === (18))){
var inst_31460 = (state_31496[(7)]);
var inst_31471 = cljs.core.first(inst_31460);
var state_31496__$1 = state_31496;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31496__$1,(20),out,inst_31471);
} else {
if((state_val_31497 === (8))){
var inst_31448 = (state_31496[(8)]);
var inst_31449 = (state_31496[(12)]);
var inst_31451 = (inst_31449 < inst_31448);
var inst_31452 = inst_31451;
var state_31496__$1 = state_31496;
if(cljs.core.truth_(inst_31452)){
var statearr_31584_33221 = state_31496__$1;
(statearr_31584_33221[(1)] = (10));

} else {
var statearr_31585_33222 = state_31496__$1;
(statearr_31585_33222[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
});
return (function() {
var cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__ = null;
var cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____0 = (function (){
var statearr_31594 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31594[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__);

(statearr_31594[(1)] = (1));

return statearr_31594;
});
var cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____1 = (function (state_31496){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31496);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31595){var ex__28416__auto__ = e31595;
var statearr_31596_33230 = state_31496;
(statearr_31596_33230[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31496[(4)]))){
var statearr_31597_33231 = state_31496;
(statearr_31597_33231[(1)] = cljs.core.first((state_31496[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33232 = state_31496;
state_31496 = G__33232;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__ = function(state_31496){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____1.call(this,state_31496);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__28413__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31599 = f__29283__auto__();
(statearr_31599[(6)] = c__29282__auto__);

return statearr_31599;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));

return c__29282__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var G__31605 = arguments.length;
switch (G__31605) {
case 2:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2 = (function (f,in$){
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3(f,in$,null);
}));

(cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3 = (function (f,in$,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
cljs.core.async.mapcat_STAR_(f,in$,out);

return out;
}));

(cljs.core.async.mapcat_LT_.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_GT_ = (function cljs$core$async$mapcat_GT_(var_args){
var G__31607 = arguments.length;
switch (G__31607) {
case 2:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2 = (function (f,out){
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3(f,out,null);
}));

(cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3 = (function (f,out,buf_or_n){
var in$ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
cljs.core.async.mapcat_STAR_(f,in$,out);

return in$;
}));

(cljs.core.async.mapcat_GT_.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.unique = (function cljs$core$async$unique(var_args){
var G__31624 = arguments.length;
switch (G__31624) {
case 1:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1 = (function (ch){
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2(ch,null);
}));

(cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2 = (function (ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___33254 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31650){
var state_val_31651 = (state_31650[(1)]);
if((state_val_31651 === (7))){
var inst_31643 = (state_31650[(2)]);
var state_31650__$1 = state_31650;
var statearr_31655_33258 = state_31650__$1;
(statearr_31655_33258[(2)] = inst_31643);

(statearr_31655_33258[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (1))){
var inst_31625 = null;
var state_31650__$1 = (function (){var statearr_31658 = state_31650;
(statearr_31658[(7)] = inst_31625);

return statearr_31658;
})();
var statearr_31659_33263 = state_31650__$1;
(statearr_31659_33263[(2)] = null);

(statearr_31659_33263[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (4))){
var inst_31628 = (state_31650[(8)]);
var inst_31628__$1 = (state_31650[(2)]);
var inst_31629 = (inst_31628__$1 == null);
var inst_31630 = cljs.core.not(inst_31629);
var state_31650__$1 = (function (){var statearr_31660 = state_31650;
(statearr_31660[(8)] = inst_31628__$1);

return statearr_31660;
})();
if(inst_31630){
var statearr_31661_33264 = state_31650__$1;
(statearr_31661_33264[(1)] = (5));

} else {
var statearr_31662_33265 = state_31650__$1;
(statearr_31662_33265[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (6))){
var state_31650__$1 = state_31650;
var statearr_31663_33266 = state_31650__$1;
(statearr_31663_33266[(2)] = null);

(statearr_31663_33266[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (3))){
var inst_31647 = (state_31650[(2)]);
var inst_31648 = cljs.core.async.close_BANG_(out);
var state_31650__$1 = (function (){var statearr_31665 = state_31650;
(statearr_31665[(9)] = inst_31647);

return statearr_31665;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31650__$1,inst_31648);
} else {
if((state_val_31651 === (2))){
var state_31650__$1 = state_31650;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31650__$1,(4),ch);
} else {
if((state_val_31651 === (11))){
var inst_31628 = (state_31650[(8)]);
var inst_31637 = (state_31650[(2)]);
var inst_31625 = inst_31628;
var state_31650__$1 = (function (){var statearr_31667 = state_31650;
(statearr_31667[(7)] = inst_31625);

(statearr_31667[(10)] = inst_31637);

return statearr_31667;
})();
var statearr_31668_33270 = state_31650__$1;
(statearr_31668_33270[(2)] = null);

(statearr_31668_33270[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (9))){
var inst_31628 = (state_31650[(8)]);
var state_31650__$1 = state_31650;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31650__$1,(11),out,inst_31628);
} else {
if((state_val_31651 === (5))){
var inst_31628 = (state_31650[(8)]);
var inst_31625 = (state_31650[(7)]);
var inst_31632 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31628,inst_31625);
var state_31650__$1 = state_31650;
if(inst_31632){
var statearr_31670_33274 = state_31650__$1;
(statearr_31670_33274[(1)] = (8));

} else {
var statearr_31671_33275 = state_31650__$1;
(statearr_31671_33275[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (10))){
var inst_31640 = (state_31650[(2)]);
var state_31650__$1 = state_31650;
var statearr_31672_33276 = state_31650__$1;
(statearr_31672_33276[(2)] = inst_31640);

(statearr_31672_33276[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31651 === (8))){
var inst_31625 = (state_31650[(7)]);
var tmp31669 = inst_31625;
var inst_31625__$1 = tmp31669;
var state_31650__$1 = (function (){var statearr_31676 = state_31650;
(statearr_31676[(7)] = inst_31625__$1);

return statearr_31676;
})();
var statearr_31677_33278 = state_31650__$1;
(statearr_31677_33278[(2)] = null);

(statearr_31677_33278[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31678 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31678[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31678[(1)] = (1));

return statearr_31678;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31650){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31650);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31679){var ex__28416__auto__ = e31679;
var statearr_31683_33283 = state_31650;
(statearr_31683_33283[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31650[(4)]))){
var statearr_31684_33284 = state_31650;
(statearr_31684_33284[(1)] = cljs.core.first((state_31650[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33286 = state_31650;
state_31650 = G__33286;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31650){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31650);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31689 = f__29283__auto__();
(statearr_31689[(6)] = c__29282__auto___33254);

return statearr_31689;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.unique.cljs$lang$maxFixedArity = 2);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var G__31694 = arguments.length;
switch (G__31694) {
case 2:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3(n,ch,null);
}));

(cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___33296 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31747){
var state_val_31748 = (state_31747[(1)]);
if((state_val_31748 === (7))){
var inst_31743 = (state_31747[(2)]);
var state_31747__$1 = state_31747;
var statearr_31753_33298 = state_31747__$1;
(statearr_31753_33298[(2)] = inst_31743);

(statearr_31753_33298[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (1))){
var inst_31702 = (new Array(n));
var inst_31703 = inst_31702;
var inst_31704 = (0);
var state_31747__$1 = (function (){var statearr_31759 = state_31747;
(statearr_31759[(7)] = inst_31704);

(statearr_31759[(8)] = inst_31703);

return statearr_31759;
})();
var statearr_31760_33299 = state_31747__$1;
(statearr_31760_33299[(2)] = null);

(statearr_31760_33299[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (4))){
var inst_31707 = (state_31747[(9)]);
var inst_31707__$1 = (state_31747[(2)]);
var inst_31708 = (inst_31707__$1 == null);
var inst_31709 = cljs.core.not(inst_31708);
var state_31747__$1 = (function (){var statearr_31761 = state_31747;
(statearr_31761[(9)] = inst_31707__$1);

return statearr_31761;
})();
if(inst_31709){
var statearr_31768_33304 = state_31747__$1;
(statearr_31768_33304[(1)] = (5));

} else {
var statearr_31769_33305 = state_31747__$1;
(statearr_31769_33305[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (15))){
var inst_31735 = (state_31747[(2)]);
var state_31747__$1 = state_31747;
var statearr_31770_33306 = state_31747__$1;
(statearr_31770_33306[(2)] = inst_31735);

(statearr_31770_33306[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (13))){
var state_31747__$1 = state_31747;
var statearr_31771_33307 = state_31747__$1;
(statearr_31771_33307[(2)] = null);

(statearr_31771_33307[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (6))){
var inst_31704 = (state_31747[(7)]);
var inst_31731 = (inst_31704 > (0));
var state_31747__$1 = state_31747;
if(cljs.core.truth_(inst_31731)){
var statearr_31778_33308 = state_31747__$1;
(statearr_31778_33308[(1)] = (12));

} else {
var statearr_31779_33309 = state_31747__$1;
(statearr_31779_33309[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (3))){
var inst_31745 = (state_31747[(2)]);
var state_31747__$1 = state_31747;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31747__$1,inst_31745);
} else {
if((state_val_31748 === (12))){
var inst_31703 = (state_31747[(8)]);
var inst_31733 = cljs.core.vec(inst_31703);
var state_31747__$1 = state_31747;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31747__$1,(15),out,inst_31733);
} else {
if((state_val_31748 === (2))){
var state_31747__$1 = state_31747;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31747__$1,(4),ch);
} else {
if((state_val_31748 === (11))){
var inst_31725 = (state_31747[(2)]);
var inst_31726 = (new Array(n));
var inst_31703 = inst_31726;
var inst_31704 = (0);
var state_31747__$1 = (function (){var statearr_31792 = state_31747;
(statearr_31792[(7)] = inst_31704);

(statearr_31792[(10)] = inst_31725);

(statearr_31792[(8)] = inst_31703);

return statearr_31792;
})();
var statearr_31794_33314 = state_31747__$1;
(statearr_31794_33314[(2)] = null);

(statearr_31794_33314[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (9))){
var inst_31703 = (state_31747[(8)]);
var inst_31723 = cljs.core.vec(inst_31703);
var state_31747__$1 = state_31747;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31747__$1,(11),out,inst_31723);
} else {
if((state_val_31748 === (5))){
var inst_31707 = (state_31747[(9)]);
var inst_31704 = (state_31747[(7)]);
var inst_31703 = (state_31747[(8)]);
var inst_31712 = (state_31747[(11)]);
var inst_31711 = (inst_31703[inst_31704] = inst_31707);
var inst_31712__$1 = (inst_31704 + (1));
var inst_31713 = (inst_31712__$1 < n);
var state_31747__$1 = (function (){var statearr_31796 = state_31747;
(statearr_31796[(11)] = inst_31712__$1);

(statearr_31796[(12)] = inst_31711);

return statearr_31796;
})();
if(cljs.core.truth_(inst_31713)){
var statearr_31797_33320 = state_31747__$1;
(statearr_31797_33320[(1)] = (8));

} else {
var statearr_31798_33321 = state_31747__$1;
(statearr_31798_33321[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (14))){
var inst_31740 = (state_31747[(2)]);
var inst_31741 = cljs.core.async.close_BANG_(out);
var state_31747__$1 = (function (){var statearr_31800 = state_31747;
(statearr_31800[(13)] = inst_31740);

return statearr_31800;
})();
var statearr_31801_33323 = state_31747__$1;
(statearr_31801_33323[(2)] = inst_31741);

(statearr_31801_33323[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (10))){
var inst_31729 = (state_31747[(2)]);
var state_31747__$1 = state_31747;
var statearr_31802_33324 = state_31747__$1;
(statearr_31802_33324[(2)] = inst_31729);

(statearr_31802_33324[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31748 === (8))){
var inst_31703 = (state_31747[(8)]);
var inst_31712 = (state_31747[(11)]);
var tmp31799 = inst_31703;
var inst_31703__$1 = tmp31799;
var inst_31704 = inst_31712;
var state_31747__$1 = (function (){var statearr_31803 = state_31747;
(statearr_31803[(7)] = inst_31704);

(statearr_31803[(8)] = inst_31703__$1);

return statearr_31803;
})();
var statearr_31804_33327 = state_31747__$1;
(statearr_31804_33327[(2)] = null);

(statearr_31804_33327[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31810 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31810[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31810[(1)] = (1));

return statearr_31810;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31747){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31747);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31816){var ex__28416__auto__ = e31816;
var statearr_31817_33331 = state_31747;
(statearr_31817_33331[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31747[(4)]))){
var statearr_31818_33333 = state_31747;
(statearr_31818_33333[(1)] = cljs.core.first((state_31747[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33335 = state_31747;
state_31747 = G__33335;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31747){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31747);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31819 = f__29283__auto__();
(statearr_31819[(6)] = c__29282__auto___33296);

return statearr_31819;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.partition.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var G__31822 = arguments.length;
switch (G__31822) {
case 2:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2 = (function (f,ch){
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3(f,ch,null);
}));

(cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3 = (function (f,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__29282__auto___33337 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29283__auto__ = (function (){var switch__28412__auto__ = (function (state_31876){
var state_val_31877 = (state_31876[(1)]);
if((state_val_31877 === (7))){
var inst_31872 = (state_31876[(2)]);
var state_31876__$1 = state_31876;
var statearr_31878_33338 = state_31876__$1;
(statearr_31878_33338[(2)] = inst_31872);

(statearr_31878_33338[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (1))){
var inst_31829 = [];
var inst_31830 = inst_31829;
var inst_31831 = new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123);
var state_31876__$1 = (function (){var statearr_31879 = state_31876;
(statearr_31879[(7)] = inst_31831);

(statearr_31879[(8)] = inst_31830);

return statearr_31879;
})();
var statearr_31881_33344 = state_31876__$1;
(statearr_31881_33344[(2)] = null);

(statearr_31881_33344[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (4))){
var inst_31834 = (state_31876[(9)]);
var inst_31834__$1 = (state_31876[(2)]);
var inst_31835 = (inst_31834__$1 == null);
var inst_31836 = cljs.core.not(inst_31835);
var state_31876__$1 = (function (){var statearr_31888 = state_31876;
(statearr_31888[(9)] = inst_31834__$1);

return statearr_31888;
})();
if(inst_31836){
var statearr_31889_33346 = state_31876__$1;
(statearr_31889_33346[(1)] = (5));

} else {
var statearr_31890_33347 = state_31876__$1;
(statearr_31890_33347[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (15))){
var inst_31830 = (state_31876[(8)]);
var inst_31861 = cljs.core.vec(inst_31830);
var state_31876__$1 = state_31876;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31876__$1,(18),out,inst_31861);
} else {
if((state_val_31877 === (13))){
var inst_31856 = (state_31876[(2)]);
var state_31876__$1 = state_31876;
var statearr_31891_33348 = state_31876__$1;
(statearr_31891_33348[(2)] = inst_31856);

(statearr_31891_33348[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (6))){
var inst_31830 = (state_31876[(8)]);
var inst_31858 = inst_31830.length;
var inst_31859 = (inst_31858 > (0));
var state_31876__$1 = state_31876;
if(cljs.core.truth_(inst_31859)){
var statearr_31892_33354 = state_31876__$1;
(statearr_31892_33354[(1)] = (15));

} else {
var statearr_31893_33355 = state_31876__$1;
(statearr_31893_33355[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (17))){
var inst_31866 = (state_31876[(2)]);
var inst_31870 = cljs.core.async.close_BANG_(out);
var state_31876__$1 = (function (){var statearr_31907 = state_31876;
(statearr_31907[(10)] = inst_31866);

return statearr_31907;
})();
var statearr_31908_33356 = state_31876__$1;
(statearr_31908_33356[(2)] = inst_31870);

(statearr_31908_33356[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (3))){
var inst_31874 = (state_31876[(2)]);
var state_31876__$1 = state_31876;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31876__$1,inst_31874);
} else {
if((state_val_31877 === (12))){
var inst_31830 = (state_31876[(8)]);
var inst_31849 = cljs.core.vec(inst_31830);
var state_31876__$1 = state_31876;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31876__$1,(14),out,inst_31849);
} else {
if((state_val_31877 === (2))){
var state_31876__$1 = state_31876;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31876__$1,(4),ch);
} else {
if((state_val_31877 === (11))){
var inst_31834 = (state_31876[(9)]);
var inst_31838 = (state_31876[(11)]);
var inst_31830 = (state_31876[(8)]);
var inst_31846 = inst_31830.push(inst_31834);
var tmp31909 = inst_31830;
var inst_31830__$1 = tmp31909;
var inst_31831 = inst_31838;
var state_31876__$1 = (function (){var statearr_31910 = state_31876;
(statearr_31910[(12)] = inst_31846);

(statearr_31910[(7)] = inst_31831);

(statearr_31910[(8)] = inst_31830__$1);

return statearr_31910;
})();
var statearr_31911_33365 = state_31876__$1;
(statearr_31911_33365[(2)] = null);

(statearr_31911_33365[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (9))){
var inst_31831 = (state_31876[(7)]);
var inst_31842 = cljs.core.keyword_identical_QMARK_(inst_31831,new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123));
var state_31876__$1 = state_31876;
var statearr_31915_33371 = state_31876__$1;
(statearr_31915_33371[(2)] = inst_31842);

(statearr_31915_33371[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (5))){
var inst_31834 = (state_31876[(9)]);
var inst_31838 = (state_31876[(11)]);
var inst_31839 = (state_31876[(13)]);
var inst_31831 = (state_31876[(7)]);
var inst_31838__$1 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31834) : f.call(null, inst_31834));
var inst_31839__$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31838__$1,inst_31831);
var state_31876__$1 = (function (){var statearr_31919 = state_31876;
(statearr_31919[(11)] = inst_31838__$1);

(statearr_31919[(13)] = inst_31839__$1);

return statearr_31919;
})();
if(inst_31839__$1){
var statearr_31920_33375 = state_31876__$1;
(statearr_31920_33375[(1)] = (8));

} else {
var statearr_31921_33376 = state_31876__$1;
(statearr_31921_33376[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (14))){
var inst_31834 = (state_31876[(9)]);
var inst_31838 = (state_31876[(11)]);
var inst_31851 = (state_31876[(2)]);
var inst_31852 = [];
var inst_31853 = inst_31852.push(inst_31834);
var inst_31830 = inst_31852;
var inst_31831 = inst_31838;
var state_31876__$1 = (function (){var statearr_31922 = state_31876;
(statearr_31922[(14)] = inst_31851);

(statearr_31922[(7)] = inst_31831);

(statearr_31922[(15)] = inst_31853);

(statearr_31922[(8)] = inst_31830);

return statearr_31922;
})();
var statearr_31923_33380 = state_31876__$1;
(statearr_31923_33380[(2)] = null);

(statearr_31923_33380[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (16))){
var state_31876__$1 = state_31876;
var statearr_31924_33381 = state_31876__$1;
(statearr_31924_33381[(2)] = null);

(statearr_31924_33381[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (10))){
var inst_31844 = (state_31876[(2)]);
var state_31876__$1 = state_31876;
if(cljs.core.truth_(inst_31844)){
var statearr_31925_33385 = state_31876__$1;
(statearr_31925_33385[(1)] = (11));

} else {
var statearr_31926_33386 = state_31876__$1;
(statearr_31926_33386[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (18))){
var inst_31863 = (state_31876[(2)]);
var state_31876__$1 = state_31876;
var statearr_31927_33387 = state_31876__$1;
(statearr_31927_33387[(2)] = inst_31863);

(statearr_31927_33387[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31877 === (8))){
var inst_31839 = (state_31876[(13)]);
var state_31876__$1 = state_31876;
var statearr_31928_33388 = state_31876__$1;
(statearr_31928_33388[(2)] = inst_31839);

(statearr_31928_33388[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
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
}
}
}
}
}
}
}
});
return (function() {
var cljs$core$async$state_machine__28413__auto__ = null;
var cljs$core$async$state_machine__28413__auto____0 = (function (){
var statearr_31929 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31929[(0)] = cljs$core$async$state_machine__28413__auto__);

(statearr_31929[(1)] = (1));

return statearr_31929;
});
var cljs$core$async$state_machine__28413__auto____1 = (function (state_31876){
while(true){
var ret_value__28414__auto__ = (function (){try{while(true){
var result__28415__auto__ = switch__28412__auto__(state_31876);
if(cljs.core.keyword_identical_QMARK_(result__28415__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28415__auto__;
}
break;
}
}catch (e31930){var ex__28416__auto__ = e31930;
var statearr_31931_33389 = state_31876;
(statearr_31931_33389[(2)] = ex__28416__auto__);


if(cljs.core.seq((state_31876[(4)]))){
var statearr_31932_33390 = state_31876;
(statearr_31932_33390[(1)] = cljs.core.first((state_31876[(4)])));

} else {
throw ex__28416__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28414__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33391 = state_31876;
state_31876 = G__33391;
continue;
} else {
return ret_value__28414__auto__;
}
break;
}
});
cljs$core$async$state_machine__28413__auto__ = function(state_31876){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28413__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28413__auto____1.call(this,state_31876);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28413__auto____0;
cljs$core$async$state_machine__28413__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28413__auto____1;
return cljs$core$async$state_machine__28413__auto__;
})()
})();
var state__29284__auto__ = (function (){var statearr_31933 = f__29283__auto__();
(statearr_31933[(6)] = c__29282__auto___33337);

return statearr_31933;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29284__auto__);
}));


return out;
}));

(cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=cljs.core.async.js.map
