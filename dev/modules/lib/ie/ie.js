define(
    (function(){
        var b = document.createElement("b");
        b.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
        return b.getElementsByTagName("i" ).length === 1;
    }())
    ?
    ["lib/ie/html5shiv","lib/ie/respond"]
    :
    ["require"]
);

