define( [ "jquery", JS_BASE_URL + "_form.js" ] , function ( $, Form ) {
    var LoginPage
    ;
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
            Form.bindSubmit( this.$form );

        }
    };
    return LoginPage;
} );