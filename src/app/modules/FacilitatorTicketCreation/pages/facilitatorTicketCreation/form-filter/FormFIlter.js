import React, { useMemo, useState, useEffect, useCallback } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import { } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { formatDates } from "../../../../../utils/common";
import { Form, Modal } from "react-bootstrap";
import { initialFilter } from "../FormUIHelpers";

const API_URL = process.env.REACT_APP_API_URL;


const prepareFilter = (queryParams, values) => {
  const { searchText,

    ticketStatus,
    timeRangeFrom,
    timeRangeTo,
    ticketDescription,
    assignTo, } = values
  const newQueryParams = { ...queryParams }
  const filterSender = {}

  if (searchText) {
    filterSender.searchQuery = searchText
    // filter.email = searchText
  }

  if (ticketStatus !== undefined && ticketStatus !== null) {
    filterSender.ticketStatus = ticketStatus;
  }

  if (timeRangeFrom) {
    filterSender.timeRangeFrom = timeRangeFrom;
  }
  if (timeRangeTo) {
    filterSender.timeRangeTo = timeRangeTo;
  }
  if (assignTo) {
    filterSender.assignTo = assignTo;
  }
  if (ticketDescription) {
    filterSender.ticketDescription = ticketDescription;
  }

  newQueryParams.filterSender = filterSender
  return newQueryParams
}

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

  // useEffect(() => {

  //   dispatch(fetchAllDept());
  //   dispatch(fetchAllFormsMenu(158, "allDesignations"));
  //   dispatch(fetchAllFormsMenu(412, "allPriorityTypeList"));

  // }, []);


  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      formUIProps.setQueryParams(newQueryParams)
    }
  }
  const { allEmployees, currentState } = useSelector((state) => {
    return {
      currentState: state.facilitator_ticket_creation,
      allEmployees: state.dashboard.allEmployees,

    };
  }, shallowEqual);



  const { entities } = currentState;

  // Extract assignTo values and remove duplicates
  const assignToIds = [...new Set(entities?.map(item => item.assignTo))];



  const ticketStatusOptions = [

    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "Send for Review" },
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{

          searchText: "",

          ticketStatus: 1,
          timeRangeFrom: null,
          timeRangeTo: null,
          ticketDescription: null,
          assignTo: null,

        }}
        onSubmit={(values) => {


          applyFilter(values)
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched, handleReset,

        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
         
              <div className="grid grid-cols-8 gap-x-3 gap-y-1">

                <div className="">
                  <SearchSelect
                    name="ticketStatus"
                    label="Ticket Status"
                    onChange={(e) => {

                      setFieldValue("ticketStatus", e.value !== undefined ? e.value : null);
                      handleSubmit();
                    }}
                    value={
                      ticketStatusOptions?.find(
                        (option) => option.value == values.ticketStatus
                      ) || null
                    }
                    options={ticketStatusOptions}
                  />
                </div>

                <div className="">
                  <label>Date(From)</label>
                  <DatePicker
                    className="form-control"
                    placeholder="From"
                    selected={
                      values?.timeRangeFrom
                        ? new Date(values.timeRangeFrom)
                        : null
                    }
                    onChange={(date) => {
                      let selectedDate = formatDates(date, 'yyyy-MM-dd')
                      setFieldValue("timeRangeFrom", selectedDate);
                      setFieldValue("timeRangeTo", selectedDate);
                      handleSubmit();
                    }}
                    dateFormat="dd-MMM-yyyy"
                    name="timeRangeFrom"
                    autoComplete="off"
                  />
                </div>

                {/* Date To */}
                <div className="">
                  <label>Date (To)</label>
                  <DatePicker
                    className="form-control"
                    placeholder="To"
                    selected={
                      values?.timeRangeTo
                        ? new Date(values.timeRangeTo)
                        : null
                    }
                    onChange={(date) => {
                      setFieldValue("timeRangeTo", date);
                      handleSubmit();
                    }}
                    dateFormat="dd-MMM-yyyy"
                    name="timeRangeTo"
                    autoComplete="off"
                    minDate={values?.timeRangeFrom ? new Date(values.timeRangeFrom) : new Date()}
                  />
                </div>

                <div className="">
                  <SearchSelect
                    name="assignTo"
                    label={
                      <span>
                        Employee
                      </span>
                    }

                    onChange={(e) => {
                      setFieldValue("assignTo", e.value || null);
                      handleSubmit();
                    }}
                    value={
                      allEmployees?.find(option => option.value === values.assignTo) || null
                    }
                    options={allEmployees?.filter(emp => assignToIds?.includes(emp.value))}

                  />
                </div>

                <div>
                  <label>Ticket Description</label>


                  <InputSearch
                    values={values}
                    fieldName="ticketDescription"
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>

   

             <Modal.Footer>
                <button
                  type="button"
                  onClick={() => {
                    applyFilter(initialFilter.filterSender);
                    handleReset();
                  }}
                  className="btn btn-light"
                >
                  Cancel
                </button>
                 </Modal.Footer>







          </form>


        )}
      </Formik>
      {/* 
      <Formik
        enableReinitialize={true}

        onSubmit={(values) => {


        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched,

        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="row">



            </div>
            <div className="row">

            </div>

          </form>
        )}
      </Formik> */}
    </>
  )

  return (
    <>

    </>
  )
}
