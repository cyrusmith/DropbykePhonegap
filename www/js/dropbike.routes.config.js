define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike')

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider) {

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
                            controller: 'SearchController as vm',
                            templateUrl: "js/search/search.tpl.html"
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
        }]);

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
            });

    });

    angular.module('dropbike.card').config(function ($stateProvider) {

        $stateProvider
            .state('app.addcard', {
                url: "/addcard",
                views: {
                    'menuContent': {
                        templateUrl: "js/card/card.data.tpl.html",
                        controller: 'CardController as vm'
                    }
                }
            });

    });


    angular.module('dropbike.offline').config(function ($stateProvider) {

        $stateProvider
            .state('app.offline', {
                url: "/offline",
                views: {
                    'menuContent': {
                        templateUrl: "js/offline/offline.tpl.html",
                        controller: 'OfflineController as vm'
                    }
                }
            });

    });


});