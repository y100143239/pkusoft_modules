/**
 * 字典数据源
 */
define( [ 'jquery' ], function ( $ ) {
    "use strict";
    var DataSource
    ;

    DataSource = {};


    // 挂载到名称空间PKUI
    if ( window.PKUI ) {
        window.PKUI.dataSource = DataSource;
    }


    // 缓存
    DataSource.cache = {
        "list": {}, // { url_1: [ { code:'',text:'',spell:'',aspell:'' }, ... ], ... }
        "set": {},  // { url_1: { 'code1':'text1', 'code2':'text2', ... }, ... }
        "ext": { // 扩展的缓存，专门存放非标准的list或set
            "select2": {}
        }
    };

    // 提供的API
    DataSource = $.extend( DataSource, {
        /**
         * 根据指定字典url获取dataList，步骤：
         * 1. 从缓存中取指定url的dataList，取到则返回，否则，进行下一步；
         * 2. 根据url发送请求，将获取到的xml文档对象转换成dataList，并缓存；
         * @param url: 字典文件的url
         * @returns {*}: 返回的格式
         * [
         *      { code: "", text: "", spell: "", aspell: "" },
         *      { code: "", text: "", spell: "", aspell: "" },
         *      ...
         * ]
         */
        getDataList: function ( url ) {
            var listCache,
                dataList
                ;
            // 1. 从listCache中取
            listCache = this.cache[ "list" ];
            dataList = listCache[ url ];

            // 2. 取到了，则直接返回
            if ( dataList ) {
                return dataList;
            }

            // 3. 没取到，请求字典文件
            this.request.getXmlAndCache( url );

            return listCache[ url ];
        },
        /**
         * 根据指定字典url获取dataSet，步骤：
         * 1. 从缓存中取，取到了则返回，取不到则进行下一步；
         * 2. 调用 getDataList() 方法获取 dataList，将 dataList 转换成 dataSet，缓存并返回
         * @param url 字典文件的url
         * @returns {*}: 返回的格式
         * {
         *      code1: text1,
         *      code2: text2,
         *      ...
         * }
         */
        getDataSet: function ( url ) {
            var setCache,
                dataSet,
                dataList
            ;

            setCache = this.cache[ "set" ];

            // 1. 从 setCache 中取，取到则返回
            dataSet = setCache[ url ];

            if( dataSet ) {
                return dataSet;
            }

            // 2. 取不到，则从 listCache 中取（没有则请求并转换）
            dataList = this.getDataList( url );

            // 3. 将list转换为set
            dataSet = this.utils.convertDataListToDataSet( dataList );

            // 4. 缓存 dataSet
            setCache[ url ] = dataSet;

            return dataSet;
        },
        /**
         * 获取扩展的dataList
         * @param url 字典文件的url
         * @param extType 扩展类型，一般是插件名称
         * @param extConverter 有预定义好的转换器，也可以用自定义的
         * @returns {*}
         */
        getExtDataList: function ( url, extType, extConverter ) {
            var dataList,
                extDataList,
                extCache
            ;
            extCache = this.cache[ "ext" ];

            // 1. 从extCache缓存中取，取到了则直接返回
            if ( ! extCache[ extType ] ) { // 如果没有对应的扩展类缓存，则创建
                extCache[ extType ] = {};
            }
            extDataList = extCache[ extType ][ url ];

            if ( extDataList ) {
                return extDataList;
            }

            // 2. 取不到，则获取dataList
            dataList = this.getDataList( url );

            // 3. 将 dataList 转化为 extType类型 的数据格式
            extDataList = this.utils.convertDataListToExtDataList( dataList, extType, extConverter );

            // 4. 缓存，并返回
            extCache[ extType ][ url ] = extDataList;

            return extDataList;
        }

    } );

    // 请求
    DataSource.request = {
        /**
         * 同步请求指定url的字典文件
         * @param url: 请求的字典文件url
         * @param doSuccess: 请求成功后的回调函数
         * @param doError: 请求出错后的回调函数
         * @param method: 请求方式，"GET"（默认） 或 "POST"
         * @returns {DataSource}: 链式调用
         */
        syncAjax: function ( url, doSuccess, doError, method  ) {
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
        /**
         * 请求指定url的字典文件，并转换成dataList缓存起来。
         * @param urls: 可以是单个url字符串，也可以是 url字符串数组
         * @returns {DataSource}: 链式调用
         */
        getXmlAndCache: function ( urls ) {
            var _this
                ;

            _this = this;

            if ( typeof urls === "string" ) {
                urls = [ urls ];
            }

            $.unique( urls ); // 去重

            // Ajax同步请求每个 dic url，并将请求返回的xml文档对象缓存起来
            $.each( urls, function ( index, url ) {
                _this.syncAjax(
                    url,
                    function ( xmlDoc ) {
                        _this.handleRequestDicSuccess( url, xmlDoc );
                    },
                    function () {
                        _this.handleRequestDicError( url );
                    }
                );
            } );

            return this;
        },
        handleRequestDicSuccess: function ( url, xmlDoc ) {
            var isSuccess,
                listCache,
                _this
                ;
            _this = this;
            isSuccess = xmlDoc && ( xmlDoc.getElementsByTagName( "row" ).length > 0 );
            listCache = DataSource.cache[ "list" ];
            if ( isSuccess ) {
                console.info( url, "\t字典获取成功。" );
            } else {
                if ( listCache[ url ] == "isRepeated" ) {
                    console.info( url, "\t字典获取失败: 第二次获取失败。" );
                }
                console.info( url, "\t字典获取失败: 进行第二次获取。" );
                // 尝试再次获取，通过POST请求
                listCache[ url ] = "isRepeated";
                DataSource.request(
                    url,
                    function ( data ) {
                        _this.handleRequestDicSuccess( url, data );
                    },
                    function () {
                        _this.handleRequestDicError( url );
                    },
                    "POST"
                );
            }
            // 缓存数据
            listCache[ url ] = DataSource.utils.convertXmlDocToDataList( xmlDoc );
        },
        handleRequestDicError: function ( url ) {
            console.info( url, "\t字典获取失败: 网络原因/路径错误。" );
        }
    };

    // 工具
    DataSource.utils = {
        /**
         * 将xml文档对象转换成标准的dataList
         * @param xmlDoc xml文档对象
         * @returns {Array}
         */
        convertXmlDocToDataList: function ( xmlDoc ) {
            var dataList,
                rowElts
                ;

            dataList = [];
            rowElts = xmlDoc.getElementsByTagName( "row" );

            $.each( rowElts, function ( index, rowElt ) {
                dataList.push( {
                    "code": rowElt.getAttribute( "DIC_CODE" ),
                    "text": rowElt.getAttribute( "DIC_TEXT" ),
                    "spell": rowElt.getAttribute( "DIC_SPELL" ),
                    "aspell": rowElt.getAttribute( "DIC_ASPELL" )
                } );
            } );

            return dataList;
        },
        convertDataListToDataSet: function ( dataList ) {
            var dataSet
                ;
            dataSet = {};
            $.each( dataList, function ( index, dicData ) {
                dataSet[ dicData[ "code" ] ] = dicData[ "text" ];
            } );
            return dataSet;
        },
        convertDataListToExtDataList: function ( dataList, extType, extConverter ) {
            var extDataList
                ;

            // 如果传了自定义的extConverter，则调用自定义的extConverter
            if ( extConverter ) {
                return extConverter( dataList );
            }

            switch ( extType ) {
                case "select2": { // 预定义的 extConverter
                    extDataList = DataSource.converter.get( "select2" )( dataList );
                    break;
                }
            }
            return extDataList;
        }
    };


    // 转换器
    DataSource.converter = {
        get: function ( type ) {
            return this[ type ];
        },
        select2 : function ( dataList ) {
            var extDataList
                ;
            extDataList = [];
            $.each( dataList, function ( index, data ) {
                extDataList.push( {
                    "id": data[ "code" ],
                    "text": data[ "text" ],
                    "spell": data[ "spell" ] + data[ "code" ]
                } );
            } );
            return extDataList;
        }
    };

    return DataSource;
} );
