goog.provide('cljs_thread.core');
cljs.core.enable_console_print_BANG_();
cljs_thread.core.sleep = cljs_thread.sync.sleep;
cljs_thread.core.id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
goog.exportSymbol('cljs_thread.core.id', cljs_thread.core.id);
/**
 * Detect the screen module by scanning <script> tags on the page.
 * In a shadow-cljs code-split build, the last <script> is always the screen
 * entry module. Workers already load shared.js via importScripts, so only
 * the screen module needs IIFE-unwrapping for non-exported vars.
 */
cljs_thread.core.auto_detect_loadable_modules = (function cljs_thread$core$auto_detect_loadable_modules(config){
if((((!(cljs_thread.platform.node_QMARK_))) && ((typeof document !== 'undefined')))){
var core_script = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"core-connect-string","core-connect-string",-1385565583).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})();
var sw_script = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})();
var basename = (function (s){
var s__$1 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(s);
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2(s__$1,(s__$1.lastIndexOf("/") + (1)));
});
var core_name = basename(core_script);
var sw_name = basename(sw_script);
var page_scripts = cljs.core.filterv((function (p1__29053_SHARP_){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__29053_SHARP_,core_name)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__29053_SHARP_,sw_name)) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__29053_SHARP_,"")))));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__29052_SHARP_){
return basename(p1__29052_SHARP_.src);
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(document.querySelectorAll("script[src]"))));
var screen_module = cljs.core.last(page_scripts);
if(cljs.core.truth_(screen_module)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [screen_module], null);
} else {
return null;
}
} else {
return null;
}
});
/**
 * Internal init logic. Separated so public init! can handle argument
 * overloading (main fn, config map, or both).
 */
cljs_thread.core.do_init_BANG_ = (function cljs_thread$core$do_init_BANG_(config_map){
cljs_thread.util.boot_log("screen","do-init! ENTER");

if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
} else {
throw (new Error("Assert failed: (e/in-screen?)"));
}

if(cljs.core.truth_(config_map)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.conf,cljs.core.merge,config_map);
} else {
}

if(cljs.core.truth_(cljs_thread.platform.force_sw_sync_requested_QMARK_())){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"force-sw-sync","force-sw-sync",790093192),true);
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"core-connect-string","core-connect-string",-1385565583).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf)))){
} else {
var temp__5823__auto___29098 = cljs_thread.strategy.fat_kernel.detect_core_connect_string();
if(cljs.core.truth_(temp__5823__auto___29098)){
var detected_29099 = temp__5823__auto___29098;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"core-connect-string","core-connect-string",-1385565583),detected_29099);
} else {
}
}

if(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.platform.sab_sync_QMARK_;
if(cljs.core.truth_(and__5043__auto__)){
return ((cljs.core.not(new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf)))) && (cljs.core.not(cljs.core.deref(cljs_thread.platform.create_worker_override))));
} else {
return and__5043__auto__;
}
})())){
cljs_thread.strategy.fat_kernel.install_BANG_();
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.conf)))){
} else {
var temp__5823__auto___29100 = cljs_thread.core.auto_detect_loadable_modules(cljs.core.deref(cljs_thread.state.conf));
if(cljs.core.truth_(temp__5823__auto___29100)){
var modules_29101 = temp__5823__auto___29100;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"loadable-modules","loadable-modules",-582233975),modules_29101);
} else {
}
}

if(cljs.core.truth_((function (){var and__5043__auto__ = (new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs_thread.state.eve_sab_config)) == null);
if(and__5043__auto__){
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
} else {
return and__5043__auto__;
}
})())){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.eve_sab_config,cljs.core.merge,cljs_thread.eve.shared_atom.sab_transfer_data(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_));
} else {
}

var config = cljs.core.deref(cljs_thread.state.conf);
var future_ids = cljs_thread.future.mk_worker_ids(new cljs.core.Keyword(null,"future-count","future-count",-150873523).cljs$core$IFn$_invoke$arity$1(config));
var injest_ids = cljs_thread.injest.mk_injest_ids.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"injest-count","injest-count",-1344910572).cljs$core$IFn$_invoke$arity$1(config)], 0));
var config_with_ids = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(config,new cljs.core.Keyword(null,"future-ids","future-ids",464771618),future_ids,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"injest-ids","injest-ids",1570341181),injest_ids], 0));
cljs_thread.util.boot_log("screen",["spawning workers, node?=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.platform.node_QMARK_)," sab-sync?=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.platform.sab_sync_QMARK_)].join(''));

cljs_thread.util.boot_log("screen",["future-ids: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(future_ids))," injest-ids: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(injest_ids))].join(''));

cljs_thread.util.boot_log("screen","initializing future pool");

cljs_thread.future.init_pool_BANG_(future_ids);

cljs_thread.util.boot_log("screen","spawning future workers from screen");

