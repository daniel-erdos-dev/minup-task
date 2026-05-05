import {configureStore} from "@reduxjs/toolkit";
import appointmentReducer from "./appointmentSlice";
import collapsedReducer from "./collapsedSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    collapsed: collapsedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
