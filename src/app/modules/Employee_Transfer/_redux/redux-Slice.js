import { createSlice } from "@reduxjs/toolkit";

const initialEmployeeTransferState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    dataForEdit: undefined,
    lastError: null,
    dataForRead: false,
    pdfLoading: false,
    csvLoading: false,
    excelLoading: false,
    reportPdfLoading: false, 
};


export const callTypes = {
    list: "list",
    action: "action",
    reportPdf: "reportPdf",  

};

export const EmployeeTransferSlice = createSlice({
    name: "EmployeeTransfer",
    initialState: initialEmployeeTransferState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;

            }
            else if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = false;
            }

            else if (action.payload.callType === callTypes.csv) {
                state.csvLoading = false;
            }
            else if (action.payload.callType === callTypes.xlsx) {
                state.excelLoading = false;
            } 
            else if (action.payload.callType === callTypes.reportPdf) {
                state.reportPdfLoading = false;   
                }else {
            state.actionsLoading = false;
  }

        },

        EmployeeTransferFetched: (state, action) => {


            const entities = action.payload.data?.data.rows;

            const totalResult = action.payload.data?.data.totalResults;

            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;

        },

        //get User By ID
        EmployeeTransferFetchedForEdit: (state, action) => {


            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },


        EmployeeTransferDeleted: (state, action) => {

            state.error = null;
            state.actionsLoading = false;


            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },





        // EmployeeTransferCreated: (state, action) => {

        //     state.actionsLoading = false;
        //     state.error = null;
        //     state.entities.unshift(action.payload);
        // },


        EmployeeTransferCreated: (state, action) => {
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




        EmployeeTransferUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;

            state.entities = state.entities.map((entity) => {
                const finalObj = action.payload.updatedEmployeeTransfer;
                if (entity.Id === finalObj.Id) {
                    // Merge old entity with new fields to preserve joined fields like employeeName
                    return { ...entity, ...finalObj };
                }
                return entity;
            });
        },

        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },

        csvFetched: (state, action) => {
            state.csvLoading = false;
        },

        excelFetched: (state, action) => {
            state.excelLoading = false;
        },
        reportPdfFetched: (state) => {
    state.reportPdfLoading = false;
  },

        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else if (action.payload.callType === callTypes.pdfGenerate) {
                state.pdfGenerateLoading = true;
            } else if (action.payload.callType === callTypes.reportPdf) {
                state.reportPdfLoading = true;    
                } 
            else {
                state.actionsLoading = true;
            } 
        },


    },
});
