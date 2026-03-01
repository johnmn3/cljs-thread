goog.provide('shadow.dom');
shadow.dom.transition_supported_QMARK_ = true;

/**
 * @interface
 */
shadow.dom.IElement = function(){};

var shadow$dom$IElement$_to_dom$dyn_28532 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (shadow.dom._to_dom[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (shadow.dom._to_dom["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("IElement.-to-dom",this$);
}
}
});
shadow.dom._to_dom = (function shadow$dom$_to_dom(this$){
if((((!((this$ == null)))) && ((!((this$.shadow$dom$IElement$_to_dom$arity$1 == null)))))){
return this$.shadow$dom$IElement$_to_dom$arity$1(this$);
} else {
return shadow$dom$IElement$_to_dom$dyn_28532(this$);
}
});


/**
 * @interface
 */
shadow.dom.SVGElement = function(){};

var shadow$dom$SVGElement$_to_svg$dyn_28536 = (function (this$){
var x__5393__auto__ = (((this$ == null))?null:this$);
var m__5394__auto__ = (shadow.dom._to_svg[goog.typeOf(x__5393__auto__)]);
if((!((m__5394__auto__ == null)))){
return (m__5394__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5394__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5394__auto__.call(null, this$));
} else {
var m__5392__auto__ = (shadow.dom._to_svg["_"]);
if((!((m__5392__auto__ == null)))){
return (m__5392__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5392__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5392__auto__.call(null, this$));
} else {
throw cljs.core.missing_protocol("SVGElement.-to-svg",this$);
}
}
});
shadow.dom._to_svg = (function shadow$dom$_to_svg(this$){
if((((!((this$ == null)))) && ((!((this$.shadow$dom$SVGElement$_to_svg$arity$1 == null)))))){
return this$.shadow$dom$SVGElement$_to_svg$arity$1(this$);
} else {
return shadow$dom$SVGElement$_to_svg$dyn_28536(this$);
}
});

shadow.dom.lazy_native_coll_seq = (function shadow$dom$lazy_native_coll_seq(coll,idx){
if((idx < coll.length)){
return (new cljs.core.LazySeq(null,(function (){
return cljs.core.cons((coll[idx]),(function (){var G__26688 = coll;
var G__26689 = (idx + (1));
return (shadow.dom.lazy_native_coll_seq.cljs$core$IFn$_invoke$arity$2 ? shadow.dom.lazy_native_coll_seq.cljs$core$IFn$_invoke$arity$2(G__26688,G__26689) : shadow.dom.lazy_native_coll_seq.call(null, G__26688,G__26689));
})());
}),null,null));
} else {
return null;
}
});

/**
* @constructor
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IDeref}
 * @implements {shadow.dom.IElement}
*/
shadow.dom.NativeColl = (function (coll){
this.coll = coll;
this.cljs$lang$protocol_mask$partition0$ = 8421394;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(shadow.dom.NativeColl.prototype.cljs$core$IDeref$_deref$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return self__.coll;
}));

(shadow.dom.NativeColl.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (this$,n){
var self__ = this;
var this$__$1 = this;
return (self__.coll[n]);
}));

(shadow.dom.NativeColl.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
var or__5045__auto__ = (self__.coll[n]);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return not_found;
}
}));

(shadow.dom.NativeColl.prototype.cljs$core$ICounted$_count$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return self__.coll.length;
}));

(shadow.dom.NativeColl.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return shadow.dom.lazy_native_coll_seq(self__.coll,(0));
}));

(shadow.dom.NativeColl.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(shadow.dom.NativeColl.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
return self__.coll;
}));

(shadow.dom.NativeColl.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"coll","coll",-1006698606,null)], null);
}));

(shadow.dom.NativeColl.cljs$lang$type = true);

(shadow.dom.NativeColl.cljs$lang$ctorStr = "shadow.dom/NativeColl");

(shadow.dom.NativeColl.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"shadow.dom/NativeColl");
}));

/**
 * Positional factory function for shadow.dom/NativeColl.
 */
shadow.dom.__GT_NativeColl = (function shadow$dom$__GT_NativeColl(coll){
return (new shadow.dom.NativeColl(coll));
});

