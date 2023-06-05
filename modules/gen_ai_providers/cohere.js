// TODO create another exported function for creating content for Google Docs
async function generateEmailReply(subject, senderName, messageBody, replyTextPrompt, tone, language, authorName, config) {
  console.log("Entering Cohere provider module");

  const cohere = require("cohere-ai");

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

  const results = await generateCohereReplied(cohere, prompt);

  return results;
}

async function generateCohereReplied(cohere, prompt) {
  console.log("Calling Cohere..");

  const response = await cohere.generate({
    model: "command-xlarge-nightly",
    prompt: prompt,
    max_tokens: 300,
    temperature: 0.5,
    k: 0,
    stop_sequences: [],
    return_likelihoods: "NONE",
    num_generations: 3, //TODO look up the parameter
  });

  console.log(`Cohere response is ${JSON.stringify(response)}`);

  const generations = response.body.generations;


  //This is done to standerize the response to be used by the calling code
  let replies = [];

  // TODO can you remove the for loop and move to an array method ?
  for (let i = 0; i < generations.length; i++) {
    replies.push({ "suggestedText": generations[i].text });
  }

  return replies;
}

exports.generateEmailReply = generateEmailReply;
