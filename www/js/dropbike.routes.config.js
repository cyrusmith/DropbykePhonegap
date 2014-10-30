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
                    templateUrl: "templates/menu.tpl.html",
                    controller: 'AppCtrl'
                })

                .state('app.search', {
                    url: "/search",
                    views: {
                        'menuContent': {
                            controller: 'SearchController as vm',
                            templateUrl: "js/search/search.tpl.html",
                            resolve: {
                                bikes: ['searchDataService', function (searchDataService) {
                                    return searchDataService.loadBikes();
                                }]
                            }
                        }
                    }
                })

                .state('app.browse', {
                    url: "/browse",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/browse.tpl.html"
                        }
                    }
                })
                .state('app.playlists', {
                    url: "/playlists",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlists.tpl.html",
                            controller: 'PlaylistsCtrl'
                        }
                    }
                })

                .state('app.single', {
                    url: "/playlists/:playlistId",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlist.tpl.html",
                            controller: 'PlaylistCtrl'
                        }
                    }
                });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/start');
        }]);

    angular.module('dropbike.login').config(['$stateProvider', function ($stateProvider) {

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


    }]);

    angular.module('dropbike.phone').config(['$stateProvider', function ($stateProvider) {

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

    }]);

    angular.module('dropbike.card').config(['$stateProvider', function ($stateProvider) {

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

    }]);


    angular.module('dropbike.offline').config(['$stateProvider', function ($stateProvider) {

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

    }]);

    angular.module('dropbike.address').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.address', {
                url: "/address",
                views: {
                    'menuContent': {
                        templateUrl: "js/address/address.tpl.html",
                        controller: 'AddressController as vm'
                    }
                }
            });

    }]);


});