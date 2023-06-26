import {jest} from '@jest/globals';
import cohere from 'cohere-ai';
import {generateEmailReply, generateSummary} from './cohere';

jest.mock('cohere-ai');

describe('generateEmailReply', () => {
  it('should expose a function', () => {
    expect(generateEmailReply).toBeDefined();
  });

  it('generateEmailReply should return expected output', async () => {
    // const retValue = await generateEmailReply(subject,senderName,messageBody,replyTextPrompt,tone,language,authorName,config);
    // // expect(false).toBeTruthy();
  });
});
describe('generateSummary', () => {
  it('should expose a function', () => {
    expect(generateSummary).toBeDefined();
  });

  it('generateSummary should return expected output', async () => {
    // const retValue = await generateSummary(lengthSelection,formatSelection,text,config);
    // // expect(false).toBeTruthy();
  });
});
