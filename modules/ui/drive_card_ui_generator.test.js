import {jest} from '@jest/globals';
import convertMarkdownToWidgets from "../utils/card_ui_utils.js";
import {createRenderActionWithTextUi, createSingleCardWithTextUi, createOnItemsSelectedTriggerUi, createGenerateSummaryUi, createNotificationUi} from "./drive_card_ui_generator";

jest.mock("../utils/card_ui_utils.js");

describe('createRenderActionWithTextUi', () => {
  it('should expose a function', () => {
    expect(createRenderActionWithTextUi).toBeDefined();
  });

  it('createRenderActionWithTextUi should return expected output', () => {
    // const retValue = createRenderActionWithTextUi(text);
    // expect(false).toBeTruthy();
  });
});
describe('createSingleCardWithTextUi', () => {
  it('should expose a function', () => {
    expect(createSingleCardWithTextUi).toBeDefined();
  });

  it('createSingleCardWithTextUi should return expected output', () => {
    // const retValue = createSingleCardWithTextUi(text);
    // expect(false).toBeTruthy();
  });
});
describe('createOnItemsSelectedTriggerUi', () => {
  it('should expose a function', () => {
    expect(createOnItemsSelectedTriggerUi).toBeDefined();
  });

  it('createOnItemsSelectedTriggerUi should return expected output', () => {
    // const retValue = createOnItemsSelectedTriggerUi(fileName,providerSelectionItems,generateDocsSummaryFunctionUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createGenerateSummaryUi', () => {
  it('should expose a function', () => {
    expect(createGenerateSummaryUi).toBeDefined();
  });

  it('createGenerateSummaryUi should return expected output', () => {
    // const retValue = createGenerateSummaryUi(summary,exportToDocsUrl,navigateBackUrl);
    // expect(false).toBeTruthy();
  });
});
describe('createNotificationUi', () => {
  it('should expose a function', () => {
    expect(createNotificationUi).toBeDefined();
  });

  it('createNotificationUi should return expected output', () => {
    // const retValue = createNotificationUi(message);
    // expect(false).toBeTruthy();
  });
});
