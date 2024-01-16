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

import * as gmailCardUiGenerator from './ui/gmail_card_ui_generator.js';
import * as gmailUtils from './utils/gmail_utils.js';
import * as commonAddOnUtils from './utils/common_add_on_utils.js';
import * as cohere from './gen_ai_providers/cohere.js';
import * as geminiText from './gen_ai_providers/gemini_text_api.js';
import * as vertexAiPalm from './gen_ai_providers/vertex_ai_palm_api.js';
import * as vertexAiGeminiProText from './gen_ai_providers/vertex_ai_gemini_pro_text_api.js';

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
  if (enabledProviders.length == 0) {
    throw new Error('No enabled providers!');
  }

  const providerSelectionItems = [];
  for (const provider of enabledProviders) {
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

  const draft = await gmailUtils.createDraft(event, replyText);

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
    if (selectedProvider != '') {
      const providerConfig = providers.find(
        (provider) => provider.value == selectedProvider,
      ).config;

      let provider = null;
      
      switch (String(selectedProvider)) {
        case 'vertexGeminiProTextApi':
          provider = vertexAiGeminiProText;
          break;
        case 'vertexPalmApi':
          provider = vertexAiPalm;
          break;
        case 'geminiTextApi':
          provider = geminiText;
          break;
        case 'cohere':
          provider = cohere;
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

    const replyText = '';

    // Pick the first two responses and generate a JSON section
    // for each of them.
    const generatedRepliesUiSection =
      gmailCardUiGenerator.createGeneratedRepliesUi(
        generatedReplies,
        2,
        createReplyDraftUrl,
      );
    sections = sections.concat(generatedRepliesUiSection);
    
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

  return response;
}
