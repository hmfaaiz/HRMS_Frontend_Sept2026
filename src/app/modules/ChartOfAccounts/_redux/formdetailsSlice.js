import { createSlice } from "@reduxjs/toolkit";

const initialFormsState = {
  listLoading: false,
  actionsLoading: null,
  totalCount: 0,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userForRead: false,
  pdfLoading: false,
  csvLoading: false,
  excelLoading: false,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const ChartOfAccountSlice = createSlice({
  name: "chart_of_accounts",
  initialState: initialFormsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = false;
      } else if (action.payload.callType === callTypes.csv) {
        state.csvLoading = false;
      } else if (action.payload.callType === callTypes.xlsx) {
        state.excelLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = true;
      } else if (action.payload.callType === callTypes.csv) {
        state.csvLoading = true;
      } else if (action.payload.callType === callTypes.xlsx) {
        state.excelLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    formFetched: (state, action) => {
      //

      const entities = action.payload.data?.data.rows;

      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },
    customFetchedList: (state, action) => {
      //
      const entities = action.payload.data?.data.rows || [];
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalResult;
    },

    //get User By ID
    formFetchedForEdit: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    //get User By ID
    userFetched: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },
    formDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.Id !== action.payload.Id
      );
    },
    formCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.unshift(action.payload);
    },
    formCreatedCustom: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
    },
    formUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      // state.entities.push(action.payload)
      state.entities = state.entities.map((entity) => {
        //const payload = { ...action.payload };
        let payload = JSON.stringify(action.payload);
        let payloadObj = JSON.parse(payload);
        let finalObj = JSON.parse(payloadObj.updatedform);

        if (entity.Id === finalObj.Id) {
          return finalObj; //action.payload.updatedBank;
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

// export const RoleSlice = createSlice({
//   name: "getAllRole",
//   initialState: initialRolesState,
//   reducers: {
//     catchError: (state, action) => {
//       state.error = `${action.type}: ${action.payload.error}`
//       if (action.payload.callType === callTypes.list) {
//         state.listLoading = false
//       } else {
//         state.actionsLoading = false
//       }
//     },
//     startCall: (state, action) => {
//       state.error = null
//       if (action.payload.callType === callTypes.list) {
//         state.listLoading = true
//       } else {
//         state.actionsLoading = true
//       }
//     },
//     dataFetched: (state, action) => {
//       const entities = action.payload
//       state.listLoading = false
//       state.error = null
//       state.entities = entities
//       state.totalCount = entities.length
//     },
//   },
// })
