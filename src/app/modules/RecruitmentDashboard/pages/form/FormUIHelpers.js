export const CustomerStatusCssClasses = ["danger", "success", "info", ""]
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""]
export const CustomerTypeCssClasses = ["success", "primary", ""]
export const CustomerTypeTitles = ["Business", "Individual", ""]
export const defaultSorted = [{ dataField: "id", order: "asc" }]
export const sizePerPageList = [


  { text: "1", value: 1 },
  // { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
]


export const initialFilter = {
  filter: {
    vacancyStatusId: null,
    searchText: "",
    departmentId: null,
    designationId: null,
    gradeId: null,
    locationId: null,
    countryId: null,
    cityId: null,
    appointmentTypeId: null,


  },


  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1
}