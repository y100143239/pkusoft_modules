/**
 * Created by forwardNow on 5/10/16.
 *
 * 用途：
 *      遮罩某个元素，可设置loading动画，可设置倒计时，可设置文字。
 *      loading完毕后有提示。
 */


+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery" ], factory );
    } else {
        // 全局模式
        factory( jQuery );
        throw "loading depends on jQuery"
    }
}( function ( $ ) {
    "use strict";

    $.fn.loading = function ( opts ) {
        this.each( function () {
            new Loading( $( this ), opts );
        } );
    };

    function Loading( $target, opts ) {
        this.$target = $target;
        this.opts = $.extend( {}, $.fn.loading.defaults, opts );
        this.init();
    }

    $.fn.loading.defaults = {
        gif: null, // gif 图片路径，使用绝对路径；默认使用 loading_100x100.gif
        text: "Loading", // loading时显示的文字
        timer: 0 // 显示倒计时，单位为秒；小于等于0时不显示倒计时
    };

} ));

