/*
Copyright 2017-2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global sjrk */

"use strict";

// classic query string parser via
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
sjrk.storyTelling.getParameterByName = function (name, url) {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ""; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

sjrk.storyTelling.loadStoryFromParameter = function (theme) {
    var storyId = sjrk.storyTelling.getParameterByName("id");
    if (storyId) {
        var storyUrl = "/stories/" + storyId;

        $.get(storyUrl, function (data) {
            var retrievedStory = JSON.parse(data);

            sjrk.storyTelling[theme].storyView({
                distributeOptions: {
                    "target": "{that story}.options.model",
                    "record": retrievedStory
                }
            });
        });
    }
};

sjrk.storyTelling.loadBrowse = function (theme) {
    var browseUrl = "/stories";
    $.get(browseUrl, function (data) {
        var browseResponse = JSON.parse(data);

        sjrk.storyTelling[theme].storyBrowse({
            distributeOptions: {
                "target": "{that storyBrowser}.options.model",
                "record": browseResponse
            }
        });
    });
};

sjrk.storyTelling.loadThemedPage = function (page, theme, callback) {
    var cssUrl = fluid.stringTemplate("src/%theme/css/%theme.css", {theme: theme});
    var scriptUrl = fluid.stringTemplate("src/%theme/js/%theme.js", {theme: theme});

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: cssUrl
    }).appendTo("head");

    $.getScript(scriptUrl, function () {
        callback(theme);
    });
};
