/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use scrict';

    angular.module('dropbike.address').factory('addressControllerDecorator', addressControllerDecorator);

    addressControllerDecorator.$inject = ['$timeout', '$ionicPopup', 'mapDataService', 'addressDataService'];

    function addressControllerDecorator($timeout, $ionicPopup, mapDataService, addressDataService) {

        return function (vm, callback, scope) {

            vm.address = "";
            vm.results = [];
            vm.selectAddress = selectAddress;
            vm.history = addressDataService.getSearchHistory();

            scope.$watch('vm.address', scheduleSearch);

            var _timeout = null;

            function scheduleSearch() {
                $timeout.cancel(_timeout);
                _timeout = $timeout(function () {
                    if (!vm.address) return;
                    mapDataService.geocode(vm.address)
                        .then(function (results) {
                            vm.results = [];
                            for (var i = 0; i < results.length; i++) {
                                vm.results.push({
                                    address: results[i].formatted_address,
                                    lat: results[i].geometry.location.lat(),
                                    lng: results[i].geometry.location.lng()
                                });
                            }
                        }, function (error) {
                            $ionicPopup.show({
                                title: 'Geocode error',
                                subtitle: error.message || '',
                                buttons: [{
                                    type: 'button-assertive',
                                    text: 'Ok'
                                }]
                            });
                        });
                }, 500);
            }

            function selectAddress(addr) {
                $ionicPopup.show({
                    template: 'You selected ' + addr.address,
                    title: 'Apply selection?',
                    subTitle: 'Location: ' + addr.lat + ", " + addr.lng,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Apply</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                addressDataService.addToSearchHistory(addr);
                                callback(addr);
                            }
                        }
                    ]
                });
            }
        }

    }

});