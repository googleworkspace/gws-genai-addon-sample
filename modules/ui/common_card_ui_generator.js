export default function createNavigateBackUi() {
  return {
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
}
