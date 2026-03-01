goog.provide('shadow.cljs.devtools.client.browser');
shadow.cljs.devtools.client.browser.devtools_msg = (function shadow$cljs$devtools$client$browser$devtools_msg(var_args){
var args__5775__auto__ = [];
var len__5769__auto___35001 = arguments.length;
var i__5770__auto___35002 = (0);
while(true){
if((i__5770__auto___35002 < len__5769__auto___35001)){
args__5775__auto__.push((arguments[i__5770__auto___35002]));

var G__35003 = (i__5770__auto___35002 + (1));
i__5770__auto___35002 = G__35003;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic = (function (msg,args){
if(shadow.cljs.devtools.client.env.log){
if(cljs.core.seq(shadow.cljs.devtools.client.env.log_style)){
return console.log.apply(console,cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [["%cshadow-cljs: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg)].join(''),shadow.cljs.devtools.client.env.log_style], null),args)));
} else {
return console.log.apply(console,cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [["shadow-cljs: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg)].join('')], null),args)));
}
} else {
return null;
}
}));

(shadow.cljs.devtools.client.browser.devtools_msg.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(shadow.cljs.devtools.client.browser.devtools_msg.cljs$lang$applyTo = (function (seq34424){
var G__34425 = cljs.core.first(seq34424);
var seq34424__$1 = cljs.core.next(seq34424);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__34425,seq34424__$1);
}));

shadow.cljs.devtools.client.browser.script_eval = (function shadow$cljs$devtools$client$browser$script_eval(code){
return goog.globalEval(code);
});
shadow.cljs.devtools.client.browser.do_js_load = (function shadow$cljs$devtools$client$browser$do_js_load(sources){
var seq__34445 = cljs.core.seq(sources);
var chunk__34446 = null;
var count__34447 = (0);
var i__34448 = (0);
while(true){
if((i__34448 < count__34447)){
var map__34477 = chunk__34446.cljs$core$IIndexed$_nth$arity$2(null, i__34448);
var map__34477__$1 = cljs.core.__destructure_map(map__34477);
var src = map__34477__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34477__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34477__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34477__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34477__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34480){var e_35006 = e34480;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35006);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35006.message)].join('')));
}

var G__35007 = seq__34445;
var G__35008 = chunk__34446;
var G__35009 = count__34447;
var G__35010 = (i__34448 + (1));
seq__34445 = G__35007;
chunk__34446 = G__35008;
count__34447 = G__35009;
i__34448 = G__35010;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34445);
if(temp__5823__auto__){
var seq__34445__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34445__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34445__$1);
var G__35011 = cljs.core.chunk_rest(seq__34445__$1);
var G__35012 = c__5568__auto__;
var G__35013 = cljs.core.count(c__5568__auto__);
var G__35014 = (0);
seq__34445 = G__35011;
chunk__34446 = G__35012;
count__34447 = G__35013;
i__34448 = G__35014;
continue;
} else {
var map__34492 = cljs.core.first(seq__34445__$1);
var map__34492__$1 = cljs.core.__destructure_map(map__34492);
var src = map__34492__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34492__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34492__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34492__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34492__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34498){var e_35015 = e34498;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35015);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35015.message)].join('')));
}

var G__35016 = cljs.core.next(seq__34445__$1);
var G__35017 = null;
var G__35018 = (0);
var G__35019 = (0);
seq__34445 = G__35016;
chunk__34446 = G__35017;
count__34447 = G__35018;
i__34448 = G__35019;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.cljs.devtools.client.browser.do_js_reload = (function shadow$cljs$devtools$client$browser$do_js_reload(msg,sources,complete_fn,failure_fn){
return shadow.cljs.devtools.client.env.do_js_reload.cljs$core$IFn$_invoke$arity$4(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(msg,new cljs.core.Keyword(null,"log-missing-fn","log-missing-fn",732676765),(function (fn_sym){
return null;
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"log-call-async","log-call-async",183826192),(function (fn_sym){
return shadow.cljs.devtools.client.browser.devtools_msg(["call async ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym)].join(''));
}),new cljs.core.Keyword(null,"log-call","log-call",412404391),(function (fn_sym){
return shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym)].join(''));
})], 0)),(function (){
return shadow.cljs.devtools.client.browser.do_js_load(sources);
}),complete_fn,failure_fn);
});
/**
 * when (require '["some-str" :as x]) is done at the REPL we need to manually call the shadow.js.require for it
 * since the file only adds the shadow$provide. only need to do this for shadow-js.
 */
