const docsCardUiGenerator = require('./ui/docs_card_ui_generator');

function generateHomePageResponse(providers, defaultProvider, generateDocsSummaryUrl) {
    //TODO add provider selection

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

function generateSummaryResponse(text, navigateBackUrl) {
    //TODO get summary by provider selection
    const summary = "Sample summary";
    const response = docsCardUiGenerator.createGenerateSummaryUi(summary, navigateBackUrl);
    return response;
}

exports.generateHomePageResponse = generateHomePageResponse;
exports.generateSummaryResponse = generateSummaryResponse;