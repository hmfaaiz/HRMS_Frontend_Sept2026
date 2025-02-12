export const CustomerStatusCssClasses = ["danger", "success", "info", ""]
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""]
export const CustomerTypeCssClasses = ["success", "primary", ""]
export const CustomerTypeTitles = ["Business", "Individual", ""]
export const defaultSorted = [{ dataField: "id", order: "asc" }]
export const sizePerPageList = [
  { text: "50", value: 50 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
]

export const initialFilter = {
  filter: {
    subsidiaryId: "",
    departmentId: "",
    reportTo: "",
    gradeId: "",
    designationId: "",
    locationId: "",
    employeeId: "",
    dojFrom: "",
    dojTo: "",
    docFrom: "",
    docTo: "",
    dobFrom: "",
    dobTo: "", gratuity_member: "", overtime_allowance: "", eobi_member: "", social_security_member: "",
    salary_type: "", operator: ""
    , amount: "",
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1
}