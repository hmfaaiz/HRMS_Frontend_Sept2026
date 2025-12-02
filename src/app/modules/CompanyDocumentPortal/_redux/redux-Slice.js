import { createSlice } from "@reduxjs/toolkit";

const initialCompanyDocumentPortalState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
  

    lastError: null,
 


     emplistLoading: false,
     empactionsLoading: null,
     emptotalCount: 0,
     empentities: null,
};


export const callTypes = {
    list: "list",
    action: "action",
};

export const CompanyDocumentPortalSlice = createSlice({
    name: "CompanyDocumentPortal",
    initialState: initialCompanyDocumentPortalState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
                state.emplistLoading = false;
            } else {
                state.actionsLoading = false;
                state.empactionsLoading = false;
            }
        },

        companyDocFetched: (state, action) => {


            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;
            // const updatedEntities = entities.map(entity => {

            //     const basis_of_gratuity = entity.basis_of_gratuityId === 0 ? 'Gross' : 'Basis';


            //     return {
            //         ...entity,
            //         basis_of_gratuity // Add the new field to the entity
            //     };
            // });

            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;

        },


        employeeDocFetched: (state, action) => {


            const empentities = action.payload.data?.data.rows;

            const emptotalResult = action.payload.data?.data.totalResults;
 
            state.emplistLoading = false;
            state.error = null;
            state.empentities = empentities;
            state.emptotalCount = emptotalResult;

        },







    },
});
