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
      templateUrl: "assets/templates/usuarios/cuestionarioPacientes.html",
      controller: "CuestionarioController"
    })
    
    /* Perfil de usuarios */
    .when('/usuarios', {
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