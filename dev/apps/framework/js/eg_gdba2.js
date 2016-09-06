require( [ "jquery", "gdbaUtils",
                "formvalidationI18N", "bootstrap", "select2", "datepicker", "select-area" ], function ( $, /* 定义在下面 */Utils ) {

    var $document
    ;
    $document = $( document );

    // 点击 保存（.btn[type='submit']）
    $document.on( "click.gdba", ".btn[type='submit']", function () {
        var $this,
            $form,
            $fvInstance,
            isValid,
            formUrl,
            fragmentUrl
            ;
        $this = $( this );
        $form = $this.closest( "form" );
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
        Utils.addLoadingOverlay( $form );

        // 发送Ajax，保存数据
        formUrl = $form.attr( "action" );
        fragmentUrl = $form.attr( "data-detail-url" );
        $.ajax( {
            type: "POST",
            url: formUrl,
            data: $form.serialize(),
            timeout: 60000, // 设置请求超时时间（毫秒）
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "json", // 预期服务器返回的数据类型。
            success: function ( responseData ) {
                Utils.removeLoadingOverlay( $form );
                Utils.loadDetailFragment( fragmentUrl, $form );
            },
            error: function () {
                alert( "网络错误" );
                Utils.removeLoadingOverlay( $form );
                Utils.loadDetailFragment( fragmentUrl, $form );
            }
        } );

        return false; // 禁止提交表单
    } );
    // 点击 编辑（.btn-edit）
    $document.on ( "click.gdba", ".btn-edit", function () {
        var $this,
            $form,
            fragmentUrl
            ;

        $this = $( this );
        $form = $this.closest( "form" );
        fragmentUrl = $form.attr( "data-edit-url" );
        // 添加 loading 遮罩层
        Utils.addLoadingOverlay( $form );
        // 载入 编辑页片段
        Utils.loadEditFragment( fragmentUrl, $form );
    } );

    // 点击“图片上传”时，进行webuploader的初始化
    $document.on( "click", ".tab-info .tab-upload", function () {
        var $this,
            $target,
            uploaderContainerId
        ;
        $this = $( this );
        $target = $this.closest(".tab-info" ).find( ".imageUploaderContainer" );
        if ( $target.get( 0 ).id ) {
            return;
        }
        uploaderContainerId = "uploaderContainer_" + ( new Date() ).getTime();
        $target.attr( "id", uploaderContainerId );
        Utils.initWebuploader( $target );
    });

    // 选择pcs后，给pcs_name进行赋值
    $document.on("select2:select", "#_gsxqpcs", function( ){
        $( "#_gsxqpcsmc" ).val( $( this ).find("option:selected").text() );
    });

    $document.ready( function () {

        Utils.renderPanel();


    } );

} );

define( "gdbaUtils", ["jquery", "webuploader"], function ($, WebUploader) {
    return {
        renderPanel: function ( $target ) {
            $target = $target || $( document );
            $( '[data-pku-widget="fv"]', $target ).formValidation();
            $target.is( "form" ) && $target.formValidation();
            $( '[data-pku-widget="select2"]', $target ).select2();
            $( '[data-pku-widget="select-area"]', $target ).selectArea();
            $( "[data-toggle='tooltip']", $target ).tooltip({
                container: "body",
                theme: "tooltip-info-dark"
            });
        },
        addLoadingOverlay: function ( $target ) {
            this.removeLoadingOverlay( $target );
            $target.append( '<div class="overlay overlay-black"> <i class="fa fa-spin fa-spinner"></i> </div>' );
        },
        removeLoadingOverlay: function ( $target ) {
            $target.find( ".overlay.overlay-black" ).remove();
        },
        loadDetailFragment: function ( url, $form, successCallback ) {
            var $temp
                ;
            $temp = $( "<div>" );
            // 载入 详情页片段
            $temp.load( url, function ( response, status ) {
                var $_form = $( $temp.html() );
                if ( status != "success" ) {
                    alert( "载入失败" );
                }
                $form.find( "[data-toggle='tooltip']" ).tooltip('destroy');
                $form.replaceWith( $_form );
                $temp = null;
                // 回调
                if ( successCallback && ( typeof successCallback == "function" ) ) {
                    successCallback( $_form );
                }
            });
        },
        loadEditFragment: function ( url, $form, successCallback ) {
            var _this
                ;
            _this = this;
            this.loadDetailFragment( url, $form, function ( $form ) {
                // 渲染，注册插件
                _this.renderPanel( $form );
                // 回调
                if ( successCallback && ( typeof successCallback == "function" ) ) {
                    successCallback();
                }
            } );
        },
        initWebuploader: function ( $target ) {
            var uploaderContainerId,
                uploaderOptions,
                webloaderInstance,
                url
                ;
            uploaderContainerId = $target.attr( "id" );
            url = $target.data( "uploadUrl" );

            uploaderOptions = {
                // swf文件路径
                swf: '${ctx}/static/dev/modules/lib/webuploader/Uploader.swf',

                // 文件接收服务端。
                server: url,
                // 自动上传。
                auto: false,
                fileSingleSizeLimit: 1024 * 800, // 单个问价大小限制，800 KB
                // 只允许选择文件，可选。
                accept: {
                    title: 'Images',
                    extensions: 'jpg', // 只接受 jpg 类型
                    mimeTypes: 'image/*'
                },
                // 指定Drag And Drop拖拽的容器
                dnd: '#' + uploaderContainerId + ' .uploader-filelist',
                // 通过粘贴来添加截屏的图片
                paste: document.body
            };
            webloaderInstance = WebUploader.pku.imageUpload( uploaderContainerId, uploaderOptions );

            // 处理图片添加失败的处理
            webloaderInstance.on( 'error', function ( type ) {
                switch ( type ) {
                    case "F_EXCEED_SIZE": { // 尝试给uploader添加的文件大小超出这个值时
                        alert("单个文件大小不符合要求：不超过800KB。");
                        break;
                    }
                    case "Q_TYPE_DENIED": { // 当文件类型不满足时触发
                        alert( "文件类型不符合要求：仅限 jpg 类型。" );
                        break;
                    }
                    case "Q_EXCEED_NUM_LIMIT": { // 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值
                        break;
                    }
                    case "Q_EXCEED_SIZE_LIMIT": { // 尝试给uploader添加的文件总大小超出这个值时
                        break;
                    }
                    default: {
                        alert( "错误类型：" + type );
                    }
                }
            } );
        }
    };
}) ;