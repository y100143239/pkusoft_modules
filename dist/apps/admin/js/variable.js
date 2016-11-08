var JS_BASE_URL, // 定位到当前项目的 js 目录，"http://www.20.ui/static/apps/admin/js/"
    HOST
    ;

JS_BASE_URL = document.getElementById( "variablejs" ).src.replace( "variable.js", "" );
HOST = window.document.location.href;
if ( HOST.indexOf( "20ui.cn" ) !== -1 ) {
    HOST = "http://www.20ui.cn";
} else {
    HOST = "http://localhost:8080";
}