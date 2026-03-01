goog.provide('cljs.repl');
cljs.repl.print_doc = (function cljs$repl$print_doc(p__32228){
var map__32230 = p__32228;
var map__32230__$1 = cljs.core.__destructure_map(map__32230);
var m = map__32230__$1;
var n = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32230__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var nm = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32230__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["-------------------------"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5045__auto__ = new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return [(function (){var temp__5823__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns),"/"].join('');
} else {
return null;
}
})(),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join('');
}
})()], 0));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Protocol"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__32237_32631 = cljs.core.seq(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__32238_32632 = null;
var count__32239_32633 = (0);
var i__32240_32634 = (0);
while(true){
if((i__32240_32634 < count__32239_32633)){
var f_32638 = chunk__32238_32632.cljs$core$IIndexed$_nth$arity$2(null, i__32240_32634);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_32638], 0));


var G__32641 = seq__32237_32631;
var G__32642 = chunk__32238_32632;
var G__32643 = count__32239_32633;
var G__32644 = (i__32240_32634 + (1));
seq__32237_32631 = G__32641;
chunk__32238_32632 = G__32642;
count__32239_32633 = G__32643;
i__32240_32634 = G__32644;
continue;
} else {
var temp__5823__auto___32647 = cljs.core.seq(seq__32237_32631);
if(temp__5823__auto___32647){
var seq__32237_32648__$1 = temp__5823__auto___32647;
if(cljs.core.chunked_seq_QMARK_(seq__32237_32648__$1)){
var c__5568__auto___32649 = cljs.core.chunk_first(seq__32237_32648__$1);
var G__32650 = cljs.core.chunk_rest(seq__32237_32648__$1);
var G__32651 = c__5568__auto___32649;
var G__32652 = cljs.core.count(c__5568__auto___32649);
var G__32653 = (0);
seq__32237_32631 = G__32650;
chunk__32238_32632 = G__32651;
count__32239_32633 = G__32652;
i__32240_32634 = G__32653;
continue;
} else {
var f_32654 = cljs.core.first(seq__32237_32648__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_32654], 0));


var G__32655 = cljs.core.next(seq__32237_32648__$1);
var G__32656 = null;
var G__32657 = (0);
var G__32658 = (0);
seq__32237_32631 = G__32655;
chunk__32238_32632 = G__32656;
count__32239_32633 = G__32657;
i__32240_32634 = G__32658;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_32659 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([arglists_32659], 0));
} else {
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first(arglists_32659)))?cljs.core.second(arglists_32659):arglists_32659)], 0));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Special Form"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m)], 0));

if(cljs.core.contains_QMARK_(m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  Please see http://clojure.org/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))].join('')], 0));
} else {
return null;
}
} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n  Please see http://clojure.org/special_forms#",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join('')], 0));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Macro"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Spec"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["REPL Special Function"], 0));
} else {
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m)], 0));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__32265_32671 = cljs.core.seq(new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__32266_32672 = null;
var count__32267_32673 = (0);
var i__32268_32674 = (0);
while(true){
if((i__32268_32674 < count__32267_32673)){
var vec__32298_32675 = chunk__32266_32672.cljs$core$IIndexed$_nth$arity$2(null, i__32268_32674);
var name_32676 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32298_32675,(0),null);
var map__32301_32677 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32298_32675,(1),null);
var map__32301_32678__$1 = cljs.core.__destructure_map(map__32301_32677);
var doc_32679 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32301_32678__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_32680 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32301_32678__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_32676], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_32680], 0));

if(cljs.core.truth_(doc_32679)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_32679], 0));
} else {
}


