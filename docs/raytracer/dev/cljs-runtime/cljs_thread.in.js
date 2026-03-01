goog.provide('cljs_thread.in$');
cljs_thread.in$.instr_body = cljs_thread.serial.instr_body;
cljs_thread.in$.unstr_body = cljs_thread.serial.unstr_body;
cljs_thread.in$.debug_log_BANG_ = (function cljs_thread$in$debug_log_BANG_(msg){
return null;
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.in$ !== 'undefined') && (typeof cljs_thread.in$.modules_loaded_QMARK_ !== 'undefined')){
} else {
cljs_thread.in$.modules_loaded_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
/**
 * Resolve module URL for browser workers. In blob/eval workers,
 * self.origin is 'null', so we use __cljs_thread_origin set by strategies.
 */
cljs_thread.in$.resolve_module_url = (function cljs_thread$in$resolve_module_url(url){
if(cljs.core.truth_((function (){var or__5045__auto__ = url.startsWith("http://");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return url.startsWith("https://");
}
})())){
return url;
} else {
if((((typeof globalThis !== 'undefined') && (typeof globalThis.__cljs_thread_origin !== 'undefined')) && ((!((globalThis.__cljs_thread_origin == null)))))){
var origin = globalThis.__cljs_thread_origin;
if(cljs.core.truth_(url.startsWith("/"))){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(origin),cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)].join('');
} else {
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(origin),"/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)].join('');
}
} else {
return url;
}
}
});
/**
 * Load a JS module by evaluating it in global scope. The module's IIFE
 * runs normally, setting up namespace exports on $APP. Only ^:export
 * functions become accessible; non-exported vars remain closure-scoped.
 */
cljs_thread.in$.load_module_BANG_ = (function cljs_thread$in$load_module_BANG_(url){
var source = ((cljs_thread.platform.node_QMARK_)?(function (){var fs = require('fs');
return fs.readFileSync(url,"utf8");
})():(function (){var resolved = cljs_thread.in$.resolve_module_url(url);
var xhr = (new XMLHttpRequest());
xhr.open("GET",resolved,false);

xhr.send();

return xhr.responseText;
})());
return (0,eval)(source);
});
/**
 * Load all configured :loadable-modules normally (eval as-is).
 * Module init code runs, exports become available. Only runs once
 * per worker lifetime.
 */
cljs_thread.in$.ensure_modules_loaded_BANG_ = (function cljs_thread$in$ensure_modules_loaded_BANG_(){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.in$.modules_loaded_QMARK_))){
return null;
} else {
var temp__5823__auto___21105 = new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf));
if(cljs.core.truth_(temp__5823__auto___21105)){
var modules_21106 = temp__5823__auto___21105;
var seq__21075_21107 = cljs.core.seq(modules_21106);
var chunk__21076_21108 = null;
var count__21077_21109 = (0);
var i__21078_21110 = (0);
while(true){
if((i__21078_21110 < count__21077_21109)){
var url_21111 = chunk__21076_21108.cljs$core$IIndexed$_nth$arity$2(null, i__21078_21110);
try{cljs_thread.in$.load_module_BANG_(url_21111);
}catch (e21081){var e_21112 = e21081;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"warn","warn",-436710552),new cljs.core.Keyword(null,"failed-to-load-module","failed-to-load-module",-1009352923),url_21111,e_21112], 0));
}

