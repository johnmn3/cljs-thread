goog.provide('cljs_thread.env');
cljs_thread.env.in_screen_QMARK_ = (function cljs_thread$env$in_screen_QMARK_(){
return cljs_thread.platform.in_screen_QMARK_();
});
cljs_thread.env.data = cljs_thread.platform.init_data();
cljs_thread.env.in_root_QMARK_ = (function cljs_thread$env$in_root_QMARK_(){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"root","root",-448657453));
});
cljs_thread.env.in_sw_QMARK_ = (function cljs_thread$env$in_sw_QMARK_(){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"sw","sw",833113913));
});
cljs_thread.env.in_core_QMARK_ = (function cljs_thread$env$in_core_QMARK_(){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"core","core",-86019209));
});
cljs_thread.env.in_future_QMARK_ = (function cljs_thread$env$in_future_QMARK_(){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(cljs_thread.env.data),new cljs.core.Keyword(null,"future","future",1877842724));
});
cljs_thread.env.in_branch_QMARK_ = (function cljs_thread$env$in_branch_QMARK_(){
return ((cljs.core.not(cljs_thread.env.in_screen_QMARK_())) && ((!(cljs_thread.env.in_root_QMARK_()))));
});
cljs_thread.env.current_browser = cljs_thread.util.browser_type();

//# sourceMappingURL=cljs_thread.env.js.map
