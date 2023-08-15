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
import {
  getFileContent,
  getFileParentId,
  createDocsFileWithText,
} from './drive_utils';

jest.mock('googleapis');
jest.mock('google-auth-library');

describe('getFileContent', () => {
  it('should expose a function', () => {
    expect(getFileContent).toBeDefined();
  });

  it('getFileContent should return expected output', async () => {
    // const retValue = await getFileContent(fileId,fileMimeType,accessToken);
    // expect(false).toBeTruthy();
  });
});
describe('getFileParentId', () => {
  it('should expose a function', () => {
    expect(getFileParentId).toBeDefined();
  });

  it('getFileParentId should return expected output', async () => {
    // const retValue = await getFileParentId(fileId,accessToken);
    // expect(false).toBeTruthy();
  });
});
describe('createDocsFileWithText', () => {
  it('should expose a function', () => {
    expect(createDocsFileWithText).toBeDefined();
  });

  it('createDocsFileWithText should return expected output', async () => {
    // const retValue = await createDocsFileWithText(text,fileName,parents,accessToken);
    // expect(false).toBeTruthy();
  });
});
