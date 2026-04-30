import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    eventsData: [],
    pendingAprovalEvents: [],
    rejectedEvents: []
  },
  reducers: {
    addEventSuccess: (state, action) => {
      const events = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.eventsData = events.filter(
        (event) => String(event?.isApproved || "").toLowerCase() === "approved",
      );
      state.pendingAprovalEvents = events.filter(
        (event) => String(event?.isApproved || "").toLowerCase() === "pending",
      );
      state.rejectedEvents = events.filter(
        (event) => String(event?.isApproved || "").toLowerCase() === "rejected",
      );
    },
    addSingleEvent: (state, action) => {
      const e = action.payload;
      const v = String(e?.isApproved || "").toLowerCase();
      if (v === 'approved') {
        state.eventsData = state.eventsData || [];
        state.eventsData.push(e);
      } else if (v === 'pending') {
        state.pendingAprovalEvents = state.pendingAprovalEvents || [];
        state.pendingAprovalEvents.push(e);
      } else if (v === 'rejected') {
        state.rejectedEvents = state.rejectedEvents || [];
        state.rejectedEvents.push(e);
      }
    },

    deleteEvent: (state, action) => {
      const id = action.payload.id;
      state.eventsData = (state.eventsData || []).filter((ev) => String(ev._id) !== String(id));
      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).filter((ev) => String(ev._id) !== String(id));
    },

    updateEvent: (state, action) => {
      const payload = action.payload || {};
      const id = payload._id;
      const found = (state.eventsData || []).find(ev => String(ev._id) === String(id));

      if (found && String(found.isApproved || '').toLowerCase() === 'approved') {
        state.eventsData = (state.eventsData || []).map(event => {
          if (String(event._id) !== String(id)) return event;
          return { ...event, ...payload };
        });
      } else {
        state.pendingAprovalEvents = (state.pendingAprovalEvents || []).map(event => {
          if (String(event._id) !== String(id)) return event;
          return { ...event, ...payload };
        });
      }
    },

    updateStatus: (state, action) => {
      const validStatuses = ['completed', 'ongoing', 'cancelled', 'upcoming'];
      const newStatus = action.payload.status;
      
      if (!validStatuses.includes(newStatus)) return;
      
      state.eventsData = (state.eventsData || []).map((event) => {
        if (String(event._id) === String(action.payload.id)) {
          return {
            ...event,
            status: newStatus,
          };
        }
        return event;
      });
    },

    updateApprovedStatus: (state, action) => {
      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).map((event) => {
        if (String(event._id) === String(action.payload.id)) {
          return {
            ...event,
            isApproved: 'pending',
          };
        }
        return event;
      });
    },

    eventRejected: (state, action) => {
      const eventId = action.payload.id;
      const event = state.pendingAprovalEvents.find(e => String(e._id) === String(eventId));
      if (event) {
        state.pendingAprovalEvents = state.pendingAprovalEvents.filter(
          (e) => String(e._id) !== String(eventId),
        );
        state.rejectedEvents = state.rejectedEvents || [];
        state.rejectedEvents.push({ ...event, isApproved: 'rejected' });
      }
    },
    eventApproved: (state, action) => {
      const eventId = action.payload.id;
      const event = state.pendingAprovalEvents.find(e => String(e._id) === String(eventId));
      if (event) {
        state.pendingAprovalEvents = state.pendingAprovalEvents.filter(
          (event) => String(event._id) !== String(eventId),
        );
        state.eventsData = state.eventsData || [];
        state.eventsData.push({ ...event, isApproved: 'approved' });
      }
    },
  },
});

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const getAllEvents = () => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:3000/api/events", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    dispatch(addEventSuccess(data));
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export const addEvent = (eventData) => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    dispatch(addSingleEvent(data.event));
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const updateEventAsync = (eventData) => async (dispatch) => {
  try {
    const id = eventData._id;
    const response = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(eventSlice.actions.updateEvent(data.event || data));
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteEventAsync = (eventId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(eventSlice.actions.deleteEvent({ id: eventId }));
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const approveEventAsync = (eventId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/api/events/${eventId}/approval`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "approved" }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(eventApproved({ id: eventId }));
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const rejectEventAsync = (eventId, reason) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/api/events/${eventId}/approval`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "rejected", reason }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(eventSlice.actions.eventRejected({ id: eventId, reason }));
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const resetApprovalAsync = (eventId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/api/events/${eventId}/approval`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "pending" }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(eventSlice.actions.updateApprovedStatus({ id: eventId }));
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const {
  addEventSuccess,
  addSingleEvent,
  deleteEvent,
  updateEvent,
  updateStatus,
  eventApproved,
  eventRejected,
  updateApprovedStatus,
} = eventSlice.actions;
export default eventSlice.reducer;
