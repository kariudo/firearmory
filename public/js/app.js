angular.module('fireArmory', ['ngRoute', 'ngResource', 'ngMaterial', 'fireArmory.controllers', 'fireArmory.filters', 'fireArmory.services', 'fireArmory.directives']).
config(function($routeProvider, $locationProvider, $resourceProvider, $mdIconProvider, $mdThemingProvider) {
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

    $mdIconProvider.icon('menu', '/img/ic_menu_24px.svg', 24);
    $mdIconProvider.icon('collection', '/img/ic_book_open_24px.svg', 24);
    $mdIconProvider.icon('range', '/img/ic_target_24px.svg', 24);
    $mdIconProvider.icon('more', '/img/ic_more_vert_24px.svg', 24);
    $mdIconProvider.icon('edit', '/img/ic_mode_edit_24px.svg', 24);
    
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('lime');
});