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
var vec__27764 = ((typeof tag__$1 === 'string')?reagami.core.parse_tag(tag__$1):new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [tag__$1], null));
var tag__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27764,(0),null);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27764,(1),null);
var class$ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27764,(2),null);
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

var n__5636__auto___27882 = (hiccup__$1.length - children_idx__$1);
var i_27883 = (0);
while(true){
if((i_27883 < n__5636__auto___27882)){
var child_27884 = (hiccup__$1[(i_27883 + children_idx__$1)]);
if(reagami.core.hiccup_seq_QMARK_(child_27884)){
var seq__27777_27885 = cljs.core.seq(child_27884);
var chunk__27778_27886 = null;
var count__27779_27887 = (0);
var i__27780_27888 = (0);
while(true){
if((i__27780_27888 < count__27779_27887)){
var x_27889 = chunk__27778_27886.cljs$core$IIndexed$_nth$arity$2(null, i__27780_27888);
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(x_27889,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, x_27889,in_svg_QMARK___$1)));


var G__27890 = seq__27777_27885;
var G__27891 = chunk__27778_27886;
var G__27892 = count__27779_27887;
var G__27893 = (i__27780_27888 + (1));
seq__27777_27885 = G__27890;
chunk__27778_27886 = G__27891;
count__27779_27887 = G__27892;
i__27780_27888 = G__27893;
continue;
} else {
var temp__5823__auto___27894 = cljs.core.seq(seq__27777_27885);
if(temp__5823__auto___27894){
var seq__27777_27895__$1 = temp__5823__auto___27894;
if(cljs.core.chunked_seq_QMARK_(seq__27777_27895__$1)){
var c__5568__auto___27896 = cljs.core.chunk_first(seq__27777_27895__$1);
var G__27897 = cljs.core.chunk_rest(seq__27777_27895__$1);
var G__27898 = c__5568__auto___27896;
var G__27899 = cljs.core.count(c__5568__auto___27896);
var G__27900 = (0);
seq__27777_27885 = G__27897;
chunk__27778_27886 = G__27898;
count__27779_27887 = G__27899;
i__27780_27888 = G__27900;
continue;
} else {
var x_27901 = cljs.core.first(seq__27777_27895__$1);
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(x_27901,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, x_27901,in_svg_QMARK___$1)));


var G__27902 = cljs.core.next(seq__27777_27895__$1);
var G__27903 = null;
var G__27904 = (0);
var G__27905 = (0);
seq__27777_27885 = G__27902;
chunk__27778_27886 = G__27903;
count__27779_27887 = G__27904;
i__27780_27888 = G__27905;
continue;
}
} else {
}
}
break;
}
} else {
new_children.push((reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_vnode_STAR_.cljs$core$IFn$_invoke$arity$2(child_27884,in_svg_QMARK___$1) : reagami.core.create_vnode_STAR_.call(null, child_27884,in_svg_QMARK___$1)));
}

var G__27906 = (i_27883 + (1));
i_27883 = G__27906;
continue;
} else {
}
break;
}

if(((-1) === attr_idx)){
} else {
var attrs_27907 = (hiccup__$1[(1)]);
var attrs_27908__$1 = cljs.core.clj__GT_js(attrs_27907);
var entry_names_27909 = Object.getOwnPropertyNames(attrs_27908__$1);
var entry_count_27910 = entry_names_27909.length;
if(cljs.core.truth_((function (){var or__5045__auto__ = "max" in attrs_27908__$1;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "min" in attrs_27908__$1;
}
})())){
reagami.core.move_to_back(attrs_27908__$1,"default-value");

reagami.core.move_to_back(attrs_27908__$1,"value");
} else {
}

var n__5636__auto___27911 = entry_count_27910;
var i_27912 = (0);
while(true){
if((i_27912 < n__5636__auto___27911)){
var k_27914 = (entry_names_27909[i_27912]);
var v_27915 = (attrs_27908__$1[k_27914]);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("on-render",k_27914)){
(node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)] = v_27915);
} else {
if(cljs.core.truth_(k_27914.startsWith("on"))){
var event_27919 = k_27914.replaceAll("-","");
(modified_props[event_27919] = v_27915);
} else {
if(cljs.core.truth_(k_27914.startsWith("default"))){
var default_attr_27920 = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(k_27914,(7)).replaceAll("-","");
(modified_attrs[default_attr_27920] = v_27915);
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("style",k_27914)) && (cljs.core.object_QMARK_(v_27915)))){
var style_27921 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (i_27912,v_27915,k_27914,n__5636__auto___27911,attrs_27907,attrs_27908__$1,entry_names_27909,entry_count_27910,new_children,node,modified_props,modified_attrs,hiccup__$1,tag,children_idx,tag__$1,vec__27764,tag__$2,id,class$,classes,first_child,attr_idx,children_idx__$1,in_svg_QMARK___$1){
return (function (s,e){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(s),cljs.core.str.cljs$core$IFn$_invoke$arity$1((e[(0)])),": ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((e[(1)])),";"].join('');
});})(i_27912,v_27915,k_27914,n__5636__auto___27911,attrs_27907,attrs_27908__$1,entry_names_27909,entry_count_27910,new_children,node,modified_props,modified_attrs,hiccup__$1,tag,children_idx,tag__$1,vec__27764,tag__$2,id,class$,classes,first_child,attr_idx,children_idx__$1,in_svg_QMARK___$1))
,"",Object.entries(v_27915));
(modified_attrs["style"] = style_27921);
} else {
if(cljs.core.truth_(reagami.core.property_QMARK_(k_27914))){
(modified_props[k_27914] = v_27915);
} else {
if(cljs.core.truth_(v_27915)){
(modified_attrs[k_27914] = v_27915);
} else {
}

}
}

}
}
}

