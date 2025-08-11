import React, { useMemo, useState, useEffect, useCallback } from "react"
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
import { fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Form, Modal } from "react-bootstrap";
import {
  Card,
  CardHeader,
  Input,
} from "../../../../../../_metronic/_partials/controls"
import { formatDates } from "../../../../../utils/common";


pdfMake.vfs = pdfFonts.pdfMake.vfs;
const API_URL = process.env.REACT_APP_API_URL;


// const prepareFilter = (queryParams, values) => {
//   const { searchText } = values
//   const newQueryParams = { ...queryParams }
//   const filter = {}

//   if (searchText) {
//     filter.searchQuery = searchText
//     // filter.email = searchText
//   }
//   newQueryParams.filter = filter
//   return newQueryParams
// }


const prepareFilter = (queryParams, values) => {
  const {
    searchText,
    departmentId,
    designationId,
    priorityTypeId,
    desireFromDateOfApp,
    desireToDateOfApp, vacancyStatusId, jobFinalizedFromDate, jobFinalizedToDate,
  } = values;

  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText.trim();
  }

  if (departmentId) {
    filter.departmentId = departmentId;
  }

  if (designationId) {
    filter.designationId = designationId;
  }

  if (priorityTypeId) {
    filter.priorityTypeId = priorityTypeId;
  }

  if (desireFromDateOfApp) {
    filter.desireFromDateOfApp = desireFromDateOfApp;
  }

  if (desireToDateOfApp) {
    filter.desireToDateOfApp = desireToDateOfApp;
  }

  if (vacancyStatusId || vacancyStatusId === 0) {
    filter.vacancyStatusId = vacancyStatusId;
  }

  if (jobFinalizedFromDate) {
    filter.jobFinalizedFromDate = jobFinalizedFromDate;
  }

  if (jobFinalizedToDate) {
    filter.jobFinalizedToDate = jobFinalizedToDate;
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




  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

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

  }, []);


  const vacancyStatusOptions = [
    { value: null, label: "All" },
    { value: 0, label: "Vacancy not posted " },
    { value: 1, label: "Currently Posted" },
    { value: 2, label: "On Hold" },
    { value: 3, label: "Closed / Expired Job" },
  ];



  const initialFilterValues = {
    searchText: "",
    departmentId: null,
    designationId: null,
    priorityTypeId: null,
    desireFromDateOfApp: null,
    desireToDateOfApp: null,
    vacancyStatusId: 0, jobFinalizedFromDate: null, jobFinalizedToDate: null,
  };

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
          handleReset,
        }) => (
          <>
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
                <div className="form-group row">

                  {/* row 1 */}

                  <div className="row col-12 col-md-12">

                    {/* Vacancy status */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="vacancyStatusId"
                        label="Vacancy Status"
                        onChange={(e) => {
                          console.log("Selected value:", e.value);
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
                  </div>


                  {/* row 2 */}

                  {/* Department */}


                  <div className="row col-12 col-md-12">
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
                        options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allDept) ? dashboard?.allDept : []),]}
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
                        options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allDesignations) ? dashboard?.allDesignations : []),]}
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
                        options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.allPriorityTypeList) ? dashboard?.allPriorityTypeList : []),]}
                      />
                    </div>
                  </div>

                  {/* row 3*/}
                  <div className="row col-12 col-md-12">
                    {/* Job Title */}
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

                    {/* Date From */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Desire Date of Appointment (From)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="From"
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
                        placeholder="To"
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
                      <label>Job Finalized (From)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="From"
                        selected={
                          values?.jobFinalizedFromDate
                            ? new Date(values.jobFinalizedFromDate)
                            : null
                        }
                        onChange={(date) => {
                         let selectedDate = formatDates(date, 'yyyy-MM-dd')

                          setFieldValue("jobFinalizedFromDate", selectedDate);
                          setFieldValue("jobFinalizedToDate", selectedDate);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="jobFinalizedFromDate"
                        autoComplete="off"
                      />
                    </div>

                    {/* Date To */}
                    <div className="col-12 col-md-4 mt-3">
                      <label>Job Finalized (To)</label>
                      <DatePicker
                        className="form-control"
                        placeholder="To"
                        selected={
                          values?.jobFinalizedToDate
                            ? new Date(values.jobFinalizedToDate)
                            : null
                        }
                        onChange={(date) => {
                          setFieldValue("jobFinalizedToDate", date);
                          handleSubmit();
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="jobFinalizedToDate"
                        autoComplete="off"
                        minDate={values?.jobFinalizedFromDate ? new Date(values.jobFinalizedFromDate) : new Date()}
                      />
                    </div>

                  </div>


                </div>
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

              </div>
            </form>


          </>
        )}
      </Formik>
    </>
  );
}

