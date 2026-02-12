import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  //   entities: [],
  entities: {
    results: [],
    totalResults: 0,
    page: 1,
    limit: 10,
  },

  dataForEdit: undefined,
  masterChecklist: [],
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const EmployeeOnboardingChecklistSlice = createSlice({
  name: "EmployeeOnboardingChecklistSlice",
  initialState,
  reducers: {
    catchError: (state, action) => {
      state.lastError = action.payload.error;
      state.listLoading = false;
      state.actionsLoading = false;
    },

    checklistFetched: (state, action) => {
      state.entities = action.payload;
      state.listLoading = false;
    },

   
    checklistFetchedForEdit: (state, action) => {
      const tasks = Array.isArray(action.payload) ? action.payload : [];
      state.dataForEdit = {
        employeeId: tasks[0]?.employeeId || "",
        dataIsExist: tasks.length > 0,
        list: tasks.map((t, i) => ({
          ...t,
          sno: i + 1,
        })),
      };
      state.actionsLoading = false;
    },

    masterChecklistFetched: (state, action) => {
      state.masterChecklist = action.payload;
      state.actionsLoading = false;
    },

    checklistCreated: (state, action) => {
      state.entities.results.unshift(action.payload);
      state.actionsLoading = false;
    },

    checklistUpdated: (state, action) => {
      const updated = action.payload;
      state.entities.results = state.entities.results.map((item) =>
        item.Id === updated.Id ? updated : item,
      );
      state.actionsLoading = false;
    },

    checklistDeleted: (state, action) => {
      state.entities.results = state.entities.results.filter(
        (x) => x.employeeId !== action.payload, // Changed from employeeId to Id
      );
      state.actionsLoading = false;
    },
  },
});

export const { actions } = EmployeeOnboardingChecklistSlice;
