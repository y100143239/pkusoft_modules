window.onload = function(){

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


};
