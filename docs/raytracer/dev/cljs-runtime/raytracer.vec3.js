goog.provide('raytracer.vec3');
raytracer.vec3.vec3 = (function raytracer$vec3$vec3(x,y,z){
return [x,y,z];
});
raytracer.vec3.vec3_x = (function raytracer$vec3$vec3_x(v){
return (v[(0)]);
});
raytracer.vec3.vec3_y = (function raytracer$vec3$vec3_y(v){
return (v[(1)]);
});
raytracer.vec3.vec3_z = (function raytracer$vec3$vec3_z(v){
return (v[(2)]);
});
raytracer.vec3.add = (function raytracer$vec3$add(a,b){
return [((a[(0)]) + (b[(0)])),((a[(1)]) + (b[(1)])),((a[(2)]) + (b[(2)]))];
});
raytracer.vec3.sub = (function raytracer$vec3$sub(a,b){
return [((a[(0)]) - (b[(0)])),((a[(1)]) - (b[(1)])),((a[(2)]) - (b[(2)]))];
});
raytracer.vec3.mul = (function raytracer$vec3$mul(a,b){
return [((a[(0)]) * (b[(0)])),((a[(1)]) * (b[(1)])),((a[(2)]) * (b[(2)]))];
});
raytracer.vec3.scale = (function raytracer$vec3$scale(v,t){
return [((v[(0)]) * t),((v[(1)]) * t),((v[(2)]) * t)];
});
raytracer.vec3.div = (function raytracer$vec3$div(v,t){
var inv = (1.0 / t);
return [((v[(0)]) * inv),((v[(1)]) * inv),((v[(2)]) * inv)];
});
raytracer.vec3.dot = (function raytracer$vec3$dot(a,b){
return ((((a[(0)]) * (b[(0)])) + ((a[(1)]) * (b[(1)]))) + ((a[(2)]) * (b[(2)])));
});
raytracer.vec3.cross = (function raytracer$vec3$cross(a,b){
return [(((a[(1)]) * (b[(2)])) - ((a[(2)]) * (b[(1)]))),(((a[(2)]) * (b[(0)])) - ((a[(0)]) * (b[(2)]))),(((a[(0)]) * (b[(1)])) - ((a[(1)]) * (b[(0)])))];
});
raytracer.vec3.length_sq = (function raytracer$vec3$length_sq(v){
return ((((v[(0)]) * (v[(0)])) + ((v[(1)]) * (v[(1)]))) + ((v[(2)]) * (v[(2)])));
});
raytracer.vec3.length = (function raytracer$vec3$length(v){
return Math.sqrt(raytracer.vec3.length_sq(v));
});
raytracer.vec3.normalize = (function raytracer$vec3$normalize(v){
return raytracer.vec3.div(v,raytracer.vec3.length(v));
});
raytracer.vec3.negate = (function raytracer$vec3$negate(v){
return [(- (v[(0)])),(- (v[(1)])),(- (v[(2)]))];
});
raytracer.vec3.reflect = (function raytracer$vec3$reflect(v,n){
return raytracer.vec3.sub(v,raytracer.vec3.scale(n,(2.0 * raytracer.vec3.dot(v,n))));
});
raytracer.vec3.refract = (function raytracer$vec3$refract(uv,n,etai_over_etat){
var cos_theta = (function (){var x__5133__auto__ = (- raytracer.vec3.dot(uv,n));
var y__5134__auto__ = 1.0;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var r_out_perp = raytracer.vec3.scale(raytracer.vec3.add(uv,raytracer.vec3.scale(n,cos_theta)),etai_over_etat);
var r_out_parallel = raytracer.vec3.scale(n,(- Math.sqrt(Math.abs((1.0 - raytracer.vec3.length_sq(r_out_perp))))));
return raytracer.vec3.add(r_out_perp,r_out_parallel);
});
raytracer.vec3.near_zero_QMARK_ = (function raytracer$vec3$near_zero_QMARK_(v){
var s = 1.0E-8;
return (((Math.abs((v[(0)])) < s)) && ((((Math.abs((v[(1)])) < s)) && ((Math.abs((v[(2)])) < s)))));
});
raytracer.vec3.rand_vec3 = (function raytracer$vec3$rand_vec3(){
return [Math.random(),Math.random(),Math.random()];
});
raytracer.vec3.rand_vec3_range = (function raytracer$vec3$rand_vec3_range(mn,mx){
var r = (mx - mn);
return [(mn + (Math.random() * r)),(mn + (Math.random() * r)),(mn + (Math.random() * r))];
});
raytracer.vec3.rand_in_unit_sphere = (function raytracer$vec3$rand_in_unit_sphere(){
while(true){
var p = raytracer.vec3.rand_vec3_range(-1.0,1.0);
if((raytracer.vec3.length_sq(p) < 1.0)){
return p;
} else {
continue;
}
break;
}
});
raytracer.vec3.rand_unit_vector = (function raytracer$vec3$rand_unit_vector(){
return raytracer.vec3.normalize(raytracer.vec3.rand_in_unit_sphere());
});
raytracer.vec3.rand_in_unit_disk = (function raytracer$vec3$rand_in_unit_disk(){
while(true){
var p = [((2.0 * Math.random()) - 1.0),((2.0 * Math.random()) - 1.0),0.0];
if((raytracer.vec3.length_sq(p) < 1.0)){
return p;
} else {
continue;
}
break;
}
});

//# sourceMappingURL=raytracer.vec3.js.map
