goog.provide('raytracer.tile_renderer');
/**
 * Reconstruct scene arrays from the atom state map.
 */
raytracer.tile_renderer.unpack_scene = (function raytracer$tile_renderer$unpack_scene(state){
var num_spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276));
var num_materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-materials","num-materials",-525754348));
var spheres = (function (){var out = [];
var n__5636__auto___28402 = num_spheres;
var i_28403 = (0);
while(true){
if((i_28403 < n__5636__auto___28402)){
var prefix_28404 = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_28403),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28404,"cx"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28404,"cy"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28404,"cz"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28404,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28404,"m"].join('')))]);

var G__28407 = (i_28403 + (1));
i_28403 = G__28407;
continue;
} else {
}
break;
}

return out;
})();
var materials = (function (){var out = [];
var n__5636__auto___28408 = num_materials;
var i_28409 = (0);
while(true){
if((i_28409 < n__5636__auto___28408)){
var prefix_28410 = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_28409),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28410,"t"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28410,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28410,"g"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28410,"b"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_28410,"p"].join('')))]);

var G__28415 = (i_28409 + (1));
i_28409 = G__28415;
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
 * Render a single tile, store in app-state, return index.
 */
raytracer.tile_renderer.render_tile_BANG_ = (function raytracer$tile_renderer$render_tile_BANG_(app_state,tile_idx,tile_w,tile_h,img_w,img_h,spp){
var state = cljs.core.deref(app_state);
var map__28398 = raytracer.tile_renderer.unpack_scene(state);
var map__28398__$1 = cljs.core.__destructure_map(map__28398);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28398__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28398__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28398__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var pixel_buf = (new Uint8ClampedArray(((tile_w * tile_h) * (4))));
raytracer.render.render_tile_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,pixel_buf,camera,spheres,materials);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(app_state,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tiles","tiles",178505240),tile_idx], null),pixel_buf);

return tile_idx;
});
goog.exportSymbol('raytracer.tile_renderer.render_tile_BANG_', raytracer.tile_renderer.render_tile_BANG_);

//# sourceMappingURL=raytracer.tile_renderer.js.map
