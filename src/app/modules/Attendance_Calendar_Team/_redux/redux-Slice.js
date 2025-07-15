import { createSlice } from "@reduxjs/toolkit";

const initialAttendanceCalendarState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  attendanceCalendar: null,
  lastError: null,
  dateRange: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const TeamAttendanceCalendarSlice = createSlice({
  name: "attendance_calendar_team",
  initialState: initialAttendanceCalendarState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    attendanceFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.attendanceCalendar = action.payload.data?.data?.result;
      state.dateRange = action.payload.data?.data?.dateRange;
      state.totalCount = action.payload.data?.data?.count;
    },

    clearEvents: (state, action) => {
      state.listLoading = false;
      state.actionsLoading = null;
      state.lastError = null;
      state.totalCount = 0;
      state.attendanceCalendar = null;
      state.dateRange = null;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
  },
});
