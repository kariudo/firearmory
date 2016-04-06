angular.module('fireArmory.services', [])
    .constant('version', '0.0')
    .factory('API', function($resource) {
        this.Gun = $resource('/api/gun/:gunId', {gunId: '@id'});
    });