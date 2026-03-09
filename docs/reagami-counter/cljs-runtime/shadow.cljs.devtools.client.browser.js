goog.provide('shadow.cljs.devtools.client.browser');
shadow.cljs.devtools.client.browser.devtools_msg = (function shadow$cljs$devtools$client$browser$devtools_msg(var_args){
var args__5775__auto__ = [];
var len__5769__auto___35176 = arguments.length;
var i__5770__auto___35178 = (0);
while(true){
if((i__5770__auto___35178 < len__5769__auto___35176)){
args__5775__auto__.push((arguments[i__5770__auto___35178]));

var G__35179 = (i__5770__auto___35178 + (1));
i__5770__auto___35178 = G__35179;
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
(shadow.cljs.devtools.client.browser.devtools_msg.cljs$lang$applyTo = (function (seq34356){
var G__34357 = cljs.core.first(seq34356);
var seq34356__$1 = cljs.core.next(seq34356);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__34357,seq34356__$1);
}));

shadow.cljs.devtools.client.browser.script_eval = (function shadow$cljs$devtools$client$browser$script_eval(code){
return goog.globalEval(code);
});
shadow.cljs.devtools.client.browser.do_js_load = (function shadow$cljs$devtools$client$browser$do_js_load(sources){
var seq__34373 = cljs.core.seq(sources);
var chunk__34374 = null;
var count__34375 = (0);
var i__34376 = (0);
while(true){
if((i__34376 < count__34375)){
var map__34411 = chunk__34374.cljs$core$IIndexed$_nth$arity$2(null, i__34376);
var map__34411__$1 = cljs.core.__destructure_map(map__34411);
var src = map__34411__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34411__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34411__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34411__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34411__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34416){var e_35183 = e34416;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35183);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35183.message)].join('')));
}

var G__35184 = seq__34373;
var G__35185 = chunk__34374;
var G__35186 = count__34375;
var G__35187 = (i__34376 + (1));
seq__34373 = G__35184;
chunk__34374 = G__35185;
count__34375 = G__35186;
i__34376 = G__35187;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34373);
if(temp__5823__auto__){
var seq__34373__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34373__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34373__$1);
var G__35190 = cljs.core.chunk_rest(seq__34373__$1);
var G__35191 = c__5568__auto__;
var G__35192 = cljs.core.count(c__5568__auto__);
var G__35193 = (0);
seq__34373 = G__35190;
chunk__34374 = G__35191;
count__34375 = G__35192;
i__34376 = G__35193;
continue;
} else {
var map__34423 = cljs.core.first(seq__34373__$1);
var map__34423__$1 = cljs.core.__destructure_map(map__34423);
var src = map__34423__$1;
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34423__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34423__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34423__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34423__$1,new cljs.core.Keyword(null,"js","js",1768080579));
$CLJS.SHADOW_ENV.setLoaded(output_name);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load JS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([resource_name], 0));

shadow.cljs.devtools.client.env.before_load_src(src);

try{shadow.cljs.devtools.client.browser.script_eval([cljs.core.str.cljs$core$IFn$_invoke$arity$1(js),"\n//# sourceURL=",cljs.core.str.cljs$core$IFn$_invoke$arity$1($CLJS.SHADOW_ENV.scriptBase),cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)].join(''));
}catch (e34427){var e_35194 = e34427;
if(shadow.cljs.devtools.client.env.log){
console.error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name)].join(''),e_35194);
} else {
}

