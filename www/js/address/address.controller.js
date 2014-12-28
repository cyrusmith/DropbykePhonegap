/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.address").controller('AddressController', AddressController);

    AddressController.$inject = ['addressControllerDecorator', '$localStorage', '$state', '$scope'];

    function AddressController(addressControllerDecorator, $localStorage, $state, $scope) {

        addressControllerDecorator(this, function (addr) {
            console.log(addr);
            $localStorage.selectedLocation = addr;
            $state.go('app.search');
        }, $scope);

    }

});
