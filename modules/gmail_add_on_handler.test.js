import {jest} from '@jest/globals';
import * as gmailCardUiGenerator from './ui/gmail_card_ui_generator.js';
import * as gmailUtils from './utils/gmail_utils.js';
import * as commonAddOnUtils from './utils/common_add_on_utils.js';
import * as cohere from './gen_ai_providers/cohere.js';
import * as palm from './gen_ai_providers/palm_api.js';
import {
  generateHomePageResponse,
  generateContextualTriggerResponse,
  generateCreateDraftResponse,
  generateGenerateReplyResponse,
} from './gmail_add_on_handler';

jest.mock('./ui/gmail_card_ui_generator.js');
jest.mock('./utils/gmail_utils.js');
jest.mock('./utils/common_add_on_utils.js');
jest.mock('./gen_ai_providers/cohere.js');
jest.mock('./gen_ai_providers/palm_api.js');

describe('generateHomePageResponse', () => {
  it('should expose a function', () => {
    expect(generateHomePageResponse).toBeDefined();
  });

  it('generateHomePageResponse should return expected output', () => {
    // const retValue = generateHomePageResponse();
    // expect(false).toBeTruthy();
  });
});
describe('generateContextualTriggerResponse', () => {
  it('should expose a function', () => {
    expect(generateContextualTriggerResponse).toBeDefined();
  });

  it('generateContextualTriggerResponse should return expected output', async () => {
    // const retValue = await generateContextualTriggerResponse(event,providers,defaultProvider,generateReplyUrl);
    // expect(false).toBeTruthy();
  });
});
describe('generateCreateDraftResponse', () => {
  it('should expose a function', () => {
    expect(generateCreateDraftResponse).toBeDefined();
  });

  it('generateCreateDraftResponse should return expected output', async () => {
    // const retValue = await generateCreateDraftResponse(event);
    // expect(false).toBeTruthy();
  });
});
describe('generateGenerateReplyResponse', () => {
  it('should expose a function', () => {
    expect(generateGenerateReplyResponse).toBeDefined();
  });

  it('generateGenerateReplyResponse should return expected output', async () => {
    // const retValue = await generateGenerateReplyResponse(event,providers,oauthClientId,createReplyDraftUrl,navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
