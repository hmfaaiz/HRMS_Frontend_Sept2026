import { createSlice } from "@reduxjs/toolkit";

const initialBudgetYearState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const budgetYearSetupSlice = createSlice({
  name: "BudgetYearSetup",
  initialState: initialBudgetYearState,
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
    BudgetYearSetupFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    BudgetYearSetupFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },
    BudgetYearSetupDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },
    BudgetYearSetupCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
    },
    BudgetYearSetupUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedBudgetYearSetup);
        if (entity.Id === finalObj.Id) {
          return finalObj;
        }
        return entity;
      });
    },
  },
});
