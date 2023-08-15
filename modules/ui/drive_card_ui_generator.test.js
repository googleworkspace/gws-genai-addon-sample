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
import convertMarkdownToWidgets from '../utils/card_ui_utils.js';
import {
  createRenderActionWithTextUi,
  createSingleCardWithTextUi,
  createOnItemsSelectedTriggerUi,
  createGenerateSummaryUi,
  createNotificationUi,
} from './drive_card_ui_generator';

jest.mock('../utils/card_ui_utils.js');

describe('createRenderActionWithTextUi', () => {
  it('should expose a function', () => {
    expect(createRenderActionWithTextUi).toBeDefined();
  });

  it('createRenderActionWithTextUi should return expected output', () => {
    // const retValue = createRenderActionWithTextUi(text);
    // expect(false).toBeTruthy();
  });
});
describe('createSingleCardWithTextUi', () => {
  it('should expose a function', () => {
    expect(createSingleCardWithTextUi).toBeDefined();
  });

  it('createSingleCardWithTextUi should return expected output', () => {
    // const retValue = createSingleCardWithTextUi(text);
    // expect(false).toBeTruthy();
  });
});
describe('createOnItemsSelectedTriggerUi', () => {
  it('should expose a function', () => {
    expect(createOnItemsSelectedTriggerUi).toBeDefined();
  });

  it('createOnItemsSelectedTriggerUi should return expected output', () => {
    // const retValue = createOnItemsSelectedTriggerUi(fileName,providerSelectionItems,generateDocsSummaryFunctionUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createGenerateSummaryUi', () => {
  it('should expose a function', () => {
    expect(createGenerateSummaryUi).toBeDefined();
  });

  it('createGenerateSummaryUi should return expected output', () => {
    // const retValue = createGenerateSummaryUi(summary,exportToDocsUrl,navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createNotificationUi', () => {
  it('should expose a function', () => {
    expect(createNotificationUi).toBeDefined();
  });

  it('createNotificationUi should return expected output', () => {
    // const retValue = createNotificationUi(message);
    // expect(false).toBeTruthy();
  });
});
