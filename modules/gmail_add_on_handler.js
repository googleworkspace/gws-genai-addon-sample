import * as gmailCardUiGenerator from './ui/gmail_card_ui_generator.js';
import * as gmailUtils from './utils/gmail_utils.js';
import * as commonAddOnUtils from './utils/common_add_on_utils.js';
import * as cohere from './gen_ai_providers/cohere.js';
import * as palm from './gen_ai_providers/palm_api.js';
import * as vertexAiPalm from `./gen_ai_providers/vertex_palm_api.js`;

export function generateHomePageResponse() {
  const message = 'Please select a message to start using this add-on.';
  return gmailCardUiGenerator.createHomePageUi(message);
}

export async function generateContextualTriggerResponse(
  event,
  providers,
  defaultProvider,
  generateReplyUrl,
) {
  const message = await gmailUtils.getGmailMessage(event);

  // TODO can extract to another function?
  const subject = message.payload.headers.find(
    (header) => header.name === 'Subject',
  ).value;
  const senderName = message.payload.headers.find(
    (header) => header.name === 'From',
  ).value;
  const messageDate = message.payload.headers.find(
    (header) => header.name === 'Date',
  ).value;

  // Convert message date to local timezone per user locale and timezone
  const userTimeZone = event.commonEventObject.timeZone.id;
  const userLocale = event.commonEventObject.userLocale;
  const formattedSentDateTime = new Date(messageDate).toLocaleString(
    userLocale,
    {timeZone: userTimeZone},
  );

  // Generate GenAI selection options and set default per config
  const enabledProviders = providers.filter(
    (provider) => provider.enabled == true,
  );
  console.log('Enabled providers: ' + JSON.stringify(enabledProviders));
  if (enabledProviders.length == 0) {
    throw new Error('No enabled providers!');
  }

  const providerSelectionItems = [];
  for (const provider of enabledProviders) {
    console.log('ping');
    const providerItem = {
      text: provider.name,
      value: provider.value,
      selected: provider.value == defaultProvider ? true : false,
    };

    providerSelectionItems.push(providerItem);
  }
  const response = gmailCardUiGenerator.createStartGenerationUi(
    senderName,
    subject,
    formattedSentDateTime,
    providerSelectionItems,
    generateReplyUrl,
  );
  return response;
}

export async function generateCreateDraftResponse(event) {
  const parameters = event.commonEventObject.parameters;
  let replyText = '';
  if (parameters && parameters.replyText) {
    replyText = parameters.replyText;
  }

  // TODO check if a draft already exist send a notification / alert saying a draft already exists
  // ask the user to delete it if they want to use a different text
  // TODO 2
  // or update draft text after prompting if they want to overwrite?
  // TODO 3 instead of sending entire event, send only needed params
  const draft = await gmailUtils.createDraft(event, replyText);

  console.log('Draft is ' + JSON.stringify(draft));

  const response = gmailCardUiGenerator.createCreateDraftUi(
    draft.id,
    draft.message.threadId,
  );

  return response;
}

export async function generateGenerateReplyResponse(
  event,
  providers,
  oauthClientId,
  createReplyDraftUrl,
  navigateBackUrl,
) {
  const message = await gmailUtils.getGmailMessage(event);
  console.log(JSON.stringify({message}));
  const formInputs = event.commonEventObject.formInputs;
  const profileInfo = await commonAddOnUtils.getPayloadFromEvent(
    event,
    oauthClientId,
  );
  // This is for the JSON card UI response
  let sections = [];
  if (formInputs && formInputs.replyTextPrompt) {
    const replyTextPromptValue = formInputs.replyTextPrompt.stringInputs.value;
    const toneSelection = formInputs.toneSelection.stringInputs.value;
    const languageSelection = formInputs.languageSelection.stringInputs.value;
    console.log('User prompt was: ' + replyTextPromptValue);

    const subject = message.payload.headers.find(
      (header) => header.name === 'Subject',
    ).value;

    const senderName = message.payload.headers.find(
      (header) => header.name === 'From',
    ).value;

    const messageBodyText = gmailUtils.decodeGmailBodyPayload(
      message.payload.parts[0].body.data,
    );

    let generatedReplies = [];

    const selectedProvider = formInputs.providerSelection.stringInputs.value;
    console.log(`Selected provider is ${selectedProvider}`);
    if (selectedProvider != '') {
      const providerConfig = providers.find(
        (provider) => provider.value == selectedProvider,
      ).config;

      console.log(`Calling ${selectedProvider} provider`);
      console.log(`Config is ${JSON.stringify(providerConfig)}`);

      let provider = null;

      // TODO I hate having to convert the type ... should look into what the type comes as from config file
      switch (String(selectedProvider)) {
        case 'cohere':
          provider = cohere;
          break;
        case 'palmApi':
          // TODO move provider module file name to config file
          provider = palm;
          break;
        case 'vertexPalmApi':
          provider = vertexAiPalm;
          break;
        default:
          throw new Error(`No valid modules exists for ${selectedProvider}`);
      }

      generatedReplies = await provider.generateEmailReply(
        subject,
        senderName,
        messageBodyText,
        replyTextPromptValue,
        toneSelection,
        languageSelection,
        profileInfo.given_name,
        providerConfig,
      );
    } else {
      throw new Error('No valid provider selected.');
    }

    console.log(`Provider replies are ${JSON.stringify(generatedReplies)}`);

    const replyText = '';

    // Pick the first two responses and generate a JSON section
    // for each of them.
    const generatedRepliesUiSection =
      gmailCardUiGenerator.createGeneratedRepliesUi(
        generatedReplies,
        2,
        createReplyDraftUrl,
      );
    console.log(
      `Generated replies UI section is ${JSON.stringify(
        generatedRepliesUiSection,
      )}`,
    );
    console.log(`Sections before: ${JSON.stringify(sections)}`);
    sections = sections.concat(generatedRepliesUiSection);
    console.log(`Sections after: ${JSON.stringify(sections)}`);
    // Add the remaining sections
    const tryAgainUiSection =
      gmailCardUiGenerator.createTryAgainUi(navigateBackUrl);
    sections.push(tryAgainUiSection);
  } else {
    const noPromptProvidedUiSection =
      gmailCardUiGenerator.createTryAgainWithMessage(
        'You did not enter a prompt!',
        navigateBackUrl,
      );
    sections.push(noPromptProvidedUiSection);
  }

  // Update pushCard to updateCard when merging into previous function
  const response = {
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
