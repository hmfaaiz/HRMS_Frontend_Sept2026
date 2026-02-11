import { createSlice } from "@reduxjs/toolkit";

const initState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  dataForEdit: undefined,
  lastError: null,
  logDetail: {},
  // ADD THESE THREE LINES:
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
};

export const callTypes = {
  list: "list",
  action: "action",
  // ADD THESE THREE LINES:
  pdf: "pdf",
  csv: "csv",
  xlsx: "xlsx",
};

export const ticketSetupSlice = createSlice({
  name: "ticket_setup",
  initialState: initState,
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
    ticketsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    ticketFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    ticketCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
    },
    ticketUpdated: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
    },
    ticketDeleted: (state, action) => {
      state.actionsLoading = false;
    },
    ticketTimeLogsFetched: (state, action) => {
      state.actionsLoading = false;
      state.logDetail = action.payload;
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

export const { actions } = ticketSetupSlice;
