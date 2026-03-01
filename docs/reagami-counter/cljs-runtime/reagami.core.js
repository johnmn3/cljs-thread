goog.provide('reagami.core');
reagami.core.svg_ns = "http://www.w3.org/2000/svg";
/**
 * From hiccup, thanks @weavejester
 */
reagami.core.parse_tag = (function reagami$core$parse_tag(tag){
var id_index = (function (){var index = tag.indexOf("#");
if((index > (0))){
return index;
} else {
return null;
}
})();
var class_index = (function (){var index = tag.indexOf(".");
if((index > (0))){
return index;
} else {
return null;
}
})();
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.truth_(id_index)?tag.substring((0),id_index):(cljs.core.truth_(class_index)?tag.substring((0),class_index):tag
)),(cljs.core.truth_(id_index)?(cljs.core.truth_(class_index)?tag.substring((id_index + (1)),class_index):tag.substring((id_index + (1)))):null),(cljs.core.truth_(class_index)?tag.substring((class_index + (1))):null)], null);
});
reagami.core.properties = (new Set(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["checked","disabled","selected","value","innerHTML"], null)));
reagami.core.property_QMARK_ = (function reagami$core$property_QMARK_(x){
return reagami.core.properties.has(x);
});
reagami.core.keyword__GT_str = (function reagami$core$keyword__GT_str(k){
if((k instanceof cljs.core.Keyword)){
return cljs.core.name(k);
} else {
return k;
}
});
reagami.core.hiccup_seq_QMARK_ = (function reagami$core$hiccup_seq_QMARK_(x){
return (((!(typeof x === 'string'))) && (((cljs.core.seq_QMARK_(x)) && ((!(cljs.core.vector_QMARK_(x)))))));
});
reagami.core.move_to_back = (function reagami$core$move_to_back(o,v){
if(cljs.core.truth_(v in o)){
var value = (o[v]);
delete o[v];

return (o[v] = value);
} else {
return null;
}
});
reagami.core.create_vnode_STAR_ = (function reagami$core$create_vnode_STAR_(hiccup,in_svg_QMARK_){
if((((hiccup == null)) || (((typeof hiccup === 'string') || (((typeof hiccup === 'number') || (cljs.core.boolean_QMARK_(hiccup)))))))){
return ({"tag": "#text", "text": cljs.core.str.cljs$core$IFn$_invoke$arity$1(hiccup)});
} else {
if(cljs.core.vector_QMARK_(hiccup)){
var hiccup__$1 = cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(hiccup);
var tag = (hiccup__$1[(0)]);
var children_idx = (1);
var tag__$1 = (((tag instanceof cljs.core.Keyword))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(cljs.core.str.cljs$core$IFn$_invoke$arity$1(tag),(1)):tag);
var vec__27899 = ((typeof tag__$1 === 'string')?reagami.core.parse_tag(tag__$1):new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [tag__$1], null));
var tag__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27899,(0),null);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27899,(1),null);
var class$ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27899,(2),null);
var classes = (cljs.core.truth_(class$)?class$.split("."):null);
var first_child = (hiccup__$1[children_idx]);
var attr_idx = ((cljs.core.map_QMARK_(first_child))?(1):(-1));
var children_idx__$1 = ((((-1) === attr_idx))?children_idx:(children_idx + (1)));
var in_svg_QMARK___$1 = (function (){var or__5045__auto__ = in_svg_QMARK_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("svg",tag__$2);
}
})();
var node = ((cljs.core.fn_QMARK_(tag__$2))?(function (){var res = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(tag__$2,hiccup__$1.slice((1)));
return (reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(res,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, res,in_svg_QMARK___$1));
})():(function (){var new_children = [];
var node = ({"type": new cljs.core.Keyword(null,"element","element",1974019749), "svg": in_svg_QMARK___$1, "tag": (cljs.core.truth_(in_svg_QMARK___$1)?tag__$2:tag__$2.toUpperCase()), "children": new_children});
var modified_props = ({});
var modified_attrs = ({});
(node[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)] = modified_props);

(node[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)] = modified_attrs);

var n__5636__auto___28020 = (hiccup__$1.length - children_idx__$1);
var i_28021 = (0);
while(true){
if((i_28021 < n__5636__auto___28020)){
var child_28022 = (hiccup__$1[(i_28021 + children_idx__$1)]);
if(reagami.core.hiccup_seq_QMARK_(child_28022)){
var seq__27906_28023 = cljs.core.seq(child_28022);
var chunk__27907_28024 = null;
var count__27908_28025 = (0);
var i__27909_28026 = (0);
while(true){
if((i__27909_28026 < count__27908_28025)){
var x_28028 = chunk__27907_28024.cljs$core$IIndexed$_nth$arity$2(null, i__27909_28026);
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(x_28028,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, x_28028,in_svg_QMARK___$1)));


var G__28030 = seq__27906_28023;
var G__28031 = chunk__27907_28024;
var G__28032 = count__27908_28025;
var G__28033 = (i__27909_28026 + (1));
seq__27906_28023 = G__28030;
chunk__27907_28024 = G__28031;
count__27908_28025 = G__28032;
i__27909_28026 = G__28033;
continue;
} else {
var temp__5823__auto___28034 = cljs.core.seq(seq__27906_28023);
if(temp__5823__auto___28034){
var seq__27906_28035__$1 = temp__5823__auto___28034;
if(cljs.core.chunked_seq_QMARK_(seq__27906_28035__$1)){
var c__5568__auto___28036 = cljs.core.chunk_first(seq__27906_28035__$1);
var G__28037 = cljs.core.chunk_rest(seq__27906_28035__$1);
var G__28038 = c__5568__auto___28036;
var G__28039 = cljs.core.count(c__5568__auto___28036);
var G__28040 = (0);
seq__27906_28023 = G__28037;
chunk__27907_28024 = G__28038;
count__27908_28025 = G__28039;
i__27909_28026 = G__28040;
continue;
} else {
var x_28041 = cljs.core.first(seq__27906_28035__$1);
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(x_28041,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, x_28041,in_svg_QMARK___$1)));


var G__28042 = cljs.core.next(seq__27906_28035__$1);
var G__28043 = null;
var G__28044 = (0);
var G__28045 = (0);
seq__27906_28023 = G__28042;
chunk__27907_28024 = G__28043;
count__27908_28025 = G__28044;
i__27909_28026 = G__28045;
continue;
}
} else {
}
}
break;
}
} else {
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(child_28022,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, child_28022,in_svg_QMARK___$1)));
}

