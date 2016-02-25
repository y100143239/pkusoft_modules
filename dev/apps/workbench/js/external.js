/* 区级数据

 请求设置

 1. HTML

     1) 设置
         <div class="qjsj-map"
             data-url="http://www.baidu.com"
             data-success-callback="mapSuccessCallback"
             data-error-callback="mapErrorCallback" >

     2) 请求参数
         <div class="map-hot-item" ... data-city-id="00">...内蒙...</div>
         <div class="map-hot-item" ... data-city-id="01">...阿拉善...</div>
         <div class="map-hot-item" ... data-city-id="03">...鄂尔多斯...</div>

 2. Ajax

     $.ajax({
         url: “data-url”,
         data: { "cityId": “data-city-id” },
         success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
         error: “data-error-callback”
     });


 */
function mapSuccessCallback( responseData ) {
    // 将服务器返回的数据处理成指定的格式
    var _sampleData = [
        {
            heading: { title: "人口", icon: "data_icon_1", label: "总数：", cont: "333333_" },
            body: [ { label: "女性：", "cont": "22222_" }, { label: "男性：", "cont": "11111_" } ]
        },
        {
            heading: { title: "户", icon: "data_icon_2", label: "总数：", cont: "4444_" },
            body: [ { label: "家庭户：", "cont": "3333_" }, { label: "集体户：", "cont": "0001_" }, {
                label: "农业户：",
                "cont": "0010_"
            }, { label: "城镇户：", "cont": "1100_" } ]
        },
        {
            heading: { title: "地址", icon: "data_icon_3", label: "总数：", cont: "99999_" },
            body: []
        }
    ];

    // 服务状况
    var test = Math.round( Math.random() ) == 1; // 用于测试

    // 将服务状况挂载到数值对象上：serviceName 的值可自行更改；status的值为"error"时表示运行异常
    _sampleData.serviceStatus = {
        data:[ // status属性值为"error"时显示为“运行异常”
            { serviceName: "区级指纹平台", icon: "_0_qjzw", status: ""},
            { serviceName: "异地办证平台", icon: "_1_ydbz", status: ""},
            { serviceName: "自动统计服务", icon: "_2_zdtj", status: ""},
            { serviceName: "人像比对平台", icon: "_3_rxbd", status: ""},
            { serviceName: "区级警务综合", icon: "_4_qjjw", status: ""},
            { serviceName: "部级联网查询", icon: "_5_bjlw", status: test ? "error": "" }
            //,
            //{ serviceName: "人口管理信息", icon: "_6_rkgl", status: ""},
            //{ serviceName: "人口自动统计", icon: "_7_rkzdtj", status: ""},
            //{ serviceName: "人口自动打包", icon: "_8_rkzddb", status: ""},
            //{ serviceName: "人口业务备案", icon: "_9_rkywba", status: ""}
        ]
    };

    responseData = _sampleData;
}
function mapErrorCallback( data, cityId ) {
    data[ 0 ].heading.cont = "3333_" + cityId;
    data[ 1 ].heading.cont = "3333_" + cityId;
    data[ 2 ].heading.cont = "3333_" + cityId;

    var test = Math.round( Math.random() ) == 1; // 用于测试
    data.serviceStatus = {
        data:[ // status属性值为"error"时显示为“运行异常”
            { serviceName: "区级指纹平台", icon: "_0_qjzw", status: ""},
            { serviceName: "异地办证平台", icon: "_1_ydbz", status: ""},
            { serviceName: "自动统计服务", icon: "_2_zdtj", status: ""},
            { serviceName: "人像比对平台", icon: "_3_rxbd", status: ""},
            { serviceName: "区级警务综合", icon: "_4_qjjw", status: ""},
            { serviceName: "部级联网查询", icon: "_5_bjlw", status: test ? "error": "" }
            //,
            //{ serviceName: "人口管理信息", icon: "_6_rkgl", status: ""},
            //{ serviceName: "人口自动统计", icon: "_7_rkzdtj", status: ""},
            //{ serviceName: "人口自动打包", icon: "_8_rkzddb", status: ""},
            //{ serviceName: "人口业务备案", icon: "_9_rkywba", status: ""}
        ]
    }


}

/* 业务监管-业务总量

    HTML

     1) 设置
         <div class="tabs tabs-business-total"
             data-url="http://www.baidu.com"
             data-success-callback="businessTotalSuccessCallback"
             data-error-callback="businessTotalErrorCallback" >

     2) 请求参数
         // （type）标志 全部业务总数 和 单项业务总数
         <div class="nav-item active" data-value="00"><a href="#">全部业务总数
         <option value="01">出生登记</option>
         <option value="02">死亡注销</option>
         <option value="03">补录业务</option>
         <option value="04">二代证受理</option>
         // （time）标志 时间段
         <div class="time-menu">
             <a href="#" class="time-menu-item active" data-value="day">本日数据</a>
             <a href="#" class="time-menu-item" data-value="week">本周数据</a>
             <a href="#" class="time-menu-item" data-value="month">本月数据</a>

    Ajax

     $.ajax({
         url: “data-url”,
         data: { "time": time, "type": type },
         success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
         error: “data-error-callback”
     });


 */
