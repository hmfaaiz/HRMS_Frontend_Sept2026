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
    monthId: "",
    groupBy: ""
  },
  sortOrder: "asc",
  pageSize: 50,
  pageNumber: 1
}

export const groupByOptions = [
  {label: 'No Grouping', value: ''},
  {label: 'Location Wise', value: 'locationName'},
  {label: 'Department Wise', value: 'departmentName'},
  {label: 'Grade Wise', value: 'gradeName'},
  {label: 'Payroll Group Wise', value: 'payrollGroup'},
  {label: 'Payment Mode Wise', value: 'paymentModeName'},
]