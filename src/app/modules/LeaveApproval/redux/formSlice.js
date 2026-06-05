import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  payrollData: null,
  leaveBalances: [],
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const LeaveApprovalSlice = createSlice({
  name: "LeaveApproval",
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
  const payload = action.payload.data?.data;
  const entities = Array.isArray(payload) ? payload : (payload?.rows || []);
  const totalResult = Array.isArray(payload) ? payload.length : (payload?.totalResults || 0);
  state.listLoading = false;
  state.error = null;
  state.entities = entities;
  state.totalCount = totalResult;
},
    // EmployeeLeaveHierarchyFetched: (state, action) => {
    //   const { levelList, employeeList } = action?.payload;
    //   state.error = null;
    //   state.levelList = levelList;
    //   state.employeeList = employeeList;
    // },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    LeaveBalancesFetched: (state, action) => {
      const leaveBalances = action.payload.data?.data;
      state.actionsLoading = false;
      state.error = null;
      state.leaveBalances = leaveBalances;
    },
    LeaveWorkflowStatusFetched: (state, action) => {
      const data = action.payload.data?.data;
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = data;
    },
  },
});
