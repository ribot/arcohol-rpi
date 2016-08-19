var ws281x = require( 'rpi-ws281x-native' ),
	http = require( 'http' ),
	Config = require( './configj.s' ),
	segmentHighlight = require( './segmentHighlight' ),
	socket = require( 'socket.io-client' );

// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});

var segments,
	segmentSet,
	NUM_LEDS = 10;

initClient();

// connect to the server
function initClient () {
	var io = socket.connect( Config.kSERVER_URL );

	io.sockets.on( 'connect', function handleConnect ( socket ) {
		console.log( 'client connected' );

		socket.on( 'control', function handleControl ( data ) {
			console.log( 'client received control event' );

			segments = data[ 'segmentCount' ];
			segmentSet = data[ 'segmentSet' ];

			segmentHighlight( segments );
		} );

	} );

	console.log( 'client initialized' );
}