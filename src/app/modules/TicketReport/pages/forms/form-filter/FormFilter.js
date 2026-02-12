import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { formatDates, TicketType } from "../../../../../utils/common";

import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";

import {
  fetchAllActiveEmployeesBySubsidiary,
} from "../../../../../../_metronic/redux/dashboardActions";

import { Download, } from "lucide-react";


import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import DatePicker from "react-datepicker";


//Validation for date fields
const formValidation = Yup.object().shape({

});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  const formattedValues = {
    ...values,


  };
  newQueryParams.filter = { ...formattedValues };
  return newQueryParams;
};

export function FormFilter({ loading, dispatch, pdfLoading, pdf }) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state

  const { currentState, dashboard } = useSelector((state) => {
    return {
      currentState: state?.ticket_time_report,
      dashboard: state?.dashboard,
    };
  });
  const {
    allEmployees,
    allSubsidiaryList,

  } = useSelector((state) => state.dashboard);


  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);


  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);


  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  //Function to update filter in queryparams when any filter is selected or updated
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams);
    }
  };


  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      employeeLabel: allEmployeesMap?.get(values.employeeId || "")?.label,


    };
  };



  const getTicketReportByFilters = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllTicketReportByFiltersForExcel(newQueryParams.filter, document, labels));
  };



  useEffect(() => {
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;

    dispatch(fetchAllActiveEmployeesBySubsidiary(findDefaultSubs.value));

  }, [allSubsidiaryList]);



  return (

    <>
      <Formik
        enableReinitialize={true}

        initialValues={{
          ...initialFilter.filter,
          subsidiaryId:
            initialFilter.filter?.subsidiaryId ||
            allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
            "",

        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const formattedValues = {
            ...values,
            from_date: formatDates(values?.from_date, "yyyy-MM-dd"),
            to_date: formatDates(values?.to_date, "yyyy-MM-dd"),

          };

          applyFilter(formattedValues);
        }}
      >
        {({ values, handleBlur, setFieldValue, handleReset }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div className="">

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">

                      <div>
                        <SearchSelect
                          name="projectId"

                          label={
                            <label>
                              Project

                            </label>
                          }
                          onChange={(e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            setFieldValue("projectId", value);

                          }}
                          value={
                            dashboard?.allProjects?.find(
                              (option) =>
                                option?.value === values?.projectId
                            ) || null
                          }

                          options={dashboard?.allProjects}


                        />

                      </div>


                      <div className="">
                        <MultiSelect

                          name="ticketTypeIds"
                          label="Ticket Type"
                          value={TicketType.filter(t =>
                            values.ticketTypeIds?.includes(t.value)
                          )}
                          options={TicketType}
                          onChange={(items = []) =>
                            setFieldValue(
                              "ticketTypeIds",
                              items.map((i) => i.value)
                            )
                          }
                        />
                      </div>


                      <div className="">
                        <MultiSelect

                          name="ticketStatusIds"
                          label="Ticket Status"
                          value={dashboard.allTicketStatus.filter(t =>
                            values.ticketStatusIds?.includes(t.value)
                          )}
                          options={dashboard.allTicketStatus}
                          onChange={(items = []) =>
                            setFieldValue(
                              "ticketStatusIds",
                              items.map((i) => i.value)
                            )
                          }
                        />
                      </div>






                    </div>



                    <div className="grid grid-cols-1 gap-x-3 gap-y-1 ">

                      <div className="">
                        <h6 className="font-bold mb-0 text-primary my-2">
                          Date
                        </h6>

                        <div className="grid grid-cols-5 gap-x-3 gap-y-1 ">


                          <div>
                            <label>
                              From<span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                              className="form-control"
                              placeholder="From "
                              selected={
                                values?.from_date
                                  ? new Date(values.from_date)
                                  : null
                              }
                              onChange={(date) => {
                                setFieldValue("from_date", date);
                                setFieldValue("to_date", date); // Sync from_date and to_date
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              // showTimeInput
                              name="from_date"
                              autoComplete="off"
                            />
                          </div>


                          <div>
                            <label>
                              To<span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                              className="form-control"
                              placeholder="To "
                              selected={
                                values?.to_date
                                  ? new Date(values.to_date)
                                  : null
                              }
                              onChange={(date) => {
                                setFieldValue("to_date", date);
                              }}


                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              // showTimeInput
                              name="to_date"
                              autoComplete="off"
                              minDate={values?.from_date ? new Date(values.from_date) : null}
                              // maxDate={
                              //   values?.from_date && values.isDays
                              //     ? new Date(new Date(values.from_date).setDate(new Date(values.from_date).getDate() + 31))
                              //     : null
                              // }

                              maxDate={
                                values?.from_date
                                  ? values.isDays
                                    ? new Date(
                                      new Date(values.from_date).setDate(
                                        new Date(values.from_date).getDate() + 30
                                      )
                                    )
                                    : values.isWeekDays
                                      ? new Date(
                                        new Date(values.from_date).setMonth(
                                          new Date(values.from_date).getMonth() + 3
                                        )
                                      )
                                      : values.isMonthDays
                                        ? new Date(
                                          new Date(values.from_date).setMonth(
                                            new Date(values.from_date).getMonth() + 12
                                          )
                                        )
                                        : null
                                  : null
                              }
                            />
                          </div>




                          <div className="">
                            <MultiSelect

                              name="employeeId"
                              label="Assignee"
                              value={dashboard?.allEmployees.filter(t =>
                                values.employeeId?.includes(t.value)
                              )}
                              options={dashboard?.allEmployees}
                              onChange={(items = []) =>
                                setFieldValue(
                                  "employeeId",
                                  items.map((i) => i.value)
                                )
                              }
                            />
                          </div>



                        </div>



                      </div>



                    </div>


                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 mt-3">
                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isProjectWise"
                            type="checkbox"

                            onChange={() => {
                              setFieldValue("isProjectWise", !values?.isProjectWise)
                              setFieldValue("isEmployeeWise", false)
                              setFieldValue("isProjectEmployee", false)
                              setFieldValue("isEmployeeProject", false)
                              setFieldValue("isEmployeeProjectTicket", false)
                              setFieldValue("isProjectTicket", false)
                            }
                            }
                            onBlur={handleBlur}
                            value={values.isProjectWise}
                            checked={values.isProjectWise}
                          />
                          <span>Project Wise</span>
                        </label>
                      </div>


                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isEmployeeWise"
                            type="checkbox"

                            onChange={() => {
                              setFieldValue("isProjectWise", false)
                              setFieldValue("isEmployeeWise", !values?.isEmployeeWise)
                              setFieldValue("isProjectEmployee", false)
                              setFieldValue("isEmployeeProject", false)
                              setFieldValue("isEmployeeProjectTicket", false)
                              setFieldValue("isProjectTicket", false)
                            }
                            }
                            onBlur={handleBlur}
                            value={values.isEmployeeWise}
                            checked={values.isEmployeeWise}
                          />
                          <span>Employee Wise</span>
                        </label>
                      </div>



                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isProjectEmployee"
                            type="checkbox"

                            onChange={() => {
                              setFieldValue("isProjectWise", false)
                              setFieldValue("isProjectEmployee", !values?.isProjectEmployee)
                              setFieldValue("isEmployeeWise", false)
                              setFieldValue("isEmployeeProject", false)
                              setFieldValue("isEmployeeProjectTicket", false)
                              setFieldValue("isProjectTicket", false)
                            }
                            }
                            onBlur={handleBlur}
                            value={values.isProjectEmployee}
                            checked={values.isProjectEmployee}
                          />
                          <span>Project Wise, Employee Wise</span>
                        </label>
                      </div>



                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isEmployeeProject"
                            type="checkbox"

                            onChange={() => {

                              setFieldValue("isEmployeeProject", !values?.isEmployeeProject)
                              setFieldValue("isProjectWise", false)
                              setFieldValue("isEmployeeWise", false)
                              setFieldValue("isProjectEmployee", false)
                              setFieldValue("isEmployeeProjectTicket", false)
                              setFieldValue("isProjectTicket", false)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isEmployeeProject}
                            checked={values.isEmployeeProject}
                          />
                          <span>Employee Wise, Project Wise</span>
                        </label>
                      </div>


                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isEmployeeProjectTicket"
                            type="checkbox"

                            onChange={() => {

                              setFieldValue("isEmployeeProjectTicket", !values?.isEmployeeProjectTicket)
                              setFieldValue("isEmployeeProject", false)
                              setFieldValue("isProjectWise", false)
                              setFieldValue("isEmployeeWise", false)
                              setFieldValue("isProjectEmployee", false)
                              setFieldValue("isProjectTicket", false)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isEmployeeProjectTicket}
                            checked={values.isEmployeeProjectTicket}
                          />
                          <span>Employee Wise, Project Wise, Ticket Wise</span>
                        </label>
                      </div>

                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isProjectTicket"
                            type="checkbox"

                            onChange={() => {

                              setFieldValue("isProjectTicket", !values?.isProjectTicket)
                              setFieldValue("isEmployeeProject", false)
                              setFieldValue("isProjectWise", false)
                              setFieldValue("isEmployeeWise", false)
                              setFieldValue("isProjectEmployee", false)
                              setFieldValue("isEmployeeProjectTicket", false)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isProjectTicket}
                            checked={values.isProjectTicket}
                          />
                          <span>Project Wise, Ticket Wise</span>
                        </label>
                      </div>
                    </div>


                    <hr />


                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 mt-3">

                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isDays"
                            type="checkbox"

                            onChange={() => {
                              setFieldValue("isDays", !values?.isDays)
                              setFieldValue("isWeekDays", false)
                              setFieldValue("isMonthDays", false)
                              setFieldValue("to_date", null)
                              setFieldValue("from_date", null)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isDays}
                            checked={values.isDays}
                          />
                          <span>Day Wise</span>
                        </label>
                      </div>


                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isWeekDays"
                            type="checkbox"

                            onChange={() => {
                              setFieldValue("isWeekDays", !values?.isWeekDays)
                              setFieldValue("isMonthDays", false)
                              setFieldValue("isDays", false)
                              setFieldValue("to_date", null)
                              setFieldValue("from_date", null)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isWeekDays}
                            checked={values.isWeekDays}
                          />
                          <span>Week Wise</span>
                        </label>
                      </div>


                      <div className="col-span-1">
                        <label className="flex items-center">
                          <input
                            className="mr-1"
                            name="isMonthDays"
                            type="checkbox"

                            onChange={() => {

                              setFieldValue("isMonthDays", !values?.isMonthDays)
                              setFieldValue("isWeekDays", false)
                              setFieldValue("isDays", false)
                              setFieldValue("to_date", null)
                              setFieldValue("from_date", null)

                            }
                            }
                            onBlur={handleBlur}
                            value={values.isMonthDays}
                            checked={values.isMonthDays}
                          />
                          <span>Month Wise</span>
                        </label>
                      </div>







                    </div>



                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  applyFilter(initialFilter.filter);
                  handleReset();
                }}
                className="btn btn-light"
              >
                Cancel
              </button>

              {/* <div className="flex items-center gap-2  p-1 rounded-sm justify-end"> */}
              <button
                onClick={() => {
                  if (!pdfLoading) {
                    const formattedValues = {
                      ...values,
                      from_date: formatDates(values?.from_date, "yyyy-MM-dd"),
                      to_date: formatDates(values?.to_date, "yyyy-MM-dd"),

                    };

                    getTicketReportByFilters(formattedValues);
                  }
                }}
                disabled={pdfLoading || !values.from_date || !values.to_date}
                className={`btn btn-primary btn-elevate h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate h-9 opacity-50 cursor-not-allowed" : ""
                  }`}

                type="button"

              >
                Geenrate Report

                <Download className="w-4 h-4 ml-2" />
                {pdf && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>

              {/* </div> */}




            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
