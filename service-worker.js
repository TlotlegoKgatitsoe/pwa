const cacheName = 'cache-1.3.1';

self.addEventListener( 'install', event => {
    console.log( 'Installing', event );
    event.waitUntil(
        caches.open( cacheName )
        .then( cache => {
            return cache.addAll([
                '/',
                'index.html',
                'css/main.css',
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'js/main.js',
                'images/icon-192.png',
                'images/icon-512.png'
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