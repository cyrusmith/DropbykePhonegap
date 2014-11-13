/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
({

    baseUrl: "js",
    paths: {
        'angular': '../lib/ionic/js/ionic.bundle',
        'domReady': '../lib/requirejs-domready/domReady',
        'ngStorage': '../lib/ngstorage/ngStorage',
        'facebook': '../lib/facebook.inappbrowser',
        'requireLib': '../lib/requirejs/require'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'facebook': {
            exports: 'FacebookInAppBrowser'
        }
    },
    include: ['requireLib', 'main'],
    findNestedDependencies: true,
    out: "all.js"
})