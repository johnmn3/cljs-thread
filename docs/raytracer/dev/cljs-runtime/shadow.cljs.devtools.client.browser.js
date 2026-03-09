goog.provide('shadow.cljs.devtools.client.browser');
shadow.cljs.devtools.client.browser.devtools_msg = (function shadow$cljs$devtools$client$browser$devtools_msg(var_args){
var args__5775__auto__ = [];
var len__5769__auto___35505 = arguments.length;
var i__5770__auto___35506 = (0);
while(true){
if((i__5770__auto___35506 < len__5769__auto___35505)){
args__5775__auto__.push((arguments[i__5770__auto___35506]));

var G__35507 = (i__5770__auto___35506 + (1));
i__5770__auto___35506 = G__35507;
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
(shadow.cljs.devtools.client.browser.devtools_msg.cljs$lang$applyTo = (function (seq34385){
var G__34386 = cljs.core.first(seq34385);
var seq34385__$1 = cljs.core.next(seq34385);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__34386,seq34385__$1);
}));

shadow.cljs.devtools.client.browser.script_eval = (function shadow$cljs$devtools$client$browser$script_eval(code){
return goog.globalEval(code);
});
shadow.cljs.devtools.client.browser.do_js_load = (function shadow$cljs$devtools$client$browser$do_js_load(sources){
var seq__34406 = cljs.core.seq(sources);
var chunk__34407 = null;
var count__34408 = (0);
var i__34409 = (0);
while(true){
if((i__34409 < count__34408)){
var map__34451 = chunk__34407.cljs$core$IIndexed$_nth$arity$2(null, i__34409);
var map__34451__$1 = cljs.core.__destructure_map(map__34451);
var src = map__34451__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34451__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34451__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34451__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34451__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34455){var e_35508 = e34455;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35508);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35508.message)].join('')));
}

var G__35509 = seq__34406;
var G__35510 = chunk__34407;
var G__35511 = count__34408;
var G__35512 = (i__34409 + (1));
seq__34406 = G__35509;
chunk__34407 = G__35510;
count__34408 = G__35511;
i__34409 = G__35512;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34406);
if(temp__5823__auto__){
var seq__34406__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34406__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34406__$1);
var G__35513 = cljs.core.chunk_rest(seq__34406__$1);
var G__35514 = c__5568__auto__;
var G__35515 = cljs.core.count(c__5568__auto__);
var G__35516 = (0);
seq__34406 = G__35513;
chunk__34407 = G__35514;
count__34408 = G__35515;
i__34409 = G__35516;
continue;
} else {
var map__34468 = cljs.core.first(seq__34406__$1);
var map__34468__$1 = cljs.core.__destructure_map(map__34468);
var src = map__34468__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34468__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34468__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34468__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34468__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34475){var e_35517 = e34475;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35517);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35517.message)].join('')));
}

var G__35518 = cljs.core.next(seq__34406__$1);
var G__35519 = null;
var G__35520 = (0);
var G__35521 = (0);
seq__34406 = G__35518;
chunk__34407 = G__35519;
count__34408 = G__35520;
i__34409 = G__35521;
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
var seq__34499 = cljs.core.seq(js_requires);
var chunk__34500 = null;
var count__34501 = (0);
var i__34502 = (0);
while(true){
if((i__34502 < count__34501)){
var js_ns = chunk__34500.cljs$core$IIndexed$_nth$arity$2(null, i__34502);
var require_str_35522 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35522);


var G__35523 = seq__34499;
var G__35524 = chunk__34500;
var G__35525 = count__34501;
var G__35526 = (i__34502 + (1));
seq__34499 = G__35523;
chunk__34500 = G__35524;
count__34501 = G__35525;
i__34502 = G__35526;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34499);
if(temp__5823__auto__){
var seq__34499__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34499__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34499__$1);
var G__35527 = cljs.core.chunk_rest(seq__34499__$1);
var G__35528 = c__5568__auto__;
var G__35529 = cljs.core.count(c__5568__auto__);
var G__35530 = (0);
seq__34499 = G__35527;
chunk__34500 = G__35528;
count__34501 = G__35529;
i__34502 = G__35530;
continue;
} else {
var js_ns = cljs.core.first(seq__34499__$1);
var require_str_35531 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35531);


