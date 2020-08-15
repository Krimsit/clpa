#!/usr/bin/env node app

const rl = require("readline-sync");
const fs = require("fs");

const name = rl.question("Name: ");
const path = rl.question("Path(Example: c:/path/): ");
const description = rl.question("Description: ");
const author = rl.question("Author: ");

fs.mkdirSync(path + name, { recursive: true }, (err) => {
  if (err) console.log(err);
});

// Файлы pakcage.json, gulpfile.js, inde.html
const package = {
  name: "test",
  version: "1.0.0",
  description: "first test",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  author: "Krimsit",
  license: "ISC",
  devDependencies: {
    "browser-sync": "^2.26.12",
    del: "^5.1.0",
    gulp: "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-clean-css": "^4.3.0",
    "gulp-concat": "^2.6.1",
    "gulp-imagemin": "^7.1.0",
    "gulp-newer": "^1.4.0",
    "gulp-sass": "^4.1.0",
    "gulp-uglify-es": "^2.0.0",
    jquery: "^3.5.1",
    sass: "^1.26.10",
  },
};
const gulpfile = `
let preprocessor = "sass";

const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const del = require("del");

function browsersync() {
    browserSync.init({
        server: { baseDir: "app/" },
        notify: false,
        online: true,
    });
}

function scripts() {
    return src(["node_modules/jquery/dist/jquery.min.js", "app/js/app.js"])
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js"))
        .pipe(browserSync.stream());
}

function styles() {
    return src("app/" + preprocessor + "/main." + preprocessor + "")
        .pipe(eval(preprocessor)())
        .pipe(concat("app.min.css"))
        .pipe(autoprefixer({ overrideBrowsersList: ["last 10 version"], grid: true }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } }, format: "beautify" }))
        .pipe(dest("app/css/"))
        .pipe(browserSync.stream());
}

function images() {
    return src("app/images/src/**/*")
        .pipe(newer("app/images/dest/"))
        .pipe(imagemin())
        .pipe(dest("app/images/dest/"));
}

function cleanimg() {
    return del("app/images/dest/**/*", { force: true });
}

function cleandist() {
    return del("dist/**/*", { force: true });
}

function startwatch() {
    watch("app/**/" + preprocessor + "/**/*", styles);
    watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
    watch("app/**/*.html").on("change", browserSync.reload);
    watch("app/images/src/**/*", images);
}

function buildcope() {
    return src([
        "app/css/**/*.min.css",
        "app/js/**/*.min.js",
        "app/images/dest/**/*",
        "app/**/*.html",
    ],
    { base: "app" }
    ).pipe(dest("dist"));
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.build = series(cleandist, styles, scripts, images, buildcope);

exports.default = parallel(styles, scripts, browsersync, startwatch);
`;

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="css/app.min.css" />
  </head>
  <body>

    <script src="js/app.min.js"></script>
  </body>
</html>
`;

// Создание папок app и dist
fs.mkdirSync(path + name + "/app", { recursive: true }, (err) => {
  if (err) console.log(err);
});
fs.mkdirSync(path + name + "/dist", { recursive: true }, (err) => {
  if (err) console.log(err);
});

// Создание папок и файлов внутри app
fs.mkdirSync(path + name + "/app/js", { recursive: true }, (err) => {
  if (err) console.log(err);
});
fs.mkdirSync(path + name + "/app/css", { recursive: true }, (err) => {
  if (err) console.log(err);
});
fs.mkdirSync(path + name + "/app/images", { recursive: true }, (err) => {
  if (err) console.log(err);
});
fs.mkdirSync(path + name + "/app/sass", { recursive: true }, (err) => {
  if (err) console.log(err);
});
fs.writeFile(path + name + "/app/index.html", html, (err) => {
  if (err) console.log(err);
});
fs.writeFile(path + name + "/app/sass/main.sass", html, (err) => {
  if (err) console.log(err);
});
fs.writeFile(path + name + "/app/js/app.js", html, (err) => {
  if (err) console.log(err);
});

// Создание файла gulpfile.js
fs.writeFile(path + name + "/gulpfile.js", gulpfile, (err) => {
  if (err) console.log(err);
});

// Создание и редактирование файла package.json
var str = JSON.stringify(package);
fs.writeFileSync(path + name + "/package.json", str, (err) => {
  if (err) console.log(err);
});

var fileName = path + name + "/package.json";
var file = require(fileName);

file.name = name;
file.description = description;
file.author = author;

fs.writeFile(fileName, JSON.stringify(file, null, 2), (err) => {
  if (err) return console.log(err);
  console.log("Проект создан!");
});

console.log(
  `
  Директория проекта:
  app
    -css
    -images
    -js
      -app.js
    -sass
      -main.sass
    -index.html
  dist
  gulpfile.js
  package.js

  Обязательно выполните npm install установки всех необходимых пакетов!

  gulp watch - запуск проекта
  gulp build - сборка проекта 
  `
);
