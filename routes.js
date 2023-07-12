import asyncHandler from 'express-async-handler';

import config from 'config';

import * as commonAddOnUtils from './modules/utils/common_add_on_utils.js';
import generateNavigateBackResponse from './modules/common_add_on_handler.js';
import * as gmailAddOnHandler from './modules/gmail_add_on_handler.js';
import * as driveAddOnHandler from './modules/drive_add_on_handler.js';

const oauthClientId = config.get('addOnConfig.oauthClientId');
const addOnServiceAccountEmail = config.get('addOnConfig.serviceAccountEmail');

export default function routes(app) {
  /* Drive Endpoints */
  // Homepage
  app.post(
      '/driveHomePage',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const response = driveAddOnHandler.generateHomePageResponse();
        res.send(response);
      }),
  );

  // OnItemSelectedTrigger
  app.post(
      '/onItemsSelectedTrigger',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const providers = config.get('providers');
        const defaultProvider = config.get('defaultProvider');
        const generateFilesSummaryUrl = config.get(
            'addOnConfig.urls.generateFilesSummaryUrl',
        );
        const response = driveAddOnHandler.generateOnItemsSelectedTriggerResponse(
            event,
            providers,
            defaultProvider,
            generateFilesSummaryUrl,
        );
        res.send(response);
      }),
  );

  // Generate summary
  app.post(
      '/generateFilesSummary',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const providers = config.get('providers');
        const exportToDocsUrl = config.get('addOnConfig.urls.exportToDocsUrl');
        const navigateBackUrl = config.get('addOnConfig.urls.navigateBackUrl');
        const response = await driveAddOnHandler.generateSummaryResponse(
            event,
            providers,
            exportToDocsUrl,
            navigateBackUrl,
        );
        res.send(response);
      }),
  );

  // Export summary to Docs
  app.post(
      '/exportToDocs',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const response = await driveAddOnHandler.exportToDocs(event);
        res.send(response);
      }),
  );

  /* Gmail Endpoints */
  // Homepage
  app.post(
      '/gmailHomePage',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const response = gmailAddOnHandler.generateHomePageResponse();
        res.send(response);
      }),
  );

  // Contextual triggers
  app.post(
      '/contextualTriggers',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const providers = config.get('providers');
        const defaultProvider = config.get('defaultProvider');
        const generateReplyUrl = config.get('addOnConfig.urls.generateReplyUrl');
        const response =
        await gmailAddOnHandler.generateContextualTriggerResponse(
            event,
            providers,
            defaultProvider,
            generateReplyUrl,
        );
        res.send(response);
      }),
  );

  // Generate Reply
  app.post(
      '/generateReply',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const providers = config.get('providers');
        const createReplyDraftUrl = config.get(
            'addOnConfig.urls.createReplyDraftUrl',
        );
        const navigateBackUrl = config.get('addOnConfig.urls.navigateBackUrl');
        const response = await gmailAddOnHandler.generateGenerateReplyResponse(
            event,
            providers,
            oauthClientId,
            createReplyDraftUrl,
            navigateBackUrl,
        );
        res.status(200).send(response);
      }),
  );

  // Compose reply draft message with text
  app.post(
      '/createReplyDraft',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const event = req.body;
        const response = await gmailAddOnHandler.generateCreateDraftResponse(
            event,
        );
        res.status(200).send(response);
      }),
  );

  /* Common Endpoints */

  // Navigate Back
  app.post(
      '/navigateBack',
      asyncHandler(async (req, res) => {
        await commonAddOnUtils.authenticateRequest(req, addOnServiceAccountEmail);
        const response = generateNavigateBackResponse();
        res.status(200).send(response);
      }),
  );
}
