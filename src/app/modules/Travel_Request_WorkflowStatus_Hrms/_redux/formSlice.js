import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  travelRequestBalances: [],
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const TravelRequestWorkflowAdminSlice = createSlice({
  name: "TravelRequestWorkflowAdmin",
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
    TravelApprovalApplicationFetched: (state, action) => {
      const { entities, totalCount } = action.payload || {};
      state.listLoading = false;
      state.error = null;
      state.entities = entities || [];
      state.totalCount = totalCount || 0;
    },
    TravelBalancesFetched: (state, action) => {
      const travelBalances = action.payload.data?.data;
      state.actionsLoading = false;
      state.error = null;
      state.travelRequestBalances = travelBalances;
    },
    TravelWorkflowStatusFetched: (state, action) => {
      const data = action.payload.data?.data;
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = data;
    },
  },
});
