require( [ "jquery", "gdbaUtils", "draggable",
                "formvalidationI18N", "bootstrap", "select2", "datepicker", "select-area" ], function ( $, /* 定义在下面 */Utils, Draggable ) {
    var $document,
        $indexPage,
        $bizcodePage,
        $sidebarInfoContainr,
        $refreshInfoBtn
    ;

    $document = $( document );

    $document.ready( function () {

        $indexPage = $( ".page-index" );
        $bizcodePage = $( ".page-bizcode" );
        $sidebarInfoContainr = $( ".sidebar-info-container" );
        $refreshInfoBtn = $sidebarInfoContainr.find( ".btn-refresh" );

        // 点击 保存（.btn[type='submit']）
        $indexPage.on( "click.gdba", ".btn[type='submit']", function () {
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
                    if ( responseData.success == true ) {
                        fragmentUrl = fragmentUrl.replace(/id=$/, "id=" + responseData.data);
                        Utils.loadDetailFragment( fragmentUrl, $form,
                            function success( $form ) {
                                // $form 被替换掉了
                                // 刷新数据填写完整度面板
                                $refreshInfoBtn.trigger( "click.sidebar.gdba" );
                            },
                            function error() {
                                Utils.removeLoadingOverlay( $form );
                            }
                        );
                    } else {
                        Utils.dialog( "提示", "保存失败。" );
                    }
                },
                error: function () {
                    Utils.dialog( "提示", "网络错误。" );
                    //alert( "网络错误" );
                    Utils.removeLoadingOverlay( $form );
                    //Utils.loadDetailFragment( fragmentUrl, $form );
                }
            } );

            return false; // 禁止提交表单
        } );

        // 点击 取消（.btn-cancel）
        $indexPage.on( "click.gdba", ".btn-cancel", function () {
            var $this,
                $form,
                fragmentUrl
            ;
            $this = $( this );
            $form = $this.closest( "form" );
            fragmentUrl = $form.attr( "data-detail-url" );

            // 1. 提示“是否放弃编辑”
            Utils.dialog(
                "提示",
                "是否放弃编辑",
                function okCallback() {
                    // 2.1 如果无详情页（form.has-detail-page），直接删除节点
                    if ( ! $form.is( ".has-detail-page" ) ) {
                        $form.closest( ".resume" ).remove();
                        return;
                    }

                    // 2.2 如果有详情页（form.has-detail-page），切换到详情页
                    Utils.addLoadingOverlay( $form );

                    Utils.loadDetailFragment( fragmentUrl, $form,
                        function success( $form ) {
                            // $form 被替换掉了
                        },
                        function error() {
                            Utils.removeLoadingOverlay( $form );
                        }
                    );
                },
                function cancelCallback() {
                    // do nothings
                }
            );

        } );

        // 点击 删除简历（.btn-resume-delete）
        $indexPage.on( "click.gdba", ".btn-resume-delete", function () {
            var $this,
                $form,
                deleteUrl
                ;
            $this = $( this );
            $form = $this.closest( "form" );
            deleteUrl = $form.attr( "data-delete-url" );

            Utils.dialog(
                "提示",
                "是否删除？",
                function okCallback() {
                    Utils.addLoadingOverlay( $form );

                    // 1. 发送请求
                    $.ajax( {
                        type: "POST",
                        url: deleteUrl,
                        timeout: 30000, // 设置请求超时时间（毫秒）
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        dataType: "json", // 预期服务器返回的数据类型。
                        success: function ( response ) {
                            var success
                                ;
                            success = response.success;
                            // 2. 服务器端删除成功后，删除节点
                            if ( success ) {
                                $this.closest( ".resume" ).find( "[data-toggle='tooltip']" ).tooltip('destroy' )
                                    .end().remove();
                                // 刷新数据填写完整度面板
                                $refreshInfoBtn.trigger( "click.sidebar.gdba" );
                            } else {
                                // 3. 服务器端删除失败，则提示“删除失败，请联系管理员。”
                                Utils.dialog( "提示", "删除失败，请联系管理员。" )
                            }
                        },
                        error: function () {
                            Utils.dialog( "提示", "网络错误。" );
                        },
                        complete: function () {
                            Utils.removeLoadingOverlay( $form );
                        }
                    } );
                },
                function cancelCallback() {
                    // do nothings
                }
            );

        } );

        // 点击 编辑（.btn-edit），给载入的form添加 类“.has-detail-page”标志其有详情页
        $indexPage.on( "click.gdba", ".btn-edit", function () {
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
            Utils.loadEditFragment( fragmentUrl, $form, function successCallback( $form ) {
                $form.addClass( "has-detail-page" );
            } );
        } );

        // 点击 添加简历（.btn-resume-add）
        $indexPage.on( "click.gdba", ".btn-resume-add", function ( e ) {
            var $this,
                $resumeAdd,
                $template,
                $resume,
                $form,
                fragmentUrl
            ;
            e.preventDefault();

            $this = $( this );

            $resumeAdd = $this.closest( ".resume-add" );
            $template = $resumeAdd.find( ".template" );

            // 1. 创建节点
            $resume = $template.clone().removeClass( "hidden" );

            // 2. 挂载节点
            $resume.insertBefore( $resumeAdd );

            // 3. 载入模板
            $form = $resume.find( "form" );
            fragmentUrl = $form.attr( "data-edit-url" );
            if ( $this.is( "a" ) ) {
                fragmentUrl = $this.attr( "href" );
            }

            // 添加 loading 遮罩层
            Utils.addLoadingOverlay( $form );
            // 载入 编辑页片段
            Utils.loadEditFragment( fragmentUrl, $form );
        });


        // 点击“图片上传”时，进行webuploader的初始化
        $indexPage.on( "click", ".tab-info .tab-upload", function () {
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
            $target.data("successCallback", function () {
                // 刷新数据填写完整度面板
                $refreshInfoBtn.trigger( "click.sidebar.gdba" );
            });
            Utils.initWebuploader( $target );
        });

        // 选择pcs后，给pcs_name进行赋值
        $indexPage.on( "select2:select", "#_gsxqpcs", function( ){
            $( "#_gsxqpcsmc" ).val( $( this ).find("option:selected").text() );
        });

        // 更换“证件类型”时，如果是“身份证”则启用“id校验规则”，否则就禁用
        $indexPage.on( "change", "select[data-pku-certificate-type]", function( ){
            var $this,
                formValidation,
                isId,
                refFieldName

            ;
            $this = $( this );
            formValidation = $( this.form ).data('formValidation');
            refFieldName = $this.attr( "data-pku-certificate-type-ref" );
            isId = ( $this.val() == "111" );

            formValidation.enableFieldValidators( refFieldName, isId, "id" );
        });

        // 添加点击面板标题时进行 折叠和隐藏
        $indexPage.on( "click.gdba", ".panel-collapse", function ( e ) {
            var $panelBody,
                $this
                ;
            e.preventDefault();
            $this = $( this );
            $panelBody = $this.closest( ".panel-plat" ).find( ".panel-body" );

            if ( $this.is( ".in" ) ) { // 显示，转隐藏
                $this.removeClass( "in" );
                $this.find( ".fa" ).removeClass( "fa-chevron-circle-down" );
                $this.find( "span" ).text( "显示" );
                $panelBody.hide();
            } else {
                $this.addClass( "in" );
                $this.find( ".fa" ).addClass( "fa-chevron-circle-down" );
                $this.find( "span" ).text( "折叠" );
                $panelBody.show();
            }

        } );

        // 提交业务
        $indexPage.on( "click.gdba.biz.submit", ".btn-biz-submit", function () {
            var isComplete,
                submitUrl,
                successUrl,
                $this
                ;
            $this = $( this );

            // 1. 判断面板上是否全部打钩（无 .fa-close ）
            isComplete = $( ".sidebar-info-container .icon.fa-close" ).size() == 0;
            if ( ! isComplete ) {
                Utils.dialog( "提示", "信息未填写完毕！" );
                return;
            }

            if ( $this.data( "isSubmitting") === true ) {
                Utils.dialog( "提示", "正在提交，请耐心等待服务器处理结果！" );
                return;
            }
            $this.data( "isSubmitting", true );

            submitUrl = $this.attr( "data-submit-url" );
            successUrl = $this.attr( "data-success-url" );
            if ( ! submitUrl || ! successUrl ) {
                return;
            }

            Utils.addLoadingOverlay( $( "body" ) );

            // 2. 保存数据
            $.getJSON( submitUrl, { timestamp: ( new Date() ).getTime() }, function success( data ) {
                if ( ! ( data && data.success ) ) {
                    Utils.dialog( "提示", "业务提交失败，请稍后重试！" );
                    return;
                }
                Utils.dialog( "提示", "提交成功！",
                    function () {
                        window.location = successUrl;
                    }, function () {
                        window.location = successUrl;
                    } );

            } ).fail(function() {
                Utils.dialog( "提示", "错误：请检查网络，或重新登录。" );
            }).always(function() {
                Utils.removeLoadingOverlay( $( "body" ) );
                $this.data( "isSubmitting", false );
            });
        } );


        //
        $bizcodePage.on( "click", ".btn[type='submit']", function () {
            var $this,
                $form,
                $fvInstance,
                isValid
                ;
            $this = $( this );
            $form = $this.closest("form");
            $fvInstance = $form.data( 'formValidation' );
            // 校验
            $fvInstance.validate();
            // 判断
            isValid = $fvInstance.isValid();
            // 校验不通过 ， 退出
            if ( !isValid ) {
                return false;
            }
            // 发送请求：判断是否是合法的 bizcode
            $.getJSON( $form.attr( "data-validate-bizcode-url" ), $form.serialize(), function success( data ) {
                if ( ! ( data && data.success ) ) {
                    Utils.dialog( "提示", data.message );
                    return;
                }
                window.location = $form.attr( "action" ) + "?" + $form.serialize();
            } ).fail( function (){
                Utils.dialog( "提示", "错误：网络异常。" );
            } );
        });



        // 渲染
        Utils.renderPanel();

        // 信息概况-最小化
        $( ".btn-max, .btn-min", $sidebarInfoContainr ).on( "click", function () {
            var $this;
            $this = $( this );
            $this.closest( ".sidebar-cont" ).removeClass( "active" ).siblings().addClass( "active" );
            $( ".sidebar-info-container" ).css( {
                left: "-1px",
                top: "40px"
            } );
            return false;
        } );

        // 信息概况-刷新
        $refreshInfoBtn.on( "click.sidebar.gdba", function ( e ){
            var url,
                $faIcon;

            e.preventDefault();
            $faIcon = $( this ).find( ".fa" );

            if ( $faIcon.is( ".fa-spin" ) ) {
                return;
            }
            $faIcon.addClass( "fa-spin" );

            url = $sidebarInfoContainr.attr( "data-url" );

            // 1. 从服务器获取数据
            $.getJSON( url, { timestamp: ( new Date() ).getTime() }, function success( data ) {
                if ( ! ( data && data.success ) ) {
                    Utils.dialog( "提示", "刷新失败，请稍后再刷新！" );
                    return;
                }
                // 2. 根据获取的数据，刷新信息填写情况
                refreshInfo( data.data );
            } ).fail(function() {
                Utils.dialog( "提示", "错误：请检查网络，或重新登录。" );
            }).always(function() {
                $faIcon.removeClass( "fa-spin" );
            });

        } ).trigger( "click.sidebar.gdba" );

        // 设置面板的拖拽
        $sidebarInfoContainr.get( 0 ) && new Draggable ( $sidebarInfoContainr.get( 0 ), {
            filterTarget: function ( target ) {
                return $( target ).is( ".heading" );
            }
        } );

        function refreshInfo( arr ) {
            $sidebarInfoContainr.find( "li[class*='index']" ).each( function ( index ) {
                var $icon,
                    isComplete
                ;
                $icon = $( this ).find( ".icon" );
                if ( arr[ index ] ) {
                    isComplete = true;
                }
                if ( isComplete ) {
                    $icon.removeClass( "fa-close" );
                } else {
                    $icon.addClass( "fa-close" );
                }
            } );
        }


    } );

} );

