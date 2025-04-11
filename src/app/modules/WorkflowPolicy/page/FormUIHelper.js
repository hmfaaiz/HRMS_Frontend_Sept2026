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

  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
};

export const defaultSortedDesig = [{ dataField: "id", order: "asc" }];
export const sizePerPageListDesig = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

export const initialFilterDesig = {
  filter: {
    searchQuery: "",
    workflowType: "",
  },

  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
};
