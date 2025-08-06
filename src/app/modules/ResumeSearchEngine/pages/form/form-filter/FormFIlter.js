import React, { useMemo, useState, useEffect, useCallback } from "react"
import * as Yup from 'yup';
import { Field, Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import { fetchAllCity, fetchAllCountry, fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Form, Modal } from "react-bootstrap";
import {
  Card,
  CardHeader,
  Input,
  Select,
} from "../../../../../../_metronic/_partials/controls"
import { amountLimitDynamic, formatDates } from "../../../../../utils/common";


pdfMake.vfs = pdfFonts.pdfMake.vfs;





const prepareFilter = (queryParams, values) => {
  const {
    // General
    searchText,
    departmentId,
    designationId,
    gradeId,
    locationId,
    countryId,
    cityId,
    appointmentTypeId,

    // Vacancy detail
    applicantStatusId,
    priorityTypeId,
    desireFromDateOfApp,
    desireToDateOfApp,
    applicationFromDate,
    applicationToDate,

    // Professional information
    workExpFrom,
    workExpTo,
    expectedSalaryRangeFrom,
    expectedSalaryRangeTo,
    expectedSalaryCurrencyId,
    expectedSalaryPayTypeId,
    companyName,
    preferredQualificationId,

    // Personal Information
    preferredAgeFrom,
    preferredAgeTo,
    maritalStatus,
    gender,
    religionId,
    nationality,
    applicantCanJoin,
  } = values;

  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText?.trim()) {
    filter.searchText = searchText.trim();
  }

  if (departmentId) filter.departmentId = departmentId;
  if (designationId) filter.designationId = designationId;
  if (gradeId) filter.gradeId = gradeId;
  if (locationId) filter.locationId = locationId;
  if (countryId) filter.countryId = countryId;
  if (cityId) filter.cityId = cityId;
  if (appointmentTypeId) filter.appointmentTypeId = appointmentTypeId;

  // Vacancy detail
  if (applicantStatusId) filter.applicantStatusId = applicantStatusId;
  if (priorityTypeId) filter.priorityTypeId = priorityTypeId;
  if (desireFromDateOfApp) filter.desireFromDateOfApp = desireFromDateOfApp;
  if (desireToDateOfApp) filter.desireToDateOfApp = desireToDateOfApp;
  if (applicationFromDate) filter.applicationFromDate = applicationFromDate;
  if (applicationToDate) filter.applicationToDate = applicationToDate;

  // Professional information
  if (workExpFrom) filter.workExpFrom = workExpFrom;
  if (workExpTo) filter.workExpTo = workExpTo;
  if (expectedSalaryRangeFrom) filter.expectedSalaryRangeFrom = expectedSalaryRangeFrom;
  if (expectedSalaryRangeTo) filter.expectedSalaryRangeTo = expectedSalaryRangeTo;
  if (expectedSalaryCurrencyId) filter.expectedSalaryCurrencyId = expectedSalaryCurrencyId;
  if (expectedSalaryPayTypeId || expectedSalaryPayTypeId == 0) filter.expectedSalaryPayTypeId = expectedSalaryPayTypeId;
  if (companyName?.trim()) filter.companyName = companyName.trim();
  if (preferredQualificationId) filter.preferredQualificationId = preferredQualificationId;

  // Personal Information
  if (preferredAgeFrom) filter.preferredAgeFrom = preferredAgeFrom;
  if (preferredAgeTo) filter.preferredAgeTo = preferredAgeTo;
  if (maritalStatus) filter.maritalStatus = maritalStatus;
  if (gender) filter.gender = gender;
  if (religionId) filter.religionId = religionId;
  if (nationality) filter.nationality = nationality;
  if (applicantCanJoin) filter.applicantCanJoin = applicantCanJoin;

  newQueryParams.filter = filter;
  return newQueryParams;
};


