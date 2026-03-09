goog.provide('cljs_thread.dom.constructors');
if((typeof cljs_thread !== 'undefined') && (typeof cljs_thread.dom !== 'undefined') && (typeof cljs_thread.dom.constructors !== 'undefined') && (typeof cljs_thread.dom.constructors.installed_QMARK_ !== 'undefined')){
} else {
cljs_thread.dom.constructors.installed_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
/**
 * Install synthetic DOM constructors on globalThis.
 * Idempotent — safe to call multiple times.
 */
cljs_thread.dom.constructors.install_BANG_ = (function cljs_thread$dom$constructors$install_BANG_(){
if(cljs.core.truth_(cljs.core.deref(cljs_thread.dom.constructors.installed_QMARK_))){
return null;
} else {
cljs.core.reset_BANG_(cljs_thread.dom.constructors.installed_QMARK_,true);

if(cljs.core.truth_(cljs_thread.env.in_screen_QMARK_())){
return null;
} else {
var NodeProto = Object.create(null);
var ElementProto = Object.create(NodeProto);
var HTMLElementProto = Object.create(ElementProto);
var DocumentProto = Object.create(NodeProto);
var make_ctor = (function (name,proto){
var ctor = (new Function(""));
(ctor.prototype = proto);

(proto["constructor"] = ctor);

(ctor["__dom_constructor_name"] = name);

return ctor;
});
var NodeCtor = make_ctor("Node",NodeProto);
var ElementCtor = make_ctor("Element",ElementProto);
var HTMLElementCtor = make_ctor("HTMLElement",HTMLElementProto);
var DocumentCtor = make_ctor("Document",DocumentProto);
(globalThis["Node"] = NodeCtor);

(globalThis["Element"] = ElementCtor);

(globalThis["HTMLElement"] = HTMLElementCtor);

(globalThis["Document"] = DocumentCtor);

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"node","node",581201198),NodeProto,new cljs.core.Keyword(null,"element","element",1974019749),ElementProto,new cljs.core.Keyword(null,"html-element","html-element",1188696850),HTMLElementProto,new cljs.core.Keyword(null,"document","document",-1329188687),DocumentProto], null);
}
}
});

//# sourceMappingURL=cljs_thread.dom.constructors.js.map
