import { normalizeRole } from "../utils/auth";

const LOGIN_URL = "http://localhost:3000/api/users/login";
const USERS_URL = "http://localhost:3000/api/users";

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

      let mergedUser = {
        ...result.user,
        role: normalizeRole(result?.user?.role),
      };

      if (mergedUser?.email) {
        const profileResponse = await fetch(
          `${USERS_URL}/${encodeURIComponent(mergedUser.email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
          },
        );

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          mergedUser = {
            ...mergedUser,
            status: profile?.status || mergedUser?.status || "active",
            role: normalizeRole(profile?.role || mergedUser?.role),
          };
        }
      }

      localStorage.setItem("user", JSON.stringify(mergedUser));
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
  window.dispatchEvent(new Event("auth-change"));
}

export { validateUser, logout };
