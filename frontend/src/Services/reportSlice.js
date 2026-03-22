import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
  name: "report",
  initialState: [],
  reducers: {
    setReports: (state, action) => action.payload,
    addReport: (state, action) => {
      state.push(action.payload);
    },
    clearReports: () => [],
  },
});

export const { setReports, addReport, clearReports } = reportSlice.actions;
export default reportSlice.reducer;
