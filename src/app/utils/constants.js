//import { type } from "os";

export class Http {
  HTTP_NOT_FOUND = "404";
  HTTP_INTERNAL_ERROR = "500";
  CREATED = 201;
  OK = 200;
}

export class FormClasses {
  // Buttons
  BUTTON_ADD = "w-100";
  BUTTON_UPDATE = "";
  BUTTON_SAVE = "w-100 mt-7 ";
  BUTTON_BACK = "w-100 mt-7 ";
  BUTTON_DETAIL_LISTING_ADD = " mt-7 ";
  BUTTON_DETAIL_LISTING_REMOVE = "";
  // Variants
  BUTTON_ADD_VARIANT = "primary";
  BUTTON_UPDATE_VARIANT = "";
  BUTTON_SAVE_VARIANT = "primary";
  BUTTON_BACK_VARIANT = "secondary";
  BUTTON_DETAIL_LISTING_ADD_VARIANT = "primary";
  BUTTON_DETAIL_LISTING_REMOVE_VARIANT = "danger";
  // Listing Buttons
  LISTING_BUTTON_VIEW = "btn-icon btn-bg-light btn-active-color-primary ";
  LISTING_BUTTON_EDIT = "btn-icon btn-bg-light btn-active-color-primary ";
  LISTING_BUTTON_DELETE = "btn-icon btn-bg-light btn-active-color-danger ";
  LISTING_BUTTON_VIEW_ICON = "/media/icons/duotune/general/gen019.svg";
  LISTING_BUTTON_EDIT_ICON = "/media/icons/duotune/art/art005.svg";
  LISTING_BUTTON_DELETE_ICON = "/media/icons/duotune/general/gen027.svg";
  LISTING_BUTTON_PAYMENT_RECEIVED_ICON =
    "/media/icons/duotune/files/fil025.svg";
  LISTING_BUTTON_ASSIGN_OFFICER_ICON =
    "/media/icons/duotune/general/gen049.svg";
  // Loader/Spinner
  SPINNER_ANIMATION_SAVE = "border";
  SPINNER_VARIANT_SAVE = "primary ";
  SPINNER_ANIMATION_TABLE = "border";
  SPINNER_VARIANT_TABLE = "primary ";

  // Listing Badge
  BADGE_SUCCESS = "badge badge-light-primary ";
  BADGE_DANGER = "badge badge-light-danger ";
  BADGE_CREATED_AT = "badge badge-light-success ";
  BADGE_UPDATED_AT = "badge badge-light-info fw-bold me-1 ";
  BADGE_CURRENTVEHICLE = "badge badge-light-success mt-2 ";
  BADGE_INSPECTIONSUMMARY = "badge badge-light-primary mt-2 ";
  BADGE_INSPECTIONIMAGES = "badge badge-light-warning mt-2 ";
  BADGE_REQUIREDVEHICLE = "badge badge-light-info mt-2 ";
  BADGE_VEHICLE_DETAIL_MODELS = "badge badge-success ";

  // Dropdown
  DROPDOWN = "mt-5 ";

  // Other Form Elements
  FORM = "form ";
  TEXT_BOX = "form-control form-control-md form-control-solid fs-7 mt-5 ";
  LABEL = "col-form-label required fw-bold fs-6 ";
  LABEL_NON_REQUIRED = "col-form-label fw-bold fs-6 ";
  CHECK_BOX = "form-check-input ";
}

export class RedirectURLs {
  PROFILE = "/profile/view";

  USER = "/users";
  USER_VIEW = "/users/read-user";
  USER_ADD = "/users/create-user";
  USER_EDIT = "/users/update-user";
  USER_VIEW_ALL = "/users/read-all-users";
  USER_VIEW_ALL_RESET_PASSWORD = "/users/read-all-reset-password-users";

  ENQUIRY = "/enquiries";
  ENQUIRY_VIEW = "/enquiries/read-enquiry";
  ENQUIRY_ADD = "/enquiries/create-enquiry";
  ENQUIRY_EDIT = "/enquiries/update-enquiry";
  ENQUIRY_VIEW_ALL = "/enquiries/read-all-enquiries";

