export const initialValues = {
  id: undefined,
  companyId: 1,
  employeeId: "",
  employeeName: "",
  employeeDesignation: "",
  purposeOfTravel: "",
  projectName: "General",
  travelType: "",
  accommodationRequired: false,
  hotelEntitlementAmount: 0,
  selfEntitlementAmount: 0,
  travelDetails: [
    {
      fromLocation: "",
      toLocation: "",
      fromDate: "",
      toDate: "",
      modeOfTravel: "",
      classOfTravel: "",
      accommodationRequired: false,
      hotelEntitlement: "",
      hotelEntitlementAmount: 0,
      selfEntitlement: "",
      selfAmount: 0,
    },
  ],
  request_status: "A",
};

export const initialFilter = {
  filter: {
    searchQuery: "",
    request_status: ["P"],
    pendingHrms: true,
  },
  sortOrder: "ASC",
  pageSize: 10,
  pageNumber: 1,
};

export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "25", value: 25 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

export const defaultSorted = [{ dataField: "id", order: "asc" }];
