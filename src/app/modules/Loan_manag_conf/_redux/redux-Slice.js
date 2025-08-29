import { createSlice } from "@reduxjs/toolkit";

const initialLoanManagConfigState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
 
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    loan_type:null,
};



export const callTypes = {
    list: "list",
    action: "action",
};

export const loan_manag_confSlice = createSlice({
    name: "loan_manag_confSlice",
    initialState: initialLoanManagConfigState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
       

         loanManagConfigFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
      
        
            if (entities) {
                // Map over entities to combine formName and formCode
                const combinedEntities = entities.map(item => ({
                    ...item,
                    account: item.Account 
                        ? `${item.Account.formCode} - ${item.Account.formName}` 
                        : null,

                        empLoanAccount: item.EmpLoanAccount 
                        ? `${item.EmpLoanAccount.formCode} - ${item.EmpLoanAccount.formName}` 
                        : null,   
                }));
        
                // Update the state with the combined entities
                state.entities = combinedEntities;
            } else {
                state.entities = [];
            }
        
         
        
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.totalCount = totalResult;
        }
,        
        
        
        
        
         LoanManagConfigForEdit: (state, action) => {
     
       
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        LoanManagConfigDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        loanManagConfigCreated: (state, action) => {
            



           
            state.actionsLoading = false;
            state.error = null;

            const newEntity = action.payload;
        
            // Create combined fields for the new entity
            const combinedEntity = {
                ...newEntity,
                account: newEntity.Account 
                ? `${newEntity.Account.formCode} - ${newEntity.Account.formName}` 
                : null,

                empLoanAccount: newEntity.EmpLoanAccount 
                ? `${newEntity.EmpLoanAccount.formCode} - ${newEntity.EmpLoanAccount.formName}` 
                : null,   
               
            };
        
            // Add the combined entity to the beginning of the entities array
            state.entities.unshift(combinedEntity);
            state.totalCount +=1;
          
        },
        loanManagConfigUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
          
            state.entities = state.entities.map((entity) => {
                
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedLoanManagConfig);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedLoanManagConfig;
                }
                return entity;
            });
           
        },

        getLoanType: (state, action) => {
           
            state.actionsLoading = false;
            state.error = null;
            state.loan_type=action.payload;


            
        },


    },
});
