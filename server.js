const express = require( 'express' );
const app = express();
const path = require( 'path' );
const sourceURL = express.static( path.join( __dirname, 'src' ) );
const PORT = process.env.PORT || 3000;

// Middleware
app.use( express.static( sourceURL ) );

// Routing
app.get( '*', ( req, res ) => {
  res.sendFile( path.join( sourceURL, 'index.html' ) );
})

// PORT
app.listen( PORT, console.log( `app is listening on port ${ PORT }` ) );