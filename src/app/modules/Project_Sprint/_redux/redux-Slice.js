import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  previousTicket: [],
  allTicket: [],
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

export const projectSprintSlice = createSlice({
  name: "project_sprint",
  initialState: initialState,
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
    projectSprintsFetched: (state, action) => {
      state.listLoading = false;
      state.entities = action.payload?.rows || [];
      state.totalCount = action.payload?.totalResults || 0;
      state.lastError = null;
    },
    projectSprintFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.lastError = null;
    },
    projectSprintCreated: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      if (action.payload) {
        state.commentsList = [action.payload, ...state.entities];
        state.totalCount += 1;
      }
    },
    projectSprintUpdated: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
      if (action.payload) {
        state.entities = state.entities.map((el) =>
          el.Id === action.payload.Id ? action.payload : el,
        );
      }
    },
    projectSprintDeleted: (state, action) => {
      state.actionsLoading = false;
      state.lastError = null;
      if (action.payload) {
        state.entities = state.entities.filter(
          (el) => el.Id !== action.payload.Id,
        );
      }
    },
    pdfFetched: (state, action) => {
      state.pdfLoading = false;
    },
    csvFetched: (state, action) => {
      state.csvLoading = false;
    },
    linkedTicketFetched: (state, action) => {
      state.actionsLoading = false;
      state.allTicket = action.payload?.allTicket || [];
      state.previousTicket = action.payload?.previousTicket || [];
    },
    excelFetched: (state, action) => {
      state.excelLoading = false;
    },
    projectSprintExcuted: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = null;
      if (action.payload) {
        state.entities = state.entities.map((el) =>
          el.Id === action.payload.Id ? action.payload : el,
        );
      }
    },
  },
});

export const { actions } = projectSprintSlice;
