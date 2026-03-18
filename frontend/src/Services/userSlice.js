import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    },

    deleteUser: (state, action) => {
      state = state.filter((user) => user.email !== action.payload);
    },

    updateUser: (state, action) => {
      state = state.map((user) =>
        user.email === action.payload.email ? action.payload : user,
      );
    },
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
