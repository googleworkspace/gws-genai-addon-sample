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
import {google} from 'googleapis';
import {OAuth2Client} from 'google-auth-library';
import {Base64 as Base64} from 'js-base64';
import {
  getGmailMessage,
  decodeGmailBodyPayload,
  createDraft,
} from './gmail_utils';

jest.mock('googleapis');
jest.mock('google-auth-library');
jest.mock('js-base64');

describe('getGmailMessage', () => {
  it('should expose a function', () => {
    expect(getGmailMessage).toBeDefined();
  });

  it('getGmailMessage should return expected output', async () => {
    // const retValue = await getGmailMessage(event);
    // expect(false).toBeTruthy();
  });
});
describe('decodeGmailBodyPayload', () => {
  it('should expose a function', () => {
    expect(decodeGmailBodyPayload).toBeDefined();
  });

  it('decodeGmailBodyPayload should return expected output', () => {
    // const retValue = decodeGmailBodyPayload(base64EncodedText);
    // expect(false).toBeTruthy();
  });
});
describe('createDraft', () => {
  it('should expose a function', () => {
    expect(createDraft).toBeDefined();
  });

  it('createDraft should return expected output', async () => {
    // const retValue = await createDraft(event,draftContent);
    // expect(false).toBeTruthy();
  });
});
