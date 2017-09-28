var gulp = require('gulp'),
    rename=require('gulp-rename'),
    uglify=require('gulp-uglify'),
    less=require('gulp-less'),
    concat=require('gulp-concat'),
    minifycss=require('gulp-clean-css'),
    //这个插件使得即使less有错误也不会停止watch
    plumber=require('gulp-plumber'),
    notify=require('gulp-notify');

// 同步刷新浏览器
var browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// 定义需编译的资源路径
var PATH_DEV_JS='./js/**.js',
    PATH_DEV_LESS=["./css/**.less","./css/reset.css"],
    PATH_PUB_BUILD='./build';

gulp.task('less打包压缩',function(){
    var stream=gulp.src(PATH_DEV_LESS)
        .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(minifycss())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(PATH_PUB_BUILD))
        .pipe(reload({stream : true}))
        .pipe(notify('less打包、压缩完成~ O(∩_∩)O'));
    return stream;
});

gulp.task('js合并压缩',function(){
    var stream=gulp.src(PATH_DEV_JS)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(PATH_PUB_BUILD))
        .pipe(reload({stream : true}))
        .pipe(notify('js压缩完成'));
    return stream;
});

gulp.task('defualt',['less打包压缩','js合并压缩'],function(){
     ({
        server:"./",
        port : 9007,
        browser : "chrome"
    });
    gulp.watch(PATH_DEV_LESS,['less打包压缩']);
    gulp.watch(PATH_DEV_JS,function(){
        gulp.run('js合并压缩');
    });
    gulp.watch(["./*.html"]).on('change',reload);
});
