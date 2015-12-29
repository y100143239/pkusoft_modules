#1.目录结构

	pkusoft_modules
		|
		|-- dev		// 开发 
		|	|			
		|	|-- modules
		|		|
		|		|-- require.js		
		|		|
		|		|-- utils
		|		|	|
		|		|	|-- domReady.js (类似jQuery.ready())
		|		|	|-- doT.js (模板引擎)	
		|		|	|-- sizzle.js (通过css选择器获取dom)
		|		|	|-- clone.js (用于对象克隆)
		|		|	|-- utils.js (常用工具库)
		|		|
		|		|-- jquery
		|		|	|
		|		|	|-- jquery.js
		|		|	|		
		|		|	|-- plugin (存放jQuery插件)
		|		|
		|		|-- ui (存放UI组件)
		|			|		
		|			|-- images (统一管理图片资源)
		|			|	|-- public
		|			|		
		|			|-- scss (采用scss编写css)
		|			|	|-- style.scss (管理所有组件的样式)
		|			|	|-- _flow.scss 
		|			|		
		|			|-- css
		|			|	|-- style.css
		|			|
		|			|-- flow.js (用于流程展示)
		|					
		|			
		|-- test 	// 测试
		|	|
		|	|-- flow			
		|		|-- test.html
		|
		|-- dist	// 发布
		|
		|-- Gruntfile.js
		|-- README.md


#2. 说明

##2.1 约定

##2.1.1 文件名

* 以“_”（下划线）开头的目录及文件为私有，不会被构建到dist目录

##2.1.2 变量名

* JavaScript
	* 私有变量以“\_”（下划线）开头，如 \_this 、\_global
	* 被jQuery包装的对象以“$”开头，如 $this = $(this) 

##2.1.3 css文件的引入

* 可使用\<link>标签来引入
* 可使用RequireJS按需载入css文件，参考<http://segmentfault.com/a/1190000002390643>

##2.2 避免浏览器缓存

* 方案
	1. 定义常量 VERSION，将被每个页面引用
	2. 开发环境：VERSION = (new Date()).getTime()
	3. 生产环境：VERSION = "v2.0"
	4. 以查询字符串的方式追加到请求URL
* 实现
	1. VERSION的定义及初始化将在 default.jsp进行
	2. 通过 RequireJS 将请求参数VERSION追加到所有URL

	
```
var VERSION; // VERSION = "v2.0";
require.config( {
	...
    urlArgs: "VERSION=" + ( VERSION || ( new Date() ).getTime() )
	...
} );

```

##2.3 RequireJS的使用

###2.3.1 配置

**详情请参考 test/main/test.html**

    /* -----------------------
     config
     -------------------------*/
    var VERSION; // VERSION = "v2.0";
    require.config( {
        // 给模块URL加版本号阻止浏览器缓存
        urlArgs: "VERSION=" + (VERSION || (new Date()).getTime()),
        // 将对 jquery-1.9.0 的引用映射到引用 jquery-private
        paths: {
            "jquery": 'jquery/jquery-1.9.0',
            "jquery-private": 'jquery/jquery-private'
        },
        map: {
            '*': { 'jquery': 'jquery-private' },
            'jquery-private': { 'jquery': 'jquery' }
        },
        // 超时
        waitSeconds: 15
    } );

* 对 require.js 的引入 以及配置信息 将放在公共文件进行静态导入


 
###2.3.2 jQuery及其插件

* 在不改变jQuery源码的情况下引入jQuery，并解除对全局变量“$”的占用
* 插件配置参考：<https://github.com/requirejs/example-jquery-shim>
 
```
// 1. 将对模块“jquery”的引用映射到 “jquery-private”
require.config( {
    paths: {
        "jquery": 'jquery/jquery-1.9.0',
        "jquery-private": 'jquery/jquery-private'
    },
    map: {
        '*': { 'jquery': 'jquery-private' },
        'jquery-private': { 'jquery': 'jquery' }
    }
} );

// 2. 定义 “jquery-private” 模块
define(['jquery'], function (jq) {
    return jq.noConflict( true );
});
```
 
   
```
// 插件配置
requirejs.config({    "baseUrl": "js/lib",    "paths": {      "app": "../app"    },    "shim": {        "jquery.alpha": ["jquery"],        "jquery.beta": ["jquery"]    }});
```

###2.3.3 main.js


* 作为入口文件
* 引入所有公共模块；当main.js被Optimizer优化后，可直接从main.js中引用模块


####定义
```
/* -----------------------
     引入所有模块
 -------------------------*/
define( [
// utils
    "utils/domReady",
    "utils/clone",
    "utils/doT",
    "utils/utils",
    //"utils/sizzle",

// ui
    "ui/flow",
    "ui/overlay"

] );

```

