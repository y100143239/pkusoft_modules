/**
 * 该JS的作用
 * 1. requirejs的配置
 * 2. 根据HTML的 data-pku-widget 属性来载入相应插件，并渲染
 */
+function () {
    "use strict";
    var VERSION,
        DEV_MODE,
        MODULES,
        PKUI
        ;

    PKUI = {}; // 名称空间
    window.PKUI = PKUI;

    DEV_MODE = false;
    VERSION = DEV_MODE ? (new Date()).getTime() : "v0.20161013";
    require.config( {
        urlArgs: "VERSION=" + VERSION,
        paths: {
            "jquery": "jquery/jquery-1.11.3",
            "xDomainRequest": "jquery/jQuery.XDomainRequest",
            "ajaxQueue": "jquery/jQuery.ajaxQueue",
            "doT": "utils/doT",
            "draggable": "utils/draggable",
            "bootstrap": "lib/bootstrap/js/bootstrap",

            "datepicker": "lib/datepicker/js/bootstrap-datepicker-zh.fix",

            "select2": "lib/select2/js/select2.full.fix",

            "echarts": "lib/echart/echarts.min",
            "echartsTheme": "lib/echart/theme/macarons",
            "echartsChinaMap": "lib/echart/map/china",

            "formvalidation": "lib/formvalidate/js/formValidation.fix",
            "formvalidationBs": "lib/formvalidate/js/framework/bootstrap.fix",
            "formvalidationI18N": "lib/formvalidate/js/language/zh_CN",

            "webuploader": "lib/webuploader/js/webuploader.fix",

            "bootgrid": "lib/bootgrid/js/jquery.bootgrid.fix",
            "colresizable": "lib/colresizable/colResizable-1.6",

            "select-area": "lib/select-area/select-area",
            "select-area-data": "lib/select-area/select-area-data",
            "sweet-alert": "lib/sweetalert/js/sweet-alert",

            "layer": "lib/layer/layer.fix",

            "dataSource": "utils/dataSource",

            "fixrecord": "lib/custom/fixrecord",

            // 代码美化
            "code-pretty": "lib/pretty/prettify.min"
        },
        map: {
            '*': {
                'css': 'utils/css/css',
                'text': 'utils/text'
            }
        },
        shim: {
            "datepicker": [ "jquery" ],
            "select2": [ "jquery", "xDomainRequest" ],
            "bootstrap": [ "jquery", "dataSource" ],
            "formvalidation": [ "jquery", "bootstrap" ],
            "formvalidationBs": [ "formvalidation" ],
            "formvalidationI18N": [ "formvalidation", "formvalidationBs" ],
            "webuploader": [ "css!lib/webuploader/css/webuploader.css" ],
            "colresizable": [ "jquery" ],
            "bootgrid": [ "css!lib/bootgrid/css/jquery.bootgrid.css", "bootstrap", "colresizable", "dataSource" ],
            "select-area": [ "css!lib/select-area/css/select-area.css" ],
            "sweet-alert": [ "jquery" ],
            "code-pretty": [ "css!lib/pretty/prettify.css" ]
        },
        // 超时
        waitSeconds: 150
    } );

    /**
     * 以 “^$” 打头的，是AMD模块，返回的对象会挂载到PKUI名称空间，也会挂载到window对象上，
     * 名称默认是插件名，全局变量名也可以通过“data-export”指定。
     */
    MODULES = {
        "bootstrap": "bootstrap",
        "datepicker": "datepicker",
        "select2": "select2",
        "select-area": "select-area",
        "formvalidation": "formvalidationI18N",
        "bootgrid": "bootgrid",

        "layer": "^$layer",
        "dataSource": "^$dataSource",
        "webuploader": "^$webuploader"
    };

    require( [ "jquery" ], function ( $ ) {
        var modules
        ;
        modules = [];

        $( document ).ready( function () {

            $( "[data-pku-widget]" ).each( function() {
                var $this,
                    moduleID,
                    globalName
                ;
                $this = $( this );
                moduleID = MODULES[ $.trim( $this.attr( "data-pku-widget" ) ) ];
                // 判断是否是合法的
                if ( ! moduleID ) {
                    throw "[" + moduleID + "] is not exist.";
                }
                // 处理非jQuery插件：符合AMD规范的模块
                if ( moduleID.indexOf("^$") === 0 ) {
                    moduleID = moduleID.replace( "^$", "" );
                    globalName = $this.attr( "data-export" ) || moduleID;
                    require( [ moduleID ], function ( m ) {
                        window[ globalName ] = m;
                        // 挂载到名称空间PKUI
                        if ( window.PKUI ) {
                            window.PKUI[ moduleID ] = m;
                        }
                    } );
                    return ;
                }

                modules.push( moduleID );
            } );
            $.unique( modules );

            require( modules );

        } );

    } );


}();