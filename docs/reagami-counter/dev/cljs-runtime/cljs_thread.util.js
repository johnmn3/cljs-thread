goog.provide('cljs_thread.util');
(cljs.reader._STAR_default_data_reader_fn_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.tagged_literal));
cljs_thread.util.encode_qp = (function cljs_thread$util$encode_qp(m){
var qp_s = ["?",cljs.core.str.cljs$core$IFn$_invoke$arity$1(goog.string.urlEncode(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([m], 0))))].join('');
return qp_s;
});
cljs_thread.util.decode_qp = (function cljs_thread$util$decode_qp(s){
var G__22691 = s;
var G__22691__$1 = (((G__22691 == null))?null:cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22691));
var G__22691__$2 = (((G__22691__$1 == null))?null:(function (p1__22687_SHARP_){
if(cljs.core.truth_(p1__22687_SHARP_.startsWith("?"))){
return cljs.core.rest(p1__22687_SHARP_);
} else {
return cljs.core.seq(p1__22687_SHARP_);
}
})(G__22691__$1));
var G__22691__$3 = (((G__22691__$2 == null))?null:cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,G__22691__$2));
var G__22691__$4 = (((G__22691__$3 == null))?null:goog.string.urlDecode(G__22691__$3));
if((G__22691__$4 == null)){
return null;
} else {
return clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(G__22691__$4);
}
});
cljs_thread.util.gen_id = (function cljs_thread$util$gen_id(var_args){
var args__5775__auto__ = [];
var len__5769__auto___22729 = arguments.length;
var i__5770__auto___22730 = (0);
while(true){
if((i__5770__auto___22730 < len__5769__auto___22729)){
args__5775__auto__.push((arguments[i__5770__auto___22730]));

var G__22731 = (i__5770__auto___22730 + (1));
i__5770__auto___22730 = G__22731;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return cljs_thread.util.gen_id.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(cljs_thread.util.gen_id.cljs$core$IFn$_invoke$arity$variadic = (function (p__22716){
var vec__22717 = p__22716;
var data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22717,(0),null);
var or__5045__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid());
}
}));

(cljs_thread.util.gen_id.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(cljs_thread.util.gen_id.cljs$lang$applyTo = (function (seq22712){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq22712));
}));

cljs_thread.util.num_cores = (function cljs_thread$util$num_cores(){
if((((typeof self !== 'undefined')) && ((typeof self !== 'undefined') && (typeof self.navigator !== 'undefined')))){
return self.navigator.hardwareConcurrency;
} else {
if((((typeof process !== 'undefined')) && ((typeof process !== 'undefined') && (typeof process.versions !== 'undefined')))){
var os = require('os');
return (function (){var fexpr__22722 = (os["cpus"]);
return (fexpr__22722.cljs$core$IFn$_invoke$arity$0 ? fexpr__22722.cljs$core$IFn$_invoke$arity$0() : fexpr__22722.call(null, ));
})().length;
} else {
return (4);

}
}
});
cljs_thread.util.in_browser_QMARK_ = (function cljs_thread$util$in_browser_QMARK_(browser_string){
if((((typeof navigator !== 'undefined')) && ((!((navigator == null)))))){
var ua = navigator.userAgent;
if(cljs.core.truth_(ua)){
return (ua.indexOf(browser_string) > (-1));
} else {
return null;
}
} else {
return false;
}
});
cljs_thread.util.in_chrome_QMARK_ = (function cljs_thread$util$in_chrome_QMARK_(){
return cljs_thread.util.in_browser_QMARK_("Chrome");
});
cljs_thread.util.in_ie_QMARK_ = (function cljs_thread$util$in_ie_QMARK_(){
var or__5045__auto__ = cljs_thread.util.in_browser_QMARK_("MSIE");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.util.in_browser_QMARK_("rv:");
}
});
cljs_thread.util.in_firefox_QMARK_ = (function cljs_thread$util$in_firefox_QMARK_(){
return cljs_thread.util.in_browser_QMARK_("Firefox");
});
cljs_thread.util.in_safari_QMARK_ = (function cljs_thread$util$in_safari_QMARK_(){
var and__5043__auto__ = cljs_thread.util.in_browser_QMARK_("Safari");
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs_thread.util.in_chrome_QMARK_());
} else {
return and__5043__auto__;
}
});
cljs_thread.util.in_opera_QMARK_ = (function cljs_thread$util$in_opera_QMARK_(){
var and__5043__auto__ = cljs_thread.util.in_browser_QMARK_("OP");
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs_thread.util.in_chrome_QMARK_());
} else {
return and__5043__auto__;
}
});
cljs_thread.util.browser_type = (function cljs_thread$util$browser_type(){
if(cljs.core.truth_(cljs_thread.util.in_chrome_QMARK_())){
return new cljs.core.Keyword(null,"chrome","chrome",1718738387);
} else {
if(cljs.core.truth_(cljs_thread.util.in_ie_QMARK_())){
return new cljs.core.Keyword(null,"ie","ie",2038473780);
} else {
if(cljs.core.truth_(cljs_thread.util.in_firefox_QMARK_())){
return new cljs.core.Keyword(null,"firefox","firefox",1283768880);
} else {
if(cljs.core.truth_(cljs_thread.util.in_safari_QMARK_())){
return new cljs.core.Keyword(null,"safari","safari",497115653);
} else {
if(cljs.core.truth_(cljs_thread.util.in_opera_QMARK_())){
return new cljs.core.Keyword(null,"opera","opera",658572996);
} else {
return null;
}
}
}
}
}
});
/**
 * Tests whether a given `value` is a typed array.
 */
cljs_thread.util.typed_array_QMARK_ = (function cljs_thread$util$typed_array_QMARK_(value){
var value_type = cljs.core.type(value);
var or__5045__auto__ = (((typeof SharedArrayBuffer !== 'undefined'))?cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,SharedArrayBuffer):null);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Int8Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Uint8Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Uint8ClampedArray)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Int16Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Uint16Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Int32Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Uint32Array)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Float32Array)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(value_type,Float64Array)))))))))))))))));
}
});
/**
 * Log boot sequence events to stderr. Thread identifies the worker context.
 */
cljs_thread.util.boot_log = (function cljs_thread$util$boot_log(thread,msg){
if((((typeof process !== 'undefined')) && ((typeof process !== 'undefined') && (typeof process.versions !== 'undefined')))){
var ts = (Date.now() - (function (){var or__5045__auto__ = globalThis.__boot_start_time;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})());
var fs = require("fs");
if(cljs.core.truth_(globalThis.__boot_start_time)){
} else {
(globalThis.__boot_start_time = Date.now());
}

return fs.writeSync((2),["[BOOT +",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ts),"ms ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(thread),"] ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg),"\n"].join(''));
} else {
return null;
}
});

//# sourceMappingURL=cljs_thread.util.js.map
