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
        "dropbike.interceptor"
    ], function () {

        angular.module('dropbike')
            .run(['$ionicPlatform', '$rootScope', '$state', 'authService', function ($ionicPlatform, $rootScope, $state, authService) {

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name !== "app.start" && toState.name !== "app.phoneconfirm" && toState.name !== "app.phoneverifycode") {
                        if (!authService.isLoggedIn()) {
                            event.preventDefault();
                            $state.go('app.start');
                        }
                    }
                    return true;
                });

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
            }]);

    });


});

