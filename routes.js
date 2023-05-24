const { google } = require("googleapis");
const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");

const config = require('config');

const gmail = google.gmail({ version: "v1" });

// Change with your GenAI provider
const cohere = require("cohere-ai");

// Add-on Client ID (to validate token)
// See https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id
const clientId = config.get('addOn.clientId');

// This is your Cohere.ai API key
const cohereApiKey = config.get('cohere.apiKey');

const generateReplyFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/generateReply";

const createReplyDraftFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/createReplyDraft";

const navigateBackFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/navigateBack";

//
// This defines three routes that our API is going to use.
//
var routes = function(app) {
  // Homepage
  app.post("/homePage", function(req, res) {
    console.log("Received POST: " + JSON.stringify(req.body));
    let response = {
      action: {
        navigations: [
          {
            pushCard: {
              sections: [
                {
                  widgets: [
                    {
                      textParagraph: {
                        text: "Please select a message to start.",
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
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  });

  // Contextual triggers
  // Look at at following resource on how to build
  // https://developers.google.com/apps-script/add-ons/gmail/extending-message-ui#contextual_trigger_function
  app.post(
    "/contextualTriggers",
    asyncHandler(async (req, res) => {
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      console.log("Received POST: " + JSON.stringify(req.body));
      const event = req.body;
      const message = await getGmailMessage(req.body);

      const subject = message.payload.headers.find(
        (header) => header.name === "Subject"
      ).value;
      const senderName = message.payload.headers.find(
        (header) => header.name === "From"
      ).value;
      const messageDate = message.payload.headers.find(
        (header) => header.name === "Date"
      ).value;

      // Convert message date to local timezone per user locale and timezone
      const userTimeZone = event.commonEventObject.timeZone.id;
      const userLocale = event.commonEventObject.userLocale;
      const formattedDateTime = new Date(messageDate).toLocaleString(userLocale, { timeZone: userTimeZone });

      let response = {
        action: {
          navigations: [
            {
              pushCard: {
                sections: [
                  {
                    header: "Email details",
                    widgets: [
                      {
                        decoratedText: {
                          text: senderName,
                          bottomLabel: "",
                          topLabel: "From",
                        },
                      },
                      {
                        decoratedText: {
                          topLabel: "Sent on",
                          text: formattedDateTime,
                          bottomLabel: "",
                        },
                      },
                      {
                        decoratedText: {
                          topLabel: "Subject",
                          text: subject,
                          wrapText: true,
                          bottomLabel: "",
                        },
                      },
                    ],
                    collapsible: false,
                  },
                  {
                    header: "What do you want to say?",
                    widgets: [
                      {
                        textInput: {
                          label: "Prompt",
                          type: "SINGLE_LINE",
                          name: "replyTextPrompt",
                          hintText:
                            "For example, 'thank sender for their help in this task'",
                        },
                      },
                      {
                        selectionInput: {
                          type: "DROPDOWN",
                          label: "Tone",
                          name: "toneSelection",
                          items: [
                            {
                              text: "Professional",
                              value: "professional",
                              selected: true,
                            },
                            {
                              text: "Apologetic",
                              value: "apologetic",
                              selected: false,
                            },
                            {
                              text: "Snarky",
                              value: "snarky",
                              selected: false,
                            },
                            {
                              text: "Neutral",
                              value: "neutral",
                              selected: false,
                            },
                          ],
                        },
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
                        buttonList: {
                          buttons: [
                            {
                              text: "Generate reply",
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
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  // Generate Reply
  app.post(
    "/generateReply",
    asyncHandler(async (req, res) => {
      console.log("Received POST: " + JSON.stringify(req.body));
      const event = req.body;
      const message = await getGmailMessage(req.body);
      const formInputs = event.commonEventObject.formInputs;
      const profileInfo = await getPayloadFromEvent(event);
      // This is for the JSON card UI response
      let sections = [];
      if (formInputs && formInputs.replyTextPrompt) {
        const replyTextPromptValue =
          formInputs.replyTextPrompt.stringInputs.value;
        const toneSelection = formInputs.toneSelection.stringInputs.value;
        const languageSelection = formInputs.languageSelection.stringInputs.value;
        console.log("User prompt was: " + replyTextPromptValue);
        // Connect to GenAI platform
        // i.e. Cohere.ai in this case
        // You could use an interface here and a Cohere.ai module for an advance sample
        //Build the prompt

        const subject = message.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;

        const senderName = message.payload.headers.find(
          (header) => header.name === "From"
        ).value;

        const messageBodyText = decodeGmailBodyPayload(
          message.payload.parts[0].body.data
        );

        let prompt =
          //Add: My name is xyz or "Sign it with my name which is ()"
          //TODO Remove funny
          'My name is ' +
          profileInfo.given_name +
          ' and I received an email with the subject "' +
          subject +
          '" from "' +
          senderName +
          '" that says "' +
          messageBodyText +
          '". Write a reply to the sender using this prompt: "' +
          replyTextPromptValue +
          '" in a "' +
          toneSelection +
          '" tone in the ' +
          languageSelection +
          ' language and sign it with my name';

        console.log("Prompt sent to API is: " + prompt);

        cohere.init(cohereApiKey);
        await (async () => {
          const response = await cohere.generate({
            model: "command-xlarge-nightly",
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.75,
            k: 0,
            stop_sequences: [],
            return_likelihoods: "NONE",
            num_generations: 3 //TODO look up the parameter
          });
          console.log(`Cohere response is ${JSON.stringify(response)}`);

          let generations = response.body.generations;

          // Pick the first three responses from Cohere.ai and generate a section
          // for each of them.
          for (let i = 0; i < Math.min(generations.length, 2); i++) {
            let responseSection = {
              header: "Suggested reply #" + (i + 1),
              widgets: [
                {
                  textParagraph: {
                    text: generations[i].text,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: "Use this reply",
                        onClick: {
                          action: {
                            function: createReplyDraftFunctionUrl,
                            parameters: [
                              // {
                              //   "responseIndex": i,
                              // }
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
          };

          // Add the remaining sections
          sections.push({
            widgets: [
              {
                buttonList: {
                  buttons: [
                    {
                      text: "Try again",
                      onClick: {
                        action: {
                          function: navigateBackFunctionUrl,
                          parameters: [],
                        },
                      },
                    }
                  ],
                },
              },
            ],
          });
        })();
      } else {
        sections.push({
          widgets: [
            {
              textParagraph: {
                text: "You did not enter a prompt!",
              },
            },
          ],
        });
      }

      // Update pushCard to updateCard when merging into previous function
      let response = {
        renderActions: {
          action: {
            navigations: [
              {
                pushCard: {
                  sections: sections
                },
              },
            ],
          },
        },
      };
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  // Navigate Back
  app.post("/navigateBack", function(req, res) {
    console.log("Received POST: " + JSON.stringify(req.body));

    let response = {
      renderActions: {
        action: {
          navigations: [
            {
              pop: true,
            },
          ],
        },
      },
    };
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  });

  async function getGmailMessage(event) {
    //Code from https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#extract_the_information
    const currentMessageId = event.gmail.messageId;
    const accessToken = event.authorizationEventObject.userOAuthToken;
    const messageToken = event.gmail.accessToken;
    const auth = new OAuth2Client();
    auth.setCredentials({ access_token: accessToken });

    const gmailResponse = await gmail.users.messages.get({
      id: currentMessageId,
      userId: "me",
      auth,
      headers: { "X-Goog-Gmail-Access-Token": messageToken },
    });

    const message = gmailResponse.data;

    console.log("Message data is " + JSON.stringify(message));

    return message;
  }

  function decodeGmailBodyPayload(base64EncodedText) {
    console.log("Encoded message body is " + base64EncodedText);
    let decodedBodyText = Buffer.from(base64EncodedText, "base64").toString(
      "utf8"
    );
    console.log("Decoded message body is " + decodedBodyText);
    return decodedBodyText;
  }

  async function createDraftReply(messageId) {

  }


  // Compose mail
  // Look at at following resource on how to build
  // https://developers.google.com/apps-script/add-ons/gmail/extending-message-ui#contextual_trigger_function
  app.post(
    "/composeMail",
    asyncHandler(async (req, res) => {
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      console.log("Received POST: " + JSON.stringify(req.body));
      const event = req.body;
      const message = await getGmailMessage(req.body);

      const subject = message.payload.headers.find(
        (header) => header.name === "Subject"
      ).value;
      const senderName = message.payload.headers.find(
        (header) => header.name === "From"
      ).value;
      const messageDate = message.payload.headers.find(
        (header) => header.name === "Date"
      ).value;

      // TODO use message.internalData instead and format
      // i.e. .toLocaleDateString(), although Locale will depent on the server locale
      // Unless you can get the locale of the user from the event
      // As I assume we cannot trust the Date in the header
      const messageSentDate = messageDate;

      let response = {
        action: {
          navigations: [
            {
              pushCard: {
                sections: [
                  {
                    header: "Email details",
                    widgets: [
                      {
                        decoratedText: {
                          text: senderName,
                          bottomLabel: "",
                          topLabel: "From",
                        },
                      },
                      {
                        decoratedText: {
                          topLabel: "Sent on",
                          text: messageSentDate,
                          bottomLabel: "",
                        },
                      },
                      {
                        decoratedText: {
                          topLabel: "Subject",
                          text: subject,
                          wrapText: true,
                          bottomLabel: "",
                        },
                      },
                    ],
                    collapsible: false,
                  },
                  {
                    header: "What do you want to say?",
                    widgets: [
                      {
                        textInput: {
                          label: "Prompt",
                          type: "MULTIPLE_LINE",
                          name: "replyTextPrompt",
                          hintText:
                            "Please type what you want to say to the sender. For example, 'I would love to help with this task'",
                        },
                      },
                      {
                        selectionInput: {
                          type: "DROPDOWN",
                          label: "Tone",
                          name: "toneSelection",
                          items: [
                            {
                              text: "Professional",
                              value: "professional",
                              selected: false,
                            },
                            {
                              text: "Funny",
                              value: "funny",
                              selected: false,
                            },
                            {
                              text: "Apologetic",
                              value: "apologetic",
                              selected: false,
                            },
                            {
                              text: "Snarky",
                              value: "snarky",
                              selected: false,
                            },
                            {
                              text: "Neutral",
                              value: "neutral",
                              selected: false,
                            },
                          ],
                        },
                      },
                      {
                        buttonList: {
                          buttons: [
                            {
                              text: "Generate reply",
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
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  // Compose reply draft message with text
  app.post(
    "/createReplyDraft",
    asyncHandler(async (req, res) => {
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      console.log("Received POST: " + JSON.stringify(req.body));
      const event = req.body;
      const message = await getGmailMessage(req.body);

      const subject = message.payload.headers.find(
        (header) => header.name === "Subject"
      ).value;
      const senderName = message.payload.headers.find(
        (header) => header.name === "From"
      ).value;
      const messageDate = message.payload.headers.find(
        (header) => header.name === "Date"
      ).value;

      // TODO get the generated text from the previous step
      // const replyText = req.body.replyTextPrompt;



      // Create a new reply draft using Gmail and get the draft ID



      // Compoes a JSON reply that will trigger Gmail to open a draft

      // TODO you can check if there is alread a draft for this sender and if so, return that ID

      let response = {
        renderActions: {
          hostAppAction: {
            gmailAction: {
              updateDraftActionMarkup: {
                updateBody: {
                  insertContents: [
                    {
                      content: "Hello world",
                      contentType: "TEXT"
                    }
                  ],
                  type: "IN_PLACE_INSERT"
                }
              }
            }
          }
        }
      };

      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  async function getPayloadFromEvent(event) {
    const oAuth2Client = new OAuth2Client();
    const decodedToken = await oAuth2Client.verifyIdToken({
      idToken: event.authorizationEventObject.userIdToken,
      audience: clientId
    });
    const payload = decodedToken.getPayload();

    console.log("User ID token payload: " + JSON.stringify(payload));
    // E.g. payload.email for email,  payload.sub for user ID
    return payload;
  }
};


module.exports = routes;
