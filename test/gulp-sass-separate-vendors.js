import gulp from 'gulp'
import sass from 'gulp-sass'
import moduleimport from 'sass-module-importer'

import SeparateVendors from '../src/gulp-sass-separate-vendors'

describe('Gulp Sass Separate Vendors Unit Test', () => {
    it('test create vendors bundle firstly', () => {
        let separator = SeparateVendors()
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.init())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(separator.extract(-1))
            .pipe(gulp.dest(__dirname))
    })
    it('test create bundle without vendors', () => {
        let separator = SeparateVendors()
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.init())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(separator.extract(1))
            .pipe(gulp.dest(__dirname))
    })
})
