goog.provide('raytracer.scene');
/**
 * Generate the RTIOW cover scene.
 * Returns {:spheres #js [...] :materials #js [...] :camera-opts {...}}.
 */
raytracer.scene.random_scene = (function raytracer$scene$random_scene(){
var materials = [];
var spheres = [];
var _ = materials.push(raytracer.material.lambertian(0.5,0.5,0.5));
var ___$1 = spheres.push([(0),(-1000),(0),(1000),(0)]);
var ___$2 = materials.push(raytracer.material.dielectric(1.5));
var ___$3 = spheres.push([(0),(1),(0),1.0,(1)]);
var ___$4 = materials.push(raytracer.material.lambertian(0.4,0.2,0.1));
var ___$5 = spheres.push([(-4),(1),(0),1.0,(2)]);
var ___$6 = materials.push(raytracer.material.metal(0.7,0.6,0.5,0.0));
var ___$7 = spheres.push([(4),(1),(0),1.0,(3)]);
var seq__28341_28436 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28346_28437 = null;
var count__28347_28438 = (0);
var i__28348_28439 = (0);
while(true){
if((i__28348_28439 < count__28347_28438)){
var a_28442 = chunk__28346_28437.cljs$core$IIndexed$_nth$arity$2(null, i__28348_28439);
var seq__28349_28444 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28350_28445 = null;
var count__28351_28446 = (0);
var i__28352_28447 = (0);
while(true){
if((i__28352_28447 < count__28351_28446)){
var b_28448 = chunk__28350_28445.cljs$core$IIndexed$_nth$arity$2(null, i__28352_28447);
var choose_mat_28449 = Math.random();
var cx_28450 = (a_28442 + (0.9 * Math.random()));
var cz_28451 = (b_28448 + (0.9 * Math.random()));
var cy_28452 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28450,cy_28452,cz_28451),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28455 = materials.length;
if((choose_mat_28449 < 0.8)){
var r_28457 = (Math.random() * Math.random());
var g_28458 = (Math.random() * Math.random());
var b_28459__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28457,g_28458,b_28459__$1));

spheres.push([cx_28450,cy_28452,cz_28451,0.2,mat_idx_28455]);
} else {
if((choose_mat_28449 < 0.95)){
var r_28460 = (0.5 + (0.5 * Math.random()));
var g_28461 = (0.5 + (0.5 * Math.random()));
var b_28462__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28463 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28460,g_28461,b_28462__$1,fuzz_28463));

spheres.push([cx_28450,cy_28452,cz_28451,0.2,mat_idx_28455]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28450,cy_28452,cz_28451,0.2,mat_idx_28455]);

}
}
} else {
}


var G__28466 = seq__28349_28444;
var G__28467 = chunk__28350_28445;
var G__28468 = count__28351_28446;
var G__28469 = (i__28352_28447 + (1));
seq__28349_28444 = G__28466;
chunk__28350_28445 = G__28467;
count__28351_28446 = G__28468;
i__28352_28447 = G__28469;
continue;
} else {
var temp__5823__auto___28471 = cljs.core.seq(seq__28349_28444);
if(temp__5823__auto___28471){
var seq__28349_28472__$1 = temp__5823__auto___28471;
if(cljs.core.chunked_seq_QMARK_(seq__28349_28472__$1)){
var c__5568__auto___28473 = cljs.core.chunk_first(seq__28349_28472__$1);
var G__28476 = cljs.core.chunk_rest(seq__28349_28472__$1);
var G__28477 = c__5568__auto___28473;
var G__28478 = cljs.core.count(c__5568__auto___28473);
var G__28479 = (0);
seq__28349_28444 = G__28476;
chunk__28350_28445 = G__28477;
count__28351_28446 = G__28478;
i__28352_28447 = G__28479;
continue;
} else {
var b_28480 = cljs.core.first(seq__28349_28472__$1);
var choose_mat_28481 = Math.random();
var cx_28482 = (a_28442 + (0.9 * Math.random()));
var cz_28483 = (b_28480 + (0.9 * Math.random()));
var cy_28484 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28482,cy_28484,cz_28483),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28486 = materials.length;
if((choose_mat_28481 < 0.8)){
var r_28487 = (Math.random() * Math.random());
var g_28488 = (Math.random() * Math.random());
var b_28489__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28487,g_28488,b_28489__$1));

spheres.push([cx_28482,cy_28484,cz_28483,0.2,mat_idx_28486]);
} else {
if((choose_mat_28481 < 0.95)){
var r_28492 = (0.5 + (0.5 * Math.random()));
var g_28493 = (0.5 + (0.5 * Math.random()));
var b_28494__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28495 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28492,g_28493,b_28494__$1,fuzz_28495));

