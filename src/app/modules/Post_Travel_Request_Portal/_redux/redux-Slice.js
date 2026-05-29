import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  error: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  // Dropdown data
  approvedEmployeeList: [],
  selectedTravelRequest: null,
  reimbursement_config_policies_permission: null,
  canApprove: false,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const postTravelRequestPortalSlice = createSlice({
  name: "post_travel_request_portal",
  initialState,
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

    approvedEmployeeListFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.approvedEmployeeList = action.payload.approvedEmployeeList || [];
    },

    selectedTravelRequestSet: (state, action) => {
      state.selectedTravelRequest = action.payload.selectedTravelRequest;
    },

    selectedTravelRequestCleared: (state) => {
      state.selectedTravelRequest = null;
    },

    // Paginated list
    postTravelRequestPortalsFetched: (state, action) => {
      const data = action.payload.data?.data || action.payload?.data;
      const entities = data?.rows || data || [];
      const totalResult =
        data?.totalResults || (Array.isArray(entities) ? entities.length : 0);
      state.listLoading = false;
      state.error = null;
      state.entities = Array.isArray(entities) ? entities : [];
      state.totalCount = totalResult;
    },

    // Get by Id
    postTravelRequestPortalFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    // Create
    postTravelRequestPortalCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (state.entities) {
        state.entities.unshift(action.payload);
      } else {
        state.entities = [action.payload];
      }
      state.totalCount = (state.totalCount || 0) + 1;
    },

    // Update
    postTravelRequestPortalUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      const updated = action.payload.updated;
      const id = updated?.Id || updated?.id;
      state.entities = (state.entities || []).map((entity) =>
        (entity.Id || entity.id) === id ? updated : entity,
      );
    },

    // Delete
    postTravelRequestPortalDeleted: (state, action) => {
      const id = action.payload.id || action.payload.Id;
      state.error = null;
      state.actionsLoading = false;
      const prev = state.entities || [];
      state.entities = prev.filter((el) => (el.Id || el.id) !== id);
      if (state.entities.length < prev.length) {
        state.totalCount = Math.max(0, state.totalCount - 1);
      }
    },
    getReimbursementConfigPolicies: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.reimbursement_config_policies_permission = action.payload;
    },
    canApproveSet: (state, action) => {
      state.canApprove = action.payload.canApprove;
    },
    actionCompleted: (state) => {
      state.actionsLoading = false;
      state.error = null;
    },
  },
});
