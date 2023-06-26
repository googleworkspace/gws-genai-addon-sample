import {jest} from '@jest/globals';
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {getFileContent, getFileParentId, createDocsFileWithText} from "./drive_utils";

jest.mock("googleapis");
jest.mock("google-auth-library");

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
