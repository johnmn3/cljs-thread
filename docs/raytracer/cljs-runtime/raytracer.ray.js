goog.provide('raytracer.ray');
raytracer.ray.make_ray = (function raytracer$ray$make_ray(origin,direction){
return [raytracer.vec3.vec3_x(origin),raytracer.vec3.vec3_y(origin),raytracer.vec3.vec3_z(origin),raytracer.vec3.vec3_x(direction),raytracer.vec3.vec3_y(direction),raytracer.vec3.vec3_z(direction)];
});
raytracer.ray.ray_origin = (function raytracer$ray$ray_origin(ray){
return [(ray[(0)]),(ray[(1)]),(ray[(2)])];
});
raytracer.ray.ray_direction = (function raytracer$ray$ray_direction(ray){
return [(ray[(3)]),(ray[(4)]),(ray[(5)])];
});
raytracer.ray.ray_at = (function raytracer$ray$ray_at(ray,t){
return [((ray[(0)]) + (t * (ray[(3)]))),((ray[(1)]) + (t * (ray[(4)]))),((ray[(2)]) + (t * (ray[(5)])))];
});

//# sourceMappingURL=raytracer.ray.js.map
