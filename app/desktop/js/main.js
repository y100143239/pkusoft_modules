define( function ( require ) {
    var $,
        Swiper,
        launchpadSwiper
        ;
    $ = require( "jquery" );
    Swiper = require( "swiper" );

    launchpadSwiper = new Swiper( ".swiper-container", {
        pagination: ".launchpad-pagination-switchList",
        loop: true,
        grabCursor: true,
        paginationClickable: true
    } );
    $( ".launchpad-pagination-previous" ).on( "click", function ( e ) {
        e.preventDefault();
        launchpadSwiper.swipePrev();
    } );
    $( ".launchpad-pagination-next" ).on( "click", function ( e ) {
        e.preventDefault();
        launchpadSwiper.swipeNext();
    } );
} );