export function FormFIlter({ listLoading, user }) {


  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext()
  const [Loading, setLoading] = useState(false)



  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])




  // function addCommas(nStr) {
  //   nStr += '';
  //   var x = nStr.split('.');
  //   var x1 = x[0];
  //   var x2 = x.length > 1 ? '.' + x[1] : '';
  //   var rgx = /(\d+)(\d{3})/;
  //   while (rgx.test(x1)) {
  //     x1 = x1.replace(rgx, '$1' + ',' + '$2');
  //   }
  //   return x1 + x2;
  // }

  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)

    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      formUIProps.setQueryParams(newQueryParams)

    }
  }

  const { dashboard } = useSelector((state) => state);
  useEffect(() => {

    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(412, "allPriorityTypeList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
    dispatch(fetchAllCountry());
    dispatch(fetchAllCity());
    dispatch(fetchAllFormsMenu(409, "allAppointmentTypeList"));
    dispatch(fetchAllFormsMenu(408, "allApplicationStatusList")); // For All application status
    dispatch(fetchAllFormsMenu(108, "allQualificationList"));
    dispatch(fetchAllFormsMenu(190, "allMaritalStatus"));
    dispatch(fetchAllFormsMenu(87, "allReligionChildMenus"));
    dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
  }, []);


  const filteredCities = (countryId) => {
    return dashboard?.allCity?.filter((city) => city.code === countryId) || [];
  };




  const salaryPayTypeIdOptions = [

    { value: 0, label: "Per Month" },
    { value: 1, label: "Per Year" },
  ];



  const initialFilterValues = {

    //job filter
    searchText: "",
    departmentId: null,
    designationId: null,
    gradeId: null,
    locationId: null,
    countryId: null,
    cityId: null,
    appointmentTypeId: null,


    //vacancy detail
    applicantStatusId: null,
    priorityTypeId: null,
    desireFromDateOfApp: null,
    desireToDateOfApp: null,
    applicationFromDate: null, applicationToDate: null,

    // Professional information
    workExpFrom: "",
    workExpTo: "",
    expectedSalaryRangeFrom: "",
    expectedSalaryRangeTo: "",
    expectedSalaryCurrencyId: null,
    expectedSalaryPayTypeId: null,
    companyName: '',
    preferredQualificationId: null,


    // Personal Information
    preferredAgeFrom: "",
    preferredAgeTo: "",
    maritalStatus: null,
    gender: "",
    religionId: null,
    nationality: null,
    applicantCanJoin: "",

  };


  const nationalityOptions = [
    { label: "Pakistani", value: "Pakistani" },
    { label: "Other", value: "Other" },
  ];


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialFilterValues}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset, touched, errors,
        }) => (
          <>
            <form onSubmit={handleSubmit}>
              {/* <Card>
                <CardHeader title={CurrentModuleName()} />
              </Card> */}

              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  marginBottom: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >

                <h6>Job Filter</h6>
                <div className="form-group row">


                  <div className="col-12 col-md-4 mt-3">
                    <label>Job Title</label>
                    <Field
                      component={Input}
                      name="searchText"
                      placeholder="Enter job title"
                      type="text"
                      onBlur={handleBlur}
                      value={values.searchText}
                      onChange={(e) => {
                        setFieldValue("searchText", e.target.value);
                        handleSubmit();
                      }}
                    />
                  </div>


                  <div className="row col-12 col-md-12">

                    {/* Department */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="departmentId"
                        label="Department"
                        onChange={(e) => {
                          setFieldValue("departmentId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allDept?.find(
                            (option) => option.value === values.departmentId
                          ) || null
                        }
                        // options={dashboard?.allDept}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allDept) ? dashboard?.allDept : []),]}
                      />
                    </div>

                    {/* Designation */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="designationId"
                        label="Designation"
                        onChange={(e) => {
                          setFieldValue("designationId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allDesignations?.find(
                            (option) => option.value === values.designationId
                          ) || null
                        }
                        // options={dashboard?.allDesignations}
                           options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allDesignations) ? dashboard?.allDesignations: []),]}
                      />
                    </div>


                    {/* Grade */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="gradeId"
                        label="Grade"
                        onChange={(e) => {
                          setFieldValue("gradeId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allEmployeegradeList?.find(
                            (option) => option.value === values.gradeId
                          ) || null
                        }
                        // options={dashboard?.allEmployeegradeList}
                        options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allEmployeegradeList) ? dashboard?.allEmployeegradeList: []),]}
                      />
                    </div>


                    {/* Location */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="locationId"
                        label="Location"
                        onChange={(e) => {
                          setFieldValue("locationId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard.allLocationChildMenus?.find(
                            (option) => option.value === values.locationId
                          ) || null
                        }
                        // options={dashboard.allLocationChildMenus}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard.allLocationChildMenus) ? dashboard.allLocationChildMenus: []),]}
                      />
                    </div>


                    {/* Country */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="countryId"
                        label="Country"
                        onChange={(e) => {
                          const selectedCountryId = e.value || null;
                          setFieldValue("countryId", selectedCountryId);
                          console.log("selectedCountryId1111", selectedCountryId)
                          setFieldValue("cityId", null); // Reset city on country change
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allCountry?.find(
                            (option) => option.value === values.countryId
                          ) || null
                        }
                        // options={dashboard?.allCountry}
                           options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allCountry) ? dashboard?.allCountry: []),]}
                      />
                    </div>

                    {/* City */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="cityId"
                        label={<span>City</span>}
                        // isDisabled={!values.countryId}
                        onChange={(e) => {
                          setFieldValue("cityId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          filteredCities(values.countryId).find(
                            (option) => option.value === values.cityId
                          ) || null
                        }
                        // options={filteredCities(values.countryId)}
                               options={[{ label: '--Select--', value: '' }, ...(Array.isArray(filteredCities(values.countryId)) ? filteredCities(values.countryId): []),]}

                      />
                    </div>

                    {/* Appointment */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="appointmentTypeId"
                        label={
                          <span>
                            Appointment Type
                          </span>
                        }

                        onChange={(e) => {
                          setFieldValue("appointmentTypeId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allAppointmentTypeList?.find(
                            (option) => option.value === values.appointmentTypeId
                          ) || null
                        }

                        // options={dashboard?.allAppointmentTypeList}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allAppointmentTypeList) ? dashboard?.allAppointmentTypeList: []),]}

                      />
                    </div>



                  </div>




                </div>


              </div>


              {/* Vacancy detail */}
              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  marginBottom: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                <h6>Vacancy Detail</h6>
                <div className="form-group row">



                  <div className="row col-12 col-md-12">



                    {/* Applicant status */}
                    <div className="col-12 col-md-4 mt-3">


                      <SearchSelect
                        name="applicantStatusId"
                        label={<span>Applicant Status</span>}
                        className="form-control"
                        style={{ width: '130px' }}

                        value={
                          dashboard?.allApplicationStatusList?.find(
                            (x) => x.value === values.applicantStatusId
                          ) || null
                        }

                        onChange={(e) => {
                          const selectedValue = e?.value;
                          setFieldValue("applicantStatusId", selectedValue);
                          handleSubmit();


                        }}

                        // options={dashboard?.allApplicationStatusList || []}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allApplicationStatusList) ? dashboard?.allApplicationStatusList: []),]}
                        getOptionLabel={(x) => x.label} // optional: customize label rendering
                        getOptionValue={(x) => x.value} // optional: customize value extraction
                        placeholder="Select Status"
                      />



                    </div>


                    {/* Priority */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="priorityTypeId"
                        label="Priority"
                        onChange={(e) => {
                          setFieldValue("priorityTypeId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allPriorityTypeList?.find(
                            (option) => option.value === values.priorityTypeId
                          ) || null
                        }
                        // options={dashboard?.allPriorityTypeList}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allPriorityTypeList) ? dashboard?.allPriorityTypeList: []),]}
                      />
                    </div>
                    {/* Job Status */}


                  </div>
                  <div className="row col-12 col-md-12">
                    {/* Date From */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Desire Date of Appointment (From)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="From Date"
                        selected={
                          values?.desireFromDateOfApp
                            ? new Date(values.desireFromDateOfApp)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')
                          setFieldValue("desireFromDateOfApp", selectedDate);
                          setFieldValue("desireToDateOfApp", selectedDate);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="desireFromDateOfApp"
                        autoComplete="off"
                      />
                    </div>

                    {/* Date To */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Desire Date of Appointment (To)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="To Date"
                        selected={
                          values?.desireToDateOfApp
                            ? new Date(values.desireToDateOfApp)
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue("desireToDateOfApp", date);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="desireToDateOfApp"
                        autoComplete="off"
                        minDate={values?.desireFromDateOfApp ? new Date(values.desireFromDateOfApp) : new Date()}
                      />
                    </div>
                  </div>


                  {/* row 4*/}
                  <div className="row col-12 col-md-12">


                    {/* Date From */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Applied Date (From)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="From Date"
                        selected={
                          values?.applicationFromDate
                            ? new Date(values.applicationFromDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, 'yyyy-MM-dd')

                          setFieldValue("applicationFromDate", selectedDate);
                          setFieldValue("applicationToDate", selectedDate);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="applicationFromDate"
                        autoComplete="off"
                      />
                    </div>

                    {/* Date To */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Applied Date (To)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="To Date"
                        selected={
                          values?.applicationToDate
                            ? new Date(values.applicationToDate)
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue("applicationToDate", date);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="applicationToDate"
                        autoComplete="off"
                        minDate={values?.applicationFromDate ? new Date(values.applicationFromDate) : new Date()}
                      />
                    </div>

                  </div>
                </div>
              </div>



              {/*Professional Information */}


              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  marginBottom: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                <h6>Professional Information</h6>
                <div className="form-group row">
                  <div className="row col-12 col-md-12">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience From
                        </span>
                      </label>
                      <Field
                        name="workExpFrom"
                        component={Input}
                        placeholder="Enter work experience (from)"

                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFieldValue("workExpFrom", selectedValue);
                          handleSubmit();


                        }}

                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Work Experience To
                        </span>
                      </label>
                      <Field
                        name="workExpTo"
                        component={Input}
                        placeholder="Enter work experience (to)"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFieldValue("workExpTo", selectedValue);
                          handleSubmit();


                        }}

                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="row col-12 col-md-12">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="expectedSalaryRangeFrom"
                        component={Input}
                        placeholder="Enter expected salary range(from)"
                        label={<span> Expected Salary Range(From)</span>}
                        autoComplete="off"
                        type="number"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          console.log("selectedValue111", e.target.value)
                          setFieldValue("expectedSalaryRangeFrom", selectedValue);
                          handleSubmit();


                        }}
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="expectedSalaryRangeTo"
                        component={Input}
                        placeholder="Enter expected salary range(to)"
                        label={<span> Expected Salary Range(To)</span>}
                        autoComplete="off"
                        type="number"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFieldValue("expectedSalaryRangeTo", selectedValue);
                          handleSubmit();


                        }}
                      />
                    </div>


                    <div className="col-12 col-md-2 mt-3">
                      <SearchSelect
                        name="expectedSalaryCurrencyId"
                        label={<span> Currency</span>}

                        onChange={(e) => {
                          setFieldValue("expectedSalaryCurrencyId", e.value || null);
                          handleSubmit();


                        }}
                        value={
                          dashboard.allCurrencyCodeList?.find(
                            (option) => option.value === values.expectedSalaryCurrencyId
                          ) || null
                        }

                        // options={dashboard.allCurrencyCodeList}
                        options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard.allCurrencyCodeList) ? dashboard.allCurrencyCodeList: []),]}
                      />
                    </div>


                    <div className="col-12 col-md-2 mt-3">
                      <SearchSelect
                        name="expectedSalaryPayTypeId"
                        label={<span> Per Month / Per Year</span>}

                        value={salaryPayTypeIdOptions.find(
                          (option) => option.value === values.expectedSalaryPayTypeId
                        ) || null}
                        onChange={(e) => {
                          console.log("expectedSalaryPayTypeId00", e.value)
                          setFieldValue("expectedSalaryPayTypeId", e.value)
                          console.log("expectedSalaryPayTypeId111", values.expectedSalaryPayTypeId)
                          handleSubmit();
                        }}



                        // options={salaryPayTypeIdOptions}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(salaryPayTypeIdOptions) ? salaryPayTypeIdOptions: []),]}
                      />
                    </div>



                  </div>

                  <div className="row col-12 col-md-12">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="companyName"
                        component={Input}
                        label="Organization Name"
                        placeholder="Enter company"
                        autoComplete="off"
                        onChange={(e) => {
                          setFieldValue("companyName", e.target.value)
                          handleSubmit();
                        }}

                      />

                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="preferredQualificationId"
                        label={
                          <span>
                            Preferred Qualification
                          </span>
                        }

                        onChange={(e) => {
                          setFieldValue("preferredQualificationId", e.value || null);
                          handleSubmit();
                        }}
                        value={
                          dashboard?.allQualificationList?.find(
                            (option) => option.value === values.preferredQualificationId
                          ) || null
                        }

                        // options={dashboard?.allQualificationList}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allQualificationList) ? dashboard?.allQualificationList: []),]}


                      />
                    </div>


                  </div>


                </div>
              </div>


              {/*Personal  Information */}


              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  marginBottom: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                <h6>Personal Information</h6>
                <div className="form-group row">
                  <div className="row col-12 col-md-12">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Preferred Age From
                        </span>
                      </label>
                      <Field
                        name="preferredAgeFrom"
                        component={Input}
                        placeholder="Enter preferred age (from)"
                        onChange={(e) => {
                          setFieldValue("preferredAgeFrom", e.target.value || null);
                          if (e.target.value && values.preferredAgeTo) {
                            handleSubmit();
                          }

                        }}
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}

                      />
                  
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        <span>
                          Preferred Age To
                        </span>
                      </label>
                      <Field
                        name="preferredAgeTo"
                        component={Input}
                        placeholder="Enter preferred age (to)"
                        onChange={(e) => {
                        
                          setFieldValue("preferredAgeTo", e.target.value || null);
                           
                           if (values.preferredAgeFrom && e.target.value) {
                            handleSubmit();
                          }

                        }}
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            2
                          );
                        }}

                      />
                 
                    </div>



                  </div>
                  <div className="row col-12 col-md-12">

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        label={
                          <span>
                            Marital Status
                          </span>
                        }

                        name="maritalStatus"
                        onChange={(e) => {
                          setFieldValue("maritalStatus", e?.value ?? null);
                          handleSubmit();
                        }}

                        value={
                          dashboard.allMaritalStatus?.find(
                            (option) => String(option.value) === String(values.maritalStatus)
                          ) || null
                        }

                        // options={dashboard.allMaritalStatus}
                         options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allMaritalStatus) ? dashboard?.allMaritalStatus: []),]}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Gender</span>}
                        name="gender"
                        value={values.gender}
                        // onChange={handleChange}

                        style={{ display: "block" }}
                        autoComplete="off"
                        onChange={(e) => {
                          setFieldValue("gender", e.target.value)

                          handleSubmit()
                        }}

                      >
                        <option label="Select Gender" />
                        <option value="Male" label="Male" />
                        <option value="Female" label="Female" />

                      </Select>


                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="religionId"
                        label={<span> Religion</span>}

                        onChange={(e) => {
                          setFieldValue("religionId", e.value || null);
                          handleSubmit()
                        }}
                        value={
                          dashboard.allReligionChildMenus?.find(
                            (option) => option.value === values.religionId
                          ) || null
                        }

                        // options={dashboard.allReligionChildMenus}
                          options={[{ label: '--Select--', value: '' }, ...(Array.isArray(dashboard?.allReligionChildMenus) ? dashboard?.allReligionChildMenus: []),]}
                      />
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        label={<span> Nationality</span>}
                        name="nationality"
                        value={nationalityOptions.find(option => option.value === values.nationality) || null}
                        onChange={(e) => {
                          setFieldValue("nationality", e?.value ?? null);
                          handleSubmit();
                        }}
                        // options={nationalityOptions}
                        options={[{ label: '--Select--', value: '' }, ...(Array.isArray(nationalityOptions) ? nationalityOptions: []),]}
                        placeholder="Select Nationality"
                      />

                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="applicantCanJoin"
                        component={Input}
                        placeholder="Enter applicant can join"
                        label={<span> Applicants who can join within (Days)</span>}
                        autoComplete="off"
                        type="number"
                        onChange={(selectedOption) => {
                          setFieldValue("applicantCanJoin", selectedOption.target.value);
                          console.log("applicantCanJoin1111", selectedOption.target.value)
                          handleSubmit();
                        }}
                      />
                    </div>
                  </div>





                </div>

              </div>

            </form>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  handleReset(); // Resets form
                  applyFilter(initialFilterValues); // Clears filter state
                }}
                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>


            </Modal.Footer>

          </>
        )}
      </Formik >
    </>
  );
}

