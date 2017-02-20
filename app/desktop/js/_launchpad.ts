declare function define(...args: any[]): any;
/**
 * Created by forwardNow on 2/20/17.
 */
define(function (require) {
    let $,
        Swiper,
        Launchpad
        ;
    $ = require("jquery");
    Swiper = require("swiper");
    require( "jquery-ui" );
    Launchpad = {
        swiper: null,
        previousBtn: ".launchpad-pagination-previous",
        nextBtn: ".launchpad-pagination-next",
        pagination: ".launchpad-pagination-switchList",
        shortcut: ".launchpad-shortcut",
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {

            this.previousBtn = $(this.previousBtn);
            this.nextBtn = $(this.nextBtn);
            this.shortcut = $( this.shortcut );
        },
        bind: function () {
            let that;
            that = this;

            this.swiper = new Swiper(".swiper-container", {
                eventTarget : 'wrapper',
                // noSwiping : true,
                pagination: this.pagination,
                loop: true,
                grabCursor: true,
                paginationClickable: true
            });
            this.previousBtn.on("click mouseover", function (e) {
                e.preventDefault();
                that.swiper.swipePrev();
            });
            this.nextBtn.on("click mouseover", function (e) {
                e.preventDefault();
                that.swiper.swipeNext();
            });



            $( ".launchpad-shortcutpad" ).sortable({
                connectWith: ".launchpad-shortcutpad",
                handle: ".launchpad-shortcut-icon",
                placeholder: "launchpad-shortcut-placeholder"
            }).disableSelection();

        }
    };

    $( document ).ready( function() {
        Launchpad.init();
    } );
});