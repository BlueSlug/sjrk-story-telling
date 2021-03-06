/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // the common, shared data model of all blocks
    fluid.defaults("sjrk.storyTelling.block", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            //blockType: "", // to be supplied by implementing block formats
            id: null,
            language: null,
            heading: null
        }
    });

})(jQuery, fluid);