shadow.dom.native_coll = (function shadow$dom$native_coll(coll){
return (new shadow.dom.NativeColl(coll));
});
shadow.dom.dom_node = (function shadow$dom$dom_node(el){
if((el == null)){
return null;
} else {
if((((!((el == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === el.shadow$dom$IElement$))))?true:false):false)){
return el.shadow$dom$IElement$_to_dom$arity$1(null, );
} else {
if(typeof el === 'string'){
return document.createTextNode(el);
} else {
if(typeof el === 'number'){
return document.createTextNode(cljs.core.str.cljs$core$IFn$_invoke$arity$1(el));
} else {
return el;

}
}
}
}
});
shadow.dom.query_one = (function shadow$dom$query_one(var_args){
var G__26693 = arguments.length;
switch (G__26693) {
case 1:
return shadow.dom.query_one.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.query_one.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.query_one.cljs$core$IFn$_invoke$arity$1 = (function (sel){
return document.querySelector(sel);
}));

(shadow.dom.query_one.cljs$core$IFn$_invoke$arity$2 = (function (sel,root){
return shadow.dom.dom_node(root).querySelector(sel);
}));

(shadow.dom.query_one.cljs$lang$maxFixedArity = 2);

shadow.dom.query = (function shadow$dom$query(var_args){
var G__26702 = arguments.length;
switch (G__26702) {
case 1:
return shadow.dom.query.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.query.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.query.cljs$core$IFn$_invoke$arity$1 = (function (sel){
return (new shadow.dom.NativeColl(document.querySelectorAll(sel)));
}));

(shadow.dom.query.cljs$core$IFn$_invoke$arity$2 = (function (sel,root){
return (new shadow.dom.NativeColl(shadow.dom.dom_node(root).querySelectorAll(sel)));
}));

(shadow.dom.query.cljs$lang$maxFixedArity = 2);

shadow.dom.by_id = (function shadow$dom$by_id(var_args){
var G__26716 = arguments.length;
switch (G__26716) {
case 2:
return shadow.dom.by_id.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 1:
return shadow.dom.by_id.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.by_id.cljs$core$IFn$_invoke$arity$2 = (function (id,el){
return shadow.dom.dom_node(el).getElementById(id);
}));

(shadow.dom.by_id.cljs$core$IFn$_invoke$arity$1 = (function (id){
return document.getElementById(id);
}));

(shadow.dom.by_id.cljs$lang$maxFixedArity = 2);

shadow.dom.build = shadow.dom.dom_node;
shadow.dom.ev_stop = (function shadow$dom$ev_stop(var_args){
var G__26720 = arguments.length;
switch (G__26720) {
case 1:
return shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$1 = (function (e){
if(cljs.core.truth_(e.stopPropagation)){
e.stopPropagation();

e.preventDefault();
} else {
(e.cancelBubble = true);

(e.returnValue = false);
}

return e;
}));

(shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$2 = (function (e,el){
shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$1(e);

return el;
}));

(shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$4 = (function (e,el,scope,owner){
shadow.dom.ev_stop.cljs$core$IFn$_invoke$arity$1(e);

return el;
}));

(shadow.dom.ev_stop.cljs$lang$maxFixedArity = 4);

/**
 * check wether a parent node (or the document) contains the child
 */
shadow.dom.contains_QMARK_ = (function shadow$dom$contains_QMARK_(var_args){
var G__26741 = arguments.length;
switch (G__26741) {
case 1:
return shadow.dom.contains_QMARK_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.contains_QMARK_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.contains_QMARK_.cljs$core$IFn$_invoke$arity$1 = (function (el){
return goog.dom.contains(document,shadow.dom.dom_node(el));
}));

(shadow.dom.contains_QMARK_.cljs$core$IFn$_invoke$arity$2 = (function (parent,el){
return goog.dom.contains(shadow.dom.dom_node(parent),shadow.dom.dom_node(el));
}));

(shadow.dom.contains_QMARK_.cljs$lang$maxFixedArity = 2);

shadow.dom.add_class = (function shadow$dom$add_class(el,cls){
return goog.dom.classlist.add(shadow.dom.dom_node(el),cls);
});
shadow.dom.remove_class = (function shadow$dom$remove_class(el,cls){
return goog.dom.classlist.remove(shadow.dom.dom_node(el),cls);
});
shadow.dom.toggle_class = (function shadow$dom$toggle_class(var_args){
var G__26784 = arguments.length;
switch (G__26784) {
case 2:
return shadow.dom.toggle_class.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return shadow.dom.toggle_class.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.toggle_class.cljs$core$IFn$_invoke$arity$2 = (function (el,cls){
return goog.dom.classlist.toggle(shadow.dom.dom_node(el),cls);
}));

(shadow.dom.toggle_class.cljs$core$IFn$_invoke$arity$3 = (function (el,cls,v){
if(cljs.core.truth_(v)){
return shadow.dom.add_class(el,cls);
} else {
return shadow.dom.remove_class(el,cls);
}
}));

(shadow.dom.toggle_class.cljs$lang$maxFixedArity = 3);

shadow.dom.dom_listen = (cljs.core.truth_((function (){var or__5045__auto__ = (!((typeof document !== 'undefined')));
if(or__5045__auto__){
return or__5045__auto__;
} else {
return document.addEventListener;
}
})())?(function shadow$dom$dom_listen_good(el,ev,handler){
return el.addEventListener(ev,handler,false);
}):(function shadow$dom$dom_listen_ie(el,ev,handler){
try{return el.attachEvent(["on",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ev)].join(''),(function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
}));
}catch (e26808){if((e26808 instanceof Object)){
var e = e26808;
return console.log("didnt support attachEvent",el,e);
} else {
throw e26808;

}
}}));
shadow.dom.dom_listen_remove = (cljs.core.truth_((function (){var or__5045__auto__ = (!((typeof document !== 'undefined')));
if(or__5045__auto__){
return or__5045__auto__;
} else {
return document.removeEventListener;
}
})())?(function shadow$dom$dom_listen_remove_good(el,ev,handler){
return el.removeEventListener(ev,handler,false);
}):(function shadow$dom$dom_listen_remove_ie(el,ev,handler){
return el.detachEvent(["on",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ev)].join(''),handler);
}));
shadow.dom.on_query = (function shadow$dom$on_query(root_el,ev,selector,handler){
var seq__26847 = cljs.core.seq(shadow.dom.query.cljs$core$IFn$_invoke$arity$2(selector,root_el));
var chunk__26848 = null;
var count__26849 = (0);
var i__26850 = (0);
while(true){
if((i__26850 < count__26849)){
var el = chunk__26848.cljs$core$IIndexed$_nth$arity$2(null, i__26850);
var handler_28610__$1 = ((function (seq__26847,chunk__26848,count__26849,i__26850,el){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26847,chunk__26848,count__26849,i__26850,el))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28610__$1);


var G__28613 = seq__26847;
var G__28614 = chunk__26848;
var G__28615 = count__26849;
var G__28616 = (i__26850 + (1));
seq__26847 = G__28613;
chunk__26848 = G__28614;
count__26849 = G__28615;
i__26850 = G__28616;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26847);
if(temp__5823__auto__){
var seq__26847__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26847__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26847__$1);
var G__28619 = cljs.core.chunk_rest(seq__26847__$1);
var G__28620 = c__5568__auto__;
var G__28621 = cljs.core.count(c__5568__auto__);
var G__28622 = (0);
seq__26847 = G__28619;
chunk__26848 = G__28620;
count__26849 = G__28621;
i__26850 = G__28622;
continue;
} else {
var el = cljs.core.first(seq__26847__$1);
var handler_28623__$1 = ((function (seq__26847,chunk__26848,count__26849,i__26850,el,seq__26847__$1,temp__5823__auto__){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26847,chunk__26848,count__26849,i__26850,el,seq__26847__$1,temp__5823__auto__))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28623__$1);


var G__28625 = cljs.core.next(seq__26847__$1);
var G__28626 = null;
var G__28627 = (0);
var G__28628 = (0);
seq__26847 = G__28625;
chunk__26848 = G__28626;
count__26849 = G__28627;
i__26850 = G__28628;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.dom.on = (function shadow$dom$on(var_args){
var G__26929 = arguments.length;
switch (G__26929) {
case 3:
return shadow.dom.on.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return shadow.dom.on.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.on.cljs$core$IFn$_invoke$arity$3 = (function (el,ev,handler){
return shadow.dom.on.cljs$core$IFn$_invoke$arity$4(el,ev,handler,false);
}));

(shadow.dom.on.cljs$core$IFn$_invoke$arity$4 = (function (el,ev,handler,capture){
if(cljs.core.vector_QMARK_(ev)){
return shadow.dom.on_query(el,cljs.core.first(ev),cljs.core.second(ev),handler);
} else {
var handler__$1 = (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});
return shadow.dom.dom_listen(shadow.dom.dom_node(el),cljs.core.name(ev),handler__$1);
}
}));

(shadow.dom.on.cljs$lang$maxFixedArity = 4);

shadow.dom.remove_event_handler = (function shadow$dom$remove_event_handler(el,ev,handler){
return shadow.dom.dom_listen_remove(shadow.dom.dom_node(el),cljs.core.name(ev),handler);
});
shadow.dom.add_event_listeners = (function shadow$dom$add_event_listeners(el,events){
var seq__26978 = cljs.core.seq(events);
var chunk__26980 = null;
var count__26981 = (0);
var i__26982 = (0);
while(true){
if((i__26982 < count__26981)){
var vec__27008 = chunk__26980.cljs$core$IIndexed$_nth$arity$2(null, i__26982);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27008,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27008,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28654 = seq__26978;
var G__28655 = chunk__26980;
var G__28656 = count__26981;
var G__28657 = (i__26982 + (1));
seq__26978 = G__28654;
chunk__26980 = G__28655;
count__26981 = G__28656;
i__26982 = G__28657;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26978);
if(temp__5823__auto__){
var seq__26978__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26978__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26978__$1);
var G__28658 = cljs.core.chunk_rest(seq__26978__$1);
var G__28659 = c__5568__auto__;
var G__28660 = cljs.core.count(c__5568__auto__);
var G__28661 = (0);
seq__26978 = G__28658;
chunk__26980 = G__28659;
count__26981 = G__28660;
i__26982 = G__28661;
continue;
} else {
var vec__27032 = cljs.core.first(seq__26978__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27032,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27032,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28663 = cljs.core.next(seq__26978__$1);
var G__28664 = null;
var G__28665 = (0);
var G__28666 = (0);
seq__26978 = G__28663;
chunk__26980 = G__28664;
count__26981 = G__28665;
i__26982 = G__28666;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.dom.set_style = (function shadow$dom$set_style(el,styles){
var dom = shadow.dom.dom_node(el);
var seq__27057 = cljs.core.seq(styles);
var chunk__27058 = null;
var count__27059 = (0);
var i__27060 = (0);
while(true){
if((i__27060 < count__27059)){
var vec__27080 = chunk__27058.cljs$core$IIndexed$_nth$arity$2(null, i__27060);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27080,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27080,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28677 = seq__27057;
var G__28678 = chunk__27058;
var G__28679 = count__27059;
var G__28680 = (i__27060 + (1));
seq__27057 = G__28677;
chunk__27058 = G__28678;
count__27059 = G__28679;
i__27060 = G__28680;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27057);
if(temp__5823__auto__){
var seq__27057__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27057__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27057__$1);
var G__28683 = cljs.core.chunk_rest(seq__27057__$1);
var G__28684 = c__5568__auto__;
var G__28685 = cljs.core.count(c__5568__auto__);
var G__28686 = (0);
seq__27057 = G__28683;
chunk__27058 = G__28684;
count__27059 = G__28685;
i__27060 = G__28686;
continue;
} else {
var vec__27087 = cljs.core.first(seq__27057__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27087,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27087,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28694 = cljs.core.next(seq__27057__$1);
var G__28695 = null;
var G__28696 = (0);
var G__28697 = (0);
seq__27057 = G__28694;
chunk__27058 = G__28695;
count__27059 = G__28696;
i__27060 = G__28697;
continue;
}
} else {
return null;
}
}
break;
}
});
shadow.dom.set_attr_STAR_ = (function shadow$dom$set_attr_STAR_(el,key,value){
var G__27103_28699 = key;
var G__27103_28700__$1 = (((G__27103_28699 instanceof cljs.core.Keyword))?G__27103_28699.fqn:null);
switch (G__27103_28700__$1) {
case "id":
(el.id = cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));

break;
case "class":
(el.className = cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));

break;
case "for":
(el.htmlFor = value);

break;
case "cellpadding":
el.setAttribute("cellPadding",value);

break;
case "cellspacing":
el.setAttribute("cellSpacing",value);

break;
case "colspan":
el.setAttribute("colSpan",value);

break;
case "frameborder":
el.setAttribute("frameBorder",value);

break;
case "height":
el.setAttribute("height",value);

break;
case "maxlength":
el.setAttribute("maxLength",value);

break;
case "role":
el.setAttribute("role",value);

break;
case "rowspan":
el.setAttribute("rowSpan",value);

break;
case "type":
el.setAttribute("type",value);

break;
case "usemap":
el.setAttribute("useMap",value);

break;
case "valign":
el.setAttribute("vAlign",value);

break;
case "width":
el.setAttribute("width",value);

break;
case "on":
shadow.dom.add_event_listeners(el,value);

break;
case "style":
if((value == null)){
} else {
if(typeof value === 'string'){
el.setAttribute("style",value);
} else {
if(cljs.core.map_QMARK_(value)){
shadow.dom.set_style(el,value);
} else {
goog.style.setStyle(el,value);

}
}
}

break;
default:
var ks_28730 = cljs.core.name(key);
if(cljs.core.truth_((function (){var or__5045__auto__ = goog.string.startsWith(ks_28730,"data-");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return goog.string.startsWith(ks_28730,"aria-");
}
})())){
el.setAttribute(ks_28730,value);
} else {
(el[ks_28730] = value);
}

}

return el;
});
shadow.dom.set_attrs = (function shadow$dom$set_attrs(el,attrs){
return cljs.core.reduce_kv((function (el__$1,key,value){
shadow.dom.set_attr_STAR_(el__$1,key,value);

return el__$1;
}),shadow.dom.dom_node(el),attrs);
});
shadow.dom.set_attr = (function shadow$dom$set_attr(el,key,value){
return shadow.dom.set_attr_STAR_(shadow.dom.dom_node(el),key,value);
});
shadow.dom.has_class_QMARK_ = (function shadow$dom$has_class_QMARK_(el,cls){
return goog.dom.classlist.contains(shadow.dom.dom_node(el),cls);
});
shadow.dom.merge_class_string = (function shadow$dom$merge_class_string(current,extra_class){
if(cljs.core.seq(current)){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(current)," ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(extra_class)].join('');
} else {
return extra_class;
}
});
shadow.dom.parse_tag = (function shadow$dom$parse_tag(spec){
var spec__$1 = cljs.core.name(spec);
var fdot = spec__$1.indexOf(".");
var fhash = spec__$1.indexOf("#");
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((-1),fdot)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((-1),fhash)))){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [spec__$1,null,null], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((-1),fhash)){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [spec__$1.substring((0),fdot),null,clojure.string.replace(spec__$1.substring((fdot + (1))),/\./," ")], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((-1),fdot)){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [spec__$1.substring((0),fhash),spec__$1.substring((fhash + (1))),null], null);
} else {
if((fhash > fdot)){
throw ["cant have id after class?",spec__$1].join('');
} else {
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [spec__$1.substring((0),fhash),spec__$1.substring((fhash + (1)),fdot),clojure.string.replace(spec__$1.substring((fdot + (1))),/\./," ")], null);

}
}
}
}
});
shadow.dom.create_dom_node = (function shadow$dom$create_dom_node(tag_def,p__27146){
var map__27147 = p__27146;
var map__27147__$1 = cljs.core.__destructure_map(map__27147);
var props = map__27147__$1;
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27147__$1,new cljs.core.Keyword(null,"class","class",-2030961996));
var tag_props = ({});
var vec__27152 = shadow.dom.parse_tag(tag_def);
var tag_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27152,(0),null);
var tag_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27152,(1),null);
var tag_classes = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27152,(2),null);
if(cljs.core.truth_(tag_id)){
(tag_props["id"] = tag_id);
} else {
}

if(cljs.core.truth_(tag_classes)){
(tag_props["class"] = shadow.dom.merge_class_string(class$,tag_classes));
} else {
}

var G__27158 = goog.dom.createDom(tag_name,tag_props);
shadow.dom.set_attrs(G__27158,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(props,new cljs.core.Keyword(null,"class","class",-2030961996)));

return G__27158;
});
shadow.dom.append = (function shadow$dom$append(var_args){
var G__27174 = arguments.length;
switch (G__27174) {
case 1:
return shadow.dom.append.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.append.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.append.cljs$core$IFn$_invoke$arity$1 = (function (node){
if(cljs.core.truth_(node)){
var temp__5823__auto__ = shadow.dom.dom_node(node);
if(cljs.core.truth_(temp__5823__auto__)){
var n = temp__5823__auto__;
document.body.appendChild(n);

return n;
} else {
return null;
}
} else {
return null;
}
}));

(shadow.dom.append.cljs$core$IFn$_invoke$arity$2 = (function (el,node){
if(cljs.core.truth_(node)){
var temp__5823__auto__ = shadow.dom.dom_node(node);
if(cljs.core.truth_(temp__5823__auto__)){
var n = temp__5823__auto__;
shadow.dom.dom_node(el).appendChild(n);

return n;
} else {
return null;
}
} else {
return null;
}
}));

(shadow.dom.append.cljs$lang$maxFixedArity = 2);

shadow.dom.destructure_node = (function shadow$dom$destructure_node(create_fn,p__27195){
var vec__27197 = p__27195;
var seq__27198 = cljs.core.seq(vec__27197);
var first__27199 = cljs.core.first(seq__27198);
var seq__27198__$1 = cljs.core.next(seq__27198);
var nn = first__27199;
var first__27199__$1 = cljs.core.first(seq__27198__$1);
var seq__27198__$2 = cljs.core.next(seq__27198__$1);
var np = first__27199__$1;
var nc = seq__27198__$2;
var node = vec__27197;
if((nn instanceof cljs.core.Keyword)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("invalid dom node",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"node","node",581201198),node], null));
}

if((((np == null)) && ((nc == null)))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27204 = nn;
var G__27205 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27204,G__27205) : create_fn.call(null, G__27204,G__27205));
})(),cljs.core.List.EMPTY], null);
} else {
if(cljs.core.map_QMARK_(np)){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(nn,np) : create_fn.call(null, nn,np)),nc], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27207 = nn;
var G__27208 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27207,G__27208) : create_fn.call(null, G__27207,G__27208));
})(),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(nc,np)], null);

}
}
});
shadow.dom.make_dom_node = (function shadow$dom$make_dom_node(structure){
var vec__27211 = shadow.dom.destructure_node(shadow.dom.create_dom_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27211,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27211,(1),null);
var seq__27214_28778 = cljs.core.seq(node_children);
var chunk__27215_28779 = null;
var count__27216_28780 = (0);
var i__27217_28781 = (0);
while(true){
if((i__27217_28781 < count__27216_28780)){
var child_struct_28782 = chunk__27215_28779.cljs$core$IIndexed$_nth$arity$2(null, i__27217_28781);
var children_28783 = shadow.dom.dom_node(child_struct_28782);
if(cljs.core.seq_QMARK_(children_28783)){
var seq__27293_28785 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28783));
var chunk__27295_28786 = null;
var count__27296_28787 = (0);
var i__27297_28788 = (0);
while(true){
if((i__27297_28788 < count__27296_28787)){
var child_28792 = chunk__27295_28786.cljs$core$IIndexed$_nth$arity$2(null, i__27297_28788);
if(cljs.core.truth_(child_28792)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28792);


var G__28794 = seq__27293_28785;
var G__28795 = chunk__27295_28786;
var G__28796 = count__27296_28787;
var G__28797 = (i__27297_28788 + (1));
seq__27293_28785 = G__28794;
chunk__27295_28786 = G__28795;
count__27296_28787 = G__28796;
i__27297_28788 = G__28797;
continue;
} else {
var G__28802 = seq__27293_28785;
var G__28803 = chunk__27295_28786;
var G__28804 = count__27296_28787;
var G__28805 = (i__27297_28788 + (1));
seq__27293_28785 = G__28802;
chunk__27295_28786 = G__28803;
count__27296_28787 = G__28804;
i__27297_28788 = G__28805;
continue;
}
} else {
var temp__5823__auto___28806 = cljs.core.seq(seq__27293_28785);
if(temp__5823__auto___28806){
var seq__27293_28807__$1 = temp__5823__auto___28806;
if(cljs.core.chunked_seq_QMARK_(seq__27293_28807__$1)){
var c__5568__auto___28808 = cljs.core.chunk_first(seq__27293_28807__$1);
var G__28809 = cljs.core.chunk_rest(seq__27293_28807__$1);
var G__28810 = c__5568__auto___28808;
var G__28811 = cljs.core.count(c__5568__auto___28808);
var G__28812 = (0);
seq__27293_28785 = G__28809;
chunk__27295_28786 = G__28810;
count__27296_28787 = G__28811;
i__27297_28788 = G__28812;
continue;
} else {
var child_28816 = cljs.core.first(seq__27293_28807__$1);
if(cljs.core.truth_(child_28816)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28816);


var G__28822 = cljs.core.next(seq__27293_28807__$1);
var G__28823 = null;
var G__28824 = (0);
var G__28825 = (0);
seq__27293_28785 = G__28822;
chunk__27295_28786 = G__28823;
count__27296_28787 = G__28824;
i__27297_28788 = G__28825;
continue;
} else {
var G__28833 = cljs.core.next(seq__27293_28807__$1);
var G__28834 = null;
var G__28835 = (0);
var G__28836 = (0);
seq__27293_28785 = G__28833;
chunk__27295_28786 = G__28834;
count__27296_28787 = G__28835;
i__27297_28788 = G__28836;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28783);
}


var G__28841 = seq__27214_28778;
var G__28842 = chunk__27215_28779;
var G__28843 = count__27216_28780;
var G__28844 = (i__27217_28781 + (1));
seq__27214_28778 = G__28841;
chunk__27215_28779 = G__28842;
count__27216_28780 = G__28843;
i__27217_28781 = G__28844;
continue;
} else {
var temp__5823__auto___28851 = cljs.core.seq(seq__27214_28778);
if(temp__5823__auto___28851){
var seq__27214_28855__$1 = temp__5823__auto___28851;
if(cljs.core.chunked_seq_QMARK_(seq__27214_28855__$1)){
var c__5568__auto___28856 = cljs.core.chunk_first(seq__27214_28855__$1);
var G__28863 = cljs.core.chunk_rest(seq__27214_28855__$1);
var G__28864 = c__5568__auto___28856;
var G__28865 = cljs.core.count(c__5568__auto___28856);
var G__28866 = (0);
seq__27214_28778 = G__28863;
chunk__27215_28779 = G__28864;
count__27216_28780 = G__28865;
i__27217_28781 = G__28866;
continue;
} else {
var child_struct_28873 = cljs.core.first(seq__27214_28855__$1);
var children_28879 = shadow.dom.dom_node(child_struct_28873);
if(cljs.core.seq_QMARK_(children_28879)){
var seq__27322_28882 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28879));
var chunk__27324_28883 = null;
var count__27325_28884 = (0);
var i__27326_28885 = (0);
while(true){
if((i__27326_28885 < count__27325_28884)){
var child_28887 = chunk__27324_28883.cljs$core$IIndexed$_nth$arity$2(null, i__27326_28885);
if(cljs.core.truth_(child_28887)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28887);


var G__28888 = seq__27322_28882;
var G__28889 = chunk__27324_28883;
var G__28890 = count__27325_28884;
var G__28891 = (i__27326_28885 + (1));
seq__27322_28882 = G__28888;
chunk__27324_28883 = G__28889;
count__27325_28884 = G__28890;
i__27326_28885 = G__28891;
continue;
} else {
var G__28893 = seq__27322_28882;
var G__28894 = chunk__27324_28883;
var G__28895 = count__27325_28884;
var G__28896 = (i__27326_28885 + (1));
seq__27322_28882 = G__28893;
chunk__27324_28883 = G__28894;
count__27325_28884 = G__28895;
i__27326_28885 = G__28896;
continue;
}
} else {
var temp__5823__auto___28898__$1 = cljs.core.seq(seq__27322_28882);
if(temp__5823__auto___28898__$1){
var seq__27322_28900__$1 = temp__5823__auto___28898__$1;
if(cljs.core.chunked_seq_QMARK_(seq__27322_28900__$1)){
var c__5568__auto___28901 = cljs.core.chunk_first(seq__27322_28900__$1);
var G__28902 = cljs.core.chunk_rest(seq__27322_28900__$1);
var G__28903 = c__5568__auto___28901;
var G__28904 = cljs.core.count(c__5568__auto___28901);
var G__28905 = (0);
seq__27322_28882 = G__28902;
chunk__27324_28883 = G__28903;
count__27325_28884 = G__28904;
i__27326_28885 = G__28905;
continue;
} else {
var child_28906 = cljs.core.first(seq__27322_28900__$1);
if(cljs.core.truth_(child_28906)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28906);


var G__28910 = cljs.core.next(seq__27322_28900__$1);
var G__28911 = null;
var G__28912 = (0);
var G__28913 = (0);
seq__27322_28882 = G__28910;
chunk__27324_28883 = G__28911;
count__27325_28884 = G__28912;
i__27326_28885 = G__28913;
continue;
} else {
var G__28914 = cljs.core.next(seq__27322_28900__$1);
var G__28915 = null;
var G__28916 = (0);
var G__28917 = (0);
seq__27322_28882 = G__28914;
chunk__27324_28883 = G__28915;
count__27325_28884 = G__28916;
i__27326_28885 = G__28917;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28879);
}


var G__28918 = cljs.core.next(seq__27214_28855__$1);
var G__28919 = null;
var G__28920 = (0);
var G__28921 = (0);
seq__27214_28778 = G__28918;
chunk__27215_28779 = G__28919;
count__27216_28780 = G__28920;
i__27217_28781 = G__28921;
continue;
}
} else {
}
}
break;
}

return node;
});
(cljs.core.Keyword.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.Keyword.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var this$__$1 = this;
return shadow.dom.make_dom_node(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this$__$1], null));
}));

