import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: [],
  reducers: {
    // Set entire bookings list (e.g. from API)
    setBookings: (state, action) => action.payload,

    // Add a new booking (called from Events.jsx handleBookings)
    addBooking: (state, action) => {
      // Prevent duplicate bookings for the same event
      const exists = state.find((b) => b.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
      }
    },

    // Update an existing booking by id
    updateBooking: (state, action) => {
      const idx = state.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },

    // Delete a booking by id (used in MyEvents.jsx cancel booking)
    deleteBooking: (state, action) => {
      return state.filter((b) => b.id !== action.payload);
    },

    // Cancel a booking by id — sets status to "cancelled" instead of removing
    cancelBooking: (state, action) => {
      const idx = state.findIndex((b) => b.id === action.payload);
      if (idx !== -1) {
        state[idx] = { ...state[idx], status: "Cancelled" };
      }
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;