throw (new Error(["Failed to load ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e_35194.message)].join('')));
}

var G__35198 = cljs.core.next(seq__34373__$1);
var G__35199 = null;
var G__35200 = (0);
var G__35201 = (0);
seq__34373 = G__35198;
chunk__34374 = G__35199;
count__34375 = G__35200;
i__34376 = G__35201;
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
var seq__34450 = cljs.core.seq(js_requires);
var chunk__34451 = null;
var count__34452 = (0);
var i__34453 = (0);
while(true){
if((i__34453 < count__34452)){
var js_ns = chunk__34451.cljs$core$IIndexed$_nth$arity$2(null, i__34453);
var require_str_35204 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35204);


var G__35205 = seq__34450;
var G__35206 = chunk__34451;
var G__35207 = count__34452;
var G__35208 = (i__34453 + (1));
seq__34450 = G__35205;
chunk__34451 = G__35206;
count__34452 = G__35207;
i__34453 = G__35208;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34450);
if(temp__5823__auto__){
var seq__34450__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34450__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34450__$1);
var G__35210 = cljs.core.chunk_rest(seq__34450__$1);
var G__35211 = c__5568__auto__;
var G__35212 = cljs.core.count(c__5568__auto__);
var G__35213 = (0);
seq__34450 = G__35210;
chunk__34451 = G__35211;
count__34452 = G__35212;
i__34453 = G__35213;
continue;
} else {
var js_ns = cljs.core.first(seq__34450__$1);
var require_str_35216 = ["var ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns)," = shadow.js.require(\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(js_ns),"\");"].join('');
shadow.cljs.devtools.client.browser.script_eval(require_str_35216);


var G__35217 = cljs.core.next(seq__34450__$1);
var G__35218 = null;
var G__35219 = (0);
var G__35220 = (0);
seq__34450 = G__35217;
chunk__34451 = G__35218;
count__34452 = G__35219;
i__34453 = G__35220;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.cljs.devtools.client.browser.handle_build_complete = (function shadow$cljs$devtools$client$browser$handle_build_complete(runtime,p__34483){
var map__34486 = p__34483;
var map__34486__$1 = cljs.core.__destructure_map(map__34486);
var msg = map__34486__$1;
var info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34486__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34486__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var warnings = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.distinct.cljs$core$IFn$_invoke$arity$1((function (){var iter__5523__auto__ = (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34491(s__34492){
return (new cljs.core.LazySeq(null,(function (){
var s__34492__$1 = s__34492;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__34492__$1);
if(temp__5823__auto__){
var xs__6383__auto__ = temp__5823__auto__;
var map__34500 = cljs.core.first(xs__6383__auto__);
var map__34500__$1 = cljs.core.__destructure_map(map__34500);
var src = map__34500__$1;
var resource_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34500__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
var warnings = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34500__$1,new cljs.core.Keyword(null,"warnings","warnings",-735437651));
if(cljs.core.not(new cljs.core.Keyword(null,"from-jar","from-jar",1050932827).cljs$core$IFn$_invoke$arity$1(src))){
var iterys__5519__auto__ = ((function (s__34492__$1,map__34500,map__34500__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34486,map__34486__$1,msg,info,reload_info){
return (function shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34491_$_iter__34493(s__34494){
return (new cljs.core.LazySeq(null,((function (s__34492__$1,map__34500,map__34500__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34486,map__34486__$1,msg,info,reload_info){
return (function (){
var s__34494__$1 = s__34494;
while(true){
var temp__5823__auto____$1 = cljs.core.seq(s__34494__$1);
if(temp__5823__auto____$1){
var s__34494__$2 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__34494__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__34494__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__34496 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__34495 = (0);
while(true){
if((i__34495 < size__5522__auto__)){
var warning = cljs.core._nth(c__5521__auto__,i__34495);
cljs.core.chunk_append(b__34496,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name));

var G__35236 = (i__34495 + (1));
i__34495 = G__35236;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__34496),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34491_$_iter__34493(cljs.core.chunk_rest(s__34494__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__34496),null);
}
} else {
var warning = cljs.core.first(s__34494__$2);
return cljs.core.cons(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(warning,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100),resource_name),shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34491_$_iter__34493(cljs.core.rest(s__34494__$2)));
}
} else {
return null;
}
break;
}
});})(s__34492__$1,map__34500,map__34500__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34486,map__34486__$1,msg,info,reload_info))
,null,null));
});})(s__34492__$1,map__34500,map__34500__$1,src,resource_name,warnings,xs__6383__auto__,temp__5823__auto__,map__34486,map__34486__$1,msg,info,reload_info))
;
var fs__5520__auto__ = cljs.core.seq(iterys__5519__auto__(warnings));
if(fs__5520__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__5520__auto__,shadow$cljs$devtools$client$browser$handle_build_complete_$_iter__34491(cljs.core.rest(s__34492__$1)));
} else {
var G__35237 = cljs.core.rest(s__34492__$1);
s__34492__$1 = G__35237;
continue;
}
} else {
var G__35238 = cljs.core.rest(s__34492__$1);
s__34492__$1 = G__35238;
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
var seq__34523_35239 = cljs.core.seq(warnings);
var chunk__34524_35240 = null;
var count__34525_35241 = (0);
var i__34526_35242 = (0);
while(true){
if((i__34526_35242 < count__34525_35241)){
var map__34542_35243 = chunk__34524_35240.cljs$core$IIndexed$_nth$arity$2(null, i__34526_35242);
var map__34542_35244__$1 = cljs.core.__destructure_map(map__34542_35243);
var w_35245 = map__34542_35244__$1;
var msg_35246__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34542_35244__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35247 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34542_35244__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35248 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34542_35244__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35249 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34542_35244__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35249)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35247),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35248),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35246__$1)].join(''));


var G__35251 = seq__34523_35239;
var G__35252 = chunk__34524_35240;
var G__35253 = count__34525_35241;
var G__35254 = (i__34526_35242 + (1));
seq__34523_35239 = G__35251;
chunk__34524_35240 = G__35252;
count__34525_35241 = G__35253;
i__34526_35242 = G__35254;
continue;
} else {
var temp__5823__auto___35255 = cljs.core.seq(seq__34523_35239);
if(temp__5823__auto___35255){
var seq__34523_35256__$1 = temp__5823__auto___35255;
if(cljs.core.chunked_seq_QMARK_(seq__34523_35256__$1)){
var c__5568__auto___35257 = cljs.core.chunk_first(seq__34523_35256__$1);
var G__35258 = cljs.core.chunk_rest(seq__34523_35256__$1);
var G__35259 = c__5568__auto___35257;
var G__35260 = cljs.core.count(c__5568__auto___35257);
var G__35261 = (0);
seq__34523_35239 = G__35258;
chunk__34524_35240 = G__35259;
count__34525_35241 = G__35260;
i__34526_35242 = G__35261;
continue;
} else {
var map__34552_35263 = cljs.core.first(seq__34523_35256__$1);
var map__34552_35264__$1 = cljs.core.__destructure_map(map__34552_35263);
var w_35265 = map__34552_35264__$1;
var msg_35266__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34552_35264__$1,new cljs.core.Keyword(null,"msg","msg",-1386103444));
var line_35267 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34552_35264__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_35268 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34552_35264__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var resource_name_35269 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34552_35264__$1,new cljs.core.Keyword(null,"resource-name","resource-name",2001617100));
console.warn(["BUILD-WARNING in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_name_35269)," at [",cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_35267),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column_35268),"]\n\t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg_35266__$1)].join(''));


var G__35270 = cljs.core.next(seq__34523_35256__$1);
var G__35271 = null;
var G__35272 = (0);
var G__35273 = (0);
seq__34523_35239 = G__35270;
chunk__34524_35240 = G__35271;
count__34525_35241 = G__35272;
i__34526_35242 = G__35273;
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

return shadow.cljs.devtools.client.shared.load_sources(runtime,sources_to_get,(function (p1__34482_SHARP_){
return shadow.cljs.devtools.client.browser.do_js_reload(msg,p1__34482_SHARP_,shadow.cljs.devtools.client.hud.load_end_success,shadow.cljs.devtools.client.hud.load_failure);
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
shadow.cljs.devtools.client.browser.handle_asset_update = (function shadow$cljs$devtools$client$browser$handle_asset_update(p__34560){
var map__34561 = p__34560;
var map__34561__$1 = cljs.core.__destructure_map(map__34561);
var msg = map__34561__$1;
var updates = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34561__$1,new cljs.core.Keyword(null,"updates","updates",2013983452));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34561__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var seq__34562 = cljs.core.seq(updates);
var chunk__34564 = null;
var count__34565 = (0);
var i__34566 = (0);
while(true){
if((i__34566 < count__34565)){
var path = chunk__34564.cljs$core$IIndexed$_nth$arity$2(null, i__34566);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__34739_35274 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__34743_35275 = null;
var count__34744_35276 = (0);
var i__34745_35277 = (0);
while(true){
if((i__34745_35277 < count__34744_35276)){
var node_35281 = chunk__34743_35275.cljs$core$IIndexed$_nth$arity$2(null, i__34745_35277);
if(cljs.core.not(node_35281.shadow$old)){
var path_match_35282 = shadow.cljs.devtools.client.browser.match_paths(node_35281.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35282)){
var new_link_35283 = (function (){var G__34793 = node_35281.cloneNode(true);
G__34793.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35282),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34793;
})();
(node_35281.shadow$old = true);

(new_link_35283.onload = ((function (seq__34739_35274,chunk__34743_35275,count__34744_35276,i__34745_35277,seq__34562,chunk__34564,count__34565,i__34566,new_link_35283,path_match_35282,node_35281,path,map__34561,map__34561__$1,msg,updates,reload_info){
return (function (e){
var seq__34794_35287 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34796_35288 = null;
var count__34797_35289 = (0);
var i__34798_35290 = (0);
while(true){
if((i__34798_35290 < count__34797_35289)){
var map__34804_35291 = chunk__34796_35288.cljs$core$IIndexed$_nth$arity$2(null, i__34798_35290);
var map__34804_35292__$1 = cljs.core.__destructure_map(map__34804_35291);
var task_35293 = map__34804_35292__$1;
var fn_str_35294 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34804_35292__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35295 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34804_35292__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35297 = goog.getObjectByName(fn_str_35294,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35295)].join(''));

(fn_obj_35297.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35297.cljs$core$IFn$_invoke$arity$2(path,new_link_35283) : fn_obj_35297.call(null, path,new_link_35283));


var G__35299 = seq__34794_35287;
var G__35300 = chunk__34796_35288;
var G__35301 = count__34797_35289;
var G__35302 = (i__34798_35290 + (1));
seq__34794_35287 = G__35299;
chunk__34796_35288 = G__35300;
count__34797_35289 = G__35301;
i__34798_35290 = G__35302;
continue;
} else {
var temp__5823__auto___35303 = cljs.core.seq(seq__34794_35287);
if(temp__5823__auto___35303){
var seq__34794_35304__$1 = temp__5823__auto___35303;
if(cljs.core.chunked_seq_QMARK_(seq__34794_35304__$1)){
var c__5568__auto___35305 = cljs.core.chunk_first(seq__34794_35304__$1);
var G__35307 = cljs.core.chunk_rest(seq__34794_35304__$1);
var G__35308 = c__5568__auto___35305;
var G__35309 = cljs.core.count(c__5568__auto___35305);
var G__35310 = (0);
seq__34794_35287 = G__35307;
chunk__34796_35288 = G__35308;
count__34797_35289 = G__35309;
i__34798_35290 = G__35310;
continue;
} else {
var map__34809_35311 = cljs.core.first(seq__34794_35304__$1);
var map__34809_35312__$1 = cljs.core.__destructure_map(map__34809_35311);
var task_35313 = map__34809_35312__$1;
var fn_str_35314 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34809_35312__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35315 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34809_35312__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35318 = goog.getObjectByName(fn_str_35314,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35315)].join(''));

(fn_obj_35318.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35318.cljs$core$IFn$_invoke$arity$2(path,new_link_35283) : fn_obj_35318.call(null, path,new_link_35283));


var G__35320 = cljs.core.next(seq__34794_35304__$1);
var G__35321 = null;
var G__35322 = (0);
var G__35323 = (0);
seq__34794_35287 = G__35320;
chunk__34796_35288 = G__35321;
count__34797_35289 = G__35322;
i__34798_35290 = G__35323;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35281);
});})(seq__34739_35274,chunk__34743_35275,count__34744_35276,i__34745_35277,seq__34562,chunk__34564,count__34565,i__34566,new_link_35283,path_match_35282,node_35281,path,map__34561,map__34561__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35282], 0));

goog.dom.insertSiblingAfter(new_link_35283,node_35281);


var G__35324 = seq__34739_35274;
var G__35325 = chunk__34743_35275;
var G__35326 = count__34744_35276;
var G__35327 = (i__34745_35277 + (1));
seq__34739_35274 = G__35324;
chunk__34743_35275 = G__35325;
count__34744_35276 = G__35326;
i__34745_35277 = G__35327;
continue;
} else {
var G__35328 = seq__34739_35274;
var G__35329 = chunk__34743_35275;
var G__35330 = count__34744_35276;
var G__35331 = (i__34745_35277 + (1));
seq__34739_35274 = G__35328;
chunk__34743_35275 = G__35329;
count__34744_35276 = G__35330;
i__34745_35277 = G__35331;
continue;
}
} else {
var G__35332 = seq__34739_35274;
var G__35333 = chunk__34743_35275;
var G__35334 = count__34744_35276;
var G__35335 = (i__34745_35277 + (1));
seq__34739_35274 = G__35332;
chunk__34743_35275 = G__35333;
count__34744_35276 = G__35334;
i__34745_35277 = G__35335;
continue;
}
} else {
var temp__5823__auto___35336 = cljs.core.seq(seq__34739_35274);
if(temp__5823__auto___35336){
var seq__34739_35337__$1 = temp__5823__auto___35336;
if(cljs.core.chunked_seq_QMARK_(seq__34739_35337__$1)){
var c__5568__auto___35338 = cljs.core.chunk_first(seq__34739_35337__$1);
var G__35339 = cljs.core.chunk_rest(seq__34739_35337__$1);
var G__35340 = c__5568__auto___35338;
var G__35341 = cljs.core.count(c__5568__auto___35338);
var G__35342 = (0);
seq__34739_35274 = G__35339;
chunk__34743_35275 = G__35340;
count__34744_35276 = G__35341;
i__34745_35277 = G__35342;
continue;
} else {
var node_35343 = cljs.core.first(seq__34739_35337__$1);
if(cljs.core.not(node_35343.shadow$old)){
var path_match_35344 = shadow.cljs.devtools.client.browser.match_paths(node_35343.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35344)){
var new_link_35345 = (function (){var G__34814 = node_35343.cloneNode(true);
G__34814.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35344),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34814;
})();
(node_35343.shadow$old = true);

(new_link_35345.onload = ((function (seq__34739_35274,chunk__34743_35275,count__34744_35276,i__34745_35277,seq__34562,chunk__34564,count__34565,i__34566,new_link_35345,path_match_35344,node_35343,seq__34739_35337__$1,temp__5823__auto___35336,path,map__34561,map__34561__$1,msg,updates,reload_info){
return (function (e){
var seq__34815_35347 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34817_35348 = null;
var count__34818_35349 = (0);
var i__34819_35350 = (0);
while(true){
if((i__34819_35350 < count__34818_35349)){
var map__34831_35351 = chunk__34817_35348.cljs$core$IIndexed$_nth$arity$2(null, i__34819_35350);
var map__34831_35352__$1 = cljs.core.__destructure_map(map__34831_35351);
var task_35353 = map__34831_35352__$1;
var fn_str_35354 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34831_35352__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35355 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34831_35352__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35356 = goog.getObjectByName(fn_str_35354,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35355)].join(''));

(fn_obj_35356.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35356.cljs$core$IFn$_invoke$arity$2(path,new_link_35345) : fn_obj_35356.call(null, path,new_link_35345));


var G__35357 = seq__34815_35347;
var G__35358 = chunk__34817_35348;
var G__35359 = count__34818_35349;
var G__35360 = (i__34819_35350 + (1));
seq__34815_35347 = G__35357;
chunk__34817_35348 = G__35358;
count__34818_35349 = G__35359;
i__34819_35350 = G__35360;
continue;
} else {
var temp__5823__auto___35361__$1 = cljs.core.seq(seq__34815_35347);
if(temp__5823__auto___35361__$1){
var seq__34815_35362__$1 = temp__5823__auto___35361__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34815_35362__$1)){
var c__5568__auto___35363 = cljs.core.chunk_first(seq__34815_35362__$1);
var G__35364 = cljs.core.chunk_rest(seq__34815_35362__$1);
var G__35365 = c__5568__auto___35363;
var G__35366 = cljs.core.count(c__5568__auto___35363);
var G__35367 = (0);
seq__34815_35347 = G__35364;
chunk__34817_35348 = G__35365;
count__34818_35349 = G__35366;
i__34819_35350 = G__35367;
continue;
} else {
var map__34833_35368 = cljs.core.first(seq__34815_35362__$1);
var map__34833_35369__$1 = cljs.core.__destructure_map(map__34833_35368);
var task_35370 = map__34833_35369__$1;
var fn_str_35371 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34833_35369__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35372 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34833_35369__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35373 = goog.getObjectByName(fn_str_35371,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35372)].join(''));

(fn_obj_35373.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35373.cljs$core$IFn$_invoke$arity$2(path,new_link_35345) : fn_obj_35373.call(null, path,new_link_35345));


var G__35374 = cljs.core.next(seq__34815_35362__$1);
var G__35375 = null;
var G__35376 = (0);
var G__35377 = (0);
seq__34815_35347 = G__35374;
chunk__34817_35348 = G__35375;
count__34818_35349 = G__35376;
i__34819_35350 = G__35377;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35343);
});})(seq__34739_35274,chunk__34743_35275,count__34744_35276,i__34745_35277,seq__34562,chunk__34564,count__34565,i__34566,new_link_35345,path_match_35344,node_35343,seq__34739_35337__$1,temp__5823__auto___35336,path,map__34561,map__34561__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35344], 0));

goog.dom.insertSiblingAfter(new_link_35345,node_35343);


var G__35378 = cljs.core.next(seq__34739_35337__$1);
var G__35379 = null;
var G__35380 = (0);
var G__35381 = (0);
seq__34739_35274 = G__35378;
chunk__34743_35275 = G__35379;
count__34744_35276 = G__35380;
i__34745_35277 = G__35381;
continue;
} else {
var G__35382 = cljs.core.next(seq__34739_35337__$1);
var G__35383 = null;
var G__35384 = (0);
var G__35385 = (0);
seq__34739_35274 = G__35382;
chunk__34743_35275 = G__35383;
count__34744_35276 = G__35384;
i__34745_35277 = G__35385;
continue;
}
} else {
var G__35386 = cljs.core.next(seq__34739_35337__$1);
var G__35387 = null;
var G__35388 = (0);
var G__35389 = (0);
seq__34739_35274 = G__35386;
chunk__34743_35275 = G__35387;
count__34744_35276 = G__35388;
i__34745_35277 = G__35389;
continue;
}
}
} else {
}
}
break;
}


var G__35393 = seq__34562;
var G__35394 = chunk__34564;
var G__35395 = count__34565;
var G__35396 = (i__34566 + (1));
seq__34562 = G__35393;
chunk__34564 = G__35394;
count__34565 = G__35395;
i__34566 = G__35396;
continue;
} else {
var G__35397 = seq__34562;
var G__35398 = chunk__34564;
var G__35399 = count__34565;
var G__35400 = (i__34566 + (1));
seq__34562 = G__35397;
chunk__34564 = G__35398;
count__34565 = G__35399;
i__34566 = G__35400;
continue;
}
} else {
var temp__5823__auto__ = cljs.core.seq(seq__34562);
if(temp__5823__auto__){
var seq__34562__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__34562__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__34562__$1);
var G__35401 = cljs.core.chunk_rest(seq__34562__$1);
var G__35402 = c__5568__auto__;
var G__35403 = cljs.core.count(c__5568__auto__);
var G__35404 = (0);
seq__34562 = G__35401;
chunk__34564 = G__35402;
count__34565 = G__35403;
i__34566 = G__35404;
continue;
} else {
var path = cljs.core.first(seq__34562__$1);
if(clojure.string.ends_with_QMARK_(path,"css")){
var seq__34839_35405 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("link[rel=\"stylesheet\"]")));
var chunk__34843_35406 = null;
var count__34844_35407 = (0);
var i__34845_35408 = (0);
while(true){
if((i__34845_35408 < count__34844_35407)){
var node_35409 = chunk__34843_35406.cljs$core$IIndexed$_nth$arity$2(null, i__34845_35408);
if(cljs.core.not(node_35409.shadow$old)){
var path_match_35410 = shadow.cljs.devtools.client.browser.match_paths(node_35409.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35410)){
var new_link_35411 = (function (){var G__34888 = node_35409.cloneNode(true);
G__34888.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35410),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34888;
})();
(node_35409.shadow$old = true);

(new_link_35411.onload = ((function (seq__34839_35405,chunk__34843_35406,count__34844_35407,i__34845_35408,seq__34562,chunk__34564,count__34565,i__34566,new_link_35411,path_match_35410,node_35409,path,seq__34562__$1,temp__5823__auto__,map__34561,map__34561__$1,msg,updates,reload_info){
return (function (e){
var seq__34889_35412 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34891_35413 = null;
var count__34892_35414 = (0);
var i__34893_35415 = (0);
while(true){
if((i__34893_35415 < count__34892_35414)){
var map__34901_35416 = chunk__34891_35413.cljs$core$IIndexed$_nth$arity$2(null, i__34893_35415);
var map__34901_35417__$1 = cljs.core.__destructure_map(map__34901_35416);
var task_35418 = map__34901_35417__$1;
var fn_str_35419 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34901_35417__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35420 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34901_35417__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35421 = goog.getObjectByName(fn_str_35419,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35420)].join(''));

(fn_obj_35421.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35421.cljs$core$IFn$_invoke$arity$2(path,new_link_35411) : fn_obj_35421.call(null, path,new_link_35411));


var G__35422 = seq__34889_35412;
var G__35423 = chunk__34891_35413;
var G__35424 = count__34892_35414;
var G__35425 = (i__34893_35415 + (1));
seq__34889_35412 = G__35422;
chunk__34891_35413 = G__35423;
count__34892_35414 = G__35424;
i__34893_35415 = G__35425;
continue;
} else {
var temp__5823__auto___35426__$1 = cljs.core.seq(seq__34889_35412);
if(temp__5823__auto___35426__$1){
var seq__34889_35427__$1 = temp__5823__auto___35426__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34889_35427__$1)){
var c__5568__auto___35428 = cljs.core.chunk_first(seq__34889_35427__$1);
var G__35429 = cljs.core.chunk_rest(seq__34889_35427__$1);
var G__35430 = c__5568__auto___35428;
var G__35431 = cljs.core.count(c__5568__auto___35428);
var G__35432 = (0);
seq__34889_35412 = G__35429;
chunk__34891_35413 = G__35430;
count__34892_35414 = G__35431;
i__34893_35415 = G__35432;
continue;
} else {
var map__34903_35433 = cljs.core.first(seq__34889_35427__$1);
var map__34903_35434__$1 = cljs.core.__destructure_map(map__34903_35433);
var task_35435 = map__34903_35434__$1;
var fn_str_35436 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34903_35434__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35437 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34903_35434__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35438 = goog.getObjectByName(fn_str_35436,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35437)].join(''));

(fn_obj_35438.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35438.cljs$core$IFn$_invoke$arity$2(path,new_link_35411) : fn_obj_35438.call(null, path,new_link_35411));


var G__35439 = cljs.core.next(seq__34889_35427__$1);
var G__35440 = null;
var G__35441 = (0);
var G__35442 = (0);
seq__34889_35412 = G__35439;
chunk__34891_35413 = G__35440;
count__34892_35414 = G__35441;
i__34893_35415 = G__35442;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35409);
});})(seq__34839_35405,chunk__34843_35406,count__34844_35407,i__34845_35408,seq__34562,chunk__34564,count__34565,i__34566,new_link_35411,path_match_35410,node_35409,path,seq__34562__$1,temp__5823__auto__,map__34561,map__34561__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35410], 0));

