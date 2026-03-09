goog.provide('cljs_thread.eve.array');


cljs_thread.eve.array.HEADER_SIZE = (8);
/**
 * Subtype code → log2(bytes-per-element).
 */
cljs_thread.eve.array.subtype__GT_elem_shift = (function cljs_thread$eve$array$subtype__GT_elem_shift(code){
var G__23908 = code;
switch (G__23908) {
case (1):
case (2):
case (3):
return (0);

break;
case (4):
case (5):
return (1);

break;
case (6):
case (7):
case (8):
return (2);

break;
case (9):
return (3);

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23908)].join('')));

}
});
/**
 * True if the subtype supports Atomics (integer types only, not Uint8ClampedArray).
 */
cljs_thread.eve.array.subtype__GT_atomic_QMARK_ = (function cljs_thread$eve$array$subtype__GT_atomic_QMARK_(code){
return (((code <= (7))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(code,(3))));
});
/**
 * Type keyword → serializer subtype code.
 */
cljs_thread.eve.array.type_kw__GT_subtype = (function cljs_thread$eve$array$type_kw__GT_subtype(kw){
var G__23910 = kw;
var G__23910__$1 = (((G__23910 instanceof cljs.core.Keyword))?G__23910.fqn:null);
switch (G__23910__$1) {
case "uint8":
return (1);

break;
case "int8":
return (2);

break;
case "uint8-clamped":
return (3);

break;
case "int16":
return (4);

break;
case "uint16":
return (5);

break;
case "int32":
return (6);

break;
case "uint32":
return (7);

break;
case "float32":
return (8);

break;
case "float64":
return (9);

break;
default:
throw (new Error(["Unknown eve-array type: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(kw),". Supported: :int8 :uint8 :uint8-clamped :int16 :uint16 :int32 :uint32 :float32 :float64"].join('')));

}
});
/**
 * Subtype code → type keyword (for printing).
 */
cljs_thread.eve.array.subtype__GT_type_kw = (function cljs_thread$eve$array$subtype__GT_type_kw(code){
var G__23911 = code;
switch (G__23911) {
case (1):
return new cljs.core.Keyword(null,"uint8","uint8",956521151);

break;
case (2):
return new cljs.core.Keyword(null,"int8","int8",-1834023920);

break;
case (3):
return new cljs.core.Keyword(null,"uint8-clamped","uint8-clamped",1439331936);

break;
case (4):
return new cljs.core.Keyword(null,"int16","int16",-188764863);

break;
case (5):
return new cljs.core.Keyword(null,"uint16","uint16",-588869202);

break;
case (6):
return new cljs.core.Keyword(null,"int32","int32",1718804896);

break;
case (7):
return new cljs.core.Keyword(null,"uint32","uint32",-418789486);

break;
case (8):
return new cljs.core.Keyword(null,"float32","float32",-2119815775);

break;
case (9):
return new cljs.core.Keyword(null,"float64","float64",1881838306);

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23911)].join('')));

}
});
/**
 * Create a JS typed array view over the entire SAB for a given subtype.
 */
cljs_thread.eve.array.make_typed_view = (function cljs_thread$eve$array$make_typed_view(sab,subtype_code){
var G__23912 = subtype_code;
switch (G__23912) {
case (1):
return (new Uint8Array(sab));

break;
case (2):
return (new Int8Array(sab));

break;
case (3):
return (new Uint8ClampedArray(sab));

break;
case (4):
return (new Int16Array(sab));

break;
case (5):
return (new Uint16Array(sab));

break;
case (6):
return (new Int32Array(sab));

break;
case (7):
return (new Uint32Array(sab));

break;
case (8):
return (new Float32Array(sab));

break;
case (9):
return (new Float64Array(sab));

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23912)].join('')));

}
});
cljs_thread.eve.array.require_atomic_BANG_ = (function cljs_thread$eve$array$require_atomic_BANG_(arr,op){
if(cljs.core.truth_(arr.atomic_QMARK_)){
return null;
} else {
throw (new Error([cljs.core.str.cljs$core$IFn$_invoke$arity$1(op)," requires an integer-typed array (not supported on :float32/:float64)"].join('')));
}
});
cljs_thread.eve.array.require_int32_BANG_ = (function cljs_thread$eve$array$require_int32_BANG_(arr,op){
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(arr.subtype_code,(6))){
throw (new Error([cljs.core.str.cljs$core$IFn$_invoke$arity$1(op)," only supported on :int32 arrays"].join('')));
} else {
return null;
}
});

/**
* @constructor
 * @implements {cljs_thread.eve.deftype_proto.data.IsEve}
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICounted}
 * @implements {cljs_thread.eve.deftype_proto.data.ISabStorable}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.ILookup}
 * @implements {cljs.core.IReduce}
*/
cljs_thread.eve.array.EveArray = (function (sab,block_start,offset,length,descriptor_idx,subtype_code,elem_shift,atomic_QMARK_,typed_view,__hash,_meta){
this.sab = sab;
this.block_start = block_start;
this.offset = offset;
this.length = length;
this.descriptor_idx = descriptor_idx;
this.subtype_code = subtype_code;
this.elem_shift = elem_shift;
this.atomic_QMARK_ = atomic_QMARK_;
this.typed_view = typed_view;
this.__hash = __hash;
this._meta = _meta;
this.cljs$lang$protocol_mask$partition0$ = 2163081491;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$IsEve$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$IsEve$_eve_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
}));