(cljs.core.PersistentVector.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.PersistentVector.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var this$__$1 = this;
return shadow.dom.make_dom_node(this$__$1);
}));

(cljs.core.LazySeq.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.LazySeq.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom._to_dom,this$__$1);
}));
if(cljs.core.truth_(((typeof HTMLElement) != 'undefined'))){
(HTMLElement.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(HTMLElement.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var this$__$1 = this;
return this$__$1;
}));
} else {
}
if(cljs.core.truth_(((typeof DocumentFragment) != 'undefined'))){
(DocumentFragment.prototype.shadow$dom$IElement$ = cljs.core.PROTOCOL_SENTINEL);

(DocumentFragment.prototype.shadow$dom$IElement$_to_dom$arity$1 = (function (this$){
var this$__$1 = this;
return this$__$1;
}));
} else {
}
/**
 * clear node children
 */
shadow.dom.reset = (function shadow$dom$reset(node){
return goog.dom.removeChildren(shadow.dom.dom_node(node));
});
shadow.dom.remove = (function shadow$dom$remove(node){
if((((!((node == null))))?(((((node.cljs$lang$protocol_mask$partition0$ & (8388608))) || ((cljs.core.PROTOCOL_SENTINEL === node.cljs$core$ISeqable$))))?true:false):false)){
var seq__27376 = cljs.core.seq(node);
var chunk__27377 = null;
var count__27378 = (0);
var i__27379 = (0);
while(true){
if((i__27379 < count__27378)){
var n = chunk__27377.cljs$core$IIndexed$_nth$arity$2(null, i__27379);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28929 = seq__27376;
var G__28930 = chunk__27377;
var G__28931 = count__27378;
var G__28932 = (i__27379 + (1));
seq__27376 = G__28929;
chunk__27377 = G__28930;
count__27378 = G__28931;
i__27379 = G__28932;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27376);
if(temp__5823__auto__){
var seq__27376__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27376__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27376__$1);
var G__28934 = cljs.core.chunk_rest(seq__27376__$1);
var G__28935 = c__5568__auto__;
var G__28936 = cljs.core.count(c__5568__auto__);
var G__28937 = (0);
seq__27376 = G__28934;
chunk__27377 = G__28935;
count__27378 = G__28936;
i__27379 = G__28937;
continue;
} else {
var n = cljs.core.first(seq__27376__$1);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28938 = cljs.core.next(seq__27376__$1);
var G__28939 = null;
var G__28940 = (0);
var G__28941 = (0);
seq__27376 = G__28938;
chunk__27377 = G__28939;
count__27378 = G__28940;
i__27379 = G__28941;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return goog.dom.removeNode(node);
}
});
shadow.dom.replace_node = (function shadow$dom$replace_node(old,new$){
return goog.dom.replaceNode(shadow.dom.dom_node(new$),shadow.dom.dom_node(old));
});
shadow.dom.text = (function shadow$dom$text(var_args){
var G__27405 = arguments.length;
switch (G__27405) {
case 2:
return shadow.dom.text.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 1:
return shadow.dom.text.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.text.cljs$core$IFn$_invoke$arity$2 = (function (el,new_text){
return (shadow.dom.dom_node(el).innerText = new_text);
}));

(shadow.dom.text.cljs$core$IFn$_invoke$arity$1 = (function (el){
return shadow.dom.dom_node(el).innerText;
}));

(shadow.dom.text.cljs$lang$maxFixedArity = 2);

shadow.dom.check = (function shadow$dom$check(var_args){
var G__27420 = arguments.length;
switch (G__27420) {
case 1:
return shadow.dom.check.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.check.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.check.cljs$core$IFn$_invoke$arity$1 = (function (el){
return shadow.dom.check.cljs$core$IFn$_invoke$arity$2(el,true);
}));

(shadow.dom.check.cljs$core$IFn$_invoke$arity$2 = (function (el,checked){
return (shadow.dom.dom_node(el).checked = checked);
}));

(shadow.dom.check.cljs$lang$maxFixedArity = 2);

shadow.dom.checked_QMARK_ = (function shadow$dom$checked_QMARK_(el){
return shadow.dom.dom_node(el).checked;
});
shadow.dom.form_elements = (function shadow$dom$form_elements(el){
return (new shadow.dom.NativeColl(shadow.dom.dom_node(el).elements));
});
shadow.dom.children = (function shadow$dom$children(el){
return (new shadow.dom.NativeColl(shadow.dom.dom_node(el).children));
});
shadow.dom.child_nodes = (function shadow$dom$child_nodes(el){
return (new shadow.dom.NativeColl(shadow.dom.dom_node(el).childNodes));
});
shadow.dom.attr = (function shadow$dom$attr(var_args){
var G__27438 = arguments.length;
switch (G__27438) {
case 2:
return shadow.dom.attr.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return shadow.dom.attr.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.attr.cljs$core$IFn$_invoke$arity$2 = (function (el,key){
return shadow.dom.dom_node(el).getAttribute(cljs.core.name(key));
}));

(shadow.dom.attr.cljs$core$IFn$_invoke$arity$3 = (function (el,key,default$){
var or__5045__auto__ = shadow.dom.dom_node(el).getAttribute(cljs.core.name(key));
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return default$;
}
}));

(shadow.dom.attr.cljs$lang$maxFixedArity = 3);

shadow.dom.del_attr = (function shadow$dom$del_attr(el,key){
return shadow.dom.dom_node(el).removeAttribute(cljs.core.name(key));
});
shadow.dom.data = (function shadow$dom$data(el,key){
return shadow.dom.dom_node(el).getAttribute(["data-",cljs.core.name(key)].join(''));
});
shadow.dom.set_data = (function shadow$dom$set_data(el,key,value){
return shadow.dom.dom_node(el).setAttribute(["data-",cljs.core.name(key)].join(''),cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
});
shadow.dom.set_html = (function shadow$dom$set_html(node,text){
return (shadow.dom.dom_node(node).innerHTML = text);
});
shadow.dom.get_html = (function shadow$dom$get_html(node){
return shadow.dom.dom_node(node).innerHTML;
});
shadow.dom.fragment = (function shadow$dom$fragment(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28956 = arguments.length;
var i__5770__auto___28960 = (0);
while(true){
if((i__5770__auto___28960 < len__5769__auto___28956)){
args__5775__auto__.push((arguments[i__5770__auto___28960]));

var G__28964 = (i__5770__auto___28960 + (1));
i__5770__auto___28960 = G__28964;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((0) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((0)),(0),null)):null);
return shadow.dom.fragment.cljs$core$IFn$_invoke$arity$variadic(argseq__5776__auto__);
});

(shadow.dom.fragment.cljs$core$IFn$_invoke$arity$variadic = (function (nodes){
var fragment = document.createDocumentFragment();
var seq__27478_28969 = cljs.core.seq(nodes);
var chunk__27479_28970 = null;
var count__27480_28971 = (0);
var i__27481_28972 = (0);
while(true){
if((i__27481_28972 < count__27480_28971)){
var node_28978 = chunk__27479_28970.cljs$core$IIndexed$_nth$arity$2(null, i__27481_28972);
fragment.appendChild(shadow.dom._to_dom(node_28978));


var G__28979 = seq__27478_28969;
var G__28980 = chunk__27479_28970;
var G__28981 = count__27480_28971;
var G__28982 = (i__27481_28972 + (1));
seq__27478_28969 = G__28979;
chunk__27479_28970 = G__28980;
count__27480_28971 = G__28981;
i__27481_28972 = G__28982;
continue;
} else {
var temp__5823__auto___28987 = cljs.core.seq(seq__27478_28969);
if(temp__5823__auto___28987){
var seq__27478_28988__$1 = temp__5823__auto___28987;
if(cljs.core.chunked_seq_QMARK_(seq__27478_28988__$1)){
var c__5568__auto___28989 = cljs.core.chunk_first(seq__27478_28988__$1);
var G__28993 = cljs.core.chunk_rest(seq__27478_28988__$1);
var G__28994 = c__5568__auto___28989;
var G__28995 = cljs.core.count(c__5568__auto___28989);
var G__28996 = (0);
seq__27478_28969 = G__28993;
chunk__27479_28970 = G__28994;
count__27480_28971 = G__28995;
i__27481_28972 = G__28996;
continue;
} else {
var node_28997 = cljs.core.first(seq__27478_28988__$1);
fragment.appendChild(shadow.dom._to_dom(node_28997));


var G__29002 = cljs.core.next(seq__27478_28988__$1);
var G__29003 = null;
var G__29004 = (0);
var G__29005 = (0);
seq__27478_28969 = G__29002;
chunk__27479_28970 = G__29003;
count__27480_28971 = G__29004;
i__27481_28972 = G__29005;
continue;
}
} else {
}
}
break;
}

return (new shadow.dom.NativeColl(fragment));
}));

(shadow.dom.fragment.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(shadow.dom.fragment.cljs$lang$applyTo = (function (seq27470){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq27470));
}));

/**
 * given a html string, eval all <script> tags and return the html without the scripts
 * don't do this for everything, only content you trust.
 */
shadow.dom.eval_scripts = (function shadow$dom$eval_scripts(s){
var scripts = cljs.core.re_seq(/<script[^>]*?>(.+?)<\/script>/,s);
var seq__27500_29013 = cljs.core.seq(scripts);
var chunk__27501_29014 = null;
var count__27502_29015 = (0);
var i__27503_29016 = (0);
while(true){
if((i__27503_29016 < count__27502_29015)){
var vec__27527_29017 = chunk__27501_29014.cljs$core$IIndexed$_nth$arity$2(null, i__27503_29016);
var script_tag_29018 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27527_29017,(0),null);
var script_body_29019 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27527_29017,(1),null);
eval(script_body_29019);


var G__29020 = seq__27500_29013;
var G__29021 = chunk__27501_29014;
var G__29022 = count__27502_29015;
var G__29023 = (i__27503_29016 + (1));
seq__27500_29013 = G__29020;
chunk__27501_29014 = G__29021;
count__27502_29015 = G__29022;
i__27503_29016 = G__29023;
continue;
} else {
var temp__5823__auto___29024 = cljs.core.seq(seq__27500_29013);
if(temp__5823__auto___29024){
var seq__27500_29025__$1 = temp__5823__auto___29024;
if(cljs.core.chunked_seq_QMARK_(seq__27500_29025__$1)){
var c__5568__auto___29026 = cljs.core.chunk_first(seq__27500_29025__$1);
var G__29027 = cljs.core.chunk_rest(seq__27500_29025__$1);
var G__29028 = c__5568__auto___29026;
var G__29029 = cljs.core.count(c__5568__auto___29026);
var G__29030 = (0);
seq__27500_29013 = G__29027;
chunk__27501_29014 = G__29028;
count__27502_29015 = G__29029;
i__27503_29016 = G__29030;
continue;
} else {
var vec__27539_29031 = cljs.core.first(seq__27500_29025__$1);
var script_tag_29032 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27539_29031,(0),null);
var script_body_29033 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27539_29031,(1),null);
eval(script_body_29033);


var G__29038 = cljs.core.next(seq__27500_29025__$1);
var G__29039 = null;
var G__29040 = (0);
var G__29041 = (0);
seq__27500_29013 = G__29038;
chunk__27501_29014 = G__29039;
count__27502_29015 = G__29040;
i__27503_29016 = G__29041;
continue;
}
} else {
}
}
break;
}

return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (s__$1,p__27554){
var vec__27558 = p__27554;
var script_tag = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27558,(0),null);
var script_body = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27558,(1),null);
return clojure.string.replace(s__$1,script_tag,"");
}),s,scripts);
});
shadow.dom.str__GT_fragment = (function shadow$dom$str__GT_fragment(s){
var el = document.createElement("div");
(el.innerHTML = s);

return (new shadow.dom.NativeColl(goog.dom.childrenToNode_(document,el)));
});
shadow.dom.node_name = (function shadow$dom$node_name(el){
return shadow.dom.dom_node(el).nodeName;
});
shadow.dom.ancestor_by_class = (function shadow$dom$ancestor_by_class(el,cls){
return goog.dom.getAncestorByClass(shadow.dom.dom_node(el),cls);
});
shadow.dom.ancestor_by_tag = (function shadow$dom$ancestor_by_tag(var_args){
var G__27572 = arguments.length;
switch (G__27572) {
case 2:
return shadow.dom.ancestor_by_tag.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return shadow.dom.ancestor_by_tag.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.ancestor_by_tag.cljs$core$IFn$_invoke$arity$2 = (function (el,tag){
return goog.dom.getAncestorByTagNameAndClass(shadow.dom.dom_node(el),cljs.core.name(tag));
}));

(shadow.dom.ancestor_by_tag.cljs$core$IFn$_invoke$arity$3 = (function (el,tag,cls){
return goog.dom.getAncestorByTagNameAndClass(shadow.dom.dom_node(el),cljs.core.name(tag),cljs.core.name(cls));
}));

(shadow.dom.ancestor_by_tag.cljs$lang$maxFixedArity = 3);

shadow.dom.get_value = (function shadow$dom$get_value(dom){
return goog.dom.forms.getValue(shadow.dom.dom_node(dom));
});
shadow.dom.set_value = (function shadow$dom$set_value(dom,value){
return goog.dom.forms.setValue(shadow.dom.dom_node(dom),value);
});
shadow.dom.px = (function shadow$dom$px(value){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1((value | (0))),"px"].join('');
});
shadow.dom.pct = (function shadow$dom$pct(value){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(value),"%"].join('');
});
shadow.dom.remove_style_STAR_ = (function shadow$dom$remove_style_STAR_(el,style){
return el.style.removeProperty(cljs.core.name(style));
});
shadow.dom.remove_style = (function shadow$dom$remove_style(el,style){
var el__$1 = shadow.dom.dom_node(el);
return shadow.dom.remove_style_STAR_(el__$1,style);
});
shadow.dom.remove_styles = (function shadow$dom$remove_styles(el,style_keys){
var el__$1 = shadow.dom.dom_node(el);
var seq__27617 = cljs.core.seq(style_keys);
var chunk__27618 = null;
var count__27619 = (0);
var i__27620 = (0);
while(true){
if((i__27620 < count__27619)){
var it = chunk__27618.cljs$core$IIndexed$_nth$arity$2(null, i__27620);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__29051 = seq__27617;
var G__29052 = chunk__27618;
var G__29053 = count__27619;
var G__29054 = (i__27620 + (1));
seq__27617 = G__29051;
chunk__27618 = G__29052;
count__27619 = G__29053;
i__27620 = G__29054;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27617);
if(temp__5823__auto__){
var seq__27617__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27617__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27617__$1);
var G__29055 = cljs.core.chunk_rest(seq__27617__$1);
var G__29056 = c__5568__auto__;
var G__29057 = cljs.core.count(c__5568__auto__);
var G__29058 = (0);
seq__27617 = G__29055;
chunk__27618 = G__29056;
count__27619 = G__29057;
i__27620 = G__29058;
continue;
} else {
var it = cljs.core.first(seq__27617__$1);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__29059 = cljs.core.next(seq__27617__$1);
var G__29060 = null;
var G__29061 = (0);
var G__29062 = (0);
seq__27617 = G__29059;
chunk__27618 = G__29060;
count__27619 = G__29061;
i__27620 = G__29062;
continue;
}
} else {
return null;
}
}
break;
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
shadow.dom.Coordinate = (function (x,y,__meta,__extmap,__hash){
this.x = x;
this.y = y;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(shadow.dom.Coordinate.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5343__auto__,k__5344__auto__){
var self__ = this;
var this__5343__auto____$1 = this;
return this__5343__auto____$1.cljs$core$ILookup$_lookup$arity$3(null, k__5344__auto__,null);
}));

