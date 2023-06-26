import asyncHandler from "express-async-handler";

import config from "config";

import * as commonAddOnUtils from "./modules/utils/common_add_on_utils.js";
import generateNavigateBackResponse from "./modules/common_add_on_handler.js";
import * as gmailAddOnHandler from "./modules/gmail_add_on_handler.js";
import * as driveAddOnHandler from "./modules/drive_add_on_handler.js";

// Add-on Client ID (to validate token)
// See https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id
const oauthClientId = config.get("addOnConfig.oauthClientId");
const addOnServiceAccountEmail = config.get("addOnConfig.serviceAccountEmail");

// TODO use the service account to validate requests

export default function routes(app) {
  /* Drive Endpoints */
  // Homepage
  app.post("/driveHomePage", asyncHandler(async (req, res) => {
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const response = driveAddOnHandler.generateHomePageResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  // OnItemSelectedTrigger
  app.post("/onItemsSelectedTrigger", asyncHandler(async (req, res) => {
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const providers = config.get('providers');
    const defaultProvider = config.get('defaultProvider');
    const generateFilesSummaryUrl = config.get('addOnConfig.urls.generateFilesSummaryUrl');
    const response = driveAddOnHandler.generateOnItemsSelectedTriggerResponse(event, providers, defaultProvider, generateFilesSummaryUrl);
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  // Generate summary
  app.post("/generateFilesSummary", asyncHandler(async (req, res) => {
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const providers = config.get('providers');
    const exportToDocsUrl = config.get('addOnConfig.urls.exportToDocsUrl');
    const navigateBackUrl = config.get('addOnConfig.urls.navigateBackUrl');
    const response = await driveAddOnHandler.generateSummaryResponse(event, providers, exportToDocsUrl, navigateBackUrl);
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );


  // Export summary to Docs
  app.post("/exportToDocs", asyncHandler(async (req, res) => {
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    const event = req.body;
    console.log("Received POST: " + JSON.stringify(event));
    const response = await driveAddOnHandler.exportToDocs(event);
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.send(response);
  })
  );

  /* Gmail Endpoints */
  // Homepage
  app.post("/gmailHomePage", asyncHandler(async (req, res) => {
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
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
      await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
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
      await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
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
      await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
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
    await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
    console.log("Received POST: " + JSON.stringify(req.body));
    const response = generateNavigateBackResponse();
    console.log(`JSON Response was ${JSON.stringify(response)}`);
    res.status(200).send(response);
  })
  );

};
