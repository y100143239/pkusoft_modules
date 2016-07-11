define( [ "jquery", "bootstrap" ], function ( $ ) {

    $( document ).ready( function () {
        var $main,
            $wrap
            ;
        $main = $( "main.main" );
        $wrap = $( ".wrap" );

        $( ".sidebar-menu" ).on( "click.title", ".treeview > a", function () {
            var $this,
                $arrow,
                $menu
                ;
            $this = $( this );
            $arrow = $this.find( ".fa-angle-left" );
            $menu = $this.next();

            $arrow.toggleClass( "fa-angle-down" );
            //
            if ( $arrow.is( ".fa-angle-down" ) ) {
                $menu.show();
            } else {
                $menu.hide();
            }
            return false;
        } ).on( "click.page", ".treeview-menu a", function () {
            var $this;
            $this = $( this );

            $wrap.append( '<div class="overlay overlay-black"><i class="fa fa-spinner fa-spin"></i></div>' );

            $main.load( $( this ).attr( "href" ), function successCallback() {
                //alert( "loaded" );
                $wrap.children( ".overlay" ).remove();
                window["PR"] && window["PR"].prettyPrint();
            } );
            $this.closest( ".sidebar-menu" ).find( ".active" ).removeClass( "active" );
            $this.parent().addClass( "active" );
            $this.closest( ".treeview" ).addClass( "active" );
            return false;
        } );

        $( ".treeview-menu .active a" ).trigger( "click" );

    } );

} );
