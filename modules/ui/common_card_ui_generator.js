export default function createNavigateBackUi() {
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
