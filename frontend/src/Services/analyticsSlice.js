import { createSlice } from "@reduxjs/toolkit";

const ANALYTICS_BASE_URL = "http://localhost:3000/api/analytics";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAnalytics: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const fetchAnalytics = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${ANALYTICS_BASE_URL}/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to fetch analytics");
    }

    const data = await response.json();
    dispatch(setAnalytics(data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to load analytics"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchOrganizerAnalytics = (organizerId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(
      `${ANALYTICS_BASE_URL}/organizer/${encodeURIComponent(organizerId)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to fetch analytics");
    }

    const data = await response.json();
    dispatch(setAnalytics(data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to load analytics"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setAnalytics, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
