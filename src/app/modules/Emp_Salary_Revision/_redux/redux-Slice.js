import { createSlice } from "@reduxjs/toolkit";




const initialEmpSalaryRevisionState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    loan_config_details_permission:null,
    loan_type:null,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const EmpSalaryRevisionSlice = createSlice({
    name: "EmpSalaryRevisionSlice",
    initialState: initialEmpSalaryRevisionState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        clearUserForEdit : (state) => {
        
            state.userForEdit = null;
    
        },

        EmpSalaryRevisionFetched: (state, action) => {
           
   
            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;
           
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

         //get User By ID
         EmpSalaryRevisionFetchedForEdit: (state, action) => {
          
     
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        EmpSalaryRevisionDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        EmpSalaryRevisionCreated: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },
        EmpSalaryRevisionUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
               
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedEmpSalaryRevision);
                if (entity.Id === finalObj.Id) {
                    return finalObj; 
                }
               
                return entity;
            });
           
        },

        getLoanConfigDetails: (state, action) => {
        
            state.actionsLoading = false;
            state.error = null;
            state.loan_config_details_permission=action.payload;


            
        },
        getLoanType: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.loan_type=action.payload;


            
        },

        LoanApprovedStatusUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
       
            state.entities = state.entities.map((entity) => {
           
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
               
                // let finalObj = JSON.parse(payloadObj.updateApprovedStatus);
               
                if (entity.Id === payloadObj?.updateApprovedStatus?.Id) {
                   
                    return payloadObj; 
                }
               
                return entity;
            });
           
        },



    },
});
