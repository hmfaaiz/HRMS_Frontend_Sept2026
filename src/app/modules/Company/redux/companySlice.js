import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  dataForEdit: null,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const CompanySlice = createSlice({
  name: "company",
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
    CompanyFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    CompanyFetchedForEdit: (state, action) => {
      const entities = action?.payload;
      state.actionsLoading = false;
      state.dataForEdit = entities;
      state.error = null;
    },
    CompanyDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id != action.payload.id
      );
      state.totalCount--;
    },
    CompanyCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.totalCount++;
    },
    CompanyUpdated: (state, action) => {
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
  },
});