(shadow.dom.Coordinate.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k27668,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__27755 = k27668;
var G__27755__$1 = (((G__27755 instanceof cljs.core.Keyword))?G__27755.fqn:null);
switch (G__27755__$1) {
case "x":
return self__.x;

break;
case "y":
return self__.y;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k27668,else__5346__auto__);

}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__27758){
var vec__27759 = p__27758;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27759,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27759,(1),null);
return (f__5364__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5364__auto__.cljs$core$IFn$_invoke$arity$3(ret__5366__auto__,k__5367__auto__,v__5368__auto__) : f__5364__auto__.call(null, ret__5366__auto__,k__5367__auto__,v__5368__auto__));
}),init__5365__auto__,this__5363__auto____$1);
}));

(shadow.dom.Coordinate.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5358__auto__,writer__5359__auto__,opts__5360__auto__){
var self__ = this;
var this__5358__auto____$1 = this;
var pr_pair__5361__auto__ = (function (keyval__5362__auto__){
return cljs.core.pr_sequential_writer(writer__5359__auto__,cljs.core.pr_writer,""," ","",opts__5360__auto__,keyval__5362__auto__);
});
return cljs.core.pr_sequential_writer(writer__5359__auto__,pr_pair__5361__auto__,"#shadow.dom.Coordinate{",", ","}",opts__5360__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"x","x",2099068185),self__.x],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"y","y",-1757859776),self__.y],null))], null),self__.__extmap));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__27667){
var self__ = this;
var G__27667__$1 = this;
return (new cljs.core.RecordIter((0),G__27667__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"x","x",2099068185),new cljs.core.Keyword(null,"y","y",-1757859776)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5341__auto__){
var self__ = this;
var this__5341__auto____$1 = this;
return self__.__meta;
}));

