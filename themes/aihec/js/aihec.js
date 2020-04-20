/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.aihec.page", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        distributeOptions: [{
            target: "{that > menu > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/aihec-menu.handlebars"
        },
        {
            target: "{that > masthead > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/aihecMessages.json",
                templatePath: "%resourcePrefix/templates/aihec-masthead.handlebars"
            }
        },
        {
            target: "{that > footer > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/aihecMessages.json",
                templatePath: "%resourcePrefix/templates/aihec-footer.handlebars"
            }
        }],
        components: {
            // the masthead of the site
            masthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container"
            },
            // the footer of the site
            footer: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-footer-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        resourcePrefix: "{that}.options.templateConfig.resourcePrefix"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the AIHEC shell to the storyView page
    fluid.defaults("sjrk.storyTelling.aihec.page.storyView", {
        gradeNames: ["sjrk.storyTelling.aihec.page", "sjrk.storyTelling.base.page.storyView"],
        distributeOptions: {
            target: "{that > storyViewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/aihec-storyViewer.handlebars"
        }
    });

    // Applies the AIHEC shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.aihec.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.aihec.page", "sjrk.storyTelling.base.page.storyBrowse"],
        distributeOptions: [{
            target: "{that > storyBrowser > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/aihec-storyBrowser.handlebars"
        },{
            target: "{that > masthead > templateManager}.options.model.dynamicValues",
            record: {
                currentPage: "storyBrowse"
            }
        }],
        components: {
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "src/img/icons/Book.svg"
                    }
                }
            }
        }
    });

    // Applies the AIHEC shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.aihec.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.aihec.page", "sjrk.storyTelling.base.page.storyEdit"],
        distributeOptions: [{
            target: "{that > storyEditor > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/aihec-storyEditor.handlebars"
        },
        {
            target: "{that > storyPreviewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/aihec-storyViewer.handlebars"
        },
        {
            target: "{that > masthead > templateManager}.options.model.dynamicValues",
            record: {
                currentPage: "storyEdit"
            }
        }]
    });

    fluid.defaults("sjrk.storyTelling.aihec.page.welcome", {
        gradeNames: ["sjrk.storyTelling.aihec.page"],
        distributeOptions: [{
            target: "{that > welcome > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/aihecMessages.json",
                templatePath: "%resourcePrefix/templates/aihec-welcome.handlebars"
            }
        },
        {
            target: "{that > masthead > templateManager}.options.model.dynamicValues",
            record: {
                currentPage: "welcome"
            }
        }],
        components: {
            welcome: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-welcome"
            }
        }
    });

})(jQuery, fluid);