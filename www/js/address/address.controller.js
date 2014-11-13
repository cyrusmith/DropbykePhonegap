/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.address").controller('AddressController', AddressController);

    AddressController.$inject = ['$timeout', '$ionicPopup', 'mapDataService', '$scope', '$state', '$localStorage', 'addressDataService'];

    function AddressController($timeout, $ionicPopup, mapDataService, $scope, $state, $localStorage, addressDataService) {

        var vm = this;

        vm.address = "";
        vm.results = [];
        vm.selectAddress = selectAddress;
        vm.history = addressDataService.getSearchHistory();

        $scope.$watch('vm.address', scheduleSearch);

        var _timeout = null;

        function scheduleSearch() {
            $timeout.cancel(_timeout);
            _timeout = $timeout(function () {
                mapDataService.geocode(vm.address)
                    .then(function (results) {
                        vm.results = [];
                        for(var i=0; i < results.length; i++) {
                            vm.results.push({
                                address: results[i].formatted_address,
                                lat: results[i].geometry.location.lat(),
                                lng: results[i].geometry.location.lng()
                            });
                        }
                    }, function(error) {
                        console.error(error);
                    });
            }, 500);
        }

        function selectAddress(addr) {
            $ionicPopup.show({
                template: 'You selected ' + addr.address,
                title: 'Apply selection?',
                subTitle: 'Location: ' + addr.lat + ", " + addr.lng,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Apply</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $localStorage.selectedLocation = addr;
                            addressDataService.addToSearchHistory(addr);
                            $state.go('app.search');
                        }
                    }
                ]
            });
        }

    }

});
