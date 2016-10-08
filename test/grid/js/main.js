jQuery( document ).ready( function ( $ ) {

    var $grid,
        url,
        requestPage
        ;

    $grid = $( '[data-pku-widget="datagrid"]' );

    $grid.each( function () {
        var $this,
            url
            ;
        $this = $( this );
        url = $this.data( "url" );

        $this.bootgrid( {
            padding: 7,
            navigation: 2,
            ajax: true,
            url: url,
            formatters: {
                //commands: function(column, row) { return "<button type='button' class='btn-view' title='阅卷'>阅卷</button>" }
            },
            requestHandler: function ( request ) {
                //console.info( request );
                //TODO 将其格式化为符合服务端要求的数据
                var txtQuery = {
                    "oredCriteria": [],
                    "orderByClause": "", // "USER_ID"
                    "pager": { "start": 0, "limit": 20, "pageSize": 20 }
                };
                var originRequest = {
                    current: 1, // 请求的页数
                    rowCount: 10, // 每页的记录数
                    sort: { // 排序
                        addr: "desc" // order by ADDR desc
                    }
                };

                var start,
                    pageSize,
                    limit,
                    current,
                    rowCount,
                    sort,
                    orderByClause
                    ;
                current = request.current;
                rowCount = request.rowCount;
                sort = request.sort;

                start = rowCount * ( current - 1 );
                limit = current * rowCount;
                pageSize = rowCount;

                requestPage = current;

                // replace(/([A-Z])/g,"_$1").toUpperCase();
                orderByClause = "";
                if ( sort ) {
                    for ( var prop in sort ) {
                        if ( !sort.hasOwnProperty( prop ) ) {
                            continue;
                        }
                        if ( orderByClause ) {
                            orderByClause += ","
                        }
                        orderByClause += prop.replace( /([A-Z])/g, "_$1" ).toUpperCase() + " " + sort[ prop ].toUpperCase();
                    }
                }

                txtQuery.orderByClause = orderByClause || "";

                txtQuery.pager = {
                    "start": start,
                    "limit": limit,
                    "pageSize": pageSize
                };

                request = {
                    start: start,
                    limit: limit,
                    pageSize: pageSize,
                    txtQuery: JSON.stringify( txtQuery )
                };

                return request;
            },
            responseHandler: function ( response ) {
                // 将服务器返回的数据进行格式转换
                var _response = {
                    "current": response.current || 1,
                    "rowCount": 10,
                    "rows": [
                        { "id": "001", "name": "张三01", "tel": "0000001", "addr": "某个地方01" },
                        { "id": "002", "name": "张三02", "tel": "0000002", "addr": "某个地方02" },
                        { "id": "003", "name": "张三03", "tel": "0000003", "addr": "某个地方03" },
                        { "id": "004", "name": "张三04", "tel": "0000004", "addr": "某个地方04" },
                        { "id": "005", "name": "张三05", "tel": "0000005", "addr": "某个地方05" },
                        { "id": "006", "name": "张三06", "tel": "0000006", "addr": "某个地方06" },
                        { "id": "007", "name": "张三07", "tel": "0000007", "addr": "某个地方07" },
                        { "id": "008", "name": "张三08", "tel": "0000008", "addr": "某个地方08" },
                        { "id": "009", "name": "张三09", "tel": "0000009", "addr": "某个地方09" },
                        { "id": "010", "name": "张三10", "tel": "0000010", "addr": "某个地方10" }
                    ],
                    "total": 1123
                };

                _response = {
                    "current": requestPage,
                    "rowCount": 10,
                    "rows": response.data,
                    "total": response.totalRecords
                };

                return _response;
            }
        } );


    } );
} );
