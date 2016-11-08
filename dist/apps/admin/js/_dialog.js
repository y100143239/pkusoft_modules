define( [ "jquery", "formvalidationI18N", "bootstrap" ], function ( $ ) {

    function Dialog( opts ) {
        this.$container = null;
        this.$modalDialog = ".modal-dialog";
        this.$modalBody = ".modal-body";
        this.$title = ".modal-title";
        this.$content = ".modal-text";
        this.$confirmBtn = ".js--btn-ok";
        this.$cancelBtn = ".js--btn-cancel";
        this.$closeBtn = ".js--btn-close";
        this.options = null;

        this.init();
        this.setOptions( opts );
    }


    Dialog.prototype.defaults = {
        title: "提示",
        content: "点击“取消”按钮关闭对话框。",
        hasConfirmBtn: true,
        hasCancelBtn: true,
        confirmBtnText: "确定",
        cancelBtnText: "取消",
        width: null,
        remoteUrl: null, // 载入页面的URL
        //remoteHTMLModuleSelector: ".page", // 将请求的页面指定部分的内容载入
        requestData: null,
        requestSuccessCallback: null,
        confirmCallback: function () {
            // this 指向 Dialog 实例
            window.console && console.info( "confirmCallback" );
            this.hide();
        },
        cancelCallback: function () {
            // this 指向 Dialog 实例
            window.console && console.info( "cancelCallback" );
            this.hide();
        }
    };

    Dialog.prototype.init = function () {
        var _this
            ;
        _this = this;

        this.$container = $( this.template );
        this.$modalDialog = this.$container.find( this.$modalDialog );
        this.$modalBody = this.$container.find( this.$modalBody );
        this.$title = this.$container.find( this.$title );
        this.$content = this.$container.find( this.$content );
        this.$confirmBtn = this.$container.find( this.$confirmBtn );
        this.$cancelBtn = this.$container.find( this.$cancelBtn );
        this.$closeBtn = this.$container.find( this.$closeBtn );


        this.$container.css( {
            position: "absolute", // 当高度过高时，出现滚动条
            overflow: "auto",
            height: "100%"
        } ).on( "show.bs.modal", function () {
            _this.$container.css( "margin-top", $( window ).scrollTop() );
        } ).modal( {
            backdrop: "static",
            show: true
        } );
    };

    $.extend( Dialog.prototype, {
        show: function ( opts ) {
            this.$container.modal( 'show' );
            this.setOptions( opts );
        },
        hide: function ( isHidden ) {
            this.$container.modal( 'hide' );
            // 如果不隐藏，则删除掉
            if ( ! isHidden ) {
                this.$container.remove();
            }
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

            // 尺寸
            if ( options.width ) {
                this.$modalDialog.css( "width", options.width );
            }

            // “确定”按钮
            if ( options.hasConfirmBtn ) {
                this.$confirmBtn.removeClass( "hidden" ).html( options.confirmBtnText )
                    .off( "click.confirm.dialog" )
                    .on( "click.confirm.dialog", function () {
                        options.confirmCallback.call( _this );
                    } );
            } else {
                this.$confirmBtn.addClass( "hidden" );
            }

            // “取消”按钮
            if ( options.hasCancelBtn ) {
                this.$cancelBtn.removeClass( "hidden" ).html( options.cancelBtnText )
                    .off( "click.cancel.dialog" )
                    .on( "click.cancel.dialog", function () {
                        options.cancelCallback.call( _this );
                    } );
            } else {
                this.$cancelBtn.addClass( "hidden" );
            }

            // “关闭”按钮
            this.$closeBtn
                .off( "click.cancel.dialog" )
                .on( "click.cancel.dialog", function () {
                    options.cancelCallback.call( _this );
                } );

            // 载入页面
            if ( options.remoteUrl ) {
                jQuery.ajax({
                    url: options.remoteUrl,
                    type: "POST",
                    dataType: "html",
                    data: options.requestData
                }).done(function( responseText ) {
                    /*
                    var $temp
                        ;
                    $temp = jQuery("<div>").append( jQuery.parseHTML( responseText ) );
                    _this.$modalBody.html( $temp.find( options.remoteHTMLModuleSelector ).html() );
                    */
                    _this.$modalBody.html( responseText );
                    if ( options.requestSuccessCallback ) {
                        options.requestSuccessCallback.call( _this );
                    }
                }).fail( function () {
                    new Dialog ( { title: "错误", content: "网络异常。" } );
                } );
            }
        }
    } );


    Dialog.prototype.template = '\
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
            <div class="modal-footer" style="text-align: right;">\
                <button type="button" class="btn btn-default js--btn-cancel">关闭</button>\
                <button type="button" class="btn btn-primary js--btn-ok">确定</button>\
            </div>\
        </div>\
    </div>\
</div>';


    return Dialog;
} );