+function( $ ){

    $(function () {
        $(".switch" ).on("click", function() {
            $(this ).toggleClass("switch-on");
        })
    });

}(jQuery);