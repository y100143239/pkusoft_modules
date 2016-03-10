
var whenReady = (function() { // This function returns the whenReady() function

    var funcs = []; // The functions to run when we get an event
    var ready = false; // Switches to true when the handler is triggered

    // The event handler invoked when the document becomes ready
    function handler(e) {

        // If we've already run once, just return
        if (ready) return;

        // If this was a readystatechange event where the state changed to
        // something other than "complete", then we're not ready yet
        if (e.type === "readystatechange" && document.readyState !== "complete")
            return;

        // Run all registered functions.
        // Note that we look up funcs.length each time, in case calling
        // one of these functions causes more functions to be registered.
        for(var i = 0; i < funcs.length; i++)
            funcs[i].call(document);

        // Now set the ready flag to true and forget the functions
        ready = true;
        funcs = null;
    }

    // Register the handler for any event we might receive
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }
    // Return the whenReady function
    return function whenReady(f) {
        if (ready) f.call(document); // If already ready, just run it
        else funcs.push(f); // Otherwise, queue it for later.
    };

}());

whenReady( function(){

    var doc,
        body,
        bodyChilds,
        category,
        content,
        contentChilds,
        headingRegex
        ;

    doc = document;
    body = doc.body;

    category = doc.createElement( "div" );
    content = doc.createElement( "div" );
    category.id = "category";
    content.id = "content";

    bodyChilds = body.childNodes;

    for ( var len = bodyChilds.length, i = len - 1; i > -1; i-- ) {
        var firstChild = content.childNodes[0];
        content.insertBefore( bodyChilds[ i ], firstChild );
    }

    body.appendChild( category );
    body.appendChild( content );


    // 2. 生成目录
    contentChilds = content.childNodes;
    headingRegex = /^h[1-6]$/;

    for ( i = 0, len = contentChilds.length; i < len; i++ ) {
        var child,
            nodeType,
            nodeName,
            text,
            id,
            newHeading
            ;
        child = contentChilds[ i ];
        nodeType = child.nodeType;

        // 1. 跳过非元素节点
        if ( child.nodeType !== 1 ) {
            continue;
        }

        // 2. 判断 tag
        nodeName = child.nodeName.toLowerCase();

        if ( ! headingRegex.test( nodeName ) ) {
            continue;
        }

        text = child.innerHTML;
        id = child.id;

        newHeading = doc.createElement( "div" );
        newHeading.innerHTML = "<a href='#"+ id +"' class='heading-" + nodeName + "'>" + text + "</a>";

        category.appendChild( newHeading );
    }

} );
