+function ( $ ) {
    var Utils = {};
    var main = {};
    var qjsj = {}; // 区级数据
    var ywjg = {}; // 业务监管

    Utils.ajax = function ( options ) {
        var setting = {
            type: "POST", //请求方式 ("POST" 或 "GET")
            url: "", // 请求的URL
            data: { name: "value" },
            timeout: 3000, // 设置请求超时时间（毫秒）
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
            if ( ! this._isAdded( $target ) ) {
                this._add( $target );
            }
            $target.find(".wait-overlay" ).show();
            return this;
        },
        hide: function hide( $target ) {
            $target.find(".wait-overlay" ).hide();
            return this;
        },
        _add: function ( $target ) {
            $target.css("position", function ( index, val ) {
                return val === "static" ? "relative" : val;
            });
            $target.append( "<div class='wait-overlay'></div>" );
            return this;
        },
        _isAdded: function ( $target ) {
            return $target.find( ".wait-overlay" ).length > 0;
        }
    };

    main = {
        $bottomMenu: null,
        init: function () {
            qjsj.init();
            ywjg.init();
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
            requestSetting.url = $target.attr("data-url");
            requestSetting.successCallback = $target.attr("data-success-callback");
            requestSetting.errorCallback = $target.attr("data-error-callback");
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
                if ( _this.isUpading ) {
                    Utils.wait.show( _this.$container );
                    return;
                }
                _this.isUpading = true;

                _this.update( $this );
            } );
            return this;
        },
        update: function ($item) {
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

                    window[ successCallback ]( arguments );

                    html = doT.template( template )( responseData );
                    _this.$container.html( html );
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
                },
                error: function () { // 此处为测试数据

                    //window[ errorCallback ]( arguments );

                    data = Template.qjsj.data;

                    window[ errorCallback ]( data, cityId );

                    html = doT.template( template )( data );
                    _this.$container.html( html );
                    _this.isUpading = false;
                    Utils.wait.hide( _this.$container );
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
        init: function init() {
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
            $navItems.on( "click", function navItemClickHandler(event) {
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
                $activeTimeMenuItem
                ;

            // 0. 判断是否正在更新数据
            if ( this.isUpading ) {
                Utils.wait.show( this.$container );
                return this;
            }
            this.isUpading = true;

            $activeNavItem = _this.$navItems.filter( ".active" );
            $activeTimeMenuItem = _this.$timeMenuItems.filter( ".active" );
            time = $activeTimeMenuItem.attr( "data-value" );
            timeText = $activeTimeMenuItem.text().substring(0,2);
            type = $activeNavItem.attr( "data-value" );
            title = $activeNavItem.find( "select option:selected" ).text() || $activeNavItem.text();

            // 1. 获取数据
            this._getData(
                { "time": time, "type": type },
                function getDataSuccessHandler( responseData ) {
                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, title + "|" + timeText  );
                },
                function getDataErrorHandler() { // 测试数据
                    var data = _this.data;
                    for ( var prop in data ) {
                        if ( prop === "maxNum" ) continue;
                        data[ prop ] = ( data[ "maxNum" ] * Math.random() ).toFixed( 0 );
                    }
                    _this._render( data, title + " |" + timeText );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            Utils.ajax( {
                url: "xx",
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
        init: function init() {
            this.render()
                .bind()
                .update();
            return this;
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$navItems = $( this.$navItems , this.$container );
            this.$timeMenuItems = $( this.$timeMenuItems );
            this.$tbody = $( this.$tbody, this.$container );
            return this;
        },
        bind: function bind() {
            var $navItems = this.$navItems,
                _this = this;
            $navItems.on( "click", function navItemClickHandler( event) {
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
                time,
                type,
                $activeNavItem
                ;

            // 0. 判断是否正在更新数据
            if ( this.isUpading ) {
                Utils.wait.show( this.$container );
                return this;
            }
            this.isUpading = true;

            $activeNavItem = _this.$navItems.filter( ".active" );
            time = _this.$timeMenuItems.filter( ".active" ).attr( "data-value" );
            type = $activeNavItem.attr( "data-value" );

            // 1. 获取数据
            this._getData(
                { "time": time, "type": type },
                function getDataSuccessHandler( responseData ) {
                    // 2. 更新到页面（获取数据成功）
                    _this._render( responseData, Template.ywjg.template );
                },
                function getDataErrorHandler() { // 测试数据
                    _this._render( Template.ywjg.data.slice(0, Math.floor( 4 * Math.random() ) ), Template.ywjg.template );
                }
            );


        },
        _getData: function getData( queryData, successCallback, errorCallback ) {
            Utils.ajax( {
                url: "xx",
                data: queryData, // { "time": time, "type": type }
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
            this.$tbody.html( doT.template( template ) ( data ) );
            return this;
        }
    };

    var Template = {
        qjsj: {
            data: [
                {
                    heading: { title: "人口", icon: "data_icon_1", label: "总数：", cont: "333333_" },
                    body: [ { label: "女性：", "cont": "22222_" }, { label: "男性：", "cont": "11111_" } ]
                },
                {
                    heading: { title: "户", icon: "data_icon_2", label: "总数：", cont: "4444_" },
                    body: [ { label: "家庭户：", "cont": "3333_" }, { label: "集体户：", "cont": "0001_" }, {
                        label: "农业户：",
                        "cont": "0010_"
                    }, { label: "城镇户：", "cont": "1100_" } ]
                },
                {
                    heading: { title: "地址", icon: "data_icon_3", label: "总数：", cont: "99999_" },
                    body: []
                }
            ],

            template: '{{~it:value:index}}\
                    <div class="data-panel">\
                        <div class="panel-heading">\
                            <p class="total"><span class="label">{{= value.heading.label }}</span><span class="cont">{{= value.heading.cont }}</span></p>\
                            <img class="icon" src="./images/{{= value.heading.icon }}.png"><span class="title">{{= value.heading.title }} </span>\
                        </div>\
                        {{? value.body && value.body.length > 0  }}\
                            <div class="panel-body">\
                            {{~value.body:value2:index2}}\
                                <div class="data-item {{? index2 % 2 === 0 }}line-first{{?}}">\
                                    <span class="label">{{= value2.label }}</span><span class="cont">{{= value2.cont }}</span>\
                                </div>\
                            {{~}}\
                            </div>\
                        {{?}}\
                    </div>\
                {{~}}'
        },
        ywjg: {
            data: [
                { num: 1, blsj: "2017-01-14 17:01", ywlx: "出生登记", ywmc: "张三办理出生登记业务", ssms: "呼和浩特", "slr": "李四", "spr": "王五", "ywzt": "已通过" },
                { num: 2, blsj: "2017-01-13 17:01", ywlx: "出生登记2", ywmc: "张三办理出生登记业务2", ssms: "呼和浩特2", "slr": "李四2", "spr": "王五2", "ywzt": "已通过2" },
                { num: 3, blsj: "2017-01-12 17:01", ywlx: "出生登记3", ywmc: "张三办理出生登记业务3", ssms: "呼和浩特3", "slr": "李四3", "spr": "王五3", "ywzt": "已通过3" },
                { num: 4, blsj: "2017-01-11 17:01", ywlx: "出生登记4", ywmc: "张三办理出生登记业务4", ssms: "呼和浩特4", "slr": "李四4", "spr": "王五4", "ywzt": "已通过4" }
            ],
            template:
                '{{~it:value:index}}\
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
        }
    };

    //---------

    $( function () {

        main.init();

    } );

}( jQuery );