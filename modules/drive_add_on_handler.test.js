import {jest} from '@jest/globals';
import * as driveCardUiGenerator from './ui/drive_card_ui_generator.js';
import * as driveUtils from './utils/drive_utils.js';
import * as cohere from './gen_ai_providers/cohere.js';
import * as palm from './gen_ai_providers/palm_api.js';
import {
  generateHomePageResponse,
  generateOnItemsSelectedTriggerResponse,
  generateSummaryResponse,
  exportToDocs,
} from './drive_add_on_handler';

jest.mock('./ui/drive_card_ui_generator.js');
jest.mock('./utils/drive_utils.js');
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
describe('generateOnItemsSelectedTriggerResponse', () => {
  it('should expose a function', () => {
    expect(generateOnItemsSelectedTriggerResponse).toBeDefined();
  });

  it('generateOnItemsSelectedTriggerResponse should return expected output', () => {
    // const retValue = generateOnItemsSelectedTriggerResponse(event,providers,defaultProvider,generateDocsSummaryUrl);
    // expect(false).toBeTruthy();
  });
});
describe('generateSummaryResponse', () => {
  it('should expose a function', () => {
    expect(generateSummaryResponse).toBeDefined();
  });

  it('generateSummaryResponse should return expected output', async () => {
    // const retValue = await generateSummaryResponse(event,providers,exportToDocsUrl,navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
describe('exportToDocs', () => {
  it('should expose a function', () => {
    expect(exportToDocs).toBeDefined();
  });

  it('exportToDocs should return expected output', async () => {
    // const retValue = await exportToDocs(event);
    // expect(false).toBeTruthy();
  });
});
