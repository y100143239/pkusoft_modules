<form class="form-horizontal parsley" data-parsley-validate="" data-parsley-trigger="focusin focusout">
    <div class="form-group">
        <label  class="col-sm-2 control-label require">公司名称</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" name="username"  required="" data-parsley-minlength="6">
        </div>
    </div>
    <div class="form-group">
        <label  class="col-sm-2 control-label require">公司性质</label>
        <div class="col-sm-4">
            <div class="input-group js--select">
                <input type="text" class="form-control js--input"  data-value="" readonly>
                <span class="input-group-addon js-clear"><span class="glyphicon glyphicon-remove"></span></span>
                <div class="input-group-btn">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ><span class="glyphicon glyphicon-chevron-down"></span></button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li><a data-value="01">国有企业</a></li>
                        <li><a data-value="02">集体企业</a></li>
                        <li><a data-value="03">联营企业</a></li>
                        <li><a data-value="04">股份合作制企业</a></li>
                        <li><a data-value="05">私营企业</a></li>
                        <li><a data-value="06">个体户</a></li>
                        <li><a data-value="07">合伙企业</a></li>
                        <li><a data-value="08">有限责任公司</a></li>
                        <li><a data-value="09">股份有限公司</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <label  class="col-sm-2 control-label">管理人数</label>
        <div class="col-sm-4">
            <input type="text" class="form-control" name="password" placeholder="" data-parsley-type="integer" data-parsley-min="0">
        </div>
    </div>
    <div class="form-group">
        <label  class="col-sm-2 control-label">公司设立时间</label>
        <div class="col-sm-4">
            <div class="input-group date js--date " data-date-format="yyyy-mm-dd" >
                <input class="form-control js--input" size="16" type="text" value="" readonly>
                <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label  class="col-sm-2 control-label">经营范围</label>
        <div class="col-sm-10">
            <div class="checkbox ">
                <label> <input type="checkbox" name="_2" data-parsley-mincheck="1" > 五金交电 </label>
                <label> <input type="checkbox" name="_2"> 日用百货 </label>
                <label> <input type="checkbox" name="_2"> 日用百货2 </label>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label  class="col-sm-2 control-label">企业规模</label>
        <div class="col-sm-4">
            <div class="radio ">
                <label> <input type="radio" name="_radio" > 大 </label>
                <label> <input type="radio" name="_radio" checked> 中 </label>
                <label> <input type="radio" name="_radio"> 小 </label>
            </div>
        </div>
    </div>
</form>