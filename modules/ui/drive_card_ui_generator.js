function createSingleCardWithTextUi(text) {
  const response = {
    action: {
      navigations: [
        {
          pushCard: {
            sections: [
              {
                widgets: [
                  {
                    textParagraph: {
                      text: text,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };

  return response;
}

function createOnItemsSelectedTriggerUi(fileId, mimeType, fileName, providerSelectionItems, generateDocsSummaryFunctionUrl) {
  const response = {
    action: {
      navigations: [
        {
          pushCard: {
            "sections": [
              {
                "widgets": [{
                  "decoratedText": {
                    "topLabel": "Selected file",
                    "text": fileName
                  }
                },
                {
                  textParagraph: {
                    text: "Please select options below:",
                  },
                },
                {
                  "selectionInput": {
                    "type": "DROPDOWN",
                    "label": "Length",
                    "name": "lengthSelection",
                    "items": [
                      {
                        "text": "Short (1-2 sentences)",
                        "value": "short",
                        "selected": false
                      },
                      {
                        "text": "Medium (3-4 sentences)",
                        "value": "medium",
                        "selected": true
                      },
                      {
                        "text": "Long (4 or more sentences)",
                        "value": "long",
                        "selected": false
                      }
                    ]
                  }
                },
                {
                  selectionInput: {
                    type: "DROPDOWN",
                    label: "Format",
                    name: "formatSelection",
                    items: [
                      {
                        text: "Paragraphs",
                        value: "paragraph",
                        selected: true,
                      },
                      {
                        text: "Bullet Points",
                        value: "bullets",
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
                            parameters: [
                              {
                                key: "fileId",
                                value: fileId,
                              },
                              {
                                key: "mimeType",
                                value: mimeType
                              }
                            ],
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

function createGenerateSummaryUi(summary, navigateBackUrl) {
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
                    {
                      buttonList: {
                        buttons: [
                          {
                            text: "Try again",
                            onClick: {
                              action: {
                                function: navigateBackUrl,
                                parameters: [],
                              },
                            },
                          },
                        ],
                      }
                    },
                  ],
                  "header": "Generated summary",
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

exports.createSingleCardWithTextUi = createSingleCardWithTextUi;
exports.createOnItemsSelectedTriggerUi = createOnItemsSelectedTriggerUi;
exports.createGenerateSummaryUi = createGenerateSummaryUi;