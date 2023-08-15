/**
 * Copyright 2023 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cohere from 'cohere-ai';

// For models check https://docs.cohere.com/docs/models
const TEXT_GEN_MODEL_NAME = 'command-light'; // Other options include command-nightly, command-xlarge-nightly
const SUMMARIZE_MODEL_NAME = 'summarize-medium'; // Other options include summarize-xlarge

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

  const cohereApiKey = config.apiKey;

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

  cohere.init(cohereApiKey);

  const generations = await callCohereTextGenerationApi(prompt, cohere);

  return generations.map(generation => ({suggestedText: generation.text}));
}

async function callCohereTextGenerationApi(prompt, cohere) {
  console.log('Calling Cohere..');

  const response = await cohere.generate({
    model: TEXT_GEN_MODEL_NAME,
    prompt: prompt,
    max_tokens: 300,
    temperature: 0.5,
    k: 0,
    stop_sequences: [],
    return_likelihoods: 'NONE',
    num_generations: 2,
  });

  console.log(`Cohere response is ${JSON.stringify(response)}`);

  return response.body.generations;
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {

  const cohereApiKey = config.apiKey;

  cohere.init(cohereApiKey);

  const summary = await callCohereSummarizeEndpoint(
    lengthSelection,
    formatSelection,
    text,
    cohere,
  );

  return summary;
}

async function callCohereSummarizeEndpoint(
  lengthSelection,
  formatSelection,
  text,
  cohere,
) {
  console.log('Calling Cohere..');

  const response = await cohere.summarize({
    text: text,
    length: String(lengthSelection), // for some reason it is coming in as an array
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
  }

  console.error(
    `Error generating summary. API HTTP response code: ${statusCode}.`,
  );
  return null;
}