var G__27922 = (i_27912 + (1));
i_27912 = G__27922;
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
var len__5769__auto___27923 = arguments.length;
var i__5770__auto___27924 = (0);
while(true){
if((i__5770__auto___27924 < len__5769__auto___27923)){
args__5775__auto__.push((arguments[i__5770__auto___27924]));

var G__27925 = (i__5770__auto___27924 + (1));
i__5770__auto___27924 = G__27925;
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
(reagami.core.update_BANG_.cljs$lang$applyTo = (function (seq27800){
var G__27801 = cljs.core.first(seq27800);
var seq27800__$1 = cljs.core.next(seq27800);
var G__27802 = cljs.core.first(seq27800__$1);
var seq27800__$2 = cljs.core.next(seq27800__$1);
var G__27803 = cljs.core.first(seq27800__$2);
var seq27800__$3 = cljs.core.next(seq27800__$2);
var self__5754__auto__ = this;
return self__5754__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27801,G__27802,G__27803,seq27800__$3);
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
var n__5636__auto___27926 = attr_names.length;
var i_27927 = (0);
while(true){
if((i_27927 < n__5636__auto___27926)){
var n_27928 = (attr_names[i_27927]);
var new_attr_27929 = (attrs[n_27928]);
node.setAttribute(n_27928,new_attr_27929);

var G__27930 = (i_27927 + (1));
i_27927 = G__27930;
continue;
} else {
}
break;
}

var n__5636__auto___27931 = prop_names.length;
var i_27932 = (0);
while(true){
if((i_27932 < n__5636__auto___27931)){
var n_27933 = (prop_names[i_27932]);
var new_prop_27934 = (props[n_27933]);
var new_prop_27935__$1 = (((void 0 === new_prop_27934))?null:new_prop_27934);
(node[n_27933] = new_prop_27935__$1);

var G__27936 = (i_27932 + (1));
i_27932 = G__27936;
continue;
} else {
}
break;
}

var temp__5823__auto___27937 = (vnode["children"]);
if(cljs.core.truth_(temp__5823__auto___27937)){
var children_27939 = temp__5823__auto___27937;
var len_27941 = children_27939.length;
var n__5636__auto___27942 = len_27941;
var i_27943 = (0);
while(true){
if((i_27943 < n__5636__auto___27942)){
var child_27944 = (children_27939[i_27943]);
node.appendChild((reagami.core.create_node.cljs$core$IFn$_invoke$arity$2 ? reagami.core.create_node.cljs$core$IFn$_invoke$arity$2(child_27944,root) : reagami.core.create_node.call(null, child_27944,root)));

var G__27945 = (i_27943 + (1));
i_27943 = G__27945;
continue;
} else {
}
break;
}
} else {
}

var temp__5823__auto___27946 = (vnode[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(temp__5823__auto___27946)){
var ref_27947 = temp__5823__auto___27946;
(node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)] = ref_27947);

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
return parent.replaceChildren.apply(parent,new_children.map((function (p1__27809_SHARP_){
return reagami.core.create_node(p1__27809_SHARP_,root);
})));
} else {
var n__5636__auto__ = new_children_count;
var i = (0);
while(true){
if((i < n__5636__auto__)){
var old_27952 = (old_children[i]);
var old_vnode_27953 = (old_27952[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)]);
var new_vnode_27954 = (new_children[i]);
var txt_old_27955 = (old_vnode_27953["text"]);
var txt_27956 = (new_vnode_27954["text"]);
var new_tag_27957 = (new_vnode_27954["tag"]);
if(cljs.core.truth_((function (){var and__5043__auto__ = txt_old_27955;
if(cljs.core.truth_(and__5043__auto__)){
return txt_27956;
} else {
return and__5043__auto__;
}
})())){
if((txt_27956 === txt_old_27955)){
} else {
(old_27952.textContent = txt_27956);

(old_27952[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)] = new_vnode_27954);
}
} else {
if(cljs.core.truth_((function (){var and__5043__auto__ = old_27952;
if(cljs.core.truth_(and__5043__auto__)){
var and__5043__auto____$1 = old_vnode_27953;
if(cljs.core.truth_(and__5043__auto____$1)){
var and__5043__auto____$2 = new_vnode_27954;
if(cljs.core.truth_(and__5043__auto____$2)){
return (new_tag_27957 === (old_vnode_27953["tag"]));
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
var old_props_27959 = (old_vnode_27953[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)]);
var old_attrs_27960 = (old_vnode_27953[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)]);
var new_props_27961 = (new_vnode_27954[new cljs.core.Keyword("reagami.core","props","reagami.core/props",437596808)]);
var new_attrs_27962 = (new_vnode_27954[new cljs.core.Keyword("reagami.core","attrs","reagami.core/attrs",2131917584)]);
var old_prop_names_27963 = Object.getOwnPropertyNames(old_props_27959);
var old_attr_names_27964 = Object.getOwnPropertyNames(old_attrs_27960);
var new_attr_names_27965 = Object.getOwnPropertyNames(new_attrs_27962);
var new_prop_names_27966 = Object.getOwnPropertyNames(new_props_27961);
var n__5636__auto___27967__$1 = cljs.core.count(old_prop_names_27963);
var i_27968__$1 = (0);
while(true){
if((i_27968__$1 < n__5636__auto___27967__$1)){
var o_27969 = (old_prop_names_27963[i_27968__$1]);
if(cljs.core.truth_(o_27969 in new_props_27961)){
} else {
(old_27952[o_27969] = null);
}

var G__27970 = (i_27968__$1 + (1));
i_27968__$1 = G__27970;
continue;
} else {
}
break;
}

var n__5636__auto___27971__$1 = cljs.core.count(old_attr_names_27964);
var i_27972__$1 = (0);
while(true){
if((i_27972__$1 < n__5636__auto___27971__$1)){
var o_27973 = (old_attr_names_27964[i_27972__$1]);
if(cljs.core.truth_(o_27973 in new_attrs_27962)){
} else {
old_27952.removeAttribute(o_27973);
}

var G__27974 = (i_27972__$1 + (1));
i_27972__$1 = G__27974;
continue;
} else {
}
break;
}

var n__5636__auto___27975__$1 = cljs.core.count(new_attr_names_27965);
var i_27976__$1 = (0);
while(true){
if((i_27976__$1 < n__5636__auto___27975__$1)){
var n_27977 = (new_attr_names_27965[i_27976__$1]);
var new_attr_27978 = (new_attrs_27962[n_27977]);
if((new_attr_27978 === (old_attrs_27960[n_27977]))){
} else {
old_27952.setAttribute(n_27977,new_attr_27978);
}

var G__27979 = (i_27976__$1 + (1));
i_27976__$1 = G__27979;
continue;
} else {
}
break;
}

var n__5636__auto___27981__$1 = cljs.core.count(new_prop_names_27966);
var i_27984__$1 = (0);
while(true){
if((i_27984__$1 < n__5636__auto___27981__$1)){
var n_27988 = (new_prop_names_27966[i_27984__$1]);
var new_prop_27989 = (function (){var v = (new_props_27961[n_27988]);
if((void 0 === v)){
return null;
} else {
return v;
}
})();
if(((old_props_27959[n_27988]) === new_prop_27989)){
} else {
(old_27952[n_27988] = new_prop_27989);
}

var G__27990 = (i_27984__$1 + (1));
i_27984__$1 = G__27990;
continue;
} else {
}
break;
}

var temp__5823__auto___27991 = (new_vnode_27954["children"]);
if(cljs.core.truth_(temp__5823__auto___27991)){
var new_children_27992__$1 = temp__5823__auto___27991;
(reagami.core.patch.cljs$core$IFn$_invoke$arity$3 ? reagami.core.patch.cljs$core$IFn$_invoke$arity$3(old_27952,new_children_27992__$1,root) : reagami.core.patch.call(null, old_27952,new_children_27992__$1,root));
} else {
}

(old_27952[new cljs.core.Keyword("reagami.core","vnode","reagami.core/vnode",-20771552)] = new_vnode_27954);
} else {
var new_node_27993 = reagami.core.create_node(new_vnode_27954,root);
parent.replaceChild(new_node_27993,old_27952);

}
}

var G__27994 = (i + (1));
i = G__27994;
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

var new_node_27995 = reagami.core.create_vnode(hiccup);
reagami.core.patch(root,[new_node_27995],root);

var seq__27832 = cljs.core.seq(reagami.core.ref_registry.get(root));
var chunk__27833 = null;
var count__27834 = (0);
var i__27835 = (0);
while(true){
if((i__27835 < count__27834)){
var node = chunk__27833.cljs$core$IIndexed$_nth$arity$2(null, i__27835);
var ref_27996 = (node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(node.isConnected)){
if(cljs.core.not((ref_27996[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)]))){
var data_27997 = (ref_27996.cljs$core$IFn$_invoke$arity$3 ? ref_27996.cljs$core$IFn$_invoke$arity$3(node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null) : ref_27996.call(null, node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null));
(ref_27996[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)] = true);

(ref_27996[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_27997);
} else {
var data_28002 = (function (){var G__27858 = node;
var G__27859 = new cljs.core.Keyword(null,"update","update",1045576396);
var G__27860 = (ref_27996[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
return (ref_27996.cljs$core$IFn$_invoke$arity$3 ? ref_27996.cljs$core$IFn$_invoke$arity$3(G__27858,G__27859,G__27860) : ref_27996.call(null, G__27858,G__27859,G__27860));
})();
(ref_27996[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28002);
}
} else {
var G__27861_28003 = node;
var G__27862_28004 = new cljs.core.Keyword(null,"unmount","unmount",-1779083333);
var G__27863_28005 = (ref_27996[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
(ref_27996.cljs$core$IFn$_invoke$arity$3 ? ref_27996.cljs$core$IFn$_invoke$arity$3(G__27861_28003,G__27862_28004,G__27863_28005) : ref_27996.call(null, G__27861_28003,G__27862_28004,G__27863_28005));

delete ref_27996[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)];

reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagami.core.ref_registry,root,cljs.core.disj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([node], 0));
}


var G__28006 = seq__27832;
var G__28007 = chunk__27833;
var G__28008 = count__27834;
var G__28009 = (i__27835 + (1));
seq__27832 = G__28006;
chunk__27833 = G__28007;
count__27834 = G__28008;
i__27835 = G__28009;
continue;
} else {
var temp__5823__auto__ = cljs.core.seq(seq__27832);
if(temp__5823__auto__){
var seq__27832__$1 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27832__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__27832__$1);
var G__28010 = cljs.core.chunk_rest(seq__27832__$1);
var G__28011 = c__5568__auto__;
var G__28012 = cljs.core.count(c__5568__auto__);
var G__28013 = (0);
seq__27832 = G__28010;
chunk__27833 = G__28011;
count__27834 = G__28012;
i__27835 = G__28013;
continue;
} else {
var node = cljs.core.first(seq__27832__$1);
var ref_28014 = (node[new cljs.core.Keyword("reagami.core","on-render","reagami.core/on-render",2049515354)]);
if(cljs.core.truth_(node.isConnected)){
if(cljs.core.not((ref_28014[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)]))){
var data_28015 = (ref_28014.cljs$core$IFn$_invoke$arity$3 ? ref_28014.cljs$core$IFn$_invoke$arity$3(node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null) : ref_28014.call(null, node,new cljs.core.Keyword(null,"mount","mount",-1560582470),null));
(ref_28014[new cljs.core.Keyword("reagami.core","is-run","reagami.core/is-run",187987342)] = true);

(ref_28014[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28015);
} else {
var data_28016 = (function (){var G__27868 = node;
var G__27869 = new cljs.core.Keyword(null,"update","update",1045576396);
var G__27870 = (ref_28014[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
return (ref_28014.cljs$core$IFn$_invoke$arity$3 ? ref_28014.cljs$core$IFn$_invoke$arity$3(G__27868,G__27869,G__27870) : ref_28014.call(null, G__27868,G__27869,G__27870));
})();
(ref_28014[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)] = data_28016);
}
} else {
var G__27871_28017 = node;
var G__27872_28018 = new cljs.core.Keyword(null,"unmount","unmount",-1779083333);
var G__27873_28019 = (ref_28014[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)]);
(ref_28014.cljs$core$IFn$_invoke$arity$3 ? ref_28014.cljs$core$IFn$_invoke$arity$3(G__27871_28017,G__27872_28018,G__27873_28019) : ref_28014.call(null, G__27871_28017,G__27872_28018,G__27873_28019));

delete ref_28014[new cljs.core.Keyword("reagami.core","data","reagami.core/data",-95285896)];

reagami.core.update_BANG_.cljs$core$IFn$_invoke$arity$variadic(reagami.core.ref_registry,root,cljs.core.disj,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([node], 0));
}


var G__28021 = cljs.core.next(seq__27832__$1);
var G__28022 = null;
var G__28023 = (0);
var G__28024 = (0);
seq__27832 = G__28021;
chunk__27833 = G__28022;
count__27834 = G__28023;
i__27835 = G__28024;
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
