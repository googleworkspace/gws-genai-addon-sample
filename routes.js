const asyncHandler = require("express-async-handler");

const config = require("config");

const gmailAddOn = require("./modules/gmail_add_on"
)
// Add-on Client ID (to validate token)
// See https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id
const oauthClientId = config.get("addOnConfig.oauthClientId");
const addOnServiceAccountEmail = config.get("addOnConfig.serviceAccountEmail");

// TODO use the service account to validate requests

var routes = function (app) {
  // Homepage
  app.post("/homePage", function (req, res) {
    //TODO add securityUtils to validate request by SA    
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const response = gmailAddOn.generateHomePageResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  });

  // Contextual triggers
  // Look at at following resource on how to build
  // https://developers.google.com/apps-script/add-ons/gmail/extending-message-ui#contextual_trigger_function
  app.post(
    "/contextualTriggers",
    asyncHandler(async (req, res) => {
      //TODO add securityUtils to validate request by SA    
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const providers = config.get('providers');
      const defaultProvider = config.get('defaultProvider');
      const response = await gmailAddOn.generateContextualTriggerResponse(event, providers, defaultProvider);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  // Generate Reply
  app.post(
    "/generateReply",
    asyncHandler(async (req, res) => {
      // TODO add request auth against SA
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const providers = config.get('providers');
      const response = await gmailAddOn.generateGenerateReplyResponse(event, providers, oauthClientId);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.status(200).send(response);
    })
  );

  // Navigate Back
  app.post("/navigateBack", function (req, res) {
    // TODO add request auth against SA
    console.log("Received POST: " + JSON.stringify(req.body));
    const response = gmailAddOn.generateNavigateBackResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.status(200).send(response);
  });

  // Compose reply draft message with text
  app.post(
    "/createReplyDraft",
    asyncHandler(async (req, res) => {
      // TODO add request auth against SA
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const response = await gmailAddOn.generateCreateDraftResponse(event);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.status(200).send(response);
    })
  );
};

module.exports = routes;