var G__28047 = (i_28021 + (1));
i_28021 = G__28047;
continue;
} else {
}
break;
}

if(((-1) === attr_idx)){
} else {
var attrs_28048 = (hiccup__$1[(1)]);
var attrs_28049__$1 = cljs.core.clj__GT_js(attrs_28048);
var entry_names_28050 = Object.getOwnPropertyNames(attrs_28049__$1);
var entry_count_28051 = entry_names_28050.length;
if(cljs.core.truth_((function (){var or__5045__auto__ = "max" in attrs_28049__$1;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "min" in attrs_28049__$1;
}
})())){
reagami.core.move_to_back(attrs_28049__$1,"default-value");

reagami.core.move_to_back(attrs_28049__$1,"value");
} else {
}

var n__5636__auto___28055 = entry_count_28051;
var i_28056 = (0);
while(true){
if((i_28056 < n__5636__auto___28055)){
var k_28057 = (entry_names_28050[i_28056]);
var v_28058 = (attrs_28049__$1[k_28057]);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("on-render",k_28057)){
(node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)] = v_28058);
} else {
if(cljs.core.truth_(k_28057.startsWith("on"))){
var event_28059 = k_28057.replaceAll("-","");
(modified_props[event_28059] = v_28058);
} else {
if(cljs.core.truth_(k_28057.startsWith("default"))){
var default_attr_28060 = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(k_28057,(7)).replaceAll("-","");
(modified_attrs[default_attr_28060] = v_28058);
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("style",k_28057)) && (cljs.core.object_QMARK_(v_28058)))){
var style_28061 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (i_28056,v_28058,k_28057,n__5636__auto___28055,attrs_28048,attrs_28049__$1,entry_names_28050,entry_count_28051,new_children,node,modified_props,modified_attrs,hiccup__$1,tag,children_idx,tag__$1,vec__27899,tag__$2,id,class$,classes,first_child,attr_idx,children_idx__$1,in_svg_QMARK___$1){
return (function (s,e){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(s),cljs.core.str.cljs$core$IFn$_invoke$arity$1((e[(0)])),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((e[(1)])),";"].join('');
});})(i_28056,v_28058,k_28057,n__5636__auto___28055,attrs_28048,attrs_28049__$1,entry_names_28050,entry_count_28051,new_children,node,modified_props,modified_attrs,hiccup__$1,tag,children_idx,tag__$1,vec__27899,tag__$2,id,class$,classes,first_child,attr_idx,children_idx__$1,in_svg_QMARK___$1))
,"",Object.entries(v_28058));
(modified_attrs["style"] = style_28061);
} else {
if(cljs.core.truth_(reagami.core.property_QMARK_(k_28057))){
(modified_props[k_28057] = v_28058);
} else {
if(cljs.core.truth_(v_28058)){
(modified_attrs[k_28057] = v_28058);
} else {
}

}
}

}
}
}

