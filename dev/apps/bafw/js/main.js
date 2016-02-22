define( [ "lib/ie/ie",
        "lib/datetimepickter/js/datetimepicker",
        "jquery",
        //"utils/utils",
        "lib/parsley/parsley",
        //"utils/doT",
        "css!ui/css/style",
        "lib/switch/js/bootstrap-switch",
        "uploadify",
        "sweetalert"
    ],
    function ( ie, datetimepicker, $, /*utils,*/ parsley) {

        var Utils = {},
            main,
            Panel,
            Form,
            DropdownMenu,
            Uploadify,
            Switch,
            DatetimePicker,
            Sidebar
            ;

        Utils.ajax = function ( options ) {
            var setting = {
                type: "POST", //请求方式 ("POST" 或 "GET")
                url: "", // 请求的URL
                data: { name: "value" },
                timeout: 30000, // 设置请求超时时间（毫秒）
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                cache: false, // 不缓存此页面
                dataType: "json", // 预期服务器返回的数据类型。
                error: null, // 请求失败时调用此函数
                success: null, // 请求成功后的回调函数。参数：由服务器返回，并根据 dataType 参数进行处理后的数据
                complete: null // 当请求完成之后调用这个函数，无论成功或失败。
            };
            for ( var p in options ) {
                if ( options.hasOwnProperty( p ) ) {
                    setting[ p ] = options[ p ];
                }
            }
            $.ajax( setting );
        };
        Utils.wait = {
            show: function show( $target ) {
                if ( !this._isAdded( $target ) ) {
                    this._add( $target );
                }
                $target.find( ".wait-overlay" ).show();
                return this;
            },
            hide: function hide( $target ) {
                $target.find( ".wait-overlay" ).hide();
                return this;
            },
            _add: function ( $target ) {
                $target.css( "position", function ( index, val ) {
                    return val === "static" ? "relative" : val;
                } );
                $target.append( "<div class='wait-overlay'></div>" );
                return this;
            },
            _isAdded: function ( $target ) {
                return $target.find( ".wait-overlay" ).length > 0;
            }
        };
        Utils.alert = {
            html: '<div class="alert alert-warning"> <button type="button" class="close" ><span>×</span></button> <strong>提示：</strong>网络繁忙，请稍后重试！</div>',
            show: function show( $target ) {
                if ( !this._isAdded( $target ) ) {
                    this._add( $target );
                }
                $target.find( ".alert-warning" ).show();
                return this;
            },
            hide: function hide( $target ) {
                $target.find( ".alert-warning" ).hide();
                return this;
            },
            _add: function ( $target ) {
                var _this = this;
                $target.css( "position", function ( index, val ) {
                    return val === "static" ? "relative" : val;
                } );
                $( this.html ).appendTo( $target ).find(".close" ).on("click", function() {
                    _this.hide( $target );
                });
                return this;
            },
            _isAdded: function ( $target ) {
                return $target.find( ".alert-warning" ).length > 0;
            }
        };

        Form = {
            hookClass: ".js--form",
            init: function () {
                $( this.hookClass ).parsley();
                this.bind();
                return this;
            },
            bind: function () {
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
            },
            wrap: function wrap( $target ) {
                $target.parsley();
                return this;
            }
        };

        DropdownMenu = {
            hookClass: ".js--DropdownMenu-container",
            init: function () {
                this.bind( $( this.hookClass ) );
            },
            bind: function ( $target ) {
                $target.find( '.dropdown-menu a' ).on( 'click', function ( event ) {
                    var $this,
                        $select,
                        $input,
                        $hidden,
                        text,
                        value
                        ;
                    $this = $( this );
                    $select = $this.parents( ".js--DropdownMenu-container" ).eq( 0 );
                    $input = $select.find( ".js--DropdownMenu-input" );
                    $hidden = $input.siblings( ".js--DropdownMenu-hidden" );
                    text = $this.text();
                    value = $this.attr( "data-value" );

                    $input.val( text );
                    $hidden.val( value );
                    $input.parsley().validate(); // 再次validate

                    event.preventDefault();

                } );
                /*
                $target.find( ".js--DropdownMenu-clear" ).on( "click", function () {
                    $( this ).parents( ".js--DropdownMenu-container" ).find( ".js--DropdownMenu-input" ).val( "" ).parsley().validate();
                } );
                */
            },
            wrap: function ( $target ) {
                this.bind( $target );
            }
        };

        Uploadify = {
            hookClass: ".js--uploadify",
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
                $( this.hookClass ).uploadify( this.options );
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
            },
            wrap: function wrap( $target ) {
                $target.uploadify( this.options );
                return this;
            }

        };

        Switch = {
            hookClass: ".js--switch input:checkbox",
            init: function () {
                $( this.hookClass ).bootstrapSwitch();
            },
            wrap: function wrap( $target ) {
                $target.bootstrapSwitch();
            }
        };

        DatetimePicker = {
            hookClass: ".js--datepicker",
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
                this.wrap( $( this.hookClass ) );
                return this;
            },
            wrap: function ( $target ) {
                $target.datetimepicker( this.options );
                return this;
            },
            remove: function ( $datepicker ) {
                $datepicker.datetimepicker( 'remove' );
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
            render: function render() {
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

        Panel = {
            $self: ".js--panel",
            $submit: ".js--form-submit",
            $edit: ".js--form-edit",
            mark: null,
            init: function () {
                var _this = this;
                $.each( [ Form, DropdownMenu, Uploadify, Switch, DatetimePicker, Sidebar ], function () {
                    this.init();
                } );
                this.render().bind();
                this.$self.each( function () {
                    //_this.showDetailMode( $(this) );
                } );
            },
            wrap: function ( $panel ) {
                $.each( [ Form, DropdownMenu, Uploadify, Switch, DatetimePicker ], function () {
                    this.wrap( $panel.find( this.hookClass ) );
                } );
            },
            render: function () {
                this.$self = $( this.$self );
                this.$submit = $( this.$submit );
                this.$edit = $( this.$edit );
                return this;
            },
            bind: function () {
                var _this = this,
                    $panel,
                    $form,
                    isValid
                    ;
                this.$submit.on( "click", function submitClickHandler() {
                    $panel = $( this ).parents( ".js--panel" );
                    $form = $panel.find( ".js--form" );
                    isValid = $form.parsley().validate();
                    if ( !isValid ) {
                        return;
                    }
                    _this.doSubmit( $panel );
                } );

                // 点击“修改”：切换为修改模式
                this.$edit.on( "click", function submitClickHandler() {
                    $panel = $( this ).parents( ".js--panel" );
                    _this.doEdit( $panel );
                } );

                return this;
            },
            doSubmit: function ( $panel ) {
                var queryString,
                    _this,
                    mark,
                    url
                    ;
                _this = this;
                mark = $panel.attr("data-mark");
                url = CTX + mark + "/save";

                queryString = $panel.find(".js--form").serialize();

                Utils.ajax({
                    url: url,
                    data: queryString,
                    dataType: "text",
                    success: successHandler,
                    error: errorHandler,
                    complete: completeHandler
                });

                function errorHandler() {
                    Utils.alert.show($panel);
                }

                function successHandler( responseData ) {
                    if ( responseData === "success" ) {
                        DatetimePicker.remove( $( ".js--datepicker-container" ) );
                        swal( {
                            title: " ",
                            text: "保存成功!",
                            type: "success",
                            //showConfirmButton: true,
                            confirmButtonText: "确定",
                            timer: 1500
                        } );
                        _this.showDetailMode( $panel );
                        return;
                    }

                    swal( {
                        title: " ",
                        text: "保存失败!",
                        type: "error",
                        //showConfirmButton: true,
                        confirmButtonText: "确定",
                        timer: 1500
                    } );

                }

                function completeHandler() {
                }
            },
            doEdit: function doEdit( $panel ) {
                this.showEditMode( $panel );
            },
            changeMode: function changeModel( $panel, type, callback ) { // type="detail":详情模式(默认)；type="edit":编辑模式
                var mark,
                    url
                    ;
                mark = $panel.attr("data-mark");
                url = CTX + mark + "/" + (type || "detail");

                if ( ! mark ) {
                    throw "请给data-mark赋值";
                }

                // 1. 获取详情页
                Utils.ajax({
                    url: url,
                    dataType: "text",
                    success: successHandler,
                    error: function errorHandler() {
                        //alert( "数据获取失败" );
                        Utils.alert.show($panel);
                    },
                    complete: callback
                });

                // 2. 置入panel
                function successHandler( responseData ) {
                    //console.info( responseData );
                    $panel.find(".panel-body" ).html(responseData);
                }
            },
            showEditMode: function showEdit( $panel ) {
                var _this = this;
                Utils.wait.show( $panel );
                this.changeMode( $panel, "edit", function callback() {
                    Utils.wait.hide( $panel );
                    _this.wrap( $panel );
                    // 重置按钮
                    _this.$submit.removeClass("hidden");
                    _this.$edit.addClass("hidden");
                } );
                return this;
            },
            showDetailMode: function showDetail( $panel ) {
                var _this = this;
                Utils.wait.show( $panel );
                this.changeMode( $panel, "detail", function callback() {
                    Utils.wait.hide( $panel );
                    // 重置按钮
                    _this.$edit.removeClass("hidden");
                    _this.$submit.addClass("hidden");
                } );
                return this;
            }
        };


        $( function () {
            Panel.init();
        } );

        window._main = main;

        return main;
    } );