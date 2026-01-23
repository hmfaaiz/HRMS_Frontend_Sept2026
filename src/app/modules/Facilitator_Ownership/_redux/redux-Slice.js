import { createSlice } from "@reduxjs/toolkit";

const initialFacilitatorOwnershipState = {
  listLoading: false,
  actionsLoading: null,
  entitiesSent: null,
  entitiesReceived: null,
  totalSent: 0,
  totalReceived: 0,
  lastError: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const FacilitatorOwnershipSlice = createSlice({
  name: "FacilitatorOwnership",
  initialState: initialFacilitatorOwnershipState,
  reducers: {
    catchError: (state, action) => {
      state.lastError = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

   
    ownershipSentFetched: (state, action) => {
      
      const rows = action.payload?.data?.data?.rows || [];
      state.entitiesSent = rows;
      state.totalSent = action.payload?.data?.data?.totalResults || rows.length;
      state.listLoading = false;
      state.lastError = null;
    },

   
    ownershipReceivedFetched: (state, action) => {
     
      const rows = action.payload?.data?.data?.rows || [];
      state.entitiesReceived = rows;
      state.totalReceived = action.payload?.data?.data?.totalResults || rows.length;
      state.listLoading = false;
      state.lastError = null;
    },
  },
});

export const { reducer, actions } = FacilitatorOwnershipSlice;