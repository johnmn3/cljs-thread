goog.provide('raytracer.hit');
raytracer.hit.hit_sphere = (function raytracer$hit$hit_sphere(ray,sphere,t_min,t_max){
var cx = (sphere[(0)]);
var cy = (sphere[(1)]);
var cz = (sphere[(2)]);
var radius = (sphere[(3)]);
var mat_idx = (sphere[(4)]);
var ocx = ((ray[(0)]) - cx);
var ocy = ((ray[(1)]) - cy);
var ocz = ((ray[(2)]) - cz);
var dx = (ray[(3)]);
var dy = (ray[(4)]);
var dz = (ray[(5)]);
var a = (((dx * dx) + (dy * dy)) + (dz * dz));
var half_b = (((ocx * dx) + (ocy * dy)) + (ocz * dz));
var c = ((((ocx * ocx) + (ocy * ocy)) + (ocz * ocz)) - (radius * radius));
var discriminant = ((half_b * half_b) - (a * c));
if((discriminant >= (0))){
var sqrtd = Math.sqrt(discriminant);
var root = (((- half_b) - sqrtd) / a);
var root__$1 = (((((root < t_min)) || ((root > t_max))))?(function (){var r2 = (((- half_b) + sqrtd) / a);
if((((r2 >= t_min)) && ((r2 <= t_max)))){
return r2;
} else {
return null;
}
})():root);
if(cljs.core.truth_(root__$1)){
var px = ((ray[(0)]) + (root__$1 * dx));
var py = ((ray[(1)]) + (root__$1 * dy));
var pz = ((ray[(2)]) + (root__$1 * dz));
var inv_r = (1.0 / radius);
var onx = ((px - cx) * inv_r);
var ony = ((py - cy) * inv_r);
var onz = ((pz - cz) * inv_r);
var front_face_QMARK_ = ((((dx * onx) + (dy * ony)) + (dz * onz)) < (0));
var nx = ((front_face_QMARK_)?onx:(- onx));
var ny = ((front_face_QMARK_)?ony:(- ony));
var nz = ((front_face_QMARK_)?onz:(- onz));
return [root__$1,px,py,pz,nx,ny,nz,mat_idx,((front_face_QMARK_)?(1):(0))];
} else {
return null;
}
} else {
return null;
}
});
raytracer.hit.hit_world = (function raytracer$hit$hit_world(ray,spheres,t_min,t_max){
var n = spheres.length;
var i = (0);
var closest_t = t_max;
var closest_hit = null;
while(true){
if((i >= n)){
return closest_hit;
} else {
var hit = raytracer.hit.hit_sphere(ray,(spheres[i]),t_min,closest_t);
if(cljs.core.truth_(hit)){
var G__28362 = (i + (1));
var G__28363 = (hit[(0)]);
var G__28364 = hit;
i = G__28362;
closest_t = G__28363;
closest_hit = G__28364;
continue;
} else {
var G__28365 = (i + (1));
var G__28366 = closest_t;
var G__28367 = closest_hit;
i = G__28365;
closest_t = G__28366;
closest_hit = G__28367;
continue;
}
}
break;
}
});

//# sourceMappingURL=raytracer.hit.js.map
