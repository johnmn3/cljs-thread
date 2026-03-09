goog.provide('raytracer.main');
if((typeof raytracer !== 'undefined') && (typeof raytracer.main !== 'undefined') && (typeof raytracer.main.app_state !== 'undefined')){
} else {
raytracer.main.app_state = (function (){var G__21113 = new cljs.core.Keyword("raytracer.main","app-state","raytracer.main/app-state",131163426);
var G__21114 = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false,new cljs.core.Keyword(null,"img-w","img-w",1224292341),(800),new cljs.core.Keyword(null,"img-h","img-h",-261749895),(450),new cljs.core.Keyword(null,"spp","spp",-1851200517),(10),new cljs.core.Keyword(null,"tile-w","tile-w",2051289999),(64),new cljs.core.Keyword(null,"tile-h","tile-h",356807408),(64),new cljs.core.Keyword(null,"workers","workers",-2054878819),(4),new cljs.core.Keyword(null,"tile-atoms","tile-atoms",-2038369282),null], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__21113,G__21114) : cljs_thread.eve.atom.call(null, G__21113,G__21114));
})();
}
raytracer.main.$ = (function raytracer$main$$(id){
return document.getElementById(id);
});
raytracer.main.set_text_BANG_ = (function raytracer$main$set_text_BANG_(id,text){
var temp__5823__auto__ = raytracer.main.$(id);
if(cljs.core.truth_(temp__5823__auto__)){
var el = temp__5823__auto__;
return (el.textContent = text);
} else {
return null;
}
});
raytracer.main.set_disabled_BANG_ = (function raytracer$main$set_disabled_BANG_(id,disabled_QMARK_){
var temp__5823__auto__ = raytracer.main.$(id);
if(cljs.core.truth_(temp__5823__auto__)){
var el = temp__5823__auto__;
return (el.disabled = disabled_QMARK_);
} else {
return null;
}
});
raytracer.main.get_val = (function raytracer$main$get_val(id){
var temp__5823__auto__ = raytracer.main.$(id);
if(cljs.core.truth_(temp__5823__auto__)){
var el = temp__5823__auto__;
return el.value;
} else {
return null;
}
});
raytracer.main.get_int_val = (function raytracer$main$get_int_val(id){
return parseInt(raytracer.main.get_val(id),(10));
});
raytracer.main.set_progress_bar_BANG_ = (function raytracer$main$set_progress_bar_BANG_(pct){
var temp__5823__auto__ = raytracer.main.$("progress-bar");
if(cljs.core.truth_(temp__5823__auto__)){
var el = temp__5823__auto__;
return (el.style.width = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(pct),"%"].join(''));
} else {
return null;
}
});
raytracer.main.get_canvas_ctx = (function raytracer$main$get_canvas_ctx(){
var temp__5823__auto__ = raytracer.main.$("render-canvas");
if(cljs.core.truth_(temp__5823__auto__)){
var canvas = temp__5823__auto__;
return canvas.getContext("2d");
} else {
return null;
}
});
raytracer.main.setup_canvas_BANG_ = (function raytracer$main$setup_canvas_BANG_(w,h){
var temp__5823__auto__ = raytracer.main.$("render-canvas");
if(cljs.core.truth_(temp__5823__auto__)){
var canvas = temp__5823__auto__;
(canvas.width = w);

(canvas.height = h);

var ctx = canvas.getContext("2d");
(ctx.fillStyle = "#1a1a2e");

return ctx.fillRect((0),(0),w,h);
} else {
return null;
}
});
/**
 * Pack raw scene data into app-state atom.
 */
