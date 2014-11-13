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
                alert("Already logged in " + JSON.stringify(res));
                return true;
            },function () {
                alert("Need to login");
                facebook.login()
                    .then(function (res) {
                        alert("Logged in " + JSON.stringify(res));
                        return true;
                    }, function (err) {
                        alert("Failed to logged in " + JSON.stringify(err));
                        return false;
                    })
            }).then(function (res) {
                    if (res === true) {
                        alert("Finally logged in. Post update.")

                        facebook.postUpdate("Message 123", "description 123", "name 123", "http://link.com", "http://soleimageurl.com")
                            .then(function (postId) {
                                alert("Posted " + postId);
                            }, function () {
                                alert("Failed to post");
                            });
                    }
                    else {
                        alert("Finally not logged in")
                    }
                }).
                finally(function () {
                    $ionicLoading.hide();
                });

        }

        function doLogin() {

            $log.log("doLogin");

            var loginDeferred = $q.defer();

            return facebook.getApi().then(function (fbApi) {
                var deferred = $q.defer();
                fbApi.login(["public_profile", "user_photos", "email"], function success(response) {
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

                            fbApi.api("/me/picture?type=large&redirect=0", null, function (picResp) {

                                $log.log("/me/picture", picResp);
                                if (picResp && picResp.data && picResp.data.url) {
                                    $localStorage.facebook = angular.extend({}, $localStorage.facebook, {
                                        image: picResp.data.url
                                    });
                                    loginDeferred.resolve(true);
                                }
                                else {
                                    $log.warn("Could not get user picture", picResp);
                                    loginDeferred.reject();
                                }
                            }, function (err) {
                                $log.warn("Rejection while getting user picture");
                                loginDeferred.reject();
                            });

                        }, function (err) {
                            loginDeferred.reject(err);
                        });

                    }, function (err) {
                        loginDeferred.reject(err);
                    });

                }, function (res) {
                    $log.warn("Failed login", res);
                    loginDeferred.reject();
                });

            return loginDeferred.promise;
        }

    }

});