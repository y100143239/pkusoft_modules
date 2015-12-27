
/* -----------------------
    config
 -------------------------*/
var VERSION; // VERSION = "v2.0";
require.config( {
    // 给模块URL加版本号阻止浏览器缓存
    urlArgs: "VERSION=" + (VERSION || (new Date()).getTime()),
    // 将对 jquery-1.9.0 的引用映射到引用 jquery-private
    paths: {
        "jquery": 'jquery/jquery-1.9.0',
        "jquery-private": 'jquery/jquery-private'
    },
    map: {
        '*': { 'jquery': 'jquery-private' },
        'jquery-private': { 'jquery': 'jquery' }
    },
    // 超时
    waitSeconds: 15
} );


/* -----------------------
     引入所有模块
 -------------------------*/
(function(){

    var utils,
        ui
        ;

    utils = [
        "utils/domReady",
        "utils/clone",
        "utils/doT",
        "utils/utils"
        //"utils/sizzle",
    ];
    ui = [
        "ui/flow",
        "ui/overlay"
    ];

    define( utils.concat( ui ) );
})();
