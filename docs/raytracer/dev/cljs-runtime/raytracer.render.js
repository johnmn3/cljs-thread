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
var child_color = (function (){var G__20817 = scattered;
var G__20818 = spheres;
var G__20819 = materials;
var G__20820 = (depth - (1));
return (raytracer.render.trace_ray.cljs$core$IFn$_invoke$arity$4 ? raytracer.render.trace_ray.cljs$core$IFn$_invoke$arity$4(G__20817,G__20818,G__20819,G__20820) : raytracer.render.trace_ray.call(null, G__20817,G__20818,G__20819,G__20820));
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
var x_20845 = start_x;
while(true){
if((x_20845 < end_x)){
var cr_20846 = (function (){var s = (0);
var acc_r = 0.0;
var acc_g = 0.0;
var acc_b = 0.0;
while(true){
if((s >= spp)){
return [acc_r,acc_g,acc_b];
} else {
var u = ((x_20845 + Math.random()) / img_w_1);
var vv = ((y + Math.random()) / img_h_1);
var vv__$1 = (1.0 - vv);
var ray = raytracer.camera.get_ray(camera,u,vv__$1);
var color = raytracer.render.trace_ray(ray,spheres,materials,(50));
var G__20853 = (s + (1));
var G__20854 = (acc_r + (color[(0)]));
var G__20855 = (acc_g + (color[(1)]));
var G__20856 = (acc_b + (color[(2)]));
s = G__20853;
acc_r = G__20854;
acc_g = G__20855;
acc_b = G__20856;
continue;
}
break;
}
})();
var rr_20847 = Math.sqrt(((cr_20846[(0)]) * inv_spp));
var gg_20848 = Math.sqrt(((cr_20846[(1)]) * inv_spp));
var bb_20849 = Math.sqrt(((cr_20846[(2)]) * inv_spp));
var local_x_20850 = (x_20845 - start_x);
var local_y_20851 = (y - start_y);
var idx_20852 = (((local_y_20851 * tile_w) + local_x_20850) * (4));
(pixel_buf[idx_20852] = Math.floor(((256) * raytracer.render.clamp(rr_20847,0.0,0.999))));

(pixel_buf[(idx_20852 + (1))] = Math.floor(((256) * raytracer.render.clamp(gg_20848,0.0,0.999))));

(pixel_buf[(idx_20852 + (2))] = Math.floor(((256) * raytracer.render.clamp(bb_20849,0.0,0.999))));

(pixel_buf[(idx_20852 + (3))] = (255));

var G__20858 = (x_20845 + (1));
x_20845 = G__20858;
continue;
} else {
}
break;
}

var G__20859 = (y + (1));
y = G__20859;
continue;
} else {
return null;
}
break;
}
});
/**
 * Render a single tile directly into framebuffer at image coordinates.
 * framebuffer is the full image Uint8ClampedArray (img-w * img-h * 4 bytes).
 * Stride is img-w; writes directly to final pixel locations.
 */
raytracer.render.render_tile_to_framebuffer_BANG_ = (function raytracer$render$render_tile_to_framebuffer_BANG_(tile_idx,tile_w,tile_h,img_w,img_h,spp,framebuffer,camera,spheres,materials){
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
var x_20864 = start_x;
while(true){
if((x_20864 < end_x)){
var cr_20865 = (function (){var s = (0);
var acc_r = 0.0;
var acc_g = 0.0;
var acc_b = 0.0;
while(true){
if((s >= spp)){
return [acc_r,acc_g,acc_b];
} else {
var u = ((x_20864 + Math.random()) / img_w_1);
var vv = ((y + Math.random()) / img_h_1);
var vv__$1 = (1.0 - vv);
var ray = raytracer.camera.get_ray(camera,u,vv__$1);
var color = raytracer.render.trace_ray(ray,spheres,materials,(50));
var G__20870 = (s + (1));
var G__20871 = (acc_r + (color[(0)]));
var G__20872 = (acc_g + (color[(1)]));
var G__20873 = (acc_b + (color[(2)]));
s = G__20870;
acc_r = G__20871;
acc_g = G__20872;
acc_b = G__20873;
continue;
}
break;
}
})();
var rr_20866 = Math.sqrt(((cr_20865[(0)]) * inv_spp));
var gg_20867 = Math.sqrt(((cr_20865[(1)]) * inv_spp));
var bb_20868 = Math.sqrt(((cr_20865[(2)]) * inv_spp));
var idx_20869 = (((y * img_w) + x_20864) * (4));
(framebuffer[idx_20869] = Math.floor(((256) * raytracer.render.clamp(rr_20866,0.0,0.999))));

(framebuffer[(idx_20869 + (1))] = Math.floor(((256) * raytracer.render.clamp(gg_20867,0.0,0.999))));

(framebuffer[(idx_20869 + (2))] = Math.floor(((256) * raytracer.render.clamp(bb_20868,0.0,0.999))));

(framebuffer[(idx_20869 + (3))] = (255));

var G__20878 = (x_20864 + (1));
x_20864 = G__20878;
continue;
} else {
}
break;
}

var G__20879 = (y + (1));
y = G__20879;
continue;
} else {
return null;
}
break;
}
});

//# sourceMappingURL=raytracer.render.js.map
