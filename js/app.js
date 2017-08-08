var app = angular.module('app', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute', 'wt.responsive', 'ngTable', 'app.controllers']);

app.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider
    .when('/', {
        template: '<h1 style="text-align-last:center">"Início" pagina em andamento!</h1> ' +
                  '<img style="margin: auto; max-width: 100%; text-align-last: center" alt="Teste" src="img/logopsv.png">',
        controller:'AppCtrl'
    })
    .when('/Teste1', {
        template: '<h1 style="text-align-last:center">Pagina em andamento!</h1>',
        controller: 'AppCtrl'
    })
    .when('/Teste2', {
        template: '<h1 style="text-align-last:center">Pagina em andamento!</h1>',
        controller: 'AppCtrl'
    })
    .when('/GestaoAmostra', {
        templateUrl: 'templates/GestaoAmostra.html',
        controller: 'GestaoAmostraCtrl'
    })
    .otherwise({ redirectTo: '/' });

    $mdThemingProvider.theme('default');
    //.primaryPalette('grey')
    //.accentPalette('amber');
});