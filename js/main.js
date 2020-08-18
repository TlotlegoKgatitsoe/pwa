console.log( 'Hello ' );
let deferredPrompt;
const installButton = document.querySelector( '#installButton' );
const button = document.querySelector( '.mdc-button' );
const snackbar = mdc.snackbar.MDCSnackbar.attachTo( document.querySelector( '.mdc-snackbar' ) );
mdc.ripple.MDCRipple.attachTo( button );
console.log( 'installButton', installButton );

window.addEventListener( 'beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = 'block';
});

installButton.addEventListener( 'click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then( choiceResult => {
        if ( choiceResult.outcome === 'accepted' ) console.log( 'App installed' );
        deferredPrompt = null;
        installButton.style.display = 'none';
    })
});

window.addEventListener( 'appinstalled', event => {
    console.log( 'App installed', event );
});

button.addEventListener( 'click', () => {
    if ( !snackbar.isOpen ) snackbar.open();
});
