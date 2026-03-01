goog.provide('cljs.repl');
cljs.repl.print_doc = (function cljs$repl$print_doc(p__32254){
var map__32255 = p__32254;
var map__32255__$1 = cljs.core.__destructure_map(map__32255);
var m = map__32255__$1;
var n = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32255__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var nm = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32255__$1,new cljs.core.Keyword(null,"name","name",1843675177));
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
var seq__32262_32661 = cljs.core.seq(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__32263_32662 = null;
var count__32264_32663 = (0);
var i__32265_32664 = (0);
while(true){
if((i__32265_32664 < count__32264_32663)){
var f_32666 = chunk__32263_32662.cljs$core$IIndexed$_nth$arity$2(null, i__32265_32664);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_32666], 0));


var G__32667 = seq__32262_32661;
var G__32668 = chunk__32263_32662;
var G__32669 = count__32264_32663;
var G__32670 = (i__32265_32664 + (1));
seq__32262_32661 = G__32667;
chunk__32263_32662 = G__32668;
count__32264_32663 = G__32669;
i__32265_32664 = G__32670;
continue;
} else {
var temp__5823__auto___32672 = cljs.core.seq(seq__32262_32661);
if(temp__5823__auto___32672){
var seq__32262_32673__$1 = temp__5823__auto___32672;
if(cljs.core.chunked_seq_QMARK_(seq__32262_32673__$1)){
var c__5568__auto___32674 = cljs.core.chunk_first(seq__32262_32673__$1);
var G__32675 = cljs.core.chunk_rest(seq__32262_32673__$1);
var G__32676 = c__5568__auto___32674;
var G__32677 = cljs.core.count(c__5568__auto___32674);
var G__32678 = (0);
seq__32262_32661 = G__32675;
chunk__32263_32662 = G__32676;
count__32264_32663 = G__32677;
i__32265_32664 = G__32678;
continue;
} else {
var f_32680 = cljs.core.first(seq__32262_32673__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_32680], 0));


var G__32682 = cljs.core.next(seq__32262_32673__$1);
var G__32683 = null;
var G__32684 = (0);
var G__32685 = (0);
seq__32262_32661 = G__32682;
chunk__32263_32662 = G__32683;
count__32264_32663 = G__32684;
i__32265_32664 = G__32685;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_32688 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__5045__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([arglists_32688], 0));
} else {
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first(arglists_32688)))?cljs.core.second(arglists_32688):arglists_32688)], 0));
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
var seq__32283_32694 = cljs.core.seq(new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__32284_32695 = null;
var count__32285_32696 = (0);
var i__32286_32697 = (0);
while(true){
if((i__32286_32697 < count__32285_32696)){
var vec__32311_32698 = chunk__32284_32695.cljs$core$IIndexed$_nth$arity$2(null, i__32286_32697);
var name_32699 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32311_32698,(0),null);
var map__32314_32700 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32311_32698,(1),null);
var map__32314_32701__$1 = cljs.core.__destructure_map(map__32314_32700);
var doc_32702 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32314_32701__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_32703 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32314_32701__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_32699], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_32703], 0));

if(cljs.core.truth_(doc_32702)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_32702], 0));
} else {
}


var G__32706 = seq__32283_32694;
var G__32707 = chunk__32284_32695;
var G__32708 = count__32285_32696;
var G__32709 = (i__32286_32697 + (1));
seq__32283_32694 = G__32706;
chunk__32284_32695 = G__32707;
count__32285_32696 = G__32708;
i__32286_32697 = G__32709;
continue;
} else {
var temp__5823__auto___32713 = cljs.core.seq(seq__32283_32694);
if(temp__5823__auto___32713){
var seq__32283_32714__$1 = temp__5823__auto___32713;
if(cljs.core.chunked_seq_QMARK_(seq__32283_32714__$1)){
var c__5568__auto___32715 = cljs.core.chunk_first(seq__32283_32714__$1);
var G__32716 = cljs.core.chunk_rest(seq__32283_32714__$1);
var G__32717 = c__5568__auto___32715;
var G__32718 = cljs.core.count(c__5568__auto___32715);
var G__32719 = (0);
seq__32283_32694 = G__32716;
chunk__32284_32695 = G__32717;
count__32285_32696 = G__32718;
i__32286_32697 = G__32719;
continue;
} else {
var vec__32324_32720 = cljs.core.first(seq__32283_32714__$1);
var name_32721 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32324_32720,(0),null);
var map__32327_32722 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32324_32720,(1),null);
var map__32327_32723__$1 = cljs.core.__destructure_map(map__32327_32722);
var doc_32724 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32327_32723__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_32725 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32327_32723__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_32721], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_32725], 0));

