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
    attendanceType: "",
    employeeId: "",
    from: "",
    to: "",
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1
}