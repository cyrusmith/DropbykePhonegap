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

    function BikeController(data, $stateParams, $ionicPopup, $state, BACKEND_URL) {

        var vm = this;

        vm.bike = data.bike;
        vm.bike.photo = BACKEND_URL + '/images/rides/' + data.ride.id + '.jpg';
        vm.location = [vm.bike.lat, vm.bike.lng];
        vm.markers = [
            [vm.bike.lat, vm.bike.lng]
        ];
        vm.zoom = 17;

        vm.getAccess = getAccess;


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
                            return true;
                        }
                    }
                ]
            }).then(function (res) {
                    if (res) {
                        $state.go('app.usageaccess');
                    }
                });
        }


    }

});