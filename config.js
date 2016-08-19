var
// Number of available options, each corresponds to a segment
segmentTotalCount = 9,
// Total connected LEDs
LEDTotalCount = 74;

module.exports = {
	kSERVER_URL: 'http://rpi-manuel.local',

	kCONTROL_EVENT_KEYNAME: 'control',
    kACTIVE_SEGMENTS_KEYNAME: 'segmentSet',
    kAVAILABLE_SEGMENTS_KEYNAME: 'segmentCount',

    kDEFAULT_SEGMENT_COLOR: 'ff0a74',
    kDEFAULT_ACTIVE_SEGMENTS: [ 0 ],
    kSEGMENT_TOTAL_COUNT: segmentTotalCount,
    kLED_TOTAL_COUNT: LEDTotalCount,
    kLED_PER_SEGMENT_COUNT: Math.floor( LEDTotalCount / segmentTotalCount )
}