var G__35532 = cljs.core.next(seq__34499__$1);
var G__35533 = null;
var G__35534 = (0);
var G__35535 = (0);
seq__34499 = G__35532;
chunk__34500 = G__35533;
count__34501 = G__35534;
i__34502 = G__35535;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.cljs.devtools.client.browser.handle_build_complete = (function shadow$cljs$devtools$client$browser$handle_build_complete(runtime,p__34538){
var map__34539 = p__34538;
var map__34539__$1 = cljs.core.__destructure_map(map__34539);
var msg = map__34539__$1;
var info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34539__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34539__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var warnings = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.distinct.cljs$core$IFn$_invoke$arity$1((function (){var iter__5523__auto__ = (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34542(s__34543){
return (new cljs.core.LazySeq(null,(function (){
var s__34543__$1 = s__34543;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__34543__$1);
if(temp__5823__auto__){
var xs__6383__auto__ = temp__5823__auto__;
var map__34555 = cljs.core.first(xs__6383__auto__);
var map__34555__$1 = cljs.core.__destructure_map(map__34555);
var src = map__34555__$1;
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34555__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var warnings = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34555__$1,new cljs.core.Keyword(null,"warnings","warnings",-735437651));
if(cljs.core.not(new cljs.core.Keyword(null,"from-jar","from-jar",1050932827).cljs$core$IFn$_invoke$arity$1(src))){
var iterys__5519__auto__ = ((function (s__34543__$1,map__34555,map__34555__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34539,map__34539__$1,msg,info,reload_info){
return (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34542_$_iter__34544(s__34545){
return (new cljs.core.LazySeq(null,((function (s__34543__$1,map__34555,map__34555__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34539,map__34539__$1,msg,info,reload_info){
return (function (){
var s__34545__$1 = s__34545;
while(true){
var temp__5823__auto____$1 = cljs.core.seq(s__34545__$1);
if(temp__5823__auto____$1){
var s__34545__$2 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__34545__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__34545__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__34547 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__34546 = (0);
while(true){
if((i__34546 < size__5522__auto__)){
var warning = cljs.core._nth(c__5521__auto__,i__34546);
cljs.core.chunk_append(b__34547,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name));

var G__35536 = (i__34546 + (1));
i__34546 = G__35536;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__34547),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34542_$_iter__34544(cljs.core.chunk_rest(s__34545__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__34547),null);
}
} else {
var warning = cljs.core.first(s__34545__$2);
return cljs.core.cons(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34542_$_iter__34544(cljs.core.rest(s__34545__$2)));
}
} else {
return null;
}
break;
}
});})(s__34543__$1,map__34555,map__34555__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34539,map__34539__$1,msg,info,reload_info))
,null,null));
});})(s__34543__$1,map__34555,map__34555__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34539,map__34539__$1,msg,info,reload_info))
;
var fs__5520__auto__ = cljs.core.seq(iterys__5519__auto__(warnings));
if(fs__5520__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__5520__auto__,shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34542(cljs.core.rest(s__34543__$1)));
} else {
var G__35537 = cljs.core.rest(s__34543__$1);
s__34543__$1 = G__35537;
continue;
}
} else {
var G__35538 = cljs.core.rest(s__34543__$1);
s__34543__$1 = G__35538;
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
var seq__34569_35539 = cljs.core.seq(warnings);
var chunk__34570_35540 = null;
var count__34571_35541 = (0);
var i__34572_35542 = (0);
while(true){
if((i__34572_35542 < count__34571_35541)){
var map__34576_35543 = chunk__34570_35540.cljs$core$IIndexed$_nth$arity$2(null, i__34572_35542);
var map__34576_35544__$1 = cljs.core.__destructure_map(map__34576_35543);
var w_35545 = map__34576_35544__$1;
var msg_35546__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34576_35544__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35547 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34576_35544__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35548 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34576_35544__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35549 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34576_35544__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35549)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35547),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35548),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35546__$1)].join(''));


var G__35550 = seq__34569_35539;
var G__35551 = chunk__34570_35540;
var G__35552 = count__34571_35541;
var G__35553 = (i__34572_35542 + (1));
seq__34569_35539 = G__35550;
chunk__34570_35540 = G__35551;
count__34571_35541 = G__35552;
i__34572_35542 = G__35553;
continue;
} else {
var temp__5823__auto___35554 = cljs.core.seq(seq__34569_35539);
if(temp__5823__auto___35554){
var seq__34569_35555__$1 = temp__5823__auto___35554;
if(cljs.core.chunked_seq_QMARK_(seq__34569_35555__$1)){
var c__5568__auto___35556 = cljs.core.chunk_first(seq__34569_35555__$1);
var G__35557 = cljs.core.chunk_rest(seq__34569_35555__$1);
var G__35558 = c__5568__auto___35556;
var G__35559 = cljs.core.count(c__5568__auto___35556);
var G__35560 = (0);
seq__34569_35539 = G__35557;
chunk__34570_35540 = G__35558;
count__34571_35541 = G__35559;
i__34572_35542 = G__35560;
continue;
} else {
var map__34578_35561 = cljs.core.first(seq__34569_35555__$1);
var map__34578_35562__$1 = cljs.core.__destructure_map(map__34578_35561);
var w_35563 = map__34578_35562__$1;
var msg_35564__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34578_35562__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35565 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34578_35562__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35566 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34578_35562__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35567 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34578_35562__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35567)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35565),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35566),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35564__$1)].join(''));