(shadow.dom.Coordinate.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5338__auto__){
var self__ = this;
var this__5338__auto____$1 = this;
return (new shadow.dom.Coordinate(self__.x,self__.y,self__.__meta,self__.__extmap,self__.__hash));
}));

(shadow.dom.Coordinate.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5347__auto__){
var self__ = this;
var this__5347__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5339__auto__){
var self__ = this;
var this__5339__auto____$1 = this;
var h__5154__auto__ = self__.__hash;
if((!((h__5154__auto__ == null)))){
return h__5154__auto__;
} else {
var h__5154__auto____$1 = (function (coll__5340__auto__){
return (145542109 ^ cljs.core.hash_unordered_coll(coll__5340__auto__));
})(this__5339__auto____$1);
(self__.__hash = h__5154__auto____$1);

return h__5154__auto____$1;
}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this27669,other27670){
var self__ = this;
var this27669__$1 = this;
return (((!((other27670 == null)))) && ((((this27669__$1.constructor === other27670.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27669__$1.x,other27670.x)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27669__$1.y,other27670.y)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27669__$1.__extmap,other27670.__extmap)))))))));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5353__auto__,k__5354__auto__){
var self__ = this;
var this__5353__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"y","y",-1757859776),null,new cljs.core.Keyword(null,"x","x",2099068185),null], null), null),k__5354__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5353__auto____$1),self__.__meta),k__5354__auto__);
} else {
return (new shadow.dom.Coordinate(self__.x,self__.y,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5354__auto__)),null));
}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k27668){
var self__ = this;
var this__5350__auto____$1 = this;
var G__27882 = k27668;
var G__27882__$1 = (((G__27882 instanceof cljs.core.Keyword))?G__27882.fqn:null);
switch (G__27882__$1) {
case "x":
case "y":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k27668);

}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__27667){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__27891 = cljs.core.keyword_identical_QMARK_;
var expr__27892 = k__5352__auto__;
if(cljs.core.truth_((pred__27891.cljs$core$IFn$_invoke$arity$2 ? pred__27891.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"x","x",2099068185),expr__27892) : pred__27891.call(null, new cljs.core.Keyword(null,"x","x",2099068185),expr__27892)))){
return (new shadow.dom.Coordinate(G__27667,self__.y,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__27891.cljs$core$IFn$_invoke$arity$2 ? pred__27891.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"y","y",-1757859776),expr__27892) : pred__27891.call(null, new cljs.core.Keyword(null,"y","y",-1757859776),expr__27892)))){
return (new shadow.dom.Coordinate(self__.x,G__27667,self__.__meta,self__.__extmap,null));
} else {
return (new shadow.dom.Coordinate(self__.x,self__.y,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__27667),null));
}
}
}));

