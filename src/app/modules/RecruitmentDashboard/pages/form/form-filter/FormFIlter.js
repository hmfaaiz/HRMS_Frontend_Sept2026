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
import { Accordion, Button, Card } from "react-bootstrap";
import {
  // Card,
  CardHeader,
  Input,
  Select,
} from "../../../../../../_metronic/_partials/controls"
import { amountLimitDynamic, formatDates } from "../../../../../utils/common";
import { KeyboardArrowDown } from "@material-ui/icons";


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
            <Card>
              <CardHeader title={CurrentModuleName()} />
            </Card>
            <Accordion defaultActiveKey="">
              <Card>
                <Card.Header className="d-flex justify-content-center">
                  <div className='accordion-header-btn w-100  d-flex justify-content-center'>
                    <Accordion.Toggle as={Button} eventKey="0" className="flex-between-center text-bold" >
                      Filter
                      <KeyboardArrowDown />
                    </Accordion.Toggle>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>

                    <form onSubmit={handleSubmit}>


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
                                setFieldValue("searchText", e.target.value.trim());
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
                                options={dashboard?.allDept}
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
                                options={dashboard?.allDesignations}
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
                                options={dashboard?.allEmployeegradeList}
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
                                options={dashboard.allLocationChildMenus}
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
                                options={dashboard?.allCountry}
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
                                options={filteredCities(values.countryId)}

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

                                options={dashboard?.allAppointmentTypeList}

                              />
                            </div>



                          </div>




                        </div>


                      </div>


                    </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>


          </>
        )}
      </Formik >
    </>
  );
}

