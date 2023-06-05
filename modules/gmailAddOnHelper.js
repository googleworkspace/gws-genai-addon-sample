const gmailCardUiHelper = require('./gmailCardUiHelper');
const gmailUtils = require('./gmailUtils');
const addOnHelper = require('./addOnHelper')

//TODO - move to config using env variables or file?
const generateReplyFunctionUrl =
    "https://gen-ai-sample-add-on.malansari.repl.co/generateReply";

const navigateBackFunctionUrl =
    "https://gen-ai-sample-add-on.malansari.repl.co/navigateBack";

const createReplyDraftFunctionUrl =
    "https://gen-ai-sample-add-on.malansari.repl.co/createReplyDraft";

function generateHomePageResponse() {
    const message = "Please select a message to start using this add-on.";
    const response = gmailCardUiHelper.createHomePageUi(message);
    return response;
}

async function generateContextualTriggerResponse(event, providers, defaultProvider) {
    // Get the Gmail message
    const message = await gmailUtils.getGmailMessage(event);

    // Extract subject, from and date values
    // TODO can extract to another function?
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

    // Generate GenAI selection options and set default per config
    // TODO may move the default to being an attribute of the provider
    const enabledProviders = providers.filter(provider => provider.enabled == true);
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

    };
    var response = gmailCardUiHelper.createStartGenerationUi(senderName, subject, formattedSentDateTime, providerSelectionItems, generateReplyFunctionUrl);
    return response;
}

function generateNavigateBackResponse() {
    const response = gmailCardUiHelper.createNavigateBackUi();
    return response;
}

async function generateCreateDraftResponse(event) {
    const parameters = event.commonEventObject.parameters;
    let replyText = "";
    if (parameters && parameters.replyText) {
        replyText =
            parameters.replyText;
    }

    // TODO check if a draft already exist send a notification / alert saying a draft already exists
    // ask the user to delete it if they want to use a different text
    // TODO 2
    // or update draft text after prompting if they want to overwrite?
    // TODO 3 instead of sending entire event, send only needed params
    let draft = await gmailUtils.createDraft(event, replyText);

    console.log("Draft is " + JSON.stringify(draft));

    const response = gmailCardUiHelper.createCreateDraftUi(draft.id, draft.message.threadId);

    return response;
}

async function generateGenerateReplyResponse(event, providers, oauthClientId) {
    const message = await gmailUtils.getGmailMessage(event);
    const formInputs = event.commonEventObject.formInputs;
    const profileInfo = await addOnHelper.getPayloadFromEvent(event, oauthClientId);
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

        const messageBodyText = gmailUtils.decodeGmailBodyPayload(
            message.payload.parts[0].body.data
        );

        let generatedReplies = [];

        const selectedProvider = formInputs.providerSelection.stringInputs.value;
        console.log(`Selected provider is ${selectedProvider}`);
        if (selectedProvider != "") {
            const providerConfig = providers.find(provider => provider.value == selectedProvider).config;

            console.log(`Calling ${selectedProvider} provider`);
            console.log(`Config is ${JSON.stringify(providerConfig)}`);

            let provider = null;

            //TODO I hate having to convert the type ... should look into what the type comes as from config file
            switch (String(selectedProvider)) {
                case "cohere":
                    provider = require("../providers/cohere.js");
                    break;
                case "vertexAiPalmApi":
                    //TODO move provider module file name to config file
                    provider = require("../providers/vertex_ai.js");
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
        const generatedRepliesUiSection = gmailCardUiHelper.createGeneratedRepliesUi(generatedReplies, 2, createReplyDraftFunctionUrl);
      console.log(`Generated replies UI section is ${JSON.stringify(generatedRepliesUiSection)}`);
      console.log(`Sections before: ${JSON.stringify(sections)}`);
        sections = sections.concat(generatedRepliesUiSection);
      console.log(`Sections after: ${JSON.stringify(sections)}`);
        // Add the remaining sections
        const tryAgainUiSection = gmailCardUiHelper.createTryAgainUi(navigateBackFunctionUrl);
        sections.push(tryAgainUiSection);
    } else {
        const noPromptProvidedUiSection = gmailCardUiHelper.createTryAgainWithMessage("You did not enter a prompt!", navigateBackFunctionUrl);
        sections.push(noPromptProvidedUiSection);
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

  console.log(`Response is ${JSON.stringify(response)}`);
  return response;
}

exports.generateHomePageResponse = generateHomePageResponse;
exports.generateContextualTriggerResponse = generateContextualTriggerResponse;
exports.generateNavigateBackResponse = generateNavigateBackResponse;
exports.generateCreateDraftResponse = generateCreateDraftResponse;
exports.generateGenerateReplyResponse = generateGenerateReplyResponse;