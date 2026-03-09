goog.provide('cljs_thread.spawn');
cljs_thread.spawn.on_sw_registration_reload = (function cljs_thread$spawn$on_sw_registration_reload(){
if(cljs_thread.platform.node_QMARK_){
return null;
} else {
return navigator.serviceWorker.getRegistration().then((function (){
if(cljs.core.truth_(navigator.serviceWorker.controller)){
return null;
} else {
return window.location.reload();
}
}));
}
});
cljs_thread.spawn.link = (function cljs_thread$spawn$link(id){
if(cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"port","port",1534937262)], null)))){
return null;
} else {
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"sw","sw",833113913))){
return null;
} else {
return cljs_thread.msg.add_port(id,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.peers),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.Keyword(null,"w","w",354169001)], null)));
}
} else {
var vec__21171 = cljs_thread.msg.mk_chan_pair();
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21171,(0),null);
var c2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21171,(1),null);
cljs_thread.msg.send_port(id,c1);

return cljs_thread.msg.add_port(id,c2);
}
}
});
cljs_thread.spawn.get_connection_string = (function cljs_thread$spawn$get_connection_string(p__21180){
var map__21181 = p__21180;
var map__21181__$1 = cljs.core.__destructure_map(map__21181);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21181__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var sw_override = new cljs.core.Keyword(null,"sw-connect-string","sw-connect-string",469647247).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),"/sw.js");
var core_override = new cljs.core.Keyword(null,"core-connect-string","core-connect-string",-1385565583).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),"/core.js");
var root_override = new cljs.core.Keyword(null,"root-connect-string","root-connect-string",658927449).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),core_override);
var future_override = new cljs.core.Keyword(null,"future-connect-string","future-connect-string",-1849786272).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),root_override);
var future_override__$1 = new cljs.core.Keyword(null,"injest-connect-string","injest-connect-string",-1139899345).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),root_override);
var repl_override = new cljs.core.Keyword(null,"repl-connect-string","repl-connect-string",1078047583).cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs_thread.state.conf),core_override);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"sw","sw",833113913),id)){
return sw_override;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"repl","repl",-35398667),id)){
return repl_override;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453),id)){
return root_override;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"future","future",1877842724),id)){
return future_override__$1;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"injest","injest",-1287283409),id)){
return future_override__$1;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"core","core",-86019209),id)){
return core_override;
} else {
return root_override;

}
}
}
}
}
}
});
cljs_thread.spawn.spawn_sw = (function cljs_thread$spawn$spawn_sw(init_callback){
if(cljs_thread.platform.node_QMARK_){
return (init_callback.cljs$core$IFn$_invoke$arity$0 ? init_callback.cljs$core$IFn$_invoke$arity$0() : init_callback.call(null, ));
} else {
return cljs_thread.platform.register_coordinator(cljs.core.deref(cljs_thread.state.conf),init_callback);
}
});
cljs_thread.spawn.root_spawn = (function cljs_thread$spawn$root_spawn(p__21182){
var map__21183 = p__21182;
var map__21183__$1 = cljs.core.__destructure_map(map__21183);
var data = map__21183__$1;
var deamon_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21183__$1,new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262));
var id = cljs_thread.util.gen_id.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data], 0));
var conn_str = cljs_thread.spawn.get_connection_string(data);
var worker_data = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"conf","conf",-983921284),cljs.core.deref(cljs_thread.state.conf)], null),(cljs.core.truth_((function (){var and__5043__auto__ = cljs_thread.platform.node_QMARK_;
if(and__5043__auto__){
return cljs.core.deref(cljs_thread.state.eve_sab_config);
} else {
return and__5043__auto__;
}
})())?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"__eve_sab_config","__eve_sab_config",-303570789),cljs.core.deref(cljs_thread.state.eve_sab_config)], null):null),data], 0));
var w = cljs_thread.platform.create_worker(conn_str,worker_data,cljs_thread.msg.message_handler);
if(cljs.core.truth_(deamon_QMARK_)){
cljs_thread.util.boot_log("spawn",["registering peer ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(id)].join(''));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cljs_thread.state.peers,cljs.core.assoc,id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"w","w",354169001),w,new cljs.core.Keyword(null,"id","id",-1388402092),id], null));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"sw","sw",833113913))){
} else {
cljs_thread.spawn.link(id);

cljs_thread.msg.post(id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"call","call",-519999866),new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){
return null;
})),new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"to","to",192099007),id], null)], null));
}
} else {
}