(cljs_thread.eve.array.EveArray.prototype.toString = (function (){
var self__ = this;
var this$ = this;
return ["#eve/array ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.array.subtype__GT_type_kw(self__.subtype_code))," [",clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.take.cljs$core$IFn$_invoke$arity$2((10),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23929_SHARP_){
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(this$,p1__23929_SHARP_);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1((function (){var x__5133__auto__ = (10);
var y__5134__auto__ = self__.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())))),(((self__.length > (10)))?" ...":null),"]"].join('');
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this$,k){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$IIndexed$_nth$arity$3(null, k,null);
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this$,k,not_found){
var self__ = this;
var this$__$1 = this;
return this$__$1.cljs$core$IIndexed$_nth$arity$3(null, k,not_found);
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (this$,n){
var self__ = this;
var this$__$1 = this;
if((((n >= (0))) && ((n < self__.length)))){
var idx = ((self__.offset >>> self__.elem_shift) + n);
if(self__.atomic_QMARK_){
return Atomics.load(self__.typed_view,idx);
} else {
return (self__.typed_view[idx]);
}
} else {
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(n)," for length ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.length)].join('')));
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (this$,n,not_found){
var self__ = this;
var this$__$1 = this;
if((((n >= (0))) && ((n < self__.length)))){
var idx = ((self__.offset >>> self__.elem_shift) + n);
if(self__.atomic_QMARK_){
return Atomics.load(self__.typed_view,idx);
} else {
return (self__.typed_view[idx]);
}
} else {
return not_found;
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this$,writer,opts){
var self__ = this;
var this$__$1 = this;
cljs.core._write(writer,["#eve/array ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.array.subtype__GT_type_kw(self__.subtype_code))," ["].join(''));

var i_24702 = (0);
while(true){
if((i_24702 < (function (){var x__5133__auto__ = (20);
var y__5134__auto__ = self__.length;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})())){
if((i_24702 > (0))){
cljs.core._write(writer," ");
} else {
}

cljs.core._write(writer,cljs.core.str.cljs$core$IFn$_invoke$arity$1(this$__$1.cljs$core$IIndexed$_nth$arity$2(null, i_24702)));

var G__24705 = (i_24702 + (1));
i_24702 = G__24705;
continue;
} else {
}
break;
}

if((self__.length > (20))){
cljs.core._write(writer," ...");
} else {
}

return cljs.core._write(writer,"]");
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__._meta;
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.length;
}));

(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$ = cljs.core.PROTOCOL_SENTINEL);

(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_tag$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return new cljs.core.Keyword("eve","array","eve/array",-2080879302);
}));

(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_encode$arity$2 = (function (_this,_s_atom_env){
var self__ = this;
var _this__$1 = this;
return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((28),self__.block_start);
}));

(cljs_thread.eve.array.EveArray.prototype.cljs_thread$eve$deftype_proto$data$ISabStorable$_sab_dispose$arity$2 = (function (this$,s_atom_env){
var self__ = this;
var this$__$1 = this;
if((((!((self__.descriptor_idx == null)))) && ((self__.descriptor_idx >= (0))))){
return cljs_thread.eve.shared_atom.retire_block_BANG_(s_atom_env,self__.descriptor_idx);
} else {
return null;
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if(cljs.core.truth_(self__.__hash)){
return self__.__hash;
} else {
var h = (function (){var i = (0);
var h = ((1) + ((31) * self__.subtype_code));
while(true){
if((i < self__.length)){
var G__24709 = (i + (1));
var G__24710 = (((31) * h) + cljs.core.hash(this$__$1.cljs$core$IIndexed$_nth$arity$2(null, i)));
i = G__24709;
h = G__24710;
continue;
} else {
return h;
}
break;
}
})();
(self__.__hash = h);

return h;
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this$,other){
var self__ = this;
var this$__$1 = this;
if((this$__$1 === other)){
return true;
} else {
if((!((other instanceof cljs_thread.eve.array.EveArray)))){
return false;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.subtype_code,other.subtype_code)){
return false;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(self__.length,cljs.core.count(other))){
return false;
} else {
var i = (0);
while(true){
if((i < self__.length)){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this$__$1.cljs$core$IIndexed$_nth$arity$2(null, i),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(other,i))){
var G__24720 = (i + (1));
i = G__24720;
continue;
} else {
return false;
}
} else {
return true;
}
break;
}

}
}
}
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
if((self__.length === (0))){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null, ));
} else {
var i = (1);
var acc = this$__$1.cljs$core$IIndexed$_nth$arity$2(null, (0));
while(true){
if((i < self__.length)){
var result = (function (){var G__24021 = acc;
var G__24022 = this$__$1.cljs$core$IIndexed$_nth$arity$2(null, i);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__24021,G__24022) : f.call(null, G__24021,G__24022));
})();
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
var G__24725 = (i + (1));
var G__24726 = result;
i = G__24725;
acc = G__24726;
continue;
}
} else {
return acc;
}
break;
}
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (this$,f,start){
var self__ = this;
var this$__$1 = this;
var i = (0);
var acc = start;
while(true){
if((i < self__.length)){
var result = (function (){var G__24028 = acc;
var G__24029 = this$__$1.cljs$core$IIndexed$_nth$arity$2(null, i);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__24028,G__24029) : f.call(null, G__24028,G__24029));
})();
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
var G__24730 = (i + (1));
var G__24731 = result;
i = G__24730;
acc = G__24731;
continue;
}
} else {
return acc;
}
break;
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
if((self__.length > (0))){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23935_SHARP_){
return this$__$1.cljs$core$IIndexed$_nth$arity$2(null, p1__23935_SHARP_);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(self__.length));
} else {
return null;
}
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_,new_meta){
var self__ = this;
var ___$1 = this;
return (new cljs_thread.eve.array.EveArray(self__.sab,self__.block_start,self__.offset,self__.length,self__.descriptor_idx,self__.subtype_code,self__.elem_shift,self__.atomic_QMARK_,self__.typed_view,self__.__hash,new_meta));
}));

(cljs_thread.eve.array.EveArray.prototype.call = (function (unused__11796__auto__){
var self__ = this;
var self__ = this;
var G__24048 = (arguments.length - (1));
switch (G__24048) {
case (1):
return self__.cljs$core$IFn$_invoke$arity$1((arguments[(1)]));

break;
case (2):
return self__.cljs$core$IFn$_invoke$arity$2((arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1((arguments.length - (1)))].join('')));

}
}));

(cljs_thread.eve.array.EveArray.prototype.apply = (function (self__,args23956){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args23956)));
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IFn$_invoke$arity$1 = (function (k){
var self__ = this;
var this$ = this;
return this$.cljs$core$IIndexed$_nth$arity$2(null, k);
}));

