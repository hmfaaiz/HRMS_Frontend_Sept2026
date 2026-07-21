import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  employee: [],
  errorState: null,
  finalizationPdfLoading: false,
  sumReportLoading: false,
  sumExcelReportLoading: false,
};

export const callTypes = {
  list: "list",
  action: "action",
  finalizationPdf: "finalizationPdf",
  sumReport: "sumReport",
  sumExcelReport: "sumExcelReport",
};

export const appraisalReviewSlice = createSlice({
  name: "appraisal_review",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.finalizationPdf) {
        state.finalizationPdfLoading = false;
      } else if (action.payload.callType === callTypes.sumReport) {
        state.sumReportLoading = false;
      } else if (action.payload.callType === callTypes.sumExcelReport) {
        state.sumExcelReportLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.finalizationPdf) {
        state.finalizationPdfLoading = true;
      } else if (action.payload.callType === callTypes.sumReport) {
        state.sumReportLoading = true;
      } else if (action.payload.callType === callTypes.sumExcelReport) {
        state.sumExcelReportLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    appraisalEmployeeFetched: (state, action) => {
      state.actionsLoading = false;
      state.employee = action.payload;
    },
    sumReportFetched: (state, action) => {
      state.sumReportLoading = false;
    },
    sumExcelReportFetched: (state, action) => {
      state.sumExcelReportLoading = false;
    },
    pdfFetched: (state, action) => {
      state.actionsLoading = false;
    },
    AppraisalReviewFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    AppraisalReviewFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload;
    },
    AppraisalReviewCreated: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = null;
    },
    AppraisalReviewDeleted: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = null;
    },
    AppraisalReviewBulkUpdated: (state, action) => {
      state.errorState = action.payload;
      state.actionsLoading = false;
    },
    clearErrorState: (state, action) => {
      state.errorState = null;
    },
    finalizationPdfFetched: (state) => {
      state.finalizationPdfLoading = false;
    },
  },
});
