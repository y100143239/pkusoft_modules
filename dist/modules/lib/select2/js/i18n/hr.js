!function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var a=jQuery.fn.select2.amd;return a.define("select2/i18n/hr",[],function(){function a(a){var b=" "+a+" znak";return a%10<5&&a%10>0&&(a%100<5||a%100>19)?a%10>1&&(b+="a"):b+="ova",b}return{errorLoading:function(){return"Preuzimanje nije uspjelo."},inputTooLong:function(b){var c=b.input.length-b.maximum;return"Unesite "+a(c)},inputTooShort:function(b){var c=b.minimum-b.input.length;return"Unesite još "+a(c)},loadingMore:function(){return"Učitavanje rezultata…"},maximumSelected:function(a){return"Maksimalan broj odabranih stavki je "+a.maximum},noResults:function(){return"Nema rezultata"},searching:function(){return"Pretraga…"}}}),{define:a.define,require:a.require}}();