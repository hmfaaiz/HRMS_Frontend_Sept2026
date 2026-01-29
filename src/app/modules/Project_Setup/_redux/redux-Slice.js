import { createSlice } from "@reduxjs/toolkit";

const initialCustomerState = {
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

export const projectSetupSlice = createSlice({
  name: "project_setup",
  initialState: initialCustomerState,
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
    projectsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    projectFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    projectCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
    },
    projectUpdated: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
    },
    projectDeleted: (state, action) => {
      state.actionsLoading = false;
    },
  },
});

export const { actions } = projectSetupSlice;
