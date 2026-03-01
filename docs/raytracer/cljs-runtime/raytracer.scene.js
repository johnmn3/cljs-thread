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
var seq__28088_28138 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28093_28139 = null;
var count__28094_28140 = (0);
var i__28095_28141 = (0);
while(true){
if((i__28095_28141 < count__28094_28140)){
var a_28142 = chunk__28093_28139.cljs$core$IIndexed$_nth$arity$2(null, i__28095_28141);
var seq__28096_28143 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28097_28144 = null;
var count__28098_28145 = (0);
var i__28099_28146 = (0);
while(true){
if((i__28099_28146 < count__28098_28145)){
var b_28147 = chunk__28097_28144.cljs$core$IIndexed$_nth$arity$2(null, i__28099_28146);
var choose_mat_28148 = Math.random();
var cx_28149 = (a_28142 + (0.9 * Math.random()));
var cz_28150 = (b_28147 + (0.9 * Math.random()));
var cy_28151 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28149,cy_28151,cz_28150),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28152 = materials.length;
if((choose_mat_28148 < 0.8)){
var r_28153 = (Math.random() * Math.random());
var g_28154 = (Math.random() * Math.random());
var b_28155__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28153,g_28154,b_28155__$1));

spheres.push([cx_28149,cy_28151,cz_28150,0.2,mat_idx_28152]);
} else {
if((choose_mat_28148 < 0.95)){
var r_28156 = (0.5 + (0.5 * Math.random()));
var g_28157 = (0.5 + (0.5 * Math.random()));
var b_28158__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28159 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28156,g_28157,b_28158__$1,fuzz_28159));

spheres.push([cx_28149,cy_28151,cz_28150,0.2,mat_idx_28152]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28149,cy_28151,cz_28150,0.2,mat_idx_28152]);

}
}
} else {
}


var G__28160 = seq__28096_28143;
var G__28161 = chunk__28097_28144;
var G__28162 = count__28098_28145;
var G__28163 = (i__28099_28146 + (1));
seq__28096_28143 = G__28160;
chunk__28097_28144 = G__28161;
count__28098_28145 = G__28162;
i__28099_28146 = G__28163;
continue;
} else {
var temp__5823__auto___28164 = cljs.core.seq(seq__28096_28143);
if(temp__5823__auto___28164){
var seq__28096_28165__$1 = temp__5823__auto___28164;
if(cljs.core.chunked_seq_QMARK_(seq__28096_28165__$1)){
var c__5568__auto___28166 = cljs.core.chunk_first(seq__28096_28165__$1);
var G__28167 = cljs.core.chunk_rest(seq__28096_28165__$1);
var G__28168 = c__5568__auto___28166;
var G__28169 = cljs.core.count(c__5568__auto___28166);
var G__28170 = (0);
seq__28096_28143 = G__28167;
chunk__28097_28144 = G__28168;
count__28098_28145 = G__28169;
i__28099_28146 = G__28170;
continue;
} else {
var b_28171 = cljs.core.first(seq__28096_28165__$1);
var choose_mat_28172 = Math.random();
var cx_28173 = (a_28142 + (0.9 * Math.random()));
var cz_28174 = (b_28171 + (0.9 * Math.random()));
var cy_28175 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28173,cy_28175,cz_28174),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28176 = materials.length;
if((choose_mat_28172 < 0.8)){
var r_28177 = (Math.random() * Math.random());
var g_28178 = (Math.random() * Math.random());
var b_28179__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28177,g_28178,b_28179__$1));

spheres.push([cx_28173,cy_28175,cz_28174,0.2,mat_idx_28176]);
} else {
if((choose_mat_28172 < 0.95)){
var r_28186 = (0.5 + (0.5 * Math.random()));
var g_28187 = (0.5 + (0.5 * Math.random()));
var b_28188__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28189 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28186,g_28187,b_28188__$1,fuzz_28189));

spheres.push([cx_28173,cy_28175,cz_28174,0.2,mat_idx_28176]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28173,cy_28175,cz_28174,0.2,mat_idx_28176]);

}
}
} else {
}


var G__28190 = cljs.core.next(seq__28096_28165__$1);
var G__28191 = null;
var G__28192 = (0);
var G__28193 = (0);
seq__28096_28143 = G__28190;
chunk__28097_28144 = G__28191;
count__28098_28145 = G__28192;
i__28099_28146 = G__28193;
continue;
}
} else {
}
}
break;
}