define( "gdbaUtils", ["jquery", "webuploader", "bootstrap"], function ($, WebUploader) {
    var Dialog
    ;

    Dialog = {
        $dialog: null,
        $title: null,
        $text: null,
        $okBtn: null,
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$dialog = $( this.template );
            this.$title = this.$dialog.find( ".modal-title" );
            this.$text = this.$dialog.find( ".modal-text" );
            this.$okBtn = this.$dialog.find( ".btn-modal-ok" );
        },
        bind: function () {
            $( document.body ).append( this.$dialog );
            this.$dialog.modal( {
                backdrop: "static",
                show: false
            } );
        },
        show: function () {
            this.$dialog.modal( 'show' );
        },
        hide: function () {
            this.$dialog.modal( 'hide' );
        },
        setInfo: function ( title, text ) {
            this.$title.text( title );
            this.$text.text( text );
        },
        template: '\
<div class="modal">\
    <div class="modal-dialog modal-sm">\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal">×</button>\
                <h4 class="modal-title">Modal title</h4>\
            </div>\
            <div class="modal-body">\
                <p class="modal-text">Modal body</p>\
            </div>\
            <div class="modal-footer">\
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">关闭</button>\
                <button type="button" class="btn btn-primary btn-modal-ok">确定</button>\
            </div>\
        </div>\
    </div>\
</div>'
    };

    Dialog.init();

    return {
        renderPanel: function ( $target ) {
            $target = $target || $( document );
            $( '[data-pku-widget="fv"]', $target ).formValidation();
            $target.is( "form" ) && $target.formValidation();
            $( '[data-pku-widget="select2"]', $target ).select2();
            $( '[data-pku-widget="select-area"]', $target ).selectArea();
            $( "[data-toggle='tooltip']", $target ).tooltip({
                container: "body",
                theme: "tooltip-info-dark",
                trigger: "hover"
            });
            // 初始化时，触发一次“change”事件，以判断是否启用“id”校验规则
            $( "select[data-pku-certificate-type]", $target ).trigger( "change" );

        },
        addLoadingOverlay: function ( $target ) {
            this.removeLoadingOverlay( $target );
            $target.append( '<div class="overlay overlay-black"> <i class="fa fa-spin fa-spinner"></i> </div>' );
            if ( $target.is( "body" ) ) {
                $target.addClass( "modal-open" );
            }
        },
        removeLoadingOverlay: function ( $target ) {
            $target.find( ".overlay.overlay-black" ).remove();
            if ( $target.is( "body" ) ) {
                $target.addClass( "modal-open" );
            }
        },
        loadDetailFragment: function ( url, $form, successCallback, errorCallback ) {
            var $temp,
                _this
                ;
            $temp = $( "<div>" );
            _this = this;
            if ( url.indexOf( "?" ) != -1 ) {
                url += "&timestamp=" + ( new Date() ).getTime();
            } else {
                url += "?timestamp=" + ( new Date() ).getTime();
            }
            // 载入 详情页片段
            $temp.load( url, function ( response, status ) {
                var $_form
                    ;
                if ( status != "success" ) {
                    _this.dialog( "提示", "载入失败" );
                    errorCallback && errorCallback();
                    return;
                }
                $_form = $( $temp.html() );
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
                    successCallback( $form );
                }
            } );
        },
        initWebuploader: function ( $target ) {
            var uploaderContainerId,
                uploaderOptions,
                webloaderInstance,
                url,
                successCallback
                ;
            uploaderContainerId = $target.attr( "id" );
            url = $target.data( "uploadUrl" );
            successCallback = $target.data( "successCallback" );

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

            // （当文件上传成功时触发。）
            webloaderInstance.on('uploadSuccess', function(file) {
                // console.info( "上次成功。" );
                if ( successCallback && ( typeof successCallback == "function" ) ) {
                    successCallback();
                }
            });
        },
        dialog: function ( title, text, okCallback, cancelCallback ) {
            // 设置 title 和 text
            Dialog.setInfo( title, text );
            // 注册 点击确定后的事件处理函数
            Dialog.$okBtn.off( "click" ).on( "click", function () {
                if ( okCallback ) {
                    okCallback();
                }
                Dialog.$dialog.off( "hidden.bs.modal" );
                Dialog.hide();
            } );
            // 注册 点击取消（关闭）后的事件处理函数
            Dialog.$dialog.off( "hidden.bs.modal" ).on( "hidden.bs.modal", function () {
                if ( cancelCallback ) {
                    cancelCallback();
                }
                Dialog.hide();
            } );
            Dialog.show();
        }
    };
}) ;