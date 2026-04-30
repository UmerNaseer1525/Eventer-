import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notificationService";

export const fetchNotificationsThunk = createAsyncThunk(
  "notification/fetchNotifications",
  async ({ currentRole, recipientId } = {}, { rejectWithValue }) => {
    try {
      return await fetchNotifications(
        currentRole === "admin"
          ? {}
          : recipientId
            ? { recipientId }
            : {},
      );
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notifications.");
    }
  },
);

export const markNotificationReadThunk = createAsyncThunk(
  "notification/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update notification.");
    }
  },
);

export const deleteNotificationThunk = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to delete notification.");
    }
  },
);

export const markAllNotificationsReadThunk = createAsyncThunk(
  "notification/markAllNotificationsRead",
  async ({ currentRole, recipientId, notifications = [] } = {}, { rejectWithValue }) => {
    try {
      if (currentRole !== "admin" && recipientId) {
        await markAllNotificationsAsRead(recipientId);
        return notifications.map((notification) => notification.id);
      }

      const unreadNotifications = notifications.filter((notification) => !notification.read);
      await Promise.all(unreadNotifications.map((notification) => markNotificationAsRead(notification.id)));
      return unreadNotifications.map((notification) => notification.id);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update notifications.");
    }
  },
);

export const clearAllNotificationsThunk = createAsyncThunk(
  "notification/clearAllNotifications",
  async (notifications = [], { rejectWithValue }) => {
    try {
      await Promise.all(notifications.map((notification) => deleteNotification(notification.id)));
      return notifications.map((notification) => notification.id);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to clear notifications.");
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationsState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Unable to load notifications.";
      })
      .addCase(markNotificationReadThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Unable to update notification.";
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        state.items = state.items.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        );
      })
      .addCase(deleteNotificationThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Unable to delete notification.";
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((notification) => notification.id !== action.payload);
      })
      .addCase(markAllNotificationsReadThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Unable to update notifications.";
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state, action) => {
        const markedIds = new Set(action.payload);
        state.items = state.items.map((notification) =>
          markedIds.has(notification.id) ? { ...notification, read: true } : notification,
        );
      })
      .addCase(clearAllNotificationsThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || "Unable to clear notifications.";
      })
      .addCase(clearAllNotificationsThunk.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { clearNotificationsState } = notificationSlice.actions;
export default notificationSlice.reducer;
