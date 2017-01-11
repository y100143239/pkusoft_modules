/*
    1. 根据 xml url 缓存请求数据
 */
define( [ 'jquery' ], function ( $ ) {
    var DataSource
    ;


    DataSource = {
        cache: {},
        /* 请求xml文件 */
        cacheXmlDocument: function ( urlArray ) {
            var len,
                i,
                url,
                _this
                ;

            _this = this;

            // 去重
            urlArray = $.unique( urlArray );

            for ( i = 0, len = urlArray.length; i < len; i++ ) {
                url = urlArray[ i ];
                +function( url ) {
                    _this.request(
                        url,
                        function ( data ) {
                            doSuccess( url, data );
                        },
                        function () {
                            doError( url );
                        }
                    );
                } ( url );
            }

            function doSuccess ( url, data ) {
                var isSuccess,
                    cache
                ;
                isSuccess = data && ( data.getElementsByTagName( "row" ).length > 0 );
                cache = _this.cache;
                if ( isSuccess ) {
                    console.info( url, "\t字典获取成功。" );
                } else {
                    if ( cache[ url ] == "isRepeated" ) {
                        console.info( url, "\t字典获取失败: 第二次获取失败。" );
                    }
                    console.info( url, "\t字典获取失败: 进行第二次获取。" );
                    // 尝试再次获取，通过POST请求
                    cache[ url ] = "isRepeated";
                    _this.request(
                        url,
                        function ( data ) {
                            doSuccess( url, data );
                        },
                        function () {
                            doError( url );
                        },
                        "POST"
                    );
                }
                // 缓存数据
                cache[ url ] = data;
            }
            function doError( url ) {
                console.info( url, "\t字典获取失败: 网络原因/路径错误。" );
            }
        },
        request: function ( url, doSuccess, doError, method  ) {
            method = method || "GET";
            $.ajax( {
                type: method,
                url: url,
                async: false, // 同步请求
                timeout: 30000, // 设置请求超时时间（毫秒）
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                cache: true, // 缓存此页面
                dataType: "xml", // 预期服务器返回的数据类型。
                success: function ( data ) {
                    doSuccess( data );
                },
                error: function () {
                    doError( );
                }
            } );
        },
        format: function ( urls, type ) {
            switch ( type ) {
                case "select2": {
                    break;
                }
                case "datagrid": {
                    /*
                    {
                        url1: { code1: text1, code2: text2, ... }
                        url2: { code1: text1, code2: text2, ... }
                    }
                    */
                    break;
                }
            }
        }
    };
    return DataSource;
} );
