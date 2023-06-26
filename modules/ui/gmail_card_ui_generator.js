// TODO can split the card generation from the action-->navigation wrapper
export function createHomePageUi(text) {
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

export function createStartGenerationUi(
    senderName,
    subject,
    formattedSentDateTime,
    providerSelectionItems,
    generateReplyFunctionUrl,
) {
  const response = {
    action: {
      navigations: [
        {
          pushCard: {
            sections: [
              {
                header: 'Email details',
                widgets: [
                  {
                    decoratedText: {
                      text: senderName,
                      bottomLabel: '',
                      topLabel: 'From',
                    },
                  },
                  {
                    decoratedText: {
                      topLabel: 'Subject',
                      text: subject,
                      wrapText: true,
                      bottomLabel: '',
                    },
                  },
                  {
                    decoratedText: {
                      topLabel: 'Sent on',
                      text: formattedSentDateTime,
                      bottomLabel: '',
                    },
                  },
                ],
                collapsible: false,
              },
              {
                header: 'What do you want to say?',
                widgets: [
                  {
                    textInput: {
                      label: 'Prompt',
                      type: 'SINGLE_LINE',
                      name: 'replyTextPrompt',
                      hintText:
                        'For example, thank you for sending this information\'',
                    },
                  },
                  {
                    selectionInput: {
                      type: 'DROPDOWN',
                      label: 'Tone',
                      name: 'toneSelection',
                      items: [
                        {
                          text: 'Professional',
                          value: 'professional',
                          selected: true,
                        },
                        {
                          text: 'Apologetic',
                          value: 'apologetic',
                          selected: false,
                        },
                        {
                          text: 'Snarky',
                          value: 'snarky',
                          selected: false,
                        },
                        {
                          text: 'Neutral',
                          value: 'neutral',
                          selected: false,
                        },
                      ],
                    },
                  },
                  {
                    selectionInput: {
                      type: 'DROPDOWN',
                      label: 'Language',
                      name: 'languageSelection',
                      items: [
                        {
                          text: 'English',
                          value: 'english',
                          selected: true,
                        },
                        {
                          text: 'French',
                          value: 'french',
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
                          text: 'Generate reply',
                          onClick: {
                            action: {
                              function: generateReplyFunctionUrl,
                              parameters: [],
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
                collapsible: false,
              },
            ],
          },
        },
      ],
    },
  };

  return response;
}

export function createCreateDraftUi(draftId, draftThreadId) {
  const response = {
    render_actions: {
      host_app_action: {
        gmail_action: {
          open_created_draft_action_markup: {
            draft_id: draftId,
            draft_thread_id: draftThreadId,
          },
        },
      },
      action: {
        notification: {
          text: 'Draft created!',
        },
      },
    },
  };

  return response;
}

export function createGeneratedRepliesUi(
    generatedReplies,
    numOfRepliesToInclude,
    createDraftUrl,
) {
  const sections = [];
  for (
    let i = 0;
    i < Math.min(generatedReplies.length, numOfRepliesToInclude);
    i++
  ) {
    replyText = generatedReplies[i].suggestedText;
    const responseSection = {
      header: 'Suggested reply #' + (i + 1),
      widgets: [
        {
          textParagraph: {
            text: replyText,
          },
        },
        {
          buttonList: {
            buttons: [
              {
                text: 'Use this reply',
                onClick: {
                  action: {
                    function: createDraftUrl,
                    parameters: [
                      {
                        key: 'replyText',
                        value: replyText,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    };
    sections.push(responseSection);
  }
  return sections;
}

export function createTryAgainUi(navigateBackUrl) {
  const response = {
    widgets: [
      {
        buttonList: {
          buttons: [
            {
              text: 'Try again',
              onClick: {
                action: {
                  function: navigateBackUrl,
                  parameters: [],
                },
              },
            },
          ],
        },
      },
    ],
  };

  return response;
}

export function createTryAgainWithMessage(message, navigateBackUrl) {
  const response = {
    widgets: [
      {
        textParagraph: {
          text: message,
        },
      },
      {
        buttonList: {
          buttons: [
            {
              text: 'Try again',
              onClick: {
                action: {
                  function: navigateBackUrl,
                  parameters: [],
                },
              },
            },
          ],
        },
      },
    ],
  };

  return response;
}
