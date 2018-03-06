var ws281x = require( 'rpi-ws281x-native' ),
    Config = require( './config' );

var segmentHighlight = function setSegmentHighlight ( segmentArray ) {
    console.log( 'segmentArray', segmentArray );
    // Setup
    console.log( 'highlighting segment', segmentArray );

    var range = Math.floor( Config.kLED_TOTAL_COUNT / Config.kSEGMENT_TOTAL_COUNT );

    // Init
    var pixelData = new Uint32Array(Config.kLED_TOTAL_COUNT);
    for ( var i = 0; i < Config.kLED_TOTAL_COUNT; i++ ) {
        pixelData[ i ] = 0;
    }
    ws281x.init( Config.kLED_TOTAL_COUNT );

    var createSegment = function ( range, segmentNumber, pixelData, hexColor ) {
	if (segmentNumber >= 0) { 
            var rgbColor = parseInt( hexColor, 16 );
            var startPosition = range * segmentNumber;
            for ( var i = 0; i < range; i++ ) {
                pixelData[ startPosition + i ] = rgbColor;
            }
        }
    }

    for ( var i = 0; i < segmentArray.length; i++ ) {
        createSegment( range, segmentArray[ i ]-1, pixelData, Config.kDEFAULT_SEGMENT_COLOR );
    }
    console.log( pixelData );
    ws281x.render( pixelData );
}

module.exports = segmentHighlight
