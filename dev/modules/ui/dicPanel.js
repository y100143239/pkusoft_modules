define(["jquery"], function ( $ ) {

    function DicPanel( options ) {

        this.$panel = "#component-dicpanel";
        this.$tab = ".city-select-tab";
        this.$content = ".city-select-content";
        this.$provinceContent = ".city-province";
        this.$cityContent = ".city-city";
        this.$districtContent = ".city-district";
        this.$streetContent = ".city-street";

        for( var prop in options ) {
            if ( ! options.hasOwnProperty( prop ) ) {
                continue;
            }
            this[ prop ] = options[ prop ];
        }
    }
    DicPanel.prototype = {
        constructor: DicPanel,
        init: function init () {
            this.render();
            this.bind();
        },
        render: function render() {
            this.$panel = $( this.$panel );
            this.$tab = $( this.$tab, this.$panel );
            this.$content = $( this.$content, this.$panel );
            this.$provinceContent = $( this.$provinceContent, this.$panel );
            this.$cityContent = $( this.$cityContent, this.$panel );
            this.$districtContent = $( this.$districtContent, this.$panel );
            this.$streetContent = $( this.$streetContent, this.$panel );
        },
        bind: function bind() {
            var _this,
                tabItem
                ;
            _this = this;
            tabItem = $( this.$tab ).find("a[data-cont]");

            tabItem.on("click", tabItemClickHandler);


            function tabItemClickHandler() {
                var $this,
                    $content
                    ;

                $this = $( this );
                $content = _this.$content.find( "." + $this.attr("data-cont") );

                // 切换tab
                $this.addClass( "current" ).siblings( "a" ).removeClass( "current" );

                // 切换content
                $content.show().siblings().hide();
            }
        }
    };

    return DicPanel;

});
