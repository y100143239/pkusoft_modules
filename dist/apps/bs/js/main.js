require( [ "jquery", "codemirror", "codemirror-html", "bootstrap", "code-pretty" ], function ( $, CodeMirror ) {
    "use strict";
    var template
    ;

    template = {
        $pageHeaderContainer: ".js--pageHeaderContainer",
        $sidebarContainer: ".js--sidebarContainer",
        url: "/bs/",
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {

            this.$pageHeaderContainer = $( this.$pageHeaderContainer );
            this.$sidebarContainer = $( this.$sidebarContainer );

            this.url = this._getPrefixUrl();

        },
        bind: function () {
            var _this,
                docName
                ;
            _this = this;
            docName = this._getDocName();

            this.$sidebarContainer.load( this.url + "template/sidebar.html", null, function ( responseText, textStatus ) {
                if ( textStatus !== "success" ) {
                    alert( "载入失败，请刷新页面" );
                    return;
                }
                // 确定当前页面的active
                _this.$sidebarContainer.find( "a[href*='"+ docName +"']" ).closest( "li" ).addClass( "bs-active" );
            } );
            this.$pageHeaderContainer.load( this.url + "template/header.html", null, function ( responseText, textStatus ) {
                if ( textStatus !== "success" ) {
                    alert( "载入失败，请刷新页面" );
                    //return;
                }
            } );

        },
        _getPrefixUrl: function () {
            var pos,
                url
            ;
            url = window.location.href;
            pos = url.indexOf( this.url );
            url = url.substring( 0, pos + 4 );
            //this.url = url; //=> "http://localhost:63342/pkusoft_modules/dev/apps/bs/"
            return url;
        },
        _getDocName: function () {
            var url,
                pos
            ;
            url = window.location.href;
            pos = url.lastIndexOf( "/" );
            return url.substring( pos + 1 );
        }

    };


    $( document ).ready( function () {


        template.init();


        $( ".bs-editor" ).each( function () {
            var $this,
                $editor,
                $previewNav,
                CodeMirrorEditor
                ;
            $this = $( this );
            $editor = $this.find( "textarea.editor" );
            $previewNav = $this.find( ".nav-tabs .preview" );
            CodeMirrorEditor = CodeMirror.fromTextArea( $editor.get( 0 ), {
                mode: "text/html",
                lineNumbers: true
            } );
            CodeMirrorEditor.setSize( "100%", 460 );

            $previewNav.on( "click", function () {
                var editorText,
                    $tabPanePreview
                    ;
                $tabPanePreview = $this.find( ".tab-pane-preview" );
                editorText = CodeMirrorEditor.doc.getValue();

                $tabPanePreview.html( editorText );
            } );
        } ).find( ".js--full" ).on( "click", function () {
            var $bsEditor,
                $this
                ;
            $this = $( this );
            $bsEditor = $this.closest( ".bs-editor" );
            $bsEditor.toggleClass( "bs-editor-full" );
            if ( $bsEditor.is( ".bs-editor-full" ) ) {
                $( document.body ).addClass( "modal-open" );
            } else {
                $( document.body ).removeClass( "modal-open" );
            }
        } );

        //
        window[ "PR" ].prettyPrint();

    } );

} );