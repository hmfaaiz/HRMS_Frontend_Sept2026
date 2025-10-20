import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  entities: null,
  lastError: null,
  payrollMonth: "",
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const releasePayslipSlice = createSlice({
  name: "release_payslip",
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

    PayrollGroupFetched: (state, action) => {
      const entities = action.payload?.finalizePayrollGroup;
      const payrollMonth = action.payload?.payrollMonth;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.payrollMonth = payrollMonth;
    },

    PayrollGroupUpdatedForReleasePayslip: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
  },
});
