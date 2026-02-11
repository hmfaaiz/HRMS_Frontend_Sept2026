import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  totalCount: 0,
  entities: [],
  lastError: null,
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
};

export const callTypes = {
  list: "list",
  update: "update",
  pdf: "pdf",
  csv: "csv",
  xlsx: "xlsx",
};

export const projectTimelineSlice = createSlice({
  name: "project_timeline",
  initialState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.update) {
        state.listLoading = true;
      }
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      if (
        action.payload.callType === callTypes.list ||
        action.payload.callType === callTypes.update
      ) {
        state.listLoading = false;
      }
    },
    timelineFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    timelineCleared: (state) => {
      state.entities = [];
      state.totalCount = 0;
      state.listLoading = false;
      state.lastError = null;
    },
    ticketStatusesUpdated: (state) => {
      state.listLoading = false;
      state.lastError = null;
    },
    pdfFetched: (state) => {
      state.pdfLoading = false;
    },
    csvFetched: (state) => {
      state.csvLoading = false;
    },
    excelFetched: (state) => {
      state.excelLoading = false;
    },
  },
});

export const { actions } = projectTimelineSlice;
