angular.module('fireArmory.controllers',[])
    .controller('IndexController', function ($scope, API) {
        var vm = this;
        vm.guns = API.Gun.query();
    });