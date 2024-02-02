/**
 * Copyright 2023 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function createHomePageUi(text) {
  return {
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
}

export function createStartGenerationUi(
  senderName,
  subject,
  formattedSentDateTime,
  providerSelectionItems,
  generateReplyFunctionUrl,
) {
  return {
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
                          text: 'Fun',
                          value: 'fun',
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
}

export function createCreateDraftUi(draftId, draftThreadId) {
  return {
    renderActions: {
      hostAppAction: {
        gmailAction: {
          openCreatedDraftActionMarkup: {
            draftId: draftId,
            draftThreadId: draftThreadId,
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
}

export function createGeneratedRepliesUi(
  generatedReplies,
  numOfRepliesToInclude,
  createDraftUrl,
) {
  const sections = [];
  const replies = Math.min(generatedReplies.length, numOfRepliesToInclude);
  for (let i = 0; i < replies; i++) {
    const replyText = generatedReplies[i].suggestedText;
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
  return {
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
}

export function createTryAgainWithMessage(message, navigateBackUrl) {
  return {
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
}
