$( document ).ready( function () {


    // form
    $( '#ff' ).form( {
        //url: "http://www.baidu.com",
        //novalidate: true,
        onSubmit: function () {
            var $this,
                isValid
                ;
            $this = $( this );
            isValid = $this.form( "validate" );
            if ( isValid ) {
                //$.messager.progress();	// display the progress bar
            }
            if ( ! isValid ) {
                return isValid;
            }
        },
        success: function () {
            window.open("index.html", "_self");
        }
    } ).form("resetValidation");

    $( "#panel_propertyGrid" ).panel({
        width:198,
        height:180,
        title:'property grid',
        collapsible: true
    });
    $( "#propertyGrid" ).propertygrid({
        //width: "280",
        fit: true,
        border: false,
        data: {
            "total": 4,
            "rows": [
                { "name": "Name", "value": "Bill Smith", "group": "ID Settings", "editor": "text" },
                { "name": "Address", "value": "", "group": "ID Settings", "editor": "text" },
                { "name": "SSN", "value": "123-456-7890", "group": "ID Settings", "editor": "text" },
                {
                    "name": "Email", "value": "bill@gmail.com", "group": "Marketing Settings", "editor": {
                    "type": "validatebox",
                    "options": {
                        "validType": "email"
                    }
                }
                }
            ]
        },
        showGroup: true
    });


    $( "#panel_tutorials" ).panel({
        width:198,
        height:180,
        title:'tutorials',
        collapsible: true
    });


    $( "#panel_clock" ).panel({
        width:198,
        height:180,
        title:'clock',
        collapsible: true
    });


    $( "#panel_calendar" ).panel({
        width:198,
        height:180,
        title:'calendar',
        collapsible: true
    });

    $( "#easyui-calendar" ).calendar({
        fit: true,
        border: false,
        current:new Date()
    });


    $( "#panel_register" ).panel({
        width:198,
        height:180,
        title:'register',
        collapsible: true
    });


    $.parser.parse(); // 手动渲染

} );