import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  error: null,
  empAuthorityList: [],
  payrollData: null,
  workflowStatusList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const RosterRequestSlice = createSlice({
  name: "attendance_roster_request",
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
    rosterRequestFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload.entities || [];
      state.totalCount = action.payload.totalCount || 0;
    },
    rosterRequestFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.userForEdit = action.payload?.userForEdit;
    },
    rosterRequestCreated: (state) => {
      state.actionsLoading = false;
      state.error = null;
      state.totalCount++;
    },
    empAuthoritiesFetched: (state, action) => {
      state.error = null;
      state.empAuthorityList = action.payload.empAuthorityList;
    },
    // rosterRequestDeleted: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.entities = state.entities.filter((el) => el.Id != action.payload.id);
    //   state.totalCount--;
    // },
    PayrollMonthFetched: (state, action) => {
      state.error = null;
      state.payrollData = action.payload.payrollData;
    },
    RosterWorkflowStatusFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = action.payload;
    },
  },
});
