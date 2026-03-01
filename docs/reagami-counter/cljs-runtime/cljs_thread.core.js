goog.provide('cljs_thread.core');
cljs.core.enable_console_print_BANG_();
cljs_thread.core.sleep = cljs_thread.sync.sleep;
cljs_thread.core.id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
goog.exportSymbol('cljs_thread.core.id', cljs_thread.core.id);
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
var temp__5823__auto___21494 = cljs_thread.strategy.fat_kernel.detect_core_connect_string();
if(cljs.core.truth_(temp__5823__auto___21494)){
var detected_21495 = temp__5823__auto___21494;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.conf,cljs.core.assoc,new cljs.core.Keyword(null,"core-connect-string","core-connect-string",-1385565583),detected_21495);
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

if(((cljs.core.not(cljs_thread.platform.sab_sync_QMARK_)) && ((!(cljs_thread.util.in_safari_QMARK_()))))){
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
var G__21467 = arguments.length;
switch (G__21467) {
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

var config = ((cljs.core.map_QMARK_(config_map))?config_map:cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(config_map,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
return cljs_thread.core.do_init_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword(null,"has-main-fn?","has-main-fn?",1149337439),true));
}));

(cljs_thread.core.init_BANG_.cljs$lang$maxFixedArity = 2);

cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"core-ready","core-ready",-312673817),(function (_data){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG screen: :core-ready received, pending-main-fn:",(!((cljs.core.deref(cljs_thread.core.pending_main_fn) == null)))], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG screen: peers=",cljs.core.vec(cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)))], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG screen: :core peer entry=",cljs.core.keys(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"core","core",-86019209)))], 0));

var temp__5823__auto__ = cljs.core.deref(cljs_thread.core.pending_main_fn);
if(cljs.core.truth_(temp__5823__auto__)){
var main_fn = temp__5823__auto__;
cljs.core.reset_BANG_(cljs_thread.core.pending_main_fn,null);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG screen: dispatching main-fn to :core, main-fn=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(main_fn)], 0));

cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"core","core",-86019209),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [main_fn], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (main_fn__$1){
return (main_fn__$1.cljs$core$IFn$_invoke$arity$0 ? main_fn__$1.cljs$core$IFn$_invoke$arity$0() : main_fn__$1.call(null, ));
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["DBG screen: in :core call returned"], 0));
} else {
return null;
}
}));
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"in-result","in-result",13280282),(function (p__21468){
var map__21469 = p__21468;
var map__21469__$1 = cljs.core.__destructure_map(map__21469);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21469__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__21470 = data;
var map__21470__$1 = cljs.core.__destructure_map(map__21470);
var in_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21470__$1,new cljs.core.Keyword(null,"in-id","in-id",2013544614));
var result = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21470__$1,new cljs.core.Keyword(null,"result","result",1415092211));
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.requests),in_id);
if(cljs.core.truth_(temp__5823__auto__)){
var map__21471 = temp__5823__auto__;
var map__21471__$1 = cljs.core.__destructure_map(map__21471);
var resolve = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21471__$1,new cljs.core.Keyword(null,"resolve","resolve",-1584445482));
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

cljs_thread.core.sargs = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21472_SHARP_){
if(cljs.core.fn_QMARK_(p1__21472_SHARP_)){
return ["#cljs-thread/arg-fn ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__21472_SHARP_)].join('');
} else {
return p1__21472_SHARP_;
}
}),cljs_thread.core.e_args);

