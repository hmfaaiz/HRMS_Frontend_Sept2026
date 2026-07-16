// export const defaultSorted = [{ dataField: "asset_no", order: "asc" }];
// export const sizePerPageList = [
//   { text: "50", value: 50 },
//   { text: "100", value: 100 },
//   { text: "150", value: 150 },
// ];

// export const initialFilter = {
//   filter: {
//     // Asset Filters
//     asset_categoryId: [],
//     asset_makeId: [],
//     asset_modelId: [],
//     asset_no: "",
//     registration_no: "",

//     // Employee Filter
//     companyId: [],
//     subsidiaryId: [],
//     departmentId: [],
//     employeeId: [],
//     locationId: [],

//     // Report Filter
//     assetStatus: [],

//     // Date Range
//     acquisitionFrom: "",
//     acquisitionTo: "",
//     expiryFrom: "",
//     expiryTo: "",
//   },
//   sortOrder: "asc",
//   pageSize: 50,
//   pageNumber: 1,
// };

// // Report filter options (Asset Status)
// export const assetStatusOptions = [
//   { value: "all", label: "All" },
//   { value: "assigned", label: "Assigned" },
//   { value: "unassigned", label: "Unassigned" },
// ];

export const defaultSorted = [{ dataField: "asset_no", order: "asc" }];
export const sizePerPageList = [
  { text: "50", value: 50 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
];

export const initialFilter = {
  filter: {
    // Asset Filters
    asset_categoryId: [],
    asset_makeId: [],
    asset_modelId: [],
    asset_no: "",
    registration_no: "",

    // Employee Filter — companyId removed (Company filter excluded)
    subsidiaryId: [],
    departmentId: [],
    employeeId: [],
    locationId: [],

    // Report Filter
    assetStatus: [],

    // Date Range
    acquisitionFrom: "",
    acquisitionTo: "",
    expiryFrom: "",
    expiryTo: "",
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1,
};

// Report filter options (Asset Status)
export const assetStatusOptions = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "unassigned", label: "Unassigned" },
  { value: "disposed", label: "Disposed" },
];