var G__21113 = seq__21075_21107;
var G__21114 = chunk__21076_21108;
var G__21115 = count__21077_21109;
var G__21116 = (i__21078_21110 + (1));
seq__21075_21107 = G__21113;
chunk__21076_21108 = G__21114;
count__21077_21109 = G__21115;
i__21078_21110 = G__21116;
continue;
} else {
var temp__5823__auto___21117__$1 = cljs.core.seq(seq__21075_21107);
if(temp__5823__auto___21117__$1){
var seq__21075_21118__$1 = temp__5823__auto___21117__$1;
if(cljs.core.chunked_seq_QMARK_(seq__21075_21118__$1)){
var c__5568__auto___21119 = cljs.core.chunk_first(seq__21075_21118__$1);
var G__21120 = cljs.core.chunk_rest(seq__21075_21118__$1);
var G__21121 = c__5568__auto___21119;
var G__21122 = cljs.core.count(c__5568__auto___21119);
var G__21123 = (0);
seq__21075_21107 = G__21120;
chunk__21076_21108 = G__21121;
count__21077_21109 = G__21122;
i__21078_21110 = G__21123;
continue;
} else {
var url_21124 = cljs.core.first(seq__21075_21118__$1);
try{cljs_thread.in$.load_module_BANG_(url_21124);
}catch (e21082){var e_21125 = e21082;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"warn","warn",-436710552),new cljs.core.Keyword(null,"failed-to-load-module","failed-to-load-module",-1009352923),url_21124,e_21125], 0));
}

var G__21126 = cljs.core.next(seq__21075_21118__$1);
var G__21127 = null;
var G__21128 = (0);
var G__21129 = (0);
seq__21075_21107 = G__21126;
chunk__21076_21108 = G__21127;
count__21077_21109 = G__21128;
i__21078_21110 = G__21129;
continue;
}
} else {
}
}
break;
}
} else {
}

return cljs.core.reset_BANG_(cljs_thread.in$.modules_loaded_QMARK_,true);
}
});
/**
 * Matches CLJS compiler loop-capture IIFEs:
 *   ((function (P1,P2,...){ return EXPR; })(P1,P2,...))
 * The backreference \1 ensures the invocation args are identical to the
 * parameter list — the distinguishing signature of a loop-capture IIFE.
 * Replacement is just EXPR (the inner function), stripping the wrapper
 * that would otherwise reference loop variables not present on the
 * target worker.
 */
cljs_thread.in$.loop_iife_re = (new RegExp("\\(\\(function\\s*\\(([^)]+)\\)\\s*\\{\\s*return\\s+([\\s\\S]*?);\\s*\\}\\)\\(\\1\\)\\)","g"));
/**
 * Strip CLJS compiler loop-capture IIFEs from a stringified function.
 * Only needed for go-transformed bodies whose CPS continuation fns may
 * have been wrapped by the compiler inside dotimes / loop constructs.
 */
cljs_thread.in$.strip_loop_iifes = (function cljs_thread$in$strip_loop_iifes(s){
return s.replace(cljs_thread.in$.loop_iife_re,"$2");
});
/**
 * Matches a CLJS shadow-renamed parameter name like per__$1.
 * Captures the base name (everything before the final __$N suffix).
 */
cljs_thread.in$.shadow_param_re = (new RegExp("^(.+)__\\$(\\d+)$"));
/**
 * Fix CLJS shadow-rename mismatch in serialized functions.
 * 
 * When the future/in/spawn macros generate (fn [x y z] ...) where x, y, z
 * are already locals in the enclosing scope, CLJS renames the parameters
 * to x__$1, y__$1, z__$1 to avoid shadowing. But IIFEs generated by the
 * CLJS compiler for closures inside loops reference the ORIGINAL names,
 * causing ReferenceError on the worker where only the __$1 versions exist.
 * 
 * This function injects `var x=x__$1,y=y__$1,...;` after the outer
 * function's opening brace, making both names available in scope.
 */
cljs_thread.in$.inject_shadow_aliases = (function cljs_thread$in$inject_shadow_aliases(sfn){
var m = (new RegExp("^function\\s*\\(([^)]*?)\\)\\s*\\{")).exec(sfn);
if((((m == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("",(m[(1)]))))){
return sfn;
} else {
var params = (m[(1)]).split(",");
var aliases = [];
var n__5636__auto___21130 = params.length;
var i_21131 = (0);
while(true){
if((i_21131 < n__5636__auto___21130)){
var p_21132 = (params[i_21131]).trim();
var sm_21133 = cljs_thread.in$.shadow_param_re.exec(p_21132);
if(cljs.core.truth_(sm_21133)){
aliases.push([cljs.core.str.cljs$core$IFn$_invoke$arity$1((sm_21133[(1)])),"=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p_21132)].join(''));
} else {
}

var G__21134 = (i_21131 + (1));
i_21131 = G__21134;
continue;
} else {
}
break;
}

if((aliases.length === (0))){
return sfn;
} else {
var decl = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(aliases.join(",")),";"].join('');
var idx = (sfn.indexOf("{") + (1));
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn.substring((0),idx)),decl,cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn.substring(idx))].join('');
}
}
});
/**
 * Execute a stringified function call with optional arguments.
 */
