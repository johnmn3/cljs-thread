goog.provide('raytracer.tile_renderer');
/**
 * Reconstruct scene arrays from the atom state map.
 */
raytracer.tile_renderer.unpack_scene = (function raytracer$tile_renderer$unpack_scene(state){
var num_spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276));
var num_materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-materials","num-materials",-525754348));
var spheres = (function (){var out = [];
var n__5636__auto___23462 = num_spheres;
var i_23463 = (0);
while(true){
if((i_23463 < n__5636__auto___23462)){
var prefix_23464 = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_23463),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23464,"cx"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23464,"cy"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23464,"cz"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23464,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23464,"m"].join('')))]);

var G__23465 = (i_23463 + (1));
i_23463 = G__23465;
continue;
} else {
}
break;
}

return out;
})();
var materials = (function (){var out = [];
var n__5636__auto___23466 = num_materials;
var i_23467 = (0);
while(true){
if((i_23467 < n__5636__auto___23466)){
var prefix_23468 = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_23467),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23468,"t"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23468,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23468,"g"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23468,"b"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_23468,"p"].join('')))]);

var G__23470 = (i_23467 + (1));
i_23467 = G__23470;
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
 * Render a single tile directly into shared framebuffer.
 * Uses swap! to access the SAB-backed framebuffer for cross-worker visibility.
 */
raytracer.tile_renderer.render_tile_BANG_ = (function raytracer$tile_renderer$render_tile_BANG_(app_state,tile_idx,tile_w,tile_h,img_w,img_h,spp){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(app_state,(function (state){
var map__23461_23488 = raytracer.tile_renderer.unpack_scene(state);
var map__23461_23489__$1 = cljs.core.__destructure_map(map__23461_23488);
var spheres_23490 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23461_23489__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials_23491 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23461_23489__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts_23492 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23461_23489__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera_23493 = raytracer.camera.make_camera(camera_opts_23492);
var framebuffer_23494 = new cljs.core.Keyword(null,"framebuffer","framebuffer",-1339031455).cljs$core$IFn$_invoke$arity$1(state);
raytracer.render.render_tile_to_framebuffer_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,framebuffer_23494,camera_23493,spheres_23490,materials_23491);

return state;
}));

return tile_idx;
});
goog.exportSymbol('raytracer.tile_renderer.render_tile_BANG_', raytracer.tile_renderer.render_tile_BANG_);

//# sourceMappingURL=raytracer.tile_renderer.js.map
