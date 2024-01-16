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

import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from '@google/generative-ai';

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

  const apiKey = config.apiKey;

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

  const suggestedText = await callGeminiApiTextModelGen(apiKey, prompt);

  return [{suggestedText}];
}

export async function generateSummary(
  lengthSelection,
  formatSelection,
  text,
  config,
) {

  const apiKey = config.apiKey;
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

  const summary = await callGeminiApiTextModelGen(apiKey, prompt);

  return summary;
}

// BASED ON https://ai.google.dev/tutorials/node_quickstart

async function callGeminiApiTextModelGen(apiKey, prompt) {
  console.log('Calling Gemini APIs..');

  const genAI = new GoogleGenerativeAI(apiKey);

  // You can change the model configuration below. Check 
  // https://ai.google.dev/tutorials/node_quickstart#model-parameters
  // for details
  const generationConfig = {
    temperature: 0.3,
    maxOutputTokens: 2048, // Max for Gemini Pro
  };

  // These are samples only, adjust as needed and check 
  // https://ai.google.dev/tutorials/node_quickstart#use-safety-settings
  // for details
  const safetySettings = [ 
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    }
  ];

  const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings, generationConfig});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResponse = response.text();
  
  console.log(`Gemini API response is ${JSON.stringify(response)}. \r\nText response is ${textResponse}`);

  return textResponse;
}
