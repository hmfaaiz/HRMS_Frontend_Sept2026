import moment from "moment";
import { DateTimeFormats } from "./constants";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
const {
  differenceInDays,
  format,
  differenceInMonths,
  isValid,
  parseISO,
} = require("date-fns");
export const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

export const getDate = (
  date,
  format = DateTimeFormats.General,
  noDateFoundMessage = "-"
) => (date ? moment(date).format("lll") : noDateFoundMessage);

export const getTime = (
  date,
  format = DateTimeFormats.General,
  noDateFoundMessage = "-"
) => (date ? moment(date).format("LT") : noDateFoundMessage);

export const getCurrentTime = () => moment().format("LT");

/**
 *
 * Get Class name according to value and error
 *
 * @param {string|number} error
 * @param {string|number} value
 * @returns
 */
export const getClassName = (error, value) => {
  if (error && !value) {
    return "form-control is-invalid";
  } else if (!error && value) {
    return "form-control is-valid";
  }
  return "form-control";
};

/**
 *
 * Get Diff in days between two provided dates
 *
 * @param {Date|String} startDate
 * @param {Date|String} endDate
 * @returns
 */
export const getDateDiffInDays = (startDate, endDate) => {
  if (startDate && endDate) {
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  }
  return 0;
};

export const getFileName = (fileName) => {
  if (fileName) {
    if (fileName.includes("---")) {
      return fileName
        .split("---")[1]
        ?.split("-")
        ?.join(" ");
    } else {
      return fileName.split("-")?.join(" ");
    }
  }
  return "";
};

/**
 *
 * function to return formatted date
 *
 * @param {Date|String} date
 * @param {String} dateFormat
 * @returns
 */
export const formatDates = (date, dateFormat = null) => {
  if (date) {
    return format(new Date(date), dateFormat || "dd-MMM-yyyy");
  } else {
    return null;
  }
};

/**
 *
 * function to return Uploaded file Url
 *
 * @param {String} fileName
 * @returns
 */
export const getUploadUrl = (fileName) => {
  if (fileName) {
    return UPLOAD_URL + fileName;
  }
  return "";
};

export const formatNumberWithCommas = (number) => {
  if (number == null) return ""; // Handle null or undefined
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const amountLimit = (value) => {
  // Convert the input to a string and check its length
  if (value.length > 8) {
    return value.slice(0, 8); // Limit the length
  }
  return value; // Return the original value if within limit
};

export const amountLimitDynamic = (value, limitVal) => {
  // Convert the input to a string and check its length
  if (value.length > limitVal) {
    return value.slice(0, limitVal); // Limit the length
  }
  return value; // Return the original value if within limit
};

// export const percentageLimit = (value,) => {
//   // Convert the input to a string and check its length
//    .matches(/^(100|[1-9]?[0-9])(\.[0-9]{1,2})?$/, 'Must be a valid percentage (0-100) with up to 2 decimal places')
//   return value; // Return the original value if within limit
// };

export const formatDate = (dateInput) => {
  if (dateInput) {
    return format(new Date(dateInput), "dd-MMM-yyyy h:mm:ss a");
  } else {
    return "---";
  }
};

export const getDateDiffInMonths = (startDate, endDate) => {
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  if (startDate && endDate) {
    return differenceInMonths(new Date(endDate), new Date(startDate));
  }
  return 0;
};

export const amountFormat = (val, isDecimal = false) => {
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: isDecimal ? 2 : 0,
  });
};

export const amountFormatWithoutRounding = (val) => {
  if (val == null || isNaN(val)) return "0";
  
  const parts = val.toString().split(".");
  const integerPart = Number(parts[0]).toLocaleString("en-US");
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
};



export const formatTime = (value) => {
  if (!value) return "";
 
  const cleaned = value.replace(/\D/g, "").slice(0, 4);
  if (cleaned.length <= 2) return cleaned;
 
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
};

export const setDefaultSubsidiary = (value, allSubsidiaryList, defaultValue, callback) => {
  if (!Array.isArray(allSubsidiaryList)) return null;
  let result;
  
  if (value) {
    result = allSubsidiaryList.find((el) => el?.value === value) || null;
  } else {
    result = allSubsidiaryList.find((el) => el?.value === defaultValue) || null;
  }
  
  // Use setTimeout to defer the callback execution until after rendering
  if (typeof callback === 'function' && !value) {
    setTimeout(() => {
      callback(result);
    }, 50);
  }
  
  return result;
};

