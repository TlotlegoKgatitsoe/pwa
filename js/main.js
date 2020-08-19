let deferredPrompt;
const installButton = document.querySelector( '#installButton' );
const button = document.querySelector( '.mdc-button' );
const snackbar = mdc.snackbar.MDCSnackbar.attachTo( document.querySelector( '.mdc-snackbar' ) );
mdc.ripple.MDCRipple.attachTo( button );
console.log( 'installButton', mdc );

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


fetch( 'https://restcountries.eu/rest/v2/all' )
.then( res => {
    if ( !res.ok ) throw res.statusText;
    return res.json();
})
.then( countries => {
    const countriesCardsCont = document.querySelector( '#countries-cards-container' );
    for ( const country of countries ) {
        countriesCardsCont.innerHTML += `
            <div class='mdc-card mdc-card__primary-action'>
                <div class="mdc-card__media mdc-card__media--16-9" style='background-image: url( "${ country.flag }" );'></div>
                <h3 class='card-title'> ${ country.name } </h3>
                <span class='card-sec-text'> ${ new Intl.NumberFormat( 'en').format( country.population ) } people </span>
            </div>`;
    }
})