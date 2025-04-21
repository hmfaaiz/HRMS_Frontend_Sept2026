import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./ReligionUIHelpers";

const DesignationUIContext = createContext();

export function useDesignationUIContext() {
  return useContext(DesignationUIContext);
}

export const ReceiptUIConsumer = DesignationUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function DesignationUIProvider({ DesignationUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);
  const initUser = {
    firstName:'',
    lastName: '',
    middleName:'',
    employeeCode: '',
    title: '',
    subsidiaryId: '',
    gradeId: '',
    designationId : '',
    departmentId : '',
    teamId: null,
    payrollGroupId: '',
    regionId: null,
    employeeTypeId: '',
    locationId: '',
    countryId:null,
    cityId: null,
    dateOfJoining: '',
    dateOfBirth: null,
    nic_no:'',
    passportNo: '',
    email:'',
    phone_home: '',
    phone_official: '',
    phone_cell: '',
    dateOfConfirmationEnter: '',
    dateOfConfirmationDue: '',
    dateOfConfirmation: '',
    dateOfContractExpiry: '',
    gender: '',
    maritalStatus: '',
    religionId: '',
    nationality: '',
    religionId:'',
    salesRep: '',
    supportRep: '',
    sourceOfHire: '',
    lastReviewDate: '',
    nextReviewDate: '',
    laborCardNo: '',
    drivingLicenseExpiry: '',
    emiratesId: '',
    emiratesNo: '',
    passportExpiry: '',
    nicExpiry: '',
    // deligation: '',
    personId: '',
    routingCode: '',
    contractTypeId: '',
    cycleTypeId: '',
    requireDeligation: '',
    reportTo:null,
    defaultShiftId:"",
    //defContactList: []
    attendanceType:1,
    employeeStatusId:"",
    codeAuto:"",
    approvedForPayroll:"",
    codePrefix:"",
    additional_summary:"",
    deligationId:"",
  };

 

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    newSkillButtonClick:          DesignationUIEvents.newSkillButtonClick,
    newIncidentButtonClick:       DesignationUIEvents.newIncidentButtonClick,
    newWorkExperienceButtonClick: DesignationUIEvents.newWorkExperienceButtonClick,
    newContactButtonClick:        DesignationUIEvents.newContactButtonClick,
    newAcademicButtonClick:       DesignationUIEvents.newAcademicButtonClick,
    newDesignationButtonClick:    DesignationUIEvents.newDesignationButtonClick,
    openEditDesignationDialog:    DesignationUIEvents.openEditDesignationDialog,
    openDeleteDesignationDialog:  DesignationUIEvents.openDeleteDesignationDialog,
    openActiveDesignationDialog:  DesignationUIEvents.openActiveDesignationDialog,
    openReadDesignationDialog:    DesignationUIEvents.openReadDesignationDialog,
  };
  return (
    <DesignationUIContext.Provider value={value}>{children}</DesignationUIContext.Provider>
  );
}