return id;
});
cljs_thread.spawn.pair_ids = (function cljs_thread$spawn$pair_ids(id1,id2){
var vec__21186 = cljs_thread.msg.mk_chan_pair();
var c1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21186,(0),null);
var c2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21186,(1),null);
return cljs_thread.msg.dist_port(id1,id2,c1,c2);
});
cljs_thread.spawn.meshify = (function cljs_thread$spawn$meshify(id){
var peer_ids = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.complement(cljs.core.PersistentHashSet.createAsIfByAssoc([new cljs.core.Keyword(null,"parent","parent",-878878779),id])),cljs.core.keys(cljs.core.deref(cljs_thread.state.peers)));
if(cljs.core.seq(peer_ids)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs_thread.spawn.pair_ids,id),peer_ids);
} else {
return null;
}
});
cljs_thread.spawn.local_spawn = (function cljs_thread$spawn$local_spawn(p__21193){
var map__21194 = p__21193;
var map__21194__$1 = cljs.core.__destructure_map(map__21194);
var data = map__21194__$1;
var deamon_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21194__$1,new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262));
var id = cljs_thread.spawn.root_spawn(data);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(id,new cljs.core.Keyword(null,"sw","sw",833113913))){
} else {
if(cljs.core.truth_(deamon_QMARK_)){
cljs_thread.spawn.meshify(id);
} else {
}
}

return id;
});
cljs_thread.msg.dispatch.cljs$core$IMultiFn$_add_method$arity$3(null, new cljs.core.Keyword(null,"spawn","spawn",-1213583293),(function (p__21195){
var map__21196 = p__21195;
var map__21196__$1 = cljs.core.__destructure_map(map__21196);
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21196__$1,new cljs.core.Keyword(null,"data","data",-232669377));
return cljs_thread.spawn.local_spawn(data);
}));
cljs_thread.spawn.send_spawn = (function cljs_thread$spawn$send_spawn(id,data){
return cljs_thread.msg.post(id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"dispatch","dispatch",1319337009),new cljs.core.Keyword(null,"spawn","spawn",-1213583293),new cljs.core.Keyword(null,"data","data",-232669377),data], null));
});
cljs_thread.spawn.do_spawn = (function cljs_thread$spawn$do_spawn(eargs,p__21197,efn){
var map__21202 = p__21197;
var map__21202__$1 = cljs.core.__destructure_map(map__21202);
var data = map__21202__$1;
var caller = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21202__$1,new cljs.core.Keyword(null,"caller","caller",-1275362879));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21202__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var yield_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21202__$1,new cljs.core.Keyword(null,"yield?","yield?",-2100785447));
var go_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21202__$1,new cljs.core.Keyword(null,"go?","go?",966681578));
var worker_id = (function (){var or__5045__auto__ = id;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.util.gen_id.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data], 0));
}
})();
var spawn_data = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([data,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"to","to",192099007),new cljs.core.Keyword(null,"root","root",-448657453)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"deamon?","deamon?",-1569034262),true,new cljs.core.Keyword(null,"id","id",-1388402092),worker_id], null),(cljs.core.truth_(caller)?null:new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"caller","caller",-1275362879),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data)], null))], 0));
if((function (){var or__5045__auto__ = cljs_thread.util.in_safari_QMARK_();
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"sw","sw",833113913),worker_id);
}
})()){
if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
cljs_thread.spawn.local_spawn(spawn_data);
} else {
cljs_thread.spawn.send_spawn(new cljs.core.Keyword(null,"screen","screen",1990059748),spawn_data);
}
} else {
cljs_thread.spawn.local_spawn(spawn_data);
}

if(cljs.core.truth_(efn)){
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(worker_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([eargs,efn,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"yield?","yield?",-2100785447),yield_QMARK_,new cljs.core.Keyword(null,"go?","go?",966681578),go_QMARK_], null)], 0));
} else {
return cljs_thread.sync.wrap_derefable(spawn_data);
}
});
goog.exportSymbol('cljs_thread.spawn.do_spawn', cljs_thread.spawn.do_spawn);

//# sourceMappingURL=cljs_thread.spawn.js.map
