/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.storyView", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        events: {
            onAllUiComponentsReady: {
                events: {
                    onViewerReady: "{storyViewer}.events.onControlsBound"
                }
            }
        },
        components: {
            // the story view context
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: ".sjrkc-st-story-viewer"
            }
        }
    });

})(jQuery, fluid);
