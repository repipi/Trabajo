// Gulp.js configuration
var
// modules
gulp = require('gulp'),
	ngGraph = require('gulp-angular-architecture-graph'),
	angularModules = require("gulp-angular-modules");

// development mode?
devBuild = (process.env.NODE_ENV !== 'production'),

	// folders
	folder = {
	src: 'src/',
	build: 'build/'
};

gulp.task('diagram', function(){
    gulp.src(['/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/controllers/pacientes/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/controllers/psicologos/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/factories/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/*.js'])
        .pipe(ngGraph({
            dest: '/home/rach/Documentos/TFG/diagramas'
        }));
});

gulp.task("diagram_module", function() {
 
    var options = {
        name: "Emozio", // The name of the module to use in your main Angular.js 
        modules: ['ngRoute', 'ngResource'] // Any extra modules that you want to include. 
    };
 
    return gulp.src(['/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/controllers/pacientes/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/controllers/psicologos/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/factories/*.js', '/home/rach/Documentos/TFG/em_repository/em_web/app/assets/javascript/*.js'])
        .pipe(angularModules("gulp-angular-modules.js", options)) // Name of the file generated 
        .pipe(gulp.dest("/home/rach/Documentos/TFG/diagramas")) // Destination folder 
});