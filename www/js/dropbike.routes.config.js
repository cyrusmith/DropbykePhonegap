define([
    "angular"
], function(angular) {

    angular.module('dropbike')

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


});