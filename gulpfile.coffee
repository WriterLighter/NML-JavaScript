gulp = require('gulp')
coffee = require('gulp-coffee')
plumber    = require 'gulp-plumber'
concat     = require 'gulp-concat'
watch      = require 'gulp-watch'
notify     = require 'gulp-notify'

gulp.task 'nml', ->
  gulp.src 'src/*.coffee'
    .pipe(plumber())
    .pipe(coffee())
    .pipe(concat('nml.js'))
    .pipe(gulp.dest('tmp'))
    .pipe notify 'nml.js done!!!', {onLast: true}

gulp.task 'watch', ['default'], ->
  watch(['src/*.coffee'], (e)-> gulp.start 'nml')

gulp.task 'default', ['nml']
