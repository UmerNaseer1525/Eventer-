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
      const id = String(action.payload.id);
      state.eventsData = (state.eventsData || []).filter((ev) => String(ev._id) !== id);
      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).filter((ev) => String(ev._id) !== id);
      state.rejectedEvents = (state.rejectedEvents || []).filter((ev) => String(ev._id) !== id);
    },

    updateEvent: (state, action) => {
      const payload = action.payload || {};
      const id = payload._id;
      const syncEvent = (event) => {
        if (String(event._id) !== String(id)) return event;
        return { ...event, ...payload };
      };

      state.eventsData = (state.eventsData || []).map(syncEvent);
      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).map(syncEvent);
      state.rejectedEvents = (state.rejectedEvents || []).map(syncEvent);
    },

    updateStatus: (state, action) => {
      const validStatuses = ['completed', 'ongoing', 'cancelled', 'upcoming'];
      const newStatus = String(action.payload.status || '').toLowerCase();
      
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
      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).map((event) => {
        if (String(event._id) === String(action.payload.id)) {
          return {
            ...event,
            status: newStatus,
          };
        }
        return event;
      });
      state.rejectedEvents = (state.rejectedEvents || []).map((event) => {
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
      const eventId = String(action.payload.id);
      let movedEvent = null;

      state.rejectedEvents = (state.rejectedEvents || []).filter((event) => {
        if (String(event._id) === eventId) {
          movedEvent = { ...event, isApproved: 'pending' };
          return false;
        }
        return true;
      });

      state.pendingAprovalEvents = (state.pendingAprovalEvents || []).map((event) => {
        if (String(event._id) === eventId) {
          return {
            ...event,
            isApproved: 'pending',
          };
        }
        return event;
      });

      if (movedEvent) {
        const existsInPending = (state.pendingAprovalEvents || []).some(
          (event) => String(event._id) === eventId,
        );

        if (!existsInPending) {
          state.pendingAprovalEvents = state.pendingAprovalEvents || [];
          state.pendingAprovalEvents.push(movedEvent);
        }
      }
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

export const updateEventStatusAsync = (eventDetail) => async (dispatch) => {
  try {
    const serverStatus =
      eventDetail.status === "upcoming"
        ? "Upcoming"
        : eventDetail.status === "ongoing"
          ? "Ongoing"
          : eventDetail.status === "completed"
            ? "Completed"
            : eventDetail.status === "cancelled"
              ? "Cancelled"
              : "";

    if (!eventDetail?.id || !serverStatus) {
      throw new Error("Valid event id and status are required");
    }

    const response = await fetch(
      `http://localhost:3000/api/events/${eventDetail.id}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: serverStatus }),
      },
    );

    const data = await response.json();
    if(!response.ok) {
      throw new Error(data.message)
    }

    dispatch(updateStatus({ id: eventDetail.id, status: eventDetail.status }))
    dispatch(getAllEvents())
    return data;
  } catch(error) {
    throw error
  }
}

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

    dispatch(updateEvent(data.event || data));
    dispatch(getAllEvents())
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteEventAsync = (eventId) => async (dispatch) => {
  try {
    const id = eventId?.id || eventId;
    const response = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(deleteEvent({ id }));
    dispatch(getAllEvents())
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
    dispatch(getAllEvents())
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

    dispatch(eventRejected({ id: eventId, reason }));
    dispatch(getAllEvents())
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
    dispatch(getAllEvents())
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
