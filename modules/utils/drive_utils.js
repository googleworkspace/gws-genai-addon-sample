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

import {google} from 'googleapis';
import {OAuth2Client} from 'google-auth-library';

export async function getFileContent(fileId, fileMimeType, accessToken) {
  let content = '';
  try {
    const supportedGoogleWorkspaceMimeTypes = [
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.spreadsheet',
      'application/vnd.google-apps.presentation',
    ];
    if (supportedGoogleWorkspaceMimeTypes.includes(fileMimeType)) {
      content = await exportDriveFile(fileId, fileMimeType, accessToken);
    } else if (fileMimeType == 'text/plain') {
      content = await getDriveTextFileContent(fileId, accessToken);
    } else {
      throw new Error('Unsupported file format');
    }
    return content;
  } catch (error) {
    console.error(`Error retrieving file content from Google Drive. ${error}`);
    return '';
  }
}

async function getDriveTextFileContent(fileId, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({access_token: accessToken});

  const drive = google.drive({version: 'v3', auth: oauth2Client});

  const docsResponse = await drive.files.get({
    fileId: fileId,
    alt: 'media',
    supportsAllDrives: true
  });

  return docsResponse.data;
}

// This is used for Google Workspace files only (Docs, Sheets, Slides)
async function exportDriveFile(fileId, fileMimeType, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({access_token: accessToken});

  const drive = google.drive({version: 'v3', auth: oauth2Client});
  let exportedMimeType = 'text/plain';
  if (fileMimeType == 'application/vnd.google-apps.spreadsheet') {
    exportedMimeType = 'text/csv';
  }

  const docsResponse = await drive.files.export({
    fileId: fileId,
    mimeType: exportedMimeType
  });

  return docsResponse.data;
}

export async function getFileParentId(fileId, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({access_token: accessToken});

  const drive = google.drive({version: 'v3', auth: oauth2Client});

  try {
    const fileMetaData = await drive.files.get({
      fileId: fileId,
      fields: 'parents',
      supportsAllDrives: true
    });

    const parents = fileMetaData.data.parents;

    return parents;
  } catch (error) {
    console.error(`Error retrieving file parent ID from Google Drive. ${error}`);
    throw error;
  }
}

export async function createDocsFileWithText(
  text,
  fileName,
  parents,
  accessToken,
) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({access_token: accessToken});

  const drive = google.drive({version: 'v3', auth: oauth2Client});

  const fileMetadata = {
    name: fileName,
    mimeType: 'application/vnd.google-apps.document',
    parents: parents,
  };
  const media = {
    mimeType: 'text/plain',
    body: text,
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true
    });
    return file.data.id;
  } catch (error) {
    console.error(`Error creating new Google Docs file in Google Drive. ${error}`);
    throw error;
  }
}
