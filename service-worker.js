const cacheName = 'cache-v1';
const resToCache = [
    '/',
    'index.html',
    'css/main.css',
    'js/main.js',
    'images/icon-192.png',
    'images/icon-512.png'
];


self.addEventListener( 'install', event => {
    console.log( 'Installing', event );
    event.waitUntil(
        caches.open( cacheName )
        .then( cache => {
            return cache.addAll( resToCache );
        }).then( () => { 
            self.skipWaiting();
        })
    )
});

self.addEventListener( 'activate', event => {
    console.log( 'Activated', event );
});

self.addEventListener( 'fetch', event => {
    console.log( 'Fetching', event );
    event.respondWith( 
        caches.match( event.request ).then( cachedResponse => {
            return cachedResponse || fetch( event.request );
        })
    );
});