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
  generateContextualTriggerResponse,
  generateCreateDraftResponse,
  generateGenerateReplyResponse,
} from './gmail_add_on_handler';

jest.mock('./ui/gmail_card_ui_generator.js');
jest.mock('./utils/gmail_utils.js');
jest.mock('./utils/common_add_on_utils.js');
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
