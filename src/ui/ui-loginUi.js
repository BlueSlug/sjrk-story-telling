/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI representing the "login" form of the login page
    fluid.defaults("sjrk.storyTelling.ui.loginUi", {
        gradeNames: ["sjrk.storyTelling.ui", "fluid.schema.modelComponent"],
        modelSchema: {
            "$schema": "fss-v7-full#",
            type: "object",
            properties: {
                email: {
                    type: "string",
                    required: true,
                    format: "email",
                    minLength: 3
                },
                password: {
                    type: "string",
                    required: true,
                    minLength: 8
                }
            }
        },
        validationErrorMapping: {
            /*
             * this collection is meant to map the localized error message keys
             * to their corresponding validationResults error paths
             * the format is:
             *
             * localized_error_message_name: "error.schema.path"
             */
            error_email_blank: "properties.email.required",
            error_email_format: "properties.email.format",
            error_email_length: "properties.email.minLength",
            error_password_blank: "properties.password.required",
            error_password_length: "properties.password.minLength"
        },
        model: {
            email: undefined, // the author's email
            password: undefined // the author's password
        },
        modelListeners: {
            "validationResults": {
                func: "{that}.handleValidationResults",
                args: ["{change}.value"],
                excludeSource: ["init"],
                namespace: "handleValidationResults"
            }
        },
        selectors: {
            logInButton: ".sjrkc-st-login-button",
            emailInput: ".sjrkc-st-login-email-input",
            passwordInput: ".sjrkc-st-login-password-input",
            progressArea: ".sjrkc-st-login-progress",
            responseArea: ".sjrkc-st-login-response",
            responseText: ".sjrkc-st-login-response-text"
        },
        invokers: {
            handleValidationResults: {
                funcName: "sjrk.storyTelling.ui.loginUi.handleValidationResults",
                args: [
                    "{that}",
                    "{arguments}.0", // validationResults
                    "{templateManager}.templateStrings.localizedMessages.validationErrors",
                    "{that}.options.validationErrorMapping"
                ]
            },
            setResponseText: {
                this: "{loginUi}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        events: {
            onLogInRequested: null
        },
        listeners: {
            "onReadyToBind.bindLogInButton": {
                "this": "{that}.dom.logInButton",
                "method": "click",
                "args": ["{that}.events.onLogInRequested.fire"],
                "priority": "before:fireOnControlsBound"
            },
            "onCreate.validateModel": undefined // disable onCreate validation
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/login.hbs"
                    }
                }
            },
            // for binding the input fields to the data model
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{loginUi}.container",
                options: {
                    model: "{loginUi}.model",
                    selectors: "{loginUi}.options.selectors",
                    listeners: {
                        "{loginUi}.events.onReadyToBind": {
                            func: "{that}.events.onUiReadyToBind",
                            namespace: "applyLoginUiBinding"
                        }
                    },
                    bindings: {
                        emailInput: "email",
                        passwordInput: "password"
                    }
                }
            }
        }
    });

    /**
     * Processes the input validation results and displays a localized summary
     * of validation errors if the input is not valid
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.ui.loginUi`
     * @param {Object} validationResults - the validationResults collection from `fluid-json-schema`
     *     @see {@link https://github.com/fluid-project/fluid-json-schema/blob/v2.1.4/docs/schemaValidatedModelComponent.md#the-model-validation-cycle}
     * @param {String[]} localizedErrorMessages - a collection of localized error messages
     * @param {Object} validationErrorMapping - a mapping of localized error message names to validator schema paths
     *     @see the component option "validationErrorMapping" for details
     */
    sjrk.storyTelling.ui.loginUi.handleValidationResults = function (that, validationResults, localizedErrorMessages, validationErrorMapping) {
        if (validationResults && !validationResults.isValid) {
            var loginErrorsLocalized = "";

            fluid.each(validationResults.errors, function (error) {
                var joinedSchemaPath = error.schemaPath.join(".");
                var messageKey = fluid.keyForValue(validationErrorMapping, joinedSchemaPath);
                loginErrorsLocalized += localizedErrorMessages[messageKey] + " ";
            });

            that.setResponseText(loginErrorsLocalized);
        }
    };
})(jQuery, fluid);
