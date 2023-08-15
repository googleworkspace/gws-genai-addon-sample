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

import {marked} from 'marked';
marked.use({headerIds: false, mangle: false});

export default function convertMarkdownToWidgets(markdownText) {
  return markdownText.split(/\r\n|\r|\n/).map((line) => {
    // Match Markdown list items
    const match = line.match(/^\s*-\s*(.*)/);

    // If the line matches a bullet list item format, replace with
    // a decorated text with a specific icon
    if (match) {
      const bulletListItemText = match[0].slice(2);

      return {
        decoratedText: {
          text: marked.parseInline(bulletListItemText),
          startIcon: {
            knownIcon: 'STAR',
          },
          wrapText: true,
        },
      };
    } else {
      // Otherwise, convert markdown text to HTML
      // in the paragraph widget
      return {
        textParagraph: {
          text: marked.parseInline(line),
        },
      };
    }
  });
}
