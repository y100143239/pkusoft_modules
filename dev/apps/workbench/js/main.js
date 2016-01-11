+function ( $ ) {
    var qjsj = {}; // 区级数据
    qjsj.map = {
        $items: null,
        init : function () {
            this.render().bind();
        },
        render: function () {
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

            return this;
        }
    };

    $( function () {
        // 区级数据
        qjsj.map.init();
    } );

}( jQuery );