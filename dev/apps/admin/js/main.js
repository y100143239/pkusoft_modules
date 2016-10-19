require( [ "jquery", "Utils", "formvalidationI18N", "bootstrap" ], function ( $, Utils, _fv, _bs ) {
    "use strict";
    var $doc,
        LoginPage,
        IndexPage
    ;

    $doc = $( document );

    LoginPage = {
        $container: ".page-login",
        $form: "#loginPageForm",
        init: function init() {
            this.render();
            this.bind();
        },
        render: function render() {
            this.$container = $( this.$container );
            this.$form = $( this.$form, this.$container );
        },
        bind: function bind() {

            // 表单验证
            this.$form.formValidation();

            // 第一个输入域获取焦点，方便输入
            this.$form.find( ".form-control" ).eq( 0 ).focus();

            // 处理表单提交
            Utils.Form.bindSubmit( this.$form );

        }
    };

    IndexPage = {
        $container: ".page-index",
        init: function init() {
            this.render();
            this.bind();
        },
        render: function render() {
            this.$container = $( this.$container );
        },
        bind: function bind() {

        }
    };





    // -----------
    $doc.ready( function () {

        if ( $doc.find( LoginPage.$container ).size() > 0 ) {
            LoginPage.init();
        }
        if ( $doc.find( IndexPage.$container ).size() > 0 ) {
            IndexPage.init();
        }

    } );

});

define( "Utils", [ "formvalidationI18N", "bootstrap" ], function () {
    var Form,
        Dialog
    ;
    //
    Form = {
        bindSubmit: function ( $form ) {
            $form.off( "submit.form" ).on( "submit.form", function () {
                var $this,
                    $fvInstance,
                    isValid,
                    validateUrl,
                    actionUrl
                    ;
                $this = $( this );
                validateUrl = $this.attr( "data-fv-remote-validate-url" );
                actionUrl = $this.attr( "action" );
                $fvInstance = $this.data( 'formValidation' );
                // 校验
                $fvInstance.validate();
                // 判断
                isValid = $fvInstance.isValid();
                // 校验不通过 ， 退出
                if ( !isValid ) {
                    return false;
                }
                // 发送请求进行校验
                $.post( validateUrl, $this.serialize(), null, "json" )
                 .done( function ( data ) {
                    if ( ! ( data && data.success ) ) {
                        Dialog.show( { title: "提示", content: data.message || "用户名/密码 错误。" } );
                        return;
                    }

                    // 创建一个表单进行提交
                    if ( actionUrl ) {
                        $( '<form action="' + actionUrl + '">' ).appendTo( document.body ).submit();
                    }
                 }).fail( function (){
                    Dialog.show( { title: "错误", content: "网络异常。" } );
                 } );
            } );
        }
    };


    // Dialog
    Dialog = {
        $container: null,
        $title: ".modal-title",
        $content: ".modal-text",
        $confirmBtn: ".js--btn-ok",
        $cancelBtn: ".js--btn-cancel",
        $closeBtn: ".js--btn-close",
        options: null,
        defaults: {
            title: "提示",
            content: "点击“取消”按钮关闭对话框。",
            hasConfirmBtn: true,
            hasCancelBtn: true,
            confirmBtnText: "确定",
            cancelBtnText: "取消",
            confirmCallback: function () { window.console && console.info( "confirmCallback" ); },
            cancelCallback: function () { window.console && console.info( "cancelCallback" ); }
        },
        init: function () {
            this.render();
            this.bind();
            return this;
        },
        render: function () {
            this.$container = $( this.template );
            this.$title = this.$container.find( this.$title );
            this.$content = this.$container.find( this.$content );
            this.$confirmBtn = this.$container.find( this.$confirmBtn );
            this.$cancelBtn = this.$container.find( this.$cancelBtn );
            this.$closeBtn = this.$container.find( this.$closeBtn );
        },
        bind: function () {
            // 挂载到DOM树
            $( document.body ).append( this.$dialog );

            // 初始化模态框
            this.$container.modal( {
                backdrop: "static",
                show: false
            } );

        },
        show: function ( opts ) {
            this.$container.modal( 'show' );
            this.setOptions( opts );
        },
        hide: function () {
            this.$container.modal( 'hide' );
        },
        setOptions: function ( opts ) {
            this.options = $.extend( {}, this.defaults, opts );
            this._rerender();
        },
        _rerender: function () {
            var _this,
                options
                ;
            _this = this;
            options = this.options;

            // 标题和内容
            this.$title.html( options.title );
            this.$content.html( options.content );

            // “确定”按钮
            if ( options.hasConfirmBtn ) {
                this.$confirmBtn.removeClass( "hidden" ).html( options.confirmBtnText )
                    .off( "click.confirm.dialog" )
                    .on( "click.confirm.dialog", function () {
                        options.confirmCallback();
                        _this.hide();
                    } );
            } else {
                this.$confirmBtn.addClass( "hidden" );
            }

            // “取消”按钮
            if ( options.hasCancelBtn ) {
                this.$cancelBtn.removeClass( "hidden" ).html( options.cancelBtnText )
                    .off( "click.cancel.dialog" )
                    .on( "click.cancel.dialog", options.cancelCallback );
            } else {
                this.$cancelBtn.addClass( "hidden" );
            }

            // “关闭”按钮
            this.$closeBtn
                .off( "click.cancel.dialog" )
                .on( "click.cancel.dialog", options.cancelCallback );

        },
        template: '\
<div class="modal">\
    <div class="modal-dialog modal-sm">\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close js--btn-close" data-dismiss="modal">×</button>\
                <h4 class="modal-title">Modal title</h4>\
            </div>\
            <div class="modal-body">\
                <p class="modal-text">Modal body</p>\
            </div>\
            <div class="modal-footer" style="text-align: center;">\
                <button type="button" class="btn btn-default js--btn-cancel" data-dismiss="modal">关闭</button>\
                <button type="button" class="btn btn-primary js--btn-ok">确定</button>\
            </div>\
        </div>\
    </div>\
</div>'
    };

    Dialog.init();

    return {
        Dialog: Dialog,
        Form: Form
    }
} );