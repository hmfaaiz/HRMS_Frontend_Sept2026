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

export const projectTimeLogSetupSlice = createSlice({
  name: "project_timelog",
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
    timeLogsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    timeLogFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    timeLogCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.unshift(action.payload);
      state.totalCount += 1;
      state.lastError = null;
    },
    timeLogUpdated: (state, action) => {
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) =>
        entity.Id === action.payload.Id ? action.payload : entity,
      );
      state.dataForEdit = null;
    },
    timeLogDeleted: (state, action) => {
      state.actionsLoading = false;
    },
  },
});

export const { actions } = projectTimeLogSetupSlice;
