define( ["jquery", "doT", "ajaxQueue", "bootstrap"], function ( $, doT ) {

    var fixRecord = {
        $container: ".fix-record",
        $addRecordBtn: ".btn-add-record",
        $dialog: null,
        init : function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$container = $( this.$container );
            this.$addRecordBtn = $( this.$addRecordBtn );
        },
        bind: function () {
            var _this;

            _this = this;

            // 点击按钮添加 记录
            this.$addRecordBtn.on( "click", function () {
                $( this ).after( _this.template.add );
            } );

            // 点击按钮添加条目
            this.$container.on( "click", ".js--new-item", function () {
                var $currentItemForm,
                    $newItemForm
                ;

                $currentItemForm = $( this ).closest( "form" );
                $newItemForm = $currentItemForm.clone();
                $currentItemForm.after( $newItemForm );
            } );
            // 点击保存
            this.$container.on( "click", ".js--save", function () {
                var $form,
                    $container
                ;
                $container = $( this ).closest( ".fix-record-item-add" );
                $form = $container.find( "form" );
                _this._request( $form );
            } );
            // 点击保存
            this.$container.on( "click", ".js--preview", function () {
                var $form,
                    $container,
                    data,
                    html
                ;
                $container = $( this ).closest( ".fix-record-item-add" );
                $form = $container.find( "form" );

                data = {
                    list: { icon: "", text: "" },
                    itemList: [
                        //{ icon: "", text: "", labelIcon: "", labelText: "" }
                    ]
                };

                $form.first().each( function () {
                    var list = data.list;
                    list.icon = this.icon.value;
                    list.text = this.text.value;
                });
                $form.filter(":gt(0)").each( function () {
                    var itemList = data.itemList;
                    itemList.push({
                        icon: this.icon.value, text: this.text.value, labelIcon: this.labelIcon.value, labelText: this.labelText.value
                    })
                });
                html = doT.template( _this.template.preview ) ( data );
                _this._dialog( "预览", html, "lg" );
            } );

            // 点击取消
            this.$container.on( "click", ".js--cancel", function () {
                $( this ).closest( ".fix-record-item-add" ).remove();
            });
        },
        _request: function ( $form, listId ) {
            var _this,
                $this,
                url,
                data,
                $container
                ;
            _this = this;
            $this = $form.first();
            $form = $form.filter( ":gt(0)" );

            $container = $this.parent( "[data-list-id]" );

            url = $this.attr( "action" );
            data = $this.serialize();

            if ( listId ) {
                data += "&listId=" + listId;
            }

            $.ajaxQueue({
                method: "POST",
                url: url,
                data: data
            } ).done( function ( responseData ) {
                if ( ! responseData.success ) {
                    return;
                }
                if ( url.indexOf( "/record/list" ) != -1 ) {
                    $container.data( "listId", responseData.data );
                }
                if ( $form.size() > 0 ) {
                    _this._request( $form, $container.data( "listId" ) );
                } else {
                    // 保存成功
                    _this._dialog( "信息", "保存成功", "sm" );
                }
            } );
        },
        _dialog: function ( title, content, size ) {
            if ( ! this.$dialog ) { // init
                this.$dialog = $( this.template.modal.alert ).appendTo( $( document.body ) ).modal( {
                    backdrop: "static",
                    show: false
                } );
                this.$dialog.data( "$title", this.$dialog.find( ".modal-title" ) );
                this.$dialog.data( "$content", this.$dialog.find( ".modal-body" ) );
                this.$dialog.data( "$container", this.$dialog.find( ".modal-dialog" ) );
            }
            this.$dialog.data( "$title" ).html( title );
            this.$dialog.data( "$content" ).html( content );

            this.$dialog.data( "$container" ).removeClass( "modal-sm modal-lg" );
            if ( size ) {
                this.$dialog.data( "$container" ).addClass( "modal-" + size );
            }
            this.$dialog.modal( 'show' );
        }
    };


    fixRecord.template = {
        add: '\
<div class="fix-record-item-add border-radius-none-all" data-list-id="">\
    <form action="/record/list/save" class="form-horizontal">\
        <div class="form-group">\
            <div class="col-xs-2 text-right">\
                <label class="control-label">标题图标</label>\
            </div>\
            <div class="col-xs-4">\
                <input type="text" class="form-control" name="icon">\
            </div>\
            <div class="col-xs-2 text-right">\
                <label class="control-label">标题内容</label>\
            </div>\
            <div class="col-xs-4">\
                <input type="text" class="form-control" name="text" >\
            </div>\
        </div>\
    </form>\
    <form action="/record/item/save" class="form-horizontal">\
        <div class="form-group">\
            <div class="col-xs-4">\
                <button type="button" class="btn btn-default btn-sm js--new-item"><i class="fa fa-plus"></i> 条目</button>\
            </div>\
        </div>\
        <div class="form-group">\
            <div class="col-xs-2 text-right">\
                <label class="control-label">条目图标</label>\
            </div>\
            <div class="col-xs-4">\
                <input type="text" class="form-control" name="icon">\
            </div>\
        </div>\
        <div class="form-group">\
            <div class="col-xs-2 text-right">\
                <label class="control-label">标签图标</label>\
            </div>\
            <div class="col-xs-4">\
                <input type="text" class="form-control" name="labelIcon" >\
            </div>\
            <div class="col-xs-2 text-right">\
                <label class="control-label">标签内容</label>\
            </div>\
            <div class="col-xs-4">\
                <input type="text" class="form-control" name="labelText" >\
            </div>\
        </div>\
        <div class="form-group">\
            <div class="col-xs-2 text-right">\
                <label class="control-label">条目内容</label>\
            </div>\
            <div class="col-xs-10">\
                <input type="text" class="form-control" name="text" />\
            </div>\
        </div>\
    </form>\
    <div class="row">\
        <div class="col-xs-6 col-xs-push-2">\
            <div class="btn-group">\
                <button type="button" class="btn btn-info js--save"><i class="fa fa-save"></i> 保存</button>\
                <button type="button" class="btn btn-default js--preview"><i class="fa fa-eye"></i> 预览</button>\
                <button type="button" class="btn btn-default js--cancel"><i class="fa fa-trash-o"></i> 取消</button>\
            </div>\
        </div>\
    </div>\
</div>',
        preview: '\
<div class="fix-record">\
    <div class="fix-record-item">\
    {{\
        var list,\
            itemList\
            ;\
        list = it.list;\
        itemList = it.itemList;\
    }}\
        <h3 class="header"><i class="{{=list.icon}}"></i> {{=list.text}}</h3>\
    {{ for ( var i = 0, len = itemList.length; i < len; i++ ) { \
            var item = itemList[ i ];\
    }}    \
        <p class="item-detail"><i class="{{=item.icon}}"></i><span class="{{=item.labelIcon}}">{{=item.labelText}}</span> {{=item.text}}</p>\
    {{ } }}\
    </div>\
</div>',
        modal: {
            alert: '\
<div class="modal">\
    <div class="modal-dialog">\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal">×</button>\
                <h4 class="modal-title"></h4>\
            </div>\
            <div class="modal-body" style="overflow: auto">\
            </div>\
            <div class="modal-footer text-center">\
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>\
            </div>\
        </div>\
    </div>\
</div>'
        }
    };

    // fixRecord.init();

    return fixRecord;
} );