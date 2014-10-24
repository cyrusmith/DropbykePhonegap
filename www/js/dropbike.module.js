define([
    "angular",
    "login/login.module",
    "phone/phone.module",
    "controllers"
], function (angular) {

    'use strict';

    angular.module('dropbike', ['ionic', 'dropbike.login', 'dropbike.phone', 'dropbike.controllers'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html",
                    controller: 'AppCtrl'
                })

                .state('app.search', {
                    url: "/search",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/search.html"
                        }
                    }
                })

                .state('app.browse', {
                    url: "/browse",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/browse.html"
                        }
                    }
                })
                .state('app.playlists', {
                    url: "/playlists",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlists.html",
                            controller: 'PlaylistsCtrl'
                        }
                    }
                })

                .state('app.single', {
                    url: "/playlists/:playlistId",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlist.html",
                            controller: 'PlaylistCtrl'
                        }
                    }
                });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/start');
        });

    angular.module('dropbike.login').config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app.start', {
                url: "/start",
                views: {
                    'menuContent': {
                        templateUrl: "js/login/login.tpl.html",
                        controller: 'LoginController as vm'
                    }
                }
            })


    });

    angular.module('dropbike.phone').config(function ($stateProvider) {

        $stateProvider
            .state('app.phoneconfirm', {
                url: "/phoneconfirm",
                views: {
                    'menuContent': {
                        templateUrl: "js/phone/phone.confirm.tpl.html",
                        controller: 'PhoneController as vm'
                    }
                }
            }).state('app.phoneverifycode', {
                url: "/phoneverifycode",
                views: {
                    'menuContent': {
                        templateUrl: "js/phone/phone.verifycode.tpl.html",
                        controller: 'PhoneVerifyCodeController as vm'
                    }
                }
            })


    });

    angular.module('dropbike')
        .constant("facebookId", "297052723828418")
        .constant('getproveKey', 'sk_test_JF4z1PFLKRUCettRiiRglvt8')


});

