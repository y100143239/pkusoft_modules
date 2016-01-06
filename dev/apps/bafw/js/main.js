define(["lib/ie/ie",
        "lib/datetimepickter/js/datetimepicker",
        "jquery",
        "utils/utils",
        "lib/parsley/parsley",
        "css!ui/css/style",
        "lib/switch/js/bootstrap-switch",
        "uploadify",
        "sweetalert"
    ],
    function ( ie, datetimepicker, $, utils, parsley ) {

    var main,
        extend
        ;
    extend = utils.extend;

    main = {
        $forms: null,
        isIE8: (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8."),
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
            this._wrapUploadify();
            this._wrapDialog();
            this._wrapPanelOpe();

            this._formsValidate();

        },
        _wrapPanelOpe: function() {
            $(".js--edit" ).on("click", function() {
                var $edit = $(this);
                var $panel = $edit.parents(".panel[id]");
                var $submit = $panel.find(".js--submit");
                $edit.addClass("hidden");
                $submit.removeClass("hidden");

                var curWwwPath = window.document.location.href;
                var lastSlashPos = curWwwPath.lastIndexOf("/");
                var curPath = curWwwPath.substring(0, lastSlashPos + 1);
                require(["text!" + curPath + "/tpl/company_edit.tpl", "jquery","utils/doT"], function(tpl, $, doT){
                    $("#panel-body-company" ).html( tpl );
                    _main.init({$forms:$("form.parsley")});
                });

            });
            $(".js--submit" ).on("click", function(){
                var $submit = $(this);
                var $panel = $submit.parents(".panel[id]");
                var $edit = $panel.find(".js--edit");
                var $form = $panel.find("form.parsley");
                var isValid;

                isValid = $form.parsley().validate();
                if ( ! isValid ) {
                    return;
                }

                $edit.removeClass("hidden");
                $submit.addClass("hidden");

                //$form.submit();

                var curWwwPath = window.document.location.href;
                var lastSlashPos = curWwwPath.lastIndexOf("/");
                var curPath = curWwwPath.substring(0, lastSlashPos + 1);
                require(["text!" + curPath + "/tpl/company_detail.tpl", "jquery","utils/doT"], function(tpl, $, doT){
                    var data = {
                        gsmc: "北大高科",
                        gsxz: "北大高科2",
                        glrs: "北大高科3",
                        clsj: "北大高科4",
                        jyfw: "北大高科5",
                        qygm: "北大高科6"
                    };
                    $("#panel-body-company" ).html( doT.template( tpl )( data ) );
                    _main.init({$forms:$("form.parsley")});
                });
            });
        },
        _wrapDialog: function () {
            $("._js--submit" ).on("click", function(){
                swal({
                    title: " ",
                    text: "保存成功!",
                    type: "success",
                    confirmButtonText: "确定"
                });
            });
        },
        _formsValidate: function _formsValidate() {
            this.$forms.parsley();
            window.Parsley.on('form:validated', function() {
                this.$element.find(".parsley-errors-list" ).off("click").one("click" ,function(){
                    $(this ).removeClass("filled");
                });
            }).on('field:validated', function() {
                this.$element.siblings(".parsley-errors-list" ).off("click").one("click" ,function(){
                    $(this ).removeClass("filled");
                });
            });
            return this;
        },
        _wrapDropdownMenu: function() { // 封装bootstrap 的 dropdown-menu
            $('.js--select .dropdown-menu a').off("click").on('click', function(event) {
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
            $(".js-clear" ).off("click").on("click",function(){
                $(this).parents(".js--select").find(".js--input" ).val("" ).parsley().validate();
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
            } ).off("changeDate").on("changeDate",function(){
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

            $(window).off("scroll").on("scroll", function(){
                scrollTop = parseInt( $(window).scrollTop() ) ;
                //console.info( "scrollTop = " + scrollTop + "，top = " + docTop  );
                $freezeMenus.offset({
                    top: scrollTop > docTop ? scrollTop : docTop,
                    left: docLeft
                });
            });

            // 添加滚动动画
            $freezeMenus.find("a[href^='#']" ).off("click").on("click",function(event){
                var target,
                    docTop;
                target = $( $(this ).attr("href") );
                docTop = target.offset().top;
                $( "body,html" ).stop().animate({ scrollTop: docTop }, 300);
                event.preventDefault();
            })
        },
        _wrapUploadify: function() {
            var uplodifyUrl,
                lastSlashPos,
                dir,
                swfPath
                ;
            uplodifyUrl = require.toUrl("uploadify");
            lastSlashPos = uplodifyUrl.lastIndexOf("/");
            dir = uplodifyUrl.substring(0, lastSlashPos + 1);
            swfPath = dir + "uploadify.swf";
            //console.info(swfPath);
            setTimeout(function(){
                $(".js--uploadify").uploadify({
                'swf'      : swfPath,
                'uploader' : 'Upload',

                'auto'     : false, // 选择玩文件不自动上传

                //'buttonClass' : 'btn btn-success',
                'buttonText' : '选择上传文件',
                'width': "120",
                'height': "34",

                'uploadLimit' : 10, // 允许上传的文件数
                'fileSizeLimit' : '1000KB',

                'queueSizeLimit' : 10, // 可同时上传的文件数
                'removeCompleted' : false, // 完成后删除


                'onUploadSuccess' : function(file, data, response) {
                    console.log('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
                }
            });
        },10);
        }
    };


    $(function () {
        main.init({$forms:$("form.parsley")});
    });
    window._main = main;
    return main;
});