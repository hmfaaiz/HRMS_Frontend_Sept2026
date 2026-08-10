export const defaultSorted = [{ dataField: "id", order: "asc" }]
export const sizePerPageList = [
  { text: "50", value: 50 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
  { text: "200", value: 200 },

]

export const initialFilter = {
  filter: {
    searchQuery: "",
    subsidiaryId: null,
    payrollGroupId: null,
    bonusTypeId: null,
    payrollMonthId: null,
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1,
}