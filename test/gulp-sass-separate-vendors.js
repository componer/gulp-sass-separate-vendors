import gulp from 'gulp'
import sass from 'gulp-sass'
import bufferify from 'gulp-bufferify'
import moduleimport from 'sass-module-importer'

import SeparateVendors from '../src/gulp-sass-separate-vendors'

describe('Gulp Sass Separate Vendors Unit Test', () => {
    it('test create vendors bundle', () => {
        let separator = SeparateVendors({
          vendors: ['bootstrap-sass'],
        })
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.init())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(separator.compile())
            .pipe(separator.extract())
            .pipe(gulp.dest(__dirname))
    })
    it('test create style bundle without vendors', () => {
        let separator = SeparateVendors({
          vendors: ['bootstrap-sass'],
        })
        gulp.src(__dirname + '/test.scss')
            .pipe(separator.init())
            .pipe(sass({
                importer: moduleimport()
            }))
            .pipe(separator.compile())
            .pipe(separator.combine())
            // .pipe(bufferify((content, file) => console.log(file.path, "\n", content)))
            .pipe(gulp.dest(__dirname))
    })
})
