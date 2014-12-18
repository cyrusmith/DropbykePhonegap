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

    angular.module('map').factory('mapDataServiceErrorCodes', function () {
        return {
            "ERROR_LOCATION_ACCURACY": 1,
            "ERROR_NOGPS": 2
        }
    });

    mapDataService.$inject = ['$q', 'geolocation', '$log', '$window', '$interval', '$rootScope', 'dropbikeUtil', 'mapDataServiceErrorCodes', 'GOOGLE_API_KEY', 'GEO_ACCURACY'];

    function mapDataService($q, geolocation, $log, $window, $interval, $rootScope, dropbikeUtil, mapDataServiceErrorCodes, GOOGLE_API_KEY, GEO_ACCURACY) {

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
                d.reject({
                    code: 0,
                    message: error
                });
            });

            return d.promise;
        }

        function getExactLocation() {
            var d = $q.defer();

            checkGPS()
                .then(function (isGPSEnabled) {
                    if (!isGPSEnabled && window.cordova) {
                        d.reject({
                            code: mapDataServiceErrorCodes.ERROR_NOGPS,
                            message: "GPS is not enabled"
                        });
                        return;
                    }
                    geolocation.getLocation({
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 30000
                    }).then(function (pos) {
                        $log.log(pos.coords);
                        if (pos.coords.accuracy <= GEO_ACCURACY) {
                            d.resolve({
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude
                            });
                        }
                        else {
                            d.reject({
                                code: mapDataServiceErrorCodes.ERROR_LOCATION_ACCURACY,
                                message: "Location is not accurate. Make sure you're getting location from GPS."
                            });
                        }
                    }, function (error) {
                        d.reject({
                            code: 0,
                            message: error
                        });
                    });
                }, function () {
                    d.reject({
                        code: mapDataServiceErrorCodes.ERROR_NOGPS,
                        message: "GPS not enabled"
                    });
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
                        deferred.reject({
                            code: 0,
                            message: "No geocoder"
                        });
                    }

                    geocoder.geocode({'address': address}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject({
                                code: 0,
                                message: 'Geocode was not successful for the following reason: ' + status
                            });
                        }
                    });

                });

            return deferred.promise;
        }

        function geodecode(location) {

            var deferred = $q.defer();

            if (!location.latitude || !location.longitude) {
                deferred.reject({
                    code: 0,
                    message: 'Location not set'
                });
            }
            else {
                mapApiReady()
                    .then(function () {
                        var geocoder = getGeocoder();
                        if (!geocoder) {
                            deferred.reject({
                                code: 0,
                                message: "No geocoder"
                            });
                        }
                        var latlng = new google.maps.LatLng(location.latitude, location.longitude);
                        geocoder.geocode({'latLng': latlng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                deferred.resolve(results);
                            } else {
                                deferred.reject({
                                    code: 0,
                                    message: 'Geodecode was not successful for the following reason: ' + status
                                });
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