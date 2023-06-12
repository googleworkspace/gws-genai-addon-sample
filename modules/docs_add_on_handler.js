const docsCardUiGenerator = require('./ui/docs_card_ui_generator');

function generateHomePageResponse(providers, defaultProvider, generateDocsSummaryUrl) {
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

    const response = docsCardUiGenerator.createHomePageUi(providerSelectionItems, generateDocsSummaryUrl);
    return response;
}

async function generateSummaryResponse(event, providers, navigateBackUrl) {
    //Sample for now
    const text = `
    Discovery document
    A Discovery Document is a machine-readable specification for describing and consuming REST APIs. It is used to build client libraries, IDE plugins, and other tools that interact with Google APIs. One service may provide multiple discovery documents. This service provides the following discovery document:

    https://gsuiteaddons.googleapis.com/$discovery/rest?version=v1
    Service endpoint
    A service endpoint is a base URL that specifies the network address of an API service. One service might have multiple service endpoints. This service has the following service endpoint and all URIs below are relative to this service endpoint:

    https://gsuiteaddons.googleapis.com
    `;

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

            generatedSummary = await provider.generateSummary(lengthSelection, formatSelection, text, providerConfig);
        } else {
            throw new Error('No valid provider selected.');
        }

        console.log(`Provider summary is ${JSON.stringify(generatedSummary)}`);

        const response = docsCardUiGenerator.createGenerateSummaryUi(generatedSummary, navigateBackUrl);
        return response;
    } else {
        throw new "Missing required form parameters!";
    }
}

exports.generateHomePageResponse = generateHomePageResponse;
exports.generateSummaryResponse = generateSummaryResponse;