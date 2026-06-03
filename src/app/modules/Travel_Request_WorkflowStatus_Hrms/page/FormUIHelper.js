export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
];

export const initialFilter = {
  filter: {
    subsidiaryId: null,
    departmentId: null,
    requestBelongTo: null,
    approvalBelongTo: null,
    requestStatus: null,
    travelTypes: null,
    travelDate: { from: "", to: "" },
    requestDate: { from: "", to: "" },
  },

  sortOrder: "asc",
  pageSize: 5,
  pageNumber: 1,
};

export const requestFilter = [
   {
    label: "All",       
    value: null,
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
