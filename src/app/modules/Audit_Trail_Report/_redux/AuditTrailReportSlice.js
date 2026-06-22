import { createSlice } from "@reduxjs/toolkit";

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
    pdfLoading: false,
    registerExcelLoading:false,
};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf"
};

export const AuditTrailReportSlice = createSlice({
    name: "AuditTrailReportSlice",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } 
            else if(action.payload.callType === callTypes.pdf){
                state.pdfLoading = false;
            }

            else if(action.payload.callType === callTypes.xlsx){
                state.registerExcelLoading = false;
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
            else if(action.payload.callType === callTypes.pdf){
                state.pdfLoading = true;


            }
               else if(action.payload.callType === callTypes.registerExcel){
                            state.registerExcelLoading = true;
                        }
            else {
                state.actionsLoading = true;
            }
        },
        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },

        registerExcelFetched: (state, action) => {
            state.registerExcelLoading = false;
        },
        EmployeeRegisterFetched: (state, action) => {
            state.entities = null;
            state.totalCount = 0;
 
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
           
        }
    },
});
