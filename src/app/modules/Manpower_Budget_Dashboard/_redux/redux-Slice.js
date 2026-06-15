import { createSlice } from "@reduxjs/toolkit";

const initState = {
  actionsLoading: false,
  data: null,
};

export const callTypes = {
  action: "action",
};

export const manpowerBudgetDashboardSlice = createSlice({
  name: "manpower_budget_dashboard",
  initialState: initState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      state.actionsLoading = true;
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      state.actionsLoading = false;
    },
    dashboardDataFetched: (state, action) => {
      state.actionsLoading = false;
      state.data = action.payload;
    },
  },
});

export const { actions } = manpowerBudgetDashboardSlice;
