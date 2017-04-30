import gulp from 'gulp'
import sass from 'gulp-sass'
import moduleimport from 'sass-module-importer'
// import bufferify from 'gulp-bufferify'

import SeparateVendors from '../src/gulp-sass-separate-vendors'

describe('Gulp Sass Separate Vendors Unit Test', () => {
  describe('use options', () => {
    it('case1: create vendors bundle', done => {
      let separator = SeparateVendors({
        vendors: ['bootstrap-sass'],
        extract: 1,
      })
      gulp.src(__dirname + '/test.scss')
      .pipe(separator.init())
      .pipe(sass({
        importer: moduleimport()
      }))
      // .pipe(bufferify((content, file) => {
      //   console.log(content)
      //   console.log(file.path)
      // }))
      .pipe(separator.compile())
      .pipe(separator.combine())
      .pipe(separator.extract())
      .pipe(gulp.dest(__dirname + '/case1'))
      .on('end', done)
    })
    it('case2: create style bundle without vendors', done => {
      let separator = SeparateVendors({
        vendors: ['bootstrap-sass'],
        extract: -1,
      })
      gulp.src(__dirname + '/test.scss')
      .pipe(separator.init())
      .pipe(sass({
        importer: moduleimport()
      }))
      .pipe(separator.compile())
      .pipe(separator.combine())
      .pipe(separator.extract())
      .pipe(gulp.dest(__dirname + '/case2'))
      .on('end', done)
    })
  })
  describe('use parameters', () => {
    it('case3: create vendors bundle', done => {
      let separator = SeparateVendors()
      gulp.src(__dirname + '/test.scss')
      .pipe(separator.init(['bootstrap-sass']))
      .pipe(sass({
        importer: moduleimport()
      }))
      .pipe(separator.compile())
      .pipe(separator.combine())
      .pipe(separator.extract(1))
      .pipe(gulp.dest(__dirname + '/case3'))
      .on('end', done)
    })
    it('case4: create style bundle without vendors', done => {
      let separator = SeparateVendors()
      gulp.src(__dirname + '/test.scss')
      .pipe(separator.init(['bootstrap-sass']))
      .pipe(sass({
        importer: moduleimport()
      }))
      .pipe(separator.compile())
      .pipe(separator.combine())
      .pipe(separator.extract(-1))
      .pipe(gulp.dest(__dirname + '/case4'))
      .on('end', done)
    })
  })
})
