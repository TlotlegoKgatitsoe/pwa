const DB_NAME = 'test-app';
const DB_VERSION = 1;
var mEvent;

const createDB = () => {
  return new Promise( ( resolve, reject ) => {
    const req = indexedDB.open( DB_NAME, DB_VERSION );
    req.onupgradeneeded = event => {
      const db = event.target.result;
      if ( event.oldVersion < 1 ) {
        db.createObjectStore( 'mmino' );
      }
    }
    req.onsuccess = event => resolve( event.target.result );
    req.onerror = event => reject( event.error );
  })
}
console.time( 'DB done' );
createDB().then( db => {
  console.log( 'Database created', db );
  console.timeEnd( 'DB done' );
});
indexedDB.deleteDatabase( DB_NAME );
console.log( 'mEvent', mEvent );

// const button = document.querySelector( '.mdc-button' );
// const snackbar = mdc.snackbar.MDCSnackbar.attachTo( document.querySelector( '.mdc-snackbar' ) );
// mdc.ripple.MDCRipple.attachTo( button );
// const menu = mdc.menu.MDCMenu.attachTo( document.querySelector( '.app-menu' ) );
// document.querySelector( '#firstIcon' ).addEventListener( 'click', () => {
//     if ( !menu.open ) menu.open = true;
// })

// // Menu stuff
// menu.listen( 'MDCMenuSurface:opened', event => {
//     console.log( 'MDCMenu', event );
// })

// console.log( 'mdc', menu );

// button.addEventListener( 'click', () => {
//   if ( !snackbar.isOpen ) snackbar.open();
// });



// fetch( 'https://restcountries.eu/rest/v2/currency/zar?fields=name;population;flag;capital' )
// .then( res => {
//     if ( !res.ok ) throw res.statusText;
//     return res.json();
// })
// .then( countries => {
//     const countriesCardsCont = document.querySelector( '#countries-cards-container' );
//     for ( const country of countries ) {
//         countriesCardsCont.innerHTML += `
//             <div class='mdc-card mdc-card__primary-action'>
//                 <div class="mdc-card__media mdc-card__media--16-9" style='background-image: url( "${ country.flag }" );'></div>
//                 <h3 class='card-title'> ${ country.name } </h3>
//                 <span class='card-sec-text'> ${ new Intl.NumberFormat( 'en' ).format( country.population ) } people </span>
//             </div>`;
//     }
// })

// {flag: "https://restcountries.eu/data/lso.svg", name: "Lesotho", capital: "Maseru", population: 1894194}
// 1: {flag: "https://restcountries.eu/data/nam.svg", name: "Namibia", capital: "Windhoek", population: 2324388}
// 2: {flag: "https://restcountries.eu/data/zaf.svg", name: "South Africa", capital: "Pretoria", population: 55653654}
// 3: {flag: "https://restcountries.eu/data/zwe.svg", name: "Zimbabwe", capital: "Harare", population: 14240168}
// length: 4