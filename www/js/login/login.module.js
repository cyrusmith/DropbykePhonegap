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
        "login/login.auth.service",
        "login/login.facebook.factory"
    ]);

});