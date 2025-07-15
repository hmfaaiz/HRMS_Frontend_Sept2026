import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  payrollData: null,
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const AttendanceWorkflowStatusSlice = createSlice({
  name: "attendance_workflow_status",
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
    LeaveApprovalApplicationFetched: (state, action) => {
      const entities = action.payload.data?.data?.rows || [];
      const totalResult = action.payload.data?.data?.totalResults || 0;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    LeaveWorkflowStatusFetched: (state, action) => {
      const data = action.payload;
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = data;
    },
  },
});
