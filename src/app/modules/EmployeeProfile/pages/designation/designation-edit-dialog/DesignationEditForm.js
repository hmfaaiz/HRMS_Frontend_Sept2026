import React, { useEffect, useState, useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, MaskInput, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { KeyboardArrowDown } from "@material-ui/icons";
import {
  fetchAllCountry,
  fetchAllCity,
  fetchAllSubCenter,
  getLatestBookingNo,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllSubsidiaryData,
  fetchAllEmployeeShifts,
  getLatestTableId,
  fetchAllEmployeesWithNoPermissionData
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import axios from 'axios';
import { red } from "@material-ui/core/colors";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Link } from "@material-ui/core";
import { useDesignationUIContext } from "../DesignationUIContext";
import MaskedInput from "react-text-mask";
import { getDateDiffInDays } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { toast } from "react-toastify";

export const USERS_URL = process.env.REACT_APP_API_URL;
const currentDate = new Date();
const minDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
const minYearDate = new Date(1900, 0, 1);
// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const profileValidation = Yup.object().shape(
  {
    deligationId: Yup.string()
      .when('requireDeligation', {
        
        is: true, // Condition: when 'requireDeligation' is true
        then: Yup.string().nullable().required(VALIDATION_MESSAGES.required), // Apply 'required' validation
        otherwise: Yup.string().nullable(), // No validation if 'requireDeligation' is false
      }),
    codeAuto: Yup.string()
      .nullable()
      .matches(/^\d{6}$/, 'Must be exactly 6 digits'),
      // .required('Required*'),
    firstName: Yup.string()
      .required("Required*"),
    lastName: Yup.string()
      .required("Required*"),
    middleName: Yup.string()
      .nullable(),
    // .required("Required*"),
    employeeCode: Yup.string()
      .nullable()
      .required("Required*")
      .max(20, "Employee code must be at most 20 characters long"),
    title: Yup.string()
      .required("Required*"),
    subsidiaryId: Yup.string()
      .required("Required*"),
    gradeId: Yup.string()
      .required("Required*"),
    designationId: Yup.string()
      .required("Required*"),
    departmentId: Yup.string()
      .required("Required*"),
    // teamId: Yup.string()
    //   .required("Required*"),
    payrollGroupId: Yup.string()
      .required("Required*"),
    // regionId: Yup.string()
    //   .required("Required*"),
    maritalStatus: Yup.string()
      .nullable() // Allows null values
      .required("Required*"),
    religionId: Yup.string()
      .required("Required*"),
    // nationality: Yup.string()
    //   .required("Required*"),

    gender: Yup.string()
      .required("Required*"),


    locationId: Yup.string()
      .required("Required*"),

    // countryId: Yup.string()
    //   .required("Required*"),

    // cityId: Yup.string()
    //   .required("Required*"),


    employeeTypeId: Yup.string()
      .required("Required*"),

    dateOfJoining: Yup.date()
      // .max(currentDate, 'Date of joining cannot be in the future')
      .nullable()
      .test('dateOfBirth', 'Date of joining must be after the date of birth', function (value) {
        const { dateOfBirth } = this.parent; // Access the value of min_year
        return value > dateOfBirth; // Ensure max_year is greater than min_year
      })
      .required("Required*"),


    passportExpiry: Yup.date()
      .nullable()
      .min(currentDate, 'Passport expiry must be a future date')
      .typeError('Passport expiry must be a valid date'),

    drivingLicenseExpiry: Yup.date()
      .nullable()
      .min(currentDate, 'ID Card Expiry must be a future date')
      .typeError('ID Card Expiry must be a valid date'),

    // Other fields...

    lastReviewDate: Yup.date()
      .max(currentDate, 'Last review date cannot be in the future')
      // .required("Required*")
      .nullable(),

    nextReviewDate: Yup.date()
      .min(currentDate, 'Next review date must be in the future') // Ensure it's in the future
      .nullable()
      .when('lastReviewDate', (lastReviewDate, schema) => {
        return lastReviewDate
          ? schema.min(lastReviewDate, 'Next review date cannot be earlier than last review date')
          : schema; // Return the original schema if lastReviewDate is not present
      }),

    dateOfConfirmation: Yup.date()
      .nullable()
      .when('dateOfJoining', (dateOfJoining, schema) => {
        return dateOfJoining
          ? schema.min(dateOfJoining, 'Date of confirmation cannot be earlier than the date of joining')
          : schema;
      }),
    dateOfConfirmationDue: Yup.date()
      .nullable()
      .when('dateOfJoining', (dateOfJoining, schema) => {
        return dateOfJoining
          ? schema.min(dateOfJoining, 'Date confirmation due cannot be earlier than date Of Joining')
          : schema;
      }),
    dateOfConfirmationEnter: Yup.date()
      .nullable()
      .when('dateOfConfirmationDue', (dateOfConfirmationDue, schema) => {
        return dateOfConfirmationDue
          ? schema.min(dateOfConfirmationDue, 'Date confirmation extended cannot be earlier than date confirmation due')
          : schema;
      }),
    dateOfContractExpiry: Yup.date()
      .nullable()
      .when('dateOfConfirmationEnter', (dateOfConfirmationEnter, schema) => {
        return dateOfConfirmationEnter
          ? schema.min(dateOfConfirmationEnter, 'Contract expiry date cannot be earlier than date confirmation extended')
          : schema;
      }),
    nic_no: Yup.string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, 'ID Card No must be in the format 12345-6789012-3')
      .required('Required*'),

    passportNo: Yup.string()
    .nullable()
    .max(15, 'Passport number must be at most 15 characters'),
    // on instruction of Mr. Mubin
      // .matches(/^\d{15}$/, 'Passport number must be exactly 15 digits long and contain only digits.'),
    //.required('ID Card No is required'), // Make it required if necessary

    email_official: Yup.string()
      .nullable() // Allows null values
      .email('Invalid email address') // Validates email format
      .notRequired(), // Optional: make it required

    email_personal: Yup.string()
      .nullable() // Allows null values
      .email('Invalid email address') // Validates email format
      .notRequired(), // Optional: make it required

    phone_cell: Yup.string()
      .nullable() // Allows null values
      .matches(/^0[0-9]*$/, 'Phone number must start with 0 and contain only digits') // Must start with 0 and contain only digits
      .max(15, "Employee code must be at most 15 characters long")
      .notRequired(), // Make it optional if you want

    phone_home: Yup.string()
      .nullable() // Allows null values
      .matches(/^0[0-9]*$/, 'Phone number must start with 0 and contain only digits') // Must start with 0 and contain only digits
      .max(15, "Employee code must be at most 15 characters long")
      .notRequired(), // Make it optional if you want

    phone_official: Yup.string()
      .nullable() // Allows null values
      .matches(/^0[0-9]*$/, 'Phone number must start with 0 and contain only digits') // Must start with 0 and contain only digits
      .max(15, "Employee code must be at most 15 characters long")
      .notRequired(), // Make it optional if you want

    dateOfBirth: Yup.date()
      .nullable()
      .typeError('Invalid date format')
      .required('Required*'),
    // .max(currentDate, 'Date of birth cannot be in the future')
    // .max(minDate, 'You must be at least 18 years old')
    // .min(minYearDate, 'Date of birth cannot be earlier than January 1, 1900'),


    defaultShiftId: Yup.string()
      .nullable()
      .required('Required*'),

    departmentId: Yup.string()
      .nullable()
      .required('Required*'),

    // reportTo: Yup.string().required('Required'),

    // profile_image: Yup.string().required('Required'),
    profile_image: Yup.string().when('imagePolicy', {
      is: true, // If imagePolicy is true, apply 'required'
      then: Yup.string().required('Profile image is required'),
      otherwise: Yup.string(),
    }),
    approvedForPayroll: Yup.boolean()
      .nullable()
      .oneOf([true, false], 'Required*'), // Ensures the value is either true or false
    // .required('Required*'),


    additional_summary: Yup.string()
      .required("Required*"),

  },



).test('check-marital-status', 'Invalid marital status for selected title', function (value) {
  // if (title === 'Mrs.' && maritalStatus === '261') {
  const { title, maritalStatus, gender } = value;

  // Check conditions based on title // 196 == Single
  if (title === 'Mrs.' && maritalStatus !== '267') { //married

    return this.createError({ path: 'maritalStatus', message: 'Mrs. only for Married' });
  }

  if (title === 'Mrs.' && maritalStatus === '266') { //single
    return this.createError({ path: 'maritalStatus', message: 'Mrs. cannot be single.' });
  }

  if ((title == 'Mrs.' || title == 'Ms.') && gender == 'Male') {
    return this.createError({ path: 'gender', message: 'Mrs. Ms. cannot be male.' });
  }

  // if ((title === 'Mr.' || title === 'Dr.' || title === 'Professor.' || title === 'Captain') && gender === 'Female') {
  //   return this.createError({ path: 'gender', message: 'Mr. cannot be female.' });
  // }

  if ((title === 'Mr.') && gender === 'Female') {
    return this.createError({ path: 'gender', message: 'Mr. cannot be female.' });
  }


  // if (title === 'Mr.' && maritalStatus != 266 && maritalStatus != 267 && maritalStatus != 269) { //divorced

  //   return this.createError({ path: 'maritalStatus', message: 'Mr. cannot be female.' });
  // }
  if (title === 'Mr.' && maritalStatus == 268 ) { //Widow

    return this.createError({ path: 'maritalStatus', message: 'Mr. cannot be widow.' });
  }
  
  if (title === 'Ms.' && maritalStatus == 267 ) {

    return this.createError({ path: 'maritalStatus', message: 'Ms. only for single woman.' });
  }
  



  return true; // No error
});



// Step 1: Set up state to manage visibility