var G__28062 = (i_28056 + (1));
i_28056 = G__28062;
continue;
} else {
}
break;
}
}

if((((!((classes == null)))) && ((classes.length > (0))))){
(modified_attrs["class"] = [(function (){var temp__5823__auto__ = (modified_attrs["class"]);
if(cljs.core.truth_(temp__5823__auto__)){
var c = temp__5823__auto__;
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(c)," "].join('');
} else {
return null;
}
})(),cljs.core.str.cljs$core$IFn$_invoke$arity$1(classes.join(" "))].join(''));
} else {
}

if(cljs.core.truth_(id)){
(modified_attrs["id"] = id);
} else {
}

return node;
})());
return node;
} else {
throw (function (){
console.error("Invalid hiccup:",hiccup);

return (new Error(["Invalid hiccup: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(hiccup)].join('')));
})()
;

}
}
});
reagami.core.create_vnode = (function reagami$core$create_vnode(hiccup){
return reagami.core.create_vnode_STAR_(hiccup,false);
});
reagami.core.ref_registry = (new Map());
reagami.core.update_BANG_ = (function reagami$core$update_BANG_(var_args){
var args__5775__auto__ = [];
var len__5769__auto___28066 = arguments.length;
var i__5770__auto___28067 = (0);
while(true){
if((i__5770__auto___28067 < len__5769__auto___28066)){
args__5775__auto__.push((arguments[i__5770__auto___28067]));

var G__28068 = (i__5770__auto___28067 + (1));
i__5770__auto___28067 = G__28068;
continue;
} else {
}
break;
}

var argseq__5776__auto__ = ((((3) < args__5775__auto__.length))?(new cljs.core.IndexedSeq(args__5775__auto__.slice((3)),(0),null)):null);
return reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__5776__auto__);
});

(reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (js_map,k,f,args){
return js_map.set(k,cljs.core.apply.cljs$core$IFn$_invoke$arity$3(f,js_map.get(k),args));
}));

(reagami.core.update_BANG_.cljs$lang$maxFixedArity = (3));

/** @this {Function} */
(reagami.core.update_BANG_.cljs$lang$applyTo = (function (seq27929){
var G__27930 = cljs.core.first(seq27929);
var seq27929__$1 = cljs.core.next(seq27929);
var G__27931 = cljs.core.first(seq27929__$1);
var seq27929__$2 = cljs.core.next(seq27929__$1);
var G__27932 = cljs.core.first(seq27929__$2);
var seq27929__$3 = cljs.core.next(seq27929__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27930,G__27931,G__27932,seq27929__$3);
}));

