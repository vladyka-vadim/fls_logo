let { src, dest } = require("gulp");
let gulp = require("gulp");
let scss = require('gulp-sass')(require('sass'));
let rename = require("gulp-rename");
let autoprefixer = require("gulp-autoprefixer"); 
let clean_css = require("gulp-clean-css");
let browsersync = require("browser-sync").create(); 
let fileinclude = require("gulp-file-include");
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let del = require("del");
let uglify = require("gulp-uglify-es").default;
let fs = require('fs');
let group_media = require("gulp-group-css-media-queries"); 
let plumber = require("gulp-plumber");
let imagemin = require("gulp-imagemin");
let webp = require('imagemin-webp');
let webpcss = require("gulp-webpcss");
let webphtml = require('gulp-webp-html');

let project_name = require("path").basename(__dirname); 
let src_folder = "#src"; 

let path = {
	build: {
		html: project_name + "/",
		js: project_name + "/js/",
		css: project_name + "/css/",
		images: project_name + "/img/",
		fonts: project_name + "/fonts/"
	},
	src: {
		favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
		html: [src_folder + "/**/*.html", "!" + src_folder + "/_*.html"],
		js: [src_folder + "/js/app.js", src_folder + "/js/vendors.js"],
		css: src_folder + "/scss/style.scss",
		images: [src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		fonts: src_folder + "/fonts/*.ttf"
	},
	watch: {
		html: src_folder + "/**/*.html",
		js: src_folder + "/**/*.js",
		css: src_folder + "/scss/**/*.scss",
		images: src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}"
	},
	clean: "./" + project_name + "/"
};

function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./" + project_name + "/"
		},
		notify: false,
		port: 3000,
	});
}
function php() {
    return src('./#src/php/*.php')
    .pipe(dest(project_name + "/php/"));
}
function html() {
	return src(path.src.html, {})
		.pipe(fileinclude())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}
function css() {
	return src(path.src.css, {})
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}
function js() {
	return src(path.src.js, {})
		.pipe(fileinclude())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}
function images() {
	return src(path.src.images)
		.pipe(dest(path.build.images))
}
function fonts() {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
}
function fontstyle() {
	let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
		fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(src_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
	return src(path.src.html).pipe(browsersync.stream());
}
function cb() { 

}
function clean() {
	return del(path.clean);
}
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch('./#src/php/*.php', php);
}

function cssBuild() {
	return src(path.src.css, {})
		.pipe(plumber())
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: "._webp",
				noWebpClass: "._no-webp"
			}
		))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function jsBuild() {
	return src(path.src.js, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify(/* options */))
		.on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function imagesBuild() {
	return src(path.src.images)
		.pipe(
			imagemin([
				webp({
					quality: 85
				})
			])
		)
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.images))
}
function htmlBuild() {
	return src(path.src.html, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}


exports.default = gulp.series(clean, gulp.parallel(html, js, images, fonts), fontstyle, css, gulp.parallel(watchFiles, browserSync));
exports.build = gulp.parallel(htmlBuild, cssBuild, jsBuild, imagesBuild);