import { createSlice } from "@reduxjs/toolkit";

const initialTaskConfigurationState = {
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

export const TaskConfigurationSlice = createSlice({
    name: "TaskConfiguration",
    initialState: initialTaskConfigurationState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },

        TaskConfigFetched: (state, action) => {
        
  
            const entities = action.payload.data?.data.rows;
        
           
            const totalResult = action.payload.data?.data.totalResults;
     
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
           
        },

         //get User By ID
         TaskConfigFetchedForEdit: (state, action) => {
           
   
            state.actionsLoading = false;
            state.userForEdit = action.payload.userForEdit;
            state.error = null;
        },

      
        TaskConfigurationDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;
         
          
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },






        // taskConfigurationCreated: (state, action) => {
           
        //     state.actionsLoading = false;
        //     state.error = null;
        //     state.entities.unshift(action.payload);
        // },


        taskConfigurationCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
        
            // Clone the payload to avoid direct mutation
            // let payload = JSON.stringify(action.payload);
            // let payloadObj = JSON.parse(payload);
        
            // // If basis_of_gratuityId is 0, set "Gross", if 1, set "Basis"
            // if (payloadObj.basis_of_gratuityId == 0) {
             
            //     payloadObj.basis_of_gratuity = "Gross";
            // } else if (payloadObj.basis_of_gratuityId == 1) {
          
            //     payloadObj.basis_of_gratuity = "Basis";
            // }
        
            // Add the modified payload to the beginning of the entities list
            state.entities.unshift(action.payload);
        },
        



        taskConfigurationUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            // state.entities.push(action.payload)
            
          
            state.entities = state.entities.map((entity) => {
                
                //const payload = { ...action.payload };
                let payload = JSON.stringify(action.payload)
                let payloadObj = JSON.parse(payload);
                let finalObj = JSON.parse(payloadObj.updatedTaskConfiguration);
                if (entity.Id === finalObj.Id) {
                    return finalObj; //action.payload.updatedTaskConfiguration;
                }
                return entity;
            });
           
        },


        
        

    },
});
