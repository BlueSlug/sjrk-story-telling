/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.page.testStoryEdit", {
        gradeNames: ["sjrk.storyTelling.page.storyEdit"],
        pageSetup: {
            resourcePrefix: "../..",
            savingEnabled: false
        },
        selectors: {
            mainContainer: "#testMainContainer",
            pageContainer: "#testPageContainer"
        },
        listeners: {
            "onStoryShareRequested.submitStory": {
                funcName: "fluid.identity"
            }
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "../../src/messages/uio"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            },
            storyEtiquette: {
                container: "#testStoryEtiquette"
            },
            storyEditor: {
                container: "#testStoryEditor",
                options: {
                    events: {
                        onNewBlockTemplateRendered: null
                    },
                    components: {
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        listeners: {
                                                            "onTemplateRendered.notifyTestStoryEditor": {
                                                                func: "{storyEditor}.events.onNewBlockTemplateRendered.fire",
                                                                args: ["{editor}"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            storyPreviewer: {
                container: "#testStoryPreviewer"
            }
        }
    });

    var expectedVisibility = {
        prePublish: {
            progressArea: false,
            responseArea: false,
            shareButton: false
        },
        duringPublish: {
            progressArea: true,
            responseArea: false,
            shareButton: true
        },
        postPublish: {
            progressArea: false,
            responseArea: true,
            shareButton: false
        }
    };

    fluid.defaults("sjrk.storyTelling.page.storyEditTester.addBlock", {
        gradeNames: "fluid.test.sequenceElement",
        blockType: "null", // to be supplied by the implementing test
        sequence: [{
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
        },
        {
            funcName: "jqUnit.assertEquals", // this works
            args: ["This is as I expect it to be", "Text", "{that}.options.blockType"]
        },
        // {
        //     "jQueryTrigger": "click", // this does not
        //     "element": "@expand:sjrk.storyTelling.page.storyEditTester.getButtonNameFromBlockType({that}.options.blockType)"
        // },
        {
            funcName: "jqUnit.assertEquals", // this works. {that} is the sequenceElement
            args: ["This is as I expect it to be", "sjrk.storyTelling.page.storyEditTester.addBlock", "{that}.typeName"]
        },
        {
            "jQueryTrigger": "click", // this does not. {that} is the top-level storyEditTester
            "element": "@expand:sjrk.storyTelling.page.storyEditTester.getButtonNameFromBlockType({that}.typeName)"
        },
        {
            "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
            listener: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
            args: ["{storyEditTester}", "{arguments}.0"]
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content remains empty after adding block", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.page.storyEditTester.changeBlockAndWaitToVerify", {
        gradeNames: "fluid.test.sequenceElement",
        field: null, // to be supplied by the implementing test
        value: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
            args: ["{that.options.field}", "{that}.options.value"]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
            path: "content",
            listener: "jqUnit.assertEquals",
            args: [
                "Story model updated to expected value",
                "{that}.options.value",
                "@expand:sjrk.storyTelling.page.storyEditTester.getModelPathFromFieldName({that}.options.field)"]
        },
        {
            func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
            args: ["{that}.options.field", ""]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
            path: "content",
            listener: "jqUnit.assertDeepEq",
            args: ["Story model empty after removing value", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.page.storyEditTester.changeBlockAndConfirmNoChange", {
        gradeNames: "fluid.test.sequenceElement",
        sequence: [{
            funcName: "fluid.identity"
        }]
    });

    fluid.defaults("sjrk.storyTelling.page.storyEditTester.clearStoryBlocks", {
        gradeNames: "fluid.test.sequenceElement",
        sequence: [{
            func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
            args: ["{storyEdit}.storyEditor.blockManager"]
        },
        {
            "jQueryTrigger": "click",
            "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
        },
        {
            "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
            listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
            args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
        },
        {
            funcName: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
            args: ["{storyEditTester}", undefined]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty after removing block", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.page.storyEditTester.textBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.page.storyEditTester.addBlock",
                options: {
                    blockType: "Text"
                }
            },
            changeHeadingAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.page.storyEditTester.changeBlockAndWaitToVerify",
                options: {
                    field: "heading",
                    value: "Rootbeer's text block"
                }
            },
            changeTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.page.storyEditTester.changeBlockAndWaitToVerify",
                options: {
                    field: "text",
                    value: "A story about my brother Shyguy"
                }
            },
            changeSimplifiedTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.page.storyEditTester.changeBlockAndWaitToVerify",
                options: {
                    field: "simplifiedText",
                    value: "My brother Shyguy"
                }
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.page.storyEditTester.clearStoryBlocks"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.page.storyEditTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        members: {
            currentBlock: null // to track dynamic blockUi components
        },
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 20,
                sequence: [{
                    "event": "{storyEditTest storyEdit}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor","storyTitle","Initial test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Editor model updated to expected value", "Initial test title", "{storyEdit}.storyEditor.story.model.title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated to match editor","{storyEdit}.storyEditor.story.model.title","{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor","storyTitle","New test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated","{storyEdit}.storyEditor.story.model.title","{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyEdit}.storyPreviewer.dom.storyTitle", "New test title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyListenTo"
                },
                {
                    "event": "{storyEdit}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from editor."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyListenTo"
                },
                {
                    "event": "{storyEdit}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from previewer."
                }]
            },
            {
                name: "Test saving enabled flag",
                expect: 4,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.assertFromSelector",
                    args: [
                        "{storyEdit}.options.selectors.mainContainer",
                        "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                        ["hidden", true]
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertFromSelector",
                    args: [
                        "{storyEdit}.options.selectors.pageContainer",
                        "sjrk.storyTelling.testUtils.assertElementHasClass",
                        ["{storyEdit}.options.pageSetup.hiddenEditorClass", true]
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{storyEdit}.storyEditor.dom.storyEditorForm", "hidden", true]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{storyEdit}.storyPreviewer.dom.storyShare", "hidden", true]
                }]
            }]
        },
        {
            name: "Test storySpeaker",
            tests: [{
                name: "Test storySpeaker",
                expect: 4,
                sequence: [{
                    func: "{storyEdit}.storyEditor.story.applier.change",
                    args: ["author", "Rootbeer"]
                },
                {
                    "changeEvent": "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "author",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "New test title, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    func: "{storyEdit}.storyEditor.story.applier.change",
                    args: ["title", "My brother Shyguy"]
                },
                {
                    "changeEvent": "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "My brother Shyguy, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.menu.dom.languageLinkSpanish"
                },
                {
                    "event": "{storyEdit}.events.onAllUiComponentsReady",
                    listener: "jqUnit.assertEquals",
                    args: ["ttsText value updated with language change", "My brother Shyguy, de Rootbeer. Palabras claves: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.menu.dom.languageLinkEnglish"
                },
                {
                    "event": "{storyEdit}.events.onAllUiComponentsReady",
                    listener: "jqUnit.assertEquals",
                    args: ["ttsText value updated with language change", "My brother Shyguy, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                }]
            }]
        },
        {
            name: "Test block controls",
            tests: [{
                name: "Test block operations within the page context",
                expect: 17,
                sequence: [{
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onEditorNextRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorNextRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onEditorPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorPreviousRequested event fired."
                },
                // Click to add a text block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit > storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Click to add an image block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddImageBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Add a second text block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Select the checkbox of the first block
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager", {checkFirstBlock: true}]
                },
                // Click the "remove selected blocks" button
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                // Verify removal
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 2]
                },
                // Remove the other two blocks and verify there are none left
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
                }]
            },
            {
                name: "Test block filtering model relay: Text block",
                expect: 11,
                sequenceGrade: "sjrk.storyTelling.page.storyEditTester.textBlockModelRelaySequence"
            },
            {
                name: "Test block filtering model relay: Image block",
                expect: 11,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddImageBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", "{arguments}.0"]
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after adding image block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["heading", "Rootbeer's image block"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after heading update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["description", "A picture of my brother Shyguy"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after description update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["alternativeText", "A cute grey Mackerel Tabby with Bengal spots"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after alternativeText update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["imageUrl", "notarealcatphotosadly.jpg"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
                    path: "content",
                    listener: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's image block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A picture of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cute grey Mackerel Tabby with Bengal spots", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealcatphotosadly.jpg", "{storyEdit}.storyPreviewer.story.model.content.0.imageUrl"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
                },
                {
                    funcName: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", undefined]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after removing image block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                }]
            },
            {
                name: "Test block filtering model relay: Audio block",
                expect: 13,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddAudioBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", "{arguments}.0"]
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after adding audio block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["heading", "Rootbeer's audio block"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after heading update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["description", "A recording of my brother Shyguy"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after description update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["alternativeText", "A cat meowing softly"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after alternativeText update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["transcript", "Mrraow"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after transcript update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["mediaUrl", "notarealmeowrecordingsadly.wav"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
                    path: "content",
                    listener: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's audio block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A recording of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cat meowing softly", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block transcript is as expected", "Mrraow", "{storyEdit}.storyPreviewer.story.model.content.0.transcript"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealmeowrecordingsadly.wav", "{storyEdit}.storyPreviewer.story.model.content.0.mediaUrl"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
                },
                {
                    funcName: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", undefined]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after removing audio block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                }]
            },
            {
                name: "Test broken sequence",
                expect: 2,
                sequenceGrade: "sjrk.storyTelling.page.storyEditTester.brokenSequence"
            },
            {
                name: "Test block filtering model relay: Video block",
                expect: 13,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddAudioBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", "{arguments}.0"]
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after adding video block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["heading", "Rootbeer's video block"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after heading update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["description", "A video of my brother Shyguy"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after description update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["alternativeText", "A cat stretching in the sunlight"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after alternativeText update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["transcript", "<No audio>"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model remains empty after transcript update", [], "{storyEdit}.storyPreviewer.story.model.content"]
                },
                {
                    func: "{storyEditTester}.options.members.currentBlock.block.applier.change",
                    args: ["mediaUrl", "notarealvideosadly.mp4"]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
                    path: "content",
                    listener: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's video block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A video of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cat stretching in the sunlight", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block transcript is as expected", "<No audio>", "{storyEdit}.storyPreviewer.story.model.content.0.transcript"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealvideosadly.mp4", "{storyEdit}.storyPreviewer.story.model.content.0.mediaUrl"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
                },
                {
                    funcName: "sjrk.storyTelling.page.storyEditTester.setCurrentBlock",
                    args: ["{storyEditTester}", undefined]
                },
                {
                    func: "{storyEdit}.events.onContextChangeRequested.fire"
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story content is empty after removing audio block", [], "{storyEdit}.storyPreviewer.story.model.content"]
                }]
            }]
        },
        {
            name: "Test progress and server response area",
            tests: [{
                name: "Test progress visibility",
                expect: 10,
                sequence: [{
                    funcName: "sjrk.storyTelling.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.prePublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyShare"
                },
                {
                    "event": "{storyEdit}.events.onStoryShareRequested",
                    listener: "sjrk.storyTelling.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.duringPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    func: "{storyEdit}.events.onStoryShareComplete.fire",
                    args: ["Story about Shyguy didn't save because Rootbeer got jealous"]
                },
                {
                    "event": "{storyEdit}.events.onStoryShareComplete",
                    listener: "sjrk.storyTelling.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.postPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    funcName: "sjrk.storyTelling.page.storyEditTester.verifyResponseText",
                    args: ["{storyEdit}.storyPreviewer.dom.responseArea", "Publishing failed: Story about Shyguy didn't save because Rootbeer got jealous"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.page.storyEditTester.getButtonNameFromBlockType = function (blockType) {
        return "{storyEdit}.storyEditor.dom.storyAdd" + blockType + "Block";
    };

    sjrk.storyTelling.page.storyEditTester.getModelPathFromFieldName = function (fieldName) {
        return "{storyEdit}.storyPreviewer.story.model.content.0." + fieldName;
    };

    sjrk.storyTelling.page.storyEditTester.verifyPublishStates = function (expectedStates, progressArea, responseArea, shareButton) {
        sjrk.storyTelling.page.storyEditTester.verifyElementVisibility(progressArea, expectedStates.progressArea);
        sjrk.storyTelling.page.storyEditTester.verifyElementVisibility(responseArea, expectedStates.responseArea);
        sjrk.storyTelling.page.storyEditTester.verifyElementDisabled(shareButton, expectedStates.shareButton);
    };

    sjrk.storyTelling.page.storyEditTester.verifyElementVisibility = function (el, isExpectedVisible) {
        var isActuallyVisible = el.is(":visible");
        jqUnit.assertEquals("The element's visibility is as expected", isExpectedVisible, isActuallyVisible);
    };

    sjrk.storyTelling.page.storyEditTester.verifyElementDisabled = function (el, isExpectedDisabled) {
        var isActuallyDisabled = el.prop("disabled");
        jqUnit.assertEquals("The element's 'disabled' value is as expected", isExpectedDisabled, isActuallyDisabled);
    };

    sjrk.storyTelling.page.storyEditTester.verifyResponseText = function (responseArea, expectedText) {
        var actualText = responseArea.text().trim();
        jqUnit.assertEquals("The response text is as expected", expectedText, actualText);
    };

    sjrk.storyTelling.page.storyEditTester.setCurrentBlock = function (testCaseHolder, currentBlock) {
        testCaseHolder.options.members.currentBlock = currentBlock;
    };

    fluid.defaults("sjrk.storyTelling.page.storyEditTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEdit: {
                type: "sjrk.storyTelling.page.testStoryEdit",
                container: "#testStoryEdit",
                createOnEvent: "{storyEditTester}.events.onTestCaseStart"
            },
            storyEditTester: {
                type: "sjrk.storyTelling.page.storyEditTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.page.storyEditTest"
        ]);
    });

})(jQuery, fluid);
