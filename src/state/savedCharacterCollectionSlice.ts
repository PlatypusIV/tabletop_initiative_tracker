import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character } from "../utils/interface";

interface SavedCharactersCollectionState {
  savedCharactersCollection: Character[];
}

const savedCharactersInitialState: SavedCharactersCollectionState = {
  savedCharactersCollection: [],
};

const savedCharacterCollectionSlice = createSlice({
  name: "savedCharacterCollection",
  initialState: savedCharactersInitialState,
  reducers: {
    setSavedCharacterCollection: (
      state,
      action: PayloadAction<Character[]>,
    ) => {
      state.savedCharactersCollection = action.payload;
    },
  },
});

export const { setSavedCharacterCollection } =
  savedCharacterCollectionSlice.actions;

export default savedCharacterCollectionSlice.reducer;