function businessTotalSuccessCallback( responseData ) {
    // 将服务器返回的数据处理成指定的格式，然后返回
    var _sampleData =  {
            time: "day", // day week month
            maxNum: 1000, // 指定最大数，当柱形高度为100%时的数量
            hhht: 0,  // 1. 呼和浩特
            bt: 0,    // 2. 包头
            wh: 0,    // 3. 乌海
            cf: 0,    // 4. 赤峰
            tl: 0,    // 5. 通辽
            eeds: 0,  // 6. 鄂尔多斯
            hlbe: 0,  // 7. 呼伦贝尔
            wlcb: 0,  // 8. 乌兰察布
            byne: 0,  // 9. 巴彦淖尔
            xa: 0,    // 10. 兴安
            als: 0,   // 11. 阿拉善
            xlgl: 0   // 12. 锡林郭勒
    };
    responseData = _sampleData;

    return responseData;
}
function businessTotalErrorCallback( data ) {
    for ( var prop in data ) {
        if ( prop === "maxNum" ) continue;
        data[ prop ] = ( data[ "maxNum" ] * Math.random() ).toFixed( 0 );
    }
}



/* 业务监管-业务查看

 HTML

 1) 设置
     <div class="tabs tabs-business-view"
         data-url="http://www.baidu.com"
         data-success-callback="businessViewSuccessCallback"
         data-error-callback="businessViewErrorCallback">

 2) 请求参数
     // （type）标志 全部业务查看 和 单项业务查看
         <div class="nav-item active" data-value="00"><a href="#">全部业务总数
             <option value="01">出生登记</option>
             <option value="02">死亡注销</option>
             <option value="03">补录业务</option>
             <option value="04">二代证受理</option>
     // （time）标志 时间段
         <div class="time-menu">
             <a href="#" class="time-menu-item active" data-value="day">本日数据</a>
             <a href="#" class="time-menu-item" data-value="week">本周数据</a>
             <a href="#" class="time-menu-item" data-value="month">本月数据</a>
     // 分页

 Ajax

 $.ajax({
     url: “data-url”,
     data: { "time": time, "type": type, "pageSize": 4, "pageNum": 1 },
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 pageSize: 每页的记录数
 pageNum: 请求的哪一页
 */
function businessViewSuccessCallback( responseData ) {
    // 将服务器返回的数据处理成指定的格式，然后返回

    // 所属盟市 更换为 受理单位
    var sampeData = [
        { num: 1, blsj: "2017-01-14 17:01", ywlx: "出生登记", ywmc: "张三办理出生登记业务", sldw: "呼和浩特分局", "slr": "李四", "spr": "王五", "ywzt": "已通过" },
        { num: 2, blsj: "2017-01-13 17:01", ywlx: "出生登记2", ywmc: "张三办理出生登记业务2", sldw: "呼和浩特派出所", "slr": "李四2", "spr": "王五2", "ywzt": "已通过2" },
        { num: 3, blsj: "2017-01-12 17:01", ywlx: "出生登记3", ywmc: "张三办理出生登记业务3", sldw: "呼和浩特派出所3", "slr": "李四3", "spr": "王五3", "ywzt": "已通过3" },
        { num: 4, blsj: "2017-01-11 17:01", ywlx: "出生登记4", ywmc: "张三办理出生登记业务4", sldw: "呼和浩特派出所4", "slr": "李四4", "spr": "王五4", "ywzt": "已通过4" }
    ];

    // 在数组对象上挂载两个属性
    sampeData[ "pageNum" ] = 1;

    responseData = sampeData;

    return responseData;
}
function businessViewErrorCallback() {

}


/* 异地办理-异地办证（受理中）

 HTML

 1) 设置
 <div class="tabs-body ydbl-cx" data-id="1" style="display: none;"
     data-url=""
     data-success-callback="ydblCxSuccessCallback"
     data-error-callback="ydblCxErrorCallback">

 2) 请求参数

    // xm
     <label class="form-label" for="">姓名：</label>
     <input type="text" class="form-control" name="xm"/>

    // islikequery (1或0)
     <input type="checkbox" name="islikequery"/><span>模糊查询</span></label>

    // gmsfzhm
     <label class="form-label" for="">公民身份证号码：</label>
     <input type="text" class="form-control" name="gmsfzhm"/>

    // pageNum

 Ajax

 $.ajax({
     url: “data-url”,
     data: { "pageNum": 1, "pageSize": 10,  "xm": xm, "islikequery": islikequery, "gmsfzhm": gmsfzhm },
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 pageSize: 每页的记录数
 pageNum: 请求的哪一页
 */
