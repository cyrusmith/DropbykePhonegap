/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageDropAddressController', UsageDropAddressController);

    UsageDropAddressController.$inject = ['addressControllerDecorator', 'addressDataService', '$localStorage', '$state', '$scope'];

    function UsageDropAddressController(addressControllerDecorator, addressDataService, $localStorage, $state, $scope) {

        $localStorage.selectedAddressFlash = null;

        addressControllerDecorator(this, function (addr) {
            console.log(addr);
            $localStorage.selectedAddressFlash = addr;
            $state.go('app.usagedrop');
        }, $scope);

    }

});
