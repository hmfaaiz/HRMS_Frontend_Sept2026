import { createSlice } from "@reduxjs/toolkit";

const initialFinalSettlementState = {
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
  pdfGenerateLoading: false,
  activeEmployeeList: [],
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
};

export const callTypes = {
  list: "list",
  action: "action",
  pdfGenerate: "pdfGenerate",
};

export const FinalSettlementSlice = createSlice({
  name: "FinalSettlement",
  initialState: initialFinalSettlementState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.pdfGenerate) {
        state.pdfGenerateLoading = false;
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
      
      else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.pdfGenerate) {
        state.pdfGenerateLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    stopCall: (state, action) => {
      state.pdfGenerateLoading = false;
    },

    finalSettlementFetched: (state, action) => {
     
      const entities = action.payload.data?.data.rows;

      const totalResult = action.payload.data?.data.totalResults;

      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },

    //get User By ID
    FinalSettlementFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.dataForEdit = action.payload.dataForEdit;
      state.error = null;

    
    },


    EmployeeFetchedList: (state, action) => {
      state.actionsLoading = false;
   
      state.activeEmployeeList = action.payload;
      state.error = null;
   
    },

    FinalSettlementDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;

      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },

    JobPostedStatus: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
    },


    finalSettlementCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;


      state.entities.unshift(action.payload);
    },

    finalSettlementUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
   

      state.entities = state.entities.map((entity) => {
   
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedSeparation);
        if (entity.Id === finalObj.Id) {
          return finalObj;
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
  },
});
