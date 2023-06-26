import createNavigateBackUi from './common_card_ui_generator';

describe('createNavigateBackUi', () => {
  it('should expose a function', () => {
    expect(createNavigateBackUi).toBeDefined();
  });

  it('createNavigateBackUi should return expected output', () => {
    expect(createNavigateBackUi()).toEqual({"renderActions": {"action": {"navigations": [{"pop": true}]}}});
  });
});
