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
    const fileId = selectedItem.id;
    const fileName = selectedItem.title;
    const mimeType = selectedItem.mimeType;

    if (mimeType !== "application/vnd.google-apps.document" && mimeType !== "text/plain") {
        const message = "Only Google Docs or text files are supported for now.";
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

    const response = driveCardUiGenerator.createOnItemsSelectedTriggerUi(fileId, mimeType, fileName, providerSelectionItems, generateDocsSummaryUrl);
    return response;
}

async function generateSummaryResponse(event, providers, navigateBackUrl) {
    // Extract fileId from form inputs
    const parameters = event.commonEventObject.parameters;
    let fileId = "";
    let mimeType = "";

    if (parameters && parameters.fileId && parameters.mimeType) {
        fileId =
            parameters.fileId;
        mimeType = parameters.mimeType;
    } else {
        throw new Error("fileId and mimeType must be provided!");
    }

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
                case "vertexAiPalmApi":
                    //TODO move provider module file name to config file
                    provider = require("./gen_ai_providers/vertex_ai.js");
                    break;
                default:
                    throw new Error(`No valid modules exists for ${selectedProvider}`);
            }

            generatedSummary = await provider.generateSummary(lengthSelection, formatSelection, fileContent, providerConfig);
        } else {
            throw new Error('No valid provider selected.');
        }

        console.log(`Provider summary is ${JSON.stringify(generatedSummary)}`);

        const response = driveCardUiGenerator.createGenerateSummaryUi(generatedSummary, navigateBackUrl);
        return response;
    } else {
        throw new "Missing required form parameters!";
    }
}

exports.generateHomePageResponse = generateHomePageResponse;
exports.generateOnItemsSelectedTriggerResponse = generateOnItemsSelectedTriggerResponse;
exports.generateSummaryResponse = generateSummaryResponse;