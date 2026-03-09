goog.provide('shadow.dom');
shadow.dom.transition_supported_QMARK_ = true;

/**
 * @interface
 */
shadow.dom.IElement = function(){};

var shadow$dom$IElement$_to_dom$dyn_28468 = (function (this$){
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
return shadow$dom$IElement$_to_dom$dyn_28468(this$);
}
});


/**
 * @interface
 */
shadow.dom.SVGElement = function(){};

var shadow$dom$SVGElement$_to_svg$dyn_28469 = (function (this$){
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
return shadow$dom$SVGElement$_to_svg$dyn_28469(this$);
}
});

shadow.dom.lazy_native_coll_seq = (function shadow$dom$lazy_native_coll_seq(coll,idx){
if((idx < coll.length)){
return (new cljs.core.LazySeq(null,(function (){
return cljs.core.cons((coll[idx]),(function (){var G__26677 = coll;
var G__26678 = (idx + (1));
return (shadow.dom.lazy_native_coll_seq.cljs$core$IFn$_invoke$arity$2 ? shadow.dom.lazy_native_coll_seq.cljs$core$IFn$_invoke$arity$2(G__26677,G__26678) : shadow.dom.lazy_native_coll_seq.call(null, G__26677,G__26678));
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
var G__26695 = arguments.length;
switch (G__26695) {
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
var G__26699 = arguments.length;
switch (G__26699) {
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
var G__26716 = arguments.length;
switch (G__26716) {
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
var G__26720 = arguments.length;
switch (G__26720) {
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
var G__26729 = arguments.length;
switch (G__26729) {
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
}catch (e26740){if((e26740 instanceof Object)){
var e = e26740;
return console.log("didnt support attachEvent",el,e);
} else {
throw e26740;

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
var seq__26768 = cljs.core.seq(shadow.dom.query.cljs$core$IFn$_invoke$arity$2(selector,root_el));
var chunk__26769 = null;
var count__26770 = (0);
var i__26771 = (0);
while(true){
if((i__26771 < count__26770)){
var el = chunk__26769.cljs$core$IIndexed$_nth$arity$2(null, i__26771);
var handler_28506__$1 = ((function (seq__26768,chunk__26769,count__26770,i__26771,el){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26768,chunk__26769,count__26770,i__26771,el))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28506__$1);


var G__28507 = seq__26768;
var G__28508 = chunk__26769;
var G__28509 = count__26770;
var G__28510 = (i__26771 + (1));
seq__26768 = G__28507;
chunk__26769 = G__28508;
count__26770 = G__28509;
i__26771 = G__28510;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26768);
if(temp__5823__auto__){
var seq__26768__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26768__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26768__$1);
var G__28511 = cljs.core.chunk_rest(seq__26768__$1);
var G__28512 = c__5568__auto__;
var G__28513 = cljs.core.count(c__5568__auto__);
var G__28514 = (0);
seq__26768 = G__28511;
chunk__26769 = G__28512;
count__26770 = G__28513;
i__26771 = G__28514;
continue;
} else {
var el = cljs.core.first(seq__26768__$1);
var handler_28517__$1 = ((function (seq__26768,chunk__26769,count__26770,i__26771,el,seq__26768__$1,temp__5823__auto__){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26768,chunk__26769,count__26770,i__26771,el,seq__26768__$1,temp__5823__auto__))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28517__$1);


var G__28526 = cljs.core.next(seq__26768__$1);
var G__28527 = null;
var G__28528 = (0);
var G__28529 = (0);
seq__26768 = G__28526;
chunk__26769 = G__28527;
count__26770 = G__28528;
i__26771 = G__28529;
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
var G__26828 = arguments.length;
switch (G__26828) {
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
var seq__26861 = cljs.core.seq(events);
var chunk__26862 = null;
var count__26863 = (0);
var i__26864 = (0);
while(true){
if((i__26864 < count__26863)){
var vec__26904 = chunk__26862.cljs$core$IIndexed$_nth$arity$2(null, i__26864);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26904,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26904,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28534 = seq__26861;
var G__28535 = chunk__26862;
var G__28536 = count__26863;
var G__28537 = (i__26864 + (1));
seq__26861 = G__28534;
chunk__26862 = G__28535;
count__26863 = G__28536;
i__26864 = G__28537;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26861);
if(temp__5823__auto__){
var seq__26861__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26861__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26861__$1);
var G__28538 = cljs.core.chunk_rest(seq__26861__$1);
var G__28539 = c__5568__auto__;
var G__28540 = cljs.core.count(c__5568__auto__);
var G__28541 = (0);
seq__26861 = G__28538;
chunk__26862 = G__28539;
count__26863 = G__28540;
i__26864 = G__28541;
continue;
} else {
var vec__26919 = cljs.core.first(seq__26861__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26919,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26919,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28542 = cljs.core.next(seq__26861__$1);
var G__28543 = null;
var G__28544 = (0);
var G__28545 = (0);
seq__26861 = G__28542;
chunk__26862 = G__28543;
count__26863 = G__28544;
i__26864 = G__28545;
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
var seq__26938 = cljs.core.seq(styles);
var chunk__26939 = null;
var count__26940 = (0);
var i__26941 = (0);
while(true){
if((i__26941 < count__26940)){
var vec__26992 = chunk__26939.cljs$core$IIndexed$_nth$arity$2(null, i__26941);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26992,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26992,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28550 = seq__26938;
var G__28551 = chunk__26939;
var G__28552 = count__26940;
var G__28553 = (i__26941 + (1));
seq__26938 = G__28550;
chunk__26939 = G__28551;
count__26940 = G__28552;
i__26941 = G__28553;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26938);
if(temp__5823__auto__){
var seq__26938__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26938__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26938__$1);
var G__28555 = cljs.core.chunk_rest(seq__26938__$1);
var G__28556 = c__5568__auto__;
var G__28557 = cljs.core.count(c__5568__auto__);
var G__28558 = (0);
seq__26938 = G__28555;
chunk__26939 = G__28556;
count__26940 = G__28557;
i__26941 = G__28558;
continue;
} else {
var vec__27008 = cljs.core.first(seq__26938__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27008,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27008,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28560 = cljs.core.next(seq__26938__$1);
var G__28561 = null;
var G__28562 = (0);
var G__28563 = (0);
seq__26938 = G__28560;
chunk__26939 = G__28561;
count__26940 = G__28562;
i__26941 = G__28563;
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
var G__27033_28568 = key;
var G__27033_28569__$1 = (((G__27033_28568 instanceof cljs.core.Keyword))?G__27033_28568.fqn:null);
switch (G__27033_28569__$1) {
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
var ks_28574 = cljs.core.name(key);
if(cljs.core.truth_((function (){var or__5045__auto__ = goog.string.startsWith(ks_28574,"data-");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return goog.string.startsWith(ks_28574,"aria-");
}
})())){
el.setAttribute(ks_28574,value);
} else {
(el[ks_28574] = value);
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
shadow.dom.create_dom_node = (function shadow$dom$create_dom_node(tag_def,p__27099){
var map__27100 = p__27099;
var map__27100__$1 = cljs.core.__destructure_map(map__27100);
var props = map__27100__$1;
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27100__$1,new cljs.core.Keyword(null,"class","class",-2030961996));
var tag_props = ({});
var vec__27103 = shadow.dom.parse_tag(tag_def);
var tag_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27103,(0),null);
var tag_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27103,(1),null);
var tag_classes = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27103,(2),null);
if(cljs.core.truth_(tag_id)){
(tag_props["id"] = tag_id);
} else {
}

if(cljs.core.truth_(tag_classes)){
(tag_props["class"] = shadow.dom.merge_class_string(class$,tag_classes));
} else {
}

var G__27109 = goog.dom.createDom(tag_name,tag_props);
shadow.dom.set_attrs(G__27109,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(props,new cljs.core.Keyword(null,"class","class",-2030961996)));

return G__27109;
});
shadow.dom.append = (function shadow$dom$append(var_args){
var G__27117 = arguments.length;
switch (G__27117) {
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

shadow.dom.destructure_node = (function shadow$dom$destructure_node(create_fn,p__27136){
var vec__27137 = p__27136;
var seq__27138 = cljs.core.seq(vec__27137);
var first__27139 = cljs.core.first(seq__27138);
var seq__27138__$1 = cljs.core.next(seq__27138);
var nn = first__27139;
var first__27139__$1 = cljs.core.first(seq__27138__$1);
var seq__27138__$2 = cljs.core.next(seq__27138__$1);
var np = first__27139__$1;
var nc = seq__27138__$2;
var node = vec__27137;
if((nn instanceof cljs.core.Keyword)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("invalid dom node",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"node","node",581201198),node], null));
}

if((((np == null)) && ((nc == null)))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27145 = nn;
var G__27146 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27145,G__27146) : create_fn.call(null, G__27145,G__27146));
})(),cljs.core.List.EMPTY], null);
} else {
if(cljs.core.map_QMARK_(np)){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(nn,np) : create_fn.call(null, nn,np)),nc], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27147 = nn;
var G__27148 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27147,G__27148) : create_fn.call(null, G__27147,G__27148));
})(),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(nc,np)], null);

}
}
});
shadow.dom.make_dom_node = (function shadow$dom$make_dom_node(structure){
var vec__27158 = shadow.dom.destructure_node(shadow.dom.create_dom_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27158,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27158,(1),null);
var seq__27163_28593 = cljs.core.seq(node_children);
var chunk__27164_28594 = null;
var count__27165_28595 = (0);
var i__27166_28596 = (0);
while(true){
if((i__27166_28596 < count__27165_28595)){
var child_struct_28597 = chunk__27164_28594.cljs$core$IIndexed$_nth$arity$2(null, i__27166_28596);
var children_28598 = shadow.dom.dom_node(child_struct_28597);
if(cljs.core.seq_QMARK_(children_28598)){
var seq__27243_28599 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28598));
var chunk__27245_28600 = null;
var count__27246_28601 = (0);
var i__27247_28602 = (0);
while(true){
if((i__27247_28602 < count__27246_28601)){
var child_28603 = chunk__27245_28600.cljs$core$IIndexed$_nth$arity$2(null, i__27247_28602);
if(cljs.core.truth_(child_28603)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28603);


var G__28604 = seq__27243_28599;
var G__28605 = chunk__27245_28600;
var G__28606 = count__27246_28601;
var G__28607 = (i__27247_28602 + (1));
seq__27243_28599 = G__28604;
chunk__27245_28600 = G__28605;
count__27246_28601 = G__28606;
i__27247_28602 = G__28607;
continue;
} else {
var G__28608 = seq__27243_28599;
var G__28609 = chunk__27245_28600;
var G__28610 = count__27246_28601;
var G__28611 = (i__27247_28602 + (1));
seq__27243_28599 = G__28608;
chunk__27245_28600 = G__28609;
count__27246_28601 = G__28610;
i__27247_28602 = G__28611;
continue;
}
} else {
var temp__5823__auto___28612 = cljs.core.seq(seq__27243_28599);
if(temp__5823__auto___28612){
var seq__27243_28613__$1 = temp__5823__auto___28612;
if(cljs.core.chunked_seq_QMARK_(seq__27243_28613__$1)){
var c__5568__auto___28614 = cljs.core.chunk_first(seq__27243_28613__$1);
var G__28615 = cljs.core.chunk_rest(seq__27243_28613__$1);
var G__28616 = c__5568__auto___28614;
var G__28617 = cljs.core.count(c__5568__auto___28614);
var G__28618 = (0);
seq__27243_28599 = G__28615;
chunk__27245_28600 = G__28616;
count__27246_28601 = G__28617;
i__27247_28602 = G__28618;
continue;
} else {
var child_28620 = cljs.core.first(seq__27243_28613__$1);
if(cljs.core.truth_(child_28620)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28620);


var G__28627 = cljs.core.next(seq__27243_28613__$1);
var G__28628 = null;
var G__28629 = (0);
var G__28630 = (0);
seq__27243_28599 = G__28627;
chunk__27245_28600 = G__28628;
count__27246_28601 = G__28629;
i__27247_28602 = G__28630;
continue;
} else {
var G__28631 = cljs.core.next(seq__27243_28613__$1);
var G__28632 = null;
var G__28633 = (0);
var G__28634 = (0);
seq__27243_28599 = G__28631;
chunk__27245_28600 = G__28632;
count__27246_28601 = G__28633;
i__27247_28602 = G__28634;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28598);
}


var G__28635 = seq__27163_28593;
var G__28636 = chunk__27164_28594;
var G__28637 = count__27165_28595;
var G__28638 = (i__27166_28596 + (1));
seq__27163_28593 = G__28635;
chunk__27164_28594 = G__28636;
count__27165_28595 = G__28637;
i__27166_28596 = G__28638;
continue;
} else {
var temp__5823__auto___28639 = cljs.core.seq(seq__27163_28593);
if(temp__5823__auto___28639){
var seq__27163_28640__$1 = temp__5823__auto___28639;
if(cljs.core.chunked_seq_QMARK_(seq__27163_28640__$1)){
var c__5568__auto___28641 = cljs.core.chunk_first(seq__27163_28640__$1);
var G__28642 = cljs.core.chunk_rest(seq__27163_28640__$1);
var G__28643 = c__5568__auto___28641;
var G__28644 = cljs.core.count(c__5568__auto___28641);
var G__28645 = (0);
seq__27163_28593 = G__28642;
chunk__27164_28594 = G__28643;
count__27165_28595 = G__28644;
i__27166_28596 = G__28645;
continue;
} else {
var child_struct_28646 = cljs.core.first(seq__27163_28640__$1);
var children_28647 = shadow.dom.dom_node(child_struct_28646);
if(cljs.core.seq_QMARK_(children_28647)){
var seq__27284_28648 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28647));
var chunk__27286_28649 = null;
var count__27287_28650 = (0);
var i__27288_28651 = (0);
while(true){
if((i__27288_28651 < count__27287_28650)){
var child_28653 = chunk__27286_28649.cljs$core$IIndexed$_nth$arity$2(null, i__27288_28651);
if(cljs.core.truth_(child_28653)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28653);


var G__28655 = seq__27284_28648;
var G__28656 = chunk__27286_28649;
var G__28657 = count__27287_28650;
var G__28658 = (i__27288_28651 + (1));
seq__27284_28648 = G__28655;
chunk__27286_28649 = G__28656;
count__27287_28650 = G__28657;
i__27288_28651 = G__28658;
continue;
} else {
var G__28659 = seq__27284_28648;
var G__28660 = chunk__27286_28649;
var G__28661 = count__27287_28650;
var G__28662 = (i__27288_28651 + (1));
seq__27284_28648 = G__28659;
chunk__27286_28649 = G__28660;
count__27287_28650 = G__28661;
i__27288_28651 = G__28662;
continue;
}
} else {
var temp__5823__auto___28663__$1 = cljs.core.seq(seq__27284_28648);
if(temp__5823__auto___28663__$1){
var seq__27284_28664__$1 = temp__5823__auto___28663__$1;
if(cljs.core.chunked_seq_QMARK_(seq__27284_28664__$1)){
var c__5568__auto___28665 = cljs.core.chunk_first(seq__27284_28664__$1);
var G__28666 = cljs.core.chunk_rest(seq__27284_28664__$1);
var G__28667 = c__5568__auto___28665;
var G__28668 = cljs.core.count(c__5568__auto___28665);
var G__28669 = (0);
seq__27284_28648 = G__28666;
chunk__27286_28649 = G__28667;
count__27287_28650 = G__28668;
i__27288_28651 = G__28669;
continue;
} else {
var child_28670 = cljs.core.first(seq__27284_28664__$1);
if(cljs.core.truth_(child_28670)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28670);


var G__28671 = cljs.core.next(seq__27284_28664__$1);
var G__28672 = null;
var G__28673 = (0);
var G__28674 = (0);
seq__27284_28648 = G__28671;
chunk__27286_28649 = G__28672;
count__27287_28650 = G__28673;
i__27288_28651 = G__28674;
continue;
} else {
var G__28679 = cljs.core.next(seq__27284_28664__$1);
var G__28680 = null;
var G__28681 = (0);
var G__28682 = (0);
seq__27284_28648 = G__28679;
chunk__27286_28649 = G__28680;
count__27287_28650 = G__28681;
i__27288_28651 = G__28682;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28647);
}


var G__28683 = cljs.core.next(seq__27163_28640__$1);
var G__28684 = null;
var G__28685 = (0);
var G__28686 = (0);
seq__27163_28593 = G__28683;
chunk__27164_28594 = G__28684;
count__27165_28595 = G__28685;
i__27166_28596 = G__28686;
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
var seq__27344 = cljs.core.seq(node);
var chunk__27345 = null;
var count__27346 = (0);
var i__27347 = (0);
while(true){
if((i__27347 < count__27346)){
var n = chunk__27345.cljs$core$IIndexed$_nth$arity$2(null, i__27347);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28701 = seq__27344;
var G__28702 = chunk__27345;
var G__28703 = count__27346;
var G__28704 = (i__27347 + (1));
seq__27344 = G__28701;
chunk__27345 = G__28702;
count__27346 = G__28703;
i__27347 = G__28704;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27344);
if(temp__5823__auto__){
var seq__27344__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27344__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27344__$1);
var G__28711 = cljs.core.chunk_rest(seq__27344__$1);
var G__28712 = c__5568__auto__;
var G__28713 = cljs.core.count(c__5568__auto__);
var G__28714 = (0);
seq__27344 = G__28711;
chunk__27345 = G__28712;
count__27346 = G__28713;
i__27347 = G__28714;
continue;
} else {
var n = cljs.core.first(seq__27344__$1);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28718 = cljs.core.next(seq__27344__$1);
var G__28719 = null;
var G__28720 = (0);
var G__28721 = (0);
seq__27344 = G__28718;
chunk__27345 = G__28719;
count__27346 = G__28720;
i__27347 = G__28721;
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
var G__27373 = arguments.length;
switch (G__27373) {
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
var G__27381 = arguments.length;
switch (G__27381) {
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
var G__27403 = arguments.length;
switch (G__27403) {
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
var len__5769__auto___28754 = arguments.length;
var i__5770__auto___28756 = (0);
while(true){
if((i__5770__auto___28756 < len__5769__auto___28754)){
args__5775__auto__.push((arguments[i__5770__auto___28756]));

var G__28761 = (i__5770__auto___28756 + (1));
i__5770__auto___28756 = G__28761;
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
var seq__27440_28772 = cljs.core.seq(nodes);
var chunk__27441_28773 = null;
var count__27442_28774 = (0);
var i__27443_28775 = (0);
while(true){
if((i__27443_28775 < count__27442_28774)){
var node_28782 = chunk__27441_28773.cljs$core$IIndexed$_nth$arity$2(null, i__27443_28775);
fragment.appendChild(shadow.dom._to_dom(node_28782));


var G__28784 = seq__27440_28772;
var G__28785 = chunk__27441_28773;
var G__28786 = count__27442_28774;
var G__28787 = (i__27443_28775 + (1));
seq__27440_28772 = G__28784;
chunk__27441_28773 = G__28785;
count__27442_28774 = G__28786;
i__27443_28775 = G__28787;
continue;
} else {
var temp__5823__auto___28793 = cljs.core.seq(seq__27440_28772);
if(temp__5823__auto___28793){
var seq__27440_28794__$1 = temp__5823__auto___28793;
if(cljs.core.chunked_seq_QMARK_(seq__27440_28794__$1)){
var c__5568__auto___28795 = cljs.core.chunk_first(seq__27440_28794__$1);
var G__28796 = cljs.core.chunk_rest(seq__27440_28794__$1);
var G__28797 = c__5568__auto___28795;
var G__28798 = cljs.core.count(c__5568__auto___28795);
var G__28799 = (0);
seq__27440_28772 = G__28796;
chunk__27441_28773 = G__28797;
count__27442_28774 = G__28798;
i__27443_28775 = G__28799;
continue;
} else {
var node_28800 = cljs.core.first(seq__27440_28794__$1);
fragment.appendChild(shadow.dom._to_dom(node_28800));


var G__28802 = cljs.core.next(seq__27440_28794__$1);
var G__28803 = null;
var G__28804 = (0);
var G__28805 = (0);
seq__27440_28772 = G__28802;
chunk__27441_28773 = G__28803;
count__27442_28774 = G__28804;
i__27443_28775 = G__28805;
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
(shadow.dom.fragment.cljs$lang$applyTo = (function (seq27432){
var self__5755__auto__ = this;
return self__5755__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq27432));
}));

/**
 * given a html string, eval all <script> tags and return the html without the scripts
 * don't do this for everything, only content you trust.
 */
shadow.dom.eval_scripts = (function shadow$dom$eval_scripts(s){
var scripts = cljs.core.re_seq(/<script[^>]*?>(.+?)<\/script>/,s);
var seq__27461_28810 = cljs.core.seq(scripts);
var chunk__27462_28811 = null;
var count__27463_28812 = (0);
var i__27464_28813 = (0);
while(true){
if((i__27464_28813 < count__27463_28812)){
var vec__27478_28814 = chunk__27462_28811.cljs$core$IIndexed$_nth$arity$2(null, i__27464_28813);
var script_tag_28815 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27478_28814,(0),null);
var script_body_28816 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27478_28814,(1),null);
eval(script_body_28816);


var G__28817 = seq__27461_28810;
var G__28818 = chunk__27462_28811;
var G__28819 = count__27463_28812;
var G__28820 = (i__27464_28813 + (1));
seq__27461_28810 = G__28817;
chunk__27462_28811 = G__28818;
count__27463_28812 = G__28819;
i__27464_28813 = G__28820;
continue;
} else {
var temp__5823__auto___28821 = cljs.core.seq(seq__27461_28810);
if(temp__5823__auto___28821){
var seq__27461_28824__$1 = temp__5823__auto___28821;
if(cljs.core.chunked_seq_QMARK_(seq__27461_28824__$1)){
var c__5568__auto___28825 = cljs.core.chunk_first(seq__27461_28824__$1);
var G__28828 = cljs.core.chunk_rest(seq__27461_28824__$1);
var G__28829 = c__5568__auto___28825;
var G__28830 = cljs.core.count(c__5568__auto___28825);
var G__28831 = (0);
seq__27461_28810 = G__28828;
chunk__27462_28811 = G__28829;
count__27463_28812 = G__28830;
i__27464_28813 = G__28831;
continue;
} else {
var vec__27488_28833 = cljs.core.first(seq__27461_28824__$1);
var script_tag_28834 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27488_28833,(0),null);
var script_body_28835 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27488_28833,(1),null);
eval(script_body_28835);


var G__28841 = cljs.core.next(seq__27461_28824__$1);
var G__28842 = null;
var G__28843 = (0);
var G__28844 = (0);
seq__27461_28810 = G__28841;
chunk__27462_28811 = G__28842;
count__27463_28812 = G__28843;
i__27464_28813 = G__28844;
continue;
}
} else {
}
}
break;
}

return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (s__$1,p__27494){
var vec__27496 = p__27494;
var script_tag = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27496,(0),null);
var script_body = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27496,(1),null);
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
var G__27517 = arguments.length;
switch (G__27517) {
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
var seq__27553 = cljs.core.seq(style_keys);
var chunk__27554 = null;
var count__27555 = (0);
var i__27556 = (0);
while(true){
if((i__27556 < count__27555)){
var it = chunk__27554.cljs$core$IIndexed$_nth$arity$2(null, i__27556);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__28905 = seq__27553;
var G__28906 = chunk__27554;
var G__28907 = count__27555;
var G__28908 = (i__27556 + (1));
seq__27553 = G__28905;
chunk__27554 = G__28906;
count__27555 = G__28907;
i__27556 = G__28908;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27553);
if(temp__5823__auto__){
var seq__27553__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27553__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27553__$1);
var G__28910 = cljs.core.chunk_rest(seq__27553__$1);
var G__28911 = c__5568__auto__;
var G__28912 = cljs.core.count(c__5568__auto__);
var G__28913 = (0);
seq__27553 = G__28910;
chunk__27554 = G__28911;
count__27555 = G__28912;
i__27556 = G__28913;
continue;
} else {
var it = cljs.core.first(seq__27553__$1);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__28914 = cljs.core.next(seq__27553__$1);
var G__28915 = null;
var G__28916 = (0);
var G__28917 = (0);
seq__27553 = G__28914;
chunk__27554 = G__28915;
count__27555 = G__28916;
i__27556 = G__28917;
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

(shadow.dom.Coordinate.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k27576,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__27594 = k27576;
var G__27594__$1 = (((G__27594 instanceof cljs.core.Keyword))?G__27594.fqn:null);
switch (G__27594__$1) {
case "x":
return self__.x;

break;
case "y":
return self__.y;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k27576,else__5346__auto__);

}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__27600){
var vec__27604 = p__27600;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27604,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27604,(1),null);
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

(shadow.dom.Coordinate.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__27575){
var self__ = this;
var G__27575__$1 = this;
return (new cljs.core.RecordIter((0),G__27575__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"x","x",2099068185),new cljs.core.Keyword(null,"y","y",-1757859776)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
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

(shadow.dom.Coordinate.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this27577,other27578){
var self__ = this;
var this27577__$1 = this;
return (((!((other27578 == null)))) && ((((this27577__$1.constructor === other27578.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27577__$1.x,other27578.x)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27577__$1.y,other27578.y)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27577__$1.__extmap,other27578.__extmap)))))))));
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

(shadow.dom.Coordinate.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k27576){
var self__ = this;
var this__5350__auto____$1 = this;
var G__27676 = k27576;
var G__27676__$1 = (((G__27676 instanceof cljs.core.Keyword))?G__27676.fqn:null);
switch (G__27676__$1) {
case "x":
case "y":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k27576);

}
}));

(shadow.dom.Coordinate.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__27575){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__27685 = cljs.core.keyword_identical_QMARK_;
var expr__27686 = k__5352__auto__;
if(cljs.core.truth_((pred__27685.cljs$core$IFn$_invoke$arity$2 ? pred__27685.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"x","x",2099068185),expr__27686) : pred__27685.call(null, new cljs.core.Keyword(null,"x","x",2099068185),expr__27686)))){
return (new shadow.dom.Coordinate(G__27575,self__.y,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__27685.cljs$core$IFn$_invoke$arity$2 ? pred__27685.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"y","y",-1757859776),expr__27686) : pred__27685.call(null, new cljs.core.Keyword(null,"y","y",-1757859776),expr__27686)))){
return (new shadow.dom.Coordinate(self__.x,G__27575,self__.__meta,self__.__extmap,null));
} else {
return (new shadow.dom.Coordinate(self__.x,self__.y,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__27575),null));
}
}
}));

(shadow.dom.Coordinate.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"x","x",2099068185),self__.x,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"y","y",-1757859776),self__.y,null))], null),self__.__extmap));
}));

