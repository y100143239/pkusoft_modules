require( [ "jquery", "gdbaUtils", "formvalidationI18N", "bootstrap", "select2", "datepicker", "select-area" ], function ( $, Utils ) {

    // Utils 在下面定义为模块

    // 保存
    $( document ).on( "click", ".js--panel .js--save", function ( e ) {
        var $this,
            $panel,
            $form,
            $fvInstance,
            isValid,
            formUrl,
            fragmentUrl
            ;
        $this = $( this );
        $panel = $this.closest( ".js--panel" );
        $form = $panel.find( ".js--form" );
        $fvInstance = $form.data( 'formValidation' );

        // 校验
        $fvInstance.validate();
        // 判断
        isValid = $fvInstance.isValid();

        // 校验不通过 ， 退出
        if ( !isValid ) {
            return false;
        }

        // 添加loading遮罩层
        Utils.addLoadingOverlay( $panel );

        // 发送Ajax，保存数据
        formUrl = $form.attr( "action" );
        fragmentUrl = $panel.attr( "data-detail-panel-url" );
        $.ajax( {
            type: "POST",
            url: formUrl,
            data: $form.serialize(),
            timeout: 60000, // 设置请求超时时间（毫秒）
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "json", // 预期服务器返回的数据类型。
            success: function ( responseData ) {
                Utils.loadDetailFragment( fragmentUrl, $panel );
            },
            error: function () {
                // 在此处模拟 success
                setTimeout( function() {
                    Utils.loadDetailFragment( fragmentUrl, $panel );
                }, 1500 );
            }
        } );

    } );
    // 编辑
    $( document ).on( "click", ".js--panel .js--edit", function ( e ) {
        var $this,
            $panel,
            fragmentUrl
            ;
        $this = $( this );
        $panel = $this.closest( ".js--panel" );
        fragmentUrl = $panel.attr( "data-edit-panel-url" );
        // 添加 loading 遮罩层
        Utils.addLoadingOverlay( $panel );
        // 载入 编辑页片段
        Utils.loadEditFragment( fragmentUrl, $panel );
    });

    $( document ).ready( function () {

        var $leftsideNav
        ;
        $leftsideNav = $( ".nav-leftside" );

        Utils.renderPanel();

        // 给导航添加提示
        $( ".nav-leftside .panel-anchor" ).tooltip( {
            theme: "tooltip-info-dark",
            placement: "left",
            container: "body"
        } );
        // 给导航添加折叠按钮
        $leftsideNav.on( "click", ".js--change", function () {
            $leftsideNav.toggleClass( "nav-leftside-min" )
        } );
    } );

} );

define( "gdbaUtils", ["jquery"], function ($) {
    return {
        renderPanel: function ( $target ) {
            $target = $target || $( document );
            $( '[data-pku-widget="fv"]', $target ).formValidation();
            $( '[data-pku-widget="select2"]', $target ).select2();
            $( '[data-pku-widget="select-area"]', $target ).selectArea();
        },
        addLoadingOverlay: function ( $target ) {
            this.removeLoadingOverlay( $target );
            $target.append( '<div class="overlay overlay-black"> <i class="fa fa-spin fa-spinner"></i> </div>' );
        },
        removeLoadingOverlay: function ( $target ) {
            $target.find( ".overlay.overlay-black" ).remove();
        },
        loadDetailFragment: function ( url, $panel, successCallback ) {
            var panelId,
                $temp
                ;
            panelId = "#" + $panel.attr( "id" );
            $temp = $( "<div>" );
            // 载入 详情页片段
            $temp.load( url + panelId, function () {
                $panel.html( $temp.find( panelId ).html() );
                $temp = null;
                // 回调
                if ( successCallback && ( typeof successCallback == "function" ) ) {
                    successCallback();
                }
            });
        },
        loadEditFragment: function ( url, $panel, successCallback ) {
            var _this
                ;
            _this = this;
            this.loadDetailFragment( url, $panel, function () {
                // 渲染，注册插件
                _this.renderPanel( $panel );
                // 回调
                if ( successCallback && ( typeof successCallback == "function" ) ) {
                    successCallback();
                }
            } );
        }
    }
}) ;