shadow.cljs.devtools.client.browser.do_js_requires = (function shadow$cljs$devtools$client$browser$do_js_requires(js_requires){
var seq__34526 = cljs.core.seq(js_requires);
var chunk__34527 = null;
var count__34529 = (0);
var i__34530 = (0);
while(true){
if((i__34530 < count__34529)){
var js_ns = chunk__34527.cljs$core$IIndexed$_nth$arity$2(null, i__34530);
var require_str_35020 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35020);


var G__35021 = seq__34526;
var G__35022 = chunk__34527;
var G__35023 = count__34529;
var G__35024 = (i__34530 + (1));
seq__34526 = G__35021;
chunk__34527 = G__35022;
count__34529 = G__35023;
i__34530 = G__35024;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34526);
if(temp__5823__auto__){
var seq__34526__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34526__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34526__$1);
var G__35025 = cljs.core.chunk_rest(seq__34526__$1);
var G__35026 = c__5568__auto__;
var G__35027 = cljs.core.count(c__5568__auto__);
var G__35028 = (0);
seq__34526 = G__35025;
chunk__34527 = G__35026;
count__34529 = G__35027;
i__34530 = G__35028;
continue;
} else {
var js_ns = cljs.core.first(seq__34526__$1);
var require_str_35029 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35029);


var G__35030 = cljs.core.next(seq__34526__$1);
var G__35031 = null;
var G__35032 = (0);
var G__35033 = (0);
seq__34526 = G__35030;
chunk__34527 = G__35031;
count__34529 = G__35032;
i__34530 = G__35033;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.cljs.devtools.client.browser.handle_build_complete = (function shadow$cljs$devtools$client$browser$handle_build_complete(runtime,p__34560){
var map__34561 = p__34560;
var map__34561__$1 = cljs.core.__destructure_map(map__34561);
var msg = map__34561__$1;
var info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34561__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34561__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var warnings = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.distinct.cljs$core$IFn$_invoke$arity$1((function (){var iter__5523__auto__ = (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34565(s__34566){
return (new cljs.core.LazySeq(null,(function (){
var s__34566__$1 = s__34566;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__34566__$1);
if(temp__5823__auto__){
var xs__6383__auto__ = temp__5823__auto__;
var map__34577 = cljs.core.first(xs__6383__auto__);
var map__34577__$1 = cljs.core.__destructure_map(map__34577);
var src = map__34577__$1;
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34577__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var warnings = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34577__$1,new cljs.core.Keyword(null,"warnings","warnings",-735437651));
if(cljs.core.not(new cljs.core.Keyword(null,"from-jar","from-jar",1050932827).cljs$core$IFn$_invoke$arity$1(src))){
var iterys__5519__auto__ = ((function (s__34566__$1,map__34577,map__34577__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34561,map__34561__$1,msg,info,reload_info){
return (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34565_$_iter__34567(s__34568){
return (new cljs.core.LazySeq(null,((function (s__34566__$1,map__34577,map__34577__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34561,map__34561__$1,msg,info,reload_info){
return (function (){
var s__34568__$1 = s__34568;
while(true){
var temp__5823__auto____$1 = cljs.core.seq(s__34568__$1);
if(temp__5823__auto____$1){
var s__34568__$2 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__34568__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__34568__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__34570 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__34569 = (0);
while(true){
if((i__34569 < size__5522__auto__)){
var warning = cljs.core._nth(c__5521__auto__,i__34569);
cljs.core.chunk_append(b__34570,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name));

var G__35035 = (i__34569 + (1));
i__34569 = G__35035;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__34570),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34565_$_iter__34567(cljs.core.chunk_rest(s__34568__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__34570),null);
}
} else {
var warning = cljs.core.first(s__34568__$2);
return cljs.core.cons(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34565_$_iter__34567(cljs.core.rest(s__34568__$2)));
}
} else {
return null;
}
break;
}
});})(s__34566__$1,map__34577,map__34577__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34561,map__34561__$1,msg,info,reload_info))
,null,null));
});})(s__34566__$1,map__34577,map__34577__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34561,map__34561__$1,msg,info,reload_info))
;
var fs__5520__auto__ = cljs.core.seq(iterys__5519__auto__(warnings));
if(fs__5520__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__5520__auto__,shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34565(cljs.core.rest(s__34566__$1)));
} else {
var G__35036 = cljs.core.rest(s__34566__$1);
s__34566__$1 = G__35036;
continue;
}
} else {
var G__35037 = cljs.core.rest(s__34566__$1);
s__34566__$1 = G__35037;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(info));
})()));
if(shadow.cljs.devtools.client.env.log){
var seq__34582_35038 = cljs.core.seq(warnings);
var chunk__34583_35039 = null;
var count__34584_35040 = (0);
var i__34585_35041 = (0);
while(true){
if((i__34585_35041 < count__34584_35040)){
var map__34592_35042 = chunk__34583_35039.cljs$core$IIndexed$_nth$arity$2(null, i__34585_35041);
var map__34592_35043__$1 = cljs.core.__destructure_map(map__34592_35042);
var w_35044 = map__34592_35043__$1;
var msg_35045__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592_35043__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35046 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592_35043__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35047 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592_35043__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35048 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592_35043__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35048)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35046),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35047),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35045__$1)].join(''));


var G__35049 = seq__34582_35038;
var G__35050 = chunk__34583_35039;
var G__35051 = count__34584_35040;
var G__35052 = (i__34585_35041 + (1));
seq__34582_35038 = G__35049;
chunk__34583_35039 = G__35050;
count__34584_35040 = G__35051;
i__34585_35041 = G__35052;
continue;
} else {
var temp__5823__auto___35053 = cljs.core.seq(seq__34582_35038);
if(temp__5823__auto___35053){
var seq__34582_35054__$1 = temp__5823__auto___35053;
if(cljs.core.chunked_seq_QMARK_(seq__34582_35054__$1)){
var c__5568__auto___35056 = cljs.core.chunk_first(seq__34582_35054__$1);
var G__35057 = cljs.core.chunk_rest(seq__34582_35054__$1);
var G__35058 = c__5568__auto___35056;
var G__35059 = cljs.core.count(c__5568__auto___35056);
var G__35060 = (0);
seq__34582_35038 = G__35057;
chunk__34583_35039 = G__35058;
count__34584_35040 = G__35059;
i__34585_35041 = G__35060;
continue;
} else {
var map__34595_35061 = cljs.core.first(seq__34582_35054__$1);
var map__34595_35062__$1 = cljs.core.__destructure_map(map__34595_35061);
var w_35063 = map__34595_35062__$1;
var msg_35064__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34595_35062__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35065 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34595_35062__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35066 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34595_35062__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35067 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34595_35062__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35067)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35065),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35066),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35064__$1)].join(''));


var G__35069 = cljs.core.next(seq__34582_35054__$1);
var G__35070 = null;
var G__35071 = (0);
var G__35072 = (0);
seq__34582_35038 = G__35069;
chunk__34583_35039 = G__35070;
count__34584_35040 = G__35071;
i__34585_35041 = G__35072;
continue;
}
} else {
}
}
break;
}
} else {
}

if((!(shadow.cljs.devtools.client.env.autoload))){
return shadow.cljs.devtools.client.hud.load_end_success();
} else {
if(((cljs.core.empty_QMARK_(warnings)) || (shadow.cljs.devtools.client.env.ignore_warnings))){
var sources_to_get = shadow.cljs.devtools.client.env.filter_reload_sources(info,reload_info);
if(cljs.core.not(cljs.core.seq(sources_to_get))){
return shadow.cljs.devtools.client.hud.load_end_success();
} else {
if(cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"after-load","after-load",-1278503285)], null)))){
} else {
shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("reloading code but no :after-load hooks are configured!",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["https://shadow-cljs.github.io/docs/UsersGuide.html#_lifecycle_hooks"], 0));
}

