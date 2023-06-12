const commonCardUiGenerator = require('./ui/common_card_ui_generator');

function generateNavigateBackResponse() {
    const response = commonCardUiGenerator.createNavigateBackUi();
    return response;
}

exports.generateNavigateBackResponse = generateNavigateBackResponse;