(cljs_thread.eve.array.EveArray.prototype.cljs$core$IFn$_invoke$arity$2 = (function (k,not_found){
var self__ = this;
var this$ = this;
return this$.cljs$core$IIndexed$_nth$arity$3(null, k,not_found);
}));

(cljs_thread.eve.array.EveArray.getBasis = (function (){
return new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"sab","sab",2063101620,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("js","SharedArrayBuffer","js/SharedArrayBuffer",2120397236,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"block-start","block-start",1307495168,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"offset","offset",1937029838,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"length","length",-2065447907,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"descriptor-idx","descriptor-idx",246178702,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"subtype-code","subtype-code",855564202,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"elem-shift","elem-shift",94249629,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"atomic?","atomic?",751052431,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"boolean","boolean",-278886877,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"typed-view","typed-view",-1178926922,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"js","js",-886355190,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"__hash","__hash",-1328796629,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"mutable","mutable",875778266),true], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"_meta","_meta",-1716892533,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"IPersistentMap","IPersistentMap",-1287606978,null)], null))], null);
}));

(cljs_thread.eve.array.EveArray.cljs$lang$type = true);

(cljs_thread.eve.array.EveArray.cljs$lang$ctorStr = "cljs-thread.eve.array/EveArray");

(cljs_thread.eve.array.EveArray.cljs$lang$ctorPrWriter = (function (this__5330__auto__,writer__5331__auto__,opt__5332__auto__){
return cljs.core._write(writer__5331__auto__,"cljs-thread.eve.array/EveArray");
}));

/**
 * Positional factory function for cljs-thread.eve.array/EveArray.
 */
cljs_thread.eve.array.__GT_EveArray = (function cljs_thread$eve$array$__GT_EveArray(sab,block_start,offset,length,descriptor_idx,subtype_code,elem_shift,atomic_QMARK_,typed_view,__hash,_meta){
return (new cljs_thread.eve.array.EveArray(sab,block_start,offset,length,descriptor_idx,subtype_code,elem_shift,atomic_QMARK_,typed_view,__hash,_meta));
});

/**
 * Allocate a SAB region for n elements of the given subtype.
 * Writes the 8-byte header and aligns data to element size boundary.
 * Returns {:sab sab :offset data-offset :descriptor-idx idx}.
 */
cljs_thread.eve.array.alloc_eve_region = (function cljs_thread$eve$array$alloc_eve_region(subtype_code,n){
var elem_shift = cljs_thread.eve.array.subtype__GT_elem_shift(subtype_code);
var elem_size = ((1) << elem_shift);
var data_byte_size = (n * elem_size);
var max_padding = (elem_size - (1));
var total_size = (((8) + max_padding) + data_byte_size);
var eve_env = (cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)?cljs_thread.eve.shared_atom.get_env(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_):(function(){throw (new Error("No global atom instance. Call (eve.atom/atom-domain {}) first."))})());
var alloc_result = cljs_thread.eve.shared_atom.alloc(eve_env,total_size);
if(cljs.core.truth_(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result))){
throw (new Error(["Failed to allocate eve-array: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result))].join('')));
} else {
var block_start = new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_result);
var raw_data_start = (block_start + (8));
var data_offset = ((raw_data_start + (elem_size - (1))) & (~ (elem_size - (1))));
var sab = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_env);
var dv = (new DataView(sab));
dv.setUint8(block_start,subtype_code);

dv.setUint8((block_start + (1)),(0));

dv.setUint16((block_start + (2)),(0),true);

dv.setUint32((block_start + (4)),n,true);

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sab","sab",422570093),sab,new cljs.core.Keyword(null,"block-start","block-start",-333036359),block_start,new cljs.core.Keyword(null,"offset","offset",296498311),data_offset,new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825),new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825).cljs$core$IFn$_invoke$arity$1(alloc_result)], null);
}
});
cljs_thread.eve.array.make_eve_array = (function cljs_thread$eve$array$make_eve_array(type_kw,n,init_val){
var subtype = cljs_thread.eve.array.type_kw__GT_subtype(type_kw);
var map__24105 = cljs_thread.eve.array.alloc_eve_region(subtype,n);
var map__24105__$1 = cljs.core.__destructure_map(map__24105);
var sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24105__$1,new cljs.core.Keyword(null,"sab","sab",422570093));
var block_start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24105__$1,new cljs.core.Keyword(null,"block-start","block-start",-333036359));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24105__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var descriptor_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24105__$1,new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825));
var elem_shift = cljs_thread.eve.array.subtype__GT_elem_shift(subtype);
var atomic = cljs_thread.eve.array.subtype__GT_atomic_QMARK_(subtype);
var view = cljs_thread.eve.array.make_typed_view(sab,subtype);
var arr = (new cljs_thread.eve.array.EveArray(sab,block_start,offset,n,descriptor_idx,subtype,elem_shift,atomic,view,null,null));
var base_idx = (offset >>> elem_shift);
var fill_val = (function (){var or__5045__auto__ = init_val;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (0);
}
})();
if(atomic){
var n__5636__auto___24759 = n;
var i_24760 = (0);
while(true){
if((i_24760 < n__5636__auto___24759)){
Atomics.store(view,(base_idx + i_24760),fill_val);

var G__24763 = (i_24760 + (1));
i_24760 = G__24763;
continue;
} else {
}
break;
}
} else {
var n__5636__auto___24768 = n;
var i_24769 = (0);
while(true){
if((i_24769 < n__5636__auto___24768)){
(view[(base_idx + i_24769)] = fill_val);

var G__24771 = (i_24769 + (1));
i_24769 = G__24771;
continue;
} else {
}
break;
}
}

