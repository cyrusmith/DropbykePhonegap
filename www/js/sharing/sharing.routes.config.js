define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing')

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                .state('sharing', {
                    url: "/sharing",
                    abstract: true,
                    templateUrl: "js/sharing/main.tpl.html",
                    controller: 'SharingCtrl as vm'
                })
                .state('sharing.bike', {
                    url: "/bike",
                    abstract: true,
                    views: {
                        "menuContent": {
                            templateUrl: "js/sharing/bike/bike.tpl.html",
                            controller: 'SharingBikeCtrl as vm'
                        }
                    }
                }).state('sharing.bike.edit', {
                    url: "/{bikeId:[0-9]*}",
                    views: {
                        "": {
                            templateUrl: "js/sharing/bike/bike.edit.tpl.html",
                            controller: 'SharingBikeEditCtrl as vm',
                            resolve: {
                                bike: ['$stateParams', 'sharingBikeDataService', function ($stateParams, sharingBikeDataService) {
                                    if (+$stateParams.bikeId) {
                                        return sharingBikeDataService.getBike(+$stateParams.bikeId)
                                    }
                                    else {
                                        return null;
                                    }
                                }]
                            }
                        }
                    }
                }).state('sharing.bike.edit.photo', {
                    url: "/photo",
                    views: {
                        "@sharing.bike": {
                            templateUrl: "js/sharing/bike/bike.edit.photo.tpl.html",
                            controller: 'SharingBikePhotoCtrl as vm'
                        }
                    }
                }).state('sharing.bike.edit.location', {
                    url: "/location",
                    views: {
                        "@sharing.bike": {
                            templateUrl: "js/sharing/bike/bike.edit.location.tpl.html",
                            controller: 'SharingBikeLocationCtrl as vm'
                        }
                    }
                });

        }]);

});