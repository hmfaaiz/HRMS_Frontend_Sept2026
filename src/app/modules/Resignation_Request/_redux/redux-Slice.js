import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  actionsLoading: null,
  dataForEdit: undefined,
  lastError: null,
  dataForRead: false,
  empAuthorityList: [],
  isPolicyExists: false,
  rejectedRecord: [],
};

export const callTypes = {
  action: "action",
};

export const ResignationRequestSlice = createSlice({
  name: "resignation_request",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.actionsLoading = false;
    },
    startCall: (state, action) => {
      state.actionsLoading = true;
    },
    ResignationFetchedForEdit: (state, action) => {
      const dataForEdit = action.payload?.result || {};
      const rejectedRecord = action.payload?.rejectedRecord || [];
      state.actionsLoading = false;
      state.dataForEdit = dataForEdit;
      state.rejectedRecord = rejectedRecord;
      state.error = null;
    },
    EmployeeAuthorityFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      const { data, isPolicyExists } = action.payload;
      state.empAuthorityList = data;
      state.isPolicyExists = isPolicyExists;
    },
  },
});
