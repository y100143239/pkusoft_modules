!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var a=jQuery.fn.select2.amd;return a.define("select2/i18n/is",[],function(){return{inputTooLong:function(a){var b=a.input.length-a.maximum,c="Vinsamlegast styttið texta um "+b+" staf";return b<=1?c:c+"i"},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Vinsamlegast skrifið "+b+" staf";return b>1&&(c+="i"),c+=" í viðbót"},loadingMore:function(){return"Sæki fleiri niðurstöður…"},maximumSelected:function(a){return"Þú getur aðeins valið "+a.maximum+" atriði"},noResults:function(){return"Ekkert fannst"},searching:function(){return"Leita…"}}}),{define:a.define,require:a.require}}();