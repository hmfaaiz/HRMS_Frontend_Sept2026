import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  payrollData: null,
  workflowStatusList: [],
  budgetAmountData: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const BudgetApprovalSlice = createSlice({
  name: "department_wise_budget_approval",
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
    BudgetApprovalApplicationFetched: (state, action) => {
      const entities = action.payload.data?.data?.rows || [];
      const totalResult = action.payload.data?.data?.totalResults || 0;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    BudgetWorkflowStatusFetched: (state, action) => {
      const data = action.payload;
      state.actionsLoading = false;
      state.error = null;
      state.workflowStatusList = data;
    },
    
    
    BudgetAmountDataFetched: (state, action) => {
      state.budgetAmountData =  action.payload;
      state.actionsLoading = false;
      state.error = null;
 
    },
  },
});
