/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // the data model of a video-type block
    fluid.defaults("sjrk.storyTelling.block.videoBlock", {
        gradeNames: ["sjrk.storyTelling.block.timeBased"],
        model: {
            blockType: "video"
        }
    });

})(jQuery, fluid);