(shadow.dom.Coordinate.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"x","x",2099068185),self__.x,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"y","y",-1757859776),self__.y,null))], null),self__.__extmap));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__27667){
var self__ = this;
var this__5342__auto____$1 = this;
return (new shadow.dom.Coordinate(self__.x,self__.y,G__27667,self__.__extmap,self__.__hash));
}));

(shadow.dom.Coordinate.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5348__auto__,entry__5349__auto__){
var self__ = this;
var this__5348__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5349__auto__)){
return this__5348__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core._nth(entry__5349__auto__,(0)),cljs.core._nth(entry__5349__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5348__auto____$1,entry__5349__auto__);
}
}));

(shadow.dom.Coordinate.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"x","x",-555367584,null),new cljs.core.Symbol(null,"y","y",-117328249,null)], null);
}));

(shadow.dom.Coordinate.cljs$lang$type = true);

(shadow.dom.Coordinate.cljs$lang$ctorPrSeq = (function (this__5389__auto__){
return (new cljs.core.List(null,"shadow.dom/Coordinate",null,(1),null));
}));

(shadow.dom.Coordinate.cljs$lang$ctorPrWriter = (function (this__5389__auto__,writer__5390__auto__){
return cljs.core._write(writer__5390__auto__,"shadow.dom/Coordinate");
}));

/**
 * Positional factory function for shadow.dom/Coordinate.
 */
shadow.dom.__GT_Coordinate = (function shadow$dom$__GT_Coordinate(x,y){
return (new shadow.dom.Coordinate(x,y,null,null,null));
});

/**
 * Factory function for shadow.dom/Coordinate, taking a map of keywords to field values.
 */
shadow.dom.map__GT_Coordinate = (function shadow$dom$map__GT_Coordinate(G__27679){
var extmap__5385__auto__ = (function (){var G__27984 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__27679,new cljs.core.Keyword(null,"x","x",2099068185),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"y","y",-1757859776)], 0));
if(cljs.core.record_QMARK_(G__27679)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__27984);
} else {
return G__27984;
}
})();
return (new shadow.dom.Coordinate(new cljs.core.Keyword(null,"x","x",2099068185).cljs$core$IFn$_invoke$arity$1(G__27679),new cljs.core.Keyword(null,"y","y",-1757859776).cljs$core$IFn$_invoke$arity$1(G__27679),null,cljs.core.not_empty(extmap__5385__auto__),null));
});

shadow.dom.get_position = (function shadow$dom$get_position(el){
var pos = goog.style.getPosition(shadow.dom.dom_node(el));
return shadow.dom.__GT_Coordinate(pos.x,pos.y);
});
shadow.dom.get_client_position = (function shadow$dom$get_client_position(el){
var pos = goog.style.getClientPosition(shadow.dom.dom_node(el));
return shadow.dom.__GT_Coordinate(pos.x,pos.y);
});
shadow.dom.get_page_offset = (function shadow$dom$get_page_offset(el){
var pos = goog.style.getPageOffset(shadow.dom.dom_node(el));
return shadow.dom.__GT_Coordinate(pos.x,pos.y);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
shadow.dom.Size = (function (w,h,__meta,__extmap,__hash){
this.w = w;
this.h = h;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(shadow.dom.Size.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5343__auto__,k__5344__auto__){
var self__ = this;
var this__5343__auto____$1 = this;
return this__5343__auto____$1.cljs$core$ILookup$_lookup$arity$3(null, k__5344__auto__,null);
}));

(shadow.dom.Size.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k28058,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__28100 = k28058;
var G__28100__$1 = (((G__28100 instanceof cljs.core.Keyword))?G__28100.fqn:null);
switch (G__28100__$1) {
case "w":
return self__.w;

break;
case "h":
return self__.h;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k28058,else__5346__auto__);

}
}));

(shadow.dom.Size.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__28105){
var vec__28107 = p__28105;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28107,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28107,(1),null);
return (f__5364__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5364__auto__.cljs$core$IFn$_invoke$arity$3(ret__5366__auto__,k__5367__auto__,v__5368__auto__) : f__5364__auto__.call(null, ret__5366__auto__,k__5367__auto__,v__5368__auto__));
}),init__5365__auto__,this__5363__auto____$1);
}));

(shadow.dom.Size.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5358__auto__,writer__5359__auto__,opts__5360__auto__){
var self__ = this;
var this__5358__auto____$1 = this;
var pr_pair__5361__auto__ = (function (keyval__5362__auto__){
return cljs.core.pr_sequential_writer(writer__5359__auto__,cljs.core.pr_writer,""," ","",opts__5360__auto__,keyval__5362__auto__);
});
return cljs.core.pr_sequential_writer(writer__5359__auto__,pr_pair__5361__auto__,"#shadow.dom.Size{",", ","}",opts__5360__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"w","w",354169001),self__.w],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"h","h",1109658740),self__.h],null))], null),self__.__extmap));
}));

(shadow.dom.Size.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__28057){
var self__ = this;
var G__28057__$1 = this;
return (new cljs.core.RecordIter((0),G__28057__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"w","w",354169001),new cljs.core.Keyword(null,"h","h",1109658740)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(shadow.dom.Size.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5341__auto__){
var self__ = this;
var this__5341__auto____$1 = this;
return self__.__meta;
}));

(shadow.dom.Size.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5338__auto__){
var self__ = this;
var this__5338__auto____$1 = this;
return (new shadow.dom.Size(self__.w,self__.h,self__.__meta,self__.__extmap,self__.__hash));
}));

(shadow.dom.Size.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5347__auto__){
var self__ = this;
var this__5347__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(shadow.dom.Size.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5339__auto__){
var self__ = this;
var this__5339__auto____$1 = this;
var h__5154__auto__ = self__.__hash;
if((!((h__5154__auto__ == null)))){
return h__5154__auto__;
} else {
var h__5154__auto____$1 = (function (coll__5340__auto__){
return (-1228019642 ^ cljs.core.hash_unordered_coll(coll__5340__auto__));
})(this__5339__auto____$1);
(self__.__hash = h__5154__auto____$1);

return h__5154__auto____$1;
}
}));

(shadow.dom.Size.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this28059,other28060){
var self__ = this;
var this28059__$1 = this;
return (((!((other28060 == null)))) && ((((this28059__$1.constructor === other28060.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28059__$1.w,other28060.w)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28059__$1.h,other28060.h)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28059__$1.__extmap,other28060.__extmap)))))))));
}));

(shadow.dom.Size.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5353__auto__,k__5354__auto__){
var self__ = this;
var this__5353__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"w","w",354169001),null,new cljs.core.Keyword(null,"h","h",1109658740),null], null), null),k__5354__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5353__auto____$1),self__.__meta),k__5354__auto__);
} else {
return (new shadow.dom.Size(self__.w,self__.h,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5354__auto__)),null));
}
}));

(shadow.dom.Size.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k28058){
var self__ = this;
var this__5350__auto____$1 = this;
var G__28216 = k28058;
var G__28216__$1 = (((G__28216 instanceof cljs.core.Keyword))?G__28216.fqn:null);
switch (G__28216__$1) {
case "w":
case "h":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k28058);

}
}));

(shadow.dom.Size.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__28057){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__28219 = cljs.core.keyword_identical_QMARK_;
var expr__28220 = k__5352__auto__;
if(cljs.core.truth_((pred__28219.cljs$core$IFn$_invoke$arity$2 ? pred__28219.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"w","w",354169001),expr__28220) : pred__28219.call(null, new cljs.core.Keyword(null,"w","w",354169001),expr__28220)))){
return (new shadow.dom.Size(G__28057,self__.h,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__28219.cljs$core$IFn$_invoke$arity$2 ? pred__28219.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"h","h",1109658740),expr__28220) : pred__28219.call(null, new cljs.core.Keyword(null,"h","h",1109658740),expr__28220)))){
return (new shadow.dom.Size(self__.w,G__28057,self__.__meta,self__.__extmap,null));
} else {
return (new shadow.dom.Size(self__.w,self__.h,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__28057),null));
}
}
}));

(shadow.dom.Size.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"w","w",354169001),self__.w,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"h","h",1109658740),self__.h,null))], null),self__.__extmap));
}));

(shadow.dom.Size.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__28057){
var self__ = this;
var this__5342__auto____$1 = this;
return (new shadow.dom.Size(self__.w,self__.h,G__28057,self__.__extmap,self__.__hash));
}));

(shadow.dom.Size.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5348__auto__,entry__5349__auto__){
var self__ = this;
var this__5348__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5349__auto__)){
return this__5348__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null, cljs.core._nth(entry__5349__auto__,(0)),cljs.core._nth(entry__5349__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5348__auto____$1,entry__5349__auto__);
}
}));

(shadow.dom.Size.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"w","w",1994700528,null),new cljs.core.Symbol(null,"h","h",-1544777029,null)], null);
}));

(shadow.dom.Size.cljs$lang$type = true);

(shadow.dom.Size.cljs$lang$ctorPrSeq = (function (this__5389__auto__){
return (new cljs.core.List(null,"shadow.dom/Size",null,(1),null));
}));

(shadow.dom.Size.cljs$lang$ctorPrWriter = (function (this__5389__auto__,writer__5390__auto__){
return cljs.core._write(writer__5390__auto__,"shadow.dom/Size");
}));

/**
 * Positional factory function for shadow.dom/Size.
 */
shadow.dom.__GT_Size = (function shadow$dom$__GT_Size(w,h){
return (new shadow.dom.Size(w,h,null,null,null));
});

