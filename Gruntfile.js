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
        'clean',
        'imagemin' //图片压缩
    ]);

    // 默认被执行的任务列表。
    grunt.registerTask('default', [ 'prod']);
};