cljs_thread.in$.execute_call = (function cljs_thread$in$execute_call(sfn,sargs,opts,in_id,transfers,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx){
if((((sfn == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(sfn,"nil")))){
return null;
} else {
var sfn__$1 = cljs_thread.in$.inject_shadow_aliases(sfn);
var sfn__$2 = (cljs.core.truth_(new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(opts))?cljs_thread.in$.strip_loop_iifes(sfn__$1):sfn__$1);
if(cljs.core.not(sargs)){
if(cljs.core.truth_((function (){var and__5043__auto__ = in_id;
if(cljs.core.truth_(and__5043__auto__)){
return new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(opts);
} else {
return and__5043__auto__;
}
})())){
var fexpr__21083 = eval(["(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn__$2),")();"].join(''));
return (fexpr__21083.cljs$core$IFn$_invoke$arity$5 ? fexpr__21083.cljs$core$IFn$_invoke$arity$5(in_id,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx) : fexpr__21083.call(null, in_id,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx));
} else {
return eval(["(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn__$2),")();"].join(''));
}
} else {
var parsed_sargs = ((typeof sargs === 'string')?clojure.edn.read_string.cljs$core$IFn$_invoke$arity$1(sargs):sargs);
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2((cljs.core.truth_((function (){var and__5043__auto__ = in_id;
if(cljs.core.truth_(and__5043__auto__)){
return new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(opts);
} else {
return and__5043__auto__;
}
})())?(function (){var fexpr__21084 = eval(["(function () {return (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn__$2),");})();"].join(''));
return (fexpr__21084.cljs$core$IFn$_invoke$arity$5 ? fexpr__21084.cljs$core$IFn$_invoke$arity$5(in_id,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx) : fexpr__21084.call(null, in_id,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx));
})():eval(["(function () {return (",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sfn__$2),");})();"].join(''))),((cljs.core.vector_QMARK_(parsed_sargs))?cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.in$.unstr_body,transfers),parsed_sargs):eval(["(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sargs),")();"].join(''))));
}
}
});
/**
 * Reconstruct sync-channel from message components.
 */
cljs_thread.in$.reconstruct_sync_channel = (function cljs_thread$in$reconstruct_sync_channel(p__21085){
var map__21086 = p__21085;
var map__21086__$1 = cljs.core.__destructure_map(map__21086);
var sync_signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21086__$1,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526));
var sync_atom_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21086__$1,new cljs.core.Keyword(null,"sync-atom-id","sync-atom-id",-1919513778));
var sync_atom_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21086__$1,new cljs.core.Keyword(null,"sync-atom-idx","sync-atom-idx",526705995));
var in_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21086__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614));
if(cljs.core.truth_(sync_signal_sab)){
cljs_thread.in$.debug_log_BANG_(["[reconstruct-sync-channel] in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)," atom-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sync_atom_id)," hdr-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sync_atom_idx)].join(''));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271),sync_signal_sab,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196),cljs_thread.eve.reconstruct_shared_atom(sync_atom_id,sync_atom_idx)], null);
} else {
return null;
}
});
/**
 * Send result via direct sync, Node.js screen message, or legacy coordinator path.
 */
