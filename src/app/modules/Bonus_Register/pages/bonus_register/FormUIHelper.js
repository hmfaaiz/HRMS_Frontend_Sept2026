export const defaultSorted = [{ dataField: "Id", order: "asc" }];

export const sizePerPageList = [
  { text: "50", value: 50 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
];

export const initialFilter = {
  filter: {
    subsidiaryId: "",
    bonusTypeId: "",
    monthId: "",
    departmentId: "",
    groupBy: "",
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1,
};

export const groupByOptions = [
  { label: "No Grouping", value: "" },
  { label: "Department Wise", value: "departmentName" },
//   { label: "Designation Wise", value: "designationName" },
  { label: "Grade Wise", value: "gradeName" },
  { label: "Location Wise", value: "locationName" },
//   { label: "Bonus Type Wise", value: "bonusTypeName" },
];