var G__32682 = seq__32265_32671;
var G__32684 = chunk__32266_32672;
var G__32685 = count__32267_32673;
var G__32686 = (i__32268_32674 + (1));
seq__32265_32671 = G__32682;
chunk__32266_32672 = G__32684;
count__32267_32673 = G__32685;
i__32268_32674 = G__32686;
continue;
} else {
var temp__5823__auto___32687 = cljs.core.seq(seq__32265_32671);
if(temp__5823__auto___32687){
var seq__32265_32689__$1 = temp__5823__auto___32687;
if(cljs.core.chunked_seq_QMARK_(seq__32265_32689__$1)){
var c__5568__auto___32690 = cljs.core.chunk_first(seq__32265_32689__$1);
var G__32691 = cljs.core.chunk_rest(seq__32265_32689__$1);
var G__32692 = c__5568__auto___32690;
var G__32693 = cljs.core.count(c__5568__auto___32690);
var G__32694 = (0);
seq__32265_32671 = G__32691;
chunk__32266_32672 = G__32692;
count__32267_32673 = G__32693;
i__32268_32674 = G__32694;
continue;
} else {
var vec__32313_32695 = cljs.core.first(seq__32265_32689__$1);
var name_32696 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32313_32695,(0),null);
var map__32316_32697 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32313_32695,(1),null);
var map__32316_32698__$1 = cljs.core.__destructure_map(map__32316_32697);
var doc_32699 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32316_32698__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_32700 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32316_32698__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_32696], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_32700], 0));

if(cljs.core.truth_(doc_32699)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_32699], 0));
} else {
}


var G__32703 = cljs.core.next(seq__32265_32689__$1);
var G__32704 = null;
var G__32705 = (0);
var G__32706 = (0);
seq__32265_32671 = G__32703;
chunk__32266_32672 = G__32704;
count__32267_32673 = G__32705;
i__32268_32674 = G__32706;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(n)){
var temp__5823__auto__ = cljs.spec.alpha.get_spec(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2(cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.ns_name(n)),cljs.core.name(nm)));
if(cljs.core.truth_(temp__5823__auto__)){
var fnspec = temp__5823__auto__;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Spec"], 0));

var seq__32335 = cljs.core.seq(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"args","args",1315556576),new cljs.core.Keyword(null,"ret","ret",-468222814),new cljs.core.Keyword(null,"fn","fn",-1175266204)], null));
var chunk__32336 = null;
var count__32337 = (0);
var i__32338 = (0);
while(true){
if((i__32338 < count__32337)){
var role = chunk__32336.cljs$core$IIndexed$_nth$arity$2(null, i__32338);
var temp__5823__auto___32708__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5823__auto___32708__$1)){
var spec_32710 = temp__5823__auto___32708__$1;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n ",cljs.core.name(role),":"].join(''),cljs.spec.alpha.describe(spec_32710)], 0));
} else {
}


var G__32714 = seq__32335;
var G__32715 = chunk__32336;
var G__32716 = count__32337;
var G__32717 = (i__32338 + (1));
seq__32335 = G__32714;
chunk__32336 = G__32715;
count__32337 = G__32716;
i__32338 = G__32717;
continue;
} else {
var temp__5823__auto____$1 = cljs.core.seq(seq__32335);
if(temp__5823__auto____$1){
var seq__32335__$1 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(seq__32335__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__32335__$1);
var G__32719 = cljs.core.chunk_rest(seq__32335__$1);
var G__32720 = c__5568__auto__;
var G__32721 = cljs.core.count(c__5568__auto__);
var G__32722 = (0);
seq__32335 = G__32719;
chunk__32336 = G__32720;
count__32337 = G__32721;
i__32338 = G__32722;
continue;
} else {
var role = cljs.core.first(seq__32335__$1);
var temp__5823__auto___32723__$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5823__auto___32723__$2)){
var spec_32724 = temp__5823__auto___32723__$2;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n ",cljs.core.name(role),":"].join(''),cljs.spec.alpha.describe(spec_32724)], 0));
} else {
}


var G__32725 = cljs.core.next(seq__32335__$1);
var G__32726 = null;
var G__32727 = (0);
var G__32728 = (0);
seq__32335 = G__32725;
chunk__32336 = G__32726;
count__32337 = G__32727;
i__32338 = G__32728;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Constructs a data representation for a Error with keys:
 *  :cause - root cause message
 *  :phase - error phase
 *  :via - cause chain, with cause keys:
 *           :type - exception class symbol
 *           :message - exception message
 *           :data - ex-data
 *           :at - top stack element
 *  :trace - root cause stack elements
 */