var G__28194 = seq__28088_28138;
var G__28195 = chunk__28093_28139;
var G__28196 = count__28094_28140;
var G__28197 = (i__28095_28141 + (1));
seq__28088_28138 = G__28194;
chunk__28093_28139 = G__28195;
count__28094_28140 = G__28196;
i__28095_28141 = G__28197;
continue;
} else {
var temp__5823__auto___28198 = cljs.core.seq(seq__28088_28138);
if(temp__5823__auto___28198){
var seq__28088_28199__$1 = temp__5823__auto___28198;
if(cljs.core.chunked_seq_QMARK_(seq__28088_28199__$1)){
var c__5568__auto___28200 = cljs.core.chunk_first(seq__28088_28199__$1);
var G__28201 = cljs.core.chunk_rest(seq__28088_28199__$1);
var G__28202 = c__5568__auto___28200;
var G__28203 = cljs.core.count(c__5568__auto___28200);
var G__28204 = (0);
seq__28088_28138 = G__28201;
chunk__28093_28139 = G__28202;
count__28094_28140 = G__28203;
i__28095_28141 = G__28204;
continue;
} else {
var a_28206 = cljs.core.first(seq__28088_28199__$1);
var seq__28089_28207 = cljs.core.seq(cljs.core.range.cljs$core$IFn$_invoke$arity$2((-5),(5)));
var chunk__28090_28208 = null;
var count__28091_28209 = (0);
var i__28092_28210 = (0);
while(true){
if((i__28092_28210 < count__28091_28209)){
var b_28211 = chunk__28090_28208.cljs$core$IIndexed$_nth$arity$2(null, i__28092_28210);
var choose_mat_28213 = Math.random();
var cx_28214 = (a_28206 + (0.9 * Math.random()));
var cz_28215 = (b_28211 + (0.9 * Math.random()));
var cy_28216 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28214,cy_28216,cz_28215),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28217 = materials.length;
if((choose_mat_28213 < 0.8)){
var r_28218 = (Math.random() * Math.random());
var g_28219 = (Math.random() * Math.random());
var b_28220__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28218,g_28219,b_28220__$1));

spheres.push([cx_28214,cy_28216,cz_28215,0.2,mat_idx_28217]);
} else {
if((choose_mat_28213 < 0.95)){
var r_28221 = (0.5 + (0.5 * Math.random()));
var g_28222 = (0.5 + (0.5 * Math.random()));
var b_28223__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28224 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28221,g_28222,b_28223__$1,fuzz_28224));

spheres.push([cx_28214,cy_28216,cz_28215,0.2,mat_idx_28217]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28214,cy_28216,cz_28215,0.2,mat_idx_28217]);

}
}
} else {
}


var G__28225 = seq__28089_28207;
var G__28226 = chunk__28090_28208;
var G__28227 = count__28091_28209;
var G__28228 = (i__28092_28210 + (1));
seq__28089_28207 = G__28225;
chunk__28090_28208 = G__28226;
count__28091_28209 = G__28227;
i__28092_28210 = G__28228;
continue;
} else {
var temp__5823__auto___28229__$1 = cljs.core.seq(seq__28089_28207);
if(temp__5823__auto___28229__$1){
var seq__28089_28230__$1 = temp__5823__auto___28229__$1;
if(cljs.core.chunked_seq_QMARK_(seq__28089_28230__$1)){
var c__5568__auto___28231 = cljs.core.chunk_first(seq__28089_28230__$1);
var G__28232 = cljs.core.chunk_rest(seq__28089_28230__$1);
var G__28233 = c__5568__auto___28231;
var G__28234 = cljs.core.count(c__5568__auto___28231);
var G__28235 = (0);
seq__28089_28207 = G__28232;
chunk__28090_28208 = G__28233;
count__28091_28209 = G__28234;
i__28092_28210 = G__28235;
continue;
} else {
var b_28236 = cljs.core.first(seq__28089_28230__$1);
var choose_mat_28237 = Math.random();
var cx_28238 = (a_28206 + (0.9 * Math.random()));
var cz_28239 = (b_28236 + (0.9 * Math.random()));
var cy_28240 = 0.2;
if((raytracer.vec3.length(raytracer.vec3.sub(raytracer.vec3.vec3(cx_28238,cy_28240,cz_28239),raytracer.vec3.vec3((4),0.2,(0)))) > 0.9)){
var mat_idx_28243 = materials.length;
if((choose_mat_28237 < 0.8)){
var r_28244 = (Math.random() * Math.random());
var g_28245 = (Math.random() * Math.random());
var b_28246__$1 = (Math.random() * Math.random());
materials.push(raytracer.material.lambertian(r_28244,g_28245,b_28246__$1));

spheres.push([cx_28238,cy_28240,cz_28239,0.2,mat_idx_28243]);
} else {
if((choose_mat_28237 < 0.95)){
var r_28247 = (0.5 + (0.5 * Math.random()));
var g_28248 = (0.5 + (0.5 * Math.random()));
var b_28249__$1 = (0.5 + (0.5 * Math.random()));
var fuzz_28250 = (0.5 * Math.random());
materials.push(raytracer.material.metal(r_28247,g_28248,b_28249__$1,fuzz_28250));

spheres.push([cx_28238,cy_28240,cz_28239,0.2,mat_idx_28243]);
} else {
materials.push(raytracer.material.dielectric(1.5));

spheres.push([cx_28238,cy_28240,cz_28239,0.2,mat_idx_28243]);

}
}
} else {
}


var G__28252 = cljs.core.next(seq__28089_28230__$1);
var G__28253 = null;
var G__28254 = (0);
var G__28255 = (0);
seq__28089_28207 = G__28252;
chunk__28090_28208 = G__28253;
count__28091_28209 = G__28254;
i__28092_28210 = G__28255;
continue;
}
} else {
}
}
break;
}

var G__28256 = cljs.core.next(seq__28088_28199__$1);
var G__28257 = null;
var G__28258 = (0);
var G__28259 = (0);
seq__28088_28138 = G__28256;
chunk__28093_28139 = G__28257;
count__28094_28140 = G__28258;
i__28095_28141 = G__28259;
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
