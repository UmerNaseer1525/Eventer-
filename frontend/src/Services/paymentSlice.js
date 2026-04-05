import { createSlice } from "@reduxjs/toolkit";

const DUMMY_PAYMENTS = [
  {
    id: "PAY-9001",
    eventId: 1,
    eventName: "Tech Conference 2026",
    user: "Ali Khan",
    email: "ali@example.com",
    amount: 1000,
    method: "Credit Card",
    status: "Completed",
    date: "2026-04-10",
  },
  {
    id: "PAY-9002",
    eventId: 5,
    eventName: "Music Festival",
    user: "Sara Noor",
    email: "sara@example.com",
    amount: 1000,
    method: "Wallet",
    status: "Completed",
    date: "2026-04-18",
  },
  {
    id: "PAY-9003",
    eventId: 4,
    eventName: "Tech Conference",
    user: "Umer Jamil",
    email: "umer@example.com",
    amount: 600,
    method: "Bank Transfer",
    status: "Refunded",
    date: "2026-03-08",
  },
];

const paymentSlice = createSlice({
  name: "payment",
  initialState: DUMMY_PAYMENTS,
  reducers: {
    setPayments: (state, action) => action.payload,
    addPayment: (state, action) => {
      // Stripe checkout/webhook integration will replace this local demo mutation.
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
