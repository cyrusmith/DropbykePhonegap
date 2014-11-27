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
                    controller: 'SharingBikeCtrl as vm'
                }).state('sharing.bike.edit', {
                    url: "/{bikeId:[0-9]*}",
                    views: {
                        "menuContent@sharing": {
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
                        "menuContent@sharing": {
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
                        "menuContent@sharing": {
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
                        "menuContent@sharing": {
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
                }).state('sharing.history', {
                    url: "/history",
                    abstract: true,
                    controller: 'SharingHistoryCtrl as vm'
                }).state('sharing.history.list', {
                    url: "/list/{bikeId:[0-9]*}",
                    views: {
                        "menuContent@sharing": {
                            templateUrl: "js/sharing/history/history.list.tpl.html",
                            controller: 'SharingHistoryListCtrl as vm',
                            resolve: {
                                items: ['sharingHistoryDataService', function (sharingHistoryDataService) {
                                    return sharingHistoryDataService.loadHistory();
                                }]
                            }
                        }
                    }
                }).state('sharing.history.item', {
                    url: "/{itemId}",
                    views: {
                        "menuContent@sharing": {
                            templateUrl: "js/sharing/history/history.item.tpl.html",
                            controller: 'SharingHistoryItemCtrl as vm'
                        }
                    },
                    resolve: {
                        item: ['sharingHistoryDataService', '$stateParams', function (sharingHistoryDataService, $stateParams) {
                            return sharingHistoryDataService.loadItem($stateParams.itemId);
                        }]
                    }
                }).state('sharing.history.item.map', {
                    url: "/{type}",
                    views: {
                        "menuContent@sharing": {
                            templateUrl: "js/sharing/history/history.item.map.tpl.html",
                            controller: 'SharingHistoryItemMapCtrl as vm',
                            resolve: {
                                type: [ '$stateParams', function ($stateParams) {
                                    return $stateParams.type;
                                }]
                            }
                        }
                    }
                });

        }]);

});