####引入及使用（表现在合并压缩后）


```
<link rel="stylesheet" href="../../dev/modules/ui/css/style.css"/>
<script data-main="../../dev/modules/main" src="../../dev/modules/require.js"></script>
<script>
    require(["main"],function(){
        var domReady = require("utils/domReady");
        var flow = require("ui/flow");
        domReady( function () {
            var data = [...];
            flow.init(...);
        });
    });
</script>    
```
 



#3 构建
 

##3.1 RequireJS Optimizer	
	
	
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
	    removeCombined: false,
	    paths: {
	        //jquery: 'jquery/jquery',
	        //flow: "ui/flow",
	        //overlay: "ui/overlay"
	    },
	    shim: {
	
	    }
	})


* main依赖的所有模块将被压缩合并到main.js，被合并的模块文件不被移除
* 不被main模块依赖的模块文件，将被压缩拷贝到dist目录
* css文件将被压缩拷贝到dist目录
* images目录被忽略	

	
##3.2 gruant插件
					
* 清理(可选)
* 压缩拷贝图片到dist

###Gruntfile.js
```
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        clean: {
            cleanoutput: {
                files: [{
                    src: 'dist/*'
                }]
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3 // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [
                    {
                        expand: true, // 开启动态扩展
                        cwd: "dev/modules/ui/images", // 当前工作路径
                        src: ["**/*.{png,jpg,gif}"], // 要出处理的文件格式(images下的所有png,jpg,gif)
                        dest: "dist/modules/ui/images" // 输出目录(直接覆盖原图)
                    }
                ]
            }
        }
    });

    // 加载插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');


    grunt.registerTask('prod', [
        //'clean',
        'imagemin' //图片压缩
    ]);

    // 默认被执行的任务列表。
    grunt.registerTask('default', [ 'prod']);
};
```

##3.3 dist目录
		|-- dist	// 发布
			|			
			|-- modules
				|
				|-- utils
				|	|
				|	|-- sizzle.js (通过css选择器获取dom)
				|
				|-- jquery
				|	|
				|	|-- jquery.js
				|	|		
				|	|-- plugin (存放jQuery插件)
				|	
		 		|-- ui (存放UI组件)
		 		|	|		
		 		|	|-- images (统一管理图片资源)
		 		|	|	|-- public
		 		|	|		
		 		|	|-- css
		 		|	|	|-- style.css
		 		|	|
				|
				|-- main.js
			
			
 
 				
#4. 前端框架

##4.1 内网

* 内网主要使用ExtJS制作后台管理界面

##4.2 外网

###4.2.1 概要

####1. 前台页面

##### jQuery（1.11.3） 

* 应用：DOM操作	
  
##### Bootstrap（v3）	

* 应用：页面制作
* IE8兼容：参考<http://www.mamicode.com/info-detail-503562.html>
* 好处：主流页面风格，有大量的在线网站样式可以借鉴；文档齐全

##### artDialog	

* 应用：弹框
* 官网：<http://lab.seaning.com/>
* 好处：灵活，使用广泛，一直在升级维护；样式可定制；开源，源码托管在GitHub

##### parsleyjs

* 应用：表单验证	 
* 官网：<http://parsleyjs.org/>
* 比较：verifyjs & parsleyjs & validatejs
* 好处：Google以及GitHub上排名均位列第一；文档齐全，开源。

****
**思考：前台页面是否也采用EasyUI，artDialog、parsleyjs是否应该采用？**
****
	
####2. 后台管理 

* jQuery（1.11.3） DOM操作 
* EasyUI	实现所有业务功能

####3. *单页复杂应用

* 参考：<http://www.zhihu.com/question/21170137> 
* Backbone
	* 兼容 IE6 - IE11  	
* AngularJS
	* 兼容 IE8+

###4.2.2 Boostrap

#### 引入Boostrap

	require.config( {
	    // 给模块URL加版本号阻止浏览器缓存
	    urlArgs: "VERSION=" + (VERSION || (new Date()).getTime()),
	    // 将对 jquery-1.9.0 的引用映射到引用 jquery-private
	    paths: {
	        "jquery": 'jquery/jquery-1.11.3',
	        "jquery-private": 'jquery/jquery-private'
	    },
	    map: {
	        '*': { 'jquery': 'jquery-private' },
	        'jquery-private': { 'jquery': 'jquery' }
	    },
	    // 非模块化的
	    "shim": {
	        "lib/bootstrap/js/bootstrap":["jquery"]
	    },
	    // 超时
	    waitSeconds: 15
	} );

###4.2.3 artDialog

