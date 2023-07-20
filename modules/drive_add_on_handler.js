import * as driveCardUiGenerator from './ui/drive_card_ui_generator.js';
import * as driveUtils from './utils/drive_utils.js';
import * as cohere from './gen_ai_providers/cohere.js';
import * as palm from './gen_ai_providers/palm_api.js';
import * as vertexAiPalm from './gen_ai_providers/vertex_ai_palm_api.js';

export function generateHomePageResponse() {
  const message = 'Please select a file to start using this add-on.';
  const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
  return response;
}

export function generateOnItemsSelectedTriggerResponse(
  event,
  providers,
  defaultProvider,
  generateDocsSummaryUrl,
) {
  const selectedItems = event.drive.selectedItems;

  // We only support a single file for now
  if (selectedItems.length > 1) {
    const message = 'Please select only one file.';
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileName = selectedItem.title;
  const fileMimeType = selectedItem.mimeType;

  const supportedMimeTypes = [
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.google-apps.presentation',
    'text/plain',
  ];

  if (!supportedMimeTypes.includes(fileMimeType)) {
    const message =
      'Only Google Docs, Sheets or Slides, or plain text files are supported for now.';
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  // TODO this can be extracted as it is used in Gmail handler too
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

  return driveCardUiGenerator.createOnItemsSelectedTriggerUi(
    fileName,
    providerSelectionItems,
    generateDocsSummaryUrl,
  );
}

export async function generateSummaryResponse(
  event,
  providers,
  exportToDocsUrl,
  navigateBackUrl,
) {
  // We only support a single file for now
  // TODO can extract as a method as it's used in two methods now
  const selectedItems = event.drive.selectedItems;

  if (selectedItems.length > 1) {
    const message = 'Please select only one file.';
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileId = selectedItem.id;
  const mimeType = selectedItem.mimeType;

  // Extract auth token from event
  const accessToken = event.authorizationEventObject.userOAuthToken;

  // Call the drive utils to get file content
  const fileContent = await driveUtils.getFileContent(
    fileId,
    mimeType,
    accessToken,
  );

  // Feed into LLM
  const formInputs = event.commonEventObject.formInputs;

  if (!formInputs) {
    throw new 'Missing required form parameters!'();
  }
  const lengthSelection = formInputs.lengthSelection.stringInputs.value;
  const formatSelection = formInputs.formatSelection.stringInputs.value;

  let generatedSummary = '';

  const selectedProvider = formInputs.providerSelection.stringInputs.value;
  if (selectedProvider === '') {
    throw new Error('No valid provider selected.');
  }
  const providerConfig = providers.find(
    (provider) => provider.value == selectedProvider,
  ).config;

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

  generatedSummary = await provider.generateSummary(
    lengthSelection,
    formatSelection,
    fileContent,
    providerConfig,
  );

  if (generatedSummary !== null) {
    return driveCardUiGenerator.createGenerateSummaryUi(
      generatedSummary,
      exportToDocsUrl,
      navigateBackUrl,
    );
  } else {
    const message =
      'Error generating summary. Try again or check API settings or add-on logs.';
    return driveCardUiGenerator.createRenderActionWithTextUi(message);
  }
}

export async function exportToDocs(event) {
  // We only support a single file for now
  // TODO can extract as a method as it's used in two methods now
  const selectedItems = event.drive.selectedItems;

  if (selectedItems.length > 1) {
    const message = 'Please select only one file.';
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileId = selectedItem.id;
  const fileName = selectedItem.title;

  const parameters = event.commonEventObject.parameters;
  let summary = '';
  if (parameters && parameters.summary) {
    summary = parameters.summary;
  } else {
    throw new Error('Summary must be provided!');
  }

  const summaryFileName = `${fileName} [AI Summary]`;
  const accessToken = event.authorizationEventObject.userOAuthToken;

  // Get location for the file
  const parents = await driveUtils.getFileParentId(fileId, accessToken);

  // Take the summary and put into a doc in the same folder as the original file
  const newFileId = await driveUtils.createDocsFileWithText(
    summary,
    summaryFileName,
    parents,
    accessToken,
  );

  const notificationText = `Exported to ${summaryFileName}`;
  return driveCardUiGenerator.createNotificationUi(notificationText);
}