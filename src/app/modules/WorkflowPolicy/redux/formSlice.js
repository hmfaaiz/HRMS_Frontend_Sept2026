import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  dataForEdit: null,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const workflowPolicySlice = createSlice({
  name: "workflowPolicy",
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
    ReocrdsFetched: (state, action) => {
      const entities = action.payload.data?.data?.rows;
      const totalResult = action.payload.data?.data?.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    RecordFetchedForEdit: (state, action) => {
      const entities = action?.payload;
      state.actionsLoading = false;
      state.dataForEdit = entities;
      state.error = null;
    },
    RecordDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id != action.payload.id
      );
      state.totalCount--;
    },
    RecordCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.totalCount++;
    },
    MultipleRecordCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.totalCount += action.payload.length;
    },
    RecordUpdated: (state, action) => {
      const id = action.payload.Id;
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((el) => {
        if (el.Id == id) {
          return action.payload;
        }
        return el;
      });
    },
  },
});
