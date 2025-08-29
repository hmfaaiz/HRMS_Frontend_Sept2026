import { createSlice } from "@reduxjs/toolkit";

const initialIncomeTaxSlabState = {
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
    taxYearSetup:null
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const tax_slabSlice = createSlice({
    name: "tax_slab",
    initialState: initialIncomeTaxSlabState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
      
        incomeTaxSlabFetched: (state, action) => {
       
    
            const entities = action.payload.data?.data.rows;
           
            const totalResult = action.payload.data?.data.totalResults;
          
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

         //get User By ID
         IncomeTaxSlabFetchedForEdit: (state, action) => {
           
   
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        IncomeTaxSlabDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        incomeTaxSlabCreated: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
            state.totalCount +=1
        },
        incomeTaxSlabUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
                
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedIncomeTaxSlab);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedIncomeTaxSlab;
                }

              
                return entity;
            });
           
        },

        getAllTaxYearSetupFetched: (state, action) => {
       
    
            const taxYearSetup = action.payload.data?.data.rows;
           
            const totalResult = action.payload.data?.data.totalResults;
          
            state.listLoading = false;
            state.error = null;
            state.taxYearSetup = taxYearSetup;
            state.totalCount = totalResult;
        },


    },
});