function ydblCxSuccessCallback( responseData ) {
    // 将服务器返回的数据处理成指定的格式，然后返回
    var sampeData =  [
        { num: 1, lx: "区内异地", sqr: "张三", gmsfzhm: "123456789012345678", slrq: "2016-01-15", "zjzt": "受理待审核", "ssms": "呼和浩特市" },
        { num: 2, lx: "区内异地2", sqr: "张三2", gmsfzhm: "123456789012345678", slrq: "2016-01-15", "zjzt": "受理待审核2", "ssms": "呼和浩特市2" }
    ];

    // 在数组对象上挂载属性
    sampeData[ "pageNum" ] = 1;

    responseData = sampeData;

    return responseData;
}
function ydblCxErrorCallback() {

}


/* 异地办理-异地办证情况统计

 HTML

 1) 设置
     <div class="tabs-body ydbz-tj" data-id="0" style="display: block;"
         data-url=""
         data-success-callback="ydblTjSuccessCallback"
         data-error-callback="ydblTjErrorCallback">

 2) 请求参数


 Ajax

 $.ajax({
     url: “data-url”,
     data: null,
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 */
function ydblTjSuccessCallback( responseData ) {
    // 将服务器返回的数据处理成指定的格式，然后返回
    var sampeData =  {
        /*  swmc：       单位名称。
         sl_sldw：    受理(按受理单位)。
         shqf_sldw：  审核签发(按受理单位)。
         sl_sjgs：    受理(按数据归属单位)。
         shqf_sjgs：  审核签发(按数据归属单位)。 */
        list: [
            { swmc: "呼和浩特市", sl_sldw: 1111, shqf_sldw: 2222, sl_sjgs: 3333, shqf_sjgs: 4444 },
            { swmc: "呼和浩特市22222", sl_sldw: 33, shqf_sldw: 555, sl_sjgs: 22211, shqf_sjgs: 347511 }
        ]
    };


    responseData = sampeData;

    return responseData;
}
function ydblTjErrorCallback() {

}


/* 数据质量-数据质量问题

 HTML

 1) 设置
 <div class="tabs tabs-quality-problems"
     data-url="http://www.baidu.com"
     data-success-callback="problemsSuccessCallback"
     data-error-callback="problemsErrorCallback">

 2) 请求参数

 // type， data-value的值标志 “全部数据质量问题”以及各个单项数据质量问题
 <div class="nav-item active" data-value="00"><a href="#">全部数据质量问题</a></div>
 <div class="nav-item" data-value=""><a href="#">分类数据质量问题</a>
     <select name="" >
         <option value="01">公民身份号码为空</option>
         <option value="02">单项数据质量问题2</option>
         <option value="03">单项数据质量问题3</option>
     </select>
 </div>

 Ajax

 $.ajax({
     url: “data-url”,
     data: { "type": type },
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 */
function problemsSuccessCallback( responseData ) {
    var _sampleData =  {
        maxNum: 1000, // 指定最大数，当柱形高度为100%时的数量
        hhht: 0,  // 1. 呼和浩特
        bt: 0,    // 2. 包头
        wh: 0,    // 3. 乌海
        cf: 0,    // 4. 赤峰
        tl: 0,    // 5. 通辽
        eeds: 0,  // 6. 鄂尔多斯
        hlbe: 0,  // 7. 呼伦贝尔
        wlcb: 0,  // 8. 乌兰察布
        byne: 0,  // 9. 巴彦淖尔
        xa: 0,    // 10. 兴安
        als: 0,   // 11. 阿拉善
        xlgl: 0   // 12. 锡林郭勒
    };
    responseData = _sampleData;
    return responseData;
}
function problemsErrorCallback(responseData) {
// 将服务器返回的数据处理成指定的格式，然后返回
    var _sampleData =  {
        maxNum: 1000, // 指定最大数，当柱形高度为100%时的数量
        hhht: 0,  // 1. 呼和浩特
        bt: 0,    // 2. 包头
        wh: 0,    // 3. 乌海
        cf: 0,    // 4. 赤峰
        tl: 0,    // 5. 通辽
        eeds: 0,  // 6. 鄂尔多斯
        hlbe: 0,  // 7. 呼伦贝尔
        wlcb: 0,  // 8. 乌兰察布
        byne: 0,  // 9. 巴彦淖尔
        xa: 0,    // 10. 兴安
        als: 0,   // 11. 阿拉善
        xlgl: 0   // 12. 锡林郭勒
    };
    responseData = _sampleData;
    for ( var prop in _sampleData ) {
        if ( prop === "maxNum" ) continue;
        _sampleData[ prop ] = ( _sampleData[ "maxNum" ] * Math.random() ).toFixed( 0 );
    }
    return responseData;
}


