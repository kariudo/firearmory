angular.module('fireArmory.directives', []).
    directive('appVersion', function(version) {
        return function(scope, elm, _attrs) {
            elm.text(version);
        };
    });