/**
 * Copyright 2024 Google LLC.
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

import {VertexAI, HarmCategory, HarmBlockThreshold} from '@google-cloud/vertexai';

const MODEL_NAME = 'gemini-pro';

// BASED ON https://github.com/googleapis/nodejs-vertexai?tab=readme-ov-file

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

  const project = config.project;
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

  const candidates = await callVertexAiGeminiApiTextModelGen(project, region, prompt);

  return candidates.map(candidate => ({suggestedText: candidate.content.parts[0].text}));
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {

  const project = config.project
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
    ' sentences for the following text in a ' +
    formatSelection +
    ' format.\r\n ' +
    'Text: ' +
    text;

  const results = await callVertexAiGeminiApiTextModelGen(project, region, prompt);

  if (results.length) {
    const summary = results[0].content.parts[0].text;
    return summary;
  }
  console.error('No summary found');
  return null;
}

async function callVertexAiGeminiApiTextModelGen(project, region, prompt) {
  console.log('Calling Vertex AI Gemini APIs..');

  const vertex_ai = new VertexAI({project: project, location: region});

  // Instantiate models
  // Learn more about the configuration below at https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
  const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: MODEL_NAME,
      // The following parameters are optional
      safety_settings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
      generation_config: {
        "temperature": 0.9, // 0.0 - 1.0, default for gemini-pro is 0.9
        "topK": 40, // 1-40
        "topP": 0.95, // 0.0 - 1.0
        "candidateCount": 1, // must be 1
        "maxOutputTokens": 8192 // default for gemini-pro
      },
    });

  const request = {
    contents: [{role: 'user', parts: [{text: prompt}]}],
  };

  const resp = await generativeModel.generateContent(request);

  const responseData = await resp.response;

  console.log(`Vertex AI Gemini API response is ${JSON.stringify(responseData)}`);

  return responseData.candidates;
}