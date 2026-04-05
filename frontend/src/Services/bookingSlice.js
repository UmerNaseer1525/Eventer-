import { createSlice } from "@reduxjs/toolkit";

const DUMMY_BOOKINGS = [
  {
    id: "BK-1001",
    eventId: 1,
    title: "Tech Conference 2026",
    name: "Tech Conference 2026",
    category: "Conference",
    location: "Expo Center, City A",
    organizer: "EventX",
    status: "Upcoming",
    paymentStatus: "Paid",
    amount: 1000,
    price: 1000,
    date: "2026-04-12",
    time: "10:00",
    cover:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    reservedSeats: 2,
    user: "Ali Khan",
    email: "ali@example.com",
    method: "Credit Card",
  },
  {
    id: "BK-1002",
    eventId: 5,
    title: "Music Festival",
    name: "Music Festival",
    category: "Concert",
    location: "Open Grounds, City B",
    organizer: "EventX",
    status: "Ongoing",
    paymentStatus: "Paid",
    amount: 1000,
    price: 1000,
    date: "2026-04-20",
    time: "18:30",
    cover:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    reservedSeats: 1,
    user: "Sara Noor",
    email: "sara@example.com",
    method: "Wallet",
  },
  {
    id: "BK-1003",
    eventId: 4,
    title: "Tech Conference",
    name: "Tech Conference",
    category: "Conference",
    location: "Expo Center, City A",
    organizer: "EventX",
    status: "Cancelled",
    paymentStatus: "Refunded",
    amount: 600,
    price: 600,
    date: "2026-03-10",
    time: "14:00",
    cover:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    reservedSeats: 1,
    user: "Umer Jamil",
    email: "umer@example.com",
    method: "Bank Transfer",
  },
];

const bookingSlice = createSlice({
  name: "booking",
  initialState: DUMMY_BOOKINGS,
  reducers: {
    setBookings: (state, action) => action.payload,
    addBooking: (state, action) => {
      state.push(action.payload);
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
