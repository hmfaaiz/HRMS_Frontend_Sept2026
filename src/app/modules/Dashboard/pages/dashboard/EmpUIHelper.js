export const leaveApprovalFilter = {
  filter: {
    reportingLevel: "1",
    requestStatus: "P",
    requestRaisedFor: "",
    leaveTypes: "",
    leaveDate: { from: "", to: "" },
    requestDate: { from: "", to: "" },
  },

  sortOrder: "asc",
  pageSize: 5,
  pageNumber: 1,
};

export const attendanceApprovalFilter = {
  filter: {
    reportingLevel: "1",
    requestStatus: "P",
    requestRaisedFor: "",
    date: { from: "", to: "" },
    requestDate: { from: "", to: "" },
  },

  sortOrder: "asc",
  pageSize: 100,
  pageNumber: 1,
};
export const loanApprovalFilter = {
  filter: {
    reportingLevel: "1",
    requestStatus: "P",
    requestRaisedFor: "",
    requestDate: { from: "", to: "" },
  },

  sortOrder: "asc",
  pageSize: 100,
  pageNumber: 1,
};

export const loanDetailFilter = {
  filter: {
    searchQuery: "",
  },

  sortOrder: "asc",
  pageSize: 100,
  pageNumber: 1,
};

export const leaveDetailFilter = {
  filter: {
    searchQuery: "",
    from: "",
    to: "",
  },

  sortOrder: "asc",
  pageSize: 100,
  pageNumber: 1,
};

export const PeriodType = {
  "1": "Next Month",
  "2": "Previous Month",
  "3": "Current Month",
  "4": "Current Year",
  "5": "Next Year",
};