raytracer.main.pack_scene_into_state_BANG_ = (function raytracer$main$pack_scene_into_state_BANG_(raw_scene){
var map__21115 = raw_scene;
var map__21115__$1 = cljs.core.__destructure_map(map__21115);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21115__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21115__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21115__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var scene_map = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276),new cljs.core.Keyword(null,"cam-from-y","cam-from-y",1234871077),new cljs.core.Keyword(null,"cam-from-x","cam-from-x",1907362374),new cljs.core.Keyword(null,"cam-vfov","cam-vfov",1658087047),new cljs.core.Keyword(null,"cam-focus-dist","cam-focus-dist",-1676518004),new cljs.core.Keyword(null,"cam-up-z","cam-up-z",655956238),new cljs.core.Keyword(null,"cam-up-y","cam-up-y",-104075120),new cljs.core.Keyword(null,"num-materials","num-materials",-525754348),new cljs.core.Keyword(null,"cam-at-x","cam-at-x",-525032618),new cljs.core.Keyword(null,"cam-from-z","cam-from-z",1947405017),new cljs.core.Keyword(null,"cam-at-y","cam-at-y",-4279654),new cljs.core.Keyword(null,"cam-up-x","cam-up-x",314735035),new cljs.core.Keyword(null,"cam-at-z","cam-at-z",-152080484),new cljs.core.Keyword(null,"cam-aperture","cam-aperture",-1893723043),new cljs.core.Keyword(null,"cam-aspect","cam-aspect",411768797)],[spheres.length,raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),new cljs.core.Keyword(null,"vfov","vfov",-1131539466).cljs$core$IFn$_invoke$arity$1(camera_opts),new cljs.core.Keyword(null,"focus-dist","focus-dist",-1181360864).cljs$core$IFn$_invoke$arity$1(camera_opts),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),materials.length,raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),new cljs.core.Keyword(null,"aperture","aperture",-1785896285).cljs$core$IFn$_invoke$arity$1(camera_opts),new cljs.core.Keyword(null,"aspect-ratio","aspect-ratio",1674013504).cljs$core$IFn$_invoke$arity$1(camera_opts)]),cljs.core.cat,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var iter__5523__auto__ = (function raytracer$main$pack_scene_into_state_BANG__$_iter__21116(s__21117){
return (new cljs.core.LazySeq(null,(function (){
var s__21117__$1 = s__21117;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__21117__$1);
if(temp__5823__auto__){
var s__21117__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__21117__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__21117__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__21119 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__21118 = (0);
while(true){
if((i__21118 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__21118);
var s = (spheres[i]);
var prefix = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
cljs.core.chunk_append(b__21119,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cx"].join('')),(s[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cy"].join('')),(s[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cz"].join('')),(s[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(s[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"m"].join('')),(s[(4)])], null)], null));

var G__21276 = (i__21118 + (1));
i__21118 = G__21276;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__21119),raytracer$main$pack_scene_into_state_BANG__$_iter__21116(cljs.core.chunk_rest(s__21117__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__21119),null);
}
} else {
var i = cljs.core.first(s__21117__$2);
var s = (spheres[i]);
var prefix = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
return cljs.core.cons(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cx"].join('')),(s[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cy"].join('')),(s[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cz"].join('')),(s[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(s[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"m"].join('')),(s[(4)])], null)], null),raytracer$main$pack_scene_into_state_BANG__$_iter__21116(cljs.core.rest(s__21117__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(spheres.length));
})(),(function (){var iter__5523__auto__ = (function raytracer$main$pack_scene_into_state_BANG__$_iter__21120(s__21121){
return (new cljs.core.LazySeq(null,(function (){
var s__21121__$1 = s__21121;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__21121__$1);
if(temp__5823__auto__){
var s__21121__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__21121__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__21121__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__21123 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__21122 = (0);
while(true){
if((i__21122 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__21122);
var mat = (materials[i]);
var prefix = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
cljs.core.chunk_append(b__21123,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"t"].join('')),(mat[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(mat[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"g"].join('')),(mat[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"b"].join('')),(mat[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"p"].join('')),(mat[(4)])], null)], null));

var G__21277 = (i__21122 + (1));
i__21122 = G__21277;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__21123),raytracer$main$pack_scene_into_state_BANG__$_iter__21120(cljs.core.chunk_rest(s__21121__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__21123),null);
}
} else {
var i = cljs.core.first(s__21121__$2);
var mat = (materials[i]);
var prefix = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
return cljs.core.cons(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"t"].join('')),(mat[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(mat[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"g"].join('')),(mat[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"b"].join('')),(mat[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"p"].join('')),(mat[(4)])], null)], null),raytracer$main$pack_scene_into_state_BANG__$_iter__21120(cljs.core.rest(s__21121__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(materials.length));
})()));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(raytracer.main.app_state,cljs.core.merge,scene_map);
});
/**
 * Reconstruct scene arrays from the atom state map.
 */
raytracer.main.unpack_scene = (function raytracer$main$unpack_scene(state){
var num_spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276));
var num_materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-materials","num-materials",-525754348));
var spheres = (function (){var out = [];
var n__5636__auto___21278 = num_spheres;
var i_21279 = (0);
while(true){
if((i_21279 < n__5636__auto___21278)){
var prefix_21280 = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_21279),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21280,"cx"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21280,"cy"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21280,"cz"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21280,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21280,"m"].join('')))]);

