import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: [],
  reducers: {
    setPayments: (state, action) => action.payload,
    addPayment: (state, action) => {
      state.push(action.payload);
    },
    updatePayment: (state, action) => {
      const idx = state.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deletePayment: (state, action) => {
      return state.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setPayments, addPayment, updatePayment, deletePayment } =
  paymentSlice.actions;
export default paymentSlice.reducer;
