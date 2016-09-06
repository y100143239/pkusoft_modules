require( [ "jquery", "bootstrap" ], function ( $ ) {

    $( document ).ready( function() {
        $('[data-toggle="tooltip"]').tooltip({
            container: "body"
        });
        $( ".toggle" ).on( "click", function(){
            var $this
            ;
            $this = $( this );

            if ( $this.is( ".toggle-login" ) ) { // 点击 注册

                $this.removeClass( "toggle-login" );
                $this.attr( "data-original-title", "登陆" );

            } else { // 点击 登陆
                $this.addClass( "toggle-login" );
                $this.attr( "data-original-title", "注册" );
            }

        } );
    } );


} );
