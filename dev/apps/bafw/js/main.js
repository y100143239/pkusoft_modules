define( [ "lib/ie/ie",
        "lib/datetimepickter/js/datetimepicker",
        "jquery",
        "utils/utils",
        "lib/parsley/parsley",
        "utils/doT",
        "css!ui/css/style",
        "lib/switch/js/bootstrap-switch",
        "uploadify",
        "sweetalert"
    ],
    function ( ie, datetimepicker, $, utils, parsley, doT ) {

        var main,
            Panel,
            Form,
            DropdownMenu,
            Uploadify,
            Switch,
            DatetimePicker,
            Sidebar
            ;

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

                $target.find( ".js--DropdownMenu-clear" ).on( "click", function () {
                    $( this ).parents( ".js--DropdownMenu-container" ).find( ".js--DropdownMenu-input" ).val( "" ).parsley().validate();
                } );
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
            hookClass: ".js--datepicker-container",
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
                $target.datetimepicker( this.options ).on( "changeDate", function () {
                    $( this ).find( ".js--datepicker-input" ).parsley().validate(); // 再次validate
                } );
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
            $self: null,
            $submit: null,
            $edit: null,
            init: function () {
                $.each( [ Form, DropdownMenu, Uploadify, Switch, DatetimePicker, Sidebar ], function () {
                    this.init();
                } );
                this.render().bind();
            },
            wrap: function ( $panel ) {
                $.each( [ Form, DropdownMenu, Uploadify, Switch, DatetimePicker ], function () {
                    this.wrap( $panel.find( this.hookClass ) );
                } );
            },
            render: function () {
                this.$self = $( ".js--panel" );
                this.$submit = $( ".js--form-submit" );
                this.$edit = $( ".js--form-edit" );
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
                    _this.showWaiting( $panel );
                    _this.doSubmit( $form, function ( data ) {
                        _this.removeWaiting( $panel );
                        _this.toggleBtn( $panel );
                        DatetimePicker.remove( $( ".js--datepicker-container" ) );
                        swal( {
                            title: " ",
                            text: "保存成功!",
                            type: "success",
                            //showConfirmButton: true,
                            confirmButtonText: "确定",
                            timer: 1500
                        } );
                        _this.showDetail( $panel, data );
                    } )
                } );

                this.$edit.on( "click", function submitClickHandler() {
                    $panel = $( this ).parents( ".js--panel" );
                    $form = $panel.find( ".js--form" );
                    _this.showWaiting( $panel );
                    _this.doEdit( $form, function ( data ) {
                        _this.removeWaiting( $panel );
                        _this.toggleBtn( $panel );
                        _this.showEdit( $panel, data );
                    } )
                } );

                return this;
            },
            showWaiting: function ( $panel ) {
                $panel.append( '<div class="panel-overlay"></div>' );
                $panel.append( '<div class="sk-circle"> <!--[if lt IE 9]><div style="color:#fff">waiting</div><![endif]--><div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div>' );
                return this;
            },
            removeWaiting: function ( $panel ) {
                $panel.find( ".panel-overlay , .sk-circle" ).remove();
                return this;
            },
            toggleBtn: function ( $panel ) {
                $panel.find( ".js--form-edit" ).toggleClass( "hidden" );
                $panel.find( ".js--form-submit" ).toggleClass( "hidden" );
                return this;
            },
            doSubmit: function ( $form, callback ) {
                // Ajax
                var data = { // all data
                    //gsmc: "北大高科gsmc",
                    //gsxz: "北大高科gsxz",
                    //glrs: "北大高科glrs",
                    //clsj: "北大高科clsj",
                    //jyfw: "北大高科jyfw",
                    //qygm: "北大高科qygm"
                };
                var queryString = $form.serialize();
                $.each( queryString.split( "&" ), function () {
                    var pair = this.split( "=" );
                    var key = pair[ 0 ];
                    var value = pair[ 1 ] || "";
                    if ( data[ key ] ) {
                        data[ key ] += "," + value;
                    } else {
                        data[ key ] = value;
                    }
                } );
                //console.info(queryString,data);
                setTimeout( function () {
                    callback( data );
                }, 2000 )
            },
            doEdit: function doEdit( $form, callback ) {
                var data = {
                    gsmc: "北大高科",
                    gsxz: "03",
                    dic_gsxz: {
                        "01": "国有企业",
                        "02": "集体企业",
                        "03": "联营企业",
                        "04": "股份合作制企业",
                        "05": "私营企业",
                        "06": "个体户",
                        "07": "合伙企业",
                        "08": "有限责任公司",
                        "09": "股份有限公司"
                    },
                    glrs: "20",
                    clsj: "2012-12-12",
                    //jyfw: "北大高科jyfw",
                    //qygm: "北大高科qygm"
                };
                setTimeout( function () {
                    callback( data );
                }, 2000 )
            },
            showEdit: function showEdit( $panel, data ) {
                var _this = this;
                this._getTemplate( $panel.attr( "data-template" ), "_edit", function ( template ) {
                    $panel.find( ".panel-body" ).html( doT.template( template )( data ) );
                    _this.wrap( $panel );
                } );
            },
            showDetail: function showDetail( $panel, data ) {
                // data

                // template
                this._getTemplate( $panel.attr( "data-template" ), "_detail", function ( template ) {
                    $panel.find( ".panel-body" ).html( doT.template( template )( data ) );
                } );
            },
            _getTemplate: function ( templateName, templateType, callback ) {
                var curWwwPath = window.document.location.href;
                var lastSlashPos = curWwwPath.lastIndexOf( "/" );
                var curPath = curWwwPath.substring( 0, lastSlashPos + 1 );
                require( [ "text!" + curPath + "tpl/" + templateName + templateType + ".tpl" ], function ( template ) {
                    callback( template );
                } );
            }
        };


        $( function () {
            Panel.init();
        } );

        window._main = main;

        return main;
    } );