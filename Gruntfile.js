module.exports = function(grunt) {

    var defaultConfig,
        bafwConfig
        ;

    defaultConfig = {
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

    };

    bafwConfig = {
        clean: {
            cleanoutput: {
                files: [{
                    src: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/modules/'
                }]
            }
        },
        copy: {
            modules: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/modules',
                        src: '**',
                        dest: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/modules/'
                    }
                ]
            },
            app: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/apps/bafw',
                        src: ["css/**","images/*.{png,jpg,gif}","js/main.js"],
                        dest: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/web/'
                    }
                ]
            }
            ,
            htmls: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/apps/bafw',
                        src: ["index.html"],
                        dest: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/web/'
                    }
                ]
            },
            scripts: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/apps/bafw',
                        src: ["js/main.js"],
                        dest: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/web/'
                    }
                ]
            },
            styles: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/apps/bafw',
                        src: ["css/style.css"],
                        dest: '/Users/forwardNow/develop/workspace/gdbaweb/WebRoot/static/web/'
                    }
                ]
            }
        },
        watch: {
            htmls: {
                files: ['dev/apps/bafw/index.html'],
                tasks: ['copy:htmls']
            },
            scripts: {
                files: ['dev/apps/bafw/js/main.js'],
                tasks: ['copy:scripts']
            },
            styles: {
                files: ['dev/apps/bafw/css/style.css'],
                tasks: ['copy:styles']
            }
        }
    };

    // Project configuration.
    grunt.initConfig(bafwConfig);

    // 加载插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');


    //grunt.registerTask('prod', [ /*'clean', 'copy:modules',*/ 'copy:app' ] );

    // 默认被执行的任务列表。
    //grunt.registerTask('default', [ 'prod']);
};