if(cljs.core.truth_(doc_32724)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_32724], 0));
} else {
}


var G__32726 = cljs.core.next(seq__32283_32714__$1);
var G__32727 = null;
var G__32728 = (0);
var G__32729 = (0);
seq__32283_32694 = G__32726;
chunk__32284_32695 = G__32727;
count__32285_32696 = G__32728;
i__32286_32697 = G__32729;
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

var seq__32333 = cljs.core.seq(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"args","args",1315556576),new cljs.core.Keyword(null,"ret","ret",-468222814),new cljs.core.Keyword(null,"fn","fn",-1175266204)], null));
var chunk__32334 = null;
var count__32335 = (0);
var i__32336 = (0);
while(true){
if((i__32336 < count__32335)){
var role = chunk__32334.cljs$core$IIndexed$_nth$arity$2(null, i__32336);
var temp__5823__auto___32737__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5823__auto___32737__$1)){
var spec_32738 = temp__5823__auto___32737__$1;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n ",cljs.core.name(role),":"].join(''),cljs.spec.alpha.describe(spec_32738)], 0));
} else {
}


var G__32739 = seq__32333;
var G__32740 = chunk__32334;
var G__32741 = count__32335;
var G__32742 = (i__32336 + (1));
seq__32333 = G__32739;
chunk__32334 = G__32740;
count__32335 = G__32741;
i__32336 = G__32742;
continue;
} else {
var temp__5823__auto____$1 = cljs.core.seq(seq__32333);
if(temp__5823__auto____$1){
var seq__32333__$1 = temp__5823__auto____$1;
if(cljs.core.chunked_seq_QMARK_(seq__32333__$1)){
var c__5568__auto__ = cljs.core.chunk_first(seq__32333__$1);
var G__32744 = cljs.core.chunk_rest(seq__32333__$1);
var G__32745 = c__5568__auto__;
var G__32746 = cljs.core.count(c__5568__auto__);
var G__32747 = (0);
seq__32333 = G__32744;
chunk__32334 = G__32745;
count__32335 = G__32746;
i__32336 = G__32747;
continue;
} else {
var role = cljs.core.first(seq__32333__$1);
var temp__5823__auto___32748__$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5823__auto___32748__$2)){
var spec_32749 = temp__5823__auto___32748__$2;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([["\n ",cljs.core.name(role),":"].join(''),cljs.spec.alpha.describe(spec_32749)], 0));
} else {
}


