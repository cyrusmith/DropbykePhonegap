require.config({

    paths: {
        'angular': '../lib/ionic/js/ionic.bundle',
        'domReady': '../lib/requirejs-domready/domReady',
        'ngStorage': '../lib/ngstorage/ngStorage',
        'facebook': '../lib/facebook.inappbrowser'
    },

    urlArgs: "bust=" + (new Date()).getTime(),

    shim: {
        'angular': {
            exports: 'angular'
        },
        'facebook': {
            exports: 'FacebookInAppBrowser'
        }
    }

});

require(['bootstrap']);