var call_result_21499 = (cljs.core.truth_(cljs_thread.core.e_fn)?cljs_thread.in$.do_call(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),cljs_thread.core.e_fn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),cljs_thread.core.sargs,new cljs.core.Keyword(null,"in-id","in-id",2013544614),new cljs.core.Keyword(null,"in-id","in-id",2013544614).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"atom?","atom?",1646900477),true,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),new cljs.core.Keyword(null,"yield?","yield?",-2100785447).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"go?","go?",966681578),new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], null)], null)], null)):null);
if(cljs.core.truth_((function (){var and__5043__auto__ = new cljs.core.Keyword(null,"go?","go?",966681578).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data);
if(cljs.core.truth_(and__5043__auto__)){
return (((call_result_21499 instanceof Promise)) && (cljs.core.not(new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))));
} else {
return and__5043__auto__;
}
})())){
call_result_21499.then((function (_){
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
var G__21473_21500 = (function (_header_descriptor_idx){
var seq__21474 = cljs.core.seq(cljs.core.deref(cljs_thread.state.peers));
var chunk__21475 = null;
var count__21476 = (0);
var i__21477 = (0);
while(true){
if((i__21477 < count__21476)){
var vec__21486 = chunk__21475.cljs$core$IIndexed$_nth$arity$2(null, i__21477);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21486,(0),null);
var _peer = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21486,(1),null);
if((((id instanceof cljs.core.Keyword)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"parent","parent",-878878779))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"screen","screen",1990059748))))))){
try{cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentVector.EMPTY,cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21474,chunk__21475,count__21476,i__21477,vec__21486,id,_peer){
return (function (){
return (cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.check_remote_watches_BANG_.call(null, ));
});})(seq__21474,chunk__21475,count__21476,i__21477,vec__21486,id,_peer))
),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}catch (e21489){var _e_21501 = e21489;
}} else {
}


var G__21502 = seq__21474;
var G__21503 = chunk__21475;
var G__21504 = count__21476;
var G__21505 = (i__21477 + (1));
seq__21474 = G__21502;
chunk__21475 = G__21503;
count__21476 = G__21504;
i__21477 = G__21505;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__21474);
if(temp__5823__auto__){
var seq__21474__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__21474__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__21474__$1);
var G__21506 = cljs.core.chunk_rest(seq__21474__$1);
var G__21507 = c__5568__auto__;
var G__21508 = cljs.core.count(c__5568__auto__);
var G__21509 = (0);
seq__21474 = G__21506;
chunk__21475 = G__21507;
count__21476 = G__21508;
i__21477 = G__21509;
continue;
} else {
var vec__21490 = cljs.core.first(seq__21474__$1);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21490,(0),null);
var _peer = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21490,(1),null);
if((((id instanceof cljs.core.Keyword)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"parent","parent",-878878779))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"screen","screen",1990059748))))))){
try{cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentVector.EMPTY,cljs.core.str.cljs$core$IFn$_invoke$arity$1(((function (seq__21474,chunk__21475,count__21476,i__21477,vec__21490,id,_peer,seq__21474__$1,temp__5823__auto__){
return (function (){
return (cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0 ? cljs_thread.eve.check_remote_watches_BANG_.cljs$core$IFn$_invoke$arity$0() : cljs_thread.eve.check_remote_watches_BANG_.call(null, ));
});})(seq__21474,chunk__21475,count__21476,i__21477,vec__21490,id,_peer,seq__21474__$1,temp__5823__auto__))
),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}catch (e21493){var _e_21510 = e21493;
}} else {
}


var G__21511 = cljs.core.next(seq__21474__$1);
var G__21512 = null;
var G__21513 = (0);
var G__21514 = (0);
seq__21474 = G__21511;
chunk__21475 = G__21512;
count__21476 = G__21513;
i__21477 = G__21514;
continue;
}
} else {
return null;
}
}
break;
}
});
(cljs_thread.eve.set_broadcast_swap_fn_BANG_.cljs$core$IFn$_invoke$arity$1 ? cljs_thread.eve.set_broadcast_swap_fn_BANG_.cljs$core$IFn$_invoke$arity$1(G__21473_21500) : cljs_thread.eve.set_broadcast_swap_fn_BANG_.call(null, G__21473_21500));
} else {
}

//# sourceMappingURL=cljs_thread.core.js.map