return shadow.cljs.devtools.client.shared.load_sources(runtime,sources_to_get,(function (p1__34559_SHARP_){
return shadow.cljs.devtools.client.browser.do_js_reload(msg,p1__34559_SHARP_,shadow.cljs.devtools.client.hud.load_end_success,shadow.cljs.devtools.client.hud.load_failure);
}));
}
} else {
return null;
}
}
});
shadow.cljs.devtools.client.browser.page_load_uri = (cljs.core.truth_(goog.global.document)?goog.Uri.parse(document.location.href):null);
shadow.cljs.devtools.client.browser.match_paths = (function shadow$cljs$devtools$client$browser$match_paths(old,new$){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("file",shadow.cljs.devtools.client.browser.page_load_uri.getScheme())){
var rel_new = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(new$,(1));
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(old,rel_new)) || (clojure.string.starts_with_QMARK_(old,[rel_new,"?"].join(''))))){
return rel_new;
} else {
return null;
}
} else {
var node_uri = goog.Uri.parse(old);
var node_uri_resolved = shadow.cljs.devtools.client.browser.page_load_uri.resolve(node_uri);
var node_abs = node_uri_resolved.getPath();
var and__5043__auto__ = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$1(shadow.cljs.devtools.client.browser.page_load_uri.hasSameDomainAs(node_uri))) || (cljs.core.not(node_uri.hasDomain())));
if(and__5043__auto__){
var and__5043__auto____$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(node_abs,new$);
if(and__5043__auto____$1){
return new$;
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
}
});
shadow.cljs.devtools.client.browser.handle_asset_update = (function shadow$cljs$devtools$client$browser$handle_asset_update(p__34610){
var map__34611 = p__34610;
var map__34611__$1 = cljs.core.__destructure_map(map__34611);
var msg = map__34611__$1;
var updates = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34611__$1,new cljs.core.Keyword(null,"updates","updates",2013983452));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34611__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var seq__34612 = cljs.core.seq(updates);
var chunk__34614 = null;
var count__34615 = (0);
var i__34616 = (0);
while(true){
if((i__34616 < count__34615)){
var path = chunk__34614.cljs$core$IIndexed$_nth$arity$2(null, i__34616);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__34761_35073 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__34765_35074 = null;
var count__34766_35075 = (0);
var i__34767_35076 = (0);
while(true){
if((i__34767_35076 < count__34766_35075)){
var node_35078 = chunk__34765_35074.cljs$core$IIndexed$_nth$arity$2(null, i__34767_35076);
if(cljs.core.not(node_35078.shadow$old)){
var path_match_35079 = shadow.cljs.devtools.client.browser.match_paths(node_35078.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35079)){
var new_link_35080 = (function (){var G__34810 = node_35078.cloneNode(true);
G__34810.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35079),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34810;
})();
(node_35078.shadow$old = true);

(new_link_35080.onload = ((function (seq__34761_35073,chunk__34765_35074,count__34766_35075,i__34767_35076,seq__34612,chunk__34614,count__34615,i__34616,new_link_35080,path_match_35079,node_35078,path,map__34611,map__34611__$1,msg,updates,reload_info){
return (function (e){
var seq__34811_35082 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34813_35083 = null;
var count__34814_35084 = (0);
var i__34815_35085 = (0);
while(true){
if((i__34815_35085 < count__34814_35084)){
var map__34820_35086 = chunk__34813_35083.cljs$core$IIndexed$_nth$arity$2(null, i__34815_35085);
var map__34820_35087__$1 = cljs.core.__destructure_map(map__34820_35086);
var task_35088 = map__34820_35087__$1;
var fn_str_35089 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34820_35087__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35090 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34820_35087__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35091 = goog.getObjectByName(fn_str_35089,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35090)].join(''));

(fn_obj_35091.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35091.cljs$core$IFn$_invoke$arity$2(path,new_link_35080) : fn_obj_35091.call(null, path,new_link_35080));


var G__35092 = seq__34811_35082;
var G__35093 = chunk__34813_35083;
var G__35094 = count__34814_35084;
var G__35095 = (i__34815_35085 + (1));
seq__34811_35082 = G__35092;
chunk__34813_35083 = G__35093;
count__34814_35084 = G__35094;
i__34815_35085 = G__35095;
continue;
} else {
var temp__5823__auto___35096 = cljs.core.seq(seq__34811_35082);
if(temp__5823__auto___35096){
var seq__34811_35097__$1 = temp__5823__auto___35096;
if(cljs.core.chunked_seq_QMARK_(seq__34811_35097__$1)){
var c__5568__auto___35098 = cljs.core.chunk_first(seq__34811_35097__$1);
var G__35099 = cljs.core.chunk_rest(seq__34811_35097__$1);
var G__35100 = c__5568__auto___35098;
var G__35101 = cljs.core.count(c__5568__auto___35098);
var G__35102 = (0);
seq__34811_35082 = G__35099;
chunk__34813_35083 = G__35100;
count__34814_35084 = G__35101;
i__34815_35085 = G__35102;
continue;
} else {
var map__34821_35103 = cljs.core.first(seq__34811_35097__$1);
var map__34821_35104__$1 = cljs.core.__destructure_map(map__34821_35103);
var task_35105 = map__34821_35104__$1;
var fn_str_35106 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34821_35104__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35107 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34821_35104__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35108 = goog.getObjectByName(fn_str_35106,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35107)].join(''));

(fn_obj_35108.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35108.cljs$core$IFn$_invoke$arity$2(path,new_link_35080) : fn_obj_35108.call(null, path,new_link_35080));


var G__35109 = cljs.core.next(seq__34811_35097__$1);
var G__35110 = null;
var G__35111 = (0);
var G__35112 = (0);
seq__34811_35082 = G__35109;
chunk__34813_35083 = G__35110;
count__34814_35084 = G__35111;
i__34815_35085 = G__35112;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35078);
});})(seq__34761_35073,chunk__34765_35074,count__34766_35075,i__34767_35076,seq__34612,chunk__34614,count__34615,i__34616,new_link_35080,path_match_35079,node_35078,path,map__34611,map__34611__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35079], 0));

goog.dom.insertSiblingAfter(new_link_35080,node_35078);


var G__35113 = seq__34761_35073;
var G__35114 = chunk__34765_35074;
var G__35115 = count__34766_35075;
var G__35116 = (i__34767_35076 + (1));
seq__34761_35073 = G__35113;
chunk__34765_35074 = G__35114;
count__34766_35075 = G__35115;
i__34767_35076 = G__35116;
continue;
} else {
var G__35117 = seq__34761_35073;
var G__35118 = chunk__34765_35074;
var G__35119 = count__34766_35075;
var G__35120 = (i__34767_35076 + (1));
seq__34761_35073 = G__35117;
chunk__34765_35074 = G__35118;
count__34766_35075 = G__35119;
i__34767_35076 = G__35120;
continue;
}
} else {
var G__35121 = seq__34761_35073;
var G__35122 = chunk__34765_35074;
var G__35123 = count__34766_35075;
var G__35124 = (i__34767_35076 + (1));
seq__34761_35073 = G__35121;
chunk__34765_35074 = G__35122;
count__34766_35075 = G__35123;
i__34767_35076 = G__35124;
continue;
}
} else {
var temp__5823__auto___35125 = cljs.core.seq(seq__34761_35073);
if(temp__5823__auto___35125){
var seq__34761_35126__$1 = temp__5823__auto___35125;
if(cljs.core.chunked_seq_QMARK_(seq__34761_35126__$1)){
var c__5568__auto___35127 = cljs.core.chunk_first(seq__34761_35126__$1);
var G__35128 = cljs.core.chunk_rest(seq__34761_35126__$1);
var G__35129 = c__5568__auto___35127;
var G__35130 = cljs.core.count(c__5568__auto___35127);
var G__35131 = (0);
seq__34761_35073 = G__35128;
chunk__34765_35074 = G__35129;
count__34766_35075 = G__35130;
i__34767_35076 = G__35131;
continue;
} else {
var node_35132 = cljs.core.first(seq__34761_35126__$1);
if(cljs.core.not(node_35132.shadow$old)){
var path_match_35133 = shadow.cljs.devtools.client.browser.match_paths(node_35132.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35133)){
var new_link_35134 = (function (){var G__34822 = node_35132.cloneNode(true);
G__34822.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35133),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34822;
})();
(node_35132.shadow$old = true);

(new_link_35134.onload = ((function (seq__34761_35073,chunk__34765_35074,count__34766_35075,i__34767_35076,seq__34612,chunk__34614,count__34615,i__34616,new_link_35134,path_match_35133,node_35132,seq__34761_35126__$1,temp__5823__auto___35125,path,map__34611,map__34611__$1,msg,updates,reload_info){
return (function (e){
var seq__34823_35135 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34825_35136 = null;
var count__34826_35137 = (0);
var i__34827_35138 = (0);
while(true){
if((i__34827_35138 < count__34826_35137)){
var map__34839_35139 = chunk__34825_35136.cljs$core$IIndexed$_nth$arity$2(null, i__34827_35138);
var map__34839_35140__$1 = cljs.core.__destructure_map(map__34839_35139);
var task_35141 = map__34839_35140__$1;
var fn_str_35142 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34839_35140__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35143 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34839_35140__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35144 = goog.getObjectByName(fn_str_35142,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35143)].join(''));

(fn_obj_35144.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35144.cljs$core$IFn$_invoke$arity$2(path,new_link_35134) : fn_obj_35144.call(null, path,new_link_35134));


var G__35145 = seq__34823_35135;
var G__35146 = chunk__34825_35136;
var G__35147 = count__34826_35137;
var G__35148 = (i__34827_35138 + (1));
seq__34823_35135 = G__35145;
chunk__34825_35136 = G__35146;
count__34826_35137 = G__35147;
i__34827_35138 = G__35148;
continue;
} else {
var temp__5823__auto___35149__$1 = cljs.core.seq(seq__34823_35135);
if(temp__5823__auto___35149__$1){
var seq__34823_35150__$1 = temp__5823__auto___35149__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34823_35150__$1)){
var c__5568__auto___35151 = cljs.core.chunk_first(seq__34823_35150__$1);
var G__35152 = cljs.core.chunk_rest(seq__34823_35150__$1);
var G__35153 = c__5568__auto___35151;
var G__35154 = cljs.core.count(c__5568__auto___35151);
var G__35155 = (0);
seq__34823_35135 = G__35152;
chunk__34825_35136 = G__35153;
count__34826_35137 = G__35154;
i__34827_35138 = G__35155;
continue;
} else {
var map__34846_35156 = cljs.core.first(seq__34823_35150__$1);
var map__34846_35157__$1 = cljs.core.__destructure_map(map__34846_35156);
var task_35158 = map__34846_35157__$1;
var fn_str_35159 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34846_35157__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35160 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34846_35157__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35161 = goog.getObjectByName(fn_str_35159,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35160)].join(''));

(fn_obj_35161.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35161.cljs$core$IFn$_invoke$arity$2(path,new_link_35134) : fn_obj_35161.call(null, path,new_link_35134));


var G__35162 = cljs.core.next(seq__34823_35150__$1);
var G__35163 = null;
var G__35164 = (0);
var G__35165 = (0);
seq__34823_35135 = G__35162;
chunk__34825_35136 = G__35163;
count__34826_35137 = G__35164;
i__34827_35138 = G__35165;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35132);
});})(seq__34761_35073,chunk__34765_35074,count__34766_35075,i__34767_35076,seq__34612,chunk__34614,count__34615,i__34616,new_link_35134,path_match_35133,node_35132,seq__34761_35126__$1,temp__5823__auto___35125,path,map__34611,map__34611__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35133], 0));

goog.dom.insertSiblingAfter(new_link_35134,node_35132);


var G__35166 = cljs.core.next(seq__34761_35126__$1);
var G__35167 = null;
var G__35168 = (0);
var G__35169 = (0);
seq__34761_35073 = G__35166;
chunk__34765_35074 = G__35167;
count__34766_35075 = G__35168;
i__34767_35076 = G__35169;
continue;
} else {
var G__35170 = cljs.core.next(seq__34761_35126__$1);
var G__35171 = null;
var G__35172 = (0);
var G__35173 = (0);
seq__34761_35073 = G__35170;
chunk__34765_35074 = G__35171;
count__34766_35075 = G__35172;
i__34767_35076 = G__35173;
continue;
}
} else {
var G__35174 = cljs.core.next(seq__34761_35126__$1);
var G__35175 = null;
var G__35176 = (0);
var G__35177 = (0);
seq__34761_35073 = G__35174;
chunk__34765_35074 = G__35175;
count__34766_35075 = G__35176;
i__34767_35076 = G__35177;
continue;
}
}
} else {
}
}
break;
}


