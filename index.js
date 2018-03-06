var http = require( 'http' ),
    socketio = require( 'socket.io' ),
    express = require( 'express' ),
    exec = require( 'child_process' ).exec,
    Config = require( './config' ),
    segmentHighlight = require( './segmentHighlight' ),
    app = express();

var server, io;

var stateModel = function stateModelConstructor () {
    var model = {};
    model[ Config.kACTIVE_SEGMENTS_KEYNAME ] = Config.kDEFAULT_ACTIVE_SEGMENTS;
    model[ Config.kAVAILABLE_SEGMENTS_KEYNAME ] = Config.kSEGMENT_TOTAL_COUNT;
    
    return model;
}();

initServer();

function initServer () {
    console.log( 'initialising web server...' );

    server = http.createServer( app );
    io = socketio.listen( server );

    server.listen( 80, function handleListen () {
        // initClient( io );
        console.log( "web server started on " + Config.kSERVER_URL )
    } );

    //tell the server that ./public/ contains the static webpages
    app.use(express.static('public'));
};

// function initClient () {
//     console.log( 'initializing client' );
//     // add this to silence: > /dev/null 2>&1
//     exec( 'node client.js', function handleExec ( error, stdout, stderr ) {
//         if (stdout !== null) { console.log('stdout: ' + stdout); }
//         if (stdout !== null) { console.log('stderr: ' + stderr); }
//         if (error !== null) {
//             console.log( 'exec error: ' + error );
//         }
//     } );
// };

// When any client connects
io.sockets.on( 'connection', function handleConnection ( socket ) {
    console.log( 'client connected' );

    // Emit defaults back to the specific connecting client
    segmentHighlight( stateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ] );
    // emit back to the client
    socket.emit( Config.kCONTROL_EVENT_KEYNAME, stateModel );

    socket.on( Config.kCONTROL_EVENT_KEYNAME, function handleControlEvent ( clientStateModel ) {
        console.log( Config.kCONTROL_EVENT_KEYNAME, clientStateModel );
        // Update the current state from the client
        stateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ] = clientStateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ];

        // Emits the current state to all clients
        socket.broadcast.emit( Config.kCONTROL_EVENT_KEYNAME, stateModel );
        //socket.emit( Config.kCONTROL_EVENT_KEYNAME, stateModel );

        // Update highlighted segmetns
        segmentHighlight( stateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ] );
    } );
} );
