/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.address", []);

    require([
        "address/address.controller",
        "address/address.controllerdecorator.factory",
        "address/address.dataservice.factory"
    ]);

});
