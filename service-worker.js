
const cacheName = 'cache-v1.2';

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
    console.log( 'Activated', event );
})

self.addEventListener( 'fetch', event => {
    console.log( 'Fetching', event );
    event.respondWith( 
        caches.match( event.request ).then( cachedResponse => {
            return cachedResponse || fetch( event.request );
        })
    );
})