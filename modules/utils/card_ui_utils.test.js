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

import convertMarkdownToWidgets from './card_ui_utils';

describe('convertMarkdownToWidgets', () => {
  it('should expose a function', () => {
    expect(convertMarkdownToWidgets).toBeDefined();
  });

  it('should convert a bullet list item to a decorated text widget', () => {
    const markdownText = '- This is a bullet list item';
    const expectedResult = [{
      decoratedText: {
        text: 'This is a bullet list item',
        startIcon: {
          knownIcon: 'STAR'
        },
        wrapText: true,
      }
    }];

    expect(convertMarkdownToWidgets(markdownText)).toEqual(expectedResult);
  });

  it('should convert a paragraph of text to a paragraph widget', () => {
    const markdownText = 'This is a paragraph of text';
    const expectedResult = [{
      textParagraph: {
        text: 'This is a paragraph of text'
      }
    }];

    expect(convertMarkdownToWidgets(markdownText)).toEqual(expectedResult);
  });
});
