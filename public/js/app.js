angular.module('fireArmory', ['ngRoute', 'ngResource', 'ngMaterial', 'fireArmory.controllers', 'fireArmory.filters', 'fireArmory.services', 'fireArmory.directives']).
config(function($routeProvider, $locationProvider, $resourceProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/index',
            controller: 'IndexController',
            controllerAs: 'vm'
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;
});