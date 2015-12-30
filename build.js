({
    // $ cd develop/work/pkusoft/pkusoft_modules/
    // $ node r.js -o build.js
    appDir: './dev/modules',
    baseUrl: '.',
    dir: './dist/modules',
    modules: [
        { name: 'main_outer' }
        //{ name: "main" }

    ],
    fileExclusionRegExp: /(^_.*)|(scss)|(images)(.*\.map$)/,
    optimizeCss: 'standard',
    removeCombined: false,
    paths: {
        "jquery": 'jquery/jquery-1.11.3',
        "jquery-private": 'jquery/jquery-private'
    },
    map: {
        '*': { 'jquery': 'jquery-private',
            'css': 'utils/css/css'
        },
        'jquery-private': { 'jquery': 'jquery' }
    },
    // 非模块化的
    "shim": {
        "lib/bootstrap/js/bootstrap":["jquery"]
    }
})
