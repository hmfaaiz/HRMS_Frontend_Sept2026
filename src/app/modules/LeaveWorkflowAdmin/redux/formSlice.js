import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  leaveBalances: [],
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const LeaveWorkflowAdminSlice = createSlice({
  name: "LeaveWorkflowAdmin",
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
      const entities = action.payload.data?.data || [];
      const totalResult = action.payload.data?.data?.totalResults || 0;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
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
