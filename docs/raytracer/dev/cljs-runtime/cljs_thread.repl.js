goog.provide('cljs_thread.repl');
cljs_thread.repl.dbg_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.PersistentHashSet.EMPTY], null));
cljs_thread.repl.local_dbg_id = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs_thread.repl.dbg_repl = (function cljs_thread$repl$dbg_repl(){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"repl-sync","repl-sync",-497551094),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))){
var dbg_id = cljs_thread.util.gen_id();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.repl.dbg_atom,cljs.core.update,new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([dbg_id], 0));

while(true){
var map__21302 = cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"dbg-req","dbg-req",-354398644),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),"dbg-repl"], null)], 0));
var map__21302__$1 = cljs.core.__destructure_map(map__21302);
var sfn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21302__$1,new cljs.core.Keyword(null,"sfn","sfn",-736336514));
var sargs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21302__$1,new cljs.core.Keyword(null,"sargs","sargs",1421118304));
var break$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21302__$1,new cljs.core.Keyword(null,"break","break",126570225));
var dbg_id__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21302__$1,new cljs.core.Keyword(null,"dbg-id","dbg-id",-448626108));
if(cljs.core.truth_(break$)){
cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356),new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.Keyword(null,"no-break-running!","no-break-running!",503648729)], null));

continue;
} else {
var _ = cljs.core.reset_BANG_(cljs_thread.repl.local_dbg_id,dbg_id__$1);
var result = cljs_thread.in$.do_call(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),sfn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),sargs,new cljs.core.Keyword(null,"local?","local?",-1422786101),true], null)], null));
cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356),new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"end-session?","end-session?",-1450293247),true,new cljs.core.Keyword(null,"res","res",-1395007879),result], null)], null));

continue;
}
break;
}
} else {
return null;
}
});
cljs_thread.repl.do_break = (function cljs_thread$repl$do_break(symvals,ctx,expr){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"repl-sync","repl-sync",-497551094),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data))){
var when_res = cljs_thread.in$.do_call(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),cljs.core.str.cljs$core$IFn$_invoke$arity$1(expr),new cljs.core.Keyword(null,"sargs","sargs",1421118304),cljs.core.vec(cljs.core.vals(symvals)),new cljs.core.Keyword(null,"local?","local?",-1422786101),true], null)], null));
if(cljs.core.not(when_res)){
return expr;
} else {
var dbg_id = cljs_thread.util.gen_id();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.repl.dbg_atom,cljs.core.update,new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.conj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([dbg_id], 0));

cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356),new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.Keyword(null,"starting-dbg","starting-dbg",-504789346)], null));

while(true){
var map__21316 = cljs_thread.sync.request.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"dbg-req","dbg-req",-354398644),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"park","park",225536187),true,new cljs.core.Keyword(null,"max-time","max-time",857408479),(((1000) * (60)) * (60)),new cljs.core.Keyword(null,"duration","duration",1444101068),(500)], null)], 0));
var map__21316__$1 = cljs.core.__destructure_map(map__21316);
var sfn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21316__$1,new cljs.core.Keyword(null,"sfn","sfn",-736336514));
var sargs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21316__$1,new cljs.core.Keyword(null,"sargs","sargs",1421118304));
var break$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21316__$1,new cljs.core.Keyword(null,"break","break",126570225));
if(cljs.core.not(break$)){
return cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356),new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.Keyword(null,"dbg-already-running!","dbg-already-running!",1787222883)], null));
} else {
var conveyer = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(symvals,sargs);
var result = cljs_thread.in$.do_call(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),sfn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),conveyer,new cljs.core.Keyword(null,"local?","local?",-1422786101),true], null)], null));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("in","exit","in/exit",351852865),result)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(cljs_thread.repl.dbg_atom,cljs.core.update,new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.disj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([dbg_id], 0));

return expr;
} else {
cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356),new cljs.core.Keyword(null,"response","response",-1068424192),result], null));

