import * as actionTypes from "../actions/types";

const InitialState = {
  primaryColor: "#4c3c4c",
  secondaryColor: "#eee"
};
const color_reducer = (state = InitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };
    default:
      return state;
  }
};

export default color_reducer;
