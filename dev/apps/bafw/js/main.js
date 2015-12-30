define(["lib/ie/ie",
        "lib/datetimepickter/js/datetimepicker",
        "jquery",
        "utils/utils",
        "lib/parsley/parsley",
        "css!ui/css/style"
    ],
    function ( ie, datetimepicker, $, utils, parsley ) {

    var main,
        extend
        ;
    extend = utils.extend;

    main = {
        $forms: null,
        init: function( options ){
            extend(this, options);
            this.render().bind();
            return this;
        },
        render: function() {

            return this;
        },
        bind: function() {

            this._wrapDropdownMenu();

            this.$forms.parsley();

        },
        _wrapDropdownMenu: function() { // 封装bootstrap 的 dropdown-menu
            $('.js--select .dropdown-menu a').on('click', function(event) {
                var $this,
                    $select,
                    $input,
                    text,
                    value
                    ;
                $this = $(this);
                $select = $this.parents(".js--select" ).eq(0);
                $input = $select.find(".js--input");
                text = $this.text();
                value = $this.attr("data-value");

                $input.attr("data-value", value ).val(text );

                $input.parsley().validate(); // 再次validate

                event.preventDefault();

            });
        }
    };


    $(function () {
        main.init({$forms:$("form.parsley")});
        $('.form_date').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        });
    });
/*

    require(["lib/datetimepickter/js/datetimepicker"], function(){
        $('.form_date').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        });
    });
*/


    return main;

});