var G__35571 = cljs.core.next(seq__34569_35555__$1);
var G__35572 = null;
var G__35573 = (0);
var G__35574 = (0);
seq__34569_35539 = G__35571;
chunk__34570_35540 = G__35572;
count__34571_35541 = G__35573;
i__34572_35542 = G__35574;
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

return shadow.cljs.devtools.client.shared.load_sources(runtime,sources_to_get,(function (p1__34537_SHARP_){
return shadow.cljs.devtools.client.browser.do_js_reload(msg,p1__34537_SHARP_,shadow.cljs.devtools.client.hud.load_end_success,shadow.cljs.devtools.client.hud.load_failure);
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
shadow.cljs.devtools.client.browser.handle_asset_update = (function shadow$cljs$devtools$client$browser$handle_asset_update(p__34591){
var map__34592 = p__34591;
var map__34592__$1 = cljs.core.__destructure_map(map__34592);
var msg = map__34592__$1;
var updates = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592__$1,new cljs.core.Keyword(null,"updates","updates",2013983452));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34592__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var seq__34593 = cljs.core.seq(updates);
var chunk__34595 = null;
var count__34596 = (0);
var i__34597 = (0);
while(true){
if((i__34597 < count__34596)){
var path = chunk__34595.cljs$core$IIndexed$_nth$arity$2(null, i__34597);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__35031_35581 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__35035_35582 = null;
var count__35036_35583 = (0);
var i__35037_35584 = (0);
while(true){
if((i__35037_35584 < count__35036_35583)){
var node_35586 = chunk__35035_35582.cljs$core$IIndexed$_nth$arity$2(null, i__35037_35584);
if(cljs.core.not(node_35586.shadow$old)){
var path_match_35587 = shadow.cljs.devtools.client.browser.match_paths(node_35586.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35587)){
var new_link_35588 = (function (){var G__35198 = node_35586.cloneNode(true);
G__35198.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35587),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__35198;
})();
(node_35586.shadow$old = true);

(new_link_35588.onload = ((function (seq__35031_35581,chunk__35035_35582,count__35036_35583,i__35037_35584,seq__34593,chunk__34595,count__34596,i__34597,new_link_35588,path_match_35587,node_35586,path,map__34592,map__34592__$1,msg,updates,reload_info){
return (function (e){
var seq__35199_35595 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__35201_35596 = null;
var count__35202_35597 = (0);
var i__35203_35598 = (0);
while(true){
if((i__35203_35598 < count__35202_35597)){
var map__35220_35606 = chunk__35201_35596.cljs$core$IIndexed$_nth$arity$2(null, i__35203_35598);
var map__35220_35607__$1 = cljs.core.__destructure_map(map__35220_35606);
var task_35608 = map__35220_35607__$1;
var fn_str_35609 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35220_35607__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35610 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35220_35607__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35611 = goog.getObjectByName(fn_str_35609,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35610)].join(''));

(fn_obj_35611.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35611.cljs$core$IFn$_invoke$arity$2(path,new_link_35588) : fn_obj_35611.call(null, path,new_link_35588));


var G__35612 = seq__35199_35595;
var G__35613 = chunk__35201_35596;
var G__35614 = count__35202_35597;
var G__35615 = (i__35203_35598 + (1));
seq__35199_35595 = G__35612;
chunk__35201_35596 = G__35613;
count__35202_35597 = G__35614;
i__35203_35598 = G__35615;
continue;
} else {
var temp__5823__auto___35620 = cljs.core.seq(seq__35199_35595);
if(temp__5823__auto___35620){
var seq__35199_35621__$1 = temp__5823__auto___35620;
if(cljs.core.chunked_seq_QMARK_(seq__35199_35621__$1)){
var c__5568__auto___35622 = cljs.core.chunk_first(seq__35199_35621__$1);
var G__35623 = cljs.core.chunk_rest(seq__35199_35621__$1);
var G__35624 = c__5568__auto___35622;
var G__35625 = cljs.core.count(c__5568__auto___35622);
var G__35626 = (0);
seq__35199_35595 = G__35623;
chunk__35201_35596 = G__35624;
count__35202_35597 = G__35625;
i__35203_35598 = G__35626;
continue;
} else {
var map__35232_35628 = cljs.core.first(seq__35199_35621__$1);
var map__35232_35629__$1 = cljs.core.__destructure_map(map__35232_35628);
var task_35630 = map__35232_35629__$1;
var fn_str_35631 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35232_35629__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35632 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35232_35629__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35633 = goog.getObjectByName(fn_str_35631,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35632)].join(''));

(fn_obj_35633.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35633.cljs$core$IFn$_invoke$arity$2(path,new_link_35588) : fn_obj_35633.call(null, path,new_link_35588));


var G__35634 = cljs.core.next(seq__35199_35621__$1);
var G__35635 = null;
var G__35636 = (0);
var G__35637 = (0);
seq__35199_35595 = G__35634;
chunk__35201_35596 = G__35635;
count__35202_35597 = G__35636;
i__35203_35598 = G__35637;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35586);
});})(seq__35031_35581,chunk__35035_35582,count__35036_35583,i__35037_35584,seq__34593,chunk__34595,count__34596,i__34597,new_link_35588,path_match_35587,node_35586,path,map__34592,map__34592__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35587], 0));

goog.dom.insertSiblingAfter(new_link_35588,node_35586);


var G__35638 = seq__35031_35581;
var G__35639 = chunk__35035_35582;
var G__35640 = count__35036_35583;
var G__35641 = (i__35037_35584 + (1));
seq__35031_35581 = G__35638;
chunk__35035_35582 = G__35639;
count__35036_35583 = G__35640;
i__35037_35584 = G__35641;
continue;
} else {
var G__35642 = seq__35031_35581;
var G__35643 = chunk__35035_35582;
var G__35644 = count__35036_35583;
var G__35645 = (i__35037_35584 + (1));
seq__35031_35581 = G__35642;
chunk__35035_35582 = G__35643;
count__35036_35583 = G__35644;
i__35037_35584 = G__35645;
continue;
}
} else {
var G__35646 = seq__35031_35581;
var G__35647 = chunk__35035_35582;
var G__35648 = count__35036_35583;
var G__35649 = (i__35037_35584 + (1));
seq__35031_35581 = G__35646;
chunk__35035_35582 = G__35647;
count__35036_35583 = G__35648;
i__35037_35584 = G__35649;
continue;
}
} else {
var temp__5823__auto___35650 = cljs.core.seq(seq__35031_35581);
if(temp__5823__auto___35650){
var seq__35031_35651__$1 = temp__5823__auto___35650;
if(cljs.core.chunked_seq_QMARK_(seq__35031_35651__$1)){
var c__5568__auto___35653 = cljs.core.chunk_first(seq__35031_35651__$1);
var G__35654 = cljs.core.chunk_rest(seq__35031_35651__$1);
var G__35655 = c__5568__auto___35653;
var G__35656 = cljs.core.count(c__5568__auto___35653);
var G__35657 = (0);
seq__35031_35581 = G__35654;
chunk__35035_35582 = G__35655;
count__35036_35583 = G__35656;
i__35037_35584 = G__35657;
continue;
} else {
var node_35658 = cljs.core.first(seq__35031_35651__$1);
if(cljs.core.not(node_35658.shadow$old)){
var path_match_35659 = shadow.cljs.devtools.client.browser.match_paths(node_35658.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35659)){
var new_link_35660 = (function (){var G__35238 = node_35658.cloneNode(true);
G__35238.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35659),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__35238;
})();
(node_35658.shadow$old = true);

(new_link_35660.onload = ((function (seq__35031_35581,chunk__35035_35582,count__35036_35583,i__35037_35584,seq__34593,chunk__34595,count__34596,i__34597,new_link_35660,path_match_35659,node_35658,seq__35031_35651__$1,temp__5823__auto___35650,path,map__34592,map__34592__$1,msg,updates,reload_info){
return (function (e){
var seq__35241_35661 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__35243_35662 = null;
var count__35244_35663 = (0);
var i__35245_35664 = (0);
while(true){
if((i__35245_35664 < count__35244_35663)){
var map__35263_35665 = chunk__35243_35662.cljs$core$IIndexed$_nth$arity$2(null, i__35245_35664);
var map__35263_35666__$1 = cljs.core.__destructure_map(map__35263_35665);
var task_35667 = map__35263_35666__$1;
var fn_str_35668 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35263_35666__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35669 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35263_35666__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35670 = goog.getObjectByName(fn_str_35668,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35669)].join(''));

(fn_obj_35670.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35670.cljs$core$IFn$_invoke$arity$2(path,new_link_35660) : fn_obj_35670.call(null, path,new_link_35660));


var G__35671 = seq__35241_35661;
var G__35672 = chunk__35243_35662;
var G__35673 = count__35244_35663;
var G__35674 = (i__35245_35664 + (1));
seq__35241_35661 = G__35671;
chunk__35243_35662 = G__35672;
count__35244_35663 = G__35673;
i__35245_35664 = G__35674;
continue;
} else {
var temp__5823__auto___35675__$1 = cljs.core.seq(seq__35241_35661);
if(temp__5823__auto___35675__$1){
var seq__35241_35676__$1 = temp__5823__auto___35675__$1;
if(cljs.core.chunked_seq_QMARK_(seq__35241_35676__$1)){
var c__5568__auto___35678 = cljs.core.chunk_first(seq__35241_35676__$1);
var G__35680 = cljs.core.chunk_rest(seq__35241_35676__$1);
var G__35681 = c__5568__auto___35678;
var G__35682 = cljs.core.count(c__5568__auto___35678);
var G__35683 = (0);
seq__35241_35661 = G__35680;
chunk__35243_35662 = G__35681;
count__35244_35663 = G__35682;
i__35245_35664 = G__35683;
continue;
} else {
var map__35274_35684 = cljs.core.first(seq__35241_35676__$1);
var map__35274_35685__$1 = cljs.core.__destructure_map(map__35274_35684);
var task_35686 = map__35274_35685__$1;
var fn_str_35687 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35274_35685__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35688 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35274_35685__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35691 = goog.getObjectByName(fn_str_35687,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35688)].join(''));

(fn_obj_35691.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35691.cljs$core$IFn$_invoke$arity$2(path,new_link_35660) : fn_obj_35691.call(null, path,new_link_35660));


var G__35692 = cljs.core.next(seq__35241_35676__$1);
var G__35693 = null;
var G__35694 = (0);
var G__35695 = (0);
seq__35241_35661 = G__35692;
chunk__35243_35662 = G__35693;
count__35244_35663 = G__35694;
i__35245_35664 = G__35695;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35658);
});})(seq__35031_35581,chunk__35035_35582,count__35036_35583,i__35037_35584,seq__34593,chunk__34595,count__34596,i__34597,new_link_35660,path_match_35659,node_35658,seq__35031_35651__$1,temp__5823__auto___35650,path,map__34592,map__34592__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35659], 0));

goog.dom.insertSiblingAfter(new_link_35660,node_35658);


var G__35696 = cljs.core.next(seq__35031_35651__$1);
var G__35697 = null;
var G__35698 = (0);
var G__35699 = (0);
seq__35031_35581 = G__35696;
chunk__35035_35582 = G__35697;
count__35036_35583 = G__35698;
i__35037_35584 = G__35699;
continue;
} else {
var G__35700 = cljs.core.next(seq__35031_35651__$1);
var G__35701 = null;
var G__35702 = (0);
var G__35703 = (0);
seq__35031_35581 = G__35700;
chunk__35035_35582 = G__35701;
count__35036_35583 = G__35702;
i__35037_35584 = G__35703;
continue;
}
} else {
var G__35704 = cljs.core.next(seq__35031_35651__$1);
var G__35705 = null;
var G__35706 = (0);
var G__35707 = (0);
seq__35031_35581 = G__35704;
chunk__35035_35582 = G__35705;
count__35036_35583 = G__35706;
i__35037_35584 = G__35707;
continue;
}
}
} else {
}
}
break;
}


