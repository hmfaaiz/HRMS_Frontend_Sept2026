import { createSlice } from "@reduxjs/toolkit";

export const tableSlice = createSlice({
  name: "table",
  initialState: {
    data: [],
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    updateData: (state, action) => {
      const { rowId, fieldName, value } = action.payload;
      const rowIndex = state.data.findIndex((row) => row.id === rowId);
      state.data[rowIndex][fieldName] = value;
    },
  },
});

export const { setData, updateData } = tableSlice.actions;

//export default tableSlice.reducer;
