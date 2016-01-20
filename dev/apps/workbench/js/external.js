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
    responseData = _sampleData;
}
function mapErrorCallback( data, cityId ) {
    data[ 0 ].heading.cont = "3333_" + cityId;
    data[ 1 ].heading.cont = "3333_" + cityId;
    data[ 2 ].heading.cont = "3333_" + cityId;
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
    var sampeData = [
        { num: 1, blsj: "2017-01-14 17:01", ywlx: "出生登记", ywmc: "张三办理出生登记业务", ssms: "呼和浩特", "slr": "李四", "spr": "王五", "ywzt": "已通过" },
        { num: 2, blsj: "2017-01-13 17:01", ywlx: "出生登记2", ywmc: "张三办理出生登记业务2", ssms: "呼和浩特2", "slr": "李四2", "spr": "王五2", "ywzt": "已通过2" },
        { num: 3, blsj: "2017-01-12 17:01", ywlx: "出生登记3", ywmc: "张三办理出生登记业务3", ssms: "呼和浩特3", "slr": "李四3", "spr": "王五3", "ywzt": "已通过3" },
        { num: 4, blsj: "2017-01-11 17:01", ywlx: "出生登记4", ywmc: "张三办理出生登记业务4", ssms: "呼和浩特4", "slr": "李四4", "spr": "王五4", "ywzt": "已通过4" }
    ];

    // 在数组对象上挂载两个属性
    sampeData[ "pageNum" ] = 1;

    responseData = sampeData;

    return responseData;
}
function businessViewErrorCallback() {

}


/* 异地办理

 HTML

 1) 设置
     <div class="wd-ydbl" id="ydbl" style="display: block;">
     <div class="tabs"
             data-url=""
             data-success-callback="ydblSuccessCallback"
             data-error-callback="ydblErrorCallback">

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
function ydblSuccessCallback( responseData ) {
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
function ydblErrorCallback() {

}

