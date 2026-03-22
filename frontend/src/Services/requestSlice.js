import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      state.push(action.payload);
    },

    approveRequest: (state, action) => {
      return state.filter((req) => req.id !== action.payload);
    },

    rejectRequest: (state, action) => {
      return state.map((req) => {
        if (req.id === action.payload.id) {
          return {
            ...req,
            approvedStatus: action.payload.approvedStatus,
          };
        } else {
          return req;
        }
      });
    },
  },
});

export const { addRequest, approveRequest, rejectRequest } =
  requestSlice.actions;
export default requestSlice.reducer;
