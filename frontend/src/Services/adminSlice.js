import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {},
  reducers: {
    setAdminData: (state, action) => ({ ...state, ...action.payload }),
    clearAdminData: () => ({}),
  },
});

export const { setAdminData, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
