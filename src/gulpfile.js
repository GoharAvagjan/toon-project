//get modules
const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify-es").default;
const del = require("del");
const browserSync = require("browser-sync").create();
const imagemin  = require("gulp-imagemin");
const gcmq = require("gulp-group-css-media-queries");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");

//created path
const path = "./build";

// created all gulp function
//sass to css task

function preproc(){
    return gulp.src("./src/sass/style.css")
    .pipe(sass().on("error", sass.log(Error))
    .pipe(gcmq())
    .pipe(sourcemaps.init())
    .pipe(concat("styles.css"))
    .pipe(autoprefixer({
        browser :[">0.1%"],
        cascade: false
    }))
    .pipe(cleanCss({
        level: 2
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
}
 //style task

 function styles(){
     return gulp.src("./src/css/**/*.css")
     .pipe(gcmq())
     .pipe(sourcemaps.init())
     .pipe(autoprefixer({
         browser :['>0.1%'],
         cascade: false
     }))
     .pipe(cleanCss({
         level: 2
     }))
     .pipe(sourcemaps.write("."))
     .pipe(gulp.dest("./build/css"))
     .pipe(browserSync.stream());
 }

 //js witch babel
  function scripts(){
    return gulp.src("./src/css/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(babel({
        "presets": ["@babel/env"]
    }))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());
  }

  // img task

  function img(){
    return gulp.src("./img/**/*")
    .pipe(imagemin ())
    .pipe(imagemin ([
        imagemin.gifsicle({interlaced : true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
        		plugins: [
        			{removeViewBox: true},
        			{cleanupIDs: false}
        		]
        	})
    ]))
    .pipe(gulp.dest("./build/img"))
  }

  //delete build folder and all files in build folder

  function clean(){
    return del(["build/*"])
  }

  //fonts folder from src to build folder

  function fonts(){
    return gulp.src("./src/fonts/*")
    .pipe(gulp.dest("./build/fonts"))
  }

  function libs(){
      return gulp.src("./src/libs/*")
      .pipe(gulp.dest("./build/libs"))
    }

    //all html files from sre folder to build folder
    function html(){
        return gulp.src("./src/*.html")
        .pipe(gulp.dest("./build")
        .pipe(browserSync.stream());
    }

//created gulp tasks
    function watch(){
        browserSync.init({
            server: {
                baseDir: path
            },
            tunnel:true,
            online: true
        })
        gulp.watch("./src/libs/*", libs);
        gulp.watch("./src/js/**/*.js", scripts);
        gulp.watch("./src/js/**/*.sass", preproc);
        gulp.watch("./src/js/**/*.css", styles);
        gulp.watch("./src/*.html", html);
        gulp.watch("./*.html").on("change" browserSync.reload);
    }

    gulp.task("del", clean);
    gulp.task("html", html);
    gulp.task("sass", preproc);
    gulp.task("styles", styles);
    gulp.task("scripts", scripts);
    gulp.task("imagemin", imagemin);
    gulp.task("fonts", fonts);
    gulp.task("libs", libs);

    gulp.task("watch", watch);
    gulp.task("build", gulp.series(clean, gulp.parallel(html, preproc, styles, scripts, img, fonts, libs)));
    gulp.task("dev", gulp.series("build", "watch"));