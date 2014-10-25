/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login', ['ngStorage', 'ionic']);

    require([
        "login/login.controller",
        "login/login.user.factory",
        "login/login.facebook.factory",
        "login/login.auth.service"
    ]);

});