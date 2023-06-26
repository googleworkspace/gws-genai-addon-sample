import {TextServiceClient} from '@google-ai/generativelanguage';
import {GoogleAuth} from 'google-auth-library';

// TODO list the other modules (or link to it)
const CHAT_MODEL_NAME = 'models/text-bison-001';
const TEXT_GEN_MODEL_NAME = 'models/text-bison-001';

// BASED ON https://developers.generativeai.google/tutorials/chat_node_quickstart
// AND https://developers.generativeai.google/tutorials/text_node_quickstart

// TODO create another exported function for creating content for Google Docs
// TODO you can move config to the instantiations of the module?
export async function generateEmailReply(
  subject,
  senderName,
  messageBody,
  replyTextPrompt,
  tone,
  language,
  authorName,
  config,
) {
  console.log('Entering PaLM API provider module');

  const palmApiKey = config.apiKey;

  const prompt =
    // Add: My name is xyz or "Sign it with my name which is ()"
    // TODO Remove funny
    'Given an email with the subject "' +
    subject +
    '" from the sender "' +
    senderName +
    '" and the content "' +
    messageBody +
    '", write a reply saying "' +
    replyTextPrompt +
    '" in a ' +
    tone +
    ' tone in ' +
    language +
    ' and sign it with the name ' +
    authorName;

  console.log('Prompt to be sent to API is: ' + prompt);

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(palmApiKey),
  });

  // TODO split prompt into prompt and context
  const candidates = await callPalmApiChatModelGen(client, prompt);

  return candidates.map(candidate => ({suggestedText: candidate.output}));
}

async function callPalmApiChatModelGen(client, prompt) {
  console.log('Calling PaLM APIs..');

  const result = await client.generateText({
    model: CHAT_MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 2, // Optional. The number of candidate results to generate.
    maxOutputTokens: 1024, // Max for Chat Bison
    prompt: {
      //       // optional, preamble context to prime responses
      //       context: "Respond to all questions with a rhyming poem.",
      // TODO split prompt into prompt and context
      text: prompt,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_UNSPECIFIED',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DEROGATORY',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_VIOLENCE',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUAL',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_MEDICAL',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS',
        threshold: 'BLOCK_NONE',
      },
    ],
  });

  console.log(`PaLM API response is ${JSON.stringify(result)}`);

  return result[0].candidates;
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {
  console.log('Entering PaLM API provider module');

  const palmApiKey = config.apiKey;
  let numOfSentences = '';

  switch (String(lengthSelection)) {
    case 'short':
      numOfSentences = '1 - 2';
      break;
    case 'medium':
      numOfSentences = '3 - 4';
      break;
    case 'long':
      numOfSentences = '4 or more';
      break;
    default:
      numOfSentences = '3 - 4';
  }

  const prompt =
    // Add: My name is xyz or "Sign it with my name which is ()"
    // TODO Remove funny
    'Write a summary in ' +
    numOfSentences +
    ' sentences for the following article in a ' +
    formatSelection +
    ' format.\r\n ' +
    'Text: ' +
    text;

  console.log('Prompt to be sent to API is: ' + prompt);

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(palmApiKey),
  });

  // TODO split prompt into prompt and context
  const results = await callPalmApiTextModelGen(client, prompt);

  // TODO might want to do multiple summaries in the future
  if (results.length) {
    const summary = results[0].output;
    console.log(`Summary is ${JSON.stringify(summary)}`);
    return summary;
  }
  console.log('No summary found');
  return null;
}

async function callPalmApiTextModelGen(client, prompt) {
  console.log('Calling PaLM APIs..');

  const result = await client.generateText({
    model: TEXT_GEN_MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.3, // Optional. Value `0.0` always uses the highest-probability result.
    maxOutputTokens: 1024, // Max for Bison
    prompt: {
      //       // optional, preamble context to prime responses
      //       context: "Respond to all questions with a rhyming poem.",
      // TODO split prompt into prompt and context
      text: prompt,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_UNSPECIFIED',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DEROGATORY',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_VIOLENCE',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUAL',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_MEDICAL',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS',
        threshold: 'BLOCK_NONE',
      },
    ],
  });

  console.log(`PaLM API response is ${JSON.stringify(result)}`);

  return result[0].candidates;
}
