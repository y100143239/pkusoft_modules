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

##2.1 文件名

* 以“_”（下划线）开头的目录及文件为私有

##2.2 避免浏览器缓存

* 方案
	1. 定义常量 VERSION，将被每个页面引用
	2. 开发环境：VERSION = (new Date()).getTime()
	3. 生成环境：VERSION = "v2.0"
	4. 以查询字符串的方式追加到请求URL
* 实现
	1. VERSION的定义及初始化将在 default.jsp进行
	2. 通过 RequireJS 将请求参数VERSION追加到所有URL

	
```
<!--~~~~~~~~~~ 置入 default.jsp 的部分 ~~~~~~~~~~-->

<link rel="stylesheet" href="../dev/modules/ui/css/style.css"/>
<script data-main="../dev/modules/" src="../dev/modules/require.js"></script>
<script>
    var VERSION; // VERSION = "v2.0";
    require.config( {
        urlArgs: "VERSION=" + VERSION || (new Date()).getTime(),
        waitSeconds: 15
    } );
</script>

<!--/~~~~~~~~~~ 置入 default.jsp 的部分 ~~~~~~~~~-->
```


#3 构建

##3.1 模块

###3.1.1 自定义模块	
	
	dev
		|-- modules
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

* 使用 RequireJS Optimizer 进行压缩合并		
* 用scss编写并维护所有样式，编译到 css/style.css文件	

	
###3.1.2 第三方模块
		|-- dev
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
					|
					|-- jquery.js
					|		
					|-- plugin (存放jQuery插件)
					
* 使用Grunt插件进行压缩		


##3.2 dist
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
				