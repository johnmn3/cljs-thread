goog.provide('shadow.dom');
shadow.dom.transition_supported_QMARK_ = true;

/**
 * @interface
 */
shadow.dom.IElement = function(){};

var shadow$dom$IElement$_to_dom$dyn_28521 = (function (this$){
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
return shadow$dom$IElement$_to_dom$dyn_28521(this$);
}
});


/**
 * @interface
 */
shadow.dom.SVGElement = function(){};

var shadow$dom$SVGElement$_to_svg$dyn_28522 = (function (this$){
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
return shadow$dom$SVGElement$_to_svg$dyn_28522(this$);
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
var G__26700 = arguments.length;
switch (G__26700) {
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
var G__26715 = arguments.length;
switch (G__26715) {
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
var G__26722 = arguments.length;
switch (G__26722) {
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
var G__26730 = arguments.length;
switch (G__26730) {
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
}catch (e26748){if((e26748 instanceof Object)){
var e = e26748;
return console.log("didnt support attachEvent",el,e);
} else {
throw e26748;

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
var seq__26784 = cljs.core.seq(shadow.dom.query.cljs$core$IFn$_invoke$arity$2(selector,root_el));
var chunk__26785 = null;
var count__26786 = (0);
var i__26787 = (0);
while(true){
if((i__26787 < count__26786)){
var el = chunk__26785.cljs$core$IIndexed$_nth$arity$2(null, i__26787);
var handler_28602__$1 = ((function (seq__26784,chunk__26785,count__26786,i__26787,el){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26784,chunk__26785,count__26786,i__26787,el))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28602__$1);


var G__28603 = seq__26784;
var G__28604 = chunk__26785;
var G__28605 = count__26786;
var G__28606 = (i__26787 + (1));
seq__26784 = G__28603;
chunk__26785 = G__28604;
count__26786 = G__28605;
i__26787 = G__28606;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26784);
if(temp__5823__auto__){
var seq__26784__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26784__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26784__$1);
var G__28608 = cljs.core.chunk_rest(seq__26784__$1);
var G__28609 = c__5568__auto__;
var G__28610 = cljs.core.count(c__5568__auto__);
var G__28611 = (0);
seq__26784 = G__28608;
chunk__26785 = G__28609;
count__26786 = G__28610;
i__26787 = G__28611;
continue;
} else {
var el = cljs.core.first(seq__26784__$1);
var handler_28615__$1 = ((function (seq__26784,chunk__26785,count__26786,i__26787,el,seq__26784__$1,temp__5823__auto__){
return (function (e){
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(e,el) : handler.call(null, e,el));
});})(seq__26784,chunk__26785,count__26786,i__26787,el,seq__26784__$1,temp__5823__auto__))
;
shadow.dom.dom_listen(el,cljs.core.name(ev),handler_28615__$1);


var G__28617 = cljs.core.next(seq__26784__$1);
var G__28618 = null;
var G__28619 = (0);
var G__28620 = (0);
seq__26784 = G__28617;
chunk__26785 = G__28618;
count__26786 = G__28619;
i__26787 = G__28620;
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
var G__26850 = arguments.length;
switch (G__26850) {
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
var seq__26897 = cljs.core.seq(events);
var chunk__26898 = null;
var count__26899 = (0);
var i__26900 = (0);
while(true){
if((i__26900 < count__26899)){
var vec__26945 = chunk__26898.cljs$core$IIndexed$_nth$arity$2(null, i__26900);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26945,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26945,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28637 = seq__26897;
var G__28638 = chunk__26898;
var G__28639 = count__26899;
var G__28640 = (i__26900 + (1));
seq__26897 = G__28637;
chunk__26898 = G__28638;
count__26899 = G__28639;
i__26900 = G__28640;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26897);
if(temp__5823__auto__){
var seq__26897__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26897__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26897__$1);
var G__28642 = cljs.core.chunk_rest(seq__26897__$1);
var G__28643 = c__5568__auto__;
var G__28644 = cljs.core.count(c__5568__auto__);
var G__28645 = (0);
seq__26897 = G__28642;
chunk__26898 = G__28643;
count__26899 = G__28644;
i__26900 = G__28645;
continue;
} else {
var vec__26966 = cljs.core.first(seq__26897__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26966,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26966,(1),null);
shadow.dom.on.cljs$core$IFn$_invoke$arity$3(el,k,v);


var G__28650 = cljs.core.next(seq__26897__$1);
var G__28651 = null;
var G__28652 = (0);
var G__28653 = (0);
seq__26897 = G__28650;
chunk__26898 = G__28651;
count__26899 = G__28652;
i__26900 = G__28653;
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
var seq__26978 = cljs.core.seq(styles);
var chunk__26979 = null;
var count__26980 = (0);
var i__26981 = (0);
while(true){
if((i__26981 < count__26980)){
var vec__27015 = chunk__26979.cljs$core$IIndexed$_nth$arity$2(null, i__26981);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27015,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27015,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28671 = seq__26978;
var G__28672 = chunk__26979;
var G__28673 = count__26980;
var G__28674 = (i__26981 + (1));
seq__26978 = G__28671;
chunk__26979 = G__28672;
count__26980 = G__28673;
i__26981 = G__28674;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__26978);
if(temp__5823__auto__){
var seq__26978__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__26978__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__26978__$1);
var G__28675 = cljs.core.chunk_rest(seq__26978__$1);
var G__28676 = c__5568__auto__;
var G__28677 = cljs.core.count(c__5568__auto__);
var G__28678 = (0);
seq__26978 = G__28675;
chunk__26979 = G__28676;
count__26980 = G__28677;
i__26981 = G__28678;
continue;
} else {
var vec__27044 = cljs.core.first(seq__26978__$1);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27044,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27044,(1),null);
goog.style.setStyle(dom,cljs.core.name(k),(((v == null))?"":v));


var G__28689 = cljs.core.next(seq__26978__$1);
var G__28690 = null;
var G__28691 = (0);
var G__28692 = (0);
seq__26978 = G__28689;
chunk__26979 = G__28690;
count__26980 = G__28691;
i__26981 = G__28692;
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
var G__27077_28703 = key;
var G__27077_28704__$1 = (((G__27077_28703 instanceof cljs.core.Keyword))?G__27077_28703.fqn:null);
switch (G__27077_28704__$1) {
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
var ks_28736 = cljs.core.name(key);
if(cljs.core.truth_((function (){var or__5045__auto__ = goog.string.startsWith(ks_28736,"data-");
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return goog.string.startsWith(ks_28736,"aria-");
}
})())){
el.setAttribute(ks_28736,value);
} else {
(el[ks_28736] = value);
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
shadow.dom.create_dom_node = (function shadow$dom$create_dom_node(tag_def,p__27130){
var map__27131 = p__27130;
var map__27131__$1 = cljs.core.__destructure_map(map__27131);
var props = map__27131__$1;
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27131__$1,new cljs.core.Keyword(null,"class","class",-2030961996));
var tag_props = ({});
var vec__27135 = shadow.dom.parse_tag(tag_def);
var tag_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27135,(0),null);
var tag_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27135,(1),null);
var tag_classes = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27135,(2),null);
if(cljs.core.truth_(tag_id)){
(tag_props["id"] = tag_id);
} else {
}

if(cljs.core.truth_(tag_classes)){
(tag_props["class"] = shadow.dom.merge_class_string(class$,tag_classes));
} else {
}

var G__27143 = goog.dom.createDom(tag_name,tag_props);
shadow.dom.set_attrs(G__27143,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(props,new cljs.core.Keyword(null,"class","class",-2030961996)));

return G__27143;
});
shadow.dom.append = (function shadow$dom$append(var_args){
var G__27151 = arguments.length;
switch (G__27151) {
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

shadow.dom.destructure_node = (function shadow$dom$destructure_node(create_fn,p__27174){
var vec__27176 = p__27174;
var seq__27177 = cljs.core.seq(vec__27176);
var first__27178 = cljs.core.first(seq__27177);
var seq__27177__$1 = cljs.core.next(seq__27177);
var nn = first__27178;
var first__27178__$1 = cljs.core.first(seq__27177__$1);
var seq__27177__$2 = cljs.core.next(seq__27177__$1);
var np = first__27178__$1;
var nc = seq__27177__$2;
var node = vec__27176;
if((nn instanceof cljs.core.Keyword)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("invalid dom node",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"node","node",581201198),node], null));
}

if((((np == null)) && ((nc == null)))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27181 = nn;
var G__27182 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27181,G__27182) : create_fn.call(null, G__27181,G__27182));
})(),cljs.core.List.EMPTY], null);
} else {
if(cljs.core.map_QMARK_(np)){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(nn,np) : create_fn.call(null, nn,np)),nc], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__27186 = nn;
var G__27187 = cljs.core.PersistentArrayMap.EMPTY;
return (create_fn.cljs$core$IFn$_invoke$arity$2 ? create_fn.cljs$core$IFn$_invoke$arity$2(G__27186,G__27187) : create_fn.call(null, G__27186,G__27187));
})(),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(nc,np)], null);

}
}
});
shadow.dom.make_dom_node = (function shadow$dom$make_dom_node(structure){
var vec__27194 = shadow.dom.destructure_node(shadow.dom.create_dom_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27194,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27194,(1),null);
var seq__27197_28802 = cljs.core.seq(node_children);
var chunk__27198_28803 = null;
var count__27199_28804 = (0);
var i__27200_28805 = (0);
while(true){
if((i__27200_28805 < count__27199_28804)){
var child_struct_28808 = chunk__27198_28803.cljs$core$IIndexed$_nth$arity$2(null, i__27200_28805);
var children_28809 = shadow.dom.dom_node(child_struct_28808);
if(cljs.core.seq_QMARK_(children_28809)){
var seq__27275_28812 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28809));
var chunk__27277_28813 = null;
var count__27278_28814 = (0);
var i__27279_28815 = (0);
while(true){
if((i__27279_28815 < count__27278_28814)){
var child_28818 = chunk__27277_28813.cljs$core$IIndexed$_nth$arity$2(null, i__27279_28815);
if(cljs.core.truth_(child_28818)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28818);


var G__28823 = seq__27275_28812;
var G__28824 = chunk__27277_28813;
var G__28825 = count__27278_28814;
var G__28826 = (i__27279_28815 + (1));
seq__27275_28812 = G__28823;
chunk__27277_28813 = G__28824;
count__27278_28814 = G__28825;
i__27279_28815 = G__28826;
continue;
} else {
var G__28831 = seq__27275_28812;
var G__28832 = chunk__27277_28813;
var G__28833 = count__27278_28814;
var G__28834 = (i__27279_28815 + (1));
seq__27275_28812 = G__28831;
chunk__27277_28813 = G__28832;
count__27278_28814 = G__28833;
i__27279_28815 = G__28834;
continue;
}
} else {
var temp__5823__auto___28837 = cljs.core.seq(seq__27275_28812);
if(temp__5823__auto___28837){
var seq__27275_28840__$1 = temp__5823__auto___28837;
if(cljs.core.chunked_seq_QMARK_(seq__27275_28840__$1)){
var c__5568__auto___28843 = cljs.core.chunk_first(seq__27275_28840__$1);
var G__28844 = cljs.core.chunk_rest(seq__27275_28840__$1);
var G__28845 = c__5568__auto___28843;
var G__28846 = cljs.core.count(c__5568__auto___28843);
var G__28847 = (0);
seq__27275_28812 = G__28844;
chunk__27277_28813 = G__28845;
count__27278_28814 = G__28846;
i__27279_28815 = G__28847;
continue;
} else {
var child_28848 = cljs.core.first(seq__27275_28840__$1);
if(cljs.core.truth_(child_28848)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28848);


var G__28849 = cljs.core.next(seq__27275_28840__$1);
var G__28850 = null;
var G__28851 = (0);
var G__28852 = (0);
seq__27275_28812 = G__28849;
chunk__27277_28813 = G__28850;
count__27278_28814 = G__28851;
i__27279_28815 = G__28852;
continue;
} else {
var G__28853 = cljs.core.next(seq__27275_28840__$1);
var G__28854 = null;
var G__28855 = (0);
var G__28856 = (0);
seq__27275_28812 = G__28853;
chunk__27277_28813 = G__28854;
count__27278_28814 = G__28855;
i__27279_28815 = G__28856;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28809);
}


var G__28858 = seq__27197_28802;
var G__28859 = chunk__27198_28803;
var G__28860 = count__27199_28804;
var G__28861 = (i__27200_28805 + (1));
seq__27197_28802 = G__28858;
chunk__27198_28803 = G__28859;
count__27199_28804 = G__28860;
i__27200_28805 = G__28861;
continue;
} else {
var temp__5823__auto___28867 = cljs.core.seq(seq__27197_28802);
if(temp__5823__auto___28867){
var seq__27197_28869__$1 = temp__5823__auto___28867;
if(cljs.core.chunked_seq_QMARK_(seq__27197_28869__$1)){
var c__5568__auto___28874 = cljs.core.chunk_first(seq__27197_28869__$1);
var G__28876 = cljs.core.chunk_rest(seq__27197_28869__$1);
var G__28877 = c__5568__auto___28874;
var G__28878 = cljs.core.count(c__5568__auto___28874);
var G__28879 = (0);
seq__27197_28802 = G__28876;
chunk__27198_28803 = G__28877;
count__27199_28804 = G__28878;
i__27200_28805 = G__28879;
continue;
} else {
var child_struct_28881 = cljs.core.first(seq__27197_28869__$1);
var children_28882 = shadow.dom.dom_node(child_struct_28881);
if(cljs.core.seq_QMARK_(children_28882)){
var seq__27314_28887 = cljs.core.seq(cljs.core.map.cljs$core$IFn$_invoke$arity$2(shadow.dom.dom_node,children_28882));
var chunk__27316_28888 = null;
var count__27317_28889 = (0);
var i__27318_28890 = (0);
while(true){
if((i__27318_28890 < count__27317_28889)){
var child_28892 = chunk__27316_28888.cljs$core$IIndexed$_nth$arity$2(null, i__27318_28890);
if(cljs.core.truth_(child_28892)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28892);


var G__28897 = seq__27314_28887;
var G__28898 = chunk__27316_28888;
var G__28899 = count__27317_28889;
var G__28900 = (i__27318_28890 + (1));
seq__27314_28887 = G__28897;
chunk__27316_28888 = G__28898;
count__27317_28889 = G__28899;
i__27318_28890 = G__28900;
continue;
} else {
var G__28906 = seq__27314_28887;
var G__28907 = chunk__27316_28888;
var G__28908 = count__27317_28889;
var G__28909 = (i__27318_28890 + (1));
seq__27314_28887 = G__28906;
chunk__27316_28888 = G__28907;
count__27317_28889 = G__28908;
i__27318_28890 = G__28909;
continue;
}
} else {
var temp__5823__auto___28910__$1 = cljs.core.seq(seq__27314_28887);
if(temp__5823__auto___28910__$1){
var seq__27314_28911__$1 = temp__5823__auto___28910__$1;
if(cljs.core.chunked_seq_QMARK_(seq__27314_28911__$1)){
var c__5568__auto___28912 = cljs.core.chunk_first(seq__27314_28911__$1);
var G__28913 = cljs.core.chunk_rest(seq__27314_28911__$1);
var G__28914 = c__5568__auto___28912;
var G__28915 = cljs.core.count(c__5568__auto___28912);
var G__28916 = (0);
seq__27314_28887 = G__28913;
chunk__27316_28888 = G__28914;
count__27317_28889 = G__28915;
i__27318_28890 = G__28916;
continue;
} else {
var child_28917 = cljs.core.first(seq__27314_28911__$1);
if(cljs.core.truth_(child_28917)){
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,child_28917);


var G__28918 = cljs.core.next(seq__27314_28911__$1);
var G__28919 = null;
var G__28920 = (0);
var G__28921 = (0);
seq__27314_28887 = G__28918;
chunk__27316_28888 = G__28919;
count__27317_28889 = G__28920;
i__27318_28890 = G__28921;
continue;
} else {
var G__28922 = cljs.core.next(seq__27314_28911__$1);
var G__28923 = null;
var G__28924 = (0);
var G__28925 = (0);
seq__27314_28887 = G__28922;
chunk__27316_28888 = G__28923;
count__27317_28889 = G__28924;
i__27318_28890 = G__28925;
continue;
}
}
} else {
}
}
break;
}
} else {
shadow.dom.append.cljs$core$IFn$_invoke$arity$2(node,children_28882);
}


var G__28927 = cljs.core.next(seq__27197_28869__$1);
var G__28928 = null;
var G__28929 = (0);
var G__28930 = (0);
seq__27197_28802 = G__28927;
chunk__27198_28803 = G__28928;
count__27199_28804 = G__28929;
i__27200_28805 = G__28930;
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
var seq__27372 = cljs.core.seq(node);
var chunk__27373 = null;
var count__27374 = (0);
var i__27375 = (0);
while(true){
if((i__27375 < count__27374)){
var n = chunk__27373.cljs$core$IIndexed$_nth$arity$2(null, i__27375);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28937 = seq__27372;
var G__28938 = chunk__27373;
var G__28939 = count__27374;
var G__28940 = (i__27375 + (1));
seq__27372 = G__28937;
chunk__27373 = G__28938;
count__27374 = G__28939;
i__27375 = G__28940;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27372);
if(temp__5823__auto__){
var seq__27372__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27372__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27372__$1);
var G__28941 = cljs.core.chunk_rest(seq__27372__$1);
var G__28942 = c__5568__auto__;
var G__28943 = cljs.core.count(c__5568__auto__);
var G__28944 = (0);
seq__27372 = G__28941;
chunk__27373 = G__28942;
count__27374 = G__28943;
i__27375 = G__28944;
continue;
} else {
var n = cljs.core.first(seq__27372__$1);
(shadow.dom.remove.cljs$core$IFn$_invoke$arity$1 ? shadow.dom.remove.cljs$core$IFn$_invoke$arity$1(n) : shadow.dom.remove.call(null, n));


var G__28946 = cljs.core.next(seq__27372__$1);
var G__28947 = null;
var G__28948 = (0);
var G__28949 = (0);
seq__27372 = G__28946;
chunk__27373 = G__28947;
count__27374 = G__28948;
i__27375 = G__28949;
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
var G__27399 = arguments.length;
switch (G__27399) {
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
var G__27418 = arguments.length;
switch (G__27418) {
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
var G__27437 = arguments.length;
switch (G__27437) {
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
var len__5769__auto___28963 = arguments.length;
var i__5770__auto___28964 = (0);
while(true){
if((i__5770__auto___28964 < len__5769__auto___28963)){
args__5775__auto__.push((arguments[i__5770__auto___28964]));

var G__28968 = (i__5770__auto___28964 + (1));
i__5770__auto___28964 = G__28968;
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
var node_28976 = chunk__27479_28970.cljs$core$IIndexed$_nth$arity$2(null, i__27481_28972);
fragment.appendChild(shadow.dom._to_dom(node_28976));


var G__28977 = seq__27478_28969;
var G__28978 = chunk__27479_28970;
var G__28979 = count__27480_28971;
var G__28980 = (i__27481_28972 + (1));
seq__27478_28969 = G__28977;
chunk__27479_28970 = G__28978;
count__27480_28971 = G__28979;
i__27481_28972 = G__28980;
continue;
} else {
var temp__5823__auto___28981 = cljs.core.seq(seq__27478_28969);
if(temp__5823__auto___28981){
var seq__27478_28982__$1 = temp__5823__auto___28981;
if(cljs.core.chunked_seq_QMARK_(seq__27478_28982__$1)){
var c__5568__auto___28983 = cljs.core.chunk_first(seq__27478_28982__$1);
var G__28984 = cljs.core.chunk_rest(seq__27478_28982__$1);
var G__28985 = c__5568__auto___28983;
var G__28986 = cljs.core.count(c__5568__auto___28983);
var G__28987 = (0);
seq__27478_28969 = G__28984;
chunk__27479_28970 = G__28985;
count__27480_28971 = G__28986;
i__27481_28972 = G__28987;
continue;
} else {
var node_28988 = cljs.core.first(seq__27478_28982__$1);
fragment.appendChild(shadow.dom._to_dom(node_28988));


var G__28989 = cljs.core.next(seq__27478_28982__$1);
var G__28990 = null;
var G__28991 = (0);
var G__28992 = (0);
seq__27478_28969 = G__28989;
chunk__27479_28970 = G__28990;
count__27480_28971 = G__28991;
i__27481_28972 = G__28992;
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
var seq__27502_28994 = cljs.core.seq(scripts);
var chunk__27503_28995 = null;
var count__27504_28996 = (0);
var i__27505_28997 = (0);
while(true){
if((i__27505_28997 < count__27504_28996)){
var vec__27531_28998 = chunk__27503_28995.cljs$core$IIndexed$_nth$arity$2(null, i__27505_28997);
var script_tag_28999 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27531_28998,(0),null);
var script_body_29000 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27531_28998,(1),null);
eval(script_body_29000);


var G__29005 = seq__27502_28994;
var G__29006 = chunk__27503_28995;
var G__29007 = count__27504_28996;
var G__29008 = (i__27505_28997 + (1));
seq__27502_28994 = G__29005;
chunk__27503_28995 = G__29006;
count__27504_28996 = G__29007;
i__27505_28997 = G__29008;
continue;
} else {
var temp__5823__auto___29013 = cljs.core.seq(seq__27502_28994);
if(temp__5823__auto___29013){
var seq__27502_29014__$1 = temp__5823__auto___29013;
if(cljs.core.chunked_seq_QMARK_(seq__27502_29014__$1)){
var c__5568__auto___29015 = cljs.core.chunk_first(seq__27502_29014__$1);
var G__29016 = cljs.core.chunk_rest(seq__27502_29014__$1);
var G__29017 = c__5568__auto___29015;
var G__29018 = cljs.core.count(c__5568__auto___29015);
var G__29019 = (0);
seq__27502_28994 = G__29016;
chunk__27503_28995 = G__29017;
count__27504_28996 = G__29018;
i__27505_28997 = G__29019;
continue;
} else {
var vec__27551_29027 = cljs.core.first(seq__27502_29014__$1);
var script_tag_29028 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27551_29027,(0),null);
var script_body_29029 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27551_29027,(1),null);
eval(script_body_29029);


var G__29030 = cljs.core.next(seq__27502_29014__$1);
var G__29031 = null;
var G__29032 = (0);
var G__29033 = (0);
seq__27502_28994 = G__29030;
chunk__27503_28995 = G__29031;
count__27504_28996 = G__29032;
i__27505_28997 = G__29033;
continue;
}
} else {
}
}
break;
}

return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (s__$1,p__27557){
var vec__27559 = p__27557;
var script_tag = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27559,(0),null);
var script_body = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27559,(1),null);
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
var G__27581 = arguments.length;
switch (G__27581) {
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
var seq__27627 = cljs.core.seq(style_keys);
var chunk__27628 = null;
var count__27629 = (0);
var i__27630 = (0);
while(true){
if((i__27630 < count__27629)){
var it = chunk__27628.cljs$core$IIndexed$_nth$arity$2(null, i__27630);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__29057 = seq__27627;
var G__29058 = chunk__27628;
var G__29059 = count__27629;
var G__29060 = (i__27630 + (1));
seq__27627 = G__29057;
chunk__27628 = G__29058;
count__27629 = G__29059;
i__27630 = G__29060;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27627);
if(temp__5823__auto__){
var seq__27627__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27627__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27627__$1);
var G__29061 = cljs.core.chunk_rest(seq__27627__$1);
var G__29062 = c__5568__auto__;
var G__29063 = cljs.core.count(c__5568__auto__);
var G__29064 = (0);
seq__27627 = G__29061;
chunk__27628 = G__29062;
count__27629 = G__29063;
i__27630 = G__29064;
continue;
} else {
var it = cljs.core.first(seq__27627__$1);
shadow.dom.remove_style_STAR_(el__$1,it);


var G__29065 = cljs.core.next(seq__27627__$1);
var G__29066 = null;
var G__29067 = (0);
var G__29068 = (0);
seq__27627 = G__29065;
chunk__27628 = G__29066;
count__27629 = G__29067;
i__27630 = G__29068;
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
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__27760){
var vec__27761 = p__27760;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27761,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27761,(1),null);
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
var G__27873 = k27668;
var G__27873__$1 = (((G__27873 instanceof cljs.core.Keyword))?G__27873.fqn:null);
switch (G__27873__$1) {
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
var pred__27884 = cljs.core.keyword_identical_QMARK_;
var expr__27885 = k__5352__auto__;
if(cljs.core.truth_((pred__27884.cljs$core$IFn$_invoke$arity$2 ? pred__27884.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"x","x",2099068185),expr__27885) : pred__27884.call(null, new cljs.core.Keyword(null,"x","x",2099068185),expr__27885)))){
return (new shadow.dom.Coordinate(G__27667,self__.y,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__27884.cljs$core$IFn$_invoke$arity$2 ? pred__27884.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"y","y",-1757859776),expr__27885) : pred__27884.call(null, new cljs.core.Keyword(null,"y","y",-1757859776),expr__27885)))){
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
var extmap__5385__auto__ = (function (){var G__27924 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__27679,new cljs.core.Keyword(null,"x","x",2099068185),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"y","y",-1757859776)], 0));
if(cljs.core.record_QMARK_(G__27679)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__27924);
} else {
return G__27924;
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

(shadow.dom.Size.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5345__auto__,k28023,else__5346__auto__){
var self__ = this;
var this__5345__auto____$1 = this;
var G__28062 = k28023;
var G__28062__$1 = (((G__28062 instanceof cljs.core.Keyword))?G__28062.fqn:null);
switch (G__28062__$1) {
case "w":
return self__.w;

break;
case "h":
return self__.h;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k28023,else__5346__auto__);

}
}));

(shadow.dom.Size.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5363__auto__,f__5364__auto__,init__5365__auto__){
var self__ = this;
var this__5363__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5366__auto__,p__28095){
var vec__28096 = p__28095;
var k__5367__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28096,(0),null);
var v__5368__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28096,(1),null);
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

