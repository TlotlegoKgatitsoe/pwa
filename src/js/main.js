const pushBtn = document.querySelector( '#push-button' );

const urlBase64ToUint8Array = ( base64String ) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

Notification.requestPermission( isAllowed => {
    if ( isAllowed ) {
        navigator.serviceWorker.ready.then( async reg => {
            
        })
    }
})

// Check if the user is subscribed to push service
navigator.serviceWorker.ready.then( reg => {
    reg.pushManager.getSubscription().then( async sub => {
        if ( !sub ) {
            pushBtn.style.display = 'block';
        } else {
            window.ondblclick = () => {
                sendToServer( sub.toJSON() );
            }
        }
    })
})





pushBtn.addEventListener( 'click', async () => {
    pushBtn.style.display = 'none';
    navigator.serviceWorker.getRegistration().then( async reg => {
        const res = await fetch( '/key' );
        if ( !res.ok ) throw res.statusText;
        const key = await res.text();
        reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array( key )
        }).then( sub => {
            sendToServer( sub.toJSON() );
        })
    })
})

const sendToServer = async ( data ) => {
    const res = await fetch( '/update', {
        method: 'POST',
        body: JSON.stringify( data ),
        headers: { "Content-type": "application/json" }
    })
    if ( !res.ok ) throw res.statusText;
    const msg = await res.text();
    if ( msg ) console.log( msg );
}