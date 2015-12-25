/**
 * 遮罩层，遮罩整个页面
 */

define( [ "utils/utils" ], function ( utils ) {
    var classList = utils.classList,
        getMaxZindex = utils.getMaxZindex,
        extend = utils.extend;

    /**
     * @param options = {
     *      win: top,
     *      idleTime: 30000
     * }
     *
     * @constructor
     */
    function Overlay(options) {
        extend(this, options);
        this.win = this.win || top;
        this.idleTime = this.idleTime || 30000;
    }

    Overlay.getInstance = function( options ) {
        return new Overlay(options);
    };
    extend( Overlay.prototype, {
        init: function () {
            var doc,
                overlayContainer
                ;

            doc = this.win.document;

            overlayContainer = doc.createElement( "div" );
            overlayContainer.className = "overlay-container";
            overlayContainer.style.zIndex = getMaxZindex( this.win ) + 1;
            overlayContainer.innerHTML = '<div class="overlay"></div>';
            doc.body.appendChild(overlayContainer);

            this.container = overlayContainer;

            return this;
        },
        hide: function () {
            var _this = this;
            this.container || this.init();
            classList(this.container ).remove("active");
            this.timerId = this.win.setTimeout( function(){
                _this.destroy();
            }, this.idleTime );
            return this;
        },
        show: function () {
            this.timerId && this.win.clearTimeout( this.timerId );
            this.container || this.init();
            classList(this.container ).add("active");
            return this;
        },
        destroy: function () {
            this.container || this.init();
            this.win.document.body.removeChild(this.container);
            this.container = null;
            this.timerId = null;
            return this;
        }
    } );

    return Overlay;

} );