angular.module('fireArmory', ['ngRoute', 'ngResource', 'ngMaterial', 'fireArmory.controllers', 'fireArmory.filters', 'fireArmory.services', 'fireArmory.directives']).
config(function($routeProvider, $locationProvider, $resourceProvider, $mdIconProvider, $mdThemingProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/index',
            controller: 'IndexController',
            controllerAs: 'vm'
        }).
        when('/collection', {
            templateUrl: 'partials/guns',
            controller: 'GunController',
            controllerAs: 'gunCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $mdIconProvider.icon('logo', '/img/crude_logo.svg', 64);
    $mdIconProvider.icon('menu', '/img/ic_menu_24px.svg', 24);
    $mdIconProvider.icon('collection', '/img/ic_book_open_24px.svg', 24);
    $mdIconProvider.icon('range', '/img/ic_target_24px.svg', 24);
    $mdIconProvider.icon('more', '/img/ic_more_vert_24px.svg', 24);
    $mdIconProvider.icon('edit', '/img/ic_mode_edit_24px.svg', 24);
    $mdIconProvider.icon('delete', '/img/ic_delete_24px.svg', 24);
    $mdIconProvider.icon('add', '/img/ic_add_24px.svg', 24);

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('teal');
});