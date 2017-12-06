/* routeProvider nos permite configurar distintas rutas en la aplicacion - Podemos inyectarlo gracias a que lo añadimos por parametros en la configuracion de la app (ngRoute) */
angular.module('Emozio').config(function($routeProvider){
    
  $routeProvider
  
    .when('/', {
      redirectTo: '/acceso'
    })
    
    /* Definimos para cada ruta, su template y su controller */
    
    /* Cuestionario de asignacion */
    .when('/cuestionario/:n/:id', {
      templateUrl: "assets/templates/usuarios/cuestionarioPacientes.html",
      controller: "CuestionarioController"
    })
    
    /* Perfil de usuarios */
    .when('/usuarios/:id', {
      templateUrl: "assets/templates/usuarios/pacientesResultados.html",
      controller: "PacientesPerfilController"
    })
    
    /* Registro de usuarios */
    .when('/registro', {
      templateUrl: "assets/templates/usuarios/registroPacientes.html",
      controller: "PacientesRegistroController"
    })
    
    /* Acceso de usuarios */    
     .when('/acceso', {
      templateUrl: "assets/templates/usuarios/accesoPacientes.html",
      controller: "PacientesAccesoController"
    })
    
    /* Perfil de psicologos */
    .when('/psicologos/:id', {
      templateUrl: "assets/templates/usuarios/psicologoPerfil.html",
      controller: "PsicologosPerfilController"
    }); //SIEMPRE ; AL FINAL

});