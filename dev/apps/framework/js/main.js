define( [ "jquery", "bootstrap", "formvalidationI18N"], function ( $ ) {

    $( document ).ready( function () {
        var $main,
            $body
            ;
        $main = $( "main.main" );
        $body = $( document.body );

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
        } );
        $( document ).on( "click.page", ".sidebar-menu .treeview-menu a, .top-link", function () {
            var $this,
                url
                ;
            $this = $( this );
            if ( $this.is( "._outerlink" ) ) {
                return;
            }
            url = $( this ).attr( "href" ) + "?VERSION=" + VERSION;
            $body.append( '<div class="overlay overlay-black"><i class="fa fa-spinner fa-spin"></i></div>' );

            $main.load( url, function successCallback() {
                $body.children( ".overlay" ).remove();
                window["PR"] && window["PR"].prettyPrint();
            } );
            window["PR"] && window["PR"].prettyPrint();
            if ( $this.is( ".top-link" ) ) {
                return false;
            }
            $this.closest( ".sidebar-menu" ).find( ".active" ).removeClass( "active" );
            $this.parent().addClass( "active" );
            $this.closest( ".treeview" ).addClass( "active" );
            return false;
        } );

        //$( ".treeview-menu .active a" ).trigger( "click" );

    } );

} );
