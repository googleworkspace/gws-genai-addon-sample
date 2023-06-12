
function createNavigateBackUi() {
  let response = {
    renderActions: {
      action: {
        navigations: [
          {
            pop: true,
          },
        ],
      },
    },
  };

  return response;
}

exports.createNavigateBackUi = createNavigateBackUi;  