import { createSlice } from "@reduxjs/toolkit";
import { formatToDDMMYYYY } from "../../../utils/common";
import { format } from "date-fns";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  roles: null,
  centers: null,
  userStatusTypes: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  processLoading: false,
  payrollData: null,
  consolidatedLoading: false,
  empAuthorityList: [],
  attendanceSummary: null,
};

export const callTypes = {
  list: "list",
  action: "action",
  process: "process",
  pdf: "pdf",
  consolidated: "consolidated",
};

export const AttendanceRequestSlice = createSlice({
  name: "attendance_request",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    stopCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    AttendanceFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    AttendanceFetchedForEdit: (state, action) => {
      const entities = action?.payload?.userForEdit;
      state.actionsLoading = false;
      if (entities) {
        // Commented out due to date shifting to the next day because of timezone conversion issue
        entities.attDateIn = new Date(entities.attDateIn);
        entities.attDateOut = new Date(entities.attDateOut);
      }
      state.userForEdit = entities;
      state.error = null;
    },
    AttendanceCreated: (state, action) => {
      const entities = action?.payload;
      state.actionsLoading = false;
      state.error = null;
      if (entities) {
        entities.attDateIn = new Date(entities.attDateIn);
        entities.attDateOut = new Date(entities.attDateOut);
      }
      state.userForEdit = entities;
    },
    fetchAttendanceSummary: (state, action) => {
      const data = action.payload;
      state.error = null;
      state.attendanceSummary = data;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    EmployeeAuthorityFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.empAuthorityList = action.payload;
    },
  },
});