var G__21281 = (i_21279 + (1));
i_21279 = G__21281;
continue;
} else {
}
break;
}

return out;
})();
var materials = (function (){var out = [];
var n__5636__auto___21282 = num_materials;
var i_21283 = (0);
while(true){
if((i_21283 < n__5636__auto___21282)){
var prefix_21284 = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_21283),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21284,"t"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21284,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21284,"g"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21284,"b"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_21284,"p"].join('')))]);

var G__21285 = (i_21283 + (1));
i_21283 = G__21285;
continue;
} else {
}
break;
}

return out;
})();
var look_from = raytracer.vec3.vec3(cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-from-x","cam-from-x",1907362374)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-from-y","cam-from-y",1234871077)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-from-z","cam-from-z",1947405017)));
var look_at = raytracer.vec3.vec3(cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-at-x","cam-at-x",-525032618)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-at-y","cam-at-y",-4279654)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-at-z","cam-at-z",-152080484)));
var vup = raytracer.vec3.vec3(cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-up-x","cam-up-x",314735035)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-up-y","cam-up-y",-104075120)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-up-z","cam-up-z",655956238)));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"spheres","spheres",1335715176),spheres,new cljs.core.Keyword(null,"materials","materials",2036902582),materials,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"look-from","look-from",-93964729),look_from,new cljs.core.Keyword(null,"look-at","look-at",189063937),look_at,new cljs.core.Keyword(null,"vup","vup",858647137),vup,new cljs.core.Keyword(null,"vfov","vfov",-1131539466),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-vfov","cam-vfov",1658087047)),new cljs.core.Keyword(null,"aspect-ratio","aspect-ratio",1674013504),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-aspect","cam-aspect",411768797)),new cljs.core.Keyword(null,"aperture","aperture",-1785896285),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-aperture","cam-aperture",-1893723043)),new cljs.core.Keyword(null,"focus-dist","focus-dist",-1181360864),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"cam-focus-dist","cam-focus-dist",-1676518004))], null)], null);
});
/**
 * Draw a single tile to the canvas at its position.
 * Reads pixel data from the tile atom's :pixels typed array.
 */
raytracer.main.draw_tile_BANG_ = (function raytracer$main$draw_tile_BANG_(ctx,tile_idx,pixels,tile_w,tile_h,img_w,img_h){
var tiles_per_row = Math.ceil((img_w / tile_w));
var tile_col = cljs.core.mod(tile_idx,tiles_per_row);
var tile_row = Math.floor((tile_idx / tiles_per_row));
var start_x = (tile_col * tile_w);
var start_y = (tile_row * tile_h);
var actual_w = (function (){var x__5133__auto__ = tile_w;
var y__5134__auto__ = (img_w - start_x);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var actual_h = (function (){var x__5133__auto__ = tile_h;
var y__5134__auto__ = (img_h - start_y);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var img_data = (new ImageData(actual_w,actual_h));
var n__5636__auto___21286 = actual_h;
var ly_21287 = (0);
while(true){
if((ly_21287 < n__5636__auto___21286)){
var src_off_21288 = ((ly_21287 * tile_w) * (4));
var dst_off_21289 = ((ly_21287 * actual_w) * (4));
var row_bytes_21290 = (actual_w * (4));
img_data.data.set(pixels.subarray(src_off_21288,(src_off_21288 + row_bytes_21290)),dst_off_21289);

var G__21291 = (ly_21287 + (1));
ly_21287 = G__21291;
continue;
} else {
}
break;
}

return ctx.putImageData(img_data,start_x,start_y);
});
raytracer.main.do_render_BANG_ = (function raytracer$main$do_render_BANG_(){
if(cljs.core.truth_(new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(raytracer.main.app_state)))){
return null;
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),true);

raytracer.main.set_disabled_BANG_("render-btn",true);

raytracer.main.set_progress_bar_BANG_((0));

raytracer.main.set_text_BANG_("progress-text","Building scene...");

var map__21125 = cljs.core.deref(raytracer.main.app_state);
var map__21125__$1 = cljs.core.__destructure_map(map__21125);
var img_w = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"img-w","img-w",1224292341));
var img_h = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"img-h","img-h",-261749895));
var spp = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"spp","spp",-1851200517));
var tile_w = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"tile-w","tile-w",2051289999));
var tile_h = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"tile-h","tile-h",356807408));
var workers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21125__$1,new cljs.core.Keyword(null,"workers","workers",-2054878819));
var raw_scene = raytracer.scene.random_scene();
var _ = raytracer.main.pack_scene_into_state_BANG_(raw_scene);
var tiles_per_row = Math.ceil((img_w / tile_w));
var tiles_per_col = Math.ceil((img_h / tile_h));
var total_tiles = (tiles_per_row * tiles_per_col);
var tile_buf_size = ((tile_w * tile_h) * (4));
raytracer.main.setup_canvas_BANG_(img_w,img_h);

