// pages/Bonus_Policy/FormUIHelpers.js
export const defaultSorted = [{ dataField: "Id", order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
  },
  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
  subsidiaryId: "",
  isActive: true,
};

export const SALARY_MONTH_OPTIONS = [
  { value: "CURRENT_SALARY", label: "Current Salary" },
  { value: "SPECIFIC_MONTH", label: "Specific Month" },
];



export const buildEmptySlab = () => ({
  serviceDurationFrom: "",
  serviceDurationTo: "",
  paymentCriteriaId: null,
});