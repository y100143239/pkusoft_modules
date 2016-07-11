+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery" ], factory );
    } else {
        // 全局模式
        factory( jQuery );
        throw "jquery.pku.autocomplete.js depends on jQuery"
    }
}( function ( $ ) {
    "use strict";

    // 定义插件
    $.fn.autocomplete = function ( options, param ) {
        //  插件方法调用
        if ( typeof options == 'string' ) {
            this.each( function () {
                init( this );
            } );
            return $.fn.autocomplete.methods[ options ]( this, param );
        }
        //  初始化
        return this.each( function () {
            init( this, options );
        } );
    };

    // 默认参数
    $.fn.autocomplete.defaults = {
    };

    // 可调用的方法
    $.fn.autocomplete.methods = {

        options: function ( $jq ) { // 返回第一个target的options参数
            return $.data( $jq[ 0 ], 'loading' ).options;
        },
        show: function ( $jq ) { // 显示
            // 返回 jQuery对象 ，不让链式调用断掉
            return $jq.each( function () {
                $.data( this, "loading" ).$container.show();
            } );
        },
        hide: function ( $jq, args ) { // 隐藏
            // ...
        },
        timer: function ( $jq, args ) { // 设置倒计时后隐藏
            // ...
        },
        destory: function ( $jq ) { // 销毁
            // ...
        }

    };

    // 初始化
    function init( target, options ) {
        var autocomplete,
            opts

            ;
        autocomplete = $.data( target, "autocomplete" );

        // 已被初始化
        if ( autocomplete ) {
            $.extend( autocomplete.options, options );
            return;
        }

        // 初始化

        // 参数
        opts = $.extend( {}, $.fn.autocomplete.defaults, options );
        // 插件相关的参数及数据都绑定到 target DOM元素上
        $.data( target, "autocomplete", { options: opts } );

    }

} ));