cljs_thread.in$.send_result_BANG_ = (function cljs_thread$in$send_result_BANG_(p__21087,result,opts,error_sent_QMARK_){
var map__21088 = p__21087;
var map__21088__$1 = cljs.core.__destructure_map(map__21088);
var data = map__21088__$1;
var direct_sync_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21088__$1,new cljs.core.Keyword(null,"direct-sync?","direct-sync?",-1145947346));
var sync_signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21088__$1,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526));
var in_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21088__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614));
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21088__$1,new cljs.core.Keyword(null,"from","from",1815293044));
cljs_thread.in$.debug_log_BANG_(["[send-result!] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," direct-sync?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(direct_sync_QMARK_)," sync-signal-sab?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.boolean$(sync_signal_sab))," in-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)," from:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(from)].join(''));

if(cljs_thread.env.in_sw_QMARK_()){
return null;
} else {
var sab_check = (sync_signal_sab instanceof SharedArrayBuffer);
var size_check = ((sab_check) && ((sync_signal_sab.byteLength > (0))));
cljs_thread.in$.debug_log_BANG_(["[send-result!] sab-check:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(sab_check)," size-check:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(size_check)," sab-type:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type(sync_signal_sab))].join(''));

if(cljs.core.truth_((function (){var and__5043__auto__ = direct_sync_QMARK_;
if(cljs.core.truth_(and__5043__auto__)){
return ((sab_check) && (size_check));
} else {
return and__5043__auto__;
}
})())){
var sync_ch = cljs_thread.in$.reconstruct_sync_channel(data);
var ra = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch);
cljs_thread.in$.debug_log_BANG_(["[send-result!] delivering via direct sync: result=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(result)," atom-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ra.shared_atom_id)," hdr-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ra.header_descriptor_idx)," in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

return cljs_thread.sync.deliver_response(sync_ch,in_id,result);
} else {
if(((cljs_thread.platform.node_QMARK_) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(from,new cljs.core.Keyword(null,"screen","screen",1990059748))))){
cljs_thread.in$.debug_log_BANG_(["[send-result!] posting to screen, in-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

cljs.core.reset_BANG_(error_sent_QMARK_,true);

return cljs_thread.msg.post(new cljs.core.Keyword(null,"screen","screen",1990059748),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"in-result","in-result",13280282),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"in-id","in-id",2013544614),in_id,new cljs.core.Keyword(null,"result","result",1415092211),result,new cljs.core.Keyword(null,"to","to",192099007),new cljs.core.Keyword(null,"screen","screen",1990059748)], null)], null));
} else {
var req_id = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"request-id","request-id",-985684093).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return in_id;
}
})();
cljs_thread.in$.debug_log_BANG_(["[send-result!] using legacy path, req-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(req_id)].join(''));

if(cljs.core.truth_(req_id)){
cljs.core.reset_BANG_(error_sent_QMARK_,true);

return cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),req_id,new cljs.core.Keyword(null,"response","response",-1068424192),result], null));
} else {
return null;
}

}
}
}
});
cljs_thread.in$.do_call = (function cljs_thread$in$do_call(p__21089){
var map__21090 = p__21089;
var map__21090__$1 = cljs.core.__destructure_map(map__21090);
var outer_data = map__21090__$1;
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21090__$1,new cljs.core.Keyword(null,"data","data",-232669377));
cljs_thread.in$.debug_log_BANG_(["[do-call] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," direct-sync?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"direct-sync?","direct-sync?",-1145947346).cljs$core$IFn$_invoke$arity$1(data))," sync-signal-sab?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.boolean$(new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526).cljs$core$IFn$_invoke$arity$1(data)))," in-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"in-id","in-id",2013544614).cljs$core$IFn$_invoke$arity$1(data))].join(''));

