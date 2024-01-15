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

import {GoogleAuth} from 'google-auth-library';

const TEXT_GEN_MODEL_NAME = 'gemini-pro';

// BASED ON https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/quickstart-multimodal
// and https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/send-chat-prompts-gemini

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

  const candidates = await callVertexAiGeminiApiTextModelGen(region, prompt);

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

  const results = await callVertexAiGeminiApiTextModelGen(region, prompt);

  if (results.length) {
    const summary = results[0].content;
    return summary;
  }
  console.error('No summary found');
  return null;
}

async function callVertexAiGeminiApiTextModelGen(region, prompt) {
  console.log('Calling Vertex AI Gemini APIs..');

  // Create auth client
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${TEXT_GEN_MODEL_NAME}:streamGenerateContent`;
  const data = {
    "contents": {
      "role": "user",
      "parts": [
        {
          "text": prompt
        }
      ]
    },
    // Check https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
    "generation_config": {
      "temperature": 0.9, // 0.0 - 1.0, default for gemini-pro is 0.9
      "topK": 40, // 1-40
      "topP": 0.95, // 0.0 - 1.0
      "candidateCount": 1, // must be 1
      "maxOutputTokens": 8192 // default for gemini-pro
    }
  };
  const res = await client.request({ method: 'POST', url, data });
  console.log(`Vertex AI Gemini API response is ${JSON.stringify(res.data)}`);

  return res.data.predictions;
}