require( [ "jquery" ,"echarts", "echartsTheme", "bootstrap", "sweet-alert" ],
    function ( $, echarts, _echartsTheme, _bs, _sweetAlert ) {

    var $doc,
        Map,// 地图，module-3-4
        Module_1_1, // 案管中心
        Module_1_2, // 执法音视频
        Module_2_1, // 办案中心
        IndexPage,
        LoginPage,
        Sidebar
    ;

    $doc = $( document );

    // 登陆页
    LoginPage = {
        $container: ".page-login",
        $form: ".login-form",
        $submitBtn: ".btn-submit",
        $inputControl: ".input-control",
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$container = $( this.$container );
            this.$form = $( this.$form, this.$container );
            this.$submitBtn = $( this.$submitBtn, this.$container );
            this.$inputControl = $( this.$inputControl, this.$container );
        },
        bind: function () {
            var _this,
                animateClass
            ;
            _this = this;

            // 输入控件：focus时，添加动画
            animateClass = "pulse animated";

            _this.$inputControl.on( "focus", function () {
                $( this ).parent().addClass( animateClass );
            } ).on( "blur", function () {
                $( this ).parent().removeClass( animateClass );
            } );

            // 提交按钮：添加按钮
            _this.$submitBtn.hover( function () {
                $( this ).addClass( animateClass );
            }, function () {
                $( this ).removeClass( animateClass );
            });

            // 敲回车键，进行表单提交
            $doc.on( "keydown", function ( event ) {
                if ( event.keyCode === 13 ) {
                    //_this.$form.submit();
                }
            } );

            _this.$form.on( "submit", function () {

                if ( ! _this.$inputControl.eq( 0 ).val() ) {
                    swal( {
                        title: "错误!",
                        text: "请输入用户名!",
                        type: "error",
                        confirmButtonText: "关闭",
                        confirmButtonClass: "btn-info"
                    }, function ( isConfirm ) {
                    } );
                    return false;
                }

                if ( ! _this.$inputControl.eq( 1 ).val() ) {
                    swal( {
                        title: "错误!",
                        text: "请输入密码!",
                        type: "error",
                        confirmButtonText: "关闭",
                        confirmButtonClass: "btn-info"
                    } );
                    return false;
                }

            } );
        }
    };

    // 首页
    IndexPage = {
        $container: ".page-index",
        $top: ".top",
        $header: ".header",
        $module_1_1: ".module-1-1", // 案管中心
        $module_1_2: ".module-1-2",
        $module_2_1: ".module-2-1",
        $module_2_2: ".module-2-2",
        $module_3_1: ".module-3-1",
        $module_3_2: ".module-3-2",
        $module_3_3: ".module-3-3",
        $module_3_4: ".module-3-4", // 中心，热点地图
        $maxModule: ".module-max", // 每个模块都有的放大图标
        $functionList: ".function-list", // 顶部功能列表
        init: function () {
            this.render();
            this.bind();

            Module_1_1.init();
            Module_1_2.init();
            Module_2_1.init();
            Map.init();
        },
        render: function () {
            this.$container = $( this.$container );
            this.$top = $( this.$top, this.$container );
            this.$header = $( this.$header, this.$container );
            this.$module_1_1 = $( this.$module_1_1, this.$container );
            this.$module_1_2 = $( this.$module_1_2, this.$container );
            this.$module_2_1 = $( this.$module_2_1, this.$container );
            this.$module_2_2 = $( this.$module_2_2, this.$container );
            this.$module_3_1 = $( this.$module_3_1, this.$container );
            this.$module_3_2 = $( this.$module_3_2, this.$container );
            this.$module_3_3 = $( this.$module_3_3, this.$container );
            this.$module_3_4 = $( this.$module_3_4, this.$container );
            this.$maxModule = $( this.$maxModule, this.$container );
            this.$functionList = $( this.$functionList, this.$container );
        },
        bind: function() {
            this.$top.addClass( "animated bounceInDown" );
            this.$header.addClass( "animated lightSpeedIn" );
            this.$module_1_1.addClass( "animated bounceInLeft" );
            this.$module_1_2.addClass( "animated bounceInRight" );
            this.$module_2_1.addClass( "animated bounceInLeft" );
            this.$module_2_2.addClass( "animated bounceInRight" );
            this.$module_3_1.addClass( "animated bounceInUp" );
            this.$module_3_2.addClass( "animated bounceInUp" );
            this.$module_3_3.addClass( "animated bounceInUp" );
            this.$module_3_4.addClass( "animated rotateIn" );

            this.$maxModule.hover(
                function fnOver() {
                    $( this ).addClass( "animated rotateIn" );
                },
                function fnOut() {
                    $( this ).removeClass( "animated rotateIn" );
                }
            );
            this.$functionList.find( "a" ).hover(
                function fnOver() {
                    $( this ).addClass( "animated pulse" );
                },
                function fnOut() {
                    $( this ).removeClass( "animated pulse" );
                }
            );
        }
    };

    // 案管中心:  module-1-1
    Module_1_1 = {
        $container: null, // .module-1-1
        $ajpmChkbox: ".ajpm-chkbox", // 排名-选择框
        $ajpmChkboxItem: ".chkbox-item", // 排名-选择框条目
        $ajpmList: ".ajpm-list", // 排名 - 列表
        $ajpmListItem: ".rank-item", // 排名 -列表项
        $pieChartContainer: ".ajzs-chart-pie", // 案管中心 - 案卷总数 - 饼图
        init: function () {
            this.render();
            this.bind();

            var randomNum = Math.floor( 10 + Math.random() * ( 800 - 10) );
            this.drawChart( randomNum, 1000 - randomNum );
        },
        render: function () {
            this.$container = IndexPage.$module_1_1;
            this.$ajpmChkbox = $( this.$ajpmChkbox, this.$container );
            this.$ajpmChkboxItem = $( this.$ajpmChkboxItem, this.$container );
            this.$ajpmList = $( this.$ajpmList, this.$container );
            this.$ajpmListItem = $( this.$ajpmListItem, this.$container );
            this.$pieChartContainer = $( this.$pieChartContainer, this.$container );
        },
        bind: function() {
            var _this
            ;
            _this = this;

            // 排名-选择框: hover
            this.$ajpmChkboxItem.hover(
                function fnOver() {
                    $( this ).addClass( "animated tada" );
                },
                function fnOut() {
                    $( this ).removeClass( "animated tada" );
                }
            );

            var _sampleData = [
                { "黄陂": "567890", "东西湖": "456789", "江岸": "345678", "新洲": "234567", "青山": "123456"  },
                { "江汉": "567891", "硚口": "456781", "武昌": "345671", "洪山": "234561", "汉阳": "123451"  },
                { "东新": "567892", "沌口": "456782", "蔡甸": "345672", "江夏": "234562", "汉阳": "123452"  }
            ];
            // 排名-选择框条目：点击后刷新数据
            this.$ajpmChkboxItem.on( "click", function() {
                var $this,
                    index,
                    dataItem,
                    $ajpmListItem,
                    count,
                    lab,
                    cont,
                    animateClass
                    ;
                $this = $( this );
                index = $this.index();
                dataItem = _sampleData[ index ];
                count = 0;
                animateClass = "fadeInRight animated";

                _this.$ajpmListItem.removeClass( animateClass );
                for ( lab in dataItem ) {
                    if ( ! dataItem.hasOwnProperty( lab ) ) {
                        continue;
                    }
                    cont = dataItem[ lab ];
                    $ajpmListItem = _this.$ajpmListItem.eq( count );
                    $ajpmListItem.find( ".lab" ).text( lab ).end().find( ".cont" ).text( cont );
                    +function ( $ajpmListItem ) {
                        setTimeout( function () {
                            $ajpmListItem.addClass( animateClass );
                        }, 100 * ( count + 1 ) );
                    }( $ajpmListItem );
                    count++;
                }
                $this.addClass( "active" ).siblings().removeClass( "active" );
            } );
        },
        drawChart: function(xsNum, xzNum) { // xsNum: 刑事案件. xzNum: 行政案件.
            var target,
                myChart,
                option
                ;

            if ( this.$pieChartContainer ) {
                return;
            }

            target = this.$pieChartContainer.get(0);

            // 基于准备好的dom，初始化echarts实例
            myChart = echarts.init( target );


            option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '案卷总数',
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data:[
                            {value: xsNum, name:'刑事案件'},
                            {value: xzNum, name:'行政案件'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal: {
                                position: "inside",
                                formatter: '{c}'
                            }
                        }

                    }
                ],
                color:['#0c6cce', '#ffb638']
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

    };

    // 执法音视频:  module-1-2
    Module_1_2 = {
        $container: null, // .module-1-2
        $videoContainer: ".video", // 执法音视频 - 视频 - 容器
        videoUrlList: [
            "http://www.w3school.com.cn/example/html5/mov_bbb.mp4",
            "http://www.helloweba.com/demo/html5video/movie.mp4",
            "https://shapeshed.com/examples/HTML5-video-element/video/320x240.ogg",
            "https://shapeshed.com/examples/HTML5-video-element/video/320x240.m4v"
        ],
        currentVideoIndex: 0,
        $prevControlBtn: ".control-btn-prev",
        $nextControlBtn: ".control-btn-next",
        init: function () {
            this.render();
            this.bind();
            this.playVideo();
        },
        render: function () {
            this.$container = IndexPage.$module_1_2;
            this.$videoContainer = $( this.$videoContainer, this.$container );
            this.$prevControlBtn = $( this.$prevControlBtn, this.$container );
            this.$nextControlBtn = $( this.$nextControlBtn, this.$container );
        },
        bind: function() {
            var _this
            ;
            _this = this;

            // 视频播放完毕后，自动播放下一个
            _this.$videoContainer.on( "ended", function() {
                _this.playNextVideo();
            } );

            // 点击“上一个”，播放上一个视频
            this.$prevControlBtn.on( "click", function() {
                _this.playPrevVideo();
                return false;
            } );
            // 点击“下一个”，播放下一个视频
            this.$nextControlBtn.on( "click", function() {
                _this.playNextVideo();
                return false;
            } );

        },
        playVideo: function() {
            // 设置 src
            this.$videoContainer.attr( "src", this.videoUrlList[ this.currentVideoIndex ] );
            // 载入视频
            this.$videoContainer.get( 0 ).load(); // 如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
            // 播放视频：第一个视频不自动播放
            if ( this.currentVideoIndex != 0 ) {
                this.$videoContainer.get( 0 ).play();
            }
        },
        playPrevVideo: function() {
            var index,
                maxIndex
                ;
            index = this.currentVideoIndex;
            maxIndex = this.videoUrlList.length;
            index--;
            if ( index < 0 ) {
                index = maxIndex - 1;
            }
            this.currentVideoIndex = index;
            this.playVideo();
        },
        playNextVideo: function() {
            var index,
                maxIndex
            ;
            index = this.currentVideoIndex;
            maxIndex = this.videoUrlList.length;
            index++;
            if ( index >= maxIndex ) {
                index = 0;
            }
            this.currentVideoIndex = index;
            this.playVideo();
        }

    };

    // 办案中心:  module-2-1
    Module_2_1 = {
        $container: null, // .module-2-1
        $roomItem: ".room-item", // 讯问室 - 条目
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$container = IndexPage.$module_2_1;
            this.$roomItem = $( this.$roomItem, this.$container );
        },
        bind: function() {
            var _this
            ;
            _this = this;

            // 位讯问室 - 条目： hover
            _this.$roomItem.hover(
                function fnOver() {
                    $( this ).addClass( "animated pulse" );
                },
                function fnOut() {
                    $( this ).removeClass( "animated pulse" );
                }
            );
        }
    };

    // 地图：module-3-4
    Map = {
        $container: ".page-index .map-center",
        $sectorList: ".map-sector-list",
        $sectorItem: ".map-sector-item",
        $sectorControl: ".map-sector-control",
        $sectorItemText: ".map-sector-text",
        $areaList: ".map-area-list",
        $areaItem: ".map-area-item",
        $areaItemHot: ".map-hot",
        init: function() {
            this.render();
            this.bind();
        },
        render: function() {
            this.$container = $( this.$container );
            this.$sectorList = $( this.$sectorList, this.$container );
            this.$sectorItem = $( this.$sectorItem, this.$container );
            this.$sectorItemText = $( this.$sectorItemText, this.$container );
            this.$areaList = $( this.$areaList, this.$container );
            this.$areaItem = $( this.$areaItem, this.$container );
            this.$areaItemHot = $( this.$areaItemHot, this.$container );
            this.$sectorControl = $( this.$sectorControl, this.$container );
        },
        bind: function() {
            var _this,
                isDisabledHandler
            ;
            _this = this;
            // 热点地图-区域块：动画
            this.animateAreaItem();

            // 热点地图-区域块-文字：hover时，改变区域块的状态
            this.$areaItemHot.hover(
                function () {
                    $( this ).parent().addClass( "hover animated pulse" );
                    return false;
                },
                function () {
                    $( this ).parent().removeClass( "hover animated pulse" );
                    return false;
                }
            // 热点地图-区域块-文字：click时，改变区域块的状态
            ).click(
                function ( e ) {
                    var $this
                        ;
                    $this = $( this );
                    e.preventDefault();
                    $this.parent().addClass( "active" ).siblings().removeClass( "active" );
                }
            );

            // 圆环条目：鼠标进入，使文字水平排列
            this.$sectorItem.on( "mouseenter", mouseenterHandler );
                function mouseenterHandler() {
                    var $this,
                        index,
                        degree
                        ;
                    // &:nth-child(1) { transform : rotate(12+24*0deg); }
                    $this = $( this );
                    index = $this.index();
                    degree = 360 - ( 12 + index * 24 );
                    $this.find(".map-sector-text").css( "transform", "rotate(" + degree + "deg)" );
                }
            // 圆环条目：鼠标离开，使文字还原
            this.$sectorItem.on( "mouseleave", mouseleaveHandler );
                function mouseleaveHandler() {
                    $(this).find(".map-sector-text").css( "transform", "rotate(0deg)" );
                }
            // 圆环条目：单击后添加 active 状态
            this.$sectorItem.on( "click", function() {
                var $this
                ;
                $this = $( this );
                // 取消其他元素的active状态，并恢复其改变文字排列的事件
                $this.siblings( ".active" ).removeClass( "active" ).each( function() {
                    if ( isDisabledHandler ) {
                        return false;
                    }
                    if ( $( this ).data( "isCanceledHandler" ) === true ) {
                        $( this ).on( "mouseenter", mouseenterHandler )
                                 .on( "mouseleave", mouseleaveHandler )
                                 .trigger( "mouseleave" );
                    }
                } );

                $this.addClass( "active" );

                // 同时，使文字水平排列：取消改变文字排列的事件，并添加标志“isCanceledHandler”
                $this.trigger( "mouseenter" );
                $this.off( "mouseleave mouseenter" );
                $this.data( "isCanceledHandler", true );
            } );


            // 圆环条目控制器：点击后，使圆环上所有文字水平显示，点击后消失
            this.$sectorControl.on( "click", function() {
                _this.$sectorItem.trigger( "mouseenter" ).off( "mouseleave mouseenter" );
                isDisabledHandler = true;
                $( this ).hide(500);
            } );
        },
        animateAreaItem: function() {
            var $areaItem
            ;
            $areaItem = this.$areaItem;
            // 设置动画
            $areaItem.each( function( index ) {
                var animateClass
                    ;
                switch ( index % 4 ) {
                    case 0: { animateClass = "hover animated fadeInUpBig"; break; }
                    case 1: { animateClass = "hover animated fadeInDownBig"; break; }
                    case 2: { animateClass = "hover animated fadeInLeftBig"; break; }
                    case 3: { animateClass = "hover animated fadeInRightBig"; break; }
                }
                $( this ).addClass( animateClass ).data( "animateClass", animateClass );
            } );
            // 待动画播放执行完毕，删除掉遗留的css类，避免冲突
            window.setTimeout( function() {
                $areaItem.each(function(){
                    var $this
                        ;
                    $this = $( this );
                    $this.removeClass( $this.data( "animateClass" ) );
                })
            }, 1200 );
        }
    };

    Sidebar = {
        $container: ".page-sidebar",
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$container = $( this.$container );
        },
        bind: function () {
            this.$container.find( ".main-menu-item-heading" ).on( "click", function () {
                var $this,
                    $parent
                ;
                $this = $( this )
                $parent = $this.parent();
                if ( $parent.is( ".active" ) ) {
                    $parent.removeClass( "active" );
                    return;
                }
                $parent.filter( ".has-sub-menu" ).addClass( "active" ).siblings().removeClass( "active" );
            } );
        }
    };

    $doc.ready( function() {

        $('[data-toggle="tooltip"]').tooltip();

        if ( $doc.find( LoginPage.$container ).size() !== 0 ) {
            LoginPage.init();
        }

        if ( $doc.find( IndexPage.$container ).size() !== 0 ) {
            IndexPage.init();
        }
        if ( $doc.find( Sidebar.$container ).size() !== 0 ) {
            Sidebar.init();
        }

    } );

} );