/**
 * Factory function for shadow.dom/Size, taking a map of keywords to field values.
 */
shadow.dom.map__GT_Size = (function shadow$dom$map__GT_Size(G__28066){
var extmap__5385__auto__ = (function (){var G__28269 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__28066,new cljs.core.Keyword(null,"w","w",354169001),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"h","h",1109658740)], 0));
if(cljs.core.record_QMARK_(G__28066)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__28269);
} else {
return G__28269;
}
})();
return (new shadow.dom.Size(new cljs.core.Keyword(null,"w","w",354169001).cljs$core$IFn$_invoke$arity$1(G__28066),new cljs.core.Keyword(null,"h","h",1109658740).cljs$core$IFn$_invoke$arity$1(G__28066),null,cljs.core.not_empty(extmap__5385__auto__),null));
});

shadow.dom.size__GT_clj = (function shadow$dom$size__GT_clj(size){
return (new shadow.dom.Size(size.width,size.height,null,null,null));
});
shadow.dom.get_size = (function shadow$dom$get_size(el){
return shadow.dom.size__GT_clj(goog.style.getSize(shadow.dom.dom_node(el)));
});
shadow.dom.get_height = (function shadow$dom$get_height(el){
return shadow.dom.get_size(el).h;
});
shadow.dom.get_viewport_size = (function shadow$dom$get_viewport_size(){
return shadow.dom.size__GT_clj(goog.dom.getViewportSize());
});
shadow.dom.first_child = (function shadow$dom$first_child(el){
return (shadow.dom.dom_node(el).children[(0)]);
});
shadow.dom.select_option_values = (function shadow$dom$select_option_values(el){
var native$ = shadow.dom.dom_node(el);
var opts = (native$["options"]);
var a__5633__auto__ = opts;
var l__5634__auto__ = a__5633__auto__.length;
var i = (0);
var ret = cljs.core.PersistentVector.EMPTY;
while(true){
if((i < l__5634__auto__)){
var G__29217 = (i + (1));
var G__29218 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,(opts[i]["value"]));
i = G__29217;
ret = G__29218;
continue;
} else {
return ret;
}
break;
}
});
shadow.dom.build_url = (function shadow$dom$build_url(path,query_params){
if(cljs.core.empty_QMARK_(query_params)){
return path;
} else {
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(path),"?",clojure.string.join.cljs$core$IFn$_invoke$arity$2("&",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__28352){
var vec__28354 = p__28352;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28354,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28354,(1),null);
return [cljs.core.name(k),"=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)))].join('');
}),query_params))].join('');
}
});
shadow.dom.redirect = (function shadow$dom$redirect(var_args){
var G__28363 = arguments.length;
switch (G__28363) {
case 1:
return shadow.dom.redirect.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return shadow.dom.redirect.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(shadow.dom.redirect.cljs$core$IFn$_invoke$arity$1 = (function (path){
return shadow.dom.redirect.cljs$core$IFn$_invoke$arity$2(path,cljs.core.PersistentArrayMap.EMPTY);
}));

(shadow.dom.redirect.cljs$core$IFn$_invoke$arity$2 = (function (path,query_params){
return (document["location"]["href"] = shadow.dom.build_url(path,query_params));
}));

(shadow.dom.redirect.cljs$lang$maxFixedArity = 2);

shadow.dom.reload_BANG_ = (function shadow$dom$reload_BANG_(){
return (document.location.href = document.location.href);
});
shadow.dom.tag_name = (function shadow$dom$tag_name(el){
var dom = shadow.dom.dom_node(el);
return dom.tagName;
});
shadow.dom.insert_after = (function shadow$dom$insert_after(ref,new$){
var new_node = shadow.dom.dom_node(new$);
goog.dom.insertSiblingAfter(new_node,shadow.dom.dom_node(ref));

return new_node;
});
shadow.dom.insert_before = (function shadow$dom$insert_before(ref,new$){
var new_node = shadow.dom.dom_node(new$);
goog.dom.insertSiblingBefore(new_node,shadow.dom.dom_node(ref));

return new_node;
});
shadow.dom.insert_first = (function shadow$dom$insert_first(ref,new$){
var temp__5821__auto__ = shadow.dom.dom_node(ref).firstChild;
if(cljs.core.truth_(temp__5821__auto__)){
var child = temp__5821__auto__;
return shadow.dom.insert_before(child,new$);
} else {
return shadow.dom.append.cljs$core$IFn$_invoke$arity$2(ref,new$);
}
});
shadow.dom.index_of = (function shadow$dom$index_of(el){
var el__$1 = shadow.dom.dom_node(el);
var i = (0);
while(true){
var ps = el__$1.previousSibling;
if((ps == null)){
return i;
} else {
var G__29241 = ps;
var G__29242 = (i + (1));
el__$1 = G__29241;
i = G__29242;
continue;
}
break;
}
});
shadow.dom.get_parent = (function shadow$dom$get_parent(el){
return goog.dom.getParentElement(shadow.dom.dom_node(el));
});
shadow.dom.parents = (function shadow$dom$parents(el){
var parent = shadow.dom.get_parent(el);
if(cljs.core.truth_(parent)){
return cljs.core.cons(parent,(new cljs.core.LazySeq(null,(function (){
return (shadow.dom.parents.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.parents.cljs$core$IFn$_invoke$arity$1(parent) : shadow.dom.parents.call(null, parent));
}),null,null)));
} else {
return null;
}
});
shadow.dom.matches = (function shadow$dom$matches(el,sel){
return shadow.dom.dom_node(el).matches(sel);
});
shadow.dom.get_next_sibling = (function shadow$dom$get_next_sibling(el){
return goog.dom.getNextElementSibling(shadow.dom.dom_node(el));
});
shadow.dom.get_previous_sibling = (function shadow$dom$get_previous_sibling(el){
return goog.dom.getPreviousElementSibling(shadow.dom.dom_node(el));
});
shadow.dom.xmlns = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 2, ["svg","http://www.w3.org/2000/svg","xlink","http://www.w3.org/1999/xlink"], null));
shadow.dom.create_svg_node = (function shadow$dom$create_svg_node(tag_def,props){
var vec__28390 = shadow.dom.parse_tag(tag_def);
var tag_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28390,(0),null);
var tag_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28390,(1),null);
var tag_classes = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28390,(2),null);
var el = document.createElementNS("http://www.w3.org/2000/svg",tag_name);
if(cljs.core.truth_(tag_id)){
el.setAttribute("id",tag_id);
} else {
}

if(cljs.core.truth_(tag_classes)){
el.setAttribute("class",shadow.dom.merge_class_string(new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(props),tag_classes));
} else {
}

var seq__28396_29248 = cljs.core.seq(props);
var chunk__28397_29249 = null;
var count__28398_29250 = (0);
var i__28399_29251 = (0);
while(true){
if((i__28399_29251 < count__28398_29250)){
var vec__28409_29252 = chunk__28397_29249.cljs$core$IIndexed$_nth$arity$2(null, i__28399_29251);
var k_29253 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28409_29252,(0),null);
var v_29254 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28409_29252,(1),null);
el.setAttributeNS((function (){var temp__5823__auto__ = cljs.core.namespace(k_29253);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29253),v_29254);


var G__29255 = seq__28396_29248;
var G__29256 = chunk__28397_29249;
var G__29257 = count__28398_29250;
var G__29258 = (i__28399_29251 + (1));
seq__28396_29248 = G__29255;
chunk__28397_29249 = G__29256;
count__28398_29250 = G__29257;
i__28399_29251 = G__29258;
continue;
} else {
var temp__5823__auto___29259 = cljs.core.seq(seq__28396_29248);
if(temp__5823__auto___29259){
var seq__28396_29260__$1 = temp__5823__auto___29259;
if(cljs.core.chunked_seq_QMARK_(seq__28396_29260__$1)){
var c__5568__auto___29261 = cljs.core.chunk_first(seq__28396_29260__$1);
var G__29262 = cljs.core.chunk_rest(seq__28396_29260__$1);
var G__29263 = c__5568__auto___29261;
var G__29264 = cljs.core.count(c__5568__auto___29261);
var G__29265 = (0);
seq__28396_29248 = G__29262;
chunk__28397_29249 = G__29263;
count__28398_29250 = G__29264;
i__28399_29251 = G__29265;
continue;
} else {
var vec__28418_29270 = cljs.core.first(seq__28396_29260__$1);
var k_29271 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28418_29270,(0),null);
var v_29272 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28418_29270,(1),null);
el.setAttributeNS((function (){var temp__5823__auto____$1 = cljs.core.namespace(k_29271);
if(cljs.core.truth_(temp__5823__auto____$1)){
var ns = temp__5823__auto____$1;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29271),v_29272);


var G__29281 = cljs.core.next(seq__28396_29260__$1);
var G__29282 = null;
var G__29283 = (0);
var G__29284 = (0);
seq__28396_29248 = G__29281;
chunk__28397_29249 = G__29282;
count__28398_29250 = G__29283;
i__28399_29251 = G__29284;
continue;
}
} else {
}
}
break;
}

