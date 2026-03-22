import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: [
    {
      id: 1,
      cover:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      name: "Tech Conference 2026",
      category: "Conference",
      status: "Upcoming",
      location: "Expo Center, City A",
      contact: "+1234567890",
      isApproved: false,
    },
    {
      id: 2,
      cover:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      name: "Music Fest",
      category: "Concert",
      status: "Cancelled",
      location: "Open Grounds, City B",
      contact: "+9876543210",
      isApproved: true,
    },
    {
      id: 3,
      cover:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      name: "Startup Meetup",
      category: "Meetup",
      status: "Completed",
      location: "Tech Park, City C",
      contact: "+1122334455",
      isApproved: false,
    },
    {
      id: 4,
      cover:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      name: "Tech Conference",
      category: "Conference",
      status: "Upcoming",
      location: "Expo Center, City A",
      contact: "+1234567890",
      isApproved: true,
    },
    {
      id: 5,
      cover:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      name: "Music Festival",
      category: "Concert",
      status: "Ongoing",
      location: "Open Grounds, City B",
      contact: "+9876543210",
      isApproved: true,
    },
    {
      id: 6,
      cover:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      name: "Startup Meetup",
      category: "Meetup",
      status: "Completed",
      location: "Tech Park, City C",
      contact: "+1122334455",
      isApproved: true,
    },
  ],
  reducers: {
    addEvent: (state, action) => {
      state.push(action.payload);
    },

    deleteEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload.id);
    },

    updateEvent: (state, action) => {
      return state.map((event) =>
        event.id === action.payload.id ? action.payload : event,
      );
    },

    updateStatus: (state, action) => {
      return state.map((event) => {
        if (event.id === action.payload.id) {
          return {
            ...event,
            status: action.payload.status,
          };
        } else {
          return event;
        }
      });
    },
  },
});

export const { addEvent, deleteEvent, updateEvent, updateStatus } =
  eventSlice.actions;
export default eventSlice.reducer;
