import { createSlice } from "@reduxjs/toolkit";




const initialReimbursementClaimState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    reimbursement_config_policies_permission: null
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const reimbursement_claimSlice = createSlice({
    name: "reimbursement_claimSlice",
    initialState: initialReimbursementClaimState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        clearUserForEdit: (state) => {

            state.userForEdit = null;
        },

        reimbursementClaimFetched: (state, action) => {


            const entities = action.payload.data?.data.rows;
     
            const totalResult = action.payload.data?.data.totalResults;

            state.listLoading = false;
            state.error = null;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Iterate over the rows and add the formatted month-year to each entry
            const updatedEntities = entities.map(row => {
                // Get the corresponding month and year from the PayInPayrollForId
                const month = row.PayInPayrollForId ? row.PayInPayrollForId.month : null;
                const year = row.PayInPayrollForId ? row.PayInPayrollForId.year : null;

                // Add the formatted currentMonth field (e.g. 'Dec-2024')
                if (month !== null && year !== null) {
                    row.currentMonth = `${monthNames[month - 1]}-${year}`;
                } else {
                    row.currentMonth = null; // If either month or year is missing, set to null
                }

                return row;
            });

            state.entities = updatedEntities;
            state.totalCount = totalResult;
           
        },

        //get User By ID
        ReimbursementClaimFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },


        ReimbursementClaimDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },
        // reimbursementClaimCreated: (state, action) => {
            

        //     state.actionsLoading = false;
        //     state.error = null;
        //     state.entities.unshift(action.payload);
        // },
      
      
        reimbursementClaimCreated: (state, action) => {
            
            state.actionsLoading = false;
            state.error = null;
        
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
            // Format the new entity
            const newEntity = { ...action.payload };
        
            // Extract month and year from the PayInPayrollForId
            const month = newEntity.PayInPayrollForId ? newEntity.PayInPayrollForId.month : null;
            const year = newEntity.PayInPayrollForId ? newEntity.PayInPayrollForId.year : null;
        
            // Add formatted currentMonth
          
            if (month !== null && year !== null) {
                newEntity.currentMonth = `${monthNames[month - 1]}-${year}`;
            } else {
                newEntity.currentMonth = null; // If either month or year is missing
            }
        
            // Add the new entity to the start of the entities array
       
            state.entities.unshift(newEntity);
            state.totalCount +=1;
        },
        
      
        reimbursementClaimUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)

            state.entities = state.entities.map((entity) => {

                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedReimbursementClaim);
                if (entity.Id === finalObj.Id) {
                    return finalObj;
                }

                return entity;
            });

        },

        getReimbursementConfigPolicies: (state, action) => {

            state.actionsLoading = false;
            state.error = null;
            state.reimbursement_config_policies_permission = action.payload;



        },


    },
});
