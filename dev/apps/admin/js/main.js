require( [
      "jquery", // 1
      JS_BASE_URL + "_dialog.js", // 2
      JS_BASE_URL + "_form.js", // 3
      JS_BASE_URL + "_login_page.js", // 4
      "formvalidationI18N", "bootstrap", "bootgrid"
    ],
    function (
      $,            // 1
      Dialog,       // 2
      Form,         // 3
      LoginPage,    // 4
      _fv, _bs, _bootgrid

    ) {
        "use strict";
    var $doc,
        IndexPage
    ;

    $doc = $( document );



    IndexPage = {
        $container: ".page-index",
        $sidebar: ".sidebar",
        $contentWrap: "#content-wrap",
        init: function init() {
            this.render();
            this.bind();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$sidebar = $( this.$sidebar, this.$container );
            this.$contentWrap = $( this.$contentWrap );
        },
        bind: function bind() {
            var _this
            ;
            _this = this;
            // 点击链接
            this.$sidebar.on( "click", "a", function( e ) {
                var $this,
                    url
                ;
                e.preventDefault();
                $this = $( this );
                url = $this.attr( "href" );
                if ( url.indexOf( "#" ) === -1 ) {
                    return;
                }
                url = url.substring(1);

                // 打开遮罩层
                window.startOverlay();

                jQuery.ajax( {
                    url: url,
                    type: "POST",
                    dataType: "html"
                } ).done( function( responseText ) {
                    _this.$contentWrap.html( responseText );
                    $this.parent( ".sidebar-menu-item" ).addClass( "active" ).siblings().removeClass( "active" );
                } ).fail( function () {
                    new Dialog ( { title: "错误", content: "网络异常。" } );
                } ).complete( function () {
                    // 关闭遮罩层
                    window.removeOverlay();
                } );
            } );

        }
    };





    // -----------
    $doc.ready( function () {

        if ( $doc.find( LoginPage.$container ).size() > 0 ) {
            LoginPage.init();
        }
        if ( $doc.find( IndexPage.$container ).size() > 0 ) {
            IndexPage.init();
            // 初始化datagrid
            //$( '[data-pku-widget="datagrid"]' ).bootgrid();

        }



    } );

});