goog.dom.insertSiblingAfter(new_link_35411,node_35409);


var G__35443 = seq__34839_35405;
var G__35444 = chunk__34843_35406;
var G__35445 = count__34844_35407;
var G__35446 = (i__34845_35408 + (1));
seq__34839_35405 = G__35443;
chunk__34843_35406 = G__35444;
count__34844_35407 = G__35445;
i__34845_35408 = G__35446;
continue;
} else {
var G__35447 = seq__34839_35405;
var G__35448 = chunk__34843_35406;
var G__35449 = count__34844_35407;
var G__35450 = (i__34845_35408 + (1));
seq__34839_35405 = G__35447;
chunk__34843_35406 = G__35448;
count__34844_35407 = G__35449;
i__34845_35408 = G__35450;
continue;
}
} else {
var G__35451 = seq__34839_35405;
var G__35452 = chunk__34843_35406;
var G__35453 = count__34844_35407;
var G__35454 = (i__34845_35408 + (1));
seq__34839_35405 = G__35451;
chunk__34843_35406 = G__35452;
count__34844_35407 = G__35453;
i__34845_35408 = G__35454;
continue;
}
} else {
var temp__5823__auto___35455__$1 = cljs.core.seq(seq__34839_35405);
if(temp__5823__auto___35455__$1){
var seq__34839_35456__$1 = temp__5823__auto___35455__$1;
if(cljs.core.chunked_seq_QMARK_(seq__34839_35456__$1)){
var c__5568__auto___35457 = cljs.core.chunk_first(seq__34839_35456__$1);
var G__35458 = cljs.core.chunk_rest(seq__34839_35456__$1);
var G__35459 = c__5568__auto___35457;
var G__35460 = cljs.core.count(c__5568__auto___35457);
var G__35461 = (0);
seq__34839_35405 = G__35458;
chunk__34843_35406 = G__35459;
count__34844_35407 = G__35460;
i__34845_35408 = G__35461;
continue;
} else {
var node_35463 = cljs.core.first(seq__34839_35456__$1);
if(cljs.core.not(node_35463.shadow$old)){
var path_match_35464 = shadow.cljs.devtools.client.browser.match_paths(node_35463.getAttribute("href"),path);
if(cljs.core.truth_(path_match_35464)){
var new_link_35465 = (function (){var G__34906 = node_35463.cloneNode(true);
G__34906.setAttribute("href",[cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_match_35464),"?r=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0())].join(''));

return G__34906;
})();
(node_35463.shadow$old = true);

(new_link_35465.onload = ((function (seq__34839_35405,chunk__34843_35406,count__34844_35407,i__34845_35408,seq__34562,chunk__34564,count__34565,i__34566,new_link_35465,path_match_35464,node_35463,seq__34839_35456__$1,temp__5823__auto___35455__$1,path,seq__34562__$1,temp__5823__auto__,map__34561,map__34561__$1,msg,updates,reload_info){
return (function (e){
var seq__34908_35466 = cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(msg,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"reload-info","reload-info",1648088086),new cljs.core.Keyword(null,"asset-load","asset-load",-1925902322)], null)));
var chunk__34910_35467 = null;
var count__34911_35468 = (0);
var i__34912_35469 = (0);
while(true){
if((i__34912_35469 < count__34911_35468)){
var map__34926_35470 = chunk__34910_35467.cljs$core$IIndexed$_nth$arity$2(null, i__34912_35469);
var map__34926_35471__$1 = cljs.core.__destructure_map(map__34926_35470);
var task_35472 = map__34926_35471__$1;
var fn_str_35473 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34926_35471__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35474 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34926_35471__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35475 = goog.getObjectByName(fn_str_35473,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35474)].join(''));

(fn_obj_35475.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35475.cljs$core$IFn$_invoke$arity$2(path,new_link_35465) : fn_obj_35475.call(null, path,new_link_35465));


var G__35477 = seq__34908_35466;
var G__35478 = chunk__34910_35467;
var G__35479 = count__34911_35468;
var G__35480 = (i__34912_35469 + (1));
seq__34908_35466 = G__35477;
chunk__34910_35467 = G__35478;
count__34911_35468 = G__35479;
i__34912_35469 = G__35480;
continue;
} else {
var temp__5823__auto___35483__$2 = cljs.core.seq(seq__34908_35466);
if(temp__5823__auto___35483__$2){
var seq__34908_35484__$1 = temp__5823__auto___35483__$2;
if(cljs.core.chunked_seq_QMARK_(seq__34908_35484__$1)){
var c__5568__auto___35485 = cljs.core.chunk_first(seq__34908_35484__$1);
var G__35486 = cljs.core.chunk_rest(seq__34908_35484__$1);
var G__35487 = c__5568__auto___35485;
var G__35488 = cljs.core.count(c__5568__auto___35485);
var G__35489 = (0);
seq__34908_35466 = G__35486;
chunk__34910_35467 = G__35487;
count__34911_35468 = G__35488;
i__34912_35469 = G__35489;
continue;
} else {
var map__34932_35490 = cljs.core.first(seq__34908_35484__$1);
var map__34932_35491__$1 = cljs.core.__destructure_map(map__34932_35490);
var task_35492 = map__34932_35491__$1;
var fn_str_35493 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34932_35491__$1,new cljs.core.Keyword(null,"fn-str","fn-str",-1348506402));
var fn_sym_35494 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34932_35491__$1,new cljs.core.Keyword(null,"fn-sym","fn-sym",1423988510));
var fn_obj_35495 = goog.getObjectByName(fn_str_35493,$CLJS);
shadow.cljs.devtools.client.browser.devtools_msg(["call ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(fn_sym_35494)].join(''));

(fn_obj_35495.cljs$core$IFn$_invoke$arity$2 ? fn_obj_35495.cljs$core$IFn$_invoke$arity$2(path,new_link_35465) : fn_obj_35495.call(null, path,new_link_35465));


var G__35496 = cljs.core.next(seq__34908_35484__$1);
var G__35497 = null;
var G__35498 = (0);
var G__35499 = (0);
seq__34908_35466 = G__35496;
chunk__34910_35467 = G__35497;
count__34911_35468 = G__35498;
i__34912_35469 = G__35499;
continue;
}
} else {
}
}
break;
}

return goog.dom.removeNode(node_35463);
});})(seq__34839_35405,chunk__34843_35406,count__34844_35407,i__34845_35408,seq__34562,chunk__34564,count__34565,i__34566,new_link_35465,path_match_35464,node_35463,seq__34839_35456__$1,temp__5823__auto___35455__$1,path,seq__34562__$1,temp__5823__auto__,map__34561,map__34561__$1,msg,updates,reload_info))
);

