import {GoogleAuth} from 'google-auth-library';

const TEXT_GEN_MODEL_NAME = 'text-bison';

// BASED ON https://developers.generativeai.google/tutorials/chat_node_quickstart
// AND https://developers.generativeai.google/tutorials/text_node_quickstart

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

  const region = config.region;

  const prompt =
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

  const candidates = await callVertexAiPalmApiTextModelGen(region, prompt);

  return candidates.map(candidate => ({suggestedText: candidate.content}));
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {

  const region = config.region;
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
    'Write a summary in ' +
    numOfSentences +
    ' sentences for the following article in a ' +
    formatSelection +
    ' format.\r\n ' +
    'Text: ' +
    text;

  const results = await callVertexAiPalmApiTextModelGen(region, prompt);

  if (results.length) {
    const summary = results[0].content;
    return summary;
  }
  console.error('No summary found');
  return null;
}

async function callVertexAiPalmApiTextModelGen(region, prompt) {
  console.log('Calling Vertex AI PaLM APIs..');

  // Create auth client
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${TEXT_GEN_MODEL_NAME}:predict`;
  const data = {
    "instances": [
      {
        "prompt": prompt
      }
    ],
    "parameters": {
      "temperature": 0.2,
      "maxOutputTokens": 256,
      "topK": 40,
      "topP": 0.95
    }
  }
  const res = await client.request({ method: 'POST', url, data });
  console.log(`Vertex AI PaLM API response is ${JSON.stringify(res.data)}`);

  return res.data.predictions;
}