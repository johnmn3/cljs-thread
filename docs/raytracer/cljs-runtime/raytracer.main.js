goog.provide('raytracer.main');
if((typeof raytracer !== 'undefined') && (typeof raytracer.main !== 'undefined') && (typeof raytracer.main.app_state !== 'undefined')){
} else {
raytracer.main.app_state = (function (){var G__29102 = new cljs.core.Keyword("raytracer.main","app-state","raytracer.main/app-state",131163426);
var G__29103 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false,new cljs.core.Keyword(null,"img-w","img-w",1224292341),(800),new cljs.core.Keyword(null,"img-h","img-h",-261749895),(450),new cljs.core.Keyword(null,"spp","spp",-1851200517),(10),new cljs.core.Keyword(null,"tile-w","tile-w",2051289999),(64),new cljs.core.Keyword(null,"tile-h","tile-h",356807408),(64),new cljs.core.Keyword(null,"tiles","tiles",178505240),cljs.core.PersistentArrayMap.EMPTY], null);
return (cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2 ? cljs_thread.eve.atom.cljs$core$IFn$_invoke$arity$2(G__29102,G__29103) : cljs_thread.eve.atom.call(null, G__29102,G__29103));
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
var map__29123 = raw_scene;
var map__29123__$1 = cljs.core.__destructure_map(map__29123);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29123__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29123__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29123__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var scene_map = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276),new cljs.core.Keyword(null,"cam-from-y","cam-from-y",1234871077),new cljs.core.Keyword(null,"cam-from-x","cam-from-x",1907362374),new cljs.core.Keyword(null,"cam-vfov","cam-vfov",1658087047),new cljs.core.Keyword(null,"cam-focus-dist","cam-focus-dist",-1676518004),new cljs.core.Keyword(null,"cam-up-z","cam-up-z",655956238),new cljs.core.Keyword(null,"cam-up-y","cam-up-y",-104075120),new cljs.core.Keyword(null,"num-materials","num-materials",-525754348),new cljs.core.Keyword(null,"cam-at-x","cam-at-x",-525032618),new cljs.core.Keyword(null,"cam-from-z","cam-from-z",1947405017),new cljs.core.Keyword(null,"cam-at-y","cam-at-y",-4279654),new cljs.core.Keyword(null,"cam-up-x","cam-up-x",314735035),new cljs.core.Keyword(null,"cam-at-z","cam-at-z",-152080484),new cljs.core.Keyword(null,"cam-aperture","cam-aperture",-1893723043),new cljs.core.Keyword(null,"cam-aspect","cam-aspect",411768797)],[spheres.length,raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),new cljs.core.Keyword(null,"vfov","vfov",-1131539466).cljs$core$IFn$_invoke$arity$1(camera_opts),new cljs.core.Keyword(null,"focus-dist","focus-dist",-1181360864).cljs$core$IFn$_invoke$arity$1(camera_opts),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),materials.length,raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"look-from","look-from",-93964729).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_y(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_x(new cljs.core.Keyword(null,"vup","vup",858647137).cljs$core$IFn$_invoke$arity$1(camera_opts)),raytracer.vec3.vec3_z(new cljs.core.Keyword(null,"look-at","look-at",189063937).cljs$core$IFn$_invoke$arity$1(camera_opts)),new cljs.core.Keyword(null,"aperture","aperture",-1785896285).cljs$core$IFn$_invoke$arity$1(camera_opts),new cljs.core.Keyword(null,"aspect-ratio","aspect-ratio",1674013504).cljs$core$IFn$_invoke$arity$1(camera_opts)]),cljs.core.cat,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var iter__5523__auto__ = (function raytracer$main$pack_scene_into_state_BANG__$_iter__29124(s__29125){
return (new cljs.core.LazySeq(null,(function (){
var s__29125__$1 = s__29125;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__29125__$1);
if(temp__5823__auto__){
var s__29125__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__29125__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__29125__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__29127 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__29126 = (0);
while(true){
if((i__29126 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__29126);
var s = (spheres[i]);
var prefix = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
cljs.core.chunk_append(b__29127,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cx"].join('')),(s[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cy"].join('')),(s[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cz"].join('')),(s[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(s[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"m"].join('')),(s[(4)])], null)], null));

var G__29162 = (i__29126 + (1));
i__29126 = G__29162;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__29127),raytracer$main$pack_scene_into_state_BANG__$_iter__29124(cljs.core.chunk_rest(s__29125__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__29127),null);
}
} else {
var i = cljs.core.first(s__29125__$2);
var s = (spheres[i]);
var prefix = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
return cljs.core.cons(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cx"].join('')),(s[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cy"].join('')),(s[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"cz"].join('')),(s[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(s[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"m"].join('')),(s[(4)])], null)], null),raytracer$main$pack_scene_into_state_BANG__$_iter__29124(cljs.core.rest(s__29125__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5523__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(spheres.length));
})(),(function (){var iter__5523__auto__ = (function raytracer$main$pack_scene_into_state_BANG__$_iter__29128(s__29129){
return (new cljs.core.LazySeq(null,(function (){
var s__29129__$1 = s__29129;
while(true){
var temp__5823__auto__ = cljs.core.seq(s__29129__$1);
if(temp__5823__auto__){
var s__29129__$2 = temp__5823__auto__;
if(cljs.core.chunked_seq_QMARK_(s__29129__$2)){
var c__5521__auto__ = cljs.core.chunk_first(s__29129__$2);
var size__5522__auto__ = cljs.core.count(c__5521__auto__);
var b__29131 = cljs.core.chunk_buffer(size__5522__auto__);
if((function (){var i__29130 = (0);
while(true){
if((i__29130 < size__5522__auto__)){
var i = cljs.core._nth(c__5521__auto__,i__29130);
var mat = (materials[i]);
var prefix = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
cljs.core.chunk_append(b__29131,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"t"].join('')),(mat[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(mat[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"g"].join('')),(mat[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"b"].join('')),(mat[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"p"].join('')),(mat[(4)])], null)], null));

var G__29163 = (i__29130 + (1));
i__29130 = G__29163;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__29131),raytracer$main$pack_scene_into_state_BANG__$_iter__29128(cljs.core.chunk_rest(s__29129__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__29131),null);
}
} else {
var i = cljs.core.first(s__29129__$2);
var mat = (materials[i]);
var prefix = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i),"-"].join('');
return cljs.core.cons(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"t"].join('')),(mat[(0)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"r"].join('')),(mat[(1)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"g"].join('')),(mat[(2)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"b"].join('')),(mat[(3)])], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix,"p"].join('')),(mat[(4)])], null)], null),raytracer$main$pack_scene_into_state_BANG__$_iter__29128(cljs.core.rest(s__29129__$2)));
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
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.merge,scene_map,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tiles","tiles",178505240),cljs.core.PersistentArrayMap.EMPTY], null));
});
/**
 * Draw a single tile to the canvas at its position.
 */
