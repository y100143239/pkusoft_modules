+function ( $ ) {
    var qjsj = {}; // 区级数据
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
            var template = Template.qjsj.template;
            var data = Template.qjsj.data;
            var html;

            data[0 ].heading.cont = "3333_" + cityId;
            data[1 ].heading.cont = "3333_" + cityId;
            data[2 ].heading.cont = "3333_" + cityId;

            html = doT.template( template )( data );

            this.$container.html( html );

            return this;
        }
    };

    $( function () {
        // 区级数据
        qjsj.map.init();
    } );


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

}( jQuery );