raytracer.main.set_text_BANG_("progress-text","Creating tile atoms...");

var tile_atoms = cljs.core.vec((function (){var iter__5523__auto__ = (function raytracer$main$do_render_BANG__$_iter__21126(s__21127){
return (new cljs.core.LazySeq(null,(function (){
var s__21127__$1 = s__21127;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__21127__$1);
if(temp__5823__auto__){
var s__21127__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__21127__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__21127__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__21129 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__21128 = (0);
while(true){
if((i__21128 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__21128);
cljs.core.chunk_append(b__21129,(function (){var G__21130 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("raytracer.main",["tile-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i)].join(''))], null);
var G__21131 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pixels","pixels",-40523077),null,new cljs.core.Keyword(null,"done?","done?",-1847001718),false], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__21130,G__21131) : cljs_thread.eve.atom.call(null, G__21130,G__21131));
})());

var G__21292 = (i__21128 + (1));
i__21128 = G__21292;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__21129),raytracer$main$do_render_BANG__$_iter__21126(cljs.core.chunk_rest(s__21127__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__21129),null);
}
} else {
var i = cljs.core.first(s__21127__$2);
return cljs.core.cons((function (){var G__21132 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("raytracer.main",["tile-",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i)].join(''))], null);
var G__21133 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pixels","pixels",-40523077),null,new cljs.core.Keyword(null,"done?","done?",-1847001718),false], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__21132,G__21133) : cljs_thread.eve.atom.call(null, G__21132,G__21133));
})(),raytracer$main$do_render_BANG__$_iter__21126(cljs.core.rest(s__21127__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(total_tiles));
})());
var work_items = cljs.core.vec(cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,tile_atoms));
raytracer.main.set_text_BANG_("progress-text",["Rendering ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_tiles)," tiles with ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(workers)," workers..."].join(''));

try{var start_time = performance.now();
var ctx = raytracer.main.get_canvas_ctx();
var temp__5821__auto___21293 = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5821__auto___21293)){
var w__20890__auto___21294 = temp__5821__auto___21293;
cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20890__auto___21294,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [workers,raytracer.main.app_state,raytracer.main.unpack_scene,tile_buf_size,tile_w,tile_h,img_w,img_h,spp,work_items,w__20890__auto___21294], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (workers__$1,app_state,unpack_scene,tile_buf_size__$1,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1,work_items__$1,w__20890__auto____$1){
try{var _STAR_par_STAR__orig_val__21147 = cljs_thread.pmap._STAR_par_STAR_;
var _STAR_par_STAR__temp_val__21148 = workers__$1;
(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__temp_val__21148);

try{return cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs_thread.pmap.do_pmap_inline.cljs$core$IFn$_invoke$arity$variadic((function (worker_id__20985__auto__,elem__20986__auto__){
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(worker_id__20985__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [app_state,unpack_scene,tile_buf_size__$1,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1,elem__20986__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (app_state__$1,unpack_scene__$1,tile_buf_size__$2,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,elem__20986__auto____$1){
return (function (p__21154){
var vec__21155 = p__21154;
var tile_idx = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21155,(0),null);
var tile_atom = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21155,(1),null);
var state = cljs.core.deref(app_state__$1);
var map__21158 = (unpack_scene__$1.cljs$core$IFn$_invoke$arity$1 ? unpack_scene__$1.cljs$core$IFn$_invoke$arity$1(state) : unpack_scene__$1.call(null, state));
var map__21158__$1 = cljs.core.__destructure_map(map__21158);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21158__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21158__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21158__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var pixel_buf = (new Uint8ClampedArray(tile_buf_size__$2));
raytracer.render.render_tile_BANG_(tile_idx,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,pixel_buf,camera,spheres,materials);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(tile_atom,cljs.core.assoc,new cljs.core.Keyword(null,"pixels","pixels",-40523077),pixel_buf,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"done?","done?",-1847001718),true], 0));

return tile_idx;
})(elem__20986__auto____$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([work_items__$1], 0)));
}finally {(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__orig_val__21147);
}}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
} else {
cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"future","future",1877842724),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 20, 5, cljs.core.PersistentVector.EMPTY_NODE, [workers,raytracer.main.app_state,raytracer.main.unpack_scene,tile_buf_size,tile_w,tile_h,img_w,img_h,spp,work_items,workers,raytracer.main.app_state,raytracer.main.unpack_scene,tile_buf_size,tile_w,tile_h,img_w,img_h,spp,work_items], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__){
return (function (workers__$1,app_state,unpack_scene,tile_buf_size__$1,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1,work_items__$1,workers__$2,app_state__$1,unpack_scene__$1,tile_buf_size__$2,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,work_items__$2){
var yield$ = (function (res__20834__auto__){
return cljs_thread.in$.yield_result_BANG_(in_id__20829__auto__,direct_sync_QMARK___20830__auto__,sync_signal_sab__20831__auto__,sync_atom_id__20832__auto__,sync_atom_idx__20833__auto__,res__20834__auto__);
});
var k__20891__auto__ = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs_thread.util.gen_id());
return cljs.core.add_watch(cljs_thread.future.pool,k__20891__auto__,(function (___20892__auto__,___20892__auto____$1,___20892__auto____$2,___20892__auto____$3){
var temp__5823__auto__ = cljs_thread.future.take_worker_BANG_();
if(cljs.core.truth_(temp__5823__auto__)){
var w__20890__auto__ = temp__5823__auto__;
cljs.core.remove_watch(cljs_thread.future.pool,k__20891__auto__);

return yield$(cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(w__20890__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [workers__$2,app_state__$1,unpack_scene__$1,tile_buf_size__$2,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,work_items__$2,w__20890__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (workers__$3,app_state__$2,unpack_scene__$2,tile_buf_size__$3,tile_w__$3,tile_h__$3,img_w__$3,img_h__$3,spp__$3,work_items__$3,w__20890__auto____$1){
try{var _STAR_par_STAR__orig_val__21195 = cljs_thread.pmap._STAR_par_STAR_;
var _STAR_par_STAR__temp_val__21196 = workers__$3;
(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__temp_val__21196);

try{return cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs_thread.pmap.do_pmap_inline.cljs$core$IFn$_invoke$arity$variadic((function (worker_id__20985__auto__,elem__20986__auto__){
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(worker_id__20985__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [app_state__$2,unpack_scene__$2,tile_buf_size__$3,tile_w__$3,tile_h__$3,img_w__$3,img_h__$3,spp__$3,elem__20986__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (app_state__$3,unpack_scene__$3,tile_buf_size__$4,tile_w__$4,tile_h__$4,img_w__$4,img_h__$4,spp__$4,elem__20986__auto____$1){
return (function (p__21202){
var vec__21203 = p__21202;
var tile_idx = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21203,(0),null);
var tile_atom = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21203,(1),null);
var state = cljs.core.deref(app_state__$3);
var map__21206 = (unpack_scene__$3.cljs$core$IFn$_invoke$arity$1 ? unpack_scene__$3.cljs$core$IFn$_invoke$arity$1(state) : unpack_scene__$3.call(null, state));
var map__21206__$1 = cljs.core.__destructure_map(map__21206);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21206__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21206__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21206__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var pixel_buf = (new Uint8ClampedArray(tile_buf_size__$4));
raytracer.render.render_tile_BANG_(tile_idx,tile_w__$4,tile_h__$4,img_w__$4,img_h__$4,spp__$4,pixel_buf,camera,spheres,materials);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(tile_atom,cljs.core.assoc,new cljs.core.Keyword(null,"pixels","pixels",-40523077),pixel_buf,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"done?","done?",-1847001718),true], 0));

return tile_idx;
})(elem__20986__auto____$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([work_items__$3], 0)));
}finally {(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__orig_val__21195);
}}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto____$1);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0))));
} else {
return null;
}
}));
});
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),(function (){var fexpr__21232 = (function (){var G__21233 = cljs.core.deref(cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(raytracer.main.w__20890__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [workers,raytracer.main.app_state,raytracer.main.unpack_scene,tile_buf_size,tile_w,tile_h,img_w,img_h,spp,work_items,raytracer.main.w__20890__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (workers__$1,app_state,unpack_scene,tile_buf_size__$1,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1,work_items__$1,w__20890__auto__){
try{var _STAR_par_STAR__orig_val__21246 = cljs_thread.pmap._STAR_par_STAR_;
var _STAR_par_STAR__temp_val__21247 = workers__$1;
(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__temp_val__21247);

try{return cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs_thread.pmap.do_pmap_inline.cljs$core$IFn$_invoke$arity$variadic((function (worker_id__20985__auto__,elem__20986__auto__){
return cljs_thread.in$.do_in.cljs$core$IFn$_invoke$arity$variadic(worker_id__20985__auto__,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [app_state,unpack_scene,tile_buf_size__$1,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1,elem__20986__auto__], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (app_state__$1,unpack_scene__$1,tile_buf_size__$2,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,elem__20986__auto____$1){
return (function (p__21253){
var vec__21254 = p__21253;
var tile_idx = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21254,(0),null);
var tile_atom = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21254,(1),null);
var state = cljs.core.deref(app_state__$1);
var map__21257 = (unpack_scene__$1.cljs$core$IFn$_invoke$arity$1 ? unpack_scene__$1.cljs$core$IFn$_invoke$arity$1(state) : unpack_scene__$1.call(null, state));
var map__21257__$1 = cljs.core.__destructure_map(map__21257);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21257__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21257__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21257__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var pixel_buf = (new Uint8ClampedArray(tile_buf_size__$2));
raytracer.render.render_tile_BANG_(tile_idx,tile_w__$2,tile_h__$2,img_w__$2,img_h__$2,spp__$2,pixel_buf,camera,spheres,materials);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(tile_atom,cljs.core.assoc,new cljs.core.Keyword(null,"pixels","pixels",-40523077),pixel_buf,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"done?","done?",-1847001718),true], 0));

return tile_idx;
})(elem__20986__auto____$1);
})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([work_items__$1], 0)));
}finally {(cljs_thread.pmap._STAR_par_STAR_ = _STAR_par_STAR__orig_val__21246);
}}finally {cljs_thread.future.put_back_worker_BANG_(w__20890__auto__);
}})),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"yield?","yield?",-2100785447),null,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0)));
return (raytracer.main.yield$.cljs$core$IFn$_invoke$arity$1 ? raytracer.main.yield$.cljs$core$IFn$_invoke$arity$1(G__21233) : raytracer.main.yield$.call(null, G__21233));
})();
return (fexpr__21232.cljs$core$IFn$_invoke$arity$0 ? fexpr__21232.cljs$core$IFn$_invoke$arity$0() : fexpr__21232.call(null, ));
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"go?","go?",966681578),false], 0))], 0));
}

