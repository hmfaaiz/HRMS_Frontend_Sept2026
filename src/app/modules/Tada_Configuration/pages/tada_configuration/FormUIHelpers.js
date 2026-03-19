export const initialValues = {
  id: undefined,
  companyId: 1,
  subsidiaryId: 1,
  gradeId: "",
  designationId: "",
  isGradeWise: false,
  isDesignationWise: false,
  modeOfTransportIds: [],
  hotelEntitlementIds: [],
  hotelEntitlementSelfAmount: 0,
  dailyAllowanceAmount: 0,
  taxiFareAmount: 0,
  isActive: true,
};

export const initialFilter = {
  filter: {
    searchQuery: ""
  },
  sortOrder: "ASC",
  pageSize: 10,
  pageNumber: 1
};

export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "25", value: 25 },
  { text: "50", value: 50},
  { text: "100", value: 100},
]

export const defaultSorted = [{ dataField: "id", order: "asc" }];
