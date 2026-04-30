const REPORTS_API_URL = "http://localhost:3000/api/reports";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Get headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Fetch all system reports
export const fetchSystemReports = async () => {
  try {
    const response = await fetch(`${REPORTS_API_URL}/`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch system reports");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching system reports:", error);
    throw error;
  }
};

// Fetch organizer-specific reports
export const fetchOrganizerReports = async (organizerId) => {
  try {
    if (!organizerId) {
      throw new Error("Organizer ID is required");
    }

    const response = await fetch(
      `${REPORTS_API_URL}/organizer/${organizerId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch organizer reports");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching organizer reports:", error);
    throw error;
  }
};

// Fetch reports by date range
export const fetchReportsByDateRange = async (startDate, endDate, organizerId = null) => {
  try {
    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }

    let url = `${REPORTS_API_URL}/date-range/filter?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;

    if (organizerId) {
      url += `&organizerId=${organizerId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reports by date range");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reports by date range:", error);
    throw error;
  }
};

// Download system report (PDF format)
export const downloadSystemReportPDF = async () => {
  try {
    console.log("[PDF Download] Starting download...");
    const token = getAuthToken();
    console.log("[PDF Download] Token found:", !!token);
    console.log("[PDF Download] URL:", `${REPORTS_API_URL}/download/system?format=pdf`);
    
    const response = await fetch(
      `${REPORTS_API_URL}/download/system?format=pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("[PDF Download] Response received:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PDF Download] Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    console.log("[PDF Download] Blob received:", blob.size, "bytes, type:", blob.type);
    downloadFile(blob, `report-${new Date().getTime()}.pdf`);
    console.log("[PDF Download] Download initiated");
  } catch (error) {
    console.error("[PDF Download] Error:", error);
    throw error;
  }
};

// Download system report (TXT format)
export const downloadSystemReportTXT = async () => {
  try {
    console.log("[TXT Download] Starting download...");
    const token = getAuthToken();
    console.log("[TXT Download] Token found:", !!token);
    console.log("[TXT Download] URL:", `${REPORTS_API_URL}/download/system?format=txt`);
    
    const response = await fetch(
      `${REPORTS_API_URL}/download/system?format=txt`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("[TXT Download] Response received:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TXT Download] Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    console.log("[TXT Download] Blob received:", blob.size, "bytes, type:", blob.type);
    downloadFile(blob, `report-${new Date().getTime()}.txt`);
    console.log("[TXT Download] Download initiated");
  } catch (error) {
    console.error("[TXT Download] Error:", error);
    throw error;
  }
};

// Download organizer report (PDF format)
export const downloadOrganizerReportPDF = async (organizerId) => {
  try {
    if (!organizerId) {
      throw new Error("Organizer ID is required");
    }
    const token = getAuthToken();
    const response = await fetch(
      `${REPORTS_API_URL}/download/organizer?organizerId=${organizerId}&format=pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    downloadFile(blob, `organizer-report-${organizerId}-${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error("Error downloading organizer PDF report:", error);
    throw error;
  }
};

// Download organizer report (TXT format)
export const downloadOrganizerReportTXT = async (organizerId) => {
  try {
    if (!organizerId) {
      throw new Error("Organizer ID is required");
    }
    const token = getAuthToken();
    const response = await fetch(
      `${REPORTS_API_URL}/download/organizer?organizerId=${organizerId}&format=txt`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    downloadFile(blob, `organizer-report-${organizerId}-${new Date().getTime()}.txt`);
  } catch (error) {
    console.error("Error downloading organizer TXT report:", error);
    throw error;
  }
};

// Helper function to download file
const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export default {
  fetchSystemReports,
  fetchOrganizerReports,
  fetchReportsByDateRange,
  downloadSystemReportPDF,
  downloadSystemReportTXT,
  downloadOrganizerReportPDF,
  downloadOrganizerReportTXT,
};
