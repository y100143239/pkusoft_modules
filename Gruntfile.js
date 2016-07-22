module.exports = function(grunt) {

    var frameworkConfig
        ;

    frameworkConfig = {
        // 1. 清空 dist 目录
        clean: {
            dist: {
                files: [
                    { src: 'dist/*' }
                ]
            },
            temp: {
                files: [
                    { src: 'dist/temp' },
                ]
            }
        },
        // 2. 拷贝
        copy: {
            app: {
                files: [
                    { // app
                        cwd: 'dev/',
                        src: ['apps/framework/**'],
                        dest: 'dist',
                        expand: true
                    }

                ]
            },
            modules: {
                files: [
                    { // modules - require.js
                        cwd: 'dev/modules',
                        src: ['require.js'],
                        dest: 'dist/modules',
                        expand: true
                    },
                    { // modules - jquery
                        cwd: 'dev/modules',
                        src: ['jquery/jquery-1.11.3.js'],
                        dest: 'dist/modules',
                        expand: true
                    },
                    { // modules - lib
                        cwd: 'dev/modules',
                        src: [
                                'lib/bootstrap/**',
                                'lib/datepicker/**',
                                'lib/echart/**',
                                'lib/formvalidate/**',
                                'lib/ie/**',
                                'lib/pretty/**',
                                'lib/select2/**'
                        ],
                        dest: 'dist/modules',
                        expand: true
                    },
                    { // modules - ui
                        cwd: 'dev/modules',
                        src: [
                            'ui/css/*.css',
                            'ui/fonts/**',
                        ],
                        dest: 'dist/modules',
                        expand: true
                    },
                    { // modules - utils
                        cwd: 'dev/modules',
                        src: [
                            'utils/css/**',
                            'utils/doT.js',
                            'utils/text.js',
                        ],
                        dest: 'dist/modules',
                        expand: true
                    }

                ]
            },
            minfile: {
                files: [
                    {
                        cwd: 'dist/temp',
                        src: ['**'],
                        dest: 'dist/modules',
                        expand: true
                    }

                ]
            },
            _bae: {
                files: [
                    {
                        cwd: 'dist/',
                        src: ['**'],
                        dest: '/Users/forwardNow/develop/work/_bae/dev',
                        expand: true
                    }

                ]
            }
        },

        // 3. 压缩JS（参考：http://www.cnblogs.com/artwl/p/3449303.html）
        uglify: {
            buildall: {//按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand:true,
                    cwd:'dist/modules',//dist目录下
                    src:'**/*.js',//所有js文件
                    dest: 'dist/temp'//输出到此目录下
                }]
            }
        },

        // 4. 压缩css
        cssmin: {
            buildall: {
                files: [{
                    expand:true,
                    cwd:'dist/modules',//dist目录下
                    src:'**/*.css',//所有js文件
                    dest: 'dist/temp'//输出到此目录下
                }]
            }
        },

        // 5. shell
        shell: {
            multiple: {
                command: [
                    'cd /Users/forwardNow/develop/work/_bae',
                    'rm  -R ./dev/*',
                    'rm ../bae/ROOT.war',
                    'cp -R /Users/forwardNow/develop/work/pkusoft/pkusoft_modules/dist/* ./dev/',
                    'jar -cvf ../bae/ROOT.war ./*',
                    'cd ../bae',
                    'git commit --all -m "auto"',
                    'git push origin master',
                    'git status'
                ].join('&&')
            }
        }
    };


    // Project configuration.
    grunt.initConfig(frameworkConfig);

    // 加载插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('framework', [
        'clean:dist', // 清理
        'copy:app', // 拷贝app
        'copy:modules', // 拷贝工具包
        'uglify:buildall', // 压缩js到临时目录
        'cssmin:buildall', // 压缩css到临时目录
        'copy:minfile', // 拷贝压缩文件到dis目录覆盖掉原始文件
        'clean:temp', // 清理temp目录
        'shell:multiple' // 执行shell命令，发布到bae
    ] );

    // 默认被执行的任务列表。
    //grunt.registerTask('default', [ 'framework']);
};