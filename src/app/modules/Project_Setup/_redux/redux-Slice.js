import { createSlice } from "@reduxjs/toolkit";

const initialProjectState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  dataForEdit: undefined,
  lastError: null,
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
};

export const callTypes = {
  list: "list",
  action: "action",
  pdf: "pdf",
  csv: "csv",
  xlsx: "xlsx",
};

export const projectSetupSlice = createSlice({
  name: "project_setup",
  initialState: initialProjectState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = true;
      } else if (action.payload.callType === callTypes.csv) {
        state.csvLoading = true;
      } else if (action.payload.callType === callTypes.xlsx) {
        state.excelLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = false;
      } else if (action.payload.callType === callTypes.csv) {
        state.csvLoading = false;
      } else if (action.payload.callType === callTypes.xlsx) {
        state.excelLoading = false;
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
    pdfFetched: (state, action) => {
      state.pdfLoading = false;
    },
    csvFetched: (state, action) => {
      state.csvLoading = false;
    },
    excelFetched: (state, action) => {
      state.excelLoading = false;
    },
  },
});

export const { actions } = projectSetupSlice;