spheres.push([cx_28482,cy_28484,cz_28483,0.2,mat_idx_28486]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28482,cy_28484,cz_28483,0.2,mat_idx_28486]);

}
}
} else {
}


var G__28499 = cljs.core.next(seq__28349_28472__$1);
var G__28500 = null;
var G__28501 = (0);
var G__28502 = (0);
seq__28349_28444 = G__28499;
chunk__28350_28445 = G__28500;
count__28351_28446 = G__28501;
i__28352_28447 = G__28502;
continue;
}
} else {
}
}
break;
}

var G__28503 = seq__28341_28436;
var G__28504 = chunk__28346_28437;
var G__28505 = count__28347_28438;
var G__28506 = (i__28348_28439 + (1));
seq__28341_28436 = G__28503;
chunk__28346_28437 = G__28504;
count__28347_28438 = G__28505;
i__28348_28439 = G__28506;
continue;
} else {
var temp__5823__auto___28507 = cljs.core.seq(seq__28341_28436);
if(temp__5823__auto___28507){
var seq__28341_28508__$1 = temp__5823__auto___28507;
if(cljs.core.chunked_seq_QMARK_(seq__28341_28508__$1)){
var c__5568__auto___28509 = cljs.core.chunk_first(seq__28341_28508__$1);
var G__28510 = cljs.core.chunk_rest(seq__28341_28508__$1);
var G__28511 = c__5568__auto___28509;
var G__28512 = cljs.core.count(c__5568__auto___28509);
var G__28513 = (0);
seq__28341_28436 = G__28510;
chunk__28346_28437 = G__28511;
count__28347_28438 = G__28512;
i__28348_28439 = G__28513;
continue;
} else {
var a_28515 = cljs.core.first(seq__28341_28508__$1);
var seq__28342_28516 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28343_28517 = null;
var count__28344_28518 = (0);
var i__28345_28519 = (0);
while(true){
if((i__28345_28519 < count__28344_28518)){
var b_28520 = chunk__28343_28517.cljs$core$IIndexed$_nth$arity$2(null, i__28345_28519);
var choose_mat_28521 = Math.random();
var cx_28522 = (a_28515 + (0.9 * Math.random()));
var cz_28523 = (b_28520 + (0.9 * Math.random()));
var cy_28524 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28522,cy_28524,cz_28523),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28525 = materials.length;
if((choose_mat_28521 < 0.8)){
var r_28526 = (Math.random() * Math.random());
var g_28527 = (Math.random() * Math.random());
var b_28528__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28526,g_28527,b_28528__$1));

spheres.push([cx_28522,cy_28524,cz_28523,0.2,mat_idx_28525]);
} else {
if((choose_mat_28521 < 0.95)){
var r_28529 = (0.5 + (0.5 * Math.random()));
var g_28530 = (0.5 + (0.5 * Math.random()));
var b_28531__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28532 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28529,g_28530,b_28531__$1,fuzz_28532));

spheres.push([cx_28522,cy_28524,cz_28523,0.2,mat_idx_28525]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28522,cy_28524,cz_28523,0.2,mat_idx_28525]);

}
}
} else {
}


