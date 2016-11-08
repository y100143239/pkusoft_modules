define( [
        "jquery",
        JS_BASE_URL + "_dialog.js",
        "select2", "formvalidationI18N", "bootstrap", "bootgrid" ],
    function (
        $,
        Dialog
) {

    var $datagrid,
        $queryForm,
        $doQueryBtn,
        $addSysDeptBtn,
        $select2,
        URL
    ;

    URL = {
        "edit": HOST + "/admin/sysDept/template/edit",
        "detail": HOST + "/admin/sysDept/template/detail",
        "delete": HOST + "/admin/sysDept/delete",
        "save": HOST + "/admin/sysDept/save"
    };

    $datagrid = $( "#sysDeptDatagrid" );
    $queryForm = $( "#sysDeptQueryForm" );
    $doQueryBtn = $queryForm.find( ".js--doQuery" );
    $addSysDeptBtn = $( ".js--addSysDeptBtn" );
    $select2 = $queryForm.find( ".js--select" );

    $datagrid.bootgrid({
        formatters: {
            dateFormatter: dateFormatter,
            deptLevelFormatter: deptLevelFormatter,
        }
    } ).find( "tbody" ).on( "click", ".js--viewSysDept", function () {
        viewSysDept( this );
    } ).on( "click", ".js--editSysDept", function () {
        editSysDept( this );
    } ).on( "click", ".js--deleteSysDept", function () {
        deleteSysDept( this );
    } );

    $doQueryBtn.on( "click", function () {
        $datagrid.bootgrid( "reload" );
    } );

    $addSysDeptBtn.on( "click", function () {
        addSysDept();
    } );

    $select2.select2({
        data:[
            { id: 0, text: '最高级', spell: "zgj" },
            { id: 1, text: '一级', spell: "yj" },
            { id: 2, text: '二级', spell: "ej" },
            { id: 3, text: '三级', spell: "sj" },
            { id: 4, text: '四级', spell: "sj" }
        ]
    });

    function doQuery() {
        $doQueryBtn.trigger( "click" );
    }
    function dateFormatter( column, row ) {
        var date,
            year,
            month,
            day,
            value
            ;
        value = row[ column.id ];
        if ( ! value ) {
            return "";
        }

        date = new Date( parseInt( value ) );

        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();

        month = ( "0" + month ).slice( -2 );
        day = ( "0" + day ).slice( -2 );

        return year +  "年" + month + "月" + day + "日";
    }

    function deptLevelFormatter( column, row ) {
        var value
        ;

        value = +row[ column.id ];
        switch ( value ) {
            case 0: { return "最高级" }
            case 1: { return "一级" }
            case 2: { return "二级" }
            case 3: { return "三级" }
            case 4: { return "四级" }
            default: return "";
        }
    }

    function deleteSysDept( target ) {
        var $target
            ;
        $target = $( target );
        // 标记
        $target.closest( "tr" ).addClass( "warning" );
        new Dialog( {
            title: "提示",
            content: "确认删除？",
            confirmBtnText: "删除",
            cancelBtnText: "不删除",
            confirmCallback: function () {
                var _this
                    ;
                _this = this;
                _this.hide();
                $.post( URL[ "delete" ], { deptId: $target.data( "deptId" ) } )
                    .done( function ( response ) {
                        if ( ! response.success ) {
                            new Dialog( { title: "错误", content: "删除失败！" } );
                            return;
                        }
                        new Dialog( { title: "提示", content: "删除成功！" } );
                        // 标记
                        $target.closest( "tr" ).addClass( "danger text-danger" ).end().closest( "td" ).html("已删除");
                    } )
                    .fail( function () {
                        ( new Dialog ).show( { title: "错误", content: "网络异常。" } );
                    } );
            },
            cancelCallback: function () {
                this.hide();
            }
        } );

    }

    function viewSysDept ( target ) {
        var $target
            ;
        $target = $( target );
        // 标记
        $target.closest( "tr" ).addClass( "warning" );
        new Dialog( {
            title: "详情 - " + $target.data( "deptName" ),
            content: '<i class="fa fa-spin fa-spinner"></i> 加载...',
            width: 800,
            hasConfirmBtn: false,
            cancelBtnText: "关闭",
            remoteUrl: URL[ "detail" ],
            requestData: { deptId: $target.data( "deptId" ) }
        } );
    }

    function editSysDept( target ) {
        var $target
            ;
        $target = $( target );
        // 标记
        $target.closest( "tr" ).addClass( "warning" );
        new Dialog( {
            title: "编辑 - " + $target.data( "deptName" ),
            content: '<i class="fa fa-spin fa-spinner"></i> 加载...',
            confirmBtnText: "保存",
            cancelBtnText: "关闭",
            width: 800,
            remoteUrl: URL[ "edit" ],
            requestData: { deptId: $target.data( "deptId" ) },
            requestSuccessCallback: function () {
                var $form
                    ;
                $form = this.$container.find( '[data-pku-widget="fv"]' );
                $form.formValidation();
            },
            confirmCallback: function () {
                var $form,
                    $fvInstance,
                    isValid,
                    actionUrl,
                    _this
                    ;
                _this = this;
                $form = this.$container.find( '[data-pku-widget="fv"]' );
                $fvInstance = $form.data( 'formValidation' );
                actionUrl = $form.attr( "action" );
                // 校验
                $fvInstance.validate();
                // 判断
                isValid = $fvInstance.isValid();
                // 校验不通过 ， 退出
                if ( !isValid ) {
                    return false;
                }
                _this.$confirmBtn.html( '<i class="fa fa-spin fa-spinner"></i> 保存中' ).attr( "disabled", true );
                // 发送请求保存数据
                $.post( actionUrl, $form.serialize(), null, "json" )
                    .done( function ( data ) {
                        if ( ! ( data && data.success ) ) {
                            new Dialog ( { title: "提示", content: data.message || "保存失败。" } );
                            return;
                        }
                        _this.hide();
                        doQuery();
                    }).fail( function (){
                        new Dialog ( { title: "错误", content: "网络异常。" } );
                        _this.$confirmBtn.html( '<i class="fa fa-spin fa-spinner"></i> 保存中' ).removeAttr( "disabled" );
                    } );
            },
            cancelCallback: function () {
                window.console && console.info( "cancelCallback" );
                this.hide();
            }
        } );
    }

    function addSysDept() {
        new Dialog( {
            title: "新增",
            content: '<i class="fa fa-spin fa-spinner"></i> 加载...',
            confirmBtnText: "保存",
            cancelBtnText: "关闭",
            width: 800,
            remoteUrl: URL[ "edit" ],
            requestSuccessCallback: function () {
                var $form
                    ;
                $form = this.$container.find( '[data-pku-widget="fv"]' );
                $form.formValidation();
            },
            confirmCallback: function () {
                var $form,
                    $fvInstance,
                    isValid,
                    actionUrl,
                    _this
                    ;
                _this = this;
                $form = this.$container.find( '[data-pku-widget="fv"]' );
                $fvInstance = $form.data( 'formValidation' );
                actionUrl = $form.attr( "action" );
                // 校验
                $fvInstance.validate();
                // 判断
                isValid = $fvInstance.isValid();
                // 校验不通过 ， 退出
                if ( !isValid ) {
                    return false;
                }
                _this.$confirmBtn.html( '<i class="fa fa-spin fa-spinner"></i> 保存中' ).attr( "disabled", true );
                // 发送请求保存数据
                $.post( actionUrl, $form.serialize(), null, "json" )
                    .done( function ( data ) {
                        if ( ! ( data && data.success ) ) {
                            new Dialog ( { title: "提示", content: data.message || "保存失败。" } );
                            _this.$confirmBtn.html( '保存' ).removeAttr( "disabled" );
                            return;
                        }
                        _this.hide();
                        doQuery();
                    }).fail( function (){
                        new Dialog ( { title: "错误", content: "网络异常。" } );
                        _this.$confirmBtn.html( '保存' ).removeAttr( "disabled" );
                    } );
            },
            cancelCallback: function () {
                window.console && console.info( "cancelCallback" );
                this.hide();
            }
        } );
    }

} );