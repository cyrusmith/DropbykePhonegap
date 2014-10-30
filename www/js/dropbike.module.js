define([
    "angular",
    "login/login.module",
    "phone/phone.module",
    "card/card.module",
    "offline/offline.module",
    "search/search.module",
    "util/util.module",
    "geolocation/geolocation.module",
    "address/address.module",
    "dropbike.templates",
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
        'dropbike.util',
        'dropbike.controllers']);

    require([
        "dropbike.constants",
        "dropbike.config",
        "dropbike.routes.config",
        "dropbike.interceptor"
    ], function () {

        angular.module('dropbike')

            .run(['$ionicPlatform', function ($ionicPlatform) {
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

