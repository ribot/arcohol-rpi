// nice pink: 0x330016
// bright pink: 0xff0a74

// // Arguments
// var color = process.argv[2];
// var noOfSegments = parseInt(process.argv[3], 10) || 1;
// var segments = process.argv.slice(4);

var ws281x = require( 'rpi-ws281x-native' );

var segmentHighlight = function setSegmentHighlight ( color, noOfSegments, segmentArray, numOfLEDs ) {
    console.log( 'segmentArray', segmentArray );
    // Setup
    console.log( 'highlighting segment', segmentArray );

    var range = Math.floor(numOfLEDs / noOfSegments);

    // Init
    var pixelData = new Uint32Array(numOfLEDs);
    ws281x.init(numOfLEDs);

    var createSegment = function(range, segmentNumber, pixelData, hexColor) {
        var rgbColor = parseInt(hexColor, 16);
        var startPosition = range * segmentNumber;
        for (var i = 0; i < range; i++) {
            pixelData[startPosition + i] = rgbColor;
        }
    }

    for (var i = 0; i < segmentArray.length; i++) {
        createSegment(range, segmentArray[i]-1, pixelData, color);
    }
    console.log(pixelData);
    ws281x.render(pixelData);
}

// segmentHighlight(color, noOfSegments, segments);

module.exports = { segmentHighlight: segmentHighlight }
