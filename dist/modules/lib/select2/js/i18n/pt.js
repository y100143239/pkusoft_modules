!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var a=jQuery.fn.select2.amd;return a.define("select2/i18n/pt",[],function(){return{errorLoading:function(){return"Os resultados não puderam ser carregados."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Por favor apague "+b+" ";return c+=1!=b?"caracteres":"carácter"},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Introduza "+b+" ou mais caracteres";return c},loadingMore:function(){return"A carregar mais resultados…"},maximumSelected:function(a){var b="Apenas pode seleccionar "+a.maximum+" ";return b+=1!=a.maximum?"itens":"item"},noResults:function(){return"Sem resultados"},searching:function(){return"A procurar…"}}}),{define:a.define,require:a.require}}();