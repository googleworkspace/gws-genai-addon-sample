export default function createNavigateBackUi() {
  const response = {
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