var map__21091 = data;
var map__21091__$1 = cljs.core.__destructure_map(map__21091);
var sfn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"sfn","sfn",-736336514));
var sargs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"sargs","sargs",1421118304));
var sync_signal_sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526));
var in_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614));
var local_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"local?","local?",-1422786101));
var sync_atom_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"sync-atom-idx","sync-atom-idx",526705995));
var direct_sync_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"direct-sync?","direct-sync?",-1145947346));
var sync_atom_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"sync-atom-id","sync-atom-id",-1919513778));
var opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"opts","opts",155075701));
var transfers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21091__$1,new cljs.core.Keyword(null,"transfers","transfers",2123810614));
var error_sent_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var res = (function (){try{return cljs_thread.in$.execute_call(sfn,sargs,opts,in_id,transfers,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx);
}catch (e21092){var e = e21092;
if((((e instanceof ReferenceError)) && (((cljs.core.not(cljs.core.deref(cljs_thread.in$.modules_loaded_QMARK_))) && (cljs.core.seq(new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf)))))))){
cljs_thread.in$.ensure_modules_loaded_BANG_();

try{return cljs_thread.in$.execute_call(sfn,sargs,opts,in_id,transfers,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx);
}catch (e21093){var e2 = e21093;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error-in","error-in",1479787178),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error-after-module-load","error-after-module-load",2130842416),e2], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data","data",-232669377),data], 0));

return cljs_thread.in$.send_result_BANG_(data,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([e2], 0))], null),opts,error_sent_QMARK_);
}} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error-in","error-in",1479787178),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error-in-do-call","error-in-do-call",88802918),e], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),e.error], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data","data",-232669377),data], 0));

return cljs_thread.in$.send_result_BANG_(data,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([e], 0))], null),opts,error_sent_QMARK_);
}
}})();
if(cljs.core.truth_(new cljs.core.Keyword(null,"atom?","atom?",1646900477).cljs$core$IFn$_invoke$arity$1(opts))){
cljs.core.reset_BANG_(cljs_thread.state.local_val,res);
} else {
}

if(cljs.core.truth_(local_QMARK_)){
return res;
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(and__5043__auto__)){
return (res instanceof Promise);
} else {
return and__5043__auto__;
}
})())){
return res.then((function (value){
return cljs_thread.in$.send_result_BANG_(data,value,opts,error_sent_QMARK_);
})).catch((function (err){
return cljs_thread.in$.send_result_BANG_(data,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([err], 0))], null),opts,error_sent_QMARK_);
}));
} else {
if(((cljs.core.not(cljs.core.deref(error_sent_QMARK_))) && (((cljs.core.not(new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(opts))) && (((cljs.core.not(new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(opts))) && ((!(cljs_thread.env.in_sw_QMARK_()))))))))){
return cljs_thread.in$.send_result_BANG_(data,res,opts,error_sent_QMARK_);
} else {
return null;
}
}
}
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"call","call",-519999866),(function (data){
return cljs_thread.in$.do_call(data);
}));
/**
 * Send yield result via direct sync or legacy coordinator path.
 * Called from yield-mode functions generated by the `in` macro.
 */
cljs_thread.in$.yield_result_BANG_ = (function cljs_thread$in$yield_result_BANG_(in_id,direct_sync_QMARK_,sync_signal_sab,sync_atom_id,sync_atom_idx,result){
cljs_thread.in$.debug_log_BANG_(["[yield-result!] in-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)," direct-sync?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(direct_sync_QMARK_)].join(''));

if(cljs.core.truth_((function (){var and__5043__auto__ = direct_sync_QMARK_;
if(cljs.core.truth_(and__5043__auto__)){
return (sync_signal_sab instanceof SharedArrayBuffer);
} else {
return and__5043__auto__;
}
})())){
var sync_ch = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271),sync_signal_sab,new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196),cljs_thread.eve.reconstruct_shared_atom(sync_atom_id,sync_atom_idx)], null);
cljs_thread.in$.debug_log_BANG_("[yield-result!] delivering via direct sync");

