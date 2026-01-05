import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  entities: [],
};

export const callTypes = {
  list: "list",
};

export const appraisalStatusSlice = createSlice({
  name: "appraisal_status",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    appraisalStatusEmployeeWiseFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload;
    },
  },
});
