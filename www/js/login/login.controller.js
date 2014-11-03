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

    LoginController.$inject = ['authService', '$ionicLoading', '$localStorage', '$q', '$log', '$state', 'facebook', 'UserModel'];

    function LoginController(authService, $ionicLoading, $localStorage, $q, $log, $state, facebook, UserModel) {

        var vm = this;
        vm.login = login;
        vm.loginWithPhone = loginWithPhone;

        init();

        function loginWithPhone() {
            $state.go('app.phoneconfirm');
        }

        function login() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            doLogin().then(function (res) {

                $ionicLoading.hide();

                var user = new UserModel();
                user.facebookId = res.id;
                user.firstName = res.first_name;
                user.lastName = res.last_name;
                user.photo = res.data.url;
                user.email = res.email;

                user.save();

                $log.log("Login res:", res);

                $state.go('app.phoneconfirm');

            }, function () {
                $ionicLoading.hide();
                $log.log("Login rejected");
            })
        }

        function getLoginStatus() {
            var deferred = $q.defer();

            facebook.getApi().then(function (fbApi) {

                fbApi.getLoginStatus(function success(result) {
                    if (result.status == "connected") {
                        $log.log(result);
                        deferred.resolve(true);
                    }
                    else {
                        deferred.resolve(false);
                    }

                }, function failure() {
                    deferred.resolve(false);
                })
            }, function () {
                $ionicPopup.show({
                    title: 'Error',
                    subTitle: 'Could not load facebook api',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assrtive'
                        }
                    ]
                });
                deferred.resolve(false);
            });

            return deferred.promise;
        }

        function doLogin() {

            $log.log("doLogin");

            var loginDeferred = $q.defer();

            facebook.getApi().then(function (fbApi) {
                var deferred = $q.defer();
                fbApi.login(["public_profile", "user_photos"], function succes(response) {
                    $log.log("login response", response);
                    if (response.authResponse) {
                        $localStorage.facebook = {
                            token: response.authResponse.accessToken,
                            expiresIn: response.authResponse.expiresIn,
                            signedRequest: response.authResponse.signedRequest,
                            userID: response.authResponse.signedRequest
                        }
                    }
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
                            fbApi.api("/me/picture?type=normal", [], function (picResp) {
                                if (picResp && !picResp.error) {
                                    loginDeferred.resolve(angular.extend({}, meResp, picResp));
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

        function init() {

            if (authService.isLoggedIn()) {
                //TODO go to next page
                var user = new UserModel();
                user.load();
                if (!user.isPhoneConfirmed) {
                    $state.go('app.phoneconfirm');
                }
                else if (!user.isCardConfirmed) {
                    $state.go('app.addcard');
                }
                else if($localStorage.ride) {
                    $state.go('app.usagemap');
                }
                else {
                    $state.go('app.search');
                }
                return true;
            }

        };

    }

});