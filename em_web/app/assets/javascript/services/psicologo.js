angular.module('Emozio').factory('Psicologo', Psicologo);

Psicologo.$inject=['$http'];

function Psicologo($http){   

	return {
		GetAll : function (){
			return $http.get('/psicologos');
		},
		GetById : function () {
			return $http.get('/psicologo');
		},
		GetByParams : function (id) {
			return $http.get('/psicologos/'+id);
		},
		Filtrar : function (psicologo) {
			return $http.post('/psicologos/filtrar', psicologo);
		},
		SignUp : function (psicologo) {
			return $http.post('/psicologos/registro', psicologo);
		}, 
		Comentar : function(psicologo) {
            return $http.put('/psicologos/comentarios', psicologo);
        },
		DarBaja : function() {
			return $http.post('/psicologos/baja');   
		},
		Salir : function() {
			return $http.post('/psicologos/cierre');
		}
	};
}