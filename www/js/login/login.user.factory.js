define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('UserModel', userFactory);

    userFactory.$inject = ['$localStorage'];

    function userFactory($localStorage) {

        return User;

        function User() {

            this.facebookId = null;
            this.firstName = null;
            this.lastName = null;
            this.photo = null;
            this.email = null;
            this.phone = null;
            this.isPhoneConfirmed = false;
            this.card = null;
            this.isCardConfirmed = false;

            this.save = save;
            this.load = load;

            function save() {

                $localStorage.user = {
                    facebookId: this.facebookId,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    photo: this.photo,
                    email: this.email,
                    phone: this.phone,
                    isPhoneConfirmed: this.isPhoneConfirmed,
                    card: this.card,
                    isCardConfirmed: this.isCardConfirmed
                };

            }

            function load() {

                if (!$localStorage.user) return;

                this.facebookId = $localStorage.user['facebookId'] || null;
                this.firstName = $localStorage.user['firstName'] || null;
                this.lastName = $localStorage.user['lastName'] || null;
                this.photo = $localStorage.user['photo'] || null;
                this.email = $localStorage.user['email'] || null;
                this.phone = $localStorage.user['phone'] || null;
                this.isPhoneConfirmed = $localStorage.user['isPhoneConfirmed'] || false;
                this.card = $localStorage.user['card'] || null;
                this.isCardConfirmed = $localStorage.user['isCardConfirmed'] || false;

            }

        }


    }


});