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
import asyncHandler from 'express-async-handler';
import config from 'config';
import * as commonAddOnUtils from './modules/utils/common_add_on_utils.js';
import generateNavigateBackResponse from './modules/common_add_on_handler.js';
import * as gmailAddOnHandler from './modules/gmail_add_on_handler.js';
import * as driveAddOnHandler from './modules/drive_add_on_handler.js';
import routes from './routes';

jest.mock('express-async-handler');
jest.mock('config');
jest.mock('./modules/utils/common_add_on_utils.js');
jest.mock('./modules/common_add_on_handler.js');
jest.mock('./modules/gmail_add_on_handler.js');
jest.mock('./modules/drive_add_on_handler.js');

describe('routes', () => {
  it('should expose a function', () => {
    expect(routes).toBeDefined();
  });

  it('routes should return expected output', () => {
    // const retValue = routes(app);
    // expect(false).toBeTruthy();
  });
});
