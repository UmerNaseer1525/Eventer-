const create_URL = "http://localhost:3000/api/users";
const LOGIN_URL = "http://localhost:3000/api/users/login";

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

export { addUser, validateUser, getAuthHeaders, logout };
