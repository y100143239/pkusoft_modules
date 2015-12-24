/**
 * 遮罩层，遮罩整个页面
 */

define( [ "utils/utils" ], function ( utils ) {
    var classList = utils.classList,
        getMaxZindex = utils.getMaxZindex;

    var overlay = {
        win: top, // 默认遮罩住顶层
        _id: "overlay_20151224235800",/* 通用 */
        container: null,
        init: function () {
            var doc,
                overlayContainer,
                overlayId;

            doc = this.win.document;

            // 如果存在则直接使用
            overlayContainer = doc.getElementById(this._id);
            if ( overlayContainer ) {
                this.container = overlayContainer;
                return this;
            }

            overlayId = this._id;
            overlayContainer = doc.createElement( "div" );
            overlayContainer.id = overlayId;
            overlayContainer.className = "overlay-container";
            overlayContainer.style.zIndex = getMaxZindex( this.win ) + 1;
            overlayContainer.innerHTML = '<div class="overlay"></div>';
            doc.body.appendChild(overlayContainer);

            this.container = overlayContainer;

            return this;
        },

        hide: function () {
            this.container || this.init();
            classList(this.container ).remove("show");
            return this;
        },
        show: function () {
            this.container || this.init();
            classList(this.container ).add("show");
            return this;
        },
        destory: function () {
            this.win.document.body.removeChild(this.container);
            this.container = null;
            return this;
        }
    };

    return overlay;

} );