angular.module('fireArmory.services', [])
    .constant('version', '0.0')
    .factory('API', function($resource) {
        return {
            Gun: $resource('/api/guns/:gunId', {gunId: '@_id'}, {
                'update': { method:'PUT' }
            })
        };
    });