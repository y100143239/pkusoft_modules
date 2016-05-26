/**
 * Created by forwardNow on 5/10/16.
 *
 * 用途：
 *      遮罩某个元素，可设置loading动画，可设置倒计时，可设置文字。
 */


+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery" ], factory );
    } else {
        // 全局模式
        factory( jQuery );
        throw "loading.js depends on jQuery"
    }
}( function ( $ ) {
    "use strict";

    $.fn.loading = function ( options, param ) {

        if ( typeof options == 'string' ) {
            this.each( function () {
                init( this );
            } );
            return $.fn.loading.methods[ options ]( this, param );
        }

        return this.each( function () {
            init( this, options );
        } );
    };

    // 默认参数
    $.fn.loading.defaults = {
        gif: null, // gif 图片路径，使用绝对路径；默认使用 loading_60x60.gif
        text: "Loading...", // loading时显示的文字
        timer: 0 // 显示倒计时，单位为秒；小于等于0时不显示倒计时
    };

    // 可调用的方法
    $.fn.loading.methods = {

        options: function ( $jq ) { // 返回第一个target的options参数
            return $.data( $jq[ 0 ], 'loading' ).options;
        },
        show: function ( $jq ) { // 显示
            return $jq.each( function () {
                $.data( this, "loading" ).$container.show();
            } );
        },
        hide: function ( $jq, args ) { // 隐藏
            var delay
            ;
            delay = ( args && args.delay ) || 0;
            return $jq.each( function () {
                var _this
                    ;
                _this = this;
                setTimeout( function () {
                    $.data( _this, "loading" ).$container.hide();
                }, delay * 1000 );
            } );
        },
        timer: function ( $jq, args ) { // 设置倒计时后隐藏
            return $jq.each( function () {
                var timer
                    ;
                timer = args && args.timer;

                $.data( this, "loading" ).$container.show();

                setTimer( this, timer );

            } );
        },
        destory: function ( $jq ) { // 销毁
            return $jq.each( function () {
                $.data( this, "loading" ).$container.remove();
                $.data( this, "loading", undefined );
            } );
        }
    };

    /**
     * 初始化，给 target 绑定插件相关的参数
     * @param target
     * @param options
     */
    function init( target, options ) {
        var loading,
            opts

            ;
        loading = $.data( target, "loading" );

        // 已被初始化
        if ( loading ) {
            $.extend( loading.options, options );
            return;
        }

        // 初始化

        // 参数
        opts = $.extend( {}, $.fn.loading.defaults, options );
        $.data( target, "loading", { options: opts } );

        settingLoading( target, opts );

    }

    function settingLoading( target ) {
        var loading,
            $container,
            $target,
            $text,
            $counter,
            timer
            ;
        // 添加loading代码
        $target = $( target );
        loading = $.data( target, "loading" );
        $container = $( getHtml() );
        $text = $container.find( ".pku-loading-text" );
        $counter = $container.find( ".pku-loading-counter" );
        timer = loading.options.timer;

        loading.$container = $container;
        loading.$text = $text;
        loading.$counter = $counter;

        $target
            .addClass( "pku-loading" )
            .css( "position", function ( index, oldValue ) {
                if ( $target.is( "body, html" ) ) {
                    $container.css( "position", "fixed" );
                    return oldValue;
                }
                if ( oldValue == "static" ) {
                    return "relative";
                }
                return oldValue;
            } )
            .append( $container );

        // 设置loading图
        if ( loading.options.gif ) {
            $container.find( ".pku-loading-gif" ).css( "background-image", "url(" + loading.options.gif + ")" );
        }

        // 添加显示的文字text
        if ( loading.options.text ) {
            $text.text( loading.options.text );
        }

        // 设置倒计时
        if ( timer ) {
            setTimer( target, timer );
        }
    }

    function setTimer( target, _timer ) {
        var loading,
            $counter,
            $container,
            timer
            ;
        loading = $.data( target, "loading" );
        $container = loading.$container;
        $counter = loading.$counter;
        timer = _timer || loading.options.timer;

        $counter.text( timer );
        invoke( function () {
            $counter.text( --timer );
        }, 0, 1000, timer * 1000, function () {
            $container.hide();
        } );
    }

    function getHtml() {
        return '\
            <div class="pku-loading-container">\
                <div class="pku-loading-overlay"></div>\
                <div class="pku-loading-gif"></div>\
                <div class="pku-loading-counter"></div>\
                <div class="pku-loading-text"></div>\
            </div>'
    }

    function invoke( f, start, interval, end, endCallback ) {
        if ( !start ) start = 0;// Default to 0 ms
        if ( arguments.length <= 2 ) {// Single-invocation case
            setTimeout( f, start );// Single invocation after start ms.
        } else { // Multiple invocation case
            setTimeout( function () { // Invoked by the timeout above
                var h = setInterval( f, interval ); // Invoke f every interval ms. // And stop invoking after end ms, if end is defined
                if ( end ) {
                    setTimeout( function () {
                        clearInterval( h );
                        endCallback && endCallback();
                    }, end );
                }
            }, start ); // Repetitions begin in start ms
        }
    }

} ));