(shadow.dom.Coordinate.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__27575){
var self__ = this;
var this__5342__auto____$1 = this;
return (new shadow.dom.Coordinate(self__.x,self__.y,G__27575,self__.__extmap,self__.__hash));
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
shadow.dom.map__GT_Coordinate = (function shadow$dom$map__GT_Coordinate(G__27583){
var extmap__5385__auto__ = (function (){var G__27766 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__27583,new cljs.core.Keyword(null,"x","x",2099068185),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"y","y",-1757859776)], 0));
if(cljs.core.record_QMARK_(G__27583)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__27766);
} else {
return G__27766;
}
})();
return (new shadow.dom.Coordinate(new cljs.core.Keyword(null,"x","x",2099068185).cljs$core$IFn$_invoke$arity$1(G__27583),new cljs.core.Keyword(null,"y","y",-1757859776).cljs$core$IFn$_invoke$arity$1(G__27583),null,cljs.core.not_empty(extmap__5385__auto__),null));
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

(shadow.dom.Size.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k27797,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__27822 = k27797;
var G__27822__$1 = (((G__27822 instanceof cljs.core.Keyword))?G__27822.fqn:null);
switch (G__27822__$1) {
case "w":
return self__.w;

break;
case "h":
return self__.h;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k27797,else__5346__auto__);

}
}));

