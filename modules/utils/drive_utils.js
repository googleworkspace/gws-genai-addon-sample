const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

async function getDocsContent(fileId, accessToken) {
    try {
        const oauth2Client = new OAuth2Client();
        oauth2Client.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        const docsResponse = await drive.files.export({
            fileId: fileId,
            mimeType: 'text/plain'
        });

        const content = docsResponse.data;

        console.log(`content is ${JSON.stringify(content)}`);

        return content;
    } catch (error) {
        console.log(`Error retrieving file content from Google Drive. ${error}`);
        return "";
    }
}

exports.getDocsContent = getDocsContent;