return arr;
});
cljs_thread.eve.array.make_eve_array_from = (function cljs_thread$eve$array$make_eve_array_from(type_kw,coll){
var v = cljs.core.vec(coll);
var n = cljs.core.count(v);
if((n === (0))){
return cljs_thread.eve.array.make_eve_array(type_kw,(0),null);
} else {
var subtype = cljs_thread.eve.array.type_kw__GT_subtype(type_kw);
var map__24126 = cljs_thread.eve.array.alloc_eve_region(subtype,n);
var map__24126__$1 = cljs.core.__destructure_map(map__24126);
var sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24126__$1,new cljs.core.Keyword(null,"sab","sab",422570093));
var block_start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24126__$1,new cljs.core.Keyword(null,"block-start","block-start",-333036359));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24126__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var descriptor_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24126__$1,new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825));
var elem_shift = cljs_thread.eve.array.subtype__GT_elem_shift(subtype);
var atomic = cljs_thread.eve.array.subtype__GT_atomic_QMARK_(subtype);
var view = cljs_thread.eve.array.make_typed_view(sab,subtype);
var arr = (new cljs_thread.eve.array.EveArray(sab,block_start,offset,n,descriptor_idx,subtype,elem_shift,atomic,view,null,null));
var base_idx = (offset >>> elem_shift);
if(atomic){
var n__5636__auto___24772 = n;
var i_24773 = (0);
while(true){
if((i_24773 < n__5636__auto___24772)){
Atomics.store(view,(base_idx + i_24773),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(v,i_24773));

var G__24774 = (i_24773 + (1));
i_24773 = G__24774;
continue;
} else {
}
break;
}
} else {
var n__5636__auto___24775 = n;
var i_24776 = (0);
while(true){
if((i_24776 < n__5636__auto___24775)){
(view[(base_idx + i_24776)] = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(v,i_24776));

var G__24777 = (i_24776 + (1));
i_24776 = G__24777;
continue;
} else {
}
break;
}
}

return arr;
}
});
/**
 * Create a typed array backed by SharedArrayBuffer.
 * 
 *   (eve-array :int32 10)          ;; 10 zero-filled int32 elements
 *   (eve-array :float64 10 0.0)    ;; 10 float64 filled with 0.0
 *   (eve-array :uint8 [1 2 3])     ;; from collection
 * 
 * Supported types: :int8 :uint8 :int16 :uint16 :int32 :uint32 :float32 :float64
 */
cljs_thread.eve.array.eve_array = (function cljs_thread$eve$array$eve_array(var_args){
var G__24137 = arguments.length;
switch (G__24137) {
case 2:
return cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$2 = (function (type_kw,size_or_coll){
if(typeof size_or_coll === 'number'){
return cljs_thread.eve.array.make_eve_array(type_kw,(size_or_coll | (0)),null);
} else {
return cljs_thread.eve.array.make_eve_array_from(type_kw,size_or_coll);
}
}));

(cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$3 = (function (type_kw,n,init_val){
return cljs_thread.eve.array.make_eve_array(type_kw,(n | (0)),init_val);
}));

(cljs_thread.eve.array.eve_array.cljs$lang$maxFixedArity = 3);

/**
 * Create an int32 array. Alias for (eve-array :int32 ...).
 */
cljs_thread.eve.array.int32_array = (function cljs_thread$eve$array$int32_array(var_args){
var G__24143 = arguments.length;
switch (G__24143) {
case 1:
return cljs_thread.eve.array.int32_array.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs_thread.eve.array.int32_array.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.int32_array.cljs$core$IFn$_invoke$arity$1 = (function (n){
return cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"int32","int32",1718804896),n);
}));

(cljs_thread.eve.array.int32_array.cljs$core$IFn$_invoke$arity$2 = (function (n,init_val){
return cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"int32","int32",1718804896),n,init_val);
}));

(cljs_thread.eve.array.int32_array.cljs$lang$maxFixedArity = 2);

/**
 * Create an int32 array from a collection. Alias for (eve-array :int32 coll).
 */
cljs_thread.eve.array.int32_array_from = (function cljs_thread$eve$array$int32_array_from(coll){
return cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"int32","int32",1718804896),coll);
});
/**
 * Read element at index. Uses Atomics.load for integer types,
 * plain indexing for float types.
 */
cljs_thread.eve.array.aget = (function cljs_thread$eve$array$aget(arr,idx){
var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
if(cljs.core.truth_(arr.atomic_QMARK_)){
return Atomics.load(view,(base + idx));
} else {
return (view[(base + idx)]);
}
});
/**
 * Write element at index. Uses Atomics.store for integer types,
 * plain assignment for float types. Returns the value written.
 */
cljs_thread.eve.array.aset_BANG_ = (function cljs_thread$eve$array$aset_BANG_(arr,idx,val){
var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view_24786 = arr.typed_view;
var base_24787 = (arr.offset >>> arr.elem_shift);
if(cljs.core.truth_(arr.atomic_QMARK_)){
Atomics.store(view_24786,(base_24787 + idx),val);
} else {
(view_24786[(base_24787 + idx)] = val);
}

return val;
});
/**
 * Compare-and-swap at index. Returns true if successful.
 * Integer types only.
 */
