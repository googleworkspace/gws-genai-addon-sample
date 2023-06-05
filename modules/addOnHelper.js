const { OAuth2Client } = require("google-auth-library");

async function getPayloadFromEvent(event, oauthClientId) {
    const oAuth2Client = new OAuth2Client();
    const decodedToken = await oAuth2Client.verifyIdToken({
      idToken: event.authorizationEventObject.userIdToken,
      audience: oauthClientId,
    });
    const payload = decodedToken.getPayload();

    console.log("User ID token payload: " + JSON.stringify(payload));
    // E.g. payload.email for email,  payload.sub for user ID
    return payload;
  }

exports.getPayloadFromEvent = getPayloadFromEvent;