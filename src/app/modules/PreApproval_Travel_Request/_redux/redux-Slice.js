import { createSlice } from "@reduxjs/toolkit";

const initialPreApprovalTravelRequestState = {
  listLoading: false,
  actionsLoading: null,
  pdfLoading: false,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  employeeEntitlement: null,
};

export const callTypes = {
  list: "list",
  action: "action",
  pdf: "pdf",
};

export const preapproval_travel_requestSlice = createSlice({
  name: "preapproval_travel_requestSlice",
  initialState: initialPreApprovalTravelRequestState,
  reducers: {
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    preapprovalTravelRequestFetched: (state, action) => {
      const data = action.payload.data?.data || action.payload?.data;
      const entities = data?.rows || data || [];
      const totalResult =
        data?.totalResults || (Array.isArray(entities) ? entities.length : 0);

      state.listLoading = false;
      state.error = null;
      state.entities = Array.isArray(entities) ? entities : [];
      state.totalCount = totalResult;
    },

    //get By ID
    preapprovalTravelRequestFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    preapprovalTravelRequestDeleted: (state, action) => {
      const id = action.payload.id || action.payload.Id;
      state.error = null;
      state.actionsLoading = false;
      const prev = state.entities;
      state.entities = prev.filter((el) => (el.id || el.Id) !== id);
      // Keep count in sync
      if (state.entities && state.entities.length < prev.length) {
        state.totalCount = Math.max(0, state.totalCount - 1);
      }
    },
    preapprovalTravelRequestCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (state.entities) {
        state.entities.unshift(action.payload);
      } else {
        state.entities = [action.payload];
      }
      // Keep count in sync
      state.totalCount = (state.totalCount || 0) + 1;
    },
    preapprovalTravelRequestUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      const updatedPreApprovalTravelRequest =
        action.payload.updatedPreApprovalTravelRequest;
      const finalObj =
        typeof updatedPreApprovalTravelRequest === "string"
          ? JSON.parse(updatedPreApprovalTravelRequest)
          : updatedPreApprovalTravelRequest;
      const id = finalObj.id || finalObj.Id;

      state.entities = state.entities.map((entity) => {
        if ((entity.id || entity.Id) === id) {
          return finalObj;
        }
        return entity;
      });
    },
    employeeEntitlementFetched: (state, action) => {
      state.employeeEntitlement = action.payload.employeeEntitlement;
      state.actionsLoading = false;
    },
    pdfFetched: (state) => {
      state.pdfLoading = false;
      state.error = null;
    },
  },
});
