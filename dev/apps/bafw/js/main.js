define(["lib/ie/ie",
        "lib/datetimepickter/js/datetimepicker",
        "jquery",
        "utils/utils",
        "lib/parsley/parsley",
        "css!ui/css/style",
        "lib/switch/js/bootstrap-switch"
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
            this._wrapDatetimePicker();
            this._wrapCheckbox();
            this._wrapMenu();

            this._formsValidate();

        },
        _formsValidate: function _formsValidate() {
            this.$forms.parsley();
            window.Parsley.on('form:validated', function() {
                this.$element.find(".parsley-errors-list" ).one("click" ,function(){
                    $(this ).removeClass("filled");
                });
            }).on('field:validated', function() {
                this.$element.siblings(".parsley-errors-list" ).one("click" ,function(){
                    $(this ).removeClass("filled");
                });
            });
            return this;
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

            } );
            $(".js-clear" ).on("click",function(){
                $(this).parents(".js--select").find(".js--input" ).val("");
            });
            return this;
        },
        _wrapDatetimePicker: function() {
            $('.js--date').datetimepicker({
                language:  'zh-CN',
                weekStart: 1, // Day of the week start. 0 (Sunday) to 6 (Saturday)
                todayBtn:  1,
                autoclose: 1, // Whether or not to close the datetimepicker immediately when a date is selected.
                todayHighlight: 1,
                startView: 2, //  * 0 or 'hour' for the hour view * 1 or 'day' for the day view * 2 or 'month' for month view (the default) * 3 or 'year' for the 12-month overview * 4 or 'decade' for the 10-year overview
                minView: 2,
                forceParse: 1
            } ).on("changeDate",function(){
                $(this ).find(".js--input" ).parsley().validate(); // 再次validate
            } );
            return this;
        },
        _wrapCheckbox: function () {
            $(".switch input:checkbox" ).bootstrapSwitch();
            return this;
        },
        _wrapMenu: function() {
            var $freezeMenus,
                scrollTop, // 滚动条 top
                docTop, // menu的 文档top
                docLeft
                ;
            $freezeMenus = $(".js--freezeMenu");
            docTop = parseInt( $freezeMenus.offset().top );
            docLeft = parseInt( $freezeMenus.offset().left );

            $(window).on("scroll", function(){
                scrollTop = parseInt( $(window).scrollTop() ) ;
                //console.info( "scrollTop = " + scrollTop + "，top = " + docTop  );
                $freezeMenus.offset({
                    top: scrollTop > docTop ? scrollTop : docTop,
                    left: docLeft
                });
            });

            // 添加滚动动画
            $freezeMenus.find("a[href^='#']" ).on("click",function(event){
                var target,
                    docTop;
                target = $( $(this ).attr("href") );
                docTop = target.offset().top;
                $( "body,html" ).stop().animate({ scrollTop: docTop }, 300);
                event.preventDefault();
            })
        }
    };


    $(function () {
        main.init({$forms:$("form.parsley")});
    });

    return main;

});