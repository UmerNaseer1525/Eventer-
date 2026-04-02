import { createSlice } from "@reduxjs/toolkit";

const USER_BASE_URL = "http://localhost:3000/api/users/";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    getUsers: (state) => {
      return state.users;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.email !== action.payload);
    },

    updateUser: (state, action) => {
      state.users = state.users.map((user) =>
        user.email === action.payload.email
          ? { ...user, ...action.payload }
          : user,
      );
    },

    updateStatus: (state, action) => {
      state.users = state.users.map((user) =>
        user.email === action.payload.email
          ? { ...user, status: action.payload.status }
          : user,
      );
    },
  },
});

export const createNewUser = (userRecord) => async (dispatch) => {
  try {
    const response = await fetch(USER_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userRecord),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        return new Error("User already exists with the provided email");
      }
      return new Error(errorData.message || "Unable to Sign Up");
    }

    const data = await response.json();
    dispatch(addUser(data));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(USER_BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unable to update user");
      }

      const data = await response.json();
      dispatch(setUsers(data));
      // return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
};

export const deleteUserRecord = (userEmail) => {
  return async (dispatch) => {
    const res = await fetch(`${USER_BASE_URL}${userEmail}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      dispatch(deleteUser(userEmail));
    }
  };
};

export const updateUserRecord = (userData, email) => async (dispatch) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const targetEmail = email || userData.email || storedUser?.email;

  if (!targetEmail) {
    throw new Error("User email not found for update");
  }

  const response = await fetch(`${USER_BASE_URL}${targetEmail}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unable to update user");
  }

  if (storedUser && storedUser.email === targetEmail) {
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, ...userData }),
    );
    window.dispatchEvent(new Event("auth-change"));
  }

  dispatch(userSlice.actions.updateUser({ ...userData, email: targetEmail }));
};

export const updateUserStatus = (email, newStatus) => async (dispatch) => {
  try {
    const response = await fetch(
      `${USER_BASE_URL}${email}/status?status=${newStatus}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Unable to update status of the user: ${email}`,
      );
    }
    dispatch(updateStatus({ email: email, status: newStatus }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const {
  setUsers,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  updateStatus,
} = userSlice.actions;
export default userSlice.reducer;
