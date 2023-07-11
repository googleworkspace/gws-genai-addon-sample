import {GoogleAuth} from 'google-auth-library';

// TODO list the other modules (or link to it)
const CHAT_MODEL_NAME = 'chat-bison';
const TEXT_GEN_MODEL_NAME = 'text-bison';

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
  console.log('Entering Vertex AI PaLM API provider module');

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

  // TODO split prompt into prompt and context
  const candidates = await callVertexAiPalmApiChatModelGen(prompt);

  return candidates.map(candidate => ({suggestedText: candidate.output}));
}

async function callVertexAiPalmApiChatModelGen(prompt) {
  // console.log('Calling Vertex AI PaLM APIs..');

  // const result = await client.generateText({
  //   model: CHAT_MODEL_NAME, // Required. The model to use to generate the result.
  //   temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
  //   candidateCount: 2, // Optional. The number of candidate results to generate.
  //   maxOutputTokens: 1024, // Max for Chat Bison
  //   prompt: {
  //     //       // optional, preamble context to prime responses
  //     //       context: "Respond to all questions with a rhyming poem.",
  //     // TODO split prompt into prompt and context
  //     text: prompt,
  //   },
  //   safetySettings: [
  //     {
  //       category: 'HARM_CATEGORY_UNSPECIFIED',
  //       threshold: 'BLOCK_NONE',
  //     },
  //     {
  //       category: 'HARM_CATEGORY_DEROGATORY',
  //       threshold: 'BLOCK_NONE',
  //     },
  //     {
  //       category: 'HARM_CATEGORY_VIOLENCE',
  //       threshold: 'BLOCK_NONE',
  //     },
  //     {
  //       category: 'HARM_CATEGORY_SEXUAL',
  //       threshold: 'BLOCK_NONE',
  //     },
  //     {
  //       category: 'HARM_CATEGORY_MEDICAL',
  //       threshold: 'BLOCK_NONE',
  //     },
  //     {
  //       category: 'HARM_CATEGORY_DANGEROUS',
  //       threshold: 'BLOCK_NONE',
  //     },
  //   ],
  // });

  // console.log(`PaLM API response is ${JSON.stringify(result)}`);

  // return result[0].candidates;
  throw new Error("Not implemented");
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {
  console.log('Entering Vertex AI PaLM API provider module');

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

  // TODO split prompt into prompt and context
  const results = await callVertexAiPalmApiTextModelGen(region, prompt);

  // TODO might want to do multiple summaries in the future
  if (results.length) {
    const summary = results[0].content;
    console.log(`Summary is ${JSON.stringify(summary)}`);
    return summary;
  }
  console.log('No summary found');
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