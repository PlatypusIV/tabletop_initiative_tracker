import { createSlice } from "@reduxjs/toolkit";
import { Character } from "../utils/interface";

interface InitiativeQueueState {
  initiativeQueue: Character[];
}

const initialInitiativeQueueState: InitiativeQueueState = {
  initiativeQueue: [],
};

const initiativeQueueSlice = createSlice({
  name: "initiativeQueue",
  initialState: initialInitiativeQueueState,
  reducers: {
    clearInitiativeQueue: (state) => {
      state.initiativeQueue = [];
    },
    removeCharacterFromQueue: (state, action) => {},
    //this is changeQueuePosition in app.tsx
    changeQueueOrder: (state, action) => {},
  },
});

export default initiativeQueueSlice.reducer;
