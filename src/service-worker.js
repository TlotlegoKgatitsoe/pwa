const cacheName = 'cache-1.3.4.a';
const urlsToIgnore = [ '/update', '/key' ];

self.addEventListener( 'install', event => {
    event.waitUntil(
        caches.open( cacheName )
        .then( cache => {
            return cache.addAll([
                '/',
                'index.html',
                'css/main.css',
                'js/main.js',
                'manifest.json',
                'favicon.ico',
                'icons/icon-16.png',
                'icons/icon-32.png',
                'icons/icon-180.png',
                'icons/icon-192.png',
                'icons/icon-512.png',
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
        fetch( event.request ).catch( () => {
            return caches.match( event.request );
        })
    );
})

self.addEventListener( 'push', event => {
    let body = '';

    if ( event.data ) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }

    const options = {
        body: body,
        icon: '/icons/icon-16.png',
        vibrate: [ 100, 50, 100, 50, 100, 50, 100, 50, 100 ],
        data: {
            dateOfArrival: new Date(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification( 'Signals', options )
    );
});