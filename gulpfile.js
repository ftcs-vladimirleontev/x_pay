/****************************************************/
/* declaration of variables */
/****************************************************/
const inputDir = 'src',
			outputDir = 'distr';

/* *************** 				ЭТИ ЗНАЧЕНИЯ МОЖНО ИЗМЕНЯТЬ 					*************** */
/* **************************************************************************** */
/*																																							*/
/* 		!!!!!_____для разработки держи этот параметр со значением true_____!!!!!	*/
let isDev = true;
/*																																							*/
/*							!!!!!_____ для добавления новых css _____!!!!!									*/
const cssFiles = [
	`${inputDir}/css/styles.css`,
	`${inputDir}/css/header.css`,
	`${inputDir}/css/exchanger.css`,
	`${inputDir}/css/modal.css`,
	`${inputDir}/css/media.css`,
	`${inputDir}/css/exchanger-media.css`,
	`${inputDir}/css/exchanger-service-class.css`,
];
/* *************** 				А ВСЕ ЧТО НИЖЕ ИЗМЕНЯТЬ НЕЛЬЗЯ			  *************** */
/* **************************************************************************** */
let isProd = ! isDev;
/****************************************************/
/* GULP */
/****************************************************/
const gulp = require('gulp'),
			/* HTML */
			fileinclude = require('gulp-file-include'),

			/* CSS */
			autoprefixer = require('gulp-autoprefixer'),
			cssmin = require('gulp-minify-css'),
			sourcemaps = require('gulp-sourcemaps'),

			/* JS */
			gulpWebpack = require('webpack-stream'),

			/* image */
			imagemin = require('gulp-imagemin'),

			/* watch */
			browserSync = require('browser-sync').create(),

			/* Common */
			concat = require('gulp-concat'),
			gulpRename = require('gulp-rename'),
			newer = require('gulp-newer'),
			gulpRemember = require('gulp-remember'),
			absolutPath =  require('path'),
			gulpif = require('gulp-if'),
			del = require('del')
;

/****************************************************/
/* WEBPACK */
/****************************************************/
let webpackConfig = {
	output: {
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}
		]
	},
	mode: (isDev) ? 'development' : 'production',
	devtool: (isDev) ? 'eval-sourse-map' : 'none'
};
/****************************************************/
/* html */
/****************************************************/
// покурить тему замены только измененных файлов
gulp.task('clear:html', function() {
	return del(`${outputDir}/index.html`)
});
gulp.task('create:html', function() {
	return gulp
		.src(`${inputDir}/*.html`)
    .pipe(fileinclude({
        prefix: "@@",
        basepath: `${inputDir}/html_modules/`
    }))
    .pipe(gulp.dest(`${outputDir}/`))
});
gulp.task('build:html', gulp.series('clear:html', 'create:html'));
/****************************************************/
/* css */
/****************************************************/
// gulp.task('build:css', function() {
// 	return gulp
// 		.src(cssFiles, {since: gulp.lastRun('build:css')})
// 		.pipe(autoprefixer())
// 		.pipe(gulpRemember('build:css'))
// 		.pipe(concat('styles.css'))
// 		.pipe(cssmin())
// 		.pipe(gulp.dest("distr/css"))
// });
// ...покурить тему замены только измененных файлов и remember...
gulp.task('clear:css', function() {
	return del(`${outputDir}/css`)
});
gulp.task('create:css', function() {
	return gulp
		.src(cssFiles)
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(autoprefixer())
		.pipe(concat('styles.css'))
		.pipe(gulpif(isProd, cssmin()))
		.pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(`${outputDir}/css`))
    .pipe(browserSync.stream());
});
gulp.task('build:css', gulp.series('clear:css', 'create:css'));
/****************************************************/
/* js */
/****************************************************/
gulp.task('clear:js', function() {
	return del(`${outputDir}/js`)
});
gulp.task('create:js', function() {
	return gulp
		.src(`${inputDir}/js/index.js`)
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(gulpWebpack(webpackConfig))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(gulp.dest(`${outputDir}/js`))
		.pipe(browserSync.stream());
});
gulp.task('build:js', gulp.series('clear:js', 'create:js'));
/****************************************************/
/* image */
/****************************************************/
gulp.task('clear:img', function() {
	return del(`${outputDir}/img`)
});

gulp.task('create:img-min', (done) => {
  gulp.src("src/img/**/*.*")
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
					plugins: [
							{removeViewBox: true},
							{cleanupIDs: false}
					]
			})
		]))
    .pipe(gulp.dest(`${outputDir}/img`));
  done();
});
// ...покурить тему замены только измененных файлов...
// ...покурить тему удаленных и вновь созданных файлов...
// ...покурить тему минификации...


gulp.task('create:img', function() {
	return gulp
		.src(`${inputDir}/img/**/*.*`)
		.pipe(gulp.dest(`${outputDir}/img`));
});

// gulp.task('build:img', gulp.series('clear:img', 'create:img'));
gulp.task('build:img', gulp.series('clear:img', 'create:img-min'));

/****************************************************/
/* fonts */
/****************************************************/
gulp.task('clear:fonts', function() {
	return del(`${outputDir}/fonts`)
});
gulp.task('create:fonts', (done) => {
  gulp.src(`${inputDir}/fonts/*`)
    .pipe(gulp.dest(`${outputDir}/fonts`))
  done();
});
gulp.task('build:fonts', gulp.series('clear:fonts', 'create:fonts'));
/****************************************************/
/* common */
/****************************************************/
gulp.task('clear', function() {
	return del(`${outputDir}/*`)
});
gulp.task('build', gulp.parallel(
	'build:html', 'build:css', 'build:js', 'build:img', 'build:fonts'
));
gulp.task('build:code', gulp.parallel('build:html', 'build:css', 'build:js'));
/****************************************************/
/* browserSync */
/****************************************************/
gulp.task('serve', function() {
	browserSync.init({
		server: outputDir
	});
	browserSync.watch(`${outputDir}/**/*.*`)
		.on('change', browserSync.reload);
})
/****************************************************/
/* watch */
/****************************************************/
//${inputDir}
gulp.task('watch', function() {
	gulp.watch([`${inputDir}/*.html`, `${inputDir}/html_modules/*.html`], gulp.series('build:html'));
	// gulp.watch(`${inputDir}/*.html`, gulp.series('build:html'));
	// gulp.watch(`${inputDir}/html_modules/*.html`, gulp.series('build:html'));
	gulp.watch(cssFiles, gulp.series('build:css'));
	// gulp.watch(cssFiles, gulp.series('build:css'))
	// 	.on('unlink', function(filePath) {
	// 		gulpRemember.forget('build:css', absolutPath.resolve(filePath));
	// 	});
	gulp.watch([`${inputDir}/js/*.js`, `${inputDir}/js/html_modules/*.js`], gulp.series('build:js'));
	gulp.watch(`${inputDir}/img/*.*`, gulp.series('build:img'));
	gulp.watch(`${inputDir}/fonts/*.*`, gulp.series('build:fonts'));
});
/****************************************************/
/* start */
/****************************************************/
gulp.task('start', gulp.series(
	'build', 
	gulp.parallel('watch', 'serve')
));
