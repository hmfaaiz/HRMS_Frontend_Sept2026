export const CustomerStatusCssClasses = ["danger", "success", "info", ""];
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""];
export const CustomerTypeCssClasses = ["success", "primary", ""];
export const CustomerTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
  },
  pdf: false,
  csv: false,
  excel: false,
  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
  moduleType: 1,
};

export const accountType = [
  {
    label: "Assets",
    value: 1,
  },
  {
    label: "Liabilities",
    value: 2,
  },
  {
    label: "Equity",
    value: 3,
  },
  {
    label: "Revenue",
    value: 4,
  },
  {
    label: "Expenses",
    value: 5,
  },
];