cljs.repl.Error__GT_map = (function cljs$repl$Error__GT_map(o){
var base = (function (t){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),(((t instanceof cljs.core.ExceptionInfo))?new cljs.core.Symbol("cljs.core","ExceptionInfo","cljs.core/ExceptionInfo",701839050,null):(((t instanceof Error))?cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("js",t.name):null
))], null),(function (){var temp__5823__auto__ = cljs.core.ex_message(t);
if(cljs.core.truth_(temp__5823__auto__)){
var msg = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"message","message",-406056002),msg], null);
} else {
return null;
}
})(),(function (){var temp__5823__auto__ = cljs.core.ex_data(t);
if(cljs.core.truth_(temp__5823__auto__)){
var ed = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),ed], null);
} else {
return null;
}
})()], 0));
});
var via = (function (){var via = cljs.core.PersistentVector.EMPTY;
var t = o;
while(true){
if(cljs.core.truth_(t)){
var G__32729 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(via,t);
var G__32730 = cljs.core.ex_cause(t);
via = G__32729;
t = G__32730;
continue;
} else {
return via;
}
break;
}
})();
var root = cljs.core.peek(via);
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"via","via",-1904457336),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(base,via)),new cljs.core.Keyword(null,"trace","trace",-1082747415),null], null),(function (){var temp__5823__auto__ = cljs.core.ex_message(root);
if(cljs.core.truth_(temp__5823__auto__)){
var root_msg = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cause","cause",231901252),root_msg], null);
} else {
return null;
}
})(),(function (){var temp__5823__auto__ = cljs.core.ex_data(root);
if(cljs.core.truth_(temp__5823__auto__)){
var data = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),data], null);
} else {
return null;
}
})(),(function (){var temp__5823__auto__ = new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358).cljs$core$IFn$_invoke$arity$1(cljs.core.ex_data(o));
if(cljs.core.truth_(temp__5823__auto__)){
var phase = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"phase","phase",575722892),phase], null);
} else {
return null;
}
})()], 0));
});
/**
 * Returns an analysis of the phase, error, cause, and location of an error that occurred
 *   based on Throwable data, as returned by Throwable->map. All attributes other than phase
 *   are optional:
 *  :clojure.error/phase - keyword phase indicator, one of:
 *    :read-source :compile-syntax-check :compilation :macro-syntax-check :macroexpansion
 *    :execution :read-eval-result :print-eval-result
 *  :clojure.error/source - file name (no path)
 *  :clojure.error/line - integer line number
 *  :clojure.error/column - integer column number
 *  :clojure.error/symbol - symbol being expanded/compiled/invoked
 *  :clojure.error/class - cause exception class symbol
 *  :clojure.error/cause - cause exception message
 *  :clojure.error/spec - explain-data for spec error
 */
