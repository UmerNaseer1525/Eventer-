import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const REPORTS_API_URL = "http://localhost:3000/api/reports";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Thunk to fetch system-wide reports
export const fetchSystemReports = createAsyncThunk(
  "report/fetchSystemReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${REPORTS_API_URL}/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch reports: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch organizer-specific reports
export const fetchOrganizerReports = createAsyncThunk(
  "report/fetchOrganizerReports",
  async (organizerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${REPORTS_API_URL}/organizer/${organizerId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch organizer reports: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch reports by date range
export const fetchReportsByDateRange = createAsyncThunk(
  "report/fetchByDateRange",
  async ({ startDate, endDate, organizerId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (organizerId) params.append("organizerId", organizerId);

      const response = await fetch(
        `${REPORTS_API_URL}/date-range/filter?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch date-range reports: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setReports: (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.success = true;
    },
    clearReports: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSystemReports
    builder
      .addCase(fetchSystemReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchSystemReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Handle fetchOrganizerReports
    builder
      .addCase(fetchOrganizerReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchOrganizerReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Handle fetchReportsByDateRange
    builder
      .addCase(fetchReportsByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchReportsByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setReports, clearReports, clearError } = reportSlice.actions;
export default reportSlice.reducer;