  RESOURCE = "/resources";
  RESOURCE_VIEW = "/resources/read-resource";
  RESOURCE_ADD = "/resources/create-resource";
  RESOURCE_EDIT = "/resources/update-resource";
  RESOURCE_VIEW_ALL = "/resources/read-all-resources";

  DEALER = "/dealers";
  DEALER_VIEW = "/dealers/read-dealer";
  DEALER_ADD = "/dealers/create-dealer";
  DEALER_EDIT = "/dealers/update-dealer";
  DEALER_VIEW_ALL = "/dealers/read-all-dealers";

  SOURCE = "/sources";
  SOURCE_VIEW = "/sources/read-source";
  SOURCE_ADD = "/sources/create-source";
  SOURCE_EDIT = "/sources/update-source";
  SOURCE_VIEW_ALL = "/sources/read-all-sources";

  FAR = "/fars";
  FAR_VIEW = "/fars/read-far";
  FAR_ADD = "/fars/create-far";
  FAR_EDIT = "/fars/update-far";
  FAR_VIEW_ALL = "/fars/read-all-fars";

  ENQUIRY_STATUS = "/enquirystatuses";
  ENQUIRY_STATUS_VIEW = "/enquirystatuses/read-enquirystatus";
  ENQUIRY_STATUS_ADD = "/enquirystatuses/create-enquirystatus";
  ENQUIRY_STATUS_EDIT = "/enquirystatuses/update-enquirystatus";
  ENQUIRY_STATUS_VIEW_ALL = "/enquirystatuses/read-all-enquirystatuses";

  CUST_INTEREST = "/custinterests";
  CUST_INTEREST_VIEW = "/custinterests/read-custinterest";
  CUST_INTEREST_ADD = "/custinterests/create-custinterest";
  CUST_INTEREST_EDIT = "/custinterests/update-custinterest";
  CUST_INTEREST_VIEW_ALL = "/custinterests/read-all-custinterests";

  BANK_DETAIL = "/bankdetails";
  BANK_DETAIL_VIEW = "/bankdetails/read-bankdetail";
  BANK_DETAIL_ADD = "/bankdetails/create-bankdetail";
  BANK_DETAIL_EDIT = "/bankdetails/update-bankdetail";
  BANK_DETAIL_VIEW_ALL = "/bankdetails/read-all-bankdetails";

  ENQUIRY_PURPOSE = "/enquirypurposes";
  ENQUIRY_PURPOSE_VIEW = "/enquirypurposes/read-enquirypurpose";
  ENQUIRY_PURPOSE_ADD = "/enquirypurposes/create-enquirypurpose";
  ENQUIRY_PURPOSE_EDIT = "/enquirypurposes/update-enquirypurpose";
  ENQUIRY_PURPOSE_VIEW_ALL = "/enquirypurposes/read-all-enquirypurposes";

  ROLE_ACCESS = "/role-accesses";
  ROLE_ACCESS_VIEW = "/role-accesses/read-role-access";
  ROLE_ACCESS_ADD = "/role-accesses/create-role-access";
  ROLE_ACCESS_EDIT = "/role-accesses/update-role-access";
  ROLE_ACCESS_VIEW_ALL = "/role-accesses/read-all-role-accesses";

  //  VEHICLE_DETAIL = '/vehicle-details'
  //  VEHICLE_DETAIL_VIEW = '/vehicle-details/read-vehicle-detail'
  //  VEHICLE_DETAIL_ADD = '/vehicle-details/create-vehicle-detail'
  //  VEHICLE_DETAIL_EDIT = '/vehicle-details/update-vehicle-detail'
  //  VEHICLE_DETAIL_VIEW_ALL = '/vehicle-details/read-all-vehicle-details'
  //  VEHICLE_DETAIL_VIEW_VARIANT = '/vehicle-details/view-vehicle-variant'
  //  VEHICLE_DETAIL_EDIT_VARIANT = '/vehicle-details/update-vehicle-variant'