shadow.cljs.devtools.client.browser.devtools_msg.cljs$core$IFn$_invoke$arity$variadic("load CSS",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([path_match_35464], 0));

goog.dom.insertSiblingAfter(new_link_35465,node_35463);


var G__35500 = cljs.core.next(seq__34839_35456__$1);
var G__35501 = null;
var G__35502 = (0);
var G__35503 = (0);
seq__34839_35405 = G__35500;
chunk__34843_35406 = G__35501;
count__34844_35407 = G__35502;
i__34845_35408 = G__35503;
continue;
} else {
var G__35504 = cljs.core.next(seq__34839_35456__$1);
var G__35505 = null;
var G__35506 = (0);
var G__35507 = (0);
seq__34839_35405 = G__35504;
chunk__34843_35406 = G__35505;
count__34844_35407 = G__35506;
i__34845_35408 = G__35507;
continue;
}
} else {
var G__35508 = cljs.core.next(seq__34839_35456__$1);
var G__35509 = null;
var G__35510 = (0);
var G__35511 = (0);
seq__34839_35405 = G__35508;
chunk__34843_35406 = G__35509;
count__34844_35407 = G__35510;
i__34845_35408 = G__35511;
continue;
}
}
} else {
}
}
break;
}


var G__35512 = cljs.core.next(seq__34562__$1);
var G__35513 = null;
var G__35514 = (0);
var G__35515 = (0);
seq__34562 = G__35512;
chunk__34564 = G__35513;
count__34565 = G__35514;
i__34566 = G__35515;
continue;
} else {
var G__35516 = cljs.core.next(seq__34562__$1);
var G__35517 = null;
var G__35518 = (0);
var G__35519 = (0);
seq__34562 = G__35516;
chunk__34564 = G__35517;
count__34565 = G__35518;
i__34566 = G__35519;
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

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_invoke$arity$3 = (function (this$,ns,p__34962){
var map__34963 = p__34962;
var map__34963__$1 = cljs.core.__destructure_map(map__34963);
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34963__$1,new cljs.core.Keyword(null,"js","js",1768080579));
var this$__$1 = this;
return shadow.cljs.devtools.client.browser.global_eval(js);
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_init$arity$4 = (function (runtime,p__34964,done,error){
var map__34965 = p__34964;
var map__34965__$1 = cljs.core.__destructure_map(map__34965);
var repl_sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34965__$1,new cljs.core.Keyword(null,"repl-sources","repl-sources",723867535));
var runtime__$1 = this;
return shadow.cljs.devtools.client.shared.load_sources(runtime__$1,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(shadow.cljs.devtools.client.env.src_is_loaded_QMARK_,repl_sources)),(function (sources){
shadow.cljs.devtools.client.browser.do_js_load(sources);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null, ));
}));
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_require$arity$4 = (function (runtime,p__34966,done,error){
var map__34967 = p__34966;
var map__34967__$1 = cljs.core.__destructure_map(map__34967);
var msg = map__34967__$1;
var sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34967__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
var reload_namespaces = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34967__$1,new cljs.core.Keyword(null,"reload-namespaces","reload-namespaces",250210134));
var js_requires = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34967__$1,new cljs.core.Keyword(null,"js-requires","js-requires",-1311472051));
var runtime__$1 = this;
var sources_to_load = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__34976){
var map__34977 = p__34976;
var map__34977__$1 = cljs.core.__destructure_map(map__34977);
var src = map__34977__$1;
var provides = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34977__$1,new cljs.core.Keyword(null,"provides","provides",-1634397992));
var and__5043__auto__ = shadow.cljs.devtools.client.env.src_is_loaded_QMARK_(src);
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(cljs.core.some(reload_namespaces,provides));
} else {
return and__5043__auto__;
}
}),sources));
if(cljs.core.not(cljs.core.seq(sources_to_load))){
var G__34982 = cljs.core.PersistentVector.EMPTY;
return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(G__34982) : done.call(null, G__34982));
} else {
return shadow.remote.runtime.shared.call.cljs$core$IFn$_invoke$arity$3(runtime__$1,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"cljs-load-sources","cljs-load-sources",-1458295962),new cljs.core.Keyword(null,"to","to",192099007),shadow.cljs.devtools.client.env.worker_client_id,new cljs.core.Keyword(null,"sources","sources",-321166424),cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582)),sources_to_load)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cljs-sources","cljs-sources",31121610),(function (p__34997){
var map__34998 = p__34997;
var map__34998__$1 = cljs.core.__destructure_map(map__34998);
var msg__$1 = map__34998__$1;
var sources__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34998__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
try{shadow.cljs.devtools.client.browser.do_js_load(sources__$1);

if(cljs.core.seq(js_requires)){
shadow.cljs.devtools.client.browser.do_js_requires(js_requires);
} else {
}

return (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(sources_to_load) : done.call(null, sources_to_load));
}catch (e35006){var ex = e35006;
return (error.cljs$core$IFn$_invoke$arity$1 ? error.cljs$core$IFn$_invoke$arity$1(ex) : error.call(null, ex));
}})], null));
}
}));

