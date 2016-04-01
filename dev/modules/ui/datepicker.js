
/*

    月历：

        1. 输入 年份year和月份month
        2. 第一天
            firstDateOfMonth = new Date( year, month - 1, 0 )
        3. 最后一天
            lastDateOfMonth = new Date( year, month, 0 )
        4. 第一天星期几
            dayOfFirstDate = firstDateOfMonth.getDay()
        5. 一个月的天数
            daysOfMonth = lastDateOfMonth.getDate()
        6. 处理
            二维数组calendar[*][6]，行代表每个星期，列代表星期几
            第一行空缺的用上月补齐
            最后一行空缺的用下月补齐
        7. html
            DocumentFragment作为临时容器

 */


+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery", "utils/doT", "text!ui/tpl/datepicker.html!strip" ], factory );
    } else {
        // 全局模式
        // factory( jQuery, doT );
        throw "datepicker depends on doT.js and text.js"
    }
}( function ( $, doT, template ) {
    'use strict';
    $.fn.datepicker = function ( opts ) {
        this.each( function () {
            new DatePicker( $( this ), opts );
        } );
    };
    function DatePicker ( $target, opts ) {
        this.$target = $target;
        this.opts = $.extend( {}, $.fn.datepicker.defaults, opts );
        this.init();
    }
    $.fn.datepicker.defaults = {

    };

    // 公共
    $.extend( DatePicker, {
        isInited: false,
        $container: null,
        $calendarTable: ".calendar-table-box",
        $dropdown: ".dropdown",
        $calendarYear: ".calendar-year-box .dropdown-value",
        $calendarMonth: ".calendar-month-box .dropdown-value",
        templateEngine: null,

        $target: null, // DatePicker实例绑定的$target（<input>）
        todayDate: new Date(),
        selectedDate: null, // 被选中的日期

        init: function () {
            this.templateEngine = doT.template( template );
            this.render();
            this.bind();

            //this.$container.removeClass("hidden");
            //$( "[data-role=datepicker]" ).datepicker();
        },
        render: function () {
            this.$container = $( this.getHtml( true ) ).appendTo( document.body )
                .addClass( "hidden");

            this.$calendarTable = this.$container.find( this.$calendarTable );
            this.isInited = true;

            this.$dropdown = $( this.$dropdown, this.$container );
            this.$calendarYear = $( this.$calendarYear, this.$container );
            this.$calendarMonth = $( this.$calendarMonth, this.$container );
        },
        bind: function () {
            var _this
                ;

            _this = this;

            this.$dropdown.on( "click.dropdown.toggle", ".dropdown-toggle", function () {
                var $this,
                    $activeItem,
                    $dropdown,
                    value
                ;

                $this = $( this );
                $dropdown = $this.closest( ".dropdown" );

                // 切换 dropdown-menu
                $dropdown.toggleClass( "open" );

                // 如果打开了菜单，则滚动到匹配的那个
                if ( ! $dropdown.is( ".open" ) ) {
                    return false;
                }
                value = $this.find( ".dropdown-value" ).text();

                $activeItem = $dropdown.find( "a[data-value='" + value + "']" ).closest( "li" );

                $activeItem.addClass( "active" ).siblings().removeClass( "active" );

                $activeItem.get( 0 ).scrollIntoView();

                return false;
            } )
                .on( "click.dropdown.menu", ".dropdown-menu a", function () {
                    var $dropdown,
                        $this;

                    $this = $( this );
                    $dropdown = $this.closest( ".dropdown" );

                    // 1. 更新值 .dropdown-value
                    $dropdown.find( ".dropdown-value" ).text( $this.attr("data-value") );

                    // 2. 隐藏dropdown
                    $dropdown.removeClass( "open" );

                    // 3. 更新
                    _this.update();
                    return false;
                } );

            this.$container.on( "click.datepick", ".calendar-daynumber > a", function () {
                var $this,
                    dateString
                    ;
                $this = $( this );
                dateString = $this.attr( "data-date" );
                if ( ! dateString ) {
                    return false;
                }
                _this.getTarget().val( dateString );
                _this.hide();
                return false;
            } )
                .find( ".btn-calendar-month-prev, .btn-calendar-month-next" )
                .on( "click.calendar.month", function () {
                    var $this
                    ;

                    $this = $( this );

                    if ( $this.is( ".btn-calendar-month-prev" ) ) {
                        _this.prevMonth();
                    } else {
                        _this.nextMonth();
                    }

                    _this.$dropdown.removeClass( "open" );

                    return false;
                } )
                .end().find( ".calendar-backtoday" ).on( "click.calendar.backtoday", function () {
                    _this.update( _this.todayDate );
                } );
        },
        update: function ( date ) {
            var html;
            date = date || this.getCalendar();
            this.setCalendar( date );
            html = this.getHtml( false, date );
            this.$calendarTable.html( html );

            // 后置处理
            this.postRender();
        },
        postRender: function () {

            var selectedDateString,
                todayDateString
                ;

            selectedDateString = this.formatDate( this.getSelectedDate() );
            todayDateString = this.formatDate( this.todayDate );

            this.$calendarTable.find(".calendar-daynumber > a" ).each( function () {
                var $this,
                    dateString
                ;
                $this = $( this );
                dateString = $this.attr( "data-date" );
                if ( ! dateString ) {
                    return;
                }
                if ( dateString === selectedDateString ) {
                    $this.parent().addClass( "calendar-daynumber-selected" );
                }
                if ( dateString === todayDateString ) {
                    $this.parent().addClass( "calendar-daynumber-today" );
                }
            } );

        },
        getCalendar: function () {
            var year,
                month,
                day
            ;
            year = this.$calendarYear.text();
            month = this.$calendarMonth.text();
            day = 1;

            return new Date( year, month - 1, day );
        },
        setCalendar: function ( date ) {
            if ( ! date ) {
                return;
            }
            this.$calendarYear.text( date.getFullYear() );
            this.$calendarMonth.text( date.getMonth() + 1 );
        },
        nextMonth: function ( step ) {
            var date,
                year,
                month
            ;
            date = this.getCalendar();
            year = date.getFullYear();
            month = date.getMonth();

            // 计算
            month = month + ( step || 1 );

            if ( month > 11 ) {
                month = 0;
                year++;
            }
            if ( month < 0 ) {
                month = 11;
                year--;
            }
            this.setCalendar( new Date( year, month, 1 ) );
            this.update();
        },
        prevMonth: function () {
            this.nextMonth( -1 );
        },
        getHtml: function ( isWhole, d ) {
            var html,
                data,
                date,
                year,
                month,
                day
                ;
            date = d || new Date();
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();

            data = {
                isWhole: isWhole,
                date: { year: year, month: month, day: day },
                days: this.getWeeks( year, month )
            };
            html = DatePicker.templateEngine( data );

            return html;
        },
        getWeeks: function getWeeks( year, month ) { // month 从0开始
            var calendar,         // 二维数组存储该月信息 calendar[5][7]
                firstDateOfMonth, // 该月的第一天(Date)
                lastDateOfMonth,  // 该月的最后一天(Date)
                dayOfFirstDate,   // 该月的第一天是星期几
                daysOfMonth,      // 该月有多少天
                i, len            // 用于 for 循环
                ;

            calendar = new Calendar();

            firstDateOfMonth = new Date( year, month, 1 );
            lastDateOfMonth = new Date( year, month + 1, 0 );
            dayOfFirstDate = firstDateOfMonth.getDay(); // 0 为星期日，1 为星期一
            daysOfMonth = lastDateOfMonth.getDate();

            // 补足第一个星期不属于该月的日期
            // 1 星期1，补0天
            // 2 星期2，补1天
            // 3 星期3，补2天
            // 4 星期4，补3天
            // 5 星期5，补4天
            // 6 星期6，补5天
            // 0 星期7，补6天；
            for ( i = 0, len = ( dayOfFirstDate - 1 + 7 ) % 7; i < len; i++ ) {
                calendar.push( "" );
            }

            // 填充 calendar
            for ( i = 0, len = daysOfMonth; i < len; i++ ) {
                calendar.push( { year: year, month: month, day: ( i + 1 ) } );
            }

            calendar.deleteTail();

            return calendar.container;
        },
        setTarget: function ( $target ) {
            this.$target = $target;
        },
        getTarget: function () {
            return this.$target;
        },
        getSelectedDate: function () {
            return this.convertToDate( this.$target.val() );
        },
        show: function () {
            this.$container.removeClass( "hidden" );
        },
        hide: function () {
            this.$container.addClass( "hidden" );
        },
        formatDate: function ( date ) {
            var year,
                month,
                day
            ;
            if (  ! date || ! ( date instanceof Date ) )  {
                return null;
            }
            year = date.getFullYear();
            month = ( "0" + ( date.getMonth() + 1 ) ).slice( -2 );
            day = ( "0" + date.getDate() ).slice( -2 );

            return [ year, month, day ].join( "-" );
        },
        convertToDate: function ( dateString ) {
            var pattern,
                date,
                year,
                month,
                day
                ;

            if ( ! dateString ) {
                return null;
            }

            pattern = /^(\d{4})\D(\d{1,2})\D(\d{1,2}$)/;
            date = pattern.exec( dateString );
            if ( ! date ) {
                return null;
            }
            year = parseInt( date[ 1 ] );
            month = parseInt( date[ 2 ] ) - 1;
            day = parseInt( date[ 3 ] );

            return new Date( year, month, day );
        }

    } );

    $.extend( DatePicker.prototype, {
        init: function init () {
            DatePicker.isInited || DatePicker.init();
            this.render();
            this.bind();
            this.constructor.setTarget( this.$target );
        },
        render: function render () {
        },
        bind: function bind() {
            var _this
            ;
            _this = this;
            this.$target.on( "click", function () {
                _this.update();
                _this.constructor.show();
            } );

        },
        update: function () {
            this.constructor.update( this.getDate() );
        },
        getDate: function () {
            return this.constructor.convertToDate( this.$target.val() ) || new Date();
        }
    } );


    /**
     * 生成一个二维数组，方便存取日历格式的数据
     */
    function Calendar () {
        // 一个月最多占6个星期
        var container = [];
        for ( var week = 0; week < 6; week++ ) {
            container[ week ] = [];
            for ( var day = 0; day < 7; day++ ) {
                container[ week ][ day ] = "";
            }
        }
        this.container = container;
        this.index = 0; // container[0][0] 为0， container[0][1] 为1，。。。
    }

    $.extend( Calendar.prototype, {
        push: function push ( date ) {
            var weekAxis, // 纵轴（一维）
                dayAxis   // 横轴（二维）
                ;
            weekAxis = Math.floor( this.index / 7 );
            dayAxis = this.index % 7;

            this.container[ weekAxis ][ dayAxis ] = date || "";
            this.index++;
        },
        deleteTail: function deleteTail () { // 删除末尾的空行
            var container
            ;
            container = this.container;
            for ( var i = 1, len = container.length; i < len; i++ ) {
                if ( container[ i ][ 0 ] !== "" ) {
                    continue;
                }
                container.length = i;
                break;
            }
        },
        print: function ( prop ) {
            var str,
                c
            ;
            str = "\t一\t二\t三\t四\t五\t六\t七\n";
            c = this.container;
            for ( var i = 0; i < c.length; i++ ) {
                var line = "";
                for ( var j = 0; j < c[ i ].length; j++ ) {
                    line += "\t" + ( c[ i ][ j ] && c[ i ][ j ][ prop ] );
                }
                line += "\n";
                str += line;
            }
            console.info( str );

            return str;
        }
    } );


} ));