var drawn = cljs.core.PersistentHashSet.EMPTY;
while(true){
var newly_done = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (drawn,start_time,ctx,tile_atoms,work_items,map__21125,map__21125__$1,img_w,img_h,spp,tile_w,tile_h,workers,raw_scene,_,tiles_per_row,tiles_per_col,total_tiles,tile_buf_size){
return (function (p1__21124_SHARP_){
var and__5043__auto__ = (!(cljs.core.contains_QMARK_(drawn,p1__21124_SHARP_)));
if(and__5043__auto__){
return new cljs.core.Keyword(null,"done?","done?",-1847001718).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(tile_atoms,p1__21124_SHARP_)));
} else {
return and__5043__auto__;
}
});})(drawn,start_time,ctx,tile_atoms,work_items,map__21125,map__21125__$1,img_w,img_h,spp,tile_w,tile_h,workers,raw_scene,_,tiles_per_row,tiles_per_col,total_tiles,tile_buf_size))
,cljs.core.range.cljs$core$IFn$_invoke$arity$1(total_tiles)));
var drawn_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$2(drawn,newly_done);
if(cljs.core.truth_(ctx)){
var seq__21262_21295 = cljs.core.seq(newly_done);
var chunk__21263_21296 = null;
var count__21264_21297 = (0);
var i__21265_21298 = (0);
while(true){
if((i__21265_21298 < count__21264_21297)){
var i_21299 = chunk__21263_21296.cljs$core$IIndexed$_nth$arity$2(null, i__21265_21298);
var pixels_21300 = new cljs.core.Keyword(null,"pixels","pixels",-40523077).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(tile_atoms,i_21299)));
if(cljs.core.truth_(pixels_21300)){
raytracer.main.draw_tile_BANG_(ctx,i_21299,pixels_21300,tile_w,tile_h,img_w,img_h);
} else {
}


var G__21301 = seq__21262_21295;
var G__21302 = chunk__21263_21296;
var G__21303 = count__21264_21297;
var G__21304 = (i__21265_21298 + (1));
seq__21262_21295 = G__21301;
chunk__21263_21296 = G__21302;
count__21264_21297 = G__21303;
i__21265_21298 = G__21304;
continue;
} else {
var temp__5823__auto___21305 = cljs.core.seq(seq__21262_21295);
if(temp__5823__auto___21305){
var seq__21262_21306__$1 = temp__5823__auto___21305;
if(cljs.core.chunked_seq_QMARK_(seq__21262_21306__$1)){
var c__5568__auto___21307 = cljs.core.chunk_first(seq__21262_21306__$1);
var G__21308 = cljs.core.chunk_rest(seq__21262_21306__$1);
var G__21309 = c__5568__auto___21307;
var G__21310 = cljs.core.count(c__5568__auto___21307);
var G__21311 = (0);
seq__21262_21295 = G__21308;
chunk__21263_21296 = G__21309;
count__21264_21297 = G__21310;
i__21265_21298 = G__21311;
continue;
} else {
var i_21312 = cljs.core.first(seq__21262_21306__$1);
var pixels_21313 = new cljs.core.Keyword(null,"pixels","pixels",-40523077).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(tile_atoms,i_21312)));
if(cljs.core.truth_(pixels_21313)){
raytracer.main.draw_tile_BANG_(ctx,i_21312,pixels_21313,tile_w,tile_h,img_w,img_h);
} else {
}


var G__21314 = cljs.core.next(seq__21262_21306__$1);
var G__21315 = null;
var G__21316 = (0);
var G__21317 = (0);
seq__21262_21295 = G__21314;
chunk__21263_21296 = G__21315;
count__21264_21297 = G__21316;
i__21265_21298 = G__21317;
continue;
}
} else {
}
}
break;
}
} else {
}

