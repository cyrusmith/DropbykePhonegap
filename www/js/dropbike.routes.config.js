define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike')

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('app', {
                    url: "/usage",
                    abstract: true,
                    templateUrl: "js/menu.tpl.html",
                    controller: 'AppCtrl as vm'
                })

                .state('app.search', {
                    url: "/search",
                    views: {
                        'menuContent': {
                            controller: 'SearchController as vm',
                            templateUrl: "js/search/search.tpl.html",
                            resolve: {
                                profile: ['profileDataService', '$state', function (profileDataService, $state) {
                                    return profileDataService.getProfile()
                                        .then(function (profile) {
                                            if (profile && profile.ride) {
                                                if (!profile.ride.stopTime) {
                                                    $state.go('app.usageaccess');
                                                }
                                                else {
                                                    $state.go('app.checkout');
                                                }

                                            }
                                            return profile;
                                        })
                                }]
                            }
                        }
                    }
                });

            $urlRouterProvider.otherwise('/usage/start');
        }]);

    angular.module('dropbike.login').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.start', {
                url: "/start",
                views: {
                    '@': {
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


    angular.module('dropbike.offline').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.offline', {
                url: "/offline",
                views: {
                    '@': {
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
                            bike: ['$stateParams', '$state', 'bikeDataService', function ($stateParams, $state, bikeDataService) {
                                if (!$stateParams.bikeId) {
                                    return null;
                                }
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
                                        if (resp && resp.ride) {
                                            if (!resp.ride.stopTime) {
                                                d.resolve(resp);
                                            }
                                            else {
                                                $state.go('app.checkout');
                                            }
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
                                            if (!resp.ride.stopTime) {
                                                d.resolve(resp);
                                            }
                                            else {
                                                $state.go('app.checkout');
                                            }
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
                                        if (resp && resp.ride) {
                                            if (!resp.ride.stopTime) {
                                                d.resolve(resp);
                                            }
                                            else {
                                                $state.go('app.checkout');
                                            }
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
            .state('app.usagephoto', {
                url: "/usagephoto",
                views: {
                    'menuContent': {
                        templateUrl: "js/usage/usage.photo.tpl.html",
                        controller: 'UsagePhotoController as vm',
                        resolve: {
                            rideData: ['profileDataService', function (profileDataService) {
                                return profileDataService.getProfile();
                            }]
                        }
                    }
                }
            });

    }]);


    angular.module('dropbike.checkout').config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('app.checkout', {
                url: "/checkout/",
                views: {
                    'menuContent': {
                        templateUrl: "js/checkout/checkout.tpl.html",
                        controller: 'CheckoutController as vm',
                        resolve: {
                            rideData: ['$q', 'profileDataService', '$state', function ($q, profileDataService, $state) {
                                var d = $q.defer();
                                profileDataService.getProfile()
                                    .then(function (resp) {
                                        if (resp.ride) {
                                            if (resp.ride.stopTime) {
                                                d.resolve(resp);
                                            }
                                            else {
                                                $state.go('app.usageaccess');
                                            }
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

    angular.module('dropbike.payments').config(['$stateProvider', function ($stateProvider) {

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

        $stateProvider.state('app.editcard', {
            url: "/card/:cardId",
            views: {
                'menuContent': {
                    templateUrl: "js/payments/payments.card.tpl.html",
                    controller: 'PaymentsCardController as vm',
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