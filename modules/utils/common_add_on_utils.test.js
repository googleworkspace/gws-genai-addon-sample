import {jest} from '@jest/globals';
import {OAuth2Client} from "google-auth-library";
import {getPayloadFromEvent, authenticateRequest} from "./common_add_on_utils";

jest.mock("google-auth-library");

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
