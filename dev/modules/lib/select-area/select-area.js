/*
define( [ "jquery" ], function ($){

    var $tabs,
        $contents
        ;

    $tabs = $( ".city-select-tab > a" );
    $contents = $( ".city-select" );

    $tabs.on( "click", function () {

        var $this,
            content
            ;

        $this = $( this );

        content = $this.data( "attrCont" );
        $this.addClass( "active" ).siblings().removeClass( "active" );
        $contents.filter( "." + content ).show().siblings().hide();

        return false;
    } );


    $.ajax( {
        method: "GET",
        dataType: "json",
        url: "./pages/widget/DIC_CODE_SIMPLE.json",
        success: function ( data ) {
            processData( data );
        }
    } );

    function processData( data ) {
        console.info( data );
    }
} );
*/


+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery", "select-area-data" ], factory );
    } else {
        // 全局模式
        factory( jQuery );
        throw "select-area.js depends on jQuery"
    }
}( function ( $, data ) {
    "use strict";

    var Utils;

    // 定义插件
    $.fn.selectArea = function ( options, param ) {
        //  插件方法调用
        if ( typeof options == 'string' ) {
            this.each( function () {
                init( this );
            } );
            return $.fn.selectArea.methods[ options ]( this, param );
        }
        //  初始化
        return this.each( function () {
            init( this, options );
        } );
    };

    // 默认参数
    $.fn.selectArea.defaults = {
    };

    // 可调用的方法
    $.fn.selectArea.methods = {

        options: function ( $jq ) { // 返回第一个target的options参数
            return $.data( $jq[ 0 ], 'selectArea' ).options;
        },
        show: function ( $jq ) { // 显示
            // 返回 jQuery对象 ，不让链式调用断掉
            return $jq.each( function () {
                $.data( this, "selectArea" ).$container.show();
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
        var selectArea,
            opts

            ;
        selectArea = $.data( target, "selectArea" );

        // 已被初始化
        if ( selectArea ) {
            $.extend( selectArea.options, options );
            return;
        }

        // 初始化

        // 参数
        opts = $.extend( {}, $.fn.selectArea.defaults, options );
        // 插件相关的参数及数据都绑定到 target DOM元素上
        $.data( target, "selectArea", { options: opts } );

        settingSelectArea( target, opts );

    }

    function settingSelectArea( target, opts ) {
        var cache,
            $container,
            $tab,
            $provincePanel,
            $provinceDataContainer,
            $cityPanel,
            $cityDataContainer,
            $districtPanel,
            $districtDataContainer
            ;

        cache = {
            province: { code: null, text: null },
            city: { code: null, text: null },
            district: { code: null, text: null }
        };
        //
        $container = $( target );
        $tab = $container.find( ".city-select-tab > a " );
        $provinceDataContainer = $container.find( ".city-province dd" );
        $cityDataContainer = $container.find( ".city-select-city dd" );
        $districtDataContainer = $container.find( ".city-select-district dd" );

        // 初始化 面板-省
        for ( var i = 0, len = data.length; i < len; i++ ) {
            var province,
                code,
                text
                ;
            province = data[ i ];
            code = province[ "code" ];
            text = province[ "text" ];
            $provinceDataContainer.append( '<a title="'+text+'" data-id="'+code+'" href="javascript:void(0);">'+text+'</a>' );
        }

        // 事件处理：tab 切换
        $tab.on( "click", function () {
            var $this,
                $panel
                ;
            $this = $( this );
            $panel = $container.find( $this.data( "cont" ) );
            $this.addClass( "active" ).siblings().removeClass( "active" );
            $panel.show().siblings().hide();
            return false;
        } );


        // 事件处理：点击省后，初始化 面板-市
        $container.on( "click", ".city-province a, .city-city a", function () {
            var $this,
                code,
                parent,
                childList,
                $panel,
                $panelDataContainer
                ;

            $this = $( this );
            code = $this.data( "id" );

            parent = Utils.getByCode( code );
            childList = Utils.getChildList( code );
            $panel = $( ".city-" + Utils._whichCode( code ), $container ).next();
            $panelDataContainer = $panel.find( "dd" );

            $this.addClass( "active" ).siblings().removeClass( "active" );

            // 先清空
            Utils.cleanPanel(code, $cityDataContainer, $districtDataContainer);

            for ( var i = 0, len = childList.length; i < len; i++ ) {
                var child,
                    code_,
                    text
                    ;
                child = childList[ i ];
                code_ = child[ "code" ];
                text = child[ "text" ];
                $panelDataContainer.append( '<a title="'+text+'" data-id="'+code_+'" href="javascript:void(0);">'+text+'</a>' );
            }

            // 切换 tab
            $tab.eq( $panel.index() ).trigger( "click" );

            return false;
        } );
    }

    Utils = {
        cleanPanel: function ( code, $cityDataContainer, $districtDataContainer ) {

            switch( this._whichCode( code ) ) {
                // 点击 省面板，清空 市面板、县区面板
                case "province": {
                    $cityDataContainer.empty();
                    $districtDataContainer.empty();
                    break;
                }
                // 点击 市面板，清空 市面板
                case "city": {
                    $districtDataContainer.empty();
                    break;
                }
            }

        },
        getByCode: function ( code ) {
            if (  typeof code == "number" ) {
                code = code + "";
            }
            switch( this._whichCode( code ) ) {
                case "province": {
                    return this._getProvince( code );
                }
                case "city": {
                    return this._getCity( code );
                }
                case "district": {

                }
            }
        },
        getChildList: function ( code ) {
            var parent
                ;
            parent = this.getByCode( code );
            for( var key in parent ) {
                if ( ! parent.hasOwnProperty( key ) ) {
                    continue;
                }
                if ( key.indexOf( "List" ) != -1 ) {
                    return parent[ key ];
                }
            }
            return null;
        },
        _whichCode: function ( code ) {
            if (  typeof code == "number" ) {
                code = code + "";
            }
            if ( code.match( /^[0-9]{2}0{4}$/ ) ) {
                return "province";
            }
            if ( code.match( /^[0-9]{4}0{2}$/ ) ) {
                return "city";
            }
            return "district";
        },
        _getProvince: function ( provinceCode ) {
            for ( var i = 0, len = data.length; i < len; i++  ) {
                if ( data[ i ][ "code" ] == provinceCode ) {
                    return data[ i ];
                }
            }
        },
        _getCity: function ( cityCode ) {
            var provinceCode,
                province,
                cityList
                ;

            provinceCode = cityCode.substring( 0, 2 ) + "0000";
            province = this._getProvince( provinceCode );
            cityList = province.cityList;

            for ( var i = 0, len = cityList.length; i < len; i++  ) {
                if ( cityList[ i ].code == cityCode ) {
                    return cityList[ i ];
                }
            }
        }
    };

} ));

