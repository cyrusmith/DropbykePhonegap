/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map').factory('mapDataService', mapDataService);

    mapDataService.$inject = ['$q', '$http', '$window', '$interval', '$rootScope', 'dropbikeUtil', 'GOOGLE_API_KEY'];

    function mapDataService($q, $http, $window, $interval, $rootScope, dropbikeUtil, GOOGLE_API_KEY) {

        return {
            geocode: geocode,
            geodecode: geodecode,
            mapApi: mapApiReady
        }

        function geocode(address) {


            var deferred = $q.defer();

            mapApiReady()
                .then(function () {
                    var geocoder = getGeocoder();
                    if (!geocoder) {
                        deferred.reject("No geocoder");
                    }

                    geocoder.geocode({ 'address': address}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject('Geocode was not successful for the following reason: ' + status);
                        }
                    });

                });

            return deferred.promise;
        }

        function geodecode(location) {

            var deferred = $q.defer();

            if (!location.latitude || !location.longitude) {
                deferred.reject('Location not set');
            }
            else {
                mapApiReady()
                    .then(function () {
                        var geocoder = getGeocoder();
                        if (!geocoder) {
                            deferred.reject("No geocoder");
                        }
                        var latlng = new google.maps.LatLng(location.latitude, location.longitude);
                        geocoder.geocode({'latLng': latlng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                deferred.resolve(results);
                            } else {
                                deferred.reject('Geodecode was not successful for the following reason: ' + status);
                            }
                        });

                    });
            }

            return deferred.promise;

        }

        function getGeocoder() {
            try {
                return new google.maps.Geocoder();
            }
            catch (err) {
                return null;
            }
        }

        function checkMapLoaded() {
            return $window['google'] && $window['google']['maps']
                && $window['google']['maps']['Map']
        }

        function mapApiReady() {
            var d = $q.defer();
            if (checkMapLoaded()) {
                d.resolve();
            }
            else if (isApiScriptAdded()) {
                var interval = $interval(function () {
                    console.log('int');
                    if (checkMapLoaded()) {
                        $interval.cancel(interval);
                        d.resolve();
                    }
                }, 100);

            } else {
                $window.dropbykeMapLoadedCallback = function () {
                    $window.dropbykeMapLoadedCallback = null;
                    $rootScope.$apply(function () {
                        d.resolve();
                    });
                };

                dropbikeUtil.loadScript("http://maps.googleapis.com/maps/api/js?key="
                    + GOOGLE_API_KEY
                    + "&sensor=true&&callback=dropbykeMapLoadedCallback");
            }
            return d.promise;
        }

        function isApiScriptAdded() {
            var scripts = angular.element(document).find('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts.eq(i).attr('src');
                if (src && (src.indexOf("http://maps.googleapis.com/maps/api/js?key=") !== -1)) {
                    return true;
                }
            }
            return false;
        }

    }

})
;