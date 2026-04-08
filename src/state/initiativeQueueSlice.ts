import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    clearInitiativeQueueStore: (state) => {
      state.initiativeQueue = [];
    },
    editInitiativeQueue: (state, action: PayloadAction<Character[]>) => {
      state.initiativeQueue = action.payload;
    },
    //this is changeQueuePosition in app.tsx
    changeQueueOrder: (state, action) => {},
  },
});

export const {
  clearInitiativeQueueStore,
  changeQueueOrder,
  editInitiativeQueue,
} = initiativeQueueSlice.actions;

export default initiativeQueueSlice.reducer;
