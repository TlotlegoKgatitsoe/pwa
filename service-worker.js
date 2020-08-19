const cacheName = 'cache-1.3.4';

self.addEventListener( 'install', event => {
    event.waitUntil(
        caches.open( cacheName )
        .then( cache => {
            return cache.addAll([
                '/',
                'index.html',
                'css/main.css',
                'js/main.js',
                'icons/icon-16.png',
                'icons/icon-32.png',
                'icons/icon-180.png',
                'icons/icon-192.png',
                'icons/icon-512.png',
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
                'https://fonts.googleapis.com/icon?family=Material+Icons'
            ]);
        }).then( () => { 
            self.skipWaiting();
        })
    )
});

self.addEventListener( 'activate', event => {
    event.waitUntil(
        caches.keys().then( cacheNames => {
            return Promise.all(
                cacheNames.map( arrCacheName => {
                    if ( arrCacheName !== cacheName ) {
                        return caches.delete( arrCacheName );
                    }
                })
            )
        })
    )
})

self.addEventListener( 'fetch', event => {
    event.respondWith( 
        caches.match( event.request ).then( cachedResponse => {
            return cachedResponse || fetch( event.request );
        })
    );
})