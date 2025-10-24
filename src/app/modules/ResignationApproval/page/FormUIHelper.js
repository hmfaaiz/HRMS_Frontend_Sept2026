export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
];

export const initialFilter = {
  filter: {
    reportingLevel: "1",
    requestStatus: "P",
    requestRaisedFor: "",
    date: { from: "", to: "" },
    requestDate: { from: "", to: "" },
  },

  sortOrder: "asc",
  pageSize: 5,
  pageNumber: 1,
};

export const requestFilter = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Pending",
    value: "P",
  },
  {
    label: "Approved",
    value: "A",
  },
  {
    label: "Rejected",
    value: "R",
  },
];
