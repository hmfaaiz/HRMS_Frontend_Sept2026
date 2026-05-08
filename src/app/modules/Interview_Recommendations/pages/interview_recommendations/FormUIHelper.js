export const defaultSorted = [{ dataField: "id", order: "asc" }];

export const sizePerPageList = [
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "50", value: 50 },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
  },
  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
};