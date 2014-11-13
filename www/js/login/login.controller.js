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

    LoginController.$inject = ['authService', 'profileDataService', '$ionicLoading', '$localStorage', '$q', '$log', '$state', 'facebook'];

    function LoginController(authService, profileDataService, $ionicLoading, $localStorage, $q, $log, $state, facebook) {

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

            facebook.getLoginStatus().then(function (res) {
                return true;
            },function () {
                return facebook.login();
            }).then(function (res) {
                    $state.go('app.phoneconfirm');
                },function (err) {
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
                }).
                finally(function () {
                    $ionicLoading.hide();
                });

        }

    }

});