raytracer.main.set_progress_bar_BANG_((((100) * (cljs.core.count(drawn_SINGLEQUOTE_) / total_tiles)) | (0)));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(drawn_SINGLEQUOTE_),total_tiles)){
var elapsed = ((performance.now() - start_time) / 1000.0);
var ms_per_tile = ((elapsed * (1000)) / total_tiles);
raytracer.main.set_progress_bar_BANG_((100));

raytracer.main.set_text_BANG_("progress-text",["Done! ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_tiles)," tiles in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(elapsed.toFixed((1))),"s ","(",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ms_per_tile.toFixed((1)))," ms/tile)"].join(''));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false);

return raytracer.main.set_disabled_BANG_("render-btn",false);
} else {
cljs_thread.sync.sleep((50));

var G__21318 = drawn_SINGLEQUOTE_;
drawn = G__21318;
continue;
}
break;
}
}catch (e21134){var e = e21134;
console.error("[Render] ERROR:",e);

raytracer.main.set_text_BANG_("progress-text",["Error: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e.message)].join(''));

raytracer.main.set_disabled_BANG_("render-btn",false);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false);
}}
});
raytracer.main.read_controls_BANG_ = (function raytracer$main$read_controls_BANG_(){
var res = raytracer.main.get_val("resolution");
var vec__21266 = (function (){var G__21269 = res;
switch (G__21269) {
case "400x225":
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(400),(225)], null);

break;
case "800x450":
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(800),(450)], null);

break;
case "1200x675":
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1200),(675)], null);

