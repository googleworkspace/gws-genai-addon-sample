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

import {
  createHomePageUi,
  createStartGenerationUi,
  createCreateDraftUi,
  createGeneratedRepliesUi,
  createTryAgainUi,
  createTryAgainWithMessage,
} from './gmail_card_ui_generator';

describe('createHomePageUi', () => {
  it('should expose a function', () => {
    expect(createHomePageUi).toBeDefined();
  });

  it('createHomePageUi should return expected output', () => {
    // const retValue = createHomePageUi(text);
    // expect(false).toBeTruthy();
  });
});
describe('createStartGenerationUi', () => {
  it('should expose a function', () => {
    expect(createStartGenerationUi).toBeDefined();
  });

  it('createStartGenerationUi should return expected output', () => {
    // const retValue = createStartGenerationUi(senderName,subject,formattedSentDateTime,providerSelectionItems,generateReplyFunctionUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createCreateDraftUi', () => {
  it('should expose a function', () => {
    expect(createCreateDraftUi).toBeDefined();
  });

  it('createCreateDraftUi should return expected output', () => {
    // const retValue = createCreateDraftUi(draftId,draftThreadId);
    // expect(false).toBeTruthy();
  });
});
describe('createGeneratedRepliesUi', () => {
  it('should expose a function', () => {
    expect(createGeneratedRepliesUi).toBeDefined();
  });

  it('createGeneratedRepliesUi should return expected output', () => {
    // const retValue = createGeneratedRepliesUi(generatedReplies,numOfRepliesToInclude,createDraftUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createTryAgainUi', () => {
  it('should expose a function', () => {
    expect(createTryAgainUi).toBeDefined();
  });

  it('createTryAgainUi should return expected output', () => {
    // const retValue = createTryAgainUi(navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createTryAgainWithMessage', () => {
  it('should expose a function', () => {
    expect(createTryAgainWithMessage).toBeDefined();
  });

  it('createTryAgainWithMessage should return expected output', () => {
    // const retValue = createTryAgainWithMessage(message,navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