shadow.cljs.devtools.client.shared.add_plugin_BANG_(new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282),cljs.core.PersistentHashSet.EMPTY,(function (p__35021){
var map__35023 = p__35021;
var map__35023__$1 = cljs.core.__destructure_map(map__35023);
var env = map__35023__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35023__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
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
}),new cljs.core.Keyword("shadow.cljs.devtools.client.env","worker-notify","shadow.cljs.devtools.client.env/worker-notify",-1456820670),(function (p__35108){
var map__35109 = p__35108;
var map__35109__$1 = cljs.core.__destructure_map(map__35109);
var event_op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35109__$1,new cljs.core.Keyword(null,"event-op","event-op",200358057));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35109__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
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
}),(function (p__35141){
var map__35142 = p__35141;
var map__35142__$1 = cljs.core.__destructure_map(map__35142);
var svc = map__35142__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__35142__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
return shadow.remote.runtime.api.del_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.browser","client","shadow.cljs.devtools.client.browser/client",-1461019282));
}));

shadow.cljs.devtools.client.shared.init_runtime_BANG_(shadow.cljs.devtools.client.browser.client_info,shadow.cljs.devtools.client.websocket.start,shadow.cljs.devtools.client.websocket.send,shadow.cljs.devtools.client.websocket.stop);
} else {
}

//# sourceMappingURL=shadow.cljs.devtools.client.browser.js.map
