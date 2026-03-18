import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: [],
  reducers: {
    addCategory: (state, action) => {
      state.push(action.payload);
    },
    updateCategory: (state, action) => {
      return state.map((cat) =>
        cat.id === action.payload.id ? action.payload : cat,
      );
    },
    deleteCategory: (state, action) => {
      return state.filter((cat) => cat.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
