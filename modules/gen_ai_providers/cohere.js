cohere = require("cohere-ai");

// For models check https://docs.cohere.com/docs/models
const TEXT_GEN_MODEL_NAME = 'command-light'; //TODO use command-nightly or command-xlarge-nightly
const SUMMARIZE_MODEL_NAME = 'summarize-medium'; //TODO summarize-xlarge once timeout issue is done

// TODO create another exported function for creating content for Google Docs
async function generateEmailReply(subject, senderName, messageBody, replyTextPrompt, tone, language, authorName, config) {
  console.log("Entering Cohere provider module");

  const cohereApiKey = config.apiKey;

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

  cohere.init(cohereApiKey);

  const generations = await callCohereTextGenerationApi(prompt, cohere);

  //This is done to standerize the response to be used by the calling code
  let replies = [];

  // TODO can you remove the for loop and move to an array method ?
  for (let i = 0; i < generations.length; i++) {
    replies.push({ "suggestedText": generations[i].text });
  }

  return replies;
}

async function callCohereTextGenerationApi(prompt, cohere) {
  console.log("Calling Cohere..");

  const response = await cohere.generate({
    model: TEXT_GEN_MODEL_NAME,
    prompt: prompt,
    max_tokens: 300,
    temperature: 0.5,
    k: 0,
    stop_sequences: [],
    return_likelihoods: "NONE",
    num_generations: 2,
  });

  console.log(`Cohere response is ${JSON.stringify(response)}`);

  const generations = response.body.generations;

  return generations;
}

async function generateSummary(lengthSelection, formatSelection, text, config) {
  console.log("Entering Cohere provider module");

  const cohereApiKey = config.apiKey;

  cohere.init(cohereApiKey);

  // TODO split prompt into prompt and context
  const summary = await callCohereSummarizeEndpoint(lengthSelection, formatSelection, text, cohere);

  console.log(`Summary is ${JSON.stringify(summary)}`);

  return summary;
}

async function callCohereSummarizeEndpoint(lengthSelection, formatSelection, text, cohere) {
  console.log("Calling Cohere..");

  const response = await cohere.summarize({
    text: text,
    length: String(lengthSelection), //for some reason it is coming in as an array
    format: String(formatSelection),
    model: SUMMARIZE_MODEL_NAME,
    additional_command: '',
    temperature: 0.3,
  });

  console.log(`Cohere response is ${JSON.stringify(response)}`);

  const statusCode = response.statusCode;

  if (statusCode === 200) {
    const summary = response.body.summary;
    return summary;
  } else {
    console.log(`Error generating summary. API HTTP response code: ${statusCode}.`);
    return null;
  }
}

exports.generateEmailReply = generateEmailReply;
exports.generateSummary = generateSummary;
