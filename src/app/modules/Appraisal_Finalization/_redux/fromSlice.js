import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  salaryPolicy: null,
  appraisalFinalizedRating: {},
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const appraisalFinalizationSlice = createSlice({
  name: "appraisal_finalization",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    AppraisalFinalizationFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data?.totalResults;
      const salaryPolicy = action.payload.data?.data?.salaryPolicy;
      state.listLoading = false;
      state.entities = entities;
      state.totalCount = totalResult;
      state.salaryPolicy = salaryPolicy;
    },
    AppraisalFinalizationRatingFetched: (state, action) => {
      state.actionsLoading = false;
      state.appraisalFinalizedRating = action?.payload || {};
    },
    SaveAppraisalFinalization: (state, action) => {
      state.actionsLoading = false;
    },
  },
});
