require.config({

    paths: {
        'angular': '../lib/ionic/js/ionic.bundle',
        'domReady': '../lib/requirejs-domready/domReady',
        'ngStorage': '../lib/ngstorage/ngStorage',
        'facebookInappbrowser': '../lib/inappbrowser/phonegap.facebook.inappbrowser',
        'facebookConnectPlugin': '../lib/facebookPlugin/index',
        'requireLib': '../lib/requirejs/require'
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
    },
    include: ['requireLib', 'bootstrap', 'main']
});

require(['bootstrap']);