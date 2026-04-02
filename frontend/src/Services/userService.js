const LOGIN_URL = "http://localhost:3000/api/users/login";
const BASE_URL = "http://localhost:3000/api/users";

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
      console.log("Response not ok");
      const error_message = await response.json();
      return new Error(error_message.message || "Unable to Sign In");
    }

    const result = await response.json();

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      // Trigger a custom event to notify components about auth change
      window.dispatchEvent(new Event("auth-change"));
    }

    return result;
  } catch (error) {
    console.log("Field Login");
    return new Error(error.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Trigger a custom event to notify components about auth change
  window.dispatchEvent(new Event("auth-change"));
}

export { validateUser, logout };
