require.config({

    paths: {
        'angular': '../lib/ionic/js/ionic.bundle',
        'domReady': '../lib/requirejs-domready/domReady',
        'ngStorage': '../lib/ngstorage/ngStorage',
        'facebookInappbrowser': '../lib/facebook.inappbrowser',
        'facebookConnectPlugin': '../lib/facebookConnectPlugin'
    },

    urlArgs: "bust=" + (new Date()).getTime(),

    shim: {
        'angular': {
            exports: 'angular'
        },
        'facebookInappbrowser': {
            exports: 'FacebookInAppBrowser'
        },
        'facebookConnectPlugin': {
            exports: 'facebookConnectPlugin'
        }
    }

});

require(['bootstrap']);