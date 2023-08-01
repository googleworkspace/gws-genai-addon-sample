import {marked} from 'marked';
marked.use({headerIds: false, mangle: false});

export default function convertMarkdownToWidgets(markdownText) {
  return markdownText.split(/\r\n|\r|\n/).map((line) => {
    const bulletListRegex = /^[-*+] (.*)/;
    const match = line.match(bulletListRegex);

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
      // Otherwise, convert markdown text to the supported HTML tags
      // in the paragraph widget
      return {
        textParagraph: {
          text: marked.parseInline(line),
        },
      };
    }
  });
}
