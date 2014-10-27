define([
    "angular",
    "login/login.module",
    "phone/phone.module",
    "card/card.module",
    "offline/offline.module",
    "search/search.module",
    "controllers"
], function (angular) {

    'use strict';

    angular.module('dropbike', [
        'ionic',
        'dropbike.login',
        'dropbike.phone',
        'dropbike.card',
        'dropbike.offline',
        'dropbike.search',
        'dropbike.controllers']);

    require([
        "dropbike.constants",
        "dropbike.config",
        "dropbike.routes.config",
        "dropbike.interceptor"
    ], function () {

        angular.module('dropbike')

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

    });


});

