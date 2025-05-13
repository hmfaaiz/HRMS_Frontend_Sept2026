import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  
  totalCount: 0,
  entities: null,
  roles: null,
  centers: null,
  userStatusTypes: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  payrollData: null,
  leaveBalances: [],
  empAuthorityList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const LeaveRequestSlice = createSlice({
  name: "LeaveRequest",
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
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    LeaveApplicationFetched: (state, action) => {
      const entities = action.payload.data?.data?.rows || [];
      const totalResult = action.payload.data?.data?.totalResults || 0;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    LeaveApplicationFetchedForEdit: (state, action) => {
      const entities = action?.payload?.userForEdit;
      if (entities) {
        entities.fileName = entities.file; //This is to show file on UI in form seperately from the field
        entities.from = entities.from ? new Date(entities.from) : ""; //This is to format date in form format. When we receive date in response it's in string type instead of Date type
        entities.to = entities.to ? new Date(entities.to) : ""; //This is to format date in form format. When we receive date in response it's in string type instead of Date type
      }
      state.actionsLoading = false;
      state.userForEdit = entities;
      state.error = null;
    },
    LeaveApplicationDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id != action.payload.id
      );
      state.totalCount--;
    },
    LeaveApplicationCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
      state.totalCount++;
    },
    LeaveApplicationUpdated: (state, action) => {
      const id = action.payload.Id;
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((el) => {
        if (el.Id == id) {
          return action.payload;
        }
        return el;
      });
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    LeaveBalancesFetched: (state, action) => {
      const leaveBalances = action.payload.data?.data;
      state.listLoading = false;
      state.error = null;
      state.leaveBalances = leaveBalances;
    },
    EmployeeAuthorityFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.empAuthorityList = action.payload;
    },
  },
});
