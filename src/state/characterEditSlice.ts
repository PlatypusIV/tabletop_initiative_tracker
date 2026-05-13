import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character } from "../utils/interface";

interface CharacterEditState {
  characterBeingEdited: Character;
}

const characterEditInitialState: CharacterEditState = {
  characterBeingEdited: {
    name: "",
    position: 0,
    initiativeScore: 0,
    hitpoints: 0,
  },
};

const characterEditSlice = createSlice({
  name: "characterBeingEdited",
  initialState: characterEditInitialState,
  reducers: {
    editSelectedCharacter: (state, action: PayloadAction<Character>) => {
      state.characterBeingEdited = action.payload;
    },
    clearCharacterEdit: (state) => {
      state.characterBeingEdited =
        characterEditInitialState.characterBeingEdited;
    },
  },
});

export const { editSelectedCharacter, clearCharacterEdit } =
  characterEditSlice.actions;

export default characterEditSlice.reducer;
