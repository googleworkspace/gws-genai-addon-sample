const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

async function getFileContent(fileId, fileMimeType, accessToken) {
  let content = "";
  console.log(`mimeType is ${fileMimeType}`);
  try {
    supportedGoogleWorkspaceMimeTypes = ['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet', 'application/vnd.google-apps.presentation'];
    if (supportedGoogleWorkspaceMimeTypes.includes(fileMimeType)) {
      content = await exportDriveFile(fileId, fileMimeType, accessToken);
    } else if (fileMimeType == 'text/plain') { //TODO support PDFs
      content = await getDriveTextFileContent(fileId, accessToken);
    } else {
      throw new Error("Unsupported file format");
    }
    console.log(`content is ${JSON.stringify(content)}`);
    return content;

  } catch (error) {
    console.log(`Error retrieving file content from Google Drive. ${error}`);
    return "";
  }
}

async function getDriveTextFileContent(fileId, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const docsResponse = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  });

  const content = docsResponse.data;

  return content;
}

// This is used for Google Workspace files only (Docs, Sheets, Slides)
async function exportDriveFile(fileId, fileMimeType, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  let exportedMimeType = ''
  if (fileMimeType == 'application/vnd.google-apps.spreadsheet') {
    exportedMimeType = 'text/csv'
  } else {
    exportedMimeType = 'text/plain'
  }

  const docsResponse = await drive.files.export({
    fileId: fileId,
    mimeType: exportedMimeType
  });

  const content = docsResponse.data;

  return content;
}

async function getFileParentId(fileId, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const fileMetaData = await drive.files.get({
      fileId: fileId,
      fields: 'parents'
    });

    console.log(`File metadata: ${JSON.stringify(fileMetaData)}`);

    const parents = fileMetaData.data.parents;

    return parents;
    
  } catch (err) {
    throw err;
  }
}

async function createDocsFileWithText(text, fileName, parents, accessToken) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const fileMetadata = {
    name: fileName,
    mimeType: 'application/vnd.google-apps.document',
    parents: parents
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
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    throw err;
  }
}

exports.getDocsContent = getFileContent;
exports.createDocsFileWithText = createDocsFileWithText;
exports.getFileParentId = getFileParentId;