define( [ "lib/ie/ie",
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
            extend,
            Panel,
            Form,
            DropdownMenu,
            Uploadify,
            Switch,
            DatetimePicker,
            Sidebar
            ;
        extend = utils.extend;

        Panel = {
            $self: null,
            showWaiting: function () {
                this.$self.append( '<div class="panel-overlay"></div>' );
                this.$self.append( '<div class="sk-circle"> <!--[if lt IE 9]><div style="color:#fff">waiting</div><![endif]--><div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div>' );
            },
            removeWaiting: function () {
                this.$self.find( ".panel-overlay , sk-circle" ).remove();
            }
        };
        Form = {
            init: function ( $forms ) {
                $forms.parsley();
                this.hideMsgOnClick();
                return this;
            },
            hideMsgOnClick: function () {
                window.Parsley.on( 'form:validated', function () {
                    this.$element.find( ".parsley-errors-list" ).off( "click" ).one( "click", function () {
                        $( this ).removeClass( "filled" );
                    } );
                } ).on( 'field:validated', function () {
                    this.$element.siblings( ".parsley-errors-list" ).off( "click" ).one( "click", function () {
                        $( this ).removeClass( "filled" );
                    } );
                } );
                return this;
            }
        };

        DropdownMenu = {
            init: function () {
                $( '.js--DropdownMenu-container .dropdown-menu a' ).off( "click" ).on( 'click', function ( event ) {
                    var $this,
                        $select,
                        $input,
                        text,
                        value
                        ;
                    $this = $( this );
                    $select = $this.parents( ".js--DropdownMenu-container" ).eq( 0 );
                    $input = $select.find( ".js--DropdownMenu-input" );
                    text = $this.text();
                    value = $this.attr( "data-value" );

                    $input.attr( "data-value", value ).val( text );

                    $input.parsley().validate(); // 再次validate

                    event.preventDefault();

                } );
                //TODO
                /*$(".js--DropdownMenu-input").off( "click" ).on("click",function(){
                 $( this ).parents( ".js--DropdownMenu-container" ).find( '[data-toggle="dropdown"]' ).parent().addClass("open");
                 console.info($( this ).parents( ".js--DropdownMenu-container" ).find( '[data-toggle="dropdown"]' ).parent());
                 });*/
                $( ".js--DropdownMenu-clear" ).off( "click" ).on( "click", function () {
                    $( this ).parents( ".js--DropdownMenu-container" ).find( ".js--DropdownMenu-input" ).val( "" ).parsley().validate();
                } );
            }
        };

        Uploadify = {
            options: {
                'swf': null,
                'uploader': 'Upload',

                'auto': false, // 选择玩文件不自动上传

                //'buttonClass' : 'btn btn-success',
                'buttonText': '选择上传文件',
                'width': "120",
                'height': "34",

                'uploadLimit': 10, // 允许上传的文件数
                'fileSizeLimit': '1000KB',

                'queueSizeLimit': 10, // 可同时上传的文件数
                'removeCompleted': false, // 完成后删除

                'onUploadSuccess': function ( file, data, response ) {
                    console.log( 'The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data );
                }
            },
            init: function () {
                this.options.swf = this.getSwfPath();
                $( ".js--uploadify" ).uploadify( this.options );
            },
            getSwfPath: function () {
                var uplodifyUrl,
                    lastSlashPos,
                    dir,
                    swfPath
                    ;
                uplodifyUrl = require.toUrl( "uploadify" );
                lastSlashPos = uplodifyUrl.lastIndexOf( "/" );
                dir = uplodifyUrl.substring( 0, lastSlashPos + 1 );
                swfPath = dir + "uploadify.swf";
                return swfPath;
            }

        };

        Switch = {
            init: function () {
                $( ".js--switch input:checkbox" ).bootstrapSwitch();
            }
        };

        DatetimePicker = {
            options: {
                language: 'zh-CN',
                weekStart: 1, // Day of the week start. 0 (Sunday) to 6 (Saturday)
                todayBtn: 1,
                autoclose: 1, // Whether or not to close the datetimepicker immediately when a date is selected.
                todayHighlight: 1,
                startView: 2, //  * 0 or 'hour' for the hour view * 1 or 'day' for the day view * 2 or 'month' for month view (the default) * 3 or 'year' for the 12-month overview * 4 or 'decade' for the 10-year overview
                minView: 2,
                forceParse: 1
            },
            init: function () {
                $( '.js--datepicker-container').datetimepicker( this.options ).on( "changeDate", function () {
                    $( this ).find( ".js--datepicker-input" ).parsley().validate(); // 再次validate
                } );
                return this;
            },
            remove: function ( $datepicker ) {
                $datepicker.datetimepicker('remove');
                return this;
            },
            clearAll: function () {
                $( ".datetimepicker" ).remove();
                return this;
            }
        };

        Sidebar = {
            $self: null,
            init: function init() {
                this.render().bind();
            },
            render: function render () {
                var $freezeMenus,
                    docTop, // menu的 文档top
                    docLeft
                    ;
                $freezeMenus = $( ".js--freezeMenu" );
                docTop = parseInt( $freezeMenus.offset().top );
                docLeft = parseInt( $freezeMenus.offset().left );

                this.$self = $freezeMenus;
                this.docTop = docTop;
                this.docLeft = docLeft;

                return this;
            },
            bind: function bind() {
                var _this = this,
                    scrollTop,
                    $win = $( window ),
                    $siderbar = _this.$self,
                    docTop = this.docTop,
                    docLeft = this.docLeft,
                    $body = $( "body,html" )

                    ;
                $( window ).on( "scroll", function () {
                    scrollTop = parseInt( $win.scrollTop() );
                    $siderbar.offset( {
                        top: scrollTop > docTop ? scrollTop : docTop,
                        left: docLeft
                    } );
                } );

                // 添加滚动动画
                $siderbar.find( "a[href^='#']" ).on( "click", function ( event ) {
                    var target,
                        docTop;
                    target = $( $( this ).attr( "href" ) );
                    docTop = target.offset().top;
                    $body.stop().animate( { scrollTop: docTop }, 300 );
                    event.preventDefault();
                } );

                return this;
            }
        };

        main = {
            $forms: null,
            //isIE8: (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8."),
            init: function ( options ) {
                extend( this, options )

                DropdownMenu.init();

                Form.init( this.$forms );

                Uploadify.init();

                Switch.init();

                DatetimePicker.init();

                Sidebar.init();

                this.render().bind();
                return this;
            },
            render: function () {

                return this;
            },
            bind: function () {
                this._wrapPanelOpe();
            },

            _wrapPanelOpe: function () {
                var _this = this;
                $( ".js--edit" ).off( "click" ).on( "click", function () {
                    var $edit = $( this );
                    var $panel = $edit.parents( ".panel[id]" );
                    var $submit = $panel.find( ".js--submit" );
                    $edit.addClass( "hidden" );
                    $submit.removeClass( "hidden" );

                    var curWwwPath = window.document.location.href;
                    var lastSlashPos = curWwwPath.lastIndexOf( "/" );
                    var curPath = curWwwPath.substring( 0, lastSlashPos + 1 );
                    require( [ "text!" + curPath + "tpl/company_edit.tpl", "jquery", "utils/doT" ], function ( tpl, $, doT ) {
                        $( "#panel-body-company" ).html( tpl );
                        _main.init( { $forms: $( "form.parsley" ) } );
                    } );

                } );
                $( ".js--submit" ).off( "click" ).on( "click", function () {
                    var $submit = $( this );
                    var $panel = $submit.parents( ".panel[id]" );
                    var $edit = $panel.find( ".js--edit" );
                    var $form = $panel.find( "form.parsley" );
                    var isValid;

                    isValid = $form.parsley().validate();
                    if ( !isValid ) {
                        return;
                    }

                    $edit.removeClass( "hidden" );
                    $submit.addClass( "hidden" );

                    //$form.submit();

                    var curWwwPath = window.document.location.href;
                    var lastSlashPos = curWwwPath.lastIndexOf( "/" );
                    var curPath = curWwwPath.substring( 0, lastSlashPos + 1 );
                    require( [ "text!" + curPath + "tpl/company_detail.tpl", "jquery", "utils/doT" ], function ( tpl, $, doT ) {
                        var data = {
                            gsmc: "北大高科",
                            gsxz: "北大高科2",
                            glrs: "北大高科3",
                            clsj: "北大高科4",
                            jyfw: "北大高科5",
                            qygm: "北大高科6"
                        };
                        $( "#panel-body-company" ).html( doT.template( tpl )( data ) );
                        _main.init( { $forms: $( "form.parsley" ) } );
                    } );
                    /*swal({
                     title: " ",
                     text: "保存成功!",
                     type: "success",
                     showConfirmButton: true,
                     confirmButtonText: "确定",
                     timer: 1500
                     });*/
                    _this._panelWaiting( $( this ).parents( ".panel" ) );
                } );
            }
        };


        $( function () {
            main.init( { $forms: $( "form.parsley" ) } );
        } );

        window._main = main;
        
        return main;
    } );