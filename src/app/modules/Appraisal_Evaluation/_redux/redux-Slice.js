import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  ratingSelection: false,
  ratingDetail: [],
  employeeDetail: null,
  appraisalEmpDetail: {},
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const appraisalEvaluationSlice = createSlice({
  name: "appraisal_evaluation",
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
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    AppraisalEvaluationsFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    AppraisalEvaluationByIdFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.userForEdit = action.payload?.question;
      state.ratingSelection = action.payload?.ratingSelection;
      state.ratingDetail = action.payload?.ratingDetail;
      state.employeeDetail = action.payload?.employeeDetail;
    },
    AppraisalEvaluationUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;

      // Update the specific question in userForEdit array
      if (state.userForEdit && action.payload) {
        const updatedQuestion = action.payload;
        const updatedUser = state.userForEdit.map((question) =>
          question.Id === updatedQuestion.Id
            ? { ...question, ...updatedQuestion }
            : question
        );
        state.userForEdit = updatedUser;
      }
    },
    AppraisalEmployeeDetailFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.appraisalEmpDetail = action.payload;
    },
  },
});
