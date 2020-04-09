export const show = (state = false, action) => {
  switch (action.type) {
    case "SHOW_MODAL":
      return action.isShowing;
    default:
      return state;
  }
};