  SURVEY = "/surveys";
  SURVEY_VIEW = "/surveys/read-survey";

  SURVEY_VIEW_ALL = "/surveys/read-all-surveys";
  SURVEY_ADD = "/surveys/create-survey";
  SURVEY_EDIT = "/surveys/update-survey";

  SURVEY_VIEW_ALL_GROUPS = "/surveys/read-all-survey-groups";
  SURVEY_VIEW_GROUP = "/surveys/view-survey-groups";
  SURVEY_ADD_GROUP = "/surveys/add-group";
  SURVEY_EDIT_GROUP = "/surveys/update-group";

  SURVEY_VIEW_ALL_PARTS = "/surveys/read-all-survey-parts";
  SURVEY_VIEW_PART = "/surveys/view-survey-parts";
  SURVEY_ADD_PART = "/surveys/add-part";
  SURVEY_EDIT_PART = "/surveys/update-part";

  INSPECTION = "/inspections";
  INSPECTION_VIEW = "/inspections/read-inspection";
  INSPECTION_VIEW_ALL = "/inspections/read-all-inspections";

  VEHICLE_INVENTORY = "/vehicleinventories";
  VEHICLE_INVENTORY_VIEW_ALL =
    "/vehicleinventories/read-all-vehicleinventories";
}

// type spinnerAnimationType = 'border' | 'grow'

export const DateTimeFormats = {
  General1: "MMMM Do YYYY - h:mm a",
  General: "d MMM H:m a",
  ActiveLabel: 'dd-MM-yyyy'
};

export const REGEX = {
  PhoneNumber: /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
};
// export const TOAST_CONFIG: {
//   position:
//     | 'top-start'
//     | 'top-center'
//     | 'top-end'
//     | 'middle-start'
//     | 'middle-center'
//     | 'middle-end'
//     | 'bottom-start'
//     | 'bottom-center'
//     | 'bottom-end'
//   bg: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'
//   closeButton
//   autohide
//   delay
// } = {
//   position: 'bottom-end',
//   bg: 'primary',
//   closeButton: true,
//   autohide: true,
//   delay: 2000,
// }
export const TOAST_BG = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
  dark: "dark",
  light: "light",
};

export const OperationStatus = {
  success: "Operation Successful",
  failed: "Operation Failed",
  pending: "Operation Processing",
};

export const DDL = {
  emptyObject: { label: "", value: "" },
};

export const ENQUIRY = {
  paymentTypes: [
    { label: "Bank", value: "bank" },
    { label: "Cash", value: "cash" },
  ],
  paymentStatuses: [
    { label: "Case Approved", value: "approved" },
    { label: "In Process", value: "in-process" },
    { label: "Not Applied", value: "not-applied" },
  ],
};

