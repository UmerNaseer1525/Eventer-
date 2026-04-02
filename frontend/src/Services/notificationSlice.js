import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    admin: [],
    user: [],
  },
  reducers: {
    setNotifications: (state, action) => action.payload,
    addAdminNotification: (state, action) => {
      state.admin.push(action.payload);
    },

    addNotification: (state, action) => {
      state.user.push(action.payload);
    },

    removeAdminNotification: (state, action) => {
      return state.admin.filter((n) => n.id !== action.payload);
    },

    removeUserNotification: (state, action) => {
      return state.user.filter((n) => n.id !== action.payload);
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
