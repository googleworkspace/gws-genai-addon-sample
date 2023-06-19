const driveCardUiGenerator = require('./ui/drive_card_ui_generator');
const driveUtils = require('./utils/drive_utils');

function generateHomePageResponse() {
  const message = "Please select a file to start using this add-on.";
  const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
  return response;
}

function generateOnItemsSelectedTriggerResponse(event, providers, defaultProvider, generateDocsSummaryUrl) {
  const selectedItems = event.drive.selectedItems;

  // We only support a single file for now
  if (selectedItems.length > 1) {
    const message = "Please select only one file.";
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileName = selectedItem.title;
  const fileMimeType = selectedItem.mimeType;

  const supportedMimeTypes = ['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet', 'application/vnd.google-apps.presentation', 'text/plain'];

  if (!supportedMimeTypes.includes(fileMimeType)) {
    const message = "Only Google Docs, Sheets or Slides, or plain text files are supported for now.";
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  // TODO this can be extracted as it is used in Gmail handler too
  // Generate GenAI selection options and set default per config
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

  const response = driveCardUiGenerator.createOnItemsSelectedTriggerUi(fileName, providerSelectionItems, generateDocsSummaryUrl);
  return response;
}

async function generateSummaryResponse(event, providers, exportToDocsUrl, navigateBackUrl) {
  // We only support a single file for now
  // TODO can extract as a method as it's used in two methods now
  const selectedItems = event.drive.selectedItems;

  if (selectedItems.length > 1) {
    const message = "Please select only one file.";
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileId = selectedItem.id;
  const mimeType = selectedItem.mimeType;

  // Extract auth token from event
  const accessToken = event.authorizationEventObject.userOAuthToken;

  // Call the drive utils to get file content
  const fileContent = await driveUtils.getDocsContent(fileId, mimeType, accessToken);

  // Feed into LLM
  const formInputs = event.commonEventObject.formInputs;

  if (formInputs) {
    const lengthSelection =
      formInputs.lengthSelection.stringInputs.value;
    const formatSelection =
      formInputs.formatSelection.stringInputs.value;

    let generatedSummary = "";

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
          provider = require("./gen_ai_providers/cohere.js");
          break;
        case "palmApi":
          //TODO move provider module file name to config file
          provider = require("./gen_ai_providers/palm_api.js");
          break;
        default:
          throw new Error(`No valid modules exists for ${selectedProvider}`);
      }

      generatedSummary = await provider.generateSummary(lengthSelection, formatSelection, fileContent, providerConfig);

      if (generatedSummary !== null) {
        console.log(`Provider summary is ${JSON.stringify(generatedSummary)}`);

        const response = driveCardUiGenerator.createGenerateSummaryUi(generatedSummary, exportToDocsUrl, navigateBackUrl);
        return response;
      } else {
        const message = "Error generating summary. Try again or check API settings or add-on logs.";
        const response = driveCardUiGenerator.createRenderActionWithTextUi(message);
        return response;
      }
    } else {
      throw new Error('No valid provider selected.');
    }
  } else {
    throw new "Missing required form parameters!";
  }
}

async function exportToDocsUrl(event) {
  // We only support a single file for now
  // TODO can extract as a method as it's used in two methods now
  const selectedItems = event.drive.selectedItems;

  if (selectedItems.length > 1) {
    const message = "Please select only one file.";
    const response = driveCardUiGenerator.createSingleCardWithTextUi(message);
    return response;
  }

  const selectedItem = selectedItems[0];
  const fileId = selectedItem.id;
  const fileName = selectedItem.title;

  const parameters = event.commonEventObject.parameters;
  let summary = "";
  if (parameters && parameters.summary) {
    summary =
      parameters.summary;
  } else {
    throw new Error("Summary must be provided!");
  }

  const summaryFileName = `Summary for ${fileName}`;
  const accessToken = event.authorizationEventObject.userOAuthToken;

  // Get location for the file
  const parents = await driveUtils.getFileParentId(fileId, accessToken);

  // Take the summary and put into a doc in the same folder as the original file
  const newFileId = await driveUtils.createDocsFileWithText(summary, summaryFileName, parents, accessToken);
  console.log(`New file ID generated ${newFileId}`);

  const notificationText = `Exported to ${summaryFileName}`;
  const response = driveCardUiGenerator.createNotificationUi(notificationText);

  return response;
}

exports.generateHomePageResponse = generateHomePageResponse;
exports.generateOnItemsSelectedTriggerResponse = generateOnItemsSelectedTriggerResponse;
exports.generateSummaryResponse = generateSummaryResponse;
exports.exportToDocsUrl = exportToDocsUrl;
