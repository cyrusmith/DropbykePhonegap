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

    BikeController.$inject = ['bike', '$stateParams', '$ionicPopup', '$state', 'BACKEND_URL'];

    function BikeController(bike, $stateParams, $ionicPopup, $state, BACKEND_URL) {

        var vm = this;

        vm.bike = bike;
        vm.location = [bike.lat, bike.lng];
        vm.markers = [
            [bike.lat, bike.lng]
        ];
        vm.zoom = 17;

        vm.getAccess = getAccess;

        if (bike.hasPhoto) {
            vm.bike.photo = BACKEND_URL + '/images/bikes/' + vm.bike.id + '.jpg';
        }


        function getAccess() {
            $ionicPopup.show({
                title: 'Get bike access',
                subTitle: 'Once you get access your funds spend time will start',
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Get access</b>',
                        type: 'button-positive',
                        onTap: function () {
                            $state.go('app.usage.access');
                        }
                    }
                ]
            });
        }


    }

});