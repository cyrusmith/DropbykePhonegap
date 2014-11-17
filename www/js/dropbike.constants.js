define([
    "angular",
], function (angular) {

    'use strict';

    angular.module('dropbike')

        .constant("GEO_ACCURACY", "50") //meters

        .constant("FACEBOOK_ID", "297052723828418")
        .constant("FACEBOOK_REDIRECT_URL", "http://ec2-54-68-46-169.us-west-2.compute.amazonaws.com:8080")

        .constant("WEBSITE", "http://dropbyke.com")
        .constant("BANNER_IMAGE", "http://ec2-54-68-46-169.us-west-2.compute.amazonaws.com:8080/DropbikeBackend-0.1/images/banner.jpg")

        .constant('BACKEND_URL', 'http://192.168.1.104:8081/DropbikeBackend') //local
        //.constant('BACKEND_URL', 'http://ec2-54-69-186-125.us-west-2.compute.amazonaws.com:8080/DropbikeBackend-0.1') //dev
        //.constant('BACKEND_URL', 'http://ec2-54-68-46-169.us-west-2.compute.amazonaws.com:8080/DropbikeBackend-0.1') //prod

        .constant('GOOGLE_API_KEY', 'AIzaSyAzMonYKYPE18hIqNSyRF422iCv4WdU8e4');

});