import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  dataForEdit: undefined,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const SubsidiaryWisePayrollChecklistSlice = createSlice({
  name: "SubsidiaryWisePayrollChecklist",
  initialState,
  reducers: {
    startCall: (state, action) => {
      state.lastError = null;
      if (action.payload.callType === callTypes.list) state.listLoading = true;
      else state.actionsLoading = true;
    },

    catchError: (state, action) => {
      state.lastError = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) state.listLoading = false;
      else state.actionsLoading = false;
    },

    checklistFetched: (state, action) => {
      const rows = action.payload.data?.data?.rows;
      const total = action.payload.data?.data?.totalResults;
      state.listLoading = false;
      state.entities = rows;
      state.totalCount = total;
    },

    checklistFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
    },

   // CORRECT
checklistDeleted: (state, action) => {
  const { subsidiaryId, payroll_groupId } = action.payload;
  state.entities = state.entities.filter(
    (e) =>
      !(
        String(e.subsidiaryId) === String(subsidiaryId) &&
        String(e.payroll_groupId) === String(payroll_groupId)
      )
  );
},


    checklistCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.unshift(action.payload);
    },

    checklistUpdated: (state, action) => {
      state.actionsLoading = false;
      state.entities = state.entities.map((e) =>
        e.Id === action.payload.Id ? action.payload : e
      );
    },
  },
});

export const { actions } = SubsidiaryWisePayrollChecklistSlice;
