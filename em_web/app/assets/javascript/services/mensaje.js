angular.module('Emozio').factory('Mensaje', Mensaje);

Mensaje.$inject=['$http']; /* Especifica la dependencia que necesita el injector. En este caso, http */

function Mensaje($http){   

	return {
		/* Crea un hilo de mensajes y guarda un mensaje enviado por un paciente */
		SendMsg : function (mensaje) {
			return $http.post('/mensajes/crearMensajePaciente', mensaje);
		},
		/* Guarda un mensaje enviado por un psicologo en un hilo de mensajes */
		SendMsgPsico : function (mensaje) {
			return $http.post('/mensajes/crearMensajePsicologo', mensaje);	
		},
		/* Obtiene los mensajes pendientes de responder por un psicologo */
		GetMsjPendPsico : function () {
			return $http.get('/mensajes/verMsjPendPsico');
		},
		/* Obtiene los hilos de mensajes aceptados por un psicologo */
		GetMsjAceptPsico : function () {
			return $http.get('/mensajes/verMsjAceptPsico');
		},
		/* Obtiene los hilos de mensajes rechazados por un psicologo */
		GetMsjRechPsico : function () {
			return $http.get('/mensajes/verMsjRechPsico');
		},
		/* Obtiene los mensajes pendientes de responder por psicologos escritos por el paciente */
		GetMsjPendPac : function () {
			return $http.get('/mensajes/verMsjPendPac');
		},
		/* Obtiene los hilos de mensajes aceptados por psicologos pertenecientes al paciente */
		GetMsjAceptPac : function () {
			return $http.get('/mensajes/verMsjAceptPac');
		},
		/* Obtiene los hilos de mensajes rechazados por psicologos pertenecientes al paciente */
		GetMsjRechPac : function () {
			return $http.get('/mensajes/verMsjRechPac');
		},
		/* Obtiene todos los mensajes de un paciente */
		GetMsjPaciente : function () {
			return $http.get('/mensajes/verMsjPacientes');
		}
	};
}