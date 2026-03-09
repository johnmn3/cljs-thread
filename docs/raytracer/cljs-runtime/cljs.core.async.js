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
cljs.core.async.t_cljs$core$async29245 = (function (f,blockable,meta29246){
this.f = f;
this.blockable = blockable;
this.meta29246 = meta29246;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29247,meta29246__$1){
var self__ = this;
var _29247__$1 = this;
return (new cljs.core.async.t_cljs$core$async29245(self__.f,self__.blockable,meta29246__$1));
}));

(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29247){
var self__ = this;
var _29247__$1 = this;
return self__.meta29246;
}));

(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
}));

(cljs.core.async.t_cljs$core$async29245.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
}));

(cljs.core.async.t_cljs$core$async29245.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"blockable","blockable",-28395259,null),new cljs.core.Symbol(null,"meta29246","meta29246",266824052,null)], null);
}));

(cljs.core.async.t_cljs$core$async29245.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29245.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29245");

(cljs.core.async.t_cljs$core$async29245.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29245");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29245.
 */
cljs.core.async.__GT_t_cljs$core$async29245 = (function cljs$core$async$__GT_t_cljs$core$async29245(f,blockable,meta29246){
return (new cljs.core.async.t_cljs$core$async29245(f,blockable,meta29246));
});


cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var G__29243 = arguments.length;
switch (G__29243) {
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
return (new cljs.core.async.t_cljs$core$async29245(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
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
var G__29384 = arguments.length;
switch (G__29384) {
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
var G__29443 = arguments.length;
switch (G__29443) {
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
var G__29469 = arguments.length;
switch (G__29469) {
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
var val_31957 = cljs.core.deref(ret);
if(cljs.core.truth_(on_caller_QMARK_)){
(fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_31957) : fn1.call(null, val_31957));
} else {
cljs.core.async.impl.dispatch.run((function (){
return (fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_31957) : fn1.call(null, val_31957));
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
var n__5636__auto___31959 = n;
var x_31960 = (0);
while(true){
if((x_31960 < n__5636__auto___31959)){
(a[x_31960] = x_31960);

var G__31961 = (x_31960 + (1));
x_31960 = G__31961;
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
cljs.core.async.t_cljs$core$async29480 = (function (flag,meta29481){
this.flag = flag;
this.meta29481 = meta29481;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29482,meta29481__$1){
var self__ = this;
var _29482__$1 = this;
return (new cljs.core.async.t_cljs$core$async29480(self__.flag,meta29481__$1));
}));

(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29482){
var self__ = this;
var _29482__$1 = this;
return self__.meta29481;
}));

(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29480.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.flag,null);

return true;
}));

(cljs.core.async.t_cljs$core$async29480.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"meta29481","meta29481",-1611547607,null)], null);
}));

(cljs.core.async.t_cljs$core$async29480.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29480.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29480");

(cljs.core.async.t_cljs$core$async29480.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29480");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29480.
 */
cljs.core.async.__GT_t_cljs$core$async29480 = (function cljs$core$async$__GT_t_cljs$core$async29480(flag,meta29481){
return (new cljs.core.async.t_cljs$core$async29480(flag,meta29481));
});


cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true);
return (new cljs.core.async.t_cljs$core$async29480(flag,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async29489 = (function (flag,cb,meta29490){
this.flag = flag;
this.cb = cb;
this.meta29490 = meta29490;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_29491,meta29490__$1){
var self__ = this;
var _29491__$1 = this;
return (new cljs.core.async.t_cljs$core$async29489(self__.flag,self__.cb,meta29490__$1));
}));

(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_29491){
var self__ = this;
var _29491__$1 = this;
return self__.meta29490;
}));

(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.flag);
}));

(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async29489.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit(self__.flag);

return self__.cb;
}));

(cljs.core.async.t_cljs$core$async29489.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null),new cljs.core.Symbol(null,"meta29490","meta29490",-2078195170,null)], null);
}));

(cljs.core.async.t_cljs$core$async29489.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async29489.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async29489");

(cljs.core.async.t_cljs$core$async29489.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async29489");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async29489.
 */
cljs.core.async.__GT_t_cljs$core$async29489 = (function cljs$core$async$__GT_t_cljs$core$async29489(flag,cb,meta29490){
return (new cljs.core.async.t_cljs$core$async29489(flag,cb,meta29490));
});


cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
return (new cljs.core.async.t_cljs$core$async29489(flag,cb,cljs.core.PersistentArrayMap.EMPTY));
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
return (function (p1__29493_SHARP_){
var G__29496 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29493_SHARP_,wport], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29496) : fret.call(null, G__29496));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.alt_handler(flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__29494_SHARP_){
var G__29498 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__29494_SHARP_,port], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__29498) : fret.call(null, G__29498));
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
var G__31968 = (i + (1));
i = G__31968;
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
var len__5769__auto___31969 = arguments.length;
var i__5770__auto___31970 = (0);
while(true){
if((i__5770__auto___31970 < len__5769__auto___31969)){
args__5775__auto__.push((arguments[i__5770__auto___31970]));

var G__31971 = (i__5770__auto___31970 + (1));
i__5770__auto___31970 = G__31971;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__29506){
var map__29507 = p__29506;
var map__29507__$1 = cljs.core.__destructure_map(map__29507);
var opts = map__29507__$1;
throw (new Error("alts! used not in (go ...) block"));
}));

(cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq29500){
var G__29501 = cljs.core.first(seq29500);
var seq29500__$1 = cljs.core.next(seq29500);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__29501,seq29500__$1);
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
var G__29512 = arguments.length;
switch (G__29512) {
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
var c__29125__auto___31982 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29542){
var state_val_29543 = (state_29542[(1)]);
if((state_val_29543 === (7))){
var inst_29538 = (state_29542[(2)]);
var state_29542__$1 = state_29542;
var statearr_29545_31984 = state_29542__$1;
(statearr_29545_31984[(2)] = inst_29538);

(statearr_29545_31984[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (1))){
var state_29542__$1 = state_29542;
var statearr_29546_31985 = state_29542__$1;
(statearr_29546_31985[(2)] = null);

(statearr_29546_31985[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (4))){
var inst_29521 = (state_29542[(7)]);
var inst_29521__$1 = (state_29542[(2)]);
var inst_29522 = (inst_29521__$1 == null);
var state_29542__$1 = (function (){var statearr_29548 = state_29542;
(statearr_29548[(7)] = inst_29521__$1);

return statearr_29548;
})();
if(cljs.core.truth_(inst_29522)){
var statearr_29550_31986 = state_29542__$1;
(statearr_29550_31986[(1)] = (5));

} else {
var statearr_29551_31987 = state_29542__$1;
(statearr_29551_31987[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (13))){
var state_29542__$1 = state_29542;
var statearr_29552_31988 = state_29542__$1;
(statearr_29552_31988[(2)] = null);

(statearr_29552_31988[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (6))){
var inst_29521 = (state_29542[(7)]);
var state_29542__$1 = state_29542;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29542__$1,(11),to,inst_29521);
} else {
if((state_val_29543 === (3))){
var inst_29540 = (state_29542[(2)]);
var state_29542__$1 = state_29542;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29542__$1,inst_29540);
} else {
if((state_val_29543 === (12))){
var state_29542__$1 = state_29542;
var statearr_29556_31990 = state_29542__$1;
(statearr_29556_31990[(2)] = null);

(statearr_29556_31990[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (2))){
var state_29542__$1 = state_29542;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29542__$1,(4),from);
} else {
if((state_val_29543 === (11))){
var inst_29531 = (state_29542[(2)]);
var state_29542__$1 = state_29542;
if(cljs.core.truth_(inst_29531)){
var statearr_29558_31991 = state_29542__$1;
(statearr_29558_31991[(1)] = (12));

} else {
var statearr_29559_31992 = state_29542__$1;
(statearr_29559_31992[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (9))){
var state_29542__$1 = state_29542;
var statearr_29560_31993 = state_29542__$1;
(statearr_29560_31993[(2)] = null);

(statearr_29560_31993[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (5))){
var state_29542__$1 = state_29542;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29561_31994 = state_29542__$1;
(statearr_29561_31994[(1)] = (8));

} else {
var statearr_29562_31995 = state_29542__$1;
(statearr_29562_31995[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (14))){
var inst_29536 = (state_29542[(2)]);
var state_29542__$1 = state_29542;
var statearr_29563_31996 = state_29542__$1;
(statearr_29563_31996[(2)] = inst_29536);

(statearr_29563_31996[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (10))){
var inst_29528 = (state_29542[(2)]);
var state_29542__$1 = state_29542;
var statearr_29564_31997 = state_29542__$1;
(statearr_29564_31997[(2)] = inst_29528);

(statearr_29564_31997[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29543 === (8))){
var inst_29525 = cljs.core.async.close_BANG_(to);
var state_29542__$1 = state_29542;
var statearr_29566_31998 = state_29542__$1;
(statearr_29566_31998[(2)] = inst_29525);

(statearr_29566_31998[(1)] = (10));


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
var statearr_29568 = [null,null,null,null,null,null,null,null];
(statearr_29568[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_29568[(1)] = (1));

return statearr_29568;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_29542){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29542);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29569){var ex__28381__auto__ = e29569;
var statearr_29570_32002 = state_29542;
(statearr_29570_32002[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29542[(4)]))){
var statearr_29571_32003 = state_29542;
(statearr_29571_32003[(1)] = cljs.core.first((state_29542[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32005 = state_29542;
state_29542 = G__32005;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_29542){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_29542);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_29573 = f__29126__auto__();
(statearr_29573[(6)] = c__29125__auto___31982);

return statearr_29573;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var process__$1 = (function (p__29580){
var vec__29581 = p__29580;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29581,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29581,(1),null);
var job = vec__29581;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((1),xf,ex_handler);
var c__29125__auto___32011 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29589){
var state_val_29590 = (state_29589[(1)]);
if((state_val_29590 === (1))){
var state_29589__$1 = state_29589;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29589__$1,(2),res,v);
} else {
if((state_val_29590 === (2))){
var inst_29586 = (state_29589[(2)]);
var inst_29587 = cljs.core.async.close_BANG_(res);
var state_29589__$1 = (function (){var statearr_29595 = state_29589;
(statearr_29595[(7)] = inst_29586);

return statearr_29595;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_29589__$1,inst_29587);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29596 = [null,null,null,null,null,null,null,null];
(statearr_29596[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29596[(1)] = (1));

return statearr_29596;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29589){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29589);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29598){var ex__28381__auto__ = e29598;
var statearr_29599_32013 = state_29589;
(statearr_29599_32013[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29589[(4)]))){
var statearr_29600_32014 = state_29589;
(statearr_29600_32014[(1)] = cljs.core.first((state_29589[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32017 = state_29589;
state_29589 = G__32017;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29589){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29589);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_29601 = f__29126__auto__();
(statearr_29601[(6)] = c__29125__auto___32011);

return statearr_29601;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});
var async = (function (p__29602){
var vec__29603 = p__29602;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29603,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29603,(1),null);
var job = vec__29603;
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
var n__5636__auto___32018 = n;
var __32019 = (0);
while(true){
if((__32019 < n__5636__auto___32018)){
var G__29607_32020 = type;
var G__29607_32021__$1 = (((G__29607_32020 instanceof cljs.core.Keyword))?G__29607_32020.fqn:null);
switch (G__29607_32021__$1) {
case "compute":
var c__29125__auto___32023 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32019,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = ((function (__32019,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function (state_29620){
var state_val_29621 = (state_29620[(1)]);
if((state_val_29621 === (1))){
var state_29620__$1 = state_29620;
var statearr_29622_32034 = state_29620__$1;
(statearr_29622_32034[(2)] = null);

(statearr_29622_32034[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29621 === (2))){
var state_29620__$1 = state_29620;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29620__$1,(4),jobs);
} else {
if((state_val_29621 === (3))){
var inst_29618 = (state_29620[(2)]);
var state_29620__$1 = state_29620;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29620__$1,inst_29618);
} else {
if((state_val_29621 === (4))){
var inst_29610 = (state_29620[(2)]);
var inst_29611 = process__$1(inst_29610);
var state_29620__$1 = state_29620;
if(cljs.core.truth_(inst_29611)){
var statearr_29623_32044 = state_29620__$1;
(statearr_29623_32044[(1)] = (5));

} else {
var statearr_29624_32045 = state_29620__$1;
(statearr_29624_32045[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29621 === (5))){
var state_29620__$1 = state_29620;
var statearr_29626_32049 = state_29620__$1;
(statearr_29626_32049[(2)] = null);

(statearr_29626_32049[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29621 === (6))){
var state_29620__$1 = state_29620;
var statearr_29627_32056 = state_29620__$1;
(statearr_29627_32056[(2)] = null);

(statearr_29627_32056[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29621 === (7))){
var inst_29616 = (state_29620[(2)]);
var state_29620__$1 = state_29620;
var statearr_29628_32065 = state_29620__$1;
(statearr_29628_32065[(2)] = inst_29616);

(statearr_29628_32065[(1)] = (3));


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
});})(__32019,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
;
return ((function (__32019,switch__28377__auto__,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29630 = [null,null,null,null,null,null,null];
(statearr_29630[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29630[(1)] = (1));

return statearr_29630;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29620){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29620);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29631){var ex__28381__auto__ = e29631;
var statearr_29632_32067 = state_29620;
(statearr_29632_32067[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29620[(4)]))){
var statearr_29636_32069 = state_29620;
(statearr_29636_32069[(1)] = cljs.core.first((state_29620[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32075 = state_29620;
state_29620 = G__32075;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29620){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29620);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
;})(__32019,switch__28377__auto__,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
})();
var state__29127__auto__ = (function (){var statearr_29637 = f__29126__auto__();
(statearr_29637[(6)] = c__29125__auto___32023);

return statearr_29637;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
});})(__32019,c__29125__auto___32023,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
);


break;
case "async":
var c__29125__auto___32082 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__32019,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = ((function (__32019,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function (state_29651){
var state_val_29652 = (state_29651[(1)]);
if((state_val_29652 === (1))){
var state_29651__$1 = state_29651;
var statearr_29653_32086 = state_29651__$1;
(statearr_29653_32086[(2)] = null);

(statearr_29653_32086[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29652 === (2))){
var state_29651__$1 = state_29651;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29651__$1,(4),jobs);
} else {
if((state_val_29652 === (3))){
var inst_29649 = (state_29651[(2)]);
var state_29651__$1 = state_29651;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29651__$1,inst_29649);
} else {
if((state_val_29652 === (4))){
var inst_29641 = (state_29651[(2)]);
var inst_29642 = async(inst_29641);
var state_29651__$1 = state_29651;
if(cljs.core.truth_(inst_29642)){
var statearr_29654_32090 = state_29651__$1;
(statearr_29654_32090[(1)] = (5));

} else {
var statearr_29655_32091 = state_29651__$1;
(statearr_29655_32091[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29652 === (5))){
var state_29651__$1 = state_29651;
var statearr_29656_32092 = state_29651__$1;
(statearr_29656_32092[(2)] = null);

(statearr_29656_32092[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29652 === (6))){
var state_29651__$1 = state_29651;
var statearr_29657_32093 = state_29651__$1;
(statearr_29657_32093[(2)] = null);

(statearr_29657_32093[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29652 === (7))){
var inst_29647 = (state_29651[(2)]);
var state_29651__$1 = state_29651;
var statearr_29659_32094 = state_29651__$1;
(statearr_29659_32094[(2)] = inst_29647);

(statearr_29659_32094[(1)] = (3));


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
});})(__32019,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
;
return ((function (__32019,switch__28377__auto__,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0 = (function (){
var statearr_29661 = [null,null,null,null,null,null,null];
(statearr_29661[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29661[(1)] = (1));

return statearr_29661;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29651){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29651);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29662){var ex__28381__auto__ = e29662;
var statearr_29663_32095 = state_29651;
(statearr_29663_32095[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29651[(4)]))){
var statearr_29664_32096 = state_29651;
(statearr_29664_32096[(1)] = cljs.core.first((state_29651[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32097 = state_29651;
state_29651 = G__32097;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29651){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29651);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
;})(__32019,switch__28377__auto__,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
})();
var state__29127__auto__ = (function (){var statearr_29665 = f__29126__auto__();
(statearr_29665[(6)] = c__29125__auto___32082);

return statearr_29665;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
});})(__32019,c__29125__auto___32082,G__29607_32020,G__29607_32021__$1,n__5636__auto___32018,jobs,results,process__$1,async))
);


break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29607_32021__$1)].join('')));

}

var G__32101 = (__32019 + (1));
__32019 = G__32101;
continue;
} else {
}
break;
}

var c__29125__auto___32102 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29693){
var state_val_29694 = (state_29693[(1)]);
if((state_val_29694 === (7))){
var inst_29689 = (state_29693[(2)]);
var state_29693__$1 = state_29693;
var statearr_29697_32103 = state_29693__$1;
(statearr_29697_32103[(2)] = inst_29689);

(statearr_29697_32103[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29694 === (1))){
var state_29693__$1 = state_29693;
var statearr_29699_32104 = state_29693__$1;
(statearr_29699_32104[(2)] = null);

(statearr_29699_32104[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29694 === (4))){
var inst_29674 = (state_29693[(7)]);
var inst_29674__$1 = (state_29693[(2)]);
var inst_29675 = (inst_29674__$1 == null);
var state_29693__$1 = (function (){var statearr_29703 = state_29693;
(statearr_29703[(7)] = inst_29674__$1);

return statearr_29703;
})();
if(cljs.core.truth_(inst_29675)){
var statearr_29704_32105 = state_29693__$1;
(statearr_29704_32105[(1)] = (5));

} else {
var statearr_29705_32106 = state_29693__$1;
(statearr_29705_32106[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29694 === (6))){
var inst_29679 = (state_29693[(8)]);
var inst_29674 = (state_29693[(7)]);
var inst_29679__$1 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var inst_29680 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_29681 = [inst_29674,inst_29679__$1];
var inst_29682 = (new cljs.core.PersistentVector(null,2,(5),inst_29680,inst_29681,null));
var state_29693__$1 = (function (){var statearr_29708 = state_29693;
(statearr_29708[(8)] = inst_29679__$1);

return statearr_29708;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29693__$1,(8),jobs,inst_29682);
} else {
if((state_val_29694 === (3))){
var inst_29691 = (state_29693[(2)]);
var state_29693__$1 = state_29693;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29693__$1,inst_29691);
} else {
if((state_val_29694 === (2))){
var state_29693__$1 = state_29693;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29693__$1,(4),from);
} else {
if((state_val_29694 === (9))){
var inst_29686 = (state_29693[(2)]);
var state_29693__$1 = (function (){var statearr_29709 = state_29693;
(statearr_29709[(9)] = inst_29686);

return statearr_29709;
})();
var statearr_29710_32111 = state_29693__$1;
(statearr_29710_32111[(2)] = null);

(statearr_29710_32111[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29694 === (5))){
var inst_29677 = cljs.core.async.close_BANG_(jobs);
var state_29693__$1 = state_29693;
var statearr_29711_32113 = state_29693__$1;
(statearr_29711_32113[(2)] = inst_29677);

(statearr_29711_32113[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29694 === (8))){
var inst_29679 = (state_29693[(8)]);
var inst_29684 = (state_29693[(2)]);
var state_29693__$1 = (function (){var statearr_29712 = state_29693;
(statearr_29712[(10)] = inst_29684);

return statearr_29712;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29693__$1,(9),results,inst_29679);
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
var statearr_29713 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_29713[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29713[(1)] = (1));

return statearr_29713;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29693){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29693);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29714){var ex__28381__auto__ = e29714;
var statearr_29716_32114 = state_29693;
(statearr_29716_32114[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29693[(4)]))){
var statearr_29718_32115 = state_29693;
(statearr_29718_32115[(1)] = cljs.core.first((state_29693[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32116 = state_29693;
state_29693 = G__32116;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29693){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29693);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_29719 = f__29126__auto__();
(statearr_29719[(6)] = c__29125__auto___32102);

return statearr_29719;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


var c__29125__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29757){
var state_val_29758 = (state_29757[(1)]);
if((state_val_29758 === (7))){
var inst_29753 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
var statearr_29760_32117 = state_29757__$1;
(statearr_29760_32117[(2)] = inst_29753);

(statearr_29760_32117[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (20))){
var state_29757__$1 = state_29757;
var statearr_29764_32118 = state_29757__$1;
(statearr_29764_32118[(2)] = null);

(statearr_29764_32118[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (1))){
var state_29757__$1 = state_29757;
var statearr_29765_32119 = state_29757__$1;
(statearr_29765_32119[(2)] = null);

(statearr_29765_32119[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (4))){
var inst_29722 = (state_29757[(7)]);
var inst_29722__$1 = (state_29757[(2)]);
var inst_29723 = (inst_29722__$1 == null);
var state_29757__$1 = (function (){var statearr_29766 = state_29757;
(statearr_29766[(7)] = inst_29722__$1);

return statearr_29766;
})();
if(cljs.core.truth_(inst_29723)){
var statearr_29767_32120 = state_29757__$1;
(statearr_29767_32120[(1)] = (5));

} else {
var statearr_29768_32121 = state_29757__$1;
(statearr_29768_32121[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (15))){
var inst_29735 = (state_29757[(8)]);
var state_29757__$1 = state_29757;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29757__$1,(18),to,inst_29735);
} else {
if((state_val_29758 === (21))){
var inst_29748 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
var statearr_29769_32122 = state_29757__$1;
(statearr_29769_32122[(2)] = inst_29748);

(statearr_29769_32122[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (13))){
var inst_29750 = (state_29757[(2)]);
var state_29757__$1 = (function (){var statearr_29770 = state_29757;
(statearr_29770[(9)] = inst_29750);

return statearr_29770;
})();
var statearr_29771_32123 = state_29757__$1;
(statearr_29771_32123[(2)] = null);

(statearr_29771_32123[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (6))){
var inst_29722 = (state_29757[(7)]);
var state_29757__$1 = state_29757;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29757__$1,(11),inst_29722);
} else {
if((state_val_29758 === (17))){
var inst_29743 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
if(cljs.core.truth_(inst_29743)){
var statearr_29774_32124 = state_29757__$1;
(statearr_29774_32124[(1)] = (19));

} else {
var statearr_29775_32125 = state_29757__$1;
(statearr_29775_32125[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (3))){
var inst_29755 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29757__$1,inst_29755);
} else {
if((state_val_29758 === (12))){
var inst_29732 = (state_29757[(10)]);
var state_29757__$1 = state_29757;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29757__$1,(14),inst_29732);
} else {
if((state_val_29758 === (2))){
var state_29757__$1 = state_29757;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29757__$1,(4),results);
} else {
if((state_val_29758 === (19))){
var state_29757__$1 = state_29757;
var statearr_29777_32133 = state_29757__$1;
(statearr_29777_32133[(2)] = null);

(statearr_29777_32133[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (11))){
var inst_29732 = (state_29757[(2)]);
var state_29757__$1 = (function (){var statearr_29778 = state_29757;
(statearr_29778[(10)] = inst_29732);

return statearr_29778;
})();
var statearr_29779_32134 = state_29757__$1;
(statearr_29779_32134[(2)] = null);

(statearr_29779_32134[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (9))){
var state_29757__$1 = state_29757;
var statearr_29780_32135 = state_29757__$1;
(statearr_29780_32135[(2)] = null);

(statearr_29780_32135[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (5))){
var state_29757__$1 = state_29757;
if(cljs.core.truth_(close_QMARK_)){
var statearr_29781_32136 = state_29757__$1;
(statearr_29781_32136[(1)] = (8));

} else {
var statearr_29782_32140 = state_29757__$1;
(statearr_29782_32140[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (14))){
var inst_29737 = (state_29757[(11)]);
var inst_29735 = (state_29757[(8)]);
var inst_29735__$1 = (state_29757[(2)]);
var inst_29736 = (inst_29735__$1 == null);
var inst_29737__$1 = cljs.core.not(inst_29736);
var state_29757__$1 = (function (){var statearr_29787 = state_29757;
(statearr_29787[(11)] = inst_29737__$1);

(statearr_29787[(8)] = inst_29735__$1);

return statearr_29787;
})();
if(inst_29737__$1){
var statearr_29788_32141 = state_29757__$1;
(statearr_29788_32141[(1)] = (15));

} else {
var statearr_29790_32142 = state_29757__$1;
(statearr_29790_32142[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (16))){
var inst_29737 = (state_29757[(11)]);
var state_29757__$1 = state_29757;
var statearr_29791_32143 = state_29757__$1;
(statearr_29791_32143[(2)] = inst_29737);

(statearr_29791_32143[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (10))){
var inst_29729 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
var statearr_29792_32144 = state_29757__$1;
(statearr_29792_32144[(2)] = inst_29729);

(statearr_29792_32144[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (18))){
var inst_29740 = (state_29757[(2)]);
var state_29757__$1 = state_29757;
var statearr_29796_32145 = state_29757__$1;
(statearr_29796_32145[(2)] = inst_29740);

(statearr_29796_32145[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29758 === (8))){
var inst_29726 = cljs.core.async.close_BANG_(to);
var state_29757__$1 = state_29757;
var statearr_29797_32146 = state_29757__$1;
(statearr_29797_32146[(2)] = inst_29726);

(statearr_29797_32146[(1)] = (10));


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
var statearr_29801 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_29801[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__);

(statearr_29801[(1)] = (1));

return statearr_29801;
});
var cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1 = (function (state_29757){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29757);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29803){var ex__28381__auto__ = e29803;
var statearr_29805_32147 = state_29757;
(statearr_29805_32147[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29757[(4)]))){
var statearr_29812_32148 = state_29757;
(statearr_29812_32148[(1)] = cljs.core.first((state_29757[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32149 = state_29757;
state_29757 = G__32149;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__ = function(state_29757){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1.call(this,state_29757);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_29813 = f__29126__auto__();
(statearr_29813[(6)] = c__29125__auto__);

return statearr_29813;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));

return c__29125__auto__;
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
var G__29816 = arguments.length;
switch (G__29816) {
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
var G__29827 = arguments.length;
switch (G__29827) {
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
var G__29843 = arguments.length;
switch (G__29843) {
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
var c__29125__auto___32156 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29880){
var state_val_29881 = (state_29880[(1)]);
if((state_val_29881 === (7))){
var inst_29874 = (state_29880[(2)]);
var state_29880__$1 = state_29880;
var statearr_29884_32157 = state_29880__$1;
(statearr_29884_32157[(2)] = inst_29874);

(statearr_29884_32157[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (1))){
var state_29880__$1 = state_29880;
var statearr_29888_32158 = state_29880__$1;
(statearr_29888_32158[(2)] = null);

(statearr_29888_32158[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (4))){
var inst_29854 = (state_29880[(7)]);
var inst_29854__$1 = (state_29880[(2)]);
var inst_29856 = (inst_29854__$1 == null);
var state_29880__$1 = (function (){var statearr_29890 = state_29880;
(statearr_29890[(7)] = inst_29854__$1);

return statearr_29890;
})();
if(cljs.core.truth_(inst_29856)){
var statearr_29891_32159 = state_29880__$1;
(statearr_29891_32159[(1)] = (5));

} else {
var statearr_29893_32160 = state_29880__$1;
(statearr_29893_32160[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (13))){
var state_29880__$1 = state_29880;
var statearr_29897_32161 = state_29880__$1;
(statearr_29897_32161[(2)] = null);

(statearr_29897_32161[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (6))){
var inst_29854 = (state_29880[(7)]);
var inst_29861 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_29854) : p.call(null, inst_29854));
var state_29880__$1 = state_29880;
if(cljs.core.truth_(inst_29861)){
var statearr_29899_32163 = state_29880__$1;
(statearr_29899_32163[(1)] = (9));

} else {
var statearr_29900_32164 = state_29880__$1;
(statearr_29900_32164[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (3))){
var inst_29876 = (state_29880[(2)]);
var state_29880__$1 = state_29880;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29880__$1,inst_29876);
} else {
if((state_val_29881 === (12))){
var state_29880__$1 = state_29880;
var statearr_29904_32169 = state_29880__$1;
(statearr_29904_32169[(2)] = null);

(statearr_29904_32169[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (2))){
var state_29880__$1 = state_29880;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29880__$1,(4),ch);
} else {
if((state_val_29881 === (11))){
var inst_29854 = (state_29880[(7)]);
var inst_29865 = (state_29880[(2)]);
var state_29880__$1 = state_29880;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_29880__$1,(8),inst_29865,inst_29854);
} else {
if((state_val_29881 === (9))){
var state_29880__$1 = state_29880;
var statearr_29909_32171 = state_29880__$1;
(statearr_29909_32171[(2)] = tc);

(statearr_29909_32171[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (5))){
var inst_29858 = cljs.core.async.close_BANG_(tc);
var inst_29859 = cljs.core.async.close_BANG_(fc);
var state_29880__$1 = (function (){var statearr_29915 = state_29880;
(statearr_29915[(8)] = inst_29858);

return statearr_29915;
})();
var statearr_29917_32172 = state_29880__$1;
(statearr_29917_32172[(2)] = inst_29859);

(statearr_29917_32172[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (14))){
var inst_29872 = (state_29880[(2)]);
var state_29880__$1 = state_29880;
var statearr_29921_32173 = state_29880__$1;
(statearr_29921_32173[(2)] = inst_29872);

(statearr_29921_32173[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (10))){
var state_29880__$1 = state_29880;
var statearr_29922_32174 = state_29880__$1;
(statearr_29922_32174[(2)] = fc);

(statearr_29922_32174[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29881 === (8))){
var inst_29867 = (state_29880[(2)]);
var state_29880__$1 = state_29880;
if(cljs.core.truth_(inst_29867)){
var statearr_29924_32175 = state_29880__$1;
(statearr_29924_32175[(1)] = (12));

} else {
var statearr_29925_32176 = state_29880__$1;
(statearr_29925_32176[(1)] = (13));

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
var statearr_29930 = [null,null,null,null,null,null,null,null,null];
(statearr_29930[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_29930[(1)] = (1));

return statearr_29930;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_29880){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29880);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e29933){var ex__28381__auto__ = e29933;
var statearr_29934_32177 = state_29880;
(statearr_29934_32177[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29880[(4)]))){
var statearr_29937_32178 = state_29880;
(statearr_29937_32178[(1)] = cljs.core.first((state_29880[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32179 = state_29880;
state_29880 = G__32179;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_29880){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_29880);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_29944 = f__29126__auto__();
(statearr_29944[(6)] = c__29125__auto___32156);

return statearr_29944;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var c__29125__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_29974){
var state_val_29976 = (state_29974[(1)]);
if((state_val_29976 === (7))){
var inst_29970 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
var statearr_29982_32183 = state_29974__$1;
(statearr_29982_32183[(2)] = inst_29970);

(statearr_29982_32183[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (1))){
var inst_29949 = init;
var inst_29950 = inst_29949;
var state_29974__$1 = (function (){var statearr_29986 = state_29974;
(statearr_29986[(7)] = inst_29950);

return statearr_29986;
})();
var statearr_29987_32187 = state_29974__$1;
(statearr_29987_32187[(2)] = null);

(statearr_29987_32187[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (4))){
var inst_29956 = (state_29974[(8)]);
var inst_29956__$1 = (state_29974[(2)]);
var inst_29958 = (inst_29956__$1 == null);
var state_29974__$1 = (function (){var statearr_29991 = state_29974;
(statearr_29991[(8)] = inst_29956__$1);

return statearr_29991;
})();
if(cljs.core.truth_(inst_29958)){
var statearr_29993_32188 = state_29974__$1;
(statearr_29993_32188[(1)] = (5));

} else {
var statearr_29994_32189 = state_29974__$1;
(statearr_29994_32189[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (6))){
var inst_29956 = (state_29974[(8)]);
var inst_29950 = (state_29974[(7)]);
var inst_29961 = (state_29974[(9)]);
var inst_29961__$1 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(inst_29950,inst_29956) : f.call(null, inst_29950,inst_29956));
var inst_29962 = cljs.core.reduced_QMARK_(inst_29961__$1);
var state_29974__$1 = (function (){var statearr_29996 = state_29974;
(statearr_29996[(9)] = inst_29961__$1);

return statearr_29996;
})();
if(inst_29962){
var statearr_29999_32196 = state_29974__$1;
(statearr_29999_32196[(1)] = (8));

} else {
var statearr_30001_32197 = state_29974__$1;
(statearr_30001_32197[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (3))){
var inst_29972 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
return cljs.core.async.impl.ioc_helpers.return_chan(state_29974__$1,inst_29972);
} else {
if((state_val_29976 === (2))){
var state_29974__$1 = state_29974;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_29974__$1,(4),ch);
} else {
if((state_val_29976 === (9))){
var inst_29961 = (state_29974[(9)]);
var inst_29950 = inst_29961;
var state_29974__$1 = (function (){var statearr_30003 = state_29974;
(statearr_30003[(7)] = inst_29950);

return statearr_30003;
})();
var statearr_30008_32198 = state_29974__$1;
(statearr_30008_32198[(2)] = null);

(statearr_30008_32198[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (5))){
var inst_29950 = (state_29974[(7)]);
var state_29974__$1 = state_29974;
var statearr_30010_32199 = state_29974__$1;
(statearr_30010_32199[(2)] = inst_29950);

(statearr_30010_32199[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (10))){
var inst_29968 = (state_29974[(2)]);
var state_29974__$1 = state_29974;
var statearr_30011_32200 = state_29974__$1;
(statearr_30011_32200[(2)] = inst_29968);

(statearr_30011_32200[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_29976 === (8))){
var inst_29961 = (state_29974[(9)]);
var inst_29964 = cljs.core.deref(inst_29961);
var state_29974__$1 = state_29974;
var statearr_30016_32201 = state_29974__$1;
(statearr_30016_32201[(2)] = inst_29964);

(statearr_30016_32201[(1)] = (10));


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
var statearr_30026 = [null,null,null,null,null,null,null,null,null,null];
(statearr_30026[(0)] = cljs$core$async$reduce_$_state_machine__28378__auto__);

(statearr_30026[(1)] = (1));

return statearr_30026;
});
var cljs$core$async$reduce_$_state_machine__28378__auto____1 = (function (state_29974){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_29974);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30028){var ex__28381__auto__ = e30028;
var statearr_30029_32202 = state_29974;
(statearr_30029_32202[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_29974[(4)]))){
var statearr_30031_32203 = state_29974;
(statearr_30031_32203[(1)] = cljs.core.first((state_29974[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32204 = state_29974;
state_29974 = G__32204;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__28378__auto__ = function(state_29974){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__28378__auto____1.call(this,state_29974);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__28378__auto____0;
cljs$core$async$reduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__28378__auto____1;
return cljs$core$async$reduce_$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30035 = f__29126__auto__();
(statearr_30035[(6)] = c__29125__auto__);

return statearr_30035;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));

return c__29125__auto__;
});
/**
 * async/reduces a channel with a transformation (xform f).
 *   Returns a channel containing the result.  ch must close before
 *   transduce produces a result.
 */
cljs.core.async.transduce = (function cljs$core$async$transduce(xform,f,init,ch){
var f__$1 = (xform.cljs$core$IFn$_invoke$arity$1 ? xform.cljs$core$IFn$_invoke$arity$1(f) : xform.call(null, f));
var c__29125__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_30046){
var state_val_30047 = (state_30046[(1)]);
if((state_val_30047 === (1))){
var inst_30041 = cljs.core.async.reduce(f__$1,init,ch);
var state_30046__$1 = state_30046;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30046__$1,(2),inst_30041);
} else {
if((state_val_30047 === (2))){
var inst_30043 = (state_30046[(2)]);
var inst_30044 = (f__$1.cljs$core$IFn$_invoke$arity$1 ? f__$1.cljs$core$IFn$_invoke$arity$1(inst_30043) : f__$1.call(null, inst_30043));
var state_30046__$1 = state_30046;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30046__$1,inst_30044);
} else {
return null;
}
}
});
return (function() {
var cljs$core$async$transduce_$_state_machine__28378__auto__ = null;
var cljs$core$async$transduce_$_state_machine__28378__auto____0 = (function (){
var statearr_30055 = [null,null,null,null,null,null,null];
(statearr_30055[(0)] = cljs$core$async$transduce_$_state_machine__28378__auto__);

(statearr_30055[(1)] = (1));

return statearr_30055;
});
var cljs$core$async$transduce_$_state_machine__28378__auto____1 = (function (state_30046){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30046);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30056){var ex__28381__auto__ = e30056;
var statearr_30057_32209 = state_30046;
(statearr_30057_32209[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30046[(4)]))){
var statearr_30061_32210 = state_30046;
(statearr_30061_32210[(1)] = cljs.core.first((state_30046[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32211 = state_30046;
state_30046 = G__32211;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$transduce_$_state_machine__28378__auto__ = function(state_30046){
switch(arguments.length){
case 0:
return cljs$core$async$transduce_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$transduce_$_state_machine__28378__auto____1.call(this,state_30046);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$transduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$transduce_$_state_machine__28378__auto____0;
cljs$core$async$transduce_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$transduce_$_state_machine__28378__auto____1;
return cljs$core$async$transduce_$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30063 = f__29126__auto__();
(statearr_30063[(6)] = c__29125__auto__);

return statearr_30063;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));

return c__29125__auto__;
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
var G__30073 = arguments.length;
switch (G__30073) {
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
var c__29125__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_30105){
var state_val_30106 = (state_30105[(1)]);
if((state_val_30106 === (7))){
var inst_30087 = (state_30105[(2)]);
var state_30105__$1 = state_30105;
var statearr_30111_32217 = state_30105__$1;
(statearr_30111_32217[(2)] = inst_30087);

(statearr_30111_32217[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (1))){
var inst_30080 = cljs.core.seq(coll);
var inst_30081 = inst_30080;
var state_30105__$1 = (function (){var statearr_30114 = state_30105;
(statearr_30114[(7)] = inst_30081);

return statearr_30114;
})();
var statearr_30116_32220 = state_30105__$1;
(statearr_30116_32220[(2)] = null);

(statearr_30116_32220[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (4))){
var inst_30081 = (state_30105[(7)]);
var inst_30085 = cljs.core.first(inst_30081);
var state_30105__$1 = state_30105;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30105__$1,(7),ch,inst_30085);
} else {
if((state_val_30106 === (13))){
var inst_30099 = (state_30105[(2)]);
var state_30105__$1 = state_30105;
var statearr_30121_32221 = state_30105__$1;
(statearr_30121_32221[(2)] = inst_30099);

(statearr_30121_32221[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (6))){
var inst_30090 = (state_30105[(2)]);
var state_30105__$1 = state_30105;
if(cljs.core.truth_(inst_30090)){
var statearr_30122_32223 = state_30105__$1;
(statearr_30122_32223[(1)] = (8));

} else {
var statearr_30124_32224 = state_30105__$1;
(statearr_30124_32224[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (3))){
var inst_30103 = (state_30105[(2)]);
var state_30105__$1 = state_30105;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30105__$1,inst_30103);
} else {
if((state_val_30106 === (12))){
var state_30105__$1 = state_30105;
var statearr_30131_32226 = state_30105__$1;
(statearr_30131_32226[(2)] = null);

(statearr_30131_32226[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (2))){
var inst_30081 = (state_30105[(7)]);
var state_30105__$1 = state_30105;
if(cljs.core.truth_(inst_30081)){
var statearr_30134_32227 = state_30105__$1;
(statearr_30134_32227[(1)] = (4));

} else {
var statearr_30136_32228 = state_30105__$1;
(statearr_30136_32228[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (11))){
var inst_30096 = cljs.core.async.close_BANG_(ch);
var state_30105__$1 = state_30105;
var statearr_30140_32229 = state_30105__$1;
(statearr_30140_32229[(2)] = inst_30096);

(statearr_30140_32229[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (9))){
var state_30105__$1 = state_30105;
if(cljs.core.truth_(close_QMARK_)){
var statearr_30141_32230 = state_30105__$1;
(statearr_30141_32230[(1)] = (11));

} else {
var statearr_30143_32231 = state_30105__$1;
(statearr_30143_32231[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (5))){
var inst_30081 = (state_30105[(7)]);
var state_30105__$1 = state_30105;
var statearr_30145_32232 = state_30105__$1;
(statearr_30145_32232[(2)] = inst_30081);

(statearr_30145_32232[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (10))){
var inst_30101 = (state_30105[(2)]);
var state_30105__$1 = state_30105;
var statearr_30148_32233 = state_30105__$1;
(statearr_30148_32233[(2)] = inst_30101);

(statearr_30148_32233[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30106 === (8))){
var inst_30081 = (state_30105[(7)]);
var inst_30092 = cljs.core.next(inst_30081);
var inst_30081__$1 = inst_30092;
var state_30105__$1 = (function (){var statearr_30150 = state_30105;
(statearr_30150[(7)] = inst_30081__$1);

return statearr_30150;
})();
var statearr_30151_32234 = state_30105__$1;
(statearr_30151_32234[(2)] = null);

(statearr_30151_32234[(1)] = (2));


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
var statearr_30155 = [null,null,null,null,null,null,null,null];
(statearr_30155[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_30155[(1)] = (1));

return statearr_30155;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_30105){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30105);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30157){var ex__28381__auto__ = e30157;
var statearr_30158_32235 = state_30105;
(statearr_30158_32235[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30105[(4)]))){
var statearr_30162_32236 = state_30105;
(statearr_30162_32236[(1)] = cljs.core.first((state_30105[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32240 = state_30105;
state_30105 = G__32240;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_30105){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_30105);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30168 = f__29126__auto__();
(statearr_30168[(6)] = c__29125__auto__);

return statearr_30168;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));

return c__29125__auto__;
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
var G__30177 = arguments.length;
switch (G__30177) {
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

var cljs$core$async$Mux$muxch_STAR_$dyn_32252 = (function (_){
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
return cljs$core$async$Mux$muxch_STAR_$dyn_32252(_);
}
});


/**
 * @interface
 */
cljs.core.async.Mult = function(){};

var cljs$core$async$Mult$tap_STAR_$dyn_32253 = (function (m,ch,close_QMARK_){
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
return cljs$core$async$Mult$tap_STAR_$dyn_32253(m,ch,close_QMARK_);
}
});

var cljs$core$async$Mult$untap_STAR_$dyn_32256 = (function (m,ch){
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
return cljs$core$async$Mult$untap_STAR_$dyn_32256(m,ch);
}
});

var cljs$core$async$Mult$untap_all_STAR_$dyn_32258 = (function (m){
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
return cljs$core$async$Mult$untap_all_STAR_$dyn_32258(m);
}
});


/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30197 = (function (ch,cs,meta30198){
this.ch = ch;
this.cs = cs;
this.meta30198 = meta30198;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30199,meta30198__$1){
var self__ = this;
var _30199__$1 = this;
return (new cljs.core.async.t_cljs$core$async30197(self__.ch,self__.cs,meta30198__$1));
}));

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30199){
var self__ = this;
var _30199__$1 = this;
return self__.meta30198;
}));

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mult$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
}));

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch__$1);

return null;
}));

(cljs.core.async.t_cljs$core$async30197.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return null;
}));

(cljs.core.async.t_cljs$core$async30197.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"meta30198","meta30198",173826118,null)], null);
}));

(cljs.core.async.t_cljs$core$async30197.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30197.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30197");

(cljs.core.async.t_cljs$core$async30197.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30197");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30197.
 */
cljs.core.async.__GT_t_cljs$core$async30197 = (function cljs$core$async$__GT_t_cljs$core$async30197(ch,cs,meta30198){
return (new cljs.core.async.t_cljs$core$async30197(ch,cs,meta30198));
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
var m = (new cljs.core.async.t_cljs$core$async30197(ch,cs,cljs.core.PersistentArrayMap.EMPTY));
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var done = (function (_){
if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,true);
} else {
return null;
}
});
var c__29125__auto___32274 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_30358){
var state_val_30359 = (state_30358[(1)]);
if((state_val_30359 === (7))){
var inst_30351 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30365_32279 = state_30358__$1;
(statearr_30365_32279[(2)] = inst_30351);

(statearr_30365_32279[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (20))){
var inst_30251 = (state_30358[(7)]);
var inst_30264 = cljs.core.first(inst_30251);
var inst_30265 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30264,(0),null);
var inst_30266 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30264,(1),null);
var state_30358__$1 = (function (){var statearr_30367 = state_30358;
(statearr_30367[(8)] = inst_30265);

return statearr_30367;
})();
if(cljs.core.truth_(inst_30266)){
var statearr_30371_32281 = state_30358__$1;
(statearr_30371_32281[(1)] = (22));

} else {
var statearr_30373_32282 = state_30358__$1;
(statearr_30373_32282[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (27))){
var inst_30301 = (state_30358[(9)]);
var inst_30219 = (state_30358[(10)]);
var inst_30294 = (state_30358[(11)]);
var inst_30296 = (state_30358[(12)]);
var inst_30301__$1 = cljs.core._nth(inst_30294,inst_30296);
var inst_30302 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30301__$1,inst_30219,done);
var state_30358__$1 = (function (){var statearr_30377 = state_30358;
(statearr_30377[(9)] = inst_30301__$1);

return statearr_30377;
})();
if(cljs.core.truth_(inst_30302)){
var statearr_30381_32292 = state_30358__$1;
(statearr_30381_32292[(1)] = (30));

} else {
var statearr_30386_32293 = state_30358__$1;
(statearr_30386_32293[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (1))){
var state_30358__$1 = state_30358;
var statearr_30387_32297 = state_30358__$1;
(statearr_30387_32297[(2)] = null);

(statearr_30387_32297[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (24))){
var inst_30251 = (state_30358[(7)]);
var inst_30271 = (state_30358[(2)]);
var inst_30272 = cljs.core.next(inst_30251);
var inst_30229 = inst_30272;
var inst_30230 = null;
var inst_30231 = (0);
var inst_30232 = (0);
var state_30358__$1 = (function (){var statearr_30388 = state_30358;
(statearr_30388[(13)] = inst_30230);

(statearr_30388[(14)] = inst_30231);

(statearr_30388[(15)] = inst_30271);

(statearr_30388[(16)] = inst_30232);

(statearr_30388[(17)] = inst_30229);

return statearr_30388;
})();
var statearr_30390_32299 = state_30358__$1;
(statearr_30390_32299[(2)] = null);

(statearr_30390_32299[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (39))){
var state_30358__$1 = state_30358;
var statearr_30394_32300 = state_30358__$1;
(statearr_30394_32300[(2)] = null);

(statearr_30394_32300[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (4))){
var inst_30219 = (state_30358[(10)]);
var inst_30219__$1 = (state_30358[(2)]);
var inst_30221 = (inst_30219__$1 == null);
var state_30358__$1 = (function (){var statearr_30395 = state_30358;
(statearr_30395[(10)] = inst_30219__$1);

return statearr_30395;
})();
if(cljs.core.truth_(inst_30221)){
var statearr_30396_32305 = state_30358__$1;
(statearr_30396_32305[(1)] = (5));

} else {
var statearr_30401_32307 = state_30358__$1;
(statearr_30401_32307[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (15))){
var inst_30230 = (state_30358[(13)]);
var inst_30231 = (state_30358[(14)]);
var inst_30232 = (state_30358[(16)]);
var inst_30229 = (state_30358[(17)]);
var inst_30247 = (state_30358[(2)]);
var inst_30248 = (inst_30232 + (1));
var tmp30391 = inst_30230;
var tmp30392 = inst_30231;
var tmp30393 = inst_30229;
var inst_30229__$1 = tmp30393;
var inst_30230__$1 = tmp30391;
var inst_30231__$1 = tmp30392;
var inst_30232__$1 = inst_30248;
var state_30358__$1 = (function (){var statearr_30406 = state_30358;
(statearr_30406[(13)] = inst_30230__$1);

(statearr_30406[(14)] = inst_30231__$1);

(statearr_30406[(16)] = inst_30232__$1);

(statearr_30406[(18)] = inst_30247);

(statearr_30406[(17)] = inst_30229__$1);

return statearr_30406;
})();
var statearr_30407_32309 = state_30358__$1;
(statearr_30407_32309[(2)] = null);

(statearr_30407_32309[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (21))){
var inst_30275 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30411_32322 = state_30358__$1;
(statearr_30411_32322[(2)] = inst_30275);

(statearr_30411_32322[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (31))){
var inst_30301 = (state_30358[(9)]);
var inst_30305 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30301);
var state_30358__$1 = state_30358;
var statearr_30415_32323 = state_30358__$1;
(statearr_30415_32323[(2)] = inst_30305);

(statearr_30415_32323[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (32))){
var inst_30293 = (state_30358[(19)]);
var inst_30294 = (state_30358[(11)]);
var inst_30296 = (state_30358[(12)]);
var inst_30295 = (state_30358[(20)]);
var inst_30307 = (state_30358[(2)]);
var inst_30308 = (inst_30296 + (1));
var tmp30408 = inst_30293;
var tmp30409 = inst_30294;
var tmp30410 = inst_30295;
var inst_30293__$1 = tmp30408;
var inst_30294__$1 = tmp30409;
var inst_30295__$1 = tmp30410;
var inst_30296__$1 = inst_30308;
var state_30358__$1 = (function (){var statearr_30417 = state_30358;
(statearr_30417[(21)] = inst_30307);

(statearr_30417[(19)] = inst_30293__$1);

(statearr_30417[(11)] = inst_30294__$1);

(statearr_30417[(12)] = inst_30296__$1);

(statearr_30417[(20)] = inst_30295__$1);

return statearr_30417;
})();
var statearr_30421_32328 = state_30358__$1;
(statearr_30421_32328[(2)] = null);

(statearr_30421_32328[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (40))){
var inst_30320 = (state_30358[(22)]);
var inst_30324 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null, inst_30320);
var state_30358__$1 = state_30358;
var statearr_30423_32329 = state_30358__$1;
(statearr_30423_32329[(2)] = inst_30324);

(statearr_30423_32329[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (33))){
var inst_30311 = (state_30358[(23)]);
var inst_30313 = cljs.core.chunked_seq_QMARK_(inst_30311);
var state_30358__$1 = state_30358;
if(inst_30313){
var statearr_30424_32330 = state_30358__$1;
(statearr_30424_32330[(1)] = (36));

} else {
var statearr_30428_32331 = state_30358__$1;
(statearr_30428_32331[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (13))){
var inst_30241 = (state_30358[(24)]);
var inst_30244 = cljs.core.async.close_BANG_(inst_30241);
var state_30358__$1 = state_30358;
var statearr_30430_32332 = state_30358__$1;
(statearr_30430_32332[(2)] = inst_30244);

(statearr_30430_32332[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (22))){
var inst_30265 = (state_30358[(8)]);
var inst_30268 = cljs.core.async.close_BANG_(inst_30265);
var state_30358__$1 = state_30358;
var statearr_30431_32337 = state_30358__$1;
(statearr_30431_32337[(2)] = inst_30268);

(statearr_30431_32337[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (36))){
var inst_30311 = (state_30358[(23)]);
var inst_30315 = cljs.core.chunk_first(inst_30311);
var inst_30316 = cljs.core.chunk_rest(inst_30311);
var inst_30317 = cljs.core.count(inst_30315);
var inst_30293 = inst_30316;
var inst_30294 = inst_30315;
var inst_30295 = inst_30317;
var inst_30296 = (0);
var state_30358__$1 = (function (){var statearr_30432 = state_30358;
(statearr_30432[(19)] = inst_30293);

(statearr_30432[(11)] = inst_30294);

(statearr_30432[(12)] = inst_30296);

(statearr_30432[(20)] = inst_30295);

return statearr_30432;
})();
var statearr_30434_32338 = state_30358__$1;
(statearr_30434_32338[(2)] = null);

(statearr_30434_32338[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (41))){
var inst_30311 = (state_30358[(23)]);
var inst_30326 = (state_30358[(2)]);
var inst_30327 = cljs.core.next(inst_30311);
var inst_30293 = inst_30327;
var inst_30294 = null;
var inst_30295 = (0);
var inst_30296 = (0);
var state_30358__$1 = (function (){var statearr_30435 = state_30358;
(statearr_30435[(25)] = inst_30326);

(statearr_30435[(19)] = inst_30293);

(statearr_30435[(11)] = inst_30294);

(statearr_30435[(12)] = inst_30296);

(statearr_30435[(20)] = inst_30295);

return statearr_30435;
})();
var statearr_30436_32341 = state_30358__$1;
(statearr_30436_32341[(2)] = null);

(statearr_30436_32341[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (43))){
var state_30358__$1 = state_30358;
var statearr_30437_32343 = state_30358__$1;
(statearr_30437_32343[(2)] = null);

(statearr_30437_32343[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (29))){
var inst_30335 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30438_32345 = state_30358__$1;
(statearr_30438_32345[(2)] = inst_30335);

(statearr_30438_32345[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (44))){
var inst_30348 = (state_30358[(2)]);
var state_30358__$1 = (function (){var statearr_30439 = state_30358;
(statearr_30439[(26)] = inst_30348);

return statearr_30439;
})();
var statearr_30444_32349 = state_30358__$1;
(statearr_30444_32349[(2)] = null);

(statearr_30444_32349[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (6))){
var inst_30285 = (state_30358[(27)]);
var inst_30284 = cljs.core.deref(cs);
var inst_30285__$1 = cljs.core.keys(inst_30284);
var inst_30286 = cljs.core.count(inst_30285__$1);
var inst_30287 = cljs.core.reset_BANG_(dctr,inst_30286);
var inst_30292 = cljs.core.seq(inst_30285__$1);
var inst_30293 = inst_30292;
var inst_30294 = null;
var inst_30295 = (0);
var inst_30296 = (0);
var state_30358__$1 = (function (){var statearr_30453 = state_30358;
(statearr_30453[(28)] = inst_30287);

(statearr_30453[(27)] = inst_30285__$1);

(statearr_30453[(19)] = inst_30293);

(statearr_30453[(11)] = inst_30294);

(statearr_30453[(12)] = inst_30296);

(statearr_30453[(20)] = inst_30295);

return statearr_30453;
})();
var statearr_30454_32351 = state_30358__$1;
(statearr_30454_32351[(2)] = null);

(statearr_30454_32351[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (28))){
var inst_30293 = (state_30358[(19)]);
var inst_30311 = (state_30358[(23)]);
var inst_30311__$1 = cljs.core.seq(inst_30293);
var state_30358__$1 = (function (){var statearr_30455 = state_30358;
(statearr_30455[(23)] = inst_30311__$1);

return statearr_30455;
})();
if(inst_30311__$1){
var statearr_30459_32352 = state_30358__$1;
(statearr_30459_32352[(1)] = (33));

} else {
var statearr_30460_32353 = state_30358__$1;
(statearr_30460_32353[(1)] = (34));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (25))){
var inst_30296 = (state_30358[(12)]);
var inst_30295 = (state_30358[(20)]);
var inst_30298 = (inst_30296 < inst_30295);
var inst_30299 = inst_30298;
var state_30358__$1 = state_30358;
if(cljs.core.truth_(inst_30299)){
var statearr_30462_32354 = state_30358__$1;
(statearr_30462_32354[(1)] = (27));

} else {
var statearr_30463_32355 = state_30358__$1;
(statearr_30463_32355[(1)] = (28));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (34))){
var state_30358__$1 = state_30358;
var statearr_30467_32356 = state_30358__$1;
(statearr_30467_32356[(2)] = null);

(statearr_30467_32356[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (17))){
var state_30358__$1 = state_30358;
var statearr_30469_32359 = state_30358__$1;
(statearr_30469_32359[(2)] = null);

(statearr_30469_32359[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (3))){
var inst_30353 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30358__$1,inst_30353);
} else {
if((state_val_30359 === (12))){
var inst_30280 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30470_32360 = state_30358__$1;
(statearr_30470_32360[(2)] = inst_30280);

(statearr_30470_32360[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (2))){
var state_30358__$1 = state_30358;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30358__$1,(4),ch);
} else {
if((state_val_30359 === (23))){
var state_30358__$1 = state_30358;
var statearr_30475_32362 = state_30358__$1;
(statearr_30475_32362[(2)] = null);

(statearr_30475_32362[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (35))){
var inst_30333 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30476_32367 = state_30358__$1;
(statearr_30476_32367[(2)] = inst_30333);

(statearr_30476_32367[(1)] = (29));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (19))){
var inst_30251 = (state_30358[(7)]);
var inst_30256 = cljs.core.chunk_first(inst_30251);
var inst_30257 = cljs.core.chunk_rest(inst_30251);
var inst_30258 = cljs.core.count(inst_30256);
var inst_30229 = inst_30257;
var inst_30230 = inst_30256;
var inst_30231 = inst_30258;
var inst_30232 = (0);
var state_30358__$1 = (function (){var statearr_30477 = state_30358;
(statearr_30477[(13)] = inst_30230);

(statearr_30477[(14)] = inst_30231);

(statearr_30477[(16)] = inst_30232);

(statearr_30477[(17)] = inst_30229);

return statearr_30477;
})();
var statearr_30478_32369 = state_30358__$1;
(statearr_30478_32369[(2)] = null);

(statearr_30478_32369[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (11))){
var inst_30251 = (state_30358[(7)]);
var inst_30229 = (state_30358[(17)]);
var inst_30251__$1 = cljs.core.seq(inst_30229);
var state_30358__$1 = (function (){var statearr_30479 = state_30358;
(statearr_30479[(7)] = inst_30251__$1);

return statearr_30479;
})();
if(inst_30251__$1){
var statearr_30480_32370 = state_30358__$1;
(statearr_30480_32370[(1)] = (16));

} else {
var statearr_30481_32371 = state_30358__$1;
(statearr_30481_32371[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (9))){
var inst_30282 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30482_32378 = state_30358__$1;
(statearr_30482_32378[(2)] = inst_30282);

(statearr_30482_32378[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (5))){
var inst_30227 = cljs.core.deref(cs);
var inst_30228 = cljs.core.seq(inst_30227);
var inst_30229 = inst_30228;
var inst_30230 = null;
var inst_30231 = (0);
var inst_30232 = (0);
var state_30358__$1 = (function (){var statearr_30483 = state_30358;
(statearr_30483[(13)] = inst_30230);

(statearr_30483[(14)] = inst_30231);

(statearr_30483[(16)] = inst_30232);

(statearr_30483[(17)] = inst_30229);

return statearr_30483;
})();
var statearr_30484_32380 = state_30358__$1;
(statearr_30484_32380[(2)] = null);

(statearr_30484_32380[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (14))){
var state_30358__$1 = state_30358;
var statearr_30489_32381 = state_30358__$1;
(statearr_30489_32381[(2)] = null);

(statearr_30489_32381[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (45))){
var inst_30345 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30493_32388 = state_30358__$1;
(statearr_30493_32388[(2)] = inst_30345);

(statearr_30493_32388[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (26))){
var inst_30285 = (state_30358[(27)]);
var inst_30337 = (state_30358[(2)]);
var inst_30342 = cljs.core.seq(inst_30285);
var state_30358__$1 = (function (){var statearr_30495 = state_30358;
(statearr_30495[(29)] = inst_30337);

return statearr_30495;
})();
if(inst_30342){
var statearr_30496_32389 = state_30358__$1;
(statearr_30496_32389[(1)] = (42));

} else {
var statearr_30497_32390 = state_30358__$1;
(statearr_30497_32390[(1)] = (43));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (16))){
var inst_30251 = (state_30358[(7)]);
var inst_30253 = cljs.core.chunked_seq_QMARK_(inst_30251);
var state_30358__$1 = state_30358;
if(inst_30253){
var statearr_30498_32391 = state_30358__$1;
(statearr_30498_32391[(1)] = (19));

} else {
var statearr_30499_32392 = state_30358__$1;
(statearr_30499_32392[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (38))){
var inst_30330 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30503_32393 = state_30358__$1;
(statearr_30503_32393[(2)] = inst_30330);

(statearr_30503_32393[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (30))){
var state_30358__$1 = state_30358;
var statearr_30504_32394 = state_30358__$1;
(statearr_30504_32394[(2)] = null);

(statearr_30504_32394[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (10))){
var inst_30230 = (state_30358[(13)]);
var inst_30232 = (state_30358[(16)]);
var inst_30240 = cljs.core._nth(inst_30230,inst_30232);
var inst_30241 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30240,(0),null);
var inst_30242 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30240,(1),null);
var state_30358__$1 = (function (){var statearr_30506 = state_30358;
(statearr_30506[(24)] = inst_30241);

return statearr_30506;
})();
if(cljs.core.truth_(inst_30242)){
var statearr_30508_32399 = state_30358__$1;
(statearr_30508_32399[(1)] = (13));

} else {
var statearr_30509_32400 = state_30358__$1;
(statearr_30509_32400[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (18))){
var inst_30278 = (state_30358[(2)]);
var state_30358__$1 = state_30358;
var statearr_30510_32405 = state_30358__$1;
(statearr_30510_32405[(2)] = inst_30278);

(statearr_30510_32405[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (42))){
var state_30358__$1 = state_30358;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30358__$1,(45),dchan);
} else {
if((state_val_30359 === (37))){
var inst_30219 = (state_30358[(10)]);
var inst_30320 = (state_30358[(22)]);
var inst_30311 = (state_30358[(23)]);
var inst_30320__$1 = cljs.core.first(inst_30311);
var inst_30321 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_30320__$1,inst_30219,done);
var state_30358__$1 = (function (){var statearr_30511 = state_30358;
(statearr_30511[(22)] = inst_30320__$1);

return statearr_30511;
})();
if(cljs.core.truth_(inst_30321)){
var statearr_30512_32423 = state_30358__$1;
(statearr_30512_32423[(1)] = (39));

} else {
var statearr_30513_32430 = state_30358__$1;
(statearr_30513_32430[(1)] = (40));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30359 === (8))){
var inst_30231 = (state_30358[(14)]);
var inst_30232 = (state_30358[(16)]);
var inst_30234 = (inst_30232 < inst_30231);
var inst_30235 = inst_30234;
var state_30358__$1 = state_30358;
if(cljs.core.truth_(inst_30235)){
var statearr_30514_32431 = state_30358__$1;
(statearr_30514_32431[(1)] = (10));

} else {
var statearr_30515_32432 = state_30358__$1;
(statearr_30515_32432[(1)] = (11));

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
var statearr_30516 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30516[(0)] = cljs$core$async$mult_$_state_machine__28378__auto__);

(statearr_30516[(1)] = (1));

return statearr_30516;
});
var cljs$core$async$mult_$_state_machine__28378__auto____1 = (function (state_30358){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30358);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30517){var ex__28381__auto__ = e30517;
var statearr_30518_32446 = state_30358;
(statearr_30518_32446[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30358[(4)]))){
var statearr_30519_32448 = state_30358;
(statearr_30519_32448[(1)] = cljs.core.first((state_30358[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32449 = state_30358;
state_30358 = G__32449;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__28378__auto__ = function(state_30358){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__28378__auto____1.call(this,state_30358);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__28378__auto____0;
cljs$core$async$mult_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__28378__auto____1;
return cljs$core$async$mult_$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30520 = f__29126__auto__();
(statearr_30520[(6)] = c__29125__auto___32274);

return statearr_30520;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var G__30522 = arguments.length;
switch (G__30522) {
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

var cljs$core$async$Mix$admix_STAR_$dyn_32477 = (function (m,ch){
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
return cljs$core$async$Mix$admix_STAR_$dyn_32477(m,ch);
}
});

var cljs$core$async$Mix$unmix_STAR_$dyn_32501 = (function (m,ch){
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
return cljs$core$async$Mix$unmix_STAR_$dyn_32501(m,ch);
}
});

var cljs$core$async$Mix$unmix_all_STAR_$dyn_32513 = (function (m){
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
return cljs$core$async$Mix$unmix_all_STAR_$dyn_32513(m);
}
});

var cljs$core$async$Mix$toggle_STAR_$dyn_32522 = (function (m,state_map){
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
return cljs$core$async$Mix$toggle_STAR_$dyn_32522(m,state_map);
}
});

var cljs$core$async$Mix$solo_mode_STAR_$dyn_32535 = (function (m,mode){
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
return cljs$core$async$Mix$solo_mode_STAR_$dyn_32535(m,mode);
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___32555 = arguments.length;
var i__5770__auto___32556 = (0);
while(true){
if((i__5770__auto___32556 < len__5769__auto___32555)){
args__5775__auto__.push((arguments[i__5770__auto___32556]));

var G__32557 = (i__5770__auto___32556 + (1));
i__5770__auto___32556 = G__32557;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((3) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((3)),(0),null)):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__5776__auto__);
});

(cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__30538){
var map__30539 = p__30538;
var map__30539__$1 = cljs.core.__destructure_map(map__30539);
var opts = map__30539__$1;
var statearr_30540_32559 = state;
(statearr_30540_32559[(1)] = cont_block);


var temp__5823__auto__ = cljs.core.async.do_alts((function (val){
var statearr_30541_32560 = state;
(statearr_30541_32560[(2)] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state);
}),ports,opts);
if(cljs.core.truth_(temp__5823__auto__)){
var cb = temp__5823__auto__;
var statearr_30542_32562 = state;
(statearr_30542_32562[(2)] = cljs.core.deref(cb));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}));

(cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3));

/** @this {Function} */
(cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq30533){
var G__30534 = cljs.core.first(seq30533);
var seq30533__$1 = cljs.core.next(seq30533);
var G__30535 = cljs.core.first(seq30533__$1);
var seq30533__$2 = cljs.core.next(seq30533__$1);
var G__30536 = cljs.core.first(seq30533__$2);
var seq30533__$3 = cljs.core.next(seq30533__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__30534,G__30535,G__30536,seq30533__$3);
}));


/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async30576 = (function (change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30577){
this.change = change;
this.solo_mode = solo_mode;
this.pick = pick;
this.cs = cs;
this.calc_state = calc_state;
this.out = out;
this.changed = changed;
this.solo_modes = solo_modes;
this.attrs = attrs;
this.meta30577 = meta30577;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30578,meta30577__$1){
var self__ = this;
var _30578__$1 = this;
return (new cljs.core.async.t_cljs$core$async30576(self__.change,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta30577__$1));
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30578){
var self__ = this;
var _30578__$1 = this;
return self__.meta30577;
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_(self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.core.merge_with,cljs.core.merge),state_map);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30576.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.solo_modes.cljs$core$IFn$_invoke$arity$1 ? self__.solo_modes.cljs$core$IFn$_invoke$arity$1(mode) : self__.solo_modes.call(null, mode)))){
} else {
throw (new Error(["Assert failed: ",["mode must be one of: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.solo_modes)].join(''),"\n","(solo-modes mode)"].join('')));
}

cljs.core.reset_BANG_(self__.solo_mode,mode);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null, ));
}));

(cljs.core.async.t_cljs$core$async30576.getBasis = (function (){
return new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"change","change",477485025,null),new cljs.core.Symbol(null,"solo-mode","solo-mode",2031788074,null),new cljs.core.Symbol(null,"pick","pick",1300068175,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"calc-state","calc-state",-349968968,null),new cljs.core.Symbol(null,"out","out",729986010,null),new cljs.core.Symbol(null,"changed","changed",-2083710852,null),new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"attrs","attrs",-450137186,null),new cljs.core.Symbol(null,"meta30577","meta30577",2047518322,null)], null);
}));

(cljs.core.async.t_cljs$core$async30576.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30576.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30576");

(cljs.core.async.t_cljs$core$async30576.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30576");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30576.
 */
cljs.core.async.__GT_t_cljs$core$async30576 = (function cljs$core$async$__GT_t_cljs$core$async30576(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30577){
return (new cljs.core.async.t_cljs$core$async30576(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta30577));
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
var m = (new cljs.core.async.t_cljs$core$async30576(change,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
var c__29125__auto___32582 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_30684){
var state_val_30685 = (state_30684[(1)]);
if((state_val_30685 === (7))){
var inst_30644 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
if(cljs.core.truth_(inst_30644)){
var statearr_30696_32587 = state_30684__$1;
(statearr_30696_32587[(1)] = (8));

} else {
var statearr_30697_32592 = state_30684__$1;
(statearr_30697_32592[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (20))){
var inst_30637 = (state_30684[(7)]);
var state_30684__$1 = state_30684;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30684__$1,(23),out,inst_30637);
} else {
if((state_val_30685 === (1))){
var inst_30612 = calc_state();
var inst_30613 = cljs.core.__destructure_map(inst_30612);
var inst_30614 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30613,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30615 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30613,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30618 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30613,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var inst_30619 = inst_30612;
var state_30684__$1 = (function (){var statearr_30701 = state_30684;
(statearr_30701[(8)] = inst_30619);

(statearr_30701[(9)] = inst_30614);

(statearr_30701[(10)] = inst_30615);

(statearr_30701[(11)] = inst_30618);

return statearr_30701;
})();
var statearr_30702_32597 = state_30684__$1;
(statearr_30702_32597[(2)] = null);

(statearr_30702_32597[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (24))){
var inst_30622 = (state_30684[(12)]);
var inst_30619 = inst_30622;
var state_30684__$1 = (function (){var statearr_30703 = state_30684;
(statearr_30703[(8)] = inst_30619);

return statearr_30703;
})();
var statearr_30704_32598 = state_30684__$1;
(statearr_30704_32598[(2)] = null);

(statearr_30704_32598[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (4))){
var inst_30637 = (state_30684[(7)]);
var inst_30639 = (state_30684[(13)]);
var inst_30636 = (state_30684[(2)]);
var inst_30637__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30636,(0),null);
var inst_30638 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_30636,(1),null);
var inst_30639__$1 = (inst_30637__$1 == null);
var state_30684__$1 = (function (){var statearr_30705 = state_30684;
(statearr_30705[(7)] = inst_30637__$1);

(statearr_30705[(13)] = inst_30639__$1);

(statearr_30705[(14)] = inst_30638);

return statearr_30705;
})();
if(cljs.core.truth_(inst_30639__$1)){
var statearr_30709_32614 = state_30684__$1;
(statearr_30709_32614[(1)] = (5));

} else {
var statearr_30710_32616 = state_30684__$1;
(statearr_30710_32616[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (15))){
var inst_30623 = (state_30684[(15)]);
var inst_30658 = (state_30684[(16)]);
var inst_30658__$1 = cljs.core.empty_QMARK_(inst_30623);
var state_30684__$1 = (function (){var statearr_30712 = state_30684;
(statearr_30712[(16)] = inst_30658__$1);

return statearr_30712;
})();
if(inst_30658__$1){
var statearr_30716_32621 = state_30684__$1;
(statearr_30716_32621[(1)] = (17));

} else {
var statearr_30717_32626 = state_30684__$1;
(statearr_30717_32626[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (21))){
var inst_30622 = (state_30684[(12)]);
var inst_30619 = inst_30622;
var state_30684__$1 = (function (){var statearr_30718 = state_30684;
(statearr_30718[(8)] = inst_30619);

return statearr_30718;
})();
var statearr_30719_32629 = state_30684__$1;
(statearr_30719_32629[(2)] = null);

(statearr_30719_32629[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (13))){
var inst_30651 = (state_30684[(2)]);
var inst_30652 = calc_state();
var inst_30619 = inst_30652;
var state_30684__$1 = (function (){var statearr_30720 = state_30684;
(statearr_30720[(8)] = inst_30619);

(statearr_30720[(17)] = inst_30651);

return statearr_30720;
})();
var statearr_30721_32631 = state_30684__$1;
(statearr_30721_32631[(2)] = null);

(statearr_30721_32631[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (22))){
var inst_30678 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
var statearr_30722_32640 = state_30684__$1;
(statearr_30722_32640[(2)] = inst_30678);

(statearr_30722_32640[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (6))){
var inst_30638 = (state_30684[(14)]);
var inst_30642 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_30638,change);
var state_30684__$1 = state_30684;
var statearr_30723_32642 = state_30684__$1;
(statearr_30723_32642[(2)] = inst_30642);

(statearr_30723_32642[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (25))){
var state_30684__$1 = state_30684;
var statearr_30724_32643 = state_30684__$1;
(statearr_30724_32643[(2)] = null);

(statearr_30724_32643[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (17))){
var inst_30624 = (state_30684[(18)]);
var inst_30638 = (state_30684[(14)]);
var inst_30660 = (inst_30624.cljs$core$IFn$_invoke$arity$1 ? inst_30624.cljs$core$IFn$_invoke$arity$1(inst_30638) : inst_30624.call(null, inst_30638));
var inst_30661 = cljs.core.not(inst_30660);
var state_30684__$1 = state_30684;
var statearr_30725_32644 = state_30684__$1;
(statearr_30725_32644[(2)] = inst_30661);

(statearr_30725_32644[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (3))){
var inst_30682 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30684__$1,inst_30682);
} else {
if((state_val_30685 === (12))){
var state_30684__$1 = state_30684;
var statearr_30730_32649 = state_30684__$1;
(statearr_30730_32649[(2)] = null);

(statearr_30730_32649[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (2))){
var inst_30619 = (state_30684[(8)]);
var inst_30622 = (state_30684[(12)]);
var inst_30622__$1 = cljs.core.__destructure_map(inst_30619);
var inst_30623 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30622__$1,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_30624 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30622__$1,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_30625 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30622__$1,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var state_30684__$1 = (function (){var statearr_30736 = state_30684;
(statearr_30736[(15)] = inst_30623);

(statearr_30736[(12)] = inst_30622__$1);

(statearr_30736[(18)] = inst_30624);

return statearr_30736;
})();
return cljs.core.async.ioc_alts_BANG_(state_30684__$1,(4),inst_30625);
} else {
if((state_val_30685 === (23))){
var inst_30669 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
if(cljs.core.truth_(inst_30669)){
var statearr_30739_32651 = state_30684__$1;
(statearr_30739_32651[(1)] = (24));

} else {
var statearr_30740_32652 = state_30684__$1;
(statearr_30740_32652[(1)] = (25));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (19))){
var inst_30664 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
var statearr_30741_32655 = state_30684__$1;
(statearr_30741_32655[(2)] = inst_30664);

(statearr_30741_32655[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (11))){
var inst_30638 = (state_30684[(14)]);
var inst_30648 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cs,cljs.core.dissoc,inst_30638);
var state_30684__$1 = state_30684;
var statearr_30743_32658 = state_30684__$1;
(statearr_30743_32658[(2)] = inst_30648);

(statearr_30743_32658[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (9))){
var inst_30623 = (state_30684[(15)]);
var inst_30638 = (state_30684[(14)]);
var inst_30655 = (state_30684[(19)]);
var inst_30655__$1 = (inst_30623.cljs$core$IFn$_invoke$arity$1 ? inst_30623.cljs$core$IFn$_invoke$arity$1(inst_30638) : inst_30623.call(null, inst_30638));
var state_30684__$1 = (function (){var statearr_30746 = state_30684;
(statearr_30746[(19)] = inst_30655__$1);

return statearr_30746;
})();
if(cljs.core.truth_(inst_30655__$1)){
var statearr_30747_32659 = state_30684__$1;
(statearr_30747_32659[(1)] = (14));

} else {
var statearr_30748_32660 = state_30684__$1;
(statearr_30748_32660[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (5))){
var inst_30639 = (state_30684[(13)]);
var state_30684__$1 = state_30684;
var statearr_30749_32665 = state_30684__$1;
(statearr_30749_32665[(2)] = inst_30639);

(statearr_30749_32665[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (14))){
var inst_30655 = (state_30684[(19)]);
var state_30684__$1 = state_30684;
var statearr_30754_32671 = state_30684__$1;
(statearr_30754_32671[(2)] = inst_30655);

(statearr_30754_32671[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (26))){
var inst_30674 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
var statearr_30755_32679 = state_30684__$1;
(statearr_30755_32679[(2)] = inst_30674);

(statearr_30755_32679[(1)] = (22));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (16))){
var inst_30666 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
if(cljs.core.truth_(inst_30666)){
var statearr_30756_32686 = state_30684__$1;
(statearr_30756_32686[(1)] = (20));

} else {
var statearr_30757_32687 = state_30684__$1;
(statearr_30757_32687[(1)] = (21));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (10))){
var inst_30680 = (state_30684[(2)]);
var state_30684__$1 = state_30684;
var statearr_30758_32690 = state_30684__$1;
(statearr_30758_32690[(2)] = inst_30680);

(statearr_30758_32690[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (18))){
var inst_30658 = (state_30684[(16)]);
var state_30684__$1 = state_30684;
var statearr_30759_32691 = state_30684__$1;
(statearr_30759_32691[(2)] = inst_30658);

(statearr_30759_32691[(1)] = (19));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30685 === (8))){
var inst_30637 = (state_30684[(7)]);
var inst_30646 = (inst_30637 == null);
var state_30684__$1 = state_30684;
if(cljs.core.truth_(inst_30646)){
var statearr_30760_32692 = state_30684__$1;
(statearr_30760_32692[(1)] = (11));

} else {
var statearr_30761_32693 = state_30684__$1;
(statearr_30761_32693[(1)] = (12));

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
var statearr_30764 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30764[(0)] = cljs$core$async$mix_$_state_machine__28378__auto__);

(statearr_30764[(1)] = (1));

return statearr_30764;
});
var cljs$core$async$mix_$_state_machine__28378__auto____1 = (function (state_30684){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30684);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30765){var ex__28381__auto__ = e30765;
var statearr_30766_32704 = state_30684;
(statearr_30766_32704[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30684[(4)]))){
var statearr_30767_32705 = state_30684;
(statearr_30767_32705[(1)] = cljs.core.first((state_30684[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32712 = state_30684;
state_30684 = G__32712;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__28378__auto__ = function(state_30684){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__28378__auto____1.call(this,state_30684);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__28378__auto____0;
cljs$core$async$mix_$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__28378__auto____1;
return cljs$core$async$mix_$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30768 = f__29126__auto__();
(statearr_30768[(6)] = c__29125__auto___32582);

return statearr_30768;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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

var cljs$core$async$Pub$sub_STAR_$dyn_32730 = (function (p,v,ch,close_QMARK_){
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
return cljs$core$async$Pub$sub_STAR_$dyn_32730(p,v,ch,close_QMARK_);
}
});

var cljs$core$async$Pub$unsub_STAR_$dyn_32743 = (function (p,v,ch){
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
return cljs$core$async$Pub$unsub_STAR_$dyn_32743(p,v,ch);
}
});

var cljs$core$async$Pub$unsub_all_STAR_$dyn_32754 = (function() {
var G__32755 = null;
var G__32755__1 = (function (p){
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
var G__32755__2 = (function (p,v){
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
G__32755 = function(p,v){
switch(arguments.length){
case 1:
return G__32755__1.call(this,p);
case 2:
return G__32755__2.call(this,p,v);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__32755.cljs$core$IFn$_invoke$arity$1 = G__32755__1;
G__32755.cljs$core$IFn$_invoke$arity$2 = G__32755__2;
return G__32755;
})()
;
cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var G__30787 = arguments.length;
switch (G__30787) {
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
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32754(p);
}
}));

(cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (p,v){
if((((!((p == null)))) && ((!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$2 == null)))))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$2(p,v);
} else {
return cljs$core$async$Pub$unsub_all_STAR_$dyn_32754(p,v);
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
cljs.core.async.t_cljs$core$async30805 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta30806){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta30806 = meta30806;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_30807,meta30806__$1){
var self__ = this;
var _30807__$1 = this;
return (new cljs.core.async.t_cljs$core$async30805(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta30806__$1));
}));

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_30807){
var self__ = this;
var _30807__$1 = this;
return self__.meta30806;
}));

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Mux$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
}));

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Pub$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = (self__.ensure_mult.cljs$core$IFn$_invoke$arity$1 ? self__.ensure_mult.cljs$core$IFn$_invoke$arity$1(topic) : self__.ensure_mult.call(null, topic));
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(m,ch__$1,close_QMARK_);
}));

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = (function (p,topic,ch__$1){
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

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reset_BANG_(self__.mults,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs.core.async.t_cljs$core$async30805.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.mults,cljs.core.dissoc,topic);
}));

(cljs.core.async.t_cljs$core$async30805.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"topic-fn","topic-fn",-862449736,null),new cljs.core.Symbol(null,"buf-fn","buf-fn",-1200281591,null),new cljs.core.Symbol(null,"mults","mults",-461114485,null),new cljs.core.Symbol(null,"ensure-mult","ensure-mult",1796584816,null),new cljs.core.Symbol(null,"meta30806","meta30806",-634285637,null)], null);
}));

(cljs.core.async.t_cljs$core$async30805.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async30805.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async30805");

(cljs.core.async.t_cljs$core$async30805.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async30805");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async30805.
 */
cljs.core.async.__GT_t_cljs$core$async30805 = (function cljs$core$async$__GT_t_cljs$core$async30805(ch,topic_fn,buf_fn,mults,ensure_mult,meta30806){
return (new cljs.core.async.t_cljs$core$async30805(ch,topic_fn,buf_fn,mults,ensure_mult,meta30806));
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
var G__30798 = arguments.length;
switch (G__30798) {
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
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(mults,(function (p1__30793_SHARP_){
if(cljs.core.truth_((p1__30793_SHARP_.cljs$core$IFn$_invoke$arity$1 ? p1__30793_SHARP_.cljs$core$IFn$_invoke$arity$1(topic) : p1__30793_SHARP_.call(null, topic)))){
return p1__30793_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__30793_SHARP_,topic,cljs.core.async.mult(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((buf_fn.cljs$core$IFn$_invoke$arity$1 ? buf_fn.cljs$core$IFn$_invoke$arity$1(topic) : buf_fn.call(null, topic)))));
}
})),topic);
}
});
var p = (new cljs.core.async.t_cljs$core$async30805(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
var c__29125__auto___32776 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_30893){
var state_val_30894 = (state_30893[(1)]);
if((state_val_30894 === (7))){
var inst_30889 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30895_32777 = state_30893__$1;
(statearr_30895_32777[(2)] = inst_30889);

(statearr_30895_32777[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (20))){
var state_30893__$1 = state_30893;
var statearr_30896_32782 = state_30893__$1;
(statearr_30896_32782[(2)] = null);

(statearr_30896_32782[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (1))){
var state_30893__$1 = state_30893;
var statearr_30899_32783 = state_30893__$1;
(statearr_30899_32783[(2)] = null);

(statearr_30899_32783[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (24))){
var inst_30872 = (state_30893[(7)]);
var inst_30881 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(mults,cljs.core.dissoc,inst_30872);
var state_30893__$1 = state_30893;
var statearr_30900_32784 = state_30893__$1;
(statearr_30900_32784[(2)] = inst_30881);

(statearr_30900_32784[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (4))){
var inst_30824 = (state_30893[(8)]);
var inst_30824__$1 = (state_30893[(2)]);
var inst_30825 = (inst_30824__$1 == null);
var state_30893__$1 = (function (){var statearr_30902 = state_30893;
(statearr_30902[(8)] = inst_30824__$1);

return statearr_30902;
})();
if(cljs.core.truth_(inst_30825)){
var statearr_30903_32785 = state_30893__$1;
(statearr_30903_32785[(1)] = (5));

} else {
var statearr_30904_32786 = state_30893__$1;
(statearr_30904_32786[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (15))){
var inst_30866 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30908_32787 = state_30893__$1;
(statearr_30908_32787[(2)] = inst_30866);

(statearr_30908_32787[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (21))){
var inst_30886 = (state_30893[(2)]);
var state_30893__$1 = (function (){var statearr_30912 = state_30893;
(statearr_30912[(9)] = inst_30886);

return statearr_30912;
})();
var statearr_30913_32792 = state_30893__$1;
(statearr_30913_32792[(2)] = null);

(statearr_30913_32792[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (13))){
var inst_30848 = (state_30893[(10)]);
var inst_30850 = cljs.core.chunked_seq_QMARK_(inst_30848);
var state_30893__$1 = state_30893;
if(inst_30850){
var statearr_30914_32793 = state_30893__$1;
(statearr_30914_32793[(1)] = (16));

} else {
var statearr_30915_32794 = state_30893__$1;
(statearr_30915_32794[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (22))){
var inst_30878 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
if(cljs.core.truth_(inst_30878)){
var statearr_30916_32796 = state_30893__$1;
(statearr_30916_32796[(1)] = (23));

} else {
var statearr_30917_32797 = state_30893__$1;
(statearr_30917_32797[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (6))){
var inst_30872 = (state_30893[(7)]);
var inst_30874 = (state_30893[(11)]);
var inst_30824 = (state_30893[(8)]);
var inst_30872__$1 = (topic_fn.cljs$core$IFn$_invoke$arity$1 ? topic_fn.cljs$core$IFn$_invoke$arity$1(inst_30824) : topic_fn.call(null, inst_30824));
var inst_30873 = cljs.core.deref(mults);
var inst_30874__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_30873,inst_30872__$1);
var state_30893__$1 = (function (){var statearr_30918 = state_30893;
(statearr_30918[(7)] = inst_30872__$1);

(statearr_30918[(11)] = inst_30874__$1);

return statearr_30918;
})();
if(cljs.core.truth_(inst_30874__$1)){
var statearr_30919_32798 = state_30893__$1;
(statearr_30919_32798[(1)] = (19));

} else {
var statearr_30920_32799 = state_30893__$1;
(statearr_30920_32799[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (25))){
var inst_30883 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30921_32800 = state_30893__$1;
(statearr_30921_32800[(2)] = inst_30883);

(statearr_30921_32800[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (17))){
var inst_30848 = (state_30893[(10)]);
var inst_30857 = cljs.core.first(inst_30848);
var inst_30858 = cljs.core.async.muxch_STAR_(inst_30857);
var inst_30859 = cljs.core.async.close_BANG_(inst_30858);
var inst_30860 = cljs.core.next(inst_30848);
var inst_30834 = inst_30860;
var inst_30835 = null;
var inst_30836 = (0);
var inst_30837 = (0);
var state_30893__$1 = (function (){var statearr_30923 = state_30893;
(statearr_30923[(12)] = inst_30836);

(statearr_30923[(13)] = inst_30837);

(statearr_30923[(14)] = inst_30834);

(statearr_30923[(15)] = inst_30835);

(statearr_30923[(16)] = inst_30859);

return statearr_30923;
})();
var statearr_30924_32801 = state_30893__$1;
(statearr_30924_32801[(2)] = null);

(statearr_30924_32801[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (3))){
var inst_30891 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
return cljs.core.async.impl.ioc_helpers.return_chan(state_30893__$1,inst_30891);
} else {
if((state_val_30894 === (12))){
var inst_30868 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30925_32802 = state_30893__$1;
(statearr_30925_32802[(2)] = inst_30868);

(statearr_30925_32802[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (2))){
var state_30893__$1 = state_30893;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_30893__$1,(4),ch);
} else {
if((state_val_30894 === (23))){
var state_30893__$1 = state_30893;
var statearr_30926_32803 = state_30893__$1;
(statearr_30926_32803[(2)] = null);

(statearr_30926_32803[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (19))){
var inst_30874 = (state_30893[(11)]);
var inst_30824 = (state_30893[(8)]);
var inst_30876 = cljs.core.async.muxch_STAR_(inst_30874);
var state_30893__$1 = state_30893;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_30893__$1,(22),inst_30876,inst_30824);
} else {
if((state_val_30894 === (11))){
var inst_30834 = (state_30893[(14)]);
var inst_30848 = (state_30893[(10)]);
var inst_30848__$1 = cljs.core.seq(inst_30834);
var state_30893__$1 = (function (){var statearr_30937 = state_30893;
(statearr_30937[(10)] = inst_30848__$1);

return statearr_30937;
})();
if(inst_30848__$1){
var statearr_30938_32809 = state_30893__$1;
(statearr_30938_32809[(1)] = (13));

} else {
var statearr_30939_32810 = state_30893__$1;
(statearr_30939_32810[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (9))){
var inst_30870 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30940_32816 = state_30893__$1;
(statearr_30940_32816[(2)] = inst_30870);

(statearr_30940_32816[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (5))){
var inst_30831 = cljs.core.deref(mults);
var inst_30832 = cljs.core.vals(inst_30831);
var inst_30833 = cljs.core.seq(inst_30832);
var inst_30834 = inst_30833;
var inst_30835 = null;
var inst_30836 = (0);
var inst_30837 = (0);
var state_30893__$1 = (function (){var statearr_30944 = state_30893;
(statearr_30944[(12)] = inst_30836);

(statearr_30944[(13)] = inst_30837);

(statearr_30944[(14)] = inst_30834);

(statearr_30944[(15)] = inst_30835);

return statearr_30944;
})();
var statearr_30945_32818 = state_30893__$1;
(statearr_30945_32818[(2)] = null);

(statearr_30945_32818[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (14))){
var state_30893__$1 = state_30893;
var statearr_30949_32820 = state_30893__$1;
(statearr_30949_32820[(2)] = null);

(statearr_30949_32820[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (16))){
var inst_30848 = (state_30893[(10)]);
var inst_30852 = cljs.core.chunk_first(inst_30848);
var inst_30853 = cljs.core.chunk_rest(inst_30848);
var inst_30854 = cljs.core.count(inst_30852);
var inst_30834 = inst_30853;
var inst_30835 = inst_30852;
var inst_30836 = inst_30854;
var inst_30837 = (0);
var state_30893__$1 = (function (){var statearr_30950 = state_30893;
(statearr_30950[(12)] = inst_30836);

(statearr_30950[(13)] = inst_30837);

(statearr_30950[(14)] = inst_30834);

(statearr_30950[(15)] = inst_30835);

return statearr_30950;
})();
var statearr_30951_32821 = state_30893__$1;
(statearr_30951_32821[(2)] = null);

(statearr_30951_32821[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (10))){
var inst_30836 = (state_30893[(12)]);
var inst_30837 = (state_30893[(13)]);
var inst_30834 = (state_30893[(14)]);
var inst_30835 = (state_30893[(15)]);
var inst_30842 = cljs.core._nth(inst_30835,inst_30837);
var inst_30843 = cljs.core.async.muxch_STAR_(inst_30842);
var inst_30844 = cljs.core.async.close_BANG_(inst_30843);
var inst_30845 = (inst_30837 + (1));
var tmp30946 = inst_30836;
var tmp30947 = inst_30834;
var tmp30948 = inst_30835;
var inst_30834__$1 = tmp30947;
var inst_30835__$1 = tmp30948;
var inst_30836__$1 = tmp30946;
var inst_30837__$1 = inst_30845;
var state_30893__$1 = (function (){var statearr_30952 = state_30893;
(statearr_30952[(12)] = inst_30836__$1);

(statearr_30952[(13)] = inst_30837__$1);

(statearr_30952[(14)] = inst_30834__$1);

(statearr_30952[(15)] = inst_30835__$1);

(statearr_30952[(17)] = inst_30844);

return statearr_30952;
})();
var statearr_30953_32829 = state_30893__$1;
(statearr_30953_32829[(2)] = null);

(statearr_30953_32829[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (18))){
var inst_30863 = (state_30893[(2)]);
var state_30893__$1 = state_30893;
var statearr_30954_32837 = state_30893__$1;
(statearr_30954_32837[(2)] = inst_30863);

(statearr_30954_32837[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_30894 === (8))){
var inst_30836 = (state_30893[(12)]);
var inst_30837 = (state_30893[(13)]);
var inst_30839 = (inst_30837 < inst_30836);
var inst_30840 = inst_30839;
var state_30893__$1 = state_30893;
if(cljs.core.truth_(inst_30840)){
var statearr_30958_32843 = state_30893__$1;
(statearr_30958_32843[(1)] = (10));

} else {
var statearr_30959_32844 = state_30893__$1;
(statearr_30959_32844[(1)] = (11));

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
var statearr_30960 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_30960[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_30960[(1)] = (1));

return statearr_30960;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_30893){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_30893);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e30961){var ex__28381__auto__ = e30961;
var statearr_30962_32845 = state_30893;
(statearr_30962_32845[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_30893[(4)]))){
var statearr_30963_32846 = state_30893;
(statearr_30963_32846[(1)] = cljs.core.first((state_30893[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32847 = state_30893;
state_30893 = G__32847;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_30893){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_30893);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_30964 = f__29126__auto__();
(statearr_30964[(6)] = c__29125__auto___32776);

return statearr_30964;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var G__30968 = arguments.length;
switch (G__30968) {
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
var G__30974 = arguments.length;
switch (G__30974) {
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
var G__30981 = arguments.length;
switch (G__30981) {
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
var c__29125__auto___32853 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31027){
var state_val_31028 = (state_31027[(1)]);
if((state_val_31028 === (7))){
var state_31027__$1 = state_31027;
var statearr_31043_32854 = state_31027__$1;
(statearr_31043_32854[(2)] = null);

(statearr_31043_32854[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (1))){
var state_31027__$1 = state_31027;
var statearr_31044_32855 = state_31027__$1;
(statearr_31044_32855[(2)] = null);

(statearr_31044_32855[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (4))){
var inst_30987 = (state_31027[(7)]);
var inst_30988 = (state_31027[(8)]);
var inst_30990 = (inst_30988 < inst_30987);
var state_31027__$1 = state_31027;
if(cljs.core.truth_(inst_30990)){
var statearr_31051_32856 = state_31027__$1;
(statearr_31051_32856[(1)] = (6));

} else {
var statearr_31052_32857 = state_31027__$1;
(statearr_31052_32857[(1)] = (7));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (15))){
var inst_31013 = (state_31027[(9)]);
var inst_31018 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,inst_31013);
var state_31027__$1 = state_31027;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31027__$1,(17),out,inst_31018);
} else {
if((state_val_31028 === (13))){
var inst_31013 = (state_31027[(9)]);
var inst_31013__$1 = (state_31027[(2)]);
var inst_31014 = cljs.core.some(cljs.core.nil_QMARK_,inst_31013__$1);
var state_31027__$1 = (function (){var statearr_31053 = state_31027;
(statearr_31053[(9)] = inst_31013__$1);

return statearr_31053;
})();
if(cljs.core.truth_(inst_31014)){
var statearr_31054_32861 = state_31027__$1;
(statearr_31054_32861[(1)] = (14));

} else {
var statearr_31055_32862 = state_31027__$1;
(statearr_31055_32862[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (6))){
var state_31027__$1 = state_31027;
var statearr_31070_32863 = state_31027__$1;
(statearr_31070_32863[(2)] = null);

(statearr_31070_32863[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (17))){
var inst_31020 = (state_31027[(2)]);
var state_31027__$1 = (function (){var statearr_31078 = state_31027;
(statearr_31078[(10)] = inst_31020);

return statearr_31078;
})();
var statearr_31079_32868 = state_31027__$1;
(statearr_31079_32868[(2)] = null);

(statearr_31079_32868[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (3))){
var inst_31025 = (state_31027[(2)]);
var state_31027__$1 = state_31027;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31027__$1,inst_31025);
} else {
if((state_val_31028 === (12))){
var _ = (function (){var statearr_31082 = state_31027;
(statearr_31082[(4)] = cljs.core.rest((state_31027[(4)])));

return statearr_31082;
})();
var state_31027__$1 = state_31027;
var ex31077 = (state_31027__$1[(2)]);
var statearr_31083_32869 = state_31027__$1;
(statearr_31083_32869[(5)] = ex31077);


if((ex31077 instanceof Object)){
var statearr_31084_32871 = state_31027__$1;
(statearr_31084_32871[(1)] = (11));

(statearr_31084_32871[(5)] = null);

} else {
throw ex31077;

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (2))){
var inst_30986 = cljs.core.reset_BANG_(dctr,cnt);
var inst_30987 = cnt;
var inst_30988 = (0);
var state_31027__$1 = (function (){var statearr_31086 = state_31027;
(statearr_31086[(11)] = inst_30986);

(statearr_31086[(7)] = inst_30987);

(statearr_31086[(8)] = inst_30988);

return statearr_31086;
})();
var statearr_31087_32873 = state_31027__$1;
(statearr_31087_32873[(2)] = null);

(statearr_31087_32873[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (11))){
var inst_30992 = (state_31027[(2)]);
var inst_30993 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec);
var state_31027__$1 = (function (){var statearr_31088 = state_31027;
(statearr_31088[(12)] = inst_30992);

return statearr_31088;
})();
var statearr_31089_32874 = state_31027__$1;
(statearr_31089_32874[(2)] = inst_30993);

(statearr_31089_32874[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (9))){
var inst_30988 = (state_31027[(8)]);
var _ = (function (){var statearr_31090 = state_31027;
(statearr_31090[(4)] = cljs.core.cons((12),(state_31027[(4)])));

return statearr_31090;
})();
var inst_30999 = (chs__$1.cljs$core$IFn$_invoke$arity$1 ? chs__$1.cljs$core$IFn$_invoke$arity$1(inst_30988) : chs__$1.call(null, inst_30988));
var inst_31000 = (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(inst_30988) : done.call(null, inst_30988));
var inst_31001 = cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2(inst_30999,inst_31000);
var ___$1 = (function (){var statearr_31094 = state_31027;
(statearr_31094[(4)] = cljs.core.rest((state_31027[(4)])));

return statearr_31094;
})();
var state_31027__$1 = state_31027;
var statearr_31095_32875 = state_31027__$1;
(statearr_31095_32875[(2)] = inst_31001);

(statearr_31095_32875[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (5))){
var inst_31011 = (state_31027[(2)]);
var state_31027__$1 = (function (){var statearr_31096 = state_31027;
(statearr_31096[(13)] = inst_31011);

return statearr_31096;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31027__$1,(13),dchan);
} else {
if((state_val_31028 === (14))){
var inst_31016 = cljs.core.async.close_BANG_(out);
var state_31027__$1 = state_31027;
var statearr_31097_32876 = state_31027__$1;
(statearr_31097_32876[(2)] = inst_31016);

(statearr_31097_32876[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (16))){
var inst_31023 = (state_31027[(2)]);
var state_31027__$1 = state_31027;
var statearr_31098_32878 = state_31027__$1;
(statearr_31098_32878[(2)] = inst_31023);

(statearr_31098_32878[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (10))){
var inst_30988 = (state_31027[(8)]);
var inst_31004 = (state_31027[(2)]);
var inst_31005 = (inst_30988 + (1));
var inst_30988__$1 = inst_31005;
var state_31027__$1 = (function (){var statearr_31099 = state_31027;
(statearr_31099[(14)] = inst_31004);

(statearr_31099[(8)] = inst_30988__$1);

return statearr_31099;
})();
var statearr_31100_32881 = state_31027__$1;
(statearr_31100_32881[(2)] = null);

(statearr_31100_32881[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31028 === (8))){
var inst_31009 = (state_31027[(2)]);
var state_31027__$1 = state_31027;
var statearr_31101_32882 = state_31027__$1;
(statearr_31101_32882[(2)] = inst_31009);

(statearr_31101_32882[(1)] = (5));


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
var statearr_31102 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31102[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31102[(1)] = (1));

return statearr_31102;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31027){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31027);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31103){var ex__28381__auto__ = e31103;
var statearr_31104_32890 = state_31027;
(statearr_31104_32890[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31027[(4)]))){
var statearr_31108_32894 = state_31027;
(statearr_31108_32894[(1)] = cljs.core.first((state_31027[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32895 = state_31027;
state_31027 = G__32895;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31027){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31027);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31109 = f__29126__auto__();
(statearr_31109[(6)] = c__29125__auto___32853);

return statearr_31109;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var G__31112 = arguments.length;
switch (G__31112) {
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
var c__29125__auto___32901 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31144){
var state_val_31145 = (state_31144[(1)]);
if((state_val_31145 === (7))){
var inst_31124 = (state_31144[(7)]);
var inst_31123 = (state_31144[(8)]);
var inst_31123__$1 = (state_31144[(2)]);
var inst_31124__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31123__$1,(0),null);
var inst_31125 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_31123__$1,(1),null);
var inst_31126 = (inst_31124__$1 == null);
var state_31144__$1 = (function (){var statearr_31146 = state_31144;
(statearr_31146[(7)] = inst_31124__$1);

(statearr_31146[(8)] = inst_31123__$1);

(statearr_31146[(9)] = inst_31125);

return statearr_31146;
})();
if(cljs.core.truth_(inst_31126)){
var statearr_31147_32905 = state_31144__$1;
(statearr_31147_32905[(1)] = (8));

} else {
var statearr_31148_32909 = state_31144__$1;
(statearr_31148_32909[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (1))){
var inst_31113 = cljs.core.vec(chs);
var inst_31114 = inst_31113;
var state_31144__$1 = (function (){var statearr_31149 = state_31144;
(statearr_31149[(10)] = inst_31114);

return statearr_31149;
})();
var statearr_31150_32910 = state_31144__$1;
(statearr_31150_32910[(2)] = null);

(statearr_31150_32910[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (4))){
var inst_31114 = (state_31144[(10)]);
var state_31144__$1 = state_31144;
return cljs.core.async.ioc_alts_BANG_(state_31144__$1,(7),inst_31114);
} else {
if((state_val_31145 === (6))){
var inst_31140 = (state_31144[(2)]);
var state_31144__$1 = state_31144;
var statearr_31151_32911 = state_31144__$1;
(statearr_31151_32911[(2)] = inst_31140);

(statearr_31151_32911[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (3))){
var inst_31142 = (state_31144[(2)]);
var state_31144__$1 = state_31144;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31144__$1,inst_31142);
} else {
if((state_val_31145 === (2))){
var inst_31114 = (state_31144[(10)]);
var inst_31116 = cljs.core.count(inst_31114);
var inst_31117 = (inst_31116 > (0));
var state_31144__$1 = state_31144;
if(cljs.core.truth_(inst_31117)){
var statearr_31153_32915 = state_31144__$1;
(statearr_31153_32915[(1)] = (4));

} else {
var statearr_31154_32916 = state_31144__$1;
(statearr_31154_32916[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (11))){
var inst_31114 = (state_31144[(10)]);
var inst_31133 = (state_31144[(2)]);
var tmp31152 = inst_31114;
var inst_31114__$1 = tmp31152;
var state_31144__$1 = (function (){var statearr_31157 = state_31144;
(statearr_31157[(11)] = inst_31133);

(statearr_31157[(10)] = inst_31114__$1);

return statearr_31157;
})();
var statearr_31159_32917 = state_31144__$1;
(statearr_31159_32917[(2)] = null);

(statearr_31159_32917[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (9))){
var inst_31124 = (state_31144[(7)]);
var state_31144__$1 = state_31144;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31144__$1,(11),out,inst_31124);
} else {
if((state_val_31145 === (5))){
var inst_31138 = cljs.core.async.close_BANG_(out);
var state_31144__$1 = state_31144;
var statearr_31168_32925 = state_31144__$1;
(statearr_31168_32925[(2)] = inst_31138);

(statearr_31168_32925[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (10))){
var inst_31136 = (state_31144[(2)]);
var state_31144__$1 = state_31144;
var statearr_31172_32930 = state_31144__$1;
(statearr_31172_32930[(2)] = inst_31136);

(statearr_31172_32930[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31145 === (8))){
var inst_31124 = (state_31144[(7)]);
var inst_31123 = (state_31144[(8)]);
var inst_31125 = (state_31144[(9)]);
var inst_31114 = (state_31144[(10)]);
var inst_31128 = (function (){var cs = inst_31114;
var vec__31119 = inst_31123;
var v = inst_31124;
var c = inst_31125;
return (function (p1__31110_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,p1__31110_SHARP_);
});
})();
var inst_31129 = cljs.core.filterv(inst_31128,inst_31114);
var inst_31114__$1 = inst_31129;
var state_31144__$1 = (function (){var statearr_31173 = state_31144;
(statearr_31173[(10)] = inst_31114__$1);

return statearr_31173;
})();
var statearr_31174_32932 = state_31144__$1;
(statearr_31174_32932[(2)] = null);

(statearr_31174_32932[(1)] = (2));


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
var statearr_31175 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31175[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31175[(1)] = (1));

return statearr_31175;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31144){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31144);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31176){var ex__28381__auto__ = e31176;
var statearr_31177_32936 = state_31144;
(statearr_31177_32936[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31144[(4)]))){
var statearr_31178_32938 = state_31144;
(statearr_31178_32938[(1)] = cljs.core.first((state_31144[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32939 = state_31144;
state_31144 = G__32939;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31144){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31144);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31179 = f__29126__auto__();
(statearr_31179[(6)] = c__29125__auto___32901);

return statearr_31179;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
var G__31181 = arguments.length;
switch (G__31181) {
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
var c__29125__auto___32948 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31209){
var state_val_31210 = (state_31209[(1)]);
if((state_val_31210 === (7))){
var inst_31190 = (state_31209[(7)]);
var inst_31190__$1 = (state_31209[(2)]);
var inst_31191 = (inst_31190__$1 == null);
var inst_31192 = cljs.core.not(inst_31191);
var state_31209__$1 = (function (){var statearr_31212 = state_31209;
(statearr_31212[(7)] = inst_31190__$1);

return statearr_31212;
})();
if(inst_31192){
var statearr_31213_32950 = state_31209__$1;
(statearr_31213_32950[(1)] = (8));

} else {
var statearr_31214_32951 = state_31209__$1;
(statearr_31214_32951[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (1))){
var inst_31185 = (0);
var state_31209__$1 = (function (){var statearr_31215 = state_31209;
(statearr_31215[(8)] = inst_31185);

return statearr_31215;
})();
var statearr_31218_32955 = state_31209__$1;
(statearr_31218_32955[(2)] = null);

(statearr_31218_32955[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (4))){
var state_31209__$1 = state_31209;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31209__$1,(7),ch);
} else {
if((state_val_31210 === (6))){
var inst_31204 = (state_31209[(2)]);
var state_31209__$1 = state_31209;
var statearr_31219_32956 = state_31209__$1;
(statearr_31219_32956[(2)] = inst_31204);

(statearr_31219_32956[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (3))){
var inst_31206 = (state_31209[(2)]);
var inst_31207 = cljs.core.async.close_BANG_(out);
var state_31209__$1 = (function (){var statearr_31221 = state_31209;
(statearr_31221[(9)] = inst_31206);

return statearr_31221;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31209__$1,inst_31207);
} else {
if((state_val_31210 === (2))){
var inst_31185 = (state_31209[(8)]);
var inst_31187 = (inst_31185 < n);
var state_31209__$1 = state_31209;
if(cljs.core.truth_(inst_31187)){
var statearr_31223_32957 = state_31209__$1;
(statearr_31223_32957[(1)] = (4));

} else {
var statearr_31224_32958 = state_31209__$1;
(statearr_31224_32958[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (11))){
var inst_31185 = (state_31209[(8)]);
var inst_31195 = (state_31209[(2)]);
var inst_31197 = (inst_31185 + (1));
var inst_31185__$1 = inst_31197;
var state_31209__$1 = (function (){var statearr_31228 = state_31209;
(statearr_31228[(10)] = inst_31195);

(statearr_31228[(8)] = inst_31185__$1);

return statearr_31228;
})();
var statearr_31229_32959 = state_31209__$1;
(statearr_31229_32959[(2)] = null);

(statearr_31229_32959[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (9))){
var state_31209__$1 = state_31209;
var statearr_31232_32960 = state_31209__$1;
(statearr_31232_32960[(2)] = null);

(statearr_31232_32960[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (5))){
var state_31209__$1 = state_31209;
var statearr_31233_32961 = state_31209__$1;
(statearr_31233_32961[(2)] = null);

(statearr_31233_32961[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (10))){
var inst_31201 = (state_31209[(2)]);
var state_31209__$1 = state_31209;
var statearr_31234_32962 = state_31209__$1;
(statearr_31234_32962[(2)] = inst_31201);

(statearr_31234_32962[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31210 === (8))){
var inst_31190 = (state_31209[(7)]);
var state_31209__$1 = state_31209;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31209__$1,(11),out,inst_31190);
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
var statearr_31235 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31235[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31235[(1)] = (1));

return statearr_31235;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31209){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31209);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31239){var ex__28381__auto__ = e31239;
var statearr_31243_32963 = state_31209;
(statearr_31243_32963[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31209[(4)]))){
var statearr_31244_32964 = state_31209;
(statearr_31244_32964[(1)] = cljs.core.first((state_31209[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__32969 = state_31209;
state_31209 = G__32969;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31209){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31209);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31249 = f__29126__auto__();
(statearr_31249[(6)] = c__29125__auto___32948);

return statearr_31249;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
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
cljs.core.async.t_cljs$core$async31266 = (function (f,ch,meta31255,_,fn1,meta31267){
this.f = f;
this.ch = ch;
this.meta31255 = meta31255;
this._ = _;
this.fn1 = fn1;
this.meta31267 = meta31267;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31268,meta31267__$1){
var self__ = this;
var _31268__$1 = this;
return (new cljs.core.async.t_cljs$core$async31266(self__.f,self__.ch,self__.meta31255,self__._,self__.fn1,meta31267__$1));
}));

(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31268){
var self__ = this;
var _31268__$1 = this;
return self__.meta31267;
}));

(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$async$impl$protocols$Handler$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.fn1);
}));

(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
}));

(cljs.core.async.t_cljs$core$async31266.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit(self__.fn1);
return (function (p1__31250_SHARP_){
var G__31269 = (((p1__31250_SHARP_ == null))?null:(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(p1__31250_SHARP_) : self__.f.call(null, p1__31250_SHARP_)));
return (f1.cljs$core$IFn$_invoke$arity$1 ? f1.cljs$core$IFn$_invoke$arity$1(G__31269) : f1.call(null, G__31269));
});
}));

(cljs.core.async.t_cljs$core$async31266.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31255","meta31255",11824866,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("cljs.core.async","t_cljs$core$async31254","cljs.core.async/t_cljs$core$async31254",-570933083,null)], null)),new cljs.core.Symbol(null,"fn1","fn1",895834444,null),new cljs.core.Symbol(null,"meta31267","meta31267",411146244,null)], null);
}));

(cljs.core.async.t_cljs$core$async31266.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31266.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31266");

(cljs.core.async.t_cljs$core$async31266.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31266");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31266.
 */
cljs.core.async.__GT_t_cljs$core$async31266 = (function cljs$core$async$__GT_t_cljs$core$async31266(f,ch,meta31255,_,fn1,meta31267){
return (new cljs.core.async.t_cljs$core$async31266(f,ch,meta31255,_,fn1,meta31267));
});



/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31254 = (function (f,ch,meta31255){
this.f = f;
this.ch = ch;
this.meta31255 = meta31255;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31256,meta31255__$1){
var self__ = this;
var _31256__$1 = this;
return (new cljs.core.async.t_cljs$core$async31254(self__.f,self__.ch,meta31255__$1));
}));

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31256){
var self__ = this;
var _31256__$1 = this;
return self__.meta31255;
}));

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_(self__.ch,(new cljs.core.async.t_cljs$core$async31266(self__.f,self__.ch,self__.meta31255,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY)));
if(cljs.core.truth_((function (){var and__5043__auto__ = ret;
if(cljs.core.truth_(and__5043__auto__)){
return (!((cljs.core.deref(ret) == null)));
} else {
return and__5043__auto__;
}
})())){
return cljs.core.async.impl.channels.box((function (){var G__31283 = cljs.core.deref(ret);
return (self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(G__31283) : self__.f.call(null, G__31283));
})());
} else {
return ret;
}
}));

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31254.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
}));

(cljs.core.async.t_cljs$core$async31254.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31255","meta31255",11824866,null)], null);
}));

(cljs.core.async.t_cljs$core$async31254.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31254.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31254");

(cljs.core.async.t_cljs$core$async31254.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31254");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31254.
 */
cljs.core.async.__GT_t_cljs$core$async31254 = (function cljs$core$async$__GT_t_cljs$core$async31254(f,ch,meta31255){
return (new cljs.core.async.t_cljs$core$async31254(f,ch,meta31255));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31254(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31297 = (function (f,ch,meta31298){
this.f = f;
this.ch = ch;
this.meta31298 = meta31298;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31299,meta31298__$1){
var self__ = this;
var _31299__$1 = this;
return (new cljs.core.async.t_cljs$core$async31297(self__.f,self__.ch,meta31298__$1));
}));

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_31299){
var self__ = this;
var _31299__$1 = this;
return self__.meta31298;
}));

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$Channel$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
}));

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$ReadPort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
}));

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$WritePort$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.async.t_cljs$core$async31297.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(val) : self__.f.call(null, val)),fn1);
}));

(cljs.core.async.t_cljs$core$async31297.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31298","meta31298",2132235407,null)], null);
}));

(cljs.core.async.t_cljs$core$async31297.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31297.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31297");

(cljs.core.async.t_cljs$core$async31297.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31297");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31297.
 */
cljs.core.async.__GT_t_cljs$core$async31297 = (function cljs$core$async$__GT_t_cljs$core$async31297(f,ch,meta31298){
return (new cljs.core.async.t_cljs$core$async31297(f,ch,meta31298));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
return (new cljs.core.async.t_cljs$core$async31297(f,ch,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async31322 = (function (p,ch,meta31323){
this.p = p;
this.ch = ch;
this.meta31323 = meta31323;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_31324,meta31323__$1){
var self__ = this;
var _31324__$1 = this;
return (new cljs.core.async.t_cljs$core$async31322(self__.p,self__.ch,meta31323__$1));
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

(cljs.core.async.t_cljs$core$async31322.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
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
if(cljs.core.truth_((self__.p.cljs$core$IFn$_invoke$arity$1 ? self__.p.cljs$core$IFn$_invoke$arity$1(val) : self__.p.call(null, val)))){
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box(cljs.core.not(cljs.core.async.impl.protocols.closed_QMARK_(self__.ch)));
}
}));

(cljs.core.async.t_cljs$core$async31322.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta31323","meta31323",1638799166,null)], null);
}));

(cljs.core.async.t_cljs$core$async31322.cljs$lang$type = true);

(cljs.core.async.t_cljs$core$async31322.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async31322");

(cljs.core.async.t_cljs$core$async31322.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs.core.async/t_cljs$core$async31322");
}));

/**
 * Positional factory function for cljs.core.async/t_cljs$core$async31322.
 */
cljs.core.async.__GT_t_cljs$core$async31322 = (function cljs$core$async$__GT_t_cljs$core$async31322(p,ch,meta31323){
return (new cljs.core.async.t_cljs$core$async31322(p,ch,meta31323));
});


/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
return (new cljs.core.async.t_cljs$core$async31322(p,ch,cljs.core.PersistentArrayMap.EMPTY));
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
var G__31329 = arguments.length;
switch (G__31329) {
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
var c__29125__auto___32996 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31350){
var state_val_31351 = (state_31350[(1)]);
if((state_val_31351 === (7))){
var inst_31346 = (state_31350[(2)]);
var state_31350__$1 = state_31350;
var statearr_31354_32997 = state_31350__$1;
(statearr_31354_32997[(2)] = inst_31346);

(statearr_31354_32997[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (1))){
var state_31350__$1 = state_31350;
var statearr_31367_32998 = state_31350__$1;
(statearr_31367_32998[(2)] = null);

(statearr_31367_32998[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (4))){
var inst_31332 = (state_31350[(7)]);
var inst_31332__$1 = (state_31350[(2)]);
var inst_31333 = (inst_31332__$1 == null);
var state_31350__$1 = (function (){var statearr_31368 = state_31350;
(statearr_31368[(7)] = inst_31332__$1);

return statearr_31368;
})();
if(cljs.core.truth_(inst_31333)){
var statearr_31369_33003 = state_31350__$1;
(statearr_31369_33003[(1)] = (5));

} else {
var statearr_31370_33004 = state_31350__$1;
(statearr_31370_33004[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (6))){
var inst_31332 = (state_31350[(7)]);
var inst_31337 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_31332) : p.call(null, inst_31332));
var state_31350__$1 = state_31350;
if(cljs.core.truth_(inst_31337)){
var statearr_31372_33005 = state_31350__$1;
(statearr_31372_33005[(1)] = (8));

} else {
var statearr_31373_33006 = state_31350__$1;
(statearr_31373_33006[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (3))){
var inst_31348 = (state_31350[(2)]);
var state_31350__$1 = state_31350;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31350__$1,inst_31348);
} else {
if((state_val_31351 === (2))){
var state_31350__$1 = state_31350;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31350__$1,(4),ch);
} else {
if((state_val_31351 === (11))){
var inst_31340 = (state_31350[(2)]);
var state_31350__$1 = state_31350;
var statearr_31384_33007 = state_31350__$1;
(statearr_31384_33007[(2)] = inst_31340);

(statearr_31384_33007[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (9))){
var state_31350__$1 = state_31350;
var statearr_31385_33013 = state_31350__$1;
(statearr_31385_33013[(2)] = null);

(statearr_31385_33013[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (5))){
var inst_31335 = cljs.core.async.close_BANG_(out);
var state_31350__$1 = state_31350;
var statearr_31387_33014 = state_31350__$1;
(statearr_31387_33014[(2)] = inst_31335);

(statearr_31387_33014[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (10))){
var inst_31343 = (state_31350[(2)]);
var state_31350__$1 = (function (){var statearr_31388 = state_31350;
(statearr_31388[(8)] = inst_31343);

return statearr_31388;
})();
var statearr_31390_33015 = state_31350__$1;
(statearr_31390_33015[(2)] = null);

(statearr_31390_33015[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31351 === (8))){
var inst_31332 = (state_31350[(7)]);
var state_31350__$1 = state_31350;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31350__$1,(11),out,inst_31332);
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
var statearr_31391 = [null,null,null,null,null,null,null,null,null];
(statearr_31391[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31391[(1)] = (1));

return statearr_31391;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31350){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31350);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31392){var ex__28381__auto__ = e31392;
var statearr_31393_33017 = state_31350;
(statearr_31393_33017[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31350[(4)]))){
var statearr_31394_33018 = state_31350;
(statearr_31394_33018[(1)] = cljs.core.first((state_31350[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33020 = state_31350;
state_31350 = G__33020;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31350){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31350);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31395 = f__29126__auto__();
(statearr_31395[(6)] = c__29125__auto___32996);

return statearr_31395;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


return out;
}));

(cljs.core.async.filter_LT_.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_LT_ = (function cljs$core$async$remove_LT_(var_args){
var G__31397 = arguments.length;
switch (G__31397) {
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
var c__29125__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31477){
var state_val_31478 = (state_31477[(1)]);
if((state_val_31478 === (7))){
var inst_31473 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
var statearr_31480_33022 = state_31477__$1;
(statearr_31480_33022[(2)] = inst_31473);

(statearr_31480_33022[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (20))){
var inst_31441 = (state_31477[(7)]);
var inst_31454 = (state_31477[(2)]);
var inst_31455 = cljs.core.next(inst_31441);
var inst_31427 = inst_31455;
var inst_31428 = null;
var inst_31429 = (0);
var inst_31430 = (0);
var state_31477__$1 = (function (){var statearr_31481 = state_31477;
(statearr_31481[(8)] = inst_31429);

(statearr_31481[(9)] = inst_31454);

(statearr_31481[(10)] = inst_31430);

(statearr_31481[(11)] = inst_31428);

(statearr_31481[(12)] = inst_31427);

return statearr_31481;
})();
var statearr_31482_33023 = state_31477__$1;
(statearr_31482_33023[(2)] = null);

(statearr_31482_33023[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (1))){
var state_31477__$1 = state_31477;
var statearr_31483_33024 = state_31477__$1;
(statearr_31483_33024[(2)] = null);

(statearr_31483_33024[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (4))){
var inst_31416 = (state_31477[(13)]);
var inst_31416__$1 = (state_31477[(2)]);
var inst_31417 = (inst_31416__$1 == null);
var state_31477__$1 = (function (){var statearr_31493 = state_31477;
(statearr_31493[(13)] = inst_31416__$1);

return statearr_31493;
})();
if(cljs.core.truth_(inst_31417)){
var statearr_31494_33025 = state_31477__$1;
(statearr_31494_33025[(1)] = (5));

} else {
var statearr_31495_33026 = state_31477__$1;
(statearr_31495_33026[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (15))){
var state_31477__$1 = state_31477;
var statearr_31499_33030 = state_31477__$1;
(statearr_31499_33030[(2)] = null);

(statearr_31499_33030[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (21))){
var state_31477__$1 = state_31477;
var statearr_31500_33031 = state_31477__$1;
(statearr_31500_33031[(2)] = null);

(statearr_31500_33031[(1)] = (23));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (13))){
var inst_31429 = (state_31477[(8)]);
var inst_31430 = (state_31477[(10)]);
var inst_31428 = (state_31477[(11)]);
var inst_31427 = (state_31477[(12)]);
var inst_31437 = (state_31477[(2)]);
var inst_31438 = (inst_31430 + (1));
var tmp31496 = inst_31429;
var tmp31497 = inst_31428;
var tmp31498 = inst_31427;
var inst_31427__$1 = tmp31498;
var inst_31428__$1 = tmp31497;
var inst_31429__$1 = tmp31496;
var inst_31430__$1 = inst_31438;
var state_31477__$1 = (function (){var statearr_31502 = state_31477;
(statearr_31502[(14)] = inst_31437);

(statearr_31502[(8)] = inst_31429__$1);

(statearr_31502[(10)] = inst_31430__$1);

(statearr_31502[(11)] = inst_31428__$1);

(statearr_31502[(12)] = inst_31427__$1);

return statearr_31502;
})();
var statearr_31503_33032 = state_31477__$1;
(statearr_31503_33032[(2)] = null);

(statearr_31503_33032[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (22))){
var state_31477__$1 = state_31477;
var statearr_31504_33037 = state_31477__$1;
(statearr_31504_33037[(2)] = null);

(statearr_31504_33037[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (6))){
var inst_31416 = (state_31477[(13)]);
var inst_31425 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31416) : f.call(null, inst_31416));
var inst_31426 = cljs.core.seq(inst_31425);
var inst_31427 = inst_31426;
var inst_31428 = null;
var inst_31429 = (0);
var inst_31430 = (0);
var state_31477__$1 = (function (){var statearr_31505 = state_31477;
(statearr_31505[(8)] = inst_31429);

(statearr_31505[(10)] = inst_31430);

(statearr_31505[(11)] = inst_31428);

(statearr_31505[(12)] = inst_31427);

return statearr_31505;
})();
var statearr_31506_33047 = state_31477__$1;
(statearr_31506_33047[(2)] = null);

(statearr_31506_33047[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (17))){
var inst_31441 = (state_31477[(7)]);
var inst_31445 = cljs.core.chunk_first(inst_31441);
var inst_31446 = cljs.core.chunk_rest(inst_31441);
var inst_31447 = cljs.core.count(inst_31445);
var inst_31427 = inst_31446;
var inst_31428 = inst_31445;
var inst_31429 = inst_31447;
var inst_31430 = (0);
var state_31477__$1 = (function (){var statearr_31507 = state_31477;
(statearr_31507[(8)] = inst_31429);

(statearr_31507[(10)] = inst_31430);

(statearr_31507[(11)] = inst_31428);

(statearr_31507[(12)] = inst_31427);

return statearr_31507;
})();
var statearr_31514_33048 = state_31477__$1;
(statearr_31514_33048[(2)] = null);

(statearr_31514_33048[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (3))){
var inst_31475 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31477__$1,inst_31475);
} else {
if((state_val_31478 === (12))){
var inst_31463 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
var statearr_31515_33056 = state_31477__$1;
(statearr_31515_33056[(2)] = inst_31463);

(statearr_31515_33056[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (2))){
var state_31477__$1 = state_31477;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31477__$1,(4),in$);
} else {
if((state_val_31478 === (23))){
var inst_31471 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
var statearr_31516_33057 = state_31477__$1;
(statearr_31516_33057[(2)] = inst_31471);

(statearr_31516_33057[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (19))){
var inst_31458 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
var statearr_31517_33058 = state_31477__$1;
(statearr_31517_33058[(2)] = inst_31458);

(statearr_31517_33058[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (11))){
var inst_31441 = (state_31477[(7)]);
var inst_31427 = (state_31477[(12)]);
var inst_31441__$1 = cljs.core.seq(inst_31427);
var state_31477__$1 = (function (){var statearr_31518 = state_31477;
(statearr_31518[(7)] = inst_31441__$1);

return statearr_31518;
})();
if(inst_31441__$1){
var statearr_31519_33059 = state_31477__$1;
(statearr_31519_33059[(1)] = (14));

} else {
var statearr_31521_33060 = state_31477__$1;
(statearr_31521_33060[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (9))){
var inst_31465 = (state_31477[(2)]);
var inst_31466 = cljs.core.async.impl.protocols.closed_QMARK_(out);
var state_31477__$1 = (function (){var statearr_31523 = state_31477;
(statearr_31523[(15)] = inst_31465);

return statearr_31523;
})();
if(cljs.core.truth_(inst_31466)){
var statearr_31524_33061 = state_31477__$1;
(statearr_31524_33061[(1)] = (21));

} else {
var statearr_31525_33062 = state_31477__$1;
(statearr_31525_33062[(1)] = (22));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (5))){
var inst_31419 = cljs.core.async.close_BANG_(out);
var state_31477__$1 = state_31477;
var statearr_31535_33063 = state_31477__$1;
(statearr_31535_33063[(2)] = inst_31419);

(statearr_31535_33063[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (14))){
var inst_31441 = (state_31477[(7)]);
var inst_31443 = cljs.core.chunked_seq_QMARK_(inst_31441);
var state_31477__$1 = state_31477;
if(inst_31443){
var statearr_31537_33064 = state_31477__$1;
(statearr_31537_33064[(1)] = (17));

} else {
var statearr_31538_33065 = state_31477__$1;
(statearr_31538_33065[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (16))){
var inst_31461 = (state_31477[(2)]);
var state_31477__$1 = state_31477;
var statearr_31540_33066 = state_31477__$1;
(statearr_31540_33066[(2)] = inst_31461);

(statearr_31540_33066[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31478 === (10))){
var inst_31430 = (state_31477[(10)]);
var inst_31428 = (state_31477[(11)]);
var inst_31435 = cljs.core._nth(inst_31428,inst_31430);
var state_31477__$1 = state_31477;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31477__$1,(13),out,inst_31435);
} else {
if((state_val_31478 === (18))){
var inst_31441 = (state_31477[(7)]);
var inst_31451 = cljs.core.first(inst_31441);
var state_31477__$1 = state_31477;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31477__$1,(20),out,inst_31451);
} else {
if((state_val_31478 === (8))){
var inst_31429 = (state_31477[(8)]);
var inst_31430 = (state_31477[(10)]);
var inst_31432 = (inst_31430 < inst_31429);
var inst_31433 = inst_31432;
var state_31477__$1 = state_31477;
if(cljs.core.truth_(inst_31433)){
var statearr_31541_33067 = state_31477__$1;
(statearr_31541_33067[(1)] = (10));

} else {
var statearr_31542_33068 = state_31477__$1;
(statearr_31542_33068[(1)] = (11));

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
var statearr_31543 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31543[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__);

(statearr_31543[(1)] = (1));

return statearr_31543;
});
var cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1 = (function (state_31477){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31477);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31544){var ex__28381__auto__ = e31544;
var statearr_31545_33073 = state_31477;
(statearr_31545_33073[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31477[(4)]))){
var statearr_31546_33078 = state_31477;
(statearr_31546_33078[(1)] = cljs.core.first((state_31477[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33079 = state_31477;
state_31477 = G__33079;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__ = function(state_31477){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1.call(this,state_31477);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__28378__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31557 = f__29126__auto__();
(statearr_31557[(6)] = c__29125__auto__);

return statearr_31557;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));

return c__29125__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var G__31560 = arguments.length;
switch (G__31560) {
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
var G__31578 = arguments.length;
switch (G__31578) {
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
var G__31597 = arguments.length;
switch (G__31597) {
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
var c__29125__auto___33105 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31628){
var state_val_31629 = (state_31628[(1)]);
if((state_val_31629 === (7))){
var inst_31623 = (state_31628[(2)]);
var state_31628__$1 = state_31628;
var statearr_31630_33110 = state_31628__$1;
(statearr_31630_33110[(2)] = inst_31623);

(statearr_31630_33110[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (1))){
var inst_31600 = null;
var state_31628__$1 = (function (){var statearr_31631 = state_31628;
(statearr_31631[(7)] = inst_31600);

return statearr_31631;
})();
var statearr_31633_33111 = state_31628__$1;
(statearr_31633_33111[(2)] = null);

(statearr_31633_33111[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (4))){
var inst_31606 = (state_31628[(8)]);
var inst_31606__$1 = (state_31628[(2)]);
var inst_31607 = (inst_31606__$1 == null);
var inst_31608 = cljs.core.not(inst_31607);
var state_31628__$1 = (function (){var statearr_31634 = state_31628;
(statearr_31634[(8)] = inst_31606__$1);

return statearr_31634;
})();
if(inst_31608){
var statearr_31638_33113 = state_31628__$1;
(statearr_31638_33113[(1)] = (5));

} else {
var statearr_31639_33120 = state_31628__$1;
(statearr_31639_33120[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (6))){
var state_31628__$1 = state_31628;
var statearr_31641_33125 = state_31628__$1;
(statearr_31641_33125[(2)] = null);

(statearr_31641_33125[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (3))){
var inst_31625 = (state_31628[(2)]);
var inst_31626 = cljs.core.async.close_BANG_(out);
var state_31628__$1 = (function (){var statearr_31642 = state_31628;
(statearr_31642[(9)] = inst_31625);

return statearr_31642;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_31628__$1,inst_31626);
} else {
if((state_val_31629 === (2))){
var state_31628__$1 = state_31628;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31628__$1,(4),ch);
} else {
if((state_val_31629 === (11))){
var inst_31606 = (state_31628[(8)]);
var inst_31617 = (state_31628[(2)]);
var inst_31600 = inst_31606;
var state_31628__$1 = (function (){var statearr_31643 = state_31628;
(statearr_31643[(7)] = inst_31600);

(statearr_31643[(10)] = inst_31617);

return statearr_31643;
})();
var statearr_31650_33126 = state_31628__$1;
(statearr_31650_33126[(2)] = null);

(statearr_31650_33126[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (9))){
var inst_31606 = (state_31628[(8)]);
var state_31628__$1 = state_31628;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31628__$1,(11),out,inst_31606);
} else {
if((state_val_31629 === (5))){
var inst_31606 = (state_31628[(8)]);
var inst_31600 = (state_31628[(7)]);
var inst_31612 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31606,inst_31600);
var state_31628__$1 = state_31628;
if(inst_31612){
var statearr_31653_33134 = state_31628__$1;
(statearr_31653_33134[(1)] = (8));

} else {
var statearr_31654_33135 = state_31628__$1;
(statearr_31654_33135[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (10))){
var inst_31620 = (state_31628[(2)]);
var state_31628__$1 = state_31628;
var statearr_31655_33136 = state_31628__$1;
(statearr_31655_33136[(2)] = inst_31620);

(statearr_31655_33136[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31629 === (8))){
var inst_31600 = (state_31628[(7)]);
var tmp31651 = inst_31600;
var inst_31600__$1 = tmp31651;
var state_31628__$1 = (function (){var statearr_31663 = state_31628;
(statearr_31663[(7)] = inst_31600__$1);

return statearr_31663;
})();
var statearr_31664_33137 = state_31628__$1;
(statearr_31664_33137[(2)] = null);

(statearr_31664_33137[(1)] = (2));


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
var statearr_31665 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_31665[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31665[(1)] = (1));

return statearr_31665;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31628){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31628);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31667){var ex__28381__auto__ = e31667;
var statearr_31668_33138 = state_31628;
(statearr_31668_33138[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31628[(4)]))){
var statearr_31669_33139 = state_31628;
(statearr_31669_33139[(1)] = cljs.core.first((state_31628[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33140 = state_31628;
state_31628 = G__33140;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31628){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31628);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31670 = f__29126__auto__();
(statearr_31670[(6)] = c__29125__auto___33105);

return statearr_31670;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


return out;
}));

(cljs.core.async.unique.cljs$lang$maxFixedArity = 2);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var G__31677 = arguments.length;
switch (G__31677) {
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
var c__29125__auto___33146 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31718){
var state_val_31719 = (state_31718[(1)]);
if((state_val_31719 === (7))){
var inst_31714 = (state_31718[(2)]);
var state_31718__$1 = state_31718;
var statearr_31721_33152 = state_31718__$1;
(statearr_31721_33152[(2)] = inst_31714);

(statearr_31721_33152[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (1))){
var inst_31680 = (new Array(n));
var inst_31681 = inst_31680;
var inst_31682 = (0);
var state_31718__$1 = (function (){var statearr_31722 = state_31718;
(statearr_31722[(7)] = inst_31682);

(statearr_31722[(8)] = inst_31681);

return statearr_31722;
})();
var statearr_31723_33153 = state_31718__$1;
(statearr_31723_33153[(2)] = null);

(statearr_31723_33153[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (4))){
var inst_31685 = (state_31718[(9)]);
var inst_31685__$1 = (state_31718[(2)]);
var inst_31686 = (inst_31685__$1 == null);
var inst_31687 = cljs.core.not(inst_31686);
var state_31718__$1 = (function (){var statearr_31727 = state_31718;
(statearr_31727[(9)] = inst_31685__$1);

return statearr_31727;
})();
if(inst_31687){
var statearr_31728_33155 = state_31718__$1;
(statearr_31728_33155[(1)] = (5));

} else {
var statearr_31729_33157 = state_31718__$1;
(statearr_31729_33157[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (15))){
var inst_31708 = (state_31718[(2)]);
var state_31718__$1 = state_31718;
var statearr_31730_33158 = state_31718__$1;
(statearr_31730_33158[(2)] = inst_31708);

(statearr_31730_33158[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (13))){
var state_31718__$1 = state_31718;
var statearr_31734_33159 = state_31718__$1;
(statearr_31734_33159[(2)] = null);

(statearr_31734_33159[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (6))){
var inst_31682 = (state_31718[(7)]);
var inst_31704 = (inst_31682 > (0));
var state_31718__$1 = state_31718;
if(cljs.core.truth_(inst_31704)){
var statearr_31735_33161 = state_31718__$1;
(statearr_31735_33161[(1)] = (12));

} else {
var statearr_31736_33163 = state_31718__$1;
(statearr_31736_33163[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (3))){
var inst_31716 = (state_31718[(2)]);
var state_31718__$1 = state_31718;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31718__$1,inst_31716);
} else {
if((state_val_31719 === (12))){
var inst_31681 = (state_31718[(8)]);
var inst_31706 = cljs.core.vec(inst_31681);
var state_31718__$1 = state_31718;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31718__$1,(15),out,inst_31706);
} else {
if((state_val_31719 === (2))){
var state_31718__$1 = state_31718;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31718__$1,(4),ch);
} else {
if((state_val_31719 === (11))){
var inst_31698 = (state_31718[(2)]);
var inst_31699 = (new Array(n));
var inst_31681 = inst_31699;
var inst_31682 = (0);
var state_31718__$1 = (function (){var statearr_31744 = state_31718;
(statearr_31744[(7)] = inst_31682);

(statearr_31744[(8)] = inst_31681);

(statearr_31744[(10)] = inst_31698);

return statearr_31744;
})();
var statearr_31745_33171 = state_31718__$1;
(statearr_31745_33171[(2)] = null);

(statearr_31745_33171[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (9))){
var inst_31681 = (state_31718[(8)]);
var inst_31696 = cljs.core.vec(inst_31681);
var state_31718__$1 = state_31718;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31718__$1,(11),out,inst_31696);
} else {
if((state_val_31719 === (5))){
var inst_31690 = (state_31718[(11)]);
var inst_31682 = (state_31718[(7)]);
var inst_31681 = (state_31718[(8)]);
var inst_31685 = (state_31718[(9)]);
var inst_31689 = (inst_31681[inst_31682] = inst_31685);
var inst_31690__$1 = (inst_31682 + (1));
var inst_31691 = (inst_31690__$1 < n);
var state_31718__$1 = (function (){var statearr_31747 = state_31718;
(statearr_31747[(11)] = inst_31690__$1);

(statearr_31747[(12)] = inst_31689);

return statearr_31747;
})();
if(cljs.core.truth_(inst_31691)){
var statearr_31748_33177 = state_31718__$1;
(statearr_31748_33177[(1)] = (8));

} else {
var statearr_31749_33179 = state_31718__$1;
(statearr_31749_33179[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (14))){
var inst_31711 = (state_31718[(2)]);
var inst_31712 = cljs.core.async.close_BANG_(out);
var state_31718__$1 = (function (){var statearr_31757 = state_31718;
(statearr_31757[(13)] = inst_31711);

return statearr_31757;
})();
var statearr_31758_33185 = state_31718__$1;
(statearr_31758_33185[(2)] = inst_31712);

(statearr_31758_33185[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (10))){
var inst_31702 = (state_31718[(2)]);
var state_31718__$1 = state_31718;
var statearr_31765_33188 = state_31718__$1;
(statearr_31765_33188[(2)] = inst_31702);

(statearr_31765_33188[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31719 === (8))){
var inst_31690 = (state_31718[(11)]);
var inst_31681 = (state_31718[(8)]);
var tmp31750 = inst_31681;
var inst_31681__$1 = tmp31750;
var inst_31682 = inst_31690;
var state_31718__$1 = (function (){var statearr_31768 = state_31718;
(statearr_31768[(7)] = inst_31682);

(statearr_31768[(8)] = inst_31681__$1);

return statearr_31768;
})();
var statearr_31769_33193 = state_31718__$1;
(statearr_31769_33193[(2)] = null);

(statearr_31769_33193[(1)] = (2));


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
var statearr_31774 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31774[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31774[(1)] = (1));

return statearr_31774;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31718){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31718);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31780){var ex__28381__auto__ = e31780;
var statearr_31781_33194 = state_31718;
(statearr_31781_33194[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31718[(4)]))){
var statearr_31782_33197 = state_31718;
(statearr_31782_33197[(1)] = cljs.core.first((state_31718[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33201 = state_31718;
state_31718 = G__33201;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31718){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31718);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31789 = f__29126__auto__();
(statearr_31789[(6)] = c__29125__auto___33146);

return statearr_31789;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


return out;
}));

(cljs.core.async.partition.cljs$lang$maxFixedArity = 3);

/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var G__31797 = arguments.length;
switch (G__31797) {
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
var c__29125__auto___33206 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run((function (){
var f__29126__auto__ = (function (){var switch__28377__auto__ = (function (state_31856){
var state_val_31857 = (state_31856[(1)]);
if((state_val_31857 === (7))){
var inst_31852 = (state_31856[(2)]);
var state_31856__$1 = state_31856;
var statearr_31858_33209 = state_31856__$1;
(statearr_31858_33209[(2)] = inst_31852);

(statearr_31858_33209[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (1))){
var inst_31811 = [];
var inst_31812 = inst_31811;
var inst_31813 = new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123);
var state_31856__$1 = (function (){var statearr_31864 = state_31856;
(statearr_31864[(7)] = inst_31813);

(statearr_31864[(8)] = inst_31812);

return statearr_31864;
})();
var statearr_31865_33210 = state_31856__$1;
(statearr_31865_33210[(2)] = null);

(statearr_31865_33210[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (4))){
var inst_31816 = (state_31856[(9)]);
var inst_31816__$1 = (state_31856[(2)]);
var inst_31817 = (inst_31816__$1 == null);
var inst_31818 = cljs.core.not(inst_31817);
var state_31856__$1 = (function (){var statearr_31871 = state_31856;
(statearr_31871[(9)] = inst_31816__$1);

return statearr_31871;
})();
if(inst_31818){
var statearr_31872_33211 = state_31856__$1;
(statearr_31872_33211[(1)] = (5));

} else {
var statearr_31873_33212 = state_31856__$1;
(statearr_31873_33212[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (15))){
var inst_31812 = (state_31856[(8)]);
var inst_31844 = cljs.core.vec(inst_31812);
var state_31856__$1 = state_31856;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31856__$1,(18),out,inst_31844);
} else {
if((state_val_31857 === (13))){
var inst_31839 = (state_31856[(2)]);
var state_31856__$1 = state_31856;
var statearr_31874_33213 = state_31856__$1;
(statearr_31874_33213[(2)] = inst_31839);

(statearr_31874_33213[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (6))){
var inst_31812 = (state_31856[(8)]);
var inst_31841 = inst_31812.length;
var inst_31842 = (inst_31841 > (0));
var state_31856__$1 = state_31856;
if(cljs.core.truth_(inst_31842)){
var statearr_31875_33214 = state_31856__$1;
(statearr_31875_33214[(1)] = (15));

} else {
var statearr_31876_33215 = state_31856__$1;
(statearr_31876_33215[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (17))){
var inst_31849 = (state_31856[(2)]);
var inst_31850 = cljs.core.async.close_BANG_(out);
var state_31856__$1 = (function (){var statearr_31878 = state_31856;
(statearr_31878[(10)] = inst_31849);

return statearr_31878;
})();
var statearr_31879_33216 = state_31856__$1;
(statearr_31879_33216[(2)] = inst_31850);

(statearr_31879_33216[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (3))){
var inst_31854 = (state_31856[(2)]);
var state_31856__$1 = state_31856;
return cljs.core.async.impl.ioc_helpers.return_chan(state_31856__$1,inst_31854);
} else {
if((state_val_31857 === (12))){
var inst_31812 = (state_31856[(8)]);
var inst_31832 = cljs.core.vec(inst_31812);
var state_31856__$1 = state_31856;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_31856__$1,(14),out,inst_31832);
} else {
if((state_val_31857 === (2))){
var state_31856__$1 = state_31856;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_31856__$1,(4),ch);
} else {
if((state_val_31857 === (11))){
var inst_31820 = (state_31856[(11)]);
var inst_31812 = (state_31856[(8)]);
var inst_31816 = (state_31856[(9)]);
var inst_31829 = inst_31812.push(inst_31816);
var tmp31881 = inst_31812;
var inst_31812__$1 = tmp31881;
var inst_31813 = inst_31820;
var state_31856__$1 = (function (){var statearr_31887 = state_31856;
(statearr_31887[(7)] = inst_31813);

(statearr_31887[(12)] = inst_31829);

(statearr_31887[(8)] = inst_31812__$1);

return statearr_31887;
})();
var statearr_31888_33217 = state_31856__$1;
(statearr_31888_33217[(2)] = null);

(statearr_31888_33217[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (9))){
var inst_31813 = (state_31856[(7)]);
var inst_31825 = cljs.core.keyword_identical_QMARK_(inst_31813,new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123));
var state_31856__$1 = state_31856;
var statearr_31889_33218 = state_31856__$1;
(statearr_31889_33218[(2)] = inst_31825);

(statearr_31889_33218[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (5))){
var inst_31813 = (state_31856[(7)]);
var inst_31822 = (state_31856[(13)]);
var inst_31820 = (state_31856[(11)]);
var inst_31816 = (state_31856[(9)]);
var inst_31820__$1 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_31816) : f.call(null, inst_31816));
var inst_31822__$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_31820__$1,inst_31813);
var state_31856__$1 = (function (){var statearr_31890 = state_31856;
(statearr_31890[(13)] = inst_31822__$1);

(statearr_31890[(11)] = inst_31820__$1);

return statearr_31890;
})();
if(inst_31822__$1){
var statearr_31894_33223 = state_31856__$1;
(statearr_31894_33223[(1)] = (8));

} else {
var statearr_31895_33224 = state_31856__$1;
(statearr_31895_33224[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (14))){
var inst_31820 = (state_31856[(11)]);
var inst_31816 = (state_31856[(9)]);
var inst_31834 = (state_31856[(2)]);
var inst_31835 = [];
var inst_31836 = inst_31835.push(inst_31816);
var inst_31812 = inst_31835;
var inst_31813 = inst_31820;
var state_31856__$1 = (function (){var statearr_31896 = state_31856;
(statearr_31896[(7)] = inst_31813);

(statearr_31896[(14)] = inst_31834);

(statearr_31896[(8)] = inst_31812);

(statearr_31896[(15)] = inst_31836);

return statearr_31896;
})();
var statearr_31897_33227 = state_31856__$1;
(statearr_31897_33227[(2)] = null);

(statearr_31897_33227[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (16))){
var state_31856__$1 = state_31856;
var statearr_31899_33228 = state_31856__$1;
(statearr_31899_33228[(2)] = null);

(statearr_31899_33228[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (10))){
var inst_31827 = (state_31856[(2)]);
var state_31856__$1 = state_31856;
if(cljs.core.truth_(inst_31827)){
var statearr_31903_33229 = state_31856__$1;
(statearr_31903_33229[(1)] = (11));

} else {
var statearr_31907_33230 = state_31856__$1;
(statearr_31907_33230[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (18))){
var inst_31846 = (state_31856[(2)]);
var state_31856__$1 = state_31856;
var statearr_31908_33231 = state_31856__$1;
(statearr_31908_33231[(2)] = inst_31846);

(statearr_31908_33231[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_31857 === (8))){
var inst_31822 = (state_31856[(13)]);
var state_31856__$1 = state_31856;
var statearr_31909_33233 = state_31856__$1;
(statearr_31909_33233[(2)] = inst_31822);

(statearr_31909_33233[(1)] = (10));


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
var statearr_31910 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_31910[(0)] = cljs$core$async$state_machine__28378__auto__);

(statearr_31910[(1)] = (1));

return statearr_31910;
});
var cljs$core$async$state_machine__28378__auto____1 = (function (state_31856){
while(true){
var ret_value__28379__auto__ = (function (){try{while(true){
var result__28380__auto__ = switch__28377__auto__(state_31856);
if(cljs.core.keyword_identical_QMARK_(result__28380__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__28380__auto__;
}
break;
}
}catch (e31915){var ex__28381__auto__ = e31915;
var statearr_31919_33238 = state_31856;
(statearr_31919_33238[(2)] = ex__28381__auto__);


if(cljs.core.seq((state_31856[(4)]))){
var statearr_31920_33239 = state_31856;
(statearr_31920_33239[(1)] = cljs.core.first((state_31856[(4)])));

} else {
throw ex__28381__auto__;
}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__28379__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__33240 = state_31856;
state_31856 = G__33240;
continue;
} else {
return ret_value__28379__auto__;
}
break;
}
});
cljs$core$async$state_machine__28378__auto__ = function(state_31856){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__28378__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__28378__auto____1.call(this,state_31856);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__28378__auto____0;
cljs$core$async$state_machine__28378__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__28378__auto____1;
return cljs$core$async$state_machine__28378__auto__;
})()
})();
var state__29127__auto__ = (function (){var statearr_31924 = f__29126__auto__();
(statearr_31924[(6)] = c__29125__auto___33206);

return statearr_31924;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__29127__auto__);
}));


return out;
}));

(cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=cljs.core.async.js.map
