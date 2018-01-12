angular.module('Emozio').factory('Psicologo', Psicologo);

Psicologo.$inject=['$http']; /* Especifica la dependencia que necesita el injector. En este caso, http */

function Psicologo($http){   

	return {
		/* Obtiene a todos los psicologos */
		GetAll : function (){
			return $http.get('/psicologos');
		},
		/* Obtiene al psicologo que tiene iniciada la sesion */
		GetById : function () {
			return $http.get('/psicologo');
		},
		/* Obtiene al psicologo indicado por parametros */
		GetByParams : function (id) {
			return $http.get('/psicologos/'+id);
		},
		/* Filtra los psicologos mediante los datos del psicologo especificado por parametros */
		Filtrar : function (psicologo) {
			return $http.post('/psicologos/filtrar', psicologo);
		},
		/* Registra e inicia la sesion del psicologo especificado por parametros */
		SignUp : function (psicologo) {
			return $http.post('/psicologos/registro', psicologo);
		}, 
		/* Guarda los comentarios y respuestas del psicologo que tiene iniciada la sesion*/
		Comentar : function(psicologo) {
            return $http.put('/psicologos/comentarios', psicologo);
        },
		/* Da de baja y cierra la sesion del psicologo que tiene iniciada la sesion */
		DarBaja : function() {
			return $http.post('/psicologos/baja');   
		},
		/* Cierra la sesion del psicologo que tiene iniciada la sesion */
		Salir : function() {
			return $http.post('/psicologos/cierre');
		}
	};
}