return cljs_thread.sync.deliver_response(sync_ch,in_id,result);
} else {
cljs_thread.in$.debug_log_BANG_(["[yield-result!] using legacy path, in-id:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

if(cljs.core.truth_(in_id)){
return cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),in_id,new cljs.core.Keyword(null,"response","response",-1068424192),result], null));
} else {
return null;
}
}
});
cljs_thread.in$.do_in = (function cljs_thread$in$do_in(var_args){
var args__5775__auto__ = [];
var len__5769__auto___21168 = arguments.length;
var i__5770__auto___21169 = (0);
while(true){
if((i__5770__auto___21169 < len__5769__auto___21168)){
args__5775__auto__.push((arguments[i__5770__auto___21169]));

var G__21170 = (i__5770__auto___21169 + (1));
i__5770__auto___21169 = G__21170;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});
goog.exportSymbol('cljs_thread.in$.do_in', cljs_thread.in$.do_in);

(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic = (function (id,p__21096){
var vec__21097 = p__21096;
var args = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21097,(0),null);
var afn = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21097,(1),null);
var opts = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21097,(2),null);
cljs_thread.in$.debug_log_BANG_(["[do-in] env:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))," target:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([id], 0))," opts:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([opts], 0))].join(''));

var vec__21100 = (cljs.core.truth_(afn)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [afn,args], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [args,null], null));
var afn__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21100,(0),null);
var args__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21100,(1),null);
var in_id = cljs_thread.util.gen_id();
var transfer_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"count","count",2139924085),(0),new cljs.core.Keyword(null,"transfers","transfers",2123810614),cljs.core.PersistentArrayMap.EMPTY], null));
var sargs_instrumented = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.in$.instr_body,transfer_atom),args__$1);
var sargs = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([sargs_instrumented], 0));
var raw_id = (((((!((id == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === id.cljs_thread$id$IDable$))))?true:(((!id.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,id):false)):cljs.core.native_satisfies_QMARK_(cljs_thread.id.IDable,id)))?cljs_thread.id.get_id(id):id);
var id__$1 = (((raw_id instanceof cljs.core.Keyword))?raw_id:cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([raw_id], 0)));
var peer_sync_ch = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [raw_id,new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328)], null));
var peer_response_atom = (cljs.core.truth_(peer_sync_ch)?new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(peer_sync_ch):null);
var use_direct_sync_QMARK_ = (function (){var and__5043__auto__ = (function (){var or__5045__auto__ = cljs_thread.platform.node_QMARK_;
if(or__5045__auto__){
return or__5045__auto__;
} else {
return cljs_thread.platform.sab_sync_QMARK_;
}
})();
if(cljs.core.truth_(and__5043__auto__)){
return ((cljs.core.not(new cljs.core.Keyword(null,"promise?","promise?",-1924347409).cljs$core$IFn$_invoke$arity$1(opts))) && (cljs.core.not(cljs_thread.env.in_screen_QMARK_())));
} else {
return and__5043__auto__;
}
})();
var _ = cljs_thread.in$.debug_log_BANG_(["[do-in] use-direct-sync?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(use_direct_sync_QMARK_)," node?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.platform.node_QMARK_)," promise?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"promise?","promise?",-1924347409).cljs$core$IFn$_invoke$arity$1(opts))," in-screen?:",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.env.in_screen_QMARK_())].join(''));
var sync_ch = (cljs.core.truth_(use_direct_sync_QMARK_)?(cljs.core.truth_(peer_response_atom)?cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$1(peer_response_atom):cljs_thread.sync.make_sync_channel.cljs$core$IFn$_invoke$arity$0()):null);
var ___$1 = (cljs.core.truth_(sync_ch)?(function (){var ra = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch);
return cljs_thread.in$.debug_log_BANG_(["[do-in] sync-ch: atom-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ra.shared_atom_id)," hdr-idx=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ra.header_descriptor_idx)," in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)," reused-peer-atom?=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.boolean$(peer_response_atom))].join(''));
})():null);
var use_node_screen_promise_QMARK_ = (function (){var and__5043__auto__ = cljs_thread.platform.node_QMARK_;
if(and__5043__auto__){
return cljs_thread.env.in_screen_QMARK_();
} else {
return and__5043__auto__;
}
})();
var post_in = (function (){
return cljs_thread.msg.post(raw_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"call","call",-519999866),new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),afn__$1,new cljs.core.Keyword(null,"to","to",192099007),id__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614),in_id,new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], null),(cljs.core.truth_(args__$1)?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sargs","sargs",1421118304),sargs], null):null),(function (){var temp__5823__auto__ = new cljs.core.Keyword(null,"transfers","transfers",2123810614).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(transfer_atom));
if(cljs.core.truth_(temp__5823__auto__)){
var transfers = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"transfers","transfers",2123810614),transfers], null);
} else {
return null;
}
})(),(cljs.core.truth_(opts)?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"opts","opts",155075701),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(opts,new cljs.core.Keyword(null,"request-id","request-id",-985684093),in_id)], null):null),(cljs.core.truth_(sync_ch)?(function (){var response_atom = new cljs.core.Keyword(null,"response-atom","response-atom",-1906696196).cljs$core$IFn$_invoke$arity$1(sync_ch);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"direct-sync?","direct-sync?",-1145947346),true,new cljs.core.Keyword(null,"sync-signal-sab","sync-signal-sab",1124899526),new cljs.core.Keyword(null,"signal-sab","signal-sab",-1535673271).cljs$core$IFn$_invoke$arity$1(sync_ch),new cljs.core.Keyword(null,"sync-atom-id","sync-atom-id",-1919513778),response_atom.shared_atom_id,new cljs.core.Keyword(null,"sync-atom-idx","sync-atom-idx",526705995),response_atom.header_descriptor_idx], null);
})():null)], 0))], null));
});
post_in();

