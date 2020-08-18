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
    // event.waitUntil( self.clients.claim() ); 17
})

self.addEventListener( 'fetch', event => {
    event.respondWith( 
        caches.match( event.request ).then( cachedResponse => {
            return cachedResponse || fetch( event.request );
        })
    );
})