+function ( $ ) {
    var Utils = {},
        main = {},
        qjsj = {},  // 区级数据
        ywjg = {},  // 业务监管
        ydbl = {},  // 异地办理
        sjzl = {}   // 数据质量
        ;

    Utils.ajax = function ( options ) {
        var setting = {
            type: "POST", //请求方式 ("POST" 或 "GET")
            url: "", // 请求的URL
            data: { name: "value" },
            timeout: 30000, // 设置请求超时时间（毫秒）
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
            if ( !this._isAdded( $target ) ) {
                this._add( $target );
            }
            $target.find( ".wait-overlay" ).show();
            return this;
        },
        hide: function hide( $target ) {
            $target.find( ".wait-overlay" ).hide();
            return this;
        },
        _add: function ( $target ) {
            $target.css( "position", function ( index, val ) {
                return val === "static" ? "relative" : val;
            } );
            $target.append( "<div class='wait-overlay'></div>" );
            return this;
        },
        _isAdded: function ( $target ) {
            return $target.find( ".wait-overlay" ).length > 0;
        }
    };
    Utils.alert = {
        html: '<div class="alert alert-warning"> <button type="button" class="close" ><span>×</span></button> <strong>提示：</strong>网络繁忙，请稍后重试！</div>',
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
            _this.$currentPage.val( pageNum );
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
        init: function () {
            qjsj.init();
            ywjg.init();
            ydbl.init();
            sjzl.init();
            this.render().bind();
        },
        render: function () {
            this.$bottomMenu = $( ".bottom-menu" );
            return this;
        },
        bind: function () {
            this.$bottomMenu.find( ".bottom-menu-item" ).on( "click", function bottomMenuItemClickHandler() {
                var $this = $( this ),
                    targetId = $this.attr( "data-id" );

                $this.addClass( "active" ).siblings().removeClass( "active" );
                if ( !targetId ) {
                    return;
                }
                $( "#" + targetId ).show().siblings().hide();
            } );
            return this;
        }
    };

    // 区级数据
    qjsj = {
        $container: null,
        $items: null,
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
        },
        render: function () {
            this.$container = $( ".js--qjsj-data" );
            this.$items = $( ".map-hot-item" );
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
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                },
                error: function () { // 此处为测试数据



                    data = Template.qjsj.data;

                    //---- 错误处理

                    window[ errorCallback ]( data, cityId );

                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );

                    //---- 测试数据
                    if ( IS_DEV !== true ) return;
                    html = doT.template( template )( data );
                    _this.$container.html( html );
                }
            } );

            return this;
        }
    };

    // 业务监管
    ywjg = {
        $container: null,
        $timeMenuItems: null,
        init: function init() {
            this.render().bind();
            this.totality.init();
            this.view.init();
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
                ywjg.view.update();
                event.preventDefault();
            } );
            return this;
        }
    };

    // 业务监管-业务总量
    ywjg.totality = {
        $container: "#ywjg .tabs-business-total",
        $navItems: ".nav-item",
        $chart: "#ywjg .chart",
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
                .bind()
                .update();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$chart = $( this.$chart );
            this.$navItems = $( this.$navItems, this.$container );
            this.$timeMenuItems = $( this.$timeMenuItems );
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

            _this.$chart.find( ".percent" ).on( "click", function () {
                $( this ).toggleClass( "active" );
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

                    window[ errorCallback ]( _this.data );

                    var data = _this.data;

                    _this._render( data, title + " |" + timeText );
                }
            );


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
            this.update();
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

            return this;
        },
        update: function update( pageNum ) {
            var _this = this,
                queryData = {},
                time,
                type,
                $activeNavItem
                ;

            // 0. 判断是否正在更新数据
            Utils.wait.show( this.$container );
            if ( this.isUpading ) {
                return this;
            }
            this.isUpading = true;

            $activeNavItem = _this.$navItems.filter( ".active" );
            time = _this.$timeMenuItems.filter( ".active" ).attr( "data-value" );
            type = $activeNavItem.attr( "data-value" );

            queryData[ "time" ] = time;
            queryData[ "type" ] = type;
            queryData[ "pageNum" ] = pageNum || 1;

            // 1. 获取数据
            this._getData(
                queryData,
                function getDataSuccessHandler( responseData ) {

                    responseData = window[ _this.requestSetting.successCallback ]( responseData );

                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ywjg.template );
                    _this.pagination.update( responseData[ "totalRecords" ] || "", responseData[ "pageNum" ] || "1" );
                },
                function getDataErrorHandler() { // 测试数据

                    window[ _this.requestSetting.errorCallback ]();

                    _this._render( Template.ywjg.data.slice( 0, Math.floor( 4 * Math.random() ) ), Template.ywjg.template );
                    _this.pagination.update( "1", "1" );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            var _this = this;
            Utils.ajax( {
                url: _this.requestSetting.url,
                data: queryData, // { "time": time, "type": type, "pageNum": pageNum }
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
        $form: ".search form",
        $tbody: ".tbody-main",
        isUpading: false, // 是否在更新数据
        requestSetting: {
            $target: "#ydbl .tabs",
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

                    window[ _this.requestSetting.errorCallback ]();

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
    ydbl.pagination = new Pagination({
        updateData: function( pageNum ) {
            var _this = ydbl;
            _this.update.call( _this, pageNum );
        },
        pageSize: 10,
        $container : "#ydbl"
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

                    var data = window[ errorCallback ]( _this.data );

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
            this.bind();
            this.pagination.init();
            this.update();
            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$tbody = $( this.$tbody, this.$container );
            return this;
        },
        bind: function bind() {

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

                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ywjg.template );
                    _this.pagination.update( responseData[ "totalRecords" ] || "", responseData[ "pageNum" ] || "1" );
                },
                function getDataErrorHandler() { // 测试数据

                    window[ _this.requestSetting.errorCallback ]();

                    _this._render( Template.sjzl.data.slice( 0, Math.floor( 4 * Math.random() ) ), Template.sjzl.template );
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
            //
            return this;
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
                    heading: { title: "人口", icon: "data_icon_1", label: "总数：", cont: "333333_" },
                    body: [ { label: "女性：", "cont": "22222_" }, { label: "男性：", "cont": "11111_" } ]

                },
                {
                    heading: { title: "户", icon: "data_icon_2", label: "总数：", cont: "4444_" },
                    body: [ { label: "家庭户：", "cont": "3333_" }, { label: "集体户：", "cont": "0001_" }, { label: "农业户：", "cont": "0010_" }, { label: "城镇户：", "cont": "1100_" } ]
                },
                {
                    heading: { title: "地址", icon: "data_icon_3", label: "总数：", cont: "99999_" },
                    body: [{ label: "标准地址总数：", "cont": "4444_" }]
                }
            ],
            /*
            data.serviceStatus:[
                { serviceName: "信息通信服务平台", status: "" },
                { serviceName: "异地办证平台", status: "error" },
                { serviceName: "区级指纹平台", status: "" },
                { serviceName: "自动统计服务", status: "" },
                { serviceName: "制证打包服务", status: "" }
            ],
            */
            template: '{{~it:value:index}}\
                    <div class="data-panel">\
                        <div class="panel-heading">\
                            <p class="total"><span class="label">{{= value.heading.label }}</span><span class="cont">{{= value.heading.cont }}</span></p>\
                            <img class="icon" src="./images/{{= value.heading.icon }}.png"><span class="title">{{= value.heading.title }} </span>\
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
                {{~}}'
        },
        // 业务监管
        ywjg: {
            data: [
                { num: 1, blsj: "2017-01-14 17:01", ywlx: "出生登记", ywmc: "张三办理出生登记业务", ssms: "呼和浩特", "slr": "李四", "spr": "王五", "ywzt": "已通过" },
                { num: 2, blsj: "2017-01-13 17:01", ywlx: "出生登记2", ywmc: "张三办理出生登记业务2", ssms: "呼和浩特2", "slr": "李四2", "spr": "王五2", "ywzt": "已通过2" },
                { num: 3, blsj: "2017-01-12 17:01", ywlx: "出生登记3", ywmc: "张三办理出生登记业务3", ssms: "呼和浩特3", "slr": "李四3", "spr": "王五3", "ywzt": "已通过3" },
                { num: 4, blsj: "2017-01-11 17:01", ywlx: "出生登记4", ywmc: "张三办理出生登记业务4", ssms: "呼和浩特4", "slr": "李四4", "spr": "王五4", "ywzt": "已通过4" }
            ],
            template: '{{~it:value:index}}\
                    <tr> \
                        <th>{{= value.num }}</th> \
                        <td><p title="{{= value.blsj }}">{{= value.blsj }}</p></td> \
                        <td><p title="{{= value.ywlx }}">{{= value.ywlx }}</p></td> \
                        <td><p title="{{= value.ywmc }}">{{= value.ywmc }}</p></td> \
                        <td><p title="{{= value.ssms }}">{{= value.ssms }}</p></td> \
                        <td><p title="{{= value.slr }}">{{= value.slr }}</p></td> \
                        <td><p title="{{= value.spr }}">{{= value.spr }}</p></td> \
                        <td><p title="{{= value.ywzt }}">{{= value.ywzt }}</p></td> \
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
                {{ } }}'
        },
        // 数据质量
        sjzl: {
            data: [
                { num: 1, chhm: "123456789012345678", xm: "张三", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
                { num: 2, chhm: "", xm: "张三2", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
                { num: 3, chhm: "123456789012345678", xm: "张三3", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
                { num: 4, chhm: "", xm: "张三4", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" }
            ],
            template: '{{~it:value:index}}\
                    <tr> \
                        <th>{{= value.num }}</th> \
                        <td><p title="{{= value.chhm }}">{{= value.chhm }}</p></td> \
                        <td><p title="{{= value.xm }}">{{= value.xm }}</p></td> \
                        <td><p title="{{= value.xb }}">{{= value.xb }}</p></td> \
                        <td><p title="{{= value.csrq }}">{{= value.csrq }}</p></td> \
                        <td><p title="{{= value.hjszd }}">{{= value.hjszd }}</p></td> \
                        <td><p title="{{= value.lxdh }}">{{= value.lxdh }}</p></td> \
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

    } );

}( jQuery );