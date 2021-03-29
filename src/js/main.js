const btn = document.querySelector( '#dateBtn' );
btn.addEventListener( 'click', async () => {
    const res = await fetch( '/date' );
    if ( !res.ok ) throw res.statusText;
    const data = await res.json();
    document.querySelector( '#res' ).textContent = data.date;
});
console.log( 'btn', btn );