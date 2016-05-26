$( document ).ready( function ( $ ) {

    var $srcMap, // 原始地图
        relDir, // 图片相对路径
        originImgSrc // 原始地图图片路径
        ;

    relDir = "images/";

    $srcMap = $( "#srcMap" );

    originImgSrc = $srcMap.prop( "src" ); // 保存原始图片地址

    $( "#map-areas" ).on( "mouseenter", "area", function () { // 鼠标移入热点后，切换图片
        var imgSrc
            ;
        imgSrc = relDir + $( this ).attr( "data-img-src" );
        $srcMap.prop( "src", imgSrc );

        return false;
    } ).on( "mouseleave", "area", function () { // 鼠标移出热点后，还原图片

        $srcMap.prop( "src", originImgSrc );

        return false;
    } ).on( "click", "area", function () {
        // 取消点击后进行页面跳转
        return false;
    } ).on( "focus", "area", function() {
        // 禁止获取焦点（获取焦点后会有蓝色边框）
        // 也可以通过 css 来取消获取交掉后的样式--> area:focus { outline: none 0; }
        // 注释掉下面语句后 可看见点击时获取焦点的热点区域
        // $( this ).trigger( "blur" );
    } );


    var $container,
        containerPos,
        $axisX,
        $axisY
    ;

    $container = $( "#getPos" );
    containerPos = $container.offset();
    $axisX = $( ".axis-x" );
    $axisY = $( ".axis-y" );


    $container.on( "mousemove", function ( event ) {
        var x,
            y
        ;
        x = event.offsetX;
        y = event.offsetY;

        // 移动坐标轴
        $axisX.css( "top", y );
        $axisY.css( "left", x );

        console.info( event.target, x, y )
    } )
} );