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
      // TODO support PDFs
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
    mimeType: exportedMimeType,
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
    });

    const parents = fileMetaData.data.parents;

    return parents;
  } catch (err) {
    throw err;
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
    });
    return file.data.id;
  } catch (err) {
    throw err;
  }
}
