import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const DashboardAlertConfigSlice = createSlice({
  name: "dashboard_alert_config",
  initialState: initialState,
  reducers: {
    catchError: (state) => {
      state.loading = false;
    },
    startCall: (state) => {
      state.loading = true;
    },
    dashboardAlertConfigFetched: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
  },
});