raytracer.main.draw_tile_BANG_ = (function raytracer$main$draw_tile_BANG_(ctx,tile_idx,tile_buf,tile_w,tile_h,img_w,img_h){
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
var img_data = ctx.createImageData(actual_w,actual_h);
var n__5636__auto___29164 = actual_h;
var ly_29165 = (0);
while(true){
if((ly_29165 < n__5636__auto___29164)){
var src_off_29166 = ((ly_29165 * tile_w) * (4));
var dst_off_29167 = ((ly_29165 * actual_w) * (4));
var row_bytes_29168 = (actual_w * (4));
img_data.data.set(tile_buf.subarray(src_off_29166,(src_off_29166 + row_bytes_29168)),dst_off_29167);

var G__29169 = (ly_29165 + (1));
ly_29165 = G__29169;
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

raytracer.main.set_text_BANG_("progress-text","Building scene...");

var map__29132 = cljs.core.deref(raytracer.main.app_state);
var map__29132__$1 = cljs.core.__destructure_map(map__29132);
var img_w = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29132__$1,new cljs.core.Keyword(null,"img-w","img-w",1224292341));
var img_h = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29132__$1,new cljs.core.Keyword(null,"img-h","img-h",-261749895));
var spp = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29132__$1,new cljs.core.Keyword(null,"spp","spp",-1851200517));
var tile_w = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29132__$1,new cljs.core.Keyword(null,"tile-w","tile-w",2051289999));
var tile_h = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29132__$1,new cljs.core.Keyword(null,"tile-h","tile-h",356807408));
var raw_scene = raytracer.scene.random_scene();
var _ = raytracer.main.pack_scene_into_state_BANG_(raw_scene);
var tiles_per_row = Math.ceil((img_w / tile_w));
var tiles_per_col = Math.ceil((img_h / tile_h));
var total_tiles = (tiles_per_row * tiles_per_col);
var tile_indices = cljs.core.vec(cljs.core.range.cljs$core$IFn$_invoke$arity$1(total_tiles));
raytracer.main.setup_canvas_BANG_(img_w,img_h);

raytracer.main.set_text_BANG_("progress-text",["Rendering ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_tiles)," tiles via pmap..."].join(''));

try{var start_time = performance.now();
var ctx = raytracer.main.get_canvas_ctx();
var completed = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
if(cljs.core.not(ctx)){
console.error("[core] No canvas context!");
} else {
var completed_indices_29170 = cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs_thread.pmap.do_pmap.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [raytracer.main.app_state,tile_w,tile_h,img_w,img_h,spp], null),cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (app_state,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1){
return (function (tile_idx){
return raytracer.tile_renderer.render_tile_BANG_(app_state,tile_idx,tile_w__$1,tile_h__$1,img_w__$1,img_h__$1,spp__$1);
});
})),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([tile_indices], 0)));
console.log("[core] pmap done, drawing",cljs.core.count(completed_indices_29170),"tiles...");