cljs_thread.future.spawn_future_workers(future_ids,config_with_ids);

cljs_thread.util.boot_log("screen","spawning injest workers from screen");

cljs_thread.injest.spawn_injest_workers(injest_ids,config_with_ids);

if(cljs_thread.platform.node_QMARK_){
cljs_thread.util.boot_log("screen","spawn-sw -> spawn :root");

cljs_thread.spawn.spawn_sw((function (){
return cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config_with_ids], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (config_with_ids__$1){
return cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([config_with_ids__$1], 0));
})));
}));
} else {
if(cljs.core.not((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.platform.sab_sync_QMARK_;
}
})())){
cljs_thread.util.boot_log("screen","spawn :root (basic, no sync)");

cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config_with_ids], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (config_with_ids__$1){
return cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([config_with_ids__$1], 0));
})));
} else {
cljs_thread.util.boot_log("screen","spawn-sw -> spawn :root");

cljs_thread.spawn.spawn_sw((function (){
return cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [config_with_ids], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"root","root",-448657453),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (config_with_ids__$1){
return cljs_thread.root.init_root_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([config_with_ids__$1], 0));
})));
}));

if(((cljs.core.not(cljs_thread.platform.sab_sync_QMARK_)) && (cljs.core.not(cljs_thread.util.in_safari_QMARK_())))){
cljs_thread.spawn.on_sw_registration_reload();
} else {
}
}
}

return cljs_thread.util.boot_log("screen","do-init! EXIT");
});
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.core !== 'undefined') && (typeof cljs_thread.core.pending_main_fn !== 'undefined')){
} else {
cljs_thread.core.pending_main_fn = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Initialize cljs-thread. The public API entry point.
 * 
 * (init!)                                      ;; Auto-detect everything
 * (init! main-fn)                              ;; DOM proxy app: dispatch main to :core worker
 * (init! {:core-connect-string "/core.js"})   ;; Explicit config
 * (init! main-fn {:future-count 4})            ;; Main fn + config
 * 
 * When a main function is provided, it's stored on screen and dispatched
 * to :core after root signals that pools and :core are ready.
 */
cljs_thread.core.init_BANG_ = (function cljs_thread$core$init_BANG_(var_args){
var G__29060 = arguments.length;
switch (G__29060) {
case 0:
return cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});
goog.exportSymbol('cljs_thread.core.init_BANG_', cljs_thread.core.init_BANG_);

(cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs_thread.core.do_init_BANG_(null);
}));

(cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (main_or_config){
if(cljs.core.fn_QMARK_(main_or_config)){
cljs.core.reset_BANG_(cljs_thread.core.pending_main_fn,main_or_config);

return cljs_thread.core.do_init_BANG_(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439),true], null));
} else {
return cljs_thread.core.do_init_BANG_(main_or_config);
}
}));

(cljs_thread.core.init_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (main_fn,config_map){
cljs.core.reset_BANG_(cljs_thread.core.pending_main_fn,main_fn);

return cljs_thread.core.do_init_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(config_map,new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439),true));
}));

(cljs_thread.core.init_BANG_.cljs$lang$maxFixedArity = 2);

cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"core-ready","core-ready",-312673817),(function (_data){
cljs_thread.util.boot_log("screen",":core-ready received");

var temp__5823__auto__ = cljs.core.deref(cljs_thread.core.pending_main_fn);
if(cljs.core.truth_(temp__5823__auto__)){
var main_fn = temp__5823__auto__;
cljs.core.reset_BANG_(cljs_thread.core.pending_main_fn,null);

cljs_thread.util.boot_log("screen","dispatching main-fn to :core");

return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"core","core",-86019209),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [main_fn], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (main_fn__$1){
return (main_fn__$1.cljs$core$IFn$_invoke$arity$0 ? main_fn__$1.cljs$core$IFn$_invoke$arity$0() : main_fn__$1.call(null, ));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
} else {
return null;
}
}));
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"in-result","in-result",13280282),(function (p__29061){
var map__29062 = p__29061;
var map__29062__$1 = cljs.core.__destructure_map(map__29062);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29062__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__29063 = data;
var map__29063__$1 = cljs.core.__destructure_map(map__29063);
var in_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29063__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614));
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29063__$1,new cljs.core.Keyword(null,"result","result",1415092211));
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.requests),in_id);
if(cljs.core.truth_(temp__5823__auto__)){
var map__29064 = temp__5823__auto__;
var map__29064__$1 = cljs.core.__destructure_map(map__29064);
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29064__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cljs_thread.state.requests,cljs.core.dissoc,in_id);

return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(result) : resolve.call(null, result));
} else {
return null;
}
}));
goog.exportSymbol("cljs_thread.main",cljs_thread.core.init_BANG_);
if((((!(cljs_thread.env.in_sw_QMARK_()))) && (cljs.core.not(cljs_thread.env.in_screen_QMARK_())))){
cljs_thread.core.e_fn = new cljs.core.Keyword(null,"efn","efn",-704114748).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);

