/**
 * Copyright 2023 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {jest} from '@jest/globals';
import {
  generateHomePageResponse,
  generateOnItemsSelectedTriggerResponse,
  generateSummaryResponse,
  exportToDocs,
} from './drive_add_on_handler';

jest.mock('./ui/drive_card_ui_generator.js');
jest.mock('./utils/drive_utils.js');
jest.mock('./gen_ai_providers/cohere.js');
jest.mock('./gen_ai_providers/gemini_text_api.js');

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
