
/**
 * 配置 requirejs
 */
define( "pku/config", [], function () {
    "use strict";
    var Config
    ;

    Config = {
        version: "0.20170116",
        isDev: false,
        init: function () {
            this.configRequireJS();
        },
        getVersion: function () {
            return this.isDev ? ( new Date() ).getTime() : this.version;
        },
        configRequireJS: function () {
            require.config( {
                urlArgs: "__v=" + this.getVersion(),
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

                    "bootgrid": "lib/bootgrid/js/fix/v2/jquery.bootgrid",
                    "colresizable": "lib/colresizable/colResizable-1.6",

                    "select-area": "lib/select-area/select-area",
                    "select-area-data": "lib/select-area/select-area-data",
                    "sweet-alert": "lib/sweetalert/js/sweet-alert",

                    "layer": "lib/layer/fix/v1/layer",

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
        }
    };


    return Config;
} );

/**
 * 以 “__AMD__” 打头的，是AMD模块，返回的对象会挂载到PKUI名称空间，也会挂载到window对象上，
 * 名称默认是插件名，全局变量名也可以通过“data-export”指定。
 */
define( "pku/moduleMapping", [], function () {
    var ModuleMapping
    ;
    ModuleMapping = {
        // jQuery 插件
        "bootstrap": "bootstrap",
        "datepicker": "datepicker",
        "select2": "select2",
        "select-area": "select-area",
        "formvalidation": "formvalidationI18N",
        "bootgrid": "bootgrid",

        // AMD 模块
        "layer": "__AMD__layer",
        "dataSource": "__AMD__dataSource",
        "webuploader": "__AMD__webuploader"
    };
    return ModuleMapping;
} );

/**
 * 工具
 */
define( "pku/utils", [ "pku/moduleMapping" ], function ( ModuleMapping ) {
    return {
        isValidWidgetName: function ( widgetName ) {
            return !!ModuleMapping[ widgetName ];
        },
        isAmd: function ( moduleId ) {
            return moduleId.indexOf( "__AMD__" ) > -1;
        },
        isArray: function ( o ) {
            return typeof o === "object" && Object.prototype.toString.call( o ) === "[object Array]";
        },
        getFormattedModuleId: function ( moduleId ) {
            return moduleId.replace( "__AMD__", "" )
        },
        getFormattedModuleIds: function ( moduleIds ) {
            var mods,
                i,
                len
                ;
            mods = [];
            for ( i = 0, len = moduleIds.length; i < len; i++ ) {
                mods.push( this.getFormattedModuleId( moduleIds[ i ] ) );
            }
            return mods;
        },
        getModuleIdByWidgetName: function ( widgetName ) {
            if ( ! this.isValidWidgetName( widgetName ) ) {
                throw "[" + widgetName + "] is not exist.";
            }
            return ModuleMapping[ widgetName ];
        },
        getModuleIdsByWidgetNames: function ( widgetNames ) {
            var moduleIds,
                i,
                len
                ;
            moduleIds = [];
            for ( i = 0, len = widgetNames.length; i < len; i++ ) {
                moduleIds.push( ModuleMapping[ widgetNames[ i ] ] );
            }
            return moduleIds;
        }
    };
} );



define( "pku/pkui", [ "jquery",  "pku/utils", "pku/moduleMapping" ], function ( $, Utils, ModuleMapping ) {
    var PKUI
        ;
    PKUI = {
        widget: {},
        init: function () {
            this.bind();
            return this;
        },
        /**
         * 事件绑定
         */
        bind: function () {
            var _this
            ;
            _this = this;
            // DOM树构建完毕后，载入通过 data-pku-widget 指定的控件。
            $( document ).ready( function () {
                $( "[data-pku-widget]" ).each( function() {
                    var widgetName,
                        moduleId,
                        formattedModuleId
                    ;
                    widgetName = $.trim( $( this ).attr( "data-pku-widget" ) );
                    moduleId = Utils.getModuleIdByWidgetName( widgetName );

                    // 判断是否是合法的
                    if ( ! Utils.isValidWidgetName( widgetName ) ) {
                        throw "[" + widgetName + "] is not exist.";
                    }
                    formattedModuleId = Utils.getFormattedModuleId( moduleId );
                    require( [ formattedModuleId ], function ( module$ ) {
                        // 挂载到名称空间PKUI
                        _this.regModule( widgetName, module$ );
                    } );

                } );
            } );
        },
        /**
         * 使用插件
         * @param widgetNames 控件名数组
         * @param loadedCallback 控件载入完毕后的回调
         * @returns {PKUI} 支持链式调用
         */
        use: function ( widgetNames, loadedCallback ) {
            var moduleIds,
                formattedModuleIds,
                i,
                len,
                _this
                ;

            _this = this;

            // 多个模块，数组
            if ( ! Utils.isArray( widgetNames ) ) {
                throw "传入的不是数组。";
            }

            moduleIds = Utils.getModuleIdsByWidgetNames( widgetNames );
            formattedModuleIds = Utils.getFormattedModuleIds( moduleIds );

            require( formattedModuleIds, function () {
                var widgetName,
                    moduleId,
                    module$
                    ;
                for ( i = 0, len = moduleIds.length; i < len; i++ ) {
                    widgetName = widgetNames[ i ];
                    moduleId = moduleIds[ i ];
                    module$ = arguments[ i ];
                    // 挂载到名称空间PKUI
                    _this.regModule( widgetName, module$ );
                }

                loadedCallback.apply( PKUI, arguments );
            } );

            return this;
        },
        regModule: function ( widgetName, module$ ) {
            if ( Utils.isAmd( ModuleMapping[ widgetName ] ) ) { // AMD 模块
                this.widget[ widgetName ] = module$;
            } else { // jQuery 插件
                this.widget[ widgetName ] = function ( m ) {
                    return function ( $target ) {
                        m.apply( $target, Array.prototype.slice.call( arguments, 1 ) );
                    };
                }( module$ );
            }
        }

    };
    return PKUI;
} );

require( [ "pku/config" ], function ( Config ) {
    // 配置 requirejs
    Config.init();
} );

require( [  "pku/pkui" ], function ( PKUI ) {
    "use strict";

    require(   )

    // 初始化PKUI
    PKUI.init();

    // 将PKUI暴露到全局名称空间
    window.PKUI = PKUI;

} );
