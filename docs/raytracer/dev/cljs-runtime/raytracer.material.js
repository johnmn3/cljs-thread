goog.provide('raytracer.material');
raytracer.material.MAT_LAMBERTIAN = (0);
raytracer.material.MAT_METAL = (1);
raytracer.material.MAT_DIELECTRIC = (2);
raytracer.material.lambertian = (function raytracer$material$lambertian(r,g,b){
return [(0),r,g,b,(0)];
});
raytracer.material.metal = (function raytracer$material$metal(r,g,b,fuzz){
return [(1),r,g,b,(function (){var x__5133__auto__ = fuzz;
var y__5134__auto__ = 1.0;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})()];
});
raytracer.material.dielectric = (function raytracer$material$dielectric(refraction_index){
return [(2),1.0,1.0,1.0,refraction_index];
});
raytracer.material.reflectance = (function raytracer$material$reflectance(cosine,ref_idx){
var r0 = ((1.0 - ref_idx) / (1.0 + ref_idx));
var r0_sq = (r0 * r0);
return (r0_sq + ((1.0 - r0_sq) * Math.pow((1.0 - cosine),(5))));
});
raytracer.material.scatter = (function raytracer$material$scatter(material,ray_in,hit_record){
var mat_type = (material[(0)]);
var ar = (material[(1)]);
var ag = (material[(2)]);
var ab = (material[(3)]);
var param = (material[(4)]);
var px = (hit_record[(1)]);
var py = (hit_record[(2)]);
var pz = (hit_record[(3)]);
var nx = (hit_record[(4)]);
var ny = (hit_record[(5)]);
var nz = (hit_record[(6)]);
var front_face_QMARK_ = ((hit_record[(8)]) === (1));
var hit_point = raytracer.vec3.vec3(px,py,pz);
var normal = raytracer.vec3.vec3(nx,ny,nz);
var G__28195 = mat_type;
switch (G__28195) {
case (0):
var scatter_dir = raytracer.vec3.add(normal,raytracer.vec3.rand_unit_vector());
var scatter_dir__$1 = ((raytracer.vec3.near_zero_QMARK_(scatter_dir))?normal:scatter_dir);
var scattered = raytracer.ray.make_ray(hit_point,scatter_dir__$1);
return [ar,ag,ab,scattered];

break;
case (1):
var ray_dir = raytracer.ray.ray_direction(ray_in);
var reflected = raytracer.vec3.reflect(raytracer.vec3.normalize(ray_dir),normal);
var scattered_dir = (((param > (0)))?raytracer.vec3.add(reflected,raytracer.vec3.scale(raytracer.vec3.rand_in_unit_sphere(),param)):reflected);
var scattered = raytracer.ray.make_ray(hit_point,scattered_dir);
if((raytracer.vec3.dot(scattered_dir,normal) > (0))){
return [ar,ag,ab,scattered];
} else {
return null;
}

break;
case (2):
var refraction_ratio = ((front_face_QMARK_)?(1.0 / param):param);
var unit_dir = raytracer.vec3.normalize(raytracer.ray.ray_direction(ray_in));
var cos_theta = (function (){var x__5133__auto__ = (- raytracer.vec3.dot(unit_dir,normal));
var y__5134__auto__ = 1.0;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var sin_theta = Math.sqrt((1.0 - (cos_theta * cos_theta)));
var cannot_refract_QMARK_ = ((refraction_ratio * sin_theta) > 1.0);
var direction = ((((cannot_refract_QMARK_) || ((raytracer.material.reflectance(cos_theta,refraction_ratio) > Math.random()))))?raytracer.vec3.reflect(unit_dir,normal):raytracer.vec3.refract(unit_dir,normal,refraction_ratio));
var scattered = raytracer.ray.make_ray(hit_point,direction);
return [1.0,1.0,1.0,scattered];

break;
default:
return null;

}
});

//# sourceMappingURL=raytracer.material.js.map