reagami.core.create_node = (function reagami$core$create_node(vnode,root){
var node = (function (){var temp__5821__auto__ = (vnode["text"]);
if(cljs.core.truth_(temp__5821__auto__)){
var text = temp__5821__auto__;
return document.createTextNode(text);
} else {
var tag = (vnode["tag"]);
var node = (cljs.core.truth_((vnode["svg"]))?document.createElementNS(reagami.core.svg_ns,tag):document.createElement(tag));
var props = (vnode[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)]);
var attrs = (vnode[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)]);
var attr_names = Object.getOwnPropertyNames(attrs);
var prop_names = Object.getOwnPropertyNames(props);
var n__5636__auto___28073 = attr_names.length;
var i_28074 = (0);
while(true){
if((i_28074 < n__5636__auto___28073)){
var n_28075 = (attr_names[i_28074]);
var new_attr_28076 = (attrs[n_28075]);
node.setAttribute(n_28075,new_attr_28076);

var G__28077 = (i_28074 + (1));
i_28074 = G__28077;
continue;
} else {
}
break;
}

var n__5636__auto___28078 = prop_names.length;
var i_28079 = (0);
while(true){
if((i_28079 < n__5636__auto___28078)){
var n_28080 = (prop_names[i_28079]);
var new_prop_28081 = (props[n_28080]);
var new_prop_28082__$1 = (((void 0 === new_prop_28081))?null:new_prop_28081);
(node[n_28080] = new_prop_28082__$1);

var G__28084 = (i_28079 + (1));
i_28079 = G__28084;
continue;
} else {
}
break;
}

var temp__5823__auto___28085 = (vnode["children"]);
if(cljs.core.truth_(temp__5823__auto___28085)){
var children_28089 = temp__5823__auto___28085;
var len_28090 = children_28089.length;
var n__5636__auto___28091 = len_28090;
var i_28092 = (0);
while(true){
if((i_28092 < n__5636__auto___28091)){
var child_28093 = (children_28089[i_28092]);
node.appendChild((reagami.core.create_node.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_node.cljs$core$IFn$_invoke$arity$2(child_28093,root) : reagami.core.create_node.call(null, child_28093,root)));

var G__28094 = (i_28092 + (1));
i_28092 = G__28094;
continue;
} else {
}
break;
}
} else {
}

var temp__5823__auto___28095 = (vnode[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(temp__5823__auto___28095)){
var ref_28096 = temp__5823__auto___28095;
(node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)] = ref_28096);

reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagami.core.ref_registry,root,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([node], 0));
} else {
}

return node;
}
})();
(node[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)] = vnode);

return node;
});
reagami.core.patch = (function reagami$core$patch(parent,new_children,root){
var parent_vnode = (parent[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)]);
var old_children_count = (cljs.core.truth_((function (){var and__5043__auto__ = parent_vnode;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not((parent[new cljs.core.Keyword("reagami.core","root","reagami.core/root",-428709380)]));
} else {
return and__5043__auto__;
}
})())?(parent_vnode["children"]).length:(((root === parent))?parent.childNodes.length:(-1)
));
if(((-1) === old_children_count)){
return null;
} else {
var old_children = parent.childNodes;
var new_children_count = cljs.core.count(new_children);
if((!((old_children_count === new_children_count)))){
return parent.replaceChildren.apply(parent,new_children.map((function (p1__27945_SHARP_){
return reagami.core.create_node(p1__27945_SHARP_,root);
})));
} else {
var n__5636__auto__ = new_children_count;
var i = (0);
while(true){
if((i < n__5636__auto__)){
var old_28097 = (old_children[i]);
var old_vnode_28098 = (old_28097[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)]);
var new_vnode_28099 = (new_children[i]);
var txt_old_28100 = (old_vnode_28098["text"]);
var txt_28101 = (new_vnode_28099["text"]);
var new_tag_28102 = (new_vnode_28099["tag"]);
if(cljs.core.truth_((function (){var and__5043__auto__ = txt_old_28100;
if(cljs.core.truth_(and__5043__auto__)){
return txt_28101;
} else {
return and__5043__auto__;
}
})())){
if((txt_28101 === txt_old_28100)){
} else {
(old_28097.textContent = txt_28101);

(old_28097[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)] = new_vnode_28099);
}
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = old_28097;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = old_vnode_28098;
if(cljs.core.truth_(and__5043__auto____$1)){
var and__5043__auto____$2 = new_vnode_28099;
if(cljs.core.truth_(and__5043__auto____$2)){
return (new_tag_28102 === (old_vnode_28098["tag"]));
} else {
return and__5043__auto____$2;
}
} else {
return and__5043__auto____$1;
}
} else {
return and__5043__auto__;
}
})())){
var old_props_28103 = (old_vnode_28098[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)]);
var old_attrs_28104 = (old_vnode_28098[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)]);
var new_props_28105 = (new_vnode_28099[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)]);
var new_attrs_28106 = (new_vnode_28099[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)]);
var old_prop_names_28107 = Object.getOwnPropertyNames(old_props_28103);
var old_attr_names_28108 = Object.getOwnPropertyNames(old_attrs_28104);
var new_attr_names_28109 = Object.getOwnPropertyNames(new_attrs_28106);
var new_prop_names_28110 = Object.getOwnPropertyNames(new_props_28105);
var n__5636__auto___28111__$1 = cljs.core.count(old_prop_names_28107);
var i_28113__$1 = (0);
while(true){
if((i_28113__$1 < n__5636__auto___28111__$1)){
var o_28114 = (old_prop_names_28107[i_28113__$1]);
if(cljs.core.truth_(o_28114 in new_props_28105)){
} else {
(old_28097[o_28114] = null);
}

var G__28118 = (i_28113__$1 + (1));
i_28113__$1 = G__28118;
continue;
} else {
}
break;
}

