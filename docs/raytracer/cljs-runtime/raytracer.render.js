goog.provide('raytracer.render');
raytracer.render.MAX_DEPTH = (50);
raytracer.render.T_MIN = 0.001;
raytracer.render.T_MAX = 9.99999999E8;
raytracer.render.trace_ray = (function raytracer$render$trace_ray(ray,spheres,materials,depth){
if((depth <= (0))){
return [0.0,0.0,0.0];
} else {
var hit_rec = raytracer.hit.hit_world(ray,spheres,0.001,9.99999999E8);
if(cljs.core.truth_(hit_rec)){
var mat_idx = (hit_rec[(7)]);
var material = (materials[mat_idx]);
if(cljs.core.not(material)){
return [0.0,0.0,0.0];
} else {
var scatter_result = raytracer.material.scatter(material,ray,hit_rec);
if(cljs.core.truth_(scatter_result)){
var ar = (scatter_result[(0)]);
var ag = (scatter_result[(1)]);
var ab = (scatter_result[(2)]);
var scattered = (scatter_result[(3)]);
var child_color = (function (){var G__28322 = scattered;
var G__28323 = spheres;
var G__28324 = materials;
var G__28325 = (depth - (1));
return (raytracer.render.trace_ray.cljs$core$IFn$_invoke$arity$4 ? raytracer.render.trace_ray.cljs$core$IFn$_invoke$arity$4(G__28322,G__28323,G__28324,G__28325) : raytracer.render.trace_ray.call(null, G__28322,G__28323,G__28324,G__28325));
})();
return [(ar * (child_color[(0)])),(ag * (child_color[(1)])),(ab * (child_color[(2)]))];
} else {
return [0.0,0.0,0.0];
}
}
} else {
var dir = raytracer.vec3.normalize(raytracer.ray.ray_direction(ray));
var t = (0.5 * (raytracer.vec3.vec3_y(dir) + 1.0));
return [(((1.0 - t) * 1.0) + (t * 0.5)),(((1.0 - t) * 1.0) + (t * 0.7)),(((1.0 - t) * 1.0) + (t * 1.0))];
}
}
});
raytracer.render.clamp = (function raytracer$render$clamp(x,lo,hi){
if((x < lo)){
return lo;
} else {
if((x > hi)){
return hi;
} else {
return x;
}
}
});
/**
 * Render a single tile into pixel-buf at tile-local coordinates.
 * pixel-buf is the tile's own Uint8ClampedArray (tile-w * tile-h * 4 bytes).
 * Stride is tile-w; edge tiles simply don't fill the full buffer.
 */
raytracer.render.render_tile_BANG_ = (function raytracer$render$render_tile_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,pixel_buf,camera,spheres,materials){
var tiles_per_row = Math.ceil((img_w / tile_w));
var tile_col = cljs.core.mod(tile_idx,tiles_per_row);
var tile_row = Math.floor((tile_idx / tiles_per_row));
var start_x = (tile_col * tile_w);
var start_y = (tile_row * tile_h);
var end_x = (function (){var x__5133__auto__ = (start_x + tile_w);
var y__5134__auto__ = img_w;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var end_y = (function (){var x__5133__auto__ = (start_y + tile_h);
var y__5134__auto__ = img_h;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var inv_spp = (1.0 / spp);
var img_w_1 = (img_w - (1));
var img_h_1 = (img_h - (1));
var y = start_y;
while(true){
if((y < end_y)){
var x_28344 = start_x;
while(true){
if((x_28344 < end_x)){
var cr_28345 = (function (){var s = (0);
var acc_r = 0.0;
var acc_g = 0.0;
var acc_b = 0.0;
while(true){
if((s >= spp)){
return [acc_r,acc_g,acc_b];
} else {
var u = ((x_28344 + Math.random()) / img_w_1);
var vv = ((y + Math.random()) / img_h_1);
var vv__$1 = (1.0 - vv);
var ray = raytracer.camera.get_ray(camera,u,vv__$1);
var color = raytracer.render.trace_ray(ray,spheres,materials,(50));
var G__28353 = (s + (1));
var G__28354 = (acc_r + (color[(0)]));
var G__28355 = (acc_g + (color[(1)]));
var G__28356 = (acc_b + (color[(2)]));
s = G__28353;
acc_r = G__28354;
acc_g = G__28355;
acc_b = G__28356;
continue;
}
break;
}
})();
var rr_28346 = Math.sqrt(((cr_28345[(0)]) * inv_spp));
var gg_28347 = Math.sqrt(((cr_28345[(1)]) * inv_spp));
var bb_28348 = Math.sqrt(((cr_28345[(2)]) * inv_spp));
var local_x_28349 = (x_28344 - start_x);
var local_y_28350 = (y - start_y);
var idx_28351 = (((local_y_28350 * tile_w) + local_x_28349) * (4));
(pixel_buf[idx_28351] = Math.floor(((256) * raytracer.render.clamp(rr_28346,0.0,0.999))));

(pixel_buf[(idx_28351 + (1))] = Math.floor(((256) * raytracer.render.clamp(gg_28347,0.0,0.999))));

(pixel_buf[(idx_28351 + (2))] = Math.floor(((256) * raytracer.render.clamp(bb_28348,0.0,0.999))));

(pixel_buf[(idx_28351 + (3))] = (255));

var G__28360 = (x_28344 + (1));
x_28344 = G__28360;
continue;
} else {
}
break;
}

var G__28361 = (y + (1));
y = G__28361;
continue;
} else {
return null;
}
break;
}
});

//# sourceMappingURL=raytracer.render.js.map
