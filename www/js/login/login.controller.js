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

    LoginController.$inject = ['authService', '$ionicLoading', '$localStorage', '$q', '$log', '$state', 'facebook'];

    function LoginController(authService, $ionicLoading, $localStorage, $q, $log, $state, facebook) {

        var vm = this;
        vm.login = login;
        vm.loginWithPhone = loginWithPhone;

        function loginWithPhone() {
            $state.go('app.phoneconfirm');
        }

        function login() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            doLogin().then(function (res) {


                $log.log("Login res:", res);

                $state.go('app.phoneconfirm');

            },function () {
                $log.log("Login rejected");
            }).
                finally(function () {
                    $ionicLoading.hide();
                });
        }

        function doLogin() {

            $log.log("doLogin");

            var loginDeferred = $q.defer();

            facebook.getApi().then(function (fbApi) {
                var deferred = $q.defer();
                fbApi.login(["public_profile", "user_photos"], function succes(response) {
                    $log.log("login response", response);
                    deferred.resolve(response);
                }, function failure(res) {
                    $log.log("login failure", res);
                    deferred.reject(res);
                });
                return deferred.promise;
            }).
                then(function () {

                    facebook.getApi().then(function (fbApi) {
                        fbApi.api('/me', null, function (meResp) {

                            $log.log("/me", meResp);

                            $localStorage.facebook = meResp;

                            fbApi.api("/me/picture?type=large", [], function (picResp) {
                                $log.log("/me/picture", picResp);
                                if (picResp && !picResp.error) {
                                    $localStorage.facebook = angular.extend({}, $localStorage.facebook, {
                                        image: picResp.data.url
                                    });
                                    loginDeferred.resolve(true);
                                }
                                else {
                                    $log.warn("Could not get user picture", picResp);
                                    loginDeferred.reject();
                                }
                            }, function () {
                                $log.warn("Rejection while getting user picture");
                                loginDeferred.reject();
                            });

                        }, function (err) {
                            loginDeferred.reject(err);
                        });

                    });

                }, function (res) {
                    $log.warn("Failed login", res);
                    loginDeferred.reject();
                });

            return loginDeferred.promise;
        }

    }

});