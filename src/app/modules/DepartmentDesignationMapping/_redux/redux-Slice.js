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
  allDesignations: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const DepartmentDesignationMappingSlice = createSlice({
  name: "DepartmentDesignationMapping",
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

    desigMapFetched: (state, action) => {
      const entities = action.payload.data?.data;
      console.log("entities111111",entities)
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
    },

    //get User By ID
    desigMapFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    desigMapDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },
    allDesignationFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.allDesignations = action.payload;
    },
    desigMapUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        //const payload = { ...action.payload };
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedEmailConfig);
        if (entity.Id === finalObj.Id) {
          return finalObj; //action.payload.updatedEmailConfig;
        }
        return entity;
      });
    },
  },
});
