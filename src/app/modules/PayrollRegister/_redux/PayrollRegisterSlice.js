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
    registerGDExcelLoading:false,
    registerExcelLoading:false,

    //preview register pdf
    previewRegisterPdData:[],
    previewRegisterPdftotalCount:0,


    //preview payslip
    previewPayslipPdfData:[],
    previewPayslipPdftotalCount:0,


    registerPreviewLoading:false,
    payslipPreviewLoading:false,
};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    register: 'register',
    registerExcel: 'registerExcel',
    bankAdvice: 'advice',
    registerGDExcel: 'registerGDExcel',
    registerPreview:"registerPreview",
    payslipPreview:"payslipPreview",
};

export const PayrollRegisterSlice = createSlice({
    name: "PayrollRegister",
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
            else if(action.payload.callType === callTypes.register){
                state.registerLoading = false;
            }
            else if(action.payload.callType === callTypes.bankAdvice){
                state.adviceLoading = false;
            }
            else if(action.payload.callType === callTypes.registerExcel){
                state.registerExcelLoading = false;
            }
            else if(action.payload.callType === callTypes.registerGDExcel){
                state.registerGDExcelLoading = false;
            }

         
            else if(action.payload.callType === callTypes.registerPreview){
                state.registerPreviewLoading = false;
            }
     
            
         
            else if(action.payload.callType === callTypes.payslipPreview){
                state.payslipPreviewLoading = false;
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
            else if(action.payload.callType === callTypes.register){
                state.registerLoading = true;
            }
            else if(action.payload.callType === callTypes.registerExcel){
                state.registerExcelLoading = true;
            }
            else if(action.payload.callType === callTypes.registerGDExcel){
                state.registerGDExcelLoading = true;
            }
            else if(action.payload.callType === callTypes.bankAdvice){
                state.adviceLoading = true;
            }
            else if(action.payload.callType === callTypes.registerPreview){
                state.registerPreviewLoading = true;
            }
            else if(action.payload.callType === callTypes.payslipPreview){
                state.payslipPreviewLoading = true;
            }
            else {
                state.actionsLoading = true;
            }
        },
        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },
        registerFetched: (state, action) => {
            state.registerLoading = false;
        },
        registerExcelFetched: (state, action) => {
            state.registerExcelLoading = false;
        },
        registerGDExcelFetched: (state, action) => {
            state.registerGDExcelLoading = false;
        },
        adviceFetched: (state, action) => {
            state.adviceLoading = false;
        },
        
       
        PayrollRegisterFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
            
        },

        previewRegisterPdfFetched: (state, action) => {
            
            const previewRegisterPdData = action.payload.data?.data;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.previewRegisterPdData = previewRegisterPdData;
            state.previewRegisterPdftotalCount = totalResult;

            localStorage.setItem('previewRegisterPdf', JSON.stringify(previewRegisterPdData));
            state.registerPreviewLoading = false;
        },


        
        previewPayslipPdfFetched: (state, action) => {
            
            const previewPayslipPdfData = action.payload.data?.data;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.previewPayslipPdfData = previewPayslipPdfData;
            state.previewPayslipPdftotalCount = totalResult;

            localStorage.setItem('previewPayslipPdf', JSON.stringify(previewPayslipPdfData));
            state.payslipPreviewLoading = false;
        }
    },
});