var G__35708 = seq__34593;
var G__35709 = chunk__34595;
var G__35710 = count__34596;
var G__35711 = (i__34597 + (1));
seq__34593 = G__35708;
chunk__34595 = G__35709;
count__34596 = G__35710;
i__34597 = G__35711;
continue;
} else {
var G__35712 = seq__34593;
var G__35713 = chunk__34595;
var G__35714 = count__34596;
var G__35715 = (i__34597 + (1));
seq__34593 = G__35712;
chunk__34595 = G__35713;
count__34596 = G__35714;
i__34597 = G__35715;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34593);
if(temp__5823__auto__){
var seq__34593__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34593__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34593__$1);
var G__35716 = cljs.core.chunk_rest(seq__34593__$1);
var G__35717 = c__5568__auto__;
var G__35718 = cljs.core.count(c__5568__auto__);
var G__35719 = (0);
seq__34593 = G__35716;
chunk__34595 = G__35717;
count__34596 = G__35718;
i__34597 = G__35719;
continue;
} else {
var path = cljs.core.first(seq__34593__$1);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__35283_35720 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__35287_35721 = null;
var count__35288_35722 = (0);
var i__35289_35723 = (0);
while(true){
if((i__35289_35723 < count__35288_35722)){
var node_35725 = chunk__35287_35721.cljs$core$IIndexed$_nth$arity$2(null, i__35289_35723);
if(cljs.core.not(node_35725.shadow$old)){
var path_match_35727 = shadow.cljs.devtools.client.browser.match_paths(node_35725.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35727)){
var new_link_35728 = (function (){var G__35361 = node_35725.cloneNode(true);
G__35361.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35727),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__35361;
})();
(node_35725.shadow$old = true);

(new_link_35728.onload = ((function (seq__35283_35720,chunk__35287_35721,count__35288_35722,i__35289_35723,seq__34593,chunk__34595,count__34596,i__34597,new_link_35728,path_match_35727,node_35725,path,seq__34593__$1,temp__5823__auto__,map__34592,map__34592__$1,msg,updates,reload_info){
return (function (e){
var seq__35362_35732 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__35364_35733 = null;
var count__35365_35734 = (0);
var i__35366_35735 = (0);
while(true){
if((i__35366_35735 < count__35365_35734)){
var map__35392_35737 = chunk__35364_35733.cljs$core$IIndexed$_nth$arity$2(null, i__35366_35735);
var map__35392_35738__$1 = cljs.core.__destructure_map(map__35392_35737);
var task_35739 = map__35392_35738__$1;
var fn_str_35740 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35392_35738__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35741 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35392_35738__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35742 = goog.getObjectByName(fn_str_35740,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35741)].join(''));

(fn_obj_35742.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35742.cljs$core$IFn$_invoke$arity$2(path,new_link_35728) : fn_obj_35742.call(null, path,new_link_35728));


var G__35743 = seq__35362_35732;
var G__35744 = chunk__35364_35733;
var G__35745 = count__35365_35734;
var G__35746 = (i__35366_35735 + (1));
seq__35362_35732 = G__35743;
chunk__35364_35733 = G__35744;
count__35365_35734 = G__35745;
i__35366_35735 = G__35746;
continue;
} else {
var temp__5823__auto___35747__$1 = cljs.core.seq(seq__35362_35732);
if(temp__5823__auto___35747__$1){
var seq__35362_35748__$1 = temp__5823__auto___35747__$1;
if(cljs.core.chunked_seq_QMARK_(seq__35362_35748__$1)){
var c__5568__auto___35749 = cljs.core.chunk_first(seq__35362_35748__$1);
var G__35750 = cljs.core.chunk_rest(seq__35362_35748__$1);
var G__35751 = c__5568__auto___35749;
var G__35752 = cljs.core.count(c__5568__auto___35749);
var G__35753 = (0);
seq__35362_35732 = G__35750;
chunk__35364_35733 = G__35751;
count__35365_35734 = G__35752;
i__35366_35735 = G__35753;
continue;
} else {
var map__35400_35754 = cljs.core.first(seq__35362_35748__$1);
var map__35400_35755__$1 = cljs.core.__destructure_map(map__35400_35754);
var task_35756 = map__35400_35755__$1;
var fn_str_35757 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35400_35755__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35758 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35400_35755__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35759 = goog.getObjectByName(fn_str_35757,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35758)].join(''));

(fn_obj_35759.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35759.cljs$core$IFn$_invoke$arity$2(path,new_link_35728) : fn_obj_35759.call(null, path,new_link_35728));


var G__35760 = cljs.core.next(seq__35362_35748__$1);
var G__35761 = null;
var G__35762 = (0);
var G__35763 = (0);
seq__35362_35732 = G__35760;
chunk__35364_35733 = G__35761;
count__35365_35734 = G__35762;
i__35366_35735 = G__35763;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35725);
});})(seq__35283_35720,chunk__35287_35721,count__35288_35722,i__35289_35723,seq__34593,chunk__34595,count__34596,i__34597,new_link_35728,path_match_35727,node_35725,path,seq__34593__$1,temp__5823__auto__,map__34592,map__34592__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35727], 0));

goog.dom.insertSiblingAfter(new_link_35728,node_35725);


var G__35764 = seq__35283_35720;
var G__35765 = chunk__35287_35721;
var G__35766 = count__35288_35722;
var G__35767 = (i__35289_35723 + (1));
seq__35283_35720 = G__35764;
chunk__35287_35721 = G__35765;
count__35288_35722 = G__35766;
i__35289_35723 = G__35767;
continue;
} else {
var G__35768 = seq__35283_35720;
var G__35769 = chunk__35287_35721;
var G__35770 = count__35288_35722;
var G__35771 = (i__35289_35723 + (1));
seq__35283_35720 = G__35768;
chunk__35287_35721 = G__35769;
count__35288_35722 = G__35770;
i__35289_35723 = G__35771;
continue;
}
} else {
var G__35774 = seq__35283_35720;
var G__35775 = chunk__35287_35721;
var G__35776 = count__35288_35722;
var G__35777 = (i__35289_35723 + (1));
seq__35283_35720 = G__35774;
chunk__35287_35721 = G__35775;
count__35288_35722 = G__35776;
i__35289_35723 = G__35777;
continue;
}
} else {
var temp__5823__auto___35778__$1 = cljs.core.seq(seq__35283_35720);
if(temp__5823__auto___35778__$1){
var seq__35283_35779__$1 = temp__5823__auto___35778__$1;
if(cljs.core.chunked_seq_QMARK_(seq__35283_35779__$1)){
var c__5568__auto___35780 = cljs.core.chunk_first(seq__35283_35779__$1);
var G__35781 = cljs.core.chunk_rest(seq__35283_35779__$1);
var G__35782 = c__5568__auto___35780;
var G__35783 = cljs.core.count(c__5568__auto___35780);
var G__35784 = (0);
seq__35283_35720 = G__35781;
chunk__35287_35721 = G__35782;
count__35288_35722 = G__35783;
i__35289_35723 = G__35784;
continue;
} else {
var node_35785 = cljs.core.first(seq__35283_35779__$1);
if(cljs.core.not(node_35785.shadow$old)){
var path_match_35787 = shadow.cljs.devtools.client.browser.match_paths(node_35785.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35787)){
var new_link_35789 = (function (){var G__35405 = node_35785.cloneNode(true);
G__35405.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35787),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__35405;
})();
(node_35785.shadow$old = true);

(new_link_35789.onload = ((function (seq__35283_35720,chunk__35287_35721,count__35288_35722,i__35289_35723,seq__34593,chunk__34595,count__34596,i__34597,new_link_35789,path_match_35787,node_35785,seq__35283_35779__$1,temp__5823__auto___35778__$1,path,seq__34593__$1,temp__5823__auto__,map__34592,map__34592__$1,msg,updates,reload_info){
return (function (e){
var seq__35407_35792 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__35409_35793 = null;
var count__35410_35794 = (0);
var i__35411_35795 = (0);
while(true){
if((i__35411_35795 < count__35410_35794)){
var map__35421_35796 = chunk__35409_35793.cljs$core$IIndexed$_nth$arity$2(null, i__35411_35795);
var map__35421_35797__$1 = cljs.core.__destructure_map(map__35421_35796);
var task_35798 = map__35421_35797__$1;
var fn_str_35799 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35421_35797__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35800 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35421_35797__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35801 = goog.getObjectByName(fn_str_35799,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35800)].join(''));

(fn_obj_35801.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35801.cljs$core$IFn$_invoke$arity$2(path,new_link_35789) : fn_obj_35801.call(null, path,new_link_35789));


var G__35802 = seq__35407_35792;
var G__35803 = chunk__35409_35793;
var G__35804 = count__35410_35794;
var G__35805 = (i__35411_35795 + (1));
seq__35407_35792 = G__35802;
chunk__35409_35793 = G__35803;
count__35410_35794 = G__35804;
i__35411_35795 = G__35805;
continue;
} else {
var temp__5823__auto___35806__$2 = cljs.core.seq(seq__35407_35792);
if(temp__5823__auto___35806__$2){
var seq__35407_35807__$1 = temp__5823__auto___35806__$2;
if(cljs.core.chunked_seq_QMARK_(seq__35407_35807__$1)){
var c__5568__auto___35808 = cljs.core.chunk_first(seq__35407_35807__$1);
var G__35809 = cljs.core.chunk_rest(seq__35407_35807__$1);
var G__35810 = c__5568__auto___35808;
var G__35811 = cljs.core.count(c__5568__auto___35808);
var G__35812 = (0);
seq__35407_35792 = G__35809;
chunk__35409_35793 = G__35810;
count__35410_35794 = G__35811;
i__35411_35795 = G__35812;
continue;
} else {
var map__35425_35813 = cljs.core.first(seq__35407_35807__$1);
var map__35425_35814__$1 = cljs.core.__destructure_map(map__35425_35813);
var task_35815 = map__35425_35814__$1;
var fn_str_35816 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35425_35814__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35817 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35425_35814__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35819 = goog.getObjectByName(fn_str_35816,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35817)].join(''));

(fn_obj_35819.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35819.cljs$core$IFn$_invoke$arity$2(path,new_link_35789) : fn_obj_35819.call(null, path,new_link_35789));


var G__35821 = cljs.core.next(seq__35407_35807__$1);
var G__35822 = null;
var G__35823 = (0);
var G__35824 = (0);
seq__35407_35792 = G__35821;
chunk__35409_35793 = G__35822;
count__35410_35794 = G__35823;
i__35411_35795 = G__35824;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35785);
});})(seq__35283_35720,chunk__35287_35721,count__35288_35722,i__35289_35723,seq__34593,chunk__34595,count__34596,i__34597,new_link_35789,path_match_35787,node_35785,seq__35283_35779__$1,temp__5823__auto___35778__$1,path,seq__34593__$1,temp__5823__auto__,map__34592,map__34592__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35787], 0));

goog.dom.insertSiblingAfter(new_link_35789,node_35785);


var G__35827 = cljs.core.next(seq__35283_35779__$1);
var G__35828 = null;
var G__35829 = (0);
var G__35830 = (0);
seq__35283_35720 = G__35827;
chunk__35287_35721 = G__35828;
count__35288_35722 = G__35829;
i__35289_35723 = G__35830;
continue;
} else {
var G__35831 = cljs.core.next(seq__35283_35779__$1);
var G__35832 = null;
var G__35833 = (0);
var G__35834 = (0);
seq__35283_35720 = G__35831;
chunk__35287_35721 = G__35832;
count__35288_35722 = G__35833;
i__35289_35723 = G__35834;
continue;
}
} else {
var G__35835 = cljs.core.next(seq__35283_35779__$1);
var G__35836 = null;
var G__35837 = (0);
var G__35838 = (0);
seq__35283_35720 = G__35835;
chunk__35287_35721 = G__35836;
count__35288_35722 = G__35837;
i__35289_35723 = G__35838;
continue;
}
}
} else {
}
}
break;
}


