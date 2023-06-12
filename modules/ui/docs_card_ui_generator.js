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
                      "label": "Length of summaryy",
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
                          "selected": false
                        },
                        {
                          "text": "Long (4 or more sentences)",
                          "value": "long",
                          "selected": true
                        }
                      ]
                    }
                  },
                  {
                    selectionInput: {
                      type: "DROPDOWN",
                      label: "Language",
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

exports.createHomePageUi = createHomePageUi;
exports.createGenerateSummaryUi = createGenerateSummaryUi;