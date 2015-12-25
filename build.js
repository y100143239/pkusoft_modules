({
    appDir: './dev/',
    baseUrl: './modules',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /(^_.*)|(scss)|(.*\.scss$)/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: 'jquery/jquery',
        flow: "ui/flow",
        overlay: "ui/overlay"
    },
    shim: {

    }
})