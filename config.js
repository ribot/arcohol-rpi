// Number of available options, each corresponds to a segment
var segmentTotalCount = 32;
// Total connected LEDs
var LEDTotalCount = 224;

//ribot blue:  '0195d4'
//bright pink: 'ff0a74'
//dim pink:    '330016'

module.exports = {
    kSERVER_URL: 'http://rpi-arcohol',
    kCONTROL_EVENT_KEYNAME: 'control',
    kACTIVE_SEGMENTS_KEYNAME: 'segmentSet',
    kAVAILABLE_SEGMENTS_KEYNAME: 'segmentCount',

    kDEFAULT_SEGMENT_COLOR: '0195d4',
    kDEFAULT_ACTIVE_SEGMENTS: [ 0 ],
    kSEGMENT_TOTAL_COUNT: segmentTotalCount,
    kLED_TOTAL_COUNT: LEDTotalCount,
    kLED_PER_SEGMENT_COUNT: Math.floor( LEDTotalCount / segmentTotalCount )
}
