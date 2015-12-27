({
    // $ cd develop/work/pkusoft/pkusoft_modules/
    // $ node r.js -o build.js
    appDir: './dev/',
    baseUrl: './modules',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /(^_.*)|(scss)|(.*\.scss$)|(.*\.map$)|(images)/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        //jquery: 'jquery/jquery',
        //flow: "ui/flow",
        //overlay: "ui/overlay"
    },
    shim: {

    }
})
