define([
    "angular",
    "login/login.module",
    "phone/phone.module",
    "controllers"
], function (angular) {

    'use strict';

    angular.module('dropbike', ['ionic', 'dropbike.login', 'dropbike.phone', 'dropbike.controllers']);

    require([
        "dropbike.constants",
        "dropbike.routes.config"
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