cljs.repl.ex_triage = (function cljs$repl$ex_triage(datafied_throwable){
var map__32417 = datafied_throwable;
var map__32417__$1 = cljs.core.__destructure_map(map__32417);
var via = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32417__$1,new cljs.core.Keyword(null,"via","via",-1904457336));
var trace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32417__$1,new cljs.core.Keyword(null,"trace","trace",-1082747415));
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__32417__$1,new cljs.core.Keyword(null,"phase","phase",575722892),new cljs.core.Keyword(null,"execution","execution",253283524));
var map__32419 = cljs.core.last(via);
var map__32419__$1 = cljs.core.__destructure_map(map__32419);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32419__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32419__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32419__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__32420 = data;
var map__32420__$1 = cljs.core.__destructure_map(map__32420);
var problems = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32420__$1,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814));
var fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32420__$1,new cljs.core.Keyword("cljs.spec.alpha","fn","cljs.spec.alpha/fn",408600443));
var caller = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32420__$1,new cljs.core.Keyword("cljs.spec.test.alpha","caller","cljs.spec.test.alpha/caller",-398302390));
var map__32421 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.first(via));
var map__32421__$1 = cljs.core.__destructure_map(map__32421);
var top_data = map__32421__$1;
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32421__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var G__32449 = phase;
var G__32449__$1 = (((G__32449 instanceof cljs.core.Keyword))?G__32449.fqn:null);
switch (G__32449__$1) {
case "read-source":
var map__32451 = data;
var map__32451__$1 = cljs.core.__destructure_map(map__32451);
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32451__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32451__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var G__32454 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.second(via)),top_data], 0));
var G__32454__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32454,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__32454);
var G__32454__$2 = (cljs.core.truth_((function (){var fexpr__32464 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32464.cljs$core$IFn$_invoke$arity$1 ? fexpr__32464.cljs$core$IFn$_invoke$arity$1(source) : fexpr__32464.call(null, source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__32454__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__32454__$1);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32454__$2,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__32454__$2;
}

break;
case "compile-syntax-check":
case "compilation":
case "macro-syntax-check":
case "macroexpansion":
var G__32465 = top_data;
var G__32465__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32465,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__32465);
var G__32465__$2 = (cljs.core.truth_((function (){var fexpr__32475 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32475.cljs$core$IFn$_invoke$arity$1 ? fexpr__32475.cljs$core$IFn$_invoke$arity$1(source) : fexpr__32475.call(null, source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__32465__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__32465__$1);
var G__32465__$3 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32465__$2,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__32465__$2);
var G__32465__$4 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32465__$3,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__32465__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32465__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__32465__$4;
}

break;
case "read-eval-result":
case "print-eval-result":
var vec__32492 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32492,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32492,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32492,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32492,(3),null);
var G__32502 = top_data;
var G__32502__$1 = (cljs.core.truth_(line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32502,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),line):G__32502);
var G__32502__$2 = (cljs.core.truth_(file)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32502__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file):G__32502__$1);
var G__32502__$3 = (cljs.core.truth_((function (){var and__5043__auto__ = source__$1;
if(cljs.core.truth_(and__5043__auto__)){
return method;
} else {
return and__5043__auto__;
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32502__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null))):G__32502__$2);
var G__32502__$4 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32502__$3,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__32502__$3);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32502__$4,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__32502__$4;
}

break;
case "execution":
var vec__32518 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32518,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32518,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32518,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32518,(3),null);
var file__$1 = cljs.core.first(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__32405_SHARP_){
var or__5045__auto__ = (p1__32405_SHARP_ == null);
if(or__5045__auto__){
return or__5045__auto__;
} else {
var fexpr__32523 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32523.cljs$core$IFn$_invoke$arity$1 ? fexpr__32523.cljs$core$IFn$_invoke$arity$1(p1__32405_SHARP_) : fexpr__32523.call(null, p1__32405_SHARP_));
}
}),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(caller),file], null)));
var err_line = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(caller);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return line;
}
})();
var G__32526 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type], null);
var G__32526__$1 = (cljs.core.truth_(err_line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32526,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),err_line):G__32526);
var G__32526__$2 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32526__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__32526__$1);
var G__32526__$3 = (cljs.core.truth_((function (){var or__5045__auto__ = fn;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
var and__5043__auto__ = source__$1;
if(cljs.core.truth_(and__5043__auto__)){
return method;
} else {
return and__5043__auto__;
}
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32526__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(function (){var or__5045__auto__ = fn;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null));
}
})()):G__32526__$2);
var G__32526__$4 = (cljs.core.truth_(file__$1)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32526__$3,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file__$1):G__32526__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32526__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__32526__$4;
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32449__$1)].join('')));

}
})(),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),phase);
});
/**
 * Returns a string from exception data, as produced by ex-triage.
 *   The first line summarizes the exception phase and location.
 *   The subsequent lines describe the cause.
 */
