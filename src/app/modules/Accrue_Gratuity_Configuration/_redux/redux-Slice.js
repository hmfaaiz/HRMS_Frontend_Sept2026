import { createSlice } from "@reduxjs/toolkit";

const initialAccrueGratuityConfigState = {
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

export const accrue_gratuity_configurationSlice = createSlice({
    name: "accrue_gratuity_configuration",
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
   
        // accrueGratuityConfigFetched: (state, action) => {
        
    
        //     const entities = action.payload.data?.data.rows;
      
        //     const totalResult = action.payload.data?.data.totalResults;
        
        //     state.listLoading = false;
        //     state.error = null;
        //     state.entities = entities;
        //     state.totalCount = totalResult;
        // },

         //get User By ID
       
       
         accrueGratuityConfigFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
        
            // Check if entities exist
            if (entities) {
                // Map over entities to combine formName and formCode
                const combinedEntities = entities.map(item => ({
                    ...item,
                    bankCashAccount: item.BankCashAccount 
                        ? `${item.BankCashAccount.formCode} - ${item.BankCashAccount.formName}`
                        : null,
                    gratuityExpenseAccount: item.GraduityExpenseAccount 
                        ? `${item.GraduityExpenseAccount.formCode} - ${item.GraduityExpenseAccount.formName}`
                        : null,
                    gratuityPayableAccount: item.GraduityPayableAccount 
                        ? `${item.GraduityPayableAccount.formCode} - ${item.GraduityPayableAccount.formName}`
                        : null,
                    subsidiary: item.Subsidiary 
                        ? `${item.Subsidiary.formCode} - ${item.Subsidiary.formName}`
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
        },
        
       
       
         AccrueGratuityConfigFetchedForEdit: (state, action) => {
           
 
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        AccrueGratuityConfigDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        // accrueGratuityConfigCreated: (state, action) => {
           
        //     state.actionsLoading = false;
        //     state.error = null;
        //     state.entities.unshift(action.payload);
      
        // },
      
        accrueGratuityConfigCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
        
            // Get the new entity from the payload
            const newEntity = action.payload;
        
            // Create combined fields for the new entity
            const combinedEntity = {
                ...newEntity,
                bankCashAccount: newEntity.BankCashAccount 
                    ? `${newEntity.BankCashAccount.formCode} - ${newEntity.BankCashAccount.formName}`
                    : null,
                gratuityExpenseAccount: newEntity.GraduityExpenseAccount 
                    ? `${newEntity.GraduityExpenseAccount.formCode} - ${newEntity.GraduityExpenseAccount.formName}`
                    : null,
                gratuityPayableAccount: newEntity.GraduityPayableAccount 
                    ? `${newEntity.GraduityPayableAccount.formCode} - ${newEntity.GraduityPayableAccount.formName}`
                    : null,
                subsidiary: newEntity.Subsidiary 
                    ? `${newEntity.Subsidiary.formCode} - ${newEntity.Subsidiary.formName}`
                    : null,
            };
        
            // Add the combined entity to the beginning of the entities array
            state.entities.unshift(combinedEntity);
        
            // Logging for debugging
           
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
