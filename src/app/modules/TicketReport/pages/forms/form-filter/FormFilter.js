import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { formatDates, getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth, TicketType } from "../../../../../utils/common";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";

import {
  fetchAllActiveEmployeesBySubsidiary,
} from "../../../../../../_metronic/redux/dashboardActions";

import { Download, } from "lucide-react";


import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import DatePicker from "react-datepicker";
import {

  Input,
} from "../../../../../../_metronic/_partials/controls";
import FormPreview from "../preview/FormPreview";
import { FetchAllFacilitatorEmployee } from "../../../../Dashboard/_redux/dashboardActions";
import { tr } from "date-fns/locale";
import EmployeeLogTimeSummaryPreview from "../preview/EmployeeLogTimeSummary";


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
  const [activeKey, setActiveKey] = useState("0");
  //Get All dropdown data from state

  useEffect(() => {
    dispatch(FetchAllFacilitatorEmployee());

  }, [dispatch]);

  const { currentState, dashboard, previewData, previewSummaryData,previewSummaryFromDate,previewSummaryToDate} = useSelector((state) => {
    return {
      currentState: state?.ticket_time_report,
      dashboard: state?.dashboard,
      previewData: state?.ticket_time_report?.previewData,
      previewSummaryData: state?.ticket_time_report?.previewSummaryData,
      previewSummaryFromDate: state?.ticket_time_report?.previewSummaryFromDate,
      previewSummaryToDate: state?.ticket_time_report?.previewSummaryToDate,
    };
  });
  const {
    allEmployees,
    allSubsidiaryList, facilitatorEmployeeList,

  } = useSelector((state) => state.dashboard);


  const allEmployeesMap = useMemo(() => {
    return new Map(facilitatorEmployeeList?.map((item) => [item.value, item]));
  }, [facilitatorEmployeeList]);


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



  const getPreviewReportByFilters = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchPreviewData(newQueryParams.filter, document, labels));
  };


  const getSummaryReportByFilters = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllSummaryReportByFiltersForExcel(newQueryParams.filter, document, labels));
  };

  const getPreviewSummaryReportByFilters = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchPreviewSummaryData(newQueryParams.filter, document, labels));
  };

  useEffect(() => {
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;

    dispatch(fetchAllActiveEmployeesBySubsidiary(findDefaultSubs.value));

  }, [allSubsidiaryList]);

  const ticketStatusOptions = [

    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "Send for Review" },
  ];

  const clearFields = (values = [], setFieldValue) => {
    values.forEach((field) => {

      setFieldValue(field, ""); // Set each field to an empty value
    });
  };
  return (

    <>
      <Formik
        enableReinitialize={true}

        initialValues={{
          ...initialFilter.filter,
          from_date: getFirstDayOfCurrentMonth(),
          to_date: getLastDayOfCurrentMonth(),
          isEnable_via_task_assignment: true,
          istTcketTypeTicket: true,

          taskTicketTypeIds: dashboard?.allMasterTicketType?.length
            ? dashboard?.allMasterTicketType?.map(t => t.value)
            : [],
          taskTicketStatusIds: ticketStatusOptions?.length
            ? ticketStatusOptions?.map(t => t.value)
            : [],

          employeeId: dashboard?.facilitatorEmployeeList?.length
            ? dashboard?.facilitatorEmployeeList?.map(t => t.value)
            : [],
          // subsidiaryId:
          //   initialFilter.filter?.subsidiaryId ||
          //   allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
          //   "",


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
        {({ values, handleBlur, setFieldValue, handleReset, handleChange }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div className="">
                    <>
                      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                        <Card>
                          <Card.Header className="d-flex justify-content-center">
                            <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                              <Accordion.Toggle
                                as={Button}
                                eventKey="0"
                                className="flex justify-start text-bold"
                              >
                                {activeKey === "0" ? (
                                  <CircleMinus className="h-4 w-4 text-black mr-1" />
                                ) : (
                                  <CirclePlus className="h-4 w-4 text-black mr-1" />
                                )}
                                <span className="text-black">Filters</span>
                              </Accordion.Toggle>
                            </div>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <>

                              <div className="">

                                <div className="grid grid-cols-8 gap-x-3 gap-y-1">
                                  <h6 className="font-bold mb-0 text-primary my-2">
                                    Project
                                  </h6>

                                  <div className="col-span-1 mt-3">
                                    <input
                                      name="isEnable_via_task_project"
                                      type="checkbox"
                                      className="relative top-1"
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        setFieldValue("isDays", true)
                                        setFieldValue("isWeekDays", false)
                                        setFieldValue("isMonthDays", false)
                                        clearFields(["taskTicketDescription"], setFieldValue);
                                        setFieldValue("taskTicketStatusIds", [])
                                        setFieldValue("taskTicketTypeIds", [])
                                        setFieldValue("isEnable_via_task_assignment", false);
                                        setFieldValue("isEnable_via_task_assignment_emp_logtime_summary", false);
                                        clearFields(["projectId", "projectTicketDescription",], setFieldValue);



                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)


                                        setFieldValue("isProjectWise", true)
                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isProjectTicket", false)

                                        setFieldValue('ticketStatusIds', dashboard?.allTicketStatus?.length
                                          ? dashboard?.allTicketStatus?.map(t => t.value)
                                          : [])
                                        setFieldValue('ticketTypeIds', TicketType?.length
                                          ? TicketType?.map(t => t.value)
                                          : [])





                                        handleChange(e); // Trigger the form change handler

                                      }}
                                      onBlur={handleBlur}
                                      value={values.isEnable_via_task_project}
                                      checked={values.isEnable_via_task_project}

                                    />
                                    <label>
                                      &nbsp;<span>Search Via Project</span>
                                    </label>
                                  </div>
                                </div>

                                <div className="grid grid-cols-8 gap-x-3 gap-y-1">
                                  <div className="col-span-2">
                                    <SearchSelect
                                      name="projectId"
                                      isDisabled={!values.isEnable_via_task_project}
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


                                  <div className="col-span-2">
                                    <MultiSelect
                                      isDisabled={!values.isEnable_via_task_project}
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


                                  <div className="col-span-2">
                                    <MultiSelect
                                      isDisabled={!values.isEnable_via_task_project}
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

                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-12 gap-x-3 gap-y-1 mt-3">

                                <div className="col-span-1">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isProjectWise"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", !values?.isProjectWise)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectTicket", false)

                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)
                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isProjectWise}
                                      checked={values.isProjectWise}
                                    />
                                    <span>Project Wise</span>
                                  </label>
                                </div>


                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isEmployeeWise"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isEmployeeWise", !values?.isEmployeeWise)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectTicket", false)

                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)
                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isEmployeeWise}
                                      checked={values.isEmployeeWise}
                                    />
                                    <span>Employee Wise</span>
                                  </label>
                                </div>



                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isProjectEmployee"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isProjectEmployee", !values?.isProjectEmployee)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectTicket", false)

                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)


                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isProjectEmployee}
                                      checked={values.isProjectEmployee}
                                    />
                                    <span>Project Wise, Employee Wise</span>
                                  </label>
                                </div>



                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isEmployeeProject"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {

                                        setFieldValue("isEmployeeProject", !values?.isEmployeeProject)
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectTicket", false)

                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)

                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isEmployeeProject}
                                      checked={values.isEmployeeProject}
                                    />
                                    <span>Employee Wise, Project Wise</span>
                                  </label>
                                </div>


                                <div className="col-span-3">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isEmployeeProjectTicket"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {

                                        setFieldValue("isEmployeeProjectTicket", !values?.isEmployeeProjectTicket)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isProjectTicket", false)


                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)

                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isEmployeeProjectTicket}
                                      checked={values.isEmployeeProjectTicket}
                                    />
                                    <span>Employee Wise, Project Wise, Ticket Wise</span>
                                  </label>
                                </div>

                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isProjectTicket"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_project}
                                      onChange={() => {

                                        setFieldValue("isProjectTicket", !values?.isProjectTicket)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("isEmployeeProjectTicket", false)

                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)

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



                              <div className="grid grid-cols-8 gap-x-3 gap-y-1">
                                <h6 className="font-bold mb-0 text-primary my-2">
                                  Task Assignment
                                </h6>
                                <div className="col-span-2 mt-3">
                                  <input
                                    name="isEnable_via_task_assignment"
                                    type="checkbox"
                                    className="relative top-1"
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      setFieldValue("isDays", true)
                                      setFieldValue("isWeekDays", false)
                                      setFieldValue("isMonthDays", false)
                                      clearFields(["projectId", "projectTicketDescription",], setFieldValue);
                                      setFieldValue("isEnable_via_task_project", false);
                                      setFieldValue("isEnable_via_task_assignment_emp_logtime_summary", false);
                                      setFieldValue('ticketStatusIds', [])
                                      setFieldValue('ticketTypeIds', [])

                                      clearFields(["taskTicketDescription"], setFieldValue);
                                      // setFieldValue("taskTicketStatusIds", [])
                                      // setFieldValue("taskTicketTypeIds", [])


                                      setFieldValue("isProjectWise", false)
                                      setFieldValue("istTcketTypeTicket", true)
                                      setFieldValue("isEmpTicketTypeTicket", false)
                                      setFieldValue("isTicketTypeEmp", false)
                                      setFieldValue("isEmployeeWise", false)
                                      setFieldValue("isEmployeeProject", false)
                                      setFieldValue("isEmployeeProjectTicket", false)
                                      setFieldValue("isProjectEmployee", false)
                                      setFieldValue("isProjectTicket", false)

                                      setFieldValue("taskTicketTypeIds", dashboard?.allMasterTicketType?.length
                                        ? dashboard?.allMasterTicketType?.map(t => t.value)
                                        : [])
                                      setFieldValue("taskTicketStatusIds", ticketStatusOptions?.length
                                        ? ticketStatusOptions?.map(t => t.value)
                                        : [])

                                      handleChange(e); // Trigger the form change handler

                                    }}
                                    onBlur={handleBlur}
                                    value={values.isEnable_via_task_assignment}
                                    checked={values.isEnable_via_task_assignment}

                                  />
                                  <label>
                                    &nbsp;<span>Search Via Task Assignment</span>
                                  </label>
                                </div>


                              </div>



                              <div className="grid grid-cols-8 gap-x-3 gap-y-1">


                                <div className="col-span-2">

                                  <MultiSelect
                                    name="taskTicketTypeIds"
                                    label="Ticket Type"
                                    disabled={!values.isEnable_via_task_assignment}
                                    value={
                                      (dashboard?.allMasterTicketType ?? []).filter(t =>
                                        (values?.taskTicketTypeIds ?? []).includes(t.value)
                                      )
                                    }
                                    options={dashboard?.allMasterTicketType}
                                    onChange={(items = []) =>
                                      setFieldValue(
                                        "taskTicketTypeIds",
                                        items.map((i) => i.value)
                                      )
                                    }
                                  />
                                </div>



                                <div className="col-span-2">
                                  <MultiSelect
                                    name="taskTicketStatusIds"
                                    label="Ticket Status"
                                    disabled={!values.isEnable_via_task_assignment}
                                    value={ticketStatusOptions.filter(t =>
                                      values.taskTicketStatusIds?.includes(t.value)
                                    )}
                                    options={ticketStatusOptions}
                                    onChange={(items = []) =>
                                      setFieldValue(
                                        "taskTicketStatusIds",
                                        items.map((i) => i.value)
                                      )
                                    }
                                  />
                                </div>


                              </div>



                              <div className="grid grid-cols-8 gap-x-3 gap-y-1 mt-3">
                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="istTcketTypeTicket"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_assignment}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("istTcketTypeTicket", !values?.istTcketTypeTicket)
                                        setFieldValue("isEmpTicketTypeTicket", false)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectEmployee", false)


                                        setFieldValue("isProjectTicket", false)
                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.istTcketTypeTicket}
                                      checked={values.istTcketTypeTicket}
                                    />
                                    <span>Ticket Type Wise, Ticket Wise</span>
                                  </label>
                                </div>


                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isEmpTicketTypeTicket"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_assignment}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isEmpTicketTypeTicket", !values?.isEmpTicketTypeTicket)
                                        setFieldValue("isTicketTypeEmp", false)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("istTcketTypeTicket", false)

                                        setFieldValue("isProjectTicket", false)
                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isEmpTicketTypeTicket}
                                      checked={values.isEmpTicketTypeTicket}
                                    />
                                    <span>Employee Wise, Ticket Type Wise, Ticket Wise </span>
                                  </label>
                                </div>



                                <div className="col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      className="mr-1"
                                      name="isTicketTypeEmp"
                                      type="checkbox"
                                      disabled={!values.isEnable_via_task_assignment}
                                      onChange={() => {
                                        setFieldValue("isProjectWise", false)
                                        setFieldValue("isTicketTypeEmp", !values?.isTicketTypeEmp)
                                        setFieldValue("isEmployeeWise", false)
                                        setFieldValue("isEmployeeProject", false)
                                        setFieldValue("isEmployeeProjectTicket", false)
                                        setFieldValue("isProjectEmployee", false)
                                        setFieldValue("istTcketTypeTicket", false)
                                        setFieldValue("isEmpTicketTypeTicket", false)
                                        setFieldValue("isProjectTicket", false)



                                      }
                                      }
                                      onBlur={handleBlur}
                                      value={values.isTicketTypeEmp}
                                      checked={values.isTicketTypeEmp}
                                    />
                                    <span>Ticket Type, Employee Wise </span>
                                  </label>
                                </div>
                              </div>



                            </>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </>

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
                                // setFieldValue("to_date", date); // Sync from_date and to_date
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

                              maxDate={
                                values?.from_date
                                  ? values.isDays
                                    ? new Date(
                                      new Date(values.from_date).setMonth(
                                        new Date(values.from_date).getMonth() + 12
                                      )
                                    )
                                    : values.isWeekDays
                                      ? new Date(
                                        new Date(values.from_date).setMonth(
                                          new Date(values.from_date).getMonth() + 12
                                        )
                                      )
                                      : values.isMonthDays
                                        ? new Date(
                                          new Date(values.from_date).setMonth(
                                            new Date(values.from_date).getMonth() + 36
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
                              value={dashboard?.facilitatorEmployeeList.filter(t =>
                                values.employeeId?.includes(t.value)
                              )}
                              options={dashboard?.facilitatorEmployeeList}
                              onChange={(items = []) =>
                                setFieldValue(
                                  "employeeId",
                                  items.map((i) => i.value)
                                )
                              }
                            />
                          </div>



                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 mt-3">

                          <div className="col-span-1">
                            <label className="flex items-center">
                              <input
                                className="mr-1"
                                name="isDays"
                                type="checkbox"
                                disabled={values.isEnable_via_task_assignment_emp_logtime_summary}

                                onChange={() => {
                                  setFieldValue("isDays", !values?.isDays)
                                  setFieldValue("isWeekDays", false)
                                  setFieldValue("isMonthDays", false)
                                  // setFieldValue("to_date", null)
                                  // setFieldValue("from_date", null)

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
                                disabled={values.isEnable_via_task_assignment_emp_logtime_summary}
                                onChange={() => {
                                  setFieldValue("isWeekDays", !values?.isWeekDays)
                                  setFieldValue("isMonthDays", false)
                                  setFieldValue("isDays", false)
                                  // setFieldValue("to_date", null)
                                  // setFieldValue("from_date", null)

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
                                disabled={values.isEnable_via_task_assignment_emp_logtime_summary}
                                onChange={() => {

                                  setFieldValue("isMonthDays", !values?.isMonthDays)
                                  setFieldValue("isWeekDays", false)
                                  setFieldValue("isDays", false)
                                  // setFieldValue("to_date", null)
                                  // setFieldValue("from_date", null)

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



                    </div>


                    <div className="grid grid-cols-1 gap-x-3 gap-y-1 ">

                      {/* <div className="">
                        <h6 className="font-bold mb-0 text-primary my-2">
                          Employee Productivity Summary
                        </h6>

                        <div className="d-flex justify-content-end">

                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                const formattedValues = {
                                  ...values,
                                  from_date: formatDates(values?.from_date, "yyyy-MM-dd"),
                                  to_date: formatDates(values?.to_date, "yyyy-MM-dd"),

                                };

                                getSummaryReportByFilters(formattedValues);
                              }
                            }}
                            disabled={pdfLoading || !values.from_date || !values.to_date || (!values.isEnable_via_task_project && !values.isEnable_via_task_assignment)}
                            className={`btn btn-primary btn-elevate h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Generate Summary Report

                            <Download className="w-4 h-4 ml-2" />
                            {pdf && (
                              <span className="ml-3 mr-3 spinner spinner-white"></span>
                            )}
                          </button>


                        </div>



                      </div> */}



                    </div>

                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>

              <div>
                <div className="col-span-2 mt-3">
                  <input
                    name="isEnable_via_task_assignment_emp_logtime_summary"
                    type="checkbox"
                    className="relative top-1"
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFieldValue("isDays", false)
                      setFieldValue("isWeekDays", false)
                      setFieldValue("isMonthDays", false)
                      clearFields(["projectId", "projectTicketDescription",], setFieldValue);
                      setFieldValue("isEnable_via_task_project", false);
                      setFieldValue("isEnable_via_task_assignment", false);
                      setFieldValue("isEnable_via_task_assignment_emp_logtime_summary", true);
                      setFieldValue('ticketStatusIds', [])
                      setFieldValue('ticketTypeIds', [])

                      clearFields(["taskTicketDescription"], setFieldValue);
                      // setFieldValue("taskTicketStatusIds", [])
                      // setFieldValue("taskTicketTypeIds", [])


                      setFieldValue("isProjectWise", false)
                      setFieldValue("istTcketTypeTicket", false)
                      setFieldValue("isEmpTicketTypeTicket", false)
                      setFieldValue("isTicketTypeEmp", false)
                      setFieldValue("isEmployeeWise", false)
                      setFieldValue("isEmployeeProject", false)
                      setFieldValue("isEmployeeProjectTicket", false)
                      setFieldValue("isProjectEmployee", false)
                      setFieldValue("isProjectTicket", false)

                      clearFields(["taskTicketDescription"], setFieldValue);
                      setFieldValue("taskTicketStatusIds", [])
                      setFieldValue("taskTicketTypeIds", [])
                      setFieldValue("isEnable_via_task_assignment", false);

                      clearFields(["projectId", "projectTicketDescription",], setFieldValue);



                      setFieldValue("istTcketTypeTicket", false)
                      setFieldValue("isTicketTypeEmp", false)
                      setFieldValue("isEmpTicketTypeTicket", false)


                      setFieldValue("isProjectWise", false)
                      setFieldValue("istTcketTypeTicket", false)
                      setFieldValue("isEmpTicketTypeTicket", false)
                      setFieldValue("isTicketTypeEmp", false)
                      setFieldValue("isEmployeeWise", false)
                      setFieldValue("isEmployeeProject", false)
                      setFieldValue("isEmployeeProjectTicket", false)
                      setFieldValue("isProjectEmployee", false)
                      setFieldValue("isProjectTicket", false)


                      handleChange(e); // Trigger the form change handler

                    }}
                    onBlur={handleBlur}
                    value={values.isEnable_via_task_assignment_emp_logtime_summary}
                    checked={values.isEnable_via_task_assignment_emp_logtime_summary}

                  />
                  <label>
                    &nbsp;<span>Employee Logtime Summary</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    applyFilter(initialFilter.filter);
                    handleReset();
                  }}
                  className="btn btn-light mr-1"
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
                      if (values.isEnable_via_task_assignment_emp_logtime_summary) {
                        getSummaryReportByFilters(formattedValues);
                      } else {
                        getTicketReportByFilters(formattedValues);
                      }


                    }
                  }}
                  disabled={pdfLoading || !values.from_date || !values.to_date || (!values.isEnable_via_task_project && !values.isEnable_via_task_assignment && !values.isEnable_via_task_assignment_emp_logtime_summary)}
                  className={`btn btn-primary btn-elevate h-9  mr-1  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate h-9 opacity-50 cursor-not-allowed" : ""
                    }`}

                  type="button"

                >
                  Generate Report

                  <Download className="w-4 h-4 ml-2" />
                  {pdf && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!pdfLoading) {
                      const formattedValues = {
                        ...values,
                        from_date: formatDates(values?.from_date, "yyyy-MM-dd"),
                        to_date: formatDates(values?.to_date, "yyyy-MM-dd"),

                      };

                      if (values.isEnable_via_task_assignment_emp_logtime_summary) {
                        getPreviewSummaryReportByFilters(formattedValues);
                      }
                      else {
                        getPreviewReportByFilters(formattedValues);
                      }


                    }
                  }}
                  disabled={pdfLoading || !values.from_date || !values.to_date || (!values.isEnable_via_task_project && !values.isEnable_via_task_assignment && !values.isEnable_via_task_assignment_emp_logtime_summary)}
                  className={`btn btn-primary btn-elevate h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate h-9 opacity-50 cursor-not-allowed" : ""
                    }`}

                  type="button"

                >
                  Preview Time Logs

                  {/* <Download className="w-4 h-4 ml-2" /> */}
                  {pdf && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
              {/* </div> */}




            </Modal.Footer>
          </>
        )}
      </Formik >

      <FormPreview data={previewData} />
      <EmployeeLogTimeSummaryPreview
        data={previewSummaryData}
        fromDate={previewSummaryFromDate}
        toDate={previewSummaryToDate}
      />

      <br />
      <br />

    </>
  );
}
