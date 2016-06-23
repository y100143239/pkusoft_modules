
define( ["jquery"], function ( $ ) {

    $( document ).ready( function () {

        $( ".sidebar-menu" ).on( "click", ".treeview > a", function () {
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
        } );

    } );

} );