cljs.repl.ex_str = (function cljs$repl$ex_str(p__32548){
var map__32550 = p__32548;
var map__32550__$1 = cljs.core.__destructure_map(map__32550);
var triage_data = map__32550__$1;
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var symbol = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994));
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890));
var cause = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742));
var spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32550__$1,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595));
var loc = [cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = source;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "<cljs repl>";
}
})()),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5045__auto__ = line;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (1);
}
})()),(cljs.core.truth_(column)?[":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column)].join(''):"")].join('');
var class_name = cljs.core.name((function (){var or__5045__auto__ = class$;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return "";
}
})());
var simple_class = class_name;
var cause_type = ((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["RuntimeException",null,"Exception",null], null), null),simple_class))?"":[" (",simple_class,")"].join(''));
var format = goog.string.format;
var G__32558 = phase;
var G__32558__$1 = (((G__32558 instanceof cljs.core.Keyword))?G__32558.fqn:null);
switch (G__32558__$1) {
case "read-source":
return (format.cljs$core$IFn$_invoke$arity$3 ? format.cljs$core$IFn$_invoke$arity$3("Syntax error reading source at (%s).\n%s\n",loc,cause) : format.call(null, "Syntax error reading source at (%s).\n%s\n",loc,cause));

break;
case "macro-syntax-check":
var G__32561 = "Syntax error macroexpanding %sat (%s).\n%s";
var G__32562 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32563 = loc;
var G__32564 = (cljs.core.truth_(spec)?(function (){var sb__5690__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__32567_32785 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__32568_32786 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__32569_32787 = true;
var _STAR_print_fn_STAR__temp_val__32570_32788 = (function (x__5691__auto__){
return sb__5690__auto__.append(x__5691__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__32569_32787);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__32570_32788);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32541_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__32541_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__32568_32786);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__32567_32785);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5690__auto__);
})():(format.cljs$core$IFn$_invoke$arity$2 ? format.cljs$core$IFn$_invoke$arity$2("%s\n",cause) : format.call(null, "%s\n",cause)));
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__32561,G__32562,G__32563,G__32564) : format.call(null, G__32561,G__32562,G__32563,G__32564));

break;
case "macroexpansion":
var G__32578 = "Unexpected error%s macroexpanding %sat (%s).\n%s\n";
var G__32579 = cause_type;
var G__32580 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32581 = loc;
var G__32582 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32578,G__32579,G__32580,G__32581,G__32582) : format.call(null, G__32578,G__32579,G__32580,G__32581,G__32582));

break;
case "compile-syntax-check":
var G__32585 = "Syntax error%s compiling %sat (%s).\n%s\n";
var G__32586 = cause_type;
var G__32587 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32588 = loc;
var G__32589 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32585,G__32586,G__32587,G__32588,G__32589) : format.call(null, G__32585,G__32586,G__32587,G__32588,G__32589));

break;
case "compilation":
var G__32590 = "Unexpected error%s compiling %sat (%s).\n%s\n";
var G__32591 = cause_type;
var G__32592 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32593 = loc;
var G__32594 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32590,G__32591,G__32592,G__32593,G__32594) : format.call(null, G__32590,G__32591,G__32592,G__32593,G__32594));

break;
case "read-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null, "Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "print-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null, "Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "execution":
if(cljs.core.truth_(spec)){
var G__32600 = "Execution error - invalid arguments to %s at (%s).\n%s";
var G__32601 = symbol;
var G__32602 = loc;
var G__32603 = (function (){var sb__5690__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__32606_32805 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__32607_32806 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__32608_32807 = true;
var _STAR_print_fn_STAR__temp_val__32609_32808 = (function (x__5691__auto__){
return sb__5690__auto__.append(x__5691__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__32608_32807);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__32609_32808);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32542_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__32542_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__32607_32806);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__32606_32805);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5690__auto__);
})();
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__32600,G__32601,G__32602,G__32603) : format.call(null, G__32600,G__32601,G__32602,G__32603));
} else {
var G__32616 = "Execution error%s at %s(%s).\n%s\n";
var G__32617 = cause_type;
var G__32618 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32619 = loc;
var G__32620 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32616,G__32617,G__32618,G__32619,G__32620) : format.call(null, G__32616,G__32617,G__32618,G__32619,G__32620));
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32558__$1)].join('')));

}
});
cljs.repl.error__GT_str = (function cljs$repl$error__GT_str(error){
return cljs.repl.ex_str(cljs.repl.ex_triage(cljs.repl.Error__GT_map(error)));
});

//# sourceMappingURL=cljs.repl.js.map
