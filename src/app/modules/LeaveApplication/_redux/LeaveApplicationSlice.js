import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  detailLoading: false,
  leaveApplicationDetail: [],
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
  detailUpdateLoading: false,
  sandwichPolicy: null,
};

export const callTypes = {
  list: "list",
  action: "action",
  detail_list: "detail_list",
  detail_action: "detail_action",
};

export const LeaveApplicationSlice = createSlice({
  name: "LeaveApplication",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.detail_list === callTypes.detail_list) {
        state.detailLoading = false;
      } else if (action.payload.detail_action === callTypes.detail_action) {
        state.detailUpdateLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.detail_list === callTypes.detail_list) {
        state.detailLoading = true;
      } else if (action.payload.detail_action === callTypes.detail_action) {
        state.detailUpdateLoading = true;
      } else {
        // state.actionsLoading = true;
      }
    },
    LeaveApplicationFetched: (state, action) => {
      const entities = action.payload.data?.data.rows || [];
      const totalResult = action.payload.data?.data.totalResults || 0;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    LeaveDetailFetched: (state, action) => {
      const entities = action.payload.data?.data || [];
      state.detailLoading = false;
      state.error = null;
      state.leaveApplicationDetail = entities.map((e) => ({
        ...e,
        isOldCancel: e.isCancel,
      })); // This is to keep old cancel value in state, so that we can compare it with new cancel value in form}));
    },
    LeaveDetailUpdated: (state, action) => {
      state.detailUpdateLoading = false;
      state.error = null;
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
    SandwichPolicyFetched: (state, action) => {
      const sandwichPolicy = action?.payload?.sandwichPolicy;
      state.error = null;
      state.sandwichPolicy = sandwichPolicy;
    },
    LeaveBalancesFetched: (state, action) => {
      const leaveBalances = action.payload.data?.data;
      state.listLoading = false;
      state.error = null;
      state.leaveBalances = leaveBalances;
    },
  },
});
