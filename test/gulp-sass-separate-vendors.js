import gulp from 'gulp'
import sass from 'gulp-sass'
import rename from 'gulp-rename'
import moduleimport from 'sass-module-importer'

import SeparateVendors from '../dist/gulp-sass-separate-vendors'

describe('Gulp Sass Separate Vendors Unit Test', () => {
    let separator = SeparateVendors()
    it('test create vendors bundle firstly', () => {
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.extract())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(rename('test.vendors.css'))
            .pipe(gulp.dest(__dirname))
    })
    it('test create bundle without vendors', () => {
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.filter())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(rename('test.css'))
            .pipe(gulp.dest(__dirname))
    })
})
