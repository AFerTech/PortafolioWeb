const {src, dest, watch, parallel }= require("gulp");


// CSS
const sass= require("gulp-sass")(require("sass"));
const plumber= require("gulp-plumber");
const autoprefixer=require("autoprefixer");
const cssnano=require("cssnano");
const postcss=require("gulp-postcss");
const sourcemaps=require("gulp-sourcemaps");



// IMG
const cache= require('gulp-cache');
const imagemin= require('gulp-imagemin');  // v. 7.0.0
const webp= require('gulp-webp');
const avif= require('gulp-avif');

// JS
const terser= require("gulp-terser-js");

function css(done){

    src('src/scss/**/*.scss') //identifica el archivo sass
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) //compila
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css')); //guarda en el disco duro

    done(); //callback avisa a gulp cuando llegamos al final 

}

function imagenes(done){
    const opcs ={
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opcs)))
        .pipe(dest('build/img'));


    done();
}   

function versionWebp(done){

    const opcs ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opcs))
    .pipe(dest('build/img'));


    done();
}
function versionAvif(done){

    const opcs ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opcs))
    .pipe(dest('build/img'));


    done();
}

function javascript(done){

    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done){
    watch('src/scss/**/*.scss',css);
    watch('src/js/**/*.js',javascript);

    
    done();
}

exports.css= css;
exports.js= javascript;
exports.imagenes= imagenes;
exports.versionWebp= versionWebp;
exports.versionAvif= versionAvif;
exports.dev=parallel (imagenes,versionWebp,versionAvif,javascript,dev);