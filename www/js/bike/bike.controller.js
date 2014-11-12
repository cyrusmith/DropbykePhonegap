/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike").controller("BikeController", BikeController);

    BikeController.$inject = ['bike', 'usageDataService', '$localStorage', '$stateParams', '$ionicPopup', '$state', 'BACKEND_URL'];

    function BikeController(bike, usageDataService, $localStorage, $stateParams, $ionicPopup, $state, BACKEND_URL) {

        var vm = this;

        vm.bike;
        vm.location;
        vm.markers;
        vm.zoom;

        vm.getAccess = getAccess;

        init();

        function init() {

            if (!bike || !bike.bike) {
                $state.go('app.search');
                return;
            }

            vm.bike = bike.bike;
            vm.bike.rating = parseInt(bike.bike.rating * 10) / 10;
            vm.bike.photo = BACKEND_URL + '/images/bikes/' + vm.bike.id + '.jpg';

            vm.location = [vm.bike.lat, vm.bike.lng];
            vm.markers = [
                [vm.bike.lat, vm.bike.lng]
            ];
            vm.zoom = 17;
        }

        function getAccess() {
            $ionicPopup.show({
                title: 'Get bike access',
                subTitle: 'Bike usage time will start once you get access',
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Get access</b>',
                        type: 'button-positive',
                        onTap: function () {
                            return true;
                        }
                    }
                ]
            }).then(function (res) {
                    if (res) {
                        usageDataService.startUsage(vm.bike.id)
                            .then(function () {
                                $state.go('app.usageaccess');
                            }, function (error) {
                                $ionicPopup.show({
                                    title: 'Could not start usage',
                                    subTitle: error ? error : '',
                                    buttons: [
                                        {
                                            text: 'Ok',
                                            type: 'button-assertive'
                                        }
                                    ]
                                })
                            });

                    }
                });
        }


    }

});