break;
case "1600x900":
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1600),(900)], null);

break;
default:
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(800),(450)], null);

}
})();
var w = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21266,(0),null);
var h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21266,(1),null);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"img-w","img-w",1224292341),w,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"img-h","img-h",-261749895),h,new cljs.core.Keyword(null,"spp","spp",-1851200517),raytracer.main.get_int_val("spp"),new cljs.core.Keyword(null,"workers","workers",-2054878819),raytracer.main.get_int_val("workers")], 0));
});
raytracer.main.populate_workers_dropdown_BANG_ = (function raytracer$main$populate_workers_dropdown_BANG_(){
var temp__5823__auto__ = raytracer.main.$("workers");
if(cljs.core.truth_(temp__5823__auto__)){
var el = temp__5823__auto__;
(el.innerHTML = "");

var max_workers = (function (){var or__5045__auto__ = navigator.hardwareConcurrency;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (4);
}
})();
var base_options = cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__21270_SHARP_){
return (p1__21270_SHARP_ <= max_workers);
}),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(2),(4),(8),(16)], null));
var options = (cljs.core.truth_(cljs.core.some((function (p1__21271_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__21271_SHARP_,max_workers);
}),base_options))?base_options:cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(base_options,max_workers)));
var seq__21272 = cljs.core.seq(options);
var chunk__21273 = null;
var count__21274 = (0);
var i__21275 = (0);
while(true){
if((i__21275 < count__21274)){
var n = chunk__21273.cljs$core$IIndexed$_nth$arity$2(null, i__21275);
var opt_21320 = document.createElement("option");
(opt_21320.value = cljs.core.str.cljs$core$IFn$_invoke$arity$1(n));

(opt_21320.textContent = cljs.core.str.cljs$core$IFn$_invoke$arity$1(n));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n,max_workers)){
(opt_21320.selected = true);
} else {
}

