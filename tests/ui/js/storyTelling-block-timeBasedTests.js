/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.block.testTimeBased", {
        gradeNames: ["sjrk.storyTelling.block.timeBased"],
        model: {
            heading: "Video of Rootbeer",
            alternativeText: "A video of a cute kitty",
            description: "This is a video of Rootbeer",
            transcript: ""
        }
    });

    fluid.defaults("sjrk.storyTelling.block.timeBasedTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test time-based block.",
            tests: [{
                name: "Test model relay",
                expect: 16,
                sequence: [{
                    funcName: "jqUnit.assertEquals", // 1110
                    args: ["Initial combined text is as expected", "Video of Rootbeer. A video of a cute kitty. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0110
                    args: ["Combined text is as expected", "A video of a cute kitty. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0010
                    args: ["Combined text is as expected", "This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", "Video of Shyguy"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1010
                    args: ["Combined text is as expected", "Video of Shyguy. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["description", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1000
                    args: ["Combined text is as expected", "Video of Shyguy", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", "A video of another cute kitty"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1100
                    args: ["Combined text is as expected", "Video of Shyguy. A video of another cute kitty", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0100
                    args: ["Combined text is as expected", "A video of another cute kitty", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0000
                    args: ["Combined text is as expected", "", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["transcript", "Rootbeer: krrraow"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0001
                    args: ["Combined text is as expected", "Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["description", "This is a video of Rootbeer"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0011
                    args: ["Combined text is as expected", "This is a video of Rootbeer. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", "A video of a cute kitty"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0111
                    args: ["Combined text is as expected", "A video of a cute kitty. This is a video of Rootbeer. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", "Video of Rootbeer"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1111
                    args: ["Combined text is as expected", "Video of Rootbeer. A video of a cute kitty. This is a video of Rootbeer. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1011
                    args: ["Combined text is as expected", "Video of Rootbeer. This is a video of Rootbeer. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["description", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1001
                    args: ["Combined text is as expected", "Video of Rootbeer. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", "A video of a cute kitty"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 1101
                    args: ["Combined text is as expected", "Video of Rootbeer. A video of a cute kitty. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 0101
                    args: ["Combined text is as expected", "A video of a cute kitty. Rootbeer: krrraow", "{timeBased}.model.contentString"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.timeBasedTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            timeBased: {
                type: "sjrk.storyTelling.block.testTimeBased",
                container: "#testImageBlock"
            },
            timeBasedTester: {
                type: "sjrk.storyTelling.block.timeBasedTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.timeBasedTest"
        ]);
    });

})(jQuery, fluid);
