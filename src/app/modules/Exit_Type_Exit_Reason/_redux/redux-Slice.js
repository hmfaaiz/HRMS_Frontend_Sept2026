import { createSlice } from "@reduxjs/toolkit";

const initialAccrueGratuityConfigState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    dataForEdit: undefined,
    lastError: null,
    dataForRead: false,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const ExitTypeExitReasonSlice = createSlice({
    name: "ExitTypeExitReasonSlice",
    initialState: initialAccrueGratuityConfigState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
   
        accrueGratuityConfigFetched: (state, action) => {
        
    
            const entities = action.payload.data?.data.rows;
      
            const totalResult = action.payload.data?.data.totalResults;
        
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

         //get User By ID
       
       
 
       
       
         AccrueGratuityConfigFetchedForEdit: (state, action) => {
           
 
            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },

      
        AccrueGratuityConfigDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        accrueGratuityConfigCreated: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
      
        },
      

        
      
      
      
        accrueGratuityConfigUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
                
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedAccrueGratuityConfig);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedAccrueGratuityConfig;
                }
                return entity;
            });
           
        },


    },
});
