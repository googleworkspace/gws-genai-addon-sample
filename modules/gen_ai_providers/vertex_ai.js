const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

//TODO list the other modules (or link to it)
const CHAT_MODEL_NAME = "models/text-bison-001";
const TEXT_GEN_MODEL_NAME = "models/text-bison-001";

// BASED ON https://developers.generativeai.google/tutorials/chat_node_quickstart

// TODO create another exported function for creating content for Google Docs
// TODO you can move config to the instantiations of the module?
async function generateEmailReply(subject, senderName, messageBody, replyTextPrompt, tone, language, authorName, config) {
  console.log("Entering Vertex AI PaLM API provider module");

  const vertexAiPalmApiKey = config.apiKey;

  let prompt =
    //Add: My name is xyz or "Sign it with my name which is ()"
    //TODO Remove funny
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
    " tone in " +
    language +
    " and sign it with the name " +
    authorName;

  console.log("Prompt to be sent to API is: " + prompt);

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(vertexAiPalmApiKey),
  });

  // TODO split prompt into prompt and context
  const candidates = await callVertexAiPalmChatGenApi(client, prompt);

  //This is done to standerize the response to be used by the calling code
  let replies = [];
  // TODO can you remove the for loop and move to an array method ?
  for (let i = 0; i < candidates.length; i++) {
    replies.push({ "suggestedText": candidates[i].output });
  }

  return replies;
}


async function callVertexAiPalmChatGenApi(client, prompt) {
  console.log("Calling Vertex AI PaLM APIs..");

  const result = await client.generateText({
    model: CHAT_MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 2, // Optional. The number of candidate results to generate.
    prompt: {
      //       // optional, preamble context to prime responses
      //       context: "Respond to all questions with a rhyming poem.",     
      // TODO split prompt into prompt and context
      text: prompt,
    },
  });

  console.log(`Vertex AI PaLM API response is ${JSON.stringify(result)}`);

  const candidates = result[0].candidates;

  return candidates;
}

async function generateSummary(lengthSelection, formatSelection, text, config) {
  console.log("Entering Vertex AI PaLM API provider module");

  const vertexAiPalmApiKey = config.apiKey;

  let prompt =
    //Add: My name is xyz or "Sign it with my name which is ()"
    //TODO Remove funny
    'Provide a ' +
    lengthSelection + 
    ' length summary for the text below in ' +
    formatSelection +
    ' format. Short means 1-2 sentences, mediums means 3-4 sentences while large means 4 or more sentences.\r\n ' +
    'Text: ' +
    text;

  console.log("Prompt to be sent to API is: " + prompt);

  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(vertexAiPalmApiKey),
  });

  // TODO split prompt into prompt and context
  const results = await callVertexAiPalmTextGenApi(client, prompt);

  // TODO might want to do multiple summaries in the future
  const summary = results[0].output;

  console.log(`Summary is ${JSON.stringify(summary)}`);

  return summary;
}

async function callVertexAiPalmTextGenApi(client, prompt) {
  console.log("Calling Vertex AI PaLM APIs..");

  const result = await client.generateText({
    model: TEXT_GEN_MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 2, // Optional. The number of candidate results to generate.
    prompt: {
      //       // optional, preamble context to prime responses
      //       context: "Respond to all questions with a rhyming poem.",     
      // TODO split prompt into prompt and context
      text: prompt,
    },
  });

  console.log(`Vertex AI PaLM API response is ${JSON.stringify(result)}`);

  const candidates = result[0].candidates;

  return candidates;
}

exports.generateEmailReply = generateEmailReply;
exports.generateSummary = generateSummary;
