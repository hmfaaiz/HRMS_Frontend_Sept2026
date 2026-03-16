import { createSlice } from "@reduxjs/toolkit";

const initState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  dataForEdit: undefined,
  lastError: null,
  createdCustomerIds: [],
  customerEpicTicket: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const CustomerConfigurationSlice = createSlice({
  name: "customer_config",
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
    customerConfigsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    customerConfigFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    customerConfigCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
    },
    customerConfigUpdated: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
    },
    customerConfigDeleted: (state, action) => {
      state.actionsLoading = false;
    },
    createdCustomerIds: (state, action) => {
      state.createdCustomerIds = action.payload;
    },
    customerEpicTicket: (state, action) => {
      state.customerEpicTicket = action.payload;
    },
  },
});

export const { actions } = CustomerConfigurationSlice;
