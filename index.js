var http = require( 'http' ),
    socketio = require( 'socket.io' ),
    express = require( 'express' ),
    exec = require( 'child_process' ).exec,
    Config = require( './config' ),
    segmentHighlight = require( './segmentHighlight' ),
    app = express();

var server,
    io,
    stateModel = function stateModelConstructor () {
        var model = {};
        model[ Config.kACTIVE_SEGMENTS_KEYNAME ] = activeSegments;
        model[ Config.kAVAILABLE_SEGMENTS_KEYNAME ] = availableSegmentCount;
    
        return model;
    }(),
    activeSegments = [ 0 ],
    // Number of available options, each corresponds to a segment
    availableSegmentCount = 9,
    // Total LED count on all connected strips
    totalLEDCount = 64,
    segmentLEDCount = Math.floor( 64 / 9 );

initServer();

function initServer () {
    console.log( 'initialising web server...' );

    server = http.createServer( app );
    io = socketio.listen( server );

    server.listen( 80, function handleListen () {
        // initClient( io );
        console.log( 'web server started on http://rpi-manuel.local' )
    } );
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
    stateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ] = activeSegments;
    stateModel[ Config.kAVAILABLE_SEGMENTS_KEYNAME ] = availableSegmentCount;
    segmentHighlight( 2 );
    // emit back to the client
    socket.emit( Config.kCONTROL_EVENT_KEYNAME, stateModel );

    socket.on( Config.kCONTROL_EVENT_KEYNAME, function handleColor ( stateModel ) {
        console.log( Config.kCONTROL_EVENT_KEYNAME, stateModel );
        activeSegments = stateModel[ Config.kACTIVE_SEGMENTS_KEYNAME ];

        // Emits the current state to all clients
        socket.broadcast.emit( Config.kCONTROL_EVENT_KEYNAME, stateModel );

        segmentHighlight( activeSegments );
    } );
} );
