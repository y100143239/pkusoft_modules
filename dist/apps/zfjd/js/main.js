require( [ "jquery" ,"echarts", "echartsTheme" ], function ( $, echarts, _echartsTheme ) {

    var $doc
    ;

    $doc = $( document );

    $doc.ready( function( $ ) {

        var randomNum
        ;

        randomNum = Math.floor( 10 + Math.random() * ( 800 - 10) );

        animateEles();

        // 案管中心 - 案卷总数
        drawPieChart( randomNum, 1000 - randomNum );

        // 案管中心 - 案卷排名
        changeRank();

        // 执法音视频 - 视频
        initVidew( [ "http://www.helloweba.com/demo/html5video/movie.mp4", "http://www.w3school.com.cn/example/html5/mov_bbb.mp4"  ] );

        // 中心地图
        initHotMap();
    } );


    function initHotMap() {
        $( ".map-area-list .map-hot" ).hover(
            function () {
                $( this ).parent().addClass( "hover animated pulse" );
            },
            function () {
                $( this ).parent().removeClass( "hover animated pulse" );
            }
        ).click(
            function ( e ) {
                var $this
                ;
                $this = $( this );
                e.preventDefault();
                $this.parent().addClass( "active" ).siblings().removeClass( "active" );
            }
        );
    }


    function initVidew( videoList ) {
        var video
            ;
        video = $( "#video-zf" ).get( 0 );

        if ( ! video ) {
            return;
        }

        video.addEventListener( 'ended', function () {
            play.next();
        }, false );
        play( videoList );

        $( ".control-btn-prev" ).on( "click" , function ( e ) {
            e.preventDefault();
            play.prev();
        } );
        $( ".control-btn-next" ).on( "click" , function ( e ) {
            e.preventDefault();
            play.next();
        } );
    }

    function play( videoList ) {
        var video
            ;

        if ( play.current == null ) {
            play.current = 0;
            play.next = function () {
                play.current++;
                if ( play.current >= videoList.length ) {
                    play.current = 0; // 播放完了，重新播放
                }
                play(videoList);
            };
            play.prev = function () {
                play.current--;
                if ( play.current < 0 ) {
                    play.current = videoList.length - 1; // 播放完了，重新播放
                }
                play(videoList);
            };
        }

        video = $( "#video-zf" ).get( 0 );
        video.src = videoList[ play.current ];
        video.load(); // 如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
        video.play();
    }


    function changeRank() {
        var $chkbox,
            $item,
            data
        ;

        data = [
            { "黄陂": "567890", "东西湖": "456789", "江岸": "345678", "新洲": "234567", "青山": "123456"  },
            { "江汉": "567891", "硚口": "456781", "武昌": "345671", "洪山": "234561", "汉阳": "123451"  },
            { "东新": "567892", "沌口": "456782", "蔡甸": "345672", "江夏": "234562", "汉阳": "123452"  }
        ];
        $chkbox = $( ".chkbox-list-ajpm" );
        $item = $( ".ajpm-list .rank-item" );

        $chkbox.on( "click", ".chkbox-item", function() {
            var $this,
                index,
                dataItem,
                count,
                lab,
                cont
            ;
            $this = $( this );
            index = $this.index();
            dataItem = data[ index ];
            count = 0;
            for ( lab in dataItem ) {
                if ( ! dataItem.hasOwnProperty( lab ) ) {
                    continue;
                }
                cont = dataItem[ lab ];
                $item.eq( count ).find( ".lab" ).text( lab ).end().find( ".cont" ).text( cont );
                count++;
            }
            $this.addClass( "active" ).siblings().removeClass( "active" );
        } );
    }

    function drawPieChart(xsNum, xzNum) {
        var target,
            myChart,
            option
            ;

        target = $( "#ajzs-chart-pie" ).get(0);

        if ( ! target ) {
            return;
        }
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

    function animateEles () {
        $( ".top" ).addClass( "animated bounceInDown" );
        $( ".header" ).addClass( "animated lightSpeedIn" );
        $( ".map-center" ).addClass( "animated rotateIn" );

        $( ".module-1-1" ).addClass( "animated bounceInLeft" );
        $( ".module-1-2" ).addClass( "animated bounceInRight" );
        $( ".module-2-1" ).addClass( "animated bounceInLeft" );
        $( ".module-2-2" ).addClass( "animated bounceInRight" );
        $( ".module-3-1" ).addClass( "animated bounceInUp" );
        $( ".module-3-2" ).addClass( "animated bounceInUp" );
        $( ".module-3-3" ).addClass( "animated bounceInUp" );

        $( ".map-area-item" ).each( function( index ) {
            var animateClass
                ;
            switch ( index % 4 ) {
                case 0: { animateClass = "hover animated fadeInUpBig"; break; }
                case 1: { animateClass = "hover animated fadeInDownBig"; break; }
                case 2: { animateClass = "hover animated fadeInLeftBig"; break; }
                case 3: { animateClass = "hover animated fadeInRightBig"; break; }
            }
            $( this ).addClass( animateClass );
        } );

        setTimeout( function() {
            $( ".map-area-item" ).removeClass( "hover" );
        }, 1000 );

        // animate .function-list
        $( ".function-list" ).find( "a" ).hover(
            function fnOver() {
                $( this ).addClass( "animated pulse" );
            },
            function fnOut() {
                $( this ).removeClass( "animated pulse" );
            }
        );

        $( ".module-max" ).hover(
            function fnOver() {
                $( this ).addClass( "animated rotateIn" );
            },
            function fnOut() {
                $( this ).removeClass( "animated rotateIn" );
            }
        );

        $( ".chkbox-item" ).hover(
            function fnOver() {
                $( this ).addClass( "animated tada" );
            },
            function fnOut() {
                $( this ).removeClass( "animated tada" );
            }
        );
        $( ".room-item" ).hover(
            function fnOver() {
                $( this ).addClass( "animated pulse" );
            },
            function fnOut() {
                $( this ).removeClass( "animated pulse" );
            }
        );

    }

} );