// export const MODAL: {
//   Sizes: {small; large; extraLarge}
//   Config: {
//     size?: 'sm' | 'lg' | 'xl'
//     animation?
//     centered?
//     backdrop?: 'static' | true | false
//     scrollable?
//   }
// } = {
//   Sizes: {small: 'sm', large: 'lg', extraLarge: 'xl'},
//   Config: {
//     size: 'lg',
//     animation: true,
//     centered: true,
//     backdrop: true,
//     scrollable: true,
//   },
// }
export const ROLES = {
  SuperAdmin: "Super Admin",
  Admin: "Admin",
};
export const DB_COLUMNS = {
  default: [
    "_id",
    "isDeleted",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  defaultUpdate: [
    "isDeleted",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  roleAccessUpdate: [
    "slug",
    "isDeleted",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  makeUpdate: ["isDeleted", "createdAt", "createdBy", "updatedAt", "updatedBy"],
  modelUpdate: ["isDeleted"],
  userUpdate: [
    "password",
    "isResetPassword",
    "role",
    "dealerId",
    "isDeleted",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  userSetupUpdate: [
    "isResetPassword",
    "isDeleted",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
};

export const SURVEY = {
  groupTypes: [
    { label: "Image", value: "img" },
    { label: "List", value: "list" },
  ],
  questionTypes: [
    { label: "Text Box", value: "text" },
    { label: "Dropdown List", value: "dropdown" },
  ],
};

//Week days data
export const WEEK_DAYS = [
  {
    label: "Monday",
    value: 1
  },
  {
    label: "Tuesday",
    value: 2
  },
  {
    label: "Wednesday",
    value: 3
  },
  {
    label: "Thursday",
    value: 4
  },
  {
    label: "Friday",
    value: 5
  },
  {
    label: "Saturday",
    value: 6
  },
  {
    label: "Sunday",
    value: 7
  }
]

export const ATTENDANCE_TYPE = [
  {
    label: "Select",
    value: -1
  },
  {
    label: "Regular Attendance",
    value: 1
  },
  {
    label: "Auto Present Attendance",
    value: 2
  },
]

//Validation Messages for form
export const VALIDATION_MESSAGES = {
  required: 'Required',
  validNumber: 'Must be a valid number',
  maxTwoDigits: 'Maximum two digit number allowed',
  maxThreeDigit: 'Maximum three digit number allowed',
  minZeroValue: 'Should not be less than 0',
  minOneValue: 'Should not be less than 1',
  maxHundredValue: 'Should not be greater than 100',
  maxNineHundredNinetyNineValue: 'Should not be greater than 999',
  invalidUrl : 'Invalid URL',
  invalidEmail : 'Invalid Email',
  minAgeEighteenValue: 'Should not be less than 18',
  maxAgeNinetyNineValue: 'Should not be greater than 99',
  endDateMustBeAfterStartDate: "End date must be after start date",
  minAgeFifteenValue:'Must be at least 15 years old',
}

//Server Response Messages
export const SERVER_MESSAGES = {
  insertedSuccess: 'Record created Successfully!',
  insertedFail: 'Unable to Insert',
  updatedSuccess: 'Record updated Successfully!',
  updatedFail: 'Unable to Update',
  deletedSuccess: 'Record deleted Successfully!',
  deletedFail: 'Unable to Delete: This record is already used in Transaction forms',
  processSuccessful: 'Process executed Successfully!',
  pdfFail:"No data found!",
  csvFail:"No data found!",
  excelFail:"No data found!",
  correctDateRange:"Please select correct date range",
  postedSuccess: 'Record posted Successfully!',
  holdSuccess: 'Record holded Successfully!',
  closedSuccess: 'Record closed Successfully!',
  fileFail: 'File not Uploaded!',
  emailFail: "Email has failed!",
  emailSuccess: "Email sent Successfully!",

}


export const WEEK_DAY_STRING = {
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
}

export const GROSS_TO_BASIC_CALCULATION_TYPE_DROPDOWN = [
  { label: 'Select', value: '-1' },
  { label: '% Of Gross', value: '% Of Gross' },
  { label: 'Fixed Amount', value: 'Fixed Amount' },
]

export const BASIC_TO_GROSS_CALCULATION_TYPE_DROPDOWN = [
  { label: 'Select', value: '-1' },
  { label: '% Of Basic', value: '% Of Basic' },
  { label: 'Fixed Amount', value: 'Fixed Amount' },
]

export const DEFAULT_CALCULATION_TYPE_DROPDOWN = [
  { label: 'Select', value: '-1' },
  { label: 'Fixed Amount', value: 'Fixed Amount' },
]

export const DROPDOWN = {
  "Basic to Gross": BASIC_TO_GROSS_CALCULATION_TYPE_DROPDOWN,
  "Gross to Basic": GROSS_TO_BASIC_CALCULATION_TYPE_DROPDOWN,
}

export const accountType = {
   Assets : 1,
   Liabilities : 2,
   Equity : 3,
   Revenue : 4,
   Expenses: 5,
};