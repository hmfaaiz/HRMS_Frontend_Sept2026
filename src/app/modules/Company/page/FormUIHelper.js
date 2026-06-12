export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

export const fiscalMonthList = [
  {
    label: "January",
    value: 1,
  },
  {
    label: "February",
    value: 2,
  },
  {
    label: "March",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "May",
    value: 5,
  },
  {
    label: "June",
    value: 6,
  },
  {
    label: "July",
    value: 7,
  },
  {
    label: "August",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "October",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "December",
    value: 12,
  },
];

export const moduleList = [
  {
    label: "Employee",
    key: "employee",
    value: false,
  },
  {
    label: "Leave",
    key: "leave",
    value: false,
  },
  {
    label: "Attendance",
    key: "attendance",
    value: false,
  },
  {
    label: "Payroll",
    key: "payroll",
    value: false,
  },
  {
    label: "Recruitment",
    key: "recruitment",
    value: false,
  },
  {
    label: "Appraisal",
    key: "appraisal",
    value: false,
  },
  {
    label: "Task",
    key: "task",
    value: false,
  },
   {
    label: "Manpower Budget",
    key: "Manpower Budget",
    value: false,
  },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
    subsidiaryId: "",
  },

  sortOrder: "asc",
  pageSize: 10,
  pageNumber: 1,
};
