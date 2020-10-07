let deferredPrompt;
const installButton = document.querySelector( '#installButton' );
const button = document.querySelector( '.mdc-button' );
const snackbar = mdc.snackbar.MDCSnackbar.attachTo( document.querySelector( '.mdc-snackbar' ) );
mdc.ripple.MDCRipple.attachTo( button );

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




const model = {
    countries: [],
    databaseName: 'tk-countries-app',
    databaseVersion: 1,
    hasDatabase: localStorage.getItem( 'has-countries-database' ),

    async fetchCountries() {
        fetch( 'https://restcountries.eu/rest/v2/all?fields=name;flag;population' )
        .then( res => {
            if ( !res.ok ) throw res.statusText;
            return res.json();
        }).then( data => Array.from( data ) )
        .catch( err => { console.log( 'An error occured while fetching countries', err ) });
    },

    getCountries() {
        return model.countries;
    },

    getHasDatabase() {
        return model.hasDatabase;
    },

    saveCountires() {
        if ( 'indexedDB' in window ) {
            console.log( 'model.countries', model.countries );
            const req = indexedDB.open( model.databaseName, model.databaseVersion );
            req.onupgradeneeded = event => {
                const db = req.result;
                if ( !db.objectStoreNames.contains( 'countries' ) ) {
                    const store = db.createObjectStore( 'countries', { keyPath: 'name' } );
                    let count = 1;
                    for ( const country of model.countries ) {
                        store.put( country );
                    }
                    if ( count === model.countries.length ) {
                        console.log( 'All countries have been saved to the database' );
                        console.timeEnd( 'Done!' );
                    }
                }
            }
            // req.onsuccess = event => {
            //     const db = req.result;
            //     if ( !db.objectStoreNames.contains( 'countries' ) ) {
            //         db.createObjectStore( 'countries', { keyPath: 'name' } );
            //     }
            //     let count = 1;
            //     for ( const country of model.countries ) {
            //         const transAct = db.transaction( 'countries', 'readwrite' );
            //         const store = transAct.objectStore( 'countries' );
            //         store.put( country );
            //         transAct.oncomplete = () => { count++ }
            //     }
            //     if ( count === model.countries.length ) {
            //         console.log( 'All countries have been saved to the database' );
            //         console.timeEnd( 'Done!' );
            //     }
            // }
        }
    },

    setCountries( countries ) {
        model.countries = countries;
    }
}

const app = {
    default() {
        console.time( 'Done!' );
        if ( !model.getHasDatabase() ) {
            new Promise( async( resolve, reject ) => {
                const countries = await model.fetchCountries();

                if ( countries ) {
                    resolve( coutries );
                } else {
                    reject( new Error( 'An error occurred' ) );
                }
            }).then( value => {
                console.log( 'Got value', value );
            }, reason => {
                throw reason;
            })
        }
    }
}

const view = {
    countriesCardsCont: document.querySelector( '#countries-cards-container' ),

    createCountryCards( countries ) {
        for ( let country of countries ) {
            view.countriesCardsCont.innerHTML += `
                <div class='mdc-card mdc-card__primary-action'>
                    <div class="mdc-card__media mdc-card__media--16-9" style='background-image: url( "${ country.flag }" );'></div>
                    <h3 class='card-title'> ${ country.name } </h3>
                    <span class='card-sec-text'> ${ new Intl.NumberFormat( 'es' ).format( country.population ) } people </span>
                </div>`;
        }
        console.log( 'Created country cards' );
    }
}
app.default();