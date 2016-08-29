+(function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD模式
        define( [ "jquery", "select-area-data" ], factory );
    } else {
        // 全局模式
        factory( jQuery );
        throw "select-area.js depends on jQuery"
    }
}( function ( $, _data ) {
    "use strict";

    var AreaPanel,
        DATA
        ;

    DATA = _data;

    // 定义插件
    $.fn.selectArea = function ( options, param ) {
        if ( ! AreaPanel.isInited() ) {
            AreaPanel.init();
        }
        //  插件方法调用
        if ( typeof options == 'string' ) {
            this.each( function () {
                init( this );
            } );
            return $.fn.selectArea.methods[ options ]( this, param );
        }
        //  初始化
        return this.each( function () {
            init( this, options );
        } );
    };

    // 默认参数
    $.fn.selectArea.defaults = {
        cssClass: "form-control"
    };

    // 可调用的方法
    $.fn.selectArea.methods = {

        options: function ( $jq ) { // 返回第一个target的options参数
            return $.data( $jq[ 0 ], 'selectArea' ).options;
        },
        _show: function ( $jq ) { // 显示
            // 返回 jQuery对象 ，不让链式调用断掉
            return $jq.each( function () {
                $.data( this, "selectArea" ).$container.show();
            } );
        },
        show: function ( $jq ) { // 显示
            AreaPanel.show( $jq.eq(0) );
            return $jq;
        },
        hide: function ( $jq ) { // 隐藏
            AreaPanel.hide();
            return $jq;
        },
        timer: function ( $jq, args ) { // 设置倒计时后隐藏
            // ...
        },
        destory: function ( $jq ) { // 销毁
            // ...
        }

    };

    // 初始化
    function init( target, options ) {
        var selectArea,
            opts

            ;
        selectArea = $.data( target, "selectArea" );

        // 已被初始化
        if ( selectArea ) {
            $.extend( selectArea.options, options );
            return;
        }

        // 初始化

        // 参数
        opts = $.extend( {}, $.fn.selectArea.defaults, options );
        // 插件相关的参数及数据都绑定到 target DOM元素上
        $.data( target, "selectArea", { options: opts } );

        settingSelectArea( target, opts );

    }

    function settingSelectArea( target, opts ) {
        var $target,
            $targetCopy,
            data, // 根据code获取的相关省市县区数据
            formatValue,
            selectTrigger, $trigger
            ;
        $target = $( target );

        selectTrigger = $target.data( "selectTrigger" );
        if ( selectTrigger ) {
            $trigger = $( selectTrigger );
            $trigger.data( "$origin", $target );
            $target.data( "$trigger", $trigger );
        }

        $targetCopy = renderTarget( $target, opts );

        // 如果有数据，则设置
        if ( $target.val() ) {
            data = AreaPanel.utils.getAllDataByCode( $target.val() + "" );
            formatValue = AreaPanel.utils.formatCopyTargetValue( data ) ;
            $targetCopy.val( formatValue );
        }

        $targetCopy.on( "click.selectarea", function () {
            var $target
            ;
            $target = $( this ).data( "$origin" );
            // 清除Panel上次选择的状态
            AreaPanel.clean();
            AreaPanel.setTarget( $target );
            // 如果有数据，则设置其选中状态
            AreaPanel.setChooseStatus( $target );
            // 显示
            AreaPanel.show( $target );
        } );

        if ( $trigger ) {
            $trigger.on( "click.selectarea", function () {
                var $target
                    ;
                $target = $( this ).data( "$origin" );
                $target.data( "$copy" ).trigger( "click.selectarea" );
            } );
        }
    }

    function renderTarget( $target, opts ) {
        var $targetCopy
        ;
        //  将其插入到 $target 后面
        $targetCopy = $( "<input>" ).addClass( $target.attr( "class" ) ).insertAfter( $target );

        // “隐藏” $target
        $target.addClass( "city-select-hidden-accessible" );

        $target.data( "$copy", $targetCopy );

        $targetCopy.data( "$origin", $target );

        return $targetCopy;
    }

    AreaPanel = {
        $container: ".city-select-warp", // 容器
        $tabList: ".city-select-tab > a", // 标签页 - nav
        $tabContent: ".city-select", // 标签页 - content
        $tabContentDataContainer: "dd", // 标签页 - content 数据填充的地方
        chooseData: {
            province: { code: null, text: null },
            city: { code: null, text: null },
            district: { code: null, text: null }
        },
        $target: null, // 临时保存当前 目标
        setTarget: function ( $target ) {
            this.$target = $target;
        },
        getTarget: function () {
            return this.$target;
        },
        afterChooseCallback: function ( code, text ) {
            var $target,
                value,
                chooseData
                ;
            chooseData = this.chooseData;

            value = AreaPanel.utils.formatCopyTargetValue( chooseData );

            $target = this.$target;
            $target.val( code );
            $target.data("$copy" ).val( value );

            // FIX 添加formValidate验证
            var inputField,
                $form
                ;
            inputField = $target;
            $form = $target.closest( "form.fv-form" );
            if ( $form.length == 0  ) { return; }
            if ( ! $form.formValidation ) { return; }
            // Revalidate the date when user change it
            $form.formValidation('revalidateField', inputField);
        },
        init: function () {
            this._create();
            this.render();
            this.bind();
            this.$container.hide();
            this.draw( "province" );
        },
        render: function () {
            this.$tabList = $( this.$tabList, this.$container );
            this.$tabContent = $( this.$tabContent, this.$container );
            this.$tabContentDataContainer = this.$tabContent.find ( this.$tabContentDataContainer);
        },
        bind: function () {

            // 点击tab，进行相应的切换
            this._bindTabClickEvent();

            // 自动隐藏（当发生点击事件时，区域不是$target，也不是$container时）
            this._bindAutoHide();

            // 选取 省
            this._bindChooseProvinceEvent( this.afterChooseCallback );
            // 选取 市
            this._bindChooseCityEvent( this.afterChooseCallback );
            // 选取 县，
            this._bindChooseDistrictEvent( this.afterChooseCallback );
        },
        draw: function ( type, code ) { // 绘制panel（往相应的panel里填充数据）
            var dataList,
                html
            ;

            dataList = this.utils.getDataList( code );
            html = this.utils.getDataHtml( dataList );

            switch( type ) {
                case "province" : {
                    this.$tabContentDataContainer.eq( 0 ).html( html );
                    break;
                }
                case "city": {
                    this.$tabContentDataContainer.eq( 1 ).html( html );
                    break;
                }
                case "district": {
                    this.$tabContentDataContainer.eq( 2 ).html( html );
                    break;
                }
            }
            return this;
        },
        show: function ( $target ) {
            this.setTarget( $target );
            this.setPosition( $target.data( "$copy" ) );
            this.$container.show();
        },
        hide: function () {
            this.clean();
            this.$container.hide();
        },
        setPosition: function ( $target ) { // 定位到 $target
            var targetPos,
                top, left
            ;
            targetPos = this.utils.getPosition( $target );
            top = targetPos.top + targetPos.height;
            left = targetPos.left;
            this.$container.css( {
                top: top,
                left: left
            } );
        },
        setChooseStatus: function ( $target ) {
            var code,
                type,
                newCode
            ;
            code = $target.val();
            if ( ! code ) {
                return;
            }
            code += "";
            type = this.utils.getCodeType( code );

            // 1. 匹配 省（data-code="110000"），手动触发 click.selectarea 事件
            newCode = code.substring(0, 2) + "0000";
            this.$tabContent.eq( 0 ).find( 'a[data-code="' + newCode + '"]' ).trigger( "click.selectarea" );
            if ( type == "province" ) { return; }

            // 2. 匹配 市（data-code="110100"），手动触发 click.selectarea 事件
            newCode = code.substring(0, 4) + "00";
            this.$tabContent.eq( 1 ).find( 'a[data-code="' + newCode + '"]' ).trigger( "click.selectarea" );
            if ( type == "city" ) { return; }

            // 3. 匹配 县（data-code="110102"），改变其状态
            this.$tabContent.eq( 2 ).find( 'a[data-code="' + code + '"]' ).trigger( "click.selectarea" );
        },
        isInited: function () { // 判断是否已经创建容器
            return this.$container instanceof $;
        },
        empty: function ( types ) { // 清空指定面板内的数据，types - [ "province", "city", "district" ]
            var _this
            ;
            _this = this;
            if ( ! types ) {
                this.$tabContentDataContainer.empty();
                return this;
            }
            $.each( types, function () {
                switch ( this ) {
                    case "province": {
                        _this.$tabContentDataContainer.eq( 0 ).empty();
                        return;
                    }
                    case "city": {
                        _this.$tabContentDataContainer.eq( 1 ).empty();
                        return;
                    }
                    case "district": {
                        _this.$tabContentDataContainer.eq( 2 ).empty();
                        return;
                    }

                }
            } );
        },
        clean: function () { // 清除 省 的选中状态，清空 城市、县区 面板
            this.$tabList.eq(0 ).trigger("click.selectarea");
            this.$tabContentDataContainer.find( "a" ).removeClass( "active" );
            this.empty( ["city", "district"] );
            this._cleanChooseData(); // 清空panel缓存的数据
            this.$target = null;
        },
        // -------------

        _create: function () { // 创建 省市县区容器，并将其添加到 body
            this.$container = $( this.template.container ).appendTo( document.body );
        },
        _bindTabClickEvent: function() { // // 点击tab，进行相应的切换
            var _this
                ;
            _this = this;

            // 点击tab，进行相应的切换
            this.$tabList.on( "click.selectarea", function () {
                var $this
                    ;
                $this = $( this );
                // 切换 tab 状态
                $this.addClass( "active" ).siblings().removeClass( "active" );
                // 切换 content
                _this.$tabContent.eq( $this.index() ).show().siblings().hide();
                return false;
            } );
        },
        _bindChooseProvinceEvent: function ( afterChooseCallback ) {
            this._bindChooseEvent( 0, "city", [ "district" ], afterChooseCallback );
        },
        _bindChooseCityEvent: function ( afterChooseCallback ) {
            this._bindChooseEvent( 1, "district", [], afterChooseCallback );
        },
        _bindChooseDistrictEvent: function ( afterChooseCallback ) {
            var _this;
            _this = this;
            this.$tabContent.eq( 2 ).on( "click.selectarea", "a", function () {
                var $this,
                    code, text
                    ;
                $this = $( this );
                code = $this.data( "code" ) + "";
                text = $this.data( "text" );
                // 改变状态
                $this.addClass( "active" ).siblings().removeClass( "active" );
                // 更新选中的数据
                _this._setChooseData( code, text );
                if ( afterChooseCallback && typeof afterChooseCallback == "function" ) {
                    afterChooseCallback.call( _this, code, text );
                }
                // 关闭面板
                _this.$container.hide();
            });
        },
        _bindChooseEvent: function ( tabContentIndex, drawType, emptyType, afterChooseCallback ) {
            var _this
            ;
            _this = this;

            //tabContentIndex = 0;
            //drawType = "city";
            //emptyType = [ "district" ];

            this.$tabContent.eq( tabContentIndex ).on( "click.selectarea", "a", function () {
                var $this,
                    code, text
                ;
                $this = $( this );
                code = $this.data( "code" ) + "";
                text = $this.data( "text" ) + "";

                // 改变状态（样式）
                $this.addClass( "active" ).siblings().removeClass( "active" );

                // 绘制 “城市” 面板
                _this.draw( drawType, code );

                // 清空 “县区” 面板
                _this.empty( emptyType );

                // 切换到 “城市” 面板
                _this.$tabList.eq( tabContentIndex + 1 ).trigger( "click.selectarea" );

                // 更新选中的数据
                _this._setChooseData( code, text );

                if ( afterChooseCallback && typeof afterChooseCallback == "function" ) {
                    afterChooseCallback.call( _this, code, text );
                }
                return false;
            } );
        },
        _bindAutoHide: function () {
            var _this;
            _this = this;
            // 1. 取消 $container 的冒泡
            _this.$container.on( "click.selectarea", function() {
                return false;
            } );
            // 2. 最终冒泡到 document 的点击事件，肯定不是点击在$container上的，此时hide即可
            // 3. 点击 target 时，也不能隐藏
            $( document ).on( "click.selectarea", function ( e ) {
                var $target,
                    $excludeCollection,
                    isExcludeElement
                    ;
                $target = _this.getTarget();
                isExcludeElement = false;

                if ( ! $target ) {
                    return;
                }
                $excludeCollection = $()
                    .add( $target )
                    .add( $target.data( "$copy" ) )
                    .add( $target.data( "$trigger" ) );

                $excludeCollection.each( function () {
                    if ( e.target == this ) {
                        isExcludeElement = true;
                    }
                } );

                if ( isExcludeElement ) {
                    return;
                }
                _this.hide();
            } );
        },
        _setChooseData: function ( code, text ) { // 设置 panel 缓存的选择数据，方便数据填充
            var chooseData,
                province,
                city,
                district
            ;
            chooseData = this.chooseData;
            province = chooseData.province;
            city = chooseData.city;
            district = chooseData.district;
            switch ( this.utils.getCodeType( code ) ) {
                case "province": {
                    province.code = code;
                    province.text = text;
                    city.code = null;
                    city.text = null;
                    district.code = null;
                    district.text = null;
                    break;
                }
                case "city": {
                    city.code = code;
                    city.text = text;
                    district.code = null;
                    district.text = null;
                    break;
                }
                case "district": {
                    district.code = code;
                    district.text = text;
                    break;
                }
            }
        },
        _cleanChooseData: function () {
            var chooseData,
                province,
                city,
                district
                ;
            chooseData = this.chooseData;
            province = chooseData.province;
            city = chooseData.city;
            district = chooseData.district;

            province.code = null;
            province.text = null;
            city.code = null;
            city.text = null;
            district.code = null;
            district.text = null;
        }

    };

    AreaPanel.utils = {
        getPosition: function ( $element ) { // {/*文档坐标*/top,left,right,bottom, /*尺寸*/width,height, /该元素的scrollTop/ scroll}
            var el,
                isBody,
                elRect, // 尺寸
                elOffset, // 文档坐标
                scroll, // scrollTop
                outerDims // 如果是 body元素 则计算 window的尺寸
                ;
            $element = $element || this.$element;

            el = $element[ 0 ];
            isBody = el.tagName == 'BODY';

            elRect = el.getBoundingClientRect();
            if ( elRect.width == null ) {
                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                elRect = $.extend( {}, elRect, {
                    width: elRect.right - elRect.left,
                    height: elRect.bottom - elRect.top
                } );
            }
            elOffset = isBody ? { top: 0, left: 0 } : $element.offset();
            scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
            outerDims = isBody ? { width: $( window ).width(), height: $( window ).height() } : null;

            return $.extend( {}, elRect, scroll, outerDims, elOffset )
        },
        getDataList: function ( code ) { // 获取指定code的List
            var dataList = [];
            // 省列表
            if ( ! code ) {
                for ( var i = 0, len = DATA.length; i < len; i++  ) {
                    var d = DATA[ i ];
                    dataList.push( { code: d.code, text: d.text } )
                }
                return dataList;
            }
            // 市列表、县列表 直接区节点的“cityList”或“districtList”即可
            switch ( this.getCodeType( code ) ) {
                case "province": {
                    return this.getProvinceByCode( code ).cityList;
                }
                case "city" : {
                    return this.getCityByCode( code ).districtList;
                }
            }

        },
        getCodeType: function ( code ) {
            if ( ! code ) {
                return null;
            }
            if ( code.match( /^[0-9]{2}0{4}$/ ) ) {
                return "province";
            }
            if ( code.match( /^[0-9]{4}0{2}$/ ) ) {
                return "city";
            }
            return "district";
        },
        getDataHtml: function ( dataList ) {
            var html,
                i, len, code, text, d;
            html = "";
            for ( i = 0, len = dataList.length; i < len; i++ ) {
                d = dataList[ i ];
                code = d.code;
                text = d.text;
                html += '<a title="'+text+'" data-code="'+code+'" data-text="'+text+'" href="javascript:void(0);">'+text+'</a>';
            }
            return html;
        },
        getProvinceByCode: function ( code ) {
            var provinceCode
            ;
            provinceCode = code.substring( 0, 2 ) + "0000";
            for ( var i = 0, len = DATA.length; i < len; i++  ) {
                if ( DATA[ i ].code == provinceCode ) {
                    return DATA[ i ];
                }
            }
        },
        getCityByCode: function ( code ) {
            var province,
                cityCode,
                cityList
                ;
            cityCode = code.replace( /[0-9]{2}$/, "00" );
            province = this.getProvinceByCode( code );
            cityList = province.cityList;

            for ( var i = 0, len = cityList.length; i < len; i++  ) {
                if ( cityList[ i ].code == cityCode ) {
                    return cityList[ i ];
                }
            }
        },
        getDistrictByCode: function ( code ) {
            var city,
                districtList
                ;
            city = this.getCityByCode( code );
            districtList = city.districtList;

            for ( var i = 0, len = districtList.length; i < len; i++  ) {
                if ( districtList[ i ].code == code ) {
                    return districtList[ i ];
                }
            }
        },
        /* 根据code获取省、市、县区数据 */
        getAllDataByCode: function ( code ) {
            var data,
                type,
                province,
                city,
                district
                ;
            data = {
                //province: { code: null, text: null },
                //city: { code: null, text: null },
                //district: { code: null, text: null }
            };
            type = this.getCodeType( code );
            if ( ! type ) {
                return null;
            }
            province = this.getProvinceByCode( code.replace( /[0-9]{4}$/, "0000" ) );
            data.province = { code: province.code, text: province.text };

            if ( type == "province" ) {
                return data;
            }

            city = this.getCityByCode( code.replace( /[0-9]{2}$/, "00" ) );
            data.city = { code: city.code, text: city.text };

            if ( type == "city" ) {
                return data;
            }

            district = this.getDistrictByCode( code );
            data.district = { code: district.code, text: district.text };

            return data;
        },
        formatCopyTargetValue: function ( data ) {
            var province,
                city,
                district,
                value
            ;

            value = "";

            if ( ! data ) {
                return value;
            }

            province = data.province;
            city = data.city;
            district = data.district;

            if ( province && province.text ) {
                value = province.text;
            }
            if ( city && city.text ) {
                value += " / " + city.text;
            }
            if ( district && district.text ) {
                value += " / " + district.text;
            }

            return value;
        }
    };


    AreaPanel.template = {
        container: '\
<div class="city-select-warp">\
    <div class="city-select-tab">\
        <a class="active" href="javascript:void(0)" data-cont=".city-province">省份</a>\
        <a href="javascript:void(0)" data-cont=".city-city">城市</a>\
        <a href="javascript:void(0)" data-cont=".city-district">县区</a>\
    </div>\
    <div class="city-select-content">\
        <div class="city-select city-province clearfix" style="display: block;"> \
            <dl> <dd> </dd> </dl> \
        </div>\
        <div class="city-select city-city clearfix" style="display: none;"> \
            <dl class="city-select-city"> <dd></dd> </dl> \
        </div>\
        <div class="city-select city-district clearfix" style="display: none;"> \
            <dl class="city-select-district"> <dd></dd> </dl> \
        </div>\
    </div>\
</div>'
    }
} ));

