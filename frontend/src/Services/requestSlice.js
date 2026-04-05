import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      const requestType = action.payload?.type || "eventApproval";
      const eventId = action.payload?.eventId;

      if (requestType === "eventApproval" && eventId !== undefined) {
        const hasPending = state.some(
          (request) =>
            request.type === "eventApproval" &&
            String(request.eventId) === String(eventId) &&
            String(request.status || "pending").toLowerCase() === "pending",
        );

        if (hasPending) return;
      }

      state.push({
        id: action.payload.id || `REQ-${Date.now()}`,
        type: requestType,
        status: action.payload.status || "pending",
        createdAt: action.payload.createdAt || new Date().toISOString(),
        ...action.payload,
      });
    },

    addUnblockRequest: (state, action) => {
      const email = action.payload?.email;
      if (!email) return;

      const hasPending = state.some(
        (request) =>
          request.type === "unblock" &&
          request.email === email &&
          request.status === "pending",
      );

      if (hasPending) return;

      state.push({
        id: `UNBLOCK-${Date.now()}`,
        type: "unblock",
        status: "pending",
        createdAt: new Date().toISOString(),
        ...action.payload,
      });
    },

    resolveUnblockRequest: (state, action) => {
      const { id, resolutionStatus, reviewedBy } = action.payload;
      const request = state.find((item) => item.id === id);
      if (!request) return;

      request.status = resolutionStatus;
      request.reviewedBy = reviewedBy || "admin";
      request.reviewedAt = new Date().toISOString();
    },

    removeRequest: (state, action) => {
      return state.filter(
        (req) => String(req.eventId) !== String(action.payload),
      );
    },

    removeRequestById: (state, action) => {
      return state.filter((req) => req.id !== action.payload);
    },
  },
});

export const {
  addRequest,
  addUnblockRequest,
  resolveUnblockRequest,
  removeRequest,
  removeRequestById,
} = requestSlice.actions;
export default requestSlice.reducer;
