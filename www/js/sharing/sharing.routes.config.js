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
                            controller: 'SharingBikeEditCtrl as vm'
                        }
                    },
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
                }).state('sharing.bike.edit.bikephoto', {
                    url: "/bikephoto",
                    views: {
                        "@sharing.bike": {
                            templateUrl: "js/sharing/bike/bike.edit.photo.tpl.html",
                            controller: 'SharingBikePhotoCtrl as vm',
                            resolve: {
                                targetField: function () {
                                    return 'newPhoto';
                                },
                                initImage: ['$stateParams', 'BACKEND_URL', function ($stateParams, BACKEND_URL) {
                                    if ($stateParams.bikeId) {
                                        return BACKEND_URL + '/images/bikes/' + $stateParams.bikeId + '.jpg?nocache=' + Date.now();
                                    }
                                    return null;
                                }]
                            }
                        }
                    }
                }).state('sharing.bike.edit.userphoto', {
                    url: "/userphoto",
                    views: {
                        "@sharing.bike": {
                            templateUrl: "js/sharing/bike/bike.edit.photo.tpl.html",
                            controller: 'SharingBikePhotoCtrl as vm',
                            resolve: {
                                targetField: function () {
                                    return 'userPhoto';
                                },
                                initImage: ['$stateParams', 'bike', 'BACKEND_URL', function ($stateParams, bike, BACKEND_URL) {
                                    if ($stateParams.bikeId && bike && bike.id) {
                                        if (bike.lastRideId) {
                                            return BACKEND_URL + '/images/rides/' + bike.lastRideId + '.jpg';
                                        }
                                        else {
                                            return BACKEND_URL + '/images/bikesfirstuser/' + bike.id + '.jpg';
                                        }
                                    }
                                    return null;
                                }]
                            }
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
                }).state('sharing.mybikes', {
                    url: "/mybikes",
                    views: {
                        "menuContent": {
                            templateUrl: "js/sharing/mybikes/mybikes.tpl.html",
                            controller: 'SharingMyBikesCtrl as vm'
                        }
                    }
                });

        }]);

});