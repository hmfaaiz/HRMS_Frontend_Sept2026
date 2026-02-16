import { createSlice } from "@reduxjs/toolkit";

const initState = {
  actionsLoading: false,
  data: {},
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const TaskDashboardSlice = createSlice({
  name: "task_dashboard",
  initialState: initState,
  reducers: {
    startCall: (state, action) => {
      state.actionsLoading = true;
    },
    catchError: (state, action) => {
      state.actionsLoading = false;
    },
    taskDashboardDataFetched: (state, action) => {
      state.actionsLoading = false;
      state.data = action.payload;
    },
    clearState: (state, action) => {
      state.actionsLoading = false;
      state.data = {};
    },
  },
});
