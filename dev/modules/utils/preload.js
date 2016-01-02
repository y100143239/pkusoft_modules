+function(){

    document.write('<div class="preloader" id="preloader"><div class="item"><div class="spinner"><!--[if lt IE 9]><span>Loading!</span><![endif]--></div></div></div>');

    if( window.addEventListener )  {
        window.addEventListener("load",preLoadhandler, false);
    } else {
        window.attachEvent("onload",preLoadhandler);
    }
    function preLoadhandler() {
        setTimeout( function(){
            ( window.jQuery && jQuery("#preloader" ).fadeOut(500) ) ||
            ( document.getElementById("preloader").style.display = "none" );
        }, 2000);
    }
}();