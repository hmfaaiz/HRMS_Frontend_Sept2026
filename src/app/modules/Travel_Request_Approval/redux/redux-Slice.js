import { createSlice } from "@reduxjs/toolkit";

const initialTravelApprovalState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: null,
  workflowStatusList: [],
  workflowRecord: null,
  employeeEntitlement: null,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const travelrequestApprovalSlice = createSlice({
  name: "Travel_Request_Approval",
  initialState: initialTravelApprovalState,
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
    // travel approval requests fetch
    travelApprovalRequestsFetched: (state, action) => {
      const data = action.payload.data?.data || action.payload?.data;
      const entities = data?.rows || data || [];
      const totalResult =
        data?.totalResults || (Array.isArray(entities) ? entities.length : 0);

      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    // travel request fetch by ID
    travelRequestFetched: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },
    // handle travel request
    travelRequestHandled: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { Ids } = action.payload;
      if (state.entities) {
        state.entities = state.entities.filter(
          (entity) => !Ids.includes(entity.Id || entity.id),
        );
      }
    },
    // workflow status
    travelWorkflowStatusFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = action.payload;
    },
    // travel workflow record detail fetch
    travelWorkflowRecordFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.workflowRecord = action.payload;
    },
    // employee entitlement
    employeeEntitlementFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.employeeEntitlement = action.payload.employeeEntitlement;
    },
  },
});
