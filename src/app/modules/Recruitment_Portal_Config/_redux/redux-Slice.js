import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const RecruitmentPortalConfigSlice = createSlice({
  name: "recruitment_portal_config",
  initialState: initialState,
  reducers: {
    catchError: (state) => {
      state.loading = false;
    },
    startCall: (state) => {
      state.loading = true;
    },
    portalConfigFetched: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    },
  },
});
