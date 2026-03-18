import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => action.payload,
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    removeNotification: (state, action) => {
      return state.filter((n) => n.id !== action.payload);
    },
    clearNotifications: () => [],
  },
});

export const {
  setNotifications,
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
