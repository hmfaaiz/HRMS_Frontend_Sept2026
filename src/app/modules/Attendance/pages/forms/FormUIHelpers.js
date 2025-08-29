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
  pageNumber: 1,
  pdf2:false,
  csv:false,
  excel:false,

}

export const savingFields = ['employeeId', 'comments', 'attDateIn', 'attDateOut', 'timeIn', 'timeOut', 'Id',]


export const attendanceStatusMap = {
  "Absent (Shift is yet to start)": "att-absent-att",
  "Absent (Off Day)": "att-absent-att",
  "Absent (Holiday)": "att-absent-att",
  Absent: "att-absent-att",
  "H.D('LeaveCode') + H.D(A)": "att-HD",
  "H.D(P) + H.D(A)": "att-HD",
  "H.D(P) + H.D('LeaveCode')": "att-HD",
  "Holiday (H.D(Present))": "att-HD",
  "Day Off (H.D(Present))": "att-HD",
  // LeaveCode: "",
  "Holiday (Present)": "att-dayoff",
  "Day Off (Present)": "att-dayoff",
  "Day Off": "att-dayoff",
  Holiday: "att-dayoff",
  Present: "att-present",
  "Present (On-Time)": "att-present",
  "Present (On Time, Early-Out)": "att-presents",
  "Present (Early Out)": "att-presents",
  "Present (Late-In)(Holiday)": "att-presents",
  "Present (Late-In)(Day Off)": "att-presents",
  "Present (Late-In, Early-Out)": "att-presents",
  "Present (Late-In)": "att-presents",
};
