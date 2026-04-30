export const CustomerStatusCssClasses = ["danger", "success", "info", ""]
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""]
export const CustomerTypeCssClasses = ["success", "primary", ""]
export const CustomerTypeTitles = ["Business", "Individual", ""]

// For table default sorting
export const defaultSorted = [
  { dataField: "Id", order: "asc" }
];

// Pagination sizes
export const sizePerPageList = [
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

// Initial filter state
export const initialFilter = {
  filter: {
    searchQuery: "",
    taskStatus: "",
  },

  sortOrder: "asc",
  sortField: "", 
  pageSize: 10,
  pageNumber: 1,

  // Employee based filters
  employeeId: "",
  departmentId: "",
  subsidiaryId: "",

  // UI labels (for dropdowns)
  employeeLabel: "",
  departmentLabel: "",
  subsidiaryLabel: "",
};
