import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  rosterCalendar: null,
  lastError: null,
  dateRange: null,
  payrollData: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const PortalRosterCalendarSlice = createSlice({
  name: "roster_calendar_team",
  initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    rosterFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.rosterCalendar = action.payload.data?.data?.rows;
      state.dateRange = action.payload.data?.data?.dateRange;
      state.totalCount = action.payload.data?.data?.count;
    },

    clearEvents: (state, action) => {
      state.listLoading = false;
      state.actionsLoading = null;
      state.lastError = null;
      state.totalCount = 0;
      state.rosterCalendar = null;
      state.dateRange = null;
    },

    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
  },
});