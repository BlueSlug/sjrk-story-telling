/*
Copyright 2020 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk, sinon */

"use strict";

(function ($, fluid) {

    var mockServer;

    jqUnit.test("Test getParameterByName function", function () {
        var testCases = [
            { // test retrieval of set value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=testValue",
                expected: "testValue"
            },
            { // test retrieval of empty value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=",
                expected: ""
            },
            { // test retrieval of set value from falsy URL
                parameter: "testParameter",
                url: null,
                expected: null
            },
            { // test retrieval of null value from provided URL
                parameter: null,
                url: "testUrl?testParameter=testValue",
                expected: null
            },
            { // test retrieval of set value from page URL
                parameter: "testParameterFromUrl",
                url: "",
                expected: "testValue"
            },
            { // test retrieval of null value from page URL
                parameter: null,
                url: "",
                expected: null
            },
            { // test retrieval of empty value from page URL
                parameter: "emptyTestParameterFromUrl",
                url: "",
                expected: ""
            },
            { // test retrieval of missing value from page URL
                parameter: "testParameterNotInUrl",
                url: "",
                expected: null
            }
        ];

        jqUnit.expect(testCases.length);

        fluid.each(testCases, function (testCase, index) {
            if (index === 4) {
                sjrk.storyTelling.testUtils.setQueryString("testParameterFromUrl=testValue&emptyTestParameterFromUrl=");
            }

            var actualResult = sjrk.storyTelling.pageLoader.getParameterByName(testCase.parameter, testCase.url);
            jqUnit.assertEquals("Query string parameter '" + testCase.parameter + "' is retrieved as expected", testCase.expected, actualResult);
        });
    });

    fluid.defaults("sjrk.storyTelling.testPageLoader", {
        gradeNames: ["sjrk.storyTelling.pageLoader"],
        baseTestCase: {
            clientConfig: {
                theme: "base",
                baseTheme: "base",
                authoringEnabled: true
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.pageLoaderTester", {
        gradeNames: ["fluid.modelComponent", "fluid.test.testCaseHolder"],
        modules: [{
            name: "Test loadClientConfig",
            tests: [{
                name: "Test loadClientConfig event, listener and invoker",
                expect: 2,
                sequence: [{
                    event: "{pageLoaderTest pageLoader}.events.onCreate",
                    listener: "jqUnit.assertDeepEq",
                    args: ["The pageLoader clientConfig collection is empty on creation", {}, "{pageLoader}.model.clientConfig"]
                },{
                    funcName: "sjrk.storyTelling.pageLoaderTester.setupMockServer",
                    args: ["/clientConfig", "{pageLoader}.options.baseTestCase.clientConfig", "application/json"]
                },{
                    event: "{pageLoaderTest pageLoader}.events.onClientConfigLoaded",
                    listener: "jqUnit.assertDeepEq",
                    args: ["The pageLoader clientConfig collection is not empty after loading", "{pageLoader}.options.baseTestCase.clientConfig", "{pageLoader}.model.clientConfig"]
                },{
                    funcName: "sjrk.storyTelling.pageLoaderTester.teardownMockServer"
                }]
            }]
        }]
    });

    sjrk.storyTelling.pageLoaderTester.setupMockServer = function (url, clientConfig) {
        mockServer = sinon.createFakeServer();
        mockServer.respondImmediately = true;
        mockServer.respondWith(url, [200, { "Content-Type": "application/json"}, JSON.stringify(clientConfig)]);
    };

    sjrk.storyTelling.pageLoaderTester.teardownMockServer = function () {
        mockServer.restore();
    };

    sjrk.storyTelling.pageLoaderTester.verifyCustomCssLoaded = function (clientConfig, expectedCssInstanceCount) {
        if (clientConfig.theme === clientConfig.baseTheme) {
            expectedCssInstanceCount = 0; // if no custom theme is set, we actually expect zero custom files
        }

        var actualInstanceCount = $("link[href$=\"" + clientConfig.theme + ".css\"]").length;
        jqUnit.assertEquals("Custom theme CSS file is linked the expected number of instances", expectedCssInstanceCount, actualInstanceCount);
    };

    fluid.defaults("sjrk.storyTelling.pageLoaderTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            pageLoader: {
                type: "sjrk.storyTelling.testPageLoader",
                createOnEvent: "{pageLoaderTester}.events.onTestCaseStart"
            },
            pageLoaderTester: {
                type: "sjrk.storyTelling.pageLoaderTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.pageLoaderTest"
        ]);
    });

})(jQuery, fluid);
