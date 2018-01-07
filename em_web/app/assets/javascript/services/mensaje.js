angular.module('Emozio').factory('Mensaje', Mensaje);

Mensaje.$inject=['$http'];

function Mensaje($http){   

	return {
		SendMsg : function (mensaje) {
			return $http.post('/mensajes/crearMensajePaciente', mensaje);
		},
		SendMsgPsico : function (mensaje) {
			return $http.post('/mensajes/crearMensajePsicologo', mensaje);	
		},
		GetMsjPendPsico : function () {
			return $http.get('/mensajes/verMsjPendPsico');
		},
		GetMsjAceptPsico : function () {
			return $http.get('/mensajes/verMsjAceptPsico');
		},
		GetMsjRechPsico : function () {
			return $http.get('/mensajes/verMsjRechPsico');
		},
		GetMsjPendPac : function () {
			return $http.get('/mensajes/verMsjPendPac');
		},
		GetMsjAceptPac : function () {
			return $http.get('/mensajes/verMsjAceptPac');
		},
		GetMsjRechPac : function () {
			return $http.get('/mensajes/verMsjRechPac');
		},
		GetMsjPaciente : function () {
			return $http.get('/mensajes/verMsjPacientes');
		}
	};
}