(shadow.dom.Size.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__28022){
var self__ = this;
var G__28022__$1 = this;
return (new cljs.core.RecordIter((0),G__28022__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"w","w",354169001),new cljs.core.Keyword(null,"h","h",1109658740)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
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

(shadow.dom.Size.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this28024,other28025){
var self__ = this;
var this28024__$1 = this;
return (((!((other28025 == null)))) && ((((this28024__$1.constructor === other28025.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28024__$1.w,other28025.w)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28024__$1.h,other28025.h)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28024__$1.__extmap,other28025.__extmap)))))))));
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

(shadow.dom.Size.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5350__auto__,k28023){
var self__ = this;
var this__5350__auto____$1 = this;
var G__28185 = k28023;
var G__28185__$1 = (((G__28185 instanceof cljs.core.Keyword))?G__28185.fqn:null);
switch (G__28185__$1) {
case "w":
case "h":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k28023);

}
}));

(shadow.dom.Size.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5351__auto__,k__5352__auto__,G__28022){
var self__ = this;
var this__5351__auto____$1 = this;
var pred__28193 = cljs.core.keyword_identical_QMARK_;
var expr__28194 = k__5352__auto__;
if(cljs.core.truth_((pred__28193.cljs$core$IFn$_invoke$arity$2 ? pred__28193.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"w","w",354169001),expr__28194) : pred__28193.call(null, new cljs.core.Keyword(null,"w","w",354169001),expr__28194)))){
return (new shadow.dom.Size(G__28022,self__.h,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__28193.cljs$core$IFn$_invoke$arity$2 ? pred__28193.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"h","h",1109658740),expr__28194) : pred__28193.call(null, new cljs.core.Keyword(null,"h","h",1109658740),expr__28194)))){
return (new shadow.dom.Size(self__.w,G__28022,self__.__meta,self__.__extmap,null));
} else {
return (new shadow.dom.Size(self__.w,self__.h,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5352__auto__,G__28022),null));
}
}
}));

