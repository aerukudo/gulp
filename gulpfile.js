const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const sassGlob = require("gulp-sass-glob");
const uglify = require("gulp-uglify");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
//相対パス定義
const paths = {
    src: {
        scss: "src/scss/**/*.scss",
        pug: "src/pug/**/*.pug"
    },
    public: {
        css: "public/assets/css/",
        html: "public/"
    }
};
//画像圧縮
const imageminOption = [
    imageminPngquant({ quality: [0.65, 0.8] }),
    imagemin.gifsicle(),
    imagemin.jpegtran(),
    imagemin.optipng(),
    imagemin.svgo()
];
//setting : Pug Options
const pugOptions = {
    pretty: true
};
// pugコンパイル
gulp.task("pug", () => {
    return gulp
        .src([paths.src.pug, "!" + "src/pug/**/_*.pug"])
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            })
        )
        .pipe(pug(pugOptions))
        .pipe(gulp.dest(paths.public.html));
});
//sassコンパイル+プレフィックス+cssminify+ソースマップ
gulp.task("sass", done => {
    gulp.src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "expanded"
            }).on("error", sass.logError)
        )
        .pipe(sassGlob())
        .pipe(
            autoprefixer({
                // browsers: ['last 2 versions'],
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public.css))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: ".min"
            })
        )
        .pipe(gulp.dest(paths.public.css));
    done();
});
//画像圧縮
gulp.task("imagemin", () => {
    return gulp
        .src("src/img/*")
        .pipe(imagemin(imageminOption))
        .pipe(gulp.dest("public/assets/images/"));
});
//js minify
gulp.task("js-minify", function() {
    return gulp
        .src(["src/js/**/*.js", "!src/js/**/*.min.js"])
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest("public/assets/js/"));
});
//Watch
gulp.task("dev", () => {
    gulp.watch(paths.src.scss, gulp.task("sass"));
    gulp.watch(paths.src.pug, gulp.task("pug")); // pugディレクトリ以下の.pugファイルの更新を監視
});