if(cljs.core.truth_(use_direct_sync_QMARK_)){
cljs_thread.in$.debug_log_BANG_(["[do-in] returning wrap-derefable-direct, in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

return cljs_thread.sync.wrap_derefable_direct(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),in_id,new cljs.core.Keyword(null,"sync-channel","sync-channel",74563328),sync_ch], null));
} else {
if(cljs.core.truth_(use_node_screen_promise_QMARK_)){
cljs_thread.in$.debug_log_BANG_(["[do-in] returning node-screen-promise, in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

var resolved_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
var resolved_value = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
var p = (new Promise((function (resolve,reject){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.requests,cljs.core.assoc,in_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"resolve","resolve",-1584445482),(function (result){
cljs.core.reset_BANG_(resolved_QMARK_,true);

cljs.core.reset_BANG_(resolved_value,result);

return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(result) : resolve.call(null, result));
}),new cljs.core.Keyword(null,"reject","reject",1415953113),reject], null));
})));
var x21104 = cljs.core.clone(p);
(x21104.cljs_thread$id$IDable$ = cljs.core.PROTOCOL_SENTINEL);

(x21104.cljs_thread$id$IDable$get_id$arity$1 = (function (___$2){
var ___$3 = this;
return in_id;
}));

(x21104.cljs$core$IPending$ = cljs.core.PROTOCOL_SENTINEL);

(x21104.cljs$core$IPending$_realized_QMARK_$arity$1 = (function (___$2){
var ___$3 = this;
return cljs.core.deref(resolved_QMARK_);
}));

(x21104.cljs$core$IDeref$ = cljs.core.PROTOCOL_SENTINEL);

(x21104.cljs$core$IDeref$_deref$arity$1 = (function (___$2){
var ___$3 = this;
if(cljs.core.truth_(cljs.core.deref(resolved_QMARK_))){
return cljs.core.deref(resolved_value);
} else {
return p;
}
}));

return x21104;
} else {
cljs_thread.in$.debug_log_BANG_(["[do-in] returning wrap-derefable (legacy), in-id=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(in_id)].join(''));

return cljs_thread.sync.wrap_derefable(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([opts,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),in_id], null)], 0)));

}
}
}));

(cljs_thread.in$.do_in.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(cljs_thread.in$.do_in.cljs$lang$applyTo = (function (seq21094){
var G__21095 = cljs.core.first(seq21094);
var seq21094__$1 = cljs.core.next(seq21094);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21095,seq21094__$1);
}));

if(((cljs.core.not(cljs_thread.env.in_screen_QMARK_())) && ((!(cljs_thread.env.in_sw_QMARK_()))))){
cljs_thread.in$.ensure_modules_loaded_BANG_();
} else {
}

//# sourceMappingURL=cljs_thread.in.js.map
