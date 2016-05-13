+function ( $ ) {
    "use strict";
    var isIE = false,
        timeout,
        Utils = {},
        main = {},
        qjsj = {},  // 区级数据
        ywjg = {},  // 业务监管
        ydbl = {},  // 异地办理
        sjzl = {},  // 数据质量
        sjfw = {},   // 数据服务、统计分析
        rkcx = {}   // 人口查询
        ;

    window.Utils = Utils;

    timeout = 30 * 1000;

    if ( window.attachEvent ) {
        isIE = true;
    }

    if ( window.TIMEOUT ) {
        timeout = parseInt( window.TIMEOUT );
    }

    Utils.ajax = function ( options ) {
        var setting = {
            type: "POST", //请求方式 ("POST" 或 "GET")
            url: "", // 请求的URL
            data: null, // { name: "value" },
            timeout: timeout, // 设置请求超时时间（毫秒）
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            cache: false, // 不缓存此页面
            dataType: "json", // 预期服务器返回的数据类型。
            error: null, // 请求失败时调用此函数
            success: null, // 请求成功后的回调函数。参数：由服务器返回，并根据 dataType 参数进行处理后的数据
            complete: null // 当请求完成之后调用这个函数，无论成功或失败。
        };
        for ( var p in options ) {
            if ( options.hasOwnProperty( p ) ) {
                setting[ p ] = options[ p ];
            }
        }
        $.ajax( setting );
    };
    Utils.wait = {
        show: function show( $target ) {
            var $timer;

            if ( !this._isAdded( $target ) ) {
                this._add( $target );
            }
            if ( $target.data( "isWaiting" ) == true) {
                return;
            }
            $target.find( ".wait-overlay" ).show();
            $timer = $target.find( ".wait-overlay-timer" );
            $timer.text( timeout / 1000 );

            // 启动计时器
            clearInterval( $target.data( "timerId") );

            $target.data( "timerId", +function( timeout ){
                return setInterval( function () {
                    $timer.text( --timeout );
                }, 1000 )
            }( timeout / 1000 ) );

            $target.data( "isWaiting", true );
            return this;
        },
        hide: function hide( $target, delay ) {
            if ( isIE && IS_DEV ) {
                delay = delay || 500;
                $target.find( ".wait-overlay" ).delay( delay ).hide( 1 );
            } else {
                $target.find( ".wait-overlay" ).hide();
            }
            $target.data( "isWaiting", false );
            return this;
        },
        _add: function ( $target ) {
            $target.css( "position", function ( index, val ) {
                return val === "static" ? "relative" : val;
            } );
            $target.append( "<div class='wait-overlay'><span class='wait-overlay-timer'>" + ( timeout / 1000 ) + "</span></div>" );
            return this;
        },
        _isAdded: function ( $target ) {
            return $target.find( ".wait-overlay" ).length > 0;
        }
    };
    Utils.alert = {
        html: '<div class="alert alert-warning"> <button type="button" class="close" ><span>×</span></button> <strong>提示：</strong>网络繁忙，请稍后重试！</div>',
        show: function show( $target ) {
            if ( !this._isAdded( $target ) ) {
                this._add( $target );
            }
            $target.find( ".alert-warning" ).show();
            return this;
        },
        hide: function hide( $target ) {
            $target.find( ".alert-warning" ).hide();
            return this;
        },
        _add: function ( $target ) {
            var _this = this;
            $target.css( "position", function ( index, val ) {
                return val === "static" ? "relative" : val;
            } );
            $( this.html ).appendTo( $target ).find(".close" ).on("click", function() {
                _this.hide( $target );
            });
            return this;
        },
        _isAdded: function ( $target ) {
            return $target.find( ".alert-warning" ).length > 0;
        }
    };
    // 本地存储
    Utils.store = {
        hname: location.hostname ? location.hostname : 'localStatus',
        isLocalStorage: window.localStorage ? true : false,
        dataDom: null,
        initDom: function () {
            if (!this.dataDom) {
                try {
                    this.dataDom = document.createElement('input');
                    this.dataDom.type = 'hidden';
                    this.dataDom.style.display = "none";
                    this.dataDom.addBehavior('#default#userData');
                    document.body.appendChild(this.dataDom);
                    var exDate = new Date();
                    exDate = exDate.getDate() + 30;
                    this.dataDom.expires = exDate.toUTCString();
                } catch (ex) {
                    return false;
                }
            }
            return true;
        },
        set: function (key, value) {
            if (this.isLocalStorage) {
                window.localStorage.setItem(key, value);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.setAttribute(key, value);
                    this.dataDom.save(this.hname)
                }
            }
        },
        get: function (key) {
            if (this.isLocalStorage) {
                return window.localStorage.getItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    return this.dataDom.getAttribute(key);
                }
            }
        },
        remove: function (key) {
            if (this.isLocalStorage) {
                localStorage.removeItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.removeAttribute(key);
                    this.dataDom.save(this.hname)
                }
            }
        }
    };

    Utils.table = {
        frozenHeader: function frozenHeader( $target ) { // <table class="table-grid frozen-head js--frozen-head" data-height="320px">
            var $tempContainer,
                totalHeight,
                headerHeight,
                bodyHeight,
                $tableCopy,
                $newHeader,
                $newBody
                ;

            $tableCopy = $target.clone();

            $tempContainer = $("<div class='frozen-container'> <div class='frozen-header'></div><div class='frozen-body'></div> </div>");

            totalHeight = $target.attr("data-height");
            headerHeight = $target.find(".tbody-heading" ).height();
            bodyHeight = parseInt( totalHeight ) - parseInt( headerHeight );

            $tempContainer.appendTo( $target.parent() );
            $newHeader =  $tempContainer.find(".frozen-header");
            $newBody =  $tempContainer.find(".frozen-body");

            $newBody.css( "height", bodyHeight );

            $tableCopy.find(".tbody-main , .tbody-operation").remove();
            $target.find(".tbody-heading").remove();

            $newHeader.append( $tableCopy );
            $newBody.append( $target );

        }
    };

    function Pagination ( setting ) {

        //this.updateData = ywjg.view.update;

        //this.pageSize = 4;
        //this.$container = ".tabs-business-view";
        this.$firstPage = ".page-first";
        this.$prevPage = ".page-pre";
        this.$currentPage = "input.js--currentPage";
        this.$nextPage = ".page-next";
        this.$refresh = ".refresh";
        for ( var p in setting ) {
            if ( ! setting.hasOwnProperty( p ) ) continue;
            this[ p ] = setting[ p ];
        }
    }
    Pagination.prototype = {
        constructor: Pagination,
        init: function init() {
            this.render().bind();
        },
        restore: function restore() {
            var _this = this;
            _this.$currentPage.val( 1 );
            return this;
        },
        render: function render() {
            var _this = this;
            _this.$container = $( _this.$container );
            _this.$firstPage = $( _this.$firstPage, _this.$container );
            _this.$prevPage = $( _this.$prevPage, _this.$container );
            _this.$currentPage = $( _this.$currentPage, _this.$container );
            //_this.$totalPage = $( _this.$totalPage, _this.$container  );
            _this.$nextPage = $( _this.$nextPage, _this.$container );
            //_this.$lastPage = $( _this.$lastPage, _this.$container  );
            _this.$refresh = $( _this.$refresh, _this.$container );
            //_this.$totalRecords = $( _this.$totalRecords, _this.$container  );
            return _this;
        },
        bind: function bind() {
            var _this = this;
            _this.$refresh.on( "click", function ( event ) {
                event.preventDefault();
                var currentPage = parseInt( _this.$currentPage.val() ) || 1;
                _this.refresh( currentPage );
            } );
            _this.$firstPage.on( "click", function ( event ) {
                _this.refresh( 1 );
                event.preventDefault();
            } );
            _this.$prevPage.on( "click", function ( event ) {
                event.preventDefault();
                var currentPage = parseInt( _this.$currentPage.val() ) || 1;
                if ( currentPage <= 1 ) {
                    return;
                }
                _this.refresh( currentPage - 1 );
            } );
            _this.$nextPage.on( "click", function ( event ) {
                event.preventDefault();
                var currentPage = parseInt( _this.$currentPage.val() ) || 1;
                _this.refresh( currentPage + 1 );
            } );
            _this.$currentPage.on( "keypress", function ( event ) {
                var keyCode = event.keyCode;
                if ( keyCode == 13 ) {
                    _this.$refresh.trigger( "click" );
                    return;
                }
                if ( keyCode < 48 || keyCode > 57 ) {
                    event.preventDefault();
                }
            } );
        },
        refresh: function refresh( pageNum ) {
            var _this = this;
            // ywjg.view.update( pageNum );
            _this.updateData( pageNum );
            //_this.$currentPage.val( pageNum );
            return this;
        },
        update: function ( totalRecords, currentPage ) {
            var _this = this;
            _this.$currentPage.val( Math.ceil( currentPage ) );
            return this;
        }

    };

    main = {
        $bottomMenu: null,
        qjsj: null,
        ywjg: null,
        ydbl: null,
        sjzl: null,
        sjfw: null,
        rkcx: null,
        init: function () {
            this.render().bind();
            //qjsj.init();
            //ywjg.init();
            //ydbl.init();
            //sjzl.init();
            //sjfw.init();
        },
        render: function () {
            this.$bottomMenu = $( ".bottom-menu" );
            this.qjsj = qjsj;
            this.ywjg = ywjg;
            this.ydbl = ydbl;
            this.sjzl = sjzl;
            this.sjfw = sjfw;
            this.rkcx = rkcx;
            return this;
        },
        bind: function () {
            var _this = this
                //curPageUrl
                ;
            this.$bottomMenu.find( ".bottom-menu-item" ).not(".disabled").on( "click", function bottomMenuItemClickHandler() {
                var $this = $( this ),
                    targetId = $this.attr( "data-id" ),
                    _module = _this[ targetId ];


                if ( !targetId ) {
                    return;
                }
                if ( $this.attr( "data-is-loaded" ) == "0" ) {
                    return;
                }

                $this.addClass( "active" ).siblings().removeClass( "active" );

                $( "#" + targetId ).show().siblings().hide();

                if ( ! _module._isInited  ) {
                    _module.init();
                    _module._isInited = true;
                }

            } ).filter(".active" ).trigger("click");


            // 当页面载入完毕后，每个模块进行异步载入

            /*
             qjsj = {},  // 区级数据
             ywjg = {},  // 业务监管
             ydbl = {},  // 异地办理
             sjzl = {},  // 数据质量
             sjfw = {},   // 数据服务、统计分析
             rkcx = {}   // 人口查询
             */

            $( document ).ready( function () {

                $.each( [  "ywjg", "ydbl", "sjzl", "sjfw" ], function ( index, elt ) {

                    Utils.ajax( {
                        url: "",
                        data: "module=" + elt,
                        dataType: "text",
                        success: function ( data ) {
                            var selector,
                                html
                                ;
                            selector = "#" + elt;

                            html = $( $.parseHTML( data ) ).find( selector ).html();

                            // 插入
                            $( selector ).html( html );

                            // isloaded = true
                            $( ".bottom-menu-item" ).filter( "[data-id=" + elt + "]" ).attr( "data-is-loaded", "1" );

                        }
                    } );

                } );


            } );


            return this;
        }
    };

    // 区级数据
    qjsj = {
        $container: ".js--qjsj-data",
        $items: ".map-hot-item",
        $serviceStatus: ".js--service-status",
        $monkeyWizard: ".monkey-wizard",
        isUpading: false,
        requestSetting: {
            $target: ".qjsj-map",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function () {
            this._getRequestSetting();
            this.render().bind();
            this.update( this.$items.eq( 0 ) );
            this._initMonkeyWizard();
        },
        render: function () {
            this.$container = $( this.$container );
            this.$items = $( this.$items );
            this.$serviceStatus = $( this.$serviceStatus );
            this.$monkeyWizard = $( this.$monkeyWizard );
            return this;
        },
        bind: function () {
            var _this = this;
            this.$items.on( "click", function () {
                var $this = $( this );
                Utils.wait.show( _this.$container );
                if ( _this.isUpading ) {
                    return;
                }
                _this.isUpading = true;

                _this.update( $this );
            } ).find(".tip" ).on("click", function( event ) {
                event.stopPropagation();
            });
            this.$monkeyWizard.on("click", function monkeyWizardClickHandler() {
                var $this = $( this );
                $this.toggleClass("help");
                Utils.store.set("monkeyWizardClass", $this.attr("class"));
            });
            return this;
        },
        update: function ( $item ) {
            var _this = this;
            // 1. 更改状态
            _this._updateStatus( $item );
            // 2. 更新数据
            _this._updateData( $item.attr( "data-city-id" ) );
            return this;
        },
        _updateStatus: function _updateStatus( $target ) {
            // 1. change active item
            $target.addClass( "active" ).siblings().removeClass( "active" );
            // 2. change currrent
            $( ".map-current .cur-city" ).text( $target.find( ".tip" ).text() );
            return this;
        },
        _updateData: function _updateData( cityId ) {
            // 发送 Ajax 请求
            // 处理数据
            var _this = this,
                template,
                data,
                html,
                requestSetting,
                url,
                successCallback,
                errorCallback
                ;

            template = Template.qjsj.template;

            requestSetting = _this.requestSetting;
            url = requestSetting.url;
            successCallback = requestSetting.successCallback;
            errorCallback = requestSetting.errorCallback;

            Utils.ajax( {
                url: url,
                data: { "cityId": cityId },
                success: function ( responseData ) {

                    responseData = window[ successCallback ]( responseData );

                    html = doT.template( template )( responseData );
                    _this.$container.html( html );

                    // 服务状况
                    _this.$serviceStatus.html( doT.template( Template.qjsj.serviceStatus.template ) ( responseData.serviceStatus ) );

                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                },
                error: function () { // 此处为测试数据

                    data = Template.qjsj.data;

                    //---- 错误处理

                    window[ errorCallback ]( data, cityId );

                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    //---- 测试数据
                    if ( IS_DEV !== true ) return;
                    html = doT.template( template )( data );
                    _this.$container.html( html );
                    // 服务状况
                    _this.$serviceStatus.html( doT.template( Template.qjsj.serviceStatus.template ) ( data.serviceStatus ) );
                }
            } );

            return this;
        },
        _initMonkeyWizard: function _initMonkeyWizard() {
            var classes;
            classes = Utils.store.get("monkeyWizardClass");
            if ( classes ) {
                this.$monkeyWizard.attr("class", classes);
            }
            return this;
        }
    };

    // 业务监管
    ywjg = {
        $container: null,
        $timeMenuItems: null,
        init: function init() {
            this.render().bind();
            this.view.init();
            this.totality.init().update();
            return this;
        },
        render: function render() {
            this.$container = $( "#ywjg" );
            this.$timeMenuItems = $( ".time-menu-item", this.$container );
            return this;
        },
        bind: function bind() {
            this.$timeMenuItems.on( "click", function timeMenuItemClickHandler( event ) {
                var $this = $( this );
                $this.addClass( "active" ).siblings().removeClass( "active" );
                ywjg.totality.update();
                //ywjg.view.update();
                event.preventDefault();
            } );
            return this;
        }
    };

    // 业务监管-业务总量
    ywjg.totality = {
        __view: ywjg.view,
        $container: "#ywjg .tabs-business-total",
        $navItems: ".nav-item",
        $chart: "#ywjg .chart",
        $chartItems: "#ywjg .chart .chart-item",
        $timeMenuItems: "#ywjg .time-menu-item",
        isUpading: false, // 是否在更新数据
        data: {
            time: "day", // day week month
            maxNum: 1000, // 指定最大数，当柱形高度为100%时的数量
            hhht: 0,  // 1. 呼和浩特
            bt: 0,    // 2. 包头
            wh: 0,    // 3. 乌海
            cf: 0,    // 4. 赤峰
            tl: 0,    // 5. 通辽
            eeds: 0,  // 6. 鄂尔多斯
            hlbe: 0,  // 7. 呼伦贝尔
            wlcb: 0,  // 8. 乌兰察布
            byne: 0,  // 9. 巴彦淖尔
            xa: 0,    // 10. 兴安
            als: 0,   // 11. 阿拉善
            xlgl: 0   // 12. 锡林郭勒
        },
        requestSetting: {
            $target: "#ywjg .tabs-business-total",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init() {
            this._getRequestSetting();
            this.render()
                .bind();
                //.update();
            return this;
        },
        render: function render() {
            this.__view = ywjg.view;
            this.$container = $( this.$container );
            this.$chart = $( this.$chart );
            this.$chartItems = $( this.$chartItems );
            this.$navItems = $( this.$navItems, this.$container );
            this.$timeMenuItems = $( this.$timeMenuItems );
            return this;
        },
        bind: function bind() {
            var $navItems = this.$navItems,
                _this = this,
                __view = _this.__view;
            $navItems.on( "click", function navItemClickHandler( event ) {
                var $this = $( this )
                    ;
                // 判断是否为 active
                if ( $this.hasClass( "active" ) ) {
                    return;
                }
                // 0. 判断是否在更新数据
                if ( _this.isUpading ) {
                    Utils.wait.show( _this.$container );
                    return;
                }
                // 1. 改变状态
                $this.addClass( "active" ).siblings().removeClass( "active" );
                $this.attr( "data-value", $this.find( "select" ).val() || "00" );

                // 2. 更新数据
                _this.update();

                event.preventDefault();
            } );

            $navItems.find( "select" ).on( "change", function selectChangeHandler() {
                var $this = $( this )
                    ;
                $this.parent( ".nav-item" ).attr( "data-value", $this.val() );
                _this.update();
            } ).on( "click", function selectClickHandler( event ) {
                event.stopPropagation();
            } );

            _this.$chartItems.on( "click", function () {
                var $this = $( this )
                    ;

                // view
                // 0. 判断是否正在更新数据
                if ( __view.isUpading ) {
                    return;
                }

                // 1. 更改状体

                // 切换自身的状态
                $this.addClass( "active" ).siblings().removeClass("active");

                // 2. 更改标题
                //view.$navItems.find("a" ).text( _this.$navItems.filter(".active" ).find("a" ).text().replace("总数", "详情") );

                // 3. 更新数据
                __view.update(1);

            } );
            return this;
        },
        update: function update() {
            var _this = this,
                time,
                timeText,
                type,
                title,
                $activeNavItem,
                $activeTimeMenuItem,
                requestSetting,
                successCallback,
                errorCallback
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            $activeNavItem = _this.$navItems.filter( ".active" );
            $activeTimeMenuItem = _this.$timeMenuItems.filter( ".active" );
            time = $activeTimeMenuItem.attr( "data-value" );
            timeText = $activeTimeMenuItem.text().substring( 0, 2 );
            type = $activeNavItem.attr( "data-value" );
            title = $activeNavItem.find( "select option:selected" ).text() || $activeNavItem.text();
            requestSetting = this.requestSetting;
            successCallback = requestSetting.successCallback;
            errorCallback = requestSetting.errorCallback;

            // 1. 获取数据
            this._getData(
                { "time": time, "type": type },
                function getDataSuccessHandler( responseData ) {
                    // 处理服务器返回的数据
                    responseData = window[ successCallback ]( responseData );
                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, title + "|" + timeText );
                },
                function getDataErrorHandler() { // 测试数据

                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    window[ errorCallback ]( _this.data );
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    var data = _this.data;
                    _this._render( data, title + " |" + timeText );
                }
            );

            // 更新view
            _this.__view.update();

        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var requestSetting = this.requestSetting;
            Utils.ajax( {
                url: requestSetting.url,
                data: queryData, // { "time": time, "type": type }
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, title ) {
            var $chart,
                maxNum,
                prop;

            $chart = this.$chart;
            maxNum = data[ "maxNum" ] || 1000;

            for ( prop in data ) {
                var $chartItem,
                    num,
                    percent
                    ;
                if ( !data.hasOwnProperty( prop ) || prop === "maxNum" ) {
                    continue;
                }
                $chartItem = $( ".js--" + prop, $chart ).find( ".percent" );
                num = data[ prop ];
                percent = (num / maxNum * 100) + "%";

                $chartItem.css( "height", percent ).find( ".num" ).text( num );
            }

            $chart.find( ".chart-title" ).text( title );

            // 更新完毕
            this.isUpading = false;
            Utils.wait.hide( this.$container );
            return this;
        }
    };

    // 业务监管-业务查看
    ywjg.view = {
        __totality: ywjg.totality,
        $container: "#ywjg .tabs-business-view",
        $navItems: ".nav-item",
        $timeMenuItems: "#ywjg .time-menu-item",
        $tbody: ".tbody-main",
        isUpading: false, // 是否在更新数据
        requestSetting: {
            $target: "#ywjg .tabs-business-view",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init() {
            this._getRequestSetting();
            this.render();
            this.bind();
            this.pagination.init();
            //this.update();
            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$navItems = $( this.$navItems, this.$container );
            this.$timeMenuItems = $( this.$timeMenuItems );
            this.$tbody = $( this.$tbody, this.$container );
            return this;
        },
        bind: function bind() {
            /*
            var $navItems = this.$navItems,
                _this = this;
            $navItems.on( "click", function navItemClickHandler( event ) {
                var $this = $( this )
                    ;
                // 判断是否为 active
                if ( $this.hasClass( "active" ) ) {
                    return;
                }
                // 0. 判断是否在更新数据
                if ( _this.isUpading ) {
                    Utils.wait.show( _this.$container );
                    return;
                }

                // 将分页还原
                _this.pagination.restore();

                // 1. 改变状态
                $this.addClass( "active" ).siblings().removeClass( "active" );
                $this.attr( "data-value", $this.find( "select" ).val() || "00" );

                // 2. 更新数据
                _this.update();

                event.preventDefault();
            } );

            $navItems.find( "select" ).on( "change", function selectChangeHandler() {
                var $this = $( this )
                    ;
                $this.parent( ".nav-item" ).attr( "data-value", $this.val() );
                _this.update();
            } ).on( "click", function selectClickHandler( event ) {
                event.stopPropagation();
            } );
        */
            return this;
        },
        update: function update( pageNum ) {
            var _this = this,
                queryData = {},
                time,
                type,
                cityId,
                $activeNavItem,
                $totalityActiveNavItem,
                __totality = _this.__totality,
                offset,
                oldOffsetClassReg
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( _this.$container );
            if ( this.isUpading ) {
                return this;
            }
            _this.isUpading = true;
            $activeNavItem = _this.$navItems.filter( ".active" );
            $totalityActiveNavItem = __totality.$navItems.filter( ".active" );
            time = _this.$timeMenuItems.filter( ".active" ).attr( "data-value" );
            type = $totalityActiveNavItem.attr( "data-value" );
            cityId = __totality.$chartItems.filter(".active" ).attr("data-city-id");

            queryData[ "time" ] = time;
            queryData[ "type" ] = type;
            queryData[ "cityId" ] = cityId;
            queryData[ "pageNum" ] = pageNum || 1;
            queryData[ "pageSize" ] = _this.pagination.pageSize;

            // 更改标题
            $activeNavItem.find("a" ).text( $totalityActiveNavItem.find("a" ).text().replace("总数", "详情") );
            offset = __totality.$chartItems.filter(".active").index();
            oldOffsetClassReg = /pull-[0-9]{1,2}/g;
            _this.$navItems.removeClass( function(){
                var allClass, pullClass;
                allClass = $(this).attr("class");
                pullClass = oldOffsetClassReg.exec( allClass );
                if ( pullClass ) {
                    return pullClass.join(" ");
                }
            } ).addClass( "pull-" + offset );
            // 1. 获取数据
            _this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {

                    responseData = window[ _this.requestSetting.successCallback ]( responseData );

                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ywjg.template );
                    _this.pagination.update( responseData[ "totalRecords" ] || "", responseData[ "pageNum" ] || "1" );
                },
                function getDataErrorHandler() { // 测试数据


                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    window[ _this.requestSetting.errorCallback ]();
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;


                    _this._render( Template.ywjg.data.slice( 0, Math.floor( 4 * Math.random() ) ), Template.ywjg.template );
                    _this.pagination.update( "1", "1" );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var _this = this;
            Utils.ajax( {
                url: _this.requestSetting.url,
                data: queryData, // { "time": time, "type": type, "cityId": cityId,  "pageNum": pageNum, "pageSize": pageSize }
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, template ) {
            var _this = this;
            // 更新完毕
            Utils.wait.hide( _this.$container );
            _this.isUpading = false;
            this.$tbody.html( doT.template( template )( data ) );
            //
            return this;
        }
    };

    ywjg.view.pagination = new Pagination({
        updateData: function( pageNum ) {
            var _this = ywjg.view;
            _this.update.call( _this, pageNum );
        },
        pageSize: 4,
        $container : ".tabs-business-view"
    });

    // 异地办理
    ydbl = {
        $container: "#ydbl",
        $tabs: ".tabs",
        $tabsBody: ".tabs-body",
        init: function init() {
            this.render();
            this.bind();

            // 异地办证情况统计
            this.tj.init();

            // 异地办证（受理中）
            this.cx.init();

            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$tabs = $( this.$tabs, this.$container );
            this.$tabsBody = $( this.$tabsBody, this.$tabs );
            return this;
        },
        bind: function bind() {
            var _this = this;
            // tabs
            _this.$tabs.find(".tabs-nav .nav-item" ).on( "click", function navItemClickHandler() {
                var $this,
                    tabBodyId,
                    $activeTabBody
                    ;
                $this = $( this );
                tabBodyId = $this.attr("data-body-id");
                $activeTabBody = _this.$tabsBody.filter("[data-id=" + tabBodyId + "]");

                $this.addClass("active" ).siblings(".nav-item" ).removeClass("active");

                $activeTabBody.show().siblings(".tabs-body" ).hide();

            } ).find( "a" ).on("click", function navItemAnchorClickHandler( event ){
                event.preventDefault();
            });
            return _this;
        }
    };

    // 异地办证-异地办证情况统计
    ydbl.tj = {
        $container: "#ydbl .ydbz-tj",
        $tbody: ".tbody-main",
        $refresh: ".refresh",
        $tableGrid: ".table-grid",
        isUpading: false, // 是否在更新数据
        requestSetting: {
            $target: "#ydbl .ydbz-tj",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init () {
            this._getRequestSetting();
            this.render();
            this.bind();
            this.update();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$tbody = $( this.$tbody, this.$container );
            this.$refresh = $( this.$refresh, this.$container );
            this.$tableGrid = $( this.$tableGrid, this.$container );
        },
        bind: function bind() {
            var _this
                ;
            _this = this;

            // tableGrid
            Utils.table.frozenHeader( this.$tableGrid );

            // refresh
            this.$refresh.on("click", function refreshClickHandler() {
                _this.update();
            });
        },
        update: function update( ) {
            var _this = this,
                queryData
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( _this.$container );
            if ( this.isUpading ) {
                return this;
            }
            _this.isUpading = true;

            queryData = null;

            // 1. 获取数据
            _this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {

                    responseData = window[ _this.requestSetting.successCallback ]( responseData );

                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ydbl.tj.template );
                },
                function getDataErrorHandler() { // 测试数据


                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    window[ _this.requestSetting.errorCallback ]();
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    var list = Template.ydbl.tj.data.list;

                    list[ list.length ] = list[0];
                    list[ list.length ] = list[1];

                    _this._render( Template.ydbl.tj.data, Template.ydbl.tj.template );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var _this = this;
            Utils.ajax( {
                url: _this.requestSetting.url,
                data: queryData,
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, template ) {
            var _this = this;
            // 更新完毕
            Utils.wait.hide( _this.$container );
            _this.isUpading = false;
            _this.$tbody.html( doT.template( template )( data ) );
            // 更改每列的颜色
            //_this.$container.find("tr td:nth-of-type(2), tr td:nth-of-type(3), tr th:nth-of-type(3), tr th:nth-of-type(4)" ).addClass("color-key1");
            //_this.$container.find("tr td:nth-of-type(4), tr td:nth-of-type(5), tr th:nth-of-type(5), tr th:nth-of-type(6)" ).addClass("color-key2");
            //
            return this;
        }

    };

    // 异地办证-异地办证（受理中）
    ydbl.cx = {
        $container: "#ydbl .ydbl-cx",
        $form: ".search form",
        $tbody: ".tbody-main",
        isUpading: false, // 是否在更新数据
        requestSetting: {
            $target: "#ydbl .ydbl-cx",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init() {
            this._getRequestSetting();
            this.render();
            this.bind();
            this.pagination.init();
            this.update();
            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$tbody = $( this.$tbody, this.$container );
            this.$form = $( this.$form, this.$container );
            return this;
        },
        bind: function bind() {
            var _this = this;
            _this.$form.find("input[type='button']" ).on("click", function() {
                _this.update();
            });
            return this;
        },
        update: function update( pageNum ) {
            var _this = this,
                queryData = {},
                $form = _this.$form
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            queryData[ "pageNum" ] = pageNum || 1;
            queryData[ "pageSize" ] = this.pagination.pageSize || 10;


            // 获取表单数据
            $form.find("input[name]" ).each(function(){
                var $this = $(this ),
                    prop,
                    value;
                prop = $this.attr("name");
                value = $this.val();
                if ( $this.attr("type") == "checkbox" ) {
                    value = $this.is(":checked") ? 1 : 0;
                }
                queryData[ prop ] = value;
            });

            // 1. 获取数据
            this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {

                    responseData = window[ _this.requestSetting.successCallback ]( responseData );

                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ydbl.template );
                    _this.pagination.update( responseData[ "totalRecords" ] || "", responseData[ "pageNum" ] || "1" );
                },
                function getDataErrorHandler() { // 测试数据

                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    window[ _this.requestSetting.errorCallback ]();
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    _this._render( Template.ydbl.data.slice( 0, Math.floor( 4 * Math.random() ) ), Template.ydbl.template );
                    _this.pagination.update( "1", "1" );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var _this = this;
            Utils.ajax( {
                url: _this.requestSetting.url,
                data: queryData, // { "pageNum": 1, "xm": xm, "islikequery": islikequery, "gmsfzhm": gmsfzhm }
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, template ) {
            var _this = this;
            // 更新完毕
            Utils.wait.hide( _this.$container );
            _this.isUpading = false;
            this.$tbody.html( doT.template( template )( data ) );
            //
            return this;
        }
    };
    ydbl.cx.pagination = new Pagination({
        updateData: function( pageNum ) {
            var _this = ydbl.cx;
            _this.update.call( _this, pageNum );
        },
        pageSize: 10,
        $container : "#ydbl .ydbl-cx"
    });


    // 数据质量
    sjzl = {
        //$container: "#sjzl",
        init: function init() {
            this.render().bind();
            this.problems.init();
            this.duplicate.init();
            return this;
        },
        render: function render() {
            //this.$container = $( this.$container );
            return this;
        },
        bind: function bind() {
            return this;
        }
    };

    // 数据质量-数据质量问题
    sjzl.problems = {
        $container: "#sjzl .tabs-quality-problems",
        $navItems: ".nav-item",
        $chart: ".chart",
        isUpading: false, // 是否在更新数据
        data: {
            maxNum: 1000, // 指定最大数，当柱形高度为100%时的数量
            hhht: 0,  // 1. 呼和浩特
            bt: 0,    // 2. 包头
            wh: 0,    // 3. 乌海
            cf: 0,    // 4. 赤峰
            tl: 0,    // 5. 通辽
            eeds: 0,  // 6. 鄂尔多斯
            hlbe: 0,  // 7. 呼伦贝尔
            wlcb: 0,  // 8. 乌兰察布
            byne: 0,  // 9. 巴彦淖尔
            xa: 0,    // 10. 兴安
            als: 0,   // 11. 阿拉善
            xlgl: 0   // 12. 锡林郭勒
        },
        requestSetting: {
            $target: "#sjzl .tabs-quality-problems",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init() {
            this._getRequestSetting();
            this.render()
                .bind()
                .update();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$chart = $( this.$chart, this.$container );
            this.$navItems = $( this.$navItems, this.$container );
            return this;
        },
        bind: function bind() {
            var $navItems = this.$navItems,
                _this = this;
            $navItems.on( "click", function navItemClickHandler( event ) {
                var $this = $( this )
                    ;
                // 判断是否为 active
                if ( $this.hasClass( "active" ) ) {
                    return;
                }
                // 0. 判断是否在更新数据
                if ( _this.isUpading ) {
                    Utils.wait.show( _this.$container );
                    return;
                }
                // 1. 改变状态
                $this.addClass( "active" ).siblings().removeClass( "active" );
                $this.attr( "data-value", $this.find( "select" ).val() || "00" );

                // 2. 更新数据
                _this.update();

                event.preventDefault();
            } );

            $navItems.find( "select" ).on( "change", function selectChangeHandler() {
                var $this = $( this )
                    ;
                $this.parent( ".nav-item" ).attr( "data-value", $this.val() );
                _this.update();
            } ).on( "click", function selectClickHandler( event ) {
                event.stopPropagation();
            } );
            return this;
        },
        update: function update() {
            var _this = this,
                type,
                title,
                $activeNavItem,
                requestSetting,
                successCallback,
                errorCallback
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            $activeNavItem = _this.$navItems.filter( ".active" );
            type = $activeNavItem.attr( "data-value" );
            title = $activeNavItem.find( "select option:selected" ).text() || $activeNavItem.text();
            requestSetting = this.requestSetting;
            successCallback = requestSetting.successCallback;
            errorCallback = requestSetting.errorCallback;

            // 1. 获取数据
            this._getData(
                { "type": type },
                function getDataSuccessHandler( responseData ) {
                    // 处理服务器返回的数据
                    responseData = window[ successCallback ]( responseData );
                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, title );
                },
                function getDataErrorHandler() { // 测试数据
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    var data = window[ errorCallback ]( _this.data );
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    _this._render( data, title );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var requestSetting = this.requestSetting;
            Utils.ajax( {
                url: requestSetting.url,
                data: queryData, // { "type": type }
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, title ) {
            var $chart,
                maxNum,
                prop;

            $chart = this.$chart;
            maxNum = data[ "maxNum" ] || 1000;

            for ( prop in data ) {
                var $chartItem,
                    num,
                    percent
                    ;
                if ( !data.hasOwnProperty( prop ) || prop === "maxNum" ) {
                    continue;
                }
                $chartItem = $( ".js--" + prop, $chart ).find( ".percent" );
                num = data[ prop ];
                percent = (num / maxNum * 100) + "%";

                $chartItem.css( "height", percent ).find( ".num" ).text( num );
            }

            $chart.find( ".chart-title" ).text( title );

            // 更新完毕
            this.isUpading = false;
            Utils.wait.hide( this.$container );
            return this;
        }
    };

    // 数据质量-重证号
    sjzl.duplicate = {
        $container: "#sjzl .tabs-duplicate-code",
        $tbody: ".tbody-main",
        $tableGrid: ".table-grid",
        $viewMode: ".tabs-tools .view-mode",
        $headIndicator: ".tbody-heading th:first-child",
        isUpading: false, // 是否在更新数据
        requestSetting: {
            $target: "#sjzl .tabs-duplicate-code",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init() {
            this._getRequestSetting();
            this.render();
            this._frozenTableHead();
            this.bind();
            this.pagination.init();
            this.update();
            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            //this.$tbody = $( this.$tbody, this.$container );
            this.$tableGrid = $( this.$tableGrid, this.$container );
            this.$viewMode = $( this.$viewMode, this.$container );
            //this.$headIndicator = $( this.$headIndicator, this.$container );
            return this;
        },
        _frozenTableHead: function _frozenTableHead() {
            // 冻结表头
            Utils.table.frozenHeader( this.$tableGrid );
            this.$tbody = $( this.$tbody, this.$container );
            this.$headIndicator = $( this.$headIndicator, this.$container );
            //console.info(this.$headIndicator)
        },
        bind: function bind() {
            var _this
                ;
            _this = this;

            this.$viewMode.on("click", function viewModeClickHandler() {
                $( this ).toggleClass( "small" );
                _this.$container.toggleClass( "view-mode-max" );
            });

            this.$headIndicator.on( "click", function headingIndicatorClickHandler() {
                var $this
                    ;
                $this = $( this );
                if ( $this.is(".active") ) {
                    _this._collapseRows();
                } else {
                    _this._showRows();
                }
                //$this.toggleClass("active");
            } );


            return this;
        },
        update: function update( pageNum ) {
            var _this = this,
                queryData = {}
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            queryData[ "pageNum" ] = pageNum || 1;
            queryData[ "pageSize" ] = this.pagination.pageSize;

            // 1. 获取数据
            this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {

                    responseData = window[ _this.requestSetting.successCallback ]( responseData );



                    // 给每组重证号，每个元素 用 copy标志是否是重复的，groupId标志一组
                    var i = 0,
                        data = responseData,
                        len = data.length,
                        curElt = null,
                        preElt = {},
                        counter = 1
                        ;
                    for ( ; i < len; i++ ) {
                        curElt = data[ i ];
                        if ( curElt.chhm === preElt.chhm ) { // 如果跟前一个一样，则加上 “copy标志”
                            curElt.copy = 1;
                            curElt.groupId = preElt.groupId;
                        } else {
                            curElt.copy = 0;
                            curElt.groupId = counter;
                            counter++;
                        }
                        preElt = curElt;
                    }


                    // 2. 更新到页面（获取数据成功）
                    _this._render( data, Template.sjzl.template );
                    _this.pagination.update( responseData[ "totalRecords" ] || "", responseData[ "pageNum" ] || "1" );

                },
                function getDataErrorHandler() { // 测试数据
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    window[ _this.requestSetting.errorCallback ]();
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    var _sampleData = [
                        {  chhm: "123456789012345678", xm: "张三1", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" },
                        {  chhm: "123456789012345678", xm: "张三2", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" },

                        {  chhm: "123456789012345670", xm: "王五1", xb: "男", csrq: "1988-08-12", pcs: "派出所3号", lxdh: "18781222788" },
                        {  chhm: "123456789012345670", xm: "王五2", xb: "男", csrq: "1988-08-12", pcs: "派出所3号", lxdh: "18781222788" },
                        {  chhm: "123456789012345670", xm: "王五3", xb: "男", csrq: "1988-08-12", pcs: "派出所3号", lxdh: "18781222788" },
                        {  chhm: "123456789012345670", xm: "王五4", xb: "男", csrq: "1988-08-12", pcs: "派出所3号", lxdh: "18781222788" },

                        {  chhm: "123456789012345679", xm: "李四1", xb: "男", csrq: "1988-08-12", pcs: "派出所2号", lxdh: "18781222788" },
                        {  chhm: "123456789012345679", xm: "李四2", xb: "男", csrq: "1988-08-12", pcs: "派出所2号", lxdh: "18781222788" },
                        {  chhm: "123456789012345679", xm: "李四3", xb: "男", csrq: "1988-08-12", pcs: "派出所2号", lxdh: "18781222788" },

                        {  chhm: "123456789012345672", xm: "赵六1", xb: "男", csrq: "1988-08-12", pcs: "派出所4号", lxdh: "18781222788" },
                        {  chhm: "123456789012345672", xm: "赵六2", xb: "男", csrq: "1988-08-12", pcs: "派出所4号", lxdh: "18781222788" },
                        {  chhm: "123456789012345672", xm: "赵六3", xb: "男", csrq: "1988-08-12", pcs: "派出所4号", lxdh: "18781222788" },
                        {  chhm: "123456789012345672", xm: "赵六3", xb: "男", csrq: "1988-08-12", pcs: "派出所4号", lxdh: "18781222788" },
                        {  chhm: "123456789012345672", xm: "赵六4", xb: "男", csrq: "1988-08-12", pcs: "派出所4号", lxdh: "18781222788" }
                    ];

                    // 给每组重证号，每个元素 用 copy标志是否是重复的，groupId标志一组
                    var i = 0,
                        data = _sampleData,
                        len = data.length,
                        curElt = null,
                        preElt = {},
                        counter = 1
                        ;
                    for ( ; i < len; i++ ) {
                        curElt = data[ i ];
                        if ( curElt.chhm === preElt.chhm ) { // 如果跟前一个一样，则加上 “copy标志”
                            curElt.copy = 1;
                            curElt.groupId = preElt.groupId;
                        } else {
                            curElt.copy = 0;
                            curElt.groupId = counter;
                            counter++;
                        }
                        preElt = curElt;
                    }

                    _this._render( data , Template.sjzl.template );
                    _this.pagination.update( "1", "1" );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var _this = this;
            Utils.ajax( {
                url: _this.requestSetting.url,
                data: queryData, // { "pageNum": pageNum, "pageSize": pageSize }
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data, template ) {
            var _this = this;
            // 更新完毕
            Utils.wait.hide( _this.$container );
            _this.isUpading = false;
            this.$tbody.html( doT.template( template )( data ) );

            // 添加事件-点击每组的第一行
            this.$tbody.find( ".lead-copy" ).on( "click", function leadCodyClickHandler(){
                var $this,
                    groupId,
                    $copys
                ;
                $this = $( this );
                groupId = $this.attr("data-group-id");
                $copys = $this.siblings( ".copy[data-group-id=" + groupId + "]");
                $this.toggleClass("active");
                $copys.toggleClass("active");
            } )
            // 添加 indicator
                .find("th:eq(0)" ).append("<span class='indicator'></span>");

            // 判断整体的折叠情况
            if ( _this.$headIndicator.is( ".active" ) ) {
                _this._showRows();
            } else {
                _this._collapseRows();
            }

            return this;
        },
        _collapseRows: function _collapseRows() {
            this.$tbody.find( "tr" ).removeClass( "active" );
            this.$headIndicator.removeClass( "active" );
        },
        _showRows: function _showRows() {
            this.$tbody.find( "tr" ).addClass( "active" );
            this.$headIndicator.addClass( "active" );
        }
    };

    sjzl.duplicate.pagination = new Pagination({
        updateData: function( pageNum ) {
            var _this = sjzl.duplicate;
            _this.update.call( _this, pageNum );
        },
        pageSize: 4,
        $container : ".tabs-duplicate-code"
    });


    // 数据服务(废弃)
    /*
    sjfw = {
        $container: "#sjfw",
        $navItems: ".nav-item",
        $cityCondition: ".conditions-city",
        $timeCondition: ".conditions-time",
        $refresh: ".refresh",
        chart: null,
        isUpading: false, // 是否在更新数据
        data: {
            title: "数据统计" , // 柱状图的标题
            type: "数量",
            data: [ // 数据，
                { name: "数据项1", value: "100" },
                { name: "数据项2", value: "200" },
                { name: "数据项3", value: "300" },
                { name: "数据项4", value: "400" },
                { name: "数据项5", value: "500" }
            ]
        },
        requestSetting: {
            $target: "#sjfw .tabs",
            url: null,
            successCallback: null,
            errorCallback: null
        },
        _getRequestSetting: function _getRequestSetting() {
            var requestSetting,
                $target
                ;
            requestSetting = this.requestSetting;
            $target = $( requestSetting.$target );
            requestSetting.url = $target.attr( "data-url" );
            requestSetting.successCallback = $target.attr( "data-success-callback" );
            requestSetting.errorCallback = $target.attr( "data-error-callback" );
            return this;
        },
        init: function init () {
            this._getRequestSetting();
            this.render();
            this.bind();
            this.initCitySelect();
            this.initTimeSelect();
            this.chart.init();
            this.update();
            return this;
        },
        render: function render () {
            var _this = this;
            _this.$container = $( _this.$container );
            _this.$cityCondition = $( _this.$cityCondition, _this.$container );
            _this.$timeCondition = $( _this.$timeCondition, _this.$container );
            _this.$refresh = $( _this.$refresh, _this.$container );
            _this.$navItems = $( _this.$navItems, _this.$container );
            return _this;
        },
        bind: function bind () {
            var _this = this,
                $cityConditionDropdownMenu,
                $cityConditionInput,
                $timeSelect
                ;
            $cityConditionDropdownMenu = _this.$cityCondition.find(".dropdown-menu");
            $cityConditionInput = $cityConditionDropdownMenu.find(".dropdown-menu-input");
            $timeSelect = _this.$timeCondition.find(".time-select");

            // dropdown-menu
            _this.$container.find(".dropdown-menu").on( "mouseenter", function dropdownMenuMouseEnterHandler () {
                var $this = $(this);
                $this.addClass("active");
            } ).on( "mouseleave", function dropdownMenuMouseLeaveHandler () {
                var $this = $(this);
                $this.removeClass("active");
            } );

            // tabs
            _this.$navItems.on("click", function ( event ) {

                // 1. 更改状态
                $( this ).addClass( "active" ).siblings().removeClass("active");

                // 2. 刷新数据
                _this.update();

                event.preventDefault();
            });

            // 盟市
            _this.$cityCondition.find(".city-select-item a" ).on("click",  function citySelectItemClickHandler ( event ) {
                var $this = $(this ),
                    value,
                    text
                    ;

                value = $this.attr("data-value");
                text = $this.text();

                // 改变状态
                $this.closest(".city-select-item" ).addClass("active" ).siblings(".city-select-item" ).removeClass("active");

                // 改变值
                $cityConditionInput.attr("data-value", value ).text( text );

                // 隐藏面板
                // $cityConditionDropdownMenu.removeClass("active");

                event.preventDefault();
            } );


            // 时间 - 年
            $timeSelect.find(".year .prev").on("click", function prevYearClickHandler () {
                changeYear( $(this), true);
            });
            $timeSelect.find(".year .next").on("click", function nextYearClickHandler () {
                changeYear( $(this), false );
            });
            // 时间 - 月
            $timeSelect.find(".month-item a").on("click", function monthClickHandler ( event ) {
                var $this = $(this),
                    month,
                    $input
                    ;

                month = $this.attr("data-value");
                $input = $this.closest(".dropdown-menu" ).find(".dropdown-menu-input");

                // 1. 改变状态
                $this.parent(".month-item" ).addClass("active" ).siblings(".month-item" ).removeClass("active");

                // 2. 改变值
                $input.attr("data-value", function (index, oldValue) {
                    return oldValue.replace(/[0-9]{2}$/, month + "" );
                } ).find(".mm" ).text(month);

                event.preventDefault();
            });


            function changeYear( $target, isReduce ) {
                var $this = $target,
                    $current,
                    year,
                    newYear,
                    $input
                    ;

                isReduce = isReduce ? -1 : 1;
                $current = $this.siblings(".current" );
                year = $current.attr("data-value");
                newYear = parseInt( year ) + isReduce;

                $input = $this.closest(".dropdown-menu" ).find(".dropdown-menu-input");

                // 1. 改变 current
                $current.attr("data-value", newYear ).find(".num").text(newYear);

                // 2. 改变 input
                $input.find(".yyyy" ).text(newYear);
                $input.attr("data-value",function (index, oldValue) {
                    return oldValue.replace(/^[0-9]{4}/, newYear + "");
                });
            }

            // 刷新按钮
            _this.$refresh.on("click", function refreshClickHandler() {
                _this.update();
            });

            return _this;
        },
        update: function update () {
            var _this = this,
                queryData = {},
                type,
                cityId,
                startTime,
                endTime,
                successCallback,
                errorCallback
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            // 获取请求参数
            type = _this.$navItems.filter(".active" ).attr("data-value");
            cityId = _this.$cityCondition.find(".dropdown-menu-input" ).attr("data-value");
            startTime = _this.$timeCondition.find(".time-start .dropdown-menu-input" ).attr("data-value");
            endTime = _this.$timeCondition.find(".time-end .dropdown-menu-input" ).attr("data-value");

            queryData[ "type" ] = type;
            queryData[ "cityId" ] = cityId;
            queryData[ "startTime" ] = startTime;
            queryData[ "endTime" ] = endTime;

            successCallback = _this.requestSetting.successCallback;
            errorCallback = _this.requestSetting.errorCallback;

            // 发送请求
            // 1. 获取数据
            this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {
                    // 处理服务器返回的数据
                    responseData = window[ successCallback ]( responseData );
                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData );
                },
                function getDataErrorHandler() { // 测试数据
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                    IS_DEV || Utils.alert.show( _this.$container );

                    var data = window[ errorCallback ]( _this.data );
                    //---- 测试数据
                    if ( IS_DEV !== true ) return;

                    _this._render( data );
                }
            );

        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var requestSetting = this.requestSetting;
            Utils.ajax( {
                url: requestSetting.url,
                data: queryData,
                success: successCallback,
                error: errorCallback
            } );
            return this;
        },
        _render: function _render( data ) {
            var _this = this,
                chart,
                option,
                pairs,
                names,
                values
                ;

            chart = _this.chart;
            option = chart.option;

            // data ==> option
            /!*
             data: {
                 title: "数据统计" , // 柱状图的标题
                 type: "数量",
                 data: [ // 数据，
                     { name: "数据项1", value: "100" },
                     { name: "数据项2", value: "200" },
                     { name: "数据项3", value: "300" },
                     { name: "数据项4", value: "400" },
                     { name: "数据项5", value: "500" }
                 ]
             },
            *!/
            option.legend.data[0] = data["title"];
            option.series[0].name = data["type"];
            names = option.xAxis[0].data = [];
            values = option.series[0].data = [];

            pairs = data["data"];

            for ( var i = 0, len = pairs.length; i < len; i++ ) {
                names.push( pairs[i ].name );
                values.push( pairs[i ].value );
            }

            chart.update( option );

            // 更新完毕
            this.isUpading = false;
            Utils.wait.hide( this.$container );
            return this;
        },
        initCitySelect: function initCitySelect() {
            var _this = this,
                $citySelect
                ;
            $citySelect = _this.$container.find(".city-select");

            $citySelect.each( function () {
                var $this = $(this),
                    value,
                    text,
                    $dropdownMenu,
                    $input,
                    $activeCitySelectItem
                    ;
                $dropdownMenu = $this.closest(".dropdown-menu" );
                $input = $dropdownMenu.find(".dropdown-menu-input");
                value = $input.attr("data-value");
                $activeCitySelectItem = $dropdownMenu.find(".city-select-item" ).has("a[data-value='" + value + "']");
                text = $activeCitySelectItem.find("a" ).text();

                $activeCitySelectItem.addClass("active" ).siblings().removeClass("active");
                $input.text(text);
            } );

        },
        initTimeSelect: function initTimeSelect() {
            var _this = this,
                $timeSelect
                ;
            $timeSelect = _this.$container.find(".time-select");

            $timeSelect.each( function () {
                var $this = $(this),
                    value,
                    $dropdownMenu,
                    $input,
                    $inputYear,
                    $inputMonth,
                    $current,
                    $activeMonthItem,
                    year,
                    month
                    ;
                $dropdownMenu = $this.closest(".dropdown-menu" );
                $input = $dropdownMenu.find(".dropdown-menu-input");

                value = $input.attr("data-value");
                year = value.substring(0, 4);
                month = value.substring(4);

                $inputYear = $input.find(".yyyy");
                $inputMonth = $input.find(".mm");
                $current = $this.find(".current");

                $activeMonthItem = $this.find(".month-item" ).has("a[data-value='" + month + "']");

                // 更改月份的 active
                $activeMonthItem.addClass("active" ).siblings().removeClass("active");

                // 更改年份
                $current.attr("data-value", year ).find(".num" ).text(year);

                // 更改 input
                $inputYear.text(year);
                $inputMonth.text(month);

            } );
        }
    };
    sjfw.chart = {
        $container: "#sjfw-echart",
        myChart: null,
        option: {
            tooltip: {
                show: true
            },
            legend: {
                data:['数据统计']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ["数据项1","数据项2","数据项3","数据项4","数据项5","数据项6"]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    "name":"数量",
                    "type":"bar",
                    "data":[10, 100, 200, 600, 700, 1020],
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'}
                        ]
                    }
                }
            ]
        },

        init: function init() {
            this.render();
            //this.update();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.myChart = echarts.init( this.$container.get(0), macaronsEchartsTheme );
        },
        bind: function bind() {

        },
        update: function update( option ) {
            this.myChart.clear();
            this.myChart.setOption( option );
            return this;
        }
    };
    */

    // 数据服务、统计分析
    sjfw = {
        $container: "#sjfw",
        $tjdw: "#sjfw-tjdw-input",
        $startDate: "#sjfw-starttime-input",
        $endDate: "#sjfw-endtime-input",
        $dicSrc: "#sjfw-tjdw-input",
        $icons: ".icon-list a",
        init: function init() {
            this.render();
            this.bind();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$startDate = $( this.$startDate );
            this.$endDate = $( this.$endDate );
            this.$tjdw = $( this.$tjdw );
            this.$dicSrc = $( this.$dicSrc ).attr("data-dic-src");
            this.$icons = $( this.$icons, this.$container );
        },
        bind: function bind() {
            var _this,
                $startDate,
                $endDate,
                $tjdw
                ;
            _this = this;
            $startDate = this.$startDate;
            $endDate = this.$endDate;
            $tjdw = this.$tjdw;

            // datepicker
            $startDate.datepicker({ picker: $startDate, applyrule: function () {
                return dateHandler( "enddate", _this.$endDate );
            } });
            $endDate.datepicker({ picker: $endDate, applyrule: function () {
                return dateHandler( "startdate", _this.$startDate );
            } });

            // dic
            $tjdw.autocompleteDic();


            // 点击图标
            this.$icons.on( "click", function clickIconHandler( event ) {
                var $this,
                    tjdw,
                    startDate,
                    endDate,
                    url,
                    queryObj,
                    quertString,
                    windowName
                ;

                event.preventDefault();

                // 0. 校验
                if ( $tjdw.hasClass( "error" ) || ! $tjdw.attr("data-code") ) {
                    $tjdw.get( 0 ).focus();
                    $tjdw.trigger( "search" );
                    return;
                }

                $this = $( this );
                windowName = "sjfw_" + $this.index();

                url = $this.attr( "href" );
                quertString = "?timestamp=" + ( new Date() ).getTime();

                // 1. 请求参数
                tjdw = $tjdw.attr( "data-code" ) || "";
                startDate = $startDate.val() || "";
                endDate = $endDate.val() || "";

                queryObj = { tjdw: tjdw, startDate: startDate, endDate: endDate };
                for ( var prop in queryObj ) {
                    quertString += "&" + prop + "=" + encodeURIComponent( queryObj[ prop ] );
                }

                // 2. 打开新窗口
                top.open( url + quertString, windowName);


            } );


            function dateHandler( datePointName, $target ) {
                var returnObj,
                    targetDate,
                    date,
                    year,
                    month,
                    day
                    ;
                targetDate = $target.val() || null;
                returnObj = {};
                if ( ! targetDate ) {
                    return null;
                }
                targetDate = targetDate.split(/\D/);

                year = parseInt( targetDate[ 0 ] );
                month = parseInt( targetDate[ 1 ] );
                day = parseInt( targetDate[ 2 ] );

                date = new Date( year, month - 1, day );

                returnObj[ datePointName ] = date;

                return returnObj;
            }
        }
    };

    // 人口查询
    rkcx = {
        init: function init() {

        }
    };

    /*
        说明：
            “data”应该使用 对象“{}”来封装，而不是使用数组“[]”；
            数组也是对象，可以往数组上挂载属性，但不能以直接量的方式显示。
    */
    var Template = {
        // 区级数据
        qjsj: {
            data: [
                {
                    heading: { title: "人口", icon: "icon-rk", label: "总数：", cont: "333333_" },
                    body: [ { label: "女性：", "cont": "22222_" }, { label: "男性：", "cont": "11111_" } ]

                },
                {
                    heading: { title: "户", icon: "icon-hj", label: "总数：", cont: "4444_" },
                    body: [ { label: "家庭户：", "cont": "3333_" }, { label: "集体户：", "cont": "0001_" }, { label: "农业户：", "cont": "0010_" }, { label: "城镇户：", "cont": "1100_" } ]
                },
                {
                    heading: { title: "地址", icon: "icon-dz", label: "总数：", cont: "99999_" },
                    body: [{ label: "标准地址总数：", "cont": "4444_" }]
                }
            ],
            template: '{{~it:value:index}}\
                    <div class="data-panel">\
                        <div class="panel-heading">\
                            <p class="total"><span class="label">{{= value.heading.label }}</span><span class="cont">{{= value.heading.cont }}</span></p>\
                            <span class="icon {{= value.heading.icon }}"></span><span class="title">{{= value.heading.title }} </span>\
                        </div>\
                        <div class="panel-body">\
                        {{? value.body && value.body.length > 0  }}\
                            {{~value.body:value2:index2}}\
                                <div class="data-item {{? index2 % 2 === 0 }}line-first{{?}}">\
                                    <span class="label">{{= value2.label }}</span><span class="cont">{{= value2.cont }}</span>\
                                </div>\
                            {{~}}\
                        {{?}}\
                        </div>\
                    </div>\
                {{~}}',
            serviceStatus: {
                data:  {
                    data:[ // status属性值为"error"时显示为“运行异常”
                        { serviceName: "区级指纹平台", icon: "_0_qjzw", status: ""},
                        { serviceName: "异地办证平台", icon: "_1_ydbz", status: ""},
                        { serviceName: "自动统计服务", icon: "_2_zdtj", status: ""},
                        { serviceName: "人像比对平台", icon: "_3_rxbd", status: ""},
                        { serviceName: "区级警务综合", icon: "_4_qjjw", status: ""},
                        { serviceName: "部级联网查询", icon: "_5_bjlw", status: ""}
                        //,
                        //{ serviceName: "人口管理信息", icon: "_6_rkgl", status: ""},
                        //{ serviceName: "人口自动统计", icon: "_7_rkzdtj", status: ""},
                        //{ serviceName: "人口自动打包", icon: "_8_rkzddb", status: ""},
                        //{ serviceName: "人口业务备案", icon: "_9_rkywba", status: ""}
                    ]
                },
                template:
                    '{{~it.data:value:index}}\
                        <div class="service-status-item {{= value.icon }} {{? value.status && value.status === "error"  }}error{{?}}">\
                            <div class="icon"></div><p class="text">{{= value.serviceName }}</p>\
                        </div>\
                    {{~}}    \
                    {{  for ( var i = 0, len = 6 - it.data.length; i < len; i++ ) {  }}\
                        <div class="service-status-item empty"></div>\
                    {{ } }}\
                    <div class="clear"></div>'
            }
        },
        // 业务监管
        ywjg: {
            data: [
                { num: 1, blsj: "2017-01-14 17:01", ywlx: "出生登记", ywmc: "张三办理出生登记业务", sldw: "呼和浩特分局", "slr": "李四", "spr": "王五", "ywzt": "已通过",link: "http://www.baidu.com/?id=1" },
                { num: 2, blsj: "2017-01-13 17:01", ywlx: "出生登记2", ywmc: "张三办理出生登记业务2", sldw: "呼和浩特派出所呼和浩特派出所", "slr": "李四2", "spr": "王五2", "ywzt": "已通过2",link: "http://www.baidu.com/?id=1" },
                { num: 3, blsj: "2017-01-12 17:01", ywlx: "出生登记3", ywmc: "张三办理出生登记业务3", sldw: "呼和浩特派出所3呼和浩特派出所3", "slr": "李四3", "spr": "王五3", "ywzt": "已通过3",link: "http://www.baidu.com/?id=1" },
                { num: 4, blsj: "2017-01-11 17:01", ywlx: "出生登记4", ywmc: "张三办理出生登记业务4", sldw: "呼和浩特派出所4呼和浩特派出所4", "slr": "李四4", "spr": "王五4", "ywzt": "已通过4",link: "http://www.baidu.com/?id=1" }
            ],
            template: '{{~it:value:index}}\
                    <tr> \
                        <th>{{= value.num }}</th> \
                        <td><p title="{{= value.blsj }}">{{= value.blsj }}</p></td> \
                        <td><p title="{{= value.ywlx }}">{{= value.ywlx }}</p></td> \
                        <td><p title="{{= value.ywmc }}">{{= value.ywmc }}</p></td> \
                        <td><p title="{{= value.sldw }}">{{= value.sldw }}</p></td> \
                        <td><p title="{{= value.slr }}">{{= value.slr }}</p></td> \
                        <td><p title="{{= value.spr }}">{{= value.spr }}</p></td> \
                        <td><p title="{{= value.ywzt }}">{{= value.ywzt }}</p></td> \
                        <td><p>{{? value.link  }} <a href="javascript:businessViewDetail(\'{{= value.link }}\'),void(0);">详情</a> {{?}}</p></td> \
                    </tr> \
                {{~}}    \
                {{  for ( var i = 0, len = 4 - it.length; i < len; i++ ) {  }}\
                    <tr> \
                        <th>&nbsp;</th> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                    </tr>   \
                {{ } }}'
        },
        // 异地办理
        ydbl: {
            data: [
                { num: 1, lx: "区内异地", sqr: "张三", gmsfzhm: "123456789012345678", slrq: "2016-01-15", "zjzt": "受理待审核", "ssms": "呼和浩特市" },
                { num: 2, lx: "区内异地2", sqr: "张三2", gmsfzhm: "123456789012345678", slrq: "2016-01-15", "zjzt": "受理待审核2", "ssms": "呼和浩特市2" }
            ],
            template: '{{~it:value:index}}\
                    <tr> \
                        <th>{{= value.num }}</th> \
                        <td><p title="{{= value.lx }}">{{= value.lx }}</p></td> \
                        <td><p title="{{= value.sqr }}">{{= value.sqr }}</p></td> \
                        <td><p title="{{= value.gmsfzhm }}">{{= value.gmsfzhm }}</p></td> \
                        <td><p title="{{= value.slrq }}">{{= value.slrq }}</p></td> \
                        <td><p title="{{= value.zjzt }}">{{= value.zjzt }}</p></td> \
                        <td><p title="{{= value.ssms }}">{{= value.ssms }}</p></td> \
                    </tr> \
                {{~}}    \
                {{  for ( var i = 0, len = 10 - it.length; i < len; i++ ) {  }}\
                    <tr> \
                        <th>&nbsp;</th> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                    </tr>   \
                {{ } }}',
            tj: {
                data: {
                    /*  swmc：       单位名称。
                        sl_sldw：    受理(按受理单位)。
                        shqf_sldw：  审核签发(按受理单位)。
                        sl_sjgs：    受理(按数据归属单位)。
                        shqf_sjgs：  审核签发(按数据归属单位)。 */
                    list: [
                        { swmc: "呼和浩特市", sl_sldw: 1111, shqf_sldw: 2222, sl_sjgs: 3333, shqf_sjgs: 4444 },
                        { swmc: "呼和浩特市22222", sl_sldw: 33, shqf_sldw: 555, sl_sjgs: 22211, shqf_sjgs: 347511 }
                    ]
                },
                template: '{{~it.list:value:index}}\
                    <tr> \
                        <th>{{= index + 1 }}</th> \
                        <td><p title="{{= value.swmc }}">{{= value.swmc }}</p></td> \
                        <td class="color-key1"><p class="text-right" title="{{= value.sl_sldw }}">{{= value.sl_sldw }}</p></td> \
                        <td class="color-key1"><p class="text-right" title="{{= value.shqf_sldw }}">{{= value.shqf_sldw }}</p></td> \
                        <td class="color-key2"><p class="text-right" title="{{= value.sl_sjgs }}">{{= value.sl_sjgs }}</p></td> \
                        <td class="color-key2"><p class="text-right" title="{{= value.shqf_sjgs }}">{{= value.shqf_sjgs }}</p></td> \
                        <td>&nbsp;</td> \
                    </tr> \
                {{~}}    \
                {{  for ( var i = 0, len = 12 - it.length; i < len; i++ ) {  }}\
                    <tr> \
                        <th>&nbsp;</th> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                    </tr>   \
                {{ } }}'
            }
        },
        // 数据质量
        sjzl: {
            data: [
                {  chhm: "123456789012345678", xm: "张三", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" },
                {  chhm: "123456789012345678", xm: "张三2", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" },
                {  chhm: "123456789012345679", xm: "张三3", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" },
                {  chhm: "123456789012345679", xm: "张三4", xb: "男", csrq: "1988-08-12", pcs: "派出所1号", lxdh: "18781222788" }
            ],
            template: '{{~it:value:index}}\
                    <tr {{? value.copy  === 1  }} \
                            class="copy" \
                        {{?? value.copy  === 0 }}\
                            class="lead-copy"\
                        {{??}} \
                        {{?}} \
                        data-group-id="{{= value.groupId }}"> \
                        <th>{{? value.copy  === 0  }} {{= value.groupId }} {{?}}</th> \
                        <td><p title="{{= value.chhm }}">{{= value.chhm }}</p></td> \
                        <td><p title="{{= value.xm }}">{{= value.xm }}</p></td> \
                        <td><p title="{{= value.xb }}">{{= value.xb }}</p></td> \
                        <td><p title="{{= value.csrq }}">{{= value.csrq }}</p></td> \
                        <td><p title="{{= value.pcs }}">{{= value.pcs }}</p></td> \
                        <td><p title="{{= value.lxdh }}">{{= value.lxdh }}</p></td> \
                        <td>&nbsp;</td> \
                    </tr> \
                {{~}}    \
                {{  for ( var i = 0, len = 4 - it.length; i < len; i++ ) {  }}\
                    <tr> \
                        <th>&nbsp;</th> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                        <td><p>&nbsp;</p></td> \
                    </tr>   \
                {{ } }}'
        }
    };

    //---------

    $( function () {

        main.init();

        window._main = main;
    } );

}( jQuery );