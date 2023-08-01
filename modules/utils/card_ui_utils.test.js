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
