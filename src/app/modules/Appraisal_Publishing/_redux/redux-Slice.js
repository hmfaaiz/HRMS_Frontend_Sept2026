import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const appraisalPublishSlice = createSlice({
  name: "appraisal_publish",
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

    AppraisalPublishFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },

    AppraisalPublishDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;

    },
    AppraisalPublishUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
  },
});
