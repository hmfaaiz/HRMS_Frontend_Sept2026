import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  totalCount: 0,
  entities: [],
  lastError: null,
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
  timeLogForEdit: undefined,
   timeLogsTotalCount: 0,
    timelogsEntities: null,
};

export const callTypes = {
  list: "list",
  pdf: "pdf",
  csv: "csv",
  xlsx: "xlsx",
};

export const taskAssignmentTimelineSlice = createSlice({
  name: "task_assignment_timeline",
  initialState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) state.listLoading = true;
      else if (action.payload.callType === callTypes.pdf) state.pdfLoading = true;
      else if (action.payload.callType === callTypes.csv) state.csvLoading = true;
      else if (action.payload.callType === callTypes.xlsx) state.excelLoading = true;
    },
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      if (action.payload.callType === callTypes.list) state.listLoading = false;
      else if (action.payload.callType === callTypes.pdf) state.pdfLoading = false;
      else if (action.payload.callType === callTypes.csv) state.csvLoading = false;
      else if (action.payload.callType === callTypes.xlsx) state.excelLoading = false;
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
      state.pdfLoading = false;
      state.csvLoading = false;
      state.excelLoading = false;
      state.lastError = null;
    },

      TimeLogFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.timeLogForEdit = action.payload.timeLogForEdit;
            state.error = null;
        },


          FacilitatorTimeLogDetailFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;

            // Backend se data aa raha hai (single object OR array)
            const data = action.payload;


            state.listLoading = false;
            state.error = null;
            state.timelogsEntities = data.rows || [];
            state.timeLogsTotalCount = data.totalResults || 0; // total number of details
        },
    pdfFetched: (state) => { state.pdfLoading = false; },
    csvFetched: (state) => { state.csvLoading = false; },
    excelFetched: (state) => { state.excelLoading = false; },
  },
});

export const { actions } = taskAssignmentTimelineSlice;
