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
import {OAuth2Client} from 'google-auth-library';
import {
  getPayloadFromEvent,
  authenticateRequest,
} from './common_add_on_utils';

jest.mock('google-auth-library');

describe('getPayloadFromEvent', () => {
  it('should expose a function', () => {
    expect(getPayloadFromEvent).toBeDefined();
  });

  it('getPayloadFromEvent should return expected output', async () => {
    // const retValue = await getPayloadFromEvent(event,oauthClientId);
    // expect(false).toBeTruthy();
  });
});
describe('authenticateRequest', () => {
  it('should expose a function', () => {
    expect(authenticateRequest).toBeDefined();
  });

  it('authenticateRequest should return expected output', async () => {
    // const retValue = await authenticateRequest(request,serviceAccountEmail);
    // expect(false).toBeTruthy();
  });
});
