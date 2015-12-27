/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */

// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

define( "utils/domReady", [], function () {
    "use strict";
    function u( e ) {
        var t;
        for ( t = 0; t < e.length; t += 1 )e[ t ]( s )
    }

    function a() {
        var e = o;
        i && e.length && (o = [], u( e ))
    }

    function f() {
        i || (i = !0, n && clearInterval( n ), a())
    }

    function c( e ) {
        return i ? e( s ) : o.push( e ), c
    }

    var e, t, n, r = typeof window != "undefined" && window.document, i = !r, s = r ? document : null, o = [];
    if ( r ) {
        if ( document.addEventListener )document.addEventListener( "DOMContentLoaded", f, !1 ), window.addEventListener( "load", f, !1 ); else if ( window.attachEvent ) {
            window.attachEvent( "onload", f ), t = document.createElement( "div" );
            try {
                e = window.frameElement === null
            } catch ( l ) {
            }
            t.doScroll && e && window.external && (n = setInterval( function () {
                try {
                    t.doScroll(), f()
                } catch ( e ) {
                }
            }, 30 ))
        }
        document.readyState === "complete" && f()
    }
    return c.version = "2.0.1", c.load = function ( e, t, n, r ) {
        r.isBuild ? n( null ) : c( n )
    }, c
} ), define( "utils/clone", [], function () {
    function t( e, r ) {
        if ( e == null || typeof e != "object" )return e;
        if ( r == undefined )r = []; else {
            var i, s = r.length;
            for ( i = 0; i < s; i++ )if ( e === r[ i ] )return e
        }
        r.push( e );
        if ( typeof e.clone == "function" )return e.clone( !0 );
        if ( Object.prototype.toString.call( e ) == "[object Array]" ) {
            u = e.slice();
            var i = u.length;
            while ( i-- )u[ i ] = t( u[ i ], r );
            return u
        }
        if ( e instanceof Date )return new Date( e.getTime() );
        if ( e instanceof RegExp )return new RegExp( e );
        if ( e.nodeType && typeof e.cloneNode == "function" )return e.cloneNode( !0 );
        var o = Object.getPrototypeOf ? Object.getPrototypeOf( e ) : e.__proto__;
        o || (o = e.constructor.prototype);
        var u = n( o );
        for ( var a in e )u[ a ] = t( e[ a ], r );
        return u
    }

    var e = function () {
        "use strict";
        function e( t, n, r, i ) {
            function l( t, r ) {
                if ( t === null )return null;
                if ( r === 0 )return t;
                var o, c;
                if ( typeof t != "object" )return t;
                if ( e.__isArray( t ) )o = []; else if ( e.__isRegExp( t ) )o = new RegExp( t.source, s( t ) ), t.lastIndex && (o.lastIndex = t.lastIndex); else if ( e.__isDate( t ) )o = new Date( t.getTime() ); else {
                    if ( f && Buffer.isBuffer( t ) )return o = new Buffer( t.length ), t.copy( o ), o;
                    typeof i == "undefined" ? (c = Object.getPrototypeOf( t ), o = Object.create( c )) : (o = Object.create( i ), c = i)
                }
                if ( n ) {
                    var h = u.indexOf( t );
                    if ( h != -1 )return a[ h ];
                    u.push( t ), a.push( o )
                }
                for ( var p in t ) {
                    var d;
                    c && (d = Object.getOwnPropertyDescriptor( c, p ));
                    if ( d && d.set == null )continue;
                    o[ p ] = l( t[ p ], r - 1 )
                }
                return o
            }

            var o;
            typeof n == "object" && (r = n.depth, i = n.prototype, o = n.filter, n = n.circular);
            var u = [], a = [], f = typeof Buffer != "undefined";
            return typeof n == "undefined" && (n = !0), typeof r == "undefined" && (r = Infinity), l( t, r )
        }

        function t( e ) {
            return Object.prototype.toString.call( e )
        }

        function n( e ) {
            return typeof e == "object" && t( e ) === "[object Date]"
        }

        function r( e ) {
            return typeof e == "object" && t( e ) === "[object Array]"
        }

        function i( e ) {
            return typeof e == "object" && t( e ) === "[object RegExp]"
        }

        function s( e ) {
            var t = "";
            return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), t
        }

        return !Object.getOwnPropertyDescriptor || !Object.getPrototypeOf || !Object.create ? null : (e.clonePrototype = function ( t ) {
            if ( t === null )return null;
            var n = function () {
            };
            return n.prototype = t, new n
        }, e.__objToStr = t, e.__isDate = n, e.__isArray = r, e.__isRegExp = i, e.__getRegExpFlags = s, e)
    }();
    if ( e )return e;
    var n = Object.create;
    return typeof n != "function" && (n = function ( e ) {
        function t() {
        }

        return t.prototype = e, new t
    }), t
} ), function () {
    "use strict";
    function resolveDefs( e, t, n ) {
        return (typeof t == "string" ? t : t.toString()).replace( e.define || skip, function ( t, r, i, s ) {
            return r.indexOf( "def." ) === 0 && (r = r.substring( 4 )), r in n || (i === ":" ? (e.defineParams && s.replace( e.defineParams, function ( e, t, i ) {
                n[ r ] = { arg: t, text: i }
            } ), r in n || (n[ r ] = s)) : (new Function( "def", "def['" + r + "']=" + s ))( n )), ""
        } ).replace( e.use || skip, function ( t, r ) {
            e.useParams && (r = r.replace( e.useParams, function ( e, t, r, i ) {
                if ( n[ r ] && n[ r ].arg && i ) {
                    var s = (r + ":" + i).replace( /'|\\/g, "_" );
                    return n.__exp = n.__exp || {}, n.__exp[ s ] = n[ r ].text.replace( new RegExp( "(^|[^\\w$])" + n[ r ].arg + "([^\\w$])", "g" ), "$1" + i + "$2" ), t + "def.__exp['" + s + "']"
                }
            } ));
            var i = (new Function( "def", "return " + r ))( n );
            return i ? resolveDefs( e, i, n ) : i
        } )
    }

    function unescape( e ) {
        return e.replace( /\\('|\\)/g, "$1" ).replace( /[\r\t\n]/g, " " )
    }

    var doT = {
        version: "1.0.3",
        templateSettings: {
            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode: /\{\{!([\s\S]+?)\}\}/g,
            use: /\{\{#([\s\S]+?)\}\}/g,
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: "it",
            strip: !0,
            append: !0,
            selfcontained: !1,
            doNotSkipEncoded: !1
        },
        template: undefined,
        compile: undefined
    }, _globals;
    doT.encodeHTMLSource = function ( e ) {
        var t = {
            "&": "&#38;",
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "/": "&#47;"
        }, n = e ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function ( e ) {
            return e ? e.toString().replace( n, function ( e ) {
                return t[ e ] || e
            } ) : ""
        }
    }, _globals = function () {
        return this || (0, eval)( "this" )
    }(), typeof module != "undefined" && module.exports ? module.exports = doT : typeof define == "function" && define.amd ? define( "utils/doT", [], function () {
        return doT
    } ) : _globals.doT = doT;
    var startend = {
        append: { start: "'+(", end: ")+'", startencode: "'+encodeHTML(" },
        split: { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
    }, skip = /$^/;
    doT.template = function ( e, t, n ) {
        t = t || doT.templateSettings;
        var r = t.append ? startend.append : startend.split, i, s = 0, o, u = t.use || t.define ? resolveDefs( t, e, n || {} ) : e;
        u = ("var out='" + (t.strip ? u.replace( /(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " " ).replace( /\r|\n|\t|\/\*[\s\S]*?\*\//g, "" ) : u).replace( /'|\\/g, "\\$&" ).replace( t.interpolate || skip, function ( e, t ) {
            return r.start + unescape( t ) + r.end
        } ).replace( t.encode || skip, function ( e, t ) {
            return i = !0, r.startencode + unescape( t ) + r.end
        } ).replace( t.conditional || skip, function ( e, t, n ) {
            return t ? n ? "';}else if(" + unescape( n ) + "){out+='" : "';}else{out+='" : n ? "';if(" + unescape( n ) + "){out+='" : "';}out+='"
        } ).replace( t.iterate || skip, function ( e, t, n, r ) {
            return t ? (s += 1, o = r || "i" + s, t = unescape( t ), "';var arr" + s + "=" + t + ";if(arr" + s + "){var " + n + "," + o + "=-1,l" + s + "=arr" + s + ".length-1;while(" + o + "<l" + s + "){" + n + "=arr" + s + "[" + o + "+=1];out+='") : "';} } out+='"
        } ).replace( t.evaluate || skip, function ( e, t ) {
            return "';" + unescape( t ) + "out+='"
        } ) + "';return out;").replace( /\n/g, "\\n" ).replace( /\t/g, "\\t" ).replace( /\r/g, "\\r" ).replace( /(\s|;|\}|^|\{)out\+='';/g, "$1" ).replace( /\+''/g, "" ), i && (!t.selfcontained && _globals && !_globals._encodeHTML && (_globals._encodeHTML = doT.encodeHTMLSource( t.doNotSkipEncoded )), u = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" + doT.encodeHTMLSource.toString() + "(" + (t.doNotSkipEncoded || "") + "));" + u);
        try {
            return new Function( t.varname, u )
        } catch ( a ) {
            throw typeof console != "undefined" && console.log( "Could not create a template function: " + u ), a
        }
    }, doT.compile = function ( e, t ) {
        return doT.template( e, null, t )
    }
}(), function ( e ) {
    function n( e ) {
        this.e = e
    }

    function r( e, t ) {
        for ( var n in t )e[ n ] = t[ n ];
        return e
    }

    function i( e, t ) {
        for ( var n in t ) {
            if ( e.hasOwnProperty[ n ] )continue;
            e[ n ] = t[ n ]
        }
        return e
    }

    function s( t, n, r ) {
        return r = r || e, r.getComputedStyle ? r.getComputedStyle( t, null )[ n ] : t.currentStyle ? t.currentStyle[ n ] : ""
    }

    function o( n ) {
        n = n || e;
        var r = n.document.body.children, i = 0;
        return t.each( r, function ( e, t ) {
            var r = parseInt( s( t, "z-index", n ) ) || 0;
            i = i < r ? r : i
        } ), i
    }

    function u( e ) {
        return e.replace( /(^\s*)|(\s*$)/g, "" )
    }

    var t = {};
    t.dynamicLoad = {
        css: function ( t, n ) {
            if ( !t || t.length === 0 )throw new Error( 'argument "path" is required !' );
            n = n || e.document;
            var r = n.getElementsByTagName( "head" )[ 0 ], i = n.createElement( "link" );
            return i.href = t, i.rel = "stylesheet", i.type = "text/css", r.appendChild( i ), this
        }, js: function ( t, n ) {
            if ( !t || t.length === 0 )throw new Error( 'argument "path" is required !' );
            n = n || e.document;
            var r = n.getElementsByTagName( "head" )[ 0 ], i = n.createElement( "script" );
            return i.src = t, i.type = "text/javascript", r.appendChild( i ), this
        }
    }, t.each = function ( e, t ) {
        for ( var n = 0; n < e.length; n++ )t.call( e[ n ], n, e[ n ] )
    }, t.addEvent = function ( e, t, n ) {
        if ( e.addEventListener )e.addEventListener( t, n, !1 ); else {
            var r = {
                type: "click", originHandler: n, wrappedHandler: function () {
                    return n.call( e, event )
                }
            };
            e.__handlerProxy || (e.__handlerProxy = []), e.__handlerProxy.push( r ), e.attachEvent( "on" + t, r.wrappedHandler )
        }
    }, t.removeEvent = function ( e, t, n ) {
        if ( e.removeEventListener )e.removeEventListener( t, n, !1 ); else for ( var r = 0; r < e.__handlerProxy.length; r++ ) {
            var i = e.__handlerProxy[ r ];
            i.type === t && i.originHandler == n && (e.detachEvent( "on" + t, i.wrappedHandler || n ), e.__handlerProxy.splice( r, 1 ), r--, i.originHandler = null, i.wrappedHandler = null, i = null)
        }
    }, t.bind = function ( e, t, n ) {
        if ( !e )return;
        e.addEventListener ? e.addEventListener( t, n, !1 ) : e.attachEvent ? e.attachEvent( "on" + t, n ) : e[ "on" + t ] = n
    }, t.unbind = function ( e, t, n ) {
        e.removeEventListener ? e.removeEventListener( t, n, !1 ) : e.detachEvent ? e.detachEvent( "on" + t, n ) : e[ "on" + t ] = null
    }, t.classList = function ( e ) {
        return e.classList ? e.classList : new n( e )
    }, n.prototype.contains = function ( e ) {
        if ( e.length === 0 || e.indexOf( " " ) != -1 )throw new Error( "Invalid class name: '" + e + "'" );
        var t = this.e.className;
        return t ? t === e ? !0 : t.search( "\\b" + e + "\\b" ) != -1 : !1
    }, n.prototype.add = function ( e ) {
        if ( this.contains( e ) )return this;
        var t = this.e.className;
        return t && t[ t.length - 1 ] != " " && (e = " " + e), this.e.className += e, this
    }, n.prototype.remove = function ( e ) {
        if ( e.length === 0 || e.indexOf( " " ) != -1 )throw new Error( "Invalid class name: '" + e + "'" );
        var t = new RegExp( "\\b" + e + "\\b\\s*", "g" );
        return this.e.className = this.e.className.replace( t, "" ), this
    }, n.prototype.toggle = function ( e ) {
        return this.contains( e ) ? (this.remove( e ), this) : (this.add( e ), this)
    }, n.prototype.toString = function () {
        return this.e.className
    }, n.prototype.toArray = function () {
        return this.e.className.match( /\b\w+\b/ ) || []
    }, t.getElementsByClassName = function ( e, t, n ) {
        document.getElementsByClassName, t = t || document, n = n || "*";
        var r = [], i = n === "*" && t.all ? t.all : t.getElementsByTagName( n ), s = i.length;
        e = e.replace( /\-/g, "\\-" );
        var o = new RegExp( "(^|\\s)" + e + "(\\s|$)" );
        while ( --s >= 0 )o.test( i[ s ].className ) && r.push( i[ s ] );
        return r
    }, t.outerHTML = function ( e, t ) {
        var n = document.createElement( "div" );
        n.innerHTML = t;
        while ( n.firstChild ) {
            var r = n.firstChild;
            n.firstChild.nodeType == 1 && (r.style.cssText = e.style.cssText), e.parentNode.insertBefore( n.firstChild, e )
        }
        e.parentNode.removeChild( e )
    }, t.extend = r, t.merge = i, t.getComputedStyle = s, t.getMaxZindex = o, t.trim = u, typeof define == "function" && define.amd ? define( "utils/utils", [], function () {
        return t
    } ) : typeof module != "undefined" && module.exports ? module.exports = t : e.utils = t
}( window ), define( "ui/flow", [ "utils/doT", "utils/utils" ], function ( e, t ) {
    var n = {
        data: "", container: null, headings: [], init: function ( e ) {
            return t.extend( this, e ), this.headings.length || this.getHeadings(), this.render(), this
        }, render: function () {
            var e;
            return e = this.translateTemplate(), this.container.innerHTML = e, this
        }, getHeadings: function () {
            var e, t, n, r, i, s;
            s = this.headings, e = this.container.getElementsByTagName( "span" );
            for ( t = 0, n = e.length; t < n; t++ )r = e[ t ].getAttribute( "colId" ), i = e[ t ].innerHTML, s.push( {
                colId: r,
                colName: i
            } );
            return s
        }, getData: function () {
            var e, n, r, i, s, o, u, a;
            return e = this.headings, s = e[ 0 ].colId, r = [], n = { array: r }, t.each( this.data, function ( t, n ) {
                o = {}, i = n[ s ];
                for ( var f = 1, l = e.length; f < l; f++ )u = e[ f ].colId, a = e[ f ].colName, o[ a ] = n[ u ] || "";
                r.push( { title: i, data: o } )
            } ), n
        }, translateTemplate: function () {
            var t, n, r;
            return n = this.template.node, r = this.getData(), t = e.template( n )( r ), t
        }
    };
    return n.template = {}, n.template.container = '<div class="flow-container">${_data}</div>', n.template.node = '{{~it.array:value:index}}<div class="flow-node {{? index === 0 }}flow-node-start {{?}}{{? index % 3 === 2 && index !== it.array.length - 1 }}flow-corner {{?}}{{? index === it.array.length - 1 }}flow-node-end {{?}}{{? index % 6 === 3 || index % 6 === 4 || index % 6 === 5  }}flow-node-left {{?}}">    <div class="line"><b class="line-anchor"></b><b class="line-anchor-end"></b> </div>    <div class="desc mod">        <b class="left-top"></b> <b class="right-top"></b> <b class="left-bottom"></b> <b class="right-bottom"></b>        <div class="desc-body">            <h3 class="desc-heading">{{= value.title }}</h3>            <div class="desc-cont">            <table>            {{ for(var prop in value.data ) { }}            <tr> <td><b>：</b>{{= prop }}</td> <td>{{= value.data[prop] }}</td> </tr>            {{ } }}            </table>            </div>        </div>    </div></div>{{~}}<div class="clear"></div>    ', n
} ), define( "ui/overlay", [ "utils/utils" ], function ( e ) {
    function i( e ) {
        r( this, e ), this.win = this.win || top, this.idleTime = this.idleTime || 3e4
    }

    var t = e.classList, n = e.getMaxZindex, r = e.extend;
    return i.getInstance = function ( e ) {
        return new i( e )
    }, r( i.prototype, {
        init: function () {
            var e, t;
            return e = this.win.document, t = e.createElement( "div" ), t.className = "overlay-container", t.style.zIndex = n( this.win ) + 1, t.innerHTML = '<div class="overlay"></div>', e.body.appendChild( t ), this.container = t, this
        }, hide: function () {
            var e = this;
            return this.container || this.init(), t( this.container ).remove( "active" ), this.timerId = this.win.setTimeout( function () {
                e.destroy()
            }, this.idleTime ), this
        }, show: function () {
            return this.timerId && this.win.clearTimeout( this.timerId ), this.container || this.init(), t( this.container ).add( "active" ), this
        }, destroy: function () {
            return this.container || this.init(), this.win.document.body.removeChild( this.container ), this.container = null, this.timerId = null, this
        }
    } ), i
} );
var VERSION;
require.config( {
    urlArgs: "VERSION=" + (VERSION || (new Date).getTime()),
    paths: { jquery: "jquery/jquery-1.9.0", "jquery-private": "jquery/jquery-private" },
    map: { "*": { jquery: "jquery-private" }, "jquery-private": { jquery: "jquery" } },
    waitSeconds: 15
} );
var utils, ui;
utils = [], ui = [], define( [ "utils/domReady", "utils/clone", "utils/doT", "utils/utils", "ui/flow", "ui/overlay" ] );