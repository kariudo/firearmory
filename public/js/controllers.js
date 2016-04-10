angular.module('fireArmory.controllers',[])
    .controller('IndexController', function ($scope, API) {
        var vm = this;
        vm.guns = API.Gun.query();
        

    })
    .controller('GunController', function($scope, API, $log, $mdDialog) {
        var vm = this;

        /**
         * Save changes to the gun
         * @param gun
         */
        vm.saveGun = function(gun) {
            $log.debug('Saving gun', gun);
            delete gun._previousValues;
            API.Gun.update(gun).$promise.then(function(){
                $log.debug('Gun saved.');
                gun._editMode = false;
            });
        };

        /**
         * Delete specified gun
         * @param gun
         * @param ev - event
         */
        vm.deleteGun = function(gun, ev) {
            $log.debug('Confirm delete gun', gun);
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this gun?')
                .textContent('This cannot be undone.')
                .ariaLabel('Delete gun?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $log.debug('Delete confirmed.');
                API.Gun.delete(gun).$promise.then(function(){
                    $log.debug('Gun deleted.');
                });
            }, function() {
                $log.debug('Delete cancelled.');
            });
        };

        /**
         * Enable edit mode of specified gun
         * @param gun
         */
        vm.editGun = function(gun) {
            gun._previousValues = angular.copy(gun);
            gun._editMode = true;
            $log.debug('Edit gun', gun);
        };

        /**
         * Cancel the edit of specified gun
         * @param gun
         */
        vm.cancelEdit = function(gun) {
            angular.copy(gun._previousValues, gun);
            delete gun._previousValues;
            $log.debug('Cancel edit', gun);
        };
    });