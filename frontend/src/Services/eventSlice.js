import { createSlice } from "@reduxjs/toolkit";
import { normalizeApprovalStatus } from "../utils/eventApproval";

const eventSlice = createSlice({
  name: "event",
  initialState: [
    {
      id: 1,
      bannerImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      title: "Tech Conference 2026",
      category: "Conference",
      status: "Upcoming",
      approvedStatus: "Pending",
      location: "Expo Center, City A",
      capacity: 200,
      ticketPrice: 500,
      isApproved: false,
    },
    {
      id: 2,
      bannerImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      title: "Music Fest",
      category: "Concert",
      status: "Cancelled",
      approvedStatus: "Accepted",
      location: "Open Grounds, City B",
      capacity: 350,
      ticketPrice: 800,
      isApproved: true,
    },
    {
      id: 3,
      bannerImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      title: "Startup Meetup",
      category: "Meetup",
      status: "Completed",
      approvedStatus: "Pending",
      location: "Tech Park, City C",
      capacity: 120,
      ticketPrice: 0,
      isApproved: false,
    },
    {
      id: 4,
      bannerImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      title: "Tech Conference",
      category: "Conference",
      status: "Upcoming",
      approvedStatus: "Accepted",
      location: "Expo Center, City A",
      capacity: 250,
      ticketPrice: 600,
      isApproved: true,
    },
    {
      id: 5,
      bannerImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      title: "Music Festival",
      category: "Concert",
      status: "Ongoing",
      approvedStatus: "Accepted",
      location: "Open Grounds, City B",
      capacity: 400,
      ticketPrice: 1000,
      isApproved: true,
    },
    {
      id: 6,
      bannerImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      title: "Startup Meetup",
      category: "Meetup",
      status: "Completed",
      approvedStatus: "Accepted",
      location: "Tech Park, City C",
      capacity: 80,
      ticketPrice: 0,
      isApproved: true,
    },
  ],
  reducers: {
    addEvent: (state, action) => {
      const approvalStatus = normalizeApprovalStatus(action.payload);
      state.push({
        ...action.payload,
        approvedStatus: approvalStatus,
        isApproved: approvalStatus === "Accepted",
      });
    },

    deleteEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload.id);
    },

    updateEvent: (state, action) => {
      return state.map((event) => {
        if (event.id !== action.payload.id) return event;

        const merged = {
          ...event,
          ...action.payload,
        };
        const approvalStatus = normalizeApprovalStatus(merged);

        return {
          ...merged,
          approvedStatus: approvalStatus,
          isApproved: approvalStatus === "Accepted",
        };
      });
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

    updateApprovedStatus: (state, action) => {
      return state.map((event) => {
        if (event.id === action.payload.id) {
          return {
            ...event,
            approvedStatus: "Pending",
            isApproved: false,
            reason: null,
          };
        } else {
          return event;
        }
      });
    },

    eventRejected: (state, action) => {
      return state.map((event) => {
        if (event.id === action.payload.id) {
          return {
            ...event,
            approvedStatus: "Rejected",
            isApproved: false,
            reason: action.payload.reason,
          };
        } else {
          return event;
        }
      });
    },
    eventApproved: (state, action) => {
      return state.map((event) => {
        if (event.id === action.payload.id) {
          return {
            ...event,
            approvedStatus: "Accepted",
            isApproved: true,
            reason: null,
          };
        } else {
          return event;
        }
      });
    },
  },
});

export const {
  addEvent,
  deleteEvent,
  updateEvent,
  updateStatus,
  eventApproved,
  eventRejected,
  updateApprovedStatus,
} = eventSlice.actions;
export default eventSlice.reducer;
