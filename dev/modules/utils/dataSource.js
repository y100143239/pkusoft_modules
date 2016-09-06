/*
    1. 根据 xml url 缓存请求数据
 */
define( [ 'jquery', "Ajax" ], function ( $, Ajax ) {
    var DataSource,
        Cache
        ;

    Cache = {};

    DataSource = {
        /* 请求xml文件 */
        cacheXmlDocument: function ( urlArray, completeCallback ) {

            // 反转：pop()是弹出末尾的元素的
            urlArray.reverse();
            // 去重
            urlArray = $.unique( urlArray );

            Ajax.sync(
                urlArray,
                function success ( url, data ) {
                    var isSuccess = data && data.getElementsByTagName;
                    if ( isSuccess ) {
                        console.info( url, "\t字典获取成功" );
                    } else {
                        console.info( url, "\t字典获取失败！！" );
                    }
                    // 缓存数据
                    if ( ! Cache[ url ] ) {
                        Cache[ url ] = data;
                    }
                },
                function error( url ) {
                    console.info( url, "\t字典获取失败！！" );
                },
                function end() {
                    completeCallback( Cache );
                }
            );

        }
    };

    return DataSource;
} );
define( "Ajax", [ 'jquery' ], function ( $ ) {
    var Ajax
    ;
    Ajax = {
        sync: function ( urlArray, successFn, errorFn, endFn ) {
            var _this,
                _arguments,
                url
                ;
            _this = this;
            _arguments = arguments;

            if ( urlArray.length == 0 ) {
                endFn();
                return;
            }

            url = urlArray.pop();

            $.ajax( {
                type: "GET",
                url: url,
                timeout: 30000, // 设置请求超时时间（毫秒）
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                cache: true, // 缓存此页面
                dataType: "xml", // 预期服务器返回的数据类型。
                success: function ( data ) {
                    successFn( url, data );
                    //递归
                    _this.sync.apply( _this, _arguments );
                },
                error: function () {
                    errorFn( url );
                    //递归
                    _this.sync.apply( _this, _arguments );
                }
            } )
        }
    };
    return Ajax;
} );