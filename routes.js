const { google } = require("googleapis");
const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const Base64 = require('js-base64').Base64;

const config = require("config");
const cohere = require("cohere-ai");


// Add-on Client ID (to validate token)
// See https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id
const oauthClientId = config.get("addOnConfig.oauthClientId");
const addOnServiceAccountEmail = config.get("addOnConfig.serviceAccountEmail");

// TODO confiuse the service account to validate requests

const generateReplyFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/generateReply";

const createReplyDraftFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/createReplyDraft";

const navigateBackFunctionUrl =
  "https://gen-ai-sample-add-on.malansari.repl.co/navigateBack";

//
// This defines three routes that our API is going to use.
//
var routes = function (app) {
  // Homepage
  app.post("/homePage", function (req, res) {
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
      const formattedSentDateTime = new Date(messageDate).toLocaleString(
        userLocale,
        { timeZone: userTimeZone }
      );

      // TODO may move the default to being an attribute of the provider
      const defaultProvider = config.get("defaultProvider");
      const enabledProviders = config.get("providers").filter(provider => provider.enabled == true);
      console.log("Enabled providers: " + JSON.stringify(enabledProviders));

      if (enabledProviders.length == 0) {
        throw new Error("No enabled providers!");
      }

      let providerSelectionItems = [];
      for (let i = 0; i < enabledProviders.length; i++) {
        console.log("ping");
        const provider = enabledProviders[i];
        let providerItem = {
          text: provider.name,
          value: provider.value,
          selected: (provider.value == defaultProvider) ? true : false
        };

        providerSelectionItems.push(providerItem);
      }

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
                          topLabel: "Subject",
                          text: subject,
                          wrapText: true,
                          bottomLabel: "",
                        },
                      },
                      {
                        decoratedText: {
                          topLabel: "Sent on",
                          text: formattedSentDateTime,
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
                            "For example, 'you for your help on this task'",
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
                        selectionInput: {
                          type: "DROPDOWN",
                          label: "Generative AI Provider",
                          name: "providerSelection",
                          items: providerSelectionItems,
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
        const languageSelection =
          formInputs.languageSelection.stringInputs.value;
        console.log("User prompt was: " + replyTextPromptValue);

        const subject = message.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;

        const senderName = message.payload.headers.find(
          (header) => header.name === "From"
        ).value;

        const messageBodyText = decodeGmailBodyPayload(
          message.payload.parts[0].body.data
        );

        let generatedReplies = [];

        const selectedProvider = formInputs.providerSelection.stringInputs.value;
        console.log(`Selected provider is ${selectedProvider}`);
        if (selectedProvider != "") {
          const providerConfig = config.get("providers").find(provider => provider.value == selectedProvider).config;

          console.log(`Calling ${selectedProvider} provider`);
          console.log(`Config is ${JSON.stringify(providerConfig)}`);

          let provider = null;

          //TODO I hate having to convert the type ... should look into what the type comes as from config file
          switch (String(selectedProvider)) {
            case "cohere":
              provider = require("./providers/cohere.js");
              break;
            case "vertexAiPalmApi":
              //TODO move provider module file name to config file
              provider = require("./providers/vertex_ai.js");
              break;
            default:
              throw new Error(`No valid modules exists for ${selectedProvider}`);
          }

          generatedReplies = await provider.generateEmailReply(subject, senderName, messageBodyText, replyTextPromptValue, toneSelection, languageSelection, profileInfo.given_name, providerConfig);
        } else {
          throw new Error('No valid provider selected.');
        }

        console.log(`Provider replies are ${JSON.stringify(generatedReplies)}`);

        let replyText = "";

        // Pick the first two responses and generate a JSON section
        // for each of them.
        for (let i = 0; i < Math.min(generatedReplies.length, 2); i++) {
          replyText = generatedReplies[i].suggestedText;
          let responseSection = {
            header: "Suggested reply #" + (i + 1),
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
                      text: "Use this reply",
                      onClick: {
                        action: {
                          function: createReplyDraftFunctionUrl,
                          parameters: [
                            {
                              key: "replyText",
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
                  },
                ],
              },
            },
          ],
        });
      } else {
        sections.push({
          widgets: [
            {
              textParagraph: {
                text: "You did not enter a prompt!",
              },
            },
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
                  },
                ],
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
                  sections: sections,
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
  app.post("/navigateBack", function (req, res) {
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
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const gmailResponse = await gmail.users.messages.get({
      id: currentMessageId,
      userId: "me",
      oauth2Client,
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

  async function createDraftReply(event, draftContent) {
    //TODO add a try catch
    const currentMessageId = event.gmail.messageId;
    const threadId = event.gmail.threadId;
    const oauthToken = event.authorizationEventObject.userOAuthToken;
    const accessToken = event.gmail.accessToken;
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: oauthToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const gmailResponse = await gmail.users.messages.get({
      id: currentMessageId,
      userId: "me",
      oauth2Client,
      headers: { "X-Goog-Gmail-Access-Token": accessToken },
    });

    const message = gmailResponse.data;

    let messageContent = "";
    let subject = "";
    let body = "";

    // We are creating a draft reply, we could modify the values below
    // to create a brand new message (if we add functionality for this)
    // in the add-on

    const sender = message.payload.headers.find(
      (header) => header.name === "From"
    ).value;

    const originalSubject = message.payload.headers.find(
      (header) => header.name === "Subject"
    ).value;

    if (!originalSubject.startsWith("Re: ")) {
      subject = "Re: " + originalSubject;
    } else {
      subject = originalSubject;
    }

    messageContent += "To: " + sender + "\n";

    // Reply to the original sender.
    messageContent += "To: " + sender + "\n";

    // Preserve other To and CC addresses (reply-all).
    let originalTo = message.payload.headers.find(
      h => h.name == "To");
    let cc = "";
    if (originalTo) {
      cc += originalTo.value;
    }
    let originalCc = message.payload.headers.find(
      h => h.name == "Cc")
    if (originalCc) {
      if (originalTo) {
        cc += ", "
      }
      cc += originalCc.value;
    }
    if (cc) {
      messageContent += "CC: " + cc + "\n";
    }

    body = draftContent;

    messageContent += "Subject: " + subject + "\n";
    messageContent += "\n" + body;
    console.log("messageContent: " + messageContent);

    const newDraft = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: Base64.encodeURI(messageContent),
          threadId: threadId
        }
      },
      oauth2Client,
      headers: { 'X-Goog-Gmail-Access-Token': accessToken }
    });
    console.log("newDraft: " + JSON.stringify(newDraft.data));
    return newDraft.data;
  }

  // Compose reply draft message with text
  app.post(
    "/createReplyDraft",
    asyncHandler(async (req, res) => {
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      console.log("Received POST: " + JSON.stringify(req.body));
      const parameters = req.body.commonEventObject.parameters;
      let replyText = "";
      if (parameters && parameters.replyText) {
        replyText =
          parameters.replyText;
      }

      // TODO check if a draft already exist send a notification / alert saying a draft already exists
      // ask the user to delete it if they want to use a different text
      // TODO 2
      // or update draft text after prompting if they want to overwrite?
      let draft = await createDraftReply(req.body, replyText);

      console.log("Draft is " + JSON.stringify(draft));

      let response = {
        render_actions: {
          host_app_action: {
            gmail_action: {
              open_created_draft_action_markup: {
                draft_id: draft.id,
                draft_thread_id: draft.message.threadId
              }
            }
          },
          action: {
            notification: {
              text: "Draft created!"
            }
          }
        }
      };

      console.log(`JSON Response was ${JSON.stringify(response)}`);

      res.status(200).send(JSON.stringify(response));
    })
  );

  async function getPayloadFromEvent(event) {
    const oAuth2Client = new OAuth2Client();
    const decodedToken = await oAuth2Client.verifyIdToken({
      idToken: event.authorizationEventObject.userIdToken,
      audience: oauthClientId,
    });
    const payload = decodedToken.getPayload();

    console.log("User ID token payload: " + JSON.stringify(payload));
    // E.g. payload.email for email,  payload.sub for user ID
    return payload;
  }
};

module.exports = routes;
