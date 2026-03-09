goog.provide('raytracer.worker_fn');
/**
 * Reconstruct scene arrays from the shared atom state map.
 */
raytracer.worker_fn.unpack_scene = (function raytracer$worker_fn$unpack_scene(state){
var num_spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-spheres","num-spheres",-581877276));
var num_materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.Keyword(null,"num-materials","num-materials",-525754348));
var spheres = (function (){var out = [];
var n__5636__auto___22341 = num_spheres;
var i_22342 = (0);
while(true){
if((i_22342 < n__5636__auto___22341)){
var prefix_22343 = ["s",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_22342),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22343,"cx"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22343,"cy"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22343,"cz"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22343,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22343,"m"].join('')))]);

var G__22344 = (i_22342 + (1));
i_22342 = G__22344;
continue;
} else {
}
break;
}

return out;
})();
var materials = (function (){var out = [];
var n__5636__auto___22345 = num_materials;
var i_22346 = (0);
while(true){
if((i_22346 < n__5636__auto___22345)){
var prefix_22347 = ["m",cljs.core.str.cljs$core$IFn$_invoke$arity$1(i_22346),"-"].join('');
out.push([cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22347,"t"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22347,"r"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22347,"g"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22347,"b"].join(''))),cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([prefix_22347,"p"].join('')))]);

var G__22351 = (i_22346 + (1));
i_22346 = G__22351;
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
 * Render tiles assigned to this worker.
 * scene-atom — shared, read-only scene data + atomic counter.
 * tile-atom  — this worker's own atom with pre-allocated tile arrays.
 */
raytracer.worker_fn.render_tile_range_BANG_ = (function raytracer$worker_fn$render_tile_range_BANG_(scene_atom,tile_atom,tile_w,tile_h,img_w,img_h,spp){
var scene_state = cljs.core.deref(scene_atom);
var map__22323 = raytracer.worker_fn.unpack_scene(scene_state);
var map__22323__$1 = cljs.core.__destructure_map(map__22323);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22323__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22323__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22323__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var counter = new cljs.core.Keyword(null,"counter","counter",804008177).cljs$core$IFn$_invoke$arity$1(scene_state);
var tile_state = cljs.core.deref(tile_atom);
var first_tile = new cljs.core.Keyword(null,"first-tile","first-tile",-1999135533).cljs$core$IFn$_invoke$arity$1(tile_state);
var last_tile = new cljs.core.Keyword(null,"last-tile","last-tile",-884898006).cljs$core$IFn$_invoke$arity$1(tile_state);
var tile_idx = first_tile;
while(true){
if((tile_idx < last_tile)){
var tile_arr = cljs.core.get.cljs$core$IFn$_invoke$arity$2(tile_state,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(["t",cljs.core.str.cljs$core$IFn$_invoke$arity$1(tile_idx)].join('')));
var pixel_buf = cljs_thread.eve.array.get_typed_view(tile_arr);
raytracer.render.render_tile_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,pixel_buf,camera,spheres,materials);

cljs_thread.eve.array.add_BANG_(counter,(0),(1));

var G__22353 = (tile_idx + (1));
tile_idx = G__22353;
continue;
} else {
return null;
}
break;
}
});
goog.exportSymbol('raytracer.worker_fn.render_tile_range_BANG_', raytracer.worker_fn.render_tile_range_BANG_);
/**
 * Render a single tile. Returns [tile-idx pixel-buf].
 * For use with pmap — each call is independent.
 */
raytracer.worker_fn.render_tile = (function raytracer$worker_fn$render_tile(scene_atom,tile_idx,tile_w,tile_h,img_w,img_h,spp){
var scene_state = cljs.core.deref(scene_atom);
var map__22335 = raytracer.worker_fn.unpack_scene(scene_state);
var map__22335__$1 = cljs.core.__destructure_map(map__22335);
var spheres = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22335__$1,new cljs.core.Keyword(null,"spheres","spheres",1335715176));
var materials = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22335__$1,new cljs.core.Keyword(null,"materials","materials",2036902582));
var camera_opts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22335__$1,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225));
var camera = raytracer.camera.make_camera(camera_opts);
var pixel_buf = (new Uint8ClampedArray(((tile_w * tile_h) * (4))));
raytracer.render.render_tile_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,pixel_buf,camera,spheres,materials);

return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [tile_idx,pixel_buf], null);
});
goog.exportSymbol('raytracer.worker_fn.render_tile', raytracer.worker_fn.render_tile);

//# sourceMappingURL=raytracer.worker_fn.js.map
