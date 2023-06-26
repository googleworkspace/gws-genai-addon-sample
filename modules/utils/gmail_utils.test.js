import {jest} from '@jest/globals';
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {Base64 as Base64} from "js-base64";
import {getGmailMessage, decodeGmailBodyPayload, createDraft} from "./gmail_utils";

jest.mock("googleapis");
jest.mock("google-auth-library");
jest.mock("js-base64");

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