var G__35178 = seq__34612;
var G__35179 = chunk__34614;
var G__35180 = count__34615;
var G__35181 = (i__34616 + (1));
seq__34612 = G__35178;
chunk__34614 = G__35179;
count__34615 = G__35180;
i__34616 = G__35181;
continue;
} else {
var G__35182 = seq__34612;
var G__35183 = chunk__34614;
var G__35184 = count__34615;
var G__35185 = (i__34616 + (1));
seq__34612 = G__35182;
chunk__34614 = G__35183;
count__34615 = G__35184;
i__34616 = G__35185;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34612);
if(temp__5823__auto__){
var seq__34612__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34612__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34612__$1);
var G__35186 = cljs.core.chunk_rest(seq__34612__$1);
var G__35187 = c__5568__auto__;
var G__35188 = cljs.core.count(c__5568__auto__);
var G__35189 = (0);
seq__34612 = G__35186;
chunk__34614 = G__35187;
count__34615 = G__35188;
i__34616 = G__35189;
continue;
} else {
var path = cljs.core.first(seq__34612__$1);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__34851_35191 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__34855_35192 = null;
var count__34856_35193 = (0);
var i__34857_35194 = (0);
while(true){
if((i__34857_35194 < count__34856_35193)){
var node_35196 = chunk__34855_35192.cljs$core$IIndexed$_nth$arity$2(null, i__34857_35194);
if(cljs.core.not(node_35196.shadow$old)){
var path_match_35197 = shadow.cljs.devtools.client.browser.match_paths(node_35196.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35197)){
var new_link_35198 = (function (){var G__34895 = node_35196.cloneNode(true);
G__34895.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35197),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34895;
})();
(node_35196.shadow$old = true);

(new_link_35198.onload = ((function (seq__34851_35191,chunk__34855_35192,count__34856_35193,i__34857_35194,seq__34612,chunk__34614,count__34615,i__34616,new_link_35198,path_match_35197,node_35196,path,seq__34612__$1,temp__5823__auto__,map__34611,map__34611__$1,msg,updates,reload_info){
return (function (e){
var seq__34896_35199 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34898_35200 = null;
var count__34899_35201 = (0);
var i__34900_35202 = (0);
while(true){
if((i__34900_35202 < count__34899_35201)){
var map__34906_35203 = chunk__34898_35200.cljs$core$IIndexed$_nth$arity$2(null, i__34900_35202);
var map__34906_35204__$1 = cljs.core.__destructure_map(map__34906_35203);
var task_35205 = map__34906_35204__$1;
var fn_str_35206 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34906_35204__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35207 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34906_35204__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35208 = goog.getObjectByName(fn_str_35206,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35207)].join(''));

(fn_obj_35208.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35208.cljs$core$IFn$_invoke$arity$2(path,new_link_35198) : fn_obj_35208.call(null, path,new_link_35198));


var G__35209 = seq__34896_35199;
var G__35210 = chunk__34898_35200;
var G__35211 = count__34899_35201;
var G__35212 = (i__34900_35202 + (1));
seq__34896_35199 = G__35209;
chunk__34898_35200 = G__35210;
count__34899_35201 = G__35211;
i__34900_35202 = G__35212;
continue;
} else {
var temp__5823__auto___35213__$1 = cljs.core.seq(seq__34896_35199);
if(temp__5823__auto___35213__$1){
var seq__34896_35214__$1 = temp__5823__auto___35213__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34896_35214__$1)){
var c__5568__auto___35215 = cljs.core.chunk_first(seq__34896_35214__$1);
var G__35216 = cljs.core.chunk_rest(seq__34896_35214__$1);
var G__35217 = c__5568__auto___35215;
var G__35218 = cljs.core.count(c__5568__auto___35215);
var G__35219 = (0);
seq__34896_35199 = G__35216;
chunk__34898_35200 = G__35217;
count__34899_35201 = G__35218;
i__34900_35202 = G__35219;
continue;
} else {
var map__34914_35220 = cljs.core.first(seq__34896_35214__$1);
var map__34914_35221__$1 = cljs.core.__destructure_map(map__34914_35220);
var task_35222 = map__34914_35221__$1;
var fn_str_35223 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34914_35221__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35224 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34914_35221__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35225 = goog.getObjectByName(fn_str_35223,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35224)].join(''));

(fn_obj_35225.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35225.cljs$core$IFn$_invoke$arity$2(path,new_link_35198) : fn_obj_35225.call(null, path,new_link_35198));


var G__35226 = cljs.core.next(seq__34896_35214__$1);
var G__35227 = null;
var G__35228 = (0);
var G__35229 = (0);
seq__34896_35199 = G__35226;
chunk__34898_35200 = G__35227;
count__34899_35201 = G__35228;
i__34900_35202 = G__35229;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35196);
});})(seq__34851_35191,chunk__34855_35192,count__34856_35193,i__34857_35194,seq__34612,chunk__34614,count__34615,i__34616,new_link_35198,path_match_35197,node_35196,path,seq__34612__$1,temp__5823__auto__,map__34611,map__34611__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35197], 0));

