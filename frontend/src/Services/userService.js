const create_URL = "http://localhost:3000/api/users";
const LOGIN_URL = "http://localhost:3000/api/users/login";
const UPDATE_URL_BASE = "http://localhost:3000/api/users";

async function addUser(userData) {
  try {
    const response = await fetch(create_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        return new Error("User already exists with the provided email");
      }
      return new Error(errorData.message || "Unable to Sign Up");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return new Error(error.message);
  }
}

async function validateUser(data) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error_message = await response.json();
      return new Error(error_message.message || "Unable to Sign In");
    }

    const result = await response.json();

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      // Trigger a custom event to notify components about auth change
      window.dispatchEvent(new Event("auth-change"));
    }

    return result;
  } catch (error) {
    return new Error(error.message);
  }
}

// Function to get authorization headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Function to logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Trigger a custom event to notify components about auth change
  window.dispatchEvent(new Event("auth-change"));
}

async function getAllUsersLoader() {
  const response = await fetch(create_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Response("Failed to load users", { status: response.status });
  }

  return response.json();
}

async function updateUser(user_data, email) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const targetEmail = email || storedUser?.email;

    if (!targetEmail) {
      return new Error("User email not found for update");
    }

    const response = await fetch(
      `${UPDATE_URL_BASE}/${encodeURIComponent(targetEmail)}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(user_data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Error(errorData.message || "Unable to update user");
    }

    const result = await response.json().catch(() => ({}));

    if (storedUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...user_data }),
      );
      window.dispatchEvent(new Event("auth-change"));
    }

    return result;
  } catch (Error) {
    return new Error(Error.message);
  }
}

export {
  addUser,
  validateUser,
  getAuthHeaders,
  logout,
  getAllUsersLoader,
  updateUser,
};