var G__32750 = cljs.core.next(seq__32333__$1);
var G__32751 = null;
var G__32752 = (0);
var G__32753 = (0);
seq__32333 = G__32750;
chunk__32334 = G__32751;
count__32335 = G__32752;
i__32336 = G__32753;
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
var G__32762 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(via,t);
var G__32763 = cljs.core.ex_cause(t);
via = G__32762;
t = G__32763;
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
var map__32438 = datafied_throwable;
var map__32438__$1 = cljs.core.__destructure_map(map__32438);
var via = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32438__$1,new cljs.core.Keyword(null,"via","via",-1904457336));
var trace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32438__$1,new cljs.core.Keyword(null,"trace","trace",-1082747415));
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__32438__$1,new cljs.core.Keyword(null,"phase","phase",575722892),new cljs.core.Keyword(null,"execution","execution",253283524));
var map__32439 = cljs.core.last(via);
var map__32439__$1 = cljs.core.__destructure_map(map__32439);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32439__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32439__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32439__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__32440 = data;
var map__32440__$1 = cljs.core.__destructure_map(map__32440);
var problems = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32440__$1,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814));
var fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32440__$1,new cljs.core.Keyword("cljs.spec.alpha","fn","cljs.spec.alpha/fn",408600443));
var caller = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32440__$1,new cljs.core.Keyword("cljs.spec.test.alpha","caller","cljs.spec.test.alpha/caller",-398302390));
var map__32441 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.first(via));
var map__32441__$1 = cljs.core.__destructure_map(map__32441);
var top_data = map__32441__$1;
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32441__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var G__32457 = phase;
var G__32457__$1 = (((G__32457 instanceof cljs.core.Keyword))?G__32457.fqn:null);
switch (G__32457__$1) {
case "read-source":
var map__32467 = data;
var map__32467__$1 = cljs.core.__destructure_map(map__32467);
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32467__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32467__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var G__32468 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.second(via)),top_data], 0));
var G__32468__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32468,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__32468);
var G__32468__$2 = (cljs.core.truth_((function (){var fexpr__32479 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32479.cljs$core$IFn$_invoke$arity$1 ? fexpr__32479.cljs$core$IFn$_invoke$arity$1(source) : fexpr__32479.call(null, source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__32468__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__32468__$1);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32468__$2,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__32468__$2;
}

break;
case "compile-syntax-check":
case "compilation":
case "macro-syntax-check":
case "macroexpansion":
var G__32499 = top_data;
var G__32499__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32499,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__32499);
var G__32499__$2 = (cljs.core.truth_((function (){var fexpr__32502 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32502.cljs$core$IFn$_invoke$arity$1 ? fexpr__32502.cljs$core$IFn$_invoke$arity$1(source) : fexpr__32502.call(null, source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__32499__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__32499__$1);
var G__32499__$3 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32499__$2,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__32499__$2);
var G__32499__$4 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32499__$3,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__32499__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32499__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__32499__$4;
}

break;
case "read-eval-result":
case "print-eval-result":
var vec__32510 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32510,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32510,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32510,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32510,(3),null);
var G__32514 = top_data;
var G__32514__$1 = (cljs.core.truth_(line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32514,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),line):G__32514);
var G__32514__$2 = (cljs.core.truth_(file)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32514__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file):G__32514__$1);
var G__32514__$3 = (cljs.core.truth_((function (){var and__5043__auto__ = source__$1;
if(cljs.core.truth_(and__5043__auto__)){
return method;
} else {
return and__5043__auto__;
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32514__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null))):G__32514__$2);
var G__32514__$4 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32514__$3,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__32514__$3);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32514__$4,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__32514__$4;
}

break;
case "execution":
var vec__32541 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32541,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32541,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32541,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32541,(3),null);
var file__$1 = cljs.core.first(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__32416_SHARP_){
var or__5045__auto__ = (p1__32416_SHARP_ == null);
if(or__5045__auto__){
return or__5045__auto__;
} else {
var fexpr__32554 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__32554.cljs$core$IFn$_invoke$arity$1 ? fexpr__32554.cljs$core$IFn$_invoke$arity$1(p1__32416_SHARP_) : fexpr__32554.call(null, p1__32416_SHARP_));
}
}),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(caller),file], null)));
var err_line = (function (){var or__5045__auto__ = new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(caller);
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return line;
}
})();
var G__32558 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type], null);
var G__32558__$1 = (cljs.core.truth_(err_line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32558,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),err_line):G__32558);
var G__32558__$2 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32558__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__32558__$1);
var G__32558__$3 = (cljs.core.truth_((function (){var or__5045__auto__ = fn;
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
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32558__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(function (){var or__5045__auto__ = fn;
if(cljs.core.truth_(or__5045__auto__)){
return or__5045__auto__;
} else {
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null));
}
})()):G__32558__$2);
var G__32558__$4 = (cljs.core.truth_(file__$1)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32558__$3,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file__$1):G__32558__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32558__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__32558__$4;
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32457__$1)].join('')));

}
})(),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),phase);
});
/**
 * Returns a string from exception data, as produced by ex-triage.
 *   The first line summarizes the exception phase and location.
 *   The subsequent lines describe the cause.
 */