goog.dom.insertSiblingAfter(new_link_35198,node_35196);


var G__35230 = seq__34851_35191;
var G__35231 = chunk__34855_35192;
var G__35232 = count__34856_35193;
var G__35233 = (i__34857_35194 + (1));
seq__34851_35191 = G__35230;
chunk__34855_35192 = G__35231;
count__34856_35193 = G__35232;
i__34857_35194 = G__35233;
continue;
} else {
var G__35234 = seq__34851_35191;
var G__35235 = chunk__34855_35192;
var G__35236 = count__34856_35193;
var G__35237 = (i__34857_35194 + (1));
seq__34851_35191 = G__35234;
chunk__34855_35192 = G__35235;
count__34856_35193 = G__35236;
i__34857_35194 = G__35237;
continue;
}
} else {
var G__35238 = seq__34851_35191;
var G__35239 = chunk__34855_35192;
var G__35240 = count__34856_35193;
var G__35241 = (i__34857_35194 + (1));
seq__34851_35191 = G__35238;
chunk__34855_35192 = G__35239;
count__34856_35193 = G__35240;
i__34857_35194 = G__35241;
continue;
}
} else {
var temp__5823__auto___35242__$1 = cljs.core.seq(seq__34851_35191);
if(temp__5823__auto___35242__$1){
var seq__34851_35243__$1 = temp__5823__auto___35242__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34851_35243__$1)){
var c__5568__auto___35244 = cljs.core.chunk_first(seq__34851_35243__$1);
var G__35245 = cljs.core.chunk_rest(seq__34851_35243__$1);
var G__35246 = c__5568__auto___35244;
var G__35247 = cljs.core.count(c__5568__auto___35244);
var G__35248 = (0);
seq__34851_35191 = G__35245;
chunk__34855_35192 = G__35246;
count__34856_35193 = G__35247;
i__34857_35194 = G__35248;
continue;
} else {
var node_35249 = cljs.core.first(seq__34851_35243__$1);
if(cljs.core.not(node_35249.shadow$old)){
var path_match_35250 = shadow.cljs.devtools.client.browser.match_paths(node_35249.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35250)){
var new_link_35251 = (function (){var G__34923 = node_35249.cloneNode(true);
G__34923.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35250),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34923;
})();
(node_35249.shadow$old = true);

(new_link_35251.onload = ((function (seq__34851_35191,chunk__34855_35192,count__34856_35193,i__34857_35194,seq__34612,chunk__34614,count__34615,i__34616,new_link_35251,path_match_35250,node_35249,seq__34851_35243__$1,temp__5823__auto___35242__$1,path,seq__34612__$1,temp__5823__auto__,map__34611,map__34611__$1,msg,updates,reload_info){
return (function (e){
var seq__34925_35252 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34927_35253 = null;
var count__34928_35254 = (0);
var i__34929_35255 = (0);
while(true){
if((i__34929_35255 < count__34928_35254)){
var map__34940_35256 = chunk__34927_35253.cljs$core$IIndexed$_nth$arity$2(null, i__34929_35255);
var map__34940_35257__$1 = cljs.core.__destructure_map(map__34940_35256);
var task_35258 = map__34940_35257__$1;
var fn_str_35259 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34940_35257__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35260 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34940_35257__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35261 = goog.getObjectByName(fn_str_35259,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35260)].join(''));

(fn_obj_35261.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35261.cljs$core$IFn$_invoke$arity$2(path,new_link_35251) : fn_obj_35261.call(null, path,new_link_35251));


var G__35262 = seq__34925_35252;
var G__35263 = chunk__34927_35253;
var G__35264 = count__34928_35254;
var G__35265 = (i__34929_35255 + (1));
seq__34925_35252 = G__35262;
chunk__34927_35253 = G__35263;
count__34928_35254 = G__35264;
i__34929_35255 = G__35265;
continue;
} else {
var temp__5823__auto___35266__$2 = cljs.core.seq(seq__34925_35252);
if(temp__5823__auto___35266__$2){
var seq__34925_35267__$1 = temp__5823__auto___35266__$2;
if(cljs.core.chunked_seq_QMARK_(seq__34925_35267__$1)){
var c__5568__auto___35268 = cljs.core.chunk_first(seq__34925_35267__$1);
var G__35269 = cljs.core.chunk_rest(seq__34925_35267__$1);
var G__35270 = c__5568__auto___35268;
var G__35271 = cljs.core.count(c__5568__auto___35268);
var G__35272 = (0);
seq__34925_35252 = G__35269;
chunk__34927_35253 = G__35270;
count__34928_35254 = G__35271;
i__34929_35255 = G__35272;
continue;
} else {
var map__34951_35273 = cljs.core.first(seq__34925_35267__$1);
var map__34951_35274__$1 = cljs.core.__destructure_map(map__34951_35273);
var task_35275 = map__34951_35274__$1;
var fn_str_35276 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34951_35274__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35277 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34951_35274__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35278 = goog.getObjectByName(fn_str_35276,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35277)].join(''));

(fn_obj_35278.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35278.cljs$core$IFn$_invoke$arity$2(path,new_link_35251) : fn_obj_35278.call(null, path,new_link_35251));


var G__35279 = cljs.core.next(seq__34925_35267__$1);
var G__35280 = null;
var G__35281 = (0);
var G__35282 = (0);
seq__34925_35252 = G__35279;
chunk__34927_35253 = G__35280;
count__34928_35254 = G__35281;
i__34929_35255 = G__35282;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35249);
});})(seq__34851_35191,chunk__34855_35192,count__34856_35193,i__34857_35194,seq__34612,chunk__34614,count__34615,i__34616,new_link_35251,path_match_35250,node_35249,seq__34851_35243__$1,temp__5823__auto___35242__$1,path,seq__34612__$1,temp__5823__auto__,map__34611,map__34611__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35250], 0));

