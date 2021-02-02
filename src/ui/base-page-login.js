/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The login page base grade
    fluid.defaults("sjrk.storyTelling.base.page.login", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        model: {
            // loginState can be one of the following values:
            // "ready" (the initial state), "requestSent", "responseReceived"
            loginState: "ready",
            loginButtonDisabled: false,
            progressAreaVisible: false,
            responseAreaVisible: false
        },
        modelListeners: {
            progressAreaVisible: {
                this: "{loginUi}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "progressAreaVisibleChange"
            },
            responseAreaVisible: {
                this: "{loginUi}.dom.responseArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "responseAreaVisibleChange"
            },
            loginButtonDisabled: {
                this: "{loginUi}.dom.logInButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "loginButtonDisabledChange"
            }
        },
        modelRelay: {
            "loginState": {
                target: "",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "loginState",
                    match: {
                        "ready": {
                            outputValue: {
                                loginButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: false
                            }
                        },
                        "requestSent": {
                            outputValue: {
                                loginButtonDisabled: true,
                                progressAreaVisible: true,
                                responseAreaVisible: false
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                loginButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: true
                            }
                        }
                    }
                }
            }
        },
        pageSetup: {
            logInUrl: "/login"
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onLoginUiReady: "{loginUi}.events.onControlsBound"
                }
            },
            onLogInRequested: "{loginUi}.events.onLogInRequested",
            onLogInSuccess: null,
            onLogInError: null
        },
        listeners: {
            // overwrite the listener to prevent losing the previous page URL
            "onCreate.setCurrentPage": null,
            "onLogInRequested.initiateLogin": "{that}.initiateLogin",
            "onLogInRequested.setStatePublishing": {
                changePath: "loginState",
                value: "requestSent"
            },
            "onLogInSuccess.saveAuthorAccountName": {
                func: "{that}.setAuthorAccountName",
                args: ["{arguments}.0"],
                priority: "before:redirect"
            },
            "onLogInSuccess.setStateReady": {
                changePath: "loginState",
                value: "ready"
            },
            "onLogInSuccess.redirect": {
                func: "{that}.redirectToUrl",
                args: ["{that}.model.persistedValues.currentPage"],
                priority: "last"
            },
            "onLogInError.setStateResponseReceived": {
                changePath: "loginState",
                value: "responseReceived"
            },
            "onLogInError.setResponseText": {
                func: "{that}.loginUi.setResponseText",
                args: ["{arguments}.0"]
            }
        },
        invokers: {
            initiateLogin: {
                funcName: "sjrk.storyTelling.base.page.login.initiateLogin",
                args: [
                    "{that}.loginDataSource",
                    { // model
                        email: "{loginUi}.model.email",
                        password: "{loginUi}.model.password"
                    },
                    { // options
                        successEvent: "{that}.events.onLogInSuccess",
                        failureEvent: "{that}.events.onLogInError"
                    }
                ]
            },
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.login.redirectToUrl",
                args: ["{arguments}.0"]
            }
        },
        components: {
            // the login context
            loginUi: {
                type: "sjrk.storyTelling.ui.loginUi",
                container: ".sjrkc-st-login-container"
            },
            // the data should be sent to the server using the dataSource
            // validation will be done by adding listeners to the onWrite
            // promise chain
            loginDataSource: {
                type: "fluid.dataSource.URL",
                options: {
                    gradeNames: ["fluid.dataSource.URL.writable"],
                    url: "{page}.options.pageSetup.logInUrl",
                    components: {
                        encoding: {
                            type: "fluid.dataSource.encoding.JSON"
                        }
                    },
                    listeners: {
                        "onWrite.impl": {
                            // this is what needs to be fiddled with
                            funcName: "fluid.dataSource.URL.handle",
                            args: ["{that}", "{arguments}.2", "{arguments}.1", "{arguments}.0"] // options, directModel, model
                        },
                        "onCreate.log": {
                            this: "console",
                            method: "log",
                            args: ["datasource onCreate fired"]
                        },
                        "onWrite.log": {
                            this: "console",
                            method: "log",
                            args: ["datasource onWrite fired", "{arguments}"]
                        }
                    }
                }
            }
        }
    });

    /**
     * Calls the login endpoint on the server (provided) and fires a success or error
     * event depending on the outcome. Success event returns the email address,
     * error event returns error details
     *
     * @param {Object} loginDataSource - an instance of `fluid.dataSource.URL.writable`
     * @param {Object} model - model data
     * @param {String} model.email - the author's email address
     * @param {String} model.password - the author's password
     * @param {Object} options - configuration options for the login call (see below)
     * @param {Object} options.successEvent - an infusion event to fire upon successful completion
     * @param {Object} options.failureEvent - an infusion event to fire on failure
     *
     * @return {Object} - a promise for the login call
     */
    sjrk.storyTelling.base.page.login.initiateLogin = function (loginDataSource, model, options) {
        var loginPromise = loginDataSource.set({}, model);

        loginPromise.then(function (data) { // success
            options.successEvent.fire(data.email);
        }, function (jqXHR, textStatus, errorThrown) { // failure
            var errorMessage = sjrk.storyTelling.base.page.getErrorMessageFromXhr(jqXHR, textStatus, errorThrown);
            options.failureEvent.fire(errorMessage);
        });

        return loginPromise;
    };

    /**
     * Logs the author into their account by calling the appropriate endpoint
     *
     * @param {String} logInUrl - the server URL to call to start a new session
     * @param {String} email - the author's email address
     * @param {String} password - the author's password
     *
     * @return {jqXHR} - the jqXHR for the server request
     */
    sjrk.storyTelling.base.page.login.logIn = function (logInUrl, email, password) {
        return $.ajax({
            url         : logInUrl,
            data        : JSON.stringify({
                email: email,
                password: password
            }),
            cache       : false,
            contentType : "application/json",
            processData : false,
            type        : "POST"
        });
    };

    /**
     * Redirects the author to the specified URL
     *
     * @param {String} redirectUrl - the URL to redirect to
     */
    sjrk.storyTelling.base.page.login.redirectToUrl = function (redirectUrl) {
        window.location.href = redirectUrl;
    };

})(jQuery, fluid);