/* 数据质量-重证号

 HTML

 1) 设置
 <div class="tabs tabs-duplicate-code"
     data-url="http://www.baidu.com"
     data-success-callback="duplicateSuccessCallback"
     data-error-callback="duplicateErrorCallback">

 2) 请求参数

    pageNum: 第几页
    pageSize: 每页的记录数

 Ajax

 $.ajax({
     url: “data-url”,
     data: { "pageNum": pageNum, "pageSize": pageSize },
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 */
function duplicateSuccessCallback(responseData) {
    var _sampleData = [
        { num: 1, chhm: "123456789012345678", xm: "张三", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
        { num: 2, chhm: "", xm: "张三2", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
        { num: 3, chhm: "123456789012345678", xm: "张三3", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" },
        { num: 4, chhm: "", xm: "张三4", xb: "男", csrq: "1988-08-12", hjszd: "呼和浩特市新城区海东路1号", lxdh: "18781222788" }
    ];
    responseData = _sampleData;
    return responseData;
}
function duplicateErrorCallback() {

}


/* 数据服务

 HTML

 1) 设置
     <div class="tabs"
         data-url="http://www.baidu.com"
         data-success-callback="dataServiceSuccessCallback"
         data-error-callback="dataServiceErrorCallback">

 2) 请求参数

     1. type： （data-value）是统计还是分析

         <div class="nav-item active" data-value="00"><a href="#">统计</a></div>
         <div class="nav-item" data-value="01"><a href="#">分析</a></div>

     2. cityId：（data-value）盟市

         <div class="city-select dropdown-menu-body">
             <div class="city-select-item active"><a href="#" data-value="01">呼和浩特</a></div>
             <div class="city-select-item"><a href="#" data-value="02">包头</a></div>
             <div class="city-select-item"><a href="#" data-value="03">乌海</a></div>
             <div class="city-select-item"><a href="#" data-value="04">赤峰</a></div>
             <div class="city-select-item"><a href="#" data-value="05">通辽</a></div>
             <div class="city-select-item"><a href="#" data-value="06">鄂尔多斯</a></div>
             <div class="city-select-item"><a href="#" data-value="07">呼伦贝尔</a></div>
             <div class="city-select-item"><a href="#" data-value="08">乌兰察布</a></div>
             <div class="city-select-item"><a href="#" data-value="09">巴彦淖尔</a></div>

     3. startTime：（data-value）开始时间
         <div class="time-start dropdown-menu"><!-- active -->
         <div class="dropdown-menu-heading">
            <span class="dropdown-menu-input" data-value="201409" ><span class="yyyy">2015</span>年<span class="mm">01</span>月</span>


     4. endTime：（data-value）结束时间
         <div class="time-start dropdown-menu"><!-- active -->
         <div class="dropdown-menu-heading">
            <span class="dropdown-menu-input" data-value="201409" ><span class="yyyy">2015</span>年<span class="mm">01</span>月</span>

 Ajax

 $.ajax({
     url: “data-url”,
     data: { "type": type, "cityId": cityId, "startTime": startTime, "endTime": endTime },
     success: “data-success-callback”, // 将服务器返回的数据处理成指定的格式
     error: “data-error-callback”
 });
 */
function dataServiceSuccessCallback( responseData ) { // 将服务器返回的数据处理成指定的格式
    var sampleData = {
        title: "数据统计" , // 柱状图的标题
        type: "数量",
        data: [ // 数据，
            { name: "数据项1", value: "100" },
            { name: "数据项2", value: "200" },
            { name: "数据项3", value: "300" },
            { name: "数据项4", value: "400" },
            { name: "数据项5", value: "500" }
        ]
    };
    var random = parseInt( Math.random() * 20 );
    for ( var i = 0; i < random; i++ ) {
        sampleData.data[ i ] = { name: "数据项" + (i+1), value: i + 1 };
    }
    sampleData["title"] = "数据统计" + random;
    sampleData["type"] = "数量" + random;

    return sampleData;
}
function dataServiceErrorCallback() {
    if ( IS_DEV === false ) {
        return;
    }
    var sampleData = {
        title: "数据统计" , // 柱状图的标题
        type: "数量",
        data: [ // 数据，
            { name: "数据项1", value: "100" },
            { name: "数据项2", value: "200" },
            { name: "数据项3", value: "300" },
            { name: "数据项4", value: "400" },
            { name: "数据项5", value: "500" }
        ]
    };
    var random = parseInt( Math.random() * 20 );
    for ( var i = 0; i < random; i++ ) {
        sampleData.data[ i ] = { name: "数据项" + (i+1), value: i + 1 };
    }
    sampleData["title"] = "数据统计" + random;
    sampleData["type"] = "数量" + random;

    return sampleData;
}

