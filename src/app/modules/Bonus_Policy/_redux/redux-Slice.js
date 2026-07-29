// _redux/redux-Slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const bonusPolicySlice = createSlice({
  name: "bonus_policy",
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

    BonusPolicyFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },

    BonusPolicyFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    BonusPolicyDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },

    BonusPolicyCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
      state.totalCount += 1;
    },

    BonusPolicyUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.Id === action.payload.updatedBonusPolicy.Id) {
          return action.payload.updatedBonusPolicy;
        }
        return entity;
      });
    },
     BonusPolicyEarningsFetched: (state, action) => {
      state.actionsLoading = false;
      state.allEarnings = action.payload;
      state.error = null;
    },
  },
});

