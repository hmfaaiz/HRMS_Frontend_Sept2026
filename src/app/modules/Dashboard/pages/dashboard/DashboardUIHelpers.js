export const CustomerStatusCssClasses = ["danger", "success", "info", ""];
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""];
export const CustomerTypeCssClasses = ["success", "primary", ""];
export const CustomerTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "createdAt", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
];

export const sizePerPage = [{ text: "20", value: 20 }];
export const initialFilter = {
  filter: {
    searchQuery: "",
  },

  sortOrder: "name",
  pageNumber: 1,
  pageSize: 10,
};

export const initialvehicleFilter = {
  filter: {
    searchQuery: "",
    fromLogNo: "",
    toLogNo: "",
  },

  sortOrder: "name",
  pageNumber: 1,
  pageSize: 20,
  // centerId: null,
};
