const cacheName = 'cache-1.3.4.a';

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
        caches.match( event.request ).then( async cachedResponse => {
            if ( !cachedResponse ) {
                const res = await fetch( event.request );
                if ( !res.ok ) throw res.statusText;
                caches.open( cacheName ).then( cache => {
                    cache.put( new Request( event.request.url ), res );
                    return res;
                })
            } else {
                return cachedResponse;
            }
        })
    );
})