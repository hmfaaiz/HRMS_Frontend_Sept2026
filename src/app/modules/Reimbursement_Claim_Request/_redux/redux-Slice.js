import { createSlice } from "@reduxjs/toolkit";

const initialReimbursementClaimState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  empAuthorityList: [],
  isPolicyExists: false,
  payrollData: null,
  reimbursementTypes: null,
  reimbursement_config_policies_permission: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ReimbursementClaimSlice = createSlice({
  name: "reimbursement_claim",
  initialState: initialReimbursementClaimState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    clearUserForEdit: (state) => {
      state.userForEdit = null;
    },

    reimbursementClaimFetched: (state, action) => {
      const responseData = action.payload.data?.data;
      const entities = responseData?.rows;
      const totalResult = responseData?.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities || [];
      state.totalCount = totalResult || 0;
    },

    ReimbursementClaimFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    ReimbursementClaimDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = (state.entities || []).filter(
        (el) => el.Id !== action.payload.Id
      );
    },

    reimbursementClaimCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (state.entities) {
        state.entities.unshift(action.payload);
      } else {
        state.entities = [action.payload];
      }
    },

    reimbursementClaimUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },

    EmployeeAuthorityFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      const { data, isPolicyExists } = action.payload;
      state.empAuthorityList = data;
      state.isPolicyExists = isPolicyExists;
    },

    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },

    getReimbursementTypes: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.reimbursementTypes = action.payload;
    },

    ReimbursementConfigPoliciesFetched: (state, action) => {

            state.actionsLoading = false;
            state.error = null;
            state.reimbursement_config_policies_permission = action.payload;
    },
  },
});