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

##2.1 命名

##2.1.1 文件名

* 以“_”（下划线）开头的目录及文件为私有，不会被构建到dist目录

##2.1.2 变量名

* JavaScript
	* 私有变量以“\_”（下划线）开头，如 \_this 、\_global
	* 被jQuery包装的对象以“$”开头，如 $this = $(this) 

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

###2.3.1 引入jQuery

**在不改变jQuery源码的情况下，引入jQuery，并解除对全局变量“$”的占用**
 
 
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

###2.3.2 main.js

* 作为入口文件
* 对RequireJS进行配置
* 引入所有公共模块；当main.js被Optimizer优化后，可直接从main.js中引用模块


####定义
```
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


/* -----------------------
     引入所有模块
 -------------------------*/
(function(){

    var utils,
        ui
        ;

    utils = [
        "utils/domReady",
        "utils/clone",
        "utils/doT",
        "utils/utils"
        //"utils/sizzle",
    ];
    ui = [
        "ui/flow",
        "ui/overlay"
    ];

    define( utils.concat( ui ) );
})();
```

####引入及使用
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
	
	dev
		|-- modules
		|		|-- ui (存放UI组件)
		|			|		
		|			|-- images (统一管理图片资源)
		|			|	|-- public
		|			|		
		|			|-- css
		|			|	|-- style.css
		|			|
		|
		|		|-- main.js 

* 对main模块进行优化，main依赖的所有模块将被压缩合并到main.js
* 不被main模块依赖的模块文件，将被压缩拷贝到dist目录
* css文件将被压缩拷贝到dist目录
* images目录被忽略	

	
##3.2 gruant插件
					
* 清理
* 压缩拷贝图片到dist


##3.3 dist目录
		|-- dist	// 发布
			|			
			|-- modules
				|
				|-- utils
				|	|
				|	|-- domReady.js (类似jQuery.ready())
				|	|-- doT.js (模板引擎)	
				|	|-- sizzle.js (通过css选择器获取dom)
				|	|-- clone.js (用于对象克隆)
				|	|-- utils.js (常用工具库)
				|
				|-- jquery
				|	|
				|	|-- jquery.js
				|	|		
				|	|-- plugin (存放jQuery插件)
				|	
		 		|-- ui (存放UI组件)
		 			|		
		 			|-- images (统一管理图片资源)
		 			|	|-- public
		 			|		
		 			|-- css
		 			|	|-- style.css
		 			|
					|-- ui.js		
				