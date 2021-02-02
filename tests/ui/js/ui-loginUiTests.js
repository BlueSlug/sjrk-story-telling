/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the loginUi grade
    fluid.defaults("sjrk.storyTelling.ui.testLoginUi", {
        gradeNames: ["sjrk.storyTelling.ui.loginUi"],
        // invokers: {
        //     handleValidationResults: {
        //         funcName: "jqUnit.assertDeepEq",
        //         args: ["Stub for handleValidationResults was called with expected args", [], "{arguments}.0"]
        //     },
        // },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    // sjrk.storyTelling.ui.loginUiTester.validationTestCases = {
    //     // missing
    //     missingInput: {
    //         expectedResults: {
    //         },
    //         email: undefined,
    //         password: undefined
    //     },
    //     // too short
    //     emailFormatIncorrect: {
    //         expectedResults: {
    //         },
    //         email: "2",
    //         password: undefined
    //     },
    //     // wrong format for email
    //
    //     // wrong data type for email (not string)
    //     // wrong data type for password (not string
    // };

    // Test cases and sequences for the Login UI
    fluid.defaults("sjrk.storyTelling.ui.loginUiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Login UI.",
            tests: [{
                name: "Test UI controls",
                expect: 3,
                sequence: [{
                    "event": "{loginUiTest loginUi}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["LoginUi's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{loginUi}.dom.logInButton"
                },
                {
                    "event": "{loginUi}.events.onLogInRequested",
                    listener: "jqUnit.assert",
                    args: ["onLogOutRequested event fired"]
                },
                {
                    func: "{loginUi}.setResponseText",
                    args: ["Shyguy is a soft, gentle cat"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{loginUi}.dom.responseText", "Shyguy is a soft, gentle cat"]
                // },
                // {
                //     funcName: "{that}.handleValidationResults",
                //     args: [""]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.ui.loginUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            loginUi: {
                type: "sjrk.storyTelling.ui.testLoginUi",
                container: "#testLoginUi",
                createOnEvent: "{loginUiTester}.events.onTestCaseStart"
            },
            loginUiTester: {
                type: "sjrk.storyTelling.ui.loginUiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.loginUiTest"
        ]);
    });

})(jQuery, fluid);