var G__35839 = cljs.core.next(seq__34593__$1);
var G__35840 = null;
var G__35841 = (0);
var G__35842 = (0);
seq__34593 = G__35839;
chunk__34595 = G__35840;
count__34596 = G__35841;
i__34597 = G__35842;
continue;
} else {
var G__35843 = cljs.core.next(seq__34593__$1);
var G__35844 = null;
var G__35845 = (0);
var G__35846 = (0);
seq__34593 = G__35843;
chunk__34595 = G__35844;
count__34596 = G__35845;
i__34597 = G__35846;
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

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_invoke$arity$3 = (function (this$,ns,p__35462){
var map__35463 = p__35462;
var map__35463__$1 = cljs.core.__destructure_map(map__35463);
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35463__$1,new cljs.core.Keyword(null,"js","js",1768080579));
var this$__$1 = this;
return shadow.cljs.devtools.client.browser.global_eval(js);
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_init$arity$4 = (function (runtime,p__35465,done,error){
var map__35466 = p__35465;
var map__35466__$1 = cljs.core.__destructure_map(map__35466);
var repl_sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35466__$1,new cljs.core.Keyword(null,"repl-sources","repl-sources",723867535));
var runtime__$1 = this;
return shadow.cljs.devtools.client.shared.load_sources(runtime__$1,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(shadow.cljs.devtools.client.env.src_is_loaded_QMARK_,repl_sources)),(function (sources){
shadow.cljs.devtools.client.browser.do_js_load(sources);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null, ));
}));
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_require$arity$4 = (function (runtime,p__35468,done,error){
var map__35469 = p__35468;
var map__35469__$1 = cljs.core.__destructure_map(map__35469);
var msg = map__35469__$1;
var sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35469__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
var reload_namespaces = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35469__$1,new cljs.core.Keyword(null,"reload-namespaces","reload-namespaces",250210134));
var js_requires = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35469__$1,new cljs.core.Keyword(null,"js-requires","js-requires",-1311472051));
var runtime__$1 = this;
var sources_to_load = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__35471){
var map__35472 = p__35471;
var map__35472__$1 = cljs.core.__destructure_map(map__35472);
var src = map__35472__$1;
var provides = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35472__$1,new cljs.core.Keyword(null,"provides","provides",-1634397992));
var and__5043__auto__ = shadow.cljs.devtools.client.env.src_is_loaded_QMARK_(src);
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs.core.some(reload_namespaces,provides));
} else {
return and__5043__auto__;
}
}),sources));
if(cljs.core.not(cljs.core.seq(sources_to_load))){
var G__35473 = cljs.core.PersistentVector.EMPTY;
return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(G__35473) : done.call(null, G__35473));
} else {
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3(runtime__$1,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"cljs-load-sources","cljs-load-sources",-1458295962),new cljs.core.Keyword(null,"to","to",192099007),shadow.cljs.devtools.client.env.worker_client_id,new cljs.core.Keyword(null,"sources","sources",-321166424),cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582)),sources_to_load)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cljs-sources","cljs-sources",31121610),(function (p__35475){
var map__35476 = p__35475;
var map__35476__$1 = cljs.core.__destructure_map(map__35476);
var msg__$1 = map__35476__$1;
var sources__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35476__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
try{shadow.cljs.devtools.client.browser.do_js_load(sources__$1);

if(cljs.core.seq(js_requires)){
shadow.cljs.devtools.client.browser.do_js_requires(js_requires);
} else {
}

return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(sources_to_load) : done.call(null, sources_to_load));
}catch (e35477){var ex = e35477;
return (error.cljs$core$IFn$_invoke$arity$1 ? error.cljs$core$IFn$_invoke$arity$1(ex) : error.call(null, ex));
}})], null));
}
}));

