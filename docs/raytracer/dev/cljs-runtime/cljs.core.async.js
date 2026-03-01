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
cljs.core.async.t_cljs$core$async29304 = (function (f,blockable,meta29305){
this.f = f;
this.blockable = blockable;
this.meta29305 = meta29305;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29306,meta29305__$1){
var self__ = this;
var _29306__$1 = this;
return (new cljs.core.async.t_cljs$core$async29304(self__.f,self__.blockable,meta29305__$1));
}));

(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29306){
var self__ = this;
var _29306__$1 = this;
return self__.meta29305;
}));

(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
}));

(cljs.core.async.t_cljs$core$async29304.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
}));

(cljs.core.async.t_cljs$core$async29304.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"blockable","blockable",-28395259,null),new cljs.core.Symbol(null,"meta29305","meta29305",-268623104,null)], null);
}));

(cljs.core.async.t_cljs$core$async29304.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29304.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29304");

(cljs.core.async.t_cljs$core$async29304.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29304");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29304.
 */
cljs.core.async.__GT_t_cljs$core$async29304 = (function cljs$core$async$__GT_t_cljs$core$async29304(f,blockable,meta29305){
return (new cljs.core.async.t_cljs$core$async29304(f,blockable,meta29305));
});


cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var G__29286 = arguments.length;
switch (G__29286) {
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
return (new cljs.core.async.t_cljs$core$async29304(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
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
var G__29443 = arguments.length;
switch (G__29443) {
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
var G__29468 = arguments.length;
switch (G__29468) {
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
var G__29476 = arguments.length;
switch (G__29476) {
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
var G__29479 = arguments.length;
switch (G__29479) {
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
var n__5636__auto___31976 = n;
var x_31977 = (0);
while(true){
if((x_31977 < n__5636__auto___31976)){
(a[x_31977] = x_31977);

var G__31978 = (x_31977 + (1));
x_31977 = G__31978;
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
cljs.core.async.t_cljs$core$async29486 = (function (flag,meta29487){
this.flag = flag;
this.meta29487 = meta29487;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29488,meta29487__$1){
var self__ = this;
var _29488__$1 = this;
return (new cljs.core.async.t_cljs$core$async29486(self__.flag,meta29487__$1));
}));

(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29488){
var self__ = this;
var _29488__$1 = this;
return self__.meta29487;
}));

(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29486.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.flag,null);

return true;
}));

(cljs.core.async.t_cljs$core$async29486.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"meta29487","meta29487",1684984506,null)], null);
}));

(cljs.core.async.t_cljs$core$async29486.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29486.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29486");

(cljs.core.async.t_cljs$core$async29486.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29486");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29486.
 */
cljs.core.async.__GT_t_cljs$core$async29486 = (function cljs$core$async$__GT_t_cljs$core$async29486(flag,meta29487){
return (new cljs.core.async.t_cljs$core$async29486(flag,meta29487));
});


cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true);
return (new cljs.core.async.t_cljs$core$async29486(flag,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async29492 = (function (flag,cb,meta29493){
this.flag = flag;
this.cb = cb;
this.meta29493 = meta29493;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29494,meta29493__$1){
var self__ = this;
var _29494__$1 = this;
return (new cljs.core.async.t_cljs$core$async29492(self__.flag,self__.cb,meta29493__$1));
}));

(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29494){
var self__ = this;
var _29494__$1 = this;
return self__.meta29493;
}));

(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29492.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit(self__.flag);

return self__.cb;
}));

(cljs.core.async.t_cljs$core$async29492.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null),new cljs.core.Symbol(null,"meta29493","meta29493",-1054299505,null)], null);
}));

(cljs.core.async.t_cljs$core$async29492.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29492.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29492");

(cljs.core.async.t_cljs$core$async29492.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29492");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29492.
 */
cljs.core.async.__GT_t_cljs$core$async29492 = (function cljs$core$async$__GT_t_cljs$core$async29492(flag,cb,meta29493){
return (new cljs.core.async.t_cljs$core$async29492(flag,cb,meta29493));
});


cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
return (new cljs.core.async.t_cljs$core$async29492(flag,cb,cljs.core.PersistentArrayMap.EMPTY));
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
return (function (p1__29502_SHARP_){
var G__29509 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29502_SHARP_,wport], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29509) : fret.call(null, G__29509));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.alt_handler(flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__29503_SHARP_){
var G__29510 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29503_SHARP_,port], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29510) : fret.call(null, G__29510));
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
var len__5769__auto___31998 = arguments.length;
var i__5770__auto___32001 = (0);
while(true){
if((i__5770__auto___32001 < len__5769__auto___31998)){
args__5775__auto__.push((arguments[i__5770__auto___32001]));

var G__32005 = (i__5770__auto___32001 + (1));
i__5770__auto___32001 = G__32005;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__29515){
var map__29516 = p__29515;
var map__29516__$1 = cljs.core.__destructure_map(map__29516);
var opts = map__29516__$1;
throw (new Error("alts! used not in (go ...) block"));
}));

(cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq29512){
var G__29513 = cljs.core.first(seq29512);
var seq29512__$1 = cljs.core.next(seq29512);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__29513,seq29512__$1);
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
var G__29523 = arguments.length;
switch (G__29523) {
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
var c__29157__auto___32030 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_29554){
var state_val_29556 = (state_29554[(1)]);
if((state_val_29556 === (7))){
var inst_29546 = (state_29554[(2)]);
var state_29554__$1 = state_29554;
var statearr_29558_32031 = state_29554__$1;
(statearr_29558_32031[(2)] = inst_29546);

(statearr_29558_32031[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (1))){
var state_29554__$1 = state_29554;
var statearr_29560_32032 = state_29554__$1;
(statearr_29560_32032[(2)] = null);

(statearr_29560_32032[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (4))){
var inst_29527 = (state_29554[(7)]);
var inst_29527__$1 = (state_29554[(2)]);
var inst_29530 = (inst_29527__$1 == null);
var state_29554__$1 = (function (){var statearr_29562 = state_29554;
(statearr_29562[(7)] = inst_29527__$1);

return statearr_29562;
})();
if(cljs.core.truth_(inst_29530)){
var statearr_29567_32040 = state_29554__$1;
(statearr_29567_32040[(1)] = (5));

} else {
var statearr_29568_32041 = state_29554__$1;
(statearr_29568_32041[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (13))){
var state_29554__$1 = state_29554;
var statearr_29569_32042 = state_29554__$1;
(statearr_29569_32042[(2)] = null);

(statearr_29569_32042[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (6))){
var inst_29527 = (state_29554[(7)]);
var state_29554__$1 = state_29554;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29554__$1,(11),to,inst_29527);
} else {
if((state_val_29556 === (3))){
var inst_29548 = (state_29554[(2)]);
var state_29554__$1 = state_29554;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29554__$1,inst_29548);
} else {
if((state_val_29556 === (12))){
var state_29554__$1 = state_29554;
var statearr_29570_32046 = state_29554__$1;
(statearr_29570_32046[(2)] = null);

(statearr_29570_32046[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (2))){
var state_29554__$1 = state_29554;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29554__$1,(4),from);
} else {
if((state_val_29556 === (11))){
var inst_29539 = (state_29554[(2)]);
var state_29554__$1 = state_29554;
if(cljs.core.truth_(inst_29539)){
var statearr_29572_32048 = state_29554__$1;
(statearr_29572_32048[(1)] = (12));

} else {
var statearr_29573_32049 = state_29554__$1;
(statearr_29573_32049[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (9))){
var state_29554__$1 = state_29554;
var statearr_29574_32050 = state_29554__$1;
(statearr_29574_32050[(2)] = null);

(statearr_29574_32050[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (5))){
var state_29554__$1 = state_29554;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29575_32051 = state_29554__$1;
(statearr_29575_32051[(1)] = (8));

} else {
var statearr_29576_32052 = state_29554__$1;
(statearr_29576_32052[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (14))){
var inst_29544 = (state_29554[(2)]);
var state_29554__$1 = state_29554;
var statearr_29577_32054 = state_29554__$1;
(statearr_29577_32054[(2)] = inst_29544);

(statearr_29577_32054[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (10))){
var inst_29536 = (state_29554[(2)]);
var state_29554__$1 = state_29554;
var statearr_29578_32055 = state_29554__$1;
(statearr_29578_32055[(2)] = inst_29536);

(statearr_29578_32055[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29556 === (8))){
var inst_29533 = cljs.core.async.close_BANG_(to);
var state_29554__$1 = state_29554;
var statearr_29579_32056 = state_29554__$1;
(statearr_29579_32056[(2)] = inst_29533);

(statearr_29579_32056[(1)] = (10));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_29581 = [null,null,null,null,null,null,null,null];
(statearr_29581[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_29581[(1)] = (1));

return statearr_29581;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_29554){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29554);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29582){var ex__28381__auto__ = e29582;
var statearr_29583_32058 = state_29554;
(statearr_29583_32058[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29554[(4)]))){
var statearr_29584_32059 = state_29554;
(statearr_29584_32059[(1)] = cljs.core.first((state_29554[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32060 = state_29554;
state_29554 = G__32060;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_29554){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_29554);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_29585 = f__29158__auto__();
(statearr_29585[(6)] = c__29157__auto___32030);

return statearr_29585;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var process__$1 = (function (p__29591){
var vec__29592 = p__29591;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29592,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29592,(1),null);
var job = vec__29592;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((1),xf,ex_handler);
var c__29157__auto___32061 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_29600){
var state_val_29601 = (state_29600[(1)]);
if((state_val_29601 === (1))){
var state_29600__$1 = state_29600;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29600__$1,(2),res,v);
} else {
if((state_val_29601 === (2))){
var inst_29597 = (state_29600[(2)]);
var inst_29598 = cljs.core.async.close_BANG_(res);
var state_29600__$1 = (function (){var statearr_29602 = state_29600;
(statearr_29602[(7)] = inst_29597);

return statearr_29602;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_29600__$1,inst_29598);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29603 = [null,null,null,null,null,null,null,null];
(statearr_29603[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29603[(1)] = (1));

return statearr_29603;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29600){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29600);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29604){var ex__28381__auto__ = e29604;
var statearr_29606_32063 = state_29600;
(statearr_29606_32063[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29600[(4)]))){
var statearr_29607_32064 = state_29600;
(statearr_29607_32064[(1)] = cljs.core.first((state_29600[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32068 = state_29600;
state_29600 = G__32068;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29600){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29600);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_29609 = f__29158__auto__();
(statearr_29609[(6)] = c__29157__auto___32061);

return statearr_29609;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));


cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});
var async = (function (p__29610){
var vec__29611 = p__29610;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29611,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29611,(1),null);
var job = vec__29611;
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
var n__5636__auto___32071 = n;
var __32072 = (0);
while(true){
if((__32072 < n__5636__auto___32071)){
var G__29619_32073 = type;
var G__29619_32074__$1 = (((G__29619_32073 instanceof cljs.core.Keyword))?G__29619_32073.fqn:null);
switch (G__29619_32074__$1) {
case "compute":
var c__29157__auto___32076 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32072,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = ((function (__32072,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function (state_29633){
var state_val_29634 = (state_29633[(1)]);
if((state_val_29634 === (1))){
var state_29633__$1 = state_29633;
var statearr_29635_32077 = state_29633__$1;
(statearr_29635_32077[(2)] = null);

(statearr_29635_32077[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29634 === (2))){
var state_29633__$1 = state_29633;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29633__$1,(4),jobs);
} else {
if((state_val_29634 === (3))){
var inst_29631 = (state_29633[(2)]);
var state_29633__$1 = state_29633;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29633__$1,inst_29631);
} else {
if((state_val_29634 === (4))){
var inst_29623 = (state_29633[(2)]);
var inst_29624 = process__$1(inst_29623);
var state_29633__$1 = state_29633;
if(cljs.core.truth_(inst_29624)){
var statearr_29637_32079 = state_29633__$1;
(statearr_29637_32079[(1)] = (5));

} else {
var statearr_29639_32080 = state_29633__$1;
(statearr_29639_32080[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29634 === (5))){
var state_29633__$1 = state_29633;
var statearr_29644_32084 = state_29633__$1;
(statearr_29644_32084[(2)] = null);

(statearr_29644_32084[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29634 === (6))){
var state_29633__$1 = state_29633;
var statearr_29645_32085 = state_29633__$1;
(statearr_29645_32085[(2)] = null);

(statearr_29645_32085[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29634 === (7))){
var inst_29629 = (state_29633[(2)]);
var state_29633__$1 = state_29633;
var statearr_29646_32088 = state_29633__$1;
(statearr_29646_32088[(2)] = inst_29629);

(statearr_29646_32088[(1)] = (3));


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
});})(__32072,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
;
return ((function (__32072,switch__28377__auto__,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29647 = [null,null,null,null,null,null,null];
(statearr_29647[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29647[(1)] = (1));

return statearr_29647;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29633){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29633);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29648){var ex__28381__auto__ = e29648;
var statearr_29649_32090 = state_29633;
(statearr_29649_32090[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29633[(4)]))){
var statearr_29650_32091 = state_29633;
(statearr_29650_32091[(1)] = cljs.core.first((state_29633[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32093 = state_29633;
state_29633 = G__32093;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29633){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29633);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
;})(__32072,switch__28377__auto__,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
})();
var state__29159__auto__ = (function (){var statearr_29651 = f__29158__auto__();
(statearr_29651[(6)] = c__29157__auto___32076);

return statearr_29651;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
});})(__32072,c__29157__auto___32076,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
);


break;
case "async":
var c__29157__auto___32095 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32072,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = ((function (__32072,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function (state_29665){
var state_val_29666 = (state_29665[(1)]);
if((state_val_29666 === (1))){
var state_29665__$1 = state_29665;
var statearr_29667_32096 = state_29665__$1;
(statearr_29667_32096[(2)] = null);

(statearr_29667_32096[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29666 === (2))){
var state_29665__$1 = state_29665;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29665__$1,(4),jobs);
} else {
if((state_val_29666 === (3))){
var inst_29663 = (state_29665[(2)]);
var state_29665__$1 = state_29665;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29665__$1,inst_29663);
} else {
if((state_val_29666 === (4))){
var inst_29655 = (state_29665[(2)]);
var inst_29656 = async(inst_29655);
var state_29665__$1 = state_29665;
if(cljs.core.truth_(inst_29656)){
var statearr_29670_32097 = state_29665__$1;
(statearr_29670_32097[(1)] = (5));

} else {
var statearr_29671_32098 = state_29665__$1;
(statearr_29671_32098[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29666 === (5))){
var state_29665__$1 = state_29665;
var statearr_29672_32099 = state_29665__$1;
(statearr_29672_32099[(2)] = null);

(statearr_29672_32099[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29666 === (6))){
var state_29665__$1 = state_29665;
var statearr_29673_32100 = state_29665__$1;
(statearr_29673_32100[(2)] = null);

(statearr_29673_32100[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29666 === (7))){
var inst_29661 = (state_29665[(2)]);
var state_29665__$1 = state_29665;
var statearr_29674_32101 = state_29665__$1;
(statearr_29674_32101[(2)] = inst_29661);

(statearr_29674_32101[(1)] = (3));


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
});})(__32072,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
;
return ((function (__32072,switch__28377__auto__,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29676 = [null,null,null,null,null,null,null];
(statearr_29676[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29676[(1)] = (1));

return statearr_29676;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29665){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29665);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29680){var ex__28381__auto__ = e29680;
var statearr_29681_32103 = state_29665;
(statearr_29681_32103[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29665[(4)]))){
var statearr_29682_32104 = state_29665;
(statearr_29682_32104[(1)] = cljs.core.first((state_29665[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32107 = state_29665;
state_29665 = G__32107;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29665){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29665);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
;})(__32072,switch__28377__auto__,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
})();
var state__29159__auto__ = (function (){var statearr_29683 = f__29158__auto__();
(statearr_29683[(6)] = c__29157__auto___32095);

return statearr_29683;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
});})(__32072,c__29157__auto___32095,G__29619_32073,G__29619_32074__$1,n__5636__auto___32071,jobs,results,process__$1,async))
);


break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29619_32074__$1)].join('')));

}

var G__32108 = (__32072 + (1));
__32072 = G__32108;
continue;
} else {
}
break;
}

var c__29157__auto___32109 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_29707){
var state_val_29708 = (state_29707[(1)]);
if((state_val_29708 === (7))){
var inst_29703 = (state_29707[(2)]);
var state_29707__$1 = state_29707;
var statearr_29710_32110 = state_29707__$1;
(statearr_29710_32110[(2)] = inst_29703);

(statearr_29710_32110[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29708 === (1))){
var state_29707__$1 = state_29707;
var statearr_29711_32112 = state_29707__$1;
(statearr_29711_32112[(2)] = null);

(statearr_29711_32112[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29708 === (4))){
var inst_29688 = (state_29707[(7)]);
var inst_29688__$1 = (state_29707[(2)]);
var inst_29689 = (inst_29688__$1 == null);
var state_29707__$1 = (function (){var statearr_29712 = state_29707;
(statearr_29712[(7)] = inst_29688__$1);

return statearr_29712;
})();
if(cljs.core.truth_(inst_29689)){
var statearr_29713_32115 = state_29707__$1;
(statearr_29713_32115[(1)] = (5));

} else {
var statearr_29714_32116 = state_29707__$1;
(statearr_29714_32116[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29708 === (6))){
var inst_29693 = (state_29707[(8)]);
var inst_29688 = (state_29707[(7)]);
var inst_29693__$1 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var inst_29694 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_29695 = [inst_29688,inst_29693__$1];
var inst_29696 = (new cljs.core.PersistentVector(null,2,(5),inst_29694,inst_29695,null));
var state_29707__$1 = (function (){var statearr_29715 = state_29707;
(statearr_29715[(8)] = inst_29693__$1);

return statearr_29715;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29707__$1,(8),jobs,inst_29696);
} else {
if((state_val_29708 === (3))){
var inst_29705 = (state_29707[(2)]);
var state_29707__$1 = state_29707;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29707__$1,inst_29705);
} else {
if((state_val_29708 === (2))){
var state_29707__$1 = state_29707;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29707__$1,(4),from);
} else {
if((state_val_29708 === (9))){
var inst_29700 = (state_29707[(2)]);
var state_29707__$1 = (function (){var statearr_29721 = state_29707;
(statearr_29721[(9)] = inst_29700);

return statearr_29721;
})();
var statearr_29722_32121 = state_29707__$1;
(statearr_29722_32121[(2)] = null);

(statearr_29722_32121[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29708 === (5))){
var inst_29691 = cljs.core.async.close_BANG_(jobs);
var state_29707__$1 = state_29707;
var statearr_29723_32122 = state_29707__$1;
(statearr_29723_32122[(2)] = inst_29691);

(statearr_29723_32122[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29708 === (8))){
var inst_29693 = (state_29707[(8)]);
var inst_29698 = (state_29707[(2)]);
var state_29707__$1 = (function (){var statearr_29724 = state_29707;
(statearr_29724[(10)] = inst_29698);

return statearr_29724;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29707__$1,(9),results,inst_29693);
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
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29727 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_29727[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29727[(1)] = (1));

return statearr_29727;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29707){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29707);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29729){var ex__28381__auto__ = e29729;
var statearr_29730_32123 = state_29707;
(statearr_29730_32123[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29707[(4)]))){
var statearr_29732_32124 = state_29707;
(statearr_29732_32124[(1)] = cljs.core.first((state_29707[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32125 = state_29707;
state_29707 = G__32125;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29707){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29707);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_29736 = f__29158__auto__();
(statearr_29736[(6)] = c__29157__auto___32109);

return statearr_29736;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));


var c__29157__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_29774){
var state_val_29775 = (state_29774[(1)]);
if((state_val_29775 === (7))){
var inst_29770 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
var statearr_29776_32126 = state_29774__$1;
(statearr_29776_32126[(2)] = inst_29770);

(statearr_29776_32126[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (20))){
var state_29774__$1 = state_29774;
var statearr_29777_32127 = state_29774__$1;
(statearr_29777_32127[(2)] = null);

(statearr_29777_32127[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (1))){
var state_29774__$1 = state_29774;
var statearr_29778_32131 = state_29774__$1;
(statearr_29778_32131[(2)] = null);

(statearr_29778_32131[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (4))){
var inst_29739 = (state_29774[(7)]);
var inst_29739__$1 = (state_29774[(2)]);
var inst_29740 = (inst_29739__$1 == null);
var state_29774__$1 = (function (){var statearr_29781 = state_29774;
(statearr_29781[(7)] = inst_29739__$1);

return statearr_29781;
})();
if(cljs.core.truth_(inst_29740)){
var statearr_29783_32132 = state_29774__$1;
(statearr_29783_32132[(1)] = (5));

} else {
var statearr_29784_32133 = state_29774__$1;
(statearr_29784_32133[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (15))){
var inst_29752 = (state_29774[(8)]);
var state_29774__$1 = state_29774;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29774__$1,(18),to,inst_29752);
} else {
if((state_val_29775 === (21))){
var inst_29765 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
var statearr_29785_32140 = state_29774__$1;
(statearr_29785_32140[(2)] = inst_29765);

(statearr_29785_32140[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (13))){
var inst_29767 = (state_29774[(2)]);
var state_29774__$1 = (function (){var statearr_29789 = state_29774;
(statearr_29789[(9)] = inst_29767);

return statearr_29789;
})();
var statearr_29790_32141 = state_29774__$1;
(statearr_29790_32141[(2)] = null);

(statearr_29790_32141[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (6))){
var inst_29739 = (state_29774[(7)]);
var state_29774__$1 = state_29774;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29774__$1,(11),inst_29739);
} else {
if((state_val_29775 === (17))){
var inst_29760 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
if(cljs.core.truth_(inst_29760)){
var statearr_29794_32146 = state_29774__$1;
(statearr_29794_32146[(1)] = (19));

} else {
var statearr_29795_32147 = state_29774__$1;
(statearr_29795_32147[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (3))){
var inst_29772 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29774__$1,inst_29772);
} else {
if((state_val_29775 === (12))){
var inst_29749 = (state_29774[(10)]);
var state_29774__$1 = state_29774;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29774__$1,(14),inst_29749);
} else {
if((state_val_29775 === (2))){
var state_29774__$1 = state_29774;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29774__$1,(4),results);
} else {
if((state_val_29775 === (19))){
var state_29774__$1 = state_29774;
var statearr_29796_32148 = state_29774__$1;
(statearr_29796_32148[(2)] = null);

(statearr_29796_32148[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (11))){
var inst_29749 = (state_29774[(2)]);
var state_29774__$1 = (function (){var statearr_29798 = state_29774;
(statearr_29798[(10)] = inst_29749);

return statearr_29798;
})();
var statearr_29800_32153 = state_29774__$1;
(statearr_29800_32153[(2)] = null);

(statearr_29800_32153[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (9))){
var state_29774__$1 = state_29774;
var statearr_29805_32154 = state_29774__$1;
(statearr_29805_32154[(2)] = null);

(statearr_29805_32154[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (5))){
var state_29774__$1 = state_29774;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29808_32159 = state_29774__$1;
(statearr_29808_32159[(1)] = (8));

} else {
var statearr_29809_32160 = state_29774__$1;
(statearr_29809_32160[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (14))){
var inst_29752 = (state_29774[(8)]);
var inst_29754 = (state_29774[(11)]);
var inst_29752__$1 = (state_29774[(2)]);
var inst_29753 = (inst_29752__$1 == null);
var inst_29754__$1 = cljs.core.not(inst_29753);
var state_29774__$1 = (function (){var statearr_29811 = state_29774;
(statearr_29811[(8)] = inst_29752__$1);

(statearr_29811[(11)] = inst_29754__$1);

return statearr_29811;
})();
if(inst_29754__$1){
var statearr_29815_32161 = state_29774__$1;
(statearr_29815_32161[(1)] = (15));

} else {
var statearr_29816_32162 = state_29774__$1;
(statearr_29816_32162[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (16))){
var inst_29754 = (state_29774[(11)]);
var state_29774__$1 = state_29774;
var statearr_29817_32163 = state_29774__$1;
(statearr_29817_32163[(2)] = inst_29754);

(statearr_29817_32163[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (10))){
var inst_29746 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
var statearr_29819_32164 = state_29774__$1;
(statearr_29819_32164[(2)] = inst_29746);

(statearr_29819_32164[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (18))){
var inst_29757 = (state_29774[(2)]);
var state_29774__$1 = state_29774;
var statearr_29822_32165 = state_29774__$1;
(statearr_29822_32165[(2)] = inst_29757);

(statearr_29822_32165[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29775 === (8))){
var inst_29743 = cljs.core.async.close_BANG_(to);
var state_29774__$1 = state_29774;
var statearr_29824_32166 = state_29774__$1;
(statearr_29824_32166[(2)] = inst_29743);

(statearr_29824_32166[(1)] = (10));


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
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29829 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_29829[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29829[(1)] = (1));

return statearr_29829;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29774){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29774);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29830){var ex__28381__auto__ = e29830;
var statearr_29832_32170 = state_29774;
(statearr_29832_32170[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29774[(4)]))){
var statearr_29834_32171 = state_29774;
(statearr_29834_32171[(1)] = cljs.core.first((state_29774[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32172 = state_29774;
state_29774 = G__32172;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29774){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29774);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_29838 = f__29158__auto__();
(statearr_29838[(6)] = c__29157__auto__);

return statearr_29838;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));

return c__29157__auto__;
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
var G__29848 = arguments.length;
switch (G__29848) {
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
var G__29861 = arguments.length;
switch (G__29861) {
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
var G__29878 = arguments.length;
switch (G__29878) {
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
var c__29157__auto___32184 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_29912){
var state_val_29913 = (state_29912[(1)]);
if((state_val_29913 === (7))){
var inst_29907 = (state_29912[(2)]);
var state_29912__$1 = state_29912;
var statearr_29916_32185 = state_29912__$1;
(statearr_29916_32185[(2)] = inst_29907);

(statearr_29916_32185[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (1))){
var state_29912__$1 = state_29912;
var statearr_29921_32189 = state_29912__$1;
(statearr_29921_32189[(2)] = null);

(statearr_29921_32189[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (4))){
var inst_29887 = (state_29912[(7)]);
var inst_29887__$1 = (state_29912[(2)]);
var inst_29888 = (inst_29887__$1 == null);
var state_29912__$1 = (function (){var statearr_29922 = state_29912;
(statearr_29922[(7)] = inst_29887__$1);

return statearr_29922;
})();
if(cljs.core.truth_(inst_29888)){
var statearr_29924_32195 = state_29912__$1;
(statearr_29924_32195[(1)] = (5));

} else {
var statearr_29925_32196 = state_29912__$1;
(statearr_29925_32196[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (13))){
var state_29912__$1 = state_29912;
var statearr_29928_32197 = state_29912__$1;
(statearr_29928_32197[(2)] = null);

(statearr_29928_32197[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (6))){
var inst_29887 = (state_29912[(7)]);
var inst_29893 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_29887) : p.call(null, inst_29887));
var state_29912__$1 = state_29912;
if(cljs.core.truth_(inst_29893)){
var statearr_29931_32199 = state_29912__$1;
(statearr_29931_32199[(1)] = (9));

} else {
var statearr_29933_32200 = state_29912__$1;
(statearr_29933_32200[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (3))){
var inst_29909 = (state_29912[(2)]);
var state_29912__$1 = state_29912;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29912__$1,inst_29909);
} else {
if((state_val_29913 === (12))){
var state_29912__$1 = state_29912;
var statearr_29937_32204 = state_29912__$1;
(statearr_29937_32204[(2)] = null);

(statearr_29937_32204[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (2))){
var state_29912__$1 = state_29912;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29912__$1,(4),ch);
} else {
if((state_val_29913 === (11))){
var inst_29887 = (state_29912[(7)]);
var inst_29897 = (state_29912[(2)]);
var state_29912__$1 = state_29912;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29912__$1,(8),inst_29897,inst_29887);
} else {
if((state_val_29913 === (9))){
var state_29912__$1 = state_29912;
var statearr_29943_32206 = state_29912__$1;
(statearr_29943_32206[(2)] = tc);

(statearr_29943_32206[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (5))){
var inst_29890 = cljs.core.async.close_BANG_(tc);
var inst_29891 = cljs.core.async.close_BANG_(fc);
var state_29912__$1 = (function (){var statearr_29947 = state_29912;
(statearr_29947[(8)] = inst_29890);

return statearr_29947;
})();
var statearr_29948_32207 = state_29912__$1;
(statearr_29948_32207[(2)] = inst_29891);

(statearr_29948_32207[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (14))){
var inst_29905 = (state_29912[(2)]);
var state_29912__$1 = state_29912;
var statearr_29950_32209 = state_29912__$1;
(statearr_29950_32209[(2)] = inst_29905);

(statearr_29950_32209[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (10))){
var state_29912__$1 = state_29912;
var statearr_29953_32214 = state_29912__$1;
(statearr_29953_32214[(2)] = fc);

(statearr_29953_32214[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29913 === (8))){
var inst_29899 = (state_29912[(2)]);
var state_29912__$1 = state_29912;
if(cljs.core.truth_(inst_29899)){
var statearr_29955_32215 = state_29912__$1;
(statearr_29955_32215[(1)] = (12));

} else {
var statearr_29957_32216 = state_29912__$1;
(statearr_29957_32216[(1)] = (13));

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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_29962 = [null,null,null,null,null,null,null,null,null];
(statearr_29962[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_29962[(1)] = (1));

return statearr_29962;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_29912){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29912);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29963){var ex__28381__auto__ = e29963;
var statearr_29964_32218 = state_29912;
(statearr_29964_32218[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29912[(4)]))){
var statearr_29966_32219 = state_29912;
(statearr_29966_32219[(1)] = cljs.core.first((state_29912[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32220 = state_29912;
state_29912 = G__32220;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_29912){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_29912);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_29970 = f__29158__auto__();
(statearr_29970[(6)] = c__29157__auto___32184);

return statearr_29970;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var c__29157__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30001){
var state_val_30003 = (state_30001[(1)]);
if((state_val_30003 === (7))){
var inst_29997 = (state_30001[(2)]);
var state_30001__$1 = state_30001;
var statearr_30009_32226 = state_30001__$1;
(statearr_30009_32226[(2)] = inst_29997);

(statearr_30009_32226[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (1))){
var inst_29979 = init;
var inst_29980 = inst_29979;
var state_30001__$1 = (function (){var statearr_30013 = state_30001;
(statearr_30013[(7)] = inst_29980);

return statearr_30013;
})();
var statearr_30017_32231 = state_30001__$1;
(statearr_30017_32231[(2)] = null);

(statearr_30017_32231[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (4))){
var inst_29983 = (state_30001[(8)]);
var inst_29983__$1 = (state_30001[(2)]);
var inst_29985 = (inst_29983__$1 == null);
var state_30001__$1 = (function (){var statearr_30019 = state_30001;
(statearr_30019[(8)] = inst_29983__$1);

return statearr_30019;
})();
if(cljs.core.truth_(inst_29985)){
var statearr_30020_32233 = state_30001__$1;
(statearr_30020_32233[(1)] = (5));

} else {
var statearr_30023_32234 = state_30001__$1;
(statearr_30023_32234[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (6))){
var inst_29980 = (state_30001[(7)]);
var inst_29988 = (state_30001[(9)]);
var inst_29983 = (state_30001[(8)]);
var inst_29988__$1 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(inst_29980,inst_29983) : f.call(null, inst_29980,inst_29983));
var inst_29989 = cljs.core.reduced_QMARK_(inst_29988__$1);
var state_30001__$1 = (function (){var statearr_30025 = state_30001;
(statearr_30025[(9)] = inst_29988__$1);

return statearr_30025;
})();
if(inst_29989){
var statearr_30027_32239 = state_30001__$1;
(statearr_30027_32239[(1)] = (8));

} else {
var statearr_30028_32240 = state_30001__$1;
(statearr_30028_32240[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (3))){
var inst_29999 = (state_30001[(2)]);
var state_30001__$1 = state_30001;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30001__$1,inst_29999);
} else {
if((state_val_30003 === (2))){
var state_30001__$1 = state_30001;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30001__$1,(4),ch);
} else {
if((state_val_30003 === (9))){
var inst_29988 = (state_30001[(9)]);
var inst_29980 = inst_29988;
var state_30001__$1 = (function (){var statearr_30033 = state_30001;
(statearr_30033[(7)] = inst_29980);

return statearr_30033;
})();
var statearr_30034_32245 = state_30001__$1;
(statearr_30034_32245[(2)] = null);

(statearr_30034_32245[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (5))){
var inst_29980 = (state_30001[(7)]);
var state_30001__$1 = state_30001;
var statearr_30037_32246 = state_30001__$1;
(statearr_30037_32246[(2)] = inst_29980);

(statearr_30037_32246[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (10))){
var inst_29995 = (state_30001[(2)]);
var state_30001__$1 = state_30001;
var statearr_30039_32249 = state_30001__$1;
(statearr_30039_32249[(2)] = inst_29995);

(statearr_30039_32249[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30003 === (8))){
var inst_29988 = (state_30001[(9)]);
var inst_29991 = cljs.core.deref(inst_29988);
var state_30001__$1 = state_30001;
var statearr_30041_32254 = state_30001__$1;
(statearr_30041_32254[(2)] = inst_29991);

(statearr_30041_32254[(1)] = (10));


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
var cljs$core$async$reduce_$_state_machine__28378__auto__ = null;
var cljs$core$async$reduce_$_state_machine__28378__auto____0 = (function (){
var statearr_30048 = [null,null,null,null,null,null,null,null,null,null];
(statearr_30048[(0)] = cljs$core$async$reduce_$_state_machine__28378__auto__);

(statearr_30048[(1)] = (1));

return statearr_30048;
});
var cljs$core$async$reduce_$_state_machine__28378__auto____1 = (function (state_30001){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30001);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30049){var ex__28381__auto__ = e30049;
var statearr_30051_32257 = state_30001;
(statearr_30051_32257[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30001[(4)]))){
var statearr_30052_32262 = state_30001;
(statearr_30052_32262[(1)] = cljs.core.first((state_30001[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32265 = state_30001;
state_30001 = G__32265;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__28378__auto__ = function(state_30001){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__28378__auto____1.call(this,state_30001);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__28378__auto____0;
cljs$core$async$reduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__28378__auto____1;
return cljs$core$async$reduce_$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_30056 = f__29158__auto__();
(statearr_30056[(6)] = c__29157__auto__);

return statearr_30056;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));

return c__29157__auto__;
});
/**
 * async/reduces a channel with a transformation (xform f).
 *   Returns a channel containing the result.  ch must close before
 *   transduce produces a result.
 */
cljs.core.async.transduce = (function cljs$core$async$transduce(xform,f,init,ch){
var f__$1 = (xform.cljs$core$IFn$_invoke$arity$1 ? xform.cljs$core$IFn$_invoke$arity$1(f) : xform.call(null, f));
var c__29157__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30068){
var state_val_30069 = (state_30068[(1)]);
if((state_val_30069 === (1))){
var inst_30061 = cljs.core.async.reduce(f__$1,init,ch);
var state_30068__$1 = state_30068;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30068__$1,(2),inst_30061);
} else {
if((state_val_30069 === (2))){
var inst_30064 = (state_30068[(2)]);
var inst_30065 = (f__$1.cljs$core$IFn$_invoke$arity$1 ? f__$1.cljs$core$IFn$_invoke$arity$1(inst_30064) : f__$1.call(null, inst_30064));
var state_30068__$1 = state_30068;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30068__$1,inst_30065);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$transduce_$_state_machine__28378__auto__ = null;
var cljs$core$async$transduce_$_state_machine__28378__auto____0 = (function (){
var statearr_30081 = [null,null,null,null,null,null,null];
(statearr_30081[(0)] = cljs$core$async$transduce_$_state_machine__28378__auto__);

(statearr_30081[(1)] = (1));

return statearr_30081;
});
var cljs$core$async$transduce_$_state_machine__28378__auto____1 = (function (state_30068){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30068);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30083){var ex__28381__auto__ = e30083;
var statearr_30084_32275 = state_30068;
(statearr_30084_32275[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30068[(4)]))){
var statearr_30086_32280 = state_30068;
(statearr_30086_32280[(1)] = cljs.core.first((state_30068[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32281 = state_30068;
state_30068 = G__32281;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$transduce_$_state_machine__28378__auto__ = function(state_30068){
switch(arguments.length){
case 0:
return cljs$core$async$transduce_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$transduce_$_state_machine__28378__auto____1.call(this,state_30068);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$transduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$transduce_$_state_machine__28378__auto____0;
cljs$core$async$transduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$transduce_$_state_machine__28378__auto____1;
return cljs$core$async$transduce_$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_30090 = f__29158__auto__();
(statearr_30090[(6)] = c__29157__auto__);

return statearr_30090;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));

return c__29157__auto__;
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
var G__30096 = arguments.length;
switch (G__30096) {
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
var c__29157__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30126){
var state_val_30127 = (state_30126[(1)]);
if((state_val_30127 === (7))){
var inst_30108 = (state_30126[(2)]);
var state_30126__$1 = state_30126;
var statearr_30132_32286 = state_30126__$1;
(statearr_30132_32286[(2)] = inst_30108);

(statearr_30132_32286[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (1))){
var inst_30101 = cljs.core.seq(coll);
var inst_30102 = inst_30101;
var state_30126__$1 = (function (){var statearr_30133 = state_30126;
(statearr_30133[(7)] = inst_30102);

return statearr_30133;
})();
var statearr_30135_32287 = state_30126__$1;
(statearr_30135_32287[(2)] = null);

(statearr_30135_32287[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (4))){
var inst_30102 = (state_30126[(7)]);
var inst_30106 = cljs.core.first(inst_30102);
var state_30126__$1 = state_30126;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30126__$1,(7),ch,inst_30106);
} else {
if((state_val_30127 === (13))){
var inst_30120 = (state_30126[(2)]);
var state_30126__$1 = state_30126;
var statearr_30139_32291 = state_30126__$1;
(statearr_30139_32291[(2)] = inst_30120);

(statearr_30139_32291[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (6))){
var inst_30111 = (state_30126[(2)]);
var state_30126__$1 = state_30126;
if(cljs.core.truth_(inst_30111)){
var statearr_30140_32292 = state_30126__$1;
(statearr_30140_32292[(1)] = (8));

} else {
var statearr_30144_32294 = state_30126__$1;
(statearr_30144_32294[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (3))){
var inst_30124 = (state_30126[(2)]);
var state_30126__$1 = state_30126;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30126__$1,inst_30124);
} else {
if((state_val_30127 === (12))){
var state_30126__$1 = state_30126;
var statearr_30146_32301 = state_30126__$1;
(statearr_30146_32301[(2)] = null);

(statearr_30146_32301[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (2))){
var inst_30102 = (state_30126[(7)]);
var state_30126__$1 = state_30126;
if(cljs.core.truth_(inst_30102)){
var statearr_30149_32302 = state_30126__$1;
(statearr_30149_32302[(1)] = (4));

} else {
var statearr_30151_32303 = state_30126__$1;
(statearr_30151_32303[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (11))){
var inst_30117 = cljs.core.async.close_BANG_(ch);
var state_30126__$1 = state_30126;
var statearr_30153_32304 = state_30126__$1;
(statearr_30153_32304[(2)] = inst_30117);

(statearr_30153_32304[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (9))){
var state_30126__$1 = state_30126;
if(cljs.core.truth_(close_QMARK_)){
var statearr_30159_32305 = state_30126__$1;
(statearr_30159_32305[(1)] = (11));

} else {
var statearr_30160_32306 = state_30126__$1;
(statearr_30160_32306[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (5))){
var inst_30102 = (state_30126[(7)]);
var state_30126__$1 = state_30126;
var statearr_30162_32307 = state_30126__$1;
(statearr_30162_32307[(2)] = inst_30102);

(statearr_30162_32307[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (10))){
var inst_30122 = (state_30126[(2)]);
var state_30126__$1 = state_30126;
var statearr_30165_32308 = state_30126__$1;
(statearr_30165_32308[(2)] = inst_30122);

(statearr_30165_32308[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30127 === (8))){
var inst_30102 = (state_30126[(7)]);
var inst_30113 = cljs.core.next(inst_30102);
var inst_30102__$1 = inst_30113;
var state_30126__$1 = (function (){var statearr_30167 = state_30126;
(statearr_30167[(7)] = inst_30102__$1);

return statearr_30167;
})();
var statearr_30169_32309 = state_30126__$1;
(statearr_30169_32309[(2)] = null);

(statearr_30169_32309[(1)] = (2));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_30173 = [null,null,null,null,null,null,null,null];
(statearr_30173[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_30173[(1)] = (1));

return statearr_30173;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_30126){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30126);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30178){var ex__28381__auto__ = e30178;
var statearr_30179_32313 = state_30126;
(statearr_30179_32313[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30126[(4)]))){
var statearr_30183_32314 = state_30126;
(statearr_30183_32314[(1)] = cljs.core.first((state_30126[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32319 = state_30126;
state_30126 = G__32319;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_30126){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_30126);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_30189 = f__29158__auto__();
(statearr_30189[(6)] = c__29157__auto__);

return statearr_30189;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));

return c__29157__auto__;
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
var G__30196 = arguments.length;
switch (G__30196) {
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

var cljs$core$async$Mux$muxch_STAR_$dyn_32327 = (function (_){
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
return cljs$core$async$Mux$muxch_STAR_$dyn_32327(_);
}
});


/**
 * @interface
 */
cljs.core.async.Mult = function(){};

var cljs$core$async$Mult$tap_STAR_$dyn_32354 = (function (m,ch,close_QMARK_){
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
return cljs$core$async$Mult$tap_STAR_$dyn_32354(m,ch,close_QMARK_);
}
});

var cljs$core$async$Mult$untap_STAR_$dyn_32355 = (function (m,ch){
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
return cljs$core$async$Mult$untap_STAR_$dyn_32355(m,ch);
}
});

var cljs$core$async$Mult$untap_all_STAR_$dyn_32363 = (function (m){
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
return cljs$core$async$Mult$untap_all_STAR_$dyn_32363(m);
}
});


/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30236 = (function (ch,cs,meta30237){
this.ch = ch;
this.cs = cs;
this.meta30237 = meta30237;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30238,meta30237__$1){
var self__ = this;
var _30238__$1 = this;
return (new cljs.core.async.t_cljs$core$async30236(self__.ch,self__.cs,meta30237__$1));
}));

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30238){
var self__ = this;
var _30238__$1 = this;
return self__.meta30237;
}));

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mult$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
}));

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch__$1);

return null;
}));

(cljs.core.async.t_cljs$core$async30236.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return null;
}));

(cljs.core.async.t_cljs$core$async30236.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"meta30237","meta30237",-1835710092,null)], null);
}));

(cljs.core.async.t_cljs$core$async30236.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30236.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30236");

(cljs.core.async.t_cljs$core$async30236.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30236");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30236.
 */
cljs.core.async.__GT_t_cljs$core$async30236 = (function cljs$core$async$__GT_t_cljs$core$async30236(ch,cs,meta30237){
return (new cljs.core.async.t_cljs$core$async30236(ch,cs,meta30237));
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
var m = (new cljs.core.async.t_cljs$core$async30236(ch,cs,cljs.core.PersistentArrayMap.EMPTY));
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var done = (function (_){
if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,true);
} else {
return null;
}
});
var c__29157__auto___32425 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30400){
var state_val_30401 = (state_30400[(1)]);
if((state_val_30401 === (7))){
var inst_30396 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30410_32426 = state_30400__$1;
(statearr_30410_32426[(2)] = inst_30396);

(statearr_30410_32426[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (20))){
var inst_30296 = (state_30400[(7)]);
var inst_30308 = cljs.core.first(inst_30296);
var inst_30309 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30308,(0),null);
var inst_30310 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30308,(1),null);
var state_30400__$1 = (function (){var statearr_30415 = state_30400;
(statearr_30415[(8)] = inst_30309);

return statearr_30415;
})();
if(cljs.core.truth_(inst_30310)){
var statearr_30419_32428 = state_30400__$1;
(statearr_30419_32428[(1)] = (22));

} else {
var statearr_30421_32429 = state_30400__$1;
(statearr_30421_32429[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (27))){
var inst_30344 = (state_30400[(9)]);
var inst_30342 = (state_30400[(10)]);
var inst_30261 = (state_30400[(11)]);
var inst_30349 = (state_30400[(12)]);
var inst_30349__$1 = cljs.core._nth(inst_30342,inst_30344);
var inst_30350 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30349__$1,inst_30261,done);
var state_30400__$1 = (function (){var statearr_30425 = state_30400;
(statearr_30425[(12)] = inst_30349__$1);

return statearr_30425;
})();
if(cljs.core.truth_(inst_30350)){
var statearr_30427_32439 = state_30400__$1;
(statearr_30427_32439[(1)] = (30));

} else {
var statearr_30428_32440 = state_30400__$1;
(statearr_30428_32440[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (1))){
var state_30400__$1 = state_30400;
var statearr_30429_32442 = state_30400__$1;
(statearr_30429_32442[(2)] = null);

(statearr_30429_32442[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (24))){
var inst_30296 = (state_30400[(7)]);
var inst_30318 = (state_30400[(2)]);
var inst_30319 = cljs.core.next(inst_30296);
var inst_30270 = inst_30319;
var inst_30271 = null;
var inst_30272 = (0);
var inst_30273 = (0);
var state_30400__$1 = (function (){var statearr_30433 = state_30400;
(statearr_30433[(13)] = inst_30272);

(statearr_30433[(14)] = inst_30271);

(statearr_30433[(15)] = inst_30273);

(statearr_30433[(16)] = inst_30270);

(statearr_30433[(17)] = inst_30318);

return statearr_30433;
})();
var statearr_30435_32450 = state_30400__$1;
(statearr_30435_32450[(2)] = null);

(statearr_30435_32450[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (39))){
var state_30400__$1 = state_30400;
var statearr_30439_32457 = state_30400__$1;
(statearr_30439_32457[(2)] = null);

(statearr_30439_32457[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (4))){
var inst_30261 = (state_30400[(11)]);
var inst_30261__$1 = (state_30400[(2)]);
var inst_30262 = (inst_30261__$1 == null);
var state_30400__$1 = (function (){var statearr_30440 = state_30400;
(statearr_30440[(11)] = inst_30261__$1);

return statearr_30440;
})();
if(cljs.core.truth_(inst_30262)){
var statearr_30441_32461 = state_30400__$1;
(statearr_30441_32461[(1)] = (5));

} else {
var statearr_30442_32462 = state_30400__$1;
(statearr_30442_32462[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (15))){
var inst_30272 = (state_30400[(13)]);
var inst_30271 = (state_30400[(14)]);
var inst_30273 = (state_30400[(15)]);
var inst_30270 = (state_30400[(16)]);
var inst_30291 = (state_30400[(2)]);
var inst_30292 = (inst_30273 + (1));
var tmp30436 = inst_30272;
var tmp30437 = inst_30271;
var tmp30438 = inst_30270;
var inst_30270__$1 = tmp30438;
var inst_30271__$1 = tmp30437;
var inst_30272__$1 = tmp30436;
var inst_30273__$1 = inst_30292;
var state_30400__$1 = (function (){var statearr_30443 = state_30400;
(statearr_30443[(13)] = inst_30272__$1);

(statearr_30443[(14)] = inst_30271__$1);

(statearr_30443[(15)] = inst_30273__$1);

(statearr_30443[(16)] = inst_30270__$1);

(statearr_30443[(18)] = inst_30291);

return statearr_30443;
})();
var statearr_30444_32477 = state_30400__$1;
(statearr_30444_32477[(2)] = null);

(statearr_30444_32477[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (21))){
var inst_30322 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30448_32478 = state_30400__$1;
(statearr_30448_32478[(2)] = inst_30322);

(statearr_30448_32478[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (31))){
var inst_30349 = (state_30400[(12)]);
var inst_30353 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30349);
var state_30400__$1 = state_30400;
var statearr_30453_32483 = state_30400__$1;
(statearr_30453_32483[(2)] = inst_30353);

(statearr_30453_32483[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (32))){
var inst_30344 = (state_30400[(9)]);
var inst_30343 = (state_30400[(19)]);
var inst_30342 = (state_30400[(10)]);
var inst_30341 = (state_30400[(20)]);
var inst_30355 = (state_30400[(2)]);
var inst_30356 = (inst_30344 + (1));
var tmp30445 = inst_30343;
var tmp30446 = inst_30342;
var tmp30447 = inst_30341;
var inst_30341__$1 = tmp30447;
var inst_30342__$1 = tmp30446;
var inst_30343__$1 = tmp30445;
var inst_30344__$1 = inst_30356;
var state_30400__$1 = (function (){var statearr_30455 = state_30400;
(statearr_30455[(9)] = inst_30344__$1);

(statearr_30455[(19)] = inst_30343__$1);

(statearr_30455[(10)] = inst_30342__$1);

(statearr_30455[(20)] = inst_30341__$1);

(statearr_30455[(21)] = inst_30355);

return statearr_30455;
})();
var statearr_30456_32490 = state_30400__$1;
(statearr_30456_32490[(2)] = null);

(statearr_30456_32490[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (40))){
var inst_30369 = (state_30400[(22)]);
var inst_30373 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30369);
var state_30400__$1 = state_30400;
var statearr_30457_32493 = state_30400__$1;
(statearr_30457_32493[(2)] = inst_30373);

(statearr_30457_32493[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (33))){
var inst_30359 = (state_30400[(23)]);
var inst_30362 = cljs.core.chunked_seq_QMARK_(inst_30359);
var state_30400__$1 = state_30400;
if(inst_30362){
var statearr_30458_32496 = state_30400__$1;
(statearr_30458_32496[(1)] = (36));

} else {
var statearr_30459_32497 = state_30400__$1;
(statearr_30459_32497[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (13))){
var inst_30285 = (state_30400[(24)]);
var inst_30288 = cljs.core.async.close_BANG_(inst_30285);
var state_30400__$1 = state_30400;
var statearr_30460_32498 = state_30400__$1;
(statearr_30460_32498[(2)] = inst_30288);

(statearr_30460_32498[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (22))){
var inst_30309 = (state_30400[(8)]);
var inst_30315 = cljs.core.async.close_BANG_(inst_30309);
var state_30400__$1 = state_30400;
var statearr_30464_32499 = state_30400__$1;
(statearr_30464_32499[(2)] = inst_30315);

(statearr_30464_32499[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (36))){
var inst_30359 = (state_30400[(23)]);
var inst_30364 = cljs.core.chunk_first(inst_30359);
var inst_30365 = cljs.core.chunk_rest(inst_30359);
var inst_30366 = cljs.core.count(inst_30364);
var inst_30341 = inst_30365;
var inst_30342 = inst_30364;
var inst_30343 = inst_30366;
var inst_30344 = (0);
var state_30400__$1 = (function (){var statearr_30466 = state_30400;
(statearr_30466[(9)] = inst_30344);

(statearr_30466[(19)] = inst_30343);

(statearr_30466[(10)] = inst_30342);

(statearr_30466[(20)] = inst_30341);

return statearr_30466;
})();
var statearr_30468_32501 = state_30400__$1;
(statearr_30468_32501[(2)] = null);

(statearr_30468_32501[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (41))){
var inst_30359 = (state_30400[(23)]);
var inst_30375 = (state_30400[(2)]);
var inst_30376 = cljs.core.next(inst_30359);
var inst_30341 = inst_30376;
var inst_30342 = null;
var inst_30343 = (0);
var inst_30344 = (0);
var state_30400__$1 = (function (){var statearr_30469 = state_30400;
(statearr_30469[(9)] = inst_30344);

(statearr_30469[(19)] = inst_30343);

(statearr_30469[(10)] = inst_30342);

(statearr_30469[(25)] = inst_30375);

(statearr_30469[(20)] = inst_30341);

return statearr_30469;
})();
var statearr_30470_32502 = state_30400__$1;
(statearr_30470_32502[(2)] = null);

(statearr_30470_32502[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (43))){
var state_30400__$1 = state_30400;
var statearr_30474_32504 = state_30400__$1;
(statearr_30474_32504[(2)] = null);

(statearr_30474_32504[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (29))){
var inst_30384 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30475_32506 = state_30400__$1;
(statearr_30475_32506[(2)] = inst_30384);

(statearr_30475_32506[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (44))){
var inst_30393 = (state_30400[(2)]);
var state_30400__$1 = (function (){var statearr_30476 = state_30400;
(statearr_30476[(26)] = inst_30393);

return statearr_30476;
})();
var statearr_30477_32509 = state_30400__$1;
(statearr_30477_32509[(2)] = null);

(statearr_30477_32509[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (6))){
var inst_30333 = (state_30400[(27)]);
var inst_30332 = cljs.core.deref(cs);
var inst_30333__$1 = cljs.core.keys(inst_30332);
var inst_30334 = cljs.core.count(inst_30333__$1);
var inst_30335 = cljs.core.reset_BANG_(dctr,inst_30334);
var inst_30340 = cljs.core.seq(inst_30333__$1);
var inst_30341 = inst_30340;
var inst_30342 = null;
var inst_30343 = (0);
var inst_30344 = (0);
var state_30400__$1 = (function (){var statearr_30478 = state_30400;
(statearr_30478[(28)] = inst_30335);

(statearr_30478[(9)] = inst_30344);

(statearr_30478[(19)] = inst_30343);

(statearr_30478[(10)] = inst_30342);

(statearr_30478[(27)] = inst_30333__$1);

(statearr_30478[(20)] = inst_30341);

return statearr_30478;
})();
var statearr_30479_32523 = state_30400__$1;
(statearr_30479_32523[(2)] = null);

(statearr_30479_32523[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (28))){
var inst_30359 = (state_30400[(23)]);
var inst_30341 = (state_30400[(20)]);
var inst_30359__$1 = cljs.core.seq(inst_30341);
var state_30400__$1 = (function (){var statearr_30480 = state_30400;
(statearr_30480[(23)] = inst_30359__$1);

return statearr_30480;
})();
if(inst_30359__$1){
var statearr_30481_32524 = state_30400__$1;
(statearr_30481_32524[(1)] = (33));

} else {
var statearr_30482_32525 = state_30400__$1;
(statearr_30482_32525[(1)] = (34));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (25))){
var inst_30344 = (state_30400[(9)]);
var inst_30343 = (state_30400[(19)]);
var inst_30346 = (inst_30344 < inst_30343);
var inst_30347 = inst_30346;
var state_30400__$1 = state_30400;
if(cljs.core.truth_(inst_30347)){
var statearr_30483_32528 = state_30400__$1;
(statearr_30483_32528[(1)] = (27));

} else {
var statearr_30484_32529 = state_30400__$1;
(statearr_30484_32529[(1)] = (28));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (34))){
var state_30400__$1 = state_30400;
var statearr_30485_32530 = state_30400__$1;
(statearr_30485_32530[(2)] = null);

(statearr_30485_32530[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (17))){
var state_30400__$1 = state_30400;
var statearr_30486_32532 = state_30400__$1;
(statearr_30486_32532[(2)] = null);

(statearr_30486_32532[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (3))){
var inst_30398 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30400__$1,inst_30398);
} else {
if((state_val_30401 === (12))){
var inst_30327 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30487_32538 = state_30400__$1;
(statearr_30487_32538[(2)] = inst_30327);

(statearr_30487_32538[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (2))){
var state_30400__$1 = state_30400;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30400__$1,(4),ch);
} else {
if((state_val_30401 === (23))){
var state_30400__$1 = state_30400;
var statearr_30488_32547 = state_30400__$1;
(statearr_30488_32547[(2)] = null);

(statearr_30488_32547[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (35))){
var inst_30382 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30489_32549 = state_30400__$1;
(statearr_30489_32549[(2)] = inst_30382);

(statearr_30489_32549[(1)] = (29));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (19))){
var inst_30296 = (state_30400[(7)]);
var inst_30300 = cljs.core.chunk_first(inst_30296);
var inst_30301 = cljs.core.chunk_rest(inst_30296);
var inst_30302 = cljs.core.count(inst_30300);
var inst_30270 = inst_30301;
var inst_30271 = inst_30300;
var inst_30272 = inst_30302;
var inst_30273 = (0);
var state_30400__$1 = (function (){var statearr_30490 = state_30400;
(statearr_30490[(13)] = inst_30272);

(statearr_30490[(14)] = inst_30271);

(statearr_30490[(15)] = inst_30273);

(statearr_30490[(16)] = inst_30270);

return statearr_30490;
})();
var statearr_30491_32550 = state_30400__$1;
(statearr_30491_32550[(2)] = null);

(statearr_30491_32550[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (11))){
var inst_30270 = (state_30400[(16)]);
var inst_30296 = (state_30400[(7)]);
var inst_30296__$1 = cljs.core.seq(inst_30270);
var state_30400__$1 = (function (){var statearr_30492 = state_30400;
(statearr_30492[(7)] = inst_30296__$1);

return statearr_30492;
})();
if(inst_30296__$1){
var statearr_30493_32562 = state_30400__$1;
(statearr_30493_32562[(1)] = (16));

} else {
var statearr_30494_32563 = state_30400__$1;
(statearr_30494_32563[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (9))){
var inst_30329 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30497_32567 = state_30400__$1;
(statearr_30497_32567[(2)] = inst_30329);

(statearr_30497_32567[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (5))){
var inst_30268 = cljs.core.deref(cs);
var inst_30269 = cljs.core.seq(inst_30268);
var inst_30270 = inst_30269;
var inst_30271 = null;
var inst_30272 = (0);
var inst_30273 = (0);
var state_30400__$1 = (function (){var statearr_30498 = state_30400;
(statearr_30498[(13)] = inst_30272);

(statearr_30498[(14)] = inst_30271);

(statearr_30498[(15)] = inst_30273);

(statearr_30498[(16)] = inst_30270);

return statearr_30498;
})();
var statearr_30499_32581 = state_30400__$1;
(statearr_30499_32581[(2)] = null);

(statearr_30499_32581[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (14))){
var state_30400__$1 = state_30400;
var statearr_30500_32586 = state_30400__$1;
(statearr_30500_32586[(2)] = null);

(statearr_30500_32586[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (45))){
var inst_30390 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30501_32591 = state_30400__$1;
(statearr_30501_32591[(2)] = inst_30390);

(statearr_30501_32591[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (26))){
var inst_30333 = (state_30400[(27)]);
var inst_30386 = (state_30400[(2)]);
var inst_30387 = cljs.core.seq(inst_30333);
var state_30400__$1 = (function (){var statearr_30502 = state_30400;
(statearr_30502[(29)] = inst_30386);

return statearr_30502;
})();
if(inst_30387){
var statearr_30503_32592 = state_30400__$1;
(statearr_30503_32592[(1)] = (42));

} else {
var statearr_30505_32593 = state_30400__$1;
(statearr_30505_32593[(1)] = (43));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (16))){
var inst_30296 = (state_30400[(7)]);
var inst_30298 = cljs.core.chunked_seq_QMARK_(inst_30296);
var state_30400__$1 = state_30400;
if(inst_30298){
var statearr_30507_32594 = state_30400__$1;
(statearr_30507_32594[(1)] = (19));

} else {
var statearr_30508_32595 = state_30400__$1;
(statearr_30508_32595[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (38))){
var inst_30379 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30509_32601 = state_30400__$1;
(statearr_30509_32601[(2)] = inst_30379);

(statearr_30509_32601[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (30))){
var state_30400__$1 = state_30400;
var statearr_30510_32602 = state_30400__$1;
(statearr_30510_32602[(2)] = null);

(statearr_30510_32602[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (10))){
var inst_30271 = (state_30400[(14)]);
var inst_30273 = (state_30400[(15)]);
var inst_30281 = cljs.core._nth(inst_30271,inst_30273);
var inst_30285 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30281,(0),null);
var inst_30286 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30281,(1),null);
var state_30400__$1 = (function (){var statearr_30511 = state_30400;
(statearr_30511[(24)] = inst_30285);

return statearr_30511;
})();
if(cljs.core.truth_(inst_30286)){
var statearr_30512_32603 = state_30400__$1;
(statearr_30512_32603[(1)] = (13));

} else {
var statearr_30514_32604 = state_30400__$1;
(statearr_30514_32604[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (18))){
var inst_30325 = (state_30400[(2)]);
var state_30400__$1 = state_30400;
var statearr_30516_32607 = state_30400__$1;
(statearr_30516_32607[(2)] = inst_30325);

(statearr_30516_32607[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (42))){
var state_30400__$1 = state_30400;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30400__$1,(45),dchan);
} else {
if((state_val_30401 === (37))){
var inst_30359 = (state_30400[(23)]);
var inst_30369 = (state_30400[(22)]);
var inst_30261 = (state_30400[(11)]);
var inst_30369__$1 = cljs.core.first(inst_30359);
var inst_30370 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30369__$1,inst_30261,done);
var state_30400__$1 = (function (){var statearr_30520 = state_30400;
(statearr_30520[(22)] = inst_30369__$1);

return statearr_30520;
})();
if(cljs.core.truth_(inst_30370)){
var statearr_30521_32610 = state_30400__$1;
(statearr_30521_32610[(1)] = (39));

} else {
var statearr_30522_32611 = state_30400__$1;
(statearr_30522_32611[(1)] = (40));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30401 === (8))){
var inst_30272 = (state_30400[(13)]);
var inst_30273 = (state_30400[(15)]);
var inst_30275 = (inst_30273 < inst_30272);
var inst_30276 = inst_30275;
var state_30400__$1 = state_30400;
if(cljs.core.truth_(inst_30276)){
var statearr_30523_32612 = state_30400__$1;
(statearr_30523_32612[(1)] = (10));

} else {
var statearr_30524_32613 = state_30400__$1;
(statearr_30524_32613[(1)] = (11));

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
var cljs$core$async$mult_$_state_machine__28378__auto__ = null;
var cljs$core$async$mult_$_state_machine__28378__auto____0 = (function (){
var statearr_30525 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30525[(0)] = cljs$core$async$mult_$_state_machine__28378__auto__);

(statearr_30525[(1)] = (1));

return statearr_30525;
});
var cljs$core$async$mult_$_state_machine__28378__auto____1 = (function (state_30400){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30400);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30526){var ex__28381__auto__ = e30526;
var statearr_30527_32624 = state_30400;
(statearr_30527_32624[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30400[(4)]))){
var statearr_30528_32626 = state_30400;
(statearr_30528_32626[(1)] = cljs.core.first((state_30400[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32632 = state_30400;
state_30400 = G__32632;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__28378__auto__ = function(state_30400){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__28378__auto____1.call(this,state_30400);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__28378__auto____0;
cljs$core$async$mult_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__28378__auto____1;
return cljs$core$async$mult_$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_30530 = f__29158__auto__();
(statearr_30530[(6)] = c__29157__auto___32425);

return statearr_30530;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var G__30534 = arguments.length;
switch (G__30534) {
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

var cljs$core$async$Mix$admix_STAR_$dyn_32648 = (function (m,ch){
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
return cljs$core$async$Mix$admix_STAR_$dyn_32648(m,ch);
}
});

var cljs$core$async$Mix$unmix_STAR_$dyn_32654 = (function (m,ch){
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
return cljs$core$async$Mix$unmix_STAR_$dyn_32654(m,ch);
}
});

var cljs$core$async$Mix$unmix_all_STAR_$dyn_32676 = (function (m){
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
return cljs$core$async$Mix$unmix_all_STAR_$dyn_32676(m);
}
});

var cljs$core$async$Mix$toggle_STAR_$dyn_32688 = (function (m,state_map){
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
return cljs$core$async$Mix$toggle_STAR_$dyn_32688(m,state_map);
}
});

var cljs$core$async$Mix$solo_mode_STAR_$dyn_32694 = (function (m,mode){
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
return cljs$core$async$Mix$solo_mode_STAR_$dyn_32694(m,mode);
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___32711 = arguments.length;
var i__5770__auto___32713 = (0);
while(true){
if((i__5770__auto___32713 < len__5769__auto___32711)){
args__5775__auto__.push((arguments[i__5770__auto___32713]));

var G__32718 = (i__5770__auto___32713 + (1));
i__5770__auto___32713 = G__32718;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((3) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((3)),(0),null)):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__5776__auto__);
});

(cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__30603){
var map__30604 = p__30603;
var map__30604__$1 = cljs.core.__destructure_map(map__30604);
var opts = map__30604__$1;
var statearr_30605_32722 = state;
(statearr_30605_32722[(1)] = cont_block);


var temp__5823__auto__ = cljs.core.async.do_alts((function (val){
var statearr_30613_32723 = state;
(statearr_30613_32723[(2)] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state);
}),ports,opts);
if(cljs.core.truth_(temp__5823__auto__)){
var cb = temp__5823__auto__;
var statearr_30619_32724 = state;
(statearr_30619_32724[(2)] = cljs.core.deref(cb));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}));

(cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3));

/** @this {Function} */
(cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq30591){
var G__30592 = cljs.core.first(seq30591);
var seq30591__$1 = cljs.core.next(seq30591);
var G__30593 = cljs.core.first(seq30591__$1);
var seq30591__$2 = cljs.core.next(seq30591__$1);
var G__30594 = cljs.core.first(seq30591__$2);
var seq30591__$3 = cljs.core.next(seq30591__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__30592,G__30593,G__30594,seq30591__$3);
}));


/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30631 = (function (change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30632){
this.change = change;
this.solo_mode = solo_mode;
this.pick = pick;
this.cs = cs;
this.calc_state = calc_state;
this.out = out;
this.changed = changed;
this.solo_modes = solo_modes;
this.attrs = attrs;
this.meta30632 = meta30632;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30633,meta30632__$1){
var self__ = this;
var _30633__$1 = this;
return (new cljs.core.async.t_cljs$core$async30631(self__.change,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta30632__$1));
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30633){
var self__ = this;
var _30633__$1 = this;
return self__.meta30632;
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.core.merge_with,cljs.core.merge),state_map);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30631.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.solo_modes.cljs$core$IFn$_invoke$arity$1 ? self__.solo_modes.cljs$core$IFn$_invoke$arity$1(mode) : self__.solo_modes.call(null, mode)))){
} else {
throw (new Error(["Assert failed: ",["mode must be one of: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.solo_modes)].join(''),"\n","(solo-modes mode)"].join('')));
}

cljs.core.reset_BANG_(self__.solo_mode,mode);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30631.getBasis = (function (){
return new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"change","change",477485025,null),new cljs.core.Symbol(null,"solo-mode","solo-mode",2031788074,null),new cljs.core.Symbol(null,"pick","pick",1300068175,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"calc-state","calc-state",-349968968,null),new cljs.core.Symbol(null,"out","out",729986010,null),new cljs.core.Symbol(null,"changed","changed",-2083710852,null),new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"attrs","attrs",-450137186,null),new cljs.core.Symbol(null,"meta30632","meta30632",-664161973,null)], null);
}));

(cljs.core.async.t_cljs$core$async30631.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30631.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30631");

(cljs.core.async.t_cljs$core$async30631.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30631");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30631.
 */
cljs.core.async.__GT_t_cljs$core$async30631 = (function cljs$core$async$__GT_t_cljs$core$async30631(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30632){
return (new cljs.core.async.t_cljs$core$async30631(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30632));
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
var m = (new cljs.core.async.t_cljs$core$async30631(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
var c__29157__auto___32733 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30724){
var state_val_30725 = (state_30724[(1)]);
if((state_val_30725 === (7))){
var inst_30678 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
if(cljs.core.truth_(inst_30678)){
var statearr_30727_32737 = state_30724__$1;
(statearr_30727_32737[(1)] = (8));

} else {
var statearr_30728_32738 = state_30724__$1;
(statearr_30728_32738[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (20))){
var inst_30670 = (state_30724[(7)]);
var state_30724__$1 = state_30724;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30724__$1,(23),out,inst_30670);
} else {
if((state_val_30725 === (1))){
var inst_30653 = calc_state();
var inst_30654 = cljs.core.__destructure_map(inst_30653);
var inst_30655 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30654,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30656 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30654,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30657 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30654,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var inst_30658 = inst_30653;
var state_30724__$1 = (function (){var statearr_30733 = state_30724;
(statearr_30733[(8)] = inst_30658);

(statearr_30733[(9)] = inst_30657);

(statearr_30733[(10)] = inst_30656);

(statearr_30733[(11)] = inst_30655);

return statearr_30733;
})();
var statearr_30734_32740 = state_30724__$1;
(statearr_30734_32740[(2)] = null);

(statearr_30734_32740[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (24))){
var inst_30661 = (state_30724[(12)]);
var inst_30658 = inst_30661;
var state_30724__$1 = (function (){var statearr_30735 = state_30724;
(statearr_30735[(8)] = inst_30658);

return statearr_30735;
})();
var statearr_30736_32741 = state_30724__$1;
(statearr_30736_32741[(2)] = null);

(statearr_30736_32741[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (4))){
var inst_30670 = (state_30724[(7)]);
var inst_30673 = (state_30724[(13)]);
var inst_30669 = (state_30724[(2)]);
var inst_30670__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30669,(0),null);
var inst_30671 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30669,(1),null);
var inst_30673__$1 = (inst_30670__$1 == null);
var state_30724__$1 = (function (){var statearr_30737 = state_30724;
(statearr_30737[(14)] = inst_30671);

(statearr_30737[(7)] = inst_30670__$1);

(statearr_30737[(13)] = inst_30673__$1);

return statearr_30737;
})();
if(cljs.core.truth_(inst_30673__$1)){
var statearr_30738_32746 = state_30724__$1;
(statearr_30738_32746[(1)] = (5));

} else {
var statearr_30739_32747 = state_30724__$1;
(statearr_30739_32747[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (15))){
var inst_30694 = (state_30724[(15)]);
var inst_30662 = (state_30724[(16)]);
var inst_30694__$1 = cljs.core.empty_QMARK_(inst_30662);
var state_30724__$1 = (function (){var statearr_30740 = state_30724;
(statearr_30740[(15)] = inst_30694__$1);

return statearr_30740;
})();
if(inst_30694__$1){
var statearr_30741_32749 = state_30724__$1;
(statearr_30741_32749[(1)] = (17));

} else {
var statearr_30742_32750 = state_30724__$1;
(statearr_30742_32750[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (21))){
var inst_30661 = (state_30724[(12)]);
var inst_30658 = inst_30661;
var state_30724__$1 = (function (){var statearr_30743 = state_30724;
(statearr_30743[(8)] = inst_30658);

return statearr_30743;
})();
var statearr_30744_32755 = state_30724__$1;
(statearr_30744_32755[(2)] = null);

(statearr_30744_32755[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (13))){
var inst_30686 = (state_30724[(2)]);
var inst_30687 = calc_state();
var inst_30658 = inst_30687;
var state_30724__$1 = (function (){var statearr_30745 = state_30724;
(statearr_30745[(8)] = inst_30658);

(statearr_30745[(17)] = inst_30686);

return statearr_30745;
})();
var statearr_30746_32762 = state_30724__$1;
(statearr_30746_32762[(2)] = null);

(statearr_30746_32762[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (22))){
var inst_30715 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
var statearr_30747_32768 = state_30724__$1;
(statearr_30747_32768[(2)] = inst_30715);

(statearr_30747_32768[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (6))){
var inst_30671 = (state_30724[(14)]);
var inst_30676 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_30671,change);
var state_30724__$1 = state_30724;
var statearr_30749_32769 = state_30724__$1;
(statearr_30749_32769[(2)] = inst_30676);

(statearr_30749_32769[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (25))){
var state_30724__$1 = state_30724;
var statearr_30750_32770 = state_30724__$1;
(statearr_30750_32770[(2)] = null);

(statearr_30750_32770[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (17))){
var inst_30663 = (state_30724[(18)]);
var inst_30671 = (state_30724[(14)]);
var inst_30696 = (inst_30663.cljs$core$IFn$_invoke$arity$1 ? inst_30663.cljs$core$IFn$_invoke$arity$1(inst_30671) : inst_30663.call(null, inst_30671));
var inst_30697 = cljs.core.not(inst_30696);
var state_30724__$1 = state_30724;
var statearr_30754_32771 = state_30724__$1;
(statearr_30754_32771[(2)] = inst_30697);

(statearr_30754_32771[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (3))){
var inst_30722 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30724__$1,inst_30722);
} else {
if((state_val_30725 === (12))){
var state_30724__$1 = state_30724;
var statearr_30755_32772 = state_30724__$1;
(statearr_30755_32772[(2)] = null);

(statearr_30755_32772[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (2))){
var inst_30661 = (state_30724[(12)]);
var inst_30658 = (state_30724[(8)]);
var inst_30661__$1 = cljs.core.__destructure_map(inst_30658);
var inst_30662 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30661__$1,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30663 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30661__$1,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30664 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30661__$1,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var state_30724__$1 = (function (){var statearr_30760 = state_30724;
(statearr_30760[(18)] = inst_30663);

(statearr_30760[(12)] = inst_30661__$1);

(statearr_30760[(16)] = inst_30662);

return statearr_30760;
})();
return cljs.core.async.ioc_alts_BANG_(state_30724__$1,(4),inst_30664);
} else {
if((state_val_30725 === (23))){
var inst_30705 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
if(cljs.core.truth_(inst_30705)){
var statearr_30762_32774 = state_30724__$1;
(statearr_30762_32774[(1)] = (24));

} else {
var statearr_30763_32776 = state_30724__$1;
(statearr_30763_32776[(1)] = (25));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (19))){
var inst_30700 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
var statearr_30764_32777 = state_30724__$1;
(statearr_30764_32777[(2)] = inst_30700);

(statearr_30764_32777[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (11))){
var inst_30671 = (state_30724[(14)]);
var inst_30683 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cs,cljs.core.dissoc,inst_30671);
var state_30724__$1 = state_30724;
var statearr_30766_32784 = state_30724__$1;
(statearr_30766_32784[(2)] = inst_30683);

(statearr_30766_32784[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (9))){
var inst_30662 = (state_30724[(16)]);
var inst_30671 = (state_30724[(14)]);
var inst_30690 = (state_30724[(19)]);
var inst_30690__$1 = (inst_30662.cljs$core$IFn$_invoke$arity$1 ? inst_30662.cljs$core$IFn$_invoke$arity$1(inst_30671) : inst_30662.call(null, inst_30671));
var state_30724__$1 = (function (){var statearr_30769 = state_30724;
(statearr_30769[(19)] = inst_30690__$1);

return statearr_30769;
})();
if(cljs.core.truth_(inst_30690__$1)){
var statearr_30770_32786 = state_30724__$1;
(statearr_30770_32786[(1)] = (14));

} else {
var statearr_30771_32787 = state_30724__$1;
(statearr_30771_32787[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (5))){
var inst_30673 = (state_30724[(13)]);
var state_30724__$1 = state_30724;
var statearr_30772_32790 = state_30724__$1;
(statearr_30772_32790[(2)] = inst_30673);

(statearr_30772_32790[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (14))){
var inst_30690 = (state_30724[(19)]);
var state_30724__$1 = state_30724;
var statearr_30774_32791 = state_30724__$1;
(statearr_30774_32791[(2)] = inst_30690);

(statearr_30774_32791[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (26))){
var inst_30711 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
var statearr_30775_32792 = state_30724__$1;
(statearr_30775_32792[(2)] = inst_30711);

(statearr_30775_32792[(1)] = (22));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (16))){
var inst_30702 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
if(cljs.core.truth_(inst_30702)){
var statearr_30777_32793 = state_30724__$1;
(statearr_30777_32793[(1)] = (20));

} else {
var statearr_30778_32798 = state_30724__$1;
(statearr_30778_32798[(1)] = (21));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (10))){
var inst_30717 = (state_30724[(2)]);
var state_30724__$1 = state_30724;
var statearr_30782_32803 = state_30724__$1;
(statearr_30782_32803[(2)] = inst_30717);

(statearr_30782_32803[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (18))){
var inst_30694 = (state_30724[(15)]);
var state_30724__$1 = state_30724;
var statearr_30783_32804 = state_30724__$1;
(statearr_30783_32804[(2)] = inst_30694);

(statearr_30783_32804[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30725 === (8))){
var inst_30670 = (state_30724[(7)]);
var inst_30681 = (inst_30670 == null);
var state_30724__$1 = state_30724;
if(cljs.core.truth_(inst_30681)){
var statearr_30784_32805 = state_30724__$1;
(statearr_30784_32805[(1)] = (11));

} else {
var statearr_30785_32806 = state_30724__$1;
(statearr_30785_32806[(1)] = (12));

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
var cljs$core$async$mix_$_state_machine__28378__auto__ = null;
var cljs$core$async$mix_$_state_machine__28378__auto____0 = (function (){
var statearr_30789 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30789[(0)] = cljs$core$async$mix_$_state_machine__28378__auto__);

(statearr_30789[(1)] = (1));

return statearr_30789;
});
var cljs$core$async$mix_$_state_machine__28378__auto____1 = (function (state_30724){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30724);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30790){var ex__28381__auto__ = e30790;
var statearr_30791_32808 = state_30724;
(statearr_30791_32808[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30724[(4)]))){
var statearr_30792_32809 = state_30724;
(statearr_30792_32809[(1)] = cljs.core.first((state_30724[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32810 = state_30724;
state_30724 = G__32810;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__28378__auto__ = function(state_30724){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__28378__auto____1.call(this,state_30724);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__28378__auto____0;
cljs$core$async$mix_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__28378__auto____1;
return cljs$core$async$mix_$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_30795 = f__29158__auto__();
(statearr_30795[(6)] = c__29157__auto___32733);

return statearr_30795;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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

var cljs$core$async$Pub$sub_STAR_$dyn_32812 = (function (p,v,ch,close_QMARK_){
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
return cljs$core$async$Pub$sub_STAR_$dyn_32812(p,v,ch,close_QMARK_);
}
});

var cljs$core$async$Pub$unsub_STAR_$dyn_32814 = (function (p,v,ch){
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
return cljs$core$async$Pub$unsub_STAR_$dyn_32814(p,v,ch);
}
});

var cljs$core$async$Pub$unsub_all_STAR_$dyn_32815 = (function() {
var G__32816 = null;
var G__32816__1 = (function (p){
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
var G__32816__2 = (function (p,v){
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
G__32816 = function(p,v){
switch(arguments.length){
case 1:
return G__32816__1.call(this,p);
case 2:
return G__32816__2.call(this,p,v);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__32816.cljs$core$IFn$_invoke$arity$1 = G__32816__1;
G__32816.cljs$core$IFn$_invoke$arity$2 = G__32816__2;
return G__32816;
})()
;
cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var G__30817 = arguments.length;
switch (G__30817) {
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
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32815(p);
}
}));

(cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (p,v){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$2 == null)))))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$2(p,v);
} else {
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32815(p,v);
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
cljs.core.async.t_cljs$core$async30828 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta30829){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta30829 = meta30829;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30830,meta30829__$1){
var self__ = this;
var _30830__$1 = this;
return (new cljs.core.async.t_cljs$core$async30828(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta30829__$1));
}));

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30830){
var self__ = this;
var _30830__$1 = this;
return self__.meta30829;
}));

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Pub$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = (self__.ensure_mult.cljs$core$IFn$_invoke$arity$1 ? self__.ensure_mult.cljs$core$IFn$_invoke$arity$1(topic) : self__.ensure_mult.call(null, topic));
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(m,ch__$1,close_QMARK_);
}));

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = (function (p,topic,ch__$1){
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

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reset_BANG_(self__.mults,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs.core.async.t_cljs$core$async30828.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.mults,cljs.core.dissoc,topic);
}));

(cljs.core.async.t_cljs$core$async30828.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"topic-fn","topic-fn",-862449736,null),new cljs.core.Symbol(null,"buf-fn","buf-fn",-1200281591,null),new cljs.core.Symbol(null,"mults","mults",-461114485,null),new cljs.core.Symbol(null,"ensure-mult","ensure-mult",1796584816,null),new cljs.core.Symbol(null,"meta30829","meta30829",-1996282589,null)], null);
}));

(cljs.core.async.t_cljs$core$async30828.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30828.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30828");

(cljs.core.async.t_cljs$core$async30828.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30828");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30828.
 */
cljs.core.async.__GT_t_cljs$core$async30828 = (function cljs$core$async$__GT_t_cljs$core$async30828(ch,topic_fn,buf_fn,mults,ensure_mult,meta30829){
return (new cljs.core.async.t_cljs$core$async30828(ch,topic_fn,buf_fn,mults,ensure_mult,meta30829));
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
var p = (new cljs.core.async.t_cljs$core$async30828(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
var c__29157__auto___32837 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_30916){
var state_val_30917 = (state_30916[(1)]);
if((state_val_30917 === (7))){
var inst_30912 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30918_32838 = state_30916__$1;
(statearr_30918_32838[(2)] = inst_30912);

(statearr_30918_32838[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (20))){
var state_30916__$1 = state_30916;
var statearr_30919_32839 = state_30916__$1;
(statearr_30919_32839[(2)] = null);

(statearr_30919_32839[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (1))){
var state_30916__$1 = state_30916;
var statearr_30920_32840 = state_30916__$1;
(statearr_30920_32840[(2)] = null);

(statearr_30920_32840[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (24))){
var inst_30895 = (state_30916[(7)]);
var inst_30904 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(mults,cljs.core.dissoc,inst_30895);
var state_30916__$1 = state_30916;
var statearr_30921_32844 = state_30916__$1;
(statearr_30921_32844[(2)] = inst_30904);

(statearr_30921_32844[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (4))){
var inst_30844 = (state_30916[(8)]);
var inst_30844__$1 = (state_30916[(2)]);
var inst_30845 = (inst_30844__$1 == null);
var state_30916__$1 = (function (){var statearr_30923 = state_30916;
(statearr_30923[(8)] = inst_30844__$1);

return statearr_30923;
})();
if(cljs.core.truth_(inst_30845)){
var statearr_30924_32848 = state_30916__$1;
(statearr_30924_32848[(1)] = (5));

} else {
var statearr_30928_32853 = state_30916__$1;
(statearr_30928_32853[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (15))){
var inst_30889 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30929_32854 = state_30916__$1;
(statearr_30929_32854[(2)] = inst_30889);

(statearr_30929_32854[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (21))){
var inst_30909 = (state_30916[(2)]);
var state_30916__$1 = (function (){var statearr_30930 = state_30916;
(statearr_30930[(9)] = inst_30909);

return statearr_30930;
})();
var statearr_30931_32855 = state_30916__$1;
(statearr_30931_32855[(2)] = null);

(statearr_30931_32855[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (13))){
var inst_30868 = (state_30916[(10)]);
var inst_30873 = cljs.core.chunked_seq_QMARK_(inst_30868);
var state_30916__$1 = state_30916;
if(inst_30873){
var statearr_30932_32856 = state_30916__$1;
(statearr_30932_32856[(1)] = (16));

} else {
var statearr_30933_32860 = state_30916__$1;
(statearr_30933_32860[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (22))){
var inst_30901 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
if(cljs.core.truth_(inst_30901)){
var statearr_30934_32864 = state_30916__$1;
(statearr_30934_32864[(1)] = (23));

} else {
var statearr_30935_32868 = state_30916__$1;
(statearr_30935_32868[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (6))){
var inst_30897 = (state_30916[(11)]);
var inst_30895 = (state_30916[(7)]);
var inst_30844 = (state_30916[(8)]);
var inst_30895__$1 = (topic_fn.cljs$core$IFn$_invoke$arity$1 ? topic_fn.cljs$core$IFn$_invoke$arity$1(inst_30844) : topic_fn.call(null, inst_30844));
var inst_30896 = cljs.core.deref(mults);
var inst_30897__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30896,inst_30895__$1);
var state_30916__$1 = (function (){var statearr_30940 = state_30916;
(statearr_30940[(11)] = inst_30897__$1);

(statearr_30940[(7)] = inst_30895__$1);

return statearr_30940;
})();
if(cljs.core.truth_(inst_30897__$1)){
var statearr_30941_32869 = state_30916__$1;
(statearr_30941_32869[(1)] = (19));

} else {
var statearr_30942_32870 = state_30916__$1;
(statearr_30942_32870[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (25))){
var inst_30906 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30944_32871 = state_30916__$1;
(statearr_30944_32871[(2)] = inst_30906);

(statearr_30944_32871[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (17))){
var inst_30868 = (state_30916[(10)]);
var inst_30880 = cljs.core.first(inst_30868);
var inst_30881 = cljs.core.async.muxch_STAR_(inst_30880);
var inst_30882 = cljs.core.async.close_BANG_(inst_30881);
var inst_30883 = cljs.core.next(inst_30868);
var inst_30854 = inst_30883;
var inst_30855 = null;
var inst_30856 = (0);
var inst_30857 = (0);
var state_30916__$1 = (function (){var statearr_30945 = state_30916;
(statearr_30945[(12)] = inst_30855);

(statearr_30945[(13)] = inst_30857);

(statearr_30945[(14)] = inst_30882);

(statearr_30945[(15)] = inst_30856);

(statearr_30945[(16)] = inst_30854);

return statearr_30945;
})();
var statearr_30946_32872 = state_30916__$1;
(statearr_30946_32872[(2)] = null);

(statearr_30946_32872[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (3))){
var inst_30914 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30916__$1,inst_30914);
} else {
if((state_val_30917 === (12))){
var inst_30891 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30951_32873 = state_30916__$1;
(statearr_30951_32873[(2)] = inst_30891);

(statearr_30951_32873[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (2))){
var state_30916__$1 = state_30916;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30916__$1,(4),ch);
} else {
if((state_val_30917 === (23))){
var state_30916__$1 = state_30916;
var statearr_30952_32874 = state_30916__$1;
(statearr_30952_32874[(2)] = null);

(statearr_30952_32874[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (19))){
var inst_30897 = (state_30916[(11)]);
var inst_30844 = (state_30916[(8)]);
var inst_30899 = cljs.core.async.muxch_STAR_(inst_30897);
var state_30916__$1 = state_30916;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30916__$1,(22),inst_30899,inst_30844);
} else {
if((state_val_30917 === (11))){
var inst_30868 = (state_30916[(10)]);
var inst_30854 = (state_30916[(16)]);
var inst_30868__$1 = cljs.core.seq(inst_30854);
var state_30916__$1 = (function (){var statearr_30953 = state_30916;
(statearr_30953[(10)] = inst_30868__$1);

return statearr_30953;
})();
if(inst_30868__$1){
var statearr_30954_32875 = state_30916__$1;
(statearr_30954_32875[(1)] = (13));

} else {
var statearr_30955_32876 = state_30916__$1;
(statearr_30955_32876[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (9))){
var inst_30893 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30957_32878 = state_30916__$1;
(statearr_30957_32878[(2)] = inst_30893);

(statearr_30957_32878[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (5))){
var inst_30851 = cljs.core.deref(mults);
var inst_30852 = cljs.core.vals(inst_30851);
var inst_30853 = cljs.core.seq(inst_30852);
var inst_30854 = inst_30853;
var inst_30855 = null;
var inst_30856 = (0);
var inst_30857 = (0);
var state_30916__$1 = (function (){var statearr_30958 = state_30916;
(statearr_30958[(12)] = inst_30855);

(statearr_30958[(13)] = inst_30857);

(statearr_30958[(15)] = inst_30856);

(statearr_30958[(16)] = inst_30854);

return statearr_30958;
})();
var statearr_30962_32880 = state_30916__$1;
(statearr_30962_32880[(2)] = null);

(statearr_30962_32880[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (14))){
var state_30916__$1 = state_30916;
var statearr_30966_32881 = state_30916__$1;
(statearr_30966_32881[(2)] = null);

(statearr_30966_32881[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (16))){
var inst_30868 = (state_30916[(10)]);
var inst_30875 = cljs.core.chunk_first(inst_30868);
var inst_30876 = cljs.core.chunk_rest(inst_30868);
var inst_30877 = cljs.core.count(inst_30875);
var inst_30854 = inst_30876;
var inst_30855 = inst_30875;
var inst_30856 = inst_30877;
var inst_30857 = (0);
var state_30916__$1 = (function (){var statearr_30967 = state_30916;
(statearr_30967[(12)] = inst_30855);

(statearr_30967[(13)] = inst_30857);

(statearr_30967[(15)] = inst_30856);

(statearr_30967[(16)] = inst_30854);

return statearr_30967;
})();
var statearr_30968_32888 = state_30916__$1;
(statearr_30968_32888[(2)] = null);

(statearr_30968_32888[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (10))){
var inst_30855 = (state_30916[(12)]);
var inst_30857 = (state_30916[(13)]);
var inst_30856 = (state_30916[(15)]);
var inst_30854 = (state_30916[(16)]);
var inst_30862 = cljs.core._nth(inst_30855,inst_30857);
var inst_30863 = cljs.core.async.muxch_STAR_(inst_30862);
var inst_30864 = cljs.core.async.close_BANG_(inst_30863);
var inst_30865 = (inst_30857 + (1));
var tmp30963 = inst_30855;
var tmp30964 = inst_30856;
var tmp30965 = inst_30854;
var inst_30854__$1 = tmp30965;
var inst_30855__$1 = tmp30963;
var inst_30856__$1 = tmp30964;
var inst_30857__$1 = inst_30865;
var state_30916__$1 = (function (){var statearr_30969 = state_30916;
(statearr_30969[(17)] = inst_30864);

(statearr_30969[(12)] = inst_30855__$1);

(statearr_30969[(13)] = inst_30857__$1);

(statearr_30969[(15)] = inst_30856__$1);

(statearr_30969[(16)] = inst_30854__$1);

return statearr_30969;
})();
var statearr_30970_32901 = state_30916__$1;
(statearr_30970_32901[(2)] = null);

(statearr_30970_32901[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (18))){
var inst_30886 = (state_30916[(2)]);
var state_30916__$1 = state_30916;
var statearr_30979_32902 = state_30916__$1;
(statearr_30979_32902[(2)] = inst_30886);

(statearr_30979_32902[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30917 === (8))){
var inst_30857 = (state_30916[(13)]);
var inst_30856 = (state_30916[(15)]);
var inst_30859 = (inst_30857 < inst_30856);
var inst_30860 = inst_30859;
var state_30916__$1 = state_30916;
if(cljs.core.truth_(inst_30860)){
var statearr_30986_32906 = state_30916__$1;
(statearr_30986_32906[(1)] = (10));

} else {
var statearr_30987_32907 = state_30916__$1;
(statearr_30987_32907[(1)] = (11));

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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_30994 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30994[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_30994[(1)] = (1));

return statearr_30994;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_30916){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30916);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30995){var ex__28381__auto__ = e30995;
var statearr_30996_32912 = state_30916;
(statearr_30996_32912[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30916[(4)]))){
var statearr_30997_32913 = state_30916;
(statearr_30997_32913[(1)] = cljs.core.first((state_30916[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32917 = state_30916;
state_30916 = G__32917;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_30916){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_30916);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31012 = f__29158__auto__();
(statearr_31012[(6)] = c__29157__auto___32837);

return statearr_31012;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var G__31020 = arguments.length;
switch (G__31020) {
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
var G__31025 = arguments.length;
switch (G__31025) {
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
var G__31030 = arguments.length;
switch (G__31030) {
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
var c__29157__auto___32926 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31073){
var state_val_31074 = (state_31073[(1)]);
if((state_val_31074 === (7))){
var state_31073__$1 = state_31073;
var statearr_31075_32928 = state_31073__$1;
(statearr_31075_32928[(2)] = null);

(statearr_31075_32928[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (1))){
var state_31073__$1 = state_31073;
var statearr_31079_32929 = state_31073__$1;
(statearr_31079_32929[(2)] = null);

(statearr_31079_32929[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (4))){
var inst_31033 = (state_31073[(7)]);
var inst_31034 = (state_31073[(8)]);
var inst_31036 = (inst_31034 < inst_31033);
var state_31073__$1 = state_31073;
if(cljs.core.truth_(inst_31036)){
var statearr_31080_32930 = state_31073__$1;
(statearr_31080_32930[(1)] = (6));

} else {
var statearr_31081_32931 = state_31073__$1;
(statearr_31081_32931[(1)] = (7));

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
var state_31073__$1 = (function (){var statearr_31082 = state_31073;
(statearr_31082[(9)] = inst_31059__$1);

return statearr_31082;
})();
if(cljs.core.truth_(inst_31060)){
var statearr_31083_32932 = state_31073__$1;
(statearr_31083_32932[(1)] = (14));

} else {
var statearr_31084_32933 = state_31073__$1;
(statearr_31084_32933[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (6))){
var state_31073__$1 = state_31073;
var statearr_31085_32935 = state_31073__$1;
(statearr_31085_32935[(2)] = null);

(statearr_31085_32935[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (17))){
var inst_31066 = (state_31073[(2)]);
var state_31073__$1 = (function (){var statearr_31087 = state_31073;
(statearr_31087[(10)] = inst_31066);

return statearr_31087;
})();
var statearr_31088_32936 = state_31073__$1;
(statearr_31088_32936[(2)] = null);

(statearr_31088_32936[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (3))){
var inst_31071 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31073__$1,inst_31071);
} else {
if((state_val_31074 === (12))){
var _ = (function (){var statearr_31089 = state_31073;
(statearr_31089[(4)] = cljs.core.rest((state_31073[(4)])));

return statearr_31089;
})();
var state_31073__$1 = state_31073;
var ex31086 = (state_31073__$1[(2)]);
var statearr_31090_32937 = state_31073__$1;
(statearr_31090_32937[(5)] = ex31086);


if((ex31086 instanceof Object)){
var statearr_31091_32938 = state_31073__$1;
(statearr_31091_32938[(1)] = (11));

(statearr_31091_32938[(5)] = null);

} else {
throw ex31086;

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (2))){
var inst_31032 = cljs.core.reset_BANG_(dctr,cnt);
var inst_31033 = cnt;
var inst_31034 = (0);
var state_31073__$1 = (function (){var statearr_31097 = state_31073;
(statearr_31097[(7)] = inst_31033);

(statearr_31097[(8)] = inst_31034);

(statearr_31097[(11)] = inst_31032);

return statearr_31097;
})();
var statearr_31101_32939 = state_31073__$1;
(statearr_31101_32939[(2)] = null);

(statearr_31101_32939[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (11))){
var inst_31038 = (state_31073[(2)]);
var inst_31039 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec);
var state_31073__$1 = (function (){var statearr_31105 = state_31073;
(statearr_31105[(12)] = inst_31038);

return statearr_31105;
})();
var statearr_31106_32943 = state_31073__$1;
(statearr_31106_32943[(2)] = inst_31039);

(statearr_31106_32943[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (9))){
var inst_31034 = (state_31073[(8)]);
var _ = (function (){var statearr_31107 = state_31073;
(statearr_31107[(4)] = cljs.core.cons((12),(state_31073[(4)])));

return statearr_31107;
})();
var inst_31045 = (chs__$1.cljs$core$IFn$_invoke$arity$1 ? chs__$1.cljs$core$IFn$_invoke$arity$1(inst_31034) : chs__$1.call(null, inst_31034));
var inst_31046 = (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(inst_31034) : done.call(null, inst_31034));
var inst_31047 = cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2(inst_31045,inst_31046);
var ___$1 = (function (){var statearr_31108 = state_31073;
(statearr_31108[(4)] = cljs.core.rest((state_31073[(4)])));

return statearr_31108;
})();
var state_31073__$1 = state_31073;
var statearr_31109_32945 = state_31073__$1;
(statearr_31109_32945[(2)] = inst_31047);

(statearr_31109_32945[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (5))){
var inst_31057 = (state_31073[(2)]);
var state_31073__$1 = (function (){var statearr_31110 = state_31073;
(statearr_31110[(13)] = inst_31057);

return statearr_31110;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31073__$1,(13),dchan);
} else {
if((state_val_31074 === (14))){
var inst_31062 = cljs.core.async.close_BANG_(out);
var state_31073__$1 = state_31073;
var statearr_31114_32946 = state_31073__$1;
(statearr_31114_32946[(2)] = inst_31062);

(statearr_31114_32946[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (16))){
var inst_31069 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
var statearr_31115_32949 = state_31073__$1;
(statearr_31115_32949[(2)] = inst_31069);

(statearr_31115_32949[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (10))){
var inst_31034 = (state_31073[(8)]);
var inst_31050 = (state_31073[(2)]);
var inst_31051 = (inst_31034 + (1));
var inst_31034__$1 = inst_31051;
var state_31073__$1 = (function (){var statearr_31116 = state_31073;
(statearr_31116[(14)] = inst_31050);

(statearr_31116[(8)] = inst_31034__$1);

return statearr_31116;
})();
var statearr_31117_32950 = state_31073__$1;
(statearr_31117_32950[(2)] = null);

(statearr_31117_32950[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31074 === (8))){
var inst_31055 = (state_31073[(2)]);
var state_31073__$1 = state_31073;
var statearr_31118_32951 = state_31073__$1;
(statearr_31118_32951[(2)] = inst_31055);

(statearr_31118_32951[(1)] = (5));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31119 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31119[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31119[(1)] = (1));

return statearr_31119;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31073){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31073);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31120){var ex__28381__auto__ = e31120;
var statearr_31121_32968 = state_31073;
(statearr_31121_32968[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31073[(4)]))){
var statearr_31122_32969 = state_31073;
(statearr_31122_32969[(1)] = cljs.core.first((state_31073[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32970 = state_31073;
state_31073 = G__32970;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31073){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31073);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31123 = f__29158__auto__();
(statearr_31123[(6)] = c__29157__auto___32926);

return statearr_31123;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var G__31126 = arguments.length;
switch (G__31126) {
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
var c__29157__auto___32976 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31163){
var state_val_31164 = (state_31163[(1)]);
if((state_val_31164 === (7))){
var inst_31143 = (state_31163[(7)]);
var inst_31142 = (state_31163[(8)]);
var inst_31142__$1 = (state_31163[(2)]);
var inst_31143__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31142__$1,(0),null);
var inst_31144 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31142__$1,(1),null);
var inst_31145 = (inst_31143__$1 == null);
var state_31163__$1 = (function (){var statearr_31167 = state_31163;
(statearr_31167[(7)] = inst_31143__$1);

(statearr_31167[(9)] = inst_31144);

(statearr_31167[(8)] = inst_31142__$1);

return statearr_31167;
})();
if(cljs.core.truth_(inst_31145)){
var statearr_31169_32977 = state_31163__$1;
(statearr_31169_32977[(1)] = (8));

} else {
var statearr_31171_32978 = state_31163__$1;
(statearr_31171_32978[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (1))){
var inst_31129 = cljs.core.vec(chs);
var inst_31130 = inst_31129;
var state_31163__$1 = (function (){var statearr_31172 = state_31163;
(statearr_31172[(10)] = inst_31130);

return statearr_31172;
})();
var statearr_31173_32979 = state_31163__$1;
(statearr_31173_32979[(2)] = null);

(statearr_31173_32979[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (4))){
var inst_31130 = (state_31163[(10)]);
var state_31163__$1 = state_31163;
return cljs.core.async.ioc_alts_BANG_(state_31163__$1,(7),inst_31130);
} else {
if((state_val_31164 === (6))){
var inst_31159 = (state_31163[(2)]);
var state_31163__$1 = state_31163;
var statearr_31174_32980 = state_31163__$1;
(statearr_31174_32980[(2)] = inst_31159);

(statearr_31174_32980[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (3))){
var inst_31161 = (state_31163[(2)]);
var state_31163__$1 = state_31163;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31163__$1,inst_31161);
} else {
if((state_val_31164 === (2))){
var inst_31130 = (state_31163[(10)]);
var inst_31135 = cljs.core.count(inst_31130);
var inst_31136 = (inst_31135 > (0));
var state_31163__$1 = state_31163;
if(cljs.core.truth_(inst_31136)){
var statearr_31178_32982 = state_31163__$1;
(statearr_31178_32982[(1)] = (4));

} else {
var statearr_31179_32983 = state_31163__$1;
(statearr_31179_32983[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (11))){
var inst_31130 = (state_31163[(10)]);
var inst_31152 = (state_31163[(2)]);
var tmp31177 = inst_31130;
var inst_31130__$1 = tmp31177;
var state_31163__$1 = (function (){var statearr_31180 = state_31163;
(statearr_31180[(10)] = inst_31130__$1);

(statearr_31180[(11)] = inst_31152);

return statearr_31180;
})();
var statearr_31181_32984 = state_31163__$1;
(statearr_31181_32984[(2)] = null);

(statearr_31181_32984[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (9))){
var inst_31143 = (state_31163[(7)]);
var state_31163__$1 = state_31163;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31163__$1,(11),out,inst_31143);
} else {
if((state_val_31164 === (5))){
var inst_31157 = cljs.core.async.close_BANG_(out);
var state_31163__$1 = state_31163;
var statearr_31185_32985 = state_31163__$1;
(statearr_31185_32985[(2)] = inst_31157);

(statearr_31185_32985[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (10))){
var inst_31155 = (state_31163[(2)]);
var state_31163__$1 = state_31163;
var statearr_31186_32987 = state_31163__$1;
(statearr_31186_32987[(2)] = inst_31155);

(statearr_31186_32987[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31164 === (8))){
var inst_31143 = (state_31163[(7)]);
var inst_31130 = (state_31163[(10)]);
var inst_31144 = (state_31163[(9)]);
var inst_31142 = (state_31163[(8)]);
var inst_31147 = (function (){var cs = inst_31130;
var vec__31138 = inst_31142;
var v = inst_31143;
var c = inst_31144;
return (function (p1__31124_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,p1__31124_SHARP_);
});
})();
var inst_31148 = cljs.core.filterv(inst_31147,inst_31130);
var inst_31130__$1 = inst_31148;
var state_31163__$1 = (function (){var statearr_31190 = state_31163;
(statearr_31190[(10)] = inst_31130__$1);

return statearr_31190;
})();
var statearr_31191_32995 = state_31163__$1;
(statearr_31191_32995[(2)] = null);

(statearr_31191_32995[(1)] = (2));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31199 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31199[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31199[(1)] = (1));

return statearr_31199;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31163){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31163);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31200){var ex__28381__auto__ = e31200;
var statearr_31201_33000 = state_31163;
(statearr_31201_33000[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31163[(4)]))){
var statearr_31202_33001 = state_31163;
(statearr_31202_33001[(1)] = cljs.core.first((state_31163[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33002 = state_31163;
state_31163 = G__33002;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31163){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31163);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31206 = f__29158__auto__();
(statearr_31206[(6)] = c__29157__auto___32976);

return statearr_31206;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var G__31211 = arguments.length;
switch (G__31211) {
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
var c__29157__auto___33008 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31251){
var state_val_31252 = (state_31251[(1)]);
if((state_val_31252 === (7))){
var inst_31230 = (state_31251[(7)]);
var inst_31230__$1 = (state_31251[(2)]);
var inst_31231 = (inst_31230__$1 == null);
var inst_31232 = cljs.core.not(inst_31231);
var state_31251__$1 = (function (){var statearr_31256 = state_31251;
(statearr_31256[(7)] = inst_31230__$1);

return statearr_31256;
})();
if(inst_31232){
var statearr_31257_33013 = state_31251__$1;
(statearr_31257_33013[(1)] = (8));

} else {
var statearr_31258_33015 = state_31251__$1;
(statearr_31258_33015[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (1))){
var inst_31221 = (0);
var state_31251__$1 = (function (){var statearr_31259 = state_31251;
(statearr_31259[(8)] = inst_31221);

return statearr_31259;
})();
var statearr_31260_33020 = state_31251__$1;
(statearr_31260_33020[(2)] = null);

(statearr_31260_33020[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (4))){
var state_31251__$1 = state_31251;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31251__$1,(7),ch);
} else {
if((state_val_31252 === (6))){
var inst_31246 = (state_31251[(2)]);
var state_31251__$1 = state_31251;
var statearr_31268_33021 = state_31251__$1;
(statearr_31268_33021[(2)] = inst_31246);

(statearr_31268_33021[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (3))){
var inst_31248 = (state_31251[(2)]);
var inst_31249 = cljs.core.async.close_BANG_(out);
var state_31251__$1 = (function (){var statearr_31275 = state_31251;
(statearr_31275[(9)] = inst_31248);

return statearr_31275;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31251__$1,inst_31249);
} else {
if((state_val_31252 === (2))){
var inst_31221 = (state_31251[(8)]);
var inst_31223 = (inst_31221 < n);
var state_31251__$1 = state_31251;
if(cljs.core.truth_(inst_31223)){
var statearr_31276_33022 = state_31251__$1;
(statearr_31276_33022[(1)] = (4));

} else {
var statearr_31277_33023 = state_31251__$1;
(statearr_31277_33023[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (11))){
var inst_31221 = (state_31251[(8)]);
var inst_31238 = (state_31251[(2)]);
var inst_31239 = (inst_31221 + (1));
var inst_31221__$1 = inst_31239;
var state_31251__$1 = (function (){var statearr_31281 = state_31251;
(statearr_31281[(8)] = inst_31221__$1);

(statearr_31281[(10)] = inst_31238);

return statearr_31281;
})();
var statearr_31282_33025 = state_31251__$1;
(statearr_31282_33025[(2)] = null);

(statearr_31282_33025[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (9))){
var state_31251__$1 = state_31251;
var statearr_31290_33026 = state_31251__$1;
(statearr_31290_33026[(2)] = null);

(statearr_31290_33026[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (5))){
var state_31251__$1 = state_31251;
var statearr_31294_33027 = state_31251__$1;
(statearr_31294_33027[(2)] = null);

(statearr_31294_33027[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (10))){
var inst_31243 = (state_31251[(2)]);
var state_31251__$1 = state_31251;
var statearr_31299_33028 = state_31251__$1;
(statearr_31299_33028[(2)] = inst_31243);

(statearr_31299_33028[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31252 === (8))){
var inst_31230 = (state_31251[(7)]);
var state_31251__$1 = state_31251;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31251__$1,(11),out,inst_31230);
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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31300 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31300[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31300[(1)] = (1));

return statearr_31300;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31251){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31251);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31303){var ex__28381__auto__ = e31303;
var statearr_31304_33029 = state_31251;
(statearr_31304_33029[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31251[(4)]))){
var statearr_31305_33032 = state_31251;
(statearr_31305_33032[(1)] = cljs.core.first((state_31251[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33034 = state_31251;
state_31251 = G__33034;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31251){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31251);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31309 = f__29158__auto__();
(statearr_31309[(6)] = c__29157__auto___33008);

return statearr_31309;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
cljs.core.async.t_cljs$core$async31314 = (function (f,ch,meta31312,_,fn1,meta31315){
this.f = f;
this.ch = ch;
this.meta31312 = meta31312;
this._ = _;
this.fn1 = fn1;
this.meta31315 = meta31315;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31316,meta31315__$1){
var self__ = this;
var _31316__$1 = this;
return (new cljs.core.async.t_cljs$core$async31314(self__.f,self__.ch,self__.meta31312,self__._,self__.fn1,meta31315__$1));
}));

(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31316){
var self__ = this;
var _31316__$1 = this;
return self__.meta31315;
}));

(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.fn1);
}));

(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async31314.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit(self__.fn1);
return (function (p1__31310_SHARP_){
var G__31320 = (((p1__31310_SHARP_ == null))?null:(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(p1__31310_SHARP_) : self__.f.call(null, p1__31310_SHARP_)));
return (f1.cljs$core$IFn$_invoke$arity$1 ? f1.cljs$core$IFn$_invoke$arity$1(G__31320) : f1.call(null, G__31320));
});
}));

(cljs.core.async.t_cljs$core$async31314.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31312","meta31312",-363794178,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("cljs.core.async","t_cljs$core$async31311","cljs.core.async/t_cljs$core$async31311",1492822159,null)], null)),new cljs.core.Symbol(null,"fn1","fn1",895834444,null),new cljs.core.Symbol(null,"meta31315","meta31315",-1052145173,null)], null);
}));

(cljs.core.async.t_cljs$core$async31314.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31314.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31314");

(cljs.core.async.t_cljs$core$async31314.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31314");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31314.
 */
cljs.core.async.__GT_t_cljs$core$async31314 = (function cljs$core$async$__GT_t_cljs$core$async31314(f,ch,meta31312,_,fn1,meta31315){
return (new cljs.core.async.t_cljs$core$async31314(f,ch,meta31312,_,fn1,meta31315));
});



/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31311 = (function (f,ch,meta31312){
this.f = f;
this.ch = ch;
this.meta31312 = meta31312;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31313,meta31312__$1){
var self__ = this;
var _31313__$1 = this;
return (new cljs.core.async.t_cljs$core$async31311(self__.f,self__.ch,meta31312__$1));
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31313){
var self__ = this;
var _31313__$1 = this;
return self__.meta31312;
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_(self__.ch,(new cljs.core.async.t_cljs$core$async31314(self__.f,self__.ch,self__.meta31312,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY)));
if(cljs.core.truth_((function (){var and__5043__auto__ = ret;
if(cljs.core.truth_(and__5043__auto__)){
return (!((cljs.core.deref(ret) == null)));
} else {
return and__5043__auto__;
}
})())){
return cljs.core.async.impl.channels.box((function (){var G__31321 = cljs.core.deref(ret);
return (self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(G__31321) : self__.f.call(null, G__31321));
})());
} else {
return ret;
}
}));

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31311.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
}));

(cljs.core.async.t_cljs$core$async31311.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31312","meta31312",-363794178,null)], null);
}));

(cljs.core.async.t_cljs$core$async31311.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31311.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31311");

(cljs.core.async.t_cljs$core$async31311.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31311");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31311.
 */
cljs.core.async.__GT_t_cljs$core$async31311 = (function cljs$core$async$__GT_t_cljs$core$async31311(f,ch,meta31312){
return (new cljs.core.async.t_cljs$core$async31311(f,ch,meta31312));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31311(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31324 = (function (f,ch,meta31325){
this.f = f;
this.ch = ch;
this.meta31325 = meta31325;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31326,meta31325__$1){
var self__ = this;
var _31326__$1 = this;
return (new cljs.core.async.t_cljs$core$async31324(self__.f,self__.ch,meta31325__$1));
}));

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31326){
var self__ = this;
var _31326__$1 = this;
return self__.meta31325;
}));

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
}));

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31324.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(val) : self__.f.call(null, val)),fn1);
}));

(cljs.core.async.t_cljs$core$async31324.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31325","meta31325",-1953329123,null)], null);
}));

(cljs.core.async.t_cljs$core$async31324.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31324.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31324");

(cljs.core.async.t_cljs$core$async31324.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31324");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31324.
 */
cljs.core.async.__GT_t_cljs$core$async31324 = (function cljs$core$async$__GT_t_cljs$core$async31324(f,ch,meta31325){
return (new cljs.core.async.t_cljs$core$async31324(f,ch,meta31325));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31324(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31352 = (function (p,ch,meta31353){
this.p = p;
this.ch = ch;
this.meta31353 = meta31353;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31354,meta31353__$1){
var self__ = this;
var _31354__$1 = this;
return (new cljs.core.async.t_cljs$core$async31352(self__.p,self__.ch,meta31353__$1));
}));

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31354){
var self__ = this;
var _31354__$1 = this;
return self__.meta31353;
}));

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
}));

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31352.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.p.cljs$core$IFn$_invoke$arity$1 ? self__.p.cljs$core$IFn$_invoke$arity$1(val) : self__.p.call(null, val)))){
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box(cljs.core.not(cljs.core.async.impl.protocols.closed_QMARK_(self__.ch)));
}
}));

(cljs.core.async.t_cljs$core$async31352.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31353","meta31353",-129301686,null)], null);
}));

(cljs.core.async.t_cljs$core$async31352.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31352.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31352");

(cljs.core.async.t_cljs$core$async31352.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31352");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31352.
 */
cljs.core.async.__GT_t_cljs$core$async31352 = (function cljs$core$async$__GT_t_cljs$core$async31352(p,ch,meta31353){
return (new cljs.core.async.t_cljs$core$async31352(p,ch,meta31353));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
return (new cljs.core.async.t_cljs$core$async31352(p,ch,cljs.core.PersistentArrayMap.EMPTY));
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
var G__31360 = arguments.length;
switch (G__31360) {
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
var c__29157__auto___33064 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31396){
var state_val_31397 = (state_31396[(1)]);
if((state_val_31397 === (7))){
var inst_31392 = (state_31396[(2)]);
var state_31396__$1 = state_31396;
var statearr_31398_33065 = state_31396__$1;
(statearr_31398_33065[(2)] = inst_31392);

(statearr_31398_33065[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (1))){
var state_31396__$1 = state_31396;
var statearr_31399_33066 = state_31396__$1;
(statearr_31399_33066[(2)] = null);

(statearr_31399_33066[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (4))){
var inst_31378 = (state_31396[(7)]);
var inst_31378__$1 = (state_31396[(2)]);
var inst_31379 = (inst_31378__$1 == null);
var state_31396__$1 = (function (){var statearr_31409 = state_31396;
(statearr_31409[(7)] = inst_31378__$1);

return statearr_31409;
})();
if(cljs.core.truth_(inst_31379)){
var statearr_31410_33071 = state_31396__$1;
(statearr_31410_33071[(1)] = (5));

} else {
var statearr_31411_33072 = state_31396__$1;
(statearr_31411_33072[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (6))){
var inst_31378 = (state_31396[(7)]);
var inst_31383 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_31378) : p.call(null, inst_31378));
var state_31396__$1 = state_31396;
if(cljs.core.truth_(inst_31383)){
var statearr_31412_33073 = state_31396__$1;
(statearr_31412_33073[(1)] = (8));

} else {
var statearr_31413_33074 = state_31396__$1;
(statearr_31413_33074[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (3))){
var inst_31394 = (state_31396[(2)]);
var state_31396__$1 = state_31396;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31396__$1,inst_31394);
} else {
if((state_val_31397 === (2))){
var state_31396__$1 = state_31396;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31396__$1,(4),ch);
} else {
if((state_val_31397 === (11))){
var inst_31386 = (state_31396[(2)]);
var state_31396__$1 = state_31396;
var statearr_31415_33079 = state_31396__$1;
(statearr_31415_33079[(2)] = inst_31386);

(statearr_31415_33079[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (9))){
var state_31396__$1 = state_31396;
var statearr_31416_33083 = state_31396__$1;
(statearr_31416_33083[(2)] = null);

(statearr_31416_33083[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (5))){
var inst_31381 = cljs.core.async.close_BANG_(out);
var state_31396__$1 = state_31396;
var statearr_31417_33090 = state_31396__$1;
(statearr_31417_33090[(2)] = inst_31381);

(statearr_31417_33090[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (10))){
var inst_31389 = (state_31396[(2)]);
var state_31396__$1 = (function (){var statearr_31418 = state_31396;
(statearr_31418[(8)] = inst_31389);

return statearr_31418;
})();
var statearr_31419_33091 = state_31396__$1;
(statearr_31419_33091[(2)] = null);

(statearr_31419_33091[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31397 === (8))){
var inst_31378 = (state_31396[(7)]);
var state_31396__$1 = state_31396;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31396__$1,(11),out,inst_31378);
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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31420 = [null,null,null,null,null,null,null,null,null];
(statearr_31420[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31420[(1)] = (1));

return statearr_31420;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31396){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31396);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31421){var ex__28381__auto__ = e31421;
var statearr_31422_33094 = state_31396;
(statearr_31422_33094[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31396[(4)]))){
var statearr_31423_33098 = state_31396;
(statearr_31423_33098[(1)] = cljs.core.first((state_31396[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33103 = state_31396;
state_31396 = G__33103;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31396){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31396);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31424 = f__29158__auto__();
(statearr_31424[(6)] = c__29157__auto___33064);

return statearr_31424;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
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
var c__29157__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31498){
var state_val_31499 = (state_31498[(1)]);
if((state_val_31499 === (7))){
var inst_31494 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
var statearr_31509_33112 = state_31498__$1;
(statearr_31509_33112[(2)] = inst_31494);

(statearr_31509_33112[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (20))){
var inst_31464 = (state_31498[(7)]);
var inst_31475 = (state_31498[(2)]);
var inst_31476 = cljs.core.next(inst_31464);
var inst_31450 = inst_31476;
var inst_31451 = null;
var inst_31452 = (0);
var inst_31453 = (0);
var state_31498__$1 = (function (){var statearr_31510 = state_31498;
(statearr_31510[(8)] = inst_31450);

(statearr_31510[(9)] = inst_31453);

(statearr_31510[(10)] = inst_31475);

(statearr_31510[(11)] = inst_31451);

(statearr_31510[(12)] = inst_31452);

return statearr_31510;
})();
var statearr_31518_33117 = state_31498__$1;
(statearr_31518_33117[(2)] = null);

(statearr_31518_33117[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (1))){
var state_31498__$1 = state_31498;
var statearr_31519_33122 = state_31498__$1;
(statearr_31519_33122[(2)] = null);

(statearr_31519_33122[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (4))){
var inst_31438 = (state_31498[(13)]);
var inst_31438__$1 = (state_31498[(2)]);
var inst_31439 = (inst_31438__$1 == null);
var state_31498__$1 = (function (){var statearr_31521 = state_31498;
(statearr_31521[(13)] = inst_31438__$1);

return statearr_31521;
})();
if(cljs.core.truth_(inst_31439)){
var statearr_31522_33127 = state_31498__$1;
(statearr_31522_33127[(1)] = (5));

} else {
var statearr_31523_33128 = state_31498__$1;
(statearr_31523_33128[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (15))){
var state_31498__$1 = state_31498;
var statearr_31527_33129 = state_31498__$1;
(statearr_31527_33129[(2)] = null);

(statearr_31527_33129[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (21))){
var state_31498__$1 = state_31498;
var statearr_31537_33130 = state_31498__$1;
(statearr_31537_33130[(2)] = null);

(statearr_31537_33130[(1)] = (23));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (13))){
var inst_31450 = (state_31498[(8)]);
var inst_31453 = (state_31498[(9)]);
var inst_31451 = (state_31498[(11)]);
var inst_31452 = (state_31498[(12)]);
var inst_31460 = (state_31498[(2)]);
var inst_31461 = (inst_31453 + (1));
var tmp31524 = inst_31450;
var tmp31525 = inst_31451;
var tmp31526 = inst_31452;
var inst_31450__$1 = tmp31524;
var inst_31451__$1 = tmp31525;
var inst_31452__$1 = tmp31526;
var inst_31453__$1 = inst_31461;
var state_31498__$1 = (function (){var statearr_31538 = state_31498;
(statearr_31538[(8)] = inst_31450__$1);

(statearr_31538[(9)] = inst_31453__$1);

(statearr_31538[(14)] = inst_31460);

(statearr_31538[(11)] = inst_31451__$1);

(statearr_31538[(12)] = inst_31452__$1);

return statearr_31538;
})();
var statearr_31539_33135 = state_31498__$1;
(statearr_31539_33135[(2)] = null);

(statearr_31539_33135[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (22))){
var state_31498__$1 = state_31498;
var statearr_31543_33136 = state_31498__$1;
(statearr_31543_33136[(2)] = null);

(statearr_31543_33136[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (6))){
var inst_31438 = (state_31498[(13)]);
var inst_31448 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31438) : f.call(null, inst_31438));
var inst_31449 = cljs.core.seq(inst_31448);
var inst_31450 = inst_31449;
var inst_31451 = null;
var inst_31452 = (0);
var inst_31453 = (0);
var state_31498__$1 = (function (){var statearr_31548 = state_31498;
(statearr_31548[(8)] = inst_31450);

(statearr_31548[(9)] = inst_31453);

(statearr_31548[(11)] = inst_31451);

(statearr_31548[(12)] = inst_31452);

return statearr_31548;
})();
var statearr_31556_33137 = state_31498__$1;
(statearr_31556_33137[(2)] = null);

(statearr_31556_33137[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (17))){
var inst_31464 = (state_31498[(7)]);
var inst_31468 = cljs.core.chunk_first(inst_31464);
var inst_31469 = cljs.core.chunk_rest(inst_31464);
var inst_31470 = cljs.core.count(inst_31468);
var inst_31450 = inst_31469;
var inst_31451 = inst_31468;
var inst_31452 = inst_31470;
var inst_31453 = (0);
var state_31498__$1 = (function (){var statearr_31557 = state_31498;
(statearr_31557[(8)] = inst_31450);

(statearr_31557[(9)] = inst_31453);

(statearr_31557[(11)] = inst_31451);

(statearr_31557[(12)] = inst_31452);

return statearr_31557;
})();
var statearr_31559_33138 = state_31498__$1;
(statearr_31559_33138[(2)] = null);

(statearr_31559_33138[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (3))){
var inst_31496 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31498__$1,inst_31496);
} else {
if((state_val_31499 === (12))){
var inst_31484 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
var statearr_31563_33141 = state_31498__$1;
(statearr_31563_33141[(2)] = inst_31484);

(statearr_31563_33141[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (2))){
var state_31498__$1 = state_31498;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31498__$1,(4),in$);
} else {
if((state_val_31499 === (23))){
var inst_31492 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
var statearr_31566_33143 = state_31498__$1;
(statearr_31566_33143[(2)] = inst_31492);

(statearr_31566_33143[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (19))){
var inst_31479 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
var statearr_31570_33147 = state_31498__$1;
(statearr_31570_33147[(2)] = inst_31479);

(statearr_31570_33147[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (11))){
var inst_31450 = (state_31498[(8)]);
var inst_31464 = (state_31498[(7)]);
var inst_31464__$1 = cljs.core.seq(inst_31450);
var state_31498__$1 = (function (){var statearr_31576 = state_31498;
(statearr_31576[(7)] = inst_31464__$1);

return statearr_31576;
})();
if(inst_31464__$1){
var statearr_31577_33149 = state_31498__$1;
(statearr_31577_33149[(1)] = (14));

} else {
var statearr_31578_33150 = state_31498__$1;
(statearr_31578_33150[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (9))){
var inst_31486 = (state_31498[(2)]);
var inst_31487 = cljs.core.async.impl.protocols.closed_QMARK_(out);
var state_31498__$1 = (function (){var statearr_31579 = state_31498;
(statearr_31579[(15)] = inst_31486);

return statearr_31579;
})();
if(cljs.core.truth_(inst_31487)){
var statearr_31580_33154 = state_31498__$1;
(statearr_31580_33154[(1)] = (21));

} else {
var statearr_31581_33156 = state_31498__$1;
(statearr_31581_33156[(1)] = (22));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (5))){
var inst_31441 = cljs.core.async.close_BANG_(out);
var state_31498__$1 = state_31498;
var statearr_31589_33159 = state_31498__$1;
(statearr_31589_33159[(2)] = inst_31441);

(statearr_31589_33159[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (14))){
var inst_31464 = (state_31498[(7)]);
var inst_31466 = cljs.core.chunked_seq_QMARK_(inst_31464);
var state_31498__$1 = state_31498;
if(inst_31466){
var statearr_31593_33162 = state_31498__$1;
(statearr_31593_33162[(1)] = (17));

} else {
var statearr_31594_33163 = state_31498__$1;
(statearr_31594_33163[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (16))){
var inst_31482 = (state_31498[(2)]);
var state_31498__$1 = state_31498;
var statearr_31596_33164 = state_31498__$1;
(statearr_31596_33164[(2)] = inst_31482);

(statearr_31596_33164[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31499 === (10))){
var inst_31453 = (state_31498[(9)]);
var inst_31451 = (state_31498[(11)]);
var inst_31458 = cljs.core._nth(inst_31451,inst_31453);
var state_31498__$1 = state_31498;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31498__$1,(13),out,inst_31458);
} else {
if((state_val_31499 === (18))){
var inst_31464 = (state_31498[(7)]);
var inst_31473 = cljs.core.first(inst_31464);
var state_31498__$1 = state_31498;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31498__$1,(20),out,inst_31473);
} else {
if((state_val_31499 === (8))){
var inst_31453 = (state_31498[(9)]);
var inst_31452 = (state_31498[(12)]);
var inst_31455 = (inst_31453 < inst_31452);
var inst_31456 = inst_31455;
var state_31498__$1 = state_31498;
if(cljs.core.truth_(inst_31456)){
var statearr_31597_33171 = state_31498__$1;
(statearr_31597_33171[(1)] = (10));

} else {
var statearr_31598_33172 = state_31498__$1;
(statearr_31598_33172[(1)] = (11));

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
var cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_31599 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31599[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__);

(statearr_31599[(1)] = (1));

return statearr_31599;
});
var cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1 = (function (state_31498){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31498);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31600){var ex__28381__auto__ = e31600;
var statearr_31601_33174 = state_31498;
(statearr_31601_33174[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31498[(4)]))){
var statearr_31603_33177 = state_31498;
(statearr_31603_33177[(1)] = cljs.core.first((state_31498[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33179 = state_31498;
state_31498 = G__33179;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__ = function(state_31498){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1.call(this,state_31498);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31605 = f__29158__auto__();
(statearr_31605[(6)] = c__29157__auto__);

return statearr_31605;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));

return c__29157__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var G__31613 = arguments.length;
switch (G__31613) {
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
var G__31624 = arguments.length;
switch (G__31624) {
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
var G__31628 = arguments.length;
switch (G__31628) {
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
var c__29157__auto___33188 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31657){
var state_val_31658 = (state_31657[(1)]);
if((state_val_31658 === (7))){
var inst_31652 = (state_31657[(2)]);
var state_31657__$1 = state_31657;
var statearr_31659_33189 = state_31657__$1;
(statearr_31659_33189[(2)] = inst_31652);

(statearr_31659_33189[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (1))){
var inst_31634 = null;
var state_31657__$1 = (function (){var statearr_31660 = state_31657;
(statearr_31660[(7)] = inst_31634);

return statearr_31660;
})();
var statearr_31661_33190 = state_31657__$1;
(statearr_31661_33190[(2)] = null);

(statearr_31661_33190[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (4))){
var inst_31637 = (state_31657[(8)]);
var inst_31637__$1 = (state_31657[(2)]);
var inst_31638 = (inst_31637__$1 == null);
var inst_31639 = cljs.core.not(inst_31638);
var state_31657__$1 = (function (){var statearr_31662 = state_31657;
(statearr_31662[(8)] = inst_31637__$1);

return statearr_31662;
})();
if(inst_31639){
var statearr_31663_33191 = state_31657__$1;
(statearr_31663_33191[(1)] = (5));

} else {
var statearr_31664_33192 = state_31657__$1;
(statearr_31664_33192[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (6))){
var state_31657__$1 = state_31657;
var statearr_31665_33193 = state_31657__$1;
(statearr_31665_33193[(2)] = null);

(statearr_31665_33193[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (3))){
var inst_31654 = (state_31657[(2)]);
var inst_31655 = cljs.core.async.close_BANG_(out);
var state_31657__$1 = (function (){var statearr_31666 = state_31657;
(statearr_31666[(9)] = inst_31654);

return statearr_31666;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31657__$1,inst_31655);
} else {
if((state_val_31658 === (2))){
var state_31657__$1 = state_31657;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31657__$1,(4),ch);
} else {
if((state_val_31658 === (11))){
var inst_31637 = (state_31657[(8)]);
var inst_31646 = (state_31657[(2)]);
var inst_31634 = inst_31637;
var state_31657__$1 = (function (){var statearr_31671 = state_31657;
(statearr_31671[(7)] = inst_31634);

(statearr_31671[(10)] = inst_31646);

return statearr_31671;
})();
var statearr_31675_33194 = state_31657__$1;
(statearr_31675_33194[(2)] = null);

(statearr_31675_33194[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (9))){
var inst_31637 = (state_31657[(8)]);
var state_31657__$1 = state_31657;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31657__$1,(11),out,inst_31637);
} else {
if((state_val_31658 === (5))){
var inst_31634 = (state_31657[(7)]);
var inst_31637 = (state_31657[(8)]);
var inst_31641 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31637,inst_31634);
var state_31657__$1 = state_31657;
if(inst_31641){
var statearr_31678_33196 = state_31657__$1;
(statearr_31678_33196[(1)] = (8));

} else {
var statearr_31679_33197 = state_31657__$1;
(statearr_31679_33197[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (10))){
var inst_31649 = (state_31657[(2)]);
var state_31657__$1 = state_31657;
var statearr_31683_33198 = state_31657__$1;
(statearr_31683_33198[(2)] = inst_31649);

(statearr_31683_33198[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31658 === (8))){
var inst_31634 = (state_31657[(7)]);
var tmp31676 = inst_31634;
var inst_31634__$1 = tmp31676;
var state_31657__$1 = (function (){var statearr_31684 = state_31657;
(statearr_31684[(7)] = inst_31634__$1);

return statearr_31684;
})();
var statearr_31691_33203 = state_31657__$1;
(statearr_31691_33203[(2)] = null);

(statearr_31691_33203[(1)] = (2));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31695 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31695[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31695[(1)] = (1));

return statearr_31695;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31657){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31657);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31699){var ex__28381__auto__ = e31699;
var statearr_31700_33206 = state_31657;
(statearr_31700_33206[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31657[(4)]))){
var statearr_31701_33207 = state_31657;
(statearr_31701_33207[(1)] = cljs.core.first((state_31657[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33208 = state_31657;
state_31657 = G__33208;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31657){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31657);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31706 = f__29158__auto__();
(statearr_31706[(6)] = c__29157__auto___33188);

return statearr_31706;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));


return out;
}));

(cljs.core.async.unique.cljs$lang$maxFixedArity = 2);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var G__31714 = arguments.length;
switch (G__31714) {
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
var c__29157__auto___33211 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31769){
var state_val_31770 = (state_31769[(1)]);
if((state_val_31770 === (7))){
var inst_31764 = (state_31769[(2)]);
var state_31769__$1 = state_31769;
var statearr_31772_33214 = state_31769__$1;
(statearr_31772_33214[(2)] = inst_31764);

(statearr_31772_33214[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (1))){
var inst_31726 = (new Array(n));
var inst_31727 = inst_31726;
var inst_31728 = (0);
var state_31769__$1 = (function (){var statearr_31773 = state_31769;
(statearr_31773[(7)] = inst_31727);

(statearr_31773[(8)] = inst_31728);

return statearr_31773;
})();
var statearr_31774_33221 = state_31769__$1;
(statearr_31774_33221[(2)] = null);

(statearr_31774_33221[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (4))){
var inst_31731 = (state_31769[(9)]);
var inst_31731__$1 = (state_31769[(2)]);
var inst_31732 = (inst_31731__$1 == null);
var inst_31733 = cljs.core.not(inst_31732);
var state_31769__$1 = (function (){var statearr_31775 = state_31769;
(statearr_31775[(9)] = inst_31731__$1);

return statearr_31775;
})();
if(inst_31733){
var statearr_31788_33222 = state_31769__$1;
(statearr_31788_33222[(1)] = (5));

} else {
var statearr_31789_33227 = state_31769__$1;
(statearr_31789_33227[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (15))){
var inst_31758 = (state_31769[(2)]);
var state_31769__$1 = state_31769;
var statearr_31795_33231 = state_31769__$1;
(statearr_31795_33231[(2)] = inst_31758);

(statearr_31795_33231[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (13))){
var state_31769__$1 = state_31769;
var statearr_31796_33236 = state_31769__$1;
(statearr_31796_33236[(2)] = null);

(statearr_31796_33236[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (6))){
var inst_31728 = (state_31769[(8)]);
var inst_31754 = (inst_31728 > (0));
var state_31769__$1 = state_31769;
if(cljs.core.truth_(inst_31754)){
var statearr_31802_33241 = state_31769__$1;
(statearr_31802_33241[(1)] = (12));

} else {
var statearr_31803_33242 = state_31769__$1;
(statearr_31803_33242[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (3))){
var inst_31766 = (state_31769[(2)]);
var state_31769__$1 = state_31769;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31769__$1,inst_31766);
} else {
if((state_val_31770 === (12))){
var inst_31727 = (state_31769[(7)]);
var inst_31756 = cljs.core.vec(inst_31727);
var state_31769__$1 = state_31769;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31769__$1,(15),out,inst_31756);
} else {
if((state_val_31770 === (2))){
var state_31769__$1 = state_31769;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31769__$1,(4),ch);
} else {
if((state_val_31770 === (11))){
var inst_31748 = (state_31769[(2)]);
var inst_31749 = (new Array(n));
var inst_31727 = inst_31749;
var inst_31728 = (0);
var state_31769__$1 = (function (){var statearr_31804 = state_31769;
(statearr_31804[(10)] = inst_31748);

(statearr_31804[(7)] = inst_31727);

(statearr_31804[(8)] = inst_31728);

return statearr_31804;
})();
var statearr_31806_33255 = state_31769__$1;
(statearr_31806_33255[(2)] = null);

(statearr_31806_33255[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (9))){
var inst_31727 = (state_31769[(7)]);
var inst_31746 = cljs.core.vec(inst_31727);
var state_31769__$1 = state_31769;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31769__$1,(11),out,inst_31746);
} else {
if((state_val_31770 === (5))){
var inst_31731 = (state_31769[(9)]);
var inst_31739 = (state_31769[(11)]);
var inst_31727 = (state_31769[(7)]);
var inst_31728 = (state_31769[(8)]);
var inst_31738 = (inst_31727[inst_31728] = inst_31731);
var inst_31739__$1 = (inst_31728 + (1));
var inst_31740 = (inst_31739__$1 < n);
var state_31769__$1 = (function (){var statearr_31808 = state_31769;
(statearr_31808[(11)] = inst_31739__$1);

(statearr_31808[(12)] = inst_31738);

return statearr_31808;
})();
if(cljs.core.truth_(inst_31740)){
var statearr_31809_33276 = state_31769__$1;
(statearr_31809_33276[(1)] = (8));

} else {
var statearr_31810_33277 = state_31769__$1;
(statearr_31810_33277[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (14))){
var inst_31761 = (state_31769[(2)]);
var inst_31762 = cljs.core.async.close_BANG_(out);
var state_31769__$1 = (function (){var statearr_31812 = state_31769;
(statearr_31812[(13)] = inst_31761);

return statearr_31812;
})();
var statearr_31818_33284 = state_31769__$1;
(statearr_31818_33284[(2)] = inst_31762);

(statearr_31818_33284[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (10))){
var inst_31752 = (state_31769[(2)]);
var state_31769__$1 = state_31769;
var statearr_31819_33285 = state_31769__$1;
(statearr_31819_33285[(2)] = inst_31752);

(statearr_31819_33285[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31770 === (8))){
var inst_31739 = (state_31769[(11)]);
var inst_31727 = (state_31769[(7)]);
var tmp31811 = inst_31727;
var inst_31727__$1 = tmp31811;
var inst_31728 = inst_31739;
var state_31769__$1 = (function (){var statearr_31820 = state_31769;
(statearr_31820[(7)] = inst_31727__$1);

(statearr_31820[(8)] = inst_31728);

return statearr_31820;
})();
var statearr_31821_33290 = state_31769__$1;
(statearr_31821_33290[(2)] = null);

(statearr_31821_33290[(1)] = (2));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31822 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31822[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31822[(1)] = (1));

return statearr_31822;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31769){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31769);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31823){var ex__28381__auto__ = e31823;
var statearr_31824_33294 = state_31769;
(statearr_31824_33294[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31769[(4)]))){
var statearr_31825_33295 = state_31769;
(statearr_31825_33295[(1)] = cljs.core.first((state_31769[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33302 = state_31769;
state_31769 = G__33302;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31769){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31769);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31827 = f__29158__auto__();
(statearr_31827[(6)] = c__29157__auto___33211);

return statearr_31827;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));


return out;
}));

(cljs.core.async.partition.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var G__31835 = arguments.length;
switch (G__31835) {
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
var c__29157__auto___33307 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29158__auto__ = (function (){var switch__28377__auto__ = (function (state_31893){
var state_val_31894 = (state_31893[(1)]);
if((state_val_31894 === (7))){
var inst_31889 = (state_31893[(2)]);
var state_31893__$1 = state_31893;
var statearr_31895_33311 = state_31893__$1;
(statearr_31895_33311[(2)] = inst_31889);

(statearr_31895_33311[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (1))){
var inst_31846 = [];
var inst_31847 = inst_31846;
var inst_31848 = new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123);
var state_31893__$1 = (function (){var statearr_31896 = state_31893;
(statearr_31896[(7)] = inst_31847);

(statearr_31896[(8)] = inst_31848);

return statearr_31896;
})();
var statearr_31897_33312 = state_31893__$1;
(statearr_31897_33312[(2)] = null);

(statearr_31897_33312[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (4))){
var inst_31851 = (state_31893[(9)]);
var inst_31851__$1 = (state_31893[(2)]);
var inst_31855 = (inst_31851__$1 == null);
var inst_31856 = cljs.core.not(inst_31855);
var state_31893__$1 = (function (){var statearr_31904 = state_31893;
(statearr_31904[(9)] = inst_31851__$1);

return statearr_31904;
})();
if(inst_31856){
var statearr_31905_33313 = state_31893__$1;
(statearr_31905_33313[(1)] = (5));

} else {
var statearr_31906_33314 = state_31893__$1;
(statearr_31906_33314[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (15))){
var inst_31847 = (state_31893[(7)]);
var inst_31881 = cljs.core.vec(inst_31847);
var state_31893__$1 = state_31893;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31893__$1,(18),out,inst_31881);
} else {
if((state_val_31894 === (13))){
var inst_31876 = (state_31893[(2)]);
var state_31893__$1 = state_31893;
var statearr_31907_33316 = state_31893__$1;
(statearr_31907_33316[(2)] = inst_31876);

(statearr_31907_33316[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (6))){
var inst_31847 = (state_31893[(7)]);
var inst_31878 = inst_31847.length;
var inst_31879 = (inst_31878 > (0));
var state_31893__$1 = state_31893;
if(cljs.core.truth_(inst_31879)){
var statearr_31911_33317 = state_31893__$1;
(statearr_31911_33317[(1)] = (15));

} else {
var statearr_31912_33318 = state_31893__$1;
(statearr_31912_33318[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (17))){
var inst_31886 = (state_31893[(2)]);
var inst_31887 = cljs.core.async.close_BANG_(out);
var state_31893__$1 = (function (){var statearr_31913 = state_31893;
(statearr_31913[(10)] = inst_31886);

return statearr_31913;
})();
var statearr_31914_33319 = state_31893__$1;
(statearr_31914_33319[(2)] = inst_31887);

(statearr_31914_33319[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (3))){
var inst_31891 = (state_31893[(2)]);
var state_31893__$1 = state_31893;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31893__$1,inst_31891);
} else {
if((state_val_31894 === (12))){
var inst_31847 = (state_31893[(7)]);
var inst_31869 = cljs.core.vec(inst_31847);
var state_31893__$1 = state_31893;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31893__$1,(14),out,inst_31869);
} else {
if((state_val_31894 === (2))){
var state_31893__$1 = state_31893;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31893__$1,(4),ch);
} else {
if((state_val_31894 === (11))){
var inst_31851 = (state_31893[(9)]);
var inst_31858 = (state_31893[(11)]);
var inst_31847 = (state_31893[(7)]);
var inst_31866 = inst_31847.push(inst_31851);
var tmp31915 = inst_31847;
var inst_31847__$1 = tmp31915;
var inst_31848 = inst_31858;
var state_31893__$1 = (function (){var statearr_31916 = state_31893;
(statearr_31916[(12)] = inst_31866);

(statearr_31916[(7)] = inst_31847__$1);

(statearr_31916[(8)] = inst_31848);

return statearr_31916;
})();
var statearr_31917_33325 = state_31893__$1;
(statearr_31917_33325[(2)] = null);

(statearr_31917_33325[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (9))){
var inst_31848 = (state_31893[(8)]);
var inst_31862 = cljs.core.keyword_identical_QMARK_(inst_31848,new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123));
var state_31893__$1 = state_31893;
var statearr_31918_33330 = state_31893__$1;
(statearr_31918_33330[(2)] = inst_31862);

(statearr_31918_33330[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (5))){
var inst_31851 = (state_31893[(9)]);
var inst_31859 = (state_31893[(13)]);
var inst_31858 = (state_31893[(11)]);
var inst_31848 = (state_31893[(8)]);
var inst_31858__$1 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31851) : f.call(null, inst_31851));
var inst_31859__$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31858__$1,inst_31848);
var state_31893__$1 = (function (){var statearr_31919 = state_31893;
(statearr_31919[(13)] = inst_31859__$1);

(statearr_31919[(11)] = inst_31858__$1);

return statearr_31919;
})();
if(inst_31859__$1){
var statearr_31920_33332 = state_31893__$1;
(statearr_31920_33332[(1)] = (8));

} else {
var statearr_31921_33333 = state_31893__$1;
(statearr_31921_33333[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (14))){
var inst_31851 = (state_31893[(9)]);
var inst_31858 = (state_31893[(11)]);
var inst_31871 = (state_31893[(2)]);
var inst_31872 = [];
var inst_31873 = inst_31872.push(inst_31851);
var inst_31847 = inst_31872;
var inst_31848 = inst_31858;
var state_31893__$1 = (function (){var statearr_31922 = state_31893;
(statearr_31922[(14)] = inst_31873);

(statearr_31922[(15)] = inst_31871);

(statearr_31922[(7)] = inst_31847);

(statearr_31922[(8)] = inst_31848);

return statearr_31922;
})();
var statearr_31923_33338 = state_31893__$1;
(statearr_31923_33338[(2)] = null);

(statearr_31923_33338[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (16))){
var state_31893__$1 = state_31893;
var statearr_31924_33339 = state_31893__$1;
(statearr_31924_33339[(2)] = null);

(statearr_31924_33339[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (10))){
var inst_31864 = (state_31893[(2)]);
var state_31893__$1 = state_31893;
if(cljs.core.truth_(inst_31864)){
var statearr_31928_33340 = state_31893__$1;
(statearr_31928_33340[(1)] = (11));

} else {
var statearr_31929_33343 = state_31893__$1;
(statearr_31929_33343[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (18))){
var inst_31883 = (state_31893[(2)]);
var state_31893__$1 = state_31893;
var statearr_31930_33346 = state_31893__$1;
(statearr_31930_33346[(2)] = inst_31883);

(statearr_31930_33346[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31894 === (8))){
var inst_31859 = (state_31893[(13)]);
var state_31893__$1 = state_31893;
var statearr_31931_33348 = state_31893__$1;
(statearr_31931_33348[(2)] = inst_31859);

(statearr_31931_33348[(1)] = (10));


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
var cljs$core$async$state_machine__28378__auto__ = null;
var cljs$core$async$state_machine__28378__auto____0 = (function (){
var statearr_31932 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31932[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31932[(1)] = (1));

return statearr_31932;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31893){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31893);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31937){var ex__28381__auto__ = e31937;
var statearr_31938_33350 = state_31893;
(statearr_31938_33350[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31893[(4)]))){
var statearr_31939_33352 = state_31893;
(statearr_31939_33352[(1)] = cljs.core.first((state_31893[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33355 = state_31893;
state_31893 = G__33355;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31893){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31893);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29159__auto__ = (function (){var statearr_31940 = f__29158__auto__();
(statearr_31940[(6)] = c__29157__auto___33307);

return statearr_31940;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29159__auto__);
}));


return out;
}));

(cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=cljs.core.async.js.map
