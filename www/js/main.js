require.config({

    paths: {
        'angular': '../lib/ionic/js/ionic.bundle',
        'domReady': '../lib/requirejs-domready/domReady',
        'ngStorage': '../lib/ngstorage/ngStorage',
        'facebookConnectPlugin': '../lib/facebookConnectPlugin'
    },

    urlArgs: "bust=" + (new Date()).getTime(),

    shim: {
        'angular': {
            exports: 'angular'
        },
        'facebookConnectPlugin': {
            exports: 'facebookConnectPlugin'
        }
    }

});

require(['bootstrap']);