var G__28537 = seq__28342_28516;
var G__28538 = chunk__28343_28517;
var G__28539 = count__28344_28518;
var G__28540 = (i__28345_28519 + (1));
seq__28342_28516 = G__28537;
chunk__28343_28517 = G__28538;
count__28344_28518 = G__28539;
i__28345_28519 = G__28540;
continue;
} else {
var temp__5823__auto___28541__$1 = cljs.core.seq(seq__28342_28516);
if(temp__5823__auto___28541__$1){
var seq__28342_28542__$1 = temp__5823__auto___28541__$1;
if(cljs.core.chunked_seq_QMARK_(seq__28342_28542__$1)){
var c__5568__auto___28543 = cljs.core.chunk_first(seq__28342_28542__$1);
var G__28544 = cljs.core.chunk_rest(seq__28342_28542__$1);
var G__28545 = c__5568__auto___28543;
var G__28546 = cljs.core.count(c__5568__auto___28543);
var G__28547 = (0);
seq__28342_28516 = G__28544;
chunk__28343_28517 = G__28545;
count__28344_28518 = G__28546;
i__28345_28519 = G__28547;
continue;
} else {
var b_28548 = cljs.core.first(seq__28342_28542__$1);
var choose_mat_28549 = Math.random();
var cx_28550 = (a_28515 + (0.9 * Math.random()));
var cz_28551 = (b_28548 + (0.9 * Math.random()));
var cy_28552 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28550,cy_28552,cz_28551),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28553 = materials.length;
if((choose_mat_28549 < 0.8)){
var r_28554 = (Math.random() * Math.random());
var g_28555 = (Math.random() * Math.random());
var b_28556__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28554,g_28555,b_28556__$1));

spheres.push([cx_28550,cy_28552,cz_28551,0.2,mat_idx_28553]);
} else {
if((choose_mat_28549 < 0.95)){
var r_28561 = (0.5 + (0.5 * Math.random()));
var g_28562 = (0.5 + (0.5 * Math.random()));
var b_28563__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28564 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28561,g_28562,b_28563__$1,fuzz_28564));

spheres.push([cx_28550,cy_28552,cz_28551,0.2,mat_idx_28553]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28550,cy_28552,cz_28551,0.2,mat_idx_28553]);

}
}
} else {
}


var G__28566 = cljs.core.next(seq__28342_28542__$1);
var G__28567 = null;
var G__28568 = (0);
var G__28569 = (0);
seq__28342_28516 = G__28566;
chunk__28343_28517 = G__28567;
count__28344_28518 = G__28568;
i__28345_28519 = G__28569;
continue;
}
} else {
}
}
break;
}

var G__28571 = cljs.core.next(seq__28341_28508__$1);
var G__28572 = null;
var G__28573 = (0);
var G__28574 = (0);
seq__28341_28436 = G__28571;
chunk__28346_28437 = G__28572;
count__28347_28438 = G__28573;
i__28348_28439 = G__28574;
continue;
}
} else {
}
}
break;
}

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"spheres","spheres",1335715176),spheres,new cljs.core.Keyword(null,"materials","materials",2036902582),materials,new cljs.core.Keyword(null,"camera-opts","camera-opts",-1259474225),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"look-from","look-from",-93964729),raytracer.vec3.vec3((13),(2),(3)),new cljs.core.Keyword(null,"look-at","look-at",189063937),raytracer.vec3.vec3((0),(0),(0)),new cljs.core.Keyword(null,"vup","vup",858647137),raytracer.vec3.vec3((0),(1),(0)),new cljs.core.Keyword(null,"vfov","vfov",-1131539466),(20),new cljs.core.Keyword(null,"aspect-ratio","aspect-ratio",1674013504),(16.0 / 9.0),new cljs.core.Keyword(null,"aperture","aperture",-1785896285),0.1,new cljs.core.Keyword(null,"focus-dist","focus-dist",-1181360864),10.0], null)], null);
});

//# sourceMappingURL=raytracer.scene.js.map
