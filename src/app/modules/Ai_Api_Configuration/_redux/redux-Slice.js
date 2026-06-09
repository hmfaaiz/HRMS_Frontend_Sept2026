import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  roles: null,
  centers: null,
  userStatusTypes: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const Ai_Api_ConfigurationSlice = createSlice({
  name: "ai_api_configuration",
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
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    aiApiConfigurationFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },

    //get User By ID
    aiApiConfigurationFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    aiApiConfigurationDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },

    aiApiConfigurationCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
    },

    aiApiConfigurationUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        //const payload = { ...action.payload };
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedAiApiConfiguration);
        if (entity.Id === finalObj.Id) {
          return finalObj; //action.payload.updatedAiApiConfiguration;
        }
        return entity;
      });
    },

    aiApiConfigurationVerified: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },
  },
});