(shadow.dom.Size.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__27855){
var vec__27866 = p__27855;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27866,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27866,(1),null);
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

(shadow.dom.Size.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__27796){
var self__ = this;
var G__27796__$1 = this;
return (new cljs.core.RecordIter((0),G__27796__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"w","w",354169001),new cljs.core.Keyword(null,"h","h",1109658740)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
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

(shadow.dom.Size.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this27798,other27799){
var self__ = this;
var this27798__$1 = this;
return (((!((other27799 == null)))) && ((((this27798__$1.constructor === other27799.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27798__$1.w,other27799.w)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27798__$1.h,other27799.h)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27798__$1.__extmap,other27799.__extmap)))))))));
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

(shadow.dom.Size.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k27797){
var self__ = this;
var this__5350__auto____$1 = this;
var G__27921 = k27797;
var G__27921__$1 = (((G__27921 instanceof cljs.core.Keyword))?G__27921.fqn:null);
switch (G__27921__$1) {
case "w":
case "h":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k27797);

}
}));

(shadow.dom.Size.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__27796){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__27928 = cljs.core.keyword_identical_QMARK_;
var expr__27929 = k__5352__auto__;
if(cljs.core.truth_((pred__27928.cljs$core$IFn$_invoke$arity$2 ? pred__27928.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"w","w",354169001),expr__27929) : pred__27928.call(null, new cljs.core.Keyword(null,"w","w",354169001),expr__27929)))){
return (new shadow.dom.Size(G__27796,self__.h,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__27928.cljs$core$IFn$_invoke$arity$2 ? pred__27928.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"h","h",1109658740),expr__27929) : pred__27928.call(null, new cljs.core.Keyword(null,"h","h",1109658740),expr__27929)))){
return (new shadow.dom.Size(self__.w,G__27796,self__.__meta,self__.__extmap,null));
} else {
return (new shadow.dom.Size(self__.w,self__.h,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__27796),null));
}
}
}));

