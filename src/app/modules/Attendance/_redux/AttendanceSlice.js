import { createSlice } from "@reduxjs/toolkit";
import { formatToDDMMYYYY } from "../../../utils/common";
import { format } from "date-fns";

const initialState = {
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
    processLoading: false,
    payrollData: null,
    consolidatedLoading: false,

};

export const callTypes = {
    list: "list",
    action: "action",
    process: "process",
    pdf:"pdf",
    consolidated:"consolidated"
};




export const AttendanceSlice = createSlice({
    name: "Attendance",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } 
            else if(action.payload.callType === callTypes.process){
                state.processLoading = false;
            }
            else if(action.payload.callType === callTypes.consolidated){
                state.consolidatedLoading = false;
            }
            else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } 
            else if(action.payload.callType === callTypes.process){
                state.processLoading = true;
            }

            else if(action.payload.callType === callTypes.consolidated){
                state.consolidatedLoading = true;
            }



            else {
                state.actionsLoading = true;
            }
        },
        stopCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } 
            else if(action.payload.callType === callTypes.process){
                state.processLoading = false;
            }
            
            else if(action.payload.callType === callTypes.consolidated){
                state.consolidatedLoading = false;
            }
            else {
                state.actionsLoading = false;
            }
        },
        AttendanceFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        AttendanceFetchedForEdit: (state, action) => {
            const entities = action?.payload?.userForEdit;
            state.actionsLoading = false;
            if (entities) {
         // Commented out due to date shifting to the next day because of timezone conversion issue
                entities.attDateIn = new Date(entities.attDateIn);
                entities.attDateOut = new Date(entities.attDateOut)
            //    console.log("fetching upcoming date ",entities.attDateIn)
            //     entities.attDateIn=format(new Date(entities.attDateIn.split("T")[0]), 'dd/MMM/yyyy')
            //     console.log("fetching entities.attDateIn date ",entities.attDateIn)
            //     entities.attDateOut=format(new Date(entities.attDateOut.split("T")[0]), 'dd/MMM/yyyy')
              
               
                

           
            }
            state.userForEdit = entities;
            state.error = null;
        },
        AttendanceCreated: (state, action) => {
            const entities = action?.payload
            state.actionsLoading = false;
            state.error = null;
            if (entities) {
                entities.attDateIn = new Date(entities.attDateIn);
                entities.attDateOut = new Date(entities.attDateOut)

                // entities.attDateIn=format(new Date(entities.attDateIn.split("T")[0]), 'dd/MMM/yyyy')
                // entities.attDateOut=format(new Date(entities.attDateOut.split("T")[0]), 'dd/MMM/yyyy')
                
            }
            state.userForEdit = entities;
        },
        AttendanceUpdated: (state, action) => {
            const entities = action?.payload
            state.error = null;
            state.actionsLoading = false;
            if (entities) {
                entities.attDateIn = new Date(entities.attDateIn);
                entities.attDateOut = new Date(entities.attDateOut)
                // entities.attDateIn=format(new Date(entities.attDateIn.split("T")[0]), 'dd/MMM/yyyy')
                // entities.attDateOut=format(new Date(entities.attDateOut.split("T")[0]), 'dd/MMM/yyyy')
                
               
            }
            state.userForEdit = entities;
        },
        PayrollMonthFetched: (state, action) => {
            const payrollData = action?.payload?.payrollData;
            state.error = null;
            state.payrollData = payrollData;
        },
        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },

    },
});
