/* routeProvider nos permite configurar distintas rutas en la aplicacion - Podemos inyectarlo gracias a que lo añadimos por parametros en la configuracion de la app (ngRoute) */
angular.module('Emozio').config(function($routeProvider){

	$routeProvider

		.when('/', {
		redirectTo: '/inicio'
	})

	/* Definimos para cada ruta, su template y su controller */

	/* Pagina de inicio */
		.when('/inicio', {
		templateUrl: "assets/templates/inicio.html",
		controller: "PacientesAccesoController"
	})

	/* Cuestionario de asignacion */
		.when('/cuestionario/:n', {
		templateUrl: "assets/templates/pacientes/cuestionarioPacientes.html",
		controller: "CuestionarioController"
	})

	/* Perfil de pacientes */
		.when('/usuarios', {
		templateUrl: "assets/templates/pacientes/pacientesResultados.html",
		controller: "PacientesPerfilController"
	})

	/* Registro de psicologos */
		.when('/registro/psicologos', {
		templateUrl: "assets/templates/psicologos/registroPsicologo.html",
		controller: "PsicologosRegistroController"
	})

	/* Registro de pacientes */
		.when('/registro', {
		templateUrl: "assets/templates/pacientes/registroPacientes.html",
		controller: "PacientesRegistroController"
	})

	/* Modificar datos del paciente */
		.when('/usuarios/modificar', {
		templateUrl: "assets/templates/pacientes/pacientesModificar.html",
		controller: "PacientesModificarController"
	})

	/* Peticiones enviadas por el paciente */
		.when('/usuarios/mail', {
		templateUrl: "assets/templates/pacientes/pacientesMail.html",
		controller: "PacientesMailController"
	})

	/* Modificar datos del psicologo */
		.when('/psicologos/modificar', {
		templateUrl: "assets/templates/psicologos/psicologosModificar.html",
		controller: "PsicologosModificarController"
	})

	/* Calendario psicologos */
		.when('/psicologos/calendario', {
		templateUrl: "assets/templates/psicologos/psicologoCalendario.html",
		controller: "PsicologosCalendarioController"
	})

	/* Perfil de psicologos */
		.when('/psicologos/:id', {
		templateUrl: "assets/templates/psicologos/psicologoPerfil.html",
		controller: "PsicologosPerfilController"
	})

	/* Bandeja de entrada del psicologo */
		.when('/mail', {
		templateUrl: "assets/templates/psicologos/psicologosMail.html",
		controller: "PsicologosMailController"
	}); //SIEMPRE ; AL FINAL

});