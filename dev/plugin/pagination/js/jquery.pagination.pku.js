/**
 * 作者：吴钦飞
 * 用途：简单分页，主要用于请求每页数据
 * 参数：1）data-*；2）初始化对象
 */
+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery" ], factory );
    } else if ( jQuery ) {
        // 全局模式
        factory( jQuery );
    } else {
        throw "jquery.pagination.pku.js depends on jQuery";
    }
}( function ( $ ) {
    "use strict";
    var NS
    ;
    NS = ".pagination.pku"; // namespace

    $.fn.pagination = function ( options, param ) {

        if ( typeof options == 'string' ) {
            this.each( function () {
                init( this );
            } );
            return $.fn.pagination.methods[ options ]( this, param );
        }

        return this.each( function () {
            init( this, options );
        } );
    };

    // 默认参数
    $.fn.pagination.defaults = {
        url: null,
        container: ".js--pg-container",
        prevBtn: ".js--pg-btn-prev",
        nextBtn: ".js--pg-btn-next",
        disabledBtnClass: "pg-disabled",
        pageSize: 10,
        showLoading: function ( instance ) {
            console.info( "Loading...", instance );
        },
        hideLoading: function ( instance ) {
            console.info( "Close loading", instance );
        },
        requestErrorHandler: function ( instance ) {
            alert( "网络错误，请求失败。" );
        },
        requestSuccessHandler: function ( responseData, instance ) {
            // Ajax 请求成功：服务端处理成功
            console.info( responseData, instance );
        },
        requestFailHandler: function ( responseData, instance ) {
            // Ajax 请求成功：服务端处理失败
            console.info( responseData, instance );
        }
    };

    // 可调用的方法
    $.fn.pagination.methods = {
        options: function ( $target ) { // 返回第一个target的options参数
            return $.data( $target[ 0 ], 'pagination' ).options;
        },
        show: function ( $target ) { // 显示
            return $target.each( function () {
                $.data( this, "pagination" ).$container.show();
            } );
        },
        draw: function ( $target, args ) {
            $.data( $target[ 0 ], 'pagination' ).instance.draw();
            return $target;
        },
        destory: function ( $target ) { // 销毁
            return $target.each( function () {
                $.data( this, "pagination" ).$container.remove();
                $.data( this, "pagination", undefined );
            } );
        }
    };

    /**
     * 初始化，给 target 绑定插件相关的参数
     * @param target
     * @param options
     */
    function init( target, options ) {
        var pagination,
            opts

            ;
        pagination = $.data( target, "pagination" );

        // 已被初始化
        if ( pagination ) {
            $.extend( pagination.options, options );
            return;
        }

        // 初始化

        // 参数: 1. 默认；2. data-*；3. 初始化options。
        opts = $.extend( {}, $.fn.pagination.defaults, $( target ).data(), options );
        $.data( target, "pagination", { options: opts } );

        settingPagination( target, opts );

    }

    function settingPagination( target, opts ) {
        var pagination
        ;
        pagination = $.data( target, "pagination" );
        pagination.instance = new Pagination( $( target ), opts );
    }

    function Pagination( $target, opts ) {
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalRecords = 0;
        this.isDrawing = false;
        this.options = opts;
        this.$target = $target;
        this.$container = $( opts.container );
        this.$prevBtn = $( opts.prevBtn, this.$container );
        this.$nextBtn = $( opts.nextBtn, this.$container );

        this.init();
        this.draw( 1 );
    }

    $.extend( Pagination.prototype, {
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {

        },
        bind: function () {
            var _this,
                clickEvent
            ;
            _this = this;
            clickEvent = "click" + NS;

            this.$prevBtn.off( clickEvent ).on( clickEvent, function ( e ) {
                var pageNum
                ;
                e.preventDefault(); // 取消点击的默认行为
                pageNum = _this.currentPage - 1;
                if ( testBoundary( pageNum ) ) {
                    return;
                }
                _this.draw( pageNum );
            } );
            this.$nextBtn.off( clickEvent ).on( clickEvent, function ( e ) {
                var pageNum
                ;
                e.preventDefault(); // 取消点击的默认行为
                pageNum = _this.currentPage + 1;
                if ( testBoundary( pageNum ) ) {
                    return;
                }
                _this.draw( pageNum );
            } );

            function testBoundary( pageNum ) {
                return pageNum < 1 || pageNum > _this.totalPages;
            }
        },
        draw: function ( pageNum ) {
            var requestData,
                options,
                _this
            ;
            _this = this;
            options = this.options;

            if ( this.isDrawing == true ) {
                return;
            }

            this.isDrawing = true;

            // 1. 构造请求参数
            requestData = getRequestData( pageNum || 1, options.pageSize );

            // 2. 开启loading状态
            options.showLoading && options.showLoading( this );

            // 3. Ajax请求数据
            $.post( options.url, requestData )
                // 4. 处理响应
                .fail( function () {
                    // 4.1 失败：网络错误
                    options.requestErrorHandler && options.requestErrorHandler( _this );
                } )
                .done( function ( data ) {
                    // 4.2 成功
                    // 4.2.1 服务端处理失败
                    if ( data && data.success && data.success == false ) {
                        options.requestFailHandler && options.requestFailHandler( data, _this );
                        return;
                    }
                    // 4.2.2 服务端处理成功
                    // 1）更新pager
                    updatePager( data );
                    // 2）执行回调
                    options.requestSuccessHandler && options.requestSuccessHandler( data, _this );

                } )
                .always ( function () {
                    // 5. 关闭loading状态
                    options.hideLoading && options.hideLoading( _this );

                    _this.isDrawing = false;
                } )
            ;
            function updatePager( data ) {
                _this.currentPage = pageNum;
                _this.totalRecords = data.totalRecords;
                _this.totalPages = Math.ceil( _this.totalRecords / options.pageSize );

                if ( _this.currentPage === 1 ) {
                    _this.$prevBtn.addClass( options.disabledBtnClass );
                } else {
                    _this.$prevBtn.removeClass( options.disabledBtnClass );
                }
                if ( _this.currentPage === _this.totalPages ) {
                    _this.$nextBtn.addClass( options.disabledBtnClass );
                } else {
                    _this.$nextBtn.removeClass( options.disabledBtnClass );
                }
            }

        }
    } );

    /**
     * 构造请求参数
     * @param pageNum 请求第几页
     * @param pageSize 每页记录条数
     * @returns {{start: (number|*), limit: (number|*), pageSize: *, txtQuery}|*}
     */
    function getRequestData( pageNum, pageSize ) {
        var request,
            txtQuery,
            start,
            limit
        ;

        start = pageSize * ( pageNum - 1 );
        limit = pageSize * pageNum;

        txtQuery = {
            "oredCriteria": [[]],
            "orderByClause": "",
            "pager": { "start": start, "limit": limit, "pageSize": pageSize }
        };

        request = {
            start: start,
            limit: limit,
            pageSize: pageSize,
            txtQuery: JSON.stringify( txtQuery )
        };

        return request;
    }

} ));
