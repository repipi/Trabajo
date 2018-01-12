angular.module('Emozio').factory('Paciente', Paciente);

Paciente.$inject=['$http']; /* Especifica la dependencia que necesita el injector. En este caso, http */

function Paciente($http){   

	return {
		/* Obtiene al paciente que ha iniciado la sesion */
		GetById : function () {
			return $http.get('/pacientes');
		},
		/* Inicia la sesion del usuario especificado por parametros */
		LogIn : function(paciente) {
			return $http.post('/pacientes/acceso', paciente);
		},
		/* Registra e inicia la sesion del paciente especificado por parametros */
		SignUp : function(paciente) {
			return $http.post('/pacientes/registro', paciente);
		},
		/* Actualiza los datos del paciente especificado por parametros */
		Update : function(paciente) {
			return $http.put('/pacientes', paciente);
		},
		/* Cambia la contraseña del paciente especificado por parametros */
		ChangePassword : function(paciente) {
			return $http.put('/pacientes/changePassword', paciente);
		},
		/* Obtiene el diagnostico del paciente que tiene iniciada la sesion */
		GetDiagnostico : function() {
			return $http.get('/pacientes/diagnostico');   
		},
		/* Da de baja y cierra la sesion del paciente que tiene iniciada la sesion */
		DarBaja : function() {
			return $http.post('/pacientes/baja');   
		},
		/* Obtiene los psicologos asociados al paciente que tiene iniciada la sesion */
		GetPsicologos : function() {
			return $http.get('/pacientes/psicologos');   
		}, 
		/* Cierra la sesion del paciente que tiene iniciada la sesion */
		Salir : function() {
			return $http.post('/pacientes/cierre');
		}
	};
}