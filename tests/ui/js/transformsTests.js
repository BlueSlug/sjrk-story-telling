/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

"use strict";

(function ($, fluid) {

    jqUnit.test("Test stringToArray transform function", function () {
        jqUnit.expect(2);

        var expectedArray = ["tag1","tag2"];

        var stringToArrayTransform = {
            transform: {
                type: "sjrk.storyTelling.transforms.stringToArray",
                inputPath: "inputString"
            }
        };

        var tagArray = fluid.model.transformWithRules(
            {inputString: "tag1,tag2"},
            {output: stringToArrayTransform}
        ).output;

        var tagArrayNoSpace = fluid.model.transformWithRules(
            {inputString: "tag1, tag2"},
            {output: stringToArrayTransform}
        ).output;

        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArray);
        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArrayNoSpace);
    });

    jqUnit.test("Test tagArrayToDisplayString function", function () {
        jqUnit.expect(1);

        var arrayToStringTransform = {
            transform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                inputPath: "sourceArray"
            }
        };

        var expectedString = "tag1, tag2";

        var tagString = fluid.model.transformWithRules(
            {sourceArray: ["tag1", "tag2"]},
            {tagString: arrayToStringTransform}
        ).tagString;

        jqUnit.assertEquals("Generated array values are as expected", expectedString, tagString);
    });

})(jQuery, fluid);
