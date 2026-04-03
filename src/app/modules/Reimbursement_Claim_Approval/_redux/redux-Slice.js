import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ReimbursementApprovalSlice = createSlice({
  name: "reimbursement_approval",
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
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    ReimbursementApprovalFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload.data?.data?.rows || [];
      state.totalCount = action.payload.data?.data?.totalResults || 0;
    },
    ReimbursementWorkflowStatusFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = action.payload;
    },
  },
});