cljs_thread.eve.array.cas_BANG_ = (function cljs_thread$eve$array$cas_BANG_(arr,idx,expected,new_val){
cljs_thread.eve.array.require_atomic_BANG_(arr,"cas!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return (expected === Atomics.compareExchange(view,(base + idx),expected,new_val));
});
/**
 * Atomically replace value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.exchange_BANG_ = (function cljs_thread$eve$array$exchange_BANG_(arr,idx,new_val){
cljs_thread.eve.array.require_atomic_BANG_(arr,"exchange!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.exchange(view,(base + idx),new_val);
});
/**
 * Atomically add to value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.add_BANG_ = (function cljs_thread$eve$array$add_BANG_(arr,idx,delta){
cljs_thread.eve.array.require_atomic_BANG_(arr,"add!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.add(view,(base + idx),delta);
});
/**
 * Atomically subtract from value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.sub_BANG_ = (function cljs_thread$eve$array$sub_BANG_(arr,idx,delta){
cljs_thread.eve.array.require_atomic_BANG_(arr,"sub!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.sub(view,(base + idx),delta);
});
/**
 * Atomically bitwise-AND value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.band_BANG_ = (function cljs_thread$eve$array$band_BANG_(arr,idx,mask){
cljs_thread.eve.array.require_atomic_BANG_(arr,"band!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.and(view,(base + idx),mask);
});
/**
 * Atomically bitwise-OR value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.bor_BANG_ = (function cljs_thread$eve$array$bor_BANG_(arr,idx,mask){
cljs_thread.eve.array.require_atomic_BANG_(arr,"bor!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.or(view,(base + idx),mask);
});
/**
 * Atomically bitwise-XOR value at index, returning the old value.
 * Integer types only.
 */
cljs_thread.eve.array.bxor_BANG_ = (function cljs_thread$eve$array$bxor_BANG_(arr,idx,mask){
cljs_thread.eve.array.require_atomic_BANG_(arr,"bxor!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.xor(view,(base + idx),mask);
});
/**
 * Block until the value at index is not equal to `expected`, or until timeout.
 * Returns :ok, :not-equal, or :timed-out.
 * :int32 arrays only.
 */
cljs_thread.eve.array.wait_BANG_ = (function cljs_thread$eve$array$wait_BANG_(var_args){
var G__24284 = arguments.length;
switch (G__24284) {
case 3:
return cljs_thread.eve.array.wait_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs_thread.eve.array.wait_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.wait_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (arr,idx,expected){
return cljs_thread.eve.array.wait_BANG_.cljs$core$IFn$_invoke$arity$4(arr,idx,expected,Infinity);
}));

(cljs_thread.eve.array.wait_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (arr,idx,expected,timeout_ms){
cljs_thread.eve.array.require_int32_BANG_(arr,"wait!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
var result = Atomics.wait(view,(base + idx),expected,timeout_ms);
var G__24288 = result;
switch (G__24288) {
case "ok":
return new cljs.core.Keyword(null,"ok","ok",967785236);

break;
case "not-equal":
return new cljs.core.Keyword(null,"not-equal","not-equal",1611286641);

break;
case "timed-out":
return new cljs.core.Keyword(null,"timed-out","timed-out",-641422815);

break;
default:
return result;

}
}));

(cljs_thread.eve.array.wait_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Async version of wait!. Returns a promise that resolves to :ok, :not-equal, or :timed-out.
 * :int32 arrays only.
 */
cljs_thread.eve.array.wait_async = (function cljs_thread$eve$array$wait_async(var_args){
var G__24322 = arguments.length;
switch (G__24322) {
case 3:
return cljs_thread.eve.array.wait_async.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs_thread.eve.array.wait_async.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.wait_async.cljs$core$IFn$_invoke$arity$3 = (function (arr,idx,expected){
return cljs_thread.eve.array.wait_async.cljs$core$IFn$_invoke$arity$4(arr,idx,expected,Infinity);
}));

(cljs_thread.eve.array.wait_async.cljs$core$IFn$_invoke$arity$4 = (function (arr,idx,expected,timeout_ms){
cljs_thread.eve.array.require_int32_BANG_(arr,"wait-async");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
var result = Atomics.waitAsync(view,(base + idx),expected,timeout_ms);
if(cljs.core.truth_(result.async)){
return result.value.then((function (r){
var G__24344 = r;
switch (G__24344) {
case "ok":
return new cljs.core.Keyword(null,"ok","ok",967785236);

break;
case "not-equal":
return new cljs.core.Keyword(null,"not-equal","not-equal",1611286641);

break;
case "timed-out":
return new cljs.core.Keyword(null,"timed-out","timed-out",-641422815);

break;
default:
return r;

}
}));
} else {
var v = result.value;
return Promise.resolve((function (){var G__24354 = v;
switch (G__24354) {
case "ok":
return new cljs.core.Keyword(null,"ok","ok",967785236);

break;
case "not-equal":
return new cljs.core.Keyword(null,"not-equal","not-equal",1611286641);

break;
case "timed-out":
return new cljs.core.Keyword(null,"timed-out","timed-out",-641422815);

break;
default:
return v;

}
})());
}
}));

(cljs_thread.eve.array.wait_async.cljs$lang$maxFixedArity = 4);

/**
 * Wake up waiting agents on the value at index.
 * count defaults to ##Inf (wake all waiters).
 * Returns the number of agents woken.
 * :int32 arrays only.
 */
cljs_thread.eve.array.notify_BANG_ = (function cljs_thread$eve$array$notify_BANG_(var_args){
var G__24388 = arguments.length;
switch (G__24388) {
case 2:
return cljs_thread.eve.array.notify_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs_thread.eve.array.notify_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.notify_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (arr,idx){
return cljs_thread.eve.array.notify_BANG_.cljs$core$IFn$_invoke$arity$3(arr,idx,Infinity);
}));

(cljs_thread.eve.array.notify_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (arr,idx,cnt){
cljs_thread.eve.array.require_int32_BANG_(arr,"notify!");

var length = arr.length;
if((((idx < (0))) || ((idx >= length)))){
throw (new Error(["Index out of bounds: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)].join('')));
} else {
}

var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return Atomics.notify(view,(base + idx),cnt);
}));

(cljs_thread.eve.array.notify_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Reduce over array elements with index.
 * f is (fn [acc idx val] ...).
 * Returns the final accumulated value.
 */
cljs_thread.eve.array.areduce = (function cljs_thread$eve$array$areduce(arr,init,f){
var len = arr.length;
var i = (0);
var acc = init;
while(true){
if((i < len)){
var result = (function (){var G__24453 = acc;
var G__24454 = i;
var G__24455 = cljs_thread.eve.array.aget(arr,i);
return (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(G__24453,G__24454,G__24455) : f.call(null, G__24453,G__24454,G__24455));
})();
if(cljs.core.reduced_QMARK_(result)){
return cljs.core.deref(result);
} else {
var G__24825 = (i + (1));
var G__24826 = result;
i = G__24825;
acc = G__24826;
continue;
}
} else {
return acc;
}
break;
}
});
/**
 * Map f over array indices, returning a new array of the same type.
 * f is (fn [idx current-val] ...) and must return a value of the right type.
 */
cljs_thread.eve.array.amap = (function cljs_thread$eve$array$amap(arr,f){
var len = arr.length;
var type_kw = cljs_thread.eve.array.subtype__GT_type_kw(arr.subtype_code);
var result = cljs_thread.eve.array.eve_array.cljs$core$IFn$_invoke$arity$2(type_kw,len);
var n__5636__auto___24827 = len;
var i_24828 = (0);
while(true){
if((i_24828 < n__5636__auto___24827)){
cljs_thread.eve.array.aset_BANG_(result,i_24828,(function (){var G__24462 = i_24828;
var G__24463 = cljs_thread.eve.array.aget(arr,i_24828);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__24462,G__24463) : f.call(null, G__24462,G__24463));
})());

var G__24829 = (i_24828 + (1));
i_24828 = G__24829;
continue;
} else {
}
break;
}

return result;
});
/**
 * Map f over array indices in-place, mutating the array.
 * f is (fn [idx current-val] ...).
 * Returns the array.
 */
cljs_thread.eve.array.amap_BANG_ = (function cljs_thread$eve$array$amap_BANG_(arr,f){
var len = arr.length;
var n__5636__auto___24830 = len;
var i_24831 = (0);
while(true){
if((i_24831 < n__5636__auto___24830)){
cljs_thread.eve.array.aset_BANG_(arr,i_24831,(function (){var G__24471 = i_24831;
var G__24472 = cljs_thread.eve.array.aget(arr,i_24831);
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__24471,G__24472) : f.call(null, G__24471,G__24472));
})());

var G__24832 = (i_24831 + (1));
i_24831 = G__24832;
continue;
} else {
}
break;
}

return arr;
});
/**
 * Fill array with value, optionally in range [start, end).
 * Returns the array.
 */
cljs_thread.eve.array.afill_BANG_ = (function cljs_thread$eve$array$afill_BANG_(var_args){
var G__24494 = arguments.length;
switch (G__24494) {
case 2:
return cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (arr,val){
return cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$4(arr,val,(0),arr.length);
}));

(cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (arr,val,start){
return cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$4(arr,val,start,arr.length);
}));

(cljs_thread.eve.array.afill_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (arr,val,start,end){
var len = arr.length;
var end__$1 = (function (){var x__5133__auto__ = end;
var y__5134__auto__ = len;
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})();
var i_24837 = start;
while(true){
if((i_24837 < end__$1)){
cljs_thread.eve.array.aset_BANG_(arr,i_24837,val);

var G__24838 = (i_24837 + (1));
i_24837 = G__24838;
continue;
} else {
}
break;
}

return arr;
}));

(cljs_thread.eve.array.afill_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Copy elements from src to dest array.
 * Both arrays must be the same type.
 * src-start, dest-start default to 0.
 * length defaults to min of remaining space.
 * Returns dest array.
 */
cljs_thread.eve.array.acopy_BANG_ = (function cljs_thread$eve$array$acopy_BANG_(var_args){
var G__24517 = arguments.length;
switch (G__24517) {
case 2:
return cljs_thread.eve.array.acopy_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 5:
return cljs_thread.eve.array.acopy_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.acopy_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (dest,src){
return cljs_thread.eve.array.acopy_BANG_.cljs$core$IFn$_invoke$arity$5(dest,(0),src,(0),(function (){var x__5133__auto__ = cljs.core.count(dest);
var y__5134__auto__ = cljs.core.count(src);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})());
}));

(cljs_thread.eve.array.acopy_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (dest,dest_start,src,src_start,len){
var n__5636__auto___24840 = len;
var i_24841 = (0);
while(true){
if((i_24841 < n__5636__auto___24840)){
cljs_thread.eve.array.aset_BANG_(dest,(dest_start + i_24841),cljs_thread.eve.array.aget(src,(src_start + i_24841)));

var G__24842 = (i_24841 + (1));
i_24841 = G__24842;
continue;
} else {
}
break;
}

return dest;
}));

(cljs_thread.eve.array.acopy_BANG_.cljs$lang$maxFixedArity = 5);

/**
 * Get the underlying SharedArrayBuffer.
 */
cljs_thread.eve.array.get_sab = (function cljs_thread$eve$array$get_sab(arr){
return arr.sab;
});
/**
 * Get the byte offset of the data region into the SAB.
 */
cljs_thread.eve.array.get_offset = (function cljs_thread$eve$array$get_offset(arr){
return arr.offset;
});
/**
 * Get a raw JS typed array view of this array's SAB region.
 * Useful for bulk operations. Handle with care.
 */
cljs_thread.eve.array.get_typed_view = (function cljs_thread$eve$array$get_typed_view(arr){
var view = arr.typed_view;
var base = (arr.offset >>> arr.elem_shift);
return view.subarray(base,(base + arr.length));
});
/**
 * Get a raw Int32Array view of the underlying SAB region.
 * Only valid for :int32 arrays.
 */
cljs_thread.eve.array.get_int32_view = (function cljs_thread$eve$array$get_int32_view(arr){
return (new Int32Array(arr.sab,arr.offset,arr.length));
});
/**
 * Get the block descriptor index for this array.
 */
cljs_thread.eve.array.get_descriptor_idx = (function cljs_thread$eve$array$get_descriptor_idx(arr){
return arr.descriptor_idx;
});
/**
 * Get the type keyword for this array (:int32, :float64, etc.).
 */
cljs_thread.eve.array.array_type = (function cljs_thread$eve$array$array_type(arr){
return cljs_thread.eve.array.subtype__GT_type_kw(arr.subtype_code);
});
/**
 * Mark this array's block as retired for GC.
 * Call when replacing this array with a new version.
 * Returns true if successfully retired, false if already being processed.
 */
cljs_thread.eve.array.retire_BANG_ = (function cljs_thread$eve$array$retire_BANG_(arr){
var temp__5823__auto__ = arr.descriptor_idx;
if(cljs.core.truth_(temp__5823__auto__)){
var desc_idx = temp__5823__auto__;
if((desc_idx >= (0))){
var eve_env = (cljs.core.truth_(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_)?cljs_thread.eve.shared_atom.get_env(cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_):null);
if(cljs.core.truth_(eve_env)){
return cljs_thread.eve.shared_atom.retire_block_BANG_(eve_env,desc_idx);
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
});
/**
 * Fill :int32 array with value using SIMD (4 elements at a time).
 * WARNING: Does not use Atomics. Only use before sharing with other threads.
 */
cljs_thread.eve.array.afill_simd_BANG_ = (function cljs_thread$eve$array$afill_simd_BANG_(var_args){
var G__24554 = arguments.length;
switch (G__24554) {
case 2:
return cljs_thread.eve.array.afill_simd_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs_thread.eve.array.afill_simd_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.afill_simd_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (arr,val){
return cljs_thread.eve.array.afill_simd_BANG_.cljs$core$IFn$_invoke$arity$4(arr,val,(0),arr.length);
}));

(cljs_thread.eve.array.afill_simd_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (arr,val,start,end){
cljs_thread.eve.array.require_int32_BANG_(arr,"afill-simd!");

var offset = arr.offset;
var byte_start = (offset + (start * (4)));
var count = (end - start);
if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((count > (0))))){
cljs_thread.eve.wasm_mem.simd_fill_i32_BANG_(byte_start,count,val);
} else {
}

return arr;
}));

(cljs_thread.eve.array.afill_simd_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Copy elements between :int32 arrays using SIMD (4 elements at a time).
 * WARNING: Does not use Atomics. Only use before sharing with other threads.
 */
cljs_thread.eve.array.acopy_simd_BANG_ = (function cljs_thread$eve$array$acopy_simd_BANG_(var_args){
var G__24565 = arguments.length;
switch (G__24565) {
case 2:
return cljs_thread.eve.array.acopy_simd_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 5:
return cljs_thread.eve.array.acopy_simd_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.acopy_simd_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (dest,src){
return cljs_thread.eve.array.acopy_simd_BANG_.cljs$core$IFn$_invoke$arity$5(dest,(0),src,(0),(function (){var x__5133__auto__ = cljs.core.count(dest);
var y__5134__auto__ = cljs.core.count(src);
return ((x__5133__auto__ < y__5134__auto__) ? x__5133__auto__ : y__5134__auto__);
})());
}));

(cljs_thread.eve.array.acopy_simd_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (dest,dest_start,src,src_start,len){
cljs_thread.eve.array.require_int32_BANG_(dest,"acopy-simd!");

cljs_thread.eve.array.require_int32_BANG_(src,"acopy-simd!");

if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((len > (0))))){
var dest_byte_offset_24847 = (dest.offset + (dest_start * (4)));
var src_byte_offset_24848 = (src.offset + (src_start * (4)));
cljs_thread.eve.wasm_mem.simd_copy_i32_BANG_(dest_byte_offset_24847,src_byte_offset_24848,len);
} else {
}

return dest;
}));

(cljs_thread.eve.array.acopy_simd_BANG_.cljs$lang$maxFixedArity = 5);

/**
 * Sum all elements in :int32 array using SIMD.
 * Safe to use on shared arrays (read-only).
 */
cljs_thread.eve.array.asum_simd = (function cljs_thread$eve$array$asum_simd(var_args){
var G__24577 = arguments.length;
switch (G__24577) {
case 1:
return cljs_thread.eve.array.asum_simd.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return cljs_thread.eve.array.asum_simd.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.asum_simd.cljs$core$IFn$_invoke$arity$1 = (function (arr){
return cljs_thread.eve.array.asum_simd.cljs$core$IFn$_invoke$arity$3(arr,(0),arr.length);
}));

(cljs_thread.eve.array.asum_simd.cljs$core$IFn$_invoke$arity$3 = (function (arr,start,end){
cljs_thread.eve.array.require_int32_BANG_(arr,"asum-simd");

var offset = arr.offset;
var byte_start = (offset + (start * (4)));
var count = (end - start);
if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((count > (0))))){
return cljs_thread.eve.wasm_mem.simd_sum_i32(byte_start,count);
} else {
return (0);
}
}));

(cljs_thread.eve.array.asum_simd.cljs$lang$maxFixedArity = 3);

/**
 * Find minimum value in :int32 array using SIMD.
 * Safe to use on shared arrays (read-only).
 * Returns INT32_MAX for empty arrays.
 */
cljs_thread.eve.array.amin_simd = (function cljs_thread$eve$array$amin_simd(var_args){
var G__24585 = arguments.length;
switch (G__24585) {
case 1:
return cljs_thread.eve.array.amin_simd.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return cljs_thread.eve.array.amin_simd.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.amin_simd.cljs$core$IFn$_invoke$arity$1 = (function (arr){
return cljs_thread.eve.array.amin_simd.cljs$core$IFn$_invoke$arity$3(arr,(0),arr.length);
}));

(cljs_thread.eve.array.amin_simd.cljs$core$IFn$_invoke$arity$3 = (function (arr,start,end){
cljs_thread.eve.array.require_int32_BANG_(arr,"amin-simd");

var offset = arr.offset;
var byte_start = (offset + (start * (4)));
var count = (end - start);
if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((count > (0))))){
return cljs_thread.eve.wasm_mem.simd_min_i32(byte_start,count);
} else {
return (2147483647);
}
}));

(cljs_thread.eve.array.amin_simd.cljs$lang$maxFixedArity = 3);

/**
 * Find maximum value in :int32 array using SIMD.
 * Safe to use on shared arrays (read-only).
 * Returns INT32_MIN for empty arrays.
 */
cljs_thread.eve.array.amax_simd = (function cljs_thread$eve$array$amax_simd(var_args){
var G__24590 = arguments.length;
switch (G__24590) {
case 1:
return cljs_thread.eve.array.amax_simd.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return cljs_thread.eve.array.amax_simd.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs_thread.eve.array.amax_simd.cljs$core$IFn$_invoke$arity$1 = (function (arr){
return cljs_thread.eve.array.amax_simd.cljs$core$IFn$_invoke$arity$3(arr,(0),arr.length);
}));

(cljs_thread.eve.array.amax_simd.cljs$core$IFn$_invoke$arity$3 = (function (arr,start,end){
cljs_thread.eve.array.require_int32_BANG_(arr,"amax-simd");

var offset = arr.offset;
var byte_start = (offset + (start * (4)));
var count = (end - start);
if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((count > (0))))){
return cljs_thread.eve.wasm_mem.simd_max_i32(byte_start,count);
} else {
return (-2147483648);
}
}));

(cljs_thread.eve.array.amax_simd.cljs$lang$maxFixedArity = 3);

/**
 * Compare two :int32 arrays for equality using SIMD.
 * Safe to use on shared arrays (read-only).
 */
cljs_thread.eve.array.aequal_simd_QMARK_ = (function cljs_thread$eve$array$aequal_simd_QMARK_(arr1,arr2){
cljs_thread.eve.array.require_int32_BANG_(arr1,"aequal-simd?");

cljs_thread.eve.array.require_int32_BANG_(arr2,"aequal-simd?");

var len1 = arr1.length;
var len2 = arr2.length;
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(len1,len2)){
return false;
} else {
if(((cljs_thread.eve.wasm_mem.ready_QMARK_()) && ((len1 > (0))))){
return cljs_thread.eve.wasm_mem.simd_eq_i32_QMARK_(arr1.offset,arr2.offset,len1);
} else {
return (len1 === (0));
}
}
});
/**
 * Create an EveArray from a native JS typed array.
 * Copies the data into the SharedArrayBuffer.
 * Supports all standard typed array types including Uint8ClampedArray.
 */
cljs_thread.eve.array.from_typed_array = (function cljs_thread$eve$array$from_typed_array(elem){
var subtype = cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem);
var n = elem.length;
var map__24606 = cljs_thread.eve.array.alloc_eve_region(subtype,n);
var map__24606__$1 = cljs.core.__destructure_map(map__24606);
var sab = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24606__$1,new cljs.core.Keyword(null,"sab","sab",422570093));
var block_start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24606__$1,new cljs.core.Keyword(null,"block-start","block-start",-333036359));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24606__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var descriptor_idx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24606__$1,new cljs.core.Keyword(null,"descriptor-idx","descriptor-idx",-1394352825));
var elem_shift = cljs_thread.eve.array.subtype__GT_elem_shift(subtype);
var atomic = cljs_thread.eve.array.subtype__GT_atomic_QMARK_(subtype);
var view = cljs_thread.eve.array.make_typed_view(sab,subtype);
var base_idx = (offset >>> elem_shift);
var dest = view.subarray(base_idx,(base_idx + n));
dest.set(elem);

return (new cljs_thread.eve.array.EveArray(sab,block_start,offset,n,descriptor_idx,subtype,elem_shift,atomic,view,null,null));
});
cljs_thread.eve.deftype_proto.serialize.set_typed_array_encoder_BANG_((function (elem){
var subtype = cljs_thread.eve.deftype_proto.serialize.typed_array_subtype(elem);
if(cljs.core.truth_((function (){var and__5043__auto__ = subtype;
if(cljs.core.truth_(and__5043__auto__)){
return (subtype <= (11));
} else {
return and__5043__auto__;
}
})())){
var byte_view = (new Uint8Array(elem.buffer,elem.byteOffset,elem.byteLength));
var byte_len = elem.byteLength;
var header_size = (16);
var alloc_size = ((header_size + byte_len) + (15));
var parent_atom = (function (){var or__5045__auto__ = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
}
})();
var eve_env = (cljs.core.truth_(parent_atom)?cljs_thread.eve.shared_atom.get_env(parent_atom):null);
var alloc_result = (cljs.core.truth_(eve_env)?cljs_thread.eve.shared_atom.alloc(eve_env,alloc_size):null);
if(cljs.core.truth_((function (){var and__5043__auto__ = alloc_result;
if(cljs.core.truth_(and__5043__auto__)){
return cljs.core.not(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(alloc_result));
} else {
return and__5043__auto__;
}
})())){
var raw_offset = new cljs.core.Keyword(null,"offset","offset",296498311).cljs$core$IFn$_invoke$arity$1(alloc_result);
var aligned_offset = ((raw_offset + (15)) & (~ (15)));
var sab = new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(eve_env);
var dv = (new DataView(sab));
var u8 = (new Uint8Array(sab));
dv.setUint8(aligned_offset,subtype);

dv.setUint32((aligned_offset + (8)),byte_len,true);

u8.set(byte_view,(aligned_offset + (16)));

return cljs_thread.eve.deftype_proto.serialize.encode_sab_pointer((27),aligned_offset);
} else {
var buf = (new Uint8Array(((8) + byte_len)));
var dv = (new DataView(buf.buffer));
(buf[(0)] = (238));

(buf[(1)] = (219));

(buf[(2)] = (27));

(buf[(3)] = subtype);

dv.setUint32((4),byte_len,true);

buf.set(byte_view,(8));

return buf;
}
} else {
return (new Uint8Array((0)));
}
}));
cljs_thread.eve.deftype_proto.serialize.register_sab_type_constructor_BANG_((28),(function (sab,block_offset){
var sab__$1 = (function (){var or__5045__auto__ = sab;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var temp__5823__auto__ = (function (){var or__5045__auto____$1 = cljs_thread.eve.deftype_proto.data._STAR_parent_atom_STAR_;
if(cljs.core.truth_(or__5045__auto____$1)){
return or__5045__auto____$1;
} else {
return cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_;
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var parent = temp__5823__auto__;
return new cljs.core.Keyword(null,"sab","sab",422570093).cljs$core$IFn$_invoke$arity$1(cljs_thread.eve.shared_atom.get_env(parent));
} else {
return null;
}
}
})();
var dv = (new DataView(sab__$1));
var subtype = dv.getUint8(block_offset);
var elem_count = dv.getUint32((block_offset + (4)),true);
var elem_shift = cljs_thread.eve.array.subtype__GT_elem_shift(subtype);
var align = ((1) << elem_shift);
var raw_data_start = (block_offset + (8));
var data_offset = ((raw_data_start + (align - (1))) & (~ (align - (1))));
var atomic = cljs_thread.eve.array.subtype__GT_atomic_QMARK_(subtype);
var view = cljs_thread.eve.array.make_typed_view(sab__$1,subtype);
return (new cljs_thread.eve.array.EveArray(sab__$1,block_offset,data_offset,elem_count,(-1),subtype,elem_shift,atomic,view,null,null));
}));

//# sourceMappingURL=cljs_thread.eve.array.js.map
