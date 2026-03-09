goog.provide('raytracer.camera');
raytracer.camera.make_camera = (function raytracer$camera$make_camera(p__28337){
var map__28339 = p__28337;
var map__28339__$1 = cljs.core.__destructure_map(map__28339);
var look_from = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"look-from","look-from",-93964729));
var look_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"look-at","look-at",189063937));
var vup = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"vup","vup",858647137));
var vfov = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"vfov","vfov",-1131539466));
var aspect_ratio = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"aspect-ratio","aspect-ratio",1674013504));
var aperture = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"aperture","aperture",-1785896285));
var focus_dist = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28339__$1,new cljs.core.Keyword(null,"focus-dist","focus-dist",-1181360864));
var theta = (vfov * (Math.PI / 180.0));
var h = Math.tan((theta / 2.0));
var viewport_height = (2.0 * h);
var viewport_width = (aspect_ratio * viewport_height);
var w = raytracer.vec3.normalize(raytracer.vec3.sub(look_from,look_at));
var u = raytracer.vec3.normalize(raytracer.vec3.cross(vup,w));
var vv = raytracer.vec3.cross(w,u);
var horizontal = raytracer.vec3.scale(u,(focus_dist * viewport_width));
var vertical = raytracer.vec3.scale(vv,(focus_dist * viewport_height));
var lower_left = raytracer.vec3.sub(raytracer.vec3.sub(raytracer.vec3.sub(look_from,raytracer.vec3.div(horizontal,2.0)),raytracer.vec3.div(vertical,2.0)),raytracer.vec3.scale(w,focus_dist));
var lens_radius = (aperture / 2.0);
return ({"origin": look_from, "horizontal": horizontal, "vertical": vertical, "lowerLeft": lower_left, "u": u, "v": vv, "w": w, "lensRadius": lens_radius});
});
raytracer.camera.get_ray = (function raytracer$camera$get_ray(camera,s,t){
var origin = camera.origin;
var lens_radius = camera.lensRadius;
if((lens_radius > (0))){
var rd = raytracer.vec3.scale(raytracer.vec3.rand_in_unit_disk(),lens_radius);
var u_cam = camera.u;
var v_cam = camera.v;
var offset = raytracer.vec3.add(raytracer.vec3.scale(u_cam,raytracer.vec3.vec3_x(rd)),raytracer.vec3.scale(v_cam,raytracer.vec3.vec3_y(rd)));
var from = raytracer.vec3.add(origin,offset);
var target = raytracer.vec3.add(raytracer.vec3.add(camera.lowerLeft,raytracer.vec3.scale(camera.horizontal,s)),raytracer.vec3.scale(camera.vertical,t));
var direction = raytracer.vec3.sub(target,from);
return raytracer.ray.make_ray(from,direction);
} else {
var target = raytracer.vec3.add(raytracer.vec3.add(camera.lowerLeft,raytracer.vec3.scale(camera.horizontal,s)),raytracer.vec3.scale(camera.vertical,t));
var direction = raytracer.vec3.sub(target,origin);
return raytracer.ray.make_ray(origin,direction);
}
});

//# sourceMappingURL=raytracer.camera.js.map
