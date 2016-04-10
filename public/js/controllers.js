angular.module('fireArmory.controllers',[])
    .controller('IndexController', function ($scope, API) {
        var vm = this;
        vm.guns = API.Gun.query();
        

    })
    .controller('GunController', function($scope, API, $log) {
        var vm = this;

        vm.saveGun = function(gun) {
            debugger;
            $log.debug('Saving gun', gun);
            API.Gun.update(gun).$promise.then(function(){
                $log.debug('Gun saved.');
                gun._editMode = false;
            });
        };
        vm.deleteGun = function(gun) {
            debugger;
            $log.debug('Deleting gun', gun);
            API.Gun.delete(gun).$promise.then(function(){
                $log.debug('Gun deleted.');
            });
        };
    });