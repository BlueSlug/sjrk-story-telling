/*
Copyright 2020 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.pageLoader", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            clientConfig: {
                // the theme is used by the page. attempts will be made to load CSS
                // and JavaScript files for the theme from the paths
                // "/js/theme.js" and "/css/theme.css" where "theme" is the theme value
                // theme: "",
                // baseTheme: "",
                // authoringEnabled: false
            }
        },
        members: {
            baseUrl: "/%path",
            clientConfigUrl: "clientConfig",
            customThemesCssPath: "css/%theme.css",
            customThemesJsPath: "js/%theme.js"
        },
        events: {
            onClientConfigLoaded: null,
            onThemeFilesLoaded: null,
            onThemeLoadError: null
        },
        listeners: {
            "onCreate.loadClientConfig": "{that}.loadClientConfig"
        },
        invokers: {
            // load the clientConfig
            loadClientConfig: {
                funcName: "sjrk.storyTelling.pageLoader.getClientConfig",
                args: ["{that}.clientConfigUrl", "{that}"]
            }
            // load the theme files
            // load the theme css files
            // load the theme js files
        },
        components: {
            dataSource: {
                type: "fluid.dataSource.URL",
                options: {
                    url: "{pageLoader}.baseUrl",
                    termMap: {
                        path: "%path"
                    }
                }
            }
        }
    });

    /* A classic query string parser via
     * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     * - "name": the name of the query string variable to retrieve
     * - "url": an optional URL to parse. Uses actual page URL if not provided
     */
    sjrk.storyTelling.pageLoader.getParameterByName = function (name, url) {
        if (!url) { url = window.location.href; }
        if (name) { name = name.replace(/[\[\]]/g, "\\$&"); }
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ""; }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    sjrk.storyTelling.pageLoader.getClientConfig = function (url, pageLoader) {
        var loadPromise = pageLoader.dataSource.get(null, {path: url});

        loadPromise.then(function (clientConfig) {
            pageLoader.applier.change("clientConfig", clientConfig);
            pageLoader.events.onClientConfigLoaded.fire(clientConfig);
        }, function (jqXHR, textStatus, errorThrown) {
            console.log("failure :(", {
                isError: true,
                message: errorThrown
            });
        });

        return loadPromise;
    };

    /* Loads CSS and JavaScript files for the provided theme into the page markup.
     * Upon completion it will fire either a success or error event.
     * - "clientConfig": a collection of client config values consisting of
     *     - "theme": the current theme of the site
     *     - "baseTheme": the base theme of the site
     *     - "authoringEnabled": indicates whether story saving and editing are enabled
     */
    sjrk.storyTelling.pageLoader.loadCustomThemeFiles = function (that) {
        if (that.model.clientConfig.theme && (that.model.clientConfig.theme !== that.model.clientConfig.baseTheme)) {
            var cssUrl = fluid.stringTemplate(that.customThemesCssPath, {theme: that.model.clientConfig.theme});
            var scriptUrl = fluid.stringTemplate(that.customThemesJsPath, {theme: that.model.clientConfig.theme});

            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: cssUrl
            }).appendTo("head");

            // TODO: This method of loading produces a potential race condition
            // See SJRK-272: https://issues.fluidproject.org/browse/SJRK-272
            $.getScript(scriptUrl, function () {
                that.events.onThemeFilesLoaded.fire(that.model.clientConfig);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                that.events.onThemeLoadError.fire({
                    isError: true,
                    message: errorThrown
                });
            });
        }
    };

})(jQuery, fluid);
