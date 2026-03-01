goog.provide('cljs_thread.dom.install');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.install !== 'undefined') && (typeof cljs_thread.dom.install.installed_QMARK_ !== 'undefined')){
} else {
cljs_thread.dom.install.installed_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
/**
 * Install DOM proxy objects on the worker's globalThis.
 * Idempotent — safe to call multiple times.
 * No-op on the screen thread.
 */
cljs_thread.dom.install.install_BANG_ = (function cljs_thread$dom$install$install_BANG_(){
if(((cljs.core.not(cljs_thread.env.in_screen_QMARK_())) && (cljs.core.not(cljs.core.deref(cljs_thread.dom.install.installed_QMARK_))))){
cljs.core.reset_BANG_(cljs_thread.dom.install.installed_QMARK_,true);

cljs_thread.dom.constructors.install_BANG_();

var doc_proxy = cljs_thread.dom.proxy.document_proxy();
var win_proxy = cljs_thread.dom.proxy.window_proxy();
Object.defineProperty(globalThis,"document",({"get": (function (){
return doc_proxy;
}), "configurable": true}));

Object.defineProperty(globalThis,"window",({"get": (function (){
return win_proxy;
}), "configurable": true}));

Object.defineProperty(globalThis,"navigator",({"get": (function (){
return (win_proxy["navigator"]);
}), "configurable": true}));

Object.defineProperty(globalThis,"location",({"get": (function (){
return (win_proxy["location"]);
}), "configurable": true}));

Object.defineProperty(globalThis,"history",({"get": (function (){
return (win_proxy["history"]);
}), "configurable": true}));

Object.defineProperty(globalThis,"localStorage",({"get": (function (){
return (win_proxy["localStorage"]);
}), "configurable": true}));

return Object.defineProperty(globalThis,"sessionStorage",({"get": (function (){
return (win_proxy["sessionStorage"]);
}), "configurable": true}));
} else {
return null;
}
});
/**
 * Check if DOM proxies have been installed. For testing.
 */
cljs_thread.dom.install.installed_QMARK__STAR_ = (function cljs_thread$dom$install$installed_QMARK__STAR_(){
return cljs.core.deref(cljs_thread.dom.install.installed_QMARK_);
});
cljs_thread.dom.install.install_BANG_();

//# sourceMappingURL=cljs_thread.dom.install.js.map
