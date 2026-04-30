import { createSlice } from "@reduxjs/toolkit";

const DASHBOARD_BASE_URL = "http://localhost:3000/api/dashboard";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    user: null,
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserDashboard: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setAdminDashboard: (state, action) => {
      state.admin = action.payload;
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

export const fetchUserDashboard = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(
      `${DASHBOARD_BASE_URL}/user/${encodeURIComponent(userId)}`,
      {
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to fetch user dashboard");
    }

    const data = await response.json();
    dispatch(setUserDashboard(data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to load dashboard"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchAdminDashboard = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${DASHBOARD_BASE_URL}/admin`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Unable to fetch admin dashboard");
    }

    const data = await response.json();
    dispatch(setAdminDashboard(data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to load dashboard"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setUserDashboard, setAdminDashboard, setLoading, setError } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
