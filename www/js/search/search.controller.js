define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('SearchController', SearchController);

    SearchController.$inject = [];

    function SearchController() {

        var vm = this;


        console.log("SearchController", arguments);

    }

});