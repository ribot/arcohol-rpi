var ws281x = require( 'rpi-ws281x-native' ),
	http = require( 'http' ),
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
	var io = socket.connect( 'http://rpi-manuel.local' );

	io.sockets.on( 'connect', function handleConnect ( socket ) {
		console.log( 'client connected' );

		socket.on( 'control', function handleControl ( data ) {
			console.log( 'client received control event' );

			segments = data[ 'segmentCount' ];
			segmentSet = data[ 'segmentSet' ];

			segmentHighlight( '330016', segments, segmentSet );
		} );

	} );

	console.log( 'client initialized' );
}

// parse control events
var segmentHighlight = function setSegmentHighlight ( color, noOfSegments, segmentArray ) {
	// Setup

	var range = Math.floor(NUM_LEDS / noOfSegments);

	// Init
	var pixelData = new Uint32Array(NUM_LEDS);
	ws281x.init(NUM_LEDS);

	var createSegment = function(range, segmentNumber, pixelData, hexColor) {
	    var rgbColor = parseInt(hexColor, 16);
	    var startPosition = range * segmentNumber;
	    for (var i = 0; i < range; i++) {
	        pixelData[startPosition + i] = rgbColor;
	    }
	}

	for (var i = 0; i < segments.length; i++) {
		createSegment(range, segments[i]-1, pixelData, color);
	}
	ws281x.render(pixelData);
}
