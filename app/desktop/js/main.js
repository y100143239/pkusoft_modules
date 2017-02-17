define( function ( require ) {
    var $,
        swiper
        ;
    $ = require( "jquery" );
    require( "swiper" );
    var mySwiper = new window.Swiper( '.swiper-container', {
        pagination: '.launchpad-pagination-switchList',
        loop: true,
        grabCursor: true,
        paginationClickable: true
    } );
    $( '.launchpad-pagination-previous' ).on( 'click', function ( e ) {
        e.preventDefault();
        mySwiper.swipePrev();
    } );
    $( '.launchpad-pagination-next' ).on( 'click', function ( e ) {
        e.preventDefault();
        mySwiper.swipeNext();
    } );
} );