import { configureStore } from "@reduxjs/toolkit";
import initiativeQueueReducer from "./initiativeQueueSlice";
import characterEditReducer from "./characterEditSlice";
import savedCharacterCollectionReducer from "./savedCharacterCollectionSlice";
import {
  clearInitiativeQueueStore,
  editInitiativeQueue,
} from "./initiativeQueueSlice";
import {
  editSelectedCharacter,
  clearCharacterEdit,
} from "./characterEditSlice";
import { setSavedCharacterCollection } from "./savedCharacterCollectionSlice";

export const store = configureStore({
  reducer: {
    initiativeQueue: initiativeQueueReducer,
    characterBeingEdited: characterEditReducer,
    savedCharactersCollection: savedCharacterCollectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  clearInitiativeQueueStore,
  editInitiativeQueue,
  editSelectedCharacter,
  clearCharacterEdit,
  setSavedCharacterCollection,
};