cljs.repl.ex_str = (function cljs$repl$ex_str(p__32566){
var map__32567 = p__32566;
var map__32567__$1 = cljs.core.__destructure_map(map__32567);
var triage_data = map__32567__$1;
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var symbol = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994));
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890));
var cause = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742));
var spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32567__$1,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595));
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
var G__32581 = phase;
var G__32581__$1 = (((G__32581 instanceof cljs.core.Keyword))?G__32581.fqn:null);
switch (G__32581__$1) {
case "read-source":
return (format.cljs$core$IFn$_invoke$arity$3 ? format.cljs$core$IFn$_invoke$arity$3("Syntax error reading source at (%s).\n%s\n",loc,cause) : format.call(null, "Syntax error reading source at (%s).\n%s\n",loc,cause));

break;
case "macro-syntax-check":
var G__32583 = "Syntax error macroexpanding %sat (%s).\n%s";
var G__32584 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32585 = loc;
var G__32586 = (cljs.core.truth_(spec)?(function (){var sb__5690__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__32593_32812 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__32594_32813 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__32595_32814 = true;
var _STAR_print_fn_STAR__temp_val__32596_32815 = (function (x__5691__auto__){
return sb__5690__auto__.append(x__5691__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__32595_32814);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__32596_32815);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32564_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__32564_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__32594_32813);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__32593_32812);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5690__auto__);
})():(format.cljs$core$IFn$_invoke$arity$2 ? format.cljs$core$IFn$_invoke$arity$2("%s\n",cause) : format.call(null, "%s\n",cause)));
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__32583,G__32584,G__32585,G__32586) : format.call(null, G__32583,G__32584,G__32585,G__32586));

break;
case "macroexpansion":
var G__32599 = "Unexpected error%s macroexpanding %sat (%s).\n%s\n";
var G__32600 = cause_type;
var G__32601 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32602 = loc;
var G__32603 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32599,G__32600,G__32601,G__32602,G__32603) : format.call(null, G__32599,G__32600,G__32601,G__32602,G__32603));

break;
case "compile-syntax-check":
var G__32604 = "Syntax error%s compiling %sat (%s).\n%s\n";
var G__32605 = cause_type;
var G__32606 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32607 = loc;
var G__32608 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32604,G__32605,G__32606,G__32607,G__32608) : format.call(null, G__32604,G__32605,G__32606,G__32607,G__32608));

break;
case "compilation":
var G__32609 = "Unexpected error%s compiling %sat (%s).\n%s\n";
var G__32610 = cause_type;
var G__32611 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32612 = loc;
var G__32613 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32609,G__32610,G__32611,G__32612,G__32613) : format.call(null, G__32609,G__32610,G__32611,G__32612,G__32613));

break;
case "read-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null, "Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "print-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null, "Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "execution":
if(cljs.core.truth_(spec)){
var G__32617 = "Execution error - invalid arguments to %s at (%s).\n%s";
var G__32618 = symbol;
var G__32619 = loc;
var G__32620 = (function (){var sb__5690__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__32622_32831 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__32623_32832 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__32624_32833 = true;
var _STAR_print_fn_STAR__temp_val__32625_32834 = (function (x__5691__auto__){
return sb__5690__auto__.append(x__5691__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__32624_32833);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__32625_32834);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32565_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__32565_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__32623_32832);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__32622_32831);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5690__auto__);
})();
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__32617,G__32618,G__32619,G__32620) : format.call(null, G__32617,G__32618,G__32619,G__32620));
} else {
var G__32635 = "Execution error%s at %s(%s).\n%s\n";
var G__32636 = cause_type;
var G__32637 = (cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):"");
var G__32638 = loc;
var G__32639 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__32635,G__32636,G__32637,G__32638,G__32639) : format.call(null, G__32635,G__32636,G__32637,G__32638,G__32639));
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32581__$1)].join('')));

}
});
cljs.repl.error__GT_str = (function cljs$repl$error__GT_str(error){
return cljs.repl.ex_str(cljs.repl.ex_triage(cljs.repl.Error__GT_map(error)));
});

//# sourceMappingURL=cljs.repl.js.map
