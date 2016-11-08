define( [ "jquery", JS_BASE_URL + "_dialog.js" ,"formvalidationI18N" ], function ( $, Dialog ) {
    var Form
        ;
    Form = {
        /*
            验证成功后，直接跳转页面
            <form
                data-fv-remote-validate-url="将表单数据提交到后台处理"
                action="后台处理数据处理成功后，跳转的页面"></form>
         */
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
                            new Dialog ( { title: "提示", content: data.message || "用户名/密码 错误。" } );
                            return;
                        }

                        // 创建一个表单进行提交
                        if ( actionUrl ) {
                            $( '<form action="' + actionUrl + '">' ).appendTo( document.body ).submit();
                        }
                    }).fail( function (){
                        new Dialog ( { title: "错误", content: "网络异常。" } );
                    } );
            } );
        }
    };
    return Form;
} );