continue;
}
}
break;
}
}
} else {
return null;
}
});
cljs_thread.repl.remote_break = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
cljs_thread.repl.break_running_QMARK_ = (function cljs_thread$repl$break_running_QMARK_(){
return (!((cljs.core.deref(cljs_thread.repl.remote_break) == null)));
});
cljs_thread.repl.do_dbg = (function cljs_thread$repl$do_dbg(afn){
var sfn = cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn);
var break_id = cljs_thread.util.gen_id();
if(cljs_thread.repl.break_running_QMARK_()){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"break-running!","break-running!",-291419904)], 0));
} else {
cljs.core.reset_BANG_(cljs_thread.repl.remote_break,break_id);

cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-req","dbg-req",-354398644),new cljs.core.Keyword(null,"dbg-id","dbg-id",-448626108),break_id,new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sfn","sfn",-736336514),sfn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356)], null)], null));

var result = cljs_thread.sync.request(new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356));
return result;
}
});
cljs_thread.repl.dbg__GT_ = (function cljs_thread$repl$dbg__GT_(symbols,afn){
if((!(cljs_thread.repl.break_running_QMARK_()))){
return (afn.cljs$core$IFn$_invoke$arity$0 ? afn.cljs$core$IFn$_invoke$arity$0() : afn.call(null, ));
} else {
var sfn = cljs.core.str.cljs$core$IFn$_invoke$arity$1(afn);
cljs_thread.sync.send_response(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-req","dbg-req",-354398644),new cljs.core.Keyword(null,"response","response",-1068424192),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"break","break",126570225),true,new cljs.core.Keyword(null,"sfn","sfn",-736336514),sfn,new cljs.core.Keyword(null,"sargs","sargs",1421118304),symbols,new cljs.core.Keyword(null,"request-id","request-id",-985684093),new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356)], null)], null));

var map__21337 = cljs_thread.sync.request(new cljs.core.Keyword(null,"dbg-res","dbg-res",808425356));
var map__21337__$1 = cljs.core.__destructure_map(map__21337);
var result = map__21337__$1;
var end_session_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21337__$1,new cljs.core.Keyword(null,"end-session?","end-session?",-1450293247));
var res = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21337__$1,new cljs.core.Keyword(null,"res","res",-1395007879));
if(cljs.core.truth_(end_session_QMARK_)){
cljs.core.reset_BANG_(cljs_thread.repl.remote_break,null);

return res;
} else {
return result;
}
}
});
cljs_thread.repl.start_repl = (function cljs_thread$repl$start_repl(configs){
if(cljs.core.truth_((function (){var and__5043__auto__ = goog.DEBUG;
if(cljs.core.truth_(and__5043__auto__)){
return new cljs.core.Keyword(null,"repl-connect-string","repl-connect-string",1078047583).cljs$core$IFn$_invoke$arity$1(configs);
} else {
return and__5043__auto__;
}
})())){
cljs_thread.spawn.do_spawn(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [configs], null),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"repl","repl",-35398667)], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (configs__$1){
return cljs_thread.state.update_conf_BANG_(configs__$1);
})));

return cljs_thread.spawn.do_spawn(cljs.core.PersistentVector.EMPTY,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"repl-sync","repl-sync",-497551094),new cljs.core.Keyword(null,"no-globals?","no-globals?",957905142),true], null),new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0)),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){
return cljs_thread.on_when.do_on_when((function (){
return cljs.core.contains_QMARK_(cljs.core.deref(cljs_thread.state.peers),new cljs.core.Keyword(null,"core","core",-86019209));
}),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"timeout-data","timeout-data",1163782365),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ns","ns",441598760),"cljs-thread.repl",new cljs.core.Keyword(null,"line","line",212345235),91], null)),(function (){
return cljs_thread.repl.dbg_repl();
}));
})));
} else {
return null;
}
});

//# sourceMappingURL=cljs_thread.repl.js.map
