const express = require( 'express' );
const app = express();
const path = require( 'path' );
const PORT = process.env.PORT || 3000;
let isLogicRunning = false;
const fileSystem = require( 'fs' );
const bodyParser = require( 'body-parser' );
const JSON_FILE_PATH = 'ps.json';

// Load env variables on in development mode
if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}

// Set-up Alpaca
const Alpaca = require( '@alpacahq/alpaca-trade-api' );
const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secretKey: process.env.APCA_API_SECRET_KEY,
  paper: process.env.APCA_API_BASE_URL,
  usePolygon: false
});

// Middleware
app.use( express.static( path.join( __dirname, 'src' ) ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Routing
app.get( '/', ( req, res ) => {
  res.sendFile( path.join( __dirname, 'src/index.html' ) );
})

// Gets the VAPID public key to the user
app.get( '/key', ( req, res ) => {
  res.send( process.env.VAPID_PUBLIC_KEY );
});

// Saves the data to a json file
app.post( '/update', ( req, res ) => {
  fileSystem.writeFile( JSON_FILE_PATH, JSON.stringify( req.body ), ( err ) => {
    if ( err ) throw err;
    res.send( 'Data successfully sent to the server!' );
    if ( !isLogicRunning ) {
      require( './logic' )( alpaca );
      isLogicRunning = true;
    }
  })
});

// PORT
app.listen( PORT, () => {
  console.log( `app is listening on port ${ PORT }` );
});