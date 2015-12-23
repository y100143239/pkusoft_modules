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
		|		|
		|		|-- flow			
		|			|-- test.html
		|
		|-- dist	// 发布
		|
		|-- Gruntfile.js
		|-- README.md


#2. 说明

1. 以“_”（下划线）开头的目录及文件为私有
2. 采用模块化开发，热拔插式的组件以及库的引用