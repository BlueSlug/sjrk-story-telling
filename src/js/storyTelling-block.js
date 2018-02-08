/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.block", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            content: {
                // the contents of each block will depend on what kind of block it is
            },
            id: null,
            language: "",
            timestampCreated: null,
            timestampModified: null
        },
        listeners: {
            "{templateManager}.events.onAllResourcesLoaded": {
                funcName: "gpii.binder.applyBinding",
                args: "{binder}"
            }
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{block}.container",
                options: {
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyBlockMessages.json",
                        locale: "{block}.language"
                    }
                }
            },
            binder: {
                type: "gpii.binder",
                container: "{block}.container"
            }
        }
    });

})(jQuery, fluid);
