/**
 * Created by forwardNow on 5/10/16.
 *
 * 用途：
 */


+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery", "utils/doT" ], factory );
    } else {
        if ( ! window.jQuery ) {
            throw "space.js depends on jQuery";
        }
        if ( ! window.doT ) {
            throw "space.js depends on doT";
        }

        // 全局模式
        factory( jQuery, doT );
    }
}( function ( $, doT ) {
    "use strict";
    var template
        ;

    $.fn.space = function ( optsOrMethod, args ) {

        this.each( function () {

            var spaceInstance,
                method
            ;

            if ( typeof optsOrMethod == "string" ) { // 调用方法

                spaceInstance = this.spaceInstance;

                if ( ! spaceInstance ) {
                    return ;
                }

                method = spaceInstance[ optsOrMethod ];

                if ( typeof method == "function" ) {
                    method.apply( spaceInstance, args );
                }

                return ;
            }

            // 实例化
            this.spaceInstance = new Space( optsOrMethod, $( this ) );
        } );
    };

    function Space( opts, $target ) {
        this.options = $.extend( {}, $.fn.space.defaults, opts );
        this.$target = $target;
        this.init();
    }

    $.fn.space.defaults = {
        hasIcon: true, // 是否有图标
        hasProgressBar: true , // 是否有进度条
        hasBrief: true, // 是否有说明

        iconRelativePath: ".", // 图片文件路径，如 http://localhost:63342/pkusoft_modules  （不要以“/”结尾）
        iconFileSuffix: ".png", // 图片格式


        spaceMouseOverClass: "space-mouseover", // 光标移动到“空间”时的样式类
        spaceSelectedClass: "space-selected",  // 选中“空间”时的样式类

        spaceGap: "12px", // space 的左外边距
        spaceNumInOneLine: 0, // 每行“空间”的个数

        /* handler */
        spaceClickHandler: null // 单击“空间”后的事件处理程序
    };

    $.extend( Space.prototype, {
        init: function () {
            this.render();
            this.bind();
            this.draw();
        },
        render: function () {
            this.$target.addClass( "property-panel" );
        },
        bind: function () {
            var _this
                ;
            _this = this;

            this.$target
                .on( "click", ".area-heading", function () {
                    var $this,
                        $spaceList,
                        $parent
                    ;
                    $this = $( this );
                    $spaceList = $this.siblings( ".space-list" );
                    $parent = $this.parent();

                    if ( $parent.is( ".active" ) ) {
                        $spaceList.hide();
                        $parent.removeClass( "active" );
                    } else {
                        $spaceList.show();
                        $parent.addClass( "active" );
                    }

                    return false;
                } )
                .on( "click", ".space-item", function () {
                    var handler,
                        spaceSelectedClass
                        ;
                    handler = _this.options.spaceClickHandler;
                    spaceSelectedClass = _this.options.spaceSelectedClass;

                    if ( spaceSelectedClass ) {
                        $( this ).addClass( spaceSelectedClass ).siblings().removeClass( spaceSelectedClass );
                    }

                    if ( typeof handler == "function" ) {
                        // handler.apply( this, null ); // apply 第二个参数为 null 时，IE8- 会报错“缺少对象”
                        handler.apply( this, [] );
                    }
                } )
                .on( "mouseover", ".space-item", function () {
                    var spaceMouseOverClass
                        ;
                    spaceMouseOverClass = _this.options.spaceMouseOverClass;

                    if ( spaceMouseOverClass ) {
                        $( this ).addClass( spaceMouseOverClass );
                    }
                } )
                .on( "mouseout", ".space-item", function () {
                    var spaceMouseOverClass
                        ;
                    spaceMouseOverClass = _this.options.spaceMouseOverClass;

                    if ( spaceMouseOverClass ) {
                        $( this ).removeClass( spaceMouseOverClass );
                    }
                } )
        },
        setData: function( data ) {
            this.options.data = data;
            this.draw();
        },
        draw: function () {
            var html,
                opts,
                $target,
                iconRelativePath,
                iconFileSuffix
                ;
            html = doT.template( template )( this.options.data );
            opts = this.options;
            $target = this.$target;

            $target.html( html );

            // space-icon
            if ( opts.hasIcon ) {
                iconRelativePath = opts.iconRelativePath;
                iconFileSuffix = opts.iconFileSuffix;
                $target.find( ".space-icon img" ).attr( "src", function () {
                    var icon = $( this ).attr( "data-icon" ) || "default";
                    return iconRelativePath + "/" + icon + iconFileSuffix;
                } )
            } else {
                $target.find( ".space-icon" ).remove();
                $target.find( ".space-info" ).css( "width", "100%" );
            }


            // space-width
            if ( opts.spaceNumInOneLine ) {

                var totalWidth,
                    spaceWidth
                    ;

                totalWidth = $target.find( ".property-area" ).eq( 0 ).width() - 20; // 减去滚动条的宽度
                spaceWidth = Math.floor( totalWidth / opts.spaceNumInOneLine ) - ( parseInt( opts.spaceGap ) || 0 );
                $target.find( ".space-item " )
                       .css( "width", function () {
                            var $this = $( this );
                            return spaceWidth - parseInt( $this.css( "border-left-width" ) ) - parseInt( $this.css( "border-right-width" ) );
                        } );

            }

            // space-gap
            $target.find( ".space-item " )
                   .css( "margin-left", opts.spaceGap );

            // space-progressbar hasProgressBar
            if ( ! opts.hasProgressBar ) {
                $target.find( ".progress" ).hide();
            }

            // space-brief hasBrief
            if ( ! opts.hasBrief ) {
                $target.find( ".brief" ).hide();
            }
        }

    } );

    var sampleData = {
        "centerList": [
            {
                "centerId": "0012",
                "center": "青山分局涉案财物仓库12",  // 存放场所
                "areaList": [          // 区域
                    {
                        "area": "收纳箱A",
                        "spaceAmount": "5",
                        "spaceList": [ // 空间
                            {
                                "spaceId": "IDA001",
                                "space": "A001",
                                "quantity": 0,
                                "capacity": 100,
                                "icon": "warning.png"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    template = '\
        {{ for ( var i = 0, len = it.centerList.length; i < len; i++ ) { }}\
            {{  \
                var center = it.centerList[ i ];\
                var areaList = center.areaList;\
            }}\
            <div class="property-center" data-id="{{=center.centerId}}">\
                <h1 class="center-heading">{{=center.center}}</h1>\
                <div class="center-body">\
                    {{ for ( var areaIndex = 0, areaLen = areaList.length; areaIndex < areaLen; areaIndex++ ) { }}\
                        {{\
                            var area = areaList[ areaIndex ];\
                            var spaceList = area.spaceList;\
                        }}\
                        <div class="property-area ">\
                            <h2 class="area-heading">{{=area.area}}<span class="badge">{{=area.spaceAmount}}</span></h2>\
                            <ul class="space-list">\
                                {{ for ( var spaceIndex = 0, spaceLen = spaceList.length; spaceIndex < spaceLen; spaceIndex++ ) { }}\
                                    {{\
                                        var space = spaceList[ spaceIndex ];\
                                        var width = ( space.quantity / space.capacity ) || 0;\
                                    }}\
                                    <li class="space-item" data-id="{{=space.spaceId}}"">\
                                        <table>\
                                            <tr>\
                                                <td class="space-icon"><img data-icon="{{=space.icon || ""}}" alt=""></td>\
                                                <td class="space-info">\
                                                    <h3 class="name">{{=space.space}}</h3>\
                                                    <div class="progress">\
                                                        <div class="progress-inner" style="width: {{=width}}%">{{=width}}%</div>\
                                                    </div>\
                                                    <div class="brief">已存 {{=space.quantity}}，最大存 {{=space.capacity}}</div>\
                                                </td>\
                                            </tr>\
                                        </table>\
                                    </li>\
                                {{ } }}\
                            </ul>\
                        </div>\
                    {{ } }}\
                </div>\
            </div>\
        {{ } }}\
';

} ));

