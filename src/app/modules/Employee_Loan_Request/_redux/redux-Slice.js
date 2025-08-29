import { createSlice } from "@reduxjs/toolkit";




const initialEmployeeLoanRequestState = {
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

export const employee_loan_requestSlice = createSlice({
    name: "employee_loan_requestSlice",
    initialState: initialEmployeeLoanRequestState,
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

        employeeLoanRequestFetched: (state, action) => {
           
   
            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;
           
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

         //get User By ID
         EmployeeLoanRequestFetchedForEdit: (state, action) => {
          
     
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        EmployeeLoanRequestDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        employeeLoanRequestCreated: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },
        employeeLoanRequestUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
               
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedEmployeeLoanRequest);
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
