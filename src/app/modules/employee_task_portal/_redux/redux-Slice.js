import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  exitClearanceEntities: null,
  exitClearanceTotalCount: 0,
  taskForModal: null,
  error: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const EmployeeTaskSlice = createSlice({
  name: "employee_task_portal",
  initialState,
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

    // Paginated list fetched
    TaskListFetched: (state, action) => {
      state.error = null;
      state.listLoading = false;
      state.entities = action.payload?.rows;
      state.totalCount = action.payload?.totalResults;
    },

    // Single task detail for modal
    TaskForModalFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.taskForModal = action.payload;
    },

    // Exit clearance paginated list
    ExitClearanceListFetched: (state, action) => {
      state.error = null;
      state.listLoading = false;
      state.exitClearanceEntities = action.payload?.rows;
      state.exitClearanceTotalCount = action.payload?.totalResults;
    },

    // Clear modal data on close
    ClearTaskForModal: (state) => {
      state.taskForModal = null;
    },
  },
});
