import { combineReducers } from "redux";
import user_reducer from "./user";
import channel_reducer from "./channel";
import color_reducer from "./color";

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  color: color_reducer
});

export default rootReducer;
