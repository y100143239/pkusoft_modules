<form class="form-horizontal parsley js--form" data-parsley-validate="" data-parsley-trigger="focusin focusout">
    <div class="form-group">
        <label class="col-sm-2 control-label require">公司名称</label>

        <div class="col-sm-10">
            <input type="text" class="form-control" name="gsmc" value="{{=it.gsmc}}" required>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label require">公司性质</label>

        <div class="col-sm-4">
            <div class="input-group js--DropdownMenu-container">
                <input type="text" class="form-control js--DropdownMenu-input" readonly value="{{=it.dic_gsxz[it.gsxz]}}">
                <input type="hidden" name="gsxz" class="js--DropdownMenu-hidden" value="{{=it.gsxz}}"/>
                <span class="input-group-addon js--DropdownMenu-clear"><span class="glyphicon glyphicon-remove"></span></span>

                <div class="input-group-btn">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span
                            class="glyphicon glyphicon-chevron-down"></span></button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        {{ for( var prop in it.dic_gsxz ) { }}
                            <li><a data-value="{{=prop}}">{{=it.dic_gsxz[prop]}}</a></li>
                        {{ } }}
                    </ul>
                </div>
            </div>
        </div>
        <label class="col-sm-2 control-label">管理人数</label>

        <div class="col-sm-4">
            <input type="text" class="form-control" name="glrs" value="{{=it.glrs}}" data-parsley-type="integer"
                   data-parsley-min="0">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">公司设立时间</label>

        <div class="col-sm-4">
            <div class="input-group date js--datepicker-container " data-date-format="yyyy-mm-dd">
                <input class="form-control js--datepicker-input" size="16" type="text" value="{{=it.clsj}}" readonly name="clsj">
                <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-2 control-label">经营范围</label>

        <div class="col-sm-10">
            <div class="checkbox ">
                <label> <input type="checkbox" name="jyfw" data-parsley-mincheck="1" value="01"> 五金交电 </label>
                <label> <input type="checkbox" name="jyfw" value="02"> 日用百货 </label>
                <label> <input type="checkbox" name="jyfw" value="03"> 日用百货2 </label>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-2 control-label">企业规模</label>

        <div class="col-sm-4">
            <div class="radio">
                <label> <input type="radio" name="qygm" value="big"> 大 </label>
                <label> <input type="radio" name="qygm" checked value="medium"> 中 </label>
                <label> <input type="radio" name="qygm" value="small"> 小 </label>
            </div>
        </div>
    </div>
</form>