shadow.cljs.devtools.client.shared.add_plugin_BANG_(new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282),cljs.core.PersistentHashSet.EMPTY,(function (p__35478){
var map__35479 = p__35478;
var map__35479__$1 = cljs.core.__destructure_map(map__35479);
var env = map__35479__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35479__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
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
}),new cljs.core.Keyword("shadow.cljs.devtools.client.env","worker-notify","shadow.cljs.devtools.client.env/worker-notify",-1456820670),(function (p__35497){
var map__35498 = p__35497;
var map__35498__$1 = cljs.core.__destructure_map(map__35498);
var event_op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35498__$1,new cljs.core.Keyword(null,"event-op","event-op",200358057));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35498__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
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
}),(function (p__35503){
var map__35504 = p__35503;
var map__35504__$1 = cljs.core.__destructure_map(map__35504);
var svc = map__35504__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35504__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
return shadow.remote.runtime.api.del_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282));
}));

shadow.cljs.devtools.client.shared.init_runtime_BANG_(shadow.cljs.devtools.client.browser.client_info,shadow.cljs.devtools.client.websocket.start,shadow.cljs.devtools.client.websocket.send,shadow.cljs.devtools.client.websocket.stop);
} else {
}

//# sourceMappingURL=shadow.cljs.devtools.client.browser.js.map
