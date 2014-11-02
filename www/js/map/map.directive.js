/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map').directive('googleMap', googleMapDirective);

    googleMapDirective.$inject = ['$q', '$interval', 'mapDataService'];

    function googleMapDirective($q, $interval, mapDataService) {

        return {
            restrict: 'E',
            scope: {
                markers: '=',
                location: '=',
                showLocationMarker: '=',
                zoom: '=',
                locationIcon: '@',
                markerDefaultIcon: '@',
                bounds: '=',
                onMarkerClick: '&'
            },
            template: '<div class="dropbike-map-container"></div>',
            link: function (scope, element, attrs) {

                var _mapContainer = element.children()[0],
                    _map = null,
                    _currentLocation = null,
                    _currentLocationMarker = null,
                    _markers = {};

                mapDataService.mapApi()
                    .then(function () {
                        init();
                    });


                function init() {

                    var mapOptions = {
                        center: scope.location && scope.location[0] && scope.location[1] ? new google.maps.LatLng(scope.location[0], scope.location[1]) : new google.maps.LatLng(40.727489, -73.997230),
                        zoom: scope.zoom || 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    _map = new google.maps.Map(_mapContainer, mapOptions);

                    google.maps.event.addListener(_map, 'bounds_changed', function () {
                        scope.$apply(function () {
                            waitMapInitialized().then(function () {
                                updateBounds();
                            });
                        });
                    });


                    scope.$watch('markers', function (markers) {
                        for (var hash in _markers) {
                            if (_markers.hasOwnProperty(hash)) {
                                _markers[hash].marker.setMap(null);
                            }
                        }
                        _markers = {};
                        if (markers && markers.length) {
                            for (var i = 0; i < markers.length; i++) {
                                if (markers[i] && markers[i].length) {
                                    var location = markers[i];
                                    var marker = addMarker(new google.maps.LatLng(location[0], location[1]), scope.markerDefaultIcon);
                                    _markers[getMarkerHash(marker)] = {
                                        'marker': marker,
                                        'index': i
                                    };
                                }
                            }

                            for (var hash in _markers) {
                                if (_markers.hasOwnProperty(hash)) {
                                    google.maps.event.addListener(_markers[hash].marker, 'mousedown', function (evt) {
                                        var hash = getMarkerHash(this);
                                        if (_markers[hash]) {
                                            if (attrs.onMarkerClick) {
                                                scope.onMarkerClick({
                                                    index: _markers[hash].index
                                                });
                                            }
                                        }

                                    });
                                }

                            }

                        }
                    });

                    scope.$watch('location', function (location) {
                        if (location && location.length) {
                            var latLng = new google.maps.LatLng(location[0], location[1]);
                            if(attrs.showLocationMarker && scope.showLocationMarker === true) {
                                if (_currentLocationMarker) {
                                    _currentLocationMarker.setMap(null)
                                }
                                _currentLocation = addMarker(latLng, scope.locationIcon).getPosition();
                            }

                            _map.panTo(latLng);
                            _map.setZoom(scope.zoom || 8);

                        }
                    });

                    element.on('$destroy', function () {
                        google.maps.event.clearInstanceListeners(_map);
                        for (var hash in _markers) {
                            if (_markers.hasOwnProperty(hash)) {
                                _markers[hash].marker.setMap(null);
                                google.maps.event.clearInstanceListeners(_markers[hash].marker);
                            }
                        }
                        _markers = null;
                    })

                }

                function updateBounds() {

                    if (!attrs.bounds) return;

                    var bounds = _map.getBounds();
                    var ne = bounds.getNorthEast();
                    var sw = bounds.getSouthWest();

                    scope.bounds = {
                        "ne": {
                            lat: ne.lat(),
                            lng: ne.lng()
                        },
                        "sw": {
                            lat: sw.lat(),
                            lng: sw.lng()
                        }
                    };
                }

                function waitMapInitialized() {

                    var d = $q.defer();

                    var intervalPromise = $interval(function () {
                        if (!!_mapContainer.firstChild) {
                            $interval.cancel(intervalPromise);
                            d.resolve();
                        }
                    }, 100);

                    return d.promise;
                }

                function addMarker(location, icon) {
                    return new google.maps.Marker({
                        position: location,
                        map: _map,
                        icon: icon || null
                    });
                }

                function getMarkerHash(marker) {
                    var latLng = marker.getPosition();
                    return latLng.lat() + '-' + latLng.lng();
                }

            }

        };

    }

});
