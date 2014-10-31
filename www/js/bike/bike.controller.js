/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike").controller("BikeController", BikeController);

    BikeController.$inject = ['bike', '$stateParams'];

    function BikeController(bike, $stateParams) {

        var vm = this;

        vm.bike = bike;

    }

});