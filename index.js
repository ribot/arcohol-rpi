var http = require( 'http' ),
    socketio = require( 'socket.io' ),
    express = require( 'express' ),
    exec = require( 'child_process' ).exec,
    Lights = require( './segmentHighlight' ),
    app = express();

var server,
    io,
    controlEventName = 'control',
    segmentKeyName = 'segmentSet',
    segmentCountKeyName = 'segmentCount',
    stateModel = function () {
        var model = {};
        model[segmentKeyName] = segmentValue;
        model[segmentCountKeyName] = segmentMaxValue;
    
        return model;
    }(),
    segmentValue = [ 0 ],
    segmentMaxValue = 24,
    numOfLEDs = 256,
    LEDColor = 'ff0a74',
    start;

initServer();

function initServer () {
    console.log( 'initialising web server...' );
    server = http.createServer( app );
    io = socketio.listen( server );
    server.listen( 80, function handleListen () {
        // initClient();
    } );
}

function initClient () {
    console.log( 'initializing client' );
    // add this to silence: > /dev/null 2>&1
    exec('node client.js', function handleExec ( error, stdout, stderr ) {
        if (stdout !== null) { console.log('stdout: ' + stdout); }
        if (stdout !== null) { console.log('stderr: ' + stderr); }
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

// When any client connects
io.sockets.on( 'connection', function handleConnection ( socket ) {
    console.log( 'client connected' );
    // Emit defaults back to the specific connecting client
    stateModel[segmentKeyName] = segmentValue;
    stateModel[segmentCountKeyName] = segmentMaxValue;
    Lights.segmentHighlight( LEDColor, segmentMaxValue, 2, numOfLEDs );
    // emit back to the client
    socket.emit( controlEventName, stateModel );

    socket.on( controlEventName, function handleColor ( stateModel ) {
        console.log( controlEventName, stateModel );

        segmentValue = stateModel[segmentKeyName];

        // Emits the current state to all clients
        socket.broadcast.emit( controlEventName, stateModel );

        Lights.segmentHighlight( LEDColor, segmentMaxValue, segmentValue, numOfLEDs );
    });
});

// var debugInterval = setInterval( function iterateControl () {
//     segmentValue = (segmentValue >= segmentMaxValue) ? 0 : segmentValue + 1;
    
//     console.log(segmentValue);

//     io.sockets.emit( controlEventName, segmentValue );
// }, 1000 );

// clearTimeout(debugInterval);

// parse control events

