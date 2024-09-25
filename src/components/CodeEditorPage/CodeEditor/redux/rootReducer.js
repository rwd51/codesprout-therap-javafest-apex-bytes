import { combineReducers } from "redux";
import { characterReducer } from "./character/characterReducer";
import { eventReducer } from "./events/eventReducer";
import { listReducer } from "./midarea/list";

import { previewAreaReducer } from "./previewarea/previewArea";

export const rootReducer = combineReducers({
  character: characterReducer,
  list: listReducer,
  event: eventReducer,
  previewArea: previewAreaReducer,
});
