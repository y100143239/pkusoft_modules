seajs.config( {

// 别名配置
    alias: {
        //'es5-safe': 'gallery/es5-safe/0.9.3/es5-safe',
        //'json': 'gallery/json/1.0.2/json',
        'jquery': 'lib/jquery/1.11.3.x/jquery',
        "swiper": "lib/swiper/2.7.6/swiper"

    },

// 路径配置
    paths: {
        //'pkui': '../../pkui'
    },

// 变量配置
    vars: {
        //'locale': 'zh-cn'
    },

// 映射配置
    map: [
        // [ 'http://example.com/js/app/', 'http://localhost/js/app/' ]
    ],

// 预加载项
    preload: [
        "jquery"
        // Function.prototype.bind ? '' : 'es5-safe',
        // this.JSON ? '' : 'json'
    ],

// 调试模式
    debug: true,

// Sea.js 的基础路径
    base: '../../pkui',

// 文件编码
    charset: 'utf-8'
} );