import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  loanOutstanding: null,
  loanOutstandingLoading: false,
  error: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const loanCashPaymentSlice = createSlice({
  name: "loanCashPayment",
  initialState,
  reducers: {

    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    // Stops actionsLoading after create/update without touching entities
    actionsLoadingDone: (state) => {
      state.actionsLoading = false;
      state.error = null;
    },

    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    loanCashPaymentsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      const data = action.payload.data?.data;
      state.entities = data?.rows || data || [];
      state.totalCount = data?.totalResults || data?.length || 0;
    },

    loanCashPaymentFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    clearUserForEdit: (state) => {
      state.userForEdit = undefined;
    },

    // no-op — table is refetched from DB after save so joined fields show correctly
    loanCashPaymentCreated: (state) => {
      state.actionsLoading = false;
      state.error = null;
    },

    // no-op — same reason
    loanCashPaymentUpdated: (state) => {
      state.actionsLoading = false;
      state.error = null;
    },

    loanCashPaymentDeleted: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (Array.isArray(state.entities)) {
        state.entities = state.entities.filter(
          (el) => el.Id !== action.payload.Id
        );
      }
    },

    // Sets loanOutstandingLoading=true and clears stale data before API call
    loanOutstandingStarted: (state) => {
      state.loanOutstandingLoading = true;
      state.loanOutstanding = null;
      state.error = null;
    },

    loanOutstandingFetched: (state, action) => {
      state.loanOutstandingLoading = false;
      state.actionsLoading = false;
      state.error = null;
      state.loanOutstanding = action.payload;
    },

    clearLoanOutstanding: (state) => {
      state.loanOutstanding = null;
      state.loanOutstandingLoading = false;
    },
  },
});

export const { actions } = loanCashPaymentSlice;
export default loanCashPaymentSlice.reducer;