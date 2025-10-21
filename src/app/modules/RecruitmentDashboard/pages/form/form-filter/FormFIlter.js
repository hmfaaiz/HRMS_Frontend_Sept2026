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
import * as actions from "../../../_redux/redux-Actions";
import DatePicker from "react-datepicker";
import { fetchAllCity, fetchAllCountry, fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Accordion, Button, Card } from "react-bootstrap";
import { Form, Modal } from "react-bootstrap";
import {
  // Card,
  CardHeader,
  Input,
  Select,
} from "../../../../../../_metronic/_partials/controls"
import { amountLimitDynamic, formatDates } from "../../../../../utils/common";
import { KeyboardArrowDown } from "@material-ui/icons";
import { CircleMinus, CirclePlus } from "lucide-react";


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
    vacancyStatusId





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
  if (vacancyStatusId || vacancyStatusId === 0) {
    filter.vacancyStatusId = vacancyStatusId;
  }



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



  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)

    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      formUIProps.setQueryParams(newQueryParams)
      dispatch(actions.fetchRecruitmentDashboard(newQueryParams));

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







  const initialFilterValues = {

    //job filter
    vacancyStatusId: 1,
    searchText: "",
    departmentId: null,
    designationId: null,
    gradeId: null,
    locationId: null,
    countryId: null,
    cityId: null,
    appointmentTypeId: null,







  };
  // const vacancyStatusOptions = [
  //   { value: null, label: "All" },
  //   { value: 0, label: "Vacancy not posted " },
  //   { value: 1, label: "Currently Posted" },
  //   { value: 2, label: "On Hold" },
  //   { value: 3, label: "Closed / Expired Job" },
  // ];



    const vacancyStatusOptions = [
    { value: null, label: "All" },
    { value: 4, label: "Job Requisition Form" },
    { value: 0, label: "Vacancy not posted " },
    { value: 1, label: "Currently Posted" },
    { value: 2, label: "On Hold" },
    { value: 3, label: "Closed / Expired Job" },
    
  ];


  const [activeKey, setActiveKey] = useState(null);

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
            {/* <Card>
              <CardHeader title={CurrentModuleName()} />
            </Card> */}
            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
              <Card>
                <Card.Header className="d-flex justify-content-center">
                  <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                    <Accordion.Toggle
                      as={Button}
                      eventKey="0"
                      className="flex justify-start text-bold"
                    >

                      {activeKey === "0" ? <CircleMinus className="h-4 w-4 text-black mr-1" /> : <CirclePlus className="h-4 w-4 text-black mr-1" />}<span className="text-black">Filters</span>

                    </Accordion.Toggle>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  {/* <Card.Body>
                   */}

                  <>

                    <form onSubmit={handleSubmit}>


                      <h6 className="font-bold mb-0 text-primary my-2">
                        Job Filter
                      </h6>

                      <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1">

                        {/* Vacancy status */}
                        <div className="">
                          <SearchSelect
                            name="vacancyStatusId"
                            label="Vacancy Status"
                            onChange={(e) => {

                              setFieldValue("vacancyStatusId", e.value !== undefined ? e.value : null);
                              handleSubmit();
                            }}
                            value={
                              vacancyStatusOptions?.find(
                                (option) => option.value == values.vacancyStatusId
                              ) || null
                            }
                            options={vacancyStatusOptions}

                          />
                        </div>

                        <div className="">
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

                        {/* Department */}
                        <div className="">
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
                            options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allDept) ? dashboard?.allDept : []),]}
                          />
                        </div>

                        {/* Designation */}
                        <div className="">
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
                            options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allDesignations) ? dashboard?.allDesignations : []),]}
                          />
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1 mt-1">
                        {/* Grade */}
                        <div className="">
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
                            options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allEmployeegradeList) ? dashboard?.allEmployeegradeList : []),]}
                          />
                        </div>


                        {/* Location */}
                        <div className="">
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
                            options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard.allLocationChildMenus) ? dashboard.allLocationChildMenus : []),]}

                          />
                        </div>


                        {/* Country */}
                        <div className="">
                          <SearchSelect
                            name="countryId"
                            label="Country"
                            onChange={(e) => {
                              const selectedCountryId = e.value || null;
                              setFieldValue("countryId", selectedCountryId);

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
                        <div className="">
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
                        {/* <div className="">
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
                            options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allAppointmentTypeList) ? dashboard?.allAppointmentTypeList : []),]}

                          />
                        </div> */}



                      </div>







                    </form>
                    <Modal.Footer>
                      <button
                        type="button"
                        onClick={() => {
                          handleReset(); // Resets form
                          applyFilter(initialFilterValues); // Clears filter state
                        }}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                    </Modal.Footer>
                    {/* </Card.Body> */}
                  </>
                </Accordion.Collapse>
              </Card>


            </Accordion>
          </>
        )}
      </Formik >
    </>
  );
}

