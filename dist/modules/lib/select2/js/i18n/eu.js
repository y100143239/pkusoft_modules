!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var a=jQuery.fn.select2.amd;return a.define("select2/i18n/eu",[],function(){return{inputTooLong:function(a){var b=a.input.length-a.maximum,c="Idatzi ";return c+=1==b?"karaktere bat":b+" karaktere",c+=" gutxiago"},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Idatzi ";return c+=1==b?"karaktere bat":b+" karaktere",c+=" gehiago"},loadingMore:function(){return"Emaitza gehiago kargatzen…"},maximumSelected:function(a){return 1===a.maximum?"Elementu bakarra hauta dezakezu":a.maximum+" elementu hauta ditzakezu soilik"},noResults:function(){return"Ez da bat datorrenik aurkitu"},searching:function(){return"Bilatzen…"}}}),{define:a.define,require:a.require}}();