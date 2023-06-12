function createHomePageUi(providerSelectionItems, generateDocsSummaryFunctionUrl) {
    const response = {
        action: {
            navigations: [
                {
                    pushCard: {
                        "sections": [
                            {
                                "widgets": [
                                    {
                                        "selectionInput": {
                                            "type": "DROPDOWN",
                                            "label": "Num of paragraphs to include in summary",
                                            "name": "numOfParagraphs",
                                            "items": [
                                                {
                                                    "text": "1",
                                                    "value": "1",
                                                    "selected": false
                                                },
                                                {
                                                    "text": "2",
                                                    "value": "2",
                                                    "selected": false
                                                },
                                                {
                                                    "text": "3",
                                                    "value": "3",
                                                    "selected": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        selectionInput: {
                                            type: "DROPDOWN",
                                            label: "Language",
                                            name: "languageSelection",
                                            items: [
                                                {
                                                    text: "English",
                                                    value: "english",
                                                    selected: true,
                                                },
                                                {
                                                    text: "French",
                                                    value: "french",
                                                    selected: false,
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        selectionInput: {
                                            type: "DROPDOWN",
                                            label: "Generative AI Provider",
                                            name: "providerSelection",
                                            items: providerSelectionItems,
                                        },
                                    },
                                    {
                                        "buttonList": {
                                            "buttons": [
                                                {
                                                    "text": "Generate Summary",
                                                    "onClick": {
                                                        "action": {
                                                            "function": generateDocsSummaryFunctionUrl,
                                                            "parameters": []
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ],
                                "header": "Summarize Document",
                            }
                        ]
                    },
                },
            ],
        },
    };

    return response;
}

function createGenerateSummaryUi(summary) {
    const response = {
        render_actions: {
            action: {
                navigations: [
                    {
                        pushCard: {
                            sections: [
                                {
                                    widgets: [
                                        {
                                            textParagraph: {
                                                text: summary,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
        }
    };

    return response;
}

exports.createHomePageUi = createHomePageUi;
exports.createGenerateSummaryUi = createGenerateSummaryUi;