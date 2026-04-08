import { configureStore } from "@reduxjs/toolkit";
import initiativeQueueReducer from "./initiativeQueueSlice";

export const store = configureStore({
  reducer: {
    initiativeQueue: initiativeQueueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