(shadow.dom.Size.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"w","w",354169001),self__.w,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"h","h",1109658740),self__.h,null))], null),self__.__extmap));
}));

(shadow.dom.Size.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__27796){
var self__ = this;
var this__5342__auto____$1 = this;
return (new shadow.dom.Size(self__.w,self__.h,G__27796,self__.__extmap,self__.__hash));
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
shadow.dom.map__GT_Size = (function shadow$dom$map__GT_Size(G__27811){
var extmap__5385__auto__ = (function (){var G__28029 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__27811,new cljs.core.Keyword(null,"w","w",354169001),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"h","h",1109658740)], 0));
if(cljs.core.record_QMARK_(G__27811)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__28029);
} else {
return G__28029;
}
})();
return (new shadow.dom.Size(new cljs.core.Keyword(null,"w","w",354169001).cljs$core$IFn$_invoke$arity$1(G__27811),new cljs.core.Keyword(null,"h","h",1109658740).cljs$core$IFn$_invoke$arity$1(G__27811),null,cljs.core.not_empty(extmap__5385__auto__),null));
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
var G__29040 = (i + (1));
var G__29041 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,(opts[i]["value"]));
i = G__29040;
ret = G__29041;
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
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(path),"?",clojure.string.join.cljs$core$IFn$_invoke$arity$2("&",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__28121){
var vec__28126 = p__28121;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28126,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28126,(1),null);
return [cljs.core.name(k),"=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)))].join('');
}),query_params))].join('');
}
});
shadow.dom.redirect = (function shadow$dom$redirect(var_args){
var G__28150 = arguments.length;
switch (G__28150) {
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
var G__29057 = ps;
var G__29058 = (i + (1));
el__$1 = G__29057;
i = G__29058;
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
var vec__28275 = shadow.dom.parse_tag(tag_def);
var tag_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28275,(0),null);
var tag_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28275,(1),null);
var tag_classes = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28275,(2),null);
var el = document.createElementNS("http://www.w3.org/2000/svg",tag_name);
if(cljs.core.truth_(tag_id)){
el.setAttribute("id",tag_id);
} else {
}