export function DesignationEditForm({
  saveEmployeeProfile,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
  id
}) {

  const designationUIContext = useDesignationUIContext()
  const DesignationUIProps = useMemo(() => {
    return {
      newSkillButtonClick: designationUIContext.newSkillButtonClick,
      newIncidentButtonClick: designationUIContext.newIncidentButtonClick,
      newWorkExperienceButtonClick: designationUIContext.newWorkExperienceButtonClick,
      newContactButtonClick: designationUIContext.newContactButtonClick,
      newAcademicButtonClick: designationUIContext.newAcademicButtonClick,
      newDesignationButtonClick: designationUIContext.newDesignationButtonClick,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
    }
  }, [designationUIContext])

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);


  const [defDept = null, setDefaultDept] = useState(null);
  const [defchildMenus = null, setDefaultChildMenus] = useState(null);
  const [defchildTeamMenus = null, setDefaultChildTeamsMenus] = useState(null);
  const [defchildRegionMenus = null, setDefaultChildRegionMenus] = useState(null);
  const [defchildReligionMenus = null, setDefaultChildReligionMenus] = useState(null);
  const [defchildEmptypeMenus = null, setDefaultChildEmpTypeMenus] = useState(null);
  const [defchildLocationMenus = null, setDefaultChildLocationMenus] = useState(null);
  const [defMaritalStatus = null, setDefaultMaritalStatus] = useState(null);

  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  const [joiningDateSelected, setJoiningDate] = useState(null);


  const [confirmationDateSelected, setConfirmationDate] = useState(null);
  const [disabledConfirmationDateSelected, setDisabledConfirmationDate] = useState(false);


  const [confirmationDueDateSelected, setConfirmationDueDate] = useState(null);
  const [disbaledConfirmationDueDateSelected, setDisbledConfirmationDueDate] = useState(false);


  const [confirmationEnterDateSelected, setConfirmationEnterDate] = useState(null);
  const [disbaledConfirmationEnterDateSelected, setDisbledConfirmationEnterDate] = useState(false);

  const [contractExpirtyDateSelected, setContractExpiryDate] = useState(null);
  const [disabledContractExpirtyDateSelected, setDisabledContractExpiryDate] = useState(false);


  const [DOBDateSelected, setDOBDate] = useState(null);
  const [RetirementSelected, setDRetirmentDate] = useState(null);

  const [deflastReviewDate, setlastReviewDate] = useState(null);
  const [defnextReviewDate, setnextReviewDate] = useState(null);
  const [defdrivingLicenseExpiry, setdrivingLicenseExpiry] = useState(null);
  const [defpassportExpiry, setpassportExpiry] = useState(null);
  const [deflicenseExpiryDate, setlicenseExpiryDate] = useState(null);

  const [profile_image, setImage] = useState(toAbsoluteUrl("/media/logos/defaultImg.png"));
  const [file, setFile] = useState('');
  // ================ Getting list from DB Stored Procedure

  const [workExperienceList, setworkExperienceList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [skillsList, setSkillList] = useState([]);
  const [incidentList, setIncidentList] = useState([]);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  //==================== END
  const [defEmpDesingaton = null, setDefualtEmpDesignation] = useState(null);
  const [defcycleType = null, setcycleType] = useState(null);
  const [defcontractType = null, setcontractType] = useState(null);

  const [defEmployeeReportTo = null, setEmployeeReportToDefault] = useState(null);
  const [defEmployeeGrade = null, setDefualtEmployeeGrade] = useState(null);
  const [defContactList = null, setDefaultContactList] = useState([{ relation_name: '', contactNo: '', relation_text: '' }]);
  const [currentDate, setCurrentDate] = useState('');
  const [deferrors, setErrors] = useState({});
  const [defProbationPolicyMonth, setDefaultProbationPolicyMonth] = useState({});
  const [defContractExpiryPolicy, setDefaultCnotractExpiryPolicy] = useState({});
  const [defemployeeStatus = null, setDefemployeeStatus] = useState(null);
  const [profilePolicy, setProfilePolicy] = useState(null);
  const [minAgeLimin, setMinAgeLimin] = useState(null);
  const [maxAgeLimin, setMaxAgeLimin] = useState(null);
  const [hidehideRetirementAgeDate, setHidehideRetirementAgeDate] = useState(false);
  const [hideContractExpDate, setHideContractExpDate] = useState(true);
  const [disableConfDueDate, setDisableConfDueDate] = useState(false);
  const [defEmployeeCode, setEmployeeCode] = useState('');
  const [defCodeAuto, setCodeAuto] = useState('');
  const [defCodePrefixo, setCodePrefix] = useState('');
  const [imagePolicy, setImagePolicy] = useState(false)
  const [isImageReq, setIsImageReq] = useState(false)
  const [imgAlreadySet, setImgAlreadySet] = useState(false)
  const [allEmpTypes, setAllEmpTypes] = useState([])
  const scrollRef = useRef(null);
  //off for temp
  // useEffect(() => {
  //   if (user.Id) {

  //     if (user.employeeTypeId == 148) // WHEN Select Permanet value
  //     {
  //       // For Empty Object

  //       setContractExpiryDate('');
  //       setConfirmationDate('');
  //       // setConfirmationDueDate('');
  //       //   setConfirmationEnterDate('');

  //       setDisbledConfirmationDueDate(true);
  //       setDisabledContractExpiryDate(true);
  //       setDisbledConfirmationEnterDate(true);
  //     }
  //     else if (user.employeeTypeId == 93) // Probation Type
  //     {

  //       setDisabledConfirmationDate(true);
  //       setDisabledContractExpiryDate(true);

  //       setContractExpiryDate('');
  //       setConfirmationDate('');
  //       setConfirmationEnterDate('');
  //       // setConfirmationDueDate(addMonths(values.dateOfJoining || null, defProbationPolicyMonth))

  //     }
  //     else if (user.employeeTypeId == 147) // Contract Type
  //     {

  //       //  setContractExpiryDate('');
  //       setConfirmationDate('');
  //       setConfirmationDueDate('');
  //       setConfirmationEnterDate('');


  //       // setFieldValue("dateOfContractExpiry", '');

  //       // For Disabled Object
  //       setDisbledConfirmationEnterDate(true);
  //       setDisabledConfirmationDate(true);
  //       setDisbledConfirmationDueDate(true);
  //       //  setDisabledContractExpiryDate(true);

  //       // setContractExpiryDate(addMonths(user.dateOfJoining || null, defProbationPolicyMonth))

  //     }


  //     else {


  //       setContractExpiryDate(new Date());
  //       setConfirmationDate(new Date());
  //       setConfirmationDueDate(new Date());
  //       setConfirmationEnterDate(new Date());

  //     }
  //   }
  // }, user.Id);

  useEffect(() => {
    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);

  // Department DropDown Load when pageLoad
  useEffect(() => {




    if (!user.Id) {




      // dispatch(fetchAllDept(1));
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // For All Grade Codes
      dispatch(fetchAllFormsMenu(127, "allChildMenus")); // For Payroll Group
      dispatch(fetchAllFormsMenu(174, "allTeamsChildMenus")); // For Teams
      dispatch(fetchAllFormsMenu(86, "allRegionChildMenus")); // For Region
      dispatch(fetchAllFormsMenu(87, "allReligionChildMenus")); // For Religion
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus")); // For EmployeeType
      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
      dispatch(fetchAllCountry());
      dispatch(fetchAllCity());
      dispatch(fetchAllActiveEmployees());
      dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
      //   dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsisidaries
      dispatch(fetchAllFormsMenu(275, "allEmployeeStatus"));
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"))
      dispatch(fetchAllFormsMenu(190, "allMaritalStatus")); // For All Subsisidaries, "allMaritalStatus")); // For All Marital Status
      // dispatch(fetchAllFormsMenu(87));
      dispatch(fetchAllFormsMenu(125, "allRelationCodeList"));
      dispatch(fetchAllFormsMenu(109, "allInstitution")); // For Institution
      dispatch(fetchAllFormsMenu(108, "allDegreeTitle")); // For Degree Title
      dispatch(fetchAllFormsMenu(205, "allCycleTypeList")); // For Degree Title
      dispatch(fetchAllFormsMenu(184, "allContractTypeList")); // For Degree Title

      dispatch(fetchAllEmployeeShifts('allEmployeeShifts'));

      dispatch(fetchAllEmployeesWithNoPermissionData('allEmployeesWithNoPermissionList'));

      dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    }
  }, [dispatch]);


  const addMonths = (currentDate, noOfMonth) => {
    const date = new Date(currentDate); // Convert the input date to a Date object
    date.setMonth(date.getMonth() + noOfMonth); // Add 6 months to the current date
    return date;
  };

  useEffect(() => {


    const subsidiaryId = defSubsidiary?.value ? defSubsidiary.value : user.subsidiaryId;
    if (subsidiaryId) {
      fetchEmployeePolicyBySubsidiaryId(subsidiaryId)
    }
    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
      dashboard.allSubsidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );

  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  //===== Date Of Joining
  useEffect(() => {
    if (user.dateOfJoining) {
      setJoiningDate(new Date(user.dateOfJoining));

    }
  }, [user.dateOfJoining]);

  //=========== END

  //===== Date Of Birth
  useEffect(() => {

    if (user.dateOfBirth) {
      setDOBDate(new Date(user.dateOfBirth));
    }
  }, [user.dateOfBirth]);


  useEffect(() => {

    if (user?.dateOfRetirement) {
      setDRetirmentDate(new Date(user?.dateOfRetirement));

    }
  }, [user?.dateOfRetirement]);


  useEffect(() => {

    if (user?.dateOfConfirmationDue) {
      setConfirmationDueDate(new Date(user?.dateOfConfirmationDue));

    }
  }, [user?.dateOfConfirmationDue]);

  //===== lastReviewDate
  useEffect(() => {

    if (user.lastReviewDate) {
      setlastReviewDate(new Date(user.lastReviewDate));
    }
  }, [user.lastReviewDate]);

  //===== lastReviewDate
  useEffect(() => {

    if (user.nextReviewDate) {
      setnextReviewDate(new Date(user.nextReviewDate));
    }
  }, [user.nextReviewDate]);


  //===== passportExpiry
  useEffect(() => {

    if (user.passportExpiry) {
      setpassportExpiry(new Date(user.passportExpiry));
    }
  }, [user.passportExpiry]);

  //===== lastReviewDate
  useEffect(() => {

    if (user.drivingLicenseExpiry) {
      setdrivingLicenseExpiry(new Date(user.drivingLicenseExpiry));
    }
  }, [user.drivingLicenseExpiry]);


  //=========== END

  //===== Date Of Confirmation

  //off
  useEffect(() => {
    if (user?.dateOfConfirmation) {
      setConfirmationDate(new Date(user?.dateOfConfirmation));
    }
  }, [user?.dateOfConfirmation]);

  //=========== END

  useEffect(() => {
    const designationId = defEmpDesingaton?.value ? defEmpDesingaton.value : user.designationId;
    setDefualtEmpDesignation(
      dashboard.allDesignations &&
      dashboard.allDesignations.filter((item) => {
        return item.value === designationId;
      })
    );

  }, [user?.designationId, dashboard.designationId]);

  useEffect(() => {
    const cycleType = defcycleType?.value ? defcycleType.value : user.cycleTypeId;
    setcycleType(
      dashboard.allCycleTypeList &&
      dashboard.allCycleTypeList.filter((item) => {
        return item.value == cycleType;
      })
    );

  }, [user?.cycleTypeId, dashboard.cycleTypeId]);

  useEffect(() => {

    const contractType = defcontractType?.value ? defcontractType.value : user.contractTypeId;

    setcontractType(
      dashboard.allContractTypeList &&
      dashboard.allContractTypeList.filter((item) => {
        return item.value == contractType;
      })
    );

  }, [user?.contractTypeId, dashboard.contractTypeId]);

  ///

  useEffect(() => {

    const maritalStatus = defMaritalStatus?.value ? defMaritalStatus.value : user.maritalStatus;
    setDefaultMaritalStatus(

      dashboard.allMaritalStatus &&
      dashboard.allMaritalStatus.filter((item) => {
        return item.value == maritalStatus;
      })
    );

  }, [user?.maritalStatus, dashboard.maritalStatus]);

  //===== Date Of Confirmation Due
  //off
  // useEffect(() => {
  //   if (user.dateOfConfirmationDue) {
  //     setConfirmationDueDate(new Date(user.dateOfConfirmationDue));
  //   }
  // }, [user.dateOfConfirmationDue]);

  //=========== END

  //===== Date Of dateOfConfirmationEnter
  useEffect(() => {
    if (user.dateOfConfirmationEnter) {
      setConfirmationEnterDate(new Date(user.dateOfConfirmationEnter));
    }
  }, [user.dateOfConfirmationEnter]);

  //=========== END

  //===== Date Of Contract Expirty
  useEffect(() => {
    if (user.dateOfContractExpiry) {
      setContractExpiryDate(new Date(user.dateOfContractExpiry));
    }
  }, [user.dateOfContractExpiry]);

  //=========== END

  //===== Date Of Retirement
  // useEffect(() => {
  //   if (user?.gender == "Female") {
  //     const retirementDate = new Date(user.dateOfBirth);
  //     // retirementDate.setFullYear(retirementDate.getFullYear() + user.retirementAgeFemale);

  //     // setDRetirmentDate(new Date(retirementDate));
  //   }
  //   else if (user?.gender == "Male") {
  //     const retirementDate = new Date(user.dateOfBirth);
  //     // retirementDate.setFullYear(retirementDate.getFullYear() + user.retirementAgeMale);

  //     // setDRetirmentDate(new Date(retirementDate));
  //   }
  // }, [user?.retirementAgeFemale || user.retirementAgeMale]);

  //=========== END


  useEffect(() => {
    const gradeId = defEmployeeGrade?.value ? defEmployeeGrade.value : user.gradeId;
    setDefualtEmployeeGrade(
      dashboard.allEmployeeGradeList &&
      dashboard.allEmployeeGradeList.filter((item) => {
        return item.value === gradeId;
      })
    );

  }, [user?.gradeId, dashboard.gradeId]);

  // This method is used for when edit record and get selected dept where id save in DB
  useEffect(() => {
    const deptId = defDept?.value ? defDept.value : user.departmentId;

    setDefaultDept(
      dashboard.allDept &&
      dashboard.allDept.filter((item) => {
        return item.value === deptId;
      })
    );

  }, [user?.departmentId, dashboard.departmentId]);

  useEffect(() => {
    const countryId = defCountry?.value ? defCountry.value : user.countryId;
    setDefaultCountry(
      dashboard.allCountry &&
      dashboard.allCountry.filter((item) => {
        return item.value === countryId;
      })
    );

  }, [user?.countryId, dashboard.countryId]);
  //======================= Payroll Group
  useEffect(() => {
    const payrollGroupId = defchildMenus?.value ? defchildMenus.value : user.payrollGroupId;
    setDefaultChildMenus(
      dashboard.allChildMenus &&
      dashboard.allChildMenus.filter((item) => {
        return item.value === payrollGroupId;
      })
    );

  }, [user?.payrollGroupId, dashboard.payrollGroupId]);
  //======================= End

  //======================= Team

  useEffect(() => {
    const teamId = defchildTeamMenus?.value ? defchildTeamMenus.value : user.teamId;
    setDefaultChildTeamsMenus(
      dashboard.allTeamsChildMenus &&
      dashboard.allTeamsChildMenus.filter((item) => {
        return item.value === teamId;
      })
    );

  }, [user?.teamId, dashboard.teamId]);
  //======================= End
  //======================= Region

  useEffect(() => {
    const regionId = defchildRegionMenus?.value ? defchildRegionMenus.value : user.regionId;
    setDefaultChildRegionMenus(
      dashboard.allRegionChildMenus &&
      dashboard.allRegionChildMenus.filter((item) => {
        return item.value === regionId;
      })
    );

  }, [user?.regionId, dashboard.regionId]);
  //======================= End

  //======================= Religion

  useEffect(() => {
    const religionId = defchildRegionMenus?.value ? defchildRegionMenus.value : user.religionId;
    setDefaultChildReligionMenus(
      dashboard.allReligionChildMenus &&
      dashboard.allReligionChildMenus.filter((item) => {
        return item.value === religionId;
      })
    );

  }, [user?.religionId, dashboard.religionId]);
  //======================= End

  useEffect(() => {
    const reportTo = defEmployeeReportTo?.value ? defEmployeeReportTo.value : user.reportTo;

    setEmployeeReportToDefault(
      dashboard?.allEmployeesWithNoPermissionList &&
      dashboard?.allEmployeesWithNoPermissionList?.filter((item) => {
        return item?.value === reportTo;
      })
    );

  }, [user?.reportTo, dashboard.reportTo]);


  useEffect(() => {
    const emptypeId = defchildEmptypeMenus?.value ? defchildEmptypeMenus.value : user.employeeTypeId;


    setDefaultChildEmpTypeMenus(

      // dashboard.allEmpTypeChildMenus &&

      // dashboard.allEmpTypeChildMenus.filter((item) => {
      //   return item.value === emptypeId;
      // })
      [
        ...dashboard.allEmpTypeDynamicChildMenus,
        ...dashboard.allEmpTypeChildMenus
      ].filter(item => item.value === emptypeId));

    // ...dashboard.allEmpTypeChildMenus.filter((item) => {return item.value === emptypeId}),



  }, [user?.employeeTypeId, dashboard.employeeTypeId]);


  useEffect(() => {
    const empStatusId = defemployeeStatus?.value ? defemployeeStatus.value : user.employeeStatusId;


    setDefemployeeStatus(
      dashboard.allEmployeeStatus &&
      dashboard.allEmployeeStatus.filter((item) => {
        return item.value === empStatusId;
      })
    );

  }, [user?.employeeStatusId]);
  //======================= End

  useEffect(() => {


    const locationId = defchildLocationMenus?.value ? defchildLocationMenus.value : user.locationId;
    setDefaultChildLocationMenus(
      dashboard.allLocationChildMenus &&
      dashboard.allLocationChildMenus.filter((item) => {
        return item.value === locationId;
      })
    );

  }, [user?.locationId, dashboard.locationId]);
  //======================= End

  // useEffect(() => {
  //   if (!user.countryId) {
  //     dispatch(fetchAllCity(1));
  //   }
  // }, [user.countryId, dispatch]);


  useEffect(() => {
    const cityId = defCity?.value ? defCity.value : user.cityId;

    setDefaultCity(
      dashboard.allCity &&
      dashboard.allCity.filter((item) => {
        return item.value === cityId;
      })
    );
  }, [user?.cityId, dashboard.allCity]);

  useEffect(() => {
    if (user.cityId) {


      setImage(user.profile_image || '');

    }
  }, [user.cityId, dispatch]);

  const onImageChange = async event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setFile(img);

      setImage(URL.createObjectURL(img));
      setIsImageReq(false)
      setImgAlreadySet(true)
    }
  };

  // For Edit Form
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.post(`${USERS_URL}/profile/read-contact`, { Id: id });
        setDefaultContactList(response?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchWorkExperienceData = async () => {
      try {

        const response = await axios.post(`${USERS_URL}/experience/read-all-experienceById`, { Id: id });

        setworkExperienceList(response?.data?.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchAcademicData = async () => {
      try {

        const response = await axios.post(`${USERS_URL}/academic/read-all-academic_by_empId`, { Id: id });

        setAcademicList(response?.data?.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchSkillsData = async () => {
      try {

        const response = await axios.post(`${USERS_URL}/skills/read-all-skills_by_employeeId`, { Id: id });

        setSkillList(response?.data?.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchIncidentData = async () => {
      try {

        const response = await axios.post(`${USERS_URL}/incident/read-all-incident_by_employeeId`, { Id: id });

        setIncidentList(response?.data?.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchIncidentData();
    fetchSkillsData();
    fetchAcademicData();
    fetchWorkExperienceData();
    fetchContactData();
  }, []);


  // For Add Employee Contact States

  const addRowContact = (element) => {

    setDefaultContactList([...defContactList, { transactionType: element.target.id, employeeId: id }])
  }

  // Function to handle changes in input fields
  const handleFieldChangedContact = (index, field, value) => {
    const newContactList = [...defContactList];
    newContactList[index][field] = value;
    setDefaultContactList(newContactList);
  };

  const deleteRowContact = (element) => {

    const data = defContactList;
    data.splice(element.target.id, 1);

    setDefaultContactList([...data])
  }
  // End Contact Section

  // Experience Section

  const addRowExprerience = (element) => {

    setworkExperienceList([...workExperienceList, { transactionType: element.target.id, employeeId: id }])
  }

  const handleDatePicker = (el, key, index, val) => {


    setworkExperienceList([...workExperienceList.map((val, ind) => {
      if (ind == index) {
        // val[key] = new Date(el)
        val[key] = el ? new Date(el) : null;
      }
      return val
    })])

  }

  // const handleFieldChangedExperience = (el) => {



  //   const index = el?.target?.id.split('-')[1]
  //   const key = el?.target?.id.split('-')[0]

  //   if (key == "countryId") {

  //     //  dispatch(fetchAllCity(el.target.value));

  //   }

  //   setworkExperienceList([...workExperienceList.map((val, ind) => {
  //     if (ind == index) {
  //       val[key] = el?.target?.value
  //     }
  //     return val
  //   })])
  // }

  // Function to handle changes in input fields
  const handleFieldChangedExperience = (index, field, value) => {

    const newExpList = [...workExperienceList];

    if (field == "countryId") {

      newExpList[index]["cityId"] = '';
      newExpList[index]["city"] = '';
    }
    newExpList[index][field] = value;
    setworkExperienceList(newExpList);
  };

  const deleteRowExperience = (element) => {

    const data = workExperienceList;
    data.splice(element.target.id, 1);

    setworkExperienceList([...data])
  }

  // End Experience


  // Experience Academic Info

  const addRowAcademic = (element) => {

    setAcademicList([...academicList, { transactionType: element.target.id, employeeId: id }])
  }

  const handleDatePickerAcademic = (el, key, index, val) => {


    setAcademicList([...academicList.map((val, ind) => {
      if (ind == index) {
        // val[key] = new Date(el)
        val[key] = el ? new Date(el) : null;
      }
      return val
    })])

  }


  const fetchEmployeePolicyBySubsidiaryId = async (subsidiaryId, setFieldValue) => {

    try {
      const response = await axios.post(`${USERS_URL}/policy/read-policy-by-subsidiaryId`, { subsidiaryId: subsidiaryId || 0 });
      setProfilePolicy(response)

      setDefaultProbationPolicyMonth(response?.data?.data[0].probationPolicyInMonth)
      setDefaultCnotractExpiryPolicy(response?.data?.data[0].contractualPolicyInMonth)
      // const currentDate = new Date(user.dateOfJoining); // Current date
      // const newDate = addMonths(currentDate,user.probationPolicyInMonth);
      const minAge = response?.data?.data[0]?.minimumAge;
      const maxAge = response?.data?.data[0]?.maximumAge;
      setMinAgeLimin(minAge > 0 ? minAge : null); // No limit if 0 or not present

      // Set max age limit, if zero or not present, set no limit (e.g., null)
      setMaxAgeLimin(maxAge > 0 ? maxAge : null);
      // setDefaultProbationPolicyMonth(new Date(newDate));


      if (!id && response?.data?.data[0].isEmployeeCodeGenerationAuto) {




        dispatch(getLatestTableId("t_employee_profile", "	codeAuto", "subsidiaryId = " + response?.data?.data[0]?.subsidiaryId, (setEmployee) => {

          setFieldValue("codeAuto", setEmployee)
          // setEmployeeCode(setEmployee)
          setCodeAuto(setEmployee)
          setFieldValue("employeeCode", response?.data?.data[0]?.codePrefix + "-" + setEmployee)
          setEmployeeCode(response?.data?.data[0]?.codePrefix + "-" + setEmployee);
          setFieldValue("codePrefix", response?.data?.data[0]?.codePrefix)

        }));

      };




    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const updateRetirmentPolicy = (setFieldValue, dateOfBirth, gender) => {

    setDisableConfDueDate(false)
    // const retirementAge = gender === "Female"
    //   ? profilePolicy?.data?.data[0]?.retirementAgeFemale
    //   : profilePolicy?.data?.data[0]?.retirementAgeMale;

    const retirementAge = gender == "Female" && dateOfBirth
      ? profilePolicy?.data?.data[0]?.retirementAgeFemale
      : gender == "Male" && dateOfBirth
        ? profilePolicy?.data?.data[0]?.retirementAgeMale
        : null;

    if (retirementAge) {
      const retirementDate = new Date(dateOfBirth);

      retirementDate.setFullYear(retirementDate.getFullYear() + retirementAge);

      setDRetirmentDate(new Date(retirementDate));
      setFieldValue("dateOfRetirement", new Date(retirementDate));
    } else {
      return;
    }



  };

  const updateConfirmationDuePolicy = (setFieldValue, employeeTypeId, employeeStatusId, dateOfJoining) => {
    setDisableConfDueDate(false)
    const probationPolicyInMonth = employeeTypeId == 148 && dateOfJoining //&& employeeStatusId == 276
      ? profilePolicy?.data?.data[0]?.probationPolicyInMonth
      : null;

    if (!probationPolicyInMonth) {
      // setFieldValue("dateOfConfirmationDue", null);
      return; // Exit the function early if condition is not true
    }


    const confirmationDueDate = new Date(dateOfJoining);
    confirmationDueDate.setFullYear(confirmationDueDate.getFullYear() + Math.floor(probationPolicyInMonth / 12));  // Add full years
    confirmationDueDate.setMonth(confirmationDueDate.getMonth() + (probationPolicyInMonth % 12));  // Add the remaining months


    setConfirmationDueDate(new Date(confirmationDueDate))
    setFieldValue("dateOfConfirmationDue", new Date(confirmationDueDate));
    setHideContractExpDate(true)

  };

  const updateContractExpiryPolicy = (setFieldValue, employeeTypeId, employeeStatusId, dateOfJoining) => {
    setDisableConfDueDate(true)
    const contractualPolicyInMonth = employeeTypeId == 147 && dateOfJoining //&& employeeStatusId == 276
      ? profilePolicy?.data?.data[0]?.contractualPolicyInMonth
      : null;

    if (!contractualPolicyInMonth) {
      setDisableConfDueDate(false)
      // setFieldValue("dateOfContractExpiry", null);
      return; // Exit the function early if condition is not true
    }


    const ContractExpiryDate = new Date(dateOfJoining);
    // ContractExpiryDate.setFullYear(ContractExpiryDate.getFullYear() + Math.floor(contractualPolicyInMonth / 12));  // Add full years
    // ContractExpiryDate.setMonth(ContractExpiryDate.getMonth() + (contractualPolicyInMonth % 12));  // Add the remaining months
    ContractExpiryDate.setMonth(ContractExpiryDate.getMonth() + (contractualPolicyInMonth));
    ContractExpiryDate.setDate(ContractExpiryDate.getDate() - 1);


    setContractExpiryDate(new Date(ContractExpiryDate))
    setFieldValue("dateOfContractExpiry", new Date(ContractExpiryDate));


    const probationPolicyInMonth = profilePolicy?.data?.data[0]?.probationPolicyInMonth;
    const confirmationDueDate = new Date(dateOfJoining);
    confirmationDueDate.setFullYear(confirmationDueDate.getFullYear() + Math.floor(probationPolicyInMonth / 12));  // Add full years
    confirmationDueDate.setMonth(confirmationDueDate.getMonth() + (probationPolicyInMonth % 12));  // Add the remaining months


    setConfirmationDueDate(new Date(confirmationDueDate))
    setFieldValue("dateOfConfirmationDue", new Date(confirmationDueDate));
    setDisableConfDueDate(true)

  };
  // const handleFieldChangedAcademic = (el) => {

  //   const index = el.target.id.split('-')[1]
  //   const key = el.target.id.split('-')[0]

  //   if (key == "countryId") {

  //     // dispatch(fetchAllCity(el.target.value));

  //   }

  //   setAcademicList([...academicList.map((val, ind) => {
  //     if (ind == index) {
  //       val[key] = el.target.value
  //     }
  //     return val
  //   })])
  // }


  const handleFieldChangedAcademic = (index, field, value) => {


    const newAcademicList = [...academicList];
    newAcademicList[index][field] = value;

    if (field == "countryId") {
      newAcademicList[index]["cityId"] = null;
      newAcademicList[index]["city"] = '';
    }

    setAcademicList(newAcademicList);
  };


  const deleteRowAcademic = (element) => {
    const data = academicList;
    data.splice(element.target.id, 1);
    setAcademicList([...data])
  }

  // End Academic


  // Employee Skills Info

  const addRowSkills = (element) => {

    setSkillList([...skillsList, { transactionType: element.target.id, employeeId: id }])
  }

  const handleDatePickerSkills = (el, key, index, val) => {


    setSkillList([...skillsList.map((val, ind) => {
      if (ind == index) {
        // val[key] = new Date(el)
        val[key] = el ? new Date(el) : null;
      }
      return val
    })])

  }

  // const handleFieldChangedSkills = (el) => {

  //   const index = el?.target.id.split('-')[1]
  //   const key = el?.target.id.split('-')[0]
  //   setSkillList([...skillsList.map((val, ind) => {
  //     if (ind == index) {
  //       val[key] = el.target.value
  //     }
  //     return val
  //   })])
  // }

  const handleFieldChangedSkills = (index, field, value) => {
    const newSkillList = [...skillsList];
    newSkillList[index][field] = value;
    setSkillList(newSkillList);
  };

  const deleteRowSkills = (element) => {
    const data = skillsList;
    data.splice(element.target.id, 1);
    setSkillList([...data])
  }

  // End Academic


  // Employee Incident

  const addRowIncident = (element) => {

    setIncidentList([...incidentList, { transactionType: element.target.id, employeeId: id }])
  }

  const handleDatePickerIncident = (el, key, index, val) => {


    setIncidentList([...incidentList.map((val, ind) => {
      if (ind == index) {
        // val[key] = new Date(el)
        val[key] = el ? new Date(el) : null;
      }
      return val
    })])

  }


  

  const handleFieldChangedIncident = (index, field, value) => {
    const newIncidentList = [...incidentList];
    newIncidentList[index][field] = value;
    setIncidentList(newIncidentList);
  };
  // const handleFieldChangedIncident = (el) => {

  //   const index = el?.target.id.split('-')[1]
  //   const key = el?.target.id.split('-')[0]
  //   setIncidentList([...incidentList.map((val, ind) => {
  //     if (ind == index) {
  //       val[key] = el.target.value
  //     }
  //     return val
  //   })])
  // }

  const deleteRowIncident = (element) => {
    const data = incidentList;
    data.splice(element.target.id, 1);
    setIncidentList([...data])
  }

  // End Academic

  const seEmpCodeEditMode = async () => {




    setEmployeeCode(user?.employeeCode)
    // if(profilePolicy?.data?.data[0]?.codePrefix){
    //   setEmployeeCode(profilePolicy?.data?.data[0]?.codePrefix + "-" + defCodeAuto);

    // }

  };

  useEffect(() => {
    seEmpCodeEditMode()
  }, [user])


  const updateImagePolicy = async (setImagePolicy) => {


    if (!id && profilePolicy?.data?.data[0]?.empPictureIsMandatory) {

      setImagePolicy(true)
      if (!imgAlreadySet) {
        setIsImageReq(true)
      }

    }

  };

  useEffect(() => {
    updateImagePolicy(setImagePolicy)
  }, [profilePolicy])

  const validate = () => {
    const newErrors = {};
    defContactList.forEach((contact, index) => {
      if (!contact.relation_name) {
        newErrors[`relation_name-${index}`] = 'Relation Name is required';
      }
      if (!contact.relation_text) {
        newErrors[`relation_text-${index}`] = 'Relation is required';
      }
      // if (!contact.contactNo || !/^\d{11}$/.test(contact.contactNo)) {
      //   newErrors[`contactNo-${index}`] = 'Contact No must be between 7 t0 15 digits';
      // }

      // if (!contact.contactNo || !/^\d{7,15}$/.test(contact.contactNo)) {
      //   newErrors[`contactNo-${index}`] = 'Contact No must be between 7 to 15 digits';
      // }


      const contactNo = contact.contactNo ? contact.contactNo.trim() : '';

      // if (!contactNo || !/^\d{7,15}$/.test(contactNo)) {
      //   newErrors[`contactNo-${index}`] = 'Contact No must be between 7 to 15 digits';
      // }
      if (!contactNo) {
        newErrors[`contactNo-${index}`] = 'Contact no. is required';
      } else if (!/^\d{7,15}$/.test(contactNo)) {
        newErrors[`contactNo-${index}`] = 'Contact No must be between 7 to 15 digits';
      }
   
    });

    // Validations for Work Experience
    workExperienceList.forEach((obj, index) => {

      if (!obj.companyName) {
        newErrors[`companyName-${index}`] = 'Required';
      }
      if (!obj.positionHeld) {
        newErrors[`positionHeld-${index}`] = 'Required';
      }
      if (!obj.countryId) {
        newErrors[`countryId-W-${index}`] = 'Required';
      }

      if (!obj.cityId) {
        newErrors[`cityId-W-${index}`] = 'Required';
      }

      const num = getDateDiffInDays(obj.startDate, new Date().getTime())



      if (new Date(obj.startDate).getTime() > new Date().getTime()) {
        newErrors[`startDate_W-${index}`] = 'Start Date cannot be a future date';
      }

      // Validate endDate
      if (new Date(obj.endDate) <= new Date(obj.startDate)) {
        newErrors[`endDate_W-${index}`] = 'End Date must be later than Start Date';
      }


      if (!obj?.startDate) {
        newErrors[`startDate_W-${index}`] = 'Required';
      }

      if (!obj?.endDate) {
        newErrors[`endDate_W-${index}`] = 'Required';
      }


    });

    // Validations for Academic

    academicList.forEach((obj, index) => {

      if (!obj.institutionId) {
        newErrors[`institutionId-${index}`] = 'Required';
      }
      if (!obj.degreeId) {
        newErrors[`degreeId-${index}`] = 'Required';
      }
      if (!obj.countryId) {
        newErrors[`countryId-A-${index}`] = 'Required';
      }

      // GPA Validation
      if (!obj.gpa) {

        newErrors[`gpa-${index}`] = 'Required';
      } else if (isNaN(obj.gpa) || obj.gpa === '') {
        newErrors[`gpa-${index}`] = 'GPA must be a number';
      } else if (obj.gpa < 1 || obj.gpa > 5.0) {
        newErrors[`gpa-${index}`] = 'GPA must be between 1.0 and 5.0';
      } else if (!/^\d+(\.\d+)?$/.test(obj.gpa)) {
        newErrors[`gpa-${index}`] = 'GPA must be a valid digit';
      }
      if (!obj.cityId) {

        newErrors[`cityId-A-${index}`] = 'Required';
      }
      if (new Date(obj.startDate) > new Date()) {
        newErrors[`startDate_A-${index}`] = 'Start Date cannot be a future date';
      }

      // Validate endDate
      // if (new Date(obj.endDate) <= new Date(obj.startDate)) {
      //   newErrors[`endDate_A-${index}`] = 'End Date must be later than Start Date';
      // }

      if (!obj?.startDate) {
        newErrors[`startDate_A-${index}`] = 'Required';
      } else if (new Date(obj.startDate) > new Date()) {
        newErrors[`startDate_A-${index}`] = 'Start Date cannot be a future date';
      }


      
      if (!obj.endDate) {
        newErrors[`endDate_A-${index}`]  ='Required';
      } else if (new Date(obj.endDate) <= new Date(obj.startDate)) {
        newErrors[`endDate_A-${index}`] = 'End Date must be later than Start Date';
      }
    
      // if (!obj?.endDate) {
      //   newErrors[`endDate_A-${index}`] = 'Required';
      // }


    });

    // Validations for Skills
    skillsList.forEach((obj, index) => {
      if (!obj.skill) {
        newErrors[`skill-${index}`] = 'Required';
      }
      if (!obj.description) {
        newErrors[`description-${index}`] = 'Required';
      }

      if (!obj.ratingScale) {
        newErrors[`ratingScale-${index}`] = 'Required';
      }

      // if (new Date(obj.startDate) > new Date()) {
      //   newErrors[`startDate-${index}`] = 'Start Date cannot be a future date';
      // }

      if (!obj.startDate) {
        newErrors[`startDate-${index}`] ='Required';
      } else if (new Date(obj.startDate) > new Date()) {
        newErrors[`startDate-${index}`] = 'Start Date cannot be a future date';
      }

      // Validate endDate
      // if (new Date(obj.endDate) <= new Date(obj.startDate)) {
      //   newErrors[`endDate-${index}`] = 'End Date must be later than Start Date';
      // }

      if (!obj.endDate) {
        newErrors[`endDate-${index}`] ='Required';
      } else if (new Date(obj.endDate) <= new Date(obj.startDate)) {
        newErrors[`endDate-${index}`] = 'End Date must be later than Start Date';
      }

    });

    // Validations for Incident
    incidentList.forEach((obj, index) => {
      if (!obj.incidentDetail) {
        newErrors[`incidentDetail-${index}`] = 'Required';
      }
      if (!obj.actionTaken) {
        newErrors[`actionTaken-${index}`] = 'Required';
      }

      if (!obj.actionTakenBy) {
        newErrors[`actionTakenBy-${index}`] = 'Required';
      }

      // if (new Date(obj.incidentDate) > new Date()) {
      //   newErrors[`incidentDate-${index}`] = 'incidentDate Date cannot be a future date';
      // }

      if (!obj.incidentDate) {
        newErrors[`incidentDate-${index}`] = 'Required';
      } else if (new Date(obj.incidentDate) > new Date()) {
        newErrors[`incidentDate-${index}`] = 'Incident Date cannot be a future date';
      }

    });

    return newErrors;
  };

  const [isBasicInfoVisible, setIsBasicInfoVisible] = useState(false);

  // Step 2: Function to toggle visibility
  const toggleBasicInfoVisibility = () => {
    setIsBasicInfoVisible(!isBasicInfoVisible);
  };


  const [isExtendedfoVisible, setIsExtendedfoInfoVisible] = useState(false);

  // Step 2: Function to toggle visibility
  const toggleExtendedfoVisibility = () => {
    setIsExtendedfoInfoVisible(!isExtendedfoVisible);
  };

  const fetchDepartment = (subsidiaryId) => {
    dispatch(fetchAllDept(subsidiaryId));
  }

  useEffect(() => {
    fetchDepartment(user?.subsidiaryId)
  }, [user?.subsidiaryId])

  const doBnotify = () => {
    toast("Date of Retirement needs to be updated!");
  };

  const doJnotify = () => {
    toast('Date of Confirmation, Date of Confirmation Due & Contract Expiry Date needs to be updated!');
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={profileValidation}
        onSubmit={async (values) => {


          //const t =  handleSubmit();
          const validationErrors = validate();

          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          } else {

            // Reset errors on successful submission
            setErrors({});

            enableLoading();

            if (file) {
              let formData = new FormData();
              await formData.append('image', file);
              await axios
                .post(`${USERS_URL}/profile/image-upload`, formData)
                .then((res) => {
                  setImage(res.data.imageUrl)
                  saveEmployeeProfile(values, res.data.imageUrl, defContactList, workExperienceList, academicList, skillsList, incidentList, imagePolicy, isImageReq);
                });
            }
            else {

              saveEmployeeProfile(values, profile_image, defContactList, workExperienceList, academicList, skillsList, incidentList, imagePolicy, isImageReq);
            }
          }

        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Basic Information</h6>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <div>
                          <div>
                            <div>

                              <img name='profile_image' width={120} height={120} src={user?.profile_image || profile_image} />
                              <h4>Select Image {imagePolicy && <span style={{ color: "red" }}>*</span>}</h4>
                              <input type="file" name="myImage" accept=".jpg, .jpeg, .png" onChange={onImageChange} />
                              <ErrorMessage className="form-feedBack" name="myImage" component="div" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>




                    <div ref={scrollRef} className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="subsidiaryId"
                          label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                            setDefualtSubsidiaryList(e);

                            if (!id) {
                              setEmployeeCode(" ")
                              setFieldValue("employeeCode", "")
                              setFieldValue("codeAuto", "");
                              setFieldValue("codePrefix", "");

                              setFieldValue("dateOfBirth", null);
                              setDOBDate(null);
                              setFieldValue("dateOfJoining", null);
                              setJoiningDate(null);
                              setFieldValue("dateOfRetirement", null);
                              setDRetirmentDate(null);
                              setFieldValue("dateOfConfirmation", null);
                              setConfirmationDate(null);
                              setFieldValue("dateOfConfirmationDue", null);
                              setConfirmationDueDate(null);
                              setFieldValue("dateOfConfirmationEnter", null);
                              setConfirmationEnterDate(null);
                              setFieldValue("lastReviewDate", null);
                              setlastReviewDate(null);
                              setFieldValue("nextReviewDate", null);
                              setnextReviewDate(null);
                              setFieldValue("dateOfContractExpiry", null);
                              setContractExpiryDate(null);

                              fetchEmployeePolicyBySubsidiaryId(e.value, setFieldValue);

                            }

                            //handlePaymenModeChanged(e)
                            fetchDepartment(e.value)
                            setFieldValue("defaultShiftId", null);

                          }}

                          value={(defSubsidiary || null)}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                          options={dashboard.allSubsidiaryList}
                        />

                      </div>

                      {id || profilePolicy?.data?.data[0].isEmployeeCodeGenerationAuto ? (<div className="col-12 col-md-4 mt-3">
                        <Field
                          name="employeeCode"
                          component={Input}
                          maxLength="10"
                          placeholder=" Employee Code"
                          label={<span> Employee Code<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          onChange={(e) => {
                            setFieldValue("employeeCode", e.target.value || null);
                            setEmployeeCode(e.target.value || defEmployeeCode);


                          }}
                          value={defEmployeeCode || null}

                          disabled={true}
                        />
                      </div>) : (

                        <>
                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="codePrefix"
                              component={Input}
                              maxLength="10"
                              placeholder="Employee code prefix"
                              label={<span>Employee Code Prefix<span style={{ color: 'red' }}>*</span></span>}
                              autoComplete="off"
                              onChange={(e) => {
                                setFieldValue("codePrefix", e.target.value || null);
                                // setEmployeeCode(e.target.value || defEmployeeCode);


                              }}
                              // value={defEmployeeCode || null}

                              disabled={true}
                            />
                          </div>


                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="codeAuto"
                              component={Input}
                              maxLength="6"
                              placeholder="Eg. 000001"
                              label={<span>Employee Code <span style={{ color: 'red' }}>*</span></span>}
                              autoComplete="off"
                              onChange={(e) => {
                                setFieldValue("codeAuto", e.target.value || null);
                                // setEmployeeCode(e.target.value || defEmployeeCode);
                                // setFieldValue("employeeCode", response?.data?.data[0]?.codePrefix + "-" +setEmployee )
                                // setEmployeeCode(response?.data?.data[0]?.codePrefix + "-" +setEmployee);
                                setEmployeeCode(profilePolicy?.data?.data[0]?.codePrefix + "-" + e.target.value);
                                setFieldValue("employeeCode", profilePolicy?.data?.data[0]?.codePrefix + "-" + e.target.value)
                                setFieldValue("codePrefix", profilePolicy?.data?.data[0]?.codePrefix);

                              }}
                              // value={defEmployeeCode || null}

                              disabled={isUserForRead || id || profilePolicy?.data?.data[0]?.isEmployeeCodeGenerationAuto}
                            />
                          </div>

                        </>
                      )

                      }




                    </div>
                    <div className="from-group row">
                      {

                        <div className="col-12 col-md-2 mt-3">
                          <Select
                            label={<span> Title<span style={{ color: 'red' }}>*</span></span>}
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{ display: "block" }}
                          >
                            <option label="Select Title" />
                            <option value="Mr." label="Mr." />
                            <option value="Mrs." label="Mrs." />
                            <option value="Ms." label="Ms." />
                            <option value="Dr." label="Dr." />
                            <option value="Professor." label="Professor." />


                          </Select>
                          {errors.title && touched.title && (
                            <div className="invalid-text">{errors.title}</div>
                          )}
                        </div>

                      }
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="firstName"
                          component={Input}
                          placeholder=" first name"
                          label={<span> First Name<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="middleName"
                          component={Input}
                          placeholder=" middle name"
                          label={<span> Middle Name</span>}
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="lastName"
                          component={Input}
                          placeholder=" last name"
                          label={<span> Last Name<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>

                    </div>
                    <div className="from-group row">




                    </div>
                    <div className="form-group row">


                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="gradeId"
                          label={<span> Grade<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("gradeId", e.value || null);
                            setDefualtEmployeeGrade(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defEmployeeGrade || null)}
                          error={errors.gradeId}
                          touched={touched.gradeId}
                          options={dashboard.allEmployeeGradeList}
                        />

                      </div>
                      <div className="col-12 col-md-4 mt-3">





                        <SearchSelect
                          name="designationId"
                          label={<span> Designation<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("designationId", e.value || null);
                            setDefualtEmpDesignation(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defEmpDesingaton || null)}
                          error={errors.designationId}
                          touched={touched.designationId}
                          options={dashboard.allDesignations}
                        />

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="departmentId"
                          label={<span> Department<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("departmentId", e.value || null);
                            setDefaultDept(e);
                            // dispatch(fetchAllDept(e.value));
                          }}
                          // value={(defDept || null)}
                          value={
                            dashboard.allDept?.find(
                              (option) => option?.value === values?.departmentId
                            ) || null
                          }
                          error={errors.departmentId}
                          touched={touched.departmentId}
                          options={dashboard.allDept}

                        />





                      </div>


                      <div className="col-12 col-md-4 mt-3">
                        <Select
                          label={<span> Nationality</span>}
                          name="nationality"
                          value={values.nationality}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                        >
                          <option value="-1" label="Select Nationality" />
                          <option value="Pakistani" label="Pakistani" />
                          <option value="Other" label="Other" />

                        </Select>
                        {errors.nationality && touched.nationality && (
                          <div className="invalid-text">{errors.nationality}</div>
                        )}
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="teamId"
                          label={<span> Team</span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("teamId", e.value || null);
                            setDefaultChildTeamsMenus(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defchildTeamMenus || null)}
                          error={errors.teamId}
                          touched={touched.teamId}
                          options={dashboard.allTeamsChildMenus}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="payrollGroupId"
                          label={<span> Payroll Group<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("payrollGroupId", e.value || null);
                            setDefaultChildMenus(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defchildMenus || null)}
                          error={errors.payrollGroupId}
                          touched={touched.payrollGroupId}
                          options={dashboard.allChildMenus}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="employeeTypeId"
                          label={<span> Employee Type<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true || !values?.subsidiaryId}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {

                            setFieldValue("employeeTypeId", e.value || null);


                            setDefaultChildEmpTypeMenus(e);
                            setDisbledConfirmationEnterDate(false);
                            setDisabledConfirmationDate(false);
                            setDisbledConfirmationDueDate(false);
                            setDisabledContractExpiryDate(false);
                            //contract type
                            if (e.value == 147) {

                              // setFieldValue("dateOfRetirement", null)
                              // setDRetirmentDate(null)
                              if (!id) {
                                updateContractExpiryPolicy(setFieldValue, e.value, values?.employeeStatusId, values?.dateOfJoining)
                              }


                              setHidehideRetirementAgeDate(true)
                              setHideContractExpDate(false)
                            }
                            // Permanent
                            else if (e.value == 148) {
                              if (!id) {
                                updateConfirmationDuePolicy(setFieldValue, e.value, values?.employeeStatusId, values?.dateOfJoining)

                              }
                              // setContractExpiryDate(null)
                              // setFieldValue("dateOfContractExpiry", null);
                              setHidehideRetirementAgeDate(false)
                              setHideContractExpDate(true)
                            }
                            else {

                              updateRetirmentPolicy(setFieldValue, values?.dateOfBirth, values?.gender)
                              // setFieldValue("dateOfConfirmationDue", null)
                              // setConfirmationDueDate(null)
                              // setContractExpiryDate(null)
                              // setFieldValue("dateOfContractExpiry", null);
                              setHidehideRetirementAgeDate(true)
                              setHideContractExpDate(true)
                            }






                          }}
                          value={(defchildEmptypeMenus || null)}
                          error={errors.employeeTypeId}
                          touched={touched.employeeTypeId}
                          // options={dashboard.allEmpTypeChildMenus}
                          options={[
                            ...dashboard.allEmpTypeDynamicChildMenus,
                            ...dashboard.allEmpTypeChildMenus
                          ]}
                        />
                      </div>


                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="employeeStatusId"
                          label={<span> Employee Status<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true || !values?.subsidiaryId}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {

                            setFieldValue("employeeStatusId", e.value || null);


                            setDefemployeeStatus(e);
                            //probation

                            // if (e.value == 276) {
                            if (!id) {
                              updateConfirmationDuePolicy(setFieldValue, values?.employeeTypeId, e.value, values?.dateOfJoining)
                              updateContractExpiryPolicy(setFieldValue, values?.employeeTypeId, e.value, values?.dateOfJoining)
                            }


                            // }
                            // else {
                            //   if (!id) {
                            //     setFieldValue("dateOfConfirmationDue", null)
                            //     setConfirmationDueDate(null)
                            //   }

                            //   setContractExpiryDate(null)
                            //   setFieldValue("dateOfContractExpiry", null);
                            // }

                          }}

                          value={(defemployeeStatus || null)}
                          error={errors.employeeStatusId}
                          touched={touched.employeeStatusId}
                          options={dashboard?.allEmployeeStatus}
                        />
                      </div>


                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="locationId"
                          label={<span> Location<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("locationId", e.value || null);
                            setDefaultChildLocationMenus(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defchildLocationMenus || null)}
                          error={errors.locationId}
                          touched={touched.locationId}
                          options={dashboard.allLocationChildMenus}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        {/* <label>Default Shift<span style={{ color: 'red' }}>*</span></label>
                        <Select
                          // label="Default Shift"
                          name="defaultShiftId"
                          value={values.defaultShiftId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                          autoComplete="off"
                        >
                          <option value="-1" label="Select Shift" />
                          <option value="1" label="Morning Shift-A" />
                          <option value="2" label="Evening Shift-B" />
                          <option value="3" label="Night Shift-C" />


                        </Select>
                        {errors.defaultShiftId && touched.defaultShiftId && (
                          <div className="invalid-text">{errors.defaultShiftId}</div>
                        )} */}


                        <label>Default Shift<span style={{ color: 'red' }}>*</span></label>

                        <SearchSelect
                          name="defaultShiftId"
                          // label={<span> defaultShif<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("defaultShiftId", e.value || null);
                            // setDefualtSubsidiaryList(e);
                            // fetchEmployeePolicyBySubsidiaryId(e.value);
                            //handlePaymenModeChanged(e)
                          }}

                          // value={(defSubsidiary || null)}
                          value={
                            dashboard?.allEmployeeShifts?.find(
                              (option) => option.value === values.defaultShiftId
                            ) || null
                          }
                          error={errors.defaultShiftId}
                          touched={touched.defaultShiftId}
                          // options={dashboard.allEmployeeShifts}
                          options={dashboard.allEmployeeShifts?.filter(shift => shift?.subsidiaryId == values?.subsidiaryId)}
                        />
                      </div>




                      <div className="col-12 col-md-4 mt-3">
                        <label className="mr-4">Report To</label>
                        <input
                          name="all_report_to"
                          type="checkbox"
                          // onChange={handleChange}
                          onChange={() => setFieldValue("all_report_to", !values?.all_report_to)}
                          onBlur={handleBlur}
                          value={values.all_report_to}
                          checked={values.all_report_to}
                          label="Show All"
                        />
                        <label className="ml-2">Show All</label>
                        <ErrorMessage className="form-feedBack" name="all_report_to" component="div" />
                        <SearchSelect
                          name="reportTo"

                          isDisabled={isUserForRead && true}
                          // onBlur={() => {
                          //   handleBlur({ target: { name: "countryId" } });
                          // }}
                          onChange={(e) => {
                            setFieldValue("reportTo", e.value || null);
                            setEmployeeReportToDefault(e);
                            //dispatch(fetchAllActiveEmployees(e.value));
                          }}
                          value={(defEmployeeReportTo || null)}
                          error={errors.reportTo}
                          touched={touched.reportTo}
                          // options={dashboard.allEmployees.filter(x => x.value != values.Id)}
                          options={[
                            { value: null, label: 'Select' }, // Adding "All" option with value empty string
                            // ...dashboard.allEmployeesWithNoPermissionList.filter(x => x.departmentId == values.departmentId && x.value != values.Id), // Spread the rest of the menu options

                            ...dashboard.allEmployeesWithNoPermissionList.filter(x => {
                              if (values?.all_report_to) {
                                // If "All" is selected, do not filter by department and exclude current user
                                return x.value !== values.Id;
                              } else {
                                // If "All" is not selected, filter based on departmentId and exclude current user
                                return x.departmentId === values.departmentId && x.value !== values.Id;
                              }
                            })
                          ]}
                        />

                      </div>


                      <div className="col-12 col-md-4 mt-3">

                        <SearchSelect
                          label={<span> Marital Status<span style={{ color: 'red' }}>*</span></span>}
                          name="maritalStatus"
                          // value={values.maritalStatus}
                          isDisabled={isUserForRead && true}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue("maritalStatus", e.value || null);
                            setDefaultMaritalStatus(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defMaritalStatus || null)}
                          error={errors.maritalStatus}
                          touched={touched.maritalStatus}
                          options={dashboard.allMaritalStatus}
                        />
                        {/* <ErrorMessage style={{ color: "red" }} name="maritalStatus" component="div" /> */}
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <Select
                          label={<span> Gender<span style={{ color: 'red' }}>*</span></span>}
                          name="gender"
                          value={values.gender}
                          // onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                          autoComplete="off"
                          onChange={(e) => {
                            setFieldValue("gender", e.target.value)
                            if (!id && values.subsidiaryId) {

                              updateRetirmentPolicy(setFieldValue, values.dateOfBirth, e.target.value)
                            }

                          }}

                        >
                          <option label="Select Gender" />
                          <option value="Male" label="Male" />
                          <option value="Female" label="Female" />

                        </Select>
                        {errors.gender && touched.gender && (
                          <div className="invalid-text">{errors.gender}</div>
                        )}

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="religionId"
                          label={<span> Religion<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}

                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("religionId", e.value || null);
                            setDefaultChildReligionMenus(e);
                            // dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(defchildReligionMenus || null)}
                          error={errors.religionId}
                          touched={touched.religionId}
                          options={dashboard.allReligionChildMenus}
                        />
                      </div>
                    </div>
                    <div className="from-group row ">
                      {
                        <div className="col-12 col-md-4 mt-3">
                          {<span> Date Of Birth<span style={{ color: 'red' }}>*</span></span>}
                          <DatePicker
                            className="form-control  mt-2"
                            placeholder=" Date Of Birth"
                            selected={DOBDateSelected}
                            //value={values.dateOfBirth}
                            showYearDropdown
                            scrollableMonthYearDropdown
                            onChange={(date) => {
                              setFieldValue("dateOfBirth", date);
                              setDOBDate(date);
                              if (!id) {

                                updateRetirmentPolicy(setFieldValue, date, values?.gender)
                              } else {
                                doBnotify()
                              }

                            }}
                            timeInputLabel="Time:"
                            dateFormat="dd/MM/yyyy"
                            // showTimeInput
                            name="dateOfBirth"
                            disabled={isUserForRead || !values?.subsidiaryId}
                            autoComplete="off"
                            // maxDate={new Date()}
                            // minDate={new Date(1900, 0, 1)}
                            // const currentDate = new Date();
                            minDate={maxAgeLimin !== null ? new Date(new Date().getFullYear() - maxAgeLimin, new Date().getMonth(), new Date().getDate()) : null}
                            maxDate={minAgeLimin !== null ? new Date(new Date().getFullYear() - minAgeLimin, new Date().getMonth(), new Date().getDate()) : new Date()}
                          />
                          <ErrorMessage className="form-feedBack" name="dateOfBirth" component="div" />
                        </div>
                      }
                      {
                        <div className="col-12 col-md-4 mt-3">
                          <label>Date Of Joining<span style={{ color: 'red' }}>*</span></label>
                          <DatePicker
                            className="form-control"
                            placeholder=" Date Of Joining"
                            selected={joiningDateSelected}
                            onChange={(date) => {
                              setFieldValue("dateOfJoining", date);
                              setJoiningDate(date);
                              if (!id) {
                                updateConfirmationDuePolicy(setFieldValue, values.employeeTypeId, values.employeeStatusId, date)
                                updateContractExpiryPolicy(setFieldValue, values.employeeTypeId, values.employeeStatusId, date)
                              }
                              else {
                                doJnotify()
                              }

                              // *********************************************************************************************************

                              // if (values?.employeeTypeId == "93" && !isNaN(defContractExpiryPolicy)) // Probation

                              // {

                              //   setConfirmationDueDate(addMonths(date, defProbationPolicyMonth))
                              //   setFieldValue("dateOfConfirmationDue", addMonths(date, defProbationPolicyMonth))
                              // }
                              // if (values?.employeeTypeId == "147" && !isNaN(defContractExpiryPolicy)) // Contract Type
                              // {
                              //   setContractExpiryDate(addMonths(date, defContractExpiryPolicy))
                              //   setFieldValue("dateOfContractExpiry", addMonths(date, defContractExpiryPolicy))

                              // }


                              // *********************************************************************************************************                           
                            }}
                            showYearDropdown
                            scrollableMonthYearDropdown
                            timeInputLabel="Time:"
                            dateFormat="dd/MM/yyyy"
                            // showTimeInput
                            autoComplete="off"
                            name="dateOfJoining"
                            disabled={isUserForRead || !values?.subsidiaryId}
                            error={errors.dateOfJoining}
                            touched={touched.dateOfJoining}

                            minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                          />
                          <ErrorMessage className="form-feedBack" name="dateOfJoining" component="div" />
                        </div>
                      }
                      {
                        <div className="col-12 col-md-4 mt-3">
                          <label>Date Of Confirmation</label>
                          <DatePicker
                            className="form-control"
                            placeholder=" Date Of Confirmation"
                            selected={confirmationDateSelected}
                            showYearDropdown
                            scrollableMonthYearDropdown
                            onChange={(date) => {
                              setFieldValue("dateOfConfirmation", date);
                              setConfirmationDate(date);
                            }}
                            timeInputLabel="Time:"
                            dateFormat="dd/MM/yyyy"
                            // showTimeInput
                            name="dateOfConfirmation"
                            // disabled={disabledConfirmationDateSelected}
                            autoComplete="off"

                            minDate={values.dateOfJoining ? new Date(values.dateOfJoining) : null}
                          />
                          <ErrorMessage className="form-feedBack" name="dateOfConfirmation" component="div" />
                        </div>
                      }
                    </div>

                    <div className="from-group row ">

                      <div className="col-12 col-md-4 mt-3">
                        <label>Date Confirmation Due </label>
                        <DatePicker
                          className="form-control"
                          placeholder=" Date Of Confirmation Due"
                          selected={confirmationDueDateSelected}
                          onChange={(date) => {
                            setFieldValue("dateOfConfirmationDue", date);
                            setConfirmationDueDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy"
                          // showTimeInput
                          name="dateOfConfirmationDue"
                          disabled={disableConfDueDate}
                          autoComplete="off"


                          minDate={values.dateOfJoining ? new Date(values.dateOfJoining) : null}
                        />
                        <ErrorMessage className="form-feedBack" name="dateOfConfirmationDue" component="div" />
                      </div>

                      {(values.employeeTypeId==147) && (<div className="col-12 col-md-4 mt-3">
                        <label>Contract Expiry </label>
                        <DatePicker
                          className="form-control"
                          placeholder=" Contract Expiry"
                          selected={contractExpirtyDateSelected}
                          onChange={(date) => {
                            setFieldValue("dateOfContractExpiry", date);
                            setContractExpiryDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy"
                          // showTimeInput
                          name="dateOfContractExpiry"
                          // disabled={disabledContractExpirtyDateSelected}
                          autoComplete="off"
                          minDate={values.dateOfJoining ? new Date(values.dateOfJoining) : null}
                        />
                        <ErrorMessage className="form-feedBack" name="dateOfContractExpiry" component="div" />
                      </div>)}


                      {(values.employeeTypeId!==147) && (<div className="col-12 col-md-4 mt-3">
                        <label>Date Of Retirement</label>
                        <DatePicker
                          className="form-control"
                          placeholder=" Date Of Retirement"
                          selected={RetirementSelected}

                          showYearDropdown
                          scrollableMonthYearDropdown
                          onChange={(date) => {
                            setFieldValue("dateOfRetirement", date);
                            setDRetirmentDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy"
                          // showTimeInput
                          name="dateOfRetirement"
                          disabled={isUserForRead || !values?.subsidiaryId}
                          autoComplete="off"
                        />
                        <ErrorMessage className="form-feedBack" name="dateOfRetirement" component="div" />
                      </div>)}
                    </div>


                    <div className="col-12 col-md-4 mt-5">
                      <input
                        name="approvedForPayroll"
                        type="checkbox"
                        // onChange={handleChange}
                        onChange={() => setFieldValue("approvedForPayroll", !values?.approvedForPayroll)}
                        onBlur={handleBlur}
                        value={values.approvedForPayroll}
                        checked={values.approvedForPayroll}
                        label="Approved for Payroll"
                      />
                      <label className="ml-2">Approved for Payroll</label>
                      <ErrorMessage className="form-feedBack" name="approvedForPayroll" component="div" />
                    </div>



                  </div>
                  <br></br>



                  <br></br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Personal Information</h6>

                    <div className="from-group row">

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="nic_no"
                          mask={[

                            /[1-9]/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                          ]}
                          component={MaskInput}
                          placeholder=" ID Card No"
                          label={<span> Id Card No<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                        {/* <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> */}
                      </div>


                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="email_official"
                          component={Input}
                          placeholder="example@gmail.com"
                          label="Official Email"
                          autoComplete="off"
                          maxLength="30"

                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="email_personal"
                          component={Input}
                          placeholder="example@gmail.com"
                          label="Personal Email"
                          autoComplete="off"
                          maxLength="30"
                        />
                      </div>

                    </div>
                    <div className="from-group row">



                    </div>

                    <div className="from-group row">




                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="phone_home"
                          component={Input}
                          placeholder="03151110002"
                          label="Phone (Home)"
                          maxLength="15"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="phone_official"
                          component={Input}
                          maxLength="15"
                          placeholder="03151110002"
                          label="Phone (Offical) "
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="phone_cell"
                          component={Input}
                          maxLength="15"
                          placeholder="03151110002"
                          label="Cell No."
                          autoComplete="off"
                        />
                      </div>




                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-12 mt-3">
                        <Field
                          name="additional_summary"
                          component={TextArea}
                          placeholder="Enter Address"
                          label={<span> Address<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>

                    </div>

                    {/* 
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="licenseNo"
                          mask={[

                            /[1-9]/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                          ]}
                          component={MaskInput}
                          placeholder="Enter License No"
                          label={<span> Enter License No</span>}
                          autoComplete="off"
                        />
                         <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> 
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <label>Enter License Date</label>
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Expiry License Date"
                          selected={deflicenseExpiryDate}

                          showYearDropdown
                          scrollableMonthYearDropdown
                          onChange={(date) => {
                            setFieldValue("licenseExpiryDate", date);
                            setlicenseExpiryDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy"
                          showTimeInput
                          name="licenseExpiryDate"

                          autoComplete="off"
                        />
                        <ErrorMessage className="form-feedBack" name="licenseExpiryDate" component="div" />
                      </div>
                    </div> */}

                    <div className="from-group row">



                      {/* 
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="emiratesId"
                          maxLength="20"
                          component={Input}
                          placeholder="Enter "
                          label={<span> Emirates Id</span>}
                          autoComplete="off"
                        />
                      
                      </div> */}

                    </div>


                    <div className="from-group row">




                    </div>
                  </div>
                  <br></br>


                  <div
                    style={{
                      backgroundColor: "#0093DD",
                      color: "white",
                      padding: "20px",
                      borderRadius: "5px",
                      border: '2px solid #adceff'
                    }}
                    onClick={toggleBasicInfoVisibility}
                  >

                    <div className="flex row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h6>Additional Information</h6>
                      <KeyboardArrowDown />

                    </div>
                  </div>
                  <br></br>
                  {isBasicInfoVisible && (
                    <div>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h6>  Basic Information</h6>

                        <div className="from-group row">


                          <div className="col-12 col-md-4 mt-3">

                            <SearchSelect
                              name="regionId"
                              label={<span> Region</span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("regionId", e.value || null);
                                setDefaultChildRegionMenus(e);
                                // dispatch(fetchAllFormsMenu(e.value));
                              }}
                              value={(defchildRegionMenus || null)}
                              error={errors.regionId}
                              touched={touched.regionId}
                              options={dashboard.allRegionChildMenus}
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="countryId"
                              label={<span> Country</span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("countryId", e.value);
                                setDefaultCountry(e);
                                setDefaultCity({});
                                // dispatch(fetchAllCity(e.value));
                              }}
                              value={defCountry}
                              error={errors.countryId}
                              touched={touched.countryId}
                              options={dashboard.allCountry}
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="cityId"
                              label={<span> City</span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                //   handleBlur({ target: { name: "cityId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("cityId", e.value);
                                setDefaultCity(e);

                              }}
                              value={defCity}
                              error={errors.cityId}
                              touched={touched.cityId}
                              options={dashboard.allCity.filter(x => x.code == values.countryId)}
                            />
                          </div>



                        </div>
                        <div className="from-group row">



                          <div className="col-12 col-md-4 mt-3">
                            <label>Date Confirmation Extended  </label>
                            <DatePicker
                              className="form-control"
                              placeholder=" Confirmation  Date"
                              selected={confirmationEnterDateSelected}
                              onChange={(date) => {
                                setFieldValue("dateOfConfirmationEnter", date);
                                setConfirmationEnterDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy"
                              // showTimeInput
                              name="dateOfConfirmationEnter"
                              disabled={disableConfDueDate}
                              autoComplete="off"
                              minDate={values.dateOfConfirmationDue ? new Date(values.dateOfConfirmationDue) : new Date(values.dateOfJoining)}

                            // minDate={values.dateOfJoining ? new Date(values.dateOfJoining) : null}
                            />
                            <ErrorMessage className="form-feedBack" name="dateOfConfirmationEnter" component="div" />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                        
                              <label>Last Review Date</label>
                            <DatePicker
                              className="form-control"
                              placeholder="Last Review Date"
                              selected={deflastReviewDate}
                              //value={values.dateOfBirth}
                              showYearDropdown
                              scrollableMonthYearDropdown
                              onChange={(date) => {
                                setFieldValue("lastReviewDate", date);
                                setlastReviewDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy"
                              // showTimeInput
                              name="lastReviewDate"
                              disabled={isUserForRead}
                              autoComplete="off"
                              maxDate={new Date()}
                              minDate={values.dateOfJoining ? new Date(values.dateOfJoining) : null}
                            />
                            <ErrorMessage className="form-feedBack" name="lastReviewDate" component="div" />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <label>Next Review Date</label>
                            <DatePicker
                              className="form-control"
                              placeholder="Next Review Date"
                              selected={defnextReviewDate}

                              showYearDropdown
                              scrollableMonthYearDropdown
                              onChange={(date) => {
                                setFieldValue("nextReviewDate", date);
                                setnextReviewDate(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy"
                              // showTimeInput
                              name="nextReviewDate"
                              minDate={new Date()}
                              autoComplete="off"
                            // minDate={values.dateOfJoining ? new Date(values.dateOfJoining):  null}
                            />
                            <ErrorMessage className="form-feedBack" name="nextReviewDate" component="div" />
                          </div>






                        </div>

                        <div className="from-group row">



                          <div className="col-12 col-md-4 mt-3">
                            <Select
                              label="Attendance Type"
                              name="attendanceType"
                              value={values.attendanceType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ display: "block" }}
                              autoComplete="off"
                            >
                              {/* <option value="-1" label="Select Attendance Type" /> */}
                              <option value={1} label="Regular Attendance" selected />
                              <option value={2} label="Auto Present Attendance" />

                            </Select>
                            {errors.attendanceType && touched.attendanceType && (
                              <div className="invalid-text">{errors.attendanceType}</div>
                            )}
                          </div>





                        </div>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="sourceOfHire"
                              maxLength="20"
                              component={Input}
                              placeholder="Source of hire"
                              label="Source Of Hire"
                              autoComplete="off"
                            />
                          </div>

                        </div>

                        <div className="from-group row">


                          <div className="col-12 col-md-4 mt-5">
                            <input
                              name="salesRep"
                              type="checkbox"
                              // onChange={handleChange}
                              onChange={() => setFieldValue("salesRep", !values?.salesRep)}
                              onBlur={handleBlur}
                              value={values.salesRep}
                              checked={values.salesRep}
                              label="Sales Representative"
                            />
                            <label><span className="ml-2">Sales Representative</span></label>
                          </div>
                          <div className="col-12 col-md-4 mt-5">
                            <input
                              name="supportRep"
                              type="checkbox"
                              // onChange={handleChange}
                              onChange={() => setFieldValue("supportRep", !values?.supportRep)}
                              onBlur={handleBlur}
                              value={values.supportRep}
                              checked={values.supportRep}
                              label="Support Representative"
                            />
                            <label><span className="ml-2">Support Representative</span></label>
                          </div>



                        </div>



                      </div>



                      <br></br>

                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h6>Personal Information</h6>

                        <div className="from-group row">

                          <div className="col-12 col-md-4 mt-14">
                            <input
                              name="requireDeligation"
                              type="checkbox"
                              onChange={(e) => {
                                const { checked } = e.target;
                                setFieldValue('requireDeligation', checked); // Update the checkbox state
                                if (!checked) {
                                  setFieldValue('deligationId', null); // Clear deligation field when unchecked
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.requireDeligation}
                              checked={values.requireDeligation}
                              label="Require Delegation"

                            />
                            <label className="ml-2">Delegation Required</label>
                          </div>

                          {/* <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="deligation"
                              maxLength="20"
                              component={Input}
                              placeholder="Enter Deligation"
                              label="Deligation"
                              autoComplete="off"
                              disabled={!values.requireDeligation}
                            />

                          </div> */}


<div className="col-12 col-md-4 mt-3">
                        <label className="mr-4">Delegation</label>
                        <input
                          name="all_deligationId"
                          type="checkbox"
                          disabled={!values.requireDeligation}
                          onChange={() => setFieldValue("all_deligationId", !values?.all_deligationId)}
                          onBlur={handleBlur}
                          value={values.all_deligationId}
                          checked={values.all_deligationId}
                          label="Show All"
                        />
                        <label className="ml-2">Show All</label>
                        <ErrorMessage className="form-feedBack" name="all_deligationId" component="div" />
                        <SearchSelect
                          name="deligationId"
                    
                          isDisabled={!values.requireDeligation || isUserForRead && true}
                          // onBlur={() => {
                          //   handleBlur({ target: { name: "countryId" } });
                          // }}
                          onChange={(e) => {
                            setFieldValue("deligationId", e.value || null);
                            setEmployeeReportToDefault(e);
                            //dispatch(fetchAllActiveEmployees(e.value));
                          }}
                          value={
                            dashboard?.allEmployeesWithNoPermissionList?.find(
                              (option) => option.value === values.deligationId
                            ) || null
                          }
                          error={errors.deligationId}
                          touched={touched.deligationId}
                          
                          options={[
                           
                            ...dashboard.allEmployeesWithNoPermissionList.filter(x => {
                              if (values?.all_deligationId) {
                                // If "All" is selected, do not filter by department and exclude current user
                                return x.value !== values.Id;
                              } else {
                                // If "All" is not selected, filter based on departmentId and exclude current user
                                return x.departmentId === values.departmentId && x.value !== values.Id;
                              }
                            })
                          ]}
                        />

                      </div>



                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="cycleTypeId"
                              label={<span> Cycle Type</span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("cycleTypeId", e.value || null);
                                setcycleType(e);
                                // dispatch(fetchAllFormsMenu(e.value));
                              }}
                              value={(defcycleType || null)}
                              error={errors.cycleTypeId}
                              touched={touched.cycleTypeId}
                              options={dashboard.allCycleTypeList}
                            />
                          </div>




                        </div>
                        <div className="from-group row">

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="passportNo"
                              maxLength="15"
                              component={Input}
                              placeholder=" Passport No"
                              label=" Passport No"
                              autoComplete="off"
                            />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <label>Passport Expiry Date</label>
                            <DatePicker
                              className="form-control"
                              placeholder="Passport Expiry Date"
                              selected={defpassportExpiry}

                              showYearDropdown
                              scrollableMonthYearDropdown
                              onChange={(date) => {
                                setFieldValue("passportExpiry", date);
                                setpassportExpiry(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy"
                              // showTimeInput
                              name="passportExpiry"

                              autoComplete="off"
                              minDate={new Date()}

                            />
                            <ErrorMessage className="form-feedBack" name="passportExpiry" component="div" />
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <label>ID Card Expiry</label>
                            <DatePicker
                              className="form-control"
                              placeholder="ID Card Expiry Date"
                              selected={defdrivingLicenseExpiry}

                              showYearDropdown
                              scrollableMonthYearDropdown
                              onChange={(date) => {
                                setFieldValue("drivingLicenseExpiry", date);
                                setdrivingLicenseExpiry(date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd/MM/yyyy"
                              // showTimeInput
                              name="drivingLicenseExpiry"

                              autoComplete="off"
                              minDate={new Date()}
                            />
                            <ErrorMessage className="form-feedBack" name="drivingLicenseExpiry" component="div" />
                          </div>


                        </div>

                        <div className="from-group row">


                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="laborCardNo"
                              maxLength="20"
                              component={Input}
                              placeholder="Enter Labour Card No"
                              label={<span> Labour Card No</span>}
                              autoComplete="off"
                            />
                            {/* <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> */}
                          </div>


                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="emiratesNo"
                              maxLength="20"
                              component={Input}
                              placeholder="Enter Emirates Id Number"
                              label={<span> Emirates Id Number</span>}
                              autoComplete="off"
                            />
                            {/* <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> */}
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="routingCode"
                              maxLength="20"
                              component={Input}
                              placeholder="Enter Routing Code"
                              label={<span> Routing Code</span>}
                              autoComplete="off"
                            />
                            {/* <ErrorMessage style={{color:"red"}} name="nic_no" component="div" /> */}
                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="contractTypeId"
                              label={<span> Contract Type</span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {

                                setFieldValue("contractTypeId", e.value || null);
                                setcontractType(e);

                                // dispatch(fetchAllFormsMenu(e.value));
                              }}
                              value={(defcontractType || values.contractTypeId)}
                              error={errors.contractTypeId}
                              touched={touched.contractTypeId}
                              options={dashboard.allContractTypeList}
                            />
                          </div>




                        </div>


                        <div className="from-group row">


                          <div className="col-12 col-md-12 mt-3">
                            <Field
                              name="professional_summary"
                              component={TextArea}
                              placeholder="Enter Professional Summary"
                              label="Professional Summary"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        {/* <div className="from-group row">
                          <div className="col-12 col-md-12 mt-3">
                            <Field
                              name="additional_summary"
                              component={TextArea}
                              placeholder="Enter Additional Notes"
                              label="Additional Notes"
                              autoComplete="off"
                            />
                          </div>

                        </div> */}



                      </div>
                    </div>

                  )}

                  <br></br>


                  <div
                    style={{
                      backgroundColor: "#0093DD",
                      color: "white",
                      padding: "20px",
                      borderRadius: "5px",
                      border: '2px solid #adceff'
                    }}
                    onClick={toggleExtendedfoVisibility}
                  >
                    <div className="flex row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h6>Employee Extended Information</h6>
                      <KeyboardArrowDown />

                    </div>

                  </div>
                  <br></br>


                  {isExtendedfoVisible && (
                    <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>



                      <div className="from-group row">


                      </div>

                      <div className="from-group row">


                      </div>
                      {/* {<><button className="btn btn-light btn-elevate" type="button" onClick={handleChildModalShow}>
                      Open Child Modal
                    </button>

                      <Modal show={showChildModal} onHide={handleChildModalClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Child Modal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>This is the child modal.</Modal.Body>
                        <Modal.Footer></Modal.Footer>
                        <button className="btn btn-light btn-elevate" type="button" onClick={handleChildModalClose}>
                          Close Child Modal
                        </button>
                      </Modal></>} */}
                      {/* <hr></hr> */}

                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h3>Emergency Contact Information</h3>
                        <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                            <td></td>
                            <td>Name</td>
                            <td>Relation</td>
                            <td>Contact No</td>
                          </tr>

                          {defContactList?.map((obj, rightindex) => (
                            <><tr>
                              <td > <button id={rightindex} onClick={deleteRowContact} className="btn btn-danger btn-sm"> Delete</button></td>
                              <td>

                                <input
                                  className="form-control"
                                  type="text"
                                  onChange={(e) => {
                                    handleFieldChangedContact(rightindex, 'relation_name', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`relation_name-${rightindex}`]: '' })); // Clear error on change
                                  }}
                                  value={obj.relation_name}
                                />
                                {deferrors[`relation_name-${rightindex}`] && <div className="form-feedBack">{deferrors[`relation_name-${rightindex}`]}</div>}
                              </td>
                              <td>
                                {/* <select className="form-control" value={obj.relation}
                                  onChange={(e) => {
                                    handleFieldChangedContact(rightindex, 'relation', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`relation-${rightindex}`]: '' })); // Clear error on change
                                  }}
                                  id={'relation-' + rightindex} >
                                  {
                                    dashboard.allRelationCodeList?.map((x) => {
                                      return <option value={x.value}> {x.label} </option>
                                    })}

                                 
                                </select> */}

                                <input
                                  className="form-control"
                                  type="text"
                                  onChange={(e) => {
                                    handleFieldChangedContact(rightindex, 'relation_text', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`relation_text-${rightindex}`]: '' })); // Clear error on change
                                  }}
                                  value={obj.relation_text}
                                />

                                {deferrors[`relation_text-${rightindex}`] && <div className="form-feedBack">{deferrors[`relation_text-${rightindex}`]}</div>}
                              </td>
                              <td>
                                <input className="form-control" type="text"
                                  onChange={(e) => {
                                    handleFieldChangedContact(rightindex, 'contactNo', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: '' })); // Clear error on change
                                  }}
                                  value={obj.contactNo} ></input>
                                {deferrors[`contactNo-${rightindex}`] && <div className="form-feedBack">{deferrors[`contactNo-${rightindex}`]}</div>}

                              </td>
                              {/* <td>{obj.relation_emp}</td>
                            <td>{obj.contactNo}</td> */}
                            </tr>
                            </>

                          ))}

                        </table>
                        {<> <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input className="btn btn-success btn-sm" type='button' id="Contact" onClick={addRowContact} value='+Add'></input>
                          </div>

                        </div>
                        </>}
                      </div>
                      <br></br>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>

                        <h3>Work Experience</h3>
                        <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                            <td></td>
                            <td>Company</td>
                            <td>Position Held</td>
                            <td>Country</td>
                            <td>City</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                          </tr>

                          {workExperienceList?.map((obj, rightindex) => (

                            <><tr>
                              <td id={rightindex} onClick={deleteRowExperience}> <button className="btn btn-danger btn-sm"> Delete</button></td>
                              <td>
                                <input className="form-control" type="text"
                                  onChange={(e) => {
                                    handleFieldChangedExperience(rightindex, 'companyName', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`companyName-${rightindex}`]: '' })); // Clear error on change
                                  }}

                                  value={obj.companyName} id={'companyName-' + rightindex}></input>
                                {deferrors[`companyName-${rightindex}`] && <div className="form-feedBack">{deferrors[`companyName-${rightindex}`]}</div>}

                              </td>
                              <td>
                                <input className="form-control" type="text"
                                  onChange={(e) => {
                                    handleFieldChangedExperience(rightindex, 'positionHeld', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`positionHeld-${rightindex}`]: '' })); // Clear error on change
                                  }}
                                  value={obj.positionHeld} id={'positionHeld-' + rightindex}></input>
                                {deferrors[`positionHeld-${rightindex}`] && <div className="form-feedBack">{deferrors[`positionHeld-${rightindex}`]}</div>}
                              </td>
                              <td>
                                <select className="form-control" value={obj.countryId}
                                  onChange={(e) => {
                                    handleFieldChangedExperience(rightindex, 'countryId', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`countryId-${rightindex}`]: '' })); // Clear error on change
                                  }}

                                  id={'countryId-' + rightindex} >
                                  <option value=""> --Select--</option>
                                  {
                                    dashboard.allCountry?.map((x) => {
                                      return <option value={x.value}> {x.label} </option>
                                    })}

                                  {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                </select>
                                {deferrors[`countryId-W-${rightindex}`] && <div className="form-feedBack">{deferrors[`countryId-W-${rightindex}`]}</div>}
                              </td>
                              <td>
                                <select className="form-control" value={obj.cityId}

                                  onChange={(e) => {
                                    handleFieldChangedExperience(rightindex, 'cityId', e.target.value);
                                    setErrors((prev) => ({ ...prev, [`cityId-${rightindex}`]: '' })); // Clear error on change
                                  }}

                                  id={'cityId-' + rightindex} >
                                  <option value=""> --Select--</option>
                                  {

                                    dashboard.allCity?.map((x) => {

                                      if (x.code == obj.countryId) {
                                        return <option value={x.value}> {x.label} </option>
                                      }
                                    })}

                                  {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                </select>
                                {deferrors[`cityId-W-${rightindex}`] && <div className="form-feedBack">{deferrors[`cityId-W-${rightindex}`]}</div>}
                              </td>

                              <td>
                                <DatePicker
                                  className="form-control"
                                  placeholder="Start Date"
                                  // selected={new Date(obj?.startDate)}
                                  selected={obj?.startDate ? new Date(obj.startDate) : null}
                                  showYearDropdown
                                  scrollableMonthYearDropdown
                                  onChange={(el) => {
                                    handleDatePicker(el, 'startDate', rightindex, '');
                                    setErrors((prev) => ({ ...prev, [`startDate_W-${rightindex}`]: '' })); // Clear error on change
                                  }
                                  }
                                  id={"endDate_W-" + rightindex}
                                  timeInputLabel="Time:"
                                  dateFormat="dd/MM/yyyy"
                                  // showTimeInput
                                  name="startDate"
                                  disabled={isUserForRead}
                                  autoComplete="off"
                                  maxDate={new Date()}
                                  minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                />
                                {deferrors[`startDate_W-${rightindex}`] && <div className="form-feedBack">{deferrors[`startDate_W-${rightindex}`]}</div>}
                              </td>
                              <td>
                                <DatePicker
                                  className="form-control"
                                  placeholder="End Date"
                                  // selected={new Date(obj.endDate || currentDate)}
                                  selected={obj?.endDate ? new Date(obj?.endDate) : null}
                                  showYearDropdown
                                  scrollableMonthYearDropdown
                                  onChange={(el) => {
                                    handleDatePicker(el, 'endDate', rightindex, '');
                                    setErrors((prev) => ({ ...prev, [`endDate_W-${rightindex}`]: '' })); // Clear error on change
                                  }
                                  }
                                  id={"endDate_W" + rightindex}
                                  timeInputLabel="Time:"
                                  dateFormat="dd/MM/yyyy"
                                  // showTimeInput
                                  name="endDate"
                                  disabled={isUserForRead}
                                  autoComplete="off"
                                  maxDate={new Date()}
                                  minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                />
                                {deferrors[`endDate_W-${rightindex}`] && <div className="form-feedBack">{deferrors[`endDate_W-${rightindex}`]}</div>}
                              </td>
                            </tr>
                            </>
                          ))}


                        </table>
                        {<> <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input className="btn btn-success btn-sm" type='button' id="Experience" onClick={addRowExprerience} value='+Add'></input>
                          </div>

                        </div>
                        </>}
                      </div>
                      <br></br>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h3>Academic Info</h3>
                        <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                            <td></td>
                            <td>Institution</td>
                            <td>Degree</td>
                            <td>Country</td>
                            <td>City</td>
                            <td>CGPA</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                          </tr>

                          {academicList?.map((obj, rightindex) => (
                            <>

                              <tr>
                                <td id={rightindex} onClick={deleteRowAcademic}> <button className="btn btn-danger btn-sm"> Delete</button></td>
                                <td>
                                  <select className="form-control" value={obj.institutionId}

                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, 'institutionId', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`institutionId-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    id={'institutionId-' + rightindex} >
                                    <option value="">--Select--</option>
                                    {
                                      dashboard.allInstitution?.map((x) => {
                                        return <option value={x.value}> {x.label} </option>
                                      })}

                                    {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                  </select>
                                  {deferrors[`institutionId-${rightindex}`] && <div className="form-feedBack">{deferrors[`institutionId-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <select className="form-control" value={obj.degreeId}

                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, 'degreeId', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`degreeId-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    id={'degreeId-' + rightindex} >
                                    <option value="">--Select--</option>
                                    {
                                      dashboard.allDegreeTitle?.map((x) => {
                                        return <option value={x.value}> {x.label} </option>
                                      })}
                                    {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                  </select>
                                  {deferrors[`degreeId-${rightindex}`] && <div className="form-feedBack">{deferrors[`degreeId-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <select className="form-control" value={obj.countryId}

                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, 'countryId', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`countryId-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    id={'countryId-' + rightindex} >
                                    <option value="">--Select--</option>
                                    {
                                      dashboard.allCountry?.map((x) => {
                                        return <option value={x.value}> {x.label} </option>
                                      })}

                                    {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                  </select>
                                  {deferrors[`countryId-A-${rightindex}`] && <div className="form-feedBack">{deferrors[`countryId-A-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <select className="form-control" value={obj.cityId}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, 'cityId', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`cityId-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    id={'cityId-' + rightindex} >
                                    <option value=""> --Select--</option>

                                    {

                                      dashboard.allCity?.map((x) => {
                                        if (x.code == obj.countryId) {
                                          return <option value={x.value}> {x.label} </option>
                                        }
                                      })}

                                    {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                  </select>
                                  {deferrors[`cityId-A-${rightindex}`] && <div className="form-feedBack">{deferrors[`cityId-A-${rightindex}`]}</div>}
                                </td>

                                <td>
                                  <input className="form-control" type="text"
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, 'gpa', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`gpa-${rightindex}`]: '' })); // Clear error on change
                                    }}
                                    value={obj.gpa} id={'gpa-' + rightindex}></input>
                                  {deferrors[`gpa-${rightindex}`] && <div className="form-feedBack">{deferrors[`gpa-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="Start Date"
                                    // selected={new Date(obj.startDate || currentDate)}
                                    selected={obj?.startDate ? new Date(obj?.startDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerAcademic(el, 'startDate', rightindex, '')}
                                    id={"startDate_A-" + rightindex}
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy"
                                    // showTimeInput
                                    name="startDate"
                                    disabled={isUserForRead}
                                    autoComplete="off"
                                    minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                    maxDate={new Date()}
                                  />
                                  {deferrors[`startDate_A-${rightindex}`] && <div className="form-feedBack">{deferrors[`startDate_A-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="End Date"
                                    // selected={new Date(obj.endDate || currentDate)}
                                    selected={obj?.endDate ? new Date(obj?.endDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerAcademic(el, 'endDate', rightindex, '')}
                                    id={"endDate_A-" + rightindex}
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy"
                                    // showTimeInput
                                    name="endDate"
                                    disabled={isUserForRead}
                                    autoComplete="off"
                                    minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}

                                  />
                                  {deferrors[`endDate_A-${rightindex}`] && <div className="form-feedBack">{deferrors[`endDate_A-${rightindex}`]}</div>}
                                </td>
                              </tr>
                            </>
                          ))}

                        </table>
                        {<> <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input className="btn btn-success btn-sm" type='button' id="Academic" onClick={addRowAcademic} value='+Add'></input>
                          </div>

                        </div>
                        </>}
                      </div>
                      <br></br>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>

                        <h3>Employee Skills</h3>
                        <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>

                            <td></td>
                            <td>Skill</td>
                            <td>Description</td>

                            <td>Rating</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                          </tr>
                          {skillsList?.map((obj, rightindex) => (
                            <>
                              <tr>
                                <td id={rightindex} onClick={deleteRowSkills}> <button className="btn btn-danger btn-sm"> Delete</button></td>

                                <td>
                                  <input className="form-control" type="text"
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, 'skill', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`skill-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    value={obj.skill} id={'skill-' + rightindex}></input>
                                  {deferrors[`skill-${rightindex}`] && <div className="form-feedBack">{deferrors[`skill-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <input className="form-control" type="text"
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, 'description', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`description-${rightindex}`]: '' })); // Clear error on change
                                    }}
                                    value={obj.description} id={'description-' + rightindex}></input>
                                  {deferrors[`description-${rightindex}`] && <div className="form-feedBack">{deferrors[`description-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <Select
                                    name="ratingScale"
                                    value={obj.ratingScale}
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, 'ratingScale', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`ratingScale-${rightindex}`]: '' })); // Clear error on change
                                    }}
                                    onBlur={handleBlur}
                                    style={{ display: "block" }}
                                    id={'ratingScale-' + rightindex}
                                  >
                                    <option label="--Select--" />
                                    <option value="1" label="1" />
                                    <option value="2" label="2" />
                                    <option value="3" label="3" />
                                    <option value="4" label="4" />
                                    <option value="5" label="5" />
                                    <option value="6" label="6" />
                                    <option value="7" label="7" />
                                    <option value="8" label="8" />
                                    <option value="9" label="9" />
                                    <option value="10" label="10" />
                                  </Select>
                                  {deferrors[`ratingScale-${rightindex}`] && <div className="form-feedBack">{deferrors[`ratingScale-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="Start Date"
                                    // selected={new Date(obj.startDate || currentDate)}
                                    selected={obj?.startDate ? new Date(obj?.startDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerSkills(el, 'startDate', rightindex, '')}
                                    id={"startDate-" + rightindex}
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy"
                                    // showTimeInput
                                    name="startDate"
                                    disabled={isUserForRead}
                                    autoComplete="off"
                                    minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                    maxDate={new Date()}
                                  />
                                  {deferrors[`startDate-${rightindex}`] && <div className="form-feedBack">{deferrors[`startDate-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="End Date"
                                    // selected={new Date(obj.endDate || currentDate)}
                                    selected={obj?.endDate ? new Date(obj?.endDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerSkills(el, 'endDate', rightindex, '')}
                                    id={"endDate-" + rightindex}
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy"
                                    // showTimeInput
                                    name="endDate"
                                    disabled={isUserForRead}
                                    autoComplete="off"
                                    minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}

                                  />
                                  {deferrors[`endDate-${rightindex}`] && <div className="form-feedBack">{deferrors[`endDate-${rightindex}`]}</div>}
                                </td>
                              </tr>
                            </>
                          ))}

                        </table>
                        {<> <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input className="btn btn-success btn-sm" type='button' id="Academic" onClick={addRowSkills} value='+Add'></input>
                          </div>

                        </div>
                        </>}
                      </div>

                      <br></br>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>

                        <h3>Incident Info</h3>
                        <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>

                            <td></td>

                            <td>Incident</td>
                            <td>Action Taken</td>
                            <td>Action Taken By</td>
                            <td>Incident Date</td>

                          </tr>
                          {incidentList?.map((obj, rightindex) => (
                            <>

                              <tr>

                                <td id={rightindex} onClick={deleteRowIncident} > <button className="btn btn-danger btn-sm"> Delete</button></td>
                                <td>
                                  <input className="form-control" type="text"
                                    onChange={(e) => {
                                      handleFieldChangedIncident(rightindex, 'incidentDetail', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`incidentDetail-${rightindex}`]: '' })); // Clear error on change
                                    }}
                                    value={obj.incidentDetail} id={'incidentDetail-' + rightindex}>

                                  </input>
                                  {deferrors[`incidentDetail-${rightindex}`] && <div className="form-feedBack">{deferrors[`incidentDetail-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <input className="form-control" type="text"

                                    onChange={(e) => {
                                      handleFieldChangedIncident(rightindex, 'actionTaken', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`actionTaken-${rightindex}`]: '' })); // Clear error on change
                                    }}
                                    value={obj.actionTaken} id={'actionTaken-' + rightindex}></input>
                                  {/* {deferrors[`incidentDetail-${rightindex}`] && <div className="form-feedBack">{deferrors[`actionTaken-${rightindex}`]}</div>} */}
                                  {deferrors[`actionTaken-${rightindex}`] && <div className="form-feedBack">{deferrors[`actionTaken-${rightindex}`]}</div>}

                                </td>

                                <td>
                                  <select className="form-control"
                                    value={obj.actionTakenBy}
                                    onChange={(e) => {
                                      handleFieldChangedIncident(rightindex, 'actionTakenBy', e.target.value);
                                      setErrors((prev) => ({ ...prev, [`actionTakenBy-${rightindex}`]: '' })); // Clear error on change
                                    }}

                                    id={'actionTakenBy-' + rightindex} >
                                    <option value="">--Select--</option>
                                    {
                                      dashboard.allEmployeesWithNoPermissionList?.filter(x => x.value != values.Id).map((x) => {
                                        return <option value={x.value}> {x.label} </option>
                                      })

                                    }
                                    {/* options={dashboard.allEmployees.filter(x => x.value != values.Id)} */}

                                    {/* disabled={defContactList.find(el => el.relation == x.value) ? true : false} */}
                                  </select>
                                  {deferrors[`actionTakenBy-${rightindex}`] && <div className="form-feedBack">{deferrors[`actionTakenBy-${rightindex}`]}</div>}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="Date"
                                    // selected={new Date(obj.incidentDate || currentDate)}
                                    selected={obj?.incidentDate ? new Date(obj?.incidentDate) : null}
                                    // showYearDropdown
                                    // scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerIncident(el, 'incidentDate', rightindex, '')}
                                    id={"incidentDate-" + rightindex}
                                    timeInputLabel="Time:"
                                    dateFormat="dd/MM/yyyy"
                                    // showTimeInput
                                    name="incidentDate"
                                    disabled={isUserForRead}
                                    autoComplete="off"
                                    minDate={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                    maxDate={new Date()}
                                  />
                                  {deferrors[`incidentDate-${rightindex}`] && <div className="form-feedBack">{deferrors[`incidentDate-${rightindex}`]}</div>}
                                </td>

                                


                              </tr>
                            </>
                          ))}

                        </table>
                        {<> <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input className="btn btn-success btn-sm" type='button' id="Incident" onClick={addRowIncident} value='+Add'></input>
                          </div>

                        </div>
                        </>}
                      </div>
                    </div>

                  )}
                  <div className="from-group row">
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead ? (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-primary btn-elevate"
                >
                  Ok
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => {
                    handleSubmit()
                    if (scrollRef?.current) {
                      scrollRef.current.scrollIntoView({
                        behavior: "smooth"
                      });
                    }

                  }}
                  className="btn btn-primary btn-elevate"
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik >
    </>
  );
}
