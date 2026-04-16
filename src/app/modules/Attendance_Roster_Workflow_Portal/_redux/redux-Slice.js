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

export const RosterWorkflowStatusSlice = createSlice({
  name: "attendance_roster_workflow_status_portal",
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
    RosterApprovalApplicationFetched: (state, action) => {
      const data = action.payload?.data?.data;
      const entities = Array.isArray(data) ? data : data?.rows || [];
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = entities.length;
    },
    RosterWorkflowStatusFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = action.payload;
    },
  },
});