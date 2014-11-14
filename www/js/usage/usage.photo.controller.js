/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsagePhotoController', UsagePhotoController);

    UsagePhotoController.$inject = ['rideData', 'cameraUtil', '$state', '$ionicPopup', 'BACKEND_URL'];

    function UsagePhotoController(rideData, cameraUtil, $state, $ionicPopup, BACKEND_URL) {

        console.log("UsagePhotoController", rideData);

        var vm = this;

        vm.photo;
        vm.loading;

        vm.takePhoto = takePhoto;

        init();

        function init() {
            if (!rideData.ride) {
                $state.go('app.search');
                return;
            }
            if (rideData.ride.hasPhoto) {
                vm.photo = BACKEND_URL + '/images/rides/' + rideData.ride.id + '.jpg';
            }
            else {
                vm.photo = 'img/ic-nophoto.png';
            }
            vm.loading = false;
        }

        function takePhoto() {
            if (vm.loading) return;
            vm.loading = true;
            cameraUtil.pickAndUpload("camera", BACKEND_URL + "/api/rides/photo")
                .then(function () {
                    vm.photo = BACKEND_URL + '/images/rides/' + rideData.ride.id + '.jpg?nocache=' + (new Date().getTime());
                }, function (error) {
                    $ionicPopup.show({
                        title: 'Error uploading photo',
                        subTitle: error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    })
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

    }

});