(shadow.dom.Size.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5356__auto__){
var self__ = this;
var this__5356__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"w","w",354169001),self__.w,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"h","h",1109658740),self__.h,null))], null),self__.__extmap));
}));

(shadow.dom.Size.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5342__auto__,G__28022){
var self__ = this;
var this__5342__auto____$1 = this;
return (new shadow.dom.Size(self__.w,self__.h,G__28022,self__.__extmap,self__.__hash));
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
shadow.dom.map__GT_Size = (function shadow$dom$map__GT_Size(G__28031){
var extmap__5385__auto__ = (function (){var G__28239 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__28031,new cljs.core.Keyword(null,"w","w",354169001),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"h","h",1109658740)], 0));
if(cljs.core.record_QMARK_(G__28031)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__28239);
} else {
return G__28239;
}
})();
return (new shadow.dom.Size(new cljs.core.Keyword(null,"w","w",354169001).cljs$core$IFn$_invoke$arity$1(G__28031),new cljs.core.Keyword(null,"h","h",1109658740).cljs$core$IFn$_invoke$arity$1(G__28031),null,cljs.core.not_empty(extmap__5385__auto__),null));
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
var G__29248 = (i + (1));
var G__29249 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,(opts[i]["value"]));
i = G__29248;
ret = G__29249;
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
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(path),"?",clojure.string.join.cljs$core$IFn$_invoke$arity$2("&",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__28313){
var vec__28314 = p__28313;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28314,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28314,(1),null);
return [cljs.core.name(k),"=",cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)))].join('');
}),query_params))].join('');
}
});
shadow.dom.redirect = (function shadow$dom$redirect(var_args){
var G__28350 = arguments.length;
switch (G__28350) {
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
var G__29284 = ps;
var G__29285 = (i + (1));
el__$1 = G__29284;
i = G__29285;
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

var seq__28393_29312 = cljs.core.seq(props);
var chunk__28394_29313 = null;
var count__28395_29314 = (0);
var i__28396_29315 = (0);
while(true){
if((i__28396_29315 < count__28395_29314)){
var vec__28406_29316 = chunk__28394_29313.cljs$core$IIndexed$_nth$arity$2(null, i__28396_29315);
var k_29317 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28406_29316,(0),null);
var v_29318 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28406_29316,(1),null);
el.setAttributeNS((function (){var temp__5823__auto__ = cljs.core.namespace(k_29317);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29317),v_29318);


var G__29320 = seq__28393_29312;
var G__29321 = chunk__28394_29313;
var G__29322 = count__28395_29314;
var G__29323 = (i__28396_29315 + (1));
seq__28393_29312 = G__29320;
chunk__28394_29313 = G__29321;
count__28395_29314 = G__29322;
i__28396_29315 = G__29323;
continue;
} else {
var temp__5823__auto___29324 = cljs.core.seq(seq__28393_29312);
if(temp__5823__auto___29324){
var seq__28393_29325__$1 = temp__5823__auto___29324;
if(cljs.core.chunked_seq_QMARK_(seq__28393_29325__$1)){
var c__5568__auto___29326 = cljs.core.chunk_first(seq__28393_29325__$1);
var G__29328 = cljs.core.chunk_rest(seq__28393_29325__$1);
var G__29329 = c__5568__auto___29326;
var G__29330 = cljs.core.count(c__5568__auto___29326);
var G__29331 = (0);
seq__28393_29312 = G__29328;
chunk__28394_29313 = G__29329;
count__28395_29314 = G__29330;
i__28396_29315 = G__29331;
continue;
} else {
var vec__28409_29332 = cljs.core.first(seq__28393_29325__$1);
var k_29333 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28409_29332,(0),null);
var v_29334 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28409_29332,(1),null);
el.setAttributeNS((function (){var temp__5823__auto____$1 = cljs.core.namespace(k_29333);
if(cljs.core.truth_(temp__5823__auto____$1)){
var ns = temp__5823__auto____$1;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(shadow.dom.xmlns),ns);
} else {
return null;
}
})(),cljs.core.name(k_29333),v_29334);


var G__29336 = cljs.core.next(seq__28393_29325__$1);
var G__29337 = null;
var G__29338 = (0);
var G__29339 = (0);
seq__28393_29312 = G__29336;
chunk__28394_29313 = G__29337;
count__28395_29314 = G__29338;
i__28396_29315 = G__29339;
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
var vec__28422 = shadow.dom.destructure_node(shadow.dom.create_svg_node,structure);
var node = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28422,(0),null);
var node_children = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28422,(1),null);
var seq__28425_29345 = cljs.core.seq(node_children);
var chunk__28427_29346 = null;
var count__28428_29347 = (0);
var i__28429_29348 = (0);
while(true){
if((i__28429_29348 < count__28428_29347)){
var child_struct_29349 = chunk__28427_29346.cljs$core$IIndexed$_nth$arity$2(null, i__28429_29348);
if((!((child_struct_29349 == null)))){
if(typeof child_struct_29349 === 'string'){
var text_29350 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29350),child_struct_29349].join(''));
} else {
var children_29351 = shadow.dom.svg_node(child_struct_29349);
if(cljs.core.seq_QMARK_(children_29351)){
var seq__28460_29352 = cljs.core.seq(children_29351);
var chunk__28463_29353 = null;
var count__28464_29354 = (0);
var i__28465_29355 = (0);
while(true){
if((i__28465_29355 < count__28464_29354)){
var child_29356 = chunk__28463_29353.cljs$core$IIndexed$_nth$arity$2(null, i__28465_29355);
if(cljs.core.truth_(child_29356)){
node.appendChild(child_29356);


var G__29357 = seq__28460_29352;
var G__29358 = chunk__28463_29353;
var G__29359 = count__28464_29354;
var G__29360 = (i__28465_29355 + (1));
seq__28460_29352 = G__29357;
chunk__28463_29353 = G__29358;
count__28464_29354 = G__29359;
i__28465_29355 = G__29360;
continue;
} else {
var G__29361 = seq__28460_29352;
var G__29362 = chunk__28463_29353;
var G__29363 = count__28464_29354;
var G__29364 = (i__28465_29355 + (1));
seq__28460_29352 = G__29361;
chunk__28463_29353 = G__29362;
count__28464_29354 = G__29363;
i__28465_29355 = G__29364;
continue;
}
} else {
var temp__5823__auto___29368 = cljs.core.seq(seq__28460_29352);
if(temp__5823__auto___29368){
var seq__28460_29369__$1 = temp__5823__auto___29368;
if(cljs.core.chunked_seq_QMARK_(seq__28460_29369__$1)){
var c__5568__auto___29370 = cljs.core.chunk_first(seq__28460_29369__$1);
var G__29371 = cljs.core.chunk_rest(seq__28460_29369__$1);
var G__29372 = c__5568__auto___29370;
var G__29373 = cljs.core.count(c__5568__auto___29370);
var G__29374 = (0);
seq__28460_29352 = G__29371;
chunk__28463_29353 = G__29372;
count__28464_29354 = G__29373;
i__28465_29355 = G__29374;
continue;
} else {
var child_29376 = cljs.core.first(seq__28460_29369__$1);
if(cljs.core.truth_(child_29376)){
node.appendChild(child_29376);


var G__29377 = cljs.core.next(seq__28460_29369__$1);
var G__29378 = null;
var G__29379 = (0);
var G__29380 = (0);
seq__28460_29352 = G__29377;
chunk__28463_29353 = G__29378;
count__28464_29354 = G__29379;
i__28465_29355 = G__29380;
continue;
} else {
var G__29381 = cljs.core.next(seq__28460_29369__$1);
var G__29382 = null;
var G__29383 = (0);
var G__29384 = (0);
seq__28460_29352 = G__29381;
chunk__28463_29353 = G__29382;
count__28464_29354 = G__29383;
i__28465_29355 = G__29384;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29351);
}
}


var G__29385 = seq__28425_29345;
var G__29386 = chunk__28427_29346;
var G__29387 = count__28428_29347;
var G__29388 = (i__28429_29348 + (1));
seq__28425_29345 = G__29385;
chunk__28427_29346 = G__29386;
count__28428_29347 = G__29387;
i__28429_29348 = G__29388;
continue;
} else {
var G__29389 = seq__28425_29345;
var G__29390 = chunk__28427_29346;
var G__29391 = count__28428_29347;
var G__29392 = (i__28429_29348 + (1));
seq__28425_29345 = G__29389;
chunk__28427_29346 = G__29390;
count__28428_29347 = G__29391;
i__28429_29348 = G__29392;
continue;
}
} else {
var temp__5823__auto___29393 = cljs.core.seq(seq__28425_29345);
if(temp__5823__auto___29393){
var seq__28425_29394__$1 = temp__5823__auto___29393;
if(cljs.core.chunked_seq_QMARK_(seq__28425_29394__$1)){
var c__5568__auto___29395 = cljs.core.chunk_first(seq__28425_29394__$1);
var G__29396 = cljs.core.chunk_rest(seq__28425_29394__$1);
var G__29397 = c__5568__auto___29395;
var G__29398 = cljs.core.count(c__5568__auto___29395);
var G__29399 = (0);
seq__28425_29345 = G__29396;
chunk__28427_29346 = G__29397;
count__28428_29347 = G__29398;
i__28429_29348 = G__29399;
continue;
} else {
var child_struct_29401 = cljs.core.first(seq__28425_29394__$1);
if((!((child_struct_29401 == null)))){
if(typeof child_struct_29401 === 'string'){
var text_29406 = (node["textContent"]);
(node["textContent"] = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(text_29406),child_struct_29401].join(''));
} else {
var children_29407 = shadow.dom.svg_node(child_struct_29401);
if(cljs.core.seq_QMARK_(children_29407)){
var seq__28474_29408 = cljs.core.seq(children_29407);
var chunk__28476_29409 = null;
var count__28477_29410 = (0);
var i__28478_29411 = (0);
while(true){
if((i__28478_29411 < count__28477_29410)){
var child_29416 = chunk__28476_29409.cljs$core$IIndexed$_nth$arity$2(null, i__28478_29411);
if(cljs.core.truth_(child_29416)){
node.appendChild(child_29416);


var G__29417 = seq__28474_29408;
var G__29418 = chunk__28476_29409;
var G__29419 = count__28477_29410;
var G__29420 = (i__28478_29411 + (1));
seq__28474_29408 = G__29417;
chunk__28476_29409 = G__29418;
count__28477_29410 = G__29419;
i__28478_29411 = G__29420;
continue;
} else {
var G__29421 = seq__28474_29408;
var G__29422 = chunk__28476_29409;
var G__29423 = count__28477_29410;
var G__29424 = (i__28478_29411 + (1));
seq__28474_29408 = G__29421;
chunk__28476_29409 = G__29422;
count__28477_29410 = G__29423;
i__28478_29411 = G__29424;
continue;
}
} else {
var temp__5823__auto___29425__$1 = cljs.core.seq(seq__28474_29408);
if(temp__5823__auto___29425__$1){
var seq__28474_29426__$1 = temp__5823__auto___29425__$1;
if(cljs.core.chunked_seq_QMARK_(seq__28474_29426__$1)){
var c__5568__auto___29427 = cljs.core.chunk_first(seq__28474_29426__$1);
var G__29428 = cljs.core.chunk_rest(seq__28474_29426__$1);
var G__29429 = c__5568__auto___29427;
var G__29430 = cljs.core.count(c__5568__auto___29427);
var G__29431 = (0);
seq__28474_29408 = G__29428;
chunk__28476_29409 = G__29429;
count__28477_29410 = G__29430;
i__28478_29411 = G__29431;
continue;
} else {
var child_29438 = cljs.core.first(seq__28474_29426__$1);
if(cljs.core.truth_(child_29438)){
node.appendChild(child_29438);


var G__29439 = cljs.core.next(seq__28474_29426__$1);
var G__29440 = null;
var G__29441 = (0);
var G__29442 = (0);
seq__28474_29408 = G__29439;
chunk__28476_29409 = G__29440;
count__28477_29410 = G__29441;
i__28478_29411 = G__29442;
continue;
} else {
var G__29444 = cljs.core.next(seq__28474_29426__$1);
var G__29445 = null;
var G__29446 = (0);
var G__29447 = (0);
seq__28474_29408 = G__29444;
chunk__28476_29409 = G__29445;
count__28477_29410 = G__29446;
i__28478_29411 = G__29447;
continue;
}
}
} else {
}
}
break;
}
} else {
node.appendChild(children_29407);
}
}


var G__29448 = cljs.core.next(seq__28425_29394__$1);
var G__29449 = null;
var G__29450 = (0);
var G__29451 = (0);
seq__28425_29345 = G__29448;
chunk__28427_29346 = G__29449;
count__28428_29347 = G__29450;
i__28429_29348 = G__29451;
continue;
} else {
var G__29452 = cljs.core.next(seq__28425_29394__$1);
var G__29453 = null;
var G__29454 = (0);
var G__29455 = (0);
seq__28425_29345 = G__29452;
chunk__28427_29346 = G__29453;
count__28428_29347 = G__29454;
i__28429_29348 = G__29455;
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
var len__5769__auto___29461 = arguments.length;
var i__5770__auto___29462 = (0);
while(true){
if((i__5770__auto___29462 < len__5769__auto___29461)){
args__5775__auto__.push((arguments[i__5770__auto___29462]));

var G__29464 = (i__5770__auto___29462 + (1));
i__5770__auto___29462 = G__29464;
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
(shadow.dom.svg.cljs$lang$applyTo = (function (seq28498){
var G__28499 = cljs.core.first(seq28498);
var seq28498__$1 = cljs.core.next(seq28498);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28499,seq28498__$1);
}));


//# sourceMappingURL=shadow.dom.js.map
