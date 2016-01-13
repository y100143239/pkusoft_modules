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

    main = {
        $bottomMenu: null,
        init: function() {
            qjsj.map.init();
            ywjg.init();
            this.render().bind();
        },
        render: function () {
            this.$bottomMenu = $(".bottom-menu");
            return this;
        },
        bind: function () {
            this.$bottomMenu.find(".bottom-menu-item" ).on("click", function bottomMenuItemClickHandler(){
                var $this = $(this ),
                    targetId = $this.attr("data-id");

                $this.addClass("active" ).siblings().removeClass("active");
                if ( !targetId ) {
                    return ;
                }
                $( "#" + targetId ).show().siblings().hide();
            });
            return this;
        }
    };

    qjsj.map = {
        $container: null,
        $items: null,
        init : function () {
            this.render().bind();
        },
        render: function () {
            this.$container = $( ".js--qjsj-data" );
            this.$items = $( ".map-hot-item" );
            return this;
        },
        bind: function () {
            var _this = this;
            this.$items.on("click", function () {
                var $this = $(this);
                // 1. 更改状态
                _this._updateStatus( $this );
                // 2. 更新数据
                _this._updateData( $this.attr("data-city-id") );
            });
            return this;
        },
        _updateStatus: function _updateStatus( $target ) {
            // 1. change active item
            $target.addClass("active" ).siblings().removeClass("active");
            // 2. change currrent
            $( ".map-current .cur-city" ).text( $target.find(".tip" ).text() );
            return this;
        },
        _updateData: function _updateData( cityId ) {
            // 发送 Ajax 请求
            // 处理数据
            var _this = this,
                template,
                data,
                html
                ;

            template = Template.qjsj.template;

            Utils.ajax({
                url: "",
                data: { "cityId": cityId },
                success: function ( responseData ) {
                    html = doT.template( template )( responseData );
                    _this.$container.html( html );
                },
                error: function () { // 此处为测试数据
                    data = Template.qjsj.data;
                    data[0 ].heading.cont = "3333_" + cityId;
                    data[1 ].heading.cont = "3333_" + cityId;
                    data[2 ].heading.cont = "3333_" + cityId;
                    html = doT.template( template )( data );
                    _this.$container.html( html );
                }
            });

            return this;
        }
    };

    ywjg = {
        $container: null,
        $timeMenuItems: null,
        $navItems: null,
        init: function init() {
            this.render().bind();
            return this;
        },
        render: function render() {
            this.$container = $("#ywjg");
            this.$timeMenuItems = $(".time-menu-item", this.$container);
            this.$navItems = $(".nav-item", this.$container);
            return this;
        },
        bind: function bind() {
            this.$timeMenuItems.on("click", function timeMenuItemClickHandler(){
                var $this = $(this);
                $this.addClass("active" ).siblings().removeClass("active");
            });
            this.$navItems.on("click", function navItemClickHandler(){
                var $this = $(this);
                $this.addClass("active" ).siblings().removeClass("active");
            });
            return this;
        }
    };
    var Template = {
        qjsj: {
            data: [
                { heading: { title: "人口", icon: "data_icon_1", label: "总数：", cont: "333333_" },
                    body: [ { label: "女性：", "cont": "22222_"}, { label: "男性：", "cont": "11111_"} ]
                },
                { heading: { title: "户", icon: "data_icon_2", label: "总数：", cont: "4444_" },
                    body: [ { label: "家庭户：", "cont": "3333_"}, { label: "集体户：", "cont": "0001_"}, { label: "农业户：", "cont": "0010_" }, { label: "城镇户：", "cont": "1100_" } ]
                },
                { heading: { title: "地址", icon: "data_icon_3", label: "总数：", cont: "99999_" },
                    body: []
                }
            ],

            template:
                '{{~it:value:index}}\
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

}

    };

    //---------

    $( function () {

        main.init();

        // 区级数据
        qjsj.map.$items[0 ].click();

    } );

}( jQuery );