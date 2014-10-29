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
        'requireLib': '../lib/requirejs/require'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    },
    include: ['requireLib', 'main'],
    findNestedDependencies: true,
    out: "all.js"
})