angular.module('fireArmory.controllers',[])
    .controller('IndexController', function () {
        // var vm = this;
    })
    .controller('GunController', function($scope, API, $log, $location, $mdDialog, $anchorScroll) {
        var vm = this;

        vm.guns = API.Gun.query();


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
                gun.$delete().then(function(){
                    vm.guns.splice(vm.guns.indexOf(gun),1);
                    $log.debug('Gun deleted.');
                });
            }, function() {
                $log.debug('Delete cancelled.');
            });
        };

        /**
         * Enable edit mode of specified gun
         * @param gun
         * @param deleteOnCancel
         */
        vm.editGun = function(gun, deleteOnCancel) {
            gun._deleteOnCancel = !!deleteOnCancel;
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
            if(gun._deleteOnCancel) {
                $log.debug('Deleting blank gun.');
                gun.$delete().then(function(){
                    vm.guns.splice(vm.guns.indexOf(gun),1);
                    $log.debug('Gun deleted.');
                });
            }
        };

        vm.add = function() {
            $log.debug('Adding new gun');
            var gun = new API.Gun();
            gun.$save().then(function(){
                vm.guns.splice(0, 0, gun);
                vm.editGun(gun, true);
                var oldHash = $location.hash();
                $location.hash('top');
                $anchorScroll();
                $location.hash(oldHash);
                $log.debug('New gun:', gun);
            });
        };
    });