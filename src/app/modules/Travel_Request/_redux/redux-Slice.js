import { createSlice } from "@reduxjs/toolkit";

const initialTravelRequestState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  employeeEntitlement: null,
  empAuthorityList: [],
  isPolicyExists: false,
  workflowStatusList: [], 
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const travel_requestSlice = createSlice({
  name: "travel_requestSlice",
  initialState: initialTravelRequestState,
  reducers: {
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    travelRequestFetched: (state, action) => {
      const data = action.payload.data?.data || action.payload?.data;
      const entities = data?.rows || data || [];
      const totalResult =
        data?.totalResults || (Array.isArray(entities) ? entities.length : 0);

      state.listLoading = false;
      state.error = null;
      state.entities = Array.isArray(entities) ? entities : [];
      state.totalCount = totalResult;
    },

    travelRequestCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (state.entities) {
        state.entities.unshift(action.payload);
      } else {
        state.entities = [action.payload];
      }
      // Keep count in sync
      state.totalCount = (state.totalCount || 0) + 1;
    },
    employeeEntitlementFetched: (state, action) => {
      state.employeeEntitlement = action.payload.employeeEntitlement;
      state.actionsLoading = false;
    },
    EmployeeAuthorityFetched: (state, action) => {
      state.empAuthorityList = action.payload.data;
      state.isPolicyExists = action.payload.isPolicyExists;
      state.actionsLoading = false;
    },
    workflowStatusFetched: (state, action) => {
  state.actionsLoading = false;
  state.error = null;
  state.workflowStatusList = action.payload;
},
  },
});
