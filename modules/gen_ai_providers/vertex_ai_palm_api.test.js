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
import {generateEmailReply, generateSummary} from './vertex_ai_palm_api';

jest.mock('google-auth-library');

describe('generateEmailReply', () => {
  it('should expose a function', () => {
    expect(generateEmailReply).toBeDefined();
  });

  it('generateEmailReply should return expected output', async () => {
    // const retValue = await generateEmailReply(subject,senderName,messageBody,replyTextPrompt,tone,language,authorName,config);
    // expect(false).toBeTruthy();
  });
});
describe('generateSummary', () => {
  it('should expose a function', () => {
    expect(generateSummary).toBeDefined();
  });

  it('generateSummary should return expected output', async () => {
    // const retValue = await generateSummary(lengthSelection,formatSelection,text,config);
    // expect(false).toBeTruthy();
  });
});