cljs_thread.core.e_args = new cljs.core.Keyword(null,"eargs","eargs",1843998501).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);

cljs_thread.core.sargs = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__29065_SHARP_){
if(cljs.core.fn_QMARK_(p1__29065_SHARP_)){
return ["#cljs-thread/arg-fn ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__29065_SHARP_)].join('');
} else {
return p1__29065_SHARP_;
}
}),cljs_thread.core.e_args);

var call_result_29106 = (cljs.core.truth_(cljs_thread.core.e_fn)?cljs_thread.in$.do_call(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),cljs_thread.core.e_fn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),cljs_thread.core.sargs,new cljs.core.Keyword(null,"in-id","in-id",2013544614),new cljs.core.Keyword(null,"in-id","in-id",2013544614).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"atom?","atom?",1646900477),true,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"go?","go?",966681578),new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], null)], null)], null)):null);
if(cljs.core.truth_((function (){var and__5043__auto__ = new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
if(cljs.core.truth_(and__5043__auto__)){
return (((call_result_29106 instanceof Promise)) && (cljs.core.not(new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))));
} else {
return and__5043__auto__;
}
})())){
call_result_29106.then((function (_){
return cljs_thread.platform.close_self_BANG_();
}));
} else {
if(((cljs.core.not(new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))) && (((cljs.core.not(new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))) && (cljs.core.not(new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))))))){
cljs_thread.platform.close_self_BANG_();
} else {
}
}

} else {
}
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"watch-signal","watch-signal",1482079812),(function (_data){
return (cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.check_remote_watches_BANG_.call(null, ));
}));
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
var G__29074_29107 = (function (_header_descriptor_idx){
var seq__29075 = cljs.core.seq(cljs.core.deref(cljs_thread.state.peers));
var chunk__29076 = null;
var count__29077 = (0);
var i__29078 = (0);
while(true){
if((i__29078 < count__29077)){
var vec__29090 = chunk__29076.cljs$core$IIndexed$_nth$arity$2(null, i__29078);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29090,(0),null);
var _peer = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29090,(1),null);
if((((id instanceof cljs.core.Keyword)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"parent","parent",-878878779))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"screen","screen",1990059748))))))){
try{cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentVector.EMPTY,cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__29075,chunk__29076,count__29077,i__29078,vec__29090,id,_peer){
return (function (){
return (cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.check_remote_watches_BANG_.call(null, ));
});})(seq__29075,chunk__29076,count__29077,i__29078,vec__29090,id,_peer))
),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}catch (e29093){var _e_29108 = e29093;
}} else {
}


var G__29109 = seq__29075;
var G__29110 = chunk__29076;
var G__29111 = count__29077;
var G__29112 = (i__29078 + (1));
seq__29075 = G__29109;
chunk__29076 = G__29110;
count__29077 = G__29111;
i__29078 = G__29112;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__29075);
if(temp__5823__auto__){
var seq__29075__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__29075__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__29075__$1);
var G__29113 = cljs.core.chunk_rest(seq__29075__$1);
var G__29114 = c__5568__auto__;
var G__29115 = cljs.core.count(c__5568__auto__);
var G__29116 = (0);
seq__29075 = G__29113;
chunk__29076 = G__29114;
count__29077 = G__29115;
i__29078 = G__29116;
continue;
} else {
var vec__29094 = cljs.core.first(seq__29075__$1);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29094,(0),null);
var _peer = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29094,(1),null);
if((((id instanceof cljs.core.Keyword)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"parent","parent",-878878779))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"screen","screen",1990059748))))))){
try{cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentVector.EMPTY,cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__29075,chunk__29076,count__29077,i__29078,vec__29094,id,_peer,seq__29075__$1,temp__5823__auto__){
return (function (){
return (cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.check_remote_watches_BANG_.call(null, ));
});})(seq__29075,chunk__29076,count__29077,i__29078,vec__29094,id,_peer,seq__29075__$1,temp__5823__auto__))
),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}catch (e29097){var _e_29117 = e29097;
}} else {
}


var G__29118 = cljs.core.next(seq__29075__$1);
var G__29119 = null;
var G__29120 = (0);
var G__29121 = (0);
seq__29075 = G__29118;
chunk__29076 = G__29119;
count__29077 = G__29120;
i__29078 = G__29121;
continue;
}
} else {
return null;
}
}
break;
}
});
(cljs_thread.eve.set_broadcast_swap_fn_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set_broadcast_swap_fn_BANG_.cljs$core$IFn$_invoke$arity$1(G__29074_29107) : cljs_thread.eve.set_broadcast_swap_fn_BANG_.call(null, G__29074_29107));
} else {
}

//# sourceMappingURL=cljs_thread.core.js.map