var n__5636__auto___28119__$1 = cljs.core.count(old_attr_names_28108);
var i_28120__$1 = (0);
while(true){
if((i_28120__$1 < n__5636__auto___28119__$1)){
var o_28121 = (old_attr_names_28108[i_28120__$1]);
if(cljs.core.truth_(o_28121 in new_attrs_28106)){
} else {
old_28097.removeAttribute(o_28121);
}

var G__28122 = (i_28120__$1 + (1));
i_28120__$1 = G__28122;
continue;
} else {
}
break;
}

var n__5636__auto___28123__$1 = cljs.core.count(new_attr_names_28109);
var i_28124__$1 = (0);
while(true){
if((i_28124__$1 < n__5636__auto___28123__$1)){
var n_28125 = (new_attr_names_28109[i_28124__$1]);
var new_attr_28126 = (new_attrs_28106[n_28125]);
if((new_attr_28126 === (old_attrs_28104[n_28125]))){
} else {
old_28097.setAttribute(n_28125,new_attr_28126);
}

var G__28127 = (i_28124__$1 + (1));
i_28124__$1 = G__28127;
continue;
} else {
}
break;
}

var n__5636__auto___28128__$1 = cljs.core.count(new_prop_names_28110);
var i_28129__$1 = (0);
while(true){
if((i_28129__$1 < n__5636__auto___28128__$1)){
var n_28130 = (new_prop_names_28110[i_28129__$1]);
var new_prop_28131 = (function (){var v = (new_props_28105[n_28130]);
if((void 0 === v)){
return null;
} else {
return v;
}
})();
if(((old_props_28103[n_28130]) === new_prop_28131)){
} else {
(old_28097[n_28130] = new_prop_28131);
}

var G__28132 = (i_28129__$1 + (1));
i_28129__$1 = G__28132;
continue;
} else {
}
break;
}

var temp__5823__auto___28133 = (new_vnode_28099["children"]);
if(cljs.core.truth_(temp__5823__auto___28133)){
var new_children_28134__$1 = temp__5823__auto___28133;
(reagami.core.patch.cljs$core$IFn$_invoke$arity$3 ? reagami.core.patch.cljs$core$IFn$_invoke$arity$3(old_28097,new_children_28134__$1,root) : reagami.core.patch.call(null, old_28097,new_children_28134__$1,root));
} else {
}

(old_28097[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)] = new_vnode_28099);
} else {
var new_node_28137 = reagami.core.create_node(new_vnode_28099,root);
parent.replaceChild(new_node_28137,old_28097);

}
}

