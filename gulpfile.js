var gulp   = require( 'gulp' ),
    server = require( 'gulp-develop-server' )
	jshint = require('gulp-jshint');

var files = [ './app.js' , './routes/*' , './models/*' ];

gulp.task('lint', function() {
  return gulp.src( files )
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

	// run server
gulp.task( 'server:start', function() {
    server.listen( { path: './bin/www' } );
});

// restart server if app.js changed
gulp.task( 'server:restart', function() {
    gulp.watch( files , server.restart );
});

gulp.task('default', ['lint','server:start','server:restart']);
