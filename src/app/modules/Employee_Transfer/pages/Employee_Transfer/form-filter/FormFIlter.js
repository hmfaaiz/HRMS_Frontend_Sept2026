import React, { useMemo, useState, useEffect } from "react"
import { Field, Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"



import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import DatePicker from "react-datepicker";
import { fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";


import { Modal } from "react-bootstrap";
import {

  Input,
} from "../../../../../../_metronic/_partials/controls"
import { formatDates } from "../../../../../utils/common";


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

const ALL_OPTION = { label: "All", value: "" };
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



  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])






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
    { value: 4, label: "Job Requisition Form" },
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


              {/* Vacancy status */}

              <div className="grid grid-cols-8 gap-x-3 gap-y-1">

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
              </div>


              {/* row 1 */}

              <div className="grid grid-cols-8 gap-x-3 mt-2">


                <div className="">
                  <SearchSelect
                    name="departmentId"
                    label="Department"
                    onChange={(e) => {
                      setFieldValue("departmentId", e.value || null);
                      handleSubmit();
                    }}
                    options={[ALL_OPTION, ...(dashboard?.allDept || [])]}
                    value={
                      [ALL_OPTION, ...(dashboard?.allDept || [])]?.find(
                        (opt) => opt?.value == values?.departmentId,
                      ) || ALL_OPTION
                    }
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
                    options={[ALL_OPTION, ...(dashboard?.allDesignations || [])]}
                    value={
                      [ALL_OPTION, ...(dashboard?.allDesignations || [])]?.find(
                        (opt) => opt?.value == values?.designationId,
                      ) || ALL_OPTION
                    }
                  />
                </div>

                {/* Priority */}
                <div className="">
                  <SearchSelect
                    name="priorityTypeId"
                    label="Priority"
                    onChange={(e) => {
                      setFieldValue("priorityTypeId", e.value || null);
                      handleSubmit();
                    }}
                    options={[ALL_OPTION, ...(dashboard?.allPriorityTypeList || [])]}
                    value={
                      [ALL_OPTION, ...(dashboard?.allPriorityTypeList || [])]?.find(
                        (opt) => opt?.value == values?.priorityTypeId,
                      ) || ALL_OPTION
                    }
                  />
                </div>

                {/* Job Title */}
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


                {/* <div className="grid grid-cols-6 gap-x-3 mt-1"> */}
                {/* Date From */}
                <div className="">
                  <label>Appointment (From)</label>
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
                <div className="">
                  <label>Appointment (To)</label>
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

                {/* Date From */}
                <div className="">
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
                <div className="">
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
                {/* </div> */}
              </div>
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


            </form>


          </>
        )}
      </Formik >
    </>
  );
}