goog.dom.insertSiblingAfter(new_link_35251,node_35249);


var G__35283 = cljs.core.next(seq__34851_35243__$1);
var G__35284 = null;
var G__35285 = (0);
var G__35286 = (0);
seq__34851_35191 = G__35283;
chunk__34855_35192 = G__35284;
count__34856_35193 = G__35285;
i__34857_35194 = G__35286;
continue;
} else {
var G__35287 = cljs.core.next(seq__34851_35243__$1);
var G__35288 = null;
var G__35289 = (0);
var G__35290 = (0);
seq__34851_35191 = G__35287;
chunk__34855_35192 = G__35288;
count__34856_35193 = G__35289;
i__34857_35194 = G__35290;
continue;
}
} else {
var G__35291 = cljs.core.next(seq__34851_35243__$1);
var G__35292 = null;
var G__35293 = (0);
var G__35294 = (0);
seq__34851_35191 = G__35291;
chunk__34855_35192 = G__35292;
count__34856_35193 = G__35293;
i__34857_35194 = G__35294;
continue;
}
}
} else {
}
}
break;
}


var G__35295 = cljs.core.next(seq__34612__$1);
var G__35296 = null;
var G__35297 = (0);
var G__35298 = (0);
seq__34612 = G__35295;
chunk__34614 = G__35296;
count__34615 = G__35297;
i__34616 = G__35298;
continue;
} else {
var G__35299 = cljs.core.next(seq__34612__$1);
var G__35300 = null;
var G__35301 = (0);
var G__35302 = (0);
seq__34612 = G__35299;
chunk__34614 = G__35300;
count__34615 = G__35301;
i__34616 = G__35302;
continue;
}
}
} else {
return null;
}
}
break;
}
});
shadow.cljs.devtools.client.browser.global_eval = (function shadow$cljs$devtools$client$browser$global_eval(js){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("undefined",typeof(module))){
return eval(js);
} else {
return (0,eval)(js);;
}
});
shadow.cljs.devtools.client.browser.runtime_info = (((typeof SHADOW_CONFIG !== 'undefined'))?shadow.json.to_clj.cljs$core$IFn$_invoke$arity$1(SHADOW_CONFIG):null);
shadow.cljs.devtools.client.browser.client_info = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([shadow.cljs.devtools.client.browser.runtime_info,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"host","host",-1558485167),(cljs.core.truth_(goog.global.document)?new cljs.core.Keyword(null,"browser","browser",828191719):new cljs.core.Keyword(null,"browser-worker","browser-worker",1638998282)),new cljs.core.Keyword(null,"user-agent","user-agent",1220426212),[(cljs.core.truth_(goog.userAgent.OPERA)?"Opera":(cljs.core.truth_(goog.userAgent.product.CHROME)?"Chrome":(cljs.core.truth_(goog.userAgent.IE)?"MSIE":(cljs.core.truth_(goog.userAgent.EDGE)?"Edge":(cljs.core.truth_(goog.userAgent.GECKO)?"Firefox":(cljs.core.truth_(goog.userAgent.SAFARI)?"Safari":(cljs.core.truth_(goog.userAgent.WEBKIT)?"Webkit":null)))))))," ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(goog.userAgent.VERSION)," [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(goog.userAgent.PLATFORM),"]"].join(''),new cljs.core.Keyword(null,"dom","dom",-1236537922),(!((goog.global.document == null)))], null)], 0));
if((typeof shadow !== 'undefined') && (typeof shadow.cljs !== 'undefined') && (typeof shadow.cljs.devtools !== 'undefined') && (typeof shadow.cljs.devtools.client !== 'undefined') && (typeof shadow.cljs.devtools.client.browser !== 'undefined') && (typeof shadow.cljs.devtools.client.browser.ws_was_welcome_ref !== 'undefined')){
} else {
shadow.cljs.devtools.client.browser.ws_was_welcome_ref = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
if(((shadow.cljs.devtools.client.env.enabled) && ((shadow.cljs.devtools.client.env.worker_client_id > (0))))){
(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$remote$runtime$api$IEvalJS$ = cljs.core.PROTOCOL_SENTINEL);

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$remote$runtime$api$IEvalJS$_js_eval$arity$2 = (function (this$,code){
var this$__$1 = this;
return shadow.cljs.devtools.client.browser.global_eval(code);
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$ = cljs.core.PROTOCOL_SENTINEL);

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_invoke$arity$3 = (function (this$,ns,p__34966){
var map__34967 = p__34966;
var map__34967__$1 = cljs.core.__destructure_map(map__34967);
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34967__$1,new cljs.core.Keyword(null,"js","js",1768080579));
var this$__$1 = this;
return shadow.cljs.devtools.client.browser.global_eval(js);
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_init$arity$4 = (function (runtime,p__34968,done,error){
var map__34969 = p__34968;
var map__34969__$1 = cljs.core.__destructure_map(map__34969);
var repl_sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34969__$1,new cljs.core.Keyword(null,"repl-sources","repl-sources",723867535));
var runtime__$1 = this;
return shadow.cljs.devtools.client.shared.load_sources(runtime__$1,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(shadow.cljs.devtools.client.env.src_is_loaded_QMARK_,repl_sources)),(function (sources){
shadow.cljs.devtools.client.browser.do_js_load(sources);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null, ));
}));
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_require$arity$4 = (function (runtime,p__34975,done,error){
var map__34976 = p__34975;
var map__34976__$1 = cljs.core.__destructure_map(map__34976);
var msg = map__34976__$1;
var sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34976__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
var reload_namespaces = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34976__$1,new cljs.core.Keyword(null,"reload-namespaces","reload-namespaces",250210134));
var js_requires = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34976__$1,new cljs.core.Keyword(null,"js-requires","js-requires",-1311472051));
var runtime__$1 = this;
var sources_to_load = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__34978){
var map__34979 = p__34978;
var map__34979__$1 = cljs.core.__destructure_map(map__34979);
var src = map__34979__$1;
var provides = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34979__$1,new cljs.core.Keyword(null,"provides","provides",-1634397992));
var and__5043__auto__ = shadow.cljs.devtools.client.env.src_is_loaded_QMARK_(src);
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs.core.some(reload_namespaces,provides));
} else {
return and__5043__auto__;
}
}),sources));
if(cljs.core.not(cljs.core.seq(sources_to_load))){
var G__34980 = cljs.core.PersistentVector.EMPTY;
return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(G__34980) : done.call(null, G__34980));
} else {
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3(runtime__$1,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"cljs-load-sources","cljs-load-sources",-1458295962),new cljs.core.Keyword(null,"to","to",192099007),shadow.cljs.devtools.client.env.worker_client_id,new cljs.core.Keyword(null,"sources","sources",-321166424),cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582)),sources_to_load)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cljs-sources","cljs-sources",31121610),(function (p__34983){
var map__34984 = p__34983;
var map__34984__$1 = cljs.core.__destructure_map(map__34984);
var msg__$1 = map__34984__$1;
var sources__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34984__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
try{shadow.cljs.devtools.client.browser.do_js_load(sources__$1);

if(cljs.core.seq(js_requires)){
shadow.cljs.devtools.client.browser.do_js_requires(js_requires);
} else {
}

return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(sources_to_load) : done.call(null, sources_to_load));
}catch (e34986){var ex = e34986;
return (error.cljs$core$IFn$_invoke$arity$1 ? error.cljs$core$IFn$_invoke$arity$1(ex) : error.call(null, ex));
}})], null));
}
}));

