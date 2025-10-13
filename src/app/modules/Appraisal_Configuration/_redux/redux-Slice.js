import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  designationList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const appraisalConfigSlice = createSlice({
  name: "appraisal_config",
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

    AppraisalConfigFetched: (state, action) => {
      const entities = action.payload.data?.data.rows;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    //get User By ID
    AppraisalConfigFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },
    DesignationList: (state, action) => {
      state.actionsLoading = false;
      state.designationList = action.payload;
      state.error = null;
    },
    AppraisalConfigDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;

      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },
    AppraisalConfigCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
      state.totalCount += 1;
    },
    AppraisalConfigUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      // state.entities.push(action.payload)

      state.entities = state.entities.map((entity) => {
        //const payload = { ...action.payload };
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedIncomeTaxSlab);
        if (entity.Id === finalObj.Id) {
          return finalObj; //action.payload.updatedIncomeTaxSlab;
        }

        return entity;
      });
    },
  },
});
