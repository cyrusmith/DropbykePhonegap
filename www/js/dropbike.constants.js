define([
    "angular",
], function (angular) {

    'use strict';

    angular.module('dropbike')
        .constant("FACEBOOK_ID", "297052723828418")
        .constant('BACKEND_URL', 'http://localhost:8081/DropbikeBackend')
        //.constant('BACKEND_URL', 'http://192.168.1.104:8081/DropbikeBackend')
        //.constant('BACKEND_URL', 'http://ec2-54-69-186-125.us-west-2.compute.amazonaws.com:8080/DropbikeBackend-0.1')
        .constant('GOOGLE_API_KEY', 'AIzaSyAzMonYKYPE18hIqNSyRF422iCv4WdU8e4');

});

