let alpaca = null;
let clock = null;
const fileSystem = require( 'fs' );
const webPush = require( 'web-push' );

const applyStrategy = ( bars ) => {
  const fastMA = calcSMA( bars, 2 );
  const mediumMA = calcSMA( bars, 9 );
  const slowMA = calcSMA( bars, 27 );
  checkForBuy( slowMA, mediumMA, fastMA );
  checkForSell( slowMA, mediumMA, fastMA );
}

const calcSMA = ( bars, period ) => {
    let sum = 0;
    const periodBars = bars.slice( 0, period );
    for ( let bar of periodBars ) {
      sum += bar.closePrice;
    }
    return sum / period;
};

const checkForBuy = ( slowMA, mediumMA, fastMA ) => {
  let isFastOverSlow = fastMA > slowMA;
  let isMediumClose = slowMA > mediumMA && ( slowMA - mediumMA ) < 0.3;

  if ( isFastOverSlow && isMediumClose ) {
    notifyUser( 'Go and buy Facebook!' );
  }
};

const checkForSell = ( slowMA, mediumMA, fastMA ) => {
  let isFastUnderSlow = fastMA < slowMA;
  let isMediumClose = mediumMA > slowMA && ( mediumMA - slowMA ) < 0.2;

  if ( isFastUnderSlow && isMediumClose ) {
    notifyUser( 'Go and sell Facebook!' );
  }
}

// Creates to send the user a message a notification
const createNotification = ( pushSubscription, payload ) => {
  var options = {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    },
    TTL: 60
  };
  webPush.sendNotification( pushSubscription, payload, options );
}

const fetchBars = ( assetName, timeframe, numberOfBars ) => {
  alpaca.getBars( timeframe, assetName, { limit: numberOfBars }).then( data => {
    const bars = data[ assetName ].reverse();
    notifyUser( 'Got bars' );
    for ( let bar of bars ) {
      bar.date = new Date( bar.startEpochTime * 1000 );
    }
    applyStrategy( bars );
  });
}

const checkForSignals = ( isOpen ) => {
  setInterval( () => {
    if ( isOpen ) {
      fetchBars( 'FB', '5Min', 27 );
    }
  }, 300000 );
}

const notifyUser = ( message ) => {
  fileSystem.readFile( 'ps.json', ( err, data ) => {
    if ( err ) throw err;
    if ( data ) createNotification( JSON.parse( data ), message );
  })
}

module.exports = ( alpc ) => {
  alpaca = alpc;
  alpaca.getClock().then( clock => {
    notifyUser( 'I am running...' );
    checkForSignals( clock.is_open );
  })
}