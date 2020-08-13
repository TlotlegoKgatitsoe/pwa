if ( 'serviceWorker' in navigator ) {
    window.addEventListener( 'load', () => {
        navigator.serviceWorker.register( '/service-worker.js' ).then( reg => {
            console.log( 'Registered', reg );
        }).catch( err => {
            console.log( 'Registration failed', err );
        })
    });
}

let deferredPrompt;
const installButton = document.querySelector( '#installButton' );

window.addEventListener( 'beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = 'block';
});

installButton.addEventListener( 'click', event => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then( choiceResult => {
        if ( choiceResult.outcome === 'accepted' ) console.log( 'App installed' );
        deferredPrompt = null;
    })
});

window.addEventListener( 'appinstalled', event => {
    console.log( 'App installed', event );
});