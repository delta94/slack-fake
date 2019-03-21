import * as actionTypes from "../actions/types";

const InitialState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = InitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return { ...InitialState, isLoading: false };
    default:
      return state;
  }
};

export default user_reducer;