el.appendChild(opt_21320);


var G__21321 = seq__21272;
var G__21322 = chunk__21273;
var G__21323 = count__21274;
var G__21324 = (i__21275 + (1));
seq__21272 = G__21321;
chunk__21273 = G__21322;
count__21274 = G__21323;
i__21275 = G__21324;
continue;
} else {
var temp__5823__auto____$1 = cljs.core.seq(seq__21272);
if(temp__5823__auto____$1){
var seq__21272__$1 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(seq__21272__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__21272__$1);
var G__21325 = cljs.core.chunk_rest(seq__21272__$1);
var G__21326 = c__5568__auto__;
var G__21327 = cljs.core.count(c__5568__auto__);
var G__21328 = (0);
seq__21272 = G__21325;
chunk__21273 = G__21326;
count__21274 = G__21327;
i__21275 = G__21328;
continue;
} else {
var n = cljs.core.first(seq__21272__$1);
var opt_21329 = document.createElement("option");
(opt_21329.value = cljs.core.str.cljs$core$IFn$_invoke$arity$1(n));

(opt_21329.textContent = cljs.core.str.cljs$core$IFn$_invoke$arity$1(n));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n,max_workers)){
(opt_21329.selected = true);
} else {
}

el.appendChild(opt_21329);


var G__21330 = cljs.core.next(seq__21272__$1);
var G__21331 = null;
var G__21332 = (0);
var G__21333 = (0);
seq__21272 = G__21330;
chunk__21273 = G__21331;
count__21274 = G__21332;
i__21275 = G__21333;
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
raytracer.main.setup_controls_BANG_ = (function raytracer$main$setup_controls_BANG_(){
raytracer.main.populate_workers_dropdown_BANG_();

var temp__5823__auto___21334 = raytracer.main.$("resolution");
if(cljs.core.truth_(temp__5823__auto___21334)){
var el_21335 = temp__5823__auto___21334;
el_21335.addEventListener("change",(function (_){
return raytracer.main.read_controls_BANG_();
}));
} else {
}

var temp__5823__auto___21336 = raytracer.main.$("spp");
if(cljs.core.truth_(temp__5823__auto___21336)){
var el_21337 = temp__5823__auto___21336;
el_21337.addEventListener("change",(function (_){
return raytracer.main.read_controls_BANG_();
}));
} else {
}

var temp__5823__auto___21338 = raytracer.main.$("workers");
if(cljs.core.truth_(temp__5823__auto___21338)){
var el_21339 = temp__5823__auto___21338;
el_21339.addEventListener("change",(function (_){
return raytracer.main.read_controls_BANG_();
}));
} else {
}

var temp__5823__auto__ = raytracer.main.$("render-btn");
if(cljs.core.truth_(temp__5823__auto__)){
var btn = temp__5823__auto__;
return btn.addEventListener("click",(function (_){
raytracer.main.read_controls_BANG_();

return raytracer.main.do_render_BANG_();
}));
} else {
return null;
}
});
raytracer.main.main = (function raytracer$main$main(){
if((!((typeof SharedArrayBuffer !== 'undefined')))){
return raytracer.main.set_text_BANG_("progress-text","SharedArrayBuffer not available. Ensure COOP/COEP headers are set.");
} else {
raytracer.main.setup_controls_BANG_();

return raytracer.main.set_text_BANG_("progress-text","Ready. Click Render to start.");
}
});
goog.exportSymbol('raytracer.main.main', raytracer.main.main);

//# sourceMappingURL=raytracer.main.js.map
