/*
    1. cacheXmlDocument：传入url数组。发送Ajax同步请求，将请求到的字典xml文档对象保存到 DataSource.cache
        格式：{
                "http://localhost:8080/gdbaweb/static/dic/DIC_DEPT_LEVEL.xml": document,
                "http://localhost:8080/gdbaweb/static/dic/DIC_GENDER.xml": document
            }
    2. format：传入url数组和插件类型，返回格式化数据
        {
            "http://localhost:8080/gdbaweb/static/dic/DIC_DEPT_LEVEL.xml": [
                { aspell: "gonganbu", code: "0", spell: "gab", text: "公安部" }
                { aspell: "shengting", code: "1", spell: "st", text: "省厅" }
            ]
        }

 */
define( [ 'jquery' ], function ( $ ) {
    var DataSource
    ;

  
    DataSource = {
        cache: {},
        /* 请求xml文件 */
        getXmlAndCache: function ( urls ) {
            var len,
                i,
                url,
                _this
                ;

            _this = this;

            // 去重
            urls = $.unique( urls );

            for ( i = 0, len = urls.length; i < len; i++ ) {
                url = urls[ i ];
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
            return this.cache;
        },
        /* 同步请求 */
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
        /* 将 多个xml文件 格式化指定的JS对象 */
        format: function ( urls, type ) {
            var dicDataSource,
                mapping,
                i,
                len,
                url,
                _this
            ;
            _this = this;
            // 去重
            urls = $.unique( urls );
            dicDataSource = {};
            switch ( type ) {
                case "select2": {
                    mapping = select2Mapping;
                    break;
                }
                case "datagrid": {
                    mapping = datagridMapping;
                    break;
                }
                default: {
                    mapping = defaultMapping;
                }
            }
            for ( i = 0, len = urls.length; i < len; i++ ) {
                url = urls[ i ];
                dicDataSource[ url ] = getDicDataset( _this.cache[ url ], mapping );
            }

            return dicDataSource;

        }
    };

//-- utils

    // <row DIC_ASPELL="gonganbu" DIC_SPELL="gab" DIC_TEXT="公安部" DIC_CODE="0"/>
    function getDicDataset( xmlDoc, mapping ) {
        var rowElts,
            i,
            len,
            dicDataset
            ;
        dicDataset = [];
        mapping = mapping || defaultMapping;
        rowElts = xmlDoc.getElementsByTagName( "row" );
        for ( i = 0, len = rowElts.length; i < len; i++ ) {
            dicDataset.push( mapping( rowElts[ i ] ) );
        }
        return dicDataset;
    }
    function defaultMapping( rowElt ) {
        return {
            "code": rowElt.getAttribute( "DIC_CODE" ),
            "text": rowElt.getAttribute( "DIC_TEXT" ),
            "spell": rowElt.getAttribute( "DIC_SPELL" ),
            "aspell": rowElt.getAttribute( "DIC_ASPELL" )
        };
    }
    /* { url1: [ {code1: text1, code2: text2 }, ... ], url2: [ {code1: text1, code2: text2 }, ... ] } */
    function datagridMapping( rowElt ) {
        return {
            "code": rowElt.getAttribute( "DIC_CODE" ),
            "text": rowElt.getAttribute( "DIC_TEXT" )
        };
    }
    /* { url1: [ { id: id, text: text, spell: spell + id  }, ... ], url2: [ { id: id, text: text, spell: spell + id  }, ... ] } */
    function select2Mapping( rowElt ) {
        var record
            ;
        record = {
            "id": rowElt.getAttribute( "DIC_CODE" ),
            "text": rowElt.getAttribute( "DIC_TEXT" ),
            "spell": rowElt.getAttribute( "DIC_SPELL" )
        };
        record.spell = record.spell + record.id;
        return record;
    }

    // 挂载到名称空间PKU
    if ( window.PKUI ) {
        window.PKUI.DataSource = DataSource;
    }
    return DataSource;
} );
