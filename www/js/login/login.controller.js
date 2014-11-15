/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular",
    "./login.module"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').controller('LoginController', LoginController);

    LoginController.$inject = ['$q', 'authService', 'profileDataService', '$ionicLoading', '$localStorage', '$log', '$state', 'facebook', 'WEBSITE', 'BANNER_IMAGE'];

    function LoginController($q, authService, profileDataService, $ionicLoading, $localStorage, $log, $state, facebook, WEBSITE, BANNER_IMAGE) {

        var vm = this;
        vm.login = login;
        vm.loginWithPhone = loginWithPhone;

        init();

        function init() {
            if (authService.getToken()) {
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i> Loading...'
                });
                profileDataService.getProfile()
                    .then(function (resp) {
                        if (resp && resp.user) {
                            $state.go('app.search');
                        }
                    }, function (resp) {
                        $log.log("Not logged in");
                    })
                    .finally(function () {
                        $ionicLoading.hide();
                    });
            }
        };

        function loginWithPhone() {
            $state.go('app.phoneconfirm');
        }

        function login() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            facebook.login().then(function (userInfo) {
                $log.log("Login succeeded", userInfo);
                var d = $q.defer();
                if (!userInfo.phone) {
                    facebook.postUpdate("I have registered in Dropbike", "Dropbyke is a bike sharing service", "Dropbyke", WEBSITE, BANNER_IMAGE).then(function () {
                    },function () {
                    }).finally(function () {
                            d.resolve(userInfo);
                        });

                }
                else {
                    d.resolve(userInfo);
                }

                return d.promise;
            },function (err) {

                $log.log("Login failed", err);
                $ionicPopup.show({
                    title: "Error",
                    subTitle: err,
                    buttons: [
                        {
                            "text": "Ok",
                            "type": "button-assertive"
                        }
                    ]
                });
                return false;
            }).then(function (userInfo) {

                    if (!userInfo.phone) {
                        $state.go('app.phoneconfirm');
                    }
                    else {
                        authService.setPhoneConfirmed(true);
                        if (!userInfo.cards.length) {
                            $state.go('app.editcard');
                        }
                        else {
                            authService.setHasPayment(true);
                            $state.go('app.search');
                        }

                    }
                }).
                finally(function () {
                    $ionicLoading.hide();
                });

        }

    }

});