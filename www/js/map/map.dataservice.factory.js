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

    mapDataService.$inject = ['$q', 'geolocation', '$window', '$interval', '$rootScope', 'dropbikeUtil', 'GOOGLE_API_KEY', 'GEO_ACCURACY'];

    function mapDataService($q, geolocation, $window, $interval, $rootScope, dropbikeUtil, GOOGLE_API_KEY, GEO_ACCURACY) {

        return {
            geocode: geocode,
            geodecode: geodecode,
            mapApi: mapApiReady,
            checkGPS: checkGPS,
            getLocation: getLocation,
            getExactLocation: getExactLocation
        }

        function getLocation() {
            var d = $q.defer();

            geolocation.getLocation({
                enableHighAccuracy: true,
                maximumAge: 0
            }).then(function (pos) {
                    d.resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    });
                }, function (error) {
                    d.reject(error);
                });

            return d.promise;
        }

        function getExactLocation() {
            var d = $q.defer();

            checkGPS()
                .then(function (isGPSEnabled) {
                    if (!isGPSEnabled && window.cordova) {
                        d.reject("GPS is not enabled");
                        return;
                    }
                    geolocation.getLocation({
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 60000
                    }).then(function (pos) {
                            if (pos.coords.accuracy <= GEO_ACCURACY) {
                                d.resolve({
                                    latitude: pos.coords.latitude,
                                    longitude: pos.coords.longitude
                                });
                            }
                            else {
                                d.reject("Location is not accurate. Make sure you're getting location from GPS.");
                            }
                        }, function (error) {
                            d.reject(error);
                        });
                }, function () {
                    d.reject("GPS not enabled");
                });

            return d.promise;
        }

        function checkGPS() {

            var d = $q.defer();

            if (window.cordova && window.GPSChecker) {
                window.GPSChecker.checkEnabled(function (isEnabled) {
                    if (isEnabled) {
                        d.resolve(true)
                    }
                    else {
                        d.resolve(false);
                    }
                }, function () {
                    d.resolve(false);
                });
            }
            else {
                d.resolve(true);
            }

            return d.promise;

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