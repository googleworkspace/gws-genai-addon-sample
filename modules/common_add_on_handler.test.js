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
import createNavigateBackUi from './ui/common_card_ui_generator.js';
import generateNavigateBackResponse from './common_add_on_handler';

jest.mock('./ui/common_card_ui_generator.js');

describe('generateNavigateBackResponse', () => {
  it('should expose a function', () => {
    expect(generateNavigateBackResponse).toBeDefined();
  });

  it('generateNavigateBackResponse should return expected output', () => {
    // const retValue = generateNavigateBackResponse();
    // expect(false).toBeTruthy();
  });
});
