const express = require( 'express' );
const app = express();
const path = require( 'path' );
require( 'dotenv' ).config();
const PORT = process.env.PORT || 3000;

// Set-up Alpaca
const Alpaca = require( '@alpacahq/alpaca-trade-api' );
const alpaca = new Alpaca({
  keyId: process.env.KEY_ID,
  secretKey: process.env.SECRET_KEY,
  paper: true,
  usePolygon: false
});


// Middleware
app.use( express.static( path.join( __dirname, 'src' ) ) );

// Routing
app.get( '/', ( req, res ) => {
  res.sendFile( path.join( __dirname, 'src/index.html' ) );
  console.log( req.url );
})

// Date for checking the date of the server
app.get( '/date', ( req, res ) => {
  res.json( { date: new Date() } );
});

// PORT
app.listen( PORT, console.log( `app is listening on port ${ PORT }` ) );