var G__28138 = (i + (1));
i = G__28138;
continue;
} else {
return null;
}
break;
}
}
}
});
reagami.core.render = (function reagami$core$render(root,hiccup){
if(cljs.core.truth_((root[new cljs.core.Keyword("reagami.core","root","reagami.core/root",-428709380)]))){
} else {
(root.textContent = "");

(root[new cljs.core.Keyword("reagami.core","root","reagami.core/root",-428709380)] = true);
}

var new_node_28139 = reagami.core.create_vnode(hiccup);
reagami.core.patch(root,[new_node_28139],root);

var seq__27961 = cljs.core.seq(reagami.core.ref_registry.get(root));
var chunk__27962 = null;
var count__27963 = (0);
var i__27964 = (0);
while(true){
if((i__27964 < count__27963)){
var node = chunk__27962.cljs$core$IIndexed$_nth$arity$2(null, i__27964);
var ref_28141 = (node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(node.isConnected)){
if(cljs.core.not((ref_28141[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)]))){
var data_28142 = (ref_28141.cljs$core$IFn$_invoke$arity$3 ? ref_28141.cljs$core$IFn$_invoke$arity$3(node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null) : ref_28141.call(null, node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null));
(ref_28141[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)] = true);

(ref_28141[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28142);
} else {
var data_28144 = (function (){var G__27993 = node;
var G__27994 = new cljs.core.Keyword(null,"update","update",1045576396);
var G__27995 = (ref_28141[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
return (ref_28141.cljs$core$IFn$_invoke$arity$3 ? ref_28141.cljs$core$IFn$_invoke$arity$3(G__27993,G__27994,G__27995) : ref_28141.call(null, G__27993,G__27994,G__27995));
})();
(ref_28141[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28144);
}
} else {
var G__27996_28145 = node;
var G__27997_28146 = new cljs.core.Keyword(null,"unmount","unmount",-1779083333);
var G__27998_28147 = (ref_28141[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
(ref_28141.cljs$core$IFn$_invoke$arity$3 ? ref_28141.cljs$core$IFn$_invoke$arity$3(G__27996_28145,G__27997_28146,G__27998_28147) : ref_28141.call(null, G__27996_28145,G__27997_28146,G__27998_28147));

delete ref_28141[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)];

reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagami.core.ref_registry,root,cljs.core.disj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([node], 0));
}


var G__28149 = seq__27961;
var G__28150 = chunk__27962;
var G__28151 = count__27963;
var G__28152 = (i__27964 + (1));
seq__27961 = G__28149;
chunk__27962 = G__28150;
count__27963 = G__28151;
i__27964 = G__28152;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27961);
if(temp__5823__auto__){
var seq__27961__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27961__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27961__$1);
var G__28153 = cljs.core.chunk_rest(seq__27961__$1);
var G__28154 = c__5568__auto__;
var G__28155 = cljs.core.count(c__5568__auto__);
var G__28156 = (0);
seq__27961 = G__28153;
chunk__27962 = G__28154;
count__27963 = G__28155;
i__27964 = G__28156;
continue;
} else {
var node = cljs.core.first(seq__27961__$1);
var ref_28157 = (node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(node.isConnected)){
if(cljs.core.not((ref_28157[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)]))){
var data_28158 = (ref_28157.cljs$core$IFn$_invoke$arity$3 ? ref_28157.cljs$core$IFn$_invoke$arity$3(node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null) : ref_28157.call(null, node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null));
(ref_28157[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)] = true);

(ref_28157[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28158);
} else {
var data_28159 = (function (){var G__28000 = node;
var G__28001 = new cljs.core.Keyword(null,"update","update",1045576396);
var G__28002 = (ref_28157[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
return (ref_28157.cljs$core$IFn$_invoke$arity$3 ? ref_28157.cljs$core$IFn$_invoke$arity$3(G__28000,G__28001,G__28002) : ref_28157.call(null, G__28000,G__28001,G__28002));
})();
(ref_28157[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28159);
}
} else {
var G__28006_28160 = node;
var G__28007_28161 = new cljs.core.Keyword(null,"unmount","unmount",-1779083333);
var G__28008_28162 = (ref_28157[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
(ref_28157.cljs$core$IFn$_invoke$arity$3 ? ref_28157.cljs$core$IFn$_invoke$arity$3(G__28006_28160,G__28007_28161,G__28008_28162) : ref_28157.call(null, G__28006_28160,G__28007_28161,G__28008_28162));

delete ref_28157[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)];

reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagami.core.ref_registry,root,cljs.core.disj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([node], 0));
}


var G__28163 = cljs.core.next(seq__27961__$1);
var G__28164 = null;
var G__28165 = (0);
var G__28166 = (0);
seq__27961 = G__28163;
chunk__27962 = G__28164;
count__27963 = G__28165;
i__27964 = G__28166;
continue;
}
} else {
return null;
}
}
break;
}
});

//# sourceMappingURL=reagami.core.js.map