if(cljs.core.truth_(tag_classes)){
el.setAttribute("class",shadow.dom.merge_class_string(new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(props),tag_classes));
} else {
}

var seq__28293_29063 = cljs.core.seq(props);
var chunk__28294_29064 = null;
var count__28295_29065 = (0);
var i__28296_29066 = (0);
while(true){
if((i__28296_29066 < count__28295_29065)){
var vec__28320_29070 = chunk__28294_29064.cljs$core$IIndexed$_nth$arity$2(null, i__28296_29066);
var k_29071 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28320_29070,(0),null);
var v_29072 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28320_29070,(1),null);
el.setAttributeNS((function (){var temp__5823__auto__ = cljs.core.namespace(k_29071);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29071),v_29072);


var G__29073 = seq__28293_29063;
var G__29074 = chunk__28294_29064;
var G__29075 = count__28295_29065;
var G__29076 = (i__28296_29066 + (1));
seq__28293_29063 = G__29073;
chunk__28294_29064 = G__29074;
count__28295_29065 = G__29075;
i__28296_29066 = G__29076;
continue;
} else {
var temp__5823__auto___29077 = cljs.core.seq(seq__28293_29063);
if(temp__5823__auto___29077){
var seq__28293_29078__$1 = temp__5823__auto___29077;
if(cljs.core.chunked_seq_QMARK_(seq__28293_29078__$1)){
var c__5568__auto___29083 = cljs.core.chunk_first(seq__28293_29078__$1);
var G__29084 = cljs.core.chunk_rest(seq__28293_29078__$1);
var G__29085 = c__5568__auto___29083;
var G__29086 = cljs.core.count(c__5568__auto___29083);
var G__29087 = (0);
seq__28293_29063 = G__29084;
chunk__28294_29064 = G__29085;
count__28295_29065 = G__29086;
i__28296_29066 = G__29087;
continue;
} else {
var vec__28335_29088 = cljs.core.first(seq__28293_29078__$1);
var k_29089 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28335_29088,(0),null);
var v_29090 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28335_29088,(1),null);
el.setAttributeNS((function (){var temp__5823__auto____$1 = cljs.core.namespace(k_29089);
if(cljs.core.truth_(temp__5823__auto____$1)){
var ns = temp__5823__auto____$1;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29089),v_29090);


var G__29092 = cljs.core.next(seq__28293_29078__$1);
var G__29093 = null;
var G__29094 = (0);
var G__29095 = (0);
seq__28293_29063 = G__29092;
chunk__28294_29064 = G__29093;
count__28295_29065 = G__29094;
i__28296_29066 = G__29095;
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
var vec__28375 = shadow.dom.destructure_node(shadow.dom.create_svg_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28375,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28375,(1),null);
var seq__28381_29102 = cljs.core.seq(node_children);
var chunk__28383_29103 = null;
var count__28384_29104 = (0);
var i__28385_29105 = (0);
while(true){
if((i__28385_29105 < count__28384_29104)){
var child_struct_29106 = chunk__28383_29103.cljs$core$IIndexed$_nth$arity$2(null, i__28385_29105);
if((!((child_struct_29106 == null)))){
if(typeof child_struct_29106 === 'string'){
var text_29113 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29113),child_struct_29106].join(''));
} else {
var children_29114 = shadow.dom.svg_node(child_struct_29106);
if(cljs.core.seq_QMARK_(children_29114)){
var seq__28431_29115 = cljs.core.seq(children_29114);
var chunk__28433_29116 = null;
var count__28434_29117 = (0);
var i__28435_29118 = (0);
while(true){
if((i__28435_29118 < count__28434_29117)){
var child_29119 = chunk__28433_29116.cljs$core$IIndexed$_nth$arity$2(null, i__28435_29118);
if(cljs.core.truth_(child_29119)){
node.appendChild(child_29119);


var G__29121 = seq__28431_29115;
var G__29122 = chunk__28433_29116;
var G__29123 = count__28434_29117;
var G__29124 = (i__28435_29118 + (1));
seq__28431_29115 = G__29121;
chunk__28433_29116 = G__29122;
count__28434_29117 = G__29123;
i__28435_29118 = G__29124;
continue;
} else {
var G__29125 = seq__28431_29115;
var G__29126 = chunk__28433_29116;
var G__29127 = count__28434_29117;
var G__29128 = (i__28435_29118 + (1));
seq__28431_29115 = G__29125;
chunk__28433_29116 = G__29126;
count__28434_29117 = G__29127;
i__28435_29118 = G__29128;
continue;
}
} else {
var temp__5823__auto___29133 = cljs.core.seq(seq__28431_29115);
if(temp__5823__auto___29133){
var seq__28431_29134__$1 = temp__5823__auto___29133;
if(cljs.core.chunked_seq_QMARK_(seq__28431_29134__$1)){
var c__5568__auto___29135 = cljs.core.chunk_first(seq__28431_29134__$1);
var G__29136 = cljs.core.chunk_rest(seq__28431_29134__$1);
var G__29137 = c__5568__auto___29135;
var G__29138 = cljs.core.count(c__5568__auto___29135);
var G__29139 = (0);
seq__28431_29115 = G__29136;
chunk__28433_29116 = G__29137;
count__28434_29117 = G__29138;
i__28435_29118 = G__29139;
continue;
} else {
var child_29140 = cljs.core.first(seq__28431_29134__$1);
if(cljs.core.truth_(child_29140)){
node.appendChild(child_29140);


var G__29141 = cljs.core.next(seq__28431_29134__$1);
var G__29142 = null;
var G__29143 = (0);
var G__29144 = (0);
seq__28431_29115 = G__29141;
chunk__28433_29116 = G__29142;
count__28434_29117 = G__29143;
i__28435_29118 = G__29144;
continue;
} else {
var G__29146 = cljs.core.next(seq__28431_29134__$1);
var G__29147 = null;
var G__29148 = (0);
var G__29149 = (0);
seq__28431_29115 = G__29146;
chunk__28433_29116 = G__29147;
count__28434_29117 = G__29148;
i__28435_29118 = G__29149;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29114);
}
}


var G__29150 = seq__28381_29102;
var G__29151 = chunk__28383_29103;
var G__29152 = count__28384_29104;
var G__29153 = (i__28385_29105 + (1));
seq__28381_29102 = G__29150;
chunk__28383_29103 = G__29151;
count__28384_29104 = G__29152;
i__28385_29105 = G__29153;
continue;
} else {
var G__29154 = seq__28381_29102;
var G__29155 = chunk__28383_29103;
var G__29156 = count__28384_29104;
var G__29157 = (i__28385_29105 + (1));
seq__28381_29102 = G__29154;
chunk__28383_29103 = G__29155;
count__28384_29104 = G__29156;
i__28385_29105 = G__29157;
continue;
}
} else {
var temp__5823__auto___29158 = cljs.core.seq(seq__28381_29102);
if(temp__5823__auto___29158){
var seq__28381_29159__$1 = temp__5823__auto___29158;
if(cljs.core.chunked_seq_QMARK_(seq__28381_29159__$1)){
var c__5568__auto___29166 = cljs.core.chunk_first(seq__28381_29159__$1);
var G__29167 = cljs.core.chunk_rest(seq__28381_29159__$1);
var G__29168 = c__5568__auto___29166;
var G__29169 = cljs.core.count(c__5568__auto___29166);
var G__29170 = (0);
seq__28381_29102 = G__29167;
chunk__28383_29103 = G__29168;
count__28384_29104 = G__29169;
i__28385_29105 = G__29170;
continue;
} else {
var child_struct_29171 = cljs.core.first(seq__28381_29159__$1);
if((!((child_struct_29171 == null)))){
if(typeof child_struct_29171 === 'string'){
var text_29172 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29172),child_struct_29171].join(''));
} else {
var children_29173 = shadow.dom.svg_node(child_struct_29171);
if(cljs.core.seq_QMARK_(children_29173)){
var seq__28440_29174 = cljs.core.seq(children_29173);
var chunk__28442_29175 = null;
var count__28443_29176 = (0);
var i__28444_29177 = (0);
while(true){
if((i__28444_29177 < count__28443_29176)){
var child_29178 = chunk__28442_29175.cljs$core$IIndexed$_nth$arity$2(null, i__28444_29177);
if(cljs.core.truth_(child_29178)){
node.appendChild(child_29178);


var G__29185 = seq__28440_29174;
var G__29186 = chunk__28442_29175;
var G__29187 = count__28443_29176;
var G__29188 = (i__28444_29177 + (1));
seq__28440_29174 = G__29185;
chunk__28442_29175 = G__29186;
count__28443_29176 = G__29187;
i__28444_29177 = G__29188;
continue;
} else {
var G__29189 = seq__28440_29174;
var G__29190 = chunk__28442_29175;
var G__29191 = count__28443_29176;
var G__29192 = (i__28444_29177 + (1));
seq__28440_29174 = G__29189;
chunk__28442_29175 = G__29190;
count__28443_29176 = G__29191;
i__28444_29177 = G__29192;
continue;
}
} else {
var temp__5823__auto___29193__$1 = cljs.core.seq(seq__28440_29174);
if(temp__5823__auto___29193__$1){
var seq__28440_29194__$1 = temp__5823__auto___29193__$1;
if(cljs.core.chunked_seq_QMARK_(seq__28440_29194__$1)){
var c__5568__auto___29195 = cljs.core.chunk_first(seq__28440_29194__$1);
var G__29196 = cljs.core.chunk_rest(seq__28440_29194__$1);
var G__29197 = c__5568__auto___29195;
var G__29198 = cljs.core.count(c__5568__auto___29195);
var G__29199 = (0);
seq__28440_29174 = G__29196;
chunk__28442_29175 = G__29197;
count__28443_29176 = G__29198;
i__28444_29177 = G__29199;
continue;
} else {
var child_29200 = cljs.core.first(seq__28440_29194__$1);
if(cljs.core.truth_(child_29200)){
node.appendChild(child_29200);


var G__29201 = cljs.core.next(seq__28440_29194__$1);
var G__29202 = null;
var G__29203 = (0);
var G__29204 = (0);
seq__28440_29174 = G__29201;
chunk__28442_29175 = G__29202;
count__28443_29176 = G__29203;
i__28444_29177 = G__29204;
continue;
} else {
var G__29205 = cljs.core.next(seq__28440_29194__$1);
var G__29206 = null;
var G__29207 = (0);
var G__29208 = (0);
seq__28440_29174 = G__29205;
chunk__28442_29175 = G__29206;
count__28443_29176 = G__29207;
i__28444_29177 = G__29208;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29173);
}
}


var G__29210 = cljs.core.next(seq__28381_29159__$1);
var G__29211 = null;
var G__29212 = (0);
var G__29213 = (0);
seq__28381_29102 = G__29210;
chunk__28383_29103 = G__29211;
count__28384_29104 = G__29212;
i__28385_29105 = G__29213;
continue;
} else {
var G__29214 = cljs.core.next(seq__28381_29159__$1);
var G__29215 = null;
var G__29216 = (0);
var G__29217 = (0);
seq__28381_29102 = G__29214;
chunk__28383_29103 = G__29215;
count__28384_29104 = G__29216;
i__28385_29105 = G__29217;
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
var len__5769__auto___29225 = arguments.length;
var i__5770__auto___29226 = (0);
while(true){
if((i__5770__auto___29226 < len__5769__auto___29225)){
args__5775__auto__.push((arguments[i__5770__auto___29226]));

var G__29227 = (i__5770__auto___29226 + (1));
i__5770__auto___29226 = G__29227;
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
(shadow.dom.svg.cljs$lang$applyTo = (function (seq28452){
var G__28453 = cljs.core.first(seq28452);
var seq28452__$1 = cljs.core.next(seq28452);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28453,seq28452__$1);
}));


//# sourceMappingURL=shadow.dom.js.map