shadow.cljs.devtools.client.shared.add_plugin_BANG_(new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282),cljs.core.PersistentHashSet.EMPTY,(function (p__34987){
var map__34988 = p__34987;
var map__34988__$1 = cljs.core.__destructure_map(map__34988);
var env = map__34988__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34988__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var svc = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null);
shadow.remote.runtime.api.add_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125),(function (){
cljs.core.reset_BANG_(shadow.cljs.devtools.client.browser.ws_was_welcome_ref,true);

shadow.cljs.devtools.client.hud.connection_error_clear_BANG_();

shadow.cljs.devtools.client.env.patch_goog_BANG_();

return shadow.cljs.devtools.client.browser.devtools_msg(["#",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(new cljs.core.Keyword(null,"state-ref","state-ref",2127874952).cljs$core$IFn$_invoke$arity$1(runtime))))," ready!"].join(''));
}),new cljs.core.Keyword(null,"on-disconnect","on-disconnect",-809021814),(function (e){
if(cljs.core.truth_(cljs.core.deref(shadow.cljs.devtools.client.browser.ws_was_welcome_ref))){
shadow.cljs.devtools.client.hud.connection_error("The Websocket connection was closed!");

return cljs.core.reset_BANG_(shadow.cljs.devtools.client.browser.ws_was_welcome_ref,false);
} else {
return null;
}
}),new cljs.core.Keyword(null,"on-reconnect","on-reconnect",1239988702),(function (e){
return shadow.cljs.devtools.client.hud.connection_error("Reconnecting ...");
}),new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"access-denied","access-denied",959449406),(function (msg){
cljs.core.reset_BANG_(shadow.cljs.devtools.client.browser.ws_was_welcome_ref,false);

return shadow.cljs.devtools.client.hud.connection_error(["Stale Output! Your loaded JS was not produced by the running shadow-cljs instance."," Is the watch for this build running?"].join(''));
}),new cljs.core.Keyword(null,"cljs-asset-update","cljs-asset-update",1224093028),(function (msg){
return shadow.cljs.devtools.client.browser.handle_asset_update(msg);
}),new cljs.core.Keyword(null,"cljs-build-configure","cljs-build-configure",-2089891268),(function (msg){
return null;
}),new cljs.core.Keyword(null,"cljs-build-start","cljs-build-start",-725781241),(function (msg){
shadow.cljs.devtools.client.hud.hud_hide();

shadow.cljs.devtools.client.hud.load_start();

return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-start","build-start",-959649480)));
}),new cljs.core.Keyword(null,"cljs-build-complete","cljs-build-complete",273626153),(function (msg){
var msg__$1 = shadow.cljs.devtools.client.env.add_warnings_to_info(msg);
shadow.cljs.devtools.client.hud.connection_error_clear_BANG_();

shadow.cljs.devtools.client.hud.hud_warnings(msg__$1);

shadow.cljs.devtools.client.browser.handle_build_complete(runtime,msg__$1);

return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg__$1,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-complete","build-complete",-501868472)));
}),new cljs.core.Keyword(null,"cljs-build-failure","cljs-build-failure",1718154990),(function (msg){
shadow.cljs.devtools.client.hud.load_end();

shadow.cljs.devtools.client.hud.hud_error(msg);

return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-failure","build-failure",-2107487466)));
}),new cljs.core.Keyword("shadow.cljs.devtools.client.env","worker-notify","shadow.cljs.devtools.client.env/worker-notify",-1456820670),(function (p__34993){
var map__34994 = p__34993;
var map__34994__$1 = cljs.core.__destructure_map(map__34994);
var event_op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34994__$1,new cljs.core.Keyword(null,"event-op","event-op",200358057));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34994__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-disconnect","client-disconnect",640227957),event_op)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(client_id,shadow.cljs.devtools.client.env.worker_client_id)))){
shadow.cljs.devtools.client.hud.connection_error_clear_BANG_();

return shadow.cljs.devtools.client.hud.connection_error("The watch for this build was stopped!");
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-connect","client-connect",-1113973888),event_op)){
shadow.cljs.devtools.client.hud.connection_error_clear_BANG_();

return shadow.cljs.devtools.client.hud.connection_error("The watch for this build was restarted. Reload required!");
} else {
return null;
}
}
})], null)], null));

return svc;
}),(function (p__34996){
var map__34997 = p__34996;
var map__34997__$1 = cljs.core.__destructure_map(map__34997);
var svc = map__34997__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34997__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
return shadow.remote.runtime.api.del_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282));
}));

shadow.cljs.devtools.client.shared.init_runtime_BANG_(shadow.cljs.devtools.client.browser.client_info,shadow.cljs.devtools.client.websocket.start,shadow.cljs.devtools.client.websocket.send,shadow.cljs.devtools.client.websocket.stop);
} else {
}

//# sourceMappingURL=shadow.cljs.devtools.client.browser.js.map