return el;
});
shadow.dom.svg_node = (function shadow$dom$svg_node(el){
if((el == null)){
return null;
} else {
if((((!((el == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === el.shadow$dom$SVGElement$))))?true:false):false)){
return el.shadow$dom$SVGElement$_to_svg$arity$1(null, );
} else {
return el;

}
}
});
shadow.dom.make_svg_node = (function shadow$dom$make_svg_node(structure){
var vec__28430 = shadow.dom.destructure_node(shadow.dom.create_svg_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28430,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28430,(1),null);
var seq__28433_29295 = cljs.core.seq(node_children);
var chunk__28435_29296 = null;
var count__28436_29297 = (0);
var i__28437_29298 = (0);
while(true){
if((i__28437_29298 < count__28436_29297)){
var child_struct_29299 = chunk__28435_29296.cljs$core$IIndexed$_nth$arity$2(null, i__28437_29298);
if((!((child_struct_29299 == null)))){
if(typeof child_struct_29299 === 'string'){
var text_29300 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29300),child_struct_29299].join(''));
} else {
var children_29302 = shadow.dom.svg_node(child_struct_29299);
if(cljs.core.seq_QMARK_(children_29302)){
var seq__28464_29303 = cljs.core.seq(children_29302);
var chunk__28466_29304 = null;
var count__28467_29305 = (0);
var i__28468_29306 = (0);
while(true){
if((i__28468_29306 < count__28467_29305)){
var child_29307 = chunk__28466_29304.cljs$core$IIndexed$_nth$arity$2(null, i__28468_29306);
if(cljs.core.truth_(child_29307)){
node.appendChild(child_29307);


var G__29309 = seq__28464_29303;
var G__29310 = chunk__28466_29304;
var G__29311 = count__28467_29305;
var G__29312 = (i__28468_29306 + (1));
seq__28464_29303 = G__29309;
chunk__28466_29304 = G__29310;
count__28467_29305 = G__29311;
i__28468_29306 = G__29312;
continue;
} else {
var G__29313 = seq__28464_29303;
var G__29314 = chunk__28466_29304;
var G__29315 = count__28467_29305;
var G__29316 = (i__28468_29306 + (1));
seq__28464_29303 = G__29313;
chunk__28466_29304 = G__29314;
count__28467_29305 = G__29315;
i__28468_29306 = G__29316;
continue;
}
} else {
var temp__5823__auto___29318 = cljs.core.seq(seq__28464_29303);
if(temp__5823__auto___29318){
var seq__28464_29319__$1 = temp__5823__auto___29318;
if(cljs.core.chunked_seq_QMARK_(seq__28464_29319__$1)){
var c__5568__auto___29324 = cljs.core.chunk_first(seq__28464_29319__$1);
var G__29325 = cljs.core.chunk_rest(seq__28464_29319__$1);
var G__29326 = c__5568__auto___29324;
var G__29327 = cljs.core.count(c__5568__auto___29324);
var G__29328 = (0);
seq__28464_29303 = G__29325;
chunk__28466_29304 = G__29326;
count__28467_29305 = G__29327;
i__28468_29306 = G__29328;
continue;
} else {
var child_29331 = cljs.core.first(seq__28464_29319__$1);
if(cljs.core.truth_(child_29331)){
node.appendChild(child_29331);


var G__29337 = cljs.core.next(seq__28464_29319__$1);
var G__29338 = null;
var G__29339 = (0);
var G__29340 = (0);
seq__28464_29303 = G__29337;
chunk__28466_29304 = G__29338;
count__28467_29305 = G__29339;
i__28468_29306 = G__29340;
continue;
} else {
var G__29342 = cljs.core.next(seq__28464_29319__$1);
var G__29343 = null;
var G__29344 = (0);
var G__29345 = (0);
seq__28464_29303 = G__29342;
chunk__28466_29304 = G__29343;
count__28467_29305 = G__29344;
i__28468_29306 = G__29345;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29302);
}
}


var G__29352 = seq__28433_29295;
var G__29353 = chunk__28435_29296;
var G__29354 = count__28436_29297;
var G__29355 = (i__28437_29298 + (1));
seq__28433_29295 = G__29352;
chunk__28435_29296 = G__29353;
count__28436_29297 = G__29354;
i__28437_29298 = G__29355;
continue;
} else {
var G__29357 = seq__28433_29295;
var G__29358 = chunk__28435_29296;
var G__29359 = count__28436_29297;
var G__29360 = (i__28437_29298 + (1));
seq__28433_29295 = G__29357;
chunk__28435_29296 = G__29358;
count__28436_29297 = G__29359;
i__28437_29298 = G__29360;
continue;
}
} else {
var temp__5823__auto___29365 = cljs.core.seq(seq__28433_29295);
if(temp__5823__auto___29365){
var seq__28433_29366__$1 = temp__5823__auto___29365;
if(cljs.core.chunked_seq_QMARK_(seq__28433_29366__$1)){
var c__5568__auto___29370 = cljs.core.chunk_first(seq__28433_29366__$1);
var G__29371 = cljs.core.chunk_rest(seq__28433_29366__$1);
var G__29372 = c__5568__auto___29370;
var G__29373 = cljs.core.count(c__5568__auto___29370);
var G__29374 = (0);
seq__28433_29295 = G__29371;
chunk__28435_29296 = G__29372;
count__28436_29297 = G__29373;
i__28437_29298 = G__29374;
continue;
} else {
var child_struct_29375 = cljs.core.first(seq__28433_29366__$1);
if((!((child_struct_29375 == null)))){
if(typeof child_struct_29375 === 'string'){
var text_29376 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29376),child_struct_29375].join(''));
} else {
var children_29382 = shadow.dom.svg_node(child_struct_29375);
if(cljs.core.seq_QMARK_(children_29382)){
var seq__28487_29385 = cljs.core.seq(children_29382);
var chunk__28489_29386 = null;
var count__28490_29387 = (0);
var i__28491_29388 = (0);
while(true){
if((i__28491_29388 < count__28490_29387)){
var child_29405 = chunk__28489_29386.cljs$core$IIndexed$_nth$arity$2(null, i__28491_29388);
if(cljs.core.truth_(child_29405)){
node.appendChild(child_29405);


var G__29407 = seq__28487_29385;
var G__29408 = chunk__28489_29386;
var G__29409 = count__28490_29387;
var G__29410 = (i__28491_29388 + (1));
seq__28487_29385 = G__29407;
chunk__28489_29386 = G__29408;
count__28490_29387 = G__29409;
i__28491_29388 = G__29410;
continue;
} else {
var G__29411 = seq__28487_29385;
var G__29412 = chunk__28489_29386;
var G__29413 = count__28490_29387;
var G__29414 = (i__28491_29388 + (1));
seq__28487_29385 = G__29411;
chunk__28489_29386 = G__29412;
count__28490_29387 = G__29413;
i__28491_29388 = G__29414;
continue;
}
} else {
var temp__5823__auto___29415__$1 = cljs.core.seq(seq__28487_29385);
if(temp__5823__auto___29415__$1){
var seq__28487_29419__$1 = temp__5823__auto___29415__$1;
if(cljs.core.chunked_seq_QMARK_(seq__28487_29419__$1)){
var c__5568__auto___29420 = cljs.core.chunk_first(seq__28487_29419__$1);
var G__29421 = cljs.core.chunk_rest(seq__28487_29419__$1);
var G__29422 = c__5568__auto___29420;
var G__29423 = cljs.core.count(c__5568__auto___29420);
var G__29424 = (0);
seq__28487_29385 = G__29421;
chunk__28489_29386 = G__29422;
count__28490_29387 = G__29423;
i__28491_29388 = G__29424;
continue;
} else {
var child_29425 = cljs.core.first(seq__28487_29419__$1);
if(cljs.core.truth_(child_29425)){
node.appendChild(child_29425);


var G__29426 = cljs.core.next(seq__28487_29419__$1);
var G__29427 = null;
var G__29428 = (0);
var G__29429 = (0);
seq__28487_29385 = G__29426;
chunk__28489_29386 = G__29427;
count__28490_29387 = G__29428;
i__28491_29388 = G__29429;
continue;
} else {
var G__29430 = cljs.core.next(seq__28487_29419__$1);
var G__29431 = null;
var G__29432 = (0);
var G__29433 = (0);
seq__28487_29385 = G__29430;
chunk__28489_29386 = G__29431;
count__28490_29387 = G__29432;
i__28491_29388 = G__29433;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29382);
}
}


var G__29434 = cljs.core.next(seq__28433_29366__$1);
var G__29435 = null;
var G__29436 = (0);
var G__29437 = (0);
seq__28433_29295 = G__29434;
chunk__28435_29296 = G__29435;
count__28436_29297 = G__29436;
i__28437_29298 = G__29437;
continue;
} else {
var G__29438 = cljs.core.next(seq__28433_29366__$1);
var G__29439 = null;
var G__29440 = (0);
var G__29441 = (0);
seq__28433_29295 = G__29438;
chunk__28435_29296 = G__29439;
count__28436_29297 = G__29440;
i__28437_29298 = G__29441;
continue;
}
}
} else {
}
}
break;
}

return node;
});
(shadow.dom.SVGElement["string"] = true);

(shadow.dom._to_svg["string"] = (function (this$){
if((this$ instanceof cljs.core.Keyword)){
return shadow.dom.make_svg_node(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this$], null));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("strings cannot be in svgs",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"this","this",-611633625),this$], null));
}
}));

(cljs.core.PersistentVector.prototype.shadow$dom$SVGElement$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.PersistentVector.prototype.shadow$dom$SVGElement$_to_svg$arity$1 = (function (this$){
var this$__$1 = this;
return shadow.dom.make_svg_node(this$__$1);
}));

(cljs.core.LazySeq.prototype.shadow$dom$SVGElement$ = cljs.core.PROTOCOL_SENTINEL);

(cljs.core.LazySeq.prototype.shadow$dom$SVGElement$_to_svg$arity$1 = (function (this$){
var this$__$1 = this;
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom._to_svg,this$__$1);
}));

(shadow.dom.SVGElement["null"] = true);

(shadow.dom._to_svg["null"] = (function (_){
return null;
}));
shadow.dom.svg = (function shadow$dom$svg(var_args){
var args__5775__auto__ = [];
var len__5769__auto___29445 = arguments.length;
var i__5770__auto___29447 = (0);
while(true){
if((i__5770__auto___29447 < len__5769__auto___29445)){
args__5775__auto__.push((arguments[i__5770__auto___29447]));

var G__29448 = (i__5770__auto___29447 + (1));
i__5770__auto___29447 = G__29448;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((1) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((1)),(0),null)):null);
return shadow.dom.svg.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5776__auto__);
});

(shadow.dom.svg.cljs$core$IFn$_invoke$arity$variadic = (function (attrs,children){
return shadow.dom._to_svg(cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"svg","svg",856789142),attrs], null),children)));
}));

(shadow.dom.svg.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(shadow.dom.svg.cljs$lang$applyTo = (function (seq28511){
var G__28512 = cljs.core.first(seq28511);
var seq28511__$1 = cljs.core.next(seq28511);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28512,seq28511__$1);
}));


//# sourceMappingURL=shadow.dom.js.map
