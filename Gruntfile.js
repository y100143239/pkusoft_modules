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
                    { src: 'dist/temp' }
                ]
            },
            dist_zfjd_image: {
                files: [
                    { src: 'dist/apps/zfjd/images/index' },
                    { src: 'dist/apps/zfjd/images/login' }
                ]
            },
            dist_agxt_image: {
                files: [
                    { src: 'dist/apps/agxt/images/login' },
                    { src: 'dist/apps/agxt/images/index' }
                ]
            },
            dist_all_scss: {
                files: [
                    { src: 'dist/**/*.scss' }
                ]
            }
        },
        // 2. 拷贝
        copy: {
            app: {
                files: [
                    { // plugin
                        cwd: 'dev/',
                        src: ['plugin/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app
                        cwd: 'dev/',
                        src: ['apps/framework/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - zfjd
                        cwd: 'dev/',
                        src: ['apps/zfjd/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - axure
                        cwd: 'dev/',
                        src: ['apps/axure/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - admin
                        cwd: 'dev/',
                        src: ['apps/admin/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - bs
                        cwd: 'dev/',
                        src: ['apps/bs/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - zfjd
                        cwd: 'dev/',
                        src: ['apps/agxt/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - summary
                        cwd: 'dev/',
                        src: ['apps/summary/**'],
                        dest: 'dist',
                        expand: true
                    },
                    { // app - read
                        cwd: 'dev/',
                        src: ['apps/read/**'],
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
                        src: [
                            'jquery/jquery-1.11.3.js',
                            'jquery/jQuery.XDomainRequest.js',
                            'jquery/jQuery.ajaxQueue.js'
                        ],
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
                                'lib/select2/**',
                                'lib/webuploader/**',
                                'lib/colresizable/**',
                                'lib/bootgrid/**',
                                'lib/select-area/**',
                                'lib/sweetalert/**',
                                'lib/custom/**',
                                'lib/codemirror/**',
                                'lib/layer/**',
                                'lib/pretty/**'
                        ],
                        dest: 'dist/modules',
                        expand: true
                    },
                    { // modules - ui
                        cwd: 'dev/modules',
                        src: [
                            'ui/css/*.css',
                            'ui/fonts/**'
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
                            'utils/dataSource.js',
                            //'utils/jquery.sortable.js',
                            'utils/draggable.js'
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
            copyDistTo_bae: {
                command: [
                    // 1. 切换到 _bae 目录
                    'cd /Users/forwardNow/develop/work/_bae',
                    // 2. 删除 dev目录
                    'rm  -Rf ./static/dev/*',
                    // 3.1 将webstorm的/dist目录拷贝到 _bae/static/dev
                    'cp -R /Users/forwardNow/develop/work/pkusoft/pkusoft_modules/dist/* ./static/dev/'
                ].join('&&')
            },
            copyCsdnTo_bae: {
                command: [
                    // 1. 切换到 _bae 目录
                    'cd /Users/forwardNow/develop/work/_bae',
                    // 2. 删除 csdn目录
                    'rm  -Rf ./static/csdn',
                    // 将webstorm的/csdn目录拷贝到 _bae/static/csdn
                    'cp -R /Users/forwardNow/develop/work/pkusoft/pkusoft_modules/csdn ./static/'
                ].join('&&')
            },
            copyDistToEclipse: {
                command: [
                    // 删除 dev目录 下的内容
                    'rm  -Rf /Users/forwardNow/develop/workspace/_bae/WebContent/static/dev/*',
                    // 3.2 将webstorm的/dist目录拷贝到 Eclipse
                    'cp -R /Users/forwardNow/develop/work/pkusoft/pkusoft_modules/dist/* /Users/forwardNow/develop/workspace/_bae/WebContent/static/dev/'
                ].join('&&')
            },
            copyWebInfoTo_bae: {
                command: [
                    // 4. 删除  _bae/WEB-INF 下的 classes和lib
                    //'rm -Rf ./WEB-INF/classes ./WEB-INF/lib',
                    // 删除 临时_bae 的 WEB-INF
                    'rm -Rf /Users/forwardNow/develop/work/_bae/WEB-INF',

                    // 5. 将 tomcat/webapps/_bae/WEB-INF/ 文件 拷贝到 _bae/WEB-INF
                    'cp -R /Users/forwardNow/develop/work/tomcat/webapps/_bae/WEB-INF /Users/forwardNow/develop/work/_bae/'
                ].join('&&')
            },
            makeWar: {
                command: [
                    // 删除 bae 里的war包
                    'rm /Users/forwardNow/develop/work/bae/ROOT.war',
                    // 将 临时_bae 打成war包
                    'cd /Users/forwardNow/develop/work/_bae/',
                    'jar -cf ../bae/ROOT.war ./*',
                    // 切换到 bae 目录，push到 BAE
                    'cd /Users/forwardNow/develop/work/bae',
                    'git commit --all -m "auto"',
                    'git push origin master',
                    'git status'
                ].join('&&')
            },
            commitOweb: {
                command: [
                    // 6. 对于github
                    // 6.1 删除 /Users/forwardNow/git/oweb/src
                    'rm  -Rf /Users/forwardNow/git/oweb/src',
                    // 6.2 删除 /Users/forwardNow/git/oweb/WebContent
                    'rm  -Rf /Users/forwardNow/git/oweb/WebContent',
                    // 6.3 拷贝 /Users/forwardNow/develop/workspace/_bae/src 到  /Users/forwardNow/git/oweb/
                    'cp -R /Users/forwardNow/develop/workspace/_bae/src /Users/forwardNow/git/oweb/',
                    // 6.4 拷贝 /Users/forwardNow/develop/workspace/_bae/WebContent 到  /Users/forwardNow/git/oweb/
                    'cp -R /Users/forwardNow/develop/workspace/_bae/WebContent /Users/forwardNow/git/oweb/',
                    // 6.5 切换目录，提交到github
                    'cd /Users/forwardNow/git/oweb',
                    'git add --all',
                    'git commit --all -m "auto commit by grunt"',
                    //'git push origin master',
                    'git status'
                ].join('&&')
            },
            pushOwebToGithub: {
                command: [
                    'cd /Users/forwardNow/git/oweb',
                    'git status',
                    'git push origin master',
                    'git status'
                ].join('&&')
            },
            clearGitRepo: {
                command: [
                    'cd /Users/forwardNow/develop/work/bae',
                    "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.war' --prune-empty --tag-name-filter cat -- --all",
                    'rm -rf .git/refs/original/',
                    'git reflog expire --expire=now --all',
                    'git gc --prune=now',
                    'git gc --aggressive --prune=now',
                    'cd /Users/forwardNow/develop/work/_bae/',
                    'jar -cf ../bae/ROOT.war ./*',
                    'cd /Users/forwardNow/develop/work/bae',
                    'git add --all',
                    'git commit --all -m "auto"',
                    'git push origin master --force',
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
        'clean:dist_zfjd_image', // 删除zfjd的 css sprite 中间文件
        'copy:modules', // 拷贝工具包
        'clean:dist_all_scss',

        //'uglify:buildall', // 压缩js到临时目录
        //'cssmin:buildall', // 压缩css到临时目录
        //'copy:minfile', // 拷贝压缩文件到dis目录覆盖掉原始文件

        'clean:temp', // 清理temp目录

        //'shell:multiple' // 执行shell命令，发布到bae
        'shell:copyDistTo_bae',
        'shell:copyCsdnTo_bae',
        'shell:copyDistToEclipse',
        'shell:copyWebInfoTo_bae',
        'shell:makeWar',
        'shell:commitOweb'
        //'shell:pushOwebToGithub'
    ] );

    // 默认被执行的任务列表。
    //grunt.registerTask('default', [ 'framework']);
};