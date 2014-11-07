define([
    "angular",
    "login/login.module",
    "phone/phone.module",
    "card/card.module",
    "offline/offline.module",
    "search/search.module",
    "util/util.module",
    "geolocation/geolocation.module",
    "map/map.module",
    "profile/profile.module",
    "address/address.module",
    "usage/usage.module",
    "checkout/checkout.module",
    "payments/payments.module",
    "dropbike.templates",
    "bike/bike.module",
    "dropbike.controller"
], function (angular) {

    'use strict';

    angular.module('dropbike', [
        'ionic',
        'geolocation',
        'dropbike.login',
        'dropbike.phone',
        'dropbike.card',
        'dropbike.offline',
        'dropbike.search',
        'dropbike.address',
        'dropbike.templates',
        'dropbike.bike',
        'dropbike.usage',
        'dropbike.checkout',
        'dropbike.payments',
        'dropbike.util',
        'dropbike.profile',
        'map',
        'dropbike.controllers']);

    require([
        "dropbike.constants",
        "dropbike.config",
        "dropbike.routes.config",
        "dropbike.interceptor",
        "dropbike.connection.service"
    ], function () {

        angular.module('dropbike')
            .run(['$ionicPlatform', '$rootScope', '$state', 'authService', '$localStorage', 'ConnectivityService', function ($ionicPlatform, $rootScope, $state, authService, $localStorage, connectivityService) {

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                    if (["app.start", "app.phoneconfirm", "app.phoneverifycode", "app.offline"].indexOf(toState.name) === -1) {
                        if (!authService.isLoggedIn()) {
                            event.preventDefault();
                            $state.go('app.start');
                        }
                    }
                    return true;
                });

                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        if (toState.name != "app.offline") {
                            $localStorage.previousState = {
                                "name": toState.name,
                                "params": toParams
                            };
                        }
                    });

                $ionicPlatform.ready(function () {

                    connectivityService.start();

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
            }]);

    });


});

