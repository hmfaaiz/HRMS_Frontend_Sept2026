import { createSlice } from "@reduxjs/toolkit";

const initState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  dataForEdit: undefined,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const CustomerUserManagementSlice = createSlice({
  name: "customer_user_management",
  initialState: initState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    customerUserMgtsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    customerUserMgtFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    customerUserMgtCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
    },
    customerUserMgtUpdated: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
    },
    customerUserMgtDeleted: (state, action) => {
      state.actionsLoading = false;
    },
  },
});

export const { actions } = CustomerUserManagementSlice;
