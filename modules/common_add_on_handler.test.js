import {jest} from '@jest/globals';
import createNavigateBackUi from './ui/common_card_ui_generator.js';
import generateNavigateBackResponse from './common_add_on_handler';

jest.mock('./ui/common_card_ui_generator.js');

describe('generateNavigateBackResponse', () => {
  it('should expose a function', () => {
    expect(generateNavigateBackResponse).toBeDefined();
  });

  it('generateNavigateBackResponse should return expected output', () => {
    // const retValue = generateNavigateBackResponse();
    // expect(false).toBeTruthy();
  });
});
