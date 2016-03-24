+function( $ ){

    $.extend( $.fn.validatebox.defaults, {
        validateOnCreate: false,
        validateOnBlur: true
    } );

    //TODO tooltip
    $.extend( $.fn.tooltip.defaults, {
        trackMouse: true
    } );

    //TODO
    // 以“noval_”打头的规则，可应用于非表单元素，比如<div>
    $.extend( $.fn.validatebox.defaults.rules, {
        integer: {
            validator: function ( value ) {
                return /^[+-]?[0-9]*$/.test( value );
            },
            message: '请输入整数！'
        },
        max: {
            validator: function ( value, param ) {
                var max,
                    val
                ;
                max = parseFloat( param[ 0 ] );
                val = parseFloat( value );

                return max - val >= 0 ;
            },
            message: '最大值为 {0} ！'
        },
        min: {
            validator: function ( value, param ) {
                var min,
                    val
                ;
                min = parseFloat( param[ 0 ] );
                val = parseFloat( value );

                return min - val <= 0 ;
            },
            message: '最小值为 {0} ！'
        },
        digits: {
            validator: function ( value ) {
                return /^[+-]?[0-9]*\.?[0-9]*$/.test( value );
            },
            message: '输入的数字不合法！'
        },
        pattern: {
            validator: function ( value, param ) {
                var regex,
                    val
                    ;
                val = value;
                regex = new RegExp( param[ 0 ] );
                return regex.test( val );
            },
            message: '{1}'
        },
        equalTo: {
            validator: function ( value, param ) {
                var $target,
                    val
                    ;
                val = value;
                $target = $( param[ 0 ] );
                return $target.val() === val;
            },
            message: '{1}'
        },
        noval_checkbox_required: {
            validator: function ( value, param ) {
                var $target
                    ;
                $target = $( param[ 0 ] );
                return $target.filter( ":checked" ).size() > 0;
            },
            message: '必须选择一项！'
        },
        autocompleteDic: {
            validator: function ( value, param ) {
                return !! $( this ).attr( "data-code" );
            },
            message: '请选择一项！'
        }

    } );

}( jQuery );