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
