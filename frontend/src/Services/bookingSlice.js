import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: [],
  reducers: {
    setBookings: (state, action) => action.payload,
    addBooking: (state, action) => {
      state.push({
        ...action.payload,
        number_of_guests:
          action.payload.number_of_guests > 0
            ? action.payload.number_of_guests - 1
            : action.payload.number_of_guests,
      });
    },
    updateBooking: (state, action) => {
      const idx = state.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteBooking: (state, action) => {
      return state.filter((b) => b.id !== action.payload);
    },
  },
});

export const { setBookings, addBooking, updateBooking, deleteBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
