import { createSlice } from "@reduxjs/toolkit";

const initialReimbursementConfigState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const reimbursement_configurationSlice = createSlice({
    name: "reimbursement_configurationSlice",
    initialState: initialReimbursementConfigState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        reimbursementConfigFetched: (state, action) => {
           
   
            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;
         
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

         //get User By ID
         ReimbursementConfigFetchedForEdit: (state, action) => {
          
     
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        ReimbursementConfigDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        reimbursementConfigCreated: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },
        reimbursementConfigUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
                
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedReimbursementConfig);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedReimbursementConfig;
                }
                return entity;
            });
           
        },


    },
});