var seq__29142_29171 = cljs.core.seq(completed_indices_29170);
var chunk__29143_29172 = null;
var count__29144_29173 = (0);
var i__29145_29174 = (0);
while(true){
if((i__29145_29174 < count__29144_29173)){
var tile_idx_29175 = chunk__29143_29172.cljs$core$IIndexed$_nth$arity$2(null, i__29145_29174);
var temp__5823__auto___29176 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(raytracer.main.app_state),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tiles","tiles",178505240),tile_idx_29175], null));
if(cljs.core.truth_(temp__5823__auto___29176)){
var buf_29177 = temp__5823__auto___29176;
if((tile_idx_29175 === (0))){
console.log("[core] tile 0 buf:",cljs.core.type(buf_29177),buf_29177.length);
} else {
}

raytracer.main.draw_tile_BANG_(ctx,tile_idx_29175,buf_29177,tile_w,tile_h,img_w,img_h);
} else {
}


var G__29178 = seq__29142_29171;
var G__29179 = chunk__29143_29172;
var G__29180 = count__29144_29173;
var G__29181 = (i__29145_29174 + (1));
seq__29142_29171 = G__29178;
chunk__29143_29172 = G__29179;
count__29144_29173 = G__29180;
i__29145_29174 = G__29181;
continue;
} else {
var temp__5823__auto___29182 = cljs.core.seq(seq__29142_29171);
if(temp__5823__auto___29182){
var seq__29142_29183__$1 = temp__5823__auto___29182;
if(cljs.core.chunked_seq_QMARK_(seq__29142_29183__$1)){
var c__5568__auto___29184 = cljs.core.chunk_first(seq__29142_29183__$1);
var G__29185 = cljs.core.chunk_rest(seq__29142_29183__$1);
var G__29186 = c__5568__auto___29184;
var G__29187 = cljs.core.count(c__5568__auto___29184);
var G__29188 = (0);
seq__29142_29171 = G__29185;
chunk__29143_29172 = G__29186;
count__29144_29173 = G__29187;
i__29145_29174 = G__29188;
continue;
} else {
var tile_idx_29189 = cljs.core.first(seq__29142_29183__$1);
var temp__5823__auto___29190__$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(raytracer.main.app_state),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tiles","tiles",178505240),tile_idx_29189], null));
if(cljs.core.truth_(temp__5823__auto___29190__$1)){
var buf_29191 = temp__5823__auto___29190__$1;
if((tile_idx_29189 === (0))){
console.log("[core] tile 0 buf:",cljs.core.type(buf_29191),buf_29191.length);
} else {
}

raytracer.main.draw_tile_BANG_(ctx,tile_idx_29189,buf_29191,tile_w,tile_h,img_w,img_h);
} else {
}


var G__29192 = cljs.core.next(seq__29142_29183__$1);
var G__29193 = null;
var G__29194 = (0);
var G__29195 = (0);
seq__29142_29171 = G__29192;
chunk__29143_29172 = G__29193;
count__29144_29173 = G__29194;
i__29145_29174 = G__29195;
continue;
}
} else {
}
}
break;
}
}

var elapsed_29196 = ((performance.now() - start_time) / 1000.0);
raytracer.main.set_text_BANG_("progress-text",["Done! ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_tiles)," tiles in ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(elapsed_29196.toFixed((1))),"s"].join(''));

raytracer.main.set_disabled_BANG_("render-btn",false);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false);
}catch (e29141){var e = e29141;
console.error("[Render] ERROR:",e);

raytracer.main.set_text_BANG_("progress-text",["Error: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(e.message)].join(''));

raytracer.main.set_disabled_BANG_("render-btn",false);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"rendering?","rendering?",-1124117844),false);
}}
});
raytracer.main.read_controls_BANG_ = (function raytracer$main$read_controls_BANG_(){
var res = raytracer.main.get_val("resolution");
var vec__29152 = (function (){var G__29155 = res;
switch (G__29155) {
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
var w = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29152,(0),null);
var h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29152,(1),null);
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(raytracer.main.app_state,cljs.core.assoc,new cljs.core.Keyword(null,"img-w","img-w",1224292341),w,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"img-h","img-h",-261749895),h,new cljs.core.Keyword(null,"spp","spp",-1851200517),raytracer.main.get_int_val("spp")], 0));
});
raytracer.main.setup_controls_BANG_ = (function raytracer$main$setup_controls_BANG_(){
var temp__5823__auto___29198 = raytracer.main.$("resolution");
if(cljs.core.truth_(temp__5823__auto___29198)){
var el_29199 = temp__5823__auto___29198;
el_29199.addEventListener("change",(function (_){
return raytracer.main.read_controls_BANG_();
}));
} else {
}

var temp__5823__auto___29200 = raytracer.main.$("spp");
if(cljs.core.truth_(temp__5823__auto___29200)){
var el_29201 = temp__5823__auto___29200;
el_29201.addEventListener("change",(function (_){
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
