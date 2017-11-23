/* Se define el modulo NoteWrangler 
ngRoute se utiliza para navegar por la pagina sin necesidad de recargarla entera
ngResource permite realizar conexiones REST a nuestra API para enviar y recibir informacion. Utiliza el servicio $http */
angular.module('Emozio', ['ngRoute', 'ngResource']);