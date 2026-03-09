goog.provide('shadow.remote.runtime.tap_support');
shadow.remote.runtime.tap_support.tap_subscribe = (function shadow$remote$runtime$tap_support$tap_subscribe(p__33799,p__33800){
var map__33801 = p__33799;
var map__33801__$1 = cljs.core.__destructure_map(map__33801);
var svc = map__33801__$1;
var subs_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33801__$1,new cljs.core.Keyword(null,"subs-ref","subs-ref",-1355989911));
var obj_support = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33801__$1,new cljs.core.Keyword(null,"obj-support","obj-support",1522559229));
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33801__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var map__33802 = p__33800;
var map__33802__$1 = cljs.core.__destructure_map(map__33802);
var msg = map__33802__$1;
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33802__$1,new cljs.core.Keyword(null,"from","from",1815293044));
var summary = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33802__$1,new cljs.core.Keyword(null,"summary","summary",380847952));
var history__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33802__$1,new cljs.core.Keyword(null,"history","history",-247395220));
var num = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__33802__$1,new cljs.core.Keyword(null,"num","num",1985240673),(10));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(subs_ref,cljs.core.assoc,from,msg);

if(cljs.core.truth_(history__$1)){
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"tap-subscribed","tap-subscribed",-1882247432),new cljs.core.Keyword(null,"history","history",-247395220),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (oid){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"oid","oid",-768692334),oid,new cljs.core.Keyword(null,"summary","summary",380847952),shadow.remote.runtime.obj_support.obj_describe_STAR_(obj_support,oid)], null);
}),shadow.remote.runtime.obj_support.get_tap_history(obj_support,num)))], null));
} else {
return null;
}
});
shadow.remote.runtime.tap_support.tap_unsubscribe = (function shadow$remote$runtime$tap_support$tap_unsubscribe(p__33820,p__33821){
var map__33823 = p__33820;
var map__33823__$1 = cljs.core.__destructure_map(map__33823);
var subs_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33823__$1,new cljs.core.Keyword(null,"subs-ref","subs-ref",-1355989911));
var map__33824 = p__33821;
var map__33824__$1 = cljs.core.__destructure_map(map__33824);
var from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33824__$1,new cljs.core.Keyword(null,"from","from",1815293044));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(subs_ref,cljs.core.dissoc,from);
});
shadow.remote.runtime.tap_support.request_tap_history = (function shadow$remote$runtime$tap_support$request_tap_history(p__33837,p__33838){
var map__33839 = p__33837;
var map__33839__$1 = cljs.core.__destructure_map(map__33839);
var obj_support = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33839__$1,new cljs.core.Keyword(null,"obj-support","obj-support",1522559229));
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33839__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var map__33840 = p__33838;
var map__33840__$1 = cljs.core.__destructure_map(map__33840);
var msg = map__33840__$1;
var num = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__33840__$1,new cljs.core.Keyword(null,"num","num",1985240673),(10));
var tap_ids = shadow.remote.runtime.obj_support.get_tap_history(obj_support,num);
return shadow.remote.runtime.shared.reply(runtime,msg,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"tap-history","tap-history",-282803347),new cljs.core.Keyword(null,"oids","oids",-1580877688),tap_ids], null));
});
shadow.remote.runtime.tap_support.tool_disconnect = (function shadow$remote$runtime$tap_support$tool_disconnect(p__33847,tid){
var map__33848 = p__33847;
var map__33848__$1 = cljs.core.__destructure_map(map__33848);
var svc = map__33848__$1;
var subs_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33848__$1,new cljs.core.Keyword(null,"subs-ref","subs-ref",-1355989911));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(subs_ref,cljs.core.dissoc,tid);
});
shadow.remote.runtime.tap_support.start = (function shadow$remote$runtime$tap_support$start(runtime,obj_support){
var subs_ref = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var tap_fn = (function shadow$remote$runtime$tap_support$start_$_runtime_tap(obj){
if((!((obj == null)))){
var oid = shadow.remote.runtime.obj_support.register(obj_support,obj,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.Keyword(null,"tap","tap",-1086702463)], null));
var seq__33874 = cljs.core.seq(cljs.core.deref(subs_ref));
var chunk__33875 = null;
var count__33876 = (0);
var i__33877 = (0);
while(true){
if((i__33877 < count__33876)){
var vec__33891 = chunk__33875.cljs$core$IIndexed$_nth$arity$2(null, i__33877);
var tid = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33891,(0),null);
var tap_config = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33891,(1),null);
shadow.remote.runtime.api.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"tap","tap",-1086702463),new cljs.core.Keyword(null,"to","to",192099007),tid,new cljs.core.Keyword(null,"oid","oid",-768692334),oid], null));


