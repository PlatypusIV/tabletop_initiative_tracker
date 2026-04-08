import { configureStore } from "@reduxjs/toolkit";
import initiativeQueueReducer from "./initiativeQueueSlice";
import characterEditReducer from "./characterEditSlice";
import {
  clearInitiativeQueueStore,
  editInitiativeQueue,
} from "./initiativeQueueSlice";
import {
  editSelectedCharacter,
  clearCharacterEdit,
} from "./characterEditSlice";

export const store = configureStore({
  reducer: {
    initiativeQueue: initiativeQueueReducer,
    characterBeingEdited: characterEditReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  clearInitiativeQueueStore,
  editInitiativeQueue,
  editSelectedCharacter,
  clearCharacterEdit,
};
