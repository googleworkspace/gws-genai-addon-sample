const asyncHandler = require("express-async-handler");

const config = require("config");

const addOnUtils = require("./modules/utils/add_on_utils.js");
const commonAddOnHandler = require("./modules/common_add_on_handler")
const gmailAddOnHandler = require("./modules/gmail_add_on_handler");
const docsAddOnHandler = require("./modules/docs_add_on_handler");

// Add-on Client ID (to validate token)
// See https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id
const oauthClientId = config.get("addOnConfig.oauthClientId");
const addOnServiceAccountEmail = config.get("addOnConfig.serviceAccountEmail");

// TODO use the service account to validate requests

var routes = function (app) {
  /* Docs Endpoints */
  // Homepage
  app.post("/docsHomePage", asyncHandler(async (req, res) => {
    await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const providers = config.get('providers');
    const defaultProvider = config.get('defaultProvider');
    const generateSummaryUrl = config.get('addOnConfig.urls.generateDocsSummaryUrl');
    const response = docsAddOnHandler.generateHomePageResponse(providers, defaultProvider, generateSummaryUrl);
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  // Generate summary
  app.post("/generateDocsSummary", asyncHandler(async (req, res) => {
    await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const response = await docsAddOnHandler.generateSummaryResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  /* Gmail Endpoints */
  // Homepage
  app.post("/gmailHomePage", asyncHandler(async (req, res) => {
    await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const response = gmailAddOnHandler.generateHomePageResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  // Contextual triggers
  // Look at at following resource on how to build
  // https://developers.google.com/apps-script/add-ons/gmail/extending-message-ui#contextual_trigger_function
  app.post(
    "/contextualTriggers",
    asyncHandler(async (req, res) => {
      await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const providers = config.get('providers');
      const defaultProvider = config.get('defaultProvider');
      const generateReplyUrl = config.get('addOnConfig.urls.generateReplyUrl');
      const response = await gmailAddOnHandler.generateContextualTriggerResponse(event, providers, defaultProvider, generateReplyUrl);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.send(response);
    })
  );

  // Generate Reply
  app.post(
    "/generateReply",
    asyncHandler(async (req, res) => {
      await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const providers = config.get('providers');
      const createReplyDraftUrl = config.get('addOnConfig.urls.createReplyDraftUrl');
      const navigateBackUrl = config.get('addOnConfig.urls.navigateBackUrl');
      const response = await gmailAddOnHandler.generateGenerateReplyResponse(event, providers, oauthClientId, createReplyDraftUrl, navigateBackUrl);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.status(200).send(response);
    })
  );

  // Compose reply draft message with text
  app.post(
    "/createReplyDraft",
    asyncHandler(async (req, res) => {
      await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
      // REMOVE WHEN DEALING WITH REAL EMAIL DATA
      const event = req.body;
      console.log("Received POST: " + JSON.stringify(event));
      const response = await gmailAddOnHandler.generateCreateDraftResponse(event);
      console.log(`JSON Response was ${JSON.stringify(response)}`);
      res.status(200).send(response);
    })
  );

  /* Common Endpoints */

  // Navigate Back
  app.post("/navigateBack", asyncHandler(async (req, res) => {
    await addOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    console.log("Received POST: " + JSON.stringify(req.body));
    const response = commonAddOnHandler.generateNavigateBackResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.status(200).send(response);
  })
  );

};

module.exports = routes;