var G__33925 = seq__33874;
var G__33926 = chunk__33875;
var G__33927 = count__33876;
var G__33928 = (i__33877 + (1));
seq__33874 = G__33925;
chunk__33875 = G__33926;
count__33876 = G__33927;
i__33877 = G__33928;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__33874);
if(temp__5823__auto__){
var seq__33874__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__33874__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__33874__$1);
var G__33929 = cljs.core.chunk_rest(seq__33874__$1);
var G__33930 = c__5568__auto__;
var G__33931 = cljs.core.count(c__5568__auto__);
var G__33932 = (0);
seq__33874 = G__33929;
chunk__33875 = G__33930;
count__33876 = G__33931;
i__33877 = G__33932;
continue;
} else {
var vec__33896 = cljs.core.first(seq__33874__$1);
var tid = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33896,(0),null);
var tap_config = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33896,(1),null);
shadow.remote.runtime.api.relay_msg(runtime,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"tap","tap",-1086702463),new cljs.core.Keyword(null,"to","to",192099007),tid,new cljs.core.Keyword(null,"oid","oid",-768692334),oid], null));


var G__33934 = cljs.core.next(seq__33874__$1);
var G__33935 = null;
var G__33936 = (0);
var G__33937 = (0);
seq__33874 = G__33934;
chunk__33875 = G__33935;
count__33876 = G__33936;
i__33877 = G__33937;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
});
var svc = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime,new cljs.core.Keyword(null,"obj-support","obj-support",1522559229),obj_support,new cljs.core.Keyword(null,"tap-fn","tap-fn",1573556461),tap_fn,new cljs.core.Keyword(null,"subs-ref","subs-ref",-1355989911),subs_ref], null);
shadow.remote.runtime.api.add_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.tap-support","ext","shadow.remote.runtime.tap-support/ext",1019069674),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tap-subscribe","tap-subscribe",411179050),(function (p1__33854_SHARP_){
return shadow.remote.runtime.tap_support.tap_subscribe(svc,p1__33854_SHARP_);
}),new cljs.core.Keyword(null,"tap-unsubscribe","tap-unsubscribe",1183890755),(function (p1__33855_SHARP_){
return shadow.remote.runtime.tap_support.tap_unsubscribe(svc,p1__33855_SHARP_);
}),new cljs.core.Keyword(null,"request-tap-history","request-tap-history",-670837812),(function (p1__33857_SHARP_){
return shadow.remote.runtime.tap_support.request_tap_history(svc,p1__33857_SHARP_);
})], null),new cljs.core.Keyword(null,"on-tool-disconnect","on-tool-disconnect",693464366),(function (p1__33862_SHARP_){
return shadow.remote.runtime.tap_support.tool_disconnect(svc,p1__33862_SHARP_);
})], null));

cljs.core.add_tap(tap_fn);

return svc;
});
shadow.remote.runtime.tap_support.stop = (function shadow$remote$runtime$tap_support$stop(p__33899){
var map__33900 = p__33899;
var map__33900__$1 = cljs.core.__destructure_map(map__33900);
var svc = map__33900__$1;
var tap_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33900__$1,new cljs.core.Keyword(null,"tap-fn","tap-fn",1573556461));
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33900__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
cljs.core.remove_tap(tap_fn);

return shadow.remote.runtime.api.del_extension(runtime,new cljs.core.Keyword("shadow.remote.runtime.tap-support","ext","shadow.remote.runtime.tap-support/ext",1019069674));
});

//# sourceMappingURL=shadow.remote.runtime.tap_support.js.map
