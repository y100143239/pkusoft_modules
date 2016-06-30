
define( ["jquery", "bootstrap"], function ( $) {

    $( document ).ready( function () {
        var $main
            ;
        $main = $( "main.main" );

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
            $main.load( $( this ).attr( "href" ) );
            $this.closest( ".sidebar-menu" ).find( ".active" ).removeClass( "active" );
            $this.parent().addClass( "active" );
            $this.closest( ".treeview" ).addClass( "active" );
            return false;
        } );

        $( ".treeview-menu .active a" ).trigger( "click" );

    } );

} );
