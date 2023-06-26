import convertMarkdownToWidgets from '../utils/card_ui_utils.js';

export function createRenderActionWithTextUi(text) {
  const response = {
    render_actions: createSingleCardWithTextUi(text),
  };

  return response;
}

export function createSingleCardWithTextUi(text) {
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

export function createOnItemsSelectedTriggerUi(
    fileName,
    providerSelectionItems,
    generateDocsSummaryFunctionUrl,
) {
  const response = {
    action: {
      navigations: [
        {
          pushCard: {
            sections: [
              {
                widgets: [
                  {
                    decoratedText: {
                      topLabel: 'Selected file',
                      text: fileName,
                    },
                  },
                  {
                    textParagraph: {
                      text: 'Please select options below:',
                    },
                  },
                  {
                    selectionInput: {
                      type: 'DROPDOWN',
                      label: 'Length',
                      name: 'lengthSelection',
                      items: [
                        {
                          text: 'Short (1-2 sentences)',
                          value: 'short',
                          selected: false,
                        },
                        {
                          text: 'Medium (3-4 sentences)',
                          value: 'medium',
                          selected: true,
                        },
                        {
                          text: 'Long (4 or more sentences)',
                          value: 'long',
                          selected: false,
                        },
                      ],
                    },
                  },
                  {
                    selectionInput: {
                      type: 'DROPDOWN',
                      label: 'Format',
                      name: 'formatSelection',
                      items: [
                        {
                          text: 'Paragraphs',
                          value: 'paragraph',
                          selected: true,
                        },
                        {
                          text: 'Bullet Points',
                          value: 'bullets',
                          selected: false,
                        },
                      ],
                    },
                  },
                  {
                    selectionInput: {
                      type: 'DROPDOWN',
                      label: 'Generative AI Provider',
                      name: 'providerSelection',
                      items: providerSelectionItems,
                    },
                  },
                  {
                    buttonList: {
                      buttons: [
                        {
                          text: 'Generate Summary',
                          onClick: {
                            action: {
                              function: generateDocsSummaryFunctionUrl,
                              parameters: [],
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
                header: 'Summarize Document',
              },
            ],
          },
        },
      ],
    },
  };

  return response;
}

export function createGenerateSummaryUi(
    summary,
    exportToDocsUrl,
    navigateBackUrl,
) {
  console.log('entering createGenerateSummaryUi');

  const responseWidgets = convertMarkdownToWidgets(summary);
  console.log(`responseWidgets: ${JSON.stringify(responseWidgets)}`);

  responseWidgets.push({
    buttonList: {
      buttons: [
        {
          text: 'Export to Docs',
          onClick: {
            action: {
              function: exportToDocsUrl,
              parameters: [
                {
                  key: 'summary',
                  value: summary,
                },
              ],
            },
          },
        },
        {
          text: 'Go back',
          onClick: {
            action: {
              function: navigateBackUrl,
              parameters: [],
            },
          },
        },
      ],
    },
  });

  const response = {
    render_actions: {
      action: {
        navigations: [
          {
            pushCard: {
              sections: [
                {
                  widgets: responseWidgets,
                  header: 'Generated summary',
                },
              ],
            },
          },
        ],
      },
    },
  };

  return response;
}

export function createNotificationUi(message) {
  const response = {
    render_actions: {
      action: {
        notification: {
          text: message,
        },
      },
    },
  };

  return response;
}
