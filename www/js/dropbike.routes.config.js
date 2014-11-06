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
                                bikes: ['searchDataService', 'profileDataService', '$state', function (searchDataService, profileDataService, $state) {
                                    return profileDataService.getProfile()
                                        .then(function (resp) {
                                            if (!resp.ride) {
                                                return searchDataService.loadBikes();
                                            }
                                            else {
                                                $state.go('app.usageaccess');
                                            }
                                        }, function () {
                                            d.reject(null);
                                        });
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

    angular.module('dropbike.bike').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.bike', {
                url: "/bike/:bikeId",
                views: {
                    'menuContent': {
                        templateUrl: "js/bike/bike.tpl.html",
                        controller: 'BikeController as vm',
                        resolve: {
                            bike: ['$stateParams', 'bikeDataService', function ($stateParams, bikeDataService) {
                                return bikeDataService.getBike($stateParams.bikeId);
                            }]
                        }
                    }
                }
            });

    }]);

    angular.module('dropbike.usage').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.usageaccess', {
                url: "/usageaccess/",
                views: {
                    'menuContent': {
                        templateUrl: "js/usage/usage.access.tpl.html",
                        controller: 'UsageAccessController as vm',
                        resolve: {
                            rideData: ['$q', 'profileDataService', '$state', function ($q, profileDataService, $state) {
                                var d = $q.defer();
                                profileDataService.getProfile()
                                    .then(function (resp) {
                                        if (resp.ride) {
                                            d.resolve(resp);
                                        }
                                        else {
                                            $state.go('app.search');
                                            d.reject(null);
                                        }
                                    }, function () {
                                        d.reject(null);
                                    });
                                return d.promise;
                            }]
                        }
                    }
                }
            });

        $stateProvider
            .state('app.usagemap', {
                url: "/usagemap/",
                views: {
                    'menuContent': {
                        templateUrl: "js/usage/usage.map.tpl.html",
                        controller: 'UsageMapController as vm',
                        resolve: {
                            rideData: ['$q', 'profileDataService', '$state', function ($q, profileDataService, $state) {
                                var d = $q.defer();
                                profileDataService.getProfile()
                                    .then(function (resp) {
                                        if (resp.ride) {
                                            d.resolve(resp);
                                        }
                                        else {
                                            $state.go('app.search');
                                            d.reject(null);
                                        }
                                    }, function () {
                                        d.reject(null);
                                    });
                                return d.promise;
                            }]
                        }
                    }
                }
            });

        $stateProvider
            .state('app.usagedrop', {
                url: "/usagedrop/",
                views: {
                    'menuContent': {
                        templateUrl: "js/usage/usage.drop.tpl.html",
                        controller: 'UsageDropController as vm',
                        resolve: {
                            rideData: ['$q', 'profileDataService', '$state', function ($q, profileDataService, $state) {
                                var d = $q.defer();
                                profileDataService.getProfile()
                                    .then(function (resp) {
                                        if (resp.ride) {
                                            d.resolve(resp);
                                        }
                                        else {
                                            $state.go('app.search');
                                            d.reject(null);
                                        }
                                    }, function () {
                                        d.reject(null);
                                    });
                                return d.promise;
                            }]
                        }
                    }
                }
            });

    }]);


    angular.module('dropbike.profile').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.checkout', {
                url: "/checkout/",
                views: {
                    'menuContent': {
                        templateUrl: "js/checkout/checkout.tpl.html",
                        controller: 'CheckoutController as vm',
                        resolve: {
                            rideData: ['$localStorage', 'checkoutDataService', '$state', function ($localStorage, checkoutDataService, $state) {
                                if ($localStorage.lastRideId) {
                                    return checkoutDataService.loadRideData($localStorage.lastRideId);
                                }
                                else {
                                    $state.go('app.search');
                                    return null;
                                }
                            }]
                        }
                    }
                }
            });

    }]);

    angular.module('dropbike.profile').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.payments', {
                url: "/payments",
                views: {
                    'menuContent': {
                        templateUrl: "js/payments/payments.tpl.html",
                        controller: 'PaymentsController as vm',
                        resolve: {
                            profile: ['profileDataService', function (profileDataService) {
                                return profileDataService.getProfile();
                            }]
                        }
                    }
                }
            });
    }]);

    angular.module('dropbike.profile').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.profileview', {
                url: "/profileview",
                views: {
                    'menuContent': {
                        templateUrl: "js/profile/profile.view.tpl.html",
                        controller: 'ProfileViewController as vm',
                        resolve: {
                            profile: ['profileDataService', function (profileDataService) {
                                return profileDataService.getProfile();
                            }]
                        }
                    }
                }
            });

        $stateProvider
            .state('app.profileedit', {
                url: "/profileedit",
                views: {
                    'menuContent': {
                        templateUrl: "js/profile/profile.edit.tpl.html",
                        controller: 'ProfileEditController as vm',
                        resolve: {
                            profile: ['profileDataService', function (profileDataService) {
                                return profileDataService.getProfile();
                            }]
                        }
                    }
                }
            });

    }]);


});