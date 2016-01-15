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
